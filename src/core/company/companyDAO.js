import { ClientAPI } from "apis/clientAPI";
import { CompanyAPI } from "apis/comanyAPI";
import { HTTPStatusCode } from "constants/network";
import UTSRoutes from "constants/routes";
import { UserSessionManagementController } from "modules/user/services/user_session_services";
import { Navigate } from "react-router-dom";
import { errorDebug } from "shared/utils/error_debug_utils";

export const allCompanyRequestDAO  = {
    getCompanyDetailDAO: async (ID, compURL) =>{
        try {            
            const allClientsResult = await CompanyAPI.getCompanyDetailsRequest(ID,compURL);
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
            return errorDebug(error, 'allCompanyRequestDAO.getCompanyDetailDAO');
        }
    },
	uploadImageDAO: async (payload) =>{
        try {            
            const allClientsResult = await CompanyAPI.uploadImageRequest(payload);
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
            return errorDebug(error, 'allCompanyRequestDAO.uploadImageDAO');
        }
    },
	deleteImageDAO: async (payload) =>{
        try {            
            const allClientsResult = await CompanyAPI.deleteCultureImageRequest(payload);
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
            return errorDebug(error, 'allCompanyRequestDAO.deleteImageDAO');
        }
    },
	deleteFundingDAO: async (payload) =>{
        try {            
            const allClientsResult = await CompanyAPI.deleteFundingRequest(payload);
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
            return errorDebug(error, 'allCompanyRequestDAO.deleteFundingDAO');
        }
    },
	deleteYoutubeDetailsDAO: async (payload) =>{
        try {            
            const allClientsResult = await CompanyAPI.deleteYoutubeDetailsRequest(payload);
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
            return errorDebug(error, 'allCompanyRequestDAO.deleteYoutubeDetailsDAO');
        }
    },
	updateCompanyDetailsDAO: async (payload) =>{
        try {            
            const allClientsResult = await CompanyAPI.updateCompanyDetailsRequest(payload);
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
            return errorDebug(error, 'allCompanyRequestDAO.updateCompanyDetailsDAO');
        }
    },
		updateCompanyCategoryDAO: async (payload) =>{
        try {            
            const allClientsResult = await CompanyAPI.updateCompanyCategoryRequest(payload);
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
            return errorDebug(error, 'allCompanyRequestDAO.updateCompanyCategoryDAO');
        }
    },
		updateCompanySubCategoryDAO: async (payload) =>{
        try {            
            const allClientsResult = await CompanyAPI.updateCompanySubCategoryRequest(payload);
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
            return errorDebug(error, 'allCompanyRequestDAO.updateCompanySubCategoryDAO');
        }
    },
		updateCompanyGeoDAO: async (payload) =>{
        try {            
            const allClientsResult = await CompanyAPI.updateCompanyGeoRequest(payload);
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
            return errorDebug(error, 'allCompanyRequestDAO.updateCompanyGeoDAO');
        }
    },
	removeCompanyCategoryDAO: async (payload) =>{
        try {            
            const allClientsResult = await CompanyAPI.removeCompanyCategoryRequest(payload);
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
            return errorDebug(error, 'allCompanyRequestDAO.removeCompanyCategoryDAO');
        }
    },
	addCompanyDiamondCategoryDAO: async (payload) =>{
        try {            
            const allClientsResult = await CompanyAPI.addCompanyCategoryRequest(payload);
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
            return errorDebug(error, 'allCompanyRequestDAO.addCompanyDiamondCategoryDAO');
        }
    },
	validateClientCompanyDAO: async (payload) =>{
        try {            
            const allClientsResult = await CompanyAPI.validateClientCompanyRequest(payload);
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
            return errorDebug(error, 'allCompanyRequestDAO.updateCompanyDetailsDAO');
        }
    },
	getSyncCompanyProfileDAO: async function (companyID) {
		try {
			const syncCompanyProfile = await ClientAPI.getSyncCompanyProfile(companyID)
			if (syncCompanyProfile) {
				const statusCode = syncCompanyProfile['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = syncCompanyProfile.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) return syncCompanyProfile;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST) return syncCompanyProfile;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ClientDAO.getSyncCompanyProfileDAO');
		}
	},
	getHrPreviewDetailsDAO: async function (payload) {
		try {
			const hrPreviewDetails = await  CompanyAPI.gethrPreviewDetails(payload)
			if (hrPreviewDetails) {
				const statusCode = hrPreviewDetails['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = hrPreviewDetails.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) return hrPreviewDetails;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST) return hrPreviewDetails;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ClientDAO.getHrPreviewDetailsDAO');
		}
	},
	createWhatsAppGroupDAO:async function (payload) {
		try {
			const hrPreviewDetails = await  CompanyAPI.createWhatsAppGroup(payload)
			if (hrPreviewDetails) {
				const statusCode = hrPreviewDetails['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = hrPreviewDetails.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) return hrPreviewDetails;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST) return hrPreviewDetails;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ClientDAO.createWhatsAppGroupsDAO');
		}
	},
	updateWhatsAppGroupDAO:async function (payload) {
		try {
			const hrPreviewDetails = await  CompanyAPI.updateWhatsAppGroup(payload)
			if (hrPreviewDetails) {
				const statusCode = hrPreviewDetails['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = hrPreviewDetails.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) return hrPreviewDetails;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST) return hrPreviewDetails;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ClientDAO.updateWhatsAppGroupDAO');
		}
	},
	updateCompanyConfidentialDAO:async function (payload) {
		try {
			const hrPreviewDetails = await  CompanyAPI.updateCompanyConfidential(payload)
			if (hrPreviewDetails) {
				const statusCode = hrPreviewDetails['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = hrPreviewDetails.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) return hrPreviewDetails;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST) return hrPreviewDetails;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ClientDAO.updateCompanyConfidentialDAO');
		}
	},
	updateHrPreviewDetailsDAO: async function (payload) {
		try {
			const hrPreviewDetails = await  CompanyAPI.updateHrPreviewDetails(payload)
			if (hrPreviewDetails) {
				const statusCode = hrPreviewDetails['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = hrPreviewDetails.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) return hrPreviewDetails;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST) return hrPreviewDetails;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ClientDAO.updateHrPreviewDetailsDAO');
		}
	}
}