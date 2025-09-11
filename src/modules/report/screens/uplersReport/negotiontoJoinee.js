import React, { useState, useEffect, Suspense } from "react";
import uplersStyle from "./uplersReport.module.css";
import {
  Table,
  Modal,
  Tooltip,
  Skeleton,
  Spin,Select
} from "antd";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import Diamond from "assets/svg/diamond.svg";
import { ReportDAO } from "core/report/reportDAO";
import moment from "moment";
import { All_Hiring_Request_Utils } from "shared/utils/all_hiring_request_util";
import { IoMdAddCircle } from "react-icons/io";
import { IconContext } from "react-icons";
import { HTTPStatusCode } from "constants/network";

const { Option } = Select;

export default function NegotiontoJoinee({
  impHooks
}) {
        const {AddComment,monthDate,hrModal,selectedHead} = impHooks
     const [isLoading, setIsLoading] = useState(false);
     const [isTableLoading,setIsTableLoading] = useState(false)
       const [reportData, setReportData] = useState([]);
       const [summaryData,setSummaryData] = useState([])


       const getReportData = async () => {
 const pl = {
        hrmodel: hrModal,
        pod_id: selectedHead,
        month: moment(monthDate).format("M"),
        year: moment(monthDate).format("YYYY"),
      };
      setIsLoading(true)
        const result = await ReportDAO.getNegotiationReportDAO(pl);

 setIsLoading(false);

    if (result.statusCode === HTTPStatusCode.OK) {
      setReportData(
        result && result?.responseBody
      );
    } else {
      setReportData([]);
      return "NO DATA FOUND";
    }
       }

    const getReportSummaryData = async () => {
 const pl = {
        hrmodel: hrModal,
        pod_id: selectedHead,
        month: moment(monthDate).format("M"),
        year: moment(monthDate).format("YYYY"),
      };
      setIsTableLoading(true)
        const result = await ReportDAO.getNegotiationReportSummaryDAO(pl);
       
 setIsTableLoading(false);

    if (result.statusCode === HTTPStatusCode.OK) {
      setSummaryData(
        result && result?.responseBody
      );
    } else {
      setSummaryData([]);
      return "NO DATA FOUND";
    }
       }

       useEffect(()=>{
        getReportData()
        getReportSummaryData()
       },[monthDate,hrModal,selectedHead])


 const reportColumns = [
    {
      title: <div>Company</div>,
      dataIndex: "company",
      key: "company",
      width: 150,
      fixed: "left",
      className: uplersStyle.headerCell,
      render: (text, record) =>
        record?.companyCategory === "Diamond" ? (
          <>
            <span>{text}</span>
            &nbsp;
            <img
              src={Diamond}
              alt="info"
              style={{ width: "16px", height: "16px" }}
            />
          </>
        ) : (
          text
        ),
    },
    {
      title: <div style={{ textAlign: "center" }}>HR #</div>,
      dataIndex: "hR_Number",
      key: "hR_Number",
      width: 180,
      fixed: "left",
      className: uplersStyle.headerCell,
      render: (text, result) =>
        text ? (
          <a
            href={`/allhiringrequest/${result.hiringRequest_ID}`}
            style={{ textDecoration: "underline" }}
            target="_blank"
            rel="noreferrer"
          >
            {text}
          </a>
        ) : (
          text
        ),
    },
    {
      title: <div style={{ textAlign: "center" }}>Position</div>,
      dataIndex: "position",
      key: "position",
      fixed: "left",
      width: 180,
    },
        {
      title: (
        <div style={{ textAlign: "center" }}>
          Number of
          <br />
          TRs
        </div>
      ),
      dataIndex: "noofTR",
      key: "noofTR",
      width: 100,
      align: "center",
      className: uplersStyle.headerCell,
    },
        {
      title: (
        <div style={{ textAlign: "center" }}>
          Open
          <br />
          TRs
        </div>
      ),
      dataIndex: "openTR",
      key: "openTR",
      width: 100,
      align: "center",
      className: uplersStyle.headerCell,
    },
        {
      title: (
        <div style={{ textAlign: "center" }}>
         HR Date
        </div>
      ),
      dataIndex: "hrCreatedDateStr",
      key: "hrCreatedDateStr",
      width: 150,
      align: "center",
      className: uplersStyle.headerCell,
    },
        {
      title: (
        <div style={{ textAlign: "center" }}>
          Negotiation
          <br />
          Start Date
        </div>
      ),
      dataIndex: "negotiationDateStr",
      key: "negotiationDateStr",
      width: 150,
      align: "center",
      className: uplersStyle.headerCell,
    },
        {
      title: (
        <div style={{ textAlign: "center" }}>
          Offer Signed
          <br />
          Date
        </div>
      ),
      dataIndex: "offerSignDateStr",
      key: "offerSignDateStr",
      width: 150,
      align: "center",
      className: uplersStyle.headerCell,
    },
        {
      title: (
        <div style={{ textAlign: "center" }}>
          No. of Days -
          <br />
          HR to Offer<br/>Signed
        </div>
      ),
      dataIndex: "negotiationSinceDays",
      key: "negotiationSinceDays",
      width: 100,
      align: "center",
      className: uplersStyle.headerCell,
    },
        {
      title: (
        <div style={{ textAlign: "center" }}>
         Joining Date
        </div>
      ),
      dataIndex: "joiningdateStr",
      key: "joiningdateStr",
      width: 150,
      align: "center",
      className: uplersStyle.headerCell,
    },
        {
      title: (
        <div style={{ textAlign: "center" }}>
         Notice period
        </div>
      ),
      dataIndex: "talentNoticePeriod",
      key: "talentNoticePeriod",
      width: 120,
      align: "center",
      className: uplersStyle.headerCell,
    },
           {
      title: <div style={{ textAlign: "center" }}> Talent Status</div>,
      dataIndex: "talentStatus",
      key: "talentStatus",

      className: uplersStyle.headerCell,
      width: "180px",
      align: "center",
      render: (_, param) =>
        All_Hiring_Request_Utils.GETHRSTATUS(
          param?.hrStatusCode,
          param?.talentStatus
        ),
    },
      {
      title: (
        <div style={{ textAlign: "center" }}>
         Talent
        </div>
      ),
      dataIndex: "talent",
      key: "talent",
      width: 120,
      align: "center",
      className: uplersStyle.headerCell,
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
         Salary of talent
        </div>
      ),
      dataIndex: "talentPayStr",
      key: "talentPayStr",
      width: 150,
      align: "right",
      className: uplersStyle.headerCell,
    },

   
    {
      title: <div style={{ textAlign: "center" }}> Billing %</div>,
      dataIndex: "uplersFeesPer",
      key: "uplersFeesPer",
      width: 120,
      align: "center",
      className: uplersStyle.headerCell,
    },
        {
      title: (
        <div style={{ textAlign: "center" }}>
         Billing Value
        </div>
      ),
      dataIndex: hrModal === 'DP' ? 'uplersFees_INRStr' : "uplersFees_USDStr",
      key: hrModal === 'DP' ? 'uplersFees_INRStr' : "uplersFees_USDStr",
      width: 120,
      align: "right",
      className: uplersStyle.headerCell,
    },

    {
      title: (
        <div style={{ textAlign: "center" }}>
         Nasa Revenue
        </div>
      ),
      dataIndex: "podValueStr",
      key: "podValueStr",
      width: 150,
      align: "right",
      className: uplersStyle.headerCell,
    },
      {
      title: <div style={{ textAlign: "center" }}>Recruiter</div>,
      dataIndex: "recruiter",
      key: "recruiter",
      width: 150,
      // fixed: "left",
      className: uplersStyle.headerCell,
    },
      {
      title: <div style={{ textAlign: "center" }}>Sales Person</div>,
      dataIndex: "salesPerson",
      key: "salesPerson",
      width: 150,
      // fixed: "left",
      className: uplersStyle.headerCell,
    },
   
    {
      title: <div style={{ textAlign: "center" }}>HR Status</div>,
      dataIndex: "hrStatus",
      key: "hrStatus",

      className: uplersStyle.headerCell,
      width: "180px",
      align: "center",
      render: (_, param) =>
        All_Hiring_Request_Utils.GETHRSTATUS(
          param?.hrStatusCode,
          param?.hrStatus
        ),
    },
  ];

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
                            // getDFDetails(rec, v);
                          } else {
                            // getHRTalentWiseReport(rec, v);
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
                    // getDFDetails(rec, v, "W1");
                  } else {
                    // getHRTalentWiseReport(rec, v, "W1");
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
                    // getDFDetails(rec, v, "W2");
                  } else {
                    // getHRTalentWiseReport(rec, v, "W2");
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
                    // getDFDetails(rec, v, "W3");
                  } else {
                    // getHRTalentWiseReport(rec, v, "W3");
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
                    // getDFDetails(rec, v, "W4");
                  } else {
                    // getHRTalentWiseReport(rec, v, "W4");
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
                    // getDFDetails(rec, v, "W5");
                  } else {
                    // getHRTalentWiseReport(rec, v, "W5");
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
        title: <div style={{ textAlign: "center" }}>Next Month</div>,
        dataIndex: "nextMonthStr",
        key: "nextMonthStr",
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
                    // getDFDetails(rec, v, "W5");
                  } else {
                    // getHRTalentWiseReport(rec, v, "W5");
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
  


  return (<>

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
                Summary
              </p>
              <Table
                columns={getColumns()}
                dataSource={summaryData}
                bordered
                pagination={false}
                size="middle"
                scroll={{ x: "max-content", y: "1vh" }}
                rowClassName={(record) => {
                  if (record.stage === "PROJECTION") {
                    return `${uplersStyle.heighliteRow} ${uplersStyle.boldText}`;
                  }
                  if (record.stage === "Joined" || record.stage === "Offer Signed" ) {
                    return uplersStyle.heighliteGreen;
                  }
                  if (record.stage === "Selections/Closures") {
                    return uplersStyle.heighliteOrange;
                  }
                  if (record.stage === "Dropouts" || record.stage === "Dropouts") {
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
 {isLoading ? (
        <TableSkeleton />
      ) : (
        <Table
          scroll={{ x: "1600px", y: "100vh" }}
          id="amReportList"
          columns={reportColumns}
          bordered={false}
          dataSource={reportData}
          rowKey={(record, index) => index}
        //   rowClassName={(row, index) => {
        //     return row?.clientName === "TOTAL"
        //       ? uplersStyle.highlighttotalrow
        //       : "";
        //   }}
          pagination={false}
          // pagination={{
          //   size: "small",
          //   pageSize: 15
          // }}
        />
      )}
        </div>
      </div>
  </>
     
  )
}
