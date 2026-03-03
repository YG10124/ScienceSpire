import { useEffect, useState } from 'react';
import {
  FolderOpen, Plus, Clock, CheckCircle2, Star, X, Check,
  ChevronRight, Link2, Upload, FileText, Image,
  ArrowLeft, Edit3, Share2, Lock, Globe,
  MessageSquare, Award,
} from 'lucide-react';
import type { BreadcrumbItem } from '@/config/site';

interface Artifact {
  name: string;
  type: 'pdf' | 'doc' | 'image';
  size: string;
}

interface Goal {
  text: string;
  done: boolean;
}

interface Feedback {
  author: string;
  text: string;
  time: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  subject: string;
  status: string;
  statusColor: string;
  statusIcon: React.ComponentType<{ size?: number; style?: React.CSSProperties; className?: string }>;
  lastUpdated: string;
  goals: Goal[];
  artifacts: Artifact[];
  reflection: string;
  feedback: Feedback[];
  privacy: 'private' | 'shared' | 'public';
  completionPct: number;
}

interface PortfolioProps {
  onBreadcrumbChange?: (items: BreadcrumbItem[]) => void;
}

// ── Project detail sub-component (own state for editing) ─────────────────────
function ProjectDetail({
  project,
  onBack,
  onUpdate,
}: {
  project: Project;
  onBack: () => void;
  onUpdate: (id: number, patch: Partial<Omit<Project, 'id' | 'statusIcon'>>) => void;
}) {
  const [editingHeader, setEditingHeader] = useState(false);
  const [titleDraft, setTitleDraft] = useState(project.title);
  const [descDraft, setDescDraft] = useState(project.description);

  const [editingReflection, setEditingReflection] = useState(false);
  const [reflectionDraft, setReflectionDraft] = useState(project.reflection);

  const [showGoalInput, setShowGoalInput] = useState(false);
  const [newGoalText, setNewGoalText] = useState('');

  const [showArtifactForm, setShowArtifactForm] = useState(false);
  const [artifactName, setArtifactName] = useState('');
  const [artifactType, setArtifactType] = useState<'pdf' | 'doc' | 'image'>('pdf');

  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const StatusIcon = project.statusIcon;
  const artifactIcons = { pdf: FileText, doc: FileText, image: Image };

  // keep drafts fresh if parent updates (e.g. when navigating between projects)
  useEffect(() => { setTitleDraft(project.title); setDescDraft(project.description); }, [project.id]);
  useEffect(() => { setReflectionDraft(project.reflection); }, [project.id]);

  const cyclePrivacy = () => {
    const next: Record<Project['privacy'], Project['privacy']> = { private: 'shared', shared: 'public', public: 'private' };
    const p = next[project.privacy];
    onUpdate(project.id, { privacy: p, lastUpdated: 'just now' });
    showToast(`Visibility: ${p}`);
  };

  const saveHeader = () => {
    if (!titleDraft.trim()) return;
    onUpdate(project.id, { title: titleDraft.trim(), description: descDraft.trim(), lastUpdated: 'just now' });
    setEditingHeader(false);
    showToast('Project updated');
  };

  const saveReflection = () => {
    onUpdate(project.id, { reflection: reflectionDraft.trim(), lastUpdated: 'just now' });
    setEditingReflection(false);
    showToast('Reflection saved');
  };

  const toggleGoal = (i: number) => {
    const goals = project.goals.map((g, idx) => idx === i ? { ...g, done: !g.done } : g);
    onUpdate(project.id, { goals, lastUpdated: 'just now' });
  };

  const deleteGoal = (i: number) => {
    onUpdate(project.id, { goals: project.goals.filter((_, idx) => idx !== i), lastUpdated: 'just now' });
  };

  const addGoal = () => {
    if (!newGoalText.trim()) return;
    onUpdate(project.id, { goals: [...project.goals, { text: newGoalText.trim(), done: false }], lastUpdated: 'just now' });
    setNewGoalText('');
    setShowGoalInput(false);
  };

  const deleteArtifact = (i: number) => {
    onUpdate(project.id, { artifacts: project.artifacts.filter((_, idx) => idx !== i), lastUpdated: 'just now' });
  };

  const addArtifact = () => {
    if (!artifactName.trim()) return;
    onUpdate(project.id, {
      artifacts: [...project.artifacts, { name: artifactName.trim(), type: artifactType, size: '—' }],
      lastUpdated: 'just now',
    });
    setArtifactName('');
    setArtifactType('pdf');
    setShowArtifactForm(false);
    showToast('Artifact added');
  };

  return (
    <div className="portfolio-page space-y-6">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-[#1D4ED8] font-medium min-h-[44px] underline">
        <ArrowLeft size={16} /> Back to Portfolio
      </button>

      {/* Header card */}
      <div className="bg-white rounded-xl p-5 lg:p-6 border border-gray-100">
        {editingHeader ? (
          <div className="space-y-3">
            <input
              value={titleDraft}
              onChange={e => setTitleDraft(e.target.value)}
              autoFocus
              className="w-full px-3 py-2 rounded-xl text-base font-bold border border-gray-200 bg-[#F5F5F7] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
            />
            <textarea
              value={descDraft}
              onChange={e => setDescDraft(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-xl text-sm border border-gray-200 bg-[#F5F5F7] text-[#4B5563] resize-none focus:outline-none"
            />
            <div className="flex gap-2">
              <button onClick={saveHeader} disabled={!titleDraft.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[#1D4ED8] text-white min-h-[36px] disabled:opacity-40">
                <Check size={13} /> Save
              </button>
              <button onClick={() => { setTitleDraft(project.title); setDescDraft(project.description); setEditingHeader(false); }}
                className="px-3 py-2 rounded-lg text-xs bg-gray-100 text-[#4B5563] min-h-[36px]">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-[#1D4ED8]/10 text-[#1D4ED8] rounded text-[10px] font-semibold">{project.subject}</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold"
                  style={{ backgroundColor: project.statusColor + '15', color: project.statusColor }}>
                  <StatusIcon size={10} /> {project.status}
                </span>
                <button onClick={cyclePrivacy}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-[#4B5563] rounded text-[10px] font-medium hover:bg-gray-200 transition-colors">
                  {project.privacy === 'private' ? <><Lock size={9} /> Private</>
                    : project.privacy === 'shared' ? <><Link2 size={9} /> Shared</>
                    : <><Globe size={9} /> Public</>}
                </button>
              </div>
              <h1 className="text-xl font-bold text-[#111827]">{project.title}</h1>
              <p className="text-sm text-[#4B5563] mt-1">{project.description}</p>
              <p className="text-xs text-[#4B5563] mt-2">Last updated: {project.lastUpdated}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => { setTitleDraft(project.title); setDescDraft(project.description); setEditingHeader(true); }}
                className="inline-flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-[#111827] hover:bg-[#F5F5F7] min-h-[40px]">
                <Edit3 size={14} /> Edit
              </button>
              <button onClick={cyclePrivacy}
                className="inline-flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-[#111827] hover:bg-[#F5F5F7] min-h-[40px]">
                <Share2 size={14} /> Share
              </button>
            </div>
          </div>
        )}

        {/* Completion slider */}
        <div className="mt-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#4B5563]">Completion</span>
            <span className="text-xs font-semibold" style={{ color: project.statusColor }}>{project.completionPct}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="h-2 rounded-full transition-all" style={{ width: `${project.completionPct}%`, backgroundColor: project.statusColor }} />
          </div>
          <input
            type="range" min={0} max={100} step={5}
            value={project.completionPct}
            onChange={e => onUpdate(project.id, { completionPct: Number(e.target.value), lastUpdated: 'just now' })}
            className="w-full cursor-pointer accent-[#1D4ED8]"
            aria-label="Set completion percentage"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Goals */}
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h3 className="text-sm font-bold text-[#111827] mb-3 flex items-center gap-2">
            <Award size={16} className="text-[#1D4ED8]" /> Learning Goals
          </h3>
          {project.goals.length === 0 && !showGoalInput && (
            <p className="text-xs text-[#4B5563] mb-3 italic">No goals yet — add one below.</p>
          )}
          <ul className="space-y-2 mb-3">
            {project.goals.map((goal, i) => (
              <li key={i} className="flex items-center gap-2 group">
                <button
                  onClick={() => toggleGoal(i)}
                  className="shrink-0 w-5 h-5 flex items-center justify-center"
                  aria-label={goal.done ? 'Mark incomplete' : 'Mark complete'}
                >
                  <CheckCircle2 size={16}
                    style={{ color: goal.done ? '#059669' : '#D1D5DB' }}
                    fill={goal.done ? '#059669' : 'none'} />
                </button>
                <span className={`flex-1 text-sm ${goal.done ? 'line-through text-[#9CA3AF]' : 'text-[#111827]'}`}>{goal.text}</span>
                <button onClick={() => deleteGoal(i)}
                  className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded hover:bg-red-50 transition-all"
                  aria-label="Remove goal">
                  <X size={13} className="text-[#9CA3AF] hover:text-red-400" />
                </button>
              </li>
            ))}
          </ul>
          {showGoalInput ? (
            <div className="flex gap-2">
              <input type="text" value={newGoalText} onChange={e => setNewGoalText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addGoal(); if (e.key === 'Escape') setShowGoalInput(false); }}
                placeholder="New learning goal…" autoFocus
                className="flex-1 px-3 py-2 rounded-lg text-xs border border-gray-200 bg-[#F5F5F7] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] min-h-[36px]" />
              <button onClick={addGoal} disabled={!newGoalText.trim()}
                className="px-3 py-2 rounded-lg text-xs font-semibold bg-[#1D4ED8] text-white min-h-[36px] disabled:opacity-40">
                Add
              </button>
              <button onClick={() => { setShowGoalInput(false); setNewGoalText(''); }}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 text-[#4B5563]">
                <X size={13} />
              </button>
            </div>
          ) : (
            <button onClick={() => setShowGoalInput(true)}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#1D4ED8] hover:underline min-h-[32px]">
              <Plus size={13} /> Add goal
            </button>
          )}
        </div>

        {/* Artifacts */}
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h3 className="text-sm font-bold text-[#111827] mb-3 flex items-center gap-2">
            <FolderOpen size={16} className="text-[#D97706]" /> Artifacts
          </h3>
          {project.artifacts.length === 0 && !showArtifactForm && (
            <p className="text-xs text-[#4B5563] mb-3 italic">No files attached yet.</p>
          )}
          <div className="space-y-2 mb-3">
            {project.artifacts.map((art, i) => {
              const ArtIcon = artifactIcons[art.type] || FileText;
              return (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-[#F5F5F7] text-sm group">
                  <ArtIcon size={16} className="text-[#4B5563] shrink-0" />
                  <span className="flex-1 text-[#111827] truncate">{art.name}</span>
                  <span className="text-xs text-[#4B5563] shrink-0">{art.size}</span>
                  <button onClick={() => deleteArtifact(i)}
                    className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded hover:bg-red-50 transition-all"
                    aria-label="Remove artifact">
                    <X size={13} className="text-[#9CA3AF] hover:text-red-400" />
                  </button>
                </div>
              );
            })}
          </div>
          {showArtifactForm ? (
            <div className="space-y-2">
              <input type="text" value={artifactName} onChange={e => setArtifactName(e.target.value)}
                placeholder="File name (e.g. Lab Notes.pdf)" autoFocus
                className="w-full px-3 py-2 rounded-lg text-xs border border-gray-200 bg-[#F5F5F7] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] min-h-[36px]" />
              <div className="flex gap-2">
                <select value={artifactType} onChange={e => setArtifactType(e.target.value as Artifact['type'])}
                  className="flex-1 px-3 py-2 rounded-lg text-xs border border-gray-200 bg-[#F5F5F7] text-[#111827] min-h-[36px]">
                  <option value="pdf">PDF</option>
                  <option value="doc">Document</option>
                  <option value="image">Image</option>
                </select>
                <button onClick={addArtifact} disabled={!artifactName.trim()}
                  className="px-3 py-2 rounded-lg text-xs font-semibold bg-[#1D4ED8] text-white min-h-[36px] disabled:opacity-40">
                  Add
                </button>
                <button onClick={() => { setShowArtifactForm(false); setArtifactName(''); }}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 text-[#4B5563]">
                  <X size={13} />
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowArtifactForm(true)}
              className="w-full inline-flex items-center justify-center gap-2 border border-dashed border-gray-300 text-[#1D4ED8] font-medium px-4 py-3 rounded-xl text-sm hover:bg-[#1D4ED8]/5 min-h-[48px]">
              <Upload size={16} /> Add artifact
            </button>
          )}
        </div>
      </div>

      {/* Reflection */}
      <div className="bg-white rounded-xl p-5 border border-gray-100">
        <h3 className="text-sm font-bold text-[#111827] mb-3 flex items-center gap-2">
          <Edit3 size={16} className="text-[#059669]" /> Reflection
        </h3>
        {editingReflection ? (
          <div className="space-y-3">
            <textarea value={reflectionDraft} onChange={e => setReflectionDraft(e.target.value)}
              rows={4} autoFocus
              placeholder="What did you learn? What would you do differently next time?"
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-gray-200 bg-[#F5F5F7] text-[#4B5563] leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-[#059669]" />
            <div className="flex gap-2">
              <button onClick={saveReflection}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[#059669] text-white min-h-[36px]">
                <Check size={13} /> Save reflection
              </button>
              <button onClick={() => { setReflectionDraft(project.reflection); setEditingReflection(false); }}
                className="px-3 py-2 rounded-lg text-xs bg-gray-100 text-[#4B5563] min-h-[36px]">
                Cancel
              </button>
            </div>
          </div>
        ) : project.reflection ? (
          <div>
            <p className="text-sm text-[#4B5563] leading-relaxed italic">"{project.reflection}"</p>
            <button onClick={() => { setReflectionDraft(project.reflection); setEditingReflection(true); }}
              className="mt-3 inline-flex items-center gap-1 text-sm text-[#1D4ED8] font-medium underline min-h-[44px]">
              <Edit3 size={14} /> Edit reflection
            </button>
          </div>
        ) : (
          <button onClick={() => { setReflectionDraft(''); setEditingReflection(true); }}
            className="w-full inline-flex items-center justify-center gap-2 border border-dashed border-gray-300 text-[#1D4ED8] font-medium px-4 py-4 rounded-xl text-sm hover:bg-[#1D4ED8]/5 min-h-[48px]">
            <Edit3 size={16} /> Write your reflection
          </button>
        )}
      </div>

      {/* Feedback */}
      {project.feedback.length > 0 && (
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h3 className="text-sm font-bold text-[#111827] mb-3 flex items-center gap-2">
            <MessageSquare size={16} className="text-[#0369A1]" /> Feedback
          </h3>
          <div className="space-y-3">
            {project.feedback.map((fb, i) => (
              <div key={i} className="p-3 bg-[#F5F5F7] rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-[#111827]">{fb.author}</span>
                  <span className="text-xs text-[#4B5563]">{fb.time}</span>
                </div>
                <p className="text-sm text-[#4B5563]">{fb.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 animate-slide-up pointer-events-none">
          <div className="px-5 py-3 rounded-xl shadow-lg text-sm font-medium" style={{ backgroundColor: 'var(--text)', color: 'var(--bg)' }}>{toast}</div>
        </div>
      )}
    </div>
  );
}

// ── Main Portfolio list ───────────────────────────────────────────────────────
const SEED_PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Kinematics Lab Report',
    description: 'A deep dive into velocity, acceleration, and motion modeling from lab observations.',
    subject: 'Physics', status: 'In Progress', statusColor: '#D97706', statusIcon: Clock,
    lastUpdated: '2 days ago',
    goals: [
      { text: 'Model motion with equations', done: true },
      { text: 'Interpret velocity-time graphs', done: true },
      { text: 'Present findings', done: false },
    ],
    artifacts: [
      { name: 'Draft Paper.pdf', type: 'pdf', size: '1.2 MB' },
      { name: 'Research Notes.docx', type: 'doc', size: '340 KB' },
      { name: 'Graphs.png', type: 'image', size: '890 KB' },
    ],
    reflection: 'I learned that interpreting graphs and experimental data is essential for understanding real motion systems.',
    feedback: [{ author: 'Dr. Chen', text: 'Great progress! Consider adding a section on the discriminant.', time: '1 day ago' }],
    privacy: 'private', completionPct: 65,
  },
  {
    id: 2,
    title: 'Cell Division Presentation',
    description: 'Interactive presentation on mitosis and meiosis with embedded diagrams and quiz questions.',
    subject: 'Biology', status: 'Submitted', statusColor: '#1D4ED8', statusIcon: CheckCircle2,
    lastUpdated: '1 week ago',
    goals: [
      { text: 'Explain mitosis stages', done: true },
      { text: 'Compare with meiosis', done: true },
      { text: 'Create visual aids', done: true },
    ],
    artifacts: [
      { name: 'Presentation.pptx', type: 'doc', size: '4.5 MB' },
      { name: 'Cell Diagrams.png', type: 'image', size: '2.1 MB' },
      { name: 'Quiz Questions.pdf', type: 'pdf', size: '180 KB' },
    ],
    reflection: 'Creating visual diagrams really helped me understand the stages of mitosis. I would improve the meiosis section next time with more detailed comparisons.',
    feedback: [
      { author: 'Prof. Park', text: 'Excellent visuals! The quiz questions are well-designed.', time: '5 days ago' },
      { author: 'Sarah J.', text: 'The diagram colors made it really easy to follow the stages.', time: '3 days ago' },
    ],
    privacy: 'shared', completionPct: 100,
  },
  {
    id: 3,
    title: 'Astrobiology Research Brief',
    description: 'A short research brief exploring habitable zones, extremophiles, and biosignatures.',
    subject: 'Biology', status: 'Featured', statusColor: '#059669', statusIcon: Star,
    lastUpdated: '3 days ago',
    goals: [
      { text: 'Compare habitability models', done: true },
      { text: 'Summarize current evidence', done: true },
      { text: 'Build a visual brief', done: true },
    ],
    artifacts: [
      { name: 'Research Brief.pdf', type: 'pdf', size: '120 KB' },
      { name: 'Supporting Data.pdf', type: 'pdf', size: '95 KB' },
      { name: 'Figures.png', type: 'image', size: '1.4 MB' },
      { name: 'Author Notes.docx', type: 'doc', size: '45 KB' },
    ],
    reflection: 'This project helped me connect microbiology with planetary science and evaluate evidence critically.',
    feedback: [{ author: 'Ms. Woods', text: 'Outstanding work! The evidence summary is particularly strong.', time: '2 days ago' }],
    privacy: 'public', completionPct: 100,
  },
  {
    id: 4,
    title: 'Climate Systems Data Analysis',
    description: 'Analysis of atmospheric and ocean datasets with explanatory charts and interpretations.',
    subject: 'Earth Science', status: 'In Progress', statusColor: '#D97706', statusIcon: Clock,
    lastUpdated: '1 day ago',
    goals: [
      { text: 'Analyze 5 climate datasets', done: true },
      { text: 'Write evidence-based summaries', done: false },
      { text: 'Create trend timeline', done: false },
    ],
    artifacts: [
      { name: 'Source Analysis 1.pdf', type: 'pdf', size: '200 KB' },
      { name: 'Source Analysis 2.pdf', type: 'pdf', size: '185 KB' },
      { name: 'Timeline Draft.png', type: 'image', size: '1.5 MB' },
    ],
    reflection: '',
    feedback: [],
    privacy: 'private', completionPct: 40,
  },
];

export default function Portfolio({ onBreadcrumbChange }: PortfolioProps) {
  const [projects, setProjects] = useState<Project[]>(SEED_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showNewProject, setShowNewProject] = useState(false);
  const [newForm, setNewForm] = useState({ title: '', subject: 'Physics', description: '' });

  const updateProject = (id: number, patch: Partial<Omit<Project, 'id' | 'statusIcon'>>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p));
  };

  const handleCreateProject = () => {
    if (!newForm.title.trim()) return;
    const p: Project = {
      id: Date.now(),
      title: newForm.title.trim(),
      description: newForm.description.trim() || 'New science project.',
      subject: newForm.subject,
      status: 'In Progress', statusColor: '#D97706', statusIcon: Clock,
      lastUpdated: 'just now',
      goals: [], artifacts: [], reflection: '',
      feedback: [], privacy: 'private', completionPct: 0,
    };
    setProjects(prev => [...prev, p]);
    setNewForm({ title: '', subject: 'Physics', description: '' });
    setShowNewProject(false);
    setSelectedProject(p.id);
  };

  useEffect(() => {
    if (!onBreadcrumbChange) return;
    if (selectedProject === null) { onBreadcrumbChange([]); return; }
    const p = projects.find(pr => pr.id === selectedProject);
    if (!p) { onBreadcrumbChange([]); return; }
    onBreadcrumbChange([{ label: p.subject }, { label: p.title }]);
  }, [onBreadcrumbChange, selectedProject, projects]);

  // Detail view
  if (selectedProject !== null) {
    const project = projects.find(p => p.id === selectedProject);
    if (!project) return null;
    return (
      <ProjectDetail
        project={project}
        onBack={() => setSelectedProject(null)}
        onUpdate={updateProject}
      />
    );
  }

  // List view
  return (
    <div className="portfolio-page space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-[#111827]">Portfolio</h1>
          <p className="text-sm text-[#4B5563] mt-0.5">Collect your work and showcase your learning</p>
        </div>
        <button onClick={() => setShowNewProject(true)}
          className="inline-flex items-center gap-2 bg-[#1D4ED8] text-white font-semibold px-5 py-3 rounded-xl text-sm hover:bg-[#1E40AF] transition-colors min-h-[48px] shadow-sm">
          <Plus size={16} /> New Project
        </button>
      </div>

      {showNewProject && (
        <div className="rounded-xl border-2 p-5 space-y-4 animate-fade-in" style={{ borderColor: 'var(--brand)', backgroundColor: 'var(--card)' }}>
          <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>New Project</h3>
          <div className="space-y-3">
            <input type="text" placeholder="Project title" value={newForm.title}
              onChange={e => setNewForm(f => ({ ...f, title: e.target.value }))} autoFocus
              className="w-full px-3 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 min-h-[44px]"
              style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)', '--tw-ring-color': 'var(--brand)' } as React.CSSProperties} />
            <select value={newForm.subject} onChange={e => setNewForm(f => ({ ...f, subject: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl text-sm border focus:outline-none min-h-[44px]"
              style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}>
              {['Physics', 'Chemistry', 'Biology', 'Earth Science'].map(s => <option key={s}>{s}</option>)}
            </select>
            <textarea placeholder="Short description (optional)" value={newForm.description}
              onChange={e => setNewForm(f => ({ ...f, description: e.target.value }))} rows={2}
              className="w-full px-3 py-2.5 rounded-xl text-sm border focus:outline-none resize-none"
              style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }} />
          </div>
          <div className="flex gap-2">
            <button onClick={handleCreateProject} disabled={!newForm.title.trim()}
              className="inline-flex items-center gap-2 font-semibold px-4 py-2.5 rounded-xl text-sm min-h-[44px] disabled:opacity-40"
              style={{ backgroundColor: 'var(--brand)', color: '#fff' }}>
              <Plus size={15} /> Create Project
            </button>
            <button onClick={() => { setShowNewProject(false); setNewForm({ title: '', subject: 'Physics', description: '' }); }}
              className="px-4 py-2.5 rounded-xl text-sm min-h-[44px]"
              style={{ backgroundColor: 'var(--card-alt)', color: 'var(--text-secondary)' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="inline-flex bg-[#F5F5F7] rounded-lg p-1">
          <button onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#111827]' : 'text-[#4B5563]'}`}>
            Grid
          </button>
          <button onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium ${viewMode === 'list' ? 'bg-white shadow-sm text-[#111827]' : 'text-[#4B5563]'}`}>
            List
          </button>
        </div>
        <span className="text-sm text-[#4B5563]">{projects.length} projects</span>
      </div>

      <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
        {projects.map(project => {
          const StatusIcon = project.statusIcon;
          const doneCount = project.goals.filter(g => g.done).length;

          if (viewMode === 'list') {
            return (
              <button key={project.id} onClick={() => setSelectedProject(project.id)}
                className="w-full bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all flex items-center gap-4 text-left min-h-[48px]">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: project.statusColor + '15' }}>
                  <StatusIcon size={20} style={{ color: project.statusColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-[#111827] truncate">{project.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-[#4B5563]">
                    <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-medium">{project.subject}</span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold"
                      style={{ backgroundColor: project.statusColor + '15', color: project.statusColor }}>
                      <StatusIcon size={9} /> {project.status}
                    </span>
                    <span>{project.lastUpdated}</span>
                  </div>
                </div>
                <div className="w-16 shrink-0">
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full" style={{ width: `${project.completionPct}%`, backgroundColor: project.statusColor }} />
                  </div>
                  <span className="text-[10px] text-[#4B5563]">{project.completionPct}%</span>
                </div>
                <ChevronRight size={18} className="text-gray-300 shrink-0" />
              </button>
            );
          }

          return (
            <button key={project.id} onClick={() => setSelectedProject(project.id)}
              className="bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all text-left overflow-hidden">
              <div className="h-2 w-full" style={{ backgroundColor: project.statusColor }} />
              <div className="p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="px-2 py-0.5 bg-[#1D4ED8]/10 text-[#1D4ED8] rounded text-[10px] font-semibold">{project.subject}</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold"
                    style={{ backgroundColor: project.statusColor + '15', color: project.statusColor }}>
                    <StatusIcon size={10} /> {project.status}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-[#111827] line-clamp-2">{project.title}</h3>
                <p className="text-xs text-[#4B5563] mt-1 line-clamp-2">{project.description}</p>
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-[#4B5563]">Progress</span>
                    <span className="text-[10px] font-semibold" style={{ color: project.statusColor }}>{project.completionPct}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full transition-all" style={{ width: `${project.completionPct}%`, backgroundColor: project.statusColor }} />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                  <div className="flex items-center gap-1 text-xs text-[#4B5563]">
                    <FileText size={11} /> {project.artifacts.length} files
                  </div>
                  {project.goals.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-[#4B5563]">
                      <CheckCircle2 size={11} className={doneCount === project.goals.length ? 'text-[#059669]' : ''} />
                      {doneCount}/{project.goals.length} goals
                    </div>
                  )}
                  <span className="text-xs text-[#4B5563]">{project.lastUpdated}</span>
                </div>
              </div>
            </button>
          );
        })}

        <button onClick={() => { setShowNewProject(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center hover:border-[#1D4ED8] hover:bg-[#1D4ED8]/5 transition-all text-center min-h-[200px]">
          <Plus size={24} className="text-[#4B5563] mb-2" />
          <span className="text-sm font-medium text-[#4B5563]">New Project</span>
        </button>
      </div>
    </div>
  );
}
