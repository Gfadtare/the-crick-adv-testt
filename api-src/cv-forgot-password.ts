import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendEmail } from './utils/send-email.js';

const LOCAL_USERS_PATH = path.join(process.cwd(), 'cv-users-db.json');

const getLocalUsers = (): any[] => {
  try {
    if (fs.existsSync(LOCAL_USERS_PATH)) {
      return JSON.parse(fs.readFileSync(LOCAL_USERS_PATH, 'utf-8'));
    }
  } catch (error) {
    console.error('Error reading local users file:', error);
  }
  return [];
};

const saveLocalUsers = (users: any[]) => {
  try {
    fs.writeFileSync(LOCAL_USERS_PATH, JSON.stringify(users, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing local users file:', error);
  }
};

const hasPostgres = () => {
  return !!(process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const sanitizedEmail = email.toLowerCase().trim();
  const resetToken = crypto.randomBytes(32).toString('hex');
  const expiryTime = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour expiry

  try {
    let userExists = false;
    let firstName = 'Player';

    if (hasPostgres()) {
      // Create column if it doesn't exist
      try {
        await sql`ALTER TABLE cv_users ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255);`;
        await sql`ALTER TABLE cv_users ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMP;`;
      } catch (err) {
        console.warn('DB alter warning:', err);
      }

      const userRes = await sql`SELECT id, first_name FROM cv_users WHERE email = ${sanitizedEmail} LIMIT 1`;
      if (userRes.rows.length > 0) {
        const userId = userRes.rows[0].id;
        firstName = userRes.rows[0].first_name || 'Player';
        await sql`UPDATE cv_users SET reset_token = ${resetToken}, reset_token_expires = ${expiryTime} WHERE id = ${userId}`;
        userExists = true;
      }
    } else {
      const users = getLocalUsers();
      const userIdx = users.findIndex((u: any) => u.email === sanitizedEmail);
      if (userIdx > -1) {
        firstName = users[userIdx].first_name || 'Player';
        users[userIdx].reset_token = resetToken;
        users[userIdx].reset_token_expires = expiryTime;
        saveLocalUsers(users);
        userExists = true;
      }
    }

    // Always send success to prevent email enumeration attacks
    if (userExists) {
      const resendApiKey = process.env.RESEND_API_KEY;
      if (resendApiKey) {
        const siteUrl = (process.env.SITE_URL || `https://${req.headers.host || 'thecricketadvisor.com'}`).replace(/\/$/, '');
        const resetLink = `${siteUrl}/#cricket-cv?reset=${resetToken}`;
        
        const htmlContent = `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #0b1a30; padding: 20px; text-align: center; color: white;">
              <h2 style="margin: 0; color: #ffffff;">Reset Your Password</h2>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #cbd5e1;">The Cricket Advisor</p>
            </div>
            <div style="padding: 25px; background-color: #ffffff; text-align: center;">
              <p>Hello ${firstName},</p>
              <p>You requested to reset your password for the Cricket CV Builder.</p>
              <p>Please click the button below to set a new password. This link is valid for 1 hour:</p>
              
              <div style="margin: 30px 0;">
                <a href="${resetLink}" style="background-color: #D4AF37; color: #0b1a30; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
              </div>

              <p style="font-size: 11px; color: #666;">If you didn't request a password reset, you can safely ignore this email.</p>
              
              <p style="margin-top: 30px; font-size: 12px; color: #64748b;">Regards,<br><strong>Team The Cricket Advisor</strong></p>
            </div>
          </div>
        `;

        await sendEmail({
          to: sanitizedEmail,
          subject: 'Reset Your Cricket CV Password',
          html: htmlContent
        });
      } else {
        console.warn('RESEND_API_KEY is not set. Reset link is: ', `https://localhost:3000/#cricket-cv?reset=${resetToken}`);
      }
    }

    return res.status(200).json({ status: 'success', message: 'If the email exists, a password reset link has been sent.' });

  } catch (error: any) {
    console.error('Password reset request error:', error);
    return res.status(500).json({ error: error.message || 'Error processing request' });
  }
}
