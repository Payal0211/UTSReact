import secureLocalStorage from 'react-secure-storage';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const SecuredStorageService = {
	readSecuredData: function (key) {
		try {
			const result = secureLocalStorage.getItem(key);
			return result;
		} catch (error) {
			return errorDebug(error, 'SecureStorageService.readSecuredData');
		}
	},
	writeSecuredData: function (securedData) {
		try {
			secureLocalStorage.setItem(securedData.key, securedData.value);
		} catch (error) {
			return errorDebug(error, 'SecureStorageService.writeSecuredData');
		}
	},
	deleteSecuredData: function (key) {
		try {
			secureLocalStorage.removeItem(key);
			return true;
		} catch (error) {
			errorDebug(error, 'SecureStorageService.deleteSecuredData');
			return false;
		}
	},
	deleteAllSecuredData: function () {
		try {
			secureLocalStorage.clear();
			return true;
		} catch (error) {
			errorDebug(error, 'SecureStorageService.deleteAllSecureData');
			return false;
		}
	},
};
