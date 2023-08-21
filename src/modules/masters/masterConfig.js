import { ReactComponent as EditSVG } from 'assets/svg/edit.svg';
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
	roleTable:(onIsActiveSelect) => {
		return [
			{
				title: 'Pitch Me Role',
				dataIndex: 'pitchMeRole',
				key: 'pitchMeRole',
				align: 'left',
			},
			{
				title: 'Role',
				dataIndex: 'talentRole',
				key: 'talentRole',
				align: 'left',
			},
			{
				title: 'Is Active',
				dataIndex: 'isActive',
				key: 'isActive',
				align: 'left',
				render: (data, param) => {	
					return (						
						!data ? <a onClick={() => onIsActiveSelect(param.id , true)}>Yes</a> : <a onClick={() => onIsActiveSelect(param.id , false)}>No</a>
					);
				},
			},
		];
	}
};
