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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ReportDAO } from 'core/report/reportDAO';
import { HTTPStatusCode } from 'constants/network';
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton';
import { reportConfig } from 'modules/report/report.config';
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
	const [isLoading, setLoading] = useState(false);
	const [search, setSearch] = useState('');

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

	const tableColumnsMemo = useMemo(
		() => reportConfig.demandFunnelTable(apiData && apiData),
		[apiData],
	);

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
						// onClick={toggleHRFilter}
					>
						<FunnelSVG style={{ width: '16px', height: '16px' }} />

						<div className={DemandFunnelStyle.filterLabel}>Add Filters</div>
						<div className={DemandFunnelStyle.filterCount}>
							{/* {filteredTagLength } */}
						</div>
					</div>
					<div className={DemandFunnelStyle.filterRight}>
						<div className={DemandFunnelStyle.searchFilterSet}>
							<SearchSVG style={{ width: '16px', height: '16px' }} />
							<input
								type={InputType.TEXT}
								className={DemandFunnelStyle.searchInput}
								placeholder="Search Table"
								onChange={(e) => {
									/* return setDebouncedSearch(
										hrUtils.allHiringRequestSearch(e, apiData),
									); */
								}}
							/>
						</div>
						<div className={DemandFunnelStyle.calendarFilterSet}>
							<div className={DemandFunnelStyle.label}>Date</div>
							<div className={DemandFunnelStyle.calendarFilter}>
								<CalenderSVG style={{ height: '16px', marginRight: '16px' }} />
								<DatePicker
									style={{ backgroundColor: 'red' }}
									onKeyDown={(e) => {
										e.preventDefault();
										e.stopPropagation();
									}}
									className={DemandFunnelStyle.dateFilter}
									placeholderText="Start date - End date"
									/* selected={startDate}
									onChange={onCalenderFilter}
									startDate={startDate}
									endDate={endDate} */
									selectsRange
								/>
							</div>
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
					<Table
						id="hrListingTable"
						columns={tableColumnsMemo}
						bordered={false}
						dataSource={
							search && search.length > 0 ? [...search] : [...apiData]
						}
						/* pagination={{
								onChange: (pageNum, pageSize) => {
									setPageIndex(pageNum);
									setPageSize(pageSize);
									setTableFilteredState({
										...tableFilteredState,
										pagesize: pageSize,
										pagenum: pageNum,
									});
									handleHRRequest({ pagesize: pageSize, pagenum: pageNum });
								},
								size: 'small',
								pageSize: pageSize,
								pageSizeOptions: pageSizeOptions,
								total: totalRecords,
								showTotal: (total, range) =>
									`${range[0]}-${range[1]} of ${totalRecords} items`,
								defaultCurrent: pageIndex,
							}} */
					/>
				)}
			</div>

			{/* {isAllowFilters && (
				<Suspense fallback={<div>Loading...</div>}>
					<HiringFiltersLazyComponent
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
						filtersType={allHRConfig.hrFilterTypeConfig(
							filtersList && filtersList,
						)}
					/>
				</Suspense>
			)} */}
		</div>
	);
};

export default DemandFunnelScreen;
