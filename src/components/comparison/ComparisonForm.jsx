import { RotateCcw, X, Plus } from 'lucide-react';
import { LOAN_TYPES } from '../../utils/constants';
import Tooltip from '../common/Tooltip';

// colour accent per scenario so the panels are visually distinct
const SCENARIO_COLORS = [
  { border: 'border-brand-teal',  bg: 'bg-brand-teal/5',  label: 'text-brand-teal',  badge: 'bg-brand-teal text-white' },
  { border: 'border-brand-coral', bg: 'bg-brand-coral/5', label: 'text-brand-coral', badge: 'bg-brand-coral text-white' },
  { border: 'border-brand-blue',  bg: 'bg-brand-blue/5',  label: 'text-brand-blue',  badge: 'bg-brand-blue text-white' },
];

function ScenarioPanel({ scenario, index, onChange, onReset, onRemove, canRemove }) {
  const colors = SCENARIO_COLORS[index];
  const loanType = scenario.loanType;
  const termUnit = scenario.termUnit;

  const field = (name, extra = {}) => ({
    value: scenario[name] ?? '',
    onChange: e => onChange(index, name, e.target.value),
    ...extra,
  });

  return (
    <div className={`rounded-xl border-2 ${colors.border} ${colors.bg} p-5 flex-1 min-w-0`}>
      {/* panel header */}
      <div className="flex items-center justify-between mb-4">
        <span className={`text-sm font-bold px-2.5 py-1 rounded-full ${colors.badge}`}>
          {scenario.label}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onReset(index)}
            className="p-1.5 rounded-lg text-surface-secondary dark:text-dark-secondary hover:bg-white dark:hover:bg-dark-card transition-colors"
            title="Reset scenario"
          >
            <RotateCcw size={14} />
          </button>
          {canRemove && (
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="p-1.5 rounded-lg text-surface-secondary dark:text-dark-secondary hover:bg-white dark:hover:bg-dark-card transition-colors"
              title="Remove scenario"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {/* loan amount */}
        <div>
          <label className="label">Loan Amount</label>
          <input type="number" className="input-field" placeholder="e.g. 1000000" {...field('loanAmount')} />
        </div>

        {/* interest rate */}
        <div>
          <label className="label">Annual Rate (%)</label>
          <input type="number" step="0.01" className="input-field" placeholder="e.g. 12" {...field('annualRate')} />
        </div>

        {/* term */}
        <div>
          <label className="label">Loan Term</label>
          <div className="flex gap-2">
            <input
              type="number"
              className="input-field flex-1"
              placeholder={termUnit === 'years' ? 'Years' : 'Months'}
              {...field(termUnit === 'years' ? 'termYears' : 'termMonths')}
            />
            <select className="input-field w-24" {...field('termUnit')}>
              <option value="years">Years</option>
              <option value="months">Months</option>
            </select>
          </div>
        </div>

        {/* loan type */}
        <div>
          <label className="label flex items-center gap-1">
            Loan Type
            <Tooltip text="Fixed: constant rate. ARM: resets after initial period. Interest-Only: interest only for first period. Balloon: lump sum at term end." />
          </label>
          <select className="input-field" {...field('loanType')}>
            {LOAN_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* ARM extra fields */}
        {loanType === 'arm' && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label">Initial Period (yrs)</label>
              <input type="number" className="input-field" placeholder="5" {...field('armInitialPeriod')} />
            </div>
            <div>
              <label className="label">Rate After (%)</label>
              <input type="number" step="0.01" className="input-field" placeholder="15" {...field('armNewRate')} />
            </div>
          </div>
        )}

        {/* interest-only extra field */}
        {loanType === 'interest-only' && (
          <div>
            <label className="label">IO Period (yrs)</label>
            <input type="number" className="input-field" placeholder="5" {...field('interestOnlyPeriod')} />
          </div>
        )}

        {/* balloon extra field */}
        {loanType === 'balloon' && (
          <div>
            <label className="label flex items-center gap-1">
              Amort. Period (yrs)
              <Tooltip text="Payments are sized as if the loan runs this long." />
            </label>
            <input type="number" className="input-field" placeholder="30" {...field('balloonAmortYears')} />
          </div>
        )}

        {/* start date */}
        <div>
          <label className="label">Start Date</label>
          <input type="month" className="input-field" {...field('startDate')} />
        </div>
      </div>
    </div>
  );
}

export default function ComparisonForm({ scenarios, onUpdate, onAdd, onRemove, onReset }) {
  return (
    <div className="space-y-4">
      {/* scenario panels — stack on mobile, side-by-side on larger screens */}
      <div className="flex flex-col lg:flex-row gap-4">
        {scenarios.map((scenario, i) => (
          <ScenarioPanel
            key={i}
            scenario={scenario}
            index={i}
            onChange={onUpdate}
            onReset={onReset}
            onRemove={onRemove}
            canRemove={scenarios.length > 2}
          />
        ))}
      </div>

      {/* add scenario button — hidden once we hit 3 */}
      {scenarios.length < 3 && (
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 text-sm text-brand-teal hover:text-teal-700 font-medium transition-colors"
        >
          <Plus size={16} />
          Add scenario (max 3)
        </button>
      )}
    </div>
  );
}
