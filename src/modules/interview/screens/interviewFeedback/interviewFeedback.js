import React, { useCallback, useEffect, useState } from 'react';
import InterviewScheduleStyle from '../../interviewStyle.module.css';
import { Link } from 'react-router-dom';
import UTSRoutes from 'constants/routes';
import { ReactComponent as ArrowLeftSVG } from 'assets/svg/arrowLeft.svg';
import { interviewUtils } from 'modules/interview/interviewUtils';
import { InputType, InterviewStatus } from 'constants/application';
import { Checkbox, Divider, Radio } from 'antd';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import { useForm } from 'react-hook-form';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import { MasterDAO } from 'core/master/masterDAO';

const InterviewFeedback = () => {
	const [timezone, setTimezone] = useState([]);
	const {
		register,
		handleSubmit,
		setValue,
		control,
		setError,
		getValues,
		watch,
		formState: { errors },
	} = useForm();
	const [value, setRadioValue] = useState(1);
	const [radioValue2, setRadioValue2] = useState(1);
	const [radioValue3, setRadioValue3] = useState(1);
	const [radioValue4, setRadioValue4] = useState(1);
	const onChange = (e) => {
		console.log('radio checked', e.target.value);
		setRadioValue(e.target.value);
	};

	const onChange2 = (e) => {
		console.log('radio checked', e.target.value);
		setRadioValue2(e.target.value);
	};
	const onChange3 = (e) => {
		console.log('radio checked', e.target.value);
		setRadioValue3(e.target.value);
	};
	const onChange4 = (e) => {
		console.log('radio checked', e.target.value);
		setRadioValue4(e.target.value);
	};
	const getTimeZone = useCallback(async () => {
		let response = await MasterDAO.getTalentTimeZoneRequestDAO();
		setTimezone(response && response?.responseBody);
	}, []);
	useEffect(() => {
		getTimeZone();
	}, [getTimeZone]);
	return (
		<div className={InterviewScheduleStyle.interviewContainer}>
			{/* <Link to={UTSRoutes.INTERVIEWLISTROUTE}>
				<div className={InterviewScheduleStyle.goback}>
					<ArrowLeftSVG style={{ width: '16px' }} />
					<span>Go Back</span>
				</div>
			</Link> */}
			<div className={InterviewScheduleStyle.leftPane}>
				<h3>Share Your Feedback</h3>
			</div>
			<div className={InterviewScheduleStyle.panelBody}>
				{/* <div className={InterviewScheduleStyle.leftPane}>
					<h3>
						Share Your Feedback for <br />
						Manideep Koduri
					</h3>
					<p style={{ maxWidth: '334px' }}>
						Thank you! We really appreciate the time you took to interview
						Manideep Koduri. Hope you enjoyed the interaction with this talent.
						Share your experience during the interview in the below feedback
						form!
					</p>
				</div> */}
				<div className={InterviewScheduleStyle.rightPane}>
					<div className={InterviewScheduleStyle.row}>
						<div
							className={`${InterviewScheduleStyle.transparent} ${InterviewScheduleStyle.colMd4}`}>
							<div className={InterviewScheduleStyle.cardBody}>
								<div
									className={`${InterviewScheduleStyle.cardLabel} ${InterviewScheduleStyle.mb8}`}>
									Talent Name
								</div>

								<div className={InterviewScheduleStyle.cardTitle}>
									Pandey Raghu
								</div>
							</div>
						</div>
						<div
							className={`${InterviewScheduleStyle.transparent} ${InterviewScheduleStyle.colMd4}`}>
							<div className={InterviewScheduleStyle.cardBody}>
								<div
									className={`${InterviewScheduleStyle.cardLabel} ${InterviewScheduleStyle.mb8}`}>
									Hiring Request No
								</div>

								<div className={InterviewScheduleStyle.cardTitle}>
									HR54906458963
								</div>
							</div>
						</div>
						<div
							className={`${InterviewScheduleStyle.transparent} ${InterviewScheduleStyle.colMd4}`}>
							<div className={InterviewScheduleStyle.cardBody}>
								<div
									className={`${InterviewScheduleStyle.cardLabel} ${InterviewScheduleStyle.mb8}`}>
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
											'Scheduled',
											InterviewStatus.INTERVIEW_SCHEDULED,
										)}
									</div>
								</div>
							</div>
						</div>
						<div
							className={`${InterviewScheduleStyle.transparent} ${InterviewScheduleStyle.colMd4}`}>
							<div className={InterviewScheduleStyle.cardBody}>
								<div
									className={`${InterviewScheduleStyle.cardLabel} ${InterviewScheduleStyle.mb8}`}>
									Interview Round
								</div>

								<div className={InterviewScheduleStyle.cardTitle}>Round 1</div>
							</div>
						</div>
					</div>
					<Divider
						style={{ margin: '40px 0' }}
						dashed
					/>
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
										Would you like to proceed with the next steps of hiring this
										talent?
										<span className={InterviewScheduleStyle.reqField}>*</span>
									</label>

									<Radio.Group
										className={InterviewScheduleStyle.radioGroup}
										onChange={onChange}
										value={value}>
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
										onChange={onChange2}
										value={radioValue2}>
										<Radio value={1}>EE (Exceeds Expectation)</Radio>
										<Radio value={2}>ME (Meets Expectation)</Radio>
										<Radio value={3}>
											IME (Inconsistently Meets Expectations)
										</Radio>
										<Radio value={4}>DNME (Does not Meet Expectation)</Radio>
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
										<Radio value={1}>EE (Exceeds Expectation)</Radio>
										<Radio value={2}>ME (Meets Expectation)</Radio>
										<Radio value={3}>
											IME (Inconsistently Meets Expectations)
										</Radio>
										<Radio value={4}>DNME (Does not Meet Expectation)</Radio>
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
										<Radio value={1}>EE (Exceeds Expectation)</Radio>
										<Radio value={2}>ME (Meets Expectation)</Radio>
										<Radio value={3}>
											IME (Inconsistently Meets Expectations)
										</Radio>
										<Radio value={4}>DNME (Does not Meet Expectation)</Radio>
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
						<Checkbox>Send To Client</Checkbox>
					</form>
				</div>
			</div>
			<Divider
				style={{ margin: '40px 0' }}
				dashed
			/>
			<div className={InterviewScheduleStyle.formPanelAction}>
				<button
					// disabled={isLoading}
					type="submit"
					// onClick={handleSubmit(clientSubmitHandler)}
					className={InterviewScheduleStyle.btnPrimary}>
					Save
				</button>
				<button
					/* style={{
								cursor:
									type === SubmitType.SAVE_AS_DRAFT ? 'no-drop' : 'pointer',
							}} */
					// disabled={type === SubmitType.SAVE_AS_DRAFT}
					// onClick={clientSubmitHandler}
					className={InterviewScheduleStyle.btn}>
					Cancel
				</button>
			</div>
		</div>
	);
};

export default InterviewFeedback;
