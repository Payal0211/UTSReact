import { clientPortalTrackingReportAPI } from 'apis/clientPortalTrackingReportAPI';
import { SessionType } from 'constants/application';
import { HTTPStatusCode } from 'constants/network';
import UTSRoutes from 'constants/routes';
import UserAccountModel from 'models/userAccountModels';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const clientPortalTrackingReportDAO = {
	clientPortalTrackingReportFilterDAO: async function () {
		try {
			const clientPortalTrackingReport = await clientPortalTrackingReportAPI.clientPortalTrackingReportFilter();
			if (clientPortalTrackingReport) {
				const statusCode = clientPortalTrackingReport['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = clientPortalTrackingReport?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return clientPortalTrackingReport;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return clientPortalTrackingReport;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'clientPortalTrackingReportDAO.clientPortalTrackingReportFilterDAO');
		}
	},
	emailSubjectFilterDAO: async function () {
		try {
			const clientPortalTrackingReport = await clientPortalTrackingReportAPI.emailSubjectFilterFilter();
			if (clientPortalTrackingReport) {
				const statusCode = clientPortalTrackingReport['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = clientPortalTrackingReport?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return clientPortalTrackingReport;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return clientPortalTrackingReport;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'clientPortalTrackingReportDAO.emailSubjectFilterDAO');
		}
	},
	clientPortalTrackingReportListDAO: async function (data) {
		try {
			const clientPortalTrackingReport = await clientPortalTrackingReportAPI.clientPortalTrackingReportList(data);
			if (clientPortalTrackingReport) {
				const statusCode = clientPortalTrackingReport['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = clientPortalTrackingReport?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return clientPortalTrackingReport;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return clientPortalTrackingReport;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'clientPortalTrackingReportDAO.clientPortalTrackingReportListDAO');
		}
	},
	clientPortalTrackingReportPopupListDAO: async function (data) {
		try {
			const clientPortalTrackingReport = await clientPortalTrackingReportAPI.clientPortalTrackingReportPopupList(data);
			if (clientPortalTrackingReport) {
				const statusCode = clientPortalTrackingReport['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = clientPortalTrackingReport?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return clientPortalTrackingReport;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return clientPortalTrackingReport;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'clientPortalTrackingReportDAO.clientPortalTrackingReportPopupListDAO');
		}
	},
};
