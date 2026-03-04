import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/common/Card';
import EmptyState from '../components/common/EmptyState';
import { DollarSign } from 'lucide-react';

// placeholder — fully built in Phase 5
export default function AffordabilityPage() {
  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-primary dark:text-dark-primary">Affordability Calculator</h1>
        <p className="text-surface-secondary dark:text-dark-secondary mt-1">
          Find out how much you can afford based on your income and debts.
        </p>
      </div>
      <Card>
        <EmptyState
          title="Coming in Phase 5"
          description="The affordability calculator and DTI analysis will be available in an upcoming phase."
          icon={DollarSign}
        />
      </Card>
    </PageWrapper>
  );
}
