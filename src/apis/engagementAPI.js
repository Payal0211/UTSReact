import {
	EngagementAPI,
	NetworkInfo,
	OnboardsAPI,
	SubDomain,
	TalentDocumentAPI,
	TalentInvoiceAPI,
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
	createReplaceHRRequest: async function (details) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.TALENT_REPLACEMENT +
			TalentReplaceAPI.CREATE_REPLACE_HR  + `?HrID=${details.HrID}&OnBoardID=${details.OnBoardID}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
	
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				'EngagementRequestAPI.createReplaceHRRequest',
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
	getUpdateReplacementDetails : async function (payload) {
		let httpService = new HttpServices();
		httpService.URL = NetworkInfo.NETWORK + SubDomain.ENGAGEMENT + EngagementAPI.UPDATE_REPLACEMENT_DETAILS;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		httpService.dataToSend = payload
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				'EngagementRequestAPI.UpdateInvoiceDetailsRequest',
			);
		}
	},
	getContentCancelEngagementRequest: async function (talentDetails) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.ENGAGEMENT +
			EngagementAPI.GET_CANCEL_ENGAGEMENT +
			`?OnBoardID=${talentDetails?.onboardID}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				'EngagementRequestAPI.getContentCancelEngagementRequest',
			);
		}
	},
	getAMDetailsRequest: async function (id) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.ENGAGEMENT +
			EngagementAPI.GET_AM_DETAILS +
			`?OnBoardID=${id}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				'EngagementRequestAPI.getAMDetailsRequest',
			);
		}
	},
	getInvoiceDetailsRequest: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			'ZohoInvoice/GetInvoiceDetailToCreateInvoice' +
			`?CompanyId=${payload.companyId}&InvoiceMonth=${payload.month}&InvoiceYear=${payload.year}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				'EngagementRequestAPI.getInvoiceDetailsRequest',
			);
		}
	},
	UpdateInvoiceDetailsRequest: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			'ZohoInvoice/InsertOrUpdateInvoice'
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		httpService.dataToSend = payload
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				'EngagementRequestAPI.UpdateInvoiceDetailsRequest',
			);
		}
	},
	saveAMNAMEEDITRequest: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.ENGAGEMENT +
			EngagementAPI.UPDATE_AM_PAY_OUT ;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		httpService.dataToSend = payload;
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				'EngagementRequestAPI.getAMDetailsRequest',
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
	cancelEngagementRequest: async function (talentDetails) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.ENGAGEMENT +
			EngagementAPI.CANCEL_ENGAGEMENT;
		httpService.dataToSend = talentDetails;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				'EngagementRequestAPI.cancelEngagementRequest',
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
	saveDaysandPRDetailsRequest: async function (talentDetails) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.ENGAGEMENT +
			EngagementAPI.UPDATE_DAYS_AND_PR ;
		httpService.dataToSend = talentDetails;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				'EngagementRequestAPI.saveDaysandPRDetailsRequest',
			);
		}
	},
	GetRenewEngagementRequest: async function (talentDetails) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.ENGAGEMENT +
			EngagementAPI.GET_RENEW_ENGAGEMENT +
			`?onBoardId=${talentDetails?.onBoardId}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				'EngagementRequestAPI.GetRenewEngagementRequest',
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

	viewOnboardFeedback: async function (onBoardID) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.ENGAGEMENT +
			EngagementAPI.VIEW_ONBOARD_FEEDBACK +
			`?OnBoardID=${onBoardID}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'EngagementRequestAPI.getEngagementFilterList');
		}
	},
	getFeedback: async function (feedback) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.ENGAGEMENT +
			EngagementAPI.GET_ONBOARD_FEEDBACK +
			`?totalrecord=${feedback?.totalRecords}&pagenumber=${feedback?.pagenumber}&onBoardId=${feedback?.onBoardId}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'EngagementRequestAPI.getFeedback');
		}
	},
	onBoardDetails: async function (onBoardID) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.ONBOARD +
			OnboardsAPI.VIEW_IN_DETAIL +
			`?onBoardId=${onBoardID}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'EngagementRequestAPI.onBoardDetails');
		}
	},
	onBoardNotesDetails: async function (onBoardID) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.ONBOARD +
			OnboardsAPI.TALENT_ONBOARD_NOTES +
			`?onBoardId=${onBoardID}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'EngagementRequestAPI.onBoardNotesDetails');
		}
	},
	saveOnBoardNotesDetails: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.ONBOARD +
			OnboardsAPI.SAVE_TALENT_ONBOARD_NOTES 
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		httpService.dataToSend = payload
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'EngagementRequestAPI.saveOnBoardNotesDetails');
		}
	},
	viewDocumentsDetails: async function (talentId,companyId) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.TALENT_DOCUMENT +
		    TalentDocumentAPI.GET_DOCUMENT +
			`?TalentID=${talentId}&companyId=${companyId}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'EngagementRequestAPI.viewDocumentsDetails');
		}
	},
	uploadDocumentsDetails: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.TALENT_DOCUMENT +
		    TalentDocumentAPI.UPLOAD_FILE 
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		httpService.dataToSend = payload
		try {
			let response = await httpService.sendFileDataPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'EngagementRequestAPI.uploadDocumentsDetails');
		}
	},
	verifyDocumentRequest: async function (id) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.TALENT_DOCUMENT +
			TalentDocumentAPI.VERIFY_DOCUMENT  + `?TalentDocumentID=${id}`
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'amDashboardAPI.verifyDocumentRequest');
		}
	},
	removeDocumentRequest: async function (id) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.TALENT_DOCUMENT +
			TalentDocumentAPI.REMOVE_DOCUMENT + `?TalentDocumentID=${id}`
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'amDashboardAPI.removeDocumentRequest');
		}
	},
	getDocumentTypeRequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.TALENT_DOCUMENT +
			TalentDocumentAPI.GET_FILTER
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'amDashboardAPI.getDocumentTypeRequest');
		}
	},
	feedbackFormContent: async function (getHRAndEngagementId) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.ENGAGEMENT +
			EngagementAPI.GET_FEEDBACK_CONTENT +
			`?HR_ID=${getHRAndEngagementId?.hrId}&OnBoardID=${getHRAndEngagementId?.onBoardId}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'EngagementRequestAPI.feedbackFormContent');
		}
	},
	updateLeaveRequest: async function (pl) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.ONBOARD +
			OnboardsAPI.UPDATE_LEAVE_BALANCE +
			`?onBoardId=${pl?.onBoardId}&talentID=${pl?.talentID}&leavesGiven=${pl?.leavesGiven}&holidayLeaves=${pl?.holidayLeaves}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'EngagementRequestAPI.updateLeaveRequest');
		}
	},
	submitFeedBackForm: async function (addFeedBackData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.ENGAGEMENT +
			EngagementAPI.SAVE_FEEDBACK_CLIENT_ONBOARD;
		httpService.dataToSend = addFeedBackData;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest(addFeedBackData);
			return response;
		} catch (error) {
			return errorDebug(error, 'EngagementRequestAPI.submitFeedBackForm');
		}
	},
	uploadFile: async (file) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.ENGAGEMENT +
			EngagementAPI.UPLOAD_FILE;
		httpService.dataToSend = file;

		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendFileDataPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'EngagementRequestAPI.uploadFile');
		}
	},
	calculateActualNRBRPR: async function (br,pr,currency) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.ENGAGEMENT +
			EngagementAPI.CALCULATE_ACTUAL_NR_BR_PR + `?BR=${br}&PR=${pr}&Currency=${currency}`;;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'EngagementRequestAPI.submitFeedBackForm');
		}
	},
	getTSCUserList: async function (id) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.ENGAGEMENT +
			EngagementAPI.GET_TSC_USERS_DETAIL +
			`?onBoardId=${id}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'EngagementRequestAPI.getTSCUserList');
		}
	},
	getAllBRPRList: async function (id) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.ENGAGEMENT +
			EngagementAPI.GET_ENGAGEMENT_EDIT_ALL_BR_PR +
			`?OnboardID=${id}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'EngagementRequestAPI.getAllBRPRList');
		}
	},
	getTalentOtherDetailsOtherList: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.ONBOARD +
			EngagementAPI.GET_TALENT_MATCHMAKING  +
			`?onBoardId=${payload.onboardID}&TalentID=${payload.talentID}${payload?.hrID ? `&hrId=${payload?.hrID}` :'' }`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'EngagementRequestAPI.getAllBRPRList');
		}
	},
	updateTSCName: async function (data) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.ENGAGEMENT +
			EngagementAPI.UPDATE_TSC_NAME;
		httpService.dataToSend = data;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				'EngagementRequestAPI.updateTSCName',
			);
		}
	},
	autoUpdateTSCName: async function (ID) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.ENGAGEMENT +
			EngagementAPI.AUTO_UPDATE_TSC_NAME + `?OnBoardId=${ID}`;
		// httpService.dataToSend = data;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				'EngagementRequestAPI.autoUpdateTSCName',
			);
		}
	},
	syncEngagementRequest: async function (onBoardId) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.ONBOARD + 
			OnboardsAPI.SYNC_ENGAGEMENT + `?onBoardId=${onBoardId}`
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		// httpService.dataToSend = details;
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				'EngagementRequestAPI.saveRenewalInitiatedDetail',
			);
		}
	},
	saveRenewalInitiatedDetail: async function (onBoardId,renewal) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.ONBOARD + 
			OnboardsAPI.SAVE_RENEWALINITIATED_DETAILS + `?OnBoardId=${onBoardId}&IsRenewalInitiated=${renewal}`
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		// httpService.dataToSend = details;
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				'EngagementRequestAPI.saveRenewalInitiatedDetail',
			);
		}
	},
	saveEngStartDate:async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.ONBOARD + 
			OnboardsAPI.UPDATE_CONTRACT_START_DATE
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		httpService.dataToSend = payload;
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				'EngagementRequestAPI.saveRenewalInitiatedDetail',
			);
		}
	},
	getallBRPRWithLeave: async function (onBoardId) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.TALENT_INVOICE + 
			TalentInvoiceAPI.GET_ENGAGEMENT_ALL_BR_PR + `?OnBoardId=${onBoardId}`
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		// httpService.dataToSend = details;
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				'EngagementRequestAPI.getallBRPRWithLeave',
			);
		}
	},
	getEmailTemplate: async function (pl) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.ENGAGEMENT + 
			EngagementAPI.GET_CUSTOM_EMAIL_TEMPLATE + `?receiver=${pl.receiver}&templateType=${pl.templateType}&onBoardId=${pl.onBoardId}&talentId=${pl.talentId}&clientId=${pl.clientId}`
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		// httpService.dataToSend = details;
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				'EngagementRequestAPI.getEmailTemplate',
			);
		}
	},
	getEmailMaster: async function (id) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.ENGAGEMENT + 
			EngagementAPI.GET_EMAIL_MASTER + `?onBoardId=${id}`
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		// httpService.dataToSend = details;
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				'EngagementRequestAPI.getEmailMaster',
			);
		}
	},
	sendEmail: async function (pl) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.ENGAGEMENT + 
			EngagementAPI.CUSTOM_EMAIL
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		httpService.dataToSend = pl
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				'EngagementRequestAPI.getEmailMaster',
			);
		}
	},
};
