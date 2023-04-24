import { Tooltip } from 'antd';

export const reportConfig = {
	demandFunnelTable: (
		demandTable,
		demanFunnelModal,
		setDemandFunnelModal,
		setDemandFunnelHRDetailsState,
		demandFunnelHRDetailsState,
		setDemandFunnelValue,
	) => {
		let tableHeader = Object?.keys(demandTable?.[0] || {});

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
				render: (data, param) => {
					console.log(param, '--param');
					return (
						<Tooltip
							placement="bottomLeft"
							title={data}>
							{item === 'Stage' || item === 'Duration' ? (
								<p style={{ fontWeight: '550' }}>{data}</p>
							) : (
								<p
									style={{ textDecoration: 'underline' }}
									onClick={() => {
										setDemandFunnelHRDetailsState({
											...demandFunnelHRDetailsState,
											adhocType: item === 'Final Total' ? '' : 'Total',
											TeamManagerName: item === 'Final Total' ? '' : item,
											currentStage: param.Stage,
											IsExport: false,
										});
										setDemandFunnelValue({
											stage: param?.Stage,
											count: data,
										});
										setDemandFunnelModal(true);
									}}>
									{data}
								</p>
							)}
						</Tooltip>
					);
				},
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
	demandFunnelHRDetails: [
		{
			title: 'HR#',
			dataIndex: 'hR_No',
			key: 'hR_No',
			align: 'left',
			width: 250,
		},
		{
			title: 'Sales Person',
			dataIndex: 'salesPerson',
			key: 'salesPerson',
			align: 'left',
			width: 250,
		},
		{
			title: 'Company Name',
			dataIndex: 'compnayName',
			key: 'compnayName',
			align: 'left',
			width: 250,
		},
		{
			title: 'Role',
			dataIndex: 'role',
			key: 'role',
			align: 'left',
			width: 250,
		},
		{
			title: 'Managed/Self',
			dataIndex: 'managed_Self',
			key: 'managed_Self',
			align: 'left',
			width: 250,
		},
		{
			title: 'Availability',
			dataIndex: 'availability',
			key: 'availability',
			align: 'left',
			width: 250,
		},
		{
			title: '# of TR',
			dataIndex: 'talentName',
			key: 'talentName',
			align: 'left',
			width: 250,
		},
	],
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
		return [
			{
				label: 'Hiring Need',
				name: 'isHiringNeedTemp',

				child: [
					{
						disabled: false,
						group: null,
						selected: false,
						text: '1',
						value: 'For limited project',
					},
					{
						disabled: false,
						group: null,
						selected: false,
						text: '2',
						value: 'For long project',
					},
				],
				isSearch: false,
			},
			{
				label: 'Working Mode',
				name: 'modeOfWork',
				child: filterList?.ModeOfWorking?.filter(
					(item, index) => index !== 0 && item,
				),
			},
			{
				label: 'HR Type',
				name: 'typeOfHR',
				child: filterList?.TypeOfHR?.filter(
					(item, index) => index !== 0 && item,
				),
			},
			{
				label: 'Company',
				name: 'companyCategory',
				child: filterList?.CompanyCategory?.filter(
					(item, index) => index !== 0 && item,
				),
			},
			{
				label: 'Replacement',
				name: 'replacement',
				child: filterList?.Replacement,
			},
			{
				label: 'Head',
				name: 'head',
				child: filterList?.TeamManager,
			},
			{
				label: 'Action/HR',
				name: 'isActionWise',
				child: [
					{
						disabled: false,
						group: null,
						selected: false,
						text: '1',
						value: 'Action Wise Data',
					},
					{
						disabled: false,
						group: null,
						selected: false,
						text: '0',
						value: 'HR Wise Data',
					},
				],
			},
		];
	},
};
