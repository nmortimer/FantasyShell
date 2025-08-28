'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Landing() {
  const router = useRouter();
  const [leagueId, setLeagueId] = useState('12345');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string|undefined>(undefined);

  const handleLoad = async () => {
    setErr(undefined);
    setLoading(true);
    try {
      // Probe the API so we can show a friendly error early
      const res = await fetch(`/api/league?id=${encodeURIComponent(leagueId)}`, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to load league');
      router.push(`/dashboard?leagueId=${encodeURIComponent(leagueId)}`);
    } catch (e: any) {
      setErr('Couldn’t load this Sleeper league. Check the ID.');
    } finally {
      setLoading(false);
    }
  };

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

        <div className="mt-8 flex gap-3 items-center">
          <input
            className="w-56 rounded-xl bg-card px-4 py-3 outline-none ring-1 ring-neutral-700 focus:ring-neon"
            placeholder="Sleeper League ID"
            value={leagueId}
            onChange={(e)=>setLeagueId(e.target.value)}
          />
          <button
            onClick={handleLoad}
            disabled={loading || !leagueId}
            className="rounded-xl bg-neon px-5 py-3 font-semibold text-black hover:shadow-neon disabled:opacity-50"
            aria-label="Load League"
          >
            {loading ? 'Loading…' : 'Load League'}
          </button>
        </div>
        {err && <div className="mt-3 rounded-xl bg-retro/10 text-retro ring-1 ring-retro/40 p-3 text-sm">{err}</div>}
        <div className="mt-3 text-sm text-neutral-400">
          Data provider: <code>{process.env.NEXT_PUBLIC_DATA_PROVIDER || process.env.DATA_PROVIDER || 'mock'}</code>
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
