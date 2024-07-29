import { Dropdown, Menu, Divider, List, Modal, message, Space } from 'antd';
import { BsThreeDots } from 'react-icons/bs';
import { All_Hiring_Request_Utils } from 'shared/utils/all_hiring_request_util';
import TalentListStyle from './talentList.module.css';
import HROperator from '../hroperator/hroperator';
import { AiOutlineDown } from 'react-icons/ai';
import { useForm } from 'react-hook-form';
import { Fragment, useEffect, useState, useCallback, useMemo } from 'react';
import { ReactComponent as ExportSVG } from 'assets/svg/export.svg';
import { ReactComponent as NotesIcon } from 'assets/svg/notesIcon.svg';
import { ReactComponent as EditIcon } from 'assets/svg/editIcon.svg';
import { ReactComponent as DeleteIcon } from 'assets/svg/deleteIcon.svg';
import { ReactComponent as InfoCircleIcon } from 'assets/svg/infoCircleIcon.svg';
import { useNavigate } from 'react-router-dom'

import {
	InterviewFeedbackStatus,
	TalentOnboardStatus,
} from 'constants/application';
import InterviewReschedule from 'modules/interview/screens/interviewReschedule/interviewReschedule';
import InterviewSchedule from 'modules/interview/screens/interviewSchedule/interviewSchedule';
import InterviewFeedback from 'modules/interview/screens/interviewFeedback/interviewFeedback';
import { hrUtils } from 'modules/hiring request/hrUtils';
import { engagementRequestDAO } from 'core/engagement/engagementDAO';
import UTSRoutes from 'constants/routes';
import {
	_isNull,
	addHours,
	budgetStringToCommaSeprated,
	defaultEndTime,
	defaultStartTime,
	getInterviewSlotInfo,
	getSlots,
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
import ProfileRejectedModal from '../profileRejected/profileRejected';
import ConfirmSlotModal from '../confirmSlot/confirmSlotModal';
import FeedbackResponse from 'modules/interview/components/feedbackResponse/feedbackResponse';
import EngagementOnboard from 'modules/engagement/screens/engagementOnboard/engagementOnboard';

import ProfileLogDetails from '../profileLogDetails/profileLog';
import TalentInterviewStatus from '../talentInterviewStatus/talentInterviewStatus';
import EditDPRate from '../editDP/editDP';
import PreOnboardingTabModal from '../preOnboardingModals/preOnboardingTabModal';
import { MasterDAO } from 'core/master/masterDAO';
import AddNotes from './addNotes';
import AllNotes from './allNotes';
import ViewNotes from './viewNotes';
import EditNotes from './editNotes';
import moment from 'moment';
import { InterviewDAO } from 'core/interview/interviewDAO';

const ROW_SIZE = 2; // CONSTANT FOR NUMBER OF TALENTS IN A ROW

const TalentList = ({
	talentCTA,
	talentDetail,
	miscData,
	callAPI,
	setLoading,
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
	talentID,
	IsTransparentPricing,
	DynamicSalaryInfo,
	apiData
}) => {
	const navigate = useNavigate()
	const EmpID = localStorage.getItem('EmployeeID')
	const [scheduleAnotherRoundInterview, setScheduleAnotherRoundInterview] =
		useState(false);
	// console.log(scheduleAnotherRoundInterview, '-scheduleAnotherRoundInterview');
	const [isShowFeedback, setShowFeedback] = useState(false);
	const [isAnotherRound, setAnotherRound] = useState(false);
	const [activeIndex, setActiveIndex] = useState(-1);
	const [activeType, setActiveType] = useState(null);
	const [logExpanded, setLogExpanded] = useState(null);
	const [showVersantModal, setVersantModal] = useState(false);
	const [interviewFeedback, setInterviewFeedback] = useState(false);
	const [isEditFeedback, setEditFeedback] = useState(false);
	const [showInterviewStatus, setInterviewStatus] = useState(false);
	const profileData = allHRConfig.profileLogConfig();
	const [showReScheduleInterviewModal, setReScheduleInterviewModal] =
		useState(false);
	const [showTalentAcceptance, setTalentAcceptance] = useState(false);
	const [showProfileLogModal, setProfileLogModal] = useState(false);
	const [showTalentStatus, setTalentStatus] = useState(false);
	const [updateOnboardClientModal, setOnboardClientModal] = useState(false);
	const [updateOnboardTalentModal, setOnboardTalentModal] = useState(false);
	const [profileLog, setProfileLog] = useState([]);
	const [updateLegalClientOnboardModal, setLegalClientOnboardModal] =
		useState(false);
	const [updateLegalTalentOnboardModal, setLegalTalentOnboardModal] =
		useState(false);
	const [updateTalentKickOffModal, setTalentKickOffModal] = useState(false);

	const [replaceTalentModal, setReplaceTalentModal] = useState(false);
	const [messageAPI, contextHolder] = message.useMessage();
	const [talentIndex, setTalentIndex] = useState(0);
	const [ActionKey,setActionKey] = useState("")
	//schedule modal state
	const [showScheduleInterviewModal, setScheduleInterviewModal] =
		useState(false);
	const [scheduleTimezone, setScheduleTimezone] = useState([]);
	const [editBillRate, setEditBillRate] = useState(false);

	const [profileRejectedModal, setProfileRejectedModal] = useState(false);

	const [editPayRate, setEditPayRate] = useState(false);

	const [editDPRate, setEditDPRate] = useState(false);

	const [getScheduleSlotDate, setScheduleSlotDate] = useState([
		{
			slot1: getSlots?.()?.slot1,
			slot2: defaultStartTime(),
			slot3: defaultEndTime(),
		},
		{
			slot1: getSlots()?.slot2,
			slot2: defaultStartTime(),
			slot3: defaultEndTime(),
		},
		{
			slot1: getSlots?.()?.slot3,
			slot2: defaultStartTime(),
			slot3: defaultEndTime(),
		},
	]);
	// const [getScheduleSlotInfomation, setScheduleSlotInformation] = useState([
	// 	{
	// 		SlotID: 1,
	// 		...getInterviewSlotInfo(
	// 			getSlots?.()?.slot1,
	// 			defaultStartTime(),
	// 			defaultEndTime(),
	// 		),
	// 		iD_As_ShortListedID: '',
	// 	},
	// 	{
	// 		SlotID: 2,
	// 		...getInterviewSlotInfo(
	// 			getSlots?.()?.slot2,
	// 			defaultStartTime(),
	// 			defaultEndTime(),
	// 		),
	// 		iD_As_ShortListedID: '',
	// 	},
	// 	{
	// 		SlotID: 3,
	// 		...getInterviewSlotInfo(
	// 			getSlots?.()?.slot3,
	// 			defaultStartTime(),
	// 			defaultEndTime(),
	// 		),
	// 		iD_As_ShortListedID: '',
	// 	},
	// ]);
	const [scheduleSlotRadio, setScheduleSlotRadio] = useState(1);
	//reschedule modal state
	const [reScheduleTimezone, setRescheduleTimezone] = useState([]);
	const [getRescheduleSlotDate, setRescheduleSlotDate] = useState([
		{
			slot1: getSlots?.()?.slot1,
			slot2: defaultStartTime(),
			slot3: defaultEndTime(),
		},
		{
			slot1: getSlots()?.slot2,
			slot2: defaultStartTime(),
			slot3: defaultEndTime(),
		},

		{
			slot1: getSlots?.()?.slot3,
			slot2: defaultStartTime(),
			slot3: defaultEndTime(),
		},
	]);

	const [reScheduleRadio, setRescheduleRadio] = useState(1);
	const [reScheduleSlotRadio, setRescheduleSlotRadio] = useState(1);
	const [pageIndex, setPageIndex] = useState(0);
	const [getConfirmSlotModal, setConfirmSlotModal] = useState(false);
	const [getConfirmSlotDetails, setConfirmSlotDetails] = useState({});
	const [confirmSlotRadio, setConfirmSlotRadio] = useState(1);
	const [getDateNewFormate, setDateNewFormate] = useState([]);
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [DPData, setDPData] = useState({})
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

	const [getBillRateInfo, setBillRateInfo] = useState({});

	const [showengagementOnboard, setShowEngagementOnboard] = useState(false);
	const [getHRAndEngagementId, setHRAndEngagementId] = useState({
		hrNumber: '',
		engagementID: '',
		talentName: '',
		onBoardId: '',
		hrId: '',
	});
	const [getOnboardFormDetails, setOnboardFormDetails] = useState({});

	const getOnboardingForm = async (getOnboardID) => {
		setOnboardFormDetails({});
		// setLoading(true);
		const response = await engagementRequestDAO.viewOnboardDetailsDAO(
			getOnboardID,
		);
		if (response?.statusCode === HTTPStatusCode.OK) {
			setOnboardFormDetails(response?.responseBody?.details);
			// setLoading(false);
		} else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
			return navigate(UTSRoutes.LOGINROUTE);
		} else if (response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
			// setLoading(false);
			return navigate(UTSRoutes.SOMETHINGWENTWRONG);
		} else {
			return 'NO DATA FOUND';
		}
	};

	useEffect(() => {
		showengagementOnboard &&
			getHRAndEngagementId?.onBoardId &&
			getOnboardingForm(getHRAndEngagementId?.onBoardId);
	}, [showengagementOnboard]);

	const hrCostDetailsHandler = useCallback(async () => {
		// const hrCostData = {
		// 	hrID: hrId,
		// 	BillRate: (filterTalentID?.BillRate).slice(
		// 		1,
		// 		(filterTalentID?.BillRate).indexOf('U'),
		// 	).trim(),
		// 	PayRate: (filterTalentID?.PayRate).slice(
		// 		1,
		// 		(filterTalentID?.PayRate).indexOf('U'),
		// 	).trim(),
		// 	ContactPriorityID: filterTalentID?.ContactPriorityID,
		// };

		const hrCostData = {
			hrID: hrId,
			BillRate: filterTalentID?.BillRate,
			PayRate: filterTalentID?.PayRate,
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
	// console.log("talentList details",	{talentCTA,
	// talentDetail,
	// miscData,
	// callAPI,
	// clientDetail,
	// HRStatusCode,
	// hrId,
	// starMarkedStatusCode,
	// hrStatus,
	// hiringRequestNumber,
	// hrType,
	// setHRapiCall,
	// callHRapi,
	// inteviewSlotDetails,
	// talentID,})
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

	// useEffect(() => {
	// 	if (Object.keys(getBillRateInfo).length > 0 && editBillRate) {
	// 		setValue('nrMarginPercentage', getBillRateInfo?.hR_Percentage);
	// 	}
	// }, [getBillRateInfo, editBillRate, setValue]);
	// useEffect(() => {
	// 	if (Object.keys(getBillRateInfo).length > 0 && editBillRate) {
	// 		setValue('hrCost', getBillRateInfo?.hrCost);
	// 	}
	// }, [getBillRateInfo, editBillRate, setValue]);

	useEffect(() => {
		resetField('talentFees');
	}, [editPayRate, resetField]);

	function extractNumberFromString(inputString) {
		const regex = /\d+/;
		const match = inputString.match(regex);
		if (match && match.length > 0) {
			const number = parseInt(match[0], 10);
			return number;
		}
		return null;
	}

	useEffect(() => {
		if (Object.keys(filterTalentID).length > 0 && editPayRate) {
			setValue(
				'talentFees', filterTalentID?.CTP_TalentCost);
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

	const autoAssignTSC = async (ID) => {
		const response = await engagementRequestDAO.autoUpdateTSCNameDAO(
			ID,
		);
		if (response?.statusCode === HTTPStatusCode.OK) {
			callAPI(hrId)
		} else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
			return navigate(UTSRoutes.LOGINROUTE);
		} else if (response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
			return navigate(UTSRoutes.SOMETHINGWENTWRONG);
		} else {
			return 'NO DATA FOUND';
		}
	}

	const clientFeedbackHandler = useCallback(
		async (reload, talentInfo) => {
			setLoading(true)
	
			const clientFeedback = {
				role: talentInfo?.TalentRole || '',
				talentName: talentInfo?.Name || '',
				talentIDValue: talentInfo?.TalentID,
				contactIDValue: talentInfo?.ContactId,
				hiringRequestID: hrId,
				shortlistedInterviewID: talentInfo?.Shortlisted_InterviewID,
				hdnRadiovalue: reload ? "Hire" : "AnotherRound",
				topSkill: '',
				improvedSkill: '',
				// technicalSkillRating: radioValue2,
				// communicationSkillRating: radioValue3,
				// cognitiveSkillRating: radioValue4,
				messageToTalent: '',
				clientsDecision:  '',
				comments:  '',
				en_Id: '',
				FeedbackId: talentInfo?.ClientFeedbackID || 0,
				// IsClientNotificationSent: isClientNotification,
			};


				const response = await InterviewDAO.updateInterviewFeedbackRequestDAO(
					clientFeedback,
				);
				if (response?.statusCode === HTTPStatusCode.OK) {
					 callAPI(hrId)
				}else{
					 setLoading(false)
				}	
		},
		[
			callAPI,
			hrId,
			isAnotherRound,
			messageAPI,
		],
	);

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
		filterTalentID?.MasterId !== undefined && getConfirmSlotModal &&
			getConfirmSlotDetailsHandler(filterTalentID?.MasterId);
	}, [filterTalentID, getConfirmSlotModal]);

	const getConfirmSlotDetailsHandler = async (id) => {
		const response = await hiringRequestDAO.getConfirmSlotDetailsDAO(id);

		if (response?.responseBody?.statusCode === HTTPStatusCode.OK) {
			setConfirmSlotDetails(response?.responseBody?.details?.Data);
		}
	};

	useEffect(() => {
		setConfirmSlotRadio(1);
	}, [getConfirmSlotModal]);

	// Profile Log

	// For Add / Remove Class
	const [profileShared, setProfileShared] = useState([]);
	const [showProfileShared, setShowProfileShared] = useState(false);
	const [profileRejected, setProfileRejected] = useState([]);
	const [showProfileRejectClass, setShowProfileRejectClass] = useState(false);
	const [feedbackReceivedDetails, setFeedbackReceivedDetails] = useState([]);
	const [feedbackReceivedClass, setFeedBackReceivedClass] = useState(false);

	// start preONBoard states and controlers
	const [showAMModal, setShowAMModal] = useState(false);
	const [AMFlags, setAMFlags] = useState({})
	// end preONBoard states and controlers

	const resumeDownload = async (data) => {
		try {
			const payload = {
				"resumeFile": data.TalentResumeLink
			};
			//   payload.filename = data?.Talent_Resume;
			//   payload.talentId = data?.ATS_TalentID;
			//   payload.hiringRequestId = data?.HiringRequest_ID;
			//   payload.isATSTalentId = true;

			let res = await MasterDAO.downloadResumeDAO(payload);

			const blob = new Blob([res?.responseBody], {
				type: "application/octet-stream",
			});
			const link = document.createElement("a");
			const fileUrl = window.URL.createObjectURL(blob);
			link.href = fileUrl;
			let arr = data?.TalentResumeLink?.split("/");
			let fileName = arr[arr.length - 1];
			link.download = fileName;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (error) {
			console.error("Error downloading file:", error);
		}
	};

	// Talents Notes 

	const fetchTalentsNotes =async (item,setNotes)=>{
		let payload = {
			"HRID": apiData?.HR_Id,
			"ATS_TalentID": item?.ATSTalentID
		}

		let result = await hiringRequestDAO.getTalentNotesDAO(payload)
		if(result.statusCode === 200) {
			setNotes(result.responseBody.notes?.reverse())
		}else{
			setNotes([])
		}
	}

	const deleteNoteDetails = async (note,setAllNotes,item) => {
        let payload = {   
			...note,   
            "IsDeleted":true,
			"CompanyId":apiData?.ClientDetail?.CompanyId,
            "ContactName" : apiData?.ClientDetail?.ClientName,
            "ContactEmail" : apiData?.ClientDetail?.ClientEmail,
            "HiringRequest_ID": apiData?.HR_Id,
            "ATS_TalentID": item?.ATSTalentID,
			"EmployeeID": localStorage.getItem('EmployeeID'),
            "EmployeeName": localStorage.getItem('FullName')
    }
    
    let result = await hiringRequestDAO.saveTalentNotesDAO(payload)

	if(result.statusCode === 200){
		setAllNotes(prev => prev.filter(i => i.Note_Id !== note.Note_Id))
	}
        }

	const TalentNotesCardComp = ({item})=>{
		const [allNotes , setAllNotes] = useState([])
		const [showAddNotesModal, setShowAddNotesModal] = useState(false);
	const [showAllNotesModal, setShowAllNotesModal] = useState(false);
	const [showViewNotesModal, setShowViewNotesModal] = useState(false);
	const [viewNoteData,setViewNoteData] = useState({});
	const [showEditNotesModal, setShowEditNotesModal] = useState(false);
		useEffect(()=>{
			fetchTalentsNotes(item,setAllNotes )
		},[item])

		return (
			<div className={TalentListStyle.addNotesList}>
			<div className={TalentListStyle.addNotesHead}>
				<button type="button" className={TalentListStyle.addNoteBtn} onClick={() => setShowAddNotesModal(true)} title='Add a note for talent'><NotesIcon />Add a note for talent</button>
			</div>

			{allNotes?.slice(0,2).map(note=> {
			return	<div className={TalentListStyle.addNoteItem} key={note.Note_Id}>
				{note.EmployeeID === EmpID && <div className={TalentListStyle.addNoteAction} key={note.Note_Id}>
					<button type="button" className={TalentListStyle.addNoteBtn} title='Edit' onClick={() => {setShowEditNotesModal(true);setViewNoteData(note)}}><EditIcon /></button>
					<button type="button" className={TalentListStyle.addNoteBtn} title='Delete' onClick={()=> {deleteNoteDetails(note, setAllNotes, item)}}><DeleteIcon /></button>
				</div>}
				
				<h4>{note?.EmployeeName}  {moment(note.Added_Date).format('DD MMM YYYY')}   {/* 11:12 AM*/} </h4>
				{note.Notes.length > 100 ? <p>{`${note.Notes.substring(0, 100)}...`}<span className={TalentListStyle.addNoteView} onClick={() => {setShowViewNotesModal(true); setViewNoteData(note)}}>view more</span></p> : <p dangerouslySetInnerHTML={{__html:note.Notes }}></p>}
				{/* <p>{note.Notes.length > 100 ? `${note.Notes.substring(0, 100)}...` : note.Notes} {note.Notes.length > 100 && <span className={TalentListStyle.addNoteView} onClick={() => {setShowViewNotesModal(true); setViewNoteData(note)}}>view more</span>}</p> */}
			</div>
			}) }
			{allNotes.length > 2 && <div className={TalentListStyle.addNoteMore}>
				<button type="button" className={TalentListStyle.addNoteBtn} onClick={() => setShowAllNotesModal(true)} title='Show more notes'>Show more notes</button>
			</div>}
			

			{/** ============ Modal For Add Notes ================ */}
			<Modal
				transitionName=""
				width="930px"
				centered
				footer={null}
				className="commonModalWrap"
				open={showAddNotesModal}
				onCancel={() =>
					setShowAddNotesModal(false)
				}>
				<AddNotes onCancel={()=>setShowAddNotesModal(false)} item={item} apiData={apiData} setAllNotes={setAllNotes}/>
			</Modal>

			{/** ============ Modal For All Notes ================ */}
			<Modal
				transitionName=""
				width="930px"
				centered
				footer={null}
				className="commonModalWrap"
				open={showAllNotesModal}
				onCancel={() =>
					setShowAllNotesModal(false)
				}>
				<AllNotes onClose={()=>setShowAllNotesModal(false)} allNotes={allNotes} onEditNote={(note)=> {
					setShowEditNotesModal(true);setViewNoteData(note)
				}}
				
				deleteNote={(note)=> {
					deleteNoteDetails(note, setAllNotes,item)
				}}/>
			</Modal>
			
			{/** ============ Modal For View Notes ================ */}
			<Modal
				transitionName=""
				width="930px"
				centered
				footer={null}
				className="commonModalWrap"
				open={showViewNotesModal}
				onCancel={() =>
					{setShowViewNotesModal(false);setViewNoteData({})}
				}>
				<ViewNotes viewNoteData={viewNoteData} onClose={()=> {setShowViewNotesModal(false);setViewNoteData({})}} showAll={()=>{setShowAllNotesModal(true);setShowViewNotesModal(false)}}
				onEditNote={(note)=> {
					setShowEditNotesModal(true);setViewNoteData(note);setShowViewNotesModal(false);
				}}
				
				deleteNote={(note)=> {
					deleteNoteDetails(note, setAllNotes,item);setShowViewNotesModal(false);
				}}
				 />
			</Modal>
			
			{/** ============ Modal For Edit Notes ================ */}
			<Modal
				transitionName=""
				width="930px"
				centered
				footer={null}
				className="commonModalWrap"
				open={showEditNotesModal}
				onCancel={() =>
					{setShowEditNotesModal(false);
					setViewNoteData({})}
				}>
				<EditNotes onClose={() =>
					{setShowEditNotesModal(false);
					setViewNoteData({})}}
					viewNoteData={viewNoteData}
					apiData={apiData}
					item={item}
					setAllNotes={setAllNotes}
					/>
			</Modal>
		</div>
		)
	
	}



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
					pageSize: ROW_SIZE,
					position: 'top',
					onChange: (page, pageSize) => {
						setPageIndex(page - 1);
					},
				}}
				renderItem={(item, listIndex) => {
					return (
						<div
							key={item?.Name}
							id={item?.TalentID}>
							<div className={`${TalentListStyle.talentCard} ${TalentListStyle.talentItemCard}`} style={{ minHeight: hrType ? '680px' : '' }}>
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
																setTalentIndex(item?.TalentID);
																// viewProfileInfo();
															}}>
															View Profile Log
														</Menu.Item>
														<Divider
															style={{
																margin: '3px 0',
															}}
														/>
														{/* <Menu.Item key={1}>Remove Profile</Menu.Item> */}
													</Menu>
												}>
												<BsThreeDots style={{ fontSize: '1.5rem' }} />
											</Dropdown>
										</div>
									</div>
			
									<div className={TalentListStyle.profileURL}>
										<span>{item?.NeedToCallAWSBucket ? "Resume:" : "Profile URL:"}</span>&nbsp;&nbsp;
										<span style={{ fontWeight: '500' }}>
											{item?.NeedToCallAWSBucket ? <p className={TalentListStyle.ResumeLink} style={{ textDecoration: 'underline' }} onClick={() => resumeDownload(item)}>Click here</p> : item?.ATSTalentLiveURL ? (
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
			
									<div className={TalentListStyle.EmailID}>
										<span>Talent Email:</span>&nbsp;&nbsp;
										<span style={{ fontWeight: '500' }}>
											{item?.EmailID ? item?.EmailID : "-"}
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
			
									<TalentInterviewStatus
										item={item}
										setProfileRejectedModal={setProfileRejectedModal}
										setShowFeedback={setShowFeedback}
										setTalentIndex={setTalentIndex} />
			
									{/* HTML for Rejection Status Starts  */}
									{/* <div className={TalentListStyle.statusReject}>
										<div className={TalentListStyle.statusRejectInner}>
											<div>Rejection Reason: <span>Other</span></div>
											<span
												onClick={() => {
													setProfileRejectedModal(true);
												}}
												style={{
													textDecoration: 'underline',
													color: `var(--background-color-ebony)`,
													cursor: 'pointer',
												}}>View</span>
										</div>
									</div> */}
									{/* HTML for Rejection Status Ends */}
			
									{/* HTML for Feedback Pending Starts */}
									{/* <div className={TalentListStyle.statusPending}>
										<div className={TalentListStyle.statusPendingInner}>
											<div>Interview Status: <span>Feedback Pending</span></div>
											<span style={{
													textDecoration: 'underline',
													color: `var(--background-color-ebony)`,
													cursor: 'pointer',
												}}>Add</span>
										</div>
									</div> */}
									{/* HTML for Feedback Pending Ends */}
			
									{/* <div className={TalentListStyle.payRate}>
										<div>
											<span>Interview Status:</span>&nbsp;&nbsp;
											<span style={{ fontWeight: '500', cursor: 'pointer' }}>
												{item?.InterviewStatus === ''
													? 'NA'
													: item?.InterviewStatus}
											</span>
										</div>
			
										{(item?.ClientFeedback === InterviewFeedbackStatus.HIRED ||
											item?.ClientFeedback ===
												InterviewFeedbackStatus.REJECTED) && (
											<span
												onClick={() => {
													setTalentIndex(item?.TalentID);
													setShowFeedback(true);
												}}
												style={{
													textDecoration: 'underline',
													color: `var(--background-color-ebony)`,
													cursor: 'pointer',
												}}>
												{' '}
												View
											</span>
										)}
									</div> */}
									<Divider
										style={{
											margin: '10px 0',
											// border: `1px solid var(--uplers-border-color)`,
										}}
									/>
			
									{DynamicSalaryInfo.length > 0 && DynamicSalaryInfo.find(info => info.TalentID === item.TalentID)?.TalentDynamicInfo?.map(info => <div className={TalentListStyle.payRate}>
										<div>
											<span>
												{info.Title}
											</span>
											&nbsp;&nbsp;
											<span style={{ fontWeight: '500' }}>
												{(info?.Title === "Talent's Expected Pay:" || info?.Title === "Talent's Current Pay:" || info?.Title === "Uplers Fees (in Amount):" || info?.Title === "Client's Bill Amount:") ? info.Value ? budgetStringToCommaSeprated(info.Value) : info.Value : info?.Value}
											</span>
										</div>
										{info.IsEditable && <>
											{!hrType ? <>
												{apiData?.JobStatusID !== 2 &&
													(item?.Status === 'Selected' || item?.Status === 'Profile Shared' || item?.Status === 'In Interview' || item?.Status === 'Replacement') &&
													<span
														onClick={() => {
															// setEditPayRate(true);
															// setTalentIndex(item?.TalentID);
															setTalentIndex(item?.TalentID);
															setEditBillRate(true);
														}}
			
														style={{
															textDecoration: 'underline',
															color: `var(--background-color-ebony)`,
															cursor: 'pointer',
														}}>
														Edit
													</span>}
											</> : <>
												{apiData?.JobStatusID !== 2 && <span
													onClick={() => {
														setEditDPRate(true);
														setDPData({ talentId: item?.TalentID, contactPriorityID: item?.ContactPriorityID, allValues: item });
													}}
													style={{
														textDecoration: 'underline',
														color: `var(--background-color-ebony)`,
														cursor: 'pointer',
													}}>
													Edit
												</span>}
											</>}
										</>}
			
									</div>)}
									{/* {!hrType ? (
										<>
											<div className={TalentListStyle.payRate}>
												<div>
													<span>Client's Bill Amount:</span>&nbsp;&nbsp;
													<span style={{ fontWeight: '500' }}>
														{_isNull(item?.BillRate) ? 'NA' : item?.BillRate}
													</span>
												</div>
												{/* {hrStatus !== 'Cancelled' && hrStatus !== 'Completed' &&  hrStatus !== "Lost" &&
												 (item?.Status === 'Selected' || item?.Status === 'Shortlisted' || item?.Status === 'In Interview' || item?.Status === 'Replacement') && 
												<span
												onClick={() => {
													setTalentIndex(item?.TalentID);
													setEditBillRate(true);
												}}
												style={{
													textDecoration: 'underline',
													color: `var(--background-color-ebony)`,
													cursor: 'pointer',
												}}>
												Edit
											 </span>} }
												
											</div>
											<div className={TalentListStyle.payRate}>
												<div>
													<span>
													Talent Expected Pay:
													</span>
													&nbsp;&nbsp;
													<span style={{ fontWeight: '500' }}>
														{_isNull(item?.PayRate) ? 'NA' : item?.PayRate}
													</span>
												</div>
												
												
											</div>
											<div className={TalentListStyle.nr}>
												<div>
													<span>Uplers Fees (%):</span>&nbsp;&nbsp;
													<span style={{ fontWeight: '500' }}>
														{_isNull(item?.NR) ? 'NA' : item?.NR}
													</span>
												</div>
												{hrStatus !== 'Cancelled' && hrStatus !== 'Completed' &&  hrStatus !== "Lost" && 
												(item?.Status === 'Selected' || item?.Status === 'Shortlisted' || item?.Status === 'In Interview' || item?.Status === 'Replacement') && 
												<span
												onClick={() => {
													// setEditPayRate(true);
													// setTalentIndex(item?.TalentID);
													setTalentIndex(item?.TalentID);
													setEditBillRate(true);
												}}
			
												style={{
													textDecoration: 'underline',
													color: `var(--background-color-ebony)`,
													cursor: 'pointer',
												}}>
												Edit
											</span>}
											</div>
											<div className={TalentListStyle.nr}>
												<div>
													<span>Uplers Fees Amount:</span>&nbsp;&nbsp;
													<span style={{ fontWeight: '500' }}>
														{_isNull(item?.UplersfeesAmount) ? 'NA' : `${item?.UplersfeesAmount} ${item.TalentCurrenyCode}`}
													</span>
												</div>
											</div>
											
										</>
									) : (
										<>
											{/* <div className={TalentListStyle.billRate}>
												<span>Client's Bill Amount:</span>&nbsp;&nbsp;
												<span style={{ fontWeight: '500' }}>
													{_isNull(item?.DPAmount) ? 'NA' : `${item?.CurrencySign} ${item?.DPAmount} ${item?.TalentCurrenyCode} One time Amount` }
												</span>
											</div> /}
											<div className={TalentListStyle.payRate}>
												<div>
													<span>
													Talent Expected Pay:
													</span>
													&nbsp;&nbsp;
													<span style={{ fontWeight: '500' }}>
														{_isNull(item?.PayRate) ? 'NA' : item?.PayRate}
													</span>
												</div>
												{/* {hrStatus !== 'Cancelled' && hrStatus !== 'Completed' &&  hrStatus !== "Lost" && 
												(item?.Status === 'Selected' || item?.Status === 'Shortlisted' || item?.Status === 'In Interview' || item?.Status === 'Replacement') && 
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
											</span>} /}
												
											</div>
											<div className={TalentListStyle.payRate}>
												<div>
													<span>
													Talent Current Pay:
													</span>
													&nbsp;&nbsp;
													<span style={{ fontWeight: '500' }}>
														{_isNull(item?.PayRateDP) ? 'NA' : item?.PayRateDP}
													</span>
												</div>
												
												
											</div>
											<div className={TalentListStyle.payRate}>
												<div>
													<span>Uplers Fees (%):</span>&nbsp;&nbsp;
													<span style={{ fontWeight: '500' }}>
														{_isNull(item?.DPPercentage)
															? 'NA'
															: item?.DPPercentage}
													</span>
			
												</div>
												{hrStatus !== 'Cancelled' && hrStatus !== 'Completed' &&  hrStatus !== "Lost" && <span
													onClick={() => {
														setEditDPRate(true);
														setDPData({ talentId:item?.TalentID , contactPriorityID: item?.ContactPriorityID, allValues: item});
													}}
													style={{
														textDecoration: 'underline',
														color: `var(--background-color-ebony)`,
														cursor: 'pointer',
													}}>
													Edit
												</span>}
											
											</div>
											<div className={TalentListStyle.payRate}>
												<div>
													<span>
													Uplers Fees Amount:
													</span>
													&nbsp;&nbsp;
													<span style={{ fontWeight: '500' }}>
														{_isNull(item?.UplersfeesAmount) ? 'NA' : `${item?.CurrencySign} ${item?.UplersfeesAmount} ${item.TalentCurrenyCode} One time Amount`}
													</span>
												</div>
												
												
											</div>
										</>
									)} */}
			
									<Divider
										style={{
											margin: '10px 0',
											// border: `1px solid var(--uplers-border-color)`,
										}}
									/>
									{item?.ScheduleTimeZone && (
										<div className={TalentListStyle.interviewSlots}>
											<span>Time Zone:</span>&nbsp;&nbsp;
											<span style={{ fontWeight: '500' }}>
												{item?.ScheduleTimeZone}
											</span>
										</div>
									)}
			
									<div className={TalentListStyle.interviewSlots}>
										<span>Available Interview Slots:</span>&nbsp;&nbsp;
										<span style={{ fontWeight: '500' }}>
											{/* { inteviewSlotDetails?.find(tal=> tal.TalentID === item.TalentID).SlotList?.length === 0 } */}
											{inteviewSlotDetails?.find(tal => tal.TalentID === item.TalentID).SlotList?.length === 0 ? (
												'NA'
											) : item.InterViewStatusId !== 1 ? 'NA' : (
												<Dropdown
													trigger={['click']}
													placement="bottom"
													overlay={
														<Menu>
															{/* {hrUtils
																?.formatInterviewSlots(
																	inteviewSlotDetails[listIndex]?.SlotList,
																)
																?.map((item, index) => {
																	return (
																		<Menu.Item key={index}>
																			{item?.label}
																		</Menu.Item>
																	);
																})} */}
															{hrUtils
																?.formatInterviewSlots(
																	inteviewSlotDetails?.find(tal => tal.TalentID === item.TalentID).SlotList
																)
																?.map((item, index) => {
																	return (
																		<Menu.Item key={index}>
																			{item?.label}
																		</Menu.Item>
																	);
																})}
														</Menu>
													}>
													<span>
														<Space>
															{/* {
																hrUtils?.formatInterviewSlots(
																	inteviewSlotDetails[listIndex]?.SlotList,
																)?.[0]?.label
															} */}
															{hrUtils?.formatInterviewSlots(
																inteviewSlotDetails?.find(tal => tal.TalentID === item.TalentID).SlotList,
															)?.[0]?.label}
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
											margin: '16px 0 10px 0',
										}}
									/>
									<TalentNotesCardComp item={item} />
									<Divider
										style={{
											margin: '10px 0',
										}}
									/>
									{talentCTA[ROW_SIZE * pageIndex + listIndex]?.cTAInfoList
										?.length > 0 && (
											<div
												// style={{
												// 	position: 'absolute',
												// 	marginTop: '10px',
												// 	textAlign: 'start !important',
												// }}
												className={TalentListStyle.talentCardAction}
											>
												<HROperator
													onClickHandler={() => setTalentIndex(item?.TalentID)}
													title={
														talentCTA?.[ROW_SIZE * pageIndex + listIndex]
															?.cTAInfoList[0]?.label
													}
													icon={<AiOutlineDown />}
													backgroundColor={`var(--color-sunlight)`}
													iconBorder={`1px solid var(--color-sunlight)`}
													isDropdown={true}
													listItem={hrUtils.showTalentCTA(filterTalentCTAs)}
													menuAction={(menuItem) => {														
														switch (menuItem.key) {															
															case TalentOnboardStatus.SCHEDULE_INTERVIEW: {
																let key = filterTalentCTAs?.cTAInfoList?.find(item=>item.label === menuItem.key).key
																setActionKey(key)
																setScheduleInterviewModal(true);
																setTalentIndex(item?.TalentID);
																break;
															}
															case TalentOnboardStatus.ASSIGN_TSC: {
																let key = filterTalentCTAs?.cTAInfoList?.find(item=>item.label === menuItem.key).key
																setActionKey(key)
																autoAssignTSC(item.OnBoardId)
																break
															}
															case TalentOnboardStatus.RESCHEDULE_INTERVIEW: {
																let key = filterTalentCTAs?.cTAInfoList?.find(item=>item.label === menuItem.key).key
																setActionKey(key)
																setReScheduleInterviewModal(true);
																setTalentIndex(item?.TalentID);
																break;
															}
															case TalentOnboardStatus.TALENT_ACCEPTANCE: {
																let key = filterTalentCTAs?.cTAInfoList?.find(item=>item.label === menuItem.key).key
																setActionKey(key)
																setTalentAcceptance(true);
																setTalentIndex(item?.TalentID);
																break;
															}
															case TalentOnboardStatus.TALENT_STATUS: {
																let key = filterTalentCTAs?.cTAInfoList?.find(item=>item.label === menuItem.key).key
																setActionKey(key)
																setTalentStatus(true);
																setTalentIndex(item?.TalentID);
																break;
															}
			
															case TalentOnboardStatus.INTERVIEW_STATUS: {
																let key = filterTalentCTAs?.cTAInfoList?.find(item=>item.label === menuItem.key).key
																setActionKey(key)
																setInterviewStatus(true);
																setTalentIndex(item?.TalentID);
																break;
															}
															case TalentOnboardStatus.UPDATE_CLIENT_ON_BOARD_STATUS: {
																// setOnboardClientModal(true);
																// setTalentIndex(item?.TalentID);
																let key = filterTalentCTAs?.cTAInfoList?.find(item=>item.label === menuItem.key).key
																setActionKey(key)
																setShowAMModal(true);
																let Flags = {
																	talent: item,
																	tabLabel: 'During Pre-Onboarding',
																	forTalent: true,
																	hrID: hrId
																}
																setAMFlags(Flags)
																break;
															}
															case TalentOnboardStatus.SUBMIT_CLIENT_FEEDBACK: {
																let key = filterTalentCTAs?.cTAInfoList?.find(item=>item.label === menuItem.key).key
																setActionKey(key)
																setInterviewFeedback(true);
																setTalentIndex(item?.TalentID);
																break;
															}
															case TalentOnboardStatus.EDIT_CLIENT_FEEDBACK: {
																let key = filterTalentCTAs?.cTAInfoList?.find(item=>item.label === menuItem.key).key
																setActionKey(key)
																// setInterviewFeedback(true);
																setTalentIndex(item?.TalentID);
																setEditFeedback(true);
																break;
															}
															case TalentOnboardStatus.SUBMIT_AS_HIRE: {
																let key = filterTalentCTAs?.cTAInfoList?.find(item=>item.label === menuItem.key).key
																setActionKey(key)
																clientFeedbackHandler(true,item)
																break;
															}
															case TalentOnboardStatus.MOVE_TO_ANOTHER_ROUND:{
																let key = filterTalentCTAs?.cTAInfoList?.find(item=>item.label === menuItem.key).key
																setActionKey(key)
																clientFeedbackHandler(false,item)
																break;
															}
															case TalentOnboardStatus.REJECT_TALENT: {
							
																let key = filterTalentCTAs?.cTAInfoList?.find(item=>item.label === menuItem.key).key
																setTalentStatus(true);
																setTalentIndex(item?.TalentID);
																setActionKey(key)
																break;
															}
															case TalentOnboardStatus.ANOTHER_ROUND_INTERVIEW: {
																let key = filterTalentCTAs?.cTAInfoList?.find(item=>item.label === menuItem.key).key
																setActionKey(key)
																setAnotherRound(true);																
																setTalentIndex(item?.TalentID);
																break;
															}
															case TalentOnboardStatus.SCHEDULE_ANOTHER_ROUND_INTERVIEW: {
																let key = filterTalentCTAs?.cTAInfoList?.find(item=>item.label === menuItem.key).key
																setActionKey(key)
																setScheduleAnotherRoundInterview(true);
																setTalentIndex(item?.TalentID);
																break;
															}
															case TalentOnboardStatus.UPDATE_TALENT_ON_BOARD_STATUS: {
																let key = filterTalentCTAs?.cTAInfoList?.find(item=>item.label === menuItem.key).key
																setActionKey(key)
																setOnboardTalentModal(true);
																setTalentIndex(item?.TalentID);
			
																break;
															}
															case TalentOnboardStatus.UPDATE_LEGAL_TALENT_ONBOARD_STATUS: {
																let key = filterTalentCTAs?.cTAInfoList?.find(item=>item.label === menuItem.key).key
																setActionKey(key)
																setLegalTalentOnboardModal(true);
																setTalentIndex(item?.TalentID);
																break;
															}
															case TalentOnboardStatus.UPDATE_LEGAL_CLIENT_ONBOARD_STATUS: {
																// setLegalClientOnboardModal(true);
																// setTalentIndex(item?.TalentID);
																let key = filterTalentCTAs?.cTAInfoList?.find(item=>item.label === menuItem.key).key
																setActionKey(key)
																setShowAMModal(true);
																let Flags = {
																	talent: item,
																	tabLabel: 'Complete Legal',
																	forTalent: true,
																	hrID: hrId
																}
																setAMFlags(Flags)
																break;
															}
															case TalentOnboardStatus.UPDATE_KICKOFF_ONBOARD_STATUS: {
																// setTalentKickOffModal(true);
																// setTalentIndex(item?.TalentID);
																let key = filterTalentCTAs?.cTAInfoList?.find(item=>item.label === menuItem.key).key
																setActionKey(key)
																setShowAMModal(true);
																let Flags = {
																	talent: item,
																	tabLabel: 'Before Kick-off',
																	forTalent: true,
																	hrID: hrId
																}
																setAMFlags(Flags)
																break;
															}
															case TalentOnboardStatus.REPLACE_TALENT: {
																let key = filterTalentCTAs?.cTAInfoList?.find(item=>item.label === menuItem.key).key
																setActionKey(key)
																setReplaceTalentModal(true);
																setTalentIndex(item?.TalentID);
																break;
															}
															case TalentOnboardStatus.CONFIRM_SLOT: {
																let key = filterTalentCTAs?.cTAInfoList?.find(item=>item.label === menuItem.key).key
																setActionKey(key)
																setConfirmSlotModal(true);
																setTalentIndex(item?.TalentID);
																break;
															}
															case TalentOnboardStatus.CONFIRM_CONTRACT_DETAILS: {
																// let onboardID = item.OnBoardId
																// navigate(`/onboard/edit/${onboardID}`)
																// window.scrollTo(0, 0)
																let key = filterTalentCTAs?.cTAInfoList?.find(item=>item.label === menuItem.key).key
																setActionKey(key)
																setShowAMModal(true);
																let Flags = {
																	talent: item,
																	tabLabel: 'Contract Details',
																	forTalent: true,
																	actionType: 'ContractDetails',
																	hrID: hrId
																}
																setAMFlags(Flags)
																break;
															}
															case TalentOnboardStatus.UPDATE_LEGAL: {																
																setShowAMModal(true);
																let Flags = {
																	talent: item,
																	tabLabel: 'Legal',
																	forTalent: true,
																	actionType: 'Legal',
																	hrID: hrId
																}
																setAMFlags(Flags)
																break;
															}															
															case TalentOnboardStatus.RELEASE_OFFER_DETAILS: {
																// let onboardID = item.OnBoardId
																// navigate(`/onboard/edit/${onboardID}`)
																// window.scrollTo(0, 0)
																setShowAMModal(true);
																let Flags = {
																	talent: item,
																	tabLabel: 'Contract Details',
																	forTalent: true,
																	actionType: 'ContractDetails',
																	hrID: hrId
																}
																setAMFlags(Flags)
																break;
															}
															// case TalentOnboardStatus.LEGAL: {
															// 	// let onboardID = item.OnBoardId
															// 	// navigate(`/onboard/edit/${onboardID}`)
															// 	// window.scrollTo(0, 0)
															// 	setShowAMModal(true);
															// 	let Flags = {
															// 		talent: item,
															// 		tabLabel: 'Legal',
															// 		forTalent: true,
															// 		actionType: 'Legal',
															// 		hrID: hrId
															// 	}
															// 	setAMFlags(Flags)
															// 	break;
															// }
															case TalentOnboardStatus.VIEW_ENGAGEMENT: {
																let key = filterTalentCTAs?.cTAInfoList?.find(item=>item.label === menuItem.key).key
																setActionKey(key)
																setHRAndEngagementId({
																	talentName: item.Name,
																	engagementID: item.EngagemenID,
																	hrNumber: item.HR_Number,
																	onBoardId: item.OnBoardId,
																	hrId: hrId,
																})
																setShowEngagementOnboard(true)
																break
															}
															default:
																break;
														}
													}}
												/>
											</div>
										)}
								
									
								</div>
			
								<div className={TalentListStyle.talentCardNote}>
									<InfoCircleIcon /> Please note that any notes you add here will also be accessible to the client.
								</div>
							</div>
						</div>
					);
				}}
			/>

			{/** ============ MODAL FOR PROFILE REJECTED REASON ================ */}
			<PreOnboardingTabModal showAMModal={showAMModal} setShowAMModal={setShowAMModal} AMFlags={AMFlags} callAPI={callAPI} />


			{/** ============ Engagement Onboard ================ */}
			<Modal
				transitionName=""
				width="930px"
				centered
				footer={null}
				className="engagementPayRateModal"
				open={showengagementOnboard}
				onCancel={() =>
					setShowEngagementOnboard(false)
				}>
				<EngagementOnboard
					getOnboardFormDetails={getOnboardFormDetails}
					getHRAndEngagementId={getHRAndEngagementId}
					scheduleTimezone={scheduleTimezone}
					getOnboardingForm={getOnboardingForm}
				/>
			</Modal>



			{/** ============ MODAL FOR PROFILE REJECTED REASON ================ */}
			<Modal
				transitionName=""
				width="926px"
				centered
				footer={null}
				// open={editBillRate}
				open={profileRejectedModal}
				className="commonModalWrap rejectionModalWrap"
				onCancel={() => setProfileRejectedModal(false)}>
				<ProfileRejectedModal
					// callAPI={callAPI}
					// hrId={hrId}
					// filterTalentID={filterTalentID}
					// getBillRateInfo={getBillRateInfo}
					handleSubmit={handleSubmit}
					onCancel={() => setProfileRejectedModal(false)}
					register={register}
					talentIndex={talentIndex}
					errors={errors}
					details={{
						talentDetail,
						clientDetail,
						hiringRequestNumber,
					}}
				// setHRapiCall={setHRapiCall}
				// callHRapi={callHRapi}
				// talentInfo={filterTalentID}
				/>
			</Modal>

			{/** ============ MODAL FOR PROFILE LOG ================ */}

			{showProfileLogModal && (
				<Modal
					width="992px"
					centered
					footer={null}
					open={showProfileLogModal}
					className="commonModalWrap"
					// onOk={() => setVersantModal(false)}
					onCancel={() => {
						setProfileLogModal(false);
						setProfileShared([]);
						setFeedbackReceivedDetails([]);
						setProfileRejected([]);
						setShowProfileShared(false);
						setShowProfileRejectClass(false);
						setFeedBackReceivedClass(false);
						setEndDate(null);
					}}>
					<ProfileLogDetails
						activeIndex={activeIndex}
						talentID={talentID}
						activeType={activeType}
						setActiveType={setActiveType}
						setActiveIndex={setActiveIndex}
						setEndDate={setEndDate}
						setProfileLog={setProfileLog}
						profileLog={profileLog}
						startDate={startDate}
						endDate={endDate}
						showProfileShared={showProfileShared}
						showProfileRejectClass={showProfileRejectClass}
						talentId={filterTalentID?.TalentID}
						talentInfo={filterTalentID}
					/>
				</Modal>
			)}

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
					className="commonModalWrap"
					centered
					footer={null}
					open={showReScheduleInterviewModal}
					onOk={() => setReScheduleInterviewModal(false)}
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
						reScheduleRadio={reScheduleRadio}
						setRescheduleRadio={setRescheduleRadio}
						reScheduleSlotRadio={reScheduleSlotRadio}
						setRescheduleSlotRadio={setRescheduleSlotRadio}
						// getSlotInformationHandler={getSlotInformationHandler}
						getInterviewStatus={getInterviewStatus}
					/>
				</Modal>
			)}

			{/** ============ MODAL FOR ANOTHER ROUND RESCHEDULING INTERVIEW ================ */}
			{isAnotherRound && (
				<Modal
					transitionName=""
					width="1000px"
					className="commonModalWrap"
					centered
					footer={null}
					open={isAnotherRound}
					onOk={() => setAnotherRound(false)}
					onCancel={() => setAnotherRound(false)}>
					<InterviewReschedule
						callAPI={callAPI}
						closeModal={() => setAnotherRound(false)}
						talentName={filterTalentID?.Name}
						hrId={hrId}
						talentInfo={filterTalentID}
						hiringRequestNumber={hiringRequestNumber}
						reScheduleTimezone={reScheduleTimezone}
						setRescheduleTimezone={setRescheduleTimezone}
						getRescheduleSlotDate={getRescheduleSlotDate}
						setRescheduleSlotDate={setRescheduleSlotDate}
						reScheduleRadio={reScheduleRadio}
						setRescheduleRadio={setRescheduleRadio}
						reScheduleSlotRadio={reScheduleSlotRadio}
						setRescheduleSlotRadio={setRescheduleSlotRadio}
						// getSlotInformationHandler={getSlotInformationHandler}
						getInterviewStatus={getInterviewStatus}
						isAnotherRound={isAnotherRound}
					/>
				</Modal>
			)}

			{/** ============ MODAL FOR SCHEDULE ANOTHER ROUND RESCHEDULING INTERVIEW ================ */}
			{scheduleAnotherRoundInterview && (
				<Modal
					transitionName=""
					width="1000px"
					className="commonModalWrap"
					centered
					footer={null}
					open={scheduleAnotherRoundInterview}
					onOk={() => setScheduleAnotherRoundInterview(false)}
					onCancel={() => setScheduleAnotherRoundInterview(false)}>
					<InterviewReschedule
						callAPI={callAPI}
						closeModal={() => setScheduleAnotherRoundInterview(false)}
						talentName={filterTalentID?.Name}
						hrId={hrId}
						ActionKey={ActionKey}
						talentInfo={filterTalentID}
						hiringRequestNumber={hiringRequestNumber}
						reScheduleTimezone={reScheduleTimezone}
						setRescheduleTimezone={setRescheduleTimezone}
						getRescheduleSlotDate={getRescheduleSlotDate}
						setRescheduleSlotDate={setRescheduleSlotDate}
						reScheduleRadio={reScheduleRadio}
						setRescheduleRadio={setRescheduleRadio}
						reScheduleSlotRadio={reScheduleSlotRadio}
						setRescheduleSlotRadio={setRescheduleSlotRadio}
						// getSlotInformationHandler={getSlotInformationHandler}
						getInterviewStatus={getInterviewStatus}
					/>
				</Modal>
			)}

			{/** ============ MODAL FOR SCHEDULING INTERVIEW ================ */}
			{showScheduleInterviewModal && (
				<Modal
					transitionName=""
					width="1000px"
					className="commonModalWrap"
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
						// getScheduleSlotInfomation={getScheduleSlotInfomation}
						// setScheduleSlotInformation={setScheduleSlotInformation}
						scheduleSlotRadio={scheduleSlotRadio}
						setScheduleSlotRadio={setScheduleSlotRadio}
						// getSlotInformationHandler={getSlotInformationHandler}
						getInterviewStatus={getInterviewStatus}
					/>
				</Modal>
			)}

			{/** ============ MODAL FOR INTERVIEW FEEDBACK STATUS ================ */}
			{interviewFeedback && (
				<Modal
					transitionName=""
					width="1000px"
					className="commonModalWrap"
					centered
					footer={false}
					open={interviewFeedback}
					onCancel={() => setInterviewFeedback(false)}>
					<InterviewFeedback
						hrId={hrId}
						clientDetail={clientDetail}
						callAPI={callAPI}
						getScheduleSlotDate={getScheduleSlotDate}
						setScheduleSlotDate={setScheduleSlotDate}
						talentInfo={filterTalentID}
						talentName={filterTalentID?.Name}
						HRStatusCode={HRStatusCode}
						hiringRequestNumber={hiringRequestNumber}
						starMarkedStatusCode={starMarkedStatusCode}
						hrStatus={hrStatus}
						scheduleSlotRadio={scheduleSlotRadio}
						closeModal={() => setInterviewFeedback(false)}
					/>
				</Modal>
			)}

			{/** =========== MODAL FOR EDIT FEEDBACK ============== */}
			{isEditFeedback && (
				<Modal
					transitionName=""
					width="1000px"
					className="commonModalWrap"
					centered
					footer={false}
					open={isEditFeedback}
					onCancel={() => setEditFeedback(false)}>
					<InterviewFeedback
						getScheduleSlotDate={getScheduleSlotDate}
						setScheduleSlotDate={setScheduleSlotDate}
						isEditFeedback={isEditFeedback}
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
			)}

			{/** ============ MODAL FOR TALENT ACCEPTANCE ================ */}
			{showTalentAcceptance && (
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
			)}

			{/** ============ MODAL FOR TALENT STATUS ================ */}
			{showTalentStatus && (
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
						apiData={apiData}
						ActionKey={ActionKey}
					/>
				</Modal>
			)}

			{/** ============ MODAL FOR INTERVIEW STATUS ================ */}
			{showInterviewStatus && (
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
			)}

			{/** ============ MODAL FOR UPDATE CLIENT ONBOARD STATUS ================ */}
			{updateOnboardClientModal && (
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
			)}

			{/** ============ MODAL FOR UPDATE TALENT ONBOARD STATUS ================ */}
			{updateOnboardTalentModal && (
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
			)}

			{/** ============ MODAL FOR UPDATE LEGAL CLIENT ONBOARD STATUS ================ */}
			{updateLegalClientOnboardModal && (
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
			)}

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
						hrNO={hiringRequestNumber}
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
						hrNO={hiringRequestNumber}
					/>
				</Modal>
			)}

			{/** ============ MODAL FOR DP RATE ================ */}
			{editDPRate && (
				<Modal
					transitionName=""
					width="700px"
					centered
					footer={null}
					open={editDPRate}
					className="statusModalWrap"
					onCancel={() => setEditDPRate(false)}>
					<EditDPRate onCancel={() => setEditDPRate(false)} hrId={hrId} DPData={DPData} hrNO={hiringRequestNumber} />
				</Modal>
			)}

			{/** ============ MODAL FOR UPDATE LEGAL TALENT ONBOARD STATUS ================ */}
			{updateTalentKickOffModal && (
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
			)}

			{/** ============ MODAL FOR TALENT REPLACEMENT ================ */}
			{replaceTalentModal && (
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
			)}

			{/** ============ MODAL FOR Confirm slot modal ================ */}
			{getConfirmSlotModal && (
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
						ScheduleTimeZone={talentDetail.find(item => item.TalentID === talentIndex)?.ScheduleTimeZone}
					/>
				</Modal>
			)}

			{/** ============ MODAL TO SEE FEEDBACK ================ */}
			{isShowFeedback && (
				<Modal
					transitionName=""
					width="1000px"
					//centered
					footer={null}
					open={isShowFeedback}
					className="seeFeedback"
					onCancel={() => setShowFeedback(false)}>
					<FeedbackResponse
						onCancel={() => setShowFeedback(false)}
						hrId={hrId}
						callAPI={callAPI}
						clientDetail={clientDetail}
						talentInfo={filterTalentID}
					/>
				</Modal>
			)}
		</div>
	);
};
export default TalentList;
