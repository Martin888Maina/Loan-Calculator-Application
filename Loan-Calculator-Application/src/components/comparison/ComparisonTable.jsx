import { useCurrency } from '../../context/CurrencyContext';
import { Trophy } from 'lucide-react';

const SCENARIO_COLORS = [
  { text: 'text-brand-teal',  bg: 'bg-brand-teal/10',  badge: 'bg-brand-teal text-white' },
  { text: 'text-brand-coral', bg: 'bg-brand-coral/10', badge: 'bg-brand-coral text-white' },
  { text: 'text-brand-blue',  bg: 'bg-brand-blue/10',  badge: 'bg-brand-blue text-white' },
];

// find which scenario index has the best (lowest) value for a given metric
function bestIndex(results, key, transform = v => v) {
  let best = null;
  let bestVal = Infinity;
  results.forEach((r, i) => {
    if (!r) return;
    const val = transform(r.summary[key]);
    if (val < bestVal) { bestVal = val; best = i; }
  });
  return best;
}

export default function ComparisonTable({ scenarios, results }) {
  const { format } = useCurrency();

  const anyReady = results.some(r => r !== null);
  if (!anyReady) return null;

  const bestInterest   = bestIndex(results, 'totalInterest');
  const bestPaid       = bestIndex(results, 'totalPaid');
  const bestMonthly    = bestIndex(results, 'monthlyPayment');
  const bestTerm       = bestIndex(results, 'totalMonths');

  const rows = [
    {
      label: 'Monthly Payment',
      key: 'monthlyPayment',
      best: bestMonthly,
      render: v => format(v),
    },
    {
      label: 'Total Interest',
      key: 'totalInterest',
      best: bestInterest,
      render: v => format(v),
    },
    {
      label: 'Total Amount Paid',
      key: 'totalPaid',
      best: bestPaid,
      render: v => format(v),
    },
    {
      label: 'Loan Term',
      key: 'totalMonths',
      best: bestTerm,
      render: v => {
        const y = Math.floor(v / 12);
        const m = v % 12;
        return y > 0 ? `${y}y${m > 0 ? ` ${m}m` : ''}` : `${m}m`;
      },
    },
    {
      label: 'Payoff Date',
      key: 'payoffDate',
      best: null, // no numeric comparison possible
      render: v => v,
    },
    {
      label: 'Interest Ratio',
      key: 'interestRatio',
      best: bestIndex(results, 'interestRatio'),
      render: v => `${v}%`,
    },
  ];

  return (
    <div className="overflow-x-auto rounded-xl border border-surface-border dark:border-dark-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800 border-b border-surface-border dark:border-dark-border">
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-surface-secondary dark:text-dark-secondary w-40">
              Metric
            </th>
            {scenarios.map((s, i) => (
              <th key={i} className="px-5 py-3 text-center">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${SCENARIO_COLORS[i].badge}`}>
                  {s.label}
                </span>
              </th>
            ))}
            {scenarios.length > 1 && (
              <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-surface-secondary dark:text-dark-secondary">
                Difference
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-border/50 dark:divide-dark-border/50">
          {rows.map(({ label, key, best, render }) => {
            // compute difference between scenario A and B (or A and C if 3)
            const vals = results.map(r => r ? r.summary[key] : null);
            const numericVals = vals.filter(v => typeof v === 'number' && v !== null);
            let diffCell = '—';
            if (numericVals.length >= 2 && vals[0] !== null && vals[1] !== null) {
              const diff = vals[1] - vals[0];
              const prefix = diff > 0 ? '+' : '';
              if (key === 'totalInterest' || key === 'totalPaid' || key === 'monthlyPayment') {
                diffCell = `${prefix}${format(diff)}`;
              } else if (key === 'totalMonths') {
                diffCell = `${prefix}${diff}mo`;
              } else if (key === 'interestRatio') {
                diffCell = `${prefix}${diff.toFixed(1)}%`;
              }
            }

            return (
              <tr key={key} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                <td className="px-5 py-3.5 font-medium text-surface-primary dark:text-dark-primary">{label}</td>
                {results.map((r, i) => {
                  const isBest = best === i;
                  const val = r ? render(r.summary[key]) : '—';
                  return (
                    <td key={i} className={`px-5 py-3.5 text-center tabular-nums font-semibold ${isBest ? 'text-brand-green' : 'text-surface-primary dark:text-dark-primary'}`}>
                      <span className={isBest ? 'inline-flex items-center gap-1' : ''}>
                        {isBest && <Trophy size={12} className="text-brand-green flex-shrink-0" />}
                        {val}
                      </span>
                    </td>
                  );
                })}
                {scenarios.length > 1 && (
                  <td className="px-5 py-3.5 text-center tabular-nums text-surface-secondary dark:text-dark-secondary text-xs">
                    {diffCell}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
