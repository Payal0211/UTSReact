import {useState, useEffect} from 'react'
import { Link, useLocation } from 'react-router-dom';
import HR from 'assets/svg/hr.svg';
import { ReactComponent as ArrowDownSVG } from 'assets/svg/arrowDown.svg';
import Briefcase from 'assets/svg/briefcase.svg';
import DemandFunnel from 'assets/svg/demandFunnel.svg';
import SupplyFunnel from 'assets/svg/supplyFunnel.svg';
import TeamDemandFunnel from 'assets/svg/teamDemandFunnel.svg';
import ClientHappinessSurveyFunnel from 'assets/svg/Clienthapppy.svg';
import EngagementDashboard from 'assets/svg/engagementDashboard.svg';
import EngagementReport from 'assets/svg/engagementReport.png';
import ClipBoardIcon from 'assets/svg/clipboard.svg'
import RecruiterReportIcon from 'assets/svg/recruiterReport.svg'
import MedalIcon from 'assets/svg/medalIcon.svg';
import GlobIcon from 'assets/svg/globIcon.svg';
import MastersIcon from 'assets/svg/mastersIcon.svg';
import I2sIcon from 'assets/svg/i2sIcon.svg';
import clientReport from  'assets/svg/clientReport.svg';
import TalentDocIcon from 'assets/svg/talent-doc.png'
import HRReport from 'assets/svg/clientLogs.svg'
import UTMTrackingIcon from 'assets/UTMtracking report.png'
import ClientDetailsIcon from 'assets/Clienttracking details.png'
import EmailTracking from 'assets/svg/emailTrack.svg'
import ReplacementIcon from 'assets/Talentreplacement.png'
import AMDashboardIcon from 'assets/svg/amdashboard.png'
import TalentBackoutIcon from 'assets/Talentbackout.png'
import HRLOSTReoprt from 'assets/svg/hrLostReport.svg'
import HandShake from 'assets/svg/postStepIconInterview.svg'
import TADashboardIcon from 'assets/svg/ta-dashboard.svg'
import ClientCompIcon from 'assets/clientCompany.png'
import SLAReport from 'assets/svg/slaReport.svg';
import AMReportIcon from 'assets/svg/amreport.svg';
import InvoiceIcon from 'assets/invoice.png';
import SideBarModels from 'models/sidebar.model';
import sideBarStyles from './sidebar.module.css';
import UTSRoutes from 'constants/routes';
import { Tooltip } from 'antd';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';

const Sidebar = () => {

	const switchLocation = useLocation();
	const [userData, setUserData] = useState({});
	// const [searchMenu,setSearchMenu] = useState('');

	useEffect(() => {
		const getUserResult = async () => {
			let userData = UserSessionManagementController.getUserSession();
			if (userData) setUserData(userData);
		};
		getUserResult();
	}, []);
	//let isMenuvisible = (userData?.LoggedInUserTypeID === 1 || userData?.LoggedInUserTypeID === 2) ? true: false;

	const ChildrenList = ({hookprops,index}) =>{
		const [isOpen,setIsOpen] = useState(false)
		const {navigateTo, icon, title, isChildren, branch  } = hookprops

		const isMenuActive = branch.find(item=> item.navigateTo === switchLocation.pathname)?.navigateTo === switchLocation.pathname

        return 		<Tooltip
								key={index}
								placement="right"
								title={!isChildren && title}>
								<div
									className={`${sideBarStyles.sidebarItem} newSidebarItemClsadding`}

									key={index}>
									<div className={`${sideBarStyles.atagCop} newSidebarMenuClsadding`}>
										{/* <div className={sideBarStyles.}> */}
										<div className={`${sideBarStyles.iconSet} ${
												isMenuActive
													? sideBarStyles.active
													: ''
											}`}
											
											>
											<div
												className={sideBarStyles.sidebarIcon}  onClick={()=>{setIsOpen(prev=> !prev)}}>
												<img
													src={icon}
													alt="mySvgImage"
													width='24px'
													height='24px'
												/>
												
													<span>{title}</span>
													<ArrowDownSVG style={{ width: '16px',marginLeft:'auto',transform: isOpen ? 'rotate(180deg)' :'rotate(0deg)' }} />
												
												<div
													className={`${
														isMenuActive
															? sideBarStyles.indicator
															: sideBarStyles.transparentIndicator
													}`}>
												</div>
											</div>
											
										</div>
										
									</div>

									{(isChildren && isOpen) && (
												<div className={`${sideBarStyles.sideBarSubmenu} newSidebarMenuSubMenuClsadding`}
												>
													{/* <h3>Masters</h3> */}
													{branch?.length > 0 &&
														branch?.map((item) => {
															if(item.isVisible === false ){
																return null
															}
															return (
																<Link to={item?.navigateTo}>
																	{/* <img src={item?.icon} 
																	 width='24px'
																	 height='24px'/> */}
																	{item?.title}
																	<div
																	className={`${
																		switchLocation.pathname  === item?.navigateTo
																			? sideBarStyles.indicator
																			: sideBarStyles.transparentIndicator
																	}`}>
																</div>
																</Link>
															);
														})}
												</div>
											)}
								</div>
							</Tooltip>
	}
	
	const sidebarDataSets = getSideBar(userData?.LoggedInUserTypeID,userData?.EmployeeID,userData?.ShowRevenueRelatedData);
	let urlSplitter = `/${switchLocation.pathname.split('/')[1]}`;

	// const searchedMenueList = sidebarDataSets.filter(menu=>{
	// 	if(menu.title.toLowerCase().includes(searchMenu.toLowerCase())){
	// 		return menu
	// 	}else{
	// 		if(menu.branch.length > 0){
	// 			menu.branch.forEach(branch=> {
	// 				if(branch.title.toLowerCase().includes(searchMenu.toLowerCase())){
	// 					return menu
	// 				}
	// 			})
	// 		}
	// 	}
	// })

	return (
		<div className={sideBarStyles.sidebar}>
			<div className={sideBarStyles.sidebarBody}>

			{/* <div className={sideBarStyles.searchFilterSet}>
                        <SearchSVG style={{ width: "16px", height: "16px" }} />
                        <input
                          type={InputType.TEXT}
                          className={sideBarStyles.searchInput}
                          placeholder="Search Table"
                          value={searchMenu}
                          onChange={(e) => {
                            // setopenTicketSearchText(e.target.value);
                            setSearchMenu(e.target.value);
                          }}
                        />
                        {searchMenu && (
                          <CloseSVG
                            style={{
                              width: "16px",
                              height: "16px",
                              cursor: "pointer",
                            }}
                            onClick={() => {
							setSearchMenu("");
                            }}
                          />
                        )}
                      </div> */}
				{sidebarDataSets?.map(
					({ navigateTo, icon, title, isChildren, branch , isVisible }, index) => {
						if(isVisible === false ){
							return null
						}

						if(isChildren){
							return <ChildrenList hookprops={{navigateTo, icon, title, isChildren, branch , isVisible }} index={index} />
						}
						// if(title === "Dashboard" && userData?.LoggedInUserTypeID !== 2 && userData.UserId !== 27 ){
						// 	return null
						// }
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
													width='24px'
													height='24px'
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
											{/* {isChildren && (
												<div className={sideBarStyles.sideBarSubmenu}>
													{/* <h3>Masters</h3> 
													{branch?.length > 0 &&
														branch?.map((item) => {
															if(item.isVisible === false ){
																return null
															}
															return (
																<Link to={item?.navigateTo}>
																	<img src={item?.icon} 
																	 width='24px'
																	 height='24px'/>
																	{item?.title}
																</Link>
															);
														})}
												</div>
											)} */}
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

const isAccess = (ID, title, ShowRevenueRelatedData) =>{
	let isVisible = false;

	if(title === 'Invoice' || title === 'invoice' || title === 'Customer' ){
		isVisible = (ID === 3 || ID === 2 || ID === 1) ? true : false;
		return isVisible
	}
	if(title ==='amInterviews' || title ==='omReport' || title ==='amReport' || title ==='companyCategory' || title ==='PotentialClosuresSheet'|| title ==='DailyBusinessNumbers'  || title ==='Screen & Interview Reject Count' ){
		isVisible =  (ID === 4 || ID===9 || ID=== 10 || ID===1 || ID===2) ? true : false
		// isVisible = true
		return isVisible	
	}
	if (title === 'Revenue'){
		// isVisible =  (ID === 1 || ID === 4  || ID === 9 )?true : false;
		isVisible = ShowRevenueRelatedData
		return isVisible	
	}
	// if ((title === 'Chat GPT Response' || title === "Replacement") && ID === 1 ){
	// 	isVisible =  true	
	// 	return isVisible	
	// }	
	if(title === 'TA Dashboard'){
		isVisible =  (ID === 1 || ID === 5 ||  ID === 10 || ID === 2 || ID === 9 || ID === 11 || ID === 4)?true : false;
		return isVisible
	}
	if(title === 'Recruiter' || title === 'ClientDashboard' || title === 'immediateJoiner' || title === 'taDashboardReport' || title === 'DailySnapshot' || title === 'RecruiterDashboard' || title === 'interviewReschedule' || title  === 'averageSLA' ){
		isVisible =  true;
		return isVisible
	}



	if(title === "AM Dashboard"){
		isVisible =  (ID === 1 || ID === 4 || ID === 3 || ID === 6 || ID === 9 || ID === 10 || ID === 11 || ID === 12 )?true : false;
		return isVisible
	}

	if ((  title === "AM Dashboard" || title === 'Master'   || title === 'Talent' || title === 'Currency' || title === 'Documents/SLA' || title === 'Talent Documents')
		  && ID === 6){
		isVisible =  true
		return isVisible		
	}
	if (( title === 'Engagement' || title === "AM Dashboard"  ||  title === 'Talent' || title === 'Master' || title === 'Currency' || title === 'Documents/SLA' || title === 'Talent Documents')
		  && ID === 3){
		isVisible =  true
		return isVisible		
	}
	 if(title === 'Hiring Request' || title === "MasterReports" ||
	  title === 'Users'  ||
	   title === 'Analytics' || title === 'Documents/SLA' || title === 'Tracking Reports' ||
	 title === 'Engagement' || title === 'Reports' ||
	 title === 'Demand Funnel' ||
	 title === 'SLA Report' || title === 'Notes' ||
	 title === 'Client' || title === 'JD Efficiency Report' || title === 'Incentive Report' ||
	 title === 'I2S' || title === 'Master' || title ===  'Deal' || title === 'HR' || title ===  'UTM Tracking Report' ||
	 title === 'Client Happiness Survey' ||  title === 'Team Demand Funnel' || title === 'Client Tracking Details' || title === 'Email Tracking Details' || title === 'Talent' || title === 'Talent Documents'
	|| title === 'Clients' || title === 'HR Lost' || title === 'Supply Funnel' || title === "Backout"  || title === 'Country' || title === 'Role' || title === 'TimeZone' || title === 'Currency' || title === 'Leave'|| title === 'TA Goal') {

		isVisible =  (ID === 1 || ID === 4 || ID === 5 || ID === 9 || ID === 10 || ID === 11 || ID === 12 )?true : false;
		return isVisible
		
	}
	return isVisible
}



const getSideBar = (usertypeID,EmployeeID,ShowRevenueRelatedData) => {
	let dataList = EmployeeID === "UP1302AM" ? [new SideBarModels({
		id: 'UTS_all_hiring_request',
		title: 'Hiring Request',
		isActive: false,
		icon: Briefcase,                                                                                                                    
		navigateTo: UTSRoutes.ALLHIRINGREQUESTROUTE,
		isChildren: false,
		branch: [],
		isVisible: isAccess(usertypeID,'Hiring Request')
	})] : [
		 new SideBarModels({
			id: 'UTS_AM_Dashboard',
			title: 'AM Dashboard',
			isActive: false,
			icon: AMDashboardIcon ,                                                                                                                    
			navigateTo: UTSRoutes.AMDASHBOARD,
			isChildren: false,
			branch: [],
			isVisible: isAccess(usertypeID,'AM Dashboard')
		}),
		new SideBarModels({
			id: 'UTS_TA_Dashboard',
			title: 'TA Dashboard',
			isActive: false,
			icon: TADashboardIcon ,                                                                                                                    
			navigateTo: UTSRoutes.TADASHBOARD,
			isChildren: false,
			branch: [],
			isVisible: isAccess(usertypeID,'TA Dashboard')
		}),
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
		// new SideBarModels({
		// 	id: 'UTS_DealList',
		// 	title: 'Deal',
		// 	isActive: false,
		// 	icon: Handshake,
		// 	navigateTo: UTSRoutes.DEALLISTROUTE,
		// 	isChildren: false,
		// 	branch: [],
		// 	isVisible: isAccess(usertypeID,'Deal')
		// }),
		new SideBarModels({
			id: 'UTS_AllClients',
			title: 'Company/Client',
			isActive: false,
			icon:ClientCompIcon,
			navigateTo: UTSRoutes.ALLCLIENTS,
			isChildren: false,
			branch: [],
			isVisible: isAccess(usertypeID,'Clients')
		}),
		new SideBarModels({
			id: 'engagementReport',
			title: 'Engagement',
			isActive: false,
			icon: EngagementReport,
			navigateTo: UTSRoutes.ONBOARD,
			isVisible: isAccess(usertypeID, 'Engagement')
		}),
		new SideBarModels({
			id: 'Engagement_List',
			title: 'Engagement Dashboard',
			isActive: false,
			icon: HandShake,
			navigateTo: UTSRoutes.ENGAGEMENTRROUTE,
			isChildren: false,
			branch: [],
			isVisible: isAccess(usertypeID, 'Engagement Dashboard')
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
			id: 'taReport',
			title: 'TA Report',
			isActive: false,
			icon: RecruiterReportIcon,			
			isChildren: true,
			branch:[
				new SideBarModels({
					id: 'taDashboardReport',
					title: 'TA Dashboard',
					isActive: false,
					navigateTo: UTSRoutes.TADASHBOARDREPORT,
					isVisible: isAccess(usertypeID, 'taDashboardReport'),
					isChildren : false					
				}),
				new SideBarModels({
					id: 'DailySnapshot',
					title: 'Daily Snapshot',
					isActive: false,
					navigateTo: UTSRoutes.DAILYSNAPSHOT,
					isVisible: isAccess(usertypeID, 'DailySnapshot'),
					isChildren : false					
				}),
				new SideBarModels({
					id: 'Recruiter',
					title: 'Recruiter',
					isActive: false,
					navigateTo: UTSRoutes.RECRUITERREPORT,
					isVisible: isAccess(usertypeID, 'Recruiter'),
					isChildren : false					
				}),
					new SideBarModels({
					id: 'RecruiterDashboard',
					title: 'Recruiter Dashboard',
					isActive: false,
					navigateTo: UTSRoutes.RECRUITER_DASHBOARD_REPORT,
					isVisible: isAccess(usertypeID, 'RecruiterDashboard'),
					isChildren : false					
				}),
				new SideBarModels({
					id: 'immediateJoiner',
					title: 'Talent Joining',
					isActive: false,
					navigateTo: UTSRoutes.IMMEDIATEJOINER,
					isVisible: isAccess(usertypeID, 'immediateJoiner'),
					isChildren : false					
				}),
				new SideBarModels({
					id: 'interviewReschedule',
					title: 'Interview Reschedule',
					isActive: false,
					navigateTo: UTSRoutes.CLIENT_INTERVIEW_RESCHEDULE,
					isVisible: isAccess(usertypeID, 'interviewReschedule'),
					isChildren : false					
				}),
				new SideBarModels({
					id: 'averageSLA',
					title: 'Average SLA',
					isActive: false,
					navigateTo: UTSRoutes.AVERAGE_SLA,
					isVisible: isAccess(usertypeID, 'averageSLA'),
					isChildren : false					
				}),
				new SideBarModels({
					id: 'ClientDashboard',
					title: 'Client Dashboard',
					isActive: false,
					navigateTo: UTSRoutes.CLIENT_DASHBOARD_REPORT,
					isVisible: isAccess(usertypeID, 'ClientDashboard'),
					isChildren : false					
				})
			]
		}),

		new SideBarModels({
			id: 'omReport',
			title: 'OM Report',
			isActive: false,
			icon: AMReportIcon,
			isChildren: true,
			branch: [
				new SideBarModels({
					id: 'amInterviews',
					title: 'AM Wise Interview Count',
					isActive: false,
					navigateTo: UTSRoutes.AM_INTERVIEW,
					isVisible: isAccess(usertypeID, 'amInterviews'),
					isChildren : false					
				}),
				new SideBarModels({
					id: 'screenInterviewReject',
					title: 'Screen & Interview Reject Count',
					isActive: false,
					navigateTo: UTSRoutes.SCREENING_INTERVIEW_REJECT,
					isVisible: isAccess(usertypeID, 'Screen & Interview Reject Count')
				}),
				new SideBarModels({
					id: 'dailyBusinessNumbers',
					title: 'Revenue Report',
					isActive: false,
					navigateTo: UTSRoutes.DAILY_BUSINESS_NUMBERS,
					isVisible: isAccess(usertypeID, 'DailyBusinessNumbers')
				}),
				new SideBarModels({
					id: 'potentialClosuresSheet',
					title: 'Potential Closures List',
					isActive: false,
					navigateTo: UTSRoutes.POTENTIAL_CLOSURES_SHEET,
					isVisible: isAccess(usertypeID, 'PotentialClosuresSheet')
				}),
				new SideBarModels({
					id: 'amReport',
					title: 'AM Report',
					isActive: false,
					navigateTo: UTSRoutes.AM_REPORT,
					isVisible: isAccess(usertypeID, 'amReport')
				}),
				new SideBarModels({
					id: 'companyCategory',
					title: 'Company Category',
					isActive: false,
					navigateTo: UTSRoutes.COMPANY_CATEGORY,
					isVisible: isAccess(usertypeID, 'companyCategory')
				}),
			],
			isVisible: isAccess(usertypeID, 'omReport')
		}),
      
		new SideBarModels({
			id: 'Talent',
			title: 'Talent',
			isActive: false,
			icon: ClipBoardIcon,			
			isChildren: true,
			branch:[				
				new SideBarModels({
					id: 'talentReport',
					title: 'Deployed/Rejected',
					isActive: false,
					icon: ClipBoardIcon,
					navigateTo: UTSRoutes.TALENT_REPORT,
					isVisible: isAccess(usertypeID, 'Talent'),
					isChildren : false					
				}),
				new SideBarModels({
					id: 'TalentBackoutReport',
					title: 'Backout',
					isActive: false,
					icon: TalentBackoutIcon,
					navigateTo: UTSRoutes.TALENT_BACKOUT_REPORT,
					isVisible: isAccess(usertypeID, 'Backout')
				}),
				new SideBarModels({
					id: 'talentDocuments',
					title: 'Documents',
					isActive: false,
					icon: TalentDocIcon,
					navigateTo: UTSRoutes.TALENT_DOCUMENTS,
					isVisible: isAccess(usertypeID, 'Talent Documents')
				}),
				new SideBarModels({
					id: 'talentNotes',
					title: 'Eng. Notes',
					isActive: false,
					icon: TalentDocIcon,
					navigateTo: UTSRoutes.TALENT_NOTES,
					isVisible: isAccess(usertypeID, 'Notes')
				}),
				new SideBarModels({
					id: 'ReplacementReport',
					title: 'Replacement',
					isActive: false,
					icon: ReplacementIcon,
					navigateTo: UTSRoutes.REPLACEMENT_REPORT,
					isVisible: isAccess(usertypeID, 'Replacement')
				}),			
			],
			isVisible: isAccess(usertypeID, 'Talent'),
		}),

		new SideBarModels({
			id: 'invoice',
			title: 'Invoice',
			isActive: false,
			icon: InvoiceIcon,
			isChildren: true,
			branch: [
				new SideBarModels({
					id: 'InvoiceReport',
					title: 'Zoho Invoices',
					isActive: false,
					navigateTo: UTSRoutes.Invoice,
					isVisible: isAccess(usertypeID, 'Invoice')
				}),
				new SideBarModels({
					id: 'customer',
					title: 'Zoho Customer',
					isActive: false,
					navigateTo: UTSRoutes.Customer,
					isVisible: isAccess(usertypeID, 'Customer')
				}),
			],
			isVisible: isAccess(usertypeID, 'invoice')
		}),

		new SideBarModels({
			id: 'Reports',
			title: 'Reports',
			isActive: false,
			icon: HRReport,			
			isChildren: true,
			branch: [		
				new SideBarModels({
					id: 'Revenue_Report',
					title: 'Revenue',
					isActive: false,
					icon: SLAReport,
					navigateTo: UTSRoutes.REVENUE_REPORT,
					isVisible: isAccess(usertypeID, 'Revenue',ShowRevenueRelatedData)
				}),
				
				new SideBarModels({
					id: 'LeaveReport',
					title: 'Leave',
					isActive: false,
					icon: clientReport,
					navigateTo: UTSRoutes.Leave,
					isVisible: isAccess(usertypeID, 'Leave')
				}),
				new SideBarModels({
					id: 'ClientReport',
					title: 'Client',
					isActive: false,
					icon: clientReport,
					navigateTo: UTSRoutes.CLIENT_REPORT,
					isVisible: isAccess(usertypeID, 'Client')
				}),
				new SideBarModels({
					id: 'HRReport',
					title: 'HR',
					isActive: false,
					icon: HRReport,
					navigateTo: UTSRoutes.HR_REPORT,
					isVisible: isAccess(usertypeID, 'HR')
				}),
				new SideBarModels({
					id: 'I2SReport',
					title: 'I2S',
					isActive: false,
					icon: I2sIcon,
					navigateTo: UTSRoutes.I2S_REPORT,
					isVisible: isAccess(usertypeID, 'I2S')
				}),
				new SideBarModels({
					id: 'HRLostReport',
					title: 'HR Lost',
					isActive: false,
					icon: HRLOSTReoprt,
					navigateTo: UTSRoutes.HRLostReoprt,
					isVisible: isAccess(usertypeID, 'HR Lost')
				}),
				new SideBarModels({
					id: 'SLA_Report',
					title: 'SLA Report',
					isActive: false,
					icon: SLAReport,
					navigateTo: UTSRoutes.SLA_REPORT,
					isVisible: isAccess(usertypeID, 'SLA Report')
				}),
				
				// new SideBarModels({
				// 	id: 'incentive_report',
				// 	title: 'Incentive Report',
				// 	isActive: false,
				// 	icon: Invoice,
				// 	navigateTo: UTSRoutes.INCENTIVEREPORTROUTE,
				// 	isChildren: false,
				// 	branch: [],
				// 	isVisible:isAccess(usertypeID,'Incentive Report')
				// }),
				// new SideBarModels({
				// 	id: 'JD_Efficiency_Report',
				// 	title: 'JD Efficiency Report',
				// 	isActive: false,
				// 	icon: JDEfficiencyReport,
				// 	navigateTo: UTSRoutes.JDDUMPREPORTROUTE,
				// 	isChildren: false,
				// 	branch: [],
				// 	isVisible:isAccess(usertypeID, 'JD Efficiency Report')
				// }),
			],
			isVisible: isAccess(usertypeID, 'Reports')
		}),
		new SideBarModels({
			id: 'Analytics',
			title: 'Analytics',
			isActive: false,
			icon: EngagementDashboard,			
			isChildren: true,			
			isVisible: isAccess(usertypeID, 'Analytics'),
			branch: [
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
					id: 'client_happiness_survey',
					title: 'Client Happiness Survey',
					isActive: false,
					icon: ClientHappinessSurveyFunnel,
					navigateTo: UTSRoutes.CLIENT_HAPPINESS_SURVEY,
					isChildren: false,
					branch: [],
					isVisible:isAccess(usertypeID,'Client Happiness Survey')
				}),	
				
				
			]
		}),
		// new SideBarModels({
		// 	id: 'talentReports',
		// 	title: 'Documents/SLA',
		// 	isActive: false,
		// 	icon: ClipBoardIcon,			
		// 	isVisible: isAccess(usertypeID, 'Documents/SLA'),
		// 	isChildren : true,
		// 	branch:[
						
		// 	]
		// }),
		
		
		
		
		// new SideBarModels({
				// 	id: 'chatGPTResponse',
				// 	title: 'Chat GPT Response',
				// 	isActive: false,
				// 	icon: GPTIcon,
				// 	navigateTo: UTSRoutes.CHAT_GPT_RESPONSE,
				// 	isVisible: isAccess(usertypeID, 'Chat GPT Response')
				// }),
		
		
		new SideBarModels({
			id: 'TrackingReports',
			title: 'Tracking Reports',
			isActive: false,
			icon: UTMTrackingIcon,
			navigateTo: UTSRoutes.UTM_TRACKING_REPORT,
			isVisible: isAccess(usertypeID, 'Tracking Reports'),
			isChildren: true,
			branch:[
				new SideBarModels({
					id: 'UTMTrackingReport',
					title: 'UTM',
					isActive: false,
					icon: UTMTrackingIcon,
					navigateTo: UTSRoutes.UTM_TRACKING_REPORT,
					isVisible: isAccess(usertypeID, 'UTM Tracking Report')
				}),
				new SideBarModels({
					id: 'ClientPortalTrackingReport',
					title: 'Client',
					isActive: false,
					icon: ClientDetailsIcon,
					navigateTo: UTSRoutes.CLIENT_PORTAL_TRACKING_REPORT,
					isVisible: isAccess(usertypeID, 'Client Tracking Details')
				}),
				new SideBarModels({
					id: 'EmailTrackingReport',
					title: 'Email',
					isActive: false,
					icon: EmailTracking,
					navigateTo: UTSRoutes.EMAIL_TRACKING_REOPRT,
					isVisible: isAccess(usertypeID, 'Email Tracking Details')
				}),
			]
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
					title: 'TA Goal',
					isActive: false,
					icon: GlobIcon,
					navigateTo: UTSRoutes.MASTERTAGOAL,
					isChildren: false,
					branch: [],
					isVisible:isAccess(usertypeID,'TA Goal'),
				}),
				new SideBarModels({
					id: 'Master_Country_List',
					title: 'Country',
					isActive: false,
					icon: GlobIcon,
					navigateTo: UTSRoutes.MASTERCOUNTRYROUTE,
					isChildren: false,
					branch: [],
					isVisible:isAccess(usertypeID,'Country'),
				}),
				new SideBarModels({
					id: 'Master_Currency_List',
					title: 'Currency',
					isActive: false,
					icon: MedalIcon,
					navigateTo: UTSRoutes.MASTERCURRENCYROUTE,
					isChildren: false,
					branch: [],
					isVisible:isAccess(usertypeID,'Currency'),
				}),
				new SideBarModels({
					id: 'Master_Role_List',
					title: 'Role',
					isActive: false,
					icon: GlobIcon,
					navigateTo: UTSRoutes.MASTERROLE,
					isChildren: false,
					branch: [],
					isVisible:isAccess(usertypeID,'Role'),
				}),
				new SideBarModels({
					id: 'Master_Timezone',
					title: 'TimeZone',
					isActive: false,
					icon: GlobIcon,
					navigateTo: UTSRoutes.MASTERTIMEZONE,
					isChildren: false,
					branch: [],
					isVisible:isAccess(usertypeID,'TimeZone'),
				}),
			],
		}),
	];

	return dataList;
};

export default Sidebar;
