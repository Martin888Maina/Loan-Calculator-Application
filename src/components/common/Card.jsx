export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-dark-card rounded-xl shadow-sm border border-surface-border dark:border-dark-border p-6 ${className}`}>
      {children}
    </div>
  );
}
