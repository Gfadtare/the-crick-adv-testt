import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isAdminSecret } from './utils/admin-auth.js';

// Admin: lists every registered CV account with its email-verification status,
// independently of whether the player has created a CV or paid.

const readJson = (file: string): any[] => {
  try {
    const p = path.join(process.cwd(), file);
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf-8'));
  } catch (error) {
    console.error(`Error reading ${file}:`, error);
  }
  return [];
};

const hasPostgres = () => !!(process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!isAdminSecret(req.query.secret)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    if (hasPostgres()) {
      // cvs may not exist yet if nobody has saved a CV
      await sql`
        CREATE TABLE IF NOT EXISTS cvs (
          id VARCHAR(50) PRIMARY KEY,
          user_id VARCHAR(50),
          reference_number VARCHAR(100) NOT NULL,
          first_name VARCHAR(255) NOT NULL,
          last_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          payment_status VARCHAR(50) NOT NULL,
          download_status VARCHAR(50) NOT NULL,
          edits_used INTEGER DEFAULT 0,
          edits_allowed INTEGER DEFAULT 5,
          identity_locked BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          cv_data TEXT NOT NULL
        );
      `;
      const { rows } = await sql`
        SELECT u.id, u.email, u.first_name, u.last_name, u.mobile_number, u.country,
               u.state_province, u.email_verified, u.created_at,
               c.id AS cv_id, c.payment_status
        FROM cv_users u
        LEFT JOIN cvs c ON c.email = u.email
        ORDER BY u.created_at DESC
      `;
      return res.status(200).json(rows.map(r => ({
        id: r.id,
        email: r.email,
        firstName: r.first_name || '',
        lastName: r.last_name || '',
        mobileNumber: r.mobile_number || '',
        country: r.country || '',
        stateProvince: r.state_province || '',
        emailVerified: r.email_verified === true,
        createdAt: r.created_at,
        hasCv: !!r.cv_id,
        paymentStatus: r.payment_status || 'Not started'
      })));
    }

    // Local development fallback
    const users = readJson('cv-users-db.json');
    const cvs = readJson('cvs-db.json');
    return res.status(200).json(users.map((u: any) => {
      const cv = cvs.find((c: any) => c.userId === u.id || c.email === u.email);
      return {
        id: u.id,
        email: u.email,
        firstName: u.first_name || '',
        lastName: u.last_name || '',
        mobileNumber: u.mobile_number || '',
        country: u.country || '',
        stateProvince: u.state_province || '',
        emailVerified: u.email_verified === true,
        createdAt: u.created_at,
        hasCv: !!cv,
        paymentStatus: cv?.paymentStatus || 'Not started'
      };
    }));
  } catch (error: any) {
    if (String(error?.message || '').includes('does not exist')) {
      return res.status(200).json([]); // no registrations yet
    }
    console.error('Error in get-cv-users:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
