import { useEffect, useRef } from 'react';
import { X, Calendar, Bell, Users, Clock, BookOpen, Video } from 'lucide-react';

interface SessionDetails {
    id: number;
    title: string;
    subject: string;
    level: string;
    host: string;
    hostInitials: string;
    time: string;
    capacity: { current: number; max: number };
    description: string;
    agenda: string[];
    materials: string[];
    isMySession: boolean;
}

interface SessionDetailsDrawerProps {
    session: SessionDetails;
    onClose: () => void;
    onReserve: () => void;
    onAddToCalendar: () => void;
}

export default function SessionDetailsDrawer({ session, onClose, onReserve, onAddToCalendar }: SessionDetailsDrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null);

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    // Focus trap
    useEffect(() => {
        const firstBtn = drawerRef.current?.querySelector('button');
        firstBtn?.focus();
    }, []);

    const spotsLeft = session.capacity.max - session.capacity.current;

    return (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center p-0 lg:p-4" role="dialog" aria-modal="true" aria-label={`Details for ${session.title}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 transition-opacity"
                style={{ backgroundColor: 'var(--surface-overlay)' }}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Drawer */}
            <div
                ref={drawerRef}
                className="relative w-full lg:max-w-lg lg:rounded-2xl rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto animate-slide-up"
                style={{ backgroundColor: 'var(--card)' }}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6] flex items-center justify-center text-white text-xs font-bold">
                            {session.hostInitials}
                        </div>
                        <div>
                            <h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>{session.title}</h2>
                            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{session.host}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
                        style={{ color: 'var(--text-secondary)' }}
                        aria-label="Close details"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 space-y-5">
                    {/* Meta */}
                    <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold" style={{ backgroundColor: 'var(--brand-bg)', color: 'var(--brand)' }}>
                            {session.subject}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-secondary)' }}>
                            {session.level}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-secondary)' }}>
                            <Clock size={12} /> {session.time}
                        </span>
                    </div>

                    {/* Capacity */}
                    <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg)' }}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--text)' }}>
                                <Users size={14} /> Capacity
                            </span>
                            <span className="text-sm font-bold" style={{ color: spotsLeft <= 2 ? 'var(--warning)' : 'var(--success)' }}>
                                {spotsLeft} spots left
                            </span>
                        </div>
                        <div className="w-full rounded-full h-2" style={{ backgroundColor: 'var(--border)' }}>
                            <div
                                className="h-2 rounded-full transition-all"
                                style={{
                                    width: `${(session.capacity.current / session.capacity.max) * 100}%`,
                                    backgroundColor: spotsLeft <= 2 ? 'var(--warning)' : 'var(--brand)',
                                }}
                            />
                        </div>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                            {session.capacity.current} of {session.capacity.max} enrolled
                        </p>
                    </div>

                    {/* Description */}
                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Description</h4>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>{session.description}</p>
                    </div>

                    {/* Agenda */}
                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Agenda</h4>
                        <ol className="space-y-1.5">
                            {session.agenda.map((item, i) => (
                                <li key={i} className="text-sm flex items-start gap-2" style={{ color: 'var(--text)' }}>
                                    <span
                                        className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5"
                                        style={{ backgroundColor: 'var(--brand-bg)', color: 'var(--brand)' }}
                                    >
                                        {i + 1}
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ol>
                    </div>

                    {/* Materials */}
                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Materials Needed</h4>
                        <ul className="space-y-1">
                            {session.materials.map((mat, i) => (
                                <li key={i} className="text-sm flex items-center gap-2" style={{ color: 'var(--text)' }}>
                                    <BookOpen size={12} style={{ color: 'var(--text-secondary)' }} />
                                    {mat}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Footer actions */}
                <div className="sticky bottom-0 p-5 border-t flex flex-col gap-2" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    {session.isMySession ? (
                        <button
                            className="w-full inline-flex items-center justify-center gap-2 font-semibold px-5 py-3.5 rounded-xl text-sm transition-colors min-h-[48px] shadow-sm"
                            style={{ backgroundColor: 'var(--brand)', color: '#FFFFFF' }}
                        >
                            <Video size={16} /> Join Session
                        </button>
                    ) : (
                        <button
                            onClick={onReserve}
                            className="w-full inline-flex items-center justify-center gap-2 font-semibold px-5 py-3.5 rounded-xl text-sm transition-colors min-h-[48px] shadow-sm"
                            style={{ backgroundColor: 'var(--brand)', color: '#FFFFFF' }}
                        >
                            Reserve Spot ({spotsLeft} left)
                        </button>
                    )}
                    <div className="flex gap-2">
                        <button
                            onClick={onAddToCalendar}
                            className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2.5 border rounded-xl text-xs font-medium min-h-[40px] transition-colors"
                            style={{ borderColor: 'var(--border)', color: 'var(--text)', backgroundColor: 'var(--card)' }}
                        >
                            <Calendar size={12} /> Add to Calendar
                        </button>
                        <button
                            className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2.5 border rounded-xl text-xs font-medium min-h-[40px] transition-colors"
                            style={{ borderColor: 'var(--border)', color: 'var(--text)', backgroundColor: 'var(--card)' }}
                        >
                            <Bell size={12} /> Set Reminder
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
