'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import TeamCard from '@/components/TeamCard';
import ProgressPill from '@/components/ProgressPill';

export default function DashboardClient({ leagueId }: { leagueId: string }) {
  const router = useRouter();
  const { setLeague, setTeams, teams, finalizeTeam, updateTeam, finalizeCount } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string|undefined>(undefined);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErr(undefined);
      try {
        const res = await fetch(`/api/league?id=${leagueId}`, { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Failed to load league');
        setLeague(data.league);
        setTeams(data.teams);
      } catch (e: any) {
        setErr(e?.message || 'Could not load this Sleeper league. Check the ID.');
        setLeague({ id: leagueId, name: 'Unknown League', season: new Date().getFullYear() });
        setTeams([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [leagueId, setLeague, setTeams]);

  const onEdit = (id: string) => router.push(`/team/${id}`);
  const onFinalize = (id: string) => {
    fetch('/api/finalize-logo', { method: 'POST', body: JSON.stringify({ id }) });
    finalizeTeam(id);
  };
  const onRegenerate = async (id: string) => {
    const r = await fetch('/api/generate-logo', { method: 'POST' });
    const j = await r.json();
    updateTeam(id, { logoUrl: j.logoUrl });
  };

  const allFinal = teams.length > 0 && finalizeCount() === teams.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">League Dashboard</h1>
        <ProgressPill />
      </div>

      {loading && <div className="rounded-xl bg-neutral-800/60 p-3">Loading league…</div>}
      {err && !loading && (
        <div className="rounded-xl bg-retro/10 text-retro ring-1 ring-retro/40 p-3 text-sm">
          Couldn’t load this Sleeper league. Check the ID.
        </div>
      )}
      {!allFinal && teams.length > 0 && (
        <div className="rounded-xl bg-retro/10 text-retro ring-1 ring-retro/40 p-3 text-sm">
          Finalize all teams to unlock weekly content.
        </div>
      )}
      {allFinal && teams.length > 0 && (
        <div className="rounded-xl bg-green-600/10 text-green-300 ring-1 ring-green-600/40 p-3 text-sm">
          All set! <a href="/complete" className="underline">Go to completion page</a>
        </div>
      )}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {teams.map(team => (
          <TeamCard
            key={team.id}
            team={team}
            onEdit={()=>onEdit(team.id)}
            onFinalize={()=>onFinalize(team.id)}
            onRegenerate={()=>onRegenerate(team.id)}
          />
        ))}
      </div>

      {!loading && teams.length === 0 && (
        <div className="rounded-xl bg-neutral-800/60 p-4">No teams yet. Try a different league ID on the home page.</div>
      )}
    </div>
  );
}
