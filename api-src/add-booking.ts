import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendBookingEmail } from './utils/mailer.js';

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

const saveLocalBookings = (bookings: any[]) => {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(bookings, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing local bookings file:', error);
  }
};

const hasPostgres = () => {
  return !!(process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { booking } = req.body;

  if (!booking || !booking.date || !booking.timeSlot) {
    return res.status(400).json({ error: 'Missing booking details' });
  }

  try {
    let success = false;
    let errorMsg = '';

    if (hasPostgres()) {
      try {
        // Check if slot is already booked
        const { rows } = await sql`
          SELECT id FROM bookings 
          WHERE booking_date = ${booking.date} AND time_slot = ${booking.timeSlot}
          LIMIT 1
        `;

        if (rows.length > 0) {
          return res.status(400).json({ error: 'Slot is already booked' });
        }

        // Insert booking
        await sql`
          INSERT INTO bookings (
            id, full_name, email, whatsapp, country, playing_level,
            package_id, package_name, price, booking_date, time_slot,
            purpose, payment_method, payment_status, booking_status,
            zoom_link, meeting_id, created_at
          ) VALUES (
            ${booking.id}, ${booking.fullName}, ${booking.email}, ${booking.whatsApp}, ${booking.country}, ${booking.playingLevel},
            ${booking.packageId}, ${booking.packageName}, ${booking.price}, ${booking.date}, ${booking.timeSlot},
            ${booking.purpose || ''}, ${booking.paymentMethod}, ${booking.paymentStatus}, ${booking.bookingStatus},
            ${booking.zoomLink || ''}, ${booking.meetingId || ''}, ${booking.createdAt || new Date().toISOString()}
          )
        `;
        success = true;
      } catch (dbError: any) {
        console.error('Postgres database insert failed, falling back to local file:', dbError);
        // Fallback to local file sync
        const bookings = getLocalBookings();
        const isAlreadyBooked = bookings.some(
          b => b.date === booking.date && b.timeSlot === booking.timeSlot
        );
        if (!isAlreadyBooked) {
          bookings.push(booking);
          saveLocalBookings(bookings);
          success = true;
        } else {
          errorMsg = 'Slot is already booked';
        }
      }
    } else {
      const bookings = getLocalBookings();
      const isAlreadyBooked = bookings.some(
        b => b.date === booking.date && b.timeSlot === booking.timeSlot
      );
      if (!isAlreadyBooked) {
        bookings.push(booking);
        saveLocalBookings(bookings);
        success = true;
      } else {
        errorMsg = 'Slot is already booked';
      }
    }

    if (success) {
      // Send automatic confirmation email via Gmail SMTP
      await sendBookingEmail(booking);
      return res.status(200).json({ status: 'success', message: 'Booking saved successfully' });
    } else {
      return res.status(400).json({ error: errorMsg || 'Slot is already booked' });
    }
  } catch (error: any) {
    console.error('Error in add-booking handler:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
