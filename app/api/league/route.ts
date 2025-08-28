import { NextRequest, NextResponse } from 'next/server';
import { getLeagueData } from '@/lib/provider';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing league id' }, { status: 400 });
  }

  try {
    const data = await getLeagueData(id);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to load league' },
      { status: 502 }
    );
  }
}
