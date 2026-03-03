import 'animate.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight, Atom, FlaskConical, Leaf, Mountain, Menu, Moon, Sun,
  Calendar, Users, Beaker, ChevronRight, GraduationCap, X,
} from 'lucide-react';
import { useTheme } from '@/store/useThemeStore';

type SectionKey = 'tracks' | 'sessions' | 'community' | 'about';

// ─── Science stars data (desktop-only constellation sidebar) ───────────────
const SCIENCE_STARS = [
  // left column
  { id: 0,  side: 'left',  lx: '2.5%', top: '7%',  dur: 3.1, delay: 0.0,  term: 'Entropy',              desc: 'Measure of disorder in a system' },
  { id: 1,  side: 'left',  lx: '6.2%', top: '15%', dur: 2.7, delay: 0.8,  term: 'Photosynthesis',       desc: 'Light → chemical energy in plants' },
  { id: 2,  side: 'left',  lx: '1.8%', top: '24%', dur: 3.4, delay: 1.5,  term: "Newton's 1st Law",    desc: 'Objects in motion stay in motion' },
  { id: 3,  side: 'left',  lx: '5.0%', top: '33%', dur: 2.9, delay: 0.4,  term: 'Osmosis',              desc: 'Water moving through a membrane' },
  { id: 4,  side: 'left',  lx: '8.0%', top: '42%', dur: 3.6, delay: 1.1,  term: 'Isotope',              desc: 'Same element, different neutrons' },
  { id: 5,  side: 'left',  lx: '2.2%', top: '51%', dur: 2.8, delay: 0.6,  term: 'Mitosis',              desc: 'Cell division into two identical cells' },
  { id: 6,  side: 'left',  lx: '6.5%', top: '60%', dur: 3.2, delay: 1.8,  term: 'Inertia',              desc: 'Resistance to changes in motion' },
  { id: 7,  side: 'left',  lx: '3.5%', top: '69%', dur: 2.6, delay: 0.3,  term: 'Wavelength',           desc: 'Distance between successive crests' },
  { id: 8,  side: 'left',  lx: '7.2%', top: '78%', dur: 3.5, delay: 1.3,  term: 'Homeostasis',          desc: 'Maintaining internal balance' },
  { id: 9,  side: 'left',  lx: '1.5%', top: '87%', dur: 2.9, delay: 0.9,  term: 'Momentum',             desc: 'Mass × velocity of an object' },
  { id: 10, side: 'left',  lx: '4.5%', top: '93%', dur: 3.3, delay: 0.2,  term: 'Covalent Bond',        desc: 'Electrons shared between atoms' },
  // right column
  { id: 11, side: 'right', rx: '2.5%', top: '5%',  dur: 3.0, delay: 0.5,  term: 'Natural Selection',    desc: 'Survival of the fittest' },
  { id: 12, side: 'right', rx: '6.0%', top: '13%', dur: 2.7, delay: 1.2,  term: 'Electromagnetic Wave', desc: 'Oscillating electric + magnetic fields' },
  { id: 13, side: 'right', rx: '2.0%', top: '22%', dur: 3.5, delay: 0.7,  term: 'Electronegativity',    desc: "Atom's pull on shared electrons" },
  { id: 14, side: 'right', rx: '7.0%', top: '31%', dur: 2.8, delay: 1.6,  term: 'Tectonic Plate',       desc: "Moving segment of Earth's crust" },
  { id: 15, side: 'right', rx: '3.5%', top: '40%', dur: 3.2, delay: 0.1,  term: 'Conservation of Energy', desc: 'Energy is never created or destroyed' },
  { id: 16, side: 'right', rx: '7.5%', top: '49%', dur: 2.9, delay: 1.0,  term: 'Meiosis',              desc: 'Cell division producing gametes' },
  { id: 17, side: 'right', rx: '2.8%', top: '58%', dur: 3.4, delay: 0.4,  term: 'Acid-Base Reaction',   desc: 'Proton transfer between molecules' },
  { id: 18, side: 'right', rx: '5.5%', top: '67%', dur: 2.6, delay: 1.9,  term: 'Seismic Wave',         desc: 'Energy wave through the Earth' },
  { id: 19, side: 'right', rx: '1.8%', top: '76%', dur: 3.1, delay: 0.6,  term: 'Ecosystem',            desc: 'Organisms + their environment' },
  { id: 20, side: 'right', rx: '6.5%', top: '84%', dur: 2.8, delay: 1.4,  term: 'Radioactive Decay',    desc: 'Unstable nucleus emitting particles' },
  { id: 21, side: 'right', rx: '3.2%', top: '91%', dur: 3.3, delay: 0.9,  term: 'Oxidation',            desc: 'Loss of electrons in a reaction' },
];

// ─── Scroll-reveal with animate.css ────────────────────────────────────────
function Reveal({
  children,
  delay = 0,
  animation = 'animate__fadeInUp',
}: {
  children: React.ReactNode;
  delay?: number;
  animation?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={visible ? `animate__animated ${animation}` : 'opacity-0'}
      style={visible ? { animationDelay: `${delay}ms`, animationDuration: '0.65s' } : {}}
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
      {/* ====== SCIENCE STARS (2xl+ monitors only) ====== */}
      <div className="hidden 2xl:block fixed inset-0 pointer-events-none z-10" aria-hidden="true">
        {SCIENCE_STARS.map(star => (
          <div
            key={star.id}
            className="absolute group pointer-events-auto"
            style={{
              ...(star.side === 'left' ? { left: (star as { lx: string }).lx } : { right: (star as { rx: string }).rx }),
              top: star.top,
            }}
          >
            {/* The star dot */}
            <div
              className="star-twinkle w-2 h-2 rounded-full cursor-default"
              style={{
                backgroundColor: '#ffffff',
                '--twinkle-dur': `${star.dur}s`,
                '--twinkle-delay': `${star.delay}s`,
              } as React.CSSProperties}
            />
            {/* Tooltip */}
            <div
              className={`
                absolute z-50 pointer-events-none
                invisible opacity-0 group-hover:visible group-hover:opacity-100
                transition-all duration-200
                px-3 py-2 rounded-xl shadow-2xl border text-left whitespace-nowrap
                ${star.side === 'left' ? 'left-5' : 'right-5'}
              `}
              style={{
                top: '-4px',
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
                transform: 'translateY(-50%)',
                minWidth: '160px',
              }}
            >
              <div className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{star.term}</div>
              <div className="text-[10px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{star.desc}</div>
            </div>
          </div>
        ))}
      </div>

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
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 min-h-[44px] animate__animated animate__fadeInLeft"
            style={{ animationDuration: '0.5s' }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--brand)' }}>
              <Beaker size={18} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-bold" style={{ color: 'var(--text)' }}>ScienceSpire</div>
              <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Student science hub</div>
            </div>
          </button>

          <nav
            className="hidden lg:flex items-center gap-5 text-sm animate__animated animate__fadeInDown"
            style={{ animationDuration: '0.5s', color: 'var(--text-secondary)' }}
          >
            <button onClick={() => scrollToSection('tracks')} className="hover:opacity-80 transition-opacity min-h-[44px]">Science tracks</button>
            <button onClick={() => scrollToSection('sessions')} className="hover:opacity-80 transition-opacity min-h-[44px]">Live sessions</button>
            <button onClick={() => scrollToSection('community')} className="hover:opacity-80 transition-opacity min-h-[44px]">Community</button>
            <button onClick={() => scrollToSection('about')} className="hover:opacity-80 transition-opacity min-h-[44px]">About</button>
          </nav>

          <div
            className="flex items-center gap-2 animate__animated animate__fadeInRight"
            style={{ animationDuration: '0.5s' }}
          >
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
        style={{ backgroundColor: 'var(--bg)' }}
      >
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div>
            {/* Badge */}
            <div
              className="animate__animated animate__bounceInDown inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5"
              style={{ animationDuration: '0.7s', backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}
            >
              Physics &middot; Chemistry &middot; Biology &middot; Earth Science
            </div>

            {/* H1 */}
            <h1
              className="animate__animated animate__fadeInUp text-3xl lg:text-5xl font-bold leading-tight font-[family-name:var(--font-display)]"
              style={{ animationDelay: '0.15s', animationDuration: '0.7s', color: 'var(--text)' }}
            >
              Learn science alongside students working through the same material.
            </h1>

            {/* Subtitle */}
            <p
              className="animate__animated animate__fadeInUp mt-4 text-base lg:text-lg max-w-xl"
              style={{ animationDelay: '0.3s', animationDuration: '0.7s', color: 'var(--text-secondary)' }}
            >
              Join study groups, work through real lab problems, and keep a portfolio of your science work &mdash; all built and run by students.
            </p>

            {/* Rotating headline */}
            <div
              className="animate__animated animate__bounceIn mt-5 min-h-[36px]"
              style={{ animationDelay: '0.55s', animationDuration: '0.8s' }}
            >
              <p key={headlineIndex} className="text-lg font-semibold animate-fade-in" style={{ color: 'var(--brand)' }}>
                {headlineItems[headlineIndex]}
              </p>
            </div>

            {/* CTA buttons */}
            <div
              className="animate__animated animate__fadeInUp mt-7 flex flex-wrap gap-3"
              style={{ animationDelay: '0.45s', animationDuration: '0.6s' }}
            >
              <button
                onClick={onSignIn}
                className="inline-flex items-center gap-2 font-semibold px-6 py-3.5 rounded-xl text-sm min-h-[48px] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                style={{ backgroundColor: 'var(--brand)', color: '#FFFFFF' }}
              >
                Create an account <ArrowRight size={16} />
              </button>
              <button
                onClick={() => scrollToSection('sessions')}
                className="inline-flex items-center gap-2 font-medium px-6 py-3.5 rounded-xl text-sm border min-h-[48px] hover:-translate-y-0.5 transition-all duration-200"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                Browse sessions
              </button>
              <button
                onClick={() => scrollToSection('tracks')}
                className="inline-flex items-center gap-2 font-medium px-6 py-3.5 rounded-xl text-sm border min-h-[48px] hover:-translate-y-0.5 transition-all duration-200"
                style={{ borderColor: 'var(--brand)', color: 'var(--brand)' }}
              >
                Explore tracks
              </button>
            </div>
          </div>

          {/* Sessions preview card */}
          <div
            className="animate__animated animate__fadeInRight relative"
            style={{ animationDelay: '0.25s', animationDuration: '0.75s', transform: parallax(0.04) }}
          >
            <div
              className="rounded-3xl border p-6 lg:p-8 shadow-xl"
              style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>Upcoming sessions</h3>
              <div className="space-y-3">
                {[
                  { t: 'Physics: Free-body Diagrams Lab', time: 'Today', kind: 'Live lab' },
                  { t: 'Chemistry: Acid-Base Titration Review', time: 'Tomorrow', kind: 'Exam review' },
                  { t: 'Biology: Cell Signaling Q&A', time: 'Thursday', kind: 'Study group' },
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
        <Reveal animation="animate__fadeInUp">
          <h2 className="text-2xl lg:text-3xl font-bold text-center font-[family-name:var(--font-display)]" style={{ color: 'var(--text)' }}>How it works</h2>
        </Reveal>
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {[
            {
              title: 'Pick your science track',
              body: 'Choose Physics, Chemistry, Biology, or Earth Science based on what you are studying. Switch tracks any time.',
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
              <Reveal key={idx} delay={idx * 120} animation="animate__bounceIn">
                <div
                  className="rounded-2xl p-5 border h-full transition-all duration-200 hover:-translate-y-1"
                  style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: 'var(--brand-bg)' }}>
                    <Icon size={20} style={{ color: card.color }} />
                  </div>
                  <h3 className="font-semibold" style={{ color: 'var(--text)' }}>{card.title}</h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{card.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ====== SCIENCE TRACKS ====== */}
      <section ref={tracksRef} className="max-w-7xl mx-auto px-4 lg:px-8 py-14">
        <Reveal animation="animate__fadeInUp">
          <h2 className="text-2xl lg:text-3xl font-bold mb-2 font-[family-name:var(--font-display)]" style={{ color: 'var(--text)' }}>Science tracks</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Each track has structured lessons, live sessions, and a resource library.</p>
        </Reveal>
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
              <Reveal key={track.name} delay={idx * 100} animation="animate__zoomIn">
                <div
                  className="rounded-2xl p-5 border transition-all duration-200 h-full"
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
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: 'var(--brand-bg)', color: 'var(--brand)' }}>{t}</span>
                    ))}
                  </div>
                  <button onClick={() => scrollToSection('sessions')} className="mt-3 text-sm font-medium inline-flex items-center gap-1" style={{ color: 'var(--brand)' }}>
                    View sessions <ChevronRight size={14} />
                  </button>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ====== LIVE SESSIONS ====== */}
      <section ref={sessionsRef} className="max-w-7xl mx-auto px-4 lg:px-8 py-14">
        <Reveal animation="animate__fadeInUp">
          <h2 className="text-2xl lg:text-3xl font-bold mb-2 font-[family-name:var(--font-display)]" style={{ color: 'var(--text)' }}>Live sessions this week</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Sessions run daily. Sign up to reserve your spot and get reminders.</p>
        </Reveal>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[
            { subject: 'Physics', title: 'Free-body Diagrams Lab', time: '4:00 PM', day: 'Today', kind: 'Live lab', spots: 4 },
            { subject: 'Chemistry', title: 'Acid-Base Titration Review', time: '6:30 PM', day: 'Tomorrow', kind: 'Exam review', spots: 12 },
            { subject: 'Biology', title: 'Genetics Practice Sprint', time: '5:00 PM', day: 'Thursday', kind: 'Study group', spots: 8 },
            { subject: 'Earth Science', title: 'Plate Tectonics Workshop', time: '7:15 PM', day: 'Friday', kind: 'Live lab', spots: 15 },
          ].map((session, idx) => (
            <Reveal key={idx} delay={idx * 80} animation="animate__fadeInUp">
              <div
                className="min-w-[260px] rounded-2xl p-4 border"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
              >
                <div className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--brand)' }}>{session.subject}</div>
                <div className="text-sm font-semibold mt-1" style={{ color: 'var(--text)' }}>{session.title}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{session.day} &middot; {session.time} &middot; {session.kind}</div>
                <div className="text-xs mt-1 font-medium" style={{ color: session.spots <= 5 ? 'var(--warning)' : 'var(--text-secondary)' }}>
                  {session.spots} spot{session.spots !== 1 ? 's' : ''} left
                </div>
                <button onClick={onSignIn} className="mt-3 inline-flex items-center gap-1 text-xs font-medium" style={{ color: 'var(--brand)' }}>
                  Sign up to reserve <ChevronRight size={12} />
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ====== COMMUNITY ====== */}
      <section ref={communityRef} className="max-w-7xl mx-auto px-4 lg:px-8 py-14">
        <Reveal animation="animate__fadeInUp">
          <h2 className="text-2xl lg:text-3xl font-bold mb-2 font-[family-name:var(--font-display)]" style={{ color: 'var(--text)' }}>Community</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Ask questions, share resources, and collaborate with students in the same tracks.</p>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-4">
          <Reveal animation="animate__fadeInLeft">
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
          </Reveal>

          <Reveal delay={100} animation="animate__fadeInRight">
            <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold mb-3" style={{ color: 'var(--text)' }}>Recent discussions</h3>
              <div className="space-y-3">
                {[
                  { channel: 'Physics Help', msg: "Does anyone have a worked example for tension in connected-object problems?", time: '12 min ago' },
                  { channel: 'Chemistry', msg: "Confused about Le Chatelier's principle — what shifts equilibrium left?", time: '34 min ago' },
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
          </Reveal>
        </div>
      </section>

      {/* ====== ABOUT ====== */}
      <section ref={aboutRef} className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <Reveal animation="animate__fadeInUp">
          <div className="rounded-3xl border p-8 lg:p-12" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--brand)' }}>About ScienceSpire</div>
                <h2 className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-display)] mb-4" style={{ color: 'var(--text)' }}>
                  Built by students who got tired of studying alone.
                </h2>
                <p className="text-sm lg:text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                  ScienceSpire started as a way to organize informal study groups for Physics and Chemistry. The idea was simple: most science content is already out there, but there was nowhere to bring students together around the same material at the same time.
                </p>
                <p className="text-sm lg:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Sessions are scheduled around real school calendars. Resources are written by students who have been through the same exams. Community channels stay focused on the four science tracks.
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
                  <Reveal key={idx} delay={idx * 80} animation="animate__bounceIn">
                    <div className="rounded-2xl p-4 border text-center" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border-light)' }}>
                      <div className="text-3xl font-bold" style={{ color: 'var(--brand)' }}>{stat.value}</div>
                      <div className="text-sm font-semibold mt-1" style={{ color: 'var(--text)' }}>{stat.label}</div>
                      <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{stat.desc}</div>
                    </div>
                  </Reveal>
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
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 text-sm flex flex-col sm:flex-row gap-2 justify-between" style={{ color: 'var(--text-secondary)' }}>
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
