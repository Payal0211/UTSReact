import {
	HubspotsAPI,
	NetworkInfo,
	SubDomain,
} from 'constants/network';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { HttpServices } from 'shared/services/http/http_service';
import { errorDebug } from 'shared/utils/error_debug_utils';


export const HubSpotAPI = {
    getAutocompleteCompany: async (company) => {
        let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.HUB_SPOT + HubspotsAPI.GET_AUTOCOMPLETE_COMPANY + `?Search=${company}` ;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HubSpotAPI.getAutocompleteCompany');
		}
    },
    getCompanyDetails: async (companyId) => {
        let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.HUB_SPOT + HubspotsAPI.GET_COMPANY_DETAILS + `?CompanyId=${companyId}` ;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HubSpotAPI.getCompanyDetails');
		}
    },
    getContactsByEmail: async (EMAIL) => {
        let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.HUB_SPOT + HubspotsAPI.GET_CONTACTS_BY_EMAIL + `?Email=${EMAIL}` ;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HubSpotAPI.getContactsByEmail');
		}
    },
}