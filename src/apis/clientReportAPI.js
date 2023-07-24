import { ClientReportAPI, NetworkInfo, SubDomain,UserAPI,ReportsAPI } from 'constants/network';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { HttpServices } from 'shared/services/http/http_service';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const clientReportAPI = {
	getClientReportRequest: async (Data) => {
		try {
			let httpService = new HttpServices();
			httpService.URL = NetworkInfo.NETWORK + SubDomain.REPORT + SubDomain.CLIENT_BASED_REPORT_WITHHUB_SPOT + UserAPI.LIST;
			httpService.setAuthRequired = true;
			httpService.dataToSend = Data;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'clientReportAPI.getClientReportRequest');
		}
	},
	getClientPopUPReportRequest: async (Data) => {
		try {
			let httpService = new HttpServices();
			httpService.URL = NetworkInfo.NETWORK + SubDomain.REPORT + SubDomain.CLIENT_BASED_REPORT_WITHHUB_SPOT + ClientReportAPI.GET_CLIENT_POPUP_REPORT;
			httpService.setAuthRequired = true;
			httpService.dataToSend = Data;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'clientReportAPI.getClientPopUPReportRequest');
		}
	},
	getClientReportFiltersRequest: async () => {
		try {
			let httpService = new HttpServices();
			httpService.URL = NetworkInfo.NETWORK + SubDomain.REPORT + SubDomain.CLIENT_BASED_REPORT_WITHHUB_SPOT + ClientReportAPI.GET_CLIENT_FILTERS;
			httpService.setAuthRequired = true;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'clientReportAPI.getClientReportFiltersRequest');
		}
	},
	getHRReportRequest: async (Data) => {
		try {
			let httpService = new HttpServices();
			httpService.URL = NetworkInfo.NETWORK + SubDomain.REPORT + SubDomain.HR_REPORT + UserAPI.LIST;
			httpService.setAuthRequired = true;
			httpService.dataToSend = Data;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'clientReportAPI.getHRReportRequest');
		}
	},
	getHRReportFiltersRequest: async () => {
		try {
			let httpService = new HttpServices();
			httpService.URL = NetworkInfo.NETWORK + SubDomain.REPORT + SubDomain.HR_REPORT + ReportsAPI.FILTERS;
			httpService.setAuthRequired = true;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'clientReportAPI.getHRReportFiltersRequest');
		}
	},
	getHRPopUPReportRequest: async (Data) => {
		try {
			let httpService = new HttpServices();
			httpService.URL = NetworkInfo.NETWORK + SubDomain.REPORT + SubDomain.HR_REPORT + ClientReportAPI.POPUP_FILTERS;
			httpService.setAuthRequired = true;
			httpService.dataToSend = Data;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'clientReportAPI.getHRPopUPReportRequest');
		}
	},
};
