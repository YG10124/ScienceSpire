import { useEffect } from 'react';
import {
  Star, Play, Zap, Bookmark, BookOpen, MessageSquare, Palette,
  Flame, Trophy, Award, GraduationCap, Rocket, Crown, Layers, Calendar,
} from 'lucide-react';
import { useGamification } from '@/store/useGamificationStore';
import type { Badge } from '@/store/gamificationModule';

/* Map icon names → Lucide components */
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Star, Play, Zap, Bookmark, BookOpen, MessageSquare, Palette,
  Flame, Trophy, Award, GraduationCap, Rocket, Crown, Layers, Calendar,
};

const RARITY_STYLES: Record<Badge['rarity'], { border: string; glow: string; label: string; labelBg: string }> = {
  common:    { border: 'var(--border)',   glow: 'none',                              label: 'Common',    labelBg: 'var(--bg)' },
  rare:      { border: '#1D4ED8',         glow: '0 0 20px 4px rgba(29,78,216,0.35)', label: 'Rare',      labelBg: '#DBEAFE' },
  epic:      { border: '#7C3AED',         glow: '0 0 20px 4px rgba(124,58,237,0.4)', label: 'Epic',      labelBg: '#EDE9FE' },
  legendary: { border: '#D97706',         glow: '0 0 28px 6px rgba(217,119,6,0.5)',  label: 'Legendary', labelBg: '#FEF3C7' },
};

export default function BadgeUnlockModal() {
  const { pendingBadge, clearPendingBadge } = useGamification();

  // Close on Escape
  useEffect(() => {
    if (!pendingBadge) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') clearPendingBadge(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [pendingBadge, clearPendingBadge]);

  if (!pendingBadge) return null;

  const styles = RARITY_STYLES[pendingBadge.rarity];
  const IconComp = ICON_MAP[pendingBadge.icon] ?? Star;
  const iconColor = pendingBadge.rarity === 'legendary' ? '#D97706'
    : pendingBadge.rarity === 'epic'   ? '#7C3AED'
    : pendingBadge.rarity === 'rare'   ? '#1D4ED8'
    : 'var(--text-secondary)';

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Badge unlocked"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ backgroundColor: 'var(--surface-overlay)' }}
        onClick={clearPendingBadge}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div
        className="relative rounded-2xl p-8 max-w-sm w-full shadow-2xl border text-center animate-scale-in"
        style={{
          backgroundColor: 'var(--card)',
          borderColor: styles.border,
          boxShadow: styles.glow !== 'none' ? `${styles.glow}, 0 20px 60px rgba(0,0,0,0.3)` : '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--text-secondary)' }}>
          Badge Unlocked!
        </p>

        {/* Icon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4"
          style={{
            backgroundColor: `${iconColor}18`,
            borderColor: styles.border,
            boxShadow: styles.glow,
          }}
        >
          <IconComp size={36} className="shrink-0" style={{ color: iconColor } as React.CSSProperties} />
        </div>

        {/* Rarity badge */}
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mb-3"
          style={{ backgroundColor: styles.labelBg, color: iconColor }}
        >
          {styles.label}
        </span>

        <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] mt-1" style={{ color: 'var(--text)' }}>
          {pendingBadge.name}
        </h2>
        <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {pendingBadge.description}
        </p>

        <button
          onClick={clearPendingBadge}
          className="mt-6 w-full py-3 rounded-xl font-semibold text-sm min-h-[48px] transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--brand)', color: '#FFFFFF' }}
          autoFocus
        >
          Awesome!
        </button>
      </div>
    </div>
  );
}
