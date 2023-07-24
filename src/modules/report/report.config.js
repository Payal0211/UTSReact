import { Tooltip } from 'antd';
import { HiringRequestHRStatus } from 'constants/application';
import { NetworkInfo } from 'constants/network';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import infoIcon from 'assets/svg/info.svg'

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
			: stage !== 'HR Accepted' ? [
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
							stage === 'TR Accepted' || stage === 'TR Cancelled' || stage === 'TR Lost' || stage === 'HR Accepted' ||
							stage === 'HR - Waiting For More Information'
								? '# of TR'
								: 'Talent Name',
						dataIndex: 'talentName',
						key: 'talentName',
						align: 'left',
						width: 250,
					},
			  ] :
			  [
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
				isSearch: true,
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

	SLAReportConfig: (_, slaValue) => {
		return [
			{
				title: 'Stage',
				dataIndex: 'summaryStage',
				key: 'hrCreatedDate',
				align: 'left',
				render: (text, result) => {
					return <Fragment key={text}><div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
						 {text} 
						 <Tooltip
							placement="right"
							title={result.extraActionsIncluded}>
							<img src={infoIcon} alt='info' />
						</Tooltip>
						</div></Fragment>;
				},
			},
			{
				title: 'Version',
				dataIndex: 'stageVersion',
				key: 'hrCreatedDate',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text}</Fragment>;
				},
			},
			{
				title: 'Expected SLA',
				dataIndex: 'slaDays',
				key: 'hrCreatedDate',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text}</Fragment>;
				},
			},
			{
				title: 'Avg SLA',
				dataIndex: slaValue === 0 ? 'avgSLAOverall' : 'avgSLAMissed',
				key: 'hrCreatedDate',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text}</Fragment>;
				},
			},
			{
				title: 'Diff SLA',
				dataIndex: slaValue === 0 ? 'diffOfSLAOverall' : 'diffOfSLAMissed',
				key: 'hrCreatedDate',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text}</Fragment>;
				},
			},
		];
	},
	SLAReportDetailListConfig: () => {
		return [
			{
				title: 'HR#',
				dataIndex: 'hR_NUmber',
				key: 'hrCreatedDate',
				align: 'left',
				render: (text, param) => {
					return (
						<p
							key={text}
							style={{
								background: param?.isWeekEndSkip ? '#EE442D' : 'transparent',
								color: param?.isWeekEndSkip ? 'white' : 'black',
							}}>
							{text}
						</p>
					);
				},
			},
			{
				title: 'Role',
				dataIndex: 'role',
				key: 'hrCreatedDate',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text}</Fragment>;
				},
			},
			{
				title: 'Company',
				dataIndex: 'company',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text}</Fragment>;
				},
			},
			{
				title: 'Client',
				dataIndex: 'client',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text}</Fragment>;
				},
			},
			{
				title: 'Talent',
				dataIndex: 'talentName',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text}</Fragment>;
				},
			},
			// {
			// 	title: 'Odr/pool',
			// 	dataIndex: 'isAdHocHR',
			// 	align: 'left',
			// 	render: (text) => {
			// 		return <Fragment key={text}>{text}</Fragment>;
			// 	},
			// },
			{
				title: 'Stage',
				dataIndex: 'currentStage',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text}</Fragment>;
				},
			},
			{
				title: 'Curr Action Date',
				dataIndex: 'current_Action_date',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text}</Fragment>;
				},
			},
			{
				title: 'Exp Next Action Date',
				dataIndex: 'expected_Next_action_date',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text}</Fragment>;
				},
			},
			{
				title: 'Actual Next Action date',
				dataIndex: 'actual_Next_Action_date',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text}</Fragment>;
				},
			},
			{
				title: 'Expected SLA',
				dataIndex: 'expected_SLA_day',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text}</Fragment>;
				},
			},
			{
				title: 'Actual SLA',
				dataIndex: 'actual_SLA_day',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text}</Fragment>;
				},
			},
			{
				title: 'SLA diff',
				dataIndex: 'slA_diff',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text}</Fragment>;
				},
			},
			{
				title: 'Action',
				dataIndex: 'actionFilter',
				align: 'left',
				render: (text) => {
					return (
						<p
							key={text}
							style={{
								background:
									text === 'Before Time'
										? 'green'
										: text === 'Running Late'
										? 'red'
										: text === 'ON Time'
										? 'lightblue'
										:text === "Exceeded SLA" 
										? "#ffda31"
										: 'transparent',
							}}
							>
							{text}
						</p>
					);
				},
			},
			{
				title: 'Sales Person',
				dataIndex: 'sales_Person',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text}</Fragment>;
				},
			},
			{
				title: 'Sales Manager',
				dataIndex: 'sales_Manager',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text}</Fragment>;
				},
			},
			{
				title: 'OPS Lead',
				dataIndex: 'ops_Lead',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text}</Fragment>;
				},
			},
		];
	},

	slaReportFilterTypeConfig: (filterList) => {
		return [
			{
				label: 'Stages',
				name: 'stageIDs',
				child: filterList?.stages,
				isSearch: true,
			},
			{
				label: 'Action Filter',
				name: 'actionFilterIDs',
				child: filterList?.actionFilterDrop,
				isSearch: true,
			},
			{
				label: 'Company',
				name: 'CompanyIDs',
				child: filterList?.companies,
				isSearch: true,
			},
		];
	},

	slaReportFilterList: () => {
		return [
			{ name: 'Start Date' },
			{ name: ' End Date' },
			{ name: 'Stages' },
			{ name: 'Action Filter' },
			{ name: 'AM/NBD' },
			{ name: 'Sales Manager' },
			{ name: 'Sales Person' },
			{ name: 'Role' },
			{ name: 'HR Number' },
			{ name: 'Company' },
		];
	},
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
				render: (text, param) => {
					return (
						<a
							target="_blank"
							href={
								param?.jdFile
									? `${NetworkInfo.FILENETWORK}ClientAttachments/${param?.jdFile}`
									: param.jd
							}
							style={{ color: 'black', textDecoration: 'underline' }}
							rel="noreferrer">
							View
						</a>
					);
				},
			},
			{
				title: 'Over All %',
				dataIndex: 'overAllPercentage',
				key: 'overAllPercentage',
				align: 'left',
			},
			{
				title: 'Skill %',
				dataIndex: 'skillPercentage',
				key: 'skillPercentage',
				align: 'left',
			},
			{
				title: 'Role Resp %',
				dataIndex: 'rolesResponsibilitiesPercentage',
				key: 'rolesResponsibilitiesPercentage',
				align: 'left',
			},
			{
				title: 'Req %',
				dataIndex: 'requirementPercentage',
				key: 'requirementPercentage',
				align: 'left',
			},
			{
				title: 'JD Skill',
				dataIndex: 'jdDumpSkill',
				key: 'jdDumpSkill',
				align: 'left',
				render: (text) => {
					return text ? (
						<a href="javascript:void(0);"
							onClick={() => {
								setJDSkillModal(true);
								setSelectedRecord(text);
							}}
							style={{ color: 'black', textDecoration: 'underline' }}>
							View
						</a>
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
					return (
						text && (
							<a href="javascript:void(0);"
								onClick={() => {
									setHRSkillModal(true);
									setSelectedRecord(text);
								}}
								style={{ color: 'black', textDecoration: 'underline' }}>
								View
							</a>
						)
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
						<a href="javascript:void(0);"
							onClick={() => {
								setJDRoleRespModal(true);

								setSelectedRecord(text);
							}}
							style={{ color: 'black', textDecoration: 'underline' }}>
							View
						</a>
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
						<a href="javascript:void(0);"
							onClick={() => {
								setHRRoleRespModal(true);
								setSelectedRecord(text);
							}}
							style={{ color: 'black', textDecoration: 'underline' }}>
							View
						</a>
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
						<a href="javascript:void(0);"
							onClick={() => {
								setJDReqModal(true);
								setSelectedRecord(text);
							}}
							style={{ color: 'black', textDecoration: 'underline' }}>
							View
						</a>
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
						<a href="javascript:void(0);"
							onClick={() => {
								setHRReqModal(true);
								setSelectedRecord(text);
							}}
							style={{ color: 'black', textDecoration: 'underline' }}>
							View
						</a>
					) : (
						'NA'
					);
				},
			},
		];
	},
	i2spopupReportConfig: () => {
		return [
			{
				title: 'HR #',
				dataIndex: 'hR_Number',
				key: 'hR_Number',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text ? text : 'NA'}</Fragment>;
				},
			},
			{
				title: 'Sales Person',
				dataIndex: 'salesUser',
				key: 'salesUser',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text ? text : 'NA'}</Fragment>;
				},
			},
			{
				title: 'Company Name',
				dataIndex: 'company',
				key: 'company',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text ? text : 'NA'}</Fragment>;
				},
			},
			{
				title: 'Role',
				dataIndex: 'talentRole',
				key: 'talentRole',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text ? text : 'NA'}</Fragment>;
				},
			},
			{
				title: 'Managed/Self',
				dataIndex: 'isManaged',
				key: 'isManaged',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text ? text : 'NA'}</Fragment>;
				},
			},
			{
				title: 'Name',
				dataIndex: 'name',
				key: 'name',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text ? text : 'NA'}</Fragment>;
				},
			},
			{
				title: 'Availability',
				dataIndex: 'availability',
				key: 'availability',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text ? text : 'NA'}</Fragment>;
				},
			},
		];
	},
	clientPopupReportConfig: () => {
		return [
			{
				title: 'Client',
				dataIndex: 'fullName',
				key: 'fullName',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text}</Fragment>;
				},
			},
			{
				title: 'Company Name',
				dataIndex: 'company',
				key: 'company',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text }</Fragment>;
				},
			},
			{
				title: 'Sales Person',
				dataIndex: 'salesUser',
				key: 'salesUser',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text }</Fragment>;
				},
			},
			
			{
				title: 'HR #',
				dataIndex: 'hr_Number',
				key: 'hr_Number',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text }</Fragment>;
				},
			},
			{
				title: 'Talent',
				dataIndex: 'name',
				key: 'name',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text }</Fragment>;
				},
			},
			{
				title: 'Status',
				dataIndex: 'status',
				key: 'status',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text }</Fragment>;
				},
			},
		];
	},
	hrPopupReportConfig: () => {
		return [
			{
				title: 'Client',
				dataIndex: 'fullName',
				key: 'fullName',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text }</Fragment>;
				},
			},
			{
				title: 'Company Name',
				dataIndex: 'company',
				key: 'company',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text }</Fragment>;
				},
			},		
			{
				title: 'HR #',
				dataIndex: 'hR_NUMBER',
				key: 'hR_NUMBER',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text }</Fragment>;
				},
			},
		];
	},
	clientReportFilterTypeConfig: (filtersList) => {
		return [
			{
				label: 'Company Category',
				name: 'CompanyCategory',
				child: filtersList?.CompanyCategory.filter(
					(item, index) => index !== 0 && item,
				),
				isSearch: false,
			},
			{
				label: 'Sales Manager',
				name: 'SalesManager',
				child: filtersList?.SalesManager,
				isSearch: false,
			},
			
		];
	},
	HRReportFilterTypeConfig: (filterList) => {
		return [
			{
				label: 'Hiring Status',
				name: 'HiringStatus',
				child: filterList?.HiringStatus,
				isSearch: false,
			},
			{
				label: 'Working Mode',
				name: 'ModeOfWorking',
				child: filterList?.ModeOfWorking.filter(val => val.text !== "0" ),
				isSearch: false,
			},
			{
				label: 'Head',
				name: 'SalesManager',
				child: filterList?.SalesManager,
				isSearch: true,
			},
			{
				label: 'HR Type',
				name: 'TypeOfHR',
				child: filterList?.TypeOfHR.filter(val => val.text !== "-1" ),
				isSearch: false,
			},
		];
	},
};
