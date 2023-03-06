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
};
