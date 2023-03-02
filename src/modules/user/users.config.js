import { userUtils } from 'modules/user/userUtils';
import { ReactComponent as PencilSVG } from 'assets/svg/pencil.svg';
import { Link } from 'react-router-dom';
export const userConfig = {
	tableConfig: () => {
		return [
			{
				title: '     ',
				dataIndex: 'starStatus',
				key: 'starStatus',
				align: 'left',
				render: (_, param) => {
					return (
						<Link
							to={`/user/${param?.id}`}
							style={{ color: 'black', textDecoration: 'underline' }}>
							<PencilSVG />
						</Link>
					);
				},
			},
			{
				title: 'Created on',
				dataIndex: 'createdbyDatetime',
				key: 'createdbyDatetime',
				align: 'left',
				render: (_, param) => {
					let response = userUtils.dateFormatter(param.createdbyDatetime);
					return response;
				},
			},
			{
				title: 'Employee ID',
				dataIndex: 'employeeID',
				key: 'employeeID',
				align: 'left',
				render: (text) => {
					return text ? text : 'NA';
				},
			},
			{
				title: 'Name',
				dataIndex: 'fullName',
				key: 'fullName',
				align: 'left',
				render: (text) => {
					return text ? text : 'NA';
				},
			},
			{
				title: 'Team | Type',
				dataIndex: 'userType',
				key: 'userType',
				align: 'left',
				render: (_, param) => {
					if (param?.userType && param?.nbD_AM) {
						return param?.userType + ' | ' + param?.nbD_AM;
					} else {
						return param?.userType + param?.nbD_AM;
					}
				},
			},
			{
				title: 'Manager',
				dataIndex: 'teamManager',
				key: 'teamManager',
				align: 'left',
				render: (text) => {
					return text ? text : 'NA';
				},
			},
			{
				title: 'Email',
				dataIndex: 'emailID',
				key: 'emailID',
				align: 'left',
				render: (text) => {
					return text ? text : 'NA';
				},
			},
			{
				title: 'Skype',
				dataIndex: 'skypeID',
				key: 'skypeID',
				align: 'left',
				render: (text) => {
					return text ? text : 'NA';
				},
			},
			{
				title: 'Contact',
				dataIndex: 'contactNumber',
				key: 'contactNumber',
				align: 'left',
				render: (text) => {
					return text ? text : 'NA';
				},
			},
		];
	},
	userFilterListConfig: () => {
		return [
			{ name: 'Created on', child: [], isSearch: true },
			{ name: 'Employee ID', child: [], isSearch: true },
			{ name: 'Name', child: [], isSearch: true },
			{ name: 'Team|Type', child: [], isSearch: true },
			{ name: 'Manager', child: [], isSearch: true },
			{ name: 'Email', child: [], isSearch: true },
			{ name: 'Skype', child: [], isSearch: true },
			{ name: 'Contact', child: [], isSearch: true },
		];
	},
};
