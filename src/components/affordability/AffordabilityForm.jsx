import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import Tooltip from '../common/Tooltip';
import { LIMITS } from '../../utils/constants';

export default function AffordabilityForm({ onChange }) {
  const { register, watch, formState: { errors } } = useForm({
    defaultValues: {
      grossMonthlyIncome: '',
      existingDebts: '',
      annualRate: '12',
      termYears: '20',
      downPayment: '',
    },
    mode: 'onChange',
  });

  const values = watch();

  // bubble every change up to the parent so results stay reactive
  useEffect(() => {
    onChange(values);
  }, [JSON.stringify(values)]);

  return (
    <div className="space-y-5">
      {/* income */}
      <div>
        <label className="label flex items-center gap-1">
          Gross Monthly Income
          <Tooltip text="Your total monthly income before taxes and deductions." />
        </label>
        <input
          type="number"
          className={`input-field ${errors.grossMonthlyIncome ? 'border-brand-red' : ''}`}
          placeholder="e.g. 150000"
          {...register('grossMonthlyIncome', {
            required: 'Required',
            min: { value: 1, message: 'Must be positive' },
          })}
        />
        {errors.grossMonthlyIncome && (
          <p className="error-text">{errors.grossMonthlyIncome.message}</p>
        )}
      </div>

      {/* existing debts */}
      <div>
        <label className="label flex items-center gap-1">
          Existing Monthly Debt Payments
          <Tooltip text="Total of all current monthly debt obligations — car loans, student loans, credit card minimums, etc." />
        </label>
        <input
          type="number"
          className="input-field"
          placeholder="e.g. 15000 (0 if none)"
          {...register('existingDebts', { min: { value: 0, message: 'Cannot be negative' } })}
        />
        {errors.existingDebts && (
          <p className="error-text">{errors.existingDebts.message}</p>
        )}
      </div>

      {/* rate and term */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label flex items-center gap-1">
            Estimated Interest Rate (%)
            <Tooltip text="The annual interest rate you expect to receive on the loan." />
          </label>
          <input
            type="number"
            step="0.01"
            className={`input-field ${errors.annualRate ? 'border-brand-red' : ''}`}
            {...register('annualRate', {
              required: 'Required',
              min: { value: 0, message: 'Cannot be negative' },
              max: { value: LIMITS.maxRate, message: 'Max 100%' },
            })}
          />
          {errors.annualRate && <p className="error-text">{errors.annualRate.message}</p>}
        </div>

        <div>
          <label className="label">Desired Loan Term (years)</label>
          <input
            type="number"
            className={`input-field ${errors.termYears ? 'border-brand-red' : ''}`}
            {...register('termYears', {
              required: 'Required',
              min: { value: 1, message: 'Min 1 year' },
              max: { value: LIMITS.maxTermYears, message: 'Max 50 years' },
            })}
          />
          {errors.termYears && <p className="error-text">{errors.termYears.message}</p>}
        </div>
      </div>

      {/* down payment */}
      <div>
        <label className="label flex items-center gap-1">
          Down Payment
          <Tooltip text="Optional. If you're buying an asset, add your down payment to see the maximum purchase price you can afford." />
        </label>
        <input
          type="number"
          className="input-field"
          placeholder="0 (optional)"
          {...register('downPayment', { min: { value: 0, message: 'Cannot be negative' } })}
        />
      </div>
    </div>
  );
}
