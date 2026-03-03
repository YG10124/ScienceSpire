import { useEffect, useState } from 'react';
import {
  Palette, Zap, BookOpen, FileText, StickyNote,
  ChevronRight, ArrowLeft, Eye, Globe, Tag,
  Clock, BarChart3, Info, Check, X, Plus, Trash2,
} from 'lucide-react';
import { awardXP } from '@/store/gamificationModule';
import type { BreadcrumbItem } from '@/config/site';

interface QuizQuestion {
  text: string;
  options: [string, string, string, string];
  correct: number | null;
}

interface Flashcard {
  front: string;
  back: string;
}

interface Creation {
  id: string;
  title: string;
  type: string;
  typeLabel: string;
  subject: string;
  difficulty: string;
  date: string;
  views: number;
  color: string;
  questions?: QuizQuestion[];
  cards?: Flashcard[];
  content?: string;
  tags?: string;
}

interface CreatorStudioProps {
  onBreadcrumbChange?: (items: BreadcrumbItem[]) => void;
}

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '10px',
  fontSize: '0.875rem',
  minHeight: '44px',
  outline: 'none',
  border: '1.5px solid var(--border)',
  backgroundColor: 'var(--bg)',
  color: 'var(--text)',
};

const SAMPLE_CREATIONS: Creation[] = [
  {
    id: '1',
    title: 'Kinematics Basics Quiz',
    type: 'quiz',
    typeLabel: 'Quiz',
    subject: 'Physics',
    difficulty: 'Beginner',
    date: '3 days ago',
    views: 24,
    color: '#059669',
    questions: [
      { text: 'An object moves 60 m in 3 s. What is its average speed?', options: ['10 m/s', '20 m/s', '30 m/s', '180 m/s'], correct: 1 },
      { text: 'Which quantity is a vector?', options: ['Speed', 'Distance', 'Mass', 'Velocity'], correct: 3 },
      { text: 'What does the slope of a position-time graph represent?', options: ['Acceleration', 'Velocity', 'Distance', 'Force'], correct: 1 },
    ],
  },
  {
    id: '2',
    title: 'Organic Chemistry Flashcards',
    type: 'flashcards',
    typeLabel: 'Flashcards',
    subject: 'Chemistry',
    difficulty: 'Intermediate',
    date: '1 week ago',
    views: 18,
    color: '#1D4ED8',
    cards: [
      { front: 'Alkane', back: 'A saturated hydrocarbon with only single C-C bonds. General formula: CₙH₂ₙ₊₂' },
      { front: 'Alkene', back: 'An unsaturated hydrocarbon with at least one C=C double bond. General formula: CₙH₂ₙ' },
      { front: 'Functional group', back: 'A specific group of atoms within a molecule that determines chemical reactions.' },
    ],
  },
];

const TEMPLATE_SAMPLES: Record<string, { title: string; questions?: QuizQuestion[]; cards?: Flashcard[]; content?: string }> = {
  quiz: {
    title: 'Kinematics Quick Quiz',
    questions: [
      {
        text: 'An object moves 60 m in 3 seconds. What is its average speed?',
        options: ['10 m/s', '20 m/s', '30 m/s', '180 m/s'],
        correct: 1,
      },
    ],
  },
  flashcards: {
    title: "Newton's Laws Flashcards",
    cards: [
      { front: "Newton's First Law", back: "An object at rest stays at rest, and an object in motion stays in motion, unless acted on by an unbalanced force." },
      { front: "Newton's Second Law", back: 'F = ma — Net force equals mass times acceleration.' },
    ],
  },
  explainer: {
    title: 'How Acid-Base Reactions Work',
    content: `Introduction (0:00–0:30)
- Greet viewers and state what we're covering today
- "Today we're going to break down what makes something an acid or a base"

Section 1: Defining Acids and Bases (0:30–2:00)
- Arrhenius definition: acids produce H⁺, bases produce OH⁻
- Brønsted-Lowry: acids donate protons, bases accept them
- Real-world examples: lemon juice (acid), baking soda (base)

Section 2: pH Scale (2:00–3:30)
- Range 0–14, 7 is neutral
- Lower = more acidic, higher = more basic
- Logarithmic scale — each step is 10×

Closing (3:30–4:00)
- Recap the three key points
- Suggest next video: neutralization reactions`,
  },
  notes: {
    title: 'Cell Division — Mitosis',
    content: `# Mitosis — Key Stages

## Prophase
- Chromosomes condense and become visible
- Spindle fibers begin to form
- Nuclear envelope starts to break down

## Metaphase
- Chromosomes align along the cell's equator (metaphase plate)
- Spindle fibers attach to centromeres

## Anaphase
- Sister chromatids are pulled to opposite poles
- Cell begins to elongate

## Telophase & Cytokinesis
- Nuclear envelopes reform around each set of chromosomes
- Cell pinches in two (cytokinesis)
- Result: two genetically identical daughter cells

## Key Terms
- Chromatid: one copy of a duplicated chromosome
- Centromere: region where sister chromatids are joined
- Spindle apparatus: protein structure that moves chromosomes`,
  },
  cheatsheet: {
    title: 'Stoichiometry Reference Sheet',
    content: `STOICHIOMETRY CHEAT SHEET
==========================

MOLAR MASS
• Add up atomic masses from the periodic table
• Units: g/mol

MOLE CONVERSIONS
• Moles → grams:    mass = moles × molar mass
• Grams → moles:    moles = mass ÷ molar mass
• Moles → particles: multiply by 6.022 × 10²³

BALANCING EQUATIONS
1. Count atoms on each side
2. Add coefficients (not subscripts) to balance
3. Check: same atoms on both sides

LIMITING REAGENT
1. Convert both reactants to moles
2. Divide each by its coefficient
3. Smaller result = limiting reagent

PERCENT YIELD
  % yield = (actual yield ÷ theoretical yield) × 100

SOLUTION CONCENTRATION
  Molarity (M) = moles of solute ÷ liters of solution`,
  },
};

export default function CreatorStudio({ onBreadcrumbChange }: CreatorStudioProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [step, setStep] = useState<'select' | 'edit' | 'meta' | 'preview'>('select');
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [showPublishedToast, setShowPublishedToast] = useState(false);
  const [viewingCreation, setViewingCreation] = useState<Creation | null>(null);
  const [creations, setCreations] = useState<Creation[]>(SAMPLE_CREATIONS);

  // Edit state
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [content, setContent] = useState('');

  // Meta state
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [timeEst, setTimeEst] = useState('');
  const [tags, setTags] = useState('');
  const [authorNotes, setAuthorNotes] = useState('');

  const templates = [
    { id: 'quiz', title: 'Quiz', description: 'Multiple-choice quizzes for your peers to test their knowledge', icon: Zap, color: '#059669', example: 'Test classmates on key concepts' },
    { id: 'flashcards', title: 'Flashcards', description: 'Flashcard sets for vocabulary, formulas, or key facts', icon: StickyNote, color: '#1D4ED8', example: 'Study vocab, formulas, and definitions' },
    { id: 'explainer', title: 'Explainer Outline', description: 'Script and talking points for a short explainer video', icon: BookOpen, color: '#D97706', example: 'Teach a concept in 3–5 minutes' },
    { id: 'notes', title: 'Note Set', description: 'Organized class notes to share in a structured format', icon: FileText, color: '#0369A1', example: 'Share lecture summaries' },
    { id: 'cheatsheet', title: 'Cheat Sheet', description: 'A one-page reference guide for a topic or exam', icon: BarChart3, color: '#7C3AED', example: 'Quick reference for exams' },
  ];

  useEffect(() => {
    if (!onBreadcrumbChange) return;
    if (selectedTemplate === null) { onBreadcrumbChange([]); return; }
    const template = templates.find(t => t.id === selectedTemplate);
    if (!template) { onBreadcrumbChange([]); return; }
    onBreadcrumbChange([{ label: template.title }, { label: step }]);
  }, [onBreadcrumbChange, selectedTemplate, step]);

  const selectTemplate = (id: string) => {
    const sample = TEMPLATE_SAMPLES[id];
    setTitle(sample?.title ?? '');
    setQuestions(sample?.questions ? JSON.parse(JSON.stringify(sample.questions)) : [{ text: '', options: ['', '', '', ''], correct: null }]);
    setFlashcards(sample?.cards ? JSON.parse(JSON.stringify(sample.cards)) : [{ front: '', back: '' }]);
    setContent(sample?.content ?? '');
    setSubject('');
    setDifficulty('');
    setTimeEst('');
    setTags('');
    setAuthorNotes('');
    setSelectedTemplate(id);
    setStep('edit');
  };

  const resetToSelect = () => {
    setStep('select');
    setSelectedTemplate(null);
    setShowPublishConfirm(false);
  };

  const handlePublish = () => {
    awardXP('content_created', 75);
    const template = templates.find(t => t.id === selectedTemplate)!;
    const now = 'just now';
    const newCreation: Creation = {
      id: Date.now().toString(),
      title: title || `Untitled ${template.title}`,
      type: selectedTemplate!,
      typeLabel: template.title,
      subject: subject || 'General',
      difficulty: difficulty || 'All Levels',
      date: now,
      views: 0,
      color: template.color,
      ...(selectedTemplate === 'quiz' && { questions }),
      ...(selectedTemplate === 'flashcards' && { cards: flashcards }),
      ...(['explainer', 'notes', 'cheatsheet'].includes(selectedTemplate!) && { content }),
      tags,
    };
    setCreations(prev => [newCreation, ...prev]);
    setShowPublishConfirm(false);
    resetToSelect();
    setShowPublishedToast(true);
    setTimeout(() => setShowPublishedToast(false), 3500);
  };

  // ─── Detail view ───────────────────────────────────────────────
  if (viewingCreation) {
    const c = viewingCreation;
    const TypeIcon = templates.find(t => t.id === c.type)?.icon ?? Palette;
    return (
      <div className="space-y-6">
        <button
          onClick={() => setViewingCreation(null)}
          className="inline-flex items-center gap-2 text-sm font-medium min-h-[44px]"
          style={{ color: 'var(--brand)' }}
        >
          <ArrowLeft size={16} /> Back to Creator Studio
        </button>

        <div className="rounded-2xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: c.color + '18' }}>
              <TypeIcon size={24} style={{ color: c.color }} />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>{c.title}</h2>
              <div className="flex flex-wrap gap-2 mt-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <span className="px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: c.color + '18', color: c.color }}>{c.typeLabel}</span>
                <span>{c.subject}</span>
                {c.difficulty && <span>{c.difficulty}</span>}
                <span>{c.views} view{c.views !== 1 ? 's' : ''}</span>
                <span>Published {c.date}</span>
              </div>
            </div>
          </div>

          {c.type === 'quiz' && c.questions && (
            <div className="space-y-4">
              {c.questions.map((q, qi) => (
                <div key={qi} className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border-light)' }}>
                  <div className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>Q{qi + 1}. {q.text}</div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {q.options.map((opt, oi) => (
                      <div
                        key={oi}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm border"
                        style={{
                          backgroundColor: q.correct === oi ? 'var(--success-bg)' : 'var(--card)',
                          borderColor: q.correct === oi ? 'var(--success)' : 'var(--border-light)',
                          color: q.correct === oi ? 'var(--success)' : 'var(--text)',
                        }}
                      >
                        <span className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center shrink-0"
                          style={{ backgroundColor: q.correct === oi ? 'var(--success)' : 'var(--border)', color: '#fff' }}>
                          {String.fromCharCode(65 + oi)}
                        </span>
                        {opt || <span style={{ color: 'var(--text-secondary)' }}>(no answer)</span>}
                        {q.correct === oi && <Check size={13} className="ml-auto shrink-0" />}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {c.type === 'flashcards' && c.cards && (
            <div className="grid sm:grid-cols-2 gap-4">
              {c.cards.map((card, ci) => (
                <div key={ci} className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border-light)' }}>
                  <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wide border-b" style={{ backgroundColor: 'var(--brand-bg)', color: 'var(--brand)', borderColor: 'var(--border-light)' }}>Front</div>
                  <div className="px-4 py-3 text-sm font-medium" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>{card.front}</div>
                  <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wide border-t border-b" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)', borderColor: 'var(--border-light)' }}>Back</div>
                  <div className="px-4 py-3 text-sm" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-secondary)' }}>{card.back}</div>
                </div>
              ))}
            </div>
          )}

          {c.content && (
            <pre className="text-sm leading-relaxed whitespace-pre-wrap rounded-xl p-4 border font-[family-name:var(--font-mono,monospace)]"
              style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border-light)', color: 'var(--text)' }}>
              {c.content}
            </pre>
          )}
        </div>
      </div>
    );
  }

  // ─── Editor flow ───────────────────────────────────────────────
  if (step !== 'select') {
    const template = templates.find(t => t.id === selectedTemplate);
    if (!template) return null;
    const TemplateIcon = template.icon;

    const addQuestion = () =>
      setQuestions(prev => [...prev, { text: '', options: ['', '', '', ''], correct: null }]);

    const removeQuestion = (idx: number) =>
      setQuestions(prev => prev.filter((_, i) => i !== idx));

    const updateQuestion = (idx: number, field: 'text' | 'correct', value: string | number | null) =>
      setQuestions(prev => prev.map((q, i) => i === idx ? { ...q, [field]: value } : q));

    const updateOption = (qi: number, oi: number, value: string) =>
      setQuestions(prev => prev.map((q, i) => {
        if (i !== qi) return q;
        const opts = [...q.options] as [string, string, string, string];
        opts[oi] = value;
        return { ...q, options: opts };
      }));

    const addCard = () => setFlashcards(prev => [...prev, { front: '', back: '' }]);
    const removeCard = (idx: number) => setFlashcards(prev => prev.filter((_, i) => i !== idx));
    const updateCard = (idx: number, field: 'front' | 'back', value: string) =>
      setFlashcards(prev => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c));

    const steps = [
      { id: 'edit', label: 'Create Content' },
      { id: 'meta', label: 'Add Details' },
      { id: 'preview', label: 'Preview & Publish' },
    ];

    return (
      <div className="space-y-6">
        <button
          onClick={resetToSelect}
          className="inline-flex items-center gap-2 text-sm font-medium min-h-[44px]"
          style={{ color: 'var(--brand)' }}
        >
          <ArrowLeft size={16} /> Back to templates
        </button>

        {/* Step indicator */}
        <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center">
            {steps.map((s, i) => {
              const done = (s.id === 'edit' && (step === 'meta' || step === 'preview')) ||
                (s.id === 'meta' && step === 'preview');
              const active = step === s.id;
              return (
                <div key={s.id} className="flex items-center gap-2 flex-1">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      backgroundColor: done ? 'var(--success)' : active ? 'var(--brand)' : 'var(--bg)',
                      color: done || active ? '#ffffff' : 'var(--text-secondary)',
                    }}
                  >
                    {done ? <Check size={14} /> : i + 1}
                  </div>
                  <span className="text-xs font-medium hidden sm:block" style={{ color: active ? 'var(--brand)' : 'var(--text-secondary)' }}>
                    {s.label}
                  </span>
                  {i < 2 && <div className="flex-1 h-px mx-2 hidden sm:block" style={{ backgroundColor: 'var(--border)' }} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── EDIT STEP ── */}
        {step === 'edit' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: 'var(--border-light)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: template.color + '18' }}>
                  <TemplateIcon size={16} style={{ color: template.color }} />
                </div>
                <div>
                  <h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>{template.title}</h2>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{template.description}</p>
                </div>
              </div>

              <div className="p-5 space-y-5">
                {/* Title */}
                <div>
                  <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--text)' }}>Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder={`Enter your ${template.title.toLowerCase()} title...`}
                    style={inputStyle}
                  />
                </div>

                {/* Quiz editor */}
                {selectedTemplate === 'quiz' && (
                  <div className="space-y-4">
                    {questions.map((q, qi) => (
                      <div key={qi} className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border-light)' }}>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Question {qi + 1}</label>
                          {questions.length > 1 && (
                            <button onClick={() => removeQuestion(qi)} className="p-1 rounded-lg" style={{ color: 'var(--text-secondary)' }} aria-label="Remove question">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={q.text}
                          onChange={e => updateQuestion(qi, 'text', e.target.value)}
                          placeholder="Enter your question..."
                          style={{ ...inputStyle, marginBottom: '12px' }}
                        />
                        <div className="space-y-2 mb-3">
                          {q.options.map((opt, oi) => (
                            <div key={oi} className="flex items-center gap-2">
                              <span
                                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                                style={{
                                  backgroundColor: q.correct === oi ? 'var(--success)' : 'var(--border)',
                                  color: '#fff',
                                }}
                              >
                                {String.fromCharCode(65 + oi)}
                              </span>
                              <input
                                type="text"
                                value={opt}
                                onChange={e => updateOption(qi, oi, e.target.value)}
                                placeholder={`Option ${String.fromCharCode(65 + oi)}...`}
                                style={{ ...inputStyle }}
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Correct answer:</label>
                          <select
                            value={q.correct ?? ''}
                            onChange={e => updateQuestion(qi, 'correct', e.target.value === '' ? null : Number(e.target.value))}
                            style={{ ...inputStyle, width: 'auto', minHeight: '36px', padding: '4px 10px' }}
                          >
                            <option value="">Select...</option>
                            {q.options.map((_, oi) => (
                              <option key={oi} value={oi}>{String.fromCharCode(65 + oi)}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={addQuestion}
                      className="inline-flex items-center gap-2 text-sm font-medium min-h-[44px] px-4 py-2 rounded-lg border transition-colors"
                      style={{ color: 'var(--brand)', borderColor: 'var(--brand)', backgroundColor: 'transparent' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--brand-bg)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Plus size={16} /> Add another question
                    </button>
                  </div>
                )}

                {/* Flashcard editor */}
                {selectedTemplate === 'flashcards' && (
                  <div className="space-y-4">
                    {flashcards.map((card, ci) => (
                      <div key={ci} className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border-light)' }}>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Card {ci + 1}</label>
                          {flashcards.length > 1 && (
                            <button onClick={() => removeCard(ci)} className="p-1 rounded-lg" style={{ color: 'var(--text-secondary)' }} aria-label="Remove card">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-medium block mb-1" style={{ color: 'var(--text-secondary)' }}>Front (term or question)</label>
                            <textarea
                              value={card.front}
                              onChange={e => updateCard(ci, 'front', e.target.value)}
                              placeholder="Enter term or question..."
                              rows={3}
                              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium block mb-1" style={{ color: 'var(--text-secondary)' }}>Back (definition or answer)</label>
                            <textarea
                              value={card.back}
                              onChange={e => updateCard(ci, 'back', e.target.value)}
                              placeholder="Enter definition or answer..."
                              rows={3}
                              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={addCard}
                      className="inline-flex items-center gap-2 text-sm font-medium min-h-[44px] px-4 py-2 rounded-lg border transition-colors"
                      style={{ color: 'var(--brand)', borderColor: 'var(--brand)', backgroundColor: 'transparent' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--brand-bg)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Plus size={16} /> Add another card
                    </button>
                  </div>
                )}

                {/* Text editor (explainer, notes, cheatsheet) */}
                {['explainer', 'notes', 'cheatsheet'].includes(selectedTemplate!) && (
                  <div>
                    <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--text)' }}>Content</label>
                    <textarea
                      value={content}
                      onChange={e => setContent(e.target.value)}
                      placeholder={`Write your ${template.title.toLowerCase()} content here...`}
                      rows={14}
                      style={{ ...inputStyle, minHeight: '220px', resize: 'vertical', fontFamily: 'monospace' }}
                    />
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={() => setStep('meta')}
                    className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl text-sm min-h-[48px]"
                    style={{ backgroundColor: 'var(--brand)', color: '#ffffff' }}
                  >
                    Continue <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="rounded-xl p-5 border h-fit" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-bold flex items-center gap-2 mb-3" style={{ color: 'var(--text)' }}>
                <Info size={16} style={{ color: '#0369A1' }} /> Tips for a good {template.title.toLowerCase()}
              </h3>
              <ul className="space-y-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                {selectedTemplate === 'quiz' && <>
                  <li className="flex items-start gap-2"><span style={{ color: '#0369A1' }}>•</span> Write questions that test understanding, not just memorization</li>
                  <li className="flex items-start gap-2"><span style={{ color: '#0369A1' }}>•</span> Make all four options plausible — avoid obvious fillers</li>
                  <li className="flex items-start gap-2"><span style={{ color: '#0369A1' }}>•</span> Always mark the correct answer before publishing</li>
                  <li className="flex items-start gap-2"><span style={{ color: '#0369A1' }}>•</span> Aim for 5–10 questions for a focused quiz</li>
                </>}
                {selectedTemplate === 'flashcards' && <>
                  <li className="flex items-start gap-2"><span style={{ color: '#0369A1' }}>•</span> One concept per card — don't cram multiple ideas</li>
                  <li className="flex items-start gap-2"><span style={{ color: '#0369A1' }}>•</span> Back side should be complete but brief</li>
                  <li className="flex items-start gap-2"><span style={{ color: '#0369A1' }}>•</span> Include the unit or context where it helps</li>
                  <li className="flex items-start gap-2"><span style={{ color: '#0369A1' }}>•</span> 15–25 cards is a good target for one study session</li>
                </>}
                {['explainer', 'notes', 'cheatsheet'].includes(selectedTemplate!) && <>
                  <li className="flex items-start gap-2"><span style={{ color: '#0369A1' }}>•</span> Use headings to organize sections clearly</li>
                  <li className="flex items-start gap-2"><span style={{ color: '#0369A1' }}>•</span> Explain terms the first time you use them</li>
                  <li className="flex items-start gap-2"><span style={{ color: '#0369A1' }}>•</span> Keep examples concrete and specific to science</li>
                  <li className="flex items-start gap-2"><span style={{ color: '#0369A1' }}>•</span> Review your own content before publishing</li>
                </>}
              </ul>
            </div>
          </div>
        )}

        {/* ── META STEP ── */}
        {step === 'meta' && (
          <div className="rounded-xl p-5 lg:p-6 border max-w-2xl" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="text-base font-bold mb-4" style={{ color: 'var(--text)' }}>Resource Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--text)' }}>
                    <Tag size={13} className="inline mr-1" /> Subject *
                  </label>
                  <select value={subject} onChange={e => setSubject(e.target.value)} style={inputStyle}>
                    <option value="">Select subject</option>
                    <option>Physics</option>
                    <option>Chemistry</option>
                    <option>Biology</option>
                    <option>Earth Science</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--text)' }}>
                    <BarChart3 size={13} className="inline mr-1" /> Difficulty
                  </label>
                  <select value={difficulty} onChange={e => setDifficulty(e.target.value)} style={inputStyle}>
                    <option value="">Select difficulty</option>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                    <option>All Levels</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--text)' }}>
                  <Clock size={13} className="inline mr-1" /> Estimated Time
                </label>
                <select value={timeEst} onChange={e => setTimeEst(e.target.value)} style={inputStyle}>
                  <option value="">Select time</option>
                  <option>Under 5 minutes</option>
                  <option>5–10 minutes</option>
                  <option>10–20 minutes</option>
                  <option>20+ minutes</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--text)' }}>Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  placeholder="e.g. kinematics, motion, velocity..."
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--text)' }}>Note for other students (optional)</label>
                <textarea
                  value={authorNotes}
                  onChange={e => setAuthorNotes(e.target.value)}
                  placeholder="Any tips or context for students using this resource..."
                  rows={3}
                  style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                />
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep('edit')}
                className="inline-flex items-center gap-2 font-medium px-5 py-3 rounded-xl text-sm min-h-[48px] border"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                onClick={() => setStep('preview')}
                className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl text-sm min-h-[48px]"
                style={{ backgroundColor: 'var(--brand)', color: '#ffffff' }}
              >
                Preview <Eye size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── PREVIEW STEP ── */}
        {step === 'preview' && (
          <div className="max-w-2xl space-y-6">
            <div className="rounded-xl p-5 lg:p-6 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h2 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                <Eye size={18} style={{ color: 'var(--brand)' }} /> Preview
              </h2>

              {/* Preview card */}
              <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border-light)' }}>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: template.color + '18' }}>
                    <TemplateIcon size={22} style={{ color: template.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base" style={{ color: 'var(--text)' }}>{title || `Untitled ${template.title}`}</h3>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ backgroundColor: template.color + '18', color: template.color }}>{template.title}</span>
                      {subject && <span className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: 'var(--brand-bg)', color: 'var(--brand)' }}>{subject}</span>}
                      {difficulty && <span className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: 'var(--card)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>{difficulty}</span>}
                      {timeEst && <span className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: 'var(--card)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>{timeEst}</span>}
                    </div>
                  </div>
                </div>

                {selectedTemplate === 'quiz' && (
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {questions.filter(q => q.text).length} question{questions.filter(q => q.text).length !== 1 ? 's' : ''} &middot; Multiple choice
                    {questions[0]?.text && <p className="mt-2 text-xs italic" style={{ color: 'var(--text)' }}>First question: "{questions[0].text}"</p>}
                  </div>
                )}
                {selectedTemplate === 'flashcards' && (
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {flashcards.filter(c => c.front).length} card{flashcards.filter(c => c.front).length !== 1 ? 's' : ''}
                    {flashcards[0]?.front && <p className="mt-2 text-xs italic" style={{ color: 'var(--text)' }}>First card: "{flashcards[0].front}"</p>}
                  </div>
                )}
                {content && (
                  <p className="text-xs mt-2 line-clamp-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{content.slice(0, 180)}{content.length > 180 ? '…' : ''}</p>
                )}
                {authorNotes && (
                  <div className="mt-3 rounded-lg px-3 py-2 text-xs" style={{ backgroundColor: 'var(--brand-bg)', color: 'var(--brand)' }}>
                    Author note: {authorNotes}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep('meta')}
                className="inline-flex items-center gap-2 font-medium px-5 py-3 rounded-xl text-sm min-h-[48px] border"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                onClick={() => setShowPublishConfirm(true)}
                className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl text-sm min-h-[48px] shadow-sm"
                style={{ backgroundColor: 'var(--success)', color: '#ffffff' }}
              >
                <Globe size={16} /> Publish
              </button>
            </div>

            {showPublishConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0" style={{ backgroundColor: 'var(--surface-overlay)' }} onClick={() => setShowPublishConfirm(false)} />
                <div className="relative rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-scale-in border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'var(--success-bg)' }}>
                      <Globe size={24} style={{ color: 'var(--success)' }} />
                    </div>
                    <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Publish this resource?</h3>
                    <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                      It will be visible to other students on the platform. You can remove it from your creations at any time.
                    </p>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowPublishConfirm(false)}
                      className="flex-1 px-4 py-3 rounded-xl text-sm font-medium border min-h-[48px]"
                      style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePublish}
                      className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold min-h-[48px]"
                      style={{ backgroundColor: 'var(--success)', color: '#ffffff' }}
                    >
                      Publish
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ─── Template select view ──────────────────────────────────────
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold" style={{ color: 'var(--text)' }}>Creator Studio</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>Create resources to share with your classmates</p>
      </div>

      <div className="rounded-xl p-5 lg:p-6 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <h2 className="text-base font-bold mb-1" style={{ color: 'var(--text)' }}>Choose a template</h2>
        <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>Pick a format to start creating. You can edit everything before publishing.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map(template => {
            const Icon = template.icon;
            return (
              <button
                key={template.id}
                onClick={() => selectTemplate(template.id)}
                className="p-5 rounded-xl border-2 text-left group min-h-[48px] transition-all duration-200"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = template.color;
                  e.currentTarget.style.backgroundColor = template.color + '08';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.backgroundColor = 'var(--bg)';
                }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: template.color + '14' }}>
                  <Icon size={24} style={{ color: template.color }} />
                </div>
                <h3 className="text-base font-semibold" style={{ color: 'var(--text)' }}>{template.title}</h3>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{template.description}</p>
                <p className="text-[10px] mt-2 italic" style={{ color: 'var(--text-secondary)' }}>e.g. {template.example}</p>
                <div className="flex items-center gap-1 mt-3 text-xs font-medium" style={{ color: template.color }}>
                  Start creating <ChevronRight size={14} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Your Creations */}
      <div className="rounded-xl p-5 lg:p-6 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <h2 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
          <Palette size={18} style={{ color: 'var(--brand)' }} /> Your creations
          <span className="text-xs font-normal px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--brand-bg)', color: 'var(--brand)' }}>
            {creations.length}
          </span>
        </h2>
        {creations.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Nothing published yet. Create and publish your first resource above.</p>
        ) : (
          <div className="space-y-2">
            {creations.map(item => {
              const Icon = templates.find(t => t.id === item.type)?.icon ?? Palette;
              return (
                <button
                  key={item.id}
                  onClick={() => setViewingCreation(item)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors min-h-[56px]"
                  style={{ backgroundColor: 'var(--bg)' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--brand-bg)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--bg)')}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: item.color + '14' }}>
                    <Icon size={16} style={{ color: item.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{item.title}</div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {item.typeLabel} &middot; {item.subject} &middot; {item.date} &middot; {item.views} view{item.views !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <ChevronRight size={16} style={{ color: 'var(--text-secondary)' }} className="shrink-0" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Published toast */}
      {showPublishedToast && (
        <div
          className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl border animate-slide-up"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', minWidth: '260px' }}
        >
          <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--success-bg)' }}>
            <Check size={14} style={{ color: 'var(--success)' }} />
          </div>
          <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>Resource published successfully!</span>
          <button onClick={() => setShowPublishedToast(false)} style={{ color: 'var(--text-secondary)' }}><X size={14} /></button>
        </div>
      )}
    </div>
  );
}
