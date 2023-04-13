import {
	EngagementAPI,
	NetworkInfo,
	SubDomain,
	TalentReplaceAPI,
} from 'constants/network';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { HttpServices } from 'shared/services/http/http_service';
import { makeURLParamsFromPayload } from 'shared/utils/basic_utils';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const EngagementRequestAPI = {
	getEngagementList: async function (data) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.ENGAGEMENT +
			EngagementAPI.LIST +
			`?loggedinuserid=${
				JSON.parse(localStorage.getItem('userSessionInfo')).LoggedInUserTypeID
			}`;
		httpService.dataToSend = data;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest(data);
			return response;
		} catch (error) {
			return errorDebug(error, 'EngagementRequestAPI.getEngagementList');
		}
	},
	getEngagementFilterList: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.ENGAGEMENT + EngagementAPI.FILTER;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'EngagementRequestAPI.getEngagementFilterList');
		}
	},
	replaceTalentEngagementListRequest: async function (
		talentReplaceDetails,
		isEngagement,
	) {
		let httpService = new HttpServices();

		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.TALENT_REPLACEMENT +
			TalentReplaceAPI.REPLACE_TALENT +
			makeURLParamsFromPayload(talentReplaceDetails);

		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				'EngagementRequestAPI.replaceTalentEngagementListRequest',
			);
		}
	},
	saveTalentReplacementRequest: async function (talentReplaceDetails) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.TALENT_REPLACEMENT +
			TalentReplaceAPI.SAVE_REPLACED_TALENT;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		httpService.dataToSend = talentReplaceDetails;
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				'EngagementRequestAPI.saveTalentReplacementRequest',
			);
		}
	},
	getContentEndEngagementRequest: async function (talentDetails) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.ENGAGEMENT +
			EngagementAPI.GET_CONTENT_END_ENGAGEMENT +
			`?OnBoardID=${talentDetails?.onboardID}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				'EngagementRequestAPI.getContentEndEngagementRequest',
			);
		}
	},
	changeContractEndDateRequest: async function (talentDetails) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.ENGAGEMENT +
			EngagementAPI.CHANGE_CONTRACT_END_DATE;
		httpService.dataToSend = talentDetails;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				'EngagementRequestAPI.changeContractEndDateRequest',
			);
		}
	},
	getContentForAddInvoiceRequest: async function (talentDetails) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.ENGAGEMENT +
			EngagementAPI.GET_CONTENT_FOR_ADD_INVOICE +
			`?OnBoardID=${talentDetails?.onboardID}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				'EngagementRequestAPI.getContentForAddInvoiceRequest',
			);
		}
	},
	saveInvoiceDetailsRequest: async function (talentDetails) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.ENGAGEMENT +
			EngagementAPI.SAVE_INVOICE_DETAILS;
		httpService.dataToSend = talentDetails;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				'EngagementRequestAPI.saveInvoiceDetailsRequest',
			);
		}
	},
	editBillRatePayRateRequest: async function (talentDetails) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.ENGAGEMENT +
			EngagementAPI.EDIT_BILL_PAY_RATE +
			`?HR_ID=${talentDetails?.hrID}
			&OnBoardID=${talentDetails?.onboardID}
			&Month=${talentDetails?.month}&Year=${talentDetails?.year}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				'EngagementRequestAPI.editBillRatePayRateRequest',
			);
		}
	},
	saveBillRatePayRateRequest: async function (talentDetails) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.ENGAGEMENT +
			EngagementAPI.SAVE_BILL_RATE_PAY_RATE;
		httpService.dataToSend = talentDetails;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				'EngagementRequestAPI.saveBillRatePayRateRequest',
			);
		}
	},
	GetRenewEngagementRequest: async function (talentDetails) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.ENGAGEMENT +
			EngagementAPI.GET_RENEW_ENGAGEMENT +
			`onBoardId=${talentDetails?.onboardID}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				'EngagementRequestAPI.editBillRatePayRateRequest',
			);
		}
	},
	saveRenewEngagementRequest: async function (talentDetails) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.ENGAGEMENT +
			EngagementAPI.SAVE_RENEW_ENGAGEMENT;
		httpService.dataToSend = talentDetails;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				'EngagementRequestAPI.saveRenewEngagementRequest',
			);
		}
	},
};
