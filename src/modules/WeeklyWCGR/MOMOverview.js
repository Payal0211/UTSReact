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
import * as XLSX from "xlsx";

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
    const [selectedHead, setSelectedHead] = useState([]);
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

    useEffect(() => {
        getHeads();

    }, []);


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
        getMOMReportData();
    }, [monthDate]);


    const AddNoteComp = ({ text, record, keyPar, month, index }) => {
        const isPastMonth = month < moment().format("M");
        const currentMonth = parseInt(moment().format("M"), 10);
        const selectedMonth = parseInt(month, 10);

        const weekMatch = keyPar.match(/W(\d+)/);
        const selectedWeek = weekMatch ? parseInt(weekMatch[1], 10) : null;
        const currentWeekOfMonth = moment().diff(moment().startOf("month"), "weeks") + 1;
        const isPastOrCurrentWeek = selectedMonth === currentMonth && selectedWeek !== null && selectedWeek <= currentWeekOfMonth;

        if(record.stage_Title === "TOP CLIENTS  ·  Pipeline & Joining Snapshot"){
            let [company , value] = text.split("-")
            return  text? <div>{company} - <strong>{value}</strong></div> : ""
        }

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
        const currentMonth = headerDataCol?.startMonth_Name;
        const nextMonth = headerDataCol?.midMonth_Name;
        const thirdMonth = headerDataCol?.endMonth_Name;

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

        const formatAggregate = (value, sampleValue) => {
            if (sampleValue && typeof sampleValue === "string" && /₹/.test(sampleValue)) {
                return `₹${Math.round(value).toLocaleString("en-IN")}`;
            }
            if (sampleValue && typeof sampleValue === "string" && /%/.test(sampleValue)) {
                return `${value}%`;
            }
            return value;
        };

        const isSkipTotalStage = (record) => {
            return record?.stage_Title === "TOP CLIENTS  ·  Pipeline & Joining Snapshot";
        };

        const getMonthFTBUValue = (record, monthPrefix) => {
            if (isSkipTotalStage(record)) {
                return null;
            }

            const values = selectedHeadOptions.map((head) => {
                const dataKey = getHeadDataKey(head.dd_text);
                return record?.[`${monthPrefix}_${dataKey}`];
            });

            const isPercentRow = values.some(
                (value) => typeof value === "string" && value.includes("%")
            );

            if (isPercentRow) {
                return null;
            }

            return values.reduce((sum, value) => sum + parseNumber(value), 0);
        };

        const getQuarterlyFTBUValue = (record) => {
            if (isSkipTotalStage(record)) {
                return null;
            }
            const monthlyValues = ["startMonth", "midMonth", "endMonth"].map((monthPrefix) => getMonthFTBUValue(record, monthPrefix));
            if (monthlyValues.some((value) => value === null)) {
                return null;
            }
            return monthlyValues.reduce((sum, value) => sum + value, 0);
        };

        const createMonthColumns = (monthPrefix) => {
            const monthCols = [
                {
                    title: "FT BU",
                    dataIndex: `${monthPrefix}_MonthlyTotalStr`,
                    key: `${monthPrefix}_total`,
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
                    return text
                        // const totalValue = getMonthFTBUValue(record, monthPrefix);
                        // if (totalValue === null) {
                        //     return <AddNoteComp text={text} record={record} keyPar={`${monthPrefix}_MonthlyTotalStr`} month={record?.[monthPrefix]} index={index} />;
                        // }
                        // const formatted = formatAggregate(totalValue, text);
                        // return <AddNoteComp text={formatted} record={record} keyPar={`${monthPrefix}_MonthlyTotalStr`} month={record?.[monthPrefix]} index={index} />;
                    },
                },
            ];

            selectedHeadOptions.forEach((head) => {
                const dataKey = getHeadDataKey(head.dd_text);
                monthCols.push({
                    title: head.dd_text,
                    dataIndex: `${monthPrefix}_${dataKey}`,
                    key: `${monthPrefix}_${dataKey}`,
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

                        return <AddNoteComp text={text} record={record} keyPar={`${monthPrefix}_${dataKey}`} month={record?.[monthPrefix]} index={index} />;
                    },
                });
            });
            return monthCols;
        };

        const cellClassName = (record, stageTitle, stageID) => {

            if (record.stage_Title === "PIPELINE REVIEW  ·  Revenue Planning") {

                if (record.stage.split("-")[0].trim() === "Opening Balance") {
                    return uplersStyle.OBRow
                }

                if (record.stage.split("-")[1].trim() === "New") {
                    return uplersStyle.heighliteCream
                }

            }

            if (record.stage === "Joining Achieved" || record.stage === 'Selection Achieved' || record.stage === "Net Joining Achieved" || record.stage === "Net Selection Achieved") {
              return `${uplersStyle.heighliteGreen} ${uplersStyle.boldRow}`;
            }

            if (record.stage === "Post Joining Backout" || record.stage === 'Dropout' || record.stage === "Back-out") {
                return uplersStyle.heighliteRed;
            }
            return ""
        }

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
return text
                    // const totalValue = getQuarterlyFTBUValue(record);
                    // if (totalValue === null) {
                    //     return text;
                    // }
                    // const formatted = formatAggregate(totalValue, text);
                    // return formatted;
                },
            },

            // MONTH 1
            {
                title: currentMonth,
                className: "blue-total-header",
                onHeaderCell: () => ({
                    className: "blue-total-header",
                }),
                children: createMonthColumns('startMonth'),
            },

            // MONTH 2
            {
                title: nextMonth,
                className: "green-total-header",
                onHeaderCell: () => ({
                    className: "blue-total-header",
                }),
                children: createMonthColumns('midMonth'),
            },

            // MONTH 3
            {
                title: thirdMonth,
                className: "purple-total-header",
                onHeaderCell: () => ({
                    className: "blue-total-header",
                }),
                children: createMonthColumns('endMonth'),
            },
        ];

        columnCount = countLeafColumns(columns);
        return columns;
    };

       const exportData = () => {
        const columns = getTableColumns();
    
        // Flatten columns
        const flatColumns = [];
    
        columns.forEach((col) => {
            if (col.children?.length) {
                col.children.forEach((child) => {
                    flatColumns.push({
                        parent: col.title,
                        title: child.title,
                        dataIndex: child.dataIndex,
                    });
                });
            } else {
                flatColumns.push({
                    parent: "",
                    title: col.title,
                    dataIndex: col.dataIndex,
                });
            }
        });
    
        const headerRow1 = [];
        const headerRow2 = [];
        const merges = [];
    
        let c = 0;
    
        while (c < flatColumns.length) {
            const column = flatColumns[c];
    
            // Normal column (Metric, Year Total)
            if (!column.parent) {
                headerRow1.push(column.title);
                headerRow2.push("");
    
                merges.push({
                    s: { r: 0, c },
                    e: { r: 1, c },
                });
    
                c++;
                continue;
            }
    
            // Grouped column (Quarter)
            const parent = column.parent;
            const start = c;
    
            while (
                c < flatColumns.length &&
                flatColumns[c].parent === parent
            ) {
                headerRow2.push(flatColumns[c].title);
                c++;
            }
    
            const span = c - start;
    
            headerRow1.push(parent);
    
            for (let i = 1; i < span; i++) {
                headerRow1.push("");
            }
    
            merges.push({
                s: { r: 0, c: start },
                e: { r: 0, c: c - 1 },
            });
        }
    
        const excelData = [headerRow1, headerRow2];
    
        tableData
            .filter((row) => row.stage !== "METRIC")
            .forEach((row) => {
                if (row.isSection) {
                    excelData.push([row.sectionTitle]);
    
                    merges.push({
                        s: {
                            r: excelData.length - 1,
                            c: 0,
                        },
                        e: {
                            r: excelData.length - 1,
                            c: flatColumns.length - 1,
                        },
                    });
    
                    return;
                }
    
                excelData.push(
                    flatColumns.map((column) => row[column.dataIndex] ?? "")
                );
            });
    
        const ws = XLSX.utils.aoa_to_sheet(excelData);
    
        ws["!merges"] = merges;
    
        // Optional column widths
        ws["!cols"] = flatColumns.map((col, i) => ({
            wch: i === 0 ? 35 : 18,
        }));
    
        const wb = XLSX.utils.book_new();
    
        XLSX.utils.book_append_sheet(wb, ws, "MOM Overview");
    
        XLSX.writeFile(wb, `MOM_Overview_${selectedYear}.xlsx`);
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
                    <div className={`${uplersStyle.filterRight} ${uplersStyle.filterRightMod}`}>
                        <Radio.Group
                            onChange={(e) => {
                                const newHRModal = e.target.value;
                                setHRModal(newHRModal);
                                const allowedHeads = (pODList || []).filter(item =>
                                    newHRModal === "DP" ? item.dd_value !== 5 : item.dd_value === 5
                                ).map(item => String(item.dd_value));
                                setSelectedHead(allowedHeads);

                                //  setEngagementType(e.target.value);
                            }}
                            value={hrModal}
                        >
                            {/* <Radio value={"DP"}>FTE</Radio> */}
                            {/* <Radio value={"Contract"}>Contract</Radio> */}
                        </Radio.Group>
                        <Select
                                     id="selectedValue"
                                     placeholder="Select POD's"
                                     style={{ width: "600px" }}
                                     mode="multiple"
                                     value={selectedHead}
                                     showSearch={true}
                                     onChange={(value) => {
                                       setSelectedHead(value || []);
                                     }}
                                     options={pODList?.map((v) => ({
                                       label: v.dd_text,
                                       value: String(v.dd_value),
                                     })).filter(item => {
                                       if (hrModal === "DP") {
                                         return item.value !== "5"
                                       } else {
                                         return item.value === "5"
                                       }
                                     })}
                                     optionFilterProp="label"
                                   />
                        <div className={uplersStyle.calendarFilterSet}>
                            {/* <div className={uplersStyle.label}>Month-Year</div> */}
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

                         <button
                                      className={uplersStyle.btnPrimary}
                                      onClick={() => exportData()}
                                    >
                                      Export
                                    </button>
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
                            if (record.stage === "Joining Achieved" || record.stage === 'Selection Achieved' || record.stage === "Net Joining Achieved" || record.stage === "Net Selection Achieved") {
                               return `${uplersStyle.heighliteGreen} ${uplersStyle.boldRow}`;
                            }

                            if (record.stage === "Post Joining Backout" || record.stage === 'Dropout' || record.stage === "Back-out") {
                                return uplersStyle.heighliteRed;
                            }
                            if (record.stage_ID === "JAllG" || record.stage_ID === "JAllNetAchieved" || record.stage_ID === "SG" ||
                                record.stage_ID === "SNetAchieved" || record.stage_ID === "SJRatio" || record.stage_ID === "O2S"
                            ) {
                                return uplersStyle.boldRow;
                            }

                            if (record.stage_Title === "PIPELINE REVIEW  ·  Revenue Planning") {
                                let type = record.stage.split("-")[1].trim()

                                if (record.stage === "Total Active Pipeline - New") {
                                    return `${uplersStyle.heighliteCream} ${uplersStyle.boldRow}`
                                }
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

export default MOMOverview