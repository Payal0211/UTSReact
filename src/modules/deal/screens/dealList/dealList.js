import { Dropdown, Menu, Pagination, Skeleton, Table } from 'antd';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import { ReactComponent as ArrowDownSVG } from 'assets/svg/arrowDown.svg';
import { ReactComponent as FunnelSVG } from 'assets/svg/funnel.svg';
import { ReactComponent as SearchSVG } from 'assets/svg/search.svg';
import { IoChevronDownOutline } from 'react-icons/io5';
import DealListStyle from '../../dealStyle.module.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import React, {
	Fragment,
	Suspense,
	useCallback,
	useEffect,
	useState,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { InterviewDAO } from 'core/interview/interviewDAO';
import { DealDAO } from 'core/deal/dealDAO';
import UTSRoutes from 'constants/routes';
import { interviewUtils } from 'modules/interview/interviewUtils';
import { InputType } from 'constants/application';
import { allHRConfig } from 'modules/hiring request/screens/allHiringRequest/allHR.config';
import { DealConfig } from 'modules/deal/deal.config';
import { dealUtils } from 'modules/deal/dealUtils';
// import DealFilters from 'modules/deal/components/dealFilters/dealFilters';
const DealListLazyComponents = React.lazy(() =>
	import('modules/deal/components/dealFilters/dealFilters'),
);
const DealList = () => {
	const pageSizeOptions = [100, 200, 300, 500];
	const [dealList, setDealList] = useState([]);
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState(search);
	const [totalRecords, setTotalRecords] = useState(0);
	const [pageIndex, setPageIndex] = useState(1);
	const [pageSize, setPageSize] = useState(100);
	const [isAllowFilters, setIsAllowFilters] = useState(false);
	const [isLoading, setLoading] = useState(false);
	/*--------- React DatePicker ---------------- */
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);

	const onRemoveDealFilters = () => {
		setIsAllowFilters(false);
	};
	const onChange = (dates) => {
		const [start, end] = dates;
		setStartDate(start);
		setEndDate(end);
	};
	const fetchDealListAPIResponse = useCallback(async (pageData) => {
		setLoading(true);
		const response = await DealDAO.getDealListDAO(
			pageData
				? pageData
				: {
						pagenumber: 1,
						totalrecord: 10,
						filterFields_DealList: null,
				  },
		);

		setTotalRecords(response && response?.responseBody?.details?.totalrows);
		setDealList(response && response?.responseBody?.details);
		setLoading(false);
	}, []);
	useEffect(() => {
		const timer = setTimeout(() => setSearch(debouncedSearch), 1000);
		return () => clearTimeout(timer);
	}, [debouncedSearch]);
	useEffect(() => {
		fetchDealListAPIResponse();
	}, [fetchDealListAPIResponse]);

	return (
		<div className={DealListStyle.dealContainer}>
			<div className={DealListStyle.header}>
				<div className={DealListStyle.dealLable}>Deal Listing</div>
			</div>
			<div className={DealListStyle.filterContainer}>
				<div className={DealListStyle.filterSets}>
					<div
						className={DealListStyle.addFilter}
						onClick={() => setIsAllowFilters(!isAllowFilters)}>
						<FunnelSVG style={{ width: '16px', height: '16px' }} />

						<div className={DealListStyle.filterLabel}>Add Filters</div>
						<div className={DealListStyle.filterCount}>7</div>
					</div>
					<div className={DealListStyle.filterRight}>
						<div className={DealListStyle.searchFilterSet}>
							<SearchSVG style={{ width: '16px', height: '16px' }} />
							<input
								type={InputType.TEXT}
								className={DealListStyle.searchInput}
								placeholder="Search Table"
								/* onChange={(e) => {
									return setDebouncedSearch(
										interviewUtils.interviewListSearch(e, dealList?.rows),
									);
								}} */
							/>
						</div>
						<div className={DealListStyle.calendarFilterSet}>
							<div className={DealListStyle.label}>Date</div>
							<div className={DealListStyle.calendarFilter}>
								<CalenderSVG style={{ height: '16px', marginRight: '16px' }} />
								<DatePicker
									style={{ backgroundColor: 'red' }}
									onKeyDown={(e) => {
										e.preventDefault();
										e.stopPropagation();
									}}
									className={DealListStyle.dateFilter}
									placeholderText="Start date - End date"
									selected={startDate}
									onChange={onChange}
									startDate={startDate}
									endDate={endDate}
									selectsRange
								/>
							</div>
						</div>

						<div className={DealListStyle.priorityFilterSet}>
							<div className={DealListStyle.label}>Showing</div>

							<div className={DealListStyle.paginationFilter}>
								<Dropdown
									trigger={['click']}
									placement="bottom"
									overlay={
										<Menu
											onClick={(e) => {
												setPageSize(parseInt(e.key));

												if (pageSize !== parseInt(e.key)) {
													fetchDealListAPIResponse({
														pageNumber: pageIndex,
														totalRecord: parseInt(e.key),
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
						</div>
					</div>
				</div>
			</div>
			{/*
			 * ------------ Table Starts-----------
			 * @Table Part
			 */}
			<div className={DealListStyle.tableDetails}>
				<table>
					<thead
						className={
							isLoading ? DealListStyle.theadLoading : DealListStyle.thead
						}>
						{
							<tr>
								<th className={DealListStyle.th}>
									{isLoading ? <Skeleton active /> : 'Date'}
								</th>
								<th className={DealListStyle.th}>
									{isLoading ? <Skeleton active /> : 'Deal ID'}
								</th>
								<th className={DealListStyle.th}>
									{isLoading ? <Skeleton active /> : 'Lead Source'}
								</th>
								<th className={DealListStyle.th}>
									{isLoading ? <Skeleton active /> : 'Pipeline'}
								</th>
								<th className={DealListStyle.th}>
									{isLoading ? <Skeleton active /> : 'Company'}
								</th>
								<th className={DealListStyle.th}>
									{isLoading ? <Skeleton active /> : 'Geo'}
								</th>
								<th className={DealListStyle.th}>
									{isLoading ? <Skeleton active /> : 'BDR'}
								</th>
								<th className={DealListStyle.th}>
									{isLoading ? <Skeleton active /> : 'Sales Consultant'}
								</th>
								<th className={DealListStyle.th}>
									{isLoading ? <Skeleton active /> : 'Deal Stage'}
								</th>
							</tr>
						}
					</thead>
					<tbody>
						{search && search.length > 0 ? (
							[...search].map((item, index) => {
								return (
									<tr key={`interviewList item${index}`}>
										<td className={DealListStyle.td}>{item?.iDate}</td>
										<td
											className={`${DealListStyle.td} ${DealListStyle.anchor}`}>
											{item?.hrid}
										</td>
										<td
											className={`${DealListStyle.td} ${DealListStyle.anchor}`}>
											{interviewUtils.dateFormatter(item?.istSlotconfirmed)}
										</td>
										<td
											className={`${DealListStyle.td} ${DealListStyle.anchor}`}>
											{item?.companyname ? item?.companyname : 'NA'}
										</td>
										<td className={DealListStyle.td}>
											{item?.interviewTimeZone ? item?.interviewTimeZone : 'NA'}
										</td>
										<td
											className={`${DealListStyle.td} ${DealListStyle.anchor}`}>
											{item?.talentName}
										</td>
										<td className={DealListStyle.td}>
											{interviewUtils.GETINTERVIEWSTATUS(
												item?.interviewStatus,
												item?.interviewStatusFrontCode,
											)}
										</td>
										<td className={DealListStyle.td}>
											{item?.clientStatus ? item?.clientStatus : 'NA'}
										</td>
									</tr>
								);
							})
						) : isLoading ? (
							<Fragment>
								<tr key={`interviewListLoading loadedItem `}>
									<td className={DealListStyle.td}>
										<Skeleton active />
									</td>
									<td className={`${DealListStyle.td} ${DealListStyle.anchor}`}>
										<Skeleton active />
									</td>
									<td className={`${DealListStyle.td} ${DealListStyle.anchor}`}>
										<Skeleton active />
									</td>
									<td className={`${DealListStyle.td} ${DealListStyle.anchor}`}>
										<Skeleton active />
									</td>
									<td className={DealListStyle.td}>
										<Skeleton active />
									</td>
									<td className={`${DealListStyle.td} ${DealListStyle.anchor}`}>
										<Skeleton active />
									</td>
									<td className={DealListStyle.td}>
										<Skeleton active />
									</td>
									<td className={DealListStyle.td}>
										<Skeleton active />
									</td>
								</tr>
								<tr key={`interviewListLoading item`}>
									<td className={DealListStyle.td}>
										<Skeleton active />
									</td>
									<td className={`${DealListStyle.td} ${DealListStyle.anchor}`}>
										<Skeleton active />
									</td>
									<td className={`${DealListStyle.td} ${DealListStyle.anchor}`}>
										<Skeleton active />
									</td>
									<td className={`${DealListStyle.td} ${DealListStyle.anchor}`}>
										<Skeleton active />
									</td>
									<td className={DealListStyle.td}>
										<Skeleton active />
									</td>
									<td className={`${DealListStyle.td} ${DealListStyle.anchor}`}>
										<Skeleton active />
									</td>
									<td className={DealListStyle.td}>
										<Skeleton active />
									</td>
									<td className={DealListStyle.td}>
										<Skeleton active />
									</td>
								</tr>
							</Fragment>
						) : (
							dealList?.rows?.map((item, index) => {
								return (
									<tr key={`interviewList item${index}`}>
										<td className={DealListStyle.td}>
											{dealUtils.dateFormatter(item?.dealDate)}
										</td>
										<td
											className={`${DealListStyle.td} ${DealListStyle.anchor}`}>
											{item?.deal_Id ? (
												<Link
													to={`/deal/${item?.deal_Id}`}
													style={{ color: `var(--uplers-black)` }}>
													{item?.deal_Id}
												</Link>
											) : (
												'NA'
											)}
										</td>
										<td
											className={`${DealListStyle.td} ${DealListStyle.anchor}`}>
											NA
										</td>
										<td
											className={`${DealListStyle.td} ${DealListStyle.anchor}`}>
											{item?.pipeline ? item?.pipeline : 'NA'}
										</td>
										<td className={DealListStyle.td}>
											{item?.company ? item?.company : 'NA'}
										</td>
										<td
											className={`${DealListStyle.td} ${DealListStyle.anchor}`}>
											{item?.geo ? item?.geo : 'NA'}
										</td>
										<td className={DealListStyle.td}>
											{item?.bdr ? item?.bdr : 'NA'}
										</td>
										<td className={DealListStyle.td}>
											{item?.sales_Consultant ? item?.sales_Consultant : 'NA'}
										</td>
										<td className={DealListStyle.td}>{'NA'}</td>
									</tr>
								);
							})
						)}
					</tbody>
				</table>
			</div>
			<div className={DealListStyle.pagination}>
				{dealList?.rows && (
					<Pagination
						size="small"
						onChange={(pageNum, pageSize) => {
							setPageIndex(pageNum);
							setPageSize(pageSize);
							fetchDealListAPIResponse({
								pageNumber: pageNum,
								totalRecord: pageSize,
							});
						}}
						pageSize={pageSize}
						defaultCurrent={pageIndex && pageIndex}
						pageSizeOptions={pageSizeOptions}
						defaultPageSize={pageSize > 0 ? pageSize : 100}
						total={totalRecords}
						showTotal={(total, range) => {
							return `${range[0]}-${range[1]} of ${totalRecords} items`;
						}}
					/>
				)}
			</div>
			{isAllowFilters && (
				<Suspense fallback={<div>Loading...</div>}>
					<DealListLazyComponents
						onRemoveDealFilters={onRemoveDealFilters}
						hrFilterList={DealConfig.dealFiltersListConfig()}
						filtersType={DealConfig.dealFilterTypeConfig()}
					/>
				</Suspense>
			)}
		</div>
	);
};

export default DealList;
