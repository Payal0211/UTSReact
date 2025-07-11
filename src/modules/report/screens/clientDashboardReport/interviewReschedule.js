import React, { useEffect, useMemo, useState, useCallback, Suspense } from "react";
import clientDashboardStyles from "./clientDashboard.module.css";
import { ReactComponent as SearchSVG } from "assets/svg/search.svg";
import { ReactComponent as CloseSVG } from "assets/svg/close.svg";
import { InputType } from "constants/application";
import { Tabs, Select, Table, Modal, Tooltip, Skeleton, message, Dropdown, Menu, Spin } from "antd";
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
import MoveToAssessment from "modules/hiring request/components/talentList/moveToAssessment";
import moment from "moment";


export default function InterviewReschedule() {  

  const navigate = useNavigate();  
  const [clientData, setClientData] = useState([]);
  const [isLoading, setLoading] = useState(false); 
  const [isModalLoading, setIsModalLoading] = useState(false); 
  const [openTicketDebounceText, setopenTicketDebounceText] = useState("");
  const [openTicketSearchText, setopenTicketSearchText] = useState("");
  const today = new Date();
  const [dateTypeFilter, setDateTypeFilter] = useState(0);

  const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(1);
  
  const [monthDate, setMonthDate] = useState(today);  
  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(today);
  
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
        title: "Action Date",
        dataIndex: "actionDate",
        key: "actionDate",
         width: "150px",
        render:(text)=>{
          return text
        }
      },  {
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
        render:(text,value)=>{
           return <a href={`/allhiringrequest/${value.hiringRequestID}`} style={{textDecoration:'underline'}} target="_blank" rel="noreferrer">{text}</a>;  // Replace `/client/${text}` with the appropriate link you need
           
        }
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
        title: "Slot/Remark",
        dataIndex: "slotOrRemarkDetails",
        key: "slotOrRemarkDetails",
      },     
    ];
  var date = new Date();

  const getTalentProfilesDetailsfromTable = async (
    result,
    optiontype
  ) => {
    setShowTalentProfiles(true);
    setInfoforProfile(result);
    let pl = {
      tAUserID:result.userID,
      optiontype:optiontype,
       "month":dateTypeFilter === 2 ? 0 : dateTypeFilter === 0 ? +moment(monthDate).format("M") : 0,
        "year": dateTypeFilter === 2 ? 0 : dateTypeFilter === 0 ? +moment(monthDate).format("YYYY") : 0,
        "fromDate": dateTypeFilter === 2 ? '' : dateTypeFilter === 1 ? startDate.toLocaleDateString("en-US"): '',
        "toDate": dateTypeFilter === 2 ? '' : dateTypeFilter === 1 ? endDate.toLocaleDateString("en-US"): '' ,
    };
    setLoadingTalentProfile(true);
    const hrResult = await TaDashboardDAO.getHRTalentsWiseRecruiterDashboardDAO(pl);
    setLoadingTalentProfile(false);
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
    setSearchTerm(value); 
    const filteredData = hrTalentList.filter((talent) =>
      talent.talent.toLowerCase().includes(value.toLowerCase()) || 
      (talent.email && talent.email.toLowerCase().includes(value.toLowerCase())) 
    );
    setFilteredTalentList(filteredData); 
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

  function groupByRowSpan(data, groupField) {
    const grouped = {};

    // Step 1: Group by the field (e.g., 'ta')
    data.forEach((item) => {
      const key = item[groupField];
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });

    // Step 2: Add rowSpan metadata
    const finalData = [];
    Object.entries(grouped).forEach(([key, rows]) => {
      rows.forEach((row, index) => {
        finalData.push({
          ...row,
          rowSpan: index === 0 ? rows.length : 0,
        });
      });
    });

    return finalData;
  }

  const tableColumnsMemo = useMemo(() => {
    return [
        {
            title: "Recruiter Head",
            dataIndex: "recruiterHead",
            key: "recruiterHead",
            align: "left",
            width: "160px",
            fixed: "left",
            render: (text,row, index) => {
             if( row.recruiter === 'Total'){return ''} 
               return { props: {
              rowSpan: row.rowSpan,
              style: { verticalAlign: "top" }, // This aligns the merged cell content to the top
            },
          children: text}
              },
          },
        {
            title: "Recruiter",
            dataIndex: "recruiter",
            key: "recruiter",
            align: "left",
            width: "150px",
            fixed: "left",
            render: (text, result) => {
                return text === "Total" 
                  ? "" 
                  : text
              },
          },
          
     

      {
        title: "R1 Interview",
        dataIndex: "r1Interview",
        key: "r1Interview",
        align: "center",
        width: "120px",
        render: (text, result) => {
         if (result.recruiter === 'Total') {
            return <p
              style={{
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result, 'T_R1');
              }}
            >
              {result.total_R1Interview ? result.total_R1Interview : ''}
            </p>
          }
          return +text > 0 ? (
            <p
              style={{
                color: "blue",
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result,'R1');
             
              }}
            >
              {text ? text : ''}
            </p>
          ) : (
            text ? text : ''
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
          if (result.recruiter === 'Total') {
            return <p
              style={{
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result, 'T_R1R');
              }}
            >
              {result.total_R1InterviewReject ? result.total_R1InterviewReject : ''}
            </p>
          }
          return +text > 0 ? (
            <p
              style={{
                color: "blue",
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result,'R1R');
             
              }}
            >
              {text ? text : ''}
            </p>
          ) : (
            text ? text : ''
          );
        },
      },
      {
        title: "R2 Interview",
        dataIndex: "r2Interview",
        key: "r2Interview",
        align: "center",
       width: "120px",
        render: (text, result) => {
           if (result.recruiter === 'Total') {
            return <p
              style={{
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result, 'T_R2');
              }}
            >
              {result.total_R2Interview ? result.total_R2Interview : ''}
            </p>
          }
          return +text > 0 ? (
            <p
              style={{
                color: "blue",
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result,'R2');
             
              }}
            >
              {text ? text : ''}
            </p>
          ) : (
            text ? text : ''
          );
        } 
      },
      {
        title: "R2 Reject",
        dataIndex: "r2InterviewReject",
        key: "r2InterviewReject",
        align: "center",
        width: "100px",
        render: (text, result) => {
          if (result.recruiter === 'Total') {
            return <p
              style={{
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result, 'T_R2R');
              }}
            >
              {result.total_R2InterviewReject ? result.total_R2InterviewReject : ''}
            </p>
          }
          return +text > 0 ? (
            <p
              style={{
                color: "blue",
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result,'R2R');
             
              }}
            >
              {text ? text : ''}
            </p>
          ) : (
            text ? text : ''
          );
        } 
      },
      {
        title: "R3 Interview",
        dataIndex: "r3Interview",
        key: "r3Interview",
        align: "center",
        width: "120px",
        render: (text, result) => {
           if (result.recruiter === 'Total') {
            return <p
              style={{
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result, 'T_R3');
              }}
            >
              {result.total_R3Interview ? result.total_R3Interview : ''}
            </p>
          }
          return +text > 0 ? (
            <p
              style={{
                color: "blue",
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result,'R3');
             
              }}
            >
              {text ? text : ''}
            </p>
          ) : (
            text ? text : ''
          );
        } 
      },
      {
        title: "R3 Reject",
        dataIndex: "r3InterviewReject",
        key: "r3InterviewReject",
        align: "center",
        width: "100px",
       render: (text, result) => {
           if (result.recruiter === 'Total') {
            return <p
              style={{
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result, 'T_R3R');
              }}
            >
              {result.total_R3InterviewReject ? result.total_R3InterviewReject : ''}
            </p>
          }
          return +text > 0 ? (
            <p
              style={{
                color: "blue",
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result,'R3R');
             
              }}
            >
              {text ? text : ''}
            </p>
          ) : (
            text ? text : ''
          );
        } 
      },
     
    ];
  }, [clientData]);
  

  const getDashboardReport = async () => {
    let payload = {
        "searchText": openTicketSearchText,
        "month":dateTypeFilter === 2 ? 0 : dateTypeFilter === 0 ? +moment(monthDate).format("M") : 0,
        "year": dateTypeFilter === 2 ? 0 : dateTypeFilter === 0 ? +moment(monthDate).format("YYYY") : 0,
        "fromDate": dateTypeFilter === 2 ? '' : dateTypeFilter === 1 ? startDate.toLocaleDateString("en-US"): '',
        "toDate": dateTypeFilter === 2 ? '' : dateTypeFilter === 1 ? endDate.toLocaleDateString("en-US"): '' ,
        "taUserIDs":tableFilteredState?.filterFields_OnBoard?.taUserIDs   ??''     
      };
    setLoading(true)
    const apiResult = await ReportDAO.getInterviewRescheduleDashboardReportDAO(payload);
    setLoading(false)
    if (apiResult?.statusCode === 200) {        
      setClientData(groupByRowSpan(apiResult.responseBody, "recruiterHead") );      
    //   setListDataCount(apiResult.responseBody?.totalrows);      
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
      setIsModalLoading(true);
      setLoadingTalentProfile(true);
      const hrResult = await TaDashboardDAO.getHRTalentDetailsRequestDAO(pl);
      setIsModalLoading(false);
      setLoadingTalentProfile(false);
      if (hrResult.statusCode === HTTPStatusCode.OK) {
        setHRTalentList(hrResult.responseBody);
        setFilteredTalentList(hrResult.responseBody);  
      } else {
        setHRTalentList([]);
        setFilteredTalentList([]);
  
      }
    };

  const onCalenderFilter = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);   
  };

  useEffect(() => {
    getDashboardReport();
  }, [pageIndex, pageSize, openTicketSearchText,tableFilteredState,monthDate,startDate,endDate]);


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
      setDateTypeFilter(0);
  }
  const handleExport = (apiData) => {
      let DataToExport =  apiData.map(data => {
          let obj = {}
          tableColumnsMemo.forEach(val => {  
            if(val.key ==='screenReject')  {
              obj[`Scree Reject`] = data[`${val.key}`]            
            } else if(val.key ==='noofInterviews')  {
              obj[`Interviews Done`] = data[`${val.key}`]  
            } else{
              obj[`${val.title}`] = data[`${val.key}`]   
            }
              
          })
          return obj;
        }
      )
      downloadToExcel(DataToExport,'Recruiter_Dashboard_Report.xlsx')  
  }

  return (
    <div className={clientDashboardStyles.hiringRequestContainer}>
      
      <div className={clientDashboardStyles.addnewHR} style={{ margin: "0" }}>
        <div className={clientDashboardStyles.hiringRequest}>Interview Reschedule</div>
      </div>

      <div className={clientDashboardStyles.filterContainer}>
        <div className={clientDashboardStyles.filterSets}>
        <div className={clientDashboardStyles.filterSetsInner}>
                    <div className={clientDashboardStyles.addFilter} onClick={toggleHRFilter}>
                      <FunnelSVG style={{ width: "16px", height: "16px" }} />
        
                      <div className={clientDashboardStyles.filterLabel}> Add Filters</div>
                      <div className={clientDashboardStyles.filterCount}>{filteredTagLength}</div>
                    </div>       

                    <div className={clientDashboardStyles.searchFilterSet} style={{marginLeft:'10px',width:'225px'}}>
                      <SearchSVG style={{ width: "16px", height: "16px" }} />
                      <input
                        type={InputType.TEXT}
                        className={clientDashboardStyles.searchInput}
                        placeholder="Search, Recruiter"
                        value={openTicketDebounceText}
                        onChange={(e) => {
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
                            setopenTicketDebounceText("");
                          }}
                        />
                      )}
                    </div>

                    <p
                      className={clientDashboardStyles.resetText}
                      // style={{ width: "190px" }}
                      onClick={() => {
                        clearFilters();
                      }}
                    >
                      Reset Filter
                    </p>             
                </div>

              <div style={{display:'flex',justifyContent:'center',alignItems:"center"}}>
                <div style={{display:"flex",justifyContent:'center',marginRight:"10px"}}>
                  <Select
                    id="selectedValue"
                    placeholder="Select"
                    value={dateTypeFilter}                    
                    style={{width:"180px",height:"48px"}}
                    onChange={(value, option) => {
                      setDateTypeFilter(value);
                      setStartDate(firstDayOfMonth);
                      setEndDate(new Date(date));
                    }}
                    options={[
                      // {value: 2,label: 'No Dates'},
                      {value: 0,label: 'By Month'},{value: 1,label: 'With Date Range'}]}
                    optionFilterProp="value"
                  />
                </div>
                {dateTypeFilter === 0 && (
                  <div style={{display:'flex',justifyContent:'space-evenly',alignItems:'center',gap:'8px'}}> 
                    <div>
                      Month-Year
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
                              placeholderText="Month - Year"
                              selected={monthDate}
                              onChange={date=>setMonthDate(date)}
                              dateFormat="MM-yyyy"
                              showMonthYearPicker
                            />
                    </div>
                  </div>
                )}
                {dateTypeFilter === 1 && (
                  <div style={{display:'flex',justifyContent:'space-evenly',alignItems:'center',gap:'8px'}}>
                    <div>Date</div>
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
                )}                
              
            

                <div
                  className={clientDashboardStyles.paginationFilter}
                  style={{ border: "none", width: "auto" }}
                >
                  <button
                    className={clientDashboardStyles.btnPrimary}
                    onClick={() =>handleExport(clientData)}
                  >
                    Export
                  </button>
                </div>              
              </div>              
        </div>
      </div>

      {isLoading ? <TableSkeleton /> :
       <div className={clientDashboardStyles.tableWrapperCustom}>
        <Table
        scroll={{ y: "480px" }}
        id="TicketsOpenListingTable"
        columns={tableColumnsMemo}
        bordered={false}
        dataSource={clientData.length > 0 ? [{...clientData[0],recruiter:'Total'},...clientData] : clientData}   
        rowKey={(record, index) => index}
        rowClassName={(row, index) => {
            return row.recruiter === 'Total' ? clientDashboardStyles["highlight-total-row"] : '';
        }}   
 pagination={false} 
      />
      </div>
      }

{isAllowFilters && (
              <Suspense fallback={<div>Loading...</div>}>
        
                <OnboardFilerList
                  setAppliedFilters={setAppliedFilters}
                  appliedFilter={appliedFilter}
                  setCheckedState={setCheckedState}
                  checkedState={checkedState}
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
                      width="1020px"
                      centered
                      footer={null}
                      open={showTalentProfiles}
                      className="engagementModalStyle"
                      onCancel={() => {
                        setSearchTerm('')
                        setShowTalentProfiles(false);
                        setHRTalentListFourCount([]);
                        setFilteredTalentList([]);
                      }}
                    >
                      {isModalLoading ?  
                        <div style={{display:"flex",height:"350px",justifyContent:'center'}}>
                          <Spin size="large"/>
                        </div>:
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
                          {console.log('profileInfo',profileInfo)}
                         
            
                          <p style={{ marginBottom: "0.5em" , marginLeft:'5px'}}>
                            TA : <strong>{profileInfo?.recruiter}</strong>
                          </p>
            
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
                                marginRight:"20px",
                                minWidth: "260px",
                            }}
                          />
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
                              pagination={false}
                              scroll={{ y: "480px" }}
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
                              setFilteredTalentList([]);
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </>}
                    </Modal>
                  )}
    </div>
  );
}
