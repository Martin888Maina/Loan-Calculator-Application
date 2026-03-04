import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/common/Card';
import ComparisonForm from '../components/comparison/ComparisonForm';
import ComparisonTable from '../components/comparison/ComparisonTable';
import WinnerSummary from '../components/comparison/WinnerSummary';
import ComparisonBarChart from '../components/charts/ComparisonBarChart';
import { ComparisonExportButtons } from '../components/export/ExportButtons';
import { useComparison } from '../hooks/useComparison';
import { BarChart2 } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export default function ComparisonPage() {
  const { format } = useCurrency();
  const {
    scenarios,
    results,
    updateScenario,
    addScenario,
    removeScenario,
    resetScenario,
  } = useComparison();

  const anyReady = results.some(r => r !== null);

  const scenarioColors = [
    { text: 'text-brand-teal',  border: 'border-brand-teal/30' },
    { text: 'text-brand-coral', border: 'border-brand-coral/30' },
    { text: 'text-brand-blue',  border: 'border-brand-blue/30' },
  ];

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-primary dark:text-dark-primary">Loan Comparison</h1>
        <p className="text-surface-secondary dark:text-dark-secondary mt-1">
          Compare up to three loan scenarios side by side to find the best deal.
        </p>
      </div>

      <div className="space-y-6">
        {/* scenario input panels */}
        <Card>
          <div className="flex items-center gap-2 mb-5">
            <BarChart2 size={18} className="text-brand-teal" />
            <h2 className="text-base font-semibold text-surface-primary dark:text-dark-primary">
              Loan Scenarios
            </h2>
          </div>
          <ComparisonForm
            scenarios={scenarios}
            onUpdate={updateScenario}
            onAdd={addScenario}
            onRemove={removeScenario}
            onReset={resetScenario}
          />
        </Card>

        {anyReady && (
          <>
            {/* winner callout banner */}
            <WinnerSummary scenarios={scenarios} results={results} />

            {/* comparison table */}
            <Card className="p-0 overflow-hidden">
              <div className="px-6 py-4 border-b border-surface-border dark:border-dark-border flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-base font-semibold text-surface-primary dark:text-dark-primary">
                    Side-by-Side Comparison
                  </h2>
                  <p className="text-xs text-surface-secondary dark:text-dark-secondary mt-0.5">
                    Trophy marks the best value per metric. Difference column compares Scenario A vs B.
                  </p>
                </div>
                <ComparisonExportButtons scenarios={scenarios} results={results} />
              </div>
              <div className="p-6">
                <ComparisonTable scenarios={scenarios} results={results} />
              </div>
            </Card>

            {/* comparison bar chart */}
            <Card>
              <ComparisonBarChart scenarios={scenarios} results={results} />
            </Card>

            {/* per-scenario detail cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {scenarios.map((s, i) => {
                const r = results[i];
                if (!r) return null;
                const { summary } = r;
                const c = scenarioColors[i];

                return (
                  <Card key={i} className={`border-2 ${c.border}`}>
                    <p className={`text-xs font-bold uppercase tracking-wide mb-3 ${c.text}`}>
                      {s.label}
                    </p>
                    <div className="space-y-2 text-sm">
                      {[
                        ['Loan Type', s.loanType.replace(/-/g, ' ')],
                        ['Monthly Payment', format(summary.monthlyPayment)],
                        ['Total Interest', format(summary.totalInterest)],
                        ['Total Paid', format(summary.totalPaid)],
                        ['Payoff Date', summary.payoffDate],
                        ['Number of Payments', `${summary.totalMonths}`],
                        ['Interest Ratio', `${summary.interestRatio}%`],
                      ].map(([label, val]) => (
                        <div key={label} className="flex justify-between gap-2">
                          <span className="text-surface-secondary dark:text-dark-secondary">{label}</span>
                          <span className="font-medium text-surface-primary dark:text-dark-primary tabular-nums text-right">{val}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {!anyReady && (
          <div className="text-center py-12 text-surface-secondary dark:text-dark-secondary text-sm">
            Fill in at least one scenario above to see comparison results.
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
