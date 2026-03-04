import { useCurrency } from '../../context/CurrencyContext';
import { TrendingDown, Calendar, DollarSign, BarChart, Clock, PiggyBank, Landmark } from 'lucide-react';

function StatCard({ label, value, subValue, accent, icon: Icon }) {
  const accentMap = {
    teal:  'text-brand-teal bg-brand-teal/10',
    coral: 'text-brand-coral bg-brand-coral/10',
    green: 'text-brand-green bg-brand-green/10',
    blue:  'text-brand-blue bg-brand-blue/10',
    amber: 'text-brand-amber bg-brand-amber/10',
  };
  const colors = accentMap[accent] || accentMap.teal;

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl border border-surface-border dark:border-dark-border p-5 flex items-start gap-4">
      <div className={`p-2.5 rounded-lg flex-shrink-0 ${colors}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-surface-secondary dark:text-dark-secondary font-medium mb-0.5">{label}</p>
        <p className="text-xl font-bold text-surface-primary dark:text-dark-primary tabular-nums truncate">{value}</p>
        {subValue && (
          <p className="text-xs text-surface-secondary dark:text-dark-secondary mt-0.5">{subValue}</p>
        )}
      </div>
    </div>
  );
}

export default function PaymentSummaryCards({ summary, extraImpact }) {
  const { format } = useCurrency();

  if (!summary) return null;

  const { monthlyPayment, totalInterest, totalPaid, interestRatio, payoffDate, totalMonths } = summary;
  const years = Math.floor(totalMonths / 12);
  const mos   = totalMonths % 12;
  const termLabel = years > 0
    ? `${years}y${mos > 0 ? ` ${mos}m` : ''}`
    : `${mos}m`;

  // principal paid = total paid minus total interest (excluding extra payments which are also principal)
  const principalPaid = summary.totalPaid - summary.totalInterest;

  const showSavings = extraImpact && extraImpact.interestSaved > 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* the big one — monthly payment gets the most visual weight */}
      <div className="bg-brand-teal text-white rounded-xl p-5 flex items-start gap-4 sm:col-span-2 lg:col-span-1">
        <div className="p-2.5 rounded-lg bg-white/20 flex-shrink-0">
          <DollarSign size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-white/80 mb-0.5">Monthly Payment</p>
          <p className="text-3xl font-bold tabular-nums">{format(monthlyPayment)}</p>
          <p className="text-xs text-white/70 mt-0.5">every month for {termLabel}</p>
        </div>
      </div>

      <StatCard
        label="Total Interest Paid"
        value={format(totalInterest)}
        subValue={`${interestRatio}% of all payments`}
        icon={TrendingDown}
        accent="coral"
      />
      <StatCard
        label="Total Amount Paid"
        value={format(totalPaid)}
        subValue={`Principal + interest`}
        icon={Landmark}
        accent="blue"
      />
      <StatCard
        label="Payoff Date"
        value={payoffDate}
        subValue={`${termLabel} loan term`}
        icon={Calendar}
        accent="amber"
      />
      <StatCard
        label="Principal Paid"
        value={format(principalPaid > 0 ? principalPaid : 0)}
        subValue={`${100 - interestRatio}% of total paid`}
        icon={BarChart}
        accent="teal"
      />
      <StatCard
        label="Number of Payments"
        value={`${totalMonths}`}
        subValue={`${termLabel} term`}
        icon={Clock}
        accent="blue"
      />

      {/* savings cards — only appear when extra payments are active */}
      {showSavings && (
        <>
          <StatCard
            label="Interest Saved"
            value={format(extraImpact.interestSaved)}
            subValue="vs. no extra payments"
            icon={PiggyBank}
            accent="green"
          />
          <StatCard
            label="Months Saved"
            value={`${extraImpact.monthsSaved} month${extraImpact.monthsSaved !== 1 ? 's' : ''}`}
            subValue={`Paid off ${extraImpact.monthsSaved >= 12
              ? `${Math.floor(extraImpact.monthsSaved / 12)}y ${extraImpact.monthsSaved % 12 > 0 ? `${extraImpact.monthsSaved % 12}m` : ''}`.trim()
              : `${extraImpact.monthsSaved}mo`} earlier`}
            icon={Clock}
            accent="green"
          />
        </>
      )}
    </div>
  );
}
