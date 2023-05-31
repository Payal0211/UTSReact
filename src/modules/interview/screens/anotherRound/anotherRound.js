import { Divider, Radio } from 'antd';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import InterviewScheduleStyle from '../../interviewStyle.module.css';
import { EmailRegEx, InputType } from 'constants/application';
import { useFieldArray, useForm } from 'react-hook-form';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';

import { useCallback, useEffect, useState } from 'react';
import { InterviewDAO } from 'core/interview/interviewDAO';
import { useParams } from 'react-router-dom';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import DatePicker from 'react-datepicker';
import { ReactComponent as ClockIconSVG } from 'assets/svg/clock-icon.svg';
import {
	AnotherRoundInterviewOption,
	AnotherRoundTimeSlotOption,
} from 'constants/application';
import { HTTPStatusCode } from 'constants/network';

export const otherInterviewer = {
	fullName: '',
	emailID: '',
	linkedin: '',
	designation: '',
	typeOfPerson: '',
	experience: '',
};
const AnotherRound = () => {
	const {
		register,
		handleSubmit,
		setValue,
		control,
		clearErrors,
		formState: { errors },
	} = useForm({
		defaultValues: {
			otherInterviewer: [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'otherInterviewer',
	});
	const onAddSecondaryInterviewer = useCallback(
		(e) => {
			e.preventDefault();
			append({ ...otherInterviewer });
		},
		[append],
	);
	const onRemoveSecondaryInterviewer = useCallback(
		(e, index) => {
			e.preventDefault();
			remove(index);
		},
		[remove],
	);
	const [radioValue, setRadioValue] = useState(AnotherRoundInterviewOption.YES);
	const [slotLater, setSlotLater] = useState(AnotherRoundTimeSlotOption.NOW);
	const param = useParams();
	const [clientDetailsForAnotherRound, setClientDetailsForAnotherRound] =
		useState(null);
	const onChangeRadioBtn = (e) => {
		setRadioValue(e.target.value);
		remove();
		clearErrors();
	};
	const slotLaterOnChange = (e) => {
		setSlotLater(e.target.value);
		// remove();
		// clearErrors();
	};

	const anotherRoundHandler = useCallback(async (d) => {
		console.log(d, '---d');
	}, []);
	const clientCurrentDetailsForAnotherRoundHandler = useCallback(async () => {
		let response =
			await InterviewDAO.ClientCurrentDetailsForAnotherRoundRequestDAO({
				hiringRequestID: parseInt(param?.hrid),
			});

		if (response?.statusCode === HTTPStatusCode.OK)
			setClientDetailsForAnotherRound(response?.responseBody?.details);
	}, [param?.hrid]);

	console.log(clientDetailsForAnotherRound, '-clientDetailsForAnotherRound');
	useEffect(() => {
		clientCurrentDetailsForAnotherRoundHandler();
	}, [clientCurrentDetailsForAnotherRoundHandler]);

	return (
		<div className={InterviewScheduleStyle.interviewContainer}>
			<div className={InterviewScheduleStyle.leftPane}>
				<div className={InterviewScheduleStyle.feedbackHeadWrap}>
					<h3>Thank You for Submitting your Feedback!</h3>
					<p>
						We appreciate your thought of taking a second round of interview
						with Mohit. 1605 for the Front End job position.
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
								<Radio value={AnotherRoundInterviewOption.YES}>
									The second round of interviews will have same interviewers
								</Radio>
							</Radio.Group>
							{radioValue === AnotherRoundInterviewOption.YES && (
								<>
									<div className={InterviewScheduleStyle.radioDetailInfo}>
										<div className={InterviewScheduleStyle.row}>
											<div className={InterviewScheduleStyle.colLg6}>
												<div
													className={InterviewScheduleStyle.secondRoundIntBox}>
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
															<span>Interviewer Designation:</span> General
															Manager
														</li>
														<li>
															<span>Interviewer Email Id:</span>{' '}
															gayathri.srinivas@galepartners.com
														</li>
													</ul>
												</div>
											</div>
											<div className={InterviewScheduleStyle.colLg6}>
												<div
													className={InterviewScheduleStyle.secondRoundIntBox}>
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
															<span>Interviewer Designation:</span> General
															Manager
														</li>
														<li>
															<span>Interviewer Email Id:</span>{' '}
															gayathri.srinivas@galepartners.com
														</li>
													</ul>
												</div>
											</div>
										</div>
									</div>
								</>
							)}

							<div className={InterviewScheduleStyle.feedbackModalBody}>
								<div className={InterviewScheduleStyle.topFeedbackRadio}>

									<div className={InterviewScheduleStyle.radioFormGroup}>
										<Radio.Group
											className={InterviewScheduleStyle.radioGroup}
											onChange={onChangeRadioBtn}
											value={radioValue}>
											<Radio value={AnotherRoundInterviewOption.APPEND}>
												I want to add more people to the current interview list
											</Radio>
										</Radio.Group>

										{radioValue === AnotherRoundInterviewOption.APPEND && (
											<>
												<div className={InterviewScheduleStyle.radioDetailInfo}>
													<div className={InterviewScheduleStyle.row}>
														<div className={InterviewScheduleStyle.colLg6}>
															<div
																className={InterviewScheduleStyle.secondRoundIntBox}>
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
																		<span>Interviewer Designation:</span> General
																		Manager
																	</li>
																	<li>
																		<span>Interviewer Email Id:</span>{' '}
																		gayathri.srinivas@galepartners.com
																	</li>
																</ul >
															</div >
														</div >
														<div className={InterviewScheduleStyle.colLg6}>
															<div
																className={InterviewScheduleStyle.secondRoundIntBox}>
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
																		<span>Interviewer Designation:</span> General
																		Manager
																	</li>
																	<li>
																		<span>Interviewer Email Id:</span>{' '}
																		gayathri.srinivas@galepartners.com
																	</li>
																</ul >
															</div >
														</div >
													</div >

													<div className={InterviewScheduleStyle.secondRoundIntForm}>
														<div className={InterviewScheduleStyle.row}>
															<div className={InterviewScheduleStyle.colMd6}>
																<HRInputField
																	label="Interviewer Full Name"
																	name="interviewerFullName"
																	type={InputType.TEXT}
																	register={register}
																	placeholder="Enter full name"
																	errors={errors}
																	validationSchema={{
																		required:
																			'please enter the interviewer full name.',
																	}}
																	required
																/>
															</div>
															<div className={InterviewScheduleStyle.colMd6}>
																<HRInputField
																	label="Interviewer Email"
																	name={`interviewerEmail`}
																	type={InputType.TEXT}
																	register={register}
																	placeholder="Enter emailID"
																	errors={errors}
																	validationSchema={{
																		required:
																			'please enter the primary interviewer email ID.',
																		pattern: {
																			value: EmailRegEx.email,
																			message:
																				'Entered value does not match email format',
																		},
																	}}
																	required
																/>
															</div>
															<div className={InterviewScheduleStyle.colMd6}>
																<HRInputField
																	label="Interviewer Linkedin"
																	name="interviewerLinkedin"
																	type={InputType.TEXT}
																	register={register}
																	placeholder="Enter linkedin URL"
																	errors={errors}
																	validationSchema={{
																		required:
																			'please enter the interviewer linkedin.',
																	}}
																	required
																/>
															</div>
															<div className={InterviewScheduleStyle.colMd6}>
																<HRInputField
																	label="Interviewer Years of Experience"
																	name="interviewerYearsOfExperience"
																	type={InputType.NUMBER}
																	register={register}
																	placeholder="Enter experience"
																	errors={errors}
																	validationSchema={{
																		required:
																			'please enter the interviewer experience.',
																	}}
																	required
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
																	options={
																		clientDetailsForAnotherRound?.TypeOfInterview
																	}
																	required
																// isError={errors['talentStatus'] && errors['talentStatus']}
																// errorMsg="Please select talent Status."
																/>
															</div>
															<div className={InterviewScheduleStyle.colMd6}>
																<HRInputField
																	label="Interviewer Designation"
																	name="interviewerDesignation"
																	type={InputType.TEXT}
																	register={register}
																	errors={errors}
																	validationSchema={{
																		required:
																			'please enter the interviewer designation.',
																	}}
																	required
																	placeholder="Enter designation"
																/>
															</div>
														</div>
													</div>
													{fields?.map((_, index) => {
														return (
															<div
																className={InterviewScheduleStyle.secondRoundIntForm}>
																<div className={InterviewScheduleStyle.row}>
																	<div className={InterviewScheduleStyle.colMd6}>
																		<HRInputField
																			label="Interviewer Full Name"
																			// name="interviewerFullName"
																			name={`otherInterviewer.[${index}].fullName`}
																			type={InputType.TEXT}
																			register={register}
																			placeholder="Enter full name"
																			isError={
																				!!errors?.otherInterviewer?.[index]?.fullName
																			}
																			errorMsg="please enter the interviewer full name."
																			validationSchema={{
																				required:
																					'please enter the interviewer full name.',
																			}}
																			required
																		/>
																	</div>
																	<div className={InterviewScheduleStyle.colMd6}>
																		<HRInputField
																			label="Interviewer Email"
																			name={`otherInterviewer.[${index}].email`}
																			type={InputType.TEXT}
																			register={register}
																			placeholder="Enter emailID"
																			isError={
																				!!errors?.otherInterviewer?.[index]?.email
																			}
																			errorMsg="please enter the interviewer email ID."
																			validationSchema={{
																				required:
																					'please enter the primary interviewer email ID.',
																				pattern: {
																					value: EmailRegEx.email,
																					message:
																						'Entered value does not match email format',
																				},
																			}}
																			required
																		/>
																	</div>
																	<div className={InterviewScheduleStyle.colMd6}>
																		<HRInputField
																			label="Interviewer Linkedin"
																			// name="interviewerLinkedin"
																			name={`otherInterviewer.[${index}].linkedin`}
																			type={InputType.TEXT}
																			register={register}
																			placeholder="Enter linkedin"
																			isError={
																				!!errors?.otherInterviewer?.[index]?.linkedin
																			}
																			errorMsg="please enter the interviewer linkedin."
																			validationSchema={{
																				required:
																					'please enter the interviewer linkedin.',
																			}}
																			required
																		/>
																	</div>
																	<div className={InterviewScheduleStyle.colMd6}>
																		<HRInputField
																			label="Interviewer Years of Experience"
																			// name="interviewerYearsOfExperience"
																			name={`otherInterviewer.[${index}].experience`}
																			type={InputType.TEXT}
																			register={register}
																			placeholder="Enter experience"
																			isError={
																				!!errors?.otherInterviewer?.[index]
																					?.experience
																			}
																			errorMsg="please enter the interviewer experience."
																			validationSchema={{
																				required:
																					'please enter the interviewer experience.',
																			}}
																			required
																		/>
																	</div>
																	<div className={InterviewScheduleStyle.colMd6}>
																		<HRSelectField
																			mode={'id/value'}
																			setValue={setValue}
																			register={register}
																			// name="typeOfPerson"
																			name={`otherInterviewer.[${index}].typeOfPerson`}
																			label="Type of Person"
																			defaultValue="Please Select"
																			options={
																				clientDetailsForAnotherRound?.TypeOfInterview
																			}
																			required
																		// isError={errors['talentStatus'] && errors['talentStatus']}
																		// errorMsg="Please select talent Status."
																		/>
																	</div>
																	<div className={InterviewScheduleStyle.colMd6}>
																		<HRInputField
																			label="Interviewer Designation"
																			// name="interviewerDesignation"
																			name={`otherInterviewer.[${index}].designation`}
																			type={InputType.TEXT}
																			register={register}
																			placeholder="Enter designation"
																			isError={
																				!!errors?.otherInterviewer?.[index]
																					?.designation
																			}
																			errorMsg="please enter the interviewer designation."
																			validationSchema={{
																				required:
																					'please enter the interviewer designation.',
																			}}
																			required
																		/>
																	</div>
																</div>
															</div>
														);
													})}
													<div className={InterviewScheduleStyle.row}>
														<div className={InterviewScheduleStyle.colMd6}>
															<div
																style={{
																	display: 'flex',
																	gap: '10px',
																	alignItems: 'center',
																}}>
																{fields?.length < 2 && (
																	<div
																		className={
																			InterviewScheduleStyle.secondRoundIntFormAction
																		}>
																		<button
																			onClick={onAddSecondaryInterviewer}
																			type="submit"
																			className={InterviewScheduleStyle.btnPrimary}>
																			Add More
																		</button>
																	</div>
																)}
																{fields?.length > 0 && (
																	<div
																		className={
																			InterviewScheduleStyle.secondRoundIntFormAction
																		}>
																		<button
																			onClick={(e) =>
																				onRemoveSecondaryInterviewer(
																					e,
																					fields.length - 1,
																				)
																			}
																			type="submit"
																			className={InterviewScheduleStyle.btnPrimary}>
																			Remove
																		</button>
																	</div>
																)}
															</div>
														</div>
													</div>
												</div>
											</>
										)}

										<Radio.Group
											className={InterviewScheduleStyle.radioGroup}
											onChange={onChangeRadioBtn}
											value={radioValue}>
											<Radio value={AnotherRoundInterviewOption.ADD}>
												Want to change the interviewers for the second round if
												interview
											</Radio>
										</Radio.Group>

										{radioValue === AnotherRoundInterviewOption.ADD && (
											<>
												<div className={InterviewScheduleStyle.secondRoundIntForm}>
													<div className={InterviewScheduleStyle.row}>
														<div className={InterviewScheduleStyle.colMd6}>
															<HRInputField
																label="Interviewer Full Name"
																name="interviewerFullName"
																type={InputType.TEXT}
																register={register}
																placeholder="Enter full name"
																errors={errors}
																validationSchema={{
																	required: 'please enter the interviewer full name.',
																}}
																required
															/>
														</div>
														<div className={InterviewScheduleStyle.colMd6}>
															<HRInputField
																label="Interviewer Email"
																name={`interviewerEmail`}
																type={InputType.TEXT}
																register={register}
																placeholder="Enter emailID"
																errors={errors}
																validationSchema={{
																	required:
																		'please enter the primary interviewer email ID.',
																	pattern: {
																		value: EmailRegEx.email,
																		message:
																			'Entered value does not match email format',
																	},
																}}
																required
															/>
														</div>
														<div className={InterviewScheduleStyle.colMd6}>
															<HRInputField
																label="Interviewer Linkedin"
																name="interviewerLinkedin"
																type={InputType.TEXT}
																register={register}
																placeholder="Enter linkedin URL"
																errors={errors}
																validationSchema={{
																	required: 'please enter the interviewer linkedin.',
																}}
																required
															/>
														</div>
														<div className={InterviewScheduleStyle.colMd6}>
															<HRInputField
																label="Interviewer Years of Experience"
																name="interviewerYearsOfExperience"
																type={InputType.NUMBER}
																register={register}
																placeholder="Enter experience"
																errors={errors}
																validationSchema={{
																	required:
																		'please enter the interviewer experience.',
																}}
																required
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
																options={
																	clientDetailsForAnotherRound?.TypeOfInterview
																}
																required
															// isError={errors['talentStatus'] && errors['talentStatus']}
															// errorMsg="Please select talent Status."
															/>
														</div>
														<div className={InterviewScheduleStyle.colMd6}>
															<HRInputField
																label="Interviewer Designation"
																name="interviewerDesignation"
																type={InputType.TEXT}
																register={register}
																errors={errors}
																validationSchema={{
																	required:
																		'please enter the interviewer designation.',
																}}
																required
																placeholder="Enter designation"
															/>
														</div>
													</div>
												</div>
												{fields?.map((_, index) => {
													return (
														<div
															className={InterviewScheduleStyle.secondRoundIntForm}>
															<div className={InterviewScheduleStyle.row}>
																<div className={InterviewScheduleStyle.colMd6}>
																	<HRInputField
																		label="Interviewer Full Name"
																		// name="interviewerFullName"
																		name={`otherInterviewer.[${index}].fullName`}
																		type={InputType.TEXT}
																		register={register}
																		placeholder="Enter full name"
																		isError={
																			!!errors?.otherInterviewer?.[index]?.fullName
																		}
																		errorMsg="please enter the interviewer full name."
																		validationSchema={{
																			required:
																				'please enter the interviewer full name.',
																		}}
																		required
																	/>
																</div>
																<div className={InterviewScheduleStyle.colMd6}>
																	<HRInputField
																		label="Interviewer Email"
																		name={`otherInterviewer.[${index}].email`}
																		type={InputType.TEXT}
																		register={register}
																		placeholder="Enter emailID"
																		isError={
																			!!errors?.otherInterviewer?.[index]?.email
																		}
																		errorMsg="please enter the interviewer email ID."
																		validationSchema={{
																			required:
																				'please enter the primary interviewer email ID.',
																			pattern: {
																				value: EmailRegEx.email,
																				message:
																					'Entered value does not match email format',
																			},
																		}}
																		required
																	/>
																</div>
																<div className={InterviewScheduleStyle.colMd6}>
																	<HRInputField
																		label="Interviewer Linkedin"
																		// name="interviewerLinkedin"
																		name={`otherInterviewer.[${index}].linkedin`}
																		type={InputType.TEXT}
																		register={register}
																		placeholder="Enter linkedin"
																		isError={
																			!!errors?.otherInterviewer?.[index]?.linkedin
																		}
																		errorMsg="please enter the interviewer linkedin."
																		validationSchema={{
																			required:
																				'please enter the interviewer linkedin.',
																		}}
																		required
																	/>
																</div>
																<div className={InterviewScheduleStyle.colMd6}>
																	<HRInputField
																		label="Interviewer Years of Experience"
																		// name="interviewerYearsOfExperience"
																		name={`otherInterviewer.[${index}].experience`}
																		type={InputType.TEXT}
																		register={register}
																		placeholder="Enter experience"
																		isError={
																			!!errors?.otherInterviewer?.[index]?.experience
																		}
																		errorMsg="please enter the interviewer experience."
																		validationSchema={{
																			required:
																				'please enter the interviewer experience.',
																		}}
																		required
																	/>
																</div>
																<div className={InterviewScheduleStyle.colMd6}>
																	<HRSelectField
																		mode={'id/value'}
																		setValue={setValue}
																		register={register}
																		// name="typeOfPerson"
																		name={`otherInterviewer.[${index}].typeOfPerson`}
																		label="Type of Person"
																		defaultValue="Please Select"
																		options={
																			clientDetailsForAnotherRound?.TypeOfInterview
																		}
																		required
																	// isError={errors['talentStatus'] && errors['talentStatus']}
																	// errorMsg="Please select talent Status."
																	/>
																</div>
																<div className={InterviewScheduleStyle.colMd6}>
																	<HRInputField
																		label="Interviewer Designation"
																		// name="interviewerDesignation"
																		name={`otherInterviewer.[${index}].designation`}
																		type={InputType.TEXT}
																		register={register}
																		placeholder="Enter designation"
																		isError={
																			!!errors?.otherInterviewer?.[index]?.designation
																		}
																		errorMsg="please enter the interviewer designation."
																		validationSchema={{
																			required:
																				'please enter the interviewer designation.',
																		}}
																		required
																	/>
																</div>
															</div>
														</div>
													);
												})}
												<div className={InterviewScheduleStyle.row}>
													<div className={InterviewScheduleStyle.colMd6}>
														<div
															style={{
																display: 'flex',
																gap: '10px',
																alignItems: 'center',
															}}>
															{fields?.length < 2 && (
																<div
																	className={
																		InterviewScheduleStyle.secondRoundIntFormAction
																	}>
																	<button
																		onClick={onAddSecondaryInterviewer}
																		type="submit"
																		className={InterviewScheduleStyle.btnPrimary}>
																		Add More
																	</button>
																</div>
															)}
															{fields?.length > 0 && (
																<div
																	className={
																		InterviewScheduleStyle.secondRoundIntFormAction
																	}>
																	<button
																		onClick={(e) =>
																			onRemoveSecondaryInterviewer(
																				e,
																				fields.length - 1,
																			)
																		}
																		type="submit"
																		className={InterviewScheduleStyle.btnPrimary}>
																		Remove
																	</button>
																</div>
															)}
														</div>
													</div>
												</div>
											</>
										)}
									</div >

								</div >

								{/* <div className={InterviewScheduleStyle.radioFormGroup}>
						<Radio.Group
							className={InterviewScheduleStyle.radioGroup}
							onChange={slotLaterOnChange}
							value={slotLater}>
							<Radio value={1}>Share Interview Time Slots</Radio>
							<Radio value={2}>I will add Time Slots Later</Radio>
						</Radio.Group>
					</div> */}

								<div className={InterviewScheduleStyle.bottomFeedbackRadio}>
									<div className={InterviewScheduleStyle.radioFormGroup}>
										<Radio.Group
											className={InterviewScheduleStyle.radioGroup}
											onChange={slotLaterOnChange}
											value={slotLater}>
											<Radio value={1}>Share Interview Time Slots</Radio>
										</Radio.Group>

										{slotLater === 1 && (
											<>
												<div className={InterviewScheduleStyle.radioDetailInfo}>
													<div className={InterviewScheduleStyle.row}>
														<div className={InterviewScheduleStyle.colMd12}>
															<HRSelectField
																setValue={setValue}
																register={register}
																name="interviewTimezone"
																label="Time Zone"
																defaultValue="Select Timezone"
																options={clientDetailsForAnotherRound?.TimeZoneData}
																required
															/>
														</div>
													</div>

													<div className={InterviewScheduleStyle.timeSlotRow}>
														<div className={InterviewScheduleStyle.timeSlotLabel}>
															<label>Slot 1*</label>
														</div >
														<div className={InterviewScheduleStyle.timeSlotItem}>
															<CalenderSVG />

															<DatePicker
																name="slot1Date"
																required
																{...register('slot1Date')}
																// filterDate={disabledWeekend}
																// selected={getScheduleSlotDate[0].slot1}
																placeholderText="Select Date"
																onChange={(date) => {
																	setValue('slot1Date', date);
																	// getSlotInformationHandler(date, 'slot1Date', 'schedule');
																}}
															/>
															{errors.slot1Date && (
																<div className={InterviewScheduleStyle.error}>
																	Please select slot1 date
																</div>
															)}
														</div>
														<div
															className={`${InterviewScheduleStyle.timeSlotItem} ${InterviewScheduleStyle.timePickerItem}`}>
															<ClockIconSVG />

															<DatePicker
																required
																{...register('slot1StartTime')}
																// selected={getScheduleSlotDate[0].slot2}
																onChange={(date) => {
																	setValue('slot1StartTime', date);
																	// getSlotInformationHandler(
																	// 	date,
																	// 	'slot1StartTime',
																	// 	'schedule',
																	// );
																}}
																showTimeSelect
																showTimeSelectOnly
																timeIntervals={60}
																timeCaption="Time"
																timeFormat="h:mm a"
																dateFormat="h:mm a"
																placeholderText="Start Time"
																name="slot1StartTime"
															/>
															{errors.slot1StartTime && (
																<div className={InterviewScheduleStyle.error}>
																	Please select start time
																</div>
															)}
														</div>
														<div
															className={`${InterviewScheduleStyle.timeSlotItem} ${InterviewScheduleStyle.timePickerItem}`}>
															<ClockIconSVG />
															<DatePicker
																required
																{...register('slot1EndTime')}
																// selected={getScheduleSlotDate[0].slot3}
																onChange={(date) => {
																	setValue('slot1EndTime', date);
																	// getSlotInformationHandler(date, 'slot1EndTime', 'schedule');
																}}
																showTimeSelect
																showTimeSelectOnly
																timeIntervals={60}
																timeCaption="Time"
																dateFormat="h:mm a"
																timeFormat="h:mm a"
																placeholderText="End Time"
																name="slot1EndTime"
															/>
															{errors.slot1EndTime && (
																<div className={InterviewScheduleStyle.error}>
																	Please select end time
																</div>
															)}
														</div>
													</div >

													<div className={InterviewScheduleStyle.timeSlotRow}>
														<div className={InterviewScheduleStyle.timeSlotLabel}>
															<label>Slot 2*</label>
														</div >
														<div className={InterviewScheduleStyle.timeSlotItem}>
															<CalenderSVG />

															<DatePicker
																name="slot1Date"
																required
																{...register('slot1Date')}
																// filterDate={disabledWeekend}
																// selected={getScheduleSlotDate[0].slot1}
																placeholderText="Select Date"
																onChange={(date) => {
																	setValue('slot1Date', date);
																	// getSlotInformationHandler(date, 'slot1Date', 'schedule');
																}}
															/>
															{errors.slot1Date && (
																<div className={InterviewScheduleStyle.error}>
																	Please select slot1 date
																</div>
															)}
														</div>
														<div
															className={`${InterviewScheduleStyle.timeSlotItem} ${InterviewScheduleStyle.timePickerItem}`}>
															<ClockIconSVG />

															<DatePicker
																required
																{...register('slot1StartTime')}
																// selected={getScheduleSlotDate[0].slot2}
																onChange={(date) => {
																	setValue('slot1StartTime', date);
																	// getSlotInformationHandler(
																	// 	date,
																	// 	'slot1StartTime',
																	// 	'schedule',
																	// );
																}}
																showTimeSelect
																showTimeSelectOnly
																timeIntervals={60}
																timeCaption="Time"
																timeFormat="h:mm a"
																dateFormat="h:mm a"
																placeholderText="Start Time"
																name="slot1StartTime"
															/>
															{errors.slot1StartTime && (
																<div className={InterviewScheduleStyle.error}>
																	Please select start time
																</div>
															)}
														</div>
														<div
															className={`${InterviewScheduleStyle.timeSlotItem} ${InterviewScheduleStyle.timePickerItem}`}>
															<ClockIconSVG />
															<DatePicker
																required
																{...register('slot1EndTime')}
																// selected={getScheduleSlotDate[0].slot3}
																onChange={(date) => {
																	setValue('slot1EndTime', date);
																	// getSlotInformationHandler(date, 'slot1EndTime', 'schedule');
																}}
																showTimeSelect
																showTimeSelectOnly
																timeIntervals={60}
																timeCaption="Time"
																dateFormat="h:mm a"
																timeFormat="h:mm a"
																placeholderText="End Time"
																name="slot1EndTime"
															/>
															{errors.slot1EndTime && (
																<div className={InterviewScheduleStyle.error}>
																	Please select end time
																</div>
															)}
														</div>
													</div >

													<div className={InterviewScheduleStyle.timeSlotRow}>
														<div className={InterviewScheduleStyle.timeSlotLabel}>
															<label>Slot 3*</label>
														</div >
														<div className={InterviewScheduleStyle.timeSlotItem}>
															<CalenderSVG />

															<DatePicker
																name="slot1Date"
																required
																{...register('slot1Date')}
																// filterDate={disabledWeekend}
																// selected={getScheduleSlotDate[0].slot1}
																placeholderText="Select Date"
																onChange={(date) => {
																	setValue('slot1Date', date);
																	// getSlotInformationHandler(date, 'slot1Date', 'schedule');
																}}
															/>
															{errors.slot1Date && (
																<div className={InterviewScheduleStyle.error}>
																	Please select slot1 date
																</div>
															)}
														</div>
														<div
															className={`${InterviewScheduleStyle.timeSlotItem} ${InterviewScheduleStyle.timePickerItem}`}>
															<ClockIconSVG />

															<DatePicker
																required
																{...register('slot1StartTime')}
																// selected={getScheduleSlotDate[0].slot2}
																onChange={(date) => {
																	setValue('slot1StartTime', date);
																	// getSlotInformationHandler(
																	// 	date,
																	// 	'slot1StartTime',
																	// 	'schedule',
																	// );
																}}
																showTimeSelect
																showTimeSelectOnly
																timeIntervals={60}
																timeCaption="Time"
																timeFormat="h:mm a"
																dateFormat="h:mm a"
																placeholderText="Start Time"
																name="slot1StartTime"
															/>
															{errors.slot1StartTime && (
																<div className={InterviewScheduleStyle.error}>
																	Please select start time
																</div>
															)}
														</div>
														<div
															className={`${InterviewScheduleStyle.timeSlotItem} ${InterviewScheduleStyle.timePickerItem}`}>
															<ClockIconSVG />
															<DatePicker
																required
																{...register('slot1EndTime')}
																// selected={getScheduleSlotDate[0].slot3}
																onChange={(date) => {
																	setValue('slot1EndTime', date);
																	// getSlotInformationHandler(date, 'slot1EndTime', 'schedule');
																}}
																showTimeSelect
																showTimeSelectOnly
																timeIntervals={60}
																timeCaption="Time"
																dateFormat="h:mm a"
																timeFormat="h:mm a"
																placeholderText="End Time"
																name="slot1EndTime"
															/>
															{errors.slot1EndTime && (
																<div className={InterviewScheduleStyle.error}>
																	Please select end time
																</div>
															)}
														</div>
													</div >
												</div >
											</>
										)}

										<Radio.Group
											className={InterviewScheduleStyle.radioGroup}
											onChange={slotLaterOnChange}
											value={slotLater}>
											<Radio value={2}>I will add Time Slots Later</Radio>
										</Radio.Group>
									</div >
								</div >
							</div >

							<div className={InterviewScheduleStyle.formPanelAction}>
								<button
									type="submit"
									onClick={handleSubmit(anotherRoundHandler)}
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
				</div>
			</div>
		</div>
	);
};
export default AnotherRound;
