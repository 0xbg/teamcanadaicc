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

interface InquiryBody {
  name: string;
  email: string;
  company?: string;
  tier?: string;
  message?: string;
  lang?: string;
  'cf-turnstile-response'?: string;
  privacy_consent?: string | boolean;
}

interface Env {
  WEB3FORMS_API_KEY: string;
  TURNSTILE_SECRET: string;
  RESEND_API_KEY: string;
  SITE_ORIGIN?: string;
  RESEND_FROM?: string;
  RESEND_REPLY_TO?: string;
}

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

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  try {
    const body: InquiryBody = await request.json();
    const { name, email, company, tier, message } = body;

    // Validate Turnstile token
    const turnstileToken = body['cf-turnstile-response'];
    if (!turnstileToken) {
      return new Response(
        JSON.stringify({ success: false, message: 'Please complete the security check.' }),
        { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
      );
    }

    const turnstileResult = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET,
        response: turnstileToken,
        remoteip: request.headers.get('CF-Connecting-IP') || '',
      }),
    });

    const turnstileData: { success: boolean } = await turnstileResult.json();
    if (!turnstileData.success) {
      return new Response(
        JSON.stringify({ success: false, message: 'Security check failed. Please try again.' }),
        { status: 403, headers: { ...headers, 'Content-Type': 'application/json' } }
      );
    }

    // Validate consent (required under PIPEDA / Quebec Law 25)
    if (!body.privacy_consent || body.privacy_consent !== 'on') {
      return new Response(
        JSON.stringify({ success: false, message: 'You must agree to the Privacy Notice before submitting your inquiry.' }),
        { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
      );
    }

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: 'Full name is required.' }),
        { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
      );
    }

    // Length is checked first so a pathological value never reaches the regex.
    if (!email || typeof email !== 'string' || email.length > 320 || !EMAIL_RE.test(email.trim())) {
      return new Response(
        JSON.stringify({ success: false, message: 'A valid email address is required.' }),
        { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize inputs
    const sanitize = (val: string) => val.trim().slice(0, 1000);
    const safeName = sanitize(name);
    const safeEmail = sanitize(email);
    const safeCompany = company ? sanitize(company) : '';
    const safeTier = tier ? sanitize(tier) : '';
    const safeMessage = message ? sanitize(message) : '';
    const lang = body.lang && sanitize(body.lang) === 'fr' ? 'fr' : 'en';

    const pdfUrl = resolveOrigin(env, request) + PDF_PATH;

    const [teamOutcome, packageOutcome] = await Promise.allSettled([
      notifyTeam(env, {
        name: safeName,
        email: safeEmail,
        company: safeCompany,
        tier: safeTier,
        message: safeMessage,
      }),
      sendPackage(env, { name: safeName, email: safeEmail, lang, pdfUrl }),
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
      return new Response(
        JSON.stringify({ success: false, message: 'Your inquiry could not be sent. Please try again or contact us directly at 514-573-6758.' }),
        { status: 502, headers: { ...headers, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, emailed, download: PDF_PATH }),
      { status: 200, headers: { ...headers, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Inquiry handler error:', err);
    return new Response(
      JSON.stringify({ success: false, message: 'An unexpected error occurred. Please try again or contact us directly at 514-573-6758.' }),
      { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } }
    );
  }
};
