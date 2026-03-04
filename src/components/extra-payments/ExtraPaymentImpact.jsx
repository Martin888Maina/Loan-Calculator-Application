import { useCurrency } from '../../context/CurrencyContext';
import { TrendingDown, Clock, Calendar, ArrowRight, PiggyBank } from 'lucide-react';

// one column in the comparison table
function ScenarioColumn({ label, summary, highlight, format }) {
  const { monthlyPayment, totalInterest, totalPaid, interestRatio, payoffDate, totalMonths } = summary;
  const years = Math.floor(totalMonths / 12);
  const mos = totalMonths % 12;
  const termStr = years > 0 ? `${years}y ${mos > 0 ? `${mos}m` : ''}`.trim() : `${mos}m`;

  const rowCls = 'flex items-center justify-between py-2.5 border-b border-surface-border/50 dark:border-dark-border/50 last:border-0';
  const valCls = `font-semibold tabular-nums ${highlight ? 'text-brand-green' : 'text-surface-primary dark:text-dark-primary'}`;

  return (
    <div className={`flex-1 rounded-xl border-2 p-5 ${highlight ? 'border-brand-green bg-brand-green/5' : 'border-surface-border dark:border-dark-border bg-white dark:bg-dark-card'}`}>
      <p className={`text-xs font-semibold uppercase tracking-wide mb-4 ${highlight ? 'text-brand-green' : 'text-surface-secondary dark:text-dark-secondary'}`}>
        {label}
        {highlight && <span className="ml-2 bg-brand-green text-white text-[10px] px-1.5 py-0.5 rounded-full">Saves more</span>}
      </p>

      <div className={rowCls}>
        <span className="text-sm text-surface-secondary dark:text-dark-secondary">Monthly payment</span>
        <span className={valCls}>{format(monthlyPayment)}</span>
      </div>
      <div className={rowCls}>
        <span className="text-sm text-surface-secondary dark:text-dark-secondary">Total interest</span>
        <span className={`${valCls} ${!highlight ? 'text-brand-coral' : ''}`}>{format(totalInterest)}</span>
      </div>
      <div className={rowCls}>
        <span className="text-sm text-surface-secondary dark:text-dark-secondary">Total paid</span>
        <span className={valCls}>{format(totalPaid)}</span>
      </div>
      <div className={rowCls}>
        <span className="text-sm text-surface-secondary dark:text-dark-secondary">Payoff date</span>
        <span className={valCls}>{payoffDate}</span>
      </div>
      <div className={rowCls}>
        <span className="text-sm text-surface-secondary dark:text-dark-secondary">Loan term</span>
        <span className={valCls}>{termStr}</span>
      </div>
      <div className={rowCls}>
        <span className="text-sm text-surface-secondary dark:text-dark-secondary">Interest ratio</span>
        <span className={valCls}>{interestRatio}%</span>
      </div>
    </div>
  );
}

export default function ExtraPaymentImpact({ impact }) {
  const { format } = useCurrency();

  if (!impact) return null;

  const { base, withExtra, interestSaved, monthsSaved } = impact;

  return (
    <div className="space-y-4">
      {/* savings headline banner */}
      {interestSaved > 0 && (
        <div className="bg-brand-green/10 border border-brand-green/30 rounded-xl p-5">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-green/20 flex items-center justify-center flex-shrink-0">
                <PiggyBank size={20} className="text-brand-green" />
              </div>
              <div>
                <p className="text-xs text-surface-secondary dark:text-dark-secondary font-medium">Interest saved</p>
                <p className="text-2xl font-bold text-brand-green tabular-nums">{format(interestSaved)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-green/20 flex items-center justify-center flex-shrink-0">
                <Clock size={20} className="text-brand-green" />
              </div>
              <div>
                <p className="text-xs text-surface-secondary dark:text-dark-secondary font-medium">Time saved</p>
                <p className="text-2xl font-bold text-brand-green">
                  {monthsSaved >= 12
                    ? `${Math.floor(monthsSaved / 12)}y ${monthsSaved % 12 > 0 ? `${monthsSaved % 12}m` : ''}`.trim()
                    : `${monthsSaved} month${monthsSaved !== 1 ? 's' : ''}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-green/20 flex items-center justify-center flex-shrink-0">
                <Calendar size={20} className="text-brand-green" />
              </div>
              <div>
                <p className="text-xs text-surface-secondary dark:text-dark-secondary font-medium">New payoff date</p>
                <p className="text-2xl font-bold text-brand-green">{withExtra.summary.payoffDate}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* side-by-side comparison columns */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch">
        <ScenarioColumn
          label="Without extra payments"
          summary={base.summary}
          highlight={false}
          format={format}
        />
        <div className="flex items-center justify-center flex-shrink-0">
          <ArrowRight size={20} className="text-surface-secondary dark:text-dark-secondary rotate-90 sm:rotate-0" />
        </div>
        <ScenarioColumn
          label="With extra payments"
          summary={withExtra.summary}
          highlight={true}
          format={format}
        />
      </div>

      {/* breakdown of what the extra payments consist of */}
      {withExtra.summary.totalExtra > 0 && (
        <div className="flex items-center gap-2 text-xs text-surface-secondary dark:text-dark-secondary bg-gray-50 dark:bg-gray-800/50 rounded-lg px-4 py-2.5">
          <TrendingDown size={13} className="text-brand-green flex-shrink-0" />
          Total extra principal applied: <span className="font-semibold text-brand-green ml-1">{format(withExtra.summary.totalExtra)}</span>
        </div>
      )}
    </div>
  );
}
