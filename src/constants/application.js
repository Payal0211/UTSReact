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
	static DEBRIEFING = 'debriefingHR';
}

export class TalentOnboardStatus {
	static SCHEDULE_INTERVIEW = 'Schedule Interview';
	static RESCHEDULE_INTERVIEW = 'Reschedule Interview';
	static TALENT_STATUS = 'Talent Status';
	static TALENT_ACCEPTANCE = 'Talent Acceptance';
	static UPDATE_KICKOFF = 'Update kickoff & Onboard Status';
	static ONBOARD_TALENT = 'Onboard Talent';
	static INTERVIEW_STATUS = 'Interview Status';
	static INTERVIEW_DETAILS = 'Interviewer Details';
	static UPDATE_CLIENT_ON_BOARD_STATUS = 'Update Client On Board Status';
	static UPDATE_TALENT_ON_BOARD_STATUS = 'Update Talent On Board Status';
	static UPDATE_LEGAL_TALENT_ONBOARD_STATUS =
		'Update Legal Talent On Board Status';
	static UPDATE_LEGAL_CLIENT_ONBOARD_STATUS =
		'Update Legal Client On Board Status';
	static UPDATE_KICKOFF_ONBOARD_STATUS = 'Update Kick Off On Board Status';
	static REPLACE_TALENT = 'Replace Talent';
	static CLONE_HR = 'Clone HR';
	static CONFIRM_SLOT = 'Confirm Slot';
	static SUBMIT_CLIENT_FEEDBACK = 'Submit Client Feedback';
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
	static HR_ACCEPTED = 102;
	static ACCEPTANCE_PENDING = 103;
	static INFO_PENDING = 104;
	static COMPLETED = 105;
	static IN_PROCESS = 106;
	static CANCELLED = 107;
	static ON_HOLD = 108;
	static OTHER = 201;
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
