// DateNavControl.jsx
// Drop-in replacement for the dead <div className="controls">...</div> markup
// repeated in every card-head in OPSDashboard.jsx. Uses the exact same class
// names as the original HTML/CSS (date-nav, period-toggle, sync-dot, etc.)
// so no new styles are needed — opsdStyles.css already covers this.

import React, { useRef } from 'react';

const PERIOD_META = {
    D: { p: 'daily', title: 'Daily', label: 'D' },
    W: { p: 'weekly', title: 'Weekly', label: 'W' },
    M: { p: 'monthly', title: 'Monthly', label: 'M' },
    Q: { p: 'quarterly', title: 'Quarterly', label: 'Q' },
};

/**
 * @param {object} nav - the object returned by useSectionNav()
 * @param {string[]} periods - which toggle buttons to show, e.g. ['D','W','M','Q'] or ['M','Q']
 * @param {string} sectionKey - only used for data-* attributes, kept for parity/debugging with the original markup
 */
export default function DateNavControl({ nav, periods = ['D', 'W', 'M', 'Q'], sectionKey }) {
    const dateInputRef = useRef(null);

    const openNativePicker = () => {
        const input = dateInputRef.current;
        if (!input) return;
        // Modern Chromium/Firefox support showPicker(); older browsers fall back
        // to a synthetic click, matching the original's `if(picker.showPicker)` check.
        if (input.showPicker) {
            input.showPicker();
        } else {
            input.click();
        }
    };

    // yyyy-mm-dd for the native <input type="date"> value
    const isoAnchor = nav.anchor.toISOString().slice(0, 10);

    return (
        <div className="controls">
            <span
                className={`sync-dot${!nav.isSyncing ? ' show' : ''}`}
                data-dot={sectionKey}
                title={nav.isSyncing ? 'Saving…' : 'Saved'}
            />

            <div className="date-nav" data-nav={sectionKey}>
                <button type="button" data-dir="-1" onClick={() => nav.shift(-1)}>
                    ‹
                </button>
                <span className="label" data-label={sectionKey}>
                    {nav.label}
                </span>
                <button type="button" data-dir="1" onClick={() => nav.shift(1)}>
                    ›
                </button>

                <button
                    type="button"
                    className="cal-btn"
                    data-cal={sectionKey}
                    title="Pick a date"
                    onClick={openNativePicker}
                >
                    📅
                </button>
                <input
                    ref={dateInputRef}
                    type="date"
                    className="date-picker"
                    data-picker={sectionKey}
                    value={isoAnchor}
                    onChange={(e) => {
                        if (e.target.value) nav.setExactDate(e.target.value);
                    }}
                />
            </div>

            <button type="button" className="today-btn" data-today={sectionKey} onClick={nav.goToToday}>
                Today
            </button>

            <div className="period-toggle" data-toggle={sectionKey}>
                {periods.map((shortKey) => {
                    const meta = PERIOD_META[shortKey];
                    return (
                        <button
                            key={shortKey}
                            type="button"
                            data-p={meta.p}
                            title={meta.title}
                            className={nav.periodShort === shortKey ? 'active' : ''}
                            onClick={() => nav.setPeriod(shortKey)}
                        >
                            {meta.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
