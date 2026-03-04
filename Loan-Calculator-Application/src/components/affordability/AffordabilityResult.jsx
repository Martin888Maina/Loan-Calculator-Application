import { useCurrency } from '../../context/CurrencyContext';
import DebtRatioGauge from './DebtRatioGauge';
import { Home, DollarSign, CreditCard, TrendingUp } from 'lucide-react';

function ResultCard({ icon: Icon, label, value, subValue, accent }) {
  const colors = {
    teal:  'text-brand-teal  bg-brand-teal/10',
    green: 'text-brand-green bg-brand-green/10',
    blue:  'text-brand-blue  bg-brand-blue/10',
    amber: 'text-brand-amber bg-brand-amber/10',
    coral: 'text-brand-coral bg-brand-coral/10',
  };
  return (
    <div className="bg-white dark:bg-dark-card rounded-xl border border-surface-border dark:border-dark-border p-5 flex items-start gap-4">
      <div className={`p-2.5 rounded-lg flex-shrink-0 ${colors[accent]}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-surface-secondary dark:text-dark-secondary font-medium mb-0.5">{label}</p>
        <p className="text-xl font-bold text-surface-primary dark:text-dark-primary tabular-nums truncate">{value}</p>
        {subValue && <p className="text-xs text-surface-secondary dark:text-dark-secondary mt-0.5">{subValue}</p>}
      </div>
    </div>
  );
}

export default function AffordabilityResult({ result, inputs }) {
  const { format } = useCurrency();
  if (!result) return null;

  const {
    maxMonthlyPayment,
    maxPaymentFrontEnd,
    maxPaymentBackEnd,
    maxLoanAmount,
    maxAssetPrice,
    currentDTI,
  } = result;

  const hasDownPayment = parseFloat(inputs.downPayment) > 0;

  // total DTI if they take the max loan (existing debts + new payment)
  const newPaymentDTI = inputs.grossMonthlyIncome > 0
    ? ((parseFloat(inputs.existingDebts || 0) + maxMonthlyPayment) / parseFloat(inputs.grossMonthlyIncome)) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* results grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          icon={DollarSign}
          label="Max Monthly Payment"
          value={format(maxMonthlyPayment)}
          subValue={`Conservative of 28% (${format(maxPaymentFrontEnd)}) and 36% back-end (${format(maxPaymentBackEnd)})`}
          accent="teal"
        />
        <ResultCard
          icon={CreditCard}
          label="Maximum Loan Amount"
          value={format(maxLoanAmount)}
          subValue="Based on your income and existing debts"
          accent="blue"
        />
        {hasDownPayment && (
          <ResultCard
            icon={Home}
            label="Maximum Asset / Home Price"
            value={format(maxAssetPrice)}
            subValue={`Loan + ${format(parseFloat(inputs.downPayment))} down payment`}
            accent="green"
          />
        )}
        <ResultCard
          icon={TrendingUp}
          label="Current Debt-to-Income Ratio"
          value={currentDTI > 0 ? `${currentDTI.toFixed(1)}%` : '0%'}
          subValue="Existing debts only, before new loan"
          accent={currentDTI > 36 ? 'coral' : currentDTI > 28 ? 'amber' : 'green'}
        />
      </div>

      {/* DTI gauge section */}
      <div className="bg-white dark:bg-dark-card rounded-xl border border-surface-border dark:border-dark-border p-6">
        <h3 className="text-sm font-semibold text-surface-primary dark:text-dark-primary mb-1">
          Projected DTI with New Loan
        </h3>
        <p className="text-xs text-surface-secondary dark:text-dark-secondary mb-4">
          What your total debt-to-income ratio would be if you took the maximum loan amount.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <DebtRatioGauge dti={newPaymentDTI} />
          <div className="flex-1 space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-brand-green flex-shrink-0" />
              <span className="text-surface-secondary dark:text-dark-secondary">
                <strong className="text-surface-primary dark:text-dark-primary">0–28%</strong> — Comfortable. Most lenders approve easily.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-brand-amber flex-shrink-0" />
              <span className="text-surface-secondary dark:text-dark-secondary">
                <strong className="text-surface-primary dark:text-dark-primary">28–36%</strong> — Stretching. Approval depends on other factors.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-brand-red flex-shrink-0" />
              <span className="text-surface-secondary dark:text-dark-secondary">
                <strong className="text-surface-primary dark:text-dark-primary">36%+</strong> — Risky. Many lenders will decline or require stronger credit.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* explanation card */}
      <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-surface-primary dark:text-dark-primary mb-2">
          How DTI ratios work
        </h3>
        <p className="text-sm text-surface-secondary dark:text-dark-secondary leading-relaxed">
          Lenders use two ratios. The <strong className="text-surface-primary dark:text-dark-primary">front-end ratio</strong> (28%) limits the new housing or loan payment
          to 28% of your gross monthly income. The <strong className="text-surface-primary dark:text-dark-primary">back-end ratio</strong> (36%) limits
          all monthly debt payments — including the new loan — to 36% of income. The stricter of the two
          determines your maximum affordable payment. These are general guidelines; individual lenders may
          use different thresholds.
        </p>
      </div>
    </div>
  );
}
