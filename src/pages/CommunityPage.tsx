import { useEffect, useState } from 'react';
import {
    MessageSquare, Hash, Users, HelpCircle,
    CheckCircle2, Clock, ChevronRight, Plus, ThumbsUp,
    ArrowLeft, Send, Award, TrendingUp
} from 'lucide-react';
import { useLocalStore } from '@/store/useLocalStore';
import type { BreadcrumbItem } from '@/config/site';

interface CommunityPageProps {
    onBreadcrumbChange?: (items: BreadcrumbItem[]) => void;
}

export default function CommunityPage({ onBreadcrumbChange }: CommunityPageProps) {
    const { likedItems, toggleLiked, addNotification } = useLocalStore();
    const [activeTab, setActiveTab] = useState<'channels' | 'questions' | 'groups'>('questions');
    const [selectedThread, setSelectedThread] = useState<number | null>(null);
    const [replyText, setReplyText] = useState('');
    const [toastMsg, setToastMsg] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 3000);
    };

    useEffect(() => {
        if (!onBreadcrumbChange) return;
        if (selectedThread === null) {
            onBreadcrumbChange([]);
            return;
        }
        const thread = questions.find(q => q.id === selectedThread);
        if (!thread) {
            onBreadcrumbChange([]);
            return;
        }
        onBreadcrumbChange([{ label: thread.subject }, { label: thread.title }]);
    }, [onBreadcrumbChange, selectedThread]);

    const questions = [
        {
            id: 1, title: 'How do I calculate acceleration from a force diagram?', subject: 'Physics', author: 'Alex M.', authorInitials: 'AM', time: '2 hours ago', replies: 5, solved: true, views: 34, bestAnswer: 'Use F = ma. First find net force from the diagram, then divide by mass to get acceleration.',
            allReplies: [
                { author: 'Dr. Chen', initials: 'DC', text: 'Draw all forces, sum them vectorially for net force, then apply a = F_net / m.', time: '1 hour ago', isBest: true, likes: 8 },
                { author: 'Maria L.', initials: 'ML', text: 'Dr. Chen\'s explanation is great!', time: '45 min ago', isBest: false, likes: 3 },
            ]
        },
        {
            id: 2, title: 'What\'s the difference between mitosis and meiosis?', subject: 'Biology', author: 'Sarah J.', authorInitials: 'SJ', time: '5 hours ago', replies: 8, solved: true, views: 67, bestAnswer: 'Mitosis produces 2 identical daughter cells. Meiosis produces 4 unique gametes.', allReplies: [
                { author: 'Prof. Park', initials: 'PP', text: 'Mitosis = growth/repair (2 identical cells). Meiosis = reproduction (4 unique gametes).', time: '4 hours ago', isBest: true, likes: 12 },
            ]
        },
        {
            id: 3, title: 'Any mnemonic for periodic trends in chemistry?', subject: 'Chemistry', author: 'Jordan R.', authorInitials: 'JR', time: '1 day ago', replies: 3, solved: false, views: 28, bestAnswer: null, allReplies: [
                { author: 'Emily W.', initials: 'EW', text: 'Remember: electronegativity and ionization energy increase up and to the right.', time: '20 hours ago', isBest: false, likes: 5 },
            ]
        },
        { id: 4, title: 'How to calculate acceleration from a velocity-time graph?', subject: 'Physics', author: 'Kim P.', authorInitials: 'KP', time: '3 days ago', replies: 6, solved: true, views: 89, bestAnswer: 'Acceleration = slope = Δv/Δt', allReplies: [] },
    ];

    const channels = [
        { name: 'general', description: 'General science discussion and announcements', members: 234, messages: 1289 },
        { name: 'physics-help', description: 'Get help with physics problem sets', members: 89, messages: 456 },
        { name: 'chemistry-lab', description: 'Chemistry experiments and lab work', members: 67, messages: 312 },
        { name: 'earth-science', description: 'Weather, geology, and climate discussion', members: 156, messages: 678 },
    ];

    const groups = [
        { name: 'Physics Study Group', members: 12, activity: 'Active now', subject: 'Physics', nextMeeting: 'Today, 3 PM' },
        { name: 'Biology Lab Partners', members: 8, activity: '3 online', subject: 'Biology', nextMeeting: 'Tomorrow, 2 PM' },
        { name: 'Organic Chemistry Review', members: 15, activity: 'Active now', subject: 'Chemistry', nextMeeting: 'Today, 5 PM' },
        { name: 'Earth Science Explorers', members: 10, activity: '2 online', subject: 'Earth Science', nextMeeting: 'Friday, 4 PM' },
    ];

    // Thread detail view
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
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{thread.allReplies.length > 0 ? `${thread.allReplies.length} Replies` : 'No replies yet'}</h3>
                    {thread.allReplies.map((reply, i) => {
                        const replyLikeKey = `reply-${thread.id}-${i}`;
                        const isLiked = likedItems.includes(replyLikeKey);
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
                                            onClick={() => { toggleLiked(replyLikeKey); showToast(isLiked ? '👎 Unliked' : '👍 Upvoted!'); }}
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
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6] flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">JS</div>
                        <div className="flex-1">
                            <textarea
                                value={replyText}
                                onChange={e => setReplyText(e.target.value)}
                                placeholder="Write your reply..."
                                className="w-full px-3 py-2.5 rounded-lg text-sm min-h-[80px] resize-y border focus:outline-none focus:ring-2"
                                style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', borderColor: 'transparent' }}
                            />
                            <button
                                onClick={() => { if (replyText.trim()) { addNotification('Reply posted!'); setReplyText(''); showToast('💬 Reply posted!'); } }}
                                className="mt-2 inline-flex items-center gap-2 font-semibold px-4 py-2.5 rounded-xl text-sm min-h-[44px]"
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

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl lg:text-2xl font-bold font-[family-name:var(--font-display)]" style={{ color: 'var(--text)' }}>Community</h1>
                <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>Ask questions, join discussions, and connect with peers</p>
            </div>

            <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
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
                    {activeTab === 'questions' && (
                        <div className="space-y-3">
                            {questions.map(q => (
                                <button key={q.id} onClick={() => setSelectedThread(q.id)} className="w-full rounded-xl p-4 text-left transition-colors min-h-[48px]" style={{ backgroundColor: 'var(--bg)' }}>
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

                    {activeTab === 'channels' && (
                        <div className="space-y-2">
                            {channels.map((ch, i) => (
                                <button key={i} className="w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left min-h-[48px]"
                                    onClick={() => showToast(`#${ch.name} channel opened!`)}>
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--brand-bg)' }}>
                                        <Hash size={18} style={{ color: 'var(--brand)' }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>#{ch.name}</div>
                                        <div className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{ch.description}</div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{ch.members} members</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {activeTab === 'groups' && (
                        <div className="space-y-3">
                            {groups.map((group, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl min-h-[48px]" style={{ backgroundColor: 'var(--bg)' }}>
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--success-bg)' }}>
                                        <Users size={18} style={{ color: 'var(--success)' }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{group.name}</div>
                                        <div className="flex flex-wrap items-center gap-2 text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: 'var(--card)', color: 'var(--text-secondary)' }}>{group.subject}</span>
                                            <span>{group.members} members</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { addNotification(`Joined ${group.name}`); showToast(`🎉 Joined ${group.name}!`); }}
                                        className="text-xs font-medium underline min-h-[28px] flex items-center"
                                        style={{ color: 'var(--brand)' }}
                                    >Join</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="fixed bottom-20 right-4 lg:bottom-8 lg:right-8 z-20">
                <button
                    onClick={() => showToast('📝 Ask a question - coming soon!')}
                    className="inline-flex items-center gap-2 font-semibold px-5 py-3.5 rounded-full text-sm shadow-lg hover:shadow-xl min-h-[48px]"
                    style={{ backgroundColor: 'var(--brand)', color: '#FFFFFF' }}
                >
                    <Plus size={18} /><span className="hidden sm:inline">Ask a question</span>
                </button>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Questions', value: '234', icon: HelpCircle, color: 'var(--brand)' },
                    { label: 'Answered', value: '189', icon: CheckCircle2, color: 'var(--success)' },
                    { label: 'Active groups', value: '12', icon: Users, color: 'var(--warning)' },
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
