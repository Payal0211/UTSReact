// sectionMath.js
export function pctOf(goal, achieved) {
    const g = parseFloat(goal);
    const a = parseFloat(achieved);
    if (isNaN(g) || isNaN(a) || g === 0) return null;
    return Math.round((a / g) * 100);
}

export function statusClass(pct) {
    if (+pct === null) return 'status-none';
    if (+pct >= 90) return 'status-good';
    if (+pct >= 60) return 'status-warn';
    return 'status-bad';
}

export function metricStatus(goalStr, achievedStr) {
    const g = parseFloat(goalStr);
    const a = parseFloat(achievedStr);
    if (isNaN(g) || isNaN(a) || g === 0) return '';
    if (a <= g) return 'metric-good';
    if (a <= g * 1.2) return 'metric-warn';
    return 'metric-bad';
}
