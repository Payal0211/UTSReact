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
	createReplaceHRRequestDAO: async function (details) {
		try {
			const replaceTalentResponse =
				await EngagementRequestAPI.createReplaceHRRequest(details);
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
			return errorDebug(error, 'engagementRequestDAO.createReplaceHRRequestDAO');
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

	getContentCancelEngagementRequestDAO:async function (talentDetails) {
		try {
			const replaceTalentResponse =
				await EngagementRequestAPI.getContentCancelEngagementRequest(
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
				'engagementRequestDAO.getContentCancelEngagementRequestDAO',
			);
		}
	},
	getAMDetailsDAO: async function (id) {
		try {
			const replaceTalentResponse =
				await EngagementRequestAPI.getAMDetailsRequest(
					id,
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
				'engagementRequestDAO.getAMDetailsDAO',
			);
		}
	},
	saveAMNAMEEDITDAO: async function (payload) {
		try {
			const replaceTalentResponse =
				await EngagementRequestAPI.saveAMNAMEEDITRequest(
					payload
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
				'engagementRequestDAO.saveAMNAMEEDIT',
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
	cancelEngagementRequestDAO: async function (talentDetails) {
		try {
			const changeContractEndDateResponse =
				await EngagementRequestAPI.cancelEngagementRequest(talentDetails);
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
				'engagementRequestDAO.cancelEngagementRequestDAO',
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
				await EngagementRequestAPI.GetRenewEngagementRequest(talentDetails);
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
  viewOnboardFeedbackDAO: async function (onBoardID) {
        try {
            const viewOnboardFeedback = await EngagementRequestAPI.viewOnboardFeedback(onBoardID);
            if (viewOnboardFeedback) {
                const statusCode = viewOnboardFeedback['statusCode'];
                if (statusCode === HTTPStatusCode.OK) {
                    const tempResult = viewOnboardFeedback.responseBody;
                    return {
                        statusCode: statusCode,
                        responseBody: tempResult,
                    };
                }
                else if (
                    statusCode === HTTPStatusCode.NOT_FOUND ||
                    statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
                )
                    return viewOnboardFeedback;
                else if (statusCode === HTTPStatusCode.BAD_REQUEST) return viewOnboardFeedback;
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
            return errorDebug(error, 'engagementRequestDAO.viewOnboardFeedbackDAO');
        }
    },
    getFeedbackListDAO: async function (feedback) {
        try {
            const feedbackList = await EngagementRequestAPI.getFeedback(feedback);
            if (feedbackList) {
                const statusCode = feedbackList['statusCode'];
                if (statusCode === HTTPStatusCode.OK) {
                    const tempResult = feedbackList.responseBody;
                    return {
                        statusCode: statusCode,
                        responseBody: tempResult,
                    };
                } else if (
                    statusCode === HTTPStatusCode.NOT_FOUND ||
                    statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
                )
                    return feedbackList;
                else if (statusCode === HTTPStatusCode.BAD_REQUEST) return feedbackList;
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
            return errorDebug(error, 'engagementRequestDAO.getFeedbackListDAO');
        }
    },

    viewOnboardDetailsDAO: async function (onBoardID) {
        try {
            const onBoardDetails = await EngagementRequestAPI.onBoardDetails(onBoardID);
            if (onBoardDetails) {
                const statusCode = onBoardDetails['statusCode'];
                if (statusCode === HTTPStatusCode.OK) {
                    const tempResult = onBoardDetails.responseBody;
                    return {
                        statusCode: statusCode,
                        responseBody: tempResult,
                    };
                } else if (
                    statusCode === HTTPStatusCode.NOT_FOUND ||
                    statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR || statusCode === HTTPStatusCode.BAD_REQUEST
                )
                    return onBoardDetails;
                // else if (statusCode === HTTPStatusCode.BAD_REQUEST) return onBoardDetails;
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
            return errorDebug(error, 'engagementRequestDAO.viewOnboardDetailsDAO');
        }
    },
    getFeedbackFormContentDAO: async function (getHRAndEngagementId) {
        try {
            const feedbackFormContent = await EngagementRequestAPI.feedbackFormContent(getHRAndEngagementId);
            if (feedbackFormContent) {
                const statusCode = feedbackFormContent['statusCode'];
                if (statusCode === HTTPStatusCode.OK) {
                    const tempResult = feedbackFormContent.responseBody;
                    return {
                        statusCode: statusCode,
                        responseBody: tempResult,
                    };
                } else if (
                    statusCode === HTTPStatusCode.NOT_FOUND ||
                    statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
                )
                    return feedbackFormContent;
                else if (statusCode === HTTPStatusCode.BAD_REQUEST) return feedbackFormContent;
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
            return errorDebug(error, 'engagementRequestDAO.getFeedbackFormContentDAO');
        }
    },

    saveFeedbackFormDAO: async function (feedBackdata) {
        try {
            const submitFeedBackForm = await EngagementRequestAPI.submitFeedBackForm(feedBackdata);
            if (submitFeedBackForm) {
                const statusCode = submitFeedBackForm['statusCode'];
                if (statusCode === HTTPStatusCode.OK) {
                    const tempResult = submitFeedBackForm.responseBody;
                    return {
                        statusCode: statusCode,
                        responseBody: tempResult,
                    };
                } else if (
                    statusCode === HTTPStatusCode.NOT_FOUND ||
                    statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
                )
                    return submitFeedBackForm;
                else if (statusCode === HTTPStatusCode.BAD_REQUEST) return submitFeedBackForm;
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
            return errorDebug(error, 'engagementRequestDAO.saveFeedbackFormDAO');
        }
    },

	calculateActualNRBRPRDAO: async function (br,pr,currency) {
        try {
            const calculateActualNRBRPR = await EngagementRequestAPI.calculateActualNRBRPR(br,pr,currency);
            if (calculateActualNRBRPR) {
                const statusCode = calculateActualNRBRPR['statusCode'];
                if (statusCode === HTTPStatusCode.OK) {
                    const tempResult = calculateActualNRBRPR.responseBody;
                    return {
                        statusCode: statusCode,
                        responseBody: tempResult,
                    };
                } else if (
                    statusCode === HTTPStatusCode.NOT_FOUND ||
                    statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
                )
                    return calculateActualNRBRPR;
                else if (statusCode === HTTPStatusCode.BAD_REQUEST) return calculateActualNRBRPR;
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
            return errorDebug(error, 'engagementRequestDAO.calculateActualNRBRPRDAO');
        }
    },

	uploadFeedbackSupportingFileDAO: async function (feedBackdata) {
		// console.log("DAO", feedBackdata)
        try {
            const submitFeedBackForm = await EngagementRequestAPI.uploadFile(feedBackdata);
            if (submitFeedBackForm) {
                const statusCode = submitFeedBackForm['statusCode'];
                if (statusCode === HTTPStatusCode.OK) {
                    const tempResult = submitFeedBackForm.responseBody;
                    return {
                        statusCode: statusCode,
                        responseBody: tempResult,
                    };
                } else if (
                    statusCode === HTTPStatusCode.NOT_FOUND ||
                    statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
                )
                    return submitFeedBackForm;
                else if (statusCode === HTTPStatusCode.BAD_REQUEST) return submitFeedBackForm;
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
            return errorDebug(error, 'engagementRequestDAO.saveFeedbackFormDAO');
        }
    },
	getTSCUserListDAO: async function (id) {
		try {
			const userListResult = await EngagementRequestAPI.getTSCUserList(
				id,
			);
			if (userListResult) {
				const statusCode = userListResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = userListResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return userListResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return userListResult;
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
			return errorDebug(error, 'hiringRequestDAO.getTSCUserListDAO');
		}
	},
	getAllBRPRListDAO: async function (id) {
		try {
			const allBRPRListResult = await EngagementRequestAPI.getAllBRPRList(
				id,
			);
			if (allBRPRListResult) {
				const statusCode = allBRPRListResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = allBRPRListResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return allBRPRListResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return allBRPRListResult;
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
			return errorDebug(error, 'hiringRequestDAO.getAllBRPRListDAO');
		}
	},
	updateTSCNameDAO: async function (data) {
		try {
			const updateResult = await EngagementRequestAPI.updateTSCName(
				data
			);
			if (updateResult) {
				const statusCode = updateResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = updateResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return updateResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return updateResult;
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
			return errorDebug(error, 'hiringRequestDAO.updateTSCNameDAO');
		}
	},
	autoUpdateTSCNameDAO: async function (ID) {
		try {
			const updateResult = await EngagementRequestAPI.autoUpdateTSCName(
				ID
			);
			if (updateResult) {
				const statusCode = updateResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = updateResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return updateResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return updateResult;
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
			return errorDebug(error, 'hiringRequestDAO.autoUpdateTSCNameDAO');
		}
	},
	syncEngagementDAO: async function (ID) {
		try {
			const updateResult = await EngagementRequestAPI.syncEngagementRequest(
				ID
			);
			if (updateResult) {
				const statusCode = updateResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = updateResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return updateResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return updateResult;
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
			return errorDebug(error, 'hiringRequestDAO.autoUpdateTSCNameDAO');
		}
	},
	saveRenewalInitiatedDetailDAO: async function (onBoardId,renewal) {
		try {
			const updateResult = await EngagementRequestAPI.saveRenewalInitiatedDetail(
				onBoardId,renewal
			);
			if (updateResult) {
				const statusCode = updateResult['statusCode'];
				if (statusCode === HTTPStatusCode.OK) {
					const tempResult = updateResult.responseBody;
					return {
						statusCode: statusCode,
						responseBody: tempResult.details,
					};
				} else if (
					statusCode === HTTPStatusCode.NOT_FOUND ||
					statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
				)
					return updateResult;
				else if (statusCode === HTTPStatusCode.BAD_REQUEST)
					return updateResult;
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
			return errorDebug(error, 'hiringRequestDAO.saveRenewalInitiatedDetailDAO');
		}
	},
};
