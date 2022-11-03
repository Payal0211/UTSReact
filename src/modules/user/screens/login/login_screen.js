import { useRef } from 'react';
import { InputType } from 'constants/application';
import ButtonField from 'modules/user/components/buttonField/button_field';
import InputField from 'modules/user/components/inputField/input_field';
import useIconToggle from 'shared/hooks/useIconToggle';
import {
	PasswordIconAiFillEye,
	PasswordIconAiFillEyeInvisible,
} from 'shared/utils/password_icon_utils';
import loginStyle from './login.module.css';
import useForm from 'shared/hooks/useForm';
import { _isNull } from 'shared/utils/basic_utils';
import { userDAO } from 'core/user/userDAO';
import { HTTPStatusCode } from 'constants/network';
import { useHistory } from 'react-router-dom';
import Routes from 'constants/routes';

const LoginScreen = () => {
	const [togglePasswordVisibility, onTogglePassword] = useIconToggle();
	const history=useHistory();
	const userLoginInfo = useRef({
		username: '',
		password: '',
	});
	const { inputChangeHandler, formValues, error, onSubmitHandler } = useForm(
		userLoginInfo.current,
		
	);
	
	const loginHandler = async () => {
		onSubmitHandler();
		console.log(formValues);
		const result = await userDAO.loginDAO(formValues);
		if(result.statusCode===HTTPStatusCode.OK){
			history.push(Routes.HOMEROUTE)
		}
	}

	return (
		<div className={loginStyle.loginContainer}>
			<div className={loginStyle.loginColumn_1}>
				<div className={loginStyle.loginColumn_1_Body}>
					<span>
						<img
							className={loginStyle.uplersTalentLogo}
							src="https://staging.project-progress.net/html/uplers-talent-solutions/images/login-logo.svg"
						/>
					</span>
					<div className={loginStyle.welcomePart}>
						<h1 className={loginStyle.welcomeTitle}>Welcome Back !</h1>
						<p className={loginStyle.welcomeSubtitle}>
							Please enter your log in information and get started
						</p>
					</div>
					<br />
					<hr />
					<div className={loginStyle.loginFormPart}>
						<InputField
							label="Username"
							name="username"
							type={InputType.TEXT}
							placeholder="Enter username"
							value={formValues['username']}
							onChangeHandler={inputChangeHandler}
							errorMsg={error['username']}
						/>
						<InputField
							name="password"
							label="Password"
							type={
								togglePasswordVisibility ? InputType.PASSWORD : InputType.TEXT
							}
							placeholder="Enter password"
							onChangeHandler={inputChangeHandler}
							value={formValues['password']}
							errorMsg={error['password']}
							onIconToggleHandler={onTogglePassword}
							trailingIcon={
								togglePasswordVisibility ? (
									<PasswordIconAiFillEyeInvisible />
								) : (
									<PasswordIconAiFillEye />
								)
							}
						/>
						<div className={loginStyle.forgotpassword}>Forgot Password ?</div>
						<hr />
						<br />
						<ButtonField
							label="Log In"
							backgroundColor={`var(--color-sunlight)`}
							onClickHandler={loginHandler}
						/>
					</div>
				</div>
			</div>
			<div className={loginStyle.loginColumn_2}>
				<div className={loginStyle.loginHeadline}>
					<h1>
						“Customers will never love a company until the employees love it
						first.”
					</h1>
				</div>
			</div>
		</div>
	);
};

export default LoginScreen;
