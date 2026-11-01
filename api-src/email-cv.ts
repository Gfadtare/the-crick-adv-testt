import { Resend } from 'resend';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, firstName, lastName, referenceNumber, pdfBase64 } = req.body;
  if (!email || !firstName || !referenceNumber || !pdfBase64) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[Resend Mailer] RESEND_API_KEY is not set. Skipping automatic CV email dispatch.');
    return res.status(200).json({ status: 'mocked', message: 'RESEND_API_KEY is not set. Simulated successful delivery.' });
  }

  const resend = new Resend(apiKey.trim());
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'booking@thecricketadvisor.com';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #0b1a30; padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0; color: #ffffff;">Your Cricket CV</h2>
        <p style="margin: 5px 0 0 0; font-size: 14px; color: #cbd5e1;">The Cricket Advisor</p>
      </div>
      <div style="padding: 25px; background-color: #ffffff;">
        <p>Dear ${firstName},</p>
        <p>Your professional Cricket CV has been successfully created.</p>
        <p>Please find your Cricket CV attached to this email.</p>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D4AF37; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
          <p style="margin: 4px 0; font-size: 13px;"><strong>CV Reference:</strong></p>
          <p style="margin: 4px 0; font-size: 16px; font-family: monospace; color: #0b1a30; font-weight: bold;">[${referenceNumber}]</p>
        </div>

        <p>You can use this CV when contacting cricket clubs, coaches, academies and cricket organisations.</p>
        
        <p style="margin-bottom: 0;">Regards,</p>
        <p style="margin-top: 5px; font-size: 14px; line-height: 1.5;">
          The Cricket Advisor<br>
          The Cricket Overseas
        </p>
      </div>
    </div>
  `;

  // Parse the base64 string.
  let cleanBase64 = pdfBase64;
  if (pdfBase64.includes('base64,')) {
    cleanBase64 = pdfBase64.split('base64,')[1];
  }

  try {
    await resend.emails.send({
      from: `The Cricket Advisor <${fromEmail}>`,
      to: email,
      subject: `Your Cricket CV — The Cricket Advisor`,
      html: htmlContent,
      attachments: [
        {
          filename: `Cricket_CV_${firstName}_${lastName || 'Player'}.pdf`,
          content: cleanBase64,
        }
      ]
    });

    console.log(`[Resend Mailer] Cricket CV successfully emailed to ${email}`);
    return res.status(200).json({ status: 'success', message: 'Email sent successfully' });
  } catch (err: any) {
    console.error('[Resend Mailer] Failed to send Cricket CV email:', err);
    return res.status(500).json({ error: err.message || 'Failed to send email' });
  }
}
