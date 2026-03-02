import CreatorStudio from './CreatorStudio';
import type { BreadcrumbItem } from '@/config/site';

interface CreatorStudioPageProps {
  onBreadcrumbChange?: (items: BreadcrumbItem[]) => void;
}

export default function CreatorStudioPage({ onBreadcrumbChange }: CreatorStudioPageProps) {
  return <CreatorStudio onBreadcrumbChange={onBreadcrumbChange} />;
}
