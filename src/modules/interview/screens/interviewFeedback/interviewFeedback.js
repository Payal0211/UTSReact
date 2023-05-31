import React, { useCallback, useEffect, useState } from 'react';
import InterviewScheduleStyle from '../../interviewStyle.module.css';
import { interviewUtils } from 'modules/interview/interviewUtils';
import { InputType } from 'constants/application';
import { Checkbox, Divider, Radio, message } from 'antd';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import { useForm } from 'react-hook-form';
import { InterviewDAO } from 'core/interview/interviewDAO';
import { HTTPStatusCode } from 'constants/network';
import SpinLoader from 'shared/components/spinLoader/spinLoader';
import AnotherRound from '../anotherRound/anotherRound';

const InterviewFeedback = ({
	isEditFeedback,
	hrId,
	clientDetail,
	callAPI,
	talentInfo,
	talentName,
	HRStatusCode,
	hiringRequestNumber,
	starMarkedStatusCode,
	hrStatus,
	closeModal,
	getScheduleSlotDate,
	getSlotInformationHandler,
	scheduleSlotRadio,
	getScheduleSlotInfomation,
}) => {
	/** For Fourth Round Start --- */
	const [isAnotherRound, setAnotherRound] = useState(false);
	const [interviewFeedbackResult, setInterviewFeedbackResult] = useState(null);
	/** For Fourth Round End */
	const [feedbackDetails, setFeedbackDetails] = useState({});

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm();
	const [messageAPI, contextHolder] = message.useMessage();
	const [radioValue1, setRadioValue1] = useState('Hire');
	const [radioValue2, setRadioValue2] = useState('EE (Exceeds Expectation)');
	const [radioValue3, setRadioValue3] = useState('EE (Exceeds Expectation)');
	const [radioValue4, setRadioValue4] = useState('EE (Exceeds Expectation)');
	const [isClientNotification, setClientNotification] = useState(false);
	const onChange = (e) => {
		if (e.target.value === 'AnotherRound') setAnotherRound(true);
		setRadioValue1(e.target.value);
	};
	const [isLoading, setIsLoading] = useState(false);
	const onChange2 = (e) => {
		setRadioValue2(e.target.value);
	};
	const onChange3 = (e) => {
		setRadioValue3(e.target.value);
	};
	const onChange4 = (e) => {
		setRadioValue4(e.target.value);
	};

	const clientFeedbackHandler = useCallback(
		async (d) => {
			setIsLoading(true);
			const clientFeedback = {
				role: talentInfo?.TalentRole || '',
				talentName: talentInfo?.Name || '',
				talentIDValue: talentInfo?.TalentID,
				contactIDValue: talentInfo?.ContactId,
				hiringRequestID: hrId,
				shortlistedInterviewID: talentInfo?.Shortlisted_InterviewID,
				hdnRadiovalue: radioValue1,
				topSkill: '',
				improvedSkill: '',
				technicalSkillRating: radioValue2,
				communicationSkillRating: radioValue3,
				cognitiveSkillRating: radioValue4,
				messageToTalent: d.interviewClientFeedback || '',
				clientsDecision: d.interviewClientDecision || '',
				comments: d.interviewComments || '',
				en_Id: '',
				IsClientNotificationSent: isClientNotification,
			};

			if (isAnotherRound) {
				// setInterviewFeedbackResult(clientFeedback);
				const response = await InterviewDAO.updateInterviewFeedbackRequestDAO(
					clientFeedback,
				);
				if (response?.statusCode === HTTPStatusCode.OK) {
					setIsLoading(false);
					setInterviewFeedbackResult(clientFeedback);
				}
			} else {
				const response = await InterviewDAO.updateInterviewFeedbackRequestDAO(
					clientFeedback,
				);

				if (response?.statusCode === HTTPStatusCode.OK) {
					setIsLoading(false);
					messageAPI.open(
						{
							type: 'success',
							content: 'Feedback submitted successfully',
						},
						1000,
					);
					setTimeout(() => {
						callAPI(hrId);
						closeModal();
					}, 1000);
				} else {
					setIsLoading(false);
					setIsLoading(false);
					messageAPI.open({
						type: 'error',
						content: response?.responseBody,
					});
				}
			}
		},
		[
			callAPI,
			closeModal,
			hrId,
			isAnotherRound,
			isClientNotification,
			messageAPI,
			radioValue1,
			radioValue2,
			radioValue3,
			radioValue4,
			talentInfo?.ContactId,
			talentInfo?.Name,
			talentInfo?.Shortlisted_InterviewID,
			talentInfo?.TalentID,
			talentInfo?.TalentRole,
		],
	);

	const getClientFeedbackHandler = useCallback(async () => {
		const response = await InterviewDAO.getClientFeedbackRequestDAO({
			clientFeedbackID: talentInfo?.ClientFeedbackID,
		});
		setFeedbackDetails(response?.responseBody?.details);
	}, [talentInfo?.ClientFeedbackID]);

	useEffect(() => {
		isEditFeedback && getClientFeedbackHandler();
	}, [getClientFeedbackHandler, isEditFeedback]);

	useEffect(() => {
		// isEditFeedback && setRadioValue1(feedbackDetails?.hdnRadiovalue);
		isEditFeedback && setRadioValue2(feedbackDetails?.technicalSkillRating);
		isEditFeedback && setRadioValue3(feedbackDetails?.communicationSkillRating);
		isEditFeedback && setRadioValue3(feedbackDetails?.cognitiveSkillRating);
		isEditFeedback &&
			setValue('interviewClientFeedback', feedbackDetails?.messageToTalent);
		isEditFeedback &&
			setValue('interviewClientDecision', feedbackDetails?.clientsDecision);
		isEditFeedback && setValue('interviewComments', feedbackDetails?.comments);
	}, [
		feedbackDetails?.clientsDecision,
		feedbackDetails?.cognitiveSkillRating,
		feedbackDetails?.comments,
		feedbackDetails?.communicationSkillRating,
		feedbackDetails.hdnRadiovalue,
		feedbackDetails.isClientNotificationSent,
		feedbackDetails?.messageToTalent,
		feedbackDetails?.technicalSkillRating,
		isEditFeedback,
		setValue,
	]);

	return isAnotherRound && interviewFeedbackResult ? (
		<AnotherRound
			getScheduleSlotInfomation={getScheduleSlotInfomation}
			talentInfo={talentInfo}
			getScheduleSlotDate={getScheduleSlotDate}
			getSlotInformationHandler={getSlotInformationHandler}
			scheduleSlotRadio={scheduleSlotRadio}
			callAPI={callAPI}
			hrId={hrId}
			closeModal={closeModal}
		/>
	) : (
		<div className={InterviewScheduleStyle.interviewContainer}>
			{contextHolder}
			<div className={InterviewScheduleStyle.leftPane}>
				<h3>Share Your Feedback</h3>
			</div>
			<div className={InterviewScheduleStyle.panelBody}>
				<div className={InterviewScheduleStyle.rightPane}>
					<div className={InterviewScheduleStyle.row}>
						<div className={InterviewScheduleStyle.colMd4}>
							<div className={InterviewScheduleStyle.transparentTopCard}>
								<div className={InterviewScheduleStyle.cardLabel}>
									Talent Name
								</div>

								<div className={InterviewScheduleStyle.cardTitle}>
									{talentName}
								</div>
							</div>
						</div>

						<div className={InterviewScheduleStyle.colMd4}>
							<div className={InterviewScheduleStyle.transparentTopCard}>
								<div className={InterviewScheduleStyle.cardLabel}>
									Hiring Request No
								</div>
								<div className={InterviewScheduleStyle.cardTitle}>
									{hiringRequestNumber}
								</div>
							</div>
						</div>

						<div className={InterviewScheduleStyle.colMd4}>
							<div className={InterviewScheduleStyle.transparentTopCard}>
								<div className={InterviewScheduleStyle.cardLabel}>
									Interview Status
								</div>
								<div className={InterviewScheduleStyle.cardTitle}>
									{interviewUtils.GETINTERVIEWSTATUS(
										talentInfo?.InterviewStatus,
										talentInfo?.InterViewStatusId,
									)}
								</div>
							</div>
						</div>

						<div className={InterviewScheduleStyle.colMd4}>
							<div className={InterviewScheduleStyle.transparentTopCard}>
								<div className={InterviewScheduleStyle.cardLabel}>
									Interview Round
								</div>
								<div className={InterviewScheduleStyle.cardTitle}>
									{talentInfo?.InterviewROUND || 'NA'}
								</div>
							</div>
						</div>
					</div>
					<Divider
						style={{ margin: '40px 0' }}
						dashed
					/>
					{isLoading ? (
						<SpinLoader />
					) : (
						<form id="interviewReschedule">
							<div className={InterviewScheduleStyle.row}>
								<div className={InterviewScheduleStyle.colMd12}>
									<div
										className={InterviewScheduleStyle.radioFormGroup}
										style={{
											display: 'flex',
											flexDirection: 'column',
										}}>
										<label>
											Would you like to proceed with the next steps of hiring
											this talent?
											<span className={InterviewScheduleStyle.reqField}>*</span>
										</label>

										<Radio.Group
											className={InterviewScheduleStyle.radioGroup}
											onChange={onChange}
											value={radioValue1}>
											<Radio value={'Hire'}>
												Definitely, I would like to proceed for hiring this
												talent.
											</Radio>
											<Radio value={'NoHire'}>
												No, I would not like to move ahead with the hiring of
												this talent.
											</Radio>
											{!isEditFeedback && (
												<Radio value={'OnHold'}>
													I liked the talent but feeling confused about the
													hiring decision. Can I keep this talent on hold for
													now?
												</Radio>
											)}
											<Radio value={'AnotherRound'}>
												Certainly, but would love to have another round of
												interview
											</Radio>
										</Radio.Group>
									</div>
								</div>
							</div>
							<div className={InterviewScheduleStyle.row}>
								<div className={InterviewScheduleStyle.colMd12}>
									<div
										className={InterviewScheduleStyle.radioFormGroup}
										style={{
											display: 'flex',
											flexDirection: 'column',
										}}>
										<label>
											How would you rate this talent in terms of technical
											skills required for DevOps Engineer?
											<span className={InterviewScheduleStyle.reqField}>*</span>
										</label>

										<Radio.Group
											className={InterviewScheduleStyle.radioGroup}
											onChange={onChange2}
											value={radioValue2}>
											<Radio value={'EE (Exceeds Expectation)'}>
												EE (Exceeds Expectation)
											</Radio>
											<Radio value={'ME (Meets Expectation)'}>
												ME (Meets Expectation)
											</Radio>
											<Radio value={'IME (Inconsistently Meets Expectations)'}>
												IME (Inconsistently Meets Expectations)
											</Radio>
											<Radio value={'DNME (Does not Meet Expectation)'}>
												DNME (Does not Meet Expectation)
											</Radio>
										</Radio.Group>
									</div>
								</div>
							</div>
							<div className={InterviewScheduleStyle.row}>
								<div className={InterviewScheduleStyle.colMd12}>
									<div
										className={InterviewScheduleStyle.radioFormGroup}
										style={{
											display: 'flex',
											flexDirection: 'column',
										}}>
										<label>
											How would you rate this talent in terms of Communication
											skills required for DevOps Engineer?
											<span className={InterviewScheduleStyle.reqField}>*</span>
										</label>

										<Radio.Group
											className={InterviewScheduleStyle.radioGroup}
											onChange={onChange3}
											value={radioValue3}>
											<Radio value={'EE (Exceeds Expectation)'}>
												EE (Exceeds Expectation)
											</Radio>
											<Radio value={'ME (Meets Expectation)'}>
												ME (Meets Expectation)
											</Radio>
											<Radio value={'IME (Inconsistently Meets Expectations)'}>
												IME (Inconsistently Meets Expectations)
											</Radio>
											<Radio value={'DNME (Does not Meet Expectation)'}>
												DNME (Does not Meet Expectation)
											</Radio>
										</Radio.Group>
									</div>
								</div>
							</div>
							<div className={InterviewScheduleStyle.row}>
								<div className={InterviewScheduleStyle.colMd12}>
									<div
										className={InterviewScheduleStyle.radioFormGroup}
										style={{
											display: 'flex',
											flexDirection: 'column',
										}}>
										<label>
											How would you rate this talent in terms of the Cognitive
											skills required for DevOps Engineer?
											<span className={InterviewScheduleStyle.reqField}>*</span>
										</label>

										<Radio.Group
											className={InterviewScheduleStyle.radioGroup}
											onChange={onChange4}
											value={radioValue4}>
											<Radio value={'EE (Exceeds Expectation)'}>
												EE (Exceeds Expectation)
											</Radio>
											<Radio value={'ME (Meets Expectation)'}>
												ME (Meets Expectation)
											</Radio>
											<Radio value={'IME (Inconsistently Meets Expectations)'}>
												IME (Inconsistently Meets Expectations)
											</Radio>
											<Radio value={'DNME (Does not Meet Expectation)'}>
												DNME (Does not Meet Expectation)
											</Radio>
										</Radio.Group>
									</div>
								</div>
							</div>
							<div className={InterviewScheduleStyle.row}>
								<div className={InterviewScheduleStyle.colMd12}>
									<HRInputField
										register={register}
										label="Any Feedback you want to share straight to the talent?"
										name="interviewClientFeedback"
										type={InputType.TEXT}
										placeholder="Enter message"
									/>
								</div>
							</div>
							<div className={InterviewScheduleStyle.row}>
								<div className={InterviewScheduleStyle.colMd12}>
									<HRInputField
										register={register}
										label="Client's Decision"
										name="interviewClientDecision"
										type={InputType.TEXT}
										placeholder="Enter message"
									/>
								</div>
							</div>
							<div className={InterviewScheduleStyle.row}>
								<div className={InterviewScheduleStyle.colMd12}>
									<HRInputField
										register={register}
										label="Comments"
										name="interviewComments"
										type={InputType.TEXT}
										placeholder="Enter message"
									/>
								</div>
							</div>
							<Checkbox
								onChange={() => setClientNotification(!isClientNotification)}>
								Send To Client
							</Checkbox>
							<Divider
								style={{ margin: '40px 0' }}
								dashed
							/>
							<div className={InterviewScheduleStyle.formPanelAction}>
								<button
									type="submit"
									onClick={handleSubmit(clientFeedbackHandler)}
									className={InterviewScheduleStyle.btnPrimary}>
									Save
								</button>
								<button
									onClick={() => closeModal()}
									className={InterviewScheduleStyle.btn}>
									Cancel
								</button>
							</div>
						</form>
					)}
				</div>
			</div>
		</div>
	);
};

export default InterviewFeedback;
