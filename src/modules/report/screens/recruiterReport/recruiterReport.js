// import { ReportDAO } from 'core/report/reportDAO';
// import React,{
//     useEffect,
//     useState,
//     useCallback,
//     Suspense,
//   }  from 'react'
//   import {
//     Select,
//     Table,} from "antd";
//     import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
// import recruiterStyle from './recruiterReport.module.css'
// import { InputType } from "constants/application";
// import { ReactComponent as SearchSVG } from "assets/svg/search.svg";
// import { ReactComponent as CloseSVG } from "assets/svg/close.svg";
// import { ReactComponent as FunnelSVG } from "assets/svg/funnel.svg";
// import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import moment from 'moment';
// import { HTTPStatusCode } from 'constants/network';
// import { useNavigate } from 'react-router-dom';
// import UTSRoutes from 'constants/routes';
// import { allHRConfig } from "modules/hiring request/screens/allHiringRequest/allHR.config";
// import { allEngagementConfig } from "modules/engagement/screens/engagementList/allEngagementConfig";
// import { TaDashboardDAO } from 'core/taDashboard/taDashboardDRO';
// import OnboardFilerList from 'modules/onBoardList/OnboardFilterList';
// export default function RecruiterReport() {
// const navigate = useNavigate()
// const [RecruiterListData, setRecruiterListData] = useState([]);
// const [filteredTagLength, setFilteredTagLength] = useState(0);
// const [getHTMLFilter, setHTMLFilter] = useState(false);
// const [isAllowFilters, setIsAllowFilters] = useState(false);
// const [appliedFilter, setAppliedFilters] = useState(new Map());
// const [checkedState, setCheckedState] = useState(new Map());
// const [searchText, setSearchText] = useState("");
// const [debounceSearchText, setDebouncedSearchText] = useState("");
// const [filtersList, setFiltersList] = useState({});
// const [selectedHead, setSelectedHead] = useState("");
// const [tableFilteredState, setTableFilteredState] = useState({
//   filterFields_OnBoard: {
//     taUserIDs: null,
//     TA_HeadID:null
//   },
// });
// const [isLoading, setIsLoading] = useState(false);
// var date = new Date();
// const [monthDate, setMonthDate] = useState(new Date());
//  const [tableData, setTableData] = useState([]);

//   useEffect(() => {
//     if (RecruiterListData?.length > 0) {
//       setTableData(transformData(RecruiterListData));
//     }
//   }, [RecruiterListData]);
// useEffect(() => {
//   if (filtersList?.HeadUsers?.length) {
//     setSelectedHead(filtersList?.HeadUsers[0]?.id);
//   }
// }, [filtersList?.HeadUsers]);
    
//   function groupByRowSpan(data, groupField) {
//     const grouped = {};

//     // Step 1: Group by the field (e.g., 'ta')
//     data.forEach((item) => {
//       const key = item[groupField];
//       if (!grouped[key]) grouped[key] = [];
//       grouped[key].push(item);
//     });

//     // Step 2: Add rowSpan metadata
//     const finalData = [];
//     Object.entries(grouped).forEach(([key, rows]) => {
//       rows.forEach((row, index) => {
//         finalData.push({
//           ...row,
//           rowSpan: index === 0 ? rows.length : 0,
//         });
//       });
//     });
//     return finalData;
//   }
//   const getReportData= async() => {
//     let pl = {
//         "searchText": searchText,
//         "month": +moment(monthDate).format("M")  ?? 0,
//         "year": +moment(monthDate).format("YYYY") ?? 0,
//         taUserIDs:tableFilteredState?.filterFields_OnBoard?.taUserIDs,
//         TA_HeadID:selectedHead
//       }
//       setIsLoading(true)
//      const result = await ReportDAO.getRecruiterReportDAO(pl) 
//      setIsLoading(false)

//       if (result.statusCode === HTTPStatusCode.OK) {
//            setRecruiterListData(groupByRowSpan(result.responseBody, "taName"));
//          } else if (result.statusCode === HTTPStatusCode.NOT_FOUND) {
//            setRecruiterListData([]);
//          } else if (result?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
//            // setLoading(false);
//            return navigate(UTSRoutes.LOGINROUTE);
//          } else if (result?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
//            // setLoading(false);
//            return navigate(UTSRoutes.SOMETHINGWENTWRONG);
//          } else {
//            return "NO DATA FOUND";
//          }
//   }

//   const onRemoveHRFilters = () => {
//     setTimeout(() => {
//       setIsAllowFilters(false);
//     }, 300);
//     setHTMLFilter(false);
//   };

//    const getFilters = async () => {
//       setIsLoading(true);
//       let filterResult = await TaDashboardDAO.getAllMasterDAO('RR');
//       setIsLoading(false);
//       if (filterResult.statusCode === HTTPStatusCode.OK) {
//         setFiltersList(filterResult && filterResult?.responseBody);
//       } else if (filterResult?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
//         // setLoading(false);
//         return navigate(UTSRoutes.LOGINROUTE);
//       } else if (
//         filterResult?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
//       ) {
//         // setLoading(false);
//         return navigate(UTSRoutes.SOMETHINGWENTWRONG);
//       } else {
//         return "NO DATA FOUND";
//       }
//     };

//     useEffect(()=>{
//       getFilters()
//     },[])

//   useEffect(()=>{
//     if (selectedHead.length !== 0) {
//       getReportData()
//     }
    
//   },[searchText,monthDate,tableFilteredState,selectedHead])

//    useEffect(() => {
//       setTimeout(() => setSearchText(debounceSearchText), 2000);
//     }, [debounceSearchText]);

//     const toggleHRFilter = useCallback(() => {
//       !getHTMLFilter
//         ? setIsAllowFilters(!isAllowFilters)
//         : setTimeout(() => {
//             setIsAllowFilters(!isAllowFilters);
//           }, 300);
//       setHTMLFilter(!getHTMLFilter);
//     }, [getHTMLFilter, isAllowFilters]);

//   const clearFilters = () =>{
//     setAppliedFilters(new Map());
//       setCheckedState(new Map());
//       setFilteredTagLength(0);
//       setTableFilteredState({
//         filterFields_OnBoard: {
//           taUserIDs: null,
//         },
//       });
//       setDebouncedSearchText("");
//       setMonthDate(new Date())
//       setSearchText("");
//       setSelectedHead(filtersList?.HeadUsers[0]?.id);
//   }

//   const columns = ()=>{
//   let headers = [
//       {
//         title: "Recruiters",
//         dataIndex: "taName",
//         fixed: "left",
//         width: "150px",
//         render: (value, row, index) => {
//           return {
//             children: (
//               <div style={{ verticalAlign: "top" }}>
//                 {value}
//               </div>
//             ),
//             props: {
//               rowSpan: row.rowSpan,
//               style: { verticalAlign: "top" }, // This aligns the merged cell content to the top
//             },
//           };
//         },
//       },
//       {
//           title: "Stage",
//           dataIndex: "profileStage",
//           fixed: "left",    
//           width: "150px", 
//       },
//       {
//         title: "Achieved",
//         dataIndex: "finalTotal",
//         fixed: "left",    
//         width: "150px", 
//         render: (value) => {
//           const numericValue = Number(value);
//           if (value == null || numericValue === 0) {
//             return "-";
//           }    
//           return value;
//         },
//       },
      
//   ]
//   let weaks = [{h:'W1',k:'w1'},{h:'W2',k:'w2'},{h:'W3',k:'w3'},{h:'W4',k:'w4'},{h:'W5',k:'w5'}]

//   weaks.forEach(we => {
//     headers.push({
//       title: `${RecruiterListData[0]?.month_Name ? `${RecruiterListData[0]?.month_Name}_` : ''}${we.h}`,
//       dataIndex: we.k,
//       fixed: "left",
//       width: "100px",
//       render: (value) => {
//         return value === 0 ? "-" : value || "-";
//       },
//     });
//   });



//   return headers

//   }
//   const onMonthCalenderFilter = (date) => {
//     setMonthDate(date);
//   };

// const getStageClass = (profileStatusID) => {
//   const id = String(profileStatusID);
//   if (['11', '15', '19'].includes(id)) return 'one';
//   if (['12', '16', '20'].includes(id)) return 'two';
//   if (['13', '17'].includes(id)) return 'three';
//   if (['14', '18'].includes(id)) return 'four';
//   return '';
// };

// const transformData = (rawData) => {
//   const grouped = {};

//   rawData.forEach((item) => {
//     const { taName, profileStage, finalTotal, w1, w2, w3, w4, w5 } = item;

//     if (!grouped[taName]) {
//       grouped[taName] = {
//         taName,
//         stages: [],
//       };
//     }

//     grouped[taName].stages.push({
//       profileStage,
//       finalTotal,
//       w1,
//       w2,
//       w3,
//       w4,
//       w5,
//     });
//   });

//   return Object.values(grouped);
// };
//   return (
//     <div className={recruiterStyle.hiringRequestContainer}>
//          <div className={recruiterStyle.filterContainer}>
//                 <div className={recruiterStyle.filterSets}>

//                   <div className={recruiterStyle.filterSetsInner}>

//                     <div className={recruiterStyle.addFilter} onClick={toggleHRFilter}>
//                       <FunnelSVG style={{ width: "16px", height: "16px" }} />
        
//                       <div className={recruiterStyle.filterLabel}> Add Filters</div>
//                       <div className={recruiterStyle.filterCount}>{filteredTagLength}</div>
//                     </div>
//                     <Select
//                       id="selectedValue"
//                       placeholder="Select Head"
//                       style={{ marginLeft: "10px", width: "230px" }}
//                       // mode="multiple"
//                       value={selectedHead}
//                       showSearch={true}
//                       onChange={(value, option) => {
//                         setSelectedHead(value);
//                       }}
//                       options={filtersList?.HeadUsers?.map((v) => ({
//                         label: v.data,
//                         value: v.id,
//                       }))}
//                       optionFilterProp="label"
//                       // getPopupContainer={(trigger) => trigger.parentElement}
//                     />              
//                     <p
//                       className={recruiterStyle.resetText}
//                       style={{ width: "190px" }}
//                       onClick={() => {
//                         clearFilters();
//                       }}
//                     >
//                       Reset Filter
//                     </p>
//                   </div>
        
//                   <div className={recruiterStyle.filterRight}>
//                   <div
//                       className={recruiterStyle.searchFilterSet}
//                       style={{ marginLeft: "15px" }}
//                     >
//                       <SearchSVG style={{ width: "16px", height: "16px" }} />
//                       <input
//                         type={InputType.TEXT}
//                         className={recruiterStyle.searchInput}
//                         placeholder="Search Table"
//                         value={debounceSearchText}
//                         onChange={(e) => {
//                           // setSearchText(e.target.value);
//                           setDebouncedSearchText(e.target.value);
//                         }}
//                       />
//                       {debounceSearchText && (
//                         <CloseSVG
//                           style={{
//                             width: "16px",
//                             height: "16px",
//                             cursor: "pointer",
//                           }}
//                           onClick={() => {
//                             // setSearchText("");
//                             setDebouncedSearchText("");
//                           }}
//                         />
//                       )}
//                     </div>   
//                      <div className={recruiterStyle.calendarFilterSet}>
//                         <div className={recruiterStyle.label}>Month-Year</div>
//                         <div className={recruiterStyle.calendarFilter}>
//                           <CalenderSVG
//                             style={{ height: "16px", marginRight: "16px" }}
//                           />
//                           <DatePicker
//                             style={{ backgroundColor: "red" }}
//                             onKeyDown={(e) => {
//                               e.preventDefault();
//                               e.stopPropagation();
//                             }}
//                             className={recruiterStyle.dateFilter}
//                             placeholderText="Month - Year"
//                             selected={monthDate}
//                             onChange={onMonthCalenderFilter}
//                             // startDate={startDate}
//                             // endDate={endDate}
//                             dateFormat="MM-yyyy"
//                             showMonthYearPicker
//                           />
//                         </div>
//                       </div>
//                   </div>
//                 </div>
//               </div>

//               {isLoading ? (
//         <TableSkeleton />
//       ) : (
//         // <Table
//         //   scroll={{ x: "max-content" , y:'1vh'}}
//         //   dataSource={RecruiterListData}
//         //   columns={columns()}
//         //   // bordered
//         //   pagination={false}
//         // //   onChange={handleTableFilterChange}
//         // />
//      <div className={recruiterStyle.cardcontainer}>
//       {tableData.map((recruiter) => (
//         <div className={recruiterStyle.recruitercard} key={recruiter.taName}>
//           <h3 className={recruiterStyle.recruitername}>{recruiter.taName}</h3>
//           <table className={recruiterStyle.stagetable}>
//             <thead>
//               <tr>
//                 <th>Stage</th>
//                 <th>Achieved</th>
//                 <th>W1</th>
//                 <th>W2</th>
//                 <th>W3</th>
//                 <th>W4</th>
//                 <th>W5</th>
//               </tr>
//             </thead>
//             <tbody>
//               {recruiter.stages.map((stage, index) => (
//                 <tr key={index} className={getStageClass(stage.profileStatusID)}>
//                   <td>{stage.profileStage}</td>
//                   <td>{stage.finalTotal ?? '-'}</td>
//                   <td>{stage.w1 ?? '-'}</td>
//                   <td>{stage.w2 ?? '-'}</td>
//                   <td>{stage.w3 ?? '-'}</td>
//                   <td>{stage.w4 ?? '-'}</td>
//                   <td>{stage.w5 ?? '-'}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ))}
//     </div>

//         // <div className={recruiterStyle.customTableWrapper}>
//         // <Table
//         //   scroll={{ x: "max-content", y: '1vh' }}
//         //   dataSource={RecruiterListData}
//         //   columns={columns()}
//         //   pagination={false}
//         //   rowClassName={(record) => {
//         //     const stage = String(record.profileStatusID || '');
//         //     if (stage.includes('11')) return recruiterStyle.one;
//         //     if (stage.includes('12')) return recruiterStyle.two;            
//         //     if (stage.includes('13')) return recruiterStyle.three;
//         //     if (stage.includes('14')) return recruiterStyle.four;
//         //     if (stage.includes('15')) return recruiterStyle.one;
//         //     if (stage.includes('16')) return recruiterStyle.two;
//         //     if (stage.includes('17')) return recruiterStyle.three;
//         //     if (stage.includes('18')) return recruiterStyle.four;
//         //     if (stage.includes('19')) return recruiterStyle.one;
//         //     if (stage.includes('20')) return recruiterStyle.two;
//         //     return '';
//         //   }}
//         // />
//         // </div>
      
//       )}

//            {isAllowFilters && (
//               <Suspense fallback={<div>Loading...</div>}>
        
//                 <OnboardFilerList
//                   setAppliedFilters={setAppliedFilters}
//                   appliedFilter={appliedFilter}
//                   setCheckedState={setCheckedState}
//                   checkedState={checkedState}
//                   // handleHRRequest={handleHRRequest}
//                   setTableFilteredState={setTableFilteredState}
//                   tableFilteredState={tableFilteredState}
//                   setFilteredTagLength={setFilteredTagLength}
//                   onRemoveHRFilters={() => onRemoveHRFilters()}
//                   getHTMLFilter={getHTMLFilter}
//                   hrFilterList={allHRConfig.hrFilterListConfig()}
//                   filtersType={allEngagementConfig.recruiterReportFilterTypeConfig(
//                     filtersList && filtersList
//                   )}
//                   clearFilters={clearFilters}
//                 />
//               </Suspense>
//             )}
//     </div>
//   )
// }


import { ReportDAO } from 'core/report/reportDAO';
import React,{
    useEffect,
    useState,
    useCallback,
    Suspense,
  }  from 'react'
  import {
    Select,
} from "antd";
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
  const [selectedHead, setSelectedHead] = useState("");
  const [tableFilteredState, setTableFilteredState] = useState({
    filterFields_OnBoard: {
      taUserIDs: null,
      TA_HeadID:null
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  // var date = new Date(); // Not used
  const [monthDate, setMonthDate] = useState(new Date());
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (RecruiterListData?.length > 0) {
      setTableData(transformData(RecruiterListData));
    } else {
      setTableData([]);
    }
  }, [RecruiterListData]);

  useEffect(() => {
    if (filtersList?.HeadUsers?.length) {
      const defaultHead = filtersList.HeadUsers[0]?.id || "";
      setSelectedHead(defaultHead);
    }
  }, [filtersList?.HeadUsers]);
    
  function groupByRowSpan(data, groupField) {
    const grouped = {};
    data.forEach((item) => {
      const key = item[groupField];
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });
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
    if (!selectedHead && filtersList?.HeadUsers?.length > 0) {
        return;
    }
    let pl = {
        "searchText": searchText,
        "month": +moment(monthDate).format("M")  || 0, // Use || for default
        "year": +moment(monthDate).format("YYYY") || 0, // Use || for default
        taUserIDs:tableFilteredState?.filterFields_OnBoard?.taUserIDs,
        TA_HeadID:selectedHead
      }
      setIsLoading(true)
     const result = await ReportDAO.getRecruiterReportDAO(pl) 
     setIsLoading(false)

      if (result.statusCode === HTTPStatusCode.OK) {
           setRecruiterListData(groupByRowSpan(result.responseBody, "taName"));
         } else if (result.statusCode === HTTPStatusCode.NOT_FOUND) {
           setRecruiterListData([]);
         } else if (result?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
           return navigate(UTSRoutes.LOGINROUTE);
         } else if (result?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
           return navigate(UTSRoutes.SOMETHINGWENTWRONG);
         } else {
           setRecruiterListData([]); 
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
        setFiltersList(filterResult?.responseBody || {}); // Ensure responseBody is not null
      } else if (filterResult?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
        return navigate(UTSRoutes.LOGINROUTE);
      } else if (
        filterResult?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
      ) {
        return navigate(UTSRoutes.SOMETHINGWENTWRONG);
      } else {
        setFiltersList({});
      }
    };

    useEffect(()=>{
      getFilters()
    },[])

  useEffect(()=>{
    if (selectedHead && selectedHead.length !== 0) { 
      getReportData();
    } else if (!selectedHead && (!filtersList?.HeadUsers || filtersList.HeadUsers.length === 0)) {
      getReportData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[searchText,monthDate,tableFilteredState,selectedHead, filtersList?.HeadUsers])

   useEffect(() => {
      const handler = setTimeout(() => setSearchText(debounceSearchText), 1000);
      return () => clearTimeout(handler);
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
          TA_HeadID: null,
        },
      });
      setDebouncedSearchText("");
      setMonthDate(new Date())
      setSearchText("");
      setSelectedHead(filtersList?.HeadUsers?.[0]?.id || ""); 
  }

  const onMonthCalenderFilter = (date) => {
    setMonthDate(date);
  };

  const getStageClass = (profileStatusID) => {
    const id = String(profileStatusID);
    if (['11', '15', '19'].includes(id)) return recruiterStyle.one;
    if (['12', '16', '20'].includes(id)) return recruiterStyle.two;
    if (['13', '17'].includes(id)) return recruiterStyle.three;
    if (['14', '18'].includes(id)) return recruiterStyle.four;
    return '';
  };

  const transformData = (rawData) => {
    const groupedByTaName = {};
  
    rawData.forEach((item) => {
      const { taName, profileStage, finalTotal, w1, w2, w3, w4, w5, profileStatusID } = item; 
  
      if (!groupedByTaName[taName]) {
        groupedByTaName[taName] = {
          taName,
          tableStages: [],
          keyValueStages: [],
        };
      }
  
      const stageEntry = {
        profileStage,
        finalTotal,
        w1,
        w2,
        w3,
        w4,
        w5,
        profileStatusID,
      };
  
      const id = parseInt(String(profileStatusID), 10);
      if (id >= 11 && id <= 20) {
        groupedByTaName[taName].keyValueStages.push(stageEntry);
      } else {
        groupedByTaName[taName].tableStages.push(stageEntry);
      }
    });
  
    return Object.values(groupedByTaName);
  };

  const weekHeaders = RecruiterListData[0]?.month_Name 
    ? ['W1', 'W2', 'W3', 'W4', 'W5'].map(w => `${RecruiterListData[0]?.month_Name}_${w}`) 
    : ['W1', 'W2', 'W3', 'W4', 'W5'];


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
                    <Select
                      id="selectedValue"
                      placeholder="Select Head"
                      style={{ marginLeft: "10px", width: "230px" }}
                      value={selectedHead || undefined}
                      showSearch={true}
                      onChange={(value) => {
                        setSelectedHead(value);
                      }}
                      options={filtersList?.HeadUsers?.map((v) => ({
                        label: v.data,
                        value: v.id,
                      })) || []}
                      optionFilterProp="label"
                    />              
                    <p
                      className={recruiterStyle.resetText}
                      style={{ width: "190px" }}
                      onClick={clearFilters}
                    >
                      Reset Filter
                    </p>
                  </div>
        
                  <div className={recruiterStyle.filterRight}>
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
                            setDebouncedSearchText("");
                          }}
                        />
                      )}
                    </div>   
                     <div className={recruiterStyle.calendarFilterSet}>
                        <div className={recruiterStyle.label}>Month-Year</div>
                        <div className={recruiterStyle.calendarFilter}>
                          <CalenderSVG
                            style={{ height: "16px", marginRight: "16px" }}
                          />
                          <DatePicker
                            onKeyDown={(e) => {
                              e.preventDefault();
                            }}
                            className={recruiterStyle.dateFilter}
                            placeholderText="Month - Year"
                            selected={monthDate}
                            onChange={onMonthCalenderFilter}
                            dateFormat="MM-yyyy"
                            showMonthYearPicker
                          />
                        </div>
                      </div>
                  </div>
                </div>
              </div>

        {isLoading ? (
            <TableSkeleton />
        ) : tableData.length === 0 ? (
            <div className={recruiterStyle.noDataFound}>No data available for the selected filters.</div>
        ) : (
            <div className={recruiterStyle.cardcontainer}>
            {tableData.map((recruiter) => (
                <div className={recruiterStyle.recruitercard} key={recruiter.taName}>
                <h3 className={recruiterStyle.recruitername}>{recruiter.taName}</h3>
                
                {recruiter.tableStages && recruiter.tableStages.length > 0 && (
                    <table className={recruiterStyle.stagetable}>
                    <thead>
                        <tr>
                        <th>Stage</th>
                        <th>Achieved</th>
                        {/* Use dynamic week headers if RecruiterListData[0]?.month_Name is available */}
                        {(RecruiterListData[0]?.month_Name 
                            ? ['W1', 'W2', 'W3', 'W4', 'W5'].map(w => `${RecruiterListData[0]?.month_Name}_${w}`) 
                            : ['W1', 'W2', 'W3', 'W4', 'W5']
                        ).map(wh => <th key={wh}>{wh}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {recruiter.tableStages.map((stage, index) => (
                        <tr key={index} className={getStageClass(stage.profileStatusID)}>
                            <td>{stage.profileStage}</td>
                            <td>{stage.finalTotal == 0 || stage.finalTotal === null || stage.finalTotal === undefined ? '-' : stage.finalTotal}</td>
                            <td>{stage.w1 ? stage.w1 : '-'}</td>
                            <td>{stage.w2 ? stage.w2 : '-'}</td>
                            <td>{stage.w3 ? stage.w3 : '-'}</td>
                            <td>{stage.w4 ? stage.w4 : '-'}</td>
                            <td>{stage.w5 ? stage.w5 : '-'}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                )}

                {recruiter.keyValueStages && recruiter.keyValueStages.length > 0 && (
                    <div className={recruiterStyle.keyValuePairsContainer}>
                    {recruiter.keyValueStages.map((stage, index) => {
                        let displayValue;
                        const val = stage.finalTotal;
                        const stageLabel = stage.profileStage || "";

                        if (val === null || val === undefined) {
                            displayValue = '0.00';
                        } else if (val === 0 || val === "0") { 
                            displayValue = '0.00';
                        } else if (val === "-") { 
                            displayValue = "-";
                        } else if (typeof val === 'number') {                            
                            if (stageLabel.includes('%') || stageLabel.toLowerCase().includes('per day')) {
                                displayValue = val.toFixed(2);
                            } else { 
                                displayValue = val.toLocaleString('en-IN'); 
                            }
                        } else if (typeof val === 'string') {
                            if (val.trim() === "0.00") {
                                displayValue = "0.00";
                            } else {                                
                                displayValue = val;
                            }
                        }
                         else {
                            displayValue = String(val);
                        }
                        return (
                        <div key={index} className={recruiterStyle.keyValuePair}>
                            <span className={recruiterStyle.kvLabel}>{stage.profileStage}: </span>
                            <span className={recruiterStyle.kvValue}>{displayValue}</span>
                        </div>
                        );
                    })}
                    </div>
                )}
                </div>
            ))}
            </div>
        )}

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
                  filtersType={allEngagementConfig.recruiterReportFilterTypeConfig(
                    filtersList
                  )}
                  clearFilters={clearFilters}
                />
              </Suspense>
            )}
    </div>
  )
}