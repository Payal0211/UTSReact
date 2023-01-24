import React, { Suspense, useCallback, useEffect, useState } from 'react';
import emptyTalentProfileStyle from './emptyTalentProfile.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { HTTPStatusCode } from 'constants/network';
import UTSRoutes from 'constants/routes';
const MatchmakingModal = React.lazy(() =>
	import('modules/hiring request/components/matchmaking/matchmaking'),
);
const EmptyTalentProfile = ({ talentLength }) => {
	const [isLoading, setLoading] = useState(false);
	const switchLocation = useLocation();
	const navigate = useNavigate();
	let urlSplitter = `${switchLocation.pathname.split('/')[2]}`;
	const updatedSplitter = 'HR' + urlSplitter?.split('HR')[1];
	const [apiData, setAPIdata] = useState([]);
	const callAPI = useCallback(
		async (hrid) => {
			let response = await hiringRequestDAO.getViewHiringRequestDAO(hrid);

			if (response.statusCode === HTTPStatusCode.OK) {
				setAPIdata(response && response?.responseBody);
				setLoading(false);
			} else if (response.statusCode === HTTPStatusCode.NOT_FOUND) {
				navigate(UTSRoutes.PAGENOTFOUNDROUTE);
			}
		},
		[navigate],
	);
	useEffect(() => {
		setLoading(true);
		callAPI(urlSplitter?.split('HR')[0]);
	}, [urlSplitter, callAPI]);
	return (
		<div className={emptyTalentProfileStyle.emptyContainer}>
			<div className={emptyTalentProfileStyle.emptyContainerBody}>
				<div className={emptyTalentProfileStyle.noProfileSelected}>
					<h3>No Profiles Selected</h3>
				</div>
				<div>
					<p>Please select a profile that best matches this hiring request</p>
				</div>
				<div className={emptyTalentProfileStyle.exploreMore}>
					<Suspense>
						<MatchmakingModal
							talentLength={talentLength}
							hrID={urlSplitter?.split('HR')[0]}
							hrNo={updatedSplitter}
							hrStatusCode={apiData?.HRStatusCode}
							hrStatus={apiData?.HRStatus}
							hrPriority={apiData?.StarMarkedStatusCode}
						/>
					</Suspense>
				</div>
			</div>
		</div>
	);
};

export default EmptyTalentProfile;
