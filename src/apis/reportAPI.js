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
	getCompanyCategoryListRequest: async function (reportData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.COMPANY_WISE_CATEGORY +`?searchText=${reportData}`

		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.getCompanyCategoryListRequest');
		}
	},
	getCompanywiseActiveHRListRequest:async function (id) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.COMPANY_WISE_CATEGORY_DETAILS +`?companyID=${id}`

		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.getCompanywiseActiveHRListRequest');
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
	getImmediateJoinerReport: async function (reportData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.GET_IMMEDIATE_JOINERS + `?searchText=${reportData.searchText}&fromDate=${reportData.fromDate}&toDate=${reportData.toDate}&month=${reportData.month}&year=${reportData.year}`

		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.getImmediateJoinerReport');
		}
	},
	getRecruiterDashboardReport: async function (reportData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.RECRUITER_DASHBOARD_REPORT

		httpService.setAuthRequired = true;
		httpService.dataToSend = reportData;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.getRecruiterDashboardReport');
		}
	},
	getInterviewRescheduleDashboardReport: async function (reportData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.INTERVIEW_RESCHEDULE_DASHBOARD + `?fromDate=${reportData.fromDate}&month=${reportData.month}&searchText=${reportData.searchText}&taUserIDs=${reportData.taUserIDs}&toDate=${reportData.toDate}&year=${reportData.year}`

		httpService.setAuthRequired = true;
		// httpService.dataToSend = reportData;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.getInterviewRescheduleDashboardReport');
		}
	},
	getAverageSLAdReportReport: async function (reportData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.AVERAGE_SLA + `?fromDate=${reportData.fromDate}&month=${reportData.month}&searchText=${reportData.searchText}&taUserIDs=${reportData.taUserIDs}&toDate=${reportData.toDate}&year=${reportData.year}`

		httpService.setAuthRequired = true;
		// httpService.dataToSend = reportData;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.getAverageSLAdReportReport');
		}
	},
	getAMReport:async function (reportData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.AM_WEEK_WISE_REPORT_NEW + `?hr_BusinessType=${reportData?.hr_BusinessType}&month=${reportData?.month}&year=${reportData?.year}&hrType=${reportData?.hrType}`

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
	getSummeryAMReport:async function (reportData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.AM_WISE_CLOSURES_SUMMARY  + `?hr_BusinessType=${reportData?.hr_BusinessType}&month=${reportData?.month}&year=${reportData?.year}`

		httpService.setAuthRequired = true;
		httpService.dataToSend = reportData;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.getSummeryAMReport');
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
	PotentialClosuresMonthWiseListAPI:async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.POTENTIAL_MONTH_WISE_CLOSURES_LIST + `?month=${payload.month}&year=${payload.year}&hr_BusinessType=${payload.hr_BusinessType}`

		httpService.setAuthRequired = true;
		httpService.dataToSend = payload;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.PotentialClosuresMonthWiseListAPI');
		}
	},
	PotentialClosuresUpdateAPI:async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.MASTERS +
			ReportType.POTENTIAL_CLOSURES_UPDATE + `?HRID=${payload?.HRID}
			&PotentialCloserList_ID=${payload?.PotentialCloserList_ID}
			&ProbabiltyRatio_thismonth=${payload?.ProbabiltyRatio_thismonth}
			&Expected_Closure_Week=${payload?.Expected_Closure_Week}
			&Actual_Closure_Week=${payload?.Actual_Closure_Week}
			&Pushed_Closure_Week=${payload?.Pushed_Closure_Week}
			&Talent_NoticePeriod=${payload?.Talent_NoticePeriod}
			&Talent_Backup=${payload?.Talent_Backup}
			&OwnerID=${payload?.OwnerID}`

		httpService.setAuthRequired = true;
		// httpService.dataToSend = payload;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.PotentialClosuresUpdateAPI');
		}
	},
	PotentialOwnerUserAPI:async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.ACTIVE_OWNER_USER

		httpService.setAuthRequired = true;
		// httpService.dataToSend = payload;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.PotentialOwnerUserAPI');
		}
	},
getALLPotentialClosuresCommentsAPI:async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.GET_POTENTIAL_COMMENTS + `?potentialCloserListID=${payload.potentialCloserListID}&hrID=${payload.hrID}`

		httpService.setAuthRequired = true;
		httpService.dataToSend = payload;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.getALLPotentialClosuresCommentsAPI');
		}
	},
	getProbabilityReportAPI:async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.GET_PROBABILITY_RATIO_DETAILS + `?hr_BusinessType=${payload.hr_BusinessType}&optiontype=${payload.optiontype}&weekno=${payload.weekno}`

		httpService.setAuthRequired = true;
		httpService.dataToSend = payload;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.getALLPotentialClosuresCommentsAPI');
		}
	},
	insertPotentialClosuresCommentsAPI:async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.INSERT_POTENTIAL_COMMENTS

		httpService.setAuthRequired = true;
		httpService.dataToSend = payload;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.insertPotentialClosuresCommentsAPI');
		}
	},
	revenueBusinessReportAPI:async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.GET_MONTHLY_REVENUE_BUSINESS_REPORT + `?hrBusinessType=${payload?.hrBusinessType}&month=${payload?.month}&year=${payload?.year}`

		httpService.setAuthRequired = true;
		// httpService.dataToSend = payload;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.PotentialClosuresUpdateAPI');
		}
	},
		getHrTAWiseReportAPI:async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.GET_HR_TALENT_WISE_REPORT+ `?hrBusinessType=${payload?.hrBusinessType}&month=${payload?.month}&year=${payload?.year}&userCategory=${payload?.userCategory}&businessType=${payload?.businessType}&stageID=${payload?.stageID}&amID=${payload?.amID}`

		httpService.setAuthRequired = true;
		// httpService.dataToSend = payload;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.getHrTAWiseReportAPI');
		}
	},
	getNBDorAMRevenueAPI:async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.NBD_AM_REVENUE_BUSINESS + `?hrBusinessType=${payload?.hrBusinessType}&month=${payload?.month}&year=${payload?.year}&userCategory=${payload?.userCategory}`

		httpService.setAuthRequired = true;
		// httpService.dataToSend = payload;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.getNBDorAMRevenueAPI');
		}
	},
	AMWiseInterviewCountsAPI:async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.AM_WISE_INTERVIEW_COUNTS + `?targetDate=${payload?.targetDate}`

		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.AMWiseInterviewCountsAPI');
		}
	},
	ScreenInterviewRejectCountsAPI:async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT +
			ReportType.SCREEN_INTERVIEW_REJECT_COUNT + `?searchText=${payload?.searchText}&rejectionCount=${payload.rejectionCount ?? ''}&rejectionCountOption=${payload.rejectionCountOption}&reportTabs=${payload.reportTabs}`

		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.ScreenInterviewRejectCountsAPI');
		}
	},
	rejectedTalentsDetailsAPI:async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.REPORT + ReportType.GET_HR_REJECTED_TALENT_FOR_COMPANY
			// ReportType.GET_REJECTED_TALENTS 
			+ `?companyID=${payload.companyID}&rejectType=${payload.rejectType}&hrID=${payload.hrID}${payload.roundCount ? `&roundCount=${payload.roundCount}` : ''}`

		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ReportAPI.rejectedTalentsDetailsAPI');
		}
	},
	GetAMWiseTalentInterviewDetails:async function (payload) {
	let httpService = new HttpServices();
	httpService.URL =
		NetworkInfo.NETWORK +
		SubDomain.REPORT +
		ReportType.GET_DAILY_AM_WISE_HR_TALENT_INTERVIEW_DETAILS + `?targetDate=${payload?.targetDate}&amId=${payload?.amId}&Round=${payload?.Round}`

	httpService.setAuthRequired = true;
	httpService.setAuthToken = UserSessionManagementController.getAPIKey();
	try {
		let response = await httpService.sendGetRequest();
		return response;
	} catch (error) {
		return errorDebug(error, 'ReportAPI.GetAMWiseTalentInterviewDetails');
	}
	},

};
