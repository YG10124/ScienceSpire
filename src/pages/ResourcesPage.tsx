import { useEffect, useMemo, useState } from 'react';
import {
  Search, Filter, X, Play, FileText, Zap, Layers,
  Clock, Star, User, ChevronRight, Heart,
  Share2, Bookmark, Grid, List, CheckCircle2
} from 'lucide-react';
import { useLocalStore } from '@/store/useLocalStore';
import type { BreadcrumbItem } from '@/config/site';

interface ResourcesPageProps {
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onBreadcrumbChange?: (items: BreadcrumbItem[]) => void;
}

type QuizQuestion = {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type ResourceItem = {
  id: number;
  title: string;
  type: 'video' | 'quiz' | 'pdf' | 'interactive';
  subject: 'Physics' | 'Chemistry' | 'Biology' | 'Earth Science';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  duration: string;
  rating: number;
  ratingCount: number;
  uses: number;
  creator: string;
  description: string;
  savedCount: number;
  hasQuiz: boolean;
  fileSize?: string;
  comments: { author: string; initials: string; time: string; text: string }[];
  related: string[];
  quiz?: QuizQuestion[];
};

const typeConfig = {
  video: { icon: Play, color: 'var(--brand)', label: 'Video' },
  quiz: { icon: Zap, color: 'var(--success)', label: 'Quiz' },
  pdf: { icon: FileText, color: 'var(--warning)', label: 'PDF' },
  interactive: { icon: Layers, color: 'var(--info)', label: 'Interactive' },
} as const;

const resources: ResourceItem[] = [
  {
    id: 1,
    title: 'Quantum Mechanics: Wave-Particle Duality',
    type: 'video',
    subject: 'Physics',
    difficulty: 'Intermediate',
    duration: '24 min',
    rating: 4.8,
    ratingCount: 124,
    uses: 892,
    creator: 'Dr. Sarah Chen',
    description: 'A visual walkthrough of double-slit experiments and modern interpretations.',
    savedCount: 56,
    hasQuiz: true,
    comments: [
      { author: 'Maria L.', initials: 'ML', time: '2 days ago', text: 'The analogy at 12:40 finally made this click for me.' },
      { author: 'Alex T.', initials: 'AT', time: '1 day ago', text: 'Could use one more example on uncertainty principle.' },
    ],
    related: ['Interference patterns', 'Photoelectric effect', 'Schrodinger equation'],
    quiz: [
      { prompt: 'Wave-particle duality means particles...', options: ['Have only wave behavior', 'Show both wave and particle behavior', 'Have no measurable position', 'Move faster than light'], correctIndex: 1, explanation: 'Quantum entities can exhibit both wave-like and particle-like properties.' },
      { prompt: 'In the double-slit experiment, an interference pattern suggests...', options: ['Classical projectile motion', 'Wave-like superposition', 'Pure randomness', 'No observable behavior'], correctIndex: 1, explanation: 'Interference is a hallmark of wave superposition.' },
    ],
  },
  {
    id: 2,
    title: 'Chemistry Lab Safety Drill Quiz',
    type: 'quiz',
    subject: 'Chemistry',
    difficulty: 'Beginner',
    duration: '12 min',
    rating: 4.7,
    ratingCount: 112,
    uses: 734,
    creator: 'Prof. James Park',
    description: 'Test your core lab safety reflexes and hazard-response steps.',
    savedCount: 44,
    hasQuiz: true,
    comments: [
      { author: 'Priya M.', initials: 'PM', time: '3 days ago', text: 'Useful before practical exams.' },
      { author: 'Jamie R.', initials: 'JR', time: '1 day ago', text: 'Question 4 explanation was really clear.' },
    ],
    related: ['PPE checklist', 'Chemical waste disposal', 'Emergency shower protocol'],
    quiz: [
      { prompt: 'First action after a chemical splash to eyes is...', options: ['Notify peers only', 'Rub eyes gently', 'Use eyewash station immediately', 'Wait for instructor'], correctIndex: 2, explanation: 'Immediate flushing at an eyewash station is critical.' },
      { prompt: 'Best PPE for routine wet chemistry lab includes...', options: ['Sandals and gloves', 'Lab coat, goggles, closed shoes', 'Only gloves', 'Only goggles'], correctIndex: 1, explanation: 'Standard PPE is lab coat, eye protection, and closed-toe shoes.' },
    ],
  },
  {
    id: 3,
    title: 'Cell Division Notes: Mitosis vs Meiosis',
    type: 'pdf',
    subject: 'Biology',
    difficulty: 'All Levels',
    duration: '15 min read',
    rating: 4.6,
    ratingCount: 83,
    uses: 511,
    creator: 'Dr. Simone Rivers',
    description: 'Side-by-side comparison charts, checkpoints, and memory cues.',
    savedCount: 77,
    hasQuiz: true,
    fileSize: '2.1 MB',
    comments: [
      { author: 'Sam K.', initials: 'SK', time: '5 hours ago', text: 'The chromosome count table is gold.' },
      { author: 'Lena W.', initials: 'LW', time: '1 day ago', text: 'Would love printable flashcards from this.' },
    ],
    related: ['DNA replication timing', 'Gamete formation', 'Chromosome segregation'],
    quiz: [
      { prompt: 'Mitosis results in...', options: ['4 non-identical cells', '2 identical daughter cells', '2 haploid cells', 'Only gametes'], correctIndex: 1, explanation: 'Mitosis yields two genetically identical daughter cells.' },
      { prompt: 'Meiosis is primarily for...', options: ['Tissue repair', 'Asexual cloning', 'Gamete production', 'Protein synthesis'], correctIndex: 2, explanation: 'Meiosis creates gametes for sexual reproduction.' },
    ],
  },
  {
    id: 4,
    title: 'Plate Tectonics Interactive Explorer',
    type: 'interactive',
    subject: 'Earth Science',
    difficulty: 'Intermediate',
    duration: '20 min',
    rating: 4.9,
    ratingCount: 156,
    uses: 1203,
    creator: 'Ms. Elena Romero',
    description: 'Explore boundaries, seismic patterns, and volcanic belts in a guided map.',
    savedCount: 112,
    hasQuiz: true,
    comments: [
      { author: 'Taylor N.', initials: 'TN', time: '2 days ago', text: 'Boundary overlays are super intuitive.' },
      { author: 'Chris K.', initials: 'CK', time: '4 hours ago', text: 'Can we get a layer for historical quake magnitudes?' },
    ],
    related: ['Convergent boundaries', 'Subduction zones', 'Seismic hazard maps'],
    quiz: [
      { prompt: 'Most deep-focus earthquakes occur near...', options: ['Mid-ocean ridges', 'Subduction zones', 'Transform faults only', 'Stable cratons'], correctIndex: 1, explanation: 'Deep-focus quakes are commonly associated with descending slabs at subduction zones.' },
      { prompt: 'Divergent plate boundaries are associated with...', options: ['Mountain collision belts', 'Ocean trench collapse', 'Seafloor spreading', 'No volcanism'], correctIndex: 2, explanation: 'Divergent boundaries create new crust by seafloor spreading.' },
    ],
  },
  {
    id: 5,
    title: 'Electromagnetism Formula Sheet',
    type: 'pdf',
    subject: 'Physics',
    difficulty: 'All Levels',
    duration: '6 min read',
    rating: 4.5,
    ratingCount: 201,
    uses: 1567,
    creator: 'Alex M. (Student)',
    description: 'Core EM formulas grouped by topic with unit checks.',
    savedCount: 189,
    hasQuiz: true,
    fileSize: '1.1 MB',
    comments: [
      { author: 'Kim P.', initials: 'KP', time: '3 days ago', text: 'Exactly what I needed before mock exam.' },
      { author: 'Jordan R.', initials: 'JR', time: '7 hours ago', text: 'Please add magnetic flux examples.' },
    ],
    related: ['Coulomb law', 'Magnetic field strength', 'Faraday law'],
    quiz: [
      { prompt: 'Electric field units are...', options: ['N/C', 'J/s', 'kg m/s', 'Wb/m2'], correctIndex: 0, explanation: 'Electric field is measured in newtons per coulomb.' },
      { prompt: 'Faraday law links changing magnetic flux to...', options: ['Resistance', 'Induced emf', 'Mass density', 'Current capacity only'], correctIndex: 1, explanation: 'A changing magnetic flux induces an emf.' },
    ],
  },
  {
    id: 6,
    title: 'Molecular Bonding Concepts',
    type: 'video',
    subject: 'Chemistry',
    difficulty: 'Beginner',
    duration: '18 min',
    rating: 4.7,
    ratingCount: 93,
    uses: 678,
    creator: 'Prof. Marcus Lee',
    description: 'Covalent, ionic, and metallic bonding explained with visuals.',
    savedCount: 45,
    hasQuiz: true,
    comments: [
      { author: 'Nina B.', initials: 'NB', time: '1 day ago', text: 'The valence shell section was very clear.' },
      { author: 'Ari V.', initials: 'AV', time: '10 hours ago', text: 'Could add polar vs non-polar examples.' },
    ],
    related: ['Lewis structures', 'Electronegativity', 'Molecular polarity'],
    quiz: [
      { prompt: 'Ionic bonds form through...', options: ['Electron sharing', 'Electron transfer', 'Neutron exchange', 'Photon absorption'], correctIndex: 1, explanation: 'Ionic bonding occurs when electrons are transferred between atoms.' },
      { prompt: 'Covalent bonds are typically...', options: ['Between metals only', 'Between non-metals sharing electrons', 'Always triple bonds', 'Always weak'], correctIndex: 1, explanation: 'Covalent bonds involve shared electron pairs, usually between non-metals.' },
    ],
  },
  {
    id: 7,
    title: 'Ecosystem Energy Flow Module',
    type: 'interactive',
    subject: 'Biology',
    difficulty: 'Intermediate',
    duration: '16 min',
    rating: 4.6,
    ratingCount: 78,
    uses: 492,
    creator: 'Dr. Simone Rivers',
    description: 'Simulate trophic transfers and population changes.',
    savedCount: 61,
    hasQuiz: true,
    comments: [
      { author: 'Luca P.', initials: 'LP', time: '9 hours ago', text: 'Loved the food-web simulation.' },
      { author: 'Noah S.', initials: 'NS', time: '2 days ago', text: 'Great prep for ecology unit test.' },
    ],
    related: ['Food webs', 'Energy pyramids', 'Carbon cycle'],
    quiz: [
      { prompt: 'Energy transfer between trophic levels is typically around...', options: ['1%', '10%', '50%', '90%'], correctIndex: 1, explanation: 'A common rule-of-thumb is around 10% transfer efficiency.' },
      { prompt: 'Primary producers are usually...', options: ['Top predators', 'Herbivores', 'Autotrophs', 'Decomposers only'], correctIndex: 2, explanation: 'Primary producers are autotrophs that synthesize organic compounds.' },
    ],
  },
  {
    id: 8,
    title: 'Atmospheric Layers Quick Guide',
    type: 'pdf',
    subject: 'Earth Science',
    difficulty: 'Beginner',
    duration: '8 min read',
    rating: 4.4,
    ratingCount: 54,
    uses: 301,
    creator: 'Ms. Elena Romero',
    description: 'A quick visual reference of atmospheric layers and properties.',
    savedCount: 33,
    hasQuiz: true,
    fileSize: '0.9 MB',
    comments: [
      { author: 'Maya R.', initials: 'MR', time: '4 hours ago', text: 'Concise and easy to review before class.' },
      { author: 'Dev K.', initials: 'DK', time: '1 day ago', text: 'Add pressure trend chart if possible.' },
    ],
    related: ['Troposphere vs stratosphere', 'Ozone role', 'Weather dynamics'],
    quiz: [
      { prompt: 'Most weather occurs in the...', options: ['Thermosphere', 'Mesosphere', 'Troposphere', 'Exosphere'], correctIndex: 2, explanation: 'The troposphere contains most weather phenomena.' },
      { prompt: 'The ozone layer is mainly in the...', options: ['Stratosphere', 'Troposphere', 'Mesosphere', 'Exosphere'], correctIndex: 0, explanation: 'The ozone layer is concentrated in the stratosphere.' },
    ],
  },
];

export default function ResourcesPage({ searchQuery: searchProp = '', onSearchChange, onBreadcrumbChange }: ResourcesPageProps) {
  const { savedItems, likedItems, toggleSaved, toggleLiked, markReviewed, reviewedItems, addNotification } = useLocalStore();
  const [localSearch, setLocalSearch] = useState('');
  const searchQuery = onSearchChange !== undefined ? searchProp : localSearch;
  const setSearchQuery = (q: string) => onSearchChange ? onSearchChange(q) : setLocalSearch(q);

  const [showFilters, setShowFilters] = useState(false);
  const [selectedResource, setSelectedResource] = useState<number | null>(null);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'content' | 'discussion' | 'related'>('content');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [quizAnswers, setQuizAnswers] = useState<Record<number, number[]>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!onBreadcrumbChange) return;
    if (selectedResource === null) {
      onBreadcrumbChange([]);
      return;
    }
    const item = resources.find(resource => resource.id === selectedResource);
    if (!item) {
      onBreadcrumbChange([]);
      return;
    }
    onBreadcrumbChange([{ label: item.subject }, { label: item.title }]);
  }, [onBreadcrumbChange, selectedResource]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return resources.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.subject.toLowerCase().includes(q) ||
      r.creator.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const submitQuiz = (res: ResourceItem) => {
    const answers = quizAnswers[res.id] ?? [];
    const total = res.quiz?.length ?? 0;
    if (!res.quiz || total === 0) return;
    if (answers.length < total) {
      showToast('Answer all questions before submitting.');
      return;
    }
    setQuizSubmitted(prev => ({ ...prev, [res.id]: true }));
    const score = res.quiz.reduce((acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0), 0);
    addNotification(`Quiz completed: ${res.title} (${score}/${total})`);
    showToast(`Quiz scored: ${score}/${total}`);
  };

  if (selectedResource !== null) {
    const res = resources.find(r => r.id === selectedResource);
    if (!res) return null;

    const typeInfo = typeConfig[res.type];
    const TypeIcon = typeInfo.icon;
    const isSaved = savedItems.includes(`resource-${res.id}`);
    const isLiked = likedItems.includes(`resource-${res.id}`);
    const isReviewed = reviewedItems.includes(`resource-${res.id}`);
    const answers = quizAnswers[res.id] ?? [];
    const submitted = quizSubmitted[res.id] ?? false;
    const score = res.quiz ? res.quiz.reduce((acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0), 0) : 0;

    return (
      <div className="space-y-6">
        <button onClick={() => setSelectedResource(null)} className="inline-flex items-center gap-2 text-sm font-medium min-h-[44px] underline" style={{ color: 'var(--brand)' }}>
          {'<-'} Back to Resources
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="aspect-video flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--bg), var(--card-alt))' }}>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg" style={{ backgroundColor: 'var(--brand)', opacity: 0.9 }}><TypeIcon size={28} className="text-white" /></div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{typeInfo.label} Content</p>
                </div>
              </div>
              <div className="p-5">
                <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>{res.title}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span className="flex items-center gap-1"><User size={14} /> {res.creator}</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {res.duration}</span>
                  <span className="flex items-center gap-1"><Star size={14} className="fill-[#D97706] text-[#D97706]" /> {res.rating} ({res.ratingCount})</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{res.description}</p>
              </div>
            </div>

            <div className="rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
                {(['content', 'discussion', 'related'] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className="px-4 py-3 text-sm font-medium border-b-2 min-h-[44px] capitalize transition-colors" style={{ borderColor: activeTab === tab ? 'var(--brand)' : 'transparent', color: activeTab === tab ? 'var(--brand)' : 'var(--text-secondary)' }}>
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-5">
                {activeTab === 'content' && (
                  <div className="space-y-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <p>This resource includes guided examples plus a graded practice quiz.</p>
                    {res.quiz && (
                      <div className="space-y-4">
                        {res.quiz.map((q, qIndex) => (
                          <div key={qIndex} className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
                            <p className="font-medium mb-2" style={{ color: 'var(--text)' }}>{qIndex + 1}. {q.prompt}</p>
                            <div className="space-y-2">
                              {q.options.map((opt, oIndex) => {
                                const selected = answers[qIndex] === oIndex;
                                const correct = submitted && oIndex === q.correctIndex;
                                const wrong = submitted && selected && oIndex !== q.correctIndex;
                                return (
                                  <button
                                    key={oIndex}
                                    onClick={() => {
                                      if (submitted) return;
                                      const next = [...answers];
                                      next[qIndex] = oIndex;
                                      setQuizAnswers(prev => ({ ...prev, [res.id]: next }));
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-lg border text-sm"
                                    style={{
                                      borderColor: correct ? 'var(--success)' : wrong ? 'var(--error)' : selected ? 'var(--brand)' : 'var(--border)',
                                      color: 'var(--text)',
                                      backgroundColor: correct ? 'var(--success-bg)' : wrong ? 'rgba(239,68,68,0.12)' : selected ? 'var(--brand-bg)' : 'var(--card)',
                                    }}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                            {submitted && (
                              <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>{q.explanation}</p>
                            )}
                          </div>
                        ))}

                        {!submitted ? (
                          <button onClick={() => submitQuiz(res)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold min-h-[44px]" style={{ backgroundColor: 'var(--success)', color: '#FFFFFF' }}>
                            <Zap size={15} /> Submit Quiz
                          </button>
                        ) : (
                          <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--success-bg)', borderColor: 'var(--success)' }}>
                            <p className="font-semibold" style={{ color: 'var(--text)' }}>Score: {score}/{res.quiz.length}</p>
                            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{score === res.quiz.length ? 'Perfect score.' : 'Review explanations and retry another quiz.'}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {!isReviewed && (
                      <button onClick={() => { markReviewed(`resource-${res.id}`); showToast('Marked as reviewed.'); }} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border min-h-[44px]" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
                        <CheckCircle2 size={16} /> Mark as Reviewed
                      </button>
                    )}
                  </div>
                )}

                {activeTab === 'discussion' && (
                  <div className="space-y-3">
                    {res.comments.map((comment, idx) => (
                      <div key={idx} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg)' }}>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: 'var(--brand-bg)', color: 'var(--brand)' }}>{comment.initials}</div>
                          <span className="text-xs font-medium" style={{ color: 'var(--text)' }}>{comment.author}</span>
                          <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{comment.time}</span>
                        </div>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{comment.text}</p>
                      </div>
                    ))}
                    <button className="w-full p-3 border border-dashed rounded-lg text-sm font-medium min-h-[44px]" style={{ borderColor: 'var(--border)', color: 'var(--brand)' }} onClick={() => showToast('Comment form opened.')}>
                      + Add a comment
                    </button>
                  </div>
                )}

                {activeTab === 'related' && (
                  <div className="space-y-2">
                    {res.related.map((item, idx) => (
                      <div key={idx} className="w-full flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg)' }}>
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--brand-bg)' }}><Bookmark size={16} style={{ color: 'var(--brand)' }} /></div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>{item}</div>
                          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Related concept</div>
                        </div>
                        <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex flex-col gap-2 mt-2">
                <button onClick={() => { toggleSaved(`resource-${res.id}`); showToast(isSaved ? 'Removed from playlist' : 'Added to playlist'); }} className="w-full inline-flex items-center justify-center gap-2 font-semibold px-4 py-3 rounded-xl text-sm min-h-[48px] transition-colors" style={{ backgroundColor: isSaved ? 'var(--warning)' : 'var(--brand)', color: '#FFFFFF' }}>
                  <Bookmark size={16} fill={isSaved ? '#FFFFFF' : 'none'} /> {isSaved ? 'In Playlist' : 'Add to Playlist'}
                </button>
                <div className="flex gap-2">
                  <button onClick={() => { toggleLiked(`resource-${res.id}`); showToast(isLiked ? 'Unliked' : 'Liked'); }} className="flex-1 inline-flex items-center justify-center gap-1 border font-medium px-3 py-2.5 rounded-xl text-xs min-h-[44px]" style={{ borderColor: isLiked ? 'var(--error)' : 'var(--border)', color: isLiked ? 'var(--error)' : 'var(--text-secondary)' }}>
                    <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} /> {isLiked ? 'Liked' : 'Like'}
                  </button>
                  <button className="flex-1 inline-flex items-center justify-center gap-1 border font-medium px-3 py-2.5 rounded-xl text-xs min-h-[44px]" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }} onClick={() => showToast('Link copied to clipboard')}>
                    <Share2 size={14} /> Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {toastMsg && (
          <div className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
            <div className="px-5 py-3 rounded-xl shadow-lg text-sm font-medium" style={{ backgroundColor: 'var(--text)', color: 'var(--bg)' }}>{toastMsg}</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold font-[family-name:var(--font-display)]" style={{ color: 'var(--text)' }}>Resources</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>Browse science lessons, videos, quizzes, and downloads</p>
      </div>

      <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} style={{ color: 'var(--text-secondary)' }} />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by title, subject, or creator..." className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border min-h-[44px] focus:outline-none" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', borderColor: 'transparent' }} />
            {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} aria-label="Clear search"><X size={16} /></button>}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowFilters(!showFilters)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium min-h-[44px] transition-colors border" style={{ backgroundColor: showFilters ? 'var(--brand)' : 'var(--card)', color: showFilters ? '#FFFFFF' : 'var(--text)', borderColor: showFilters ? 'var(--brand)' : 'var(--border)' }}>
              <Filter size={16} /> Filters
            </button>
            <div className="hidden sm:flex rounded-lg p-1" style={{ backgroundColor: 'var(--bg)' }}>
              <button onClick={() => setViewType('grid')} className="p-2 rounded-md min-w-[36px] min-h-[36px] flex items-center justify-center" style={{ backgroundColor: viewType === 'grid' ? 'var(--card)' : 'transparent', color: viewType === 'grid' ? 'var(--text)' : 'var(--text-secondary)' }}><Grid size={16} /></button>
              <button onClick={() => setViewType('list')} className="p-2 rounded-md min-w-[36px] min-h-[36px] flex items-center justify-center" style={{ backgroundColor: viewType === 'list' ? 'var(--card)' : 'transparent', color: viewType === 'list' ? 'var(--text)' : 'var(--text-secondary)' }}><List size={16} /></button>
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{filtered.length} resources found</p>

      <div className={viewType === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
        {filtered.map(resource => {
          const typeInfo = typeConfig[resource.type];
          const TypeIcon = typeInfo.icon;
          const isLiked = likedItems.includes(`resource-${resource.id}`);
          return (
            <button key={resource.id} onClick={() => setSelectedResource(resource.id)} className="rounded-xl border transition-all text-left overflow-hidden hover:shadow-md" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              {viewType === 'grid' && (
                <div className="aspect-[16/9] flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--bg), var(--card-alt))' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--brand-bg)' }}><TypeIcon size={24} style={{ color: typeInfo.color }} /></div>
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold" style={{ backgroundColor: 'var(--brand-bg)', color: 'var(--brand)' }}>{resource.subject}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-secondary)' }}>{resource.difficulty}</span>
                </div>
                <h3 className="text-sm font-semibold line-clamp-2 leading-snug" style={{ color: 'var(--text)' }}>{resource.title}</h3>
                <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span className="flex items-center gap-0.5"><Clock size={11} /> {resource.duration}</span>
                  <span className="flex items-center gap-0.5"><Star size={11} className="fill-[#D97706] text-[#D97706]" /> {resource.rating}</span>
                  {isLiked && <span className="flex items-center gap-0.5" style={{ color: 'var(--error)' }}><Heart size={11} fill="currentColor" /></span>}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {toastMsg && (
        <div className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="px-5 py-3 rounded-xl shadow-lg text-sm font-medium" style={{ backgroundColor: 'var(--text)', color: 'var(--bg)' }}>{toastMsg}</div>
        </div>
      )}
    </div>
  );
}
