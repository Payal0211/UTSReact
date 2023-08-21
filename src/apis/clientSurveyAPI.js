import { ClientHappinessSurvey, EngagementAPI, NetworkInfo, SubDomain } from "constants/network";
import { UserSessionManagementController } from "modules/user/services/user_session_services";
import { HttpServices } from "shared/services/http/http_service";
import { errorDebug } from "shared/utils/error_debug_utils";

export const ClientHappinessSurveyRequestAPI = {
	getClientSurveyList: async function (data,isExport) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.CLIENT +
            ClientHappinessSurvey.GET_CLIENT_HAPPINESS_SURVEY_LIST+
			ClientHappinessSurvey.LIST+ `?IsExportToExcel=${isExport}` ;
		httpService.dataToSend = data;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest(data);
			return response;
		} catch (error) {
			return errorDebug(error, 'ClientHappinessSurveyRequestAPI.getClientSurveyList');
		}
	},

	getAutoCompleteCompany:async function (data) {
		let httpService = new HttpServices();
		httpService.URL = NetworkInfo.NETWORK + SubDomain.CLIENT + ClientHappinessSurvey.GET_AUTO_COMPLETE_COMPANY+ClientHappinessSurvey.GET_COMPANY + `?Search=${data}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error,'ClientHappinessSurveyRequestAPI.getAutoCompleteCompany');
		}	
	},
	
	sendEmailForFeedback:async function (data){
		let httpService = new HttpServices();
		const miscellaneousData =
			UserSessionManagementController.getUserMiscellaneousData();
		httpService.URL = NetworkInfo.NETWORK + SubDomain.CLIENT + ClientHappinessSurvey.SEND_EMAIL_FOR_FEEDBACK+`?feedbackID=${data}&LoggedInUserId=${miscellaneousData?.loggedInUserTypeID}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest(data);
			return response;
		} catch (error) {
			return errorDebug(error,'ClientHappinessSurveyRequestAPI.sendEmailForFeedback');
		}
	}, 

	saveClientHappinessSurveys:async function (data){
		let httpService = new HttpServices();
		const miscellaneousData =
			UserSessionManagementController.getUserMiscellaneousData();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.CLIENT +
            ClientHappinessSurvey.SAVE_CLIENT_HAPPINESS_SURVEYS+`?LoggedInUserId=${miscellaneousData?.loggedInUserTypeID}`;
			
		httpService.dataToSend = data;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest(data);
			return response;
		} catch (error) {
			return errorDebug(error, 'ClientHappinessSurveyRequestAPI.saveClientHappinessSurveys');
		}
	},

	ClientHappinessSurveysOption:async function () {
		let httpService = new HttpServices();
		httpService.URL = NetworkInfo.NETWORK + SubDomain.CLIENT + ClientHappinessSurvey.CLIENT_HAPPINESS_SURVEY_OPTION;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error,'ClientHappinessSurveyRequestAPI.getAutoCompleteCompany');
		}
	}
};