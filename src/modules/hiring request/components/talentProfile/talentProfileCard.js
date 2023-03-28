import React, { Suspense } from 'react';
import EmptyTalentProfile from '../emptyTalentProfile/emptyTalentProfile';
import TalentProfileCardStyle from './talentProfile.module.css';

const TalentList = React.lazy(() => import('../talentList/talentList'));

const TalentProfileCard = ({ talentDetail, miscData, HRStatusCode, hrId, hiringRequestNumber, hrType }) => {
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
								talentDetail={talentDetail && talentDetail}
								miscData={miscData}
								HRStatusCode={HRStatusCode}
								hrId={hrId}
								hiringRequestNumber={hiringRequestNumber}
								hrType={hrType}
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
