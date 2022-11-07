import HRDetailStyle from './hrdetail.module.css';
import { Link, useLocation } from 'react-router-dom';
import { MdOutlineArrowBackIos } from 'react-icons/md';
import { FiTrash2 } from 'react-icons/fi';
import Routes from 'constants/routes';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { All_Hiring_Request_Utils } from 'shared/utils/all_hiring_request_util';
import {
	hiringRequestHRStatus,
	hiringRequestPriority,
} from 'constants/application';
import { AiOutlineDown } from 'react-icons/ai';
import HROperator from 'modules/hiring request/components/hroperator/hroperator';
import { AiOutlineClockCircle } from 'react-icons/ai';
import CompanyProfileCard from 'modules/hiring request/components/companyProfile/companyProfileCard';
import TalentProfileCard from 'modules/hiring request/components/talentProfile/talentProfileCard';
import ActivityFeed from 'modules/hiring request/components/activityFeed/activityFeed';

const HRDetailScreen = () => {
	const [isLoading, setLoading] = useState(false);
	const [apiData, setAPIdata] = useState([]);

	const switchLocation = useLocation();
	let urlSplitter = `${switchLocation.pathname.split('/')[2]}`;

	useEffect(() => {
		setLoading(true);
		async function callAPI() {
			let response = await axios.get(
				' https://api.npoint.io/3f27611810049f9d387a',
			);

			setAPIdata(response.data.details);
			setLoading(false);
		}
		callAPI();
	}, []);

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
						HR ID - {urlSplitter}
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
					<CompanyProfileCard clientDetail={apiData.ClientDetail} />
				</div>
				<div className={HRDetailStyle.talentPortal}>
					<TalentProfileCard talentDetail={apiData.HRTalentDetails} />
				</div>
			</div>
			<div className={HRDetailStyle.activityFeed}>
				<ActivityFeed activityFeed={apiData?.HRHistory} />
			</div>
			<br />
		</div>
	);
};

export default HRDetailScreen;
