import React, { useCallback, useEffect, useState } from 'react';
import InterviewScheduleStyle from '../../interviewStyle.module.css';
import DatePicker from 'react-datepicker';
import { interviewUtils } from 'modules/interview/interviewUtils';
import { InputType } from 'constants/application';
import { Divider, Radio, message } from 'antd';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import { useForm } from 'react-hook-form';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import { MasterDAO } from 'core/master/masterDAO';
import { InterviewDAO } from 'core/interview/interviewDAO';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import { ReactComponent as ClockIconSVG } from 'assets/svg/clock-icon.svg';
import { HTTPStatusCode } from 'constants/network';
import { addHours, disabledWeekend } from 'shared/utils/basic_utils';
import SpinLoader from 'shared/components/spinLoader/spinLoader';
import moment from 'moment';

const InterviewReschedule = ({
	talentName,
	key,
	closeModal,
	hrId,
	talentInfo,
	hiringRequestNumber,
	callAPI,
	getHrUserData,
	reScheduleTimezone,
	setRescheduleTimezone,
	getRescheduleSlotDate,
	setRescheduleSlotDate,
	reScheduleRadio,
	setRescheduleRadio,
	reScheduleSlotRadio,
	setRescheduleSlotRadio,
	getInterviewStatus,
	isAnotherRound,
}) => {
	const {
		watch,
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm();
	const [messageAPI, contextHolder] = message.useMessage();
	const rescheduleReason = [
		{ id: 1, value: 'Client not available on given Slots' },
		{ id: 2, value: 'Client not available on selected Slot' },
		{ id: 3, value: 'Talent not available on given Slots' },
		{ id: 4, value: 'Talent not available on selected Slot' },
	];

	const [slot1Timematch, setSlot1timematch] = useState(false);
	const [slot2Timematch, setSlot2timematch] = useState(false);
	const [slot3Timematch, setSlot3timematch] = useState(false);
	const [timeErrorMessage,setTimeErrorMessage] = useState('');
	const [interviewTimezone,setInterviewTimezone] = useState('');
	const [interviewRescheduleReason,setInterviewRescheduleReason] = useState('');
	useEffect(() => {
		//Slot 1 data
		setValue('slot1Date', getRescheduleSlotDate[0].slot1)
		setValue('slot1StartTime', getRescheduleSlotDate[0].slot2);
		setValue('slot1EndTime', getRescheduleSlotDate[0].slot3);

		//slot 2 data

		setValue('slot2Date', getRescheduleSlotDate[1].slot1)
		setValue('slot2StartTime', getRescheduleSlotDate[1].slot2);
		setValue('slot2EndTime', getRescheduleSlotDate[1].slot3);

		//slot 3 data	

		setValue('slot3Date', getRescheduleSlotDate[2].slot1)
		setValue('slot3StartTime', getRescheduleSlotDate[2].slot2);
		setValue('slot3EndTime', getRescheduleSlotDate[2].slot3);

    },[getRescheduleSlotDate,setValue])

	const calenderDateHandler = useCallback(
		(date, index, slotField) => {
			const eleToUpdate = { ...getRescheduleSlotDate[index] };
			eleToUpdate[slotField] = date;

			setRescheduleSlotDate([
				...getRescheduleSlotDate.slice(0, index),
				{ ...eleToUpdate },
				...getRescheduleSlotDate.slice(index + 1),
			]);
		},
		[getRescheduleSlotDate, setRescheduleSlotDate],
	);

	const calenderTimeHandler = useCallback(
		(date, index, slotField) => {
			const eleToUpdate = { ...getRescheduleSlotDate[index] };
			eleToUpdate[slotField] = date;

			if (slotField === 'slot2') {
				eleToUpdate['slot3'] = addHours(date, 1);
			}

			setRescheduleSlotDate([
				...getRescheduleSlotDate.slice(0, index),
				{ ...eleToUpdate },
				...getRescheduleSlotDate.slice(index + 1),
			]);
		},
		[getRescheduleSlotDate, setRescheduleSlotDate],
	);

	const [isLoading, setLoading] = useState(false);

	const onRescheduleChange = (e) => {
		setRescheduleRadio(e.target.value);
	};
	const onSlotChange = (e) => {
		setRescheduleSlotRadio(e.target.value);
	};

	const getTimeZone = useCallback(async () => {
		let response = await MasterDAO.getTimeZoneRequestDAO();
		setRescheduleTimezone(response && response?.responseBody);
	}, [setRescheduleTimezone]);

	useEffect(() => {
		getTimeZone();
	}, [getTimeZone]);

	const reScheduleInterviewAPIHandler = useCallback(
		async (data) => {
			setLoading(true);
			
			let timeError = false
			setSlot1timematch(false)
			setSlot2timematch(false)
			setSlot3timematch(false)

			if(moment(data.slot1StartTime).format('HH mm a') === moment(data.slot1EndTime).format('HH mm a')){
					timeError = true;
					setSlot1timematch(true)
				}

			if( reScheduleSlotRadio === 1 &&  moment(data.slot2StartTime).format('HH mm a') === moment(data.slot2EndTime).format('HH mm a')){
					setSlot2timematch(true)
					timeError = true;
				}
				
			if( reScheduleSlotRadio === 1 && moment(data.slot3StartTime).format('HH mm a') === moment(data.slot3EndTime).format('HH mm a')){
					setSlot3timematch(true)
					timeError = true;
				}	

			if(timeError){
				setLoading(false);
					return
				}

			const timeResult = await InterviewDAO.CheckInterviewTimeSlotDAO(reScheduleSlotRadio === 1
				? interviewUtils.formatInterviewDateSlotHandler(
						getRescheduleSlotDate,
				  )
				: interviewUtils
						.formatInterviewDateSlotHandler(getRescheduleSlotDate)
						?.slice(0, 1))	
				
				
			if (timeResult?.statusCode !== HTTPStatusCode.OK) {
					setTimeErrorMessage(timeResult.responseBody)
					setLoading(false);
					return
				} 

			const reScheduleData = {
				rescheduleRequestBy: reScheduleRadio,
				reasonforReschedule: data?.interviewRescheduleReason?.value,
				slotType: reScheduleSlotRadio,
				RescheduleSlot:
					reScheduleSlotRadio === 1
						? interviewUtils.formatInterviewDateSlotHandler(
								getRescheduleSlotDate,
						  )
						: interviewUtils
								.formatInterviewDateSlotHandler(getRescheduleSlotDate)
								?.slice(0, 1),
				hiringRequest_ID: hrId,
				hiringRequest_Detail_ID: talentInfo?.HiringDetailID,
				contactID: talentInfo?.ContactId,
				talent_ID: talentInfo?.TalentID,
				interviewStatus: getInterviewStatus(),
				interviewMasterID: talentInfo?.MasterId,
				hiringRequestNumber: hiringRequestNumber,
				workingTimeZoneID: data?.interviewTimezone,
				nextRound_InterviewDetailsID: 0,
				additional_notes: data?.additionalNotes ? data?.additionalNotes : '',
				interviewCallLink: data?.interviewCallLink
					? data?.interviewCallLink
					: '',
				IsAnotherRoundInterview: isAnotherRound ?  true : false
			};
			let response = await hiringRequestDAO.getReSchduleInterviewInformation(
				reScheduleData,
			);
			if (response?.statusCode === HTTPStatusCode.OK) {
				setLoading(false);
				messageAPI.open(
					{
						type: 'success',
						content: 'Interview rescheduled successfully',
					},
					1000,
				);
				setTimeout(() => {
					callAPI(hrId);
					getHrUserData(hrId);
					closeModal();
				}, 1000);
			}
			else if(response?.statusCode === HTTPStatusCode.BAD_REQUEST){
				setTimeErrorMessage(response.responseBody)
				setLoading(false);
			} else {
				setLoading(false);
				messageAPI.open(
					{
						type: 'error',
						content: 'Something went wrong',
					},
					1000,
				);
			}
		},

		[
			callAPI,
			getHrUserData,
			closeModal,
			getInterviewStatus,
			getRescheduleSlotDate,
			hiringRequestNumber,
			hrId,
			messageAPI,
			reScheduleRadio,
			reScheduleSlotRadio,
			talentInfo?.ContactId,
			talentInfo?.HiringDetailID,
			talentInfo?.MasterId,
			talentInfo?.TalentID,
		],
	);

	useEffect(() => {
		setRescheduleRadio('client');
	}, [setRescheduleRadio]);

	return (
		<div
			className={InterviewScheduleStyle.interviewContainer}
			id={key}>
			<div className={InterviewScheduleStyle.interviewModalTitle}>
				<h2>{isAnotherRound ? "Schedule Interview" : "Reschedule Interview"} </h2>
			</div>
			{contextHolder}
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
						className={InterviewScheduleStyle.topDivider}
						dashed
					/>

					{isLoading ? (
						<SpinLoader />
					) : (
						<form id="interviewReschedule">
							{isAnotherRound ? null : <>
							<div className={InterviewScheduleStyle.row}>
								<div className={InterviewScheduleStyle.colMd12}>
									<div
										className={`${InterviewScheduleStyle.radioFormGroup} ${InterviewScheduleStyle.requestByRadio} `}>
										<label>
											Reschedule Request By
											<span className={InterviewScheduleStyle.reqField}>*</span>
										</label>

										<Radio.Group
											defaultValue={'client'}
											className={InterviewScheduleStyle.radioGroup}
											onChange={onRescheduleChange}
											value={reScheduleRadio}>
											<Radio value={'client'}>Client</Radio>
											<Radio value={'talent'}>Talent</Radio>
										</Radio.Group>
									</div>
								</div>
							</div>
							<div className={InterviewScheduleStyle.row}>
								<div className={InterviewScheduleStyle.colMd12}>
									<HRSelectField
										controlledValue={interviewRescheduleReason}
										setControlledValue={setInterviewRescheduleReason}
										isControlled={true}
										setValue={setValue}
										register={register}
										name="interviewRescheduleReason"
										label="Reason for Reschedule"
										defaultValue="Select reschedule reason"
										options={rescheduleReason}
										mode="id/value"
										required
										isError={
											errors['interviewRescheduleReason'] &&
											errors['interviewRescheduleReason']
										}
										errorMsg="Please select a reason."
									/>
								</div>
							</div>
							<div className={InterviewScheduleStyle.row}>
								<div
									className={`${InterviewScheduleStyle.colMd12} ${InterviewScheduleStyle.mB0}`}>
									<HRInputField
										register={register}
										errors={errors}
										validationSchema={{
											required: 'please enter the message.',
										}}
										label="Message to Appear"
										name="interviewMessage"
										type={InputType.TEXT}
										placeholder="Enter message"
										required
									/>
								</div>
							</div>

							<Divider
								className={InterviewScheduleStyle.topDivider}
								dashed
							/>
							</>}
							

							<div className={InterviewScheduleStyle.row}>
								<div className={InterviewScheduleStyle.colMd12}>
									<div
										className={InterviewScheduleStyle.radioFormGroup}
										style={{
											display: 'flex',
											flexDirection: 'column',
										}}>
										<Radio.Group
											defaultValue={1}
											className={InterviewScheduleStyle.radioGroup}
											onChange={onSlotChange}
											value={reScheduleSlotRadio}>
											<Radio value={1}>
												Slot options provided by the client
											</Radio>
											{talentInfo?.InterviewStatus !== 'Slot Given' && (
												<>
													<Radio value={4}>Send a link shared by client</Radio>
													<Radio value={2}>
														Slot Directly Added for Final Interview Slot
													</Radio>
												</>
											)}
										</Radio.Group>
									</div>
								</div>
							</div>

							<div className={InterviewScheduleStyle.row}>
								<div
									className={
										reScheduleSlotRadio === 4
											? InterviewScheduleStyle.colMd6
											: InterviewScheduleStyle.colMd12
									}>
									<HRSelectField		
										controlledValue={interviewTimezone}
										setControlledValue={setInterviewTimezone}
										isControlled={true}
										setValue={setValue}
										register={register}
										searchable={true}
										name="interviewTimezone"
										label="Time Zone"
										mode="id"
										defaultValue="Select timezone"
										// placeholder="Select timezone"
										options={reScheduleTimezone && reScheduleTimezone}
										required										
										isError={
											errors['interviewTimezone'] && errors['interviewTimezone']
										}
										errorMsg="Please select a timezone."
									/>
								</div>
								{reScheduleSlotRadio === 4 && (
									<div
										className={
											reScheduleSlotRadio === 4
												? InterviewScheduleStyle.colMd6
												: InterviewScheduleStyle.colMd12
										}>
										<HRInputField
											register={register}
											errors={errors}
											validationSchema={{
												required: 'please enter the interview call link.',
											}}
											label="Interview Call Link*"
											name="interviewCallLink"
											type={InputType.TEXT}
											placeholder="Please Add a Meeting Link"
											required
										/>
									</div>
								)}
							</div>

							<div className={InterviewScheduleStyle.timeSlotRow}>
								<div className={InterviewScheduleStyle.timeSlotLabel}>
									<label>
										{reScheduleSlotRadio === 1 ? 'Slot 1' : 'Slot'}{' '}
										<span>*</span>
									</label>
								</div>
								<div className={InterviewScheduleStyle.timeSlotItem}>
									<CalenderSVG />

									<DatePicker
										required
										{...register('slot1Date')}
										// filterDate={disabledWeekend}
										selected={getRescheduleSlotDate[0].slot1}
										placeholderText="Select Date"
										onChange={(date) => {
											setValue('slot1Date', date);
											calenderDateHandler(date, 0, 'slot1');
										}}
										name="slot1Date"
										dateFormat={'dd/MM/yyyy'}
									/>
									{errors.slot1Date && (
										<div className={InterviewScheduleStyle.error}>
											Please select date
										</div>
									)}
								</div>
								<div
									className={`${InterviewScheduleStyle.timeSlotItem} ${InterviewScheduleStyle.timePickerItem}`}>
									<ClockIconSVG />

									<DatePicker
										required
										{...register('slot1StartTime')}
										selected={getRescheduleSlotDate[0].slot2}
										onChange={(date) => {
											setValue('slot1StartTime', date);
											calenderTimeHandler(date, 0, 'slot2');
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
									{slot1Timematch && <div className={InterviewScheduleStyle.error}>
													* Same times are given. Kindly update any one of these times.
													</div>}
								</div>
								<div
									className={`${InterviewScheduleStyle.timeSlotItem} ${InterviewScheduleStyle.timePickerItem}`}>
									<ClockIconSVG />
									<DatePicker
										required
										{...register('slot1EndTime')}
										selected={getRescheduleSlotDate[0].slot3}
										onChange={(date) => {
											setValue('slot1EndTime', date);
											calenderTimeHandler(date, 0, 'slot3');
										}}
										showTimeSelect
										showTimeSelectOnly
										timeIntervals={60}
										timeCaption="Time"
										timeFormat="h:mm a"
										dateFormat="h:mm a"
										placeholderText="End Time"
										name="slot1EndTime"
									/>

									{errors.slot1EndTime && (
										<div className={InterviewScheduleStyle.error}>
											Please select end time
										</div>
									)}
								</div>
							</div>

							{reScheduleSlotRadio === 1 && (
								<>
									<div className={InterviewScheduleStyle.timeSlotRow}>
										<div className={InterviewScheduleStyle.timeSlotLabel}>
											<label>
												Slot 2 <span>*</span>
											</label>
										</div>
										<div className={InterviewScheduleStyle.timeSlotItem}>
											<CalenderSVG />

											<DatePicker
												required
												{...register('slot2Date')}
												// filterDate={disabledWeekend}
												selected={getRescheduleSlotDate[1].slot1}
												placeholderText="Select Date"
												onChange={(date) => {
													setValue('slot2Date', date);
													calenderDateHandler(date, 1, 'slot1');
												}}
												name="slot2Date"
												dateFormat={'dd/MM/yyyy'}
											/>
											{errors.slot2Date && (
												<div className={InterviewScheduleStyle.error}>
													Please select date
												</div>
											)}
										</div>
										<div
											className={`${InterviewScheduleStyle.timeSlotItem} ${InterviewScheduleStyle.timePickerItem}`}>
											<ClockIconSVG />

											<DatePicker
												required
												{...register('slot2StartTime')}
												selected={getRescheduleSlotDate[1].slot2}
												onChange={(date) => {
													setValue('slot2StartTime', date);
													calenderTimeHandler(date, 1, 'slot2');
												}}
												showTimeSelect
												showTimeSelectOnly
												timeIntervals={60}
												timeCaption="Time"
												timeFormat="h:mm a"
												dateFormat="h:mm a"
												placeholderText="Start Time"
												name="slot2StartTime"
											/>
											{errors.slot2StartTime && (
												<div className={InterviewScheduleStyle.error}>
													Please select start time
												</div>
											)}
											{slot2Timematch && <div className={InterviewScheduleStyle.error}>
													* Same times are given. Kindly update any one of these times.
													</div>}
										</div>
										<div
											className={`${InterviewScheduleStyle.timeSlotItem} ${InterviewScheduleStyle.timePickerItem}`}>
											<ClockIconSVG />

											<DatePicker
												required
												{...register('slot2EndTime')}
												selected={getRescheduleSlotDate[1].slot3}
												onChange={(date) => {
													setValue('slot2EndTime', date);
													calenderTimeHandler(date, 1, 'slot3');
												}}
												showTimeSelect
												showTimeSelectOnly
												timeIntervals={60}
												timeCaption="Time"
												timeFormat="h:mm a"
												dateFormat="h:mm a"
												placeholderText="End Time"
												name="slot2EndTime"
											/>
											{errors.slot2EndTime && (
												<div className={InterviewScheduleStyle.error}>
													Please select end time
												</div>
											)}
										</div>
									</div>

									<div className={InterviewScheduleStyle.timeSlotRow}>
										<div className={InterviewScheduleStyle.timeSlotLabel}>
											<label>
												Slot 3 <span>*</span>
											</label>
										</div>
										<div className={InterviewScheduleStyle.timeSlotItem}>
											<CalenderSVG />

											<DatePicker
												required
												{...register('slot3Date')}
												// filterDate={disabledWeekend}
												selected={getRescheduleSlotDate[2].slot1}
												placeholderText="Select Date"
												onChange={(date) => {
													setValue('slot3Date', date);
													calenderDateHandler(date, 2, 'slot1');
												}}
												name="slot3Date"
												dateFormat={'dd/MM/yyyy'}
											/>
											{errors.slot3Date && (
												<div className={InterviewScheduleStyle.error}>
													Please select date
												</div>
											)}
										</div>
										<div
											className={`${InterviewScheduleStyle.timeSlotItem} ${InterviewScheduleStyle.timePickerItem}`}>
											<DatePicker
												required
												{...register('slot3StartTime')}
												selected={getRescheduleSlotDate[2].slot2}
												onChange={(date) => {
													setValue('slot3StartTime', date);
													calenderTimeHandler(date, 2, 'slot2');
												}}
												showTimeSelect
												showTimeSelectOnly
												timeIntervals={60}
												timeCaption="Time"
												timeFormat="h:mm a"
												dateFormat="h:mm a"
												placeholderText="Start Time"
												name="slot3StartTime"
											/>
											{errors.slot3StartTime && (
												<div className={InterviewScheduleStyle.error}>
													Please select start time
												</div>
											)}
											{slot3Timematch && <div className={InterviewScheduleStyle.error}>
													* Same times are given. Kindly update any one of these times.
													</div>}
											<ClockIconSVG />
										</div>
										<div
											className={`${InterviewScheduleStyle.timeSlotItem} ${InterviewScheduleStyle.timePickerItem}`}>
											<ClockIconSVG />

											<DatePicker
												required
												{...register('slot3StartTime')}
												selected={getRescheduleSlotDate[2].slot3}
												onChange={(date) => {
													setValue('slot3EndTime', date);
													calenderTimeHandler(date, 2, 'slot3');
												}}
												showTimeSelect
												showTimeSelectOnly
												timeIntervals={60}
												timeCaption="Time"
												timeFormat="h:mm a"
												dateFormat="h:mm a"
												placeholderText="End Time"
												name="slot3EndTime"
											/>
											{errors.slot3EndTime && (
												<div className={InterviewScheduleStyle.error}>
													Please select end time
												</div>
											)}
										</div>
									</div>
								</>
							)}

							{timeErrorMessage && <p className={InterviewScheduleStyle.error}>{timeErrorMessage}</p>}

							{/* {reScheduleSlotRadio === 4 && (
								<div className={InterviewScheduleStyle.row}>
									<div className={InterviewScheduleStyle.colMd12}>
										<HRInputField
											register={register}
											errors={errors}
											label="Additional Notes"
											name="additionalNotes"
											type={InputType.TEXT}
											placeholder="Add Notes"
										/>
									</div>
								</div>
							)} */}
							<div className={InterviewScheduleStyle.row}>
									<div className={InterviewScheduleStyle.colMd12}>
										<HRInputField
											register={register}
											errors={errors}
											label="Additional Notes"
											name="additionalNotes"
											type={InputType.TEXT}
											placeholder="Add Notes"
										/>
									</div>
								</div>
							<div className={InterviewScheduleStyle.formPanelAction}>
								<button
									type="submit"
									onClick={handleSubmit(reScheduleInterviewAPIHandler)}
									className={InterviewScheduleStyle.btnPrimary}>
									Save
								</button>
								<button
									onClick={closeModal}
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

export default InterviewReschedule;
