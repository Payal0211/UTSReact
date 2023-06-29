import HRStatusComponent from 'modules/hiring request/components/hrStatus/hrStatusComponent';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { _isNull } from 'shared/utils/basic_utils';

export const DealConfig = {
	tableConfig: () => {
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
				title: 'Deal ID',
				dataIndex: 'dealID',
				key: 'dealID',
				align: 'left',
				render: (text) => {
					return text ? (
						// <Link
						// 	to={`/deal/${text}`}
						// 	style={{ color: 'black', textDecoration: 'underline' }}>
						// 	{text}
						// </Link>
						text
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
			{
				title: 'Company',
				dataIndex: 'company',
				key: 'company',
				align: 'left',
				render: (text) => {
					return text ? text : 'NA';
				},
			},
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
					) : (
						<HRStatusComponent
							title={text}
							backgroundColor={param.dealStageColorCode}
							color={'#4E5063'}
						/>
					);
				},
			},
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
			{
				label: 'Deal ID',
				name: 'deal_Id',
				child: filtersList?.DealId,
				isSearch: false,
			},
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
			{
				label: 'Company',
				name: 'company',
				child: filtersList?.Company,
				isSearch: true,
			},
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
