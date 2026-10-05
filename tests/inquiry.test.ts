import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { onRequestPost } from '../functions/api/inquiry';

type Env = Parameters<typeof onRequestPost>[0]['env'];

// Random per run: the providers are mocked, so the handler only needs the
// credentials to be present, and nothing credential-shaped sits in the source.
const baseEnv: Env = {
  WEB3FORMS_API_KEY: crypto.randomUUID(),
  TURNSTILE_SECRET: crypto.randomUUID(),
  RESEND_API_KEY: crypto.randomUUID(),
};

/** RFC 2606 reserved domain: addresses on it can never reach a real inbox. */
const TEST_DOMAIN = 'example.org';
const testAddress = (local: string) => `${local}@${TEST_DOMAIN}`;

const validBody = {
  name: 'Jane Partner',
  email: testAddress('jane'),
  company: 'Maple Foods',
  tier: 'Lead Partner',
  message: 'Line one\nLine two',
  lang: 'en',
  privacy_consent: 'on',
  'cf-turnstile-response': 'token',
};

const post = (body: unknown, env: Env = baseEnv, ip = '203.0.113.7') =>
  onRequestPost({
    request: new Request('https://teamcanadaicc.ca/api/inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': ip },
      body: JSON.stringify(body),
    }),
    env,
  });

type Siteverify = { success: boolean; action?: string; hostname?: string };

/** Routes each provider URL to a canned answer and records what was sent. */
function mockProviders(opts: { turnstile?: Siteverify; web3forms?: boolean; resend?: boolean } = {}) {
  const calls: Array<{ url: string; body: string }> = [];
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    calls.push({ url, body: String(init?.body ?? '') });
    if (url.includes('siteverify')) {
      return Response.json(
        opts.turnstile ?? { success: true, action: 'turnstile-spin-v2', hostname: 'teamcanadaicc.ca' }
      );
    }
    if (url.includes('web3forms')) {
      return Response.json({ success: opts.web3forms ?? true, message: 'ok' });
    }
    if (url.includes('resend')) {
      return new Response('{}', { status: (opts.resend ?? true) ? 200 : 500 });
    }
    throw new Error(`unexpected fetch ${url}`);
  });
  vi.stubGlobal('fetch', fetchMock);
  return calls;
}

/** A Map-backed stand-in for the Workers Cache API. */
function mockCache() {
  const store = new Map<string, string>();
  vi.stubGlobal('caches', {
    default: {
      match: async (req: Request) => (store.has(req.url) ? new Response(store.get(req.url)) : undefined),
      put: async (req: Request, res: Response) => void store.set(req.url, await res.text()),
    },
  });
}

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('inquiry endpoint', () => {
  it('notifies the team, emails the package, and returns the download', async () => {
    const calls = mockProviders();
    const res = await post(validBody);
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ success: true, emailed: true, download: '/partnership-package.pdf' });

    const team = calls.find((c) => c.url.includes('web3forms'))!;
    expect(new URLSearchParams(team.body).get('message')).toBe('Line one\nLine two');

    const mail = JSON.parse(calls.find((c) => c.url.includes('resend'))!.body);
    expect(mail.to).toEqual([testAddress('jane')]);
    expect(mail.html).toContain('https://teamcanadaicc.ca/partnership-package.pdf');
  });

  it('sends no CORS headers', async () => {
    mockProviders();
    const res = await post(validBody);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull();
  });

  it('answers in French when the page is French', async () => {
    mockProviders();
    const res = await post({ ...validBody, lang: 'fr', privacy_consent: undefined });
    expect(res.status).toBe(400);
    expect((await res.json()).message).toMatch(/avis de confidentialité/);
  });

  it('rejects a missing Turnstile token before calling siteverify', async () => {
    const calls = mockProviders();
    const res = await post({ ...validBody, 'cf-turnstile-response': '' });
    expect(res.status).toBe(400);
    expect(calls).toHaveLength(0);
  });

  it('rejects a token issued for another widget action', async () => {
    mockProviders({ turnstile: { success: true, action: 'other', hostname: 'teamcanadaicc.ca' } });
    expect((await post(validBody)).status).toBe(403);
  });

  it('rejects a token issued on another hostname', async () => {
    mockProviders({ turnstile: { success: true, action: 'turnstile-spin-v2', hostname: 'evil.test' } });
    expect((await post(validBody)).status).toBe(403);
  });

  it('accepts the Turnstile test-key hostname', async () => {
    mockProviders({ turnstile: { success: true, hostname: 'example.com' } });
    expect((await post(validBody)).status).toBe(200);
  });

  it.each([
    ['a link', 'Visit https://spam.test'],
    ['a bare domain', 'see www.spam.test'],
    ['more than 100 characters', 'x'.repeat(101)],
    ['only whitespace', '   '],
  ])('rejects a name with %s', async (_, name) => {
    const calls = mockProviders();
    const res = await post({ ...validBody, name });
    expect(res.status).toBe(400);
    expect(calls.some((c) => c.url.includes('resend'))).toBe(false);
  });

  it.each(['a@b.c, d@e.fr', 'no-at-sign.ca', 'a b@c.ca', 42])('rejects the email %s', async (email) => {
    mockProviders();
    expect((await post({ ...validBody, email })).status).toBe(400);
  });

  it('strips control characters from the name', async () => {
    const calls = mockProviders();
    await post({ ...validBody, name: 'Jane\r\nBcc: x@y.z' });
    const team = new URLSearchParams(calls.find((c) => c.url.includes('web3forms'))!.body);
    expect(team.get('name')).not.toMatch(/[\r\n]/);
  });

  it('escapes HTML in the name inside the package email', async () => {
    const calls = mockProviders();
    await post({ ...validBody, name: '<b>Jane</b>' });
    const mail = JSON.parse(calls.find((c) => c.url.includes('resend'))!.body);
    expect(mail.html).toContain('&lt;b&gt;Jane&lt;/b&gt;');
  });

  it('still succeeds when only one provider fails', async () => {
    mockProviders({ resend: false });
    const res = await post(validBody);
    expect(res.status).toBe(200);
    expect((await res.json()).emailed).toBe(false);
  });

  it('fails with 502 when both providers fail', async () => {
    mockProviders({ resend: false, web3forms: false });
    expect((await post(validBody)).status).toBe(502);
  });

  it('logs instead of sending when mocking is enabled', async () => {
    const calls = mockProviders();
    const res = await post(validBody, { ...baseEnv, MOCK_INTEGRATIONS: 'true' });
    expect(await res.json()).toMatchObject({ success: true, mocked: true });
    expect(calls.map((c) => c.url)).toEqual(['https://challenges.cloudflare.com/turnstile/v0/siteverify']);
  });

  it('never builds the download link from a forged host', async () => {
    const calls = mockProviders({ turnstile: { success: true } });
    await onRequestPost({
      request: new Request('https://attacker.test/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validBody),
      }),
      env: baseEnv,
    });
    const mail = JSON.parse(calls.find((c) => c.url.includes('resend'))!.body);
    expect(mail.html).toContain('https://teamcanadaicc.ca/partnership-package.pdf');
    expect(mail.html).not.toContain('attacker.test');
  });

  describe('rate limiting', () => {
    it('caps submissions per recipient', async () => {
      mockProviders();
      mockCache();
      const statuses = [];
      for (let i = 0; i < 4; i++) statuses.push((await post(validBody, baseEnv, `198.51.100.${i}`)).status);
      expect(statuses).toEqual([200, 200, 200, 429]);
    });

    it('caps submissions per IP', async () => {
      mockProviders();
      mockCache();
      const statuses = [];
      for (let i = 0; i < 6; i++) statuses.push((await post({ ...validBody, email: testAddress(`p${i}`) })).status);
      expect(statuses.slice(0, 5)).toEqual([200, 200, 200, 200, 200]);
      expect(statuses[5]).toBe(429);
    });
  });
});
