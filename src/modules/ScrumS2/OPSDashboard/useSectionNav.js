// useSectionNav.js
// One call to this hook = one section's worth of date-nav state
// (equivalent to one entry in the original `sections` object).
//
// Usage:
//   const funnelNav = useSectionNav({ initialPeriod: 'weekly', onPeriodOrDateChange: fetchFunnelData });
//
// `onPeriodOrDateChange(range, period, anchor)` is called whenever the
// visible period changes — wire it to your existing DAO call
// (e.g. TaDashboardDAO.getFunnelDataDAO(range)) instead of window.storage,
// since this is a real app screen, not a self-contained artifact.

import { useState, useCallback, useEffect, useRef } from 'react';
import { periodLabel, periodId, periodRange, shiftAnchor } from './dateNavUtils';

const PERIOD_KEYS = { D: 'daily', W: 'weekly', M: 'monthly', Q: 'quarterly' };
const KEY_TO_SHORT = { daily: 'D', weekly: 'W', monthly: 'M', quarterly: 'Q' };

export default function useSectionNav({
    initialPeriod = 'daily',   // accepts 'daily' | 'weekly' | 'monthly' | 'quarterly' OR 'D'/'W'/'M'/'Q'
    initialAnchor = new Date(),
    onPeriodOrDateChange, // optional: (range, period, anchor) => void | Promise<void>
    onDirty,               // optional: called immediately on any change, before the fetch resolves — good for the sync-dot "unsaved" flash
} = {}) {
    const normalizedInitial = PERIOD_KEYS[initialPeriod] || initialPeriod;
    const [period, setPeriodState] = useState(normalizedInitial);
    const [anchor, setAnchor] = useState(initialAnchor);
    const [isSyncing, setIsSyncing] = useState(false);

    // Guards against calling onPeriodOrDateChange during the very first render
    // (the original fired one initial load per section at startup via init(),
    // which is naturally covered by a normal data-fetching effect on mount).
    const didMountRef = useRef(false);

    const notifyChange = useCallback(async (nextPeriod, nextAnchor) => {
        onDirty?.();
        if (!onPeriodOrDateChange) return;
        setIsSyncing(true);
        try {
            const range = periodRange(nextPeriod, nextAnchor);
            await onPeriodOrDateChange(range, nextPeriod, nextAnchor);
        } finally {
            setIsSyncing(false);
        }
    }, [onPeriodOrDateChange, onDirty]);

    useEffect(() => {
        if (!didMountRef.current) {
            didMountRef.current = true;
            notifyChange(period, anchor); // initial load, mirrors the original's init()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setPeriod = useCallback((nextPeriodShortOrLong) => {
        const next = PERIOD_KEYS[nextPeriodShortOrLong] || nextPeriodShortOrLong;
        if (next === period) return;
        setPeriodState(next);
        notifyChange(next, anchor);
    }, [period, anchor, notifyChange]);

    const shift = useCallback((dir) => {
        setAnchor((prev) => {
            const next = shiftAnchor(period, prev, dir);
            notifyChange(period, next);
            return next;
        });
    }, [period, notifyChange]);

    const goToToday = useCallback(() => {
        const next = new Date();
        setAnchor(next);
        notifyChange(period, next);
    }, [period, notifyChange]);

    const setExactDate = useCallback((isoOrDate) => {
        const next = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
        setAnchor(next);
        notifyChange(period, next);
    }, [period, notifyChange]);

    return {
        // raw state, if you need it
        period,          // 'daily' | 'weekly' | 'monthly' | 'quarterly'
        periodShort: KEY_TO_SHORT[period], // 'D' | 'W' | 'M' | 'Q' — matches the toggle buttons
        anchor,
        isSyncing,

        // derived/display helpers
        label: periodLabel(period, anchor),
        id: periodId(period, anchor),
        range: periodRange(period, anchor),

        // actions
        setPeriod,       // accepts 'D'/'W'/'M'/'Q' or 'daily'/'weekly'/'monthly'/'quarterly'
        shift,           // shift(-1) / shift(1)
        goToToday,
        setExactDate,    // accepts a Date or an 'YYYY-MM-DD' string (from <input type="date">)
    };
}
