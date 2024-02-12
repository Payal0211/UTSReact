import { NetworkInfo, SubDomain, ClientPortalTrackingReport } from 'constants/network';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { HttpServices } from 'shared/services/http/http_service';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const clientPortalTrackingReportAPI = {
	clientPortalTrackingReportFilter: async () => {
		try {
			let httpService = new HttpServices();
			httpService.URL =
			NetworkInfo.NETWORK + SubDomain.REPORT + ClientPortalTrackingReport.CLIENT_PORTAL_TRACKING_FILTER
			httpService.setAuthRequired = true;
			// httpService.dataToSend = data;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'utmTrackingReportList');
		}
	},
	clientPortalTrackingReportList: async (data) => {
		try {
			let httpService = new HttpServices();
			httpService.URL =
			NetworkInfo.NETWORK + SubDomain.REPORT + ClientPortalTrackingReport.CLIENT_PORTAL_TRACKING_LIST
			httpService.setAuthRequired = true;
			httpService.dataToSend = data;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'utmTrackingReportList');
		}
	},
	clientPortalTrackingReportPopupList: async (data) => {
		try {
			let httpService = new HttpServices();
			httpService.URL =
			NetworkInfo.NETWORK + SubDomain.REPORT + ClientPortalTrackingReport.CLIENT_PORTAL_TRACKING_POPUP_LIST
			httpService.setAuthRequired = true;
			httpService.dataToSend = data;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'utmTrackingReportList');
		}
	},
};
