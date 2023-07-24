import {useState, useEffect} from 'react'
import { Link, useLocation } from 'react-router-dom';

import HR from 'assets/svg/hr.svg';
import Handshake from 'assets/svg/handshake.svg';

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
import I2sIcon from 'assets/svg/i2sIcon.svg';
import clientReport from  'assets/svg/clientReport.svg';
import HRReport from 'assets/svg/clientLogs.svg'

import SLAReport from 'assets/svg/slaReport.svg';
import SideBarModels from 'models/sidebar.model';
import sideBarStyles from './sidebar.module.css';
import UTSRoutes from 'constants/routes';
import { Tooltip } from 'antd';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';

const Sidebar = () => {

	const switchLocation = useLocation();
	const [userData, setUserData] = useState({});

	useEffect(() => {
		const getUserResult = async () => {
			let userData = UserSessionManagementController.getUserSession();
			if (userData) setUserData(userData);
		};
		getUserResult();
	}, []);
	//let isMenuvisible = (userData?.LoggedInUserTypeID === 1 || userData?.LoggedInUserTypeID === 2) ? true: false;
	
	const sidebarDataSets = getSideBar(userData?.LoggedInUserTypeID);
	let urlSplitter = `/${switchLocation.pathname.split('/')[1]}`;

	return (
		<div className={sideBarStyles.sidebar}>
			<div className={sideBarStyles.sidebarBody}>
				{sidebarDataSets?.map(
					({ navigateTo, icon, title, isChildren, branch , isVisible }, index) => {
						if(isVisible === false){
							return null
						}
						return (
							<Tooltip
								key={index}
								placement="right"
								title={!isChildren && title}>
								<div
									className={sideBarStyles.sidebarItem}
									key={index}>
									<Link to={!isChildren && navigateTo}>
										{/* <div className={sideBarStyles.}> */}
										<div className={`${sideBarStyles.iconSet} ${
												switchLocation.pathname === navigateTo
													? sideBarStyles.active
													: ''
											}`}>
											<div
												className={sideBarStyles.sidebarIcon}>
												<img
													src={icon}
													alt="mySvgImage"
												/>
												<span>{title}</span>
												<div
													className={`${
														urlSplitter === navigateTo
															? sideBarStyles.indicator
															: sideBarStyles.transparentIndicator
													}`}>
												</div>
											</div>
											{isChildren && (
												<div className={sideBarStyles.sideBarSubmenu}>
													{/* <h3>Masters</h3> */}
													{branch?.length > 0 &&
														branch?.map((item) => {
															return (
																<Link to={item?.navigateTo}>
																	<img src={item?.icon} />
																	{item?.title}
																</Link>
															);
														})}
												</div>
											)}
										</div>
										
									</Link>

									{/* {isChildren && (
										<div className={sideBarStyles.sideBarSubmenu}>
											<h3>Masters</h3>
											{branch?.length > 0 &&
												branch?.map((item) => {
													return (
														<Link to={item?.navigateTo}>
															<img src={item?.icon} />
															{item?.title}
														</Link>
													);
												})}
										</div>
									)} */}
								</div>
							</Tooltip>
						);
					},
				)}
			</div>
		</div>
	);
};

const isAccess = (ID, title) =>{
	let isVisible = false;

	if(ID === 2){
		return true
	}

	if(title === 'Hiring Request' || 
	title === 'Users' || 
	title === 'Engagement' || 
	title === 'Demand Funnel' || 
	title === 'SLA Report' || 
	title === 'Client Report' || 
	title === 'I2S Report' || title === 'Master' || title === 'Deal' || title === 'HR Report'){

		isVisible = (ID === 1 || ID === 4 || ID === 5 || ID === 9 || ID === 10 || ID === 11 || ID === 12 || ID === 6)  
		
	}else{ 
		return false
	}
	return isVisible
}

const getSideBar = (usertypeID) => {
	let dataList = [
		new SideBarModels({
			id: 'UTS_all_hiring_request',
			title: 'Hiring Request',
			isActive: false,
			icon: Briefcase,                                                                                                                    
			navigateTo: UTSRoutes.ALLHIRINGREQUESTROUTE,
			isChildren: false,
			branch: [],
			isVisible: isAccess(usertypeID,'Hiring Request')
		}),
		new SideBarModels({
			id: 'UTS_DealList',
			title: 'Deal',
			isActive: false,
			icon: Handshake,
			navigateTo: UTSRoutes.DEALLISTROUTE,
			isChildren: false,
			branch: [],
			isVisible: isAccess(usertypeID,'Deal')
		}),
		new SideBarModels({
			id: 'UTS_UserList',
			title: 'Users',
			isActive: false,
			icon: HR,
			navigateTo: UTSRoutes.USERLISTROUTE,
			isChildren: false,
			branch: [],
			isVisible: isAccess(usertypeID, 'Users')
		}),

		new SideBarModels({
			id: 'Engagement_List',
			title: 'Engagement',
			isActive: false,
			icon: EngagementDashboard,
			navigateTo: UTSRoutes.ENGAGEMENTRROUTE,
			isChildren: false,
			branch: [],
			isVisible: isAccess(usertypeID, 'Engagement')
		}),

		new SideBarModels({
			id: 'demand_funnel_report',
			title: 'Demand Funnel',
			isActive: false,
			icon: DemandFunnel,
			navigateTo: UTSRoutes.DEMANDFUNNELROUTE,
			isChildren: false,
			branch: [],
			isVisible: isAccess(usertypeID, 'Demand Funnel')
		}),
		new SideBarModels({
			id: 'supply_funnel_report',
			title: 'Supply Funnel',
			isActive: false,
			icon: SupplyFunnel,
			navigateTo: UTSRoutes.SUPPLYFUNNELROUTE,
			isChildren: false,
			branch: [],
			isVisible:isAccess(usertypeID,'Supply Funnel')
		}),

		new SideBarModels({
			id: 'team_demand_funnel_report',
			title: 'Team Demand Funnel',
			isActive: false,
			icon: TeamDemandFunnel,
			navigateTo: UTSRoutes.TEAMDEMANDFUNNELROUTE,
			isChildren: false,
			branch: [],
			isVisible:isAccess(usertypeID,'Team Demand Funnel')
		}),
		new SideBarModels({
			id: 'incentive_report',
			title: 'Incentive Report',
			isActive: false,
			icon: Invoice,
			navigateTo: UTSRoutes.INCENTIVEREPORTROUTE,
			isChildren: false,
			branch: [],
			isVisible:isAccess(usertypeID,'Incentive Report')
		}),
		new SideBarModels({
			id: 'JD_Efficiency_Report',
			title: 'JD Efficiency Report',
			isActive: false,
			icon: JDEfficiencyReport,
			navigateTo: UTSRoutes.JDDUMPREPORTROUTE,
			isChildren: false,
			branch: [],
			isVisible:isAccess(usertypeID, 'JD Efficiency Report')
		}),
		new SideBarModels({
			id: 'SLA_Report',
			title: 'SLA Report',
			isActive: false,
			icon: SLAReport,
			navigateTo: UTSRoutes.SLA_REPORT,
			isVisible: isAccess(usertypeID, 'SLA Report')
		}),
		new SideBarModels({
			id: 'ClientReport',
			title: 'Client Report',
			isActive: false,
			icon: clientReport,
			navigateTo: UTSRoutes.CLIENT_REPORT,
			isVisible: isAccess(usertypeID, 'Client Report')
		}),
		new SideBarModels({
			id: 'HRReport',
			title: 'HR Report',
			isActive: false,
			icon: HRReport,
			navigateTo: UTSRoutes.HR_REPORT,
			isVisible: isAccess(usertypeID, 'HR Report')
		}),
		new SideBarModels({
			id: 'I2SReport',
			title: 'I2S Report',
			isActive: false,
			icon: I2sIcon,
			navigateTo: UTSRoutes.I2S_REPORT,
			isVisible: isAccess(usertypeID, 'I2S Report')
		}),
		new SideBarModels({
			id: 'Master',
			title: 'Master',
			isActive: false,
			icon: MastersIcon,
			isChildren: true,
			navigateTo: '/master',
			isVisible:isAccess(usertypeID,'Master'),
			branch: [
				new SideBarModels({
					id: 'Master_Country_List',
					title: 'Country',
					isActive: false,
					icon: GlobIcon,
					navigateTo: UTSRoutes.MASTERCOUNTRYROUTE,
					isChildren: false,
					branch: [],
				}),
				new SideBarModels({
					id: 'Master_Currency_List',
					title: 'Currency',
					isActive: false,
					icon: MedalIcon,
					navigateTo: UTSRoutes.MASTERCURRENCYROUTE,
					isChildren: false,
					branch: [],
				}),
			],
		}),
	];

	return dataList;
};

export default Sidebar;
