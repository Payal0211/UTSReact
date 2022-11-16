import { useRef, useEffect, useState } from 'react';
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

import { userDAO } from 'core/user/userDAO';
import { HTTPStatusCode } from 'constants/network';
import { useNavigate } from 'react-router-dom';
import UTSRoutes from 'constants/routes';
import WithLoader from 'shared/components/loader/loader';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';

const LoginScreen = () => {
	const [isLoading, setLoading] = useState(false);
	const [togglePasswordVisibility, onTogglePassword] = useIconToggle();
	const navigate = useNavigate();
	const userLoginInfo = useRef({
		username: '',
		password: '',
	});
	const { inputChangeHandler, formValues, error, onSubmitHandler } = useForm(
		userLoginInfo.current,
	);

	const loginHandler = async (e) => {
		onSubmitHandler();
		setLoading(true);
		const result = await userDAO.loginDAO(formValues);
		if (result.statusCode === HTTPStatusCode.OK) {
			setLoading(false);
			navigate(UTSRoutes.HOMEROUTE);
		}else if(result.statusCode === HTTPStatusCode.BAD_REQUEST){
			setLoading(false);
		}
	};

	useEffect(() => {
		let login = UserSessionManagementController.getAPIKey();
		if (login) navigate(UTSRoutes.HOMEROUTE);
	}, [navigate]);

	return (
		<WithLoader showLoader={isLoading}>
			<div className={loginStyle.loginContainer}>
				<div className={loginStyle.loginColumn_1}>
					<div className={loginStyle.loginColumn_1_Body}>
						<span>
							<img
								alt="avatar"
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
								onClickHandler={(e) => loginHandler()}
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
		</WithLoader>
	);
};

export default LoginScreen;
