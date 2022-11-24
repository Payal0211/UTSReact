import React, { useState, useEffect, Suspense } from 'react';
import { Dropdown, Menu, Skeleton, Table } from 'antd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link } from 'react-router-dom';
import { HiringRequestHRStatus, InputType } from 'constants/application';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import { ReactComponent as ArrowDownSVG } from 'assets/svg/arrowDown.svg';
import { ReactComponent as FunnelSVG } from 'assets/svg/funnel.svg';
import { ReactComponent as SearchSVG } from 'assets/svg/search.svg';
import { ReactComponent as LockSVG } from 'assets/svg/lock.svg';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { useAllHRQuery } from 'shared/hooks/useAllHRQuery';
import { hrUtils } from 'modules/hiring request/hrUtils';
import { All_Hiring_Request_Utils } from 'shared/utils/all_hiring_request_util';
import { IoChevronDownOutline } from 'react-icons/io5';
import allHRStyles from './all_hiring_request.module.css';

/** Importing Lazy components using Suspense */
const HiringFiltersLazyComponent = React.lazy(() =>
	import('modules/hiring request/components/hiringFilter/hiringFilters'),
);

const AllHiringRequestScreen = () => {
	const pageSizeOptions = [100, 200, 300, 500, 1000];
	const hrQueryData = useAllHRQuery();
	const [totalRecords, setTotalRecords] = useState(0);
	const [pageIndex, setPageIndex] = useState(1);
	const [pageSize, setPageSize] = useState(100);
	const [isAllowFilters, setIsAllowFilters] = useState(false);
	const [apiData, setAPIdata] = useState([]);
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState(search);

	const onRemoveHRFilters = () => {
		setIsAllowFilters(false);
	};

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
			setAPIdata(hrUtils.modifyHRRequestData(hrQueryData?.data));
			setTotalRecords(hrQueryData?.data.responseBody.TotalRecords);
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
			<div className={allHRStyles.addnewHR}>
				<div className={allHRStyles.hiringRequest}>All Hiring Requests</div>
				<div className={allHRStyles.newHR}>
					<label>Add new HR</label>
					<div className={allHRStyles.iconDown}>
						<ArrowDownSVG />
					</div>
				</div>
			</div>
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
								<LockSVG style={{ width: '18px', height: '18px' }} />
							</div>
						</div>
						<div className={allHRStyles.priorityFilterSet}>
							<div className={allHRStyles.label}>Showing</div>

							<div className={allHRStyles.paginationFilter}>
								<Dropdown
									trigger={['click']}
									placement="bottom"
									overlay={
										<Menu>
											<Menu.Item key={0}>100</Menu.Item>

											<Menu.Item key={1}>200</Menu.Item>
										</Menu>
									}>
									<span>
										100{' '}
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
						columns={tableColumns}
						bordered={false}
						dataSource={search && search.length > 0 ? search : apiData}
						pagination={{
							onChange: (pageNum, pageSize) => {
								setPageIndex(pageNum);
								setPageSize(pageSize);
								console.log(pageNum, pageSize, '------');
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

const tableColumns = [
	{
		title: '     ',
		dataIndex: 'starStatus',
		key: 'starStatus',
		align: 'left',
	},
	{
		title: 'O/P',
		dataIndex: 'adHocHR',
		key: 'adHocHR',
		align: 'left',
	},
	{
		title: 'Date',
		dataIndex: 'Date',
		key: 'Date',
		align: 'left',
	},
	{
		title: 'HR ID',
		dataIndex: 'HR_ID',
		key: 'HR_ID',
		align: 'left',
		render: (text, result) => (
			<Link to={`/allhiringrequest/${result?.key}${text}`}>{text}</Link>
		),
	},
	{
		title: 'TR',
		dataIndex: 'TR',
		key: 'TR',
		align: 'left',
	},
	{
		title: 'Position',
		dataIndex: 'Position',
		key: 'position',
		align: 'left',
	},
	{
		title: 'Company',
		dataIndex: 'Company',
		key: 'company',
		align: 'left',
		render: (text) => {
			return (
				<a
					target="_blank"
					href=""
					style={{ color: `var(--uplers-black)`, textDecoration: 'underline' }}>
					{text}
				</a>
			);
		},
	},
	{
		title: 'Time',
		dataIndex: 'Time',
		key: 'time',
		align: 'left',
	},
	{
		title: 'FTE/PTE',
		dataIndex: 'typeOfEmployee',
		key: 'fte_pte',
		align: 'left',
	},
	{
		title: 'Sales Rep',
		dataIndex: 'salesRep',
		key: 'sales_rep',
		align: 'left',
		render: (text) => {
			return (
				<a
					target="_blank"
					href="#"
					style={{ color: `var(--uplers-black)`, textDecoration: 'underline' }}>
					{text}
				</a>
			);
		},
	},
	{
		title: 'HR Status',
		dataIndex: 'hrStatus',
		key: 'hr_status',
		align: 'left',
		render: (_, param) => {
			return All_Hiring_Request_Utils.GETHRSTATUS(
				param.hrStatusCode,
				param.hrStatus,
			);
		},
	},
];

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
