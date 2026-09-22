// DateNav.jsx
// Plain props in, plain callbacks out — parent owns date/period state.
// The calendar behind the 📅 button changes shape based on `period`:
//   daily     -> native <input type="date">    (day picker)
//   weekly    -> custom popover (month nav + W1..W5 grid) — month-relative
//               week-of-month, matching the backend's Tab_Value scheme
//               (W1-W5), NOT the ISO week the native <input type="week">
//               would give you.
//   monthly   -> native <input type="month">   (month picker)
//   quarterly -> custom popover (year nav + Q1..Q4 grid) — no native
//               HTML input type covers quarters, so browsers can't help here.

import React, { useRef, useState, useEffect } from 'react';
import {
    periodLabel,
    toDateInputValue, toMonthInputValue, fromMonthInputValue,
} from './dateNavUtils';

const PERIOD_META = {
    D: { p: 'daily', title: 'Daily' },
    W: { p: 'weekly', title: 'Weekly' },
    M: { p: 'monthly', title: 'Monthly' },
    Q: { p: 'quarterly', title: 'Quarterly' },
};
const LONG_TO_SHORT = { daily: 'D', weekly: 'W', monthly: 'M', quarterly: 'Q' };

/** Days in a given year/month (month is 0-indexed, JS Date convention). */
function daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

/** Month-relative week number (1-5) for a date — Math.ceil(dayOfMonth / 7). */
function weekOfMonth(date) {
    return Math.ceil(date.getDate() / 7);
}

export default function DateNav({
    date,              // Date object
    period,            // 'daily' | 'weekly' | 'monthly' | 'quarterly'
    periods = ['D', 'W', 'M', 'Q'],
    onDateChange,      // (newDate: Date) => void
    onPeriodChange,    // (newPeriod: 'daily'|'weekly'|'monthly'|'quarterly') => void
    loading = false,    // dims the status dot while a fetch is in flight
}) {
    const dateInputRef = useRef(null);

    const [quarterPickerOpen, setQuarterPickerOpen] = useState(false);
    const quarterPickerRef = useRef(null);

    const [weekPickerOpen, setWeekPickerOpen] = useState(false);
    const weekPickerRef = useRef(null);

    const goPrev = () => onDateChange(shiftBy(-1));
    const goNext = () => onDateChange(shiftBy(1));
    const goToday = () => onDateChange(new Date());

    function shiftBy(dir) {
        const d = new Date(date);
        if (period === 'daily') d.setDate(d.getDate() + dir);
        else if (period === 'weekly') d.setDate(d.getDate() + 7 * dir);
        else if (period === 'monthly') d.setMonth(d.getMonth() + dir);
        else if (period === 'quarterly') d.setMonth(d.getMonth() + 3 * dir);
        return d;
    }

    const openCalendar = () => {
        if (period === 'quarterly') {
            setQuarterPickerOpen((open) => !open);
            return;
        }
        if (period === 'weekly') {
            setWeekPickerOpen((open) => !open);
            return;
        }
        const input = dateInputRef.current;
        if (!input) return;
        if (input.showPicker) input.showPicker();
        else input.click();
    };

    // Close either popover on outside click.
    useEffect(() => {
        if (!quarterPickerOpen && !weekPickerOpen) return;
        const handleClick = (e) => {
            if (quarterPickerOpen && quarterPickerRef.current && !quarterPickerRef.current.contains(e.target)) {
                setQuarterPickerOpen(false);
            }
            if (weekPickerOpen && weekPickerRef.current && !weekPickerRef.current.contains(e.target)) {
                setWeekPickerOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [quarterPickerOpen, weekPickerOpen]);

    // ---- native input value + parser (daily / monthly only) ----
    let inputType = 'date';
    let inputValue = toDateInputValue(date);
    let parseInput = (str) => new Date(str);

    if (period === 'monthly') {
        inputType = 'month';
        inputValue = toMonthInputValue(date);
        parseInput = fromMonthInputValue;
    }

    const currentQuarter = Math.floor(date.getMonth() / 3) + 1;
    const currentWeek = weekOfMonth(date);
    const weeksInCurrentMonth = Math.ceil(daysInMonth(date.getFullYear(), date.getMonth()) / 7);
    const weekPopoverMonthLabel = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const goToWeekPopoverMonth = (dir) => {
        onDateChange(new Date(date.getFullYear(), date.getMonth() + dir, 1));
    };

    const pickWeek = (n) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = Math.min((n - 1) * 7 + 1, daysInMonth(year, month));
        onDateChange(new Date(year, month, day));
        setWeekPickerOpen(false);
    };

    return (
        <div className="controls">
            <span className={`sync-dot${!loading ? ' show' : ''}`} title={loading ? 'Loading…' : 'Loaded'} />

            <div className="date-nav" style={{ position: 'relative' }}>
                <button type="button" onClick={goPrev}>‹</button>
                <span className="label">{periodLabel(period, date)}</span>
                <button type="button" onClick={goNext}>›</button>

                <button type="button" className="cal-btn" title="Pick a date" onClick={openCalendar}>📅</button>

                {period !== 'quarterly' && period !== 'weekly' && (
                    <input
                        ref={dateInputRef}
                        type={inputType}
                        className="date-picker"
                        value={inputValue}
                        onChange={(e) => e.target.value && onDateChange(parseInput(e.target.value))}
                    />
                )}

                {period === 'quarterly' && quarterPickerOpen && (
                    <div ref={quarterPickerRef} className="quarter-popover">
                        <div className="quarter-popover-year">
                            <button type="button" onClick={() => onDateChange(new Date(date.getFullYear() - 1, date.getMonth(), 1))}>‹</button>
                            <span>{date.getFullYear()}</span>
                            <button type="button" onClick={() => onDateChange(new Date(date.getFullYear() + 1, date.getMonth(), 1))}>›</button>
                        </div>
                        <div className="quarter-popover-grid">
                            {[1, 2, 3, 4].map((q) => (
                                <button
                                    style={{ width: '60px' }}
                                    key={q}
                                    type="button"
                                    className={q === currentQuarter ? 'active' : ''}
                                    onClick={() => {
                                        onDateChange(new Date(date.getFullYear(), (q - 1) * 3, 1));
                                        setQuarterPickerOpen(false);
                                    }}
                                >
                                    Q{q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {period === 'weekly' && weekPickerOpen && (
                    <div ref={weekPickerRef} className="quarter-popover">
                        <div className="quarter-popover-year">
                            <button type="button" onClick={() => goToWeekPopoverMonth(-1)}>‹</button>
                            <span>{weekPopoverMonthLabel}</span>
                            <button type="button" onClick={() => goToWeekPopoverMonth(1)}>›</button>
                        </div>
                        <div className="quarter-popover-grid">
                            {[1, 2, 3, 4, 5].map((w) => {
                                const disabled = w > weeksInCurrentMonth;
                                return (
                                    <button
                                        style={{ width: '60px' }}
                                        key={w}
                                        type="button"
                                        disabled={disabled}
                                        className={w === currentWeek && !disabled ? 'active' : ''}
                                        onClick={() => pickWeek(w)}
                                    >
                                        W{w}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* <button type="button" className="today-btn" onClick={goToday}>Today</button> */}

            <div className="period-toggle">
                {periods.map((shortKey) => {
                    const meta = PERIOD_META[shortKey];
                    return (
                        <button
                            key={shortKey}
                            type="button"
                            title={meta.title}
                            className={LONG_TO_SHORT[period] === shortKey ? 'active' : ''}
                            onClick={() => onPeriodChange(meta.p)}
                        >
                            {shortKey}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
