import { Resend } from 'resend';

// Resend's emails.send() does NOT throw when sending fails. It returns { data, error }.
// The old code never checked `error`, so failed emails (unverified domain, bad API key,
// wrong "from" address) disappeared silently. This helper checks and logs it.

export type SendResult = { ok: boolean; error?: string };

// Sender address, in order of preference:
// 1. RESEND_FROM_EMAIL if set explicitly
// 2. an address on RESEND_EMAIL_DOMAIN (set automatically by the Vercel Resend integration;
//    this is the domain the connected Resend account is actually allowed to send from)
// 3. booking@thecricketadvisor.com (only works if that domain is verified in Resend)
export const getFromEmail = (): string => {
  const explicit = process.env.RESEND_FROM_EMAIL?.trim();
  if (explicit) return explicit;
  const domain = process.env.RESEND_EMAIL_DOMAIN?.trim().replace(/^@/, '');
  if (domain) return `booking@${domain}`;
  return 'booking@thecricketadvisor.com';
};

export const getFromAddress = () => `The Cricket Advisor <${getFromEmail()}>`;

export const getFromAddress = () => `The Cricket Advisor <${getFromEmail()}>`;

export const getAdminNotifyEmails = (): string[] =>
  (process.env.ADMIN_NOTIFY_EMAIL || 'thecricketadvisor@gmail.com')
    .split(',')
    .map(e => e.trim())
    .filter(Boolean);

export const sendEmail = async (opts: { to: string | string[]; subject: string; html: string }): Promise<SendResult> => {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.error('[Email] RESEND_API_KEY is not set in Vercel environment variables. Email not sent:', opts.subject);
    return { ok: false, error: 'Email service is not configured (RESEND_API_KEY missing)' };
  }
  try {
    const resend = new Resend(apiKey);
    const result: any = await resend.emails.send({
      from: getFromAddress(),
      to: opts.to,
      subject: opts.subject,
      html: opts.html
    });
    if (result?.error) {
      console.error('[Email] Resend rejected the email:', opts.subject, JSON.stringify(result.error));
      return { ok: false, error: result.error.message || 'Email provider rejected the message' };
    }
    console.log('[Email] Sent:', opts.subject, 'id:', result?.data?.id);
    return { ok: true };
  } catch (err: any) {
    console.error('[Email] Failed to send:', opts.subject, err);
    return { ok: false, error: err?.message || 'Email sending failed' };
  }
};

const esc = (v: any) => String(v ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));

// Simple admin notification email with a details table
export const notifyAdmin = async (subject: string, heading: string, rows: Record<string, any>): Promise<SendResult> => {
  const tableRows = Object.entries(rows)
    .map(([k, v]) => `<tr><td style="color:#64748b;padding:4px 12px 4px 0;">${esc(k)}</td><td style="font-weight:bold;padding:4px 0;">${esc(v) || '-'}</td></tr>`)
    .join('');
  const html = `
    <div style="font-family: Arial, sans-serif; color:#333; max-width:600px; margin:0 auto; border:1px solid #e0e0e0; border-radius:8px; overflow:hidden;">
      <div style="background-color:#0b1a30; padding:16px 20px; color:#fff;">
        <h3 style="margin:0;">${esc(heading)}</h3>
        <p style="margin:4px 0 0 0; font-size:12px; color:#cbd5e1;">The Cricket Advisor · Admin notification</p>
      </div>
      <div style="padding:20px; font-size:13px;">
        <table style="border-collapse:collapse;">${tableRows}</table>
        <p style="margin-top:20px; font-size:12px; color:#64748b;">View all players in the Admin dashboard &gt; Cricket CVs &gt; Registered Players.</p>
      </div>
    </div>`;
  return sendEmail({ to: getAdminNotifyEmails(), subject, html });
};
