import React, {
	useState,
	useEffect,
	Suspense,
	useMemo,
	useCallback,
} from 'react';
import { Dropdown, Menu, message, Table, Tooltip, Modal, Skeleton } from 'antd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import allEngagementStyles from './engagement.module.css';
import { InputType } from 'constants/application';

import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import allengagementAddFeedbackStyles from '../engagementBillAndPayRate/engagementBillRate.module.css';

import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import { ReactComponent as FunnelSVG } from 'assets/svg/funnel.svg';
import { ReactComponent as SearchSVG } from 'assets/svg/search.svg';
import { IoChevronDownOutline } from 'react-icons/io5';
import UTSRoutes from 'constants/routes';
import Handshake from 'assets/svg/handshake.svg';
import Rocket from 'assets/svg/rocket.svg';
import Smile from 'assets/svg/smile.svg';
import Briefcase from 'assets/svg/briefcase.svg';
import { allEngagementConfig } from './allEngagementConfig';
import WithLoader from 'shared/components/loader/loader';
import { HTTPStatusCode } from 'constants/network';
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton';
import EngagementFeedback from '../engagementFeedback/engagementFeedback';
import EngagementOnboard from '../engagementOnboard/engagementOnboard';
import EngagementAddFeedback from '../engagementAddFeedback/engagementAddFeedback';
import EngagementReplaceTalent from '../engagementReplaceTalent/engagementReplaceTalent';
import EngagementBillRateAndPayRate from '../engagementBillAndPayRate/engagementBillRateAndPayRate';
import { engagementRequestDAO } from 'core/engagement/engagementDAO';
import { allHRConfig } from 'modules/hiring request/screens/allHiringRequest/allHR.config';
import { engagementUtils } from './engagementUtils';
import EngagementEnd from '../endEngagement/endEngagement';
import EngagementInvoice from '../engagementInvoice/engagementInvoice';

import RenewEngagement from '../renewEngagement/renewEngagement';
import { useForm, Controller } from 'react-hook-form';
import { downloadToExcel } from 'modules/report/reportUtils';
import { MasterDAO } from 'core/master/masterDAO';

/** Importing Lazy components using Suspense */
const EngagementFilerList = React.lazy(() => import('./engagementFilter'));

const EngagementList = () => {
	const [tableFilteredState, setTableFilteredState] = useState({
		totalrecord: 0,
		pagenumber: 1,
		filterFieldsEngagement: {
			clientFeedback: '',
			typeOfHiring: '',
			currentStatus: '',
			tscName: '',
			company: '',
			geo: '',
			position: '',
			engagementTenure: 0,
			nbdName: '',
			amName: '',
			pending: '',
			searchMonth: new Date().getMonth() + 1,
			searchYear: new Date().getFullYear(),
			searchType: '',
			islost: '',
		},
	});

	const [isLoading, setLoading] = useState(false);
	const pageSizeOptions = [100, 200, 300, 500, 1000];
	const pageFeedbackSizeOptions = [10, 20, 30, 50, 100];
	const [filteredData, setFilteredData] = useState(null);
	const [totalRecords, setTotalRecords] = useState(0);
	const [pageIndex, setPageIndex] = useState(1);
	const [pageSize, setPageSize] = useState(100);
	const [isAllowFilters, setIsAllowFilters] = useState(false);
	const [getHTMLFilter, setHTMLFilter] = useState(false);
	const [filtersList, setFiltersList] = useState([]);
	const [apiData, setAPIdata] = useState([]);
	const [search, setSearch] = useState('');
	const [ searchText , setSearchText] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState(search);
	const navigate = useNavigate();
	const [filteredTagLength, setFilteredTagLength] = useState(0);
	const [appliedFilter, setAppliedFilters] = useState(new Map());
	const [checkedState, setCheckedState] = useState(new Map());
	const [getBillRate, setBillRate] = useState(0);
	const [getPayRate, setPayRate] = useState(0);
	const [engagementBillAndPayRateTab, setEngagementBillAndPayRateTab] =
		useState('1');
	const [activeTab, setActiveTab] = useState('')	
	const [getEngagementModal, setEngagementModal] = useState({
		engagementFeedback: false,
		engagementRenew: false,
		engagementBillRate: false,
		engagementPayRate: false,
		engagementOnboard: false,
		engagementAddFeedback: false,
		engagementReplaceTalent: false,
		engagementBillRateAndPayRate: false,
		engagementEnd: false,
		engagementInvoice: false,
	});
	const [getHRAndEngagementId, setHRAndEngagementId] = useState({
		hrNumber: '',
		engagementID: '',
		talentName: '',
		onBoardId: '',
		hrId: '',
	});
	const [getOnboardID, setOnbaordId] = useState('');
	const [feedBackData, setFeedBackData] = useState({
		totalRecords: 10,
		pagenumber: 1,
		onBoardId: '',
	});
	const [getClientFeedbackList, setClientFeedbackList] = useState([]);
	const [getFeedbackPagination, setFeedbackPagination] = useState({
		totalRecords: 0,
		pageIndex: 1,
		pageSize: 10,
	});
	const [getOnboardFormDetails, setOnboardFormDetails] = useState({});
	const [getFeedbackFormContent, setFeedbackFormContent] = useState({});
	const [feedBackSave, setFeedbackSave] = useState(false);
	const [feedBackTypeEdit, setFeedbackTypeEdit] = useState('Please select');
	const [rateReason, setRateReason] = useState(undefined);
	const [scheduleTimezone, setScheduleTimezone] = useState([]);

	const [TSCusers, setTSCusers] = useState([])
	const [isEditTSC,setISEditTSC] = useState(false);
	const [TSCONBoardData,setTSCONBoardData] = useState({})
	const [isAddTSC,setIsAddTSC] = useState(false);
	const [issubmitTSC,setsubmitTSC] = useState(false);

	const onRemoveHRFilters = () => {
		setTimeout(() => {
			setIsAllowFilters(false);
		}, 300);
		setHTMLFilter(false);
	};

	const {
		register,
		handleSubmit,
		setValue,
		control,
		setError,
		getValues,
		watch,
		reset,
		resetField,
		formState: { errors },
	} = useForm();

	const {
		register:TSCregister,
		handleSubmit:TSChandleSubmit,
		setValue:TSCsetValue,
		resetField:resetTSCField,	
		formState: { errors:TSCErrors },
	} = useForm();

	const tableColumnsMemo = useMemo(
		() =>
			allEngagementConfig.tableConfig(
				getEngagementModal,
				setEngagementModal,
				setFilteredData,
				setEngagementBillAndPayRateTab,
				setOnbaordId,
				setFeedBackData,
				setHRAndEngagementId,
				setIsAddTSC,
				setTSCONBoardData,
				setISEditTSC,
				setActiveTab
			),
		[getEngagementModal],
	);
	const feedbackTableColumnsMemo = useMemo(
		() => allEngagementConfig.clientFeedbackTypeConfig(),
		[],
	);

	const getTimeZone = useCallback(async () => {
		let response = await MasterDAO.getTimeZoneRequestDAO();
		setScheduleTimezone(response && response?.responseBody);
	}, [setScheduleTimezone]);

	useEffect(() => {
		getTimeZone();
	}, [getTimeZone]);

	const handleHRRequest = useCallback(
		async (pageData) => {
			setLoading(true);
			let response = await engagementRequestDAO.getEngagementListDAO(pageData);
			if (response?.statusCode === HTTPStatusCode.OK) {
				setTotalRecords(response?.responseBody?.totalrows);
				setLoading(false);
				setAPIdata(
					engagementUtils.modifyEngagementListData(response && response),
				);
			} else if (response?.statusCode === HTTPStatusCode.NOT_FOUND) {
				setAPIdata([]);
				setLoading(false);
				setTotalRecords(0);
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
		[navigate],
	);


	useEffect(()=>{
		const getTSCUSERS = async(ID)=> {
				let response = await engagementRequestDAO.getTSCUserListDAO(ID);
				if (response?.statusCode === HTTPStatusCode.OK) {
					// setTSCusers()
					setTSCusers(response.responseBody.drpTSCUserList.map(item=> ({...item, id:item.value , value: item.text, })))
					setTSCONBoardData(prev=>({...prev,tscPersonID: response.responseBody.tscPersonID}))
				} 
			}

		if(TSCONBoardData.onboardID){
			getTSCUSERS(TSCONBoardData.onboardID)
		}		

	},[TSCONBoardData.onboardID])
	
	const submitTSC = async (d)=>{
		setsubmitTSC(true)
		let payload = {
			"onBoardID": TSCONBoardData.onboardID,
			"tscUserId": +d.AddTSCName,
			"tscEditReason": d.tscReason ? d.tscReason : '',
			"oldTSC_PersonID": TSCONBoardData.tscPersonID,
		  }
		let response = await engagementRequestDAO.updateTSCNameDAO(payload);
			if (response?.statusCode === HTTPStatusCode.OK) {
				setIsAddTSC(false)
				setISEditTSC(false)
				resetTSCField('AddTSCName')
				resetTSCField('tscReason')
				setTSCONBoardData({})
				handleHRRequest({...tableFilteredState, searchText: searchText})
				setsubmitTSC(false)
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
			setsubmitTSC(false)
	}

	const closeAddTSC = () =>{
		setIsAddTSC(false)
		resetTSCField('AddTSCName')
		setTSCONBoardData({})
	}

	const closeEditTSC = () =>{
		setISEditTSC(false)
		resetTSCField('AddTSCName')
		resetTSCField('tscReason')
		setTSCONBoardData({})
	}

	const getFeedbackList = async (feedBackData) => {
		setLoading(true);
		const response = await engagementRequestDAO.getFeedbackListDAO(
			feedBackData,
		);
		if (response?.statusCode === HTTPStatusCode.OK) {
			setClientFeedbackList(
				engagementUtils.modifyEngagementFeedbackData(response && response),
			);
			setFeedbackPagination((prev) => ({
				...prev,
				totalRecords: response.responseBody.details.totalrows,
			}));
			setLoading(false);
		} else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
			setLoading(false);
			return navigate(UTSRoutes.LOGINROUTE);
		} else if (response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
			setLoading(false);
			return navigate(UTSRoutes.SOMETHINGWENTWRONG);
		} else {
			return 'NO DATA FOUND';
		}
	};

	const getOnboardingForm = async (getOnboardID) => {
		setOnboardFormDetails({});
		setLoading(true);
		const response = await engagementRequestDAO.viewOnboardDetailsDAO(
			getOnboardID,
		);
		if (response?.statusCode === HTTPStatusCode.OK) {
			setOnboardFormDetails(response?.responseBody?.details);
			setLoading(false);
		}else if (response?.statusCode === HTTPStatusCode.BAD_REQUEST) {
			setOnboardFormDetails({});
			setLoading(false);
		}
		 else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
			return navigate(UTSRoutes.LOGINROUTE);
		} else if (response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
			setLoading(false);
			return navigate(UTSRoutes.SOMETHINGWENTWRONG);
		} else {
			return 'NO DATA FOUND';
		}
	};

	const getFeedbackFormDetails = async (getHRAndEngagementId) => {
		setFeedbackFormContent({});
		const response = await engagementRequestDAO.getFeedbackFormContentDAO(
			getHRAndEngagementId,
		);
		if (response?.statusCode === HTTPStatusCode.OK) {
			setFeedbackFormContent(response?.responseBody?.details);
		} else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
			return navigate(UTSRoutes.LOGINROUTE);
		} else if (response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
			setLoading(false);
			return navigate(UTSRoutes.SOMETHINGWENTWRONG);
		} else {
			return 'NO DATA FOUND';
		}
	};
	useEffect(() => {
		const timer = setTimeout(() => handleHRRequest({...tableFilteredState, 	searchText: searchText}) , 1000);
		return () => clearTimeout(timer);
	}, [debouncedSearch]);

	useEffect(() => {
		getEngagementModal?.engagementOnboard &&
			getHRAndEngagementId?.onBoardId &&
			getOnboardingForm(getHRAndEngagementId?.onBoardId);
	}, [getEngagementModal?.engagementOnboard]);

	useEffect(() => {
		getEngagementModal?.engagementFeedback &&
			feedBackData?.onBoardId &&
			getFeedbackList(feedBackData);
	}, [getEngagementModal?.engagementFeedback]);

	useEffect(() => {
		getEngagementModal?.engagementAddFeedback &&
			getFeedbackFormDetails(getHRAndEngagementId);
	}, [getEngagementModal?.engagementAddFeedback]);

	useEffect(() => {
		handleHRRequest(tableFilteredState);
	}, [handleHRRequest, tableFilteredState, feedBackSave]);

	useEffect(() => {
		resetField('feedbackComments');
		resetField('actionToTake');
		resetField('feedBackDate');
		resetField('feedbackType');
		setFeedbackTypeEdit('Please Select');
	}, [getEngagementModal?.engagementAddFeedback]);

	useEffect(() => {
		setBillRate(0);
		setPayRate(0);
		// setEngagementBillAndPayRateTab('1');
	}, [getEngagementModal.engagementBillRateAndPayRate]);

	const getEngagementFilterList = useCallback(async () => {
		const response = await engagementRequestDAO.getEngagementFilterListDAO();
		if (response?.statusCode === HTTPStatusCode.OK) {
			setFiltersList(response && response?.responseBody?.details);
		} else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
			return navigate(UTSRoutes.LOGINROUTE);
		} else if (response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
			return navigate(UTSRoutes.SOMETHINGWENTWRONG);
		} else {
			return 'NO DATA FOUND';
		}
	}, [navigate]);

	useEffect(()=>{
		getEngagementFilterList();
	},[getEngagementFilterList])

	const toggleHRFilter = useCallback(() => {
		!getHTMLFilter
			? setIsAllowFilters(!isAllowFilters)
			: setTimeout(() => {
					setIsAllowFilters(!isAllowFilters);
			  }, 300);
		setHTMLFilter(!getHTMLFilter);
	}, [getHTMLFilter, isAllowFilters]);

	/*--------- React DatePicker ---------------- */
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(null);

	const onCalenderFilter = (dates) => {
		// const [start, end] = dates;
	const month = dates.getMonth() + 1
	const year = dates.getFullYear()
	 setStartDate(dates);
		// setEndDate(end);
		if (month && year) {
			// console.log( month, year)
			setTableFilteredState({
				...tableFilteredState,
				searchText: searchText,
				filterFieldsEngagement: {...tableFilteredState.filterFieldsEngagement ,
					searchMonth: month,
					searchYear: year,
				},
			});
			handleHRRequest({
				...tableFilteredState,
				searchText: searchText,
				filterFieldsEngagement: {...tableFilteredState.filterFieldsEngagement ,
					searchMonth: month,
					searchYear: year,
				},
			});
		}
		// if (start && end) {
		// 	setTableFilteredState({
		// 		...tableFilteredState,
		// 		filterFields_ViewAllHRs: {
		// 			fromDate: new Date(start).toLocaleDateString('en-US'),
		// 			toDate: new Date(end).toLocaleDateString('en-US'),
		// 		},
		// 	});
		// 	handleHRRequest({
		// 		...tableFilteredState,
		// 		filterFields_ViewAllHRs: {
		// 			fromDate: new Date(start).toLocaleDateString('en-US'),
		// 			toDate: new Date(end).toLocaleDateString('en-US'),
		// 		},
		// 	});
		// }
	};

	const handleExport = (apiData) => {
		let DataToExport =  apiData.map(data => {
			let obj = {}
			tableColumnsMemo.forEach(val => {if(val.key !== "action"){
				if(val.key === 'engagementType'){
					obj[`${val.title}`] = `${data.typeOfHR} ${data.h_Availability && `- ${data.h_Availability}`}`
				}else{
					obj[`${val.title}`] = data[`${val.key}`]
				} }
			} )
		return obj;
			}
		 )
		 downloadToExcel(DataToExport)

	}

	const clearFilters = useCallback(() => {
		setAppliedFilters(new Map());
		setCheckedState(new Map());
		setFilteredTagLength(0);

		const defaultFilters ={		
			clientFeedback: '',
			typeOfHiring: '',
			currentStatus: '',
			tscName: '',
			company: '',
			geo: '',
			position: '',
			engagementTenure: 0,
			nbdName: '',
			amName: '',
			pending: '',
			searchMonth: new Date().getMonth() +1,
			searchYear: new Date().getFullYear(),
			searchType: '',
			islost: '',
		}
		
		setTableFilteredState({
			...tableFilteredState,
			filterFieldsEngagement: defaultFilters,
		});
		const reqFilter = {
			...tableFilteredState,
			filterFieldsEngagement: defaultFilters,
		};
		handleHRRequest(reqFilter);
		onRemoveHRFilters();
		setSearchText('')
		setStartDate(new Date());
	}, [
		handleHRRequest,
		setAppliedFilters,
		setCheckedState,
		setFilteredTagLength,
		setTableFilteredState,
		tableFilteredState,
	]);

	return (
		<div className={allEngagementStyles.hiringRequestContainer}>
			<div className={allEngagementStyles.addnewHR}>
				<div className={allEngagementStyles.hiringRequest}>
					Engagement Dashboard -{' '}
					{startDate.toLocaleDateString('default', { month: 'long' })}
				</div>
				{/* <div>
					<button
						className={allEngagementStyles.btnPrimary}
						onClick={() => handleExport(apiData)}>
						Export
					</button>
				</div> */}
			</div>

			<div className={allEngagementStyles.filterContainer}>
				<div className={allEngagementStyles.filterSets}>
				<div className={allEngagementStyles.filterSetsInner} >
					<div
						className={allEngagementStyles.addFilter}
						onClick={toggleHRFilter}>
						<FunnelSVG style={{ width: '16px', height: '16px' }} />

						<div className={allEngagementStyles.filterLabel}>Add Filters</div>
						<div className={allEngagementStyles.filterCount}>
							{filteredTagLength}
						</div>
					</div>
					<p onClick={()=> clearFilters() }>Reset Filters</p>
					</div>
					<div className={allEngagementStyles.filterRight}>
						<div className={allEngagementStyles.searchFilterSet}>
							<SearchSVG style={{ width: '16px', height: '16px' }} />
							<input
								type={InputType.TEXT}
								className={allEngagementStyles.searchInput}
								placeholder="Search Table"
								value={searchText}
								onChange={(e) => {
									 setSearchText(e.target.value)
									return setDebouncedSearch(
										engagementUtils.engagementListSearch(e, apiData),
									);
								}}
							/>
						</div>
						<div className={allEngagementStyles.calendarFilterSet}>
							<div className={allEngagementStyles.label}>Month-Year</div>
							<div className={allEngagementStyles.calendarFilter}>
								<CalenderSVG style={{ height: '16px', marginRight: '16px' }} />
								<DatePicker
									style={{ backgroundColor: 'red' }}
									onKeyDown={(e) => {
										e.preventDefault();
										e.stopPropagation();
									}}
									className={allEngagementStyles.dateFilter}
									placeholderText="Month - Year"
									selected={startDate}
									onChange={onCalenderFilter}
									// startDate={startDate}
									// endDate={endDate}
									dateFormat="MM-yyyy"
									showMonthYearPicker
								/>
							</div>
						</div>

						<div className={allEngagementStyles.priorityFilterSet}>
							{/* <div className={allEngagementStyles.label}>Showing</div> */}
							<div className={allEngagementStyles.paginationFilter} style={{marginRight:'10px', marginLeft:'10px'}}>
							<button
								className={allEngagementStyles.btnPrimary}
								
								onClick={() => handleExport(apiData)}>
								Export
							</button>
				
								{/* <Dropdown
									trigger={['click']}
									placement="bottom"
									overlay={
										<Menu
											onClick={(e) => {
												setPageSize(parseInt(e.key));
												if (pageSize !== parseInt(e.key)) {
													handleHRRequest({
														...tableFilteredState,
														totalrecord: parseInt(e.key),
														pagenumber: pageIndex,
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
								</Dropdown> */}
							</div>
						</div>
					</div>
				</div>
				<div
					className={`${allEngagementStyles.filterSets} ${allEngagementStyles.filterDescription}`}>
					<div className={allEngagementStyles.filterType}>
						<img
							src={Handshake}
							alt="handshaker"
						/>
						<h2>
							Active Engagements -{' '}
							<span>
								{apiData[0]?.activeEngagement
									? apiData[0]?.activeEngagement
									: 0}
							</span>
						</h2>
					</div>
					<div className={allEngagementStyles.filterType}>
						<img
							src={Smile}
							alt="smile"
						/>
						<h2>
							Feedback Received -{' '}
							<span>
								{apiData[0]?.feedbcakReceive ? apiData[0]?.feedbcakReceive : 0}
							</span>
						</h2>
					</div>
					<div className={allEngagementStyles.filterType}>
						<img
							src={Rocket}
							alt="rocket"
						/>
						<h2>
							Average NR% -{' '}
							<span>{apiData[0]?.avgNR ? apiData[0]?.avgNR : 0}</span>
						</h2>
					</div>
					<div className={allEngagementStyles.filterType}>
						<img
							src={Briefcase}
							alt="briefcase"
						/>
						<h2>
							Average DP% -{' '}
							<span>{apiData[0]?.avgDP ? apiData[0]?.avgDP : 0}</span>
						</h2>
					</div>
					<div className={allEngagementStyles.filterType}>
						<img
							src={Briefcase}
							alt="briefcase"
						/>
						<h2>
							Total DP -{' '}
							<span>{apiData[0]?.s_TotalDP ? apiData[0]?.s_TotalDP : 0}</span>
						</h2>
					</div>
				</div>
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					{/* <a className='mr-2' onClick={() => setEngagementModal({ ...getEngagementModal, engagementFeedback: true })}>EngagementFeeback</a> */}
					{/* <a className='mr-2' onClick={() => setEngagementModal({ ...getEngagementModal, engagementBillRate: true })}  >EngagementBillRate</a> */}
					{/* <a className='mr-2' onClick={() => setEngagementModal({ ...getEngagementModal, engagementPayRate: true })} >EngagementPayRate</a> */}
					{/* <a className='mr-2' onClick={() => setEngagementModal({ ...getEngagementModal, engagementOnboard: true })} >EngagementOnboard</a>
                <a className='mr-2' onClick={() => setEngagementModal({ ...getEngagementModal, engagementAddFeedback: true })} >EngagementAddFeedback</a>
                <a className='mr-2' onClick={() => setEngagementModal({ ...getEngagementModal, engagementReplaceTalent: true })} >EngagementReplaceTalent</a>
                <a className='mr-2' onClick={() => setEngagementModal({ ...getEngagementModal, engagementBillRateAndPayRate: true })} >EngagementBillRateAndPayRate</a> */}
				</div>
				{/*
				 * ------------ Table Starts-----------
				 * @Table Part
				 */}
				<div className={allEngagementStyles.tableDetails}>
					{isLoading ? (
						<TableSkeleton />
					) : (
						<WithLoader className="mainLoader">
							<Table
								scroll={{ x: '500vw', y: '100vh' }}
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
								pagination={false} 
								// pagination={{
								// 	onChange: (pageNum, pageSize) => {
								// 		setPageIndex(pageNum);
								// 		setPageSize(pageSize);
								// 		setTableFilteredState({
								// 			...tableFilteredState,
								// 			totalrecord: pageSize,
								// 			pagenumber: pageNum,
								// 		});
								// 	},
								// 	size: 'small',
								// 	pageSize: pageSize,
								// 	pageSizeOptions: pageSizeOptions,
								// 	total: totalRecords,
								// 	showTotal: (total, range) =>
								// 		`${range[0]}-${range[1]} of ${totalRecords} items`,
								// 	defaultCurrent: pageIndex,
								// }}
							/>
						</WithLoader>
					)}
				</div>
				{isAllowFilters && (
					<Suspense fallback={<div>Loading...</div>}>
						<EngagementFilerList
							setAppliedFilters={setAppliedFilters}
							appliedFilter={appliedFilter}
							setCheckedState={setCheckedState}
							checkedState={checkedState}
							handleHRRequest={handleHRRequest}
							setTableFilteredState={setTableFilteredState}
							tableFilteredState={tableFilteredState}
							setFilteredTagLength={setFilteredTagLength}
							onRemoveHRFilters={onRemoveHRFilters}
							getHTMLFilter={getHTMLFilter}
							hrFilterList={allHRConfig.hrFilterListConfig()}
							filtersType={allEngagementConfig.engagementFilterTypeConfig(
								filtersList && filtersList,
							)}
							clearFilters={clearFilters}
						/>
					</Suspense>
				)}
				{/** ============ MODAL FOR ENGAGEMENTFEEDBACK ================ */}
				{getEngagementModal.engagementFeedback && (
					<Modal
						transitionName=""
						width="930px"
						centered
						footer={null}
						open={getEngagementModal.engagementFeedback}
						// className={allEngagementStyles.engagementModalContainer}
						className="engagementModalStyle"
						// onOk={() => setVersantModal(false)}
						onCancel={() =>
							setEngagementModal({
								...getEngagementModal,
								engagementFeedback: false,
							})
						}>
						<EngagementFeedback
							getHRAndEngagementId={getHRAndEngagementId}
							feedbackTableColumnsMemo={feedbackTableColumnsMemo}
							getClientFeedbackList={getClientFeedbackList}
							isLoading={isLoading}
							pageFeedbackSizeOptions={pageFeedbackSizeOptions}
							getFeedbackPagination={getFeedbackPagination}
							setFeedbackPagination={setFeedbackPagination}
							setFeedBackData={setFeedBackData}
							feedBackData={feedBackData}
							setEngagementModal={setEngagementModal}
							setHRAndEngagementId={setHRAndEngagementId}
						/>
					</Modal>
				)}

				{/** ============ MODAL FOR ENGAGEMENTONBOARD ================ */}
				{getEngagementModal.engagementOnboard && (
					<Modal
						transitionName=""
						width="930px"
						centered
						footer={null}
						className="engagementPayRateModal"
						open={getEngagementModal.engagementOnboard}
						onCancel={() =>
							setEngagementModal({
								...getEngagementModal,
								engagementOnboard: false,
							})
						}>
						<EngagementOnboard
							getOnboardFormDetails={getOnboardFormDetails}
							getHRAndEngagementId={getHRAndEngagementId}
							scheduleTimezone={scheduleTimezone}
						/>
					</Modal>
				)}

				{/** ============ MODAL FOR ENGAGEMENT ADD FEEDBACK ================ */}
				{getEngagementModal.engagementAddFeedback && (
					<Modal
						transitionName=""
						width="930px"
						centered
						footer={null}
						className="engagementAddFeedbackModal"
						open={getEngagementModal.engagementAddFeedback}
						onCancel={() =>
							setEngagementModal({
								...getEngagementModal,
								engagementAddFeedback: false,
							})
						}>
						<EngagementAddFeedback
							getFeedbackFormContent={getFeedbackFormContent}
							getHRAndEngagementId={getHRAndEngagementId}
							onCancel={() =>
								setEngagementModal({
									...getEngagementModal,
									engagementAddFeedback: false,
								})
							}
							setFeedbackSave={setFeedbackSave}
							feedBackSave={feedBackSave}
							register={register}
							handleSubmit={handleSubmit}
							setValue={setValue}
							control={control}
							setError={setError}
							getValues={getValues}
							watch={watch}
							reset={reset}
							resetField={resetField}
							errors={errors}
							feedBackTypeEdit={feedBackTypeEdit}
							setFeedbackTypeEdit={setFeedbackTypeEdit}
						/>
					</Modal>
				)}
				{/** ============ MODAL FOR ENGAGEMENT REPLACE TALENT ================ */}
				{getEngagementModal.engagementReplaceTalent && (
					<Modal
						transitionName=""
						width="930px"
						centered
						footer={null}
						open={getEngagementModal.engagementReplaceTalent}
						className="engagementReplaceTalentModal"
						onCancel={() =>
							setEngagementModal({
								...getEngagementModal,
								engagementReplaceTalent: false,
							})
						}>
						<EngagementReplaceTalent
							engagementListHandler={() => handleHRRequest({...tableFilteredState, searchText: searchText})}
							talentInfo={filteredData}
							isEngagement={true}
							closeModal={() =>
								setEngagementModal({
									...getEngagementModal,
									engagementReplaceTalent: false,
								})
							}
						/>
					</Modal>
				)}
				{/** ============ MODAL FOR ENGAGEMENT END ================ */}
				{getEngagementModal.engagementEnd && (
					<Modal
						transitionName=""
						width="930px"
						centered
						footer={null}
						open={getEngagementModal.engagementEnd}
						className="engagementReplaceTalentModal"
						onCancel={() =>
							setEngagementModal({
								...getEngagementModal,
								engagementEnd: false,
							})
						}>
						<EngagementEnd
							engagementListHandler={() => handleHRRequest({...tableFilteredState, searchText: searchText})}
							talentInfo={filteredData}
							closeModal={() =>
								setEngagementModal({
									...getEngagementModal,
									engagementEnd: false,
								})
							}
						/>
					</Modal>
				)}
				{/** ============ MODAL FOR RENEW ENGAGEMENT ================ */}
				{getEngagementModal.engagementRenew && (
					<Modal
						transitionName=""
						width="930px"
						centered
						footer={null}
						open={getEngagementModal.engagementRenew}
						className="engagementReplaceTalentModal"
						onCancel={() =>
							setEngagementModal({
								...getEngagementModal,
								engagementRenew: false,
							})
						}>
						<RenewEngagement
							engagementListHandler={() => handleHRRequest({...tableFilteredState, searchText: searchText})}
							talentInfo={filteredData}
							closeModal={() =>
								setEngagementModal({
									...getEngagementModal,
									engagementRenew: false,
								})
							}
						/>
					</Modal>
				)}
				{/** ============ MODAL FOR ENGAGEMENT BILLRATE AND PAYRATE ================ */}
				{getEngagementModal.engagementBillRateAndPayRate && (
					<Modal
						transitionName=""
						width="930px"
						centered
						footer={null}
						open={getEngagementModal.engagementBillRateAndPayRate}
						className="engagementReplaceTalentModal"
						onCancel={() =>{
							setEngagementModal({
								...getEngagementModal,
								engagementBillRateAndPayRate: false,
							})
							setRateReason(undefined)
						}
						}>
						<EngagementBillRateAndPayRate
							engagementListHandler={() => handleHRRequest({...tableFilteredState, searchText: searchText})}
							talentInfo={filteredData}
							closeModal={() =>{
								setEngagementModal({
									...getEngagementModal,
									engagementBillRateAndPayRate: false,
								})
								setRateReason(undefined)}
							}
							month={new Date(startDate).getMonth()}
							year={new Date(startDate).getFullYear()}
							getBillRate={getBillRate}
							setBillRate={setBillRate}
							getPayRate={getPayRate}
							setPayRate={setPayRate}
							setEngagementBillAndPayRateTab={setEngagementBillAndPayRateTab}
							engagementBillAndPayRateTab={engagementBillAndPayRateTab}
							rateReason={rateReason}
							activeTab={activeTab}
							setRateReason={setRateReason}
						/>
					</Modal>
				)}
				{/** ============ MODAL FOR ENGAGEMENT INVOICE ================ */}
				{getEngagementModal.engagementInvoice && (
					<Modal
						transitionName=""
						width="930px"
						centered
						footer={null}
						open={getEngagementModal.engagementInvoice}
						className="engagementReplaceTalentModal"
						onCancel={() =>
							setEngagementModal({
								...getEngagementModal,
								engagementInvoice: false,
							})
						}>
						<EngagementInvoice
							isModalOpen={getEngagementModal.engagementInvoice}
							engagementListHandler={() => handleHRRequest({...tableFilteredState, searchText: searchText})}
							talentInfo={filteredData}
							closeModal={() =>
								setEngagementModal({
									...getEngagementModal,
									engagementInvoice: false,
								})
							}
						/>
					</Modal>
				)}

				{/** ============ MODAL FOR ADD TSC  ================ */}
				{isAddTSC && (
					<Modal
						transitionName=""
						width="930px"
						centered
						footer={null}
						className={allEngagementStyles.engagementaddtscModal}
						open={isAddTSC}
						onCancel={() =>
							closeAddTSC()
							
						}
						>
						<div className={allengagementAddFeedbackStyles.engagementModalWrap}>
							<div className={` ${allengagementAddFeedbackStyles.headingContainer} ${allengagementAddFeedbackStyles.payRateAndBillrateWrapper} `}>
								<div className="tableaddTitle">
									<h2>Add TSC Name</h2>
									<p>Engagement ID : <b>{TSCONBoardData?.engagementID}</b>  | Talent Name : <b>{TSCONBoardData?.talentName}</b></p>
								</div>
							</div>
						
						<div className={allengagementAddFeedbackStyles.row}>
							<div className={allengagementAddFeedbackStyles.colMd6}>
								<HRSelectField
										// mode='id/value'
										// controlledValue={feedBackTypeEdit}
										// setControlledValue={setFeedbackTypeEdit}
										// isControlled={true}
										setValue={TSCsetValue}
										register={TSCregister}
										name="AddTSCName"
										label="Add TSC Name "
										defaultValue="Select TSC Name"
										options={TSCusers}
										required={isAddTSC}
										isError={
										TSCErrors['AddTSCName'] && 	TSCErrors['AddTSCName']
										}
										errorMsg="Please select TSC Name."
									/>
							</div>
						</div>

						<div className={allengagementAddFeedbackStyles.formPanelAction}>
							<button
								// disabled={isLoading}
								type="submit"
								onClick={TSChandleSubmit(submitTSC)}
								className={allengagementAddFeedbackStyles.btnPrimary}>
								Add TSC
							</button>
							<button
								onClick={() => {
									closeAddTSC()
								}}
								className={allengagementAddFeedbackStyles.btn}>
								NO
							</button>
						</div>
						
					  </div>
					</Modal>
				)}

				{/** ============ MODAL FOR Edit TSC  ================ */}
				{isEditTSC && (
					<Modal
						transitionName=""
						width="930px"
						centered
						footer={null}
						className={allEngagementStyles.engagementaddtscModal}
						open={isEditTSC}
						onCancel={() =>
							closeEditTSC()
						}
						>
						<div className={allengagementAddFeedbackStyles.engagementModalWrap}>
							<div className={` ${allengagementAddFeedbackStyles.headingContainer} ${allengagementAddFeedbackStyles.payRateAndBillrateWrapper} `}>
								<div className="tableaddTitle">
									<h2>Edit TSC Name</h2>
									<p>Engagement ID : <b>{TSCONBoardData?.engagementID}</b>  | Talent Name : <b>{TSCONBoardData?.talentName}</b></p>
								</div>
							</div>
						
						{issubmitTSC ? <Skeleton /> : <div className={allengagementAddFeedbackStyles.row}>
							<div className={allengagementAddFeedbackStyles.colMd6}>
								<HRInputField
									register={TSCsetValue}
									// errors={errors}
									// validationSchema={{
									// 	required: 'please enter bill rate manually.',
									// }}
									label="Current TSC Name"
									name="finalBillRate"
									// onChangeHandler={(e)=>nrPercentageBR(e)}
									type={InputType.TEXT}
									placeholder={TSCONBoardData?.tscName ? TSCONBoardData?.tscName : 'Select TSC Name' }
									disabled
								/>
							</div>

							<div className={allengagementAddFeedbackStyles.colMd6}>
								<HRSelectField
									// mode='id/value'
									// controlledValue={feedBackTypeEdit}
									// setControlledValue={setFeedbackTypeEdit}
									// isControlled={true}
									setValue={TSCsetValue}
									register={TSCregister}
									name="AddTSCName"
									label="Select New TSC Name"
									defaultValue="Select TSC Name"
									options={TSCusers}
									required={isEditTSC}
									isError={
									TSCErrors['AddTSCName'] && 	TSCErrors['AddTSCName']
									}
									errorMsg="Please select TSC Name."
								/>
							</div>

							<div className={allengagementAddFeedbackStyles.colMd12}>
								<HRInputField
									register={TSCregister}
									errors={TSCErrors}
									validationSchema={{
										required: 'please enter edit reason.',
									}}
									label="Reason for editing TSC Name"
									name="tscReason"
									// onChangeHandler={(e)=>nrPercentageBR(e)}
									type={InputType.TEXT}
									placeholder="enter edit reason."
									required={isEditTSC}
									onKeyDownHandler={
										(e) => {										
											if (/\d/.test(e.key)) {
											  e.preventDefault();
											}
										}
									}
								/>
							</div>

						</div>}
						

						<div className={allengagementAddFeedbackStyles.formPanelAction}>
							<button
								// disabled={isLoading}
								type="submit"
								onClick={TSChandleSubmit(submitTSC)}
								className={allengagementAddFeedbackStyles.btnPrimary} 
								disabled={issubmitTSC}>
								Save TSC Name
							</button>
							<button
								onClick={() => {
									closeEditTSC()
								}}
								className={allengagementAddFeedbackStyles.btn}>
								Cancel
							</button>
						</div>
					 </div>					
					</Modal>
				)}

			</div>
		</div>
	);
};

export default EngagementList;
