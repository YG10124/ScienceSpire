import {
  ArrowRight, Play, Users, Target, BookOpen, Star,
  Clock, TrendingUp, ChevronRight, Sparkles, Zap, Trophy
} from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* ====== HERO GREETING ====== */}
      <div className="bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6] rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative">
          <p className="text-blue-100 text-sm font-medium">Good morning, Jane</p>
          <h1 className="text-2xl lg:text-3xl font-bold mt-1">Ready to learn something new?</h1>
          <p className="text-blue-100 mt-2 max-w-lg text-sm lg:text-base">
            You have 2 sessions today and 3 resources to review. Keep your 7-day streak going!
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <button
              onClick={() => onNavigate('schedule')}
              className="inline-flex items-center gap-2 bg-white text-[#1D4ED8] font-semibold px-5 py-3 rounded-xl text-sm hover:bg-blue-50 transition-colors min-h-[48px] shadow-sm"
            >
              <Play size={18} />
              Start learning now
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center gap-2 bg-white/15 text-white font-medium px-5 py-3 rounded-xl text-sm hover:bg-white/25 transition-colors min-h-[48px] border border-white/20"
            >
              View dashboard
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ====== QUICK ACTION TILES ====== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
        <button
          onClick={() => onNavigate('schedule')}
          className="bg-white rounded-xl p-4 lg:p-5 text-left hover:shadow-md transition-all border border-gray-100 group min-h-[48px]"
        >
          <div className="w-10 h-10 rounded-lg bg-[#1D4ED8]/10 flex items-center justify-center mb-3 group-hover:bg-[#1D4ED8]/20 transition-colors">
            <Play size={20} className="text-[#1D4ED8]" />
          </div>
          <h3 className="font-semibold text-[#111827] text-sm">Next Live Session</h3>
          <p className="text-[#4B5563] text-xs mt-1">Algebra Basics — in 45 min</p>
          <div className="flex items-center gap-1 mt-2 text-[#1D4ED8] text-xs font-medium">
            Join session <ChevronRight size={14} />
          </div>
        </button>

        <button
          onClick={() => onNavigate('dashboard')}
          className="bg-white rounded-xl p-4 lg:p-5 text-left hover:shadow-md transition-all border border-gray-100 group min-h-[48px]"
        >
          <div className="w-10 h-10 rounded-lg bg-[#059669]/10 flex items-center justify-center mb-3 group-hover:bg-[#059669]/20 transition-colors">
            <Target size={20} className="text-[#059669]" />
          </div>
          <h3 className="font-semibold text-[#111827] text-sm">Today's Tasks</h3>
          <p className="text-[#4B5563] text-xs mt-1">3 of 5 completed</p>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
            <div className="bg-[#059669] h-1.5 rounded-full" style={{ width: '60%' }} />
          </div>
        </button>

        <button
          onClick={() => onNavigate('community')}
          className="bg-white rounded-xl p-4 lg:p-5 text-left hover:shadow-md transition-all border border-gray-100 group min-h-[48px]"
        >
          <div className="w-10 h-10 rounded-lg bg-[#D97706]/10 flex items-center justify-center mb-3 group-hover:bg-[#D97706]/20 transition-colors">
            <Users size={20} className="text-[#D97706]" />
          </div>
          <h3 className="font-semibold text-[#111827] text-sm">Study Groups</h3>
          <p className="text-[#4B5563] text-xs mt-1">2 groups active now</p>
          <div className="flex items-center gap-1 mt-2 text-[#D97706] text-xs font-medium">
            Join a group <ChevronRight size={14} />
          </div>
        </button>
      </div>

      {/* ====== QUICK START STEPS ====== */}
      <div className="bg-white rounded-xl p-5 lg:p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#111827]">Quick Start</h2>
            <p className="text-sm text-[#4B5563]">Get the most out of ScienceSpire</p>
          </div>
          <button
            onClick={() => onNavigate('onboarding')}
            className="text-sm text-[#1D4ED8] font-medium underline hover:text-[#1E40AF] min-h-[44px] flex items-center"
          >
            Take full tour
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: Sparkles, title: 'Take onboarding', desc: 'Learn the platform basics', color: '#1D4ED8', page: 'onboarding' },
            { icon: Users, title: 'Join a group', desc: 'Study with classmates', color: '#059669', page: 'community' },
            { icon: Zap, title: 'Pick a challenge', desc: 'Test your skills', color: '#D97706', page: 'resources' },
          ].map((step, i) => (
            <button
              key={i}
              onClick={() => onNavigate(step.page)}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all text-left min-h-[48px]"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: step.color + '15' }}>
                <step.icon size={20} style={{ color: step.color }} />
              </div>
              <div>
                <div className="font-medium text-sm text-[#111827]">{step.title}</div>
                <div className="text-xs text-[#4B5563]">{step.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ====== DISCOVERY SECTIONS ====== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular This Week */}
        <div className="bg-white rounded-xl p-5 lg:p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-[#111827] flex items-center gap-2">
              <TrendingUp size={18} className="text-[#1D4ED8]" />
              Popular This Week
            </h2>
            <button onClick={() => onNavigate('resources')} className="text-xs text-[#1D4ED8] font-medium underline min-h-[44px] flex items-center">
              View all
            </button>
          </div>
          <div className="space-y-3">
            {[
              { title: 'Introduction to Calculus', type: 'Video', duration: '25 min', rating: 4.8, icon: Play, color: '#1D4ED8' },
              { title: 'Chemistry Lab Safety Quiz', type: 'Quiz', duration: '10 min', rating: 4.6, icon: Zap, color: '#059669' },
              { title: 'Essay Writing Fundamentals', type: 'PDF', duration: '15 min', rating: 4.7, icon: BookOpen, color: '#D97706' },
              { title: 'World History Timeline', type: 'Interactive', duration: '20 min', rating: 4.9, icon: Sparkles, color: '#0369A1' },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => onNavigate('resources')}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#F5F5F7] transition-colors text-left min-h-[48px]"
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: item.color + '12' }}>
                  <item.icon size={16} style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[#111827] truncate">{item.title}</div>
                  <div className="flex items-center gap-2 text-xs text-[#4B5563] mt-0.5">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-medium">{item.type}</span>
                    <span className="flex items-center gap-0.5"><Clock size={10} /> {item.duration}</span>
                    <span className="flex items-center gap-0.5"><Star size={10} className="fill-[#D97706] text-[#D97706]" /> {item.rating}</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-300 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Active Study Groups */}
        <div className="bg-white rounded-xl p-5 lg:p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-[#111827] flex items-center gap-2">
              <Users size={18} className="text-[#059669]" />
              Active Study Groups
            </h2>
            <button onClick={() => onNavigate('community')} className="text-xs text-[#1D4ED8] font-medium underline min-h-[44px] flex items-center">
              View all
            </button>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Algebra Study Group', members: 12, active: 5, subject: 'Math', status: 'Live now' },
              { name: 'Biology Lab Partners', members: 8, active: 3, subject: 'Science', status: '3 online' },
              { name: 'AP History Review', members: 15, active: 7, subject: 'History', status: 'Live now' },
              { name: 'Creative Writing Club', members: 10, active: 2, subject: 'English', status: '2 online' },
            ].map((group, i) => (
              <button
                key={i}
                onClick={() => onNavigate('community')}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#F5F5F7] transition-colors text-left min-h-[48px]"
              >
                <div className="w-9 h-9 rounded-lg bg-[#059669]/10 flex items-center justify-center shrink-0">
                  <Users size={16} className="text-[#059669]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[#111827]">{group.name}</div>
                  <div className="flex items-center gap-2 text-xs text-[#4B5563] mt-0.5">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-medium">{group.subject}</span>
                    <span>{group.members} members</span>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${
                  group.status === 'Live now'
                    ? 'bg-[#059669]/10 text-[#059669]'
                    : 'bg-gray-100 text-[#4B5563]'
                }`}>
                  {group.status === 'Live now' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#059669] mr-1 animate-pulse" />}
                  {group.status}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ====== STUDENT-MADE HIGHLIGHTS ====== */}
      <div className="bg-white rounded-xl p-5 lg:p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[#111827] flex items-center gap-2">
            <Trophy size={18} className="text-[#D97706]" />
            Student-Made Highlights
          </h2>
          <button onClick={() => onNavigate('creator')} className="text-xs text-[#1D4ED8] font-medium underline min-h-[44px] flex items-center">
            Create yours
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { title: 'Physics Formulas Cheat Sheet', author: 'Alex M.', type: 'Cheat Sheet', likes: 24, subject: 'Physics' },
            { title: 'Spanish Vocab Flashcards', author: 'Maria L.', type: 'Flashcards', likes: 18, subject: 'Language' },
            { title: 'How Photosynthesis Works', author: 'Chris K.', type: 'Explainer', likes: 31, subject: 'Biology' },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => onNavigate('resources')}
              className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all text-left min-h-[48px]"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center px-2 py-0.5 bg-[#D97706]/10 text-[#D97706] rounded text-[10px] font-semibold">{item.type}</span>
                <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-[#4B5563] rounded text-[10px] font-medium">{item.subject}</span>
              </div>
              <h4 className="text-sm font-semibold text-[#111827]">{item.title}</h4>
              <div className="flex items-center justify-between mt-2 text-xs text-[#4B5563]">
                <span>by {item.author}</span>
                <span className="flex items-center gap-1">
                  <Star size={12} className="fill-[#D97706] text-[#D97706]" />
                  {item.likes} likes
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
