import { Link, useLocation } from 'react-router-dom';
import HRList from 'assets/svg/HRList.svg';
import DealList from 'assets/svg/DealList.svg';
import UserList from 'assets/svg/UserList.svg';
import Dashboard from 'assets/svg/dashboard.svg';
import EngagementList from 'assets/svg/engagement.svg';
import DemandFunnel from 'assets/svg/demandFunnel.svg';
import SupplyFunnel from 'assets/svg/supplyFunnel.svg';
import TeamDemandFunnel from 'assets/svg/teamDemandFunnel.svg';
import IncentiveReport from 'assets/svg/Incentive.svg';

import SideBarModels from 'models/sidebar.model';
import sideBarStyles from './sidebar.module.css';
import UTSRoutes from 'constants/routes';
import { Tooltip } from 'antd';

const Sidebar = () => {
	const sidebarDataSets = getSideBar();
	const switchLocation = useLocation();

	let urlSplitter = `/${switchLocation.pathname.split('/')[1]}`;

	return (
		<div className={sideBarStyles.sidebar}>
			<div className={sideBarStyles.sidebarBody}>
				{sidebarDataSets?.map(({ navigateTo, icon, title }, index) => {
					return (
						<Tooltip
							key={index}
							placement="right"
							title={title}>
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
										urlSplitter === navigateTo
											? sideBarStyles.indicator
											: sideBarStyles.transparentIndicator
									}`}></div>
							</div>
						</Tooltip>
					);
				})}
			</div>
		</div>
	);
};

const getSideBar = () => {
	let dataList = [
		// new SideBarModels({
		// 	id: 'UTS_dashboard',
		// 	title: 'Dashboard',
		// 	isActive: true,
		// 	icon: Dashboard,
		// 	navigateTo: UTSRoutes.HOMEROUTE,
		// }),
		new SideBarModels({
			id: 'UTS_all_hiring_request',
			title: 'Hiring Request',
			isActive: false,
			icon: HRList,
			navigateTo: UTSRoutes.ALLHIRINGREQUESTROUTE,
		}),
		new SideBarModels({
			id: 'UTS_DealList',
			title: 'Deal',
			isActive: false,
			icon: DealList,
			navigateTo: UTSRoutes.DEALLISTROUTE,
		}),
		new SideBarModels({
			id: 'UTS_UserList',
			title: 'Users',
			isActive: false,
			icon: UserList,
			navigateTo: UTSRoutes.USERLISTROUTE,
		}),

		new SideBarModels({
			id: 'Engagement_List',
			title: 'Engagement',
			isActive: false,
			icon: EngagementList,
			navigateTo: UTSRoutes.ENGAGEMENTRROUTE,
		}),

		new SideBarModels({
			id: 'demand_funnel_report',
			title: 'Demand Funnel',
			isActive: false,
			icon: DemandFunnel,
			navigateTo: UTSRoutes.DEMANDFUNNELROUTE,
		}),
		new SideBarModels({
			id: 'supply_funnel_report',
			title: 'Supply Funnel',
			isActive: false,
			icon: SupplyFunnel,
			navigateTo: UTSRoutes.SUPPLYFUNNELROUTE,
		}),
		new SideBarModels({
			id: 'team_demand_funnel_report',
			title: 'Team Demand Funnel',
			isActive: false,
			icon: TeamDemandFunnel,
			navigateTo: UTSRoutes.TEAMDEMANDFUNNELROUTE,
		}),
		new SideBarModels({
			id: 'incentive_report',
			title: 'Incentive Report',
			isActive: false,
			icon: IncentiveReport,
			navigateTo: UTSRoutes.INCENTIVEREPORTROUTE,
		}),
		new SideBarModels({
			id: 'jd_dump',
			title: 'JD Dump',
			isActive: false,
			icon: IncentiveReport,
			navigateTo: UTSRoutes.JDDUMPREPORTROUTE,
		}),
	];

	return dataList;
};

export default Sidebar;
