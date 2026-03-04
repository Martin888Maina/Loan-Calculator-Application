import Papa from 'papaparse';

// turn a schedule array into a downloadable CSV file
export function exportScheduleCSV(schedule, summary, loanInputs, currencyCode) {
  const rows = schedule.map(row => ({
    'Payment #':       row.month,
    'Date':            row.date,
    'Payment':         row.payment.toFixed(2),
    'Principal':       row.principal.toFixed(2),
    'Interest':        row.interest.toFixed(2),
    'Extra Payment':   row.extra > 0 ? row.extra.toFixed(2) : '0.00',
    'Balance':         row.balance.toFixed(2),
  }));

  // append a totals row at the bottom
  const totals = schedule.reduce(
    (acc, r) => ({
      payment:   acc.payment   + r.payment,
      principal: acc.principal + r.principal,
      interest:  acc.interest  + r.interest,
      extra:     acc.extra     + r.extra,
    }),
    { payment: 0, principal: 0, interest: 0, extra: 0 }
  );

  rows.push({
    'Payment #':     'TOTAL',
    'Date':          '',
    'Payment':       totals.payment.toFixed(2),
    'Principal':     totals.principal.toFixed(2),
    'Interest':      totals.interest.toFixed(2),
    'Extra Payment': totals.extra.toFixed(2),
    'Balance':       '0.00',
  });

  const csv = Papa.unparse(rows);
  triggerDownload(csv, `amortization-schedule-${currencyCode}.csv`, 'text/csv');
}

// comparison page export — one column of summary metrics per scenario
export function exportComparisonCSV(scenarios, results, currencyCode) {
  const metrics = [
    'Monthly Payment',
    'Total Interest',
    'Total Paid',
    'Payoff Date',
    'Number of Payments',
    'Interest Ratio (%)',
  ];

  const rows = metrics.map(metric => {
    const row = { Metric: metric };
    scenarios.forEach((s, i) => {
      const r = results[i];
      if (!r) { row[s.label] = '—'; return; }
      const { summary } = r;
      switch (metric) {
        case 'Monthly Payment':       row[s.label] = summary.monthlyPayment.toFixed(2);  break;
        case 'Total Interest':        row[s.label] = summary.totalInterest.toFixed(2);   break;
        case 'Total Paid':            row[s.label] = summary.totalPaid.toFixed(2);       break;
        case 'Payoff Date':           row[s.label] = summary.payoffDate;                 break;
        case 'Number of Payments':    row[s.label] = summary.totalMonths;                break;
        case 'Interest Ratio (%)':    row[s.label] = summary.interestRatio;              break;
        default: row[s.label] = '—';
      }
    });
    return row;
  });

  const csv = Papa.unparse(rows);
  triggerDownload(csv, `loan-comparison-${currencyCode}.csv`, 'text/csv');
}

function triggerDownload(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
