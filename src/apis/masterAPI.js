import { MastersAPI, NetworkInfo, SubDomain } from 'constants/network';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { HttpServices } from 'shared/services/http/http_service';
import { errorDebug } from 'shared/utils/error_debug_utils';

export const MasterAPI = {
	getFixedValueRequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.MASTERS + MastersAPI.GET_FIXED_VALUE;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getFixedValueRequest');
		}
	},
	getGEORequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.MASTERS + MastersAPI.GET_GEO;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getGEORequest');
		}
	},
	getSkillsRequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.MASTERS + MastersAPI.GET_SKILLS;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getSkillsRequest');
		}
	},
	getCurrencyRequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.MASTERS + MastersAPI.GET_CURRENCY;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getCurrencyRequest');
		}
	},
	getTalentTimeZoneRequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.MASTERS + MastersAPI.GET_TALENT_TIME_ZONE;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getTalentTimeZoneRequest');
		}
	},
	getHowSoonRequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.MASTERS + MastersAPI.GET_HOW_SOON;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getHowSoonRequest');
		}
	},
	getTimeZonePreferenceRequest: async function (timeZoneID) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.MASTERS +
			MastersAPI.GET_TIME_ZONE_PREFERENCE +
			`?timezoneid=${timeZoneID}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getTimeZonePreferenceRequest');
		}
	},
	getTimeZoneRequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.MASTERS + MastersAPI.GET_TIME_ZONE;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getTimeZoneRequest');
		}
	},
	getPartialEngagementTypeRequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.MASTERS +
			MastersAPI.GET_PARTIAL_ENGAGEMENT_TYPE;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getPartialEngagementTypeRequest');
		}
	},
	getTalentsRoleRequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.MASTERS +
			MastersAPI.GET_TALENTS_ROLE_REQUEST;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getTalentsRoleRequest');
		}
	},
	getCodeAndFlagRequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.MASTERS + MastersAPI.GET_CODE_AND_FLAG;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MastersAPI.getCodeAndFlagRequest');
		}
	},
	uploadFileRequest: async function (fileData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.MASTERS + MastersAPI.FILE_UPLOAD;
		httpService.setAuthRequired = true;
		httpService.dataToSend = fileData && fileData;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.fileUploadRequest');
		}
	},
	getSalesManRequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.MASTERS + MastersAPI.Get_SALESMAN;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getSalesManRequest');
		}
	},
	getHRDeleteReasonRequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.MASTERS + MastersAPI.GET_HR_DELETE_REASON;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getHRDeleteReasonRequest');
		}
	},
	getRegionsRequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.MASTERS + MastersAPI.GET_REGIONS;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getRegionsRequest');
		}
	},
	getModeOfWorkRequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.MASTERS + MastersAPI.GET_MODE_OF_WORK;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getModeOfWork');
		}
	},
	getCountryRequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.MASTERS + MastersAPI.GET_COUNTRY;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getCountryRequest');
		}
	},

	getUserTypeRequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.MASTERS + MastersAPI.GET_USER_TYPE;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getUserTypeRequest');
		}
	},
	getTeamManagerRequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.MASTERS + MastersAPI.GET_TEAM_MANAGER;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getTeamManagerRequest');
		}
	},
	getUserByTypeRequest: async function (userType) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.MASTERS +
			MastersAPI.GET_USER_BY_TYPE +
			'?userType=' +
			userType?.typeID;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getUserByTypeRequest');
		}
	},

	getReporteeTeamManagerRequest: async function (userType) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.MASTERS +
			MastersAPI.GET_REPORTEE_MANAGER +
			'?userType=' +
			userType?.typeID;

		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getReporteeTeamManagerRequest');
		}
	},
	getEmailSuggestionRequest: async function (email) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.HIRING +
			MastersAPI.GET_EMAIL_SUGGESTION +
			`?search=${email}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getEmailSuggestionRequest');
		}
	},
	getBDRMarketingBasedOnUserTypeRequest: async function (userType) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.MASTERS +
			MastersAPI.GET_BDR_MARKETING_BASED_ON_USER_TYPE +
			'?RoleID=' +
			userType?.roleID;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				'MasterAPI.getBDRMarketingBasedOnUserTypeRequest',
			);
		}
	},
	getTeamManagerBasedOnUserTypeRequest: async function (userType) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.MASTERS +
			MastersAPI.GET_TEAM_MANAGER_BASED_ON_USER_TYPE +
			'?UserTypeID=' +
			userType?.userTypeID;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				'MasterAPI.getTeamManagerBasedOnUserTypeRequest',
			);
		}
	},
	getNRMarginRequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.MASTERS + MastersAPI.GET_NR_MARGIN;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getNRMarginRequest');
		}
	},
	getOtherSkillsRequest: async function (skillsData) {
		let httpService = new HttpServices();
		let miscData = UserSessionManagementController.getUserMiscellaneousData();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.MASTERS +
			MastersAPI.ADD_OTHER_SKILL +
			`?skillname=${skillsData?.skillName}&LoggedInUserId=${miscData?.loggedInUserTypeID}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getOtherSkillsRequest');
		}
	},
	getOtherRoleRequest: async function (roleData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.MASTERS +
			MastersAPI.CHECK_OTHER_ROLE +
			`?rolename=${roleData?.roleName}&RoleId=${roleData?.roleID}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getOtherRoleRequest');
		}
	},
	getContractTypeRequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.MASTERS + MastersAPI.CONTRACT_TYPE;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getContractTypeRequest');
		}
	},
	getNetPaymentDaysRequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.MASTERS + MastersAPI.NET_PAYMENT_DAYS;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getNetPaymentDaysRequest');
		}
	},
};
