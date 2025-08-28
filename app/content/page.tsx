'use client';
import { useEffect, useMemo, useState } from 'react';
import { useAppStore } from '@/lib/store';
import PosterCard from '@/components/PosterCard';
import JSZip from 'jszip';

type Item = { id: string; svg: string; title: string };

export default function ContentHub() {
  const { week, setWeek, selectedPosterIds, togglePoster, clearSelection, league } = useAppStore();
  const [items, setItems] = useState<Item[]>([]);
  const [tab, setTab] = useState<'matchups'|'recaps'|'power'>('matchups');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string|undefined>(undefined);
  const leagueId = league?.id;

  // Default week to API-provided current if week is unset/1 and no user change yet
  useEffect(() => {
    if (week !== 1) return; // user already interacting
    (async () => {
      try {
        const r = await fetch('/api/state', { cache: 'no-store' });
        const j = await r.json();
        if (typeof j.week === 'number' && j.week >= 1 && j.week <= 18) {
          setWeek(j.week);
        }
      } catch {}
    })();
  }, [setWeek, week]);

  const canLoad = useMemo(() => Boolean(leagueId || (process.env.NEXT_PUBLIC_DATA_PROVIDER === 'mock')), [leagueId]);

  useEffect(() => {
    if (!canLoad) return;
    (async () => {
      setLoading(true);
      setErr(undefined);
      try {
        const res = await fetch('/api/content/generate', {
          method: 'POST',
          body: JSON.stringify({ leagueId, week, tab }),
        });
        const j = await res.json();
        if (!res.ok) throw new Error(j?.error || 'Failed to load content');
        setItems(j.items || []);
        clearSelection();
      } catch (e: any) {
        setErr(e?.message || 'Could not load content.');
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [leagueId, week, tab, clearSelection, canLoad]);

  const downloadSelectedZip = async () => {
    const zip = new JSZip();
    for (const it of items) {
      if (!selectedPosterIds.includes(it.id)) continue;
      const svgBlob = new Blob([it.svg], { type: 'image/svg+xml;charset=utf-8' });
      zip.file(`posters/${it.id}.svg`, svgBlob);
    }
    const content = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(content);
    a.download = `week-${week}-${tab}.zip`;
    a.click();
  };

  if (!leagueId && (process.env.NEXT_PUBLIC_DATA_PROVIDER !== 'mock')) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Weekly Content</h1>
        <div className="rounded-xl bg-neutral-800/60 p-4">
          Load a Sleeper league first on the <a className="underline" href="/">home page</a>.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Weekly Content</h1>
        <div className="flex items-center gap-2">
          <label className="text-sm text-neutral-400">Week</label>
          <select
            value={week}
            onChange={(e)=>setWeek(parseInt(e.target.value))}
            className="rounded-lg bg-card ring-1 ring-neutral-700 px-3 py-2"
          >
            {Array.from({length:18},(_,i)=>i+1).map(w=>(
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {(['matchups','recaps','power'] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`rounded-xl px-4 py-2 ring-1 ring-neutral-700 ${tab===t?'bg-neon text-black':'bg-card'}`}>
            {t[0].toUpperCase()+t.slice(1)}
          </button>
        ))}
        <button onClick={downloadSelectedZip} className="ml-auto rounded-xl bg-gold text-black px-4 py-2">Download Selected (ZIP)</button>
      </div>

      {loading && <div className="rounded-xl bg-neutral-800/60 p-4">Loading content…</div>}
      {err && !loading && <div className="rounded-xl bg-retro/10 text-retro ring-1 ring-retro/40 p-4">{err}</div>}
      {!loading && !err && items.length === 0 && (
        <div className="rounded-xl bg-neutral-800/60 p-4">No matchups for this week yet.</div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {items.map(it => (
          <PosterCard
            key={it.id}
            id={it.id}
            svg={it.svg}
            title={it.title}
            selected={selectedPosterIds.includes(it.id)}
            onToggle={()=>togglePoster(it.id)}
          />
        ))}
      </div>
    </div>
  );
}
