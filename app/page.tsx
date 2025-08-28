'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Landing() {
  const router = useRouter();
  const [leagueId, setLeagueId] = useState('12345');
  return (
    <div className="grid md:grid-cols-2 gap-10 items-center">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Build <span className="text-neon">logos</span>, hype <span className="text-gold">posters</span>, and weekly <span className="text-purple">recaps</span>.
        </h1>
        <ul className="mt-6 space-y-2 text-neutral-300">
          <li>• Retro trading-card vibes, modern polish</li>
          <li>• Edit colors, style packs, mascot ideas</li>
          <li>• Download PNGs or a ZIP for your league</li>
        </ul>
        <div className="mt-8 flex gap-3">
          <input className="w-56 rounded-xl bg-card px-4 py-3 outline-none ring-1 ring-neutral-700 focus:ring-neon"
            placeholder="Enter League ID" value={leagueId} onChange={(e)=>setLeagueId(e.target.value)} />
          <button onClick={()=>router.push(`/dashboard?leagueId=${encodeURIComponent(leagueId)}`)}
            className="rounded-xl bg-neon px-5 py-3 font-semibold text-black hover:shadow-neon" aria-label="Load League">
            Load League
          </button>
        </div>
      </div>
      <div className="rounded-2xl bg-card p-6 shadow-neon neon-hover">
        <div className="text-lg font-semibold mb-2">Preview</div>
        <div className="aspect-[16/10] w-full rounded-xl bg-gradient-to-br from-purple/20 to-neon/10 grid place-items-center border border-neutral-800">
          <span className="font-bebas text-5xl tracking-wider text-gold">CARD FRAME</span>
        </div>
      </div>
    </div>
  )
}
