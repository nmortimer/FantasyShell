import { NextResponse } from 'next/server';

export const revalidate = 60; // cache for a minute

export async function GET() {
  const provider = process.env.DATA_PROVIDER || 'mock';
  if (provider !== 'sleeper') {
    // mock fallback — default to week 1
    return NextResponse.json({ sport: 'nfl', week: 1 });
  }

  try {
    const res = await fetch('https://api.sleeper.app/v1/state/nfl', { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch state');
    const json = await res.json();
    return NextResponse.json({ sport: 'nfl', week: json?.week ?? 1 });
  } catch {
    return NextResponse.json({ sport: 'nfl', week: 1 });
  }
}
