import { userAPI } from 'apis/userAPI';
import { SessionType } from 'constants/application';
import { HTTPStatusCode } from 'constants/network';
import UTSRoutes from 'constants/routes';
import UserAccountModel from 'models/userAccountModels';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
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
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'userDAO.getUserListRequestDAO');
		}
	},
	getUserDetailsRequestDAO: async function (userData) {
		try {
			const userDetailsResponse = await userAPI.getUserDetailsRequest(userData);
			if (userDetailsResponse) {
				const statusCode = userDetailsResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = userDetailsResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return userDetailsResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return userDetailsResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'userDAO.getUserDetailsRequestDAO');
		}
	},
	addNewUserRequestDAO: async function (userData) {
		try {
			const addNewUserResponse = await userAPI.createUserRequest(userData);
			if (addNewUserResponse) {
				const statusCode = addNewUserResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = addNewUserResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return addNewUserResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return addNewUserResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'userDAO.addNewUserRequestDAO');
		}
	},
	getIsEmployeeIDExistRequestDAO: async function (userData) {
		try {
			const employeeIDExistResponse = await userAPI.getIsEmployeeIDExistRequest(
				userData,
			);
			if (employeeIDExistResponse) {
				const statusCode = employeeIDExistResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = employeeIDExistResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return employeeIDExistResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return employeeIDExistResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'userDAO.getIsEmployeeIDExistRequestDAO');
		}
	},
	getIsEmployeeNameExistRequestDAO: async function (userData) {
		try {
			const employeeNameExistResponse =
				await userAPI.getIsEmployeeNameExistRequest(userData);
			if (employeeNameExistResponse) {
				const statusCode = employeeNameExistResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = employeeNameExistResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return employeeNameExistResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return employeeNameExistResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'userDAO.getIsEmployeeNameExistRequestDAO');
		}
	},
	loginDAO: async function (userdata) {
		try {
			const loginResult = await userAPI.login(userdata);

			localStorage.setItem("UserDesignation", loginResult?.responseBody?.details?.Designation)

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
			const logOutResult = await userAPI.logOut();

			if (logOutResult) {
				const statusCode = logOutResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					let response = UserSessionManagementController.deleteAllSession();
					return response && response;
				}
				return statusCode;
			}

		} catch (error) {
			return errorDebug(error, 'UserDAO.LogoutDAO');
		}
	},
};
