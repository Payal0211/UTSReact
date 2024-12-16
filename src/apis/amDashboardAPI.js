import { AMDashboardAPI, ClientsAPI, NetworkInfo, SubDomain } from 'constants/network';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { HttpServices } from 'shared/services/http/http_service';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const amDashboardAPI = {
    getFiltersRequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.AMDASHBOARD +
			AMDashboardAPI.FILTERS 
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'amDashboardAPI.getPOCRequest');
		}
	},
    getDashboardRequest: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.AMDASHBOARD +
			AMDashboardAPI.GET_AM_DASHBOARD
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
        httpService.dataToSend = payload
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'amDashboardAPI.getPOCRequest');
		}
	},
    getRenewalRequest: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.AMDASHBOARD +
			AMDashboardAPI.GET_AM_RENEWALS
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
        httpService.dataToSend = payload
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'amDashboardAPI.getRenewalRequest');
		}
	},
    getSummaryRequest: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.AMDASHBOARD +
			AMDashboardAPI.GET_SUMMARY
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
        httpService.dataToSend = payload
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'amDashboardAPI.getSummaryRequest');
		}
	},
    getZohoTicketsRequest: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.AMDASHBOARD +
			AMDashboardAPI.GET_ZOHO_TICKETS
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
        httpService.dataToSend = payload
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'amDashboardAPI.getZohoTicketsRequest');
		}
	},
}