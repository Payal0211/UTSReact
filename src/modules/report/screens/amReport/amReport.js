import React, { Suspense, useCallback, useEffect, useState } from 'react';
import amReportStyles from './amReport.module.css';
import { Table } from 'antd';
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
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton';

const columns = [
  {
    title: 'Client Name',
    dataIndex: 'clientName',
    key: 'clientName',
    width: 160,
    render: (text, result) => {
      return text === "TOTAL" 
        ? <b>{text}</b> 
        : <a href={`/viewCompanyDetails/${result.clientID}`} style={{ textDecoration: 'underline' }} target="_blank" rel="noreferrer">{text}</a>;
    },
  },
  {
    title: 'Position Name',
    dataIndex: 'positionName',
    key: 'positionName',
    width: 160,
    render: (text, result) => {
      return text
        ? <a href={`/allhiringrequest/${result.hrid}`} style={{ textDecoration: 'underline' }} target="_blank" rel="noreferrer">{text}</a>
        : text;
    },
  },
  {
    title: 'AM Name',
    dataIndex: 'amName',
    key: 'amName',
    width: 120,
    render: (value) => value ? value : '-',
  },
  {
    title: <>Revenue<br/>(Margin)</>,
    dataIndex: 'revenueMargin',
    key: 'revenueMargin',
    width: 120,
    render: (value) => value ? value : '-',
  },
  {
    title: <>Probability <br/> Ratio</>,
    dataIndex: 'probability',
    key: 'probability',
    width: 100,
  },
  {
    title: 'Average',
    dataIndex: 'average',
    key: 'average',
    width: 80,
    render: (value) => value ? value : '-',
  },
  {
    title:<>No. of<br/>Interviews</>,
    dataIndex: 'interviews',
    key: 'interviews',
    width: 80,
    render: (value) => Number(value) ? value : '-',
  },
  {
    title:<>Profiles<br/> Needed By</>,
    dataIndex: 'profilesNeededBy',
    key: 'profilesNeededBy',
    width: 120,
    render: (value) => value ? value : '-',
  },
  {
    title: <>Client <br/>Response By</>,
    dataIndex: 'clientResponseBy',
    key: 'clientResponseBy',
    width: 120,
    render: (value) => value ? value : '-',
  },
  ...[1, 2, 3, 4, 5].map((week, i) => ({
    title: `W${week}`,
    dataIndex: ['weekData', i],
    key: `week${week}`,
    width: 100,
    render: (value) => value ? value : '-',
  })),
];


const AMReport = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [reportData,setReportData] = useState([]);
    const today = new Date();
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
    }, [openTicketDebounceText,monthDate,tableFilteredState]);

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
            "month":monthDate? +moment(monthDate).format("M") : 0,
            "year":monthDate ? +moment(monthDate).format("YYYY") : 0,            
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
                        </div>                         
                      </div>                          
                </div>
              </div>

              {isLoading ? <TableSkeleton /> :
                    <Table
                      scroll={{ x: "1600px" , y: "480px" }}
                      id="amReportList"
                      columns={columns}
                      bordered={false}
                      dataSource={reportData}   
                      rowKey={(record, index) => index}
                      rowClassName={(row, index) => {
                        return row?.clientName === 'TOTAL' ? amReportStyles.highlighttotalrow : '';
                      }}  
                      pagination={{                       
                        size: "small",
                        pageSize: 15                       
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