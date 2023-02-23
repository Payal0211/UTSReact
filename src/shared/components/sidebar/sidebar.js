import { Link, useLocation } from 'react-router-dom';
import { ReactComponent as GridSVG } from 'assets/svg/grid.svg';
import { ReactComponent as DashboardSVG } from 'assets/svg/dashboard.svg';

import { ReactComponent as BriefCaseSVG } from 'assets/svg/briefcase.svg';
import { ReactComponent as HandShakeSVG } from 'assets/svg/handshake.svg';
import { ReactComponent as HRSVG } from 'assets/svg/hr.svg';

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
				{sidebarDataSets?.map((item, index) => {
					return (
						<div
							className={sideBarStyles.sidebarItem}
							key={index}>
							<Link to={item.navigateTo}>
								<div className={sideBarStyles.iconSet}>
									<div
										className={`${sideBarStyles.sidebarIcon} ${
											switchLocation.pathname === item.navigateTo
												? sideBarStyles.active
												: ''
										}`}>
										{item.icon}
									</div>
								</div>
							</Link>
							<div
								className={`${
									urlSplitter === item.navigateTo
										? sideBarStyles.indicator
										: null
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
			icon: <GridSVG />,
			navigateTo: UTSRoutes.HOMEROUTE,
		}),

		new SideBarModels({
			id: 'UTS_all_hiring_request',
			title: 'allHiringRequest',
			isActive: false,
			icon: <HRSVG />,
			navigateTo: UTSRoutes.ALLHIRINGREQUESTROUTE,
		}),
		/* new SideBarModels({
			id: 'UTS_Interview',
			title: 'interviewList',
			isActive: false,
			icon: <DashboardSVG />,
			navigateTo: UTSRoutes.INTERVIEWLISTROUTE,
		}), */
		new SideBarModels({
			id: 'UTS_DealList',
			title: 'dealList',
			isActive: false,
			icon: <HandShakeSVG />,
			navigateTo: UTSRoutes.DEALLISTROUTE,
		}),
		new SideBarModels({
			id: 'UTS_UserList',
			title: 'userList',
			isActive: false,
			icon: <DashboardSVG />,
			navigateTo: UTSRoutes.USERLISTROUTE,
		}),
	];
	return dataList;
};

export default Sidebar;
