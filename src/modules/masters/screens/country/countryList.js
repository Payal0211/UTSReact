import CountryListStyle from './countryList.module.css';
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
import { MasterDAO } from 'core/master/masterDAO';

const CountryList = () => {
	const [tableFilteredState, setTableFilteredState] = useState({
		pageIndex: 1,
		pageSize: 100,
		sortExpression: '',
		sortDirection: 'desc',
	});

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
	const getCountryListHandler = useCallback(async (tableData) => {
		setLoading(true);
		let response = await MasterDAO.getCountryListRequestDAO(tableData);

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

	return (
		<div className={CountryListStyle.hiringRequestContainer}>
			<div className={CountryListStyle.addnewHR}>
				<div className={CountryListStyle.hiringRequest}>Country List</div>
			</div>
			{/*
			 * --------- Filter Component Starts ---------
			 * @Filter Part
			 */}
			<div className={CountryListStyle.filterContainer}>
				<div className={CountryListStyle.filterSets}>
					<div className={CountryListStyle.filterRight}>
						<div>
							<button
								className={CountryListStyle.btnPrimary}
								onClick={() => downloadToExcel(apiData)}>
								Add Country
							</button>
						</div>
					</div>
				</div>
			</div>

			{/*
			 * ------------ Table Starts-----------
			 * @Table Part
			 */}
			<div className={CountryListStyle.tableDetails}>
				{isLoading ? (
					<TableSkeleton />
				) : (
					<>
						<Table
							className="jdDumpReport"
							id="JDDumpReport"
							columns={tableColumnsMemo}
							bordered={false}
							dataSource={[...apiData]}
							pagination={{
								onChange: (pageNum, pageSize) => {
									setPageIndex(pageNum);
									setPageSize(pageSize);
									setTableFilteredState({
										...tableFilteredState,
										pageSize: pageSize,
										pageIndex: pageNum,
									});
									getCountryListHandler({
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
		</div>
	);
};

export default CountryList;
