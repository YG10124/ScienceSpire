import { useState } from 'react';
import {
  Calendar, Clock, Users, Video, Monitor, FileText,
  ChevronLeft, ChevronRight, Filter, X, CheckCircle2,
  MapPin, BookOpen, AlertTriangle, Bell
} from 'lucide-react';

export default function Schedule() {
  const [viewMode, setViewMode] = useState<'my' | 'all'>('all');
  const [selectedDay, setSelectedDay] = useState(2); // Wednesday (index)
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);

  const days = [
    { short: 'Mon', date: '12', full: 'Monday, Jan 12' },
    { short: 'Tue', date: '13', full: 'Tuesday, Jan 13' },
    { short: 'Wed', date: '14', full: 'Wednesday, Jan 14' },
    { short: 'Thu', date: '15', full: 'Thursday, Jan 15' },
    { short: 'Fri', date: '16', full: 'Friday, Jan 16' },
    { short: 'Sat', date: '17', full: 'Saturday, Jan 17' },
    { short: 'Sun', date: '18', full: 'Sunday, Jan 18' },
  ];

  const sessions = [
    {
      id: 1,
      title: 'Algebra Fundamentals: Quadratic Equations',
      subject: 'Math',
      level: 'Intermediate',
      levelColor: '#D97706',
      host: 'Dr. Sarah Chen',
      hostInitials: 'SC',
      time: '10:00 AM – 11:00 AM',
      capacity: { current: 8, max: 12 },
      tools: ['video', 'whiteboard', 'quiz'],
      status: 'upcoming',
      description: 'Deep dive into solving quadratic equations using factoring, completing the square, and the quadratic formula.',
      agenda: ['Review: Linear equations', 'Intro: Quadratic equations', 'Practice problems', 'Q&A'],
      materials: ['Textbook Ch. 7', 'Calculator'],
      isMySession: true,
    },
    {
      id: 2,
      title: 'Biology Lab: Cell Division',
      subject: 'Science',
      level: 'Beginner',
      levelColor: '#059669',
      host: 'Prof. James Park',
      hostInitials: 'JP',
      time: '2:00 PM – 3:30 PM',
      capacity: { current: 12, max: 15 },
      tools: ['video', 'whiteboard'],
      status: 'upcoming',
      description: 'Explore mitosis and meiosis with virtual lab simulations and guided exercises.',
      agenda: ['Cell cycle overview', 'Mitosis stages', 'Virtual lab', 'Discussion'],
      materials: ['Lab notebook', 'Biology textbook'],
      isMySession: true,
    },
    {
      id: 3,
      title: 'Creative Writing Workshop',
      subject: 'English',
      level: 'All Levels',
      levelColor: '#0369A1',
      host: 'Ms. Emily Woods',
      hostInitials: 'EW',
      time: '4:00 PM – 5:00 PM',
      capacity: { current: 5, max: 10 },
      tools: ['video'],
      status: 'open',
      description: 'Write short fiction with peer feedback. This week: character development.',
      agenda: ['Warm-up exercise', 'Character building', 'Writing time', 'Peer review'],
      materials: ['Notebook or laptop'],
      isMySession: false,
    },
    {
      id: 4,
      title: 'AP History: World War II Analysis',
      subject: 'History',
      level: 'Advanced',
      levelColor: '#B91C1C',
      host: 'Mr. David Kim',
      hostInitials: 'DK',
      time: '6:00 PM – 7:00 PM',
      capacity: { current: 14, max: 15 },
      tools: ['video', 'quiz'],
      status: 'almost-full',
      description: 'Analyze primary sources from WWII and discuss strategic turning points.',
      agenda: ['Source analysis', 'Group discussion', 'Timeline exercise', 'Quiz review'],
      materials: ['Document packet (provided)', 'AP History textbook'],
      isMySession: false,
    },
  ];

  const filteredSessions = viewMode === 'my'
    ? sessions.filter(s => s.isMySession)
    : sessions;

  const toolIcons: Record<string, typeof Video> = {
    video: Video,
    whiteboard: Monitor,
    quiz: FileText,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-[#111827]">Schedule</h1>
          <p className="text-sm text-[#4B5563] mt-0.5">Discover and join live tutoring sessions</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-[#111827] hover:bg-[#F5F5F7] transition-colors min-h-[44px] sm:w-auto w-full justify-center"
        >
          <Filter size={16} />
          Filters
        </button>
      </div>

      {/* Toggle & Day Selector */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        {/* View Toggle */}
        <div className="flex items-center gap-2 mb-4">
          <div className="inline-flex bg-[#F5F5F7] rounded-lg p-1">
            <button
              onClick={() => setViewMode('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all min-h-[36px] ${
                viewMode === 'all' ? 'bg-white text-[#111827] shadow-sm' : 'text-[#4B5563]'
              }`}
            >
              All Sessions
            </button>
            <button
              onClick={() => setViewMode('my')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all min-h-[36px] ${
                viewMode === 'my' ? 'bg-white text-[#111827] shadow-sm' : 'text-[#4B5563]'
              }`}
            >
              My Sessions
            </button>
          </div>
        </div>

        {/* Day Selector */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 -mx-1 px-1">
          <button className="p-2 rounded-lg text-[#4B5563] hover:bg-[#F5F5F7] shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center">
            <ChevronLeft size={18} />
          </button>
          {days.map((day, i) => (
            <button
              key={i}
              onClick={() => setSelectedDay(i)}
              className={`flex flex-col items-center px-3 py-2 rounded-xl min-w-[52px] min-h-[56px] transition-all ${
                selectedDay === i
                  ? 'bg-[#1D4ED8] text-white shadow-sm'
                  : 'text-[#4B5563] hover:bg-[#F5F5F7]'
              }`}
            >
              <span className="text-[10px] font-medium uppercase">{day.short}</span>
              <span className="text-lg font-bold">{day.date}</span>
            </button>
          ))}
          <button className="p-2 rounded-lg text-[#4B5563] hover:bg-[#F5F5F7] shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-white rounded-xl p-4 border border-gray-100 animate-scale-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm text-[#111827]">Filters</h3>
            <button onClick={() => setShowFilters(false)} className="p-1 text-[#4B5563] hover:text-[#111827] min-w-[44px] min-h-[44px] flex items-center justify-center">
              <X size={18} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-medium text-[#4B5563] block mb-1">Subject</label>
              <select className="w-full px-3 py-2.5 bg-[#F5F5F7] rounded-lg text-sm border border-transparent focus:border-[#1D4ED8] focus:outline-none min-h-[44px]">
                <option>All subjects</option>
                <option>Math</option>
                <option>Science</option>
                <option>English</option>
                <option>History</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-[#4B5563] block mb-1">Level</label>
              <select className="w-full px-3 py-2.5 bg-[#F5F5F7] rounded-lg text-sm border border-transparent focus:border-[#1D4ED8] focus:outline-none min-h-[44px]">
                <option>All levels</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-[#4B5563] block mb-1">Type</label>
              <select className="w-full px-3 py-2.5 bg-[#F5F5F7] rounded-lg text-sm border border-transparent focus:border-[#1D4ED8] focus:outline-none min-h-[44px]">
                <option>All types</option>
                <option>Tutoring</option>
                <option>Study Group</option>
                <option>Workshop</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-[#4B5563] block mb-1">Format</label>
              <select className="w-full px-3 py-2.5 bg-[#F5F5F7] rounded-lg text-sm border border-transparent focus:border-[#1D4ED8] focus:outline-none min-h-[44px]">
                <option>All formats</option>
                <option>Video</option>
                <option>Text-based</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Session Cards */}
      <div className="space-y-3">
        <p className="text-sm text-[#4B5563] font-medium">{days[selectedDay].full} · {filteredSessions.length} sessions</p>
        {filteredSessions.map(session => (
          <div key={session.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-4 lg:p-5">
              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                {/* Host avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6] flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {session.hostInitials}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                    <span className="inline-flex items-center px-2 py-0.5 bg-[#1D4ED8]/10 text-[#1D4ED8] rounded text-[10px] font-semibold">
                      {session.subject}
                    </span>
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold"
                      style={{ backgroundColor: session.levelColor + '15', color: session.levelColor }}
                    >
                      {session.level}
                    </span>
                    {session.isMySession && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#059669]/10 text-[#059669] rounded text-[10px] font-semibold">
                        <CheckCircle2 size={10} /> Enrolled
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-semibold text-[#111827]">{session.title}</h3>
                  <p className="text-sm text-[#4B5563] mt-0.5">{session.host}</p>

                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-[#4B5563]">
                    <span className="flex items-center gap-1">
                      <Clock size={13} /> {session.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={13} />
                      {session.capacity.current}/{session.capacity.max} spots
                      {session.status === 'almost-full' && (
                        <span className="text-[#D97706] font-medium flex items-center gap-0.5">
                          <AlertTriangle size={11} /> Almost full
                        </span>
                      )}
                    </span>
                    <span className="flex items-center gap-1.5">
                      {session.tools.map(tool => {
                        const ToolIcon = toolIcons[tool];
                        return ToolIcon ? <ToolIcon key={tool} size={13} className="text-[#4B5563]" /> : null;
                      })}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex sm:flex-col gap-2 sm:items-end shrink-0 mt-2 sm:mt-0">
                  {session.isMySession ? (
                    <button className="inline-flex items-center gap-2 bg-[#1D4ED8] text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-[#1E40AF] transition-colors min-h-[48px] shadow-sm">
                      <Video size={16} />
                      Join now
                    </button>
                  ) : (
                    <button className="inline-flex items-center gap-2 border-2 border-[#1D4ED8] text-[#1D4ED8] font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-[#1D4ED8]/5 transition-colors min-h-[48px]">
                      <MapPin size={16} />
                      Reserve spot
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedSession(selectedSession === session.id ? null : session.id)}
                    className="text-xs text-[#1D4ED8] font-medium underline min-h-[44px] flex items-center"
                  >
                    {selectedSession === session.id ? 'Hide details' : 'View details'}
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded detail drawer */}
            {selectedSession === session.id && (
              <div className="border-t border-gray-100 p-4 lg:p-5 bg-[#F5F5F7]/50 animate-scale-in">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-2">Description</h4>
                    <p className="text-sm text-[#111827]">{session.description}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-2">Agenda</h4>
                    <ol className="space-y-1">
                      {session.agenda.map((item, i) => (
                        <li key={i} className="text-sm text-[#111827] flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#1D4ED8]/10 text-[#1D4ED8] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                          {item}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-2">Materials Needed</h4>
                    <ul className="space-y-1">
                      {session.materials.map((mat, i) => (
                        <li key={i} className="text-sm text-[#111827] flex items-center gap-2">
                          <BookOpen size={12} className="text-[#4B5563]" />
                          {mat}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <button className="inline-flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-[#111827] hover:bg-[#F5F5F7] min-h-[36px]">
                        <Calendar size={12} /> Add to calendar
                      </button>
                      <button className="inline-flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-[#111827] hover:bg-[#F5F5F7] min-h-[36px]">
                        <Bell size={12} /> Set reminder
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
