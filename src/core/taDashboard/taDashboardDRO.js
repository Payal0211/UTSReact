import { TaDashboardAPI } from 'apis/taDashboardAPI';
import { HTTPStatusCode } from 'constants/network';
import UTSRoutes from 'constants/routes';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { Navigate } from 'react-router-dom';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const TaDashboardDAO = {
    getAllMasterDAO: async function () {
        try {
            const taResult = await TaDashboardAPI.getAllMasterRequest();
            if (taResult) {
                const statusCode = taResult['statusCode'];
                if (statusCode === HTTPStatusCode.OK) {
                    const tempResult = taResult.responseBody;
                    return {
                        statusCode: statusCode,
                        responseBody: tempResult.details,
                    };
                } else if (statusCode === HTTPStatusCode.NOT_FOUND) return taResult;
                else if (statusCode === HTTPStatusCode.BAD_REQUEST) return taResult;
                else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
                    let deletedResponse =
                        UserSessionManagementController.deleteAllSession();
                    if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
                }
            }
        } catch (error) {
            return errorDebug(error, 'TaDashboardDAO.getAllMasterDAO');
        }
    },
    getAllTAListRequestDAO: async function (pl) {
        try {
            const taResult = await TaDashboardAPI.getAllTAListRequest(pl);
            if (taResult) {
                const statusCode = taResult['statusCode'];
                if (statusCode === HTTPStatusCode.OK) {
                    const tempResult = taResult.responseBody;
                    return {
                        statusCode: statusCode,
                        responseBody: tempResult.details,
                    };
                } else if (statusCode === HTTPStatusCode.NOT_FOUND) return taResult;
                else if (statusCode === HTTPStatusCode.BAD_REQUEST) return taResult;
                else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
                    let deletedResponse =
                        UserSessionManagementController.deleteAllSession();
                    if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
                }
            }
        } catch (error) {
            return errorDebug(error, 'TaDashboardDAO.getAllTAListRequestDAO');
        }
    },
    updateTAListRequestDAO: async function (pl) {
        try {
            const taResult = await TaDashboardAPI.updateTAListRequest(pl);
            if (taResult) {
                const statusCode = taResult['statusCode'];
                if (statusCode === HTTPStatusCode.OK) {
                    const tempResult = taResult.responseBody;
                    return {
                        statusCode: statusCode,
                        responseBody: tempResult.details,
                    };
                } else if (statusCode === HTTPStatusCode.NOT_FOUND) return taResult;
                else if (statusCode === HTTPStatusCode.BAD_REQUEST) return taResult;
                else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
                    let deletedResponse =
                        UserSessionManagementController.deleteAllSession();
                    if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
                }
            }
        } catch (error) {
            return errorDebug(error, 'TaDashboardDAO.updateTAListRequest');
        }
    },
    getTACompanyListDAO: async function (pl) {
        try {
            const taResult = await TaDashboardAPI.getTACompanyListRequest(pl);
            if (taResult) {
                const statusCode = taResult['statusCode'];
                if (statusCode === HTTPStatusCode.OK) {
                    const tempResult = taResult.responseBody;
                    return {
                        statusCode: statusCode,
                        responseBody: tempResult.details,
                    };
                } else if (statusCode === HTTPStatusCode.NOT_FOUND) return taResult;
                else if (statusCode === HTTPStatusCode.BAD_REQUEST) return taResult;
                else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
                    let deletedResponse =
                        UserSessionManagementController.deleteAllSession();
                    if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
                }
            }
        } catch (error) {
            return errorDebug(error, 'TaDashboardDAO.getTACompanyListDAO');
        }
    },
    getHRlistFromCompanyDAO:async function (pl) {
        try {
            const taResult = await TaDashboardAPI.getTAHRListFromCompanyRequest(pl);
            if (taResult) {
                const statusCode = taResult['statusCode'];
                if (statusCode === HTTPStatusCode.OK) {
                    const tempResult = taResult.responseBody;
                    return {
                        statusCode: statusCode,
                        responseBody: tempResult.details,
                    };
                } else if (statusCode === HTTPStatusCode.NOT_FOUND) return taResult;
                else if (statusCode === HTTPStatusCode.BAD_REQUEST) return taResult;
                else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
                    let deletedResponse =
                        UserSessionManagementController.deleteAllSession();
                    if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
                }
            }
        } catch (error) {
            return errorDebug(error, 'TaDashboardDAO.getHRlistFromCompanyDAO');
        }
    },
    getHRTalentDetailsRequestDAO:async function (id) {
        try {
            const taResult = await TaDashboardAPI.getHRTalentDetailsRequest(id);
            if (taResult) {
                const statusCode = taResult['statusCode'];
                if (statusCode === HTTPStatusCode.OK) {
                    const tempResult = taResult.responseBody;
                    return {
                        statusCode: statusCode,
                        responseBody: tempResult.details,
                    };
                } else if (statusCode === HTTPStatusCode.NOT_FOUND) return taResult;
                else if (statusCode === HTTPStatusCode.BAD_REQUEST) return taResult;
                else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
                    let deletedResponse =
                        UserSessionManagementController.deleteAllSession();
                    if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
                }
            }
        } catch (error) {
            return errorDebug(error, 'TaDashboardDAO.getHRTalentDetailsRequestDAO');
        }
    },
    getGoalsDetailsRequestDAO:async function (pl) {
        try {
            const taResult = await TaDashboardAPI.getGoalsDetailsRequest(pl);
            if (taResult) {
                const statusCode = taResult['statusCode'];
                if (statusCode === HTTPStatusCode.OK) {
                    const tempResult = taResult.responseBody;
                    return {
                        statusCode: statusCode,
                        responseBody: tempResult.details,
                    };
                } else if (statusCode === HTTPStatusCode.NOT_FOUND) return taResult;
                else if (statusCode === HTTPStatusCode.BAD_REQUEST) return taResult;
                else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
                    let deletedResponse =
                        UserSessionManagementController.deleteAllSession();
                    if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
                }
            }
        } catch (error) {
            return errorDebug(error, 'TaDashboardDAO.getGoalsDetailsRequestDAO');
        }
    },
}