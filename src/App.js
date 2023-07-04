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

					{ userData?.LoggedInUserTypeID && <Route
						path={UTSRoutes.HOMEROUTE}
						element={
							<Navigate
								replace
								to={isAllowed ?  UTSRoutes.ALLHIRINGREQUESTROUTE : UTSRoutes.DEALLISTROUTE}
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
