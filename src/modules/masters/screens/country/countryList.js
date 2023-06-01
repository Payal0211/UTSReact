import CountryListStyle from './countryList.module.css';
import { Modal, Table } from 'antd';
import 'react-datepicker/dist/react-datepicker.css';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { HTTPStatusCode } from 'constants/network';
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton';
import { MasterDAO } from 'core/master/masterDAO';
import { MasterConfig } from 'modules/masters/masterConfig';
import { MasterUtils } from 'modules/masters/masterUtils';
import AddCountry from 'modules/masters/components/addCountry/addCountry';

const CountryList = () => {
	const [isAddCountryModal, setAddCountryModal] = useState(false);
	const [tableFilteredState, setTableFilteredState] = useState({
		PageIndex: 1,
		PageSize: 100,
		SortExpression: '',
		SortDirection: '',
	});

	const [apiData, setApiData] = useState([]);
	const [isLoading, setLoading] = useState(false);
	const pageSizeOptions = [100, 200, 300, 500];
	const [pageIndex, setPageIndex] = useState(1);
	const [totalRecords, setTotalRecords] = useState(0);
	const [pageSize, setPageSize] = useState(100);

	const getCountryListHandler = useCallback(async (tableData) => {
		setLoading(true);
		let response = await MasterDAO.getCountryListRequestDAO(tableData);

		if (response?.statusCode === HTTPStatusCode.OK) {
			setLoading(false);
			setApiData(
				MasterUtils.countryListFormatter(
					response && response?.responseBody?.details,
				),
			);
			setTotalRecords(response?.responseBody?.details?.totalrows);
		} else {
			setLoading(false);
			setApiData([]);
		}
	}, []);

	const tableColumnsMemo = useMemo(() => MasterConfig.countryTable(), []);

	useEffect(() => {
		getCountryListHandler();
	}, [getCountryListHandler]);

	return (
		<div className={CountryListStyle.hiringRequestContainer}>
			<div className={CountryListStyle.addnewHR}>
				<div className={CountryListStyle.hiringRequest}>Country List</div>
				<div>
					<button
						className={CountryListStyle.btnPrimary}
						onClick={() => setAddCountryModal(true)}>
						Add Country
					</button>
				</div>
			</div>
			<br />
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
										PageSize: pageSize,
										PageIndex: pageNum,
									});
									getCountryListHandler({
										...tableFilteredState,
										PageIndex: pageNum,
										PageSize: pageSize,
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
			{isAddCountryModal && (
				<Modal
					transitionName=""
					width="700px"
					centered
					footer={null}
					open={isAddCountryModal}
					className="statusModalWrap"
					onCancel={() => setAddCountryModal(false)}>
					<AddCountry
						setAddCountryModal={setAddCountryModal}
						onCancel={() => setAddCountryModal(false)}
						callAPI={getCountryListHandler}
						tableFilteredState={tableFilteredState}
					/>
				</Modal>
			)}
		</div>
	);
};

export default CountryList;
