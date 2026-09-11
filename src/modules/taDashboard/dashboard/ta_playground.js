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
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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



    const [PLPercentageData, setPLPercentagelData] = useState(null);
    const [plPercentageLoading, setPLPercentageLoading] = useState(true);
    const [plPercentageDate, setplPercentageDate] = useState(new Date());
    const [plPercentageDateType, setplPercentageDateType] = useState('quarterly');


    const today = new Date();
    const [monthDate, setMonthDate] = useState(today);

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

    const calPercentage = (value, total) => {
        let won = typeof value === 'string' ? Number(value.replace(/[$,]/g, '')) : value;
        let totalVal = typeof total === 'string' ? Number(total.replace(/[$,]/g, '')) : total;

        if(!won || !totalVal) return "";
        if (totalVal === 0) return 0;
        return ((won / totalVal) * 100).toFixed(2);
    };

    const addNumbers = (value1, value2) => {
    const num1 = Number(String(value1).replace(/[$,]/g, '')) || 0;
    const num2 = Number(String(value2).replace(/[$,]/g, '')) || 0;

    return num1 + num2;
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
            Month: moment(monthDate).format('MM'),
            Year: moment(monthDate).format('YYYY'),
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
    }, [plvDate, plvDateType, selectedHead, monthDate]);


    const getPLCTableDate = async (plCDateType, range) => {
        let pl = {
            TAHeadUserID: selectedHead,
            Tab_Name: 'PLC',
            Month: moment(monthDate).format('MM'),
            Year: moment(monthDate).format('YYYY'),
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
    }, [plCDate, plCDateType, selectedHead, monthDate]);



    const getPLPercentageTableDate = async (plPercentageDateType, range) => {
        let pl = {
            TAHeadUserID: selectedHead,
            Tab_Name: 'PLPercentage',
            Month: moment(monthDate).format('MM'),
            Year: moment(monthDate).format('YYYY'),
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
    }, [plPercentageDate, plPercentageDateType, selectedHead, monthDate]);



    return (

        <div className={`${stylesOBj["dashboard-container"]}`}>
            <main className={`${stylesOBj["main-content"]}`}>
                <div
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

                    <div className={stylesOBj.calendarFilter} style={{ height: '54px', marginLeft: 'auto', width: '160px', minWidth: '160px' }}>
                        <CalenderSVG style={{ height: "16px", marginRight: "16px" }} />
                        <DatePicker
                            style={{ backgroundColor: "red" }}
                            onKeyDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            className={stylesOBj.dateFilter}
                            placeholderText="Month - Year"
                            selected={monthDate}
                            onChange={date => {
                                setMonthDate(date)
                            }}
                            dateFormat="MM-yyyy"
                            maxDate={today}
                            showMonthYearPicker
                        />
                    </div>

                </div>
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
                                            <thead>
                                                <tr>
                                                    <th rowSpan={2}>Recruiter</th>
                                                    <th colSpan={3}>Existing</th>
                                                    <th colSpan={3}>NBD</th>
                                                    <th colSpan={2}>Grand Total</th>
                                                    <th colSpan={2}>Average</th>
                                                </tr>
                                                <tr>
                                                    <th>WON</th>
                                                    <th>PlayGround</th>
                                                    <th>PlayGround %</th>
                                                 
                                                    <th>WON</th>
                                                    <th>PlayGround</th>
                                                    <th>PlayGround %</th>
                                                   
                                                    <th>Existing</th>
                                                    <th>NBD</th>

                                                    <th>Existing</th>
                                                    <th>NBD</th>

                                                </tr>
                                            </thead>
                                            <tbody>
                                                {PLVData?.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="11" className="datacell">
                                                            No data available
                                                        </td>
                                                    </tr>
                                                ) :
                                                    PLVData.map((groupRow, ind) => {
                                                        return <>
                                                            <tr>
                                                                <td colSpan="11" className="datacell" style={{ textAlign: 'start', fontWeight: 'bold' }}>
                                                                    {groupRow?.leadName}
                                                                </td>
                                                            </tr>

                                                            {groupRow?.recruiter.map((row, ind) => {
                                                                return (
                                                                    <tr key={row.recruiterName + ind}>
                                                                        <td className="rowlabel">{row.recruiterName}</td>

                                                                        {/* Existing sub-columns */}
                                                                        <td className="datacell">{row?.existing ?? ''}</td>
                                                                        <td className="datacell">{row?.existingAll ?? ''}</td>
                                                                        <td className="datacell">{calPercentage(row?.existing, row?.existingAll) ?? ''}</td>
                                                                        {/* <td className="datacell">{row?.grandTotalExisting ?? ''}</td>
                                                                        <td className="datacell">{row?.existingMontlyAvg ?? ''}</td> */}

                                                                        {/* NBD sub-columns */}
                                                                        <td className="datacell">{row?.nbd ?? ''}</td>
                                                                        <td className="datacell">{row?.nbdAll ?? ''}</td>
                                                                        <td className="datacell">{calPercentage(row?.nbd, row?.nbdAll) ?? ''}</td>
                                                                        {/* <td className="datacell">{row?.grandTotalNBD ?? ''}</td>
                                                                        <td className="datacell">{row?.nbdMonthlyAVG ?? ''}</td> */}

                                                                        {/* <td className="datacell">{row?.monthlyAvg}</td>
                        <td className={`pct`}> {row?.grandTotal}</td> */}

                        <td className="datacell">{row?.grandTotalExisting ?? ''}</td>
                                                                        <td className="datacell">{row?.grandTotalNBD ?? ''}</td>

                                                                         <td className="datacell">{row?.existingMontlyAvg ?? ''}</td>
                                                                        <td className="datacell">{row?.nbdMonthlyAVG ?? ''}</td>

                                                                    </tr>
                                                                );
                                                            })}

                                                            <tr className="goal-row" key={'GT'}>
                                                                <td className="rowlabel">Grand Total</td>
                                                                <td className="datacell">
                                                                    {`$${getTotal(groupRow?.recruiter, 'existing')}`}
                                                                </td>
                                                                <td className="datacell">
                                                                    {`$${getTotal(groupRow?.recruiter, 'existingAll')}`}
                                                                </td>
                                                                <td className="datacell">
                                                                    {calPercentage(getTotal(groupRow?.recruiter, 'existing').toLocaleString('en-US'), getTotal(groupRow?.recruiter, 'existingAll').toLocaleString('en-US'))}
                                                                </td>
                                                               
                                                                <td className="datacell">
                                                                    {`$${getTotal(groupRow?.recruiter, 'nbd')}`}
                                                                </td>
                                                                <td className="datacell">
                                                                    {`$${getTotal(groupRow?.recruiter, 'nbdAll')}`}
                                                                </td>
                                                                <td className="datacell">
                                                                    {calPercentage(getTotal(groupRow?.recruiter, 'nbd').toLocaleString('en-US'), getTotal(groupRow?.recruiter, 'nbdAll').toLocaleString('en-US'))}
                                                                </td>

                                                                 <td className="datacell">
                                                                    {`$${getTotal(groupRow?.recruiter, 'grandTotalExisting')}`}
                                                                </td>
                                                                  <td className="datacell">
                                                                    {`$${getTotal(groupRow?.recruiter, 'grandTotalNBD')}`}
                                                                </td>
                                                                <td className="datacell">
                                                                    {`$${getTotal(groupRow?.recruiter, 'existingMonthlyAvg')}`}
                                                                </td>
                                                              
                                                                <td className="datacell">
                                                                    {`${getTotal(groupRow?.recruiter, 'nbdMonthlyAVG')}`}
                                                                </td>
                                                            </tr>

                                                        </>

                                                    })}

                                            </tbody>

                                        </table>
                                    
                                    )
                                }
                            </div>
                        </section>






                    </div>

                    <div className="row-pair">
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
                                            <thead>
                                                <tr>
                                                    <th rowSpan={2}>Recruiter</th>
                                                    <th colSpan={3}>Existing</th>
                                                    <th colSpan={3}>NBD</th>
                                                    <th colSpan={2}>Grand Total</th>
                                                    <th colSpan={2}>Average</th>
                                                </tr>
                                                <tr>
                                                    <th>WON</th>
                                                    <th>PlayGround</th>
                                                    <th>PlayGround %</th>
                                                 
                                                    <th>WON</th>
                                                    <th>PlayGround</th>
                                                    <th>PlayGround %</th>
                                                   
                                                    <th>Existing</th>
                                                    <th>NBD</th>

                                                    <th>Existing</th>
                                                    <th>NBD</th>

                                                </tr>
                                            </thead>
                                            <tbody>
                                                {PLCData?.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="11" className="datacell">
                                                            No data available
                                                        </td>
                                                    </tr>
                                                ) :
                                                    PLCData.map((groupRow, ind) => {
                                                        return <>
                                                            <tr>
                                                                <td colSpan="11" className="datacell" style={{ textAlign: 'start', fontWeight: 'bold' }}>
                                                                    {groupRow?.leadName}
                                                                </td>
                                                            </tr>

                                                            {groupRow?.recruiter.map((row, ind) => {
                                                                return (
                                                                    <tr key={row.recruiterName + ind}>
                                                                        <td className="rowlabel">{row.recruiterName}</td>

                                                                        {/* Existing sub-columns */}
                                                                        <td className="datacell">{row?.existing ?? ''}</td>
                                                                        <td className="datacell">{row?.existingAll ?? ''}</td>
                                                                        <td className="datacell">{calPercentage(row?.existing, row?.existingAll) ?? ''}</td>
                                                                        {/* <td className="datacell">{row?.grandTotalExisting ?? ''}</td>
                                                                        <td className="datacell">{row?.existingMontlyAvg ?? ''}</td> */}

                                                                        {/* NBD sub-columns */}
                                                                        <td className="datacell">{row?.nbd ?? ''}</td>
                                                                        <td className="datacell">{row?.nbdAll ?? ''}</td>
                                                                        <td className="datacell">{calPercentage(row?.nbd, row?.nbdAll) ?? ''}</td>
                                                                        {/* <td className="datacell">{row?.grandTotalNBD ?? ''}</td>
                                                                        <td className="datacell">{row?.nbdMonthlyAVG ?? ''}</td> */}

                                                                        {/* <td className="datacell">{row?.monthlyAvg}</td>
                        <td className={`pct`}> {row?.grandTotal}</td> */}

                        <td className="datacell">{row?.grandTotalExisting ?? ''}</td>
                                                                        <td className="datacell">{row?.grandTotalNBD ?? ''}</td>

                                                                         <td className="datacell">{row?.existingMontlyAvg ?? ''}</td>
                                                                        <td className="datacell">{row?.nbdMonthlyAVG ?? ''}</td>

                                                                    </tr>
                                                                );
                                                            })}

                                                            <tr className="goal-row" key={'GT'}>
                                                                <td className="rowlabel">Grand Total</td>
                                                                <td className="datacell">
                                                                    {`${getTotal(groupRow?.recruiter, 'existing')}`}
                                                                </td>
                                                                <td className="datacell">
                                                                    {`${getTotal(groupRow?.recruiter, 'existingAll')}`}
                                                                </td>
                                                                <td className="datacell">
                                                                    {calPercentage(getTotal(groupRow?.recruiter, 'existing').toLocaleString('en-US'), getTotal(groupRow?.recruiter, 'existingAll').toLocaleString('en-US'))}
                                                                </td>
                                                               
                                                                <td className="datacell">
                                                                    {`${getTotal(groupRow?.recruiter, 'nbd')}`}
                                                                </td>
                                                                <td className="datacell">
                                                                    {`${getTotal(groupRow?.recruiter, 'nbdAll')}`}
                                                                </td>
                                                                <td className="datacell">
                                                                    {calPercentage(getTotal(groupRow?.recruiter, 'nbd').toLocaleString('en-US'), getTotal(groupRow?.recruiter, 'nbdAll').toLocaleString('en-US'))}
                                                                </td>

                                                                 <td className="datacell">
                                                                    {`${getTotal(groupRow?.recruiter, 'grandTotalExisting')}`}
                                                                </td>
                                                                  <td className="datacell">
                                                                    {`${getTotal(groupRow?.recruiter, 'grandTotalNBD')}`}
                                                                </td>
                                                                <td className="datacell">
                                                                    {`${getTotal(groupRow?.recruiter, 'existingMonthlyAvg')}`}
                                                                </td>
                                                              
                                                                <td className="datacell">
                                                                    {`${getTotal(groupRow?.recruiter, 'nbdMonthlyAVG')}`}
                                                                </td>
                                                            </tr>

                                                        </>

                                                    })}

                                            </tbody>

                                        </table>
                                    
                                    )
                                }
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
                                            <thead>
                                                <tr>
                                                    <th rowSpan={2}>Recruiter</th>
                                                    <th colSpan={3}>Existing</th>
                                                    <th colSpan={3}>NBD</th>
                                                    <th colSpan={2}>Grand Total</th>
                                                    <th colSpan={2}>Average</th>
                                                </tr>
                                                <tr>
                                                    <th>WON</th>
                                                    <th>PlayGround</th>
                                                    <th>PlayGround %</th>
                                                 
                                                    <th>WON</th>
                                                    <th>PlayGround</th>
                                                    <th>PlayGround %</th>
                                                   
                                                    <th>Existing</th>
                                                    <th>NBD</th>

                                                    <th>Existing</th>
                                                    <th>NBD</th>

                                                </tr>
                                            </thead>
                                            <tbody>
                                                {PLPercentageData?.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="11" className="datacell">
                                                            No data available
                                                        </td>
                                                    </tr>
                                                ) :
                                                    PLPercentageData.map((groupRow, ind) => {
                                                        return <>
                                                            <tr>
                                                                <td colSpan="11" className="datacell" style={{ textAlign: 'start', fontWeight: 'bold' }}>
                                                                    {groupRow?.leadName}
                                                                </td>
                                                            </tr>

                                                            {groupRow?.recruiter.map((row, ind) => {
                                                                return (
                                                                    <tr key={row.recruiterName + ind}>
                                                                        <td className="rowlabel">{row.recruiterName}</td>

                                                                        {/* Existing sub-columns */}
                                                                        <td className="datacell">{row?.existing ?? ''}</td>
                                                                        <td className="datacell">{row?.existingAll ?? ''}</td>
                                                                        <td className="datacell">{calPercentage(row?.existing, row?.existingAll) ?? ''}</td>
                                                                        {/* <td className="datacell">{row?.grandTotalExisting ?? ''}</td>
                                                                        <td className="datacell">{row?.existingMontlyAvg ?? ''}</td> */}

                                                                        {/* NBD sub-columns */}
                                                                        <td className="datacell">{row?.nbd ?? ''}</td>
                                                                        <td className="datacell">{row?.nbdAll ?? ''}</td>
                                                                        <td className="datacell">{calPercentage(row?.nbd, row?.nbdAll) ?? ''}</td>
                                                                        {/* <td className="datacell">{row?.grandTotalNBD ?? ''}</td>
                                                                        <td className="datacell">{row?.nbdMonthlyAVG ?? ''}</td> */}

                                                                        {/* <td className="datacell">{row?.monthlyAvg}</td>
                        <td className={`pct`}> {row?.grandTotal}</td> */}

                        <td className="datacell">{row?.grandTotalExisting ?? ''}</td>
                                                                        <td className="datacell">{row?.grandTotalNBD ?? ''}</td>

                                                                         <td className="datacell">{row?.existingMontlyAvg ?? ''}</td>
                                                                        <td className="datacell">{row?.nbdMonthlyAVG ?? ''}</td>

                                                                    </tr>
                                                                );
                                                            })}

                                                            <tr className="goal-row" key={'GT'}>
                                                                <td className="rowlabel">Grand Total</td>
                                                                <td className="datacell">
                                                                    {`${getTotal(groupRow?.recruiter, 'existing')}`}
                                                                </td>
                                                                <td className="datacell">
                                                                    {`${getTotal(groupRow?.recruiter, 'existingAll')}`}
                                                                </td>
                                                                <td className="datacell">
                                                                    {calPercentage(getTotal(groupRow?.recruiter, 'existing').toLocaleString('en-US'), getTotal(groupRow?.recruiter, 'existingAll').toLocaleString('en-US'))}
                                                                </td>
                                                               
                                                                <td className="datacell">
                                                                    {`${getTotal(groupRow?.recruiter, 'nbd')}`}
                                                                </td>
                                                                <td className="datacell">
                                                                    {`${getTotal(groupRow?.recruiter, 'nbdAll')}`}
                                                                </td>
                                                                <td className="datacell">
                                                                    {calPercentage(getTotal(groupRow?.recruiter, 'nbd').toLocaleString('en-US'), getTotal(groupRow?.recruiter, 'nbdAll').toLocaleString('en-US'))}
                                                                </td>

                                                                 <td className="datacell">
                                                                    {`${getTotal(groupRow?.recruiter, 'grandTotalExisting')}`}
                                                                </td>
                                                                  <td className="datacell">
                                                                    {`${getTotal(groupRow?.recruiter, 'grandTotalNBD')}`}
                                                                </td>
                                                                <td className="datacell">
                                                                    {`${getTotal(groupRow?.recruiter, 'existingMonthlyAvg')}`}
                                                                </td>
                                                              
                                                                <td className="datacell">
                                                                    {`${getTotal(groupRow?.recruiter, 'nbdMonthlyAVG')}`}
                                                                </td>
                                                            </tr>

                                                        </>

                                                    })}

                                            </tbody>

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