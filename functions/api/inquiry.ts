// ===== PARTNERSHIP INQUIRY ENDPOINT =====
// Two independent recipients come out of one submission:
//   1. the team, notified through Web3Forms;
//   2. the prospect, who gets the partnership package through Resend.
// They are fired in parallel and settled independently on purpose — a Web3Forms
// outage must not cost the prospect their package, and a Resend outage must not
// cost the team the lead. Only a double failure is an error worth showing.
//
// The package travels as a LINK, not an attachment: the PDF is several MB and
// corporate mail gateways strip or bounce attachments that size.

/** Public path of the partnership package, served straight out of `public/`. */
const PDF_PATH = '/partnership-package.pdf';

/** Where the package lives when nothing else is known. */
const PRODUCTION_ORIGIN = 'https://teamcanadaicc.ca';

/**
 * The download link must not be built from the Host header alone. `request.url`
 * reflects whatever Host arrived, so a forged one would put an attacker's URL
 * inside an email carrying our own DKIM signature. Preview deploys and local
 * dev still need to link to their own copy of the PDF, so those hosts are
 * allowed to self-reference and everything else falls back to production.
 */
const resolveOrigin = (env: Env, request: Request): string => {
  if (env.SITE_ORIGIN) return env.SITE_ORIGIN.replace(/\/+$/, '');

  const { origin, hostname, protocol } = new URL(request.url);
  const selfReferencing =
    (protocol === 'https:' && hostname.endsWith('.pages.dev')) ||
    hostname === 'localhost' ||
    hostname === '127.0.0.1';

  return selfReferencing ? origin : PRODUCTION_ORIGIN;
};

/**
 * Deliberately strict about shape rather than clever about RFC 5322: the value
 * is handed to Resend as a recipient, so a comma, semicolon or space slipping
 * through could fan one submission out to several addresses.
 */
const EMAIL_RE = /^[^\s@,;<>"]+@[^\s@,;<>"]+\.[A-Za-z]{2,}$/;

/** Overridable so a preview deploy can send from a throwaway sender. */
const DEFAULT_FROM = 'Team Canada ICC <partnerships@send.teamcanadaicc.ca>';
const DEFAULT_REPLY_TO = 'partnerships@teamcanadaicc.ca';

/** Everything arrives from the client, so nothing is trusted to be a string. */
interface InquiryBody {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  tier?: unknown;
  message?: unknown;
  lang?: unknown;
  'cf-turnstile-response'?: unknown;
  privacy_consent?: unknown;
}

interface Env {
  WEB3FORMS_API_KEY: string;
  TURNSTILE_SECRET: string;
  RESEND_API_KEY: string;
  SITE_ORIGIN?: string;
  MOCK_INTEGRATIONS?: string;
  RESEND_FROM?: string;
  RESEND_REPLY_TO?: string;
}

/**
 * Preview-only stand-in for the two mail providers, so the funnel can be walked
 * end to end without third-party keys and without mailing real people.
 *
 * Opt-in and fail-closed: it takes effect only when MOCK_INTEGRATIONS is
 * exactly 'true', set by hand in the Pages *Preview* environment. Deliberately
 * not inferred from the hostname -- production is served from *.pages.dev too,
 * so host sniffing is the one heuristic guaranteed to eventually misfire in
 * production.
 *
 * Turnstile is never mocked. The bot check is the last thing worth faking, and
 * its secret costs nothing to set.
 */
const isMocking = (env: Env) => env.MOCK_INTEGRATIONS === 'true';

/** The prospect's name is the only user input echoed into the email body. */
const escapeHtml = (val: string) =>
  val
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const copy = {
  en: {
    subject: 'Your Team Canada ICC partnership package',
    greeting: (name: string) => `Hi ${name},`,
    intro:
      'Thank you for your interest in partnering with Team Canada as we return to the International Catering Cup in Lyon. The full partnership package — every tier, the complete benefit list and the rates — is ready for you below.',
    cta: 'Download the partnership package',
    fallback: 'If the button does not work, copy this link into your browser:',
    closing:
      'Have a question, or want to talk a tier through? Simply reply to this message and it reaches us directly.',
    signature: 'Team Canada ICC',
    footer:
      'You are receiving this email because you requested the partnership package at teamcanadaicc.ca.',
  },
  fr: {
    subject: 'Votre dossier de partenariat Équipe Canada ICC',
    greeting: (name: string) => `Bonjour ${name},`,
    intro:
      "Merci de l'intérêt que vous portez à un partenariat avec Équipe Canada, alors que nous retournons à l'International Catering Cup à Lyon. Le dossier de partenariat complet — tous les niveaux, la liste intégrale des avantages et les tarifs — vous attend ci-dessous.",
    cta: 'Télécharger le dossier de partenariat',
    fallback: 'Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :',
    closing:
      'Une question, ou envie de discuter d’un niveau en particulier ? Répondez simplement à ce message, il nous parvient directement.',
    signature: 'Équipe Canada ICC',
    footer:
      'Vous recevez ce courriel parce que vous avez demandé le dossier de partenariat sur teamcanadaicc.ca.',
  },
} as const;

const buildEmail = (lang: 'en' | 'fr', name: string, pdfUrl: string) => {
  const t = copy[lang];
  const safeName = escapeHtml(name);

  const html = `<!doctype html>
<html lang="${lang}">
<body style="margin:0;padding:0;background-color:#f4efea;">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;font-family:Georgia,'Times New Roman',serif;color:#0f1115;line-height:1.6;font-size:16px;">
    <p style="margin:0 0 4px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#7a5f2a;">Team Canada · ICC · Lyon 2027</p>
    <hr style="border:0;border-top:2px solid #c2a15c;margin:0 0 24px;">
    <p style="margin:0 0 16px;">${t.greeting(safeName)}</p>
    <p style="margin:0 0 24px;">${t.intro}</p>
    <p style="margin:0 0 24px;">
      <a href="${pdfUrl}" style="display:inline-block;background-color:#c2a15c;color:#0f1115;font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:bold;text-decoration:none;padding:14px 28px;border-radius:4px;">${t.cta}</a>
    </p>
    <p style="margin:0 0 24px;font-size:13px;color:#5a5a5a;">${t.fallback}<br>
      <a href="${pdfUrl}" style="color:#7a5f2a;">${pdfUrl}</a>
    </p>
    <p style="margin:0 0 24px;">${t.closing}</p>
    <p style="margin:0 0 32px;">${t.signature}</p>
    <hr style="border:0;border-top:1px solid #ddd6cd;margin:0 0 12px;">
    <p style="margin:0;font-size:12px;color:#7a7a7a;">${t.footer}</p>
  </div>
</body>
</html>`;

  // A text part is not optional — html-only mail gets scored down by filters.
  const text = [
    t.greeting(name),
    '',
    t.intro,
    '',
    `${t.cta}: ${pdfUrl}`,
    '',
    t.closing,
    '',
    t.signature,
    '',
    '—',
    t.footer,
  ].join('\n');

  return { subject: t.subject, html, text };
};

/** Notifies the team. Resolves false (never throws) when it cannot be done. */
const notifyTeam = async (
  env: Env,
  fields: { name: string; email: string; company: string; tier: string; message: string }
): Promise<boolean> => {
  if (isMocking(env)) {
    console.log('[mock] team notification not sent:', JSON.stringify({
      name: fields.name, email: fields.email, company: fields.company, tier: fields.tier,
    }));
    return true;
  }

  if (!env.WEB3FORMS_API_KEY) {
    console.error('WEB3FORMS_API_KEY is not configured — team notification skipped');
    return false;
  }

  const payload = new URLSearchParams({
    access_key: env.WEB3FORMS_API_KEY,
    subject: `Team Canada Partnership Inquiry — ${fields.name}`,
    from_name: fields.name,
    replyto: fields.email,
    botcheck: '',
    name: fields.name,
    email: fields.email,
    company: fields.company,
    tier: fields.tier || 'Not specified',
    message: fields.message || 'No message provided',
  });

  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: payload.toString(),
  });

  const result: { success: boolean; message: string } = await response.json();
  if (!result.success) {
    console.error('web3forms error:', result.message);
    return false;
  }
  return true;
};

/** Sends the package to the prospect. Resolves false rather than throwing. */
const sendPackage = async (
  env: Env,
  opts: { name: string; email: string; lang: 'en' | 'fr'; pdfUrl: string }
): Promise<boolean> => {
  if (isMocking(env)) {
    console.log('[mock] package email not sent:', JSON.stringify({
      to: opts.email, lang: opts.lang, subject: copy[opts.lang].subject, pdfUrl: opts.pdfUrl,
    }));
    return true;
  }

  if (!env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured — package email skipped');
    return false;
  }

  const { subject, html, text } = buildEmail(opts.lang, opts.name, opts.pdfUrl);

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.RESEND_FROM || DEFAULT_FROM,
      reply_to: env.RESEND_REPLY_TO || DEFAULT_REPLY_TO,
      to: [opts.email],
      subject,
      html,
      text,
    }),
  });

  if (!response.ok) {
    console.error('resend error:', response.status, await response.text());
    return false;
  }
  return true;
};

/** Shown to visitors when something fails; kept in step with src/consts.ts. */
const PHONE = '514-573-6758';

/** Must match data-action on the widget in src/components/InquiryForm.astro. */
const TURNSTILE_ACTION = 'turnstile-spin-v2';

/** Cloudflare's always-pass test secret reports this hostname. */
const TURNSTILE_TEST_HOSTNAME = 'example.com';

const LIMITS = {
  name: 100,
  company: 200,
  tier: 100,
  message: 2000,
} as const;

/**
 * Submissions per window. The form mails a DKIM-signed message to whatever
 * address it is given, so without a ceiling it is a free relay for mail
 * bombing a third party from our domain — Turnstile alone only proves a
 * human solved one challenge.
 */
const RATE_LIMITS = {
  perIp: { limit: 5, windowSeconds: 60 * 60 },
  perRecipient: { limit: 3, windowSeconds: 24 * 60 * 60 },
} as const;

/** A name is echoed into the email, so it must not be able to carry a link. */
const LINK_RE = /https?:|www\.|\/\//i;

const messages = {
  en: {
    security: 'Please complete the security check.',
    securityFailed: 'Security check failed. Please try again.',
    notConfigured: `Form service is not configured. Please contact the team directly at ${PHONE}.`,
    consent: 'You must agree to the Privacy Notice before submitting your inquiry.',
    name: 'Please enter your full name (100 characters at most, no links).',
    email: 'A valid email address is required.',
    rateLimited: `Too many requests. Please try again later or contact us directly at ${PHONE}.`,
    failed: `Your inquiry could not be sent. Please try again or contact us directly at ${PHONE}.`,
    unexpected: `An unexpected error occurred. Please try again or contact us directly at ${PHONE}.`,
  },
  fr: {
    security: 'Veuillez compléter la vérification de sécurité.',
    securityFailed: 'La vérification de sécurité a échoué. Veuillez réessayer.',
    notConfigured: `Le formulaire n'est pas configuré. Veuillez joindre l'équipe directement au ${PHONE}.`,
    consent: "Vous devez accepter l'avis de confidentialité avant de soumettre votre demande.",
    name: 'Veuillez entrer votre nom complet (100 caractères au plus, sans lien).',
    email: 'Une adresse courriel valide est requise.',
    rateLimited: `Trop de demandes. Veuillez réessayer plus tard ou nous joindre directement au ${PHONE}.`,
    failed: `Votre demande n'a pas pu être envoyée. Veuillez réessayer ou nous joindre directement au ${PHONE}.`,
    unexpected: `Une erreur inattendue est survenue. Veuillez réessayer ou nous joindre directement au ${PHONE}.`,
  },
} as const;

type Lang = keyof typeof messages;

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

/** Control characters out (a newline in a name could split a mail header), trimmed, capped. */
const clean = (val: unknown, max: number): string =>
  typeof val === 'string' ? val.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max) : '';

const sha256 = async (val: string) => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(val));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Counts a hit against `key` and reports whether it is still within `limit`.
 * Backed by the Workers Cache API: it needs no binding, but counts are per
 * data centre and best-effort, which is enough to stop a script hammering one
 * address. Keys are hashed so no IP or email address sits in the cache. Where
 * no cache exists (unit tests, some local runs) it allows.
 */
const withinLimit = async (
  origin: string,
  key: string,
  { limit, windowSeconds }: { limit: number; windowSeconds: number }
): Promise<boolean> => {
  const cache = (globalThis as { caches?: { default?: Cache } }).caches?.default;
  if (!cache) return true;

  const slot = new Request(`${origin}/__rate-limit/${await sha256(key)}`);
  const hit = await cache.match(slot);
  const count = hit ? Number.parseInt(await hit.text(), 10) || 0 : 0;
  if (count >= limit) return false;

  await cache.put(
    slot,
    new Response(String(count + 1), { headers: { 'Cache-Control': `max-age=${windowSeconds}` } })
  );
  return true;
};

/**
 * Same-origin only: the form posts from this site, so there are no CORS
 * headers and no OPTIONS handler — a cross-origin page cannot read the
 * response, and its preflight finds nothing to approve.
 */
export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  let lang: Lang = 'en';
  try {
    const body: InquiryBody = await request.json();
    lang = body.lang === 'fr' ? 'fr' : 'en';
    const t = messages[lang];
    const { origin, hostname } = new URL(request.url);
    const ip = request.headers.get('CF-Connecting-IP') || '';

    if (ip && !(await withinLimit(origin, `ip:${ip}`, RATE_LIMITS.perIp))) {
      return json({ success: false, message: t.rateLimited }, 429);
    }

    const turnstileToken = body['cf-turnstile-response'];
    if (typeof turnstileToken !== 'string' || !turnstileToken) {
      return json({ success: false, message: t.security }, 400);
    }

    // Guarded like the other two credentials: without it every submission
    // fails the security check with no indication of why.
    if (!env.TURNSTILE_SECRET) {
      console.error('TURNSTILE_SECRET is not configured -- every submission will fail the security check');
      return json({ success: false, message: t.notConfigured }, 500);
    }

    const turnstileResult = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: turnstileToken, remoteip: ip }),
    });

    const turnstileData: {
      success: boolean;
      action?: string;
      hostname?: string;
      'error-codes'?: string[];
    } = await turnstileResult.json();

    // A token only vouches for the widget and site it was issued to: one minted
    // by another widget on the same key, or on another host, is not ours.
    const wrongAction = !!turnstileData.action && turnstileData.action !== TURNSTILE_ACTION;
    const wrongHost =
      !!turnstileData.hostname &&
      turnstileData.hostname !== hostname &&
      turnstileData.hostname !== TURNSTILE_TEST_HOSTNAME;

    if (!turnstileData.success || wrongAction || wrongHost) {
      // siteverify names the cause -- invalid-input-secret, timeout-or-duplicate,
      // invalid-input-response -- and without it a 403 is undiagnosable.
      console.error(
        'turnstile rejected:',
        turnstileData['error-codes']?.join(', ') || 'no error codes returned',
        wrongAction ? `action=${turnstileData.action}` : '',
        wrongHost ? `hostname=${turnstileData.hostname}` : ''
      );
      return json({ success: false, message: t.securityFailed }, 403);
    }

    // Consent is required under PIPEDA / Quebec Law 25.
    if (body.privacy_consent !== 'on') {
      return json({ success: false, message: t.consent }, 400);
    }

    // Over-long names are refused rather than silently cut.
    const rawName = typeof body.name === 'string' ? body.name : '';
    const name = clean(rawName, LIMITS.name);
    if (!name || rawName.trim().length > LIMITS.name || LINK_RE.test(name)) {
      return json({ success: false, message: t.name }, 400);
    }

    // Length is checked first so a pathological value never reaches the regex.
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    if (!email || email.length > 320 || !EMAIL_RE.test(email)) {
      return json({ success: false, message: t.email }, 400);
    }

    if (!(await withinLimit(origin, `to:${email.toLowerCase()}`, RATE_LIMITS.perRecipient))) {
      return json({ success: false, message: t.rateLimited }, 429);
    }

    const company = clean(body.company, LIMITS.company);
    const tier = clean(body.tier, LIMITS.tier);
    // The message keeps its line breaks; it only ever goes to the team.
    const message =
      typeof body.message === 'string'
        ? body.message.replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, ' ').trim().slice(0, LIMITS.message)
        : '';

    const pdfUrl = resolveOrigin(env, request) + PDF_PATH;

    const [teamOutcome, packageOutcome] = await Promise.allSettled([
      notifyTeam(env, { name, email, company, tier, message }),
      sendPackage(env, { name, email, lang, pdfUrl }),
    ]);

    if (teamOutcome.status === 'rejected') {
      console.error('team notification threw:', teamOutcome.reason);
    }
    if (packageOutcome.status === 'rejected') {
      console.error('package email threw:', packageOutcome.reason);
    }

    const notified = teamOutcome.status === 'fulfilled' && teamOutcome.value;
    const emailed = packageOutcome.status === 'fulfilled' && packageOutcome.value;

    // The page always offers the download, so a failed email is not a failed
    // submission — only losing both recipients is.
    if (!notified && !emailed) {
      return json({ success: false, message: t.failed }, 502);
    }

    return json({ success: true, emailed, mocked: isMocking(env), download: PDF_PATH }, 200);
  } catch (err) {
    console.error('Inquiry handler error:', err);
    return json({ success: false, message: messages[lang].unexpected }, 500);
  }
};
