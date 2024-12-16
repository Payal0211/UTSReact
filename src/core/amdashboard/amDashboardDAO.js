import { amDashboardAPI } from "apis/amDashboardAPI";
import { HTTPStatusCode } from "constants/network";
import UTSRoutes from "constants/routes";
import { UserSessionManagementController } from "modules/user/services/user_session_services";
import { Navigate } from "react-router-dom";
import { errorDebug } from "shared/utils/error_debug_utils";

export const amDashboardDAO  = {
    getFiltersDAO: async ()=>{
        try {            
            const allFiltersResult = await amDashboardAPI.getFiltersRequest() ;
            if (allFiltersResult) {
				const statusCode = allFiltersResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = allFiltersResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return allFiltersResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return allFiltersResult;
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
            return errorDebug(error, 'amDashboardDAO.getFiltersDAO');
        }
    },
    getDashboardDAO: async (payload) => {
        try {            
            const allFiltersResult = await amDashboardAPI.getDashboardRequest(payload) ;
            if (allFiltersResult) {
				const statusCode = allFiltersResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = allFiltersResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return allFiltersResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return allFiltersResult;
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
            return errorDebug(error, 'amDashboardDAO.getDashboardDAO');
        }
    },
    getRenewalDAO: async (payload) => {
        try {            
            const allFiltersResult = await amDashboardAPI.getRenewalRequest(payload) ;
            if (allFiltersResult) {
				const statusCode = allFiltersResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = allFiltersResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return allFiltersResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return allFiltersResult;
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
            return errorDebug(error, 'amDashboardDAO.getRenewalDAO');
        }
    },
    getSummaryDAO: async (payload) => {
        try {            
            const allFiltersResult = await amDashboardAPI.getSummaryRequest(payload) ;
            if (allFiltersResult) {
				const statusCode = allFiltersResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = allFiltersResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return allFiltersResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return allFiltersResult;
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
            return errorDebug(error, 'amDashboardDAO.getSummaryDAO');
        }
    },
    getZohoTicketsDAO: async (payload) => {
        try {            
            const allFiltersResult = await amDashboardAPI.getZohoTicketsRequest(payload) ;
            if (allFiltersResult) {
				const statusCode = allFiltersResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = allFiltersResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return allFiltersResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return allFiltersResult;
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
            return errorDebug(error, 'amDashboardDAO.getZohoTicketsDAO');
        }
    },

}