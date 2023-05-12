import React, { useCallback, useEffect, useState } from 'react';
import confirmSlotStyle from './confirmSlot.module.css';
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
import { HttpStatusCode } from 'axios';

const ConfirmSlotModal = ({
	getConfirmSlotDetails,
	onCancel,
	handleSubmit,
	confirmSlotRadio,
	setConfirmSlotRadio,
	talentInfo,
	hrId,
	getDateNewFormate,
	setDateNewFormate,
	hiringRequestNumber,
	setHRapiCall,
	callHRapi,
}) => {
	const dateConverter = () => {
		const monthNames = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		];
		const days = [
			'Sunday',
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday',
		];

		const newDateFormate = getConfirmSlotDetails?.Slots?.map((item, index) => {
			const date = new Date(`${item?.slotDate}`);
			return `Slot-${index + 1} ${days[date.getDay()]} ${
				monthNames[date.getMonth()]
			} ${date.getDate()}  ${date.getFullYear()} ${item?.strStartTime} ${
				item?.strStartTime?.slice(0, item?.strStartTime?.indexOf(':')) > 12
					? 'PM'
					: 'AM'
			} to ${item?.strEndTime}  ${
				item?.strStartTime?.slice(0, item?.strEndTime?.indexOf(':')) > 12
					? 'PM'
					: 'AM'
			}`;
		});

		setDateNewFormate(newDateFormate);
	};

	useEffect(() => {
		dateConverter();
	}, [getConfirmSlotDetails]);

	const saveConfirmSlotDetailsHandler = async (data) => {
		const shortListId = getConfirmSlotDetails?.Slots.filter(
			(item, index) => confirmSlotRadio === index + 1,
		);

		const confirmSlotPayload = {
			hiringRequest_ID: hrId,
			hiringRequest_Detail_ID: talentInfo?.HiringDetailID,
			contactID: talentInfo?.ContactId,
			talent_ID: talentInfo?.TalentID,
			interviewMasterID: talentInfo?.MasterId,
			shortListedID: shortListId[0]?.iD_As_ShortListedID,
		};

		const response = await hiringRequestDAO.saveConfirmSlotDetailsDAO(
			confirmSlotPayload,
		);
		if (response?.statusCode === HTTPStatusCode.OK) {
			onCancel();
			setHRapiCall(!callHRapi);
		}
	};

	const onSlotChange = (e) => {
		setConfirmSlotRadio(e.target.value);
	};

	return (
		<div className={confirmSlotStyle.interviewContainer}>
			<div className={confirmSlotStyle.leftPane}>
				<h3>Confirm Interview Slot</h3>
			</div>
			<div className={confirmSlotStyle.panelBody}>
				<div className={confirmSlotStyle.rightPane}>
					<div className={confirmSlotStyle.row}>
						<div className={confirmSlotStyle.colMd4}>
							<div className={confirmSlotStyle.transparentTopCard}>
								<div className={confirmSlotStyle.cardLabel}>Talent Name</div>

								<div className={confirmSlotStyle.cardTitle}>
									{getConfirmSlotDetails?.TalentName}
								</div>
							</div>
						</div>

						<div className={confirmSlotStyle.colMd4}>
							<div className={confirmSlotStyle.transparentTopCard}>
								<div className={confirmSlotStyle.cardLabel}>
									Hiring Request No
								</div>
								<div className={confirmSlotStyle.cardTitle}>
									{hiringRequestNumber}
								</div>
							</div>
						</div>

						<div className={confirmSlotStyle.colMd4}>
							<div className={confirmSlotStyle.transparentTopCard}>
								<div className={confirmSlotStyle.cardLabel}>
									Interview Status
								</div>
								<div className={confirmSlotStyle.cardTitle}>
									{interviewUtils.GETINTERVIEWSTATUS(
										talentInfo?.InterviewStatus,
										talentInfo?.InterViewStatusId,
									)}
								</div>
							</div>
						</div>

						<div className={confirmSlotStyle.colMd4}>
							<div className={confirmSlotStyle.transparentTopCard}>
								<div className={confirmSlotStyle.cardLabel}>
									Interview Round
								</div>
								<div className={confirmSlotStyle.cardTitle}>
									{talentInfo?.InterviewROUND || 'NA'}
								</div>
							</div>
						</div>
					</div>

					<Divider
						className={confirmSlotStyle.topDivider}
						dashed
					/>
					<form id="interviewReschedule">
						<div className={confirmSlotStyle.row}>
							<div className={confirmSlotStyle.colMd12}>
								<div
									className={confirmSlotStyle.radioFormGroup}
									style={{
										display: 'flex',
										flexDirection: 'column',
									}}>
									<label>
										Select Date & Time Slot to Schedule Interview
										<span className={confirmSlotStyle.reqField}>*</span>
									</label>
									<Radio.Group
										defaultValue={1}
										className={confirmSlotStyle.radioGroup}
										onChange={onSlotChange}
										value={confirmSlotRadio}>
										<Radio value={1}>{getDateNewFormate?.[0]}</Radio>

										<Radio value={2}>{getDateNewFormate?.[1]}</Radio>
										<Radio value={3}>{getDateNewFormate?.[2]}</Radio>
									</Radio.Group>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
			<div className={confirmSlotStyle.formPanelAction}>
				<button
					// disabled={isLoading}
					type="submit"
					onClick={() => saveConfirmSlotDetailsHandler()}
					className={confirmSlotStyle.btnPrimary}>
					Save
				</button>
				<button
					className={confirmSlotStyle.btn}
					onClick={() => onCancel()}>
					Cancel
				</button>
			</div>
		</div>
	);
};

export default ConfirmSlotModal;
