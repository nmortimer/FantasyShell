'use client';
import { useParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import Image from 'next/image';
import RotaryKnob from '@/components/RotaryKnob';
import ColorPicker from '@/components/ColorPicker';
import { useEffect, useState } from 'react';

export default function TeamEditor() {
  const { id } = useParams<{id:string}>();
  const router = useRouter();
  const { teams, updateTeam, finalizeTeam } = useAppStore();
  const team = teams.find(t=>t.id===id);

  useEffect(()=>{ if(!team){ router.push('/dashboard?leagueId=12345'); } }, [team, router]);
  const [changed, setChanged] = useState(false);
  if(!team) return null;

  const handleChange = (patch: any) => { updateTeam(team.id, patch); setChanged(true); };
  const doRegenerate = async () => { const r = await fetch('/api/generate-logo',{ method:'POST' }); const j = await r.json(); handleChange({ logoUrl: j.logoUrl }); };
  const doFinalize = () => { finalizeTeam(team.id); router.push('/dashboard?leagueId=12345'); };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="rounded-2xl bg-card p-4 ring-1 ring-neutral-800">
        <div className="aspect-square relative rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900">
          <Image src={team.logoUrl} alt={`${team.name} logo`} fill className="object-cover" />
        </div>
        <div className="mt-3 text-sm text-neutral-400">Large preview</div>
      </div>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{team.name}</h1>
        <RotaryKnob value={team.stylePack} onChange={(v)=>handleChange({ stylePack: v })} />
        <div className="grid grid-cols-2 gap-3">
          <ColorPicker label="Primary" value={team.primary} onChange={(v)=>handleChange({ primary: v })} />
          <ColorPicker label="Secondary" value={team.secondary} onChange={(v)=>handleChange({ secondary: v })} />
        </div>
        <label className="block">
          <div className="mb-1 text-sm">Mascot Idea</div>
          <input className="w-full rounded-xl bg-card px-4 py-3 outline-none ring-1 ring-neutral-700 focus:ring-neon"
            value={team.mascot ?? ''} onChange={(e)=>handleChange({ mascot: e.target.value })} placeholder="e.g., Ski mask Yeti with teal scarf" />
        </label>
        <div className="flex gap-3">
          <button onClick={doRegenerate} className="rounded-xl bg-neutral-800 px-5 py-3">Regenerate</button>
          <button onClick={()=>setChanged(false)} className="rounded-xl bg-neutral-800 px-5 py-3">Save Draft</button>
          <button onClick={doFinalize} disabled={!changed && team.status==='draft'} className="rounded-xl bg-gold text-black px-5 py-3 disabled:opacity-50">Finalize</button>
        </div>
      </div>
    </div>
  )
}
