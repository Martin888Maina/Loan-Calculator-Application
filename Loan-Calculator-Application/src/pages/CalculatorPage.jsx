import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/common/Card';
import LoanForm from '../components/calculator/LoanForm';
import PaymentSummaryCards from '../components/calculator/PaymentSummaryCards';
import AmortizationTable from '../components/calculator/AmortizationTable';
import ExtraPaymentImpact from '../components/extra-payments/ExtraPaymentImpact';
import { useLoan } from '../context/LoanContext';
import { useLoanCalculator } from '../hooks/useLoanCalculator';
import { useExtraPayments } from '../hooks/useExtraPayments';

export default function CalculatorPage() {
  const { state } = useLoan();
  const { inputs } = state;

  const { schedule, summary, isValid } = useLoanCalculator(inputs);
  const extraImpact = useExtraPayments(inputs, isValid);

  // when extra payments are active, show the modified schedule and summary
  const displaySchedule = extraImpact ? extraImpact.withExtra.schedule : schedule;
  const displaySummary  = extraImpact ? extraImpact.withExtra.summary  : summary;
  const showExtra       = !!extraImpact;

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-primary dark:text-dark-primary">Loan Calculator</h1>
        <p className="text-surface-secondary dark:text-dark-secondary mt-1">
          Enter your loan details to generate a full amortization schedule.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* left panel — inputs */}
        <div className="lg:col-span-1">
          <Card>
            <h2 className="text-base font-semibold text-surface-primary dark:text-dark-primary mb-4">Loan Details</h2>
            <LoanForm />
          </Card>
        </div>

        {/* right panel — results */}
        <div className="lg:col-span-2 space-y-6">

          {/* summary statistics cards */}
          {isValid && (
            <PaymentSummaryCards summary={displaySummary} extraImpact={extraImpact} />
          )}

          {/* extra payment impact — only shown when extra payments are entered */}
          {isValid && extraImpact && (
            <Card>
              <h2 className="text-base font-semibold text-surface-primary dark:text-dark-primary mb-4">
                Extra Payment Analysis
              </h2>
              <ExtraPaymentImpact impact={extraImpact} />
            </Card>
          )}

          {/* amortization schedule table */}
          <Card className="p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-surface-border dark:border-dark-border flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-surface-primary dark:text-dark-primary">
                  Amortization Schedule
                </h2>
                {showExtra && (
                  <p className="text-xs text-brand-green mt-0.5">Showing schedule with extra payments applied</p>
                )}
              </div>
              {isValid && (
                <span className="text-xs text-surface-secondary dark:text-dark-secondary">
                  {displaySchedule.length} payments
                </span>
              )}
            </div>
            <div className="p-6">
              <AmortizationTable schedule={displaySchedule} showExtra={showExtra} />
            </div>
          </Card>

        </div>
      </div>
    </PageWrapper>
  );
}
