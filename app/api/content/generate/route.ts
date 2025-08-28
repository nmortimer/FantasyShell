import { NextRequest, NextResponse } from 'next/server';
import { getLeagueData, getMatchupsForWeek } from '@/lib/provider';

/**
 * Returns poster "items" for the given week & tab.
 * - tab = 'matchups' → real pairings
 * - tab = 'recaps'   → real scores + winner highlight
 * - tab = 'power'    → simple placeholder grid
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const { leagueId, week = 1, tab = 'matchups' } = body ? JSON.parse(body) : {};

  if (!leagueId) {
    return NextResponse.json({ items: [], error: 'Missing leagueId' }, { status: 400 });
  }

  try {
    const data = await getLeagueData(leagueId);
    const teamById = new Map(data.teams.map((t) => [t.id, t]));

    let items: { id: string; title: string; svg: string }[] = [];

    if (tab === 'power') {
      // Simple placeholder – no external data needed.
      const svg = makePowerSVG(week);
      items = [{ id: `wk${week}-power`, title: 'Top 6', svg }];
    } else {
      const matchups = await getMatchupsForWeek(leagueId, week);
      if (!matchups.length) {
        return NextResponse.json({ items: [] });
      }

      if (tab === 'matchups') {
        items = matchups.map((m, i) => {
          const home = teamById.get(m.homeId)!;
          const away = teamById.get(m.awayId)!;
          return {
            id: `wk${week}-m${i + 1}`,
            title: `${home.name} vs ${away.name}`,
            svg: makeMatchupSVG(home, away, data.league.name, week),
          };
        });
      } else if (tab === 'recaps') {
        items = matchups.map((m, i) => {
          const home = teamById.get(m.homeId)!;
          const away = teamById.get(m.awayId)!;
          const svg = makeRecapSVG(home, away, data.league.name, week, m.homeScore ?? 0, m.awayScore ?? 0);
          return {
            id: `wk${week}-r${i + 1}`,
            title: `${home.name} ${m.homeScore ?? 0} - ${m.awayScore ?? 0} ${away.name}`,
            svg,
          };
        });
      }
    }

    return NextResponse.json({ items });
  } catch (err: any) {
    return NextResponse.json({ items: [], error: err?.message || 'Failed to load content' }, { status: 502 });
  }
}

// --------- SVG builders (no external images to keep PNG export working) ---------

type TeamLite = {
  id: string;
  name: string;
  manager: string;
  primary: string;
  secondary: string;
};

function makeMatchupSVG(home: TeamLite, away: TeamLite, leagueName: string, week: number) {
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
  <text x="600" y="44" text-anchor="middle" fill="#FFD700" font-family="Bebas Neue, Arial" font-size="42">WEEK ${week} SHOWDOWN</text>
  <text x="600" y="80" text-anchor="middle" fill="#aaa" font-family="Oswald, Arial" font-size="18">${leagueName}</text>
  <text x="300" y="620" text-anchor="middle" fill="${home.secondary}" font-size="36" font-family="Oswald, Arial">${home.name}</text>
  <text x="900" y="620" text-anchor="middle" fill="${away.secondary}" font-size="36" font-family="Oswald, Arial">${away.name}</text>
</svg>`;
}

function makeRecapSVG(home: TeamLite, away: TeamLite, leagueName: string, week: number, h: number, a: number) {
  const homeWins = (h ?? 0) >= (a ?? 0);
  const glow = '0 0 22px rgba(255,215,0,0.6)';
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
  <rect width="1200" height="675" fill="#0d0d0d"/>
  <rect x="12" y="12" width="1176" height="651" fill="none" stroke="#FFD700" stroke-width="8" rx="24"/>
  <text x="600" y="80" text-anchor="middle" fill="#FFD700" font-family="Bebas Neue, Arial" font-size="58">WEEK ${week} RECAP</text>
  <text x="600" y="112" text-anchor="middle" fill="#aaa" font-family="Oswald, Arial" font-size="18">${leagueName}</text>
  <rect x="80" y="160" width="460" height="300" fill="${home.primary}" rx="16" />
  <rect x="660" y="160" width="460" height="300" fill="${away.primary}" rx="16" />
  <text x="310" y="350" text-anchor="middle" fill="${home.secondary}" font-size="120" font-family="Oswald, Arial" style="${homeWins ? `filter: drop-shadow(${glow});` : ''}">${h ?? 0}</text>
  <text x="890" y="350" text-anchor="middle" fill="${away.secondary}" font-size="120" font-family="Oswald, Arial" style="${!homeWins ? `filter: drop-shadow(${glow});` : ''}">${a ?? 0}</text>
  <text x="300" y="490" text-anchor="middle" fill="${home.secondary}" font-size="28" font-family="Oswald, Arial">${home.name}</text>
  <text x="900" y="490" text-anchor="middle" fill="${away.secondary}" font-size="28" font-family="Oswald, Arial">${away.name}</text>
</svg>`;
}

function makePowerSVG(week: number) {
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
}
