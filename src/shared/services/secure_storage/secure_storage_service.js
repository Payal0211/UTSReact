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
			if(securedData?.value){
				const sessionStartTime = new Date().getTime();
				localStorage.setItem('sessionStartTime', sessionStartTime.toString());
			}			
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
			var cookies = document.cookie.split(";");
			for (var i = 0; i < cookies.length; i++) {
				var cookie = cookies[i];
				var eqPos = cookie.indexOf("=");
				var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
				document.cookie = name + '=;' +
					'expires=Thu, 01-Jan-1970 00:00:01 GMT;' +
					'path=' + '/;' +
					'domain=' + window.location.host + ';' +
					'secure=;';
			}
			return true;
		} catch (error) {
			errorDebug(error, 'SecureStorageService.deleteAllSecureData');
			return false;
		}
	},
};
