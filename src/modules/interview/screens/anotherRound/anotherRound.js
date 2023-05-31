import { Divider, Radio } from 'antd';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import InterviewScheduleStyle from '../../interviewStyle.module.css';
import { useState } from 'react';
import { InputType } from 'constants/application';
import { useForm } from 'react-hook-form';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';

const AnotherRound = () => {

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm();

	const [radioValue, setRadioValue] = useState(1);
	const [slotLater, setSlotLater] = useState(1);
	const onChangeRadioBtn = (e) => {
		setRadioValue(e.target.value);
	};
	const slotLaterOnChange = (e) => {
		setSlotLater(e.target.value);
	};

	const options = [{
		id: 1, value: "Option1",
		id: 2, value: "Option2",
		id: 3, value: "Option3",
		id: 4, value: "Option4",
		id: 5, value: "Option5"
	}]

	return (
		<div className={InterviewScheduleStyle.interviewContainer}>
			<div className={InterviewScheduleStyle.leftPane}>
				<div className={InterviewScheduleStyle.feedbackHeadWrap}>
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
				</div>

				<div className={InterviewScheduleStyle.feedbackModalBody}>
					<div className={InterviewScheduleStyle.topFeedbackRadio}>

						<div className={InterviewScheduleStyle.radioFormGroup}>
							<Radio.Group
								className={InterviewScheduleStyle.radioGroup}
								onChange={onChangeRadioBtn}
								value={radioValue}>
								<Radio value={1}>
									The second round of interviews will have same interviewers
								</Radio>
							</Radio.Group>
							{radioValue === 1 &&
								<>
									<div className={InterviewScheduleStyle.radioDetailInfo}>
										<div className={InterviewScheduleStyle.row}>
											<div className={InterviewScheduleStyle.colLg6}>
												<div className={InterviewScheduleStyle.secondRoundIntBox}>
													<ul>
														<li>
															<span>Interviewer Name:</span> Gayathri Srinivas
														</li>
														<li>
															<span>Interviewer Linkedin:</span> galepartners
														</li>
														<li>
															<span>Interviewer Years of Experience:</span> 15
														</li>
														<li>
															<span>Type of Person:</span> Technical
														</li>
														<li>
															<span>Interviewer Designation:</span> General Manager
														</li>
														<li>
															<span>Interviewer Email Id:</span> gayathri.srinivas@galepartners.com
														</li>
													</ul>
												</div>
											</div>
											<div className={InterviewScheduleStyle.colLg6}>
												<div className={InterviewScheduleStyle.secondRoundIntBox}>
													<ul>
														<li>
															<span>Interviewer Name:</span> Gayathri Srinivas
														</li>
														<li>
															<span>Interviewer Linkedin:</span> galepartners
														</li>
														<li>
															<span>Interviewer Years of Experience:</span> 15
														</li>
														<li>
															<span>Type of Person:</span> Technical
														</li>
														<li>
															<span>Interviewer Designation:</span> General Manager
														</li>
														<li>
															<span>Interviewer Email Id:</span> gayathri.srinivas@galepartners.com
														</li>
													</ul>
												</div>
											</div>
										</div>
									</div>
								</>}

							<Radio.Group
								className={InterviewScheduleStyle.radioGroup}
								onChange={onChangeRadioBtn}
								value={radioValue}>
								<Radio value={2}>
									I want to add more people to the current interview list
								</Radio>
							</Radio.Group>


							{radioValue === 2 &&
								<>
									<div className={InterviewScheduleStyle.radioDetailInfo}>
										<div className={InterviewScheduleStyle.row}>
											<div className={InterviewScheduleStyle.colLg6}>
												<div className={InterviewScheduleStyle.secondRoundIntBox}>
													<ul>
														<li>
															<span>Interviewer Name:</span> Gayathri Srinivas
														</li>
														<li>
															<span>Interviewer Linkedin:</span> galepartners
														</li>
														<li>
															<span>Interviewer Years of Experience:</span> 15
														</li>
														<li>
															<span>Type of Person:</span> Technical
														</li>
														<li>
															<span>Interviewer Designation:</span> General Manager
														</li>
														<li>
															<span>Interviewer Email Id:</span> gayathri.srinivas@galepartners.com
														</li>
													</ul>
												</div>
											</div>
											<div className={InterviewScheduleStyle.colLg6}>
												<div className={InterviewScheduleStyle.secondRoundIntBox}>
													<ul>
														<li>
															<span>Interviewer Name:</span> Gayathri Srinivas
														</li>
														<li>
															<span>Interviewer Linkedin:</span> galepartners
														</li>
														<li>
															<span>Interviewer Years of Experience:</span> 15
														</li>
														<li>
															<span>Type of Person:</span> Technical
														</li>
														<li>
															<span>Interviewer Designation:</span> General Manager
														</li>
														<li>
															<span>Interviewer Email Id:</span> gayathri.srinivas@galepartners.com
														</li>
													</ul>
												</div>
											</div>
										</div>

										<div className={InterviewScheduleStyle.secondRoundIntForm}>
											<div className={InterviewScheduleStyle.row}>
												<div className={InterviewScheduleStyle.colMd6}>
													<HRInputField
														label="Interviewer Full Name*"
														name="interviewerFullName"
														type={InputType.TEXT}
														register={register}
														placeholder="Enter message"
													/>
												</div>
												<div className={InterviewScheduleStyle.colMd6}>
													<HRInputField
														label="Interviewer Email*"
														name="interviewerEmail"
														type={InputType.TEXT}
														register={register}
														placeholder="Enter message"
													/>
												</div>
												<div className={InterviewScheduleStyle.colMd6}>
													<HRInputField
														label="Interviewer Linkedin*"
														name="interviewerLinkedin"
														type={InputType.TEXT}
														register={register}
														placeholder="Enter message"
													/>
												</div>
												<div className={InterviewScheduleStyle.colMd6}>
													<HRInputField
														label="Interviewer Years of Experience*"
														name="interviewerYearsOfExperience"
														type={InputType.TEXT}
														register={register}
														placeholder="Enter message"
													/>
												</div>
												<div className={InterviewScheduleStyle.colMd6}>
													{/* <HRInputField
													label="Type of Person*"
													name="typeOfPerson"
													type={InputType.TEXT}
													register={register}
													placeholder="Enter message"
												/> */}
													<HRSelectField
														mode={'id/value'}
														setValue={setValue}
														register={register}
														name="typeOfPerson"
														label="Type of Person"
														defaultValue="Please Select"
														options={options}
														required
													// isError={errors['talentStatus'] && errors['talentStatus']}
													// errorMsg="Please select talent Status."
													/>
												</div>
												<div className={InterviewScheduleStyle.colMd6}>
													<HRInputField
														label="Interviewer Designation*"
														name="interviewerDesignation"
														type={InputType.TEXT}
														register={register}
														placeholder="Enter message"
													/>
												</div>
											</div>
										</div>
										<div className={InterviewScheduleStyle.row}>
											<div className={InterviewScheduleStyle.colMd12}>
												<div className={InterviewScheduleStyle.secondRoundIntFormAction}>
													<button
														type="submit"
														className={InterviewScheduleStyle.btnPrimary}>
														Add More
													</button>
												</div>
											</div>
										</div>
									</div>
								</>}



							<Radio.Group
								className={InterviewScheduleStyle.radioGroup}
								onChange={onChangeRadioBtn}
								value={radioValue}>
								<Radio value={3}>
									Want to change the interviewers for the second round if
									interview
								</Radio>
							</Radio.Group>


							{radioValue === 3 &&
								<>
									<div className={`${InterviewScheduleStyle.radioDetailInfo} ${InterviewScheduleStyle.stepFormWrap}`}>
										<div className={InterviewScheduleStyle.secondRoundIntForm}>
											<div className={InterviewScheduleStyle.row}>
												<div className={InterviewScheduleStyle.colMd6}>
													<HRInputField
														label="Interviewer Full Name*"
														name="interviewerFullName"
														type={InputType.TEXT}
														register={register}
														placeholder="Enter message"
													/>
												</div>
												<div className={InterviewScheduleStyle.colMd6}>
													<HRInputField
														label="Interviewer Email*"
														name="interviewerEmail"
														type={InputType.TEXT}
														register={register}
														placeholder="Enter message"
													/>
												</div>
												<div className={InterviewScheduleStyle.colMd6}>
													<HRInputField
														label="Interviewer Linkedin*"
														name="interviewerLinkedin"
														type={InputType.TEXT}
														register={register}
														placeholder="Enter message"
													/>
												</div>
												<div className={InterviewScheduleStyle.colMd6}>
													<HRInputField
														label="Interviewer Years of Experience*"
														name="interviewerYearsOfExperience"
														type={InputType.TEXT}
														register={register}
														placeholder="Enter message"
													/>
												</div>
												<div className={InterviewScheduleStyle.colMd6}>

													<HRSelectField
														mode={'id/value'}
														setValue={setValue}
														register={register}
														name="typeOfPerson"
														label="Type of Person"
														defaultValue="Please Select"
														options={options}
														required
													// isError={errors['talentStatus'] && errors['talentStatus']}
													// errorMsg="Please select talent Status."
													/>
												</div>
												<div className={InterviewScheduleStyle.colMd6}>
													<HRInputField
														label="Interviewer Designation*"
														name="interviewerDesignation"
														type={InputType.TEXT}
														register={register}
														placeholder="Enter message"
													/>
												</div>
											</div>
										</div>
										<div className={InterviewScheduleStyle.row}>
											<div className={InterviewScheduleStyle.colMd12}>
												<div className={InterviewScheduleStyle.secondRoundIntFormAction}>
													<button
														type="submit"
														className={InterviewScheduleStyle.btnPrimary}>
														Add More
													</button>
												</div>
											</div>
										</div>
									</div>
								</>}

						</div>

					</div>


					<div className={InterviewScheduleStyle.radioFormGroup}>
						<Radio.Group
							className={InterviewScheduleStyle.radioGroup}
							onChange={slotLaterOnChange}
							value={slotLater}>
							<Radio value={1}>Share Interview Time Slots</Radio>
							<Radio value={2}>I will add Time Slots Later</Radio>
						</Radio.Group>
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
