import { userAPI } from 'apis/userAPI';
import { SessionType } from 'constants/application';
import { HTTPStatusCode } from 'constants/network';
import UserAccountModel from 'models/userAccountModels';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const userDAO = {
	loginDAO: async function (userdata) {
		try {
			const loginResult = await userAPI.login(userdata);
			if (loginResult) {
				const statusCode = loginResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = loginResult.responseBody;
					let _userAccount = new UserAccountModel(tempResult.details);
					await UserSessionManagementController.setUserSession(_userAccount);
					await UserSessionManagementController.setSessionStatus(
						SessionType.ACTIVE,
					);
					await UserSessionManagementController.setAPIKey(
						_userAccount['Token'],
					);
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
			let response = await UserSessionManagementController.deleteUserSession();

			return response;
		} catch (error) {
			return errorDebug(error, 'UserDAO.LoginDAO');
		}
	},
};
