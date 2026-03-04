import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';
import { useCurrency } from '../../context/CurrencyContext';

function sampleSchedule(schedule, maxPoints = 120) {
  if (schedule.length <= maxPoints) return schedule;
  const step = Math.ceil(schedule.length / maxPoints);
  return schedule.filter((_, i) => i % step === 0 || i === schedule.length - 1);
}

const CustomTooltip = ({ active, payload, label, format }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-dark-card border border-surface-border dark:border-dark-border rounded-lg px-3 py-2 shadow-lg text-xs space-y-1">
      <p className="font-semibold text-surface-primary dark:text-dark-primary mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="tabular-nums">
          {p.name}: {format(p.value)}
        </p>
      ))}
    </div>
  );
};

function shortFormat(v) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `${(v / 1_000).toFixed(0)}K`;
  return v;
}

export default function BalanceAreaChart({ schedule, scheduleWithExtra }) {
  const { format } = useCurrency();
  if (!schedule || schedule.length === 0) return null;

  const hasExtra = scheduleWithExtra && scheduleWithExtra.length > 0;

  // merge both schedules by month index
  const baseData = sampleSchedule(schedule);
  const extraMap = {};
  if (hasExtra) {
    sampleSchedule(scheduleWithExtra).forEach(r => {
      extraMap[r.month] = r.balance;
    });
  }

  const data = baseData.map(row => ({
    date: row.date,
    'Standard': row.balance,
    ...(hasExtra && { 'With Extra': extraMap[row.month] ?? null }),
  }));

  return (
    <div>
      <h3 className="text-sm font-semibold text-surface-primary dark:text-dark-primary mb-4">
        Remaining Balance Over Time
        {hasExtra && (
          <span className="ml-2 text-xs font-normal text-brand-green">
            (dashed = with extra payments)
          </span>
        )}
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gradBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#14B8A6" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gradExtra" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#22C55E" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#22C55E" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#6B7280' }}
            interval="preserveStartEnd"
            tickLine={false}
          />
          <YAxis
            tickFormatter={shortFormat}
            tick={{ fontSize: 10, fill: '#6B7280' }}
            tickLine={false}
            axisLine={false}
            width={48}
          />
          <Tooltip content={<CustomTooltip format={format} />} />
          <Legend
            iconType="circle"
            iconSize={10}
            formatter={v => <span className="text-xs text-surface-secondary dark:text-dark-secondary">{v}</span>}
          />
          <Area
            type="monotone"
            dataKey="Standard"
            stroke="#14B8A6"
            strokeWidth={2}
            fill="url(#gradBalance)"
            animationDuration={600}
          />
          {hasExtra && (
            <Area
              type="monotone"
              dataKey="With Extra"
              stroke="#22C55E"
              strokeWidth={2}
              strokeDasharray="5 3"
              fill="url(#gradExtra)"
              animationDuration={600}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
