import React, { Suspense } from 'react';
import EmptyTalentProfile from '../emptyTalentProfile/emptyTalentProfile';
import TalentProfileCardStyle from './talentProfile.module.css';
import { hrUtils } from 'modules/hiring request/hrUtils';
import { HiringRequestHRStatus } from 'constants/application';

const TalentList = React.lazy(() => import('../talentList/talentList'));

const TalentProfileCard = ({
	apiData,
	talentCTA,
	talentDetail,
	miscData,
	clientDetail,
	HRStatusCode,
	callAPI,
	hrId,
	hiringRequestNumber,
	starMarkedStatusCode,
	hrStatus,
	hrType,
	callHRapi,
	inteviewSlotDetails,
	setHRapiCall,
	urlSplitter,
	getNextActionMissingActionMemo,
	updatedSplitter,
}) => {
	return (
		<div className={TalentProfileCardStyle.talentProfileContainer}>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'flexStart',
					gap: '24px',
				}}>
				<label>
					<h1>Profiles Shared</h1>
				</label>
				{HRStatusCode !== HiringRequestHRStatus.CANCELLED &&
					apiData?.dynamicCTA?.MatchMaking &&
					hrUtils.showMatchmaking(
						apiData,
						miscData?.LoggedInUserTypeID,
						callAPI,
						urlSplitter,
						updatedSplitter,
						getNextActionMissingActionMemo?.key, // only to hide matchmaking button in case of share Profile
					)}
			</div>

			<div
				className={TalentProfileCardStyle.talentCard}
				style={{
					backgroundColor:
						talentDetail?.length > 0
							? `transparent`
							: `var(--background-color-light)`,
				}}>
				<div className={TalentProfileCardStyle.talentCardBody}>
					{talentDetail?.length > 0 ? (
						<Suspense>
							<TalentList
								callAPI={callAPI}
								talentCTA={talentCTA}
								talentDetail={talentDetail && talentDetail}
								miscData={miscData}
								HRStatusCode={HRStatusCode}
								hrId={hrId}
								hiringRequestNumber={hiringRequestNumber}
								starMarkedStatusCode={starMarkedStatusCode}
								hrStatus={hrStatus}
								hrType={hrType}
								clientDetail={clientDetail}
								callHRapi={callHRapi}
								setHRapiCall={setHRapiCall}
								inteviewSlotDetails={inteviewSlotDetails}
							/>
						</Suspense>
					) : (
						<EmptyTalentProfile talentLength={talentDetail?.length} />
					)}
				</div>
			</div>
		</div>
	);
};

export default TalentProfileCard;
