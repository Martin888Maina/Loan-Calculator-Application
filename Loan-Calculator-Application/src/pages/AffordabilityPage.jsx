import { useState } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/common/Card';
import AffordabilityForm from '../components/affordability/AffordabilityForm';
import AffordabilityResult from '../components/affordability/AffordabilityResult';
import { useAffordability } from '../hooks/useAffordability';
import { DollarSign } from 'lucide-react';

export default function AffordabilityPage() {
  const [inputs, setInputs] = useState({
    grossMonthlyIncome: '',
    existingDebts: '',
    annualRate: '12',
    termYears: '20',
    downPayment: '',
  });

  const result = useAffordability(inputs);

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-primary dark:text-dark-primary">Affordability Calculator</h1>
        <p className="text-surface-secondary dark:text-dark-secondary mt-1">
          Find out the maximum loan you can realistically afford based on your income and existing debts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* left — form */}
        <div className="lg:col-span-1">
          <Card>
            <div className="flex items-center gap-2 mb-5">
              <DollarSign size={18} className="text-brand-teal" />
              <h2 className="text-base font-semibold text-surface-primary dark:text-dark-primary">
                Your Financial Details
              </h2>
            </div>
            <AffordabilityForm onChange={setInputs} />
          </Card>
        </div>

        {/* right — results */}
        <div className="lg:col-span-2">
          {result ? (
            <AffordabilityResult result={result} inputs={inputs} />
          ) : (
            <div className="flex items-center justify-center h-full min-h-64 text-surface-secondary dark:text-dark-secondary text-sm">
              Enter your income and desired loan details to see what you can afford.
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
