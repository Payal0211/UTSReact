// DateNav.jsx
// Plain props in, plain callbacks out — parent owns date/period state.
// The calendar behind the 📅 button changes shape based on `period`:
//   daily     -> native <input type="date">   (day picker)
//   weekly    -> native <input type="week">   (week picker)
//   monthly   -> native <input type="month">  (month picker)
//   quarterly -> custom popover (year nav + Q1..Q4 grid) — no native
//               HTML input type covers quarters, so browsers can't help here.

import React, { useRef, useState, useEffect } from 'react';
import {
    periodLabel,
    toDateInputValue, toMonthInputValue, fromMonthInputValue,
    toWeekInputValue, fromWeekInputValue,
} from './dateNavUtils';

const PERIOD_META = {
    D: { p: 'daily', title: 'Daily' },
    W: { p: 'weekly', title: 'Weekly' },
    M: { p: 'monthly', title: 'Monthly' },
    Q: { p: 'quarterly', title: 'Quarterly' },
};
const LONG_TO_SHORT = { daily: 'D', weekly: 'W', monthly: 'M', quarterly: 'Q' };

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
        const input = dateInputRef.current;
        if (!input) return;
        if (input.showPicker) input.showPicker();
        else input.click();
    };

    // Close the quarter popover on outside click.
    useEffect(() => {
        if (!quarterPickerOpen) return;
        const handleClick = (e) => {
            if (quarterPickerRef.current && !quarterPickerRef.current.contains(e.target)) {
                setQuarterPickerOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [quarterPickerOpen]);

    // ---- native input value + parser per period ----
    let inputType = 'date';
    let inputValue = toDateInputValue(date);
    let parseInput = (str) => new Date(str);

    if (period === 'weekly') {
        inputType = 'week';
        inputValue = toWeekInputValue(date);
        parseInput = fromWeekInputValue;
    } else if (period === 'monthly') {
        inputType = 'month';
        inputValue = toMonthInputValue(date);
        parseInput = fromMonthInputValue;
    }

    const currentQuarter = Math.floor(date.getMonth() / 3) + 1;

    return (
        <div className="controls">
            <span className={`sync-dot${!loading ? ' show' : ''}`} title={loading ? 'Loading…' : 'Loaded'} />

            <div className="date-nav" style={{ position: 'relative' }}>
                <button type="button" onClick={goPrev}>‹</button>
                <span className="label">{periodLabel(period, date)}</span>
                <button type="button" onClick={goNext}>›</button>

                <button type="button" className="cal-btn" title="Pick a date" onClick={openCalendar}>📅</button>

                {period !== 'quarterly' && (
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
                                style={{width:'60px'}}
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
