'use client';
import { useAppStore } from '@/lib/store';
export default function ProgressPill() {
  const teams = useAppStore(s=>s.teams);
  const count = teams.filter(t=>t.status==='final').length;
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1 text-sm ring-1 ring-neutral-700">
      <span className="inline-block h-2 w-2 rounded-full bg-neon" /> {count}/{teams.length} Finalized
    </div>
  )
}
