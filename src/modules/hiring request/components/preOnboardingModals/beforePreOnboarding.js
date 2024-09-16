import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Skeleton,
  Tooltip,
  Modal,
  Checkbox,
  DatePicker,
  Radio,
  message,
  TimePicker,
  AutoComplete,
} from "antd";
import HRDetailStyle from "../../screens/hrdetail/hrdetail.module.css";
import HRSelectField from "modules/hiring request/components/hrSelectField/hrSelectField";
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import { Controller, useForm } from "react-hook-form";
import {
  HRDeleteType,
  HiringRequestHRStatus,
  InputType,
} from "constants/application";
import { OnboardDAO } from "core/onboard/onboardDAO";
import { MasterDAO } from "core/master/masterDAO";
import { HTTPStatusCode } from "constants/network";
import "react-datepicker/dist/react-datepicker.css";
import { NetworkInfo } from "constants/network";
import { engagementRequestDAO } from 'core/engagement/engagementDAO';

import { ReactComponent as GeneralInformationSVG } from "assets/svg/generalInformation.svg";
import { ReactComponent as DownloadJDSVG } from "assets/svg/downloadJD.svg";
import { ReactComponent as HireingRequestDetailSVG } from "assets/svg/HireingRequestDetail.svg";
import { ReactComponent as CurrentHrsSVG } from "assets/svg/CurrentHrs.svg";
import { ReactComponent as TelentDetailSVG } from "assets/svg/TelentDetail.svg";
import { ReactComponent as EditFieldSVG } from "assets/svg/EditField.svg";
import { ReactComponent as ClockIconSVG } from "assets/svg/clock-icon.svg";
import moment from "moment";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import { isNull } from "lodash";
import { _isNull } from "shared/utils/basic_utils";
import dayjs from "dayjs";
import { ReactComponent as UploadSVG } from "assets/svg/upload.svg";
import { ReactComponent as CloseSVG } from "assets/svg/close.svg";
import UploadModal from "shared/components/uploadModal/uploadModal";
import { ReactComponent as ClientTeamMemberSVG } from 'assets/svg/clientTeammember.svg';
import { ReactComponent as LinkedinClientSVG } from 'assets/svg/LinkedinClient.svg';
import { ReactComponent as AboutCompanySVG } from 'assets/svg/aboutCompany.svg';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import debounce from "lodash.debounce";

export default function BeforePreOnboarding({
  preOnboardingDetailsForAMAssignment,
  setPreOnboardingDetailsForAMAssignment,
  talentDeteils,
  HRID,  
  setShowAMModal,
  callAPI,
  EnableNextTab,
  actionType,
  setMessage,
  titleFlag,
  getHrUserData
}) {
  const {
    watch,
    register,
    setValue,
    handleSubmit,
    unregister,
    clearErrors,
    control,
    formState: { errors },
  } = useForm({});
  const {
		watch : memberWatch,
		register:memberregister,
		setValue:memberSetValue,
		handleSubmit:memberHandleSubmit,
        unregister: memberUnregister,
		control: memberControl,
		formState: { errors : memberErrors},
	} = useForm({});
  const uploadFile = useRef(null);
  const [editNetTerm, setEditNetTerm] = useState(false);
  const [editPayRate, setEditPayRate] = useState(false);
  const [editBillRate, setEditBillRate] = useState(false);
  const [editUplersFee, setEditUplersFee] = useState(false);
  const [editAcceptHR, setEditAcceptHR] = useState(false);
  const [editMOF, setEditMOF] = useState(false);
  const [editCity, setEditCity] = useState(false);
  const [editState, setEditSate] = useState(false);
  const [editDesignation, setEditDesignation] = useState(false);
  const [editNR, setEditNR] = useState(false);
  const [addMoreTeamMember, setAddMoreTeamMember] = useState(false)
  const [clientTeamMembers, setClientTeamMembers] = useState([])
  const [controlledReportingTo, setControlledReportingTo] = useState('Please Select');
  const [locationList, setLocationList] = useState([]);
  const [locationSelectValidation,setLocationSelectValidation] = useState(false);

  const [preONBoardingData, setPreONBoardingData] = useState({});

  const [dealSource, setDealSource] = useState([]);
  const [dealOwner, setDealowner] = useState([]);
  const [netTerms, setNetTerms] = useState([]);
  const [currentHRs, setCurrentHRs] = useState([]);
  const [hrAcceptedBys, setHrAcceptedBys] = useState([]);
  const [workManagement, setWorkManagement] = useState("");

  const [controlledDealOwner, setControlledDealOwner] = useState();
  const [controlledDealSource, setControlledDealSource] = useState();
  const [controlledEngRep, setControlledEngRep] = useState();
  const [TSCusers, setTSCusers] = useState([])
  const [controlledTSC, setControlledTSC] =
    useState("Please Select");

  const [isLoading, setIsLoading] = useState(false);
  const [isTabDisabled, setTabDisabled] = useState(false);
  const [isTransparentPricing, setIsTransparentPricing] = useState(false);
  const [engagementReplacement, setEngagementReplacement] = useState({
    replacementData: false,
  });
  const [addLatter, setAddLetter] = useState(false);
  const [replacementEngHr, setReplacementEngHr] = useState([]);
  const loggedInUserID = JSON.parse(
    localStorage.getItem("userSessionInfo")
  ).LoggedInUserTypeID;

  const [getStartEndTimes, setStaryEndTimes] = useState([]);
  const [controlledFromTimeValue, setControlledFromTimeValue] =
    useState("Select From Time");
  const [controlledEndTimeValue, setControlledEndTimeValue] =
    useState("Select End Time");
  const [controlledDevicePolicy, setControlledDevicePolicy] =
    useState([]);
  const devicePolices = [
    { id: 1, value: "Talent to bring his own devices" },
    { id: 2, value: "Client to buy a device and Uplers to Facilitate" },
    {
      id: 3,
      value:
        " Client can use remote desktop security option facilitated by Uplers (At additional cost of $100 per month)",
    },
    { id: 4, value: "Add This Later" },
  ];
  const watchDevicePolicy = watch("devicePolicy");
  const [controlledDeviceType, setControlledDeviceType] =
    useState("Please Select");
  const [deviceMasters, setDeviceMasters] = useState([]);
  const [controlledLeavePolicy, setControlledLeavePolicy] =
    useState("Please Select");
  const leavePolices = [
    { id: 1, value: "Proceed with Uplers Policies" },
    { id: 2, value: "Upload Your Policies" },
  ];
  const [uplersLeavePolicyLink, setUplersLeavePolicyLink] = useState("");
  const [getUploadFileData, setUploadFileData] = useState("");
  const [showUploadModal, setUploadModal] = useState(false);
  const [getValidation, setValidation] = useState({
    systemFileUpload: "",
    googleDriveFileUpload: "",
    linkValidation: "",
  });
  const [amUsers,setAMUsers] = useState([]);
  const [workingMode, setWorkingMode] = useState([]);
  const [stateList,setStateList] = useState([]);
  const [reportingTo, setReportingTo] = useState([]);
  const [controlledBuddy, setControlledBuddy] = useState('Please Select');
  const [buddy, setBuddy] = useState([]);
  const [assignAM,setAssignAM] = useState();
  const [assignAMnew,setAssignAMNew] = useState();
  const [tempAMAssign, setTempAMAssign] = useState()
  const [controlledAssignAM, setControlledAssignAM] = useState([]);
  const [controlledPaymentNetTerm, setControlledPaymentNetTerm] = useState([]);
  const [controlledState, setControlledState] = useState([]);
  const [controlledIMOW, setControlledMOW] = useState([]);
  const [data,setData] = useState({});
  const getStartEndTimeHandler = useCallback(async () => {
    const durationTypes = await MasterDAO.getStartEndTimeDAO();
    setStaryEndTimes(durationTypes && durationTypes?.responseBody);
  }, []);

  const workingModeID = watch("modeOFWorkingID")

  useEffect(() => {
    getStartEndTimeHandler();
    getAMusersData();
    getWorkingMode();
    getStateData();
    getReportingToHandler();
    getBuddyHandler();
    fatchpreOnBoardInfo();   
    
  }, []);

  useEffect(()=>{
		const getTSCUSERS = async(ID)=> {
				let response = await engagementRequestDAO.getTSCUserListDAO(ID);
				if (response?.statusCode === HTTPStatusCode.OK) {
					// setTSCusers()
					setTSCusers(response.responseBody.drpTSCUserList.map(item=> ({...item, id:item.value , value: item.text, })))
					// setTSCONBoardData(prev=>({...prev,tscPersonID: response.responseBody.tscPersonID}))
				} 
			}

		if(talentDeteils?.OnBoardId){
			getTSCUSERS(talentDeteils?.OnBoardId)
		}		

	},[talentDeteils?.OnBoardId])

  useEffect(()=>{
    if(TSCusers.length && preONBoardingData?.preOnboardingDetailsForAMAssignment?.tscUserId){
      let tscUser = TSCusers.find(usr => usr.id == preONBoardingData?.preOnboardingDetailsForAMAssignment?.tscUserId)
      setControlledTSC(tscUser?.value)
      setValue('AddTSCName',tscUser)
    }
  },[TSCusers,preONBoardingData?.preOnboardingDetailsForAMAssignment?.tscUserId])

  const onChangeLocation = async (val) => {
    if (typeof val === "number") return;
    fetchLocations(val);
  };

  const fetchLocations = useCallback(
    debounce(async (val) => {
      if (val?.trim() === "") return;
      const controller = new AbortController();
      const signal = controller.signal;
      try {
        // setIsLoading(true);
        const _res = await MasterDAO.getAutoCompleteCityStateDAO(val, {
          signal,
        });
        // setIsLoading(false);
        let locations = [];
        if (_res?.statusCode === 200) {
          locations = _res?.responseBody?.details?.map((location) => ({
            id: location?.row_ID,
            value: location?.location,
          }));
          setLocationList(locations || []);
        } else {
          setLocationList([]);
        }
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          console.error("Error fetching locations:", error);
          setLocationList([]);
        }
      }
    }, 300),
    []
  );

  const getAMusersData = async () =>{
    const res = await OnboardDAO.getAMUsersDAO();
    setAMUsers(res?.responseBody?.details?.map(item=>({
      id:item?.id,
      value:item?.value
    })))
  }


  const getReportingToHandler = useCallback(async () => {
    const response = await MasterDAO.getYesNoOptionRequestDAO();
    setReportingTo(response && response?.responseBody?.details);
}, []);

  const getBuddyHandler = useCallback(async () => {
      const response = await MasterDAO.getBuddyRequestDAO();
      setBuddy(response && response?.responseBody?.details);
  }, []);

  const getStateData = async () =>{
    const res = await OnboardDAO.getStateListDAO();
    setStateList(res?.responseBody?.details?.map(item=>({
      id:item?.id,
      value:item?.value
    })))
  }

  const getWorkingMode = useCallback(async () => {
    const workingModeResponse = await MasterDAO.getModeOfWorkDAO();
    setWorkingMode(
      workingModeResponse && workingModeResponse?.responseBody?.details
    );
  }, []);

  function convertToValidDate(timeString, currentDate = new Date()) {
    // Step 1: Parse the time string into separate components
    const [time, period] = timeString.split(" ");
    const [hourString, minuteString] = time.split(":");

    // Step 2: Convert the hour to 24-hour format if it's in PM
    let hour = parseInt(hourString, 10);
    if (period === "PM" && hour < 12) {
      hour += 12;
    }

    // Step 3: Set the time components to the current date
    currentDate.setHours(hour);
    currentDate.setMinutes(parseInt(minuteString, 10));

    // Step 4: Format the resulting Date object as a valid date string
    // const formattedDate = currentDate.toLocaleString([], {
    //   year: "numeric",
    //   month: "2-digit",
    //   day: "2-digit",
    //   hour: "2-digit",
    //   minute: "2-digit",
    // });
    // const formattedDate = currentDate.toLocaleString();
    // return formattedDate;
    return currentDate;
  }

  function extractNumberFromString(inputString) {
    // const regex = /\d+/;
    const match = inputString.match(/\d+\.\d+/);
    // const match = inputString.match(regex);
    if (match && match.length > 0) {
      // const number = parseInt(match[0], 10);
      const extractedNumber = parseFloat(match[0]);
      // return number;
      return extractedNumber;
    }
    return null;
  }

  useEffect(() => {
    let data = amUsers?.filter((item) => item.id === preONBoardingData?.preOnboardingDetailsForAMAssignment?.amUserID);
    setValue("amSalesPersonID", data[0]);
    setControlledAssignAM(data[0]);
  }, [preONBoardingData,amUsers])

  useEffect(() => {    
    let list = netTerms?.filter((item) => item.value == preONBoardingData?.preOnboardingDetailsForAMAssignment?.payementNetTerm);
    setValue("netTerm", list[0]);
    setControlledPaymentNetTerm(list[0]);
  }, [preONBoardingData,netTerms])

  useEffect(() => {
    let modeOfWorking = workingMode?.filter((item) => item.value === preONBoardingData?.preOnboardingDetailsForAMAssignment?.modeOfWork);
    setValue("modeOFWorkingID", modeOfWorking[0]);
    setValue("city",preONBoardingData?.preOnboardingDetailsForAMAssignment?.cityName);
    setControlledMOW(modeOfWorking[0]);
  }, [preONBoardingData,workingMode])

  useEffect(() => {
    let _state = stateList?.filter((item) => item.id === preONBoardingData?.preOnboardingDetailsForAMAssignment?.stateID);
    setValue("stateID", _state[0]);
    setControlledState(_state[0]);
  }, [preONBoardingData,stateList])  

  const fatchpreOnBoardInfo = useCallback(
    async () => {
      setIsLoading(true);      
      if(talentDeteils?.OnBoardId){
        let req = {
          OnboardID: talentDeteils?.OnBoardId,
          HRID: HRID,
          // actionName: actionType ? actionType : "GotoOnboard",
        };
        let result = await OnboardDAO.getBeforeOnBoardInfoDAO(req);      
      if (result?.statusCode === HTTPStatusCode.OK) {       
        setAssignAM(result?.responseBody?.details?.assignAM)
        setTempAMAssign(result?.responseBody?.details?.assignAM)
        setAssignAMNew(result?.responseBody?.details?.assignAM)
        setReplacementEngHr(result.responseBody.details?.replacementEngAndHR);
        setIsTransparentPricing(
          result.responseBody.details?.isTransparentPricing
        );
        setTabDisabled(result.responseBody.details?.isFirstTabReadOnly);
        setPreONBoardingData(result.responseBody.details);
        setPreOnboardingDetailsForAMAssignment(
          result.responseBody.details?.preOnboardingDetailsForAMAssignment
        );
        setData(result.responseBody.details?.preOnboardingDetailsForAMAssignment);
        setEngagementReplacement({
          ...engagementReplacement,
          replacementData:
            result.responseBody.details.replacementDetail !== null
              ? true
              : false,
        });
        setWorkManagement(
          result.responseBody.details.preOnboardingDetailsForAMAssignment
            ?.workForceManagement
        );
        setNetTerms(result.responseBody.details?.drpNetPaymentDays);
        setCurrentHRs(result.responseBody.details?.currentHRs);

        // let list = netTerms?.filter((item) => item.value === result.responseBody.details?.preOnboardingDetailsForAMAssignment
        // ?.payementNetTerm);
        // setValue("netTerm", list[0]);
        // setControlledAssignAM(list[0]);

        setValue(
          "payRate",
          result.responseBody.details?.preOnboardingDetailsForAMAssignment
            ?.talentCost
        );
        setValue(
          "uplersFee",
          result.responseBody.details?.preOnboardingDetailsForAMAssignment
            ?.uplersFeesAmount
        );
        setValue(
          "billRate",
          result.responseBody.details?.preOnboardingDetailsForAMAssignment
            ?.finalHrCost
        );
        setValue(
          "hrAcceptedBy",
          result.responseBody.details?.preOnboardingDetailsForAMAssignment
            ?.utS_HRAcceptedBy
        );
        setValue(
          "lwd",
          dayjs(
            result.responseBody.details?.replacementDetail?.lastWorkingDay
          ).toDate()
        );
        setValue(
          "modeOFWorkingID",
            result.responseBody.details?.preOnboardingDetailsForAMAssignment?.modeOfWork
        );
        setValue(
          "city",
            result.responseBody.details?.preOnboardingDetailsForAMAssignment
            ?.cityName
        );
        // if(result.responseBody.details?.preOnboardingDetailsForAMAssignment?.cityName){
        //   setEditCity(false)
        // }else{
        //   setEditCity(true)}
        //   setValue(
        //     "stateID",
        //       result.responseBody.details?.preOnboardingDetailsForAMAssignment?.stateID
        //   );
        //   setValue(
        //     "talent_Designation",
        //       result.responseBody.details?.preOnboardingDetailsForAMAssignment?.talent_Designation
        //   );
        if(result.responseBody.details?.preOnboardingDetailsForAMAssignment?.talent_Designation){
          setEditDesignation(false)
        }else{setEditDesignation(true)}
        setValue('aboutCompany',result?.responseBody?.details.secondTabAMAssignmentOnBoardingDetails.company_Description)
        setValue('firstWeek',result?.responseBody?.details.secondTabAMAssignmentOnBoardingDetails.talent_FirstWeek)
        setValue('firstMonth',result?.responseBody?.details.secondTabAMAssignmentOnBoardingDetails.talent_FirstMonth)
        setValue('softwareToolsRequired',result?.responseBody?.details.secondTabAMAssignmentOnBoardingDetails.softwareToolsRequired)
        setValue('exitPolicy',result?.responseBody?.details.exit_Policy)
        setValue('feedbackProcess', result?.responseBody?.details.feedback_Process)
        setValue('policyLink',result?.responseBody?.details?.secondTabAMAssignmentOnBoardingDetails.proceedWithClient_LeavePolicyLink)
        setDeviceMasters(result?.responseBody?.details?.deviceMaster)
        setClientTeamMembers(result?.responseBody?.details?.onBoardClientTeam)
        let preOnboardDetail =
          result.responseBody.details?.preOnboardingDetailsForAMAssignment;

        preOnboardDetail?.dpAmount &&
          setValue("dpAmount", preOnboardDetail?.dpAmount);
        preOnboardDetail?.currentCTC &&
          setValue("currentCTC", preOnboardDetail?.currentCTC);
        preOnboardDetail?.nrPercentage &&
          setValue("nrPercent", preOnboardDetail?.nrPercentage);

        // let data = amUsers?.filter((item) => item.id === result?.responseBody?.details?.preOnboardingDetailsForAMAssignment?.amUserID);
        // setValue("amSalesPersonID", data[0]);
        // setControlledAssignAM(data[0]);

        // console.log(amUsers,data,"datadatadata123");

        // let modeOfWorking = workingMode?.filter((item) => item.value === result?.responseBody?.details?.preOnboardingDetailsForAMAssignment?.modeOfWork);
        // setValue("modeOFWorkingID", modeOfWorking[0]);
        // setControlledMOW(modeOfWorking[0]);

        // let _state = stateList?.filter((item) => item.id === result?.responseBody?.details?.preOnboardingDetailsForAMAssignment?.stateID);
        // setValue("stateID", _state[0]);
        // setControlledState(_state[0]);
        if(result?.responseBody?.details?.secondTabAMAssignmentOnBoardingDetails?.devicesPoliciesOption){
        let filteredDevicePolicy = devicePolices.filter(item=> item.value ===  result?.responseBody?.details?.secondTabAMAssignmentOnBoardingDetails.devicesPoliciesOption)
            setValue('devicePolicy',filteredDevicePolicy[0])
            setControlledDevicePolicy(filteredDevicePolicy[0].value)
        
        if(filteredDevicePolicy[0].id === 2){
          let deviceFilteredMaster = result?.responseBody?.details?.deviceMaster.filter(device=> device.deviceName === result?.responseBody?.details?.secondTabAMAssignmentOnBoardingDetails.device_Radio_Option)
          // console.log('deviceFilteredMaster', deviceFilteredMaster,  data.secondTabAMAssignmentOnBoardingDetails.device_Radio_Option)
          if(deviceFilteredMaster[0].id !== 3){
                  setValue('deviceType',deviceFilteredMaster.map(device=> ({id: device.id, value: `${device.deviceName} $ ${device.deviceCost} USD `}))[0])
                  setControlledDeviceType(deviceFilteredMaster.map(device=> ({id: device.id, value: `${device.deviceName} $ ${device.deviceCost} USD `}))[0].value)
          }else {
                  setValue('deviceType',deviceFilteredMaster.map(device=> ({id: device.id, value: device.deviceName}))[0])
                  setControlledDeviceType(deviceFilteredMaster.map(device=> ({id: device.id, value: device.deviceName}))[0].value)
                  setValue('otherDevice',result?.responseBody?.details?.secondTabAMAssignmentOnBoardingDetails.client_DeviceDescription)
          }
        } 
      }

        if(result?.responseBody?.details?.secondTabAMAssignmentOnBoardingDetails.proceedWithUplers_LeavePolicyOption){
          let filteredLeavePolicy = leavePolices.filter(leavePolices => leavePolices.value === result?.responseBody?.details?.secondTabAMAssignmentOnBoardingDetails.proceedWithUplers_LeavePolicyOption)
          setValue('leavePolicie',filteredLeavePolicy[0])
          setControlledLeavePolicy(filteredLeavePolicy[0].value)
          result?.responseBody?.details?.secondTabAMAssignmentOnBoardingDetails.proceedWithClient_LeavePolicyLink && setValue('policyLink',result?.responseBody?.details?.secondTabAMAssignmentOnBoardingDetails.proceedWithClient_LeavePolicyLink)
          result?.responseBody?.details?.secondTabAMAssignmentOnBoardingDetails.leavePolicyFileName && setUploadFileData(result?.responseBody?.details?.secondTabAMAssignmentOnBoardingDetails.leavePolicyFileName)
  
         }

        let { drpLeadTypes, drpLeadUsers } = result.responseBody.details;
        setDealowner(
          drpLeadUsers
            .filter((item) => item.value !== "0")
            .map((item) => ({ ...item, text: item.value, value: item.text }))
        );
        setDealSource(drpLeadTypes);
        let dealOwnerOBJ = drpLeadUsers
          ?.filter(
            (item) =>
              item.text ===
              result.responseBody.details.preOnboardingDetailsForAMAssignment
                .deal_Owner
          )
          .map((item) => ({ ...item, text: item.value, value: item.text }));
        let dealSourceObj = drpLeadTypes.filter(
          (item) =>
            item.value ===
            result.responseBody.details.preOnboardingDetailsForAMAssignment
              .dealSource
        );

        if (dealOwnerOBJ.length) {
          setControlledDealOwner(dealOwnerOBJ[0].value);
          setValue("dealOwner", dealOwnerOBJ[0]);
        }
        if (dealSourceObj.length) {
          setControlledDealSource(dealSourceObj[0].value);
          setValue("dealSource", dealSourceObj[0]);
        }
        const _filterData =
          result?.responseBody?.details?.replacementEngAndHR?.filter(
            (e) =>
              e.id === result?.responseBody?.details?.replacementDetail?.newHrid ||
              result?.responseBody?.details?.replacementDetail?.newOnBoardId
          );
        setControlledEngRep(_filterData[0]?.value);
        setValue("engagementreplacement", _filterData[0]);
      }
    }
    setIsLoading(false);
    },
    [setValue,talentDeteils, HRID]
  );

  useEffect(() => {
    if (
      preONBoardingData?.preOnboardingDetailsForAMAssignment?.shiftStartTime
    ) {
      const findFromTime = getStartEndTimes.filter(
        (item) =>
          item?.value ===
          preONBoardingData?.preOnboardingDetailsForAMAssignment.shiftStartTime
      );
      const findEndTime = getStartEndTimes.filter(
        (item) =>
          item?.value ===
          preONBoardingData?.preOnboardingDetailsForAMAssignment?.shiftEndTime
      );
      setValue("shiftStartTime", findFromTime[0]);
      setControlledFromTimeValue(findFromTime[0]?.value);
      setValue("shiftEndTime", findEndTime[0]);
      setControlledEndTimeValue(findEndTime[0]?.value);
      // setControlledDurationTypeValue(findDurationMode[0]?.value);
    }
  }, [preONBoardingData, getStartEndTimes, setValue]);

  // useEffect(() => {
  //   if (talentDeteils?.OnBoardId) {
  //     let req = {
  //       OnboardID: talentDeteils?.OnBoardId,
  //       HRID: HRID,
  //       // actionName: actionType ? actionType : "GotoOnboard",
  //     };
  //     fatchpreOnBoardInfo(req);
  //   }
  // }, [talentDeteils, HRID, fatchpreOnBoardInfo]);

  const watchDealSource = watch("dealSource");

  const getLeadOwnerBytype = async (type) => {
    let result = await MasterDAO.getLeadTypeDAO(
      type,
      preONBoardingData?.preOnboardingDetailsForAMAssignment.hR_ID
    );
    
    if (result?.statusCode === HTTPStatusCode.OK) {
      setDealowner(
        result.responseBody.details.Data.LeadTypeList.filter(
          (item) => item.value !== "0"
        ).map((item) => ({ ...item, text: item.value, value: item.text }))
      );
    }
  };

  useEffect(() => {
    if (watchDealSource?.value) {
      getLeadOwnerBytype(watchDealSource.value);
    }
  }, [watchDealSource, setValue]);

  // useEffect(() => {
  //   //     BR (Client Pay ) = select 2200 * 100 /(100-35) : Nontranspernt Modell
  //   //     BR (Client Pay ) = select 2200 *( 100+35) /100 : Transpernt Model
  //   let billRate = (watch("payRate") * 100) / (100 - watch("nrPercent"));
  //   if (isTransparentPricing) {
  //     billRate = (+watch("payRate") * (100 + +watch("nrPercent"))) / 100;
  //   }

  //   billRate && setValue("billRate", billRate.toFixed(2));
  // }, [
  //   watch("payRate"),
  //   preOnboardingDetailsForAMAssignment,
  //   watch("nrPercent"),
  // ]);

  const saveMember = (d) =>{
    let newMember = {
    "name": d.name,
    "designation": d.designation,
    "reportingTo": watch('reportingTo') ? watch('reportingTo').value : '',
    "linkedin": d.linkedin,
    "email": d.email,
    "buddy": watch('buddy') ? watch('buddy').value : ''
  }

  setAddMoreTeamMember(false)
  setClientTeamMembers(prev=> ([...prev, newMember]))
  memberUnregister('reportingTo')
  memberUnregister('memberName')
  memberUnregister('memberEmail')
  memberUnregister('memberDesignation')
  memberUnregister('memberBuddy')
  memberUnregister('linkedinLink')

}

const calcelMember = () =>{
  setAddMoreTeamMember(false)
  memberUnregister('reportingTo')
  memberUnregister('memberName')
  memberUnregister('memberEmail')
  memberUnregister('memberDesignation')
  memberUnregister('memberBuddy')
  memberUnregister('linkedinLink')
}


  const handleComplete = useCallback(
    async (d) => {
      setIsLoading(true);      
      let _payload = {
        "hR_ID": HRID,
        "companyID": data?.companyID,
        "deal_Owner": d?.dealOwner?.value,
        "deal_Source": d?.dealSource?.value,
        "lead_Type": null,
        "industry_Type": null,
        "onboard_ID":talentDeteils?.OnBoardId,
        "engagemenID": data?.engagemenID,
        "assignAM": assignAM,
        "talentID":talentDeteils?.TalentID,
        "tscUserId":d.AddTSCName ? +d.AddTSCName?.id : 0,
        "talentShiftStartTime":d.shiftStartTime?.value,
        "talentShiftEndTime": d.endTime?.value,
        "payRate": parseFloat(d.payRate),
        "billRate": data?.isHRTypeDP ? null : parseFloat(d.billRate),
        "netPaymentDays": parseInt(d.netTerm?.value),
        "nrMargin": !data?.isHRTypeDP ? d.nrPercent : null,
        "modeOFWorkingID": d?.modeOFWorkingID?.id,
        "city": d?.city,
        "stateID": d?.stateID?.id,
        "talent_Designation": d?.talent_Designation,
        "amSalesPersonID": d.amSalesPersonID?.id,
        "isReplacement": engagementReplacement?.replacementData,
        "uplersFeesAmount":data?.isHRTypeDP ? parseFloat(d?.uplersFee):null,
        "uplersFeesPerc":preONBoardingData?.preOnboardingDetailsForAMAssignment?.isHRTypeDP == false ? 
        ((d.billRate > 0 && d.payRate > 0) ?  (((d.billRate-d.payRate)/d.payRate)*100).toFixed(2)+ ' %' : 'NA')
        : ((d.uplersFee > 0 && d.payRate > 0) ?  ((d.uplersFee/d.payRate)*100).toFixed(2) + " %" :"NA"),
        "talentReplacement": {
          "onboardId": talentDeteils?.OnBoardId,
          "replacementID": 0,
          "hiringRequestID": HRID,
          "talentId": talentDeteils?.TalentID,
          "lastWorkingDay": engagementReplacement?.replacementData === true ? moment(d.lwd).format('yyyy-MM-DD') : null,
          "lastWorkingDateOption": 0,
          "noticeperiod": 0,
          "replacementStage": d.replaceStage?.value,
          "reasonforReplacement": d.replaceStage?.value,
          "replacementInitiatedby": loggedInUserID.toString(),
          "replacementHandledByID": null,
          "engagementReplacementOnBoardID": 0,
          "replacementTalentId": null,
          "engHRReplacement": engagementReplacement?.replacementData === true ? d.engagementreplacement?.id : null 
        },
        "updateClientOnBoardingDetails": {
          "hR_ID": HRID,
          "companyID": data?.companyID,
          "signingAuthorityName": null,
          "signingAuthorityEmail": null,
          "contractDuration": d.contractDuration,
          "onBoardID": talentDeteils?.OnBoardId,
          "about_Company_desc": d?.aboutCompany,
          "talent_FirstWeek": d?.firstWeek,
          "talent_FirstMonth": d?.firstMonth,
          "softwareToolsRequired": d?.softwareToolsRequired,
          "devicesPoliciesOption": !talentDeteils?.IsHRTypeDP ? d.devicePolicy.value : "",
          "talentDeviceDetails": !talentDeteils?.IsHRTypeDP ?  d.devicePolicy.id === 1 ? d.standerdSpecifications : '' : "",
          // "additionalCostPerMonth_RDPSecurity": 0,
          // "isRecurring": true,
          // "proceedWithUplers_LeavePolicyOption": null,
          // "proceedWithClient_LeavePolicyOption": null,
          "proceedWithClient_LeavePolicyLink": !talentDeteils?.IsHRTypeDP ?  d.leavePolicie.id === 2 ?  d.policyLink ? d.policyLink : "" : "" : "" ,
          "leavePolicyFileName": !talentDeteils?.IsHRTypeDP ?  d.leavePolicie.id === 2 ? getUploadFileData ? getUploadFileData : "" : "" : "" ,
          "exit_Policy": d?.exitPolicy,
          "hdnRadioDevicesPolicies": !talentDeteils?.IsHRTypeDP ?  d.devicePolicy.value : "",
          "device_Radio_Option": !talentDeteils?.IsHRTypeDP ?  d.devicePolicy.id === 2 ?  deviceMasters.filter(item=> item.id === d.deviceType.id)[0].deviceName : '' : "",
          "deviceID": !talentDeteils?.IsHRTypeDP ?  d.devicePolicy.id === 2 ? d.deviceType.id : 0 : 0,
          "client_DeviceDescription": !talentDeteils?.IsHRTypeDP ?  d.devicePolicy.id === 2 &&  d.deviceType.id === 3 ? d.otherDevice : '' :"" ,
          "totalCost": !talentDeteils?.IsHRTypeDP ?  d.devicePolicy.id === 2 ?  deviceMasters.filter(item=> item.id === d.deviceType.id)[0].deviceCost : 0 : 0,
          "radio_LeavePolicies": !talentDeteils?.IsHRTypeDP ?  d.leavePolicie.value : "",
          "leavePolicyPasteLinkName": !talentDeteils?.IsHRTypeDP ?  d.leavePolicie.id === 2 ?  d.policyLink ? d.policyLink : "" : "" : "",
          "teamMembers": clientTeamMembers
        }
      }      
            
      let result = await OnboardDAO.updateBeforeOnBoardInfoDAO(_payload);
      if (result?.statusCode === HTTPStatusCode.OK) {
        callAPI(HRID)
        getHrUserData(HRID)
        setMessage(result?.responseBody.details);
        setIsLoading(false);
        setEditBillRate(false);
        setEditPayRate(false);
        setEditNetTerm(false);
        setShowAMModal(false);
      }
      setIsLoading(false);
    },
    [
      talentDeteils,
      HRID,
      preONBoardingData,
      preOnboardingDetailsForAMAssignment,
      EnableNextTab,
      actionType,
      editPayRate,
      engagementReplacement?.replacementData,
      addLatter,
      assignAM,
      clientTeamMembers,getUploadFileData,deviceMasters
    ]
  );

  const disabledDate = (current) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return current && current < today;
  };

  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (err) {
      return false;
    }
  }

  useEffect(()=>{
    if(getUploadFileData){
        clearErrors('policyLink')
        unregister('policyLink')
    }
    if(watch("policyLink")){
        clearErrors('policyFile')
    }
},[watch("policyLink"),getUploadFileData])

  const uploadFileHandler = useCallback(
    async (fileData) => {
      setIsLoading(true);
      if (
        fileData?.type !== "application/pdf" &&
        fileData?.type !== "application/docs" &&
        fileData?.type !== "application/msword" &&
        fileData?.type !== "text/plain" &&
        fileData?.type !==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setValidation({
          ...getValidation,
          systemFileUpload:
            "Uploaded file is not a valid, Only pdf, docs, text and rtf files are allowed",
        });
        setIsLoading(false);
      } else if (fileData?.size >= 500000) {
        setValidation({
          ...getValidation,
          systemFileUpload:
            "Upload file size more than 500kb, Please Upload file upto 500kb",
        });
        setIsLoading(false);
      } else {
        let formData = new FormData();
        formData.append("File", fileData);
        let uploadFileResponse = await OnboardDAO.uploadPolicyDAO(
          formData,
          talentDeteils?.OnBoardId
        );
        if (uploadFileResponse.statusCode === 400) {
          setValidation({
            ...getValidation,
            systemFileUpload: uploadFileResponse?.responseBody,
          });
        }
        if (uploadFileResponse.statusCode === HTTPStatusCode.OK) {
          if (
            fileData?.type === "image/png" ||
            fileData?.type === "image/jpeg"
          ) {
            setUploadFileData(fileData?.name);
            setUploadModal(false);
            setValidation({
              ...getValidation,
              systemFileUpload: "",
            });
            message.success("File uploaded successfully");
          } else if (
            fileData?.type === "application/pdf" ||
            fileData?.type === "application/docs" ||
            fileData?.type === "application/msword" ||
            fileData?.type === "text/plain" ||
            fileData?.type ===
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          ) {
            setUploadFileData(fileData?.name);
            // setJDParsedSkills(
            //   uploadFileResponse && uploadFileResponse?.responseBody?.details
            // );
            // setJDDumpID(
            //                 uploadFileResponse &&
            //                     uploadFileResponse?.responseBody?.details?.JDDumpID,
            //             );
            setUploadModal(false);
            setValidation({
              ...getValidation,
              systemFileUpload: "",
            });
            message.success("File uploaded successfully");
          }
        }
        setIsLoading(false);
      }
      //   uploadFile.current.value = "";
    },
    [getValidation]
  );


  const addHttps = (url) => {
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }
    return url;
  };

  return (
    <div className={HRDetailStyle.onboardingProcesswrap}>
      <div className={`${HRDetailStyle.onboardingProcesspart} ${HRDetailStyle.onboardingReleaseOffer}`}>
        {isLoading ? (
          <Skeleton />
        ) : (
          <>           
            <div className={HRDetailStyle.onboardingProcesBox}>
              <div className={HRDetailStyle.onboardingProcessLeft}>
                <div>
                  <GeneralInformationSVG width="27" height="32" />
                </div>
                <h3 className={HRDetailStyle.titleLeft}>General Information</h3>
              </div>

              <div className={HRDetailStyle.onboardingProcessMid}>
                <div className={HRDetailStyle.modalFormWrapper}>

                  <div className={HRDetailStyle.modalFormCol}>        
                    <div className={HRDetailStyle.onboardingDetailText}>
                      <span>Company Name</span>
                      <span className={HRDetailStyle.onboardingTextBold}>
                        {preONBoardingData?.preOnboardingDetailsForAMAssignment?.companyName
                          ? preONBoardingData?.preOnboardingDetailsForAMAssignment?.companyName
                          : "NA"}
                      </span>
                    </div>
                  </div>

                  <div className={HRDetailStyle.modalFormCol}>
                    <div className={HRDetailStyle.onboardingDetailText}>
                      <span>Client Email/Name</span>
                      <span className={HRDetailStyle.onboardingTextBold}>
                        {preONBoardingData?.preOnboardingDetailsForAMAssignment?.client
                          ? preONBoardingData?.preOnboardingDetailsForAMAssignment?.client
                          : "NA"}
                      </span>
                    </div>
                  </div>

                  <div className={HRDetailStyle.modalFormCol}>
                    <div className={HRDetailStyle.onboardingDetailText}>
                      <span>HR ID</span>
                      <a
                        target="_blank"
                        href={`/allhiringrequest/${HRID}`}
                        rel="noreferrer"
                        className={HRDetailStyle.onboardingTextUnderline}
                      >
                        {preONBoardingData?.preOnboardingDetailsForAMAssignment?.hrNumber
                          ? preONBoardingData?.preOnboardingDetailsForAMAssignment?.hrNumber
                          : "NA"}
                      </a>
                    </div>
                  </div>

                  {/*<div className={HRDetailStyle.modalFormCol}>
                   <div className={HRDetailStyle.onboardingDetailText}>
                    <span>Country</span>
                    <span className={HRDetailStyle.onboardingTextBold}>
                      {preOnboardingDetailsForAMAssignment?.geo
                        ? preOnboardingDetailsForAMAssignment?.geo
                        : "NA"}
                    </span>
                  </div> 
                  </div>*/}

                  <div className={HRDetailStyle.modalFormCol}>
                    <div className={HRDetailStyle.onboardingDetailText}>
                      <span>No. of Employees</span>
                      <span className={HRDetailStyle.onboardingTextBold}>
                        {preONBoardingData?.preOnboardingDetailsForAMAssignment?.noOfEmployee
                          ? preONBoardingData?.preOnboardingDetailsForAMAssignment?.noOfEmployee
                          : "NA"}
                      </span>
                    </div>
                  </div>

                  <div className={HRDetailStyle.modalFormCol}>
                    <div className={HRDetailStyle.onboardingDetailText}>
                      <span>Client POC Name</span>
                      <span className={HRDetailStyle.onboardingTextBold}>
                        {preONBoardingData?.preOnboardingDetailsForAMAssignment?.client_POC_Name
                          ? preONBoardingData?.preOnboardingDetailsForAMAssignment?.client_POC_Name
                          : "NA"}
                      </span>
                    </div>
                  </div>

                  <div className={HRDetailStyle.modalFormCol}>
                    <div className={HRDetailStyle.onboardingDetailText}>
                      <span>Client POC Email</span>
                      <span className={HRDetailStyle.onboardingTextBold}>
                        {preONBoardingData?.preOnboardingDetailsForAMAssignment?.client_POC_Email
                          ? preONBoardingData?.preOnboardingDetailsForAMAssignment?.client_POC_Email
                          : "NA"}
                      </span>
                    </div>
                  </div>

                  <div className={HRDetailStyle.modalFormCol}>
                    <div className={HRDetailStyle.onboardingDetailText}>
                      <span>Industry</span>
                      <span className={HRDetailStyle.onboardingTextBold}>
                        {preONBoardingData?.preOnboardingDetailsForAMAssignment?.industry
                          ? preONBoardingData?.preOnboardingDetailsForAMAssignment?.industry
                          : "NA"}
                      </span>
                    </div>
                  </div>

                  <div className={HRDetailStyle.modalFormCol}>
                    <div className={HRDetailStyle.onboardingDetailText}>
                      <span>Discovery Call Link</span>
                      {preONBoardingData?.preOnboardingDetailsForAMAssignment
                            ?.discovery_Link && preONBoardingData?.preOnboardingDetailsForAMAssignment?.discovery_Link!=="NA" ?
                            <a target="_blank" href={preONBoardingData?.preOnboardingDetailsForAMAssignment?.discovery_Link!=="NA"&&addHttps(preONBoardingData?.preOnboardingDetailsForAMAssignment?.discovery_Link)} rel="noreferrer" className={HRDetailStyle.onboardingTextUnderline}>
                              {preONBoardingData?.preOnboardingDetailsForAMAssignment?.discovery_Link}</a>:"NA"}
                    </div>
                  </div>

                  <div className={HRDetailStyle.modalFormCol}>
                    <div className={HRDetailStyle.onboardingDetailText}>
                      <span>Job Description</span>
                      {/* <button className={HRDetailStyle.onboardingDownload}><DownloadJDSVG/>Download JD</button> */}

                      {preONBoardingData?.preOnboardingDetailsForAMAssignment?.jobDescription?.split(
                        ":"
                      )[0] === "http" ||
                      preONBoardingData?.preOnboardingDetailsForAMAssignment?.jobDescription?.split(
                        ":"
                      )[0] === "https" ? (
                        <a
                          className={HRDetailStyle.onboardingDownload}
                          rel="noreferrer"
                          href={preONBoardingData?.preOnboardingDetailsForAMAssignment?.jobDescription}
                          style={{ textDecoration: "underline" }}
                          target="_blank"
                        >
                          <DownloadJDSVG />
                          Download JD
                        </a>
                      ) : (
                        <a
                          className={HRDetailStyle.onboardingDownload}
                          rel="noreferrer"
                          href={
                            NetworkInfo.PROTOCOL +
                            NetworkInfo.DOMAIN +
                            "Media/JDParsing/JDfiles/" +
                            preONBoardingData?.preOnboardingDetailsForAMAssignment?.jobDescription
                          }
                          style={{ textDecoration: "underline" }}
                          target="_blank"
                        >
                          <DownloadJDSVG />
                          Download JD
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Hide deal source and owner */}
                  {/* <div className={HRDetailStyle.modalFormWrapper}>
                    <div className={HRDetailStyle.modalFormCol}>
                      <HRSelectField
                      controlledValue={controlledDealSource}
                      setControlledValue={setControlledDealSource}
                      isControlled={true}
                        mode="id/value"
                        setValue={setValue}
                        register={register}
                        label={"Deal Source"}
                        extraAction={()=>{setValue('dealOwner','');
                        setControlledDealOwner()}}
                        defaultValue={"Select Deal Source"}
                        name="dealSource"
                        options={dealSource && dealSource}
                        isError={errors["dealSource"] && errors["dealSource"]}
                        required
                        errorMsg={"Please select Deal Source"}
                        disabled={isTabDisabled}
                      />
                    </div>
                    <div className={HRDetailStyle.modalFormCol}>
                      <HRSelectField
                      controlledValue={controlledDealOwner}
                      setControlledValue={setControlledDealOwner}
                      isControlled={true}
                        mode="id/value"
                        setValue={setValue}
                        register={register}
                        label={"Deal Owner"}
                        defaultValue={"Select Deal Owner"}
                        name="dealOwner"
                        options={dealOwner && dealOwner}
                        isError={errors["dealOwner"] && errors["dealOwner"]}
                        required
                        errorMsg={"Please select Deal Owner"}
                        disabled={isTabDisabled}
                      />
                    </div>
                  </div> */}

                  {/* <div className={HRDetailStyle.onboardingCondition}>
                      <h5>Is this an Existing Client?</h5>

                      <label className={HRDetailStyle.radioCheck_Mark}>
                          <p>Yes</p>
                          <input
                              // {...register('remote')}
                              value={0}
                              type="radio"
                              // checked={checkednoValue}
                              // onChange={(e) => {
                              // 	checkedNo(e);
                              // }}
                              id="remote"
                              name="remote"
                          />
                          <span className={HRDetailStyle.customCheck_Mark}></span>
                      </label>
                      <label className={HRDetailStyle.radioCheck_Mark}>
                          <p>No</p>
                          <input
                              // {...register('remote')}
                              value={0}
                              type="radio"
                              // checked={checkednoValue}
                              // onChange={(e) => {
                              // 	checkedNo(e);
                              // }}
                              id="remote"
                              name="remote"
                          />
                          <span className={HRDetailStyle.customCheck_Mark}></span>
                      </label>

                  </div> */}
                </div>
              </div>
            </div>

            <div className={HRDetailStyle.onboardingProcesBox}>
              <div className={HRDetailStyle.onboardingProcessLeft}>
                <div>
                  <CurrentHrsSVG width="27" height="32" />
                </div>
                <h3 className={HRDetailStyle.titleLeft}>Client Handover</h3>
              </div>
              <div className={HRDetailStyle.onboardingProcessMid}>
                <div className={HRDetailStyle.modalFormWrapper}>
                  <div className={HRDetailStyle.colMd12}>
                  {!tempAMAssign &&<div className={`${HRDetailStyle.onboardingCurrentText} ${HRDetailStyle.onboardingAMAssignmentHead}`}>
                     <span>Do you want to assign an AM?</span>                       
                    <Radio.Group name="assignAM" value={assignAM} disabled={actionType==="Legal"?true:false} onChange={(e) => setAssignAM(e.target.value)}>
                          <Radio value={true}>Yes</Radio>
                          <Radio value={false}>No</Radio>
                    </Radio.Group>                    
                    </div>}
                  </div>
                {assignAM ?  
                <> 
                
                {tempAMAssign &&<div className={HRDetailStyle.colMd12}>
                <div className={`${HRDetailStyle.onboardingCurrentText} ${HRDetailStyle.onboardingAMAssignmentHead}`}>
                   <span >Would you like to continue managing this client, or would you prefer to hand it over to another sales person (AM or NBD)?</span>                       
                  <Radio.Group name="assignAM" value={assignAMnew} disabled={actionType==="Legal"?true:false} onChange={(e) => setAssignAMNew(e.target.value)} style={{display:'flex',flexDirection:'column',marginTop:'5px'}}>
                        <Radio value={true} style={{marginBottom:'5px'}} onChange={()=>{
                          let data = amUsers?.filter((item) => item.id === preONBoardingData?.preOnboardingDetailsForAMAssignment?.amUserID);
                          setValue("amSalesPersonID", data[0]);
                          setControlledAssignAM(data[0]);
                        }}>I would like to continue managing the client. </Radio>
                        <Radio value={false}>I prefer to hand over the client to another salesperson.</Radio>
                  </Radio.Group>                    
                  </div>
                </div>}
                  <div className={HRDetailStyle.colMd12}>             
                    <HRSelectField
                      isControlled={true}
                      controlledValue={controlledAssignAM}
                      setControlledValue={setControlledAssignAM}
                      mode="id/value"
                      setValue={setValue}
                      register={register}
                      label={"Current POC"}
                      defaultValue={"Select POC"}
                      name="amSalesPersonID"
                      options={amUsers && amUsers}
                      isError={errors["selectAM"] && errors["selectAM"]}
                      required
                      errorMsg={"Please select POC"}
                      disabled={actionType==="Legal"?true: assignAMnew ? true :  false}
                      searchable={true}
                    />
                  </div>
                  <div className={`${HRDetailStyle.modalFormCol} ${HRDetailStyle.assignmentCardTitle}`}>
                      Following HRs will be assigned to the selected Sales Person
                  </div>
                  {currentHRs?.length > 0 ? (
                    currentHRs
                      ?.map((HR) => (
                        <div className={HRDetailStyle.modalFormCol}>
                          <div
                            className={HRDetailStyle.onboardingCurrentTextWrap}
                            key={HR.hrNumber}
                          >
                            <div
                              className={HRDetailStyle.onboardingCurrentText}
                            >
                              <span>Open HR ID :</span>
                              <a
                                target="_blank"
                                href={`/allhiringrequest/${HR.hrid}`}
                                rel="noreferrer"
                                className={
                                  HRDetailStyle.onboardingTextUnderline
                                }
                              >
                                {HR.hrNumber}
                              </a>
                            </div>
                            <div
                              className={HRDetailStyle.onboardingCurrentText}
                            >
                              <span>Open HR Status :</span>
                              <span
                                className={HRDetailStyle.onboardingTextBold}
                              >
                                {HR.hrStatus}
                              </span>
                            </div>
                            <div
                              className={HRDetailStyle.onboardingCurrentText}
                            >
                              <span>Open TR of HR :</span>
                              <span
                                className={HRDetailStyle.onboardingTextBold}
                              >
                                {HR.noofTalents}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                      .slice(0, 10)
                  ) : (
                    <>
                      <div className={HRDetailStyle.colMd12}><div className={HRDetailStyle.assignmentNotAssign}>No HR Found for Handover</div></div>
                    </>
                  )}
                  </> : <div className={HRDetailStyle.colMd12}><div className={HRDetailStyle.assignmentNotAssign}>All the current HRs will not be assigned to any AMs</div></div>}
                </div>
              </div>
            </div>

            <div className={HRDetailStyle.onboardingProcesBox}>
              <div className={HRDetailStyle.onboardingProcessLeft}>
                <div>
                  <HireingRequestDetailSVG width="27" height="32" />
                </div>
                <h3 className={HRDetailStyle.titleLeft}>Current TSC</h3>
              </div>

              <div className={HRDetailStyle.onboardingProcessMid}>
                <div className={HRDetailStyle.modalFormWrapper}>
                <div className={HRDetailStyle.colMd12}>             
                    <HRSelectField
                      isControlled={true}
                      controlledValue={controlledTSC}
                      setControlledValue={setControlledTSC}
                      mode="id/value"
                      setValue={setValue}
                      register={register}
                      name="AddTSCName"
                      label="Select TSC Name"
                      defaultValue="Select TSC Name"
                      options={TSCusers && TSCusers}
                      // isError={errors["AddTSCName"] && errors["AddTSCName"]}
                      // required
                      errorMsg={"Please select TSC name"}
                      disabled={actionType==="Legal"?true:false}
                      searchable={true}
                    />
                  </div>
                </div>
              </div>
            </div>
            

            <div className={HRDetailStyle.onboardingProcesBox}>
              <div className={HRDetailStyle.onboardingProcessLeft}>
                <div>
                  <HireingRequestDetailSVG width="27" height="32" />
                </div>
                <h3 className={HRDetailStyle.titleLeft}>Engagement Terms</h3>
              </div>
              <div className={HRDetailStyle.onboardingProcessMid}>
                <div className={HRDetailStyle.modalFormWrapper}>
                  <div className={HRDetailStyle.modalFormCol}>
                    <div className={HRDetailStyle.onboardingDetailText}>
                      <span>Talent Name</span>
                      <span className={HRDetailStyle.onboardingTextBold}>
                        {preONBoardingData?.preOnboardingDetailsForAMAssignment?.talentName
                          ? preONBoardingData?.preOnboardingDetailsForAMAssignment?.talentName
                          : "NA"}
                      </span>
                    </div>
                  </div>

                  <div className={HRDetailStyle.modalFormCol}>
                    <div className={HRDetailStyle.onboardingDetailText}>
                      <span>Talent Profile Link</span>
                      <span className={HRDetailStyle.onboardingTextBold}>
                        <a
                        target="_blank"
                        href={preONBoardingData?.preOnboardingDetailsForAMAssignment?.talentProfileLink}
                        rel="noreferrer"
                        className={HRDetailStyle.onboardingTextUnderline}
                      >
                        {preONBoardingData?.preOnboardingDetailsForAMAssignment?.talentProfileLink
                          ? preONBoardingData?.preOnboardingDetailsForAMAssignment?.talentProfileLink
                          : "NA"}
                      </a>
                      </span>
                    </div>
                  </div>

                  <div className={HRDetailStyle.modalFormCol}>
                    <div className={HRDetailStyle.onboardingDetailText}>
                      <span>Availability</span>
                      <span className={HRDetailStyle.onboardingTextBold}>
                        {preONBoardingData?.preOnboardingDetailsForAMAssignment?.availability
                          ? preONBoardingData?.preOnboardingDetailsForAMAssignment?.availability
                          : "NA"}
                      </span>
                    </div>
                  </div>

                  <div className={HRDetailStyle.modalFormCol}>
                    <div className={HRDetailStyle.modalFormColRow}>
                      <div className={HRDetailStyle.modalFormCol}>
                        <div className={HRDetailStyle.timeSlotItemField}>
                          <div className={HRDetailStyle.timeSlotLabel}>
                            Talent Shift Start Time <span>*</span>
                          </div>
                          <div className={`${HRDetailStyle.timeSlotItem} ${HRDetailStyle.formGroup}`}>
                            {/* <ClockIconSVG /> */}
                            <HRSelectField
                            controlledValue={controlledFromTimeValue}
                            setControlledValue={val=> {setControlledFromTimeValue(val);
                            let index = getStartEndTimes.findIndex(item=> item.value === val)
                            if(index >= getStartEndTimes.length -18){         
                              let newInd =   index - (getStartEndTimes.length -18)
                              let endtime = getStartEndTimes[newInd]
                              setControlledEndTimeValue(
                                endtime.value
                              );
                              setValue(
                                "endTime",{id: "", value: endtime.value}  
                              );
                          }else{
                              let endtime = getStartEndTimes[index + 18]
                              setControlledEndTimeValue(
                                endtime.value
                              );
                              setValue(
                                "endTime",{id: "", value: endtime.value}  
                              );
                          };
                        }}
                        isControlled={true}
                        mode={"id/value"}
                        setValue={setValue}
                        register={register}
                        searchable={true}
                        defaultValue="Select From Time"
                        options={getStartEndTimes.map((item) => ({
                          id: item.id,
                          label: item.text,
                          value: item.value,
                        }))}
                        name="shiftStartTime"
                        isError={errors["shiftStartTime"] && errors["shiftStartTime"]}
                        required={true}
                        disabled={actionType==="Legal"?true:false}
                        errorMsg={errors["shiftStartTime"] ?
                          errors["shiftStartTime"].message.length > 0 ?
                            errors["fromTime"].message : "Please select from time." : "Please select from time."}
                      />
                            {/* {errors.shiftStartTime && (
                              <div className={HRDetailStyle.error}>
                                Please enter start time
                              </div>
                            )} */}
                          </div>
                        </div>
                      </div>

                      <div className={HRDetailStyle.modalFormCol}>
                        <div className={HRDetailStyle.timeSlotItemField}>
                          <div className={HRDetailStyle.timeSlotLabel}>
                            Talent Shift End Time <span>*</span>
                          </div>
                          <div className={`${HRDetailStyle.timeSlotItem} ${HRDetailStyle.formGroup}`}>
                            {/* <ClockIconSVG /> */}
                            <HRSelectField
                        controlledValue={controlledEndTimeValue}
                        setControlledValue={setControlledEndTimeValue}
                        isControlled={true}
                        mode={"id/value"}
                        setValue={setValue}
                        register={register}
                        searchable={true}
                        defaultValue="Select End Time"
                        options={getStartEndTimes.map((item) => ({
                          id: item.id,
                          label: item.text,
                          value: item.value,
                        }))}
                        disabled={actionType==="Legal"?true:false}
                        name="shiftEndTime"
                        isError={errors["shiftEndTime"] && errors["shiftEndTime"]}
                        required={true}
                        errorMsg={"Please select end time."}
                      />
                            {/* {errors.shiftEndTime && (
                              <div className={HRDetailStyle.error}>
                                Please enter end time
                              </div>
                            )} */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={HRDetailStyle.modalFormCol}>
                    {/* {editNetTerm ? ( */}
                      {/* <HRSelectField
                      register={register}
                      errors={errors}
                      label="Payment Net Term"
                      name="netTerm"
                      type={InputType.TEXT}
                      placeholder="Payment Net Term"
                      validationSchema={{
                        required: "please select Payment Net Term.",
                        min: 1,
                      }}
                      isError={errors["netTerm"] && errors["netTerm"]}
                      errorMsg={"please select Payment Net Term"}
                      required
                    /> */}
                    <HRSelectField
                      isControlled={true}
                      controlledValue={controlledPaymentNetTerm}
                      setControlledValue={setControlledPaymentNetTerm}
                      mode="id/value"
                      setValue={setValue}
                      register={register}
                      label={"Payment Net Term"}
                      defaultValue={"Select Payment Net Term"}
                      name="netTerm"
                      options={netTerms && netTerms}
                      isError={errors["netTerm"] && errors["netTerm"]}
                      required
                      errorMsg={"Please select Payment Net Term"}
                      disabled={actionType==="Legal"?true:false}
                      searchable={true}
                    />
                  </div>

                  {preONBoardingData?.preOnboardingDetailsForAMAssignment?.isHRTypeDP==true ?
                  <div className={HRDetailStyle.modalFormCol}> 
                  <>
                    {editUplersFee ? (
                      <HRInputField
                        register={register}
                        errors={errors}
                        validationSchema={{
                          required: "please enter the Uplers Fee.",
                        }}
                        required
                        label="Uplers Fee (One-time)"
                        name="uplersFee"
                        type={InputType.NUMBER}
                        placeholder={preONBoardingData?.preOnboardingDetailsForAMAssignment?.isHRTypeDP==true 
                          ?"USD 4000/Year":"USD 4000/Month"}
                        // value={watch('billRate')}
                        leadingIcon={
                          preONBoardingData
                            ?.preOnboardingDetailsForAMAssignment
                            ?.currencySign
                        }
                        trailingIcon={
                          <div className={HRDetailStyle.infotextWrapper}>
                          {preONBoardingData?.preOnboardingDetailsForAMAssignment?.isHRTypeDP==true 
                            ? `${preONBoardingData?.preOnboardingDetailsForAMAssignment?.talent_CurrencyCode} / Year`
                            : `${preONBoardingData?.preOnboardingDetailsForAMAssignment?.talent_CurrencyCode} / Month`}
                          <EditFieldSVG
                            width="16"
                            height="16"
                            onClick={() => setEditUplersFee(false)}
                          />
                          </div>
                        }
                      />
                    ) : (
                      <HRInputField
                        register={register}
                        errors={errors}
                        validationSchema={{
                          required: "please enter the Uplers Fee.",
                        }}
                        required
                        label="Uplers Fee (One-time)"
                        name="uplersFee"
                        type={InputType.TEXT}
                        placeholder={preONBoardingData?.preOnboardingDetailsForAMAssignment?.isHRTypeDP==true 
                          ?"USD 4000/Year":"USD 4000/Month"}
                        // value={watch('billRate')}
                        leadingIcon={
                          preONBoardingData
                            ?.preOnboardingDetailsForAMAssignment
                            ?.currencySign
                        }
                        disabled
                        trailingIcon={
                          <div className={HRDetailStyle.infotextWrapper}>
                            {preONBoardingData?.preOnboardingDetailsForAMAssignment?.isHRTypeDP==true 
                            ? `${preONBoardingData?.preOnboardingDetailsForAMAssignment?.talent_CurrencyCode} / Year`
                            : `${preONBoardingData?.preOnboardingDetailsForAMAssignment?.talent_CurrencyCode} / Month`}
                            
                         {actionType!=="Legal" && <EditFieldSVG
                            width="16"
                            height="16"
                            onClick={() => {
                              setEditUplersFee(true);
                              setValue(
                                "uplersFee",
                                extractNumberFromString(watch("uplersFee"))
                              );
                            }}
                          />}
                          </div>
                        }
                      />
                    )}
                  </>
                </div>
                 :<div className={HRDetailStyle.modalFormCol}> 
                    <>
                      {editBillRate ? (
                        <HRInputField
                          register={register}
                          errors={errors}
                          validationSchema={{
                            required: "please enter the Bill Rate.",
                          }}
                          required
                          label="Bill Rate"
                          name="billRate"
                          type={InputType.NUMBER}
                          placeholder={preONBoardingData?.preOnboardingDetailsForAMAssignment?.isHRTypeDP==true 
                            ?"USD 4000/Year":"USD 4000/Month"}
                          // value={watch('billRate')}
                          leadingIcon={
                            preONBoardingData
                              ?.preOnboardingDetailsForAMAssignment
                              ?.currencySign
                          }
                          trailingIcon={
                            <div className={HRDetailStyle.infotextWrapper}>
                            {preONBoardingData?.preOnboardingDetailsForAMAssignment?.isHRTypeDP==true 
                              ? `${preONBoardingData?.preOnboardingDetailsForAMAssignment?.talent_CurrencyCode} / Year`
                              : `${preONBoardingData?.preOnboardingDetailsForAMAssignment?.talent_CurrencyCode} / Month`}
                            <EditFieldSVG
                              width="16"
                              height="16"
                              onClick={() => setEditBillRate(false)}
                            />
                            </div>
                          }
                        />
                      ) : (
                        <HRInputField
                          register={register}
                          errors={errors}
                          validationSchema={{
                            required: "please enter the Bill Rate.",
                          }}
                          required
                          label="Bill Rate"
                          name="billRate"
                          type={InputType.TEXT}
                          placeholder={preONBoardingData?.preOnboardingDetailsForAMAssignment?.isHRTypeDP==true 
                            ?"USD 4000/Year":"USD 4000/Month"}
                          // value={watch('billRate')}
                          leadingIcon={
                            preONBoardingData
                              ?.preOnboardingDetailsForAMAssignment
                              ?.currencySign
                          }
                          disabled
                          trailingIcon={
                            <div className={HRDetailStyle.infotextWrapper}>
                              {preONBoardingData?.preOnboardingDetailsForAMAssignment?.isHRTypeDP==true 
                              ? `${preONBoardingData?.preOnboardingDetailsForAMAssignment?.talent_CurrencyCode} / Year`
                              : `${preONBoardingData?.preOnboardingDetailsForAMAssignment?.talent_CurrencyCode} / Month`}
                              
                           {actionType!=="Legal" && <EditFieldSVG
                              width="16"
                              height="16"
                              onClick={() => {
                                setEditBillRate(true);
                                setValue(
                                  "billRate",
                                  extractNumberFromString(watch("billRate"))
                                );
                              }}
                            />}
                            </div>
                          }
                        />
                      )}
                    </>
                  </div>}

                  

                  {/* {preOnboardingDetailsForAMAssignment?.isHRTypeDP ? (
                    <div className={HRDetailStyle.modalFormCol}>
                      <HRInputField
                        register={register}
                        errors={errors}
                        // validationSchema={{
                        //   required: "please enter the DP Amount.",
                        // }}
                        // required
                        label="DP amount"
                        name="dpAmount"
                        type={InputType.TEXT}
                        placeholder="USD 4000/Month"
                        disabled
                      />
                    </div>
                  ) : ( */}
                  <div className={HRDetailStyle.modalFormCol}>
                    {editPayRate ? (
                      <HRInputField
                        register={register}
                        errors={errors}
                        validationSchema={{
                          required: "please enter the Pay Rate.",
                          min: {
                            value: 0,
                            message: "Please enter greter then 0",
                          },
                        }}
                        label="Pay Rate"
                        required
                        name="payRate"
                        type={InputType.NUMBER}
                        placeholder="USD 4000/Month"
                        leadingIcon={
                          preONBoardingData?.preOnboardingDetailsForAMAssignment
                            ?.currencySign
                        }
                        // value="USD 4000/Month"
                        trailingIcon={
                          <div className={HRDetailStyle.infotextWrapper}>
                            {preONBoardingData?.preOnboardingDetailsForAMAssignment?.isHRTypeDP==true 
                              ? `${preONBoardingData?.preOnboardingDetailsForAMAssignment?.talent_CurrencyCode} / Year`
                              : `${preONBoardingData?.preOnboardingDetailsForAMAssignment?.talent_CurrencyCode} / Month`}
                            <EditFieldSVG
                              width="16"
                              height="16"
                              onClick={() => {
                                setEditPayRate(false);
                                // setValue('netTerm',extractNumberFromString(watch('netTerm')))
                              }}
                            />
                          </div>
                        }
                      />
                    ) : (
                      <HRInputField
                        register={register}
                        errors={errors}
                        validationSchema={{
                          required: "please enter the Pay Rate.",
                        }}
                        required
                        label="Pay Rate"
                        name="payRate"
                        type={InputType.TEXT}
                        placeholder="USD 4000/Month"
                        // value="USD 4000/Month"
                        disabled
                        leadingIcon={
                          preONBoardingData?.preOnboardingDetailsForAMAssignment
                            ?.currencySign
                        }
                        trailingIcon={
                          <div className={HRDetailStyle.infotextWrapper}>
                            {preONBoardingData?.preOnboardingDetailsForAMAssignment?.isHRTypeDP==true 
                              ? `${preONBoardingData?.preOnboardingDetailsForAMAssignment?.talent_CurrencyCode} / Year`
                              : `${preONBoardingData?.preOnboardingDetailsForAMAssignment?.talent_CurrencyCode} / Month`}
                            {actionType!=="Legal" && (
                              <EditFieldSVG
                                width="16"
                                height="16"
                                onClick={() => {
                                  setEditPayRate(true);
                                  // setValue(
                                  //   "payRate",
                                  //   extractNumberFromString(watch("payRate"))
                                  // );
                                }}
                              />
                            )}
                          </div>
                        }
                      />
                    )}
                  </div>
                  {/* // )} */}

                  <div className={HRDetailStyle.modalFormCol}>
                    <div className={HRDetailStyle.onboardingDetailText}>
                      <span>Uplers Fees</span>
                      <span className={HRDetailStyle.onboardingTextBold}>
                        { 
                        preONBoardingData?.preOnboardingDetailsForAMAssignment?.isHRTypeDP == false ? 
                        ((watch("billRate") > 0 && watch("payRate") > 0) ?  (((watch("billRate")-watch("payRate"))/watch("payRate"))*100).toFixed(2)+ ' %' : 'NA' ) 
                        : ((watch("uplersFee") > 0 && watch("payRate") > 0) ?  ((watch("uplersFee")/watch("payRate"))*100).toFixed(2) + " %" :"NA")
                        }
                        {/* {preOnboardingDetailsForAMAssignment?.talentRole
                          ? preOnboardingDetailsForAMAssignment?.talentRole
                          : "NA"} */}
                        {/* 35 % */}
                      </span>
                    </div>
                  </div>

                  <div className={HRDetailStyle.modalFormCol}>
                    {editMOF ? (
                      <HRSelectField
                        controlledValue={controlledIMOW}
                        setControlledValue={setControlledMOW}
                        isControlled={true}
                        mode="id/value"
                        setValue={setValue}
                        register={register}
                        label={"Mode of Working"}
                        defaultValue={"Select Mode of  Working"}
                        name="modeOFWorkingID"
                        options={workingMode && workingMode}
                        isError={errors["modeOFWorkingID"] && errors["modeOFWorkingID"]}
                        required
                        errorMsg={"Please select Mode of  Working"}
                        disabled={actionType==="Legal"?true:false}
                      />
                    ) : (
                      // <HRInputField
                      //   register={register}
                      //   errors={errors}
                      //   label="Mode of  Working"
                      //   name="modeOFWorkingID"
                      //   type={InputType.TEXT}
                      //   placeholder="Mode of Working"
                      //   validationSchema={{
                      //     required: "please select Mode of  Working.",
                      //     min: 1,
                      //   }}
                      //   value={watch('modeOFWorkingID')?.value ? watch('modeOFWorkingID')?.value : ""}
                      //   isError={errors["modeOfWorking"] && errors["modeOfWorking"]}
                      //   errorMsg={"Please select Mode of  Working"}
                      //   required
                      //   disabled
                      //   trailingIcon={
                      //     !isTabDisabled && (
                      //       <EditFieldSVG
                      //         width="16"
                      //         height="16"
                      //         onClick={() => setEditMOF(true)}
                      //       />
                      //     )
                      //   }
                      // />
                      <HRSelectField
                        controlledValue={controlledIMOW}
                        setControlledValue={setControlledMOW}
                        isControlled={true}
                        mode="id/value"
                        setValue={setValue}
                        register={register}
                        label={"Mode of Working"}
                        defaultValue={"Select Mode of  Working"}
                        name="modeOFWorkingID"
                        options={workingMode && workingMode}
                        isError={errors["modeOFWorkingID"] && errors["modeOFWorkingID"]}
                        required
                        errorMsg={"Please select Mode of  Working"}
                        disabled={actionType==="Legal"?true:false}                      
                      />
                    )}
                  </div>

                  {/* already had code */}

                 {/* {watch("modeOFWorkingID")?.id!==1 && 
                 <div className={HRDetailStyle.modalFormCol}>
                    {editCity ? (
                      <HRInputField
                      register={register}
                      errors={errors}
                      label="City"
                      name="city"
                      type={InputType.TEXT}
                      placeholder="City"
                      validationSchema={{
                        required: "please enter City.",
                        min: 1,
                      }}
                      // isError={errors["city"] && errors["city"]}
                      // errorMsg={"Please enter City"}
                      required
                    />
                    ) : (
                      <HRInputField
                        register={register}
                        errors={errors}
                        label="City"
                        name="city"
                        type={InputType.TEXT}
                        placeholder="City"
                        validationSchema={{
                          required: "please enter City.",
                          min: 1,
                        }}
                        // isError={errors["city"] && errors["city"]}
                        // errorMsg={"Please enter City"}
                        required
                        disabled
                        trailingIcon={
                          actionType!=="Legal" && (
                            <EditFieldSVG
                              width="16"
                              height="16"
                              onClick={() => setEditCity(true)}
                            />
                          )
                        }
                      />
                    )}
                  </div>} */}

            {watch("modeOFWorkingID")?.id!==1 && 
                  <div className={HRDetailStyle.modalFormCol}>           
                  <label>
                    City <span className={HRDetailStyle.reqField}>*</span>
                  </label>        
                      <Controller
                        render={({ ...props }) => (
                          <AutoComplete
                            options={locationList ?? []}
                            onSelect={async (locName, _obj) => {
                              setLocationSelectValidation(false);                            
                            }}
                            filterOption={true}
                            onSearch={(searchValue) => {
                              onChangeLocation(searchValue);
                            }}
                            onChange={(locName) => {
                              setValue("city", locName);
                            }}
                            onBlur={e=>{
                              const isValidSelection = locationList?.some(
                                (location) => location.value === e.target.value
                            );
                            if (!isValidSelection) {    
                              setLocationSelectValidation(true)
                            }
                            }}
                            placeholder="Enter City"                      
                            value={watch("city")}
                            disabled={actionType==="Legal"?true:false} 
                          />
                        )}
                        {...register("city", {
                          required:
                          watch("modeOFWorkingID")?.id === 2 ||
                          watch("modeOFWorkingID")?.id === 3
                              ? true
                              : false,
                        })}
                        name="city"
                        control={control}
                      />
                      {errors.city ? 
                      (
                        <div className={HRDetailStyle.error}>
                          * Please Select Location
                        </div>
                      ):
                      locationSelectValidation ? (
                        <div className={HRDetailStyle.error}>
                          * Choose a valid option from the suggestions.
                        </div>
                      ) :""}                
                  </div>
                }

                  <div className={HRDetailStyle.modalFormCol}>
                    {editDesignation ? (
                     <HRInputField
                     register={register}
                     errors={errors}
                     label="Talent’s Designation"
                     name="talent_Designation"
                     type={InputType.TEXT}
                     placeholder="Talent’s Designation"
                     validationSchema={{
                       required: "please enter Talent’s Designation.",
                       min: 1,
                     }}
                     isError={errors["designation"] && errors["designation"]}
                     errorMsg={"Please enter Talent’s Designation"}
                     required
                    
                   />
                    ) : (
                      <HRInputField
                        register={register}
                        errors={errors}
                        label="Talent’s Designation"
                        name="talent_Designation"
                        type={InputType.TEXT}
                        placeholder="Talent’s Designation"
                        validationSchema={{
                          required: "please enter Talent’s Designation.",
                          min: 1,
                        }}
                        isError={errors["designation"] && errors["designation"]}
                        errorMsg={"Please enter Talent’s Designation"}
                        required
                        disabled
                        trailingIcon={
                          actionType!=="Legal" && (
                            <EditFieldSVG
                              width="16"
                              height="16"
                              onClick={() => setEditDesignation(true)}
                            />
                          )
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className={HRDetailStyle.onboardingProcesBox}>
              <div className={HRDetailStyle.onboardingProcessLeft}>
                <div><AboutCompanySVG width="30" height="32" /></div>
                <h3 className={HRDetailStyle.titleLeft}>About Company</h3>
              </div>
              <div className={HRDetailStyle.onboardingProcessMid}>
                <div className={HRDetailStyle.modalFormWrapper}>
                  <div className={`${HRDetailStyle.colMd12} ${HRDetailStyle.colmb32}`}>
                    {/* <HRInputField
                      isTextArea={true}
                      errors={errors}
                      className="TextAreaCustom"
                      label={"A bit about company culture "}
                      register={register}
                      name="aboutCompany"
                      type={InputType.TEXT}
                      placeholder="Enter here"
                      required
                      validationSchema={{
                        required: "please enter a bit about company culture.",
                      }}
                      disabled={actionType==="Legal"?true:false}
                    /> */}
                    {actionType=="Legal"?<div className="editor-container">
                      <label className={HRDetailStyle.editorLabel}>A bit about company culture <span className={HRDetailStyle.editorLabelReq}>*</span></label>
                      <ReactQuill
                        className={HRDetailStyle.quillContent}
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        theme="snow"
                        value={
                          watch("aboutCompany")
                        }
                        required
                        readOnly={true}
                        validationSchema={{
                          required: "please enter a bit about company culture.",
                        }}
                        isError={errors["aboutCompany"] && errors["aboutCompany"]}
                        name="aboutCompany"
                        onChange={(val) => {
                          let _updatedVal = val?.replace(/<img\b[^>]*>/gi, '');
                          setValue("aboutCompany", _updatedVal)}}
                        errorMsg={"Please enter Talent’s Designation"}
                      />
                    {errors?.aboutCompany && (
                      <p className={HRDetailStyle.error}>
                        *Please enter About company
                      </p>
                     )} 
                  </div>:<div className="editor-container">
                      <label className={HRDetailStyle.editorLabel}>A bit about company culture <span className={HRDetailStyle.editorLabelReq}>*</span></label>
                      <ReactQuill
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        theme="snow"
                        className="heightSize"
                        value={
                          watch("aboutCompany")
                        }
                        required
                        validationSchema={{
                          required: "please enter a bit about company culture.",
                        }}
                        isError={errors["aboutCompany"] && errors["aboutCompany"]}
                        name="aboutCompany"
                        onChange={(val) => {
                          let _updatedVal = val?.replace(/<img\b[^>]*>/gi, '');
                          setValue("aboutCompany", _updatedVal)}
                        }
                        errorMsg={"Please enter Talent’s Designation"}
                      />
                    {errors?.aboutCompany && (
                      <p className={HRDetailStyle.error}>
                        *Please enter About company
                      </p>
                     )} 
                  </div>}
                    
                  </div>
                  <div className={HRDetailStyle.colMd12}>
                    <HRInputField
                      isTextArea={true}
                      errors={errors}
                      label={"How does the first week look like"}
                      register={register}
                      name="firstWeek"
                      type={InputType.TEXT}
                      placeholder="Enter here"
                      required
                      validationSchema={{
                        required:
                          "please enter how does the first week look like.",
                      }}
                      disabled={actionType==="Legal"?true:false}
                    />
                  </div>
                  <div className={HRDetailStyle.colMd12}>
                    <HRInputField
                      isTextArea={true}
                      errors={errors}
                      label={"How does the first month look like"}
                      register={register}
                      name="firstMonth"
                      type={InputType.TEXT}
                      placeholder="Enter here"
                      required
                      validationSchema={{
                        required:
                          "please enter how does the first month look like.",
                      }}
                      disabled={actionType==="Legal"?true:false}
                    />
                  </div>

                  {/* {!talentDeteils?.IsHRTypeDP && ( */}
                    <>
                      <div className={HRDetailStyle.colMd12}>
                        <HRInputField
                          isTextArea={true}
                          errors={errors}
                          label={"Softwares & Tools Required"}
                          register={register}
                          name="softwareToolsRequired"
                          type={InputType.TEXT}
                          placeholder="Enter Softwares and Tools which will be required"
                          required={!talentDeteils?.IsHRTypeDP}
                          validationSchema={{
                            required:
                              "please enter softwares and tools which will be required.",
                          }}
                          disabled={actionType==="Legal"?true:false}
                        />
                        {/* <HRSelectField
                            isControlled={true}
                            mode="id/value"
                            setValue={setValue}
                            register={register}
                            label={'Softwares & Tools Required'}
                            // defaultValue={'Enter Softwares and Tools which will be required'}
                            placeholder={'Enter Softwares and Tools which will be required'}
                            name="Mode of Working"
                            isError={errors['departMent'] && errors['departMent']}
                            required
                            errorMsg={'Please select department'}
                        /> */}
                      </div>
                      {/* <div className={HRDetailStyle.colMd12}>
                        <HRInputField
                          isTextArea={true}
                          errors={errors}
                          label={"Feedback Process"}
                          register={register}
                          name="firstMonth"
                          type={InputType.TEXT}
                          placeholder="Enter here"
                          required
                          validationSchema={{
                            required: "please enter Feedback Process.",
                          }}
                          disabled={actionType==="Legal"?true:false}
                        />
                      </div> */}
                      <div className={HRDetailStyle.colMd12}>
                        <HRSelectField
                          controlledValue={controlledDevicePolicy}
                          setControlledValue={setControlledDevicePolicy}
                          isControlled={true}
                          mode="id/value"
                          setValue={setValue}
                          register={register}
                          label={"Device Policy"}
                          // defaultValue={'Enter Device Policy'}
                          options={devicePolices}
                          placeholder={"Select Device Policy"}
                          name="devicePolicy"
                          isError={
                            errors["devicePolicy"] && errors["devicePolicy"]
                          }
                          required={!talentDeteils?.IsHRTypeDP}
                          errorMsg={"please select device policy."}
                          disabled={actionType==="Legal"?true:false}
                        />
                      </div>

                      {watchDevicePolicy?.id === 1 && (
                        <div className={HRDetailStyle.colMd12}>
                          <HRInputField
                            isTextArea={true}
                            errors={errors}
                            // label={'Softwares & Tools Required'}
                            register={register}
                            name="standerdSpecifications"
                            type={InputType.TEXT}
                            placeholder="Specify standard specifications, If any"
                            required={watchDevicePolicy?.id === 1}
                            disabled={actionType==="Legal"?true:false}
                          />
                        </div>
                      )}

                      {watchDevicePolicy?.id === 2 && (
                        <div className={HRDetailStyle.colMd12}>
                          <HRSelectField
                            controlledValue={controlledDeviceType}
                            setControlledValue={setControlledDeviceType}
                            isControlled={true}
                            mode="id/value"
                            setValue={setValue}
                            register={register}
                            className="leavePolicylabel"
                            // label={'Leave Polices'}
                            options={
                              deviceMasters.length
                                ? deviceMasters.map((device) => {
                                    if (device.id !== 3) {
                                      return {
                                        id: device.id,
                                        value: `${device.deviceName} $ ${device.deviceCost} USD `,
                                      };
                                    }
                                    return {
                                      id: device.id,
                                      value: device.deviceName,
                                    };
                                  })
                                : []
                            }
                            defaultValue={"Select Device"}
                            name="deviceType"
                            isError={
                              errors["deviceType"] && errors["deviceType"]
                            }
                            required={
                              watchDevicePolicy?.id === 2 ? true : false
                            }
                            errorMsg={"please select device."}
                            disabled={actionType==="Legal"?true:false}
                          />
                        </div>
                      )} 

                      {watchDevicePolicy?.id === 2 &&
                        watch("deviceType")?.id === 3 && (
                          <div className={HRDetailStyle.colMd12}>
                            <HRInputField
                              isTextArea={true}
                              errors={errors}
                              // label={'Softwares & Tools Required'}
                              register={register}
                              name="otherDevice"
                              type={InputType.TEXT}
                              placeholder=""
                              disabled={actionType==="Legal"?true:false}
                            />
                          </div>
                        )}

                      <div className={HRDetailStyle.modalFormCol}>
                        <div className={HRDetailStyle.modalFormLeaveUnderLine}>
                          <HRSelectField
                            controlledValue={controlledLeavePolicy}
                            setControlledValue={setControlledLeavePolicy}
                            isControlled={true}
                            mode="id/value"
                            setValue={setValue}
                            register={register}
                            className="leavePolicylabel"
                            label={"Leave Polices"}
                            placeholder={"Select Leave Polices"}
                            options={leavePolices}
                            // defaultValue={'Proceed with Uplers Policies'}
                            name="leavePolicie"
                            isError={
                              errors["leavePolicie"] && errors["leavePolicie"]
                            }
                            required={!talentDeteils?.IsHRTypeDP}
                            errorMsg={"please select leave policy."}
                            disabled={actionType==="Legal"?true:false}
                          />
                        </div>
                      </div>

                      <div className={HRDetailStyle.modalFormCol}>
                        <div className={HRDetailStyle.modalFormEdited}>
                          <HRInputField
                            register={register}
                            errors={errors}
                            label="Exit Policy"
                            name="exitPolicy"
                            type={InputType.TEXT}
                            placeholder="First Month"
                            // value="First Month - 7 Days Second Month Onwards - 30 Days"
                            disabled
                            required={!talentDeteils?.IsHRTypeDP}
                            validationSchema={{
                              required: "please enter Exit Policy.",
                            }}
                            // trailingIcon= {<EditFieldSVG width="16" height="16" />}
                          />
                        </div>
                      </div>
                    </>
                  {/* )} */}
                  {watch("leavePolicie")?.id === 1 && (
                    <a
                      href={uplersLeavePolicyLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{ padding: "0px 10px 20px 10px" }}
                    >
                      {uplersLeavePolicyLink}
                    </a>
                  )}

                  {watch("leavePolicie")?.id === 2 && (
                  <>
                    <div className={HRDetailStyle.colMd12}>
                      <div className={HRDetailStyle.modalFormEdited}>
                        <HRInputField
                          register={register}
                          errors={errors}
                          validationSchema={{
                            // required: 'please enter Link URL.',
                            validate: (value) => {
                              if (!isValidUrl(value)) {
                                return "Please Enter valid URL";
                              }
                            },
                          }}
                          errorMsg={"please enter Link URL."}
                          label="Leave Polices Link"
                          name="policyLink"
                          type={InputType.TEXT}
                          placeholder="Enter Policy Link"
                          required={getUploadFileData ? false : true}
                          disabled={
                            actionType==="Legal"
                              ? true
                              : getUploadFileData
                              ? true
                              : false
                          }
                        />
                      </div>
                      <h5
                        style={{
                          textAlign: "center",
                          fontSize: "18px",
                          fontWeight: 600,
                        }}
                      >
                        OR
                      </h5>
                    </div>
                    <div className={HRDetailStyle.colMd12}>
                      <div className={HRDetailStyle.modalFormEdited}>
                        {!getUploadFileData ? (
                          <HRInputField
                            disabled={
                              actionType==="Legal"
                                ? true
                                : watch("policyLink")
                                ? true
                                : false
                            }
                            register={register}
                            leadingIcon={<UploadSVG />}
                            label="Upload Polices"
                            name="policyFile"
                            type={InputType.BUTTON}
                            buttonLabel="Upload Polices"
                            setValue={setValue}
                            required={watch("policyLink") ? false : true}
                            onClickHandler={() => setUploadModal(true)}
                            //   validationSchema={{
                            //     required: "please select a file.",
                            //   }}
                            errorMsg={"please select a file."}
                            errors={errors}
                          />
                        ) : (
                          <div className={HRDetailStyle.uploadedJDWrap}>
                            <label>Upload Policy *</label>
                            <div className={HRDetailStyle.uploadedJDName}>
                              {getUploadFileData}{" "}
                              {actionType!=="Legal" && (
                                <CloseSVG
                                  className={HRDetailStyle.uploadedJDClose}
                                  onClick={() => {
                                    // setJDParsedSkills({});
                                    setUploadFileData("");
                                    setValue("jdExport", "");
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <UploadModal
                        isGoogleDriveUpload={false}
                        isLoading={isLoading}
                        uploadFileRef={uploadFile}
                        uploadFileHandler={(e) =>
                          uploadFileHandler(e.target.files[0])
                        }
                        //   googleDriveFileUploader={() => googleDriveFileUploader()}
                        //   uploadFileFromGoogleDriveLink={uploadFileFromGoogleDriveLink}
                        modalTitle={"Upload Leave Polices"}
                        isFooter={false}
                        modalSubtitle={" "}
                        openModal={showUploadModal}
                        setUploadModal={setUploadModal}
                        cancelModal={() => setUploadModal(false)}
                        setValidation={setValidation}
                        getValidation={getValidation}
                        //   getGoogleDriveLink={getGoogleDriveLink}
                        //   setGoogleDriveLink={setGoogleDriveLink}
                        setUploadFileData={setUploadFileData}
                      />
                    </div>
                  </>
                 )}

                  <div className={HRDetailStyle.colMd12}>
                    <div className={HRDetailStyle.modalFormEdited}>
                      <HRInputField
                        register={register}
                        errors={errors}
                        label="Feedback Process"
                        name="feedbackProcess"
                        type={InputType.TEXT}
                        placeholder="Weekly"
                        // value="Weekly during the first 2 weeks | Fortnightly for the next 2 months | Monthly / Quarterly feedback thereafter"
                        disabled
                        // required
                        // validationSchema={{
                        //   required: "please enter Feedback Process.",
                        // }}
                        // trailingIcon= {<EditFieldSVG width="16" height="16" />}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={HRDetailStyle.onboardingProcesBox}>
            <div className={HRDetailStyle.onboardingProcessLeft}>
                <div><ClientTeamMemberSVG width="51" height="26" /></div>
                <h3 className={HRDetailStyle.titleLeft}>Client’s Team Members</h3>
                {actionType!=="Legal" && <div className={HRDetailStyle.modalBtnWrap}>
                    <button type="btn" className={HRDetailStyle.btnPrimary} onClick={()=> setAddMoreTeamMember(true)} disabled={actionType==="Legal"?true:false}  >Add More</button>
                </div>}
            </div>

            <div className={HRDetailStyle.onboardingProcessMid}>
                <div className={HRDetailStyle.modalFormWrapper}>
                    {clientTeamMembers.length > 0 ? <>
                    {clientTeamMembers.map(member=>  <div className={HRDetailStyle.modalFormCol}>
                        <div className={HRDetailStyle.onboardingCurrentTextWrap}>
                            <div className={HRDetailStyle.onboardingCurrentText}>
                                <span>Name: </span>
                                <span className={HRDetailStyle.onboardingTextBold}>{member.name}</span>
                            </div>
                            <div className={HRDetailStyle.onboardingCurrentText}>
                                <span>Designation: </span>
                                <span className={HRDetailStyle.onboardingTextBold}>{member.designation}</span>
                            </div>
                            <div className={HRDetailStyle.onboardingCurrentText}>
                                <span>Reporting To:</span>
                                <span className={HRDetailStyle.onboardingTextBold}>{member.reportingTo}</span>
                            </div>
                            <div className={HRDetailStyle.onboardingCurrentText}>
                                <span>LinkedIn :</span>
                                <span className={HRDetailStyle.onboardingTextBold}> {member.linkedin} <LinkedinClientSVG width="16" height="16"/></span>
                            </div> 
                            <div className={HRDetailStyle.onboardingCurrentText}>
                                <span>Email:</span>
                                <span className={HRDetailStyle.onboardingTextBold}>{member.email}</span>
                            </div> 
                            <div className={HRDetailStyle.onboardingCurrentText}>
                                <span>Buddy:</span>
                                <span className={HRDetailStyle.onboardingTextBold}>{member.buddy}</span>
                            </div>
                        </div>
                    </div>)}
                    </> :  <div className={HRDetailStyle.colMd12}><div className={HRDetailStyle.noClientAvailable}>No Client’s Team Members Availability</div></div> }                    
                </div>


                {addMoreTeamMember && <div className={HRDetailStyle.modalFormHide}>
                    <div className={HRDetailStyle.modalFormWrapper}>
                        <div className={HRDetailStyle.modalFormCol}>
                            <HRInputField
                                register={memberregister}
                                errors={memberErrors}
                                validationSchema={{
                                    required: 'please enter the name.',
                                }}
                                // required
                                label="Name"
                                name="name"
                                type={InputType.TEXT}
                                placeholder="Enter Name"
                            />
                        </div>
                        <div className={HRDetailStyle.modalFormCol}>
                            <HRInputField
                                 register={memberregister}
                                 errors={memberErrors}
                                //  required
                                validationSchema={{
                                    required: 'please enter the designation .',
                                }}
                                label="Designation"
                                name="designation"
                                type={InputType.TEXT}
                                placeholder="Enter Designation"
                            />
                        </div>
                        <div className={HRDetailStyle.modalFormCol}>
                            {/* <HRInputField
                                 register={memberregister}
                                 errors={memberErrors}
                                 required
                                validationSchema={{
                                    required: 'please enter the Reporting name.',
                                }}
                                label="Reporting to"
                                name="reportingTo"
                                type={InputType.TEXT}
                                placeholder="Enter Name"
                            /> */}
                            <HRSelectField
									controlledValue={controlledReportingTo}
									isControlled={true}
									setControlledValue={setControlledReportingTo}
									mode={'id/value'}
									setValue={setValue}
									register={register}
									label={'Reporting To'}
									defaultValue={'Reporting To'}
									options={reportingTo}
									name="reportingTo"
									isError={
										memberErrors['reportingTo'] &&
										memberErrors['reportingTo']
									}
									// required
									errorMsg={'Please select reporting to'}
								/>
                        </div>
                        <div className={HRDetailStyle.modalFormCol}>
                            <HRInputField
                                register={memberregister}
                                errors={memberErrors}
                                // required
                                // validationSchema={{
                                //     required: 'please enter the Link.',
                                // }}
                                label="Linkedin"
                                name="linkedin"
                                type={InputType.TEXT}
                                placeholder="Enter Link"
                            />
                        </div>
                        <div className={HRDetailStyle.modalFormCol}>
                            <HRInputField
                                register={memberregister}
                                errors={memberErrors}
                                // required
                                validationSchema={{
                                    required: 'please enter the Email.',
                                }}
                                label="Email"
                                name="email"
                                type={InputType.TEXT}
                                placeholder="Enter Email"
                            />
                        </div>
                        <div className={HRDetailStyle.modalFormCol}>
                            {/* <HRInputField
                                 register={memberregister}
                                 errors={memberErrors}
                                 required
                                validationSchema={{
                                    required: 'please enter the buddy name.',
                                }}
                                label="Buddy"
                                name="memberBuddy"
                                type={InputType.TEXT}
                                placeholder="Enter Name"
                            /> */}
                            	<HRSelectField
									controlledValue={controlledBuddy}
									isControlled={true}
									setControlledValue={setControlledBuddy}
									mode={'id/value'}
									setValue={setValue}
									register={register}
									label={'Buddy'}
									defaultValue={'Select Buddy'}
									options={buddy}
									name="buddy"
									isError={
										memberErrors['buddy'] && memberErrors['buddy']
									}
									// required
									errorMsg={'Please select buddy'}
								/>
                </div>

                <div className={HRDetailStyle.modalFormCol}>
                        <div className={HRDetailStyle.modalBtnWrap}>
                            <button type="submit" className={HRDetailStyle.btnPrimary} onClick={memberHandleSubmit(saveMember)}>Save</button>
                            <button className={HRDetailStyle.btnPrimaryOutline} onClick={()=> calcelMember()}>Cancel</button>
                        </div>
                    </div>
                </div>		
                </div> }
               		

            </div>
        </div>

            <div className={HRDetailStyle.onboardingProcesBox}>
              <div className={HRDetailStyle.onboardingProcessLeft}>
                <div>
                  <TelentDetailSVG width="27" height="32" />
                </div>
                <h3 className={HRDetailStyle.titleLeft}>Replacement Details</h3>
              </div>

              <div className={HRDetailStyle.onboardingProcessMid}>
                <div className={HRDetailStyle.modalFormWrapper}>                  
                  <div className={`${HRDetailStyle.colMd12} ${HRDetailStyle.colmb32}`}>
                    <Checkbox
                      disabled={actionType==="Legal"?true:false}
                      name="PayPerCredit"
                      checked={engagementReplacement?.replacementData}
                      onChange={(e) => {
                        setEngagementReplacement({
                          ...engagementReplacement,
                          replacementData: e.target.checked,
                        });
                        if (e.target.checked === false) {
                          setAddLetter(false);
                          setValue("lwd", "");
                          setValue("engagementreplacement", "");
                        }
                      }}
                    >
                      Is this engagement going under replacement?
                    </Checkbox>
                  </div>
                
                  {engagementReplacement?.replacementData && (
                    <div className={HRDetailStyle.modalFormCol}>                      
                        <div className={HRDetailStyle.timeSlotItemField}>
                          <div className={HRDetailStyle.timeLabel}>
                            Last Working Day
                          </div>
                          <div className={HRDetailStyle.timeSlotItem}>
                            <CalenderSVG />
                            {actionType==="Legal" ? (
                              <Controller
                                render={({ ...props }) => (
                                  <DatePicker
                                    {...props}
                                    disabled={actionType==="Legal"?true:false}
                                    selected={dayjs(watch("lwd"))}
                                    onChange={(date) => {
                                      setValue("lwd", date);
                                    }}
                                    placeholderText="Last Working Day"
                                    dateFormat="dd/MM/yyyy"
                                    disabledDate={disabledDate}
                                    // value={dayjs(watch("lwd"))}
                                    control={control}
                                  />
                                )}
                                name="lwd"
                                rules={{ required: true }}
                                control={control}
                              />
                            ) : (
                              <Controller
                                render={({ ...props }) => (
                                  <DatePicker
                                    {...props}
                                    disabled={actionType==="Legal"?true:false}
                                    selected={dayjs(watch("lwd"))}
                                    onChange={(date) => {
                                      setValue("lwd", date);
                                    }}
                                    placeholderText="Last Working Day"
                                    dateFormat="dd/MM/yyyy"
                                    disabledDate={disabledDate}
                                    // value={dayjs(watch('lwd'))}
                                    control={control}
                                  />
                                )}
                                name="lwd"
                                rules={{ required: true }}
                                control={control}
                              />
                            )}
                          </div>
                        </div>                      
                    </div>
                    )}

                  {engagementReplacement?.replacementData && (
                    <div className={HRDetailStyle.modalFormCol}>
                      <HRSelectField
                        controlledValue={controlledEngRep}
                        setControlledValue={setControlledEngRep}
                        isControlled={true}
                        disabled={addLatter || actionType==="Legal"?true:false}
                        setValue={setValue}
                        mode={"id/value"}
                        register={register}
                        name="engagementreplacement"
                        label="Select HR ID/Eng ID created to replace this engagement"
                        defaultValue="Select HR ID/Eng ID"
                        searchable={true}
                        options={
                          replacementEngHr
                            ? replacementEngHr.map((item) => ({
                                id: item.stringIdValue,
                                value: item.value,
                              }))
                            : []
                        }
                      />
                    </div>
                  )}

                  {engagementReplacement?.replacementData && (
                    <div className={`${HRDetailStyle.colMd12} ${HRDetailStyle.colmb32}`}>
                      <Checkbox
                        disabled={actionType==="Legal"?true:false}
                        name="PayPerCredit"
                        checked={addLatter}
                        onChange={(e) => {
                          setAddLetter(e.target.checked);
                        }}
                      >
                        Will add this later, by doing this you understand that
                        replacement will not be tracked correctly.
                      </Checkbox>                 
                    </div>
                  )}

                </div>

              </div>
            </div>
          </>
        )}
      </div>

      <div className={HRDetailStyle.formPanelAction}>
      <button
          type="submit"
          className={HRDetailStyle.btnPrimaryOutline}
          onClick={() => setShowAMModal(false)}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={HRDetailStyle.btnPrimary}
          onClick={handleSubmit(handleComplete)}
          // onClick={handleComplete}
          disabled={actionType==="Legal" ? true : isLoading}
        >
          {/* {preONBoardingData?.dynamicOnBoardCTA?.gotoOnboard
            ? `${preONBoardingData?.dynamicOnBoardCTA?.gotoOnboard?.label}`
            : `${preONBoardingData?.dynamicOnBoardCTA?.amAssignment?.label}`} */}
            Continue
        </button>
      </div>
    </div>
  );
}
