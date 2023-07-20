import React, { useCallback, useEffect, useState } from 'react';
import InterviewScheduleStyle from '../../interviewStyle.module.css';
import { Link } from 'react-router-dom';
import UTSRoutes from 'constants/routes';
import DatePicker from 'react-datepicker';
import { ReactComponent as ArrowLeftSVG } from 'assets/svg/arrowLeft.svg';
import { interviewUtils } from 'modules/interview/interviewUtils';
import { InputType, InterviewStatus } from 'constants/application';
import { Divider, Radio, message } from 'antd';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import { useForm, Controller } from 'react-hook-form';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import { MasterDAO } from 'core/master/masterDAO';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import { ReactComponent as ClockIconSVG } from 'assets/svg/clock-icon.svg';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { HTTPStatusCode } from 'constants/network';
import { addHours, disabledWeekend } from 'shared/utils/basic_utils';
import SpinLoader from 'shared/components/spinLoader/spinLoader';
import moment from 'moment';

const InterviewSchedule = ({
	talentName,
	key,
	closeModal,
	talentInfo,
	hrId,
	hiringRequestNumber,
	scheduleTimezone,
	setScheduleTimezone,
	getScheduleSlotDate,
	setScheduleSlotDate,
	getScheduleSlotInfomation,
	setScheduleSlotInformation,
	scheduleSlotRadio,
	setScheduleSlotRadio,

	getInterviewStatus,
	callAPI,
}) => {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm();
	const [isLoading, setIsLoading] = useState(false);
	const [messageAPI, contextHolder] = message.useMessage();

	const [slot1Timematch, setSlot1timematch] = useState(false);
	const [slot2Timematch, setSlot2timematch] = useState(false);
	const [slot3Timematch, setSlot3timematch] = useState(false);

	const onSlotChange = (e) => {
		setScheduleSlotRadio(e.target.value);
	};

	useEffect(() => {
		//Slot 1 data
		setValue('slot1Date', getScheduleSlotDate[0].slot1)
		setValue('slot1StartTime', getScheduleSlotDate[0].slot2);
		setValue('slot1EndTime', getScheduleSlotDate[0].slot3);

		//slot 2 data

		setValue('slot2Date', getScheduleSlotDate[1].slot1)
		setValue('slot2StartTime', getScheduleSlotDate[1].slot2);
		setValue('slot2EndTime', getScheduleSlotDate[1].slot3);

		//slot 3 data	

		setValue('slot3Date', getScheduleSlotDate[2].slot1)
		setValue('slot3StartTime', getScheduleSlotDate[2].slot2);
		setValue('slot3EndTime', getScheduleSlotDate[2].slot3);

    },[getScheduleSlotDate,setValue])

	const calenderDateHandler = useCallback(
		(date, index, slotField) => {
			const eleToUpdate = { ...getScheduleSlotDate[index] };
			eleToUpdate[slotField] = date;

			setScheduleSlotDate([
				...getScheduleSlotDate.slice(0, index),
				{ ...eleToUpdate },
				...getScheduleSlotDate.slice(index + 1),
			]);
		},
		[getScheduleSlotDate, setScheduleSlotDate],
	);

	const calenderTimeHandler = useCallback(
		(date, index, slotField) => {
			const eleToUpdate = { ...getScheduleSlotDate[index] };
			eleToUpdate[slotField] = date;

			if (slotField === 'slot2') {
				eleToUpdate['slot3'] = addHours(date, 1);
			}

			setScheduleSlotDate([
				...getScheduleSlotDate.slice(0, index),
				{ ...eleToUpdate },
				...getScheduleSlotDate.slice(index + 1),
			]);
		},
		[getScheduleSlotDate, setScheduleSlotDate],
	);

	const getTimeZone = useCallback(async () => {
		let response = await MasterDAO.getTimeZoneRequestDAO();
		setScheduleTimezone(response && response?.responseBody);
	}, [setScheduleTimezone]);
	useEffect(() => {
		getTimeZone();
	}, [getTimeZone]);

	const scheduleInterviewAPIHandler = useCallback(
		async (data) => {
			setIsLoading(true);

			let timeError = false
			setSlot1timematch(false)
			setSlot2timematch(false)
			setSlot3timematch(false)

			if(moment(data.slot1StartTime).format('HH mm a') === moment(data.slot1EndTime).format('HH mm a')){
					timeError = true;
					setSlot1timematch(true)
				}

			if( scheduleSlotRadio === 1 &&  moment(data.slot2StartTime).format('HH mm a') === moment(data.slot2EndTime).format('HH mm a')){
					setSlot2timematch(true)
					timeError = true;
				}
				
			if( scheduleSlotRadio === 1 && moment(data.slot3StartTime).format('HH mm a') === moment(data.slot3EndTime).format('HH mm a')){
					setSlot3timematch(true)
					timeError = true;
				}	

			if(timeError){
				setIsLoading(false);
					return
				}

			const scheduleData = {
				slotType: scheduleSlotRadio,
				RecheduleSlots:
					scheduleSlotRadio === 1
						? interviewUtils.formatInterviewDateSlotHandler(getScheduleSlotDate)
						: interviewUtils
								.formatInterviewDateSlotHandler(getScheduleSlotDate)
								?.slice(0, 1),
				hiringRequest_ID: hrId,
				hiringRequest_Detail_ID: talentInfo?.HiringDetailID,
				contactID: talentInfo?.ContactId,
				talent_ID: talentInfo?.TalentID,
				interviewStatus: getInterviewStatus(),
				interviewMasterID: talentInfo?.MasterId,
				hiringRequestNumber: hiringRequestNumber,
				workingTimeZoneID: data?.interviewTimezone,
				shortListedID: '',
				additional_notes: data?.additionalNotes ? data?.additionalNotes : '',
				interviewCallLink: data?.interviewCallLink
					? data?.interviewCallLink
					: '',
			};

			// console.log({data: data , scheduleData}) 
			// setIsLoading(false)
			// return

			let response = await hiringRequestDAO.getSchduleInterviewInformation(
				scheduleData,
			);

			if (response?.statusCode === HTTPStatusCode.OK) {
				setIsLoading(false);
				messageAPI.open(
					{
						type: 'success',
						content: 'Interview scheduled successfully',
					},
					1000,
				);
				setTimeout(() => {
					callAPI(hrId);
					closeModal();
				}, 1000);
			} else {
				setIsLoading(false);
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
			closeModal,
			getInterviewStatus,
			getScheduleSlotDate,
			hiringRequestNumber,
			hrId,
			messageAPI,
			scheduleSlotRadio,
			talentInfo?.ContactId,
			talentInfo?.HiringDetailID,
			talentInfo?.MasterId,
			talentInfo?.TalentID,
		],
	);

	return (
		<div
			className={InterviewScheduleStyle.interviewContainer}
			id={key}>
			{contextHolder}
			<div className={InterviewScheduleStyle.leftPane}>
				<h3>Schedule Interview</h3>
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
						className={InterviewScheduleStyle.topDivider}
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
											Slot
											<span className={InterviewScheduleStyle.reqField}>*</span>
										</label>
										<Radio.Group
											defaultValue={1}
											className={InterviewScheduleStyle.radioGroup}
											onChange={onSlotChange}
											value={scheduleSlotRadio}>
											<Radio value={1}>
												Slot options provided by the client
											</Radio>

											<Radio value={4}>Send a link shared by client</Radio>
											<Radio value={2}>
												Slot Directly Added for Final Interview Slot
											</Radio>
										</Radio.Group>
									</div>
								</div>
							</div>

							<div className={InterviewScheduleStyle.row}>
								<div
									className={
										scheduleSlotRadio === 4
											? InterviewScheduleStyle.colMd6
											: InterviewScheduleStyle.colMd12
									}>
									<HRSelectField
										setValue={setValue}
										register={register}
										name="interviewTimezone"
										label="Time Zone"
										defaultValue="Select timezone"
										options={scheduleTimezone && scheduleTimezone}
										required
										isError={
											errors['interviewTimezone'] && errors['interviewTimezone']
										}
										errorMsg="Please select a timezone."
									/>
								</div>
								{scheduleSlotRadio === 4 && (
									<div
										className={
											scheduleSlotRadio === 4
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
										{scheduleSlotRadio === 1 ? 'Slot 1' : 'Slot'}
										<span>*</span>
									</label>
								</div>
								<div className={InterviewScheduleStyle.timeSlotItem}>
									<CalenderSVG />

									<DatePicker
										name="slot1Date"
										required
										{...register('slot1Date')}
										filterDate={disabledWeekend}
										selected={getScheduleSlotDate[0].slot1}
										placeholderText="Select Date"
										onChange={(date) => {
											setValue('slot1Date', date);
											calenderDateHandler(date, 0, 'slot1');
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
										selected={getScheduleSlotDate[0].slot2}
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
										selected={getScheduleSlotDate[0].slot3}
										onChange={(date) => {
											setValue('slot1EndTime', date);
											calenderTimeHandler(date, 0, 'slot3');
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
							</div>
							{scheduleSlotRadio === 1 && (
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
												filterDate={disabledWeekend}
												selected={getScheduleSlotDate[1].slot1}
												placeholderText="Select Date"
												onChange={(date) => {
													setValue('slot2Date', date);
													calenderDateHandler(date, 1, 'slot1');
												}}
												name="slot2Date"
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
												selected={getScheduleSlotDate[1].slot2}
												onChange={(date) => {
													setValue('slot2StartTime', date);
													calenderTimeHandler(date, 1, 'slot2');
												}}
												showTimeSelect
												showTimeSelectOnly
												timeIntervals={60}
												timeCaption="Time"
												dateFormat="h:mm a"
												timeFormat="h:mm a"
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
												selected={getScheduleSlotDate[1].slot3}
												onChange={(date) => {
													setValue('slot2EndTime', date);
													calenderTimeHandler(date, 1, 'slot3');
												}}
												showTimeSelect
												showTimeSelectOnly
												timeIntervals={60}
												timeCaption="Time"
												dateFormat="h:mm a"
												timeFormat="h:mm a"
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
												filterDate={disabledWeekend}
												placeholderText="Select Date"
												selected={getScheduleSlotDate[2].slot1}
												onChange={(date) => {
													setValue('slot3Date', date);
													calenderDateHandler(date, 2, 'slot1');
												}}
												name="slot3Date"
											/>
											{errors.slot3Date && (
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
												{...register('slot3StartTime')}
												selected={getScheduleSlotDate[2].slot2}
												onChange={(date) => {
													setValue('slot3StartTime', date);
													calenderTimeHandler(date, 2, 'slot2');
												}}
												showTimeSelect
												showTimeSelectOnly
												timeIntervals={60}
												timeCaption="Time"
												dateFormat="h:mm a"
												timeFormat="h:mm a"
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
										</div>
										<div
											className={`${InterviewScheduleStyle.timeSlotItem} ${InterviewScheduleStyle.timePickerItem}`}>
											<ClockIconSVG />

											<DatePicker
												required
												{...register('slot3StartTime')}
												selected={getScheduleSlotDate[2].slot3}
												onChange={(date) => {
													setValue('slot3EndTime', date);
													calenderTimeHandler(date, 2, 'slot3');
												}}
												showTimeSelect
												showTimeSelectOnly
												timeIntervals={60}
												timeCaption="Time"
												dateFormat="h:mm a"
												timeFormat="h:mm a"
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

							{scheduleSlotRadio === 4 && (
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
							)}
							<div className={InterviewScheduleStyle.formPanelAction}>
								<button
									// disabled={isLoading}
									type="submit"
									// onClick={handleSubmit(clientSubmitHandler)}
									onClick={handleSubmit(scheduleInterviewAPIHandler)}
									className={InterviewScheduleStyle.btnPrimary}>
									Save
								</button>
								<button
									/* style={{
								cursor:
									type === SubmitType.SAVE_AS_DRAFT ? 'no-drop' : 'pointer',
							}} */
									// disabled={type === SubmitType.SAVE_AS_DRAFT}
									onClick={() => {
										closeModal();
									}}
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

export default InterviewSchedule;
