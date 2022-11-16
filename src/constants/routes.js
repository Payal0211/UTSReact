import React, { Suspense } from 'react';
const Dashboard = React.lazy(() =>
	import('modules/dashboard/screens/dashboard'),
);
const AllHiringRequest = React.lazy(() =>
	import('modules/hiring request/screens/allHiringRequest/all_hiring_request'),
);
const HRDetail = React.lazy(() =>
	import('modules/hiring request/screens/hrdetail/hrdetails'),
);

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
	[UTSRoutes.HOMEROUTE]: (
		<Suspense>
			<Dashboard />
		</Suspense>
	),
	[UTSRoutes.ALLHIRINGREQUESTROUTE]: (
		<Suspense>
			<AllHiringRequest />
		</Suspense>
	),
	[UTSRoutes.ALLHIRINGREQUESTSUBROUTE]: (
		<Suspense>
			<HRDetail />
		</Suspense>
	),
};
