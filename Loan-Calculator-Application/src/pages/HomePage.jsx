import { Link } from 'react-router-dom';
import { Calculator, BarChart2, DollarSign, TrendingDown, PiggyBank, FileDown } from 'lucide-react';

const features = [
  {
    icon: Calculator,
    title: 'Full Amortization Schedule',
    description: 'See every payment broken down into principal and interest, month by month, with collapsible yearly summaries.',
  },
  {
    icon: PiggyBank,
    title: 'Extra Payment Analysis',
    description: 'Add an extra monthly amount or a one-time lump sum and instantly see how much interest you save and how many months you cut off.',
  },
  {
    icon: BarChart2,
    title: 'Loan Comparison',
    description: 'Compare up to three loan scenarios side by side — different rates, terms, or structures — to find the best deal.',
  },
  {
    icon: TrendingDown,
    title: 'Multiple Loan Types',
    description: 'Fixed rate, adjustable rate (ARM), interest-only, and balloon payment structures are all supported.',
  },
  {
    icon: DollarSign,
    title: 'Affordability Calculator',
    description: 'Enter your income and existing debts to find out the maximum loan you can realistically afford based on standard DTI ratios.',
  },
  {
    icon: FileDown,
    title: 'PDF and CSV Export',
    description: 'Download your full amortization schedule as a PDF report or a raw CSV file for use in your own spreadsheet.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface-bg dark:bg-dark-bg">
      {/* hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-teal/10 text-brand-teal text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <Calculator size={15} />
          Free loan analysis tool
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-surface-primary dark:text-dark-primary leading-tight mb-5">
          Calculate smarter.<br />
          <span className="text-brand-teal">Borrow better.</span>
        </h1>
        <p className="text-lg text-surface-secondary dark:text-dark-secondary max-w-2xl mx-auto mb-8">
          Understand every payment before you sign. Generate full amortization schedules, compare loan scenarios, analyse extra payment savings, and assess what you can actually afford.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/calculator"
            className="btn-primary px-6 py-3 text-base"
          >
            Start Calculating
          </Link>
          <Link
            to="/compare"
            className="btn-secondary px-6 py-3 text-base"
          >
            Compare Loans
          </Link>
        </div>
      </section>

      {/* sample stats banner */}
      <section className="bg-brand-teal text-white py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { label: 'Loan types supported', value: '4' },
            { label: 'Currencies available', value: '10+' },
            { label: 'Export formats', value: 'PDF & CSV' },
            { label: 'External APIs used', value: 'Zero' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-3xl font-bold mb-1">{s.value}</p>
              <p className="text-white/80 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* features grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-2xl font-bold text-surface-primary dark:text-dark-primary text-center mb-12">
          Everything you need to understand a loan
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="bg-white dark:bg-dark-card rounded-xl border border-surface-border dark:border-dark-border p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-brand-teal/10 flex items-center justify-center mb-4">
                <Icon size={20} className="text-brand-teal" />
              </div>
              <h3 className="font-semibold text-surface-primary dark:text-dark-primary mb-2">{title}</h3>
              <p className="text-sm text-surface-secondary dark:text-dark-secondary leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA bottom */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 text-center">
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-surface-border dark:border-dark-border p-10 shadow-sm">
          <h2 className="text-2xl font-bold text-surface-primary dark:text-dark-primary mb-3">Ready to run the numbers?</h2>
          <p className="text-surface-secondary dark:text-dark-secondary mb-6">
            No sign-up, no ads, no server. Everything runs in your browser.
          </p>
          <Link to="/calculator" className="btn-primary px-8 py-3 text-base">
            Open Calculator
          </Link>
        </div>
      </section>
    </div>
  );
}
