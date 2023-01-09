import { HiringRequestsAPI, NetworkInfo, SubDomain } from 'constants/network';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { HttpServices } from 'shared/services/http/http_service';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const HiringRequestAPI = {
	getClientDetailRequest: async function (clientEmail) {
		let httpService = new HttpServices();

		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.HIRING +
			HiringRequestsAPI.CHECK_CLIENT_EMAIL +
			`?email=${clientEmail}`;
		console.log(httpService.URL);
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
};
