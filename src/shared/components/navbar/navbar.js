import navbarStyles from './navbar.module.css';
import { AiOutlineBell } from 'react-icons/ai';
const Navbar = () => {
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
					<div className={navbarStyles.avatarDetails}>Nital Shah</div>
				</div>
			</nav>
		</div>
	);
};

export default Navbar;
