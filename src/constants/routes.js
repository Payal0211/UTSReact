import TimeZoneList from 'modules/masters/screens/timeZoneList/timeZone';
import HRLostReport from 'modules/report/screens/hrLostReport/hrLostReport';
import ChangePassword from 'modules/user/screens/changePassword/changePassword';
import ViewClientDetails from 'modules/viewClient/viewClientDetails';
import React, { Suspense } from 'react';
import ChatGPTResponse from 'modules/report/screens/chatGPTResponse/chatGPTResponse';

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
const EditClient = React.lazy(() =>
	import('modules/client/screens/addnewClient/edit_client'),
);
const InterviewList = React.lazy(() =>
	import('modules/interview/screens/interviewList/interviewList'),
);
/* 

const InterviewSchedule = React.lazy(() =>
	import('modules/interview/screens/interviewReschedule/interviewReschedule'),
);

const InterviewFeedback = React.lazy(() =>
	import('modules/interview/screens/interviewFeedback/interviewFeedback'),
); */

const DealList = React.lazy(() =>
	import('modules/deal/screens/dealList/dealList'),
);
const DealDetails = React.lazy(() =>
	import('modules/deal/screens/dealDetails/dealDetails'),
);

const AddNewUser = React.lazy(() =>
	import('modules/user/screens/addNewUser/addUser'),
);
const CompanyList = React.lazy(() =>
	import('modules/company/screens/company_list'),
);

const UserList = React.lazy(() =>
	import('modules/user/screens/userList/user_list'),
);

const AddNewOnboard = React.lazy(() =>
	import('modules/onboard/screens/addNewOnboard/addNewOnboard'),
);

const EngagementOnboardList = React.lazy(() =>
	import('modules/engagement/screens/engagementList/engagementList'),
);

const DemandFunnelReport = React.lazy(() =>
	import('modules/report/screens/demandFunnel/demandFunnel'),
);
const SupplyFunnelReport = React.lazy(() =>
	import('modules/report/screens/supplyFunnel/supplyFunnel'),
);

const TeamDemandFunnelReport = React.lazy(() =>
	import('modules/report/screens/teamDemandFunnel/teamDemandFunnel'),
);

const IncentiveReport = React.lazy(() =>
	import('modules/IncentiveReport/screens/IncentiveReport'),
);
const ViewHrDetails = React.lazy(() =>
	import('modules/viewHrDetails/screens/viewHRDetails'),
);

const JDDumpReport = React.lazy(() =>
	import('modules/report/screens/jdDump/jdDumpReport'),
);

const CountryList = React.lazy(() =>
	import('modules/masters/screens/country/countryList'),
);

const CurrencyList = React.lazy(() =>
	import('modules/masters/screens/currency/currencyList'),
);

const RoleList = React.lazy(() => 
	import ('modules/masters/screens/role/roleList'),
)
const SlaReport = React.lazy(() =>
	import('modules/report/screens/slaReport/slaReport'),
);
const I2sReport = React.lazy(() =>
	import('modules/report/screens/i2sReport/i2sReport'),
);

const ClientReport = React.lazy(() =>
 	import('modules/report/screens/clientReport/clientReport')
);

const HRReport = React.lazy(() =>
	import('modules/report/screens/hrReport/hrReport')
);

const DashboardScreen = React.lazy(() =>
    import('modules/dashboard/screens/dashboard'),
)

const ClienthappinessSurvey = React.lazy(() =>
	import('modules/survey/clienthappinessSurvey'),
)

const AllClients = React.lazy(() =>
	import('modules/allClients/allClients')
)

const AddHR = React.lazy(() =>
import('modules/hiring request/components/directHR/add_hr')
)

const EditNewHR = React.lazy(() =>
import('modules/hiring request/components/editdirectHR/Edit_new_HR')
)

const UserDetails = React.lazy(() =>
import('modules/allClients/components/clientDetails/userDetails')
)

// const ViewClient = React.lazy(() => 
// import('modules/viewClient/viewClientDetails'))

export default class UTSRoutes {
	static HOMEROUTE = '/';
	static SIGNUPROUTE = '/signup';
	static LOGINROUTE = '/login';
	static FORGOTPASSWORDROUTE = '/forgotpassword';
	static ALLHIRINGREQUESTROUTE = '/allhiringrequest';
	static ALLHIRINGREQUESTSUBROUTE = '/allhiringrequest/:hrid';
	static ADDNEWHR = '/allhiringrequest/addnewhr';
	static ADDNEWCLIENT = '/allhiringrequest/addnewclient';
	static EDITCLIENT = '/editclient/:CompanyID';
	static INTERVIEWLISTROUTE = '/interview';
	static INTERVIEWSCHEDULE = '/interview/scheduleinterview';
	static INTERVIEWFEEDBACK = '/interview/feedback';
	static DEALLISTROUTE = '/deal';
	static DASHBOARD = '/dashboard';
	static DEALDETAILS = '/deal/:dealID';
	static ONBOARDROUTE = '/onboard';
	static ONBOARDEDITROUTE = '/onboard/edit/:onboardID';
	static PAGENOTFOUNDROUTE = '/404';
	static SOMETHINGWENTWRONG = '/500';
	static NETWORKERRORROUTE = '/networkissue';
	static COMPANYLISTROUTE = '/companylist';
	static USERLISTROUTE = '/user';
	static ADDNEWUSERROUTE = '/user/addnewuser';
	static EDITUSERROUTE = '/user/:userID';
	static ENGAGEMENTRROUTE = '/engagement';
	static DEMANDFUNNELROUTE = '/demandfunnel';
	static SUPPLYFUNNELROUTE = '/supplyfunnel';
	static TEAMDEMANDFUNNELROUTE = '/teamdemandfunnel';
	static INCENTIVEREPORTROUTE = '/incentive';
	static VIEWHRDETAILS = '/viewHrDetails/:id';
	static JDDUMPREPORTROUTE = '/jdDump';
	static MASTERCOUNTRYROUTE = '/master/country';
	static MASTERCURRENCYROUTE = '/master/currency';
	static MASTERROLE = '/master/role';
	static MASTERTIMEZONE = '/master/timezone';
	static SLA_REPORT = '/slaReport';
	static I2S_REPORT = "/i2sReport";
	static CLIENT_REPORT = "/clientReport";
	static HRLostReoprt = '/hrlostreport'
	static HR_REPORT = "/hrReport";
	static CLIENT_HAPPINESS_SURVEY = '/ClientHappinessSurvey';
	static ALLCLIENTS = '/allClients';
	static VIEWCLIENT = '/viewClient/:companyID/:clientID';
	static CHANGE_PASSOWRD = '/changepassword'
	static CHAT_GPT_RESPONSE = '/chatGPTResponse'
	static ADD_HR = '/addHR'
	static Edit_HR = '/EditNewHR/:hrID'
	static ABOUT_CLIENT = '/userDetails';
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
	[UTSRoutes.EDITUSERROUTE]: (
		<Suspense>
			<AddNewUser />
		</Suspense>
	),
	[UTSRoutes.INTERVIEWLISTROUTE]: (
		<Suspense>
			<InterviewList />
		</Suspense>
	) /*
	[UTSRoutes.INTERVIEWSCHEDULE]: (
		<Suspense>
			<InterviewSchedule />
		</Suspense>
	), */,
	/* [UTSRoutes.INTERVIEWFEEDBACK]: (
		<Suspense>
			<InterviewFeedback />
		</Suspense>
	), */
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
	[UTSRoutes.ONBOARDROUTE]: (
		<Suspense>
			<AddNewOnboard />
		</Suspense>
	),
	[UTSRoutes.ONBOARDEDITROUTE]: (
		<Suspense>
			<AddNewOnboard />
		</Suspense>
	),
	[UTSRoutes.ENGAGEMENTRROUTE]: (
		<Suspense>
			<EngagementOnboardList />
		</Suspense>
	),
	[UTSRoutes.DEMANDFUNNELROUTE]: (
		<Suspense>
			<DemandFunnelReport />
		</Suspense>
	),
	[UTSRoutes.SUPPLYFUNNELROUTE]: (
		<Suspense>
			<SupplyFunnelReport />
		</Suspense>
	),
	[UTSRoutes.TEAMDEMANDFUNNELROUTE]: (
		<Suspense>
			<TeamDemandFunnelReport />
		</Suspense>
	),
	[UTSRoutes.INCENTIVEREPORTROUTE]: (
		<Suspense>
			<IncentiveReport />
		</Suspense>
	),
	[UTSRoutes.VIEWHRDETAILS]: (
		<Suspense>
			<ViewHrDetails />
		</Suspense>
	),
	[UTSRoutes.JDDUMPREPORTROUTE]: (
		<Suspense>
			<JDDumpReport />
		</Suspense>
	),
	[UTSRoutes.SLA_REPORT]: (
		<Suspense>
			<SlaReport />
		</Suspense>
	),
	[UTSRoutes.MASTERCOUNTRYROUTE]: (
		<Suspense>
			<CountryList />
		</Suspense>
	),
	[UTSRoutes.MASTERCURRENCYROUTE]: (
		<Suspense>
			<CurrencyList />
		</Suspense>
	),
	[UTSRoutes.MASTERROLE]: (
		<Suspense>
			<RoleList />
		</Suspense>
	),
	[UTSRoutes.MASTERTIMEZONE]: (
		<Suspense>
			<TimeZoneList />
		</Suspense>
	),
	
	[UTSRoutes.I2S_REPORT]: (
		<Suspense>
			<I2sReport />
		</Suspense>
	),
	[UTSRoutes.HRLostReoprt]: (
		<Suspense>
			<HRLostReport/>
		</Suspense>
	),
	[UTSRoutes.CLIENT_REPORT]:(
		<Suspense>
			<ClientReport />
		</Suspense>
	),
	[UTSRoutes.HR_REPORT]:(
		<Suspense>
			<HRReport />
		</Suspense>
	),
[UTSRoutes.DASHBOARD]:(
	<Suspense>
			<DashboardScreen />
	</Suspense>
),
[UTSRoutes.CLIENT_HAPPINESS_SURVEY]:(
	<Suspense>
			<ClienthappinessSurvey />
	</Suspense>
),
[UTSRoutes.ALLCLIENTS]:(
	<Suspense>
			<AllClients />
	</Suspense>
),

[UTSRoutes.EDITCLIENT]:(
	<Suspense>
			<EditClient />
	</Suspense>
),
[UTSRoutes.VIEWCLIENT]: (
	<Suspense>
		<ViewClientDetails />
	</Suspense>
),
[UTSRoutes.CHANGE_PASSOWRD]: (
	<Suspense>
		<ChangePassword />
	</Suspense>
),
[UTSRoutes.CHAT_GPT_RESPONSE]: (
	<Suspense>
		<ChatGPTResponse />
	</Suspense>
),
[UTSRoutes.ADD_HR]: (
	<Suspense>
		<AddHR />
	</Suspense>
),
[UTSRoutes.Edit_HR]: (
	<Suspense>
		<EditNewHR />
	</Suspense>
),
[UTSRoutes.ABOUT_CLIENT]: (
	<Suspense>
		<UserDetails />
	</Suspense>
),
};

export const isAccess = (ID) =>{	
	let	isVisible = (ID === 1 || ID === 2 || ID === 4 || ID === 5 || ID === 9 || ID === 10 || ID === 11 || ID === 12 || ID === 6 )  		
	return isVisible
}
