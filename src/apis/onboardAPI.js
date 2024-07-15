import { NetworkInfo, OnboardsAPI, SubDomain } from 'constants/network';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { HttpServices } from 'shared/services/http/http_service';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const OnboardAPI = {
	onboardTalentRequest: async function (onboardData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.ONBOARD + OnboardsAPI.ONBOARD_TALENT;
		httpService.setAuthRequired = true;
		httpService.dataToSend = onboardData;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'OnboardAPI.onboardTalentRequest');
		}
	},
	getOnboardingStatusRequest: async function (onboardData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.ONBOARD +
			OnboardsAPI.GET_ONBOARDING_STATUS +
			`?onBoardId=${onboardData?.onboardID}&Action=${onboardData?.action}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'OnboardAPI.getOnboardingStatusRequest');
		}
	},
	onboardingStatusUpdatesRequest: async function (onboardData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.ONBOARD +
			OnboardsAPI.ONBOARDING_STATUS_UPDATES;
		httpService.dataToSend = onboardData;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'OnboardAPI.onboardingStatusUpdatesRequest');
		}
	},
	getClientLegalInfo: async function (HRID) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.ONBOARD +
			OnboardsAPI.FATCH_CLIENT_LEGAL_INFO + `?hrId=${HRID}`
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'OnboardAPI.getClientLegalInfo');
		}
	},
	getTalentOnBoardInfo: async function (OBID) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.ONBOARD +
			OnboardsAPI.FEATCH_TALENT_ON_BOARD_INFO + `?onBoardId=${OBID}`
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'OnboardAPI.getTalentOnBoardInfo');
		}
	},
	submitSOWFile:  async function (File) {
		let httpService = new HttpServices();
		httpService.URL =
		NetworkInfo.NETWORK + SubDomain.ONBOARD +
		OnboardsAPI.UPLOAD_FILE + `?onboardID=${File.get('onboardID')}`;
		httpService.dataToSend = File;

		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendFileDataPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'EngagementRequestAPI.uploadFile');
		}
	},
	getBeforeOnBoardInfo: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.ONBOARD +
			OnboardsAPI.GET_PRE_ONBOARDING_DETAIL + `?OnBoardId=${payload.OnboardID}&HR_ID=${payload.HRID}&actionName=${payload.actionName}`
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'OnboardAPI.getBeforeOnBoardInfo');
		}
	},
	getDuringOnBoardInfo: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.ONBOARD +
			OnboardsAPI.GET_DURING_ON_BOARD_DETAIL + `?OnBoardId=${payload.OnboardID}&HR_ID=${payload.HRID}`
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'OnboardAPI.getDuringOnBoardInfo');
		}
	},
	updateBeforeOnBoardInfo: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.ONBOARD +
			OnboardsAPI.UPDATE_PRE_ON_BOARDING_DETAIL 
		httpService.setAuthRequired = true;
		httpService.dataToSend = payload;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'OnboardAPI.updateBeforeOnBoardInfo');
		}
	},
	updatePreOnBoardInfo: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.ONBOARD +
			OnboardsAPI.UPDATE_PRE_ON_BOARD_2ND_TAB 
		httpService.setAuthRequired = true;
		httpService.dataToSend = payload;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'OnboardAPI.updatePreOnBoardInfo');
		}
	},
	uploadPolicyFile: async (file,id) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.ONBOARD +
			OnboardsAPI.UPLOAD_LEAVE_POLICY  + `?OnBoardId=${id}`;
		httpService.dataToSend = file;

		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendFileDataPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.uploadPolicyFile');
		}
	},
	getAMUsers: async () => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.MASTERS +
			OnboardsAPI.GET_AM_USER;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.getAMUsers');
		}
	},
	getStateList: async () => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.MASTERS +
			OnboardsAPI.GET_STATE_LIST;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.getStateList');
		}
	},
};
