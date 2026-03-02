import { useState } from 'react';
import {
  Home, LayoutDashboard, Calendar, BookOpen, Users,
  FolderOpen, Palette, User, Search, Bell, Menu, X,
  Rocket, Settings, HelpCircle
} from 'lucide-react';

interface LayoutProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  children: React.ReactNode;
}

const desktopNavItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'resources', label: 'Resources', icon: BookOpen },
  { id: 'community', label: 'Community', icon: Users },
  { id: 'portfolio', label: 'Portfolio', icon: FolderOpen },
  { id: 'creator', label: 'Creator Studio', icon: Palette },
];

const mobileNavItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'resources', label: 'Resources', icon: BookOpen },
  { id: 'community', label: 'Community', icon: Users },
  { id: 'profile', label: 'Profile', icon: User },
];

const mobileMenuExtra = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'portfolio', label: 'Portfolio', icon: FolderOpen },
  { id: 'creator', label: 'Creator Studio', icon: Palette },
  { id: 'onboarding', label: 'Get Started', icon: Rocket },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
];

export default function Layout({ currentPage, onNavigate, children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* ====== DESKTOP SIDEBAR ====== */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-60 bg-white border-r border-gray-200 z-30">
        <div className="p-5 border-b border-gray-100">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 focus:outline-none">
            <div className="w-8 h-8 rounded-lg bg-[#1D4ED8] flex items-center justify-center">
              <BookOpen size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#111827] leading-tight">ScienceSpire</h1>
              <p className="text-[10px] text-[#4B5563] leading-tight">Student Platform</p>
            </div>
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto" aria-label="Main navigation">
          {desktopNavItems.map(item => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                aria-current={active ? 'page' : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                  ${active
                    ? 'bg-[#1D4ED8] text-white shadow-sm'
                    : 'text-[#4B5563] hover:bg-[#F5F5F7] hover:text-[#111827]'
                  }`}
              >
                <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
                {item.label}
              </button>
            );
          })}

          <div className="pt-3 mt-3 border-t border-gray-100">
            <button
              onClick={() => onNavigate('onboarding')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                ${currentPage === 'onboarding'
                  ? 'bg-[#1D4ED8] text-white shadow-sm'
                  : 'text-[#059669] hover:bg-emerald-50'
                }`}
            >
              <Rocket size={20} strokeWidth={1.8} />
              Get Started
            </button>
          </div>
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={() => onNavigate('profile')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#4B5563] hover:bg-[#F5F5F7] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6] flex items-center justify-center text-white text-xs font-bold">
              JS
            </div>
            <div className="text-left">
              <div className="font-medium text-[#111827] text-sm">Jane Smith</div>
              <div className="text-xs text-[#4B5563]">Student</div>
            </div>
          </button>
        </div>
      </aside>

      {/* ====== DESKTOP TOP BAR ====== */}
      <header className="hidden lg:flex fixed top-0 left-60 right-0 h-14 bg-white border-b border-gray-200 items-center px-6 z-20">
        <div className="flex-1 flex items-center">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4B5563]" size={18} />
            <input
              type="text"
              placeholder="Search resources, sessions, people..."
              aria-label="Search"
              className="w-full pl-10 pr-4 py-2 bg-[#F5F5F7] rounded-lg text-sm text-[#111827] placeholder-[#4B5563] border border-transparent focus:border-[#1D4ED8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 transition-all"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="relative p-2.5 rounded-lg text-[#4B5563] hover:bg-[#F5F5F7] transition-colors"
            aria-label="Notifications (3 new)"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#B91C1C] rounded-full" aria-hidden="true" />
          </button>
          <button
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2 ml-2 p-1.5 rounded-lg hover:bg-[#F5F5F7] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6] flex items-center justify-center text-white text-xs font-bold">
              JS
            </div>
          </button>
        </div>
      </header>

      {/* ====== MOBILE TOP BAR ====== */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center px-4 z-30">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 -ml-1 rounded-lg text-[#4B5563] hover:bg-[#F5F5F7] min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>
        <button onClick={() => onNavigate('home')} className="flex items-center gap-1.5 ml-1">
          <div className="w-7 h-7 rounded-md bg-[#1D4ED8] flex items-center justify-center">
            <BookOpen size={14} className="text-white" />
          </div>
          <span className="text-lg font-bold text-[#111827]">ScienceSpire</span>
        </button>
        <div className="flex-1" />
        <button
          className="p-2 rounded-lg text-[#4B5563] hover:bg-[#F5F5F7] min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Search"
        >
          <Search size={20} />
        </button>
        <button
          className="relative p-2 rounded-lg text-[#4B5563] hover:bg-[#F5F5F7] min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Notifications (3 new)"
        >
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#B91C1C] rounded-full" aria-hidden="true" />
        </button>
      </header>

      {/* ====== MOBILE SLIDE-OUT MENU ====== */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div
            className="absolute inset-0 bg-black/40 transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl animate-fade-in flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#1D4ED8] flex items-center justify-center">
                  <BookOpen size={16} className="text-white" />
                </div>
                <span className="text-lg font-bold text-[#111827]">ScienceSpire</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-[#4B5563] hover:bg-[#F5F5F7] min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* User card */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6] flex items-center justify-center text-white text-sm font-bold">
                  JS
                </div>
                <div>
                  <div className="font-semibold text-[#111827]">Jane Smith</div>
                  <div className="text-xs text-[#4B5563]">jane@student.edu</div>
                </div>
              </div>
            </div>

            <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto" aria-label="Mobile navigation">
              <div className="px-3 py-2 text-xs font-semibold text-[#4B5563] uppercase tracking-wider">Main</div>
              {desktopNavItems.map(item => {
                const Icon = item.icon;
                const active = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { onNavigate(item.id); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium min-h-[44px] transition-all
                      ${active ? 'bg-[#1D4ED8] text-white' : 'text-[#4B5563] hover:bg-[#F5F5F7]'}
                    `}
                  >
                    <Icon size={20} />
                    {item.label}
                  </button>
                );
              })}

              <div className="px-3 pt-4 pb-2 text-xs font-semibold text-[#4B5563] uppercase tracking-wider">More</div>
              {mobileMenuExtra.map(item => {
                const Icon = item.icon;
                const active = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { onNavigate(item.id); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium min-h-[44px] transition-all
                      ${active ? 'bg-[#1D4ED8] text-white' : 'text-[#4B5563] hover:bg-[#F5F5F7]'}
                    `}
                  >
                    <Icon size={20} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* ====== MAIN CONTENT ====== */}
      <main className="lg:ml-60 pt-14 pb-20 lg:pb-6 min-h-screen">
        <div className="p-4 lg:p-6 max-w-7xl mx-auto animate-fade-in" key={currentPage}>
          {children}
        </div>
      </main>

      {/* ====== MOBILE BOTTOM NAV ====== */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 safe-area-bottom"
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
                className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[48px] rounded-lg text-[11px] transition-all
                  ${active ? 'text-[#1D4ED8] font-semibold' : 'text-[#4B5563]'}
                `}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
