import React, {
	useState,
	useEffect,
	Suspense,
	useCallback,
    useMemo,
} from 'react';
import { Dropdown, Menu, Table, Modal,Select, AutoComplete } from 'antd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
	InputType,
} from 'constants/application';
import UTSRoutes from 'constants/routes';
import { IoChevronDownOutline } from 'react-icons/io5';
import _debounce from 'lodash/debounce';
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton';
import WithLoader from 'shared/components/loader/loader';
import clienthappinessSurveyStyles from '../survey/client_happiness_survey.module.css';
import { ReactComponent as FunnelSVG } from 'assets/svg/funnel.svg';
import { ReactComponent as SearchSVG } from 'assets/svg/search.svg';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { clientHappinessSurveyConfig } from 'modules/hiring request/screens/clientHappinessSurvey/clientHappinessSurvey.config';
import { allClientRequestDAO } from 'core/allClients/allClientsDAO';
import { HTTPStatusCode } from 'constants/network';
import { allClientsConfig } from 'modules/hiring request/screens/allClients/allClients.config';
import { downloadToExcel } from 'modules/report/reportUtils';

const AllClientFiltersLazy = React.lazy(() =>
	import('modules/allClients/components/allClients/allClientsFilter'),
);
function AllClients() {
    const navigate = useNavigate();
    const {
		register,
		setValue,
		control,
		watch,		
		formState: { errors },
	} = useForm();   

    const pageSizeOptions = [100, 200, 300, 500, 1000,5000];
    const [tableFilteredState, setTableFilteredState] = useState({       
        pagenumber:1,
        totalrecord:100,
        filterFields_Client:{
            companyStatus: "",
            geo: "",
            addingSource: "",
            category: "",
            poc: "",
            fromDate: "",
            toDate: "",
            searchText: ""
        }
	});
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageSize, setPageSize] = useState(100);    
	const [pageIndex, setPageIndex] = useState(1);
	const [isLoading, setLoading] = useState(false);

    /*--------- React DatePicker ---------------- */
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
    const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState(search);

    const [filteredTagLength, setFilteredTagLength] = useState(0);
    const [filtersList, setFiltersList] = useState([]);
    const [getHTMLFilter, setHTMLFilter] = useState(false);
    const [isAllowFilters, setIsAllowFilters] = useState(false);
    const [appliedFilter, setAppliedFilters] = useState(new Map());
    const [checkedState, setCheckedState] = useState(new Map());
    const [allClientsList,setAllClientList] = useState([]);
     
	const getFilterRequest = useCallback(async () => {
		// const response = await hiringRequestDAO.getAllFilterDataForHRRequestDAO();
        const  response = await allClientRequestDAO.getClientFilterDAO();
		if (response?.statusCode === HTTPStatusCode.OK) {
			setFiltersList(response && response?.responseBody?.Data);
		} else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
			return navigate(UTSRoutes.LOGINROUTE);
		} else if (response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
			return navigate(UTSRoutes.SOMETHINGWENTWRONG);
		} else {
			return 'NO DATA FOUND';
		}
	}, [navigate]);

	useEffect(()=>{
		getFilterRequest();
	},[getFilterRequest])



    useEffect(() => {
        getAllClientsList(tableFilteredState);
    },[tableFilteredState]);

    const modifyResponseData = (data) => {
    return data.map((item) => ({...item,
        addedDate:item.addedDate.split(' ')[0],
    }))
    }
   
    const getAllClientsList = useCallback(async (requestData) => {
        // setLoading(true);
        let response = await allClientRequestDAO.getAllClientsListDAO(requestData);
        if (response?.statusCode === HTTPStatusCode.OK) {                 
            // if(isExport){
            //     setLoading(false); 
            //     let _data = modifyResponseData(response?.responseBody?.rows);
            //     downloadToExcel(_data);
            //     return 
            // }
            setAllClientList(modifyResponseData(response?.responseBody?.rows));
            setTotalRecords(response?.responseBody?.totalrows);
            setLoading(false);          
        } else if (response?.statusCode === HTTPStatusCode.NOT_FOUND) {
            setLoading(false);
            setTotalRecords(0);
            setAllClientList([]);
        } else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
            setLoading(false);
            return navigate(UTSRoutes.LOGINROUTE);
        } else if (
            response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
        ) {
            setLoading(false);
            return navigate(UTSRoutes.SOMETHINGWENTWRONG);
        } else {
            setLoading(false);
            setAllClientList([]);
            return 'NO DATA FOUND';
        }
	}, [navigate]); 

    const onCalenderFilter = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);  
        if (start && end) {
            const startDate_parts = new Date(start).toLocaleDateString('en-US').split('/'); 
            const sDate = `${startDate_parts[2]}-${startDate_parts[0].padStart(2, '0')}-${startDate_parts[1].padStart(2, '0')}`;
            const endDate_parts = new Date(end).toLocaleDateString('en-US').split('/'); 
            const eDate = `${endDate_parts[2]}-${endDate_parts[0].padStart(2, '0')}-${endDate_parts[1].padStart(2, '0')}`;
            setTableFilteredState(prevState => ({
                ...prevState,
                filterFields_Client: {
                  ...prevState.filterFields_Client,
                  fromDate: sDate,
                  toDate: eDate,
                }
              }));			
		}
    };

    const debouncedSearchHandler = (e) => {
        setTableFilteredState(prevState => ({
            ...prevState,
            pagenumber:1,
            filterFields_Client: {
              ...prevState.filterFields_Client,
              searchText: e.target.value,
            }
          }));       
        setDebouncedSearch(e.target.value)
        setPageIndex(1); 
    };
  
	const clearFilters = useCallback(() => {
		setAppliedFilters(new Map());
		setCheckedState(new Map());
		setFilteredTagLength(0);
        setPageSize(100);
        setPageIndex(1);
        setDebouncedSearch(search);
		setTableFilteredState({       
            pagenumber:1,
            totalrecord:100,
            filterFields_Client:{
                RatingFrom :0,
                RatingTo :10,
            }
        });
		// const reqFilter = {
		// 	tableFilteredState:{...tableFilteredState,...{
		// 		pagesize: 100,
		// 		pagenum: 1,
		// 		sortdatafield: 'CreatedDateTime',
		// 		sortorder: 'desc',
		// 		searchText: '',
		// 	}},
		// 	filterFields_ViewAllHRs: {},
		// };
		// handleHRRequest(reqFilter);
		setIsAllowFilters(false);
		setEndDate(null)
		setStartDate(null)
		// setDebouncedSearch('')
		// setIsFocusedRole(false)
		// setPageIndex(1);
		// setPageSize(100);
	}, [
		// handleHRRequest,
		// setAppliedFilters,
		// setCheckedState,
		// setFilteredTagLength,
		// setIsAllowFilters,
		// setTableFilteredState,
		// tableFilteredState,
	]);

    const onRemoveSurveyFilters = () => {
		setIsAllowFilters(false);
	};

    const toggleSurveyFilter = useCallback(() => {		
        !getHTMLFilter
            ? setIsAllowFilters(true)
            : setTimeout(() => {
                    setIsAllowFilters(true);
            }, 300);
        setHTMLFilter(!getHTMLFilter);
    }, [getHTMLFilter]);

    const handleExport = async () => {      
		downloadToExcel(allClientsList);
    }

    const allClientsColumnsMemo = useMemo(
		() => allClientsConfig.tableConfig(),
		[],
	); 
    return(
        <>
            <div className={clienthappinessSurveyStyles.hiringRequestContainer}>
                <div className={clienthappinessSurveyStyles.addnewHR}>
                    <div className={clienthappinessSurveyStyles.hiringRequest}>All Clients</div>
                    <div className={clienthappinessSurveyStyles.btn_wrap}>
                        <button className={clienthappinessSurveyStyles.btnwhite} onClick={() => handleExport()}>Export</button>
                    </div>
                </div>

                <div className={clienthappinessSurveyStyles.filterContainer}>
                        <div className={clienthappinessSurveyStyles.filterSets}>
                            <div className={clienthappinessSurveyStyles.filterSetsInner} >
                                <div className={clienthappinessSurveyStyles.addFilter} onClick={toggleSurveyFilter}>
                                    <FunnelSVG style={{ width: '16px', height: '16px' }} />

                                    <div className={clienthappinessSurveyStyles.filterLabel}>Add Filters</div>
                                    <div className={clienthappinessSurveyStyles.filterCount}>{filteredTagLength}</div>                            
                                </div>
                                <p onClick={()=> clearFilters() }>Reset Filters</p>                        
                            </div>
                        
                            <div className={clienthappinessSurveyStyles.filterRight}>

                                <div className={clienthappinessSurveyStyles.searchFilterSet}>
                                    <SearchSVG style={{ width: '16px', height: '16px' }} />
                                    <input
                                        type={InputType.TEXT}
                                        className={clienthappinessSurveyStyles.searchInput}
                                        placeholder="Search Table"
                                        onChange={debouncedSearchHandler}
                                        value={debouncedSearch}
                                    />
                                </div>
                            
                                <div className={clienthappinessSurveyStyles.calendarFilterSet}>
                                    <div className={clienthappinessSurveyStyles.label}>Date</div>
                                    <div className={clienthappinessSurveyStyles.calendarFilter}>
                                        <CalenderSVG style={{ height: '16px', marginRight: '16px' }} />
                                        <DatePicker
                                            style={{ backgroundColor: 'red' }}
                                            onKeyDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                            className={clienthappinessSurveyStyles.dateFilter}
                                            placeholderText="Start date - End date"
                                            selected={startDate}
                                            onChange={onCalenderFilter}
                                            dateFormat='dd/MM/yyyy'
                                            startDate={startDate}
                                            endDate={endDate}
                                            selectsRange
                                        />
                                    </div>
                                </div>
                                
                                <div className={clienthappinessSurveyStyles.priorityFilterSet}>
                                    <div className={clienthappinessSurveyStyles.label}>Showing</div>
                                    <div className={clienthappinessSurveyStyles.paginationFilter}>
                                        <Dropdown
                                            trigger={['click']}
                                            placement="bottom"
                                            overlay={
                                                <Menu onClick={(e) => {
                                                    setPageSize(parseInt(e.key));                                           
                                                    if (pageSize !== parseInt(e.key)) {
                                                        setTableFilteredState(prevState => ({
                                                            ...prevState,
                                                            totalrecord: parseInt(e.key),
                                                            pagenumber: pageIndex,
                                                        }));                                             
                                                    }
                                                }}>
                                                    {pageSizeOptions.map((item) => {
                                                        return <Menu.Item key={item}>{item}</Menu.Item>;
                                                    })}
                                                </Menu>
                                            }>
                                            <span>
                                                {pageSize}
                                                <IoChevronDownOutline
                                                    style={{ paddingTop: '5px', fontSize: '16px' }}
                                                />
                                            </span>									
                                        </Dropdown>
                                    </div>
                                </div>
                            </div>

                        </div>
                </div>    

                <div className={clienthappinessSurveyStyles.tableDetails}>
                                {isLoading ? (
                                    <TableSkeleton />
                                ) : (
                                    <WithLoader className="mainLoader">
                                        <Table dataSource={allClientsList} columns={allClientsColumnsMemo}
                                        pagination={
                                            search && search?.length === 0
                                                ? null
                                                : {
                                                        onChange: (pageNum, pageSize) => {
                                                            setPageIndex(pageNum);
                                                            setPageSize(pageSize);
                                                            setTableFilteredState(prevState => ({
                                                                ...prevState,                                                        
                                                                pagenumber: pageNum,
                                                              }));
                                                        },
                                                        size: 'small',
                                                        pageSize: pageSize,
                                                        pageSizeOptions: pageSizeOptions,
                                                        total: totalRecords,
                                                        showTotal: (total, range) =>
                                                            `${range[0]}-${range[1]} of ${totalRecords} items`,
                                                        defaultCurrent: pageIndex,
                                                  }
                                        }       
                                        
                                        />;
                                    </WithLoader>
                            )} 
                </div>
            </div>

            {isAllowFilters && (
                        <Suspense fallback={<div>Loading...</div>}>
                            <AllClientFiltersLazy				
                                setIsAllowFilters={setIsAllowFilters}						
                                setFilteredTagLength={setFilteredTagLength}
                                getHTMLFilter={getHTMLFilter}
                                filtersType={allClientsConfig.allClientsTypeConfig(filtersList && filtersList)}
                                clearFilters={clearFilters}
                                onRemoveSurveyFilters={onRemoveSurveyFilters}
                                setAppliedFilters={setAppliedFilters}
                                appliedFilter={appliedFilter}
                                setCheckedState={setCheckedState}
                                checkedState={checkedState}
                                setTableFilteredState={setTableFilteredState}
                                tableFilteredState={tableFilteredState}                        
					        />
				        </Suspense>
			)}   
        </>
    )
}





export default AllClients;