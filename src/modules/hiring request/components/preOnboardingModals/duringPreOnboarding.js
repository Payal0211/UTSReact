import React, { useEffect , useState, useCallback, useRef} from "react";
import { Skeleton, Dropdown, Menu, message } from 'antd';
import HRDetailStyle from '../../screens/hrdetail/hrdetail.module.css';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import { Controller, useForm } from 'react-hook-form';
import { HRDeleteType, HiringRequestHRStatus, InputType } from 'constants/application';
import { OnboardDAO } from "core/onboard/onboardDAO";
import { MasterDAO } from "core/master/masterDAO";
import { HTTPStatusCode } from "constants/network";
import { ReactComponent as UploadSVG } from "assets/svg/upload.svg";
import { ReactComponent as CloseSVG } from "assets/svg/close.svg";
import UploadModal from "shared/components/uploadModal/uploadModal";


import { ReactComponent as GeneralInformationSVG } from 'assets/svg/generalInformation.svg';
import { ReactComponent as EditFieldSVG } from 'assets/svg/EditField.svg';
import { ReactComponent as AboutCompanySVG } from 'assets/svg/aboutCompany.svg';
import { ReactComponent as ClientTeamMemberSVG } from 'assets/svg/clientTeammember.svg';
import { ReactComponent as LinkedinClientSVG } from 'assets/svg/LinkedinClient.svg';

import { BsThreeDots } from 'react-icons/bs';

export default function DuringPreOnboarding({
    talentDeteils,
    HRID,
    setShowAMModal,
    callAPI,
    EnableNextTab,
    actionType,
  }) {

    const {
		watch,
		register,
		setValue,
		handleSubmit,
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

    const [tabData, setTabData] = useState({})
    const [clientTeamMembers, setClientTeamMembers] = useState([])
    const [addMoreTeamMember, setAddMoreTeamMember] = useState(false)

    const [isTabDisabled, setTabDisabled] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [getUploadFileData, setUploadFileData] = useState("");
    const [showUploadModal, setUploadModal] = useState(false);
    const [getValidation, setValidation] = useState({
        systemFileUpload: "",
        googleDriveFileUpload: "",
        linkValidation: "",
      });
      const uploadFile = useRef(null);

    const [reportingTo, setReportingTo] = useState([]);
    const [deviceMasters, setDeviceMasters] = useState([]);
    const [buddy, setBuddy] = useState([]);
    const devicePolices = [{id:1,value:'Talent to bring his own devices'},{id:2,value:'Client to buy a device and Uplers to Facilitate'},
    {id:3,value:' Client can use remote desktop security option facilitated by Uplers (At additional cost of $100 per month)'},{id:4,value:'Add This Later'}]
    const leavePolices =[{id:1,value:'Proceed with Uplers Policies'},{id:2,value:'Upload Your Policies'}]
    const [controlledBuddy, setControlledBuddy] = useState('Please Select');
    const [controlledDevicePolicy, setControlledDevicePolicy] = useState('Please Select')
    const [controlledLeavePolicy, setControlledLeavePolicy] = useState('Please Select')
    const [controlledReportingTo, setControlledReportingTo] =
		useState('Please Select');
        const [controlledDeviceType, setControlledDeviceType] = useState('Please Select')

        const getReportingToHandler = useCallback(async () => {
            const response = await MasterDAO.getYesNoOptionRequestDAO();
            setReportingTo(response && response?.responseBody?.details);
        }, []);
        const getBuddyHandler = useCallback(async () => {
            const response = await MasterDAO.getBuddyRequestDAO();
            setBuddy(response && response?.responseBody?.details);
        }, []);

    useEffect(() => {
        getReportingToHandler();
		getBuddyHandler();
    },[getReportingToHandler, getBuddyHandler])

    const saveMember = (d) =>{
        // console.log("member data", d, watch('reportingTo'), watch('memberBuddy'))
        let newMember = {
        "name": d.memberName,
        "designation": d.memberDesignation,
        "reportingTo": watch('reportingTo')? watch('reportingTo').value : '',
        "linkedin": d.linkedinLink,
        "email": d.memberEmail,
        "buddy": watch('memberBuddy') ? watch('memberBuddy').value : ''
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

    const editMember = (member)=>{
      setAddMoreTeamMember(true)
      memberSetValue('reportingTo',member.reportingTo)
      memberSetValue('memberName',member.name)
      memberSetValue('memberEmail',member.email)
      memberSetValue('memberDesignation',member.designation)
      memberSetValue('memberBuddy',member.buddy)
      memberSetValue('linkedinLink',member.linkedin)
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

    const fatchduringOnBoardInfo = useCallback(
        async (req) => {
          let result = await OnboardDAO.getDuringOnBoardInfoDAO(req);
        //   console.log("fatchduringOnBoardInfo", result);
    
          if (result?.statusCode === HTTPStatusCode.OK) {
            let data = result.responseBody.details

           setTabDisabled(data.isSecondTabReadOnly)
           setTabData(data.secondTabAMAssignmentOnBoardingDetails)
           setDeviceMasters(data.deviceMaster)
           setValue('invoiceRaisinfTo',data.secondTabAMAssignmentOnBoardingDetails.inVoiceRaiseTo)
           setValue('invoiceRaisingToEmail',data.secondTabAMAssignmentOnBoardingDetails.inVoiceRaiseToEmail)
           setValue('contractDuration',data.secondTabAMAssignmentOnBoardingDetails.utsContractDuration)
           setValue('aboutCompany',data.secondTabAMAssignmentOnBoardingDetails.company_Description)
           setValue('firstWeek',data.secondTabAMAssignmentOnBoardingDetails.talent_FirstWeek)
           setValue('firstMonth',data.secondTabAMAssignmentOnBoardingDetails.talent_FirstMonth)
           setValue('softwareToolsRequired',data.secondTabAMAssignmentOnBoardingDetails.softwareToolsRequired)
        //    setValue('devicePolicy',data.secondTabAMAssignmentOnBoardingDetails.devicesPoliciesOption)
        //    setValue('leavePolicie',data.secondTabAMAssignmentOnBoardingDetails.proceedWithUplers_LeavePolicyOption)

           setValue('exitPolicy',data.exit_Policy)
           setValue('feedbackProcess', data.feedback_Process)

           setClientTeamMembers(data.onBoardClientTeam)

           if(data.secondTabAMAssignmentOnBoardingDetails.devicesPoliciesOption){
            let filteredDevicePolicy = devicePolices.filter(item=> item.value ===  data.secondTabAMAssignmentOnBoardingDetails.devicesPoliciesOption)
            setValue('devicePolicy',filteredDevicePolicy[0])
            setControlledDevicePolicy(filteredDevicePolicy[0].value)
            filteredDevicePolicy[0].id === 1 && setValue('standerdSpecifications',data.secondTabAMAssignmentOnBoardingDetails.talentDeviceDetails)
            // console.log({filteredDevicePolicy})
            if(filteredDevicePolicy[0].id === 2){
                let deviceFilteredMaster = data.deviceMaster.filter(device=> device.deviceName === data.secondTabAMAssignmentOnBoardingDetails.device_Radio_Option)
                // console.log('deviceFilteredMaster', deviceFilteredMaster,  data.secondTabAMAssignmentOnBoardingDetails.device_Radio_Option)
               if(deviceFilteredMaster[0].id !== 3){
                        setValue('deviceType',deviceFilteredMaster.map(device=> ({id: device.id, value: `${device.deviceName} $ ${device.deviceCost} USD `}))[0])
                        setControlledDeviceType(deviceFilteredMaster.map(device=> ({id: device.id, value: `${device.deviceName} $ ${device.deviceCost} USD `}))[0].value)
               }else {
                        setValue('deviceType',deviceFilteredMaster.map(device=> ({id: device.id, value: device.deviceName}))[0])
                        setControlledDeviceType(deviceFilteredMaster.map(device=> ({id: device.id, value: device.deviceName}))[0].value)
                        setValue('otherDevice',data.secondTabAMAssignmentOnBoardingDetails.client_DeviceDescription)
               }
            } 

           }
           
           if(data.secondTabAMAssignmentOnBoardingDetails.proceedWithUplers_LeavePolicyOption){
            let filteredLeavePolicy = leavePolices.filter(leavePolices => leavePolices.value === data.secondTabAMAssignmentOnBoardingDetails.proceedWithUplers_LeavePolicyOption)
            setValue('leavePolicie',filteredLeavePolicy[0])
            setControlledLeavePolicy(filteredLeavePolicy[0].value)
            if(filteredLeavePolicy[0].id === 1){
                setValue('policyLink',data.secondTabAMAssignmentOnBoardingDetails.proceedWithClient_LeavePolicyLink)
            }
            if(filteredLeavePolicy[0].id === 2){
                setUploadFileData(data.secondTabAMAssignmentOnBoardingDetails.leavePolicyFileName)
            }
           }
      
          }
        },
        [setValue]
    );

    const watchDevicePolicy = watch('devicePolicy')

    useEffect(() => {
        if (talentDeteils?.OnBoardId) {
          let req = {
            OnboardID: talentDeteils?.OnBoardId,
            HRID: HRID,
          };
          fatchduringOnBoardInfo(req);
        }
    }, [talentDeteils, HRID, actionType, fatchduringOnBoardInfo]);

    const handleOnboarding = async (d) => {
// console.log("form data",d)
        setShowAMModal(true)
        setIsLoading(true)
        let payload = {
            "hR_ID": HRID,
            "companyID": 11476,// to be dynamic
            "signingAuthorityName": d.invoiceRaisinfTo,
            "signingAuthorityEmail": d.invoiceRaisingToEmail,
            "contractDuration": d.contractDuration,
            "onBoardID":talentDeteils?.OnBoardId,
            "about_Company_desc": d.aboutCompany,
            "talent_FirstWeek": d.firstWeek,
            "talent_FirstMonth": d.firstMonth,
            "softwareToolsRequired": d.softwareToolsRequired,
            "devicesPoliciesOption": d.devicePolicy.value,
            "talentDeviceDetails": d.devicePolicy.id === 1 ? d.standerdSpecifications : '' ,
            // "additionalCostPerMonth_RDPSecurity": "0",
            // "isRecurring": false,
            // "proceedWithUplers_LeavePolicyOption": 		"proceedWithUplers_LeavePolicyOption", // dropdown selected option
            // "proceedWithClient_LeavePolicyOption": "No",
            "proceedWithClient_LeavePolicyLink": d.leavePolicie.id === 1 ? d.policyLink : '', // link from text box
            "leavePolicyFileName":d.leavePolicie.id === 2 ? getUploadFileData : '', // file name
            "hdnRadioDevicesPolicies": d.devicePolicy.value,
            "device_Radio_Option":  d.devicePolicy.id === 2 ?  deviceMasters.filter(item=> item.id === d.deviceType.id)[0].deviceName : '',// device name
            "deviceID": d.devicePolicy.id === 2 ? d.deviceType.id : 0,//device id
            "client_DeviceDescription": d.devicePolicy.id === 2 &&  d.deviceType.id === 3 ? d.otherDevice : '' ,
            "totalCost": d.devicePolicy.id === 2 ?  deviceMasters.filter(item=> item.id === d.deviceType.id)[0].deviceCost : 0,//deviceCost
            "radio_LeavePolicies": d.leavePolicie.value,
            "leavePolicyPasteLinkName": d.leavePolicie.id === 1 ? d.policyLink : '',
            "teamMembers": clientTeamMembers
          }

          let result = await OnboardDAO.updatePreOnBoardInfoDAO(payload);

        //   console.log("res",result,payload)
      if (result?.statusCode === HTTPStatusCode.OK) {
        // EnableNextTab(talentDeteils, HRID, "During Pre-Onboarding");
        setIsLoading(false);
        setShowAMModal(false)
        callAPI(HRID)
      }
      setShowAMModal(false)
      setIsLoading(false)
    }

    function isValidUrl(string) {
        try {
          new URL(string);
          return true;
        } catch (err) {
          return false;
        }
      }

// console.log("memberErrors",memberErrors,watchDevicePolicy,deviceMasters)
    
// Team menber Object
    // {
    //     "name": "Riya Agarwal",
    //     "designation": "Senior developer",
    //     "reportingTo": "true",
    //     "linkedin": "http://3.218.6.134:9093/Onboard/edit/11102",
    //     "email": "riya.a@uplers.com",
    //     "buddy": "1"
    //   }
    // console.log("err",errors)

    const uploadFileHandler = useCallback(
        async (fileData) => {
          setIsLoading(true);
          if (
            // fileData?.type !== "application/pdf" &&
            // fileData?.type !== "application/docs" &&
            // fileData?.type !== "application/msword" &&
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
            let uploadFileResponse = await OnboardDAO.uploadPolicyDAO(formData,talentDeteils?.OnBoardId);
            if(uploadFileResponse.statusCode === 400){
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

  return (
    <div className={HRDetailStyle.onboardingProcesswrap}>
    <div className={HRDetailStyle.onboardingProcesspart}>
        <div className={HRDetailStyle.onboardingProcesBox}>
            <div className={HRDetailStyle.onboardingProcessLeft}>
                <div><GeneralInformationSVG width="27" height="32" /></div>
                <h3 className={HRDetailStyle.titleLeft}>Invoicing and Contract</h3>
            </div>

            <div className={HRDetailStyle.onboardingProcessMid}>
                <div className={HRDetailStyle.onboardingFormAlign}>
                    <div className={HRDetailStyle.modalFormWrapper}>
                        <div className={HRDetailStyle.modalFormCol}>
                            <HRInputField
                                register={register}
                                errors={errors}
                                validationSchema={{
                                    required: 'please enter the Invoice Raising to.',
                                }}
                                label="Invoice Raising to"
                                name="invoiceRaisinfTo"
                                type={InputType.TEXT}
                                placeholder="Enter Name"
                                required
                                disabled={isTabDisabled}
                            />
                        </div>

                        <div className={HRDetailStyle.modalFormCol}>
                            <HRInputField
                                register={register}
                                errors={errors}
                                validationSchema={{
                                    required: 'please enter the Invoice Raising to Email.',
                                }}
                                label="Invoice Raising to Email"
                                name="invoiceRaisingToEmail"
                                type={InputType.TEXT}
                                placeholder="Enter Email"
                                required
                                disabled={isTabDisabled}
                            />
                        </div>

                        {!talentDeteils?.IsHRTypeDP && <div className={HRDetailStyle.modalFormCol}>
                            <HRInputField
                                    register={register}
                                    // errors={errors}
                                    label="UTS Contract Duration (In Months)"
                                    name="contractDuration"
                                    type={InputType.TEXT}
                                    placeholder="6 Months"
                                    // value="6 Months"
                                    disabled
                                    // trailingIcon= {<EditFieldSVG width="16" height="16" />}
                            />
                        </div>}

                        <div className={HRDetailStyle.modalFormCol}>
                            <div className={HRDetailStyle.onboardingDetailText}>
                                <span>BDR/MDR Name</span>
                                <span className={HRDetailStyle.onboardingTextBold}>{tabData?.bdR_MDR_Name}</span>
                            </div>
                        </div>
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
                    <div className={HRDetailStyle.colMd12}>
                        <HRInputField
                            isTextArea={true}
                            errors={errors}
                            className="TextAreaCustom"
                            label={'A Bit about company culture '}
                            register={register}
                            name="aboutCompany"
                            type={InputType.TEXT}
                            placeholder="Enter here"
                            required
                            validationSchema={{
                                required: 'please enter a bit about company culture.',
                            }}
                            disabled={isTabDisabled}
                        />
                    </div>

                    <div className={HRDetailStyle.colMd12}>
                        <HRInputField
                            isTextArea={true}
                            errors={errors}
                            label={'How does the first week look like'}
                            register={register}
                            name="firstWeek"
                            type={InputType.TEXT}
                            placeholder="Enter here"
                            required
                            validationSchema={{
                                required: 'please enter how does the first week look like.',
                            }}
                            disabled={isTabDisabled}
                        />
                    </div>

                    <div className={HRDetailStyle.colMd12}>
                        <HRInputField
                            isTextArea={true}
                            errors={errors}
                            label={'How does the first month look like'}
                            register={register}
                            name="firstMonth"
                            type={InputType.TEXT}
                            placeholder="Enter here"
                            required
                            validationSchema={{
                                required: 'please enter how does the first month look like.',
                            }}
                            disabled={isTabDisabled}
                        />
                    </div>

                   {!talentDeteils?.IsHRTypeDP && <>
                    <div className={HRDetailStyle.colMd12}>
                    <HRInputField
                            isTextArea={true}
                            errors={errors}
                            label={'Softwares & Tools Required'}
                            register={register}
                            name="softwareToolsRequired"
                            type={InputType.TEXT}
                            placeholder='Enter Softwares and Tools which will be required'
                            required={!talentDeteils?.IsHRTypeDP}
                            validationSchema={{
                                required: 'please enter softwares and tools which will be required.',
                            }}
                            disabled={isTabDisabled}
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
                   <div className={HRDetailStyle.colMd12}>
                        <HRSelectField
                        controlledValue={controlledDevicePolicy}
                        setControlledValue={setControlledDevicePolicy}
                            isControlled={true}
                            mode="id/value"
                            setValue={setValue}
                            register={register}
                            label={'Device Policy'}
                            // defaultValue={'Enter Device Policy'}
                            options={devicePolices}
                            placeholder={'Select Device Policy'}
                            name="devicePolicy"
                            isError={errors['devicePolicy'] && errors['devicePolicy']}
                            required={!talentDeteils?.IsHRTypeDP}
                            errorMsg={'please select device policy.'}
                            disabled={isTabDisabled}
                        />
                    </div>

                        {watchDevicePolicy?.id === 1 &&<div className={HRDetailStyle.colMd12}><HRInputField
                            isTextArea={true}
                            errors={errors}
                            // label={'Softwares & Tools Required'}
                            register={register}
                            name="standerdSpecifications"
                            type={InputType.TEXT}
                            placeholder='Specify standard specifications, If any'
                          required={watchDevicePolicy?.id === 1}
                            disabled={isTabDisabled}
                        /></div> }

                        {watchDevicePolicy?.id === 2 && <div className={HRDetailStyle.colMd12}><HRSelectField
                                 controlledValue={controlledDeviceType}
                                 setControlledValue={setControlledDeviceType}
                                     isControlled={true}
                                mode="id/value"
                                setValue={setValue}
                                register={register}
                                className="leavePolicylabel"
                                // label={'Leave Polices'}
                                options={deviceMasters.length ? deviceMasters.map(device=> {
                                    if(device.id !== 3){
                                        return {id: device.id, value: `${device.deviceName} $ ${device.deviceCost} USD `}
                                    }
                                    return {id: device.id, value: device.deviceName}
                                }): []}
                                defaultValue={'Select Device'}
                                name="deviceType"
                                isError={errors['deviceType'] && errors['deviceType']}
                                // required={!talentDeteils?.IsHRTypeDP}
                                errorMsg={'please select device.'}
                                disabled={isTabDisabled}
                            /></div> }

{watchDevicePolicy?.id === 2 &&  watch('deviceType')?.id === 3 && <div className={HRDetailStyle.colMd12}><HRInputField
                            isTextArea={true}
                            errors={errors}
                            // label={'Softwares & Tools Required'}
                            register={register}
                            name="otherDevice"
                            type={InputType.TEXT}
                            placeholder=''
                          
                            disabled={isTabDisabled}
                        /></div>  }

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
                                label={'Leave Polices'}
                                placeholder={'Select Leave Polices'}
                                options={leavePolices}
                                // defaultValue={'Proceed with Uplers Policies'}
                                name="leavePolicie"
                                isError={errors['leavePolicie'] && errors['leavePolicie']}
                                required={!talentDeteils?.IsHRTypeDP}
                                errorMsg={'please select leave policy.'}
                                disabled={isTabDisabled}
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
                                    required: 'please enter Exit Policy.',
                                }}
                                // trailingIcon= {<EditFieldSVG width="16" height="16" />}
                            />
                        </div>
                    </div>
                   </>} 

                   {watch('leavePolicie')?.id === 1 &&  <div className={HRDetailStyle.colMd12}>
                        <div className={HRDetailStyle.modalFormEdited}>
                        <HRInputField
                                register={register}
                                errors={errors}
                                validationSchema={{
                                    required: 'please enter the Invoice Raising to.',
                                    validate: (value) => {
                                        if(!isValidUrl(value)){
                                            return 'Please Enter valid URL'
                                        }
                                        // if(apiData?.ClientDetail?.Availability === "Full Time"){
                                        //   if (`${value}` <= apiData.ClientDetail.NoOfTalents) {
                                        //   return "TR cannot be reduced";
                                        //   }
                                        // }else{
                                        //   if (`${value}` <= apiData.ClientDetail.NoOfTalents * 2) {
                                        //     return "TR cannot be reduced";
                                        //   }
                                        // }
                                      },
                                }}
                                label="Leave Polices Link"
                                name="policyLink"
                                type={InputType.TEXT}
                                placeholder="Enter Policy Link"
                                required={watch('leavePolicie')?.id === 1}
                                disabled={isTabDisabled}
                            />
                        </div>
                        </div>
                    }

                    {watch('leavePolicie')?.id === 2 &&  <div className={HRDetailStyle.colMd12}>
                        <div className={HRDetailStyle.modalFormEdited}>
                        {!getUploadFileData ? (
                    <HRInputField
                      register={register}
                      leadingIcon={<UploadSVG />}
                      label="Leave Polices"
                      name="policyFile"
                      type={InputType.BUTTON}
                      buttonLabel="Leave Polices"
                      setValue={setValue}
                      required={watch('leavePolicie')?.id === 2}
                      onClickHandler={() => setUploadModal(true)}
                      validationSchema={{
                        required: "please select a file.",
                      }}
                      errors={errors}
                    />
                  ) : (
                    <div className={HRDetailStyle.uploadedJDWrap}>
                      <label>Upload Policy *</label>
                      <div className={HRDetailStyle.uploadedJDName}>
                        {getUploadFileData}{" "}
                        {!isTabDisabled && <CloseSVG
                          className={HRDetailStyle.uploadedJDClose}
                          onClick={() => {
                            // setJDParsedSkills({});
                            setUploadFileData("");
                            setValue("jdExport", "");
                          }}
                        />}
                        
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
                    </div>}
                      
                  
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
                                required
                                validationSchema={{
                                    required: 'please enter Feedback Process.',
                                }}
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
                {!isTabDisabled && <div className={HRDetailStyle.modalBtnWrap}>
                    <button type="btn" className={HRDetailStyle.btnPrimary} onClick={()=> setAddMoreTeamMember(true)} disabled={isTabDisabled}  >Add More</button>
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

                            {/* <div className={HRDetailStyle.onboardingDotsDrop}>
                                {
                                    <Dropdown
                                        trigger={['click']}
                                        placement="bottom"
                                        getPopupContainer={trigger => trigger.parentElement}
                                        overlay={
                                            <Menu>
                                                <Menu.Item key={0} onClick={()=>editMember(member)}>Edit Detail</Menu.Item>
                                            </Menu>
                                        }>
                                        <BsThreeDots style={{ fontSize: '1.5rem' }} />
                                    </Dropdown>
                                }
                            </div> */}
                        </div>
                    </div>)}
                        {/* <div className={HRDetailStyle.modalFormCol}>
                        <div className={HRDetailStyle.onboardingCurrentTextWrap}>
                            <div className={HRDetailStyle.onboardingCurrentText}>
                                <span>Name: </span>
                                <span className={HRDetailStyle.onboardingTextBold}>Rachel Green</span>
                            </div>
                            <div className={HRDetailStyle.onboardingCurrentText}>
                                <span>Designation: </span>
                                <span className={HRDetailStyle.onboardingTextBold}>Front End Developer</span>
                            </div>
                            <div className={HRDetailStyle.onboardingCurrentText}>
                                <span>Reporting To:</span>
                                <span className={HRDetailStyle.onboardingTextBold}>Fredrik Champ</span>
                            </div>
                            <div className={HRDetailStyle.onboardingCurrentText}>
                                <span>LinkedIn :</span>
                                <span className={HRDetailStyle.onboardingTextBold}> Rachel Green <LinkedinClientSVG width="16" height="16"/></span>
                            </div> 
                            <div className={HRDetailStyle.onboardingCurrentText}>
                                <span>Email:</span>
                                <span className={HRDetailStyle.onboardingTextBold}> rachelgreen455@gmail.com</span>
                            </div> 
                            <div className={HRDetailStyle.onboardingCurrentText}>
                                <span>Buddy:</span>
                                <span className={HRDetailStyle.onboardingTextBold}>Monica Geller</span>
                            </div>

                            <div className={HRDetailStyle.onboardingDotsDrop}>
                                {
                                    <Dropdown
                                        trigger={['click']}
                                        placement="bottom"
                                        getPopupContainer={trigger => trigger.parentElement}
                                        overlay={
                                            <Menu>
                                                <Menu.Item key={0}>Edit Detail</Menu.Item>
                                            </Menu>
                                        }>
                                        <BsThreeDots style={{ fontSize: '1.5rem' }} />
                                    </Dropdown>
                                }
                            </div>
                        </div>
                    </div>
                    <div className={HRDetailStyle.modalFormCol}>
                        <div className={HRDetailStyle.onboardingCurrentTextWrap}>
                            <div className={HRDetailStyle.onboardingCurrentText}>
                                <span>Name: </span>
                                <span className={HRDetailStyle.onboardingTextBold}>Rachel Green</span>
                            </div>
                            <div className={HRDetailStyle.onboardingCurrentText}>
                                <span>Designation: </span>
                                <span className={HRDetailStyle.onboardingTextBold}>Front End Developer</span>
                            </div>
                            <div className={HRDetailStyle.onboardingCurrentText}>
                                <span>Reporting To:</span>
                                <span className={HRDetailStyle.onboardingTextBold}>Fredrik Champ</span>
                            </div>
                            <div className={HRDetailStyle.onboardingCurrentText}>
                                <span>LinkedIn :</span>
                                <span className={HRDetailStyle.onboardingTextBold}> Rachel Green <LinkedinClientSVG width="16" height="16"/></span>
                            </div> 
                            <div className={HRDetailStyle.onboardingCurrentText}>
                                <span>Email:</span>
                                <span className={HRDetailStyle.onboardingTextBold}> rachelgreen455@gmail.com</span>
                            </div> 
                            <div className={HRDetailStyle.onboardingCurrentText}>
                                <span>Buddy:</span>
                                <span className={HRDetailStyle.onboardingTextBold}>Monica Geller</span>
                            </div>

                            <div className={HRDetailStyle.onboardingDotsDrop}>
                                {
                                    <Dropdown
                                        trigger={['click']}
                                        placement="bottom"
                                        getPopupContainer={trigger => trigger.parentElement}
                                        overlay={
                                            <Menu>
                                                <Menu.Item key={0}>Edit Detail</Menu.Item>
                                            </Menu>
                                        }>
                                        <BsThreeDots style={{ fontSize: '1.5rem' }} />
                                    </Dropdown>
                                }
                            </div>
                        </div>
                    </div> */}
                    </> :  <h3 className={HRDetailStyle.titleLeft}>No Client’s Team Members Availability</h3> }
                    
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
                                required
                                label="Name"
                                name="memberName"
                                type={InputType.TEXT}
                                placeholder="Enter Name"
                            />
                        </div>
                        <div className={HRDetailStyle.modalFormCol}>
                            <HRInputField
                                 register={memberregister}
                                 errors={memberErrors}
                                 required
                                validationSchema={{
                                    required: 'please enter the designation .',
                                }}
                                label="Designation"
                                name="memberDesignation"
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
                                name="linkedinLink"
                                type={InputType.TEXT}
                                placeholder="Enter Link"
                            />
                        </div>
                        <div className={HRDetailStyle.modalFormCol}>
                            <HRInputField
                                register={memberregister}
                                errors={memberErrors}
                                required
                                validationSchema={{
                                    required: 'please enter the Email.',
                                }}
                                label="Email"
                                name="memberEmail"
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
									name="memberBuddy"
									isError={
										memberErrors['memberBuddy'] && memberErrors['memberBuddy']
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
    </div>

    <div className={HRDetailStyle.formPanelAction}>
        <button type="submit" className={HRDetailStyle.btnPrimary} onClick={handleSubmit(handleOnboarding)} disabled={isTabDisabled ? isTabDisabled : isLoading }>Complete Client Pre-Onboarding</button>
        <button
          type="submit"
          className={HRDetailStyle.btnPrimaryOutline}
        //   onClick={() => setShowAMModal(false)}
            onClick={()=>callAPI(HRID)}
        >
          Cancel
        </button>
    </div>
</div>
  )
}
