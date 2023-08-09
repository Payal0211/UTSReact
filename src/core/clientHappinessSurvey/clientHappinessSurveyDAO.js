import { ClientHappinessSurveyRequestAPI } from 'apis/clientSurveyAPI';
import { EngagementRequestAPI } from 'apis/engagementAPI';
import { HTTPStatusCode } from 'constants/network';
import UTSRoutes from 'constants/routes';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { Navigate } from 'react-router-dom';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const clientHappinessSurveyRequestDAO = {
	getClientHappinessSurveyListDAO: async function (data) {
		try {
			const clientHappinessSurveyListResult = await ClientHappinessSurveyRequestAPI.getClientSurveyList(
				data,
			);
			if (clientHappinessSurveyListResult) {
				const statusCode = clientHappinessSurveyListResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = clientHappinessSurveyListResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return clientHappinessSurveyListResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return clientHappinessSurveyListResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					UserSessionManagementController.deleteAllSession();
					return (
						<Navigate
							replace
							to={UTSRoutes.LOGINROUTE}
						/>
					);
				}
			}
		} catch (error) {
			return errorDebug(error, 'clientHappinessSurveyRequestDAO.getClientHappinessSurveyListDAO');
		}
	},
};
