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
	/** ------------ supply FUNNEL ---------------- */
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
	demandFunnelHRDetailsRequest: async function (reportData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.DEMAND_FUNNEL +
			ReportsAPI.HRDETAILS;
		httpService.setAuthRequired = true;
		httpService.dataToSend = reportData;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.demandFunnelHRDetailsRequest');
		}
	},
	/**------------- SUPPLY FUNNEL  -------------------- */
	supplyFunnelListingRequest: async function (reportData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.SUPPLY_FUNNEL +
			ReportsAPI.LISTING;
		httpService.setAuthRequired = true;
		httpService.dataToSend = reportData;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.supplyFunnelListingRequest');
		}
	},
	supplyFunnelSummary: async function (reportData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.SUPPLY_FUNNEL +
			ReportsAPI.SUMMARY;
		httpService.setAuthRequired = true;
		httpService.dataToSend = reportData;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.supplyFunnelSummary');
		}
	},
	supplyFunnelFilters: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.SUPPLY_FUNNEL +
			ReportsAPI.FILTERS;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.supplyFunnelFilters');
		}
	},
	supplyFunnelHRDetailsRequest: async function (reportData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.SUPPLY_FUNNEL +
			ReportsAPI.HRDETAILS;
		httpService.setAuthRequired = true;
		httpService.dataToSend = reportData;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.supplyFunnelHRDetailsRequest');
		}
	},
	/**------------- TEAM DEMAND FUNNEL  -------------------- */
	teamDemandFunnelListingRequest: async function (reportData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.TEAM_DEMAND_FUNNEL +
			ReportsAPI.LISTING;
		httpService.setAuthRequired = true;
		httpService.dataToSend = reportData;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.teamDemandFunnelListingRequest');
		}
	},
	teamDemandFunnelSummaryRequest: async function (reportData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.TEAM_DEMAND_FUNNEL +
			ReportsAPI.SUMMARY;
		httpService.setAuthRequired = true;
		httpService.dataToSend = reportData;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.teamDemandFunnelSummaryRequest');
		}
	},
	teamDemandFunnelFilters: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.TEAM_DEMAND_FUNNEL +
			ReportsAPI.FILTERS;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.teamDemandFunnelFilters');
		}
	},
	teamDemandFunnelHRDetailsRequest: async function (reportData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.TEAM_DEMAND_FUNNEL +
			ReportsAPI.HRDETAILS;
		httpService.setAuthRequired = true;
		httpService.dataToSend = reportData;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.teamDemandFunnelHRDetailsRequest');
		}
	},
	jdParsingDumpReportRequest: async function (reportData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.JD_PARSING_DUMP +
			ReportsAPI.JD_PARSING_DUMP_REPORT;
		httpService.setAuthRequired = true;
		httpService.dataToSend = reportData;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.jdParsingDumpReportRequest');
		}
	},
	OverAllSLASummaryRequest: async function (data) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.SLA_REPORT +
			ReportsAPI.OVER_ALL_SLA_SUMMARY;
		httpService.setAuthRequired = true;
		httpService.dataToSend = data;
		httpService.setAuthToken = UserSessionManagementController?.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.OverAllSLASummaryRequest');
		}
	},
};
