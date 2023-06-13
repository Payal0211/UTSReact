import { Link } from 'react-router-dom';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import { ReactComponent as FunnelSVG } from 'assets/svg/funnel.svg';
import { ReactComponent as SearchSVG } from 'assets/svg/search.svg';
import { IoChevronDownOutline } from 'react-icons/io5';
import I2SReport from './I2SReportStyle.module.css';

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

const I2sReport = () => {
	const [tableFilteredState, setTableFilteredState] = useState({
		totalrecord: 100,
		pagenumber: 1,
	});
	const pageSizeOptions = [100, 200, 300, 500];
	const [dealList, setDealList] = useState([]);
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState(search);
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
	const handleDealRequest = useCallback(
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

	useEffect(() => {
		const timer = setTimeout(() => setSearch(debouncedSearch), 1000);
		return () => clearTimeout(timer);
	}, [debouncedSearch]);
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
	return (
		<div className={I2SReport.dealContainer}>
			<div className={I2SReport.header}>
				<div className={I2SReport.dealLable}>I2S Report</div>
			</div>
			{/*
			 * --------- Filter Component Starts ---------
			 * @Filter Part
			 */}
			<div className={I2SReport.filterContainer}>
				<div className={I2SReport.filterSets}>
					<div className={I2SReport.filterRight}>
						<div className={I2SReport.searchFilterSet}>
							<SearchSVG style={{ width: '16px', height: '16px' }} />
							<input
								type={InputType.TEXT}
								className={I2SReport.searchInput}
								placeholder="Search Table"
								onChange={(e) => {
									return setDebouncedSearch(
										dealUtils.dealListSearch(e, dealList),
									);
								}}
							/>
						</div>
						<div className={I2SReport.calendarFilterSet}>
							<div className={I2SReport.label}>Date</div>
							<div className={I2SReport.calendarFilter}>
								<CalenderSVG style={{ height: '16px', marginRight: '16px' }} />
								<DatePicker
									style={{ backgroundColor: 'red' }}
									onKeyDown={(e) => {
										e.preventDefault();
										e.stopPropagation();
									}}
									className={I2SReport.dateFilter}
									placeholderText="Start date - End date"
									selected={startDate}
									onChange={onCalenderFilter}
									startDate={startDate}
									endDate={endDate}
									selectsRange
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className={I2SReport.i2sContainer}>
				<ul className={I2SReport.i2sListing}>
					<li>
						<div className={I2SReport.cardWrapper}>
							<div className={I2SReport.cardTitle}>Overall (NBD + AM + Partnership)</div>
							<ul className={I2SReport.cardInner}>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Total Interview Done</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											124
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Hired</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											73
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Cancelled</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											208
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Feedback Pending</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Feedback Submitted With AnotherRound/NoHire/OnHold</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Profile Reject/OnHold/Cancelled After Interview Done</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											2
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>I2S %</div>
									<div className={I2SReport.rowValue}>
										<div className={I2SReport.textLabel}>
											59%
										</div>
									</div>
								</li>
							</ul>
						</div>
					</li>
					<li>
						<div className={I2SReport.cardWrapper}>
							<div className={I2SReport.cardTitle}>NBD - US/CA</div>
							<ul className={I2SReport.cardInner}>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Total Interview Done</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											12
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Hired</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											9
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Cancelled</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											44
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Feedback Pending</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Feedback Submitted With AnotherRound/NoHire/OnHold</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Profile Reject/OnHold/Cancelled After Interview Done</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											1
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>I2S %</div>
									<div className={I2SReport.rowValue}>
										<div className={I2SReport.textLabel}>
											75%
										</div>
									</div>
								</li>
							</ul>
						</div>
					</li>
					<li>
						<div className={I2SReport.cardWrapper}>
							<div className={I2SReport.cardTitle}>Account Management</div>
							<ul className={I2SReport.cardInner}>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Total Interview Done</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											2
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Hired</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											1
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Cancelled</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											3
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Feedback Pending</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Feedback Submitted With AnotherRound/NoHire/OnHold</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Profile Reject/OnHold/Cancelled After Interview Done</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>I2S %</div>
									<div className={I2SReport.rowValue}>
										<div className={I2SReport.textLabel}>
											50%
										</div>
									</div>
								</li>
							</ul>
						</div>
					</li>
					<li>
						<div className={I2SReport.cardWrapper}>
							<div className={I2SReport.cardTitle}>NBD - AU/NZ</div>
							<ul className={I2SReport.cardInner}>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Total Interview Done</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Hired</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											3
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Cancelled</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Feedback Pending</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Feedback Submitted With AnotherRound/NoHire/OnHold</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Profile Reject/OnHold/Cancelled After Interview Done</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>I2S %</div>
									<div className={I2SReport.rowValue}>
										<div className={I2SReport.textLabel}>
											0%
										</div>
									</div>
								</li>
							</ul>
						</div>
					</li>
					<li>
						<div className={I2SReport.cardWrapper}>
							<div className={I2SReport.cardTitle}>NBD - DataTeam</div>
							<ul className={I2SReport.cardInner}>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Total Interview Done</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Hired</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Cancelled</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Feedback Pending</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Feedback Submitted With AnotherRound/NoHire/OnHold</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Profile Reject/OnHold/Cancelled After Interview Done</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>I2S %</div>
									<div className={I2SReport.rowValue}>
										<div className={I2SReport.textLabel}>
											0%
										</div>
									</div>
								</li>
							</ul>
						</div>
					</li>
					<li>
						<div className={I2SReport.cardWrapper}>
							<div className={I2SReport.cardTitle}>NBD - UK/EU/ROW</div>
							<ul className={I2SReport.cardInner}>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Total Interview Done</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Hired</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Cancelled</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Feedback Pending</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Feedback Submitted With AnotherRound/NoHire/OnHold</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Profile Reject/OnHold/Cancelled After Interview Done</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>I2S %</div>
									<div className={I2SReport.rowValue}>
										<div className={I2SReport.textLabel}>
											0%
										</div>
									</div>
								</li>
							</ul>
						</div>
					</li>
					<li>
						<div className={I2SReport.cardWrapper}>
							<div className={I2SReport.cardTitle}>AM india</div>
							<ul className={I2SReport.cardInner}>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Total Interview Done</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Hired</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Cancelled</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Feedback Pending</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Feedback Submitted With AnotherRound/NoHire/OnHold</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Profile Reject/OnHold/Cancelled After Interview Done</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>I2S %</div>
									<div className={I2SReport.rowValue}>
										<div className={I2SReport.textLabel}>
											0%
										</div>
									</div>
								</li>
							</ul>
						</div>
					</li>
					<li>
						<div className={I2SReport.cardWrapper}>
							<div className={I2SReport.cardTitle}>Bhuvan UTS AM Team</div>
							<ul className={I2SReport.cardInner}>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Total Interview Done</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											84
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Hired</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											53
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Cancelled</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											133
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Feedback Pending</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Feedback Submitted With AnotherRound/NoHire/OnHold</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Profile Reject/OnHold/Cancelled After Interview Done</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											1
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>I2S %</div>
									<div className={I2SReport.rowValue}>
										<div className={I2SReport.textLabel}>
											63%
										</div>
									</div>
								</li>
							</ul>
						</div>
					</li>
					<li>
						<div className={I2SReport.cardWrapper}>
							<div className={I2SReport.cardTitle}>Reshma B team</div>
							<ul className={I2SReport.cardInner}>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Total Interview Done</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											3
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Hired</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											1
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Cancelled</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											20
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Feedback Pending</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Feedback Submitted With AnotherRound/NoHire/OnHold</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Profile Reject/OnHold/Cancelled After Interview Done</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>I2S %</div>
									<div className={I2SReport.rowValue}>
										<div className={I2SReport.textLabel}>
											33%
										</div>
									</div>
								</li>
							</ul>
						</div>
					</li>
					<li>
						<div className={I2SReport.cardWrapper}>
							<div className={I2SReport.cardTitle}>Ankit Pandya Team</div>
							<ul className={I2SReport.cardInner}>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Total Interview Done</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											7
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Hired</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											2
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Cancelled</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											1
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Feedback Pending</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Feedback Submitted With AnotherRound/NoHire/OnHold</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Profile Reject/OnHold/Cancelled After Interview Done</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>I2S %</div>
									<div className={I2SReport.rowValue}>
										<div className={I2SReport.textLabel}>
											29%
										</div>
									</div>
								</li>
							</ul>
						</div>
					</li>
					<li>
						<div className={I2SReport.cardWrapper}>
							<div className={I2SReport.cardTitle}>Jaymin Bhuptani NBD Team</div>
							<ul className={I2SReport.cardInner}>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Total Interview Done</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											16
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Hired</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											4
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Cancelled</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											4
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Feedback Pending</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Feedback Submitted With AnotherRound/NoHire/OnHold</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Profile Reject/OnHold/Cancelled After Interview Done</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>I2S %</div>
									<div className={I2SReport.rowValue}>
										<div className={I2SReport.textLabel}>
											25%
										</div>
									</div>
								</li>
							</ul>
						</div>
					</li>
					<li>
						<div className={I2SReport.cardWrapper}>
							<div className={I2SReport.cardTitle}>Attract - AU</div>
							<ul className={I2SReport.cardInner}>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Total Interview Done</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Hired</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Cancelled</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Feedback Pending</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Feedback Submitted With AnotherRound/NoHire/OnHold</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Profile Reject/OnHold/Cancelled After Interview Done</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>I2S %</div>
									<div className={I2SReport.rowValue}>
										<div className={I2SReport.textLabel}>
											0%
										</div>
									</div>
								</li>
							</ul>
						</div>
					</li>
					<li>
						<div className={I2SReport.cardWrapper}>
							<div className={I2SReport.cardTitle}>Nurture - US</div>
							<ul className={I2SReport.cardInner}>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Total Interview Done</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Hired</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Cancelled</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Feedback Pending</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Feedback Submitted With AnotherRound/NoHire/OnHold</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Profile Reject/OnHold/Cancelled After Interview Done</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>I2S %</div>
									<div className={I2SReport.rowValue}>
										<div className={I2SReport.textLabel}>
											0%
										</div>
									</div>
								</li>
							</ul>
						</div>
					</li>
					<li>
						<div className={I2SReport.cardWrapper}>
							<div className={I2SReport.cardTitle}>Partnership</div>
							<ul className={I2SReport.cardInner}>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Total Interview Done</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Hired</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Cancelled</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Interview Feedback Pending</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Feedback Submitted With AnotherRound/NoHire/OnHold</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>Profile Reject/OnHold/Cancelled After Interview Done</div>
									<div className={I2SReport.rowValue}>
										<Link className={I2SReport.textLink}>
											0
										</Link>
									</div>
								</li>
								<li className={I2SReport.row}>
									<div className={I2SReport.rowLabel}>I2S %</div>
									<div className={I2SReport.rowValue}>
										<div className={I2SReport.textLabel}>
											0%
										</div>
									</div>
								</li>
							</ul>
						</div>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default I2sReport;
