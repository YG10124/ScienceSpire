import { Home, Calendar, BookOpen, Users, User } from 'lucide-react';

interface BottomNavProps {
    currentPage: string;
    onNavigate: (page: string) => void;
}

const mobileNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'profile', label: 'Profile', icon: User },
];

export default function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
    return (
        <nav
            className="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t"
            style={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
            }}
            aria-label="Mobile navigation"
        >
            <div className="flex justify-around items-center h-16 px-1">
                {mobileNavItems.map(item => {
                    const Icon = item.icon;
                    const active = currentPage === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            aria-current={active ? 'page' : undefined}
                            className="relative flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[48px] rounded-xl text-[11px] transition-all duration-200"
                            style={{
                                color: active ? 'var(--brand)' : 'var(--text-secondary)',
                                fontWeight: active ? 600 : 400,
                                backgroundColor: active ? 'var(--brand-bg)' : 'transparent',
                            }}
                        >
                            {active && (
                                <span
                                    className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[3px] rounded-b-full animate-scale-in"
                                    style={{ backgroundColor: 'var(--brand)' }}
                                    aria-hidden="true"
                                />
                            )}
                            <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
