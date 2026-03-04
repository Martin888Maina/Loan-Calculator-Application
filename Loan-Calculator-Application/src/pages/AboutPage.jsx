import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/common/Card';

export default function AboutPage() {
  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-primary dark:text-dark-primary">About LoanCalc</h1>
          <p className="text-surface-secondary dark:text-dark-secondary mt-1">
            What this tool does and how the math works.
          </p>
        </div>

        <Card>
          <h2 className="text-lg font-semibold text-surface-primary dark:text-dark-primary mb-3">What is this?</h2>
          <p className="text-surface-secondary dark:text-dark-secondary leading-relaxed">
            LoanCalc is a comprehensive loan analysis tool built entirely in the browser. There is no server,
            no database, and no external APIs. Every calculation — from your monthly payment to the last row of
            your amortization schedule — happens locally using JavaScript math.
          </p>
          <p className="text-surface-secondary dark:text-dark-secondary leading-relaxed mt-3">
            It is designed for anyone who wants to understand a loan before taking it — not just "what is my
            monthly payment?" but "how much total interest am I paying?", "what happens if I pay extra each month?",
            and "can I actually afford this?".
          </p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-surface-primary dark:text-dark-primary mb-3">Calculation Methodology</h2>

          <h3 className="font-medium text-surface-primary dark:text-dark-primary mb-1">Standard Amortization</h3>
          <p className="text-surface-secondary dark:text-dark-secondary leading-relaxed mb-3">
            Monthly payments use the standard amortization formula:
          </p>
          <pre className="bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-3 text-sm font-mono text-surface-primary dark:text-dark-primary overflow-x-auto mb-4">
            M = P × [r(1+r)^n] / [(1+r)^n - 1]
            {'\n\n'}P = principal, r = monthly rate (annual / 12 / 100), n = total months
          </pre>
          <p className="text-surface-secondary dark:text-dark-secondary text-sm">
            For zero-interest loans the formula reduces to M = P / n.
          </p>

          <h3 className="font-medium text-surface-primary dark:text-dark-primary mb-1 mt-4">Extra Payments</h3>
          <p className="text-surface-secondary dark:text-dark-secondary leading-relaxed text-sm">
            Extra payments are applied directly to the outstanding principal before the next interest accrual period.
            The schedule is recalculated month by month with the reduced balance, which lowers the interest charged
            in every subsequent month.
          </p>

          <h3 className="font-medium text-surface-primary dark:text-dark-primary mb-1 mt-4">Adjustable Rate (ARM)</h3>
          <p className="text-surface-secondary dark:text-dark-secondary leading-relaxed text-sm">
            The schedule runs at the initial rate for the fixed period. At the adjustment point, the remaining balance
            is re-amortized using the new rate over the remaining term.
          </p>

          <h3 className="font-medium text-surface-primary dark:text-dark-primary mb-1 mt-4">Interest-Only</h3>
          <p className="text-surface-secondary dark:text-dark-secondary leading-relaxed text-sm">
            During the interest-only period, each payment equals balance × monthly rate. The principal is unchanged.
            After the IO period ends, the full balance is amortized over the remaining term.
          </p>

          <h3 className="font-medium text-surface-primary dark:text-dark-primary mb-1 mt-4">Balloon Payment</h3>
          <p className="text-surface-secondary dark:text-dark-secondary leading-relaxed text-sm">
            Payments are sized as if the loan ran for the full amortization period (e.g. 30 years). At the actual
            term end (e.g. 7 years), the outstanding balance becomes the balloon payment due in full.
          </p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-surface-primary dark:text-dark-primary mb-3">Tech Stack</h2>
          <ul className="space-y-1.5 text-sm text-surface-secondary dark:text-dark-secondary">
            {[
              'React 18 + Vite — UI framework and build tool',
              'Tailwind CSS — utility-first styling',
              'React Router — client-side routing',
              'Recharts — data visualisation charts',
              'React Hook Form — form state and validation',
              'jsPDF + jsPDF-AutoTable — PDF export',
              'Papaparse — CSV export',
              'date-fns — date arithmetic for payment dates',
              'Lucide React — icons',
              'Intl.NumberFormat — currency formatting (built-in browser API)',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-brand-teal mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="border-brand-amber/30 bg-brand-amber/5">
          <h2 className="text-base font-semibold text-surface-primary dark:text-dark-primary mb-2">Disclaimer</h2>
          <p className="text-sm text-surface-secondary dark:text-dark-secondary leading-relaxed">
            This tool is for educational and planning purposes only. The calculations are based on standard
            financial formulas and assume constant interest rates (except for ARM and balloon types as configured).
            Results do not account for fees, insurance, taxes, or lender-specific terms. This does not constitute
            financial advice. Consult a licensed financial advisor before making any borrowing decisions.
          </p>
        </Card>
      </div>
    </PageWrapper>
  );
}
