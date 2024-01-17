import { NetworkInfo, SubDomain, UtmTrackingReport } from 'constants/network';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { HttpServices } from 'shared/services/http/http_service';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const utmTrackingReportAPI = {
	utmTrackingReportList: async (data) => {
		try {
			let httpService = new HttpServices();
			httpService.URL =
			NetworkInfo.NETWORK + SubDomain.REPORT + UtmTrackingReport.UTM_TRACKING_REPORT + UtmTrackingReport.UTM_TRACKING_REPORT_LIST;
			httpService.setAuthRequired = true;
			httpService.dataToSend = data;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'utmTrackingReportList');
		}
	},
	utmTrackingReportFilters: async () => {
		try {
			let httpService = new HttpServices();
			httpService.URL =
			NetworkInfo.NETWORK + SubDomain.REPORT + UtmTrackingReport.GET_UTM_TRACKING_FILTERS;
			httpService.setAuthRequired = true;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'utmTrackingReportFilters');
		}
	},
	utmTrackingLeadDetailPopUP:async (data) => {
		try {
			let httpService = new HttpServices();
			httpService.URL =
			NetworkInfo.NETWORK + SubDomain.REPORT + UtmTrackingReport.UTM_TRACKING_LEAD_DETAIL_REPORT + UtmTrackingReport.UTM_TRACKING_LEAD_DETAIL_REPORT_LIST;
			httpService.setAuthRequired = true;
			httpService.dataToSend = data;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'utmTrackingLeadDetailPopUP');
		}
	}
};
