import {
	NetworkInfo,
	SubDomain,
	TalentReplaceAPI,
	TalentStatus,
} from 'constants/network';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { HttpServices } from 'shared/services/http/http_service';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const TalentStatusAPI = {
	getStatusDetailRequest: async (talentDetails) => {
		try {
			let httpService = new HttpServices();
			httpService.URL =
				NetworkInfo.NETWORK +
				SubDomain.TALENT_STATUS +
				TalentStatus.GET_TALENT_STATUS_DETAIL +
				`?HrID=${talentDetails?.hrID}
                &TalentID=${talentDetails?.talentID}
                &TalentStatusID=${talentDetails?.talentStatusID}
                &TalentStatus=${talentDetails?.talentStatus}`;
			httpService.setAuthRequired = true;

			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'TalentStatusAPI.getStatusDetailRequest');
		}
	},
	updateTalentStatusRequest: async (talentDetails) => {
		try {
			let httpService = new HttpServices();
			httpService.URL =
				NetworkInfo.NETWORK +
				SubDomain.TALENT_STATUS +
				TalentStatus.UPDATE_TALENT_STATUS;

			httpService.setAuthRequired = true;
			httpService.dataToSend = talentDetails;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'TalentStatusAPI.updateTalentStatusRequest');
		}
	},
	removeOnHoldStatusRequest: async (talentDetails) => {
		try {
			let httpService = new HttpServices();
			httpService.URL =
				NetworkInfo.NETWORK +
				SubDomain.TALENT_STATUS +
				TalentStatus.REMOVE_ONHOLD_STATUS +
				`?HrId=${talentDetails?.hrID}&ContactTalentPriorityID=${talentDetails?.contactTalentPriorityID}`;

			httpService.setAuthRequired = true;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'TalentStatusAPI.removeOnHoldStatusRequest');
		}
	},
	talentReplacementRequest: async (talentDetails) => {
		try {
			let httpService = new HttpServices();
			httpService.URL =
				NetworkInfo.NETWORK +
				SubDomain.TALENT_REPLACEMENT +
				TalentReplaceAPI.REPLACE_TALENT +
				`?ID=${talentDetails?.onboardID}`;

			httpService.setAuthRequired = true;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'TalentStatusAPI.talentReplacementRequest');
		}
	},
};
