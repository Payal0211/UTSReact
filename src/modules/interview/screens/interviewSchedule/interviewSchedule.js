import React, { useCallback, useEffect, useState } from 'react';
import InterviewScheduleStyle from '../../interviewStyle.module.css';
import { Link } from 'react-router-dom';
import UTSRoutes from 'constants/routes';
import { ReactComponent as ArrowLeftSVG } from 'assets/svg/arrowLeft.svg';
import { interviewUtils } from 'modules/interview/interviewUtils';
import { InputType, InterviewStatus } from 'constants/application';
import { Divider, Radio } from 'antd';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import { useForm } from 'react-hook-form';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import { MasterDAO } from 'core/master/masterDAO';

const InterviewSchedule = ({ talentName, key, closeModal }) => {
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
	const [rescheduleRadio, setRescheduleRadio] = useState(1);
	const [slotRadio, setSlotRadio] = useState(1);
	const onRescheduleChange = (e) => {
		setRescheduleRadio(e.target.value);
	};
	const onSlotChange = (e) => {
		setSlotRadio(e.target.value);
	};

	const getTimeZone = useCallback(async () => {
		let response = await MasterDAO.getTalentTimeZoneRequestDAO();
		setTimezone(response && response?.responseBody);
	}, []);
	useEffect(() => {
		getTimeZone();
	}, [getTimeZone]);
	return (
		<div
			className={InterviewScheduleStyle.interviewContainer}
			id={key}>
			<div className={InterviewScheduleStyle.leftPane}>
				<h3>Schedule Interview</h3>
			</div>
			<div className={InterviewScheduleStyle.panelBody}>
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
									{talentName}
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
										Slot
										<span className={InterviewScheduleStyle.reqField}>*</span>
									</label>
									<Radio.Group
										defaultValue={1}
										className={InterviewScheduleStyle.radioGroup}
										onChange={onSlotChange}
										value={slotRadio}>
										<Radio value={1}>
											Slot Directly Add Final Interview Slot
										</Radio>
										<Radio value={2}>Send a link shared by client</Radio>
										<Radio value={3}>Slot From Client</Radio>
									</Radio.Group>
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
					onClick={closeModal}
					className={InterviewScheduleStyle.btn}>
					Back to Interview Page
				</button>
			</div>
		</div>
	);
};

export default InterviewSchedule;
