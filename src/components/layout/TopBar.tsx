import { useMemo, useState } from 'react';
import { Search, Bell, Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/store/useThemeStore';
import { useLocalStore } from '@/store/useLocalStore';
import { BookOpen } from 'lucide-react';

const SEARCH_INDEX = [
    { label: 'Quantum Physics Basics', page: 'resources', query: 'quantum physics', kind: 'Resource' },
    { label: 'Cell Biology Fundamentals', page: 'resources', query: 'biology', kind: 'Resource' },
    { label: 'Chemistry Lab Safety', page: 'resources', query: 'chemistry', kind: 'Resource' },
    { label: 'Plate Tectonics Session', page: 'schedule', query: 'earth science', kind: 'Session' },
    { label: 'Genetics and Heredity Session', page: 'schedule', query: 'biology', kind: 'Session' },
    { label: 'Community: Physics Help', page: 'community', query: 'physics', kind: 'Community' },
];

interface TopBarProps {
    currentPage: string;
    onNavigate: (page: string) => void;
    onOpenSidebar: () => void;
    isSignedIn: boolean;
    sidebarExpanded: boolean;
    searchQuery?: string;
    onSearchChange?: (q: string) => void;
}

export default function TopBar({ currentPage, onNavigate, onOpenSidebar, isSignedIn, sidebarExpanded, searchQuery = '', onSearchChange }: TopBarProps) {
    const { themeMode, toggleTheme } = useTheme();
    const { currentUser, notifications, clearNotification } = useLocalStore();
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const displayName = currentUser?.displayName || currentUser?.username || 'Guest';
    const avatarInitials = displayName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0]?.toUpperCase() ?? '')
        .join('') || 'G';

    const desktopLeft = isSignedIn ? (sidebarExpanded ? 240 : 68) : 0;
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const searchResults = useMemo(() => {
        if (!normalizedQuery) return [];
        return SEARCH_INDEX.filter(item =>
            item.label.toLowerCase().includes(normalizedQuery) ||
            item.query.toLowerCase().includes(normalizedQuery) ||
            item.kind.toLowerCase().includes(normalizedQuery)
        ).slice(0, 6);
    }, [normalizedQuery]);

    return (
        <>
            {/* ====== DESKTOP TOP BAR ====== */}
            <header
                className="hidden lg:flex fixed top-0 right-0 h-14 items-center px-6 z-20 border-b transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                    left: desktopLeft,
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)',
                }}
            >
                <div className="flex-1 flex items-center">
                    {!isSignedIn && (
                        <button onClick={() => onNavigate('home')} className="flex items-center gap-2 mr-6 focus:outline-none">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--brand)' }}>
                                <BookOpen size={18} className="text-white" />
                            </div>
                            <h1 className="text-lg font-bold font-[family-name:var(--font-display)]" style={{ color: 'var(--text)' }}>ScienceSpire</h1>
                        </button>
                    )}
                    {!isSignedIn && (
                        <nav className="hidden xl:flex items-center gap-4 text-sm mr-6" style={{ color: 'var(--text-secondary)' }}>
                            <button onClick={() => onNavigate('about')} className="hover:underline underline-offset-2">About</button>
                            <button onClick={() => onNavigate('schedule')} className="hover:underline underline-offset-2">Schedule</button>
                            <button onClick={() => onNavigate('resources')} className="hover:underline underline-offset-2">Resources</button>
                        </nav>
                    )}
                    <div className="relative w-72 xl:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} style={{ color: 'var(--text-secondary)' }} />
                        <input
                            type="search"
                            placeholder="Search resources, sessions, people..."
                            aria-label="Search"
                            value={searchQuery}
                            onChange={e => onSearchChange?.(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg text-sm border transition-all focus:outline-none focus:ring-2"
                            style={{
                                backgroundColor: 'var(--bg)',
                                color: 'var(--text)',
                                borderColor: 'transparent',
                            }}
                            onFocus={e => {
                                e.currentTarget.style.borderColor = 'var(--brand)';
                                e.currentTarget.style.backgroundColor = 'var(--card)';
                                setShowSearchResults(true);
                            }}
                            onBlur={e => {
                                e.currentTarget.style.borderColor = 'transparent';
                                e.currentTarget.style.backgroundColor = 'var(--bg)';
                                setTimeout(() => setShowSearchResults(false), 120);
                            }}
                            onKeyDown={e => {
                                if (e.key === 'Enter' && normalizedQuery) onNavigate('resources');
                            }}
                        />
                        {showSearchResults && normalizedQuery && (
                            <div
                                className="absolute top-[calc(100%+8px)] left-0 right-0 rounded-xl border shadow-lg overflow-hidden animate-slide-down"
                                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                            >
                                {searchResults.length > 0 ? searchResults.map(item => (
                                    <button
                                        key={`${item.page}-${item.label}`}
                                        onClick={() => {
                                            onSearchChange?.(item.query);
                                            onNavigate(item.page);
                                            setShowSearchResults(false);
                                        }}
                                        className="w-full text-left px-3 py-2.5 text-sm border-b last:border-b-0 transition-colors"
                                        style={{ color: 'var(--text)', borderColor: 'var(--border-light)' }}
                                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--bg)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                                    >
                                        <div className="font-medium">{item.label}</div>
                                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.kind}</div>
                                    </button>
                                )) : (
                                    <div className="px-3 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                        No matches found.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-lg transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
                        style={{ color: 'var(--text-secondary)' }}
                        aria-label={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}
                    >
                        {themeMode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                    {isSignedIn && (
                    <button
                        onClick={() => setShowNotifications(v => !v)}
                        className="relative p-2.5 rounded-lg transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
                        style={{ color: 'var(--text-secondary)' }}
                        aria-label={`Notifications (${notifications.length} new)`}
                    >
                        <Bell size={20} />
                        {notifications.length > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--error)' }} aria-hidden="true" />
                        )}
                    </button>
                    )}
                    {isSignedIn && (
                        <button
                            onClick={() => onNavigate('profile')}
                            className="flex items-center gap-2 ml-1 p-1.5 rounded-lg transition-colors"
                            aria-label={`Open profile for ${displayName}`}
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6] flex items-center justify-center text-white text-xs font-bold">
                                {avatarInitials}
                            </div>
                        </button>
                    )}
                    {!isSignedIn && (
                        <>
                            <button
                                onClick={() => onNavigate('signin')}
                                className="px-3 py-2 rounded-lg text-sm font-medium min-h-[40px]"
                                style={{ color: 'var(--text)' }}
                            >
                                Sign in
                            </button>
                            <button
                                onClick={() => onNavigate('signup')}
                                className="px-3 py-2 rounded-lg text-sm font-semibold min-h-[40px]"
                                style={{ backgroundColor: 'var(--brand)', color: '#FFFFFF' }}
                            >
                                Sign up
                            </button>
                        </>
                    )}
                </div>
                {isSignedIn && showNotifications && (
                    <div
                        className="absolute right-6 top-14 w-80 rounded-xl border shadow-xl overflow-hidden z-40 animate-slide-down"
                        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                    >
                        <div className="px-4 py-3 border-b text-sm font-semibold" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
                            Notifications
                        </div>
                        <div className="max-h-72 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="px-4 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>No notifications yet.</div>
                            ) : notifications.map((note, idx) => (
                                <div key={`${note}-${idx}`} className="px-4 py-3 border-b last:border-b-0" style={{ borderColor: 'var(--border-light)' }}>
                                    <div className="text-sm" style={{ color: 'var(--text)' }}>{note}</div>
                                    <button
                                        onClick={() => clearNotification(idx)}
                                        className="mt-1 text-xs underline"
                                        style={{ color: 'var(--brand)' }}
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </header>

            {/* ====== MOBILE TOP BAR ====== */}
            <header
                className="lg:hidden fixed top-0 left-0 right-0 h-14 flex items-center px-4 z-30 border-b"
                style={{
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)',
                }}
            >
                {isSignedIn ? (
                    <button
                        onClick={onOpenSidebar}
                        className="p-2 -ml-1 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
                        style={{ color: 'var(--text-secondary)' }}
                        aria-label="Open navigation menu"
                    >
                        <Menu size={22} />
                    </button>
                ) : null}
                <button onClick={() => onNavigate('home')} className="flex items-center gap-1.5 ml-1">
                    <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: 'var(--brand)' }}>
                        <BookOpen size={14} className="text-white" />
                    </div>
                    <span className="text-lg font-bold font-[family-name:var(--font-display)]" style={{ color: 'var(--text)' }}>ScienceSpire</span>
                </button>
                <div className="flex-1" />
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
                    style={{ color: 'var(--text-secondary)' }}
                    aria-label={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}
                >
                    {themeMode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </button>
                {!isSignedIn && (
                    <button
                        onClick={() => onNavigate('signin')}
                        className="px-3 py-2 rounded-lg text-sm font-medium min-h-[40px]"
                        style={{ color: 'var(--text)' }}
                    >
                        Sign in
                    </button>
                )}
                {isSignedIn && (
                <button
                    onClick={() => onNavigate('profile')}
                    className="relative p-2 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
                    style={{ color: 'var(--text-secondary)' }}
                    aria-label={`Open profile${notifications.length > 0 ? ` — ${notifications.length} new notification${notifications.length !== 1 ? 's' : ''}` : ''}`}
                >
                    <Bell size={20} />
                    {notifications.length > 0 && (
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--error)' }} aria-hidden="true" />
                    )}
                </button>
                )}
            </header>
        </>
    );
}
