import React, { useCallback, useEffect, useState } from "react";
import { Skeleton, Tooltip, Modal } from "antd";
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { NetworkInfo } from "constants/network";

import { ReactComponent as GeneralInformationSVG } from "assets/svg/generalInformation.svg";
import { ReactComponent as DownloadJDSVG } from "assets/svg/downloadJD.svg";
import { ReactComponent as HireingRequestDetailSVG } from "assets/svg/HireingRequestDetail.svg";
import { ReactComponent as CurrentHrsSVG } from "assets/svg/CurrentHrs.svg";
import { ReactComponent as TelentDetailSVG } from "assets/svg/TelentDetail.svg";
import { ReactComponent as EditFieldSVG } from "assets/svg/EditField.svg";
import { ReactComponent as ClockIconSVG } from "assets/svg/clock-icon.svg";
import moment from "moment";

export default function BeforePreOnboarding({
  talentDeteils,
  HRID,
  setShowAMModal,
  callAPI,
  EnableNextTab,
  actionType,
  setMessage
}) {
  const {
    watch,
    register,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({});

  const [editNetTerm, setEditNetTerm] = useState(false);
  const [editPayRate, setEditPayRate] = useState(false);
  const [editBillRate, setEditBillRate] = useState(false);
  const [editAcceptHR, setEditAcceptHR] = useState(false);
  const [editNR, setEditNR] = useState(false);

  const [preONBoardingData, setPreONBoardingData] = useState({});
  const [
    preOnboardingDetailsForAMAssignment,
    setPreOnboardingDetailsForAMAssignment,
  ] = useState({});
  const [dealSource, setDealSource] = useState([]);
  const [dealOwner, setDealowner] = useState([]);
  const [netTerms, setNetTerms] = useState([]);
  const [currentHRs, setCurrentHRs] = useState([]);
  const [hrAcceptedBys, setHrAcceptedBys] = useState([]);
  const [workManagement, setWorkManagement] = useState("");

  const [controlledDealOwner, setControlledDealOwner] = useState()
  const [controlledDealSource, setControlledDealSource] = useState()

  const [isLoading, setIsLoading] = useState(false);
  const [isTabDisabled, setTabDisabled] = useState(false)

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
    return currentDate
  }

  function extractNumberFromString(inputString) {
    const regex = /\d+/;

    const match = inputString.match(regex);
    if (match && match.length > 0) {
      const number = parseInt(match[0], 10);
      return number;
    }
    return null;
  }

  const fatchpreOnBoardInfo = useCallback(
    async (req) => {
      let result = await OnboardDAO.getBeforeOnBoardInfoDAO(req);
    //   console.log("fatchpreOnBoardInfo", result.responseBody.details);

      if (result?.statusCode === HTTPStatusCode.OK) {
        setTabDisabled(result.responseBody.details.isFirstTabReadOnly
          )
        setPreONBoardingData(result.responseBody.details);
        setPreOnboardingDetailsForAMAssignment(
          result.responseBody.details.preOnboardingDetailsForAMAssignment
        );
        setWorkManagement(
          result.responseBody.details.preOnboardingDetailsForAMAssignment
            .workForceManagement
        );
        setNetTerms(result.responseBody.details.drpNetPaymentDays);
        setCurrentHRs(result.responseBody.details.currentHRs);

        setValue(
          "netTerm",
          result.responseBody.details.preOnboardingDetailsForAMAssignment
            .payementNetTerm
        );
        setValue(
          "payRate",
          result.responseBody.details.preOnboardingDetailsForAMAssignment
            .payRate
        );
        setValue(
          "billRate",
          result.responseBody.details.preOnboardingDetailsForAMAssignment
            .billRate
        );
        setValue(
          "hrAcceptedBy",
          result.responseBody.details.preOnboardingDetailsForAMAssignment
            .utS_HRAcceptedBy
        );

        result.responseBody.details.preOnboardingDetailsForAMAssignment
                .shiftStartTime && setValue(
          "shiftStartTime",
          // new Date(
            convertToValidDate(
              result.responseBody.details.preOnboardingDetailsForAMAssignment
                .shiftStartTime
            )
          // )
        );
        result.responseBody.details.preOnboardingDetailsForAMAssignment
        .shiftEndTime && setValue(
          "shiftEndTime",
          // new Date(
            convertToValidDate(
              result.responseBody.details.preOnboardingDetailsForAMAssignment
                .shiftEndTime
            )
          // )    
        );
        
        let preOnboardDetail = result.responseBody.details.preOnboardingDetailsForAMAssignment

        preOnboardDetail?.dpAmount && setValue('dpAmount',preOnboardDetail?.dpAmount)
        preOnboardDetail?.currentCTC && setValue('currentCTC',preOnboardDetail?.currentCTC)
        preOnboardDetail?.nrPercentage && setValue('nrPercent',preOnboardDetail?.nrPercentage)

        let {drpLeadTypes,drpLeadUsers} = result.responseBody.details
        setDealowner(
          drpLeadUsers.filter(
            (item) => item.value !== "0"
          ).map((item) => ({ ...item, text: item.value, value: item.text }))
        );   
        setDealSource(drpLeadTypes);
        let dealOwnerOBJ = drpLeadUsers?.filter(
          (item) => item.text === result.responseBody.details.preOnboardingDetailsForAMAssignment.deal_Owner
        ).map((item) => ({ ...item, text: item.value, value: item.text }))
        let dealSourceObj = drpLeadTypes.filter(item => item.value === result.responseBody.details.preOnboardingDetailsForAMAssignment.dealSource)
       
        if(dealOwnerOBJ.length){
           setControlledDealOwner(dealOwnerOBJ[0].value)
           setValue('dealOwner', dealOwnerOBJ[0])
        }
        if(dealSourceObj.length){
           setControlledDealSource(dealSourceObj[0].value)
            setValue('dealSource',dealSourceObj[0])
        }
    
      }
    },
    [setValue]
  );

  useEffect(() => {
    if (talentDeteils?.OnBoardId) {
      let req = {
        OnboardID: talentDeteils?.OnBoardId,
        HRID: HRID,
        actionName: actionType ? actionType : 'GotoOnboard',
      };
      fatchpreOnBoardInfo(req);
    }
  }, [talentDeteils, HRID, actionType, fatchpreOnBoardInfo]);

  const watchDealSource = watch("dealSource");

  const getLeadOwnerBytype = async (type) => {
    let result = await MasterDAO.getLeadTypeDAO(type);
    // console.log("fatchpreOnBoardInfo", result.responseBody.details);

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
      setValue('dealOwner','')
      setControlledDealOwner()
      getLeadOwnerBytype(watchDealSource.value);
    }
  }, [watchDealSource, setValue]);

  useEffect(() => {
    let billRate =  watch('payRate') * 100 /(100- watch('nrPercent')) 
    billRate && setValue('billRate',billRate.toFixed(2)) 
  },[watch('payRate'),preOnboardingDetailsForAMAssignment, watch('nrPercent')])

  const handleComplete = useCallback(
    async (d) => {
      setIsLoading(true);
      let payload = {
        hR_ID: HRID,
        companyID: 11476,
        deal_Owner: d.dealOwner.value, //Update
        deal_Source: d.dealSource.value, //Update
        onboard_ID: talentDeteils?.OnBoardId,
        engagemenID: preOnboardingDetailsForAMAssignment?.engagemenID,
        assignAM: preONBoardingData.assignAM, // when clicked from AMAssignment button pass this as true, you will get this value from 1st API’s response.
        talentID: talentDeteils?.TalentID,
        talentShiftStartTime: moment(d.shiftStartTime).format('HH:mm A') , //Update
        talentShiftEndTime: moment(d.shiftEndTime).format('HH:mm A'), //Update
        payRate: preOnboardingDetailsForAMAssignment?.isHRTypeDP
          ? 0
          : extractNumberFromString(d.payRate), // pass as null if DP HR  // send numeric value //Update
        billRate: preOnboardingDetailsForAMAssignment?.isHRTypeDP
          ? null
          : `${preOnboardingDetailsForAMAssignment?.currencySign + extractNumberFromString(d.billRate)} ${preOnboardingDetailsForAMAssignment?.talent_CurrencyCode}` , // pass as null if DP HR  //send value with currency and symbol  //Update
        netPaymentDays: parseInt(d.netTerm.value), //Update
        nrMargin:!preOnboardingDetailsForAMAssignment?.isHRTypeDP ? d.nrPercent : null
      };

      // console.log("payload", payload,d.dealSource);
      let result = await OnboardDAO.updateBeforeOnBoardInfoDAO(payload);
      if (result?.statusCode === HTTPStatusCode.OK) {
        if(result?.responseBody.details.IsAMAssigned){
            EnableNextTab(talentDeteils, HRID, "During Pre-Onboarding");
        }
      
        // callAPI(HRID)
        setMessage(result?.responseBody.details)
        setIsLoading(false);
        setEditBillRate(false)
        setEditPayRate(false)
        setEditNetTerm(false)

        let req = {
          OnboardID: talentDeteils?.OnBoardId,
          HRID: HRID,
          actionName: actionType ? actionType : 'GotoOnboard',
        };
        fatchpreOnBoardInfo(req);
      }  
      setIsLoading(false);
    },
    [
      talentDeteils,
      HRID,
      preONBoardingData,
      preOnboardingDetailsForAMAssignment,
      EnableNextTab,
      actionType 
    ]
  );
  //  console.log("form error", errors);
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
                <h3 className={HRDetailStyle.titleLeft}>General Information</h3>
              </div>

              <div className={HRDetailStyle.onboardingProcessMid}>
                <div className={HRDetailStyle.onboardingDetailText}>
                  <span>Company Name</span>
                  <span className={HRDetailStyle.onboardingTextBold}>
                    {preOnboardingDetailsForAMAssignment?.companyName
                      ? preOnboardingDetailsForAMAssignment?.companyName
                      : "NA"}
                  </span>
                </div>
                <div className={HRDetailStyle.onboardingDetailText}>
                  <span>Client Email/Name</span>
                  <span className={HRDetailStyle.onboardingTextBold}>
                    {preOnboardingDetailsForAMAssignment?.client
                      ? preOnboardingDetailsForAMAssignment?.client
                      : "NA"}
                  </span>
                </div>
                <div className={HRDetailStyle.onboardingDetailText}>
                  <span>HR ID</span>
                  <a
                    target="_blank"
                    href={`/allhiringrequest/${HRID}`}
                    rel="noreferrer"
                    className={HRDetailStyle.onboardingTextUnderline}
                  >
                    {preOnboardingDetailsForAMAssignment?.hrNumber
                      ? preOnboardingDetailsForAMAssignment?.hrNumber
                      : "NA"}
                  </a>
                </div>
                <div className={HRDetailStyle.onboardingDetailText}>
                  <span>Country</span>
                  <span className={HRDetailStyle.onboardingTextBold}>
                    {preOnboardingDetailsForAMAssignment?.geo
                      ? preOnboardingDetailsForAMAssignment?.geo
                      : "NA"}
                  </span>
                </div>
                <div className={HRDetailStyle.onboardingDetailText}>
                  <span>No. of Employees</span>
                  <span className={HRDetailStyle.onboardingTextBold}>
                    {preOnboardingDetailsForAMAssignment?.noOfEmployee
                      ? preOnboardingDetailsForAMAssignment?.noOfEmployee
                      : "NA"}
                  </span>
                </div>
                <div className={HRDetailStyle.onboardingDetailText}>
                  <span>Client POC Name</span>
                  <span className={HRDetailStyle.onboardingTextBold}>
                    {preOnboardingDetailsForAMAssignment?.client_POC_Name
                      ? preOnboardingDetailsForAMAssignment?.client_POC_Name
                      : "NA"}
                  </span>
                </div>
                <div className={HRDetailStyle.onboardingDetailText}>
                  <span>Client POC Email</span>
                  <span className={HRDetailStyle.onboardingTextBold}>
                    {preOnboardingDetailsForAMAssignment?.client_POC_Email
                      ? preOnboardingDetailsForAMAssignment?.client_POC_Email
                      : "NA"}
                  </span>
                </div>
                <div className={HRDetailStyle.onboardingDetailText}>
                  <span>Industry</span>
                  <span className={HRDetailStyle.onboardingTextBold}>
                    {preOnboardingDetailsForAMAssignment?.industry
                      ? preOnboardingDetailsForAMAssignment?.industry
                      : "NA"}
                  </span>
                </div>
                <div className={HRDetailStyle.onboardingDetailText}>
                  <span>Discovery Call Link</span>
                  <a
                    target="_blank"
                    href={
                      preONBoardingData?.preOnboardingDetailsForAMAssignment
                        ?.discovery_Link
                    }
                    rel="noreferrer"
                    className={HRDetailStyle.onboardingTextUnderline}
                  >
                    {
                      preONBoardingData?.preOnboardingDetailsForAMAssignment
                        ?.discovery_Link
                    }
                  </a>
                </div>
                <div className={HRDetailStyle.onboardingDetailText}>
                  <span>Interview Link</span>
                  <a
                    target="_blank"
                    href={
                      preONBoardingData?.preOnboardingDetailsForAMAssignment
                        ?.interView_Link
                    }
                    rel="noreferrer"
                    className={HRDetailStyle.onboardingTextUnderline}
                  >
                    {
                      preONBoardingData?.preOnboardingDetailsForAMAssignment
                        ?.interView_Link
                    }
                  </a>
                </div>
                <div className={HRDetailStyle.onboardingDetailText}>
                  <span>Job Description</span>
                  {/* <button className={HRDetailStyle.onboardingDownload}><DownloadJDSVG/>Download JD</button> */}

                  {preOnboardingDetailsForAMAssignment?.jobDescription?.split(
                    ":"
                  )[0] === "http" ||
                  preOnboardingDetailsForAMAssignment?.jobDescription?.split(
                    ":"
                  )[0] === "https" ? (
                    <a
                      className={HRDetailStyle.onboardingDownload}
                      rel="noreferrer"
                      href={preOnboardingDetailsForAMAssignment?.jobDescription}
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
                        preOnboardingDetailsForAMAssignment?.jobDescription
                      }
                      style={{ textDecoration: "underline" }}
                      target="_blank"
                    >
                      <DownloadJDSVG />
                      Download JD
                    </a>
                  )}
                </div>
                <div className={HRDetailStyle.onboardingDetailText}>
                  <span>AM Name</span>
                  <span className={HRDetailStyle.onboardingTextBold}>
                    {preOnboardingDetailsForAMAssignment?.aM_Name
                      ? preOnboardingDetailsForAMAssignment?.aM_Name
                      : "NA"}
                  </span>
                </div>

                <div className={HRDetailStyle.modalFormWrapper}>
                  <div className={HRDetailStyle.modalFormCol}>
                    <HRSelectField
                    controlledValue={controlledDealSource}
                    setControlledValue={setControlledDealSource}
                    isControlled={true}
                      mode="id/value"
                      setValue={setValue}
                      register={register}
                      label={"Deal Source"}
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
                </div>

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

            <div className={HRDetailStyle.onboardingProcesBox}>
              <div className={HRDetailStyle.onboardingProcessLeft}>
                <div>
                  <HireingRequestDetailSVG width="27" height="32" />
                </div>
                <h3 className={HRDetailStyle.titleLeft}>
                  Hiring Request Details
                </h3>
              </div>
              <div className={HRDetailStyle.onboardingProcessMid}>
                <div className={HRDetailStyle.modalFormWrapper}>
                  <div className={HRDetailStyle.modalFormCol}>
                    {editNetTerm ? (
                      <HRSelectField
                        // isControlled={true}
                        mode="id/value"
                        setValue={setValue}
                        register={register}
                        label={"Net Payment Term"}
                        defaultValue={"Select Net Payment Term"}
                        name="netTerm"
                        options={netTerms && netTerms}
                        isError={errors["netTerm"] && errors["netTerm"]}
                        required
                        errorMsg={"Please select Net Payment Term"}
                      />
                    ) : (
                       <HRInputField
                        register={register}
                        errors={errors}
                        label="Net Payment Term"
                        name="netTerm"
                        type={InputType.TEXT}
                        placeholder="Net Payment Term"
                        validationSchema={{
                          required: "please select Net Payment Term.",
                          min: 1
                        }}
                        isError={errors["netTerm"] && errors["netTerm"]}
                        errorMsg={"Please select Net Payment Term"}
                        required
                        disabled
                        trailingIcon={
                        !isTabDisabled &&  <EditFieldSVG
                            width="16"
                            height="16"
                            onClick={() => setEditNetTerm(true)}
                          />
                        }
                      />                  
                    )}
                  </div>

                  {preOnboardingDetailsForAMAssignment?.isHRTypeDP ? <div className={HRDetailStyle.modalFormCol}> 
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
                      </div>: <div className={HRDetailStyle.modalFormCol}>
                    {editPayRate ? (
                      <HRInputField
                        register={register}
                        errors={errors}
                        validationSchema={{
                          required: "please enter the Pay Rate.",
                        }}
                        label="Pay Rate"
                        required
                        name="payRate"
                        type={InputType.NUMBER}
                        placeholder="USD 4000/Month"
                        // value="USD 4000/Month"
                        trailingIcon={
                          <EditFieldSVG
                            width="16"
                            height="16"
                            onClick={() => {
                              setEditPayRate(false);
                              // console.log({nt:watch('netTerm') , num: extractNumberFromString(watch('netTerm'))});
                              // setValue('netTerm',extractNumberFromString(watch('netTerm')))
                            }}
                          />
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
                        trailingIcon={
                        !isTabDisabled &&  <EditFieldSVG
                            width="16"
                            height="16"
                            onClick={() => {
                              setEditPayRate(true);
                              setValue(
                                "payRate",
                                extractNumberFromString(watch("payRate"))
                              );
                            }}
                          />
                        }
                      />
                    )}
                  </div>}
                  


                  <div className={HRDetailStyle.modalFormCol}>
                    {preOnboardingDetailsForAMAssignment?.isHRTypeDP ?  <HRInputField
                        register={register}
                        errors={errors}
                        // validationSchema={{
                        //   required: "please enter the Current CTC.",
                        // }}
                        // required
                        label="CurrentCTC"
                        name="currentCTC"
                        type={InputType.TEXT}
                        placeholder="USD 4000/Month"
                        // value={watch('billRate')}
                        disabled
                      /> : <>
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
                        placeholder="USD 4000/Month"
                        // value={watch('billRate')}
                        trailingIcon={
                          <EditFieldSVG
                            width="16"
                            height="16"
                            onClick={() => setEditBillRate(false)}
                          />
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
                        placeholder="USD 4000/Month"
                        // value={watch('billRate')}
                        disabled
                        // trailingIcon={
                        //  !isTabDisabled && <EditFieldSVG
                        //     width="16"
                        //     height="16"
                        //     onClick={() => {
                        //       setEditBillRate(true);
                        //       setValue(
                        //         "billRate",
                        //         extractNumberFromString(watch("billRate"))
                        //       );
                        //     }}
                        //   />
                        // }
                      />
                    )}
                      </>}
                    
                  </div>
                  <div className={HRDetailStyle.modalFormCol}>
                    {editAcceptHR ? (
                      <HRSelectField
                        // isControlled={true}
                        mode="id/value"
                        setValue={setValue}
                        register={register}
                        label={"UTS HR Accepted by"}
                        defaultValue={"Select UTS HR Accepted by"}
                        name="hrAcceptedBy"
                        options={hrAcceptedBys && hrAcceptedBys}
                        isError={
                          errors["hrAcceptedBy"] && errors["hrAcceptedBy"]
                        }
                        required
                        errorMsg={"Please select UTS HR Accepted by"}
                      />
                    ) : (
                      <HRInputField
                        register={register}
                        // errors={errors}
                        label="UTS HR Accepted by"
                        name="hrAcceptedBy"
                        type={InputType.TEXT}
                        placeholder="Enter HR Accepted by"
                        disabled
                        // trailingIcon={
                        //   <EditFieldSVG
                        //     width="16"
                        //     height="16"
                        //     // onClick={() => setEditAcceptHR(true)}
                        //   />
                        // }
                      />
                    )}
                  </div>

               
                  {/* <span>NR Percentage</span>
                  <span className={HRDetailStyle.onboardingTextBold}>
                    {preOnboardingDetailsForAMAssignment?.nrPercentage
                      ? preOnboardingDetailsForAMAssignment?.nrPercentage
                      : "NA"}{" "}
                    %
                  </span> */}
                  {!preOnboardingDetailsForAMAssignment?.isHRTypeDP &&<div className={HRDetailStyle.modalFormCol}>
                      {editNR ? (
                     <HRInputField
                     register={register}
                     errors={errors}
                     label="NR %"
                     name="nrPercent"
                     type={InputType.NUMBER}
                     placeholder="Enter NR %"
                     trailingIcon={
                       <EditFieldSVG
                         width="16"
                         height="16"
                         onClick={() => setEditNR(false)}
                       />
                     }
                   />
                    ) : (
                      <HRInputField
                        register={register}
                        errors={errors}
                        label="NR %"
                        name="nrPercent"
                        type={InputType.NUMBER}
                        placeholder="Enter NR %"
                        disabled
                        trailingIcon={
                          <EditFieldSVG
                            width="16"
                            height="16"
                            onClick={() => {setEditNR(true)
                              setValue(
                                "payRate",
                                extractNumberFromString(watch("payRate"))
                              );
                            }}
                          />
                        }
                      />
                    )}
                   </div>} 
                
               
                </div>

               
                  {preOnboardingDetailsForAMAssignment?.isHRTypeDP && <div className={HRDetailStyle.onboardingDetailText}>
                    <span>DP Percentage</span>
                  <span className={HRDetailStyle.onboardingTextBold}>
                    {preOnboardingDetailsForAMAssignment?.dP_Percentage
                      ? preOnboardingDetailsForAMAssignment?.dP_Percentage
                      : "NA"}{" "}
                    %
                  </span></div>
                 }                 
                

               
                  {preOnboardingDetailsForAMAssignment?.isHRTypeDP &&  <div className={HRDetailStyle.onboardingDetailText}>
                  <span>Expected Rate</span>
                  <span className={HRDetailStyle.onboardingTextBold}>
                    {preOnboardingDetailsForAMAssignment?.expectedSalary
                      ? preOnboardingDetailsForAMAssignment?.expectedSalary
                      : "NA"}
                  </span>
                </div>}                 
           
                <div className={HRDetailStyle.onboardingDetailText}>
                  <span>Role Title</span>
                  <span className={HRDetailStyle.onboardingTextBold}>
                    {preOnboardingDetailsForAMAssignment?.talentRole
                      ? preOnboardingDetailsForAMAssignment?.talentRole
                      : "NA"}
                  </span>
                </div>

                <div className={HRDetailStyle.onboardingCondition}>
                  <h5>Workforce Management:</h5>

                  <span className={HRDetailStyle.onboardingTextBold}>
                    {workManagement}
                  </span>

                  {/* <label className={HRDetailStyle.radioCheck_Mark}>
                        <p>Remote</p>
                        <input
                            // {...register('remote')}
                            value={'Remote'}
                            type="radio"
                            checked={workManagement === 'Remote'}
                            onChange={(e) => {
                            	setWorkManagement(e.target.value);
                            }}
                            id="remote"
                            name="remote"
                        />
                        <span className={HRDetailStyle.customCheck_Mark}></span>
                    </label>
                    <label className={HRDetailStyle.radioCheck_Mark}>
                        <p>On-Site</p>
                        <input
                            // {...register('remote')}
                            value={'On-Site'}
                            type="radio"
                            checked={workManagement === 'On-Site'}
                            onChange={(e) => {
                            	setWorkManagement(e.target.value);
                            }}
                            id="remote"
                            name="remote"
                        />
                        <span className={HRDetailStyle.customCheck_Mark}></span>
                    </label> */}
                </div>
              </div>
            </div>

            <div className={HRDetailStyle.onboardingProcesBox}>
              <div className={HRDetailStyle.onboardingProcessLeft}>
                <div>
                  <CurrentHrsSVG width="27" height="32" />
                </div>
                <h3 className={HRDetailStyle.titleLeft}>Current HRs</h3>
              </div>
              <div className={HRDetailStyle.onboardingProcessMid}>
                <div className={HRDetailStyle.modalFormWrapper}>
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
                    <h3 className={HRDetailStyle.titleLeft}>
                      No HR Found for Handover
                    </h3>
                  )}
                  {/* <div className={HRDetailStyle.modalFormCol}>
                        <div className={HRDetailStyle.onboardingCurrentTextWrap}>
                            <div className={HRDetailStyle.onboardingCurrentText}>
                                <span>Open HR ID :</span>
                                <a target="_blank" href="#" rel="noreferrer" className={HRDetailStyle.onboardingTextUnderline}>HR90698453085</a>
                            </div>
                            <div className={HRDetailStyle.onboardingCurrentText}>
                                <span>Open HR Status :</span>
                                <span className={HRDetailStyle.onboardingTextBold}>In Process</span>
                            </div>
                            <div className={HRDetailStyle.onboardingCurrentText}>
                                <span>Open TR of HR :</span>
                                <span className={HRDetailStyle.onboardingTextBold}>2</span>
                            </div>
                        </div>
                    </div> */}
                  {/* <div className={HRDetailStyle.modalFormCol}>
                        <div className={HRDetailStyle.onboardingCurrentTextWrap}>
                            <div className={HRDetailStyle.onboardingCurrentText}>
                                <span>Open HR ID :</span>
                                <a target="_blank" href="#" rel="noreferrer" className={HRDetailStyle.onboardingTextUnderline}>HR90698453085</a>
                            </div>
                            <div className={HRDetailStyle.onboardingCurrentText}>
                                <span>Open HR Status :</span>
                                <span className={HRDetailStyle.onboardingTextBold}>In Interview</span>
                            </div>
                            <div className={HRDetailStyle.onboardingCurrentText}>
                                <span>Open TR of HR :</span>
                                <span className={HRDetailStyle.onboardingTextBold}>4</span>
                            </div>
                        </div>
                    </div>*/}
                </div>
              </div>
            </div>

            <div className={HRDetailStyle.onboardingProcesBox}>
              <div className={HRDetailStyle.onboardingProcessLeft}>
                <div>
                  <TelentDetailSVG width="27" height="32" />
                </div>
                <h3 className={HRDetailStyle.titleLeft}>Talent Details</h3>
              </div>
              <div className={HRDetailStyle.onboardingProcessMid}>
                <div className={HRDetailStyle.onboardingDetailText}>
                  <span>Talent Name</span>
                  <span className={HRDetailStyle.onboardingTextBold}>
                    {preOnboardingDetailsForAMAssignment?.talentName
                      ? preOnboardingDetailsForAMAssignment?.talentName
                      : "NA"}
                  </span>
                </div>
                <div className={HRDetailStyle.onboardingDetailText}>
                  <span>Talent Designation</span>
                  <span className={HRDetailStyle.onboardingTextBold}>
                    {preOnboardingDetailsForAMAssignment?.talent_Designation
                      ? preOnboardingDetailsForAMAssignment?.talent_Designation
                      : "NA"}
                  </span>
                </div>

                {/* <div className={HRDetailStyle.onboardingDetailText}>
                    <span>SC Name</span>
                    <span className={HRDetailStyle.onboardingTextBold}>NA/for now</span>
                </div>
                <div className={HRDetailStyle.onboardingDetailText}>
                    <span>POD Manager Name</span>
                    <span className={HRDetailStyle.onboardingTextBold}>NA/for now</span>
                </div> */}
                <div className={HRDetailStyle.onboardingDetailText}>
                  <span>Talent Profile Link</span>
                  {preONBoardingData?.preOnboardingDetailsForAMAssignment
                    ?.talentProfileLink ? (
                    <a
                      target="_blank"
                      href={preONBoardingData?.preOnboardingDetailsForAMAssignment
                        ?.talentProfileLink}
                      rel="noreferrer"
                      className={HRDetailStyle.onboardingTextUnderline}
                    >
                      {
                        preONBoardingData?.preOnboardingDetailsForAMAssignment
                          ?.talentProfileLink
                      }
                    </a>
                  ) : (
                    <span className={HRDetailStyle.onboardingTextBold}>
                      {"NA"}
                    </span>
                  )}
                </div>
                <div className={HRDetailStyle.onboardingDetailText}>
                  <span>Availability</span>
                  <span className={HRDetailStyle.onboardingTextBold}>
                    {preOnboardingDetailsForAMAssignment?.availability
                      ? preOnboardingDetailsForAMAssignment?.availability
                      : "NA"}
                  </span>
                </div>

                {/* <div className={HRDetailStyle.onboardingDetailText}>
                    <span>Talent Shift Start/End Time</span>
                    <span className={HRDetailStyle.onboardingTextBold}>{preOnboardingDetailsForAMAssignment?.shiftStartTime?preOnboardingDetailsForAMAssignment?.shiftStartTime : 'NA'}
                     - {preOnboardingDetailsForAMAssignment?.shiftEndTime?preOnboardingDetailsForAMAssignment?.shiftEndTime : 'NA'}</span>
                </div> */}

                <div className={HRDetailStyle.row}>
                  <div className={HRDetailStyle.colMd6}>
                    <div className={HRDetailStyle.timeSlotItemField}>
                      <div className={HRDetailStyle.timeSlotLabel}>
                        Talent Shift Start Time <span>*</span>
                      </div>
                      <div className={HRDetailStyle.timeSlotItem}>
                        <ClockIconSVG />
                        <Controller
                          render={({ ...props }) => (
                            <DatePicker
                              selected={watch("shiftStartTime")}
                              onChange={(date) => {
                                setValue("shiftStartTime", date);
                              }}
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={60}
                              timeCaption="Time"
                              timeFormat="h:mm a"
                              dateFormat="h:mm a"
                              placeholderText="Start Time"
                              disabled={isTabDisabled}
                            />
                          )}
                          name="shiftStartTime"
                          rules={{ required: true }}
                          control={control}
                        />
                        {errors.shiftStartTime && (
                          <div className={HRDetailStyle.error}>
                            Please enter start time
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={HRDetailStyle.colMd6}>
                    <div className={HRDetailStyle.timeSlotItemField}>
                      <div className={HRDetailStyle.timeSlotLabel}>
                        Talent Shift End Time <span>*</span>
                      </div>
                      <div className={HRDetailStyle.timeSlotItem}>
                        <ClockIconSVG />
                        <Controller
                          render={({ ...props }) => (
                            <DatePicker
                              selected={watch("shiftEndTime")}
                              onChange={(date) => {
                                setValue("shiftEndTime", date);
                              }}
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={60}
                              timeCaption="Time"
                              timeFormat="h:mm a"
                              dateFormat="h:mm a"
                              placeholderText="End Time"
                              disabled={isTabDisabled}
                            />
                          )}
                          name="shiftEndTime"
                          rules={{ required: true }}
                          control={control}
                        />
                        {errors.shiftEndTime && (
                          <div className={HRDetailStyle.error}>
                            Please enter end time
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className={HRDetailStyle.formPanelAction}>
        <button
          type="submit"
          className={HRDetailStyle.btnPrimary}
          onClick={handleSubmit(handleComplete)}
          disabled={isTabDisabled ? isTabDisabled : isLoading}
        >
          {preONBoardingData?.dynamicOnBoardCTA?.gotoOnboard
            ? `${preONBoardingData?.dynamicOnBoardCTA?.gotoOnboard?.label}`
            : `${preONBoardingData?.dynamicOnBoardCTA?.amAssignment?.label}`}
        </button>
        <button
          type="submit"
          className={HRDetailStyle.btnPrimaryOutline}
          onClick={() => setShowAMModal(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
