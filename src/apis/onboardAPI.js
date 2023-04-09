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
};
