export default function ConferenceLogo({ className = "", variant = "dark", customUrl = null }) {
  if (customUrl && customUrl.length > 5) return <img src={customUrl} alt="ADDA Conference" className={className} />;
  const p = variant === "light" ? "#ffffff" : "#002366";
  return (
    <svg className={className} viewBox="0 0 240 60" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(30,30)">
        <circle cx="0" cy="0" r="26" fill="none" stroke={p} strokeWidth="1.5" opacity="0.3"/>
        <circle cx="0" cy="0" r="22" fill={p}/>
        <text x="0" y="-2" textAnchor="middle" fontFamily="serif" fontSize="13" fontWeight="300" fill="#c9a55a" fontStyle="italic">145</text>
        <line x1="-12" y1="3" x2="12" y2="3" stroke="#c9a55a" strokeWidth="0.5" opacity="0.6"/>
        <text x="0" y="14" textAnchor="middle" fontFamily="serif" fontSize="11" fontWeight="400" fill="white">30</text>
      </g>
      <g transform="translate(70,0)">
        <text x="0" y="24" fontFamily="serif" fontSize="22" fontWeight="400" fill={p} letterSpacing="0.02em">ADDA</text>
        <text x="0" y="40" fontFamily="sans-serif" fontSize="7.5" fontWeight="500" fill={p} letterSpacing="0.18em" opacity="0.7">MARITIME CONFERENCE</text>
        <text x="0" y="52" fontFamily="sans-serif" fontSize="7" fontWeight="400" fill="#c9a55a" letterSpacing="0.12em">BAKU · 29-30 OCT 2026</text>
      </g>
    </svg>
  );
}
