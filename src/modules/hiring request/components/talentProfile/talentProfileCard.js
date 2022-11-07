import React, { Suspense } from 'react';
import EmptyTalentProfile from '../emptyTalentProfile/emptyTalentProfile';
// import TalentList from '../talentList/talentList';
import TalentProfileCardStyle from './talentProfile.module.css';

const TalentList = React.lazy(() => import('../talentList/talentList'));

const TalentProfileCard = ({ talentDetail }) => {
	return (
		<div className={TalentProfileCardStyle.talentProfileContainer}>
			<label>
				<h1>Profiles Shared</h1>
			</label>
			<div
				className={TalentProfileCardStyle.talentCard}
				style={{
					backgroundColor: talentDetail
						? `transparent`
						: `var(--background-color-light)`,
				}}>
				<div className={TalentProfileCardStyle.talentCardBody}>
					{talentDetail ? (
						<Suspense>
							<TalentList talentDetail={talentDetail && talentDetail} />
						</Suspense>
					) : (
						<EmptyTalentProfile />
					)}
				</div>
			</div>
		</div>
	);
};

export default TalentProfileCard;
