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
	getResetAllDemoHRTalentStatusDAO : async function (){
		try {
			const viewClientDetailsResult = await ClientAPI.getResetAllDemoHRTalentStatus();
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
			return errorDebug(error,'allClientRequestDAO.getResetAllDemoHRTalentStatusDAO');
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
	},
	userDetailsDAO : async function(reqData){
		try {            
            const allClientsResult = await ClientAPI.userDetailsRequest(reqData);
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
            return errorDebug(error, 'allClientRequestDAO.userDetailsDAO');
        }
	},
	trackingLeadClientSourceDAO : async function(reqData){
		try {            
            const trackingLeadResult = await ClientAPI.trackingLeadClientSourceDetails(reqData);
            if (trackingLeadResult) {
				const statusCode = trackingLeadResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = trackingLeadResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return trackingLeadResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return trackingLeadResult;
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
            return errorDebug(error, 'allClientRequestDAO.userDetailsDAO');
        }
	},
	getActiveSalesUserListDAO: async function () {
		try {
			const activeSalesUserList = await ClientAPI.getActiveSalesUserList()
			if (activeSalesUserList) {
				const statusCode = activeSalesUserList['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = activeSalesUserList.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) return activeSalesUserList;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST) return activeSalesUserList;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ClientDAO.getActiveSalesUserListDAO');
		}
	},

	createGspaceDAO: async function (clientName,usersEmails,clientEmail) {
		try {
			const createGspace = await ClientAPI.createGspace(clientName,usersEmails,clientEmail)
			if (createGspace) {
				const statusCode = createGspace['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = createGspace.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) return createGspace;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST) return createGspace;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ClientDAO.createGspaceDAO');
		}
	},

	getSalesUserWithHeadDAO: async function (emailID) {
		try {
			const salesUserWithHead = await ClientAPI.getSalesUserWithHead(emailID)
			if (salesUserWithHead) {
				const statusCode = salesUserWithHead['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = salesUserWithHead.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) return salesUserWithHead;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST) return salesUserWithHead;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ClientDAO.createGspaceDAO');
		}
	},

	updateSpaceIDForClientDAO: async function (redData) {
		try {
			const updateSpaceIDForClientData = await ClientAPI.updateSpaceIDForClient(redData)
			if (updateSpaceIDForClientData) {
				const statusCode = updateSpaceIDForClientData['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = updateSpaceIDForClientData.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) return updateSpaceIDForClientData;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST) return updateSpaceIDForClientData;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ClientDAO.updateSpaceIDForClientDAO');
		}
	},

	getSpaceIdForClientEmailDAO: async function (emailID) {
		try {
			const spaceIdForClientEmail = await ClientAPI.getSpaceIdForClientEmail(emailID)
			if (spaceIdForClientEmail) {
				const statusCode = spaceIdForClientEmail['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = spaceIdForClientEmail.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) return spaceIdForClientEmail;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST) return spaceIdForClientEmail;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ClientDAO.getSpaceIdForClientEmailDAO');
		}
	},

	getCreditUtilizationListDAO: async function (emailID) {
		try {
			const spaceIdForClientEmail = await ClientAPI.getCreditUtilizationList(emailID)
			if (spaceIdForClientEmail) {
				const statusCode = spaceIdForClientEmail['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = spaceIdForClientEmail.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) return spaceIdForClientEmail;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST) return spaceIdForClientEmail;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ClientDAO.getCreditUtilizationListDAO');
		}
	}
}