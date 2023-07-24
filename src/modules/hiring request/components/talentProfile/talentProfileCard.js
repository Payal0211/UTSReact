import React, { Suspense, useState } from 'react';
import EmptyTalentProfile from '../emptyTalentProfile/emptyTalentProfile';
import TalentProfileCardStyle from './talentProfile.module.css';
import { hrUtils } from 'modules/hiring request/hrUtils';
import { HiringRequestHRStatus } from 'constants/application';
import MatchmakingModal from '../matchmaking/matchmaking';

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
	const [isMatchmaking, setIsMatchMaking] = useState(false);
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
				{apiData?.dynamicCTA?.MatchMaking && (
					<button
						disabled={!apiData?.dynamicCTA?.MatchMaking?.IsEnabled}
						onClick={() => setIsMatchMaking(true)}
						className={
							apiData?.dynamicCTA?.MatchMaking?.IsEnabled
								? TalentProfileCardStyle.matchmakeButtonOutline
								: TalentProfileCardStyle.disabledTransparentBtnGroup
						}>
						Matchmake Talent
					</button>
				)}
				{isMatchmaking && (
					<MatchmakingModal
						isMatchmaking={isMatchmaking}
						setMatchmakingModal={setIsMatchMaking}
						onCancel={() => setIsMatchMaking(false)}
						apiData={apiData}
						refreshedHRDetail={callAPI}
						hrID={urlSplitter?.split('HR')[0]}
						hrNo={updatedSplitter}
						hrStatusCode={apiData?.HRStatusCode}
						hrStatus={apiData?.HRStatus}
						hrPriority={apiData?.StarMarkedStatusCode}
						currency={apiData?.HRDetails?.Currency}
					/>
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
