import { InputType } from "constants/application";
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import HRSelectField from "modules/hiring request/components/hrSelectField/hrSelectField";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import allengagementOnboardStyles from "../engagementOnboard/engagementOnboard.module.css";
import { ReactComponent as LinkedInSVG } from "assets/svg/linkedin.svg";
import WithLoader from "shared/components/loader/loader";
import moment from "moment";
import { NetworkInfo } from "constants/network";
import { ReactComponent as DownloadJDSVG } from "assets/svg/downloadJD.svg";
import { ReactComponent as LinkedinClientSVG } from 'assets/svg/LinkedinClient.svg';

const EngagementOnboard = ({
  getOnboardFormDetails : gOBFD,
  getHRAndEngagementId,
  isLoading,
  scheduleTimezone,
}) => {

  let getOnboardFormDetails = gOBFD?.onboardContractDetails
  let teamMembersDetails = gOBFD?.onBoardClientTeamMembers

// console.log({getOnboardFormDetails,
//   getHRAndEngagementId,})
  return (
    <div className={allengagementOnboardStyles.engagementModalWrap}>
      <div className={allengagementOnboardStyles.engagementModalTitle}>
        <h1>
          Onboarding for {getHRAndEngagementId?.talentName}
          {/* <button
                    type="submit"
                    className={allengagementOnboardStyles.btnPrimary}>
                    Edit Details
                </button> */}
        </h1>
      </div>

      <div className={allengagementOnboardStyles.engagementBody}>

        {getOnboardFormDetails?.hR_ID ? <>
          <div className={allengagementOnboardStyles.engagementContent}>
          <h2>General Information</h2>
          <ul>
            <li>
              <span>Company Name : </span>

              {getOnboardFormDetails?.companyName
                ? getOnboardFormDetails?.companyName
                : "NA"}
            </li>

            <li>
              <span>Client Email/Name : </span>

              {getOnboardFormDetails?.client
                ? getOnboardFormDetails?.client
                : "NA"}
            </li>
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
              <span>Country : </span>

              {getOnboardFormDetails?.geo ? getOnboardFormDetails?.geo : "NA"}
            </li>
            <li>
              <span>No. of Employees : </span>

              {getOnboardFormDetails?.noOfEmployee
                ? getOnboardFormDetails?.noOfEmployee
                : "NA"}
            </li>
            <li>
              <span>Client POC Name : </span>

              {getOnboardFormDetails?.client_POC_Name
                ? getOnboardFormDetails?.client_POC_Name
                : "NA"}
            </li>
            <li>
              <span>Client POC Email : </span>

              {getOnboardFormDetails?.client_POC_Email
                ? getOnboardFormDetails?.client_POC_Email
                : "NA"}
            </li>
            <li>
              <span>Industry : </span>

              {getOnboardFormDetails?.industry
                ? getOnboardFormDetails?.industry
                : "NA"}
            </li>
            <li>
              <span>Discovery Call Link : </span>
              <a
                target="_blank"
                href={getOnboardFormDetails?.discovery_Link}
                rel="noreferrer"
              >
                {getOnboardFormDetails?.discovery_Link}
              </a>
            </li>
            <li>
              <span>Interview Link : </span>
              <a
                target="_blank"
                href={getOnboardFormDetails?.interView_Link}
                rel="noreferrer"
              >
                {getOnboardFormDetails?.interView_Link}
              </a>
            </li>
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
                  <DownloadJDSVG />
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
              <span>AM Name : </span>

              {getOnboardFormDetails?.aM_Name
                ? getOnboardFormDetails?.aM_Name
                : "NA"}
            </li>

            <li>
              <span>Deal Source : </span>
              {getOnboardFormDetails?.dealSource
                ? getOnboardFormDetails?.dealSource
                : "NA"}
            </li>

            <li>
              <span>Deal Owner : </span>
              {getOnboardFormDetails?.deal_Owner
                ? getOnboardFormDetails?.deal_Owner
                : "NA"}
            </li>

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
              <span>Net Payment Term : </span>
              {getOnboardFormDetails?.payment_NetTerm
                ? getOnboardFormDetails?.payment_NetTerm
                : "NA"}
            </li>

            {getOnboardFormDetails?.hrType === "Direct Placement" ? (
              <>
                <li>
                  <span>DP amount : </span>
                  {getOnboardFormDetails?.dpAmount
                    ? getOnboardFormDetails?.dpAmount
                    : "NA"}
                </li>
                <li>
                  <span>Current CTC : </span>
                  {getOnboardFormDetails?.currentCTC
                    ? getOnboardFormDetails?.currentCTC
                    : "NA"}
                </li>
                <li>
                  <span>DP % : </span>
                  {getOnboardFormDetails?.dP_Percentage
                    ? getOnboardFormDetails?.dP_Percentage
                    : "NA"}
                </li>
                <li>
                  <span>Expected Rate : </span>
                  {getOnboardFormDetails?.expectedSalary
                    ? getOnboardFormDetails?.expectedSalary
                    : "NA"}
                </li>
              </>
            ) : (
              <>
                <li>
                  <span>Pay Rate : </span>
                  {getOnboardFormDetails?.payRate
                    ? getOnboardFormDetails?.payRate
                    : "NA"}
                </li>
                <li>
                  <span>Bill Rate : </span>
                  {getOnboardFormDetails?.billRate
                    ? getOnboardFormDetails?.billRate
                    : "NA"}
                </li>
                <li>
                  <span>NR % : </span>
                  {getOnboardFormDetails?.nrPercentage
                    ? getOnboardFormDetails?.nrPercentage
                    : "NA"}
                </li>
              </>
            )}

            <li>
              <span>UTS HR Accepted by : </span>
              {getOnboardFormDetails?.utS_HRAcceptedBy
                ? getOnboardFormDetails?.utS_HRAcceptedBy
                : "NA"}
            </li>

            <li>
              <span>Role Title : </span>
              {getOnboardFormDetails?.talentRole
                ? getOnboardFormDetails?.talentRole
                : "NA"}
            </li>

            <li>
              <span>Workforce Management : </span>
              {getOnboardFormDetails?.workForceManagement
                ? getOnboardFormDetails?.workForceManagement
                : "NA"}
            </li>
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
              <span>Availability : </span>

              {getOnboardFormDetails?.availability
                ? getOnboardFormDetails?.availability
                : "NA"}
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
          </ul>
        </div>

        <div className={allengagementOnboardStyles.engagementContent}>
          <h2>Invoicing and Contract</h2>
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

            <li>
              <span>UTS Contract Duration (In Months) : </span>

              {getOnboardFormDetails?.contractDuration
                ? getOnboardFormDetails?.contractDuration
                : "NA"}
            </li>
            <li>
              <span>BDR/MDR Name : </span>

              {getOnboardFormDetails?.bdR_MDR_Name
                ? getOnboardFormDetails?.bdR_MDR_Name
                : "NA"}
            </li>
          </ul>
        </div>

        <div className={allengagementOnboardStyles.engagementContent}>
          <h2>About Company</h2>

          <div className={allengagementOnboardStyles.engagementContentList}>
            <span>A Bit about company culture : </span>

            {getOnboardFormDetails?.company_Description
              ? getOnboardFormDetails?.company_Description
              : "NA"}
          </div>
          <div className={allengagementOnboardStyles.engagementContentList}>
            <span>How does the first week look like : </span>

            {getOnboardFormDetails?.talent_FirstWeek
              ? getOnboardFormDetails?.talent_FirstWeek
              : "NA"}
          </div>
          <div className={allengagementOnboardStyles.engagementContentList}>
            <span>How does the first month look like : </span>

            {getOnboardFormDetails?.talent_FirstMonth
              ? getOnboardFormDetails?.talent_FirstMonth
              : "NA"}
          </div>
          <ul>
            {/* <li>
              <span>A Bit about company culture : </span>

              {getOnboardFormDetails?.company_Description
                ? getOnboardFormDetails?.company_Description
                : "NA"}
            </li>
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
            </li> */}

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

            <li>
              <span>Exit Polices : </span>

              {getOnboardFormDetails?.exit_Policy
                ? getOnboardFormDetails?.exit_Policy
                : "NA"}
            </li>

            <li>
              <span>Feedback Process : </span>

              {getOnboardFormDetails?.feedback_Process
                ? getOnboardFormDetails?.feedback_Process
                : "NA"}
            </li>
          </ul>
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
       

        <div className={allengagementOnboardStyles.engagementContent}>
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
        </div>

        <div className={allengagementOnboardStyles.engagementContent}>
          <h2>Before Kick-off</h2>
          <ul>
            <li>
              <span>Kick off call Date : </span>

              {getOnboardFormDetails?.talentLegalDate
                ? moment(getOnboardFormDetails?.talentLegalDate).format(
                    "DD-MM-YYYY"
                  )
                : "NA"}
            </li>

            <li>
              <span>Timezone : </span>

              {getOnboardFormDetails?.kickOffTimeZone
                ? getOnboardFormDetails?.kickOffTimeZone
                : "NA"}
            </li>

            <li>
              <span>Talent Reporting POC : </span>

              {getOnboardFormDetails?.talentReportingPOC
                ? getOnboardFormDetails?.talentReportingPOC
                : "NA"}
            </li>
          </ul>
        </div>

        <div className={allengagementOnboardStyles.engagementContent}>
          <h2>After Kick-off</h2>
          <ul>
            <li>
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
              <span>Engagement End Date : </span>

              {getOnboardFormDetails?.contractEndDate
                ? moment(getOnboardFormDetails?.contractEndDate).format(
                    "DD-MM-YYYY"
                  )
                : "NA"}
            </li>

            <li>
              <span>Talent Start Date : </span>

              {/* {getOnboardFormDetails?.talentOnBoardDate
                ? getOnboardFormDetails?.talentOnBoardDate
                : "NA"} */}

              {getOnboardFormDetails?.contractStartDate
                ? moment(getOnboardFormDetails?.contractStartDate).format(
                    "DD-MM-YYYY"
                  )
                : "NA"}
            </li>
          </ul>
        </div>
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
  );
};

export default EngagementOnboard;
