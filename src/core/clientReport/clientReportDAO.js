import { clientReportAPI } from 'apis/clientReportAPI'
import { HTTPStatusCode } from 'constants/network';
import UTSRoutes from 'constants/routes';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { errorDebug } from 'shared/utils/error_debug_utils';


export const clientReport = {
	getClientRequestList: async function (Data) {
		try {
			const clientListResult = await clientReportAPI.getClientReportRequest(Data);
			if (clientListResult) {
				const statusCode = clientListResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = clientListResult?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return clientListResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return clientListResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'clientReport.getI2SRepoetList');
		}
	},
	getClienPopUpRequestList: async function (Data) {
		try {
			const clientListResult = await clientReportAPI.getClientPopUPReportRequest(Data);
			if (clientListResult) {
				const statusCode = clientListResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = clientListResult?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return clientListResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return clientListResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'clientReport.getClienPopUpRequestList');
		}
	},
	getClientReportFilters: async function (){
		try {
			const clientFilterResult = await clientReportAPI.getClientReportFiltersRequest()
			if (clientFilterResult) {
				const statusCode = clientFilterResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = clientFilterResult?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return clientFilterResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return clientFilterResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'clientReport.getClientReportFilters');
		}
	}
}