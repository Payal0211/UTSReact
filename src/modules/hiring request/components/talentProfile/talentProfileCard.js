import React, { Suspense } from 'react';
import EmptyTalentProfile from '../emptyTalentProfile/emptyTalentProfile';
import TalentProfileCardStyle from './talentProfile.module.css';

const TalentList = React.lazy(() => import('../talentList/talentList'));

const TalentProfileCard = ({
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
	setHRapiCall
}) => {
	return (
		<div className={TalentProfileCardStyle.talentProfileContainer}>
			<label>
				<h1>Profiles Shared</h1>
			</label>
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
