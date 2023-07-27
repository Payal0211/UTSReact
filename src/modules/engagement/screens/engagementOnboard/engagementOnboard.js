import { InputType } from 'constants/application';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import allengagementOnboardStyles from '../engagementOnboard/engagementOnboard.module.css';
import { ReactComponent as LinkedInSVG } from 'assets/svg/linkedin.svg';
import WithLoader from 'shared/components/loader/loader';

const EngagementOnboard = ({
	getOnboardFormDetails,
	getHRAndEngagementId,
	isLoading,
	scheduleTimezone
}) => {
	console.log("getOnboardFormDetails",getOnboardFormDetails, scheduleTimezone)
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
				<div className={allengagementOnboardStyles.engagementContent}>
					<h2>General Information</h2>
					<ul>
						<li>
							<span>Client Name:</span>{' '}
							{getOnboardFormDetails?.onboardDetails?.clientName}
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
							{getOnboardFormDetails?.startTime} to{' '}
							{getOnboardFormDetails?.endTime} IST
						</li>
						<li>
							<span>Company Name:</span> {getOnboardFormDetails?.compnayName}
						</li>
						<li>
							<span>Talent Onboarding Date:</span>{' '}
							{getOnboardFormDetails?.onboardDetails?.talentOnBoardDate}
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
							{getOnboardFormDetails?.contractStartDate} to{' '}
							{getOnboardFormDetails?.contractEndDate}
						</li>
						<li>
							<span>Client’s First Date:</span>{' '}
							{getOnboardFormDetails?.onboardDetails?.clientFirstDate}
						</li>
						<li>
							<span>AM Name:</span> {getOnboardFormDetails?.amUser}
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
						</li>
					</ul>
				</div>

				<div className={allengagementOnboardStyles.engagementContent}>
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
									<span>LinkedIn:</span> {item?.Linkedin}{' '}
									<a
										href=""
										target="_blank"
										className={allengagementOnboardStyles.liLink}>
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
					className={`${allengagementOnboardStyles.engagementContent} ${allengagementOnboardStyles.engagementContentGroup}`}>
					<h2>Expectation From Talent</h2>
					<h4>First Week:</h4>
					<p>{getOnboardFormDetails?.expectationFirstWeek}</p>

					<h4>First Month:</h4>
					<p>{getOnboardFormDetails?.expectationFirstMonth}</p>

					<h4>Additional Information:</h4>
					<p>{getOnboardFormDetails?.expectationAdditionalInformation}</p>
				</div>

				<div
					className={`${allengagementOnboardStyles.engagementContent} ${allengagementOnboardStyles.engagementPolicy}`}>
					<p>
						<span>Leave Policies:</span>{' '}
						<a
							href="#"
							title="Proceed with Uplers Policies">
							{getOnboardFormDetails?.proceedWithUplers_ExitPolicyOption}
						</a>
					</p>
					<p>
						<span>Exit Policy:</span>{' '}
						<strong>{getOnboardFormDetails?.exitPolicyFileName}</strong>
					</p>
					<p>
						<span>Feedback Policy:</span>{' '}
						<strong>
							Weekly during the first 2 weeks | Fortnightly for the next 2
							months | Monthly / Quarterly feedback thereafter
						</strong>
					</p>
				</div>
			</div>
		</div>
	);
};

export default EngagementOnboard;
