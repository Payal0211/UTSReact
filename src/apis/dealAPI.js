import { DealsAPI, NetworkInfo, SubDomain } from 'constants/network';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { HttpServices } from 'shared/services/http/http_service';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const DealAPI = {
	getDealListRequest: async (dealData) => {
		try {
			let httpService = new HttpServices();
			httpService.URL =
				NetworkInfo.NETWORK +
				SubDomain.DEAL +
				DealsAPI.LIST +
				`?totalrecord=${dealData?.pageSize}&pagenumber=${dealData?.pageNum}`;
			httpService.setAuthRequired = true;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'DealAPI.getDealListRequest');
		}
	},
	getDealDetailsRequest: async (dealData) => {
		try {
			let httpService = new HttpServices();
			httpService.URL =
				NetworkInfo.NETWORK +
				SubDomain.DEAL +
				DealsAPI.LIST +
				`?DealID=${dealData?.dealID}`;
			httpService.setAuthRequired = true;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'DealAPI.getDealDetailsRequest');
		}
	},
};
