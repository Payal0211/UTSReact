import { DealAPI } from 'apis/dealAPI';
import { HTTPStatusCode } from 'constants/network';
import UTSRoutes from 'constants/routes';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { Navigate } from 'react-router-dom';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const DealDAO = {
	getDealListDAO: async function (dealData) {
		try {
			const dealListResult = await DealAPI.getDealListRequest(dealData);
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
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'DealDAO.getDealListDAO');
		}
	},
	getDealDetailRequestDAO: async function (dealData) {
		try {
			const dealDetailResponse = await DealAPI.getDealDetailsRequest(dealData);
			if (dealDetailResponse) {
				const statusCode = dealDetailResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = dealDetailResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return dealDetailResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return dealDetailResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'DealDAO.getDealDetailRequestDAO');
		}
	},
	getAllFilterDataForDealRequestDAO: async function () {
		try {
			const dealFilterResponse = await DealAPI.getAllFilterDataForDealRequest();
			if (dealFilterResponse) {
				const statusCode = dealFilterResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = dealFilterResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return dealFilterResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return dealFilterResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'DealDAO.getAllFilterDataForDealRequestDAO');
		}
	},
};
