import { useEffect, useState } from 'react';
import {
  Play, BookOpen, Target, Flame, TrendingUp, ChevronRight,
  Clock, CheckCircle2, ArrowUpRight, BarChart3, Calendar,
  Star, ChevronDown, ChevronUp, Lightbulb
} from 'lucide-react';
import { useLocalStore } from '@/store/useLocalStore';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [showMoreProgress, setShowMoreProgress] = useState(false);
  const [showMoreActivity, setShowMoreActivity] = useState(false);
  const [animateActivity, setAnimateActivity] = useState(false);
  const { streak } = useLocalStore();

  useEffect(() => {
    const timer = setTimeout(() => setAnimateActivity(true), 120);
    return () => clearTimeout(timer);
  }, []);

  const courses = [
    { name: 'Physics Fundamentals', progress: 72, total: 24, completed: 17, color: 'var(--brand)' },
    { name: 'Biology 101', progress: 45, total: 20, completed: 9, color: 'var(--success)' },
    { name: 'Earth Science Systems', progress: 88, total: 16, completed: 14, color: 'var(--warning)' },
    { name: 'Environmental Science', progress: 31, total: 30, completed: 9, color: 'var(--info)' },
    { name: 'Chemistry Basics', progress: 60, total: 18, completed: 11, color: 'var(--purple)' },
  ];

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekActivity = [45, 30, 60, 25, 55, 40, 0];
  const maxActivity = Math.max(...weekActivity);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold font-[family-name:var(--font-display)]" style={{ color: 'var(--text)' }}>Dashboard</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>Track your progress and stay on course</p>
      </div>

      <div className="rounded-xl p-5 lg:p-6 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={18} style={{ color: 'var(--brand)' }} />
          <h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>Today</h2>
          <span className="text-xs ml-1" style={{ color: 'var(--text-secondary)' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button onClick={() => onNavigate('resources')} className="flex items-center gap-3 p-3 rounded-xl transition-colors text-left min-h-[48px] border" style={{ backgroundColor: 'var(--brand-bg)', borderColor: 'var(--border-light)' }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--brand-bg)' }}><Play size={18} style={{ color: 'var(--brand)' }} /></div>
            <div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Continue</div>
              <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Physics Ch. 7</div>
            </div>
          </button>
          <button onClick={() => onNavigate('schedule')} className="flex items-center gap-3 p-3 rounded-xl transition-colors text-left min-h-[48px] border" style={{ backgroundColor: 'var(--success-bg)', borderColor: 'var(--border-light)' }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--success-bg)' }}><Calendar size={18} style={{ color: 'var(--success)' }} /></div>
            <div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Next session</div>
              <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Bio Lab @ 2pm</div>
            </div>
          </button>
          <button onClick={() => onNavigate('resources')} className="flex items-center gap-3 p-3 rounded-xl transition-colors text-left min-h-[48px] border" style={{ backgroundColor: 'var(--warning-bg)', borderColor: 'var(--border-light)' }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--warning-bg)' }}><Target size={18} style={{ color: 'var(--warning)' }} /></div>
            <div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Mini-task</div>
              <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>5 vocab cards</div>
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl p-5 lg:p-6 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <h2 className="text-base font-bold flex items-center gap-2 mb-4" style={{ color: 'var(--text)' }}><BarChart3 size={18} style={{ color: 'var(--brand)' }} />Progress by Course</h2>
          <div className="space-y-4">
            {courses.slice(0, showMoreProgress ? courses.length : 3).map((course, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{course.name}</span>
                  <span className="text-xs font-semibold" style={{ color: course.color }}>{course.progress}%</span>
                </div>
                <div className="w-full rounded-full h-2" style={{ backgroundColor: 'var(--bg)' }}>
                  <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${course.progress}%`, backgroundColor: course.color }} />
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}><CheckCircle2 size={11} style={{ color: 'var(--success)' }} />{course.completed} of {course.total} lessons completed</div>
              </div>
            ))}
          </div>
          <button onClick={() => setShowMoreProgress(!showMoreProgress)} className="flex items-center gap-1 mt-4 text-sm font-medium min-h-[44px]" style={{ color: 'var(--brand)' }}>
            {showMoreProgress ? <><ChevronUp size={16} /> Show less</> : <><ChevronDown size={16} /> Show all courses</>}
          </button>
        </div>

        <div className="rounded-xl p-5 lg:p-6 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text)' }}><TrendingUp size={18} style={{ color: 'var(--success)' }} />Weekly Activity</h2>
            <span className="text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}><ArrowUpRight size={12} /> +12% vs last week</span>
          </div>

          <div className="flex items-end justify-between gap-2 h-32 mb-3">
            {weekDays.map((day, i) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-medium" style={{ color: 'var(--text-secondary)' }}>{weekActivity[i]}m</span>
                <div className="w-full rounded-t-md relative" style={{ height: '100%', backgroundColor: 'var(--bg)' }}>
                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-t-md transition-all duration-700"
                    style={{
                      height: `${animateActivity && maxActivity > 0 ? (weekActivity[i] / maxActivity) * 100 : 0}%`,
                      backgroundColor: i === 6 ? 'var(--border)' : 'var(--brand)',
                      opacity: i === 6 ? 0.5 : (0.5 + (weekActivity[i] / maxActivity) * 0.5),
                    }}
                  />
                </div>
                <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{day}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-3 border-t text-sm" style={{ borderColor: 'var(--border)' }}>
            <div><span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Total this week</span><div className="font-bold" style={{ color: 'var(--text)' }}>{weekActivity.reduce((a, b) => a + b, 0)} min</div></div>
            <div><span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Avg per day</span><div className="font-bold" style={{ color: 'var(--text)' }}>{Math.round(weekActivity.reduce((a, b) => a + b, 0) / 7)} min</div></div>
            <div><span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Items done</span><div className="font-bold" style={{ color: 'var(--text)' }}>14</div></div>
          </div>

          <button onClick={() => setShowMoreActivity(!showMoreActivity)} className="flex items-center gap-1 mt-3 text-sm font-medium min-h-[44px]" style={{ color: 'var(--brand)' }}>
            {showMoreActivity ? <><ChevronUp size={16} /> Less</> : <><ChevronDown size={16} /> More details</>}
          </button>
          {showMoreActivity && (
            <div className="mt-2 p-3 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-secondary)' }}>
              <p>You are studying more consistently than last month, up 15% in daily minutes.</p>
              <p className="mt-1">Your peak study time is 3-5 PM. Try scheduling sessions then.</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-xl p-5 lg:p-6 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <h2 className="text-base font-bold flex items-center gap-2 mb-4" style={{ color: 'var(--text)' }}><Flame size={18} style={{ color: 'var(--warning)' }} />Study Streak</h2>
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-3" style={{ background: 'linear-gradient(135deg, var(--warning-bg), transparent)' }}>
              <div className="text-3xl font-bold" style={{ color: 'var(--warning)' }}>{streak.count}</div>
            </div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{streak.count}-day streak!</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Your longest streak: 14 days</p>
          </div>
          <div className="flex justify-center gap-1.5 mb-3">
            {weekDays.map((day, i) => (
              <div key={day} className="flex flex-col items-center gap-1">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold" style={i < 6 ? { backgroundColor: 'var(--success)', color: '#FFFFFF' } : { backgroundColor: 'var(--bg)', color: 'var(--text-secondary)', border: '2px dashed var(--border)' }}>{i < 6 ? '?' : '?'}</div>
                <span className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>{day}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-center p-2 rounded-lg" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--text-secondary)' }}><CheckCircle2 size={12} className="inline mr-1" style={{ color: 'var(--success)' }} />Complete today's task to keep your streak.</p>
        </div>

        <div className="lg:col-span-2 rounded-xl p-5 lg:p-6 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <h2 className="text-base font-bold flex items-center gap-2 mb-4" style={{ color: 'var(--text)' }}><Lightbulb size={18} style={{ color: 'var(--info)' }} />Recommended for You</h2>
          <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>Based on your recent activity and goals</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { title: 'Kinematics Deep Dive', desc: 'Next in Physics - builds on Ch. 7', type: 'Lesson', time: '20 min', icon: BookOpen, color: 'var(--brand)', colorBg: 'var(--brand-bg)' },
              { title: 'Cell Division Quiz', desc: 'Test your Biology knowledge', type: 'Quiz', time: '10 min', icon: Target, color: 'var(--success)', colorBg: 'var(--success-bg)' },
              { title: 'Study Group: Physics', desc: '5 students online now', type: 'Live', time: 'Now', icon: Star, color: 'var(--warning)', colorBg: 'var(--warning-bg)' },
            ].map((rec, i) => (
              <button key={i} onClick={() => onNavigate('resources')} className="p-4 rounded-xl border transition-all hover:shadow-md text-left min-h-[48px]" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: rec.colorBg }}><rec.icon size={16} style={{ color: rec.color }} /></div><span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: rec.colorBg, color: rec.color }}>{rec.type}</span></div>
                <h4 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{rec.title}</h4>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{rec.desc}</p>
                <div className="flex items-center gap-1 mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}><Clock size={11} /> {rec.time}</div>
                <div className="flex items-center gap-1 mt-2 text-xs font-medium" style={{ color: 'var(--brand)' }}>Start <ChevronRight size={14} /></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
