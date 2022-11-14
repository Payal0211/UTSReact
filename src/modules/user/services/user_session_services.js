import { errorDebug } from 'shared/utils/error_debug_utils';
import { SecuredStorageService } from 'shared/services/secure_storage/secure_storage_service';

export const UserSessionManagementController = {
	/**
	 * @Function setUserSession()
	 * @params {*} userAccount
	 * @returns Write data in Secured Storage
	 */

	setUserSession: function (userAccount) {
		try {
			SecuredStorageService.writeSecuredData({
				key: 'userSessionInfo',
				value: userAccount,
			});
		} catch (error) {
			return errorDebug(
				error,
				'UserSessionManagementController.setUserSession',
			);
		}
	},

	/**
	 * @Function getUserSession()
	 * @returns SecuredStorage data
	 */
	getUserSession: function () {
		try {
			const data = SecuredStorageService.readSecuredData('userSessionInfo');
			return data && data;
		} catch (error) {
			return errorDebug(
				error,
				'UserSessionManagementController.getUserSession',
			);
		}
	},

	/**
	 * @Function deleteUserSession()
	 * @returns isSessionDeleted\
	 * @returnType bool
	 */
	deleteUserSession: function () {
		try {
			const isUserSessionDeleted =
				SecuredStorageService.deleteSecuredData('userSessionInfo');

			return isUserSessionDeleted;
		} catch (error) {
			errorDebug(error, 'UserSessionManagementController.deleteUserSession');
			return false;
		}
	},

	/**
	 * @Function setSessionStatus
	 * @param {*} sessionStatus
	 * @returns Write sessionStatus in Secured Storage
	 */
	setSessionStatus: function (sessionStatus) {
		try {
			SecuredStorageService.writeSecuredData({
				key: 'sessionStatus',
				value: sessionStatus,
			});
		} catch (error) {
			return errorDebug(
				error,
				'UserSessionManagementController.setSessionStatus',
			);
		}
	},

	/**
	 * @Function getSessionStatus()
	 * @returns sessionStatusData
	 */
	getSessionStatus: function () {
		try {
			const data = SecuredStorageService.readSecuredData('sessionStatus');
			return data && data;
		} catch (error) {
			return errorDebug(
				error,
				'UserSessionManagementController.getSessionStatus',
			);
		}
	},

	/**
	 * @Function setAPIKey()
	 * @param {*} accessKey
	 * @returns Write apiKey data in secured storage
	 */
	setAPIKey: function (accessKey) {
		try {
			SecuredStorageService.writeSecuredData({
				key: 'apiKey',
				value: accessKey,
			});
		} catch (error) {
			return errorDebug(error, 'UserSessionManagementController.setAPIKey');
		}
	},

	/**
	 * @Function getAPIKey()
	 * @returns apiKey securedStorage Data
	 */
	getAPIKey: function () {
		try {
			const data = SecuredStorageService.readSecuredData('apiKey');

			return data && data;
		} catch (error) {
			return errorDebug(error, 'UserSessionManagementController.getAPIKey');
		}
	},

	deleteAllSession: function () {
		try {
			const data = SecuredStorageService.deleteAllSecuredData();
			return data && data;
		} catch (error) {
			return errorDebug(
				error,
				'UserSessionManagementController.deleteAllSession',
			);
		}
	},
};
