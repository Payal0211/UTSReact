import navbarStyles from './navbar.module.css';
import { AiOutlineBell } from 'react-icons/ai';
import { MdLogout } from 'react-icons/md';
import { userDAO } from 'core/user/userDAO';
import { useNavigate } from 'react-router-dom';
import UTSRoutes from 'constants/routes';
import { Tooltip } from 'antd';

const Navbar = ({ fullName }) => {
	const navigation = useNavigate();
	const onLogoutHandler = async () => {
		const res = await userDAO.logoutDAO();
		if (res) navigation(UTSRoutes.LOGINROUTE);
	};
	return (
		<div className={navbarStyles.navbarContainer}>
			<nav className={navbarStyles.nav}>
				<div
					id="logo"
					className={navbarStyles.navHeading}>
					<a href="#">
						<img
							className={navbarStyles.uplersTalentLogo}
							src="https://staging.project-progress.net/html/uplers-talent-solutions/images/login-logo.svg"
						/>
					</a>
					<div className={navbarStyles.activeTalent}>
						<span className={navbarStyles.talentIndicator}></span>
						<div>
							<b>299/300</b> Active Talent Deployed
						</div>
					</div>
				</div>
				<div className={navbarStyles.navlink}>
					<AiOutlineBell
						style={{
							color: `var(--background-color-dark)`,
							fontSize: `var(--fontsize-trim)`,
						}}
					/>
					<img
						src="https://www.w3schools.com/howto/img_avatar.png"
						className={navbarStyles.avatar}
						alt="avatar"
					/>
					<div className={navbarStyles.avatarDetails}>{fullName}</div>
					<Tooltip
						title="Logout"
						color={`var(--color-sunlight)`}>
						<MdLogout
							onClick={onLogoutHandler}
							style={{
								color: `var(--background-color-dark)`,
								fontSize: `var(--fontsize-trim)`,
								cursor: 'pointer',
							}}
						/>
					</Tooltip>
				</div>
			</nav>
		</div>
	);
};

export default Navbar;
