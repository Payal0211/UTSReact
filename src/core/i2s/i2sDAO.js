import { I2SAPI } from 'apis/i2sApi'
import { HTTPStatusCode } from 'constants/network';
import UTSRoutes from 'constants/routes';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { errorDebug } from 'shared/utils/error_debug_utils';


export const I2SReports = {
	getI2SRepoetList: async function (Data) {
		try {
			const i2sListResult = await I2SAPI.getI2SListRequest(Data);
			if (i2sListResult) {
				const statusCode = i2sListResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = i2sListResult?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return i2sListResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return i2sListResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'I2SReport.getI2SRepoetList');
		}
	},
	getI2SpopupReport: async function (Data) {
		try {
			const i2sListResult = await I2SAPI.getI2SpopupRequest(Data);
			if (i2sListResult) {
				const statusCode = i2sListResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = i2sListResult?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return i2sListResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return i2sListResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'I2SReport.getI2SpopupReport');
		}
	}
}