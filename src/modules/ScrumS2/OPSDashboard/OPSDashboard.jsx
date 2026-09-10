import React, { useState, useEffect,useCallback } from 'react';
import './opsdStyles.css';
import DateNav from './DateNav';
// import { OpsDashboardDAO } from 'core/opsDashboard/opsDashboardDAO'; // TODO: adjust import path to match your project structure
import { periodRange, periodLabel } from './dateNavUtils';
import { pctOf, statusClass, metricStatus } from './sectionMath';
import moment from 'moment';
import { TaDashboardDAO } from "core/taDashboard/taDashboardDRO";

// ---------- column/row config ----------


const TA_COLUMNS = [
    { key: 'tA_PipelineStr', label: 'Pipeline Assigned' },
    { key: 'profilesShared', label: 'Profile Shipped' },
    { key: 'uniqueCalls', label: 'Unique Calls' },
    { key: 'r1InterviewCompleted', label: 'R1 Completed' },
    { key: 'r2InterviewCompleted', label: 'R2 Completed' },
    { key: 'r3InterviewCompleted', label: 'R3 Completed' },
    { key: 'interviewReject', label: 'Interview Rejects' },
    { key: 'selection', label: 'Selection' },
    { key: 'joined', label: 'Joined' },
];

const QUAL_WOW_METRICS = [
    { key: 'avgProfileSelectioninDays', label: 'Avg Selection Time (Days)' },
    { key: 'profiletoSelect', label: 'Profile to Select' },
    { key: 'interviewtoSelect', label: 'Interview to Select' },
];
const QUAL_LOG_METRICS = [
    { key: 'dropout_RevenueStr', label: 'Dropouts' },
    { key: 'backout_RevenueStr', label: 'Backouts' },
    { key: 'postJoinBackout', label: 'Post Joining Backouts' },
];

const TAB_NAME_MAP = { daily: 'D', weekly: 'W', monthly: 'M', quarterly: 'Q' };

// Sorted [{row, idx}] list for a qual table — purely a view convenience,
// local to this component, never sent back to the server.
function sortedIndices(tas, sortCol, sortDir) {
    const indexed = tas.map((row, idx) => ({ row, idx }));
    if (!sortCol) return indexed;
    return indexed.sort((a, b) => {
        const av = parseFloat(a.row[sortCol]);
        const bv = parseFloat(b.row[sortCol]);
        const aNa = isNaN(av);
        const bNa = isNaN(bv);
        if (aNa && bNa) return 0;
        if (aNa) return 1;
        if (bNa) return -1;
        return (av - bv) * sortDir;
    });
}


function OPSDashboard({ selectedHead }) {
    // ============================================================
    // 1. POD PRODUCTIVITY (funnel)
    // ============================================================
    const [podDate, setPODDate] = useState(new Date());
    const [podDateType, setPODDateType] = useState('daily');
    const [funnelData, setFunnelData] = useState([]);
    const [funnelLoading, setFunnelLoading] = useState(true);

    const getDateRangeValue = (dateType, range) => {
        if (dateType === 'daily') {
            // e.g. "2026-09-08"
            return moment(range.from).format('YYYY-MM-DD');
        } else if (dateType === 'weekly') {
            // week-of-month, based on the day-of-month of the week's Monday (range.from)
            // e.g. Monday falls on the 8th -> ceil(8/7) = 2 -> "W2"
            const weekOfMonth = Math.ceil(moment(range.from).date() / 7);
            return `W${weekOfMonth}`;
        } else if (dateType === 'monthly') {
            // e.g. September -> "9" (no leading zero)
            return moment(range.from).format('M');
        } else if (dateType === 'quarterly') {
            return `Q${moment(range.from).quarter()}`; // moment's .quarter() returns 1-4 directly
        }
    }

    const getPODTableDate = async (podDateType, range) => {
        let pl = {
            TAHeadUserID: selectedHead,
            Tab_Name: TAB_NAME_MAP[podDateType] || podDateType,
            Month: moment(range.from).format('MM'),
            Year: moment(range.from).format('YYYY'),
            Tab_Value: getDateRangeValue(podDateType, range)
        }

        setFunnelLoading(true);
        let result = await TaDashboardDAO.getPODTableDataDAO(pl);
        setFunnelLoading(false);

        if (result?.statusCode === 200) {
            setFunnelData(result.responseBody)
        } else {
            setFunnelData([])
        }
    }

    useEffect(() => {

        const range = periodRange(podDateType, podDate);
        getPODTableDate(podDateType, range)
       
    }, [podDate, podDateType, selectedHead]);

    // ============================================================
    // 5. PIPELINE & REVENUE SUMMARY
    // ============================================================
    const [pipelineDate, setPipelineDate] = useState(new Date());
    const [pipelineDateType, setPipelineDateType] = useState('monthly');
    const [pipeData, setPipeData] = useState(null);
    const [pipeLoading, setPipeLoading] = useState(true);

    const getPipelineTableDate = async (pipelineDateType, range) => {
        let pl = {
            TAHeadUserID: selectedHead,
            Tab_Name: TAB_NAME_MAP[pipelineDateType] || pipelineDateType,
            Month: moment(range.from).format('MM'),
            Year: moment(range.from).format('YYYY'),
            Tab_Value: getDateRangeValue(pipelineDateType, range)
        }

        setPipeLoading(true);
        let result = await TaDashboardDAO.getPIPELINETableDataDAO(pl);
        setPipeLoading(false);
        if (result?.statusCode === 200) {
            setPipeData(result.responseBody)
        } else {
            setPipeData([])
        }

    }

    useEffect(() => {

        const range = periodRange(pipelineDateType, pipelineDate);
        getPipelineTableDate(pipelineDateType, range)
        // OpsDashboardDAO.getPipelineDataDAO(range)
        //     .then((res) => setPipeData(res.responseBody))
        //     .finally(() => setPipeLoading(false));
    }, [pipelineDate, pipelineDateType,selectedHead]);

    const pipeNum = (key) => parseFloat(pipeData?.[key]?.revenue) || 0;
    const totalPipeline = pipeData ? pipeNum('carryForward') + pipeNum('addedNew') + pipeNum('addedExisting') : 0;
    const wonPct = totalPipeline === 0 ? null : Math.round((pipeNum('won') / totalPipeline) * 100);

    // ============================================================
    // 2. TEAM PERFORMANCE (ta)
    // ============================================================
    const [performanceDate, setPerformanceDate] = useState(new Date());
    const [performanceDateType, setPerformanceDateType] = useState('weekly');
    const [taData, setTaData] = useState(null);
    const [taLoading, setTaLoading] = useState(true);

     const getTAProformanceTableData = useCallback(async (performanceDateType, range) => {
        let pl = {
            TAHeadUserID: selectedHead,
            Tab_Name: TAB_NAME_MAP[performanceDateType] || performanceDateType,
            Month: moment(range.from).format('MM'),
            Year: moment(range.from).format('YYYY'),
            Tab_Value: getDateRangeValue(performanceDateType, range)
        }

        setTaLoading(true);
        let result = await TaDashboardDAO.getTAProformanceTableDataDAO(pl);
        setTaLoading(false);
        if (result?.statusCode === 200) {
            setTaData(result.responseBody)
        } else {
            setTaData([])
        }

    },[performanceDateType, performanceDate, selectedHead]);

    useEffect(() => {
        const range = periodRange(performanceDateType, performanceDate);
        getTAProformanceTableData(performanceDateType, range)
        // OpsDashboardDAO.getTeamPerformanceDAO(range)
        //     .then((res) => setTaData(res.responseBody))
        //     .finally(() => setTaLoading(false));
    }, [performanceDate, performanceDateType,selectedHead]);

    const showTaGoal = performanceDateType === 'monthly' || performanceDateType === 'quarterly';

    // ============================================================
    // 3. CUSTOMER EXPERIENCE — WOW FACTOR (qualWow)
    // ============================================================
    const [wowDate, setWowDate] = useState(new Date());
    const [wowDateType, setWowDateType] = useState('weekly');
    const [qualWowData, setQualWowData] = useState(null);
    const [wowLoading, setWowLoading] = useState(true);
    const [wowSortCol, setWowSortCol] = useState(null);
    const [wowSortDir, setWowSortDir] = useState(1);

     const getWOWTableData = useCallback(async (wowDateType, range) => {
        let pl = {
            TAHeadUserID: selectedHead,
            Tab_Name: TAB_NAME_MAP[wowDateType] || wowDateType,
            Month: moment(range.from).format('MM'),
            Year: moment(range.from).format('YYYY'),
            Tab_Value: getDateRangeValue(wowDateType, range)
        }

        setWowLoading(true);
        let result = await TaDashboardDAO.getWowTableDataDAO(pl);
        setWowLoading(false);
        if (result?.statusCode === 200) {
            setQualWowData(result.responseBody)
        } else {
            setQualWowData(null)
        }

    },[wowDateType, wowDate, selectedHead]);

    useEffect(() => {
        const range = periodRange(wowDateType, wowDate);
        getWOWTableData(wowDateType, range)
        // OpsDashboardDAO.getWowExperienceDAO(range)
        //     .then((res) => setQualWowData(res.responseBody))
        //     .finally(() => setWowLoading(false));
    }, [wowDate, wowDateType,selectedHead]);

    const toggleWowSort = (col) => {
        setWowSortDir((prevDir) => (wowSortCol === col ? -prevDir : 1));
        setWowSortCol(col);
    };

    // ============================================================
    // 4. CUSTOMER EXPERIENCE — LOGISTICS (qualLog)
    // ============================================================
    const [logDate, setLogDate] = useState(new Date());
    const [logDateType, setLogDateType] = useState('daily');
    const [qualLogData, setQualLogData] = useState(null);
    const [logLoading, setLogLoading] = useState(true);
    const [logSortCol, setLogSortCol] = useState(null);
    const [logSortDir, setLogSortDir] = useState(1);


     const getLogisticsTableData = useCallback(async (logDateType, range) => {
        let pl = {
            TAHeadUserID: selectedHead,
            Tab_Name: TAB_NAME_MAP[logDateType] || logDateType,
            Month: moment(range.from).format('MM'),
            Year: moment(range.from).format('YYYY'),
            Tab_Value: getDateRangeValue(logDateType, range)
        }

        setLogLoading(true);
        let result = await TaDashboardDAO.getLogisticsTableDataDAO(pl);
        setLogLoading(false);
        if (result?.statusCode === 200) {
            setQualLogData(result.responseBody)
        } else {
            setQualLogData(null)
        }

    },[logDateType, logDate, selectedHead]);

    useEffect(() => {
     
        const range = periodRange(logDateType, logDate);
        getLogisticsTableData(logDateType, range)
        // OpsDashboardDAO.getLogisticsExperienceDAO(range)
        //     .then((res) => setQualLogData(res.responseBody))
        //     .finally(() => setLogLoading(false));
    }, [logDate, logDateType]);

    const toggleLogSort = (col) => {
        setLogSortDir((prevDir) => (logSortCol === col ? -prevDir : 1));
        setLogSortCol(col);
    };

    // ============================================================
    // RENDER
    // ============================================================
    return (
        <div className="wrap" style={{ overflow: 'scroll', marginBottom: '80px' }}>
            <header>
                <div className="title-block">
                    <p className="eyebrow">Talent Operations · NASA POD · Uplers</p>
                    <h1>Ops Dashboard</h1>
                </div>
            </header>

            <div className="row-pair">
                {/* ---------- 1. POD Productivity ---------- */}
                <section className="card">
                    <div className="card-head">
                        <div className="htitle"><span className="num">1</span>POD Productivity</div>
                        <DateNav
                            date={podDate}
                            period={podDateType}
                            periods={['D', 'W', 'M', 'Q']}
                            onDateChange={setPODDate}
                            onPeriodChange={setPODDateType}
                            loading={funnelLoading}
                        />
                    </div>
                    <div className="table-wrap">

                        <table className="grid">
                            <thead><tr><th></th><th>Goal</th><th>Achieved</th><th>%</th></tr></thead>
                            <tbody>
                                {funnelLoading || !funnelData ? (
                                    <div className="table-loading">Loading…</div>
                                ) : (funnelData.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="datacell">
                                            No data available
                                        </td>
                                    </tr>
                                ) : funnelData.map(row => <tr key={row.key}>
                                    <td className="rowlabel">{row.stage}</td>
                                    <td className="datacell">{row.goalStr ?? '—'}</td>
                                    <td className="datacell">{row.achievedValueStr ?? '—'}</td>
                                    <td className={`pct ${statusClass(row.achievedPer)}`}>{row.achievedPer === null ? '—' : `${row.achievedPer}`}</td>
                                </tr>)

                                )}
                            </tbody>
                        </table>

                    </div>
                </section>

                {/* ---------- 5. Pipeline & Revenue Summary ---------- */}
                <section className="card">
                    <div className="card-head">
                        <div className="htitle"><span className="num">5</span>Pipeline &amp; Revenue Summary</div>
                        <DateNav
                            date={pipelineDate}
                            period={pipelineDateType}
                            periods={['M', 'Q']}
                            onDateChange={setPipelineDate}
                            onPeriodChange={setPipelineDateType}
                            loading={pipeLoading}
                        />
                    </div>
                    <div className="table-wrap">

                        <table className="grid">
                            <thead>
                                <tr>
                                    <th>{pipelineDateType === 'monthly' ? 'Month' : 'Quarter'}: {periodLabel(pipelineDateType, pipelineDate)}</th>
                                    <th>Revenue</th>

                                    <th>%</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pipeLoading ? (
                                    <div className="table-loading">Loading…</div>
                                ) : (pipeData.length === 0 ? (
                                    <tr>
                                        <td colSpan="2" className="datacell">
                                            No data available
                                        </td>
                                    </tr>
                                ) :
                                    pipeData.map((row) => {

                                        return (
                                            <tr key={row.stage_ID}>
                                                <td className="rowlabel">{row.stage}</td>
                                                <td className="datacell">{row.achievedValueStr ?? '—'}</td>
                                                 <td className={`pct ${statusClass(row.achievedPer)}`}>{row.achievedPer === null ? '—' : `${row.achievedPer}`}</td>
                                            </tr>
                                        );
                                    }))}
                            </tbody>
                        </table>

                    </div>
                </section>
            </div>

            {/* ---------- 2. Team Performance ---------- */}
            <section className="card">
                <div className="card-head">
                    <div className="htitle"><span className="num">2</span>Team Performance</div>
                    <DateNav
                        date={performanceDate}
                        period={performanceDateType}
                        periods={['D', 'W', 'M', 'Q']}
                        onDateChange={setPerformanceDate}
                        onPeriodChange={setPerformanceDateType}
                        loading={taLoading}
                    />
                </div>
                <div className="table-wrap">
                  
                        <table className="grid ta">
                            <thead>
                                <tr>
                                    <th>TA</th>
                                    {TA_COLUMNS.map((c) => <th key={c.key}>{c.label}</th>)}
                                    {showTaGoal && <th>Goal Vs Achievement %</th>}
                                </tr>
                            </thead>
                            <tbody>
                                  {taLoading  ? (
                        <div className="table-loading">Loading…</div>
                    ) : (taData.length === 0 ? (
                                    <tr>
                                        <td colSpan="11" className="datacell">
                                            No data available
                                        </td>
                                    </tr>
                     ) :
                                taData.map((row, idx) => {
                                    const pct = pctOf(row.goal, row.joined);
                                    return (
                                        <tr key={idx}>
                                            <td className="name-cell datacell">{row.recruiter}</td>
                                            {TA_COLUMNS.map((c) => (
                                                <td className="datacell" key={c.key}>{row[c.key] ? row[c.key] : ''}</td>
                                            ))}
                                            {showTaGoal && (
                                                <td className="datacell goalvs-cell">
                                                    <div className={`goalvs-readout ${statusClass(pct)}`}>
                                                        {row.joined ? `${row.joined} joined` : ''}{pct === null ? '' : ` · ${pct}%`}
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                }) ) }
                            </tbody>
                        </table>
                  
                </div>
            </section>

            <div className="row-pair">
                {/* ---------- 3. Customer Experience (WOW Factor) ---------- */}
                <section className="card">
                    <div className="card-head">
                        <div className="htitle"><span className="num">3</span>Customer Experience (WOW Factor)</div>
                        <DateNav
                            date={wowDate}
                            period={wowDateType}
                            periods={['D', 'W', 'M', 'Q']}
                            onDateChange={setWowDate}
                            onPeriodChange={setWowDateType}
                            loading={wowLoading}
                        />
                    </div>
                    <div className="table-wrap">
                        
                            <table className="grid ta qual-split">
                                <thead>
                                    <tr>
                                        <th>TA</th>
                                        {QUAL_WOW_METRICS.map((m) => {
                                            // const arrow = wowSortCol === m.key ? (wowSortDir === 1 ? '▲' : '▼') : '';
                                            return (
                                                <th key={m.key} className="sortable" 
                                                // onClick={() => toggleWowSort(m.key)}
                                                >
                                                    {m.label}
                                                    {/* <span className="arrow">{arrow}</span> */}
                                                </th>
                                            );
                                        })}
                                        <th>Revenue</th>
                                        <th>Client Category</th>
                                    </tr>
                                </thead>
                                {/* <tr className="goal-row">
                                    <td className="rowlabel">Goal</td>
                                    {QUAL_WOW_METRICS.map((m) => (
                                        <td className="datacell" key={m.key}>{qualWowData?.[m.key] ?? '—'}</td>
                                    ))}
                                    <td className="datacell"></td>
                                    <td className="datacell"></td>
                                </tr> */}
                                <tbody>

                                    {wowLoading  ? (
                                        <td colSpan="11">
                                         <div className="table-loading">Loading…</div>    
                                        </td>
                           
                        ) : qualWowData?.length === 0 ? (
                                    <tr>
                                        <td colSpan="11" className="datacell">
                                            No data available
                                        </td>
                                    </tr>
                                ) : (qualWowData?.map(( row, idx ) => (
                                        <tr key={idx} className={row?.recruiter === 'Goal' ? "goal-row" : ""}>
                            
                                            <td className={`${row?.recruiter === 'Goal' ? "rowlabel" :" name-cell  datacell"}`}>{row?.recruiter}</td>
                                            {QUAL_WOW_METRICS?.map((m) => {
                                                // const cls = metricStatus(row?.[m.key], row[m.key]);
                                                return (
                                                    <td className={`datacell `} key={m.key}>{row?.[m.key] ?? '—'}</td>
                                                );
                                            })}
                                            <td className="datacell">{row?.tA_RevenueStr ?? '—'}</td>
                                            <td className="datacell">{row?.companyCategory || '—'}</td>
                                        </tr>
                                    )))}
                                  
                                </tbody>
                            </table>
                       
                    </div>
                    {/* <div className="row-actions">
                        <span className="legend-note">🟢 met/beat goal · tap a header to sort</span>
                    </div> */}
                </section>

                {/* ---------- 4. Customer Experience (Logistics) ---------- */}
                <section className="card">
                    <div className="card-head">
                        <div className="htitle"><span className="num">4</span>Customer Experience (Logistics)</div>
                        <DateNav
                            date={logDate}
                            period={logDateType}
                            periods={['D', 'W', 'M', 'Q']}
                            onDateChange={setLogDate}
                            onPeriodChange={setLogDateType}
                            loading={logLoading}
                        />
                    </div>
                    <div className="table-wrap">
                       
                            <table className="grid ta qual-split">
                                <thead>
                                    <tr>
                                        <th>TA</th>
                                        {QUAL_LOG_METRICS.map((m) => {
                                            const arrow = logSortCol === m.key ? (logSortDir === 1 ? '▲' : '▼') : '';
                                            return (
                                                <th key={m.key} className="sortable" onClick={() => toggleLogSort(m.key)}>
                                                    {m.label}<span className="arrow">{arrow}</span>
                                                </th>
                                            );
                                        })}
                                        <th>Revenue</th>
                                    </tr>
                                </thead>
                                {/* <tr className="goal-row">
                                    <td className="rowlabel">Goal</td>
                                    {QUAL_LOG_METRICS.map((m) => (
                                        <td className="datacell" key={m.key}>{row?.[m.key] ?? '—'}</td>
                                    ))}
                                    <td className="datacell"></td>
                                </tr> */}
                                <tbody>

                                     {logLoading  ? (
                                        <td colSpan="5">
                                         <div className="table-loading">Loading…</div>   
                                        </td>
                            
                        ) :qualLogData?.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="datacell">
                                            No data available
                                        </td>
                                    </tr>
                                ) : (qualLogData.map((row, idx) => (
                                        <tr key={idx}>
                                            <td className={`${row?.recruiter === 'Goal' ? "rowlabel" : "name-cell datacell"}`}>{row?.recruiter}</td>
                                            {QUAL_LOG_METRICS.map((m) => {
                                                // const cls = metricStatus(qualLogData.goals?.[m.key], row[m.key]);
                                                return (
                                                    <td className={`datacell`} key={m.key}>{row?.[m.key] ?? '—'}</td>
                                                );
                                            })}
                                            <td className="datacell">{row?.tA_RevenueStr ?? '—'}</td>
                                        </tr>
                                    )))}
                               
                                </tbody>
                            </table>
                       
                    </div>
                    {/* <div className="row-actions">
                        <span className="legend-note">🟢 met/beat goal · tap a header to sort</span>
                    </div> */}
                </section>
            </div>

            {/* <footer>
                Use ‹ › to browse previous/next periods · each panel's Daily / Weekly / Monthly / Quarterly view refetches from the server
            </footer> */}
        </div>
    );
}

export default OPSDashboard;
