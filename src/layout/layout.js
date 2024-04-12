import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from 'shared/components/navbar/navbar';
import Sidebar from 'shared/components/sidebar/sidebar';

import { BsDisplay } from 'react-icons/bs';
import { ChatListing } from 'widget-demo-chat';
import UTSFeedback from 'modules/utsFeedback/utsFeedback';


const Layout = () => {
	const [userData, setUserData] = useState({});

	useEffect(() => {
		const getUserResult = async () => {
			let userData = UserSessionManagementController.getUserSession();
			if (userData) setUserData(userData);
		};
		getUserResult();
	}, []);

	return (
		<div>
			<Navbar fullName={userData?.FullName} />
			<Sidebar />
			<main
				style={{
					paddingTop: '80px',
					paddingLeft: '60px',
					width: '100%',
				}}>
				<Outlet />
				<UTSFeedback />
			</main>
			{/* {(userData?.LoggedInUserTypeID === 2 || userData?.EmployeeID === "UP1302AM") && <ChatListing />} */}
		</div>
	);
};

export default Layout;
