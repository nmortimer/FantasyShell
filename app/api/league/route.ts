import { NextRequest, NextResponse } from 'next/server';
import data from '@/data/mockLeague.json';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  // ignoring id for now: return mock data
  return NextResponse.json(data);
}
