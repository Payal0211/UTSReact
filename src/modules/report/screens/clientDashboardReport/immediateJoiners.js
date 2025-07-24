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
import { All_Hiring_Request_Utils } from "shared/utils/all_hiring_request_util";
import { IconContext } from "react-icons";
import { BsClipboard2CheckFill } from "react-icons/bs";
import MoveToAssessment from "modules/hiring request/components/talentList/moveToAssessment";
import moment from "moment";
import { IoChevronDownOutline } from "react-icons/io5";

export default function ImmediateJoiners() {  

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
      },
      {
        title: "Talent",
        dataIndex: "talent",
        key: "talent",
      },
   
    
      {
        title: "Recruiter",
        dataIndex: "recruiter",
        key: "recruiter",
      },  
      {
        title: "Remark Details",
        dataIndex: "remarkDetails",
        key: "remarkDetails",
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
      optiontype: statusID,
    "month":dateTypeFilter === 2 ? 0 : dateTypeFilter === 0 ? +moment(monthDate).format("M") : '',
        "year": dateTypeFilter === 2 ? 0 : dateTypeFilter === 0 ? +moment(monthDate).format("YYYY") : '',
        "fromDate": dateTypeFilter === 2 ? '' : dateTypeFilter === 1 ? startDate.toLocaleDateString("en-US"): '',
        "toDate": dateTypeFilter === 2 ? '' : dateTypeFilter === 1 ? endDate.toLocaleDateString("en-US"): '' ,
    };
    setLoadingTalentProfile(true);
    const hrResult = await TaDashboardDAO.getImmediateTalentDetailsRequestDAO(pl);
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

 

  const tableColumnsMemo = useMemo(() => {
    return [
        // {
        //     title: "Created On",
        //     dataIndex: "createdByDatetime",
        //     key: "createdByDatetime",
        //     align: "left",
        //     width: "160px",
        //     fixed: "left",
        //     render: (text) => {
        //        return text ? moment(text).format("DD-MM-YYYY") : ''
        //       },
        //   },
        {
            title: "Client",
            dataIndex: "client",
            key: "client",
            align: "left",
            width: "200px",
            fixed: "left",
            render: (text, result) => {
                return result.client  === "Total" 
                  ? "" 
                  : text === "Total" 
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
            return result.client  === "Total" 
                  ? "" 
                  : text 
              ? <a href={`/allhiringrequest/${result.hrid}`} style={{textDecoration:'underline'}} target="_blank" rel="noreferrer">{text}</a>  // Replace `/hr/${text}` with the appropriate link you need
              : text;
          },
      },
      {
        title: "Job Title",
        dataIndex: "jobTitle",
        key: "jobTitle",
        align: "left",
        width: "150px",
         fixed: "left",
            render: (text, result) => {
                return result.client  === "Total" 
                  ? "" 
                  : text
              },
      },
     {
        title: "Sales Person",
        dataIndex: "salesperson",
        key: "salesperson",
        align: "left",
        width: "150px",
         fixed: "left",
          render: (text, result) => {
                return result.client  === "Total" 
                  ? "" 
                  : text
              },
      },
       {
        title: "Immediate",
        dataIndex: "immediateJoiners",
        key: "immediateJoiners",
        align: "center",
        width: "100px",
        render: (text, result) => {
          if (result.client === 'Total') {
             return    <p
              style={{
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result, 'T_I');
              }}
            >
              {result.total_ImmediateJoiners ? result.total_ImmediateJoiners : ''}
            </p>; 
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
                getTalentProfilesDetailsfromTable(result, 'I');
                setTalentToMove(result);
                setProfileStatusID(0);
                setHRTalentListFourCount([]);
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
        title: "15 Days",
        dataIndex: "j_15Days",
        key: "j_15Days",
        align: "center",
        width: "100px",
        render: (text, result) => {
          if (result.client === 'Total') {
             return    <p
              style={{
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result, 'T_15');
              }}
            >
              {result.total_J_15Days ? result.total_J_15Days : ''}
            </p>; 
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
                getTalentProfilesDetailsfromTable(result, '15');
                setTalentToMove(result);
                setProfileStatusID(0);
                setHRTalentListFourCount([]);
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
        title: "30 Days",
        dataIndex: "j_30Days",
        key: "j_30Days",
        align: "center",
        width: "100px",
        render: (text, result) => {
          if (result.client === 'Total') {
             return    <p
              style={{
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result, 'T_30');
              }}
            >
              {result.total_J_30Days ? result.total_J_30Days : ''}
            </p>; 
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
                getTalentProfilesDetailsfromTable(result, '30');
                setTalentToMove(result);
                setProfileStatusID(2);
                setHRTalentListFourCount([]);
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
        title: "60 Days",
        dataIndex: "j_60Days",
        key: "j_60Days",
        align: "center",
        width: "100px",
        render: (text, result) => {
          if (result.client === 'Total') {
            return    <p
              style={{
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result, 'T_60');
              }}
            >
              {result.total_J_60Days ? result.total_J_60Days : ''}
            </p>; 
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
                getTalentProfilesDetailsfromTable(result,'60');
                setTalentToMove(result);
                setProfileStatusID(71);
                setHRTalentListFourCount([]);
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
        title: "More then 8 weeks",
        dataIndex: "morethan8Weeks",
        key: "morethan8Weeks",
        align: "center",
        width: "140px",
        render: (text, result) => {
          if (result.client === 'Total') {
            return    <p
              style={{
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result, 'T_M');
              }}
            >
              {result.total_Morethan8Weeks ? result.total_Morethan8Weeks : ''}
            </p>; 
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
                getTalentProfilesDetailsfromTable(result, "M");
                setTalentToMove(result);
                setProfileStatusID(11);
                setHRTalentListFourCount([]);
              }}
            >
              {text ? text : ''}
            </p>
          ) : (
            text ? text : ''
          );
        },
      },
     
    ];
  }, [clientData]);
  

  const getClientDashboardReport = async () => {
    let payload = {
        "searchText": openTicketSearchText,
        "month":dateTypeFilter === 2 ? 0 : dateTypeFilter === 0 ? +moment(monthDate).format("M") : '',
        "year": dateTypeFilter === 2 ? 0 : dateTypeFilter === 0 ? +moment(monthDate).format("YYYY") : '',
        "fromDate": dateTypeFilter === 2 ? '' : dateTypeFilter === 1 ? startDate.toLocaleDateString("en-US"): '',
        "toDate": dateTypeFilter === 2 ? '' : dateTypeFilter === 1 ? endDate.toLocaleDateString("en-US"): '' ,
      };
    setLoading(true)
    const apiResult = await ReportDAO.getImmediateJoinerReportDAO(payload);
    setLoading(false)
    if (apiResult?.statusCode === 200) {        
      setClientData([{ ...apiResult.responseBody[0],client:'Total'},...apiResult.responseBody]);      
        // setListDataCount(apiResult.responseBody?.totalrows);      
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

    if (start?.toLocaleDateString() === end?.toLocaleDateString()) {
      let params = {
        fromDate: firstDayOfMonth,
        toDate: today,
      }
      setStartDate(params.fromDate);
      setEndDate(params.toDate);
      return;
    }    
  };

  useEffect(() => {
    getClientDashboardReport();
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
            obj[`${val.title}`] = data[`${val.key}`]     
          })
          return obj;
        }
      )
      downloadToExcel(DataToExport,'Client_Dashboard_Report.xlsx')  
  }

  return (
    <div className={clientDashboardStyles.hiringRequestContainer}>
      
      <div className={clientDashboardStyles.addnewHR} style={{ margin: "0" }}>
        <div className={clientDashboardStyles.hiringRequest}>Talent Joining</div>
      </div>

      <div className={clientDashboardStyles.filterContainer}>
        <div className={clientDashboardStyles.filterSets}>
        <div className={clientDashboardStyles.filterSetsInner}>


                    <div className={clientDashboardStyles.searchFilterSet} style={{marginLeft:'10px'}}>
                      <SearchSVG style={{ width: "16px", height: "16px" }} />
                      <input
                        type={InputType.TEXT}
                        className={clientDashboardStyles.searchInput}
                        placeholder="Client, HR ID, Recruiter"
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
                      style={{ width: "190px" }}
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
                    options={[{value: 0,label: 'By Month'},{value: 1,label: 'With Date Range'}]}
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
              
                {/* <div className={clientDashboardStyles.priorityFilterSet}>                
                  <div className={clientDashboardStyles.label}>
                    Showing
                  </div>                
                  <div className={clientDashboardStyles.paginationFilter}>
                    <Dropdown
                      trigger={["click"]}
                      placement="bottom"
                      overlay={
                        <Menu
                          onClick={(e) => {
                            setPageSize(parseInt(e.key));                                   
                          }}
                        >
                          {pageSizeOptions.map((item) => {
                            return (
                              <Menu.Item key={item}>{item}</Menu.Item>
                            );
                          })}
                        </Menu>
                      }
                    >
                      <span>
                        {pageSize}
                        <IoChevronDownOutline
                          style={{
                            paddingTop: "5px",
                            fontSize: "16px",
                          }}
                        />
                      </span>
                    </Dropdown>
                  </div>                  
                </div> */}

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
        pagination={false}
        //   pagination={{
        //     onChange: (pageNum, pageSize) => {
        //       setPageIndex(pageNum);
        //       setPageSize(pageSize - 1);
        //     },
        //     size: "small",
        //     pageSize: pageSize + 1,
        //     pageSizeOptions: pageSizeOptions,
        //     total: listDataCount,
        //     showTotal: (total, range) =>
        //       `${range[0]}-${range[1]} of ${listDataCount} items`,
        //     current: pageIndex,
        //   }}  
      />
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
                      width="1000px"
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
                          <h3>
                            Profiles for <strong>{profileInfo?.hrNumber}</strong>
                          </h3>
                          <p style={{ marginBottom: "0.5em" }}>
                            Company : <strong>{profileInfo?.client}</strong>
                          </p>
            
                          <p style={{ marginBottom: "0.5em" }}>
                            Sales : <strong>{profileInfo?.salesperson}</strong>
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
