import React, { useState } from 'react'
import stylesOBj from '../../ScrumS2/scrumStructure.module.css'
import DateNav from '../../ScrumS2/OPSDashboard/DateNav';
import { pctOf, statusClass, metricStatus } from '../../ScrumS2/OPSDashboard/sectionMath';


const FUNNEL_ROWS = [
    { key: 'shipment', label: 'Hudda' },
    { key: 'shipment', label: 'Hudda' },
    { key: 'shipment', label: 'Hudda' },
    { key: 'shipment', label: 'Hudda' },
    { key: 'shipment', label: 'Hudda' },

];



function TAplayground() {
    const [funnelData, setFunnelData] = useState(null);
    const [funnelLoading, setFunnelLoading] = useState(true);
    const [podDate, setPODDate] = useState(new Date());
    const [podDateType, setPODDateType] = useState('daily');


    return (

        <div className={`${stylesOBj["dashboard-container"]}`}>
            <main className={`${stylesOBj["main-content"]}`}>
                <div className="wrap" style={{ overflow: 'scroll', marginBottom: '80px' }}>
                    <header>
                        <div className="title-block">
                            <p className="eyebrow">Talent Operations · NASA POD · Uplers</p>
                            <h1>TA Dashboard</h1>
                        </div>
                    </header>

                    <div className="row-pair">
                        {/* ============ 1. POD PRODUCTIVITY (funnel) ============ */}
                        <section className="card">
                            <div className="card-head">
                                <div className="htitle"><span className="num">1</span>SUM of Total Achievement Value</div>
                                <DateNav
                                    date={podDate}
                                    period={podDateType}
                                    periods={['D', 'W', 'M', 'Q']}
                                    onDateChange={setPODDate}
                                    onPeriodChange={setPODDateType}
                                //   synced={funnelSynced}
                                />
                            </div>
                            <div className="table-wrap">
                                {/* {funnelLoading || !funnelData ? (
                                                      <div className="table-loading">Loading…</div>
                                                  ) : */}
                                (
                                <table className="grid">
                                    <thead><tr><th>Recruiter Name</th><th>Sep'26</th><th>Aug'26</th><th>Grand Total</th></tr></thead>
                                    <tbody>
                                        {FUNNEL_ROWS.map((row) => {
                                            return (
                                                <tr key={row.label}>
                                                    <td className="rowlabel">{row.label}</td>
                                                    <td className="datacell">
                                                        10
                                                    </td>
                                                    <td className="datacell">
                                                        10
                                                    </td>
                                                    <td className={`pct 10`}> {10}%</td>
                                                </tr>
                                            );
                                        })}

                                    </tbody>
                                    <tr className="goal-row" key={'GT'}>
                                        <td className="rowlabel">Grand Total</td>
                                        <td className="datacell">
                                            10
                                        </td>
                                        <td className="datacell">
                                            10
                                        </td>
                                        <td className={`pct 10`}> {10}%</td>
                                    </tr>
                                </table>
                                )
                                {/* } */}
                            </div>
                        </section>

                        <section className="card">
                            <div className="card-head">
                                <div className="htitle"><span className="num">1</span>SUM of Total Achievement Value</div>
                                <DateNav
                                    date={podDate}
                                    period={podDateType}
                                    periods={['D', 'W', 'M', 'Q']}
                                    onDateChange={setPODDate}
                                    onPeriodChange={setPODDateType}
                                //   synced={funnelSynced}
                                />
                            </div>
                            <div className="table-wrap">
                                {/* {funnelLoading || !funnelData ? (
                                                      <div className="table-loading">Loading…</div>
                                                  ) : */}
                                (
                                <table className="grid">
                                    <thead><tr><th>Recruiter Name</th><th>Sep'26</th><th>Aug'26</th><th>Grand Total</th></tr></thead>
                                    <tbody>
                                        {FUNNEL_ROWS.map((row) => {
                                            return (
                                                <tr key={row.label}>
                                                    <td className="rowlabel">{row.label}</td>
                                                    <td className="datacell">
                                                        10
                                                    </td>
                                                    <td className="datacell">
                                                        10
                                                    </td>
                                                    <td className={`pct 10`}> {10}%</td>
                                                </tr>
                                            );
                                        })}
                                        <tr key={'GT'}>
                                            <td className="rowlabel">Grand Total</td>
                                            <td className="datacell">
                                                10
                                            </td>
                                            <td className="datacell">
                                                10
                                            </td>
                                            <td className={`pct 10`}> {10}%</td>
                                        </tr>
                                    </tbody>
                                    <tr className="goal-row" key={'GT'}>
                                        <td className="rowlabel">Grand Total</td>
                                        <td className="datacell">
                                            10
                                        </td>
                                        <td className="datacell">
                                            10
                                        </td>
                                        <td className={`pct 10`}> {10}%</td>
                                    </tr>
                                </table>
                                )
                                {/* } */}
                            </div>
                        </section>
                    </div>

                    <div className="row-pair">
                        {/* ============ 1. POD PRODUCTIVITY (funnel) ============ */}
                        <section className="card">
                            <div className="card-head">
                                <div className="htitle"><span className="num">1</span>SUM of Total Achievement Value</div>
                                <DateNav
                                    date={podDate}
                                    period={podDateType}
                                    periods={['D', 'W', 'M', 'Q']}
                                    onDateChange={setPODDate}
                                    onPeriodChange={setPODDateType}
                                //   synced={funnelSynced}
                                />
                            </div>
                            <div className="table-wrap">
                                {/* {funnelLoading || !funnelData ? (
                                                      <div className="table-loading">Loading…</div>
                                                  ) : */}
                                (
                                <table className="grid">
                                    <thead><tr><th>Recruiter Name</th><th>Sep'26</th><th>Aug'26</th><th>Grand Total</th></tr></thead>
                                    <tbody>
                                        {FUNNEL_ROWS.map((row) => {
                                            return (
                                                <tr key={row.label}>
                                                    <td className="rowlabel">{row.label}</td>
                                                    <td className="datacell">
                                                        10
                                                    </td>
                                                    <td className="datacell">
                                                        10
                                                    </td>
                                                    <td className={`pct 10`}> {10}%</td>
                                                </tr>
                                            );
                                        })}

                                    </tbody>
                                    <tr className="goal-row" key={'GT'}>
                                        <td className="rowlabel">Grand Total</td>
                                        <td className="datacell">
                                            10
                                        </td>
                                        <td className="datacell">
                                            10
                                        </td>
                                        <td className={`pct 10`}> {10}%</td>
                                    </tr>
                                </table>
                                )
                                {/* } */}
                            </div>
                        </section>

                        <section className="card">
                            <div className="card-head">
                                <div className="htitle"><span className="num">1</span>SUM of Total Achievement Value</div>
                                <DateNav
                                    date={podDate}
                                    period={podDateType}
                                    periods={['D', 'W', 'M', 'Q']}
                                    onDateChange={setPODDate}
                                    onPeriodChange={setPODDateType}
                                //   synced={funnelSynced}
                                />
                            </div>
                            <div className="table-wrap">
                                {/* {funnelLoading || !funnelData ? (
                                                      <div className="table-loading">Loading…</div>
                                                  ) : */}
                                (
                                <table className="grid">
                                    <thead><tr><th>Recruiter Name</th><th>Sep'26</th><th>Aug'26</th><th>Grand Total</th></tr></thead>
                                    <tbody>
                                        {FUNNEL_ROWS.map((row) => {
                                            return (
                                                <tr key={row.label}>
                                                    <td className="rowlabel">{row.label}</td>
                                                    <td className="datacell">
                                                        10
                                                    </td>
                                                    <td className="datacell">
                                                        10
                                                    </td>
                                                    <td className={`pct 10`}> {10}%</td>
                                                </tr>
                                            );
                                        })}
                                        <tr key={'GT'}>
                                            <td className="rowlabel">Grand Total</td>
                                            <td className="datacell">
                                                10
                                            </td>
                                            <td className="datacell">
                                                10
                                            </td>
                                            <td className={`pct 10`}> {10}%</td>
                                        </tr>
                                    </tbody>
                                    <tr className="goal-row" key={'GT'}>
                                        <td className="rowlabel">Grand Total</td>
                                        <td className="datacell">
                                            10
                                        </td>
                                        <td className="datacell">
                                            10
                                        </td>
                                        <td className={`pct 10`}> {10}%</td>
                                    </tr>
                                </table>
                                )
                                {/* } */}
                            </div>
                        </section>
                    </div>

                    <div className="row-pair">
                        {/* ============ 1. POD PRODUCTIVITY (funnel) ============ */}
                        <section className="card">
                            <div className="card-head">
                                <div className="htitle"><span className="num">1</span>SUM of Total Achievement Value</div>
                                <DateNav
                                    date={podDate}
                                    period={podDateType}
                                    periods={['D', 'W', 'M', 'Q']}
                                    onDateChange={setPODDate}
                                    onPeriodChange={setPODDateType}
                                //   synced={funnelSynced}
                                />
                            </div>
                            <div className="table-wrap">
                                {/* {funnelLoading || !funnelData ? (
                                                      <div className="table-loading">Loading…</div>
                                                  ) : */}
                                (
                                <table className="grid">
                                    <thead><tr><th>Recruiter Name</th><th>Sep'26</th><th>Aug'26</th><th>Grand Total</th></tr></thead>
                                    <tbody>
                                        {FUNNEL_ROWS.map((row) => {
                                            return (
                                                <tr key={row.label}>
                                                    <td className="rowlabel">{row.label}</td>
                                                    <td className="datacell">
                                                        10
                                                    </td>
                                                    <td className="datacell">
                                                        10
                                                    </td>
                                                    <td className={`pct 10`}> {10}%</td>
                                                </tr>
                                            );
                                        })}

                                    </tbody>
                                    <tr className="goal-row" key={'GT'}>
                                        <td className="rowlabel">Grand Total</td>
                                        <td className="datacell">
                                            10
                                        </td>
                                        <td className="datacell">
                                            10
                                        </td>
                                        <td className={`pct 10`}> {10}%</td>
                                    </tr>
                                </table>
                                )
                                {/* } */}
                            </div>
                        </section>

                        <section className="card">
                            <div className="card-head">
                                <div className="htitle"><span className="num">1</span>SUM of Total Achievement Value</div>
                                <DateNav
                                    date={podDate}
                                    period={podDateType}
                                    periods={['D', 'W', 'M', 'Q']}
                                    onDateChange={setPODDate}
                                    onPeriodChange={setPODDateType}
                                //   synced={funnelSynced}
                                />
                            </div>
                            <div className="table-wrap">
                                {/* {funnelLoading || !funnelData ? (
                                                      <div className="table-loading">Loading…</div>
                                                  ) : */}
                                (
                                <table className="grid">
                                    <thead><tr><th>Recruiter Name</th><th>Sep'26</th><th>Aug'26</th><th>Grand Total</th></tr></thead>
                                    <tbody>
                                        {FUNNEL_ROWS.map((row) => {
                                            return (
                                                <tr key={row.label}>
                                                    <td className="rowlabel">{row.label}</td>
                                                    <td className="datacell">
                                                        10
                                                    </td>
                                                    <td className="datacell">
                                                        10
                                                    </td>
                                                    <td className={`pct 10`}> {10}%</td>
                                                </tr>
                                            );
                                        })}
                                        <tr key={'GT'}>
                                            <td className="rowlabel">Grand Total</td>
                                            <td className="datacell">
                                                10
                                            </td>
                                            <td className="datacell">
                                                10
                                            </td>
                                            <td className={`pct 10`}> {10}%</td>
                                        </tr>
                                    </tbody>
                                    <tr className="goal-row" key={'GT'}>
                                        <td className="rowlabel">Grand Total</td>
                                        <td className="datacell">
                                            10
                                        </td>
                                        <td className="datacell">
                                            10
                                        </td>
                                        <td className={`pct 10`}> {10}%</td>
                                    </tr>
                                </table>
                                )
                                {/* } */}
                            </div>
                        </section>
                    </div>

                    <div className="row-pair">
                        {/* ============ 1. POD PRODUCTIVITY (funnel) ============ */}
                        <section className="card">
                            <div className="card-head">
                                <div className="htitle"><span className="num">1</span>SUM of Total Achievement Value</div>
                                <DateNav
                                    date={podDate}
                                    period={podDateType}
                                    periods={['D', 'W', 'M', 'Q']}
                                    onDateChange={setPODDate}
                                    onPeriodChange={setPODDateType}
                                //   synced={funnelSynced}
                                />
                            </div>
                            <div className="table-wrap">
                                {/* {funnelLoading || !funnelData ? (
                                                      <div className="table-loading">Loading…</div>
                                                  ) : */}
                                (
                                <table className="grid">
                                    <thead><tr><th>Recruiter Name</th><th>Sep'26</th><th>Aug'26</th><th>Grand Total</th></tr></thead>
                                    <tbody>
                                        {FUNNEL_ROWS.map((row) => {
                                            return (
                                                <tr key={row.label}>
                                                    <td className="rowlabel">{row.label}</td>
                                                    <td className="datacell">
                                                        10
                                                    </td>
                                                    <td className="datacell">
                                                        10
                                                    </td>
                                                    <td className={`pct 10`}> {10}%</td>
                                                </tr>
                                            );
                                        })}

                                    </tbody>
                                    <tr className="goal-row" key={'GT'}>
                                        <td className="rowlabel">Grand Total</td>
                                        <td className="datacell">
                                            10
                                        </td>
                                        <td className="datacell">
                                            10
                                        </td>
                                        <td className={`pct 10`}> {10}%</td>
                                    </tr>
                                </table>
                                )
                                {/* } */}
                            </div>
                        </section>

                        <section className="card">
                            <div className="card-head">
                                <div className="htitle"><span className="num">1</span>SUM of Total Achievement Value</div>
                                <DateNav
                                    date={podDate}
                                    period={podDateType}
                                    periods={['D', 'W', 'M', 'Q']}
                                    onDateChange={setPODDate}
                                    onPeriodChange={setPODDateType}
                                //   synced={funnelSynced}
                                />
                            </div>
                            <div className="table-wrap">
                                {/* {funnelLoading || !funnelData ? (
                                                      <div className="table-loading">Loading…</div>
                                                  ) : */}
                                (
                                <table className="grid">
                                    <thead><tr><th>Recruiter Name</th><th>Sep'26</th><th>Aug'26</th><th>Grand Total</th></tr></thead>
                                    <tbody>
                                        {FUNNEL_ROWS.map((row) => {
                                            return (
                                                <tr key={row.label}>
                                                    <td className="rowlabel">{row.label}</td>
                                                    <td className="datacell">
                                                        10
                                                    </td>
                                                    <td className="datacell">
                                                        10
                                                    </td>
                                                    <td className={`pct 10`}> {10}%</td>
                                                </tr>
                                            );
                                        })}
                                        <tr key={'GT'}>
                                            <td className="rowlabel">Grand Total</td>
                                            <td className="datacell">
                                                10
                                            </td>
                                            <td className="datacell">
                                                10
                                            </td>
                                            <td className={`pct 10`}> {10}%</td>
                                        </tr>
                                    </tbody>
                                    <tr className="goal-row" key={'GT'}>
                                        <td className="rowlabel">Grand Total</td>
                                        <td className="datacell">
                                            10
                                        </td>
                                        <td className="datacell">
                                            10
                                        </td>
                                        <td className={`pct 10`}> {10}%</td>
                                    </tr>
                                </table>
                                )
                                {/* } */}
                            </div>
                        </section>
                    </div>
                </div>
            </main> </div>

    )
}

export default TAplayground