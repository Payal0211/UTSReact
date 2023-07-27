import { Dropdown, Menu, Table } from 'antd';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
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
import { useNavigate } from 'react-router-dom';
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
	const [tableFilteredState, setTableFilteredState] = useState({
		totalrecord: 100,
		pagenumber: 1,
	});
	const pageSizeOptions = [100, 200, 300, 500];
	const [dealList, setDealList] = useState([]);
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState(search);
	const [ searchText , setSearchText] = useState('');
	const [totalRecords, setTotalRecords] = useState(0);
	const [pageIndex, setPageIndex] = useState(1);
	const [getHTMLFilter, setHTMLFilter] = useState(false);
	const [filtersList, setFiltersList] = useState([]);
	const [pageSize, setPageSize] = useState(100);
	const [isAllowFilters, setIsAllowFilters] = useState(false);
	const [isLoading, setLoading] = useState(false);
	const [filteredTagLength, setFilteredTagLength] = useState(0);
	const [appliedFilter, setAppliedFilters] = useState(new Map());
	const [checkedState, setCheckedState] = useState(new Map());
	const navigate = useNavigate();

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
	const tableColumnsMemo = useMemo(() => DealConfig.tableConfig(navigate), [navigate]);
	const handleDealRequest = useCallback(
		async (pageData) => {
			setLoading(true);
			const response = await DealDAO.getDealListDAO(
				pageData
					? pageData
					: {
							pagenumber: 1,
							totalrecord: 100,
							searchText: searchText
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
			} else if (response.statusCode === HTTPStatusCode.NOT_FOUND){
				setTotalRecords(0);
				setDealList([]);
				setLoading(false);
			}
			else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
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
		[navigate,searchText],
	);

	const getDealFilterRequest = useCallback(async () => {
		const response = await DealDAO.getAllFilterDataForDealRequestDAO();
		if (response?.statusCode === HTTPStatusCode.OK) {
			setFiltersList(response && response?.responseBody?.details?.Data);
		} else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
			return navigate(UTSRoutes.LOGINROUTE);
		} else if (response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
			return navigate(UTSRoutes.SOMETHINGWENTWRONG);
		} else {
			return 'NO DATA FOUND';
		}
	}, [navigate]);

	useEffect(()=>{
		getDealFilterRequest();
	},[getDealFilterRequest])

	const toggleDealFilter = useCallback(() => {
		
		!getHTMLFilter
			? setIsAllowFilters(!isAllowFilters)
			: setTimeout(() => {
					setIsAllowFilters(!isAllowFilters);
			  }, 300);
		setHTMLFilter(!getHTMLFilter);
	}, [ getHTMLFilter, isAllowFilters]);
	useEffect(() => {
		const timer = setTimeout(() => handleDealRequest(), 1000);
		return () => clearTimeout(timer);
	}, [debouncedSearch]);
	//console.log("search", {debouncedSearch, search})
	useEffect(() => {
		handleDealRequest(tableFilteredState);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tableFilteredState]);
	/*--------- React DatePicker ---------------- */
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);

	const onCalenderFilter = (dates) => {
		const [start, end] = dates;

		setStartDate(start);
		setEndDate(end);

		if (start && end) {
			setTableFilteredState({
				...tableFilteredState,
				filterFields_ViewAllHRs: {
					fromDate: new Date(start).toLocaleDateString('en-US'),
					toDate: new Date(end).toLocaleDateString('en-US'),
				},
			});
			handleDealRequest({
				...tableFilteredState,
				filterFields_ViewAllHRs: {
					fromDate: new Date(start).toLocaleDateString('en-US'),
					toDate: new Date(end).toLocaleDateString('en-US'),
				},
			});
		}
	};

	const clearFilters = useCallback(() => {
		setAppliedFilters(new Map());
		setCheckedState(new Map());
		setFilteredTagLength(0);
		setTableFilteredState({
			...tableFilteredState,
			filterFields_DealList: {},
		});
		const reqFilter = {
			...tableFilteredState,
			filterFields_DealList: {},
		};
		 handleDealRequest(reqFilter);
		 onRemoveDealFilters()
		 setStartDate(null);
		 setEndDate(null);
	}, [
		handleDealRequest,
		setAppliedFilters,
		setCheckedState,
		setFilteredTagLength,
		setTableFilteredState,
		tableFilteredState,
	]);

	return (
		<div className={DealListStyle.dealContainer}>
			<div className={DealListStyle.header}>
				<div className={DealListStyle.dealLable}>Deal Listing</div>
			</div>
			{/*
			 * --------- Filter Component Starts ---------
			 * @Filter Part
			 */}
			<div className={DealListStyle.filterContainer}>
				<div className={DealListStyle.filterSets}>
				<div className={DealListStyle.filterSetsInner} >
					<div
						className={DealListStyle.addFilter}
						onClick={toggleDealFilter}>
						<FunnelSVG style={{ width: '16px', height: '16px' }} />

						<div className={DealListStyle.filterLabel}>Add Filters</div>
						<div className={DealListStyle.filterCount}>{filteredTagLength}</div>
					</div>
					<p onClick={()=> clearFilters() }>Reset Filters</p>
				</div>	
					<div className={DealListStyle.filterRight}>
						<div className={DealListStyle.searchFilterSet}>
							<SearchSVG style={{ width: '16px', height: '16px' }} />
							<input
								type={InputType.TEXT}
								className={DealListStyle.searchInput}
								placeholder="Search Table"
								onChange={(e) => {
									setSearchText(e.target.value)
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
									onChange={onCalenderFilter}
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
													handleDealRequest({
														...tableFilteredState,
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
							scroll={{ x: '100vw', y: '100vh' }}
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
									setTableFilteredState({
										...tableFilteredState,
										totalRecord: pageSize,
										pageNumber: pageNum,
									});
									handleDealRequest({
										pageNumber: pageNum,
										totalRecord: pageSize,
										searchText: searchText
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
						setAppliedFilters={setAppliedFilters}
						appliedFilter={appliedFilter}
						setCheckedState={setCheckedState}
						checkedState={checkedState}
						handleDealRequest={handleDealRequest}
						setTableFilteredState={setTableFilteredState}
						tableFilteredState={tableFilteredState}
						setFilteredTagLength={setFilteredTagLength}
						onRemoveDealFilters={onRemoveDealFilters}
						getHTMLFilter={getHTMLFilter}
						hrFilterList={DealConfig.dealFiltersListConfig()}
						filtersType={DealConfig.dealFilterTypeConfig(
							filtersList && filtersList,
						)}
						clearFilters={clearFilters}
					/>
				</Suspense>
			)}
		</div>
	);
};

export default DealList;
