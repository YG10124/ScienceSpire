import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight, Atom, FlaskConical, Leaf, Mountain, Menu, Moon, Sun,
  Calendar, Users, Beaker, ChevronRight, MessageSquare, Rocket, Sparkles,
} from 'lucide-react';
import { useTheme } from '@/store/useThemeStore';

type SectionKey = 'tracks' | 'sessions' | 'community' | 'about';

function Reveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0px)' : 'translateY(12px)',
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
  };

  const parallax = (factor: number) => (prefersReducedMotion ? 'translateY(0px)' : `translateY(${scrollY * factor}px)`);
  const compactHeader = scrollY > 24;

  return (
    <div className="space-y-0">
      <header
        className="sticky top-0 z-40 border-b transition-all duration-200"
        style={{
          backdropFilter: compactHeader ? 'blur(14px)' : 'blur(0px)',
          WebkitBackdropFilter: compactHeader ? 'blur(14px)' : 'blur(0px)',
          backgroundColor: compactHeader ? 'var(--sidebar-bg)' : 'transparent',
          borderColor: compactHeader ? 'var(--border)' : 'transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between" style={{ height: compactHeader ? 60 : 74 }}>
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 min-h-[44px]">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--brand)' }}><Beaker size={18} className="text-white" /></div>
            <div>
              <div className="text-sm font-bold" style={{ color: 'var(--text)' }}>Student Science Lab</div>
              <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Built by students</div>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-5 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <button onClick={() => scrollToSection('tracks')} className="hover:opacity-80 transition-opacity">Science tracks</button>
            <button onClick={() => scrollToSection('sessions')} className="hover:opacity-80 transition-opacity">Live sessions</button>
            <button onClick={() => scrollToSection('community')} className="hover:opacity-80 transition-opacity">Community</button>
            <button onClick={() => scrollToSection('about')} className="hover:opacity-80 transition-opacity">About</button>
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-lg min-h-[40px] min-w-[40px]" style={{ color: 'var(--text-secondary)' }} aria-label="Toggle theme">
              {themeMode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button onClick={onSignIn} className="px-4 py-2.5 rounded-xl text-sm font-medium border min-h-[44px]" style={{ color: 'var(--text)', borderColor: 'var(--border)' }}>Sign in</button>
            <button onClick={onSignIn} className="px-4 py-2.5 rounded-xl text-sm font-semibold min-h-[44px]" style={{ backgroundColor: 'var(--brand)', color: '#FFFFFF' }}>Sign up</button>
            <button className="lg:hidden p-2 rounded-lg" style={{ color: 'var(--text-secondary)' }} aria-label="Menu"><Menu size={20} /></button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden min-h-[78vh] px-4 lg:px-8 py-14 lg:py-20" style={{ background: 'linear-gradient(160deg, var(--card) 0%, var(--bg) 55%, var(--card-alt) 100%)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 -left-20 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.20), transparent 65%)', transform: parallax(0.12) }} />
          <div className="absolute -bottom-24 right-0 w-[28rem] h-[28rem] rounded-full" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.18), transparent 65%)', transform: parallax(0.08) }} />
          <div className="absolute top-24 right-16 text-4xl" style={{ transform: parallax(0.2), opacity: 0.24 }}>?</div>
          <div className="absolute top-40 left-1/4 text-3xl" style={{ transform: parallax(0.16), opacity: 0.2 }}>??</div>
          <div className="absolute bottom-24 left-20 text-4xl" style={{ transform: parallax(0.1), opacity: 0.22 }}>??</div>
        </div>

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}>
              <Sparkles size={14} /> Student science hub for Physics, Chemistry, Biology, and Earth Science
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold leading-tight font-[family-name:var(--font-display)]" style={{ color: 'var(--text)' }}>
              Learn science faster with live sessions, peer support, and practical resources.
            </h1>
            <p className="mt-4 text-base lg:text-lg max-w-xl" style={{ color: 'var(--text-secondary)' }}>
              Student-built science sessions, interactive resources, and live study groups designed to make complex topics click.
            </p>

            <div className="mt-5 min-h-[36px]">
              <p key={headlineIndex} className="text-lg font-semibold animate-fade-in" style={{ color: 'var(--brand)' }}>
                {headlineItems[headlineIndex]}
              </p>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={onSignIn} className="inline-flex items-center gap-2 font-semibold px-6 py-3.5 rounded-xl text-sm min-h-[48px] shadow-lg hover:shadow-xl transition-all duration-200" style={{ backgroundColor: 'var(--brand)', color: '#FFFFFF' }}>
                Start your science journey <ArrowRight size={16} />
              </button>
              <button onClick={() => scrollToSection('sessions')} className="inline-flex items-center gap-2 font-medium px-6 py-3.5 rounded-xl text-sm border min-h-[48px] transition-all duration-200" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
                Preview science sessions
              </button>
              <button onClick={() => scrollToSection('tracks')} className="inline-flex items-center gap-2 font-medium px-6 py-3.5 rounded-xl text-sm border min-h-[48px] transition-all duration-200" style={{ borderColor: 'var(--brand)', color: 'var(--brand)' }}>
                Explore science courses
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border p-6 lg:p-8 shadow-xl" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', transform: parallax(0.06) }}>
              <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>Upcoming science sessions</h3>
              <div className="space-y-3">
                {[
                  { t: 'Physics: Free-body Diagrams Lab', time: 'Today � 4:00 PM', kind: 'Live lab' },
                  { t: 'Chemistry: Acid-Base Titration Review', time: 'Tomorrow � 6:30 PM', kind: 'Exam review' },
                  { t: 'Biology: Cell Signaling Q&A', time: 'Thu � 5:00 PM', kind: 'Study group' },
                ].map((item, idx) => (
                  <div key={idx} className="rounded-xl p-3 border" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border-light)' }}>
                    <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{item.t}</div>
                    <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{item.time} � {item.kind}</div>
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

      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-14">
        <Reveal>
          <h2 className="text-2xl lg:text-3xl font-bold text-center font-[family-name:var(--font-display)]" style={{ color: 'var(--text)' }}>How it works</h2>
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {[
              { title: 'Pick your science track', body: 'Choose Physics, Chemistry, Biology, or Earth Science based on your goals.', icon: Atom, color: 'var(--brand)' },
              { title: 'Join live sessions and groups', body: 'Attend labs, exam reviews, and group study blocks with peers.', icon: Calendar, color: 'var(--success)' },
              { title: 'Build your experiment portfolio', body: 'Save notes, quiz results, and project artifacts as you learn.', icon: Rocket, color: 'var(--warning)' },
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div key={idx} className="rounded-2xl p-5 border transition-all duration-200 hover:-translate-y-1" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${card.color}22` }}><Icon size={20} style={{ color: card.color }} /></div>
                  <h3 className="font-semibold" style={{ color: 'var(--text)' }}>{card.title}</h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{card.body}</p>
                </div>
              );
            })}
          </div>
        </Reveal>
      </section>

      <section ref={tracksRef} className="max-w-7xl mx-auto px-4 lg:px-8 py-14">
        <Reveal>
          <h2 className="text-2xl lg:text-3xl font-bold mb-6 font-[family-name:var(--font-display)]" style={{ color: 'var(--text)' }}>Science tracks</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Physics', icon: Atom, desc: 'Motion, forces, electricity, and modern physics.' },
              { name: 'Chemistry', icon: FlaskConical, desc: 'Reactions, bonding, equilibrium, and lab skills.' },
              { name: 'Biology', icon: Leaf, desc: 'Cells, genetics, systems, and life processes.' },
              { name: 'Earth Science', icon: Mountain, desc: 'Climate, geology, oceans, and planetary systems.' },
            ].map((track, idx) => {
              const Icon = track.icon;
              return (
                <div key={track.name} className="rounded-2xl p-5 border transition-all duration-200 hover:-translate-y-1" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', transform: prefersReducedMotion ? 'none' : `translateY(${scrollY * (0.012 + idx * 0.003)}px)` }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: 'var(--brand-bg)' }}><Icon size={20} style={{ color: 'var(--brand)' }} /></div>
                  <h3 className="font-semibold" style={{ color: 'var(--text)' }}>{track.name}</h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{track.desc}</p>
                  <button onClick={() => scrollToSection('sessions')} className="mt-3 text-sm font-medium inline-flex items-center gap-1" style={{ color: 'var(--brand)' }}>
                    View sample sessions <ChevronRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </Reveal>
      </section>

      <section ref={sessionsRef} className="max-w-7xl mx-auto px-4 lg:px-8 py-14">
        <Reveal>
          <h2 className="text-2xl lg:text-3xl font-bold mb-6 font-[family-name:var(--font-display)]" style={{ color: 'var(--text)' }}>Live sessions preview</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[
              { subject: 'Physics', title: 'Free-body Diagrams Lab', time: '4:00 PM', kind: 'Live lab' },
              { subject: 'Chemistry', title: 'Acid-Base Titration Review', time: '6:30 PM', kind: 'Exam review' },
              { subject: 'Biology', title: 'Genetics Practice Sprint', time: '5:00 PM', kind: 'Study group' },
              { subject: 'Earth Science', title: 'Plate Tectonics Workshop', time: '7:15 PM', kind: 'Live lab' },
            ].map((session, idx) => (
              <div key={idx} className="min-w-[260px] rounded-2xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--brand)' }}>{session.subject}</div>
                <div className="text-sm font-semibold mt-1" style={{ color: 'var(--text)' }}>{session.title}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{session.time} � {session.kind}</div>
                <button onClick={onSignIn} className="mt-3 inline-flex items-center gap-1 text-xs font-medium" style={{ color: 'var(--brand)' }}>
                  Sign up to reserve <ChevronRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section ref={communityRef} className="max-w-7xl mx-auto px-4 lg:px-8 py-14">
        <Reveal>
          <h2 className="text-2xl lg:text-3xl font-bold mb-6 font-[family-name:var(--font-display)]" style={{ color: 'var(--text)' }}>Community preview</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold mb-3" style={{ color: 'var(--text)' }}>Sample channels</h3>
              <div className="space-y-2 text-sm">
                {['Physics Homework Help', 'Chemistry Lab Reports', 'Study Buddy Finder', 'Biology Exam Prep'].map((channel, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg p-2" style={{ backgroundColor: 'var(--bg)' }}>
                    <span style={{ color: 'var(--text)' }}># {channel}</span>
                    <button onClick={() => setShowCommunityOverlay(true)} className="text-xs font-medium" style={{ color: 'var(--brand)' }}>View channel</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold mb-3" style={{ color: 'var(--text)' }}>Why students love this</h3>
              <div className="space-y-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--bg)' }}>
                  <p style={{ color: 'var(--text)' }}>"The live problem-solving sessions helped me pass physics."</p>
                  <p className="text-xs mt-1">Ari, Grade 11</p>
                </div>
                <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--bg)' }}>
                  <p style={{ color: 'var(--text)' }}>"Biology discussions are active every day."</p>
                  <p className="text-xs mt-1">Nina, Grade 10</p>
                </div>
                <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--bg)' }}>
                  <p style={{ color: 'var(--text)' }}>120 students discussing genetics this week.</p>
                  <button onClick={() => setShowCommunityOverlay(true)} className="mt-1 text-xs font-medium" style={{ color: 'var(--brand)' }}>Join group</button>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <footer ref={aboutRef} className="mt-10 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h4 className="font-semibold mb-2" style={{ color: 'var(--text)' }}>Product</h4>
            <div className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <button onClick={() => scrollToSection('tracks')}>Science tracks</button>
              <div>Live sessions</div>
              <div>Community</div>
              <div>Creator Studio</div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2" style={{ color: 'var(--text)' }}>Resources</h4>
            <div className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <div>Help center</div>
              <div>Accessibility</div>
              <div>Contact</div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2" style={{ color: 'var(--text)' }}>About</h4>
            <div className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <div>Our story</div>
              <div>For schools</div>
              <div>Privacy & terms</div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2" style={{ color: 'var(--text)' }}>Get started</h4>
            <button onClick={onSignIn} className="inline-flex items-center gap-2 font-semibold px-4 py-2.5 rounded-xl text-sm min-h-[44px]" style={{ backgroundColor: 'var(--brand)', color: '#FFFFFF' }}>
              Sign up <ArrowRight size={14} />
            </button>
          </div>
        </div>
        <div className="border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 text-sm flex flex-col sm:flex-row gap-2 justify-between" style={{ color: 'var(--text-secondary)' }}>
            <span>� {new Date().getFullYear()} Student Science Lab</span>
            <span>Built by students, for students.</span>
          </div>
        </div>
      </footer>

      {showCommunityOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0" style={{ backgroundColor: 'var(--surface-overlay)' }} onClick={() => setShowCommunityOverlay(false)} />
          <div className="relative w-full max-w-md rounded-2xl border p-6 animate-scale-in" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--brand)' }}><Users size={18} /><span className="font-semibold">Community access</span></div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Once you sign up, you can join channels like this, ask questions, and co-work with other science students.
            </p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setShowCommunityOverlay(false)} className="flex-1 px-4 py-2.5 rounded-xl border text-sm" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>Close</button>
              <button onClick={onSignIn} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'var(--brand)', color: '#FFFFFF' }}>Sign up</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
