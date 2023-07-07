import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from 'shared/components/navbar/navbar';
import Sidebar from 'shared/components/sidebar/sidebar';

import { ReactComponent as LoadingSVG } from 'assets/svg/loading.svg';

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
					paddingTop: '131px',
					paddingLeft: '60px',
					width: '100%',
				}}>
				<Outlet />
			</main>
		</div>
	);
};

export default Layout;
