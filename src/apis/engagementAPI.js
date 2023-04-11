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
			`?loggedinuserid=2`;
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
		/* let url = isEngagement
			? TalentReplaceAPI.ENGAGEMENT_REPLACE_TALENT
			: TalentReplaceAPI.REPLACE_TALENT;
		console.log('-isENgagement--', url); */
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.TALENT_REPLACEMENT +
			TalentReplaceAPI.REPLACE_TALENT +
			makeURLParamsFromPayload(talentReplaceDetails);
		// `?OnBoardId=${talentReplaceDetails.onboardID}&LastWorkingDayOption=${talentReplaceDetails.lwd}`;
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
};
