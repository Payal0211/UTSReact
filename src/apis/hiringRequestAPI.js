import {
	AMAssignmentAPI,
	AllHiringRequestAPI,
	HRAcceptanceAPI,
	HiringRequestsAPI,
	InterviewsAPI,
	NetworkInfo,
	SubDomain,
	ClientsAPI,
	TalentStatus
} from 'constants/network';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { HttpServices } from 'shared/services/http/http_service';
import { makeURLParamsFromPayload } from 'shared/utils/basic_utils';
import { errorDebug } from 'shared/utils/error_debug_utils';


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
			return errorDebug(error, 'hiringRequestAPI.getPaginatedHiringRequest');
		}
	},
	getAllUnassignedHiringRequest: async function (hrData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.VIEW_ALL_HR +
			HiringRequestsAPI.GET_ALL_UNASSIGNED_HIRING_REQUEST;
		httpService.dataToSend = hrData;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'hiringRequestAPI.getAllUnassignedHiringRequest');
		}
	},
	assignedPOCForUnassignHRS: async function (hrData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.VIEW_ALL_HR +
			HiringRequestsAPI.ASSIGNED_POC_FOR_UNASSIGNED_HRS;
		httpService.dataToSend = hrData;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'hiringRequestAPI.assignedPOCForUnassignHRS');
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
			return errorDebug(error, 'hiringRequestAPI.getPaginatedHiringRequest');
		}
	},
	fetchrepostDetailsRequest:async function (HRID) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.HIRING +
			HiringRequestsAPI.HRDETAILSFORSHORTLISTED + `?hrid=${HRID}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'hiringRequestAPI.closeJobLogs');
		}
	},
	closeJobLogs:async function (data) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.HIRING +
			HiringRequestsAPI.CLOSE_ACTION_History + `?hrId=${data}`;
		httpService.dataToSend = data;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'hiringRequestAPI.closeJobLogs');
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
			return errorDebug(error, 'hiringRequestAPI.getPaginatedHiringRequest');
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
			return errorDebug(error, 'hiringRequestAPI.getAllHiringRequest');
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
			return errorDebug(error, 'hiringRequestAPI.getHRDetailsRequest');
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
			return errorDebug(error, 'hiringRequestAPI.sendHREditorRequest');
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
				'hiringRequestAPI.sendHRPriorityForNextWeekRequest',
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
			return errorDebug(error, 'HiringRequestAPI.getClientDetail');
		}
	},
	getLoginHrInfoRequest: async function () {
		let httpService = new HttpServices();

		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.HIRING +
			HiringRequestsAPI.GET_lOGIN_HR_INFO ;

		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.getLoginHrInfoRequest');
		}
	},
	createHiringRequest: async function (hrData) {
		let httpService = new HttpServices();
		const miscData = UserSessionManagementController.getUserMiscellaneousData();

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
			return errorDebug(error, 'HiringRequestAPI.createHiringRequest');
		}
	},
	createDirectHiringRequest: async function (hrData) {
		let httpService = new HttpServices();

		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.DIRECT_HR +
			HiringRequestsAPI.CREATE_HR 
		httpService.dataToSend = hrData;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.createDirectHiringRequest');
		}
	},
	createDirectDebriefingRequest: async function (hrData) {
		let httpService = new HttpServices();

		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.DIRECT_HR +
			HiringRequestsAPI.CREATE_DEBRIEFING
		httpService.dataToSend = hrData;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.createDirectDebriefingRequest');
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
			return errorDebug(error, 'HiringRequestAPI.createDebriefingRequest');
		}
	},
	createAIJDRequest: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.HIRING +
			HiringRequestsAPI.DONT_HAVE_JD;
		httpService.dataToSend = payload;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.createAIJDRequest');
		}
	},
	getMatchmakingRequest: async function (matchMakingData) {
		let httpService = new HttpServices();
		// const miscData =
		// 	await UserSessionManagementController.getUserMiscellaneousData();
		const emailURL =
			matchMakingData?.emailID && matchMakingData?.emailID;
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.HIRING +
			HiringRequestsAPI.SEARCHING_HIRING_REQUEST_DETAIL;
		// `?HiringRequestId=${matchMakingData.hrID}
		// &rows=${matchMakingData.rows}
		// &page=${matchMakingData.page}&LoggedInUserId=${miscData?.loggedInUserTypeID}` +
		// emailURL;
		const formattedData = {
			HiringRequestId: parseInt(matchMakingData?.hrID),
			rows: matchMakingData?.rows,
			page: matchMakingData?.page,
			EmailId: emailURL ? emailURL : null,
		};

		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		httpService.dataToSend = formattedData;
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.getMatchmakingRequest');
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
				'HiringRequestAPI.getTalentCostConversionRequest',
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
				'HiringRequestAPI.getTalentTechScoreCardRequest',
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
				'HiringRequestAPI.getTalentTechScoreCardRequest',
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
			return errorDebug(error, 'HiringRequestAPI.getTalentProfileLogReqeust');
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
			return errorDebug(error, 'HiringRequestAPI.getAllFilterDataForHRRequest');
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
			return errorDebug(error, 'HiringRequestAPI.setTalentPrioritiesRequest');
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
			return errorDebug(error, 'HiringRequestAPI.deleteHRRequest');
		}
	},
	uploadFile: async (file) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.HIRING + HiringRequestsAPI.UPLOAD_FILE + `?clientEmail=${file.get('clientemail')} ${file.get('hrid') ? `&hrid=${file.get('hrid')}` : '' }`;
		httpService.dataToSend = file;

		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendFileDataPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.deleteHRRequest');
		}
	},
	getDetailsFromTextAPI: async (payload,email) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.HIRING + HiringRequestsAPI.DETAIL_FROM_TEXT + `?clientEmail=${email}`;
		httpService.dataToSend = payload;

		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.deleteHRRequest');
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
			return errorDebug(error, 'HiringRequestAPI.deleteHRRequest');
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
			return errorDebug(error, 'HiringRequestAPI.deleteHRRequest');
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
			return errorDebug(error, 'HiringRequestAPI.updateODRPOOLStatusRequest');
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
			return errorDebug(error, 'HiringRequestAPI.getHRAcceptanceRequest');
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
			return errorDebug(error, 'HiringRequestAPI.addHRAcceptanceRequest');
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
			return errorDebug(error, 'HiringRequestAPI.openPostAcceptanceRequest');
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
			HiringRequestsAPI.CONVERT_DP +
			`?HiringRequest_ID=${data}`;
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
			HiringRequestsAPI.CONVERT_TO_CONRACUAL +
			`?HiringRequest_ID=${data}`;
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
			HiringRequestsAPI.GET_HR_DETAIL +
			`?id=${data}`;
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
			HiringRequestsAPI.GET_TALENT_DP_CONVERSION +
			`?HiringRequest_ID=${data}`;
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
			HiringRequestsAPI.GET_HR_DP_CONVERSION +
			`?HiringRequest_ID=${data}`;
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
			HiringRequestsAPI.SAVE_DP_CONVERSION +
			`?HrId=${data}&DPAmount=${amount}`;
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
			return errorDebug(error, 'hiringRequestAPI.getHRDetailsRequest');
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
			return errorDebug(error, 'hiringRequestAPI.getHRDetailsRequest');
		}
	},
	saveTalentDpConversion: async function (data) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.VIEW_ALL_HR +
			HiringRequestsAPI.SAVE_TALENT_DP_CONVERSION;
		httpService.dataToSend = data;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'hiringRequestAPI.getHRDetailsRequest');
		}
	},
	calculateDpConversionCost: async function (
		hrid,
		contactPriorityId,
		dpPercentage,
		talentExpectedCTC,
	) {
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
			return errorDebug(error, 'hiringRequestAPI.getHRDetailsRequest');
		}
	},

	// saveConfirmSlotDetailsRequest: async (data) => {
	// 	let httpService = new HttpServices();
	// 	httpService.URL =
	// 		NetworkInfo.NETWORK +
	// 		SubDomain.INTERVIEW +
	// 		InterviewsAPI.SAVE_CONFIRM_INTERVIEW;
	// 	httpService.dataToSend = data;
	// 	httpService.setAuthRequired = true;
	// 	httpService.setAuthToken = UserSessionManagementController.getAPIKey();
	// 	try {
	// 		let response = await httpService.sendPostRequest();
	// 		return response;
	// 	} catch (error) {
	// 		return errorDebug(error, 'HiringRequestAPI.addHRAcceptanceRequest');
	// 	}
	// },
	// convertToDirectPlacement: async (data) => {
	// 	let httpService = new HttpServices();
	// 	httpService.URL =
	// 		NetworkInfo.NETWORK +
	// 		SubDomain.INTERVIEW +
	// 		InterviewsAPI.CONVERT_DP +
	// 		`?HiringRequest_ID=${data}`;
	// 	httpService.dataToSend = data;
	// 	httpService.setAuthRequired = true;
	// 	httpService.setAuthToken = UserSessionManagementController.getAPIKey();
	// 	try {
	// 		let response = await httpService.sendPostRequest();
	// 		return response;
	// 	} catch (error) {
	// 		return errorDebug(error, 'HiringRequestAPI.addHRAcceptanceRequest');
	// 	}
	// },
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
			return errorDebug(error, 'HiringRequestAPI.addHRAcceptanceRequest');
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
			return errorDebug(error, 'HiringRequestAPI.addHRAcceptanceRequest');
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
			return errorDebug(error, 'HiringRequestAPI.addHRAcceptanceRequest');
		}
	},
	acceptHRRequest: async (data) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.HIRING + HiringRequestsAPI.HRAccept;
		httpService.dataToSend = data;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.acceptHRRequest');
		}
	},
	syncUTSTOATS: async (hrID) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.HIRING + HiringRequestsAPI.SYNC_HR_UTS_TO_ATS + `?HRid=${hrID}`;
		httpService.dataToSend = {};
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.syncUTSTOATS');
		}
	},
	deleteHRRequestAPI: async (hrID) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.HIRING + HiringRequestsAPI.DELETE_TEST_HR + `?hrId=${hrID}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.deleteHRRequestAPI');
		}
	},
	getRemainingPriorityCount: async () => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.VIEW_ALL_HR +
			HiringRequestsAPI.GET_REMAINING_PRIORITY_COUNT;

		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.getRemainingPriorityCount');
		}
	},
	setHrPriority: async (star, hrid, salesperson) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.VIEW_ALL_HR +
			HiringRequestsAPI.SET_HR_PRIORITY +
			`?IsNextWeekStarMarked=${star}&HiringRequestID=${hrid}&SalesPerson=${salesperson}`;

		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.setHrPriority');
		}
	},
	calculateHRCostRequest: async (calculateHRData) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.VIEW_ALL_HR +
			HiringRequestsAPI.CALCULATE_HR_COST +
			`?HR_ID=${calculateHRData?.hrID}&ContactPriorityID=${calculateHRData?.ContactPriorityID}&Hr_Cost=${calculateHRData?.Hr_Cost}&HR_Percentage=${calculateHRData?.HR_Percentage}`;

		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.openPostAcceptanceRequest');
		}
	},
	updateHRCostRequest: async (saveBillRatePayload) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.VIEW_ALL_HR +
			HiringRequestsAPI.UPDATE_HR_COST +
			`?ContactPriorityID=${saveBillRatePayload?.ContactPriorityID}&Hr_Cost=${saveBillRatePayload?.Hr_Cost}&HR_Percentage=${saveBillRatePayload?.HR_Percentage}`;

		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.openPostAcceptanceRequest');
		}
	},
	getHRCostDetailsRequest: async (hrCostData) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.VIEW_ALL_HR +
			HiringRequestsAPI.GET_HR_COST_DETAILS +
			`?HR_ID=${hrCostData?.hrID}&ContactPriorityID=${hrCostData?.ContactPriorityID}&BillRate=${hrCostData?.BillRate}&PayRate=${hrCostData?.PayRate}`;

		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.openPostAcceptanceRequest');
		}
	},
	updateTalentFeesRequest: async (savePayRatePayload) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.VIEW_ALL_HR +
			HiringRequestsAPI.UPDATE_TALENT_FEES +
			`?ContactPriorityID=${savePayRatePayload?.ContactPriorityID}&Cost_AfterAcceptance=${savePayRatePayload?.talentFees}`;

		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.openPostAcceptanceRequest');
		}
	},
	getAMDataSendRequest: async (talentDetails) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.AM_ASSIGNMENT +
			AMAssignmentAPI.AM_DATA_SEND +
			`?Onboard_ID=${talentDetails?.onboardID}&EngagemenID=${talentDetails?.engagementID}`;

		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.getAMDataSendRequest');
		}
	},
	viewHRDetailsRequest: async (HRId) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.HIRING +
			HiringRequestsAPI.VIEW_HR_DETAILS +
			`?HRId=${HRId}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.openPostAcceptanceRequest');
		}
	},
	getNewHRDetailsRequest: async (hrId) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.HIRING +
			HiringRequestsAPI.GET_HR_DETAILS +
			`?HRId=${hrId}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.updateODRPOOLStatusRequest');
		}
	},
	getNewDealHRDetailsRequest: async (DId) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.HIRING +
			HiringRequestsAPI.GET_HR_DETAILS +
			`?HRId=0&DealID=${DId}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.getNewDealHRDetailsRequest');
		}
	},
	editTR: async (data) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.VIEW_ALL_HR +
			HiringRequestsAPI.UPDATE_TR_DETAIL;
		httpService.dataToSend = data;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.editTR');
		}
	},
	deleteInterviewRequest: async (interviewDetails) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.HIRING +
			HiringRequestsAPI.DELETE_INTERVIEW_DETAILS +
			`?Id=${interviewDetails?.interviewID}
			&HRId=${interviewDetails?.hrID}
			&InterviewerName=${interviewDetails?.name}`;

		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.deleteInterviewRequest');
		}
	},
	closeHRValidation: async (id) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.HIRING +
			HiringRequestsAPI.CLOSE_HR_VALIDATION +
			`?hrId=${id}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.closeHRValidation');
		}
	},
	closeHRWarning: async (id) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.HIRING +
			HiringRequestsAPI.CLOSE_HR_WARNING +
			`?HR_ID=${id}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.closeHRWarning');
		}
	},
	closeHR: async (data) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.HIRING + HiringRequestsAPI.CLOSE_HR;
		httpService.dataToSend = data;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.CloseHR');
		}
	},
	reopeneHR: async (data) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.HIRING + HiringRequestsAPI.REOPEN_HR + `?hrID=${data.hrID}${data.updatedTR ? '&updatedTR='+data.updatedTR : ''}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.reopeneHR');
		}
	},
	updateHRCategoryRequest: async (data) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.VIEW_ALL_HR + HiringRequestsAPI.UPDATE_HR_CATEGORY+ `?hrid=${data.hrID}&category=${data.category}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.updateHRCategoryRequest');
		}
	},
	hrDpAmounts: async (data) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.VIEW_ALL_HR + HiringRequestsAPI.GET_HR_DP_AMOUNT_DETAILS + `?hrID=${data.hrID}&contactPriorityID=${data.contactPriorityID}&talentId=${data.talentId}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.hrDpAmounts');
		}
	},
	updateDpAmounts: async (data) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.VIEW_ALL_HR + HiringRequestsAPI.UPDATE_DP_AMOUNT ;
		httpService.setAuthRequired = true;
		httpService.dataToSend = data;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.updateDPAmount');
		}
	},
	getHRSLADetails: async (hrID) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.VIEW_ALL_HR + HiringRequestsAPI.GET_HR_SLA_DETAILS + `?HRID=${hrID}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.getHRSLADetails');
		}
	},
	getAMDetails: async (data) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.CLIENT+ ClientsAPI.GET_AM_DETAIL + `?companyID=${data.companyID}&clientID=${data.clientID}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.getAMDetails');
		}
	},
	updateAMNameDate: async (data) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.CLIENT+ ClientsAPI.UPDATE_AM_FOR_COMPANY ;
		httpService.setAuthRequired = true;
		httpService.dataToSend = data
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.updateAMNameDate');
		}
	},
	updateSLADate: async (data) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.VIEW_ALL_HR + HiringRequestsAPI.UPDATE_SLA_DATE ;
		httpService.setAuthRequired = true;
		httpService.dataToSend = data
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.updateSLADate');
		}
	},
	WSJOBSLA: async (ID) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + `WebSocket/SLAJobData?HRID=${ID}` ;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.WSJOBSLA');
		}
	},
	extractTextUsingPythonApi : async (data) => {
		let httpService = new HttpServices();
		httpService.URL = NetworkInfo.NETWORK + SubDomain.HIRING +  HiringRequestsAPI.EXTRACTTEXTUSINGPYTHON +`?clientEmail=${data.clientEmail}&psUrl=${data.psUrl}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error,'HiringRequestAPI.extractTextUsingPythonApi');
		}
	},
	getSalesUsersWithHeadAfterHrCreate : async (hrid) => {
		let httpService = new HttpServices();
		httpService.URL = NetworkInfo.NETWORK + SubDomain.HIRING +  HiringRequestsAPI.GET_SALES_USER_WITH_HEAD_AFTER_HRCREATE +`?HRID=${hrid}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error,'HiringRequestAPI.getSalesUsersWithHeadAfterHrCreate');
		}
	},
	getActionhistory : async (data) => {
		let httpService = new HttpServices();
		httpService.URL = NetworkInfo.NETWORK + SubDomain.HIRING +  HiringRequestsAPI.GET_ACTION_UPDATES +`?HRId=${data.hrID}&HistoryID=${data.historyID}&DetailHistoryID=${data.detailHisoryID}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error,'HiringRequestAPI.getSalesUsersWithHeadAfterHrCreate');
		}
	},
	addMemberToGspace : async (data) => {
		let httpService = new HttpServices();
		httpService.URL = NetworkInfo.network + SubDomain.MEMBER;
		httpService.setAuthRequired = true;
		httpService.dataToSend = data
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error,'HiringRequestAPI.addMemberToGspace');
		}
	},

	cloneHRToDemoAccount: async (data) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.HIRING + HiringRequestsAPI.CLONE_HR_DEMO_ACCOUNT ;
		httpService.setAuthRequired = true;
		httpService.dataToSend = data
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.cloneHRToDemoAccount');
		}
	},
	addDeleteNotesDataAPI: async (data) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.HIRING + HiringRequestsAPI.ADD_DELETE_NOTES_DATA ;
		httpService.setAuthRequired = true;
		httpService.dataToSend = data
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.addDeleteNotesDataAPI');
		}
	},
	getTalentNotesAPI: async (data) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.ATS_NETWORK+ HiringRequestsAPI.NOTE_LIST ;
		httpService.setAuthRequired = true;
		httpService.dataToSend = data
		httpService.setAuthToken = NetworkInfo.ATS_TOKEN;
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.getTalentNotesAPI');
		}
	},
	saveTalentNotesAPI: async (data) => {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.ATS_NETWORK+ HiringRequestsAPI.SAVE_NOTES;
		httpService.setAuthRequired = true;
		httpService.dataToSend = data
		httpService.setAuthToken = NetworkInfo.ATS_TOKEN;
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'HiringRequestAPI.saveTalentNotesAPI');
		}
	},
	getHRActivityUsingPagination: async function (hrData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.VIEW_ALL_HR +
			HiringRequestsAPI.GET_HR_ACTIVITY_PAGINATION;
		httpService.dataToSend = hrData;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'hiringRequestAPI.getHRActivityUsingPagination');
		}
	},
	getHRTalentUsingPagination:async function (hrData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.VIEW_ALL_HR +
			HiringRequestsAPI.GET_HR_TALENT_PAGINATION;
		httpService.dataToSend = hrData;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'hiringRequestAPI.getHRActivityUsingPagination');
		}
	},
	getRejectionReasonForTalent:async function (data) {
		let httpService = new HttpServices();
		httpService.URL = NetworkInfo.NETWORK + SubDomain.TALENT_STATUS + TalentStatus.GET_REJECTION_REASON_FOR_TALENT + `?hrId=${data?.hrId}&rejectionReasonID=${data?.rejectionId}&atsTalentID=${data?.atsTalentId}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error,'HiringRequestAPI.getRejectionReasonForTalent');
		}
	}

	// getChannelLibraryApi: async (data) => {
	// 	let httpService = new HttpServices();
	// 	httpService.URL =
	// 		NetworkInfo.NETWORK +SubDomain.VIEW_ALL_HR +
	// 		HiringRequestsAPI.GET_CHANNEL_LIBRARY + `?Type=${data.type}&ChannelID=${data.channelID}` ;
	// 	httpService.setAuthRequired = true;
	// 	httpService.setAuthToken = UserSessionManagementController.getAPIKey();
	// 	try {
	// 		let response = await httpService.sendGetRequest();
	// 		return response;
	// 	} catch (error) {
	// 		return errorDebug(error, 'HiringRequestAPI.getChannelLibraryApi');
	// 	}
	// },
};
