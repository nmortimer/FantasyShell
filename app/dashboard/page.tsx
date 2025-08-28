'use client';
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import TeamCard from '@/components/TeamCard';
import ProgressPill from '@/components/ProgressPill';

export default function DashboardPage() {
  const params = useSearchParams();
  const router = useRouter();
  const leagueId = params.get('leagueId') || '12345';
  const { setLeague, setTeams, teams, finalizeTeam, updateTeam, finalizeCount } = useAppStore();

  useEffect(()=>{
    const load = async () => {
      const res = await fetch(`/api/league?id=${leagueId}`);
      const data = await res.json();
      setLeague(data.league);
      setTeams(data.teams);
    };
    load();
  }, [leagueId, setLeague, setTeams]);

  const onEdit = (id:string) => router.push(`/team/${id}`);
  const onFinalize = (id:string) => { fetch('/api/finalize-logo',{ method:'POST', body: JSON.stringify({ id }) }); finalizeTeam(id); };
  const onRegenerate = async (id:string) => { const r = await fetch('/api/generate-logo', { method: 'POST' }); const j = await r.json(); updateTeam(id, { logoUrl: j.logoUrl }); };

  const allFinal = teams.length>0 && finalizeCount()===teams.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">League Dashboard</h1>
        <ProgressPill />
      </div>
      {!allFinal && (<div className="rounded-xl bg-retro/10 text-retro ring-1 ring-retro/40 p-3 text-sm">Finalize all teams to unlock weekly content.</div>)}
      {allFinal && (<div className="rounded-xl bg-green-600/10 text-green-300 ring-1 ring-green-600/40 p-3 text-sm">All set! <a href="/complete" className="underline">Go to completion page</a></div>)}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {teams.map(team => (
          <TeamCard key={team.id} team={team}
            onEdit={()=>onEdit(team.id)}
            onFinalize={()=>onFinalize(team.id)}
            onRegenerate={()=>onRegenerate(team.id)}
          />
        ))}
      </div>
    </div>
  )
}
