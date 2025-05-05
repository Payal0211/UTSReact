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
console.log(groupField,grouped,finalData)
    return finalData;
  }
  const getReportData= async() => {
    let pl = {
        "searchText": searchText,
        "month": +moment(monthDate).format("M")  ?? 0,
        "year": +moment(monthDate).format("YYYY") ?? 0
      }
      setIsLoading(true)
     const result = await ReportDAO.getRecruiterReportDAO(pl) 
     setIsLoading(false)
     console.log(result)

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


  useEffect(()=>{
    getReportData()
  },[searchText,monthDate])

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
                    {/* <div className={recruiterStyle.addFilter} onClick={toggleHRFilter}>
                      <FunnelSVG style={{ width: "16px", height: "16px" }} />
        
                      <div className={recruiterStyle.filterLabel}> Add Filters</div>
                      <div className={recruiterStyle.filterCount}>{filteredTagLength}</div>
                    </div> */}
        
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
                    {/* <button
                      style={{ marginLeft: "15px" }}
                      type="submit"
                      className={recruiterStyle.btnPrimary}
                      onClick={() => {}}
                    >
                      Search
                    </button> */}
        
                    {/* <p
                      className={recruiterStyle.resetText}
                      style={{ width: "190px" }}
                      onClick={() => {
                        clearFilters();
                      }}
                    >
                      Reset Filter
                    </p> */}
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
            if (record.profileStage === 'Achieved Pipeline') return recruiterStyle.one;
            if (record.profileStage === 'Pipeline') return recruiterStyle.two;
            if (record.profileStage === 'Monthly Goal') return recruiterStyle.three;
            if (record.profileStage === 'Interview to Select %') return recruiterStyle.four;
            if (record.profileStage === 'Avg Profiles Shared Per Day') return recruiterStyle.five;
            if (record.profileStage === 'Profiles to Interview %') return recruiterStyle.six;
            return '';
          }}
        />
      )}


    </div>
  )
}
