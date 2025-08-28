'use client';
type Props = { label: string; value: string; onChange: (v:string)=>void };
export default function ColorPicker({label, value, onChange}: Props) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-xl bg-card p-3 ring-1 ring-neutral-700">
      <span className="text-sm">{label}</span>
      <input aria-label={label} type="color" className="h-10 w-16 bg-transparent"
        value={value} onChange={(e)=>onChange(e.target.value)} />
    </label>
  );
}
