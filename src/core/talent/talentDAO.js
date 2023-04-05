import { TalentStatusAPI } from 'apis/talentAPI';
import { HTTPStatusCode } from 'constants/network';
import UTSRoutes from 'constants/routes';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { Navigate } from 'react-router-dom';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const TalentStatusDAO = {
	getStatusDetailRequestDAO: async function (talentDetails) {
		try {
			const talentDetailsResponse =
				await TalentStatusAPI.getStatusDetailRequest(talentDetails);
			if (talentDetailsResponse) {
				const statusCode = talentDetailsResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = talentDetailsResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return talentDetailsResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return talentDetailsResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'userDAO.getStatusDetailRequestDAO');
		}
	},
	updateTalentStatusRequestDAO: async function (talentDetails) {
		try {
			const talentDetailsResponse =
				await TalentStatusAPI.updateTalentStatusRequest(talentDetails);
			if (talentDetailsResponse) {
				const statusCode = talentDetailsResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = talentDetailsResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return talentDetailsResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return talentDetailsResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'userDAO.updateTalentStatusRequestDAO');
		}
	},
	removeOnHoldStatusRequestDAO: async function (talentDetails) {
		try {
			const talentDetailsResponse =
				await TalentStatusAPI.removeOnHoldStatusRequest(talentDetails);
			if (talentDetailsResponse) {
				const statusCode = talentDetailsResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = talentDetailsResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return talentDetailsResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return talentDetailsResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'userDAO.removeOnHoldStatusRequestDAO');
		}
	},
};
