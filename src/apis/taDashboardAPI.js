import { NetworkInfo, SubDomain, TaDashboardURL } from 'constants/network';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { HttpServices } from 'shared/services/http/http_service';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const TaDashboardAPI = {
	getAllMasterRequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.TA_DASHBOARD +
			TaDashboardURL.GET_ALL_MASTER_Data
			
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'TaDashboardAPI.getAllMasterRequest');
		}
	},
    getAllTAListRequest: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.TA_DASHBOARD +
			TaDashboardURL.GET_TA_TASK_DETAILS
			
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
        httpService.dataToSend = payload
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'TaDashboardAPI.getAllTAListRequest');
		}
	},
    updateTAListRequest: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.TA_DASHBOARD +
			TaDashboardURL.UPDATE_TA_TASK
			
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
        httpService.dataToSend = payload
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'TaDashboardAPI.updateTAListRequest');
		}
	},
    getTACompanyListRequest: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.TA_DASHBOARD +
			TaDashboardURL.GET_TA_COMPANY_List
			
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
        httpService.dataToSend = payload
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'TaDashboardAPI.getTACompanyListRequest');
		}
	},
    getTAHRListFromCompanyRequest: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.TA_DASHBOARD +
			TaDashboardURL.GET_HR_LIST_COMPANY
			
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
        httpService.dataToSend = payload
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'TaDashboardAPI.getTAHRListFromCompanyRequest');
		}
	},
    getHRTalentDetailsRequest: async function (id) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.TA_DASHBOARD +
			TaDashboardURL.GET_HR_TALENT_DETAILS + `?hrID=${id}`
			
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'TaDashboardAPI.getHRTalentDetailsRequest');
		}
	},
    getGoalsDetailsRequest: async function (pl) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.TA_DASHBOARD +
			TaDashboardURL.GET_TA_TARGETS
			
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
        httpService.dataToSend = pl
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'TaDashboardAPI.getGoalsDetailsRequest');
		}
	},
    geAllTAUSERSRequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.TA_DASHBOARD +
			TaDashboardURL.ALL_TA_USERS
			
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'TaDashboardAPI.geAllTAUSERSRequest');
		}
	},
    insertTaskCommentRequest: async function (pl) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.TA_DASHBOARD +
			TaDashboardURL.INSERT_TASK_COMMENT
			
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
        httpService.dataToSend = pl
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'TaDashboardAPI.insertTaskCommentRequest');
		}
	},
    getALLCommentsRequest: async function (id) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.TA_DASHBOARD +
			TaDashboardURL.GET_ALL_COMMENTS + `?taskId=${id}`
			
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'TaDashboardAPI.getALLCommentsRequest');
		}
	},
    removeTasksRequest: async function (id) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.TA_DASHBOARD +
			TaDashboardURL.REMOVE_TASK + `?taskId=${id}`
			
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'TaDashboardAPI.removeTasksRequest');
		}
	},
}