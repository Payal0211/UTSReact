import { Card, List, Pagination } from 'antd';
import EmptyTalentProfile from '../emptyTalentProfile/emptyTalentProfile';
import TalentList from '../talentList/talentList';
import TalentProfileCardStyle from './talentProfile.module.css';

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
						<TalentList talentDetail={talentDetail && talentDetail} />
					) : (
						<EmptyTalentProfile />
					)}
				</div>
			</div>
		</div>
	);
};

export default TalentProfileCard;
