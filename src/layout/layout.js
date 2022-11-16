import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from 'shared/components/navbar/navbar';
import Sidebar from 'shared/components/sidebar/sidebar';

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
			<div style={{ display: 'flex' }}>
				<Sidebar />
				<main
					style={{
						marginTop: '150px',
						marginLeft: '90px',
						width: '100%',
					}}>
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default Layout;
