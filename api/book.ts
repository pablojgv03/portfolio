import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.pablogomezvillen.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.CAL_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Not configured' });

  const { start, name, email, notes, timeZone, language } = req.body ?? {};
  if (!start || !name || !email) {
    return res.status(400).json({ error: 'start, name and email are required' });
  }

  try {
    const body: Record<string, unknown> = {
      start,
      eventTypeId: 6041762,
      attendee: {
        name,
        email,
        timeZone: timeZone || 'Europe/Madrid',
        language: language || 'es',
      },
    };
    if (notes) body.metadata = { additionalNotes: notes };

    const calRes = await fetch('https://api.cal.com/v2/bookings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'cal-api-version': '2024-08-13',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await calRes.json();

    if (!calRes.ok) {
      return res.status(400).json({ error: data?.error?.message ?? 'Booking failed' });
    }

    const booking = data.data ?? {};
    return res.status(200).json({
      uid: booking.uid,
      meetingUrl: booking.meetingUrl ?? null,
      start: booking.start,
      end: booking.end,
    });
  } catch {
    return res.status(500).json({ error: 'Internal error' });
  }
}
