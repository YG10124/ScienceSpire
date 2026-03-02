import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
}

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
    return new Date(year, month, 1).getDay();
}

function isSameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function Calendar({ selectedDate, onSelectDate }: CalendarProps) {
    const today = useMemo(() => new Date(), []);
    const [viewMonth, setViewMonth] = useState(selectedDate.getMonth());
    const [viewYear, setViewYear] = useState(selectedDate.getFullYear());

    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfWeek(viewYear, viewMonth);

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };

    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    // Build the 7-day strip for mobile
    const mobileStrip = useMemo(() => {
        const result: Date[] = [];
        const start = new Date(selectedDate);
        start.setDate(start.getDate() - 3);
        for (let i = 0; i < 7; i++) {
            const d = new Date(start);
            d.setDate(d.getDate() + i);
            result.push(d);
        }
        return result;
    }, [selectedDate]);

    return (
        <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            {/* ====== DESKTOP: Full Month Grid ====== */}
            <div className="hidden lg:block">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold font-[family-name:var(--font-display)]" style={{ color: 'var(--text)' }}>
                        {MONTH_NAMES[viewMonth]} {viewYear}
                    </h3>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={prevMonth}
                            className="p-2 rounded-lg min-w-[36px] min-h-[36px] flex items-center justify-center transition-colors"
                            style={{ color: 'var(--text-secondary)' }}
                            aria-label="Previous month"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={() => { setViewMonth(today.getMonth()); setViewYear(today.getFullYear()); onSelectDate(today); }}
                            className="px-3 py-1 rounded-lg text-xs font-medium min-h-[36px] transition-colors"
                            style={{ color: 'var(--brand)' }}
                        >
                            Today
                        </button>
                        <button
                            onClick={nextMonth}
                            className="p-2 rounded-lg min-w-[36px] min-h-[36px] flex items-center justify-center transition-colors"
                            style={{ color: 'var(--text-secondary)' }}
                            aria-label="Next month"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Day names header */}
                <div className="grid grid-cols-7 gap-1 mb-1">
                    {DAY_NAMES.map(d => (
                        <div key={d} className="text-center text-[10px] font-semibold py-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                            {d}
                        </div>
                    ))}
                </div>

                {/* Calendar days grid */}
                <div className="grid grid-cols-7 gap-1">
                    {/* Empty cells for days before first day of month */}
                    {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`empty-${i}`} className="h-9" />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const dayDate = new Date(viewYear, viewMonth, i + 1);
                        const isSelected = isSameDay(dayDate, selectedDate);
                        const isToday = isSameDay(dayDate, today);

                        return (
                            <button
                                key={i}
                                onClick={() => onSelectDate(dayDate)}
                                className="h-9 rounded-lg text-sm font-medium transition-all flex items-center justify-center"
                                style={{
                                    backgroundColor: isSelected ? 'var(--brand)' : 'transparent',
                                    color: isSelected ? '#FFFFFF' : isToday ? 'var(--brand)' : 'var(--text)',
                                    fontWeight: isToday || isSelected ? 700 : 500,
                                    border: isToday && !isSelected ? '2px solid var(--brand)' : '2px solid transparent',
                                }}
                                aria-label={`${dayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`}
                                aria-pressed={isSelected}
                            >
                                {i + 1}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ====== MOBILE: Horizontal Date Strip ====== */}
            <div className="lg:hidden">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                        {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </h3>
                </div>
                <div className="flex items-center gap-1 overflow-x-auto pb-1 -mx-1 px-1">
                    <button
                        onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() - 1); onSelectDate(d); }}
                        className="p-2 rounded-lg shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
                        style={{ color: 'var(--text-secondary)' }}
                        aria-label="Previous day"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    {mobileStrip.map((day, i) => {
                        const isSelected = isSameDay(day, selectedDate);
                        const isToday = isSameDay(day, today);
                        return (
                            <button
                                key={i}
                                onClick={() => onSelectDate(day)}
                                className="flex flex-col items-center px-3 py-2 rounded-xl min-w-[52px] min-h-[56px] transition-all"
                                style={{
                                    backgroundColor: isSelected ? 'var(--brand)' : 'transparent',
                                    color: isSelected ? '#FFFFFF' : isToday ? 'var(--brand)' : 'var(--text-secondary)',
                                }}
                            >
                                <span className="text-[10px] font-medium uppercase">
                                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                                </span>
                                <span className="text-lg font-bold">{day.getDate()}</span>
                            </button>
                        );
                    })}
                    <button
                        onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() + 1); onSelectDate(d); }}
                        className="p-2 rounded-lg shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
                        style={{ color: 'var(--text-secondary)' }}
                        aria-label="Next day"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
