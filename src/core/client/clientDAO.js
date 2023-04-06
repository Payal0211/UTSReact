import { ClientAPI } from 'apis/clientAPI';
import { HTTPStatusCode } from 'constants/network';
import UTSRoutes from 'constants/routes';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { Navigate } from 'react-router-dom';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const ClientDAO = {
	getPOCRequestDAO: async function () {
		try {
			const pocResult = await ClientAPI.getPOCRequest();
			if (pocResult) {
				const statusCode = pocResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = pocResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) return pocResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST) return pocResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ClientDAO.getPOCRequestDAO');
		}
	},
	getDuplicateEmailRequestDAO: async function (email) {
		try {
			const duplicateEmailResponse = await ClientAPI.getDuplicateEmailRequest(
				email,
			);

			if (duplicateEmailResponse) {
				const statusCode = duplicateEmailResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = duplicateEmailResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.DUPLICATE_RECORD) {
					const tempResult = duplicateEmailResponse.responseBody;

					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return duplicateEmailResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ClientDAO.getDuplicateEmailRequestDAO');
		}
	},
	getDuplicateCompanyNameRequestDAO: async function (companyName) {
		try {
			const duplicateCompanyNameRequest =
				await ClientAPI.getDuplicateCompanyNameRequest(companyName);
			if (duplicateCompanyNameRequest) {
				const statusCode = duplicateCompanyNameRequest['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = duplicateCompanyNameRequest.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.DUPLICATE_RECORD) {
					const tempResult = duplicateCompanyNameRequest.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return duplicateCompanyNameRequest;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ClientDAO.getDuplicateCompanyNameRequestDAO');
		}
	},
	createClientDAO: async function (clientData) {
		try {
			const createClientResult = await ClientAPI.createClientRequest(
				clientData,
			);

			if (createClientResult) {
				const statusCode = createClientResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = createClientResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return createClientResult;
				} else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return createClientResult;
				return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'ClientDAO.createClientDAO');
		}
	},
};
