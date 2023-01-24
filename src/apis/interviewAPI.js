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
};
