import AllHiringRequestScreen from 'modules/hiring request/screens/allHiringRequest/all_hiring_request';
import { HomeScreen } from 'shared/screen/home/home_screen';

export default class Routes {
	static HOMEROUTE = '/';
	static SIGNUPROUTE = '/signup';
	static LOGINROUTE = '/login';
	static FORGOTPASSWORDROUTE = '/forgotpassword';
	static ALLHIRINGREQUESTROUTE = '/allhiringrequest';
	static PAGENOTFOUNDROUTE = '/pagenotfound';
	static NETWORKERRORROUTE = '/networkissue';
}

export const navigateToComponent = {
	[Routes.HOMEROUTE]: HomeScreen,
	[Routes.ALLHIRINGREQUESTROUTE]: AllHiringRequestScreen,
};
