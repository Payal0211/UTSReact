import { HiringRequestHRStatus, ProfileLog } from 'constants/application';
import { Link } from 'react-router-dom';
import { All_Hiring_Request_Utils } from 'shared/utils/all_hiring_request_util';

export const allHRConfig = {
	tableConfig: (togglePriority) => {
		return [
			{
				title: '     ',
				dataIndex: 'starStatus',
				key: 'starStatus',
				align: 'left',
				render: (_, param) => {
					let response = All_Hiring_Request_Utils.GETHRPRIORITY(
						param.starStatus,
						param.key,
						togglePriority,
					);

					return response;
				},
			},
			{
				title: 'O/P',
				dataIndex: 'adHocHR',
				key: 'adHocHR',
				align: 'left',
			},
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
						to={`/allhiringrequest/${result?.key}${text}`}
						style={{ color: 'black', textDecoration: 'underline' }}>
						{text}
					</Link>
				),
			},
			{
				title: 'TR',
				dataIndex: 'TR',
				key: 'TR',
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
				render: (text) => {
					return (
						<a
							target="_blank"
							href=""
							style={{
								color: `var(--uplers-black)`,
								textDecoration: 'underline',
							}}>
							{text}
						</a>
					);
				},
			},
			{
				title: 'Time',
				dataIndex: 'Time',
				key: 'time',
				align: 'left',
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
				render: (text) => {
					return (
						<a
							target="_blank"
							href="#"
							style={{
								color: `var(--uplers-black)`,
								textDecoration: 'underline',
							}}>
							{text}
						</a>
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
			{
				name: 'ODR/Pool',
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
				name: 'Tenure',
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
				name: 'Talent Request',
				child: [
					{
						disabled: false,
						group: null,
						selected: false,
						text: '1',
						value: '3',
					},
					{
						disabled: false,
						group: null,
						selected: false,
						text: '2',
						value: '4',
					},
					{
						disabled: false,
						group: null,
						selected: false,
						text: '3',
						value: '7',
					},
					{
						disabled: false,
						group: null,
						selected: false,
						text: '4',
						value: '9',
					},
					{
						disabled: false,
						group: null,
						selected: false,
						text: '5',
						value: '10',
					},
				],
				isSearch: false,
			},
			{ name: 'Position', child: filterList?.positions, isSearch: true },
			{ name: 'Company', child: filterList?.companies, isSearch: true },
			{
				name: 'FTE/PTE',
				child: [
					{
						disabled: false,
						group: null,
						selected: false,
						text: '1',
						value: 'FTE',
					},
					{
						disabled: false,
						group: null,
						selected: false,
						text: '2',
						value: 'PTE',
					},
				],
				isSearch: false,
			},
			{ name: 'Manager', child: filterList?.managers, isSearch: true },
			{
				name: 'Sales Representative',
				child: filterList?.salesReps,
				isSearch: true,
			},
			{
				name: 'HR Status',
				child: [
					{
						statusCode: HiringRequestHRStatus.DRAFT,
						label: 'Draft',
					},
					{
						statusCode: HiringRequestHRStatus.HR_ACCEPTED,
						label: 'HR Aceepted',
					},
					{
						statusCode: HiringRequestHRStatus.ACCEPTANCE_PENDING,
						label: 'Acceptance Pending',
					},
					{
						statusCode: HiringRequestHRStatus.INFO_PENDING,
						label: 'Info Pending',
					},
					{
						statusCode: HiringRequestHRStatus.COMPLETED,
						label: 'Completed',
					},
					{
						statusCode: HiringRequestHRStatus.IN_PROCESS,
						label: 'In Process',
					},
					{
						statusCode: HiringRequestHRStatus.CANCELLED,
						label: 'Cancelled',
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
