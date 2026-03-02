import { useEffect, useMemo, useState } from 'react';
import { Filter, X } from 'lucide-react';
import Calendar from '@/components/schedule/Calendar';
import SessionCard from '@/components/schedule/SessionCard';
import SessionDetailsDrawer from '@/components/schedule/SessionDetailsDrawer';
import { useLocalStore } from '@/store/useLocalStore';
import type { AppPage, BreadcrumbItem } from '@/config/site';

interface SchedulePageProps {
  searchQuery?: string;
  isSignedIn?: boolean;
  onNavigate?: (page: AppPage) => void;
  onBreadcrumbChange?: (items: BreadcrumbItem[]) => void;
}

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function SchedulePage({
  searchQuery = '',
  isSignedIn = false,
  onNavigate,
  onBreadcrumbChange,
}: SchedulePageProps) {
  const { sessions, reserveSession, addNotification, currentUser } = useLocalStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showFilters, setShowFilters] = useState(false);
  const [detailSessionId, setDetailSessionId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'my' | 'all'>('all');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const displaySessions = useMemo(
    () =>
      sessions.map(s => ({
        ...s,
        hostInitials: s.host
          .split(' ')
          .map(w => w[0])
          .join('')
          .slice(0, 2),
        levelColor:
          s.level === 'Beginner'
            ? '#059669'
            : s.level === 'Intermediate'
              ? '#D97706'
              : s.level === 'Advanced'
                ? '#B91C1C'
                : '#0369A1',
        capacity: { current: s.attendees.length, max: s.capacity },
        tools: ['video', 'whiteboard'],
        status: s.attendees.length >= s.capacity - 1 ? 'almost-full' : 'upcoming',
        isMySession: s.attendees.includes(currentUser.id),
      })),
    [sessions, currentUser.id],
  );

  const query = searchQuery.trim().toLowerCase();
  const selectedDateKey = toDateKey(selectedDate);
  const detailSession = detailSessionId !== null ? displaySessions.find(s => s.id === detailSessionId) : null;

  const filteredSessions = useMemo(() => {
    const searchFiltered = query
      ? displaySessions.filter(
        s =>
          s.title.toLowerCase().includes(query) ||
          s.host.toLowerCase().includes(query) ||
          s.subject.toLowerCase().includes(query) ||
          s.level.toLowerCase().includes(query),
      )
      : displaySessions;

    const dateFiltered = searchFiltered.filter(s => s.date === selectedDateKey);
    return viewMode === 'my' ? dateFiltered.filter(s => s.isMySession) : dateFiltered;
  }, [displaySessions, query, selectedDateKey, viewMode]);

  useEffect(() => {
    if (!onBreadcrumbChange) return;
    if (!detailSession) {
      onBreadcrumbChange([]);
      return;
    }
    onBreadcrumbChange([{ label: detailSession.subject }, { label: detailSession.title }]);
  }, [detailSession, onBreadcrumbChange]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleReserve = (sessionId: number) => {
    if (!isSignedIn) {
      onNavigate?.('signin');
      return;
    }
    reserveSession(sessionId);
    addNotification(`Reserved spot in session #${sessionId}`);
    showToast('Spot reserved successfully.');
  };

  const handleAddToCalendar = (session: (typeof displaySessions)[number]) => {
    const dateStr = session.date.replace(/-/g, '');
    const timeParts = session.time.split(/\s*[–-]\s*/);
    const parseTo24h = (t: string) => {
      const m = t.trim().match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (!m) return { h: 10, min: 0 };
      let h = parseInt(m[1], 10);
      const min = parseInt(m[2], 10);
      if (m[3].toUpperCase() === 'PM' && h !== 12) h += 12;
      if (m[3].toUpperCase() === 'AM' && h === 12) h = 0;
      return { h, min };
    };
    const start = parseTo24h(timeParts[0] ?? '10:00 AM');
    const end = parseTo24h(timeParts[1] ?? timeParts[0] ?? '11:00 AM');
    const dtStart = `${dateStr}T${String(start.h).padStart(2, '0')}${String(start.min).padStart(2, '0')}00`;
    const dtEnd = `${dateStr}T${String(end.h).padStart(2, '0')}${String(end.min).padStart(2, '0')}00`;
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `SUMMARY:${session.title}`,
      `DESCRIPTION:${session.description}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.title.replace(/\s+/g, '_')}.ics`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Calendar event downloaded.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold font-[family-name:var(--font-display)]" style={{ color: 'var(--text)' }}>
            Schedule
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Discover and join live tutoring sessions
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-colors min-h-[44px] sm:w-auto w-full justify-center"
          style={{
            backgroundColor: showFilters ? 'var(--brand)' : 'var(--card)',
            color: showFilters ? '#FFFFFF' : 'var(--text)',
            borderColor: showFilters ? 'var(--brand)' : 'var(--border)',
          }}
        >
          <Filter size={16} />
          Filters
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div className="inline-flex rounded-lg p-1" style={{ backgroundColor: 'var(--bg)' }}>
          <button
            onClick={() => setViewMode('all')}
            className="px-4 py-2 rounded-md text-sm font-medium transition-all min-h-[36px]"
            style={{
              backgroundColor: viewMode === 'all' ? 'var(--card)' : 'transparent',
              color: viewMode === 'all' ? 'var(--text)' : 'var(--text-secondary)',
              boxShadow: viewMode === 'all' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
            }}
          >
            All Sessions
          </button>
          <button
            onClick={() => setViewMode('my')}
            className="px-4 py-2 rounded-md text-sm font-medium transition-all min-h-[36px]"
            style={{
              backgroundColor: viewMode === 'my' ? 'var(--card)' : 'transparent',
              color: viewMode === 'my' ? 'var(--text)' : 'var(--text-secondary)',
              boxShadow: viewMode === 'my' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
            }}
          >
            My Sessions
          </button>
        </div>
      </div>

      <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />

      {showFilters && (
        <div className="rounded-xl p-4 border animate-scale-in" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Filters</h3>
            <button onClick={() => setShowFilters(false)} className="p-1 min-w-[44px] min-h-[44px] flex items-center justify-center" style={{ color: 'var(--text-secondary)' }}>
              <X size={18} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['Subject', 'Level', 'Type', 'Format'].map(label => (
              <div key={label}>
                <label className="text-xs font-medium block mb-1" style={{ color: 'var(--text-secondary)' }}>{label}</label>
                <select
                  className="w-full px-3 py-2.5 rounded-lg text-sm border-transparent focus:outline-none min-h-[44px]"
                  style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}
                >
                  <option>All</option>
                  {label === 'Subject' && (
                    <>
                      <option>Physics</option>
                      <option>Chemistry</option>
                      <option>Biology</option>
                      <option>Earth Science</option>
                    </>
                  )}
                  {label === 'Level' && (
                    <>
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </>
                  )}
                  {label === 'Type' && (
                    <>
                      <option>Tutoring</option>
                      <option>Study Group</option>
                      <option>Workshop</option>
                    </>
                  )}
                  {label === 'Format' && (
                    <>
                      <option>Video</option>
                      <option>Text-based</option>
                    </>
                  )}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      <div key={selectedDateKey + viewMode} className="space-y-3 animate-tab-enter">
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} - {filteredSessions.length} sessions
        </p>
        {filteredSessions.map(session => (
          <SessionCard
            key={session.id}
            session={session}
            onViewDetails={() => setDetailSessionId(session.id)}
            onReserve={() => handleReserve(session.id)}
          />
        ))}
        {filteredSessions.length === 0 && (
          <div className="text-center py-12 rounded-xl" style={{ backgroundColor: 'var(--card)' }}>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No sessions found for this day.</p>
          </div>
        )}
      </div>

      {detailSession && (
        <SessionDetailsDrawer
          session={detailSession}
          onClose={() => setDetailSessionId(null)}
          onReserve={() => handleReserve(detailSession.id)}
          onAddToCalendar={() => handleAddToCalendar(detailSession)}
        />
      )}

      {toastMsg && (
        <div className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="px-5 py-3 rounded-xl shadow-lg text-sm font-medium" style={{ backgroundColor: 'var(--text)', color: 'var(--bg)' }}>
            {toastMsg}
          </div>
        </div>
      )}
    </div>
  );
}
