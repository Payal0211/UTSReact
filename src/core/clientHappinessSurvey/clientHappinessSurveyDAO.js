import { ClientHappinessSurveyRequestAPI } from 'apis/clientSurveyAPI';
import { EngagementRequestAPI } from 'apis/engagementAPI';
import { HTTPStatusCode } from 'constants/network';
import UTSRoutes from 'constants/routes';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { Navigate } from 'react-router-dom';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const clientHappinessSurveyRequestDAO = {
	getClientHappinessSurveyListDAO: async function (data,isExport) {
		try {
			const clientHappinessSurveyListResult = await ClientHappinessSurveyRequestAPI.getClientSurveyList(
				data,isExport
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
					// UserSessionManagementController.deleteAllSession();
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'clientHappinessSurveyRequestDAO.getClientHappinessSurveyListDAO');
		}
	},

	getAutoCompleteCompanyDAO:async function (data){
		try {
			const getAutoCompleteCompanyResult = await ClientHappinessSurveyRequestAPI.getAutoCompleteCompany(
				data,
			);
			if (getAutoCompleteCompanyResult) {
				const statusCode = getAutoCompleteCompanyResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = getAutoCompleteCompanyResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return getAutoCompleteCompanyResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return getAutoCompleteCompanyResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					// UserSessionManagementController.deleteAllSession();
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'clientHappinessSurveyRequestDAO.getAutoCompleteCompanyDAO');
		}
	},

	SendEmailForFeedbackDAO:async function (data) {
		try {
			const sendEmailForFeedbackResult = await ClientHappinessSurveyRequestAPI.sendEmailForFeedback(
				data,
			);
			if(sendEmailForFeedbackResult){
				const statusCode = sendEmailForFeedbackResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = sendEmailForFeedbackResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return sendEmailForFeedbackResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return sendEmailForFeedbackResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					// UserSessionManagementController.deleteAllSession();
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'clientHappinessSurveyRequestDAO.SendEmailForFeedbackDAO');
		}
	},

	SaveClientHappinessSurveysDAO:async function (data) {
		try {
			const saveClientHappinessSurveysResult = await ClientHappinessSurveyRequestAPI.saveClientHappinessSurveys(
				data
			);				
			if(saveClientHappinessSurveysResult){
				const statusCode = saveClientHappinessSurveysResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = saveClientHappinessSurveysResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return saveClientHappinessSurveysResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return saveClientHappinessSurveysResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					// UserSessionManagementController.deleteAllSession();
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'clientHappinessSurveyRequestDAO.SaveClientHappinessSurveysDAO');
		}
	},

	ClientHappinessSurveysOptionDAO:async function () {
		try {
			const saveClientHappinessSurveysOptionResult = await ClientHappinessSurveyRequestAPI.ClientHappinessSurveysOption();
			if (saveClientHappinessSurveysOptionResult) {
				const statusCode = saveClientHappinessSurveysOptionResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = saveClientHappinessSurveysOptionResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return saveClientHappinessSurveysOptionResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return saveClientHappinessSurveysOptionResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					// UserSessionManagementController.deleteAllSession();
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}

		} catch (error) {
			return errorDebug(error, 'clientHappinessSurveyRequestDAO.ClientHappinessSurveysOptionDAO');
		}
	}
};
