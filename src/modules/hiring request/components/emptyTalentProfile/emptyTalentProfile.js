import emptyTalentProfileStyle from './emptyTalentProfile.module.css';

const EmptyTalentProfile = () => {
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
					Explore Profiles
				</div>
			</div>
		</div>
	);
};

export default EmptyTalentProfile;
