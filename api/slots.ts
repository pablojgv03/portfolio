import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.pablogomezvillen.com');
  res.setHeader('Cache-Control', 'public, max-age=180, s-maxage=180');

  const apiKey = process.env.CAL_API_KEY;
  if (!apiKey) return res.status(200).json({ slots: {} });

  const { startTime, endTime } = req.query;
  if (!startTime || !endTime) {
    return res.status(400).json({ error: 'startTime and endTime required' });
  }

  try {
    const url = new URL('https://api.cal.com/v2/slots/available');
    url.searchParams.set('eventTypeId', '6041762');
    url.searchParams.set('startTime', String(startTime));
    url.searchParams.set('endTime', String(endTime));
    url.searchParams.set('timeZone', 'Europe/Madrid');

    const calRes = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'cal-api-version': '2024-08-13',
      },
    });

    if (!calRes.ok) throw new Error(`Cal.com slots error: ${calRes.status}`);
    const { data } = await calRes.json();

    // Normalize slot times to UTC ISO strings (Cal.com returns local+offset)
    // data.slots: { "YYYY-MM-DD": [{ time: "...+02:00" }, ...] }
    const normalized: Record<string, string[]> = {};
    for (const [date, arr] of Object.entries((data?.slots ?? {}) as Record<string, { time: string }[]>)) {
      normalized[date] = arr.map(s => new Date(s.time).toISOString());
    }
    return res.status(200).json({ slots: normalized });
  } catch {
    return res.status(200).json({ slots: {} });
  }
}
