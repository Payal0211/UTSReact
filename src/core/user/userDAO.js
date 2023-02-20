import { userAPI } from 'apis/userAPI';
import { SessionType } from 'constants/application';
import { HTTPStatusCode } from 'constants/network';
import UTSRoutes from 'constants/routes';
import UserAccountModel from 'models/userAccountModels';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { Navigate } from 'react-router-dom';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const userDAO = {
	getUserListRequestDAO: async function (userData) {
		try {
			const userListResult = await userAPI.getUserListRequest(userData);
			if (userListResult) {
				const statusCode = userListResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = userListResult?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return userListResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return userListResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'DealDAO.getUserListRequestDAO');
		}
	},
	loginDAO: async function (userdata) {
		try {
			const loginResult = await userAPI.login(userdata);
			if (loginResult) {
				const statusCode = loginResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = loginResult.responseBody;
					let _userAccount = new UserAccountModel(tempResult.details);
					UserSessionManagementController.setUserSession(_userAccount);
					UserSessionManagementController.setSessionStatus(SessionType.ACTIVE);
					UserSessionManagementController.setAPIKey(_userAccount['Token']);
					return {
						statusCode: statusCode,
						responseBody: _userAccount,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return loginResult;
				} else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return loginResult;
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'UserDAO.LoginDAO');
		}
	},
	logoutDAO: async function () {
		try {
			let response = UserSessionManagementController.deleteAllSession();
			return response && response;
		} catch (error) {
			return errorDebug(error, 'UserDAO.LoginDAO');
		}
	},
};
