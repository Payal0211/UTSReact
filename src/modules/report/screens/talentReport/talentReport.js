import React, { useEffect, useState, useCallback, useMemo } from "react";
import TalentBackoutStyle from "./talentReport.module.css";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { InputType } from "constants/application";
import { ReactComponent as SearchSVG } from "assets/svg/search.svg";
import { ReactComponent as CloseSVG } from "assets/svg/close.svg";
import { ReportDAO } from "core/report/reportDAO";
import { HTTPStatusCode } from "constants/network";
import WithLoader from "shared/components/loader/loader";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import { Modal, Skeleton, Table, Tabs, Tooltip, Dropdown , Menu } from "antd";
import { downloadToExcel } from "modules/report/reportUtils";
import LogoLoader from "shared/components/loader/logoLoader";
import { Link } from "react-router-dom";
import moment from "moment";
import { IoChevronDownOutline } from "react-icons/io5";
import { amDashboardDAO } from "core/amdashboard/amDashboardDAO";

export default function TalentReport() {
  const [talentReportTabTitle, setTalentReportTabTitle] = useState("Deployed");
  const [isLoading, setIsLoading] = useState(false);
  const [onboardList, setonboardList] = useState([]);
  const [onboardPageSize, setonboardPageSize] = useState(10);
  const [onboardPageIndex, setonboardPageIndex] = useState(1);
  const [onboardListDataCount, setonboardListDataCount] = useState(0);
  const pageSizeOptions = [100, 200, 300, 500, 1000, 5000];
  const [onboardSearchText, setonboardSearchText] = useState("");
  const [onboardDebounceText, setonboardDebounceText] = useState("");
  const [rejectedDebounceText, setRejectedDebounceText] = useState("");
  const [rejectedSearchText, setrejectedSearchText] = useState("");
  const [rejectedList, setrejectedList] = useState([]);
  const [rejectedPageSize, setrejectedPageSize] = useState(10);
  const [rejectedPageIndex, setrejectedPageIndex] = useState(1);
  const [rejectedListDataCount, setrejectedListDataCount] = useState(0);
  const [showLeaves, setshowLeaves] = useState(false);
  const [leaveList, setLeaveList] = useState([]);
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [pageSize, setPageSize] = useState(20);


  const getOnboardData = useCallback(
    async (psize, pInd) => {
      setIsLoading(true);
      let payload = {
        pageIndex: onboardSearchText ? 1 : onboardPageIndex,
        pageSize: onboardPageSize,
        searchText: onboardSearchText,
      };

      const talentOnboardResult = await ReportDAO.getTalentOnboardReportDRO(
        payload
      );
      setIsLoading(false);
      // console.log(replacementResult)

      if (talentOnboardResult?.statusCode === HTTPStatusCode.OK) {
        setonboardList(talentOnboardResult?.responseBody?.rows);
        setonboardListDataCount(talentOnboardResult?.responseBody?.totalrows);
      } else {
        setonboardList([]);
        setonboardListDataCount(0);
      }
    },
    [onboardPageIndex, onboardPageSize, onboardSearchText]
  );

  const getRejectedData = useCallback(
    async (psize, pInd) => {
      setIsLoading(true);
      let payload = {
        pageIndex: rejectedSearchText? 1 : rejectedPageIndex,
        pageSize: rejectedPageSize,
        searchText: rejectedSearchText,
      };

      const talentrejectedResult = await ReportDAO.getTalentRejectReportDRO(
        payload
      );
      setIsLoading(false);
      // console.log(replacementResult)

      if (talentrejectedResult?.statusCode === HTTPStatusCode.OK) {
        setrejectedList(talentrejectedResult?.responseBody?.rows);
        setrejectedListDataCount(talentrejectedResult?.responseBody?.totalrows);
      } else {
        setrejectedList([]);
        setrejectedListDataCount(0);
      }
    },
    [rejectedPageIndex, rejectedPageSize, rejectedSearchText]
  );

  useEffect(() => {
    getOnboardData();
  }, [onboardPageIndex, onboardSearchText, onboardPageSize]);

  useEffect(() => {
    getRejectedData();
  }, [rejectedPageIndex, rejectedSearchText, rejectedPageSize]);

  const getLeaveList = async (talentID) => {
    setshowLeaves(true);
    setLeaveLoading(true);
    let payload = {
      talentID: talentID,
    };
    const result = await amDashboardDAO.getTalentLeaveRequestDAO(payload);
    setLeaveLoading(false);
    if (result.statusCode === HTTPStatusCode.OK) {
      setLeaveList(result.responseBody);
    }
    if (result.statusCode === HTTPStatusCode.NOT_FOUND) {
      setLeaveList([]);
    }
  };

  const tableColumnsMemo = useMemo(() => {
    return [
      {
        title: "Created On",
        dataIndex: "createdOn",
        key: "createdOn",
        align: "left",
        width: "110px",
      },
      {
        title: "Month Year",
        dataIndex: "createdonMonthYear",
        key: "createdonMonthYear",
        align: "left",
        width: "100px",
      },
      {
        title: "Engagement / HR #",
        dataIndex: "engagemenID",
        key: "engagemenID",
        align: "left",
        width: "200px",
        render: (text, item) => {
          return (
            <>
              <Link
                to={`/viewOnboardDetails/${item.onBoardID}/${
                  item.isOngoing === "Ongoing" ? true : false
                }`}
                target="_blank"
                style={{
                  color: `var(--uplers-black)`,
                  textDecoration: "underline",
                }}
              >
                {text}
              </Link>{" "}
              <br />/{" "}
              <Link
                to={`/allhiringrequest/${item.id}`}
                target="_blank"
                style={{ color: "#006699", textDecoration: "underline" }}
              >
                {item.hR_Number}
              </Link>
            </>
          );
        },
      },
      {
        title: "AM",
        dataIndex: "amName",
        key: "amName",
        align: "left",
        width: "120px",
      },
      {
        title: "Talent",
        dataIndex: "name",
        key: "name",
        align: "left",
        width: "200px",
        render: (text, result) => {
          return (
            <>
              {text} <br />( {result.emailID} )
            </>
          );
        },
      },

      {
        title: "Client",
        dataIndex: "client",
        key: "client",
        align: "left",
        width: "200px",
      },
      {
        title: "Engagement Type",
        dataIndex: "hrEngagementType",
        key: "hrEngagementType",
        align: "left",
        width: "200px",
      },
      {
        title: 'Start Date' ,
        dataIndex: "contractStartDate",
        key: "contractStartDate",
        align: "left",
        width: "120px",
        render: (text, result) => {
          return text;
        },
      },
      {
        title: (
          <>
            Last Working date <br />/ Contract End Date
          </>
        ),
        dataIndex: "lastWorkingDate",
        key: "lastWorkingDate",
        align: "left",
        width: "160px",
        render: (text, result) => {
          return (
            <>
              {text ? text : "NA"} <br />/{" "}
              {result.contractEndDate ? result.contractEndDate : "NA"}
            </>
          );
        },
      },

      {
        title: "Status",
        dataIndex: "talentStatus",
        key: "talentStatus",
        align: "left",
        render: (text, result) => {
          return (
            <div
              className={`${TalentBackoutStyle.ticketStatusChip} ${
                text.includes("Rejected")
                  ? TalentBackoutStyle.expireDate
                  : text.includes("Hired")
                  ? TalentBackoutStyle.Hired
                  : ""
              }`}
            >
              <span style={{ cursor: "pointer" }}> {text}</span>
            </div>
          );
        },
      },

      {
        title: (
          <>
            Paid Leaves <br />/ Leave Balance
          </>
        ),
        dataIndex: "totalLeavesGiven",
        key: "totalLeavesGiven",
        align: "left",
        width: "150px",
        render: (text, value) => {
          return (
            <div style={{ display: "flex" }}>
              {text}{" "}
              {value.totalLeaveBalance !== null ? (
                <>
                  /{" "}
                  <p
                    style={{
                      textDecoration: "underline",
                      cursor: "pointer",
                      marginLeft: "5px",
                    }}
                    onClick={() => {
                      getLeaveList(value.talentID);
                    }}
                  >{`${value.totalLeaveBalance}`}</p>
                </>
              ) : (
                ""
              )}{" "}
            </div>
          );
        },
      },
      //   {
      //     title: "Leave Balance",
      //     dataIndex: "totalLeaveBalance",
      //     key: "totalLeaveBalance",
      //     align: "left",
      //     render:(text,value)=>{
      //         return <p style={{textDecoration:'underline',cursor:'pointer'}} onClick={()=>{getLeaveList(value.talentID)}}>{text}</p>
      //     },
      //     width: "120px",
      //   },
    ];
  }, [onboardList]);

  const tableRejectedColumnsMemo = useMemo(() => {
    return [
      {
        title: "Created On",
        dataIndex: "createdOn",
        key: "createdOn",
        align: "left",
        width: "120px",
      },
      {
        title: "HR #",
        dataIndex: "hR_Number",
        key: "hR_Number",
        align: "left",
        width: "170px",
        render: (text, item) => {
          return (
            <>
              <Link
                to={`/allhiringrequest/${item.id}`}
                target="_blank"
                style={{ color: "#006699", textDecoration: "underline" }}
              >
                {text}
              </Link>
            </>
          );
        },
      },
      {
        title: "Talent",
        dataIndex: "name",
        key: "name",
        align: "left",
        render: (text, result) => {
          return (
            <>
              {text} <br />( {result.emailID} )
            </>
          );
        },
      },

      {
        title: "Client",
        dataIndex: "client",
        key: "client",
        align: "left",
        // width: "240px",
      },
      {
        title: "Reason",
        dataIndex: "reason",
        key: "reason",
        align: "left",
        width: "230px",
      },

      {
        title: "Remark",
        dataIndex: "lossRemark",
        key: "lossRemark",
        align: "left",
        width: "230px",
      },
      {
        title: "Sales Person",
        dataIndex: "salesPerson",
        key: "salesPerson",
        align: "left",
        width: "150px",
      },
      {
        title: "Stage",
        dataIndex: "rejectionStage",
        key: "rejectionStage",
        align: "left",
        width: "150px",
      },
    ];
  }, [rejectedList]);

  const leaveColumns = useMemo(() => {
    return [
      {
        title: "Leave Date",
        dataIndex: "leaveDate",
        key: "leaveDate",
        align: "left",
        width: "250px",
        render: (value, data) => {
          return value
            .split("/")
            .map((val) => moment(val).format(" MMM DD, YYYY"))
            .join(" To ");
        },
      },
      {
        title: "Summary",
        dataIndex: "leaveReason",
        key: "leaveReason",
        align: "left",
        width: "250px",
        render: (value, data) => {
          return value;
        },
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        align: "left",
        width: "100px",
        render: (value, data) => {
          return (
            <div
              className={`${TalentBackoutStyle.documentStatus} ${
                value === "Approved"
                  ? TalentBackoutStyle.green
                  : value === "Rejected"
                  ? TalentBackoutStyle.red
                  : TalentBackoutStyle.blue
              }`}
            >
              <div
                className={`${TalentBackoutStyle.documentStatusText} ${
                  value === "Approved"
                    ? TalentBackoutStyle.green
                    : value === "Rejected"
                    ? TalentBackoutStyle.red
                    : TalentBackoutStyle.blue
                }`}
              >
                {value === "Rejected" ? (
                  <Tooltip title={data.leaveRejectionRemark}>
                    <span style={{ cursor: "pointer" }}> {value}</span>
                  </Tooltip>
                ) : (
                  <span> {value}</span>
                )}
              </div>
            </div>
          );
        },
      },
    ];
  }, [leaveList]);

  useEffect(() => {
    const timer = setTimeout(() => getOnboardData(), 1000);
    return () => clearTimeout(timer);
  }, [onboardDebounceText]);

  useEffect(() => {
    const timer = setTimeout(() => getRejectedData(), 1000);
    return () => clearTimeout(timer);
  }, [rejectedDebounceText]);

  const handleOnboardExport = (apiData) => {
    let DataToExport = apiData.map((data) => {
      let obj = {};
      tableColumnsMemo.forEach((val) => {
        if (val.key !== "action") {
          if (val.title === "Talent") {
            obj[`${val.title}`] = `${data.name} ( ${data.emailID} )`;
          } else if (val.key === "contractStartDate") {
            obj[`Contract Start Date / Contract End Date`] = `${
              data.contractStartDate ? data.contractStartDate : "NA"
            } / ${data.contractEndDate ? data.contractEndDate : "NA"}`;
          } else {
            obj[`${val.title}`] = data[`${val.key}`];
          }
        }
      });
      return obj;
    });
    downloadToExcel(DataToExport, "Talent_Onboard_Report.xlsx");
  };

  const handleRejectExport = (apiData) => {
    let DataToExport = apiData.map((data) => {
      let obj = {};
      tableRejectedColumnsMemo.forEach((val) => {
        if (val.key !== "action") {
          if (val.title === "Talent") {
            obj[`${val.title}`] = `${data.name} ( ${data.emailID} )`;
          } else if (val.key === "contractStartDate") {
            obj[`${val.title}`] = `${data.typeOfHR} ${
              data.h_Availability && `/ ${data.contractEndDate}`
            }`;
          } else {
            obj[`${val.title}`] = data[`${val.key}`];
          }
        }
      });
      return obj;
    });
    downloadToExcel(DataToExport, "Talent_Reject_Report.xlsx");
  };

  return (
    <div className={TalentBackoutStyle.dealContainer}>
      <div className={TalentBackoutStyle.header}>
        <div className={TalentBackoutStyle.dealLable}>Talent Report</div>
        {/* <LogoLoader visible={isLoading} /> */}
      </div>
      
      
      <Tabs
        onChange={(e) => setTalentReportTabTitle(e)}
        defaultActiveKey="Deployed"
        activeKey={talentReportTabTitle}
        animated={true}
        tabBarGutter={50}
        tabBarStyle={{ borderBottom: `1px solid var(--uplers-border-color)` }}
        items={[
          {
            label: "Deployed",
            key: "Deployed",
            children: (
              <>
                <div className={TalentBackoutStyle.filterContainer}>
                  <div className={TalentBackoutStyle.filterSets}>
                    <div className={TalentBackoutStyle.filterRight}>
                      <div className={TalentBackoutStyle.searchFilterSet}>
                        <SearchSVG style={{ width: "16px", height: "16px" }} />
                        <input
                          type={InputType.TEXT}
                          className={TalentBackoutStyle.searchInput}
                          placeholder="Search Table"
                          value={onboardSearchText}
                          onChange={(e) => {
                            setonboardSearchText(e.target.value);
                            setonboardDebounceText(e.target.value);
                          }}
                        />
                        {onboardSearchText && (
                          <CloseSVG
                            style={{
                              width: "16px",
                              height: "16px",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              setonboardSearchText("");
                              setonboardDebounceText("");
                            }}
                          />
                        )}
                      </div>

                      <div className={TalentBackoutStyle.priorityFilterSet}>
              <div className={TalentBackoutStyle.label}>Showing</div>
              <div className={TalentBackoutStyle.paginationFilter}>
                <Dropdown
                  trigger={["click"]}
                  placement="bottom"
                  overlay={
                    <Menu
                      onClick={(e) => {
                        setonboardPageSize(parseInt(e.key));
                        // if (pageSize !== parseInt(e.key)) {
                        //   setTableFilteredState((prevState) => ({
                        //     ...prevState,
                        //     totalrecord: parseInt(e.key),
                        //     pagenumber: pageIndex,
                        //   }));
                        // }
                      }}
                    >
                      {pageSizeOptions.map((item) => {
                        return <Menu.Item key={item}>{item}</Menu.Item>;
                      })}
                    </Menu>
                  }
                >
                  <span>
                    {onboardPageSize}
                    <IoChevronDownOutline
                      style={{ paddingTop: "5px", fontSize: "16px" }}
                    />
                  </span>
                </Dropdown>
              </div>
            </div>
                      <button
                        type="submit"
                        className={TalentBackoutStyle.btnPrimary}
                        onClick={() => handleOnboardExport(onboardList)}
                      >
                        Export
                      </button>
                    </div>
                  </div>
                </div>
                {isLoading ? <TableSkeleton active /> :  <Table
                  scroll={{x:'1800px', y: "480px", }}
                  id="OnboardedListingTable"
                  columns={tableColumnsMemo}
                  bordered={false}
                  dataSource={onboardList}
                  pagination={{
                    onChange: (pageNum, onboardPageSize) => {
                      setonboardPageIndex(pageNum);
                      setonboardPageSize(onboardPageSize);
                    },
                    size: "small",
                    pageSize: onboardPageSize,
                    pageSizeOptions: pageSizeOptions,
                    total: onboardListDataCount,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} of ${onboardListDataCount} items`,
                    defaultCurrent: onboardPageIndex,
                  }}
                />}
               
                
              </>
            ),
          },
          {
            label: "Rejected",
            key: "Rejected",
            children: (
              <>
                <div className={TalentBackoutStyle.filterContainer}>
                  <div className={TalentBackoutStyle.filterSets}>
                    <div className={TalentBackoutStyle.filterRight}>
                      <div className={TalentBackoutStyle.searchFilterSet}>
                        <SearchSVG style={{ width: "16px", height: "16px" }} />
                        <input
                          type={InputType.TEXT}
                          className={TalentBackoutStyle.searchInput}
                          placeholder="Search Table"
                          value={rejectedDebounceText}
                          onChange={(e) => {
                            setrejectedSearchText(e.target.value);
                            setRejectedDebounceText(e.target.value);
                          }}
                        />
                        {rejectedDebounceText && (
                          <CloseSVG
                            style={{
                              width: "16px",
                              height: "16px",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              setrejectedSearchText("");
                              setRejectedDebounceText("");
                            }}
                          />
                        )}
                      </div>

                      <div className={TalentBackoutStyle.priorityFilterSet}>
              <div className={TalentBackoutStyle.label}>Showing</div>
              <div className={TalentBackoutStyle.paginationFilter}>
                <Dropdown
                  trigger={["click"]}
                  placement="bottom"
                  overlay={
                    <Menu
                      onClick={(e) => {
                        setrejectedPageSize(parseInt(e.key));
                        // if (pageSize !== parseInt(e.key)) {
                        //   setTableFilteredState((prevState) => ({
                        //     ...prevState,
                        //     totalrecord: parseInt(e.key),
                        //     pagenumber: pageIndex,
                        //   }));
                        // }
                      }}
                    >
                      {pageSizeOptions.map((item) => {
                        return <Menu.Item key={item}>{item}</Menu.Item>;
                      })}
                    </Menu>
                  }
                >
                  <span>
                    {rejectedPageSize}
                    <IoChevronDownOutline
                      style={{ paddingTop: "5px", fontSize: "16px" }}
                    />
                  </span>
                </Dropdown>
              </div>
            </div>
                      <button
                        type="submit"
                        className={TalentBackoutStyle.btnPrimary}
                        onClick={() => handleRejectExport(rejectedList)}
                      >
                        Export
                      </button>
                    </div>
                  </div>
                </div>
                {isLoading ? <TableSkeleton active /> : <Table
                  scroll={{ y: "480px" }}
                  id="rejectededListingTable"
                  columns={tableRejectedColumnsMemo}
                  bordered={false}
                  dataSource={rejectedList}
                  pagination={{
                    onChange: (pageNum, rejectedPageSize) => {
                      setrejectedPageIndex(pageNum);
                      setrejectedPageSize(rejectedPageSize);
                    },
                    size: "small",
                    pageSize: rejectedPageSize,
                    pageSizeOptions: pageSizeOptions,
                    total: rejectedListDataCount,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} of ${rejectedListDataCount} items`,
                    defaultCurrent: rejectedPageIndex,
                  }}
                />}
                
                
              </>
            ),
          },
        ]}
      />

      <Modal
        width="930px"
        centered
        footer={null}
        className="engagementAddFeedbackModal"
        open={showLeaves}
        onCancel={() => setshowLeaves(false)}
      >
        <>
          {leaveLoading ? (
            <Skeleton active />
          ) : (
            <Table
              scroll={{ y: "100vh" }}
              dataSource={leaveList ? leaveList : []}
              columns={leaveColumns}
              pagination={false}
            />
          )}
        </>
      </Modal>
    </div>
  );
}
