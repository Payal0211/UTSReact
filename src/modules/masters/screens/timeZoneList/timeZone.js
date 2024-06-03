import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CurrencyListStyle from '../currency/currencyList.module.css';
import { ReactComponent as SearchSVG } from 'assets/svg/search.svg';
import { InputType } from 'constants/application';
import { downloadToExcel } from 'modules/report/reportUtils';
import { MasterConfig } from 'modules/masters/masterConfig';
import { Table, message } from 'antd';
import { MasterDAO } from 'core/master/masterDAO';
import { HTTPStatusCode } from 'constants/network';
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton';
import { ReactComponent as EditSVG } from "assets/svg/EditField.svg";
import { ReactComponent as TickMark } from "assets/svg/assignCurrect.svg";
import { ReactComponent as Close } from "assets/svg/close.svg";
import WithLoader from 'shared/components/loader/loader';
import LogoLoader from 'shared/components/loader/logoLoader';

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
	const[isEdit,setIsEdit] = useState(false);
	const[updatedTitle,setUpdatedTitle] = useState('');
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

	const onEditTitle = () => {
		setIsEdit(true);
	}

	const onChangeTitle = (e) => {
		setUpdatedTitle(e.target.value);
	}

	const ControlledTitleComp = ({text,values})=> {
		const [isEdit,setIsEdit] = useState(false)
		const [role,setRole] = useState(text)

		const saveEditRole = async () =>{
			if(role){
				let e = encodeURIComponent(role)
				const result = await MasterDAO.timeZoneTitleDAO({TimeZone:e,id:values.id})
				if(result?.statusCode === HTTPStatusCode.OK){
					message.success(result.responseBody.message)
					setIsEdit(false);
				}else{
					message.error(result.responseBody)
					setRole(text);
					setIsEdit(false)
				}	
			}	
	    }

		if(isEdit){
			return <div style={{display:'flex', alignItems:'center'}}>
			<TickMark
				width={24}
				height={24}
				style={{marginRight:'10px',cursor:'pointer'}}
				onClick={() => saveEditRole()}
			/>
			  <input className={CurrencyListStyle.editRoalField} style={{ border: role ? '1px solid #CECCCC' : '1px solid red'}} type ='text' value={role} onChange={e=> setRole(e.target.value)} />  
			<Close 
			width={24}
			height={24}
			style={{marginLeft:'10px',cursor:'pointer'}}
			onClick={() => {setIsEdit(false);setRole(text)}} />
			</div>
		}else {
			return <div style={{display:'flex', alignItems:'center'}}>
				<EditSVG
					width={24}
					height={24}
					style={{marginRight:'10px',cursor:'pointer'}}
					onClick={() => setIsEdit(true)}
				/> 
				{role}
		  </div>
		}
	}

    const tableColumnsMemo = useMemo(
		() =>
			MasterConfig.timeZoneTable(ControlledTitleComp),
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
			{/* <WithLoader className="pageMainLoader" showLoader={search?.length?false:isLoading}> */}
			<div className={CurrencyListStyle.addnewHR}>
				<div className={CurrencyListStyle.hiringRequest}>
					TimeZone
				</div>
				<LogoLoader visible={isLoading} />
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
		{/* </WithLoader> */}
		</div>
    )
}

export default TimeZoneList;