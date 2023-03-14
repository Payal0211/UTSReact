import { Dropdown, Menu, Table } from 'antd';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import { ReactComponent as ArrowDownSVG } from 'assets/svg/arrowDown.svg';
import { ReactComponent as FunnelSVG } from 'assets/svg/funnel.svg';
import { ReactComponent as SearchSVG } from 'assets/svg/search.svg';
import { IoChevronDownOutline } from 'react-icons/io5';
import DealListStyle from '../../dealStyle.module.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import React, {
	Suspense,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { InterviewDAO } from 'core/interview/interviewDAO';
import { DealDAO } from 'core/deal/dealDAO';
import UTSRoutes from 'constants/routes';

import { InputType } from 'constants/application';

import { DealConfig } from 'modules/deal/deal.config';
import { dealUtils } from 'modules/deal/dealUtils';
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton';
import WithLoader from 'shared/components/loader/loader';
import { HTTPStatusCode } from 'constants/network';
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
	const [getHTMLFilter, setHTMLFilter] = useState(false);
	const [pageSize, setPageSize] = useState(100);
	const [isAllowFilters, setIsAllowFilters] = useState(false);
	const [isLoading, setLoading] = useState(false);
	const navigate = useNavigate();
	/*--------- React DatePicker ---------------- */
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);

	const onRemoveDealFilters = () => {
		setTimeout(() => {
			setIsAllowFilters(false);
		}, 300);
		setHTMLFilter(false);
	};
	const onChange = (dates) => {
		const [start, end] = dates;
		setStartDate(start);
		setEndDate(end);
	};
	const tableColumnsMemo = useMemo(() => DealConfig.tableConfig(), []);
	const fetchDealListAPIResponse = useCallback(
		async (pageData) => {
			setLoading(true);
			const response = await DealDAO.getDealListDAO(
				pageData
					? pageData
					: {
							pagenumber: 1,
							totalrecord: 100,
					  },
			);
			if (response.statusCode === HTTPStatusCode.OK) {
				setTotalRecords(response?.responseBody?.details?.totalrows);
				setDealList(
					dealUtils.modifyDealRequestData(
						response && response?.responseBody?.details,
					),
				);
				setLoading(false);
			} else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
				setLoading(false);
				return navigate(UTSRoutes.LOGINROUTE);
			} else if (
				response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
			) {
				setLoading(false);
				return navigate(UTSRoutes.SOMETHINGWENTWRONG);
			} else {
				setLoading(false);
				return 'NO DATA FOUND';
			}
		},
		[navigate],
	);

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
								onChange={(e) => {
									return setDebouncedSearch(
										dealUtils.dealListSearch(e, dealList),
									);
								}}
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
				{isLoading ? (
					<TableSkeleton />
				) : (
					<WithLoader>
						<Table
							id="hrListingTable"
							columns={tableColumnsMemo}
							bordered={false}
							dataSource={
								search && search.length > 0 ? [...search] : [...dealList]
							}
							pagination={{
								onChange: (pageNum, pageSize) => {
									setPageIndex(pageNum);
									setPageSize(pageSize);
									// setTableFilteredState({
									// 	...tableFilteredState,
									// 	pagesize: pageSize,
									// 	pagenum: pageNum,
									// });
									fetchDealListAPIResponse({
										pageNumber: pageNum,
										totalRecord: pageSize,
									});
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
					</WithLoader>
				)}
			</div>

			{isAllowFilters && (
				<Suspense>
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
