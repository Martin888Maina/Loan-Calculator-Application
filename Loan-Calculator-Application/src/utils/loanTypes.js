import { buildAmortizationSchedule, calcMonthlyPayment } from './loanMath';
import { addMonths, format } from 'date-fns';

// ARM: fixed rate for initial period, then recalculates on the remaining balance
export function buildARMSchedule(principal, initialRate, initialPeriodYears, newRate, totalYears, startDate) {
  const initialMonths = initialPeriodYears * 12;
  const totalMonths = totalYears * 12;
  const remainingMonths = totalMonths - initialMonths;

  // phase 1 — initial fixed period
  const phase1 = buildAmortizationSchedule(principal, initialRate, totalMonths, startDate);
  const phase1Rows = phase1.slice(0, initialMonths);

  // balance at the end of the fixed period
  const balanceAtAdjustment = phase1Rows[phase1Rows.length - 1]?.balance ?? 0;
  if (balanceAtAdjustment <= 0) return phase1Rows;

  // phase 2 — new rate on remaining balance
  const adjustDate = addMonths(parseStartDate(startDate), initialMonths);
  const adjustDateStr = `${adjustDate.getFullYear()}-${String(adjustDate.getMonth() + 1).padStart(2, '0')}`;
  const phase2 = buildAmortizationSchedule(balanceAtAdjustment, newRate, remainingMonths, adjustDateStr);

  // offset month numbers so the schedule is continuous
  const phase2Rows = phase2.map(row => ({ ...row, month: row.month + initialMonths }));

  return [...phase1Rows, ...phase2Rows];
}

// interest-only: flat interest payments for initial period, then fully amortizes
export function buildInterestOnlySchedule(principal, annualRate, interestOnlyYears, totalYears, startDate) {
  const ioMonths = interestOnlyYears * 12;
  const totalMonths = totalYears * 12;
  const amortMonths = totalMonths - ioMonths;
  const r = annualRate / 100 / 12;
  const start = parseStartDate(startDate);
  const rows = [];

  // phase 1 — interest only
  for (let m = 1; m <= ioMonths; m++) {
    const interest = round2(principal * r);
    rows.push({
      month: m,
      date: format(addMonths(start, m - 1), 'MMM yyyy'),
      payment: interest,
      principal: 0,
      interest,
      extra: 0,
      balance: principal,
    });
  }

  // phase 2 — amortize remaining balance over the rest of the term
  const adjustDate = addMonths(start, ioMonths);
  const adjustDateStr = `${adjustDate.getFullYear()}-${String(adjustDate.getMonth() + 1).padStart(2, '0')}`;
  const phase2 = buildAmortizationSchedule(principal, annualRate, amortMonths, adjustDateStr);
  const phase2Rows = phase2.map(row => ({ ...row, month: row.month + ioMonths }));

  return [...rows, ...phase2Rows];
}

// balloon: amortizes as if a longer term, but shows the lump sum due at actual term end
export function buildBalloonSchedule(principal, annualRate, actualTermYears, amortYears, startDate) {
  const actualMonths = actualTermYears * 12;
  const amortMonths = amortYears * 12;

  // payments are based on the longer amortization period
  const schedule = buildAmortizationSchedule(principal, annualRate, amortMonths, startDate);
  const rows = schedule.slice(0, actualMonths);

  // last row's balance is the balloon payment
  const balloonAmount = rows[rows.length - 1]?.balance ?? 0;
  if (rows.length > 0) {
    rows[rows.length - 1] = { ...rows[rows.length - 1], balloonPayment: balloonAmount };
  }

  return rows;
}

function parseStartDate(dateStr) {
  if (!dateStr) return new Date();
  const [year, month] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, 1);
}

function round2(n) {
  return Math.round(n * 100) / 100;
}
