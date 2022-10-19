import ButtonField from 'modules/user/components/buttonField/button_field';
import InputField from 'modules/user/components/inputField/input_field';
import loginStyle from './login.module.css';

const LoginScreen = () => {
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
						<InputField label="email" />
						<ButtonField
							label="Log In"
							backgroundColor={`var(--color-sunlight)`}
							onClickHandler={null}
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
