import SlaReportStyle from './slaReport.module.css';
import { ReactComponent as FunnelSVG } from 'assets/svg/funnel.svg';
import { Dropdown, Menu, Table } from 'antd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SlaReportFilter from "../../../report/components/slaReportFilter/slaReportFilter"

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
import DemandFunnelModal from 'modules/report/components/demandFunnelModal/demandFunnelModal';
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

const DemandFunnelFilterLazyComponent = React.lazy(() =>
	import('modules/report/components/demandFunnelFilter/demandFunnelFilter'),
);

const SlaReports = () => {
	const { control,register,setValue,
		watch, } = useForm();
	

	// console.log(tableFilteredState,"tableFilteredStatetableFilteredState");

	const [demandFunnelValue, setDemandFunnelValue] = useState({});
	const [slaReportDetailsState, setSlaReportDetailsState] = useState();

	const [apiData, setApiData] = useState([]);
	const [viewSummaryData, setSummaryData] = useState([]);
	const [isSummary, setIsSummary] = useState(false);
	const [isLoading, setLoading] = useState(false);
	const [isSummaryLoading, setSummaryLoading] = useState(false);
	const [filteredTagLength, setFilteredTagLength] = useState(0);
	const [getHTMLFilter, setHTMLFilter] = useState(false);
	const [isAllowFilters, setIsAllowFilters] = useState(false);
	const [filtersList, setFiltersList] = useState([]);
	const [appliedFilter, setAppliedFilters] = useState(new Map());
	const [checkedState, setCheckedState] = useState(new Map());
	const [demandFunnelModal, setDemandFunnelModal] = useState(false);
	const [totalRecords, setTotalRecords] = useState(0);
	const [pageSize, setPageSize] = useState(100);
	const [pageIndex, setPageIndex] = useState(1);
	const pageSizeOptions = [100, 200, 300, 500, 1000];
	const [startDate, setStartDate] = useState();
	const [endDate, setEndDate] = useState(null);

	const [listData, setListData] = useState([])

	const[checkedValue,setCheckedValue] = useState(true);
	const[checkednoValue,setCheckednoValue] = useState(false);
	const [slaValue, setslaValue] = useState(0);
	const checkedYes = (e) =>{
		setCheckedValue(e.target.checked);
		setCheckednoValue(false);
		setslaValue(0);
		setTableFilteredState({
			totalrecord: 100,
			pagenumber: 1,
			isExport: false,
			filterFieldsSLA: {
				startDate: "2023-06-01",
				endDate: "2023-06-30",
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
				// ambdr: 0
			}
		})
	}
	const checkedNo = (e) =>{
		setCheckednoValue(e.target.checked);
		setCheckedValue(false);
		setslaValue(1);
		setTableFilteredState({
			totalrecord: 100,
			pagenumber: 1,
			isExport: false,
			filterFieldsSLA: {
				startDate: "2023-06-01",
				endDate: "2023-06-30",
				hrid: 0,
				sales_ManagerID: 0,
				ops_Lead: 0,
				salesPerson: 0,
				stages: "",
				isAdHoc: 0,
				role: "",
				slaType: 1,
				type: 0,
				hR_Number: "",
				company: "",
				actionFilter: 0,
				// ambdr: 0
			}
		})
	}

	console.log(watch("remote"),"remote");
	const watchSLAValue = watch("remote");
	console.log(typeof slaValue,"slaValue");

	let data = slaValue;

	const [tableFilteredState, setTableFilteredState] = useState({
		totalrecord: 100,
			pagenumber: 1,
			isExport: false,
			filterFieldsSLA: {
				startDate: "2023-06-01",
				endDate: "2023-06-30",
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
				// ambdr: 0
			}
	});

	console.log(tableFilteredState,"tableFilteredState");

	const slaReportList = async (pageData) => {
		let obj = {
			startDate: moment(pageData?.filterFields_ViewAllHRs?.fromDate).format("YYYY-MM-DD"),
			endDate: moment(pageData?.filterFields_ViewAllHRs?.toDate).format("YYYY-MM-DD"),
			hrid: 0,
			sales_ManagerID: 0,
			ops_Lead: 0,
			salesPerson: 0,
			stages: "",
			isAdHoc: 0,
			role: "",
			hR_Number: "",
			company: "",
			actionFilter: 0,
			ambdr: 0
		}
		setLoading(true);
		let response = await ReportDAO.OverAllSLASummaryDAO(obj)
		if (response?.statusCode === HTTPStatusCode.OK) {
			setLoading(false);
			setListData(response?.responseBody)
		} else {
			setLoading(false);
		}
	}

	const [slaDetailsList, setSlaDetailsList] = useState([])

	const slaReportDetails = async (pageData) => {
		let data = {
			totalrecord: pageData?.totalRecord ? pageData?.totalRecord : 100,
			pagenumber: pageData?.pageNumber ? pageData?.pageNumber : 1,
			isExport: false,
			filterFieldsSLA: {
				startDate: "2023-05-01",
				endDate: "2023-05-10",
				hrid: 0,
				sales_ManagerID: 0,
				ops_Lead: 0,
				salesPerson: 0,
				stage: "",
				isAdHoc: 0,
				role: "",
				slaType: 0,
				type: 0,
				hR_Number: "",
				company: "",
				actionFilter: 0,
				// ambdr: 0
			}
		}
		setSummaryLoading(true);
		let response = await ReportDAO.slaDetailedDataDAO(data)
		if (response?.statusCode === HTTPStatusCode?.OK) {
			// setPageNumber(response?.responseBody?.pagenumber)
			setTotalRecords(response?.responseBody?.totalrows)
			setSummaryLoading(false);
			setSlaDetailsList(
				slaUtils.slaListData(response && response),
			);
		} else {
			setApiData([]);
			setSummaryLoading(false);
			setTotalRecords(0);
		}
	}


	const getEngagementFilterList = useCallback(async () => {
		const response = await ReportDAO.slaFilterDAO();
		if (response?.statusCode === HTTPStatusCode.OK) {
			setFiltersList(response && response?.responseBody);
		}

	}, []);


	const toggleHRFilter = useCallback(() => {
		getEngagementFilterList();
		!getHTMLFilter
			? setIsAllowFilters(!isAllowFilters)
			: setTimeout(() => {
				setIsAllowFilters(!isAllowFilters);
			}, 300);
		setHTMLFilter(!getHTMLFilter);
	}, [getEngagementFilterList, getHTMLFilter, isAllowFilters]);


	const onCalenderFilter = (dates) => {
		const [start, end] = dates;

		setStartDate(start);
		setEndDate(end);

		if (start && end) {
			console.log(start, "start")
			console.log(end, "endndnndnd")
			setTableFilteredState({
				...tableFilteredState,
				filterFields_ViewAllHRs: {
					fromDate: new Date(start).toLocaleDateString('en-US'),
					toDate: new Date(end).toLocaleDateString('en-US'),
				},
			});
			slaReportList({
				...tableFilteredState,
				filterFields_ViewAllHRs: {
					fromDate: new Date(start).toLocaleDateString('en-US'),
					toDate: new Date(end).toLocaleDateString('en-US'),
				},
			});
		}
	};
	const onRemoveFilters = () => {
		setTimeout(() => {
			setIsAllowFilters(false);
		}, 300);
		setHTMLFilter(false);
	};
	console.log(slaDetailsList, "slaDetailsList")
	const tableColumnsMemo = useMemo(
		() =>
			reportConfig.SLAReportConfig(
				listData && listData,
				// demandFunnelModal,
				// setDemandFunnelModal,
				// setDemandFunnelHRDetailsState,
				// demandFunnelHRDetailsState,
				// setDemandFunnelValue,
			),
		[listData],
	);
	const slaDetailColumn = useMemo(
		() =>
			reportConfig.SLAReportDetailListConfig(
				slaDetailsList && slaDetailsList,
				// demandFunnelModal,
				// setDemandFunnelModal,
				// setDemandFunnelHRDetailsState,
				// demandFunnelHRDetailsState,
				// setDemandFunnelValue,
			),
		[slaDetailsList],
	);

	// const viewSummaryMemo = useMemo(
	// 	() =>
	// 		reportConfig.slaReportTableData(viewSummaryData && viewSummaryData),
	// 	[viewSummaryData],
	// );

	// const toggleDemandReportFilter = useCallback(() => {
	// 	!getHTMLFilter
	// 		? setIsAllowFilters(!isAllowFilters)
	// 		: setTimeout(() => {
	// 			setIsAllowFilters(!isAllowFilters);
	// 		}, 300);
	// 	setHTMLFilter(!getHTMLFilter);
	// }, [getHTMLFilter, isAllowFilters]);

	// useEffect(() => {
	// 	slaReportList(tableFilteredState);
	// }, [slaReportList, tableFilteredState]);
	// useEffect(() => {
	// 	getReportFilterHandler();
	// }, [getReportFilterHandler]);

	useEffect(() => {
		slaReportList()
		slaReportDetails()
	}, [])

	const handleHRRequest = useCallback(
		async (tableFilteredState) => {
			// setLoading(true);
			let response = await ReportDAO.slaDetailedDataDAO(tableFilteredState);
			setSlaDetailsList(
				slaUtils.slaListData(response && response),
			);
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
		[tableFilteredState],
	);

	useEffect(() => {
		setSlaReportDetailsState(tableFilteredState);
	}, [setSlaReportDetailsState, tableFilteredState]);




	return (
		<div className={SlaReportStyle.hiringRequestContainer}>
			<div className={SlaReportStyle.addnewHR}>
				<div className={SlaReportStyle.hiringRequest}>
					SLA Report
				</div>
			</div>
			{/*
			 * --------- Filter Component Starts ---------
			 * @Filter Part
			 */}
			<div className={SlaReportStyle.filterContainer}>
				<div className={SlaReportStyle.filterSets}>
					<div
						className={SlaReportStyle.addFilter}
						onClick={toggleHRFilter}>
						<FunnelSVG style={{ width: '16px', height: '16px' }} />

						<div className={SlaReportStyle.filterLabel}>Add Filters</div>
						<div className={SlaReportStyle.filterCount}>
							{filteredTagLength}
						</div>
					</div>
					<label >
									<p>Overall SLA</p>
									<input
										{...register('remote')}
										value={1}
										type="radio"
										checked={checkedValue}
										onChange={(e)=>{
											checkedYes(e)
										}}
										id="remote"
										name="remote"
									/>
									<span ></span>
								</label>
								<label >
									<p>SLA Missed</p>
									<input
										{...register('remote')}
										value={0}
										type="radio"
										checked={checkednoValue}
										onChange={(e)=>{
											checkedNo(e)
										}}
										id="remote"
										name="remote"
									/>
									<span ></span>
								</label>
					<div className={SlaReportStyle.calendarFilterSet}>
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
								onClick={() => downloadToExcel(slaDetailsList)}>
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
							id="hrListingTable"
							columns={tableColumnsMemo}
							bordered={false}
							dataSource={listData}
							pagination={{
								size: 'small',
								pageSize: listData?.length,
							}}
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

			<div className={SlaReportStyle.tableDetails}>
				{isSummaryLoading ? (
					<TableSkeleton />
				) : (
					<>
						<Table
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
									slaReportDetails({ pageNumber: pageNum, totalRecord: pageSize });
								},
								size: 'small',
								pageSize: pageSize,
								pageSizeOptions: pageSizeOptions,
								total: totalRecords,
								showTotal: (total, range) =>
									`${range[0]}-${range[1]} of ${totalRecords} items`,
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
							filtersList && filtersList,
						)}
						setSlaReportDetailsState={setSlaReportDetailsState}
						slaReportDetailsState={slaReportDetailsState}
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
		</div>
	);
};

export default SlaReports;
