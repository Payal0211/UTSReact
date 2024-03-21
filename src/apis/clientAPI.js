import { ClientsAPI, NetworkInfo, SubDomain } from 'constants/network';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { HttpServices } from 'shared/services/http/http_service';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const ClientAPI = {
	getPOCRequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.CLIENT +
			ClientsAPI.GET_POINT_OF_CONTACT +
			'?contactid=0&ActionMode=Add';
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ClientAPI.getPOCRequest');
		}
	},
	createClientRequest: async function (clientData) {
		let httpService = new HttpServices();
		const miscellaneousData =
			UserSessionManagementController.getUserMiscellaneousData();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.CLIENT +
			ClientsAPI.CREATE +
			`?LoggedInUserId=${miscellaneousData?.loggedInUserTypeID}`;
		httpService.dataToSend = clientData;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ClientAPI.createClientRequest');
		}
	},
	getDuplicateEmailRequest: async function (email) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.CLIENT +
			ClientsAPI.CHECK_DUPLICATE_EMAIL +
			`?email=${email}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ClientAPI.getDuplicateEmailRequest');
		}
	},
	getDuplicateCompanyNameRequest: async function (companyName) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.CLIENT +
			ClientsAPI.CHECK_DUPLICATE_COMPANY_NAME +
			`?companyName=${companyName}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ClientAPI.getDuplicateCompanyNameRequest');
		}
	},
	getAllClients : async function (clientReqData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.CLIENT +
			ClientsAPI.GET_ALL_CLIENTS_LIST ;
		httpService.setAuthRequired = true;
		httpService.dataToSend = clientReqData;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ClientAPI.getAllClients');
		}
	},
	getClientFilterList : async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.CLIENT +
			ClientsAPI.FILTER_LIST ;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ClientAPI.getClientFilterList');
		}
	},
	getViewclientDetailsRequest:async function (CompanyID,ClientID) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.CLIENT +
			ClientsAPI.VIEW_CLIENT ;
		httpService.setAuthRequired = true;
		httpService.dataToSend = {
			'CompanyID':CompanyID,
			'ClientID':ClientID
		};
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ClientAPI.getClientFilterList');
		}
	},
	getJobDetails:async function (guid,clientID) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.CLIENT +
			ClientsAPI.DRAFTJOBDETAILS +
			`?contactId=${clientID}&guid=${guid}`; ;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ClientAPI.getClientFilterList');
		}
	},
	userDetailsRequest:async function (reqData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.CLIENT +
			ClientsAPI.ADD_CLIENT_WITH_CREDITS ;
		httpService.setAuthRequired = true;
		httpService.dataToSend = reqData
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ClientAPI.userDetailsRequest');
		}
	},
	trackingLeadClientSourceDetails:async function (contactId) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.CLIENT +
			ClientsAPI.TRACKING_LEAD_CLIENT_SOURCE +
			`?ContactID=${contactId}`; 
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ClientAPI.getClientFilterList');
		}
	},
	getCreditTransactionHistory:async function (companyID,clientID) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.CLIENT +
			ClientsAPI.GET_CREDIT_TRANSACTION_HISTORY +
			`?CompanyID=${companyID}&ClientID=${clientID}`; 
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ClientAPI.getClientFilterList');
		}
	},
	resendInviteEmail:async function (ContactId) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.CLIENT +
			ClientsAPI.RESEND_INVITE_EMAIL +
			`?ContactId=${ContactId}&InvitingUserId=${null}`; 
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ClientAPI.getClientFilterList');
		}
	},
	getActiveSalesUserList:async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.CLIENT +
			ClientsAPI.GET_ACTIVE_SALES_USERLIST; 
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'ClientAPI.getActiveSalesUserList');
		}
	},
};
