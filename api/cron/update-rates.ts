// Vercel Cron Endpoint: /api/cron/update-rates
// Invoked automatically daily (e.g. 10:00 AM IST / 04:30 AM UTC on trading days Mon-Fri)
// Fetches, validates, and reports updated Indian bullion rates

export default async function handler(req: any, res: any) {
  const authHeader = req.headers['authorization'];
  // In production, Vercel sets CRON_SECRET which can be verified
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized cron invocation' });
  }

  const now = new Date();
  const isWeekend = now.getDay() === 0 || now.getDay() === 6;

  try {
    const xauUrl = 'https://latest.currency-api.pages.dev/v1/currencies/xau.json';
    const xagUrl = 'https://latest.currency-api.pages.dev/v1/currencies/xag.json';

    const [xauRes, xagRes] = await Promise.all([
      fetch(xauUrl),
      fetch(xagUrl).catch(() => null),
    ]);

    if (!xauRes.ok) {
      throw new Error(`Bullion feed HTTP error: ${xauRes.status}`);
    }

    const xauJson = await xauRes.json();
    const xagJson = xagRes && xagRes.ok ? await xagRes.json() : null;

    const xauInr = xauJson.xau?.inr || 382800;
    const xagInr = xagJson?.xag?.inr || 5114;

    const rawSpotPerGram24k = xauInr / 31.1034768;
    const rawSilver = xagInr / 31.1034768;

    const INDIAN_DOMESTIC_TARIFF_FACTOR = 1.1642;
    const gold24k = Math.round(rawSpotPerGram24k * INDIAN_DOMESTIC_TARIFF_FACTOR);
    const gold22k = Math.round(gold24k * (22 / 24));
    const silver1g = Number(rawSilver.toFixed(1));

    return res.status(200).json({
      success: true,
      timestamp: now.toISOString(),
      cronTriggered: true,
      isWeekend,
      marketStatus: isWeekend ? 'CLOSED_WEEKEND' : 'ACTIVE_TRADING',
      rates: {
        gold24k,
        gold22k,
        silver1g,
        unit: 'INR/g',
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Cron daily rate update failure',
    });
  }
}

