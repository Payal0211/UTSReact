import { InterviewAPI } from 'apis/interviewAPI';
import { HTTPStatusCode } from 'constants/network';
import UTSRoutes from 'constants/routes';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { Navigate } from 'react-router-dom';
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
};
