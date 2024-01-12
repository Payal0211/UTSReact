import { message , Modal} from 'antd';
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
import UTSRoutes, { isAccess } from 'constants/routes';
import WithLoader from 'shared/components/loader/loader';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import { useForm } from 'react-hook-form';
import  UTSLogoSVG  from 'assets/svg/UTSLogo.svg'
import { useCookies } from 'react-cookie'

const LoginScreen = () => {
	const [isLoading, setLoading] = useState(false);
	const [cookies, setCookie, removeCookie] = useCookies(['uplers_user']);
	const [togglePasswordVisibility, onTogglePassword] = useIconToggle();
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		setError,
		watch,
		formState: { errors },
	} = useForm({});

	const {
		register:forgotEmailRegister,
		handleSubmit:forgotEmailHandler,
		setError:forgotEmailSetError,
		watch:forgotEmailWatch,
		formState: { errors: forgotEmailErrors },
	} = useForm({});
	const [messageAPI, contextHolder] = message.useMessage();
	const [showForgotPassword,setShowForgotPassword] = useState(false)

	const loginHandler = useCallback(
		async (d) => {
			setLoading(true);
			const result = await userDAO.loginDAO({
				username: d?.username,
				password: d?.password,
			});

			if (result.statusCode === HTTPStatusCode.OK) {
				setLoading(false);
				navigate(isAccess(result.responseBody.LoggedInUserTypeID) ? UTSRoutes.ALLHIRINGREQUESTROUTE : UTSRoutes.DASHBOARD);
				// set cookie uplers_user for 1 year
				const oneYearFromNow = new Date();
  				oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
				setCookie('uplers_user', result.responseBody.EmployeeID,{
					expires: oneYearFromNow,
					path: '/', 
				  })

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
	const handleKeyDown = (e) => {
		if (e.key === 'Enter')
			loginHandler({
				username: watch('username'),
				password: watch('password'),
			});
	};

	useEffect(() => {
		let login = UserSessionManagementController.getAPIKey();
		if (login) navigate(UTSRoutes.ALLHIRINGREQUESTROUTE);
	}, [navigate]);


	const sendResetLink = async (d) =>{
		console.log("link to send reset",d)
	}

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
									// src="https://staging.project-progress.net/html/uplers-talent-solutions/images/login-logo.svg"
									src={UTSLogoSVG}
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
										onKeyDownHandler={(e) => handleKeyDown(e)}
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
								
									{/* <div className={loginStyle.forgotPassword} onClick={()=>setShowForgotPassword(true)}>
										Forgot Password ?
									</div>							 */}

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
				<Modal
                centered
                open={showForgotPassword} 
                // onOk={handleOk} 
                onCancel={() => setShowForgotPassword(false)}
                width={716}
				footer={false}
                className="customModal forgotPassModal"
            >
            <div className="modalContent">
                <div className='termConditionTopText'>
                    <h1>Forgot password? Reset it</h1>
                    <h4>Fear not we’ll email you instructions and the link to reset your password on your registered email address</h4>
                </div>
                <form className="formFields">
                    <div className="row">
                        <div className="col-12">
                            <div  className={`form-group ${errors.forgotEmail ? "error" : ""}`}>                                
                                {/* <label>Enter your registered email address to receive your password reset link</label> */}
								<HRInputField
									label="Enter your registered email address to receive your password reset link"
									name="userEmail"
									type={InputType.EMAIL}
									register={forgotEmailRegister}
									placeholder="Enter Email"
									errors={forgotEmailErrors}
									validationSchema={{
										required: 'please enter the email.',
										validate: (value) => {
											let emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
											if(!emailRegex.test(value)){
												return "Please enter valid email address"
											}
										  },
									}}
									required
								/>
                                {/* <input type="text" className="form-control" name="email" />
                                {errors?.forgotEmail && <span className='error'>{errors.forgotEmail}</span>} */}
                            </div>
                        </div>
                    </div>
                </form>
                <div className={loginStyle.forgotPassBtnWrap}>
                    <a className={loginStyle.forgotLink} onClick={() => setShowForgotPassword(false)}>GO BACK TO LOGIN</a>
                    <button type="button" className={loginStyle.btnPrimary} onClick={forgotEmailHandler(sendResetLink)}>Send Password Reset link</button>
                </div>                
            </div>            
            </Modal>          
			</WithLoader>
		</Fragment>
	);
};

export default LoginScreen;
