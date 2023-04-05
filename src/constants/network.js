export class NetworkInfo {
	static PROTOCOL = 'http://';
	// static domain = 'localhost:5162/';
	static DOMAIN = '3.218.6.134:9082/';
	// static PROTOCOL = 'https://';
	// static DOMAIN = '809c77bfbe78ce2d4010a080a425ea2b.loophole.site/';
	static NETWORK = NetworkInfo.PROTOCOL + NetworkInfo.DOMAIN;
}
export class SubDomain {
	static USER_OPERATIONS = 'UserOperationsAPI/';
	static VIEW_ALL_HR = 'ViewAllHR/';
	static MASTERS = 'MastersAPI/';
	static CLIENT = 'Client/';
	static HIRING = 'Hiring/';
	static MATCHMAKING = 'Matchmaking/';
	static DEBRIEFING = 'Debriefing/';
	static INTERVIEW = 'Interview/';
	static DEAL = 'Deal/';
	static USER = 'User/';
	static HR_ACCEPTANCE = 'HRAcceptance/';
	static ONBOARD = 'OnBoard/';
	static TALENT_STATUS = 'TalentStatus/';
}
export class APIType {
	static USER = '/user';
}
export class MethodType {
	static GET = '/get';
	static POST = '/post';
	static PUT = '/update';
	static DELETE = '/delete';
}
export class UserAPI {
	static LOGIN = 'AdminLogin';
	static SIGNUP = '/signup';
	static FORGOTPASSWORD = '/forgotpassword';
	static LIST = 'List';
	static ADD_NEW_USER = 'AddEdit';
	static GET_USER_DETAIL = 'GetUserDetail';
	static UPDATEPASSWORD = '/updatepassword';
	static IS_EMPLOYEE_ID_EXIST = 'IsEmployeeIDExist';
	static IS_EMPLOYEE_NAME_EXIST = 'IsEmployeeFullNameExist';
}

export class AllHiringRequestAPI {
	static SET_PRIORITY_NEXT_WEEK = 'SetPriorityForNextWeek';
}
export class MastersAPI {
	static GET_FIXED_VALUE = 'GetFixedValues';
	static GET_GEO = 'GetGeo';
	static GET_SKILLS = 'GetSkills';
	static GET_CURRENCY = 'GetCurrency';
	static GET_TALENT_TIME_ZONE = 'GetTalentTimeZone';
	static GET_HOW_SOON = 'GetHowSoon';
	static GET_TIME_ZONE = 'GetTimeZone';
	static GET_TIME_ZONE_PREFERENCE = 'GetTimeZonePreference';
	static GET_PARTIAL_ENGAGEMENT_TYPE = 'GetPartialEngagementType';
	static GET_TALENTS_ROLE_REQUEST = 'GetTalentsRoles';
	static FILE_UPLOAD = 'FileUpload';
	static GET_CODE_AND_FLAG = 'GetCodeandFlag';
	static Get_SALESMAN = 'GetSalesman';
	static GET_HR_DELETE_REASON = 'GetHRDeleteReason';
	static GET_REGIONS = 'GetRegions';
	static GET_MODE_OF_WORK = 'GetModeOfWork';
	static GET_COUNTRY = 'GetCountry';
	static GET_USER_TYPE = 'GetUserType';
	static GET_TEAM_MANAGER = 'GetTeamManager';
	static GET_USER_BY_TYPE = 'GetUserByType';
	static GET_REPORTEE_MANAGER = 'GetFetchReporteeTeamManager';
	static GET_BDR_MARKETING_BASED_ON_USER_TYPE =
		'FetchBDRMarketingBasedOnUserType';
	static GET_TEAM_MANAGER_BASED_ON_USER_TYPE =
		'FetchTeamManagerBasedOnUserType';
	static GET_EMAIL_SUGGESTION = 'AutoComplete/Contact';
	static GET_NR_MARGIN = 'GetNRMargin';
	static CHECK_OTHER_ROLE = 'CheckOtherRole';
	static ADD_OTHER_SKILL = 'AddOtherSkill';
	static CONTRACT_TYPE = 'ContractType';
	static NET_PAYMENT_DAYS = 'NetPaymentDays';
	static YES_NO_OPTION = 'YesNoOption';
	static BUDDY = 'Buddy';
}
export class TalentStatus {
	static GET_TALENT_STATUS_DETAIL = 'GetStatusDetail';
	static UPDATE_TALENT_STATUS = 'UpdateTalentStatus';
	static REMOVE_ONHOLD_STATUS = 'RemoveOnHoldStatus';
}
export class HRAcceptanceAPI {
	static GET_HR_ACCEPTANCE = 'GetHRAcceptance';
	static ADD_HR_ACCEPTANCE = 'AddHRAcceptance';
	static OPEN_POST_ACCEPTANCE = 'OpenPostAcceptance';
}
export class ClientsAPI {
	static CREATE = 'Create';
	static CHECK_DUPLICATE_COMPANY_NAME = 'CheckDuplicateCompanyName';
	static CHECK_DUPLICATE_EMAIL = 'CheckDuplicateEmail';
	static GET_POINT_OF_CONTACT = 'GetPointOfContact';
}
export class HiringRequestsAPI {
	static GET_ALL_HIRING_REQUEST = 'GetAllHiringRequests';
	static CREATE_HR = 'Create';
	static CHECK_CLIENT_EMAIL = 'CheckClientEmail';
	static SEARCHING_HIRING_REQUEST_DETAIL = 'SearchHiringRequestDetail';
	static GET_HR_DETAIL = 'GetHRDetail';
	static SAVE_HR_NOTES = 'SaveHRNotes';
	static GET_TALENT_COST_CONVERSION = 'GetTalentCostConversion';
	static GET_TALENT_TECH_SCORE_CARD = 'GetTalentTechScoreCard';
	static GET_TALENT_PROFILE_SHARED_DETAILS = 'GetTalentProfileSharedDetail';
	static GET_TALENT_PROFILE_LOG = 'GetTalentProfileLog';
	static SET_TALENT_PRIORITIES = 'SetTalentPriorties';
	static DELETE = 'delete';
	static GET_ALL_FILTER_DATA_FOR_HR = 'GetAllFilterDataForHR';
	static SCHEDULE_INTERVIEW = 'Schedule';
	static RESCHEDULE_INTERVIEW = 'Reschedule';
	static UPLOAD_FILE = 'UploadFile';
	static UPLOAD_DRIVE_FILE = 'UploadDriveFile';
	static UPLOAD_GOOGLE_FILE_LINK = 'UploadGoogleFileLink';
	static UPDATE_ODR_POOL_STATUS = 'UpdateODRPoolStatus';
}

export class UsersAPI {
	static LIST = 'List';
	static ADD_NEW_USER = 'AddEdit';
}

export class InterviewsAPI {
	static LIST = 'List';
	static INTERVIEW_STATUS_DETAILS = 'GetInterviewStatusDetail';
}
export class DealsAPI {
	static LIST = 'List';
	static DETAIL = 'Detail';
	static DEAL_FILTER = 'FilterCriterias';
}

export class OnboardsAPI {
	static ONBOARD_TALENT = 'OnBoardTalent';
}

export class HTTPStatusCode {
	static OK = 200;
	static CREATED = 201;
	static ACCEPTED = 202;
	static NO_CONTENT = 204;
	static RESET_CONTENT = 205;
	static FOUND = 302;
	static NOT_MODIFIED = 304;
	static BAD_REQUEST = 400;
	static UNAUTHORIZED = 401;
	static FORBIDDEN = 403;
	static NOT_FOUND = 404;
	static REQUEST_TIMEOUT = 408;
	static DUPLICATE_RECORD = 409;
	static UNSUPPORTED_MEDIA_TYPE = 415;
	static UNPROCESSABLE_ENTITY = 422;
	static INTERNAL_SERVER_ERROR = 500;
	static BAD_GATEWAY = 502;
}
