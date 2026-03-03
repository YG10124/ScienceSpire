import {
  ArrowRight, Play, Users, Target, BookOpen, Star,
  Clock, TrendingUp, ChevronRight, Sparkles, Zap, Trophy
} from 'lucide-react';
import { useLocalStore } from '@/store/useLocalStore';
import GamificationCard from '@/components/gamification/GamificationCard';

interface HomeDashboardProps {
  onNavigate: (page: string) => void;
}

export default function HomeDashboard({ onNavigate }: HomeDashboardProps) {
  const { streak, currentUser } = useLocalStore();
  const firstName = (currentUser.displayName || currentUser.username || 'Scientist').split(' ')[0];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* ====== HERO GREETING ====== */}
      <div className="rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden animate-fade-in" style={{ background: 'linear-gradient(135deg, var(--brand), var(--brand-light))' }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative">
          <p className="text-blue-100 text-sm font-medium">Good morning, {firstName}</p>
          <h1 className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-display)] mt-1">Ready to learn something new?</h1>
          <p className="text-blue-100 mt-2 max-w-lg text-sm lg:text-base">
            You have 2 sessions today and 3 resources to review. Keep your {streak.count}-day streak going!
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <button
              onClick={() => onNavigate('schedule')}
              className="inline-flex items-center gap-2 font-semibold px-5 py-3 rounded-xl text-sm transition-colors min-h-[48px] shadow-sm"
              style={{ backgroundColor: '#FFFFFF', color: 'var(--brand)' }}
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

      {/* ====== GAMIFICATION CARD ====== */}
      <GamificationCard onNavigate={onNavigate} />

      {/* ====== QUICK ACTION TILES ====== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
        <button
          onClick={() => onNavigate('schedule')}
          className="rounded-xl p-4 lg:p-5 text-left hover:shadow-md hover:-translate-y-0.5 transition-all border group min-h-[48px] animate-fade-in"
          style={{ animationDelay: '80ms', backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors" style={{ backgroundColor: 'var(--brand-bg)' }}>
            <Play size={20} style={{ color: 'var(--brand)' }} />
          </div>
          <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Next Live Session</h3>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Physics Lab — in 45 min</p>
          <div className="flex items-center gap-1 mt-2 text-xs font-medium" style={{ color: 'var(--brand)' }}>
            Join session <ChevronRight size={14} />
          </div>
        </button>

        <button
          onClick={() => onNavigate('dashboard')}
          className="rounded-xl p-4 lg:p-5 text-left hover:shadow-md hover:-translate-y-0.5 transition-all border group min-h-[48px] animate-fade-in"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', animationDelay: '140ms' }}
        >
          <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors" style={{ backgroundColor: 'var(--success-bg)' }}>
            <Target size={20} style={{ color: 'var(--success)' }} />
          </div>
          <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Today's Tasks</h3>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>3 of 5 completed</p>
          <div className="w-full rounded-full h-1.5 mt-2" style={{ backgroundColor: 'var(--bg)' }}>
            <div className="h-1.5 rounded-full" style={{ width: '60%', backgroundColor: 'var(--success)' }} />
          </div>
        </button>

        <button
          onClick={() => onNavigate('community')}
          className="rounded-xl p-4 lg:p-5 text-left hover:shadow-md hover:-translate-y-0.5 transition-all border group min-h-[48px] animate-fade-in"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', animationDelay: '200ms' }}
        >
          <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors" style={{ backgroundColor: 'var(--warning-bg)' }}>
            <Users size={20} style={{ color: 'var(--warning)' }} />
          </div>
          <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Study Groups</h3>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>2 groups active now</p>
          <div className="flex items-center gap-1 mt-2 text-xs font-medium" style={{ color: 'var(--warning)' }}>
            Join a group <ChevronRight size={14} />
          </div>
        </button>
      </div>

      {/* ====== QUICK START STEPS ====== */}
      <div className="rounded-xl p-5 lg:p-6 border animate-fade-in" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', animationDelay: '260ms' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold font-[family-name:var(--font-display)]" style={{ color: 'var(--text)' }}>Quick Start</h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Get the most out of ScienceSpire</p>
          </div>
          <button
            onClick={() => onNavigate('onboarding')}
            className="text-sm font-medium underline min-h-[44px] flex items-center"
            style={{ color: 'var(--brand)' }}
          >
            Take full tour
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: Sparkles, title: 'Take onboarding', desc: 'Learn the platform basics', color: 'var(--brand)', colorBg: 'var(--brand-bg)', page: 'onboarding' },
            { icon: Users, title: 'Join a group', desc: 'Study with classmates', color: 'var(--success)', colorBg: 'var(--success-bg)', page: 'community' },
            { icon: Zap, title: 'Pick a challenge', desc: 'Test your skills', color: 'var(--warning)', colorBg: 'var(--warning-bg)', page: 'resources' },
          ].map((step, i) => (
            <button
              key={i}
              onClick={() => onNavigate(step.page)}
              className="flex items-center gap-3 p-3 rounded-lg border transition-all hover:shadow-sm hover:-translate-y-0.5 text-left min-h-[48px]"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: step.colorBg }}>
                <step.icon size={20} style={{ color: step.color }} />
              </div>
              <div>
                <div className="font-medium text-sm" style={{ color: 'var(--text)' }}>{step.title}</div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{step.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ====== DISCOVERY SECTIONS ====== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: '320ms' }}>
        {/* Popular This Week */}
        <div className="rounded-xl p-5 lg:p-6 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <TrendingUp size={18} style={{ color: 'var(--brand)' }} />
              Popular This Week
            </h2>
            <button onClick={() => onNavigate('resources')} className="text-xs font-medium underline min-h-[44px] flex items-center" style={{ color: 'var(--brand)' }}>
              View all
            </button>
          </div>
          <div className="space-y-3">
            {[
              { title: 'Introduction to Astrophysics', type: 'Video', duration: '25 min', rating: 4.8, icon: Play, color: 'var(--brand)' },
              { title: 'Chemistry Lab Safety Quiz', type: 'Quiz', duration: '10 min', rating: 4.6, icon: Zap, color: 'var(--success)' },
              { title: 'Cell Biology Revision Notes', type: 'PDF', duration: '15 min', rating: 4.7, icon: BookOpen, color: 'var(--warning)' },
              { title: 'Plate Tectonics Explorer', type: 'Interactive', duration: '20 min', rating: 4.9, icon: Sparkles, color: 'var(--info)' },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => onNavigate('resources')}
                className="w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left min-h-[48px]"
                style={{ color: 'var(--text)' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--bg)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--brand-bg)' }}>
                  <item.icon size={16} style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{item.title}</div>
                  <div className="flex items-center gap-2 text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: 'var(--bg)' }}>{item.type}</span>
                    <span className="flex items-center gap-0.5"><Clock size={10} /> {item.duration}</span>
                    <span className="flex items-center gap-0.5"><Star size={10} className="fill-[#D97706] text-[#D97706]" /> {item.rating}</span>
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} className="shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Active Study Groups */}
        <div className="rounded-xl p-5 lg:p-6 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <Users size={18} style={{ color: 'var(--success)' }} />
              Active Study Groups
            </h2>
            <button onClick={() => onNavigate('community')} className="text-xs font-medium underline min-h-[44px] flex items-center" style={{ color: 'var(--brand)' }}>
              View all
            </button>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Physics Problem Solvers', members: 12, active: 5, subject: 'Physics', status: 'Live now' },
              { name: 'Biology Lab Partners', members: 8, active: 3, subject: 'Science', status: '3 online' },
              { name: 'Chemistry Reaction Review', members: 15, active: 7, subject: 'Chemistry', status: 'Live now' },
              { name: 'Earth Science Field Notes', members: 10, active: 2, subject: 'Earth Science', status: '2 online' },
            ].map((group, i) => (
              <button
                key={i}
                onClick={() => onNavigate('community')}
                className="w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left min-h-[48px]"
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--bg)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--success-bg)' }}>
                  <Users size={16} style={{ color: 'var(--success)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>{group.name}</div>
                  <div className="flex items-center gap-2 text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: 'var(--bg)' }}>{group.subject}</span>
                    <span>{group.members} members</span>
                  </div>
                </div>
                <span
                  className="text-xs font-medium px-2 py-1 rounded-full shrink-0"
                  style={{
                    backgroundColor: group.status === 'Live now' ? 'var(--success-bg)' : 'var(--bg)',
                    color: group.status === 'Live now' ? 'var(--success)' : 'var(--text-secondary)',
                  }}
                >
                  {group.status === 'Live now' && <span className="inline-block w-1.5 h-1.5 rounded-full mr-1 animate-pulse" style={{ backgroundColor: 'var(--success)' }} />}
                  {group.status}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ====== STUDENT-MADE HIGHLIGHTS ====== */}
      <div className="rounded-xl p-5 lg:p-6 border animate-fade-in" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', animationDelay: '380ms' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <Trophy size={18} style={{ color: 'var(--warning)' }} />
            Student-Made Highlights
          </h2>
          <button onClick={() => onNavigate('creator')} className="text-xs font-medium underline min-h-[44px] flex items-center" style={{ color: 'var(--brand)' }}>
            Create yours
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { title: 'Physics Formulas Cheat Sheet', author: 'Alex M.', type: 'Cheat Sheet', likes: 24, subject: 'Physics' },
            { title: 'Organic Chemistry Flashcards', author: 'Maria L.', type: 'Flashcards', likes: 18, subject: 'Chemistry' },
            { title: 'How Photosynthesis Works', author: 'Chris K.', type: 'Explainer', likes: 31, subject: 'Biology' },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => onNavigate('resources')}
              className="p-4 rounded-lg border transition-all hover:shadow-sm text-left min-h-[48px]"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold" style={{ backgroundColor: 'var(--warning-bg)', color: 'var(--warning)' }}>{item.type}</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-secondary)' }}>{item.subject}</span>
              </div>
              <h4 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{item.title}</h4>
              <div className="flex items-center justify-between mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
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
