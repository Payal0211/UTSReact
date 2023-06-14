import { I2SsAPI, NetworkInfo, SubDomain } from 'constants/network';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { HttpServices } from 'shared/services/http/http_service';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const I2SAPI = {
	getI2SListRequest: async (i2sData) => {
		try {
			let httpService = new HttpServices();
			httpService.URL = NetworkInfo.NETWORK + SubDomain.I2S_REPORT + I2SsAPI.LIST + `startDate=${i2sData.startDate}&endDate=${i2sData.endDate}`;
			httpService.setAuthRequired = true;
			// httpService.dataToSend = dealData;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'I2sAPI.getI2SListRequest');
		}
	},
};
