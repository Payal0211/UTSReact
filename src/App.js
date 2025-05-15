import React, { Suspense, useEffect, useState } from 'react';
import { Routes, Navigate, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UTSRoutes, { navigateToComponent , isAccess } from 'constants/routes';
import { ProtectedRoutes } from 'shared/utils/protected_utils';
import PageNotFound from 'shared/screen/404';
import SomethingWentWrong from 'shared/screen/500';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';

const Login = React.lazy(() =>
	import('modules/user/screens/login/login_screen'),
);
const Layout = React.lazy(() => import('layout/layout'));

function App() {
	const queryClient = new QueryClient();

	const isAuthenticatedRoute = () => {
		let token = localStorage.getItem("apiKey");		
		const sessionStartTime = localStorage.getItem('sessionStartTime');
		
		if (token && sessionStartTime) {
			
			const sessionDuration = new Date().getTime() - sessionStartTime;
			const maxSessionDuration = 82800000; // 23 hours in milliseconds     
		  
		  if (sessionDuration < maxSessionDuration) {
			return true;
		  } else {
			localStorage.clear()
			return false;
		  }
		}
		localStorage.clear()
		return false;
	};	  

	const [userData, setUserData] = useState({});

	useEffect(() => {
		const getUserResult = async () => {
			let userData = UserSessionManagementController.getUserSession();
			if (userData) setUserData(userData);
		};
		getUserResult();
	}, []);

    const isAllowed =  isAccess(userData?.LoggedInUserTypeID) 	
	
	return (
		<QueryClientProvider client={queryClient}>
			<Suspense>
				<Routes>
					<Route
						exact
						path={UTSRoutes.LOGINROUTE}
						element={<Login />}
					/>

					{isAuthenticatedRoute() && userData?.LoggedInUserTypeID && <Route
						path={UTSRoutes.HOMEROUTE}
						element={
							<Navigate
								replace
								to={isAllowed ? userData?.LoggedInUserTypeID === (6 && 3) ? UTSRoutes.AMDASHBOARD :  UTSRoutes.ALLHIRINGREQUESTROUTE : UTSRoutes.DASHBOARD}
							/>
						}
					/>}
					
					<Route
						path={UTSRoutes.HOMEROUTE}
						element={<ProtectedRoutes Component={Layout} />}>
						{Object.entries(navigateToComponent).map(([path, component]) => {
							return (
								<Route
									exact
									key={path}
									element={component}
									path={path}
								/>
							);
						})}
					</Route>

					<Route
						path={UTSRoutes.SOMETHINGWENTWRONG}
						element={<SomethingWentWrong />}
					/>
					<Route
						path={UTSRoutes.PAGENOTFOUNDROUTE}
						element={<PageNotFound />}
					/>
					<Route
						path="*"
						element={
							<Navigate
								replace
								to={UTSRoutes.PAGENOTFOUNDROUTE}
							/>
						}
					/>
				</Routes>
			</Suspense>
		</QueryClientProvider>
	);
}

export default App;
