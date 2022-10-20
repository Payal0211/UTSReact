import LoginScreen from 'modules/user/screens/login/login_screen';
import { Redirect, Route } from 'react-router-dom';
import Routes from 'constants/routes';

function App() {
	return (
		<div>
			<Route path="/">
				<Redirect
					to={Routes.LOGINROUTE}
					exact
				/>
			</Route>
			<Route
				path={Routes.LOGINROUTE}
				component={LoginScreen}
				exact
			/>
		</div>
	);
}

export default App;
