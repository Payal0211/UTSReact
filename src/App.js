import React, { Suspense } from 'react';
import { Routes, Navigate, Route } from 'react-router-dom';
import UTSRoutes, { navigateToComponent } from 'constants/routes';
import { ProtectedRoutes } from 'shared/utils/protected_utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PageNotFound from 'shared/screen/404';

const Login = React.lazy(() =>
	import('modules/user/screens/login/login_screen'),
);
const Layout = React.lazy(() => import('layout/layout'));

function App() {
	const queryClient = new QueryClient();
	return (
		<QueryClientProvider client={queryClient}>
			<Suspense>
				<Routes>
					<Route
						exact
						path={UTSRoutes.LOGINROUTE}
						element={<Login />}
					/>
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
