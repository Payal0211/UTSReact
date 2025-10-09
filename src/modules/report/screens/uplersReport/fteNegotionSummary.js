import React, { useState, useEffect, Suspense } from "react";
import uplersStyle from "./uplersReport.module.css";
import { Table, Modal, Tooltip, Skeleton, Spin, Select, message } from "antd";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import Diamond from "assets/svg/diamond.svg";
import { ReportDAO } from "core/report/reportDAO";
import moment from "moment";
import { All_Hiring_Request_Utils } from "shared/utils/all_hiring_request_util";
import { HTTPStatusCode } from "constants/network";

export default function FTENegotiationSummary({ impHooks }) {
  const { monthDate, hrModal, selectedHead, podName } = impHooks;
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [achievedLoading, setAchievedLoading] = useState(false);
  const [showTalentCol, setShowTalentCol] = useState({});
  const [achievedTotal, setAchievedTotal] = useState("");
  const [DFListData, setDFListData] = useState([]);
  const [DFFilterListData, setDFFilterListData] = useState([]);
  const [showDFReport, setShowDFReport] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const getReportData = async () => {
    const pl = {
      hrmodel: hrModal,
      month: moment(monthDate).format("M"),
      year: moment(monthDate).format("YYYY"),
    };
    setIsLoading(true);
    const result = await ReportDAO.getFTENegotiationReportDAO(pl);

    setIsLoading(false);

    if (result.statusCode === HTTPStatusCode.OK) {
      setReportData(result && result?.responseBody);
    } else {
      setReportData([]);
      return "NO DATA FOUND";
    }
  };

  useEffect(() => {
    getReportData();
  }, [monthDate, hrModal]);

  const getDFDetails = async (row, v, week) => {
    try {
      setShowDFReport(true);

      const pl = {
        hrmodel: hrModal,
        //   pod_id: selectedHead,
        month: moment(monthDate).format("M"),
        year: moment(monthDate).format("YYYY"),
        stage_ID: row.stage_ID,
        weekno: week ? week : "",
        hr_businesstype: row.hR_Type,
        isNextMonth: row?.isNM === "Yes" ? row?.isNM : "",
      };
      setShowTalentCol(row);
      setAchievedTotal(v);
      setAchievedLoading(true);
      const result = await ReportDAO.getFTEPopupReportDAO(pl);
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

  const reportColumns = [
    {
      title: "Stages",
      dataIndex: "stage",
      key: "stage",
      //   fixed: "left",
      width: 200,
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
              <div style={{ marginLeft: "auto" }}>
                {v ? (
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
                getDFDetails(rec, v, "W1");
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
                getDFDetails(rec, v, "W2");
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
                getDFDetails(rec, v, "W3");
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
                getDFDetails(rec, v, "W4");
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
                getDFDetails(rec, v, "W5");
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
      render: (v, rec) => {
        return v
          ? rec.stage === "Goal" || rec.stage.includes("%")
            ? v
            : v
          : // <span
            //   onClick={() => {
            //     if (rec.category === "DF") {
            //       // getDFDetails(rec, v, "W5");
            //     } else {
            //       // getHRTalentWiseReport(rec, v, "W5");
            //     }
            //   }}
            //   style={{ cursor: "pointer", color: "#1890ff" }}
            // >
            // {v}
            // </span>

            "";
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
                getDFDetails({ ...rec, isNM: "Yes" }, v);
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
  ];

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
      width: "200px",
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
      width: "150px",
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
      width: "100px",
      align: "center",
      className: uplersStyle.headerCell,
    },
    {
      title: <div style={{ textAlign: "center" }}>Billing Value</div>,
      dataIndex: hrModal === "DP" ? "uplersFees_INRStr" : "uplersFees_USDStr",
      key: hrModal === "DP" ? "uplersFees_INRStr" : "uplersFees_USDStr",
      width: "150px",
      align: "right",
      className: uplersStyle.headerCell,
    },
    {
      title: <div style={{ textAlign: "center" }}>{podName} Revenue</div>,
      dataIndex: "podValueStr",
      key: "podValueStr",
      width: "150px",
      align: "right",
      className: uplersStyle.headerCell,
      render: (v, row) => {
        return (
          <div
            style={{
              display: "flex",
              alignContent: "end",
              justifyContent: "space-between",
            }}
          >
            {/* <Tooltip placement="bottom" title={"Split HR"}>
                    <a href="javascript:void(0);" style={{display: 'inline-flex'}}>
                      <PiArrowsSplitBold
                        style={{ width: "17px", height: "17px", fill: '#232323' }}
                        onClick={() => {
                          setSplitHR(true);
                          setHRID(row?.hiringRequestID);
                          setHRNumber({hrNumber:row?.hR_Number});
                          getPODList(row?.hiringRequestID)
                        }}
                      />
                    </a>
                  </Tooltip> */}
            {v ? v : ""}{" "}
          </div>
        );
      },
    },

    {
      title: <div style={{ textAlign: "center" }}>HR Modal</div>,
      dataIndex: "hR_Model",
      key: "hR_Model",

      className: uplersStyle.headerCell,
      width: "180px",
      align: "center",
    },
  ];

  const handleSummerySearchInput = (value) => {
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
                      scroll={{ x: "1600px", y: "480px" }}
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
      </div>
    </div>
  );
}
