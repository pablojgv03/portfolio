import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.pablogomezvillen.com');
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');

  const apiKey = process.env.CAL_API_KEY;
  if (!apiKey) {
    return res.status(200).json({ slots: [] });
  }

  try {
    const now = new Date();
    const twoWeeksOut = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    const url = new URL('https://api.cal.com/v2/bookings');
    url.searchParams.set('status', 'upcoming');
    url.searchParams.set('limit', '20');

    const calRes = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'cal-api-version': '2024-08-13',
      },
    });

    const data = await calRes.json();
    return res.status(200).json({ _debug: true, httpStatus: calRes.status, data });
  } catch (e) {
    return res.status(200).json({ _debug: true, error: String(e) });
  }
}
