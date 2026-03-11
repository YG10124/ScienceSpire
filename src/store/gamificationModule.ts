/* =========================================================
   Gamification Singleton Module
   – No React dependencies; safe to import from anywhere.
   – Persists to its own localStorage key.
   – Provides subscribe() so React contexts can re-render.
   ========================================================= */

const STORAGE_KEY = 'sciencespire-gamification-v1';

/* ─── Types ─────────────────────────────────────────────── */
export interface XPEvent {
  id: string;
  action: string;
  amount: number;
  ts: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  condition: string;
}

export interface GamificationData {
  xp: number;
  earnedBadgeIds: string[];
  lastLoginDate: string;
  loginStreak: number;
  xpEvents: XPEvent[];
  counters: {
    sessionsJoined: number;
    resourcesSaved: number;
    resourcesReviewed: number;
    communityPosts: number;
    quizzesCompleted: number;
    contentCreated: number;
    tracksJoined: string[];
  };
}

export interface DerivedState extends GamificationData {
  level: number;
  levelTitle: string;
  xpToNextLevel: number;
  xpProgress: number; // 0-1 within current level
}

/* ─── Level Data ─────────────────────────────────────────── */
export const LEVEL_THRESHOLDS: number[] = [
  0, 150, 350, 650, 1050, 1550, 2150, 2900, 3800, 4900,
  6200, 7500, 8800, 10100, 11400, 12700, 14000, 15300, 16600, 17900,
];

export const LEVEL_TITLES: string[] = [
  'Novice', 'Apprentice', 'Explorer', 'Scholar', 'Analyst',
  'Researcher', 'Theorist', 'Pioneer', 'Expert', 'Master',
  'Senior Novice', 'Senior Apprentice', 'Senior Explorer', 'Senior Scholar', 'Senior Analyst',
  'Senior Researcher', 'Senior Theorist', 'Senior Pioneer', 'Senior Expert', 'Grand Master',
];

/* ─── Badge Catalogue ────────────────────────────────────── */
export const ALL_BADGES: Badge[] = [
  { id: 'first_login',      name: 'First Steps',        description: 'Signed in for the first time',              icon: 'Star',          rarity: 'common',    condition: 'Sign in for the first time' },
  { id: 'first_session',    name: 'Session Starter',    description: 'Joined your first live session',            icon: 'Play',          rarity: 'common',    condition: 'Join 1 session' },
  { id: 'quiz_ace',         name: 'Quiz Ace',           description: 'Completed your first quiz',                 icon: 'Zap',           rarity: 'common',    condition: 'Complete 1 quiz' },
  { id: 'bookmarker',       name: 'Bookmarker',         description: 'Saved 5 resources to your collection',      icon: 'Bookmark',      rarity: 'common',    condition: 'Save 5 resources' },
  { id: 'reviewer',         name: 'Diligent Reader',    description: 'Marked 5 resources as reviewed',            icon: 'BookOpen',      rarity: 'common',    condition: 'Mark 5 resources reviewed' },
  { id: 'community_voice',  name: 'Community Voice',    description: 'Posted in the community for the first time', icon: 'MessageSquare', rarity: 'common',    condition: 'Post in community' },
  { id: 'content_creator',  name: 'Content Creator',    description: 'Published your first creation',             icon: 'Palette',       rarity: 'rare',      condition: 'Publish 1 creation' },
  { id: 'streak_3',         name: 'On Fire',            description: 'Logged in 3 days in a row',                icon: 'Flame',         rarity: 'rare',      condition: '3-day login streak' },
  { id: 'streak_7',         name: 'Unstoppable',        description: 'Logged in 7 days in a row',                icon: 'Trophy',        rarity: 'epic',      condition: '7-day login streak' },
  { id: 'quiz_master',      name: 'Quiz Master',        description: 'Completed 5 quizzes',                      icon: 'Award',         rarity: 'rare',      condition: 'Complete 5 quizzes' },
  { id: 'level_5',          name: 'Rising Star',        description: 'Reached Level 5',                          icon: 'Star',          rarity: 'rare',      condition: 'Reach level 5' },
  { id: 'level_10',         name: 'Science Scholar',    description: 'Reached Level 10',                         icon: 'GraduationCap', rarity: 'epic',      condition: 'Reach level 10' },
  { id: 'level_15',         name: 'Science Pioneer',    description: 'Reached Level 15',                         icon: 'Rocket',        rarity: 'epic',      condition: 'Reach level 15' },
  { id: 'level_20',         name: 'Grand Master',       description: 'Reached Level 20',                         icon: 'Crown',         rarity: 'legendary', condition: 'Reach level 20' },
  { id: 'all_tracks',       name: 'Polymath',           description: 'Joined a session in all 4 science tracks', icon: 'Layers',        rarity: 'epic',      condition: 'Join a session in all 4 tracks' },
  { id: 'session_10',       name: 'Session Veteran',    description: 'Joined 10 live sessions',                  icon: 'Calendar',      rarity: 'rare',      condition: 'Join 10 sessions' },
];

/* ─── Leaderboard ────────────────────────────────────────── */
export interface LeaderboardEntry {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  xp: number;
  level: number;
  levelTitle: string;
  specialization: 'Physics' | 'Chemistry' | 'Biology' | 'Earth Science';
  badgeCount: number;
  isCurrentUser?: boolean;
}

export const SEED_LEADERBOARD: Omit<LeaderboardEntry, 'level' | 'levelTitle'>[] = [
  { id: 'lb-1',  name: 'Priya Mehta',       initials: 'PM', avatarColor: '#7C3AED', xp: 8420, specialization: 'Physics',      badgeCount: 11 },
  { id: 'lb-2',  name: 'Alex Torres',       initials: 'AT', avatarColor: '#059669', xp: 7650, specialization: 'Chemistry',    badgeCount: 10 },
  { id: 'lb-3',  name: 'Sam Kim',           initials: 'SK', avatarColor: '#D97706', xp: 6980, specialization: 'Biology',      badgeCount: 9  },
  { id: 'lb-4',  name: 'Lena Walsh',        initials: 'LW', avatarColor: '#0369A1', xp: 5740, specialization: 'Earth Science', badgeCount: 8 },
  { id: 'lb-5',  name: 'Marcus Lee',        initials: 'ML', avatarColor: '#DC2626', xp: 4890, specialization: 'Physics',      badgeCount: 7  },
  { id: 'lb-6',  name: 'Elena Romero',      initials: 'ER', avatarColor: '#0891B2', xp: 4210, specialization: 'Chemistry',    badgeCount: 7  },
  { id: 'lb-7',  name: 'Noah Singh',        initials: 'NS', avatarColor: '#65A30D', xp: 3760, specialization: 'Biology',      badgeCount: 6  },
  { id: 'lb-8',  name: 'Maya Roberts',      initials: 'MR', avatarColor: '#9333EA', xp: 3120, specialization: 'Earth Science', badgeCount: 5 },
  { id: 'lb-9',  name: 'Chris Park',        initials: 'CP', avatarColor: '#EA580C', xp: 2580, specialization: 'Physics',      badgeCount: 5  },
  { id: 'lb-10', name: 'Taylor Nguyen',     initials: 'TN', avatarColor: '#1D4ED8', xp: 2140, specialization: 'Chemistry',    badgeCount: 4  },
  { id: 'lb-11', name: 'Jordan Okafor',     initials: 'JO', avatarColor: '#0D9488', xp: 1820, specialization: 'Biology',      badgeCount: 4  },
  { id: 'lb-12', name: 'Riley Chen',        initials: 'RC', avatarColor: '#BE185D', xp: 1450, specialization: 'Earth Science', badgeCount: 3 },
  { id: 'lb-13', name: 'Devon Patel',       initials: 'DP', avatarColor: '#B45309', xp: 1080, specialization: 'Physics',      badgeCount: 3  },
  { id: 'lb-14', name: 'Skylar Brown',      initials: 'SB', avatarColor: '#4338CA', xp: 680,  specialization: 'Chemistry',    badgeCount: 2  },
  { id: 'lb-15', name: 'River Johnson',     initials: 'RJ', avatarColor: '#047857', xp: 310,  specialization: 'Biology',      badgeCount: 1  },
];

/* ─── Helpers ────────────────────────────────────────────── */
export function computeLevel(xp: number): number {
  let level = 1;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) { level = i + 1; break; }
  }
  return Math.min(level, 20);
}

export function computeLevelTitle(level: number): string {
  return LEVEL_TITLES[Math.max(0, level - 1)] ?? 'Novice';
}

/* ─── Storage ────────────────────────────────────────────── */
function defaultData(): GamificationData {
  return {
    xp: 0,
    earnedBadgeIds: [],
    lastLoginDate: '',
    loginStreak: 0,
    xpEvents: [],
    counters: {
      sessionsJoined: 0,
      resourcesSaved: 0,
      resourcesReviewed: 0,
      communityPosts: 0,
      quizzesCompleted: 0,
      contentCreated: 0,
      tracksJoined: [],
    },
  };
}

function loadData(): GamificationData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData();
    const p = JSON.parse(raw);
    return {
      xp: p.xp ?? 0,
      earnedBadgeIds: p.earnedBadgeIds ?? [],
      lastLoginDate: p.lastLoginDate ?? '',
      loginStreak: p.loginStreak ?? 0,
      xpEvents: p.xpEvents ?? [],
      counters: {
        sessionsJoined:     p.counters?.sessionsJoined     ?? 0,
        resourcesSaved:     p.counters?.resourcesSaved     ?? 0,
        resourcesReviewed:  p.counters?.resourcesReviewed  ?? 0,
        communityPosts:     p.counters?.communityPosts      ?? 0,
        quizzesCompleted:   p.counters?.quizzesCompleted   ?? 0,
        contentCreated:     p.counters?.contentCreated     ?? 0,
        tracksJoined:       p.counters?.tracksJoined       ?? [],
      },
    };
  } catch {
    return defaultData();
  }
}

function saveData(data: GamificationData): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* quota */ }
}

/* ─── Subscriber Pattern ─────────────────────────────────── */
type Listener = () => void;
const stateListeners = new Set<Listener>();
const queueListeners = new Set<Listener>();

export function subscribe(listener: Listener): () => void {
  stateListeners.add(listener);
  return () => stateListeners.delete(listener);
}

export function subscribeQueues(listener: Listener): () => void {
  queueListeners.add(listener);
  return () => queueListeners.delete(listener);
}

function notifyState(): void { stateListeners.forEach(l => l()); }
function notifyQueues(): void { queueListeners.forEach(l => l()); }

/* ─── Toast & Badge Queues ───────────────────────────────── */
const pendingToasts: XPEvent[] = [];
const pendingBadges: Badge[] = [];

export function getPendingToast(): XPEvent | null { return pendingToasts[0] ?? null; }
export function consumePendingToast(): void { pendingToasts.shift(); notifyQueues(); }
export function getPendingBadge(): Badge | null { return pendingBadges[0] ?? null; }
export function consumePendingBadge(): void { pendingBadges.shift(); notifyQueues(); }

/* ─── Dedup Guard (React Strict Mode double-invocation) ──── */
let lastKey = '';
let lastTs = 0;

function dedupCheck(key: string): boolean {
  const now = Date.now();
  if (key === lastKey && now - lastTs < 250) return true; // duplicate
  lastKey = key;
  lastTs = now;
  return false;
}

/* ─── Badge Check Helper ─────────────────────────────────── */
function checkAndUnlock(
  state: GamificationData,
  id: string,
  condition: boolean,
  newBadgeIds: string[],
): void {
  if (condition && !state.earnedBadgeIds.includes(id)) {
    newBadgeIds.push(id);
    state.earnedBadgeIds.push(id);
  }
}

/* ─── Public API ─────────────────────────────────────────── */

/** Award XP for a named action and optionally pass subject for track-badge tracking. */
export function awardXP(action: string, amount: number, data?: { subject?: string }): void {
  if (dedupCheck(`xp:${action}:${amount}`)) return;

  const state = loadData();
  const newBadgeIds: string[] = [];

  // Add XP + event
  state.xp += amount;
  const event: XPEvent = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    action,
    amount,
    ts: Date.now(),
  };
  state.xpEvents = [event, ...state.xpEvents].slice(0, 20);

  // Update counters
  if (action === 'join_session') {
    state.counters.sessionsJoined++;
    if (data?.subject && !state.counters.tracksJoined.includes(data.subject)) {
      state.counters.tracksJoined = [...state.counters.tracksJoined, data.subject];
    }
  } else if (action === 'save_resource')   { state.counters.resourcesSaved++; }
  else if (action === 'mark_reviewed')     { state.counters.resourcesReviewed++; }
  else if (action === 'community_post')    { state.counters.communityPosts++; }
  else if (action === 'quiz_complete')     { state.counters.quizzesCompleted++; }
  else if (action === 'content_created')   { state.counters.contentCreated++; }

  const level = computeLevel(state.xp);

  // Check all badge conditions
  checkAndUnlock(state, 'first_session',   state.counters.sessionsJoined   >= 1,  newBadgeIds);
  checkAndUnlock(state, 'quiz_ace',        state.counters.quizzesCompleted >= 1,  newBadgeIds);
  checkAndUnlock(state, 'bookmarker',      state.counters.resourcesSaved   >= 5,  newBadgeIds);
  checkAndUnlock(state, 'reviewer',        state.counters.resourcesReviewed >= 5, newBadgeIds);
  checkAndUnlock(state, 'community_voice', state.counters.communityPosts   >= 1,  newBadgeIds);
  checkAndUnlock(state, 'content_creator', state.counters.contentCreated   >= 1,  newBadgeIds);
  checkAndUnlock(state, 'quiz_master',     state.counters.quizzesCompleted >= 5,  newBadgeIds);
  checkAndUnlock(state, 'level_5',         level >= 5,                            newBadgeIds);
  checkAndUnlock(state, 'level_10',        level >= 10,                           newBadgeIds);
  checkAndUnlock(state, 'level_15',        level >= 15,                           newBadgeIds);
  checkAndUnlock(state, 'level_20',        level >= 20,                           newBadgeIds);
  checkAndUnlock(state, 'all_tracks',      state.counters.tracksJoined.length >= 4, newBadgeIds);
  checkAndUnlock(state, 'session_10',      state.counters.sessionsJoined   >= 10, newBadgeIds);

  saveData(state);
  notifyState();

  // Queue toast + badges
  pendingToasts.push(event);
  for (const id of newBadgeIds) {
    const badge = ALL_BADGES.find(b => b.id === id);
    if (badge) pendingBadges.push(badge);
  }
  notifyQueues();
}

/** Call once when the user signs in; handles daily login XP + streak logic. */
export function processLogin(): void {
  if (dedupCheck('login:daily')) return;

  const state = loadData();
  const today = new Date().toISOString().split('T')[0];
  if (state.lastLoginDate === today) return; // already done today

  const yesterday = new Date(Date.now() - 86400_000).toISOString().split('T')[0];
  state.loginStreak = state.lastLoginDate === yesterday ? state.loginStreak + 1 : 1;
  state.lastLoginDate = today;

  state.xp += 10;
  const event: XPEvent = { id: `${Date.now()}-login`, action: 'daily_login', amount: 10, ts: Date.now() };
  state.xpEvents = [event, ...state.xpEvents].slice(0, 20);

  const newBadgeIds: string[] = [];
  checkAndUnlock(state, 'first_login', true, newBadgeIds);
  checkAndUnlock(state, 'streak_3', state.loginStreak >= 3, newBadgeIds);
  checkAndUnlock(state, 'streak_7', state.loginStreak >= 7, newBadgeIds);

  saveData(state);
  notifyState();

  pendingToasts.push(event);
  for (const id of newBadgeIds) {
    const badge = ALL_BADGES.find(b => b.id === id);
    if (badge) pendingBadges.push(badge);
  }
  notifyQueues();
}

/** Returns full derived state (level, title, progress). */
export function getState(): DerivedState {
  const state = loadData();
  const level = computeLevel(state.xp);
  const idx = Math.max(0, level - 1);
  const currentThreshold = LEVEL_THRESHOLDS[idx] ?? 0;
  const nextThreshold = LEVEL_THRESHOLDS[idx + 1] ?? (LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + 1300);
  const xpInLevel = state.xp - currentThreshold;
  const xpNeeded = nextThreshold - currentThreshold;
  return {
    ...state,
    level,
    levelTitle: computeLevelTitle(level),
    xpToNextLevel: Math.max(0, nextThreshold - state.xp),
    xpProgress: xpNeeded > 0 ? Math.min(1, xpInLevel / xpNeeded) : 1,
  };
}

/** Build leaderboard including the current user entry (uses their real XP). */
export function getLeaderboard(currentUserName?: string, currentUserInitials?: string): LeaderboardEntry[] {
  const userState = getState();
  const entries: LeaderboardEntry[] = SEED_LEADERBOARD.map(e => ({
    ...e,
    level: computeLevel(e.xp),
    levelTitle: computeLevelTitle(computeLevel(e.xp)),
  }));

  // Add real user
  const userEntry: LeaderboardEntry = {
    id: 'current-user',
    name: currentUserName || 'You',
    initials: currentUserInitials || 'YO',
    avatarColor: '#1D4ED8',
    xp: userState.xp,
    level: userState.level,
    levelTitle: userState.levelTitle,
    specialization: 'Physics',
    badgeCount: userState.earnedBadgeIds.length,
    isCurrentUser: true,
  };

  const all = [...entries, userEntry].sort((a, b) => b.xp - a.xp);
  return all;
}
