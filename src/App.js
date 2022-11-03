import LoginScreen from 'modules/user/screens/login/login_screen';
import {
	BrowserRouter as Router,
	Redirect,
	Route,
	Switch,
	useRouteMatch,
} from 'react-router-dom';
import Routes, { navigateToComponent } from 'constants/routes';
import Layout from 'Layout/layout';
import Test from 'shared/components/test';

function App() {
	let { path, url } = useRouteMatch();
	return (
		<div>
			<Router>
				<Switch>
					{Object.entries(navigateToComponent).map(([path, component]) => {
						return (
							<Route
								key={path}
								exact
								component={Layout}
								path={path}
							/>
						);
					})}

					<Route
						path={Routes.LOGINROUTE}
						component={LoginScreen}
						exact
					/>
				</Switch>
			</Router>
		</div>
	);
}

export default App;
