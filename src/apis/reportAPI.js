import {
	NetworkInfo,
	ReportType,
	ReportsAPI,
	ReportsType,
	SubDomain,
	UserAPI,
	UsersAPI,
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


	SlaDetailsData: async function (data) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.SLA_REPORT +
			ReportsAPI.SLA_DETAILED_DATA;
		httpService.setAuthRequired = true;
		httpService.dataToSend = data;
		httpService.setAuthToken = UserSessionManagementController?.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.SlaDetailsData');
		}
	},
	slaFilter: async function (data) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.SLA_REPORT +
			ReportsAPI.SLA_FILTER;
		httpService.setAuthRequired = true;
		httpService.dataToSend = data;
		httpService.setAuthToken = UserSessionManagementController?.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.slaFilter');
		}
	},
	// lost HR Report 

	getLostHRReport: async function (reportData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.HR_LOST_REPORT + UserAPI.LIST

		httpService.setAuthRequired = true;
		httpService.dataToSend = reportData;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.getLostHRReport');
		}
	},
	getLostHRTalentDetails: async function (ID) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.HR_LOST_REPORT + ReportsAPI.TALENT_DETAIL_POPUP + `?HRID=${ID}`

		httpService.setAuthRequired = true;
		httpService.dataToSend = {}
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.getLostHRTalentDetails');
		}
	},

	getReplacementReport: async function (reportData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.REPLACEMENT_REPORT

		httpService.setAuthRequired = true;
		httpService.dataToSend = reportData;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.getReplacementReport');
		}
	},

	getTalentBackoutReport: async function (reportData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.TALENT_BACKOUT_REPORT

		httpService.setAuthRequired = true;
		httpService.dataToSend = reportData;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.getTalentBackoutReport');
		}
	},
	getTalentRejectReport: async function (reportData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.TALENT_REJECT_REPORT

		httpService.setAuthRequired = true;
		httpService.dataToSend = reportData;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.getTalentRejectReport');
		}
	},
	getTalentInterviewRoundReport: async function (reportData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.TALENT_INTERVIEW_ROUNDS_REPORT

		httpService.setAuthRequired = true;
		httpService.dataToSend = reportData;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.getTalentInterviewRoundReport');
		}
	},
	getTalentDocumentReport: async function (reportData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.TALENT_DOCUMENT_REPORT

		httpService.setAuthRequired = true;
		httpService.dataToSend = reportData;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.getTalentDocumentReport');
		}
	},
	getZohoInvoiceReport: async function (reportData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.ZOHO_INVOICE_REPORT

		httpService.setAuthRequired = true;
		httpService.dataToSend = reportData;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.getZohoInvoiceReport');
		}
	},
	getZohoInvoiceCustomerReport: async function (reportData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.ZOHO_INVOICE_CUSTOMER_REPORT

		httpService.setAuthRequired = true;
		httpService.dataToSend = reportData;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.getZohoInvoiceCustomerReport');
		}
	},

	getLeaveTakenReport: async function (reportData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.TALENT_LEAVE_TAKEN_REPORT

		httpService.setAuthRequired = true;
		httpService.dataToSend = reportData;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.getLeaveReport');
		}
	},
	getRecruiterReport: async function (reportData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.RECRUITER_REPORT

		httpService.setAuthRequired = true;
		httpService.dataToSend = reportData;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.getRecruiterReport');
		}
	},
	getDailySnapshotReport: async function (snapshotData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.DAILY_SNAPSHOT_REPORT

		httpService.setAuthRequired = true;
		httpService.dataToSend = snapshotData;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.getDailySnapshotReport');
		}
	},
	getTalentOnboardReport: async function (reportData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.TALENT_ONBOARD_REPORT

		httpService.setAuthRequired = true;
		httpService.dataToSend = reportData;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.getTalentOnboardReport');
		}
	},
	getAllNotesReport: async function (reportData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.ALL_TALENTS_NOTES

		httpService.setAuthRequired = true;
		httpService.dataToSend = reportData;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.getAllNotesReport');
		}
	},
	getClientDashboardReport: async function (reportData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.CLIENT_DASHBOARD_REPORT

		httpService.setAuthRequired = true;
		httpService.dataToSend = reportData;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.getClientDashboardReport');
		}
	},
	getAMReport:async function (reportData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.AM_WEEK_WISE_REPORT

		httpService.setAuthRequired = true;
		httpService.dataToSend = reportData;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.getAMReport');
		}
	},
	getAMReportFilters : async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.AM_WEEK_WISE_REPORT_FILTERS

		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.getAMReportFilters');
		}
	},
	MapZohoCustomerToUTSCompanyAPI: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.MASTERS +
			UsersAPI.MASTER_ZOHO_CUSTOMER_TO_UTS_COMPANY+`?CompanyID=${payload?.CompanyID}&ZohoCustmerID=${payload?.ZohoCustmerID}`
			
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'TaDashboardAPI.addOrUpdateTAMonthlyGoalAPI');
		}
	},
	DailyBusinessNumbersAPI:async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.DAILY_BUSINESS_NUMBERS

		httpService.setAuthRequired = true;
		httpService.dataToSend = payload;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.DailyBusinessNumbersAPI');
		}
	},	
	PotentialClosuresListAPI:async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.POTENTIAL_CLOSURES_LIST

		httpService.setAuthRequired = true;
		httpService.dataToSend = payload;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.PotentialClosuresListAPI');
		}
	},
};
