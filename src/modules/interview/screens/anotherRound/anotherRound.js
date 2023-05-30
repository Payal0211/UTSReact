import { Divider, Radio } from 'antd';
import InterviewScheduleStyle from '../../interviewStyle.module.css';
import { useState } from 'react';

const AnotherRound = () => {
	const [radioValue1, setRadioValue1] = useState(1);
	const [radioValue2, setRadioValue2] = useState(1);
	const onChange1 = (e) => {
		setRadioValue1(e.target.value);
	};
	const onChange2 = (e) => {
		setRadioValue2(e.target.value);
	};
	return (
		<div className={InterviewScheduleStyle.interviewContainer}>
			<div className={InterviewScheduleStyle.leftPane}>
				<h3>Thank You for Submitting your Feedback!</h3>
				<p>
					We appreciate your thought of taking a second round of interview with
					Mohit. 1605 for the Front End job position.
				</p>
				<p>
					We would need a few more details to proceed for scheduling a second
					round of interview with the selected talent. We would really
					appreciate if you could take out sometime to provide us with this
					information.
				</p>
				<Divider />
				<div className={InterviewScheduleStyle.row}>
					<div className={InterviewScheduleStyle.colMd12}>
						<div
							className={InterviewScheduleStyle.radioFormGroup}
							style={{
								display: 'flex',
								flexDirection: 'column',
							}}>
							{/* <label>
								How would you rate this talent in terms of technical skills
								required for DevOps Engineer?
								<span className={InterviewScheduleStyle.reqField}>*</span>
							</label> */}

							<Radio.Group
								className={InterviewScheduleStyle.radioGroup}
								onChange={onChange1}
								value={radioValue1}>
								<Radio value={1}>
									The second round of interviews will have same interviewers
								</Radio>
								<Radio value={2}>
									I want to add more people to the current interview list
								</Radio>
								<Radio value={3}>
									Want to change the interviewers for the second round if
									interview
								</Radio>
							</Radio.Group>
						</div>
					</div>
				</div>
				<Divider />
				<div className={InterviewScheduleStyle.row}>
					<div className={InterviewScheduleStyle.colMd12}>
						<div
							className={InterviewScheduleStyle.radioFormGroup}
							style={{
								display: 'flex',
								flexDirection: 'column',
							}}>
							<Radio.Group
								className={InterviewScheduleStyle.radioGroup}
								onChange={onChange2}
								value={radioValue2}>
								<Radio value={1}>Share Interview Time Slots</Radio>
								<Radio value={2}>I will add Time Slots Later</Radio>
							</Radio.Group>
							{radioValue2 === 1 && <h1>Hello</h1>}
						</div>
					</div>
				</div>

				<div className={InterviewScheduleStyle.formPanelAction}>
					<button
						type="submit"
						// onClick={handleSubmit(clientFeedbackHandler)}
						className={InterviewScheduleStyle.btnPrimary}>
						Save
					</button>
					<button
						// onClick={() => closeModal()}
						className={InterviewScheduleStyle.btn}>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default AnotherRound;
