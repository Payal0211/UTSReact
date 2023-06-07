import SlaReportStyle from './slaReport.module.css';
import { ReactComponent as FunnelSVG } from 'assets/svg/funnel.svg';
import { Table } from 'antd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
const DemandFunnelFilterLazyComponent = React.lazy(() =>
	import('modules/report/components/demandFunnelFilter/demandFunnelFilter'),
);

const SlaReports = () => {
	const { control } = useForm();
	const [tableFilteredState, setTableFilteredState] = useState({
		startDate: '',
		endDate: '',
		isHiringNeedTemp: '',
		modeOfWork: '',
		typeOfHR: '-1',
		companyCategory: '',
		replacement: '',
		head: '',
		isActionWise: true,
	});

	const [demandFunnelValue, setDemandFunnelValue] = useState({});
	const [demandFunnelHRDetailsState, setDemandFunnelHRDetailsState] = useState({
		adhocType: '',
		TeamManagerName: '',
		currentStage: '',
		IsExport: false,
		hrFilter: {
			hR_No: '',
			salesPerson: '',
			compnayName: '',
			role: '',
			managed_Self: '',
			talentName: '',
			availability: '',
		},
		funnelFilter: { ...tableFilteredState },
	});

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

	const [startDate, setStartDate] = useState();
	const [endDate, setEndDate] = useState(null);

	const [listData, setListData] = useState([])
	// const getDemandFunnelListingHandler = useCallback(async (taleData) => {
	// 	setLoading(true);
	// 	let response = await ReportDAO.demandFunnelListingRequestDAO(taleData);
	// 	if (response?.statusCode === HTTPStatusCode.OK) {
	// 		setLoading(false);
	// 		setApiData(response?.responseBody);
	// 	} else {
	// 		setLoading(false);
	// 		setApiData([]);
	// 	}
	// }, []);

	const slaReportList = async () => {
		let obj = {
			startDate: "2023-05-01",
			endDate: "2023-05-31",
			hrid: 0,
			sales_ManagerID: 0,
			ops_Lead: 0,
			salesPerson: 0,
			stage: "",
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


	const slaReportDetails = async () => {

		let data = {
			totalrecord: 10,
			pagenumber: 1,
			isExport: false,
			filterFieldsSLA: {
				startDate: "2023-04-01",
				endDate: "2023-05-31",
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
		console.log(data, "datatdatdad")
		let response = await ReportDAO.slaDetailedDataDAO(data)
		// console.log(response, "responsnsnssnsn")
	}

	const onCalenderFilter = (dates) => {
		const [start, end] = dates;

		setStartDate(start);
		setEndDate(end);

		if (start && end) {
			setTableFilteredState({
				...tableFilteredState,
				startDate: new Date(start)
					.toLocaleDateString('en-UK')
					.split('/')
					.reverse()
					.join('-'),
				endDate: new Date(end)
					.toLocaleDateString('en-UK')
					.split('/')
					.reverse()
					.join('-'),
			});
			setDemandFunnelHRDetailsState({
				...demandFunnelHRDetailsState,

				funnelFilter: {
					...demandFunnelHRDetailsState?.funnelFilter,
					startDate: new Date(start)
						.toLocaleDateString('en-UK')
						.split('/')
						.reverse()
						.join('-'),
					endDate: new Date(end)
						.toLocaleDateString('en-UK')
						.split('/')
						.reverse()
						.join('-'),
				},
			});
			// slaReportList({
			// 	...tableFilteredState,
			// 	startDate: new Date(start)
			// 		.toLocaleDateString('en-UK')
			// 		.split('/')
			// 		.reverse()
			// 		.join('-'),
			// 	endDate: new Date(end)
			// 		.toLocaleDateString('en-UK')
			// 		.split('/')
			// 		.reverse()
			// 		.join('-'),
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
		() =>
			reportConfig.SLAReportConfig(
				listData && listData,
				demandFunnelModal,
				setDemandFunnelModal,
				setDemandFunnelHRDetailsState,
				demandFunnelHRDetailsState,
				setDemandFunnelValue,
			),
		[listData, demandFunnelHRDetailsState, demandFunnelModal],
	);




	// const viewSummaryMemo = useMemo(
	// 	() =>
	// 		reportConfig.slaReportTableData(viewSummaryData && viewSummaryData),
	// 	[viewSummaryData],
	// );


	const viewSummaryMemo = [
		{
			title: 'HR#',
			dataIndex: 'hr',
		},
		{
			title: 'Role',
			dataIndex: 'role',
		},
		{
			title: 'Company',
			dataIndex: 'company',
		},
		{
			title: 'Client',
			dataIndex: 'client',
		},
		{
			title: 'Talent',
			dataIndex: 'talent',
		},
		{
			title: 'Odr/pool',
			dataIndex: 'pool',
		},
		{
			title: 'Stage',
			dataIndex: 'stage',
		},
		{
			title: 'Curr Action Date',
			dataIndex: 'curractionDate',
		},
		{
			title: 'Exp Next Action Date',
			dataIndex: 'expNextActionDate',
		},
		{
			title: 'Actual Next Action date',
			dataIndex: 'actualNextActionDate',
		},
		{
			title: 'Expected SLA',
			dataIndex: 'expectedSLA',
		},
		{
			title: 'Actual SLA',
			dataIndex: 'ActualSLA',
		},
		{
			title: 'SLA diff',
			dataIndex: 'slaDiff',
		},
		{
			title: 'Action',
			dataIndex: 'action',
		},
		{
			title: 'Sales Person',
			dataIndex: 'salesPerson',
		},
		{
			title: 'Sales Manager',
			dataIndex: 'salesManager',
		},
		{
			title: 'OPS Lead',
			dataIndex: 'opsLead',
		},
	];


	// const getReportFilterHandler = useCallback(async () => {
	// 	const response = await ReportDAO.demandFunnelFiltersRequestDAO();
	// 	if (response?.statusCode === HTTPStatusCode.OK) {
	// 		setFiltersList(response && response?.responseBody?.Data);
	// 		setStartDate(new Date(response?.responseBody?.Data?.StartDate));
	// 		setEndDate(new Date(response?.responseBody?.Data?.EndDate));
	// 		setTableFilteredState({
	// 			...tableFilteredState,
	// 			startDate: response?.responseBody?.Data?.StartDate,
	// 			endDate: response?.responseBody?.Data?.EndDate,
	// 		});
	// 		setDemandFunnelHRDetailsState({
	// 			...demandFunnelHRDetailsState,

	// 			funnelFilter: {
	// 				...demandFunnelHRDetailsState?.funnelFilter,

	// 				startDate: response?.responseBody?.Data?.StartDate,
	// 				endDate: response?.responseBody?.Data?.EndDate,
	// 			},
	// 		});
	// 	} else {
	// 		setFiltersList([]);
	// 	}
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, []);

	const toggleDemandReportFilter = useCallback(() => {
		!getHTMLFilter
			? setIsAllowFilters(!isAllowFilters)
			: setTimeout(() => {
				setIsAllowFilters(!isAllowFilters);
			}, 300);
		setHTMLFilter(!getHTMLFilter);
	}, [getHTMLFilter, isAllowFilters]);

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
						onClick={toggleDemandReportFilter}>
						<FunnelSVG style={{ width: '16px', height: '16px' }} />

						<div className={SlaReportStyle.filterLabel}>Add Filters</div>
						<div className={SlaReportStyle.filterCount}>
							{filteredTagLength}
						</div>
					</div>
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
							<Controller
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
							/>
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
							dataSource={[...listData?.slice(1)]}
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
							id="hrListingTable"
							columns={viewSummaryMemo}
							bordered={false}
							dataSource={[...viewSummaryData?.slice(1)]}
							pagination={{
								size: 'small',
								pageSize: viewSummaryData?.length,
							}}
						/>
					</>
				)}
			</div>


			{isAllowFilters && (
				<Suspense fallback={<div>Loading...</div>}>
					<DemandFunnelFilterLazyComponent
						setAppliedFilters={setAppliedFilters}
						appliedFilter={appliedFilter}
						setCheckedState={setCheckedState}
						checkedState={checkedState}
						handleHRRequest={slaReportList}
						setTableFilteredState={setTableFilteredState}
						tableFilteredState={tableFilteredState}
						setFilteredTagLength={setFilteredTagLength}
						onRemoveHRFilters={onRemoveFilters}
						getHTMLFilter={getHTMLFilter}
						hrFilterList={reportConfig.slaReportFilterList()}
						filtersType={reportConfig.demandReportFilterTypeConfig(
							filtersList && filtersList,
						)}
						setDemandFunnelHRDetailsState={setDemandFunnelHRDetailsState}
						demandFunnelHRDetailsState={demandFunnelHRDetailsState}
					/>
				</Suspense>
			)}
			{demandFunnelModal && (
				<DemandFunnelModal
					demandFunnelModal={demandFunnelModal}
					setDemandFunnelModal={setDemandFunnelModal}
					demandFunnelHRDetailsState={demandFunnelHRDetailsState}
					setDemandFunnelHRDetailsState={setDemandFunnelHRDetailsState}
					demandFunnelValue={demandFunnelValue}
				/>
			)}
		</div>
	);
};

export default SlaReports;
