import DemandFunnelStyle from './demandFunnel.module.css';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import { ReactComponent as ArrowDownSVG } from 'assets/svg/arrowDown.svg';
import { ReactComponent as FunnelSVG } from 'assets/svg/funnel.svg';
import { ReactComponent as SearchSVG } from 'assets/svg/search.svg';
import { ReactComponent as LockSVG } from 'assets/svg/lock.svg';
import { ReactComponent as UnlockSVG } from 'assets/svg/unlock.svg';
import { Dropdown, Menu, message, Table, Tooltip } from 'antd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { IoChevronDownOutline } from 'react-icons/io5';
import { InputType } from 'constants/application';
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
const HiringFiltersLazyComponent = React.lazy(() =>
	import('modules/hiring request/components/hiringFilter/hiringFilters'),
);

const DemandFunnelScreen = () => {
	const [tableFilteredState, setTableFilteredState] = useState({
		startDate: '',
		endDate: '',
		isHiringNeedTemp: '',
		modeOfWork: '',
		typeOfHR: '',
		companyCategory: '',
		replacement: '',
		head: '',
		isActionWise: true,
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
	const onRemoveFilters = () => {
		setTimeout(() => {
			setIsAllowFilters(false);
		}, 300);
		setHTMLFilter(false);
	};
	const getDemandFunnelListingHandler = useCallback(async () => {
		setLoading(true);
		let response = await ReportDAO.demandFunnelListingRequestDAO(
			tableFilteredState,
		);
		if (response?.statusCode === HTTPStatusCode.OK) {
			setLoading(false);
			setApiData(response?.responseBody);
		} else {
			setLoading(false);
			setApiData([]);
		}
	}, [tableFilteredState]);

	const viewDemandFunnelSummaryHandler = useCallback(async () => {
		setIsSummary(true);
		setSummaryLoading(true);
		let response = await ReportDAO.demandFunnelSummaryRequestDAO(
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

	const tableColumnsMemo = useMemo(
		() => reportConfig.demandFunnelTable(apiData && apiData),
		[apiData],
	);
	const viewSummaryMemo = useMemo(
		() =>
			reportConfig.viewSummaryDemandFunnel(viewSummaryData && viewSummaryData),
		[viewSummaryData],
	);
	const getReportFilterHandler = useCallback(async () => {
		const response = await ReportDAO.demandFunnelFiltersRequestDAO();
		if (response?.statusCode === HTTPStatusCode.OK) {
			setFiltersList(response && response?.responseBody?.Data);
		} else {
			setFiltersList([]);
		}
	}, []);

	const toggleDemandReportFilter = useCallback(() => {
		getReportFilterHandler();
		!getHTMLFilter
			? setIsAllowFilters(!isAllowFilters)
			: setTimeout(() => {
					setIsAllowFilters(!isAllowFilters);
			  }, 300);
		setHTMLFilter(!getHTMLFilter);
	}, [getHTMLFilter, getReportFilterHandler, isAllowFilters]);
	useEffect(() => {
		getDemandFunnelListingHandler();
	}, [getDemandFunnelListingHandler]);
	return (
		<div className={DemandFunnelStyle.hiringRequestContainer}>
			<div className={DemandFunnelStyle.addnewHR}>
				<div className={DemandFunnelStyle.hiringRequest}>
					Demand Funnel Report
				</div>
			</div>
			{/*
			 * --------- Filter Component Starts ---------
			 * @Filter Part
			 */}
			<div className={DemandFunnelStyle.filterContainer}>
				<div className={DemandFunnelStyle.filterSets}>
					<div
						className={DemandFunnelStyle.addFilter}
						onClick={toggleDemandReportFilter}>
						<FunnelSVG style={{ width: '16px', height: '16px' }} />

						<div className={DemandFunnelStyle.filterLabel}>Add Filters</div>
						<div className={DemandFunnelStyle.filterCount}>
							{filteredTagLength}
						</div>
					</div>
				</div>
			</div>

			{/*
			 * ------------ Table Starts-----------
			 * @Table Part
			 */}
			<div className={DemandFunnelStyle.tableDetails}>
				{isLoading ? (
					<TableSkeleton />
				) : (
					<>
						<Table
							id="hrListingTable"
							columns={tableColumnsMemo}
							bordered={false}
							dataSource={[...apiData]}
							pagination={{
								/* onChange: (pageNum, pageSize) => {
									setPageIndex(pageNum);
									setPageSize(pageSize);
									setTableFilteredState({
										...tableFilteredState,
										pagesize: pageSize,
										pagenum: pageNum,
									});
									handleHRRequest({ pagesize: pageSize, pagenum: pageNum });
								}, */
								size: 'small',
								/* pageSize: pageSize,
							pageSizeOptions: pageSizeOptions,
							total: totalRecords,
							showTotal: (total, range) =>
								`${range[0]}-${range[1]} of ${totalRecords} items`,
							defaultCurrent: pageIndex, */
							}}
						/>
						<div className={DemandFunnelStyle.formPanelAction}>
							<button
								// disabled={isLoading}
								type="submit"
								onClick={viewDemandFunnelSummaryHandler}
								className={DemandFunnelStyle.btnPrimary}>
								View Summary
							</button>
						</div>
					</>
				)}
			</div>
			{isSummary && (
				<div className={DemandFunnelStyle.tableDetails}>
					{isSummaryLoading ? (
						<TableSkeleton />
					) : (
						<>
							<Table
								id="hrListingTable"
								columns={viewSummaryMemo}
								bordered={false}
								dataSource={[...viewSummaryData]}
								pagination={{
									size: 'small',
								}}
							/>
						</>
					)}
				</div>
			)}

			{isAllowFilters && (
				<Suspense fallback={<div>Loading...</div>}>
					<HiringFiltersLazyComponent
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
					/>
				</Suspense>
			)}
		</div>
	);
};

export default DemandFunnelScreen;
