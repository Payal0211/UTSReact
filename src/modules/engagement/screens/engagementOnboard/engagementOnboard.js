import { InputType } from "constants/application";
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import HRSelectField from "modules/hiring request/components/hrSelectField/hrSelectField";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import allengagementOnboardStyles from "../engagementOnboard/engagementOnboard.module.css";
import { ReactComponent as LinkedInSVG } from "assets/svg/linkedin.svg";
import WithLoader from "shared/components/loader/loader";
import moment from "moment";
import { HTTPStatusCode, NetworkInfo } from "constants/network";
import { ReactComponent as DownloadJDSVG } from "assets/svg/downloadJD.svg";
import { ReactComponent as LinkedinClientSVG } from 'assets/svg/LinkedinClient.svg';
import { Checkbox, Modal, Tooltip, message } from "antd";
import { ReactComponent as EditNewIcon } from "assets/svg/editnewIcon.svg";
import { ReactComponent as RefreshSyncSVG } from 'assets/svg/refresh-sync.svg'
import { engagementRequestDAO } from "core/engagement/engagementDAO";
import { UserSessionManagementController } from 'modules/user/services/user_session_services';
import LogoLoader from "shared/components/loader/logoLoader";
import { budgetStringToCommaSeprated } from "shared/utils/basic_utils";
import { Link } from "react-router-dom";

const EngagementOnboard = ({
  getOnboardFormDetails : gOBFD,
  getHRAndEngagementId,
  isLoading,
  scheduleTimezone,
  getOnboardingForm,
  hideHeader
}) => {

  const [editModal,setEditModal] = useState(false)
  const [renewalDiscussion,setRenewalDiscussion] = useState({
    IsRenewalInitiated:false
  })

  let getOnboardFormDetails = gOBFD?.onboardContractDetails
  let teamMembersDetails = gOBFD?.onBoardClientTeamMembers

  const [userData, setUserData] = useState({});
  const [syncLoading,setSyncLoading] = useState(false)

	useEffect(() => {
		const getUserResult = async () => {
			let userData = UserSessionManagementController.getUserSession();
			if (userData) setUserData(userData);
		};
		getUserResult();
	}, []);

  useEffect(()=>{
    setRenewalDiscussion({
      ...renewalDiscussion,
      IsRenewalInitiated: getOnboardFormDetails?.isRenewalInitiated == "yes" ?true:false,
    });
  },[getOnboardFormDetails?.isRenewalInitiated])

  const handleSubmit = async () => {
    const response = await engagementRequestDAO.saveRenewalInitiatedDetailDAO(getOnboardFormDetails?.onBoardID,
      renewalDiscussion?.IsRenewalInitiated == true ? "Yes":"No"
    );
    if(response?.statusCode === HTTPStatusCode?.OK){
      getOnboardingForm(getHRAndEngagementId?.onBoardId)
      setEditModal(false);
    }
  }

  const syncEngagement = async () => {
    setSyncLoading(true)
    let res = await engagementRequestDAO.syncEngagementDAO(getOnboardFormDetails?.onBoardID);
    if (res?.statusCode === 200) {
      setSyncLoading(false)
      message.success("Sync successfully");
    }
    setSyncLoading(false)
  }

// console.log({getOnboardFormDetails,
//   getHRAndEngagementId,})
  return (
    <>
    <div className={allengagementOnboardStyles.engagementModalWrap}>
      {  hideHeader === true ? null :
       <div className={`${allengagementOnboardStyles.engagementModalTitle} ${allengagementOnboardStyles.syncEng}`}>
        <h1>
          Onboarding for {getHRAndEngagementId?.talentName}
          {/* <button
                    type="submit"
                    className={allengagementOnboardStyles.btnPrimary}>
                    Edit Details
                </button> */}
        </h1>
        <LogoLoader visible={syncLoading} />
        {(userData?.LoggedInUserTypeID === 1 || userData?.LoggedInUserTypeID === 2) &&  <div className={allengagementOnboardStyles.syncEngagement} onClick={() => syncEngagement()}>
              <Tooltip title={'Sync Engagement data to ATS'} placement="bottom"
                style={{ "zIndex": "9999" }}

                overlayClassName="custom-syntooltip">
                <RefreshSyncSVG width="17" height="16" style={{ fontSize: '16px' }} />
              </Tooltip>
        </div>}
       
      </div>
      }
     

      <div className={allengagementOnboardStyles.engagementBody}>

        {getOnboardFormDetails?.hR_ID ? <>
         
         <br></br>
          <div className={allengagementOnboardStyles.engagementContent}>
          
          {hideHeader === true && (userData?.LoggedInUserTypeID === 1 || userData?.LoggedInUserTypeID === 2) ? <div style={{
            display:'flex',
            alignItems:'center',
            justifyContent:'space-between'
          }}><h2>Client Information</h2>
          <LogoLoader visible={syncLoading} />
          <div  className={allengagementOnboardStyles.syncEngagement} style={{marginBottom:'24px'}} onClick={() => syncEngagement()}>
              <Tooltip title={'Sync Engagement data to ATS'} placement="left"
                style={{ "zIndex": "9999" }}

                overlayClassName="custom-syntooltip">
                <RefreshSyncSVG width="17" height="16" style={{ fontSize: '16px' }} />
              </Tooltip>
        </div></div>   : <h2>Client Information</h2> }
          <ul>
            <li>
              <span>Company Name : </span>

              {getOnboardFormDetails?.companyName
                ? <Link to={`/viewCompanyDetails/${getOnboardFormDetails?.companyID}`} target="_blank">{getOnboardFormDetails?.companyName}</Link> 
                : "NA"}
            </li>

           
           

            {/* <li>
              <span>Country : </span>

              {getOnboardFormDetails?.geo ? getOnboardFormDetails?.geo : "NA"}
            </li> */}
          
            {/* <li>
              <span>Client POC Name : </span>

              {getOnboardFormDetails?.client_POC_Name
                ? getOnboardFormDetails?.client_POC_Name
                : "NA"}
            </li> */}
               <li>
              <span>Client POC : </span>

              {getOnboardFormDetails?.client_POC_Name
                ? getOnboardFormDetails?.client_POC_Name
                : "NA"}
            </li>
            <li>
              <span>Industry : </span>

              {getOnboardFormDetails?.industry
                ? getOnboardFormDetails?.industry
                : "NA"}
            </li>
            <li>
              <span>Client POC Email : </span>

              {getOnboardFormDetails?.client_POC_Email
                ? getOnboardFormDetails?.client_POC_Email
                : "NA"}
            </li>

            {/* <li>
              <span>Deal Source : </span>
              {getOnboardFormDetails?.dealSource
                ? getOnboardFormDetails?.dealSource
                : "NA"}
            </li> */}

            {/* <li>
              <span>Deal Owner : </span>
              {getOnboardFormDetails?.deal_Owner
                ? getOnboardFormDetails?.deal_Owner
                : "NA"}
            </li> */}

            {/* <li>
							<span>Client Name:</span>{' '}
						
							{/* {getOnboardFormDetails?.onboardDetails?.clientName}
							{getOnboardFormDetails?.client}
						</li>
						<li>
							<span>Talent Time Zone:</span>{' '}
							{getOnboardFormDetails?.onboardDetails?.timeZone}
						</li>
						<li>
							<span>Client Email:</span>{' '}
							{getOnboardFormDetails?.onboardDetails?.clientemail}
						</li>
						<li>
							<span>Talent Shift Start & End Time:</span>{' '}
							{getOnboardFormDetails?.shiftStartTime} to{' '}
							{getOnboardFormDetails?.shiftEndTime} IST
						</li>
						<li>
							<span>Company Name:</span> {getOnboardFormDetails?.companyName}
						</li>
						<li>
							<span>Talent Onboarding Date:</span>{' '}
							{getOnboardFormDetails?.onboardDetails?.talentOnBoardDate && moment(getOnboardFormDetails?.onboardDetails?.talentOnBoardDate).format('DD/MM/yyyy')}
						</li>
						<li>
							<span>Talent Onboarding Time:</span>{' '}
							{getOnboardFormDetails?.onboardDetails?.talentOnBoardTime}
						</li>
						<li>
							<span>Talent Full Name:</span>{' '}
							{getOnboardFormDetails?.onboardDetails?.talentName}{' '}
						</li>
						<li>
							<span>Talent Email:</span>{' '}
							{getOnboardFormDetails?.onboardDetails?.talentEmailId}{' '}
						</li>
						<li>
							<span>Punch Time:</span>{' '}
							{getOnboardFormDetails?.onboardDetails?.punchTime}{' '}
						</li>
						<li>
							<span>Working Day:</span>{' '}
							{getOnboardFormDetails?.onboardDetails?.workingDay}{' '}
						</li>
						<li>
							<span>Working TimeZone:</span>{' '}
							{scheduleTimezone?.filter(timeZone => `${timeZone.id}` === getOnboardFormDetails?.workingTimeZone)[0]?.value }{' '}
						</li>
						<li>
							<span>Talent TimeZone:</span>{' '}
							{scheduleTimezone?.filter(timeZone => `${timeZone.id}` === getOnboardFormDetails?.onboardDetails?.timeZone)[0]?.value }{' '}
						</li>
						<li>
							<span>Engagement ID:</span>{' '}
							{getOnboardFormDetails?.onboardDetails?.engagemenID}
						</li>
						<li>
							<span>Bill Rate:</span> {getOnboardFormDetails?.billRate} {getOnboardFormDetails?.talentCurrencyCode}
						</li>
						<li>
							<span>Hiring ID:</span>{' '}
							{getOnboardFormDetails?.onboardDetails?.hiringRequestNumber}
						</li>
						<li>
							<span>Actual Bill Rate:</span>{' '}
							{`${getOnboardFormDetails?.talentPayRate} ${getOnboardFormDetails?.talentCurrencyCode}`} 
						</li>
						<li>
							<span> Contract Type:</span> {getOnboardFormDetails?.contractType}
						</li>
						<li>
							<span>Talent Pay Rate:</span>{' '}
							{getOnboardFormDetails?.talentPayRate} {getOnboardFormDetails?.talentCurrencyCode}
						</li>
						<li>
							<span> Contract Duration:</span>{' '}
							{getOnboardFormDetails?.contractDutation} Months
						</li>
						<li>
							<span>Actual Talent Pay Rate:</span>{' '}
							{getOnboardFormDetails?.payRate} {getOnboardFormDetails?.talentCurrencyCode}
						</li>
						<li>
							<span>Contract Start & End Date:</span>{' '}
							{ getOnboardFormDetails?.contractStartDate && moment(getOnboardFormDetails?.contractStartDate).format('DD/MM/yyyy')} to{' '}
							{getOnboardFormDetails?.contractEndDate && moment(getOnboardFormDetails?.contractEndDate).format('DD/MM/yyyy')}
						</li>
						<li>
							<span>Client’s First Date:</span>{' '}
							{getOnboardFormDetails?.onboardDetails?.clientFirstDate && moment(getOnboardFormDetails?.onboardDetails?.clientFirstDate).format('DD/MM/yyyy') }
						</li>
						<li>
							<span>AM Name:</span> {getOnboardFormDetails?.aM_Name}
						</li>
						<li>
							<span>Net Payment Days:</span>{' '}
							{getOnboardFormDetails?.onboardDetails?.netPaymentDays}
						</li>
						<li>
							<span>BD Name:</span> Anjali Arora
						</li>
						<li>
							<span>Contact Renewal %:</span>{' '}
							{getOnboardFormDetails?.autoRenewContract}%
						</li> */}
          </ul>
        </div>


        <div className={allengagementOnboardStyles.engagementContent}>
          <h2>Hiring Request Details</h2>
          <ul>
          <li>
              <span>HR ID : </span>
              <a
                target="_blank"
                href={`/allhiringrequest/${getOnboardFormDetails.hR_ID}`}
                rel="noreferrer"
              >
                {getOnboardFormDetails?.hrNumber
                  ? getOnboardFormDetails?.hrNumber
                  : "NA"}
              </a>
            </li>
            <li>
              <span>No. of Employees : </span>

              {getOnboardFormDetails?.noOfEmployee
                ? getOnboardFormDetails?.noOfEmployee
                : "NA"}
            </li>
          

            {/* <li>
              <span>UTS HR Accepted by : </span>
              {getOnboardFormDetails?.utS_HRAcceptedBy
                ? getOnboardFormDetails?.utS_HRAcceptedBy
                : "NA"}
            </li> */}

            <li>
              <span>Job Title : </span>
              {getOnboardFormDetails?.hRJobTitle
                ? getOnboardFormDetails?.hRJobTitle
                : "NA"}
            </li>

            <li>
              <span>Discovery Call Link : </span>
              {getOnboardFormDetails?.discovery_Link ? <a
                target="_blank"
                href={getOnboardFormDetails?.discovery_Link}
                rel="noreferrer"
              >
                {getOnboardFormDetails?.discovery_Link}
              </a> : "NA"}
              
            </li>
            {/* <li>
              <span>Interview Link : </span>
              <a
                target="_blank"
                href={getOnboardFormDetails?.interView_Link}
                rel="noreferrer"
              >
                {getOnboardFormDetails?.interView_Link}
              </a>
            </li> */}
            <li>
              <span>Job Description : </span>
              {/* <button className={HRDetailStyle.onboardingDownload}><DownloadJDSVG/>Download JD</button> */}

              {getOnboardFormDetails?.jobDescription?.split(":")[0] ===
                "http" ||
              getOnboardFormDetails?.jobDescription?.split(":")[0] ===
                "https" ? (
                <a
                  rel="noreferrer"
                  href={getOnboardFormDetails?.jobDescription}
                  style={{ textDecoration: "underline" }}
                  target="_blank"
                >
                  {/* <DownloadJDSVG /> */}
                  Download JD
                </a>
              ) : (
                <a
                  rel="noreferrer"
                  href={
                    NetworkInfo.PROTOCOL +
                    NetworkInfo.DOMAIN +
                    "Media/JDParsing/JDfiles/" +
                    getOnboardFormDetails?.jobDescription
                  }
                  style={{ textDecoration: "underline" }}
                  target="_blank"
                >
                  <DownloadJDSVG />
                  Download JD
                </a>
              )}
            </li>

            <li>
              <span>Mode of Working : </span>
              {getOnboardFormDetails?.workForceManagement
                ? getOnboardFormDetails?.workForceManagement
                : "NA"}
            </li>

                { getOnboardFormDetails?.workForceManagement !== 'Remote' && <>
                 <li>
              <span>City : </span>
              {getOnboardFormDetails?.cityName
                ? getOnboardFormDetails?.cityName
                : "NA"}
            </li>

            {/* <li>
              <span>State : </span>
              {getOnboardFormDetails?.stateName
                ? getOnboardFormDetails?.stateName
                : "NA"}
            </li> */} 
                </>}
           
          </ul>
        </div>

        <div className={allengagementOnboardStyles.engagementContent}>
          <h2>Talent Details</h2>
          <ul>
            <li>
              <span>Talent Name : </span>

              {getOnboardFormDetails?.talentName
                ? getOnboardFormDetails?.talentName
                : "NA"}
            </li>
            <li>
              <span>Talent Designation : </span>

              {getOnboardFormDetails?.talent_Designation
                ? getOnboardFormDetails?.talent_Designation
                : "NA"}
            </li>

         

            {getOnboardFormDetails?.hrType === "Direct Placement" ? (
              <>
                <li>
                  <span>Uplers fees amount : </span>
                  {getOnboardFormDetails?.uplersfeesAmount
                    ? budgetStringToCommaSeprated(getOnboardFormDetails?.uplersfeesAmount)
                    : "NA"}
                </li>
                <li>
                  <span>Talent's Current Pay: </span>
                  {getOnboardFormDetails?.currentCTC
                    ? budgetStringToCommaSeprated(getOnboardFormDetails?.currentCTC)
                    : "NA"}
                </li>
                <li>
                  <span>Uplers fees % : </span>
                  {getOnboardFormDetails?.dP_Percentage
                    ? getOnboardFormDetails?.dP_Percentage
                    : "NA"}
                </li>
                <li>
                  <span>Talent's Expected Pay : </span>
                  {getOnboardFormDetails?.expectedSalary
                    ? budgetStringToCommaSeprated(getOnboardFormDetails?.expectedSalary)
                    : "NA"}
                </li>
              </>
            ) : (
              <>
                {/* <li>
                  <span>Pay Rate : </span>
                  {getOnboardFormDetails?.payRate
                    ? getOnboardFormDetails?.payRate
                    : "NA"}
                </li> */}
                <li>
                  <span>Client's Bill Amount : </span>
                  {getOnboardFormDetails?.billRate
                    ? budgetStringToCommaSeprated(getOnboardFormDetails?.billRate)
                    : "NA"}
                </li>
              
                <li>
                  <span>Talent's Current Pay: </span>
                  {getOnboardFormDetails?.currentCTC
                    ? budgetStringToCommaSeprated(getOnboardFormDetails?.currentCTC)
                    : "NA"}
                </li>
                <li>
                  <span>Uplers fees % : </span>
                  {getOnboardFormDetails?.nrPercentage
                    ? getOnboardFormDetails?.nrPercentage
                    : "NA"}
                </li>
                <li>
                  <span>Talent's Expected Pay : </span>
                  {getOnboardFormDetails?.expectedSalary
                    ? budgetStringToCommaSeprated(getOnboardFormDetails?.expectedSalary)
                    : "NA"}
                </li>
                <li>
                  <span>Uplers fees amount : </span>
                  {getOnboardFormDetails?.uplersfeesAmount
                    ? budgetStringToCommaSeprated(getOnboardFormDetails?.uplersfeesAmount)
                    : "NA"}
                </li>
              </>
            )}

            <li>
              <span>Talent Profile Link : </span>
              {getOnboardFormDetails?.talentProfileLink ? (
                <a
                  target="_blank"
                  href={getOnboardFormDetails?.talentProfileLink}
                  rel="noreferrer"
                >
                  {getOnboardFormDetails?.talentProfileLink}
                </a>
              ) : (
                "NA"
              )}
            </li>

            <li>
              <span>Talent's Offered CTC : </span>
              {getOnboardFormDetails?.offeredCTC ? (
               
                  budgetStringToCommaSeprated(getOnboardFormDetails?.offeredCTC)
              ) : (
                "NA"
              )}
            </li>

            <li>
              <span>Talent IST Shift Start Time : </span>

              {getOnboardFormDetails?.shiftStartTime
                ? getOnboardFormDetails?.shiftStartTime
                : "NA"}
            </li>

            <li>
              <span>Talent IST Shift End Time : </span>

              {getOnboardFormDetails?.shiftEndTime
                ? getOnboardFormDetails?.shiftEndTime
                : "NA"}
            </li>

            <li>
              <span>Availability : </span>

              {getOnboardFormDetails?.availability
                ? getOnboardFormDetails?.availability
                : "NA"}
            </li>

            <li>
              <span>Net Payment Term : </span>
              {getOnboardFormDetails?.payment_NetTerm
                ? getOnboardFormDetails?.payment_NetTerm
                : "NA"}
            </li>
          </ul>
        </div>

        <div className={allengagementOnboardStyles.engagementContent}>
          <h2>Invoicing and Legal</h2>
          <ul>
            <li>
              <span>Invoice Raising to : </span>

              {getOnboardFormDetails?.inVoiceRaiseTo
                ? getOnboardFormDetails?.inVoiceRaiseTo
                : "NA"}
            </li>
            <li>
              <span>Invoice Raising to Email: </span>

              {getOnboardFormDetails?.inVoiceRaiseToEmail
                ? getOnboardFormDetails?.inVoiceRaiseToEmail
                : "NA"}
            </li>

            
            {/* <li>
              <span>BDR/MDR Name : </span>

              {getOnboardFormDetails?.bdR_MDR_Name
                ? getOnboardFormDetails?.bdR_MDR_Name
                : "NA"}
            </li> */}

<li>
              <span>MSA Sign Date : </span>

              {getOnboardFormDetails?.msaSignDate
                ? moment(getOnboardFormDetails?.msaSignDate).format(
                    "DD-MM-YYYY"
                  )
                : "NA"}
            </li>

            <li>
              <span>Payment Terms: </span>

              {getOnboardFormDetails?.payment_NetTerm
                ? getOnboardFormDetails?.payment_NetTerm + ' days'
                : "NA"}
            </li>

            <li>
              <span>SOW Sign Date : </span>

              {getOnboardFormDetails?.clientLegalDate
                ? moment(getOnboardFormDetails?.clientLegalDate).format(
                    "DD-MM-YYYY"
                  )
                : "NA"}
            </li>
           
           {getOnboardFormDetails?.sowDocument && <li>
              <span>SOW Document/Link : </span>

              {getOnboardFormDetails?.sowDocument
                ? getOnboardFormDetails?.sowDocument
                : "NA"}
            </li>} 
          </ul>
        </div>
        <div className={allengagementOnboardStyles.engagementContent}>
          <h2>Contract Details</h2>
          <ul>
          <li>
              <span>EngagementID : </span>
              {getOnboardFormDetails?.engagemenID}
            </li>
            <li>
              <span>Engagement Type : </span>
              {getOnboardFormDetails?.hrEngagementType}
            </li>            

          <li>
              <span>Engagement Start Date : </span>

              {getOnboardFormDetails?.contractStartDate
                ? moment(getOnboardFormDetails?.contractStartDate).format(
                    "DD-MM-YYYY"
                  )
                : "NA"}
            </li>
            <li>
              <span>Talent Joining Date : </span>

              {/* {getOnboardFormDetails?.talentOnBoardDate
                ? getOnboardFormDetails?.talentOnBoardDate
                : "NA"} */}

              {getOnboardFormDetails?.joiningDate
                ? moment(getOnboardFormDetails?.joiningDate).format(
                    "DD-MM-YYYY"
                  )
                : "NA"}
            </li>

            <li>
              <span>Engagement End Date : </span>

              {getOnboardFormDetails?.contractEndDate
                ? moment(getOnboardFormDetails?.contractEndDate).format(
                    "DD-MM-YYYY"
                  )
                : "NA"}
            </li> 
           
           

           {/*  <li>
              <span>Timezone : </span>

              {getOnboardFormDetails?.kickOffTimeZone
                ? getOnboardFormDetails?.kickOffTimeZone
                : "NA"}
            </li> */}

          
            

           
            {/* <li>
              <span>Zoho Invoice Number: </span>

              {getOnboardFormDetails?.zohoInvoiceNumber
                ? getOnboardFormDetails?.zohoInvoiceNumber
                : "NA"}
            </li>
            <li>
              <span>Invoice Value : </span>

              {getOnboardFormDetails?.invoiceAmount
                ? getOnboardFormDetails?.invoiceAmount +
                  " " +
                  getOnboardFormDetails?.talent_CurrencyCode
                : "NA"}
            </li> */}
       
            <li>
              <span>Talent Last Working Date : </span>

              {getOnboardFormDetails?.lastWorkingDate
                ? moment(getOnboardFormDetails?.lastWorkingDate).format(
                    "DD-MM-YYYY"
                  )
                : "NA"}
            </li>   

             { getOnboardFormDetails?.hrType !== "Direct Placement" && getOnboardFormDetails?.contractDuration && 
            getOnboardFormDetails?.contractDuration > 0 ?  <li>
              <span>Contract Duration (In Months) : </span>

              {getOnboardFormDetails?.contractDuration
                ? getOnboardFormDetails?.contractDuration
                : "NA"}
            </li> : 
            <li>
              <span>Contract Duration : </span>
              {getOnboardFormDetails?.contractDuration == 0
                ? "indefinite"
                : "NA"}
            </li>}         

             <li>
            <span>Renewal Discussion Initiated : </span>
              {getOnboardFormDetails?.isRenewalInitiated 
                ? getOnboardFormDetails?.isRenewalInitiated 
                : "NA"}
              <span
                          className={allengagementOnboardStyles.editNewIcon}
                          style={{marginLeft:"10px",cursor:"pointer"}}
                          onClick={() => setEditModal(true)}
                        >
                          <EditNewIcon />
                        </span>
            </li>
          
          </ul>
          <br></br>
          
          <ul>

                <li>
                <span>How does the first week look like : </span>

              {getOnboardFormDetails?.talent_FirstWeek
                ? getOnboardFormDetails?.talent_FirstWeek
                : "NA"}
                </li>
                
              <li>
              <span>How does the first month look like : </span>

              {getOnboardFormDetails?.talent_FirstMonth
                ? getOnboardFormDetails?.talent_FirstMonth
                : "NA"}
              </li>

            {getOnboardFormDetails?.hrType === "Direct Placement" ? (
              <></>
            ) : (
              <>
                <li>
                  <span>Softwares & Tools Required : </span>

                  {getOnboardFormDetails?.softwareToolsRequired
                    ? getOnboardFormDetails?.softwareToolsRequired
                    : "NA"}
                </li>
                <li>
                  <span>Device Policy : </span>

                  {getOnboardFormDetails?.devicesPoliciesOption
                    ? getOnboardFormDetails?.devicesPoliciesOption
                    : "NA"}
                </li>
                <li>
                  <span>Device Type : </span>

                  {getOnboardFormDetails?.device_Radio_Option
                    ? getOnboardFormDetails?.device_Radio_Option
                    : "NA"}
                </li>
                <li>
                  <span>Work Option : </span>
                  {getOnboardFormDetails?.work_option
                    ? getOnboardFormDetails?.work_option
                    : "NA"}
                </li>
                <li>
                  <span>Talent Device Detail: </span>

                  {getOnboardFormDetails?.talentDeviceDetails
                    ? getOnboardFormDetails?.talentDeviceDetails
                    : "NA"}
                </li>
                <li>
                  <span>Client Device Description: </span>

                  {getOnboardFormDetails?.client_DeviceDescription
                    ? getOnboardFormDetails?.client_DeviceDescription
                    : "NA"}
                </li>

                <li>
                  <span>Leave Polices : </span>

                  {getOnboardFormDetails?.proceedWithUplers_LeavePolicyOption
                    ? getOnboardFormDetails?.proceedWithUplers_LeavePolicyOption
                    : "NA"}
                </li>
                {getOnboardFormDetails?.proceedWithUplers_LeavePolicyOption !==
                "Proceed with Uplers Policies" ? (
                  getOnboardFormDetails?.proceedWithClient_LeavePolicyLink ? (
                    <li>
                      <span>Leave Polices Link : </span>

                      {getOnboardFormDetails?.proceedWithClient_LeavePolicyLink
                        ? getOnboardFormDetails?.proceedWithClient_LeavePolicyLink
                        : "NA"}
                    </li>
                  ) : (
                    <li>
                      <span>Upload Polices File : </span>

                      {getOnboardFormDetails?.leavePolicyFileName
                        ? getOnboardFormDetails?.leavePolicyFileName
                        : "NA"}
                    </li>
                  )
                ) : null}
              </>
            )}

            {getOnboardFormDetails?.exit_Policy && <li className={allengagementOnboardStyles.width100}>
              <span>Exit Polices : </span>

              {getOnboardFormDetails?.exit_Policy
                ? <label dangerouslySetInnerHTML={{__html:getOnboardFormDetails?.exit_Policy}}></label> 
                : "NA"}
            </li>}

            <li className={allengagementOnboardStyles.width100}>
              <span>Feedback Process : </span>

              {getOnboardFormDetails?.feedback_Process
                ? getOnboardFormDetails?.feedback_Process
                : "NA"}
            </li>
          </ul>
        </div>

        <div className={allengagementOnboardStyles.engagementContent}>
          <h2>About Company</h2>

          {/* <div className={allengagementOnboardStyles.engagementContentList}> */}
          <div className="jobDescrition">
            <span>A Bit about company culture : </span>

            {getOnboardFormDetails?.company_Description
              ? <div dangerouslySetInnerHTML={{__html:getOnboardFormDetails?.company_Description}}></div>
              : "NA"}
          </div>
         
        </div>

          {teamMembersDetails?.length > 0 &&  <div className={allengagementOnboardStyles.engagementContent}>
          <h2>Client’s Team Members</h2>

          {teamMembersDetails.map(member=>  <div className={allengagementOnboardStyles.modalFormCol}>
                        <div className={allengagementOnboardStyles.onboardingCurrentTextWrap}>
                            <div className={allengagementOnboardStyles.onboardingCurrentText}>
                                <span>Name: </span>
                                <span className={allengagementOnboardStyles.onboardingTextBold}>{member.teamName}</span>
                            </div>
                            <div className={allengagementOnboardStyles.onboardingCurrentText}>
                                <span>Designation: </span>
                                <span className={allengagementOnboardStyles.onboardingTextBold}>{member.designation}</span>
                            </div>
                            <div className={allengagementOnboardStyles.onboardingCurrentText}>
                                <span>Reporting To:</span>
                                <span className={allengagementOnboardStyles.onboardingTextBold}>{member.reportingTo}</span>
                            </div>
                            <div className={allengagementOnboardStyles.onboardingCurrentText}>
                                <span>LinkedIn :</span>
                                <span className={allengagementOnboardStyles.onboardingTextBold}><a href={member.linkedin} target="_blank" rel="noreferrer" >{member.linkedin}</a>  <LinkedinClientSVG width="16" height="16"/></span>
                            </div> 
                            <div className={allengagementOnboardStyles.onboardingCurrentText}>
                                <span>Email:</span>
                                <span className={allengagementOnboardStyles.onboardingTextBold}>{member.email}</span>
                            </div> 
                            <div className={allengagementOnboardStyles.onboardingCurrentText}>
                                <span>Buddy:</span>
                                <span className={allengagementOnboardStyles.onboardingTextBold}>{member.buddy}</span>
                            </div>
                        </div>
                    </div>)}
        </div>}
       

        {/* <div className={allengagementOnboardStyles.engagementContent}>
          <h2>During Legal</h2>
          <ul>
            <li>
              <span>MSA Sign Date : </span>

              {getOnboardFormDetails?.msaSignDate
                ? moment(getOnboardFormDetails?.msaSignDate).format(
                    "DD-MM-YYYY"
                  )
                : "NA"}
            </li>

            <li>
              <span>SOW Sign Date : </span>

              {getOnboardFormDetails?.clientLegalDate
                ? moment(getOnboardFormDetails?.clientLegalDate).format(
                    "DD-MM-YYYY"
                  )
                : "NA"}
            </li>
            <li>
              <span>SOW Document/Link : </span>

              {getOnboardFormDetails?.sowDocument
                ? getOnboardFormDetails?.sowDocument
                : "NA"}
            </li>
          </ul>
        </div> */}

        
        </> : <h2>No Data Available</h2>}
      

        {/* <div className={allengagementOnboardStyles.engagementContent}>
          <h2>Team Members</h2>
          <ul>
            {getOnboardFormDetails?.listOnBoardClientTeam?.map((item) => {
              <>
                <li>
                  <span>Name:</span>
                  {item?.name}
                </li>
                <li>
                  <span>Designation:</span> {item?.Designation}
                </li>
                <li>
                  <span>Reporting To:</span>
                  {item?.ReportingTo}
                </li>
                <li>
                  <span>LinkedIn:</span> {item?.Linkedin}{" "}
                  <a
                    href=""
                    target="_blank"
                    className={allengagementOnboardStyles.liLink}
                  >
                    <LinkedInSVG />
                  </a>
                </li>
                <li>
                  <span>Email:</span> {item?.Email}
                </li>
                <li>
                  <span>Buddy:</span> {item?.Buddy}
                </li>
              </>;
            })}
          </ul>
        </div>

        <div className={allengagementOnboardStyles.engagementContent}>
          <h2>Device Policies</h2>
          <p>{getOnboardFormDetails?.devicesPoliciesOption}</p>
        </div>

        <div
          className={`${allengagementOnboardStyles.engagementContent} ${allengagementOnboardStyles.engagementContentGroup}`}
        >
          <h2>Expectation From Talent</h2>
          <h4>First Week:</h4>
          <p>{getOnboardFormDetails?.expectationFirstWeek}</p>

          <h4>First Month:</h4>
          <p>{getOnboardFormDetails?.expectationFirstMonth}</p>

          <h4>Additional Information:</h4>
          <p>{getOnboardFormDetails?.expectationAdditionalInformation}</p>
        </div>

        <div
          className={`${allengagementOnboardStyles.engagementContent} ${allengagementOnboardStyles.engagementPolicy}`}
        >
          <p>
            <span>Leave Policies:</span>{" "}
            <a href="#" title="Proceed with Uplers Policies">
              {getOnboardFormDetails?.proceedWithUplers_ExitPolicyOption}
            </a>
          </p>
          <p>
            <span>Exit Policy:</span>{" "}
            <strong>{getOnboardFormDetails?.exitPolicyFileName}</strong>
          </p>
          <p>
            <span>Feedback Policy:</span>{" "}
            <strong>
              Weekly during the first 2 weeks | Fortnightly for the next 2
              months | Monthly / Quarterly feedback thereafter
            </strong>
          </p>
        </div> */}
      </div>
    </div>
     <Modal
      width={'300px'}
      centered
      footer={false}
      open={editModal}
      className="creditTransactionModal customTransactionModal"
      onOk={() => setEditModal(false)}
      onCancel={() => setEditModal(false)}
    >
      <div className={allengagementOnboardStyles.engagementContentEdit}>
        <Checkbox
          name="renewal"
          checked={renewalDiscussion?.IsRenewalInitiated}
          onChange={(e) => {
            setRenewalDiscussion({
              ...renewalDiscussion,
              IsRenewalInitiated: e.target.checked,
            });
          }}
        >
          Renewal Discussion Initiated
        </Checkbox>
      </div>
      <div>
        <button
          type="button"
          className={allengagementOnboardStyles.btnPrimary}
          onClick={handleSubmit}
        >
          SAVE
        </button>
      </div>
    </Modal>
   </>
  );
};

export default EngagementOnboard;
