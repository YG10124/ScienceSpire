import { Clock, Users, Video, Monitor, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface SessionCardProps {
    session: {
        id: number;
        title: string;
        subject: string;
        level: string;
        levelColor: string;
        host: string;
        hostInitials: string;
        time: string;
        capacity: { current: number; max: number };
        tools: string[];
        status: string;
        isMySession: boolean;
    };
    onViewDetails: () => void;
    onReserve: () => void;
}

const toolIcons: Record<string, typeof Video> = {
    video: Video,
    whiteboard: Monitor,
    quiz: FileText,
};

export default function SessionCard({ session, onViewDetails, onReserve }: SessionCardProps) {
    return (
        <div
            className="rounded-xl border overflow-hidden transition-shadow hover:shadow-md"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        >
            <div className="p-4 lg:p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    {/* Host avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6] flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {session.hostInitials}
                    </div>

                    <div className="flex-1 min-w-0">
                        {/* Tags */}
                        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                            <span
                                className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold"
                                style={{ backgroundColor: 'var(--brand-bg)', color: 'var(--brand)' }}
                            >
                                {session.subject}
                            </span>
                            <span
                                className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold"
                                style={{ backgroundColor: session.levelColor + '15', color: session.levelColor }}
                            >
                                {session.level}
                            </span>
                            {session.isMySession && (
                                <span
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold"
                                    style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}
                                >
                                    <CheckCircle2 size={10} /> Enrolled
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-semibold" style={{ color: 'var(--text)' }}>{session.title}</h3>
                        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{session.host}</p>

                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                            <span className="flex items-center gap-1">
                                <Clock size={13} /> {session.time}
                            </span>
                            <span className="flex items-center gap-1">
                                <Users size={13} />
                                {session.capacity.current}/{session.capacity.max} spots
                                {session.status === 'almost-full' && (
                                    <span className="font-medium flex items-center gap-0.5" style={{ color: 'var(--warning)' }}>
                                        <AlertTriangle size={11} /> Almost full
                                    </span>
                                )}
                            </span>
                            <span className="flex items-center gap-1.5">
                                {session.tools.map(tool => {
                                    const ToolIcon = toolIcons[tool];
                                    return ToolIcon ? <ToolIcon key={tool} size={13} style={{ color: 'var(--text-secondary)' }} /> : null;
                                })}
                            </span>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="flex sm:flex-col gap-2 sm:items-end shrink-0 mt-2 sm:mt-0">
                        {session.isMySession ? (
                            <button
                                className="inline-flex items-center gap-2 font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors min-h-[48px] shadow-sm"
                                style={{ backgroundColor: 'var(--brand)', color: '#FFFFFF' }}
                            >
                                <Video size={16} />
                                Join now
                            </button>
                        ) : (
                            <button
                                onClick={onReserve}
                                className="inline-flex items-center gap-2 border-2 font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors min-h-[48px]"
                                style={{ borderColor: 'var(--brand)', color: 'var(--brand)' }}
                            >
                                Reserve spot
                            </button>
                        )}
                        <button
                            onClick={onViewDetails}
                            className="text-xs font-medium underline min-h-[44px] flex items-center"
                            style={{ color: 'var(--brand)' }}
                        >
                            View details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
