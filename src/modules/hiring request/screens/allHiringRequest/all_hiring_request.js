import React, {
	useState,
	useEffect,
	Suspense,
	useMemo,
	useCallback,
} from 'react';
import { Dropdown, Menu, message, Skeleton, Table, Tooltip } from 'antd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Navigate, useNavigate } from 'react-router-dom';
import {
	AddNewType,
	DayName,
	HiringRequestHRStatus,
	InputType,
} from 'constants/application';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import { ReactComponent as ArrowDownSVG } from 'assets/svg/arrowDown.svg';
import { ReactComponent as FunnelSVG } from 'assets/svg/funnel.svg';
import { ReactComponent as SearchSVG } from 'assets/svg/search.svg';
import { ReactComponent as LockSVG } from 'assets/svg/lock.svg';
import { ReactComponent as UnlockSVG } from 'assets/svg/unlock.svg';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { useAllHRQuery } from 'shared/hooks/useAllHRQuery';
import { hrUtils } from 'modules/hiring request/hrUtils';
import { IoChevronDownOutline } from 'react-icons/io5';
import allHRStyles from './all_hiring_request.module.css';
import UTSRoutes from 'constants/routes';
import { HTTPStatusCode } from 'constants/network';
import HROperator from 'modules/hiring request/components/hroperator/hroperator';
import { DateTimeUtils } from 'shared/utils/basic_utils';
import { TableConfig } from './table.config';
/** Importing Lazy components using Suspense */
const HiringFiltersLazyComponent = React.lazy(() =>
	import('modules/hiring request/components/hiringFilter/hiringFilters'),
);

const AllHiringRequestScreen = () => {
	// const [showing, setShowing] = useState(100);
	const pageSizeOptions = [100, 200, 300, 500, 1000];
	const hrQueryData = useAllHRQuery();
	const [totalRecords, setTotalRecords] = useState(0);
	const [pageIndex, setPageIndex] = useState(1);
	const [pageSize, setPageSize] = useState(100);
	const [isAllowFilters, setIsAllowFilters] = useState(false);
	const [apiData, setAPIdata] = useState([]);
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState(search);
	const navigate = useNavigate();
	const onRemoveHRFilters = () => {
		setIsAllowFilters(false);
	};
	const [messageAPI, contextHolder] = message.useMessage();
	const togglePriority = useCallback(
		async (payload) => {
			let response = await hiringRequestDAO.sendHRPriorityForNextWeekRequestDAO(
				payload,
			);
			const { tempdata, index } = hrUtils.hrTogglePriority(response, apiData);
			setAPIdata([
				...apiData.slice(0, index),
				tempdata,
				...apiData.slice(index + 1),
			]);

			messageAPI.open({
				type: 'success',
				content: `${tempdata.HR_ID} priority has been changed.`,
			});
		},
		[apiData, messageAPI],
	);

	const tableColumnsMemo = useMemo(
		() => TableConfig(togglePriority),
		[togglePriority],
	);
	const handleHRRequest = async (pageData) => {
		let response = await hiringRequestDAO.getPaginatedHiringRequestDAO(
			pageData
				? pageData
				: {
						pageSize: 100,
						pageNum: 1,
				  },
		);
		setAPIdata(hrUtils.modifyHRRequestData(response && response));
		setTotalRecords(response.responseBody.TotalRecords);
	};

	useEffect(() => {
		const timer = setTimeout(() => setSearch(debouncedSearch), 1000);
		return () => clearTimeout(timer);
	}, [debouncedSearch]);

	useEffect(() => {
		if (hrQueryData?.data) {
			if (hrQueryData?.data.statusCode === HTTPStatusCode.OK) {
				setAPIdata(hrUtils.modifyHRRequestData(hrQueryData?.data));
				setTotalRecords(hrQueryData?.data.responseBody.TotalRecords);
			} else Navigate(UTSRoutes.LOGINROUTE);
		}
	}, [hrQueryData?.data]);

	/*--------- React DatePicker ---------------- */
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);

	const onChange = (dates) => {
		const [start, end] = dates;
		setStartDate(start);
		setEndDate(end);
	};

	return (
		<div className={allHRStyles.hiringRequestContainer}>
			{contextHolder}
			<div className={allHRStyles.addnewHR}>
				<div className={allHRStyles.hiringRequest}>All Hiring Requests</div>

				<HROperator
					title="Add New HR"
					icon={<ArrowDownSVG style={{ width: '16px' }} />}
					backgroundColor={`var(--color-sunlight)`}
					iconBorder={`1px solid var(--color-sunlight)`}
					isDropdown={true}
					listItem={[
						{
							label: 'Add New HR',
							key: AddNewType.HR,
						},
						{
							label: 'Add New Client',
							key: AddNewType.CLIENT,
						},
					]}
					menuAction={(item) => {
						switch (item.key) {
							case AddNewType.HR: {
								navigate(UTSRoutes.ADDNEWHR);
								break;
							}
							case AddNewType.CLIENT: {
								navigate(UTSRoutes.ADDNEWCLIENT);
								break;
							}
							default:
								break;
						}
					}}
				/>
			</div>
			{/*
			 * --------- Filter Component Starts ---------
			 * @Filter Part
			 */}
			<div className={allHRStyles.filterContainer}>
				<div className={allHRStyles.filterSets}>
					<div
						className={allHRStyles.addFilter}
						onClick={() => setIsAllowFilters(!isAllowFilters)}>
						<FunnelSVG style={{ width: '16px', height: '16px' }} />

						<div className={allHRStyles.filterLabel}>Add Filters</div>
						<div className={allHRStyles.filterCount}>7</div>
					</div>
					<div className={allHRStyles.filterRight}>
						<div className={allHRStyles.searchFilterSet}>
							<SearchSVG style={{ width: '16px', height: '16px' }} />
							<input
								type={InputType.TEXT}
								className={allHRStyles.searchInput}
								placeholder="Search Table"
								onChange={(e) => {
									return setDebouncedSearch(
										hrUtils.allHiringRequestSearch(e, apiData),
									);
								}}
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
									onChange={onChange}
									startDate={startDate}
									endDate={endDate}
									selectsRange
								/>
							</div>
						</div>
						<div className={allHRStyles.priorityFilterSet}>
							<div className={allHRStyles.label}>Set Priority</div>
							<div className={allHRStyles.priorityFilter}>
								{DateTimeUtils.getTodaysDay() === DayName.FRIDAY ? (
									<Tooltip
										placement="bottom"
										title="Locked">
										<LockSVG style={{ width: '18px', height: '18px' }} />
									</Tooltip>
								) : (
									<Tooltip
										placement="bottom"
										title="Unlocked">
										<UnlockSVG style={{ width: '18px', height: '18px' }} />
									</Tooltip>
								)}
							</div>
						</div>
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
												handleHRRequest({
													pageSize: pageSize,
													pageNum: pageIndex,
												});
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

			{/*
			 * ------------ Table Starts-----------
			 * @Table Part
			 */}
			<div className={allHRStyles.tableDetails}>
				{
					<Table
						locale={{
							emptyText: (
								<>
									<Skeleton />
									<Skeleton />
									<Skeleton />
								</>
							),
						}}
						id="hrListingTable"
						columns={tableColumnsMemo}
						bordered={false}
						dataSource={
							search && search.length > 0 ? [...search] : [...apiData]
						}
						pagination={{
							onChange: (pageNum, pageSize) => {
								setPageIndex(pageNum);
								setPageSize(pageSize);
								handleHRRequest({ pageSize: pageSize, pageNum: pageNum });
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
				}
			</div>

			{isAllowFilters && (
				<Suspense fallback={<div>Loading...</div>}>
					<HiringFiltersLazyComponent
						onRemoveHRFilters={onRemoveHRFilters}
						hrFilterList={hrFilterList}
						filtersType={filtersType}
					/>
				</Suspense>
			)}
		</div>
	);
};

export default AllHiringRequestScreen;

const hrFilterList = [
	{ name: 'Tenure' },
	{ name: 'ODR' },
	{ name: 'Profile Shared' },
	{ name: 'Data Analyst' },
	{ name: 'ODR' },
	{ name: 'Data Analyst' },
];

const filtersType = [
	{ name: 'ODR/Pool', child: ['ODR', 'Pool'], isSearch: false },
	{
		name: 'Tenure',
		child: ['3 Months', '6 Months', '12 Months'],
		isSearch: false,
	},
	{
		name: 'Talent Request',
		child: ['3', '4', '7', '9', '10'],
		isSearch: false,
	},
	{ name: 'Position', child: [], isSearch: true },
	{ name: 'Company', child: [], isSearch: true },
	{ name: 'FTE/PTE', child: ['FTE', 'PTE'], isSearch: false },
	{ name: 'Manager', child: [], isSearch: true },
	{ name: 'Sales Representative', child: [], isSearch: true },
	{
		name: 'HR Status',
		child: [
			{
				statusCode: HiringRequestHRStatus.DRAFT,
				label: 'Draft',
			},
			{
				statusCode: HiringRequestHRStatus.HR_ACCEPTED,
				label: 'HR Aceepted',
			},
			{
				statusCode: HiringRequestHRStatus.ACCEPTANCE_PENDING,
				label: 'Acceptance Pending',
			},
			{
				statusCode: HiringRequestHRStatus.INFO_PENDING,
				label: 'Info Pending',
			},
			{
				statusCode: HiringRequestHRStatus.COMPLETED,
				label: 'Completed',
			},
			{
				statusCode: HiringRequestHRStatus.IN_PROCESS,
				label: 'In Process',
			},
			{
				statusCode: HiringRequestHRStatus.CANCELLED,
				label: 'Cancelled',
			},
		],
		isSearch: false,
	},
];
