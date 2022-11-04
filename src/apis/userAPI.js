import { NetworkInfo, UserAPI } from 'constants/network';
import { HttpServices } from 'shared/services/http/http_service';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const userAPI = {
	login: async function (userdata) {
		let httpservices = new HttpServices();
		httpservices.dataToSend = userdata;
		// httpservices.URL =
		// 	'https://1e43-2409-4041-2cb1-1b7-92b-cf60-be4c-251a.in.ngrok.io/UserOperationsAPI/AdminLogin';
		httpservices.URL =  NetworkInfo.networkInfo + UserAPI.LOGIN;
		try {
			console.log(httpservices.URL);
			let response = await httpservices.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'UserAPI.Login');
		}
	},
};
