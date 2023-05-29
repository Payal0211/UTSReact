import React, {
	useState,
	useEffect,
	Suspense,
	useMemo,
	useCallback,
} from 'react';
import { Dropdown, Menu, message, Table, Tooltip, Modal } from 'antd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import { AddNewType, DayName, InputType } from 'constants/application';
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

import HROperator from 'modules/hiring request/components/hroperator/hroperator';
import { DateTimeUtils } from 'shared/utils/basic_utils';
import { allHRConfig } from './allHR.config';
import WithLoader from 'shared/components/loader/loader';
import { HTTPStatusCode } from 'constants/network';
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton';
import DownArrow from 'assets/svg/arrowDown.svg';
import Prioritycount from 'assets/svg/priority-count.svg';
import Remainingcount from 'assets/svg/remaining-count.svg';
import CloneHR from './cloneHRModal';
import { MasterDAO } from 'core/master/masterDAO';

/** Importing Lazy components using Suspense */
const HiringFiltersLazyComponent = React.lazy(() =>
	import('modules/hiring request/components/hiringFilter/hiringFilters'),
);

const AllHiringRequestScreen = () => {
	const [tableFilteredState, setTableFilteredState] = useState({
		pagesize: 100,
		pagenum: 1,
		sortdatafield: 'CreatedDateTime',
		sortorder: 'desc',
	});
	const [isLoading, setLoading] = useState(false);
	const pageSizeOptions = [100, 200, 300, 500, 1000];
	// const hrQueryData = useAllHRQuery();
	const [totalRecords, setTotalRecords] = useState(0);
	const [pageIndex, setPageIndex] = useState(1);
	const [pageSize, setPageSize] = useState(100);
	const [isAllowFilters, setIsAllowFilters] = useState(false);
	const [getHTMLFilter, setHTMLFilter] = useState(false);
	const [filtersList, setFiltersList] = useState([]);
	const [apiData, setAPIdata] = useState([]);
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState(search);
	const navigate = useNavigate();
	const [filteredTagLength, setFilteredTagLength] = useState(0);
	const [appliedFilter, setAppliedFilters] = useState(new Map());
	const [checkedState, setCheckedState] = useState(new Map());
	const [isOpen, setIsOpen] = useState(false);
	const [priorityCount, setPriorityCount] = useState([]);
	const [messageAPI, contextHolder] = message.useMessage();
	const [openCloneHR, setCloneHR] = useState(false);
	const [getHRnumber, setHRNumber] = useState('');
	const [getHRID, setHRID] = useState('');

	const onRemoveHRFilters = () => {
		setTimeout(() => {
			setIsAllowFilters(false);
		}, 300);
		setHTMLFilter(false);
	};

	/* const togglePriority = useCallback(
		async (payload) => {
			setLoading(true);
			let response = await hiringRequestDAO.sendHRPriorityForNextWeekRequestDAO(
				payload,
			);
			if (response.statusCode === HTTPStatusCode.OK) {
				const { tempdata, index } = hrUtils.hrTogglePriority(response, apiData);
				setAPIdata([
					...apiData.slice(0, index),
					tempdata,
					...apiData.slice(index + 1),
				]);
				setLoading(false);
				messageAPI.open({
					type: 'success',
					content: `${tempdata.HR_ID} priority has been changed.`,
				});
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
		[apiData, messageAPI, navigate],
	); */
	const togglePriority = useCallback(
		async (payload) => {
			setLoading(true);
			localStorage.setItem('hrid', payload.hRID);
			let response = await hiringRequestDAO.setHrPriorityDAO(
				payload.isNextWeekStarMarked,
				payload.hRID,
				payload.person,
			);
			if (response.statusCode === HTTPStatusCode.OK) {
				getPriorityCount();
				const { tempdata, index } = hrUtils.hrTogglePriority(response, apiData);
				setAPIdata([
					...apiData.slice(0, index),
					tempdata,
					...apiData.slice(index + 1),
				]);
				setLoading(false);
				messageAPI.open({
					type: 'success',
					content: `${tempdata.HR_ID} priority has been changed.`,
				});
			} else if (response.statusCode === HTTPStatusCode.NOT_FOUND) {
				setLoading(false);
				messageAPI.open({
					type: 'error',
					content: response.responseBody,
				});
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
		[apiData, messageAPI, navigate],
	);
	const cloneHRhandler = async () => {
		const data = {
			hrid: getHRID,
		};
		const response = data?.hrid && (await MasterDAO.getCloneHRDAO(data));
		if (response.statusCode === HTTPStatusCode.OK) {
			setCloneHR(false);
			localStorage.setItem('hrID', response?.responseBody?.details);
			navigate('/allhiringrequest/addnewhr');
		}
	};
	const tableColumnsMemo = useMemo(
		() =>
			allHRConfig.tableConfig(togglePriority, setCloneHR, setHRID, setHRNumber),
		[togglePriority],
	);
	const handleHRRequest = useCallback(
		async (pageData) => {
			setLoading(true);
			let response = await hiringRequestDAO.getPaginatedHiringRequestDAO(
				pageData,
			);
			if (response?.statusCode === HTTPStatusCode.OK) {
				setTotalRecords(response?.responseBody?.totalrows);
				setLoading(false);
				setAPIdata(hrUtils.modifyHRRequestData(response && response));
			} else if (response?.statusCode === HTTPStatusCode.NOT_FOUND) {
				setLoading(false);
				setTotalRecords(0);
				setAPIdata([]);
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
		getPriorityCount();
	}, []);

	let getPriorityCount = async () => {
		let priorityCount = await hiringRequestDAO.getRemainingPriorityCountDAO();
		setPriorityCount(priorityCount?.responseBody?.details);
	};
	useEffect(() => {
		const timer = setTimeout(() => setSearch(debouncedSearch), 1000);
		return () => clearTimeout(timer);
	}, [debouncedSearch]);

	useEffect(() => {
		handleHRRequest(tableFilteredState);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tableFilteredState]);

	const getHRFilterRequest = useCallback(async () => {
		const response = await hiringRequestDAO.getAllFilterDataForHRRequestDAO();
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

	const toggleHRFilter = useCallback(() => {
		getHRFilterRequest();
		!getHTMLFilter
			? setIsAllowFilters(!isAllowFilters)
			: setTimeout(() => {
					setIsAllowFilters(!isAllowFilters);
			  }, 300);
		setHTMLFilter(!getHTMLFilter);
	}, [getHRFilterRequest, getHTMLFilter, isAllowFilters]);

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
			handleHRRequest({
				...tableFilteredState,
				filterFields_ViewAllHRs: {
					fromDate: new Date(start).toLocaleDateString('en-US'),
					toDate: new Date(end).toLocaleDateString('en-US'),
				},
			});
		}
	};

	useEffect(() => {
		localStorage.removeItem('hrID');
		localStorage.removeItem('fromEditDeBriefing');
	}, []);
	return (
		<div className={allHRStyles.hiringRequestContainer}>
			{contextHolder}
			<div className={allHRStyles.addnewHR}>
				<div className={allHRStyles.hiringRequest}>All Hiring Requests</div>
				<div className={allHRStyles.btn_wrap}>
					<div className={allHRStyles.priorities_drop_custom}>
						{priorityCount?.length === 1 ? (
							<button className={allHRStyles.togglebtn}>
								<span className={allHRStyles.blank_btn}>
									<img src={Prioritycount} /> Priority Count:{' '}
									<b>{`${priorityCount[0].assignedCount}`}</b>{' '}
								</span>
								<span className={allHRStyles.blank_btn}>
									<img src={Remainingcount} /> Remaining Count:{' '}
									<b>{`${priorityCount[0].remainingCount}`}</b>{' '}
								</span>
							</button>
						) : (
							<button
								className={allHRStyles.togglebtn}
								onClick={() => {
									setIsOpen(!isOpen);
								}}>
								Priorities <img src={DownArrow} />
							</button>
						)}
						{isOpen && (
							<div className={allHRStyles.toggle_content}>
								<table>
									<thead>
										<tr>
											<th>User</th>
											<th>Priority Count</th>
											<th>Remaining Count</th>
										</tr>
									</thead>
									<tbody>
										{priorityCount?.map((data) => {
											return (
												<tr>
													<td>{data.fullName}</td>
													<td>{data.assignedCount}</td>
													<td>{data.remainingCount}</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						)}
					</div>
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
								IsEnabled: true,
							},
							{
								label: 'Add New Client',
								key: AddNewType.CLIENT,
								IsEnabled: true,
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
			</div>
			{/*
			 * --------- Filter Component Starts ---------
			 * @Filter Part
			 */}
			<div className={allHRStyles.filterContainer}>
				<div className={allHRStyles.filterSets}>
					<div
						className={allHRStyles.addFilter}
						onClick={toggleHRFilter}>
						<FunnelSVG style={{ width: '16px', height: '16px' }} />

						<div className={allHRStyles.filterLabel}>Add Filters</div>
						<div className={allHRStyles.filterCount}>{filteredTagLength}</div>
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
									onChange={onCalenderFilter}
									startDate={startDate}
									endDate={endDate}
									selectsRange
								/>
							</div>
						</div>
						<div className={allHRStyles.priorityFilterSet}>
							<div className={allHRStyles.label}>Set Priority</div>
							<div
								className={allHRStyles.priorityFilter}
								style={{
									cursor:
										DateTimeUtils.getTodaysDay() === DayName.FRIDAY
											? 'not-allowed'
											: 'pointer',
								}}>
								{DateTimeUtils.getTodaysDay() === DayName.FRIDAY ? (
									<Tooltip
										placement="bottom"
										title="Locked">
										<LockSVG
											style={{
												width: '18px',
												height: '18px',
												cursor:
													DateTimeUtils.getTodaysDay() === DayName.FRIDAY
														? 'not-allowed'
														: 'pointer',
											}}
										/>
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
												if (pageSize !== parseInt(e.key)) {
													handleHRRequest({
														...tableFilteredState,
														pagesize: parseInt(e.key),
														pagenum: pageIndex,
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
			<div className={allHRStyles.tableDetails}>
				{isLoading ? (
					<TableSkeleton />
				) : (
					<WithLoader className="mainLoader">
						<Table
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
							}}
						/>
					</WithLoader>
				)}
			</div>

			{isAllowFilters && (
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
			)}
			<Modal
				width={'700px'}
				centered
				footer={false}
				open={openCloneHR}
				className="cloneHRConfWrap"
				onCancel={() => setCloneHR(false)}>
				<CloneHR
					cloneHRhandler={cloneHRhandler}
					onCancel={() => setCloneHR(false)}
					getHRnumber={getHRnumber}
				/>
			</Modal>
		</div>
	);
};

export default AllHiringRequestScreen;
