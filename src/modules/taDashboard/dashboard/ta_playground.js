import React, { useState, useEffect } from 'react'
import stylesOBj from '../../ScrumS2/scrumStructure.module.css'
import DateNav from '../../ScrumS2/OPSDashboard/DateNav';
import { periodRange, periodLabel } from '../../ScrumS2/OPSDashboard/dateNavUtils';
import { pctOf, statusClass, metricStatus } from '../../ScrumS2/OPSDashboard/sectionMath';
import {
    Select, Modal, Table
} from "antd";
import { TaDashboardDAO } from "core/taDashboard/taDashboardDRO";
import { useNavigate } from 'react-router-dom';
import { HTTPStatusCode } from "constants/network";
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton'
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


const existingStyle = { background: '#e2fde2' }
const ndbStyle = { background: '#e2f1fb' }


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



    const [popUPLoading, setPOPupLoading] = useState(false)
    const [popUPDAta, setPOPupData] = useState([])
    const [showPopup, setShowPopup] = useState(false)
    const [popupRowData, setpopupRowData] = useState({})

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

        if (!won || !totalVal) return "";
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


    const getPOPUP = async (data, businessType, status, value, table) => {
        setShowPopup(true)
        setpopupRowData({ ...data, businessType: businessType, status: status, value: value, table: table })
        let pl = `?POD_Id=5&Month=${moment(monthDate).format('MM')}&Year=${moment(monthDate).format('YYYY')}&TAUserID=${data?.id}&BusinessType=${businessType}&Status=${status}`
        setPOPupLoading(true);
        let result = await TaDashboardDAO.getTAPlaygroundTablePOPUPDAO(pl);
        setPOPupLoading(false);

        if (result?.statusCode === 200) {
            setPOPupData(result.responseBody)
        } else {
            setPOPupData([])
        }

    }

    const popupSellHeadStyle = { fontSize: '12px' }
    const popupSellStyle = { fontSize: '10px', textAlign: 'start', display: 'flex' }

    const popupColumns = [{
        title: <span style={popupSellHeadStyle}>Date</span>,
        dataIndex: "hrCreatedDate",
        key: "hrCreatedDate",
        align: "center",
        render: (text, value) => {
            return <span style={popupSellStyle}>{moment(text).format('DD/MM/YYYY')}</span>
        }
    },

    {
        title: <span style={popupSellHeadStyle}>Company</span>,
        dataIndex: "company",
        key: "company",
        align: "center",
        render: (text, value) => {
            return <span style={popupSellStyle}><a href={`/viewCompanyDetails/${value?.company_ID}`} target="_blank" >{text}</a></span>
        }
    },
    {
        title: <span style={popupSellHeadStyle}>HR #</span>,
        dataIndex: "hR_Number",
        key: "hR_Number",
        align: "center",
        width: "150px",
        render: (text, value) => {
            return <span style={popupSellStyle}> <a href={`/allhiringrequest/${value?.hrId}`} target="_blank" >{text}</a></span>
        }
    },
    {
        title: <span style={popupSellHeadStyle}>HR Title</span>,
        dataIndex: "hrTitle",
        key: "hrTitle",
        align: "center",
        width: "180px",
        render: (text, value) => {
            return <span style={popupSellStyle}>{text}</span>
        }
    },
      {
        title: <span style={popupSellHeadStyle}>Eng. Type</span>,
        dataIndex: "modelType",
        key: "modelType",
        align: "center",
        width: "100px",
        render: (text, value) => {
            return <span style={popupSellStyle}>{text}</span>
        }
    },
    {
        title: <span style={popupSellHeadStyle}>Uplers <br /> Fees</span>,
        dataIndex: "uplersFees",
        key: "uplersFees",
        align: "center",
        width: "80px",
        render: (text, value) => {
            return <span style={popupSellStyle}>{text ? `$${text?.toLocaleString('en-US')}` : ''}</span>
        }
    },
    {
        title: <span style={popupSellHeadStyle}>Uplers <br />Fees %</span>,
        dataIndex: "uplersFeesPer",
        key: "uplersFeesPer",
        align: "center",
        width: "80px",
        render: (text, value) => {
            return <span style={popupSellStyle}>{text}</span>
        }
    },
    {
        title: <span style={popupSellHeadStyle}>Sales Person</span>,
        dataIndex: "salesPersonName",
        key: "salesPersonName",
        align: "center",
        render: (text, value) => {
            return <span style={popupSellStyle}>{text}</span>
        }
    },
    {
        title: <span style={popupSellHeadStyle}>Lead Type</span>,
        dataIndex: "leadType",
        key: "leadType",
        align: "center",
        width: "100px",
        render: (text, value) => {
            return <span style={popupSellStyle}>{text}</span>
        }
    },
    ];

    const getGrandTotalRow = () => {
        let allRows = []

        PLVData.forEach(group => {
            allRows = [...allRows, ...group.recruiter]
        })

        return <tr className="total-row" key={'GT'}>
            <td className="rowlabel">Grand Total</td>
            <td className="datacell">
                {`$${getTotal(allRows, 'existing').toLocaleString('en-US')}`}
            </td>
            <td className="datacell">
                {`$${getTotal(allRows, 'existingAll').toLocaleString('en-US')}`}
            </td>
            <td className="datacell">
                {/* {calPercentage(getTotal(allRows, 'existing').toLocaleString('en-US'), getTotal(allRows, 'existingAll').toLocaleString('en-US'))} */}
            </td>

            <td className="datacell">
                {`$${getTotal(allRows, 'nbd').toLocaleString('en-US')}`}
            </td>
            <td className="datacell">
                {`$${getTotal(allRows, 'nbdAll').toLocaleString('en-US')}`}
            </td>
            <td className="datacell">
                {/* {calPercentage(getTotal(allRows, 'nbd').toLocaleString('en-US'), getTotal(allRows, 'nbdAll').toLocaleString('en-US'))} */}
            </td>
            <td className="datacell">
                {`$${getTotal(allRows.map(i => ({ grandTotalExisting: addNumbers(i?.existing, i?.nbd) })), 'grandTotalExisting').toLocaleString('en-US')}`}
            </td>
            <td className="datacell">
                {`$${getTotal(allRows.map(i => ({ grandTotalNBD: addNumbers(i?.existingAll, i?.nbdAll) })), 'grandTotalNBD').toLocaleString('en-US')}`}
            </td>
            <td className="datacell">
                {`$${getTotal(allRows, 'existingMontlyAvg').toLocaleString('en-US')}`}
            </td>

            <td className="datacell">
                {`$${getTotal(allRows, 'nbdMonthlyAVG').toLocaleString('en-US')}`}
            </td>
        </tr>
    }

    const getGrandTotalNUM = () => {

        let allRows = []

        PLCData.forEach(group => {
            allRows = [...allRows, ...group.recruiter]
        })
        return <tr className="total-row" key={'GT'}>
            <td className="rowlabel">Grand Total</td>
            <td className="datacell">
                {`${getTotal(allRows, 'existing')}`}
            </td>
            <td className="datacell">
                {`${getTotal(allRows, 'existingAll')}`}
            </td>
            <td className="datacell">
                {/* {calPercentage(getTotal(allRows, 'existing').toLocaleString('en-US'), getTotal(allRows, 'existingAll').toLocaleString('en-US'))} */}
            </td>

            <td className="datacell">
                {`${getTotal(allRows, 'nbd')}`}
            </td>
            <td className="datacell">
                {`${getTotal(allRows, 'nbdAll')}`}
            </td>
            <td className="datacell">
                {/* {calPercentage(getTotal(allRows, 'nbd').toLocaleString('en-US'), getTotal(allRows, 'nbdAll').toLocaleString('en-US'))} */}
            </td>

            <td className="datacell">
                {`${getTotal(allRows.map(i => ({ grandTotalExisting: addNumbers(i?.existing, i?.nbd) })), 'grandTotalExisting')}`}
            </td>
            <td className="datacell">
                {`${getTotal(allRows.map(i => ({ grandTotalNBD: addNumbers(i?.existingAll, i?.nbdAll) })), 'grandTotalNBD')}`}
            </td>
            <td className="datacell">
                {`${getTotal(allRows, 'existingMonthlyAvg')}`}
            </td>

            <td className="datacell">
                {`${getTotal(allRows, 'nbdMonthlyAVG')}`}
            </td>
        </tr>
    }



    return (

        <div className={`${stylesOBj["dashboard-container"]}`}>
            <main className={`${stylesOBj["main-content"]}`}>
                <div
                    //  className={`${stylesOBj["filterContainer"]}`}
                    style={{ display: 'flex', paddingRight: '15px', margin: '15px 10px', marginBottom: '5px' }}>


                    {/* <Select
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
                    /> */}

                    <div className={stylesOBj.calendarFilter} style={{ height: '35px', marginLeft: 'auto', width: '160px', minWidth: '160px' }}>
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
                <header style={{ marginLeft: '16px', marginRight: '16px' }}>
                    <div className="title-block">
                        {/* <p className="eyebrow">Talent Operations · NASA POD · Uplers</p> */}
                        {/* <h1>TA Dashboard</h1> */}
                    </div>
                </header>
                <div className="wrap" style={{ overflow: 'scroll', marginBottom: '80px' }}>


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
                                                    <th colSpan={3} className={'existingStyle'}>Existing</th>
                                                    <th colSpan={3} className={'ndbStyle'}>NBD</th>
                                                    <th colSpan={2}>Grand Total</th>
                                                    <th colSpan={2}>Average</th>
                                                </tr>
                                                <tr>
                                                    <th className={'existingStyle'}>WON</th>
                                                    <th className={'existingStyle'}>Play Ground</th>
                                                    <th className={'existingStyle'}>Play Ground %</th>

                                                    <th className={'ndbStyle'}>WON</th>
                                                    <th className={'ndbStyle'}>Play Ground</th>
                                                    <th className={'ndbStyle'}>Play Ground %</th>

                                                    <th>WON</th>
                                                    <th>Play Ground</th>

                                                    <th>WON</th>
                                                    <th>Play Ground</th>

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
                                                                        <td className="datacell existingStyle" ><span className="datacelllink" onClick={() => { getPOPUP(row, "Existing", 'Won', row?.existing, "Revenue") }}>{row?.existing ?? ''}</span></td>
                                                                        <td className="datacell existingStyle" ><span className="datacelllink" onClick={() => { getPOPUP(row, "Existing", 'All', row?.existingAll, "Revenue") }}>{row?.existingAll ?? ''}</span></td>
                                                                        <td className="datacell existingStyle" >{calPercentage(row?.existing, row?.existingAll) ?? ''}</td>
                                                                        {/* <td className="datacell">{row?.grandTotalExisting ?? ''}</td>
                                                                        <td className="datacell">{row?.existingMontlyAvg ?? ''}</td> */}

                                                                        {/* NBD sub-columns */}
                                                                        <td className="datacell ndbStyle" ><span className="datacelllink" onClick={() => { getPOPUP(row, "New", 'Won', row?.nbd, "Revenue") }}>{row?.nbd ?? ''}</span></td>
                                                                        <td className="datacell ndbStyle" ><span className="datacelllink" onClick={() => { getPOPUP(row, "New", 'All', row?.nbdAll, "Revenue") }}>{row?.nbdAll ?? ''}</span></td>
                                                                        <td className="datacell ndbStyle" >{calPercentage(row?.nbd, row?.nbdAll) ?? ''}</td>
                                                                        {/* <td className="datacell">{row?.grandTotalNBD ?? ''}</td>
                                                                        <td className="datacell">{row?.nbdMonthlyAVG ?? ''}</td> */}

                                                                        {/* <td className="datacell">{row?.monthlyAvg}</td>
                        <td className={`pct`}> {row?.grandTotal}</td> */}

                                                                        <td className="datacell">{`$${addNumbers(row?.existing, row?.nbd).toLocaleString('en-US')}`}</td>
                                                                        <td className="datacell">{`$${addNumbers(row?.existingAll, row?.nbdAll).toLocaleString('en-US')}`}</td>

                                                                        <td className="datacell">{row?.existingMontlyAvg ?? ''}</td>
                                                                        <td className="datacell">{row?.nbdMonthlyAVG ?? ''}</td>

                                                                    </tr>
                                                                );
                                                            })}

                                                            <tr className="goal-row" key={'GT'}>
                                                                <td className="rowlabel">Group Total</td>
                                                                <td className="datacell existingStyle">
                                                                    {`$${getTotal(groupRow?.recruiter, 'existing').toLocaleString('en-US')}`}
                                                                </td>
                                                                <td className="datacell existingStyle">
                                                                    {`$${getTotal(groupRow?.recruiter, 'existingAll').toLocaleString('en-US')}`}
                                                                </td>
                                                                <td className="datacell existingStyle">
                                                                    {calPercentage(getTotal(groupRow?.recruiter, 'existing').toLocaleString('en-US'), getTotal(groupRow?.recruiter, 'existingAll').toLocaleString('en-US'))}
                                                                </td>

                                                                <td className="datacell ndbStyle">
                                                                    {`$${getTotal(groupRow?.recruiter, 'nbd').toLocaleString('en-US')}`}
                                                                </td>
                                                                <td className="datacell ndbStyle">
                                                                    {`$${getTotal(groupRow?.recruiter, 'nbdAll').toLocaleString('en-US')}`}
                                                                </td>
                                                                <td className="datacell ndbStyle">
                                                                    {calPercentage(getTotal(groupRow?.recruiter, 'nbd').toLocaleString('en-US'), getTotal(groupRow?.recruiter, 'nbdAll').toLocaleString('en-US'))}
                                                                </td>
                                                                <td className="datacell">
                                                                    {`$${getTotal(groupRow?.recruiter.map(i => ({ grandTotalExisting: addNumbers(i?.existing, i?.nbd) })), 'grandTotalExisting').toLocaleString('en-US')}`}
                                                                </td>
                                                                <td className="datacell">
                                                                    {`$${getTotal(groupRow?.recruiter.map(i => ({ grandTotalNBD: addNumbers(i?.existingAll, i?.nbdAll) })), 'grandTotalNBD').toLocaleString('en-US')}`}
                                                                </td>
                                                                <td className="datacell">
                                                                    {`$${getTotal(groupRow?.recruiter, 'existingMontlyAvg').toLocaleString('en-US')}`}
                                                                </td>

                                                                <td className="datacell">
                                                                    {`$${getTotal(groupRow?.recruiter, 'nbdMonthlyAVG').toLocaleString('en-US')}`}
                                                                </td>
                                                            </tr>




                                                        </>

                                                    })}

                                                {getGrandTotalRow()}

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
                                                    <th colSpan={3} className={'existingStyle'}>Existing</th>
                                                    <th colSpan={3} className={'ndbStyle'}>NBD</th>
                                                    <th colSpan={2}>Grand Total</th>
                                                    <th colSpan={2}>Average</th>
                                                </tr>
                                                <tr>
                                                    <th className={'existingStyle'}>WON</th>
                                                    <th className={'existingStyle'}>Play Ground</th>
                                                    <th className={'existingStyle'}>Play Ground %</th>

                                                    <th className={'ndbStyle'}>WON</th>
                                                    <th className={'ndbStyle'}>Play Ground</th>
                                                    <th className={'ndbStyle'}>Play Ground %</th>


                                                    <th>WON</th>
                                                    <th>Play Ground</th>

                                                    <th>WON</th>
                                                    <th>Play Ground</th>

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
                                                                        <td className="datacell existingStyle" ><span className="datacelllink" onClick={() => { getPOPUP(row, "Existing", 'Won', row?.existing, "HRs") }}>{row?.existing ?? ''}</span></td>
                                                                        <td className="datacell existingStyle" ><span className="datacelllink" onClick={() => { getPOPUP(row, "Existing", 'All', row?.existingAll, "HRs") }}>{row?.existingAll ?? ''}</span></td>
                                                                        <td className="datacell existingStyle" >{calPercentage(row?.existing, row?.existingAll) ?? ''}</td>
                                                                        {/* <td className="datacell">{row?.grandTotalExisting ?? ''}</td>
                                                                        <td className="datacell">{row?.existingMontlyAvg ?? ''}</td> */}

                                                                        {/* NBD sub-columns */}
                                                                        <td className="datacell ndbStyle" ><span className="datacelllink" onClick={() => { getPOPUP(row, "New", 'Won', row?.nbd, "HRs") }}>{row?.nbd ?? ''}</span></td>
                                                                        <td className="datacell ndbStyle" ><span className="datacelllink" onClick={() => { getPOPUP(row, "New", 'All', row?.nbdAll, "HRs") }}>{row?.nbdAll ?? ''}</span></td>
                                                                        <td className="datacell ndbStyle" >{calPercentage(row?.nbd, row?.nbdAll) ?? ''}</td>

                                                                        {/* <td className="datacell">{row?.monthlyAvg}</td>
                        <td className={`pct`}> {row?.grandTotal}</td> */}

                                                                        <td className="datacell">{`${addNumbers(row?.existing, row?.nbd)}`}</td>
                                                                        <td className="datacell">{`${addNumbers(row?.existingAll, row?.nbdAll)}`}</td>

                                                                        <td className="datacell">{row?.existingMontlyAvg ?? ''}</td>
                                                                        <td className="datacell">{row?.nbdMonthlyAVG ?? ''}</td>

                                                                    </tr>
                                                                );
                                                            })}

                                                            <tr className="goal-row" key={'GT'}>
                                                                <td className="rowlabel">Group Total</td>
                                                                <td className="datacell existingStyle">
                                                                    {`${getTotal(groupRow?.recruiter, 'existing')}`}
                                                                </td>
                                                                <td className="datacell existingStyle">
                                                                    {`${getTotal(groupRow?.recruiter, 'existingAll')}`}
                                                                </td>
                                                                <td className="datacell existingStyle">
                                                                    {calPercentage(getTotal(groupRow?.recruiter, 'existing').toLocaleString('en-US'), getTotal(groupRow?.recruiter, 'existingAll').toLocaleString('en-US'))}
                                                                </td>

                                                                <td className="datacell nbdStyle">
                                                                    {`${getTotal(groupRow?.recruiter, 'nbd')}`}
                                                                </td>
                                                                <td className="datacell nbdStyle">
                                                                    {`${getTotal(groupRow?.recruiter, 'nbdAll')}`}
                                                                </td>
                                                                <td className="datacell nbdStyle">
                                                                    {calPercentage(getTotal(groupRow?.recruiter, 'nbd').toLocaleString('en-US'), getTotal(groupRow?.recruiter, 'nbdAll').toLocaleString('en-US'))}
                                                                </td>

                                                                <td className="datacell">
                                                                    {`${getTotal(groupRow?.recruiter.map(i => ({ grandTotalExisting: addNumbers(i?.existing, i?.nbd) })), 'grandTotalExisting')}`}
                                                                </td>
                                                                <td className="datacell">
                                                                    {`${getTotal(groupRow?.recruiter.map(i => ({ grandTotalNBD: addNumbers(i?.existingAll, i?.nbdAll) })), 'grandTotalNBD')}`}
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
                                                {getGrandTotalNUM()}
                                            </tbody>

                                        </table>

                                    )
                                }
                            </div>
                        </section>

                    </div>


                    {showPopup && <Modal
                        transitionName=""
                        width="1000px"
                        centered
                        footer={null}
                        open={showPopup}
                        className="engagementModalStyle"
                        onCancel={() => {
                            setShowPopup(false)
                        }}>
                        <>
                            <h4 className="ta-popup-modal-title">{popupRowData?.recruiterName} : {popupRowData?.status === "All" ? "Playground" : popupRowData?.status} {popupRowData?.table} : {popupRowData?.value} </h4>
                            {popUPLoading ? <TableSkeleton /> : (
                                <div style={{ margin: '10px', }}><Table
                                    scroll={{ y: "auto" }}
                                    dataSource={popUPDAta}
                                    columns={popupColumns}
                                    pagination={false}
                                /></div>

                            )}
                        </>
                    </Modal>}



                </div>
            </main> </div>

    )
}

export default TAplayground