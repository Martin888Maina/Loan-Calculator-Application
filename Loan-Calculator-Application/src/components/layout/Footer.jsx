import { Link } from 'react-router-dom';
import { Calculator } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-dark-card border-t border-surface-border dark:border-dark-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-brand-teal font-semibold">
            <Calculator size={18} />
            <span>LoanCalc</span>
          </div>

          <nav className="flex gap-6 text-sm text-surface-secondary dark:text-dark-secondary">
            <Link to="/calculator" className="hover:text-brand-teal transition-colors">Calculator</Link>
            <Link to="/compare" className="hover:text-brand-teal transition-colors">Compare</Link>
            <Link to="/affordability" className="hover:text-brand-teal transition-colors">Affordability</Link>
            <Link to="/about" className="hover:text-brand-teal transition-colors">About</Link>
          </nav>

          <p className="text-xs text-surface-secondary dark:text-dark-secondary text-center md:text-right">
            For educational purposes only. Not financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
