import { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import BottomNav from './components/layout/BottomNav';
import HomePublic from './pages/HomePublic';
import HomeDashboard from './pages/HomeDashboard';
import Dashboard from './pages/Dashboard';
import SchedulePage from './pages/SchedulePage';
import ResourcesPage from './pages/ResourcesPage';
import CommunityPage from './pages/CommunityPage';
import PortfolioPage from './pages/PortfolioPage';
import CreatorStudioPage from './pages/CreatorStudioPage';
import Onboarding from './pages/Onboarding';
import Profile from './pages/Profile';
import AuthPage from './pages/AuthPage';
import { useLocalStore } from './store/useLocalStore';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024);
  const { isSignedIn, signOut } = useLocalStore();

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Pages that guests can access without signing in
  const GUEST_PAGES = ['home', 'schedule', 'resources'];
  const needsAuth = !isSignedIn && !GUEST_PAGES.includes(currentPage);

  const renderPage = () => {
    if (needsAuth) {
      return (
        <AuthPage
          onAuthSuccess={() => setCurrentPage('home')}
          onGoHome={() => setCurrentPage('home')}
          initialTab="signin"
        />
      );
    }
    switch (currentPage) {
      case 'home':
        return isSignedIn
          ? <HomeDashboard onNavigate={setCurrentPage} />
          : <HomePublic onNavigate={setCurrentPage} onSignIn={() => setCurrentPage('auth')} />;
      case 'auth':
        return <AuthPage onAuthSuccess={() => setCurrentPage('home')} onGoHome={() => setCurrentPage('home')} />;
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'schedule':
        return (
          <SchedulePage
            searchQuery={searchQuery}
            isSignedIn={isSignedIn}
            onNavigate={setCurrentPage}
          />
        );
      case 'resources':
        return (
          <ResourcesPage
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        );
      case 'community':
        return <CommunityPage />;
      case 'portfolio':
        return <PortfolioPage />;
      case 'creator':
        return <CreatorStudioPage />;
      case 'onboarding':
        return <Onboarding onNavigate={setCurrentPage} />;
      case 'profile':
        return (
          <Profile
            onNavigate={setCurrentPage}
            onSignOut={() => { signOut(); setCurrentPage('home'); }}
          />
        );
      default:
        return isSignedIn
          ? <HomeDashboard onNavigate={setCurrentPage} />
          : <HomePublic onNavigate={setCurrentPage} onSignIn={() => setCurrentPage('auth')} />;
    }
  };

  const sidebarDesktopWidth = isSignedIn ? (sidebarExpanded ? 240 : 68) : 0;
  const isAuthFullscreen = needsAuth || currentPage === 'auth';
  const isUnsignedHome = !isSignedIn && currentPage === 'home';

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      {!isAuthFullscreen && (
        <>
          <Sidebar
            currentPage={currentPage}
            onNavigate={setCurrentPage}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            sidebarExpanded={sidebarExpanded}
            setSidebarExpanded={setSidebarExpanded}
            isSignedIn={isSignedIn}
          />
          {!isUnsignedHome && (
            <TopBar
              currentPage={currentPage}
              onNavigate={setCurrentPage}
              onOpenSidebar={() => setSidebarOpen(true)}
              isSignedIn={isSignedIn}
              sidebarExpanded={sidebarExpanded}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          )}
        </>
      )}

      <main
        className={isAuthFullscreen ? '' : `${isUnsignedHome ? 'pb-20 lg:pb-6' : 'pt-14 pb-20 lg:pb-6'} min-h-screen transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]`}
        style={{ marginLeft: (!isAuthFullscreen && isDesktop) ? sidebarDesktopWidth : 0 }}
      >
        {isAuthFullscreen ? (
          renderPage()
        ) : (
          <div className="p-4 lg:p-6 max-w-7xl mx-auto animate-page-enter" key={currentPage}>
            {renderPage()}
          </div>
        )}
      </main>

      {isSignedIn && !isAuthFullscreen && (
        <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
      )}
    </div>
  );
}
