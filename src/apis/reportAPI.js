import {
	NetworkInfo,
	ReportType,
	ReportsAPI,
	ReportsType,
	SubDomain,
} from 'constants/network';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { HttpServices } from 'shared/services/http/http_service';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const ReportAPI = {
	demandFunnelListingRequest: async function (reportData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.DEMAND_FUNNEL +
			ReportsAPI.LISTING;
		httpService.setAuthRequired = true;
		httpService.dataToSend = reportData;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.demandFunnelListingRequest');
		}
	},
	demandFunnelSummary: async function (reportData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.DEMAND_FUNNEL +
			ReportsAPI.SUMMARY;
		httpService.setAuthRequired = true;
		httpService.dataToSend = reportData;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.demandFunnelSummary');
		}
	},
	demandFunnelFilters: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.DEMAND_FUNNEL +
			ReportsAPI.FILTERS;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.demandFunnelFilters');
		}
	},
};
