import { useEffect } from 'react';
import { useGamification } from '@/store/useGamificationStore';

const ACTION_LABELS: Record<string, string> = {
  join_session:   'Joined session',
  mark_reviewed:  'Resource reviewed',
  save_resource:  'Resource saved',
  quiz_complete:  'Quiz completed',
  community_post: 'Community post',
  content_created: 'Creation published',
  daily_login:    'Daily login bonus',
};

export default function XPToast() {
  const { pendingXPToast, clearXPToast } = useGamification();

  useEffect(() => {
    if (!pendingXPToast) return;
    const timer = setTimeout(clearXPToast, 2500);
    return () => clearTimeout(timer);
  }, [pendingXPToast, clearXPToast]);

  if (!pendingXPToast) return null;

  const { amount, action } = pendingXPToast;
  const label = ACTION_LABELS[action] ?? action;

  // Colour-code by amount
  let dotColor = 'var(--text-secondary)';
  if (amount >= 50) dotColor = 'var(--success)';
  else if (amount >= 20) dotColor = 'var(--brand)';

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 z-[200] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border animate-slide-up"
      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', minWidth: '220px' }}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm"
        style={{ backgroundColor: `${dotColor}20`, color: dotColor }}
      >
        +{amount}
      </div>
      <div>
        <div className="text-xs font-bold" style={{ color: dotColor }}>+{amount} XP</div>
        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</div>
      </div>
      <button
        onClick={clearXPToast}
        className="ml-auto p-1 rounded"
        style={{ color: 'var(--text-secondary)' }}
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
