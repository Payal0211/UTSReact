
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CurrencyListStyle from '../currency/currencyList.module.css';
import { MasterConfig } from 'modules/masters/masterConfig';
import { Table,Modal, message } from 'antd';
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton';
import { MasterDAO } from 'core/master/masterDAO';
import { HTTPStatusCode } from 'constants/network';
import { ReactComponent as SearchSVG } from 'assets/svg/search.svg';
import { InputType } from 'constants/application';
import { downloadToExcel } from 'modules/report/reportUtils';
import AddNewRole from './addRoleModal';
import { ReactComponent as EditSVG } from "assets/svg/EditField.svg";
import { ReactComponent as TickMark } from "assets/svg/assignCurrect.svg";
import { ReactComponent as Close } from "assets/svg/close.svg";
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import { useForm } from 'react-hook-form';
import LogoLoader from 'shared/components/loader/logoLoader';

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

	const [showInactiveModal,setShowInactiveModal] = useState(false)
	const [inactiveRoleDetails,setInactiveRoleDetails] = useState(null)
	const [talentRole, setTalentRole] = useState([]);

	const {
		watch,
		register,
		handleSubmit,
		setValue,
		resetField,
		formState: { errors },
	} = useForm();

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

	const getTalentRole = useCallback(async () => {
		const talentRole = await MasterDAO.getTalentsRoleRequestDAO();
		setTalentRole(talentRole && talentRole.responseBody);
	}, []);

	useEffect(() => {
		getTalentRole()
	},[getTalentRole])

	const ControlledRoleComp = ({text,values})=> {
		const [isEdit,setIsEdit] = useState(false)
		const [role,setRole] = useState(text)

		const saveEditRole = async () =>{
			if(role){
				const result = await MasterDAO.editRoleDAO({roleName:role,id:values.id})
				if(result.statusCode === HTTPStatusCode.OK){
					message.success(result.responseBody.message)
					setIsEdit(false)
				}else{
					message.error(result.responseBody)
					setRole(text)
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

	const handleInactiveRole = (roleParam) => {
		// add code for inactive modal
		setInactiveRoleDetails(roleParam)
		setShowInactiveModal(true)
	}

	const inactiveRoleHandler = async (d)=>{
		let payload = { id:inactiveRoleDetails.id, newId: d.role.id}
		const result = await MasterDAO.updateRoleDAO(payload)
		if(result.statusCode === HTTPStatusCode.OK){
			message.success(result.responseBody.message)
			setShowInactiveModal(false)
			resetField('role')
			reloadList()
		}else{
			message.error(result.responseBody)
			// setRole(text)
			// setIsEdit(false)
		}	

	}

    const tableColumnsMemo = useMemo(
		() =>
			MasterConfig.roleTable(onIsActiveSelect,ControlledRoleComp,isCanAddRole,handleInactiveRole),
		[isCanAddRole],
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
				<LogoLoader visible={isLoading} />
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

		<Modal
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
		</Modal>
		</div>
	);
};

export default RoleList;
