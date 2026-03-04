import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { groupByYear } from '../../utils/loanMath';
import EmptyState from '../common/EmptyState';

function YearRow({ year, rows, showExtra }) {
  const [open, setOpen] = useState(false);
  const { format } = useCurrency();

  const yearTotals = rows.reduce(
    (acc, r) => ({
      payment: acc.payment + r.payment,
      principal: acc.principal + r.principal,
      interest: acc.interest + r.interest,
      extra: acc.extra + r.extra,
    }),
    { payment: 0, principal: 0, interest: 0, extra: 0 }
  );

  const lastBalance = rows[rows.length - 1]?.balance ?? 0;

  return (
    <>
      {/* year summary row — clickable to expand */}
      <tr
        className="bg-gray-50 dark:bg-gray-800/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <td className="px-4 py-3 font-semibold text-surface-primary dark:text-dark-primary">
          <span className="flex items-center gap-2">
            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            {year}
          </span>
        </td>
        <td className="px-4 py-3 text-right font-medium tabular-nums">{format(yearTotals.payment)}</td>
        <td className="px-4 py-3 text-right text-brand-teal font-medium tabular-nums">{format(yearTotals.principal)}</td>
        <td className="px-4 py-3 text-right text-brand-coral font-medium tabular-nums">{format(yearTotals.interest)}</td>
        {showExtra && <td className="px-4 py-3 text-right text-brand-green font-medium tabular-nums">{format(yearTotals.extra)}</td>}
        <td className="px-4 py-3 text-right tabular-nums">{format(lastBalance)}</td>
      </tr>

      {/* individual month rows */}
      {open && rows.map(row => (
        <tr key={row.month} className="border-t border-surface-border/30 dark:border-dark-border/30 hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
          <td className="px-4 py-2 pl-10 text-sm text-surface-secondary dark:text-dark-secondary">{row.date}</td>
          <td className="px-4 py-2 text-right text-sm tabular-nums">{format(row.payment)}</td>
          <td className="px-4 py-2 text-right text-sm text-brand-teal tabular-nums">{format(row.principal)}</td>
          <td className="px-4 py-2 text-right text-sm text-brand-coral tabular-nums">{format(row.interest)}</td>
          {showExtra && (
            <td className="px-4 py-2 text-right text-sm text-brand-green tabular-nums">
              {row.extra > 0 ? format(row.extra) : '—'}
            </td>
          )}
          <td className="px-4 py-2 text-right text-sm tabular-nums">{format(row.balance)}</td>
        </tr>
      ))}
    </>
  );
}

export default function AmortizationTable({ schedule, showExtra = false }) {
  const { format } = useCurrency();

  if (!schedule || schedule.length === 0) {
    return (
      <EmptyState
        title="No schedule yet"
        description="Enter your loan details above to see the full amortization schedule."
      />
    );
  }

  const grouped = groupByYear(schedule);
  const totals = schedule.reduce(
    (acc, r) => ({
      payment: acc.payment + r.payment,
      principal: acc.principal + r.principal,
      interest: acc.interest + r.interest,
      extra: acc.extra + r.extra,
    }),
    { payment: 0, principal: 0, interest: 0, extra: 0 }
  );

  return (
    <div className="overflow-x-auto rounded-xl border border-surface-border dark:border-dark-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800 text-surface-secondary dark:text-dark-secondary text-xs uppercase tracking-wide">
            <th className="px-4 py-3 text-left">Period</th>
            <th className="px-4 py-3 text-right">Payment</th>
            <th className="px-4 py-3 text-right text-brand-teal">Principal</th>
            <th className="px-4 py-3 text-right text-brand-coral">Interest</th>
            {showExtra && <th className="px-4 py-3 text-right text-brand-green">Extra</th>}
            <th className="px-4 py-3 text-right">Balance</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-border/50 dark:divide-dark-border/50 text-surface-primary dark:text-dark-primary">
          {Object.entries(grouped).map(([year, rows]) => (
            <YearRow key={year} year={year} rows={rows} showExtra={showExtra} />
          ))}
        </tbody>
        {/* running totals footer */}
        <tfoot>
          <tr className="bg-brand-teal/5 dark:bg-brand-teal/10 font-semibold border-t-2 border-brand-teal/30">
            <td className="px-4 py-3 text-surface-primary dark:text-dark-primary">Totals</td>
            <td className="px-4 py-3 text-right tabular-nums">{format(totals.payment)}</td>
            <td className="px-4 py-3 text-right text-brand-teal tabular-nums">{format(totals.principal)}</td>
            <td className="px-4 py-3 text-right text-brand-coral tabular-nums">{format(totals.interest)}</td>
            {showExtra && <td className="px-4 py-3 text-right text-brand-green tabular-nums">{format(totals.extra)}</td>}
            <td className="px-4 py-3 text-right tabular-nums">—</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
