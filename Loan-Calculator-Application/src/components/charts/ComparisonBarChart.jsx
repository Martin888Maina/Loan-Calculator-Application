import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, Cell,
} from 'recharts';
import { useCurrency } from '../../context/CurrencyContext';

// bar colours per scenario — same palette as ComparisonForm panels
const SCENARIO_COLORS = ['#0D9488', '#F97316', '#3B82F6'];

const CustomTooltip = ({ active, payload, label, format }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-dark-card border border-surface-border dark:border-dark-border rounded-lg px-3 py-2 shadow-lg text-xs space-y-1">
      <p className="font-semibold text-surface-primary dark:text-dark-primary mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }} className="tabular-nums">
          {p.dataKey}: {format(p.value)}
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

export default function ComparisonBarChart({ scenarios, results }) {
  const { format } = useCurrency();

  const ready = results.map((r, i) => ({ r, s: scenarios[i] })).filter(({ r }) => r !== null);
  if (ready.length < 2) return null;

  // three grouped bar datasets — monthly payment, total interest, total paid
  const metrics = [
    { key: 'monthlyPayment', label: 'Monthly Payment' },
    { key: 'totalInterest',  label: 'Total Interest'  },
    { key: 'totalPaid',      label: 'Total Paid'       },
  ];

  // reshape into [{metric, ScenarioA: val, ScenarioB: val, ...}]
  const data = metrics.map(({ key, label }) => {
    const entry = { metric: label };
    ready.forEach(({ r, s }) => { entry[s.label] = r.summary[key]; });
    return entry;
  });

  return (
    <div>
      <h3 className="text-sm font-semibold text-surface-primary dark:text-dark-primary mb-4">
        Scenario Comparison
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
          <XAxis
            dataKey="metric"
            tick={{ fontSize: 11, fill: '#6B7280' }}
            tickLine={false}
            axisLine={false}
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
          {ready.map(({ s }, i) => (
            <Bar
              key={s.label}
              dataKey={s.label}
              fill={SCENARIO_COLORS[i]}
              radius={[4, 4, 0, 0]}
              maxBarSize={60}
              animationDuration={600}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
