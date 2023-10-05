import { ReactComponent as EditSVG } from 'assets/svg/edit.svg';
import { useState } from 'react';
export const MasterConfig = {
	countryTable: () => {
		return [
			{
				title: 'Country Name',
				dataIndex: 'countryName',
				key: 'countryName',
				align: 'left',
			},
			{
				title: 'Country Region',
				dataIndex: 'countryRegion',
				key: 'countryRegion',
				align: 'left',
			},
		];
	},
	currencyTable: (setEditExchangeRate, setExchangeRateToEdit) => {
		return [
			{
				title: ' ',
				dataIndex: 'id',
				key: 'id',
				align: 'left',
				render: (data, param) => {
					return (
						<a href="javascript:void(0);" onClick={() => {
							setEditExchangeRate(true);
							setExchangeRateToEdit(param);
						}}>
							<EditSVG />
						</a>
					);
				},
			},
			{
				title: 'Currency Code',
				dataIndex: 'currencyCode',
				key: 'currencyCode',
				align: 'left',
			},
			{
				title: 'Currency Sign',
				dataIndex: 'currencySign',
				key: 'currencySign',
				align: 'left',
			},
			{
				title: 'Exchange Rate',
				dataIndex: 'exchangeRate',
				key: 'exchangeRate',
				align: 'left',
			},
		];
	},
	roleTable:(onIsActiveSelect,ControlledRoleComp,isCanAddRole,handleInactiveRole) => {
		return [
			{
				title: 'Pitch Me RoleID',
				dataIndex: 'pitchMeRoleID',
				key: 'pitchMeRoleID',
				width:'10%',
				align: 'left',
				render:(text)=>{
					return text ? text : 'NA'
				}
			},
			{
				title: <div style={{paddingLeft:'40px'}}>Role</div>,
				dataIndex: 'talentRole',
				key: 'talentRole',
				width:'50%',
				align: 'left',
				render:(text,values)=>{
					return <ControlledRoleComp text={text} values={values} />
				}
			},
			{
				title: 'Is Active',
				dataIndex: 'isActive',
				key: 'isActive',
				width:'10%',
				align: 'left',
				render: (data, param) => {	
					if(isCanAddRole){
						return (						
						data ? <a onClick={() => handleInactiveRole(param)}>Yes</a> : <a onClick={() => onIsActiveSelect(param.id , true)}>No</a>
					)
					}
					return data ? "Yes" : "No";
				},
			},
		];
	}
};
