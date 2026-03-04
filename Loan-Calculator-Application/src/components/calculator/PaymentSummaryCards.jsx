import { useCurrency } from '../../context/CurrencyContext';
import { TrendingDown, Calendar, DollarSign, Percent, Clock, PiggyBank } from 'lucide-react';

function StatCard({ label, value, subValue, accent, icon: Icon }) {
  const accentMap = {
    teal: 'text-brand-teal bg-brand-teal/10',
    coral: 'text-brand-coral bg-brand-coral/10',
    green: 'text-brand-green bg-brand-green/10',
    blue: 'text-brand-blue bg-brand-blue/10',
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
  const months = totalMonths % 12;
  const termLabel = years > 0
    ? `${years}y${months > 0 ? ` ${months}m` : ''}`
    : `${months}m`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard
        label="Monthly Payment"
        value={format(monthlyPayment)}
        icon={DollarSign}
        accent="teal"
      />
      <StatCard
        label="Total Interest"
        value={format(totalInterest)}
        subValue={`${interestRatio}% of total paid`}
        icon={TrendingDown}
        accent="coral"
      />
      <StatCard
        label="Total Amount Paid"
        value={format(totalPaid)}
        icon={Percent}
        accent="blue"
      />
      <StatCard
        label="Payoff Date"
        value={payoffDate}
        subValue={`${termLabel} from start`}
        icon={Calendar}
        accent="amber"
      />
      {extraImpact && extraImpact.interestSaved > 0 && (
        <>
          <StatCard
            label="Interest Saved"
            value={format(extraImpact.interestSaved)}
            subValue="with extra payments"
            icon={PiggyBank}
            accent="green"
          />
          <StatCard
            label="Months Saved"
            value={`${extraImpact.monthsSaved} months`}
            subValue="earlier payoff"
            icon={Clock}
            accent="green"
          />
        </>
      )}
    </div>
  );
}
