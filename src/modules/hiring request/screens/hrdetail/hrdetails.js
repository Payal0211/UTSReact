import React, { Suspense, useEffect, useState } from 'react';
import { Skeleton } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { All_Hiring_Request_Utils } from 'shared/utils/all_hiring_request_util';
import HROperator from 'modules/hiring request/components/hroperator/hroperator';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import HRDetailStyle from './hrdetail.module.css';
import { ReactComponent as ArrowLeftSVG } from 'assets/svg/arrowLeft.svg';
import { ReactComponent as ArrowDownSVG } from 'assets/svg/arrowDown.svg';
import { ReactComponent as DeleteSVG } from 'assets/svg/delete.svg';

import UTSRoutes from 'constants/routes';

// import MatchmakingModal from 'modules/hiring request/components/matchmaking/matchmaking';

/** Lazy Loading the component */
const NextActionItem = React.lazy(() =>
	import('modules/hiring request/components/nextAction/nextAction.js'),
);
const CompanyProfileCard = React.lazy(() =>
	import('modules/hiring request/components/companyProfile/companyProfileCard'),
);
const TalentProfileCard = React.lazy(() =>
	import('modules/hiring request/components/talentProfile/talentProfileCard'),
);
const ActivityFeed = React.lazy(() =>
	import('modules/hiring request/components/activityFeed/activityFeed'),
);

const MatchmakingModal = React.lazy(() =>
	import('modules/hiring request/components/matchmaking/matchmaking'),
);
const HRDetailScreen = () => {
	const [isLoading, setLoading] = useState(false);
	const [apiData, setAPIdata] = useState([]);

	const switchLocation = useLocation();
	let urlSplitter = `${switchLocation.pathname.split('/')[2]}`;
	const updatedSplitter = 'HR' + urlSplitter?.split('HR')[1];

	async function callAPI(hrid) {
		let response = await hiringRequestDAO.getViewHiringRequestDAO(hrid);

		if (response) {
			setAPIdata(response && response?.responseBody);
			setLoading(false);
		}
	}
	useEffect(() => {
		setLoading(true);
		callAPI(urlSplitter?.split('HR')[0]);
	}, [urlSplitter]);

	return (
		<div className={HRDetailStyle.hiringRequestContainer}>
			<Link to={UTSRoutes.ALLHIRINGREQUESTROUTE}>
				<div className={HRDetailStyle.goback}>
					<ArrowLeftSVG style={{ width: '16px' }} />
					<span>Go Back</span>
				</div>
			</Link>
			<div className={HRDetailStyle.hrDetails}>
				<div className={HRDetailStyle.hrDetailsLeftPart}>
					<div className={HRDetailStyle.hiringRequestIdSets}>
						HR ID - {updatedSplitter}
					</div>
					{All_Hiring_Request_Utils.GETHRSTATUS(
						apiData?.HRStatusCode,
						apiData?.HRStatus,
					)}
					{apiData && (
						<div className={HRDetailStyle.hiringRequestPriority}>
							{All_Hiring_Request_Utils.GETHRPRIORITY(
								apiData?.StarMarkedStatusCode,
							)}
						</div>
					)}
				</div>
				<Suspense>
					<MatchmakingModal
						hrID={urlSplitter?.split('HR')[0]}
						hrNo={updatedSplitter}
						hrStatusCode={apiData?.HRStatusCode}
						hrStatus={apiData?.HRStatus}
						hrPriority={apiData?.StarMarkedStatusCode}
					/>
				</Suspense>
				<div className={HRDetailStyle.hrDetailsRightPart}>
					<HROperator
						title="Accept HR"
						icon={<ArrowDownSVG style={{ width: '16px' }} />}
						backgroundColor={`var(--color-sunlight)`}
						iconBorder={`1px solid var(--color-sunlight)`}
						isDropdown={true}
						listItem={[
							{
								label: 'Accept More TRs',
							},
						]}
					/>
					<HROperator
						title="Pass to ODR"
						icon={<ArrowDownSVG style={{ width: '16px' }} />}
						backgroundColor={`var(--background-color-light)`}
						labelBorder={`1px solid var(--color-sunlight)`}
						iconBorder={`1px solid var(--color-sunlight)`}
					/>
					<div className={HRDetailStyle.hiringRequestPriority}>
						<DeleteSVG style={{ width: '24px' }} />
					</div>
				</div>
			</div>
			{isLoading ? (
				<>
					<br />
					<Skeleton active />
					<br />
				</>
			) : (
				<Suspense>
					<NextActionItem nextAction={apiData?.NextActionsForTalent} />
				</Suspense>
			)}

			<div className={HRDetailStyle.portal}>
				<div className={HRDetailStyle.clientPortal}>
					{isLoading ? (
						<Skeleton active />
					) : (
						<Suspense>
							<CompanyProfileCard
								clientDetail={apiData?.ClientDetail}
								talentLength={apiData?.HRTalentDetails?.length}
							/>
						</Suspense>
					)}
				</div>
				<div className={HRDetailStyle.talentPortal}>
					{isLoading ? (
						<Skeleton active />
					) : (
						<Suspense>
							<TalentProfileCard talentDetail={apiData?.HRTalentDetails} />
						</Suspense>
					)}
				</div>
			</div>
			<div className={HRDetailStyle.activityFeed}>
				{isLoading ? (
					<Skeleton active />
				) : (
					<Suspense>
						<ActivityFeed
							hrID={urlSplitter?.split('HR')[0]}
							activityFeed={apiData?.HRHistory}
							tagUsers={apiData?.UsersToTag}
							callActivityFeedAPI={callAPI}
						/>
					</Suspense>
				)}
			</div>
		</div>
	);
};

export default HRDetailScreen;
