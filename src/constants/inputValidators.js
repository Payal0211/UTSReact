import {
	EmailRegEx,
	OTPRegEx,
	PasswordRegEx,
	UsernameRegEx,
} from './application';

export class ValidateInput {
	static email(value) {
		if (!new RegExp(EmailRegEx.email).test(value)) {
			return {
				isError: true,
				errorMsg: 'Email is not valid.',
			};
		} else {
			return {
				isError: false,
				errorMsg: '',
			};
		}
	}

	static OTP(value) {
		if (!new RegExp(OTPRegEx.length).test(value)) {
			return {
				isError: true,
				errorMsg: 'OTP should be of length 6.',
			};
		} else {
			return {
				isError: false,
				errorMsg: '',
			};
		}
	}
	static username(value) {
		if (!new RegExp(UsernameRegEx.length).test(value)) {
			return {
				isError: true,
				errorMsg: 'Length should be greater than 5.',
			};
		} else {
			return {
				isError: false,
				errorMsg: '',
			};
		}
	}

	static required(value, fieldName = '') {
		if (!value || !value.toString().trim().length) {
			return {
				isError: true,
				errorMsg: `Please enter the ${fieldName}.`,
			};
		} else {
			return {
				isError: false,
				errorMsg: '',
			};
		}
	}

	static password(value) {
		if (!new RegExp(PasswordRegEx.digit).test(value)) {
			return {
				isError: true,
				errorMsg: 'Digit is missing.',
			};
		} else if (!new RegExp(PasswordRegEx.lowercaseLetter).test(value)) {
			return {
				isError: true,
				errorMsg: 'LowercaseLetter is missing.',
			};
		} else if (!new RegExp(PasswordRegEx.uppercaseLetter).test(value)) {
			return {
				isError: true,
				errorMsg: 'UppercaseLetter is missing.',
			};
		} else if (!new RegExp(PasswordRegEx.specialCharacter).test(value)) {
			return {
				isError: true,
				errorMsg: 'Specialcharacter is missing.',
			};
		} else if (!new RegExp(PasswordRegEx.length).test(value)) {
			return {
				isError: true,
				errorMsg: 'Length should be greater than 7.',
			};
		} else {
			return {
				isError: false,
				errorMsg: '',
			};
		}
	}
}
