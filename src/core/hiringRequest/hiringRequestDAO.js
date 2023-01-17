import { HiringRequestAPI } from 'apis/hiringRequestAPI';
import { HTTPStatusCode } from 'constants/network';
import UTSRoutes from 'constants/routes';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { Navigate } from 'react-router-dom';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const hiringRequestDAO = {
	getPaginatedHiringRequestDAO: async function (hrData) {
		try {
			const hrResult = await HiringRequestAPI.getPaginatedHiringRequest(hrData);
			if (hrResult) {
				const statusCode = hrResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = hrResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) return hrResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST) return hrResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.getPaginatedHiringRequestDAO');
		}
	},
	getViewHiringRequestDAO: async function (hrid) {
		try {
			const hrResult = await HiringRequestAPI.getHRDetailsRequest(hrid);
			if (hrResult) {
				const statusCode = hrResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = hrResult?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: JSON.parse(tempResult?.details),
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) return hrResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST) return hrResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.getViewHiringRequestDAO');
		}
	},
	sendHREditorRequestDAO: async function (editorDetails) {
		try {
			const editorResult = await HiringRequestAPI.sendHREditorRequest(
				editorDetails,
			);
			if (editorResult) {
				const statusCode = editorResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = editorResult?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				}
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.sendHREditorRequestDAO');
		}
	},
	sendHRPriorityForNextWeekRequestDAO: async function (priorityDetails) {
		try {
			const priorityResult =
				await HiringRequestAPI.sendHRPriorityForNextWeekRequest(
					priorityDetails,
				);
			if (priorityResult) {
				const statusCode = priorityResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = priorityResult?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return priorityResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return priorityResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(
				error,
				'hiringRequestDAO.sendHRPriorityForNextWeekRequestDAO',
			);
		}
	},
	getClientDetailRequestDAO: async function (clientEmail) {
		try {
			const clientDetailResult = await HiringRequestAPI.getClientDetailRequest(
				clientEmail,
			);

			if (clientDetailResult) {
				const statusCode = clientDetailResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = clientDetailResult?.responseBody;
					return { statusCode: statusCode, responseBody: tempResult.details };
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return clientDetailResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return clientDetailResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.getClientDetailRequestDAO');
		}
	},
	createHRDAO: async function (hrData) {
		try {
			const createHRResult = await HiringRequestAPI.createHiringRequest(hrData);
			if (createHRResult) {
				const statusCode = createHRResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = createHRResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return createHRResult;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return createHRResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.createHRDAO');
		}
	},
	createDebriefingDAO: async function (debriefData) {
		try {
			const createDebriefResult =
				await HiringRequestAPI.createDebriefingRequest(debriefData);
			if (createDebriefResult) {
				const statusCode = createDebriefResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = createDebriefResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return createDebriefResult;
				} else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return createDebriefResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.createDebriefingDAO');
		}
	},
	getMatchmakingDAO: async function (matchMakingData) {
		try {
			const getMatchmakingResult = await HiringRequestAPI.getMatchmakingRequest(
				matchMakingData,
			);
			if (getMatchmakingResult) {
				const statusCode = getMatchmakingResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = getMatchmakingResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return getMatchmakingResult;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return getMatchmakingResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.getMatchmakingDAO()');
		}
	},
	getTalentCostConversionDAO: async function (talentCost) {
		try {
			const getTalentCostResponse =
				await HiringRequestAPI.getTalentCostConversionRequest(talentCost);
			if (getTalentCostResponse) {
				const statusCode = getTalentCostResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = getTalentCostResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return getTalentCostResponse;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return getTalentCostResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.getTalentCostConversionDAO()');
		}
	},
	getTalentTechScoreDAO: async function (talentID) {
		try {
			const getTalentTechScoreResponse =
				await HiringRequestAPI.getTalentTechScoreCardRequest(talentID);
			if (getTalentTechScoreResponse) {
				const statusCode = getTalentTechScoreResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = getTalentTechScoreResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return getTalentTechScoreResponse;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return getTalentTechScoreResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.getTalentTechScoreDAO()');
		}
	},
	getTalentProfileSharedDetailDAO: async function (talentObj) {
		try {
			const getTalentProfileSharedDetailResponse =
				await HiringRequestAPI.getTalentProfileSharedDetailRequest(talentObj);
			if (getTalentProfileSharedDetailResponse) {
				const statusCode = getTalentProfileSharedDetailResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = getTalentProfileSharedDetailResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return getTalentProfileSharedDetailResponse;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return getTalentProfileSharedDetailResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(
				error,
				'hiringRequestDAO.getTalentProfileSharedDetailDAO()',
			);
		}
	},
	getTalentProfileLogDAO: async (talentID) => {
		try {
			const getTalentProfileLogResponse =
				await HiringRequestAPI.getTalentProfileLogReqeust(talentID);
			if (getTalentProfileLogResponse) {
				const statusCode = getTalentProfileLogResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = getTalentProfileLogResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return getTalentProfileLogResponse;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return getTalentProfileLogResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.getTalentProfileLogDAO()');
		}
	},
	setTalentPrioritiesDAO: async (talentPrioritiesData) => {
		try {
			const getTalentPrioritiesResponse =
				await HiringRequestAPI.setTalentPrioritiesRequest(talentPrioritiesData);
			if (getTalentPrioritiesResponse) {
				const statusCode = getTalentPrioritiesResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = getTalentPrioritiesResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return getTalentPrioritiesResponse;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return getTalentPrioritiesResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.setTalentPrioritiesDAO()');
		}
	},
};
