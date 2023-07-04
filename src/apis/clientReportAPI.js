import { ClientReportAPI, NetworkInfo, SubDomain } from 'constants/network';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { HttpServices } from 'shared/services/http/http_service';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const clientReportAPI = {
	getClientReportRequest: async (Data) => {
		try {
			let httpService = new HttpServices();
			httpService.URL = NetworkInfo.NETWORK + SubDomain.REPORT + SubDomain.CLIENT_REPORT + ClientReportAPI.GET_CLIENT_REPORT;
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
			httpService.URL = NetworkInfo.NETWORK + SubDomain.REPORT + SubDomain.CLIENT_REPORT + ClientReportAPI.GET_CLIENT_POPUP_REPORT;
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
			httpService.URL = NetworkInfo.NETWORK + SubDomain.REPORT + SubDomain.CLIENT_REPORT + ClientReportAPI.GET_CLIENT_FILTERS;
			httpService.setAuthRequired = true;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'clientReportAPI.getClientReportFiltersRequest');
		}
	},
};
