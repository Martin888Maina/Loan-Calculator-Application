import { addMonths, format } from 'date-fns';

// standard amortization formula — M = P[r(1+r)^n] / [(1+r)^n - 1]
export function calcMonthlyPayment(principal, annualRate, totalMonths) {
  if (principal <= 0 || totalMonths <= 0) return 0;

  // edge case: zero interest loan — just divide principal evenly
  if (annualRate === 0) return round2(principal / totalMonths);

  const r = annualRate / 100 / 12;
  const factor = Math.pow(1 + r, totalMonths);
  return round2((principal * r * factor) / (factor - 1));
}

// build the full month-by-month amortization schedule
export function buildAmortizationSchedule(principal, annualRate, totalMonths, startDate, extraMonthly = 0, lumpSum = null) {
  const schedule = [];
  let balance = principal;
  const monthlyPayment = calcMonthlyPayment(principal, annualRate, totalMonths);
  const r = annualRate / 100 / 12;
  let start = parseStartDate(startDate);

  for (let month = 1; month <= totalMonths; month++) {
    if (balance <= 0) break;

    const interestPortion = round2(balance * r);
    let principalPortion = round2(monthlyPayment - interestPortion);

    // handle the final payment — balance might be slightly less than calculated principal
    if (principalPortion > balance) principalPortion = balance;

    // apply one-time lump sum in the specified month
    let extra = extraMonthly > 0 ? extraMonthly : 0;
    if (lumpSum && lumpSum.month === month) extra += lumpSum.amount;

    // cap extra so we don't overpay
    if (extra > balance - principalPortion) extra = Math.max(0, balance - principalPortion);

    balance = round2(balance - principalPortion - extra);
    if (balance < 0) balance = 0;

    schedule.push({
      month,
      date: format(addMonths(start, month - 1), 'MMM yyyy'),
      payment: round2(monthlyPayment),
      principal: principalPortion,
      interest: interestPortion,
      extra,
      balance,
    });

    if (balance === 0) break;
  }

  return schedule;
}

// summary numbers derived from a completed schedule
export function calcSummary(schedule, principal) {
  const totalPaid = schedule.reduce((s, r) => s + r.payment + r.extra, 0);
  const totalInterest = schedule.reduce((s, r) => s + r.interest, 0);
  const totalExtra = schedule.reduce((s, r) => s + r.extra, 0);
  const last = schedule[schedule.length - 1];

  return {
    monthlyPayment: schedule[0]?.payment ?? 0,
    totalPaid: round2(totalPaid),
    totalInterest: round2(totalInterest),
    totalExtra: round2(totalExtra),
    interestRatio: totalPaid > 0 ? round2((totalInterest / totalPaid) * 100) : 0,
    payoffDate: last?.date ?? '—',
    totalMonths: schedule.length,
  };
}

// helper — parse "YYYY-MM" into a Date object
function parseStartDate(dateStr) {
  if (!dateStr) return new Date();
  const [year, month] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, 1);
}

// round to 2 decimal places — avoids floating point drift over hundreds of rows
function round2(n) {
  return Math.round(n * 100) / 100;
}

// group a flat schedule array into yearly buckets for the collapsible table
export function groupByYear(schedule) {
  const groups = {};
  for (const row of schedule) {
    const year = row.date.split(' ')[1];
    if (!groups[year]) groups[year] = [];
    groups[year].push(row);
  }
  return groups;
}
