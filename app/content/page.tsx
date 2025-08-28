'use client';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import PosterCard from '@/components/PosterCard';
import JSZip from 'jszip';

export default function ContentHub() {
  const { week, setWeek, selectedPosterIds, togglePoster, clearSelection } = useAppStore();
  const [items, setItems] = useState<{ id:string; svg:string; title:string }[]>([]);
  const [tab, setTab] = useState<'matchups'|'recaps'|'power'>('matchups');

  useEffect(()=>{
    const load = async () => {
      const res = await fetch('/api/content/generate', { method:'POST', body: JSON.stringify({ week, tab }) });
      const j = await res.json();
      setItems(j.items);
      clearSelection();
    };
    load();
  }, [week, tab, clearSelection]);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Weekly Content</h1>
        <div className="flex items-center gap-2">
          <button onClick={()=>setWeek(Math.max(1, week-1))} className="rounded-lg bg-neutral-800 px-3 py-2">–</button>
          <div>Week {week}</div>
          <button onClick={()=>setWeek(week+1)} className="rounded-lg bg-neutral-800 px-3 py-2">+</button>
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
      <div className="grid md:grid-cols-2 gap-4">
        {items.map(it => (
          <PosterCard key={it.id} id={it.id} svg={it.svg} title={it.title}
            selected={selectedPosterIds.includes(it.id)}
            onToggle={()=>togglePoster(it.id)} />
        ))}
      </div>
    </div>
  )
}
