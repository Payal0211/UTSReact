export class NetworkInfo {
	static PROTOCOL = 'http://';
	// static domain = 'localhost:5162/';
	static DOMAIN = '3.218.6.134:9082/';
	static NETWORK = NetworkInfo.PROTOCOL + NetworkInfo.DOMAIN;
}
export class SubDomain {
	static USER_OPERATIONS = 'UserOperationsAPI/';
	static VIEW_ALL_HR = 'ViewAllHR/';
	static MASTERS = 'MastersAPI/';
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
	static UPDATEPASSWORD = '/updatepassword';
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
	static GET_TIME_ZONE_PREFERENCE = 'GetTimeZonePreference';
	static GET_PARTIAL_ENGAGEMENT_TYPE = 'GetPartialEngagementType';
	static GET_TALENTS_ROLE_REQUEST = 'GetTalentsRoles';
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
	static UNSUPPORTED_MEDIA_TYPE = 415;
	static UNPROCESSABLE_ENTITY = 422;
	static INTERNAL_SERVER_ERROR = 500;
	static BAD_GATEWAY = 502;
}
