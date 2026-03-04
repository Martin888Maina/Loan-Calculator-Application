import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useLoan } from '../../context/LoanContext';
import { DEFAULTS, LOAN_TYPES, LIMITS } from '../../utils/constants';
import Tooltip from '../common/Tooltip';

// slider + number input combo — they stay in sync with each other
function SliderInput({ label, name, register, setValue, watch, min, max, step = 1, tooltip, error, unit }) {
  const value = watch(name);

  return (
    <div>
      <label className="label flex items-center gap-1">
        {label}
        {tooltip && <Tooltip text={tooltip} />}
      </label>
      <div className="flex items-center gap-2 mb-1.5">
        <input
          type="number"
          step={step}
          className={`input-field w-28 flex-shrink-0 ${error ? 'border-brand-red' : ''}`}
          {...register(name)}
        />
        {unit && (
          <span className="text-xs text-surface-secondary dark:text-dark-secondary flex-shrink-0">{unit}</span>
        )}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={parseFloat(value) || min}
        onChange={e => setValue(name, parseFloat(e.target.value), { shouldValidate: true })}
        className="w-full"
      />
      <div className="flex justify-between text-[10px] text-surface-secondary dark:text-dark-secondary mt-0.5">
        <span>{min}{unit ? unit : ''}</span>
        <span>{max}{unit ? unit : ''}</span>
      </div>
      {error && <p className="error-text">{error.message}</p>}
    </div>
  );
}

export default function LoanForm() {
  const { state, setInput } = useLoan();

  const {
    register,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      loanAmount:         DEFAULTS.loanAmount,
      annualRate:         DEFAULTS.annualRate,
      termYears:          DEFAULTS.termYears,
      termMonths:         DEFAULTS.termYears * 12,
      termUnit:           'years',
      startDate:          DEFAULTS.startDate,
      loanType:           'fixed',
      armInitialPeriod:   5,
      armNewRate:         '',
      interestOnlyPeriod: 5,
      balloonAmortYears:  30,
      extraMonthly:       '',
      lumpSumAmount:      '',
      lumpSumMonth:       '',
    },
    mode: 'onChange',
  });

  const watchedValues = watch();

  // push every change into LoanContext so the calculator hook re-runs reactively
  useEffect(() => {
    Object.entries(watchedValues).forEach(([field, value]) => {
      setInput(field, value);
    });
  }, [JSON.stringify(watchedValues)]);

  const loanType  = watchedValues.loanType;
  const termUnit  = watchedValues.termUnit;
  const hasLumpSum = parseFloat(watchedValues.lumpSumAmount) > 0;

  return (
    <div className="space-y-6">

      {/* loan amount — slider from 10k to 50M */}
      <SliderInput
        label="Loan Amount"
        name="loanAmount"
        register={register}
        setValue={setValue}
        watch={watch}
        min={10000}
        max={10000000}
        step={10000}
        tooltip="The total amount you want to borrow."
        error={errors.loanAmount}
      />

      {/* interest rate — slider 0 to 30% */}
      <SliderInput
        label="Annual Interest Rate"
        name="annualRate"
        register={register}
        setValue={setValue}
        watch={watch}
        min={0}
        max={30}
        step={0.25}
        unit="%"
        tooltip="The yearly interest rate. Enter 0 for an interest-free loan."
        error={errors.annualRate}
      />

      {/* loan term */}
      <div>
        <label className="label">Loan Term</label>
        <div className="flex gap-2 mb-1.5">
          <input
            type="number"
            className={`input-field flex-1 ${errors.termYears || errors.termMonths ? 'border-brand-red' : ''}`}
            {...register(termUnit === 'years' ? 'termYears' : 'termMonths', {
              required: 'Required',
              min: { value: 1, message: 'Min 1' },
              max: {
                value: termUnit === 'years' ? LIMITS.maxTermYears : LIMITS.maxTermMonths,
                message: termUnit === 'years' ? 'Max 50 years' : 'Max 600 months',
              },
            })}
          />
          <Controller
            name="termUnit"
            control={control}
            render={({ field }) => (
              <select {...field} className="input-field w-28">
                <option value="years">Years</option>
                <option value="months">Months</option>
              </select>
            )}
          />
        </div>
        {/* term slider — switches range based on unit */}
        <input
          type="range"
          min={termUnit === 'years' ? 1 : 12}
          max={termUnit === 'years' ? 50 : 360}
          step={termUnit === 'years' ? 1 : 12}
          value={parseInt(termUnit === 'years' ? watchedValues.termYears : watchedValues.termMonths) || 1}
          onChange={e => {
            const field = termUnit === 'years' ? 'termYears' : 'termMonths';
            setValue(field, parseInt(e.target.value), { shouldValidate: true });
          }}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] text-surface-secondary dark:text-dark-secondary mt-0.5">
          <span>{termUnit === 'years' ? '1y' : '12mo'}</span>
          <span>{termUnit === 'years' ? '50y' : '360mo'}</span>
        </div>
        {(errors.termYears || errors.termMonths) && (
          <p className="error-text">{(errors.termYears || errors.termMonths)?.message}</p>
        )}
      </div>

      {/* start date */}
      <div>
        <label className="label">Start Date</label>
        <input type="month" className="input-field" {...register('startDate')} />
      </div>

      {/* loan type selector */}
      <div>
        <label className="label flex items-center gap-1">
          Loan Type
          <Tooltip text="Fixed: constant rate. ARM: rate resets after initial period. Interest-Only: pay only interest initially. Balloon: lump sum due at term end." />
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {LOAN_TYPES.map(({ value, label }) => {
            const active = loanType === value;
            return (
              <label
                key={value}
                className={`flex items-center justify-center text-center text-sm font-medium px-3 py-2.5 rounded-lg border cursor-pointer transition-colors
                  ${active
                    ? 'bg-brand-teal text-white border-brand-teal'
                    : 'bg-white dark:bg-dark-card border-surface-border dark:border-dark-border text-surface-secondary dark:text-dark-secondary hover:border-brand-teal'
                  }`}
              >
                <input type="radio" value={value} {...register('loanType')} className="sr-only" />
                {label}
              </label>
            );
          })}
        </div>
      </div>

      {/* ARM extra fields */}
      {loanType === 'arm' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-brand-blue/5 rounded-lg border border-brand-blue/20">
          <div>
            <label className="label">Initial Fixed Period (years)</label>
            <input type="number" className="input-field" {...register('armInitialPeriod', { min: 1 })} />
          </div>
          <div>
            <label className="label flex items-center gap-1">
              Rate After Adjustment (%)
              <Tooltip text="The new interest rate that applies after the fixed period ends." />
            </label>
            <input type="number" step="0.01" className="input-field" {...register('armNewRate', { min: 0, max: 100 })} />
          </div>
        </div>
      )}

      {/* interest-only extra field */}
      {loanType === 'interest-only' && (
        <div className="p-4 bg-brand-blue/5 rounded-lg border border-brand-blue/20">
          <label className="label flex items-center gap-1">
            Interest-Only Period (years)
            <Tooltip text="During this period you pay only interest — your balance doesn't go down." />
          </label>
          <input type="number" className="input-field max-w-xs" {...register('interestOnlyPeriod', { min: 1 })} />
        </div>
      )}

      {/* balloon extra field */}
      {loanType === 'balloon' && (
        <div className="p-4 bg-brand-amber/5 rounded-lg border border-brand-amber/20">
          <label className="label flex items-center gap-1">
            Full Amortization Period (years)
            <Tooltip text="Monthly payments are calculated as if the loan runs this long, but the remaining balance is due at your actual term end." />
          </label>
          <input type="number" className="input-field max-w-xs" {...register('balloonAmortYears', { min: 1, max: 50 })} />
        </div>
      )}

      {/* extra payments */}
      <div>
        <h3 className="text-sm font-semibold text-surface-primary dark:text-dark-primary mb-3">
          Extra Payments <span className="text-surface-secondary dark:text-dark-secondary font-normal">(optional)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-brand-green/5 rounded-lg border border-brand-green/20">
          <div>
            <label className="label flex items-center gap-1">
              Extra Monthly
              <Tooltip text="Additional amount applied to principal each month. Reduces total interest and payoff time." />
            </label>
            <input type="number" min="0" className="input-field" {...register('extraMonthly', { min: 0 })} placeholder="0" />
          </div>
          <div>
            <label className="label flex items-center gap-1">
              One-Time Lump Sum
              <Tooltip text="A single extra payment applied to principal in a specific month." />
            </label>
            <input type="number" min="0" className="input-field" {...register('lumpSumAmount', { min: 0 })} placeholder="0" />
          </div>
          {hasLumpSum && (
            <div>
              <label className="label">In Month #</label>
              <input type="number" min="1" className="input-field" {...register('lumpSumMonth', { min: 1 })} placeholder="e.g. 12" />
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
