import { Tooltip } from 'antd';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';

export const reportConfig = {
	/**------------- DEMAND FUNNEL REPORT------------------  */
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
					return (
						<Tooltip
							placement="bottomLeft"
							title={data}>
							{item === 'Stage' || item === 'Duration' ? (
								<p style={{ fontWeight: '550' }}>{data}</p>
							) : (
								<p
									style={{
										textDecoration: 'underline',
										cursor: data === 0 ? 'no-drop' : 'pointer',
									}}
									onClick={
										data === 0
											? null
											: () => {
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
											  }
									}>
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
	demandFunnelHRDetails: (stage) => {
		return stage === 'HR Lost'
			? [
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
			  ]
			: [
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
						title:
							stage === 'TR Required' ||
							stage === 'TR Accepted' ||
							stage === 'HR - Waiting For More Information'
								? '# of TR'
								: 'Talent Name',
						dataIndex: 'talentName',
						key: 'talentName',
						align: 'left',
						width: 250,
					},
			  ];
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
	/**------------- SUPPLY FUNNEL REPORT------------------  */
	supplyFunnelTable: (
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
	SupplyReportFilterListConfig: () => {
		return [
			{ name: 'Hiring Need' },
			{ name: ' Working Mode' },
			{ name: 'HR Type' },
			{ name: 'Company Category' },
			{ name: 'Managed' },
			{ name: 'Replacement' },
			{ name: 'Head' },
			{ name: 'Action/HR' },
		];
	},
	SupplyReportFilterTypeConfig: (filterList) => {
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
				label: 'Managed',
				name: 'managed',
				child: filterList?.Managed?.filter(
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
	/**------------- TEAM DEMAND FUNNEL REPORT------------------  */
	TeamDemandReportFilterListConfig: () => {
		return [
			{ name: 'Hiring Need' },
			{ name: ' Working Mode' },
			{ name: 'HR Type' },
			{ name: 'Company Category' },
		];
	},
	TeamDemandReportFilterTypeConfig: (filterList) => {
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
		];
	},
	/**----------------- JD DUMP REPORT ------------------------------- */
	JDDumpTableConfig: (
		setJDSkillModal,
		setHRSkillModal,
		setJDRoleRespModal,
		setHRRoleRespModal,
		setJDReqModal,
		setHRReqModal,
		setSelectedRecord,
	) => {
		return [
			{
				title: 'HR Created Date',
				dataIndex: 'hrCreatedDate',
				key: 'hrCreatedDate',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text ? text : 'NA'}</Fragment>;
				},
			},
			{
				title: 'HR Number',
				dataIndex: 'hrNumber',
				key: 'hrNumber',
				align: 'left',
				render: (text) => <Fragment key={text}>{text ? text : 'NA'}</Fragment>,
				// render: (text) => {
				// 	return text ? (
				// 		<Link
				// 			to={`/deal/${text}`}
				// 			style={{ color: 'black', textDecoration: 'underline' }}>
				// 			{text}
				// 		</Link>
				// 	) : (
				// 		'NA'
				// 	);
				// },
			},
			{
				title: 'JD',
				dataIndex: 'jd',
				key: 'jd',
				align: 'left',
				render: (text) => {
					return text ? (
						<Link
							to={`#`}
							style={{ color: 'black', textDecoration: 'underline' }}>
							View ID
						</Link>
					) : (
						'NA'
					);
				},
			},
			{
				title: 'Over All %',
				dataIndex: 'overAllPercentage',
				key: 'overAllPercentage',
				align: 'left',
				render: (text) => {
					return text ? text : 'NA';
				},
			},
			{
				title: 'Skill %',
				dataIndex: 'skillPercentage',
				key: 'skillPercentage',
				align: 'left',
				render: (text) => {
					return text ? text : 'NA';
				},
			},
			{
				title: 'Role Resp %',
				dataIndex: 'rolesResponsibilitiesPercentage',
				key: 'rolesResponsibilitiesPercentage',
				align: 'left',
				render: (text) => {
					return text ? text : 'NA';
				},
			},
			{
				title: 'Req %',
				dataIndex: 'requirementPercentage',
				key: 'requirementPercentage',
				align: 'left',
				render: (text) => {
					return text ? text : 'NA';
				},
			},
			{
				title: 'JD Skill',
				dataIndex: 'jdDumpSkill',
				key: 'jdDumpSkill',
				align: 'left',
				render: (text) => {
					return text ? (
						<p
							onClick={() => {
								setJDSkillModal(true);
								setSelectedRecord(text);
							}}
							style={{ color: 'black', textDecoration: 'underline' }}>
							View JD Skill
						</p>
					) : (
						'NA'
					);
				},
			},
			{
				title: 'HR Skill',
				dataIndex: 'hrSkill',
				key: 'hrSkill',
				align: 'left',
				render: (text) => {
					return text ? (
						<p
							onClick={() => {
								setHRSkillModal(true);
								setSelectedRecord(text);
							}}
							style={{ color: 'black', textDecoration: 'underline' }}>
							View HR Skill
						</p>
					) : (
						'NA'
					);
				},
			},
			{
				title: 'JD Roles & Resp',
				dataIndex: 'jdDumpRolesResponsibilities',
				key: 'jdDumpRolesResponsibilities',
				align: 'left',
				render: (text) => {
					return text ? (
						<p
							onClick={() => {
								setJDRoleRespModal(true);
								setSelectedRecord(text);
							}}
							style={{ color: 'black', textDecoration: 'underline' }}>
							View JD Roles & Responsibilities
						</p>
					) : (
						'NA'
					);
				},
			},
			{
				title: 'HR Roles & Resp',
				dataIndex: 'hrRolesResponsibilities',
				key: 'hrRolesResponsibilities',
				align: 'left',
				render: (text) => {
					return text ? (
						<p
							onClick={() => {
								setHRRoleRespModal(true);
								setSelectedRecord(text);
							}}
							style={{ color: 'black', textDecoration: 'underline' }}>
							View HR Roles & Responsibilities
						</p>
					) : (
						'NA'
					);
				},
			},
			{
				title: 'JD Req',
				dataIndex: 'jdRequirement',
				key: 'jdRequirement',
				align: 'left',
				render: (text) => {
					return text ? (
						<p
							onClick={() => {
								setJDReqModal(true);
								setSelectedRecord(text);
							}}
							style={{ color: 'black', textDecoration: 'underline' }}>
							View JD Requirement
						</p>
					) : (
						'NA'
					);
				},
			},
			{
				title: 'HR Req',
				dataIndex: 'hrRequirement',
				key: 'hrRequirement',
				align: 'left',
				render: (text) => {
					return text ? (
						<p
							onClick={() => {
								setHRReqModal(true);
								setSelectedRecord(text);
							}}
							style={{ color: 'black', textDecoration: 'underline' }}>
							View HR Requirement
						</p>
					) : (
						'NA'
					);
				},
			},
		];
	},
};
