import { navigateToComponent } from 'constants/routes';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from 'shared/components/navbar/navbar';
import Sidebar from 'shared/components/sidebar/sidebar';

const Layout = () => {
	return (
		<Router>
			<div>
				<Navbar />
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
