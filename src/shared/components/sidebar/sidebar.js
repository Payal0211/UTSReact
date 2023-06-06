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
import MedalIcon from 'assets/svg/medalIcon.svg';
import GlobIcon from 'assets/svg/globIcon.svg';
import MastersIcon from 'assets/svg/mastersIcon.svg';
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
				{sidebarDataSets?.map(({ navigateTo, icon, title, isChildren, branch }, index) => {
					return (
						<Tooltip
							key={index}
							placement="right"
							title={!isChildren && title}>
							<div
								className={sideBarStyles.sidebarItem}
								key={index}>
								<Link to={!isChildren && navigateTo}>
									<div className={sideBarStyles.iconSet}>
										<div
											className={`${sideBarStyles.sidebarIcon} ${switchLocation.pathname === navigateTo
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
									className={`${urlSplitter === navigateTo
										? sideBarStyles.indicator
										: sideBarStyles.transparentIndicator
										}`}></div>

								{isChildren && <div className={sideBarStyles.sideBarSubmenu}>
									<h3>Masters</h3>
									{branch?.length > 0 && branch?.map((item) => {
										return <Link to={item?.navigateTo}><img src={item?.icon} />{item?.title}</Link>
									})}
								</div>}

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

		new SideBarModels({
			id: 'UTS_all_hiring_request',
			title: 'Hiring Request',
			isActive: false,
			icon: Briefcase,
			navigateTo: UTSRoutes.ALLHIRINGREQUESTROUTE,
			isChildren: false,
			branch: []
		}),
		new SideBarModels({
			id: 'UTS_DealList',
			title: 'Deal',
			isActive: false,
			icon: Handshake,
			navigateTo: UTSRoutes.DEALLISTROUTE,
			isChildren: false,
			branch: []
		}),
		new SideBarModels({
			id: 'UTS_UserList',
			title: 'Users',
			isActive: false,
			icon: HR,
			navigateTo: UTSRoutes.USERLISTROUTE,
			isChildren: false,
			branch: []
		}),

		new SideBarModels({
			id: 'Engagement_List',
			title: 'Engagement',
			isActive: false,
			icon: EngagementDashboard,
			navigateTo: UTSRoutes.ENGAGEMENTRROUTE,
			isChildren: false,
			branch: []
		}),

		new SideBarModels({
			id: 'demand_funnel_report',
			title: 'Demand Funnel',
			isActive: false,
			icon: DemandFunnel,
			navigateTo: UTSRoutes.DEMANDFUNNELROUTE,
			isChildren: false,
			branch: []
		}),
		new SideBarModels({
			id: 'supply_funnel_report',
			title: 'Supply Funnel',
			isActive: false,
			icon: SupplyFunnel,
			navigateTo: UTSRoutes.SUPPLYFUNNELROUTE,
			isChildren: false,
			branch: []
		}),

		new SideBarModels({
			id: 'team_demand_funnel_report',
			title: 'Team Demand Funnel',
			isActive: false,
			icon: TeamDemandFunnel,
			navigateTo: UTSRoutes.TEAMDEMANDFUNNELROUTE,
			isChildren: false,
			branch: []
		}),
		new SideBarModels({
			id: 'incentive_report',
			title: 'Incentive Report',
			isActive: false,
			icon: Invoice,
			navigateTo: UTSRoutes.INCENTIVEREPORTROUTE,
			isChildren: false,
			branch: []
		}),
		new SideBarModels({
			id: 'JD_Efficiency_Report',
			title: 'JD Efficiency Report',
			isActive: false,
			icon: JDEfficiencyReport,
			navigateTo: UTSRoutes.JDDUMPREPORTROUTE,
			isChildren: false,
			branch: []
		}),
		new SideBarModels({
			id: 'SLA_Report',
			title: 'SLA Report',
			isActive: false,
			icon: JDEfficiencyReport,
			navigateTo: UTSRoutes.SLA_REPORT,
		}),
		new SideBarModels({
			id: 'Master',
			title: 'Master',
			isActive: false,
			icon: MastersIcon,
			isChildren: true,
			navigateTo: '/master',
			branch: [
				new SideBarModels({
					id: 'Master_Country_List',
					title: 'Country',
					isActive: false,
					icon: GlobIcon,
					navigateTo: UTSRoutes.MASTERCOUNTRYROUTE,
					isChildren: false,
					branch: []
				}),
				new SideBarModels({
					id: 'Master_Currency_List',
					title: 'Currency',
					isActive: false,
					icon: MedalIcon,
					navigateTo: UTSRoutes.MASTERCURRENCYROUTE,
					isChildren: false,
					branch: []
				}),
			]
		}),


	];

	return dataList;
};

export default Sidebar;
