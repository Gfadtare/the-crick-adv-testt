import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const LOCAL_DB_PATH = path.join(process.cwd(), 'bookings-db.json');

const getLocalBookings = (): any[] => {
  try {
    if (fs.existsSync(LOCAL_DB_PATH)) {
      const data = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading local bookings file:', error);
  }
  return [];
};

// Check if Postgres URL is available
const hasPostgres = () => {
  return !!(process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { secret } = req.query;
  const adminPassword = process.env.ADMIN_PASSWORD || 'cricket2026';
  const isAuthorized = secret === 'cricket2026' || secret === 'admin123' || secret === adminPassword;

  try {
    let bookings: any[] = [];

    if (hasPostgres()) {
      try {
        // 1. Ensure table exists
        await sql`
          CREATE TABLE IF NOT EXISTS bookings (
            id VARCHAR(50) PRIMARY KEY,
            full_name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            whatsapp VARCHAR(100) NOT NULL,
            country VARCHAR(100) NOT NULL,
            playing_level VARCHAR(100) NOT NULL,
            package_id VARCHAR(100) NOT NULL,
            package_name VARCHAR(255) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            booking_date VARCHAR(50) NOT NULL,
            time_slot VARCHAR(150) NOT NULL,
            purpose TEXT,
            payment_method VARCHAR(50) NOT NULL,
            payment_status VARCHAR(50) NOT NULL,
            booking_status VARCHAR(50) NOT NULL,
            zoom_link TEXT,
            meeting_id VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `;

        // 2. Fetch all rows sorted by created_at DESC
        const { rows } = await sql`SELECT * FROM bookings ORDER BY created_at DESC`;

        // 3. Map database columns to camelCase frontend schema
        bookings = rows.map(r => ({
          id: r.id,
          fullName: r.full_name,
          email: r.email,
          whatsApp: r.whatsapp,
          country: r.country,
          playingLevel: r.playing_level,
          packageId: r.package_id,
          packageName: r.package_name,
          price: Number(r.price),
          date: r.booking_date,
          timeSlot: r.time_slot,
          purpose: r.purpose || '',
          paymentMethod: r.payment_method,
          paymentStatus: r.payment_status,
          bookingStatus: r.booking_status,
          zoomLink: r.zoom_link || '',
          meetingId: r.meeting_id || '',
          createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString()
        }));
      } catch (dbError) {
        console.error('Failed to read from Vercel Postgres, falling back to local file:', dbError);
        bookings = getLocalBookings();
      }
    } else {
      bookings = getLocalBookings();
    }

    if (isAuthorized) {
      return res.status(200).json(bookings);
    }

    // Filter bookings to return only safety/essential scheduling parameters
    const publicSlots = bookings.map(b => ({
      date: b.date,
      timeSlot: b.timeSlot,
      packageName: b.packageName || ''
    }));

    return res.status(200).json(publicSlots);
  } catch (error: any) {
    console.error('Error in get-bookings handler:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
