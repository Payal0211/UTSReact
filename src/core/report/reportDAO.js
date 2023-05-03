import { ReportAPI } from 'apis/reportAPI';
import { HTTPStatusCode } from 'constants/network';
import UTSRoutes from 'constants/routes';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const ReportDAO = {
	demandFunnelListingRequestDAO: async function (reportData) {
		try {
			const demandFunnelReport = await ReportAPI.demandFunnelListingRequest(
				reportData,
			);
			if (demandFunnelReport) {
				const statusCode = demandFunnelReport['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = demandFunnelReport?.responseBody?.details;
					return {
						statusCode: statusCode,
						responseBody: JSON.parse(tempResult),
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return demandFunnelReport;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return demandFunnelReport;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ReportDAO.demandFunnelListingRequestDAO');
		}
	},
	demandFunnelSummaryRequestDAO: async function (reportData) {
		try {
			const demandFunnelSummary = await ReportAPI.demandFunnelSummary(
				reportData,
			);
			if (demandFunnelSummary) {
				const statusCode = demandFunnelSummary['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = demandFunnelSummary?.responseBody?.details;
					return {
						statusCode: statusCode,
						responseBody: JSON.parse(tempResult),
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return demandFunnelSummary;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return demandFunnelSummary;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ReportDAO.demandFunnelSummaryRequestDAO');
		}
	},
	demandFunnelFiltersRequestDAO: async function () {
		try {
			const demandFunnelReport = await ReportAPI.demandFunnelFilters();
			if (demandFunnelReport) {
				const statusCode = demandFunnelReport['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = demandFunnelReport?.responseBody?.details;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return demandFunnelReport;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return demandFunnelReport;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ReportDAO.demandFunnelFiltersRequestDAO');
		}
	},
	demandFunnelHRDetailsRequestDAO: async function (reportData) {
		try {
			const demandFunnelReport = await ReportAPI.demandFunnelHRDetailsRequest(
				reportData,
			);

			if (demandFunnelReport) {
				const statusCode = demandFunnelReport['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult =
						demandFunnelReport?.responseBody?.details ||
						demandFunnelReport?.responseBody;

					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return demandFunnelReport;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return demandFunnelReport;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ReportDAO.demandFunnelHRDetailsRequestDAO');
		}
	},

	/** ----------- SUPPLY FUNNEL ---------------- */
	supplyFunnelListingRequestDAO: async function (reportData) {
		try {
			const SupplyFunnelReport = await ReportAPI.supplyFunnelListingRequest(
				reportData,
			);
			if (SupplyFunnelReport) {
				const statusCode = SupplyFunnelReport['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = SupplyFunnelReport?.responseBody?.details;
					return {
						statusCode: statusCode,
						responseBody: JSON.parse(tempResult),
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return SupplyFunnelReport;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return SupplyFunnelReport;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ReportDAO.supplyFunnelListingRequestDAO');
		}
	},
	supplyFunnelSummaryRequestDAO: async function (reportData) {
		try {
			const supplyFunnelSummary = await ReportAPI.supplyFunnelSummary(
				reportData,
			);
			if (supplyFunnelSummary) {
				const statusCode = supplyFunnelSummary['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = supplyFunnelSummary?.responseBody?.details;
					return {
						statusCode: statusCode,
						responseBody: JSON.parse(tempResult),
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return supplyFunnelSummary;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return supplyFunnelSummary;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ReportDAO.supplyFunnelSummaryRequestDAO');
		}
	},
	supplyFunnelFiltersRequestDAO: async function () {
		try {
			const supplyFunnelFilters = await ReportAPI.supplyFunnelFilters();
			if (supplyFunnelFilters) {
				const statusCode = supplyFunnelFilters['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = supplyFunnelFilters?.responseBody?.details;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return supplyFunnelFilters;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return supplyFunnelFilters;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ReportDAO.supplyFunnelFiltersRequestDAO');
		}
	},
	supplyFunnelHRDetailsRequestDAO: async function (reportData) {
		try {
			const supplyFunnelReport = await ReportAPI.supplyFunnelHRDetailsRequest(
				reportData,
			);

			if (supplyFunnelReport) {
				const statusCode = supplyFunnelReport['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult =
						supplyFunnelReport?.responseBody?.details ||
						supplyFunnelReport?.responseBody;

					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return supplyFunnelReport;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return supplyFunnelReport;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ReportDAO.supplyFunnelHRDetailsRequestDAO');
		}
	},
	/** ----------- TEAM DEMAND  FUNNEL ---------------- */
	teamDemandFunnelListingRequestDAO: async function (reportData) {
		try {
			const teamDemandListingResponse =
				await ReportAPI.teamDemandFunnelListingRequest(reportData);
			if (teamDemandListingResponse) {
				const statusCode = teamDemandListingResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = teamDemandListingResponse?.responseBody?.details;
					return {
						statusCode: statusCode,
						responseBody: JSON.parse(tempResult),
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return teamDemandListingResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return teamDemandListingResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ReportDAO.teamDemandFunnelListingRequestDAO');
		}
	},
	teamDemandFunnelFiltersRequestDAO: async function () {
		try {
			const teamDemandFilterResponse =
				await ReportAPI.teamDemandFunnelFilters();
			if (teamDemandFilterResponse) {
				const statusCode = teamDemandFilterResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = teamDemandFilterResponse?.responseBody?.details;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return teamDemandFilterResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return teamDemandFilterResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ReportDAO.teamDemandFunnelFiltersRequestDAO');
		}
	},
};
