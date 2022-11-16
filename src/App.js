import React, { Suspense } from 'react';
import { Routes, Navigate, Route } from 'react-router-dom';
import UTSRoutes, { navigateToComponent } from 'constants/routes';
import { ProtectedRoutes } from 'shared/utils/protected_utils';
import { Result } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
						path="/404"
						element={
							<Result
								style={{
									height: '600px',
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
								}}
								status="404"
								title="404"
								subTitle="Sorry, the page you visited does not exist."
							/>
						}
					/>
					<Route
						path="*"
						element={
							<Navigate
								replace
								to="/404"
							/>
						}
					/>
				</Routes>
			</Suspense>
		</QueryClientProvider>
	);
}

export default App;
