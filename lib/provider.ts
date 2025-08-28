import mock from '@/data/mockLeague.json';

type ProviderLeague = {
  league: { id: string; name: string; season: number };
  teams: Array<{
    id: string;
    name: string;
    manager: string;
    primary: string;
    secondary: string;
    stylePack: 'v1' | 'v2' | 'v3';
    status: 'draft' | 'final';
    logoUrl: string; // avatar for now
    avatarUrl?: string;
  }>;
};

const COLOR_POOL = [
  '#00B2CA', '#1E90FF', '#6A5ACD', '#FF7F50', '#2E8B57', '#DC143C',
  '#8A2BE2', '#DAA520', '#008080', '#20B2AA', '#1E90FF', '#556B2F',
];

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function pickColor(id: string) {
  const idx = hashStr(id) % COLOR_POOL.length;
  const primary = COLOR_POOL[idx];
  // simple readable secondary
  const secondary = '#FAFAFA';
  return { primary, secondary };
}

export async function getLeagueData(leagueId: string): Promise<ProviderLeague> {
  const provider = process.env.DATA_PROVIDER || 'mock';

  if (provider !== 'sleeper') {
    // mock passthrough
    return mock as ProviderLeague;
  }

  // Sleeper read-only fetch
  const [leagueRes, usersRes, rostersRes] = await Promise.all([
    fetch(`https://api.sleeper.app/v1/league/${leagueId}`, { cache: 'no-store' }),
    fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`, { cache: 'no-store' }),
    fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`, { cache: 'no-store' }),
  ]);

  if (!leagueRes.ok) throw new Error('Sleeper league not found');
  if (!usersRes.ok) throw new Error('Failed to load users');
  if (!rostersRes.ok) throw new Error('Failed to load rosters');

  const leagueJson = await leagueRes.json();
  const usersJson: any[] = await usersRes.json();
  const rostersJson: any[] = await rostersRes.json();

  const usersById = new Map(usersJson.map(u => [u.user_id, u]));
  const league: ProviderLeague['league'] = {
    id: String(leagueJson.league_id || leagueId),
    name: String(leagueJson.name || 'Sleeper League'),
    season: Number(leagueJson.season || new Date().getFullYear()),
  };

  // map roster -> user -> team
  const teams: ProviderLeague['teams'] = rostersJson.map((r: any) => {
    const user = usersById.get(r.owner_id) || {};
    const name =
      (user?.metadata?.team_name as string) ||
      (user?.display_name as string) ||
      `Team ${r.roster_id}`;
    const manager = (user?.display_name as string) || 'Manager';
    const avatarId = user?.avatar as string | undefined;
    const avatarUrl = avatarId ? `https://sleepercdn.com/avatars/thumbs/${avatarId}` : '/placeholders/logos/bandits.png';
    const { primary, secondary } = pickColor(String(r.roster_id));
    return {
      id: String(r.roster_id),
      name,
      manager,
      primary,
      secondary,
      stylePack: 'v1',
      status: 'draft',
      logoUrl: avatarUrl,
      avatarUrl,
    };
  });

  return { league, teams };
}

export async function getMatchupsForWeek(
  leagueId: string,
  week: number
): Promise<Array<{ homeId: string; awayId: string; homeScore?: number; awayScore?: number }>> {
  const provider = process.env.DATA_PROVIDER || 'mock';
  if (provider !== 'sleeper') {
    // Build mock pairs from mock data
    const ms = (mock as any).schedule?.matchups || [];
    return ms.map((m: any) => ({ homeId: m.home, awayId: m.away, homeScore: undefined, awayScore: undefined }));
  }

  const [rostersRes, matchupsRes] = await Promise.all([
    fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`, { cache: 'no-store' }),
    fetch(`https://api.sleeper.app/v1/league/${leagueId}/matchups/${week}`, { cache: 'no-store' }),
  ]);

  if (!rostersRes.ok || !matchupsRes.ok) return [];

  const rostersJson: any[] = await rostersRes.json();
  const matchupsJson: any[] = await matchupsRes.json();

  // Group by matchup_id
  const byMatchId = new Map<number, any[]>();
  for (const m of matchupsJson) {
    const key = Number(m.matchup_id ?? -1);
    if (!byMatchId.has(key)) byMatchId.set(key, []);
    byMatchId.get(key)!.push(m);
  }

  const pairs: Array<{ homeId: string; awayId: string; homeScore?: number; awayScore?: number }> = [];
  for (const [, arr] of byMatchId) {
    if (!arr || arr.length < 2) continue;
    const a = arr[0];
    const b = arr[1];
    // home/away arbitrary but stable: lower roster_id = "home"
    const first = a.roster_id <= b.roster_id ? a : b;
    const second = first === a ? b : a;
    pairs.push({
      homeId: String(first.roster_id),
      awayId: String(second.roster_id),
      homeScore: Number(first.points ?? 0),
      awayScore: Number(second.points ?? 0),
    });
  }

  return pairs;
}
