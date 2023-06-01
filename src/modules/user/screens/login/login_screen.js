import { message } from 'antd';
import { useEffect, useState, useCallback, Fragment } from 'react';
import { InputType } from 'constants/application';
import ButtonField from 'modules/user/components/buttonField/button_field';
import useIconToggle from 'shared/hooks/useIconToggle';
import {
	PasswordIconAiFillEye,
	PasswordIconAiFillEyeInvisible,
} from 'shared/utils/password_icon_utils';
import loginStyle from './login.module.css';
import { userDAO } from 'core/user/userDAO';
import { HTTPStatusCode } from 'constants/network';
import { useNavigate } from 'react-router-dom';
import UTSRoutes from 'constants/routes';
import WithLoader from 'shared/components/loader/loader';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import { useForm } from 'react-hook-form';

const LoginScreen = () => {
	const [isLoading, setLoading] = useState(false);
	const [togglePasswordVisibility, onTogglePassword] = useIconToggle();
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({});
	const [messageAPI, contextHolder] = message.useMessage();
	const loginHandler = useCallback(
		async (d) => {
			setLoading(true);
			const result = await userDAO.loginDAO({
				username: d?.username,
				password: d?.password,
			});
			if (result.statusCode === HTTPStatusCode.OK) {
				setLoading(false);
				navigate(UTSRoutes.ALLHIRINGREQUESTROUTE);
			} else {
				setLoading(false);
				messageAPI.open(
					{
						type: 'error',
						content: result?.responseBody || 'Something went wrong.',
					},
					1000,
				);
				navigate(UTSRoutes.LOGINROUTE);
			}
		},
		[messageAPI, navigate],
	);

	useEffect(() => {
		let login = UserSessionManagementController.getAPIKey();
		if (login) navigate(UTSRoutes.ALLHIRINGREQUESTROUTE);
	}, [navigate]);

	return (
		<Fragment>
			{contextHolder}
			<WithLoader
				className="mainLoader"
				showLoader={isLoading}>
				<div className={loginStyle.loginContainer}>
					<div className={loginStyle.loginColumn_1}>
						<div className={loginStyle.loginColumn_1_Body}>
							<div className={loginStyle.loginLogo}>
								<img
									alt="avatar"
									className={loginStyle.uplersTalentLogo}
									src="https://staging.project-progress.net/html/uplers-talent-solutions/images/login-logo.svg"
								/>
							</div>
							<div className={loginStyle.welcomePart}>
								<h1 className={loginStyle.welcomeTitle}>Welcome</h1>
								<p className={loginStyle.welcomeSubtitle}>
									Please enter your log in information and get started
								</p>
							</div>
							<div className={loginStyle.loginFormPart}>
								<HRInputField
									label="Username"
									name="username"
									type={InputType.TEXT}
									register={register}
									placeholder="Enter username"
									errors={errors}
									validationSchema={{
										required: 'please enter the username.',
									}}
									required
								/>

								<div className={loginStyle.loginPasswordField}>
									<HRInputField
										label="Password"
										name="password"
										type={
											togglePasswordVisibility
												? InputType.PASSWORD
												: InputType.TEXT
										}
										register={register}
										placeholder="Enter password"
										errors={errors}
										validationSchema={{
											required: 'please enter the password.',
										}}
										onIconHandler={onTogglePassword}
										trailingIcon={
											togglePasswordVisibility ? (
												<PasswordIconAiFillEyeInvisible />
											) : (
												<PasswordIconAiFillEye />
											)
										}
										required
									/>
								</div>

								<div className={loginStyle.forgotPassword}>
									Forgot Password ?
								</div>

								<div className={loginStyle.loginAction}>
									<ButtonField
										label="Log In"
										backgroundColor={`var(--color-sunlight)`}
										onClickHandler={handleSubmit(loginHandler)}
									/>
								</div>
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
		</Fragment>
	);
};

export default LoginScreen;
