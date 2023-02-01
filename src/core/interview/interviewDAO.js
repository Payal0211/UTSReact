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
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'InterviewDAO.getInterviewListDAO');
		}
	},
};
