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
            return errorDebug(error, 'engagementRequestDAO.getEngagementListDAO');
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
    viewOnboardFeedbackDAO: async function (onBoardID) {
        try {
            const viewOnboardFeedback = await EngagementRequestAPI.viewOnboardFeedback(onBoardID);
            if (viewOnboardFeedback) {
                const statusCode = viewOnboardFeedback['statusCode'];
                if (statusCode === HTTPStatusCode.OK) {
                    const tempResult = viewOnboardFeedback.responseBody;
                    return {
                        statusCode: statusCode,
                        responseBody: tempResult,
                    };
                }
                else if (
                    statusCode === HTTPStatusCode.NOT_FOUND ||
                    statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
                )
                    return viewOnboardFeedback;
                else if (statusCode === HTTPStatusCode.BAD_REQUEST) return viewOnboardFeedback;
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
            return errorDebug(error, 'engagementRequestDAO.viewOnboardFeedbackDAO');
        }
    },
    getFeedbackListDAO: async function (feedback) {
        try {
            const feedbackList = await EngagementRequestAPI.getFeedback(feedback);
            if (feedbackList) {
                const statusCode = feedbackList['statusCode'];
                if (statusCode === HTTPStatusCode.OK) {
                    const tempResult = feedbackList.responseBody;
                    return {
                        statusCode: statusCode,
                        responseBody: tempResult,
                    };
                } else if (
                    statusCode === HTTPStatusCode.NOT_FOUND ||
                    statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
                )
                    return feedbackList;
                else if (statusCode === HTTPStatusCode.BAD_REQUEST) return feedbackList;
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
            return errorDebug(error, 'engagementRequestDAO.getFeedbackListDAO');
        }
    },

    viewOnboardDetailsDAO: async function (onBoardID) {
        try {
            const onBoardDetails = await EngagementRequestAPI.onBoardDetails(onBoardID);
            if (onBoardDetails) {
                const statusCode = onBoardDetails['statusCode'];
                if (statusCode === HTTPStatusCode.OK) {
                    const tempResult = onBoardDetails.responseBody;
                    return {
                        statusCode: statusCode,
                        responseBody: tempResult,
                    };
                } else if (
                    statusCode === HTTPStatusCode.NOT_FOUND ||
                    statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
                )
                    return onBoardDetails;
                else if (statusCode === HTTPStatusCode.BAD_REQUEST) return onBoardDetails;
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
            return errorDebug(error, 'engagementRequestDAO.viewOnboardDetailsDAO');
        }
    },
    getFeedbackFormContentDAO: async function (getHRAndEngagementId) {
        try {
            const feedbackFormContent = await EngagementRequestAPI.feedbackFormContent(getHRAndEngagementId);
            if (feedbackFormContent) {
                const statusCode = feedbackFormContent['statusCode'];
                if (statusCode === HTTPStatusCode.OK) {
                    const tempResult = feedbackFormContent.responseBody;
                    return {
                        statusCode: statusCode,
                        responseBody: tempResult,
                    };
                } else if (
                    statusCode === HTTPStatusCode.NOT_FOUND ||
                    statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
                )
                    return feedbackFormContent;
                else if (statusCode === HTTPStatusCode.BAD_REQUEST) return feedbackFormContent;
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
            return errorDebug(error, 'engagementRequestDAO.getFeedbackFormContentDAO');
        }
    },

    saveFeedbackFormDAO: async function (feedBackdata) {
        try {
            const submitFeedBackForm = await EngagementRequestAPI.submitFeedBackForm(feedBackdata);
            if (submitFeedBackForm) {
                const statusCode = submitFeedBackForm['statusCode'];
                if (statusCode === HTTPStatusCode.OK) {
                    const tempResult = submitFeedBackForm.responseBody;
                    return {
                        statusCode: statusCode,
                        responseBody: tempResult,
                    };
                } else if (
                    statusCode === HTTPStatusCode.NOT_FOUND ||
                    statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
                )
                    return submitFeedBackForm;
                else if (statusCode === HTTPStatusCode.BAD_REQUEST) return submitFeedBackForm;
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
            return errorDebug(error, 'engagementRequestDAO.saveFeedbackFormDAO');
        }
    },



};
