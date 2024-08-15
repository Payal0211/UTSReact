import SlaReportStyle from './slaReport.module.css';
import { ReactComponent as FunnelSVG } from 'assets/svg/funnel.svg';
import { Dropdown, Menu, Table, Checkbox } from 'antd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SlaReportFilter from '../../../report/components/slaReportFilter/slaReportFilter';

import React, {
	Suspense,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { ReportDAO } from 'core/report/reportDAO';
import { HTTPStatusCode } from 'constants/network';
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton';
import { reportConfig } from 'modules/report/report.config';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import { Controller, useForm } from 'react-hook-form';
import { slaUtils } from './slaUtils';
import {
	downloadToExcel,
	formatJDDumpReport,
	jdDumpSearch,
} from 'modules/report/reportUtils';
import { IoChevronDownOutline } from 'react-icons/io5';
import moment from 'moment';
import WithLoader from 'shared/components/loader/loader';
import LogoLoader from 'shared/components/loader/logoLoader';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';

// const DemandFunnelFilterLazyComponent = React.lazy(() =>
// 	import('modules/report/components/demandFunnelFilter/demandFunnelFilter'),
// );

const SlaReports = () => {
	const { control, register, setValue, watch } = useForm();

	const [demandFunnelValue, setDemandFunnelValue] = useState({});

	const [apiData, setApiData] = useState([]);
	const [viewSummaryData, setSummaryData] = useState([]);
	const [isSummary, setIsSummary] = useState(false);
	const [isLoading, setLoading] = useState(false);
	const [isSummaryLoading, setSummaryLoading] = useState(false);
	const [filteredTagLength, setFilteredTagLength] = useState(0);
	const [getHTMLFilter, setHTMLFilter] = useState(false);
	const [isAllowFilters, setIsAllowFilters] = useState(false);
	const [filtersList, setFiltersList] = useState([]);
	const [filtersSalesRepo, setFiltersSalesRepo] = useState([]);
	const [appliedFilter, setAppliedFilters] = useState(new Map());
	const [checkedState, setCheckedState] = useState(new Map());
	const [demandFunnelModal, setDemandFunnelModal] = useState(false);
	const [totalRecords, setTotalRecords] = useState(0);
	const [pageSize, setPageSize] = useState(100);
	const [pageIndex, setPageIndex] = useState(1);
	const pageSizeOptions = [100, 200, 300, 500, 1000];
	const [isFocusedRole, setIsFocusedRole] = useState(false);
	
	const [listData, setListData] = useState([]);
	const [dateError, setDateError] = useState('');

	const [checkedValue, setCheckedValue] = useState(true);
	const [checkednoValue, setCheckednoValue] = useState(false);
	const [slaValue, setslaValue] = useState(0);
	
	var date = new Date();
	const [startDate, setStartDate] = useState(new Date(date.getFullYear(), date.getMonth(), 1));
	const [endDate, setEndDate] = useState(new Date(date.getFullYear(), date.getMonth() + 1, 0));
	var firstDay = startDate !== null ? moment(startDate).format('YYYY-MM-DD') : new Date(date.getFullYear(), date.getMonth(), 1);
	var lastDay = endDate !== null ?  moment(endDate).format('YYYY-MM-DD') : new Date(date.getFullYear(), date.getMonth() + 1, 0);
	
	const [tableFilteredState, setTableFilteredState] = useState({
		totalrecord: 200,
		pagenumber: 1,
		isExport: false,
		filterFieldsSLA: {
			startDate: firstDay,
			endDate: lastDay,
			hrid: 0,
			sales_ManagerID: 0,
			ops_Lead: 0,
			salesPerson: 0,
			stages: '',
			isAdHoc: 0,
			role: '',
			slaType: 0,
			type: 0,
			hR_Number: '',
			company: '',
			actionFilter: 0,
			stageIDs: '',
			actionFilterIDs: '',
			CompanyIds: '',
			// ambdr: 0
		},
	});

	const checkedYes = (e) => {
		setCheckedValue(e.target.checked);
		setCheckednoValue(false);
		setslaValue(0);
		setTableFilteredState({
			totalrecord: 200,
			pagenumber: 1,
			isExport: false,
			filterFieldsSLA: {
				...tableFilteredState.filterFieldsSLA,		
				slaType: 0,
				isHrfocused: isFocusedRole,
				// ambdr: 0
			},
		});
		// slaReportList({
		// 	...tableFilteredState,
		// 	filterFieldsSLA: {
		// 		fromDate: new Date(firstDay).toLocaleDateString('en-US'),
		// 		toDate: new Date(lastDay).toLocaleDateString('en-US'),
		// 		isHrfocused: isFocusedRole,
		// 	},
		// });
		// slaReportDetails({
		// 	...tableFilteredState,
		// 	filterFieldsSLA: {
		// 		...tableFilteredState.filterFieldsSLA,
		// 		fromDate: new Date(firstDay).toLocaleDateString('en-US'),
		// 		toDate: new Date(lastDay).toLocaleDateString('en-US'),
		// 		slaType: 0,
		// 		isHrfocused: isFocusedRole,
		// 	},
		// });
	};
	const checkedNo = (e) => {
		setCheckednoValue(e.target.checked);
		setCheckedValue(false);
		setslaValue(1);
		setTableFilteredState({
			totalrecord: 200,
			pagenumber: 1,
			isExport: false,
			filterFieldsSLA: {
				...tableFilteredState.filterFieldsSLA,
				slaType: 1,
				isHrfocused: isFocusedRole,
			},
		});

		// slaReportList({
		// 	...tableFilteredState,
		// 	filterFieldsSLA: {
		// 		fromDate: new Date(firstDay).toLocaleDateString('en-US'),
		// 		toDate: new Date(lastDay).toLocaleDateString('en-US'),
		// 		isHrfocused: isFocusedRole,
		// 	},
		// });
		// slaReportDetails({
		// 	...tableFilteredState,
		// 	filterFieldsSLA: {
		// 		...tableFilteredState.filterFieldsSLA,
		// 		fromDate: new Date(firstDay).toLocaleDateString('en-US'),
		// 		toDate: new Date(lastDay).toLocaleDateString('en-US'),
		// 		slaType: 1,
		// 		isHrfocused: isFocusedRole,
		// 	},
		// });
	};
	

	

	const slaReportList = useCallback(async (pageData) => {
	
		let obj = {
			startDate: pageData
				? moment(pageData?.filterFieldsSLA?.fromDate).format(
					'YYYY-MM-DD',
				)
				: moment(firstDay).format('YYYY-MM-DD'),
			endDate: pageData
				? moment(pageData?.filterFieldsSLA?.toDate).format('YYYY-MM-DD')
				: moment(lastDay).format('YYYY-MM-DD'),
			hrid: 0,
			sales_ManagerID: 0,
			ops_Lead: 0,
			salesPerson: 0,
			stages: '',
			isAdHoc: 0,
			role: '',
			hR_Number: '',
			company: '',
			actionFilter: 0,
			ambdr: 0,
			stageIDs: '',
			actionFilterIDs: '',
			CompanyIds: '',
			isHrfocused: isFocusedRole,
		};
		setLoading(true);
		let response = await ReportDAO.OverAllSLASummaryDAO(obj);
		if (response?.statusCode === HTTPStatusCode.OK) {
			setLoading(false);
			setListData(response?.responseBody);
		} else {
			setLoading(false);
		}
	},[isFocusedRole,lastDay,firstDay])

	const [slaDetailsList, setSlaDetailsList] = useState([]);

	useEffect(() => {
		setslaValue(0);
	}, []);

	const slaReportDetails = useCallback(async (pageData) => {
		let data = {...tableFilteredState,filterFieldsSLA:{...tableFilteredState.filterFieldsSLA,  isHrfocused: isFocusedRole ,startDate: pageData
						? moment(pageData?.filterFieldsSLA?.fromDate).format(
							'YYYY-MM-DD',
						)
						: moment(firstDay).format('YYYY-MM-DD'),
					endDate: pageData
						? moment(pageData?.filterFieldsSLA?.toDate).format(
							'YYYY-MM-DD',
						)
						: moment(lastDay).format('YYYY-MM-DD'),}}
		// let data = {
		// 	totalrecord: pageData?.totalRecord ? pageData?.totalRecord : pageSize,
		// 	pagenumber: pageData?.pageNumber ? pageData?.pageNumber : pageIndex,
		// 	isExport: false,
		// 	filterFieldsSLA: {
		// 		startDate: pageData
		// 			? moment(pageData?.filterFieldsSLA?.fromDate).format(
		// 				'YYYY-MM-DD',
		// 			)
		// 			: moment(firstDay).format('YYYY-MM-DD'),
		// 		endDate: pageData
		// 			? moment(pageData?.filterFieldsSLA?.toDate).format(
		// 				'YYYY-MM-DD',
		// 			)
		// 			: moment(lastDay).format('YYYY-MM-DD'),
		// 		hrid: 0,
		// 		sales_ManagerID: 0,
		// 		ops_Lead: 0,
		// 		salesPerson: 0,
		// 		stage: '',
		// 		isAdHoc: 0,
		// 		role: '',
		// 		slaType: (pageData?.filterFieldsSLA?.slaType === 0 || pageData?.filterFieldsSLA?.slaType === 1)  ? pageData?.filterFieldsSLA?.slaType  :  slaValue === 0 ? 0 : 1,
		// 		type: 0,
		// 		hR_Number: '',
		// 		company: '',
		// 		actionFilter: 0,
		// 		stageIDs: '',
		// 		actionFilterIDs: '',
		// 		CompanyIds: '',
		// 		isHrfocused: isFocusedRole,
		// 		// ambdr: 0
		// 	},
		// };
		setSummaryLoading(true);
		let response = await ReportDAO.slaDetailedDataDAO(data);
		if (response?.statusCode === HTTPStatusCode?.OK) {
			// setPageNumber(response?.responseBody?.pagenumber)
			setTotalRecords(response?.responseBody?.totalrows);
			setSummaryLoading(false);
			setSlaDetailsList(slaUtils.slaListData(response && response));
		} else {
			setApiData([]);
			setSummaryLoading(false);
			setTotalRecords(0);
			setSlaDetailsList([]);
		}
	},[firstDay, isFocusedRole, lastDay, tableFilteredState])

	const getEngagementFilterList = useCallback(async () => {
		const response = await ReportDAO.slaFilterDAO();
		if (response?.statusCode === HTTPStatusCode.OK) {
			setFiltersList(response && {...response?.responseBody,salesHead_List:response?.responseBody?.salesHead_List.map(val => ({text:val.fullName,value:`${val.id}`})) });
		}
		const res = await hiringRequestDAO.getAllFilterDataForHRRequestDAO();
		if (res?.statusCode === HTTPStatusCode.OK) {
			setFiltersSalesRepo(res?.responseBody?.details?.Data?.salesReps?.map(item =>({
				text : item?.value,
				value : item?.text
			})))
		}
	}, []);

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
	}, [ getHTMLFilter, isAllowFilters]);

	const onCalenderFilter = (dates) => {
		const [start, end] = dates;

		setStartDate(start);
		setEndDate(end);

		if (start && end) {
			setTableFilteredState({
				...tableFilteredState,
				filterFieldsSLA: {
					...tableFilteredState.filterFieldsSLA,
					startDate: new Date(start).toLocaleDateString('en-US'),
					endDate: new Date(end).toLocaleDateString('en-US'),
					isHrfocused: isFocusedRole,
				},
			});
			// slaReportList({
			// 	...tableFilteredState,
			// 	filterFieldsSLA: {
			// 		...tableFilteredState.filterFieldsSLA,
			// 		fromDate: new Date(start).toLocaleDateString('en-US'),
			// 		toDate: new Date(end).toLocaleDateString('en-US'),
			// 		isHrfocused: isFocusedRole,
			// 	},
			// });
			// slaReportDetails({
			// 	...tableFilteredState,
			// 	filterFieldsSLA: {
			// 		...tableFilteredState.filterFieldsSLA,
			// 		fromDate: new Date(start).toLocaleDateString('en-US'),
			// 		toDate: new Date(end).toLocaleDateString('en-US'),
			// 		isHrfocused: isFocusedRole,
			// 	},
			// });
			setDateError('');
			// setTableFilteredState({
			// 	totalrecord: 100,
			// 	pagenumber: 1,
			// 	isExport: false,
			// 	filterFieldsSLA: {
			// 		startDate: moment(new Date(start).toLocaleDateString('en-US')).format(
			// 			'YYYY-MM-DD',
			// 		),
			// 		endDate: moment(new Date(end).toLocaleDateString('en-US')).format(
			// 			'YYYY-MM-DD',
			// 		),
			// 		hrid: 0,
			// 		sales_ManagerID: 0,
			// 		ops_Lead: 0,
			// 		salesPerson: 0,
			// 		stages: '',
			// 		isAdHoc: 0,
			// 		role: '',
			// 		slaType: slaValue === 0 ? 0 : 1,
			// 		type: 0,
			// 		hR_Number: '',
			// 		company: '',
			// 		actionFilter: 0,
			// 		stageIDs: '',
			// 		actionFilterIDs: '',
			// 		isHrfocused: isFocusedRole,
			// 		CompanyIds: '',
			// 		// ambdr: 0
			// 	},
			// });
		}
	};
	const onRemoveFilters = () => {
		setTimeout(() => {
			setIsAllowFilters(false);
		}, 300);
		setHTMLFilter(false);
	};
	const tableColumnsMemo = useMemo(
		() => reportConfig.SLAReportConfig(listData && listData, slaValue),
		[listData,slaValue],
	);
	const slaDetailColumn = useMemo(
		() =>
			reportConfig.SLAReportDetailListConfig(slaDetailsList && slaDetailsList),
		[slaDetailsList],
	);

	useEffect(() => {
		setslaValue(0);
		// slaReportList();
		// slaReportDetails();
		handleHRRequest()
	}, []);

	useEffect(() => {
		// slaReportList();
		// slaReportDetails();
		handleHRRequest()
	}, [isFocusedRole]);

	useEffect(()=>{
		handleHRRequest()
	},[tableFilteredState])

	const handleHRRequest = useCallback(
		async () => {
			if (firstDay === null) {
				setDateError('* Please select date');
			} else {
				setSummaryLoading(true);
				setLoading(true)
				let response = await ReportDAO.slaDetailedDataDAO({...tableFilteredState,filterFieldsSLA:{...tableFilteredState.filterFieldsSLA,  isHrfocused: isFocusedRole}});
				let obj = {...tableFilteredState.filterFieldsSLA,  isHrfocused: isFocusedRole};
				let responseList = await ReportDAO.OverAllSLASummaryDAO(
					obj,
				);
				// console.log("FilterRes",{response,responseList})
				if (responseList?.statusCode === HTTPStatusCode.OK) {
					setLoading(false);
					setListData(responseList?.responseBody);
				} if (response?.statusCode === HTTPStatusCode.OK) {
					setSummaryLoading(false);
					setSlaDetailsList(slaUtils.slaListData(response && response));
					setTotalRecords(response?.responseBody?.totalrows);
					setLoading(false);
	
				}
				if(response?.statusCode === HTTPStatusCode.NOT_FOUND) {
					setSlaDetailsList([]);
					setTotalRecords(0);
					setLoading(false);
					setSummaryLoading(false);
				}
				setDateError('');
			}
			// if (response?.statusCode === HTTPStatusCode.OK) {
			// 	setTotalRecords(response?.responseBody?.totalrows);
			// 	setLoading(false);
			// 	setAPIdata(
			// 		engagementUtils.modifyEngagementListData(response && response),
			// 	);
			// } else if (response?.statusCode === HTTPStatusCode.NOT_FOUND) {
			// 	setAPIdata([]);
			// 	setLoading(false);
			// 	setTotalRecords(0);
			// } else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
			// 	setLoading(false);
			// 	return navigate(UTSRoutes.LOGINROUTE);
			// } else if (
			// 	response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
			// ) {
			// 	setLoading(false);
			// 	return navigate(UTSRoutes.SOMETHINGWENTWRONG);
			// } else {
			// 	setLoading(false);
			// 	return 'NO DATA FOUND';
			// }
		},
		[tableFilteredState, isFocusedRole],
	);


	const exportHandler = (slaDetailsList) => {
		let dataToDownload = slaDetailsList.map(data => ({
			"HR#": data.hR_NUmber, 'Role' : data.role, 'Company': data.company , 'Client': data.client, 'Talent': data.talentName, 'Stage': data.currentStage,
			'Curr Action Date': data.current_Action_date , 'Exp Next Action Date': data.expected_Next_action_date , 'Actual Next Action date': data.actual_Next_Action_date ,
			'Expected SLA': data.expected_SLA_day, 'Actual SLA': data.actual_SLA_day , 'SLA diff': data.slA_diff, 'Action': data.actionFilter, 'Sales Person':data.sales_Person, 'Sales Manager':data.sales_Manager, 'OPS Lead':data.ops_Lead
 		}))

		downloadToExcel(dataToDownload)
	}

	const clearFilters = useCallback(() => {
		setAppliedFilters(new Map());
		setCheckedState(new Map());
		setFilteredTagLength(0);
	
		let defaultState = {
		  totalrecord: 200,
		  pagenumber: 1,
		  isExport: false,
		  filterFieldsSLA: {
			startDate: moment(new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString('en-US')).format('YYYY-MM-DD') ,
			endDate: moment(new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleDateString('en-US')).format('YYYY-MM-DD'),
			hrid: 0,
			sales_ManagerID: 0,
			ops_Lead: 0,
			salesPerson: 0,
			stages: "",
			isAdHoc: 0,
			role: "",
			slaType: 0,
			type: 0,
			hR_Number: "",
			company: "",
			actionFilter: 0,
			stageIDs: "",
			actionFilterIDs: "",
			CompanyIds: "",
			isHrfocused: false,
			// ambdr: 0
		  }
		}
		setIsFocusedRole(false)
		setTableFilteredState(defaultState);
		// handleHRRequest(defaultState);
		setslaValue(0);
		setCheckedValue(true);
		setCheckednoValue(false);
		onRemoveFilters()
		setEndDate(new Date(date.getFullYear(), date.getMonth() + 1, 0))
		setStartDate(new Date(date.getFullYear(), date.getMonth(), 1))
	  }, [
		handleHRRequest,
		setAppliedFilters,
		setCheckedState,
		setFilteredTagLength,
		setTableFilteredState,
		tableFilteredState,setEndDate,setStartDate
	  ]);

	return (
		<div className={SlaReportStyle.hiringRequestContainer}>
				{/* <WithLoader className="pageMainLoader" showLoader={isLoading}> */}
				<div className={SlaReportStyle.addnewHR}>
					<div className={SlaReportStyle.hiringRequest}>SLA Report</div>
					<LogoLoader visible={isLoading}/>
				</div>
				{/*
				* --------- Filter Component Starts ---------
				* @Filter Part
				*/}
				<div className={SlaReportStyle.filterContainer}>
					<div className={SlaReportStyle.filterSets}>
					<div className={SlaReportStyle.filterSetsInner} >
						<div
							className={SlaReportStyle.addFilter}
							onClick={toggleHRFilter}>
							<FunnelSVG style={{ width: '16px', height: '16px' }} />

							<div className={SlaReportStyle.filterLabel}>Add Filters</div>
							<div className={SlaReportStyle.filterCount}>
								{filteredTagLength}
							</div>
						</div>
						<p onClick={()=> clearFilters() }>Reset Filters</p>
						</div>
						<div className={SlaReportStyle.calendarFilterSet}>
						<Checkbox
				checked={isFocusedRole}
				onClick={() => setIsFocusedRole((prev) => !prev)}
				>
				Show only Focused Role
				</Checkbox>
							<label className={SlaReportStyle.radioCheck_Mark}>
								<p>Overall SLA</p>
								<input
									{...register('remote')}
									value={1}
									type="radio"
									checked={checkedValue}
									onChange={(e) => {
										checkedYes(e);
									}}
									id="remote"
									name="remote"
								/>
								<span className={SlaReportStyle.customCheck_Mark}></span>
							</label>
							<label className={SlaReportStyle.radioCheck_Mark}>
								<p>SLA Missed</p>
								<input
									{...register('remote')}
									value={0}
									type="radio"
									checked={checkednoValue}
									onChange={(e) => {
										checkedNo(e);
									}}
									id="remote"
									name="remote"
								/>
								<span className={SlaReportStyle.customCheck_Mark}></span>
							</label>
							<div className={SlaReportStyle.label}>Date</div>
							{/* <div className={SlaReportStyle.calendarFilter}>
								<CalenderSVG style={{ height: '16px', marginRight: '16px' }} />
								<DatePicker
									style={{ backgroundColor: 'red' }}
									onKeyDown={(e) => {
										e.preventDefault();
										e.stopPropagation();
									}}
									className={SlaReportStyle.dateFilter}
									placeholderText="Start date - End date"
									selected={startDate}
									onChange={onCalenderFilter}
									startDate={startDate}
									endDate={endDate}
									selectsRange
								/>
							</div> */}
							<div className={SlaReportStyle.calendarFilter_Wrap}>
								<div className={SlaReportStyle.calendarFilter}>
									<CalenderSVG style={{ height: '16px', marginRight: '16px' }} />
									{/* <Controller
										render={({ ...props }) => (
											<DatePicker
												className={SlaReportStyle.dateFilter}
												onKeyDown={(e) => {
													e.preventDefault();
													e.stopPropagation();
												}}
												// selected={watch('invoiceDate')}
												// onChange={(date) => {
												// 	setValue('invoiceDate', date);
												// }}
												placeholderText="Start date - End date"
												selected={startDate}
												onChange={onCalenderFilter}
												startDate={startDate}
												endDate={endDate}
												selectsRange
											/>
										)}
										name="invoiceDate"
										rules={{ required: true }}
										control={control}
									/> */}

									<DatePicker
										style={{ backgroundColor: 'red' }}
										onKeyDown={(e) => {
											e.preventDefault();
											e.stopPropagation();
										}}
										className={SlaReportStyle.dateFilter}
										placeholderText="Start date - End date"
										selected={startDate}
										onChange={onCalenderFilter}
										startDate={startDate}
										endDate={endDate}
										selectsRange
									/>
								</div>

								<span>{dateError}</span>
							</div>

							{/* <div className={SlaReportStyle.priorityFilterSet}>
								<div className={SlaReportStyle.label}>Showing</div>
								<div className={SlaReportStyle.paginationFilter}>
									<Dropdown
										trigger={['click']}
										placement="bottom"
										overlay={
											<Menu
												onClick={(e) => {
													setPageSize(parseInt(e.key));
													if (pageSize !== parseInt(e.key)) {
														slaReportDetails({
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
									</Dropdown>
								</div>
							</div> */}
							<div>
								<button
									className={SlaReportStyle.btnPrimary}
									onClick={() => exportHandler(slaDetailsList)}>
									Export
								</button>
							</div>
						</div>
					</div>
				</div>

				{/*
				* ------------ Table Starts-----------
				* @Table Part
				*/}
				<div className={SlaReportStyle.tableDetails}>
					{isLoading ? (
						<TableSkeleton />
					) : (
						<>
							<Table
								scroll={{ x: '100vw', y: '100vh' }}
								id="hrListingTable"
								columns={tableColumnsMemo}
								bordered={false}
								dataSource={listData}
								// pagination={{
								// 	size: 'small',
								// 	pageSize: listData?.length,
								// }}
								pagination={false}
							/>
							{/* <div className={SlaReportStyle.formPanelAction}>
								<button
									type="submit"
									onClick={viewDemandFunnelSummaryHandler}
									className={SlaReportStyle.btnPrimary}>
									View Summary
								</button>
							</div> */}
						</>
					)}
				</div>

				<ul className={SlaReportStyle.actionStatustab}>
					<li>
						<span className={SlaReportStyle.actionTab_On}></span>
						ON Time
					</li>
					<li>
						<span className={SlaReportStyle.actionTab_Before}></span>
						Before Time
					</li>
					<li>
						<span className={SlaReportStyle.actionTab_Exceeded}></span>
						Exceeded SLA
					</li>
					<li>
						<span className={SlaReportStyle.actionTab_Running}></span>
						Running Late
					</li>
				</ul>

				<div className={SlaReportStyle.tableDetails} style={{marginTop: '0'}} >
					{isSummaryLoading ? (
						<TableSkeleton />
					) : (
						<>
							<Table
								scroll={{ x: '200vw', y: '100vh' }}
								columns={slaDetailColumn}
								bordered={false}
								dataSource={slaDetailsList}
								pagination={{
									onChange: (pageNum, pageSize) => {
										setPageIndex(pageNum);
										setPageSize(pageSize);
										// setTableFilteredState({
										// 	...tableFilteredState,
										// 	totalrecord: pageSize,
										// 	pagenumber: pageNum,
										// });
										// slaReportDetails({ pageNumber: pageNum, totalRecord: pageSize , filterFieldsSLA: {
										// 	fromDate: new Date(firstDay).toLocaleDateString('en-US'),
										// 	toDate: new Date(lastDay).toLocaleDateString('en-US'),
										// 	isHrfocused: isFocusedRole,
										// } });
									},
									size: 'small',
									pageSize: pageSize,
									pageSizeOptions: pageSizeOptions,
									total: totalRecords,
									showTotal: (total, range) => {
										return `${range[0]}-${range[1]} of ${totalRecords} items`
									}
										,
									defaultCurrent: pageIndex,
								}}
							/>
						</>
					)}
				</div>

				{isAllowFilters && (
					<Suspense fallback={<div>Loading...</div>}>
						<SlaReportFilter
							setAppliedFilters={setAppliedFilters}
							appliedFilter={appliedFilter}
							setCheckedState={setCheckedState}
							checkedState={checkedState}
							handleHRRequest={handleHRRequest}
							setTableFilteredState={setTableFilteredState}
							tableFilteredState={tableFilteredState}
							setFilteredTagLength={setFilteredTagLength}
							onRemoveHRFilters={onRemoveFilters}
							getHTMLFilter={getHTMLFilter}
							hrFilterList={reportConfig.slaReportFilterList()}
							filtersType={reportConfig.slaReportFilterTypeConfig(
								filtersList && filtersList, filtersSalesRepo && filtersSalesRepo
							)}
							firstDay={firstDay}
							lastDay={lastDay}
							slaValue={slaValue}
							clearFilters={clearFilters}
						/>
					</Suspense>
				)}
				{/* {demandFunnelModal && (
					<DemandFunnelModal
						demandFunnelModal={demandFunnelModal}
						setDemandFunnelModal={setDemandFunnelModal}
						demandFunnelHRDetailsState={demandFunnelHRDetailsState}
						setDemandFunnelHRDetailsState={setDemandFunnelHRDetailsState}
						demandFunnelValue={demandFunnelValue}
					/>
				)} */}
		{/* </WithLoader> */}
			</div>
	);
};

export default SlaReports;
