import { Dropdown, Menu, Divider, List, Modal, message, Space } from 'antd';
import { BsThreeDots } from 'react-icons/bs';
import { All_Hiring_Request_Utils } from 'shared/utils/all_hiring_request_util';
import TalentListStyle from './talentList.module.css';
import HROperator from '../hroperator/hroperator';
import { AiOutlineDown } from 'react-icons/ai';
import { useForm } from 'react-hook-form';
import { Fragment, useEffect, useState, useCallback, useMemo } from 'react';
import { ReactComponent as ExportSVG } from 'assets/svg/export.svg';
import { TalentOnboardStatus } from 'constants/application';
import InterviewReschedule from 'modules/interview/screens/interviewReschedule/interviewReschedule';
import InterviewSchedule from 'modules/interview/screens/interviewSchedule/interviewSchedule';
import InterviewFeedback from 'modules/interview/screens/interviewFeedback/interviewFeedback';
import { hrUtils } from 'modules/hiring request/hrUtils';
import {
	_isNull,
	defaultEndTime,
	defaultStartTime,
	getInterviewSlotInfo,
	getNthDateExcludingWeekend,
} from 'shared/utils/basic_utils';
import { allHRConfig } from 'modules/hiring request/screens/allHiringRequest/allHR.config';
import TalentAcceptance from '../talentAcceptance/talentAcceptance';
import TalentStatus from '../talentStatus/talentStatus';
import InterviewStatus from 'modules/interview/components/interviewStatus/interviewStatus';
import UpdateClientOnBoardStatus from '../updateClientOnboardStatus/updateClientOnboardStatus';
import UpdateTalentOnboardStatus from '../updateTalentOnboardStatus/updateTalentOnboardStatus';
import UpdateLegalClientOnboardStatus from '../updateLegalClientOnboardStatus/updateLegalClientOnboardStatus';
import EngagementReplaceTalent from 'modules/engagement/screens/engagementReplaceTalent/engagementReplaceTalent';
import UpdateLegalTalentOnboardStatus from '../updateLegalTalentOnboardStatus/updateLegalTalentOnboardStatus';
import UpdateKickOffOnboardStatus from '../updateKickOffOnboardStatus/updateKickOffOnboardStatus';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { HTTPStatusCode } from 'constants/network';
import EditPayRate from '../editBillAndPayRate/editPayRateModal';
import { DownOutlined } from '@ant-design/icons';
import EditBillRate from '../editBillAndPayRate/editBillRateModal';
import ConfirmSlotModal from '../confirmSlot/confirmSlotModal';

const TalentList = ({
	talentCTA,
	talentDetail,
	miscData,
	callAPI,
	clientDetail,
	HRStatusCode,
	hrId,
	starMarkedStatusCode,
	hrStatus,
	hiringRequestNumber,
	hrType,
	setHRapiCall,
	callHRapi,
	inteviewSlotDetails,
}) => {
	const [activeIndex, setActiveIndex] = useState(-1);
	const [activeType, setActiveType] = useState(null);
	const [logExpanded, setLogExpanded] = useState(null);
	const [showVersantModal, setVersantModal] = useState(false);
	const [interviewFeedback, setInterviewFeedback] = useState(false);
	const [showInterviewStatus, setInterviewStatus] = useState(false);
	const profileData = allHRConfig.profileLogConfig();
	const [showReScheduleInterviewModal, setReScheduleInterviewModal] =
		useState(false);
	const [showTalentAcceptance, setTalentAcceptance] = useState(false);
	const [showProfileLogModal, setProfileLogModal] = useState(false);
	const [showTalentStatus, setTalentStatus] = useState(false);
	const [updateOnboardClientModal, setOnboardClientModal] = useState(false);
	const [updateOnboardTalentModal, setOnboardTalentModal] = useState(false);
	const [updateLegalClientOnboardModal, setLegalClientOnboardModal] =
		useState(false);
	const [updateLegalTalentOnboardModal, setLegalTalentOnboardModal] =
		useState(false);
	const [updateTalentKickOffModal, setTalentKickOffModal] = useState(false);

	const [replaceTalentModal, setReplaceTalentModal] = useState(false);
	const [messageAPI, contextHolder] = message.useMessage();
	const [talentIndex, setTalentIndex] = useState(0);
	//schedule modal state
	const [showScheduleInterviewModal, setScheduleInterviewModal] =
		useState(false);
	const [scheduleTimezone, setScheduleTimezone] = useState([]);
	const [editBillRate, setEditBillRate] = useState(false);
	const [editPayRate, setEditPayRate] = useState(false);

	const [getScheduleSlotDate, setScheduleSlotDate] = useState([
		{
			slot1: getNthDateExcludingWeekend(1),
			slot2: defaultStartTime(),
			slot3: defaultEndTime(),
		},
		{
			slot1: getNthDateExcludingWeekend(2),
			slot2: defaultStartTime(),
			slot3: defaultEndTime(),
		},

		{
			slot1: getNthDateExcludingWeekend(3),
			slot2: defaultStartTime(),
			slot3: defaultEndTime(),
		},
	]);
	const [getScheduleSlotInfomation, setScheduleSlotInformation] = useState([
		{
			SlotID: 1,
			...getInterviewSlotInfo(
				getNthDateExcludingWeekend(1),
				defaultStartTime(),
				defaultEndTime(),
			),
			iD_As_ShortListedID: '',
		},
		{
			SlotID: 2,
			...getInterviewSlotInfo(
				getNthDateExcludingWeekend(2),
				defaultStartTime(),
				defaultEndTime(),
			),
			iD_As_ShortListedID: '',
		},
		{
			SlotID: 3,
			...getInterviewSlotInfo(
				getNthDateExcludingWeekend(3),
				defaultStartTime(),
				defaultEndTime(),
			),
			iD_As_ShortListedID: '',
		},
	]);
	const [scheduleSlotRadio, setScheduleSlotRadio] = useState(1);
	//reschedule modal state
	const [reScheduleTimezone, setRescheduleTimezone] = useState([]);
	const [getRescheduleSlotDate, setRescheduleSlotDate] = useState([
		{
			slot1: getNthDateExcludingWeekend(1),
			slot2: defaultStartTime(),
			slot3: defaultEndTime(),
		},
		{
			slot1: getNthDateExcludingWeekend(2),
			slot2: defaultStartTime(),
			slot3: defaultEndTime(),
		},

		{
			slot1: getNthDateExcludingWeekend(3),
			slot2: defaultStartTime(),
			slot3: defaultEndTime(),
		},
	]);

	const [getRescheduleSlotInfomation, setRescheduleSlotInformation] = useState([
		{
			SlotID: 1,
			...getInterviewSlotInfo(
				getNthDateExcludingWeekend(1),
				defaultStartTime(),
				defaultEndTime(),
			),
			iD_As_ShortListedID: '',
		},
		{
			SlotID: 2,
			...getInterviewSlotInfo(
				getNthDateExcludingWeekend(2),
				defaultStartTime(),
				defaultEndTime(),
			),
			iD_As_ShortListedID: '',
		},
		{
			SlotID: 3,
			...getInterviewSlotInfo(
				getNthDateExcludingWeekend(3),
				defaultStartTime(),
				defaultEndTime(),
			),
			iD_As_ShortListedID: '',
		},
	]);
	const [reScheduleRadio, setRescheduleRadio] = useState(1);
	const [reScheduleSlotRadio, setRescheduleSlotRadio] = useState(1);
	const [pageIndex, setPageIndex] = useState(0);
	const [getConfirmSlotModal, setConfirmSlotModal] = useState(false);
	const [getConfirmSlotDetails, setConfirmSlotDetails] = useState({});
	const [confirmSlotRadio, setConfirmSlotRadio] = useState(1);
	const [getDateNewFormate, setDateNewFormate] = useState([]);

	const {
		register,
		handleSubmit,
		setValue,
		resetField,
		formState: { errors },
	} = useForm();
	const filterTalentID = useMemo(
		() =>
			talentDetail?.filter((item) => item?.TalentID === talentIndex)?.[0] || {},
		[talentDetail, talentIndex],
	);
	const getSlotInformationHandler = useCallback(
		(date, type, interviewType) => {
			const yyyy = date.getFullYear();
			let mm = date.getMonth() + 1;
			let dd = date.getDate();
			let hours = date.getHours();
			let miniute = date.getMinutes();
			if (dd < 10) dd = '0' + dd;
			if (mm < 10) mm = '0' + mm;
			if (hours < 10) hours = '0' + hours;
			if (miniute < 10) miniute = '0' + miniute;
			const timeFormate = hours + ':' + miniute;
			const firstDateFormate = mm + '/' + dd + '/' + yyyy;
			const secondDateFormate = `${yyyy}-${mm}-${dd}T00:00:00.0000`;
			let startTimeFirstFormate;
			let endTimeFirstFormate;
			let startTimeSecondFormate;
			let endTimeSecondFormate;

			switch (type) {
				case 'slot1Date':
					if (interviewType === 'schedule') {
						if (
							getScheduleSlotInfomation[0]?.STRStartTime &&
							getScheduleSlotInfomation[0]?.STREndTime
						) {
							startTimeFirstFormate = `${firstDateFormate}${getScheduleSlotInfomation[0]?.STRStartTime.slice(
								10,
							)}`;
							endTimeFirstFormate = `${firstDateFormate}${getScheduleSlotInfomation[0]?.STREndTime?.slice(
								10,
							)}`;
							startTimeSecondFormate = `${secondDateFormate.slice(
								0,
								11,
							)}${getScheduleSlotInfomation[0]?.STRStartTime.slice(
								11,
							)}:00.0000`;
							endTimeSecondFormate = `${secondDateFormate.slice(
								0,
								11,
							)}${getScheduleSlotInfomation[0]?.STREndTime.slice(11)}:00.0000`;
						}
						setScheduleSlotInformation(
							getScheduleSlotInfomation.map((item, index) => {
								if (index === 0) {
									return {
										...item,
										SlotDate: firstDateFormate || null,
										STRSlotDate: firstDateFormate || null,
										STRStartTime: startTimeFirstFormate || null,
										STREndTime: endTimeFirstFormate || null,
										StartTime: startTimeFirstFormate?.split(' ')[1] || null,
										EndTime: endTimeFirstFormate?.split(' ')[1] || null,
									};
								} else {
									return item;
								}
							}),
						);
						setScheduleSlotDate(
							getScheduleSlotDate.map((item, index) => {
								if (index === 0) {
									return { ...item, slot1: date };
								} else {
									return item;
								}
							}),
						);
					} else if (interviewType === 'reschedule') {
						if (
							getRescheduleSlotInfomation[0]?.STRStartTime &&
							getRescheduleSlotInfomation[0]?.STREndTime
						) {
							startTimeFirstFormate = `${firstDateFormate}${getRescheduleSlotInfomation[0]?.STRStartTime.slice(
								10,
							)}`;
							endTimeFirstFormate = `${firstDateFormate}${getRescheduleSlotInfomation[0]?.STREndTime?.slice(
								10,
							)}`;
							startTimeSecondFormate = `${secondDateFormate.slice(
								0,
								11,
							)}${getRescheduleSlotInfomation[0]?.STRStartTime.slice(
								11,
							)}:00.0000`;
							endTimeSecondFormate = `${secondDateFormate.slice(
								0,
								11,
							)}${getRescheduleSlotInfomation[0]?.STREndTime.slice(
								11,
							)}:00.0000`;
						}
						setRescheduleSlotInformation(
							getRescheduleSlotInfomation.map((item, index) => {
								if (index === 0) {
									return {
										...item,
										SlotDate: firstDateFormate || null,
										STRSlotDate: firstDateFormate || null,
										StartTime: startTimeFirstFormate?.split(' ')[1] || null,
										STRStartTime: startTimeFirstFormate || null,
										EndTime: endTimeFirstFormate?.split(' ')[1] || null,
										STREndTime: endTimeFirstFormate || null,
									};
								} else {
									return item;
								}
							}),
						);
						setRescheduleSlotDate(
							getRescheduleSlotDate.map((item, index) => {
								if (index === 0) {
									return { ...item, slot1: date };
								} else {
									return item;
								}
							}),
						);
					}
					break;
				case 'slot1StartTime':
					if (interviewType === 'schedule') {
						if (
							getScheduleSlotInfomation[0]?.STRSlotDate &&
							getScheduleSlotInfomation[0]?.SlotDate
						) {
							startTimeFirstFormate = `${getScheduleSlotInfomation[0]?.STRSlotDate} ${timeFormate}`;
							startTimeSecondFormate = `${getScheduleSlotInfomation[0]?.SlotDate.slice(
								0,
								11,
							)}${timeFormate}:00.0000`;
						} else {
							startTimeFirstFormate = `${firstDateFormate} ${timeFormate}`;
							startTimeSecondFormate = `${secondDateFormate.slice(
								0,
								11,
							)}${timeFormate}:00.0000`;
						}
						setScheduleSlotInformation(
							getScheduleSlotInfomation.map((item, index) => {
								if (index === 0) {
									return {
										...item,
										StartTime: startTimeFirstFormate?.split(' ')[1] || null,
										STRStartTime: startTimeFirstFormate || null,
									};
								} else {
									return item;
								}
							}),
						);

						setScheduleSlotDate(
							getScheduleSlotDate.map((item, index) => {
								if (index === 0) {
									return { ...item, slot2: date };
								} else {
									return item;
								}
							}),
						);
					} else if (interviewType === 'reschedule') {
						if (
							getRescheduleSlotInfomation[0]?.STRSlotDate &&
							getRescheduleSlotInfomation[0]?.SlotDate
						) {
							startTimeFirstFormate = `${getRescheduleSlotInfomation[0]?.STRSlotDate} ${timeFormate}`;
							startTimeSecondFormate = `${getRescheduleSlotInfomation[0]?.SlotDate.slice(
								0,
								11,
							)}${timeFormate}:00.0000`;
						} else {
							startTimeFirstFormate = `${firstDateFormate} ${timeFormate}`;
							startTimeSecondFormate = `${secondDateFormate.slice(
								0,
								11,
							)}${timeFormate}:00.0000`;
						}
						setRescheduleSlotInformation(
							getRescheduleSlotInfomation.map((item, index) => {
								if (index === 0) {
									return {
										...item,
										StartTime: startTimeFirstFormate?.split(' ')[1] || null,
										STRStartTime: startTimeFirstFormate || null,
									};
								} else {
									return item;
								}
							}),
						);
						setRescheduleSlotDate(
							getRescheduleSlotDate.map((item, index) => {
								if (index === 0) {
									return { ...item, slot2: date };
								} else {
									return item;
								}
							}),
						);
					}
					break;
				case 'slot1EndTime':
					if (interviewType === 'schedule') {
						if (
							getScheduleSlotInfomation[0]?.STRSlotDate &&
							getScheduleSlotInfomation[0]?.SlotDate
						) {
							endTimeFirstFormate = `${getScheduleSlotInfomation[0]?.STRSlotDate} ${timeFormate}`;
							endTimeSecondFormate = `${getScheduleSlotInfomation[0]?.SlotDate.slice(
								0,
								11,
							)}${timeFormate}:00.0000`;
						} else {
							endTimeFirstFormate = `${firstDateFormate} ${timeFormate}`;
							endTimeSecondFormate = `${secondDateFormate.slice(
								0,
								11,
							)}${timeFormate}:00.0000`;
						}
						setScheduleSlotInformation(
							getScheduleSlotInfomation.map((item, index) => {
								if (index === 0) {
									return {
										...item,
										EndTime: endTimeFirstFormate?.split(' ')[1] || null,
										STREndTime: endTimeFirstFormate || null,
									};
								} else {
									return item;
								}
							}),
						);

						setScheduleSlotDate(
							getScheduleSlotDate.map((item, index) => {
								if (index === 0) {
									return { ...item, slot3: date };
								} else {
									return item;
								}
							}),
						);
					} else if (interviewType === 'reschedule') {
						if (
							getRescheduleSlotInfomation[0]?.STRSlotDate &&
							getRescheduleSlotInfomation[0]?.SlotDate
						) {
							endTimeFirstFormate = `${getRescheduleSlotInfomation[0]?.STRSlotDate} ${timeFormate}`;
							endTimeSecondFormate = `${getRescheduleSlotInfomation[0]?.SlotDate.slice(
								0,
								11,
							)}${timeFormate}:00.0000`;
						} else {
							endTimeFirstFormate = `${firstDateFormate} ${timeFormate}`;
							endTimeSecondFormate = `${secondDateFormate.slice(
								0,
								11,
							)}${timeFormate}:00.0000`;
						}
						setRescheduleSlotInformation(
							getRescheduleSlotInfomation.map((item, index) => {
								if (index === 0) {
									return {
										...item,
										EndTime: endTimeFirstFormate?.split(' ')[1] || null,
										STREndTime: endTimeFirstFormate || null,
									};
								} else {
									return item;
								}
							}),
						);
						setRescheduleSlotDate(
							getRescheduleSlotDate.map((item, index) => {
								if (index === 0) {
									return { ...item, slot3: date };
								} else {
									return item;
								}
							}),
						);
					}
					break;

				case 'slot2Date':
					if (interviewType === 'schedule') {
						if (
							getScheduleSlotInfomation[1]?.STRStartTime &&
							getScheduleSlotInfomation[1]?.STREndTime
						) {
							startTimeFirstFormate = `${firstDateFormate}${getScheduleSlotInfomation[1]?.STRStartTime.slice(
								10,
							)}`;
							endTimeFirstFormate = `${firstDateFormate}${getScheduleSlotInfomation[1]?.STREndTime?.slice(
								10,
							)}`;
							startTimeSecondFormate = `${secondDateFormate.slice(
								0,
								11,
							)}${getScheduleSlotInfomation[1]?.STRStartTime.slice(
								11,
							)}:00.0000`;
							endTimeSecondFormate = `${secondDateFormate.slice(
								0,
								11,
							)}${getScheduleSlotInfomation[1]?.STREndTime.slice(11)}:00.0000`;
						}
						setScheduleSlotInformation(
							getScheduleSlotInfomation.map((item, index) => {
								if (index === 1) {
									return {
										...item,
										SlotDate: firstDateFormate || null,
										STRSlotDate: firstDateFormate || null,
										STRStartTime: startTimeFirstFormate || null,
										STREndTime: endTimeFirstFormate || null,
										StartTime: startTimeFirstFormate?.split(' ')[1] || null,
										EndTime: endTimeFirstFormate?.split(' ')[1] || null,
									};
								} else {
									return item;
								}
							}),
						);

						setScheduleSlotDate(
							getScheduleSlotDate.map((item, index) => {
								if (index === 1) {
									return { ...item, slot1: date };
								} else {
									return item;
								}
							}),
						);
					} else if (interviewType === 'reschedule') {
						if (
							getRescheduleSlotInfomation[1]?.STRStartTime &&
							getRescheduleSlotInfomation[1]?.STREndTime
						) {
							startTimeFirstFormate = `${firstDateFormate}${getRescheduleSlotInfomation[1]?.STRStartTime.slice(
								10,
							)}`;
							endTimeFirstFormate = `${firstDateFormate}${getRescheduleSlotInfomation[1]?.STREndTime?.slice(
								10,
							)}`;
							startTimeSecondFormate = `${secondDateFormate.slice(
								0,
								11,
							)}${getRescheduleSlotInfomation[1]?.STRStartTime.slice(
								11,
							)}:00.0000`;
							endTimeSecondFormate = `${secondDateFormate.slice(
								0,
								11,
							)}${getRescheduleSlotInfomation[1]?.STREndTime.slice(
								11,
							)}:00.0000`;
						}
						setRescheduleSlotInformation(
							getRescheduleSlotInfomation.map((item, index) => {
								if (index === 1) {
									return {
										...item,
										SlotDate: firstDateFormate || null,
										STRSlotDate: firstDateFormate || null,
										STRStartTime: startTimeFirstFormate || null,
										STREndTime: endTimeFirstFormate || null,
										StartTime: startTimeFirstFormate?.split(' ')[1] || null,
										EndTime: endTimeFirstFormate?.split(' ')[1] || null,
									};
								} else {
									return item;
								}
							}),
						);

						setRescheduleSlotDate(
							getRescheduleSlotDate.map((item, index) => {
								if (index === 1) {
									return { ...item, slot1: date };
								} else {
									return item;
								}
							}),
						);
					}
					break;
				case 'slot2StartTime':
					if (interviewType === 'schedule') {
						if (
							getScheduleSlotInfomation[1]?.STRSlotDate &&
							getScheduleSlotInfomation[1]?.SlotDate
						) {
							startTimeFirstFormate = `${getScheduleSlotInfomation[1]?.STRSlotDate} ${timeFormate}`;
							startTimeSecondFormate = `${getScheduleSlotInfomation[1]?.SlotDate.slice(
								0,
								11,
							)}${timeFormate}:00.0000`;
						} else {
							startTimeFirstFormate = `${firstDateFormate} ${timeFormate}`;
							startTimeSecondFormate = `${secondDateFormate.slice(
								0,
								11,
							)}${timeFormate}:00.0000`;
						}
						setScheduleSlotInformation(
							getScheduleSlotInfomation.map((item, index) => {
								if (index === 1) {
									return {
										...item,
										StartTime: startTimeFirstFormate?.split(' ')[1] || null,
										STRStartTime: startTimeFirstFormate || null,
									};
								} else {
									return item;
								}
							}),
						);

						setScheduleSlotDate(
							getScheduleSlotDate.map((item, index) => {
								if (index === 1) {
									return { ...item, slot2: date };
								} else {
									return item;
								}
							}),
						);
					} else if (interviewType === 'reschedule') {
						if (
							getRescheduleSlotInfomation[1]?.STRSlotDate &&
							getRescheduleSlotInfomation[1]?.SlotDate
						) {
							startTimeFirstFormate = `${getRescheduleSlotInfomation[1]?.STRSlotDate} ${timeFormate}`;
							startTimeSecondFormate = `${getRescheduleSlotInfomation[1]?.SlotDate.slice(
								0,
								11,
							)}${timeFormate}:00.0000`;
						} else {
							startTimeFirstFormate = `${firstDateFormate} ${timeFormate}`;
							startTimeSecondFormate = `${secondDateFormate.slice(
								0,
								11,
							)}${timeFormate}:00.0000`;
						}
						setRescheduleSlotInformation(
							getRescheduleSlotInfomation.map((item, index) => {
								if (index === 1) {
									return {
										...item,
										StartTime: startTimeFirstFormate?.split(' ')[1] || null,
										STRStartTime: startTimeFirstFormate || null,
									};
								} else {
									return item;
								}
							}),
						);

						setRescheduleSlotDate(
							getRescheduleSlotDate.map((item, index) => {
								if (index === 1) {
									return { ...item, slot2: date };
								} else {
									return item;
								}
							}),
						);
					}
					break;
				case 'slot2EndTime':
					if (interviewType === 'schedule') {
						if (
							getScheduleSlotInfomation[1]?.STRSlotDate &&
							getScheduleSlotInfomation[1]?.SlotDate
						) {
							endTimeFirstFormate = `${getScheduleSlotInfomation[1]?.STRSlotDate} ${timeFormate}`;
							endTimeSecondFormate = `${getScheduleSlotInfomation[1]?.SlotDate.slice(
								0,
								11,
							)}${timeFormate}:00.0000`;
						} else {
							endTimeFirstFormate = `${firstDateFormate} ${timeFormate}`;
							endTimeSecondFormate = `${secondDateFormate.slice(
								0,
								11,
							)}${timeFormate}:00.0000`;
						}

						setScheduleSlotInformation(
							getScheduleSlotInfomation.map((item, index) => {
								if (index === 1) {
									return {
										...item,
										EndTime: endTimeFirstFormate?.split(' ')[1] || null,
										STREndTime: endTimeFirstFormate || null,
									};
								} else {
									return item;
								}
							}),
						);
						setScheduleSlotDate(
							getScheduleSlotDate.map((item, index) => {
								if (index === 1) {
									return { ...item, slot3: date };
								} else {
									return item;
								}
							}),
						);
					} else if (interviewType === 'reschedule') {
						if (
							getRescheduleSlotInfomation[1]?.STRSlotDate &&
							getRescheduleSlotInfomation[1]?.SlotDate
						) {
							endTimeFirstFormate = `${getRescheduleSlotInfomation[1]?.STRSlotDate} ${timeFormate}`;
							endTimeSecondFormate = `${getRescheduleSlotInfomation[1]?.SlotDate.slice(
								0,
								11,
							)}${timeFormate}:00.0000`;
						} else {
							endTimeFirstFormate = `${firstDateFormate} ${timeFormate}`;
							endTimeSecondFormate = `${secondDateFormate.slice(
								0,
								11,
							)}${timeFormate}:00.0000`;
						}
						setRescheduleSlotInformation(
							getRescheduleSlotInfomation.map((item, index) => {
								if (index === 1) {
									return {
										...item,
										EndTime: endTimeFirstFormate?.split(' ')[1] || null,
										STREndTime: endTimeFirstFormate || null,
									};
								} else {
									return item;
								}
							}),
						);

						setRescheduleSlotDate(
							getRescheduleSlotDate.map((item, index) => {
								if (index === 1) {
									return { ...item, slot3: date };
								} else {
									return item;
								}
							}),
						);
					}
					break;

				case 'slot3Date':
					if (interviewType === 'schedule') {
						if (
							getScheduleSlotInfomation[2]?.STRStartTime &&
							getScheduleSlotInfomation[2]?.STREndTime
						) {
							startTimeFirstFormate = `${firstDateFormate}${getScheduleSlotInfomation[2]?.STRStartTime.slice(
								10,
							)}`;
							endTimeFirstFormate = `${firstDateFormate}${getScheduleSlotInfomation[2]?.STREndTime?.slice(
								10,
							)}`;
							startTimeSecondFormate = `${secondDateFormate.slice(
								0,
								11,
							)}${getScheduleSlotInfomation[2]?.STRStartTime.slice(
								11,
							)}:00.0000`;
							endTimeSecondFormate = `${secondDateFormate.slice(
								0,
								11,
							)}${getScheduleSlotInfomation[2]?.STREndTime.slice(11)}:00.0000`;
						}
						setScheduleSlotInformation(
							getScheduleSlotInfomation.map((item, index) => {
								if (index === 2) {
									return {
										...item,
										SlotDate: firstDateFormate || null,
										STRSlotDate: firstDateFormate || null,
										STRStartTime: startTimeFirstFormate || null,
										STREndTime: endTimeFirstFormate || null,
										StartTime: startTimeFirstFormate?.split(' ')[1] || null,
										EndTime: endTimeFirstFormate?.split(' ')[1] || null,
									};
								} else {
									return item;
								}
							}),
						);

						setScheduleSlotDate(
							getScheduleSlotDate.map((item, index) => {
								if (index === 2) {
									return { ...item, slot1: date };
								} else {
									return item;
								}
							}),
						);
					} else if (interviewType === 'reschedule') {
						if (
							getRescheduleSlotInfomation[2]?.STRStartTime &&
							getRescheduleSlotInfomation[2]?.STREndTime
						) {
							startTimeFirstFormate = `${firstDateFormate}${getRescheduleSlotInfomation[2]?.STRStartTime.slice(
								10,
							)}`;
							endTimeFirstFormate = `${firstDateFormate}${getRescheduleSlotInfomation[2]?.STREndTime?.slice(
								10,
							)}`;
							startTimeSecondFormate = `${secondDateFormate.slice(
								0,
								11,
							)}${getRescheduleSlotInfomation[2]?.STRStartTime.slice(
								11,
							)}:00.0000`;
							endTimeSecondFormate = `${secondDateFormate.slice(
								0,
								11,
							)}${getRescheduleSlotInfomation[2]?.STREndTime.slice(
								11,
							)}:00.0000`;
						}
						setRescheduleSlotInformation(
							getRescheduleSlotInfomation.map((item, index) => {
								if (index === 2) {
									return {
										...item,
										SlotDate: firstDateFormate || null,
										STRSlotDate: firstDateFormate || null,
										STRStartTime: startTimeFirstFormate || null,
										STREndTime: endTimeFirstFormate || null,
										StartTime: startTimeFirstFormate?.split(' ')[1] || null,
										EndTime: endTimeFirstFormate?.split(' ')[1] || null,
									};
								} else {
									return item;
								}
							}),
						);

						setRescheduleSlotDate(
							getRescheduleSlotDate.map((item, index) => {
								if (index === 2) {
									return { ...item, slot1: date };
								} else {
									return item;
								}
							}),
						);
					}
					break;
				case 'slot3StartTime':
					if (interviewType === 'schedule') {
						if (
							getScheduleSlotInfomation[2]?.STRSlotDate &&
							getScheduleSlotInfomation[2]?.SlotDate
						) {
							startTimeFirstFormate = `${getScheduleSlotInfomation[2]?.STRSlotDate} ${timeFormate}`;
							startTimeSecondFormate = `${getScheduleSlotInfomation[2]?.SlotDate.slice(
								0,
								11,
							)}${timeFormate}:00.0000`;
						} else {
							startTimeFirstFormate = `${firstDateFormate} ${timeFormate}`;
							startTimeSecondFormate = `${secondDateFormate.slice(
								0,
								11,
							)}${timeFormate}:00.0000`;
						}
						setScheduleSlotInformation(
							getScheduleSlotInfomation.map((item, index) => {
								if (index === 2) {
									return {
										...item,
										StartTime: startTimeFirstFormate?.split(' ')[1] || null,
										STRStartTime: startTimeFirstFormate || null,
									};
								} else {
									return item;
								}
							}),
						);

						setScheduleSlotDate(
							getScheduleSlotDate.map((item, index) => {
								if (index === 2) {
									return { ...item, slot2: date };
								} else {
									return item;
								}
							}),
						);
					} else if (interviewType === 'reschedule') {
						if (
							getRescheduleSlotInfomation[2]?.STRSlotDate &&
							getRescheduleSlotInfomation[2]?.SlotDate
						) {
							startTimeFirstFormate = `${getRescheduleSlotInfomation[2]?.STRSlotDate} ${timeFormate}`;
							startTimeSecondFormate = `${getRescheduleSlotInfomation[2]?.SlotDate.slice(
								0,
								11,
							)}${timeFormate}:00.0000`;
						} else {
							startTimeFirstFormate = `${firstDateFormate} ${timeFormate}`;
							startTimeSecondFormate = `${secondDateFormate.slice(
								0,
								11,
							)}${timeFormate}:00.0000`;
						}
						setRescheduleSlotInformation(
							getRescheduleSlotInfomation.map((item, index) => {
								if (index === 2) {
									return {
										...item,
										StartTime: startTimeFirstFormate?.split(' ')[1] || null,
										STRStartTime: startTimeFirstFormate || null,
									};
								} else {
									return item;
								}
							}),
						);

						setRescheduleSlotDate(
							getRescheduleSlotDate.map((item, index) => {
								if (index === 2) {
									return { ...item, slot2: date };
								} else {
									return item;
								}
							}),
						);
					}
					break;
				case 'slot3EndTime':
					if (interviewType === 'schedule') {
						if (
							getScheduleSlotInfomation[2]?.STRSlotDate &&
							getScheduleSlotInfomation[2]?.SlotDate
						) {
							endTimeFirstFormate = `${getScheduleSlotInfomation[2]?.STRSlotDate} ${timeFormate}`;
							endTimeSecondFormate = `${getScheduleSlotInfomation[2]?.SlotDate.slice(
								0,
								11,
							)}${timeFormate}:00.0000`;
						} else {
							endTimeFirstFormate = `${firstDateFormate} ${timeFormate}`;
							endTimeSecondFormate = `${secondDateFormate.slice(
								0,
								11,
							)}${timeFormate}:00.0000`;
						}
						setScheduleSlotInformation(
							getScheduleSlotInfomation.map((item, index) => {
								if (index === 2) {
									return {
										...item,
										EndTime: endTimeFirstFormate?.split(' ')[1] || null,
										STREndTime: endTimeFirstFormate || null,
									};
								} else {
									return item;
								}
							}),
						);
						setScheduleSlotDate(
							getScheduleSlotDate.map((item, index) => {
								if (index === 2) {
									return { ...item, slot3: date };
								} else {
									return item;
								}
							}),
						);
					} else if (interviewType === 'reschedule') {
						if (
							getRescheduleSlotInfomation[2]?.STRSlotDate &&
							getRescheduleSlotInfomation[2]?.SlotDate
						) {
							endTimeFirstFormate = `${getRescheduleSlotInfomation[2]?.STRSlotDate} ${timeFormate}`;
							endTimeSecondFormate = `${getRescheduleSlotInfomation[2]?.SlotDate.slice(
								0,
								11,
							)}${timeFormate}:00.0000`;
						} else {
							endTimeFirstFormate = `${firstDateFormate} ${timeFormate}`;
							endTimeSecondFormate = `${secondDateFormate.slice(
								0,
								11,
							)}${timeFormate}:00.0000`;
						}
						setRescheduleSlotInformation(
							getRescheduleSlotInfomation.map((item, index) => {
								if (index === 2) {
									return {
										...item,
										EndTime: endTimeFirstFormate?.split(' ')[1] || null,
										STREndTime: endTimeFirstFormate || null,
									};
								} else {
									return item;
								}
							}),
						);

						setRescheduleSlotDate(
							getRescheduleSlotDate.map((item, index) => {
								if (index === 2) {
									return { ...item, slot3: date };
								} else {
									return item;
								}
							}),
						);
					}
					break;
				case 'initial':
					if (interviewType === 'schedule') {
						setScheduleSlotInformation(
							getScheduleSlotInfomation.map((item, index) => {
								return {
									...item,
									SlotDate: null,
									STRSlotDate: null,
									StartTime: null,
									STRStartTime: null,
									EndTime: null,
									STREndTime: null,
								};
							}),
						);
					} else if (interviewType === 'reschedule') {
						setRescheduleSlotInformation(
							getRescheduleSlotInfomation.map((item, index) => {
								return {
									...item,
									SlotDate: null,
									STRSlotDate: null,
									StartTime: null,
									STRStartTime: null,
									EndTime: null,
									STREndTime: null,
								};
							}),
						);
					}
					break;
				default:
					break;
			}
		},
		[
			getRescheduleSlotDate,
			getRescheduleSlotInfomation,
			getScheduleSlotDate,
			getScheduleSlotInfomation,
		],
	);
	const [getBillRateInfo, setBillRateInfo] = useState({});

	const hrCostDetailsHandler = useCallback(async () => {
		const hrCostData = {
			hrID: hrId,
			BillRate: (filterTalentID?.BillRate).slice(
				1,
				(filterTalentID?.BillRate).indexOf('U'),
			).trim(),
			PayRate: (filterTalentID?.PayRate).slice(
				1,
				(filterTalentID?.PayRate).indexOf('U'),
			).trim(),
			ContactPriorityID: filterTalentID?.ContactPriorityID,
		};
		const response = await hiringRequestDAO.getHRCostDetalisRequestDAO(
			hrCostData,
		);
		if (response.responseBody.statusCode === HTTPStatusCode.OK) {
			setBillRateInfo(response?.responseBody?.details);
		}
	}, [
		filterTalentID?.BillRate,
		filterTalentID?.ContactPriorityID,
		filterTalentID?.PayRate,
		hrId,
	]);

	// const updateHRcostHandler = useCallback(async () => {
	// 	const calculateHRData = {
	// 		ContactPriorityID: filterTalentID?.ContactPriorityID,
	// 		Hr_Cost: getBillRateInfo?.hrCost,
	// 		HR_Percentage: watch('nrMarginPercentage'),
	// 		hrID: hrId,
	// 	};
	// 	const response = await hiringRequestDAO.calculateHRCostRequestDAO(
	// 		calculateHRData,
	// 	);
	// 	console.log(response, 'responsefhfgsdfjjh');
	// 	if (response.responseBody.statusCode === HTTPStatusCode.OK) {
	// 		setValue('hrCost', response?.responseBody?.details);
	// 	}
	// }, [
	// 	filterTalentID?.ContactPriorityID,
	// 	getBillRateInfo?.hrCost,
	// 	hrId,
	// 	setValue,
	// 	watch,
	// ]);

	useEffect(() => {
		if (Object.keys(filterTalentID).length > 0 && editBillRate) {
			hrCostDetailsHandler();
		}
	}, [filterTalentID, editBillRate, hrCostDetailsHandler]);

	useEffect(() => {
		if (Object.keys(getBillRateInfo).length > 0 && editBillRate) {
			setValue('nrMarginPercentage', getBillRateInfo?.hR_Percentage);
		}
	}, [getBillRateInfo, editBillRate, setValue]);
	useEffect(() => {
		if (Object.keys(getBillRateInfo).length > 0 && editBillRate) {
			setValue('hrCost', getBillRateInfo?.hrCost);
		}
	}, [getBillRateInfo, editBillRate, setValue]);

	useEffect(() => {
		resetField('talentFees');
	}, [editPayRate, resetField]);

	useEffect(() => {
		if (Object.keys(filterTalentID).length > 0 && editPayRate) {
			setValue(
				'talentFees',
				(filterTalentID?.PayRate).slice(
					1,
					(filterTalentID?.PayRate).indexOf('U'),
				).trim(),
			);
		}
	}, [filterTalentID, editPayRate, setValue]);

	const onProfileLogClickHandler = async (typeID, index, type) => {
		setLogExpanded([]);
		setActiveIndex(index);
		setActiveType(type);
		const profileObj = {
			// talentID: talentID,
			typeID: typeID,
		};
		// const response = await hiringRequestDAO.getTalentProfileSharedDetailDAO(
		// 	profileObj,
		// );
		// setLogExpanded(response && response?.responseBody?.details);
	};

	const getInterviewStatus = useCallback(() => {
		switch (filterTalentID?.InterviewStatus) {
			case 'Feedback Submitted':
				return 7;
			case 'Interview Scheduled':
				return 4;
			case 'Interview in Process':
				return 5;
			case 'Interview Completed':
				return 6;
			case 'Interview Rescheduled':
				return 8;
			case 'Cancelled':
				return 3;
			case 'Slot Given':
				return 1;
			default:
		}
	}, [filterTalentID?.InterviewStatus]);

	const filterTalentCTAs = useMemo(
		() =>
			talentCTA?.filter((item) => item?.TalentID === talentIndex)?.[0] || {},
		[talentCTA, talentIndex],
	);

	useEffect(() => {
		setRescheduleSlotRadio(1);
		setScheduleSlotRadio(1);
	}, []);

	// confirm slot functionality
	useEffect(() => {
		filterTalentID?.MasterId !== undefined &&
			getConfirmSlotDetailsHandler(filterTalentID?.MasterId);
	}, [filterTalentID]);

	const getConfirmSlotDetailsHandler = async (id) => {
		const response = await hiringRequestDAO.getConfirmSlotDetailsDAO(id);

		if (response?.responseBody?.statusCode === HTTPStatusCode.OK) {
			setConfirmSlotDetails(response?.responseBody?.details?.Data);
		}
	};

	useEffect(() => {
		setConfirmSlotRadio(1);
	}, [getConfirmSlotModal]);

	return (
		<div>
			{contextHolder}
			<List
				grid={{ gutter: 16, column: 2 }}
				size="large"
				dataSource={talentDetail && talentDetail}
				pagination={{
					className: TalentListStyle.paginate,
					size: 'small',
					pageSize: 2,
					position: 'top',
					onChange: (page, pageSize) => {
						setPageIndex(pageIndex + 1);
					},
				}}
				renderItem={(item, listIndex) => {
					return (
						<div
							key={item?.Name}
							id={item?.TalentID}>
							<div className={TalentListStyle.talentCard}>
								<div className={TalentListStyle.talentCardBody}>
									<div className={TalentListStyle.partWise}>
										<div
											style={{
												marginBottom: '10px',
												display: 'flex',
											}}>
											<div
												style={{
													display: 'flex',
													justifyContent: 'space-between',
													alignItems: 'center',
												}}>
												<img
													src={
														item?.ProfileURL
															? item?.ProfileURL
															: 'https://www.w3schools.com/howto/img_avatar.png'
													}
													className={TalentListStyle.avatar}
													alt="avatar"
												/>
												<div
													style={{
														position: 'absolute',
														marginLeft: '50px',
														top: '-30px',
													}}>
													{All_Hiring_Request_Utils.GETTALENTSTATUS(
														item?.ProfileStatusCode,
														item?.Status,
													)}
												</div>
												<div
													style={{
														marginLeft: '50px',
														marginTop: '20px',
														fontSize: '.7vw',
													}}>
													<div
														style={{
															textDecoration: 'underline',
															fontWeight: '600',
														}}>
														{item?.Name}
													</div>
													<div>{item?.TalentRole}</div>
												</div>
											</div>
										</div>
										<div style={{ cursor: 'pointer' }}>
											<Dropdown
												trigger={['click']}
												placement="bottom"
												overlay={
													<Menu>
														<Menu.Item
															key={0}
															onClick={() => {
																setProfileLogModal(true); // TODO:-
																setTalentIndex(listIndex);
															}}>
															View Profile Log
														</Menu.Item>
														<Divider
															style={{
																margin: '3px 0',
															}}
														/>
														<Menu.Item key={1}>Remove Profile</Menu.Item>
													</Menu>
												}>
												<BsThreeDots style={{ fontSize: '1.5rem' }} />
											</Dropdown>
										</div>
									</div>

									<div className={TalentListStyle.profileURL}>
										<span>profile URL:</span>&nbsp;&nbsp;
										<span style={{ fontWeight: '500' }}>
											{item?.ATSTalentLiveURL ? (
												<a
													style={{ textDecoration: 'underline' }}
													href={item?.ATSTalentLiveURL}
													target="_blank"
													rel="noreferrer">
													Click here
												</a>
											) : (
												'NA'
											)}
										</span>
									</div>
									<div className={TalentListStyle.experience}>
										<span>Experience:</span>&nbsp;&nbsp;
										<span style={{ fontWeight: '500' }}>
											{_isNull(item?.TotalExpYears)
												? 'NA'
												: item?.TotalExpYears + ' years'}
										</span>
									</div>
									<div className={TalentListStyle.noticePeriod}>
										<span>Notice Period:</span>&nbsp;&nbsp;
										<span style={{ fontWeight: '500' }}>
											{_isNull(item?.NoticePeriod) ? 'NA' : item?.NoticePeriod}
										</span>
									</div>
									<div className={TalentListStyle.agreedShift}>
										<span>Agreed Shift:</span>&nbsp;&nbsp;
										<span style={{ fontWeight: '500' }}>
											{_isNull(item?.TalentTimeZone)
												? 'NA'
												: item?.TalentTimeZone}
										</span>
									</div>
									<div className={TalentListStyle.availability}>
										<span>Preferred Availability:</span>&nbsp;&nbsp;
										<span style={{ fontWeight: '500' }}>
											{_isNull(item?.PreferredAvailability)
												? 'NA'
												: item?.PreferredAvailability}
										</span>
									</div>
									<div className={TalentListStyle.profileSource}>
										<span>Profile Source:</span>&nbsp;&nbsp;
										<span style={{ fontWeight: '500' }}>
											{_isNull(item?.TalentSource) ? 'NA' : item?.TalentSource}
										</span>
									</div>
									<Divider
										style={{
											margin: '10px 0',
											// border: `1px solid var(--uplers-border-color)`,
										}}
									/>
									<div className={TalentListStyle.interviewStatus}>
										<span>Interview Status:</span>&nbsp;&nbsp;
										<span style={{ fontWeight: '500', cursor: 'pointer' }}>
											{item?.InterviewStatus === ''
												? 'NA'
												: item?.InterviewStatus}
										</span>
									</div>
									<Divider
										style={{
											margin: '10px 0',
											// border: `1px solid var(--uplers-border-color)`,
										}}
									/>

									{!hrType ? (
										<>
											<div className={TalentListStyle.payRate}>
												<div>
													<span>Bill Rate:</span>&nbsp;&nbsp;
													<span style={{ fontWeight: '500' }}>
														{_isNull(item?.BillRate) ? 'NA' : item?.BillRate}
													</span>
												</div>
												<span
													onClick={() => {
														// setEDITBRPRModal(true);
														setTalentIndex(item?.TalentID);
														setEditBillRate(true);
													}}
													style={{
														textDecoration: 'underline',
														color: `var(--background-color-ebony)`,
														cursor: 'pointer',
													}}>
													Edit
												</span>
											</div>
											<div className={TalentListStyle.payRate}>
												<div>
													<span onClick={() => setEditPayRate(true)}>
														Pay Rate:
													</span>
													&nbsp;&nbsp;
													<span style={{ fontWeight: '500' }}>
														{_isNull(item?.PayRate) ? 'NA' : item?.PayRate}
													</span>
												</div>
												<span
													onClick={() => {
														setEditPayRate(true);
														setTalentIndex(item?.TalentID);
													}}
													style={{
														textDecoration: 'underline',
														color: `var(--background-color-ebony)`,
														cursor: 'pointer',
													}}>
													Edit
												</span>
											</div>
											<div className={TalentListStyle.nr}>
												<div>
													<span>NR:</span>&nbsp;&nbsp;
													<span style={{ fontWeight: '500' }}>
														{_isNull(item?.NR) ? 'NA' : item?.NR}
													</span>
												</div>
												{/* <span
													style={{
														textDecoration: 'underline',
														color: `var(--background-color-ebony)`,
														cursor: 'pointer',
													}}>
													Edit
												</span> */}
											</div>
										</>
									) : (
										<>
											<div className={TalentListStyle.billRate}>
												<span>DP Amount:</span>&nbsp;&nbsp;
												<span style={{ fontWeight: '500' }}>
													{_isNull(item?.DPAmount) ? 'NA' : item?.DPAmount}
												</span>
											</div>
											<div className={TalentListStyle.payRate}>
												<div>
													<span>DP Percetange:</span>&nbsp;&nbsp;
													<span style={{ fontWeight: '500' }}>
														{_isNull(item?.DPPercentage)
															? 'NA'
															: item?.DPPercentage}
													</span>
												</div>
											</div>
										</>
									)}

									<Divider
										style={{
											margin: '10px 0',
											// border: `1px solid var(--uplers-border-color)`,
										}}
									/>
									<div className={TalentListStyle.interviewSlots}>
										<span>Available Interview Slots:</span>&nbsp;&nbsp;
										<span style={{ fontWeight: '500' }}>
											{inteviewSlotDetails?.[0]?.SlotList?.length === 0 ? (
												'NA'
											) : (
												<Dropdown
													trigger={['click']}
													placement="bottom"
													overlay={
														<Menu>
															{hrUtils
																?.formatInterviewSlots(
																	inteviewSlotDetails[listIndex]?.SlotList,
																)
																?.map((item, index) => {
																	return (
																		<Menu.Item key={index}>
																			{item?.label}a{' '}
																		</Menu.Item>
																	);
																})}
														</Menu>
													}>
													<span>
														<Space>
															{
																hrUtils?.formatInterviewSlots(
																	inteviewSlotDetails[listIndex]?.SlotList,
																)?.[0]?.label
															}
															<DownOutlined />
														</Space>
													</span>
												</Dropdown>
											)}
										</span>
									</div>
									{item?.Slotconfirmed && (
										<div className={TalentListStyle.interviewSlots}>
											<span>Slot Confirmed:</span>&nbsp;&nbsp;
											<span style={{ fontWeight: '500' }}>
												{item?.Slotconfirmed}
											</span>
										</div>
									)}

									{/* <Divider
										style={{
											margin: '10px 0',
											// border: `1px solid var(--uplers-border-color)`,
										}}
									/>
									<div
										style={{
											padding: '2px 0',
											textDecoration: 'underline',
											cursor: 'pointer',
										}}
										onClick={() => {
											// setVersantModal(true);-  //TODO:-
											setTalentIndex(item?.TalentID);
										}}>
										Versant Test Results
									</div>

									<div
										style={{ padding: '2px 0', textDecoration: 'underline' }}>
										Skill Test Results
									</div> */}
									<Divider
										style={{
											margin: '10px 0',
										}}
									/>
									{talentCTA[listIndex]?.cTAInfoList?.length > 0 && (
										<div
											style={{
												position: 'absolute',
												marginTop: '10px',
												textAlign: 'start !important',
											}}>
											<HROperator
												onClickHandler={() => setTalentIndex(item?.TalentID)}
												title={talentCTA?.[listIndex]?.cTAInfoList[0]?.label}
												icon={<AiOutlineDown />}
												backgroundColor={`var(--color-sunlight)`}
												iconBorder={`1px solid var(--color-sunlight)`}
												isDropdown={true}
												listItem={hrUtils.showTalentCTA(filterTalentCTAs)}
												menuAction={(menuItem) => {
													switch (menuItem.key) {
														case TalentOnboardStatus.SCHEDULE_INTERVIEW: {
															setScheduleInterviewModal(true);
															setTalentIndex(item?.TalentID);
															break;
														}
														case TalentOnboardStatus.RESCHEDULE_INTERVIEW: {
															setReScheduleInterviewModal(true);
															setTalentIndex(item?.TalentID);
															break;
														}
														case TalentOnboardStatus.TALENT_ACCEPTANCE: {
															setTalentAcceptance(true);
															setTalentIndex(item?.TalentID);

															break;
														}
														case TalentOnboardStatus.TALENT_STATUS: {
															setTalentStatus(true);
															setTalentIndex(item?.TalentID);
															break;
														}
														case TalentOnboardStatus.INTERVIEW_STATUS: {
															setInterviewStatus(true);
															setTalentIndex(item?.TalentID);
															break;
														}
														case TalentOnboardStatus.UPDATE_CLIENT_ON_BOARD_STATUS: {
															setOnboardClientModal(true);
															setTalentIndex(item?.TalentID);
															break;
														}
														case TalentOnboardStatus.SUBMIT_CLIENT_FEEDBACK: {
															setInterviewFeedback(true);
															setTalentIndex(item?.TalentID);
															break;
														}
														case TalentOnboardStatus.UPDATE_TALENT_ON_BOARD_STATUS: {
															setOnboardTalentModal(true);
															setTalentIndex(item?.TalentID);

															break;
														}
														case TalentOnboardStatus.UPDATE_LEGAL_TALENT_ONBOARD_STATUS: {
															setLegalTalentOnboardModal(true);
															setTalentIndex(item?.TalentID);
															break;
														}
														case TalentOnboardStatus.UPDATE_LEGAL_CLIENT_ONBOARD_STATUS: {
															setLegalClientOnboardModal(true);
															setTalentIndex(item?.TalentID);
															break;
														}
														case TalentOnboardStatus.UPDATE_KICKOFF_ONBOARD_STATUS: {
															setTalentKickOffModal(true);
															setTalentIndex(item?.TalentID);
															break;
														}
														case TalentOnboardStatus.REPLACE_TALENT: {
															setReplaceTalentModal(true);
															setTalentIndex(item?.TalentID);
															break;
														}
														case TalentOnboardStatus.CONFIRM_SLOT: {
															setConfirmSlotModal(true);
															setTalentIndex(item?.TalentID);
															break;
														}
														default:
															break;
													}
												}}
											/>
										</div>
									)}
								</div>
							</div>
						</div>
					);
				}}
			/>
			{/** ============ MODAL FOR PROFILE LOG ================ */}
			<Modal
				width="864px"
				centered
				footer={null}
				open={showProfileLogModal}
				// onOk={() => setVersantModal(false)}
				onCancel={() => setProfileLogModal(false)}>
				<h1>Profile Log</h1>

				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						marginTop: '50px',
					}}>
					<div
						style={{
							display: 'flex',
							justifyContent: 'start',
							alignItems: 'center',
							gap: '16px',
							flexWrap: 'wrap',
						}}>
						<div
							style={{
								borderRadius: '8px',
								border: `1px solid var(--uplers-border-color)`,
								padding: '10px 30px',
							}}>
							<span>Name: </span>
							<span
								style={{
									fontWeight: 500,
									textDecoration: 'underline',
								}}>
								{filterTalentID?.Name}
							</span>
						</div>
						<div
							style={{
								borderRadius: '8px',
								border: `1px solid var(--uplers-border-color)`,
								padding: '10px 30px',
							}}>
							<span>Role:</span>
							<span
								style={{
									fontWeight: 500,
								}}>
								{filterTalentID?.TalentRole}
							</span>
						</div>
					</div>
					<div
						style={{
							padding: '1px 10px',
							borderRadius: '8px',
							backgroundColor: `var(--uplers-grey)`,
						}}>
						<ExportSVG />
					</div>
				</div>
				<Divider />
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}>
					<div className={TalentListStyle.profileDataContainer}>
						{profileData?.map((item, index) => {
							return (
								<div
									style={{
										backgroundColor: index === activeIndex && '#F5F5F5',
										border:
											index === activeIndex &&
											`1px solid ${profileData[activeIndex]?.activeColor}`,
									}}
									onClick={() =>
										onProfileLogClickHandler(item?.typeID, index, item?.typeID)
									}
									key={item.id}
									className={TalentListStyle.profileSets}>
									<span className={TalentListStyle.scoreValue}>
										{item?.score}
									</span>
									&nbsp;
									{item?.label}
								</div>
							);
						})}
					</div>
				</div>
			</Modal>
			{/** ============ MODAL FOR VERSANT SCORE ================ */}
			<Modal
				width="864px"
				centered
				footer={null}
				open={showVersantModal}
				// onOk={() => setVersantModal(false)}
				onCancel={() => setVersantModal(false)}>
				<h1>Versant Test Results</h1>
				<div
					style={{
						// border: '1px solid red',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						marginTop: '50px',
					}}>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							width: '60%',
							flexWrap: 'wrap',
						}}>
						<div
							style={{
								borderRadius: '8px',
								border: `1px solid var(--uplers-border-color)`,
								padding: '10px 30px',
							}}>
							<span>Name: </span>
							<span
								style={{
									fontWeight: 500,
									textDecoration: 'underline',
								}}>
								{filterTalentID?.Name}
							</span>
						</div>
						<div
							style={{
								borderRadius: '8px',
								border: `1px solid var(--uplers-border-color)`,
								padding: '10px 30px',
							}}>
							<span>Date of Test:</span>
							<span
								style={{
									fontWeight: 500,
								}}>
								10/09/2022
							</span>
						</div>
					</div>
					<div
						style={{
							padding: '1px 10px',
							borderRadius: '8px',
							backgroundColor: `var(--uplers-grey)`,
						}}>
						<ExportSVG />
					</div>
				</div>
				<Divider />
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}>
					<div style={{ width: '50%' }}>
						<div
							style={{
								fontWeight: '500',
								fontSize: '18px',
								textAlign: 'center',
							}}>
							Overall GSE Score
						</div>
					</div>
					<div></div>
				</div>
			</Modal>
			{/** ============ MODAL FOR RESCHEDULING INTERVIEW ================ */}
			{showReScheduleInterviewModal && (
				<Modal
					transitionName=""
					width="1000px"
					centered
					footer={null}
					open={showReScheduleInterviewModal}
					// onOk={() => setVersantModal(false)}
					onCancel={() => setReScheduleInterviewModal(false)}>
					<InterviewReschedule
						callAPI={callAPI}
						closeModal={() => setReScheduleInterviewModal(false)}
						talentName={filterTalentID?.Name}
						hrId={hrId}
						talentInfo={filterTalentID}
						hiringRequestNumber={hiringRequestNumber}
						reScheduleTimezone={reScheduleTimezone}
						setRescheduleTimezone={setRescheduleTimezone}
						getRescheduleSlotDate={getRescheduleSlotDate}
						setRescheduleSlotDate={setRescheduleSlotDate}
						getRescheduleSlotInfomation={getRescheduleSlotInfomation}
						setRescheduleSlotInformation={setRescheduleSlotInformation}
						reScheduleRadio={reScheduleRadio}
						setRescheduleRadio={setRescheduleRadio}
						reScheduleSlotRadio={reScheduleSlotRadio}
						setRescheduleSlotRadio={setRescheduleSlotRadio}
						getSlotInformationHandler={getSlotInformationHandler}
						getInterviewStatus={getInterviewStatus}
					/>
				</Modal>
			)}
			{/** ============ MODAL FOR SCHEDULING INTERVIEW ================ */}
			{showScheduleInterviewModal && (
				<Modal
					transitionName=""
					width="1000px"
					centered
					footer={null}
					open={showScheduleInterviewModal}
					// onOk={() => setVersantModal(false)}
					onCancel={() => setScheduleInterviewModal(false)}>
					<InterviewSchedule
						callAPI={callAPI}
						talentName={filterTalentID?.Name}
						talentInfo={filterTalentID}
						hrId={hrId}
						closeModal={() => setScheduleInterviewModal(false)}
						hiringRequestNumber={hiringRequestNumber}
						scheduleTimezone={scheduleTimezone}
						setScheduleTimezone={setScheduleTimezone}
						getScheduleSlotDate={getScheduleSlotDate}
						setScheduleSlotDate={setScheduleSlotDate}
						getScheduleSlotInfomation={getScheduleSlotInfomation}
						setScheduleSlotInformation={setScheduleSlotInformation}
						scheduleSlotRadio={scheduleSlotRadio}
						setScheduleSlotRadio={setScheduleSlotRadio}
						getSlotInformationHandler={getSlotInformationHandler}
						getInterviewStatus={getInterviewStatus}
					/>
				</Modal>
			)}
			{/** ============ MODAL FOR INTERVIEW FEEDBACK STATUS ================ */}
			<Modal
				transitionName=""
				width="1000px"
				centered
				footer={false}
				open={interviewFeedback}
				onCancel={() => setInterviewFeedback(false)}>
				<InterviewFeedback
					hrId={hrId}
					clientDetail={clientDetail}
					callAPI={callAPI}
					talentInfo={filterTalentID}
					talentName={filterTalentID?.Name}
					HRStatusCode={HRStatusCode}
					hiringRequestNumber={hiringRequestNumber}
					starMarkedStatusCode={starMarkedStatusCode}
					hrStatus={hrStatus}
					closeModal={() => setInterviewFeedback(false)}
				/>
			</Modal>
			{/** ============ MODAL FOR TALENT ACCEPTANCE ================ */}
			<Modal
				transitionName=""
				width="1256px"
				centered
				footer={null}
				open={showTalentAcceptance}
				// onOk={() => setVersantModal(false)}
				onCancel={() => setTalentAcceptance(false)}>
				<TalentAcceptance
					clientDetail={clientDetail}
					callAPI={callAPI}
					talentInfo={filterTalentID}
					talentName={filterTalentID?.Name}
					HRStatusCode={HRStatusCode}
					hiringRequestNumber={hiringRequestNumber}
					starMarkedStatusCode={starMarkedStatusCode}
					hrStatus={hrStatus}
					closeModal={() => setTalentAcceptance(false)}
				/>
			</Modal>
			{/** ============ MODAL FOR TALENT STATUS ================ */}
			<Modal
				transitionName=""
				width="1256px"
				centered
				footer={null}
				open={showTalentStatus}
				onCancel={() => setTalentStatus(false)}>
				<TalentStatus
					talentInfo={filterTalentID}
					hrId={hrId}
					callAPI={callAPI}
					closeModal={() => setTalentStatus(false)}
				/>
			</Modal>
			{/** ============ MODAL FOR INTERVIEW STATUS ================ */}
			<Modal
				transitionName=""
				width="1256px"
				centered
				footer={null}
				open={showInterviewStatus}
				// onOk={() => setVersantModal(false)}
				onCancel={() => setInterviewStatus(false)}>
				<InterviewStatus
					hrId={hrId}
					talentInfo={filterTalentID}
					callAPI={callAPI}
					closeModal={() => setInterviewStatus(false)}
				/>
			</Modal>
			{/** ============ MODAL FOR UPDATE CLIENT ONBOARD STATUS ================ */}
			<Modal
				transitionName=""
				width="1256px"
				centered
				footer={null}
				open={updateOnboardClientModal}
				onCancel={() => setOnboardClientModal(false)}>
				<UpdateClientOnBoardStatus
					talentInfo={filterTalentID}
					hrId={hrId}
					callAPI={callAPI}
					closeModal={() => setOnboardClientModal(false)}
				/>
			</Modal>
			{/** ============ MODAL FOR UPDATE TALENT ONBOARD STATUS ================ */}
			<Modal
				transitionName=""
				width="1256px"
				centered
				footer={null}
				open={updateOnboardTalentModal}
				onCancel={() => setOnboardTalentModal(false)}>
				<UpdateTalentOnboardStatus
					talentInfo={filterTalentID}
					hrId={hrId}
					callAPI={callAPI}
					closeModal={() => setOnboardTalentModal(false)}
				/>
			</Modal>
			{/** ============ MODAL FOR UPDATE LEGAL CLIENT ONBOARD STATUS ================ */}
			<Modal
				transitionName=""
				width="1256px"
				centered
				footer={null}
				open={updateLegalClientOnboardModal}
				onCancel={() => setLegalClientOnboardModal(false)}>
				<UpdateLegalClientOnboardStatus
					talentInfo={filterTalentID}
					hrId={hrId}
					callAPI={callAPI}
					closeModal={() => setLegalClientOnboardModal(false)}
				/>
			</Modal>
			{/** ============ MODAL FOR UPDATE LEGAL TALENT ONBOARD STATUS ================ */}
			{updateLegalTalentOnboardModal && (
				<Modal
					transitionName=""
					width="1256px"
					centered
					footer={null}
					open={updateLegalTalentOnboardModal}
					onCancel={() => setLegalTalentOnboardModal(false)}>
					<UpdateLegalTalentOnboardStatus
						talentInfo={filterTalentID}
						hrId={hrId}
						callAPI={callAPI}
						closeModal={() => setLegalTalentOnboardModal(false)}
					/>
				</Modal>
			)}

			{/** ============ MODAL FOR EDIT BILL RATE ================ */}

			{editBillRate && (
				<Modal
					transitionName=""
					width="700px"
					centered
					footer={null}
					open={editBillRate}
					className="statusModalWrap"
					onCancel={() => setEditBillRate(false)}>
					<EditBillRate
						callAPI={callAPI}
						hrId={hrId}
						filterTalentID={filterTalentID}
						getBillRateInfo={getBillRateInfo}
						handleSubmit={handleSubmit}
						onCancel={() => setEditBillRate(false)}
						register={register}
						errors={errors}
						setHRapiCall={setHRapiCall}
						callHRapi={callHRapi}
						talentInfo={filterTalentID}
					/>
				</Modal>
			)}
			{/** ============ MODAL FOR EDIT PAY RATE ================ */}
			{editPayRate && (
				<Modal
					transitionName=""
					width="700px"
					centered
					footer={null}
					open={editPayRate}
					className="statusModalWrap"
					onCancel={() => setEditPayRate(false)}>
					<EditPayRate
						talentInfo={filterTalentID}
						onCancel={() => setEditPayRate(false)}
						handleSubmit={handleSubmit}
						register={register}
						errors={errors}
						setHRapiCall={setHRapiCall}
						callHRapi={callHRapi}
					/>
				</Modal>
			)}

			{/** ============ MODAL FOR UPDATE LEGAL TALENT ONBOARD STATUS ================ */}
			<Modal
				transitionName=""
				width="930px"
				centered
				footer={null}
				open={updateTalentKickOffModal}
				className="statusModalWrap"
				onCancel={() => setTalentKickOffModal(false)}>
				<UpdateKickOffOnboardStatus
					talentInfo={filterTalentID}
					hrId={hrId}
					callAPI={callAPI}
					closeModal={() => setTalentKickOffModal(false)}
				/>
			</Modal>
			{/** ============ MODAL FOR TALENT REPLACEMENT ================ */}
			<Modal
				transitionName=""
				width="1256px"
				centered
				footer={null}
				open={replaceTalentModal}
				onCancel={() => setReplaceTalentModal(false)}>
				<EngagementReplaceTalent
					talentInfo={filterTalentID}
					hrId={hrId}
					callAPI={callAPI}
					closeModal={() => setReplaceTalentModal(false)}
					isEngagement={false}
				/>
			</Modal>

			{/** ============ MODAL FOR Confirm slot modal ================ */}
			<Modal
				transitionName=""
				width="1000px"
				centered
				footer={null}
				open={getConfirmSlotModal}
				className="cloneHRModal"
				onCancel={() => setConfirmSlotModal(false)}>
				<ConfirmSlotModal
					getConfirmSlotDetails={getConfirmSlotDetails}
					onCancel={() => setConfirmSlotModal(false)}
					confirmSlotRadio={confirmSlotRadio}
					setConfirmSlotRadio={setConfirmSlotRadio}
					talentInfo={filterTalentID}
					hrId={hrId}
					getDateNewFormate={getDateNewFormate}
					setDateNewFormate={setDateNewFormate}
					hiringRequestNumber={hiringRequestNumber}
					setHRapiCall={setHRapiCall}
					callHRapi={callHRapi}
				/>
			</Modal>
		</div>
	);
};
export default TalentList;
