import { Link, useLocation } from 'react-router-dom';
import HRList from 'assets/svg/HRList.svg';
import DealList from 'assets/svg/DealList.svg';
import UserList from 'assets/svg/UserList.svg';
import HR from 'assets/svg/hr.svg';
import Handshake from 'assets/svg/handshake.svg';
import HRDetails from 'assets/svg/HRDetails.svg';
import AddHR from 'assets/svg/addHR.svg';
import Briefcase from 'assets/svg/briefcase.svg';
import DemandFunnel from 'assets/svg/demandFunnel.svg';
import SupplyFunnel from 'assets/svg/supplyFunnel.svg';
import TeamDemandFunnel from 'assets/svg/teamDemandFunnel.svg';
import Invoice from 'assets/svg/invoice.svg';
import EngagementDashboard from 'assets/svg/engagementDashboard.svg';
import JDEfficiencyReport from 'assets/svg/jdEfficiency.svg';
import Masters from 'assets/svg/masters.svg';
// import EngagementList from 'assets/svg/engagement.svg';
// import DemandFunnel from 'assets/svg/demandFunnel.svg';
// import SupplyFunnel from 'assets/svg/supplyFunnel.svg';
// import TeamDemandFunnel from 'assets/svg/teamDemandFunnel.svg';
import IncentiveReport from 'assets/svg/Incentive.svg';
// import JDReport from 'assets/svg/JD.svg';
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
			icon: Briefcase,
			navigateTo: UTSRoutes.ALLHIRINGREQUESTROUTE,
		}),
		new SideBarModels({
			id: 'UTS_DealList',
			title: 'Deal',
			isActive: false,
			icon: Handshake,
			navigateTo: UTSRoutes.DEALLISTROUTE,
		}),
		new SideBarModels({
			id: 'UTS_UserList',
			title: 'Users',
			isActive: false,
			icon: HR,
			navigateTo: UTSRoutes.USERLISTROUTE,
		}),

		new SideBarModels({
			id: 'Engagement_List',
			title: 'Engagement',
			isActive: false,
			icon: EngagementDashboard,
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
			icon: Invoice,
			navigateTo: UTSRoutes.INCENTIVEREPORTROUTE,
		}),
		new SideBarModels({
			id: 'JD_Efficiency_Report',
			title: 'JD Efficiency Report',
			isActive: false,
			icon: JDEfficiencyReport,
			navigateTo: UTSRoutes.JDDUMPREPORTROUTE,
		}),
		new SideBarModels({
			id: 'Master_Country_List',
			title: 'Country',
			isActive: false,
			icon: JDEfficiencyReport,
			navigateTo: UTSRoutes.MASTERCOUNTRYROUTE,
		}),
	];

	return dataList;
};

export default Sidebar;
