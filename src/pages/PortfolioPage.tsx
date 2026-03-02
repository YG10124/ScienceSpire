import Portfolio from './Portfolio';
import type { BreadcrumbItem } from '@/config/site';

interface PortfolioPageProps {
  onBreadcrumbChange?: (items: BreadcrumbItem[]) => void;
}

export default function PortfolioPage({ onBreadcrumbChange }: PortfolioPageProps) {
  return <Portfolio onBreadcrumbChange={onBreadcrumbChange} />;
}
