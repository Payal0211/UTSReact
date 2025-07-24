import { TaDashboardAPI } from 'apis/taDashboardAPI';
import { HTTPStatusCode } from 'constants/network';
import UTSRoutes from 'constants/routes';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { Navigate } from 'react-router-dom';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const TaDashboardDAO = {
    getAllMasterDAO: async function (type) {
        try {
            const taResult = await TaDashboardAPI.getAllMasterRequest(type);
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
    getImmediateTalentDetailsRequestDAO:async function (id) {
        try {
            const taResult = await TaDashboardAPI.getImmediateTalentDetailsRequest(id);
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
            return errorDebug(error, 'TaDashboardDAO.getImmediateTalentDetailsRequestDAO');
        }
    },
    getTotalRevenueRequestDAO:async function (pl) {
        try {
            const taResult = await TaDashboardAPI.getTotalRevenueRequest(pl);
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
            return errorDebug(error, 'TaDashboardDAO.getTotalRevenueRequestDAO');
        }
    },
    getDailyActiveTargetsDAO:async function (pl) {
        try {
            const taResult = await TaDashboardAPI.getDailyActiveTargetsRequest(pl);
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
            return errorDebug(error, 'TaDashboardDAO.getDailyActiveTargetsDAO');
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
    getHRTalentsWiseRecruiterDashboardDAO:async function (pl) {
        try {
            const taResult = await TaDashboardAPI.getHRTalentsWiseRecruiterDashboardRequest(pl);
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
            return errorDebug(error, 'TaDashboardDAO.getHRTalentsWiseRecruiterDashboardDAO');
        }
    },
       getHRTalentsWiseRecruiterInterviewDashboardDAO:async function (pl) {
        try {
            const taResult = await TaDashboardAPI.getHRTalentsWiseRecruiterInterviewDashboardReq(pl);
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
            return errorDebug(error, 'TaDashboardDAO.getHRTalentsWiseRecruiterInterviewDashboardDAO');
        }
    },
    geAllTAUSERSRequestDAO:async function () {
        try {
            const taResult = await TaDashboardAPI.geAllTAUSERSRequest();
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
            return errorDebug(error, 'TaDashboardDAO.geAllTAUSERSRequestDAO');
        }
    },
    
    insertTaskCommentRequestDAO:async function (pl) {
        try {
            const taResult = await TaDashboardAPI.insertTaskCommentRequest(pl);
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
            return errorDebug(error, 'TaDashboardDAO.insertTaskCommentRequestDAO');
        }
    },
        insertRecruiterCommentRequestDAO:async function (pl) {
        try {
            const taResult = await TaDashboardAPI.insertRecruiterCommentRequest(pl);
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
            return errorDebug(error, 'TaDashboardDAO.insertRecruiterCommentRequestDAO');
        }
    },
    getALLCommentsDAO:async function (id) {
        try {
            const taResult = await TaDashboardAPI.getALLCommentsRequest(id);
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
            return errorDebug(error, 'TaDashboardDAO.getALLCommentsDAO');
        }
    },
    getALLRevenueCommentsDAO:async function (pl) {
        try {
            const taResult = await TaDashboardAPI.getALLRevenueCommentsRequest(pl);
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
            return errorDebug(error, 'TaDashboardDAO.getALLRevenueCommentsDAO');
        }
    },
    removeTaskDAO:async function (id) {
        try {
            const taResult = await TaDashboardAPI.removeTasksRequest(id);
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
            return errorDebug(error, 'TaDashboardDAO.removeTaskDAO');
        }
    },
    insertProfileShearedTargetDAO:async function (pl) {
        try {
            const taResult = await TaDashboardAPI.insertProfileShearedTargetRequest(pl);
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
            return errorDebug(error, 'TaDashboardDAO.insertProfileShearedTargetDAO');
        }
    },
    getTAWiseHRPipelineDetailsDAO:async function (pl) {
        try {
            const taResult = await TaDashboardAPI.getTAWiseHRPipelineDetailsRequest(pl);
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
            return errorDebug(error, 'TaDashboardDAO.getTAWiseHRPipelineDetailsDAO');
        }
    },

    getTAMonthlyGoalDAO:async function () {
        try {
            const taResult = await TaDashboardAPI.getTAGoalListAPI();
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
            return errorDebug(error, 'TaDashboardDAO.getTAWiseHRPipelineDetailsDAO');
        }
    },
    addOrUpdateTAMonthlyGoalDAO:async function (payload) {
        try {
            const taResult = await TaDashboardAPI.addOrUpdateTAMonthlyGoalAPI(payload);
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
            return errorDebug(error, 'TaDashboardDAO.addOrUpdateTAMonthlyGoalDAO');
        }
    },
    deleteTAMonthlyGoalDAO:async function (payload) {
        try {
            const taResult = await TaDashboardAPI.deleteTAGoalAPI(payload);
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
            return errorDebug(error, 'TaDashboardDAO.deleteTAMonthlyGoalDAO');
        }
    },
}