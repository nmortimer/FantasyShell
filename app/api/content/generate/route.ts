import { NextRequest, NextResponse } from 'next/server';
import data from '@/data/mockLeague.json';

const makeMatchupSVG = (homeId: string, awayId: string, week: number) => {
  const home = data.teams.find(t=>t.id===homeId)!;
  const away = data.teams.find(t=>t.id===awayId)!;
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
  <defs>
    <linearGradient id="foil" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFD700" />
      <stop offset="100%" stop-color="#FFF3B0" />
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="#111"/>
  <rect x="12" y="12" width="1176" height="651" fill="none" stroke="url(#foil)" stroke-width="8" rx="24"/>
  <rect x="20" y="20" width="1160" height="635" fill="#0b0b0b" rx="20"/>
  <rect x="40" y="60" width="520" height="520" fill="${home.primary}" rx="16"/>
  <rect x="640" y="60" width="520" height="520" fill="${away.primary}" rx="16"/>
  <polygon points="600,60 620,60 600,580 580,580" fill="#FFD700" />
  <text x="600" y="40" text-anchor="middle" fill="#FFD700" font-family="Bebas Neue, Arial" font-size="42">WEEK ${week} SHOWDOWN</text>
  <text x="300" y="620" text-anchor="middle" fill="${home.secondary}" font-size="36" font-family="Oswald, Arial">${home.name}</text>
  <text x="900" y="620" text-anchor="middle" fill="${away.secondary}" font-size="36" font-family="Oswald, Arial">${away.name}</text>
</svg>`;
};

const makeRecapSVG = (homeId: string, awayId: string, week: number) => {
  const home = data.teams.find(t=>t.id===homeId)!;
  const away = data.teams.find(t=>t.id===awayId)!;
  const h = Math.floor(Math.random()*60)+70;
  const a = Math.floor(Math.random()*60)+70;
  const winner = h>=a?home:away;
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
  <rect width="1200" height="675" fill="#0d0d0d"/>
  <rect x="12" y="12" width="1176" height="651" fill="none" stroke="#FFD700" stroke-width="8" rx="24"/>
  <text x="600" y="80" text-anchor="middle" fill="#FFD700" font-family="Bebas Neue, Arial" font-size="60">WEEK ${week} RECAP</text>
  <rect x="80" y="160" width="460" height="300" fill="${home.primary}" rx="16"/>
  <rect x="660" y="160" width="460" height="300" fill="${away.primary}" rx="16"/>
  <text x="310" y="350" text-anchor="middle" fill="${home.secondary}" font-size="120" font-family="Oswald, Arial">${h}</text>
  <text x="890" y="350" text-anchor="middle" fill="${away.secondary}" font-size="120" font-family="Oswald, Arial">${a}</text>
  <text x="600" y="580" text-anchor="middle" fill="${winner.primary}" font-size="36" font-family="Oswald, Arial">${winner.name} WINS</text>
</svg>`;
};

const makePowerSVG = (week:number) => {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
  <rect width="1200" height="675" fill="#101010"/>
  <rect x="12" y="12" width="1176" height="651" fill="none" stroke="#FFD700" stroke-width="8" rx="24"/>
  <text x="600" y="80" text-anchor="middle" fill="#FFD700" font-family="Bebas Neue, Arial" font-size="60">POWER RANKINGS — WEEK ${week}</text>
  ${Array.from({length:6}).map((_,i)=>{
    const x = 100 + (i%3)*350;
    const y = 140 + Math.floor(i/3)*230;
    return `<g>
      <rect x="${x}" y="${y}" width="300" height="200" fill="#1f1f1f" rx="14" stroke="#FFD700"/>
      <text x="${x+20}" y="${y+50}" fill="#FFD700" font-family="Oswald, Arial" font-size="36">#${i+1}</text>
      <text x="${x+20}" y="${y+100}" fill="#ffffff" font-family="Oswald, Arial" font-size="24">Team ${i+1}</text>
    </g>`;
  }).join('')}
</svg>`;
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const { week = 1, tab = 'matchups' } = body ? JSON.parse(body) : {};
  let items: { id: string; title: string; svg: string }[] = [];

  if (tab === 'matchups') {
    items = data.schedule.matchups.map((m, idx) => ({
      id: `wk${week}-m${idx+1}`,
      title: `Matchup ${idx+1}`,
      svg: makeMatchupSVG(m.home, m.away, week)
    }));
  } else if (tab === 'recaps') {
    items = data.schedule.matchups.map((m, idx) => ({
      id: `wk${week}-r${idx+1}`,
      title: `Recap ${idx+1}`,
      svg: makeRecapSVG(m.home, m.away, week)
    }));
  } else {
    items = [{ id: `wk${week}-power`, title: 'Top 6', svg: makePowerSVG(week) }];
  }

  return NextResponse.json({ items });
}
