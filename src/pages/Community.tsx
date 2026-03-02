import { useState } from 'react';
import {
  MessageSquare, Hash, Users, HelpCircle,
  CheckCircle2, Clock, ChevronRight, Plus, ThumbsUp,
  ArrowLeft, Send, Award, TrendingUp
} from 'lucide-react';

export default function Community() {
  const [activeTab, setActiveTab] = useState<'channels' | 'questions' | 'groups'>('questions');
  const [selectedThread, setSelectedThread] = useState<number | null>(null);

  const questions = [
    {
      id: 1,
      title: 'How do you solve quadratic equations by completing the square?',
      subject: 'Math',
      author: 'Alex M.',
      authorInitials: 'AM',
      time: '2 hours ago',
      replies: 5,
      solved: true,
      views: 34,
      bestAnswer: 'To complete the square: 1) Move the constant to the right side, 2) Take half of b, square it, add to both sides, 3) Factor the left side as a perfect square, 4) Solve by taking square roots.',
      allReplies: [
        { author: 'Dr. Chen', initials: 'DC', text: 'To complete the square: 1) Move the constant to the right side, 2) Take half of b, square it, add to both sides, 3) Factor the left side as a perfect square, 4) Solve by taking square roots.', time: '1 hour ago', isBest: true, likes: 8 },
        { author: 'Maria L.', initials: 'ML', text: 'Dr. Chen\'s explanation is great! I also found this video helpful for visualizing the process.', time: '45 min ago', isBest: false, likes: 3 },
        { author: 'Chris K.', initials: 'CK', text: 'Don\'t forget that this method works for all quadratic equations, even when the coefficient of x² isn\'t 1.', time: '30 min ago', isBest: false, likes: 2 },
      ],
    },
    {
      id: 2,
      title: 'What\'s the difference between mitosis and meiosis?',
      subject: 'Biology',
      author: 'Sarah J.',
      authorInitials: 'SJ',
      time: '5 hours ago',
      replies: 8,
      solved: true,
      views: 67,
      bestAnswer: 'Mitosis produces 2 identical daughter cells for growth/repair. Meiosis produces 4 unique gametes for reproduction.',
      allReplies: [
        { author: 'Prof. Park', initials: 'PP', text: 'Mitosis produces 2 identical daughter cells for growth/repair. Meiosis produces 4 unique gametes for reproduction, with crossing over for genetic diversity.', time: '4 hours ago', isBest: true, likes: 12 },
      ],
    },
    {
      id: 3,
      title: 'Tips for writing a strong thesis statement?',
      subject: 'English',
      author: 'Jordan R.',
      authorInitials: 'JR',
      time: '1 day ago',
      replies: 3,
      solved: false,
      views: 28,
      bestAnswer: null,
      allReplies: [
        { author: 'Emily W.', initials: 'EW', text: 'A strong thesis should be specific, arguable, and provide a roadmap for your essay. Avoid vague language.', time: '20 hours ago', isBest: false, likes: 5 },
      ],
    },
    {
      id: 4,
      title: 'How to calculate acceleration from a velocity-time graph?',
      subject: 'Physics',
      author: 'Kim P.',
      authorInitials: 'KP',
      time: '3 days ago',
      replies: 6,
      solved: true,
      views: 89,
      bestAnswer: 'Acceleration = slope of the v-t graph. Calculate rise/run (Δv/Δt) between two points.',
      allReplies: [],
    },
    {
      id: 5,
      title: 'What caused the fall of the Roman Empire?',
      subject: 'History',
      author: 'Tom B.',
      authorInitials: 'TB',
      time: '4 days ago',
      replies: 12,
      solved: false,
      views: 112,
      bestAnswer: null,
      allReplies: [],
    },
  ];

  const channels = [
    { name: 'general', description: 'General discussion and announcements', members: 234, messages: 1289, icon: Hash },
    { name: 'math-help', description: 'Get help with math problems', members: 89, messages: 456, icon: Hash },
    { name: 'science-lab', description: 'Science experiments and lab work', members: 67, messages: 312, icon: Hash },
    { name: 'study-tips', description: 'Share your best study strategies', members: 156, messages: 678, icon: Hash },
    { name: 'off-topic', description: 'Casual conversations', members: 198, messages: 2345, icon: Hash },
  ];

  const groups = [
    { name: 'Algebra Study Group', members: 12, activity: 'Active now', subject: 'Math', nextMeeting: 'Today, 3 PM' },
    { name: 'Biology Lab Partners', members: 8, activity: '3 online', subject: 'Science', nextMeeting: 'Tomorrow, 2 PM' },
    { name: 'AP History Review', members: 15, activity: 'Active now', subject: 'History', nextMeeting: 'Today, 5 PM' },
    { name: 'Creative Writing Club', members: 10, activity: '2 online', subject: 'English', nextMeeting: 'Friday, 4 PM' },
    { name: 'Physics Problem Solvers', members: 6, activity: '1 online', subject: 'Physics', nextMeeting: 'Thursday, 6 PM' },
  ];

  // Thread detail view
  if (selectedThread !== null) {
    const thread = questions.find(q => q.id === selectedThread);
    if (!thread) return null;

    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedThread(null)}
          className="inline-flex items-center gap-2 text-sm text-[#1D4ED8] font-medium min-h-[44px] underline"
        >
          <ArrowLeft size={16} /> Back to Community
        </button>

        {/* Question */}
        <div className="bg-white rounded-xl p-5 lg:p-6 border border-gray-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1D4ED8]/10 flex items-center justify-center text-[#1D4ED8] text-sm font-bold shrink-0">
              {thread.authorInitials}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-medium text-sm text-[#111827]">{thread.author}</span>
                <span className="text-xs text-[#4B5563]">{thread.time}</span>
                <span className="px-2 py-0.5 bg-[#1D4ED8]/10 text-[#1D4ED8] rounded text-[10px] font-semibold">{thread.subject}</span>
                {thread.solved && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#059669]/10 text-[#059669] rounded text-[10px] font-semibold">
                    <CheckCircle2 size={10} /> Solved
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-[#111827]">{thread.title}</h2>
              <div className="flex items-center gap-3 mt-2 text-xs text-[#4B5563]">
                <span>{thread.replies} replies</span>
                <span>{thread.views} views</span>
              </div>
            </div>
          </div>
        </div>

        {/* Best answer */}
        {thread.bestAnswer && (
          <div className="bg-[#059669]/5 border-2 border-[#059669]/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Award size={18} className="text-[#059669]" />
              <span className="text-sm font-bold text-[#059669]">Best Answer</span>
            </div>
            <p className="text-sm text-[#111827] leading-relaxed">{thread.bestAnswer}</p>
          </div>
        )}

        {/* Replies */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-[#4B5563]">{thread.allReplies.length > 0 ? `${thread.allReplies.length} Replies` : 'No replies yet'}</h3>
          {thread.allReplies.map((reply, i) => (
            <div
              key={i}
              className={`bg-white rounded-xl p-4 border ${reply.isBest ? 'border-[#059669]/30 bg-[#059669]/5' : 'border-gray-100'}`}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1D4ED8]/10 flex items-center justify-center text-[#1D4ED8] text-[10px] font-bold shrink-0">
                  {reply.initials}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-[#111827]">{reply.author}</span>
                    <span className="text-xs text-[#4B5563]">{reply.time}</span>
                    {reply.isBest && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#059669]/10 text-[#059669] rounded text-[10px] font-semibold">
                        <CheckCircle2 size={9} /> Best
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#4B5563] leading-relaxed">{reply.text}</p>
                  <button className="flex items-center gap-1 mt-2 text-xs text-[#4B5563] hover:text-[#1D4ED8] min-h-[32px]">
                    <ThumbsUp size={12} /> {reply.likes}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reply input */}
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6] flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">
              JS
            </div>
            <div className="flex-1">
              <textarea
                placeholder="Write your reply..."
                className="w-full px-3 py-2.5 bg-[#F5F5F7] rounded-lg text-sm text-[#111827] placeholder-[#4B5563] border border-transparent focus:border-[#1D4ED8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 min-h-[80px] resize-y"
              />
              <button className="mt-2 inline-flex items-center gap-2 bg-[#1D4ED8] text-white font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-[#1E40AF] transition-colors min-h-[44px]">
                <Send size={14} /> Post reply
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-[#111827]">Community</h1>
          <p className="text-sm text-[#4B5563] mt-0.5">Ask questions, join discussions, and connect with peers</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {([
            { id: 'channels' as const, label: 'Channels', icon: Hash },
            { id: 'questions' as const, label: 'Questions', icon: HelpCircle },
            { id: 'groups' as const, label: 'Groups', icon: Users },
          ]).map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium border-b-2 min-h-[48px] transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#1D4ED8] text-[#1D4ED8]'
                    : 'border-transparent text-[#4B5563] hover:text-[#111827]'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-4 lg:p-5">
          {/* ====== QUESTIONS TAB ====== */}
          {activeTab === 'questions' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-[#4B5563]">{questions.length} questions</p>
                <div className="flex items-center gap-2">
                  <select className="px-3 py-2 bg-[#F5F5F7] rounded-lg text-xs border border-transparent focus:border-[#1D4ED8] focus:outline-none min-h-[36px]">
                    <option>All subjects</option>
                    <option>Math</option>
                    <option>Science</option>
                    <option>English</option>
                  </select>
                </div>
              </div>
              {questions.map(q => (
                <button
                  key={q.id}
                  onClick={() => setSelectedThread(q.id)}
                  className="w-full bg-[#F5F5F7]/50 hover:bg-[#F5F5F7] rounded-xl p-4 text-left transition-colors min-h-[48px]"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#1D4ED8]/10 flex items-center justify-center text-[#1D4ED8] text-xs font-bold shrink-0">
                      {q.authorInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span className="px-2 py-0.5 bg-[#1D4ED8]/10 text-[#1D4ED8] rounded text-[10px] font-semibold">{q.subject}</span>
                        {q.solved && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#059669]/10 text-[#059669] rounded text-[10px] font-semibold">
                            <CheckCircle2 size={10} /> Solved
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-[#111827] line-clamp-1">{q.title}</h3>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-[#4B5563]">
                        <span>{q.author}</span>
                        <span className="flex items-center gap-0.5"><Clock size={10} /> {q.time}</span>
                        <span className="flex items-center gap-0.5"><MessageSquare size={10} /> {q.replies}</span>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-300 shrink-0 mt-2" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* ====== CHANNELS TAB ====== */}
          {activeTab === 'channels' && (
            <div className="space-y-2">
              {channels.map((ch, i) => (
                <button
                  key={i}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#F5F5F7] transition-colors text-left min-h-[48px]"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#1D4ED8]/10 flex items-center justify-center shrink-0">
                    <ch.icon size={18} className="text-[#1D4ED8]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[#111827]">#{ch.name}</div>
                    <div className="text-xs text-[#4B5563] truncate">{ch.description}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-[#4B5563]">{ch.members} members</div>
                    <div className="text-[10px] text-[#4B5563]">{ch.messages} messages</div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 shrink-0" />
                </button>
              ))}
            </div>
          )}

          {/* ====== GROUPS TAB ====== */}
          {activeTab === 'groups' && (
            <div className="space-y-3">
              {groups.map((group, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F5F7]/50 hover:bg-[#F5F5F7] transition-colors min-h-[48px]">
                  <div className="w-10 h-10 rounded-lg bg-[#059669]/10 flex items-center justify-center shrink-0">
                    <Users size={18} className="text-[#059669]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[#111827]">{group.name}</div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#4B5563] mt-0.5">
                      <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-medium">{group.subject}</span>
                      <span>{group.members} members</span>
                      <span>Next: {group.nextMeeting}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      group.activity === 'Active now'
                        ? 'bg-[#059669]/10 text-[#059669]'
                        : 'bg-gray-100 text-[#4B5563]'
                    }`}>
                      {group.activity === 'Active now' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#059669] mr-1 animate-pulse" />}
                      {group.activity}
                    </span>
                    <button className="text-xs text-[#1D4ED8] font-medium underline min-h-[28px] flex items-center">
                      Join
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating ask button */}
      <div className="fixed bottom-20 right-4 lg:bottom-8 lg:right-8 z-20">
        <button className="inline-flex items-center gap-2 bg-[#1D4ED8] text-white font-semibold px-5 py-3.5 rounded-full text-sm hover:bg-[#1E40AF] transition-colors shadow-lg hover:shadow-xl min-h-[48px]">
          <Plus size={18} />
          <span className="hidden sm:inline">Ask a question</span>
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Questions', value: '234', icon: HelpCircle, color: '#1D4ED8' },
          { label: 'Answered', value: '189', icon: CheckCircle2, color: '#059669' },
          { label: 'Active groups', value: '12', icon: Users, color: '#D97706' },
          { label: 'This week', value: '+28', icon: TrendingUp, color: '#0369A1' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <stat.icon size={20} className="mx-auto mb-1" style={{ color: stat.color }} />
            <div className="text-lg font-bold text-[#111827]">{stat.value}</div>
            <div className="text-xs text-[#4B5563]">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
