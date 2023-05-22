import JDDUmpStyle from './jdDumpReport.module.css';
import { Divider, Modal, Table } from 'antd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ReportDAO } from 'core/report/reportDAO';
import { HTTPStatusCode } from 'constants/network';
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton';
import { reportConfig } from 'modules/report/report.config';
import { ReactComponent as SearchSVG } from 'assets/svg/search.svg';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import { Controller, useForm } from 'react-hook-form';
import {
	downloadToExcel,
	formatJDDumpReport,
	jdDumpSearch,
} from 'modules/report/reportUtils';
import { InputType } from 'constants/application';

const JDDumpReportScreen = () => {
	const { control } = useForm();
	const [tableFilteredState, setTableFilteredState] = useState({
		pageIndex: 1,
		pageSize: 100,
		sortExpression: 'HRCreatedDate',
		hrNumber: null,
		sortDirection: 'desc',
		jdSkillPercentage: null,
		jdRolesResponsibilities: null,
		jdRequirement: null,
		overAllRowWise: null,
		startDate: null,
		endDate: null,
	});
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState(search);
	const [isOverAllModal, setOverAllModal] = useState(false);
	const [apiData, setApiData] = useState([]);
	const [isLoading, setLoading] = useState(false);
	const pageSizeOptions = [100, 200, 300, 500];
	const [pageIndex, setPageIndex] = useState(1);
	const [totalRecords, setTotalRecords] = useState(0);
	const [pageSize, setPageSize] = useState(100);

	const [startDate, setStartDate] = useState();
	const [endDate, setEndDate] = useState(null);

	const [jdSkillModal, setJDSkillModal] = useState(false);
	const [hrSkillModal, setHRSkillModal] = useState(false);
	const [jdRoleRespModal, setJDRoleRespModal] = useState(false);
	const [hrRoleRespModal, setHRRoleRespModal] = useState(false);
	const [jdReqModal, setJDReqModal] = useState(false);
	const [hrReqModal, setHRReqModal] = useState(false);
	const [selectedRecord, setSelectedRecord] = useState('');
	const getJDDumpReportHandler = useCallback(async (tableData) => {
		setLoading(true);
		let response = await ReportDAO.jdParsingDumpReportRequestDAO(tableData);

		if (response?.statusCode === HTTPStatusCode.OK) {
			setLoading(false);
			setApiData(formatJDDumpReport(response && response?.responseBody));
			setTotalRecords(response?.responseBody?.totalrows);
		} else {
			setLoading(false);
			setApiData([]);
		}
	}, []);

	const tableColumnsMemo = useMemo(
		() =>
			reportConfig.JDDumpTableConfig(
				setJDSkillModal,
				setHRSkillModal,
				setJDRoleRespModal,
				setHRRoleRespModal,
				setJDReqModal,
				setHRReqModal,
				setSelectedRecord,
			),
		[],
	);

	const onCalenderFilter = (dates) => {
		const [start, end] = dates;

		setStartDate(start);
		setEndDate(end);

		if (start && end) {
			setTableFilteredState({
				...tableFilteredState,
				startDate: new Date(start)
					.toLocaleDateString('en-UK')
					.split('/')
					.reverse()
					.join('-'),
				endDate: new Date(end)
					.toLocaleDateString('en-UK')
					.split('/')
					.reverse()
					.join('-'),
			});

			getJDDumpReportHandler({
				...tableFilteredState,
				startDate: new Date(start)
					.toLocaleDateString('en-UK')
					.split('/')
					.reverse()
					.join('-'),
				endDate: new Date(end)
					.toLocaleDateString('en-UK')
					.split('/')
					.reverse()
					.join('-'),
			});
		}
	};

	useEffect(() => {
		const timer = setTimeout(() => setSearch(debouncedSearch), 1000);
		return () => clearTimeout(timer);
	}, [debouncedSearch]);
	useEffect(() => {
		getJDDumpReportHandler(tableFilteredState);
	}, [getJDDumpReportHandler, tableFilteredState]);

	return (
		<div className={JDDUmpStyle.hiringRequestContainer}>
			<div className={JDDUmpStyle.addnewHR}>
				<div className={JDDUmpStyle.hiringRequest}>JD Efficiency Report</div>
			</div>
			{/*
			 * --------- Filter Component Starts ---------
			 * @Filter Part
			 */}
			<div className={JDDUmpStyle.filterContainer}>
				<div className={JDDUmpStyle.filterSets}>
					<div>
						<button
							className={JDDUmpStyle.btnPrimaryOutline}
							onClick={() => setOverAllModal(true)}>
							Summary
						</button>
					</div>

					<div className={JDDUmpStyle.filterRight}>
						<div className={JDDUmpStyle.searchFilterSet}>
							<SearchSVG style={{ width: '16px', height: '16px' }} />
							<input
								type={InputType.TEXT}
								className={JDDUmpStyle.searchInput}
								placeholder="Search HR Number   "
								onChange={(e) => {
									return setDebouncedSearch(jdDumpSearch(e, apiData));
								}}
							/>
						</div>
						<div className={JDDUmpStyle.calendarFilterSet}>
							<div className={JDDUmpStyle.label}>Date</div>

							<div className={JDDUmpStyle.calendarFilter}>
								<CalenderSVG style={{ height: '16px', marginRight: '16px' }} />
								<Controller
									render={({ ...props }) => (
										<DatePicker
											className={JDDUmpStyle.dateFilter}
											onKeyDown={(e) => {
												e.preventDefault();
												e.stopPropagation();
											}}
											placeholderText="Start date - End date"
											selected={startDate}
											onChange={onCalenderFilter}
											startDate={startDate}
											endDate={endDate}
											selectsRange
										/>
									)}
									name="jdDumpReportDate"
									rules={{ required: true }}
									control={control}
								/>
							</div>
						</div>
						<div>
							<button
								className={JDDUmpStyle.btnPrimary}
								onClick={() => downloadToExcel(apiData)}>
								Export
							</button>
						</div>
					</div>
				</div>
			</div>

			{/*
			 * ------------ Table Starts-----------
			 * @Table Part
			 */}
			<div className={JDDUmpStyle.tableDetails}>
				{isLoading ? (
					<TableSkeleton />
				) : (
					<>
						<Table
							className="jdDumpReport"
							id="JDDumpReport"
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
										pageSize: pageSize,
										pageIndex: pageNum,
									});
									getJDDumpReportHandler({
										...tableFilteredState,
										pageIndex: pageNum,
										pageSize: pageSize,
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
					</>
				)}
			</div>
			{isOverAllModal && (
				<Modal
					width="1200px"
					centered
					footer={false}
					open={isOverAllModal}
					onCancel={() => setOverAllModal(false)}>
					<div className={JDDUmpStyle.modalBody}>
						<label className={JDDUmpStyle.matchmakingLabel}>
							JD Efficiency Summary
						</label>
						<Divider />
						<div className={JDDUmpStyle.row}>
							<div className={JDDUmpStyle.colMd4}>
								<div
									className={`${JDDUmpStyle.transparentTopCard} ${JDDUmpStyle.overAll}`}>
									<div className={JDDUmpStyle.cardLabel}>Over All %</div>
									<hr />
									<div className={JDDUmpStyle.cardTitle}>
										{apiData?.[0]?.overAllPer
											? apiData?.[0]?.overAllPer + ' %'
											: 'NA'}
									</div>
								</div>
							</div>
							<div className={JDDUmpStyle.colMd4}>
								<div
									className={`${JDDUmpStyle.transparentTopCard} ${JDDUmpStyle.skill}`}>
									<div className={JDDUmpStyle.cardLabel}>Skill %</div>
									<hr />
									<div className={JDDUmpStyle.cardTitle}>
										{apiData?.[0]?.skillPer
											? apiData?.[0]?.skillPer + ' %'
											: 'NA'}
									</div>
								</div>
							</div>
							<div className={JDDUmpStyle.colMd4}>
								<div
									className={`${JDDUmpStyle.transparentTopCard} ${JDDUmpStyle.roleResp}`}>
									<div className={JDDUmpStyle.cardLabel}>
										Role & Responsibilities %
									</div>
									<hr />
									<div className={JDDUmpStyle.cardTitle}>
										{apiData?.[0]?.roleResPer
											? apiData?.[0]?.roleResPer + ' %'
											: 'NA'}
									</div>
								</div>
							</div>
							<div className={JDDUmpStyle.colMd4}>
								<div
									className={`${JDDUmpStyle.transparentTopCard} ${JDDUmpStyle.req}`}>
									<div className={JDDUmpStyle.cardLabel}>Requirement %</div>
									<hr />
									<div className={JDDUmpStyle.cardTitle}>
										{' '}
										{apiData?.[0]?.reqPer ? apiData?.[0]?.reqPer + ' %' : 'NA'}
									</div>
								</div>
							</div>
						</div>
					</div>
				</Modal>
			)}
			{jdSkillModal && (
				<Modal
					width="900px"
					centered
					footer={false}
					open={jdSkillModal}
					onCancel={() => setJDSkillModal(false)}>
					<br />
					<div
						className={JDDUmpStyle.modalBody}
						style={{
							display: 'flex',
							justifyContent: 'center',
							flexDirection: 'column',
							alignItems: 'center',
						}}>
						<label className={JDDUmpStyle.selectedTextModal}>
							{selectedRecord}
						</label>
						<br />
						<br />
						<div>
							<button
								className={JDDUmpStyle.btnPrimary}
								onClick={() => setJDSkillModal(false)}>
								Close
							</button>
						</div>
					</div>
				</Modal>
			)}
			{hrSkillModal && (
				<Modal
					width="900px"
					centered
					footer={false}
					open={hrSkillModal}
					onCancel={() => setHRSkillModal(false)}>
					<br />
					<div
						className={JDDUmpStyle.modalBody}
						style={{
							display: 'flex',
							justifyContent: 'center',
							flexDirection: 'column',
							alignItems: 'center',
						}}>
						<label className={JDDUmpStyle.selectedTextModal}>
							{selectedRecord}
						</label>
						<br />
						<br />
						<div>
							<button
								className={JDDUmpStyle.btnPrimary}
								onClick={() => setHRSkillModal(false)}>
								Close
							</button>
						</div>
					</div>
				</Modal>
			)}
			{jdRoleRespModal && (
				<Modal
					width="900px"
					centered
					footer={false}
					open={jdRoleRespModal}
					onCancel={() => setJDRoleRespModal(false)}>
					<br />
					<div
						className={JDDUmpStyle.modalBody}
						style={{
							display: 'flex',
							justifyContent: 'center',
							flexDirection: 'column',
							alignItems: 'center',
						}}>
						<label className={JDDUmpStyle.selectedTextModal}>
							{selectedRecord}
						</label>
						<br />
						<br />
						<div>
							<button
								className={JDDUmpStyle.btnPrimary}
								onClick={() => setJDRoleRespModal(false)}>
								Close
							</button>
						</div>
					</div>
				</Modal>
			)}
			{hrRoleRespModal && (
				<Modal
					width="900px"
					centered
					footer={false}
					open={hrRoleRespModal}
					onCancel={() => setHRRoleRespModal(false)}>
					<br />
					<div
						className={JDDUmpStyle.modalBody}
						style={{
							display: 'flex',
							justifyContent: 'center',
							flexDirection: 'column',
							alignItems: 'center',
						}}>
						<label className={JDDUmpStyle.selectedTextModal}>
							{selectedRecord}
						</label>
						<br />
						<br />
						<div>
							<button
								className={JDDUmpStyle.btnPrimary}
								onClick={() => setHRRoleRespModal(false)}>
								Close
							</button>
						</div>
					</div>
				</Modal>
			)}
			{jdReqModal && (
				<Modal
					width="900px"
					centered
					footer={false}
					open={jdReqModal}
					onCancel={() => setJDReqModal(false)}>
					<br />
					<div
						className={JDDUmpStyle.modalBody}
						style={{
							display: 'flex',
							justifyContent: 'center',
							flexDirection: 'column',
							alignItems: 'center',
						}}>
						<label className={JDDUmpStyle.selectedTextModal}>
							{selectedRecord}
						</label>
						<br />
						<br />
						<div>
							<button
								className={JDDUmpStyle.btnPrimary}
								onClick={() => setJDReqModal(false)}>
								Close
							</button>
						</div>
					</div>
				</Modal>
			)}
			{hrReqModal && (
				<Modal
					width="900px"
					centered
					footer={false}
					open={hrReqModal}
					onCancel={() => setHRReqModal(false)}>
					<br />
					<div
						className={JDDUmpStyle.modalBody}
						style={{
							display: 'flex',
							justifyContent: 'center',
							flexDirection: 'column',
							alignItems: 'center',
						}}>
						<label className={JDDUmpStyle.selectedTextModal}>
							{selectedRecord}
						</label>
						<br />
						<br />
						<div>
							<button
								className={JDDUmpStyle.btnPrimary}
								onClick={() => setHRReqModal(false)}>
								Close
							</button>
						</div>
					</div>
				</Modal>
			)}
		</div>
	);
};

export default JDDumpReportScreen;
