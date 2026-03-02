import { useState } from 'react';
import {
  User, Mail, BookOpen, Calendar, Trophy,
  Flame, Target, Edit3, Shield, Bell,
  Globe, Moon, Sun, LogOut, CheckCircle2
} from 'lucide-react';
import { useTheme } from '@/store/useThemeStore';
import { useLocalStore } from '@/store/useLocalStore';

interface ProfileProps {
  onNavigate: (page: string) => void;
  onSignOut: () => void;
}

export default function Profile({ onNavigate, onSignOut }: ProfileProps) {
  const { themeMode, toggleTheme } = useTheme();
  const { currentUser, streak, addNotification } = useLocalStore();
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [focusMinutes, setFocusMinutes] = useState(0);
  const [focusActive, setFocusActive] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Simple focus timer
  const startFocusTimer = () => {
    setFocusActive(true);
    setFocusMinutes(25);
    showToast('⏱️ Focus timer started — 25 minutes!');
    addNotification('Focus timer started (25 min)');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Card */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="h-24" style={{ background: 'linear-gradient(135deg, var(--brand), var(--brand-light))' }} />
        <div className="px-5 pb-5 -mt-10">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6] flex items-center justify-center text-white text-2xl font-bold border-4 shadow-lg" style={{ borderColor: 'var(--card)' }}>
              {currentUser.displayName.split(' ').map(w => w[0]).join('')}
            </div>
            <div className="flex-1 mt-2 sm:mt-0">
              <h1 className="text-xl font-bold font-[family-name:var(--font-display)]" style={{ color: 'var(--text)' }}>{currentUser.displayName}</h1>
              <p className="text-sm flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}><Mail size={14} /> {currentUser.email}</p>
            </div>
            <button
              className="inline-flex items-center gap-2 border font-medium px-4 py-2.5 rounded-xl text-sm min-h-[44px]"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              onClick={() => showToast('✏️ Edit profile mode!')}
            >
              <Edit3 size={14} /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Courses', value: '5', icon: BookOpen, color: 'var(--brand)' },
          { label: 'Sessions', value: '23', icon: Calendar, color: 'var(--success)' },
          { label: 'Streak', value: `${streak.count} days`, icon: Flame, color: 'var(--warning)' },
          { label: 'Badges', value: '4', icon: Trophy, color: 'var(--purple)' },
        ].map((stat, i) => (
          <div key={i} className="rounded-xl p-4 border text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <stat.icon size={20} className="mx-auto mb-1" style={{ color: stat.color }} />
            <div className="text-lg font-bold" style={{ color: 'var(--text)' }}>{stat.value}</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Focus Timer */}
      <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <h2 className="text-base font-bold flex items-center gap-2 mb-3" style={{ color: 'var(--text)' }}>
          ⏱️ Focus Timer
        </h2>
        {focusActive ? (
          <div className="text-center py-4">
            <div className="text-3xl font-bold font-[family-name:var(--font-display)]" style={{ color: 'var(--brand)' }}>{focusMinutes}:00</div>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Stay focused! Timer is running.</p>
            <button onClick={() => { setFocusActive(false); showToast('⏹️ Timer stopped.'); }} className="mt-3 px-4 py-2 rounded-xl text-sm font-medium border min-h-[44px]" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>Stop Timer</button>
          </div>
        ) : (
          <button onClick={startFocusTimer} className="w-full px-4 py-3 rounded-xl text-sm font-semibold min-h-[48px]" style={{ backgroundColor: 'var(--brand)', color: '#FFFFFF' }}>
            Start 25-Min Focus Session
          </button>
        )}
      </div>

      {/* Badges */}
      <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <h2 className="text-base font-bold flex items-center gap-2 mb-4" style={{ color: 'var(--text)' }}>
          <Trophy size={18} style={{ color: 'var(--warning)' }} /> Badges Earned
        </h2>
        <div className="flex flex-wrap gap-3">
          {[
            { name: 'Quick Starter', emoji: '🚀', desc: 'Completed onboarding' },
            { name: '7-Day Streak', emoji: '🔥', desc: 'Studied 7 days in a row' },
            { name: 'Team Player', emoji: '🤝', desc: 'Joined 5 study groups' },
            { name: 'Creator', emoji: '✨', desc: 'Published a resource' },
          ].map((badge, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: 'var(--bg)' }}>
              <span className="text-lg">{badge.emoji}</span>
              <div>
                <div className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{badge.name}</div>
                <div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{badge.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Goals */}
      <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <h2 className="text-base font-bold flex items-center gap-2 mb-4" style={{ color: 'var(--text)' }}>
          <Target size={18} style={{ color: 'var(--success)' }} /> Current Goals
        </h2>
        <div className="space-y-3">
          {[
            { goal: 'Complete 3 lessons this week', progress: 66, current: 2, total: 3 },
            { goal: 'Study 30 minutes every day', progress: 85, current: 6, total: 7 },
            { goal: 'Finish algebra course', progress: 72, current: 17, total: 24 },
          ].map((item, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{item.goal}</span>
                <span className="text-xs font-semibold" style={{ color: 'var(--success)' }}>{item.current}/{item.total}</span>
              </div>
              <div className="w-full rounded-full h-2" style={{ backgroundColor: 'var(--bg)' }}>
                <div className="h-2 rounded-full transition-all" style={{ width: `${item.progress}%`, backgroundColor: 'var(--success)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <h2 className="text-base font-bold p-5 pb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
          <User size={18} style={{ color: 'var(--text-secondary)' }} /> Preferences
        </h2>
        {[
          { label: 'Notifications', desc: 'Session reminders, messages', icon: Bell, action: () => showToast('🔔 Notification preferences saved!') },
          { label: 'Privacy', desc: 'Profile visibility, sharing', icon: Shield, action: () => showToast('🛡️ Privacy settings updated!') },
          { label: 'Language', desc: 'English (US)', icon: Globe, action: () => showToast('🌐 Language options coming soon!') },
          { label: 'Appearance', desc: themeMode === 'light' ? 'Light mode' : 'Dark mode', icon: themeMode === 'light' ? Moon : Sun, action: toggleTheme },
        ].map((item, i) => (
          <button
            key={i}
            onClick={item.action}
            className="w-full flex items-center gap-3 px-5 py-3.5 transition-colors text-left border-t min-h-[48px]"
            style={{ borderColor: 'var(--border-light)' }}
          >
            <item.icon size={18} style={{ color: 'var(--text-secondary)' }} className="shrink-0" />
            <div className="flex-1">
              <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>{item.label}</div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.desc}</div>
            </div>
            <span style={{ color: 'var(--text-muted)' }}>›</span>
          </button>
        ))}

        {/* Sign Out */}
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-5 py-3.5 transition-colors text-left border-t min-h-[48px]"
          style={{ borderColor: 'var(--border-light)' }}
        >
          <LogOut size={18} style={{ color: 'var(--error)' }} className="shrink-0" />
          <div className="flex-1">
            <div className="text-sm font-medium" style={{ color: 'var(--error)' }}>Sign Out</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Log out of your account</div>
          </div>
        </button>
      </div>

      {toastMsg && (
        <div className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="px-5 py-3 rounded-xl shadow-lg text-sm font-medium" style={{ backgroundColor: 'var(--text)', color: 'var(--bg)' }}>{toastMsg}</div>
        </div>
      )}
    </div>
  );
}
