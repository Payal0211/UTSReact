import { CompanysAPI, NetworkInfo, SubDomain } from 'constants/network';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { HttpServices } from 'shared/services/http/http_service';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const CompanyAPI = {
    getCompanyDetailsRequest: async function (companyID,compURL) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.COMPANY +
			CompanysAPI.GET_DETAILS +
			`?CompanyID=${companyID}${compURL ? `&companyurl=${compURL}`  : ''}`
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'CompanyAPI.getCompanyDetailsRequest');
		}
	},
	uploadImageRequest: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			// SubDomain.COMPANY +
			CompanysAPI.UPLOAD_IMAGE ;
		httpService.setAuthRequired = true;
		httpService.dataToSend = payload;
		httpService._contentType = 'multipart/form-data'
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'CompanyAPI.uploadImageRequest');
		}
	},
	deleteCultureImageRequest: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.COMPANY +
			CompanysAPI.DELETE_CULTURE_IMAGE ;
		httpService.setAuthRequired = true;
		httpService.dataToSend = payload;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'CompanyAPI.deleteCultureImageRequest');
		}
	},
	deleteFundingRequest: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.COMPANY +
			CompanysAPI.DELETE_FUNDING ;
		httpService.setAuthRequired = true;
		httpService.dataToSend = payload;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'CompanyAPI.deleteCultureImageRequest');
		}
	},
	deleteYoutubeDetailsRequest: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.COMPANY +
			CompanysAPI.DELETE_YOUTUBE_DETAILS;
		httpService.setAuthRequired = true;
		httpService.dataToSend = payload;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'CompanyAPI.deleteYoutubeDetailsRequest');
		}
	},
	updateCompanyDetailsRequest: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.COMPANY +
			CompanysAPI.UPDATE_COMPANY_DETAILS ;
		httpService.setAuthRequired = true;
		httpService.dataToSend = payload;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'CompanyAPI.updateCompanyDetailsRequest');
		}
	},
	updateCompanyCategoryRequest: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.COMPANY +
			CompanysAPI.UPDATE_COMPANY_CATEGORY ;
		httpService.setAuthRequired = true;
		httpService.dataToSend = payload;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'CompanyAPI.updateCompanyDetailsRequest');
		}
	},
	updateCompanySubCategoryRequest: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.COMPANY +
			CompanysAPI.UPDATE_COMPANY_SUB_CATEGORY ;
		httpService.setAuthRequired = true;
		httpService.dataToSend = payload;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'CompanyAPI.updateCompanyDetailsRequest');
		}
	},
	updateCompanyGeoRequest: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.COMPANY +
			CompanysAPI.UPDATE_COMPANY_GEO ;
		httpService.setAuthRequired = true;
		httpService.dataToSend = payload;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'CompanyAPI.updateCompanyGeoRequest');
		}
	},
	removeCompanyCategoryRequest: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.COMPANY +
			CompanysAPI.REMOVE_COMPANY_CATEGORY ;
		httpService.setAuthRequired = true;
		httpService.dataToSend = payload;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'CompanyAPI.removeCompanyCategoryRequest');
		}
	},
	validateClientCompanyRequest: async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.COMPANY +
			CompanysAPI.VALIDATE_COMPANY_CLIENT  ;
		httpService.setAuthRequired = true;
		httpService.dataToSend = payload;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequestFullResponse();
			return response;
		} catch (error) {
			return errorDebug(error, 'CompanyAPI.validateClientCompanyRequest');
		}
	},
	gethrPreviewDetails:async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.COMPANY +
			CompanysAPI.PREVIEW +  `?companyId=${payload.companyId}&hrId=${payload.hrId}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'CompanyAPI.gethrPreviewDetails');
		}
	},
	createWhatsAppGroup:async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.COMPANY +
			CompanysAPI.CREATE_WHATSAPP_GROUP ;
		httpService.setAuthRequired = true;
		httpService.dataToSend = payload;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'CompanyAPI.createWhatsAppGroup');
		}
	},
	updateWhatsAppGroup:async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.COMPANY +
			CompanysAPI.UPDATE_WHATSAPP_GROUP ;
		httpService.setAuthRequired = true;
		httpService.dataToSend = payload;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'CompanyAPI.updateWhatsAppGroup');
		}
	},
	updateCompanyConfidential:async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.COMPANY +
			CompanysAPI.UPDATE_COMPANY_CONFIDENTIAL ;
		httpService.setAuthRequired = true;
		httpService.dataToSend = payload;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'CompanyAPI.updateCompanyConfidential');
		}
	},
	updateHrPreviewDetails:async function (payload) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.COMPANY +
			CompanysAPI.HR_UPDATE_PREVIEW ;
		httpService.setAuthRequired = true;
		httpService.dataToSend = payload;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'CompanyAPI.updateHrPreviewDetails');
		}
	},
}

