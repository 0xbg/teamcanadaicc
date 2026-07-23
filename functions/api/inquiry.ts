interface InquiryBody {
  name: string;
  email: string;
  company?: string;
  tier?: string;
  message?: string;
  'cf-turnstile-response'?: string;
}

interface Env {
  WEB3FORMS_API_KEY: string;
  TURNSTILE_SECRET: string;
}

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

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: 'Full name is required.' }),
        { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
      );
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
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

    if (!env.WEB3FORMS_API_KEY) {
      console.error('WEB3FORMS_API_KEY is not configured');
      return new Response(
        JSON.stringify({ success: false, message: 'Form service is not configured. Please contact the team directly at 514-573-6758.' }),
        { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } }
      );
    }

    // Build the message for web3forms
    const web3formsPayload = new URLSearchParams({
      access_key: env.WEB3FORMS_API_KEY,
      subject: `Team Canada Partnership Inquiry — ${safeName}`,
      from_name: safeName,
      replyto: safeEmail,
      botcheck: '',
      name: safeName,
      email: safeEmail,
      company: safeCompany,
      tier: safeTier || 'Not specified',
      message: safeMessage || 'No message provided',
    });

    const web3formsResponse = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: web3formsPayload.toString(),
    });

    const result: { success: boolean; message: string } = await web3formsResponse.json();

    if (result.success) {
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...headers, 'Content-Type': 'application/json' } }
      );
    }

    console.error('web3forms error:', result.message);
    return new Response(
      JSON.stringify({ success: false, message: 'Your inquiry could not be sent. Please try again or contact us directly at 514-573-6758.' }),
      { status: 502, headers: { ...headers, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Inquiry handler error:', err);
    return new Response(
      JSON.stringify({ success: false, message: 'An unexpected error occurred. Please try again or contact us directly at 514-573-6758.' }),
      { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } }
    );
  }
};