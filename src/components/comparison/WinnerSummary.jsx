import { Trophy } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

// tally up wins per scenario across the key metrics — whoever wins the most is the overall winner
export default function WinnerSummary({ scenarios, results }) {
  const { format } = useCurrency();

  const ready = results.filter(r => r !== null);
  if (ready.length < 2) return null;

  // metrics where lower = better
  const metrics = ['totalInterest', 'totalPaid', 'monthlyPayment', 'totalMonths', 'interestRatio'];
  const wins = results.map(() => 0);

  metrics.forEach(key => {
    let bestVal = Infinity;
    let bestIdx = -1;
    results.forEach((r, i) => {
      if (!r) return;
      const val = r.summary[key];
      if (typeof val === 'number' && val < bestVal) {
        bestVal = val;
        bestIdx = i;
      }
    });
    if (bestIdx >= 0) wins[bestIdx]++;
  });

  // pick the scenario with the most wins
  let winnerIdx = 0;
  wins.forEach((w, i) => { if (w > wins[winnerIdx]) winnerIdx = i; });

  const winner = scenarios[winnerIdx];
  const winnerResult = results[winnerIdx];
  if (!winnerResult) return null;

  // how much interest does the winner save vs the worst scenario?
  const interestValues = results.filter(r => r).map(r => r.summary.totalInterest);
  const maxInterest = Math.max(...interestValues);
  const interestSavedVsWorst = maxInterest - winnerResult.summary.totalInterest;

  return (
    <div className="bg-brand-green/10 border border-brand-green/30 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-brand-green/20 flex items-center justify-center flex-shrink-0">
        <Trophy size={24} className="text-brand-green" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-green mb-0.5">
          Best Overall Deal
        </p>
        <p className="text-lg font-bold text-surface-primary dark:text-dark-primary">
          {winner.label} wins on {wins[winnerIdx]} of {metrics.length} metrics
        </p>
        <p className="text-sm text-surface-secondary dark:text-dark-secondary mt-0.5">
          Monthly payment: <span className="font-semibold text-surface-primary dark:text-dark-primary">{format(winnerResult.summary.monthlyPayment)}</span>
          {' · '}
          Total interest: <span className="font-semibold text-surface-primary dark:text-dark-primary">{format(winnerResult.summary.totalInterest)}</span>
          {interestSavedVsWorst > 0 && (
            <span className="text-brand-green font-semibold"> (saves {format(interestSavedVsWorst)} vs worst option)</span>
          )}
        </p>
      </div>
    </div>
  );
}
