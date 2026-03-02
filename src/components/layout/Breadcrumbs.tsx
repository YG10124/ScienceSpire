import type { BreadcrumbItem } from '@/config/site';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (page: string) => void;
}

export default function Breadcrumbs({ items, onNavigate }: BreadcrumbsProps) {
  if (items.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.page && !isLast ? (
                <button
                  onClick={() => onNavigate(item.page)}
                  className="underline-offset-2 hover:underline"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {item.label}
                </button>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  style={{ color: isLast ? 'var(--text)' : 'var(--text-secondary)' }}
                >
                  {item.label}
                </span>
              )}
              {!isLast && <span style={{ color: 'var(--text-muted)' }}>/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
