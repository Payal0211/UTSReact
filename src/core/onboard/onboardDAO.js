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
};
