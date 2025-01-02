import { amDashboardAPI } from "apis/amDashboardAPI";
import { HTTPStatusCode } from "constants/network";
import UTSRoutes from "constants/routes";
import { UserSessionManagementController } from "modules/user/services/user_session_services";
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
					window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
        } catch (error) {
            return errorDebug(error, 'amDashboardDAO.getFiltersDAO');
        }
    },
    getTicketHistoryDAO: async (id)=>{
        try {            
            const allFiltersResult = await amDashboardAPI.getTicketHistoryRequest(id) ;
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
					window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
        } catch (error) {
            return errorDebug(error, 'amDashboardDAO.getTicketHistoryDAO');
        }
    },
    getTicketConversationDAO: async (id)=>{
        try {            
            const allFiltersResult = await amDashboardAPI.getTicketConversationRequest(id) ;
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
					window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
        } catch (error) {
            return errorDebug(error, 'amDashboardDAO.getTicketConversationDAO');
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
					window.location.replace(UTSRoutes.LOGINROUTE);
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
					window.location.replace(UTSRoutes.LOGINROUTE);
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
					window.location.replace(UTSRoutes.LOGINROUTE);
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
					window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
        } catch (error) {
            return errorDebug(error, 'amDashboardDAO.getZohoTicketsDAO');
        }
    },
    getTalentLeaveRequestDAO: async (id) => {
        try {            
            const allFiltersResult = await amDashboardAPI.getTalentLeaveRequest(id) ;
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
					window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
        } catch (error) {
            return errorDebug(error, 'amDashboardDAO.getTalentLeaveRequestDAO');
        }
    },
    getCalenderLeaveRequestDAO: async (payload) => {
        try {            
            const allFiltersResult = await amDashboardAPI.getCalenderLeaveRequest(payload) ;
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
					window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
        } catch (error) {
            return errorDebug(error, 'amDashboardDAO.getCalenderLeaveRequestDAO');
        }
    },
    updateLeaveRequestDAO: async (payload) => {
        try {            
            const allFiltersResult = await amDashboardAPI.updateLeaveRequest(payload) ;
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
					window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
        } catch (error) {
            return errorDebug(error, 'amDashboardDAO.updateLeaveRequestDAO');
        }
    },
	approveRejectLeaveDAO: async (payload) => {
        try {            
            const allFiltersResult = await amDashboardAPI.approveRejectLeaveRequest(payload) ;
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
					window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
        } catch (error) {
            return errorDebug(error, 'amDashboardDAO.approveRejectLeaveDAO');
        }
    },
}