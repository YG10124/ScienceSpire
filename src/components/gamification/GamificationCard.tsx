import { ChevronRight, Award } from 'lucide-react';
import { useGamification } from '@/store/useGamificationStore';
import { ALL_BADGES } from '@/store/gamificationModule';

interface GamificationCardProps {
  onNavigate: (page: string) => void;
}

export default function GamificationCard({ onNavigate }: GamificationCardProps) {
  const { level, levelTitle, xp, xpToNextLevel, xpProgress, earnedBadgeIds, myRank } = useGamification();

  const recentBadges = earnedBadgeIds
    .slice(-3)
    .map(id => ALL_BADGES.find(b => b.id === id))
    .filter(Boolean);

  const RARITY_COLORS: Record<string, string> = {
    common: 'var(--text-secondary)',
    rare: '#1D4ED8',
    epic: '#7C3AED',
    legendary: '#D97706',
  };

  return (
    <div
      className="rounded-xl border p-5 animate-fade-in"
      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', animationDelay: '60ms' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'var(--brand-bg)', color: 'var(--brand)' }}
            >
              Level {level}
            </span>
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              {levelTitle}
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold font-[family-name:var(--font-display)]" style={{ color: 'var(--text)' }}>
              {xp.toLocaleString()}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>XP</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Your rank</div>
          <div className="text-xl font-bold" style={{ color: 'var(--brand)' }}>#{myRank}</div>
        </div>
      </div>

      {/* XP Bar */}
      <div className="mb-4">
        <div
          className="w-full h-2 rounded-full overflow-hidden"
          style={{ backgroundColor: 'var(--bg)' }}
          role="progressbar"
          aria-valuenow={Math.round(xpProgress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${xpToNextLevel} XP to next level`}
        >
          <div
            className="h-2 rounded-full transition-all duration-700"
            style={{ width: `${Math.round(xpProgress * 100)}%`, backgroundColor: 'var(--brand)' }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
            {xp.toLocaleString()} XP
          </span>
          <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
            {xpToNextLevel > 0 ? `${xpToNextLevel} XP to next level` : 'Max level!'}
          </span>
        </div>
      </div>

      {/* Recent Badges */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {recentBadges.length > 0 ? (
            <>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Recent:</span>
              <div className="flex gap-1.5">
                {recentBadges.map(badge => badge && (
                  <span
                    key={badge.id}
                    title={badge.name}
                    className="inline-flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-bold"
                    style={{
                      backgroundColor: `${RARITY_COLORS[badge.rarity]}18`,
                      color: RARITY_COLORS[badge.rarity],
                      border: `1px solid ${RARITY_COLORS[badge.rarity]}40`,
                    }}
                  >
                    <Award size={14} />
                  </span>
                ))}
              </div>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {earnedBadgeIds.length} badge{earnedBadgeIds.length !== 1 ? 's' : ''}
              </span>
            </>
          ) : (
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              No badges yet — start earning!
            </span>
          )}
        </div>

        <button
          onClick={() => onNavigate('leaderboard')}
          className="inline-flex items-center gap-1 text-xs font-medium min-h-[32px]"
          style={{ color: 'var(--brand)' }}
        >
          Leaderboard <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}
