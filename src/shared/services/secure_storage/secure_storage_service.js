import secureLocalStorage from "react-secure-storage";
import { errorDebug } from "shared/utils/error_debug_utils";

export const SecuredStorageService = {
    readSecuredData: async function (key) {
        try {
            const result = await secureLocalStorage.getItem(key)
            return result;
        } catch (error) {
            return errorDebug(error, "SecureStorageService.readSecuredData")
        }
    },
    writeSecuredData: async function (securedData) {
        try {
            await secureLocalStorage.setItem(securedData.key, securedData.value)
        } catch (error) {
            return errorDebug(error, "SecureStorageService.writeSecuredData")
        }
    },
    deleteSecuredData: async function (key) {
        try {
            await secureLocalStorage.removeItem(key)
            return true;
        } catch (error) {
            errorDebug(error, "SecureStorageService.deleteSecuredData")
            return false;
        }
    },
    deleteAllSecuredData: async function () {
        try {
            await secureLocalStorage.clear();
            return true;
        } catch (error) {
            errorDebug(error, "SecureStorageService.deleteAllSecureData")
            return false;
        }
    }
}