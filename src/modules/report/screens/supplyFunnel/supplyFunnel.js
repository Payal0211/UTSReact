import SupplyFunnelStyle from './supplyFunnel.module.css';
import { ReactComponent as FunnelSVG } from 'assets/svg/funnel.svg';
import { Table, Tooltip } from 'antd';
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
import SupplyFunnelModal from 'modules/report/components/supplyFunnelModal/supplyFunnelModal';
const SupplyFunnelFilterLazyComponent = React.lazy(() =>
	import('modules/report/components/supplyFunnelFilter/supplyFunnelFilter'),
);

const SupplyFunnelScreen = () => {
	const { control } = useForm();
	const [tableFilteredState, setTableFilteredState] = useState({
		startDate: '',
		endDate: '',
		managed: '',
		isHiringNeedTemp: '',
		modeOfWork: '',
		typeOfHR: '',
		companyCategory: '',
		replacement: '',
		isActionWise: true,
	});
	const [supplyFunnelValue, setSupplyFunnelValue] = useState({});
	const [supplyFunnelHRDetailsState, setSupplyFunnelHRDetailsState] = useState({
		newExistingType: '',
		TeamManagerName: '',
		currentStage: '',
		isExport: false,
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
	const [supplyFunnelModal, setSupplyFunnelModal] = useState(false);

	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);

	const getSupplyReportListHandler = useCallback(async (tableData) => {
		if (tableData.startDate && tableData.endDate){
		setLoading(true);
		let response = await ReportDAO.supplyFunnelListingRequestDAO(tableData);
		if (response?.statusCode === HTTPStatusCode.OK) {
			setLoading(false);
			setApiData(response?.responseBody);
		} else {
			setLoading(false);
			setApiData([]);
		}
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
				item === 'New Total' ||
				item === 'Exist Total'
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
				item !== 'New Total' &&
				item !== 'Exist Total'
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
						title="Exist"
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
													setSupplyFunnelModal(true);
													setSupplyFunnelValue({
														stage: param?.Stage,
														count: text,
													});
													setSupplyFunnelHRDetailsState({
														...supplyFunnelHRDetailsState,
														funnelFilter: {
															...supplyFunnelHRDetailsState?.funnelFilter,
														},
														newExistingType: 'Exist',
														currentStage: param.Stage,
														TeamManagerName: groupedColumnDataMemo[i],
													});
											  }
									}>
									{text}
								</p>
							</Tooltip>
						)}
					/>
					<Column
						title="New"
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
													setSupplyFunnelModal(true);
													setSupplyFunnelValue({
														stage: param?.Stage,
														count: text,
													});
													setSupplyFunnelHRDetailsState({
														...supplyFunnelHRDetailsState,
														funnelFilter: {
															...supplyFunnelHRDetailsState?.funnelFilter,
														},
														newExistingType: 'Exist',
														currentStage: param.Stage,
														TeamManagerName: groupedColumnDataMemo[i],
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
													setSupplyFunnelModal(true);
													setSupplyFunnelValue({
														stage: param?.Stage,
														count: text,
													});
													setSupplyFunnelHRDetailsState({
														...supplyFunnelHRDetailsState,
														funnelFilter: {
															...supplyFunnelHRDetailsState?.funnelFilter,
														},
														newExistingType: 'Exist',
														currentStage: param.Stage,
														TeamManagerName: groupedColumnDataMemo[i],
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
	}, [groupedColumnDataMemo, supplyFunnelHRDetailsState]);

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
			setSupplyFunnelHRDetailsState({
				...supplyFunnelHRDetailsState,
				funnelFilter: {
					...supplyFunnelHRDetailsState?.funnelFilter,
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
			getSupplyReportListHandler({
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
		let response = await ReportDAO.supplyFunnelSummaryRequestDAO(
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
				item === 'New Total' ||
				item === 'Exist Total'
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
				item !== 'New Total' &&
				item !== 'Exist Total'
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
		const response = await ReportDAO.supplyFunnelFiltersRequestDAO();
		if (response?.statusCode === HTTPStatusCode.OK) {
			setFiltersList(response && response?.responseBody?.Data);
			setStartDate(new Date(response?.responseBody?.Data?.StartDate));
			setEndDate(new Date(response?.responseBody?.Data?.EndDate));
			setTableFilteredState({
				...tableFilteredState,
				startDate: response?.responseBody?.Data?.StartDate,
				endDate: response?.responseBody?.Data?.EndDate,
			});
			setSupplyFunnelHRDetailsState({
				...supplyFunnelHRDetailsState,
				funnelFilter: {
					...supplyFunnelHRDetailsState?.funnelFilter,
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

	useEffect(() => {
		getSupplyReportListHandler(tableFilteredState);
	}, [getSupplyReportListHandler, tableFilteredState]);
	useEffect(() => {
		getReportFilterHandler();
	}, [getReportFilterHandler]);
	return (
		<div className={SupplyFunnelStyle.hiringRequestContainer}>
			<div className={SupplyFunnelStyle.addnewHR}>
				<div className={SupplyFunnelStyle.hiringRequest}>
					Supply Funnel Report
				</div>
			</div>
			{/*
			 * --------- Filter Component Starts ---------
			 * @Filter Part
			 */}
			<div className={SupplyFunnelStyle.filterContainer}>
				<div className={SupplyFunnelStyle.filterSets}>
					<div
						className={SupplyFunnelStyle.addFilter}
						onClick={toggleDemandReportFilter}>
						<FunnelSVG style={{ width: '16px', height: '16px' }} />

						<div className={SupplyFunnelStyle.filterLabel}>Add Filters</div>
						<div className={SupplyFunnelStyle.filterCount}>
							{filteredTagLength}
						</div>
					</div>
					<div className={SupplyFunnelStyle.calendarFilterSet}>
						<div className={SupplyFunnelStyle.label}>Date</div>

						<div className={SupplyFunnelStyle.calendarFilter}>
							<CalenderSVG style={{ height: '16px', marginRight: '16px' }} />
							<Controller
								render={({ ...props }) => (
									<DatePicker
										className={SupplyFunnelStyle.dateFilter}
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
			<div className={SupplyFunnelStyle.tableDetails}>
				{isLoading ? (
					<TableSkeleton />
				) : (
					<>
						<Table
							scroll={{ x: '250vw', y: '100vh' }}
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
																	setSupplyFunnelModal(true);
																	setSupplyFunnelValue({
																		stage: param?.Stage,
																		count: text,
																	});
																	setSupplyFunnelHRDetailsState({
																		...supplyFunnelHRDetailsState,
																		funnelFilter: {
																			...supplyFunnelHRDetailsState?.funnelFilter,
																		},
																		newExistingType:
																			item === 'Final Total'
																				? ''
																				: item?.split(' ')[0],
																		currentStage: param.Stage,
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
						<div className={SupplyFunnelStyle.formPanelAction}>
							<button
								type="submit"
								onClick={viewSupplyFunnelSummaryHandler}
								className={SupplyFunnelStyle.btnPrimary}>
								View Summary
							</button>
						</div>
					</>
				)}
			</div>
			{isSummary && (
				<div className={SupplyFunnelStyle.tableDetails}>
					{isSummaryLoading ? (
						<TableSkeleton />
					) : (
						<>
							<Table
								scroll={{ x: '100vw', y: '100vh' }}
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
					<SupplyFunnelFilterLazyComponent
						setAppliedFilters={setAppliedFilters}
						appliedFilter={appliedFilter}
						setCheckedState={setCheckedState}
						checkedState={checkedState}
						handleHRRequest={getSupplyReportListHandler}
						setTableFilteredState={setTableFilteredState}
						tableFilteredState={tableFilteredState}
						setFilteredTagLength={setFilteredTagLength}
						onRemoveHRFilters={onRemoveFilters}
						getHTMLFilter={getHTMLFilter}
						hrFilterList={reportConfig.SupplyReportFilterListConfig()}
						filtersType={reportConfig.SupplyReportFilterTypeConfig(
							filtersList && filtersList,
						)}
						setSupplyFunnelHRDetailsState={setSupplyFunnelHRDetailsState}
						supplyFunnelHRDetailsState={supplyFunnelHRDetailsState}
					/>
				</Suspense>
			)}
			{supplyFunnelModal && (
				<SupplyFunnelModal
					supplyFunnelModal={supplyFunnelModal}
					setSupplyFunnelModal={setSupplyFunnelModal}
					demandFunnelHRDetailsState={supplyFunnelHRDetailsState}
					setDemandFunnelHRDetailsState={setSupplyFunnelHRDetailsState}
					demandFunnelValue={supplyFunnelValue}
				/>
			)}
		</div>
	);
};

export default SupplyFunnelScreen;
