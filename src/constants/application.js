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

export class UploadFileType {
	static ANY = 0;
	static PDF = 1;
	static IMAGE = 2;
	static DOC = 3;
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
	static FEEDBACK = 12;
	static REJECTED = 22;
	static SELECTED = 51;
}
