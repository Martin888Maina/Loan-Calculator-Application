// semicircle DTI gauge — green/amber/red zones
// built with SVG so there's no extra charting dependency needed

const RADIUS = 80;
const CX = 110;
const CY = 100;

// convert a 0-100 DTI percentage to an angle on the semicircle
// 0% = far left (180°), 100% = far right (0°)
function dtiToAngle(dti) {
  const clamped = Math.min(Math.max(dti, 0), 100);
  // map 0-100 → 180-0 degrees
  return 180 - (clamped / 100) * 180;
}

// polar to cartesian for the needle tip
function polar(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy - r * Math.sin(rad),
  };
}

// arc path for a colour zone
function arcPath(cx, cy, r, startDeg, endDeg) {
  const start = polar(cx, cy, r, startDeg);
  const end   = polar(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y}`;
}

export default function DebtRatioGauge({ dti, maxDti = 50 }) {
  // clamp display range at maxDti so the gauge doesn't go off-scale
  const displayDti = Math.min(dti || 0, maxDti);
  const pct = (displayDti / maxDti) * 100;
  const needleAngle = dtiToAngle(pct);
  const needleTip   = polar(CX, CY, RADIUS - 10, needleAngle);

  // zone boundaries on the 0-maxDti scale
  const safe   = (28 / maxDti) * 100;   // 0 → 28%
  const caution = (36 / maxDti) * 100;  // 28 → 36%
  // risky = 36 → maxDti

  const safeEnd    = dtiToAngle(0);
  const safeStart  = dtiToAngle(safe);
  const cautStart  = dtiToAngle(safe);
  const cautEnd    = dtiToAngle(caution);
  const riskyStart = dtiToAngle(caution);
  const riskyEnd   = dtiToAngle(100);

  let zoneLabel = 'Comfortable';
  let zoneColor = 'text-brand-green';
  if (dti > 36)      { zoneLabel = 'Risky';      zoneColor = 'text-brand-red';   }
  else if (dti > 28) { zoneLabel = 'Stretching'; zoneColor = 'text-brand-amber'; }

  return (
    <div className="flex flex-col items-center">
      <svg width="220" height="120" viewBox="0 0 220 120" aria-label={`DTI gauge: ${dti}%`}>
        {/* background track */}
        <path
          d={arcPath(CX, CY, RADIUS, 0, 180)}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={18}
          strokeLinecap="round"
        />
        {/* green zone */}
        <path
          d={arcPath(CX, CY, RADIUS, safeStart, safeEnd)}
          fill="none"
          stroke="#22C55E"
          strokeWidth={18}
          strokeLinecap="butt"
        />
        {/* amber zone */}
        <path
          d={arcPath(CX, CY, RADIUS, cautEnd, cautStart)}
          fill="none"
          stroke="#F59E0B"
          strokeWidth={18}
          strokeLinecap="butt"
        />
        {/* red zone */}
        <path
          d={arcPath(CX, CY, RADIUS, riskyEnd, riskyStart)}
          fill="none"
          stroke="#EF4444"
          strokeWidth={18}
          strokeLinecap="butt"
        />

        {/* needle */}
        <line
          x1={CX}
          y1={CY}
          x2={needleTip.x}
          y2={needleTip.y}
          stroke="#1F2937"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <circle cx={CX} cy={CY} r={6} fill="#1F2937" />

        {/* zone labels */}
        <text x="18"  y="112" fontSize="9" fill="#22C55E" fontWeight="600">Safe</text>
        <text x="90"  y="20"  fontSize="9" fill="#F59E0B" fontWeight="600" textAnchor="middle">Caution</text>
        <text x="190" y="112" fontSize="9" fill="#EF4444" fontWeight="600" textAnchor="end">Risky</text>
      </svg>

      {/* numeric readout below the gauge */}
      <p className={`text-2xl font-bold ${zoneColor} tabular-nums`}>
        {dti !== null && dti !== undefined ? `${dti.toFixed(1)}%` : '—'}
      </p>
      <p className={`text-xs font-semibold ${zoneColor}`}>{zoneLabel} DTI</p>
    </div>
  );
}
