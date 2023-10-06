import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CurrencyListStyle from '../currency/currencyList.module.css';
import { ReactComponent as SearchSVG } from 'assets/svg/search.svg';
import { InputType } from 'constants/application';
import { downloadToExcel } from 'modules/report/reportUtils';
import { MasterConfig } from 'modules/masters/masterConfig';
import { Table } from 'antd';
import { MasterDAO } from 'core/master/masterDAO';
import { HTTPStatusCode } from 'constants/network';
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton';

const TimeZoneList = () => {
    const [isLoading, setLoading] = useState(false);
    const [apiData, setApiData] = useState([]);
    const [pageIndex, setPageIndex] = useState(1);
	const [totalRecords, setTotalRecords] = useState(0);
	const [pageSize, setPageSize] = useState(100);
    const [tableFilteredState, setTableFilteredState] = useState({
		PageIndex: 1,
		PageSize: 100,
		SortExpression: 'ID',
		SortDirection: 'DESC',
        searchText: ''
	});
	const [search,setSearch] = useState('');
    const pageSizeOptions = [100, 200, 300, 500];
    const getTimezoneListHandler = useCallback(async (tableData) => {
		setLoading(true);       
		let response = await MasterDAO.timeZoneDAO(
			tableData,
		);
		if (response?.statusCode === HTTPStatusCode.OK) {
			setLoading(false);			
            setApiData(response?.responseBody?.details?.rows);
			setTotalRecords(response?.responseBody?.details?.totalrows);
		} else {
			setLoading(false);
			setApiData([]);
		}
	}, []);

    useEffect(() => {
		getTimezoneListHandler(tableFilteredState);
	}, [getTimezoneListHandler,tableFilteredState]);



    const onSearch = (e) => {
        setTableFilteredState({...tableFilteredState,searchText:e.target.value});
		setSearch(e.target.value);
        setPageIndex(1);        
    } 

    const tableColumnsMemo = useMemo(
		() =>
			MasterConfig.timeZoneTable(),
		[],
	);


    const handleExport = (apiData) => {
		let DataToExport =  apiData.map(data => {
			let obj = {}			
			tableColumnsMemo.forEach(val => {
				if(val.dataIndex !== 'isActive'){
					obj[`${val.title}`] = data[`${val.dataIndex}`]
				}else{
					obj[`${val.title}`] = data[`${val.dataIndex}`] ? 'Yes' : 'No';
				}
				
			})		
			return obj;
			}
		 )
		downloadToExcel(DataToExport);
	}
    return (
        <div className={CurrencyListStyle.hiringRequestContainer}>
			<div className={CurrencyListStyle.addnewHR}>
				<div className={CurrencyListStyle.hiringRequest}>
					TimeZone
				</div>
                <div className={CurrencyListStyle.headerContainer}>              
					<div className={CurrencyListStyle.searchFilterSet}>
						<SearchSVG style={{ width: '16px', height: '16px' }} />
						<input
							type={InputType.TEXT}
							placeholder="Search here..."
							onChange={onSearch}
							value={search}
							className={CurrencyListStyle.searchInput}
						/>
					</div>
					
					<div>
						<button
							className={CurrencyListStyle.btnPrimary}								
							onClick={() => handleExport(apiData)}>
							Export
						</button>
					</div>
            	</div>				
			</div>
         
			<br />			
			<div className={CurrencyListStyle.tableDetails}>
				{isLoading ? (
					<TableSkeleton />
				) : (
					<>
						<Table                            
							scroll={{  y: '100vh' }}
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
									getTimezoneListHandler({
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

		{/* <Modal
          width={"864px"}
          centered
          footer={false}
          open={showInactiveModal}
          className="changeDateModal"
          onCancel={() => {setShowInactiveModal(false);resetField('role')}}
        >
			<div>
				<h3>Are you Sure You want to Inactive <b>{inactiveRoleDetails?.talentRole}</b> ? </h3>
				<div>
					<h4>Select New Role to Active</h4>
				<HRSelectField
					// controlledValue={controlledRoleValue}
					// setControlledValue={setControlledRoleValue}
					// isControlled={true}
					key={inactiveRoleDetails?.talentRole}
					mode={'id/value'}
					searchable={true}
					setValue={setValue}
					register={register}
					label={'New Role'}
					options={talentRole && talentRole}
					placeholder={"Select Role"}
					name="role"
					isError={errors['role'] && errors['role']}
					required
					errorMsg={'Please select role'}
				/>
				</div>
				<div className={CurrencyListStyle.formPanelAction} style={{justifyContent:'flex-start', padding:'6px 0'}}>
				<button
							className={CurrencyListStyle.btnPrimary}								
							onClick={handleSubmit(inactiveRoleHandler)}>
							Save
						</button>

						<button
							className={CurrencyListStyle.btn}								
							onClick={() =>{setShowInactiveModal(false);resetField('role')}}>
							Cancel
						</button>
				</div>
			</div>
		</Modal> */}
		</div>
    )
}

export default TimeZoneList;