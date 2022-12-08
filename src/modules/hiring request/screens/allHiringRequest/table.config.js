import { Link } from 'react-router-dom';
import { All_Hiring_Request_Utils } from 'shared/utils/all_hiring_request_util';

export const TableConfig = (togglePriority) => {
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
				<Link to={`/allhiringrequest/${result?.key}${text}`}>{text}</Link>
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
};
