import { useGamification } from '@/store/useGamificationStore';

interface LevelChipProps {
  /** compact=true shows only "Lv.7" with no XP bar */
  compact?: boolean;
}

export default function LevelChip({ compact = false }: LevelChipProps) {
  const { level, xp, xpProgress, xpToNextLevel } = useGamification();

  if (compact) {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
        style={{ backgroundColor: 'var(--brand-bg)', color: 'var(--brand)' }}
        aria-label={`Level ${level}`}
      >
        Lv.{level}
      </span>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
          style={{ backgroundColor: 'var(--brand-bg)', color: 'var(--brand)' }}
        >
          Lv.{level}
        </span>
        <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
          {xp.toLocaleString()} XP
        </span>
      </div>
      {/* XP progress bar */}
      <div
        className="w-full h-1.5 rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--bg)' }}
        role="progressbar"
        aria-valuenow={Math.round(xpProgress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${xpToNextLevel} XP to next level`}
      >
        <div
          className="h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${Math.round(xpProgress * 100)}%`, backgroundColor: 'var(--brand)' }}
        />
      </div>
    </div>
  );
}
