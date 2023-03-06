import OnboardField from 'modules/onboard/components/OnboardField/onboardField';
import AddNewOnboardStyle from './addNewOnboard.module.css';

const AddNewOnboard = () => {
	return (
		<div className={AddNewOnboardStyle.addNewContainer}>
			<div className={AddNewOnboardStyle.onboardLabel}>
				Pre - Onboarding For Anjali Arora
			</div>
			<OnboardField />
		</div>
	);
};

export default AddNewOnboard;
