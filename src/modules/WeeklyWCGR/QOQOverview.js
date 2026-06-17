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


function QOQOverview() {
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

    const getQOQReportData = async () => {
        setIsLoadingTable(true);
        // let query = `?podId=${selectedHead}&Month=${moment(monthDate).format("M")}&Year=${selectedYear}`;
        let query = `?Year=${selectedYear}`;
        const result = await ReportDAO.getQOQReportDataDAO(query);
        setIsLoadingTable(false);
        console.log("QOQ Report Data: ", result);
        if (result.statusCode === HTTPStatusCode.OK) {
            setHeaderDataCol(result?.responseBody[0]);
            let tempData = addSectionHeaders(result?.responseBody) || [];
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
        getQOQReportData();
    }, [monthDate]);


    const AddNoteComp = ({ text, record, keyPar, month, index }) => {
        const isPastMonth = month < moment().format("M");
        const currentMonth = parseInt(moment().format("M"), 10);
        const selectedMonth = parseInt(month, 10);

        const weekMatch = keyPar.match(/W(\d+)/);
        const selectedWeek = weekMatch ? parseInt(weekMatch[1], 10) : null;
        const currentWeekOfMonth = moment().diff(moment().startOf("month"), "weeks") + 1;
        const isPastOrCurrentWeek = selectedMonth === currentMonth && selectedWeek !== null && selectedWeek <= currentWeekOfMonth;

        return text 

        
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
        const currentMonth = headerDataCol?.q1Str;
        const nextMonth = headerDataCol?.q2Str;
        const thirdMonth = headerDataCol?.q3Str;
        const fourthMonth = headerDataCol?.q4Str;

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

            {
              title: "Year Total",
              dataIndex: "yearlyTotalStr",
              key: "yearlyTotalStr",        
              align: "center",
              fixed: "left",
              className: "black-header",
            },
            // {
            //     // title: "QUARTERLY",
            //     title: headerDataCol?.stage_ID,
            //     dataIndex: "quarterlyTotalStr",
            //     key: "quarterlyTotalStr",
            //     width: 120,
            //     fixed: "left",
            //     align: "center",
            //     className: `black-header ${uplersStyle.QuarterlyCol}`,
            //     onHeaderCell: () => ({
            //         className: "black-header",
            //     }),
            //     render: (text, record) => {
            //         if (record.isSection) {
            //             return {
            //                 props: {
            //                     colSpan: 0,
            //                 },
            //             };
            //         }

            //         return text;
            //     },
            // },

            // MONTH 1
            {
                title: currentMonth,
                className: "blue-total-header",
                onHeaderCell: () => ({
                    className: "blue-total-header",
                }),
                children: [
                    {
                        title: "Total",
                        dataIndex: 'q1Str',
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

                            return <AddNoteComp text={text} record={record} keyPar={"q1Str"} month={record?.startMonth} index={index} />;
                        },
                    },
                    {
                        title: "NASA",
                        dataIndex: 'q1_NASAStr',
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

                            return <AddNoteComp text={text} record={record} keyPar={"q1_NASAStr"} month={record?.startMonth} index={index} />;
                        },
                    },
                    {
                        title: "Phoenix",
                        dataIndex: 'q1_PhoenixStr',
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

                            return <AddNoteComp text={text} record={record} keyPar={"q1_PhoenixStr"} month={record?.startMonth} index={index} />;
                        },
                    },
                    {
                        title: "Meteroid",
                        dataIndex: 'q1_METEOROIDStr',
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

                            return <AddNoteComp text={text} record={record} keyPar={"q1_METEOROIDStr"} month={record?.startMonth} index={index} />;
                        },
                    },
                    {
                        title: "India",
                        dataIndex: 'q1_ShivamStr',
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

                            return <AddNoteComp text={text} record={record} keyPar={"q1_ShivamStr"} month={record?.startMonth} index={index} />;
                        },
                    },
                    {
                        title: "Nova",
                        dataIndex: 'q1_NOVAStr',
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

                            return <AddNoteComp text={text} record={record} keyPar={"q1_NOVAStr"} month={record?.startMonth} index={index} />;
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
                        title: "Total",
                        dataIndex: 'q2Str',
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

                            return <AddNoteComp text={text} record={record} keyPar={"q2Str"} month={record?.midMonth} index={index} />;
                        },
                    },
                    {
                        title: "NASA",
                        dataIndex: 'q2_NASAStr',
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

                            return <AddNoteComp text={text} record={record} keyPar={"q2_NASAStr"} month={record?.midMonth} index={index} />;
                        },
                    },
                    {
                        title: "Phenix",
                        dataIndex: 'q2_PhoenixStr',
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

                            return <AddNoteComp text={text} record={record} keyPar={"q2_PhoenixStr"} month={record?.midMonth} index={index} />;
                        },
                    },
                    {
                        title: "Meteroid",
                        dataIndex: 'q2_METEOROIDStr',
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

                            return <AddNoteComp text={text} record={record} keyPar={"q2_METEOROIDStr"} month={record?.midMonth} index={index} />;
                        },
                    },
                    {
                        title: "India",
                        dataIndex: 'q2_ShivamStr',
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

                            return <AddNoteComp text={text} record={record} keyPar={"q2_ShivamStr"} month={record?.midMonth} index={index} />;
                        },

                    },
                    {
                        title: "Nova",
                        dataIndex: 'q2_NOVAStr',
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

                            return <AddNoteComp text={text} record={record} keyPar={"q2_NOVAStr"} month={record?.midMonth} index={index} />;
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
                        title: "Total",
                        dataIndex: 'q3Str',
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

                            return <AddNoteComp text={text} record={record} keyPar={"q3Str"} month={record?.endMonth} index={index} />;
                        },

                    },
                    {
                        title: "NASA",
                        dataIndex: 'q3_NASAStr',
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

                            return <AddNoteComp text={text} record={record} keyPar={"q3_NASAStr"} month={record?.endMonth} index={index} />;
                        },
                    },
                    {
                        title: "Phenix",
                        dataIndex: 'q3_PhoenixStr',
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

                            return <AddNoteComp text={text} record={record} keyPar={"q3_PhoenixStr"} month={record?.endMonth} index={index} />;
                        },
                    },
                    {
                        title: "Meteroid",
                        dataIndex: 'q3_METEOROIDStr',
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

                            return <AddNoteComp text={text} record={record} keyPar={"q3_METEOROIDStr"} month={record?.endMonth} index={index} />;
                        },
                    },
                    {
                        title: "India",
                        dataIndex: 'q3_ShivamStr',
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

                            return <AddNoteComp text={text} record={record} keyPar={"q3_ShivamStr"} month={record?.endMonth} index={index} />;
                        },
                    },
                    {
                        title: "Nova",
                        dataIndex: 'q3_NOVAStr',
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

                            return <AddNoteComp text={text} record={record} keyPar={"q3_NOVAStr"} month={record?.endMonth} index={index} />;
                        },
                    },
                ],
            },

             // MONTH 4
            {
                title: fourthMonth,
                className: "purple-total-header",
                onHeaderCell: () => ({
                    className: "blue-total-header",
                }),
                children: [
                    {
                        title: "Total",
                        dataIndex: 'q4Str',
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

                            return <AddNoteComp text={text} record={record} keyPar={"q4Str"} month={record?.endMonth} index={index} />;
                        },

                    },
                    {
                        title: "NASA",
                        dataIndex: 'q4_NASAStr',
                        key: "m4_w1",
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

                            return <AddNoteComp text={text} record={record} keyPar={"q4_NASAStr"} month={record?.endMonth} index={index} />;
                        },
                    },
                    {
                        title: "Phenix",
                        dataIndex: 'q4_PhoenixStr',
                        key: "m4_w2",
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

                            return <AddNoteComp text={text} record={record} keyPar={"q4_PhoenixStr"} month={record?.endMonth} index={index} />;
                        },
                    },
                    {
                        title: "Meteroid",
                        dataIndex: 'q4_METEOROIDStr',
                        key: "m4_w3",
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

                            return <AddNoteComp text={text} record={record} keyPar={"q4_METEOROIDStr"} month={record?.endMonth} index={index} />;
                        },
                    },
                    {
                        title: "India",
                        dataIndex: 'q4_ShivamStr',
                        key: "m4_w4",
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

                            return <AddNoteComp text={text} record={record} keyPar={"q4_ShivamStr"} month={record?.endMonth} index={index} />;
                        },
                    },
                    {
                        title: "Nova",
                        dataIndex: 'q4_NOVAStr',
                        key: "m4_w5",
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

                            return <AddNoteComp text={text} record={record} keyPar={"q4_NOVAStr"} month={record?.endMonth} index={index} />;
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
                            FTE BU  ·  QOQ Overview
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
                       
                        <div className={uplersStyle.calendarFilterSet}>
                            <div className={uplersStyle.label}>Year</div>
                            <div className={uplersStyle.calendarFilter}>
                                <CalenderSVG style={{ height: "16px", marginRight: "8px" }} />
                                <DatePicker
                                    onKeyDown={(e) => e.preventDefault()}
                                    className={uplersStyle.dateFilter}
                                    placeholderText="Year"
                                    selected={monthDate}
                                    onChange={(date) => setMonthDate(date)}
                                    dateFormat="yyyy"
                                    showYearPicker
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
                        dataSource={tableData.filter((item) => item.stage !== "METRIC")}
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
      
            </div>
        </div>

    )
}

export default QOQOverview