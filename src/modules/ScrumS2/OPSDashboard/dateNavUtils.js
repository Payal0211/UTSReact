// dateNavUtils.js
// Plain functions, no React. Ported directly from the original dashboard's
// vanilla-JS date logic (startOfWeek, periodLabel, shiftAnchor).

export function startOfWeek(d) {
    const res = new Date(d);
    const day = (res.getDay() + 6) % 7; // Mon=0 ... Sun=6
    res.setDate(res.getDate() - day);
    res.setHours(0, 0, 0, 0);
    return res;
}

export function fmtShort(d) {
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

/** Days in a given year/month (month is 0-indexed). */
export function daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

/** Month-relative week number (1-5) for a date — Math.ceil(dayOfMonth / 7). */
export function weekOfMonth(date) {
    return Math.ceil(date.getDate() / 7);
}

/**
 * yyyy-mm-dd built from the Date's LOCAL components — never use
 * `.toISOString()` for this. toISOString() converts to UTC first, so in any
 * timezone ahead of UTC (e.g. IST, UTC+5:30) a local midnight Date rolls
 * back to the previous day once converted — which is exactly what was
 * causing monthly/quarterly ranges to be off by one.
 */
export function toLocalISODate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

/** The label shown between the ‹ › arrows, e.g. "Mon, 07 Sept 26" or "Q3 2026". */
export function periodLabel(period, anchor) {
    if (period === 'range') {
        // Defensive fallback — DateNav.jsx computes its own "From – To" label
        // for Range mode internally and doesn't call this, but any other
        // caller that passes period='range' straight through (e.g. a table
        // header rendering periodLabel(dateType, date) directly) would
        // otherwise hit the same "anchor is {from,to}, not a Date" crash.
        if (anchor && anchor.from instanceof Date && anchor.to instanceof Date) {
            const fmt = (d) => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
            return `${fmt(anchor.from)} – ${fmt(anchor.to)}`;
        }
        return 'Select range';
    }

    // Same one-render mismatch risk as periodRange — normalize defensively.
    if (!(anchor instanceof Date)) {
        anchor = (anchor && anchor.from instanceof Date) ? anchor.from : new Date();
    }

    if (period === 'daily') {
        return anchor.toLocaleDateString('en-GB', {
            weekday: 'short', day: '2-digit', month: 'short', year: '2-digit',
        });
    }
    if (period === 'weekly') {
        // Month-relative week (W1-W5), matching the backend's Tab_Value scheme
        // and the week-picker — NOT the true ISO week, which can spill into
        // the adjacent month and desync Month/Tab_Value from what was picked.
        const n = weekOfMonth(anchor);
        return `Week ${n}, ${anchor.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}`;
    }
    if (period === 'monthly') {
        return anchor.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    }
    if (period === 'quarterly') {
        const q = Math.floor(anchor.getMonth() / 3) + 1;
        return `Q${q} ${anchor.getFullYear()}`;
    }
    return '';
}

/** Moves the anchor forward/back by one unit of the given period. dir is +1 or -1. */
export function shiftAnchor(period, anchor, dir) {
    const d = new Date(anchor);
    if (period === 'daily') d.setDate(d.getDate() + dir);
    else if (period === 'weekly') d.setDate(d.getDate() + 7 * dir);
    else if (period === 'monthly') d.setMonth(d.getMonth() + dir);
    else if (period === 'quarterly') d.setMonth(d.getMonth() + 3 * dir);
    return d;
}

/** [from, to] ISO-date range a period covers — pass this straight to a backend call. */
export function periodRange(period, anchor) {
    const iso = toLocalISODate; // local-safe — see note above toLocalISODate()

    if (period === 'range') {
        // `anchor` is normally { from: Date, to: Date } here — DateNav hands
        // back that exact shape for Range mode (see date/onDateChange in
        // DateNav.jsx). Defensive fallback: if anchor is still a plain Date
        // (e.g. period flipped to 'range' before a range was ever applied),
        // treat it as a same-day range instead of crashing on anchor.from.
        if (anchor && anchor.from instanceof Date && anchor.to instanceof Date) {
            return { from: iso(anchor.from), to: iso(anchor.to) };
        }
        return { from: iso(anchor), to: iso(anchor) };
    }

    // For every other period, `anchor` is supposed to be a plain Date. But
    // the same kind of one-render mismatch can happen in reverse: switching
    // AWAY from 'range' can, for a moment, leave anchor as the old {from,to}
    // object while period has already become 'daily'/'weekly'/etc. DateNav's
    // click handler now fixes this at the source, but normalizing here too
    // means periodRange itself can never crash on anchor.getMonth() no
    // matter what calls it or in what order state updates land.
    if (!(anchor instanceof Date)) {
        anchor = (anchor && anchor.from instanceof Date) ? anchor.from : new Date();
    }

    if (period === 'daily') return { from: iso(anchor), to: iso(anchor) };
    if (period === 'weekly') {
        // Month-relative week (W1-W5) — always stays within anchor's own
        // month/year, so Month/Year/Tab_Value sent to the backend always
        // agree with each other and with whatever the week-picker showed.
        const year = anchor.getFullYear();
        const month = anchor.getMonth();
        const n = weekOfMonth(anchor);
        const startDay = (n - 1) * 7 + 1;
        const endDay = Math.min(n * 7, daysInMonth(year, month));
        const s = new Date(year, month, startDay);
        const e = new Date(year, month, endDay);
        return { from: iso(s), to: iso(e) };
    }
    if (period === 'monthly') {
        const s = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
        const e = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0);
        return { from: iso(s), to: iso(e) };
    }
    if (period === 'quarterly') {
        const qStartMonth = Math.floor(anchor.getMonth() / 3) * 3;
        const s = new Date(anchor.getFullYear(), qStartMonth, 1);
        const e = new Date(anchor.getFullYear(), qStartMonth + 3, 0);
        return { from: iso(s), to: iso(e) };
    }
    return { from: iso(anchor), to: iso(anchor) };
}

// ---------- native <input> value converters, one per period type ----------

/** yyyy-mm-dd for <input type="date">. */
export function toDateInputValue(d) {
    return toLocalISODate(d);
}

/** yyyy-MM for <input type="month">. */
export function toMonthInputValue(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
export function fromMonthInputValue(str) {
    const [y, m] = str.split('-').map(Number);
    return new Date(y, m - 1, 1);
}

/** yyyy-Www (ISO week) for <input type="week">. */
export function toWeekInputValue(d) {
    const target = new Date(d.valueOf());
    const dayNr = (d.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
        target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    const week = 1 + Math.round((firstThursday - target.valueOf()) / (7 * 24 * 3600 * 1000));
    return `${new Date(firstThursday).getFullYear()}-W${String(week).padStart(2, '0')}`;
}
export function fromWeekInputValue(str) {
    const [yearStr, weekStr] = str.split('-W');
    const year = Number(yearStr);
    const week = Number(weekStr);
    const simple = new Date(year, 0, 1 + (week - 1) * 7);
    const dow = simple.getDay();
    const isoStart = new Date(simple);
    if (dow <= 4) isoStart.setDate(simple.getDate() - dow + 1);
    else isoStart.setDate(simple.getDate() + 8 - dow);
    return isoStart;
}

