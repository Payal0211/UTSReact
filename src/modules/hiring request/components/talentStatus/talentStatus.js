import TalentStatusStyle from './talentStatus.module.css';
import { useCallback, useEffect, useState } from 'react';
import { Radio } from 'antd';

import { useForm } from 'react-hook-form';

import HRSelectField from '../hrSelectField/hrSelectField';
import { TalentStatusDAO } from 'core/talent/talentDAO';
import HRInputField from '../hrInputFields/hrInputFields';
import { InputType } from 'constants/application';
import { _isNull } from 'shared/utils/basic_utils';
import { HTTPStatusCode } from 'constants/network';
import SpinLoader from 'shared/components/spinLoader/spinLoader';

const TalentStatus = ({ talentInfo, hrId, callAPI, closeModal }) => {
	const {
		register,
		handleSubmit,
		setValue,
		control,
		setError,
		getValues,
		unregister,
		watch,
		formState: { errors },
	} = useForm({});
	const [isLoading, setIsLoading] = useState(false);
	const watchTalentStatus = watch('talentStatus');
	const watchCancelReason = watch('cancelReason');
	const watchRejectReason = watch('rejectReason');
	const watchOnHoldReason = watch('onHoldReason');
	const [talentStatus, setTalentStatus] = useState([]);
	const [radioValue, setRadioValue] = useState('Before Interview');
	const getTalentStatusHandler = useCallback(async () => {
		const response = await TalentStatusDAO.getStatusDetailRequestDAO({
			talentID: talentInfo?.TalentID,
			hrID: hrId,
			talentStatusID: talentInfo?.TalentStatusID_BasedOnHR,
			talentStatus: _isNull(talentInfo?.Status) ? '0' : talentInfo?.Status,
		});

		setTalentStatus(response && response?.responseBody?.details);
	}, [
		hrId,
		talentInfo?.Status,
		talentInfo?.TalentID,
		talentInfo?.TalentStatusID_BasedOnHR,
	]);

	const removeOnHoldStatusHandler = useCallback(async () => {
		const response = await TalentStatusDAO.removeOnHoldStatusRequestDAO({
			hrID: hrId,
			contactTalentPriorityID: talentInfo?.ContactPriorityID,
		});
		if (response?.statusCode === HTTPStatusCode.OK) {
			callAPI(hrId);
		}
	}, [callAPI, hrId, talentInfo?.ContactPriorityID]);
	const talentStatusSubmitHanlder = useCallback(
		async (d) => {
			setIsLoading(true);
			let talentStatusObject = {
				hrid: hrId,
				hrDetailID: talentInfo?.HiringDetailID,
				talentID: talentInfo?.TalentID,
				talentStatusID: d.talentStatus?.id,
				talentStatus: d.talentStatus?.value,
				rejectReasonID: _isNull(d.rejectReason?.id) ? 0 : d.rejectReason?.id,
				onHoldReasonID: _isNull(d.onHoldReason?.id) ? 0 : d.onHoldReason?.id,
				cancelReasonID: _isNull(d.cancelReason?.id) ? 0 : d.cancelReason?.id,
				otherReason: _isNull(d.otherReason) ? null : d.otherReason,
				remark: d.onHoldRemark || d.lossRemark,
			};

			let response = await TalentStatusDAO.updateTalentStatusRequestDAO(
				talentStatusObject,
			);
			/* if (response?.statusCode === HTTPStatusCode.OK) {
				callAPI(hrId);
			} */
			if (response) {
				setIsLoading(false);
				callAPI(hrId);
			}
		},
		[callAPI, hrId, talentInfo?.HiringDetailID, talentInfo?.TalentID],
	);

	useEffect(() => {
		getTalentStatusHandler();
	}, [getTalentStatusHandler]);

	useEffect(() => {
		if (watchTalentStatus?.id !== 5) unregister('cancelReason');
		if (watchTalentStatus?.id !== 7) unregister('rejectReason');
		if (watchTalentStatus?.id !== 6) unregister('onHoldReason');
		if (watchTalentStatus?.id !== 5 && watchCancelReason?.id !== -1) {
			unregister(['otherReason']);
		}
		if (watchTalentStatus?.id !== 7 && watchRejectReason?.id !== -1) {
			unregister(['otherReason']);
		}
		if (watchTalentStatus?.id !== 6 && watchOnHoldReason?.id !== -1) {
			unregister(['otherReason']);
		}
	}, [
		unregister,
		watchCancelReason,
		watchOnHoldReason?.id,
		watchRejectReason?.id,
		watchTalentStatus?.id,
	]);

	return (
		<div className={TalentStatusStyle.container}>
			<div className={TalentStatusStyle.modalTitle}>
				<h2>Change Talent Status</h2>
			</div>

			{isLoading ? (
				<SpinLoader />
			) : (
				<div className={TalentStatusStyle.transparent}>

					<div className={TalentStatusStyle.colMd12} style={{display:'flex'}}>
						<p style={{marginRight:'5px'}}>Did this status change occur prior to the interview or following the interview?</p>

						<Radio.Group
										className={TalentStatusStyle.radioGroup}
										onChange={e=> setRadioValue(e.target.value)}
										value={radioValue}>
										<Radio value={'Before Interview'}>
										Before Interview
										</Radio>
										<Radio value={'After Interview'}>
										After Interview
										</Radio>
									</Radio.Group>
					</div>
					<div className={TalentStatusStyle.colMd12}>
						<HRSelectField
							mode={'id/value'}
							setValue={setValue}
							register={register}
							name="talentStatus"
							label="Select Talent Status"
							defaultValue="Please Select"
							options={talentStatus?.Data?.TalentStatusAfterClientSelections}
							required
							isError={errors['talentStatus'] && errors['talentStatus']}
							errorMsg="Please select talent Status."
						/>
					</div>
					{watch('talentStatus')?.id === 5 && (
						<div className={TalentStatusStyle.colMd12}>
							<HRSelectField
								mode={'id/value'}
								setValue={setValue}
								register={register}
								name="cancelReason"
								label="Select Cancel Reason"
								defaultValue="Please Select"
								options={talentStatus?.Data?.TalentCancelledReason}
								required
								isError={errors['cancelReason'] && errors['cancelReason']}
								errorMsg="Please select Cancel Reason."
							/>
						</div>
					)}

					{watch('talentStatus')?.id === 7 && (
						<>
							<div className={TalentStatusStyle.colMd12}>
								<HRSelectField
									mode={'id/value'}
									setValue={setValue}
									register={register}
									name="rejectReason"
									label="Select Reject Reason"
									defaultValue="Please Select"
									options={talentStatus?.Data?.TalentRejectReason}
									required
									isError={errors['rejectReason'] && errors['rejectReason']}
									errorMsg="Please select reject Reason."
								/>
							</div>
							<div className={TalentStatusStyle.colMd12}>
								<HRInputField
									isTextArea={true}
									register={register}
									errors={errors}
									label={'Loss Remarks'}
									required
									name="lossRemark"
									type={InputType.TEXT}
									placeholder="Loss Remark"
									validationSchema={{
										required: 'please enter the loss remark.',
									}}
								/>
							</div>
						</>
					)}
					{watch('talentStatus')?.id === 6 && (
						<>
							<div className={TalentStatusStyle.colMd12}>
								<HRSelectField
									mode={'id/value'}
									setValue={setValue}
									register={register}
									name="onHoldReason"
									label="Select OnHold Reason"
									defaultValue="Please Select"
									options={talentStatus?.Data?.TalentOnHoldReason}
									required
									isError={errors['onHoldReason'] && errors['onHoldReason']}
									errorMsg="Please select on hold	 Reason."
								/>
							</div>
							<div className={TalentStatusStyle.colMd12}>
								<HRInputField
									isTextArea={true}
									register={register}
									errors={errors}
									label={'OnHold Remarks'}
									required
									name="onHoldRemark"
									type={InputType.TEXT}
									placeholder="OnHold Remark"
									validationSchema={{
										required: 'please enter the on hold remark.',
									}}
								/>
							</div>
						</>
					)}
					{(watch('cancelReason')?.id === -1 &&
						watch('talentStatus')?.id === 5) ||
					(watch('rejectReason')?.id === -1 &&
						watch('talentStatus')?.id === 7) ||
					(watch('onHoldReason')?.id === -1 &&
						watch('talentStatus')?.id === 6) ? (
						<div className={TalentStatusStyle.colMd12}>
							<HRInputField
								isTextArea={true}
								register={register}
								errors={errors}
								label={'Others Reason'}
								required
								name="otherReason"
								type={InputType.TEXT}
								placeholder="Other Reason"
								validationSchema={{
									required: 'please enter the other reason.',
								}}
							/>
						</div>
					) : null}
					{talentStatus?.Data?.TalentStatus === 'On Hold' && (
						<div className={TalentStatusStyle?.colMd12}>
							<div className={TalentStatusStyle.formPanelAction}>
								<button
									type="submit"
									onClick={removeOnHoldStatusHandler}
									className={TalentStatusStyle.btnDanger}>
									Remove OnHold Status
								</button>
							</div>
						</div>
					)}
					<div className={TalentStatusStyle.formPanelAction}>
						<button
							type="submit"
							onClick={handleSubmit(talentStatusSubmitHanlder)}
							className={TalentStatusStyle.btnPrimary}>
							Save
						</button>
						<button
							onClick={closeModal}
							className={TalentStatusStyle.btn}>
							Cancel
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default TalentStatus;
