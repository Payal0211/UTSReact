import React, {
	useState,
	useEffect,
	Suspense,
	useMemo,
	useCallback,
} from 'react';
import { Dropdown, Menu, message, Skeleton, Table, Tooltip } from 'antd';
import { Navigate, useNavigate } from 'react-router-dom';
import { AddNewType, DayName, InputType } from 'constants/application';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import { ReactComponent as ArrowDownSVG } from 'assets/svg/arrowDown.svg';
import { ReactComponent as FunnelSVG } from 'assets/svg/funnel.svg';
import { ReactComponent as SearchSVG } from 'assets/svg/search.svg';
import { userDAO } from 'core/user/userDAO';
import { useAllHRQuery } from 'shared/hooks/useAllHRQuery';

import { IoChevronDownOutline } from 'react-icons/io5';
import allUserStyles from './user_list.module.css';
import UTSRoutes from 'constants/routes';

import WithLoader from 'shared/components/loader/loader';
import { userConfig } from '../users.config';
import { userUtils } from '../userUtils';
import { HTTPStatusCode } from 'constants/network';
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton';

const UserList = () => {
	/* const [tableFilteredState, setTableFilteredState] = useState({
		pagesize: 100,
		pagenum: 1,
		sortdatafield: 'CreatedDateTime',
		sortorder: 'desc',
	}); */
	const pageSizeOptions = [100, 200, 300, 500, 1000];
	const [userList, setUserList] = useState([]);
	const [isLoading, setLoading] = useState(false);
	const [totalRecords, setTotalRecords] = useState(0);
	const [pageIndex, setPageIndex] = useState(1);
	const [pageSize, setPageSize] = useState(100);
	const [isAllowFilters, setIsAllowFilters] = useState(false);
	const [filtersList, setFiltersList] = useState([]);
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState(search);
	const navigate = useNavigate();

	const fetchUserList = useCallback(
		async (pageData) => {
			setLoading(true);
			const response = await userDAO.getUserListRequestDAO(
				pageData
					? pageData
					: {
							pageNumber: 1,
							totalRecord: 100,
					  },
			);
			if (response.statusCode === HTTPStatusCode.OK) {
				setTotalRecords(response && response?.responseBody?.details?.totalrows);
				setUserList(response && response?.responseBody?.details?.rows);
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
		fetchUserList();
	}, [fetchUserList]);

	const tableColumnsMemo = useMemo(() => userConfig.tableConfig(), []);

	return (
		<div className={allUserStyles.hiringRequestContainer}>
			<div className={allUserStyles.userListTitle}>
				<div className={allUserStyles.hiringRequest}>Users</div>
				<button
					type="button"
					onClick={() => navigate(UTSRoutes.ADDNEWUSER)}>
					Add New User
				</button>
			</div>
			{/*
			 * --------- Filter Component Starts ---------
			 * @Filter Part
			 */}
			<div className={allUserStyles.filterContainer}>
				<div className={allUserStyles.filterSets}>
					<div
						className={allUserStyles.addFilter}
						onClick={isAllowFilters}>
						<FunnelSVG style={{ width: '16px', height: '16px' }} />

						<div className={allUserStyles.filterLabel}>Add Filters</div>
						<div className={allUserStyles.filterCount}>7</div>
					</div>
					<div className={allUserStyles.filterRight}>
						<div className={allUserStyles.searchFilterSet}>
							<SearchSVG style={{ width: '16px', height: '16px' }} />
							<input
								type={InputType.TEXT}
								className={allUserStyles.searchInput}
								placeholder="Search Table"
								onChange={(e) => {
									return setDebouncedSearch(
										userUtils.userListSearch(e, userList),
									);
								}}
							/>
						</div>
						<div className={allUserStyles.calendarFilterSet}></div>

						<div className={allUserStyles.priorityFilterSet}>
							<div className={allUserStyles.label}>Showing</div>
							<div className={allUserStyles.paginationFilter}>
								<Dropdown
									trigger={['click']}
									placement="bottom"
									overlay={
										<Menu
											onClick={(e) => {
												setPageSize(parseInt(e.key));
												if (pageSize !== parseInt(e.key)) {
													fetchUserList({
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
			<div className={allUserStyles.tableDetails}>
				{isLoading ? (
					<TableSkeleton />
				) : (
					<WithLoader>
						<Table
							id="userListingTable"
							columns={tableColumnsMemo}
							bordered={false}
							dataSource={
								search && search.length > 0 ? [...search] : [...userList]
							}
							pagination={{
								onChange: (pageNum, pageSize) => {
									setPageIndex(pageNum);
									setPageSize(pageSize);
									/* setTableFilteredState({
										...tableFilteredState,
										pageNumber: pageNum,
										totalRecord: pageSize,
									}); */
									fetchUserList({ pageNumber: pageNum, totalRecord: pageSize });
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
		</div>
	);
};

export default UserList;
