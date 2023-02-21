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
const AddNewHR = React.lazy(() =>
	import('modules/hiring request/screens/addnewHR/add_new_HR'),
);

const AddNewClient = React.lazy(() =>
	import('modules/client/screens/addnewClient/add_new_client'),
);

const InterviewList = React.lazy(() =>
	import('modules/interview/screens/interviewList/interviewList'),
);

const InterviewSchedule = React.lazy(() =>
	import('modules/interview/screens/interviewReschedule/interviewReschedule'),
);

const InterviewFeedback = React.lazy(() =>
	import('modules/interview/screens/interviewFeedback/interviewFeedback'),
);
const DealList = React.lazy(() =>
	import('modules/deal/screens/dealList/dealList'),
);
const DealDetails = React.lazy(() =>
	import('modules/deal/screens/dealDetails/dealDetails'),
);

const AddNewUser = React.lazy(() =>
	import('modules/users/screens/addNewUser/addUser'),
);
const CompanyList = React.lazy(() =>
	import('modules/company/screens/company_list'),
);

const UserList = React.lazy(() => import('modules/users/screens/user_list'));

export default class UTSRoutes {
	static HOMEROUTE = '/';
	static SIGNUPROUTE = '/signup';
	static LOGINROUTE = '/login';
	static FORGOTPASSWORDROUTE = '/forgotpassword';
	static ALLHIRINGREQUESTROUTE = '/allhiringrequest';
	static ALLHIRINGREQUESTSUBROUTE = '/allhiringrequest/:hrid';
	static ADDNEWHR = '/allhiringrequest/addnewhr';
	static ADDNEWCLIENT = '/allhiringrequest/addnewclient';
	static INTERVIEWLISTROUTE = '/interview';
	static INTERVIEWSCHEDULE = '/interview/scheduleinterview';
	static INTERVIEWFEEDBACK = '/interview/feedback';
	static DEALLISTROUTE = '/deal';
	static DEALDETAILS = '/deal/:dealID';
	static PAGENOTFOUNDROUTE = '/404';
	static NETWORKERRORROUTE = '/networkissue';
	static COMPANYLISTROUTE = '/companylist';
	static USERLISTROUTE = '/user';
	static ADDNEWUSERROUTE = '/user/addnewuser';
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
	[UTSRoutes.ADDNEWCLIENT]: (
		<Suspense>
			<AddNewClient />
		</Suspense>
	),
	[UTSRoutes.ADDNEWHR]: (
		<Suspense>
			<AddNewHR />
		</Suspense>
	),
	[UTSRoutes.INTERVIEWLISTROUTE]: (
		<Suspense>
			<InterviewList />
		</Suspense>
	),
	[UTSRoutes.INTERVIEWSCHEDULE]: (
		<Suspense>
			<InterviewSchedule />
		</Suspense>
	),
	[UTSRoutes.INTERVIEWFEEDBACK]: (
		<Suspense>
			<InterviewFeedback />
		</Suspense>
	),
	[UTSRoutes.DEALLISTROUTE]: (
		<Suspense>
			<DealList />
		</Suspense>
	),
	[UTSRoutes.DEALDETAILS]: (
		<Suspense>
			<DealDetails />
		</Suspense>
	),
	[UTSRoutes.USERLISTROUTE]: (
		<Suspense>
			<UserList />
		</Suspense>
	),
	[UTSRoutes.COMPANYLISTROUTE]: (
		<Suspense>
			<CompanyList />
		</Suspense>
	),
	[UTSRoutes.ADDNEWUSERROUTE]: (
		<Suspense>
			<AddNewUser />
		</Suspense>
	),
};
