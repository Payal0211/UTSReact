import {
	AllHiringRequestAPI,
	HRAcceptanceAPI,
	HiringRequestsAPI,
	InterviewsAPI,
	NetworkInfo,
	SubDomain,
} from "constants/network";
import { UserSessionManagementController } from "modules/user/services/user_session_services";
import { HttpServices } from "shared/services/http/http_service";
import { makeURLParamsFromPayload } from "shared/utils/basic_utils";
import { errorDebug } from "shared/utils/error_debug_utils";

export const HiringRequestAPI = {
	getPaginatedHiringRequest: async function (hrData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.VIEW_ALL_HR +
			HiringRequestsAPI.GET_ALL_HIRING_REQUEST;
		httpService.dataToSend = hrData;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, "hiringRequestAPI.getPaginatedHiringRequest");
		}
	},
	scheduleInterview: async function (data) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.INTERVIEW +
			HiringRequestsAPI.SCHEDULE_INTERVIEW;
		httpService.dataToSend = data;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, "hiringRequestAPI.getPaginatedHiringRequest");
		}
	},
	reScheduleInterview: async function (data) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.INTERVIEW +
			HiringRequestsAPI.RESCHEDULE_INTERVIEW;
		httpService.dataToSend = data;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, "hiringRequestAPI.getPaginatedHiringRequest");
		}
	},
	getAllHiringRequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.VIEW_ALL_HR +
			HiringRequestsAPI.GET_ALL_HIRING_REQUEST;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, "hiringRequestAPI.getAllHiringRequest");
		}
	},
	getHRDetailsRequest: async function (hrid) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.VIEW_ALL_HR +
			HiringRequestsAPI.GET_HR_DETAIL +
			`?id=${hrid}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, "hiringRequestAPI.getHRDetailsRequest");
		}
	},
	sendHREditorRequest: async function (editorDetails) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.VIEW_ALL_HR +
			HiringRequestsAPI.SAVE_HR_NOTES;
		httpService.dataToSend = editorDetails;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, "hiringRequestAPI.sendHREditorRequest");
		}
	},
	sendHRPriorityForNextWeekRequest: async function (priorityDetails) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.VIEW_ALL_HR +
			AllHiringRequestAPI.SET_PRIORITY_NEXT_WEEK;
		httpService.dataToSend = priorityDetails;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				"hiringRequestAPI.sendHRPriorityForNextWeekRequest"
			);
		}
	},
	getClientDetailRequest: async function (clientEmail) {
		let httpService = new HttpServices();

		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.HIRING +
			HiringRequestsAPI.CHECK_CLIENT_EMAIL +
			`?email=${clientEmail}`;

		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, "HiringRequestAPI.getClientDetail");
		}
	},
	createHiringRequest: async function (hrData) {
		let httpService = new HttpServices();
		const miscData = UserSessionManagementController.getUserMiscellaneousData();
		console.log(miscData, "--miscData0---");
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.HIRING +
			HiringRequestsAPI.CREATE_HR +
			`?LoggedInUserId=${miscData?.loggedInUserTypeID}`;
		httpService.dataToSend = hrData;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, "HiringRequestAPI.createHiringRequest");
		}
	},
	createDebriefingRequest: async function (debriefData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.HIRING +
			SubDomain.DEBRIEFING +
			HiringRequestsAPI.CREATE_HR;
		httpService.dataToSend = debriefData;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, "HiringRequestAPI.createDebriefingRequest");
		}
	},
	getMatchmakingRequest: async function (matchMakingData) {
		let httpService = new HttpServices();
		const miscData =
			await UserSessionManagementController.getUserMiscellaneousData();

		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.HIRING +
			HiringRequestsAPI.SEARCHING_HIRING_REQUEST_DETAIL +
			`?HiringRequestId=${matchMakingData.hrID}
			&rows=${matchMakingData.rows}
			&page=${matchMakingData.page}&LoggedInUserId=${miscData?.loggedInUserTypeID}`;

		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, "HiringRequestAPI.getMatchmakingRequest");
		}
	},
	getTalentCostConversionRequest: async (talentAmount) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.MATCHMAKING +
			HiringRequestsAPI.GET_TALENT_COST_CONVERSION +
			`?amount=${talentAmount}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				"HiringRequestAPI.getTalentCostConversionRequest"
			);
		}
	},
	getTalentTechScoreCardRequest: async (talentID) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.MATCHMAKING +
			HiringRequestsAPI.GET_TALENT_TECH_SCORE_CARD +
			`?talentid=${talentID}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				"HiringRequestAPI.getTalentTechScoreCardRequest"
			);
		}
	},
	getTalentProfileSharedDetailRequest: async (talentDetails) => {
		let httpService = new HttpServices();

		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.MATCHMAKING +
			HiringRequestsAPI.GET_TALENT_PROFILE_SHARED_DETAILS +
			makeURLParamsFromPayload(talentDetails);
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				"HiringRequestAPI.getTalentTechScoreCardRequest"
			);
		}
	},
	getTalentProfileLogReqeust: async (talentDetails) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.MATCHMAKING +
			HiringRequestsAPI.GET_TALENT_PROFILE_LOG;
		httpService.setAuthRequired = true;
		httpService.dataToSend = talentDetails;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, "HiringRequestAPI.getTalentProfileLogReqeust");
		}
	},
	getAllFilterDataForHRRequest: async () => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.VIEW_ALL_HR +
			HiringRequestsAPI.GET_ALL_FILTER_DATA_FOR_HR;

		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, "HiringRequestAPI.getAllFilterDataForHRRequest");
		}
	},
	setTalentPrioritiesRequest: async (talentPrioritiesData) => {
		let httpService = new HttpServices();
		const miscData = UserSessionManagementController.getUserMiscellaneousData();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.HIRING +
			HiringRequestsAPI.SET_TALENT_PRIORITIES +
			`?LoggedInUserId=${miscData?.loggedInUserTypeID}`;
		httpService.setAuthRequired = true;
		httpService.dataToSend = talentPrioritiesData;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, "HiringRequestAPI.setTalentPrioritiesRequest");
		}
	},
	deleteHRRequest: async (deleteBody) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.HIRING + HiringRequestsAPI.DELETE;
		httpService.dataToSend = deleteBody;
		httpService.setAuthRequired = true;

		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, "HiringRequestAPI.deleteHRRequest");
		}
	},
	uploadFile: async (file) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.HIRING + HiringRequestsAPI.UPLOAD_FILE;
		httpService.dataToSend = file;
		console.log(httpService.dataToSend, "---httpservice--");
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendFileDataPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, "HiringRequestAPI.deleteHRRequest");
		}
	},
	uploadGoogleDriveFile: async (file) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.HIRING +
			HiringRequestsAPI.UPLOAD_DRIVE_FILE;
		httpService.dataToSend = file;

		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, "HiringRequestAPI.deleteHRRequest");
		}
	},
	uploadFileFromGoogleDriveLink: async (link) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.HIRING +
			HiringRequestsAPI.UPLOAD_GOOGLE_FILE_LINK +
			`?url=${link}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, "HiringRequestAPI.deleteHRRequest");
		}
	},
	updateODRPOOLStatusRequest: async (odrPoolStatus) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.VIEW_ALL_HR +
			HiringRequestsAPI.UPDATE_ODR_POOL_STATUS +
			`?HiringRequestID=${odrPoolStatus.hrID}&IsPool=${odrPoolStatus.isPool}&IsODR=${odrPoolStatus.isODR}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, "HiringRequestAPI.updateODRPOOLStatusRequest");
		}
	},
	getHRAcceptanceRequest: async (hrAcceptanceDetail) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.HR_ACCEPTANCE +
			HRAcceptanceAPI.GET_HR_ACCEPTANCE +
			`?PostID=${hrAcceptanceDetail?.postID}&TalentID=${hrAcceptanceDetail?.talentID}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, "HiringRequestAPI.getHRAcceptanceRequest");
		}
	},
	addHRAcceptanceRequest: async (hrAcceptanceDetail) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.HR_ACCEPTANCE +
			HRAcceptanceAPI.ADD_HR_ACCEPTANCE;
		httpService.dataToSend = hrAcceptanceDetail;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, "HiringRequestAPI.addHRAcceptanceRequest");
		}
	},
	openPostAcceptanceRequest: async (hrAcceptanceDetail) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.HR_ACCEPTANCE +
			HRAcceptanceAPI.OPEN_POST_ACCEPTANCE +
			`?HRDetailId=${hrAcceptanceDetail.hrDetailID}&TalentId=${hrAcceptanceDetail.talentID}`;

		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, "HiringRequestAPI.openPostAcceptanceRequest");
		}
	},
	getConfirmSlotDetailsRequest: async (interviewId) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.INTERVIEW +
			InterviewsAPI.GET_SLOT_DETAILS +
			`?InterviewMasterId=${interviewId}`;

		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.getConfirmSlotDetailsRequest');
		}
	},
	saveConfirmSlotDetailsRequest: async (data) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.INTERVIEW +
			InterviewsAPI.SAVE_CONFIRM_INTERVIEW;
		httpService.dataToSend = data;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.addHRAcceptanceRequest');
		}
	},
	convertToDirectPlacement: async (data) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.VIEW_ALL_HR +
			HiringRequestsAPI.CONVERT_DP + `?HiringRequest_ID=${data}`;
		httpService.dataToSend = data;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.addHRAcceptanceRequest');
		}
	},
	convertToContracual: async (data) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.VIEW_ALL_HR +
			HiringRequestsAPI.CONVERT_TO_CONRACUAL + `?HiringRequest_ID=${data}`;
		httpService.dataToSend = data;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.addHRAcceptanceRequest');
		}
	},
	getAllHrDetails: async (data) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.VIEW_ALL_HR +
			HiringRequestsAPI.GET_HR_DETAIL + `?id=${data}`;
		httpService.dataToSend = data;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.addHRAcceptanceRequest');
		}
	},
	getTalentDPConversion: async (data) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.VIEW_ALL_HR +
			HiringRequestsAPI.GET_TALENT_DP_CONVERSION + `?HiringRequest_ID=${data}`;
		httpService.dataToSend = data;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.addHRAcceptanceRequest');
		}
	},
	getHrDpConversion: async (data) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.VIEW_ALL_HR +
			HiringRequestsAPI.GET_HR_DP_CONVERSION + `?HiringRequest_ID=${data}`;
		httpService.dataToSend = data;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.addHRAcceptanceRequest');
		}
	},
	saveDpConversion: async (data, amount) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.VIEW_ALL_HR +
			HiringRequestsAPI.SAVE_DP_CONVERSION + `?HrId=${data}&DPAmount=${amount}`;
		httpService.dataToSend = data;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.addHRAcceptanceRequest');
		}
	},
	getHrConvertToContractualInfo: async function (hrid) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.VIEW_ALL_HR +
			HiringRequestsAPI.CONVERT_TO_CONTRACTUAL +
			`?HiringRequest_ID=${hrid}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, "hiringRequestAPI.getHRDetailsRequest");
		}
	},
	saveHrConvertToContractualInfo: async function (hrid, percentage) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.VIEW_ALL_HR +
			HiringRequestsAPI.SAVE_CONVERT_TO_CONTRACTUAL +
			`?HrID=${hrid}&NRpercentage=${percentage}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, "hiringRequestAPI.getHRDetailsRequest");
		}
	},
	saveTalentDpConversion: async function (data) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.VIEW_ALL_HR +
			HiringRequestsAPI.SAVE_TALENT_DP_CONVERSION
		httpService.dataToSend = data;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, "hiringRequestAPI.getHRDetailsRequest");
		}
	},
	calculateDpConversionCost: async function (hrid, contactPriorityId, dpPercentage, talentExpectedCTC) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.VIEW_ALL_HR +
			HiringRequestsAPI.CALCULATE_DP_CONVERSION_COST +
			`?HR_ID=${hrid}&ContactPriorityID=${contactPriorityId}&DPPercentage=${dpPercentage}&TalentExpectedCTC=${talentExpectedCTC}`;

		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, "hiringRequestAPI.getHRDetailsRequest");
		}
	},
	// httpService.setAuthRequired = true;
	// httpService.setAuthToken = UserSessionManagementController.getAPIKey();
	// try {
	// 	let response = await httpService.sendGetRequest();
	// 	return response;
	// } catch(error) {
	// 	return errorDebug(error, "HiringRequestAPI.getConfirmSlotDetailsRequest");
	// }

	saveConfirmSlotDetailsRequest: async (data) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.INTERVIEW +
			InterviewsAPI.SAVE_CONFIRM_INTERVIEW;
		httpService.dataToSend = data;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, "HiringRequestAPI.addHRAcceptanceRequest");
		}
	},
	convertToDirectPlacement: async (data) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.INTERVIEW +
			InterviewsAPI.CONVERT_DP +
			`?HiringRequest_ID=${data}`;
		httpService.dataToSend = data;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, "HiringRequestAPI.addHRAcceptanceRequest");
		}
	},
	saveTalentContracual: async (data) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.VIEW_ALL_HR +
			HiringRequestsAPI.SAVE_TALENT_CONTRACTUAL;
		httpService.dataToSend = data;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, "HiringRequestAPI.addHRAcceptanceRequest");
		}
	},
	calculateHRConst: async (hrid, priorityId, hrcost, percentageid) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.VIEW_ALL_HR +
			HiringRequestsAPI.CALCULATE_HR_COST +
			`?HR_ID=${hrid}&ContactPriorityID=${priorityId}&Hr_Cost=${hrcost}&HR_Percentage=${percentageid}`;
		// httpService.dataToSend = data;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, "HiringRequestAPI.addHRAcceptanceRequest");
		}
	},
	getTelentsContractualConversion: async (data) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.VIEW_ALL_HR +
			HiringRequestsAPI.GET_HR_CONTARCTUAL +
			`?HiringRequest_ID=${data}`;
		// httpService.dataToSend = data;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, "HiringRequestAPI.addHRAcceptanceRequest");
		}
	},
};
