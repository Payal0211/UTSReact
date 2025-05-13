import React, { useEffect, useMemo, useState, useCallback, Suspense } from "react";
import clientDashboardStyles from "./clientDashboard.module.css";
import { ReactComponent as SearchSVG } from "assets/svg/search.svg";
import { ReactComponent as CloseSVG } from "assets/svg/close.svg";
import { InputType } from "constants/application";
import { Tabs, Select, Table, Modal, Tooltip, Skeleton, message } from "antd";
import { ReportDAO } from "core/report/reportDAO";
import { downloadToExcel } from "modules/report/reportUtils";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import ClientReportStyle from "../clientReport/clientReport.module.css";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import DatePicker from "react-datepicker";
import { TaDashboardDAO } from "core/taDashboard/taDashboardDRO";
import { HTTPStatusCode } from "constants/network";
import UTSRoutes from "constants/routes";
import { useNavigate } from "react-router-dom";
import OnboardFilerList from "modules/onBoardList/OnboardFilterList";
import { ReactComponent as FunnelSVG } from "assets/svg/funnel.svg";
import { allHRConfig } from "modules/hiring request/screens/allHiringRequest/allHR.config";
import { allEngagementConfig } from "modules/engagement/screens/engagementList/allEngagementConfig";
import taStyles from "../../../../modules/taDashboard/tadashboard.module.css";
import { InterviewDAO } from "core/interview/interviewDAO";
import { useForm } from "react-hook-form";
import { All_Hiring_Request_Utils } from "shared/utils/all_hiring_request_util";
import { IconContext } from "react-icons";
import { BsClipboard2CheckFill } from "react-icons/bs";
import MoveToAssessment from "modules/hiring request/components/talentList/moveToAssessment";

export default function ClientDashboardReport() {  

  const navigate = useNavigate();  
  const [clientData, setClientData] = useState([]);
  const [isLoading, setLoading] = useState(false); 
  const [openTicketDebounceText, setopenTicketDebounceText] = useState("");
  const [openTicketSearchText, setopenTicketSearchText] = useState("");
  const today = new Date();

  const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(1);
  
  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(today);
  
  const [dateError, setDateError] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const pageSizeOptions = [100, 200, 300, 500, 1000, 5000];
  const [listDataCount, setListDataCount] = useState(0);
  const [filtersList, setFiltersList] = useState({});
  const [isAllowFilters, setIsAllowFilters] = useState(false);
  const [appliedFilter, setAppliedFilters] = useState(new Map());
  const [checkedState, setCheckedState] = useState(new Map());
  const [filteredTagLength, setFilteredTagLength] = useState(0);
  const [getHTMLFilter, setHTMLFilter] = useState(false);
  const [tableFilteredState, setTableFilteredState] = useState({
      filterFields_OnBoard: {
        taUserIDs: null,
    },
  });

  // New added state 

  const [showTalentProfiles, setShowTalentProfiles] = useState(false);
  const [profileInfo, setInfoforProfile] = useState({});
  const [hrTalentList, setHRTalentList] = useState([]);
  const [filteredTalentList, setFilteredTalentList] = useState(hrTalentList);
  const [hrTalentListFourCount, setHRTalentListFourCount] = useState([]);
  const [talentToMove, setTalentToMove] = useState({});
  const [profileStatusID, setProfileStatusID] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [loadingTalentProfile, setLoadingTalentProfile] = useState(false);
  const [isAddingNewTask, setAddingNewTask] = useState(false);
  const [saveRemarkLoading, setSaveRemarkLoading] = useState(false);
  const [moveToAssessment, setMoveToAssessment] = useState(false);
  
  const {
    register: remarkregiter,
    handleSubmit: remarkSubmit,
    resetField: resetRemarkField,
    clearErrors: clearRemarkError,
    formState: { errors: remarkError },
  } = useForm();

  const onRemoveHRFilters = () => {
    setTimeout(() => {
      setIsAllowFilters(false);
    }, 300);
    setHTMLFilter(false);
  };
    const ProfileColumns = [
      {
        title: "Submission Date",
        dataIndex: "profileSubmittedDate",
        key: "profileSubmittedDate",
      },
      {
        title: "Talent",
        dataIndex: "talent",
        key: "talent",
      },
      {
        title: "Status",
        dataIndex: "talentStatus",
        key: "talentStatus",
        render: (_, item) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {All_Hiring_Request_Utils.GETTALENTSTATUS(
              parseInt(item?.talentStatusColor),
              item?.talentStatus
            )}
  
            {(item?.statusID === 2 || item?.statusID === 3) && (
              <IconContext.Provider
                value={{
                  color: "#FFDA30",
                  style: { width: "16px", height: "16px", cursor: "pointer" },
                }}
              >
                <Tooltip title="Move to Assessment" placement="top">
                  <span                  
                    onClick={() => {
                      setMoveToAssessment(true);
                      setTalentToMove((prev) => ({ ...prev, ctpID: item.ctpid }));
                    }}
                    style={{ padding: "0" }}
                  >
                    {" "}
                    <BsClipboard2CheckFill />
                  </span>{" "}
                </Tooltip>
              </IconContext.Provider>
            )}
          
          </div>
        ),
      },
      {
        title: "Interview Detail",
        dataIndex: "talentStatusDetail",
        key: "talentStatusDetail",
      },
      {
        title: "Submitted By",
        dataIndex: "profileSubmittedBy",
        key: "profileSubmittedBy",
      },
    ];
  var date = new Date();

  const getTalentProfilesDetailsfromTable = async (
    result,
    statusID,
    stageID
  ) => {
    setShowTalentProfiles(true);
    setInfoforProfile(result);
    let pl = {
      hrID: result.hrid,
      statusID: statusID,
      stageID: statusID === 0 ? null : stageID ? stageID : 0,
    };
    setLoading(true);
    const hrResult = await TaDashboardDAO.getHRTalentDetailsRequestDAO(pl);
    setLoading(false);
    if (hrResult.statusCode === HTTPStatusCode.OK) {
      setHRTalentList(hrResult.responseBody);
      setFilteredTalentList(hrResult.responseBody);
      setHRTalentListFourCount(hrResult.responseBody);
    } else {
      setHRTalentList([]);
      setFilteredTalentList([]);

    }
  };

  const handleSearchInput = (value) => {
    setSearchTerm(value); // Update search term
    const filteredData = hrTalentList.filter((talent) =>
      talent.talent.toLowerCase().includes(value.toLowerCase()) || // Check in 'talent' column
      (talent.email && talent.email.toLowerCase().includes(value.toLowerCase())) // Check in 'email' column (if email exists)
    );
    setFilteredTalentList(filteredData); // Update the filtered list
  };

  const saveRemark = async (d) => {
      let pl = {
        HiringRequestId: talentToMove?.hiringRequest_ID,
        CtpId: talentToMove?.ctpID,
        TalentId: talentToMove?.tA_UserID,
        Remark: d.remark,
      };
  
      setSaveRemarkLoading(true);
      const result = await InterviewDAO.updateTalentAssessmentDAO(pl);
      setSaveRemarkLoading(false);
      if (result.statusCode === HTTPStatusCode.OK) {
        setMoveToAssessment(false);
        resetRemarkField("remark");
        clearRemarkError("remark");
        getTalentProfilesDetailsfromTable(talentToMove, profileStatusID);
      } else {
        message.error("Something went wrong");
      }
    };

  const tableColumnsMemo = useMemo(() => {
    return [
        {
            title: "Client",
            dataIndex: "client",
            key: "client",
            align: "left",
            width: "200px",
            fixed: "left",
            render: (text, result) => {
                // Check if the value is 'Total', if so return empty string, else return a link
                return text === "Total" 
                  ? "" 
                  : <a href={`/viewCompanyDetails/${result.companyID}`} style={{textDecoration:'underline'}} target="_blank" rel="noreferrer">{text}</a>;  // Replace `/client/${text}` with the appropriate link you need
              },
          },
          
      {
        title: "HR ID",
        dataIndex: "hrNumber",
        key: "hrNumber",
        align: "left",
        width: "180px",
        fixed: "left",
        render: (text, result) => {
            // Check if the HR ID is not empty and return a link
            return text 
              ? <a href={`/allhiringrequest/${result.hrid}`} style={{textDecoration:'underline'}} target="_blank" rel="noreferrer">{text}</a>  // Replace `/hr/${text}` with the appropriate link you need
              : text;
          },
      },
      {
        title: "Recruiter",
        dataIndex: "recruiter",
        key: "recruiter",
        align: "left",
        width: "150px",
         fixed: "left",
      },
     
      {
        title: "Total Profiles",
        dataIndex: "totalProfiles",
        key: "totalProfiles",
        align: "center",
        width: "130px",
        // render: (value) => (value === 0 ? '-' : value),
        render: (text, result) => {
          return +text > 0 ? (
            <p
              style={{
                color: "blue",
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result, 0);
                setTalentToMove(result);
                setProfileStatusID(0);
                setHRTalentListFourCount([]);
              }}
            >
              {text}
            </p>
          ) : (
            text
          );
        },
      },
      {
        title: "Profiles",
        dataIndex: "profiles",
        key: "profiles",
        align: "center",
        width: "100px",
        // render: (value) => (value === 0 ? '-' : value),
        render: (text, result) => {
          return +text > 0 ? (
            <p
              style={{
                color: "blue",
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result, 0);
                setTalentToMove(result);
                setProfileStatusID(0);
                setHRTalentListFourCount([]);
              }}
            >
              {text}
            </p>
          ) : (
            text
          );
        },
      },
      {
        title: "Screen Reject",
        dataIndex: "screenReject",
        key: "screenReject",
        align: "center",
        width: "130px",
        // render: (value) => (value === 0 ? '-' : value),
        render: (text, result) => {
          return +text > 0 ? (
            <p
              style={{
                color: "blue",
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result, 0);
                setTalentToMove(result);
                setProfileStatusID(0);
                setHRTalentListFourCount([]);
              }}
            >
              {text}
            </p>
          ) : (
            text
          );
        },
      },
      {
        title: "Assessment",
        dataIndex: "assessment",
        key: "assessment",
        align: "center",
        width: "120px",
        // render: (value) => (value === 0 ? '-' : value),
        render: (text, result) => {
          return +text > 0 ? (
            <p
              style={{
                color: "blue",
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result, 0);
                setTalentToMove(result);
                setProfileStatusID(0);
                setHRTalentListFourCount([]);
              }}
            >
              {text}
            </p>
          ) : (
            text
          );
        },
      },
      {
        title: "Interviews Done",
        dataIndex: "interviewsDone",
        key: "interviewsDone",
        align: "center",
        width: "140px",
        // render: (value) => (value === 0 ? '-' : value),
        render: (text, result) => {
          return +text > 0 ? (
            <p
              style={{
                color: "blue",
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result, 0);
                setTalentToMove(result);
                setProfileStatusID(0);
                setHRTalentListFourCount([]);
              }}
            >
              {text}
            </p>
          ) : (
            text
          );
        },
      },
      {
        title: "R1 Interview",
        dataIndex: "r1Interview",
        key: "r1Interview",
        align: "center",
        width: "120px",
        // render: (value) => (value === 0 ? '-' : value),
        render: (text, result) => {
          return +text > 0 ? (
            <p
              style={{
                color: "blue",
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result, 0);
                setTalentToMove(result);
                setProfileStatusID(0);
                setHRTalentListFourCount([]);
              }}
            >
              {text}
            </p>
          ) : (
            text
          );
        },
      },
      {
        title: "R1 Reject",
        dataIndex: "r1InterviewReject",
        key: "r1InterviewReject",
        align: "center",
        width: "100px",
        // render: (value) => (value === 0 ? '-' : value),
        render: (text, result) => {
          return +text > 0 ? (
            <p
              style={{
                color: "blue",
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result, 0);
                setTalentToMove(result);
                setProfileStatusID(0);
                setHRTalentListFourCount([]);
              }}
            >
              {text}
            </p>
          ) : (
            text
          );
        },
      },
      {
        title: "R2 Interview",
        dataIndex: "r2Interview",
        key: "r2Interview",
        align: "center",
        width: "120px",
        render: (value) => (value === 0 ? '-' : value),
      },
      {
        title: "R2 Reject",
        dataIndex: "r2InterviewReject",
        key: "r2InterviewReject",
        align: "center",
        width: "100px",
        render: (value) => (value === 0 ? '-' : value),
      },
      {
        title: "R3 Interview",
        dataIndex: "r3Interview",
        key: "r3Interview",
        align: "center",
        width: "120px",
        render: (value) => (value === 0 ? '-' : value),
      },
      {
        title: "R3 Reject",
        dataIndex: "r3InterviewReject",
        key: "r3InterviewReject",
        align: "center",
        width: "100px",
        render: (value) => (value === 0 ? '-' : value),
      },
      {
        title: "Offer",
        dataIndex: "offer",
        key: "offer",
        align: "center",
        width: "100px",
        render: (value) => (value === 0 ? '-' : value),
      },
      {
        title: "Offer Declined",
        dataIndex: "offerDeclined",
        key: "offerDeclined",
        align: "center",
        width: "140px",
        render: (value) => (value === 0 ? '-' : value),
      },
      {
        title: "Pre-Onboarding",
        dataIndex: "preOnboarding",
        key: "preOnboarding",
        align: "center",
        width: "140px",
        render: (value) => (value === 0 ? '-' : value),
      },
      {
        title: "Joined",
        dataIndex: "joined",
        key: "joined",
        align: "center",
        width: "100px",
        render: (value) => (value === 0 ? '-' : value),
      },
      {
        title: "Joined & Left",
        dataIndex: "joinedandLeft",
        key: "joinedandLeft",
        align: "center",
        width: "140px",
        render: (value) => (value === 0 ? '-' : value),
      },
      {
        title: "Position Lost",
        dataIndex: "positionLost",
        key: "positionLost",
        align: "center",
        width: "130px",
        render: (value) => (value === 0 ? '-' : value),
      },
      {
        title: "On Hold",
        dataIndex: "onHold",
        key: "onHold",
        align: "center",
        width: "100px",
        render: (value) => (value === 0 ? '-' : value),
      },
      {
        title: "AI Interview",
        dataIndex: "aiInterview",
        key: "aiInterview",
        align: "center",
        width: "120px",
        render: (value) => (value === 0 ? '-' : value),
      },
      {
        title: "Duplicate",
        dataIndex: "duplicate",
        key: "duplicate",
        align: "center",
        width: "100px",
        render: (value) => (value === 0 ? '-' : value),
      },
    ];
  }, [clientData]);
  

  const getClientDashboardReport = async () => {
    let payload = {
        "searchText": openTicketSearchText,
        "fromDate": startDate.toLocaleDateString("en-US"),
        "toDate": endDate.toLocaleDateString("en-US"),
        "pageIndex": pageIndex,
        "pageSize": pageSize,
        "taUserIDs":tableFilteredState?.filterFields_OnBoard?.taUserIDs,
      };
    setLoading(true)
    const apiResult = await ReportDAO.getClientDashboardReportDAO(payload);
    setLoading(false)
    if (apiResult?.statusCode === 200) {        
      setClientData(apiResult.responseBody?.rows);      
        setListDataCount(apiResult.responseBody?.totalrows);      
    } else if (apiResult?.statusCode === 404) {
        setClientData([]);
        setListDataCount(0);     
    }
  }; 

  const getTalentProfilesDetails = async (result, statusID, stageID) => {
      setShowTalentProfiles(true);
      setInfoforProfile(result);
      let pl = {
        hrID: result?.hrid,
        statusID: statusID,
        stageID: statusID === 0 ? null : stageID ? stageID : 0,
      };
      setLoading(true);
      const hrResult = await TaDashboardDAO.getHRTalentDetailsRequestDAO(pl);
      setLoading(false);
      if (hrResult.statusCode === HTTPStatusCode.OK) {
        setHRTalentList(hrResult.responseBody);
        setFilteredTalentList(hrResult.responseBody);  
      } else {
        setHRTalentList([]);
        setFilteredTalentList([]);
  
      }
    };


  const onCalenderFilter = useCallback(
    async (dates) => {
      const [start, end] = dates;

      setStartDate(start);
      setEndDate(end);

      if (start.toLocaleDateString() === end.toLocaleDateString()) {
        let params = {
          fromDate: new Date(
            date.getFullYear(),
            date.getMonth() - 1,
            date.getDate()
          ),
          toDate: new Date(date),
        };
        setStartDate(params.fromDate);
        setEndDate(params.toDate);
        setDateError(true);
        setTimeout(() => setDateError(false), 5000);
        return;
      } else {
        if (start && end) {  
            let payload = {
                "searchText": openTicketSearchText,
                "fromDate": start.toLocaleDateString("en-US"),
                "toDate": end.toLocaleDateString("en-US"),
                "pageIndex": 1,
                "pageSize": pageSize,
              };
              setPageIndex(1);
            setLoading(true)
            const apiResult = await ReportDAO.getClientDashboardReportDAO(payload);
            setLoading(false)

            if (apiResult?.statusCode === 200) {        
                setClientData(apiResult.responseBody?.rows);       
                setListDataCount(apiResult.responseBody?.totalrows);      
            } else if (apiResult?.statusCode === 404) {
                setClientData([]);
                setListDataCount(0);     
            }
        }
      }
    },
    [openTicketSearchText,pageSize]
  );

  useEffect(() => {
    getClientDashboardReport();
  }, [pageIndex, pageSize, openTicketSearchText,tableFilteredState]);


  useEffect(() => {
    const timer = setTimeout(
      () => {
        setPageIndex(1)
        setopenTicketSearchText(openTicketDebounceText)},
      1000
    );
    return () => clearTimeout(timer);
  }, [openTicketDebounceText]);


  const getFilters = async () => {
    setLoading(true);
    let filterResult = await TaDashboardDAO.getAllMasterDAO('CR');
    setLoading(false);
    if (filterResult.statusCode === HTTPStatusCode.OK) {
      setFiltersList(filterResult && filterResult?.responseBody);
    } else if (filterResult?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
      return navigate(UTSRoutes.LOGINROUTE);
    } else if (
      filterResult?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
    ) {
      return navigate(UTSRoutes.SOMETHINGWENTWRONG);
    } else {
      return "NO DATA FOUND";
    }
  };

  useEffect(()=>{
    getFilters()
  },[]);

 const toggleHRFilter = useCallback(() => {
      !getHTMLFilter
        ? setIsAllowFilters(!isAllowFilters)
        : setTimeout(() => {
            setIsAllowFilters(!isAllowFilters);
          }, 300);
      setHTMLFilter(!getHTMLFilter);
    }, [getHTMLFilter, isAllowFilters]);

  const clearFilters = () =>{
    setAppliedFilters(new Map());
      setCheckedState(new Map());
      setFilteredTagLength(0);
      setTableFilteredState({
        filterFields_OnBoard: {
          taUserIDs: null,
        },
      }); 
      setopenTicketSearchText("");
      setopenTicketDebounceText("");  
      setStartDate(firstDayOfMonth);
      setEndDate(today);  
  }

  return (
    <div className={clientDashboardStyles.hiringRequestContainer}>
      
      <div className={clientDashboardStyles.addnewHR} style={{ margin: "0" }}>
        <div className={clientDashboardStyles.hiringRequest}>Client Dashboard</div>
      </div>

      <div className={clientDashboardStyles.filterContainer}>
        <div className={clientDashboardStyles.filterSets}>
        <div className={clientDashboardStyles.filterSetsInner}>
                    <div className={clientDashboardStyles.addFilter} onClick={toggleHRFilter}>
                      <FunnelSVG style={{ width: "16px", height: "16px" }} />
        
                      <div className={clientDashboardStyles.filterLabel}> Add Filters</div>
                      <div className={clientDashboardStyles.filterCount}>{filteredTagLength}</div>
                    </div>       

                    <div className={clientDashboardStyles.searchFilterSet} style={{marginLeft:'10px'}}>
                      <SearchSVG style={{ width: "16px", height: "16px" }} />
                      <input
                        type={InputType.TEXT}
                        className={clientDashboardStyles.searchInput}
                        placeholder="Client, HR ID, Recruiter"
                        value={openTicketDebounceText}
                        onChange={(e) => {
                          // setopenTicketSearchText(e.target.value);
                          setopenTicketDebounceText(e.target.value);
                        }}
                      />
                      {openTicketDebounceText && (
                        <CloseSVG
                          style={{
                            width: "16px",
                            height: "16px",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            //   setopenTicketSearchText("");
                            setopenTicketDebounceText("");
                          }}
                        />
                      )}
                    </div>

                    <p
                      className={clientDashboardStyles.resetText}
                      style={{ width: "190px" }}
                      onClick={() => {
                        clearFilters();
                      }}
                    >
                      Reset Filter
                    </p>
                 
                 

                </div>
                <div className={ClientReportStyle.calendarFilter}>              
                  <CalenderSVG style={{ height: "16px", marginRight: "16px" }} />
                  <DatePicker
                    style={{ backgroundColor: "red" }}
                    onKeyDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className={ClientReportStyle.dateFilter}
                    placeholderText="Start date - End date"
                    selected={startDate}
                    onChange={onCalenderFilter}
                    startDate={startDate}
                    endDate={endDate}
                    maxDate={new Date()}
                    selectsRange
                  />
                </div>
        </div>
      </div>

      {isLoading ? <TableSkeleton /> :
        <Table
        scroll={{ y: "480px" }}
        id="TicketsOpenListingTable"
        columns={tableColumnsMemo}
        bordered={false}
        dataSource={clientData}   
        rowKey={(record, index) => index}
        rowClassName={(row, index) => {
            return row.client === 'Total' ? clientDashboardStyles["highlight-total-row"] : '';
          }}   

          pagination={{
            onChange: (pageNum, pageSize) => {
              setPageIndex(pageNum);
              setPageSize(pageSize - 1);
              // getInvoiceTicketsFromPagination(pageNum, pageSize);
            },
            size: "small",
            pageSize: pageSize + 1,
            pageSizeOptions: pageSizeOptions,
            total: listDataCount,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${listDataCount} items`,
            current: pageIndex,
          }}  
      />
      }

{isAllowFilters && (
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
                  onRemoveHRFilters={() => onRemoveHRFilters()}
                  getHTMLFilter={getHTMLFilter}
                  hrFilterList={allHRConfig.hrFilterListConfig()}
                  filtersType={allEngagementConfig.recruiterReportFilterTypeConfig(
                    filtersList && filtersList
                  )}
                  clearFilters={clearFilters}
                />
              </Suspense>
            )}


              {showTalentProfiles && (
                    <Modal
                      transitionName=""
                      width="1000px"
                      centered
                      footer={null}
                      open={showTalentProfiles}
                      // className={allEngagementStyles.engagementModalContainer}
                      className="engagementModalStyle"
                      // onOk={() => setVersantModal(false)}
                      onCancel={() => {
                        setSearchTerm('')
                        setShowTalentProfiles(false);
                        setHRTalentListFourCount([]);
                      }}
                    >
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
                            Profiles for <strong>{profileInfo?.hrNumber}</strong>
                          </h3>
            
                          <p style={{ marginBottom: "0.5em" }}>
                            Company : <strong>{profileInfo?.companyName}</strong>
                          </p>
            
                          <p style={{ marginBottom: "0.5em" }}>
                            TA : <strong>{profileInfo?.taName}</strong>
                          </p>
            
                          <input
                            type="text"
                            placeholder="Search talent..."
                            value={searchTerm}
                            onChange={(e) => handleSearchInput(e.target.value)} // Create this function
                            style={{
                              padding: "6px 10px",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              marginLeft: "auto", // optional: pushes search to right
                              minWidth: "220px",
                            }}
                          />
                        </div>
            
            
                        <div
                          style={{
                            padding: "10px 15px",
                            display: "flex",
                            gap: "10px",
                            alignItems: "center",
                          }}
                        >
                          <div
                            className={taStyles.filterType}
                            key={"Total Talents"}
                            onClick={() => {
                              getTalentProfilesDetails(profileInfo, 0);
                              setProfileStatusID(0);
                            }}
                            style={{
                              borderBottom:
                                profileStatusID === 0 ? "6px solid #FFDA30" : "",
                            }}
                          >
                            {/* <img src={FeedBack} alt="rocket" /> */}
                            <h2>
                              Total Talents :{" "}
                              <span>
                                {hrTalentListFourCount[0]?.totalTalents
                                  ? hrTalentListFourCount[0]?.totalTalents
                                  : 0}
                              </span>
                            </h2>
                          </div>
                          <div
                            className={taStyles.filterType}
                            key={"Profile shared"}
                            onClick={() => {
                              console.log(profileInfo,"profileInfo");                              
                              getTalentProfilesDetails(profileInfo, 2);
                              setProfileStatusID(2);
                            }}
                            style={{
                              borderBottom:
                                profileStatusID === 2 ? "6px solid #FFDA30" : "",
                            }}
                          >
                            {/* <img src={FeedBack} alt="rocket" /> */}
                            <h2>
                              Profile shared :{" "}
                              <span>
                                {hrTalentListFourCount[0]?.profileSharedCount
                                  ? hrTalentListFourCount[0]?.profileSharedCount
                                  : 0}
                              </span>
                            </h2>
                          </div>
                          <div
                            className={taStyles.filterType}
                            key={"In Assessment"}
                            onClick={() => {
                              getTalentProfilesDetails(profileInfo, 11);
                              setProfileStatusID(11);
                            }}
                            style={{
                              borderBottom:
                                profileStatusID === 11 ? "6px solid #FFDA30" : "",
                            }}
                          >
                            {/* <img src={FeedBack} alt="rocket" /> */}
                            <h2>
                              In Assessment :{" "}
                              <span>
                                {hrTalentListFourCount[0]?.assessmentCount
                                  ? hrTalentListFourCount[0]?.assessmentCount
                                  : 0}
                              </span>
                            </h2>
                          </div>
                          <div
                            className={taStyles.filterType}
                            key={"In Interview"}
                            onClick={() => {
                              getTalentProfilesDetails(profileInfo, 3);
                              setProfileStatusID(3);
                            }}
                            style={{
                              borderBottom:
                                profileStatusID === 3 ? "6px solid #FFDA30" : "",
                            }}
                          >
                            {/* <img src={FeedBack} alt="rocket" /> */}
                            <h2>
                              In Interview :{" "}
                              <span>
                                {hrTalentListFourCount[0]?.inInterviewCount
                                  ? hrTalentListFourCount[0]?.inInterviewCount
                                  : 0}
                              </span>
                            </h2>
                          </div>
                          <div
                            className={taStyles.filterType}
                            key={"Offered"}
                            onClick={() => {
                              getTalentProfilesDetails(profileInfo, 4);
                              setProfileStatusID(4);
                            }}
                            style={{
                              borderBottom:
                                profileStatusID === 4 ? "6px solid #FFDA30" : "",
                            }}
                          >
                            {/* <img src={FeedBack} alt="rocket" /> */}
                            <h2>
                              Offered :{" "}
                              <span>
                                {hrTalentListFourCount[0]?.offeredCount
                                  ? hrTalentListFourCount[0]?.offeredCount
                                  : 0}
                              </span>
                            </h2>
                          </div>
                          <div
                            className={taStyles.filterType}
                            key={"Hired"}
                            onClick={() => {
                              getTalentProfilesDetails(profileInfo, 10);
                              setProfileStatusID(10);
                            }}
                            style={{
                              borderBottom:
                                profileStatusID === 10 ? "6px solid #FFDA30" : "",
                            }}
                          >
                            {/* <img src={FeedBack} alt="rocket" /> */}
                            <h2>
                              Hired :{" "}
                              <span>
                                {hrTalentListFourCount[0]?.hiredCount
                                  ? hrTalentListFourCount[0]?.hiredCount
                                  : 0}
                              </span>
                            </h2>
                          </div>
                          <div
                            className={taStyles.filterType}
                            key={"Rejected, screening"}
                            onClick={() => {
                              getTalentProfilesDetails(profileInfo, 7, 1);
                              setProfileStatusID(71);
                            }}
                            style={{
                              borderBottom:
                                profileStatusID === 71 ? "6px solid #FFDA30" : "",
                            }}
                          >
                            {/* <img src={FeedBack} alt="rocket" /> */}
                            <h2>
                              Screen Reject :{" "}
                              <span>
                                {hrTalentListFourCount[0]?.screeningRejectCount
                                  ? hrTalentListFourCount[0]?.screeningRejectCount
                                  : 0}
                              </span>
                            </h2>
                          </div>
                          <div
                            className={taStyles.filterType}
                            key={"Rejected, Interview"}
                            onClick={() => {
                              getTalentProfilesDetails(profileInfo, 7, 2);
                              setProfileStatusID(72);
                            }}
                            style={{
                              borderBottom:
                                profileStatusID === 72 ? "6px solid #FFDA30" : "",
                            }}
                          >
                            {/* <img src={FeedBack} alt="rocket" /> */}
                            <h2>
                              Interview Reject :{" "}
                              <span>
                                {hrTalentListFourCount[0]?.interviewRejectCount
                                  ? hrTalentListFourCount[0]?.interviewRejectCount
                                  : 0}
                              </span>
                            </h2>
                          </div>
                        </div>
            
                        {loadingTalentProfile ? (
                          <div>
                            <Skeleton active />
                          </div>
                        ) : (
                          <div style={{ margin: "5px 10px" }}>
                            <Table
                              dataSource={filteredTalentList}
                              columns={ProfileColumns}
                              // bordered
                              pagination={false}
                            />
                          </div>
                        )}
            
                        {moveToAssessment && (
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
                        )}
            
                        <div style={{ padding: "10px 0" }}>
                          <button
                            className={taStyles.btnCancle}
                            disabled={isAddingNewTask}
                            onClick={() => {
                              setSearchTerm('')
                              setShowTalentProfiles(false);
                              setHRTalentListFourCount([]);
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    </Modal>
                  )}
    </div>
  );
}
