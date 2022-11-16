import { errorDebug } from 'shared/utils/error_debug_utils';

export const SecuredStorageService = {
	readSecuredData: function (key) {
		try {
			const result = localStorage.getItem(key);
			return result && JSON.parse(result);
		} catch (error) {
			return errorDebug(error, 'SecureStorageService.readSecuredData');
		}
	},
	writeSecuredData: function (securedData) {
		try {
			localStorage.setItem(securedData.key, JSON.stringify(securedData.value));
		} catch (error) {
			return errorDebug(error, 'SecureStorageService.writeSecuredData');
		}
	},
	deleteSecuredData: function (key) {
		try {
			localStorage.removeItem(key);
			return true;
		} catch (error) {
			errorDebug(error, 'SecureStorageService.deleteSecuredData');
			return false;
		}
	},
	deleteAllSecuredData: function () {
		try {
			localStorage.clear();
			return true;
		} catch (error) {
			errorDebug(error, 'SecureStorageService.deleteAllSecureData');
			return false;
		}
	},
};
