import React, { useState, useEffect } from 'react'
import stylesOBj from '../../ScrumS2/scrumStructure.module.css'
import DateNav from '../../ScrumS2/OPSDashboard/DateNav';
import { periodRange, periodLabel } from '../../ScrumS2/OPSDashboard/dateNavUtils';
import { pctOf, statusClass, metricStatus } from '../../ScrumS2/OPSDashboard/sectionMath';
import {
    Select,
} from "antd";
import { TaDashboardDAO } from "core/taDashboard/taDashboardDRO";
import { useNavigate } from 'react-router-dom';
import { HTTPStatusCode } from "constants/network";
import moment from 'moment';

const FUNNEL_ROWS = [
    { key: 'shipment', label: 'Hudda' },
    { key: 'shipment', label: 'Hudda' },
    { key: 'shipment', label: 'Hudda' },
    { key: 'shipment', label: 'Hudda' },
    { key: 'shipment', label: 'Hudda' },

];



function TAplayground() {
    const [filtersList, setFiltersList] = useState({});
    const [selectedHead, setSelectedHead] = useState('');
    const [PLVData, setPLVlData] = useState(null);
    const [plvLoading, setPLVLoading] = useState(true);
    const [plvDate, setplvDate] = useState(new Date());
    const [plvDateType, setplvDateType] = useState('quarterly');


    const [PLCData, setPLClData] = useState(null);
    const [plCLoading, setPLCLoading] = useState(true);
    const [plCDate, setplCDate] = useState(new Date());
    const [plCDateType, setplCDateType] = useState('quarterly');

    const [PLAllVData, setPLAllVlData] = useState(null);
    const [plAllVLoading, setPLAllVLoading] = useState(true);
    const [plAllVDate, setplAllVDate] = useState(new Date());
    const [plAllVDateType, setplAllVDateType] = useState('quarterly');

    const [PLAllCData, setPLAllClData] = useState(null);
    const [plAllCLoading, setPLAllCLoading] = useState(true);
    const [plAllCDate, setplAllCDate] = useState(new Date());
    const [plAllCDateType, setplAllCDateType] = useState('quarterly');

    const [PLPercentageData, setPLPercentagelData] = useState(null);
    const [plPercentageLoading, setPLPercentageLoading] = useState(true);
    const [plPercentageDate, setplPercentageDate] = useState(new Date());
    const [plPercentageDateType, setplPercentageDateType] = useState('quarterly');


    const getTotal = (data, field) => {
        return data.reduce((total, item) => {
            const value = item[field];

            if (value === null || value === undefined || value === '') {
                return total;
            }

            // Handles values like "$3,300"
            const number = Number(
                String(value).replace(/[$,₹\s]/g, '')
            );

            return total + (isNaN(number) ? 0 : number);
        }, 0);
    };

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

    const getFilters = async () => {

        let filterResult = await TaDashboardDAO.getAllMasterDAO();


        if (filterResult.statusCode === HTTPStatusCode.OK) {

            setFiltersList(filterResult && filterResult?.responseBody);
            setSelectedHead(filterResult?.responseBody?.HeadUsers?.filter(i => i.id === 302)?.[0]?.id);
        }
    };

    useEffect(() => {
        getFilters();
    }, []);

    const getPLVTableDate = async (plvDateType, range) => {
        let pl = {
            TAHeadUserID: selectedHead,
            Tab_Name: 'PLV',
            Month: moment(range.from).format('MM'),
            Year: moment(range.from).format('YYYY'),
            Tab_Value: getDateRangeValue(plvDateType, range)
        }

        setPLVLoading(true);
        let result = await TaDashboardDAO.getTAPlaygroundTableDAO(pl);
        setPLVLoading(false);

        if (result?.statusCode === 200) {
            setPLVlData(result.responseBody)
        } else {
            setPLVlData([])
        }
    }

    useEffect(() => {
        if (selectedHead) {
            const range = periodRange(plvDateType, plvDate);
            getPLVTableDate(plvDateType, range)
        }
    }, [plvDate, plvDateType, selectedHead]);

    
    const getPLCTableDate = async (plCDateType, range) => {
        let pl = {
            TAHeadUserID: selectedHead,
            Tab_Name: 'PLC',
            Month: moment(range.from).format('MM'),
            Year: moment(range.from).format('YYYY'),
            Tab_Value: getDateRangeValue(plCDateType, range)
        }

        setPLCLoading(true);
        let result = await TaDashboardDAO.getTAPlaygroundTableDAO(pl);
        setPLCLoading(false);

        if (result?.statusCode === 200) {
            setPLClData(result.responseBody)
        } else {
            setPLClData([])
        }
    }

    useEffect(() => {
        if (selectedHead) {
            const range = periodRange(plCDateType, plCDate);
            getPLCTableDate(plCDateType, range)
        }
    }, [plCDate, plCDateType, selectedHead]);

    const getPLAllVTableDate = async (plAllVDateType, range) => {
        let pl = {
            TAHeadUserID: selectedHead,
            Tab_Name: 'PLAllV',
            Month: moment(range.from).format('MM'),
            Year: moment(range.from).format('YYYY'),
            Tab_Value: getDateRangeValue(plAllVDateType, range)
        }

        setPLAllVLoading(true);
        let result = await TaDashboardDAO.getTAPlaygroundTableDAO(pl);
        setPLAllVLoading(false);

        if (result?.statusCode === 200) {
            setPLAllVlData(result.responseBody)
        } else {
            setPLAllVlData([])
        }
    }

    useEffect(() => {
        if (selectedHead) {
            const range = periodRange(plAllVDateType, plAllVDate);
            getPLAllVTableDate(plAllVDateType, range)
        }
    }, [plAllVDate, plAllVDateType, selectedHead]);

    const getPLAllCTableDate = async (plAllCDateType, range) => {
        let pl = {
            TAHeadUserID: selectedHead,
            Tab_Name: 'PLAllC',
            Month: moment(range.from).format('MM'),
            Year: moment(range.from).format('YYYY'),
            Tab_Value: getDateRangeValue(plAllCDateType, range)
        }

        setPLAllCLoading(true);
        let result = await TaDashboardDAO.getTAPlaygroundTableDAO(pl);
        setPLAllCLoading(false);

        if (result?.statusCode === 200) {
            setPLAllClData(result.responseBody)
        } else {
            setPLAllClData([])
        }
    }

    useEffect(() => {
        if (selectedHead) {
            const range = periodRange(plAllCDateType, plAllCDate);
            getPLAllCTableDate(plAllCDateType, range)
        }
    }, [plAllCDate, plAllCDateType, selectedHead]);

    const getPLPercentageTableDate = async (plPercentageDateType, range) => {
        let pl = {
            TAHeadUserID: selectedHead,
            Tab_Name: 'PLPercentage',
            Month: moment(range.from).format('MM'),
            Year: moment(range.from).format('YYYY'),
            Tab_Value: getDateRangeValue(plPercentageDateType, range)
        }

        setPLPercentageLoading(true);
        let result = await TaDashboardDAO.getTAPlaygroundTableDAO(pl);
        setPLPercentageLoading(false);

        if (result?.statusCode === 200) {
            setPLPercentagelData(result.responseBody)
        } else {
            setPLPercentagelData([])
        }
    }

    useEffect(() => {
        if (selectedHead) {
            const range = periodRange(plPercentageDateType, plPercentageDate);
            getPLPercentageTableDate(plPercentageDateType, range)
        }
    }, [plPercentageDate, plPercentageDateType, selectedHead]);



    return (

        <div className={`${stylesOBj["dashboard-container"]}`}>
            <main className={`${stylesOBj["main-content"]}`}>
                {/* <div
                    //  className={`${stylesOBj["filterContainer"]}`}
                    style={{ display: 'flex', paddingRight: '15px', margin: '15px 10px' }}>


                    <Select
                        id="selectedValue"
                        placeholder="Select TA"
                        size="middle"
                        style={{ marginLeft: "10px", width: "270px" }}
                        // mode="multiple"
                        value={selectedHead}
                        showSearch={true}
                        onChange={(value, option) => {
                            setSelectedHead(value);
                        }}
                        options={filtersList?.HeadUsers?.filter(i => i.id === 302)?.map((v) => ({
                            label: v.data,
                            value: v.id,
                        }))}
                        optionFilterProp="label"
                    />



                </div> */}
                <div className="wrap" style={{ overflow: 'scroll', marginBottom: '80px' }}>
                    <header>
                        <div className="title-block">
                            {/* <p className="eyebrow">Talent Operations · NASA POD · Uplers</p> */}
                            <h1>TA Dashboard</h1>
                        </div>
                    </header>

                    <div className="row-pair">
                        {/* ============ 1. POD PRODUCTIVITY (funnel) ============ */}
                        <section className="card">
                            <div className="card-head">
                                <div className="htitle"><span className="num">1</span>{PLVData?.[0]?.titleStr}</div>
                                {/* <DateNav
                                    date={plvDate}
                                    period={plvDateType}
                                    periods={['D', 'W', 'M', 'Q']}
                                    onDateChange={setplvDate}
                                    onPeriodChange={setplvDateType}
                                //   synced={funnelSynced}
                                /> */}
                            </div>
                            <div className="table-wrap">
                                {plvLoading ? (
                                    <div className="table-loading">Loading…</div>
                                ) :
                                    (
                                        <table className="grid">
                                            <thead><tr><th>Recruiter</th><th>Existing</th><th>NBD</th><th>Monthly Average</th><th>Grand Total</th></tr></thead>
                                            <tbody>
                                                {PLVData?.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="5" className="datacell">
                                                            No data available
                                                        </td>
                                                    </tr>
                                                ) :
                                                    PLVData.map((row, ind) => {
                                                        return (
                                                            <tr key={row.recruiterName + ind}>
                                                                <td className="rowlabel">{row.recruiterName}</td>
                                                                <td className="datacell">
                                                                    {row?.existing}
                                                                </td>
                                                                <td className="datacell">
                                                                    {row?.nbd}
                                                                </td>
                                                                  <td className="datacell">
                                                                    {row?.monthlyAvg}
                                                                </td>
                                                                <td className={`pct`}> {row?.grandTotal}</td>
                                                            </tr>
                                                        );
                                                    })}

                                            </tbody>
                                            <tr className="goal-row" key={'GT'}>
                                                <td className="rowlabel">Grand Total</td>
                                                <td className="datacell">
                                                    {`$${getTotal(PLVData, 'existing').toLocaleString('en-US')}`}
                                                </td>
                                                <td className="datacell">
                                                    {`$${getTotal(PLVData, 'nbd').toLocaleString('en-US')}`}
                                                </td>
                                                <td className="datacell">
                                                    {`$${getTotal(PLVData, 'monthlyAvg').toLocaleString('en-US')}`}
                                                </td>
                                                <td className={`pct `}>{`$${getTotal(PLVData, 'grandTotal').toLocaleString('en-US')}`}</td>
                                            </tr>
                                        </table>
                                    )
                                }
                            </div>
                        </section>

<section className="card">
                            <div className="card-head">
                                <div className="htitle"><span className="num">2</span>{PLCData?.[0]?.titleStr}</div>
                                {/* <DateNav
                                    date={plCDate}
                                    period={plCDateType}
                                    periods={['D', 'W', 'M', 'Q']}
                                    onDateChange={setplCDate}
                                    onPeriodChange={setplCDateType}
                                //   synced={funnelSynced}
                                /> */}
                            </div>
                            <div className="table-wrap">
                                {plCLoading ? (
                                    <div className="table-loading">Loading…</div>
                                ) :
                                    (
                                        <table className="grid">
                                            <thead><tr><th>Recruiter</th><th>Existing</th><th>NBD</th><th>Monthly Average</th><th>Grand Total</th></tr></thead>
                                            <tbody>
                                                {PLCData?.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="5" className="datacell">
                                                            No data available
                                                        </td>
                                                    </tr>
                                                ) :
                                                    PLCData.map((row, ind) => {
                                                        return (
                                                            <tr key={row.recruiterName + ind}>
                                                                <td className="rowlabel">{row.recruiterName}</td>
                                                                <td className="datacell">
                                                                    {row?.existing}
                                                                </td>
                                                                <td className="datacell">
                                                                    {row?.nbd}
                                                                </td>
                                                                <td className="datacell">
                                                                    {row?.monthlyAvg}
                                                                </td>
                                                                <td className={`pct`}> {row?.grandTotal}</td>
                                                            </tr>
                                                        );
                                                    })}

                                            </tbody>
                                            <tr className="goal-row" key={'GT'}>
                                                <td className="rowlabel">Grand Total</td>
                                                <td className="datacell">
                                                    {getTotal(PLCData, 'existing')}
                                                </td>
                                                <td className="datacell">
                                                    {getTotal(PLCData, 'nbd')}
                                                </td>
                                                <td className="datacell">
                                                    {getTotal(PLCData, 'monthlyAvg').toLocaleString('en-US')}
                                                </td>
                                                <td className={`pct `}>{getTotal(PLCData, 'grandTotal')}</td>
                                            </tr>
                                        </table>
                                    )
                                }
                            </div>
                        </section>


                      
                      
                    </div>


<div className="row-pair">
    
                        <section className="card">
                            <div className="card-head">
                                <div className="htitle"><span className="num">3</span>{PLAllVData?.[0]?.titleStr}</div>
                            </div>
                            <div className="table-wrap">
                                {plAllVLoading ? (
                                    <div className="table-loading">Loading...</div>
                                ) : (
                                    <table className="grid">
                                        <thead><tr><th>Recruiter</th><th>Existing</th><th>NBD</th><th>Monthly Average</th><th>Grand Total</th></tr></thead>
                                        <tbody>
                                            {PLAllVData?.length === 0 ? (
                                                <tr><td colSpan="5" className="datacell">No data available</td></tr>
                                            ) : PLAllVData.map((row, ind) => (
                                                <tr key={row.recruiterName + ind}>
                                                    <td className="rowlabel">{row.recruiterName}</td>
                                                    <td className="datacell">{row?.existing}</td>
                                                    <td className="datacell">{row?.nbd}</td>
                                                    <td className="datacell">{row?.monthlyAvg}</td>
                                                    <td className="pct">{row?.grandTotal}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tr className="goal-row">
                                            <td className="rowlabel">Grand Total</td>
                                            <td className="datacell">{`$${getTotal(PLAllVData, 'existing').toLocaleString('en-US')}`}</td>
                                            <td className="datacell">{`$${getTotal(PLAllVData, 'nbd').toLocaleString('en-US')}`}</td>
                                            <td className="datacell">{`$${getTotal(PLAllVData, 'monthlyAvg').toLocaleString('en-US')}`}</td>
                                            <td className="pct">{`$${getTotal(PLAllVData, 'grandTotal').toLocaleString('en-US')}`}</td>
                                        </tr>
                                    </table>
                                )}
                            </div>
                        </section>

                        <section className="card">
                            <div className="card-head">
                                <div className="htitle"><span className="num">4</span>{PLAllCData?.[0]?.titleStr}</div>
                            </div>
                            <div className="table-wrap">
                                {plAllCLoading ? (
                                    <div className="table-loading">Loading...</div>
                                ) : (
                                    <table className="grid">
                                        <thead><tr><th>Recruiter</th><th>Existing</th><th>NBD</th><th>Monthly Average</th><th>Grand Total</th></tr></thead>
                                        <tbody>
                                            {PLAllCData?.length === 0 ? (
                                                <tr><td colSpan="5" className="datacell">No data available</td></tr>
                                            ) : PLAllCData.map((row, ind) => (
                                                <tr key={row.recruiterName + ind}>
                                                    <td className="rowlabel">{row.recruiterName}</td>
                                                    <td className="datacell">{row?.existing}</td>
                                                    <td className="datacell">{row?.nbd}</td>
                                                    <td className="datacell">{row?.monthlyAvg}</td>
                                                    <td className="pct">{row?.grandTotal}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tr className="goal-row">
                                            <td className="rowlabel">Grand Total</td>
                                            <td className="datacell">{getTotal(PLAllCData, 'existing')}</td>
                                            <td className="datacell">{getTotal(PLAllCData, 'nbd')}</td>
                                            <td className="datacell">{getTotal(PLAllCData, 'monthlyAvg')}</td>
                                            <td className="pct">{getTotal(PLAllCData, 'grandTotal')}</td>
                                        </tr>
                                    </table>
                                )}
                            </div>
                        </section>
</div>

<div className="row-pair">
  <section className="card">
                            <div className="card-head">
                                <div className="htitle"><span className="num">5</span>{PLPercentageData?.[0]?.titleStr}</div>
                            </div>
                            <div className="table-wrap">
                                {plPercentageLoading ? (
                                    <div className="table-loading">Loading...</div>
                                ) : (
                                    <table className="grid">
                                        <thead><tr><th>Recruiter</th><th>Existing</th><th>NBD</th><th>Monthly Average</th><th>Grand Total</th></tr></thead>
                                        <tbody>
                                            {PLPercentageData?.length === 0 ? (
                                                <tr><td colSpan="5" className="datacell">No data available</td></tr>
                                            ) : PLPercentageData.map((row, ind) => (
                                                <tr key={row.recruiterName + ind}>
                                                    <td className="rowlabel">{row.recruiterName}</td>
                                                    <td className="datacell">{row?.existing}</td>
                                                    <td className="datacell">{row?.nbd}</td>
                                                    <td className="datacell">{row?.monthlyAvg}</td>
                                                    <td className="pct">{row?.grandTotal}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tr className="goal-row">
                                            <td className="rowlabel">Grand Total</td>
                                            <td className="datacell">{getTotal(PLPercentageData, 'existing')?.toFixed(2)}</td>
                                            <td className="datacell">{getTotal(PLPercentageData, 'nbd')?.toFixed(2)}</td>
                                            <td className="datacell">{getTotal(PLPercentageData, 'monthlyAvg')?.toFixed(2)}</td>
                                            <td className="pct">{getTotal(PLPercentageData, 'grandTotal')?.toFixed(2)}</td>
                                        </tr>
                                    </table>
                                )}
                            </div>
                        </section>
</div>

                </div>
            </main> </div>

    )
}

export default TAplayground