import { Tooltip } from 'antd';
import { HiringRequestHRStatus } from 'constants/application';
import { NetworkInfo } from 'constants/network';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import infoIcon from 'assets/svg/info.svg'
import moment from 'moment';
import { split } from 'lodash';

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
		let tableHeader = Object?.keys(demandTable?.[0] || {}).filter(item => item !== 'Additional Info');
		

		return tableHeader?.map((item) => {
			return {
				title: item,
				dataIndex: item,
				key: item,
				align: item === 'Additional Info' ? 'center' :'left',

				ellipsis: {
					showTitle: false,
				},
				width: item === 'Stage' ? 300 : 250,
				render: (data, param) => {
					let heighlight =	param.Stage === 'HR Active' || param.Stage === 'TR Active' || param.Stage === 'Profile Feedback Pending' || param.Stage === 'Interview Feedback Pending'
					if(item === 'Duration' && heighlight){
						return 
					} 
					if(item === 'Stage') {
						return <div style={{display:'flex',alignItems:'center', justifyContent:'space-between'}}>
							<Tooltip
							placement="bottomLeft"
							title={data}>
								<p style={{ fontWeight: '550', padding: '5px', marginBottom:'0', borderBottom: heighlight ?'4px solid #6DBAFF' :'' }}>
									{data}
								</p>							
						</Tooltip>

						<Tooltip
							placement="bottomLeft"
							title={param['Additional Info']}>
								<img src={infoIcon} alt='info' />							
						</Tooltip>
						</div>
					}
					return (
						<Tooltip
							placement="bottomLeft"
							title={data}>
							{item === 'Stage' || item === 'Duration' ? (
								<p style={{ fontWeight: '550', padding: '5px', marginBottom: '0', borderBottom: heighlight ?'2px solid #BDDFFE' :'' }}>
									{data}
									</p>
							) : item === 'Additional Info' ?  <img src={infoIcon} alt='info' /> : (
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
							<p style={{ fontWeight: '550', marginBottom:'0' }}>{data}</p>
						) : (
							<p style={{marginBottom:'0'}}>{data}</p>
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
			: stage !== 'HR Accepted' ? stage === 'HR Active' ? [
				{
					title: 'HR#',
					dataIndex: 'hR_No',
					key: 'hR_No',
					align: 'left',
					width: 250,
				},
				{
					title: 'HR Status',
					dataIndex: 'hrStatus',
					key: 'hrStatus',
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
			
		  ]: stage === 'TR Active' ? [
				{
					title: 'HR#',
					dataIndex: 'hR_No',
					key: 'hR_No',
					align: 'left',
					width: 250,
				},
				{
					title: 'HR Status',
					dataIndex: 'hrStatus',
					key: 'hrStatus',
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
							stage === 'TR Accepted' || stage === 'TR Cancelled' || stage === 'TR Lost' || stage === 'HR Accepted' || stage === 'TR Created' || 
							stage === 'TR Active' || stage === 'HR Active' || stage === 'HR - Waiting For More Information' || stage === 'TR Information Pending'
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
			{ name: 'Geo'}
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
				label: 'Lead Type',
				name: 'leadUserId',
				child: filterList?.LeadTypeList.filter(
					(item, index) => index !== 0 && item,
				),
				isSearch: false,
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
			{
				label: 'Geo',
				name: 'geos',
				child: [
					{
						disabled: false,
						group: null,
						selected: false,
						text: 'India',
						value: 'India',
					},
					{
						disabled: false,
						group: null,
						selected: false,
						text: 'Global',
						value: 'Global',
					},
				],
				isSearch: false,
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
								<p style={{ fontWeight: '550',marginBottom:'0' }}>{data}</p>
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

	slaReportFilterTypeConfig: (filterList,filtersSalesRepo) => {		
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
			{
				label: 'Sales Head',
				name: 'Heads',
				child: filterList?.salesHead_List,
				isSearch: true,
			},
			{
				label: 'Sales Representative',
				name: 'sales_ManagerIDs',
				child: filtersSalesRepo,
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
									? `${ NetworkInfo.PROTOCOL +
										NetworkInfo.DOMAIN +
										"Media/JDParsing/JDfiles/"}${param?.jdFile}`
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
	hrPopupReportConfig: (hrStage) => {
		return [
			{
				title: 'HR #',
				dataIndex: 'hR_NUMBER',
				key: 'hR_NUMBER',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text }</Fragment>;
				},
			},
			// {
			// 	title: 'Client',
			// 	dataIndex: 'fullName',
			// 	key: 'fullName',
			// 	align: 'left',
			// 	render: (text) => {
			// 		return <Fragment key={text}>{text }</Fragment>;
			// 	},
			// },
			{
				title: 'Company',
				dataIndex: 'company',
				key: 'company',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text }</Fragment>;
				},
			},
			{
				title: 'HR Role',
				dataIndex: 'role',
				key: 'role',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text }</Fragment>;
				},
			},
			{
				title: 'HR Raised Date',
				dataIndex: 'hrRaisedDate',
				key: 'hrRaisedDate',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text }</Fragment>;
				},
			},
			{
				title: 'HR Accepted Date',
				dataIndex: 'hrAcceptedDateTime',
				key: 'hrAcceptedDateTime',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text}</Fragment>;
				},
			},
			{
				title: '1st Profile Share Date',
				dataIndex: 'firstProfileSharedDate',
				key: 'firstProfileSharedDate',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text }</Fragment>;
				},
			},
			{
				title: 'Total Profile Shared',
				dataIndex: 'noOfProfileShared',
				key: 'noOfProfileShared',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text }</Fragment>;
				},
			},	
			{
				title: 'Sales Head',
				dataIndex: 'salesPersonHead',
				key: 'salesPersonHead',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text }</Fragment>;
				},
			},
			{
				title: 'Sales Person',
				dataIndex: 'salesPerson',
				key: 'salesPerson',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text }</Fragment>;
				},
			},		
			{
				title: 'HR Status',
				dataIndex: 'hR_Status',
				key: 'hR_Status',
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
				isSingle:true
			},
			{
				label: 'Heads',
				name: 'SalesManager',
				child: filtersList?.SalesManager,
				isSearch: false,
			},
			{
				label: 'Lead Type',
				name: 'LeadType',
				child: filtersList?.LeadTypeList.filter(item=> item.value !== "0"),
				isSearch: false,
				isSingle:true
			},
		];
	},
	HRReportFilterTypeConfig: (filterList,filtersSalesRepo,filtersHRType) => {
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
				isSingle:true
			},
			{
				label: 'Head',
				name: 'SalesManager',
				child: filterList?.SalesManager,
				isSearch: true,
			},
			{
				label: 'Sales Representative',
				name: 'sales_ManagerIDs',
				child: filtersSalesRepo,
				isSearch: true,
			},
			{
				label: 'HR Type',
				name: 'TypeOfHR',
				child: filtersHRType.filter(val => val.text === "4" || val.text === "1" ),
				isSearch: false,
				isSingle:true
			},
			{
				label: 'Client Type',
				name: 'ClientType',
				child: filterList?.ClientType.filter(val => val.text !== "0" ),
				isSearch: false,
				isSingle:true
			},
			{
				label: 'Geo',
				name: 'geos',
				child: [
					{
						disabled: false,
						group: null,
						selected: false,
						text: 'India',
						value: 'India',
					},
					{
						disabled: false,
						group: null,
						selected: false,
						text: 'Global',
						value: 'Global',
					},
				],
				isSearch: false,
				isSingle:true
			},
		];
	},
	UTMReportFilterTypeConfig: (filterList) => {
		return [
			// {
			// 	label: 'Numbers of Jobs',
			// 	name: 'get_JobPostCount_For_UTM_Tracking_Lead',
			// 	child: filterList?.get_JobPostCount_For_UTM_Tracking_Lead,
			// 	isSearch: false,
			// },
			{
				label: 'Ref URL',
				name: 'ref_Url',
				child: filterList?.ref_Url,
				isSearch: false,
				// isSingle:true
			},
			{
				label: 'UTM Campaign',
				name: 'utM_Campaign',
				child: filterList?.utM_Campaign,
				isSearch: true,
			},
			{
				label: 'UTM Content',
				name: 'utM_Content',
				child: filterList?.utM_Content,
				isSearch: false,
				// isSingle:true
			},
			{
				label: 'UTM Medium',
				name: 'utM_Medium',
				child: filterList?.utM_Medium,
				isSearch: false,
				// isSingle:true
			},
			{
				label: 'UTM Placement',
				name: 'utM_Placement',
				child: filterList?.utM_Placement,
				isSearch: false,
				// isSingle:true
			},
			{
				label: 'UTM Source',
				name: 'utM_Source',
				child: filterList?.utM_Source,
				isSearch: false,
				// isSingle:true
			},
			{
				label: 'UTM Term',
				name: 'utM_Term',
				child: filterList?.utM_Term,
				isSearch: false,
				// isSingle:true
			},
		];
	},
	UTMPopupReportConfig: () => {
		return [
			{
				title: 'Client',
				dataIndex: 'client',
				key: 'client',
				align: 'left',				
			},
			{
				title: 'Hr Number',
				dataIndex: 'hrNumber',
				key: 'hrNumber',
				align: 'left',		
				render: (text, result) => (
					result?.hrid ? 
					<Link
					  target="_blank"
					  to={`/allhiringrequest/${result?.hrid}`}
					  style={{ color: "black", textDecoration: "underline" }}
					  onClick={() => localStorage.removeItem("dealID")}
					>
					  {text}
					</Link> : {text}
				  ),		
			},
			{
				title: 'Country',
				dataIndex: 'country',
				key: 'country',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text }</Fragment>;
				},
			},
			{
				title: 'State',
				dataIndex: 'state',
				key: 'state',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text }</Fragment>;
				},
			},
			{
				title: 'City',
				dataIndex: 'city',
				key: 'city',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text}</Fragment>;
				},
			},
			{
				title: 'Browser',
				dataIndex: 'browser',
				key: 'browser',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text }</Fragment>;
				},
			},
			{
				title: 'Device',
				dataIndex: 'device',
				key: 'device',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text }</Fragment>;
				},
			},	
			{
				title: 'iP Address',
				dataIndex: 'iP_Address',
				key: 'iP_Address',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text }</Fragment>;
				},
			}				
		];
	},
	ClientPortalPopupReportConfig: (hrStageId) => {
		if(hrStageId===16){
			return [
				{
					title: 'Action Date',
					dataIndex: 'createdDate',
					key: 'createdDate',
					align: 'left',
					render: (text) => {
						return <Fragment key={text}>{moment(text).format("DD/MM/YYYY h:mm:ss") }</Fragment>;
					},
				},
				{
					title: 'Client/User',
					dataIndex: 'client',
					key: 'client',
					align: 'left',				
				},
				{
					title: 'HR #',
					dataIndex: 'hrNumber',
					key: 'hrNumber',
					align: 'left',		
					render: (text, result) => (
						result?.hrid ? 
						<Link
						  target="_blank"
						  to={`/allhiringrequest/${result?.hrid}`}
						  style={{ color: "black", textDecoration: "underline" }}
						  onClick={() => localStorage.removeItem("dealID")}
						>
						  {text}
						</Link> : {text}
					  ),		
				},
				{
					title: 'Talent',
					dataIndex: 'talentName',
					key: 'talentName',
					align: 'left',
					render: (text) => {
						return <Fragment key={text}>{text}</Fragment>;
					},
				},	
				{
					title: 'Talent Status',
					dataIndex: 'talentStatus',
					key: 'talentStatus',
					align: 'left',
					render: (text) => {
						return <div key={text} dangerouslySetInnerHTML={{__html:text}}></div>;
					},
				},
				{
					title: 'Location',
					dataIndex: 'location',
					key: 'location',
					align: 'left',
					render: (text) => {
						let data = text.split(",");
						const filteredValues = data.filter(value => value !== "null" && value.trim() !== "");
						const result = filteredValues.join(", ");
						return <Fragment key={result}>{result}</Fragment>;
					},
				},
				{
					title: 'Browser',
					dataIndex: 'browser',
					key: 'browser',
					align: 'left',
					render: (text) => {
						return <Fragment key={text}>{text }</Fragment>;
					},
				},
				{
					title: 'IP Address',
					dataIndex: 'ipAddress',
					key: 'ipAddress',
					align: 'left',
					render: (text) => {
						return <Fragment key={text}>{text }</Fragment>;
					},
				},	
				{
					title: 'Device',
					dataIndex: 'device',
					key: 'device',
					align: 'left',
					render: (text) => {
						return <Fragment key={text}>{text }</Fragment>;
					},
				},										
			];
		}else if (hrStageId===1 || hrStageId===2 || hrStageId===18){
			return [
				{
					title: 'Action Date',
					dataIndex: 'createdDate',
					key: 'createdDate',
					align: 'left',
					render: (text) => {
						return <Fragment key={text}>{moment(text).format("DD/MM/YYYY h:mm:ss") }</Fragment>;
					},
				},
				{
					title: 'Client/User',
					dataIndex: 'client',
					key: 'client',
					align: 'left',				
				},
				{
					title: 'Location',
					dataIndex: 'location',
					key: 'location',
					align: 'left',
					render: (text) => {
						let data = text.split(",");
						const filteredValues = data.filter(value => value !== "null" && value.trim() !== "");
						const result = filteredValues.join(", ");
						return <Fragment key={result}>{result}</Fragment>;
					},
				},
				{
					title: 'Browser',
					dataIndex: 'browser',
					key: 'browser',
					align: 'left',
					render: (text) => {
						return <Fragment key={text}>{text }</Fragment>;
					},
				},
				{
					title: 'IP Address',
					dataIndex: 'ipAddress',
					key: 'ipAddress',
					align: 'left',
					render: (text) => {
						return <Fragment key={text}>{text }</Fragment>;
					},
				},
				{
					title: 'Device',
					dataIndex: 'device',
					key: 'device',
					align: 'left',
					render: (text) => {
						return <Fragment key={text}>{text }</Fragment>;
					},
				},							
			];
		}else if (hrStageId=== 3){
			return [
				{
					title: 'Action Date',
					dataIndex: 'createdDate',
					key: 'createdDate',
					align: 'left',
					render: (text) => {
						return <Fragment key={text}>{moment(text).format("DD/MM/YYYY h:mm:ss") }</Fragment>;
					},
				},
				{
					title: 'Client/User',
					dataIndex: 'client',
					key: 'client',
					align: 'left',				
				},
				{
					title: 'HR #',
					dataIndex: 'hrNumber',
					key: 'hrNumber',
					align: 'left',		
					render: (text, result) => (
						result?.hrid ? 
						<Link
						  target="_blank"
						  to={`/allhiringrequest/${result?.hrid}`}
						  style={{ color: "black", textDecoration: "underline" }}
						  onClick={() => localStorage.removeItem("dealID")}
						>
						  {text}
						</Link> : {text}
					  ),		
				},
				{
					title: 'Talent',
					dataIndex: 'talentName',
					key: 'talentName',
					align: 'left',
					render: (text) => {
						return <div key={text} dangerouslySetInnerHTML={{__html:text}}></div>;
					},
				},
				{
					title: 'Rejection Stage',
					dataIndex: 'rejectionStage',
					key: 'rejectionStage',
					align: 'left',
					render: (text) => {
						return <Fragment key={text}>{text }</Fragment>;
					},
				},
				{
					title: 'Rejection Reason',
					dataIndex: 'rejectionReason',
					key: 'rejectionReason',
					align: 'left',
					render: (text) => {
						return <Fragment key={text}>{text }</Fragment>;
					},
				},	
				{
					title: 'Location',
					dataIndex: 'location',
					key: 'location',
					align: 'left',
					render: (text) => {
						let data = text.split(",");
						const filteredValues = data.filter(value => value !== "null" && value.trim() !== "");
						const result = filteredValues.join(", ");
						return <Fragment key={result}>{result}</Fragment>;
					},
				},
				{
					title: 'Browser',
					dataIndex: 'browser',
					key: 'browser',
					align: 'left',
					render: (text) => {
						return <Fragment key={text}>{text }</Fragment>;
					},
				},
				{
					title: 'IP Address',
					dataIndex: 'ipAddress',
					key: 'ipAddress',
					align: 'left',
					render: (text) => {
						return <Fragment key={text}>{text }</Fragment>;
					},
				},
				{
					title: 'Device',
					dataIndex: 'device',
					key: 'device',
					align: 'left',
					render: (text) => {
						return <Fragment key={text}>{text }</Fragment>;
					},
				},
									
			];
		}else if (hrStageId === 25 || hrStageId === 26) {
			return [
				{
					title: 'Action Date',
					dataIndex: 'createdDate',
					key: 'createdDate',
					align: 'left',
					render: (text) => {
						return <Fragment key={text}>{moment(text).format("DD/MM/YYYY h:mm:ss") }</Fragment>;
					},
				},
				{
					title: 'Client/User',
					dataIndex: 'client',
					key: 'client',
					align: 'left',				
				},
				{
					title: 'HR #',
					dataIndex: 'hrNumber',
					key: 'hrNumber',
					align: 'left',		
					render: (text, result) => (
						result?.hrid ? 
						<Link
						  target="_blank"
						  to={`/allhiringrequest/${result?.hrid}`}
						  style={{ color: "black", textDecoration: "underline" }}
						  onClick={() => localStorage.removeItem("dealID")}
						>
						  {text}
						</Link> : {text}
					  ),		
				},
				{
					title: 'Location',
					dataIndex: 'location',
					key: 'location',
					align: 'left',
					render: (text) => {
						let data = text.split(",");
						const filteredValues = data.filter(value => value !== "null" && value.trim() !== "");
						const result = filteredValues.join(", ");
						return <Fragment key={result}>{result}</Fragment>;
					},
				},
				{
					title: 'Browser',
					dataIndex: 'browser',
					key: 'browser',
					align: 'left',
					render: (text) => {
						return <Fragment key={text}>{text }</Fragment>;
					},
				},
				{
					title: 'IP Address',
					dataIndex: 'ipAddress',
					key: 'ipAddress',
					align: 'left',
					render: (text) => {
						return <Fragment key={text}>{text }</Fragment>;
					},
				},
				{
					title: 'Device',
					dataIndex: 'device',
					key: 'device',
					align: 'left',
					render: (text) => {
						return <Fragment key={text}>{text }</Fragment>;
					},
				},								
			];
		} else{
			return [
				{
					title: 'Action Date',
					dataIndex: 'createdDate',
					key: 'createdDate',
					align: 'left',
					render: (text) => {
						return <Fragment key={text}>{moment(text).format("DD/MM/YYYY h:mm:ss") }</Fragment>;
					},
				},
				{
					title: 'Client/User',
					dataIndex: 'client',
					key: 'client',
					align: 'left',				
				},
				{
					title: 'HR #',
					dataIndex: 'hrNumber',
					key: 'hrNumber',
					align: 'left',		
					render: (text, result) => (
						result?.hrid ? 
						<Link
						  target="_blank"
						  to={`/allhiringrequest/${result?.hrid}`}
						  style={{ color: "black", textDecoration: "underline" }}
						  onClick={() => localStorage.removeItem("dealID")}
						>
						  {text}
						</Link> : {text}
					  ),		
				},
				 {
					title: 'Talent',
					dataIndex: 'talentName',
					key: 'talentName',
					align: 'left',
					render: (text) => {
						return <div key={text} dangerouslySetInnerHTML={{__html:text}}></div>;
					},
				},	
				{
					title: 'Location',
					dataIndex: 'location',
					key: 'location',
					align: 'left',
					render: (text) => {
						let data = text.split(",");
						const filteredValues = data.filter(value => value !== "null" && value.trim() !== "");
						const result = filteredValues.join(", ");
						return <Fragment key={result}>{result}</Fragment>;
					},
				},
				{
					title: 'Browser',
					dataIndex: 'browser',
					key: 'browser',
					align: 'left',
					render: (text) => {
						return <Fragment key={text}>{text }</Fragment>;
					},
				},
				{
					title: 'IP Address',
					dataIndex: 'ipAddress',
					key: 'ipAddress',
					align: 'left',
					render: (text) => {
						return <Fragment key={text}>{text }</Fragment>;
					},
				},
				{
					title: 'Device',
					dataIndex: 'device',
					key: 'device',
					align: 'left',
					render: (text) => {
						return <Fragment key={text}>{text }</Fragment>;
					},
				},								
			];
		}
	},
	EmailPopupReportConfig: (hrStage) => {
		if(hrStage === 'Opened'){
			return  [
				{
					title: 'Action Date',
					dataIndex: 'trackingDate',
					key: 'trackingDate',
					align: 'left',
					render: (text) => {
						return <Fragment key={text}>{text}</Fragment>;
					},
				},
				{
					title: 'Client',
					dataIndex: 'client',
					key: 'client',
					align: 'left',				
				},

				{
					title: 'Email Subject',
					dataIndex: 'email_Subject',
					key: 'email_Subject',
					align: 'left',
					render: (text) => {
						return <Fragment key={text}>{text }</Fragment>;
					},
				},
				{
					title: 'IP Address',
					dataIndex: 'ipAddress',
					key: 'ipAddress',
					align: 'left',
					render: (text) => {
						return <Fragment key={text}>{text }</Fragment>;
					},
				},
				{
					title: 'User Agent',
					dataIndex: 'user_Agent',
					key: 'user_Agent',
					align: 'left',
					render: (text) => {
						return <Fragment key={text}>{text }</Fragment>;
					},
				},			
			];
		}

		if(hrStage === 'Clicked'){

			return  [
				{
					title: 'Action Date',
					dataIndex: 'trackingDate',
					key: 'trackingDate',
					align: 'left',
					render: (text) => {
						return <Fragment key={text}>{text}</Fragment>;
					},
				},
				{
					title: 'Client/User',
					dataIndex: 'client',
					key: 'client',
					align: 'left',				
				},
				{
					title: 'Email Link',
					dataIndex: 'email_Link',
					key: 'email_Link',
					align: 'left',		
					render: (text, result) => {
						const parsedUrl = new URL(text);

						// Remove domain and query parameters
						const cleanPathname = parsedUrl.pathname;
						let pathArr = cleanPathname.split('/')
						if(pathArr.length > 2) {
							return pathArr[1]
						}
						return cleanPathname.replaceAll("/",' ')
						// return (				
						// <a
						//   target="_blank"
						//   href={text}
						//   rel="noreferrer"
						//   style={{ color: "black", textDecoration: "underline" }}
						// //   onClick={() => localStorage.removeItem("dealID")}
						// >
						//   {cleanPathname}
						// </a>  )
					 },		
				},
				// {
				// 	title: 'Email Link Tags',
				// 	dataIndex: 'email_LinkTags',
				// 	key: 'email_LinkTags',
				// 	align: 'left',
				// 	render: (text) => {
				// 		return <Fragment key={text}>{text }</Fragment>;
				// 	},
				// },
				{
					title: 'Email Subject',
					dataIndex: 'email_Subject',
					key: 'email_Subject',
					align: 'left',
					render: (text) => {
						return <Fragment key={text}>{text }</Fragment>;
					},
				},
				{
					title: 'IP Address',
					dataIndex: 'ipAddress',
					key: 'ipAddress',
					align: 'left',
					render: (text) => {
						return <Fragment key={text}>{text }</Fragment>;
					},
				},
				{
					title: 'User Agent',
					dataIndex: 'user_Agent',
					key: 'user_Agent',
					align: 'left',
					render: (text) => {
						return <Fragment key={text}>{text }</Fragment>;
					},
				},
				
			];
		}
		if(hrStage === 'Delivered' || hrStage === 'Sent'){
			return  [
				{
					title: 'Action Date',
					dataIndex: 'trackingDate',
					key: 'trackingDate',
					align: 'left',
					render: (text) => {
						return <Fragment key={text}>{text}</Fragment>;
					},
				},
				{
					title: 'Client/User',
					dataIndex: 'client',
					key: 'client',
					align: 'left',				
				},
				

				{
					title: 'Email Subject',
					dataIndex: 'email_Subject',
					key: 'email_Subject',
					align: 'left',
					render: (text) => {
						return <Fragment key={text}>{text }</Fragment>;
					},
				},			
			];
		}

		
		return [
			{
				title: 'Action Date',
				dataIndex: 'trackingDate',
				key: 'trackingDate',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text}</Fragment>;
				},
			},
			{
				title: 'Client/User',
				dataIndex: 'client',
				key: 'client',
				align: 'left',				
			},
			// {
			// 	title: 'Email Link',
			// 	dataIndex: 'email_Link',
			// 	key: 'email_Link',
			// 	align: 'left',		
			// 	render: (text, result) => {
			// 		const parsedUrl = new URL(text);

			// 		// Remove domain and query parameters
			// 		const cleanPathname = parsedUrl.pathname;
			// 		let pathArr = cleanPathname.split('/')
			// 		if(pathArr.length > 2) {
			// 			return pathArr[1]
			// 		}
			// 		return cleanPathname.replaceAll("/",' ')
			// 		// return (				
			// 		// <a
			// 		//   target="_blank"
			// 		//   href={text}
			// 		//   rel="noreferrer"
			// 		//   style={{ color: "black", textDecoration: "underline" }}
			// 		// //   onClick={() => localStorage.removeItem("dealID")}
			// 		// >
			// 		//   {cleanPathname}
			// 		// </a>  )
			// 	 },		
			// },
			// {
			// 	title: 'Email Link Tags',
			// 	dataIndex: 'email_LinkTags',
			// 	key: 'email_LinkTags',
			// 	align: 'left',
			// 	render: (text) => {
			// 		return <Fragment key={text}>{text }</Fragment>;
			// 	},
			// },
			{
				title: 'Email Subject',
				dataIndex: 'email_Subject',
				key: 'email_Subject',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text }</Fragment>;
				},
			},
			{
				title: 'IP Address',
				dataIndex: 'ipAddress',
				key: 'ipAddress',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text }</Fragment>;
				},
			},
			{
				title: 'User Agent',
				dataIndex: 'user_Agent',
				key: 'user_Agent',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text }</Fragment>;
				},
			},
			{
				title: 'Bounce Type',
				dataIndex: 'bounceType',
				key: 'bounceType',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text }</Fragment>;
				},
			},
			{
				title: 'Bounce Sub Type',
				dataIndex: 'bounceSubType',
				key: 'bounceSubType',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text }</Fragment>;
				},
			},
			{
				title: 'Bounced Recipients',
				dataIndex: 'bouncedRecipients',
				key: 'bouncedRecipients',
				align: 'left',
				render: (text) => {
					return <Fragment key={text}>{text }</Fragment>;
				},
			},
			// {
			// 	title: 'Location',
			// 	dataIndex: 'location',
			// 	key: 'location',
			// 	align: 'left',
			// 	render: (text) => {
			// 		let data = text.split(",");
			// 		const filteredValues = data.filter(value => value !== "null" && value.trim() !== "");
			// 		const result = filteredValues.join(", ");
			// 		return <Fragment key={result}>{result}</Fragment>;
			// 	},
			// },				
		];
	}

};
