import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { createElement } from 'react';
import {
  getState, subscribe, subscribeQueues,
  getPendingToast, consumePendingToast,
  getPendingBadge, consumePendingBadge,
  getLeaderboard,
  type DerivedState, type XPEvent, type Badge, type LeaderboardEntry,
} from './gamificationModule';

/* ─── Context Shape ──────────────────────────────────────── */
interface GamificationCtx extends DerivedState {
  pendingXPToast: XPEvent | null;
  clearXPToast: () => void;
  pendingBadge: Badge | null;
  clearPendingBadge: () => void;
  leaderboard: LeaderboardEntry[];
  myRank: number;
}

const GamificationContext = createContext<GamificationCtx | null>(null);

/* ─── Provider ───────────────────────────────────────────── */
export function GamificationProvider({
  children,
  currentUserName,
  currentUserInitials,
}: {
  children: ReactNode;
  currentUserName?: string;
  currentUserInitials?: string;
}) {
  const [derivedState, setDerivedState] = useState<DerivedState>(() => getState());
  const [pendingXPToast, setPendingXPToast] = useState<XPEvent | null>(() => getPendingToast());
  const [pendingBadge, setPendingBadge]   = useState<Badge | null>(() => getPendingBadge());

  // Re-sync from module whenever state changes
  useEffect(() => subscribe(() => setDerivedState(getState())), []);

  // Re-sync toast / badge queues
  useEffect(() => subscribeQueues(() => {
    setPendingXPToast(getPendingToast());
    setPendingBadge(getPendingBadge());
  }), []);

  const clearXPToast = useCallback(() => {
    consumePendingToast();
    setPendingXPToast(getPendingToast());
  }, []);

  const clearPendingBadge = useCallback(() => {
    consumePendingBadge();
    setPendingBadge(getPendingBadge());
  }, []);

  const leaderboard = getLeaderboard(currentUserName, currentUserInitials);
  const myEntry = leaderboard.find(e => e.isCurrentUser);
  const myRank = myEntry ? leaderboard.findIndex(e => e.isCurrentUser) + 1 : leaderboard.length;

  const value: GamificationCtx = {
    ...derivedState,
    pendingXPToast,
    clearXPToast,
    pendingBadge,
    clearPendingBadge,
    leaderboard,
    myRank,
  };

  return createElement(GamificationContext.Provider, { value }, children);
}

/* ─── Hook ───────────────────────────────────────────────── */
export function useGamification(): GamificationCtx {
  const ctx = useContext(GamificationContext);
  if (!ctx) throw new Error('useGamification must be used within GamificationProvider');
  return ctx;
}
