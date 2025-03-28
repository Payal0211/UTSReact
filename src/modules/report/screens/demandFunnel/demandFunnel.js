import DemandFunnelStyle from './demandFunnel.module.css';
import { ReactComponent as FunnelSVG } from 'assets/svg/funnel.svg';
import { ReactComponent as ArrowDownSVG } from 'assets/svg/arrowDownLight.svg';
import { Table,Checkbox  } from 'antd';
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
import WithLoader from 'shared/components/loader/loader';
import LogoLoader from 'shared/components/loader/logoLoader';
import moment from 'moment';
const DemandFunnelFilterLazyComponent = React.lazy(() =>
	import('modules/report/components/demandFunnelFilter/demandFunnelFilter'),
);

export const demandFunnelDefault = {
	startDate: '',
	endDate: '',
	isHiringNeedTemp: '',
	modeOfWork: '',
	typeOfHR: '-1',
	companyCategory: '',
	replacement: '',
	head: '',
	isActionWise: true,
	geos:'',
	DemandFunnelStages:1
};
const DemandFunnelScreen = () => {
	const { control } = useForm();
	const [tableFilteredState, setTableFilteredState] = useState({
		...demandFunnelDefault,
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
	const [talentListData,setTalentListData] = useState([]);
	const [withoutDateListData,setWithoutDateListData] = useState([]);
	const [trListData,setTRListData] = useState([]);
	const [profileListData,setProfileListData] = useState([]);
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
	const [isFocusedRole, setIsFocusedRole] = useState(false);
	const date = new Date()
	const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
	const [startDate, setStartDate] = useState(firstDay);
	const [endDate, setEndDate] = useState(date);

	const [showAccordion,setShowAccordion] = useState({
		talent:true,
		withoutDates:false,
		tr:false,
		profile:false
	})

	const demandFunnelStages = {
		talent : 1,
		withoutDates : 2,
		tr : 3,
		profile : 4
	}

	const getDemandFunnelListingHandler = useCallback(async (taleData) => {
		if (taleData.startDate && taleData.endDate){
			setLoading(true);
		let response = await ReportDAO.demandFunnelListingRequestDAO({...taleData,  "isHrfocused" : isFocusedRole});
		if (response?.statusCode === HTTPStatusCode.OK) {
			setLoading(false);
			setApiData(response?.responseBody);

			if(taleData.DemandFunnelStages === demandFunnelStages.talent){
				setTalentListData(response?.responseBody)
			}

			if(taleData.DemandFunnelStages === demandFunnelStages.withoutDates){
				setWithoutDateListData(response?.responseBody)
			}

			if(taleData.DemandFunnelStages === demandFunnelStages.tr){
				setTRListData(response?.responseBody)
			}

			if(taleData.DemandFunnelStages === demandFunnelStages.profile){
				setProfileListData(response?.responseBody)
			}


		} else {
			setLoading(false);
			setApiData([]);
			if(taleData.DemandFunnelStages === demandFunnelStages.talent){
				setTalentListData([])
			}

			if(taleData.DemandFunnelStages === demandFunnelStages.withoutDates){
				setWithoutDateListData([])
			}

			if(taleData.DemandFunnelStages === demandFunnelStages.tr){
				setTRListData([])
			}

			if(taleData.DemandFunnelStages === demandFunnelStages.profile){
				setProfileListData([])
			}
		}
		}
		
	}, [isFocusedRole]);


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
			// getDemandFunnelListingHandler({
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

	const viewDemandFunnelSummaryHandler = useCallback(async (reqFilter) => {
		setIsSummary(true);
		setSummaryLoading(true);

		let response = await ReportDAO.demandFunnelSummaryRequestDAO({...reqFilter, "isHrfocused" : isFocusedRole});
		if (response?.statusCode === HTTPStatusCode.OK) {
			setSummaryData(response?.responseBody);
			setSummaryLoading(false);
		} else {
			setSummaryData([]);
			setSummaryLoading(false);
		}
	}, [isFocusedRole]);

	const tableColumnsMemo = useMemo(
		() =>
			reportConfig.demandFunnelTable(
				apiData && apiData,
				demandFunnelModal,
				setDemandFunnelModal,
				setDemandFunnelHRDetailsState,
				demandFunnelHRDetailsState,
				setDemandFunnelValue,
			),
		[apiData, demandFunnelHRDetailsState, demandFunnelModal],
	);

	const viewSummaryMemo = useMemo(
		() =>
			reportConfig.viewSummaryDemandFunnel(viewSummaryData && viewSummaryData),
		[viewSummaryData],
	);
	const getReportFilterHandler = useCallback(async () => {
		setLoading(true);
		const response = await ReportDAO.demandFunnelFiltersRequestDAO();
		if (response?.statusCode === HTTPStatusCode.OK) {
			setFiltersList(response && response?.responseBody?.Data);
			// setStartDate(new Date(response?.responseBody?.Data?.StartDate));
			// setEndDate(new Date(response?.responseBody?.Data?.EndDate));
			setTableFilteredState({
				...tableFilteredState,
				startDate: moment(firstDay).format('yyyy-MM-DD') ,
				endDate: moment(date).format('yyyy-MM-DD'),
			});
			setDemandFunnelHRDetailsState({
				...demandFunnelHRDetailsState,

				funnelFilter: {
					...demandFunnelHRDetailsState?.funnelFilter,

					startDate: moment(firstDay).format('yyyy-MM-DD') ,
					endDate: moment(date).format('yyyy-MM-DD'),
				},
			});
			setLoading(false);
		} else {
			setFiltersList([]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const toggleDemandReportFilter = useCallback(() => {
		!getHTMLFilter
			? setIsAllowFilters(!isAllowFilters)
			: setTimeout(() => {
					setIsAllowFilters(!isAllowFilters);
			  }, 300);
		setHTMLFilter(!getHTMLFilter);
	}, [getHTMLFilter, isAllowFilters]);

	useEffect(() => {
		getDemandFunnelListingHandler(tableFilteredState);
	}, [getDemandFunnelListingHandler, tableFilteredState,isFocusedRole]);
	useEffect(() => {
		getReportFilterHandler();
	}, [getReportFilterHandler]);

	const clearFilters = useCallback(() => {
		setAppliedFilters(new Map());
		setCheckedState(new Map());
		setFilteredTagLength(0);
		setStartDate(firstDay)
		setEndDate(date)
		setTableFilteredState({
			startDate: moment(firstDay).format('yyyy-MM-DD') ,
			endDate: moment(date).format('yyyy-MM-DD'),
			isHiringNeedTemp: '',
			modeOfWork: '',
			typeOfHR: '-1',
			companyCategory: '',
			replacement: '',
			head: '',
			isActionWise: true,
			geos:'',
		});
		setDemandFunnelHRDetailsState({
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
			funnelFilter: {
				startDate: moment(firstDay).format('yyyy-MM-DD') ,
				endDate: moment(date).format('yyyy-MM-DD'),
				isHiringNeedTemp: '',
				modeOfWork: '',
				typeOfHR: '-1',
				companyCategory: '',
				replacement: '',
				head: '',
				isActionWise: true,
				geos:'',
			},
		});
		viewDemandFunnelSummaryHandler(demandFunnelDefault);
		const reqFilter = {
			startDate: moment(firstDay).format('yyyy-MM-DD') ,
				endDate: moment(date).format('yyyy-MM-DD'),
			isHiringNeedTemp: '',
			modeOfWork: '',
			typeOfHR: '-1',
			companyCategory: '',
			replacement: '',
			head: '',
			isActionWise: true,
			geos:'',
		};
		onRemoveFilters()
		getReportFilterHandler()
		setIsFocusedRole(false)
		// getDemandFunnelListingHandler(reqFilter);
	}, [
		setAppliedFilters,
		setCheckedState,
		setDemandFunnelHRDetailsState,
		setFilteredTagLength,
		setTableFilteredState,
		viewDemandFunnelSummaryHandler,
		getDemandFunnelListingHandler,
		getReportFilterHandler,
		setIsFocusedRole
	]);

	return (
		<div className={DemandFunnelStyle.hiringRequestContainer}>
			{/* <WithLoader className="pageMainLoader" showLoader={isLoading}> */}
			<div className={DemandFunnelStyle.addnewHR}>
				<div className={DemandFunnelStyle.hiringRequest}>
					Demand Funnel Report
				</div>
				<LogoLoader visible={isLoading} />
			</div>
			{/*
			 * --------- Filter Component Starts ---------
			 * @Filter Part
			 */}
			<div className={DemandFunnelStyle.filterContainer}>
				<div className={DemandFunnelStyle.filterSets}>
					<div className={DemandFunnelStyle.filterSetsInner} >
						<div
						className={DemandFunnelStyle.addFilter}
						onClick={toggleDemandReportFilter}>
						<FunnelSVG style={{ width: '16px', height: '16px' }} />

						<div className={DemandFunnelStyle.filterLabel}>Add Filters</div>
						<div className={DemandFunnelStyle.filterCount}>
							{filteredTagLength}
						</div>
					</div>
					<p onClick={()=> clearFilters() }>Reset Filters</p>
					</div>
					
					<div className={DemandFunnelStyle.calendarFilterSet}>
						<div className={DemandFunnelStyle.actionTab_Exceeded} style={{display:'flex',alignItems:'center'}}>
							{/* <span className={DemandFunnelStyle.actionTab_Exceeded}></span> */}
							Stage Count without Dates Filter
						</div>
					{/* <Checkbox checked={isFocusedRole} onClick={()=> setIsFocusedRole(prev=> !prev)}>
					Show only Focused Role
						</Checkbox>	 */}
						<div className={DemandFunnelStyle.label}>Date</div>
						{/* <div className={DemandFunnelStyle.calendarFilter}>
							<CalenderSVG style={{ height: '16px', marginRight: '16px' }} />
							<DatePicker
								style={{ backgroundColor: 'red' }}
								onKeyDown={(e) => {
									e.preventDefault();
									e.stopPropagation();
								}}
								className={DemandFunnelStyle.dateFilter}
								placeholderText="Start date - End date"
								selected={startDate}
								onChange={onCalenderFilter}
								startDate={startDate}
								endDate={endDate}
								selectsRange
							/>
						</div> */}
						<div className={DemandFunnelStyle.calendarFilter}>
							<CalenderSVG style={{ height: '16px', marginRight: '16px' }} />
							<Controller
								render={({ ...props }) => (
									<DatePicker
										className={DemandFunnelStyle.dateFilter}
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
										dateFormat={'dd/MM/yyyy'}
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


			<div className={DemandFunnelStyle.AccordionContainer}>
			<div onClick={()=>{
				setShowAccordion(prev=> ({
					withoutDates:false,
					tr:false,
					profile:false,
					talent: !prev.talent,
				}))
				!showAccordion.talent && setTableFilteredState(prev=>({...prev,DemandFunnelStages: demandFunnelStages.talent}))
				}} className={DemandFunnelStyle.colHeader}><h3 style={{textDecoration:'underline'}}>Talent</h3>   <ArrowDownSVG style={{ rotate: showAccordion.talent ? '180deg' : '' }}  /></div>
				
				{showAccordion.talent && <>
				{isLoading ? (
									<TableSkeleton />
								) : (
										<Table
											className="demandTable"
											scroll={{ x: 150, y: 'calc(100vh - 220px)' }}
											// scrollToFirstRowOnChange
											id="hrListingTable"
											columns={tableColumnsMemo}
											bordered={false}
											dataSource={[...talentListData?.slice(1)]}
											pagination={false}
										/>
										

								)}
				</>}
				
			</div>

			<div className={DemandFunnelStyle.AccordionContainer}>
			<div onClick={()=>{
				setShowAccordion(prev=> ({
					talent:false,
					tr:false,
					profile:false,
					withoutDates:!prev.withoutDates,
				}))
				!showAccordion.withoutDates && setTableFilteredState(prev=>({...prev,DemandFunnelStages: demandFunnelStages.withoutDates}))
				}} className={DemandFunnelStyle.colHeader}><h3 style={{textDecoration:'underline'}}>Without Dates</h3>   <ArrowDownSVG style={{ rotate: showAccordion.withoutDates ? '180deg' : '' }}  /></div>
				
				{showAccordion.withoutDates && <>
					{isLoading ? (
					<TableSkeleton />
				) : (
					<>
						<Table
							className="demandTable"
							scroll={{ x: 150, y: 'calc(100vh - 220px)' }}
							// scrollToFirstRowOnChange
							id="hrListingTable"
							columns={tableColumnsMemo}
							bordered={false}
							dataSource={[...withoutDateListData?.slice(1)]}
							pagination={false}
						/>
						
					</>
				)}
				</>}
			
			</div>

			<div className={DemandFunnelStyle.AccordionContainer}>
			<div onClick={()=>{setShowAccordion(prev=> ({
					talent:false,
					withoutDates:false,
					profile:false,
					tr:!prev.tr,					
				}))
				!showAccordion.tr && setTableFilteredState(prev=>({...prev,DemandFunnelStages: demandFunnelStages.tr}))
				}} className={DemandFunnelStyle.colHeader}><h3 style={{textDecoration:'underline'}}>TR</h3>   <ArrowDownSVG style={{ rotate: showAccordion.tr ? '180deg' : '' }}  /></div>
				
				{showAccordion.tr && <>
						{isLoading ? (
					<TableSkeleton />
				) : (
					<>
						<Table
							className="demandTable"
							scroll={{ x: 150, y: 'calc(100vh - 220px)' }}
							// scrollToFirstRowOnChange
							id="hrListingTable"
							columns={tableColumnsMemo}
							bordered={false}
							dataSource={[...trListData?.slice(1)]}
							pagination={false}
						/>
					
					</>
				)}
				</>}
		
			</div>

			<div className={DemandFunnelStyle.AccordionContainer}>
			<div onClick={()=>{setShowAccordion(prev=> ({
					talent:false,
					withoutDates:false,
					tr:false,
					profile:!prev.profile,
				}))
				!showAccordion.profile && setTableFilteredState(prev=>({...prev,DemandFunnelStages: demandFunnelStages.profile}))
				}} className={DemandFunnelStyle.colHeader}><h3 style={{textDecoration:'underline'}}>Profile</h3>   <ArrowDownSVG style={{ rotate: showAccordion.profile ? '180deg' : '' }}  /></div>
				{showAccordion.profile && <>
				{isLoading ? (
					<TableSkeleton />
				) : (
					<>
						<Table
							className="demandTable"
							scroll={{ x: 150, y: 'calc(100vh - 220px)' }}
							// scrollToFirstRowOnChange
							id="hrListingTable"
							columns={tableColumnsMemo}
							bordered={false}
							dataSource={[...profileListData?.slice(1)]}
							pagination={false}
						/>
						
					</>
				)}
				</>}

				
			</div>
			<div className={DemandFunnelStyle.tableDetails}>
				{isLoading ? (
					<TableSkeleton />
				) : (
					<>
						{/* <Table
							className="demandTable"
							scroll={{ x: 150, y: 'calc(100vh - 220px)' }}
							// scrollToFirstRowOnChange
							id="hrListingTable"
							columns={tableColumnsMemo}
							bordered={false}
							dataSource={[...apiData?.slice(1)]}
							pagination={{
								size: 'small',
								pageSize: apiData?.length,
							}}
						/> */}
						<div className={DemandFunnelStyle.formPanelAction}>
							<button
								type="submit"
								onClick={() =>
									viewDemandFunnelSummaryHandler(tableFilteredState)
								}
								className={DemandFunnelStyle.btnPrimary}>
								View Summary
							</button>
						</div>
					</>
				)}
			</div>
			{isSummary && (
				<div className={DemandFunnelStyle.tableDetails} style={{marginTop: '0'}}>
					{isSummaryLoading ? (
						<TableSkeleton />
					) : (
						<>
							<Table
								scroll={{ x: '100vw', y: '100vh' }}
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
			)}

			{isAllowFilters && (
				<Suspense fallback={<div>Loading...</div>}>
					<DemandFunnelFilterLazyComponent
						setAppliedFilters={setAppliedFilters}
						appliedFilter={appliedFilter}
						setCheckedState={setCheckedState}
						checkedState={checkedState}
						handleHRRequest={getDemandFunnelListingHandler}
						setTableFilteredState={setTableFilteredState}
						tableFilteredState={tableFilteredState}
						setFilteredTagLength={setFilteredTagLength}
						onRemoveHRFilters={onRemoveFilters}
						getHTMLFilter={getHTMLFilter}
						hrFilterList={reportConfig.demandReportFilterListConfig()}
						filtersType={reportConfig.demandReportFilterTypeConfig(
							filtersList && filtersList,
						)}
						viewDemandFunnelSummaryHandler={viewDemandFunnelSummaryHandler}
						setDemandFunnelHRDetailsState={setDemandFunnelHRDetailsState}
						demandFunnelHRDetailsState={demandFunnelHRDetailsState}
						clearFilters={clearFilters}
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
					isFocusedRole={isFocusedRole}
				/>
			)}
		{/* </WithLoader> */}
		</div>
	);
};

export default DemandFunnelScreen;
