'use client';

interface TooltipProps {
  text: string;
}

export function Tooltip({ text }: TooltipProps) {
  return (
    <span className="group relative inline-flex items-center">
      <span
        className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-200 text-slate-500 text-xs font-bold cursor-default hover:bg-slate-300 hover:text-slate-700 select-none"
        aria-label={`Help: ${text}`}
        tabIndex={0}
      >
        ?
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 z-30 w-56 rounded-md bg-slate-800 text-white text-xs px-2.5 py-2 leading-relaxed opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity shadow-lg"
      >
        {text}
        <span className="absolute top-1/2 -left-1.5 -translate-y-1/2 border-4 border-transparent border-r-slate-800" />
      </span>
    </span>
  );
}
