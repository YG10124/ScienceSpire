import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight, Atom, FlaskConical, Leaf, Mountain, Menu, Moon, Sun,
  Calendar, Users, Beaker, ChevronRight, GraduationCap, X,
} from 'lucide-react';
import { useTheme } from '@/store/useThemeStore';

type SectionKey = 'tracks' | 'sessions' | 'community' | 'about';

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0px)' : 'translateY(20px)',
        transitionDelay: visible ? `${delay}ms` : '0ms',
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      {children}
    </div>
  );
}

interface HomePublicProps {
  onNavigate: (page: string) => void;
  onSignIn: () => void;
}

export default function HomePublic({ onNavigate, onSignIn }: HomePublicProps) {
  const { themeMode, toggleTheme } = useTheme();
  const [scrollY, setScrollY] = useState(0);
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [showCommunityOverlay, setShowCommunityOverlay] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tracksRef = useRef<HTMLElement | null>(null);
  const sessionsRef = useRef<HTMLElement | null>(null);
  const communityRef = useRef<HTMLElement | null>(null);
  const aboutRef = useRef<HTMLElement | null>(null);

  const prefersReducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  useEffect(() => {
    if (prefersReducedMotion) return;
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = setInterval(() => {
      setHeadlineIndex(prev => (prev + 1) % 4);
    }, 2800);
    return () => clearInterval(timer);
  }, [prefersReducedMotion]);

  const headlineItems = [
    'Master Physics with other students.',
    'Crack Chemistry reactions together.',
    'Explore living systems in Biology.',
    'Understand our planet in Earth Science.',
  ];

  const sectionMap: Record<SectionKey, React.RefObject<HTMLElement>> = {
    tracks: tracksRef,
    sessions: sessionsRef,
    community: communityRef,
    about: aboutRef,
  };

  const scrollToSection = (key: SectionKey) => {
    sectionMap[key].current?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    setMobileMenuOpen(false);
  };

  const parallax = (factor: number) => (prefersReducedMotion ? 'translateY(0px)' : `translateY(${scrollY * factor}px)`);
  const compactHeader = scrollY > 24;

  return (
    <div className="space-y-0">
      {/* ====== HEADER ====== */}
      <header
        className="sticky top-0 z-40 border-b transition-all duration-200"
        style={{
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          backgroundColor: 'var(--sidebar-bg)',
          borderColor: 'var(--border)',
        }}
      >
        <div
          className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between transition-all duration-200"
          style={{ height: compactHeader ? 60 : 74 }}
        >
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 min-h-[44px]">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--brand)' }}>
              <Beaker size={18} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-bold" style={{ color: 'var(--text)' }}>ScienceSpire</div>
              <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Student science hub</div>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-5 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <button onClick={() => scrollToSection('tracks')} className="hover:opacity-80 transition-opacity min-h-[44px]">Science tracks</button>
            <button onClick={() => scrollToSection('sessions')} className="hover:opacity-80 transition-opacity min-h-[44px]">Live sessions</button>
            <button onClick={() => scrollToSection('community')} className="hover:opacity-80 transition-opacity min-h-[44px]">Community</button>
            <button onClick={() => scrollToSection('about')} className="hover:opacity-80 transition-opacity min-h-[44px]">About</button>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg min-h-[40px] min-w-[40px] flex items-center justify-center"
              style={{ color: 'var(--text-secondary)' }}
              aria-label="Toggle theme"
            >
              {themeMode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button
              onClick={onSignIn}
              className="hidden sm:inline-flex px-4 py-2.5 rounded-xl text-sm font-medium border min-h-[44px]"
              style={{ color: 'var(--text)', borderColor: 'var(--border)' }}
            >
              Sign in
            </button>
            <button
              onClick={onSignIn}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold min-h-[44px]"
              style={{ backgroundColor: 'var(--brand)', color: '#FFFFFF' }}
            >
              Sign up
            </button>
            <button
              className="lg:hidden p-2 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
              style={{ color: 'var(--text-secondary)' }}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileMenuOpen(v => !v)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile nav dropdown */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden border-t animate-slide-down"
            style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--sidebar-bg)' }}
          >
            <div className="px-4 py-3 space-y-1">
              {(['tracks', 'sessions', 'community', 'about'] as SectionKey[]).map(key => (
                <button
                  key={key}
                  onClick={() => scrollToSection(key)}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm min-h-[44px]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {key === 'tracks' ? 'Science tracks' : key === 'sessions' ? 'Live sessions' : key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ====== HERO ====== */}
      <section
        className="relative overflow-hidden min-h-[78vh] px-4 lg:px-8 py-14 lg:py-20"
        style={{ background: 'linear-gradient(160deg, var(--card) 0%, var(--bg) 55%, var(--card-alt) 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 -left-20 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.20), transparent 65%)', transform: parallax(0.12) }} />
          <div className="absolute -bottom-24 right-0 w-[28rem] h-[28rem] rounded-full" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.18), transparent 65%)', transform: parallax(0.08) }} />
          <div className="absolute top-24 right-16 text-4xl select-none" style={{ transform: parallax(0.2), opacity: 0.24 }} aria-hidden="true">&#x2697;</div>
          <div className="absolute top-40 left-1/4 text-3xl select-none" style={{ transform: parallax(0.16), opacity: 0.2 }} aria-hidden="true">&#x1F9EC;</div>
          <div className="absolute bottom-24 left-20 text-4xl select-none" style={{ transform: parallax(0.1), opacity: 0.22 }} aria-hidden="true">&#x1F30D;</div>
        </div>

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5"
              style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}
            >
              Physics &middot; Chemistry &middot; Biology &middot; Earth Science
            </div>
            <h1
              className="text-3xl lg:text-5xl font-bold leading-tight font-[family-name:var(--font-display)]"
              style={{ color: 'var(--text)' }}
            >
              Learn science alongside students working through the same material.
            </h1>
            <p className="mt-4 text-base lg:text-lg max-w-xl" style={{ color: 'var(--text-secondary)' }}>
              Join study groups, work through real lab problems, and keep a portfolio of your science work &mdash; all built and run by students.
            </p>

            <div className="mt-5 min-h-[36px]">
              <p key={headlineIndex} className="text-lg font-semibold animate-fade-in" style={{ color: 'var(--brand)' }}>
                {headlineItems[headlineIndex]}
              </p>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={onSignIn}
                className="inline-flex items-center gap-2 font-semibold px-6 py-3.5 rounded-xl text-sm min-h-[48px] shadow-lg hover:shadow-xl transition-all duration-200"
                style={{ backgroundColor: 'var(--brand)', color: '#FFFFFF' }}
              >
                Create an account <ArrowRight size={16} />
              </button>
              <button
                onClick={() => scrollToSection('sessions')}
                className="inline-flex items-center gap-2 font-medium px-6 py-3.5 rounded-xl text-sm border min-h-[48px] transition-all duration-200"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                Browse sessions
              </button>
              <button
                onClick={() => scrollToSection('tracks')}
                className="inline-flex items-center gap-2 font-medium px-6 py-3.5 rounded-xl text-sm border min-h-[48px] transition-all duration-200"
                style={{ borderColor: 'var(--brand)', color: 'var(--brand)' }}
              >
                Explore tracks
              </button>
            </div>
          </div>

          <div className="relative">
            <div
              className="rounded-3xl border p-6 lg:p-8 shadow-xl"
              style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', transform: parallax(0.06) }}
            >
              <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>Upcoming sessions</h3>
              <div className="space-y-3">
                {[
                  { t: 'Physics: Free-body Diagrams Lab', time: 'Today &middot; 4:00 PM', kind: 'Live lab' },
                  { t: 'Chemistry: Acid-Base Titration Review', time: 'Tomorrow &middot; 6:30 PM', kind: 'Exam review' },
                  { t: 'Biology: Cell Signaling Q&A', time: 'Thu &middot; 5:00 PM', kind: 'Study group' },
                ].map((item, idx) => (
                  <div key={idx} className="rounded-xl p-3 border" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border-light)' }}>
                    <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{item.t}</div>
                    <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{item.time} &middot; {item.kind}</div>
                  </div>
                ))}
              </div>
              <button onClick={onSignIn} className="mt-4 text-sm font-medium inline-flex items-center gap-1" style={{ color: 'var(--brand)' }}>
                Sign up to join sessions <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-14">
        <Reveal delay={0}>
          <h2 className="text-2xl lg:text-3xl font-bold text-center font-[family-name:var(--font-display)]" style={{ color: 'var(--text)' }}>How it works</h2>
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {[
              {
                title: 'Pick your science track',
                body: 'Choose Physics, Chemistry, Biology, or Earth Science based on what you are studying. You can switch tracks any time.',
                icon: Atom,
                color: 'var(--brand)',
              },
              {
                title: 'Attend sessions with peers',
                body: 'Show up to labs, exam reviews, and study groups. Work through problems together and ask questions in real time.',
                icon: Calendar,
                color: 'var(--success)',
              },
              {
                title: 'Keep track of your work',
                body: 'Quiz scores, lab notes, and project files go into your portfolio automatically. Nothing gets lost between sessions.',
                icon: GraduationCap,
                color: 'var(--warning)',
              },
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl p-5 border transition-all duration-200 hover:-translate-y-1"
                  style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `color-mix(in srgb, ${card.color} 15%, transparent)` }}>
                    <Icon size={20} style={{ color: card.color }} />
                  </div>
                  <h3 className="font-semibold" style={{ color: 'var(--text)' }}>{card.title}</h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{card.body}</p>
                </div>
              );
            })}
          </div>
        </Reveal>
      </section>

      {/* ====== SCIENCE TRACKS ====== */}
      <section ref={tracksRef} className="max-w-7xl mx-auto px-4 lg:px-8 py-14">
        <Reveal delay={60}>
          <h2 className="text-2xl lg:text-3xl font-bold mb-2 font-[family-name:var(--font-display)]" style={{ color: 'var(--text)' }}>Science tracks</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Each track has structured lessons, live sessions, and a resource library.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Physics', icon: Atom, desc: 'Motion, forces, electricity, and modern physics.', topics: ['Kinematics', "Newton's Laws", 'Circuits', 'Waves'] },
              { name: 'Chemistry', icon: FlaskConical, desc: 'Reactions, bonding, equilibrium, and lab skills.', topics: ['Atomic Structure', 'Periodic Trends', 'Stoichiometry', 'Acid-Base'] },
              { name: 'Biology', icon: Leaf, desc: 'Cells, genetics, systems, and life processes.', topics: ['Cell Biology', 'DNA & Genetics', 'Ecology', 'Evolution'] },
              { name: 'Earth Science', icon: Mountain, desc: 'Climate, geology, oceans, and planetary systems.', topics: ['Plate Tectonics', 'Atmosphere', 'Oceans', 'Space Systems'] },
            ].map((track, idx) => {
              const Icon = track.icon;
              const parallaxY = prefersReducedMotion ? 0 : scrollY * (0.012 + idx * 0.003);
              return (
                <div
                  key={track.name}
                  className="rounded-2xl p-5 border transition-all duration-200"
                  style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', transform: `translateY(${parallaxY}px)` }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = `translateY(${parallaxY - 4}px)`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = `translateY(${parallaxY}px)`; }}
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: 'var(--brand-bg)' }}>
                    <Icon size={20} style={{ color: 'var(--brand)' }} />
                  </div>
                  <h3 className="font-semibold" style={{ color: 'var(--text)' }}>{track.name}</h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{track.desc}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {track.topics.map(t => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: 'var(--brand-bg)', color: 'var(--brand)' }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => scrollToSection('sessions')}
                    className="mt-3 text-sm font-medium inline-flex items-center gap-1"
                    style={{ color: 'var(--brand)' }}
                  >
                    View sessions <ChevronRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </Reveal>
      </section>

      {/* ====== LIVE SESSIONS ====== */}
      <section ref={sessionsRef} className="max-w-7xl mx-auto px-4 lg:px-8 py-14">
        <Reveal delay={60}>
          <h2 className="text-2xl lg:text-3xl font-bold mb-2 font-[family-name:var(--font-display)]" style={{ color: 'var(--text)' }}>Live sessions this week</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Sessions run daily. Sign up to reserve your spot and get reminders.</p>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[
              { subject: 'Physics', title: 'Free-body Diagrams Lab', time: '4:00 PM', day: 'Today', kind: 'Live lab', spots: 4 },
              { subject: 'Chemistry', title: 'Acid-Base Titration Review', time: '6:30 PM', day: 'Tomorrow', kind: 'Exam review', spots: 12 },
              { subject: 'Biology', title: 'Genetics Practice Sprint', time: '5:00 PM', day: 'Thursday', kind: 'Study group', spots: 8 },
              { subject: 'Earth Science', title: 'Plate Tectonics Workshop', time: '7:15 PM', day: 'Friday', kind: 'Live lab', spots: 15 },
            ].map((session, idx) => (
              <div
                key={idx}
                className="min-w-[260px] rounded-2xl p-4 border"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
              >
                <div className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--brand)' }}>{session.subject}</div>
                <div className="text-sm font-semibold mt-1" style={{ color: 'var(--text)' }}>{session.title}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{session.day} &middot; {session.time} &middot; {session.kind}</div>
                <div
                  className="text-xs mt-1 font-medium"
                  style={{ color: session.spots <= 5 ? 'var(--warning)' : 'var(--text-secondary)' }}
                >
                  {session.spots} spot{session.spots !== 1 ? 's' : ''} left
                </div>
                <button
                  onClick={onSignIn}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-medium"
                  style={{ color: 'var(--brand)' }}
                >
                  Sign up to reserve <ChevronRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ====== COMMUNITY ====== */}
      <section ref={communityRef} className="max-w-7xl mx-auto px-4 lg:px-8 py-14">
        <Reveal delay={60}>
          <h2 className="text-2xl lg:text-3xl font-bold mb-2 font-[family-name:var(--font-display)]" style={{ color: 'var(--text)' }}>Community</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Ask questions, share resources, and collaborate with students in the same tracks.</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold mb-3" style={{ color: 'var(--text)' }}>Active channels</h3>
              <div className="space-y-2 text-sm">
                {[
                  { name: 'Physics Homework Help', members: 84 },
                  { name: 'Chemistry Lab Reports', members: 61 },
                  { name: 'Study Buddy Finder', members: 120 },
                  { name: 'Biology Exam Prep', members: 47 },
                ].map((channel, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg p-2" style={{ backgroundColor: 'var(--bg)' }}>
                    <div>
                      <span style={{ color: 'var(--text)' }}># {channel.name}</span>
                      <span className="ml-2 text-xs" style={{ color: 'var(--text-secondary)' }}>{channel.members} members</span>
                    </div>
                    <button onClick={() => setShowCommunityOverlay(true)} className="text-xs font-medium" style={{ color: 'var(--brand)' }}>Join</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold mb-3" style={{ color: 'var(--text)' }}>Recent discussions</h3>
              <div className="space-y-3">
                {[
                  { channel: 'Physics Help', msg: "Does anyone have a worked example for tension in connected-object problems?", time: '12 min ago' },
                  { channel: 'Chemistry', msg: "Confused about Le Chatelier's principle — what actually shifts equilibrium left?", time: '34 min ago' },
                  { channel: 'Study Buddies', msg: 'Looking for a partner for the Thursday genetics session.', time: '1 hr ago' },
                ].map((post, idx) => (
                  <button
                    key={idx}
                    onClick={() => setShowCommunityOverlay(true)}
                    className="w-full text-left rounded-lg p-3 transition-colors"
                    style={{ backgroundColor: 'var(--bg)' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--brand-bg)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--bg)')}
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--brand)' }}>{post.channel}</div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text)' }}>{post.msg}</p>
                    <p className="text-[10px] mt-1" style={{ color: 'var(--text-secondary)' }}>{post.time}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ====== ABOUT ====== */}
      <section ref={aboutRef} className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <Reveal delay={0}>
          <div className="rounded-3xl border p-8 lg:p-12" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--brand)' }}>About ScienceSpire</div>
                <h2
                  className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-display)] mb-4"
                  style={{ color: 'var(--text)' }}
                >
                  Built by students who got tired of studying alone.
                </h2>
                <p className="text-sm lg:text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                  ScienceSpire started as a way to organize informal study groups for Physics and Chemistry. The idea was simple: most science content is already out there, but there was nowhere to bring students together around the same material at the same time.
                </p>
                <p className="text-sm lg:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Sessions are scheduled around real school calendars. Resources are written by students who have been through the same exams. Community channels stay focused on the four science tracks &mdash; no off-topic noise.
                </p>
                <button
                  onClick={() => onNavigate('about')}
                  className="mt-6 inline-flex items-center gap-2 font-medium px-5 py-2.5 rounded-xl text-sm min-h-[44px] border transition-all duration-200 hover:-translate-y-0.5"
                  style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                >
                  Read more about the project <ArrowRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Science tracks', value: '4', desc: 'Physics, Chemistry, Biology, Earth Science' },
                  { label: 'Weekly sessions', value: '20+', desc: 'Labs, reviews, and study groups' },
                  { label: 'Resource library', value: '150+', desc: 'Lessons, quizzes, and downloads' },
                  { label: 'Community channels', value: '12', desc: 'Focused on your subject areas' },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl p-4 border text-center"
                    style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border-light)' }}
                  >
                    <div className="text-3xl font-bold" style={{ color: 'var(--brand)' }}>{stat.value}</div>
                    <div className="text-sm font-semibold mt-1" style={{ color: 'var(--text)' }}>{stat.label}</div>
                    <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{stat.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h4 className="font-semibold mb-3" style={{ color: 'var(--text)' }}>Platform</h4>
            <div className="flex flex-col space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <button className="text-left hover:opacity-80 transition-opacity" onClick={() => scrollToSection('tracks')}>Science tracks</button>
              <button className="text-left hover:opacity-80 transition-opacity" onClick={() => scrollToSection('sessions')}>Live sessions</button>
              <button className="text-left hover:opacity-80 transition-opacity" onClick={() => scrollToSection('community')}>Community</button>
              <button className="text-left hover:opacity-80 transition-opacity" onClick={onSignIn}>Creator Studio</button>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3" style={{ color: 'var(--text)' }}>Learn</h4>
            <div className="flex flex-col space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <button className="text-left hover:opacity-80 transition-opacity" onClick={onSignIn}>Lessons</button>
              <button className="text-left hover:opacity-80 transition-opacity" onClick={onSignIn}>Resources</button>
              <button className="text-left hover:opacity-80 transition-opacity" onClick={onSignIn}>Schedule</button>
              <button className="text-left hover:opacity-80 transition-opacity" onClick={onSignIn}>Portfolio</button>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3" style={{ color: 'var(--text)' }}>About</h4>
            <div className="flex flex-col space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <button className="text-left hover:opacity-80 transition-opacity" onClick={() => onNavigate('about')}>Our story</button>
              <button className="text-left hover:opacity-80 transition-opacity" onClick={() => scrollToSection('about')}>The project</button>
              <button className="text-left hover:opacity-80 transition-opacity" onClick={() => onNavigate('about')}>Accessibility</button>
              <button className="text-left hover:opacity-80 transition-opacity" onClick={() => onNavigate('about')}>Privacy &amp; terms</button>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3" style={{ color: 'var(--text)' }}>Get started</h4>
            <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>Science sessions run every day. Join a track and show up.</p>
            <button
              onClick={onSignIn}
              className="inline-flex items-center gap-2 font-semibold px-4 py-2.5 rounded-xl text-sm min-h-[44px]"
              style={{ backgroundColor: 'var(--brand)', color: '#FFFFFF' }}
            >
              Create account <ArrowRight size={14} />
            </button>
          </div>
        </div>
        <div className="border-t" style={{ borderColor: 'var(--border)' }}>
          <div
            className="max-w-7xl mx-auto px-4 lg:px-8 py-4 text-sm flex flex-col sm:flex-row gap-2 justify-between"
            style={{ color: 'var(--text-secondary)' }}
          >
            <span>&copy; {new Date().getFullYear()} ScienceSpire</span>
            <span>Built by students, for students.</span>
          </div>
        </div>
      </footer>

      {/* Community sign-up overlay */}
      {showCommunityOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0" style={{ backgroundColor: 'var(--surface-overlay)' }} onClick={() => setShowCommunityOverlay(false)} />
          <div className="relative w-full max-w-md rounded-2xl border p-6 animate-scale-in" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--brand)' }}>
              <Users size={18} />
              <span className="font-semibold">Community access</span>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Sign up to join channels, post questions, and connect with students working through the same science material.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setShowCommunityOverlay(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border text-sm min-h-[44px]"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                Close
              </button>
              <button
                onClick={onSignIn}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold min-h-[44px]"
                style={{ backgroundColor: 'var(--brand)', color: '#FFFFFF' }}
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
