import LoginScreen from 'modules/user/screens/login/login_screen';
import { Routes, Navigate, Route } from 'react-router-dom';
import UTSRoutes, { navigateToComponent } from 'constants/routes';
import Layout from 'Layout/layout';
import { ProtectedUtils } from 'shared/utils/protected_utils';

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
				/** No page found */
				<Route
					path="/404"
					element={<div>Choose the correct path</div>}
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
