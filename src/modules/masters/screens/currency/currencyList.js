import CurrencyListStyle from './currencyList.module.css';
import { Modal, Table } from 'antd';
import 'react-datepicker/dist/react-datepicker.css';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { HTTPStatusCode } from 'constants/network';
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton';
import { MasterDAO } from 'core/master/masterDAO';
import { MasterConfig } from 'modules/masters/masterConfig';
import { MasterUtils } from 'modules/masters/masterUtils';
import AddCountry from 'modules/masters/components/addCountry/addCountry';
import UpdateExchangeRate from 'modules/masters/components/updateCurrencyExchangeRate/updateCurrencyExchangeRate';
import WithLoader from 'shared/components/loader/loader';
import LogoLoader from 'shared/components/loader/logoLoader';

const CurrencyList = () => {
	const [isEditExchangeRate, setEditExchangeRate] = useState(false);
	const [tableFilteredState, setTableFilteredState] = useState({
		PageIndex: 1,
		PageSize: 100,
		SortExpression: '',
		SortDirection: '',
	});

	const [exchangeRateToEdit, setExchangeRateToEdit] = useState(null);
	const [apiData, setApiData] = useState([]);
	const [isLoading, setLoading] = useState(false);
	const pageSizeOptions = [100, 200, 300, 500];
	const [pageIndex, setPageIndex] = useState(1);
	const [totalRecords, setTotalRecords] = useState(0);
	const [pageSize, setPageSize] = useState(100);

	const getCurrencyListHandler = useCallback(async (tableData) => {
		setLoading(true);
		let response = await MasterDAO.getCurrencyExchangeRateListRequestDAO(
			tableData,
		);

		if (response?.statusCode === HTTPStatusCode.OK) {
			setLoading(false);
			setApiData(
				MasterUtils.currencyListFormatter(
					response && response?.responseBody?.details,
				),
			);
			setTotalRecords(response?.responseBody?.details?.totalrows);
		} else {
			setLoading(false);
			setApiData([]);
		}
	}, []);

	const tableColumnsMemo = useMemo(
		() =>
			MasterConfig.currencyTable(setEditExchangeRate, setExchangeRateToEdit),
		[],
	);

	useEffect(() => {
		getCurrencyListHandler();
	}, [getCurrencyListHandler]);

	return (
		<div className={CurrencyListStyle.hiringRequestContainer}>
			{/* <WithLoader className="pageMainLoader" showLoader={isLoading}> */}
			<div className={CurrencyListStyle.addnewHR}>
				<div className={CurrencyListStyle.hiringRequest}>
					Currency Exchange List
				</div>
				<LogoLoader visible={isLoading} />
			</div>
			<br />
			{/*
			 * ------------ Table Starts-----------
			 * @Table Part
			 */}
			<div className={CurrencyListStyle.tableDetails}>
				{isLoading ? (
					<TableSkeleton />
				) : (
					<>
						<Table
							scroll={{ x: '100vw', y: '100vh' }}
							className="currencyExchangeList"
							id="currencyExchangeList"
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
									getCurrencyListHandler({
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
			{isEditExchangeRate && (
				<Modal
					transitionName=""
					width="700px"
					centered
					footer={null}
					open={isEditExchangeRate}
					className="statusModalWrap"
					onCancel={() => setEditExchangeRate(false)}>
					<UpdateExchangeRate
						setAddCountryModal={setEditExchangeRate}
						onCancel={() => setEditExchangeRate(false)}
						callAPI={getCurrencyListHandler}
						tableFilteredState={tableFilteredState}
						exchangeRateToEdit={exchangeRateToEdit}
					/>
				</Modal>
			)}
		{/* </WithLoader> */}
		</div>
	);
};

export default CurrencyList;
