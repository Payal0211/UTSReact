import { NetworkInfo, SubDomain, UserAPI, UsersAPI } from 'constants/network';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { HttpServices } from 'shared/services/http/http_service';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const userAPI = {
	login: async function (userdata) {
		let httpservices = new HttpServices();
		httpservices.dataToSend = userdata;
		httpservices.URL =
			NetworkInfo.NETWORK + SubDomain.USER_OPERATIONS + UserAPI.LOGIN;
		try {
			let response = await httpservices.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'UserAPI.Login');
		}
	},
	logOut: async function () {
		try {
			let httpservices = new HttpServices();
		let userToken = UserSessionManagementController.getAPIKey()
		httpservices.setAuthRequired = true;
		httpservices.URL =
			NetworkInfo.NETWORK + SubDomain.USER_OPERATIONS + UserAPI.LOGOUT + `?token=${userToken}`;
		httpservices.setAuthToken = userToken
			let response = await httpservices.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'UserAPI.LogOut');
		}
	},
	getUserListRequest: async (userData) => {
		try {
			let httpService = new HttpServices();
			httpService.URL = NetworkInfo.NETWORK + SubDomain.USER + UsersAPI.LIST;
			httpService.setAuthRequired = true;
			httpService.dataToSend = userData;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'UserAPI.getUserListRequest');
		}
	},
	createUserRequest: async (userData) => {
		try {
			let httpService = new HttpServices();
			const miscData =
				UserSessionManagementController.getUserMiscellaneousData();
			httpService.URL =
				NetworkInfo.NETWORK +
				SubDomain.USER +
				UserAPI.ADD_NEW_USER +
				`?LoggedInUserId=${miscData?.loggedInUserTypeID}`;
			httpService.setAuthRequired = true;
			httpService.dataToSend = userData;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'UserAPI.createUserRequest');
		}
	},
	submitUTSFeedback: async (userData) => {
		try {
			let httpService = new HttpServices();
			
			httpService.URL =
				NetworkInfo.NETWORK +
				SubDomain.USER +
				UserAPI.UTS_FEEDBACK
			
			httpService.setAuthRequired = true;
			httpService.dataToSend = userData;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'UserAPI.submitUTSFeedback');
		}
	},
	getUserDetailsRequest: async (userData) => {
		try {
			let httpService = new HttpServices();

			httpService.URL =
				NetworkInfo.NETWORK +
				SubDomain.USER +
				UserAPI.GET_USER_DETAIL +
				`?userid=${userData?.userID}`;
			httpService.setAuthRequired = true;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'UserAPI.getUserDetailsRequest');
		}
	},
	getIsEmployeeIDExistRequest: async (userData) => {
		try {
			let httpService = new HttpServices();
			httpService.URL =
				NetworkInfo.NETWORK +
				SubDomain.USER +
				UserAPI.IS_EMPLOYEE_ID_EXIST +
				`?id=${userData?.userID}&employeeId=${userData?.employeeID}`;
			httpService.setAuthRequired = true;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'UserAPI.getIsEmployeeIDExistRequest');
		}
	},
	getIsEmployeeNameExistRequest: async (userData) => {
		try {
			let httpService = new HttpServices();
			httpService.URL =
				NetworkInfo.NETWORK +
				SubDomain.USER +
				UserAPI.IS_EMPLOYEE_NAME_EXIST +
				`?id=${userData?.userID}&employeeFullName=${userData?.employeeName}`;
			httpService.setAuthRequired = true;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'UserAPI.getIsEmployeeNameExistRequest');
		}
	},
	getDeparmentListRequest: async () => {
		try {
			let httpService = new HttpServices();
			httpService.URL =
				NetworkInfo.NETWORK +
				SubDomain.MASTERS +
				UsersAPI.DEPARTMENT
			httpService.setAuthRequired = true;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'UserAPI.getDeparmentListRequest');
		}
	},
	getTeamListRequest: async (departmentID) => {
		try {
			let httpService = new HttpServices();
			httpService.URL =
				NetworkInfo.NETWORK +
				SubDomain.MASTERS +
				UsersAPI.TEAM + `?departmentID=${departmentID}`;
			httpService.setAuthRequired = true;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'UserAPI.getTeamListRequest');
		}
	},
	getLevelListRequest: async () => {
		try {
			let httpService = new HttpServices();
			httpService.URL =
				NetworkInfo.NETWORK +
				SubDomain.MASTERS +
				UsersAPI.LEVEL
			httpService.setAuthRequired = true;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'UserAPI.getLevelListRequest');
		}
	},
	getReportingListRequest: async (deptId, levelId) => {
		try {
			let httpService = new HttpServices();
			httpService.URL =
				NetworkInfo.NETWORK +
				SubDomain.MASTERS +
				UsersAPI.REPORTING_USER + `?DeptID=${deptId}&LevelID=${levelId}`
			httpService.setAuthRequired = true;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'UserAPI.getReportingListRequest');
		}
	},
	changePasswordRequest:async (data) => {
		try {
			let httpService = new HttpServices();
			httpService.URL = NetworkInfo.NETWORK + SubDomain.USER_OPERATIONS + UserAPI.CHANGE_PASSWORD;
			httpService.setAuthRequired = true;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			httpService.dataToSend = data;
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error,'UserAPI.changePasswordRequest');
		}
	}
};
