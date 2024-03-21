import {
	DirectHR,
	HiringRequestsAPI,
	MastersAPI,
	NetworkInfo,
	SubDomain,
} from 'constants/network';
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
	getPayRollTypeRequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.MASTERS + MastersAPI.GET_PAYROLL_TYPE;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getPayRollTypeRequest');
		}
	},
	getHRPricingTypeRequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.MASTERS + MastersAPI.GET_HR_PRICING_TYPE;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getHRPricingTypeRequest');
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
	getHRSkillsRequest: async function (HRID) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.MASTERS + MastersAPI.GET_HR_SKILLS + `?hrId=${HRID}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getHRSkillsRequest');
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
	getContractDurationRequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.MASTERS + MastersAPI.GET_CONTRACT_DURATION;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getCurrencyRequest');
		}
	},
	getGetBudgetInformationRequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.MASTERS + MastersAPI.GET_BUDET_INFORMATION;
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
	getMasterDirectHRRequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.DIRECT_HR + DirectHR.GET_MASTER_FOR_DIRECTHR;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getMasterDirectHRRequest');
		}
	},
	getMasterDirectHRDetailsRequest: async function (hrID) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.DIRECT_HR + DirectHR.GET_HR_DETAILS + `?HRID=${hrID}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getMasterDirectHRRequest');
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

	getCountryListRequest: async function (countryDetails) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.MASTERS + MastersAPI.GET_COUNTRY_LIST;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		httpService.dataToSend = countryDetails;
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getCountryListRequest');
		}
	},
	checkCountryRegionRequest: async function (countryDetails) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.MASTERS +
			MastersAPI.CHECK_COUNTRY_REGION +
			`?CountryRegion=${countryDetails.countryCode}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.checkCountryRegionRequest');
		}
	},
	checkCountryNameRequest: async function (countryDetails) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.MASTERS +
			MastersAPI.CHECK_COUNTRY_NAME +
			`?CountryName=${countryDetails.countryName}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.checkCountryNameRequest');
		}
	},
	addCountryRequest: async function (countryDetails) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.MASTERS + MastersAPI.ADD_COUNTRY;
		httpService.setAuthRequired = true;
		httpService.dataToSend = countryDetails;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.addCountryRequest');
		}
	},
	getCountryByPostalCodeRequest: async function (postalData) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.HIRING +
			MastersAPI.GET_COUNTRY_LIST_BY_POSTALCODE +
			`?countryCode=${postalData?.countryCode}&postalcode=${postalData?.postalCode}
`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getCountryByPostalCodeRequest');
		}
	},
	getCountryByCityRequest: async function (city) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.MASTERS +
			MastersAPI.GET_COUNTRY_LIST_BY_CITY 
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		httpService.dataToSend = {'city':city};
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getCountryByCityRequest');
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
			let response = await httpService.sendGetRequestWithErrData();
			return response;
		} catch (error) {
			// return errorDebug(error, 'MasterAPI.getOtherSkillsRequest');
			return error
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
	getYesNoOptionRequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.MASTERS + MastersAPI.YES_NO_OPTION;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getYesNoOptionRequest');
		}
	},
	getBuddyRequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.MASTERS + MastersAPI.BUDDY;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getBuddyRequest');
		}
	},
	getDashboardCountRequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.ENGAGEMENT +
			MastersAPI.GET_DASHBOARD_COUNT_FOR_ENGAGEMENT;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getDashboardCountRequest');
		}
	},
	checkIsSalesPerson: async function (getContactAndSaleID) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.HIRING +
			HiringRequestsAPI.CHECK_SALES_USER_IS_PARTNER +
			`?salesPersonId=${getContactAndSaleID?.salesID}&ContactID=${getContactAndSaleID?.contactID}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.checkIsSalesPerson');
		}
	},

	getUsersHierarchyRequest: async function (userDetails) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.MASTERS +
			MastersAPI.GET_USERS_HIERARCHY +
			`?Parentid=${userDetails?.parentID}&IsOpsUser=false
`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getUsersHierarchyRequest');
		}
	},
	getDurationType: async function (data) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.MASTERS + MastersAPI.GET_DURATION_TYPE;
		httpService.setAuthRequired = true;
		httpService.dataToSend = data;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getDashboardCountRequest');
		}
	},
	geLeadType: async function (LeadType,hrid) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.MASTERS + MastersAPI.GET_LEAD_BY_TYPE + `?LeadType=${LeadType}${hrid ? `&HrID=${hrid}`: '' }`;
		httpService.setAuthRequired = true;
		
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.geLeadType');
		}
	},
	cloneHRRequest: async function (data) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.HIRING + MastersAPI.CLONE_HR;
		httpService.setAuthRequired = true;
		httpService.dataToSend = data;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getDashboardCountRequest');
		}
	},
	getCurrencyExchangeRateListRequest: async function (currencyDetails) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.MASTERS +
			MastersAPI.GET_CURRENCY_EXCHANGE_RATE_LIST;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		httpService.dataToSend = currencyDetails;
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getCurrencyExchangeRateListRequest');
		}
	},
	updateCurrencyExchangeRateListRequest: async function (currencyDetails) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.MASTERS +
			MastersAPI.UPDATE_CURRENCY_EXCHANGE_RATE_LIST;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		httpService.dataToSend = currencyDetails;
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(
				error,
				'MasterAPI.updateCurrencyExchangeRateListRequest',
			);
		}
	},
	getStartEndTimeRequest: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.MASTERS + MastersAPI.GET_START_END_TIME;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getCurrencyRequest');
		}
	},
	getRolesListRequest:async function (rolesDetails){
		let httpService = new HttpServices();
		// httpService.URL =
		// 	NetworkInfo.NETWORK + SubDomain.MASTERS + MastersAPI.GET_START_END_TIME;
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.MASTERS +
			MastersAPI.GET_ROLES_LIST;	
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		httpService.dataToSend = rolesDetails;
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getCurrencyRequest');
		}
	},
	updateRoleStatus:async function(id,isActive){
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.MASTERS +
			MastersAPI.UPDATE_TALENT_ROLE_STATUS+ `?id=${id}&status=${isActive}`;	
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getCurrencyRequest');
		}
	},
	getRightsForAdd: async function () {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.MASTERS + MastersAPI.ROLE + MastersAPI.CHECK_RIGHTS_FOR_ADD_OPRATION;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getRightsForAdd');
		}
	},
	uploadRoalIcon: async function (fileData) {
		let httpService = new HttpServices();
		httpService.URL =
		NetworkInfo.NETWORK + SubDomain.MASTERS + MastersAPI.ROLE + MastersAPI.UPLOAD_ICON;
		httpService.setAuthRequired = true;
		httpService.dataToSend = fileData && fileData;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendFileDataPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.uploadRoalIcon');
		}
	},
	addRole: async function (data) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.MASTERS + MastersAPI.ROLE + MastersAPI.ADD_ROLE + `?RoleName=${data.roleName}${data.fileName && `&UploadIconFileName=${data.fileName}`}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.addRole');
		}
	},
	editRole: async function (data) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.MASTERS + MastersAPI.ROLE + MastersAPI.EDIT_ROLE  + `?RoleName=${data.roleName}&ID=${data.id}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.editRole');
		}
	},
	editTimezone : async function (data) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.MASTERS + MastersAPI.EDIT_TIMEZONE  + `?TimeZone=${data.TimeZone}&ID=${data.id}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();		
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.editTimezone');
		}
	},
	updateRole: async function (data) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + SubDomain.MASTERS + MastersAPI.ROLE + MastersAPI.UPDATE_ROLE  + `?ID=${data.id}&UpdatedRoleID=${data.newId}`;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		try {
			let response = await httpService.sendGetRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.updateRole');
		}
	},
	getTimeZoneMaster:async function (timezoneDetails) {
		let httpService = new HttpServices();		
		httpService.URL =
			NetworkInfo.NETWORK +
			SubDomain.MASTERS +
			MastersAPI.TIMEZONEMASTER;	
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();

		let _reqData = timezoneDetails;
        _reqData.searchText = _reqData.searchText === "yes" ? 'true' : _reqData.searchText === "no" ? 'false' : _reqData.searchText
		httpService.dataToSend = _reqData;
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getTimeZoneMaster');
		}
	},
	getChatGPTResponse: async function (data) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + 'ChatGPTResonse/ChatGPTResponseForUrlParsing' ;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		httpService.dataToSend = data
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getChatGPTResponse');
		}
	},
	getOnBoardListData : async function (data) {
		let httpService = new HttpServices();
		httpService.URL =
			NetworkInfo.NETWORK + 'Onboard/OnboardList' ;
		httpService.setAuthRequired = true;
		httpService.setAuthToken = UserSessionManagementController.getAPIKey();
		httpService.dataToSend = data
		try {
			let response = await httpService.sendPostRequest();
			return response;
		} catch (error) {
			return errorDebug(error, 'MasterAPI.getOnBoardListData');
		}
	}
};
