import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useCurrency } from '../../context/CurrencyContext';

// custom centre label for the donut hole
function CentreLabel({ cx, cy, principal, interest, format }) {
  const total = principal + interest;
  const pct = total > 0 ? Math.round((principal / total) * 100) : 0;
  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
      <tspan x={cx} dy="-0.4em" fontSize="22" fontWeight="bold" fill="#1F2937">
        {pct}%
      </tspan>
      <tspan x={cx} dy="1.4em" fontSize="11" fill="#6B7280">
        principal
      </tspan>
    </text>
  );
}

const CustomTooltip = ({ active, payload, format }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="bg-white dark:bg-dark-card border border-surface-border dark:border-dark-border rounded-lg px-3 py-2 shadow-lg text-sm">
      <p className="font-medium text-surface-primary dark:text-dark-primary">{name}</p>
      <p className="tabular-nums text-surface-secondary dark:text-dark-secondary">{format(value)}</p>
    </div>
  );
};

export default function PrincipalInterestPie({ summary }) {
  const { format } = useCurrency();
  if (!summary) return null;

  const principal = summary.totalPaid - summary.totalInterest;
  const interest  = summary.totalInterest;

  const data = [
    { name: 'Principal', value: principal },
    { name: 'Interest',  value: interest  },
  ];

  // teal for principal, coral for interest — consistent with table column colours
  const COLORS = ['#14B8A6', '#F97316'];

  return (
    <div>
      <h3 className="text-sm font-semibold text-surface-primary dark:text-dark-primary mb-4">
        Principal vs Interest Breakdown
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={105}
            paddingAngle={3}
            dataKey="value"
            animationBegin={0}
            animationDuration={600}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} stroke="none" />
            ))}
            {/* centre label rendered as a custom label */}
            <CentreLabel
              cx={0} cy={0}
              principal={principal}
              interest={interest}
              format={format}
            />
          </Pie>
          <Tooltip content={<CustomTooltip format={format} />} />
          <Legend
            iconType="circle"
            iconSize={10}
            formatter={(value) => (
              <span className="text-xs text-surface-secondary dark:text-dark-secondary">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
