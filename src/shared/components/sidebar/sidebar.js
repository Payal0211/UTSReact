import { Link, Route, useLocation } from 'react-router-dom';
import { ReactComponent as GridSVG } from 'assets/svg/grid.svg';
import { ReactComponent as DashboardSVG } from 'assets/svg/dashboard.svg';
import Routes from 'constants/routes';
import SideBarModels from 'models/sidebar.model';
import sideBarStyles from './sidebar.module.css';

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
			id: 1,
			title: 'dashboard',
			isActive: true,
			icon: <GridSVG />,
			navigateTo: Routes.HOMEROUTE,
		}),

		new SideBarModels({
			id: 4,
			title: 'allHiringRequest',
			isActive: false,
			icon: <DashboardSVG />,
			navigateTo: Routes.ALLHIRINGREQUESTROUTE,
		}),
	];
	return dataList;
};

export default Sidebar;
