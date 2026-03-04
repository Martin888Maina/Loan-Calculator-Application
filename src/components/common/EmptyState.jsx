import { Calculator } from 'lucide-react';

export default function EmptyState({ title, description, icon: Icon = Calculator }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-brand-teal/10 flex items-center justify-center mb-4">
        <Icon size={28} className="text-brand-teal" />
      </div>
      <h3 className="text-lg font-semibold text-surface-primary dark:text-dark-primary mb-2">{title}</h3>
      <p className="text-sm text-surface-secondary dark:text-dark-secondary max-w-xs">{description}</p>
    </div>
  );
}
