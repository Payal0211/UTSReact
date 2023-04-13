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
		console.log(modifiedGEO, "modifiedGEO")
		const userFormDetails = {
			id: _isNull(id) ? 0 : id,
			employeeId: d?.employeeId,
			fullName: `${d?.employeeFirstName?.split(" ")?.join("")} ${d?.employeeLastName?.split(" ")?.join("")}`,
			isNewUser: d.isNewUser === 'true' ? true : false,
			userTypeId: d.userType?.id ? d.userType?.id : 0,
			roleId: 0,
			isOdr: d?.odrPool ? d?.odrPool : true,
			managerID: d?.salesManager?.id ? d?.salesManager?.id : 0,
			priorityCount: _isNull(d.priorityCount) ? 0 : parseInt(d.priorityCount),
			skypeId: d?.skypeID ? d?.skypeID : '',
			emailId: d?.emailID,
			designation: d?.employeeDesignation,
			description: d?.description ? d?.description : '',
			isActive: d?.isActive ? d?.isActive : true,
			fileUpload: {
				base64ProfilePic: base64Image ? base64Image : '',
				extenstion: getUploadFileData?.type?.slice(6) ? getUploadFileData?.type?.slice(6) : ''
			},
			DeptID: d?.departMent?.id,
			TeamID: d?.team?.id,
			LevelID: d?.level?.id,
			profilePic: "",
			geoIds: modifiedGEO,
			userHierarchyParentID: d?.reportingUser?.id ? d?.reportingUser?.id : 0,
			contactNumber: d?.primaryClientPhoneNumber ? d?.primaryClientPhoneNumber : '',
			detail: {
				userTypeID: 0,
				userTypeList: [
					{
						id: 0,
						value: "",
						text: "",
						disabled: true,
						group: "",
						seletected: true,
						color: ""
					}
				],
				userRoleID: 0,
				userRoleList: [
					{
						id: 0,
						value: "",
						text: "",
						disabled: true,
						group: "",
						seletected: true,
						color: ""
					}
				],
				talentRoleList: [
					{
						id: 0,
						value: "",
						text: "",
						disabled: true,
						group: "",
						seletected: true,
						color: ""
					}
				],
				teamManagerID: 0,
				teamManagerList: [
					{
						id: 0,
						value: "",
						text: "",
						disabled: true,
						group: "",
						seletected: true,
						color: ""
					}
				],
				reporteeUserID: 0,
				reporteeUserList: [
					{
						id: 0,
						value: "",
						text: "",
						disabled: true,
						group: "",
						seletected: true,
						color: ""
					}
				],
				geoIDs: [0],
				geoList: [
					{
						id: 0,
						value: "",
						text: "",
						disabled: true,
						group: "",
						seletected: true,
						color: ""
					}
				],
				reportingUsers: [
					{
						disabled: true,
						group: {
							disabled: true,
							name: "string"
						},
						selected: true,
						text: "string",
						value: "string"
					}
				]


			},

		};
		return userFormDetails;
	},
};
