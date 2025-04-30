import { InterviewAPI } from 'apis/interviewAPI';
import { HTTPStatusCode } from 'constants/network';
import UTSRoutes from 'constants/routes';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';

import { errorDebug } from 'shared/utils/error_debug_utils';

export const InterviewDAO = {
	getInterviewListDAO: async function (interviewData) {
		try {
			const interviewListResult = await InterviewAPI.getInterviewListRequest(
				interviewData,
			);
			if (interviewListResult) {
				const statusCode = interviewListResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = interviewListResult?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return interviewListResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return interviewListResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'InterviewDAO.getInterviewListDAO');
		}
	},
	getInterviewStatusRequestDAO: async function (interviewData) {
		try {
			const interviewStatusDetailsResponse =
				await InterviewAPI.getInterviewStatusDetailsRequest(interviewData);
			if (interviewStatusDetailsResponse) {
				const statusCode = interviewStatusDetailsResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = interviewStatusDetailsResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return interviewStatusDetailsResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return interviewStatusDetailsResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'InterviewDAO.getInterviewStatusRequestDAO');
		}
	},
	updateInterviewStatusDAO: async function (interviewData) {
		try {
			const updatedInterviewResponse = await InterviewAPI.updateInterviewStatus(
				interviewData,
			);
			if (updatedInterviewResponse) {
				const statusCode = updatedInterviewResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = updatedInterviewResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return updatedInterviewResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return updatedInterviewResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'InterviewDAO.updateInterviewStatusDAO');
		}
	},
	updateInterviewFeedbackRequestDAO: async function (interviewData) {
		try {
			const clientFeedbackResponse =
				await InterviewAPI.updateInterviewFeedbackRequest(interviewData);

			if (clientFeedbackResponse) {
				const statusCode = clientFeedbackResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = clientFeedbackResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return clientFeedbackResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return clientFeedbackResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(
				error,
				'InterviewDAO.updateInterviewFeedbackRequestDAO',
			);
		}
	},
	getClientFeedbackRequestDAO: async function (clientFeedbackDetails) {
		try {
			const clientFeedbackResponse =
				await InterviewAPI.getClientFeedbackRequest(clientFeedbackDetails);

			if (clientFeedbackResponse) {
				const statusCode = clientFeedbackResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = clientFeedbackResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return clientFeedbackResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return clientFeedbackResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'InterviewDAO.getClientFeedbackRequestDAO');
		}
	},
	ClientCurrentDetailsForAnotherRoundRequestDAO: async function (
		clientFeedbackDetails,
	) {
		try {
			const clientFeedbackResponse =
				await InterviewAPI.ClientCurrentDetailsForAnotherRoundRequest(
					clientFeedbackDetails,
				);

			if (clientFeedbackResponse) {
				const statusCode = clientFeedbackResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = clientFeedbackResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return clientFeedbackResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return clientFeedbackResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(
				error,
				'InterviewDAO.ClientCurrentDetailsForAnotherRoundRequestDAO',
			);
		}
	},
	saveAnotherRoundFeedbackRequestDAO: async function (clientFeedbackDetails) {
		try {
			const clientAnotherRoundResponse =
				await InterviewAPI.saveAnotherRoundFeedbackRequest(
					clientFeedbackDetails,
				);

			if (clientAnotherRoundResponse) {
				const statusCode = clientAnotherRoundResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = clientAnotherRoundResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return clientAnotherRoundResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return clientAnotherRoundResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(
				error,
				'InterviewDAO.saveAnotherRoundFeedbackRequestDAO',
			);
		}
	},
	CheckLinkedinURLRequestDAO: async function (clientDetails) {
		try {
			const checkLinkedinURLResponse =
				await InterviewAPI.CheckLinkedinURLRequest(clientDetails);

			if (checkLinkedinURLResponse) {
				const statusCode = checkLinkedinURLResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = checkLinkedinURLResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return checkLinkedinURLResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return checkLinkedinURLResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'InterviewDAO.CheckLinkedinURLRequestDAO');
		}
	},
	CheckInterviewerEmailIdRequestDAO: async function (clientDetails) {
		try {
			const checkInterviewerEmailResponse =
				await InterviewAPI.CheckInterviewerEmailIdRequest(clientDetails);
			if (checkInterviewerEmailResponse) {
				const statusCode = checkInterviewerEmailResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = checkInterviewerEmailResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return checkInterviewerEmailResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return checkInterviewerEmailResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(
				error,
				'InterviewDAO.CheckInterviewerEmailIdRequestDAO',
			);
		}
	},
	CheckInterviewTimeSlotDAO: async function (clientDetails) {
		try {
			const checkInterviewerTimeSlotResponse =
				await InterviewAPI.CheckInterviewTimeSlotRequest(clientDetails);
			if (checkInterviewerTimeSlotResponse) {
				const statusCode = checkInterviewerTimeSlotResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = checkInterviewerTimeSlotResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return checkInterviewerTimeSlotResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return checkInterviewerTimeSlotResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(
				error,
				'InterviewDAO.CheckInterviewTimeSlotDAO',
			);
		}
	},
	updateTalentAssessmentDAO: async function (pl) {
		try {
			const checkLinkedinURLResponse =
				await InterviewAPI.updateTalentAssessmentRequest(pl);

			if (checkLinkedinURLResponse) {
				const statusCode = checkLinkedinURLResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = checkLinkedinURLResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return checkLinkedinURLResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return checkLinkedinURLResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'InterviewDAO.updateTalentAssessmentDAO');
		}
	},
};
