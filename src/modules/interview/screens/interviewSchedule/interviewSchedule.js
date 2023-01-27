import React, { useCallback, useEffect, useState } from 'react';
import InterviewScheduleStyle from '../../interviewStyle.module.css';
import { Link } from 'react-router-dom';
import UTSRoutes from 'constants/routes';
import { ReactComponent as ArrowLeftSVG } from 'assets/svg/arrowLeft.svg';
import { interviewUtils } from 'modules/interview/interviewUtils';
import { InputType, InterviewStatus } from 'constants/application';
import { Divider } from 'antd';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import { useForm } from 'react-hook-form';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import { MasterDAO } from 'core/master/masterDAO';

const InterviewSchedule = () => {
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

	const rescheduleReason = [
		{ id: 1, value: 'Client not available on given Slots' },
		{ id: 2, value: 'Client not available on selected Slot' },
		{ id: 3, value: 'Talent not available on given Slots' },
		{ id: 4, value: 'Talent not available on selected Slot' },
	];

	const getTimeZone = useCallback(async () => {
		let response = await MasterDAO.getTalentTimeZoneRequestDAO();
		setTimezone(response && response?.responseBody);
	}, []);
	useEffect(() => {
		getTimeZone();
	}, [getTimeZone]);
	return (
		<div className={InterviewScheduleStyle.interviewContainer}>
			<Link to={UTSRoutes.INTERVIEWLISTROUTE}>
				<div className={InterviewScheduleStyle.goback}>
					<ArrowLeftSVG style={{ width: '16px' }} />
					<span>Go Back</span>
				</div>
			</Link>
			<div className={InterviewScheduleStyle.panelBody}>
				<div className={InterviewScheduleStyle.leftPane}>
					<h3>Reschedule Interview</h3>
					<p>Please provide the necessary details</p>
				</div>
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
							<div className={InterviewScheduleStyle.coldMd12}>
								<div className={InterviewScheduleStyle.radioFormGroup}>
									<label>
										Reschedule Request By
										<span className={InterviewScheduleStyle.reqField}>*</span>
									</label>
									<label className={InterviewScheduleStyle.radioContainer}>
										<p>Client</p>
										<input
											// {...register('remote')}
											value={1}
											type="radio"
											checked="checked"
											id="remote"
											name="remote"
										/>
										<span className={InterviewScheduleStyle.checkmark}></span>
									</label>
									<label className={InterviewScheduleStyle.radioContainer}>
										<p>Talent</p>
										<input
											// {...register('remote')}
											value={0}
											type="radio"
											id="remote"
											name="remote"
										/>
										<span className={InterviewScheduleStyle.checkmark}></span>
									</label>
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
							<div className={InterviewScheduleStyle.colMd12}>
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

									<label
										className={InterviewScheduleStyle.radioContainer}
										style={{ marginTop: '8px' }}>
										<p>From Client</p>
										<input
											// {...register('remote')}
											value={'slot1'}
											type="radio"
											checked="checked"
											id="slot1"
											name="slot1"
										/>
										<span className={InterviewScheduleStyle.checkmark}></span>
									</label>
									<label className={InterviewScheduleStyle.radioContainer}>
										<p>Add Final Interview Slot</p>
										<input
											// {...register('remote')}
											value={'slot2'}
											type="radio"
											id="slot2"
											name="slot2"
										/>
										<span className={InterviewScheduleStyle.checkmark}></span>
									</label>
									<label className={InterviewScheduleStyle.radioContainer}>
										<p>Give New Slot to Client</p>
										<input
											// {...register('remote')}
											value={'slot3'}
											type="radio"
											id="slot3"
											name="slot3"
										/>
										<span className={InterviewScheduleStyle.checkmark}></span>
									</label>
								</div>
							</div>
						</div>
						<div className={InterviewScheduleStyle.row}>
							<div className={InterviewScheduleStyle.colMd12}>
								<HRSelectField
									setValue={setValue}
									register={register}
									name="interviewTimezone"
									label="Time Zone"
									defaultValue="Select timezone"
									options={timezone && timezone}
									required
									isError={
										errors['interviewTimezone'] && errors['interviewTimezone']
									}
									errorMsg="Please select a timezone."
								/>
							</div>
						</div>
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
					Back to Interview Page
				</button>
			</div>
		</div>
	);
};

export default InterviewSchedule;
