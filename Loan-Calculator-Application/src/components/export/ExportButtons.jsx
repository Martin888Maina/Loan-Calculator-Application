import { useState } from 'react';
import { FileDown, FileText, Loader2 } from 'lucide-react';
import { exportSchedulePDF, exportComparisonPDF } from '../../utils/exportPDF';
import { exportScheduleCSV, exportComparisonCSV } from '../../utils/exportCSV';
import { useCurrency } from '../../context/CurrencyContext';

// shared loading button wrapper
function ExportBtn({ onClick, loading, icon: Icon, label, variant = 'secondary' }) {
  const base = 'inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const styles = variant === 'primary'
    ? `${base} bg-brand-teal text-white hover:bg-teal-700`
    : `${base} bg-white dark:bg-dark-card border border-surface-border dark:border-dark-border text-surface-primary dark:text-dark-primary hover:bg-gray-50 dark:hover:bg-gray-700`;

  return (
    <button onClick={onClick} disabled={loading} className={styles}>
      {loading
        ? <Loader2 size={15} className="animate-spin" />
        : <Icon size={15} />
      }
      {label}
    </button>
  );
}

// buttons for the calculator page — exports the amortization schedule
export function ScheduleExportButtons({ schedule, summary, inputs }) {
  const { currency } = useCurrency();
  const [pdfLoading, setPdfLoading] = useState(false);
  const [csvLoading, setCsvLoading] = useState(false);

  if (!schedule || schedule.length === 0) return null;

  const handlePDF = async () => {
    setPdfLoading(true);
    // small delay so React can repaint the loading state before the sync PDF work blocks the thread
    await new Promise(r => setTimeout(r, 50));
    try { exportSchedulePDF(schedule, summary, inputs, currency.code); }
    finally { setPdfLoading(false); }
  };

  const handleCSV = async () => {
    setCsvLoading(true);
    await new Promise(r => setTimeout(r, 50));
    try { exportScheduleCSV(schedule, summary, inputs, currency.code); }
    finally { setCsvLoading(false); }
  };

  return (
    <div className="flex items-center gap-2">
      <ExportBtn onClick={handlePDF} loading={pdfLoading} icon={FileText} label="Export PDF" variant="primary" />
      <ExportBtn onClick={handleCSV} loading={csvLoading} icon={FileDown}  label="Export CSV" />
    </div>
  );
}

// buttons for the comparison page
export function ComparisonExportButtons({ scenarios, results }) {
  const { currency } = useCurrency();
  const [pdfLoading, setPdfLoading] = useState(false);
  const [csvLoading, setCsvLoading] = useState(false);

  const anyReady = results.some(r => r !== null);
  if (!anyReady) return null;

  const handlePDF = async () => {
    setPdfLoading(true);
    await new Promise(r => setTimeout(r, 50));
    try { exportComparisonPDF(scenarios, results, currency.code); }
    finally { setPdfLoading(false); }
  };

  const handleCSV = async () => {
    setCsvLoading(true);
    await new Promise(r => setTimeout(r, 50));
    try { exportComparisonCSV(scenarios, results, currency.code); }
    finally { setCsvLoading(false); }
  };

  return (
    <div className="flex items-center gap-2">
      <ExportBtn onClick={handlePDF} loading={pdfLoading} icon={FileText} label="Export PDF" variant="primary" />
      <ExportBtn onClick={handleCSV} loading={csvLoading} icon={FileDown}  label="Export CSV" />
    </div>
  );
}
