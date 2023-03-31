import React, { useCallback, useEffect, useState } from 'react';
import InterviewScheduleStyle from '../../interviewStyle.module.css';
import { interviewUtils } from 'modules/interview/interviewUtils';
import { InputType, InterviewStatus } from 'constants/application';
import { Checkbox, Divider, Radio } from 'antd';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import { useForm } from 'react-hook-form';
import { MasterDAO } from 'core/master/masterDAO';
import { InterviewDAO } from 'core/interview/interviewDAO';

const InterviewFeedback = ({
	getHiringStep,
	getTechnicalSkill,
	getCommunicationSkill,
	getCognitiveSkill,
	setHiringStep,
	setTechnicalSkill,
	setCommunicationSkill,
	setCognitiveSkill,
	setSendToClient,
	interviewFeedbackSubmitted,
	closeModal,
	sendToclient,
	setValue,
	control,
	setError,
	getValues,
	watch,
	reset,
	resetField,
	register,
	errors,
	handleSubmit,
	interviewFeedbackHandler
}) => {
	const [timezone, setTimezone] = useState([]);

	const getHiringStepHandler = (e) => {
		setHiringStep(e.target.value);
	};

	const getTechnicalSkillHandler = (e) => {
		setTechnicalSkill(e.target.value);
	};

	const getCommunicationSkillHandler = (e) => {
		setCommunicationSkill(e.target.value);
	};

	const getCongitiveSkillHandler = (e) => {
		setCognitiveSkill(e.target.value);
	};

	const getTimeZone = useCallback(async () => {
		let response = await MasterDAO.getTalentTimeZoneRequestDAO();
		setTimezone(response && response?.responseBody);
	}, []);

	useEffect(() => {
		getTimeZone();
	}, [getTimeZone]);

	// const interviewFeedbackHandler = async (data) => {
	// 	const interviewFeedbackData = {
	// 		role: interviewFeedbackSubmitted.TalentRole,
	// 		talentName: interviewFeedbackSubmitted.Name,
	// 		talentFirstName: "",
	// 		descriptionTalent: "",
	// 		rateCommunication: 0,
	// 		communicationDescription: "",
	// 		professionalismDescription: "",
	// 		fitToYourCultureRate: 0,
	// 		fitToYourCulture: "",
	// 		fitToCompanyCultureDescription: "",
	// 		reconsiderHiring: true,
	// 		hdnRadiovalue: "",
	// 		talentIDValue: interviewFeedbackSubmitted.TalentID, // 1
	// 		contactIDValue: interviewFeedbackSubmitted.ContactId,
	// 		hiringRequestID: interviewFeedbackSubmitted.HiringDetailID, // discussion
	// 		hiringRequestDetailID: 0,
	// 		shortlistedInterviewID: 0,
	// 		contactInterviewFeedbackId: 0,
	// 		nohireReconsiderHiringTalentYes: true,
	// 		nohireReconsiderHiringTalentNo: true,
	// 		topSkill: "",
	// 		improvedSkill: "",
	// 		isClientNotificationSent: true,
	// 		technicalSkillRating: getTechnicalSkill,
	// 		communicationSkillRating: getCommunicationSkill,
	// 		cognitiveSkillRating: getCognitiveSkill,
	// 		messageToTalent: data?.interviewClientFeedback,//discussion
	// 		clientsDecision: data?.interviewClientDecision,
	// 		comments: data?.interviewComments,//2
	// 		en_Id: ""
	// 	}
	// 	let response = await InterviewDAO.interviewFeedbackDAO(interviewFeedbackData);
	// 	closeModal()
	// 	resetInterviewFeedback()
	// }

	// const resetInterviewFeedback = () => {
	// 	reset({ interviewClientDecision: "", interviewClientFeedback: '', interviewComments: '' })

	// }

	return (
		<div className={InterviewScheduleStyle.shareFeedbackWrap}>
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
									{interviewFeedbackSubmitted?.Name}
								</div>
							</div>
						</div>

						<div className={InterviewScheduleStyle.colMd4}>
							<div className={InterviewScheduleStyle.transparentTopCard}>
								<div className={InterviewScheduleStyle.cardLabel}>
									Hiring Request No
								</div>

								<div className={InterviewScheduleStyle.cardTitle}>
									{interviewFeedbackSubmitted?.HR_Number}
								</div>
							</div>
						</div>

						<div className={InterviewScheduleStyle.colMd4}>
							<div className={InterviewScheduleStyle.transparentTopCard}>
								<div className={InterviewScheduleStyle.cardLabel}>
									Interview Status
								</div>

								<div className={InterviewScheduleStyle.cardTitle}>
									<div
										style={{
											fontSize: '12px ',
											fontWeight: '500',
											width: '120px ',
										}}>
										{interviewUtils.GETINTERVIEWSTATUS(
											'Feedback Submitted',
											InterviewStatus.FEEDBACK_SUBMITTED,
										)}
									</div>
								</div>
							</div>
						</div>

						<div className={InterviewScheduleStyle.colMd4}>
							<div className={InterviewScheduleStyle.transparentTopCard}>
								<div className={InterviewScheduleStyle.cardLabel}>
									Interview Round
								</div>

								<div className={InterviewScheduleStyle.cardTitle}>{interviewFeedbackSubmitted?.InterviewROUND}</div>
							</div>
						</div>

					</div>
					<Divider
						style={{ margin: '40px 0' }}
						dashed
					/>
					<form id="interviewReschedule" className={InterviewScheduleStyle.interviewFeedbackContainer}>
						<div className={InterviewScheduleStyle.row}>
							<div className={InterviewScheduleStyle.colMd12}>
								<div className={InterviewScheduleStyle.radioFormGroup}>
									<label>
										Would you like to proceed with the next steps of hiring this
										talent?
										<span className={InterviewScheduleStyle.reqField}>*</span>
									</label>

									<Radio.Group
										className={InterviewScheduleStyle.radioGroup}
										onChange={getHiringStepHandler}
										value={getHiringStep}>
										<Radio value={1}>
											Definitely, I would like to proceed for hiring this
											talent.
										</Radio>
										<Radio value={2}>
											No, I would not like to move ahead with the hiring of this
											talent.
										</Radio>
										<Radio value={3}>
											I liked the talent but feeling confused about the hiring
											decision. Can I keep this talent on hold for now?
										</Radio>
										<Radio value={4}>
											Certainly, but would love to have another round of
											interview
										</Radio>
									</Radio.Group>
									<p>Great! We are glad that you got the right match. Congratulations on your new hiring. Please take a moment to share the details of
										this talent through the below feedback form.</p>
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
										How would you rate this talent in terms of technical skills
										required for DevOps Engineer?
										<span className={InterviewScheduleStyle.reqField}>*</span>
									</label>

									<Radio.Group
										className={InterviewScheduleStyle.radioGroup}
										onChange={getTechnicalSkillHandler}
										value={getTechnicalSkill}>
										<Radio value={'EE (Exceeds Expectation)'}>EE (Exceeds Expectation)</Radio>
										<Radio value={'ME (Meets Expectation)'}>ME (Meets Expectation)</Radio>
										<Radio value={'IME (Inconsistently Meets Expectations)'}>
											IME (Inconsistently Meets Expectations)
										</Radio>
										<Radio value={'DNME (Does not Meet Expectation)'}>DNME (Does not Meet Expectation)</Radio>
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
										onChange={getCommunicationSkillHandler}
										value={getCommunicationSkill}>
										<Radio value={'EE (Exceeds Expectation)'}>EE (Exceeds Expectation)</Radio>
										<Radio value={'ME (Meets Expectation)'}>ME (Meets Expectation)</Radio>
										<Radio value={'IME (Inconsistently Meets Expectations)'}>
											IME (Inconsistently Meets Expectations)
										</Radio>
										<Radio value={'DNME (Does not Meet Expectation)'}>DNME (Does not Meet Expectation)</Radio>
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
										onChange={getCongitiveSkillHandler}
										value={getCognitiveSkill}>
										<Radio value={'EE (Exceeds Expectation)'}>EE (Exceeds Expectation)</Radio>
										<Radio value={'ME (Meets Expectation)'}>ME (Meets Expectation)</Radio>
										<Radio value={'IME (Inconsistently Meets Expectations)'}>
											IME (Inconsistently Meets Expectations)
										</Radio>
										<Radio value={'DNME (Does not Meet Expectation)'}>DNME (Does not Meet Expectation)</Radio>
									</Radio.Group>
								</div>
							</div>
						</div>
						<div className={InterviewScheduleStyle.row}>
							<div className={InterviewScheduleStyle.colMd12}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'please enter feedback.',
									}}
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
									errors={errors}
									validationSchema={{
										required: 'please enter client decesion.',
									}}
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
									errors={errors}
									validationSchema={{
										required: 'please enter comments.',
									}}
									label="Comments"
									name="interviewComments"
									type={InputType.TEXT}
									placeholder="Enter message"
								/>
							</div>
						</div>
						<Checkbox checked={sendToclient} onChange={(e) => e.target.checked ? setSendToClient(true) : setSendToClient(false)}>Send To Client</Checkbox>
					</form>
				</div>
			</div>

			<div className={InterviewScheduleStyle.formPanelAction}>
				<button
					type="submit"
					onClick={handleSubmit(interviewFeedbackHandler)}
					className={InterviewScheduleStyle.btnPrimary}>
					Save
				</button>
				<button
					onClick={() => {
						closeModal();
					}}
					className={InterviewScheduleStyle.btn}>
					Cancel
				</button>
			</div>
		</div>
	);
};

export default InterviewFeedback;
