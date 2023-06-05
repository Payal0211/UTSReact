import { _isNull } from 'shared/utils/basic_utils';

export const userUtils = {
	dateFormatter: (date) => {
		if (_isNull(date)) {
			return 'NA';
		} else {
			return date.split(' ')[0];
		}
	},
	userListSearch: (e, apiData) => {
		let filteredData = apiData?.filter((val) => {
			return (
				(val?.employeeID &&
					val?.employeeID
						.toLowerCase()
						.includes(e.target.value.toLowerCase())) ||
				(val?.fullName &&
					val?.fullName.toLowerCase().includes(e.target.value.toLowerCase())) ||
				(val?.userType &&
					val?.userType.toLowerCase().includes(e.target.value.toLowerCase())) ||
				(val?.nbD_AM &&
					val?.nbD_AM.toLowerCase().includes(e.target.value.toLowerCase())) ||
				(val?.teamManager &&
					val?.teamManager
						.toLowerCase()
						.includes(e.target.value.toLowerCase())) ||
				(val?.emailID &&
					val?.emailID.toLowerCase().includes(e.target.value.toLowerCase())) ||
				(val?.skypeID &&
					val?.skypeID.toLowerCase().includes(e.target.value.toLowerCase())) ||
				(val?.contactNumber &&
					val?.contactNumber
						.toLowerCase()
						.includes(e.target.value.toLowerCase()))
			);
		});

		return filteredData;
	},
	userDataFormatter: (d, id, base64Image, getUploadFileData, modifiedGEO) => {
		var _itemVal;
		if (d?.team?.id) {
			_itemVal = d.team.id;
		} else {
			_itemVal = d?.team
				?.map((a) => {
					return a.id;
				})
				.join(',');
		}

		const userFormDetails = {
			id: _isNull(id) ? 0 : id,
			employeeId: d?.employeeId ? d?.employeeId :"NA",
			name: `${d?.name
				?.split(' ')
				?.join('')} ${d?.name?.split(' ')?.join('')}`,
			isNewUser: d.isNewUser === 'true' ? true : false,
			userTypeId: d.userType?.id ? d.userType?.id : 0,
			roleId: 0,
			isOdr: d?.odrPool ? d?.odrPool : true,
			managerID: d?.salesManager?.id ? d?.salesManager?.id : 0,
			priorityCount: _isNull(d.priorityCount) ? 0 : parseInt(d.priorityCount),
			skypeId: d?.skypeID ? d?.skypeID : '',
			email: d?.email ? d?.email : "NA",
			designation: d?.designation ? d?.designation :"NA",
			description: d?.description ? d?.description : '',
			isActive: d?.isActive ? d?.isActive : true,
			userLevel: d?.userLevel ? d?.userLevel : 'NA',
			fileUpload: {
				base64ProfilePic: base64Image ? base64Image : '',
				extenstion: getUploadFileData?.type?.slice(6)
					? getUploadFileData?.type?.slice(6)
					: '',
			},
			manager:d?.manager?d?.manager:"NA",
			department: d?.department ? d?.department:"NA" ,
			TeamID: d?.departMent?.id?.toString() === '4' ? '0' : _itemVal.toString(),
			LevelID: d?.departMent?.id === 4 ? 0 : d?.level?.id,
			profilePic: '',
			geoIds: modifiedGEO ? modifiedGEO : [0],
			userHierarchyParentID: d?.reportingUser?.id ? d?.reportingUser?.id : 0,
			contactNumber: d?.primaryClientPhoneNumber
				? d?.primaryClientPhoneNumber
				: '',
			detail: {
				userTypeID: 0,
				userTypeList: [
					{
						id: 0,
						value: '',
						text: '',
						disabled: true,
						group: '',
						seletected: true,
						color: '',
					},
				],
				userRoleID: 0,
				userRoleList: [
					{
						id: 0,
						value: '',
						text: '',
						disabled: true,
						group: '',
						seletected: true,
						color: '',
					},
				],
				talentRoleList: [
					{
						id: 0,
						value: '',
						text: '',
						disabled: true,
						group: '',
						seletected: true,
						color: '',
					},
				],
				teamManagerID: 0,
				teamManagerList: [
					{
						id: 0,
						value: '',
						text: '',
						disabled: true,
						group: '',
						seletected: true,
						color: '',
					},
				],
				reporteeUserID: 0,
				reporteeUserList: [
					{
						id: 0,
						value: '',
						text: '',
						disabled: true,
						group: '',
						seletected: true,
						color: '',
					},
				],
				geoIDs: [0],
				geoList: [
					{
						id: 0,
						value: '',
						text: '',
						disabled: true,
						group: '',
						seletected: true,
						color: '',
					},
				],
				reportingUsers: [
					{
						disabled: true,
						group: {
							disabled: true,
							name: 'string',
						},
						selected: true,
						text: 'string',
						value: 'string',
					},
				],
			},
		};
		return userFormDetails;
	},
};
