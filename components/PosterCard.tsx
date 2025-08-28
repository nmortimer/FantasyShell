'use client';
type Props = { id: string; svg: string; title: string; selected: boolean; onToggle: ()=>void; };
export default function PosterCard({ id, svg, title, selected, onToggle }: Props) {
  const downloadPNG = async () => {
    const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image(); img.crossOrigin = 'anonymous'; img.src = url; await img.decode();
    const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 675;
    const ctx = canvas.getContext('2d')!; ctx.fillStyle = '#111'; ctx.fillRect(0,0,1200,675); ctx.drawImage(img,0,0,1200,675);
    canvas.toBlob((blob)=>{ if(!blob) return; const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`${id}.png`; a.click(); URL.revokeObjectURL(a.href); URL.revokeObjectURL(url); });
  };
  const copyLink = async () => { const loc = window.location.origin + `/api/poster/${id}`; await navigator.clipboard.writeText(loc); alert('Link copied!'); };
  return (
    <div className={`rounded-2xl bg-card ring-1 ring-neutral-800 overflow-hidden ${selected?'outline outline-2 outline-neon':''}`}>
      <div className="aspect-[16/9] w-full bg-neutral-900" dangerouslySetInnerHTML={{ __html: svg }} />
      <div className="p-3 flex items-center justify-between">
        <div className="text-sm">{title}</div>
        <div className="flex items-center gap-2">
          <button onClick={downloadPNG} className="rounded-lg bg-neutral-800 px-3 py-1.5 text-sm">Download PNG</button>
          <button onClick={copyLink} className="rounded-lg bg-neutral-800 px-3 py-1.5 text-sm">Copy Link</button>
          <label className="text-sm inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={selected} onChange={onToggle} /> Select
          </label>
        </div>
      </div>
    </div>
  );
}
