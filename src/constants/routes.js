import TimeZoneList from 'modules/masters/screens/timeZoneList/timeZone';
import HRLostReport from 'modules/report/screens/hrLostReport/hrLostReport';
import ChangePassword from 'modules/user/screens/changePassword/changePassword';
import ViewClientDetails from 'modules/viewClient/viewClientDetails';
import React, { Suspense } from 'react';
import ChatGPTResponse from 'modules/report/screens/chatGPTResponse/chatGPTResponse';
import ViewCompanyDetails from 'modules/client/components/companyDetails/viewCompanyDetails';
import ViewOnBoardDetails from 'modules/onBoardList/viewOnBoardDetails';
import TalentDocument from 'modules/report/screens/talentDocuments/talentDocument';
import AllNOTES from 'modules/report/screens/talentNotes/talentNotes';
import RevenueReport from 'modules/report/screens/revenueReport/revenueReport';
import UplersReport from 'modules/report/screens/uplersReport/uplersReport';
import AllFTEPage from 'modules/report/screens/uplersReport/allFTEPage';
import New_all_hiring_request from 'modules/hiring request/screens/allHiringRequest/n_all_hiring_request';

const Dashboard = React.lazy(() =>
	import('modules/dashboard/screens/dashboard'),
);
const AMDashboard = React.lazy(() =>
	import('modules/amDashboard/screens/amdashboard'),
);
const TADashboard = React.lazy(() =>
	import('modules/taDashboard/taDashboard'),
);

const RecruiterReport = React.lazy(() =>
	import('modules/report/screens/recruiterReport/recruiterReport'),
);

const TADashboardReport = React.lazy(() => 
	import('modules/report/screens/taDashboardReport/taDashboardReport'),
)

const DailySnapshotReport = React.lazy(() =>
	import('modules/report/screens/dailySnapshotReport/dailySnapshotReport'),
)

const AllHiringRequest = React.lazy(() =>
	import('modules/hiring request/screens/allHiringRequest/mainHRTabs'),
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

const EmailTracking = React.lazy(() =>
	import('modules/report/screens/eamilReport/emailTracking'),
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

const TAGoalList = React.lazy(() =>
	import('modules/masters/screens/taGoal/taGoalList'),
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
const InvoiceReport = React.lazy(() => 
	import('modules/report/screens/invoiceReport/invoiceReport'))

const InvoiceCustomer = React.lazy(() => 
	import('modules/report/screens/invoiceReport/invoiceCustomer')) 

const LeaveReport = React.lazy(() => 
	import('modules/report/screens/invoiceReport/leaveReport'))

const ReplacementReport = React.lazy(() =>
	import('modules/report/screens/replacementReport/replacementReport')
);

const TalentBackoutReport = React.lazy(() =>
	import('modules/report/screens/talentBackoutReport/talentBackoutReport')
);

const TalentReport = React.lazy(() =>
	import('modules/report/screens/talentReport/talentReport')
);

const HRReport = React.lazy(() =>
	import('modules/report/screens/hrReport/hrReport')
);

const UTMTrackingReport = React.lazy(() =>
	import('modules/report/screens/utmTrackingReport/utmTrackingReport')
);

const ClientPortalrackingReport = React.lazy(() =>
	import('modules/report/screens/clientPortalTrackingReport/clientPortalTrackingReport')
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

const OnBoardList = React.lazy(() => 
import('modules/onBoardList/onBoardList')
)

const AddCompany = React.lazy(() => 
	import('modules/company/screens/addCompany/addCompany')
)

const ClientDashboardReport = React.lazy(() => 
	import('modules/report/screens/clientDashboardReport/clientDashboardReport')
)

const ImmediateJoiners = React.lazy(() => 
	import('modules/report/screens/clientDashboardReport/immediateJoiners')
)

const RecruiterDashboardReport = React.lazy(() => 
	import('modules/report/screens/clientDashboardReport/RecruiterDashboardReport')
)
const InterviewReschedule = React.lazy(() => 
	import('modules/report/screens/clientDashboardReport/interviewReschedule')
)
const AverageSLA = React.lazy(() => 
	import('modules/report/screens/clientDashboardReport/averageSLA')
)
const AMReport = React.lazy(() => 
	import('modules/report/screens/amReport/amReport')
)

const CompanyCategory = React.lazy(() => 
	import('modules/report/screens/companyCategory/companyCategory')
)

const ClientFeedback = React.lazy(() => 
	import('modules/report/screens/clientFeedback/clientFeedback')
)


const DailyBusinessNumbers = React.lazy(() => 
	import('modules/report/screens/dailyBusinessNumbers/dailyBusinessNumbers')
)

const PotentialClosuresSheet = React.lazy(() => 
	import('modules/report/screens/potentialClosuresSheet/potentialClosuresSheet')
)

const ScreeningInterviewReject = React.lazy(() => 
	import('modules/report/screens/screenInterviewReject/ScreenInterviewReject')
)

const AmInterviews = React.lazy(() => 
	import('modules/report/screens/amInterviews/amInterviews')
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
	static AMDASHBOARD = '/amdashboard';
	static TADASHBOARD = '/tadashboard'
	static TADASHBOARDREPORT = '/tadashboardReport'
	static RECRUITERREPORT = '/recruiter'
	static DAILYSNAPSHOT = '/dailysnapshot'
	static ADDNEWHR = '/allhiringrequest/addnewhr';
	static EDITNEWHR = '/allhiringrequest/addnewhr/:hrid';
	static ADDNEWCLIENT = '/allhiringrequest/addnewclient';
	static EDITCLIENT = '/editclient/:CompanyID';
	static VIEWCOMPANYDETAILS = '/viewCompanyDetails/:CompanyID'
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
	static MASTERTAGOAL = '/master/tagoal';
	static MASTERCURRENCYROUTE = '/master/currency';
	static MASTERROLE = '/master/role';
	static MASTERTIMEZONE = '/master/timezone';
	static SLA_REPORT = '/slaReport';
	static I2S_REPORT = "/i2sReport";
	static CLIENT_REPORT = "/clientReport";
	static HRLostReoprt = '/hrlostreport'
	static HR_REPORT = "/hrReport";
	static CLIENT_HAPPINESS_SURVEY = '/ClientHappinessSurvey';
	static  CLIENT_INTERVIEW_RESCHEDULE= '/interviewReschedule' 
	static AVERAGE_SLA = '/averageSLA'
	static ALLCLIENTS = '/allClients';
	static VIEWCLIENT = '/viewClient/:companyID/:clientID';
	static CHANGE_PASSOWRD = '/changepassword'
	static CHAT_GPT_RESPONSE = '/chatGPTResponse'
	static EMAIL_TRACKING_REOPRT = '/emailTracking'
	static ADD_HR = '/addHR'
	static Edit_HR = '/EditNewHR/:hrID'
	static ABOUT_CLIENT = '/userDetails';
	static ONBOARD = '/onBoardList';
	static Invoice = '/Invoice'
	static Customer = '/customer'
	static Leave = '/leave'
	static VIEWONBOARDDETAILS = '/viewOnboardDetails/:onboardID/:isOngoing'
	static UTM_TRACKING_REPORT = "/utmTrackingReport";
	static CLIENT_PORTAL_TRACKING_REPORT = "/clientPortalTrackingReport";
	static REPLACEMENT_REPORT = "/replacementReport";
	static ADD_NEW_COMPANY = "/addNewCompany/:companyID";
	static TALENT_BACKOUT_REPORT = "/talentBackoutReport";
	static TALENT_REPORT = "/talentReport";
	static REVENUE_REPORT = "/revenueReport";
	static IMMEDIATEJOINER = '/immediateJoiner'
	static TALENT_DOCUMENTS = '/talentDocument'
	static TALENT_NOTES = '/talentNotes';
	static RECRUITER_DASHBOARD_REPORT = '/RevenueDashboardReport';
	static CLIENT_DASHBOARD_REPORT = '/clientDashboardReport';
	static AM_REPORT = '/amReport';
	static COMPANY_CATEGORY = '/companyCategory'
	static CLIENT_FEEDBACK = '/clientFeedback'
	static DAILY_BUSINESS_NUMBERS = '/RevenueBusinessReport';
	static POTENTIAL_CLOSURES_SHEET = '/potentialClosuresList'
	static SCREENING_INTERVIEW_REJECT = '/screeningInterviewReject'
	static AM_INTERVIEW = '/amInterviews'
	static POD_DASHBOARD_REPORT = '/podDashboardReport'
	static ALL_FTE_DASHBOARD_REPORT = '/allMultiMonthPODDashboard'
}

export class NewPagesRouts  {
	static LOGINROUTE = '/w_login';
	static ALLHIRINGREQUESTROUTE = '/w_allhiringrequest';
	static ALLHIRINGREQUESTSUBROUTE = '/w_allhiringrequest/:hrid';
	static ALLUNASSIGNHIRINGREQUESTROUTE = '/allunassignedhiringrequest';
	static ADD_NEWHR = '/w_allhiringrequest/addnewhr/';
	static ADDNEWHR = '/w_allhiringrequest/addnewhr/:hrid';
	static PREVIEW_HR = '/w_previewHR/:hrid'
	static ALL_CLIENTS = '/w_allClients'
	static ADD_NEW_COMPANY = "/w_addNewCompany/:companyID";
}

export const navigateToComponent = {
	[UTSRoutes.HOMEROUTE]: (
		<Suspense>
			<Dashboard />
		</Suspense>
	),
	[UTSRoutes.AMDASHBOARD]: (
		<Suspense>
			<AMDashboard />
		</Suspense>
	),
	[UTSRoutes.TADASHBOARD]: (
		<Suspense>
			<TADashboard />
		</Suspense>
	),
	// [UTSRoutes.ALLHIRINGREQUESTROUTE]: (
	// 	<Suspense>
	// 		<AllHiringRequest />
	// 	</Suspense>
	// ),
	// [NewPagesRouts.ALLHIRINGREQUESTROUTE]: (
	// 	<Suspense>
	// 		<New_all_hiring_request />
	// 	</Suspense>
	// ),
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
	// [UTSRoutes.ADDNEWHR]: (
	// 	<Suspense>
	// 		<AddNewHR />
	// 	</Suspense>
	// ),
	// [UTSRoutes.EDITNEWHR]: (
	// 	<Suspense>
	// 		<AddNewHR />
	// 	</Suspense>
	// ),
	[NewPagesRouts.ADDNEWHR]: (
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
	[UTSRoutes.MASTERTAGOAL]: (
		<Suspense>
			<TAGoalList />
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
	[UTSRoutes.TALENT_NOTES]: (
		<Suspense>
			<AllNOTES />
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
	[UTSRoutes.Invoice]:(
		<Suspense>
			<InvoiceReport />
		</Suspense>
	),	
	[UTSRoutes.Customer]:(
		<Suspense>
			<InvoiceCustomer />
		</Suspense>
	),
	[UTSRoutes.RECRUITERREPORT]: (
		<Suspense>
			<RecruiterReport />
		</Suspense>
	),
	[UTSRoutes.TADASHBOARDREPORT]: (
		<Suspense>
			<TADashboardReport />
		</Suspense>
	),
	[UTSRoutes.DAILYSNAPSHOT]: (
		<Suspense>
			<DailySnapshotReport />
		</Suspense>
	),
	[UTSRoutes.Leave]:(
		<Suspense>
			<LeaveReport />
		</Suspense>
	),
	[UTSRoutes.REPLACEMENT_REPORT]:(
		<Suspense>
			<ReplacementReport />
		</Suspense>
	),
	[UTSRoutes.REVENUE_REPORT]:(
		<Suspense>
			<RevenueReport />
		</Suspense>
	),
	[UTSRoutes.TALENT_BACKOUT_REPORT]:(
		<Suspense>
			<TalentBackoutReport />
		</Suspense>
	),
	[UTSRoutes.TALENT_REPORT]:(
		<Suspense>
			<TalentReport />
		</Suspense>
	),
	[UTSRoutes.HR_REPORT]:(
		<Suspense>
			<HRReport />
		</Suspense>
	),
	[UTSRoutes.UTM_TRACKING_REPORT]:(
		<Suspense>
			<UTMTrackingReport />
		</Suspense>
	),
	[UTSRoutes.TALENT_DOCUMENTS]:(
		<Suspense>
			<TalentDocument />
		</Suspense>
	),
	[UTSRoutes.EMAIL_TRACKING_REOPRT]:(
		<Suspense>
			<EmailTracking />
		</Suspense>
	),
	[UTSRoutes.CLIENT_PORTAL_TRACKING_REPORT]:(
		<Suspense>
			<ClientPortalrackingReport />
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
[UTSRoutes.CLIENT_INTERVIEW_RESCHEDULE]:(
	<Suspense>
			<InterviewReschedule />
	</Suspense>
),
[UTSRoutes.AVERAGE_SLA]:(
	<Suspense>
			<AverageSLA />
	</Suspense>
),
[UTSRoutes.POD_DASHBOARD_REPORT]:(
	<Suspense>
			<UplersReport />
	</Suspense>
),
[UTSRoutes.ALL_FTE_DASHBOARD_REPORT]:(
	<Suspense>
			<AllFTEPage />
	</Suspense>
),
[NewPagesRouts.ALL_CLIENTS]:(
	<Suspense>
			<AllClients />
	</Suspense>
),

[UTSRoutes.EDITCLIENT]:(
	<Suspense>
			<EditClient />
	</Suspense>
),
[UTSRoutes.VIEWCOMPANYDETAILS]:(
	<Suspense>
			<ViewCompanyDetails />
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
[UTSRoutes.VIEWONBOARDDETAILS] : (
	<Suspense>
		<ViewOnBoardDetails />
	</Suspense>
),
[UTSRoutes.ONBOARD] : (
	<Suspense>
		<OnBoardList />
	</Suspense>
),
[UTSRoutes.ADD_NEW_COMPANY] : (
	<Suspense>
		<AddCompany />
	</Suspense>
),
[UTSRoutes.CLIENT_DASHBOARD_REPORT]: (
	<Suspense>
		<ClientDashboardReport />
	</Suspense>
),
[UTSRoutes.IMMEDIATEJOINER]: (
	<Suspense>
		<ImmediateJoiners />
	</Suspense>
),
[UTSRoutes.RECRUITER_DASHBOARD_REPORT]: (
	<Suspense>
		<RecruiterDashboardReport />
	</Suspense>
),
[UTSRoutes.AM_REPORT]: (
	<Suspense>
		<AMReport />
	</Suspense>
),
[UTSRoutes.COMPANY_CATEGORY]: (
	<Suspense>
		<CompanyCategory />
	</Suspense>
),
[UTSRoutes.CLIENT_FEEDBACK]: (
	<Suspense>
		<ClientFeedback />
	</Suspense>
),

[UTSRoutes.DAILY_BUSINESS_NUMBERS]: (
	<Suspense>
		<DailyBusinessNumbers />
	</Suspense>
),

[UTSRoutes.POTENTIAL_CLOSURES_SHEET]: (
	<Suspense>
		<PotentialClosuresSheet />
	</Suspense>
),
[UTSRoutes.SCREENING_INTERVIEW_REJECT]: (
	<Suspense>
		<ScreeningInterviewReject />
	</Suspense>
),
[UTSRoutes.AM_INTERVIEW]: (
	<Suspense>
		<AmInterviews />
	</Suspense>
),

};

export const isAccess = (ID) =>{	
	let	isVisible = (ID === 1 || ID === 2 || ID === 4 || ID === 5 || ID === 9 || ID === 10 || ID === 11 || ID === 12 || ID === 6 || ID === 3 )  		
	return isVisible
}
