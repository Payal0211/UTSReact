import { I2SAPI } from 'apis/i2sApi'
import { HTTPStatusCode } from 'constants/network';
import UTSRoutes from 'constants/routes';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { errorDebug } from 'shared/utils/error_debug_utils';


export const I2SReports = {
	getI2SRepoetList: async function (Data) {
		try {
			const dealListResult = await I2SAPI.getI2SListRequest(Data);
			if (dealListResult) {
				const statusCode = dealListResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = dealListResult?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return dealListResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return dealListResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'I2SReport.getI2SRepoetList');
		}
	}
}