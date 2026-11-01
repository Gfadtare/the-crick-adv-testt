import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const LOCAL_DB_PATH = path.join(process.cwd(), 'bookings-db.json');

const hasPostgres = () => {
  return !!(process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { secret, bookings } = req.body;
  const isAdmin = secret === 'cricket2026' || secret === 'admin123' || secret === process.env.ADMIN_PASSWORD;

  if (!isAdmin) {
    return res.status(401).json({ error: 'Unauthorized: Invalid administrative credentials' });
  }

  if (!Array.isArray(bookings)) {
    return res.status(400).json({ error: 'Invalid bookings format' });
  }

  try {
    if (hasPostgres()) {
      try {
        // Wipe all existing bookings
        await sql`DELETE FROM bookings`;

        // Bulk insert bookings
        for (const b of bookings) {
          await sql`
            INSERT INTO bookings (
              id, full_name, email, whatsapp, country, playing_level,
              package_id, package_name, price, booking_date, time_slot,
              purpose, payment_method, payment_status, booking_status,
              zoom_link, meeting_id, created_at
            ) VALUES (
              ${b.id}, ${b.fullName}, ${b.email}, ${b.whatsApp}, ${b.country}, ${b.playingLevel},
              ${b.packageId}, ${b.packageName}, ${b.price}, ${b.date}, ${b.timeSlot},
              ${b.purpose || ''}, ${b.paymentMethod}, ${b.paymentStatus}, ${b.bookingStatus},
              ${b.zoomLink || ''}, ${b.meetingId || ''}, ${b.createdAt || new Date().toISOString()}
            )
          `;
        }
        return res.status(200).json({ status: 'success', message: 'Bookings synced to Postgres successfully' });
      } catch (dbError) {
        console.error('Postgres administrative sync failed, falling back to local file:', dbError);
        fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(bookings, null, 2), 'utf-8');
        return res.status(200).json({ status: 'success', message: 'Bookings saved locally successfully' });
      }
    } else {
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(bookings, null, 2), 'utf-8');
      return res.status(200).json({ status: 'success', message: 'Bookings saved locally successfully' });
    }
  } catch (error: any) {
    console.error('Error in save-bookings handler:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
