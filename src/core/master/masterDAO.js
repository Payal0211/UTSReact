import { MasterAPI } from 'apis/masterAPI';
import { HTTPStatusCode } from 'constants/network';
import UTSRoutes from 'constants/routes';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { Navigate } from 'react-router-dom';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const masterDAO = {
	getFixedValueRequestDAO: async function () {
		try {
			const fixedValueResult = await MasterAPI.getFixedValueRequest();
			if (fixedValueResult) {
				const statusCode = fixedValueResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = fixedValueResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return fixedValueResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return fixedValueResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'masterDAO.getFixedValueRequestDAO');
		}
	},
	/* getGEORequest: async function () {
		try {
			const geoResult = await MasterAPI.getFixedValueRequest();
			if (fixedValueResult) {
				const statusCode = fixedValueResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = fixedValueResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return fixedValueResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return fixedValueResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'masterDAO.getGEORequest');
		}
	}, */
};
