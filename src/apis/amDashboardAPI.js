import { AMDashboardAPI, ClientsAPI, LeaveRequestAPI, NetworkInfo, SubDomain } from 'constants/network';
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
    getTicketHistoryRequest: async function (id) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.ZOHO_NETWORK + AMDashboardAPI.GET_TICKET_HISTORY + `?ticketNumber=${id}`
		httpService.setAuthRequired = true;
		httpService.setAuthToken = NetworkInfo.ZOHO_AUTH;
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'amDashboardAPI.getTicketHistoryRequest');
		}
	},
    getTicketConversationRequest: async function (id) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.ZOHO_NETWORK + AMDashboardAPI.GET_TICKET_CONVERSATION + `?ticketNumber=${id}`
		httpService.setAuthRequired = true;
		httpService.setAuthToken = NetworkInfo.ZOHO_AUTH;
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'amDashboardAPI.getTicketHistoryRequest');
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
    getTalentLeaveRequest: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
            NetworkInfo.ZOHO_NETWORK +
			SubDomain.LEAVE_REQUEST +
			LeaveRequestAPI.GET_TALENT_LEAVES + `?talentID=${payload.talentID}${payload.companyId ? `&companyId=${payload.companyId}`:''}${payload.month ? `&month=${payload.month}`:''}${payload.year ? `&year=${payload.year}`:''}${payload.onboardID ? `&onboardID=${payload.onboardID}`:''}`
		httpService.setAuthRequired = true;
		httpService.setAuthToken = NetworkInfo.ZOHO_AUTH;
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'amDashboardAPI.getTalentLeaveRequest');
		}
	},
	getDeployedFiltersRequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
            NetworkInfo.NETWORK +
			SubDomain.REPORT +
			AMDashboardAPI.DEPLOYED_TALENT_FILTER
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'amDashboardAPI.getDeployedFiltersRequest');
		}
	},
    getCalenderLeaveRequest: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
            NetworkInfo.ZOHO_NETWORK +
			SubDomain.LEAVE_REQUEST +
			LeaveRequestAPI.GET_CALENDER_LEAVES + `?talentID=${payload.talentId}&month=${payload.month}&year=${payload.year}${payload.companyId ? `&companyId=${payload.companyId}`:''}`
		httpService.setAuthRequired = true;
		httpService.setAuthToken = NetworkInfo.ZOHO_AUTH;
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'amDashboardAPI.getCalenderLeaveRequest');
		}
	},
    updateLeaveRequest: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
            NetworkInfo.ZOHO_NETWORK +
			SubDomain.LEAVE_REQUEST +
			LeaveRequestAPI.GET_UPDATE_LEAVE 
		httpService.setAuthRequired = true;
		httpService.setAuthToken = NetworkInfo.ZOHO_AUTH;
        httpService.dataToSend = payload
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'amDashboardAPI.updateLeaveRequest');
		}
	},
	approveRejectLeaveRequest: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
            NetworkInfo.ZOHO_NETWORK +
			SubDomain.LEAVE_REQUEST +
			LeaveRequestAPI.APPROVE_REJECT_LEAVE
		httpService.setAuthRequired = true;
		httpService.setAuthToken = NetworkInfo.ZOHO_AUTH;
        httpService.dataToSend = payload
		try {
			let response = await httpService.sendFileDataPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'amDashboardAPI.approveRejectLeaveRequest');
		}
	},
	getLeaveTypesRequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
            NetworkInfo.ZOHO_NETWORK +
			SubDomain.LEAVE_REQUEST +
			LeaveRequestAPI.GET_LEAVE_TYPES
		httpService.setAuthRequired = true;
		httpService.setAuthToken = NetworkInfo.ZOHO_AUTH;

		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'amDashboardAPI.getLeaveTypesRequest');
		}
	},
	getLeaveHistoryRequest: async function (talentID,onboardID) {
		let httpService = new HttpServices();
		httpService.URL =
            NetworkInfo.ZOHO_NETWORK +
			SubDomain.LEAVE_REQUEST +
			LeaveRequestAPI.GET_LEAVE_HISTORY + `?talentID=${talentID}&onBoardId=${onboardID}`
		httpService.setAuthRequired = true;
		httpService.setAuthToken = NetworkInfo.ZOHO_AUTH;

		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'amDashboardAPI.getLeaveHistoryRequest');
		}
	},
}