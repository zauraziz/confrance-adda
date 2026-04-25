"use client";
export default function MarqueeStrip() {
  return (
    <div className="bg-navy text-white py-8 overflow-hidden">
      <div className="flex items-center gap-16 whitespace-nowrap"
           style={{ animation: "adda-marquee 45s linear infinite" }}>
        {Array.from({ length: 4 }).map((_, k) => (
          <div key={k} className="flex items-center gap-16 shrink-0">
            <span className="font-display text-[38px] font-light italic">145 + 30</span>
            <span className="text-gold">◆</span>
            <span className="text-[12px] tracking-[0.3em] uppercase">Caspian · International · Diplomatic</span>
            <span className="text-gold">◆</span>
            <span className="font-display text-[38px] font-light">Anchored in heritage</span>
            <span className="text-gold">◆</span>
            <span className="text-[12px] tracking-[0.3em] uppercase">Baku · 15–17 June 2026</span>
            <span className="text-gold">◆</span>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes adda-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
