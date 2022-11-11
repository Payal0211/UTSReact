import { Skeleton, Table } from 'antd';
import React, { useState, useEffect, Suspense } from 'react';
import allHRStyles from './all_hiring_request.module.css';
import { AiOutlineDown } from 'react-icons/ai';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { IoFunnelOutline } from 'react-icons/io5';
import { AiOutlineSearch } from 'react-icons/ai';
import { BiLockAlt } from 'react-icons/bi';
import { All_Hiring_Request_Utils } from 'shared/utils/all_hiring_request_util';
import { Link } from 'react-router-dom';
import { HiringRequestHRStatus, InputType } from 'constants/application';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';

/** Importing Lazy components using Suspense */
const HiringFiltersLazyComponent = React.lazy(() =>
	import('modules/hiring request/components/hiringFilter/hiringFilters'),
);

const AllHiringRequestScreen = () => {
	const pageSizeOptions = [100, 200, 300, 500, 1000];
	const [totalRecords, setTotalRecords] = useState(0);
	const [pageIndex, setPageIndex] = useState(1);
	const [pageSize, setPageSize] = useState(100);
	const [isAllowFilters, setIsAllowFilters] = useState(false);
	const [apiData, setAPIdata] = useState([]);
	const [search, setSearch] = useState('');
	const [isLoading, setLoading] = useState(false);

	const onRemoveHRFilters = () => {
		setIsAllowFilters(false);
	};

	const handleHRRequest = async (pageData) => {
		setLoading(true);
		let response = await hiringRequestDAO.getPaginatedHiringRequestDAO(
			pageData
				? pageData
				: {
						pageSize: 100,
						pageNum: 1,
				  },
		);

		setAPIdata(
			response.responseBody.Data.map((item) => ({
				key: item.hrid,
				starStatus: All_Hiring_Request_Utils.GETHRPRIORITY(
					item.starMarkedStatusCode,
				),
				adHocHR: item.adHocHR,
				Date: item.createdDateTime.split(' ')[0],
				HR_ID: item.hr,
				TR: item.tr,
				Position: item.position,
				Company: item.company,
				Time: item.timeZone.split(' ')[0],
				typeOfEmployee: item.typeOfEmployee,
				salesRep: item.salesRep,
				hrStatus: All_Hiring_Request_Utils.GETHRSTATUS(
					item.hrStatusCode,
					item.hrStatus,
				),
			})),
		);
		setTotalRecords(response.responseBody.TotalRecords);
		setLoading(false);
	};

	useEffect(() => {
		handleHRRequest();
	}, []);

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
						<AiOutlineDown />
					</div>
				</div>
			</div>
			<div className={allHRStyles.filterContainer}>
				<div className={allHRStyles.filterSets}>
					<div
						className={allHRStyles.addFilter}
						onClick={() => setIsAllowFilters(!isAllowFilters)}>
						<IoFunnelOutline style={{ fontSize: '20px', fontWeight: '800' }} />
						<div className={allHRStyles.filterLabel}>Add Filters</div>
						<div className={allHRStyles.filterCount}>7</div>
					</div>
					<div className={allHRStyles.filterRight}>
						<div className={allHRStyles.searchFilterSet}>
							<AiOutlineSearch
								style={{ fontSize: '20px', fontWeight: '800' }}
							/>
							<input
								type={InputType.TEXT}
								className={allHRStyles.searchInput}
								placeholder="Search Table"
								onChange={(e) => {
									let filteredData = apiData.filter((val) => {
										return (
											val.adHocHR
												.toLowerCase()
												.includes(e.target.value.toLowerCase()) ||
											val.HR_ID.toLowerCase().includes(
												e.target.value.toLowerCase(),
											) ||
											val.Position.toLowerCase().includes(
												e.target.value.toLowerCase(),
											) ||
											val.Company.toLowerCase().includes(
												e.target.value.toLowerCase(),
											) ||
											val.Time.toLowerCase().includes(
												e.target.value.toLowerCase(),
											) ||
											val.typeOfEmployee
												.toLowerCase()
												.includes(e.target.value.toLowerCase()) ||
											val.salesRep
												.toLowerCase()
												.includes(e.target.value.toLowerCase()) ||
											/* val.hrStatus
												.toLowerCase()
												.includes(e.target.value.toLowerCase()) || */
											val.TR == e.target.value
										);
									});
									setSearch(filteredData);
								}}
							/>
						</div>
						<div className={allHRStyles.calendarFilterSet}>
							<div className={allHRStyles.label}>Date</div>
							<div className={allHRStyles.calendarFilter}>
								<CalenderSVG />
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
								<BiLockAlt
									style={{
										fontSize: '20px',
										fontWeight: '800',
										opacity: '0.8',
									}}
								/>
							</div>
						</div>
						{/* <div className={allHRStyles.priorityFilterSet}>
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
											style={{ paddingTop: '5px', fontSize: '1rem' }}
										/>
									</span>
								</Dropdown>
							</div>
						</div> */}
					</div>
				</div>
			</div>
			<div style={{ marginTop: '5%' }}>
				{isLoading ? (
					<>
						<Skeleton active />
						<br />
						<Skeleton active />
						<br />
						<Skeleton active />
					</>
				) : (
					<Table
						loading={isLoading && <Skeleton active />}
						id="hrListingTable"
						columns={tableColumns}
						bordered={false}
						dataSource={search && search.length > 0 ? search : apiData}
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
				)}
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
		key: '0',
		align: 'center',
	},
	{
		title: 'O/P',
		dataIndex: 'adHocHR',
		key: '1',
		align: 'center',
		render: (text) => {
			return (
				<a
					target="_blank"
					href="#"
					style={{ color: 'black', textDecoration: 'underline' }}>
					{text}
				</a>
			);
		},
	},
	{
		title: 'Date',
		dataIndex: 'Date',
		key: '2',
		align: 'center',
	},
	{
		title: 'HR ID',
		dataIndex: 'HR_ID',
		key: '3',
		align: 'center',
		render: (text, d) => (
			<Link to={`/allhiringrequest/${d?.key}${text}`}>{text}</Link>
		),
	},
	{
		title: 'TR',
		dataIndex: 'TR',
		key: '4',
		align: 'center',
	},
	{
		title: 'Position',
		dataIndex: 'Position',
		key: '5',
		align: 'left',
	},
	{
		title: 'Company',
		dataIndex: 'Company',
		key: '6',
		align: 'left',
		render: (text) => {
			return (
				<a
					target="_blank"
					href=""
					style={{ color: 'black', textDecoration: 'underline' }}>
					{text}
				</a>
			);
		},
	},
	{
		title: 'Time',
		dataIndex: 'Time',
		key: '7',
		align: 'left',
	},
	{
		title: 'FTE/PTE',
		dataIndex: 'typeOfEmployee',
		key: '8',
		align: 'left',
	},
	{
		title: 'Sales Rep',
		dataIndex: 'salesRep',
		key: '9',
		align: 'left',
		render: (text) => {
			return (
				<a
					target="_blank"
					href="#"
					style={{ color: 'black', textDecoration: 'underline' }}>
					{text}
				</a>
			);
		},
	},
	{
		title: 'HR Status',
		dataIndex: 'hrStatus',
		key: '10',
		align: 'center',
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
