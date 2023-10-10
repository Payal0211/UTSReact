import { OnboardAPI } from 'apis/onboardAPI';
import { HTTPStatusCode } from 'constants/network';
import UTSRoutes from 'constants/routes';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { Navigate } from 'react-router-dom';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const OnboardDAO = {
	onboardTalentRequestDAO: async function (onboardData) {
		try {
			const onboardTalentResponse = await OnboardAPI.onboardTalentRequest(
				onboardData,
			);
			if (onboardTalentResponse) {
				const statusCode = onboardTalentResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = onboardTalentResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return onboardTalentResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return onboardTalentResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'userDAO.onboardTalentRequestDAO');
		}
	},
	getOnboardStatusRequestDAO: async function (onboardData) {
		try {
			const onboardTalentResponse = await OnboardAPI.getOnboardingStatusRequest(
				onboardData,
			);
			if (onboardTalentResponse) {
				const statusCode = onboardTalentResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = onboardTalentResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return onboardTalentResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return onboardTalentResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'userDAO.getOnboardStatusRequestDAO');
		}
	},
	onboardStatusUpdatesRequestDAO: async function (onboardData) {
		try {
			const onboardTalentResponse =
				await OnboardAPI.onboardingStatusUpdatesRequest(onboardData);
			if (onboardTalentResponse) {
				const statusCode = onboardTalentResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = onboardTalentResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return onboardTalentResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return onboardTalentResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'userDAO.onboardStatusUpdatesRequestDAO');
		}
	},
	getClientLegelInfoDAO: async function (HRID) {
		try {
			const clientLeagelinfo =
				await OnboardAPI.getClientLegalInfo(HRID);
			if (clientLeagelinfo) {
				const statusCode = clientLeagelinfo['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = clientLeagelinfo?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return clientLeagelinfo;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return clientLeagelinfo;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'userDAO.getClientLegelInfoDAO');
		}
	},
	getTalentOnBoardInfoDAO: async function (ONBID) {
		try {
			const TalentOnBoardlinfo =
				await OnboardAPI.getTalentOnBoardInfo(ONBID);
			if (TalentOnBoardlinfo) {
				const statusCode = TalentOnBoardlinfo['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = TalentOnBoardlinfo?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return TalentOnBoardlinfo;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return TalentOnBoardlinfo;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'userDAO.getTalentOnBoardInfoDAO');
		}
	},
	uploadSOWFileDAO: async function (feedBackdata) {
		try {
            const submitFeedBackForm = await OnboardAPI.submitSOWFile(feedBackdata);
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
	getBeforeOnBoardInfoDAO: async function (payload) {
		try {
			const OnBoardlinfo =
				await OnboardAPI.getBeforeOnBoardInfo(payload);
			if (OnBoardlinfo) {
				const statusCode = OnBoardlinfo['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = OnBoardlinfo?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return OnBoardlinfo;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return OnBoardlinfo;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'userDAO.getBeforeOnBoardInfoDAO');
		}
	},
	getDuringOnBoardInfoDAO: async function (payload) {
		try {
			const OnBoardlinfo =
				await OnboardAPI.getDuringOnBoardInfo(payload);
			if (OnBoardlinfo) {
				const statusCode = OnBoardlinfo['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = OnBoardlinfo?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return OnBoardlinfo;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return OnBoardlinfo;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'userDAO.getDuringOnBoardInfoDAO');
		}
	},
	updateBeforeOnBoardInfoDAO: async function (payload) {
		try {
			const OnBoardlinfo =
				await OnboardAPI.updateBeforeOnBoardInfo(payload);
			if (OnBoardlinfo) {
				const statusCode = OnBoardlinfo['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = OnBoardlinfo?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return OnBoardlinfo;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return OnBoardlinfo;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'userDAO.updateBeforeOnBoardInfoDAO');
		}
	},
	updatePreOnBoardInfoDAO: async function (payload) {
		try {
			const OnBoardlinfo =
				await OnboardAPI.updatePreOnBoardInfo(payload);
			if (OnBoardlinfo) {
				const statusCode = OnBoardlinfo['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = OnBoardlinfo?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return OnBoardlinfo;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return OnBoardlinfo;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'userDAO.updatePreOnBoardInfoDAO');
		}
	},
	uploadPolicyDAO: async function (formData,id) {
		try {
			const OnBoardlinfo =
				await OnboardAPI.uploadPolicyFile(formData,id);
			if (OnBoardlinfo) {
				const statusCode = OnBoardlinfo['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = OnBoardlinfo?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return OnBoardlinfo;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return OnBoardlinfo;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'userDAO.uploadPolicyDAO');
		}
	},
};
