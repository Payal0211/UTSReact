import UpdateLegalClientOnboardStatusStyle from './updateKickOffOnboardStatus.module.css';
import { useCallback, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import HRSelectField from '../hrSelectField/hrSelectField';
import HRInputField from '../hrInputFields/hrInputFields';
import { InputType } from 'constants/application';
import { OnboardDAO } from 'core/onboard/onboardDAO';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import DatePicker from 'react-datepicker';
import { lastWorkingDay } from 'shared/utils/basic_utils';

const UpdateKickOffOnboardStatus = ({
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
		control,
		formState: { errors },
	} = useForm({});

	const [talentStatus, setTalentStatus] = useState([]);
	const getTalentStatusHandler = useCallback(async () => {
		const response = await OnboardDAO.getOnboardStatusRequestDAO({
			onboardID: talentInfo?.OnBoardId,
			action: 'KickOff',
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
				action: 'KickOff',
				onboardingClient: {},
				legalTalent: {
					talentLegalStatusID: d.onboardTalentStatus?.id, // dropdown selected id
					talentLegalDate: d.talentLegalDate,
					totalDuration: lastWorkingDay(
						d.engagementStartDate,
						d.engagementEndDate,
					),
					contractStartDate: d.engagementStartDate,
					contractEndDate: d.engagementEndDate,
					lastworkingdate: d.engagementEndDate,
				},
				legalClient: {},
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
		if (watchOnboardTalentStatus?.id !== 4) {
			unregister('talentLegalDate');
			unregister('engagementStartDate');
			unregister('engagementEndDate');
		}
	}, [unregister, watchOnboardTalentStatus?.id]);

	return (
		<div className={UpdateLegalClientOnboardStatusStyle.container}>
			<div className={UpdateLegalClientOnboardStatusStyle.modalTitle}>
				<h2>Kick Off Status</h2>
			</div>

			<div className={UpdateLegalClientOnboardStatusStyle.transparent}>
				<div className={UpdateLegalClientOnboardStatusStyle.row}>
					<div
						className={
							watch('onboardTalentStatus')?.id === 4
								? `${UpdateLegalClientOnboardStatusStyle.colMd6}`
								: `${UpdateLegalClientOnboardStatusStyle.colMd12}`
						}>
						<HRSelectField
							mode={'id/value'}
							setValue={setValue}
							register={register}
							name="onboardTalentStatus"
							label="Change Status"
							defaultValue="Please Select"
							options={talentStatus?.onBoardLegalKickOffStatus}
							required
							isError={
								errors['onboardTalentStatus'] && errors['onboardTalentStatus']
							}
							errorMsg="Please select status."
						/>
					</div>
					{watch('onboardTalentStatus')?.id === 4 && (
						<div className={UpdateLegalClientOnboardStatusStyle.colMd6}>
							<HRSelectField
								mode={'id/value'}
								setValue={setValue}
								register={register}
								name="timezone"
								label="Time Zone"
								defaultValue="Please Select"
								options={[
									{
										id: 1,
										value: 'Leave Deduction',
									},
									{
										id: 2,
										value: 'Add Bonus',
									},
								]}
								required
								isError={errors['timezone'] && errors['timezone']}
								errorMsg="Please select a timezone."
							/>
						</div>
					)}
				</div>
				{watch('onboardTalentStatus')?.id === 4 && (
					<>
						<div className={UpdateLegalClientOnboardStatusStyle.row}>
							<div className={UpdateLegalClientOnboardStatusStyle.colMd6}>
								<div
									className={
										UpdateLegalClientOnboardStatusStyle.timeSlotItemField
									}>
									<div
										className={
											UpdateLegalClientOnboardStatusStyle.timeSlotLabel
										}>
										Kick Off Date <span>*</span>
									</div>
									<div
										className={
											UpdateLegalClientOnboardStatusStyle.timeSlotItem
										}>
										<CalenderSVG />
										<Controller
											render={({ ...props }) => (
												<DatePicker
													selected={watch('kickOffDate')}
													onChange={(date) => {
														setValue('kickOffDate', date);
													}}
													placeholderText="Please select Date"
												/>
											)}
											name="kickOffDate"
											rules={{ required: true }}
											control={control}
										/>
										{errors.kickOffDate && (
											<div
												className={UpdateLegalClientOnboardStatusStyle.error}>
												Please select kick off date
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</>
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

export default UpdateKickOffOnboardStatus;
