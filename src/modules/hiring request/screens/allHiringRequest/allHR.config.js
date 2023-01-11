import { HiringRequestHRStatus } from 'constants/application';
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
	hrFilterTypeConfig: () => {
		return [
			{ name: 'ODR/Pool', child: ['ODR', 'Pool'], isSearch: false },
			{
				name: 'Tenure',
				child: ['3 Months', '6 Months', '12 Months'],
				isSearch: false,
			},
			{
				name: 'Talent Request',
				child: ['3', '4', '7', '9', '10'],
				isSearch: false,
			},
			{ name: 'Position', child: [], isSearch: true },
			{ name: 'Company', child: [], isSearch: true },
			{ name: 'FTE/PTE', child: ['FTE', 'PTE'], isSearch: false },
			{ name: 'Manager', child: [], isSearch: true },
			{ name: 'Sales Representative', child: [], isSearch: true },
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
};
