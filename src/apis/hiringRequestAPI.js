import {
	AllHiringRequestAPI,
	HiringRequestsAPI,
	NetworkInfo,
	SubDomain,
} from 'constants/network';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { HttpServices } from 'shared/services/http/http_service';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const HiringRequestAPI = {
	getPaginatedHiringRequest: async function (hrData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.VIEW_ALL_HR +
			HiringRequestsAPI.GET_ALL_HIRING_REQUEST;
		httpService.dataToSend = hrData;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'hiringRequestAPI.getPaginatedHiringRequest');
		}
	},
	getAllHiringRequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.VIEW_ALL_HR +
			HiringRequestsAPI.GET_ALL_HIRING_REQUEST;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'hiringRequestAPI.getAllHiringRequest');
		}
	},
	getHRDetailsRequest: async function (hrid) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.VIEW_ALL_HR +
			HiringRequestsAPI.GET_HR_DETAIL +
			`?id=${hrid}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'hiringRequestAPI.getHRDetailsRequest');
		}
	},
	sendHREditorRequest: async function (editorDetails) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.VIEW_ALL_HR +
			HiringRequestsAPI.SAVE_HR_NOTES;
		httpService.dataToSend = editorDetails;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'hiringRequestAPI.sendHREditorRequest');
		}
	},
	sendHRPriorityForNextWeekRequest: async function (priorityDetails) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.VIEW_ALL_HR +
			AllHiringRequestAPI.SET_PRIORITY_NEXT_WEEK;
		httpService.dataToSend = priorityDetails;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				'hiringRequestAPI.sendHRPriorityForNextWeekRequest',
			);
		}
	},
	getClientDetailRequest: async function (clientEmail) {
		let httpService = new HttpServices();

		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.HIRING +
			HiringRequestsAPI.CHECK_CLIENT_EMAIL +
			`?email=${clientEmail}`;

		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.getClientDetail');
		}
	},
	createHiringRequest: async function (hrData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.HIRING + HiringRequestsAPI.CREATE_HR;
		httpService.dataToSend = hrData;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.createHiringRequest');
		}
	},
	createDebriefingRequest: async function (debriefData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.HIRING +
			SubDomain.DEBRIEFING +
			HiringRequestsAPI.CREATE_HR;
		httpService.dataToSend = debriefData;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.createDebriefingRequest');
		}
	},
	getMatchmakingRequest: async function (matchMakingData) {
		let httpService = new HttpServices();
		const miscData =
			await UserSessionManagementController.getUserMiscellaneousData();

		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.HIRING +
			HiringRequestsAPI.SEARCHING_HIRING_REQUEST_DETAIL +
			`?HiringRequestId=${matchMakingData.hrID}
			&rows=${matchMakingData.rows}
			&page=${matchMakingData.page}&LoggedInUserId=${miscData?.loggedInUserTypeID}`;

		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.getMatchmakingRequest');
		}
	},
	getTalentCostConversionRequest: async (talentAmount) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.HIRING +
			HiringRequestsAPI.GET_TALENT_COST_CONVERSION +
			`?amount=${talentAmount}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				'HiringRequestAPI.getTalentCostConversionRequest',
			);
		}
	},
	getTalentTechScoreCardRequest: async (talentID) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.HIRING +
			HiringRequestsAPI.GET_TALENT_TECH_SCORE_CARD +
			`?talentid=${talentID}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				'HiringRequestAPI.getTalentTechScoreCardRequest',
			);
		}
	},
	getTalentProfileSharedDetailRequest: async (talentDetails) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.HIRING +
			HiringRequestsAPI.GET_TALENT_PROFILE_SHARED_DETAILS +
			`?talentid=${talentDetails?.talentID}&typeid=${talentDetails?.typeID}&fromDate=''&toDate=''`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				'HiringRequestAPI.getTalentTechScoreCardRequest',
			);
		}
	},
	getTalentProfileLogReqeust: async (talentID) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.HIRING +
			HiringRequestsAPI.GET_TALENT_PROFILE_LOG +
			`?talentid=${talentID}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.getTalentProfileLogReqeust');
		}
	},
	getAllFilterDataForHRRequest: async () => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.VIEW_ALL_HR +
			HiringRequestsAPI.GET_ALL_FILTER_DATA_FOR_HR;

		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.getAllFilterDataForHRRequest');
		}
	},
	setTalentPrioritiesRequest: async (talentPrioritiesData) => {
		let httpService = new HttpServices();
		const miscData = UserSessionManagementController.getUserMiscellaneousData();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.HIRING +
			HiringRequestsAPI.SET_TALENT_PRIORITIES +
			`?LoggedInUserId=${miscData?.loggedInUserTypeID}`;
		httpService.setAuthRequired = true;
		httpService.dataToSend = talentPrioritiesData;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.setTalentPrioritiesRequest');
		}
	},
	deleteHRRequest: async (deleteBody) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.HIRING + HiringRequestsAPI.DELETE;
		httpService.dataToSend = deleteBody;
		httpService.setAuthRequired = true;

		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.deleteHRRequest');
		}
	},
};
