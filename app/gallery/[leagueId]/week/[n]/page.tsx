'use client';
import { useEffect, useState } from 'react';

export default function GalleryPage({ params }: { params: { leagueId: string; n: string }}) {
  const week = Number(params.n) || 1;
  const [items, setItems] = useState<{ id:string; svg:string; title:string }[]>([]);

  useEffect(()=>{
    (async ()=>{
      const res = await fetch('/api/content/generate', { method:'POST', body: JSON.stringify({ week, tab:'matchups' }) });
      const j = await res.json();
      setItems(j.items);
    })();
  }, [week]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Week {week} Posters</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {items.map((it) => (
          <div key={it.id} className="rounded-2xl bg-card ring-1 ring-neutral-800 overflow-hidden">
            <div className="aspect-[16/9] w-full bg-neutral-900" dangerouslySetInnerHTML={{ __html: it.svg }} />
            <div className="p-3 text-sm flex justify-between">
              <span>{it.title}</span>
              <a className="underline" href={`/api/poster/${it.id}`} aria-label="Open poster">Open</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
