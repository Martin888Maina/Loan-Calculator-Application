import { useMemo } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/common/Card';
import LoanForm from '../components/calculator/LoanForm';
import PaymentSummaryCards from '../components/calculator/PaymentSummaryCards';
import AmortizationTable from '../components/calculator/AmortizationTable';
import { useLoan } from '../context/LoanContext';
import { useLoanCalculator } from '../hooks/useLoanCalculator';
import { calcExtraPaymentImpact } from '../utils/extraPaymentMath';

export default function CalculatorPage() {
  const { state } = useLoan();
  const { inputs } = state;

  const { schedule, summary, isValid } = useLoanCalculator(inputs);

  // only run extra payment calculations if there's something to compare
  const extraImpact = useMemo(() => {
    if (!isValid) return null;
    const extraMonthly = parseFloat(inputs.extraMonthly) || 0;
    const lumpSumAmount = parseFloat(inputs.lumpSumAmount) || 0;
    const lumpSumMonth = parseInt(inputs.lumpSumMonth) || null;
    if (extraMonthly === 0 && lumpSumAmount === 0) return null;

    const principal = parseFloat(inputs.loanAmount);
    const rate = parseFloat(inputs.annualRate);
    const totalMonths = inputs.termUnit === 'months'
      ? parseInt(inputs.termMonths)
      : parseInt(inputs.termYears) * 12;

    const lumpSum = lumpSumAmount > 0 && lumpSumMonth ? { amount: lumpSumAmount, month: lumpSumMonth } : null;
    return calcExtraPaymentImpact(principal, rate, totalMonths, inputs.startDate, extraMonthly, lumpSum);
  }, [inputs, isValid]);

  const displaySchedule = extraImpact ? extraImpact.withExtra.schedule : schedule;
  const displaySummary = extraImpact ? extraImpact.withExtra.summary : summary;
  const showExtra = !!(extraImpact);

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
          {/* summary cards */}
          {isValid && (
            <PaymentSummaryCards summary={displaySummary} extraImpact={extraImpact} />
          )}

          {/* amortization table */}
          <Card className="p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-surface-border dark:border-dark-border flex items-center justify-between">
              <h2 className="text-base font-semibold text-surface-primary dark:text-dark-primary">
                Amortization Schedule
              </h2>
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
