import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateSalt, hashPassword, signToken } from './utils/cv-auth.js';
import { sendEmail, notifyAdmin } from './utils/send-email.js';

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

  const { email, password, firstName, lastName, country, stateProvince, mobileNumber, nationality, dateOfBirth } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'Missing required signup parameters' });
  }

  const sanitizedEmail = email.toLowerCase().trim();
  const salt = generateSalt();
  const pwdHash = hashPassword(password, salt);
  const userId = `user_${Date.now()}`;
  const verificationToken = crypto.randomBytes(32).toString('hex');

  let isResend = false;

  try {
    // 1. Ensure Table Exists & Check Existing User
    if (hasPostgres()) {
      await sql`
        CREATE TABLE IF NOT EXISTS cv_users (
          id VARCHAR(50) PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          password_salt TEXT NOT NULL,
          first_name VARCHAR(255),
          last_name VARCHAR(255),
          country VARCHAR(255),
          state_province VARCHAR(255),
          mobile_number VARCHAR(255),
          nationality VARCHAR(255),
          date_of_birth VARCHAR(255),
          email_verified BOOLEAN DEFAULT FALSE,
          verification_token VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;

      try {
        await sql`ALTER TABLE cv_users ADD COLUMN IF NOT EXISTS nationality VARCHAR(255);`;
        await sql`ALTER TABLE cv_users ADD COLUMN IF NOT EXISTS date_of_birth VARCHAR(255);`;
        await sql`ALTER TABLE cv_users ADD COLUMN IF NOT EXISTS country VARCHAR(255);`;
        await sql`ALTER TABLE cv_users ADD COLUMN IF NOT EXISTS state_province VARCHAR(255);`;
        await sql`ALTER TABLE cv_users ADD COLUMN IF NOT EXISTS mobile_number VARCHAR(255);`;
      } catch (colErr) {
        console.error("Error migrating cv_users table schema:", colErr);
      }

      const checkUser = await sql`SELECT id, email_verified FROM cv_users WHERE email = ${sanitizedEmail} LIMIT 1`;
      if (checkUser.rows.length > 0 && checkUser.rows[0].email_verified) {
        return res.status(409).json({ error: 'An account with this email already exists. Please log in.' });
      }

      if (checkUser.rows.length > 0) {
        // Registered before but never verified (e.g. the first email never arrived).
        // Update their details and send a fresh verification link instead of blocking them.
        isResend = true;
        await sql`
          UPDATE cv_users SET
            password_hash = ${pwdHash}, password_salt = ${salt},
            first_name = ${firstName}, last_name = ${lastName},
            country = ${country || ''}, state_province = ${stateProvince || ''},
            mobile_number = ${mobileNumber || ''}, nationality = ${nationality || ''},
            date_of_birth = ${dateOfBirth || ''}, verification_token = ${verificationToken}
          WHERE email = ${sanitizedEmail}
        `;
      } else await sql`
        INSERT INTO cv_users (
          id, email, password_hash, password_salt, first_name, last_name, country, state_province, mobile_number, nationality, date_of_birth, verification_token, email_verified
        ) VALUES (
          ${userId}, ${sanitizedEmail}, ${pwdHash}, ${salt}, ${firstName}, ${lastName}, ${country || ''}, ${stateProvince || ''}, ${mobileNumber || ''}, ${nationality || ''}, ${dateOfBirth || ''}, ${verificationToken}, false
        )
      `;
    } else {
      const users = getLocalUsers();
      const existingIdx = users.findIndex((u: any) => u.email === sanitizedEmail);
      if (existingIdx > -1 && users[existingIdx].email_verified) {
        return res.status(409).json({ error: 'An account with this email already exists. Please log in.' });
      }
      if (existingIdx > -1) {
        isResend = true;
        users.splice(existingIdx, 1);
      }

      users.push({
        id: userId,
        email: sanitizedEmail,
        password_hash: pwdHash,
        password_salt: salt,
        first_name: firstName,
        last_name: lastName,
        country: country || '',
        state_province: stateProvince || '',
        mobile_number: mobileNumber || '',
        nationality: nationality || '',
        date_of_birth: dateOfBirth || '',
        email_verified: false,
        verification_token: verificationToken,
        created_at: new Date().toISOString()
      });
      saveLocalUsers(users);
    }

    // Dispatch Verification Email
    // Use the site's own domain for the link (not a Vercel preview URL)
    const siteUrl = (process.env.SITE_URL || `https://${req.headers.host || 'thecricketadvisor.com'}`).replace(/\/$/, '');
    const verifyLink = `${siteUrl}/#cricket-cv?verify=${verificationToken}`;
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #0b1a30; padding: 20px; text-align: center; color: white;">
            <h2 style="margin: 0; color: #ffffff;">Verify Your Email Address</h2>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #cbd5e1;">The Cricket Advisor</p>
          </div>
          <div style="padding: 25px; background-color: #ffffff; text-align: center;">
            <p>Hello ${firstName},</p>
            <p>Thank you for registering for the Cricket CV Builder.</p>
            <p>Please click the button below to verify your email address and activate your account:</p>
            
            <div style="margin: 30px 0;">
              <a href="${verifyLink}" style="background-color: #D4AF37; color: #0b1a30; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verify Email</a>
            </div>

            <p style="font-size: 11px; color: #666;">If you didn't create an account, you can safely ignore this email.</p>
            
            <p style="margin-top: 30px; font-size: 12px; color: #64748b;">Regards,<br><strong>Team The Cricket Advisor</strong></p>
          </div>
        </div>
      `;

    const sent = await sendEmail({
      to: sanitizedEmail,
      subject: 'Verify Your Cricket CV Account',
      html: htmlContent
    });

    // Let the admin know about the new registration (failure here must not block the player)
    await notifyAdmin(
      isResend ? 'Cricket CV: verification link re-sent' : 'Cricket CV: new player registration',
      isResend ? 'Player re-registered (not yet verified)' : 'New player registration',
      {
        Name: `${firstName} ${lastName}`,
        Email: sanitizedEmail,
        Mobile: mobileNumber,
        Country: country,
        'State / Province': stateProvince,
        'Email verified': 'No (verification link sent)',
        'Registered at': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      }
    );

    if (!sent.ok) {
      return res.status(502).json({
        error: `Your account was created, but we could not send the verification email (${sent.error}). Please try registering again in a few minutes with the same email, or contact thecricketadvisor@gmail.com.`
      });
    }

    return res.status(200).json({ 
      status: 'success', 
      message: 'Account created successfully. A verification link has been sent to your email.'
    });

  } catch (error: any) {
    console.error('Error during signup:', error);
    return res.status(500).json({ error: error.message || 'Internal registration error' });
  }
}
