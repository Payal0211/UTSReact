import { ReportAPI } from 'apis/reportAPI';
import { HTTPStatusCode } from 'constants/network';
import UTSRoutes from 'constants/routes';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const ReportDAO = {
	demandFunnelListingRequestDAO: async function (reportData) {
		try {
			const demandFunnelReport = await ReportAPI.demandFunnelListingRequest(
				reportData,
			);
			if (demandFunnelReport) {
				const statusCode = demandFunnelReport['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = demandFunnelReport?.responseBody?.details;
					return {
						statusCode: statusCode,
						responseBody: JSON.parse(tempResult),
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return demandFunnelReport;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return demandFunnelReport;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ReportDAO.demandFunnelListingRequestDAO');
		}
	},
};
