import { EngagementRequestAPI } from 'apis/engagementAPI';
import { HTTPStatusCode } from 'constants/network';
import UTSRoutes from 'constants/routes';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { Navigate } from 'react-router-dom';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const engagementRequestDAO = {
	getEngagementListDAO: async function (data) {
		try {
			const engagementListResult = await EngagementRequestAPI.getEngagementList(
				data,
			);
			if (engagementListResult) {
				const statusCode = engagementListResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = engagementListResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return engagementListResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return engagementListResult;
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
			return errorDebug(error, 'hiringRequestDAO.getPaginatedHiringRequestDAO');
		}
	},

	getEngagementFilterListDAO: async function () {
		try {
			const engagementFilterListResult =
				await EngagementRequestAPI.getEngagementFilterList();
			if (engagementFilterListResult) {
				const statusCode = engagementFilterListResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = engagementFilterListResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return engagementFilterListResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return engagementFilterListResult;
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
			return errorDebug(
				error,
				'engagementRequestDAO.getEngagementFilterListDAO',
			);
		}
	},
	replaceTalentEngagementRequestDAO: async function (
		talentDetails,
		isEngagement,
	) {
		try {
			const replaceTalentResponse =
				await EngagementRequestAPI.replaceTalentEngagementListRequest(
					talentDetails,
					isEngagement,
				);
			if (replaceTalentResponse) {
				const statusCode = replaceTalentResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = replaceTalentResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return replaceTalentResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return replaceTalentResponse;
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
			return errorDebug(
				error,
				'engagementRequestDAO.replaceTalentEngagementRequestDAO',
			);
		}
	},
	saveTalentReplacementDAO: async function (talentDetails) {
		try {
			const replaceTalentResponse =
				await EngagementRequestAPI.saveTalentReplacementRequest(talentDetails);
			if (replaceTalentResponse) {
				const statusCode = replaceTalentResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = replaceTalentResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return replaceTalentResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return replaceTalentResponse;
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
			return errorDebug(error, 'engagementRequestDAO.saveTalentReplacementDAO');
		}
	},
	getContentEndEngagementRequestDAO: async function (talentDetails) {
		try {
			const replaceTalentResponse =
				await EngagementRequestAPI.getContentEndEngagementRequest(
					talentDetails,
				);
			if (replaceTalentResponse) {
				const statusCode = replaceTalentResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = replaceTalentResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return replaceTalentResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return replaceTalentResponse;
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
			return errorDebug(
				error,
				'engagementRequestDAO.getContentEndEngagementRequestDAO',
			);
		}
	},
	changeContractEndDateRequestDAO: async function (talentDetails) {
		try {
			const changeContractEndDateResponse =
				await EngagementRequestAPI.changeContractEndDateRequest(talentDetails);
			if (changeContractEndDateResponse) {
				const statusCode = changeContractEndDateResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = changeContractEndDateResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return changeContractEndDateResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return changeContractEndDateResponse;
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
			return errorDebug(
				error,
				'engagementRequestDAO.changeContractEndDateRequestDAO',
			);
		}
	},
	saveInvoiceDetailsRequestDAO: async function (talentDetails) {
		try {
			const saveInvoiceResponse =
				await EngagementRequestAPI.saveInvoiceDetailsRequest(talentDetails);
			if (saveInvoiceResponse) {
				const statusCode = saveInvoiceResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = saveInvoiceResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return saveInvoiceResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return saveInvoiceResponse;
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
			return errorDebug(
				error,
				'engagementRequestDAO.saveInvoiceDetailsRequestDAO',
			);
		}
	},
	getContentForAddInvoiceRequestDAO: async function (talentDetails) {
		try {
			const invoiceResponse =
				await EngagementRequestAPI.getContentForAddInvoiceRequest(
					talentDetails,
				);
			if (invoiceResponse) {
				const statusCode = invoiceResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = invoiceResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return invoiceResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return invoiceResponse;
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
			return errorDebug(
				error,
				'engagementRequestDAO.getContentForAddInvoiceRequestDAO',
			);
		}
	},
	editBillRatePayRateRequestDAO: async function (talentDetails) {
		try {
			const editBillPayRateResponse =
				await EngagementRequestAPI.editBillRatePayRateRequest(talentDetails);
			if (editBillPayRateResponse) {
				const statusCode = editBillPayRateResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = editBillPayRateResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return editBillPayRateResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return editBillPayRateResponse;
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
			return errorDebug(
				error,
				'engagementRequestDAO.editBillRatePayRateRequestDAO',
			);
		}
	},
	saveEditBillPayRateRequestDAO: async function (talentDetails) {
		try {
			const saveBillPayRateResponse =
				await EngagementRequestAPI.saveBillRatePayRateRequest(talentDetails);
			if (saveBillPayRateResponse) {
				const statusCode = saveBillPayRateResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = saveBillPayRateResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return saveBillPayRateResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return saveBillPayRateResponse;
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
			return errorDebug(
				error,
				'engagementRequestDAO.saveEditBillPayRateRequestDAO',
			);
		}
	},
	getRenewEngagementRequestDAO: async function (talentDetails) {
		try {
			const renewEngagementResponse =
				await EngagementRequestAPI.editBillRatePayRateRequest(talentDetails);
			if (renewEngagementResponse) {
				const statusCode = renewEngagementResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = renewEngagementResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return renewEngagementResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return renewEngagementResponse;
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
			return errorDebug(
				error,
				'engagementRequestDAO.getRenewEngagementRequestDAO',
			);
		}
	},
	saveRenewEngagementRequestDAO: async function (talentDetails) {
		try {
			const saveRenewEngagementResponse =
				await EngagementRequestAPI.saveRenewEngagementRequest(talentDetails);
			if (saveRenewEngagementResponse) {
				const statusCode = saveRenewEngagementResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = saveRenewEngagementResponse.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return saveRenewEngagementResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return saveRenewEngagementResponse;
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
			return errorDebug(
				error,
				'engagementRequestDAO.saveRenewEngagementRequestDAO',
			);
		}
	},
};
