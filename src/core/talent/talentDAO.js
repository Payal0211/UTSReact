import { TalentStatusAPI } from 'apis/talentAPI';
import { HTTPStatusCode } from 'constants/network';
import UTSRoutes from 'constants/routes';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { Navigate } from 'react-router-dom';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const TalentStatusDAO = {
	getStatusDetailRequestDAO: async function (talentDetails) {
		try {
			const talentDetailsResponse =
				await TalentStatusAPI.getStatusDetailRequest(talentDetails);
			if (talentDetailsResponse) {
				const statusCode = talentDetailsResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = talentDetailsResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return talentDetailsResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return talentDetailsResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'TalentStatusDAO.getStatusDetailRequestDAO');
		}
	},
	updateTalentStatusRequestDAO: async function (talentDetails) {
		try {
			const talentDetailsResponse =
				await TalentStatusAPI.updateTalentStatusRequest(talentDetails);
			if (talentDetailsResponse) {
				const statusCode = talentDetailsResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = talentDetailsResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return talentDetailsResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return talentDetailsResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'TalentStatusDAO.updateTalentStatusRequestDAO');
		}
	},
	removeOnHoldStatusRequestDAO: async function (talentDetails) {
		try {
			const talentDetailsResponse =
				await TalentStatusAPI.removeOnHoldStatusRequest(talentDetails);
			if (talentDetailsResponse) {
				const statusCode = talentDetailsResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = talentDetailsResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return talentDetailsResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return talentDetailsResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'TalentStatusDAO.removeOnHoldStatusRequestDAO');
		}
	},
	talentReplacementRequestDAO: async function (talentDetails) {
		try {
			const talentDetailsResponse =
				await TalentStatusAPI.talentReplacementRequest(talentDetails);
			if (talentDetailsResponse) {
				const statusCode = talentDetailsResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = talentDetailsResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return talentDetailsResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return talentDetailsResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'TalentStatusDAO.talentReplacementRequestDAO');
		}
	},
	talentaStatusCreditBaseRequestDAO: async function (hrId,talentID) {
		try {
			const talentStatusCreditBaseResponse =
				await TalentStatusAPI.getStatusDetailCreditBaseRequest(hrId,talentID);
			if (talentStatusCreditBaseResponse) {
				const statusCode = talentStatusCreditBaseResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = talentStatusCreditBaseResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return talentStatusCreditBaseResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return talentStatusCreditBaseResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'TalentStatusDAO.talentaStatusCreditBaseRequestDAO');
		}
	},
	updateTalentaStatusCreditBaseRequestDAO: async function (talentDetails) {
		try {
			const updateTalentStatusCreditBaseResponse =
				await TalentStatusAPI.updateStatusCreditBaseRequest(talentDetails);
			if (updateTalentStatusCreditBaseResponse) {
				const statusCode = updateTalentStatusCreditBaseResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = updateTalentStatusCreditBaseResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return updateTalentStatusCreditBaseResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return updateTalentStatusCreditBaseResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'TalentStatusDAO.updateTalentaStatusCreditBaseRequestDAO');
		}
	},
};
