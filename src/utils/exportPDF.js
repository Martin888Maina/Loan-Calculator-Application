import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// generates a PDF with loan summary and full amortization schedule
export function exportSchedulePDF(schedule, summary, inputs, currencyCode) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;

  // ── header ──
  doc.setFontSize(18);
  doc.setTextColor(13, 148, 136); // brand teal
  doc.text('Loan Amortization Schedule', margin, 20);

  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  doc.text(`Generated: ${new Date().toLocaleDateString()}   Currency: ${currencyCode}`, margin, 27);

  // ── loan parameters box ──
  doc.setFontSize(11);
  doc.setTextColor(31, 41, 55);
  doc.text('Loan Parameters', margin, 38);

  const params = [
    ['Loan Amount',      fmt(parseFloat(inputs.loanAmount), currencyCode)],
    ['Annual Rate',      `${inputs.annualRate}%`],
    ['Term',            inputs.termUnit === 'years' ? `${inputs.termYears} years` : `${inputs.termMonths} months`],
    ['Loan Type',        (inputs.loanType || 'fixed').replace(/-/g, ' ')],
    ['Start Date',       inputs.startDate || '—'],
  ];

  autoTable(doc, {
    startY: 42,
    head: [],
    body: params,
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 1.5 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40, textColor: [107, 114, 128] },
      1: { textColor: [31, 41, 55] },
    },
    margin: { left: margin, right: margin },
  });

  // ── summary statistics ──
  const afterParams = doc.lastAutoTable.finalY + 6;
  doc.setFontSize(11);
  doc.setTextColor(31, 41, 55);
  doc.text('Summary', margin, afterParams);

  const summaryRows = [
    ['Monthly Payment',    fmt(summary.monthlyPayment, currencyCode)],
    ['Total Interest Paid', fmt(summary.totalInterest, currencyCode)],
    ['Total Amount Paid',   fmt(summary.totalPaid, currencyCode)],
    ['Interest Ratio',      `${summary.interestRatio}%`],
    ['Payoff Date',         summary.payoffDate],
    ['Number of Payments',  `${summary.totalMonths}`],
  ];

  autoTable(doc, {
    startY: afterParams + 4,
    head: [],
    body: summaryRows,
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 1.5 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 55, textColor: [107, 114, 128] },
      1: { textColor: [31, 41, 55] },
    },
    margin: { left: margin, right: margin },
  });

  // ── amortization table ──
  const afterSummary = doc.lastAutoTable.finalY + 8;
  doc.setFontSize(11);
  doc.setTextColor(31, 41, 55);
  doc.text('Amortization Schedule', margin, afterSummary);

  const hasExtra = schedule.some(r => r.extra > 0);

  const head = [['#', 'Date', 'Payment', 'Principal', 'Interest', ...(hasExtra ? ['Extra'] : []), 'Balance']];
  const body = schedule.map(r => [
    r.month,
    r.date,
    r.payment.toFixed(2),
    r.principal.toFixed(2),
    r.interest.toFixed(2),
    ...(hasExtra ? [r.extra > 0 ? r.extra.toFixed(2) : '—'] : []),
    r.balance.toFixed(2),
  ]);

  autoTable(doc, {
    startY: afterSummary + 4,
    head,
    body,
    theme: 'striped',
    headStyles: { fillColor: [13, 148, 136], textColor: 255, fontSize: 8, fontStyle: 'bold' },
    bodyStyles: { fontSize: 7.5, textColor: [31, 41, 55] },
    alternateRowStyles: { fillColor: [248, 250, 251] },
    columnStyles: { 0: { cellWidth: 10 } },
    margin: { left: margin, right: margin },
  });

  // ── footer on every page ──
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text(
      'For educational purposes only. Not financial advice.',
      margin,
      doc.internal.pageSize.getHeight() - 8
    );
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageW - margin,
      doc.internal.pageSize.getHeight() - 8,
      { align: 'right' }
    );
  }

  doc.save(`amortization-schedule-${currencyCode}.pdf`);
}

// comparison PDF — summary table across all scenarios
export function exportComparisonPDF(scenarios, results, currencyCode) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const margin = 15;

  doc.setFontSize(18);
  doc.setTextColor(13, 148, 136);
  doc.text('Loan Comparison Report', margin, 20);

  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  doc.text(`Generated: ${new Date().toLocaleDateString()}   Currency: ${currencyCode}`, margin, 27);

  const readyPairs = scenarios.map((s, i) => ({ s, r: results[i] })).filter(({ r }) => r);

  const head = [['Metric', ...readyPairs.map(({ s }) => s.label)]];
  const rows = [
    ['Monthly Payment',    ...readyPairs.map(({ r }) => fmt(r.summary.monthlyPayment, currencyCode))],
    ['Total Interest',     ...readyPairs.map(({ r }) => fmt(r.summary.totalInterest, currencyCode))],
    ['Total Paid',         ...readyPairs.map(({ r }) => fmt(r.summary.totalPaid, currencyCode))],
    ['Payoff Date',        ...readyPairs.map(({ r }) => r.summary.payoffDate)],
    ['Number of Payments', ...readyPairs.map(({ r }) => `${r.summary.totalMonths}`)],
    ['Interest Ratio',     ...readyPairs.map(({ r }) => `${r.summary.interestRatio}%`)],
  ];

  autoTable(doc, {
    startY: 34,
    head,
    body: rows,
    theme: 'striped',
    headStyles: { fillColor: [13, 148, 136], textColor: 255, fontSize: 10, fontStyle: 'bold' },
    bodyStyles: { fontSize: 9.5 },
    alternateRowStyles: { fillColor: [248, 250, 251] },
    margin: { left: margin, right: margin },
  });

  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.text(
    'For educational purposes only. Not financial advice.',
    margin,
    doc.internal.pageSize.getHeight() - 8
  );

  doc.save(`loan-comparison-${currencyCode}.pdf`);
}

// minimal currency formatter for PDF — no Intl needed, just symbol + number
function fmt(amount, currencyCode) {
  if (amount === null || amount === undefined || isNaN(amount)) return '—';
  return `${currencyCode} ${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
