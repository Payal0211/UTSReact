import { AllHiringRequestAPI, NetworkInfo, SubDomain } from 'constants/network';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { HttpServices } from 'shared/services/http/http_service';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const hiringRequestAPI = {
	getPaginatedHiringRequest: async function (hrData) {
		let httpService = new HttpServices();
		let miscData = UserSessionManagementController.getUserMiscellaneousData();
		httpService.URL = `http://3.218.6.134:9082/ViewAllHR/GetAllHiringRequests?
							Pagesize=${hrData.pageSize}&
							Pagenum=${hrData.pageNum}&
							Sortdatafield=CreatedDateTime&
							Sortorder=desc&LoggedInUserTypeID=${miscData?.loggedInUserTypeID}&
							LoggedInUserID=${miscData?.loggedInUserID}
							`;
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
		httpService.URL = 'http://3.218.6.134:9082/ViewAllHR/GetAllHiringRequests';
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
		httpService.URL = `http://3.218.6.134:9082/ViewAllHR/GetHRDetail?id=${hrid}`;
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
		httpService.URL = `http://3.218.6.134:9082/ViewAllHR/SaveHRNotes`;
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
};
