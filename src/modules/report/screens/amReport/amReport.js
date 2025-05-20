import React, { Suspense, useCallback, useEffect, useState } from 'react';
import amReportStyles from './amReport.module.css';
import {  Select, Spin, Table } from 'antd';
import { ReportDAO } from 'core/report/reportDAO';
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import { ReactComponent as SearchSVG } from "assets/svg/search.svg";
import { InputType } from "constants/application";
import { ReactComponent as CloseSVG } from "assets/svg/close.svg";
import DatePicker from "react-datepicker";
import moment from 'moment';
import { ReactComponent as FunnelSVG } from "assets/svg/funnel.svg";
import OnboardFilerList from 'modules/onBoardList/OnboardFilterList';
import { allHRConfig } from 'modules/hiring request/screens/allHiringRequest/allHR.config';
import { allEngagementConfig } from 'modules/engagement/screens/engagementList/allEngagementConfig';

const columns = [
  {
    title: 'Client Name',
    dataIndex: 'clientName',
    key: 'clientName',
  },
  {
    title: 'Position Name',
    dataIndex: 'positionName',
    key: 'positionName',
  },
  {
    title: 'Revenue (Margin)',
    dataIndex: 'revenueMargin',
    key: 'revenueMargin',
    render: (value) => value ? value : '-',
  },
  {
    title: 'Probability Ratio',
    dataIndex: 'probability',
    key: 'probability',
  },
  {
    title: 'Average',
    dataIndex: 'average',
    key: 'average',
    render: (value) => value ? value : '-',
  },
  {
    title: 'No. of Interviews',
    dataIndex: 'interviews',
    key: 'interviews',        
    render: (value) => Number(value) ? value : '-',
  },
  {
    title: 'Profiles Needed By',
    dataIndex: 'profilesNeededBy',
    key: 'profilesNeededBy',
    render: (value) => value ? value : '-',
  },
  {
    title: 'Client Response By',
    dataIndex: 'clientResponseBy',
    key: 'clientResponseBy',
    render: (value) => value ? value : '-',
  },
  ...[1, 2, 3, 4, 5].map((week, i) => ({
    title: `W${week}`,
    dataIndex: ['weekData', i],
    key: `week${week}`,
    render: (value) => value ? value : '-',
  })),
];

const AMReport = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [reportData,setReportData] = useState([]);
    const today = new Date();
    const [dateTypeFilter, setDateTypeFilter] = useState(2);
    const [monthDate, setMonthDate] = useState(today);  
    const [openTicketDebounceText, setopenTicketDebounceText] = useState("");
    const [getHTMLFilter, setHTMLFilter] = useState(false);
    const [isAllowFilters, setIsAllowFilters] = useState(false);
    const [filteredTagLength, setFilteredTagLength] = useState(0);
    const [appliedFilter, setAppliedFilters] = useState(new Map());
    const [checkedState, setCheckedState] = useState(new Map());
    const [tableFilteredState, setTableFilteredState] = useState({
        filterFields_OnBoard: {
          text: null,
        },
      });
    const [filtersList, setFiltersList] = useState([]);

    useEffect(() => {
      getAMReportFilter();
    }, [])
    
      
    useEffect(() => {
        getAMReportData();
    }, [openTicketDebounceText,monthDate,dateTypeFilter,tableFilteredState]);

    const getAMReportFilter = async () => {
        setIsLoading(true);
        const filterResult = await ReportDAO.getAMReportFilterDAO();
        setIsLoading(false);
        if (filterResult.statusCode === 200) {
          setFiltersList(filterResult?.responseBody || []);
        } else if (filterResult?.statusCode === 404) {
          setFiltersList({});
        }
      };


    const getAMReportData = async () => {
        let payload = {
            "searchText": openTicketDebounceText,
            "month":dateTypeFilter === 2 ? 0 : dateTypeFilter === 0 ? +moment(monthDate).format("M") : 0,
            "year": dateTypeFilter === 2 ? 0 : dateTypeFilter === 0 ? +moment(monthDate).format("YYYY") : 0,            
            "amUserIDs": tableFilteredState?.filterFields_OnBoard?.text          
        };
        setIsLoading(true);
        const apiResult = await ReportDAO.getAMReportDAO(payload);
        setIsLoading(false);
        if (apiResult?.statusCode === 200) {
            setReportData(apiResult.responseBody);
        } else if (apiResult?.statusCode === 404) {
            setReportData([]);
        }
    };

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
      setopenTicketDebounceText("");
      setMonthDate(new Date())
      setTableFilteredState({
        filterFields_OnBoard: {
          text: null,
        },
      })      
    }

    const onRemoveHRFilters = () => {
      setTimeout(() => {
        setIsAllowFilters(false);
      }, 300);
      setHTMLFilter(false);
    };

  return (
    <div className={amReportStyles.container}>
      <h1 className={amReportStyles.title}>Pipeline to bring closures from</h1>
    
        <div className={amReportStyles.filterContainer}>
                <div className={amReportStyles.filterSets}>                                                
                        
                 <div style={{display:"flex",justifyContent:'space-between'}}>

                        <div className={amReportStyles.filterSetsInner}>                     
                          <div className={amReportStyles.addFilter} onClick={toggleHRFilter}>
                            <FunnelSVG style={{ width: "16px", height: "16px" }} />
                            <div className={amReportStyles.filterLabel}> Add Filters</div>
                            <div className={amReportStyles.filterCount}>{filteredTagLength}</div>
                          </div>                           

                          <p
                            className={amReportStyles.resetText}
                            style={{ width: "120px" }}
                            onClick={clearFilters}
                          >
                            Reset Filter
                          </p>

                          <div className={amReportStyles.searchFilterSet}>
                              <SearchSVG style={{ width: "16px", height: "16px" }} />
                              <input
                                  type={InputType.TEXT}
                                  className={amReportStyles.searchInput}
                                  placeholder="Search Here...!"
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
                        </div>     
                        <div>                              
                          <Select
                              id="selectedValue"
                              placeholder="Select"
                              value={dateTypeFilter}                    
                              style={{width:"180px",height:"48px"}}
                              onChange={(value, option) => {
                              setDateTypeFilter(value);
                              }}
                              options={[{value: 2,label: 'No Dates'},{value: 0,label: 'By Month'}]}
                              optionFilterProp="value"
                          />                                           
                        
                          {dateTypeFilter === 0 && (
                            <div style={{display:'flex',justifyContent:'space-evenly',alignItems:'center',gap:'8px'}}> 
                                <div>
                                Month-Year
                                </div>
                                <div className={amReportStyles.calendarFilter}> 
                                <CalenderSVG style={{ height: "16px", marginRight: "16px" }} />
                                <DatePicker
                                        style={{ backgroundColor: "red" }}
                                        onKeyDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        className={amReportStyles.dateFilter}
                                        placeholderText="Month - Year"
                                        selected={monthDate}
                                        onChange={date=>setMonthDate(date)}
                                        dateFormat="MM-yyyy"
                                        showMonthYearPicker
                                        />
                                </div>
                            </div>
                          )}                                                                                                                           
                        </div>                         
                      </div>                          
                </div>
              </div>
              {isLoading ? <Spin />  : 
                <Table
                  columns={columns}
                  dataSource={reportData}
                  pagination={{ pageSize: 15 }}
                  className={amReportStyles.amtable}        
                  bordered        
                  rowClassName={(row, index) => {
                    return row?.clientName === 'TOTAL' ? amReportStyles.highlighttotalrow : '';
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
                      setTableFilteredState={setTableFilteredState}
                      tableFilteredState={tableFilteredState}
                      setFilteredTagLength={setFilteredTagLength}
                      onRemoveHRFilters={onRemoveHRFilters}
                      getHTMLFilter={getHTMLFilter}
                      hrFilterList={allHRConfig.hrFilterListConfig()}
                      filtersType={allEngagementConfig.amReportFilterTypeConfig(
                        filtersList
                      )}
                      clearFilters={clearFilters}
                    />
                  </Suspense>
                )}
    </div>
  );
};

export default AMReport;