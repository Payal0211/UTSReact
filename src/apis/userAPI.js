import { NetworkInfo, SubDomains, SubDomainsCollection, UserAPI, UserOperation } from 'constants/network';
import { HttpServices } from 'shared/services/http/http_service';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const userAPI = {
	login: async function (userdata) {
		let httpservices = new HttpServices();
		httpservices.dataToSend = userdata;
		httpservices.URL = NetworkInfo.networkInfo + SubDomainsCollection.UserOperation + UserOperation.LOGIN;
		try {
			let response = await httpservices.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'UserAPI.Login');
		}
	},
};
