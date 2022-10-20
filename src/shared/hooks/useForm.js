import { ValidateInput } from 'constants/inputValidators';
import { useState } from 'react';

const useForm = (initialFormValues) => {
	const [formValues, setFormValues] = useState({ ...initialFormValues });
	const [error, setError] = useState({ ...initialFormValues });

	const validateInputHandler = (flag, name = '', value = '') => {
		let tempError = { ...error };

		if (flag === 1) {
			Object.entries(formValues).forEach((entry) => {
				const [key, value] = entry;
				switchValidator(key, value, tempError);
			});
		}
		if (flag === 0) {
			switchValidator(name, value, tempError);
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
				let b = ValidateInput.password(value);
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

	const inputChangeHandler = (e) => {
		setFormValues({ ...formValues, [e.target.name]: e.target.value });
		validateInputHandler(0, e.target.name, e.target.value);
	};

	const onSubmitHandler = () => {
		validateInputHandler(1);
	};

	return { inputChangeHandler, formValues, error, onSubmitHandler };
};

export default useForm;
