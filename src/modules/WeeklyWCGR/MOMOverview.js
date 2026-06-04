import React, { useState, useEffect, Suspense } from 'react'
import uplersStyle from "./weeklyWCGR.module.css"
import {
    Select,
    Table,
    Typography,
    Modal,
    Tooltip,
    InputNumber,
    message,
    Skeleton,
    Checkbox,
    Col,
    Radio,
    Card,
    Spin,
    Avatar,
    Tabs,
} from "antd";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import DatePicker from "react-datepicker";
import moment from "moment";
import { ReportDAO } from "core/report/reportDAO";
import { HTTPStatusCode } from "constants/network";
import { TaDashboardDAO } from "core/taDashboard/taDashboardDRO";
import { useNavigate } from "react-router-dom";
import UTSRoutes from "constants/routes";
import { IoMdAddCircle } from "react-icons/io";
import { ImPushpin } from "react-icons/im";
import { CiCircleInfo } from "react-icons/ci";
import { MdModeEditOutline } from "react-icons/md";
import { GrNotes } from "react-icons/gr";
import { IconContext } from "react-icons";
import Editor from "modules/hiring request/components/textEditor/editor";
import { UserSessionManagementController } from "modules/user/services/user_session_services";
import spinGif from "assets/gif/RefreshLoader.gif";

const { Title, Text } = Typography;


function MOMOverview() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingTable, setIsLoadingTable] = useState(false);
    const [monthDate, setMonthDate] = useState(new Date());
    const selectedYear = monthDate.getFullYear();
    const [hrModal, setHRModal] = useState('DP');
    const [pODList, setPODList] = useState([]);
    const [pODUsersList, setPODUsersList] = useState([]);
    const [selectedHead, setSelectedHead] = useState('');
    const [tableData, setTableData] = useState([]);
    const [headerDataCol, setHeaderDataCol] = useState({});
    const [showComment, setShowComment] = useState(false);
    const [commentData, setCommentData] = useState({});
    const [allCommentList, setALLCommentsList] = useState([]);
    const [isCommentLoading, setIsCommentLoading] = useState(false);
    const [editTalentOfferedCTCModal, setEditTalentOfferedCTCModal] = useState(false)
    const [offeredCTCDeails, setofferedCTCDetails] = useState({})
    const [ctcPerUpdating, setCTCPERUPDATING] = useState(false)


    const [userData, setUserData] = useState({});
    useEffect(() => {
        const getUserResult = async () => {
            let userData = UserSessionManagementController.getUserSession();
            if (userData) setUserData(userData);
        };
        getUserResult();
    }, []);

    const getHeads = async () => {
        setIsLoading(true);

        let filterResult = await ReportDAO.getAllPODGroupDAO();
        setIsLoading(false);
        if (filterResult.statusCode === HTTPStatusCode.OK) {
            setPODList(filterResult && filterResult?.responseBody);

            setSelectedHead(prev => {
                if (prev === '') {
                    getGroupUsers(filterResult?.responseBody[0]?.dd_value);
                    return filterResult?.responseBody[0]?.dd_value
                } else {
                    getGroupUsers(prev);
                    return prev
                }

            });
        } else if (filterResult?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
            // setLoading(false);
            return navigate(UTSRoutes.LOGINROUTE);
        } else if (
            filterResult?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
        ) {
            // setLoading(false);
            return navigate(UTSRoutes.SOMETHINGWENTWRONG);
        } else {
            return "NO DATA FOUND";
        }
    };

    useEffect(() => {
        getHeads();

    }, []);

    const getGroupUsers = async (ID) => {
        setIsLoading(true);

        let pl = {
            id: ID,
            month: moment(monthDate).format("MM"),
            year: selectedYear,
        }

        let filterResult = await ReportDAO.getAllPODGroupUsersDAO(pl);
        setIsLoading(false);
        if (filterResult.statusCode === HTTPStatusCode.OK) {
            setPODUsersList(filterResult && filterResult?.responseBody);
        } else if (filterResult?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
            // setLoading(false);
            return navigate(UTSRoutes.LOGINROUTE);
        } else if (
            filterResult?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
        ) {
            // setLoading(false);
            return navigate(UTSRoutes.SOMETHINGWENTWRONG);
        } else {
            return "NO DATA FOUND";
        }
    };

    const addSectionHeaders = (data) => {
        let previousSection = "";

        return data.flatMap((item, index) => {
            const rows = [];

            // skip first metric row if needed
            if (
                item.stage_Title &&
                item.stage_Title !== previousSection
            ) {
                rows.push({
                    key: `section_${index}`,
                    isSection: true,
                    sectionTitle: item.stage_Title,
                    color:
                        item.stage_Title.includes("JOINING") || item.stage_Title.includes("NEW CUSTOMER FUNNEL") ? "#c05a00"
                            : item.stage_Title.includes("SELECTION") ? "#2952d1"
                                : item.stage_Title.includes("CUSTOMER EXPERIENCE") ? "#15803D"
                                    : item.stage_Title.includes("PIPELINE REVIEW") ? "#BE123C"
                                        : item.stage_Title.includes("CUSTOMER OVERVIEW") ? "#6D28D9"
                                            : item.stage_Title.includes("TOP CLIENTS") ? "#0F766E"
                                                : "#666666",
                });

                previousSection = item.stage_Title;
            }

            rows.push({
                ...item,
                key: item.stage_ID,
            });

            return rows;
        });
    };

    const getMOMReportData = async () => {
        setIsLoadingTable(true);
        // let query = `?podId=${selectedHead}&Month=${moment(monthDate).format("M")}&Year=${selectedYear}`;
        let query = `?Month=${moment(monthDate).format("M")}&Year=${selectedYear}`;
        const result = await ReportDAO.getMOMReportDataDAO(query);
        setIsLoadingTable(false);
        console.log("MOM Report Data: ", result);
        if (result.statusCode === HTTPStatusCode.OK) {
            setHeaderDataCol(result?.responseBody[0]);
            let tempData = addSectionHeaders(result?.responseBody);
            tempData.shift();
            setTableData(tempData);
            // tempData.shift();
            //   setTableData([
            //     {
            //       key: "joining_header",
            //       isSection: true,
            //       sectionTitle: "JOINING · Revenue",
            //       color: "#c05a00",
            //     },
            //     ...tempData,
            //   ]);
        } else if (result?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
            // setLoading(false);
            return navigate(UTSRoutes.LOGINROUTE);
        } else if (
            result?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
        ) {
            return navigate(UTSRoutes.SOMETHINGWENTWRONG);
        } else {
            message.error("Failed to fetch data");
        }


    }

    useEffect(() => {
        if (selectedHead) {
            getMOMReportData();
        }
    }, [selectedHead, monthDate]);


    const AddNoteComp = ({ text, record, keyPar, month, index }) => {
        const isPastMonth = month < moment().format("M");
        const currentMonth = parseInt(moment().format("M"), 10);
        const selectedMonth = parseInt(month, 10);

        const weekMatch = keyPar.match(/W(\d+)/);
        const selectedWeek = weekMatch ? parseInt(weekMatch[1], 10) : null;
        const currentWeekOfMonth = moment().diff(moment().startOf("month"), "weeks") + 1;
        const isPastOrCurrentWeek = selectedMonth === currentMonth && selectedWeek !== null && selectedWeek <= currentWeekOfMonth;

        return (record?.stage_ID === "JAllG" || record?.stage_ID === "JAllGA" || record?.stage_ID === "JAllAA" ||
            record?.stage_Title === "CUSTOMER OVERVIEW" || record?.stage_Title?.includes("TOP CLIENTS")
        ) ? text : <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >


            {text}

            {record.stage_Title.includes("PIPELINE REVIEW") ? (record.stage_ID === "NewNeededPipeleine" || record.stage_ID === "ExistingNeededPipeleine") && !isPastMonth && !isPastOrCurrentWeek ?
                <div style={{ marginLeft: "auto", }}>  <IconContext.Provider
                    value={{
                        // color: "green",
                        style: {
                            width: "10px",
                            height: "10px",

                            cursor: "pointer",
                        },
                    }}
                >
                    {" "}
                    <Tooltip title={`Edit`} placement="top">
                        <span
                            onClick={() => {
                                setEditTalentOfferedCTCModal(true)
                                //   let ctc = parsePrice(text)
                                //   setCommentData({ ...record, hR_Model: "", key: keyPar, month: month, index: index });
                                //   setofferedCTCDetails({ CTC: ctc.amount, ...ctc })
                            }}
                            // className={taStyles.feedbackLabel}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginLeft: "auto",
                            }}
                        >
                            {" "}
                            <MdModeEditOutline />
                        </span>{" "}
                    </Tooltip>
                </IconContext.Provider> </div> : "" : text ?
                <IconContext.Provider
                    value={{
                        // color: "green",
                        style: {
                            width: "10px",
                            height: "10px",
                            marginLeft: "5px",
                            cursor: "pointer",
                        },
                    }}
                >
                    {" "}
                    <Tooltip title={`Add/View Comment`} placement="top">
                        <span
                            onClick={() => {
                                // AddComment(record, keyPar, month);
                            }}
                            // className={taStyles.feedbackLabel}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {" "}
                            <CiCircleInfo />
                        </span>{" "}
                    </Tooltip>
                </IconContext.Provider> : ''
            }

        </div>
    }

    const monthleyCommentsColumns = () => {
        return [
            {
                title: "Month",
                dataIndex: "stage",
                key: "stage",
                width: 200,
                fixed: "left",
                className: "black-header",
                onHeaderCell: () => ({
                    className: "black-header",
                }),
                render: (text, record) => {
                    if (record.isSection) {
                        return {
                            children: (
                                <div
                                    style={{
                                        background: record.color,
                                        color: "#fff",
                                        fontWeight: 700,
                                        padding: "10px 16px",
                                        fontSize: "18px",
                                    }}
                                >
                                    ▌ {record.sectionTitle}
                                </div>
                            ),

                            // props: {
                            //     colSpan: columnCount,
                            // },
                        };
                    }

                    return text;
                },
            },
            {
                title: "Key Wins",
                dataIndex: "stage",
                key: "stage",
                width: 200,
                fixed: "left",
                className: "black-header",
                onHeaderCell: () => ({
                    className: "black-header",
                }),

            },
            {
                title: "Risks / Blockers",
                dataIndex: "stage",
                key: "stage",
                width: 200,
                fixed: "left",
                className: "black-header",
                onHeaderCell: () => ({
                    className: "black-header",
                }),

            },
            {
                title: "Asks",
                dataIndex: "stage",
                key: "stage",
                width: 200,
                fixed: "left",
                className: "black-header",
                onHeaderCell: () => ({
                    className: "black-header",
                }),

            },
            {
                title: "Actions / Owner",
                dataIndex: "stage",
                key: "stage",
                width: 200,
                fixed: "left",
                className: "black-header",
                onHeaderCell: () => ({
                    className: "black-header",
                }),

            },
            {
                title: "Status",
                dataIndex: "stage",
                key: "stage",
                width: 200,
                fixed: "left",
                className: "black-header",
                onHeaderCell: () => ({
                    className: "black-header",
                }),

            },
        ]
    }

    const getTableColumns = () => {
        const countLeafColumns = (columns) =>
            columns.reduce((count, column) => {
                if (column.children && column.children.length) {
                    return count + countLeafColumns(column.children);
                }
                return count + 1;
            }, 0);

        let columnCount = 0;

        // const currentMonth = moment(monthDate).format("MMMM").toUpperCase();
        // const nextMonth = moment(monthDate).add(1, "month").format("MMMM").toUpperCase();
        // const thirdMonth = moment(monthDate).add(2, "month").format("MMMM").toUpperCase();
        const currentMonth = headerDataCol?.startMonth_Name;
        const nextMonth = headerDataCol?.midMonth_Name;
        const thirdMonth = headerDataCol?.endMonth_Name;

        const columns = [
            {
                title: "METRIC",
                dataIndex: "stage",
                key: "stage",
                width: 200,
                fixed: "left",
                className: "black-header",
                onHeaderCell: () => ({
                    className: "black-header",
                }),
                render: (text, record) => {
                    if (record.isSection) {
                        return {
                            children: (
                                <div
                                    style={{
                                        background: record.color,
                                        color: "#fff",
                                        fontWeight: 700,
                                        padding: "10px 16px",
                                        fontSize: "18px",
                                    }}
                                >
                                    ▌ {record.sectionTitle}
                                </div>
                            ),

                            props: {
                                colSpan: columnCount,
                            },
                        };
                    }

                    return text;
                },
            },

            // {
            //   title: "CADENCE",
            //   dataIndex: "cadence",
            //   key: "cadence",
            //   width: 100,
            //   align: "center",
            //   fixed: "left",
            //   className: "black-header",
            // },
            {
                // title: "QUARTERLY",
                title: headerDataCol?.stage_ID,
                dataIndex: "quarterlyTotalStr",
                key: "quarterlyTotalStr",
                width: 120,
                fixed: "left",
                align: "center",
                className: `black-header ${uplersStyle.QuarterlyCol}`,
                onHeaderCell: () => ({
                    className: "black-header",
                }),
                render: (text, record) => {
                    if (record.isSection) {
                        return {
                            props: {
                                colSpan: 0,
                            },
                        };
                    }

                    return text;
                },
            },

            // MONTH 1
            {
                title: currentMonth,
                className: "blue-total-header",
                onHeaderCell: () => ({
                    className: "blue-total-header",
                }),
                children: [
                    {
                        title: "FT BU",
                        dataIndex: 'startMonth_MonthlyTotalStr',
                        key: "m1_total",
                        width: 100,
                        align: "center",
                        className: `black-header ${uplersStyle.totalCol}`,
                        render: (text, record, index) => {
                            if (record.isSection) {
                                return {
                                    props: {
                                        colSpan: 0,
                                    },
                                };
                            }

                            return <AddNoteComp text={text} record={record} keyPar={"startMonth_MonthlyTotalStr"} month={record?.startMonth} index={index} />;
                        },
                    },
                    {
                        title: "NASA",
                        dataIndex: 'startMonth_NASA',
                        key: "m1_w1",
                        width: 100,
                        align: "center",
                        render: (text, record, index) => {
                            if (record.isSection) {
                                return {
                                    props: {
                                        colSpan: 0,
                                    },
                                };
                            }

                            return <AddNoteComp text={text} record={record} keyPar={"startMonth_NASA"} month={record?.startMonth} index={index} />;
                        },
                    },
                    {
                        title: "Phoenix",
                        dataIndex: 'startMonth_Phoenix',
                        key: "m1_w2",
                        width: 100,
                        align: "center",
                        render: (text, record, index) => {
                            if (record.isSection) {
                                return {
                                    props: {
                                        colSpan: 0,
                                    },
                                };
                            }

                            return <AddNoteComp text={text} record={record} keyPar={"startMonth_Phoenix"} month={record?.startMonth} index={index} />;
                        },
                    },
                    {
                        title: "Meteroid",
                        dataIndex: 'startMonth_METEOROID',
                        key: "m1_w3",
                        width: 100,
                        align: "center",
                        render: (text, record, index) => {
                            if (record.isSection) {
                                return {
                                    props: {
                                        colSpan: 0,
                                    },
                                };
                            }

                            return <AddNoteComp text={text} record={record} keyPar={"startMonth_METEOROID"} month={record?.startMonth} index={index} />;
                        },
                    },
                    {
                        title: "India",
                        dataIndex: 'startMonth_Shivam',
                        key: "m1_w4",
                        width: 100,
                        align: "center",
                        render: (text, record, index) => {
                            if (record.isSection) {
                                return {
                                    props: {
                                        colSpan: 0,
                                    },
                                };
                            }

                            return <AddNoteComp text={text} record={record} keyPar={"startMonth_Shivam"} month={record?.startMonth} index={index} />;
                        },
                    },
                    {
                        title: "Nova",
                        dataIndex: 'startMonth_NOVA',
                        key: "m1_w5",
                        width: 100,
                        align: "center",
                        render: (text, record, index) => {
                            if (record.isSection) {
                                return {
                                    props: {
                                        colSpan: 0,
                                    },
                                };
                            }

                            return <AddNoteComp text={text} record={record} keyPar={"startMonth_NOVA"} month={record?.startMonth} index={index} />;
                        },
                    },
                ],
            },

            // MONTH 2
            {
                title: nextMonth,
                className: "green-total-header",
                onHeaderCell: () => ({
                    className: "blue-total-header",
                }),
                children: [
                    {
                        title: "FT BU",
                        dataIndex: 'midMonth_MonthlyTotalStr',
                        key: "m2_total",
                        width: 100,
                        align: "center",
                        className: `black-header ${uplersStyle.totalCol}`,
                        render: (text, record, index) => {
                            if (record.isSection) {
                                return {
                                    props: {
                                        colSpan: 0,
                                    },
                                };
                            }

                            return <AddNoteComp text={text} record={record} keyPar={"midMonth_MonthlyTotalStr"} month={record?.midMonth} index={index} />;
                        },
                    },
                    {
                        title: "NASA",
                        dataIndex: 'midMonth_NASA',
                        key: "m2_w1",
                        width: 100,
                        align: "center",
                        render: (text, record, index) => {
                            if (record.isSection) {
                                return {
                                    props: {
                                        colSpan: 0,
                                    },
                                };
                            }

                            return <AddNoteComp text={text} record={record} keyPar={"midMonth_NASA"} month={record?.midMonth} index={index} />;
                        },
                    },
                    {
                        title: "Phenix",
                        dataIndex: 'midMonth_Phoenix',
                        key: "m2_w2",
                        width: 100,
                        align: "center",
                        render: (text, record, index) => {
                            if (record.isSection) {
                                return {
                                    props: {
                                        colSpan: 0,
                                    },
                                };
                            }

                            return <AddNoteComp text={text} record={record} keyPar={"midMonth_Phoenix"} month={record?.midMonth} index={index} />;
                        },
                    },
                    {
                        title: "Meteroid",
                        dataIndex: 'midMonth_METEOROID',
                        key: "m2_w3",
                        width: 100,
                        align: "center",
                        render: (text, record, index) => {
                            if (record.isSection) {
                                return {
                                    props: {
                                        colSpan: 0,
                                    },
                                };
                            }

                            return <AddNoteComp text={text} record={record} keyPar={"midMonth_METEOROID"} month={record?.midMonth} index={index} />;
                        },
                    },
                    {
                        title: "India",
                        dataIndex: 'midMonth_Shivam',
                        key: "m2_w4",
                        width: 100,
                        align: "center",
                        render: (text, record, index) => {
                            if (record.isSection) {
                                return {
                                    props: {
                                        colSpan: 0,
                                    },
                                };
                            }

                            return <AddNoteComp text={text} record={record} keyPar={"midMonth_Shivam"} month={record?.midMonth} index={index} />;
                        },

                    },
                    {
                        title: "Nova",
                        dataIndex: 'midMonth_NOVA',
                        key: "m2_w5",
                        width: 100,
                        align: "center",
                        render: (text, record, index) => {
                            if (record.isSection) {
                                return {
                                    props: {
                                        colSpan: 0,
                                    },
                                };
                            }

                            return <AddNoteComp text={text} record={record} keyPar={"midMonth_NOVA"} month={record?.midMonth} index={index} />;
                        },
                    },
                ],
            },

            // MONTH 3
            {
                title: thirdMonth,
                className: "purple-total-header",
                onHeaderCell: () => ({
                    className: "blue-total-header",
                }),
                children: [
                    {
                        title: "FT BU",
                        dataIndex: 'endMonth_MonthlyTotalStr',
                        key: "m3_total",
                        width: 100,
                        align: "center",
                        className: `black-header ${uplersStyle.totalCol}`,
                        render: (text, record, index) => {
                            if (record.isSection) {
                                return {
                                    props: {
                                        colSpan: 0,
                                    },
                                };
                            }

                            return <AddNoteComp text={text} record={record} keyPar={"endMonth_MonthlyTotalStr"} month={record?.endMonth} index={index} />;
                        },

                    },
                    {
                        title: "NASA",
                        dataIndex: 'endMonth_NASA',
                        key: "m3_w1",
                        width: 100,
                        align: "center",
                        render: (text, record, index) => {
                            if (record.isSection) {
                                return {
                                    props: {
                                        colSpan: 0,
                                    },
                                };
                            }

                            return <AddNoteComp text={text} record={record} keyPar={"endMonth_NASA"} month={record?.endMonth} index={index} />;
                        },
                    },
                    {
                        title: "Phenix",
                        dataIndex: 'endMonth_Phoenix',
                        key: "m3_w2",
                        width: 100,
                        align: "center",
                        render: (text, record, index) => {
                            if (record.isSection) {
                                return {
                                    props: {
                                        colSpan: 0,
                                    },
                                };
                            }

                            return <AddNoteComp text={text} record={record} keyPar={"endMonth_Phoenix"} month={record?.endMonth} index={index} />;
                        },
                    },
                    {
                        title: "Meteroid",
                        dataIndex: 'endMonth_METEOROID',
                        key: "m3_w3",
                        width: 100,
                        align: "center",
                        render: (text, record, index) => {
                            if (record.isSection) {
                                return {
                                    props: {
                                        colSpan: 0,
                                    },
                                };
                            }

                            return <AddNoteComp text={text} record={record} keyPar={"endMonth_METEOROID"} month={record?.endMonth} index={index} />;
                        },
                    },
                    {
                        title: "India",
                        dataIndex: 'endMonth_Shivam',
                        key: "m3_w4",
                        width: 100,
                        align: "center",
                        render: (text, record, index) => {
                            if (record.isSection) {
                                return {
                                    props: {
                                        colSpan: 0,
                                    },
                                };
                            }

                            return <AddNoteComp text={text} record={record} keyPar={"endMonth_Shivam"} month={record?.endMonth} index={index} />;
                        },
                    },
                    {
                        title: "Nova",
                        dataIndex: 'endMonth_NOVA',
                        key: "m3_w5",
                        width: 100,
                        align: "center",
                        render: (text, record, index) => {
                            if (record.isSection) {
                                return {
                                    props: {
                                        colSpan: 0,
                                    },
                                };
                            }

                            return <AddNoteComp text={text} record={record} keyPar={"endMonth_NOVA"} month={record?.endMonth} index={index} />;
                        },
                    },
                ],
            },
        ];

        columnCount = countLeafColumns(columns);
        return columns;
    };

    return (
        <div className={uplersStyle.hiringRequestContainer}>
            <div className={uplersStyle.filterContainer}>
                <div className={uplersStyle.filterSets}>
                    <div className={uplersStyle.filterSetsInner}>
                        <Title level={4} style={{ margin: 0 }}>
                            FTE BU  ·  Month-on-Month Overview
                            {/* {`${monthDate?.toLocaleString("default", {
                  month: "long",
                })} ${selectedYear}`} */}
                        </Title>
                    </div>
                    <div className={uplersStyle.filterRight}>
                        <Radio.Group
                            onChange={(e) => {
                                setHRModal(e.target.value);
                                if (e.target.value === "Contract") {
                                    let val = pODList.find(
                                        (i) => i.dd_text === "Orion"
                                    )?.dd_value;
                                    setSelectedHead(val);
                                    getGroupUsers(val);
                                } else {
                                    let val = pODList[0]?.dd_value;
                                    setSelectedHead(val);
                                    getGroupUsers(val);
                                }

                                //  setEngagementType(e.target.value);
                            }}
                            value={hrModal}
                        >
                            <Radio value={"DP"}>FTE</Radio>
                            {/* <Radio value={"Contract"}>Contract</Radio> */}
                        </Radio.Group>
                        {/* <Select
                            id="selectedValue"
                            placeholder="Select Head"
                            style={{ width: "270px" }}
                            // mode="multiple"
                            value={selectedHead}
                            showSearch={true}
                            onChange={(value, option) => {
                                setSelectedHead(value);
                                getGroupUsers(value);
                            }}
                            options={pODList?.map((v) => ({
                                label: v.dd_text,
                                value: v.dd_value,
                            })).filter(item => {
                                if (hrModal === "DP") {
                                    return item.value !== 5
                                } else {
                                    return item.value === 5
                                }
                            })}
                            optionFilterProp="label"
                        /> */}
                        <div className={uplersStyle.calendarFilterSet}>
                            <div className={uplersStyle.label}>Month-Year</div>
                            <div className={uplersStyle.calendarFilter}>
                                <CalenderSVG style={{ height: "16px", marginRight: "8px" }} />
                                <DatePicker
                                    onKeyDown={(e) => e.preventDefault()}
                                    className={uplersStyle.dateFilter}
                                    placeholderText="Month - Year"
                                    selected={monthDate}
                                    onChange={(date) => setMonthDate(date)}
                                    dateFormat="MM-yyyy"
                                    showMonthYearPicker
                                />
                            </div>
                        </div>
                    </div>
                </div>


            </div>

            <div className={uplersStyle.tableWrapper}>
                {isLoading || isLoadingTable ? (
                    <Skeleton active />
                ) : (
                    <Table
                        columns={getTableColumns()}
                        dataSource={tableData}
                        loading={isLoadingTable}
                        pagination={false}
                        scroll={{
                            x: "max-content",
                            y: "calc(100vh - 280px) !important",
                        }}
                        size="small"
                        bordered
                        rowClassName={(record) => {
                            if (record.stage_ID === "JAllG" || record.stage_ID === "JAllNetAchieved" || record.stage_ID === "SG" ||
                                record.stage_ID === "SNetAchieved" || record.stage_ID === "SJRatio" || record.stage_ID === "O2S"
                            ) {
                                return uplersStyle.boldRow;
                            }
                        }}
                    />
                )}
                {/* {isLoading || isLoadingTable ? (
                        <Skeleton active />
                    ) : (
                        <Table
                            columns={monthleyCommentsColumns()}
                            dataSource={tableData}
                            loading={isLoadingTable}
                            pagination={false}
                            scroll={{
                                x: "max-content",
                                y: "calc(100vh - 280px) !important",
                            }}
                            size="small"
                            bordered
                            rowClassName={(record) => {
                                if (record.stage_ID === "JAllG" || record.stage_ID === "JAllNetAchieved" || record.stage_ID === "SG" ||
                                    record.stage_ID === "SNetAchieved" || record.stage_ID === "SJRatio" || record.stage_ID === "O2S"
                                ) {
                                    return uplersStyle.boldRow;
                                }
                            }}
                        />
                    )} */}
            </div>
        </div>

    )
}

export default MOMOverview