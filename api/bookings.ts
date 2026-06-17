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

    if (!calRes.ok) throw new Error(`Cal.com error: ${calRes.status}`);

    const data = await calRes.json();
    // v2 response: { status: "success", data: [...] }
    const bookings: { start: string; end: string }[] = data.data ?? [];

    const slots = bookings
      .filter(b => {
        const start = new Date(b.start);
        return start >= now && start <= twoWeeksOut;
      })
      .map(b => ({ start: b.start, end: b.end }))
      .slice(0, 10);

    return res.status(200).json({ slots });
  } catch {
    return res.status(200).json({ slots: [] });
  }
}
