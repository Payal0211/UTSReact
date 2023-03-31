import { EngagementRequestAPI } from 'apis/engagementAPI';
import { HTTPStatusCode } from 'constants/network';
import UTSRoutes from 'constants/routes';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { Navigate } from 'react-router-dom';
import { errorDebug } from 'shared/utils/error_debug_utils';


export const engagementRequestDAO = {
    getEngagementListDAO: async function (data) {
        try {
            const engagementListResult = await EngagementRequestAPI.getEngagementList(data);
            if (engagementListResult) {
                const statusCode = engagementListResult['statusCode'];
                if (statusCode === HTTPStatusCode.OK) {
                    const tempResult = engagementListResult.responseBody;
                    return {
                        statusCode: statusCode,
                        responseBody: tempResult.details,
                    };
                } else if (
                    statusCode === HTTPStatusCode.NOT_FOUND ||
                    statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
                )
                    return engagementListResult;
                else if (statusCode === HTTPStatusCode.BAD_REQUEST) return engagementListResult;
                else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
                    UserSessionManagementController.deleteAllSession();
                    return (
                        <Navigate
                            replace
                            to={UTSRoutes.LOGINROUTE}
                        />
                    );
                }
            }
        } catch (error) {
            return errorDebug(error, 'hiringRequestDAO.getPaginatedHiringRequestDAO');
        }
    },

    getEngagementFilterListDAO: async function () {
        try {
            const engagementFilterListResult = await EngagementRequestAPI.getEngagementFilterList();
            if (engagementFilterListResult) {
                const statusCode = engagementFilterListResult['statusCode'];
                if (statusCode === HTTPStatusCode.OK) {
                    const tempResult = engagementFilterListResult.responseBody;
                    return {
                        statusCode: statusCode,
                        responseBody: tempResult,
                    };
                } else if (
                    statusCode === HTTPStatusCode.NOT_FOUND ||
                    statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
                )
                    return engagementFilterListResult;
                else if (statusCode === HTTPStatusCode.BAD_REQUEST) return engagementFilterListResult;
                else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
                    UserSessionManagementController.deleteAllSession();
                    return (
                        <Navigate
                            replace
                            to={UTSRoutes.LOGINROUTE}
                        />
                    );
                }
            }
        } catch (error) {
            return errorDebug(error, 'engagementRequestDAO.getEngagementFilterListDAO');
        }
    },












};
