import { useMemo } from 'react';
import { calcExtraPaymentImpact } from '../utils/extraPaymentMath';

// wraps the impact calculation and normalises the inputs coming from the form
export function useExtraPayments(inputs, isValid) {
  return useMemo(() => {
    if (!isValid) return null;

    const extraMonthly = parseFloat(inputs.extraMonthly) || 0;
    const lumpSumAmount = parseFloat(inputs.lumpSumAmount) || 0;
    const lumpSumMonth = parseInt(inputs.lumpSumMonth) || null;

    // nothing extra — skip the calculation entirely
    if (extraMonthly === 0 && lumpSumAmount === 0) return null;

    const principal = parseFloat(inputs.loanAmount);
    const rate = parseFloat(inputs.annualRate);
    const totalMonths = inputs.termUnit === 'months'
      ? parseInt(inputs.termMonths)
      : parseInt(inputs.termYears) * 12;

    if (!principal || isNaN(principal) || !totalMonths || isNaN(totalMonths)) return null;

    const lumpSum = lumpSumAmount > 0 && lumpSumMonth
      ? { amount: lumpSumAmount, month: lumpSumMonth }
      : null;

    return calcExtraPaymentImpact(principal, rate, totalMonths, inputs.startDate, extraMonthly, lumpSum);
  }, [inputs, isValid]);
}
