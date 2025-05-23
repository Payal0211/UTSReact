export class AccountStatus {
	static ACTIVE = 0;
	static DELETED = 1;
	static DISABLED = 2;
}
export class Emoji {
	static redCross = '❌';
	static caution = '⚠️';
	static shoutOut = '📢';
	static link = '🔗';
	static description = '📒';
}

export class OnboardingType {
	static LOGIN = 'LOGIN';
	static SIGNUP = 'SIGNUP';
}
export class AccountInitFrom {
	static SELF = 0;
	static GOOGLE = 1;
}
export class AccountVerified {
	static NOT_VERIFIED = 0;
	static VERIFIED = 1;
}
export class NotificationStatus {
	static UNREAD = 0;
	static READ = 1;
}
export class UserAccountRole {
	static ADMINISTRATOR = 1;
	static DEVELOPER = 2;
	static LEGAL = 3;
	static SALES = 4;
	static TALENTOPS = 5;
	static RESUME_WRITER = 6;
	static PRACTIVE_HEAD = 7;
	static FINANCE_EXECUTIVE = 8;
	static SALES_MANAGER = 9;
	static OPS_TEAM_MANAGER = 10;
	static BDR = 11;
	static MARKETING = 12;
}

export class GoogleDriveCredentials {
	static clientID =
		'643188410943-pqbg632ja9hji6qoia62p5bnjanir9t9.apps.googleusercontent.com';
	static developerKey = 'AIzaSyCW6lF0-A6JCVWjOJRVlwN4F1OA3zaOwJw';
}
export class AdHOCHR {
	static POOL = 'Pool';
	static ODR = 'ODR';
	static BOTH = 'ODR + Pool';
}
export class SessionType {
	static EXPIRED = 0;
	static ACTIVE = 1;
	static NEWUSER = 2;
}

export class VerificationType {
	static ACCOUNT_VERIFICATION = 0;
	static FORGOT_PASSWORD = 1;
}

export const PasswordRegEx = {
	digit: '(?=.*[0-9])',
	lowercaseLetter: '(?=.*[a-z])',
	uppercaseLetter: '(?=.*[A-Z])',
	specialCharacter: '(?=.*[!@#\\$%\\^&\\*])',
	length: '(?=.{8,15})',
};

export const EmailRegEx = {
	email:
		/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
};
export const URLRegEx = {
	url:/^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
};

export const validateUrl = (url) => {
    const pattern = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(url);
};

export const validateLinkedInURL = (url) => {
	const pattern = /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|pub)\/[a-zA-Z0-9_-]+\/?$/;
    return pattern.test(url);
}

export const ValidateFieldURL = (url, field) => {
    if(url !==""){
    if (field === "website") {
		const pattern =  /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+(\.[a-zA-Z]{2,})?\/?\/?.*$/i;
       
        if(pattern.test(url)){
          
            return true
        }else{
        
            return false
        }
    } else if (field === "linkedin") {
        const pattern =/^(http(s)?:\/\/)?([\w]+\.)?linkedin\.com\/(pub|in|profile|company)\/[A-z0-9_-]+\/?/i;;    
        
        if(pattern.test(url)){
          
            return true
        }else{
            
            return false
        }
    }
}
};
export const UsernameRegEx = {
	length: '(?=.{4,15})',
};
export const OTPRegEx = {
	length: '(?=.{6,6})',
};

export class FormType {
	static ONBOARDING = 'onboarding';
	static HRFIELD = 'hrfield';
	static CLIENTFIELD = 'clientfield';
}
export class AddNewType {
	static CLIENT = 'Add New Client';
	static HR = 'Add New HR';
	static DIRECT_HR = 'Add New Direct HR'
	static DEBRIEFING = 'debriefingHR';
}

export class TalentOnboardStatus {
	static SCHEDULE_INTERVIEW = 'ScheduleInterview';
	static RESCHEDULE_INTERVIEW = 'RescheduleInterview';
	static TALENT_STATUS = 'TalentStatus';
	static INTERVIEW_STATUS = 'InterviewStatus';	
	static UPDATE_TALENT_ON_BOARD_STATUS = 'UpdateTalentOnBoardStatus';
	static REPLACE_TALENT = 'ReplaceTalent';	
	static CONFIRM_SLOT = 'ConfirmSlot';
	static CANCEL_ENGAGEMENT = 'CancelEngagement';	
	static ANOTHER_ROUND_INTERVIEW = 'AnotherRoundInterview';
	static SUBMIT_AS_HIRE = "SubmitClientFeedback";
	static REJECT_TALENT = "TalentStatus";
	static REJECT_TALENT_NO_HIRE = "SubmitFeedbackWithNoHire";
	static SCHEDULE_ANOTHER_ROUND_INTERVIEW = 'Schedule Another Interview Round';
	
	static CONFIRM_CONTRACT_DETAILS = "GotoOnBoard";
	static UPDATE_LEGAL = "UpdateLegalClientOnBoardStatus";
	static RELEASE_OFFER_DETAILS = "GotoOnBoard"
	static VIEW_ENGAGEMENT = 'ViewEngagement'	
	static MOVE_TO_ANOTHER_ROUND = 'SubmitFeedbackWithAnotherRound'
	static MOVE_TO_ASSESSMENT = "Assessment"
	// static GO_TO_ONBOARD = "GotoOnBoard"
	// static UPDATE_LEGAL_TALENT_ONBOARD_STATUS =
	// 	'Update Legal Talent On Board Status';
	// static UPDATE_LEGAL_CLIENT_ONBOARD_STATUS =
	// 	'Update Legal Client On Board Status';
	// static UPDATE_KICKOFF_ONBOARD_STATUS = 'Update Kick Off On Board Status';
	// static SUBMIT_CLIENT_FEEDBACK = 'SubmitClientFeedback';
	// static EDIT_CLIENT_FEEDBACK = 'Edit Client Feedback';
	// static CLONE_HR = 'Clone HR';
	// static TALENT_ACCEPTANCE = 'Talent Acceptance';
	// static UPDATE_KICKOFF = 'Update kickoff & Onboard Status';
	// static ONBOARD_TALENT = 'Onboard Talent';
	// static INTERVIEW_DETAILS = 'Interviewer Details';
	// static UPDATE_CLIENT_ON_BOARD_STATUS = 'Update Client On Board Status';
	// static ASSIGN_TSC = 'AssignTSC'
	// static LEGAL = 'Legal'
}

export class HRCTA {
	static EDIT_HR = 'Edit HR';
	static EDIT_DEBRIEFING_HR = 'Debriefing HR';
	static EDIT_DEBRIEFING_DIRECT_HR = 'Debriefing Direct HR';
	static DEBRIEFING_NR = 'Debriefing NR';
	static CONVERT_TO_DP = 'Convert to DP';
	static CONVERT_TO_CONTRACTUAL = 'Convert to Contractual';
	static AM_ASSIGNMENT = 'AM Assignment';
	static ACCEPT_HR = 'Accept HR';
	static UPDATE_TR = 'UpdateTR';
	static SHARE_PROFILE = 'Share a Profile';
	static ADD_NOTES = 'Add Notes';
	static EDIT_DIRECT_HR = "Edit Direct HR"
}
export class InterviewFeedbackStatus {
	static HIRED = 'Hire';
	static REJECTED = 'Reject';
	static NOHIRE = "NoHire"
}
export class InputType {
	static TEXT = 'text';
	static NUMBER = 'number';
	static PASSWORD = 'password';
	static BUTTON = 'button';
	static FILE = 'file';
	static EMAIL = 'email';
}

export class hiringRequestPriority {
	static NO_PRIORITY = 0;
	static CURRENT_WEEK_PRIORITY = 102;
	static NEXT_WEEK_PRIORITY = 101;
}

export class HiringRequestHRStatus {
	static DRAFT = 101;
	static HR_ACCEPTED = 102;//   Open 
	static ACCEPTANCE_PENDING = 103;//   Closed - Expired 
	static INFO_PENDING = 104;// Active - Reposted    104
	static COMPLETED = 105;//  Closed - Won
	static IN_PROCESS = 106;// Active
	static CANCELLED = 107;// Active - but no longer accepting applicaitons
	static ON_HOLD = 108;// Closed - Cancelled
	static LOST = 109;// Closed - Lost
	static REOPEN = 110
}

export class AnotherRoundInterviewOption {
	static YES = 'Yes';
	static APPEND = 'Append';
	static ADD = 'Add';
}

export class AnotherRoundTimeSlotOption {
	static NOW = 'Now';
	static LATER = 'Later';
}

export class TalentRequestStatus {
	static SELECTED = 301;
	static SHORTLISTED = 302;
	static IN_INTERVIEW = 303;
	static HIRED = 304;
	static CANCELLED = 305;
	static ON_HOLD = 306;
	static REJECTED = 307;
	static REPLACEMENT = 308;
}
export class InterviewStatus {
	static SLOT_GIVEN = 501;
	static CANCELLED = 503;
	static INTERVIEW_SCHEDULED = 504;
	static INTERVIEW_IN_PROCESS = 505;
	static INTERVIEW_COMPLETED = 506;
	static FEEDBACK_SUBMITTED = 507;

	static INTERVIEW_RESCHEDULES = 508;
}

export class HRInterviewStatus {
	static SLOT_GIVEN = 1;
	static CANCELLED = 3;
	static INTERVIEW_SCHEDULED = 4;
	static INTERVIEW_IN_PROCESS = 5;
	static INTERVIEW_COMPLETED = 6;
	static FEEDBACK_SUBMITTED = 7;
	static INTERVIEW_RESCHEDULES = 8;
	static NA = 0;
}
export class DealStageStatus {
	static BOOKING = 101;
	static BOOKING_WITHOUT_INVOICE = 102;
	static ESCALATION = 103;
	static EXTRA = 104;
	static GOAL = 105;
	static HOLD = 106;
	static LOST = 107;
	static OPPORTUNITY = 108;
	static PIPELINE = 109;
	static PITCH_PLANNING = 110;
	static PITCH_PLANNING_TARGETS = 111;
	static PRE_APPROVED_PIPELINE = 112;
	static REALIZATION = 113;
	static WEEKLY_CONVERSION_EXPECTED = 114;
	static WEEKLY_GOAL = 115;
	static NOT_FOUND = 1000;
}
export class ClientStatus {
	static ANOTHER_ROUND = 601;
	static HIRED = 602;
	static NOT_HIRED = 603;
	static ON_HOLD = 604;
}

export class UploadFileType {
	static ANY = 0;
	static PDF = 1;
	static IMAGE = 2;
	static DOC = 3;
}
export class HRDeleteType {
	static ON_HOLD = 1;
	static LOSS = 2;
}
export class DayName {
	static SUNDAY = 'Sunday';
	static MONDAY = 'Monday';
	static TUESDAY = 'Tuesday';
	static WEDNESDAY = 'Wednesday';
	static THURSDAY = 'Thursday';
	static FRIDAY = 'Friday';
	static SATURDAY = 'Saturday';
}

export class SubmitType {
	static SAVE_AS_DRAFT = 0;
	static SUBMIT = 1;
}

export class WorkingMode {
	static REMOTE = 'Remote';
	static HYBRID = 'Hybrid';
	static OFFICE = 'Office';
}

export class ClientHRURL {
	static ADD_NEW_HR = 'addnewhr';
	static ADD_NEW_CLIENT = 'addnewclient';
}

export class MastersKey {
	static AVAILABILITY = 'availability';
	static TIMEZONE = 'timeZonePref';
	static TALENTROLE = 'talentRole';
	static SALESPERSON = 'salesPerson';
}

export class ProfileLog {
	static PROFILE_SHARED = 6;
	static FEEDBACK = 51;
	static REJECTED = 22;
	static SELECTED = 12;
}
