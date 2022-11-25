import { hiringRequestAPI } from 'apis/hiringRequestAPI';
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
};
