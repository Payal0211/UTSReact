
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CurrencyListStyle from '../currency/currencyList.module.css';
import { MasterConfig } from 'modules/masters/masterConfig';
import { Table,Modal } from 'antd';
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton';
import { MasterDAO } from 'core/master/masterDAO';
import { HTTPStatusCode } from 'constants/network';
import { ReactComponent as SearchSVG } from 'assets/svg/search.svg';
import { InputType } from 'constants/application';
import { downloadToExcel } from 'modules/report/reportUtils';
import AddNewRole from './addRoleModal';

const RoleList = () => {	
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
	const [isCanAddRole,setIsCanAddRole] = useState(false)
	const [addRole,setAddRole] = useState(false)

    const _tableFilteredStateRef = useRef();
    _tableFilteredStateRef.current = tableFilteredState;
    const pageSizeOptions = [100, 200, 300, 500];
    const onIsActiveSelect = async (id,isActive) => {
        setLoading(true);
        let response = await MasterDAO.updateTalentRoleStatus(
            id,
			isActive,
		);        
        if(response.statusCode === HTTPStatusCode.OK){
            getRolesListHandler(_tableFilteredStateRef.current);
        }
        setLoading(false);	
    }
    const tableColumnsMemo = useMemo(
		() =>
			MasterConfig.roleTable(onIsActiveSelect),
		[],
	);

    const getRolesListHandler = useCallback(async (tableData) => {
		setLoading(true);
		let response = await MasterDAO.getRolesListRequestDAO(
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
		getRolesListHandler(tableFilteredState);
	}, [getRolesListHandler,tableFilteredState]);

	const reloadList = () => {
		getRolesListHandler(tableFilteredState);
	}

	const getAddPermission = async ()=>{
		let result = await MasterDAO.getRightsForAddDAO()
		if(result.statusCode === 200){
			setIsCanAddRole(result.responseBody.details)
		}
	}

	useEffect(()=>{
		getAddPermission()
	},[])

    const onSearch = (e) => {
        setTableFilteredState({...tableFilteredState,searchText:e.target.value});
        setPageIndex(1);        
    } 
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
					Roles List
				</div>
                <div className={CurrencyListStyle.headerContainer}>              
					<div className={CurrencyListStyle.searchFilterSet}>
						<SearchSVG style={{ width: '16px', height: '16px' }} />
						<input
							type={InputType.TEXT}
							placeholder="Search via role"
							onChange={onSearch}
							value={tableFilteredState.searchText}
							className={CurrencyListStyle.searchInput}
						/>
					</div>
					{isCanAddRole && <div>
						<button
							className={CurrencyListStyle.btnPrimary}								
							onClick={() =>setAddRole(true)}>
							Add New Role
						</button>
					</div>}
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
									getRolesListHandler({
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

			<Modal
          width={"864px"}
          centered
          footer={false}
          open={addRole}
          className="changeDateModal"
          onCancel={() => setAddRole(false)}
        >
			<AddNewRole onCancel={()=> setAddRole(false)} reloadList={reloadList}/>
		</Modal>	
		</div>
	);
};

export default RoleList;
