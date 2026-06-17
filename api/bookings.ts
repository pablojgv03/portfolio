import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.pablogomezvillen.com');
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');

  const apiKey = process.env.CAL_API_KEY;
  if (!apiKey) {
    return res.status(200).json({ slots: [] });
  }

  try {
    const url = new URL('https://api.cal.com/v1/bookings');
    url.searchParams.set('apiKey', apiKey);
    url.searchParams.set('limit', '20');

    const calRes = await fetch(url.toString());
    const data = await calRes.json();

    // Debug: devuelve respuesta cruda de Cal.com
    return res.status(200).json({ _debug: true, status: calRes.status, data });
  } catch (e) {
    return res.status(200).json({ _debug: true, error: String(e) });
  }
}
