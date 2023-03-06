import { Link, useLocation } from 'react-router-dom';
import GridSVG from 'assets/svg/grid.svg';

import HR from 'assets/svg/hr.svg';
import Briefcase from 'assets/svg/briefcase.svg';
import Handshake from 'assets/svg/handshake.svg';

import SideBarModels from 'models/sidebar.model';
import sideBarStyles from './sidebar.module.css';
import UTSRoutes from 'constants/routes';

const Sidebar = () => {
	const sidebarDataSets = getSideBar();
	const switchLocation = useLocation();

	let urlSplitter = `/${switchLocation.pathname.split('/')[1]}`;

	return (
		<div className={sideBarStyles.sidebar}>
			<div className={sideBarStyles.sidebarBody}>
				{sidebarDataSets?.map(({ navigateTo, icon }, index) => {
					return (
						<div
							className={sideBarStyles.sidebarItem}
							key={index}>
							<Link to={navigateTo}>
								<div className={sideBarStyles.iconSet}>
									<div
										className={`${sideBarStyles.sidebarIcon} ${
											switchLocation.pathname === navigateTo
												? sideBarStyles.active
												: ''
										}`}>
										<img
											src={icon}
											alt="mySvgImage"
										/>
									</div>
								</div>
							</Link>
							<div
								className={`${
									urlSplitter === navigateTo ? sideBarStyles.indicator : null
								}`}></div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

const getSideBar = () => {
	let dataList = [
		new SideBarModels({
			id: 'UTS_dashboard',
			title: 'dashboard',
			isActive: true,
			icon: GridSVG,
			navigateTo: UTSRoutes.HOMEROUTE,
		}),
		new SideBarModels({
			id: 'UTS_all_hiring_request',
			title: 'allHiringRequest',
			isActive: false,
			icon: Briefcase,
			navigateTo: UTSRoutes.ALLHIRINGREQUESTROUTE,
		}),

		new SideBarModels({
			id: 'UTS_DealList',
			title: 'dealList',
			isActive: false,
			icon: Handshake,
			navigateTo: UTSRoutes.DEALLISTROUTE,
		}),
		new SideBarModels({
			id: 'UTS_UserList',
			title: 'userList',
			isActive: false,
			icon: HR,
			navigateTo: UTSRoutes.USERLISTROUTE,
		}),
		new SideBarModels({
			id: 'UTS_Onboard',
			title: 'onboardUser',
			isActive: false,
			icon: HR,
			navigateTo: UTSRoutes.ONBOARDROUTE,
		}),
	];
	return dataList;
};

export default Sidebar;
