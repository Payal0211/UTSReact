import React, { useState, useEffect } from "react";
import uplersStyle from "./uplersReport.module.css";
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
} from "antd";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import Diamond from "assets/svg/diamond.svg";
import { ReportDAO } from "core/report/reportDAO";
import { HTTPStatusCode } from "constants/network";
import { useNavigate } from "react-router-dom";
import UTSRoutes from "constants/routes";
import DatePicker from "react-datepicker";
import moment from "moment";
import { All_Hiring_Request_Utils } from "shared/utils/all_hiring_request_util";
import { size } from "lodash";

const { Title, Text } = Typography;

export default function UplersReport() {
  const navigate = useNavigate();
  const [selectedHead, setSelectedHead] = useState("");
  const [pODList, setPODList] = useState([]);
  const [pODUsersList, setPODUsersList] = useState([]);
  const [podDashboardList, setPODDashboardList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);

  const [showAchievedReport, setShowAchievedReport] = useState(false);
  const [listAchievedData, setListAchievedData] = useState([]);
  const [achievedLoading, setAchievedLoading] = useState(false);
  const [showTalentCol, setShowTalentCol] = useState({});
  const [achievedTotal, setAchievedTotal] = useState("");
  const [hrModal,setHRModal]=useState('DP')

  const [monthDate, setMonthDate] = useState(new Date());
  const selectedYear = monthDate.getFullYear();

  const getHeads = async () => {
    setIsLoading(true);

    let filterResult = await ReportDAO.getAllPODGroupDAO();
    setIsLoading(false);
    if (filterResult.statusCode === HTTPStatusCode.OK) {
      setPODList(filterResult && filterResult?.responseBody);
      getGroupUsers(filterResult?.responseBody[0]?.dd_value);
      setSelectedHead(filterResult?.responseBody[0]?.dd_value);
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

  const getGroupUsers = async (ID) => {
    setIsLoading(true);

    let filterResult = await ReportDAO.getAllPODGroupUsersDAO(ID);
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

  const convertDataSource = (data) => {
    const list = [];

    data.forEach((item, index) => {
      switch (item.poD_ID) {
        case 0: {
          list.push({
            key: `cat${index}`,
            stage: item.stage,
            isCategory: true,
            ...item,
          });
          break;
        }
        case 10: {
          list.push({
            ...item,
            key: `row${index}`,
            stage: item.stage,
            isPipelineRow: true,
          });

          list.push({ key: `spacer1${index}`, stage: "", isSpacer: true });
          break;
        }
        default: {
          list.push({
            ...item,
            key: `row${index}`,
            stage: item.stage,
          });
        }
      }
    });

    return list;
  };

  const getDashboardList = async () => {
    let pl = {
      hrmodel: hrModal,
      pod_id: selectedHead,
      month: moment(monthDate).format("MM"),
      year: selectedYear,
    };
    setIsTableLoading(true);

    let filterResult = await ReportDAO.getAllPOCDashboardDAO(pl);
    setIsTableLoading(false);
    if (filterResult.statusCode === HTTPStatusCode.OK) {
      setPODDashboardList(
        filterResult && convertDataSource(filterResult?.responseBody)
      );
    } else {
      setPODDashboardList([]);
      return "NO DATA FOUND";
    }
  };

  useEffect(() => {
    if (selectedHead) {
      getDashboardList();
    }
  }, [selectedHead, monthDate,hrModal]);

  console.log("selectedHead", selectedHead, pODUsersList);
  useEffect(() => {
    getHeads();
  }, []);

  const renderCell = (
    value,
    record,
    {
      align = "right",
      isCurrency = false,
      isPercent = false,
      isPotential = false,
      isYellow = false,
      isItalic = false,
      isC2S = false,
    } = {}
  ) => {
    if (record.isCategory || record.isSpacer) {
      return { props: { colSpan: 0 } };
    }

    let cellStyle = {
      padding: "8px",
      margin: "-8px",
      display: "flex",
      alignItems: "center",
      justifyContent: align,
      height: "calc(100% + 16px)",
      width: "calc(100% + 16px)", // Fill cell
    };
    let content = value;

    if (isPotential && value === "-") {
      cellStyle.backgroundColor = "#BFBFBF"; // Gray background
    } else if (
      value === null ||
      value === undefined ||
      value === "" ||
      value === 0
    ) {
      content = isPotential || record.stage === "Churn" ? "" : "\u00A0";
    }

    if (isYellow)
      cellStyle = {
        ...cellStyle,
        backgroundColor: "#FFFF00",
        fontWeight: "bold",
        color: "black",
      };
    if (isItalic) cellStyle.fontStyle = "italic";

    if (isC2S && (align === "right" || align === "center")) {
      // no specific style needed unless different from regular numbers/percentages
    }

    if (typeof content === "object" && content !== null) content = "";

    return (
      <div style={cellStyle}>
        {align === "left" || align === "center" ? (
          <span style={{ paddingLeft: align === "left" ? "5px" : "0px" }}>
            {content}
          </span>
        ) : (
          content
        )}
      </div>
    );
  };

  const getHRTalentWiseReport = async (row, v, week) => {
    try {
      setShowAchievedReport(true);

      const pl = {
        pod_id: selectedHead,
        month: moment(monthDate).format("M"),
        year: moment(monthDate).format("YYYY"),
        stageID: row.stage_ID,
        cat: row.category,
        week: week ? week : "",
      };
      setShowTalentCol(row);
      setAchievedTotal(v);
      setAchievedLoading(true);
      const result = await ReportDAO.getPOCPopupReportDAO(pl);
      setAchievedLoading(false);
      if (result.statusCode === 200) {
        setListAchievedData(result.responseBody);
      } else {
        setListAchievedData([]);
      }
    } catch (err) {
      console.log(err);
      setListAchievedData([]);
    }
  };

  const getColumns = () => [
    {
      title: "Stages",
      dataIndex: "stage",
      key: "stage",
      //   fixed: "left",
      width: 200,
      className: `${uplersStyle.stagesHeaderCell} ${uplersStyle.headerCommonConfig} `,
      //   render: (text, record) => {
      //     if (record.isCategory) {
      //       return {
      //         children: (
      //           <strong
      //             style={{
      //               paddingLeft: "5px",
      //               display: "flex",
      //               alignItems: "center",
      //             }}
      //           >
      //             {text}{" "}
      //             {(record.stage === "Existing (Total)" ||
      //               record.stage === "NBD (Total)") && (
      //               <div
      //                 className={uplersStyle.showMoreNBDAMBTN}
      //                 onClick={(val, obj) => {
      //                   if (
      //                     record.stage === "Existing (Total)" ||
      //                     record.stage === "NBD (Total)"
      //                   ) {
      //                     // getNBDorAMRevenueReport(
      //                     //   record,
      //                     //   record.stage === "Existing (Total)" ? "AM" : "NBD"
      //                     // );
      //                   }
      //                 }}
      //               >
      //                 Show Details
      //               </div>
      //             )}
      //           </strong>
      //         ),
      //         props: {
      //           colSpan: 14,
      //           style: {
      //             backgroundColor: "#FFC000",
      //             fontWeight: "500",
      //             borderRight: "1px solid #d9d9d9",
      //             padding: "8px",
      //           },
      //           onclick: (val, obj) => {
      //             console.log(val, obj);
      //           },
      //         },
      //       };
      //     }
      //     if (record.isSpacer) {
      //       return {
      //         children: <div style={{ height: "10px" }}> </div>,
      //         props: {
      //           colSpan: 14,
      //           style: {
      //             padding: "0px",
      //             backgroundColor: "#ffffff",
      //             border: "none",
      //           },
      //         },
      //       };
      //     }

      //     let cellStyle = {
      //       padding: "8px",
      //       margin: "-8px -8px",
      //       display: "flex",
      //       alignItems: "center",
      //       height: "calc(100% + 16px)",
      //       width: "calc(100% + 16px)",
      //     };
      //     let content = text || "\u00A0";

      //     if (record.stage === "Closures")
      //       cellStyle = {
      //         ...cellStyle,
      //         backgroundColor: "#70AD47",
      //         color: "white",
      //         fontWeight: "bold",
      //       };
      //     else if (record.stage === "Current Active")
      //       cellStyle = {
      //         ...cellStyle,
      //         backgroundColor: "#9ec7e6",
      //         color: "white",
      //         fontWeight: "bold",
      //       };
      //     else if (record.stage === "Current Month Lost")
      //       cellStyle = {
      //         ...cellStyle,
      //         backgroundColor: "#ED7D31",
      //         color: "white",
      //         fontWeight: "bold",
      //       };
      //     else if (record.stage === "Churn")
      //       cellStyle = {
      //         ...cellStyle,
      //         backgroundColor: "#ED7D31",
      //         color: "white",
      //         fontWeight: "bold",
      //       };
      //     else if (record.stage === "C2H" || record.stage === "C2S%")
      //       cellStyle = {
      //         ...cellStyle,
      //         backgroundColor: "#595959",
      //         color: "white",
      //         fontWeight: "bold",
      //       };
      //     else if (text === "Goal")
      //       cellStyle = {
      //         ...cellStyle,
      //         backgroundColor: "#FFFF00",
      //         fontWeight: "bold",
      //         color: "black",
      //       };

      //     if (record.key === "inbound_desc" && text === "") {
      //       return <div style={cellStyle}> </div>;
      //     }

      //     return (
      //       <div style={cellStyle}>
      //         <span style={{ paddingLeft: "5px" }}>{content}</span>
      //       </div>
      //     );
      //   },
    },
    {
      title: <div style={{ textAlign: "center" }}>Goal</div>,
      dataIndex: "goalStr",
      key: "goalStr",
      align: "right",
      width: 120,
      onHeaderCell: () => ({
        className: uplersStyle.headerCommonGoalHeaderConfig,
      }),
      className: `${uplersStyle.headerCommonConfig} `,
      render: (v, rec) => {
        return v ? (
          rec.stage === "Goal" ? (
            v
          ) : (
            <span
            // onClick={() => getHRTalentWiseReport(rec, v)}
            // style={{ cursor: "pointer", color: "#1890ff" }}
            >
              {v}
            </span>
          )
        ) : (
          ""
        );
      },
    },
    {
      title: <div style={{ textAlign: "center" }}>Goal till date</div>,
      dataIndex: "goalTillDateStr",
      key: "goalTillDateStr",
      width: 120,
      align: "right",
      onHeaderCell: () => ({
        className: uplersStyle.headerCommonGoalHeaderConfig,
      }),
      className: `${uplersStyle.headerCommonConfig}`,
      render: (v, rec) => {
        return v ? (
          rec.stage === "Goal" || rec.stage.includes("%") ? (
            v
          ) : (
            <span
            // onClick={() => getHRTalentWiseReport(rec,  v)}
            // style={{ cursor: "pointer", color: "#1890ff" }}
            >
              {v}
            </span>
          )
        ) : (
          ""
        );
      },
    },
    {
      title: <div style={{ textAlign: "center" }}>Achieved</div>,
      dataIndex: "achievedStr",
      key: "achievedStr",
      width: 120,
      align: "right",
      onHeaderCell: () => ({
        className: uplersStyle.headerCommonGoalHeaderConfig,
      }),
      className: `${uplersStyle.headerCommonConfig}`,
      render: (v, rec) => {
        return v ? (
          rec.stage === "Goal" || rec.stage.includes("%") ? (
            v
          ) : (
            <span
              onClick={() => getHRTalentWiseReport(rec, v)}
              style={{ cursor: "pointer", color: "#1890ff" }}
            >
              {v}
            </span>
          )
        ) : (
          ""
        );
      },
    },
    {
      title: <div style={{ textAlign: "center" }}>Achieved %</div>,
      dataIndex: "achievedPerStr",
      key: "achievedPerStr",
      width: 120,
      align: "right",
      onHeaderCell: () => ({
        className: uplersStyle.headerCommonGoalHeaderConfig,
      }),
      className: `${uplersStyle.headerCommonConfig}`,
      render: (v, rec) => {
        return v ? (
          rec.stage === "Goal" || rec.stage.includes("%") ? (
            v
          ) : (
            <span
            // onClick={() => getHRTalentWiseReport(rec,  v)}
            // style={{ cursor: "pointer", color: "#1890ff" }}
            >
              {v}
            </span>
          )
        ) : (
          ""
        );
      },
    },
    {
      title: <div style={{ textAlign: "center" }}>W1</div>,
      dataIndex: "w1Str",
      key: "w1Str",
      width: 120,
      align: "right",
      onHeaderCell: () => ({
        className: uplersStyle.headerCommonGoalHeaderConfig,
      }),
      className: `${uplersStyle.headerCommonConfig}`,
      render: (v, rec) => {
        return v ? (
          rec.stage === "Goal" || rec.stage.includes("%") ? (
            v
          ) : (
            <span
              onClick={() => getHRTalentWiseReport(rec, v, "W1")}
              style={{ cursor: "pointer", color: "#1890ff" }}
            >
              {v}
            </span>
          )
        ) : (
          ""
        );
      },
    },
    {
      title: <div style={{ textAlign: "center" }}>W2</div>,
      dataIndex: "w2Str",
      key: "w2Str",
      width: 120,
      align: "right",
      onHeaderCell: () => ({
        className: uplersStyle.headerCommonGoalHeaderConfig,
      }),
      className: `${uplersStyle.headerCommonConfig}`,
      render: (v, rec) => {
        return v ? (
          rec.stage === "Goal" || rec.stage.includes("%") ? (
            v
          ) : (
            <span
              onClick={() => getHRTalentWiseReport(rec, v, "W2")}
              style={{ cursor: "pointer", color: "#1890ff" }}
            >
              {v}
            </span>
          )
        ) : (
          ""
        );
      },
    },
    {
      title: <div style={{ textAlign: "center" }}>W3</div>,
      dataIndex: "w3Str",
      key: "w3Str",
      width: 120,
      align: "right",
      onHeaderCell: () => ({
        className: uplersStyle.headerCommonGoalHeaderConfig,
      }),
      className: `${uplersStyle.headerCommonConfig}`,
      render: (v, rec) => {
        return v ? (
          rec.stage === "Goal" || rec.stage.includes("%") ? (
            v
          ) : (
            <span
              onClick={() => getHRTalentWiseReport(rec, v, "W3")}
              style={{ cursor: "pointer", color: "#1890ff" }}
            >
              {v}
            </span>
          )
        ) : (
          ""
        );
      },
    },
    {
      title: <div style={{ textAlign: "center" }}>W4</div>,
      dataIndex: "w4Str",
      key: "w4Str",
      width: 120,
      align: "right",
      onHeaderCell: () => ({
        className: uplersStyle.headerCommonGoalHeaderConfig,
      }),
      className: `${uplersStyle.headerCommonConfig}`,
      render: (v, rec) => {
        return v ? (
          rec.stage === "Goal" || rec.stage.includes("%") ? (
            v
          ) : (
            <span
              onClick={() => getHRTalentWiseReport(rec, v, "W4")}
              style={{ cursor: "pointer", color: "#1890ff" }}
            >
              {v}
            </span>
          )
        ) : (
          ""
        );
      },
    },
    {
      title: <div style={{ textAlign: "center" }}>W5</div>,
      dataIndex: "w5Str",
      key: "w5Str",
      width: 120,
      align: "right",
      onHeaderCell: () => ({
        className: uplersStyle.headerCommonGoalHeaderConfig,
      }),
      className: `${uplersStyle.headerCommonConfig}`,
      render: (v, rec) => {
        return v ? (
          rec.stage === "Goal" || rec.stage.includes("%") ? (
            v
          ) : (
            <span
              onClick={() => getHRTalentWiseReport(rec, v, "W5")}
              style={{ cursor: "pointer", color: "#1890ff" }}
            >
              {v}
            </span>
          )
        ) : (
          ""
        );
      },
    },

    //  {
    //   title: "GTD",
    //   dataIndex: 'gtdStr',
    //   key: "gtdStr",
    //   width: 110,
    //   align: "center",
    //   onHeaderCell: () => ({
    //     className: uplersStyle.headerCommonGoalHeaderConfig,
    //   }),
    //   className: `${uplersStyle.headerCommonConfig}`,
    //   render: (v, rec) =>{
    //             return v ? <span
    //             onClick={() => getHRTalentWiseReport(rec,  v)}
    //             style={{ cursor: "pointer", color: "#1890ff" }}
    //           >
    //             {v}
    //           </span> : ''
    //           }
    // },
    //  {
    //   title: "ATD",
    //   dataIndex: 'atdStr',
    //   key: "atdStr",
    //   width: 110,
    //   align: "center",
    //   onHeaderCell: () => ({
    //     className: uplersStyle.headerCommonGoalHeaderConfig,
    //   }),
    //   className: `${uplersStyle.headerCommonConfig}`,
    //   render: (v, rec) =>{
    //             return v ? <span
    //             onClick={() => getHRTalentWiseReport(rec,  v)}
    //             style={{ cursor: "pointer", color: "#1890ff" }}
    //           >
    //             {v}
    //           </span> : ''
    //           }
    // },
    //  {
    //   title: "ATD %",
    //   dataIndex: 'atdPerStr',
    //   key: "atdPerStr",
    //   width: 110,
    //   align: "center",
    //   onHeaderCell: () => ({
    //     className: uplersStyle.headerCommonGoalHeaderConfig,
    //   }),
    //   className: `${uplersStyle.headerCommonConfig}`,
    //   render: (v, rec) =>{
    //             return v ? <span
    //             onClick={() => getHRTalentWiseReport(rec,  v)}
    //             style={{ cursor: "pointer", color: "#1890ff" }}
    //           >
    //             {v}
    //           </span> : ''
    //           }
    // },
  ];
  return (
    <div className={uplersStyle.hiringRequestContainer}>
      <div className={uplersStyle.filterContainer}>
        <div className={uplersStyle.filterSets}>
          <div className={uplersStyle.filterSetsInner}>
            <Title level={3} style={{ margin: 0 }}>
              {`${monthDate?.toLocaleString("default", {
                month: "long",
              })} ${selectedYear} - POD Dashboard`}
            </Title>
          </div>
          <div className={uplersStyle.filterRight}>

             <Radio.Group
                          onChange={(e) => {
 
                            setHRModal( e.target.value)
                            if(e.target.value==="Contract"){
                              let val = pODList.find(i=>i.dd_text=== "Orion")?.dd_value                                 
                               setSelectedHead(val);
                               getGroupUsers(val);
                            }
                           
                            //  setEngagementType(e.target.value);
                          }}
                          value={hrModal}
                        >
                          <Radio value={"DP"}>FTE</Radio>
                          <Radio value={"Contract"}>Contract</Radio>
                          
                        </Radio.Group>
            <Select
              id="selectedValue"
              placeholder="Select Head"
              style={{ marginLeft: "10px", width: "270px" }}
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
              }))}
              optionFilterProp="label"
            />
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
        <div style={{ display: "flex" }}>
          <div className={uplersStyle.chipCardContainer}>
            {isLoading ? (
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <Spin />
              </div>
            ) : (
              pODUsersList?.map((item, index) => {
                if (item.leadtype === "leaduser") {
                  return (
                    <div className={uplersStyle.chipCard}>
                      <Avatar size={"small"}>
                        {item.dd_text[0].toUpperCase()}
                      </Avatar>{" "}
                      <strong>{item.dd_text}</strong>{" "}
                    </div>
                  );
                } else {
                  return (
                    <div className={uplersStyle.chipCard}>
                      <Avatar size={"small"}>
                        {item.dd_text[0].toUpperCase()}
                      </Avatar>{" "}
                      {item.dd_text}
                    </div>
                  );
                }
              })
            )}
          </div>

          <Card
            size="small"
            style={{
              width: "240px",
              height: "50px",
              marginRight: "10px",
              marginBottom: "10px",
            }}
          >
            <Text>
              No. of working days:{" "}
              <strong>{podDashboardList[0]?.workingDaysTillNow}</strong>
            </Text>
          </Card>
        </div>
      </div>

      <div className={uplersStyle.filterContainer} style={{ padding: "12px" }}>
        <div className={uplersStyle.customTableContainer}>
          {isTableLoading ? (
            <TableSkeleton />
          ) : (
            <>
              <p
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  padding: "20px 20px 0",
                }}
              >
                All
              </p>
              <Table
                columns={getColumns()}
                dataSource={podDashboardList.filter(
                  (item) => item.category === "All"
                )}
                bordered
                pagination={false}
                size="middle"
                scroll={{ x: "max-content", y: "1vh" }}
                rowClassName={(record) =>
                  record.stage === "Goal" ? uplersStyle.heighliteRow : ""
                }
              />
            </>
          )}
        </div>
      </div>

      <div className={uplersStyle.filterContainer} style={{ padding: "12px" }}>
        <div className={uplersStyle.customTableContainer}>
          {isTableLoading ? (
            <TableSkeleton />
          ) : (
            <>
              <p
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  padding: "20px 20px 0",
                }}
              >
                New Business
              </p>
              <Table
                columns={getColumns()}
                dataSource={podDashboardList.filter(
                  (item) => item.category === "New"
                )}
                bordered
                pagination={false}
                size="middle"
                scroll={{ x: "max-content", y: "1vh" }}
                rowClassName={(record) =>
                  record.stage === "Goal" ? uplersStyle.heighliteRow : ""
                }
              />
            </>
          )}
        </div>
      </div>

      <div className={uplersStyle.filterContainer} style={{ padding: "12px" }}>
        <div className={uplersStyle.customTableContainer}>
          {isTableLoading ? (
            <TableSkeleton />
          ) : (
            <>
              <p
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  padding: "20px 20px 0",
                }}
              >
                Existing Business
              </p>
              <Table
                columns={getColumns()}
                dataSource={podDashboardList.filter(
                  (item) => item.category === "Existing"
                )}
                bordered
                pagination={false}
                size="middle"
                scroll={{ x: "max-content", y: "1vh" }}
                rowClassName={(record) =>
                  record.stage === "Goal" ? uplersStyle.heighliteRow : ""
                }
              />
            </>
          )}
        </div>
      </div>

      <div className={uplersStyle.filterContainer} style={{ padding: "12px" }}>
        <div className={uplersStyle.customTableContainer}>
          {isTableLoading ? (
            <TableSkeleton />
          ) : (
            <>
              <p
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  padding: "20px 20px 0",
                }}
              >
                Customer Growth
              </p>
              <Table
                columns={getColumns()}
                dataSource={podDashboardList.filter(
                  (item) => item.category === "CF"
                )}
                bordered
                pagination={false}
                size="middle"
                scroll={{ x: "max-content", y: "1vh" }}
                rowClassName={(record) =>
                  record.stage === "Goal" ? uplersStyle.heighliteRow : ""
                }
              />
            </>
          )}
        </div>
      </div>

          <div className={uplersStyle.filterContainer} style={{ padding: "12px" }}>
        <div className={uplersStyle.customTableContainer}>
          {isTableLoading ? (
            <TableSkeleton />
          ) : (
            <>
              <p
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  padding: "20px 20px 0",
                }}
              >
               Customer Health
              </p>
              <Table
                columns={getColumns()}
                dataSource={podDashboardList.filter(
                  (item) => item.category === "CH"
                )}
                bordered
                pagination={false}
                size="middle"
                scroll={{ x: "max-content", y: "1vh" }}
                rowClassName={(record) =>
                  record.stage === "Goal" ? uplersStyle.heighliteRow : ""
                }
              />
            </>
          )}
        </div>
      </div>

      <div className={uplersStyle.filterContainer} style={{ padding: "12px" }}>
        <div className={uplersStyle.customTableContainer}>
          {isTableLoading ? (
            <TableSkeleton />
          ) : (
            <>
              <p
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  padding: "20px 20px 0",
                }}
              >
               Delivery Funnel
              </p>
              <Table
                columns={getColumns()}
                dataSource={podDashboardList.filter(
                  (item) => item.category === "DF"
                )}
                bordered
                pagination={false}
                size="middle"
                scroll={{ x: "max-content", y: "1vh" }}
                rowClassName={(record) =>
                  record.stage === "Goal" ? uplersStyle.heighliteRow : ""
                }
              />
            </>
          )}
        </div>
      </div>

  

      {showAchievedReport && (
        <Modal
          width="1200px"
          centered
          footer={null}
          open={showAchievedReport}
          className="engagementModalStyle"
          onCancel={() => {
            setShowAchievedReport(false);
          }}
        >
          <div style={{ padding: "20px 15px" }}>
            <h3>
              <b>{showTalentCol?.stage}</b> <b> : {achievedTotal}</b>
            </h3>
          </div>
{console.log("TC",showTalentCol , (showTalentCol?.category !== 'CF' && showTalentCol?.category !== 'CH'))}
          {achievedLoading ? (
            <TableSkeleton />
          ) : listAchievedData.length > 0 ? (
            <>
              <div
                style={{
                  padding: "0 20px 20px 20px",
                  overflowX: "auto",
                  maxHeight: "500px",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 14,
                    textAlign: "left",
                  }}
                >
                  <thead
                    className={uplersStyle.overwriteTableColor}
                    style={{ position: "sticky", top: "0" }}
                  >
                    <tr style={{ backgroundColor: "#f0f0f0" }}>
                      <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          background: "rgb(233, 233, 233) !important",
                        }}
                      >
                        {showTalentCol?.stage === "New Clients"
                          ? "Created Date"
                          : "HR Created Date"}
                      </th>

                     {(showTalentCol?.category !== 'CF' && showTalentCol?.category !== 'CH') &&  <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          background: "rgb(233, 233, 233) !important",
                        }}
                      >
                        Action Date
                      </th>} 

                      <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          backgroundColor: "rgb(233, 233, 233) !important",
                        }}
                      >
                        Company
                      </th>
                      {(showTalentCol?.category !== 'CF' && showTalentCol?.category !== 'CH') && (
                        <>
                          <th
                            style={{
                              padding: "10px",
                              border: "1px solid #ddd",
                              backgroundColor: "rgb(233, 233, 233) !important",
                            }}
                          >
                            HR Number
                          </th>
                          <th
                            style={{
                              padding: "10px",
                              border: "1px solid #ddd",
                              backgroundColor: "rgb(233, 233, 233) !important",
                            }}
                          >
                            HR Title
                          </th>
                          <th
                            style={{
                              padding: "10px",
                              border: "1px solid #ddd",
                              backgroundColor: "rgb(233, 233, 233) !important",
                            }}
                          >
                            TR / Talent
                          </th>
                          {showTalentCol?.isTalentShow === 1 && (
                            <th
                              style={{
                                padding: "10px",
                                border: "1px solid #ddd",
                                backgroundColor:
                                  "rgb(233, 233, 233) !important",
                              }}
                            >
                              TR / Talent
                            </th>
                          )}
                          <th
                            style={{
                              padding: "10px",
                              border: "1px solid #ddd",
                              backgroundColor: "rgb(233, 233, 233) !important",
                            }}
                          >
                            HR Pipeline
                          </th>
                        </>
                      )}

                      <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          backgroundColor: "rgb(233, 233, 233) !important",
                        }}
                      >
                        Sales Person
                      </th>
                      {showTalentCol?.stage === "HRs (Carry Fwd)" && (
                        <th
                          style={{
                            padding: "10px",
                            border: "1px solid #ddd",
                            backgroundColor: "rgb(233, 233, 233) !important",
                          }}
                        >
                          Carry Fwd Status
                        </th>
                      )}

                      <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          backgroundColor: "rgb(233, 233, 233) !important",
                        }}
                      >
                        Client Business Type
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          backgroundColor: "rgb(233, 233, 233) !important",
                        }}
                      >
                        Lead Type
                      </th>
                      {(showTalentCol?.category !== 'CF' && showTalentCol?.category !== 'CH') && (
                        <th
                          style={{
                            padding: "10px",
                            border: "1px solid #ddd",
                            backgroundColor: "rgb(233, 233, 233) !important",
                          }}
                        >
                          HR Status
                        </th>
                      )}
                    </tr>
                  </thead>

                  <tbody style={{ maxHeight: "500px" }}>
                    {listAchievedData.map((detail, index) => (
                      <tr
                        key={index}
                        style={{ borderBottom: "1px solid #ddd" }}
                      >
                        <td
                          style={{ padding: "8px", border: "1px solid #ddd" }}
                        >
                          {detail.hrCreatedDateStr}
                        </td>
 {(showTalentCol?.category !== 'CF' && showTalentCol?.category !== 'CH') &&  <td
                          style={{ padding: "8px", border: "1px solid #ddd" }}
                        >
                          {detail.actionDateStr}
                        </td>}
                        

                        <td
                          style={{ padding: "8px", border: "1px solid #ddd" }}
                        >
                           <a
                                  href={`/viewCompanyDetails/${detail.company_ID}`}
                                  style={{ textDecoration: "underline" }}
                                  target="_blank"
                                  rel="noreferrer"
                                >{detail.company}{" "}</a> 
                          {detail.company_Category === "Diamond" && (
                            <img
                              src={Diamond}
                              alt="info"
                              style={{ width: "16px", height: "16px" }}
                            />
                          )}
                        </td>
                        {(showTalentCol?.category !== 'CF' && showTalentCol?.category !== 'CH')  && (
                          <>
                            <td
                              style={{
                                padding: "8px",
                                border: "1px solid #ddd",
                              }}
                            >
                              {detail.hiringRequestID > 0 ? (
                                <a
                                  href={`/allhiringrequest/${detail.hiringRequestID}`}
                                  style={{ textDecoration: "underline" }}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {detail.hR_Number}
                                </a>
                              ) : (
                                detail.hR_Number
                              )}
                            </td>
                            <td
                              style={{
                                padding: "8px",
                                border: "1px solid #ddd",
                              }}
                            >
                              {detail.hrTitle}
                            </td>
                            <td
                              style={{
                                padding: "8px",
                                border: "1px solid #ddd",
                              }}
                            >
                              {detail.tRorTalent}
                            </td>
                            {showTalentCol?.isTalentShow === 1 && (
                              <td
                                style={{
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                }}
                              >
                                {detail.talent}
                              </td>
                            )}
                            <td
                              style={{
                                padding: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "right",
                                height: "100%",
                              }}
                            >
                              {detail.hrPipelineStr}
                            </td>
                          </>
                        )}

                        <td
                          style={{ padding: "8px", border: "1px solid #ddd" }}
                        >
                          {detail.salesPerson}
                        </td>
                        {showTalentCol?.stage === "HRs (Carry Fwd)" && (
                          <td
                            style={{ padding: "8px", border: "1px solid #ddd" }}
                          >
                            {All_Hiring_Request_Utils.GETHRSTATUS(
                              Number(detail.carryFwd_HRStatusCode),
                              detail.carryFwd_HRStatus
                            )}
                          </td>
                        )}

                        <td
                          style={{ padding: "8px", border: "1px solid #ddd" }}
                        >
                          {detail.clientBusinessType}
                        </td>
                        <td
                          style={{ padding: "8px", border: "1px solid #ddd" }}
                        >
                          {detail.lead_Type}
                        </td>
                        {(showTalentCol?.category !== 'CF' && showTalentCol?.category !== 'CH') && (
                          <td
                            style={{ padding: "8px", border: "1px solid #ddd" }}
                          >
                            {All_Hiring_Request_Utils.GETHRSTATUS(
                              Number(detail.hrStatusCode),
                              detail.hrStatus
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div
              style={{
                padding: "10px",
                display: "flex",
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: 500,
              }}
            >
              <p>No details available.</p>
            </div>
          )}

          <div style={{ padding: "10px", textAlign: "right" }}>
            <button
              className={uplersStyle.btnCancle}
              onClick={() => {
                setShowAchievedReport(false);
              }}
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
