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
	},
	getHRReportList: async function (Data) {
		try {
			const HRListResult = await clientReportAPI.getHRReportRequest(Data);
			if (HRListResult) {
				const statusCode = HRListResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = HRListResult?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return HRListResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return HRListResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'clientReport.getHRReportList');
		}
	},
	getHRReportFilters: async function (){
		try {
			const HRFilterResult = await clientReportAPI.getHRReportFiltersRequest()
			if (HRFilterResult) {
				const statusCode = HRFilterResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = HRFilterResult?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return HRFilterResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return HRFilterResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'clientReport.getHRReportFilters');
		}
	},
	getHRPopUpRequestList: async function (Data) {
		try {
			const HRListResult = await clientReportAPI.getHRPopUPReportRequest(Data);
			if (HRListResult) {
				const statusCode = HRListResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = HRListResult?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return HRListResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return HRListResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'clientReport.getHRPopUpRequestList');
		}
	},
}