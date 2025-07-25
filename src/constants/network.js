export class NetworkInfo {
    static PROTOCOL = 'http://';
    static PROTOCOL_S = 'https://';
    // static domain = 'localhost:5162/';
    // static ATS_DOMAIN = '/atsstaging.uplers.com/api/';
    static ATS_DOMAIN = 'ats.uplers.com/api/';
    static ATS_TOKEN = 'y8sxutshp4gm2u4lsmsmlg';
    static ZOHO_AUTH = '4b441aae-d361-46e1-ad14-2b2114ffbe17'
    static ZOHO_DOMAIN = 'api-talentsupport.uplers.com/'
    static DOMAIN = 'newbeta-adminapi.uplers.com/';
    // static domain = 'https://clientportal.uplers.com/gspace/';
    static domain = 'https://bb8d-3-218-6-134.ngrok-free.app/';
    static FILEDOMAIN = '3.82.177.154:90/';
    // static PROTOCOL = 'https://';
    // static DOMAIN = '809c77bfbe78ce2d4010a080a425ea2b.loophole.site/';
    static NETWORK = NetworkInfo.PROTOCOL_S + NetworkInfo.DOMAIN;
    static ATS_NETWORK = NetworkInfo.PROTOCOL_S + NetworkInfo.ATS_DOMAIN
    static ZOHO_NETWORK = NetworkInfo.PROTOCOL_S + NetworkInfo.ZOHO_DOMAIN
    static network =  NetworkInfo.domain;
    static FILENETWORK = NetworkInfo.PROTOCOL_S + NetworkInfo.FILEDOMAIN;
    static ENV = "Live";
}

export class GSpaceEmails{
static EMAILS = "mehul@uplers.com,vishwa.p@uplers.in,jimit.soni@uplers.in";
}

export class SubDomain {
	static USER_OPERATIONS = 'UserOperationsAPI/';
	static VIEW_ALL_HR = 'ViewAllHR/';
	static MASTERS = 'MastersAPI/';
	static CLIENT = 'Client/';
	static COMPANY = 'Company/'
	static CLIENT_REPORT = 'ClientReport/';	
	static HR_REPORT = 'HRReport/';
	static HIRING = 'Hiring/';
	static MATCHMAKING = 'Matchmaking/';
	static DEBRIEFING = 'Debriefing/';
	static INTERVIEW = 'Interview/';
	static DEAL = 'Deal/';
	static USER = 'User/';
	static HR_ACCEPTANCE = 'HRAcceptance/';
	static ONBOARD = 'OnBoard/';
	static TALENT_STATUS = 'TalentStatus/';
	static ENGAGEMENT = 'Engagement/';
	static TALENT_REPLACEMENT = 'TalentReplacement/';
	static REPORT = 'Report/';
	static INCENTIVE_REPORT = 'IncentiveReport/';
	static AM_ASSIGNMENT = 'AMAssignment/';
	static INTERVIEWER = 'Interviewer/';
	static SLA_REPORT = 'SLAReport/';
	static I2S_REPORT = 'InterviewToSuccess/';
	static AMDASHBOARD = 'AMDashboard/'
	static HUB_SPOT = 'Hubspot/';
	static CLIENT_BASED_REPORT_WITHHUB_SPOT  = 'ClientBasedReportWithHubSpot/'	
	static EMAIL_TRACKING = 'AWSSESTrackingDetails/'
	static DIRECT_HR = 'DirectHR/'
	static LEAVE_REQUEST = 'LeaveRequests/'
	static SPACE = "space"
	static TALENT_DOCUMENT = 'TalentDocument/'
	static MEMBER = "member"
	static TALENT_INVOICE = 'TalentInvoice/'
	static TA_DASHBOARD = 'TaDashboard/'
}

export class TalentInvoiceAPI {
	static GET_ENGAGEMENT_ALL_BR_PR = 'Get_engagement_All_BR_PR'
}


export class TaDashboardURL {
	static GET_ALL_MASTER_Data = 'GetAllMastersData'
	static GET_TA_TASK_DETAILS = 'GetTATaskDetailsListing'
	static UPDATE_TA_TASK = 'InsertOrUpdateTATasks'
	static GET_TA_COMPANY_List = 'GetTACompanyList'
	static GET_HR_LIST_COMPANY = 'GetTAHRListCompanyWise'
	static GET_HR_TALENT_DETAILS = 'GetHRRelatedTalentDetails'
	static GET_TA_TARGETS = 'GetTATargetsDetails'
	static ALL_TA_USERS = 'GetAllTAUsers'
	static INSERT_TASK_COMMENT = 'InsertTaskComment'
	static GET_ALL_COMMENTS = 'GetAllTaskComments'
	static REMOVE_TASK ='InactiveTATask'
	static GET_ALL_REVENUE_COMMENTS = 'GetSectionwiseRevenueReportComments'
	static INSERT_REVENUE_COMMENT = 'InsertRevenueReportComment'
	static INSERT_TARGET_DETAILS = 'InsertOrUpdateTADailyTargets'
	static GET_TA_WISE_PIPELINE_DETAILS= 'GetTAWiseHRPipelineDetails'
	static GET_IMMEDIATE_TALENT_DETAILS = 'GetImmediateJinerDetails'
	static GET_TOTAL_REVENUE_PER_TA = 'GetTotalRevenuePerTAUser'
	static GET_DAILY_ACTIVE_TARGETS = 'GetDailyActiveHRPipelineAndTotalTarget'
}

export class APIType {
	static USER = '/user';
}

export class TalentDocumentAPI  {
	static GET_DOCUMENT = 'GetTalentDocumentList';
	static UPLOAD_FILE = 'UploadFiles';
	static VERIFY_DOCUMENT= 'VerifyTalentDocument'
	static GET_FILTER = 'Filters'
	static REMOVE_DOCUMENT = 'RemoveTalentDocument'
}
export class LeaveRequestAPI {
	static GET_TALENT_LEAVES = 'GetTalentLeaves'
	static GET_CALENDER_LEAVES = 'GetTalentLeavesMonthlyCalendar'
	static GET_UPDATE_LEAVE = 'InsertUpdateLeaveRequest'
	static APPROVE_REJECT_LEAVE = 'ApproveRejectRevokeTalentLeaves'
	static GET_LEAVE_TYPES = 'GetLeaveTypes'
	static GET_LEAVE_HISTORY = 'GetTalentLeavesHistory'
}

export class AMDashboardAPI {
	static FILTERS = 'Filters'
	static GET_AM_DASHBOARD = 'GetAMDashboard'
	static GET_ZOHO_TICKETS= 'GetZohoTickets'
	static GET_SUMMARY = 'GetAMDashboardSummaryCounts'
	static GET_AM_RENEWALS = 'GetAMDashboardRenewals'
	static GET_TICKET_HISTORY = 'Tickets/GetZohoTicketHistory'
	static GET_TICKET_CONVERSATION = 'Tickets/GetZohoTicketConversation'
	static DEPLOYED_TALENT_FILTER = 'DeployedTalent/Filters'
}

export class DirectHR {
	static GET_MASTER_FOR_DIRECTHR = 'GetMastersForDirectHR'
	static GET_HR_DETAILS =  'GetDetail'
}

export class CompanysAPI {
	static GET_DETAILS = 'GetDetails';
	// static UPLOAD_IMAGE = 'UploadImage';
	static UPLOAD_IMAGE = 'Image/uploadBase64'
	static DELETE_YOUTUBE_DETAILS = 'DeleteYouTubeDetails';
	static DELETE_CULTURE_IMAGE = 'DeleteCultureImage'
	static UPDATE_COMPANY_DETAILS = 'UpdateDetails'
	static UPDATE_COMPANY_CATEGORY = 'UpdateCompanyCategory'
	static REMOVE_COMPANY_CATEGORY = 'RemoveDiamondCategory '
	static VALIDATE_COMPANY_CLIENT = 'ValidateCompanyClient'
	static DELETE_FUNDING = "DeleteFundingDetails"
	static PREVIEW = 'Preview'
	static HR_UPDATE_PREVIEW = 'HRUpdatePreviewDetails'
	static CREATE_WHATSAPP_GROUP = 'CreateWhatsappGroup'
	static UPDATE_WHATSAPP_GROUP = 'UpdateWhatsappGroupMembers'
	static UPDATE_COMPANY_CONFIDENTIAL = 'UpdateCompanyConfidentialDetailsBasedonHR'
}
export class MethodType {
	static GET = '/get';
	static POST = '/post';
	static PUT = '/update';
	static DELETE = '/delete';
}
export class UserAPI {
	static LOGIN = 'AdminLogin';
	static LOGOUT = 'LogOut';
	static SIGNUP = '/signup';
	static FORGOTPASSWORD = '/forgotpassword';
	static LIST = 'List';
	static GET_CLIENT_POPUP_LIST = 'PopUPList'
	static ADD_NEW_USER = 'AddEdit';
	static GET_USER_DETAIL = 'GetUserDetail';
	static UPDATEPASSWORD = '/updatepassword';
	static IS_EMPLOYEE_ID_EXIST = 'IsEmployeeIDExist';
	static IS_EMPLOYEE_NAME_EXIST = 'IsEmployeeFullNameExist';
	static CHANGE_PASSWORD = 'ChangePassword';
	static UTS_FEEDBACK = 'UTSFeedBack';
}

export class AMAssignmentAPI {
	static AM_DATA_SEND = 'AMDataSend';
}
export class ReportType {
	static DEMAND_FUNNEL = 'DemandFunnel/';
	static SUPPLY_FUNNEL = 'SupplyFunnel/';
	static TEAM_DEMAND_FUNNEL = 'TeamDemandFunnel/';
	static JD_PARSING_DUMP = 'JDParsingDump/';
	static HR_LOST_REPORT = 'HRLostReport/';
	static REPLACEMENT_REPORT = 'ReplacementReport';
	static TALENT_BACKOUT_REPORT = 'TalentBackoutReport';
	static TALENT_REJECT_REPORT = 'TalentRejectReport';
	static TALENT_ONBOARD_REPORT = 'TalentOnBoardReport';
	static TALENT_INTERVIEW_ROUNDS_REPORT = 'TalentInterviewRoundsReport'
	static ALL_TALENTS_NOTES = 'TalentNotesReport'
	static TALENT_DOCUMENT_REPORT = 'TalentDocumentReport'
	static ZOHO_INVOICE_REPORT = 'ZohoInvoiceReport'
	static ZOHO_INVOICE_CUSTOMER_REPORT = 'ZohoCustomerReport'
	static TALENT_LEAVE_TAKEN_REPORT = 'TalentLeaveTakenReport'
	static RECRUITER_REPORT = 'RecruiterReport'
	static CLIENT_DASHBOARD_REPORT = 'ClientDashboardReport'
	static RECRUITER_DASHBOARD_REPORT = 'RecruiterDashboardReport'
	static INTERVIEW_RESCHEDULE_DASHBOARD = 'RecruiterRescheduledInterviewCount'
	static DAILY_SNAPSHOT_REPORT = 'DailySnapshotReport'
	static AM_WEEK_WISE_REPORT = 'AMWeekWiseReport'
	static AM_WEEK_WISE_REPORT_FILTERS = 'AMWeekWiseReportFilters'
	static DAILY_BUSINESS_NUMBERS = ''
	static POTENTIAL_CLOSURES_LIST = 'PotentialClosureList'
	static GET_MONTHLY_REVENUE_BUSINESS_REPORT = 'GetMonthlyRevenueBusinessReport'
	static GET_HR_TALENT_WISE_REPORT = 'GetHRTalentsWiseRevenueDetails'
	static POTENTIAL_CLOSURES_UPDATE = 'UpdatePotentialClosureHRDetails'
	static SCREEN_INTERVIEW_REJECT_COUNT = 'GetCompanyListwithScreenAndInterviewRejectCounts'
	static GET_REJECTED_TALENTS = 'GetHRRejectedTalentDetailsFromCompany'
	static NBD_AM_REVENUE_BUSINESS = 'GetNBDorAMMonthlyRevenueBusinessReport'
	static GET_HR_REJECTED_TALENT_FOR_COMPANY = 'GetHRRejectedTalentDetailsFromCompany'
	static AM_WISE_INTERVIEW_COUNTS = 'GetDailyAMWiseInterviewCounts'
	static GET_DAILY_AM_WISE_HR_TALENT_INTERVIEW_DETAILS = 'GetDailyAMWiseHRTalentInterviewDetails'
	static COMPANY_WISE_CATEGORY= 'CompanyListWithCompanyCategory'
	static GET_IMMEDIATE_JOINERS = 'GetImmediateJoinerList'
	static AVERAGE_SLA  = 'RecruiterAverageSLAReport'
	static COMPANY_WISE_CATEGORY_DETAILS = 'GetCompanywiseActiveHRList'
}
export class ReportsAPI {
	static LISTING = 'Listing';
	static SUMMARY = 'Summary';
	static FILTERS = 'Filters';
	static HRDETAILS = 'HRDetails';
	static JD_PARSING_DUMP_REPORT = 'JDParsingDumpReport';
	static OVER_ALL_SLA_SUMMARY = 'OverAllSLASummary';
	static SLA_DETAILED_DATA = 'GetSLAReport';
	static SLA_FILTER = 'GETSLAFilters';
	static TALENT_DETAIL_POPUP = 'TalentDetailPopup';
	static GET_HR_TALENTS_WISE_DESHBOARD = 'GetHRTalentsWiseRecruiterDashboard'
	static GET_INTERVIEW_WISE_RESCHEDULE_DESHBOARD = 'GetRecruiterRescheduledInterviewDetails '
}

export class HubspotsAPI {
	static GET_AUTOCOMPLETE_COMPANY = 'GetAutoCompleteHubSpotCompany'
	static GET_COMPANY_DETAILS = 'GetCompanyDetails'
	static GET_CONTACTS_BY_EMAIL = 'GetHubSpotContactsByEmail'
	static GET_COMPANT_DETAILS_FOR_EDIT = 'GetCompanyDetailsForEditClient'
	static GET_COMPANY_DETAILS_HUBSPOT  = 'Contact/GetHubSpotContactsByEmail'
}

export class EngagementAPI {
	static FILTER = 'Filters';
	static LIST = 'List';
	static EDIT_BILL_PAY_RATE = 'EditBillRatePayRate';
	static GET_CONTENT_END_ENGAGEMENT = 'GetContentEndEnagagement';
	static CHANGE_CONTRACT_END_DATE = 'ChangeContractEndDate';
	static GET_CONTENT_FOR_ADD_INVOICE = 'GetContentForAddInvoice';
	static VIEW_ONBOARD_FEEDBACK = 'ViewOnBoardFeedback';
	static GET_ONBOARD_FEEDBACK = 'GetOnBordFeedBack';
	static GET_FEEDBACK_CONTENT = 'GetFeedbackFormContent';
	static SAVE_FEEDBACK_CLIENT_ONBOARD = 'SaveFeedbackClientOnBoard';
	static SAVE_INVOICE_DETAILS = 'SaveInvoiceDetails';
	static SAVE_BILL_RATE_PAY_RATE = 'SaveBillRatePayRate';
	static GET_RENEW_ENGAGEMENT = 'GetRenewEngagement';
	static SAVE_RENEW_ENGAGEMENT = 'SaveRenewEngagement';
	static CANCEL_ENGAGEMENT = 'CancelEngagement'
	static GET_CANCEL_ENGAGEMENT = 'GetCancelEndEnagagement'
	static CALCULATE_ACTUAL_NR_BR_PR = 'Calculate_ActualNR_From_BRPR';
	static UPLOAD_FILE = 'UploadFile';
	static GET_TSC_USERS_DETAIL = 'GetTSCUsersDetail';
	static UPDATE_TSC_NAME = 'UpdateTSCName';
	static AUTO_UPDATE_TSC_NAME = 'TSCAutoAssignment'
	static GET_ENGAGEMENT_EDIT_ALL_BR_PR = 'Get_engagement_Edit_All_BR_PR'
	static GET_TALENT_MATCHMAKING  = 'GetTalentMatchmakingDetails'
	static GET_AM_DETAILS = 'GetAMDetails'
	static UPDATE_AM_PAY_OUT = 'UpdateAMForPayOut'
	static UPDATE_DAYS_AND_PR = 'UpdateDaysandPRDetails'
	static GET_CUSTOM_EMAIL_TEMPLATE = 'GetCustomEmailTemplates'
	static GET_EMAIL_MASTER = 'GetEmailMasterDropdownValues'
	static CUSTOM_EMAIL = 'SendCustomEmail'
	static UPDATE_REPLACEMENT_DETAILS = 'UpdateReplacementDetails'
}

export class AllHiringRequestAPI {
	static SET_PRIORITY_NEXT_WEEK = 'SetPriorityForNextWeek';
}
export class MastersAPI {
	static GET_FIXED_VALUE = 'GetFixedValues';
	static GET_JOB_TYPES = 'GetJobTypes'
	static GET_PAYROLL_TYPE = 'GetprgPayrollType';
	static GET_HR_PRICING_TYPE = 'GetprgHiringTypePricing'
	static GET_GEO = 'GetGeo';
	static GET_SKILLS = 'GetSkills';
	static GET_HR_SKILLS = 'GetHRSkills'
	static GET_CURRENCY = 'GetCurrency';
	static GET_CONTRACT_DURATION = 'GetContractDuration';
	static GET_BUDET_INFORMATION = 'GetBudgetInformation';
	static GET_START_END_TIME = 'GetStartEndTime';
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
	static GET_DASHBOARD_COUNT_FOR_ENGAGEMENT = 'GetDashboardCountForEngagement';
	static GET_COUNTRY_LIST = 'GetCountryList';
	static GET_USERS_HIERARCHY = 'GetUserHierarchy';
	static GET_DURATION_TYPE = 'GetDurationType';
	static CLONE_HR = 'CloneHR';
	static GET_COUNTRY_LIST_BY_POSTALCODE =
		'GetCountryListByCountryCodeOrPostalcode';
	static GET_COUNTRY_LIST_BY_CITY = 'FetchCountriesBasedonCity'	
	static CHECK_COUNTRY_REGION = 'CheckCountryRegion';
	static DELETE_POC_USER = 'DeleteHRPOC'
	static EDIT_HR_POC = 'EditHRPOC'
	static CHECK_COUNTRY_NAME = 'CheckCountryName';
	static ADD_COUNTRY = 'AddCountry';
	static GET_CURRENCY_EXCHANGE_RATE_LIST = 'GetCurrencyExchangeRateList';
	static UPDATE_CURRENCY_EXCHANGE_RATE_LIST = 'UpdateCurrencyExchangeRate';
	static GET_LEAD_USER = 'GetLeadUsers';
	static GET_LEAD_BY_TYPE = 'GetLeadByLeadType';
	static GET_ROLES_LIST = 'GetTalentRoleMaster';
	static UPDATE_TALENT_ROLE_STATUS = 'UpdateTalentRoleStatus';
	static ROLE = 'Role/';
	static CHECK_RIGHTS_FOR_ADD_OPRATION ='CheckUserRightsForAddOperation';
	static UPLOAD_ICON ='UploadIcon'
	static ADD_ROLE = 'Add'
	static EDIT_ROLE = 'EditRole'
	static EDIT_TIMEZONE = 'EditTimeZone'
	static UPDATE_ROLE = 'UpdateRole'
	static GET_HIRING_PRICING_TYPE = 'GetHiringTypePricingDetails'
	static TIMEZONEMASTER = 'GetTimeZoneMaster'
	static GET_AUTO_COMPLETE_CITY_STATE = 'GetAutoCompleteCityStateWise'
	static GET_NEAR_BY_CITIES = 'GetNearByCities'
	static GET_AUTO_COMPLETE_CITY = 'GetAutoCompleteCityWise'
	static GET_FREQUENCY = 'GetFrequency'
	static SEND_ATS_UPDATE_ON_EDIT_HR = 'SendATSUpdateOnEditHR'

}
export class TalentStatus {
	static GET_TALENT_STATUS_DETAIL = 'GetStatusDetail';
	static UPDATE_TALENT_STATUS = 'UpdateTalentStatus';
	static REMOVE_ONHOLD_STATUS = 'RemoveOnHoldStatus';
	static GET_REJECTION_REASON_FOR_TALENT = 'GetRejectionReasonForTalent';
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
	static GET_ALL_CLIENTS_LIST = 'List';
	static FILTER_LIST = 'FilterList';
	static VIEW_CLIENT = 'ViewClient';
	static GET_AM_DETAIL = 'GetAMDetails';
	static UPDATE_AM_FOR_COMPANY = 'UpdateAMForCompany';
	static DRAFTJOBDETAILS = 'GetDraftJobDetails';
	static ADD_CLIENT_WITH_CREDITS= 'AddClientwithCredits';
	static TRACKING_LEAD_CLIENT_SOURCE = "TrackingLeadDetailClientSource";
	static GET_CREDIT_TRANSACTION_HISTORY = "GetCreditTransactionHistory";
	static RESEND_INVITE_EMAIL = "ResendInviteEmail";
	static GET_ACTIVE_SALES_USERLIST= "GetActiveSalesUserList";
	static GET_SALES_USER_WITH_HEAD  = "GetSalesUserWithHead";
	static UPDATE_SPACE_ID_FOR_CLIENT = "UpdateSpaceIDForClient";
	static GET_SPACEID_FOR_CLIENTEMAIL= "GetSpaceIdForClientEmail";
	static LIST_CREDIT_UTILIZATION = 'ListCreditUtilization'
	static RESET_DEMO_TALENT_STATUS = 'ResetAllDemoHRTalentStatus'
	static SYNC_COMPANY_PROFILE = "SyncCompanyProfile";
	static UPDATE_EMAIL_NOTIFICATION = "UpdateEmailNotifications";
	static GET_COMPANY_HISTORY_INFO = 'GetCompanyHistoryInfo';
	static GET_COMPANY_HISTORY_BY_ACTION = 'GetCompanyHistoryByAction';
}

export class HiringRequestsAPI {
	static GET_ALL_HIRING_REQUEST = 'GetAllHiringRequests';
	static GET_ALL_UNASSIGNED_HIRING_REQUEST = 'GetAllUnAssignedHiringRequests';
	static ASSIGNED_POC_FOR_UNASSIGNED_HRS = 'AssinedPOCforUnAssignedHRs';
	static CREATE_HR = 'Create';
	static CREATE_DEBRIEFING = 'Debriefing'
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
	static CHECK_SALES_USER_IS_PARTNER = 'CheckSalesUserIsPartner';
	static CONVERT_DP = 'GetHrDPConversion';
	static CONVERT_TO_CONRACUAL = 'GetHrContractualConversion';
	static GET_TALENT_DP_CONVERSION = 'GetTalentsDPConversion';
	static GET_HR_DP_CONVERSION = 'GetHrDPConversion';
	static SAVE_DP_CONVERSION = 'SaveHrDPConversion';
	static CONVERT_TO_CONTRACTUAL = 'GetHrContractualConversion';
	static SAVE_CONVERT_TO_CONTRACTUAL = 'SaveHrContractualConversion';
	static SAVE_TALENT_DP_CONVERSION = 'SaveTalentsDPConversion';
	static CALCULATE_DP_CONVERSION_COST = 'CalculateDPConversionCost';
	static SAVE_TALENT_CONTRACTUAL = 'SaveTalentsContractualConversion';
	static CALCULATE_HR_COST = 'CalculateHRCost';
	static GET_HR_CONTARCTUAL = 'GetTalentsContractualConversion';
	static HRAccept = 'HRAccept';
	static GET_REMAINING_PRIORITY_COUNT = 'GetRemainingPriorityCount';
	static SET_HR_PRIORITY = 'SetHrPriority';
	static GET_HR_COST_DETAILS = 'GetHRCostDetails';
	static UPDATE_HR_COST = 'UpdateHRCost';
	static UPDATE_TALENT_FEES = 'UpdateTalentFees';
	static VIEW_HR_DETAILS = 'ViewHRDetails';
	static GET_HR_DETAILS = 'GetHRDetails';
	static UPDATE_TR_DETAIL = 'UpdateTR';
	static DELETE_INTERVIEW_DETAILS = 'DeleteInterviewDetails';
	static CLOSE_HR_VALIDATION = 'CloseHRValidation'; 
	static CLOSE_HR = 'CloseHR';
	static CLOSE_HR_WARNING = 'CloseHR_WarningMsg';
	static REOPEN_HR = 'ReopenHR';
	static GET_HR_DP_AMOUNT_DETAILS = 'GetHRDPAmountDetails';
	static UPDATE_DP_AMOUNT = 'UpdateDPAmount';
	static GET_HR_SLA_DETAILS = 'GetHiringRequestSLADetails';
	static UPDATE_SLA_DATE = 'UpdateSLADate';
	static EXTRACTTEXTUSINGPYTHON = 'ExtractTextUsingPython';
	// static GET_CHANNEL_LIBRARY = 'GetChannelLibrary';
	static NOTE_LIST = 'hr/note-list';
	static ADD_DELETE_NOTES_DATA = 'AddDeleteNotesData'
	static SAVE_NOTES = 'hr/note-create';
	static DETAIL_FROM_TEXT = 'GetAllDetailsFromText'
	static DONT_HAVE_JD = 'DontHaveJD'
	static GET_lOGIN_HR_INFO = 'GetLoginHrInfo';
	static SYNC_HR_UTS_TO_ATS  = 'SyncHRUtsToAts'
	static GET_ACTION_UPDATES = 'GetUpdateHRDetails'
	static CLOSE_ACTION_History = 'GetHRCloseActionHistory'
	static DELETE_TEST_HR = 'DeleteTestHR'
	static HRDETAILSFORSHORTLISTED ="HrDetailsForShortlisted";
	static GET_SALES_USER_WITH_HEAD_AFTER_HRCREATE = "GetSalesUserWithHeadAfterHRCreate";
	static CLONE_HR_DEMO_ACCOUNT = "CloneHRDemoAccount";
	static GET_HR_ACTIVITY_PAGINATION = "GetHRActivityUsingPagination";
	static GET_HR_TALENT_PAGINATION = "GetHRTalentsUsingPagination";
}

export class UsersAPI {
	static LIST = 'List';
	static ADD_NEW_USER = 'AddEdit';
	static DEPARTMENT = 'GetDepartment';
	static TEAM = 'GetTeam';
	static LEVEL = 'GetLevel';
	static GEO = 'GetGeo';
	static REPORTING_USER = 'GetReportingUser';
	static DEACTIVATE_USER = 'DeactivateUser';
	static GET_TA_MONTHLY_GOAL = 'GetTAMonthlyGoal';
	static ADD_UPDATE_TA_MONTHLY_GOAL = 'AddOrUpdateTAMonthlyGoal';
	static MASTER_ZOHO_CUSTOMER_TO_UTS_COMPANY = 'MapZohoCustomerToUTSCompany';
	static DELETE_TA_MONTHLY_GOAL = 'DeleteTAMonthlyGoal';
}

export class InterviewsAPI {
	static LIST = 'List';
	static INTERVIEW_STATUS_DETAILS = 'GetInterviewStatusDetail';
	static UPDATE_INTERVIEW_STATUS = 'UpdateInterviewStatus';
	static FEEDBACK = 'Feedback';
	static GET_SLOT_DETAILS = 'GetExistingSlotDetails';
	static GET_CLIENT_FEEDBACK = 'GetClientFeedback';
	static SAVE_CONFIRM_INTERVIEW = 'SaveConfirmInterviewSlot';
	static CLIENT_CURRENT_DETAILS_FOR_ANOTHER_ROUND =
		'ClientCurrentDetailsForAnotherRound';
	static SAVE_ANOTHER_ROUND_FEEDBACK = 'SaveAnotherRoundFeedback';
}
export class InterviewersAPI {
	static CHECK_LINKEDIN_URL = 'CheckLinkedinURL';
	static CHECK_INTERVIEWER_EMAILID = 'CheckInterviewerEmailId';
}
export class DealsAPI {
	static LIST = 'List';
	static DETAIL = 'Detail';
	static DEAL_FILTER = 'FilterCriterias';
}

export class I2SsAPI {
	static LIST = 'InterviewToSuccessList';
	static POPUP  ='GetInterviewToSuccessPopupDetails'
}

export class ClientReportAPI {
	static GET_CLIENT_REPORT = 'GetClientReport'
	static GET_CLIENT_POPUP_REPORT = 'PopUpReport'
	static GET_CLIENT_FILTERS = 'Filters'
	static POPUP_FILTERS = 'Popup'
}

export class OnboardsAPI {
	static ONBOARD_TALENT = 'OnBoardTalent';
	static GET_ONBOARDING_STATUS = 'GetOnboardingStatus';
	static ONBOARDING_STATUS_UPDATES = 'OnBoardingStatusUpdates';
	static VIEW_IN_DETAIL = 'ViewInDetail';
	static UPDATE_CONTRACT_START_DATE= 'UpdateContractStarDate';
	static FATCH_CLIENT_LEGAL_INFO = 'FetchClientLegalInfo'
	static FEATCH_TALENT_ON_BOARD_INFO = 'FetchTalentOnBoardInfo'
	static UPLOAD_FILE = "UploadSOWDocument"
	static GET_PRE_ONBOARDING_DETAIL = 'GetPreOnBoardingDetailForAMAssignment'
	static UPDATE_PRE_ON_BOARDING_DETAIL = 'UpdatePreOnBoardingDetailForAMAssignment'
	// static GET_DURING_ON_BOARD_DETAIL = 'GetOnBoardingDetailForSecondTabAMAssignment'
	static GET_DURING_ON_BOARD_DETAIL = 'GetLegalInfo'
	// static UPDATE_PRE_ON_BOARD_2ND_TAB = 'UpdateOnBoardingDetailForSecondTabAMAssignment'
	static UPDATE_PRE_ON_BOARD_2ND_TAB = 'UpdateLegalInfo'
	static UPLOAD_LEAVE_POLICY = 'UploadLeavePolicy'
	static UPDATE_LEAVE_BALANCE = 'UpdateLeaveBalance'
	static GET_AM_USER = "GetAMUser";
	static GET_STATE_LIST = "GetStateList";
	static SYNC_ENGAGEMENT= 'SyncEngagementDetailToATS'
	static TALENT_ONBOARD_NOTES = 'TalentOnBoardedNotes'
	static SAVE_TALENT_ONBOARD_NOTES = 'SaveTalentOnBoardedNotes'
	static SAVE_RENEWALINITIATED_DETAILS="SaveRenewalInitiatedDetail"
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

export class TalentReplaceAPI {
	static REPLACE_TALENT = 'ReplaceTalent';
	static ENGAGEMENT_REPLACE_TALENT =
		'GetEngagemetnsForReplacementBasedOnLWDOption';
	static SAVE_REPLACED_TALENT = 'SaveReplaceTalent';
	static CREATE_REPLACE_HR = 'CreateReplaceHR'
	static CREDITBASE_TALENT_STATUS = "CreditBased/GetStatusDetail"
	static CREDITBASE_UPDATE_TALENT_STATUS = "CreditBased/UpdateTalentStatus"
}
export class IncentiveReport {
	static GET_USER_ROLE = 'GetIncentiveReport';
	static MONTH_YEAR_FILER = 'MonthYearFilter';
	static GET_SALES_USERS_BASED_ON_USER_ROLE = 'GetSalesUsersBasedOnUserRole';
	static GET_USER_HIERARCHY = 'GetUserHierarchy';
	static GET_LIST = 'List';
	static GET_INCENTIVE_REPORT_DETAILS = 'GetIncentiveReportDetails';
	static GET_CONTRACT_BOOSTER = 'GetIncentiveReportDetailsContractBooster';
	static GET_INCENTIVE_REPORT_AMNR = 'GetIncentiveReportDetailsAMNR';
	static CHECK_VALIDATION = 'CheckValidationForNBDandAM';
}
export class ClientHappinessSurvey{
	static LIST = 'List';
	static GET_CLIENT_HAPPINESS_SURVEY_LIST = 'HappinessSurvey/';
	static GET_AUTO_COMPLETE_COMPANY = 'AutoComplete/';
	static GET_COMPANY = "Company";
	static SEND_EMAIL_FOR_FEEDBACK = "SendEmailForFeedback";
	static SAVE_CLIENT_HAPPINESS_SURVEYS= "SaveClientHappinessSurveys";
	static CLIENT_HAPPINESS_SURVEY_OPTION = "ClientHappinessSurveysOption";
}

export class UtmTrackingReport{
	static UTM_TRACKING_REPORT = 'TrackingLeadDetail/';
	static UTM_TRACKING_REPORT_LIST = 'List';
	static GET_UTM_TRACKING_FILTERS = "GetAllFilterDataForTrackingLeadDetail";
	static UTM_TRACKING_LEAD_DETAIL_REPORT = 'TrackingLeadDetailPopUP/';
	static UTM_TRACKING_LEAD_DETAIL_REPORT_LIST = 'PopUPList'
}


export class ClientPortalTrackingReport{
	static CLIENT_PORTAL_TRACKING_FILTER="ClientPortalTrackingDetails/Filters";
	static CLIENT_PORTAL_TRACKING_LIST="ClientPortalTrackingDetails/List";
	static CLIENT_PORTAL_TRACKING_POPUP_LIST="ClientPortalTrackingDetails/PopUPList";
	static EMAIL_SUBJECT_FILTER = 'EmailSubjectFilters'
}

export class RegisterSteps{
	static  GET_ROLE_HIRING_DETAILS = 'GetRoleAndHiringTypeDetails';
	static  SAVEROLEANDHIRINGTYPEDETAILS = 'SaveRoleAndHiringTypeDetails';
	static  GETTALENTSROLES = 'GetTalentsRoles';
	static TEXTEXTRACTION = 'TextExtraction/';
	// static EXTRACTTEXT = 'ExtractTextUsingPython';
	static EXTRACTTEXT = 'ExtractTextUsingclaudAI';
	static EXTRACTTEXTAI = 'ExtractTextUsingclaudAI';
	static GET_SKILLS_AND_BUDGET = 'GetSkillAndBudgetDetails';
	static GET_SKILLS = 'GetSkills';
	static GET_CURRENCY = 'GetCurrency';
	static SAVE_SKILLS_AND_BUGET = 'SaveSkillAndBudgetDetails';
	static EMPLOYEEMENTDETAILS = 'EmploymentDetails/';
	static GETACHIEVEMENT  = 'GetAchievementWithUplersReason';
	static SAVEEMPLOYEMENTDETAILS = 'SaveEmploymentDetails';
	static GETTIMEZONEPREFERENCE = 'GetTimeZonePreference';
	static GETTALENTTIMEZONE = 'GetTalentTimeZone';
	static GETSTARTENDTIME  = 'GetStartEndTime';
	static GETCONTACTTIMEZONE = 'GetContactTimeZone';
	static GET_COUNTRY_LIST= 'GetCountryListByCountryCodeOrPostalcode';
	static SAVE_STEPS_INFO = 'SaveStepsInfo';
	static GET_HIRING_TYPE_PRICING = 'GetHiringTypePricing';
	static GET_PAYROLL_TYPE = 'GetPayrollType';
	static FETCH_COUNTRIES_BASED_ON_CITY= 'FetchCountriesBasedonCity';
}