import React, { useState, useEffect, useRef } from 'react'
import stylesOBj from './n_tadashboard.module.css'
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton'
import { UserSessionManagementController } from "modules/user/services/user_session_services";
import {
    Select,
    Tooltip
} from "antd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TaDashboardDAO } from "core/taDashboard/taDashboardDRO";
import { HTTPStatusCode } from "constants/network";
import DashboardTableComp from './dashboardTable';
import GoalTableComp from './goalTable';
import { useNavigate } from 'react-router-dom';
import UTSRoutes from 'constants/routes';
import moment from 'moment';
import TalentdetailsTable from './talentdetailsTable';
import TotalAchievementTable from './totalAchievementTable';
const { Option } = Select;
function NewTADashboard() {
const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [selectedHead, setSelectedHead] = useState('');
    const [userData, setUserData] = useState({});
    const [activeTable, setActiveTable] = useState('Dashboard')
    const [activeTab, setActiveTab] = useState('Contract')
    const [filtersList, setFiltersList] = useState({});
    const [filteredTagLength, setFilteredTagLength] = useState(0);
    const [talentWiseReport,setTalentWiseReport] = useState([])
    const [quarterlySummeryReport, setQuarterlySummeryReport] = useState([])
     const date = new Date();
     const [startDate, setStartDate] = useState(date);
        const [endDate, setEndDate] = useState(null);
    const [searchText, setSearchText] = useState('');
    const searchInputRef = useRef(null);
    const [debounceSearch, setDebounceSearch] = useState('')
  const [tableFilteredState, setTableFilteredState] = useState({
    filterFields_OnBoard: {
      taUserIDs: null,
      roleTypeIDs: null,
      hrStatusIDs: null,
      taskStatusIDs: null,
      modelType: null,
      priority: null,
      searchText: "",
    },
  });

    useEffect(() => {
        const getUserResult = async () => {
            let userData = UserSessionManagementController.getUserSession();
            if (userData) setUserData(userData);
        };
        getUserResult();
    }, []);

      const getFilters = async () => {
        setIsLoading(true);
        let filterResult = await TaDashboardDAO.getAllMasterContractDAO();
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

      const getTalentWiseReport = async ()=>{
let date = new Date()
        let query = `?month=${moment(date).month()}&year=${moment(date).year()}`

        const result =  await TaDashboardDAO.getTalentWiseReportContractDAO(query);
        setIsLoading(false);
        if (result.statusCode === HTTPStatusCode.OK) {
          setTalentWiseReport(result && result?.responseBody);
        } else if (result?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
          // setLoading(false); 
          return navigate(UTSRoutes.LOGINROUTE);
        } else if (
          result?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
        ) {
          // setLoading(false);
          return navigate(UTSRoutes.SOMETHINGWENTWRONG);
        } else {
          return "NO DATA FOUND";
        }
      }

    const  getQuarterlySummeryReport = async () => {
        let date = new Date()
        let query = `?poduserid=${selectedHead}&month=${moment(date).month()}&year=${moment(date).year()}`
        const result =  await TaDashboardDAO.getQuarterlySummeryReportContractDAO(query );
        console.log('result', result)
         if (result.statusCode === HTTPStatusCode.OK) {
          setQuarterlySummeryReport(result && result?.responseBody);
        } else if (result?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
          // setLoading(false); 
          return navigate(UTSRoutes.LOGINROUTE);
        } else if (
          result?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
        ) {
          // setLoading(false);
          return navigate(UTSRoutes.SOMETHINGWENTWRONG);
        } else {
          return "NO DATA FOUND";
        }
    }

      useEffect(() => {
        selectedHead &&  getQuarterlySummeryReport()
        }, [selectedHead]);

        useEffect(() => {
          getFilters();
          getTalentWiseReport()
        }, []);

      useEffect(() => {
        if (filtersList?.HeadUsers?.length) {
          if (userData?.UserId === 176) {
            let PoojaPatel = filtersList?.HeadUsers?.find((head) => head.data === "Pooja Patel");
            setSelectedHead(PoojaPatel?.id);
          } else {
            setSelectedHead(filtersList?.HeadUsers[0]?.id);
          }
    
        }
      }, [filtersList?.HeadUsers, userData]);

      const onCalenderFilter = (dates) => {
        const [start, end] = dates;

        setStartDate(start);
        setEndDate(end);

        if (start && end) {
            // setTableFilteredState({
            //     ...tableFilteredState,
            //     filterFields_ViewAllHRs: {
            //         ...tableFilteredState.filterFields_ViewAllHRs,
            //         fromDate: new Date(start).toLocaleDateString("en-US"),
            //         toDate: new Date(end).toLocaleDateString("en-US"),
            //     },
            // });
        }
    };

    return (
        <div className={`${stylesOBj["dashboard-container"]}`}>


            {/* <!-- Main Content Area --> */}
            <main className={`${stylesOBj["main-content"]}`}>

                <div className={stylesOBj["toggle-group"]} style={{ width: '210px', margin: '10px 0 0 10px' }}>
                        <button
                            className={`${stylesOBj["toggle-btn"]}  ${activeTab === 'Full-Time' ? stylesOBj["toggle-btn-active"] : ''}`}
                            onClick={() => {
                                setActiveTab('Full-Time')
                            }}
                        >Full-Time</button>
                        <button
                            className={`${stylesOBj["toggle-btn"]} ${activeTab=== 'Contract' ? stylesOBj["toggle-btn-active"] : ''}`}
                            onClick={() => {
                                setActiveTab('Contract')
                            }}
                        >Contract</button>

                    </div>
                <div className={stylesOBj.filterContainer}>

               <TalentdetailsTable isLoading={isLoading} talentWiseReport={talentWiseReport}/>
                </div>

                  <div className={stylesOBj.filterContainer}>
                    <h2 style={{fontWeight:'bold'}}>Total Achievement (Closure Month)</h2>
                    <TotalAchievementTable quarterlySummeryReport={quarterlySummeryReport} />
                  </div>

                <div className={stylesOBj.filterContainer}>
                    <div className={stylesOBj.addtaskcontainer}>  <div className={stylesOBj["toggle-group"]} style={{ width: '335px' }}>
                        <button
                            className={`${stylesOBj["toggle-btn"]}  ${activeTable === 'Dashboard' ? stylesOBj["toggle-btn-active"] : ''}`}
                            onClick={() => {
                                setActiveTable('Dashboard')
                            }}
                        >Dashboard</button>
                        <button
                            className={`${stylesOBj["toggle-btn"]} ${activeTable === 'Goal' ? stylesOBj["toggle-btn-active"] : ''}`}
                            onClick={() => {
                                setActiveTable('Goal')
                            }}
                        >Goal vs Achieved Targets</button>

                    </div>

                        {userData?.showTADashboardDropdowns && activeTable === 'Dashboard' && (
                            <button
                                className={stylesOBj.btnPrimary}
                                onClick={() => {
                                    //   setIsAddNewRow(true);
                                    //   setNewTAHeadUserValue(selectedHead);
                                }}
                            >
                                Add New Task
                            </button>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Select
                            id="selectedValue"
                            placeholder="Select TA"
                            style={{ marginLeft: "10px", width: "270px" }}
                            // mode="multiple"
                            value={selectedHead}
                            showSearch={true}
                            onChange={(value, option) => {
                                setSelectedHead(value);
                            }}
                            options={filtersList?.HeadUsers?.map((v) => ({
                                label: v.data,
                                value: v.id,
                            }))}
                            optionFilterProp="label"
                        />

                        {activeTable === 'Goal' &&     <div className={`${stylesOBj.calendarFilter}`} >
                            <DatePicker
                                style={{ backgroundColor: "red" }}
                                onKeyDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                className={stylesOBj.dateFilter}
                                placeholderText="Select Date"
                                selected={startDate}
                                onChange={onCalenderFilter}
                                startDate={startDate}
                                // endDate={endDate}
                                // selectsRange
                            />

                            {(startDate && endDate) && <Tooltip title="Reset date range">
                                <span style={{ color: 'red', fontWeight: 'bold', fontSize: 'Large', position: 'absolute', right: '40px', cursor: 'pointer' }} onClick={e => {
                                    e.stopPropagation();
                                    // setDebouncedSear
                                    // setTableFilteredState({
                                    //     ...tableFilteredState,
                                    //     filterFields_ViewAllHRs: {
                                    //         ...tableFilteredState.filterFields_ViewAllHRs,
                                    //         fromDate: null,
                                    //         toDate: null,
                                    //     },
                                    // });
                                    setEndDate(null);
                                    setStartDate(null);
                                }}>X</span>
                            </Tooltip>}
                            <img src="images/calendar-ic.svg" alt="Calendar Icon" className={`${stylesOBj["input-icon"]}`} />

                        </div>}

                       {activeTable === 'Dashboard' && <>
                       <button className={stylesOBj["filter-btn"]} onClick={() => { }}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <img src="images/filter-ic.svg" alt="Filter" />
                                <span>Add Filters</span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <div className={stylesOBj["filterCount"]}>{filteredTagLength}</div>
                                {filteredTagLength > 0 && (
                                    <Tooltip title="Reset Filters">
                                        <span style={{ color: 'red', fontWeight: 'bold', cursor: 'pointer' }}
                                            onClick={(e) => { e.stopPropagation(); }}>
                                            X
                                        </span>
                                    </Tooltip>
                                )}
                            </div>
                        </button>

                        <div className={`${stylesOBj["filter-group"]} ${stylesOBj["search-group"]}`} style={{ marginLeft: 'auto', marginRight: '10px' }}>
                            <input
                                ref={searchInputRef}
                                type="text"
                                className={stylesOBj["filter-input"]}
                                placeholder="Search"
                                value={debounceSearch}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        setSearchText(debounceSearch);
                                    }
                                }}
                                onChange={e => setDebounceSearch(e.target.value)}
                            />
                            {searchText.length > 0 && (
                                <Tooltip title="Clear search">
                                    <span style={{ position: 'absolute', right: '36px', color: 'red', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
                                        onClick={() => { setSearchText(''); setDebounceSearch(''); }}>
                                        X
                                    </span>
                                </Tooltip>
                            )}
                            <Tooltip title="search">
                                <img
                                    src="images/search-ic.svg"
                                    onClick={() => {
                                        if (searchInputRef?.current) searchInputRef.current.focus();
                                        setSearchText(debounceSearch);
                                    }}
                                    alt="Search"
                                    className={stylesOBj["input-icon"]}
                                    style={{ cursor: 'pointer' }}
                                />
                            </Tooltip>
                        </div>
                       </>} 

                    </div>

                    {activeTable === 'Dashboard' && <DashboardTableComp selectedHead={selectedHead} searchText={searchText} tableFilteredState={tableFilteredState}/>}
                    {activeTable === 'Goal' && <GoalTableComp selectedHead={selectedHead} startDate={startDate} tableFilteredState={tableFilteredState} />}
                </div>
            </main>
        </div>
    )
}

export default NewTADashboard