import { hiringRequestAPI } from 'apis/hiringRequestAPI';
import { HiringRequestAPI } from 'apis/hrAPI';
import { HTTPStatusCode } from 'constants/network';
import UTSRoutes from 'constants/routes';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { Navigate } from 'react-router-dom';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const hiringRequestDAO = {
	getPaginatedHiringRequestDAO: async function (hrData) {
		try {
			const hrResult = await hiringRequestAPI.getPaginatedHiringRequest(hrData);
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
			const hrResult = await hiringRequestAPI.getHRDetailsRequest(hrid);
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
			const editorResult = await hiringRequestAPI.sendHREditorRequest(
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
				await hiringRequestAPI.sendHRPriorityForNextWeekRequest(
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
			return errorDebug(error, 'ClientDAO.createHRDAO');
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
			return errorDebug(error, 'ClientDAO.createDebriefingDAO');
		}
	},
};
