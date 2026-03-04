import { useMemo } from 'react';
import {
  calcMonthlyPayment,
  buildAmortizationSchedule,
  calcSummary,
} from '../utils/loanMath';
import {
  buildARMSchedule,
  buildInterestOnlySchedule,
  buildBalloonSchedule,
} from '../utils/loanTypes';

// takes raw form inputs and returns the schedule + summary
export function useLoanCalculator(inputs) {
  return useMemo(() => {
    const {
      loanAmount,
      annualRate,
      termYears,
      termMonths,
      termUnit,
      startDate,
      loanType,
      armInitialPeriod,
      armNewRate,
      interestOnlyPeriod,
      balloonAmortYears,
    } = inputs;

    const principal = parseFloat(loanAmount);
    const rate = parseFloat(annualRate);
    const totalMonths = termUnit === 'months'
      ? parseInt(termMonths)
      : parseInt(termYears) * 12;

    // bail early if inputs aren't ready
    if (!principal || !rate && rate !== 0 || !totalMonths || isNaN(principal) || isNaN(totalMonths)) {
      return { schedule: [], summary: null, isValid: false };
    }
    if (principal <= 0 || totalMonths <= 0) {
      return { schedule: [], summary: null, isValid: false };
    }

    let schedule;

    switch (loanType) {
      case 'arm': {
        const initPeriod = parseFloat(armInitialPeriod) || 5;
        const newRate = parseFloat(armNewRate) || rate;
        const totalYears = totalMonths / 12;
        schedule = buildARMSchedule(principal, rate, initPeriod, newRate, totalYears, startDate);
        break;
      }
      case 'interest-only': {
        const ioPeriod = parseFloat(interestOnlyPeriod) || 5;
        const totalYears = totalMonths / 12;
        schedule = buildInterestOnlySchedule(principal, rate, ioPeriod, totalYears, startDate);
        break;
      }
      case 'balloon': {
        const amortYears = parseFloat(balloonAmortYears) || 30;
        const actualYears = totalMonths / 12;
        schedule = buildBalloonSchedule(principal, rate, actualYears, amortYears, startDate);
        break;
      }
      default:
        schedule = buildAmortizationSchedule(principal, rate, totalMonths, startDate);
    }

    const summary = calcSummary(schedule, principal);
    return { schedule, summary, isValid: true };
  }, [inputs]);
}
