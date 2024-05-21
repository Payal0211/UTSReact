import { Fragment, useCallback, useEffect, useState } from 'react';
import InterviewListStyle from '../../interviewStyle.module.css';
import { InterviewDAO } from 'core/interview/interviewDAO';

import { IoChevronDownOutline } from 'react-icons/io5';
import { interviewUtils } from 'modules/interview/interviewUtils';
import { Dropdown, Menu, Pagination } from 'antd';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import { ReactComponent as ArrowDownSVG } from 'assets/svg/arrowDown.svg';
import { ReactComponent as FunnelSVG } from 'assets/svg/funnel.svg';
import { ReactComponent as SearchSVG } from 'assets/svg/search.svg';
import { Skeleton } from 'antd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { InputType } from 'constants/application';
import { Link } from 'react-router-dom';
import UTSRoutes from 'constants/routes';
import WithLoader from 'shared/components/loader/loader';
const InterviewList = () => {
	const pageSizeOptions = [100, 200, 300, 500];
	const [interviewList, setInterviewList] = useState([]);
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState(search);
	const [totalRecords, setTotalRecords] = useState(0);
	const [pageIndex, setPageIndex] = useState(1);
	const [pageSize, setPageSize] = useState(100);
	const [isLoading, setLoading] = useState(false);
	/*--------- React DatePicker ---------------- */
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);

	const onChange = (dates) => {
		const [start, end] = dates;
		setStartDate(start);
		setEndDate(end);
	};
	const fetchInterviewList = useCallback(async (pageData) => {
		setLoading(true);
		const response = await InterviewDAO.getInterviewListDAO(
			pageData
				? pageData
				: {
						pageNumber: 1,
						totalRecord: 100,
				  },
		);
		setTotalRecords(response && response?.responseBody?.details?.totalrows);
		setInterviewList(response && response?.responseBody?.details);
		setLoading(false);
	}, []);
	useEffect(() => {
		const timer = setTimeout(() => setSearch(debouncedSearch), 1000);
		return () => clearTimeout(timer);
	}, [debouncedSearch]);
	useEffect(() => {
		fetchInterviewList();
	}, [fetchInterviewList]);

	return (
		<WithLoader className="pageMainLoader" isLoading={debouncedSearch?.length?false:isLoading}>
			<div className={InterviewListStyle.interviewContainer}>
				<div className={InterviewListStyle.header}>
					<div className={InterviewListStyle.allInterviewLabel}>
						All Interviews
					</div>
				</div>
				<div className={InterviewListStyle.filterContainer}>
					<div className={InterviewListStyle.filterSets}>
						<div
							className={InterviewListStyle.addFilter}
							// onClick={() => setIsAllowFilters(!isAllowFilters)}
						>
							<FunnelSVG style={{ width: '16px', height: '16px' }} />

							<div className={InterviewListStyle.filterLabel}>Add Filters</div>
							<div className={InterviewListStyle.filterCount}>7</div>
						</div>
						<div className={InterviewListStyle.filterRight}>
							<div className={InterviewListStyle.searchFilterSet}>
								<SearchSVG style={{ width: '16px', height: '16px' }} />
								<input
									type={InputType.TEXT}
									className={InterviewListStyle.searchInput}
									placeholder="Search Table"
									onChange={(e) => {
										return setDebouncedSearch(
											interviewUtils.interviewListSearch(e, interviewList?.rows),
										);
									}}
								/>
							</div>
							<div className={InterviewListStyle.calendarFilterSet}>
								<div className={InterviewListStyle.label}>Date</div>
								<div className={InterviewListStyle.calendarFilter}>
									<CalenderSVG style={{ height: '16px', marginRight: '16px' }} />
									<DatePicker
										style={{ backgroundColor: 'red' }}
										onKeyDown={(e) => {
											e.preventDefault();
											e.stopPropagation();
										}}
										className={InterviewListStyle.dateFilter}
										placeholderText="Start date - End date"
										selected={startDate}
										onChange={onChange}
										startDate={startDate}
										endDate={endDate}
										selectsRange
									/>
								</div>
							</div>

							<div className={InterviewListStyle.priorityFilterSet}>
								<div className={InterviewListStyle.label}>Showing</div>

								<div className={InterviewListStyle.paginationFilter}>
									<Dropdown
										trigger={['click']}
										placement="bottom"
										overlay={
											<Menu
												onClick={(e) => {
													setPageSize(parseInt(e.key));

													if (pageSize !== parseInt(e.key)) {
														fetchInterviewList({
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

				<div
					style={{
						paddingBottom: '20px',
						backgroundColor: `var(--background-color-light)`,
						borderRadius: '8px',
					}}>
					<div className={InterviewListStyle.tableDetails}>
						<table>
							<thead
								className={
									isLoading
										? InterviewListStyle.theadLoading
										: InterviewListStyle.thead
								}>
								{
									<tr>
										<th className={InterviewListStyle.th}>
											{isLoading ? <Skeleton active /> : 'Date'}
										</th>
										<th className={InterviewListStyle.th}>
											{isLoading ? <Skeleton active /> : 'HR ID'}
										</th>
										<th className={InterviewListStyle.th}>
											{isLoading ? (
												<Skeleton active />
											) : (
												<>
													{' '}
													Slot Confirmed(IST){' '}
													<ArrowDownSVG
														style={{
															position: 'absolute',
															marginLeft: '7px',
															marginTop: '-3px',
														}}
													/>
												</>
											)}
										</th>
										<th className={InterviewListStyle.th}>
											{isLoading ? <Skeleton active /> : 'Company Details'}
										</th>
										<th className={InterviewListStyle.th}>
											{isLoading ? <Skeleton active /> : 'Time'}
										</th>
										<th className={InterviewListStyle.th}>
											{isLoading ? <Skeleton active /> : 'Talent Details'}
										</th>
										<th className={InterviewListStyle.th}>
											{isLoading ? <Skeleton active /> : 'Interview Status'}
										</th>
										<th className={InterviewListStyle.th}>
											{isLoading ? (
												<Skeleton active />
											) : (
												<>
													Client Status{' '}
													<ArrowDownSVG
														style={{
															position: 'absolute',
															marginLeft: '7px',
															marginTop: '-3px',
														}}
													/>
												</>
											)}
										</th>
									</tr>
								}
							</thead>
							<tbody>
								{search && search.length > 0 ? (
									[...search].map((item, index) => {
										return (
											<tr key={`interviewList item${index}`}>
												<td className={InterviewListStyle.td}>{item?.iDate}</td>
												<td
													className={`${InterviewListStyle.td} ${InterviewListStyle.anchor}`}>
													{item?.hrid}
												</td>
												<td
													className={`${InterviewListStyle.td} ${InterviewListStyle.anchor}`}>
													{interviewUtils.dateFormatter(item?.istSlotconfirmed)}
												</td>
												<td
													className={`${InterviewListStyle.td} ${InterviewListStyle.anchor}`}>
													{item?.companyname ? item?.companyname : 'NA'}
												</td>
												<td className={InterviewListStyle.td}>
													{item?.interviewTimeZone
														? item?.interviewTimeZone
														: 'NA'}
												</td>
												<td
													className={`${InterviewListStyle.td} ${InterviewListStyle.anchor}`}>
													{item?.talentName}
												</td>
												<td className={InterviewListStyle.td}>
													{interviewUtils.GETINTERVIEWSTATUS(
														item?.interviewStatus,
														item?.interviewStatusFrontCode,
													)}
												</td>
												<td className={InterviewListStyle.td}>
													{item?.clientStatus ? item?.clientStatus : 'NA'}
												</td>
											</tr>
										);
									})
								) : isLoading ? (
									<Fragment>
										<tr key={`interviewListLoading loadedItem `}>
											<td className={InterviewListStyle.td}>
												<Skeleton active />
											</td>
											<td
												className={`${InterviewListStyle.td} ${InterviewListStyle.anchor}`}>
												<Skeleton active />
											</td>
											<td
												className={`${InterviewListStyle.td} ${InterviewListStyle.anchor}`}>
												<Skeleton active />
											</td>
											<td
												className={`${InterviewListStyle.td} ${InterviewListStyle.anchor}`}>
												<Skeleton active />
											</td>
											<td className={InterviewListStyle.td}>
												<Skeleton active />
											</td>
											<td
												className={`${InterviewListStyle.td} ${InterviewListStyle.anchor}`}>
												<Skeleton active />
											</td>
											<td className={InterviewListStyle.td}>
												<Skeleton active />
											</td>
											<td className={InterviewListStyle.td}>
												<Skeleton active />
											</td>
										</tr>
										<tr key={`interviewListLoading item`}>
											<td className={InterviewListStyle.td}>
												<Skeleton active />
											</td>
											<td
												className={`${InterviewListStyle.td} ${InterviewListStyle.anchor}`}>
												<Skeleton active />
											</td>
											<td
												className={`${InterviewListStyle.td} ${InterviewListStyle.anchor}`}>
												<Skeleton active />
											</td>
											<td
												className={`${InterviewListStyle.td} ${InterviewListStyle.anchor}`}>
												<Skeleton active />
											</td>
											<td className={InterviewListStyle.td}>
												<Skeleton active />
											</td>
											<td
												className={`${InterviewListStyle.td} ${InterviewListStyle.anchor}`}>
												<Skeleton active />
											</td>
											<td className={InterviewListStyle.td}>
												<Skeleton active />
											</td>
											<td className={InterviewListStyle.td}>
												<Skeleton active />
											</td>
										</tr>
									</Fragment>
								) : (
									interviewList?.rows?.map((item, index) => {
										return (
											<tr key={`interviewList item${index}`}>
												<td className={InterviewListStyle.td}>{item?.iDate}</td>
												<td
													className={`${InterviewListStyle.td} ${InterviewListStyle.anchor}`}>
													{item?.hrid}
												</td>
												<td
													className={`${InterviewListStyle.td} ${InterviewListStyle.anchor}`}>
													<Link
														to={UTSRoutes.INTERVIEWSCHEDULE}
														style={{ color: `var(--uplers-black)` }}>
														{interviewUtils.dateFormatter(item?.istSlotconfirmed)}
													</Link>
												</td>
												<td
													className={`${InterviewListStyle.td} ${InterviewListStyle.anchor}`}>
													{item?.companyname ? item?.companyname : 'NA'}
												</td>
												<td className={InterviewListStyle.td}>
													{item?.interviewTimeZone
														? item?.interviewTimeZone
														: 'NA'}
												</td>
												<td
													className={`${InterviewListStyle.td} ${InterviewListStyle.anchor}`}>
													{item?.talentName}
												</td>
												<td className={InterviewListStyle.td}>
													{interviewUtils.GETINTERVIEWSTATUS(
														item?.interviewStatus,
														item?.interviewStatusFrontCode,
													)}
												</td>
												<td className={InterviewListStyle.td}>
													{/* {item?.clientStatus ? item?.clientStatus : 'NA'} */}
													<Link
														to={UTSRoutes.INTERVIEWFEEDBACK}
														style={{ color: `var(--uplers-black)` }}>
														{'View Feedback'}
													</Link>
												</td>
											</tr>
										);
									})
								)}
							</tbody>
						</table>
					</div>
				</div>
				<div className={InterviewListStyle.pagination}>
					{interviewList?.rows && (
						<Pagination
							size="small"
							onChange={(pageNum, pageSize) => {
								setPageIndex(pageNum);
								setPageSize(pageSize);
								fetchInterviewList({
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
			</div>
		</WithLoader>
	);
};

export default InterviewList;
