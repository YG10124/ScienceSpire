import { useEffect, useRef, useState } from 'react';
import {
    Home, LayoutDashboard, Calendar, BookOpen, Users,
    FolderOpen, Palette, Rocket, ChevronLeft, ChevronRight, X, GraduationCap, Trophy
} from 'lucide-react';
import { useLocalStore } from '@/store/useLocalStore';
import LevelChip from '@/components/gamification/LevelChip';

interface SidebarProps {
    currentPage: string;
    onNavigate: (page: string) => void;
    sidebarOpen: boolean;
    setSidebarOpen: (v: boolean) => void;
    sidebarExpanded: boolean;
    setSidebarExpanded: (v: boolean) => void;
    isSignedIn: boolean;
}

const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'lessons', label: 'Lessons', icon: GraduationCap },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'portfolio', label: 'Portfolio', icon: FolderOpen },
    { id: 'creator', label: 'Creator Studio', icon: Palette },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
];

export default function Sidebar({
    currentPage, onNavigate, sidebarOpen, setSidebarOpen,
    sidebarExpanded, setSidebarExpanded, isSignedIn
}: SidebarProps) {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const { currentUser } = useLocalStore();
    const [onboardingComplete, setOnboardingComplete] = useState(false);
    const displayName = currentUser?.displayName || currentUser?.username || 'Guest';
    const email = currentUser?.email || 'guest@sciencespire.app';
    const avatarInitials = displayName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0]?.toUpperCase() ?? '')
        .join('') || 'G';
    const onboardingKey = `sciencespire-onboarding-complete-${currentUser.id}`;

    useEffect(() => {
        if (typeof window === 'undefined') return;
        setOnboardingComplete(localStorage.getItem(onboardingKey) === 'true');
    }, [onboardingKey, currentPage]);

    // Close sidebar on Escape key
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSidebarOpen(false);
        };
        if (sidebarOpen) {
            document.addEventListener('keydown', handler);
            return () => document.removeEventListener('keydown', handler);
        }
    }, [sidebarOpen, setSidebarOpen]);

    // Trap focus inside mobile sidebar
    useEffect(() => {
        if (sidebarOpen && sidebarRef.current) {
            const firstBtn = sidebarRef.current.querySelector('button');
            firstBtn?.focus();
        }
    }, [sidebarOpen]);

    const handleNav = (id: string) => {
        onNavigate(id);
        setSidebarOpen(false);
    };

    if (!isSignedIn) return null;

    return (
        <>
            {/* ====== DESKTOP SIDEBAR ====== */}
            <aside
                className={`hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-30 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] border-r`}
                style={{
                    width: sidebarExpanded ? 240 : 68,
                    backgroundColor: 'var(--sidebar-bg)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    borderColor: 'var(--border)',
                }}
                aria-label="Main navigation"
            >
                <div className="flex items-center justify-between p-3 border-b" style={{ borderColor: 'var(--border-light)' }}>
                    <button onClick={() => onNavigate('home')} className="flex items-center gap-2 focus:outline-none min-h-[44px]">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--brand)' }}>
                            <BookOpen size={18} className="text-white" />
                        </div>
                        {sidebarExpanded && (
                            <div className="overflow-hidden">
                                <h1 className="text-lg font-bold font-[family-name:var(--font-display)] leading-tight" style={{ color: 'var(--text)' }}>ScienceSpire</h1>
                                <p className="text-[10px] leading-tight" style={{ color: 'var(--text-secondary)' }}>Student Platform</p>
                            </div>
                        )}
                    </button>
                    <button
                        onClick={() => setSidebarExpanded(!sidebarExpanded)}
                        className="p-1.5 rounded-lg transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
                        style={{ color: 'var(--text-secondary)' }}
                        aria-label={sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
                    >
                        {sidebarExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                    </button>
                </div>

                <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto" aria-label="Main navigation">
                    {navItems.map((item, idx) => {
                        const Icon = item.icon;
                        const active = currentPage === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNav(item.id)}
                                aria-current={active ? 'page' : undefined}
                                title={!sidebarExpanded ? item.label : undefined}
                                className="w-full flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px] animate-fade-in"
                                style={{
                                    animationDelay: `${idx * 40}ms`,
                                    padding: sidebarExpanded ? '8px 12px' : '8px',
                                    justifyContent: sidebarExpanded ? 'flex-start' : 'center',
                                    backgroundColor: active ? 'var(--brand)' : 'transparent',
                                    color: active ? '#FFFFFF' : 'var(--text-secondary)',
                                }}
                                onMouseEnter={e => { if (!active) (e.currentTarget.style.backgroundColor = 'var(--brand-bg)'); }}
                                onMouseLeave={e => { if (!active) (e.currentTarget.style.backgroundColor = 'transparent'); }}
                            >
                                <Icon size={20} strokeWidth={active ? 2.2 : 1.8} className="shrink-0" />
                                {sidebarExpanded && <span>{item.label}</span>}
                            </button>
                        );
                    })}

                    {!onboardingComplete && (
                        <div className="pt-2 mt-2" style={{ borderTop: '1px solid var(--border-light)' }}>
                            <button
                                onClick={() => handleNav('onboarding')}
                                title={!sidebarExpanded ? 'Get Started' : undefined}
                                className="w-full flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-150 min-h-[44px]"
                                style={{
                                    padding: sidebarExpanded ? '8px 12px' : '8px',
                                    justifyContent: sidebarExpanded ? 'flex-start' : 'center',
                                    backgroundColor: currentPage === 'onboarding' ? 'var(--brand)' : 'transparent',
                                    color: currentPage === 'onboarding' ? '#FFFFFF' : 'var(--success)',
                                }}
                            >
                                <Rocket size={20} strokeWidth={1.8} className="shrink-0" />
                                {sidebarExpanded && <span>Get Started</span>}
                            </button>
                        </div>
                    )}
                </nav>

                {/* User section */}
                <div className="p-2 border-t" style={{ borderColor: 'var(--border-light)' }}>
                    {sidebarExpanded && (
                        <div className="px-3 pb-2">
                            <LevelChip />
                        </div>
                    )}
                    <button
                        onClick={() => handleNav('profile')}
                        className="w-full flex items-center gap-3 rounded-lg text-sm transition-colors min-h-[44px]"
                        style={{
                            padding: sidebarExpanded ? '8px 12px' : '8px',
                            justifyContent: sidebarExpanded ? 'flex-start' : 'center',
                            color: 'var(--text-secondary)',
                        }}
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6] flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {avatarInitials}
                        </div>
                        {sidebarExpanded && (
                            <div className="text-left overflow-hidden">
                                <div className="font-medium text-sm truncate" style={{ color: 'var(--text)' }}>{displayName}</div>
                                <div className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>Student</div>
                            </div>
                        )}
                    </button>
                </div>
            </aside>

            {/* ====== MOBILE SLIDE-OUT MENU ====== */}
            <div
                className={`lg:hidden fixed inset-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
            >
                <div
                    className={`absolute inset-0 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
                    style={{ backgroundColor: 'var(--surface-overlay)' }}
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
                <div
                    ref={sidebarRef}
                    className={`absolute left-0 top-0 bottom-0 w-72 shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
                    style={{
                        backgroundColor: 'var(--sidebar-bg)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                    }}
                >
                    <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border-light)' }}>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--brand)' }}>
                                <BookOpen size={16} className="text-white" />
                            </div>
                            <span className="text-lg font-bold font-[family-name:var(--font-display)]" style={{ color: 'var(--text)' }}>ScienceSpire</span>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-2 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                            style={{ color: 'var(--text-secondary)' }}
                            aria-label="Close menu"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* User card */}
                    <div className="p-4 border-b" style={{ borderColor: 'var(--border-light)' }}>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6] flex items-center justify-center text-white text-sm font-bold">
                                {avatarInitials}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold" style={{ color: 'var(--text)' }}>{displayName}</div>
                                <div className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{email}</div>
                                <LevelChip />
                            </div>
                        </div>
                    </div>

                    <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto" aria-label="Mobile navigation">
                        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Main</div>
                        {navItems.map(item => {
                            const Icon = item.icon;
                            const active = currentPage === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleNav(item.id)}
                                    className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium min-h-[44px] transition-all"
                                    style={{
                                        backgroundColor: active ? 'var(--brand)' : 'transparent',
                                        color: active ? '#FFFFFF' : 'var(--text-secondary)',
                                    }}
                                >
                                    <Icon size={20} />
                                    {item.label}
                                </button>
                            );
                        })}

                        {!onboardingComplete && (
                            <>
                                <div className="px-3 pt-4 pb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>More</div>
                                {[
                                    { id: 'onboarding', label: 'Get Started', icon: Rocket },
                                ].map(item => {
                                    const Icon = item.icon;
                                    const active = currentPage === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => handleNav(item.id)}
                                            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium min-h-[44px] transition-all"
                                            style={{
                                                backgroundColor: active ? 'var(--brand)' : 'transparent',
                                                color: active ? '#FFFFFF' : 'var(--text-secondary)',
                                            }}
                                        >
                                            <Icon size={20} />
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </>
    );
}
