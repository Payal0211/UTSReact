import { IncentiveReportAPI } from 'apis/IncentiveAPI';
import { HTTPStatusCode } from 'constants/network';
import UTSRoutes from 'constants/routes';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { Navigate } from 'react-router-dom';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const IncentiveReportDAO = {
    getUserRoleDAO: async function () {
        try {
            const getUserRole = await IncentiveReportAPI.getUserRolerequest();
            if (getUserRole) {
                const statusCode = getUserRole['statusCode'];
                if (statusCode === HTTPStatusCode.OK) {
                    const tempResult = getUserRole.responseBody;
                    return {
                        statusCode: statusCode,
                        responseBody: tempResult.details,
                    };
                } else if (statusCode === HTTPStatusCode.NOT_FOUND)
                    return getUserRole;
                else if (statusCode === HTTPStatusCode.BAD_REQUEST)
                    return getUserRole;
                else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
                    let deletedResponse =
                        UserSessionManagementController.deleteAllSession();
                    if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
                }
            }
        } catch (error) {
            return errorDebug(error, 'IncentiveReportDAO.getUserRoleDAO');
        }
    },




};
