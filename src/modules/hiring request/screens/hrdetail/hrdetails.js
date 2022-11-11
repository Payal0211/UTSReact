import HRDetailStyle from './hrdetail.module.css';
import React, { Suspense, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdOutlineArrowBackIos } from 'react-icons/md';
import { FiTrash2 } from 'react-icons/fi';
import Routes from 'constants/routes';
import { All_Hiring_Request_Utils } from 'shared/utils/all_hiring_request_util';
import {
	hiringRequestHRStatus,
	hiringRequestPriority,
} from 'constants/application';
import { AiOutlineDown } from 'react-icons/ai';
import { Skeleton } from 'antd';
import HROperator from 'modules/hiring request/components/hroperator/hroperator';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';

/** Lazy Loading the component */
const CompanyProfileCard = React.lazy(() =>
	import('modules/hiring request/components/companyProfile/companyProfileCard'),
);
const TalentProfileCard = React.lazy(() =>
	import('modules/hiring request/components/talentProfile/talentProfileCard'),
);
const ActivityFeed = React.lazy(() =>
	import('modules/hiring request/components/activityFeed/activityFeed'),
);

const HRDetailScreen = () => {
	const [isLoading, setLoading] = useState(false);
	const [apiData, setAPIdata] = useState([]);

	const switchLocation = useLocation();
	let urlSplitter = `${switchLocation.pathname.split('/')[2]}`;
	const updatedSplitter = 'HR' + urlSplitter?.split('HR')[1];

	useEffect(() => {
		setLoading(true);
		async function callAPI(hrid) {
			let response = await hiringRequestDAO.getViewHiringRequestDAO(hrid);
			if (response) {
				setAPIdata(response && response?.responseBody);
				setLoading(false);
			}
		}
		callAPI(urlSplitter?.split('HR')[0]);
	}, [urlSplitter]);

	console.log(apiData);
	return (
		<div className={HRDetailStyle.hiringRequestContainer}>
			<Link to={Routes.ALLHIRINGREQUESTROUTE}>
				<div className={HRDetailStyle.goback}>
					<MdOutlineArrowBackIos />
					<span>Go Back</span>
				</div>
			</Link>
			<div className={HRDetailStyle.hrDetails}>
				<div className={HRDetailStyle.hrDetailsLeftPart}>
					<div className={HRDetailStyle.hiringRequestIdSets}>
						HR ID - {updatedSplitter}
					</div>
					{All_Hiring_Request_Utils.GETHRSTATUS(
						hiringRequestHRStatus.PROFILE_SHARED,
						'Profile Shared',
					)}
					<div className={HRDetailStyle.hiringRequestPriority}>
						{All_Hiring_Request_Utils.GETHRPRIORITY(
							hiringRequestPriority.NEXT_WEEK_PRIORITY,
						)}
					</div>
				</div>
				<div className={HRDetailStyle.hrDetailsRightPart}>
					<HROperator
						title="Accept HR"
						icon={<AiOutlineDown />}
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
						icon={<AiOutlineDown />}
						backgroundColor={`var(--background-color-light)`}
						labelBorder={`1px solid var(--color-sunlight)`}
						iconBorder={`1px solid var(--color-sunlight)`}
					/>
					<div className={HRDetailStyle.hiringRequestPriority}>
						<FiTrash2
							style={{
								fontSize: '1.5rem',
								color: `var(--uplers-black)`,
							}}
						/>
					</div>
				</div>
			</div>
			<div className={HRDetailStyle.hrNextActionForTalent}>
				<div className={HRDetailStyle.nextActionList}>
					<div className={HRDetailStyle.actionItem}>
						<AiOutlineClockCircle style={{ fontSize: '20px' }} />
						<label>Saptarshee to schedule interview for Velma B R</label>
					</div>

					<div className={HRDetailStyle.actionItem}>
						<AiOutlineClockCircle style={{ fontSize: '20px' }} />
						<label>Saptarshee to schedule interview for Velma B R</label>
					</div>
					<div className={HRDetailStyle.actionItem}>
						<AiOutlineClockCircle style={{ fontSize: '20px' }} />
						<label>Saptarshee to schedule interview for Velma B R</label>
					</div>
				</div>
			</div>
			<div className={HRDetailStyle.portal}>
				<div className={HRDetailStyle.clientPortal}>
					{isLoading ? (
						<Skeleton active />
					) : (
						<Suspense>
							<CompanyProfileCard clientDetail={apiData?.ClientDetail} />
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
						<ActivityFeed activityFeed={apiData?.HRHistory} />
					</Suspense>
				)}
			</div>
			<br />
		</div>
	);
};

export default HRDetailScreen;
