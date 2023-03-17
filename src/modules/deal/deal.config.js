import HRStatusComponent from 'modules/hiring request/components/hrStatus/hrStatusComponent';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';

export const DealConfig = {
	tableConfig: () => {
		return [
			{
				title: 'Date',
				dataIndex: 'dealDate',
				key: 'dealDate',
				align: 'left',
				render: (text) => {
					return text ? text : 'NA';
				},
			},
			{
				title: 'Deal ID',
				dataIndex: 'deal_Id',
				key: 'deal_Id',
				align: 'left',
				render: (text) => {
					return text ? (
						<Link
							to={`/deal/${text}`}
							style={{ color: 'black', textDecoration: 'underline' }}>
							{text}
						</Link>
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
					return (
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
				name: 'dealID',
				child: [
					{
						disabled: false,
						group: null,
						selected: false,
						text: '1',
						value: 'ODR',
					},
					{
						disabled: false,
						group: null,
						selected: false,
						text: '2',
						value: 'Pool',
					},
				],
				isSearch: false,
			},
			{
				label: 'Lead Source',
				child: filtersList?.LeadSource,
				isSearch: false,
			},
			{
				label: 'Pipeline',
				child: ['3', '4', '7', '9', '10'],
				isSearch: false,
			},
			{
				label: 'Company',
				name: 'company',
				child: filtersList?.Company,
				isSearch: true,
			},
			{ label: 'Geo', child: filtersList?.Geo, isSearch: true },
			{ label: 'BDR', child: filtersList?.BDR, isSearch: false },
			{
				label: 'Sales Consultant',
				child: filtersList?.SalesConsultant,
				isSearch: true,
			},
			{ label: 'Deal Stage', child: filtersList?.DealStage, isSearch: true },
		];
	},
};
