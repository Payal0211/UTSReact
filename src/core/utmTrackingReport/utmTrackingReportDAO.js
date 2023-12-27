import { utmTrackingReportAPI } from 'apis/utmTrackingReportAPI';
import { SessionType } from 'constants/application';
import { HTTPStatusCode } from 'constants/network';
import UTSRoutes from 'constants/routes';
import UserAccountModel from 'models/userAccountModels';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const utmTrackingReportDAO = {
	getutmTrackingReportDAO: async function (data) {
		try {
			const utmTrackingReport = await utmTrackingReportAPI.utmTrackingReportList(data);
			if (utmTrackingReport) {
				const statusCode = utmTrackingReport['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = utmTrackingReport?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return utmTrackingReport;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return utmTrackingReport;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'utmTrackingReportDAO.getutmTrackingReportDAO');
		}
	},
	getutmTrackingReportFiltersDAO: async function () {
		try {
			const utmTrackingReportFilters = await utmTrackingReportAPI.utmTrackingReportFilters();
			if (utmTrackingReportFilters) {
				const statusCode = utmTrackingReportFilters['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = utmTrackingReportFilters?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return utmTrackingReportFilters;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return utmTrackingReportFilters;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'utmTrackingReportDAO.getutmTrackingReportFiltersDAO');
		}
	}
};
