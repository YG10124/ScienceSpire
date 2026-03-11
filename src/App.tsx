import { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import BottomNav from './components/layout/BottomNav';
import Breadcrumbs from './components/layout/Breadcrumbs';
import SiteFooter from './components/layout/SiteFooter';
import HomePublic from './pages/HomePublic';
import HomeDashboard from './pages/HomeDashboard';
import Dashboard from './pages/Dashboard';
import SchedulePage from './pages/SchedulePage';
import ResourcesPage from './pages/ResourcesPage';
import CommunityPage from './pages/CommunityPage';
import PortfolioPage from './pages/PortfolioPage';
import CreatorStudioPage from './pages/CreatorStudioPage';
import LessonsPage from './pages/LessonsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import Onboarding from './pages/Onboarding';
import Profile from './pages/Profile';
import AuthPage from './pages/AuthPage';
import AboutPage from './pages/AboutPage';
import { useLocalStore } from './store/useLocalStore';
import { GamificationProvider } from './store/useGamificationStore';
import { processLogin } from './store/gamificationModule';
import XPToast from './components/gamification/XPToast';
import BadgeUnlockModal from './components/gamification/BadgeUnlockModal';
import { PAGE_META, type AppPage, type BreadcrumbItem } from './config/site';

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [detailBreadcrumbs, setDetailBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024);
  const { isSignedIn, signOut, currentUser } = useLocalStore();

  // Award daily login XP when user is signed in
  useEffect(() => {
    if (isSignedIn) processLogin();
  }, [isSignedIn]);

  const displayName = currentUser?.displayName || currentUser?.username || 'You';
  const avatarInitials = displayName.split(' ').filter(Boolean).slice(0, 2).map((p: string) => p[0]?.toUpperCase() ?? '').join('') || 'YO';

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const GUEST_PAGES: AppPage[] = ['home', 'about', 'schedule', 'resources', 'lessons', 'signin', 'signup', 'auth'];
  const needsAuth = !isSignedIn && !GUEST_PAGES.includes(currentPage);
  const metaPage = (currentPage === 'auth' ? 'signin' : currentPage) as AppPage;
  const pageMeta = PAGE_META[metaPage];

  useEffect(() => {
    setDetailBreadcrumbs([]);
  }, [currentPage]);

  useEffect(() => {
    document.title = pageMeta.title;
    const description = document.querySelector('meta[name="description"]') ?? document.createElement('meta');
    description.setAttribute('name', 'description');
    description.setAttribute('content', pageMeta.description);
    if (!description.parentElement) {
      document.head.appendChild(description);
    }
  }, [pageMeta]);

  const breadcrumbs = useMemo(
    () => [...pageMeta.breadcrumbs, ...detailBreadcrumbs],
    [pageMeta.breadcrumbs, detailBreadcrumbs],
  );

  useEffect(() => {
    const existing = document.getElementById('breadcrumb-jsonld');
    if (existing) {
      existing.remove();
    }
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'breadcrumb-jsonld';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.label,
        item: crumb.page ? `/${crumb.page}` : undefined,
      })),
    });
    document.head.appendChild(script);
    return () => script.remove();
  }, [breadcrumbs]);

  const navigate = (page: string) => {
    setCurrentPage(page as AppPage);
    setSidebarOpen(false);
  };

  const renderPage = () => {
    if (needsAuth) {
      return (
        <AuthPage
          onAuthSuccess={() => navigate('home')}
          onGoHome={() => navigate('home')}
          initialTab="signin"
        />
      );
    }
    switch (currentPage) {
      case 'home':
        return isSignedIn
          ? <HomeDashboard onNavigate={navigate} />
          : <HomePublic onNavigate={navigate} onSignIn={() => navigate('signin')} />;
      case 'about':
        return <AboutPage onNavigate={navigate} />;
      case 'auth':
      case 'signin':
        return <AuthPage onAuthSuccess={() => navigate('home')} onGoHome={() => navigate('home')} initialTab="signin" />;
      case 'signup':
        return <AuthPage onAuthSuccess={() => navigate('home')} onGoHome={() => navigate('home')} initialTab="signup" />;
      case 'dashboard':
        return <Dashboard onNavigate={navigate} />;
      case 'schedule':
        return (
          <SchedulePage
            searchQuery={searchQuery}
            isSignedIn={isSignedIn}
            onNavigate={navigate}
            onBreadcrumbChange={setDetailBreadcrumbs}
          />
        );
      case 'resources':
        return (
          <ResourcesPage
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onBreadcrumbChange={setDetailBreadcrumbs}
          />
        );
      case 'lessons':
        return <LessonsPage onBreadcrumbChange={setDetailBreadcrumbs} />;
      case 'community':
        return <CommunityPage onBreadcrumbChange={setDetailBreadcrumbs} />;
      case 'portfolio':
        return <PortfolioPage onBreadcrumbChange={setDetailBreadcrumbs} />;
      case 'creator':
        return <CreatorStudioPage onBreadcrumbChange={setDetailBreadcrumbs} />;
      case 'leaderboard':
        return <LeaderboardPage onNavigate={navigate} onBreadcrumbChange={setDetailBreadcrumbs} />;
      case 'onboarding':
        return <Onboarding onNavigate={navigate} />;
      case 'profile':
        return (
          <Profile
            onNavigate={navigate}
            onSignOut={() => { signOut(); navigate('home'); }}
          />
        );
      default:
        return isSignedIn
          ? <HomeDashboard onNavigate={navigate} />
          : <HomePublic onNavigate={navigate} onSignIn={() => navigate('signin')} />;
    }
  };

  const sidebarDesktopWidth = isSignedIn ? (sidebarExpanded ? 240 : 68) : 0;
  const isAuthFullscreen = needsAuth || currentPage === 'auth' || currentPage === 'signin' || currentPage === 'signup';
  const isUnsignedHome = !isSignedIn && currentPage === 'home';
  const shouldShowFooter = !isAuthFullscreen && !isUnsignedHome;

  return (
    <GamificationProvider currentUserName={displayName} currentUserInitials={avatarInitials}>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
        {!isAuthFullscreen && (
          <>
            <Sidebar
              currentPage={currentPage}
              onNavigate={navigate}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              sidebarExpanded={sidebarExpanded}
              setSidebarExpanded={setSidebarExpanded}
              isSignedIn={isSignedIn}
            />
            {!isUnsignedHome && (
              <TopBar
                currentPage={currentPage}
                onNavigate={navigate}
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
              <Breadcrumbs items={breadcrumbs} onNavigate={navigate} />
              {renderPage()}
            </div>
          )}
        </main>

        {shouldShowFooter && <SiteFooter onNavigate={navigate} isSignedIn={isSignedIn} />}

        {isSignedIn && !isAuthFullscreen && (
          <BottomNav currentPage={currentPage} onNavigate={navigate} />
        )}

        {/* Gamification overlays — portals at root level */}
        {isSignedIn && (
          <>
            <XPToast />
            <BadgeUnlockModal />
          </>
        )}
      </div>
    </GamificationProvider>
  );
}
