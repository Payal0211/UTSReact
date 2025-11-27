import React, { useState, useEffect, Suspense } from "react";
import uplersStyle from "./uplersReport.module.css";
import { Table, Modal, Tooltip, Skeleton, Spin, Select, message } from "antd";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import Diamond from "assets/svg/diamond.svg";
import { ReportDAO } from "core/report/reportDAO";
import moment from "moment";
import { All_Hiring_Request_Utils } from "shared/utils/all_hiring_request_util";
import { HTTPStatusCode } from "constants/network";

export default function QASummary({impHooks}) {
     const { monthNames,reportData,hrModal,monthDate,selectedHead,podName,} = impHooks;
     const [isLoading, setIsLoading] = useState(false);
    //    const [reportData, setReportData] = useState([]);
    //    const [monthNames,setMonthNames] = useState({m1Name:'',m2Name:'',m3Name:''})
    // const [QtabName,setQTabName] = useState('')
     const [showTalentCol, setShowTalentCol] = useState({});
        const [achievedTotal, setAchievedTotal] = useState("");
        const [DFListData, setDFListData] = useState([]);
        const [DFFilterListData, setDFFilterListData] = useState([]);
        const [showDFReport, setShowDFReport] = useState(false);
         const [achievedLoading, setAchievedLoading] = useState(false);
          const [searchTerm, setSearchTerm] = useState("");

   const getDFDetails = async (row, v, week) => {
        try {
          setShowDFReport(true);
    
          const pl = {
            hrmodel: hrModal,
            pod_id: selectedHead,
            month: moment(monthDate).format("M"),
            year: moment(monthDate).format("YYYY"),
            stage_ID: row.stage_ID,
            weekno: week ? week : "",
            hr_businesstype:row.hR_Type,
            isNextMonth:row?.isNM === 'Yes'? row?.isNM : ''
          };
          setShowTalentCol(row);
          setAchievedTotal(v);
          setAchievedLoading(true);
          const result = await ReportDAO.getQuarterlySummaryPopupReportDAO(pl);
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
      }

       
  const reportColumns = [
    {
      title: "Stages",
      dataIndex: "stage",
      key: "stage",
      //   fixed: "left",
      width: 150,
      className: `${uplersStyle.stagesHeaderCell} ${uplersStyle.headerCommonConfig} `,
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
                onClick={() => {
                   getDFDetails(rec, v);
                 
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
      title: <div style={{ textAlign: "center" }}>Achieved %</div>,
      dataIndex: "achievedPerStr",
      key: "achievedPerStr",
      width: 120,
      align: "right",
      onHeaderCell: () => ({
        className: uplersStyle.headerCommonGoalHeaderConfig,
      }),
      className: `${uplersStyle.headerCommonConfig}`,
    
    },
     {
      title: <div style={{ textAlign: "center" }}>{monthNames.m1Name ?? 'NA'}</div> ,
      dataIndex: "m1Str",
      key: "m1Str",
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
                   getDFDetails(rec, v,monthNames.m1Name);
                 
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
      title: <div style={{ textAlign: "center" }}>{monthNames.m2Name ?? 'NA'}</div> ,
      dataIndex: "m2Str",
      key: "m2Str",
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
                   getDFDetails(rec, v,monthNames.m2Name);
                 
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
      title: <div style={{ textAlign: "center" }}>{monthNames.m3Name ?? 'NA'}</div> ,
      dataIndex: "m3Str",
      key: "m3Str",
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
                   getDFDetails(rec, v,monthNames.m3Name);
                 
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
      title: <div style={{ textAlign: "center" }}>Projection</div>,
      dataIndex: "projectionStr",
      key: "projectionStr",
      width: 120,
      align: "right",
      onHeaderCell: () => ({
        className: uplersStyle.headerCommonGoalHeaderConfig,
      }),
      className: `${uplersStyle.headerCommonConfig}`,
    
    },
    {
      title: <div style={{ textAlign: "center" }}>Upcoming Quarter</div>,
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
                   getDFDetails({...rec,isNM:'Yes' }, v);
                 
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
]

   const DFColumns = [
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
      width: "150px",
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
      title: "Position",
      dataIndex: "position",
      key: "position",
      width: '200px',
    },
     {
      title: "Joining Date",
      dataIndex: "joiningdateStr",
      key: "joiningdateStr",
    },
    {
      title: "Talent",
      dataIndex: "talent",
      key: "talent",
    },
    {
      title: "Talent Status",
      dataIndex: "talentStatus",
      key: "talentStatus",
        width: '150px',
      render: (_, param) =>
        All_Hiring_Request_Utils.GETHRSTATUS(
          param?.hrStatusCode,
          param?.talentStatus
        ),
    },
 {
      title: <div style={{ textAlign: "center" }}> Billing %</div>,
      dataIndex: "uplersFeesPer",
      key: "uplersFeesPer",
       width: '100px',
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
        width: '150px',
      align: "right",
      className: uplersStyle.headerCell,
    },
        {
      title: (
        <div style={{ textAlign: "center" }}>
         {podName} Revenue
        </div>
      ),
      dataIndex: "podValueStr",
      key: "podValueStr",
        width: '150px',
      align: "right",
      className: uplersStyle.headerCell,
    //   render:(v,row)=>{
    //     return <div style={{display:'flex',alignContent:'center',justifyContent:'space-between'}}>
    //        <Tooltip placement="bottom" title={"Split HR"}>
    //             <a href="javascript:void(0);" style={{display: 'inline-flex'}}>
    //               <PiArrowsSplitBold
    //                 style={{ width: "17px", height: "17px", fill: '#232323' }}
    //                 onClick={() => {
    //                   setSplitHR(true);
    //                   setHRID(row?.hiringRequestID);
    //                   setHRNumber({hrNumber:row?.hR_Number});
    //                   getPODList(row?.hiringRequestID)
    //                 }}
    //               />
    //             </a>
    //           </Tooltip>
    // {  v ? v  : ''} </div>
    //   }
    },

     {
      title: <div style={{ textAlign: "center" }}>HR Modal</div>,
      dataIndex: "hR_Model",
      key: "hR_Model",

      className: uplersStyle.headerCell,
      width: "180px",
      align: "center",
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

  const handleSummerySearchInput =(value) => {
    setSearchTerm(value);
    const filteredData = DFListData.filter(
      (talent) =>
        talent.talent.toLowerCase().includes(value.toLowerCase()) ||
        (talent.email &&
          talent.email.toLowerCase().includes(value.toLowerCase()))
    );
    setDFFilterListData(filteredData);
  };

  return (<>
  {hrModal !== 'DP' ? <>
   <div className={uplersStyle.filterContainer} style={{ padding: "12px" }}>
      <div className={uplersStyle.customTableContainer}>
        {isLoading ? (
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
             New Summary
            </p>
            <Table
              scroll={{ x: "1600px", y: "100vh" }}
              id="amReportList"
              columns={reportColumns}
              bordered={false}
              dataSource={reportData.filter(item=> item.hR_Type !== 'New')}
              rowKey={(record, index) => index}
              pagination={false}
              rowClassName={(record) => {
                if (record.stage === "PROJECTION") {
                  return `${uplersStyle.heighliteRow} ${uplersStyle.boldText}`;
                }
                if (
                  record.stage === "Target Pending" ||
                  record.stage === "Negotiation Gap"
                ) {
                  return uplersStyle.boldText;
                }
                if (
                  record.stage === "Joined" ||
                  record.stage === "Offer Signed"
                ) {
                  return uplersStyle.heighliteGreen;
                }
                if (record.stage === "Selections/Closures") {
                  return uplersStyle.heighliteOrange;
                }
                if (
                  record.stage === "Dropouts" ||
                  record.stage === "Dropouts"
                ) {
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
          <>
            <p
              style={{
                fontWeight: "bold",
                fontSize: "20px",
                padding: "20px 20px 0",
              }}
            >
             Existing Summary
            </p>
            <Table
              scroll={{ x: "1600px", y: "100vh" }}
              id="amReportList"
              columns={reportColumns}
              bordered={false}
              dataSource={reportData.filter(item=> item.hR_Type !== 'Existing')}
              rowKey={(record, index) => index}
              pagination={false}
              rowClassName={(record) => {
                if (record.stage === "PROJECTION") {
                  return `${uplersStyle.heighliteRow} ${uplersStyle.boldText}`;
                }
                if (
                  record.stage === "Target Pending" ||
                  record.stage === "Negotiation Gap"
                ) {
                  return uplersStyle.boldText;
                }
                if (
                  record.stage === "Joined" ||
                  record.stage === "Offer Signed"
                ) {
                  return uplersStyle.heighliteGreen;
                }
                if (record.stage === "Selections/Closures") {
                  return uplersStyle.heighliteOrange;
                }
                if (
                  record.stage === "Dropouts" ||
                  record.stage === "Dropouts"
                ) {
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
  </> :  <div className={uplersStyle.filterContainer} style={{ padding: "12px" }}>
      <div className={uplersStyle.customTableContainer}>
        {isLoading ? (
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
              scroll={{ x: "1600px", y: "100vh" }}
              id="amReportList"
              columns={reportColumns}
              bordered={false}
              dataSource={reportData}
              rowKey={(record, index) => index}
              pagination={false}
              rowClassName={(record) => {
                if (record.stage === "PROJECTION") {
                  return `${uplersStyle.heighliteRow} ${uplersStyle.boldText}`;
                }
                if (
                  record.stage === "Target Pending" ||
                  record.stage === "Negotiation Gap"
                ) {
                  return uplersStyle.boldText;
                }
                if (
                  record.stage === "Joined" ||
                  record.stage === "Offer Signed"
                ) {
                  return uplersStyle.heighliteGreen;
                }
                if (record.stage === "Selections/Closures") {
                  return uplersStyle.heighliteOrange;
                }
                if (
                  record.stage === "Dropouts" ||
                  record.stage === "Dropouts"
                ) {
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
        </div>}

          {showDFReport && (
                        <Modal
                          transitionName=""
                          width="1050px"
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
                                  onChange={(e) => handleSummerySearchInput(e.target.value)}
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
                                    scroll={{x: "1600px", y: "480px"}}
                                  />
                                </div>
                              )}
                
                              
                
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
    
  )
}
