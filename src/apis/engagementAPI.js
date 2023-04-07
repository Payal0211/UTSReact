import {
    EngagementAPI,
    NetworkInfo,
    SubDomain,
} from 'constants/network';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { HttpServices } from 'shared/services/http/http_service';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const EngagementRequestAPI = {
    getEngagementList: async function (data) {
        let httpService = new HttpServices();
        httpService.URL =
            NetworkInfo.NETWORK +
            SubDomain.ENGAGEMENT +
            EngagementAPI.LIST + `?loggedinuserid=2`;
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
            NetworkInfo.NETWORK +
            SubDomain.ENGAGEMENT +
            EngagementAPI.FILTER;
        httpService.setAuthRequired = true;
        httpService.setAuthToken = UserSessionManagementController.getAPIKey();
        try {
            let response = await httpService.sendGetRequest();
            return response;
        } catch (error) {
            return errorDebug(error, 'EngagementRequestAPI.getEngagementFilterList');
        }
    },
}
