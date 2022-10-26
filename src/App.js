import LoginScreen from 'modules/user/screens/login/login_screen';
import {
	BrowserRouter as Router,
	Redirect,
	Route,
	Switch,
} from 'react-router-dom';
import Routes from 'constants/routes';
import Layout from 'Layout/layout';

function App() {
	return (
		<div>
			<Router>
				<Switch>
					<Route
						path={Routes.HOMEROUTE}
						component={Layout}
						exact
					/>
					<Route
						path={Routes.ALLHIRINGREQUESTROUTE}
						component={Layout}
						exact
					/>
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
