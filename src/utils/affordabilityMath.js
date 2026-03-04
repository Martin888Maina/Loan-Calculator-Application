import { calcMonthlyPayment } from './loanMath';
import { DTI_THRESHOLDS } from './constants';

// figure out the max loan given income, debts, rate, and term
export function calcAffordability(grossMonthlyIncome, existingDebts, annualRate, termYears, downPayment = 0) {
  if (!grossMonthlyIncome || grossMonthlyIncome <= 0) return null;

  const totalMonths = termYears * 12;

  // front-end: max payment = 28% of gross income
  const maxPaymentFrontEnd = round2(grossMonthlyIncome * DTI_THRESHOLDS.frontEnd);

  // back-end: max payment = 36% of gross income minus existing debts
  const maxPaymentBackEnd = round2(grossMonthlyIncome * DTI_THRESHOLDS.backEnd - (existingDebts || 0));

  // use the more conservative of the two
  const maxMonthlyPayment = Math.max(0, Math.min(maxPaymentFrontEnd, maxPaymentBackEnd));

  // work backwards from the max payment to find the max loan principal
  const maxLoanAmount = calcMaxPrincipal(maxMonthlyPayment, annualRate, totalMonths);
  const maxAssetPrice = round2(maxLoanAmount + (downPayment || 0));

  const currentDTI = existingDebts > 0
    ? round2(((existingDebts) / grossMonthlyIncome) * 100)
    : 0;

  return {
    maxMonthlyPayment,
    maxPaymentFrontEnd,
    maxPaymentBackEnd,
    maxLoanAmount,
    maxAssetPrice,
    currentDTI,
  };
}

// invert the payment formula to get principal from a known payment amount
function calcMaxPrincipal(payment, annualRate, totalMonths) {
  if (payment <= 0 || totalMonths <= 0) return 0;
  if (annualRate === 0) return round2(payment * totalMonths);

  const r = annualRate / 100 / 12;
  const factor = Math.pow(1 + r, totalMonths);
  return round2((payment * (factor - 1)) / (r * factor));
}

function round2(n) {
  return Math.round(n * 100) / 100;
}
