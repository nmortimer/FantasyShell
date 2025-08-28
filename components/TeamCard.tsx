'use client';
import Image from 'next/image';
import { Team } from '@/lib/store';

type Props = {
  team: Team;
  onEdit: ()=>void;
  onFinalize: ()=>void;
  onRegenerate: ()=>void;
};

export default function TeamCard({ team, onEdit, onFinalize, onRegenerate }: Props) {
  return (
    <div className="rounded-2xl bg-card p-4 ring-1 ring-neutral-800 neon-hover">
      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-1 rounded-full ${team.status==='final'?'bg-green-600/20 text-green-300':'bg-neutral-700/40 text-neutral-200'}`}>
          {team.status==='final'?'Final':'Draft'}
        </span>
        <span className="text-xs text-neutral-400">Manager: {team.manager}</span>
      </div>
      <div className="mt-3 aspect-square relative rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900">
        <Image src={team.logoUrl} alt={`${team.name} logo`} fill className="object-cover" />
      </div>
      <div className="mt-3 font-semibold">{team.name}</div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <button onClick={onRegenerate} className="rounded-lg bg-neutral-800 px-3 py-2 text-sm hover:shadow-neon" aria-label="Regenerate">Regenerate</button>
        <button onClick={onEdit} className="rounded-lg bg-neon text-black px-3 py-2 text-sm hover:shadow-neon" aria-label="Edit">Edit</button>
        <button onClick={onFinalize} disabled={team.status==='final'} className="rounded-lg bg-gold text-black px-3 py-2 text-sm disabled:opacity-50" aria-label="Finalize">Finalize</button>
      </div>
    </div>
  )
}
