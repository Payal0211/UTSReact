import { HiringRequestHRStatus, ProfileLog } from 'constants/application';
import { Link } from 'react-router-dom';
import { All_Hiring_Request_Utils } from 'shared/utils/all_hiring_request_util';
import { ReactComponent as CloneHRSVG } from 'assets/svg/cloneHR.svg';
import { ReactComponent as ReopenHR } from 'assets/svg/reopen.svg';
import { ReactComponent as CloseHR} from 'assets/svg/power.svg';
import { ReactComponent as FocusedRole} from 'assets/svg/FocusRole.svg'
import { Tooltip } from 'antd';
export const allHRConfig = {
	tableConfig: (togglePriority, setCloneHR, setHRID, setHRNumber ,setReopenHRData,setReopenHrModal,setCloseHRDetail,setCloseHrModal,LoggedInUserTypeID) => {
		return [
			{
				title: ' ',
				dataIndex: 'isHRFocused',
				key: 'isHRFocused',
				align: 'center',
				width:'3%',
				render:(val)=> {
					return val ? <FocusedRole /> : null
				}
			},

			{
				title: ' ',
				dataIndex: 'starStatus',
				key: 'starStatus',
				align: 'center',
				width:'3%',
				render: (_, param) => {
					let response = All_Hiring_Request_Utils.GETHRPRIORITY(
						param?.starStatus,
						param?.salesRep,
						param?.key,
						togglePriority,
					);

					return response;
				},
			},
			{
				title: ' ',
				dataIndex: 'reopenHR',
				key: 'reopenHR',
				width:'3%',
				align: 'center',
				render: (text, result) => {
					return (
						<>
						{ result?.reopenHR === 0 ? <Tooltip
							placement="bottom"
							title={'Close HR'}>
								<a href="javascript:void(0);">
								<CloseHR
									style={{ fontSize: '16px' }}
									onClick={() => {
										setCloseHRDetail({ ...result , HR_Id:result?.HRID})
										setCloseHrModal(true)
									}}
								/>
							</a>
						</Tooltip> : (LoggedInUserTypeID !== 5 && LoggedInUserTypeID !== 10) ? <Tooltip
							placement="bottom"
							title={'Reopen HR'} 
							>
								<a href="javascript:void(0);">
								<ReopenHR 
									style={{ fontSize: '16px' }}
									onClick={() => {
										setReopenHRData({...result, HR_Id: result?.HRID , ClientDetail: {NoOfTalents: result?.TR} })
										setReopenHrModal(true)
									}}
								/>
							</a>
						</Tooltip> : ''}
						</>
					);
				},
			},
			{
				title: ' ',
				dataIndex: 'cloneHR',
				key: 'cloneHR',
				width:'3%',
				align: 'center',
				render: (text, result) => {
					if(LoggedInUserTypeID === 5 || LoggedInUserTypeID === 10){
						return
					}
					return (
						<>
						<Tooltip
							placement="bottom"
							title={'Clone HR'}>
								<a href="javascript:void(0);">
								<CloneHRSVG
									style={{ fontSize: '16px' }}
									onClick={() => {
										setCloneHR(true);
										setHRID(result?.key);
										setHRNumber(result?.HR_ID);
									}}
								/>
							</a>
						</Tooltip>
							
						</>
					);
				},
			},
			// {
			// 	title: 'O/P',
			// 	dataIndex: 'adHocHR',
			// 	key: 'adHocHR',
			// 	align: 'left',
			// },
			{
				title: 'Created Date',
				dataIndex: 'Date',
				key: 'Date',
				align: 'left',
				width:'8%'
			},
			{
				title: 'HR ID',
				dataIndex: 'HR_ID',
				key: 'HR_ID',
				align: 'left',
				width:'13%',
				render: (text, result) => (
					<Link
						target="_blank"
						to={`/allhiringrequest/${result?.key}`}
						style={{ color: 'black', textDecoration: 'underline' }}
						onClick={()=> localStorage.removeItem('dealID')}>
						{text}
					</Link>
				),
			},
			{
				title: 'TR',
				dataIndex: 'TR',
				key: 'TR',
				width: '5%',
				align: 'left',
			},
			{
				title: 'Position',
				dataIndex: 'Position',
				key: 'position',
				align: 'left',
				width: '100px',
			},
			{
				title: 'Cat',
				dataIndex: 'companyCategory',
				key: 'companyCategory',
				align: 'left',
				width: '50px',
			},
			{
				title: 'Company',
				dataIndex: 'Company',
				key: 'company',
				align: 'left',
				width: '115px',
				// render: (text) => {
				// 	return (
				// 		<a
				// 			target="_blank"
				// 			href=""
				// 			style={{
				// 				color: `var(--uplers-black)`,
				// 				textDecoration: 'underline',
				// 			}}>
				// 			{text}
				// 		</a>
				// 	);
				// },
			},
			{
				title: 'Time',
				dataIndex: 'Time',
				key: 'time',
				align: 'left',
				width: '5%',
			},
			{
				title: 'FTE/PTE',
				dataIndex: 'typeOfEmployee',
				key: 'fte_pte',
				align: 'left',
				width: '65px',
			},
			{
				title: 'Sales Rep',
				dataIndex: 'salesRep',
				key: 'sales_rep',
				align: 'left',
				width: '9%',
				render: (text, result) => {
					return (
						<Link
							to={`/user/${result?.userId}`}
							style={{
								color: `var(--uplers-black)`,
								textDecoration: 'underline',
							}}>
							{text}
						</Link>
					);
				},
			},
			{
				title: 'HR Status',
				dataIndex: 'hrStatus',
				key: 'hr_status',
				align: 'left',
				width: '13%',
				render: (_, param) => {
					return All_Hiring_Request_Utils.GETHRSTATUS(
						param?.hrStatusCode,
						param?.hrStatus,
					);
				},
			},
		];
	},
	hrFilterListConfig: () => {
		return [
			{ name: 'Tenure' },
			{ name: 'ODR' },
			{ name: 'Profile Shared' },
			{ name: 'Data Analyst' },
			{ name: 'ODR' },
			{ name: 'Data Analyst' },
		];
	},
	hrFilterTypeConfig: (filterList) => {
		return [
			// {
			// 	label: 'ODR/Pool',
			// 	name: 'isPoolODRBoth',
			// 	child: [
			// 		{
			// 			disabled: false,
			// 			group: null,
			// 			selected: false,
			// 			text: '1',
			// 			value: 'ODR',
			// 		},
			// 		{
			// 			disabled: false,
			// 			group: null,
			// 			selected: false,
			// 			text: '2',
			// 			value: 'Pool',
			// 		},
			// 	],
			// 	isSearch: false,
			// },
			{
				label: 'Tenure',
				name: 'tenure',
				child: [],
				isSearch: false,
				isNumber: true
			},
			{
				label: 'Talent Request',
				name: 'tr',
				child: [],
				isSearch: false,
				isNumber: true
			},
			{
				label: 'Position',
				name: 'position',
				child: filterList?.positions,
				isSearch: true,
			},
			// {
			// 	label: 'Company',
			// 	name: 'company',
			// 	child: filterList?.companies,
			// 	isSearch: true,
			// },
			{
				label: 'FTE/PTE',
				name: 'typeOfEmployee',
				child: [
					{
						disabled: false,
						group: null,
						selected: false,
						text: 'FTE',
						value: 'FTE',
					},
					{
						disabled: false,
						group: null,
						selected: false,
						text: 'PTE',
						value: 'PTE',
					},
				],
				isSearch: false,
			},
			{
				label: 'Manager',
				name: 'manager',
				child: filterList?.managers,
				isSearch: true,
			},
			{
				label: 'Sales Representative',
				name: 'salesRep',
				child: filterList?.salesReps,
				isSearch: true,
			},
			{
				label: 'HR Status',
				name: 'hrStatus',
				child: [
					{
						disabled: false,
						group: null,
						selected: false,
						statusCode: HiringRequestHRStatus.DRAFT,
						label: 'Draft',
						value: 'Draft',
						text: HiringRequestHRStatus.DRAFT.toString(),
					},

					{
						disabled: false,
						group: null,
						selected: false,
						statusCode: HiringRequestHRStatus.HR_ACCEPTED,
						label: 'HR Aceepted',
						value: 'HR Aceepted',
						text: HiringRequestHRStatus.HR_ACCEPTED.toString(),
					},
					{
						disabled: false,
						group: null,
						selected: false,
						statusCode: HiringRequestHRStatus.ACCEPTANCE_PENDING,
						label: 'Acceptance Pending',
						text: HiringRequestHRStatus.ACCEPTANCE_PENDING.toString(),
						value: 'Acceptance Pending',
					},
					{
						disabled: false,
						group: null,
						selected: false,
						statusCode: HiringRequestHRStatus.INFO_PENDING,
						label: 'Info Pending',
						text: HiringRequestHRStatus.INFO_PENDING.toString(),
						value: 'Info Pending',
					},
					{
						disabled: false,
						group: null,
						selected: false,
						statusCode: HiringRequestHRStatus.COMPLETED,
						label: 'Completed',
						text: HiringRequestHRStatus.COMPLETED.toString(),
						value: 'Completed',
					},

					{
						disabled: false,
						group: null,
						selected: false,
						statusCode: HiringRequestHRStatus.IN_PROCESS,
						label: 'In Process',
						text: HiringRequestHRStatus.IN_PROCESS.toString(),
						value: 'In Process',
					},
					{
						disabled: false,
						group: null,
						selected: false,
						statusCode: HiringRequestHRStatus.CANCELLED,
						label: 'Cancelled',
						text: HiringRequestHRStatus.CANCELLED.toString(),
						value: 'Cancelled',
					},
					{
						disabled: false,
						group: null,
						selected: false,
						statusCode: HiringRequestHRStatus.LOST,
						label: 'Lost',
						text: HiringRequestHRStatus.LOST.toString(),
						value: 'Lost',
					},
				],
				isSearch: false,
			},
		];
	},
	profileLogConfig: (profileLog) => {
		return [
			{
				id: 'profileShared',
				// score: profileLog?.profileSharedCount,
				score: 60,
				label: 'Profile Shared',
				activeColor: `var(--color-purple)`,
				typeID: ProfileLog.PROFILE_SHARED,
			},
			{
				id: 'feedback',
				// score: profileLog?.feedbackCount,\
				score: 60,
				label: 'Feedback Received',
				activeColor: `var(--color-cyan)`,
				typeID: ProfileLog.FEEDBACK,
			},
			{
				id: 'rejected',
				// score: profileLog?.rejectedCount,
				score: 60,
				label: 'Rejected',
				activeColor: `var(--color-danger)`,
				typeID: ProfileLog.REJECTED,
			},
			{
				id: 'selected',
				// score: profileLog?.selectedForCount,
				score: 60,
				label: 'Selected For',
				activeColor: `var(--color-success)`,
				typeID: ProfileLog.SELECTED,
			},
		];
	},
};
