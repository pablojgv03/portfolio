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
    url.searchParams.set('username', 'pablo-gomez-villen');
    url.searchParams.set('eventTypeSlug', 'primera-reunion');
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
    // data.slots: { "YYYY-MM-DD": [{ start: "...Z" }, ...] }
    return res.status(200).json(data ?? { slots: {} });
  } catch {
    return res.status(200).json({ slots: {} });
  }
}
