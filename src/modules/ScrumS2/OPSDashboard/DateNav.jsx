// DateNav.jsx
// Plain props in, plain callbacks out — parent owns date/period state.
// Only TWO props carry the actual value: `date` and `onDateChange`. For
// daily/weekly/monthly/quarterly, `date` is a single Date, same as before.
// For 'range', `date` is instead a { from: Date, to: Date } object — no
// separate range/onRangeChange props needed, since periodRange() already
// produces a {from,to} shape for every period type (month/quarter included),
// so a range is just "that same shape, chosen directly instead of derived
// from one anchor point."
//
// The calendar behind the 📅 button changes shape based on `period`:
//   daily     -> native <input type="date">    (day picker)
//   weekly    -> custom popover (month nav + W1..W5 grid) — month-relative
//               week-of-month, matching the backend's Tab_Value scheme
//               (W1-W5), NOT the ISO week the native <input type="week">
//               would give you.
//   monthly   -> native <input type="month">   (month picker)
//   quarterly -> custom popover (year nav + Q1..Q4 grid) — no native
//               HTML input type covers quarters, so browsers can't help here.
//   range     -> custom popover with two <input type="date"> fields
//               (From / To) + an Apply button.

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
    R: { p: 'range', title: 'Range' },
};
const LONG_TO_SHORT = { daily: 'D', weekly: 'W', monthly: 'M', quarterly: 'Q', range: 'R' };

/** Days in a given year/month (month is 0-indexed, JS Date convention). */
function daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

/** Month-relative week number (1-5) for a date — Math.ceil(dayOfMonth / 7). */
function weekOfMonth(date) {
    return Math.ceil(date.getDate() / 7);
}

/** "01 Sep 2026" style, for the range label. */
function fmtRangeDate(d) {
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** True when `value` is a {from,to} range object rather than a plain Date. */
function isRangeValue(value) {
    return !!value && typeof value === 'object' && value.from instanceof Date && value.to instanceof Date;
}

export default function DateNav({
    date,              // Date, for D/W/M/Q — OR { from: Date, to: Date }, for Range
    period,            // 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'range'
    periods = ['D', 'W', 'M', 'Q'],   // include 'R' here to show the Range chip
    onDateChange,      // (newValue: Date | { from: Date, to: Date }) => void
    onPeriodChange,    // (newPeriod: string) => void
    loading = false,    // dims the status dot while a fetch is in flight
}) {
    const dateInputRef = useRef(null);

    const [quarterPickerOpen, setQuarterPickerOpen] = useState(false);
    const quarterPickerRef = useRef(null);

    const [weekPickerOpen, setWeekPickerOpen] = useState(false);
    const weekPickerRef = useRef(null);

    const [rangePickerOpen, setRangePickerOpen] = useState(false);
    const rangePickerRef = useRef(null);

    const currentRange = isRangeValue(date) ? date : null;
    const [pendingFrom, setPendingFrom] = useState(currentRange?.from ?? new Date());
    const [pendingTo, setPendingTo] = useState(currentRange?.to ?? new Date());

    // For D/W/M/Q, `date` is always a plain Date — fall back to "now" if the
    // parent happens to be mid-transition (e.g. just switched period types
    // and hasn't handed back a fresh value yet).
    const singleDate = isRangeValue(date) ? new Date() : (date ?? new Date());

    const goPrev = () => onDateChange(shiftBy(-1));
    const goNext = () => onDateChange(shiftBy(1));
    const goToday = () => onDateChange(new Date());

    function shiftBy(dir) {
        const d = new Date(singleDate);
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
        if (period === 'range') {
            // Reset the pending fields to the current committed range each
            // time the popover opens, so a cancelled edit doesn't linger.
            setPendingFrom(currentRange?.from ?? new Date());
            setPendingTo(currentRange?.to ?? new Date());
            setRangePickerOpen((open) => !open);
            return;
        }
        const input = dateInputRef.current;
        if (!input) return;
        if (input.showPicker) input.showPicker();
        else input.click();
    };

    // Close any open popover on outside click.
    useEffect(() => {
        if (!quarterPickerOpen && !weekPickerOpen && !rangePickerOpen) return;
        const handleClick = (e) => {
            if (quarterPickerOpen && quarterPickerRef.current && !quarterPickerRef.current.contains(e.target)) {
                setQuarterPickerOpen(false);
            }
            if (weekPickerOpen && weekPickerRef.current && !weekPickerRef.current.contains(e.target)) {
                setWeekPickerOpen(false);
            }
            if (rangePickerOpen && rangePickerRef.current && !rangePickerRef.current.contains(e.target)) {
                setRangePickerOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [quarterPickerOpen, weekPickerOpen, rangePickerOpen]);

    // ---- native input value + parser (daily / monthly only) ----
    let inputType = 'date';
    let inputValue = toDateInputValue(singleDate);
    let parseInput = (str) => new Date(str);

    if (period === 'monthly') {
        inputType = 'month';
        inputValue = toMonthInputValue(singleDate);
        parseInput = fromMonthInputValue;
    }

    const currentQuarter = Math.floor(singleDate.getMonth() / 3) + 1;
    const currentWeek = weekOfMonth(singleDate);
    const weeksInCurrentMonth = Math.ceil(daysInMonth(singleDate.getFullYear(), singleDate.getMonth()) / 7);
    const weekPopoverMonthLabel = singleDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const goToWeekPopoverMonth = (dir) => {
        onDateChange(new Date(singleDate.getFullYear(), singleDate.getMonth() + dir, 1));
    };

    const pickWeek = (n) => {
        const year = singleDate.getFullYear();
        const month = singleDate.getMonth();
        const day = Math.min((n - 1) * 7 + 1, daysInMonth(year, month));
        onDateChange(new Date(year, month, day));
        setWeekPickerOpen(false);
    };

    const applyRange = () => {
        if (pendingTo < pendingFrom) return; // ignore an invalid (to < from) selection
        onDateChange({ from: pendingFrom, to: pendingTo });
        setRangePickerOpen(false);
    };

    // Clicking the R chip only flips `period` — but `date` won't become a
    // {from,to} object until Apply is pressed in the popover, and switching
    // AWAY from range doesn't automatically turn it back into a plain Date
    // either. Left alone, either direction leaves date's shape out of sync
    // with period for one render, which crashes anything downstream reading
    // date.getMonth() or date.from (e.g. periodRange). So both transitions
    // fix date's shape in the same click, before onPeriodChange fires.
    const handlePeriodClick = (newPeriod) => {
        if (newPeriod === 'range' && !currentRange) {
            const today = new Date();
            onDateChange({ from: today, to: today });
        } else if (newPeriod !== 'range' && currentRange) {
            onDateChange(currentRange.from ?? new Date());
        }
        onPeriodChange(newPeriod);
    };

    // The label shown between the ‹ › arrows for whichever period is active.
    const label = period === 'range'
        ? (currentRange ? `${fmtRangeDate(currentRange.from)} – ${fmtRangeDate(currentRange.to)}` : 'Select range')
        : periodLabel(period, singleDate);

    return (
        <div className="controls">
            <span className={`sync-dot${!loading ? ' show' : ''}`} title={loading ? 'Loading…' : 'Loaded'} />

            <div className="date-nav" style={{ position: 'relative' }}>
                {/* Shifting by "one period" isn't a defined concept for an
                    arbitrary custom range, so the arrows are inert there —
                    the popover (via the calendar button) is the only way
                    to change a range. */}
                <button type="button" onClick={goPrev} disabled={period === 'range'}>‹</button>
                <span className="label">{label}</span>
                <button type="button" onClick={goNext} disabled={period === 'range'}>›</button>

                <button type="button" className="cal-btn" title="Pick a date" onClick={openCalendar}>📅</button>

                {period !== 'quarterly' && period !== 'weekly' && period !== 'range' && (
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
                            <button type="button" onClick={() => onDateChange(new Date(singleDate.getFullYear() - 1, singleDate.getMonth(), 1))}>‹</button>
                            <span>{singleDate.getFullYear()}</span>
                            <button type="button" onClick={() => onDateChange(new Date(singleDate.getFullYear() + 1, singleDate.getMonth(), 1))}>›</button>
                        </div>
                        <div className="quarter-popover-grid">
                            {[1, 2, 3, 4].map((q) => (
                                <button
                                    style={{ width: '60px' }}
                                    key={q}
                                    type="button"
                                    className={q === currentQuarter ? 'active' : ''}
                                    onClick={() => {
                                        onDateChange(new Date(singleDate.getFullYear(), (q - 1) * 3, 1));
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

                {period === 'range' && rangePickerOpen && (
                    <div ref={rangePickerRef} className="quarter-popover range-popover">
                        <div className="range-popover-field">
                            <label>From</label>
                            <input
                                type="date"
                                value={toDateInputValue(pendingFrom)}
                                onChange={(e) => e.target.value && setPendingFrom(new Date(e.target.value))}
                            />
                        </div>
                        <div className="range-popover-field">
                            <label>To</label>
                            <input
                                type="date"
                                value={toDateInputValue(pendingTo)}
                                onChange={(e) => e.target.value && setPendingTo(new Date(e.target.value))}
                            />
                        </div>
                        {pendingTo < pendingFrom && (
                            <div className="range-popover-error">"To" can't be before "From"</div>
                        )}
                        <button type="button" className="range-popover-apply" onClick={applyRange}>
                            Apply
                        </button>
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
                            onClick={() => handlePeriodClick(meta.p)}
                        >
                            {shortKey}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
