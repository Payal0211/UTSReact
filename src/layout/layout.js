import { navigateToComponent } from 'constants/routes';
import { Outlet } from 'react-router-dom';
import Navbar from 'shared/components/navbar/navbar';
import Sidebar from 'shared/components/sidebar/sidebar';

const Layout = () => {
	return (
		<div>
			<Navbar />
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
