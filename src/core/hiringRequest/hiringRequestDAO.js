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
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return hrResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST) return hrResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					UserSessionManagementController.deleteAllSession();
					window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.getPaginatedHiringRequestDAO');
		}
	},
	getSchduleInterviewInformation: async function (data) {
		try {
			const scheduleResult = await HiringRequestAPI.scheduleInterview(data);
			if (scheduleResult) {
				const statusCode = scheduleResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = scheduleResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return scheduleResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return scheduleResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					UserSessionManagementController.deleteAllSession();
					window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.getPaginatedHiringRequestDAO');
		}
	},

	getReSchduleInterviewInformation: async function (data) {
		try {
			const reScheduleResult = await HiringRequestAPI.reScheduleInterview(data);
			if (reScheduleResult) {
				const statusCode = reScheduleResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = reScheduleResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return reScheduleResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return reScheduleResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					UserSessionManagementController.deleteAllSession();
					window.location.replace(UTSRoutes.LOGINROUTE);
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
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
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
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
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
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
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
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
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
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
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
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
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
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
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
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
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
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
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
	getTalentProfileLogDAO: async (talentDetails) => {
		try {
			const getTalentProfileLogResponse =
				await HiringRequestAPI.getTalentProfileLogReqeust(talentDetails);
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
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.getTalentProfileLogDAO()');
		}
	},
	getAllFilterDataForHRRequestDAO: async () => {
		try {
			const getAllFilterDataResponse =
				await HiringRequestAPI.getAllFilterDataForHRRequest();
			if (getAllFilterDataResponse) {
				const statusCode = getAllFilterDataResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = getAllFilterDataResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return getAllFilterDataResponse;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return getAllFilterDataResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(
				error,
				'hiringRequestDAO.getAllFilterDataForHRRequestDAO()',
			);
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
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.setTalentPrioritiesDAO()');
		}
	},
	updateODRPOOLStatusRequestDAO: async (odrPoolStatus) => {
		try {
			const odrPoolStatusResponse =
				await HiringRequestAPI.updateODRPOOLStatusRequest(odrPoolStatus);
			if (odrPoolStatusResponse) {
				const statusCode = odrPoolStatusResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = odrPoolStatusResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return odrPoolStatusResponse;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return odrPoolStatusResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(
				error,
				'hiringRequestDAO.updateODRPOOLStatusRequestDAO()',
			);
		}
	},
	deleteHRDAO: async (deleteBody) => {
		try {
			const deleteHRResponse = await HiringRequestAPI.deleteHRRequest(
				deleteBody,
			);
			if (deleteHRResponse) {
				const statusCode = deleteHRResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = deleteHRResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return deleteHRResponse;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return deleteHRResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.deleteHRDAO()');
		}
	},
	uploadFileDAO: async (fileData) => {
		try {
			const uploadFileResponse = await HiringRequestAPI.uploadFile(fileData);
			if (uploadFileResponse) {
				const statusCode = uploadFileResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = uploadFileResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return uploadFileResponse;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return uploadFileResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.deleteHRDAO()');
		}
	},
	uploadGoogleDriveFileDAO: async (fileData) => {
		try {
			const uploadFileResponse = await HiringRequestAPI.uploadGoogleDriveFile(
				fileData,
			);
			if (uploadFileResponse) {
				const statusCode = uploadFileResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = uploadFileResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return uploadFileResponse;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return uploadFileResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.deleteHRDAO()');
		}
	},
	uploadFileFromGoogleDriveLinkDAO: async (link) => {
		try {
			const uploadFileResponse =
				await HiringRequestAPI.uploadFileFromGoogleDriveLink(link);
			if (uploadFileResponse) {
				const statusCode = uploadFileResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = uploadFileResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return uploadFileResponse;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return uploadFileResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(
				error,
				'hiringRequestDAO.uploadFileFromGoogleDriveLinkDAO()',
			);
		}
	},
	getHRAcceptanceRequestDAO: async (hrAcceptanceDetail) => {
		try {
			const getHRAcceptanceResponse =
				await HiringRequestAPI.getHRAcceptanceRequest(hrAcceptanceDetail);
			if (getHRAcceptanceResponse) {
				const statusCode = getHRAcceptanceResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = getHRAcceptanceResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return getHRAcceptanceResponse;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return getHRAcceptanceResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.getHRAcceptanceRequestDAO()');
		}
	},
	addHRAcceptanceRequestDAO: async (hrAcceptanceDetail) => {
		try {
			const addHRAcceptanceResponse =
				await HiringRequestAPI.addHRAcceptanceRequest(hrAcceptanceDetail);
			if (addHRAcceptanceResponse) {
				const statusCode = addHRAcceptanceResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = addHRAcceptanceResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return addHRAcceptanceResponse;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return addHRAcceptanceResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.addHRAcceptanceRequestDAO()');
		}
	},
	openPostAcceptanceRequestDAO: async (hrAcceptanceDetail) => {
		try {
			const openPostAcceptanceResponse =
				await HiringRequestAPI.openPostAcceptanceRequest(hrAcceptanceDetail);

			if (openPostAcceptanceResponse) {
				const statusCode = openPostAcceptanceResponse['statusCode'];

				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = openPostAcceptanceResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return openPostAcceptanceResponse;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return openPostAcceptanceResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(
				error,
				'hiringRequestDAO.openPostAcceptanceRequestDAO()',
			);
		}
	},

	getConfirmSlotDetailsDAO: async (interviewId) => {
		try {
			const getConfirmSlotDetails =
				await HiringRequestAPI.getConfirmSlotDetailsRequest(interviewId);

			if (getConfirmSlotDetails) {
				const statusCode = getConfirmSlotDetails['statusCode'];

				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = getConfirmSlotDetails.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return getConfirmSlotDetails;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return getConfirmSlotDetails;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.getConfirmSlotDetailsDAO()');
		}
	},
	saveConfirmSlotDetailsDAO: async (data) => {
		try {
			const saveConfirmSlotDetails =
				await HiringRequestAPI.saveConfirmSlotDetailsRequest(data);

			if (saveConfirmSlotDetails) {
				const statusCode = saveConfirmSlotDetails['statusCode'];

				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = saveConfirmSlotDetails.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return saveConfirmSlotDetails;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return saveConfirmSlotDetails;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.getConfirmSlotDetailsDAO()');
		}
	},
	convertToDirectPlacementDAO: async (data) => {
		try {
			const convertToDireactPlacementDetails =
				await HiringRequestAPI.convertToDirectPlacement(data);

			if (convertToDireactPlacementDetails) {
				const statusCode = convertToDireactPlacementDetails['statusCode'];

				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = convertToDireactPlacementDetails.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return convertToDireactPlacementDetails;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return convertToDireactPlacementDetails;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.getConfirmSlotDetailsDAO()');
		}
	},
	convertToContracualPlacementDAO: async (data) => {
		try {
			const convertToContracualPlacementDetails =
				await HiringRequestAPI.convertToContracual(data);

			if (convertToContracualPlacementDetails) {
				const statusCode = convertToContracualPlacementDetails['statusCode'];

				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = convertToContracualPlacementDetails.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return convertToContracualPlacementDetails;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return convertToContracualPlacementDetails;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.getConfirmSlotDetailsDAO()');
		}
	},
	getHrDetailsDAO: async (data) => {
		try {
			const getHrDetails = await HiringRequestAPI.getAllHrDetails(data);

			if (getHrDetails) {
				const statusCode = getHrDetails['statusCode'];

				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = getHrDetails.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return getHrDetails;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return getHrDetails;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.getConfirmSlotDetailsDAO()');
		}
	},
	getTalentDPConversionDAO: async (data) => {
		try {
			const getTalentDPConversion =
				await HiringRequestAPI.getTalentDPConversion(data);

			if (getTalentDPConversion) {
				const statusCode = getTalentDPConversion['statusCode'];

				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = getTalentDPConversion.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return getTalentDPConversion;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return getTalentDPConversion;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.getConfirmSlotDetailsDAO()');
		}
	},
	getHrDpConversionDAO: async (data) => {
		try {
			const getHrDpConversion = await HiringRequestAPI.getHrDpConversion(data);

			if (getHrDpConversion) {
				const statusCode = getHrDpConversion['statusCode'];

				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = getHrDpConversion.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return getHrDpConversion;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return getHrDpConversion;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.getConfirmSlotDetailsDAO()');
		}
	},
	saveDpConversionDAO: async (data, amount) => {
		try {
			const saveDpConversion = await HiringRequestAPI.saveDpConversion(
				data,
				amount,
			);

			if (saveDpConversion) {
				const statusCode = saveDpConversion['statusCode'];

				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = saveDpConversion.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return saveDpConversion;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return saveDpConversion;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.getConfirmSlotDetailsDAO()');
		}
	},
	getConvertToContractualDAO: async (data) => {
		try {
			const getHrDpConversion =
				await HiringRequestAPI.getHrConvertToContractualInfo(data);

			if (getHrDpConversion) {
				const statusCode = getHrDpConversion['statusCode'];

				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = getHrDpConversion.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return getHrDpConversion;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return getHrDpConversion;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.getConfirmSlotDetailsDAO()');
		}
	},
	saveConvertToContractualDAO: async (data, amount) => {
		try {
			const saveDpConversion =
				await HiringRequestAPI.saveHrConvertToContractualInfo(data, amount);

			if (saveDpConversion) {
				const statusCode = saveDpConversion['statusCode'];

				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = saveDpConversion.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return saveDpConversion;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return saveDpConversion;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.getConfirmSlotDetailsDAO()');
		}
	},
	saveTalentDpConversionDAO: async (data) => {
		try {
			const saveDpConversion = await HiringRequestAPI.saveTalentDpConversion(
				data,
			);

			if (saveDpConversion) {
				const statusCode = saveDpConversion['statusCode'];

				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = saveDpConversion.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return saveDpConversion;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return saveDpConversion;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.getConfirmSlotDetailsDAO()');
		}
	},
	calculateTalentDpConversion: async (
		hrid,
		contactPriorityId,
		dpPercentage,
		talentExpectedCTC,
	) => {
		try {
			const saveTalentDpConversion =
				await HiringRequestAPI.calculateDpConversionCost(
					hrid,
					contactPriorityId,
					dpPercentage,
					talentExpectedCTC,
				);

			if (saveTalentDpConversion) {
				const statusCode = saveTalentDpConversion['statusCode'];

				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = saveTalentDpConversion.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return saveTalentDpConversion;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return saveTalentDpConversion;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.getConfirmSlotDetailsDAO()');
		}
	},
	//         if (statusCode === HTTPStatusCode.OK) {
	//           const tempResult = convertToDireactPlacementDetails.responseBody;
	//           return {
	//             statusCode: statusCode,
	//             responseBody: tempResult,
	//           };
	//         } else if (statusCode === HTTPStatusCode.NOT_FOUND) {
	//           return convertToDireactPlacementDetails;
	//         } else if (
	//           statusCode === HTTPStatusCode.BAD_REQUEST ||
	//           statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
	//         )
	//           return convertToDireactPlacementDetails;
	//         else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
	//           let deletedResponse =
	//             UserSessionManagementController.deleteAllSession();
	//           if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
	//         }
	//         return statusCode;
	//       }
	//     } catch (error) {
	//       return errorDebug(error, "hiringRequestDAO.getConfirmSlotDetailsDAO()");
	//     }
	//   },
	saveTalentsContracualDAO: async (data) => {
		try {
			const saveTalentContracual = await HiringRequestAPI.saveTalentContracual(
				data,
			);

			if (saveTalentContracual) {
				const statusCode = saveTalentContracual['statusCode'];

				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = saveTalentContracual.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return saveTalentContracual;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return saveTalentContracual;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.getConfirmSlotDetailsDAO()');
		}
	},
	calculateHRCostDAO: async (hrid, priorityId, hrcost, percentageid) => {
		try {
			const calculateHrCost = await HiringRequestAPI.calculateHRConst(
				hrid,
				priorityId,
				hrcost,
				percentageid,
			);

			if (calculateHrCost) {
				const statusCode = calculateHrCost['statusCode'];

				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = calculateHrCost.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return calculateHrCost;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return calculateHrCost;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.getConfirmSlotDetailsDAO()');
		}
	},
	getTelantContracualConversionDAO: async (data) => {
		try {
			const getTelantCC =
				await HiringRequestAPI.getTelentsContractualConversion(data);

			if (getTelantCC) {
				const statusCode = getTelantCC['statusCode'];

				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = getTelantCC.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return getTelantCC;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return getTelantCC;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.getConfirmSlotDetailsDAO()');
		}
	},
	acceptHRRequestDAO: async (data) => {
		try {
			const acceptHRResponse = await HiringRequestAPI.acceptHRRequest(data);

			if (acceptHRResponse) {
				const statusCode = acceptHRResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = acceptHRResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return acceptHRResponse;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return acceptHRResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.acceptHRRequestDAO()');
		}
	},
	getRemainingPriorityCountDAO: async () => {
		try {
			const getPriorityCount =
				await HiringRequestAPI.getRemainingPriorityCount();

			if (getPriorityCount) {
				const statusCode = getPriorityCount['statusCode'];

				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = getPriorityCount.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return getPriorityCount;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return getPriorityCount;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(
				error,
				'hiringRequestDAO.getRemainingPriorityCountDAO()',
			);
		}
	},
	setHrPriorityDAO: async (star, hrid, salesperson) => {
		try {
			const setHrPriority = await HiringRequestAPI.setHrPriority(
				star,
				hrid,
				salesperson,
			);

			if (setHrPriority) {
				const statusCode = setHrPriority['statusCode'];

				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = setHrPriority.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return setHrPriority;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return setHrPriority;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.setHrPriorityDAO()');
		}
	},
	calculateHRCostRequestDAO: async (calculateHRData) => {
		try {
			const calcualteHRCostDetials =
				await HiringRequestAPI.calculateHRCostRequest(calculateHRData);

			if (calcualteHRCostDetials) {
				const statusCode = calcualteHRCostDetials['statusCode'];

				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = calcualteHRCostDetials.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return calcualteHRCostDetials;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return calcualteHRCostDetials;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.getHRCostDetalisRequestDAO()');
		}
	},
	getHRCostDetalisRequestDAO: async (hrCostData) => {
		try {
			const getHRCostDetailsRequest =
				await HiringRequestAPI.getHRCostDetailsRequest(hrCostData);

			if (getHRCostDetailsRequest) {
				const statusCode = getHRCostDetailsRequest['statusCode'];

				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = getHRCostDetailsRequest.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return getHRCostDetailsRequest;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return getHRCostDetailsRequest;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.getHRCostDetalisRequestDAO()');
		}
	},
	updateHRCostRequestDAO: async (saveBillRatePayload) => {
		try {
			const updateHRCostDetails = await HiringRequestAPI.updateHRCostRequest(
				saveBillRatePayload,
			);

			if (updateHRCostDetails) {
				const statusCode = updateHRCostDetails['statusCode'];

				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = updateHRCostDetails.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return updateHRCostDetails;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return updateHRCostDetails;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.updateHRCostRequestDAO()');
		}
	},
	updateTalentFeesRequestDAO: async (savePayRatePayload) => {
		try {
			const updateTalentFees = await HiringRequestAPI.updateTalentFeesRequest(
				savePayRatePayload,
			);

			if (updateTalentFees) {
				const statusCode = updateTalentFees['statusCode'];

				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = updateTalentFees.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return updateTalentFees;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return updateTalentFees;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.updateTalentFeesRequestDAO()');
		}
	},
	getAMDataSendRequestDAO: async (talentDetails) => {
		try {
			const amDataResponse = await HiringRequestAPI.getAMDataSendRequest(
				talentDetails,
			);

			if (amDataResponse) {
				const statusCode = amDataResponse['statusCode'];

				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = amDataResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return amDataResponse;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return amDataResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.getAMDataSendRequestDAO()');
		}
	},
	viewHRDetailsRequestDAO: async (HRId) => {

		try {
			const viewHRDetails = await HiringRequestAPI.viewHRDetailsRequest(HRId);
			if (viewHRDetails) {
				const statusCode = viewHRDetails['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = viewHRDetails.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return viewHRDetails;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return viewHRDetails;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.viewHRDetailsRequestDAO()');
		}
	},
	getHRDetailsRequestDAO: async (hrId) => {
		try {
			const uploadFileResponse =
				await HiringRequestAPI.getNewHRDetailsRequest(hrId);
			if (uploadFileResponse) {
				const statusCode = uploadFileResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = uploadFileResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return uploadFileResponse;
				} else if (
					statusCode === HTTPStatusCode.BAD_REQUEST ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return uploadFileResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
				}
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'hiringRequestDAO.deleteHRDAO()');
		}
	},
};
