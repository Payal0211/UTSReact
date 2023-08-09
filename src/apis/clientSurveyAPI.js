import { ClientHappinessSurvey, EngagementAPI, NetworkInfo, SubDomain } from "constants/network";
import { UserSessionManagementController } from "modules/user/services/user_session_services";
import { HttpServices } from "shared/services/http/http_service";
import { errorDebug } from "shared/utils/error_debug_utils";

export const ClientHappinessSurveyRequestAPI = {
	getClientSurveyList: async function (data) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.CLIENT +
            ClientHappinessSurvey.GET_CLIENT_HAPPINESS_SURVEY_LIST+
			ClientHappinessSurvey.LIST ;
		httpService.dataToSend = data;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest(data);
			return response;
		} catch (error) {
			return errorDebug(error, 'ClientHappinessSurveyRequestAPI.getClientSurveyList');
		}
	},
	
};