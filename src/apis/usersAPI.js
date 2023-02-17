import {
    NetworkInfo,
    SubDomain,
    UsersAPI,
} from 'constants/network';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { HttpServices } from 'shared/services/http/http_service';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const UserListAPIRequest = {
    userList: async function (data) {
        let httpService = new HttpServices();
        httpService.URL =
            NetworkInfo.NETWORK +
            SubDomain.USER +
            UsersAPI.LIST;
        httpService.dataToSend = data;
        httpService.setAuthRequired = true;
        httpService.setAuthToken = UserSessionManagementController.getAPIKey();
        try {
            let response = await httpService.sendPostRequest();
            return response;
        } catch (error) {
            return errorDebug(error, 'hiringRequestAPI.getPaginatedHiringRequest');
        }
    },
};
