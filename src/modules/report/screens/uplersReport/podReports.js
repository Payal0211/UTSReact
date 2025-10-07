import React, { useState, useEffect, Suspense } from "react";
import uplersStyle from "./uplersReport.module.css";
import {
  Table,
  Modal,
  Tooltip,
  Skeleton,
  Spin,
} from "antd";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import Diamond from "assets/svg/diamond.svg";
import { ReportDAO } from "core/report/reportDAO";
import moment from "moment";
import { All_Hiring_Request_Utils } from "shared/utils/all_hiring_request_util";
import { IoMdAddCircle } from "react-icons/io";
import { IconContext } from "react-icons";


export default function PodReports({
  impHooks
}) {
    const {isTableLoading,podDashboardList,AddComment,monthDate,hrModal,selectedHead} = impHooks
  const [showAchievedReport, setShowAchievedReport] = useState(false);
  const [listAchievedData, setListAchievedData] = useState([]);
  const [achievedLoading, setAchievedLoading] = useState(false);
  const [showTalentCol, setShowTalentCol] = useState({});
  const [achievedTotal, setAchievedTotal] = useState("");
  const [DFListData, setDFListData] = useState([]);
  const [DFFilterListData, setDFFilterListData] = useState([]);
  const [showDFReport, setShowDFReport] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const getHRTalentWiseReport = async (row, v, week) => {
    try {
      setShowAchievedReport(true);

      const pl = {
        hrmodel: hrModal,
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
        return (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
                // flexDirection:'end'
              }}
            >
              {(rec.stage === "Joining" ||
                rec.stage === "Companies CF" ||
                rec.stage === "Total Customers assigned") && (
                <IconContext.Provider
                  value={{
                    color: "green",
                    style: {
                      width: "20px",
                      height: "20px",
                      marginRight: "auto",
                      cursor: "pointer",
                    },
                  }}
                >
                  {" "}
                  <Tooltip title={`Add/View comment`} placement="top">
                    <span
                      onClick={() => {
                        AddComment(rec, "N");
                      }}
                      // className={taStyles.feedbackLabel}
                    >
                      {" "}
                      <IoMdAddCircle />
                    </span>{" "}
                  </Tooltip>
                </IconContext.Provider>
              )}

              <div style={{ marginLeft: "auto" }}>
                {v ? (
                  rec.stage === "Goal" || rec.stage.includes("%") ? (
                    v
                  ) : (
                    <span
                      onClick={() => {
                        if (rec.category === "DF") {
                          getDFDetails(rec, v);
                        } else {
                          getHRTalentWiseReport(rec, v);
                        }
                      }}
                      style={{ cursor: "pointer", color: "#1890ff" }}
                    >
                      {v}
                    </span>
                  )
                ) : (
                  ""
                )}
              </div>
            </div>
          </>
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
              onClick={() => {
                if (rec.category === "DF") {
                  getDFDetails(rec, v, "W1");
                } else {
                  getHRTalentWiseReport(rec, v, "W1");
                }
              }}
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
              onClick={() => {
                if (rec.category === "DF") {
                  getDFDetails(rec, v, "W2");
                } else {
                  getHRTalentWiseReport(rec, v, "W2");
                }
              }}
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
              onClick={() => {
                if (rec.category === "DF") {
                  getDFDetails(rec, v, "W3");
                } else {
                  getHRTalentWiseReport(rec, v, "W3");
                }
              }}
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
              onClick={() => {
                if (rec.category === "DF") {
                  getDFDetails(rec, v, "W4");
                } else {
                  getHRTalentWiseReport(rec, v, "W4");
                }
              }}
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
              onClick={() => {
                if (rec.category === "DF") {
                  getDFDetails(rec, v, "W5");
                } else {
                  getHRTalentWiseReport(rec, v, "W5");
                }
              }}
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

  const DFColumns = [
    {
      title: "Action Date",
      dataIndex: "actionDate",
      key: "actionDate",
      width: "150px",
      render: (text) => {
        return text;
      },
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
      width: "150px",
    },
    {
      title: "HR #",
      dataIndex: "hR_Number",
      key: "hR_Number",
      width: "170px",
      render: (text, value) => {
        return (
          <a
            href={`/allhiringrequest/${value.hiringRequestID}`}
            style={{ textDecoration: "underline" }}
            target="_blank"
            rel="noreferrer"
          >
            {text}
          </a>
        ); // Replace `/client/${text}` with the appropriate link you need
      },
    },
    {
      title: "HR Title",
      dataIndex: "hrTitle",
      key: "hrTitle",
    },
    {
      title: "Talent",
      dataIndex: "talent",
      key: "talent",
    },
    {
      title: "TA",
      dataIndex: "ta",
      key: "ta",
    },
    {
      title: "Sales Person",
      dataIndex: "salesperson",
      key: "salesperson",
    },
    {
      title: "Slot/Remark",
      dataIndex: "slotOrRemarkDetails",
      key: "slotOrRemarkDetails",
    },
    // {
    //   title: "Status",
    //   dataIndex: "talentStatus",
    //   key: "talentStatus",
    //   render: (_, item) => (
    //     <div
    //       style={{
    //         display: "flex",
    //         alignItems: "center",
    //         justifyContent: "space-between",
    //       }}
    //     >
    //       {All_Hiring_Request_Utils.GETTALENTSTATUS(
    //         parseInt(item?.talentStatusColor),
    //         item?.talentStatus
    //       )}

    //       {(item?.statusID === 2 || item?.statusID === 3) && (
    //         <IconContext.Provider
    //           value={{
    //             color: "#FFDA30",
    //             style: { width: "16px", height: "16px", cursor: "pointer" },
    //           }}
    //         >
    //           <Tooltip title="Move to Assessment" placement="top">
    //             <span
    //               onClick={() => {
    //                 setMoveToAssessment(true);
    //                 setTalentToMove((prev) => ({ ...prev, ctpID: item.ctpid }));
    //               }}
    //               style={{ padding: "0" }}
    //             >
    //               {" "}
    //               <BsClipboard2CheckFill />
    //             </span>{" "}
    //           </Tooltip>
    //         </IconContext.Provider>
    //       )}

    //     </div>
    //   ),
    // },
  ];

  const getDFDetails = async (row, v, week) => {
    try {
      setShowDFReport(true);

      const pl = {
        hrmodel: hrModal,
        pod_id: selectedHead,
        month: moment(monthDate).format("M"),
        year: moment(monthDate).format("YYYY"),
        optiontype: row.stage_ID,
        weekno: week ? week : "",
      };
      setShowTalentCol(row);
      setAchievedTotal(v);
      setAchievedLoading(true);
      const result = await ReportDAO.getPOCDFPopupReportDAO(pl);
      setAchievedLoading(false);
      if (result.statusCode === 200) {
        setDFListData(result.responseBody);
        setDFFilterListData(result.responseBody);
      } else {
        setDFListData([]);
        setDFFilterListData([]);
      }
    } catch (err) {
      console.log(err);
      setDFListData([]);
      setDFFilterListData([]);
    }
  };

  const handleSearchInput = (value) => {
    setSearchTerm(value);
    const filteredData = DFListData.filter(
      (talent) =>
        talent.talent.toLowerCase().includes(value.toLowerCase()) ||
        (talent.email &&
          talent.email.toLowerCase().includes(value.toLowerCase()))
    );
    setDFFilterListData(filteredData);
  };

  return (
    <>
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
                rowClassName={(record) => {
                  if (record.stage === "Goal") {
                    return uplersStyle.heighliteRow;
                  }
                  if (record.stage === "Joining") {
                    return uplersStyle.heighliteGreen;
                  }
                  if (record.stage === "Selections/Closures") {
                    return uplersStyle.heighliteOrange;
                  }
                  if (record.stage === "Lost (Pipeline)") {
                    return uplersStyle.heighliteRed;
                  }
                  if (record.stage === "Total Active Pipeline") {
                    return uplersStyle.heighlitePurple;
                  }
                  //   if (record.stage === "Not Accepted HRs") {
                  //   return uplersStyle.heighliteDarkRed;
                  // }
                }}
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
                rowClassName={(record) => {
                  if (record.stage === "Goal") {
                    return uplersStyle.heighliteRow;
                  }
                  if (record.stage === "Joining") {
                    return uplersStyle.heighliteGreen;
                  }
                  if (record.stage === "Selections/Closures") {
                    return uplersStyle.heighliteOrange;
                  }
                  if (record.stage === "Lost (Pipeline)") {
                    return uplersStyle.heighliteRed;
                  }
                  if (record.stage === "Total Active Pipeline") {
                    return uplersStyle.heighlitePurple;
                  }
                }}
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
                rowClassName={(record) => {
                  if (record.stage === "Goal") {
                    return uplersStyle.heighliteRow;
                  }
                  if (record.stage === "Joining") {
                    return uplersStyle.heighliteGreen;
                  }
                  if (record.stage === "Selections/Closures") {
                    return uplersStyle.heighliteOrange;
                  }
                  if (record.stage === "Lost (Pipeline)") {
                    return uplersStyle.heighliteRed;
                  }
                  if (record.stage === "Total Active Pipeline") {
                    return uplersStyle.heighlitePurple;
                  }
                }}
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
                rowClassName={(record) => {
                  if (record.stage === "Goal") {
                    return uplersStyle.heighliteRow;
                  }
                  if (record.stage === "Joining") {
                    return uplersStyle.heighliteGreen;
                  }
                  if (record.stage === "Selections/Closures") {
                    return uplersStyle.heighliteOrange;
                  }
                  if (record.stage === "Lost (Pipeline)") {
                    return uplersStyle.heighliteRed;
                  }
                  if (record.stage === "Total Active Pipeline") {
                    return uplersStyle.heighlitePurple;
                  }
                }}
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
                rowClassName={(record) => {
                  if (record.stage === "Goal") {
                    return uplersStyle.heighliteRow;
                  }
                  if (record.stage === "Joining") {
                    return uplersStyle.heighliteGreen;
                  }
                  if (record.stage === "Selections/Closures") {
                    return uplersStyle.heighliteOrange;
                  }
                  if (record.stage === "Lost (Pipeline)") {
                    return uplersStyle.heighliteRed;
                  }
                  if (record.stage === "Total Active Pipeline") {
                    return uplersStyle.heighlitePurple;
                  }
                }}
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
                rowClassName={(record) => {
                  if (record.stage === "Goal") {
                    return uplersStyle.heighliteRow;
                  }
                  if (record.stage === "Joining") {
                    return uplersStyle.heighliteGreen;
                  }
                  if (record.stage === "Selections/Closures") {
                    return uplersStyle.heighliteOrange;
                  }
                  if (record.stage === "Lost (Pipeline)") {
                    return uplersStyle.heighliteRed;
                  }
                  if (record.stage === "Total Active Pipeline") {
                    return uplersStyle.heighlitePurple;
                  }
                }}
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

                      {showTalentCol?.category !== "CF" &&
                        showTalentCol?.category !== "CH" && (
                          <th
                            style={{
                              padding: "10px",
                              border: "1px solid #ddd",
                              background: "rgb(233, 233, 233) !important",
                            }}
                          >
                            {showTalentCol?.stage === "Joining" ||
                            showTalentCol?.stage === "Selections/Closures"
                              ? showTalentCol?.stage
                              : "Action"}{" "}
                            Date
                          </th>
                        )}

                      <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          backgroundColor: "rgb(233, 233, 233) !important",
                        }}
                      >
                        Company
                      </th>
                      {showTalentCol?.category !== "CF" &&
                        (showTalentCol?.category === "CH" &&
                        showTalentCol?.stage !== "Customers with Active HRs"
                          ? false
                          : true) && (
                          <>
                            <th
                              style={{
                                padding: "10px",
                                border: "1px solid #ddd",
                                backgroundColor:
                                  "rgb(233, 233, 233) !important",
                              }}
                            >
                              HR Number
                            </th>
                            <th
                              style={{
                                padding: "10px",
                                border: "1px solid #ddd",
                                backgroundColor:
                                  "rgb(233, 233, 233) !important",
                              }}
                            >
                              HR Title
                            </th>
                             {showTalentCol?.stage === "Not Accepted HRs" &&   <th
                              style={{
                                padding: "10px",
                                border: "1px solid #ddd",
                                backgroundColor:
                                  "rgb(233, 233, 233) !important",
                              }}
                            >
                              Reason
                            </th>}
                            <th
                              style={{
                                padding: "10px",
                                border: "1px solid #ddd",
                                backgroundColor:
                                  "rgb(233, 233, 233) !important",
                              }}
                            >
                              TR
                            </th>
                            <th
                              style={{
                                padding: "10px",
                                border: "1px solid #ddd",
                                backgroundColor:
                                  "rgb(233, 233, 233) !important",
                              }}
                            >
                              {showTalentCol?.stage === "Joining" ||
                              showTalentCol?.stage === "Selections/Closures"
                                ? "Revenue"
                                : " 1TR Pipeline"}
                            </th>
                            {showTalentCol?.stage !== "Joining" &&
                              showTalentCol?.stage !==
                                "Selections/Closures" && (
                                <th
                                  style={{
                                    padding: "10px",
                                    border: "1px solid #ddd",
                                    backgroundColor:
                                      "rgb(233, 233, 233) !important",
                                  }}
                                >
                                  Total Pipeline
                                </th>
                              )}

                            <th
                              style={{
                                padding: "10px",
                                border: "1px solid #ddd",
                                backgroundColor:
                                  "rgb(233, 233, 233) !important",
                              }}
                            >
                              Uplers Fees %
                            </th>
                            <th
                              style={{
                                padding: "10px",
                                border: "1px solid #ddd",
                                backgroundColor:
                                  "rgb(233, 233, 233) !important",
                              }}
                            >
                              Talent Pay
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

                      {showTalentCol?.category !== "CF" &&
                        (showTalentCol?.category === "CH" &&
                        showTalentCol?.stage !== "Customers with Active HRs"
                          ? false
                          : true) && (
                          <>
                          {showTalentCol?.stage !== "Not Accepted HRs" &&   <th
                              style={{
                                padding: "10px",
                                border: "1px solid #ddd",
                                backgroundColor:
                                  "rgb(233, 233, 233) !important",
                              }}
                            >
                              Talent
                            </th>}
                          
                            <th
                              style={{
                                padding: "10px",
                                border: "1px solid #ddd",
                                backgroundColor:
                                  "rgb(233, 233, 233) !important",
                              }}
                            >
                              HR Status
                            </th>
                          </>
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
                        {showTalentCol?.category !== "CF" &&
                          showTalentCol?.category !== "CH" && (
                            <td
                              style={{
                                padding: "8px",
                                border: "1px solid #ddd",
                              }}
                            >
                              {detail.actionDateStr}
                            </td>
                          )}

                        <td
                          style={{ padding: "8px", border: "1px solid #ddd" }}
                        >
                          <a
                            href={`/viewCompanyDetails/${detail.company_ID}`}
                            style={{ textDecoration: "underline" }}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {detail.company}{" "}
                          </a>
                          {detail.company_Category === "Diamond" && (
                            <img
                              src={Diamond}
                              alt="info"
                              style={{ width: "16px", height: "16px" }}
                            />
                          )}
                        </td>
                        {showTalentCol?.category !== "CF" &&
                          (showTalentCol?.category === "CH" &&
                          showTalentCol?.stage !== "Customers with Active HRs"
                            ? false
                            : true) && (
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
                                 {showTalentCol?.stage === "Not Accepted HRs" &&    <td
                                style={{
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                }}
                              >
                                {detail.talent}
                              </td>}
                              <td
                                style={{
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                }}
                              >
                                {detail.tr}
                              </td>
                              <td
                                style={{
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                }}
                              >
                                {detail.hrPipelineStr}
                              </td>
                              {showTalentCol?.stage !== "Joining" &&
                                showTalentCol?.stage !==
                                  "Selections/Closures" && (
                                  <td
                                    style={{
                                      padding: "8px",
                                      border: "1px solid #ddd",
                                    }}
                                  >
                                    {detail.total_HRPipelineStr}
                                  </td>
                                )}
                              <td
                                style={{
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                }}
                              >
                                {detail.uplersFeesPer}
                              </td>
                              <td
                                style={{
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                }}
                              >
                                {detail.talentPayStr}
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

                        {showTalentCol?.category !== "CF" &&
                          (showTalentCol?.category === "CH" &&
                          showTalentCol?.stage !== "Customers with Active HRs"
                            ? false
                            : true) && (
                            <>
                             {showTalentCol?.stage !== "Not Accepted HRs" &&      <td
                                style={{
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                }}
                              >
                                {detail.talent}
                              </td>}
                           
                              <td
                                style={{
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                }}
                              >
                                {All_Hiring_Request_Utils.GETHRSTATUS(
                                  Number(detail.hrStatusCode),
                                  detail.hrStatus
                                )}
                              </td>
                            </>
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

      {showDFReport && (
        <Modal
          transitionName=""
          width="1020px"
          centered
          footer={null}
          open={showDFReport}
          className="engagementModalStyle"
          onCancel={() => {
            setSearchTerm("");
            setShowDFReport(false);
            setDFFilterListData([]);
            setDFListData([]);
          }}
        >
          {false ? (
            <div
              style={{
                display: "flex",
                height: "350px",
                justifyContent: "center",
              }}
            >
              <Spin size="large" />
            </div>
          ) : (
            <>
              <div
                style={{
                  padding: "45px 15px 10px 15px",
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <h3>
                  <b>{showTalentCol?.stage}</b> <b> : {achievedTotal}</b>
                </h3>
                {/* <p style={{ marginBottom: "0.5em" , marginLeft:'5px'}}>
                                  TA : <strong>add</strong>
                                </p> */}

                <input
                  type="text"
                  placeholder="Search talent..."
                  value={searchTerm}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  style={{
                    padding: "6px 10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    marginLeft: "auto",
                    marginRight: "20px",
                    minWidth: "260px",
                  }}
                />
              </div>

              {achievedLoading ? (
                <div>
                  <Skeleton active />
                </div>
              ) : (
                <div style={{ margin: "5px 10px" }}>
                  <Table
                    dataSource={DFFilterListData}
                    columns={DFColumns}
                    pagination={false}
                    scroll={{ y: "480px" }}
                  />
                </div>
              )}

              {/* {moveToAssessment && (
                                <Modal
                                  width="992px"
                                  centered
                                  footer={null}
                                  open={moveToAssessment}
                                  className="commonModalWrap"
                                  // onOk={() => setVersantModal(false)}
                                  onCancel={() => {
                                    setMoveToAssessment(false);
                                    resetRemarkField("remark");
                                    clearRemarkError("remark");
                                  }}
                                >
                                  <MoveToAssessment
                                    onCancel={() => {
                                      setMoveToAssessment(false);
                                      resetRemarkField("remark");
                                      clearRemarkError("remark");
                                    }}
                                    register={remarkregiter}
                                    handleSubmit={remarkSubmit}
                                    resetField={resetRemarkField}
                                    errors={remarkError}
                                    saveRemark={saveRemark}
                                    saveRemarkLoading={saveRemarkLoading}
                                  />
                                </Modal>
                              )} */}

              <div style={{ padding: "10px 0" }}>
                <button
                  className={uplersStyle.btnCancle}
                  // disabled={isAddingNewTask}
                  onClick={() => {
                    setSearchTerm("");
                    setShowDFReport(false);
                    setDFFilterListData([]);
                    setDFListData([]);
                  }}
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </Modal>
      )}
    </>
  );
}
