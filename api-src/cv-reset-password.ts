import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateSalt, hashPassword } from './utils/cv-auth.js';

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

  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token and new password are required' });
  }

  const salt = generateSalt();
  const pwdHash = hashPassword(newPassword, salt);

  try {
    let success = false;

    if (hasPostgres()) {
      const userRes = await sql`
        SELECT id, reset_token_expires FROM cv_users 
        WHERE reset_token = ${token} LIMIT 1
      `;
      
      if (userRes.rows.length > 0) {
        const user = userRes.rows[0];
        const expiry = new Date(user.reset_token_expires);
        
        if (expiry > new Date()) {
          await sql`
            UPDATE cv_users 
            SET password_hash = ${pwdHash}, password_salt = ${salt}, reset_token = NULL, reset_token_expires = NULL 
            WHERE id = ${user.id}
          `;
          success = true;
        }
      }
    } else {
      const users = getLocalUsers();
      const userIdx = users.findIndex((u: any) => u.reset_token === token);
      
      if (userIdx > -1) {
        const expiry = new Date(users[userIdx].reset_token_expires);
        
        if (expiry > new Date()) {
          users[userIdx].password_hash = pwdHash;
          users[userIdx].password_salt = salt;
          users[userIdx].reset_token = null;
          users[userIdx].reset_token_expires = null;
          saveLocalUsers(users);
          success = true;
        }
      }
    }

    if (success) {
      return res.status(200).json({ status: 'success', message: 'Password updated successfully!' });
    } else {
      return res.status(400).json({ error: 'Invalid or expired password reset token' });
    }

  } catch (error: any) {
    console.error('Password reset error:', error);
    return res.status(500).json({ error: error.message || 'Error updating password' });
  }
}
