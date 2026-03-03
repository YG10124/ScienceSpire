import { useEffect, useRef, useState } from 'react';
import {
    MessageSquare, Hash, Users, HelpCircle,
    CheckCircle2, Clock, ChevronRight, Plus, ThumbsUp,
    ArrowLeft, Send, Award, TrendingUp, UserCheck, UserPlus,
} from 'lucide-react';
import { useLocalStore } from '@/store/useLocalStore';
import type { BreadcrumbItem } from '@/config/site';

interface CommunityPageProps {
    onBreadcrumbChange?: (items: BreadcrumbItem[]) => void;
}

interface Reply {
    author: string;
    initials: string;
    text: string;
    time: string;
    isBest: boolean;
    likes: number;
}

interface Question {
    id: number;
    title: string;
    subject: string;
    author: string;
    authorInitials: string;
    time: string;
    replies: number;
    solved: boolean;
    views: number;
    bestAnswer: string | null;
    allReplies: Reply[];
}

interface ChannelMsg {
    author: string;
    initials: string;
    text: string;
    time: string;
    isOwn?: boolean;
}

const CHANNELS = [
    { id: 'general', name: 'general', description: 'General science discussion and announcements', members: 234 },
    { id: 'physics-help', name: 'physics-help', description: 'Get help with physics problem sets', members: 89 },
    { id: 'chemistry-lab', name: 'chemistry-lab', description: 'Chemistry experiments and lab work', members: 67 },
    { id: 'earth-science', name: 'earth-science', description: 'Weather, geology, and climate discussion', members: 156 },
];

const GROUPS = [
    { name: 'Physics Study Group', members: 12, subject: 'Physics', nextMeeting: 'Today, 3 PM' },
    { name: 'Biology Lab Partners', members: 8, subject: 'Biology', nextMeeting: 'Tomorrow, 2 PM' },
    { name: 'Organic Chemistry Review', members: 15, subject: 'Chemistry', nextMeeting: 'Today, 5 PM' },
    { name: 'Earth Science Explorers', members: 10, subject: 'Earth Science', nextMeeting: 'Friday, 4 PM' },
];

const SEED_CHANNEL_MSGS: Record<string, ChannelMsg[]> = {
    general: [
        { author: 'Admin', initials: 'AD', text: 'Welcome to #general! Post announcements and general science discussion here.', time: '2 days ago' },
        { author: 'Alex T.', initials: 'AT', text: "Anyone joining the Physics session tomorrow? Newton's Laws at 9 AM looks great!", time: '1 day ago' },
        { author: 'Priya M.', initials: 'PM', text: 'Yes! Are we covering the problem sets from chapter 4?', time: '1 day ago' },
        { author: 'Jordan R.', initials: 'JR', text: 'Just shared my Cell Division presentation in #biology-projects if anyone wants to check it out.', time: '20 hours ago' },
        { author: 'Sam K.', initials: 'SK', text: "Great week everyone! Don't forget the Chemistry Olympiad Prep session Friday.", time: '2 hours ago' },
    ],
    'physics-help': [
        { author: 'Alex T.', initials: 'AT', text: 'Can someone explain the difference between static and kinetic friction? I keep mixing them up.', time: '1 day ago' },
        { author: 'Priya M.', initials: 'PM', text: 'Static friction resists motion before it starts — it can vary up to a maximum. Kinetic is constant once sliding begins. Think of pushing a heavy box!', time: '1 day ago' },
        { author: 'Sam K.', initials: 'SK', text: 'How do I set up free-body diagrams for inclined plane problems?', time: '8 hours ago' },
        { author: 'Taylor N.', initials: 'TN', text: 'Decompose weight into components parallel and perpendicular to the slope. Normal force = perpendicular component.', time: '7 hours ago' },
        { author: 'Dr. Aisha', initials: 'DA', text: 'Great answers! Remember: always label every force with its source object.', time: '6 hours ago' },
    ],
    'chemistry-lab': [
        { author: 'Jamie R.', initials: 'JR', text: 'Does anyone have a mnemonic for electronegativity trends on the periodic table?', time: '2 days ago' },
        { author: 'Lena W.', initials: 'LW', text: '"FON Cl" — Fluorine, Oxygen, Nitrogen, Chlorine are highest. Increases right and up the table.', time: '2 days ago' },
        { author: 'Prof. Marcus', initials: 'PM', text: 'Great tip! Electronegativity and ionization energy trend the same way.', time: '1 day ago' },
        { author: 'Jamie R.', initials: 'JR', text: 'The virtual titration lab was really useful today. The pH curve finally makes sense!', time: '5 hours ago' },
    ],
    'earth-science': [
        { author: 'Taylor N.', initials: 'TN', text: 'Just finished the plate tectonics virtual lab — convergent vs. divergent boundaries really clicked!', time: '1 day ago' },
        { author: 'Alex T.', initials: 'AT', text: 'The bonus activity was worth it. Helped me visualize seafloor spreading.', time: '22 hours ago' },
        { author: 'Ms. Elena', initials: 'ME', text: 'Reminder: Weather Systems & Climate session is Thursday at 2 PM. Bring your weather map worksheet!', time: '5 hours ago' },
        { author: 'Jordan R.', initials: 'JR', text: 'Is the worksheet the one with the cold/warm front symbols?', time: '3 hours ago' },
        { author: 'Ms. Elena', initials: 'ME', text: 'Yes, exactly that one!', time: '2 hours ago' },
    ],
};

const INITIAL_QUESTIONS: Question[] = [
    {
        id: 1, title: 'How do I calculate acceleration from a force diagram?', subject: 'Physics',
        author: 'Alex M.', authorInitials: 'AM', time: '2 hours ago', replies: 2, solved: true, views: 34,
        bestAnswer: 'Use F = ma. First find net force from the diagram, then divide by mass to get acceleration.',
        allReplies: [
            { author: 'Dr. Chen', initials: 'DC', text: 'Draw all forces, sum them vectorially for net force, then apply a = F_net / m.', time: '1 hour ago', isBest: true, likes: 8 },
            { author: 'Maria L.', initials: 'ML', text: "Dr. Chen's explanation is great! I'd also label units throughout.", time: '45 min ago', isBest: false, likes: 3 },
        ],
    },
    {
        id: 2, title: "What's the difference between mitosis and meiosis?", subject: 'Biology',
        author: 'Sarah J.', authorInitials: 'SJ', time: '5 hours ago', replies: 1, solved: true, views: 67,
        bestAnswer: 'Mitosis produces 2 identical daughter cells. Meiosis produces 4 unique gametes.',
        allReplies: [
            { author: 'Prof. Park', initials: 'PP', text: 'Mitosis = growth/repair (2 identical cells). Meiosis = reproduction (4 unique gametes with half the chromosomes).', time: '4 hours ago', isBest: true, likes: 12 },
        ],
    },
    {
        id: 3, title: 'Any mnemonic for periodic trends in chemistry?', subject: 'Chemistry',
        author: 'Jordan R.', authorInitials: 'JR', time: '1 day ago', replies: 1, solved: false, views: 28,
        bestAnswer: null,
        allReplies: [
            { author: 'Emily W.', initials: 'EW', text: 'Remember: electronegativity and ionization energy increase up and to the right.', time: '20 hours ago', isBest: false, likes: 5 },
        ],
    },
    {
        id: 4, title: 'How to calculate acceleration from a velocity-time graph?', subject: 'Physics',
        author: 'Kim P.', authorInitials: 'KP', time: '3 days ago', replies: 0, solved: true, views: 89,
        bestAnswer: 'Acceleration = slope = Δv/Δt',
        allReplies: [],
    },
];

export default function CommunityPage({ onBreadcrumbChange }: CommunityPageProps) {
    const { likedItems, toggleLiked, addNotification, currentUser } = useLocalStore();
    const [activeTab, setActiveTab] = useState<'channels' | 'questions' | 'groups'>('questions');
    const [selectedThread, setSelectedThread] = useState<number | null>(null);
    const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [channelInput, setChannelInput] = useState('');
    const [toastMsg, setToastMsg] = useState<string | null>(null);
    const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
    const [channelMessages, setChannelMessages] = useState<Record<string, ChannelMsg[]>>(SEED_CHANNEL_MSGS);
    const [joinedGroups, setJoinedGroups] = useState<Set<string>>(new Set());
    const [showAskForm, setShowAskForm] = useState(false);
    const [askTitle, setAskTitle] = useState('');
    const [askSubject, setAskSubject] = useState('Physics');
    const msgsEndRef = useRef<HTMLDivElement>(null);

    const userInitials = (currentUser.displayName || 'Me').slice(0, 2).toUpperCase();

    const showToast = (msg: string) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 3000);
    };

    useEffect(() => {
        if (!onBreadcrumbChange) return;
        if (selectedChannel !== null) {
            const ch = CHANNELS.find(c => c.id === selectedChannel);
            onBreadcrumbChange(ch ? [{ label: 'Channels' }, { label: `#${ch.name}` }] : []);
            return;
        }
        if (selectedThread !== null) {
            const thread = questions.find(q => q.id === selectedThread);
            if (!thread) { onBreadcrumbChange([]); return; }
            onBreadcrumbChange([{ label: thread.subject }, { label: thread.title }]);
            return;
        }
        onBreadcrumbChange([]);
    }, [onBreadcrumbChange, selectedThread, selectedChannel, questions]);

    useEffect(() => {
        msgsEndRef.current?.scrollIntoView({ behavior: 'instant' });
    }, [selectedChannel]);

    useEffect(() => {
        if (selectedChannel) {
            msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [channelMessages, selectedChannel]);

    const postReply = () => {
        if (!replyText.trim() || selectedThread === null) return;
        const newReply: Reply = {
            author: currentUser.displayName || 'You',
            initials: userInitials,
            text: replyText.trim(),
            time: 'just now',
            isBest: false,
            likes: 0,
        };
        setQuestions(prev => prev.map(q =>
            q.id === selectedThread
                ? { ...q, allReplies: [...q.allReplies, newReply], replies: q.replies + 1 }
                : q
        ));
        setReplyText('');
        addNotification('Reply posted!');
        showToast('💬 Reply posted!');
    };

    const sendChannelMessage = () => {
        if (!channelInput.trim() || !selectedChannel) return;
        const msg: ChannelMsg = {
            author: currentUser.displayName || 'You',
            initials: userInitials,
            text: channelInput.trim(),
            time: 'just now',
            isOwn: true,
        };
        setChannelMessages(prev => ({ ...prev, [selectedChannel]: [...(prev[selectedChannel] || []), msg] }));
        setChannelInput('');
    };

    const toggleGroup = (name: string) => {
        setJoinedGroups(prev => {
            const next = new Set(prev);
            if (next.has(name)) {
                next.delete(name);
                addNotification(`Left ${name}`);
                showToast(`Left ${name}`);
            } else {
                next.add(name);
                addNotification(`Joined ${name}!`);
                showToast(`🎉 Joined ${name}!`);
            }
            return next;
        });
    };

    const submitQuestion = () => {
        if (!askTitle.trim()) return;
        const q: Question = {
            id: Date.now(),
            title: askTitle.trim(),
            subject: askSubject,
            author: currentUser.displayName || 'You',
            authorInitials: userInitials,
            time: 'just now',
            replies: 0,
            solved: false,
            views: 1,
            bestAnswer: null,
            allReplies: [],
        };
        setQuestions(prev => [q, ...prev]);
        setAskTitle('');
        setShowAskForm(false);
        showToast('✅ Question posted!');
        addNotification('Your question was posted!');
    };

    // ── CHANNEL VIEW ────────────────────────────────────────────────────────────
    if (selectedChannel !== null) {
        const ch = CHANNELS.find(c => c.id === selectedChannel);
        if (!ch) return null;
        const msgs = channelMessages[selectedChannel] || [];

        return (
            <div className="space-y-4">
                <button onClick={() => setSelectedChannel(null)} className="inline-flex items-center gap-2 text-sm font-medium min-h-[44px] underline" style={{ color: 'var(--brand)' }}>
                    <ArrowLeft size={16} /> Back to Community
                </button>

                <div className="rounded-xl border overflow-hidden flex flex-col" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    {/* Header */}
                    <div className="px-4 py-3 border-b flex items-center gap-3" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card-alt)' }}>
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--brand-bg)' }}>
                            <Hash size={18} style={{ color: 'var(--brand)' }} />
                        </div>
                        <div>
                            <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>#{ch.name}</div>
                            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{ch.description} · {ch.members} members</div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="p-4 space-y-4 overflow-y-auto" style={{ minHeight: '360px', maxHeight: '480px' }}>
                        {msgs.map((msg, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                                    style={{ backgroundColor: msg.isOwn ? 'var(--brand)' : 'var(--brand-bg)', color: msg.isOwn ? '#fff' : 'var(--brand)' }}
                                >
                                    {msg.initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{msg.author}</span>
                                        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{msg.time}</span>
                                    </div>
                                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={msgsEndRef} />
                    </div>

                    {/* Input */}
                    <div className="border-t p-3" style={{ borderColor: 'var(--border)' }}>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={channelInput}
                                onChange={e => setChannelInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && sendChannelMessage()}
                                placeholder={`Message #${ch.name}…`}
                                className="flex-1 px-3 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 min-h-[44px]"
                                style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)', '--tw-ring-color': 'var(--brand)' } as React.CSSProperties}
                            />
                            <button
                                onClick={sendChannelMessage}
                                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                                style={{ backgroundColor: 'var(--brand)', color: '#fff' }}
                                aria-label="Send message"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {toastMsg && (
                    <div className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
                        <div className="px-5 py-3 rounded-xl shadow-lg text-sm font-medium" style={{ backgroundColor: 'var(--text)', color: 'var(--bg)' }}>{toastMsg}</div>
                    </div>
                )}
            </div>
        );
    }

    // ── THREAD DETAIL VIEW ──────────────────────────────────────────────────────
    if (selectedThread !== null) {
        const thread = questions.find(q => q.id === selectedThread);
        if (!thread) return null;

        return (
            <div className="space-y-6">
                <button onClick={() => setSelectedThread(null)} className="inline-flex items-center gap-2 text-sm font-medium min-h-[44px] underline" style={{ color: 'var(--brand)' }}>
                    <ArrowLeft size={16} /> Back to Community
                </button>

                <div className="rounded-xl p-5 lg:p-6 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{ backgroundColor: 'var(--brand-bg)', color: 'var(--brand)' }}>{thread.authorInitials}</div>
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="font-medium text-sm" style={{ color: 'var(--text)' }}>{thread.author}</span>
                                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{thread.time}</span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-semibold" style={{ backgroundColor: 'var(--brand-bg)', color: 'var(--brand)' }}>{thread.subject}</span>
                                {thread.solved && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}><CheckCircle2 size={10} /> Solved</span>}
                            </div>
                            <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>{thread.title}</h2>
                        </div>
                    </div>
                </div>

                {thread.bestAnswer && (
                    <div className="border-2 rounded-xl p-5" style={{ backgroundColor: 'var(--success-bg)', borderColor: 'var(--success)' }}>
                        <div className="flex items-center gap-2 mb-3"><Award size={18} style={{ color: 'var(--success)' }} /><span className="text-sm font-bold" style={{ color: 'var(--success)' }}>Best Answer</span></div>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>{thread.bestAnswer}</p>
                    </div>
                )}

                <div className="space-y-3">
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                        {thread.allReplies.length > 0 ? `${thread.allReplies.length} Replies` : 'No replies yet — be the first!'}
                    </h3>
                    {thread.allReplies.map((reply, i) => {
                        const key = `reply-${thread.id}-${i}`;
                        const isLiked = likedItems.includes(key);
                        return (
                            <div key={i} className="rounded-xl p-4 border" style={{ backgroundColor: reply.isBest ? 'var(--success-bg)' : 'var(--card)', borderColor: reply.isBest ? 'var(--success)' : 'var(--border)' }}>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={{ backgroundColor: 'var(--brand-bg)', color: 'var(--brand)' }}>{reply.initials}</div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-sm" style={{ color: 'var(--text)' }}>{reply.author}</span>
                                            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{reply.time}</span>
                                        </div>
                                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{reply.text}</p>
                                        <button
                                            onClick={() => { toggleLiked(key); showToast(isLiked ? 'Unliked' : '👍 Upvoted!'); }}
                                            className="flex items-center gap-1 mt-2 text-xs min-h-[32px]"
                                            style={{ color: isLiked ? 'var(--brand)' : 'var(--text-secondary)' }}
                                        >
                                            <ThumbsUp size={12} fill={isLiked ? 'currentColor' : 'none'} /> {reply.likes + (isLiked ? 1 : 0)}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Reply input */}
                <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5" style={{ backgroundColor: 'var(--brand)', color: '#fff' }}>{userInitials}</div>
                        <div className="flex-1">
                            <textarea
                                value={replyText}
                                onChange={e => setReplyText(e.target.value)}
                                placeholder="Write your reply..."
                                className="w-full px-3 py-2.5 rounded-lg text-sm min-h-[80px] resize-y border focus:outline-none focus:ring-2"
                                style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', borderColor: 'var(--border)', '--tw-ring-color': 'var(--brand)' } as React.CSSProperties}
                            />
                            <button
                                onClick={postReply}
                                disabled={!replyText.trim()}
                                className="mt-2 inline-flex items-center gap-2 font-semibold px-4 py-2.5 rounded-xl text-sm min-h-[44px] disabled:opacity-40"
                                style={{ backgroundColor: 'var(--brand)', color: '#FFFFFF' }}
                            >
                                <Send size={14} /> Post reply
                            </button>
                        </div>
                    </div>
                </div>

                {toastMsg && (
                    <div className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
                        <div className="px-5 py-3 rounded-xl shadow-lg text-sm font-medium" style={{ backgroundColor: 'var(--text)', color: 'var(--bg)' }}>{toastMsg}</div>
                    </div>
                )}
            </div>
        );
    }

    // ── MAIN LIST VIEW ──────────────────────────────────────────────────────────
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl lg:text-2xl font-bold font-[family-name:var(--font-display)]" style={{ color: 'var(--text)' }}>Community</h1>
                <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>Ask questions, join discussions, and connect with peers</p>
            </div>

            <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                {/* Tabs */}
                <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
                    {([
                        { id: 'channels' as const, label: 'Channels', icon: Hash },
                        { id: 'questions' as const, label: 'Questions', icon: HelpCircle },
                        { id: 'groups' as const, label: 'Groups', icon: Users },
                    ]).map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className="flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium border-b-2 min-h-[48px] transition-colors"
                                style={{ borderColor: activeTab === tab.id ? 'var(--brand)' : 'transparent', color: activeTab === tab.id ? 'var(--brand)' : 'var(--text-secondary)' }}>
                                <Icon size={16} /> {tab.label}
                            </button>
                        );
                    })}
                </div>

                <div key={activeTab} className="p-4 lg:p-5 animate-tab-enter">

                    {/* ── CHANNELS TAB ── */}
                    {activeTab === 'channels' && (
                        <div className="space-y-2">
                            {CHANNELS.map((ch, i) => (
                                <button key={i} onClick={() => setSelectedChannel(ch.id)}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left min-h-[48px]"
                                    style={{ backgroundColor: 'var(--bg)' }}>
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--brand-bg)' }}>
                                        <Hash size={18} style={{ color: 'var(--brand)' }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>#{ch.name}</div>
                                        <div className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{ch.description}</div>
                                    </div>
                                    <div className="text-right text-xs shrink-0 flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                                        <span>{ch.members} members</span>
                                        <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* ── QUESTIONS TAB ── */}
                    {activeTab === 'questions' && (
                        <div className="space-y-3">
                            {/* Inline Ask button (no floating FAB) */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{questions.length} questions</span>
                                <button
                                    onClick={() => setShowAskForm(v => !v)}
                                    className="inline-flex items-center gap-2 font-semibold px-4 py-2 rounded-xl text-sm min-h-[40px]"
                                    style={{ backgroundColor: 'var(--brand)', color: '#fff' }}
                                >
                                    <Plus size={15} /> Ask a question
                                </button>
                            </div>

                            {showAskForm && (
                                <div className="rounded-xl p-4 border space-y-3 animate-fade-in" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
                                    <input
                                        type="text"
                                        value={askTitle}
                                        onChange={e => setAskTitle(e.target.value)}
                                        placeholder="What's your question?"
                                        autoFocus
                                        className="w-full px-3 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 min-h-[44px]"
                                        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)', '--tw-ring-color': 'var(--brand)' } as React.CSSProperties}
                                    />
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={askSubject}
                                            onChange={e => setAskSubject(e.target.value)}
                                            className="flex-1 px-3 py-2 rounded-xl text-sm border focus:outline-none min-h-[40px]"
                                            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }}
                                        >
                                            {['Physics', 'Chemistry', 'Biology', 'Earth Science'].map(s => <option key={s}>{s}</option>)}
                                        </select>
                                        <button
                                            onClick={submitQuestion}
                                            disabled={!askTitle.trim()}
                                            className="px-4 py-2 rounded-xl text-sm font-semibold min-h-[40px] disabled:opacity-40"
                                            style={{ backgroundColor: 'var(--brand)', color: '#fff' }}
                                        >Post</button>
                                        <button
                                            onClick={() => setShowAskForm(false)}
                                            className="px-3 py-2 rounded-xl text-sm min-h-[40px]"
                                            style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--card-alt)' }}
                                        >Cancel</button>
                                    </div>
                                </div>
                            )}

                            {questions.map(q => (
                                <button key={q.id} onClick={() => setSelectedThread(q.id)}
                                    className="w-full rounded-xl p-4 text-left transition-colors min-h-[48px]"
                                    style={{ backgroundColor: 'var(--bg)' }}>
                                    <div className="flex items-start gap-3">
                                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ backgroundColor: 'var(--brand-bg)', color: 'var(--brand)' }}>{q.authorInitials}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                                <span className="px-2 py-0.5 rounded text-[10px] font-semibold" style={{ backgroundColor: 'var(--brand-bg)', color: 'var(--brand)' }}>{q.subject}</span>
                                                {q.solved && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}><CheckCircle2 size={10} /> Solved</span>}
                                            </div>
                                            <h3 className="text-sm font-semibold line-clamp-1" style={{ color: 'var(--text)' }}>{q.title}</h3>
                                            <div className="flex items-center gap-3 mt-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                                                <span>{q.author}</span>
                                                <span className="flex items-center gap-0.5"><Clock size={10} /> {q.time}</span>
                                                <span className="flex items-center gap-0.5"><MessageSquare size={10} /> {q.replies}</span>
                                            </div>
                                        </div>
                                        <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} className="shrink-0 mt-2" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* ── GROUPS TAB ── */}
                    {activeTab === 'groups' && (
                        <div className="space-y-3">
                            {GROUPS.map((group, i) => {
                                const joined = joinedGroups.has(group.name);
                                return (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--bg)' }}>
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                                            style={{ backgroundColor: joined ? 'var(--success-bg)' : 'var(--brand-bg)' }}>
                                            <Users size={18} style={{ color: joined ? 'var(--success)' : 'var(--brand)' }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{group.name}</div>
                                            <div className="flex flex-wrap items-center gap-2 text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                                                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: 'var(--card)', color: 'var(--text-secondary)' }}>{group.subject}</span>
                                                <span>{group.members + (joined ? 1 : 0)} members</span>
                                                {joined && <span className="text-[10px] font-semibold" style={{ color: 'var(--success)' }}>· You're a member</span>}
                                            </div>
                                            {joined && (
                                                <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Next meeting: {group.nextMeeting}</div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => toggleGroup(group.name)}
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg min-h-[36px] transition-all shrink-0"
                                            style={{ backgroundColor: joined ? 'var(--success-bg)' : 'var(--brand)', color: joined ? 'var(--success)' : '#fff' }}
                                        >
                                            {joined ? <><UserCheck size={13} /> Joined</> : <><UserPlus size={13} /> Join</>}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Questions', value: String(questions.length), icon: HelpCircle, color: 'var(--brand)' },
                    { label: 'Answered', value: String(questions.filter(q => q.solved).length), icon: CheckCircle2, color: 'var(--success)' },
                    { label: 'Groups joined', value: String(joinedGroups.size), icon: Users, color: 'var(--warning)' },
                    { label: 'This week', value: '+28', icon: TrendingUp, color: 'var(--info)' },
                ].map((stat, i) => (
                    <div key={i} className="rounded-xl p-4 border text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                        <stat.icon size={20} className="mx-auto mb-1" style={{ color: stat.color }} />
                        <div className="text-lg font-bold" style={{ color: 'var(--text)' }}>{stat.value}</div>
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            {toastMsg && (
                <div className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
                    <div className="px-5 py-3 rounded-xl shadow-lg text-sm font-medium" style={{ backgroundColor: 'var(--text)', color: 'var(--bg)' }}>{toastMsg}</div>
                </div>
            )}
        </div>
    );
}
