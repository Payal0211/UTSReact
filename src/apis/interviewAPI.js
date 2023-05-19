import { InterviewsAPI, NetworkInfo, SubDomain } from 'constants/network';
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
				InterviewsAPI.FEEDBACK`?loggedinuserid=${miscData?.loggedInUserTypeID}`;

			httpService.setAuthRequired = true;
			httpService.setAuthToken = UserSessionManagementController.getAPIKey();
			httpService.dataToSend = clientFeedbackDetails;
			let response = await httpService.sendPostRequest();

			return response;
		} catch (error) {
			return errorDebug(error, 'InterviewAPI.updateInterviewFeedbackRequest');
		}
	},
};
