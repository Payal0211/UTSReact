import React, {
	useState,
	useEffect,
	Suspense,
	useMemo,
	useCallback,
} from 'react';
import { Dropdown, Menu, message, Table, Tooltip, Modal,Checkbox } from 'antd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import {
	AddNewType,
	DayName,
	InputType,
	UserAccountRole,
} from 'constants/application';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import { ReactComponent as ArrowDownSVG } from 'assets/svg/arrowDown.svg';
import { ReactComponent as FunnelSVG } from 'assets/svg/funnel.svg';
import { ReactComponent as SearchSVG } from 'assets/svg/search.svg';
import { ReactComponent as LockSVG } from 'assets/svg/lock.svg';
import { ReactComponent as UnlockSVG } from 'assets/svg/unlock.svg';
import { useAllHRQuery } from 'shared/hooks/useAllHRQuery';
import { hrUtils } from 'modules/hiring request/hrUtils';
import { IoChevronDownOutline } from 'react-icons/io5';
import allHRStyles from './hrLostReport.module.css';
import UTSRoutes from 'constants/routes';

import HROperator from 'modules/hiring request/components/hroperator/hroperator';
import { DateTimeUtils } from 'shared/utils/basic_utils';
import WithLoader from 'shared/components/loader/loader';
import { HTTPStatusCode } from 'constants/network';
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton';
import DownArrow from 'assets/svg/arrowDown.svg';
import Prioritycount from 'assets/svg/priority-count.svg';
import Remainingcount from 'assets/svg/remaining-count.svg';
import { MasterDAO } from 'core/master/masterDAO';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import _debounce from 'lodash/debounce';
import { downloadToExcel } from 'modules/report/reportUtils';

import { allHRConfig } from '../../../hiring request/screens/allHiringRequest/allHR.config';
import { ReportDAO } from 'core/report/reportDAO';
import moment from 'moment';

/** Importing Lazy components using Suspense */
const HiringFiltersLazyComponent = React.lazy(() =>
	import('modules/hiring request/components/hiringFilter/hiringFilters'),
);

export default function HRLostReport() {
    var date = new Date();
    const [tableFilteredState, setTableFilteredState] = useState({
		pageSize: 100,
		pageIndex: 1,
        filterFeild_HRLost: {
            "hrLostFromDate": moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('yyyy-MM-DD'),
            "hrLostToDate": moment(new Date(date.getFullYear(), date.getMonth() + 1, 0)).format('yyyy-MM-DD'),
            "lostReason": "",
            "salesUser": "",
            "client": "",
            "searchText": ""
          }
	});
	const [isLoading, setLoading] = useState(false);

	const pageSizeOptions = [100, 200, 300, 500, 1000,5000];
	// const hrQueryData = useAllHRQuery();
	const [totalRecords, setTotalRecords] = useState(0);
	const [pageIndex, setPageIndex] = useState(1);
	const [pageSize, setPageSize] = useState(100);
	const [isAllowFilters, setIsAllowFilters] = useState(false);
	const [getHTMLFilter, setHTMLFilter] = useState(false);
	const [filtersList, setFiltersList] = useState([]);
	const [apiData, setAPIdata] = useState([]);
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState(search);
	const navigate = useNavigate();
	const [filteredTagLength, setFilteredTagLength] = useState(0);
	const [appliedFilter, setAppliedFilters] = useState(new Map());
	const [checkedState, setCheckedState] = useState(new Map());
	const [isOpen, setIsOpen] = useState(false);
	const [priorityCount, setPriorityCount] = useState([]);
	const [messageAPI, contextHolder] = message.useMessage();
	const [openCloneHR, setCloneHR] = useState(false);
	const [getHRnumber, setHRNumber] = useState('');
	const [getHRID, setHRID] = useState('');
	const [reopenHrData, setReopenHRData] = useState({})
	const [reopenHrModal, setReopenHrModal] = useState(false);
	const [ closeHRDetail, setCloseHRDetail] = useState({});
	const [closeHrModal, setCloseHrModal] = useState(false);
	const [isFocusedRole, setIsFocusedRole] = useState(false);
	const [userData, setUserData] = useState({});
    const [talentID,setTalentID] = useState(null)
    const [showTalentDetails,setShowTalentDetails] = useState(false)
    const [talentDetails, setTalentDetails] = useState([])


	const [startDate, setStartDate] = useState(new Date(date.getFullYear(), date.getMonth(), 1));
	const [endDate, setEndDate] = useState(new Date(date.getFullYear(), date.getMonth() + 1, 0));

	useEffect(() => {
		const getUserResult = async () => {
			let userData = UserSessionManagementController.getUserSession();
			if (userData) setUserData(userData);
		};
		getUserResult();
	}, []);

	const onRemoveHRFilters = () => {
		setTimeout(() => {
			setIsAllowFilters(false);
		}, 300);
		setHTMLFilter(false);
	};


	const miscData = UserSessionManagementController.getUserMiscellaneousData();

    const talentDtailOpen = (val)=> {
        setShowTalentDetails(true)
        setTalentID({id:val.hrid, no: val.hR_Number})
    }

    // get Talent Details
    useEffect(()=>{
        const getTalentDetails = async ()=>{
            let result= await ReportDAO.getLostHRTalentDetailDRO(talentID?.id)

            if(result.statusCode === HTTPStatusCode.OK){
                setTalentDetails(result.responseBody)
            }

            if(result.statusCode === HTTPStatusCode.NOT_FOUND){
                setTalentDetails([])
            }
        }

if(talentID?.id){
    getTalentDetails()
}
        
    },[talentID])

	const tableColumnsMemo = useMemo(
		() =>
			allHRConfig.lostTabelConfig(talentDtailOpen),
		[userData.LoggedInUserTypeID],
	);

    const talentTableColumnsMemo = useMemo(
		() =>
			allHRConfig.lostTanlentTabelConfig(),
		[userData.LoggedInUserTypeID],
	);

	const handleHRRequest = useCallback(
		async (pageData) => {
			setLoading(true);       
            let response = await ReportDAO.getHRLostReportDRO(pageData)
            setLoading(false);
			if (response?.statusCode === HTTPStatusCode.OK) {
				setTotalRecords(response?.responseBody?.totalrows);
				setLoading(false);
				setAPIdata(response?.responseBody?.rows);
			} else if (response?.statusCode === HTTPStatusCode.NOT_FOUND) {
				setLoading(false);
				setTotalRecords(0);
				setAPIdata([]);
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
				return 'NO DATA FOUND';
			}
		},
		[navigate,isFocusedRole],
	);


	const debounceFun = useMemo(
		(value) => _debounce(handleHRRequest, 4000),
		[handleHRRequest],
	);
	const debouncedSearchHandler = (e) => {
		if(e.target.value.length > 3 || e.target.value === ''){
			setTimeout(()=>{
			setTableFilteredState({
			...tableFilteredState,
			pageIndex:1,
            filterFeild_HRLost: {
                ...tableFilteredState.filterFeild_HRLost,
                searchText: e.target.value,
              }			
		});
		
		},2000)
		}
		
		setDebouncedSearch(e.target.value)
		setPageIndex(1)
		//debounceFun(e.target.value);
	};

	const handleRequetWithDates = useCallback(()=>{ 
		if(startDate && endDate){
			handleHRRequest({...tableFilteredState, filterFeild_HRLost: {
				...tableFilteredState.filterFeild_HRLost,
                hrLostFromDate: new Date(startDate).toLocaleDateString('en-US'),
                hrLostToDate: new Date(endDate).toLocaleDateString('en-US'),
	}})
		}else {
			handleHRRequest(tableFilteredState)
		}
		
	},[tableFilteredState,endDate,startDate,isFocusedRole])

	useEffect(() => {
		// handleHRRequest(tableFilteredState);
		handleRequetWithDates()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tableFilteredState,isFocusedRole]);

	// const getHRFilterRequest = useCallback(async () => {
	// 	const response = await hiringRequestDAO.getAllFilterDataForHRRequestDAO();
	// 	if (response?.statusCode === HTTPStatusCode.OK) {
	// 		setFiltersList(response && response?.responseBody?.details?.Data);
	// 	} else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
	// 		return navigate(UTSRoutes.LOGINROUTE);
	// 	} else if (response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
	// 		return navigate(UTSRoutes.SOMETHINGWENTWRONG);
	// 	} else {
	// 		return 'NO DATA FOUND';
	// 	}
	// }, [navigate]);

	// useEffect(()=>{
	// 	getHRFilterRequest();
	// },[getHRFilterRequest])

	const toggleHRFilter = useCallback(() => {		
		!getHTMLFilter
			? setIsAllowFilters(true)
			: setTimeout(() => {
					setIsAllowFilters(true);
			  }, 300);
		setHTMLFilter(!getHTMLFilter);
	}, [getHTMLFilter]);

	/*--------- React DatePicker ---------------- */
	

	const onCalenderFilter = (dates) => {
		const [start, end] = dates;

		setStartDate(start);
		setEndDate(end);

		if (start && end) {
			setTableFilteredState({
				...tableFilteredState,
				filterFeild_HRLost: {
					...tableFilteredState.filterFeild_HRLost,
					hrLostFromDate: new Date(start).toLocaleDateString('en-US'),
					hrLostToDate: new Date(end).toLocaleDateString('en-US'),
				},
			});
			handleHRRequest({
				...tableFilteredState,
				filterFeild_HRLost: {
					...tableFilteredState.filterFeild_HRLost,
					hrLostFromDate: new Date(start).toLocaleDateString('en-US'),
					hrLostToDate: new Date(end).toLocaleDateString('en-US'),
				},
			});
		}
	};

	useEffect(() => {
		localStorage.removeItem('hrID');
		localStorage.removeItem('fromEditDeBriefing');
	}, []);

	const handleExport = (apiData) => {
		let DataToExport =  apiData.map(data => {
			let obj = {}			
			tableColumnsMemo.map(val => val.dataIndex !== ' ' && (obj[`${val.title}`] = data[`${val.dataIndex}`]))		
		return obj;
			}
		 )
		 downloadToExcel(DataToExport)
	}

	const clearFilters = useCallback(() => {
		setAppliedFilters(new Map());
		setCheckedState(new Map());
		setFilteredTagLength(0);
		setTableFilteredState({
            pageSize: 100,
            pageIndex: 1,
			filterFeild_HRLost: {
                "hrLostFromDate": moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('yyyy-MM-DD'),
                "hrLostToDate": moment(new Date(date.getFullYear(), date.getMonth() + 1, 0)).format('yyyy-MM-DD'),
                "lostReason": "",
                "salesUser": "",
                "client": "",
                "searchText": ""
              },
		});
		const reqFilter = {
            pageSize: 100,
            pageIndex: 1,
			filterFeild_HRLost: {
                "hrLostFromDate": moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('yyyy-MM-DD'),
                "hrLostToDate": moment(new Date(date.getFullYear(), date.getMonth() + 1, 0)).format('yyyy-MM-DD'),
                "lostReason": "",
                "salesUser": "",
                "client": "",
                "searchText": ""
              },
		};
        setStartDate(new Date(date.getFullYear(), date.getMonth(), 1))
        setEndDate(new Date(date.getFullYear(), date.getMonth() + 1, 0))
		handleHRRequest(reqFilter);
		setIsAllowFilters(false);
		setDebouncedSearch('')
		setIsFocusedRole(false)
		setPageIndex(1);
		setPageSize(100);
	}, [
		handleHRRequest,
		setAppliedFilters,
		setCheckedState,
		setFilteredTagLength,
		setIsAllowFilters,
		setTableFilteredState,
		tableFilteredState,
	]);


  return (
    <div className={allHRStyles.hiringRequestContainer}>
        <div className={allHRStyles.addnewHR}>
				<div className={allHRStyles.hiringRequest}>HR Lost Report</div>
                <div className={allHRStyles.btn_wrap}>
                <button
								className={allHRStyles.btnPrimary}								
								onClick={() => handleExport(apiData)}>
								Export
							</button>
                </div>
        </div>

        	{/*
			 * --------- Filter Component Starts ---------
			 * @Filter Part
			 */}
			<div className={allHRStyles.filterContainer}>
				<div className={allHRStyles.filterSets}>
				<div className={allHRStyles.filterSetsInner} >
					{/* <div
						className={allHRStyles.addFilter}
						onClick={toggleHRFilter}>
						<FunnelSVG style={{ width: '16px', height: '16px' }} />

						<div className={allHRStyles.filterLabel}>Add Filters</div>
						<div className={allHRStyles.filterCount}>{filteredTagLength}</div>
					</div> */}
					<p onClick={()=> clearFilters() }>Reset Filters</p>
			 	</div>
					<div className={allHRStyles.filterRight}>
					{/* <Checkbox checked={isFocusedRole} onClick={()=> setIsFocusedRole(prev=> !prev)}>
					Show only Focused Role
						</Checkbox>	 */}
						<div className={allHRStyles.searchFilterSet}>
							<SearchSVG style={{ width: '16px', height: '16px' }} />
							<input
								type={InputType.TEXT}
								className={allHRStyles.searchInput}
								placeholder="Search via HR#, Company , Client"
								onChange={debouncedSearchHandler}
								value={debouncedSearch}
							/>
						</div>
						<div className={allHRStyles.calendarFilterSet}>
							<div className={allHRStyles.label}>Date</div>
							<div className={allHRStyles.calendarFilter}>
								<CalenderSVG style={{ height: '16px', marginRight: '16px' }} />
								<DatePicker
									style={{ backgroundColor: 'red' }}
									onKeyDown={(e) => {
										e.preventDefault();
										e.stopPropagation();
									}}
									className={allHRStyles.dateFilter}
									placeholderText="Start date - End date"
									selected={startDate}
									onChange={onCalenderFilter}
									startDate={startDate}
									endDate={endDate}
									selectsRange
								/>
							</div>
						</div>
						{/* <div className={allHRStyles.priorityFilterSet}>
							<div className={allHRStyles.label}>Set Priority</div>
							<div
								className={allHRStyles.priorityFilter}
								style={{
									cursor:
										DateTimeUtils.getTodaysDay() === DayName.FRIDAY
											? 'not-allowed'
											: 'pointer',
								}}>
								{DateTimeUtils.getTodaysDay() === DayName.FRIDAY ? (
									<Tooltip
										placement="bottom"
										title="Locked">
										<LockSVG
											style={{
												width: '18px',
												height: '18px',
												cursor:
													DateTimeUtils.getTodaysDay() === DayName.FRIDAY
														? 'not-allowed'
														: 'pointer',
											}}
										/>
									</Tooltip>
								) : (
									<Tooltip
										placement="bottom"
										title="Unlocked">
										<UnlockSVG style={{ width: '18px', height: '18px' }} />
									</Tooltip>
								)}
							</div>
						</div> */}
						<div className={allHRStyles.priorityFilterSet}>
							<div className={allHRStyles.label}>Showing</div>

							<div className={allHRStyles.paginationFilter}>
								<Dropdown
									trigger={['click']}
									placement="bottom"
									overlay={
										<Menu
											onClick={(e) => {
												setPageSize(parseInt(e.key));
												if (pageSize !== parseInt(e.key)) {
													handleHRRequest({
														...tableFilteredState,
														pageSize: parseInt(e.key),
														pageIndex: pageIndex,
													});
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

            <div className={allHRStyles.tableDetails}>
				{isLoading ? (
					<TableSkeleton />
				) : (
					<WithLoader className="mainLoader">
						<Table
							scroll={{ x: '100vw', y: '100vh' }}
							id="hrListingTable"
							columns={tableColumnsMemo}
							bordered={false}
							dataSource={
								// search && search.length > 0 ? [...search] : [...apiData]
								search && search?.length === 0
									? []
									: search && search.length > 0
									? [...search]
									: [...apiData]
							}
							pagination={
								search && search?.length === 0
									? null
									: {
											onChange: (pageNum, pageSize) => {
												setPageIndex(pageNum);
												setPageSize(pageSize);
												setTableFilteredState({
													...tableFilteredState,
													pageSize: pageSize,
													pageIndex: pageNum,
												});
												handleHRRequest({
													pageSize: pageSize,
													pageIndex: pageNum,
												});
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
						/>
					</WithLoader>
				)}
			</div>

            {isAllowFilters && (
				<Suspense fallback={<div>Loading...</div>}>
					<HiringFiltersLazyComponent
						setAppliedFilters={setAppliedFilters}
						appliedFilter={appliedFilter}
						setCheckedState={setCheckedState}
						setIsAllowFilters={setIsAllowFilters}
						checkedState={checkedState}
						handleHRRequest={handleHRRequest}
						setTableFilteredState={setTableFilteredState}
						tableFilteredState={tableFilteredState}
						setFilteredTagLength={setFilteredTagLength}
						onRemoveHRFilters={onRemoveHRFilters}
						getHTMLFilter={getHTMLFilter}
						hrFilterList={[]}
						filtersType={[]}
						clearFilters={clearFilters}
					/>
				</Suspense>
			)} 

            <Modal
				width={'700px'}
				centered
				footer={false}
				open={showTalentDetails}
				className="cloneHRConfWrap"
				onCancel={() => {setShowTalentDetails(false);setTalentID(null);setTalentDetails([])}}>
				<div>
                  <h2>Talent details ({talentID?.no ? talentID?.no : ''})</h2> 
                  <Table
							scroll={{ y: '100vh' }}
							id="hrListingTable"
							columns={talentTableColumnsMemo}
							bordered={false}
							dataSource={talentDetails}
							pagination={false}
						/>
                    <button
								className={allHRStyles.btnPrimary}
                                style={{marginTop:'10px'}}								
								onClick={() => {setShowTalentDetails(false);setTalentID(null);setTalentDetails([])}}>
								Close
							</button>
                </div>
			</Modal>                    

    </div>
  )
}
