import { ReportDAO } from 'core/report/reportDAO';
import React,{
    useEffect,
    useMemo,
    useState,
    useCallback,
    Suspense,
  }  from 'react'
  import {
    Tabs,
    Select,
    Table,
    Modal,
    Tooltip,
    InputNumber,
    AutoComplete,
    message,
    Skeleton,} from "antd";
    import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import recruiterStyle from './recruiterReport.module.css'
import { InputType } from "constants/application";
import { ReactComponent as SearchSVG } from "assets/svg/search.svg";
import { ReactComponent as CloseSVG } from "assets/svg/close.svg";
import { ReactComponent as FunnelSVG } from "assets/svg/funnel.svg";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import { HTTPStatusCode } from 'constants/network';
import { useNavigate } from 'react-router-dom';
import UTSRoutes from 'constants/routes';
import { allHRConfig } from "modules/hiring request/screens/allHiringRequest/allHR.config";
import { allEngagementConfig } from "modules/engagement/screens/engagementList/allEngagementConfig";
import { TaDashboardDAO } from 'core/taDashboard/taDashboardDRO';
import OnboardFilerList from 'modules/onBoardList/OnboardFilterList';



export default function RecruiterReport() {
const navigate = useNavigate()
 const [RecruiterListData, setRecruiterListData] = useState([]);
  const [filteredTagLength, setFilteredTagLength] = useState(0);
   const [getHTMLFilter, setHTMLFilter] = useState(false);
   const [isAllowFilters, setIsAllowFilters] = useState(false);
   const [appliedFilter, setAppliedFilters] = useState(new Map());
   const [checkedState, setCheckedState] = useState(new Map());
  const [searchText, setSearchText] = useState("");
  const [debounceSearchText, setDebouncedSearchText] = useState("");
  const [filtersList, setFiltersList] = useState({});
   const [tableFilteredState, setTableFilteredState] = useState({
      filterFields_OnBoard: {
        taUserIDs: null,
      },
    });

  const [isLoading, setIsLoading] = useState(false);
   var date = new Date();
    const [monthDate, setMonthDate] = useState(new Date());
    
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
  const getReportData= async() => {
    let pl = {
        "searchText": searchText,
        "month": +moment(monthDate).format("M")  ?? 0,
        "year": +moment(monthDate).format("YYYY") ?? 0,
        taUserIDs:tableFilteredState?.filterFields_OnBoard?.taUserIDs,
      }
      setIsLoading(true)
     const result = await ReportDAO.getRecruiterReportDAO(pl) 
     setIsLoading(false)

      if (result.statusCode === HTTPStatusCode.OK) {
           setRecruiterListData(groupByRowSpan(result.responseBody, "taName"));
         } else if (result.statusCode === HTTPStatusCode.NOT_FOUND) {
           setRecruiterListData([]);
         } else if (result?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
           // setLoading(false);
           return navigate(UTSRoutes.LOGINROUTE);
         } else if (result?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
           // setLoading(false);
           return navigate(UTSRoutes.SOMETHINGWENTWRONG);
         } else {
           return "NO DATA FOUND";
         }
  }

  const onRemoveHRFilters = () => {
    setTimeout(() => {
      setIsAllowFilters(false);
    }, 300);
    setHTMLFilter(false);
  };

   const getFilters = async () => {
      setIsLoading(true);
      let filterResult = await TaDashboardDAO.getAllMasterDAO('RR');
      setIsLoading(false);
      if (filterResult.statusCode === HTTPStatusCode.OK) {
        setFiltersList(filterResult && filterResult?.responseBody);
      } else if (filterResult?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
        // setLoading(false);
        return navigate(UTSRoutes.LOGINROUTE);
      } else if (
        filterResult?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
      ) {
        // setLoading(false);
        return navigate(UTSRoutes.SOMETHINGWENTWRONG);
      } else {
        return "NO DATA FOUND";
      }
    };

    useEffect(()=>{
      getFilters()
    },[])

  useEffect(()=>{
    getReportData()
  },[searchText,monthDate,tableFilteredState])

   useEffect(() => {
      setTimeout(() => setSearchText(debounceSearchText), 2000);
    }, [debounceSearchText]);

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
    setDebouncedSearchText("");
    setMonthDate(new Date())
    setSearchText("");
}

const columns = ()=>{
let headers = [
    {
      title: "Recruiters",
      dataIndex: "taName",
      fixed: "left",
      width: "150px",
      render: (value, row, index) => {
        return {
          children: (
            <div style={{ verticalAlign: "top" }}>
              {value}
            </div>
          ),
          props: {
            rowSpan: row.rowSpan,
            style: { verticalAlign: "top" }, // This aligns the merged cell content to the top
          },
        };
      },
    },
    {
        title: "Stage",
        dataIndex: "profileStage",
        fixed: "left",    
        width: "150px", 
    },
    {
      title: "Achieved",
      dataIndex: "finalTotal",
      fixed: "left",    
      width: "150px", 
      render: (value) => {
        const numericValue = Number(value);
        if (value == null || numericValue === 0) {
          return "-";
        }    
        return value;
      },
    },
    
]
let weaks = [{h:'W1',k:'w1'},{h:'W2',k:'w2'},{h:'W3',k:'w3'},{h:'W4',k:'w4'},{h:'W5',k:'w5'}]

weaks.forEach(we => {
  headers.push({
    title: `${RecruiterListData[0]?.month_Name ? `${RecruiterListData[0]?.month_Name}_` : ''}${we.h}`,
    dataIndex: we.k,
    fixed: "left",
    width: "100px",
    render: (value) => {
      return value === 0 ? "-" : value || "-";
    },
  });
});



return headers

}
  const onMonthCalenderFilter = (date) => {
    setMonthDate(date);
    // setEndDate(end);
    // setEndDate(end);

    if (date) {
      // console.log( month, year)
    //   setTableFilteredState({
    //     ...tableFilteredState,
    //     searchText: searchText,
    //     filterFields_OnBoard: {
    //       ...tableFilteredState.filterFields_OnBoard,
    //       searchMonth: +moment(date).format("M") + 1 ?? 0,
    //       searchYear: +moment(date).format("YYYY") ?? 0,
    //     },
    //   });
    }
  };


  return (
    <div className={recruiterStyle.hiringRequestContainer}>
         <div className={recruiterStyle.filterContainer}>
                <div className={recruiterStyle.filterSets}>
                  <div className={recruiterStyle.filterSetsInner}>
                    <div className={recruiterStyle.addFilter} onClick={toggleHRFilter}>
                      <FunnelSVG style={{ width: "16px", height: "16px" }} />
        
                      <div className={recruiterStyle.filterLabel}> Add Filters</div>
                      <div className={recruiterStyle.filterCount}>{filteredTagLength}</div>
                    </div>

        
                    <div
                      className={recruiterStyle.searchFilterSet}
                      style={{ marginLeft: "15px" }}
                    >
                      <SearchSVG style={{ width: "16px", height: "16px" }} />
                      <input
                        type={InputType.TEXT}
                        className={recruiterStyle.searchInput}
                        placeholder="Search Table"
                        value={debounceSearchText}
                        onChange={(e) => {
                          // setSearchText(e.target.value);
                          setDebouncedSearchText(e.target.value);
                        }}
                      />
                      {debounceSearchText && (
                        <CloseSVG
                          style={{
                            width: "16px",
                            height: "16px",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            // setSearchText("");
                            setDebouncedSearchText("");
                          }}
                        />
                      )}
                    </div>               

                    <p
                      className={recruiterStyle.resetText}
                      style={{ width: "190px" }}
                      onClick={() => {
                        clearFilters();
                      }}
                    >
                      Reset Filter
                    </p>
                  </div>
        
                  <div className={recruiterStyle.filterRight}>

                     <div className={recruiterStyle.calendarFilterSet}>
                                    <div className={recruiterStyle.label}>Month-Year</div>
                                    <div className={recruiterStyle.calendarFilter}>
                                      <CalenderSVG
                                        style={{ height: "16px", marginRight: "16px" }}
                                      />
                                      <DatePicker
                                        style={{ backgroundColor: "red" }}
                                        onKeyDown={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                        }}
                                        className={recruiterStyle.dateFilter}
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
{/*                  
                    <button
                      className={recruiterStyle.btnPrimary}
                      onClick={() => {}}
                    >
                      Export
                    </button> */}
                  </div>
                </div>
              </div>

              {isLoading ? (
        <TableSkeleton />
      ) : (
        // <Table
        //   scroll={{ x: "max-content" , y:'1vh'}}
        //   dataSource={RecruiterListData}
        //   columns={columns()}
        //   // bordered
        //   pagination={false}
        // //   onChange={handleTableFilterChange}
        // />
        <Table
          scroll={{ x: "max-content", y: '1vh' }}
          dataSource={RecruiterListData}
          columns={columns()}
          pagination={false}
          rowClassName={(record) => {
            const stage = record.profileStage || '';  
            if (stage.includes('Avg Profiles Shared Per Day')) return recruiterStyle.one;
            if (stage.includes('Profiles to Interview %')) return recruiterStyle.two;            
            if (stage.includes('Interview to Select %')) return recruiterStyle.three;
            if (stage.includes('Monthly Goal')) return recruiterStyle.four;
            if (stage.includes('Achieved Pipeline')) return recruiterStyle.five;
            if (stage.includes('Actual Pipeline')) return recruiterStyle.six;
            if (stage.includes('Lost Pipeline')) return recruiterStyle.seven;
            if (stage.includes('Total Pipeline')) return recruiterStyle.four;
            return '';
          }}
        />
      )}

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
    </div>
  )
}
