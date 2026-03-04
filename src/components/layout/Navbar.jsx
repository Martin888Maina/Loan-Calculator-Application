import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Calculator, BarChart2, DollarSign, Info } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useCurrency, CURRENCIES } from '../../context/CurrencyContext';

const navLinks = [
  { to: '/calculator', label: 'Calculator', icon: Calculator },
  { to: '/compare', label: 'Compare', icon: BarChart2 },
  { to: '/affordability', label: 'Affordability', icon: DollarSign },
  { to: '/about', label: 'About', icon: Info },
];

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { currency, changeCurrency } = useCurrency();
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-dark-card border-b border-surface-border dark:border-dark-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* logo / brand */}
          <Link to="/" className="flex items-center gap-2 font-bold text-brand-teal text-lg">
            <Calculator size={22} />
            <span className="hidden sm:inline">LoanCalc</span>
          </Link>

          {/* desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${active
                      ? 'bg-brand-teal/10 text-brand-teal'
                      : 'text-surface-secondary dark:text-dark-secondary hover:text-surface-primary dark:hover:text-dark-primary hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* right controls */}
          <div className="flex items-center gap-2">
            {/* currency picker */}
            <select
              value={currency.code}
              onChange={e => changeCurrency(e.target.value)}
              className="text-xs border border-surface-border dark:border-dark-border rounded-lg px-2 py-1.5 bg-white dark:bg-dark-card text-surface-primary dark:text-dark-primary focus:outline-none focus:ring-2 focus:ring-brand-teal"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.code}</option>
              ))}
            </select>

            {/* dark mode toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-surface-secondary dark:text-dark-secondary hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* mobile bottom tab bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-card border-t border-surface-border dark:border-dark-border z-50">
        <div className="flex justify-around py-2">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium transition-colors
                  ${active ? 'text-brand-teal' : 'text-surface-secondary dark:text-dark-secondary'}`}
              >
                <Icon size={20} />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
