import { SessionType } from 'constants/application';
import { errorDebug } from 'shared/utils/error_debug_utils';
import { SecuredStorageService } from 'shared/services/secure_storage/secure_storage_service';

export const UserSessionManagementController = {
	/**
	 * @Function setUserSession()
	 * @params {*} userAccount
	 * @returns Write data in Secured Storage
	 */

	setUserSession: async function (userAccount) {
		try {
			await SecuredStorageService.writeSecuredData({
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
	getUserSession: async function () {
		try {
			const data = await SecuredStorageService.readSecuredData(
				'userSessionInfo',
			);
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
	deleteUserSession: async function () {
		try {
			const isUserSessionDeleted =
				await SecuredStorageService.deleteSecuredData('userSessionInfo');
			const deleteUserBearerToken =
				await SecuredStorageService.deleteSecuredData('apiKey');
			const deleteSessionStatus = await SecuredStorageService.deleteSecuredData(
				'sessionStatus',
			);

			return (
				isUserSessionDeleted && deleteUserBearerToken && deleteSessionStatus
			);
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
	setSessionStatus: async function (sessionStatus) {
		try {
			await SecuredStorageService.writeSecuredData({
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
	getSessionStatus: async function () {
		try {
			const data = await SecuredStorageService.readSecuredData('sessionStatus');
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
	setAPIKey: async function (accessKey) {
		try {
			await SecuredStorageService.writeSecuredData({
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
	getAPIKey: async function () {
		try {
			const data = await SecuredStorageService.readSecuredData('apiKey');
			return data && data;
		} catch (error) {
			return errorDebug(error, 'UserSessionManagementController.getAPIKey');
		}
	},
};
