import LoginScreen from 'modules/user/screens/login/login_screen';
import { Routes, Navigate, Route } from 'react-router-dom';
import UTSRoutes, { navigateToComponent } from 'constants/routes';
import Layout from 'layout/layout';
import { ProtectedUtils } from 'shared/utils/protected_utils';
import { Result, Skeleton } from 'antd';

function App() {
	return (
		<div>
			<Routes>
				<Route
					exact
					path={UTSRoutes.LOGINROUTE}
					element={<LoginScreen />}
				/>
				<Route
					path={UTSRoutes.HOMEROUTE}
					// element={<ProtectedUtils Component={Layout} />}>
					element={<Layout />}>
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
		</div>
	);
}

export default App;
