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
    const [selectedHead, setSelectedHead] = useState([]);
    const [selectedQuarters, setSelectedQuarters] = useState(["Q1", "Q2", "Q3", "Q4"]);
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

    useEffect(() => {
        getHeads();
    }, []);

    const getHeads = async () => {
        setIsLoading(true);

        let filterResult = await ReportDAO.getAllPODGroupDAO();
        setIsLoading(false);
        if (filterResult.statusCode === HTTPStatusCode.OK) {
            setPODList(filterResult && filterResult?.responseBody);

            const defaultHeads = (filterResult?.responseBody || [])
                .filter(item => hrModal === "DP" ? item.dd_value !== 5 : item.dd_value === 5)
                .map(item => String(item.dd_value));
            setSelectedHead(defaultHeads);
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

    // useEffect(() => {
    //     getHeads();

    // }, []);

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


        const cellClassName = (record, stageTitle, stageID) => {

            if (record.stage_Title === "PIPELINE REVIEW  ·  Revenue Planning") {

                if (record.stage.split("-")[0].trim() === "Opening Balance") {
                    return uplersStyle.OBRow
                }

                if (record.stage.split("-")[1].trim() === "New") {
                    return uplersStyle.heighliteCream
                }

            }
            return ""
        }

        const selectedHeadOptions = pODList?.filter((item) => selectedHead?.includes(String(item.dd_value))) || [];
        const headDataIndexMap = {
            NASA: "NASA",
            Phoenix: "Phoenix",
            METEOROID: "METEOROID",
            India: "Shivam",
            Shivam: "Shivam",
            NOVA: "NOVA",
            Orion: "Orion",
        };

        const getHeadDataKey = (headText) => {
            if (!headText) return headText;
            return headDataIndexMap[headText] || headText.replace(/\s+/g, "");
        };

        const parseNumber = (value) => {
            if (value === undefined || value === null || value === "") return 0;
            if (typeof value === "number") return value;
            const numeric = String(value).replace(/[^0-9.-]/g, "");
            return numeric === "" ? 0 : parseFloat(numeric);
        };

        const isPercentText = (value) => typeof value === "string" && value.includes("%");

        const formatAggregate = (value, sampleValue) => {
            if (sampleValue && typeof sampleValue === "string" && /₹/.test(sampleValue)) {
                return `₹${Math.round(value).toLocaleString("en-IN")}`;
            }
            if (isPercentText(sampleValue)) {
                return `${value}%`;
            }
            return value;
        };

        const getQuarterFTBUValue = (record, quarterPrefix) => {
            const values = selectedHeadOptions.map((head) => {
                const dataKey = getHeadDataKey(head.dd_text);
                return record?.[`${quarterPrefix}_${dataKey}Str`];
            });

            const isPercentRow = values.some(isPercentText);
            if (isPercentRow) {
                return null;
            }

            return values.reduce((sum, value) => sum + parseNumber(value), 0);
        };

      

        const createQuarterColumns = (quarterPrefix) => {
            const quarterColumns = [
                {
                    title: "Total",
                    dataIndex: `${quarterPrefix}Str`,
                    key: `${quarterPrefix}_total`,
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
                        if (isPercentText(text)) {
                            return <AddNoteComp text={text} record={record} keyPar={`${quarterPrefix}Str`} month={record?.startMonth} index={index} />;
                        }
                        const totalValue = getQuarterFTBUValue(record, quarterPrefix);
                        if (totalValue === null) {
                            return <AddNoteComp text={text} record={record} keyPar={`${quarterPrefix}Str`} month={record?.startMonth} index={index} />;
                        }
                        const formatted = formatAggregate(totalValue, text);
                        return <AddNoteComp text={formatted} record={record} keyPar={`${quarterPrefix}Str`} month={record?.startMonth} index={index} />;
                    },
                },
            ];

            selectedHeadOptions.forEach((head) => {
                const dataKey = getHeadDataKey(head.dd_text);
                quarterColumns.push({
                    title: head.dd_text,
                    dataIndex: `${quarterPrefix}_${dataKey}Str`,
                    key: `${quarterPrefix}_${dataKey}`,
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
                        return <AddNoteComp text={text} record={record} keyPar={`${quarterPrefix}_${dataKey}Str`} month={record?.startMonth} index={index} />;
                    },
                });
            });

            return quarterColumns;
        };

        const quarterConfig = {
            Q1: { prefix: "q1", title: currentMonth, headerClass: "blue-total-header" },
            Q2: { prefix: "q2", title: nextMonth, headerClass: "green-total-header" },
            Q3: { prefix: "q3", title: thirdMonth, headerClass: "purple-total-header" },
            Q4: { prefix: "q4", title: fourthMonth, headerClass: "purple-total-header" },
        };

        const getYearTotalValue = (record) => {
            const values = selectedQuarters
                .map((quarterKey) => {
                    const quarter = quarterConfig[quarterKey];
                    return quarter ? getQuarterFTBUValue(record, quarter.prefix) : null;
                })
                .filter((value) => value !== null);

            if (!values.length) {
                return null;
            }
            return values.reduce((sum, value) => sum + value, 0);
        };

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
                onCell: (record) => ({
                    className: cellClassName(record)
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
                width: 120,
                align: "center",
                fixed: "left",
                className: `black-header ${uplersStyle.QuarterlyCol}`,
                onHeaderCell: () => ({
                    className: "black-header",
                }),
                render: (text, record, index) => {
                    if (record.isSection) {
                        return {
                            props: {
                                colSpan: 0,
                            },
                        };
                    }
                    if (isPercentText(text)) {
                        return <AddNoteComp text={text} record={record} keyPar="yearlyTotalStr" month={record?.startMonth} index={index} />;
                    }
                    const totalValue = getYearTotalValue(record);
                    if (totalValue === null) {
                        return <AddNoteComp text={text} record={record} keyPar="yearlyTotalStr" month={record?.startMonth} index={index} />;
                    }
                    const formatted = formatAggregate(totalValue, text);
                    return <AddNoteComp text={formatted} record={record} keyPar="yearlyTotalStr" month={record?.startMonth} index={index} />;
                },
            },
        ];

        selectedQuarters.forEach((quarterKey) => {
            const quarter = quarterConfig[quarterKey];
            if (quarter) {
                columns.push({
                    title: quarter.title,
                    className: quarter.headerClass,
                    onHeaderCell: () => ({ className: quarter.headerClass }),
                    children: createQuarterColumns(quarter.prefix),
                });
            }
        });

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
                                const newHRModal = e.target.value;
                                setHRModal(newHRModal);
                                const allowedHeads = (pODList || []).filter(item =>
                                    newHRModal === "DP" ? item.dd_value !== 5 : item.dd_value === 5
                                ).map(item => String(item.dd_value));
                                setSelectedHead(allowedHeads);
                            }}
                            value={hrModal}
                        >
                            <Radio value={"DP"}>FTE</Radio>
                            {/* <Radio value={"Contract"}>Contract</Radio> */}
                        </Radio.Group>
                        <Select
                            placeholder="Select Head"
                            style={{ width: 220, marginLeft: 16, marginRight: 16 }}
                            mode="multiple"
                            value={selectedHead}
                            showSearch
                            onChange={(value) => setSelectedHead(value || [])}
                            options={(pODList || []).map((v) => ({
                                label: v.dd_text,
                                value: String(v.dd_value),
                            })).filter(item => {
                                if (hrModal === "DP") {
                                    return item.value !== "5";
                                }
                                return item.value === "5";
                            })}
                            optionFilterProp="label"
                        />
                        <Select
                            placeholder="Select Quarter"
                            style={{ width: 220, marginRight: 16 }}
                            mode="multiple"
                            value={selectedQuarters}
                            onChange={(value) => setSelectedQuarters(value || [])}
                            options={[
                                { label: "Jan-Mar (Q1)", value: "Q1" },
                                { label: "Apr-Jun (Q2)", value: "Q2" },
                                { label: "Jul-Sep (Q3)", value: "Q3" },
                                { label: "Oct-Dec (Q4)", value: "Q4" },
                            ]}
                        />

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

                            if (record.stage_Title === "PIPELINE REVIEW  ·  Revenue Planning") {
                                let type = record.stage.split("-")[1].trim()


                                if (record.stage.split("-")[0].trim() === "Opening Balance") {
                                    return uplersStyle.OBRow
                                }
                                if (type === "New") {
                                    return uplersStyle.heighliteCream;
                                }

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