import Routes, { navigateToComponent } from 'constants/routes';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import { useEffect,useState } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import Navbar from 'shared/components/navbar/navbar';
import Sidebar from 'shared/components/sidebar/sidebar';

const Layout = () => {
	const [userDetails,setUserDetails]=useState(null);
	let history=useHistory();
	useEffect(()=>{
		const getUserConfiguration=async ()=>{
			let response=await UserSessionManagementController.getUserSession();
			if(!response) history.push(Routes.LOGINROUTE)
			setUserDetails(response)
		}
		getUserConfiguration();
	},[])
	return (
		<Router>
			<div>
				<Navbar fullName={userDetails?.FullName}/>
				<div style={{ display: 'flex' }}>
					<Sidebar />
					<main
						style={{
							marginTop: '150px',
							marginLeft: '90px',
							width: '100%',
						}}>
						<Switch>
							{Object.entries(navigateToComponent).map(([path, component]) => {
								return (
									<Route
										key={path}
										exact
										component={component}
										path={path}
									/>
								);
							})}
						</Switch>
					</main>
				</div>
			</div>
		</Router>
	);
};

export default Layout;
