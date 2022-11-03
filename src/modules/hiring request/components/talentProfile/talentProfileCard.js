import EmptyTalentProfile from '../emptyTalentProfile/emptyTalentProfile';
import TalentProfileCardStyle from './talentProfile.module.css';

const TalentProfileCard = ({ talentDetail }) => {
	return (
		<div className={TalentProfileCardStyle.talentProfileContainer}>
			<label>
				<h1>Profiles Shared</h1>
			</label>
			<div className={TalentProfileCardStyle.talentCard}>
				<div className={TalentProfileCardStyle.talentCardBody}>
					{!talentDetail ? 'hello' : <EmptyTalentProfile />}
				</div>
			</div>
		</div>
	);
};

export default TalentProfileCard;
