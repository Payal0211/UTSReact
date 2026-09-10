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
    if (period === 'daily') {
        return anchor.toLocaleDateString('en-GB', {
            weekday: 'short', day: '2-digit', month: 'short', year: '2-digit',
        });
    }
    if (period === 'weekly') {
        const s = startOfWeek(anchor);
        const e = new Date(s);
        e.setDate(s.getDate() + 6);
        return `${fmtShort(s)} – ${fmtShort(e)} ${e.getFullYear()}`;
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
    if (period === 'daily') return { from: iso(anchor), to: iso(anchor) };
    if (period === 'weekly') {
        const s = startOfWeek(anchor);
        const e = new Date(s);
        e.setDate(s.getDate() + 6);
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

