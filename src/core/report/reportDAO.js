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
			// console.log(reportData, '--reportData');
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
	teamDemandFunnelSummaryRequestDAO: async function (reportData) {
		try {
			const teamDemandSummary = await ReportAPI.teamDemandFunnelSummaryRequest(
				reportData,
			);
			if (teamDemandSummary) {
				const statusCode = teamDemandSummary['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = teamDemandSummary?.responseBody?.details;
					return {
						statusCode: statusCode,
						responseBody: JSON.parse(tempResult),
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return teamDemandSummary;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return teamDemandSummary;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ReportDAO.teamDemandFunnelSummaryRequestDAOs');
		}
	},
	teamDemandFunnelHRDetailsRequestDAO: async function (reportData) {
		try {
			const teamDemandHRDetailsResponse =
				await ReportAPI.teamDemandFunnelHRDetailsRequest(reportData);

			if (teamDemandHRDetailsResponse) {
				const statusCode = teamDemandHRDetailsResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult =
						teamDemandHRDetailsResponse?.responseBody?.details ||
						teamDemandHRDetailsResponse?.responseBody;

					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return teamDemandHRDetailsResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return teamDemandHRDetailsResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ReportDAO.teamDemandFunnelHRDetailsRequestDAO');
		}
	},
	jdParsingDumpReportRequestDAO: async function (reportData) {
		try {
			const jdParsingDumpResponse = await ReportAPI.jdParsingDumpReportRequest(
				reportData,
			);

			if (jdParsingDumpResponse) {
				const statusCode = jdParsingDumpResponse['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult =
						jdParsingDumpResponse?.responseBody?.details ||
						jdParsingDumpResponse?.responseBody;

					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return jdParsingDumpResponse;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return jdParsingDumpResponse;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ReportDAO.jdParsingDumpReportRequestDAO');
		}
	},
	OverAllSLASummaryDAO: async function (data) {
		try {
			const overAllSummaryRequest = await ReportAPI.OverAllSLASummaryRequest(
				data,
			);

			if (overAllSummaryRequest) {
				const statusCode = overAllSummaryRequest['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult =
						overAllSummaryRequest?.responseBody?.details ||
						overAllSummaryRequest?.responseBody;

					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return overAllSummaryRequest;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return overAllSummaryRequest;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ReportDAO.OverAllSLASummaryDAO');
		}
	},
	slaDetailedDataDAO: async function (data) {
		try {
			const slaDetailedDataRequest = await ReportAPI.SlaDetailsData(data);

			if (slaDetailedDataRequest) {
				const statusCode = slaDetailedDataRequest['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult =
						slaDetailedDataRequest?.responseBody?.details ||
						slaDetailedDataRequest?.responseBody;

					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return slaDetailedDataRequest;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return slaDetailedDataRequest;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ReportDAO.slaDetailedDataDAO');
		}
	},
	slaFilterDAO: async function (data) {
		try {
			const slaDetailedDataRequest = await ReportAPI.slaFilter(data);

			if (slaDetailedDataRequest) {
				const statusCode = slaDetailedDataRequest['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult =
						slaDetailedDataRequest?.responseBody?.details ||
						slaDetailedDataRequest?.responseBody;

					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return slaDetailedDataRequest;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return slaDetailedDataRequest;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ReportDAO.slaFilterDAO');
		}
	},

	// HR Lost Report 
	getHRLostReportDRO: async function (reportData) {
		try {
			const hrLostResult = await ReportAPI.getLostHRReport(
				reportData,
			);
			if (hrLostResult) {
				const statusCode = hrLostResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = hrLostResult?.responseBody?.details;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return hrLostResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return hrLostResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ReportDAO.getHRLostReportDRO');
		}
	},
	getLostHRTalentDetailDRO: async function (ID) {
		try {
			const hrLostResult = await ReportAPI.getLostHRTalentDetails(ID);
			if (hrLostResult) {
				const statusCode = hrLostResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = hrLostResult?.responseBody?.details;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return hrLostResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return hrLostResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ReportDAO.getLostHRTalentDetailDRO');
		}
	},
	getReplacementReportDRO: async function (reportData) {
		try {
			const replacementResult = await ReportAPI.getReplacementReport(
				reportData,
			);
			if (replacementResult) {
				const statusCode = replacementResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = replacementResult?.responseBody?.details;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return replacementResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return replacementResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ReportDAO.getReplacementReportDRO');
		}
	},
	getTalentBackoutReportDRO: async function (reportData) {
		try {
			const replacementResult = await ReportAPI.getTalentBackoutReport(
				reportData,
			);
			if (replacementResult) {
				const statusCode = replacementResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = replacementResult?.responseBody?.details;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return replacementResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return replacementResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ReportDAO.getTalentBackoutReportDRO');
		}
	},
	getTalentOnboardReportDRO: async function (reportData) {
		try {
			const replacementResult = await ReportAPI.getTalentOnboardReport(
				reportData,
			);
			if (replacementResult) {
				const statusCode = replacementResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = replacementResult?.responseBody?.details;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return replacementResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return replacementResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ReportDAO.getTalentOnboardReportDRO');
		}
	},
	getAllNotesReportDRO: async function (reportData) {
		try {
			const replacementResult = await ReportAPI.getAllNotesReport(
				reportData,
			);
			if (replacementResult) {
				const statusCode = replacementResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = replacementResult?.responseBody?.details;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return replacementResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return replacementResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ReportDAO.getAllNotesReportDRO');
		}
	},
	getTalentRejectReportDRO: async function (reportData) {
		try {
			const replacementResult = await ReportAPI.getTalentRejectReport(
				reportData,
			);
			if (replacementResult) {
				const statusCode = replacementResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = replacementResult?.responseBody?.details;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return replacementResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return replacementResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ReportDAO.getTalentRejectReportDRO');
		}
	},

	getTalentInterviewRoundReportDRO: async function (reportData) {
		try {
			const replacementResult = await ReportAPI.getTalentInterviewRoundReport(
				reportData,
			);
			if (replacementResult) {
				const statusCode = replacementResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = replacementResult?.responseBody?.details;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return replacementResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return replacementResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ReportDAO.getTalentInterviewRoundReportDRO');
		}
	},
	getTalentDocumentDAO: async function (reportData) {
		try {
			const replacementResult = await ReportAPI.getTalentDocumentReport(
				reportData,
			);
			if (replacementResult) {
				const statusCode = replacementResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = replacementResult?.responseBody?.details;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return replacementResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return replacementResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ReportDAO.getTalentDocumentDAO');
		}
	},
	getZohoInvoiceDAO: async function (reportData) {
		try {
			const replacementResult = await ReportAPI.getZohoInvoiceReport(
				reportData,
			);
			if (replacementResult) {
				const statusCode = replacementResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = replacementResult?.responseBody?.details;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return replacementResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return replacementResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ReportDAO.getZohoInvoiceDAO');
		}
	},
	getZohoInvoiceCustomerDAO: async function (reportData) {
		try {
			const replacementResult = await ReportAPI.getZohoInvoiceCustomerReport(
				reportData,
			);
			if (replacementResult) {
				const statusCode = replacementResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = replacementResult?.responseBody?.details;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return replacementResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return replacementResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ReportDAO.getZohoInvoiceCustomerDAO');
		}
	},
	getLeaveTakenDAO: async function (reportData) {
		try {
			const replacementResult = await ReportAPI.getLeaveTakenReport(
				reportData,
			);
			if (replacementResult) {
				const statusCode = replacementResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = replacementResult?.responseBody?.details;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return replacementResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return replacementResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ReportDAO.getLeaveTakenDAO');
		}
	},
	getRecruiterReportDAO: async function (reportData) {
		try {
			const replacementResult = await ReportAPI.getRecruiterReport(
				reportData,
			);
			if (replacementResult) {
				const statusCode = replacementResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = replacementResult?.responseBody?.details;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return replacementResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return replacementResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ReportDAO.getRecruiterReportDAO');
		}
	},
	getDailySnapshotDAO: async function (snapshotData) {
		try {
			const snapshotDataResult = await ReportAPI.getDailySnapshotReport(
				snapshotData,
			);
			if (snapshotDataResult) {
				const statusCode = snapshotDataResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = snapshotDataResult?.responseBody?.details;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return snapshotDataResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return snapshotDataResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ReportDAO.getDailySnapshotDAO');
		}
	},
	getClientDashboardReportDAO: async function (reportData) {
		try {
			const replacementResult = await ReportAPI.getClientDashboardReport(
				reportData,
			);
			if (replacementResult) {
				const statusCode = replacementResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = replacementResult?.responseBody?.details;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return replacementResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return replacementResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ReportDAO.getClientDashboardReportDAO');
		}
	},
	getAMReportDAO : async function (reportData) {
		try {
			const replacementResult = await ReportAPI.getAMReport(
				reportData,
			);
			if (replacementResult) {
				const statusCode = replacementResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = replacementResult?.responseBody?.details;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return replacementResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return replacementResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ReportDAO.getAMReportDAO');
		}
	},
	getAMReportFilterDAO : async function () {
		try {
			const replacementResult = await ReportAPI.getAMReportFilters();
			if (replacementResult) {
				const statusCode = replacementResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = replacementResult?.responseBody?.details;
					return {
						statusCode: statusCode,
						responseBody: tempResult,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND)
					return replacementResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return replacementResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'ReportDAO.getAMReportFilterDAO');
		}
	},
	mapCompanyToCustomerDAO:async function (payload) {
		try {
			const taResult = await ReportAPI.MapZohoCustomerToUTSCompanyAPI(payload);
			if (taResult) {
				const statusCode = taResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = taResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) return taResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST) return taResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'TaDashboardDAO.addOrUpdateTAMonthlyGoalDAO');
		}
	},
	DailyBusinessNumbersDAO:async function (payload) {
		try {
			const taResult = await ReportAPI.DailyBusinessNumbersAPI(payload);
			if (taResult) {
				const statusCode = taResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = taResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
			} else if (statusCode === HTTPStatusCode.NOT_FOUND) return taResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST) return taResult;
				else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'TaDashboardDAO.DailyBusinessNumbersDAO');
		}
	},
	PotentialClosuresListDAO:async function (payload) {
		try {
			const taResult = await ReportAPI.PotentialClosuresListAPI(payload);
			if (taResult) {
				const statusCode = taResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = taResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) return taResult;
					else if (statusCode === HTTPStatusCode.BAD_REQUEST) return taResult;
					else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'TaDashboardDAO.PotentialClosuresListDAO');
		}
	},	
	PotentialClosuresUpdateDAO:async function (payload) {
		try {
			const taResult = await ReportAPI.PotentialClosuresUpdateAPI(payload);
			if (taResult) {
				const statusCode = taResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = taResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (statusCode === HTTPStatusCode.NOT_FOUND) return taResult;
					else if (statusCode === HTTPStatusCode.BAD_REQUEST) return taResult;
					else if (statusCode === HTTPStatusCode.UNAUTHORIZED) {
					let deletedResponse =
						UserSessionManagementController.deleteAllSession();
					if (deletedResponse) window.location.replace(UTSRoutes.LOGINROUTE);
				}
			}
		} catch (error) {
			return errorDebug(error, 'TaDashboardDAO.PotentialClosuresUpdateDAO');
		}
	},	
};
