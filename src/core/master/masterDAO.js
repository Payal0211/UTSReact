import { MasterAPI } from 'apis/masterAPI';
import { HTTPStatusCode } from 'constants/network';
import UTSRoutes from 'constants/routes';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { Navigate } from 'react-router-dom';
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
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'masterDAO.getFixedValueRequestDAO');
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
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'masterDAO.getGEORequestDAO');
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
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getSkillsRequestDAO');
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
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getCurrencyRequestDAO');
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
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
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
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getTimeZoneRequestDAO');
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
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
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
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
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
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
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
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
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
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
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
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
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
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
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
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
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
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
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
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
				}
				// return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getCountryDAO');
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
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
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
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
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
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
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
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
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
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
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
	getEmailSuggestionDAO: async function (email) {
		try {
			const emailSuggestionResponse = await MasterAPI.getEmailSuggestionRequest(
				email,
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
					if (deletedResponse) Navigate(UTSRoutes.LOGINROUTE);
				}
				// return statusCode;
			}
		} catch (error) {
			return errorDebug(error, 'MasterDAO.getEmailSuggestionDAO');
		}
	},
};
