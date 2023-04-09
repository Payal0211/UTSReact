import UpdateLegalClientOnboardStatusStyle from './updateLegalClientOnboardStatus.module.css';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import HRSelectField from '../hrSelectField/hrSelectField';
import HRInputField from '../hrInputFields/hrInputFields';
import { InputType } from 'constants/application';
import { OnboardDAO } from 'core/onboard/onboardDAO';

const UpdateLegalClientOnboardStatus = ({
	talentInfo,
	hrId,
	callAPI,
	closeModal,
}) => {
	const {
		register,
		handleSubmit,
		setValue,
		unregister,
		watch,
		formState: { errors },
	} = useForm({});

	const [talentStatus, setTalentStatus] = useState([]);
	const getTalentStatusHandler = useCallback(async () => {
		const response = await OnboardDAO.getOnboardStatusRequestDAO({
			onboardID: talentInfo?.OnBoardId,
			action: 'LegalClient',
		});

		setTalentStatus(response && response?.responseBody?.details?.Data);
	}, [talentInfo?.OnBoardId]);
	const watchOnboardTalentStatus = watch('onboardTalentStatus');

	const talentStatusSubmitHanlder = useCallback(
		async (d) => {
			let talentStatusObject = {
				onboardID: talentInfo?.OnBoardId,
				talentID: talentInfo?.TalentID,
				hiringRequestID: hrId,
				contactID: talentInfo?.ContactId,
				action: 'LegalClient',
				onboardingClient: {
					clientOnBoardingStatusID: d.onboardTalentStatus?.id,
					clientConcernRemark: d.concernRemark || '',
				},
				legalTalent: null,
				legalClient: null,
				kickOff: null,
			};

			let response = await OnboardDAO.onboardStatusUpdatesRequestDAO(
				talentStatusObject,
			);
			if (response) callAPI(hrId);
		},
		[
			callAPI,
			hrId,
			talentInfo?.ContactId,
			talentInfo?.OnBoardId,
			talentInfo?.TalentID,
		],
	);

	useEffect(() => {
		getTalentStatusHandler();
	}, [getTalentStatusHandler]);

	useEffect(() => {
		if (watchOnboardTalentStatus?.id !== 3) unregister('concernRemark');
	}, [unregister, watchOnboardTalentStatus?.id]);

	return (
		<div className={UpdateLegalClientOnboardStatusStyle.container}>
			<div className={UpdateLegalClientOnboardStatusStyle.modalTitle}>
				<h2>Change Onboard Talent Status</h2>
			</div>

			<div className={UpdateLegalClientOnboardStatusStyle.transparent}>
				<div className={UpdateLegalClientOnboardStatusStyle.colMd12}>
					<HRSelectField
						mode={'id/value'}
						setValue={setValue}
						register={register}
						name="onboardTalentStatus"
						label="Select Onboard Talent Status"
						defaultValue="Please Select"
						options={talentStatus?.preOnBoardStatus}
						required
						isError={
							errors['onboardTalentStatus'] && errors['onboardTalentStatus']
						}
						errorMsg="Please select onboard talent status."
					/>
				</div>
				{watch('onboardTalentStatus')?.id === 4 && (
					<div className={UpdateLegalClientOnboardStatusStyle.colMd12}>
						<HRInputField
							isTextArea={true}
							register={register}
							errors={errors}
							label={'Concern remark'}
							required
							name="concernRemark"
							type={InputType.TEXT}
							placeholder="Concern Remark"
							validationSchema={{
								required: 'please enter the concern remark.',
							}}
						/>
					</div>
				)}

				<div className={UpdateLegalClientOnboardStatusStyle.formPanelAction}>
					<button
						type="submit"
						onClick={handleSubmit(talentStatusSubmitHanlder)}
						className={UpdateLegalClientOnboardStatusStyle.btnPrimary}>
						Save
					</button>
					<button
						onClick={closeModal}
						className={UpdateLegalClientOnboardStatusStyle.btn}>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default UpdateLegalClientOnboardStatus;
