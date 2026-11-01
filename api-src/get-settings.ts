import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const LOCAL_SETTINGS_PATH = path.join(process.cwd(), 'settings-db.json');

const getLocalSettings = (): Record<string, any> => {
  try {
    if (fs.existsSync(LOCAL_SETTINGS_PATH)) {
      const data = fs.readFileSync(LOCAL_SETTINGS_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading local settings file:', error);
  }
  return {};
};

const hasPostgres = () => {
  return !!(process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { secret } = req.query;
  const secretStr = typeof secret === 'string' ? secret : undefined;

  try {
    let settings: Record<string, any> = {};

    if (hasPostgres()) {
      try {
        await sql`
          CREATE TABLE IF NOT EXISTS site_settings (
            key VARCHAR(100) PRIMARY KEY,
            value TEXT NOT NULL
          );
        `;

        const { rows } = await sql`SELECT * FROM site_settings`;
        rows.forEach(r => {
          try {
            settings[r.key] = JSON.parse(r.value);
          } catch (e) {
            settings[r.key] = r.value;
          }
        });
      } catch (dbError) {
        console.error('Failed to read settings from Postgres, falling back to local file:', dbError);
        settings = getLocalSettings();
      }
    } else {
      settings = getLocalSettings();
    }

    // Redact password if not authorized
    const adminSettings = settings.admin_settings || {};
    const dbPassword = adminSettings.adminPassword;
    const envPassword = process.env.ADMIN_PASSWORD;

    const validPasswords = ['cricket2026', 'admin123'];
    if (envPassword) validPasswords.push(envPassword);
    if (dbPassword) validPasswords.push(dbPassword);

    const isAuthorized = !!(secretStr && validPasswords.includes(secretStr));

    if (!isAuthorized && settings.admin_settings) {
      // Redact the password field for public request
      settings.admin_settings = {
        ...settings.admin_settings,
        adminPassword: ''
      };
    }

    return res.status(200).json(settings);
  } catch (error: any) {
    console.error('Error in get-settings handler:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
