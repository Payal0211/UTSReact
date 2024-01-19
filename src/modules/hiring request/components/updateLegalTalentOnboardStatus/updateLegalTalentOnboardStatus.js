import UpdateLegalClientOnboardStatusStyle from './updateLegalTalentOnboard.module.css';
import { useCallback, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import HRSelectField from '../hrSelectField/hrSelectField';
import HRInputField from '../hrInputFields/hrInputFields';
import { InputType } from 'constants/application';
import { OnboardDAO } from 'core/onboard/onboardDAO';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import DatePicker from 'react-datepicker';
import { lastWorkingDay } from 'shared/utils/basic_utils';
import { Skeleton } from 'antd';

const UpdateLegalTalentOnboardStatus = ({
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
	const [isLoading, setIsLoading] = useState(false)
	const getTalentStatusHandler = useCallback(async () => {
		const response = await OnboardDAO.getOnboardStatusRequestDAO({
			onboardID: talentInfo?.OnBoardId,
			action: 'LegalClient',
		});
		if(response?.responseBody?.details?.Data?.ContractStartDate){
			let sDateParts = response?.responseBody?.details?.Data?.ContractStartDate.split('/');
			setValue('engagementStartDate',  new Date(sDateParts[2], sDateParts[1] - 1, sDateParts[0]));
		}
		if(response?.responseBody?.details?.Data?.ContractEndDate){
			let eDateParts = response?.responseBody?.details?.Data?.ContractEndDate.split('/');
			setValue('engagementEndDate',  new Date(eDateParts[2], eDateParts[1] - 1, eDateParts[0]));
		}
		setTalentStatus(response && response?.responseBody?.details?.Data);
	}, [talentInfo?.OnBoardId]);
	const watchOnboardTalentStatus = watch('onboardTalentStatus');

	const talentStatusSubmitHanlder = useCallback(
		async (d) => {
			setIsLoading(true)
			let talentStatusObject = {
				onboardID: talentInfo?.OnBoardId,
				talentID: talentInfo?.TalentID,
				hiringRequestID: hrId,
				contactID: talentInfo?.ContactId,
				action: 'LegalTalent',
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
			setIsLoading(false)
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
		if (watchOnboardTalentStatus?.id !== 2) {
			unregister('talentLegalDate');
			unregister('engagementStartDate');
			unregister('engagementEndDate');
		}
	}, [unregister, watchOnboardTalentStatus?.id]);

	return (
		<div className={UpdateLegalClientOnboardStatusStyle.container}>
			<div className={UpdateLegalClientOnboardStatusStyle.modalTitle}>
				<h2>Change Talent Legal Status</h2>
			</div>

			<div className={UpdateLegalClientOnboardStatusStyle.transparent}>
				{isLoading ? <Skeleton /> : <>
				<div className={UpdateLegalClientOnboardStatusStyle.colMd12}>
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
				{watch('onboardTalentStatus')?.id === 2 && (
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
										Talent Legal Date <span>*</span>
									</div>
									<div
										className={
											UpdateLegalClientOnboardStatusStyle.timeSlotItem
										}>
										<CalenderSVG />
										<Controller
											render={({ ...props }) => (
												<DatePicker
													selected={watch('talentLegalDate')}
													onChange={(date) => {
														setValue('talentLegalDate', date);
													}}
													placeholderText="Talent Legal Date"
												/>
											)}
											name="talentLegalDate"
											rules={{ required: true }}
											control={control}
										/>
										{errors.talentLegalDate && (
											<div
												className={UpdateLegalClientOnboardStatusStyle.error}>
												Please select talent legal date
											</div>
										)}
									</div>
								</div>
							</div>
							<div className={UpdateLegalClientOnboardStatusStyle.colMd6}>
								<div
									className={
										UpdateLegalClientOnboardStatusStyle.timeSlotItemField
									}>
									<div
										className={
											UpdateLegalClientOnboardStatusStyle.timeSlotLabel
										}>
										Engagement Start Date <span>*</span>
									</div>
									<div
										className={
											UpdateLegalClientOnboardStatusStyle.timeSlotItem
										}>
										<CalenderSVG />
										<Controller
											render={({ ...props }) => (
												<DatePicker
													selected={watch('engagementStartDate')}
													onChange={(date) => {
														setValue('engagementStartDate', date);
													}}
													placeholderText="Engagement Start Date"
												/>
											)}
											name="engagementStartDate"
											rules={{ required: true }}
											control={control}
										/>
										{errors.engagementStartDate && (
											<div
												className={UpdateLegalClientOnboardStatusStyle.error}>
												Please select engagement start date
											</div>
										)}
									</div>
								</div>
							</div>
							<div className={UpdateLegalClientOnboardStatusStyle.colMd6}>
								<div
									className={
										UpdateLegalClientOnboardStatusStyle.timeSlotItemField
									}>
									<div
										className={
											UpdateLegalClientOnboardStatusStyle.timeSlotLabel
										}>
										Engagement End Date <span>*</span>
									</div>
									<div
										className={
											UpdateLegalClientOnboardStatusStyle.timeSlotItem
										}>
										<CalenderSVG />
										<Controller
											render={({ ...props }) => (
												<DatePicker
													selected={watch('engagementEndDate')}
													onChange={(date) => {
														setValue('engagementEndDate', date);
													}}
													placeholderText="Engagement End Date"
												/>
											)}
											name="engagementEndDate"
											rules={{ required: true }}
											control={control}
										/>
										{errors.engagementEndDate && (
											<div
												className={UpdateLegalClientOnboardStatusStyle.error}>
												Please select engagement end date
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</>
				)}
				</> }
				

				<div className={UpdateLegalClientOnboardStatusStyle.formPanelAction}>
					<button
					    disabled={isLoading}
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

export default UpdateLegalTalentOnboardStatus;
