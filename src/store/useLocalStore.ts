import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { createElement } from 'react';
import { awardXP } from './gamificationModule';

/* ========== Types ========== */
export type ScienceSubject = 'Physics' | 'Chemistry' | 'Biology' | 'Earth Science';

export interface UserAccount {
    id: string;
    username: string;
    displayName: string;
    email: string;
    passwordHash: string; // simple base64 for MVP
    sciencePreferences: ScienceSubject[];
    level: string;
    joinedAt: string;
}

export interface UserProfile {
    id: string;
    username: string;
    displayName: string;
    email: string;
    preferences: { subjects: ScienceSubject[]; level: string };
}

export interface ProgressRecord {
    userId: string;
    resourceId: number;
    completed: boolean;
    score: number | null;
    lastVisited: string;
}

export interface SessionData {
    id: number;
    date: string; // YYYY-MM-DD
    time: string;
    title: string;
    subject: ScienceSubject;
    level: string;
    host: string;
    capacity: number;
    attendees: string[];
    description: string;
    agenda: string[];
    materials: string[];
}

export interface StreakData {
    count: number;
    lastDate: string;
}

export interface CommunityPost {
    id: string;
    channelId: string;
    authorId: string;
    authorName: string;
    content: string;
    timestamp: string;
    likes: number;
    likedBy: string[];
}

export interface LocalStore {
    accounts: UserAccount[];
    currentUser: UserProfile;
    isSignedIn: boolean;
    progress: ProgressRecord[];
    sessions: SessionData[];
    savedItems: string[];
    likedItems: string[];
    reviewedItems: string[];
    streak: StreakData;
    focusTimerActive: boolean;
    focusTimerSeconds: number;
    notifications: string[];
    joinedChannels: string[];
    communityPosts: CommunityPost[];
    authError: string | null;
}

interface LocalStoreContextValue extends LocalStore {
    setIsSignedIn: (v: boolean) => void;
    signUp: (username: string, email: string, password: string, prefs: ScienceSubject[], level: string) => { success: boolean; error?: string };
    signInWithCredentials: (email: string, password: string) => { success: boolean; error?: string };
    signOut: () => void;
    toggleSaved: (id: string) => void;
    toggleLiked: (id: string) => void;
    markReviewed: (id: string) => void;
    reserveSession: (sessionId: number) => void;
    leaveSession: (sessionId: number) => void;
    updateProgress: (resourceId: number, data: Partial<ProgressRecord>) => void;
    setFocusTimer: (active: boolean, seconds?: number) => void;
    addNotification: (msg: string) => void;
    clearNotification: (idx: number) => void;
    updateProfile: (data: Partial<UserProfile>) => void;
    joinChannel: (channelId: string) => void;
    leaveChannel: (channelId: string) => void;
    addPost: (channelId: string, content: string) => void;
    togglePostLike: (postId: string) => void;
}

/* ========== Helpers ========== */
const STORAGE_KEY = 'sciencespire-store-v2';

function simpleHash(s: string): string {
    return btoa(encodeURIComponent(s));
}

function loadFromStorage(): Partial<LocalStore> {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

function saveToStorage(state: LocalStore) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch { /* quota exceeded — silent fail */ }
}

/* ========== Science Sessions — spread across the week of 2026-03-02 ========== */
const scienceSessions: SessionData[] = [
    // Monday 2026-03-02
    {
        id: 1, date: '2026-03-02', time: '9:00 AM – 10:00 AM',
        title: "Newton's Laws in Action", subject: 'Physics', level: 'Intermediate',
        host: 'Dr. Aisha Patel', capacity: 12,
        attendees: ['user-2', 'user-3', 'user-4', 'user-5', 'user-6'],
        description: 'Explore all three of Newton\'s laws through real-world examples and interactive problem sets.',
        agenda: ['Review: forces and vectors', 'Demo: Newton\'s 1st & 2nd law', 'Problem sets', 'Q&A'],
        materials: ['Physics textbook Ch. 4', 'Graph paper'],
    },
    {
        id: 2, date: '2026-03-02', time: '2:00 PM – 3:30 PM',
        title: 'Periodic Table Deep Dive', subject: 'Chemistry', level: 'Beginner',
        host: 'Prof. Marcus Lee', capacity: 15,
        attendees: ['user-2', 'user-3', 'user-4', 'user-5', 'user-6', 'user-7', 'user-8'],
        description: 'Understand periodic trends — atomic radius, electronegativity, and ionization energy — with visual aids.',
        agenda: ['Intro: periodic table structure', 'Trends walkthrough', 'Group quiz', 'Wrap-up'],
        materials: ['Periodic table printout', 'Chemistry notes Ch. 3'],
    },
    // Tuesday 2026-03-03
    {
        id: 3, date: '2026-03-03', time: '10:00 AM – 11:30 AM',
        title: 'Cell Division: Mitosis & Meiosis', subject: 'Biology', level: 'Intermediate',
        host: 'Dr. Simone Rivers', capacity: 10,
        attendees: ['user-2', 'user-3', 'user-4', 'user-5'],
        description: 'Virtual lab exploring the stages of mitosis and meiosis with animated simulations.',
        agenda: ['Cell cycle overview', 'Mitosis stages', 'Meiosis & genetic diversity', 'Virtual lab activity'],
        materials: ['Biology lab notebook', 'Bio textbook Ch. 9'],
    },
    {
        id: 4, date: '2026-03-03', time: '3:00 PM – 4:30 PM',
        title: 'Plate Tectonics & Earthquakes', subject: 'Earth Science', level: 'Beginner',
        host: 'Ms. Elena Romero', capacity: 14,
        attendees: ['user-2', 'user-3', 'user-4', 'user-5', 'user-6', 'user-7', 'user-8', 'user-9'],
        description: 'Interactive session on tectonic plate movement, earthquake zones, and seismic waves.',
        agenda: ['Plate boundaries review', 'Earthquake fault types', 'Seismograph reading', 'Global map activity'],
        materials: ['Earth Science workbook', 'Colored pencils'],
    },
    // Wednesday 2026-03-04
    {
        id: 5, date: '2026-03-04', time: '11:00 AM – 12:00 PM',
        title: 'Electromagnetic Waves & Light', subject: 'Physics', level: 'Advanced',
        host: 'Dr. Aisha Patel', capacity: 12,
        attendees: ['user-2', 'user-3', 'user-4', 'user-5', 'user-6', 'user-7', 'user-8', 'user-9', 'user-10'],
        description: 'Deep dive into the electromagnetic spectrum, wave properties, and applications like lasers and MRI.',
        agenda: ['EM spectrum overview', 'Wave equations', 'Application demos', 'Problem solving'],
        materials: ['Physics textbook Ch. 11', 'Calculator'],
    },
    {
        id: 6, date: '2026-03-04', time: '4:00 PM – 5:00 PM',
        title: 'Acid-Base Reactions Lab', subject: 'Chemistry', level: 'Intermediate',
        host: 'Prof. Marcus Lee', capacity: 8,
        attendees: ['user-2', 'user-3', 'user-4'],
        description: 'Hands-on (virtual) lab: titration, pH indicators, and neutralization reactions.',
        agenda: ['Theory: pH scale', 'Virtual titration demo', 'Lab report walkthrough', 'Safety review'],
        materials: ['Lab safety guide', 'Chemistry Ch. 8'],
    },
    // Thursday 2026-03-05
    {
        id: 7, date: '2026-03-05', time: '9:00 AM – 10:30 AM',
        title: 'Genetics & Heredity: Punnett Squares', subject: 'Biology', level: 'Intermediate',
        host: 'Dr. Simone Rivers', capacity: 12,
        attendees: ['user-2', 'user-3', 'user-4', 'user-5', 'user-6'],
        description: 'Work through dominant/recessive traits, dihybrid crosses, and introduction to polygenic inheritance.',
        agenda: ['Review: DNA to traits', 'Punnett square practice', 'Dihybrid crosses', 'Real-world genetics case'],
        materials: ['Biology workbook', 'Textbook Ch. 10'],
    },
    {
        id: 8, date: '2026-03-05', time: '2:00 PM – 3:00 PM',
        title: 'Weather Systems & Climate', subject: 'Earth Science', level: 'All Levels',
        host: 'Ms. Elena Romero', capacity: 16,
        attendees: ['user-2', 'user-3'],
        description: 'Understand how pressure systems, fronts, and ocean currents drive global weather patterns.',
        agenda: ['Atmospheric pressure basics', 'Cold vs warm fronts', 'Ocean-climate connection', 'Case study: La Niña'],
        materials: ['Earth Science textbook', 'Weather map worksheet'],
    },
    // Friday 2026-03-06
    {
        id: 9, date: '2026-03-06', time: '10:00 AM – 11:00 AM',
        title: 'Quantum Mechanics: The Basics', subject: 'Physics', level: 'Advanced',
        host: 'Dr. Aisha Patel', capacity: 10,
        attendees: ['user-2', 'user-3', 'user-4', 'user-5', 'user-6', 'user-7', 'user-8', 'user-9'],
        description: 'Introduction to quantum states, wave-particle duality, and the uncertainty principle.',
        agenda: ['Classical vs quantum', 'Wave-particle duality', 'Heisenberg uncertainty', 'Applications'],
        materials: ['Supplementary handout (provided)', 'Calculator'],
    },
    {
        id: 10, date: '2026-03-06', time: '3:00 PM – 4:30 PM',
        title: 'Chemistry Olympiad Prep', subject: 'Chemistry', level: 'Advanced',
        host: 'Prof. Marcus Lee', capacity: 6,
        attendees: ['user-2', 'user-3', 'user-4'],
        description: 'Intensive prep for local and national chemistry olympiad competitions. Past paper walkthrough.',
        agenda: ['Past paper MCQ', 'Free response strategies', 'Stoichiometry speed round', 'Q&A'],
        materials: ['Past olympiad papers', 'Four-function calculator'],
    },
];

const guestUser: UserProfile = {
    id: 'guest',
    username: 'guest',
    displayName: 'Guest',
    email: '',
    preferences: { subjects: ['Physics', 'Chemistry', 'Biology', 'Earth Science'], level: 'High School' },
};

function createInitialState(): LocalStore {
    const saved = loadFromStorage();
    return {
        accounts: saved.accounts ?? [],
        currentUser: saved.currentUser ?? guestUser,
        isSignedIn: false, // always start unsigned-in; sign-in is per-session
        progress: saved.progress ?? [],
        sessions: scienceSessions, // always use fresh science sessions
        savedItems: saved.savedItems ?? [],
        likedItems: saved.likedItems ?? [],
        reviewedItems: saved.reviewedItems ?? [],
        streak: saved.streak ?? { count: 0, lastDate: new Date().toISOString().split('T')[0] },
        focusTimerActive: false,
        focusTimerSeconds: 0,
        notifications: saved.notifications ?? [],
        joinedChannels: saved.joinedChannels ?? [],
        communityPosts: saved.communityPosts ?? defaultPosts,
        authError: null,
    };
}

const defaultPosts: CommunityPost[] = [
    {
        id: 'p1', channelId: 'physics-help', authorId: 'user-2', authorName: 'Alex T.',
        content: "Can someone explain the difference between static and kinetic friction? I keep mixing them up in problem sets.",
        timestamp: '2026-03-01T08:30:00Z', likes: 4, likedBy: ['user-3', 'user-4', 'user-5', 'user-6'],
    },
    {
        id: 'p2', channelId: 'physics-help', authorId: 'user-3', authorName: 'Priya M.',
        content: "Static friction resists motion before it starts — it can vary up to a maximum. Kinetic is constant once sliding begins. Think of pushing a heavy box: static > kinetic!",
        timestamp: '2026-03-01T09:05:00Z', likes: 7, likedBy: ['user-2', 'user-4', 'user-5', 'user-6', 'user-7', 'user-8', 'user-9'],
    },
    {
        id: 'p3', channelId: 'chemistry-hw', authorId: 'user-4', authorName: 'Jamie R.',
        content: "Does anyone have a good mnemonic for remembering electronegativity trends on the periodic table?",
        timestamp: '2026-03-01T10:15:00Z', likes: 5, likedBy: ['user-2', 'user-3', 'user-5', 'user-6', 'user-7'],
    },
    {
        id: 'p4', channelId: 'chemistry-hw', authorId: 'user-5', authorName: 'Lena W.',
        content: "I use: 'FON Cl' — Fluorine, Oxygen, Nitrogen, Chlorine are the highest. And electronegativity increases right and up on the table.",
        timestamp: '2026-03-01T10:45:00Z', likes: 9, likedBy: [],
    },
    {
        id: 'p5', channelId: 'biology-projects', authorId: 'user-6', authorName: 'Sam K.',
        content: "Sharing my cell division project — I animated the mitosis stages in Figma! Happy to share the template with anyone.",
        timestamp: '2026-03-01T14:00:00Z', likes: 12, likedBy: [],
    },
    {
        id: 'p6', channelId: 'earth-science-lab', authorId: 'user-7', authorName: 'Taylor N.',
        content: "Just finished the plate tectonics virtual lab — the section on convergent vs. divergent boundaries really clicked for me. Highly recommend doing the bonus activity!",
        timestamp: '2026-03-02T07:20:00Z', likes: 3, likedBy: [],
    },
];

/* ========== Context ========== */
const LocalStoreContext = createContext<LocalStoreContextValue | null>(null);

export function LocalStoreProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<LocalStore>(createInitialState);

    const persist = useCallback((updater: (prev: LocalStore) => LocalStore) => {
        setState(prev => {
            const next = updater(prev);
            saveToStorage(next);
            return next;
        });
    }, []);

    const setIsSignedIn = useCallback((v: boolean) => {
        persist(s => ({ ...s, isSignedIn: v }));
    }, [persist]);

    const signUp = useCallback((username: string, email: string, password: string, prefs: ScienceSubject[], level: string) => {
        let result: { success: boolean; error?: string } = { success: false };
        persist(s => {
            if (s.accounts.find(a => a.email.toLowerCase() === email.toLowerCase())) {
                result = { success: false, error: 'An account with this email already exists.' };
                return s;
            }
            if (s.accounts.find(a => a.username.toLowerCase() === username.toLowerCase())) {
                result = { success: false, error: 'Username is already taken.' };
                return s;
            }
            const newAccount: UserAccount = {
                id: `user-${Date.now()}`,
                username,
                displayName: username,
                email,
                passwordHash: simpleHash(password),
                sciencePreferences: prefs,
                level,
                joinedAt: new Date().toISOString(),
            };
            const newProfile: UserProfile = {
                id: newAccount.id,
                username: newAccount.username,
                displayName: newAccount.displayName,
                email: newAccount.email,
                preferences: { subjects: prefs, level },
            };
            result = { success: true };
            return { ...s, accounts: [...s.accounts, newAccount], currentUser: newProfile, isSignedIn: true };
        });
        return result;
    }, [persist]);

    const signInWithCredentials = useCallback((email: string, password: string) => {
        let result: { success: boolean; error?: string } = { success: false };
        persist(s => {
            const account = s.accounts.find(a => a.email.toLowerCase() === email.toLowerCase());
            if (!account) {
                result = { success: false, error: 'No account found with this email.' };
                return s;
            }
            if (account.passwordHash !== simpleHash(password)) {
                result = { success: false, error: 'Incorrect password.' };
                return s;
            }
            const profile: UserProfile = {
                id: account.id,
                username: account.username,
                displayName: account.displayName,
                email: account.email,
                preferences: { subjects: account.sciencePreferences, level: account.level },
            };
            result = { success: true };
            return { ...s, currentUser: profile, isSignedIn: true };
        });
        return result;
    }, [persist]);

    const signOut = useCallback(() => {
        persist(s => ({ ...s, isSignedIn: false, currentUser: guestUser }));
    }, [persist]);

    const toggleSaved = useCallback((id: string) => {
        persist(s => {
            const isSaved = s.savedItems.includes(id);
            if (!isSaved) awardXP('save_resource', 5);
            return {
                ...s,
                savedItems: isSaved ? s.savedItems.filter(x => x !== id) : [...s.savedItems, id],
            };
        });
    }, [persist]);

    const toggleLiked = useCallback((id: string) => {
        persist(s => ({
            ...s,
            likedItems: s.likedItems.includes(id)
                ? s.likedItems.filter(x => x !== id)
                : [...s.likedItems, id],
        }));
    }, [persist]);

    const markReviewed = useCallback((id: string) => {
        persist(s => {
            if (s.reviewedItems.includes(id)) return s;
            awardXP('mark_reviewed', 20);
            return { ...s, reviewedItems: [...s.reviewedItems, id] };
        });
    }, [persist]);

    const reserveSession = useCallback((sessionId: number) => {
        persist(s => {
            const sess = s.sessions.find(t => t.id === sessionId);
            const canJoin = !!sess && !sess.attendees.includes(s.currentUser.id) && sess.attendees.length < sess.capacity;
            if (canJoin && sess) awardXP('join_session', 30, { subject: sess.subject });
            return {
                ...s,
                sessions: s.sessions.map(t =>
                    t.id === sessionId && !t.attendees.includes(s.currentUser.id) && t.attendees.length < t.capacity
                        ? { ...t, attendees: [...t.attendees, s.currentUser.id] }
                        : t
                ),
            };
        });
    }, [persist]);

    const leaveSession = useCallback((sessionId: number) => {
        persist(s => ({
            ...s,
            sessions: s.sessions.map(sess =>
                sess.id === sessionId
                    ? { ...sess, attendees: sess.attendees.filter(id => id !== s.currentUser.id) }
                    : sess
            ),
        }));
    }, [persist]);

    const updateProgress = useCallback((resourceId: number, data: Partial<ProgressRecord>) => {
        persist(s => {
            const existing = s.progress.findIndex(p => p.resourceId === resourceId && p.userId === s.currentUser.id);
            const newProgress = [...s.progress];
            if (existing >= 0) {
                newProgress[existing] = { ...newProgress[existing], ...data };
            } else {
                newProgress.push({ userId: s.currentUser.id, resourceId, completed: false, score: null, lastVisited: new Date().toISOString(), ...data });
            }
            return { ...s, progress: newProgress };
        });
    }, [persist]);

    const setFocusTimer = useCallback((active: boolean, seconds?: number) => {
        setState(s => ({ ...s, focusTimerActive: active, focusTimerSeconds: seconds ?? s.focusTimerSeconds }));
    }, []);

    const addNotification = useCallback((msg: string) => {
        persist(s => ({ ...s, notifications: [msg, ...s.notifications].slice(0, 20) }));
    }, [persist]);

    const clearNotification = useCallback((idx: number) => {
        persist(s => ({ ...s, notifications: s.notifications.filter((_, i) => i !== idx) }));
    }, [persist]);

    const updateProfile = useCallback((data: Partial<UserProfile>) => {
        persist(s => ({ ...s, currentUser: { ...s.currentUser, ...data } }));
    }, [persist]);

    const joinChannel = useCallback((channelId: string) => {
        persist(s => ({
            ...s,
            joinedChannels: s.joinedChannels.includes(channelId) ? s.joinedChannels : [...s.joinedChannels, channelId],
        }));
    }, [persist]);

    const leaveChannel = useCallback((channelId: string) => {
        persist(s => ({
            ...s,
            joinedChannels: s.joinedChannels.filter(id => id !== channelId),
        }));
    }, [persist]);

    const addPost = useCallback((channelId: string, content: string) => {
        persist(s => {
            awardXP('community_post', 15);
            return {
                ...s,
                communityPosts: [...s.communityPosts, {
                    id: `p${Date.now()}`,
                    channelId,
                    authorId: s.currentUser.id,
                    authorName: s.currentUser.displayName,
                    content,
                    timestamp: new Date().toISOString(),
                    likes: 0,
                    likedBy: [],
                }],
            };
        });
    }, [persist]);

    const togglePostLike = useCallback((postId: string) => {
        persist(s => ({
            ...s,
            communityPosts: s.communityPosts.map(p => {
                if (p.id !== postId) return p;
                const liked = p.likedBy.includes(s.currentUser.id);
                return {
                    ...p,
                    likes: liked ? p.likes - 1 : p.likes + 1,
                    likedBy: liked ? p.likedBy.filter(id => id !== s.currentUser.id) : [...p.likedBy, s.currentUser.id],
                };
            }),
        }));
    }, [persist]);

    const value: LocalStoreContextValue = {
        ...state,
        setIsSignedIn, signUp, signInWithCredentials, signOut,
        toggleSaved, toggleLiked, markReviewed,
        reserveSession, leaveSession,
        updateProgress, setFocusTimer,
        addNotification, clearNotification, updateProfile,
        joinChannel, leaveChannel, addPost, togglePostLike,
    };

    return createElement(LocalStoreContext.Provider, { value }, children);
}

export function useLocalStore(): LocalStoreContextValue {
    const ctx = useContext(LocalStoreContext);
    if (!ctx) throw new Error('useLocalStore must be used within a LocalStoreProvider');
    return ctx;
}
