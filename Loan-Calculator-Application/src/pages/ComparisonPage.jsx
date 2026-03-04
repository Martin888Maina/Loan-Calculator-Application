import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/common/Card';
import EmptyState from '../components/common/EmptyState';
import { BarChart2 } from 'lucide-react';

// placeholder — fully built in Phase 3
export default function ComparisonPage() {
  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-primary dark:text-dark-primary">Loan Comparison</h1>
        <p className="text-surface-secondary dark:text-dark-secondary mt-1">
          Compare up to three loan scenarios side by side.
        </p>
      </div>
      <Card>
        <EmptyState
          title="Coming in Phase 3"
          description="Side-by-side loan comparison will be available in the next phase."
          icon={BarChart2}
        />
      </Card>
    </PageWrapper>
  );
}
