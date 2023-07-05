import { HiringRequestHRStatus, ProfileLog } from 'constants/application';
import { Link } from 'react-router-dom';
import { All_Hiring_Request_Utils } from 'shared/utils/all_hiring_request_util';
import { ReactComponent as CloneHRSVG } from 'assets/svg/cloneHR.svg';
export const allHRConfig = {
	tableConfig: (togglePriority, setCloneHR, setHRID, setHRNumber) => {
		return [
			{
				title: ' ',
				dataIndex: 'starStatus',
				key: 'starStatus',
				align: 'left',
				width: '55px',
				render: (_, param) => {
					let response = All_Hiring_Request_Utils.GETHRPRIORITY(
						param.starStatus,
						param.salesRep,
						param.key,
						togglePriority,
					);

					return response;
				},
			},
			{
				title: 'Clone HR',
				dataIndex: 'cloneHR',
				key: 'cloneHR',
				width: 100,
				align: 'left',
				render: (text, result) => {
					return (
						<>
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
				title: 'Date',
				dataIndex: 'Date',
				key: 'Date',
				align: 'left',
			},
			{
				title: 'HR ID',
				dataIndex: 'HR_ID',
				key: 'HR_ID',
				align: 'left',
				render: (text, result) => (
					<Link
						to={`/allhiringrequest/${result?.key}`}
						style={{ color: 'black', textDecoration: 'underline' }}>
						{text}
					</Link>
				),
			},
			{
				title: 'TR',
				dataIndex: 'TR',
				key: 'TR',
				width: '70px',
				align: 'left',
			},
			{
				title: 'Position',
				dataIndex: 'Position',
				key: 'position',
				align: 'left',
			},
			{
				title: 'Company',
				dataIndex: 'Company',
				key: 'company',
				align: 'left',
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
				width: '100px',
			},
			{
				title: 'FTE/PTE',
				dataIndex: 'typeOfEmployee',
				key: 'fte_pte',
				align: 'left',
			},
			{
				title: 'Sales Rep',
				dataIndex: 'salesRep',
				key: 'sales_rep',
				align: 'left',
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
				render: (_, param) => {
					return All_Hiring_Request_Utils.GETHRSTATUS(
						param.hrStatusCode,
						param.hrStatus,
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
				child: [
					{
						disabled: false,
						group: null,
						selected: false,
						text: '1',
						value: '3 Months',
					},
					{
						disabled: false,
						group: null,
						selected: false,
						text: '2',
						value: '6 Months',
					},
					{
						disabled: false,
						group: null,
						selected: false,
						text: '3',
						value: '12 Months',
					},
				],
				isSearch: false,
			},
			{
				label: 'Talent Request',
				name: 'tr',
				child: [
					{
						disabled: false,
						group: null,
						selected: false,
						text: '3',
						value: '3',
					},
					{
						disabled: false,
						group: null,
						selected: false,
						text: '4',
						value: '4',
					},
					{
						disabled: false,
						group: null,
						selected: false,
						text: '7',
						value: '7',
					},
					{
						disabled: false,
						group: null,
						selected: false,
						text: '9',
						value: '9',
					},
					{
						disabled: false,
						group: null,
						selected: false,
						text: '10',
						value: '10',
					},
				],
				isSearch: false,
			},
			{
				label: 'Position',
				name: 'position',
				child: filterList?.positions,
				isSearch: true,
			},
			{
				label: 'Company',
				name: 'company',
				child: filterList?.companies,
				isSearch: true,
			},
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
						value: 'Draft',
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
