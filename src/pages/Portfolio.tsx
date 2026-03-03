import { useEffect, useState } from 'react';
import {
  FolderOpen, Plus, Clock, CheckCircle2, Star,
  ChevronRight, Link2, Upload, FileText, Image,
  ArrowLeft, Edit3, Share2, Lock, Globe,
  MessageSquare, Award,
} from 'lucide-react';
import type { BreadcrumbItem } from '@/config/site';

interface PortfolioProps {
  onBreadcrumbChange?: (items: BreadcrumbItem[]) => void;
}

interface NewProjectForm {
  title: string;
  subject: string;
  description: string;
}

export default function Portfolio({ onBreadcrumbChange }: PortfolioProps) {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showNewProject, setShowNewProject] = useState(false);
  const [newForm, setNewForm] = useState<NewProjectForm>({ title: '', subject: 'Physics', description: '' });
  const [userProjects, setUserProjects] = useState<typeof baseProjects>([]);

  const baseProjects = [
    {
      id: 1,
      title: 'Kinematics Lab Report',
      description: 'A deep dive into velocity, acceleration, and motion modeling from lab observations.',
      subject: 'Physics',
      status: 'In Progress',
      statusColor: '#D97706',
      statusIcon: Clock,
      lastUpdated: '2 days ago',
      goals: ['Model motion with equations', 'Interpret velocity-time graphs', 'Present findings'],
      artifacts: [
        { name: 'Draft Paper.pdf', type: 'pdf', size: '1.2 MB' },
        { name: 'Research Notes.docx', type: 'doc', size: '340 KB' },
        { name: 'Graphs.png', type: 'image', size: '890 KB' },
      ],
      reflection: 'I learned that interpreting graphs and experimental data is essential for understanding real motion systems.',
      feedback: [
        { author: 'Dr. Chen', text: 'Great progress! Consider adding a section on the discriminant.', time: '1 day ago' },
      ],
      privacy: 'private',
      completionPct: 65,
    },
    {
      id: 2,
      title: 'Cell Division Presentation',
      description: 'Interactive presentation on mitosis and meiosis with embedded diagrams and quiz questions.',
      subject: 'Biology',
      status: 'Submitted',
      statusColor: '#1D4ED8',
      statusIcon: CheckCircle2,
      lastUpdated: '1 week ago',
      goals: ['Explain mitosis stages', 'Compare with meiosis', 'Create visual aids'],
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
      privacy: 'shared',
      completionPct: 100,
    },
    {
      id: 3,
      title: 'Astrobiology Research Brief',
      description: 'A short research brief exploring habitable zones, extremophiles, and biosignatures.',
      subject: 'Biology',
      status: 'Featured',
      statusColor: '#059669',
      statusIcon: Star,
      lastUpdated: '3 days ago',
      goals: ['Compare habitability models', 'Summarize current evidence', 'Build a visual brief'],
      artifacts: [
        { name: 'Story 1 - New Dawn.pdf', type: 'pdf', size: '120 KB' },
        { name: 'Story 2 - Echoes.pdf', type: 'pdf', size: '95 KB' },
        { name: 'Story 3 - Crossroads.pdf', type: 'pdf', size: '140 KB' },
        { name: 'Author Notes.docx', type: 'doc', size: '45 KB' },
      ],
      reflection: 'This project helped me connect microbiology with planetary science and evaluate evidence critically.',
      feedback: [
        { author: 'Ms. Woods', text: 'Outstanding work! Your use of metaphor in "Echoes" is particularly strong.', time: '2 days ago' },
      ],
      privacy: 'public',
      completionPct: 100,
    },
    {
      id: 4,
      title: 'Climate Systems Data Analysis',
      description: 'Analysis of atmospheric and ocean datasets with explanatory charts and interpretations.',
      subject: 'Earth Science',
      status: 'In Progress',
      statusColor: '#D97706',
      statusIcon: Clock,
      lastUpdated: '1 day ago',
      goals: ['Analyze 5 climate datasets', 'Write evidence-based summaries', 'Create trend timeline'],
      artifacts: [
        { name: 'Source Analysis 1.pdf', type: 'pdf', size: '200 KB' },
        { name: 'Source Analysis 2.pdf', type: 'pdf', size: '185 KB' },
        { name: 'Timeline Draft.png', type: 'image', size: '1.5 MB' },
      ],
      reflection: '',
      feedback: [],
      privacy: 'private',
      completionPct: 40,
    },
  ];

  const projects = [...baseProjects, ...userProjects];

  const artifactIcons: Record<string, typeof FileText> = {
    pdf: FileText,
    doc: FileText,
    image: Image,
  };

  const handleCreateProject = () => {
    if (!newForm.title.trim()) return;
    const newProject = {
      id: Date.now(),
      title: newForm.title.trim(),
      description: newForm.description.trim() || 'New science project.',
      subject: newForm.subject,
      status: 'In Progress',
      statusColor: '#D97706',
      statusIcon: Clock,
      lastUpdated: 'just now',
      goals: [],
      artifacts: [] as { name: string; type: string; size: string }[],
      reflection: '',
      feedback: [] as { author: string; text: string; time: string }[],
      privacy: 'private' as const,
      completionPct: 0,
    };
    setUserProjects(prev => [...prev, newProject]);
    setNewForm({ title: '', subject: 'Physics', description: '' });
    setShowNewProject(false);
    setSelectedProject(newProject.id);
  };

  useEffect(() => {
    if (!onBreadcrumbChange) return;
    if (selectedProject === null) {
      onBreadcrumbChange([]);
      return;
    }
    const project = projects.find(p => p.id === selectedProject);
    if (!project) {
      onBreadcrumbChange([]);
      return;
    }
    onBreadcrumbChange([{ label: project.subject }, { label: project.title }]);
  }, [onBreadcrumbChange, selectedProject]);

  // Project detail view
  if (selectedProject !== null) {
    const project = projects.find(p => p.id === selectedProject);
    if (!project) return null;
    const StatusIcon = project.statusIcon;

    return (
      <div className="portfolio-page space-y-6">
        <button
          onClick={() => setSelectedProject(null)}
          className="inline-flex items-center gap-2 text-sm text-[#1D4ED8] font-medium min-h-[44px] underline"
        >
          <ArrowLeft size={16} /> Back to Portfolio
        </button>

        {/* Project header */}
        <div className="bg-white rounded-xl p-5 lg:p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-[#1D4ED8]/10 text-[#1D4ED8] rounded text-[10px] font-semibold">{project.subject}</span>
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold"
                  style={{ backgroundColor: project.statusColor + '15', color: project.statusColor }}
                >
                  <StatusIcon size={10} /> {project.status}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-[#4B5563] rounded text-[10px] font-medium">
                  {project.privacy === 'private' ? <><Lock size={9} /> Private</> : project.privacy === 'shared' ? <><Link2 size={9} /> Shared</> : <><Globe size={9} /> Public</>}
                </span>
              </div>
              <h1 className="text-xl font-bold text-[#111827]">{project.title}</h1>
              <p className="text-sm text-[#4B5563] mt-1">{project.description}</p>
              <p className="text-xs text-[#4B5563] mt-2">Last updated: {project.lastUpdated}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button className="inline-flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-[#111827] hover:bg-[#F5F5F7] min-h-[40px]">
                <Edit3 size={14} /> Edit
              </button>
              <button className="inline-flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-[#111827] hover:bg-[#F5F5F7] min-h-[40px]">
                <Share2 size={14} /> Share
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[#4B5563]">Completion</span>
              <span className="text-xs font-semibold" style={{ color: project.statusColor }}>{project.completionPct}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="h-2 rounded-full transition-all" style={{ width: `${project.completionPct}%`, backgroundColor: project.statusColor }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Learning Goals */}
          <div className="bg-white rounded-xl p-5 border border-gray-100">
            <h3 className="text-sm font-bold text-[#111827] mb-3 flex items-center gap-2">
              <Award size={16} className="text-[#1D4ED8]" /> Learning Goals
            </h3>
            <ul className="space-y-2">
              {project.goals.map((goal, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-[#111827]">
                  <CheckCircle2 size={16} className={i < project.goals.length - 1 && project.completionPct > 50 ? 'text-[#059669]' : 'text-gray-300'} />
                  {goal}
                </li>
              ))}
            </ul>
          </div>

          {/* Artifacts */}
          <div className="bg-white rounded-xl p-5 border border-gray-100">
            <h3 className="text-sm font-bold text-[#111827] mb-3 flex items-center gap-2">
              <FolderOpen size={16} className="text-[#D97706]" /> Artifacts
            </h3>
            <div className="space-y-2">
              {project.artifacts.map((art, i) => {
                const ArtIcon = artifactIcons[art.type] || FileText;
                return (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-[#F5F5F7] text-sm">
                    <ArtIcon size={16} className="text-[#4B5563] shrink-0" />
                    <span className="flex-1 text-[#111827] truncate">{art.name}</span>
                    <span className="text-xs text-[#4B5563] shrink-0">{art.size}</span>
                  </div>
                );
              })}
            </div>
            <button className="w-full mt-3 inline-flex items-center justify-center gap-2 border border-dashed border-gray-300 text-[#1D4ED8] font-medium px-4 py-3 rounded-xl text-sm hover:bg-[#1D4ED8]/5 min-h-[48px]">
              <Upload size={16} /> Add artifact
            </button>
          </div>
        </div>

        {/* Reflection */}
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h3 className="text-sm font-bold text-[#111827] mb-3 flex items-center gap-2">
            <Edit3 size={16} className="text-[#059669]" /> Reflection
          </h3>
          {project.reflection ? (
            <div>
              <p className="text-sm text-[#4B5563] leading-relaxed italic">"{project.reflection}"</p>
              <button className="mt-3 inline-flex items-center gap-1 text-sm text-[#1D4ED8] font-medium underline min-h-[44px]">
                <Edit3 size={14} /> Edit reflection
              </button>
            </div>
          ) : (
            <button className="w-full inline-flex items-center justify-center gap-2 border border-dashed border-gray-300 text-[#1D4ED8] font-medium px-4 py-4 rounded-xl text-sm hover:bg-[#1D4ED8]/5 min-h-[48px]">
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
      </div>
    );
  }

  return (
    <div className="portfolio-page space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-[#111827]">Portfolio</h1>
          <p className="text-sm text-[#4B5563] mt-0.5">Collect your work and showcase your learning</p>
        </div>
        <button
          onClick={() => setShowNewProject(true)}
          className="inline-flex items-center gap-2 bg-[#1D4ED8] text-white font-semibold px-5 py-3 rounded-xl text-sm hover:bg-[#1E40AF] transition-colors min-h-[48px] shadow-sm"
        >
          <Plus size={16} /> New Project
        </button>
      </div>

      {/* New Project inline form */}
      {showNewProject && (
        <div className="rounded-xl border-2 p-5 space-y-4 animate-fade-in" style={{ borderColor: 'var(--brand)', backgroundColor: 'var(--card)' }}>
          <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>New Project</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Project title"
              value={newForm.title}
              onChange={e => setNewForm(f => ({ ...f, title: e.target.value }))}
              autoFocus
              className="w-full px-3 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 min-h-[44px]"
              style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)', '--tw-ring-color': 'var(--brand)' } as React.CSSProperties}
            />
            <select
              value={newForm.subject}
              onChange={e => setNewForm(f => ({ ...f, subject: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl text-sm border focus:outline-none min-h-[44px]"
              style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              {['Physics', 'Chemistry', 'Biology', 'Earth Science'].map(s => <option key={s}>{s}</option>)}
            </select>
            <textarea
              placeholder="Short description (optional)"
              value={newForm.description}
              onChange={e => setNewForm(f => ({ ...f, description: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2.5 rounded-xl text-sm border focus:outline-none resize-none"
              style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreateProject}
              disabled={!newForm.title.trim()}
              className="inline-flex items-center gap-2 font-semibold px-4 py-2.5 rounded-xl text-sm min-h-[44px] disabled:opacity-40"
              style={{ backgroundColor: 'var(--brand)', color: '#fff' }}
            >
              <Plus size={15} /> Create Project
            </button>
            <button
              onClick={() => { setShowNewProject(false); setNewForm({ title: '', subject: 'Physics', description: '' }); }}
              className="px-4 py-2.5 rounded-xl text-sm min-h-[44px]"
              style={{ backgroundColor: 'var(--card-alt)', color: 'var(--text-secondary)' }}
            >Cancel</button>
          </div>
        </div>
      )}

      {/* View toggle */}
      <div className="flex items-center gap-2">
        <div className="inline-flex bg-[#F5F5F7] rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#111827]' : 'text-[#4B5563]'}`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium ${viewMode === 'list' ? 'bg-white shadow-sm text-[#111827]' : 'text-[#4B5563]'}`}
          >
            List
          </button>
        </div>
        <span className="text-sm text-[#4B5563]">{projects.length} projects</span>
      </div>

      {/* Projects */}
      <div className={viewMode === 'grid'
        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
        : 'space-y-3'
      }>
        {projects.map(project => {
          const StatusIcon = project.statusIcon;

          if (viewMode === 'list') {
            return (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project.id)}
                className="w-full bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all flex items-center gap-4 text-left min-h-[48px]"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: project.statusColor + '15' }}>
                  <StatusIcon size={20} style={{ color: project.statusColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-[#111827] truncate">{project.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-[#4B5563]">
                    <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-medium">{project.subject}</span>
                    <span
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold"
                      style={{ backgroundColor: project.statusColor + '15', color: project.statusColor }}
                    >
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
            <button
              key={project.id}
              onClick={() => setSelectedProject(project.id)}
              className="bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all text-left overflow-hidden"
            >
              {/* Card top band */}
              <div className="h-2 w-full" style={{ backgroundColor: project.statusColor }} />
              <div className="p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="px-2 py-0.5 bg-[#1D4ED8]/10 text-[#1D4ED8] rounded text-[10px] font-semibold">{project.subject}</span>
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold"
                    style={{ backgroundColor: project.statusColor + '15', color: project.statusColor }}
                  >
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
                  <span className="text-xs text-[#4B5563]">{project.lastUpdated}</span>
                </div>
              </div>
            </button>
          );
        })}

        {/* Add new project card */}
        <button
          onClick={() => { setShowNewProject(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center hover:border-[#1D4ED8] hover:bg-[#1D4ED8]/5 transition-all text-center min-h-[200px]"
        >
          <Plus size={24} className="text-[#4B5563] mb-2" />
          <span className="text-sm font-medium text-[#4B5563]">New Project</span>
        </button>
      </div>
    </div>
  );
}
