import DashboardScreen from 'modules/dashboard/screens/dashboard';
import AllHiringRequestScreen from 'modules/hiring request/screens/allHiringRequest/all_hiring_request';
import HRDetailScreen from 'modules/hiring request/screens/hrdetail/hrdetails';

export default class UTSRoutes {
	static HOMEROUTE = '/';
	static SIGNUPROUTE = '/signup';
	static LOGINROUTE = '/login';
	static FORGOTPASSWORDROUTE = '/forgotpassword';
	static ALLHIRINGREQUESTROUTE = '/allhiringrequest';
	static ALLHIRINGREQUESTSUBROUTE = '/allhiringrequest/:hrid';
	static PAGENOTFOUNDROUTE = '/pagenotfound';
	static NETWORKERRORROUTE = '/networkissue';
}

export const navigateToComponent = {
	[UTSRoutes.HOMEROUTE]: <DashboardScreen />,
	[UTSRoutes.ALLHIRINGREQUESTROUTE]: <AllHiringRequestScreen />,
	[UTSRoutes.ALLHIRINGREQUESTSUBROUTE]: <HRDetailScreen />,
};
