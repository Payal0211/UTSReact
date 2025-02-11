import React, { useEffect, useState, useCallback, useMemo,Suspense } from "react";
import TalentBackoutStyle from "./talentReport.module.css";
import onboardListStyle from '../revenueReport/revenue.module.css'
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
import { Modal, Skeleton, Table, Tabs, Tooltip, Dropdown , Menu, Radio } from "antd";
import { downloadToExcel } from "modules/report/reportUtils";
import LogoLoader from "shared/components/loader/logoLoader";
import { Link } from "react-router-dom";
import { ReactComponent as FunnelSVG } from "assets/svg/funnel.svg";
import moment from "moment";
import { IoChevronDownOutline } from "react-icons/io5";
import { amDashboardDAO } from "core/amdashboard/amDashboardDAO";
import OnboardFilerList from "modules/onBoardList/OnboardFilterList";
import { allEngagementConfig } from "modules/engagement/screens/engagementList/allEngagementConfig";

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

  const [filteredTagLength, setFilteredTagLength] = useState(0);
  const [getHTMLFilter, setHTMLFilter] = useState(false);
  const [isAllowFilters, setIsAllowFilters] = useState(false);
  const [dateTypeFilter, setDateTypeFilter] = useState(0);
  const [filtersList, setFiltersList] = useState({});
  var date = new Date();
  const [monthDate, setMonthDate] = useState(new Date());
  const [startDate, setStartDate] = useState(
    new Date(date.getFullYear(), date.getMonth() - 1, date.getDate())
  );
  const [endDate, setEndDate] = useState(new Date(date));
  const [appliedFilter, setAppliedFilters] = useState(new Map());
  const [checkedState, setCheckedState] = useState(new Map());
  const [tableFilteredState, setTableFilteredState] = useState({
    filterFields_OnBoard: {    
      amName: "",
      statusIds: "",
      tagIds: "",
    },
  });


  const getOnboardData = useCallback(
    async (psize, pInd) => {
      setIsLoading(true);
  
      let payload = {
        "pageIndex": onboardSearchText ? 1 : onboardPageIndex,
        "pageSize": onboardPageSize,
        "searchText":  onboardSearchText,
        "amIds": tableFilteredState.filterFields_OnBoard.amName,
        "statusIds": tableFilteredState.filterFields_OnBoard.statusIds,
        "tagIds": tableFilteredState.filterFields_OnBoard.tagIds,
        "month": dateTypeFilter === 0 ? +moment(monthDate).format("M") : 0,
        "year": dateTypeFilter === 0 ? +moment(monthDate).format("YYYY") : 0,
        "fromDate": dateTypeFilter === 1
                    ? moment(startDate).format(
                        "MM/DD/YYYY"
                      )
                    : "",
        "toDate": dateTypeFilter === 1
                    ? moment(endDate).format(
                        "MM/DD/YYYY"
                      )
                    : ""
      }

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
    [onboardPageIndex, onboardPageSize, onboardSearchText,monthDate,startDate,endDate,tableFilteredState]
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
  }, [onboardPageIndex, onboardSearchText, onboardPageSize,monthDate,startDate,endDate,tableFilteredState]);

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

  const getFilterList = async () =>{
    let result = await amDashboardDAO.getDeployedFiltersDAO()

    console.log('res',result)

    if(result.statusCode === HTTPStatusCode.OK){
      setFiltersList(result.responseBody.Data)
    }

  }

  useEffect(()=>{
    getFilterList()
  },[])

  const toggleHRFilter = useCallback(() => {
    !getHTMLFilter
      ? setIsAllowFilters(!isAllowFilters)
      : setTimeout(() => {
          setIsAllowFilters(!isAllowFilters);
        }, 300);
    setHTMLFilter(!getHTMLFilter);
  }, [getHTMLFilter, isAllowFilters]);

    const onMonthCalenderFilter = (date) => {
      console.log(date);
      setMonthDate(date);
      // setEndDate(end);
      // setEndDate(end);
      console.log(moment(date).format("M"), moment(date).format("YYYY"));
      if (date) {
        // console.log( month, year)
       
      }
    };

    const onCalenderFilter = (dates) => {
      const [start, end] = dates;
      setStartDate(start);
      setEndDate(end);
    };

    const onRemoveFilters = () => {
      setTimeout(() => {
        setIsAllowFilters(false);
      }, 300);
      setHTMLFilter(false);
    };

    const clearFilters = useCallback(() => {
      setAppliedFilters(new Map());
      setCheckedState(new Map());
      setFilteredTagLength(0);
      setDateTypeFilter(0);
      setTableFilteredState({
        filterFields_OnBoard: {    
          amName: "",
          statusIds: "",
          tagIds: "",
        },
      })
      setonboardSearchText("");
      setonboardDebounceText("");
      setMonthDate(new Date());
      setStartDate(
        new Date(date.getFullYear(), date.getMonth() - 1, date.getDate())
      );
      setEndDate(new Date(date));
    }, [   
      setFilteredTagLength,
    ]);

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
        title: "Talent ID",
        dataIndex: "talentUplersID",
        key: "talentUplersID",
        align: "left",
        width: "150px",
        
      },
      {
        title: "Talent",
        dataIndex: "name",
        key: "name",
        align: "left",
        width: "200px",
        
      },
      {
        title: "Talent Email",
        dataIndex: "emailID",
        key: "emailID",
        align: "left",
        width: "200px",
       
      },
      {
        title: "Company",
        dataIndex: "client",
        key: "client",
        align: "left",
        width: "200px",
      },
      {
        title: "Client",
        dataIndex: "clientEmail",
        key: "clientEmail",
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
      {
        title: "Remark",
        dataIndex: "remarks",
        key: "remarks",
        align: "left",
        width: "300px",
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
    const timer = setTimeout(() => setonboardSearchText(onboardDebounceText), 1000);
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
          if(val.title === "Engagement / HR #"){
            obj[`${val.title}`] = `${data[val.key]}/ ${data.hR_Number} `
          }else if(val.key === "lastWorkingDate"){
            obj[`Last Working date / Contract End Date`] = ` ${data.lastWorkingDate ? data.lastWorkingDate : "NA"} / ${data.contractEndDate ? data.contractEndDate : "NA"}`
          }else if(val.key === 'totalLeavesGiven'){
            obj['Paid Leaves / Leave Balance'] = `${data.totalLeavesGiven} / ${data.totalLeaveBalance}`
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

<div className={onboardListStyle.filterContainer}>
        <div className={onboardListStyle.filterSets}>
          <div className={onboardListStyle.filterSetsInner}>
           <div className={onboardListStyle.addFilter} onClick={toggleHRFilter}>
              <FunnelSVG style={{ width: "16px", height: "16px" }} />

              <div className={onboardListStyle.filterLabel}>Add Filters</div>
              <div className={onboardListStyle.filterCount}>{filteredTagLength}</div>
            </div>

            <div
              className={TalentBackoutStyle.searchFilterSet}
              style={{ marginLeft: "15px" }}
            >
              <SearchSVG style={{ width: "16px", height: "16px" }} />
              <input
                type={InputType.TEXT}
                className={onboardListStyle.searchInput}
                placeholder="Search Table"
                value={onboardDebounceText}
                onChange={(e) => {
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
                    setonboardDebounceText("");
                  }}
                />
              )}
            </div>
            <p onClick={() => clearFilters()}>Reset Filters</p>
          </div>
          <div className={onboardListStyle.filterRight}>
            <Radio.Group
              style={{ display: "flex", flexDirection: "column", gap: "5px" }}
              onChange={(e) => {
                setDateTypeFilter(e.target.value);
                setStartDate(
                  new Date(
                    date.getFullYear(),
                    date.getMonth() - 1,
                    date.getDate()
                  )
                );
                setEndDate(new Date(date));

            
           
              }}
              value={dateTypeFilter}
            >
              <Radio value={0}>Current Month</Radio>
              <Radio value={1}>Search With Date Range</Radio>
            </Radio.Group>

            {dateTypeFilter === 0 && (
              <div className={onboardListStyle.calendarFilterSet}>
                <div className={onboardListStyle.label}>Month-Year</div>
                <div className={onboardListStyle.calendarFilter}>
                  <CalenderSVG
                    style={{ height: "16px", marginRight: "16px" }}
                  />
                  <DatePicker
                    style={{ backgroundColor: "red" }}
                    onKeyDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className={onboardListStyle.dateFilter}
                    placeholderText="Month - Year"
                    selected={monthDate}
                    onChange={onMonthCalenderFilter}
                    // startDate={startDate}
                    // endDate={endDate}
                    dateFormat="MM-yyyy"
                    showMonthYearPicker
                  />
                </div>
              </div>
            )}
            {dateTypeFilter === 1 && (
              <div className={onboardListStyle.calendarFilterSet}>
                <div className={onboardListStyle.label}>Date</div>
                <div className={onboardListStyle.calendarFilter}>
                  <CalenderSVG
                    style={{ height: "16px", marginRight: "16px" }}
                  />
                  <DatePicker
                    style={{ backgroundColor: "red" }}
                    onKeyDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className={onboardListStyle.dateFilter}
                    placeholderText="Start date - End date"
                    selected={startDate}
                    onChange={onCalenderFilter}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                  />
                </div>
              </div>
            )}

            <div className={onboardListStyle.priorityFilterSet}>
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
              <div
                className={onboardListStyle.paginationFilter}
                style={{ border: "none", width: "auto" }}
              >
                <button
                  className={onboardListStyle.btnPrimary}
                  onClick={() => handleOnboardExport(onboardList)}
                >
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
             
                {isLoading ? <TableSkeleton active /> :  <Table
                  scroll={{x:'2600px', y: "480px", }}
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
                      <div className={onboardListStyle.searchFilterSet}>
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

<Suspense fallback={<div>Loading...</div>}>
          <OnboardFilerList
            setAppliedFilters={setAppliedFilters}
            appliedFilter={appliedFilter}
            setCheckedState={setCheckedState}
            checkedState={checkedState}
            // handleHRRequest={handleHRRequest}
            setTableFilteredState={setTableFilteredState}
            tableFilteredState={tableFilteredState}
            setFilteredTagLength={setFilteredTagLength}
            onRemoveHRFilters={() => onRemoveFilters()}
            getHTMLFilter={getHTMLFilter}
            // hrFilterList={allHRConfig.hrFilterListConfig()}
          
            filtersType={allEngagementConfig.deployedListFilterTypeConfig(
              filtersList && filtersList
            )}
            clearFilters={clearFilters}
          />
        </Suspense>

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
