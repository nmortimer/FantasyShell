import { NextRequest, NextResponse } from 'next/server';
import data from '@/data/mockLeague.json';

function findTeam(id: string) { return data.teams.find(t=>t.id===id); }

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const url = new URL(req.url);
  const week = Number(url.searchParams.get('week') || '1');
  const homeId = url.searchParams.get('homeId') || 't1';
  const awayId = url.searchParams.get('awayId') || 't2';
  const home = findTeam(homeId)!; const away = findTeam(awayId)!;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
      <rect width="1200" height="675" fill="#0b0b0b"/>
      <rect x="12" y="12" width="1176" height="651" fill="none" stroke="#FFD700" stroke-width="8" rx="24"/>
      <text x="600" y="70" text-anchor="middle" fill="#FFD700" font-family="Bebas Neue, Arial" font-size="48">WEEK ${week} SHOWDOWN</text>
      <rect x="60" y="120" width="500" height="440" fill="${home.primary}" rx="16"/>
      <rect x="640" y="120" width="500" height="440" fill="${away.primary}" rx="16"/>
      <text x="310" y="600" text-anchor="middle" fill="${home.secondary}" font-size="36" font-family="Oswald, Arial">${home.name}</text>
      <text x="890" y="600" text-anchor="middle" fill="${away.secondary}" font-size="36" font-family="Oswald, Arial">${away.name}</text>
    </svg>
  `;
  return new NextResponse(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
}
