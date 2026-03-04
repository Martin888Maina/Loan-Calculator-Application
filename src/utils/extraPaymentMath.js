import { buildAmortizationSchedule, calcSummary } from './loanMath';

// compare a base schedule against one with extra payments applied
export function calcExtraPaymentImpact(principal, annualRate, totalMonths, startDate, extraMonthly, lumpSum) {
  const base = buildAmortizationSchedule(principal, annualRate, totalMonths, startDate);
  const withExtra = buildAmortizationSchedule(principal, annualRate, totalMonths, startDate, extraMonthly, lumpSum);

  const baseSummary = calcSummary(base, principal);
  const extraSummary = calcSummary(withExtra, principal);

  const interestSaved = round2(baseSummary.totalInterest - extraSummary.totalInterest);
  const monthsSaved = baseSummary.totalMonths - extraSummary.totalMonths;

  return {
    base: { schedule: base, summary: baseSummary },
    withExtra: { schedule: withExtra, summary: extraSummary },
    interestSaved,
    monthsSaved,
  };
}

function round2(n) {
  return Math.round(n * 100) / 100;
}
