import { useMemo } from 'react';
import { calcAffordability } from '../utils/affordabilityMath';

export function useAffordability(inputs) {
  return useMemo(() => {
    const income      = parseFloat(inputs.grossMonthlyIncome);
    const debts       = parseFloat(inputs.existingDebts)      || 0;
    const rate        = parseFloat(inputs.annualRate);
    const termYears   = parseFloat(inputs.termYears);
    const downPayment = parseFloat(inputs.downPayment)        || 0;

    if (!income || isNaN(income) || income <= 0) return null;
    if (isNaN(rate) || rate < 0)                 return null;
    if (!termYears || isNaN(termYears) || termYears <= 0) return null;

    return calcAffordability(income, debts, rate, termYears, downPayment);
  }, [inputs]);
}
