import React, { useCallback, useEffect, useState } from 'react';
import InterviewScheduleStyle from '../../interviewStyle.module.css';
import { Link } from 'react-router-dom';
import UTSRoutes from 'constants/routes';
import { ReactComponent as ArrowLeftSVG } from 'assets/svg/arrowLeft.svg';
import DatePicker from 'react-datepicker';
import { interviewUtils } from 'modules/interview/interviewUtils';
import { InputType, InterviewStatus } from 'constants/application';
import { Divider, Radio } from 'antd';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import { useForm } from 'react-hook-form';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import { MasterDAO } from 'core/master/masterDAO';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import { ReactComponent as ClockIconSVG } from 'assets/svg/clock-icon.svg';

const InterviewReschedule = ({ talentName, key, closeModal, hrId, talentInfo, hiringRequestNumber, reScheduleTimezone, setRescheduleTimezone, getRescheduleSlotDate, setRescheduleSlotDate, getRescheduleSlotInfomation, setRescheduleSlotInformation, reScheduleRadio, setRescheduleRadio, reScheduleSlotRadio, setRescheduleSlotRadio, getSlotInformationHandler, getInterviewStatus }) => {
	const {
		register,
		handleSubmit,
		setValue,
		control,
		setError,
		getValues,
		watch,
		formState: { errors },
		resetField
	} = useForm();

	const rescheduleReason = [
		{ id: 1, value: 'Client not available on given Slots' },
		{ id: 2, value: 'Client not available on selected Slot' },
		{ id: 3, value: 'Talent not available on given Slots' },
		{ id: 4, value: 'Talent not available on selected Slot' },
	];

	const onRescheduleChange = (e) => {
		setRescheduleRadio(e.target.value);
	};
	const onSlotChange = (e) => {
		setRescheduleSlotRadio(e.target.value);
	};

	const getTimeZone = useCallback(async () => {
		let response = await MasterDAO.getTalentTimeZoneRequestDAO();
		setRescheduleTimezone(response && response?.responseBody);
	}, []);

	useEffect(() => {
		getTimeZone();
	}, [getTimeZone]);


	const reScheduleInterviewAPIHandler = async (data) => {
		const reScheduleData = {
			rescheduleRequestBy: reScheduleRadio,
			reasonforReschedule: data?.interviewRescheduleReason?.value,
			slotType: reScheduleSlotRadio,
			recheduleSlots: reScheduleSlotRadio === 1 ? getRescheduleSlotInfomation : getRescheduleSlotInfomation.slice(0, 1),
			hiringRequest_ID: hrId,
			hiringRequest_Detail_ID: talentInfo?.HiringDetailID,
			contactID: talentInfo?.ContactId,
			talent_ID: talentInfo?.TalentID,
			interviewStatus: getInterviewStatus(),
			interviewMasterID: talentInfo?.MasterId,
			hiringRequestNumber: hiringRequestNumber,
			workingTimeZoneID: data?.interviewTimezone,
			nextRound_InterviewDetailsID: 0,
		}
		let response = await hiringRequestDAO.getReSchduleInterviewInformation(reScheduleData);
		closeModal();
		resetField("interviewMessage");
		resetField("additionalNotes")
		resetField("interviewCallLink")
	};

	return (
		<div className={InterviewScheduleStyle.interviewContainer} id={key}>
			<div className={InterviewScheduleStyle.interviewModalTitle}>
				<h2>Reschedule Interview</h2>
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

									<div className={InterviewScheduleStyle.cardTitle}>
										{hiringRequestNumber}
									</div>
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
										'Scheduled',
										InterviewStatus.INTERVIEW_SCHEDULED,
									)}
								</div>


							</div>
						</div>
						<div className={InterviewScheduleStyle.colMd4}>
							<div className={InterviewScheduleStyle.transparentTopCard}>
								<div className={InterviewScheduleStyle.cardLabel}>
									Interview Round
								</div>
								<div className={InterviewScheduleStyle.cardTitle}>Round 1</div>
							</div>
						</div>
					</div>


					<Divider className={InterviewScheduleStyle.topDivider}
						dashed
					/>

					<form id="interviewReschedule">
						<div className={InterviewScheduleStyle.row}>
							<div className={InterviewScheduleStyle.colMd12}>
								<div className={`${InterviewScheduleStyle.radioFormGroup} ${InterviewScheduleStyle.requestByRadio} `}>
									<label>
										Reschedule Request By
										<span className={InterviewScheduleStyle.reqField}>*</span>
									</label>

									<Radio.Group
										defaultValue={1}
										className={InterviewScheduleStyle.radioGroup}
										onChange={onRescheduleChange}
										value={reScheduleRadio}>
										<Radio value={"client"}>Client</Radio>
										<Radio value={"talent"}>Talent</Radio>
									</Radio.Group>

								</div>
							</div>
						</div>
						<div className={InterviewScheduleStyle.row}>
							<div className={InterviewScheduleStyle.colMd12}>
								<HRSelectField
									setValue={setValue}
									register={register}
									name="interviewRescheduleReason"
									label="Reason for Reschedule"
									defaultValue="Select reschedule reason"
									options={rescheduleReason}
									mode='id/value'
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
							<div className={`${InterviewScheduleStyle.colMd12} ${InterviewScheduleStyle.mB0}`}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'please enter the client name.',
									}}
									label="Message to Appear"
									name="interviewMessage"
									type={InputType.TEXT}
									placeholder="Enter message"
									required
								/>
							</div>
						</div>

						<Divider className={InterviewScheduleStyle.topDivider}
							dashed
						/>

						<div className={InterviewScheduleStyle.row}>
							<div className={InterviewScheduleStyle.colMd12}>
								<div
									className={InterviewScheduleStyle.radioFormGroup}
									style={{
										display: 'flex',
										flexDirection: 'column',
									}}>
									{/* <label>
										Slot
										<span className={InterviewScheduleStyle.reqField}>*</span>
									</label> */}
									<Radio.Group
										defaultValue={1}
										className={InterviewScheduleStyle.radioGroup}
										onChange={onSlotChange}
										value={reScheduleSlotRadio}>
										<Radio value={1}>Slot options provided by the client</Radio>
										<Radio value={2}>
											Send a link shared by client
										</Radio>
										<Radio value={3}>Slot Directly Added for Final Interview Slot</Radio>
									</Radio.Group>
								</div>
							</div>

						</div>

						<div className={InterviewScheduleStyle.row}>
							<div className={reScheduleSlotRadio === 2 ? InterviewScheduleStyle.colMd6 : InterviewScheduleStyle.colMd12} >
								<HRSelectField
									setValue={setValue}
									register={register}
									name="interviewTimezone"
									label="Time Zone"
									defaultValue="Select timezone"
									options={reScheduleTimezone && reScheduleTimezone}
									required
									isError={
										errors['interviewTimezone'] && errors['interviewTimezone']
									}
									errorMsg="Please select a timezone."
								/>
							</div>
							{reScheduleSlotRadio === 2 && <div className={reScheduleSlotRadio === 2 ? InterviewScheduleStyle.colMd6 : InterviewScheduleStyle.colMd12} >
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
							</div>}
						</div>

						<div className={InterviewScheduleStyle.timeSlotRow}>
							<div className={InterviewScheduleStyle.timeSlotLabel}>
								<label>{reScheduleSlotRadio === 1 ? "Slot 1" : "Slot"} <span>*</span></label>
							</div>
							<div className={InterviewScheduleStyle.timeSlotItem}>
								<CalenderSVG />
								<DatePicker selected={getRescheduleSlotDate[0].slot1}
									placeholderText="Select Date"
									onChange={(date) => getSlotInformationHandler(date, "slot1Date", "reschedule")} />
							</div>
							<div className={`${InterviewScheduleStyle.timeSlotItem} ${InterviewScheduleStyle.timePickerItem}`}>
								<ClockIconSVG />
								<DatePicker
									selected={getRescheduleSlotDate[0].slot2}
									onChange={(date) => getSlotInformationHandler(date, "slot1StartTime", "reschedule")}
									showTimeSelect
									showTimeSelectOnly
									timeIntervals={60}
									timeCaption="Time"
									timeFormat="h:mm a"
									dateFormat="h:mm a"
									placeholderText="Start Time"
								/>
							</div>
							<div className={`${InterviewScheduleStyle.timeSlotItem} ${InterviewScheduleStyle.timePickerItem}`}>
								<ClockIconSVG />
								<DatePicker
									selected={getRescheduleSlotDate[0].slot3}
									onChange={(date) => getSlotInformationHandler(date, "slot1EndTime", "reschedule")}
									showTimeSelect
									showTimeSelectOnly
									timeIntervals={60}
									timeCaption="Time"
									timeFormat="h:mm a"
									dateFormat="h:mm a"
									placeholderText="End Time"
								/>
							</div>
						</div>

						{reScheduleSlotRadio === 1 &&
							<>
								<div className={InterviewScheduleStyle.timeSlotRow}>
									<div className={InterviewScheduleStyle.timeSlotLabel}>
										<label>Slot 2 <span>*</span></label>
									</div>
									<div className={InterviewScheduleStyle.timeSlotItem}>
										<CalenderSVG />
										<DatePicker selected={getRescheduleSlotDate[1].slot1} placeholderText="Select Date" onChange={(date) => getSlotInformationHandler(date, "slot2Date", "reschedule")} />
									</div>
									<div className={`${InterviewScheduleStyle.timeSlotItem} ${InterviewScheduleStyle.timePickerItem}`}>
										<ClockIconSVG />
										<DatePicker
											selected={getRescheduleSlotDate[1].slot2}
											onChange={(date) => getSlotInformationHandler(date, "slot2StartTime", "reschedule")}
											showTimeSelect
											showTimeSelectOnly
											timeIntervals={60}
											timeCaption="Time"
											timeFormat="h:mm a"
											dateFormat="h:mm a"
											placeholderText="Start Time"
										/>
									</div>
									<div className={`${InterviewScheduleStyle.timeSlotItem} ${InterviewScheduleStyle.timePickerItem}`}>
										<ClockIconSVG />
										<DatePicker
											selected={getRescheduleSlotDate[1].slot3}
											onChange={(date) => getSlotInformationHandler(date, "slot2EndTime", "reschedule")}
											showTimeSelect
											showTimeSelectOnly
											timeIntervals={60}
											timeCaption="Time"
											timeFormat="h:mm a"
											dateFormat="h:mm a"
											placeholderText="End Time"
										/>
									</div>
								</div>

								<div className={InterviewScheduleStyle.timeSlotRow}>
									<div className={InterviewScheduleStyle.timeSlotLabel}>
										<label>Slot 3 <span>*</span></label>
									</div>
									<div className={InterviewScheduleStyle.timeSlotItem}>
										<CalenderSVG />
										<DatePicker placeholderText="Select Date" selected={getRescheduleSlotDate[2].slot1} onChange={(date) => getSlotInformationHandler(date, "slot3Date", "reschedule")} />
									</div>
									<div className={`${InterviewScheduleStyle.timeSlotItem} ${InterviewScheduleStyle.timePickerItem}`}>
										<ClockIconSVG />
										<DatePicker
											selected={getRescheduleSlotDate[2].slot2}
											onChange={(date) => getSlotInformationHandler(date, "slot3StartTime", "reschedule")}
											showTimeSelect
											showTimeSelectOnly
											timeIntervals={60}
											timeCaption="Time"
											timeFormat="h:mm a"
											dateFormat="h:mm a"
											placeholderText="Start Time"
										/>
									</div>
									<div className={`${InterviewScheduleStyle.timeSlotItem} ${InterviewScheduleStyle.timePickerItem}`}>
										<ClockIconSVG />
										<DatePicker
											selected={getRescheduleSlotDate[2].slot3}
											onChange={(date) => getSlotInformationHandler(date, "slot3EndTime", "reschedule")}
											showTimeSelect
											showTimeSelectOnly
											timeIntervals={60}
											timeCaption="Time"
											timeFormat="h:mm a"
											dateFormat="h:mm a"
											placeholderText="End Time"
										/>
									</div>
								</div>
							</>
						}
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
					</form>
				</div>
			</div >

			<div className={InterviewScheduleStyle.formPanelAction}>
				<button
					// disabled={isLoading}
					type="submit"
					onClick={handleSubmit(reScheduleInterviewAPIHandler)}
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
						closeModal()
					}}
					className={InterviewScheduleStyle.btn}>
					Cancel
				</button>
			</div>
		</div >
	);
};

export default InterviewReschedule;
