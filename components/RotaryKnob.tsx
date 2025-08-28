'use client';
type Props = { value: 'v1'|'v2'|'v3'; onChange: (v:'v1'|'v2'|'v3')=>void; };
const positions: ('v1'|'v2'|'v3')[] = ['v1','v2','v3'];
export default function RotaryKnob({ value, onChange }: Props) {
  const index = positions.indexOf(value);
  const deg = [-40, 0, 40][index];
  const setByIndex = (i:number) => onChange(positions[Math.max(0,Math.min(2,i))]);
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') setByIndex(index+1);
    if (e.key === 'ArrowLeft') setByIndex(index-1);
  };
  return (
    <div className="flex items-center gap-4">
      <div role="slider" aria-label="Style Pack" aria-valuemin={0} aria-valuemax={2} aria-valuenow={index}
        tabIndex={0} onKeyDown={handleKey}
        className="relative h-24 w-24 rounded-full border border-neutral-700 bg-card shadow-neon grid place-items-center">
        <div className="absolute inset-0 rounded-full" style={{ boxShadow: index===0?'0 0 10px rgba(0,224,255,.6)':index===1?'0 0 10px rgba(155,48,255,.6)':'0 0 10px rgba(255,215,0,.6)'}} />
        <div className="h-16 w-16 rounded-full bg-neutral-900 relative">
          <div className="absolute left-1/2 top-1/2 h-7 w-1 origin-bottom bg-neon" style={{ transform: `translate(-50%,-100%) rotate(${deg}deg)` }} />
        </div>
        <div className="absolute -bottom-6 w-full text-center text-xs text-neutral-400">← v1 · v2 · v3 →</div>
      </div>
      <div className="text-sm">
        <div><b>Style:</b> {positions[index]}</div>
        <div className="text-neutral-400">Keyboard: ← / → to change</div>
      </div>
    </div>
  )
}
