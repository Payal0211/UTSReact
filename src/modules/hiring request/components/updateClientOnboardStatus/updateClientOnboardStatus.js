import UpdateClientOnboardStatusStyle from './updateClientOnboard.module.css';
import { useCallback, useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';

import HRSelectField from '../hrSelectField/hrSelectField';
import { TalentStatusDAO } from 'core/talent/talentDAO';
import HRInputField from '../hrInputFields/hrInputFields';
import { InputType } from 'constants/application';
import { _isNull } from 'shared/utils/basic_utils';
import { OnboardDAO } from 'core/onboard/onboardDAO';

const UpdateClientOnBoardStatus = ({
	talentInfo,
	hrId,
	callAPI,
	getHrUserData,
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
			action: 'OnboardingClient',
		});

		setTalentStatus(response && response?.responseBody?.details?.Data);
	}, [talentInfo?.OnBoardId]);
	const watchOnboardClientStatus = watch('onboardClientStatus');

	const talentStatusSubmitHanlder = useCallback(
		async (d) => {
			let talentStatusObject = {
				onboardID: talentInfo?.OnBoardId,
				talentID: talentInfo?.TalentID,
				hiringRequestID: hrId,
				contactID: talentInfo?.ContactId,
				action: 'OnboardingClient',
				onboardingClient: {
					clientOnBoardingStatusID: d.onboardClientStatus?.id,
					clientConcernRemark: d.concernRemark || '',
				},
				legalTalent: null,
				legalClient: null,
				kickOff: null,
			};

			let response = await OnboardDAO.onboardStatusUpdatesRequestDAO(
				talentStatusObject,
			);
			if (response) {callAPI(hrId);getHrUserData(hrId)}
		},
		[
			callAPI,
			getHrUserData,
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
		if (watchOnboardClientStatus?.id !== 3) unregister('concernRemark');
	}, [unregister, watchOnboardClientStatus?.id]);

	return (
		<div className={UpdateClientOnboardStatusStyle.container}>
			<div className={UpdateClientOnboardStatusStyle.modalTitle}>
				<h2>Change Onboard Client Status</h2>
			</div>

			<div className={UpdateClientOnboardStatusStyle.transparent}>
				<div className={UpdateClientOnboardStatusStyle.colMd12}>
					<HRSelectField
						mode={'id/value'}
						setValue={setValue}
						register={register}
						name="onboardClientStatus"
						label="Select Onboard Client Status"
						defaultValue="Please Select"
						options={talentStatus?.preOnBoardStatus}
						required
						isError={
							errors['onboardClientStatus'] && errors['onboardClientStatus']
						}
						errorMsg="Please select onboard client status."
					/>
				</div>
				{watch('onboardClientStatus')?.id === 3 && (
					<div className={UpdateClientOnboardStatusStyle.colMd12}>
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

				<div className={UpdateClientOnboardStatusStyle.formPanelAction}>
					<button
						type="submit"
						onClick={handleSubmit(talentStatusSubmitHanlder)}
						className={UpdateClientOnboardStatusStyle.btnPrimary}>
						Save
					</button>
					<button
						onClick={closeModal}
						className={UpdateClientOnboardStatusStyle.btn}>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default UpdateClientOnBoardStatus;
