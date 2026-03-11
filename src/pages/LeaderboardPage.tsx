import { useState } from 'react';
import { Trophy, Medal, Award, Star } from 'lucide-react';
import { useGamification } from '@/store/useGamificationStore';
import { ALL_BADGES, type LeaderboardEntry } from '@/store/gamificationModule';
import type { BreadcrumbItem } from '@/config/site';

type SubjectFilter = 'Overall' | 'Physics' | 'Chemistry' | 'Biology' | 'Earth Science';
const FILTERS: SubjectFilter[] = ['Overall', 'Physics', 'Chemistry', 'Biology', 'Earth Science'];

interface LeaderboardPageProps {
  onNavigate?: (page: string) => void;
  onBreadcrumbChange?: (items: BreadcrumbItem[]) => void;
}

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Trophy size={18} style={{ color: '#D97706' }} aria-label="1st place" />;
  if (rank === 2) return <Medal size={18} style={{ color: '#9CA3AF' }} aria-label="2nd place" />;
  if (rank === 3) return <Medal size={18} style={{ color: '#B45309' }} aria-label="3rd place" />;
  return <span className="text-sm font-bold w-5 text-center" style={{ color: 'var(--text-secondary)' }}>{rank}</span>;
}

function XPBar({ xp, maxXP }: { xp: number; maxXP: number }) {
  const pct = maxXP > 0 ? Math.min(100, (xp / maxXP) * 100) : 0;
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div
        className="flex-1 h-1.5 rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--bg)', minWidth: 60 }}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: 'var(--brand)' }} />
      </div>
      <span className="text-xs shrink-0" style={{ color: 'var(--text-secondary)' }}>
        {xp.toLocaleString()} XP
      </span>
    </div>
  );
}

function LeaderboardRow({ entry, rank, maxXP }: { entry: LeaderboardEntry; rank: number; maxXP: number }) {
  const borderStyle = entry.isCurrentUser
    ? { border: '2px solid var(--brand)', backgroundColor: 'var(--brand-bg)' }
    : { border: '1px solid transparent' };

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
      style={{ ...borderStyle }}
      aria-current={entry.isCurrentUser ? 'true' : undefined}
    >
      {/* Rank */}
      <div className="w-6 flex items-center justify-center shrink-0">
        <RankIcon rank={rank} />
      </div>

      {/* Avatar */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
        style={{ backgroundColor: entry.avatarColor }}
        aria-hidden="true"
      >
        {entry.initials}
      </div>

      {/* Name + level */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>
            {entry.name}
            {entry.isCurrentUser && <span className="ml-1 text-[10px] font-medium" style={{ color: 'var(--brand)' }}>(you)</span>}
          </span>
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
            style={{ backgroundColor: 'var(--brand-bg)', color: 'var(--brand)' }}
          >
            Lv.{entry.level}
          </span>
        </div>
        <div className="mt-1 hidden sm:block">
          <XPBar xp={entry.xp} maxXP={maxXP} />
        </div>
      </div>

      {/* Subject tag */}
      <span
        className="text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 hidden md:inline-flex"
        style={{ backgroundColor: 'var(--bg)', color: 'var(--text-secondary)' }}
      >
        {entry.specialization}
      </span>

      {/* Badge count */}
      <div className="flex items-center gap-1 shrink-0">
        <Award size={14} style={{ color: 'var(--warning)' }} />
        <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{entry.badgeCount}</span>
      </div>
    </div>
  );
}

export default function LeaderboardPage({ onNavigate, onBreadcrumbChange: _ }: LeaderboardPageProps) {
  const [activeFilter, setActiveFilter] = useState<SubjectFilter>('Overall');
  const { leaderboard, myRank, level, levelTitle, xp, earnedBadgeIds } = useGamification();

  const filtered: LeaderboardEntry[] = activeFilter === 'Overall'
    ? leaderboard
    : leaderboard.filter(e => e.isCurrentUser || e.specialization === activeFilter);

  const maxXP = filtered[0]?.xp ?? 1;

  // Find the next unearned badge
  const nextBadge = ALL_BADGES.find(b => !earnedBadgeIds.includes(b.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: 'var(--warning-bg)' }}
        >
          <Trophy size={22} style={{ color: 'var(--warning)' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]" style={{ color: 'var(--text)' }}>
            Leaderboard
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            See how you rank among ScienceSpire students
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main table */}
        <div className="lg:col-span-2 space-y-4">
          {/* Subject filter tabs */}
          <div
            className="flex gap-1 p-1 rounded-xl overflow-x-auto"
            style={{ backgroundColor: 'var(--bg)' }}
            role="tablist"
            aria-label="Filter leaderboard by subject"
          >
            {FILTERS.map(f => (
              <button
                key={f}
                role="tab"
                aria-selected={activeFilter === f}
                onClick={() => setActiveFilter(f)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all min-h-[36px]"
                style={{
                  backgroundColor: activeFilter === f ? 'var(--card)' : 'transparent',
                  color: activeFilter === f ? 'var(--brand)' : 'var(--text-secondary)',
                  boxShadow: activeFilter === f ? '0 1px 3px rgba(0,0,0,.08)' : 'none',
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Rows */}
          <div
            className="rounded-xl border overflow-hidden divide-y"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderBottom: 'none' }}
          >
            {filtered.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                No students in this category yet.
              </div>
            ) : (
              filtered.map((entry, idx) => (
                <div key={entry.id} style={{ borderColor: 'var(--border-light)' }}>
                  <LeaderboardRow entry={entry} rank={idx + 1} maxXP={maxXP} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right panel — Your Stats */}
        <div className="space-y-4">
          <div
            className="rounded-xl border p-5"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <h2 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <Star size={16} style={{ color: 'var(--warning)' }} />
              Your Stats
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Global Rank</span>
                <span className="font-bold text-lg" style={{ color: 'var(--brand)' }}>#{myRank}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Level</span>
                <span className="font-semibold" style={{ color: 'var(--text)' }}>{level} — {levelTitle}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total XP</span>
                <span className="font-semibold" style={{ color: 'var(--text)' }}>{xp.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Badges Earned</span>
                <span className="font-semibold" style={{ color: 'var(--text)' }}>{earnedBadgeIds.length}</span>
              </div>
            </div>
          </div>

          {/* Next badge to unlock */}
          {nextBadge && (
            <div
              className="rounded-xl border p-5"
              style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--text)' }}>
                Next Badge
              </h2>
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: 'var(--bg)', border: '1px dashed var(--border)' }}
                >
                  <Award size={18} style={{ color: 'var(--text-secondary)' }} />
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{nextBadge.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{nextBadge.condition}</div>
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold mt-1.5 capitalize"
                    style={{ backgroundColor: 'var(--bg)', color: 'var(--text-secondary)' }}
                  >
                    {nextBadge.rarity}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* All badges */}
          <div
            className="rounded-xl border p-5"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--text)' }}>
              All Badges ({earnedBadgeIds.length}/{ALL_BADGES.length})
            </h2>
            <div className="grid grid-cols-4 gap-2">
              {ALL_BADGES.map(badge => {
                const earned = earnedBadgeIds.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    title={`${badge.name}${earned ? ' ✓' : ` — ${badge.condition}`}`}
                    className="w-full aspect-square rounded-lg flex items-center justify-center transition-all"
                    style={{
                      backgroundColor: earned ? 'var(--brand-bg)' : 'var(--bg)',
                      opacity: earned ? 1 : 0.4,
                      border: earned ? '1px solid var(--brand)' : '1px solid var(--border)',
                    }}
                    aria-label={`${badge.name}: ${earned ? 'earned' : 'locked'}`}
                  >
                    <Award
                      size={16}
                      style={{ color: earned ? 'var(--brand)' : 'var(--text-secondary)' }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {onNavigate && (
            <button
              onClick={() => onNavigate('home')}
              className="w-full py-3 rounded-xl text-sm font-medium border min-h-[48px]"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              ← Back to dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
