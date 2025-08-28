'use client';
import Confetti from '@/components/Confetti';
import JSZip from 'jszip';
import { useAppStore } from '@/lib/store';

export default function CompletePage() {
  const { teams } = useAppStore();
  const downloadAll = async () => {
    const zip = new JSZip();
    for (const t of teams) {
      const res = await fetch(t.logoUrl);
      const blob = await res.blob();
      zip.file(`logos/${t.name.replaceAll(' ','_')}.png`, blob);
    }
    const content = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(content);
    a.download = 'league-logos.zip';
    a.click();
  };

  return (
    <div className="text-center">
      <Confetti />
      <h1 className="text-4xl font-bold">League Created!</h1>
      <p className="mt-2 text-neutral-300">You can now download all logos or jump into weekly content.</p>
      <div className="mt-6 flex items-center justify-center gap-4">
        <button onClick={downloadAll} className="rounded-xl bg-neon text-black px-5 py-3">Download All Logos (ZIP)</button>
        <a href="/content" className="rounded-xl bg-gold text-black px-5 py-3">Go to Weekly Content</a>
      </div>
    </div>
  )
}
