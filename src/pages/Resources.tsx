import { useState } from 'react';
import {
  Search, Filter, X, Play, FileText, Zap, Layers,
  Clock, Star, User, ChevronRight, Download,
  Heart, Share2, MessageSquare, Bookmark, Grid, List
} from 'lucide-react';

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedResource, setSelectedResource] = useState<number | null>(null);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'content' | 'discussion' | 'related'>('content');

  const typeConfig: Record<string, { icon: typeof Play; color: string; label: string }> = {
    video: { icon: Play, color: '#1D4ED8', label: 'Video' },
    quiz: { icon: Zap, color: '#059669', label: 'Quiz' },
    pdf: { icon: FileText, color: '#D97706', label: 'PDF' },
    interactive: { icon: Layers, color: '#0369A1', label: 'Interactive' },
  };

  const resources = [
    {
      id: 1,
      title: 'Introduction to Calculus: Limits and Derivatives',
      type: 'video',
      subject: 'Math',
      difficulty: 'Intermediate',
      duration: '25 min',
      rating: 4.8,
      ratingCount: 124,
      uses: 892,
      creator: 'Dr. Sarah Chen',
      description: 'A comprehensive introduction to limits and their application to finding derivatives. Includes embedded practice problems.',
      savedCount: 56,
      hasQuiz: true,
    },
    {
      id: 2,
      title: 'Chemistry Lab Safety Quiz',
      type: 'quiz',
      subject: 'Science',
      difficulty: 'Beginner',
      duration: '10 min',
      rating: 4.6,
      ratingCount: 89,
      uses: 534,
      creator: 'Prof. James Park',
      description: 'Test your knowledge of lab safety procedures. Required before first lab session.',
      savedCount: 32,
      hasQuiz: false,
    },
    {
      id: 3,
      title: 'Essay Writing: Structure & Arguments',
      type: 'pdf',
      subject: 'English',
      difficulty: 'All Levels',
      duration: '15 min read',
      rating: 4.7,
      ratingCount: 67,
      uses: 421,
      creator: 'Ms. Emily Woods',
      description: 'Guide to structuring persuasive essays with strong thesis statements and supporting arguments.',
      savedCount: 78,
      hasQuiz: true,
      fileSize: '2.4 MB',
    },
    {
      id: 4,
      title: 'Interactive World History Timeline',
      type: 'interactive',
      subject: 'History',
      difficulty: 'All Levels',
      duration: '20 min',
      rating: 4.9,
      ratingCount: 156,
      uses: 1203,
      creator: 'Mr. David Kim',
      description: 'Explore major world events from ancient civilizations to modern times with this interactive timeline.',
      savedCount: 112,
      hasQuiz: true,
    },
    {
      id: 5,
      title: 'Physics Formulas Cheat Sheet',
      type: 'pdf',
      subject: 'Physics',
      difficulty: 'All Levels',
      duration: '5 min read',
      rating: 4.5,
      ratingCount: 201,
      uses: 1567,
      creator: 'Alex M. (Student)',
      description: 'All essential physics formulas organized by topic. Great for exam preparation.',
      savedCount: 189,
      hasQuiz: false,
      fileSize: '1.1 MB',
    },
    {
      id: 6,
      title: 'Cell Biology: Mitosis & Meiosis',
      type: 'video',
      subject: 'Science',
      difficulty: 'Beginner',
      duration: '18 min',
      rating: 4.7,
      ratingCount: 93,
      uses: 678,
      creator: 'Prof. James Park',
      description: 'Visual walkthrough of cell division processes with animations and diagrams.',
      savedCount: 45,
      hasQuiz: true,
    },
  ];

  const filtered = resources.filter(r =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.creator.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedResource !== null) {
    const res = resources.find(r => r.id === selectedResource);
    if (!res) return null;
    const typeInfo = typeConfig[res.type];
    const TypeIcon = typeInfo.icon;

    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedResource(null)}
          className="inline-flex items-center gap-2 text-sm text-[#1D4ED8] font-medium min-h-[44px] underline"
        >
          ← Back to Resources
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Content area mock */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[#1D4ED8]/90 flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <TypeIcon size={28} className="text-white" />
                  </div>
                  <p className="text-sm font-medium text-[#4B5563]">{typeInfo.label} Content</p>
                  <p className="text-xs text-[#4B5563] mt-1">{res.duration}</p>
                </div>
                {res.type === 'video' && (
                  <button className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors" aria-label="Play video">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                      <Play size={24} className="text-[#1D4ED8] ml-1" />
                    </div>
                  </button>
                )}
              </div>
              <div className="p-5">
                <h1 className="text-xl font-bold text-[#111827]">{res.title}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-[#4B5563]">
                  <span className="flex items-center gap-1"><User size={14} /> {res.creator}</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {res.duration}</span>
                  <span className="flex items-center gap-1">
                    <Star size={14} className="fill-[#D97706] text-[#D97706]" /> {res.rating} ({res.ratingCount})
                  </span>
                </div>
                <p className="mt-3 text-sm text-[#4B5563] leading-relaxed">{res.description}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border border-gray-100">
              <div className="flex border-b border-gray-100">
                {(['content', 'discussion', 'related'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 text-sm font-medium border-b-2 min-h-[44px] capitalize transition-colors ${
                      activeTab === tab
                        ? 'border-[#1D4ED8] text-[#1D4ED8]'
                        : 'border-transparent text-[#4B5563] hover:text-[#111827]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="p-5">
                {activeTab === 'content' && (
                  <div className="space-y-3 text-sm text-[#4B5563]">
                    <p>This resource covers the fundamentals with interactive examples and practice opportunities.</p>
                    {res.hasQuiz && (
                      <div className="p-3 bg-[#059669]/5 border border-[#059669]/10 rounded-lg flex items-center gap-3">
                        <Zap size={18} className="text-[#059669]" />
                        <div>
                          <p className="font-medium text-[#111827]">Practice Quiz Available</p>
                          <p className="text-xs text-[#4B5563]">Test your understanding after completing this resource</p>
                        </div>
                        <button className="ml-auto px-3 py-2 bg-[#059669] text-white text-xs font-semibold rounded-lg min-h-[36px]">
                          Take Quiz
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {activeTab === 'discussion' && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-[#F5F5F7]">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-[#1D4ED8]/20 flex items-center justify-center text-[10px] font-bold text-[#1D4ED8]">M</div>
                        <span className="text-xs font-medium text-[#111827]">Maria L.</span>
                        <span className="text-[10px] text-[#4B5563]">2 days ago</span>
                      </div>
                      <p className="text-sm text-[#4B5563]">Really helpful explanation at the 15-minute mark about the chain rule!</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[#F5F5F7]">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-[#059669]/20 flex items-center justify-center text-[10px] font-bold text-[#059669]">C</div>
                        <span className="text-xs font-medium text-[#111827]">Chris K.</span>
                        <span className="text-[10px] text-[#4B5563]">1 day ago</span>
                      </div>
                      <p className="text-sm text-[#4B5563]">Can someone explain the difference between average and instantaneous rate of change?</p>
                    </div>
                    <button className="w-full p-3 border border-dashed border-gray-300 rounded-lg text-sm text-[#1D4ED8] font-medium hover:bg-[#1D4ED8]/5 min-h-[44px]">
                      + Add a comment
                    </button>
                  </div>
                )}
                {activeTab === 'related' && (
                  <div className="space-y-2">
                    {resources.filter(r => r.id !== res.id).slice(0, 3).map(r => {
                      const ti = typeConfig[r.type];
                      const TI = ti.icon;
                      return (
                        <button
                          key={r.id}
                          onClick={() => setSelectedResource(r.id)}
                          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#F5F5F7] text-left min-h-[48px]"
                        >
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: ti.color + '12' }}>
                            <TI size={16} style={{ color: ti.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-[#111827] truncate">{r.title}</div>
                            <div className="text-xs text-[#4B5563]">{r.duration} · {ti.label}</div>
                          </div>
                          <ChevronRight size={16} className="text-gray-300" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-5 border border-gray-100">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold" style={{ backgroundColor: typeInfo.color + '15', color: typeInfo.color }}>
                  <TypeIcon size={12} /> {typeInfo.label}
                </span>
                <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-medium text-[#4B5563]">
                  {res.subject}
                </span>
                <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-medium text-[#4B5563]">
                  {res.difficulty}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                  <span className="text-[#4B5563]">Duration</span>
                  <span className="font-medium text-[#111827]">{res.duration}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                  <span className="text-[#4B5563]">Rating</span>
                  <span className="font-medium text-[#111827] flex items-center gap-1">
                    <Star size={12} className="fill-[#D97706] text-[#D97706]" /> {res.rating}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                  <span className="text-[#4B5563]">Used by</span>
                  <span className="font-medium text-[#111827]">{res.uses} students</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-[#4B5563]">Saved</span>
                  <span className="font-medium text-[#111827]">{res.savedCount} times</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <button className="w-full inline-flex items-center justify-center gap-2 bg-[#1D4ED8] text-white font-semibold px-4 py-3 rounded-xl text-sm hover:bg-[#1E40AF] transition-colors min-h-[48px]">
                  <Bookmark size={16} /> Add to playlist
                </button>
                <div className="flex gap-2">
                  <button className="flex-1 inline-flex items-center justify-center gap-1 border border-gray-200 text-[#4B5563] font-medium px-3 py-2.5 rounded-xl text-xs hover:bg-[#F5F5F7] min-h-[44px]">
                    <Heart size={14} /> Save
                  </button>
                  <button className="flex-1 inline-flex items-center justify-center gap-1 border border-gray-200 text-[#4B5563] font-medium px-3 py-2.5 rounded-xl text-xs hover:bg-[#F5F5F7] min-h-[44px]">
                    <Share2 size={14} /> Share
                  </button>
                </div>
              </div>

              {res.type === 'pdf' && res.fileSize && (
                <button className="w-full mt-3 inline-flex items-center justify-center gap-2 border-2 border-[#1D4ED8] text-[#1D4ED8] font-semibold px-4 py-3 rounded-xl text-sm hover:bg-[#1D4ED8]/5 min-h-[48px]">
                  <Download size={16} /> Download ({res.fileSize})
                </button>
              )}
            </div>

            {/* Creator info */}
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <h4 className="text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-2">Created by</h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6] flex items-center justify-center text-white text-sm font-bold">
                  {res.creator.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-medium text-[#111827]">{res.creator}</div>
                  <div className="text-xs text-[#4B5563]">{res.ratingCount} resources</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-[#111827]">Resources</h1>
        <p className="text-sm text-[#4B5563] mt-0.5">Browse lessons, videos, quizzes, and downloads</p>
      </div>

      {/* Search & Controls */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4B5563]" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by title, subject, or creator..."
              aria-label="Search resources"
              className="w-full pl-10 pr-4 py-2.5 bg-[#F5F5F7] rounded-xl text-sm text-[#111827] placeholder-[#4B5563] border border-transparent focus:border-[#1D4ED8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 min-h-[44px]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5563] hover:text-[#111827]" aria-label="Clear search">
                <X size={16} />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium min-h-[44px] transition-colors border ${
                showFilters ? 'bg-[#1D4ED8] text-white border-[#1D4ED8]' : 'bg-white text-[#111827] border-gray-200 hover:bg-[#F5F5F7]'
              }`}
            >
              <Filter size={16} /> Filters
            </button>
            <div className="hidden sm:flex bg-[#F5F5F7] rounded-lg p-1">
              <button
                onClick={() => setViewType('grid')}
                className={`p-2 rounded-md min-w-[36px] min-h-[36px] flex items-center justify-center ${viewType === 'grid' ? 'bg-white shadow-sm text-[#111827]' : 'text-[#4B5563]'}`}
                aria-label="Grid view"
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewType('list')}
                className={`p-2 rounded-md min-w-[36px] min-h-[36px] flex items-center justify-center ${viewType === 'list' ? 'bg-white shadow-sm text-[#111827]' : 'text-[#4B5563]'}`}
                aria-label="List view"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-100 animate-scale-in">
            <div>
              <label className="text-xs font-medium text-[#4B5563] block mb-1">Subject</label>
              <select className="w-full px-3 py-2.5 bg-[#F5F5F7] rounded-lg text-sm border border-transparent focus:border-[#1D4ED8] focus:outline-none min-h-[44px]">
                <option>All</option>
                <option>Math</option>
                <option>Science</option>
                <option>English</option>
                <option>History</option>
                <option>Physics</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-[#4B5563] block mb-1">Format</label>
              <select className="w-full px-3 py-2.5 bg-[#F5F5F7] rounded-lg text-sm border border-transparent focus:border-[#1D4ED8] focus:outline-none min-h-[44px]">
                <option>All</option>
                <option>Video</option>
                <option>Quiz</option>
                <option>PDF</option>
                <option>Interactive</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-[#4B5563] block mb-1">Difficulty</label>
              <select className="w-full px-3 py-2.5 bg-[#F5F5F7] rounded-lg text-sm border border-transparent focus:border-[#1D4ED8] focus:outline-none min-h-[44px]">
                <option>All</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-[#4B5563] block mb-1">Duration</label>
              <select className="w-full px-3 py-2.5 bg-[#F5F5F7] rounded-lg text-sm border border-transparent focus:border-[#1D4ED8] focus:outline-none min-h-[44px]">
                <option>Any</option>
                <option>Under 10 min</option>
                <option>10–20 min</option>
                <option>20+ min</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-[#4B5563]">{filtered.length} resources found</p>

      {/* Resource Cards */}
      <div className={viewType === 'grid'
        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
        : 'space-y-3'
      }>
        {filtered.map(resource => {
          const typeInfo = typeConfig[resource.type];
          const TypeIcon = typeInfo.icon;

          if (viewType === 'list') {
            return (
              <button
                key={resource.id}
                onClick={() => setSelectedResource(resource.id)}
                className="w-full bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all flex items-center gap-4 text-left min-h-[48px]"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: typeInfo.color + '12' }}>
                  <TypeIcon size={22} style={{ color: typeInfo.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-[#111827] truncate">{resource.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-[#4B5563]">
                    <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-medium">{resource.subject}</span>
                    <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-medium">{typeInfo.label}</span>
                    <span className="flex items-center gap-0.5"><Clock size={10} /> {resource.duration}</span>
                    <span className="flex items-center gap-0.5">
                      <Star size={10} className="fill-[#D97706] text-[#D97706]" /> {resource.rating}
                    </span>
                    <span><User size={10} className="inline" /> {resource.creator}</span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300 shrink-0" />
              </button>
            );
          }

          return (
            <button
              key={resource.id}
              onClick={() => setSelectedResource(resource.id)}
              className="bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all text-left overflow-hidden"
            >
              {/* Card header */}
              <div className="aspect-[16/9] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: typeInfo.color + '20' }}>
                  <TypeIcon size={24} style={{ color: typeInfo.color }} />
                </div>
                <span className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-1 bg-white/90 rounded-lg text-[10px] font-semibold backdrop-blur" style={{ color: typeInfo.color }}>
                  <TypeIcon size={10} /> {typeInfo.label}
                </span>
                {resource.type === 'pdf' && resource.fileSize && (
                  <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 px-2 py-1 bg-white/90 rounded-lg text-[10px] text-[#4B5563] font-medium backdrop-blur">
                    <Download size={10} /> {resource.fileSize}
                  </span>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="px-1.5 py-0.5 bg-[#1D4ED8]/10 text-[#1D4ED8] rounded text-[10px] font-semibold">{resource.subject}</span>
                  <span className="px-1.5 py-0.5 bg-gray-100 text-[#4B5563] rounded text-[10px] font-medium">{resource.difficulty}</span>
                </div>
                <h3 className="text-sm font-semibold text-[#111827] line-clamp-2 leading-snug">{resource.title}</h3>
                <div className="flex items-center gap-3 mt-2 text-xs text-[#4B5563]">
                  <span className="flex items-center gap-0.5"><Clock size={11} /> {resource.duration}</span>
                  <span className="flex items-center gap-0.5">
                    <Star size={11} className="fill-[#D97706] text-[#D97706]" /> {resource.rating}
                  </span>
                  <span className="flex items-center gap-0.5"><MessageSquare size={11} /> {resource.uses}</span>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
                  <div className="w-5 h-5 rounded-full bg-[#1D4ED8]/20 flex items-center justify-center text-[8px] font-bold text-[#1D4ED8]">
                    {resource.creator.charAt(0)}
                  </div>
                  <span className="text-xs text-[#4B5563] truncate">{resource.creator}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
