import { FormType } from 'constants/application';
import { ValidateInput } from 'constants/inputValidators';
import { useState } from 'react';

const useForm = (initialFormValues) => {
	const [formValues, setFormValues] = useState({ ...initialFormValues });
	const [error, setError] = useState({ ...initialFormValues });

	const validateInputHandler = (
		flag,
		formType = 'onboarding',
		name = '',
		value = '',
	) => {
		let tempError = { ...error };

		if (flag === 1) {
			if (formType === FormType.ONBOARDING) {
				Object.entries(formValues).forEach((entry) => {
					const [key, value] = entry;
					switchValidator(key, value, tempError);
				});
			} else {
				Object.entries(formValues).forEach((entry) => {
					const [key, value] = entry;
					miscValidator(key, value, tempError);
				});
			}
		}
		if (flag === 0) {
			if (formType === FormType.ONBOARDING) {
				switchValidator(name, value, tempError);
			} else {
				miscValidator(name, value, tempError);
			}
		}
		setError(tempError);
	};

	const switchValidator = (name, value, tempError) => {
		switch (name) {
			case 'username': {
				let a = ValidateInput.required(value);
				let b = ValidateInput.username(value);
				if (a.errorMsg) tempError['username'] = a.errorMsg;
				else tempError['username'] = b.errorMsg;
				break;
			}
			case 'email': {
				let a = ValidateInput.required(value);
				let b = ValidateInput.email(value);
				if (a.errorMsg) tempError['email'] = a.errorMsg;
				else tempError['email'] = b.errorMsg;
				break;
			}
			case 'password': {
				let a = ValidateInput.required(value);
				let b = ValidateInput.required(value);
				if (a.errorMsg) tempError['password'] = a.errorMsg;
				else tempError['password'] = b.errorMsg;
				break;
			}
			case 'updatedPassword': {
				let a = ValidateInput.required(value);
				let b = ValidateInput.password(value);
				if (a.errorMsg) tempError['updatedPassword'] = a.errorMsg;
				else tempError['updatedPassword'] = b.errorMsg;
				break;
			}
			case 'otp': {
				let a = ValidateInput.required(value);
				let b = ValidateInput.OTP(value);
				if (a.errorMsg) tempError['otp'] = a.errorMsg;
				else tempError['otp'] = b.errorMsg;
				break;
			}
			default:
				break;
		}
	};
	const miscValidator = (name, value, tempError) => {
		switch (name) {
			case 'clientName': {
				let a = ValidateInput.required(value, 'client email/name');
				if (a.errorMsg) tempError['clientName'] = a.errorMsg;
				break;
			}
			case 'companyName': {
				let a = ValidateInput.required(value, 'company name');
				if (a.errorMsg) tempError['companyName'] = a.errorMsg;
				break;
			}
			case 'hrTitle': {
				let a = ValidateInput.required(value, 'hiring request title');
				if (a.errorMsg) tempError['hrTitle'] = a.errorMsg;
				break;
			}
			case 'companyURL': {
				let a = ValidateInput.required(value, 'company URL');
				if (a.errorMsg) tempError['companyURL'] = a.errorMsg;
				break;
			}
			case 'companySize': {
				let a = ValidateInput.required(value, 'company size');
				if (a.errorMsg) tempError['companySize'] = a.errorMsg;
				break;
			}
			case 'companyAddress': {
				let a = ValidateInput.required(value, 'company address');
				if (a.errorMsg) tempError['companyAddress'] = a.errorMsg;
				break;
			}
			case 'linkedinProfile': {
				let a = ValidateInput.required(value, 'linkedin profile');
				if (a.errorMsg) tempError['linkedinProfile'] = a.errorMsg;
				break;
			}
			default:
				break;
		}
	};

	const inputChangeHandler = (e) => {
		setFormValues({ ...formValues, [e.target.name]: e.target.value });
		validateInputHandler(0, e.target.name, e.target.value);
	};

	const onSubmitHandler = (e, formType) => {
		validateInputHandler(1, formType);
	};

	return { inputChangeHandler, formValues, error, onSubmitHandler };
};

export default useForm;
