import TeamDemandFunnelStyle from './teamDemandFunnel.module.css';
import { ReactComponent as FunnelSVG } from 'assets/svg/funnel.svg';
import { Modal, Switch, Table, Tooltip } from 'antd';
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
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import { Controller, useForm } from 'react-hook-form';
import Column from 'antd/lib/table/Column';
import ColumnGroup from 'antd/lib/table/ColumnGroup';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import { MasterDAO } from 'core/master/masterDAO';
import TeamDemandFunnelModal from 'modules/report/components/teamDemandFunnelModal/teamDemandFunnelModal';
import WithLoader from 'shared/components/loader/loader';
const TeamDemandFunnelFilterLazyComponent = React.lazy(() =>
	import(
		'modules/report/components/teamDemandFunnelFilter/teamDemandFunnelFilter'
	),
);

const TeamDemandFunnelScreen = () => {
	const [selectedHierarchy, setSelectedHierarchy] = useState();
	const {
		register,
		handleSubmit,
		setValue,
		unregister,
		watch,
		control,
		formState: { errors },
	} = useForm({});
	const [tableFilteredState, setTableFilteredState] = useState({
		startDate: '',
		endDate: '',
		salesManagerID: '',
		isHiringNeedTemp: '',
		modeOfWork: '',
		typeOfHR: '-1',
		companyCategory: '',
		isActionWise: false,
	});

	const [supplyFunnelValue, setSupplyFunnelValue] = useState({});
	// const [supplyFunnelHRDetailsState, setSupplyFunnelHRDetailsState] = useState({
	// 	newExistingType: '',
	// 	selectedRow_SalesUserName: '',
	// 	currentStage: 'TR Accepted',
	// 	isExport: false,
	// 	funnelFilter: tableFilteredState,
	// });
	const [teamDemandFunnelHRDetailsState, setTeamDemandFunnelHRDetailsState] =
		useState({
			adhocType: '',
			selectedRow_SalesUserName: '',
			currentStage: 'TR Accepted',
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
	const [teamDemandFunnelModal, setTeamDemandFunnelModal] = useState(true);
	const [teamDemandHRDetailsModal, setTeamDemandHRDetailsModal] =
		useState(false);
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
	// const [supplyFunnelModal, setSupplyFunnelModal] = useState(false);

	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);

	const getTeamDemandFunnelListingHandler = useCallback(async (tableData) => {
		setLoading(true);
		let response = await ReportDAO.teamDemandFunnelListingRequestDAO(tableData);
		console.log(response, '--response-');
		if (response?.statusCode === HTTPStatusCode.OK) {
			setLoading(false);
			setApiData(response?.responseBody);
		} else {
			setLoading(false);
			setApiData([]);
		}
	}, []);

	const unGroupedColumnDataMemo = useMemo(() => {
		let tableHeader = Object?.keys(apiData?.[0] || {});
		let tempArray = [];

		tableHeader?.forEach((item) => {
			if (
				item === 'Stage' ||
				item === 'Duration' ||
				item === 'Final Total' ||
				item === 'Pool Total' ||
				item === 'Odr Total'
			) {
				tempArray.push(item);
			}
		});
		return tempArray;
	}, [apiData]);

	const groupedColumnDataMemo = useMemo(() => {
		let tableHeader = Object?.keys(apiData?.[0] || {});
		let tempArray = [];
		let finalArray = [[]];

		tableHeader?.forEach((item) => {
			if (
				item !== 'Stage' &&
				item !== 'Duration' &&
				item !== 'Final Total' &&
				item !== 'Pool Total' &&
				item !== 'Odr Total'
			) {
				tempArray.push(item);
			}
		});

		for (let i = tempArray.length - 1; i >= 1; i = i - 3) {
			finalArray.push(tempArray[i]);
			finalArray.push(tempArray.slice(i - 2, i));
		}
		return finalArray.slice(1);
	}, [apiData]);

	/** Grouped Column Table */
	const GroupedColumn = useCallback(() => {
		let ColumnData = [];
		for (let i = 0; i < groupedColumnDataMemo?.length - 1; i = i + 2) {
			let comp = (
				<ColumnGroup title={groupedColumnDataMemo[i]}>
					<Column
						title="Odr"
						dataIndex={groupedColumnDataMemo[i + 1][0]}
						key={groupedColumnDataMemo[i + 1][0]}
						render={(text, param) => (
							<Tooltip
								placement="bottomLeft"
								title={text}>
								<p
									style={{
										textDecoration: 'underline',
										cursor: text === 0 ? 'no-drop' : 'pointer',
									}}
									onClick={
										text === 0
											? null
											: () => {
													setTeamDemandHRDetailsModal(true);
													setSupplyFunnelValue({
														stage: param?.Stage,
														count: text,
													});
													setTeamDemandFunnelHRDetailsState({
														...teamDemandFunnelHRDetailsState,
														adhocType: 'Odr',
														currentStage: param.Stage,
														selectedRow_SalesUserName: groupedColumnDataMemo[i],
													});
											  }
									}>
									{text}
								</p>
							</Tooltip>
						)}
					/>
					<Column
						title="Pool"
						dataIndex={groupedColumnDataMemo[i + 1][1]}
						key={groupedColumnDataMemo[i + 1][1]}
						render={(text, param) => (
							<Tooltip
								placement="bottomLeft"
								title={text}>
								<p
									style={{
										textDecoration: 'underline',
										cursor: text === 0 ? 'no-drop' : 'pointer',
									}}
									onClick={
										text === 0
											? null
											: () => {
													setTeamDemandHRDetailsModal(true);
													setSupplyFunnelValue({
														stage: param?.Stage,
														count: text,
													});
													setTeamDemandFunnelHRDetailsState({
														...teamDemandFunnelHRDetailsState,
														newExistingType: 'Pool',
														currentStage: param.Stage,
														selectedRow_SalesUserName: groupedColumnDataMemo[i],
													});
											  }
									}>
									{text}
								</p>
							</Tooltip>
						)}
					/>
					<Column
						title="Total"
						dataIndex={groupedColumnDataMemo[i]}
						key={groupedColumnDataMemo[i]}
						render={(text, param) => (
							<Tooltip
								placement="bottomLeft"
								title={text}>
								<p
									style={{
										textDecoration: 'underline',
										cursor: text === 0 ? 'no-drop' : 'pointer',
									}}
									onClick={
										text === 0
											? null
											: () => {
													setTeamDemandHRDetailsModal(true);
													setSupplyFunnelValue({
														stage: param?.Stage,
														count: text,
													});
													setTeamDemandFunnelHRDetailsState({
														...teamDemandFunnelHRDetailsState,
														newExistingType: 'Total',
														currentStage: param.Stage,
														selectedRow_SalesUserName: groupedColumnDataMemo[i],
													});
											  }
									}>
									{text}
								</p>
							</Tooltip>
						)}
					/>
				</ColumnGroup>
			);
			ColumnData.push(comp);
		}
		return ColumnData;
	}, [groupedColumnDataMemo, teamDemandFunnelHRDetailsState]);

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
			setTeamDemandFunnelHRDetailsState({
				...teamDemandFunnelHRDetailsState,
				funnelFilter: {
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
			getTeamDemandFunnelListingHandler({
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
		}
	};
	const onRemoveFilters = () => {
		setTimeout(() => {
			setIsAllowFilters(false);
		}, 300);
		setHTMLFilter(false);
	};

	const viewSupplyFunnelSummaryHandler = useCallback(async () => {
		setIsSummary(true);
		setSummaryLoading(true);
		let response = await ReportDAO.teamDemandFunnelSummaryRequestDAO(
			tableFilteredState,
		);
		if (response?.statusCode === HTTPStatusCode.OK) {
			setSummaryData(response?.responseBody);
			setSummaryLoading(false);
		} else {
			setSummaryData([]);
			setSummaryLoading(false);
		}
	}, [tableFilteredState]);

	const unGroupedViewSummaryColumnDataMemo = useMemo(() => {
		let tableHeader = Object?.keys(viewSummaryData?.[0] || {});
		let tempArray = [];

		tableHeader?.forEach((item) => {
			if (
				item === 'Stage' ||
				item === 'Duration' ||
				item === 'Final Total' ||
				item === 'Pool Total' ||
				item === 'Odr Total'
			) {
				tempArray.push(item);
			}
		});
		return tempArray;
	}, [viewSummaryData]);
	const ViewSummaryGroupedColumnDataMemo = useMemo(() => {
		let tableHeader = Object?.keys(viewSummaryData?.[0] || {});
		let tempArray = [];
		let finalArray = [[]];

		tableHeader?.forEach((item) => {
			if (
				item !== 'Stage' &&
				item !== 'Duration' &&
				item !== 'Final Total' &&
				item !== 'Pool Total' &&
				item !== 'Odr Total'
			) {
				tempArray.push(item);
			}
		});

		for (let i = tempArray.length - 1; i >= 1; i = i - 3) {
			finalArray.push(tempArray[i]);
			finalArray.push(tempArray.slice(i - 2, i));
		}
		return finalArray.slice(1);
	}, [viewSummaryData]);
	const ViewSummaryGroupedColumn = useCallback(() => {
		let ColumnData = [];
		for (
			let i = 0;
			i < ViewSummaryGroupedColumnDataMemo?.length - 1;
			i = i + 2
		) {
			let comp = (
				<ColumnGroup title={ViewSummaryGroupedColumnDataMemo[i]}>
					<Column
						title="Exist"
						dataIndex={ViewSummaryGroupedColumnDataMemo[i + 1][0]}
						key={ViewSummaryGroupedColumnDataMemo[i + 1][0]}
						render={(text, param) => (
							<Tooltip
								placement="bottomLeft"
								title={text}>
								<p>{text}</p>
							</Tooltip>
						)}
					/>
					<Column
						title="New"
						dataIndex={ViewSummaryGroupedColumnDataMemo[i + 1][1]}
						key={ViewSummaryGroupedColumnDataMemo[i + 1][1]}
						render={(text, param) => (
							<Tooltip
								placement="bottomLeft"
								title={text}>
								<p>{text}</p>
							</Tooltip>
						)}
					/>
					<Column
						title="Total"
						dataIndex={ViewSummaryGroupedColumnDataMemo[i]}
						key={ViewSummaryGroupedColumnDataMemo[i]}
						render={(text, param) => (
							<Tooltip
								placement="bottomLeft"
								title={text}>
								<p>{text}</p>
							</Tooltip>
						)}
					/>
				</ColumnGroup>
			);
			ColumnData.push(comp);
		}
		return ColumnData;
	}, [ViewSummaryGroupedColumnDataMemo]);

	const getReportFilterHandler = useCallback(async () => {
		const response = await ReportDAO.teamDemandFunnelFiltersRequestDAO();
		if (response?.statusCode === HTTPStatusCode.OK) {
			setFiltersList(response && response?.responseBody?.Data);
			setStartDate(new Date(response?.responseBody?.Data?.StartDate));
			setEndDate(new Date(response?.responseBody?.Data?.EndDate));
			setTableFilteredState({
				...tableFilteredState,
				startDate: response?.responseBody?.Data?.StartDate,
				endDate: response?.responseBody?.Data?.EndDate,
			});
			setTeamDemandFunnelHRDetailsState({
				...teamDemandFunnelHRDetailsState,

				funnelFilter: {
					startDate: response?.responseBody?.Data?.StartDate,
					endDate: response?.responseBody?.Data?.EndDate,
				},
			});
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

	const viewActionWiseHandler = useCallback(
		async (d) => {
			setLoading(true);
			const actionWiseFormatter = {
				...tableFilteredState,
				salesManagerID: d.salesManager?.id,
				isActionWise: true,
			};
			setTableFilteredState({
				...tableFilteredState,
				salesManagerID: d.salesManager?.id,
				isActionWise: true,
			});
			setTeamDemandFunnelHRDetailsState({
				...teamDemandFunnelHRDetailsState,
				funnelFilter: {
					...teamDemandFunnelHRDetailsState?.funnelFilter,
					salesManagerID: d.salesManager?.id,
					isActionWise: true,
				},
			});
			setSelectedHierarchy(d.salesManager);

			const response = await ReportDAO.teamDemandFunnelListingRequestDAO(
				actionWiseFormatter,
			);
			const hierarchyResponse = await MasterDAO.getUsersHierarchyRequestDAO({
				parentID: d.salesManager?.id,
			});
			console.log(response);
			console.log(hierarchyResponse, '-hierarchyResponse--');
			if (response?.statusCode === HTTPStatusCode.OK) {
				setApiData(response?.responseBody);
				setTeamDemandFunnelModal(false);
				setLoading(false);
			}
		},
		[tableFilteredState, teamDemandFunnelHRDetailsState],
	);

	console.log(tableFilteredState, '---tablEFilter');
	console.log(teamDemandFunnelHRDetailsState, '-teamDemandHRDetailsState');
	const hrWiseHandler = useCallback(
		async (d) => {
			setLoading(true);
			const actionWiseFormatter = {
				...tableFilteredState,
				salesManagerID: d.salesManager?.id,
				isActionWise: false,
			};
			setTableFilteredState({
				...tableFilteredState,
				salesManagerID: d.salesManager?.id,
				isActionWise: false,
			});
			setTeamDemandFunnelHRDetailsState({
				...teamDemandFunnelHRDetailsState,
				funnelFilter: {
					...teamDemandFunnelHRDetailsState?.funnelFilter,
					salesManagerID: d.salesManager?.id,
					isActionWise: false,
				},
			});
			setSelectedHierarchy(d.salesManager);

			const response = await ReportDAO.teamDemandFunnelListingRequestDAO(
				actionWiseFormatter,
			);
			const hierarchyResponse = await MasterDAO.getUsersHierarchyRequestDAO({
				parentID: d.salesManager?.id,
			});
			console.log(response);
			console.log(hierarchyResponse, '-hierarchyResponse--');
			if (response?.statusCode === HTTPStatusCode.OK) {
				setApiData(response?.responseBody);
				setTeamDemandFunnelModal(false);
				setLoading(false);
			}
		},
		[tableFilteredState, teamDemandFunnelHRDetailsState],
	);

	const onChange = useCallback(() => {
		setTeamDemandFunnelModal(true);
	}, []);
	// useEffect(() => {
	// 	// getDemandFunnelListingHandler(tableFilteredState);
	// }, [getDemandFunnelListingHandler, tableFilteredState]);
	useEffect(() => {
		getReportFilterHandler();
	}, [getReportFilterHandler]);
	return (
		<>
			{apiData?.length > 0 && selectedHierarchy && (
				<div className={TeamDemandFunnelStyle.hiringRequestContainer}>
					<div className={TeamDemandFunnelStyle.addnewHR}>
						<div className={TeamDemandFunnelStyle.hiringRequest}>
							Team Demand Funnel Report
						</div>
					</div>
					{/*
					 * --------- Filter Component Starts ---------
					 * @Filter Part
					 */}
					<div className={TeamDemandFunnelStyle.filterContainer}>
						<div className={TeamDemandFunnelStyle.filterSets}>
							<div
								className={TeamDemandFunnelStyle.addFilter}
								onClick={toggleDemandReportFilter}>
								<FunnelSVG style={{ width: '16px', height: '16px' }} />

								<div className={TeamDemandFunnelStyle.filterLabel}>
									Add Filters
								</div>
								<div className={TeamDemandFunnelStyle.filterCount}>
									{filteredTagLength}
								</div>
							</div>
							<div className={TeamDemandFunnelStyle.filterRight}>
								{selectedHierarchy && (
									<div style={{ display: 'flex', alignItems: 'center' }}>
										<div className={TeamDemandFunnelStyle.label}>
											Sales Manager :
										</div>
										&nbsp;
										<Switch
											checked={teamDemandFunnelModal}
											// defaultChecked
											onChange={onChange}
										/>
									</div>
								)}
								{selectedHierarchy && (
									<div style={{ display: 'flex', alignItems: 'center' }}>
										<div className={TeamDemandFunnelStyle.label}>
											Selected Hierarchy :
										</div>
										&nbsp;
										<div className={TeamDemandFunnelStyle.btnPrimary}>
											{selectedHierarchy?.value}
										</div>
									</div>
								)}
								<div className={TeamDemandFunnelStyle.calendarFilterSet}>
									<div className={TeamDemandFunnelStyle.label}>Date</div>

									<div className={TeamDemandFunnelStyle.calendarFilter}>
										<CalenderSVG
											style={{ height: '16px', marginRight: '16px' }}
										/>
										<DatePicker
											className={TeamDemandFunnelStyle.dateFilter}
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
										{/* <Controller
											render={({ ...props }) => (
												<DatePicker
													className={TeamDemandFunnelStyle.dateFilter}
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
											// rules={{ required: true }}
											control={control}
										/> */}
									</div>
								</div>
							</div>
						</div>
					</div>

					{/*
					 * ------------ Table Starts-----------
					 * @Table Part
					 */}
					<div className={TeamDemandFunnelStyle.tableDetails}>
						{isLoading ? (
							<TableSkeleton />
						) : (
							<>
								<Table
									id="supplyFunnelListing"
									bordered={false}
									dataSource={[...apiData?.slice(1)]}
									pagination={{
										size: 'small',
										pageSize: apiData?.length,
									}}>
									{unGroupedColumnDataMemo?.map((item) => (
										<Column
											title={item}
											dataIndex={item}
											key={item}
											render={(text, param) => (
												<Tooltip
													placement="bottomLeft"
													title={text}>
													{item === 'Stage' || item === 'Duration' ? (
														<p style={{ fontWeight: '550' }}>{text}</p>
													) : (
														<p
															style={{
																textDecoration: 'underline',
																cursor: text === 0 ? 'no-drop' : 'pointer',
															}}
															onClick={
																text === 0
																	? null
																	: () => {
																			setTeamDemandHRDetailsModal(true);
																			setSupplyFunnelValue({
																				stage: param?.Stage,
																				count: text,
																			});
																			setTeamDemandFunnelHRDetailsState({
																				...teamDemandFunnelHRDetailsState,
																				currentStage: param.Stage,
																				adhocType: param.adhocType,
																			});
																	  }
															}>
															{text}
														</p>
													)}
												</Tooltip>
											)}
										/>
									))}
									{GroupedColumn()}
								</Table>
								<div className={TeamDemandFunnelStyle.formPanelAction}>
									<button
										type="submit"
										onClick={viewSupplyFunnelSummaryHandler}
										className={TeamDemandFunnelStyle.btnPrimary}>
										View Summary
									</button>
								</div>
							</>
						)}
					</div>
					{isSummary && (
						<div className={TeamDemandFunnelStyle.tableDetails}>
							{isSummaryLoading ? (
								<TableSkeleton />
							) : (
								<>
									<Table
										id="supplyFunnelViewSummary"
										bordered={false}
										dataSource={[...viewSummaryData?.slice(1)]}
										pagination={{
											size: 'small',
											pageSize: viewSummaryData?.length,
										}}>
										{unGroupedViewSummaryColumnDataMemo?.map((item) => (
											<Column
												title={item}
												dataIndex={item}
												key={item}
												render={(text, param) => (
													<Tooltip
														placement="bottomLeft"
														title={text}>
														{item === 'Stage' || item === 'Duration' ? (
															<p style={{ fontWeight: '550' }}>{text}</p>
														) : (
															<p>{text}</p>
														)}
													</Tooltip>
												)}
											/>
										))}
										{ViewSummaryGroupedColumn()}
									</Table>
								</>
							)}
						</div>
					)}

					{isAllowFilters && (
						<Suspense fallback={<div>Loading...</div>}>
							<TeamDemandFunnelFilterLazyComponent
								setAppliedFilters={setAppliedFilters}
								appliedFilter={appliedFilter}
								setCheckedState={setCheckedState}
								checkedState={checkedState}
								handleHRRequest={getTeamDemandFunnelListingHandler}
								setTableFilteredState={setTableFilteredState}
								tableFilteredState={tableFilteredState}
								setFilteredTagLength={setFilteredTagLength}
								onRemoveHRFilters={onRemoveFilters}
								getHTMLFilter={getHTMLFilter}
								hrFilterList={reportConfig.TeamDemandReportFilterListConfig()}
								filtersType={reportConfig.TeamDemandReportFilterTypeConfig(
									filtersList && filtersList,
								)}
								selectedHierarchy={selectedHierarchy}
							/>
						</Suspense>
					)}
					{teamDemandHRDetailsModal && (
						<TeamDemandFunnelModal
							supplyFunnelModal={teamDemandHRDetailsModal}
							setSupplyFunnelModal={setTeamDemandHRDetailsModal}
							demandFunnelHRDetailsState={teamDemandFunnelHRDetailsState}
							setDemandFunnelHRDetailsState={setTeamDemandFunnelHRDetailsState}
							demandFunnelValue={supplyFunnelValue}
						/>
					)}
				</div>
			)}
			{teamDemandFunnelModal && (
				<WithLoader showLoader={isLoading}>
					<Modal
						width="1000px"
						centered
						footer={null}
						open={teamDemandFunnelModal}
						// onOk={() => setTeamDemandFunnelModal(false)}
						onCancel={() => setTeamDemandFunnelModal(false)}>
						<div className={TeamDemandFunnelStyle.container}>
							<div className={TeamDemandFunnelStyle.modalTitle}>
								<h2>Team Demand Funnel</h2>
							</div>
							<div className={TeamDemandFunnelStyle.transparent}>
								<div className={TeamDemandFunnelStyle.colMd12}>
									<HRSelectField
										mode={'id/value'}
										setValue={setValue}
										register={register}
										name="salesManager"
										label="Select Sales Manager"
										defaultValue="Please Select"
										options={filtersList?.SalesManager}
										required
										isError={errors['salesManager'] && errors['salesManager']}
										errorMsg="Please select sales manager."
									/>
								</div>

								<div className={TeamDemandFunnelStyle.formPanelAction}>
									<button
										onClick={handleSubmit(viewActionWiseHandler)}
										className={TeamDemandFunnelStyle.btnPrimary}>
										View Action Wise Data
									</button>
									<button
										onClick={handleSubmit(hrWiseHandler)}
										className={TeamDemandFunnelStyle.btn}>
										View HR Wise Data
									</button>
								</div>
							</div>
						</div>
					</Modal>
				</WithLoader>
			)}
		</>
	);
};

export default TeamDemandFunnelScreen;
