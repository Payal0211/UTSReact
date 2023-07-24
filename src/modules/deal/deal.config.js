import HRStatusComponent from 'modules/hiring request/components/hrStatus/hrStatusComponent';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { _isNull } from 'shared/utils/basic_utils';
import UTSRoutes from 'constants/routes';
import DealListStyle from './dealStyle.module.css';

export const DealConfig = {
	tableConfig: (navigate) => {
		return [
			{
				title: 'Date',
				dataIndex: 'dealDate',
				key: 'dealDate',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text ? text : 'NA'}</Fragment>;
				},
			},
			{
				title: 'Deal Name',
				dataIndex: 'dealName',
				key: 'dealName',
				align: 'left',
				render: (text) => {
					return text ? text : 'NA';
				},
			},
			{
				title: 'Deal ID',
				dataIndex: 'dealID',
				key: 'dealID',
				align: 'left',
				render: (text) => {
					return text ? (
						<Link
							to={`/deal/${text}`}
							style={{ color: 'black', textDecoration: 'underline' }}>
							{text}
						</Link>
						// text
					) : (
						'NA'
					);
				},
			},
			{
				title: 'Lead Source',
				dataIndex: 'lead_Type',
				key: 'lead_Type',
				align: 'left',
				render: (text) => {
					return text ? text : 'NA';
				},
			},
			{
				title: 'Pipeline',
				dataIndex: 'pipeline',
				key: 'pipeline',
				align: 'left',
				render: (text) => {
					return text ? text : 'NA';
				},
			},
			// {
			// 	title: 'Company',
			// 	dataIndex: 'company',
			// 	key: 'company',
			// 	align: 'left',
			// 	render: (text) => {
			// 		return text ? text : 'NA';
			// 	},
			// },
			{
				title: 'Geo',
				dataIndex: 'geo',
				key: 'geo',
				align: 'left',
				render: (text) => {
					return text ? text : 'NA';
				},
			},
			{
				title: 'BDR',
				dataIndex: 'bdr',
				key: 'bdr',
				align: 'left',
				render: (text) => {
					return text ? text : 'NA';
				},
			},
			{
				title: 'Sales Consultant',
				dataIndex: 'sales_consultant',
				key: 'sales_consultant',
				align: 'left',
				render: (text) => {
					return text ? text : 'NA';
				},
			},
			{
				title: 'Deal Stage',
				dataIndex: 'dealStage',
				key: 'dealStage',
				align: 'left',
				render: (text, param) => {
					return _isNull(text) ? (
						'NA'
					) : text === "SAL Achieved" ? 
				<button
				className={DealListStyle.createHR}
				type="button"
				onClick={() => {navigate(UTSRoutes.ADDNEWHR) ;localStorage.setItem('dealID',param.dealID); localStorage.removeItem('hrID') }}>
				Create HR
				</button>
				: (
						<HRStatusComponent
							title={text}
							backgroundColor={param.dealStageColorCode}
							color={'#4E5063'}
						/>
					);
				},
			},
			// {
			// 	title: 'Convert to HR',
			// 	dataIndex: 'convert',
			// 	key: 'convert',
			// 	align: 'left',
			// 	render: (text, results) => {
			// 		return results.dealStage === "SAL Achieved" ? (
			// 			<Link
			// 				to={UTSRoutes.ADDNEWHR}
			// 				style={{ color: 'black', textDecoration: 'underline' }}
			// 				onClick={()=> {localStorage.setItem('dealID',results.dealID); localStorage.removeItem('hrID')}}
			// 				>
			// 				Convert To HR
			// 			</Link>
			// 			// text
			// 		) : null;
			// 	},
			// },
		];
	},
	dealFiltersListConfig: () => {
		return [
			{ name: 'Inbound' },
			{ name: 'Outbound' },
			{ name: 'USA' },
			{ name: 'Kirti Sharma' },
			{ name: 'No Show' },
		];
	},
	dealFilterTypeConfig: (filtersList) => {
		return [
			// {
			// 	label: 'Deal ID',
			// 	name: 'deal_Id',
			// 	child: filtersList?.DealId,
			// 	isSearch: false,
			// },
			{
				label: 'Lead Source',
				name: 'lead_Type',
				child: filtersList?.LeadSource,
				isSearch: false,
			},
			{
				label: 'Pipeline',
				name: 'pipeline',
				child: filtersList?.Pipeline,
				isSearch: false,
			},
			// {
			// 	label: 'Company',
			// 	name: 'company',
			// 	child: filtersList?.Company,
			// 	isSearch: true,
			// },
			{ label: 'Geo', name: 'geo', child: filtersList?.Geo, isSearch: true },
			{ label: 'BDR', name: 'bdr', child: filtersList?.BDR, isSearch: false },
			{
				label: 'Sales Consultant',
				name: 'sales_Consultant',
				child: filtersList?.SalesConsultant,
				isSearch: true,
			},
			{
				label: 'Deal Stage',
				name: 'dealStage',
				child: filtersList?.DealStage,
				isSearch: true,
			},
		];
	},
};
