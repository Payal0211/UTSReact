import { ClientAPI } from "apis/clientAPI";
import { HTTPStatusCode } from "constants/network";
import UTSRoutes from "constants/routes";
import { UserSessionManagementController } from "modules/user/services/user_session_services";
import { Navigate } from "react-router-dom";
import { errorDebug } from "shared/utils/error_debug_utils";

export const allClientRequestDAO  = {

    getAllClientsListDAO : async function (reqData) {
        try {            
            const allClientsResult = await ClientAPI.getAllClients(reqData);
            if (allClientsResult) {
				const statusCode = allClientsResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = allClientsResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return allClientsResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return allClientsResult;
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
            return errorDebug(error, 'allClientRequestDAO.getAllClientsListDAO');
        }
    },
	getClientFilterDAO : async function (){
		try {
			const allClientFilterResult = await ClientAPI.getClientFilterList();
			if (allClientFilterResult) {
				const statusCode = allClientFilterResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = allClientFilterResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return allClientFilterResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return allClientFilterResult;
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
			return errorDebug(error,'allClientRequestDAO.getClientFilterDAO');
		}
	},
	getClientDetailsForViewDAO : async function (CompanyID,ClientID){
		try {
			const viewClientDetailsResult = await ClientAPI.getViewclientDetailsRequest(CompanyID,ClientID);
			if (viewClientDetailsResult) {
				const statusCode = viewClientDetailsResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = viewClientDetailsResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return viewClientDetailsResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return viewClientDetailsResult;
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
			return errorDebug(error,'allClientRequestDAO.getClientDetailsForViewDAO');
		}
	},
	getDraftJobDetailsDAO : async function (guid,clientID) {
		try {
			const draftJobDetails = await ClientAPI.getJobDetails(guid,clientID);
			if(draftJobDetails){
				const statusCode = draftJobDetails['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = draftJobDetails.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return draftJobDetails;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return draftJobDetails;
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
			return errorDebug(error,'allClientRequestDAO.getDraftJobDetailsDAO');
		}
	}

}