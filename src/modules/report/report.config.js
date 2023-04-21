import { Tooltip } from 'antd';

export const reportConfig = {
	demandFunnelTable: (demandTable) => {
		let tableHeader = Object?.keys(demandTable?.[0] || {});
		return tableHeader?.map((item, index) => {
			return {
				title: item,
				dataIndex: item,
				key: item,
				align: 'left',
				ellipsis: {
					showTitle: false,
				},
				width: 250,

				render: (data) => (
					<Tooltip
						placement="bottomLeft"
						title={data}>
						{item === 'Stage' || item === 'Duration' ? (
							<p style={{ fontWeight: '550' }}>{data}</p>
						) : (
							<p style={{ textDecoration: 'underline' }}>{data}</p>
						)}
					</Tooltip>
				),
			};
		});
	},

	viewSummaryDemandFunnel: (viewSummary) => {
		let tableHeader = Object?.keys(viewSummary?.[0] || {});
		return tableHeader?.map((item) => {
			return {
				title: item,
				dataIndex: item,
				key: item,
				align: 'left',
				ellipsis: {
					showTitle: false,
				},
				width: 250,
				render: (data) => (
					<Tooltip
						placement="bottomLeft"
						title={data}>
						{item === 'Stage' || item === 'Duration' ? (
							<p style={{ fontWeight: '550' }}>{data}</p>
						) : (
							<p>{data}</p>
						)}
					</Tooltip>
				),
			};
		});
	},
	demandReportFilterListConfig: () => {
		return [
			{ name: 'Hiring Need' },
			{ name: ' Working Mode' },
			{ name: 'HR Type' },
			{ name: 'Company Category' },
			{ name: 'Replacement' },
			{ name: 'Head' },
			{ name: 'Action/HR' },
		];
	},
	demandReportFilterTypeConfig: (filterList) => {
		console.log(filterList, '--filterList');
		return [
			{
				label: 'Hiring Need',
				name: 'HiringNeed',
				child: filterList?.HiringNeed,
				isSearch: false,
			},
		];
	},
};
