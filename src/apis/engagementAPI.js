import {
    EngagementAPI,
    NetworkInfo,
    SubDomain,
    HiringRequestsAPI
} from 'constants/network';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { HttpServices } from 'shared/services/http/http_service';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const EngagementRequestAPI = {
    getEngagementList: async function (hrData) {
        let httpService = new HttpServices();
        httpService.URL =
            NetworkInfo.NETWORK +
            SubDomain.VIEW_ALL_HR +
            HiringRequestsAPI.GET_ALL_HIRING_REQUEST;
        httpService.dataToSend = hrData;
        httpService.setAuthRequired = true;
        httpService.setAuthToken = UserSessionManagementController.getAPIKey();
        try {
            let response = await httpService.sendPostRequest();
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
