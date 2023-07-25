import {
	InterviewersAPI,
	InterviewsAPI,
	NetworkInfo,
	SubDomain,
} from 'constants/network';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { HttpServices } from 'shared/services/http/http_service';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const InterviewAPI = {
	getInterviewListRequest: async (interviewData) => {
		try {
			let httpService = new HttpServices();
			httpService.URL =
				NetworkInfo.NETWORK +
				SubDomain.INTERVIEW +
				InterviewsAPI.LIST +
				`?pagenumber=${interviewData?.pageNumber}&totalrecord=${interviewData?.totalRecord}`;
			httpService.setAuthRequired = true;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'InterviewAPI.getInterviewListRequest');
		}
	},
	getInterviewStatusDetailsRequest: async (interviewDetails) => {
		try {
			let httpService = new HttpServices();
			httpService.URL =
				NetworkInfo.NETWORK +
				SubDomain.INTERVIEW +
				InterviewsAPI.INTERVIEW_STATUS_DETAILS +
				`?SelectedInterviewId=${interviewDetails.interviewStatusID}`;
			httpService.setAuthRequired = true;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'InterviewAPI.getInterviewStatusDetailsRequest');
		}
	},
	updateInterviewStatus: async (interviewDetails) => {
		try {
			let httpService = new HttpServices();
			httpService.URL =
				NetworkInfo.NETWORK +
				SubDomain.INTERVIEW +
				InterviewsAPI.UPDATE_INTERVIEW_STATUS;
			httpService.setAuthRequired = true;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			httpService.dataToSend = interviewDetails;
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'InterviewAPI.updateInterviewStatus');
		}
	},
	updateInterviewFeedbackRequest: async (clientFeedbackDetails) => {
		try {
			let httpService = new HttpServices();
			const miscData =
				UserSessionManagementController.getUserMiscellaneousData();
			httpService.URL =
				NetworkInfo.NETWORK +
				SubDomain.INTERVIEW +
				InterviewsAPI.FEEDBACK +
				`?loggedinuserid=${miscData?.loggedInUserTypeID}`;

			httpService.setAuthRequired = true;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			httpService.dataToSend = clientFeedbackDetails;
			let response = await httpService.sendPostRequest();

			return response;
		} catch (error) {
			return errorDebug(error, 'InterviewAPI.updateInterviewFeedbackRequest');
		}
	},
	getClientFeedbackRequest: async (clientFeebackDetails) => {
		try {
			let httpService = new HttpServices();

			httpService.URL =
				NetworkInfo.NETWORK +
				SubDomain.INTERVIEW +
				InterviewsAPI.GET_CLIENT_FEEDBACK +
				`?ClientFeedbackId=${clientFeebackDetails?.clientFeedbackID}`;
			httpService.setAuthRequired = true;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'InterviewAPI.getClientFeedbackRequest');
		}
	},
	ClientCurrentDetailsForAnotherRoundRequest: async (clientDetails) => {
		try {
			let httpService = new HttpServices();

			httpService.URL =
				NetworkInfo.NETWORK +
				SubDomain.INTERVIEW +
				InterviewsAPI.CLIENT_CURRENT_DETAILS_FOR_ANOTHER_ROUND +
				`?HiringRequestID=${clientDetails?.hiringRequestID}`;
			httpService.setAuthRequired = true;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				'InterviewAPI.ClientCurrentDetailsForAnotherRoundRequest',
			);
		}
	},
	saveAnotherRoundFeedbackRequest: async (clientDetails) => {
		try {
			let httpService = new HttpServices();
			httpService.URL =
				NetworkInfo.NETWORK +
				SubDomain.INTERVIEW +
				InterviewsAPI.SAVE_ANOTHER_ROUND_FEEDBACK;
			httpService.setAuthRequired = true;
			httpService.dataToSend = clientDetails;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'InterviewAPI.saveAnotherRoundFeedbackRequest');
		}
	},
	CheckLinkedinURLRequest: async (clientDetails) => {
		try {
			let httpService = new HttpServices();
			httpService.URL =
				NetworkInfo.NETWORK +
				SubDomain.INTERVIEWER +
				InterviewersAPI.CHECK_LINKEDIN_URL +
				`?linkedinurl=${clientDetails?.linkedinURL}&Hr_DetailID=${clientDetails?.HRDetailID}`;
			httpService.setAuthRequired = true;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'InterviewAPI.CheckLinkedinURLRequest');
		}
	},
	CheckInterviewerEmailIdRequest: async (clientDetails) => {
		try {
			let httpService = new HttpServices();
			httpService.URL =
				NetworkInfo.NETWORK +
				SubDomain.INTERVIEWER +
				InterviewersAPI.CHECK_INTERVIEWER_EMAILID +
				`?EmailId=${clientDetails?.emailID}&Hr_DetailID=${clientDetails?.HRDetailID}`;
			httpService.setAuthRequired = true;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'InterviewAPI.CheckInterviewerEmailIdRequest');
		}
	},
	CheckInterviewTimeSlotRequest: async (clientDetails) => {
		try {
			let httpService = new HttpServices();
			httpService.URL =
				NetworkInfo.NETWORK + `interview/ValidateInterviewTimeSlots`;
			httpService.setAuthRequired = true;
			httpService.dataToSend = clientDetails
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'InterviewAPI.CheckInterviewTimeSlotRequest');
		}
	},
};
