import { useEffect, useMemo, useState } from 'react';
import {
  User, LayoutDashboard, Video, MessageSquare, Target,
  ChevronRight, ChevronLeft, Check, Trophy, Sparkles, ArrowRight
} from 'lucide-react';
import { useLocalStore } from '@/store/useLocalStore';

interface OnboardingProps {
  onNavigate: (page: string) => void;
}

export default function Onboarding({ onNavigate }: OnboardingProps) {
  const { currentUser } = useLocalStore();
  const onboardingKey = `sciencespire-onboarding-complete-${currentUser.id}`;

  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<boolean[]>([false, false, false, false, false]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Physics']);
  const [selectedGoal, setSelectedGoal] = useState('Complete 3 lessons this week');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(onboardingKey) === 'true') {
      setCompleted([true, true, true, true, true]);
    }
  }, [onboardingKey]);

  const steps = useMemo(() => [
    {
      id: 'profile',
      title: 'Set Up Your Profile',
      description: 'Tell us a bit about yourself so we can personalize your science learning path.',
      icon: User,
      color: 'var(--brand)',
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1" style={{ color: 'var(--text)' }}>Display Name</label>
            <input type="text" defaultValue={currentUser.displayName || 'Scientist'} className="w-full px-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-2 min-h-[48px]" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', borderColor: 'var(--border)' }} />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1" style={{ color: 'var(--text)' }}>What science subjects interest you?</label>
            <div className="flex flex-wrap gap-2">
              {['Physics', 'Chemistry', 'Biology', 'Earth Science'].map(subject => {
                const active = selectedSubjects.includes(subject);
                return (
                  <button
                    key={subject}
                    onClick={() => setSelectedSubjects(prev => prev.includes(subject) ? prev.filter(x => x !== subject) : [...prev, subject])}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all min-h-[44px]"
                    style={{ borderColor: active ? 'var(--brand)' : 'var(--border)', color: active ? 'var(--brand)' : 'var(--text)', backgroundColor: active ? 'var(--brand-bg)' : 'transparent' }}
                  >
                    {subject}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1" style={{ color: 'var(--text)' }}>Your grade/level</label>
            <select className="w-full px-4 py-3 rounded-xl text-sm border focus:outline-none min-h-[48px]" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', borderColor: 'var(--border)' }}>
              <option>Select your level</option>
              <option>Middle School</option>
              <option>High School</option>
              <option>College</option>
              <option>Adult Learner</option>
            </select>
          </div>
        </div>
      ),
    },
    {
      id: 'dashboard',
      title: 'Explore Your Dashboard',
      description: 'Your dashboard shows progress, streak, and recommendations.',
      icon: LayoutDashboard,
      color: 'var(--success)',
      content: (
        <div className="space-y-4">
          <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg)' }}>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[{ v: '72%', l: 'Progress' }, { v: '7', l: 'Day Streak' }, { v: '14', l: 'Items Done' }].map((item, idx) => (
                <div key={idx} className="rounded-lg p-3" style={{ backgroundColor: 'var(--card)' }}>
                  <div className="text-2xl font-bold" style={{ color: 'var(--brand)' }}>{item.v}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{item.l}</div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => onNavigate('dashboard')} className="w-full inline-flex items-center justify-center gap-2 border-2 font-semibold px-4 py-3 rounded-xl text-sm min-h-[48px]" style={{ borderColor: 'var(--brand)', color: 'var(--brand)' }}>
            <LayoutDashboard size={16} /> Open dashboard
          </button>
        </div>
      ),
    },
    {
      id: 'session',
      title: 'Join a Session',
      description: 'Live science sessions connect you with tutors and peers.',
      icon: Video,
      color: 'var(--warning)',
      content: (
        <div className="space-y-4">
          <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg)' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: 'var(--brand-bg)', color: 'var(--brand)' }}>SC</div>
              <div>
                <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Physics Fundamentals</div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Dr. Sarah Chen - 10:00 AM</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <span className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: 'var(--card)' }}>Physics</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: 'var(--card)' }}>Intermediate</span>
              <span>8/12 spots</span>
            </div>
          </div>
          <button onClick={() => onNavigate('schedule')} className="w-full inline-flex items-center justify-center gap-2 border-2 font-semibold px-4 py-3 rounded-xl text-sm min-h-[48px]" style={{ borderColor: 'var(--warning)', color: 'var(--warning)' }}>
            <Video size={16} /> Open schedule
          </button>
        </div>
      ),
    },
    {
      id: 'question',
      title: 'Post a Question',
      description: 'Ask science questions and get help from peers.',
      icon: MessageSquare,
      color: 'var(--info)',
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1" style={{ color: 'var(--text)' }}>Try posting a sample question</label>
            <textarea placeholder="e.g., Why does static friction exceed kinetic friction in many systems?" className="w-full px-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-2 min-h-[80px] resize-y" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', borderColor: 'var(--border)' }} />
          </div>
          <button onClick={() => onNavigate('community')} className="w-full inline-flex items-center justify-center gap-2 border-2 font-semibold px-4 py-3 rounded-xl text-sm min-h-[48px]" style={{ borderColor: 'var(--info)', color: 'var(--info)' }}>
            <MessageSquare size={16} /> Open community
          </button>
        </div>
      ),
    },
    {
      id: 'goal',
      title: 'Set Your First Goal',
      description: 'Set a small science learning goal for this week.',
      icon: Target,
      color: 'var(--purple)',
      content: (
        <div className="space-y-4">
          <label className="text-sm font-medium block mb-2" style={{ color: 'var(--text)' }}>Choose a goal</label>
          <div className="space-y-2">
            {[
              'Complete 3 lessons this week',
              'Study 30 minutes every day',
              'Join 2 science sessions',
              'Finish a quiz with 80%+',
            ].map((goal) => {
              const active = selectedGoal === goal;
              return (
                <button key={goal} onClick={() => setSelectedGoal(goal)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left text-sm font-medium transition-all min-h-[48px]" style={{ borderColor: active ? 'var(--purple)' : 'var(--border)', color: 'var(--text)', backgroundColor: active ? 'var(--info-bg)' : 'transparent' }}>
                  <Target size={18} style={{ color: 'var(--purple)' }} className="shrink-0" />
                  {goal}
                </button>
              );
            })}
          </div>
        </div>
      ),
    },
  ], [currentUser.displayName, onNavigate, selectedGoal, selectedSubjects]);

  const handleComplete = () => {
    const next = [...completed];
    next[currentStep] = true;
    setCompleted(next);

    const done = next.every(Boolean);
    if (done && typeof window !== 'undefined') {
      localStorage.setItem(onboardingKey, 'true');
    }

    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const allDone = completed.every(Boolean);
  const completedCount = completed.filter(Boolean).length;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-3" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}>
          <Sparkles size={14} /> Getting Started
        </div>
        <h1 className="text-xl lg:text-2xl font-bold" style={{ color: 'var(--text)' }}>Welcome to ScienceSpire!</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Complete these quick steps to personalize your science workspace.</p>
      </div>

      <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>Progress</span>
          <span className="text-sm font-bold" style={{ color: 'var(--brand)' }}>{completedCount}/{steps.length}</span>
        </div>
        <div className="w-full rounded-full h-2.5" style={{ backgroundColor: 'var(--bg)' }}>
          <div className="h-2.5 rounded-full transition-all duration-500" style={{ width: `${(completedCount / steps.length) * 100}%`, backgroundColor: 'var(--brand)' }} />
        </div>
        <div className="flex justify-between mt-3">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <button key={step.id} onClick={() => setCurrentStep(i)} className={`flex flex-col items-center gap-1 transition-all ${currentStep === i ? 'scale-110' : ''}`}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all" style={{ backgroundColor: completed[i] ? 'var(--success)' : currentStep === i ? 'var(--brand)' : 'var(--bg)', color: completed[i] || currentStep === i ? '#FFFFFF' : 'var(--text-secondary)' }}>
                  {completed[i] ? <Check size={14} /> : <Icon size={14} />}
                </div>
                <span className="text-[9px] font-medium hidden sm:block" style={{ color: currentStep === i ? 'var(--brand)' : 'var(--text-secondary)' }}>{step.title.split(' ').slice(0, 2).join(' ')}</span>
              </button>
            );
          })}
        </div>
      </div>

      {allDone ? (
        <div className="rounded-2xl p-8 text-white text-center" style={{ background: 'linear-gradient(135deg, var(--success), var(--brand-light))' }}>
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4"><Trophy size={36} /></div>
          <h2 className="text-2xl font-bold">You did it!</h2>
          <p className="mt-2 max-w-sm mx-auto" style={{ color: '#D1FAE5' }}>You completed onboarding and unlocked the Quick Starter badge.</p>
          <div className="mt-6">
            <button onClick={() => onNavigate('home')} className="inline-flex items-center gap-2 bg-white font-bold px-6 py-3.5 rounded-xl text-sm min-h-[48px] shadow-lg" style={{ color: 'var(--success)' }}>
              Go to Home <ArrowRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="p-5 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${steps[currentStep].color}22` }}>
                {(() => { const Icon = steps[currentStep].icon; return <Icon size={20} style={{ color: steps[currentStep].color }} />; })()}
              </div>
              <div>
                <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Step {currentStep + 1} of {steps.length}</div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>{steps[currentStep].title}</h2>
              </div>
            </div>
            <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>{steps[currentStep].description}</p>
          </div>

          <div className="p-5">{steps[currentStep].content}</div>

          <div className="p-5 border-t flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
            <button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium min-h-[44px] border" style={{ borderColor: currentStep === 0 ? 'var(--border-light)' : 'var(--border)', color: currentStep === 0 ? 'var(--text-muted)' : 'var(--text-secondary)' }}>
              <ChevronLeft size={16} /> Previous
            </button>
            <button onClick={handleComplete} className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl text-sm min-h-[48px] shadow-sm" style={{ backgroundColor: 'var(--brand)', color: '#FFFFFF' }}>
              {completed[currentStep] ? 'Next' : 'Complete & Continue'} <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
