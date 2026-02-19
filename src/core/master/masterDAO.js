import { MasterAPI } from 'apis/masterAPI';
import { userAPI } from 'apis/userAPI';
import { HTTPStatusCode } from 'constants/network';
import UTSRoutes from 'constants/routes';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const MasterDAO = {
	getFixedValueRequestDAO: async function () {
		try {
			const fixedValueResult = await MasterAPI.getFixedValueRequest();
			if (fixedValueResult) {
				const statusCode = fixedValueResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = fixedValueResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return fixedValueResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return fixedValueResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'masterDAO.getFixedValueRequestDAO');
		}
	},
	getJobTypesRequestDAO: async function () {
		try {
			const fixedValueResult = await MasterAPI.getJobTypesRequest();
			if (fixedValueResult) {
				const statusCode = fixedValueResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = fixedValueResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return fixedValueResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return fixedValueResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'masterDAO.getJobTypesRequestDAO');
		}
	},
	getEngTypesRequestDAO: async function (ID,compId) {
		try {
			const fixedValueResult = await MasterAPI.getEngTypesRequest(ID,compId);
			if (fixedValueResult) {
				const statusCode = fixedValueResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = fixedValueResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return fixedValueResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return fixedValueResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'masterDAO.getEngTypesRequestDAO');
		}
	},
	getPayRollTypeDAO: async function () {
		try {
			const fixedValueResult = await MasterAPI.getPayRollTypeRequest();
			if (fixedValueResult) {
				const statusCode = fixedValueResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = fixedValueResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return fixedValueResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return fixedValueResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'masterDAO.getPayRollTypeDAO');
		}
	},
	getHRPricingTypeDAO: async function () {
		try {
			const fixedValueResult = await MasterAPI.getHRPricingTypeRequest();
			if (fixedValueResult) {
				const statusCode = fixedValueResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = fixedValueResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return fixedValueResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return fixedValueResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'masterDAO.getHRPricingTypeDAO');
		}
	},
	getGEORequestDAO: async function () {
		try {
			const geoResult = await MasterAPI.getGEORequest();
			if (geoResult) {
				const statusCode = geoResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = geoResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) return geoResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST) return geoResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'masterDAO.getGEORequestDAO');
		}
	},
	getUsersHierarchyRequestDAO: async function (usersDetails) {
		try {
			const hierarchyResponse = await MasterAPI.getUsersHierarchyRequest(
				usersDetails,
			);
			if (hierarchyResponse) {
				const statusCode = hierarchyResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = hierarchyResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return hierarchyResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return hierarchyResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'masterDAO.getUsersHierarchyRequestDAO');
		}
	},
	getSkillsRequestDAO: async function () {
		try {
			const skillsResult = await MasterAPI.getSkillsRequest();
			if (skillsResult) {
				const statusCode = skillsResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = skillsResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) return skillsResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST) return skillsResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getSkillsRequestDAO');
		}
	},
	getHRSkillsRequestDAO: async function (HRID) {
		try {
			const skillsResult = await MasterAPI.getHRSkillsRequest(HRID);
			if (skillsResult) {
				const statusCode = skillsResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = skillsResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) return skillsResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST) return skillsResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getHRSkillsRequestDAO');
		}
	},
	getCurrencyRequestDAO: async function () {
		try {
			const currencyResult = await MasterAPI.getCurrencyRequest();
			if (currencyResult) {
				const statusCode = currencyResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = currencyResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return currencyResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return currencyResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getCurrencyRequestDAO');
		}
	},
	getContractDurationRequestDAO: async function () {
		try {
			const contractResult = await MasterAPI.getContractDurationRequest();
			if (contractResult) {
				const statusCode = contractResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = contractResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return contractResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return contractResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getContractDurationRequestDAO');
		}
	},
	getGetBudgetInformationDAO: async function () {
		try {
			const budgetResult = await MasterAPI.getGetBudgetInformationRequest();
			if (budgetResult) {
				const statusCode = budgetResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = budgetResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return budgetResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return budgetResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getGetBudgetInformationDAO');
		}
	},
	getStartEndTimeDAO: async function () {
		try {
			const startEndTime = await MasterAPI.getStartEndTimeRequest();
			if (startEndTime) {
				const statusCode = startEndTime['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = startEndTime.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return startEndTime;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return startEndTime;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getGetBudgetInformationDAO');
		}
	},
	getTalentTimeZoneRequestDAO: async function () {
		try {
			const talentTimeZoneResult = await MasterAPI.getTalentTimeZoneRequest();
			if (talentTimeZoneResult) {
				const statusCode = talentTimeZoneResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = talentTimeZoneResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return talentTimeZoneResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return talentTimeZoneResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getTalentTimeZoneRequestDAO');
		}
	},
	getTimeZoneRequestDAO: async function () {
		try {
			const timeZoneRequest = await MasterAPI.getTimeZoneRequest();
			if (timeZoneRequest) {
				const statusCode = timeZoneRequest['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = timeZoneRequest.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return timeZoneRequest;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return timeZoneRequest;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getTimeZoneRequestDAO');
		}
	},
	getMasterDirectHRRequestDAO: async function () {
		try {
			const directHRresult = await MasterAPI.getMasterDirectHRRequest();
			if (directHRresult) {
				const statusCode = directHRresult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = directHRresult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return directHRresult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return directHRresult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getMasterDirectHRRequestDAO');
		}
	},
	getMasterDirectHRDetailsRequestDAO: async function (hrID) {
		try {
			const directHRresult = await MasterAPI.getMasterDirectHRDetailsRequest(hrID);
			if (directHRresult) {
				const statusCode = directHRresult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = directHRresult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return directHRresult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return directHRresult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getMasterDirectHRDetailsRequestDAO');
		}
	},
	getHowSoonRequestDAO: async function () {
		try {
			const howSoonResult = await MasterAPI.getHowSoonRequest();
			if (howSoonResult) {
				const statusCode = howSoonResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = howSoonResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return howSoonResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return howSoonResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getHowSoonRequestDAO');
		}
	},
	getTimeZonePreferenceRequestDAO: async function (timeZoneID) {
		try {
			const timeZonePreferenceResult =
				await MasterAPI.getTimeZonePreferenceRequest(timeZoneID);
			if (timeZonePreferenceResult) {
				const statusCode = timeZonePreferenceResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = timeZonePreferenceResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return timeZonePreferenceResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return timeZonePreferenceResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getTimeZonePreferenceRequestDAO');
		}
	},
	getPartialEngagementTypeRequestDAO: async function () {
		try {
			const partialEngagementTypeResult =
				await MasterAPI.getPartialEngagementTypeRequest();
			if (partialEngagementTypeResult) {
				const statusCode = partialEngagementTypeResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = partialEngagementTypeResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return partialEngagementTypeResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return partialEngagementTypeResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getPartialEngagementTypeRequestDAO');
		}
	},
	getTalentsRoleRequestDAO: async function () {
		try {
			const talentRoleResult = await MasterAPI.getTalentsRoleRequest();
			if (talentRoleResult) {
				const statusCode = talentRoleResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = talentRoleResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return talentRoleResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return talentRoleResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getTalentsRoleRequestDAO');
		}
	},
	getCodeAndFlagRequestDAO: async function () {
		try {
			const codeAndFlagResponse = await MasterAPI.getCodeAndFlagRequest();
			if (codeAndFlagResponse) {
				const statusCode = codeAndFlagResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = codeAndFlagResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return codeAndFlagResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return codeAndFlagResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getCodeAndFlagRequestDAO');
		}
	},
	uploadFileRequestDAO: async function (fileData) {
		try {
			const uploadFileResult = await MasterAPI.uploadFileRequest(fileData);
			if (uploadFileResult) {
				const statusCode = uploadFileResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = uploadFileResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return uploadFileResult;
				} else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return uploadFileResult;
				// return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.uploadFileRequestDAO');
		}
	},
	getSalesManRequestDAO: async function () {
		try {
			const salesManResult = await MasterAPI.getSalesManRequest();
			if (salesManResult) {
				const statusCode = salesManResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = salesManResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return salesManResult;
				} else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return salesManResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				// return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getSalesManRequestDAO');
		}
	},
	getHRDeletReasonRequestDAO: async function () {
		try {
			const hrDeleteResponse = await MasterAPI.getHRDeleteReasonRequest();
			if (hrDeleteResponse) {
				const statusCode = hrDeleteResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = hrDeleteResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return hrDeleteResponse;
				} else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return hrDeleteResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				// return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getHRDeletReasonRequestDAO');
		}
	},
	getRegionsRequestDAO: async function () {
		try {
			const hrRegionsResponse = await MasterAPI.getRegionsRequest();
			if (hrRegionsResponse) {
				const statusCode = hrRegionsResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = hrRegionsResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return hrRegionsResponse;
				} else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return hrRegionsResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				// return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getRegionsRequestDAO');
		}
	},
	getModeOfWorkDAO: async function () {
		try {
			const hrWorkingModeResponse = await MasterAPI.getModeOfWorkRequest();
			if (hrWorkingModeResponse) {
				const statusCode = hrWorkingModeResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = hrWorkingModeResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return hrWorkingModeResponse;
				} else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return hrWorkingModeResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				// return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getModeOfWorkDAO');
		}
	},
	getCountryDAO: async function () {
		try {
			const hrCountryResponse = await MasterAPI.getCountryRequest();
			if (hrCountryResponse) {
				const statusCode = hrCountryResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = hrCountryResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return hrCountryResponse;
				} else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return hrCountryResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				// return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getCountryDAO');
		}
	},
	getCountryListRequestDAO: async function (countryDetails) {
		try {
			const countryListResponse = await MasterAPI.getCountryListRequest(
				countryDetails,
			);
			if (countryListResponse) {
				const statusCode = countryListResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = countryListResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return countryListResponse;
				} else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return countryListResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				// return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getCountryListRequestDAO');
		}
	},
	checkCountryRegionRequestDAO: async function (countryDetails) {
		try {
			const duplicateCountryResponse =
				await MasterAPI.checkCountryRegionRequest(countryDetails);
			if (duplicateCountryResponse) {
				const statusCode = duplicateCountryResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = duplicateCountryResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return duplicateCountryResponse;
				} else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return duplicateCountryResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				// return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.checkCountryRegionRequestDAO');
		}
	},
	checkCountryNameRequestDAO: async function (countryDetails) {
		try {
			const duplicateCountryResponse = await MasterAPI.checkCountryNameRequest(
				countryDetails,
			);
			if (duplicateCountryResponse) {
				const statusCode = duplicateCountryResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = duplicateCountryResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return duplicateCountryResponse;
				} else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return duplicateCountryResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				// return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.checkCountryNameRequestDAO');
		}
	},
	addCountryRequestDAO: async function (countryDetails) {
		try {
			const addCountryResponse = await MasterAPI.addCountryRequest(
				countryDetails,
			);
			if (addCountryResponse) {
				const statusCode = addCountryResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = addCountryResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return addCountryResponse;
				} else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return addCountryResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				// return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.addCountryRequestDAO');
		}
	},
	getCountryByPostalCodeRequestDAO: async function (postalData) {
		try {
			const hrCountryResponse = await MasterAPI.getCountryByPostalCodeRequest(
				postalData,
			);
			if (hrCountryResponse) {
				const statusCode = hrCountryResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = hrCountryResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return hrCountryResponse;
				} else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return hrCountryResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getCountryByPostalCodeRequestDAO');
		}
	},
	getCountryByCityRequestDAO: async function (city) {
		try {
			const hrCountryResponse = await MasterAPI.getCountryByCityRequest(
				city,
			);
			if (hrCountryResponse) {
				const statusCode = hrCountryResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = hrCountryResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return hrCountryResponse;
				} else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return hrCountryResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getCountryByCityRequestDAO');
		}
	},
	getUserTypeRequestDAO: async function () {
		try {
			const userTypeResponse = await MasterAPI.getUserTypeRequest();
			if (userTypeResponse) {
				const statusCode = userTypeResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = userTypeResponse.responseBody;

					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return userTypeResponse;
				} else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return userTypeResponse;

				// return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getUserTypeRequestDAO');
		}
	},
	getTeamManagerRequestDAO: async function () {
		try {
			const teamManagerResponse = await MasterAPI.getTeamManagerRequest();
			if (teamManagerResponse) {
				const statusCode = teamManagerResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = teamManagerResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return teamManagerResponse;
				} else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return teamManagerResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				// return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getTeamManagerRequestDAO');
		}
	},
	getUserByTypeRequestDAO: async function (userType) {
		try {
			const userByTypeResponse = await MasterAPI.getUserByTypeRequest(userType);
			if (userByTypeResponse) {
				const statusCode = userByTypeResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = userByTypeResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return userByTypeResponse;
				} else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return userByTypeResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				// return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getUserByTypeRequestDAO');
		}
	},
	getReporteeTeamManagerRequestDAO: async function (userType) {
		try {
			const reporteeTeamManagerResponse =
				await MasterAPI.getReporteeTeamManagerRequest(userType);
			if (reporteeTeamManagerResponse) {
				const statusCode = reporteeTeamManagerResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = reporteeTeamManagerResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return reporteeTeamManagerResponse;
				} else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return reporteeTeamManagerResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				// return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getReporteeTeamManagerRequestDAO');
		}
	},
	getBDRMarketingBasedOnUserTypeRequestDAO: async function (userType) {
		try {
			const reporteeTeamManagerResponse =
				await MasterAPI.getBDRMarketingBasedOnUserTypeRequest(userType);
			if (reporteeTeamManagerResponse) {
				const statusCode = reporteeTeamManagerResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = reporteeTeamManagerResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return reporteeTeamManagerResponse;
				} else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return reporteeTeamManagerResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				// return statusCode;
			}
		} catch (error) {
			return errorDebug(
				error,
				'MasterDAO.getBDRMarketingBasedOnUserTypeRequestDAO',
			);
		}
	},
	getTeamManagerBasedOnUserTypeRequestDAO: async function (userType) {
		try {
			const reporteeTeamManagerResponse =
				await MasterAPI.getTeamManagerBasedOnUserTypeRequest(userType);
			if (reporteeTeamManagerResponse) {
				const statusCode = reporteeTeamManagerResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = reporteeTeamManagerResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return reporteeTeamManagerResponse;
				} else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return reporteeTeamManagerResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				// return statusCode;
			}
		} catch (error) {
			return errorDebug(
				error,
				'MasterDAO.getTeamManagerBasedOnUserTypeRequestDAO',
			);
		}
	},
	getEmailSuggestionDAO: async function (email,companyId) {
		try {
			const emailSuggestionResponse = await MasterAPI.getEmailSuggestionRequest(
				email,companyId
			);
			if (emailSuggestionResponse) {
				const statusCode = emailSuggestionResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = emailSuggestionResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return emailSuggestionResponse;
				} else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return emailSuggestionResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				// return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getEmailSuggestionDAO');
		}
	},
	getCompanySuggestionDAO: async function (companyName) {
		try {
			const emailSuggestionResponse = await MasterAPI.getCompanySuggestionRequest(
				companyName
			);
			if (emailSuggestionResponse) {
				const statusCode = emailSuggestionResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = emailSuggestionResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return emailSuggestionResponse;
				} else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return emailSuggestionResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				// return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getCompanySuggestionDAO');
		}
	},
	deletePOCUserDAO: async function (pocID,hrId) {
		try {
			const emailSuggestionResponse = await MasterAPI.deletePOCUserRequest(
				pocID,hrId
			);
			if (emailSuggestionResponse) {
				const statusCode = emailSuggestionResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = emailSuggestionResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return emailSuggestionResponse;
				} else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return emailSuggestionResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				// return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.deletePOCUserDAO');
		}
	},
	updatePocContactDAO: async function (payload) {
		try {
			const emailSuggestionResponse = await MasterAPI.updatePocContactRequest(
				payload
			);
			if (emailSuggestionResponse) {
				const statusCode = emailSuggestionResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = emailSuggestionResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return emailSuggestionResponse;
				} else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return emailSuggestionResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				// return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.updatePocContactDAO');
		}
	},
	getNRMarginRequestDAO: async function (email) {
		try {
			const nrMarginResponse = await MasterAPI.getNRMarginRequest();
			if (nrMarginResponse) {
				const statusCode = nrMarginResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = nrMarginResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return nrMarginResponse;
				} else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return nrMarginResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				// return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getNRMarginRequestDAO');
		}
	},
	getOtherSkillsRequestDAO: async function (skillsData) {
		try {
			const otherSkillsResponse = await MasterAPI.getOtherSkillsRequest(
				skillsData,
			);
			if (otherSkillsResponse) {
				const statusCode = otherSkillsResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = otherSkillsResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return otherSkillsResponse;
				} else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return otherSkillsResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				// return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getOtherSkillsRequestDAO');
		}
	},
	getOtherRoleRequestDAO: async function (roleData) {
		try {
			const otherRoleResponse = await MasterAPI.getOtherRoleRequest(roleData);
			if (otherRoleResponse) {
				const statusCode = otherRoleResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = otherRoleResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return otherRoleResponse;
				} else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return otherRoleResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				// return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getOtherRoleRequestDAO');
		}
	},
	getContractTypeRequestDAO: async function () {
		try {
			const contractTypeResponse = await MasterAPI.getContractTypeRequest();
			if (contractTypeResponse) {
				const statusCode = contractTypeResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = contractTypeResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return contractTypeResponse;
				} else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return contractTypeResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				// return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getContractTypeRequestDAO');
		}
	},
	getNetPaymentDaysRequestDAO: async function () {
		try {
			const netPaymentDaysResponse = await MasterAPI.getNetPaymentDaysRequest();
			if (netPaymentDaysResponse) {
				const statusCode = netPaymentDaysResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = netPaymentDaysResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return netPaymentDaysResponse;
				} else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return netPaymentDaysResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				// return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getNetPaymentDaysRequestDAO');
		}
	},
	getYesNoOptionRequestDAO: async function () {
		try {
			const yesNoOptionResponse = await MasterAPI.getYesNoOptionRequest();
			if (yesNoOptionResponse) {
				const statusCode = yesNoOptionResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = yesNoOptionResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return yesNoOptionResponse;
				} else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return yesNoOptionResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				// return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getYesNoOptionRequestDAO');
		}
	},
	getBuddyRequestDAO: async function () {
		try {
			const buddyResponse = await MasterAPI.getBuddyRequest();
			if (buddyResponse) {
				const statusCode = buddyResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = buddyResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) {
					return buddyResponse;
				} else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return buddyResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
				// return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getBuddyRequestDAO');
		}
	},
	getDepartmentRequestDAO: async function () {
		try {
			const departmentListResult = await userAPI.getDeparmentListRequest();
			if (departmentListResult) {
				const statusCode = departmentListResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = departmentListResult?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return departmentListResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return departmentListResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getDepartmentRequestDAO');
		}
	},
	getTeamListRequestDAO: async function (departmentID) {
		try {
			const teamListResult = await userAPI.getTeamListRequest(departmentID);
			if (teamListResult) {
				const statusCode = teamListResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = teamListResult?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return teamListResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return teamListResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getTeamListRequestDAO');
		}
	},
	getLevelListRequestDAO: async function () {
		try {
			const levelList = await userAPI.getLevelListRequest();
			if (levelList) {
				const statusCode = levelList['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = levelList?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) return levelList;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST) return levelList;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getLevelListRequestDAO');
		}
	},
	getReportingListRequestDAO: async function (deptId, levelId) {
		try {
			const levelList = await userAPI.getReportingListRequest(deptId, levelId);
			if (levelList) {
				const statusCode = levelList['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = levelList?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) return levelList;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST) return levelList;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getReportingListRequestDAO');
		}
	},
	getDashboardCountForEngagementDAO: async function () {
		try {
			const levelList = await MasterAPI.getDashboardCountRequest();
			if (levelList) {
				const statusCode = levelList['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = levelList?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) return levelList;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST) return levelList;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getDashboardCountForEngagementDAO');
		}
	},
	checkIsSalesPersonDAO: async function (getContactAndSaleID) {
		try {
			const isCheckSales = await MasterAPI.checkIsSalesPerson(
				getContactAndSaleID,
			);
			if (isCheckSales) {
				const statusCode = isCheckSales['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = isCheckSales?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) return isCheckSales;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST) return isCheckSales;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getDashboardCountForEngagementDAO');
		}
	},
	getDurationTypeDAO: async function (data) {
		try {
			const durationTypeResponse = await MasterAPI.getDurationType(data);
			if (durationTypeResponse) {
				const statusCode = durationTypeResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = durationTypeResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return durationTypeResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return durationTypeResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getDurationTypeDAO');
		}
	},
	getLeadTypeDAO: async function (LeadType,hrid) {
		try {
			const leadTypeResponse = await MasterAPI.geLeadType(LeadType,hrid);
			if (leadTypeResponse) {
				const statusCode = leadTypeResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = leadTypeResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return leadTypeResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return leadTypeResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getLeadTypeDAO');
		}
	},
	getCloneHRDAO: async function (data) {
		try {
			const cloneResponse = await MasterAPI.cloneHRRequest(data);
			if (cloneResponse) {
				const statusCode = cloneResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = cloneResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return cloneResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return cloneResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getDashboardCountForEngagementDAO');
		}
	},
	getCurrencyExchangeRateListRequestDAO: async function (data) {
		try {
			const currencyExchangeListResponse =
				await MasterAPI.getCurrencyExchangeRateListRequest(data);
			if (currencyExchangeListResponse) {
				const statusCode = currencyExchangeListResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = currencyExchangeListResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return currencyExchangeListResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return currencyExchangeListResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(
				error,
				'MasterDAO.getCurrencyExchangeRateListRequestDAO',
			);
		}
	},
	updateCurrencyExchangeRateListRequestDAO: async function (data) {
		try {
			const currencyExchangeListResponse =
				await MasterAPI.updateCurrencyExchangeRateListRequest(data);
			if (currencyExchangeListResponse) {
				const statusCode = currencyExchangeListResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = currencyExchangeListResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return currencyExchangeListResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return currencyExchangeListResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(
				error,
				'MasterDAO.updateCurrencyExchangeRateListRequestDAO',
			);
		}
	},
	getRolesListRequestDAO :async function (data) {
		try {
			const rolesListResponse =
				await MasterAPI.getRolesListRequest(data);
			if (rolesListResponse) {
				const statusCode = rolesListResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = rolesListResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return rolesListResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return rolesListResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(
				error,
				'MasterDAO.getRolesListRequestDAO',
			);
		}
	},
	updateTalentRoleStatus :async function (id,isActive){
		try {
			const roleStatusResponse =
				await MasterAPI.updateRoleStatus(id,isActive);
			if (roleStatusResponse) {
				const statusCode = roleStatusResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = roleStatusResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return roleStatusResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return roleStatusResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(
				error,
				'MasterDAO.updateTalentRoleStatus',
			);
		}
	},
	getRightsForAddDAO :async function (){
		try {
			const roleStatusResponse =
				await MasterAPI.getRightsForAdd();
			if (roleStatusResponse) {
				const statusCode = roleStatusResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = roleStatusResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return roleStatusResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return roleStatusResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(
				error,
				'MasterDAO.getRightsForAddDAO',
			);
		}
	},
	uploadRoalIconDAO :async function (data){
		try {
			const roleStatusResponse = await MasterAPI.uploadRoalIcon(data);
			if (roleStatusResponse) {
				const statusCode = roleStatusResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = roleStatusResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return roleStatusResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return roleStatusResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(
				error,
				'MasterDAO.uploadRoalIconDAO',
			);
		}
	},
	addRoleDAO :async function (data){
		try {
			const roleStatusResponse =
				await MasterAPI.addRole(data);
			if (roleStatusResponse) {
				const statusCode = roleStatusResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = roleStatusResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return roleStatusResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return roleStatusResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(
				error,
				'MasterDAO.addRoleDAO',
			);
		}
	},
	editRoleDAO :async function (data){
		try {
			const roleStatusResponse =
				await MasterAPI.editRole(data);
			if (roleStatusResponse) {
				const statusCode = roleStatusResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = roleStatusResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return roleStatusResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return roleStatusResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(
				error,
				'MasterDAO.editRoleDAO',
			);
		}
	},
	updateRoleDAO :async function (data){
		try {
			const roleStatusResponse = await MasterAPI.updateRole(data);
			if (roleStatusResponse) {
				const statusCode = roleStatusResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = roleStatusResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return roleStatusResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return roleStatusResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
			} catch (error) {
				return errorDebug(
					error,
					'MasterDAO.updateRoleDAO',
				);
			}
	},
	timeZoneDAO : async function (timezoneDetails) {
		try {
			const timeZoneResponse = await MasterAPI.getTimeZoneMaster(timezoneDetails);
			if(timeZoneResponse){
				const statusCode = timeZoneResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = timeZoneResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return timeZoneResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return timeZoneResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error,'MasterDAO.timeZoneDAO')
		}
	},
	timeZoneTitleDAO : async function (data){
		try {
			const titleResponse =
				await MasterAPI.editTimezone(data);
			if (titleResponse) {
				const statusCode = titleResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = titleResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return titleResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return titleResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(
				error,
				'MasterDAO.editRoleDAO',
			);
		}

	},
	getChatGPTResponseDAO : async function (data){
		try {
			const titleResponse =
				await MasterAPI.getChatGPTResponse(data);
			if (titleResponse) {
				const statusCode = titleResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = titleResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return titleResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return titleResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(
				error,
				'MasterDAO.getChatGPTResponseDAO',
			);
		}
	},
	getOnBoardListDAO : async function (data) {
		try {
			const onBoardListtitleResponse =
				await MasterAPI.getOnBoardListData(data);
			if (onBoardListtitleResponse) {
				const statusCode = onBoardListtitleResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = onBoardListtitleResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return onBoardListtitleResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return onBoardListtitleResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(
				error,
				'MasterDAO.getOnBoardListDAO',
			);
		}
	},
	getClientFeedbackListDAO : async function (data) {
		try {
			const onBoardListtitleResponse =
				await MasterAPI.getClientFeedbackListAPI(data);
			if (onBoardListtitleResponse) {
				const statusCode = onBoardListtitleResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = onBoardListtitleResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return onBoardListtitleResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return onBoardListtitleResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(
				error,
				'MasterDAO.getClientFeedbackListDAO',
			);
		}
	},
	getRevenueListDAO : async function (data) {
		try {
			const onBoardListtitleResponse =
				await MasterAPI.getRevenueListData(data);
			if (onBoardListtitleResponse) {
				const statusCode = onBoardListtitleResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = onBoardListtitleResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return onBoardListtitleResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return onBoardListtitleResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(
				error,
				'MasterDAO.getRevenueListDAO',
			);
		}
	},
	downloadResumeDAO : async function (data) {
		try {
			const onBoardListtitleResponse =
				await MasterAPI.downloadResumeAPI(data);
			if (onBoardListtitleResponse) {
				const statusCode = onBoardListtitleResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = onBoardListtitleResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return onBoardListtitleResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return onBoardListtitleResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(
				error,
				'MasterDAO.downloadResumeDAO',
			);
		}
	},
	downloadJDDAO : async function (data) {
		try {
			const onBoardListtitleResponse =
				await MasterAPI.downloadJDAPI(data);
			if (onBoardListtitleResponse) {
				const statusCode = onBoardListtitleResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResut = onBoardListtitleResponse?.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResut,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return onBoardListtitleResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return onBoardListtitleResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(
				error,
				'MasterDAO.downloadJDDAO',
			);
		}
	},
	getAutoCompleteCityStateDAO : async function (city,{ signal }) {
		try {
			const autoCompleteCityStateResponse =
				await MasterAPI.getAutoCompleteCityState(city,{ signal });
				if (autoCompleteCityStateResponse) {
					const statusCode = autoCompleteCityStateResponse['statusCode'];
					if (statusCode === HTTPStatusCode.OK) {
						const tempResut = autoCompleteCityStateResponse?.responseBody;
						return {
							statusCode: statusCode,
							responseBody: tempResut,
						};
					} else if (statusCode === HTTPStatusCode.NOT_FOUND)
						return autoCompleteCityStateResponse;
					else if (statusCode === HTTPStatusCode.BAD_REQUEST)
						return autoCompleteCityStateResponse;
					else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
						let deletedResponse =
							UserSessionManagementController.deleteAllSession();
						if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
					}
				}
		} catch (error) {
			return errorDebug(
				error,
				'MasterDAO.getAutoCompleteCityStateDAO',
			);
		}
	},
	getNearByCitiesDAO : async function (LocationID) {		
		try {
			const getNearByCitiesResponse =
			await MasterAPI.getNearByCities(LocationID);
				if (getNearByCitiesResponse) {
					const statusCode = getNearByCitiesResponse['statusCode'];
					if (statusCode === HTTPStatusCode.OK) {
						const tempResut = getNearByCitiesResponse?.responseBody;
						return {
							statusCode: statusCode,
							responseBody: tempResut,
						};
					} else if (statusCode === HTTPStatusCode.NOT_FOUND)
						return getNearByCitiesResponse;
					else if (statusCode === HTTPStatusCode.BAD_REQUEST)
						return getNearByCitiesResponse;
					else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
						let deletedResponse =
							UserSessionManagementController.deleteAllSession();
						if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
					}
				}
		} catch (error) {
			return errorDebug(
				error,
				'MasterDAO.getNearByCitiesDAO',
			);
		}
	},
	getNearByCitiesMultipleDAO : async function (LocationID) {		
		try {
			const getNearByCitiesResponse =
			await MasterAPI.getNearByMultipleCities(LocationID);
				if (getNearByCitiesResponse) {
					const statusCode = getNearByCitiesResponse['statusCode'];
					if (statusCode === HTTPStatusCode.OK) {
						const tempResut = getNearByCitiesResponse?.responseBody;
						return {
							statusCode: statusCode,
							responseBody: tempResut,
						};
					} else if (statusCode === HTTPStatusCode.NOT_FOUND)
						return getNearByCitiesResponse;
					else if (statusCode === HTTPStatusCode.BAD_REQUEST)
						return getNearByCitiesResponse;
					else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
						let deletedResponse =
							UserSessionManagementController.deleteAllSession();
						if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
					}
				}
		} catch (error) {
			return errorDebug(
				error,
				'MasterDAO.getNearByCitiesMultipleDAO',
			);
		}
	},
	getAutoCompleteCity : async function () {
		try {
			const getNearByCitiesResponse =
			await MasterAPI.getAllCities();
				if (getNearByCitiesResponse) {
					const statusCode = getNearByCitiesResponse['statusCode'];
					if (statusCode === HTTPStatusCode.OK) {
						const tempResut = getNearByCitiesResponse?.responseBody;
						return {
							statusCode: statusCode,
							responseBody: tempResut,
						};
					} else if (statusCode === HTTPStatusCode.NOT_FOUND)
						return getNearByCitiesResponse;
					else if (statusCode === HTTPStatusCode.BAD_REQUEST)
						return getNearByCitiesResponse;
					else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
						let deletedResponse =
							UserSessionManagementController.deleteAllSession();
						if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
					}
				}
		} catch (error) {
			return errorDebug(
				error,
				'MasterDAO.getAutoCompleteCity',
			);
		}	
	},
	getFrequencyDAO : async function () {
		try {
			const getFrequencyResponse = await MasterAPI.getFrequency();
				if (getFrequencyResponse) {
					const statusCode = getFrequencyResponse['statusCode'];
					if (statusCode === HTTPStatusCode.OK) {
						const tempResut = getFrequencyResponse?.responseBody;
						return {
							statusCode: statusCode,
							responseBody: tempResut,
						};
					} else if (statusCode === HTTPStatusCode.NOT_FOUND)
						return getFrequencyResponse;
					else if (statusCode === HTTPStatusCode.BAD_REQUEST)
						return getFrequencyResponse;
					else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
						let deletedResponse =
							UserSessionManagementController.deleteAllSession();
						if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
					}
				}
		} catch (error) {
			return errorDebug(
				error,
				'MasterDAO.getFrequencyDAO',
			);
		}
	},
	updateJobPostDataToATSDAO : async function (data,isAIQue) {
		try {
			const updateJobPostDataToATSResponse = await MasterAPI.updateJobPostDataToATS(data,isAIQue);
				if (updateJobPostDataToATSResponse) {
					const statusCode = updateJobPostDataToATSResponse['statusCode'];
					if (statusCode === HTTPStatusCode.OK) {
						const tempResut = updateJobPostDataToATSResponse?.responseBody;
						return {
							statusCode: statusCode,
							responseBody: tempResut,
						};
					} else if (statusCode === HTTPStatusCode.NOT_FOUND)
						return updateJobPostDataToATSResponse;
					else if (statusCode === HTTPStatusCode.BAD_REQUEST)
						return updateJobPostDataToATSResponse;
					else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
						let deletedResponse =
							UserSessionManagementController.deleteAllSession();
						if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
					}
				}
		} catch (error) {
			return errorDebug(
				error,
				'MasterDAO.updateJobPostDataToATSDAO',
			);
		}
	}
};
