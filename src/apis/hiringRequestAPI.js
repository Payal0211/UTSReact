import { NetworkInfo, SubDomainsCollection, ViewAllHR } from 'constants/network';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { HttpServices } from 'shared/services/http/http_service';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const hiringRequestAPI = {
	getPaginatedHiringRequest: async function (hrData) {
		let httpService = new HttpServices();
		httpService.URL =  NetworkInfo.networkInfo + SubDomainsCollection.ViewAllHR + ViewAllHR.GETALLHIRINGREQUESTS + `?Pagesize=${hrData.pageSize}&Pagenum=${hrData.pageNum}&Sortdatafield=CreatedDateTime&Sortorder=desc`;
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
		httpService.URL = NetworkInfo.networkInfo + SubDomainsCollection.ViewAllHR + ViewAllHR.GETALLHIRINGREQUESTS;
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
		httpService.URL =   NetworkInfo.networkInfo + SubDomainsCollection.ViewAllHR + ViewAllHR.GetHRDetail +`?id=${hrid}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'hiringRequestAPI.getHRDetailsRequest');
		}
	},
};
