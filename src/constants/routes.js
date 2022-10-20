import LoginScreen from 'modules/user/screens/login/login_screen';

export default class Routes {
	static LANDINGROUTE = '/';
	static SIGNUPROUTE = '/signup';
	static LOGINROUTE = '/login';
	static HOMEROUTE = '/home';
	static FORGOTPASSWORDROUTE = '/forgotpassword';

	static ALLHIRINGREQUESTROUTE = '/allhiringrequest';
	static PAGENOTFOUNDROUTE = '/pagenotfound';
	static NETWORKERRORROUTE = '/networkissue';
}

export const navigateToComponent = {
	[Routes.LOGINROUTE]: LoginScreen,
};
