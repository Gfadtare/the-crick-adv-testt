import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { notifyAdmin } from './utils/send-email.js';

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
  const token = req.query.token as string;

  if (!token) {
    return res.status(400).json({ error: 'Verification token is required' });
  }

  try {
    let verified = false;
    let verifiedUser: any = null;

    if (hasPostgres()) {
      const userRes = await sql`SELECT id, email, first_name, last_name, mobile_number FROM cv_users WHERE verification_token = ${token} LIMIT 1`;
      if (userRes.rows.length > 0) {
        verifiedUser = userRes.rows[0];
        const userId = userRes.rows[0].id;
        await sql`UPDATE cv_users SET email_verified = TRUE, verification_token = NULL WHERE id = ${userId}`;
        verified = true;
      }
    } else {
      const users = getLocalUsers();
      const userIdx = users.findIndex((u: any) => u.verification_token === token);
      if (userIdx > -1) {
        verifiedUser = users[userIdx];
        users[userIdx].email_verified = true;
        users[userIdx].verification_token = null;
        saveLocalUsers(users);
        verified = true;
      }
    }

    if (verified) {
      if (verifiedUser) {
        await notifyAdmin('Cricket CV: player verified email', 'Player email verified', {
          Name: `${verifiedUser.first_name || ''} ${verifiedUser.last_name || ''}`,
          Email: verifiedUser.email,
          Mobile: verifiedUser.mobile_number,
          'Verified at': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        });
      }
      return res.status(200).json({ status: 'verified', message: 'Email verified successfully!' });
    } else {
      return res.status(404).json({ error: 'Invalid or expired verification token' });
    }

  } catch (error: any) {
    console.error('Email verification error:', error);
    return res.status(500).json({ error: error.message || 'Verification failure' });
  }
}
