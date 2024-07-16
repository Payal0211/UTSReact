import React, { useEffect, useState, useCallback, useRef } from "react";
import { Skeleton, Dropdown, Menu, message, Checkbox, DatePicker } from "antd";
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
import { ReactComponent as UploadSVG } from "assets/svg/upload.svg";
import { ReactComponent as CloseSVG } from "assets/svg/close.svg";
import UploadModal from "shared/components/uploadModal/uploadModal";

import { ReactComponent as GeneralInformationSVG } from "assets/svg/generalInformation.svg";
import { ReactComponent as EditFieldSVG } from "assets/svg/EditField.svg";
import { ReactComponent as AboutCompanySVG } from "assets/svg/aboutCompany.svg";
import { ReactComponent as ClientTeamMemberSVG } from "assets/svg/clientTeammember.svg";
import { ReactComponent as LinkedinClientSVG } from "assets/svg/LinkedinClient.svg";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import { ReactComponent as DuringLegalSVG } from "assets/svg/duringLegal.svg";
import dayjs from "dayjs";

import { BsThreeDots } from "react-icons/bs";

export default function LegalPreOnboarding({
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
    unregister,
    clearErrors,
    control,
    formState: { errors },
  } = useForm({});

  const {
    watch: memberWatch,
    register: memberregister,
    setValue: memberSetValue,
    handleSubmit: memberHandleSubmit,
    unregister: memberUnregister,
    control: memberControl,
    formState: { errors: memberErrors },
  } = useForm({});

  const [tabData, setTabData] = useState({});
  const [uplersLeavePolicyLink, setUplersLeavePolicyLink] = useState("");
  const [clientTeamMembers, setClientTeamMembers] = useState([]);
  const [addMoreTeamMember, setAddMoreTeamMember] = useState(false);

  const [isTabDisabled, setTabDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
  const leavePolices = [
    { id: 1, value: "Proceed with Uplers Policies" },
    { id: 2, value: "Upload Your Policies" },
  ];
  const [controlledBuddy, setControlledBuddy] = useState("Please Select");
  const [controlledDevicePolicy, setControlledDevicePolicy] =
    useState("Please Select");
  const [controlledLeavePolicy, setControlledLeavePolicy] =
    useState("Please Select");
  const [controlledReportingTo, setControlledReportingTo] =
    useState("Please Select");
  const [controlledDeviceType, setControlledDeviceType] =
    useState("Please Select");

  const getReportingToHandler = useCallback(async () => {
    const response = await MasterDAO.getYesNoOptionRequestDAO();
    setReportingTo(response && response?.responseBody?.details);
  }, []);
  const getBuddyHandler = useCallback(async () => {
    const response = await MasterDAO.getBuddyRequestDAO();
    setBuddy(response && response?.responseBody?.details);
  }, []);
  const [engagementReplacement, setEngagementReplacement] = useState({
    replacementData: false,
  });
  const [addLatter, setAddLetter] = useState(false);
  const [replacementEngHr, setReplacementEngHr] = useState([]);
  const loggedInUserID = JSON.parse(
    localStorage.getItem("userSessionInfo")
  ).LoggedInUserTypeID;
  const [controlledEngRep, setControlledEngRep] = useState();

  useEffect(() => {
    getReportingToHandler();
    getBuddyHandler();
  }, [getReportingToHandler, getBuddyHandler]);

  const saveMember = (d) => {
    // console.log("member data", d, watch('reportingTo'), watch('memberBuddy'))
    let newMember = {
      name: d.memberName,
      designation: d.memberDesignation,
      reportingTo: watch("reportingTo") ? watch("reportingTo").value : "",
      linkedin: d.linkedinLink,
      email: d.memberEmail,
      buddy: watch("memberBuddy") ? watch("memberBuddy").value : "",
    };

    setAddMoreTeamMember(false);
    setClientTeamMembers((prev) => [...prev, newMember]);
    memberUnregister("reportingTo");
    memberUnregister("memberName");
    memberUnregister("memberEmail");
    memberUnregister("memberDesignation");
    memberUnregister("memberBuddy");
    memberUnregister("linkedinLink");
  };

  const editMember = (member) => {
    setAddMoreTeamMember(true);
    memberSetValue("reportingTo", member.reportingTo);
    memberSetValue("memberName", member.name);
    memberSetValue("memberEmail", member.email);
    memberSetValue("memberDesignation", member.designation);
    memberSetValue("memberBuddy", member.buddy);
    memberSetValue("linkedinLink", member.linkedin);
  };

  const calcelMember = () => {
    setAddMoreTeamMember(false);
    memberUnregister("reportingTo");
    memberUnregister("memberName");
    memberUnregister("memberEmail");
    memberUnregister("memberDesignation");
    memberUnregister("memberBuddy");
    memberUnregister("linkedinLink");
  };

  const fatchduringOnBoardInfo = useCallback(
    async (req) => {
      let result = await OnboardDAO.getDuringOnBoardInfoDAO(req);
      if (result?.statusCode === HTTPStatusCode.OK) {
        let data = result.responseBody.details;
        setTabDisabled(data.isSecondTabReadOnly);
        setTabData(data.secondTabAMAssignmentOnBoardingDetails);
        setUplersLeavePolicyLink(data.uplersLeavePolicy);
        setReplacementEngHr(data.replacementEngAndHR);
        setDeviceMasters(data.deviceMaster);
        setValue(
          "invoiceRaisinfTo",
          data.secondTabAMAssignmentOnBoardingDetails.inVoiceRaiseTo
        );
        setValue(
          "invoiceRaisingToEmail",
          data.secondTabAMAssignmentOnBoardingDetails.inVoiceRaiseToEmail
        );
        setValue(
          "contractDuration",
          data.secondTabAMAssignmentOnBoardingDetails.utsContractDuration
        );
        setValue(
          "aboutCompany",
          data.secondTabAMAssignmentOnBoardingDetails.company_Description
        );
        setValue(
          "firstWeek",
          data.secondTabAMAssignmentOnBoardingDetails.talent_FirstWeek
        );
        setValue(
          "firstMonth",
          data.secondTabAMAssignmentOnBoardingDetails.talent_FirstMonth
        );
        setValue(
          "softwareToolsRequired",
          data.secondTabAMAssignmentOnBoardingDetails.softwareToolsRequired
        );
        //    setValue('devicePolicy',data.secondTabAMAssignmentOnBoardingDetails.devicesPoliciesOption)
        //    setValue('leavePolicie',data.secondTabAMAssignmentOnBoardingDetails.proceedWithUplers_LeavePolicyOption)

        setValue("exitPolicy", data.exit_Policy);
        setValue("feedbackProcess", data.feedback_Process);
        setEngagementReplacement({
          ...engagementReplacement,
          replacementData: data.replacementDetail !== null ? true : false,
        });
        setValue("lwd", dayjs(data.replacementDetail.lastWorkingDay).toDate());
        setClientTeamMembers(data.onBoardClientTeam);

        const _filterData = data.replacementEngAndHR?.filter(
          (e) =>
            e.id === data.replacementDetail.newHrid ||
            data.replacementDetail.newOnBoardId
        );
        setControlledEngRep(_filterData[0].value);
        setValue("engagementreplacement", _filterData[0]);

        if (data.secondTabAMAssignmentOnBoardingDetails.devicesPoliciesOption) {
          let filteredDevicePolicy = devicePolices.filter(
            (item) =>
              item.value ===
              data.secondTabAMAssignmentOnBoardingDetails.devicesPoliciesOption
          );
          setValue("devicePolicy", filteredDevicePolicy[0]);
          setControlledDevicePolicy(filteredDevicePolicy[0].value);
          filteredDevicePolicy[0].id === 1 &&
            setValue(
              "standerdSpecifications",
              data.secondTabAMAssignmentOnBoardingDetails.talentDeviceDetails
            );
          // console.log({filteredDevicePolicy})
          if (filteredDevicePolicy[0].id === 2) {
            let deviceFilteredMaster = data.deviceMaster.filter(
              (device) =>
                device.deviceName ===
                data.secondTabAMAssignmentOnBoardingDetails.device_Radio_Option
            );
            // console.log('deviceFilteredMaster', deviceFilteredMaster,  data.secondTabAMAssignmentOnBoardingDetails.device_Radio_Option)
            if (deviceFilteredMaster[0].id !== 3) {
              setValue(
                "deviceType",
                deviceFilteredMaster.map((device) => ({
                  id: device.id,
                  value: `${device.deviceName} $ ${device.deviceCost} USD `,
                }))[0]
              );
              setControlledDeviceType(
                deviceFilteredMaster.map((device) => ({
                  id: device.id,
                  value: `${device.deviceName} $ ${device.deviceCost} USD `,
                }))[0].value
              );
            } else {
              setValue(
                "deviceType",
                deviceFilteredMaster.map((device) => ({
                  id: device.id,
                  value: device.deviceName,
                }))[0]
              );
              setControlledDeviceType(
                deviceFilteredMaster.map((device) => ({
                  id: device.id,
                  value: device.deviceName,
                }))[0].value
              );
              setValue(
                "otherDevice",
                data.secondTabAMAssignmentOnBoardingDetails
                  .client_DeviceDescription
              );
            }
          }
        }

        if (
          data.secondTabAMAssignmentOnBoardingDetails
            .proceedWithUplers_LeavePolicyOption
        ) {
          let filteredLeavePolicy = leavePolices.filter(
            (leavePolices) =>
              leavePolices.value ===
              data.secondTabAMAssignmentOnBoardingDetails
                .proceedWithUplers_LeavePolicyOption
          );
          setValue("leavePolicie", filteredLeavePolicy[0]);
          setControlledLeavePolicy(filteredLeavePolicy[0].value);
          data.secondTabAMAssignmentOnBoardingDetails
            .proceedWithClient_LeavePolicyLink &&
            setValue(
              "policyLink",
              data.secondTabAMAssignmentOnBoardingDetails
                .proceedWithClient_LeavePolicyLink
            );
          data.secondTabAMAssignmentOnBoardingDetails.leavePolicyFileName &&
            setUploadFileData(
              data.secondTabAMAssignmentOnBoardingDetails.leavePolicyFileName
            );
        }
      }
    },
    [setValue]
  );

  const watchDevicePolicy = watch("devicePolicy");

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
    setShowAMModal(true);
    setIsLoading(true);
    let payload = {
      hR_ID: HRID,
      companyID: 11476, // to be dynamic
      signingAuthorityName: d.invoiceRaisinfTo,
      signingAuthorityEmail: d.invoiceRaisingToEmail,
      contractDuration: d.contractDuration,
      onBoardID: talentDeteils?.OnBoardId,
      about_Company_desc: d.aboutCompany,
      talent_FirstWeek: d.firstWeek,
      talent_FirstMonth: d.firstMonth,
      softwareToolsRequired: d.softwareToolsRequired,
      devicesPoliciesOption: !talentDeteils?.IsHRTypeDP
        ? d?.devicePolicy?.value
        : "",
      talentDeviceDetails: !talentDeteils?.IsHRTypeDP
        ? d?.devicePolicy?.id === 1
          ? d.standerdSpecifications
          : ""
        : "",
      // "additionalCostPerMonth_RDPSecurity": "0",
      // "isRecurring": false,
      // "proceedWithUplers_LeavePolicyOption": 		"proceedWithUplers_LeavePolicyOption", // dropdown selected option
      // "proceedWithClient_LeavePolicyOption": "No",
      // "proceedWithClient_LeavePolicyLink": d.leavePolicie.id === 1 ? d.policyLink : '', // link from text box
      // "leavePolicyFileName":d.leavePolicie.id === 2 ? getUploadFileData : '', // file name
      proceedWithClient_LeavePolicyLink: !talentDeteils?.IsHRTypeDP
        ? d?.leavePolicie?.id === 2
          ? d.policyLink
            ? d.policyLink
            : ""
          : ""
        : "", // link from text box
      leavePolicyFileName: !talentDeteils?.IsHRTypeDP
        ? d?.leavePolicie?.id === 2
          ? getUploadFileData
            ? getUploadFileData
            : ""
          : ""
        : "", // file name
      hdnRadioDevicesPolicies: !talentDeteils?.IsHRTypeDP
        ? d?.devicePolicy?.value
        : "",
      device_Radio_Option: !talentDeteils?.IsHRTypeDP
        ? d?.devicePolicy?.id === 2
          ? deviceMasters?.filter((item) => item.id === d.deviceType.id)[0]
              .deviceName
          : ""
        : "", // device name
      deviceID: !talentDeteils?.IsHRTypeDP
        ? d?.devicePolicy?.id === 2
          ? d?.deviceType?.id
          : 0
        : 0, //device id
      client_DeviceDescription: !talentDeteils?.IsHRTypeDP
        ? d?.devicePolicy?.id === 2 && d?.deviceType?.id === 3
          ? d?.otherDevice
          : ""
        : "",
      totalCost: !talentDeteils?.IsHRTypeDP
        ? d?.devicePolicy?.id === 2
          ? deviceMasters.filter((item) => item.id === d.deviceType.id)[0]
              .deviceCost
          : 0
        : 0, //deviceCost
      radio_LeavePolicies: !talentDeteils?.IsHRTypeDP
        ? d?.leavePolicie?.value
        : "",
      leavePolicyPasteLinkName: !talentDeteils?.IsHRTypeDP
        ? d?.leavePolicie?.id === 2
          ? d.policyLink
            ? d.policyLink
            : ""
          : ""
        : "",
      teamMembers: clientTeamMembers,
      isReplacement: engagementReplacement?.replacementData,
      talentReplacement: {
        onboardId: talentDeteils?.OnBoardId,
        lastWorkingDay: addLatter === false ? d.lwd : "",
        replacementInitiatedby: loggedInUserID.toString(),
        engHRReplacement:
          addLatter === true || d.engagementreplacement === undefined
            ? ""
            : d.engagementreplacement.id,
      },
    };
debugger
    console.log(payload,">>",talentDeteils);
    // let result = await OnboardDAO.updatePreOnBoardInfoDAO(payload);

    // //   console.log("res",payload)
    // if (result?.statusCode === HTTPStatusCode.OK) {
    //   // EnableNextTab(talentDeteils, HRID, "During Pre-Onboarding");
    //   setIsLoading(false);
    //   setShowAMModal(false);
    //   callAPI(HRID);
    // }
    // setShowAMModal(false);
    setIsLoading(false);
  };

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

  useEffect(() => {
    if (getUploadFileData) {
      clearErrors("policyLink");
      unregister("policyLink");
    }
    if (watch("policyLink")) {
      clearErrors("policyFile");
    }
  }, [watch("policyLink"), getUploadFileData]);

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

  useEffect(() => {
    if (watchDevicePolicy?.id !== 2) {
      clearErrors("deviceType");
    }
  }, [watchDevicePolicy, clearErrors]);

  const disabledDate = (current) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return current && current < today;
  };

  return (
    <div className={HRDetailStyle.onboardingProcesswrap}>
      <div className={HRDetailStyle.onboardingProcesspart}>
        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            <div className={HRDetailStyle.onboardingProcesBox}>
              <div className={HRDetailStyle.onboardingProcessLeft}>
                <div>
                  <GeneralInformationSVG width="27" height="32" />
                </div>
                <h3 className={HRDetailStyle.titleLeft}>
                  Invoicing and Contract
                </h3>
              </div>

              <div className={HRDetailStyle.onboardingProcessMid}>
                <div className={HRDetailStyle.onboardingFormAlign}>
                  <div className={HRDetailStyle.modalFormWrapper}>
                    <div className={HRDetailStyle.modalFormCol}>
                      <HRInputField
                        register={register}
                        errors={errors}
                        validationSchema={{
                          required: "please enter the Invoice Raising to.",
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
                          required:
                            "please enter the Invoice Raising to Email.",
                        }}
                        label="Invoice Raising to Email"
                        name="invoiceRaisingToEmail"
                        type={InputType.TEXT}
                        placeholder="Enter Email"
                        required
                        disabled={isTabDisabled}
                      />
                    </div>

                    <div className={HRDetailStyle.modalFormCol}>
                      <div className={HRDetailStyle.timeLabel}>
                        Contract Start Date
                        <span className={HRDetailStyle.reqFieldRed}>*</span>
                      </div>
                      <div className={HRDetailStyle.timeSlotItem}>
                        <CalenderSVG />
                        {isTabDisabled ? (
                          <Controller
                            render={({ ...props }) => (
                              <DatePicker
                                {...props}
                                selected={dayjs(watch("contractStartDate"))}
                                onChange={(date) => {
                                  setValue("contractStartDate", date);
                                }}
                                placeholderText="Contract Start Date "
                                dateFormat="dd/MM/yyyy"
                                // disabled={addLatter}
                                disabledDate={disabledDate}
                                value={dayjs(watch("lwd"))}
                                control={control}
                                disabled={isTabDisabled}
                              />
                            )}
                            name="contractStartDate"
                            rules={{ required: true }}
                            control={control}
                          />
                        ) : (
                          <Controller
                            render={({ ...props }) => (
                              <DatePicker
                                {...props}
                                selected={dayjs(watch("contractStartDate"))}
                                onChange={(date) => {
                                  setValue("contractStartDate", date);
                                }}
                                placeholderText="Contract Start Date"
                                dateFormat="dd/MM/yyyy"
                                // disabled={addLatter}
                                disabledDate={disabledDate}
                                //   value={dayjs(watch("lwd"))}
                                control={control}
                                disabled={isTabDisabled}
                              />
                            )}
                            name="contractStartDate"
                            rules={{ required: true }}
                            control={control}
                          />
                        )}
                        {errors.sowDate && (
                      <div className={HRDetailStyle.error}>
                        * Please select Date.
                      </div>
                    )}
                      </div>
                    </div>

                    <div className={HRDetailStyle.modalFormCol}>
                      <div className={HRDetailStyle.timeLabel}>
                        Contract End Date
                        <span className={HRDetailStyle.reqFieldRed}>*</span>
                      </div>
                      <div className={HRDetailStyle.timeSlotItem}>
                        <CalenderSVG />
                        {isTabDisabled ? (
                          <Controller
                            render={({ ...props }) => (
                              <DatePicker
                                {...props}
                                selected={dayjs(watch("contractEndDate"))}
                                onChange={(date) => {
                                  setValue("contractEndDate", date);
                                }}
                                placeholderText="Contract End Date"
                                dateFormat="dd/MM/yyyy"
                                // disabled={addLatter}
                                disabledDate={disabledDate}
                                value={dayjs(watch("lwd"))}
                                control={control}
                                disabled={isTabDisabled}
                              />
                            )}
                            name="contractEndDate"
                            rules={{ required: true }}
                            control={control}
                          />
                        ) : (
                          <Controller
                            render={({ ...props }) => (
                              <DatePicker
                                {...props}
                                selected={dayjs(watch("contractEndDate"))}
                                onChange={(date) => {
                                  setValue("contractEndDate", date);
                                }}
                                placeholderText="Contract End Date"
                                dateFormat="dd/MM/yyyy"
                                // disabled={addLatter}
                                disabledDate={disabledDate}
                                //   value={dayjs(watch("lwd"))}
                                control={control}
                                disabled={isTabDisabled}
                              />
                            )}
                            name="contractEndDate"
                            rules={{ required: true }}
                            control={control}
                          />
                        )}
                        {errors.sowDate && (
                      <div className={HRDetailStyle.error}>
                        * Please select Date.
                      </div>
                    )}
                      </div>
                      
                    </div>

                    <div className={HRDetailStyle.modalFormCol}>
                      <div className={HRDetailStyle.onboardingDetailText}>
                        <span>Contract Duration</span>
                        <span className={HRDetailStyle.onboardingTextBold}>
                          6 Monts
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={HRDetailStyle.onboardingProcesBox}>
              <div className={HRDetailStyle.onboardingProcessLeft}>
                <div>
                  <DuringLegalSVG width="32" height="32" />
                </div>
                <h3 className={HRDetailStyle.titleLeft}>Legal Info (Client)</h3>
              </div>

              <div className={HRDetailStyle.onboardingProcessMid}>
                <div className={HRDetailStyle.onboardingFormAlign}>
                  <div className={HRDetailStyle.modalFormWrapper}>
                    {/* <div className={HRDetailStyle.modalFormCol}> */}
                    <label className={HRDetailStyle.timeLabel}>
                      SOW Sign Date{" "}
                      <span className={HRDetailStyle.reqFieldRed}>*</span>
                    </label>
                    <div
                      className={`${HRDetailStyle.timeSlotItem} ${
                        errors.sowDate && HRDetailStyle.marginBottom0
                      }`}
                    >
                      {isTabDisabled ? (
                        <Controller
                          render={({ ...props }) => (
                            <DatePicker
                              value={dayjs(watch("sowDate"))}
                              selected={watch("sowDate")}
                              placeholderText="Select Date"
                              // defaultValue={dayjs(watch('sowDate'), 'YYYY-MM-DD')}
                              onChange={(date) => {
                                setValue("sowDate", date);
                              }}
                              // dateFormat="yyyy/MM/dd"
                              disabled={isTabDisabled}
                            />
                          )}
                          name="sowDate"
                          rules={{ required: !talentDeteils?.IsHRTypeDP }}
                          control={control}
                        />
                      ) : (
                        <Controller
                          render={({ ...props }) => (
                            <DatePicker
                              selected={watch("sowDate")}
                              placeholderText="Select Date"
                              // defaultValue={dayjs(watch('sowDate'), 'YYYY-MM-DD')}
                              onChange={(date) => {
                                setValue("sowDate", date);
                              }}
                              // dateFormat="yyyy/MM/dd"
                              disabled={isTabDisabled}
                            />
                          )}
                          name="sowDate"
                          rules={{ required: !talentDeteils?.IsHRTypeDP }}
                          control={control}
                        />
                      )}

                      <CalenderSVG />
                    </div>
                    {errors.sowDate && (
                      <div className={HRDetailStyle.error}>
                        * Please select Date.
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* </div> */}
            </div>

            <div className={HRDetailStyle.onboardingProcesBox}>
              <div className={HRDetailStyle.onboardingProcessLeft}>
                <div>
                  <DuringLegalSVG width="32" height="32" />
                </div>
                <h3 className={HRDetailStyle.titleLeft}>Legal Info (Talent)</h3>
              </div>

              <div className={HRDetailStyle.onboardingProcessMid}>
                <div className={HRDetailStyle.onboardingFormAlign}>
                  <div className={HRDetailStyle.modalFormWrapper}>
                    {/* <div className={HRDetailStyle.modalFormCol}> */}
                    <label className={HRDetailStyle.timeLabel}>
                      SOW Sign Date{" "}
                      <span className={HRDetailStyle.reqFieldRed}>*</span>
                    </label>
                    <div
                      className={`${HRDetailStyle.timeSlotItem} ${
                        errors.sowDate && HRDetailStyle.marginBottom0
                      }`}
                    >
                      {isTabDisabled ? (
                        <Controller
                          render={({ ...props }) => (
                            <DatePicker
                              value={dayjs(watch("sowDate"))}
                              selected={watch("sowDate")}
                              placeholderText="Select Date"
                              // defaultValue={dayjs(watch('sowDate'), 'YYYY-MM-DD')}
                              onChange={(date) => {
                                setValue("sowDate", date);
                              }}
                              // dateFormat="yyyy/MM/dd"
                              disabled={isTabDisabled}
                            />
                          )}
                          name="sowDate"
                          rules={{ required: !talentDeteils?.IsHRTypeDP }}
                          control={control}
                        />
                      ) : (
                        <Controller
                          render={({ ...props }) => (
                            <DatePicker
                              selected={watch("sowDate")}
                              placeholderText="Select Date"
                              // defaultValue={dayjs(watch('sowDate'), 'YYYY-MM-DD')}
                              onChange={(date) => {
                                setValue("sowDate", date);
                              }}
                              // dateFormat="yyyy/MM/dd"
                              disabled={isTabDisabled}
                            />
                          )}
                          name="sowDate"
                          rules={{ required: !talentDeteils?.IsHRTypeDP }}
                          control={control}
                        />
                      )}

                      <CalenderSVG />
                    </div>
                    {errors.sowDate && (
                      <div className={HRDetailStyle.error}>
                        * Please select Date.
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* </div> */}
            </div>
          </>
        )}
      </div>

      <div className={HRDetailStyle.formPanelAction}>
      <button
          type="submit"
          className={HRDetailStyle.btnPrimaryOutline}
          //   onClick={() => setShowAMModal(false)}
          onClick={() => callAPI(HRID)}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={HRDetailStyle.btnPrimary}
          onClick={handleSubmit(handleOnboarding)}
          disabled={isTabDisabled ? isTabDisabled : isLoading}
        >
          Save Details
        </button>
      </div>
    </div>
  );
}
