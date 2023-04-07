import { InputType } from 'constants/application';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import allengagementOnboardStyles from '../engagementOnboard/engagementOnboard.module.css';
import { ReactComponent as LinkedInSVG } from 'assets/svg/linkedin.svg';

const EngagementOnboard = ({
}) => {



    return (
        <div className={allengagementOnboardStyles.engagementModalWrap}>
            <div className={allengagementOnboardStyles.engagementModalTitle}>
                <h1>Onboarding for Anjali Arora <button
                    type="submit"
                    className={allengagementOnboardStyles.btnPrimary}>
                    Edit Details
                </button>
                </h1>
            </div>

            <div className={allengagementOnboardStyles.engagementBody}>
                <div className={allengagementOnboardStyles.engagementContent}>
                    <h2>General Information</h2>
                    <ul>
                        <li><span>Client Name:</span> John Stamos</li>
                        <li><span>Talent Time Zone:</span> AEST</li>
                        <li><span>Client Email:</span> johnstamos@gmail.com</li>
                        <li><span>Talent Shift Start & End Time:</span> 5 AM IST to 4 PM IST</li>
                        <li><span>Company Name:</span> Oracle Pvt. Ltd.</li>
                        <li><span>Talent Onboarding Date:</span> 5/12/2023</li>
                        <li><span>Talent Onboarding Time:</span> 5AM IST</li>
                        <li><span>Talent Full Name:</span> Anjali Arora</li>
                        <li><span>Engagement ID:</span> EID8947954793</li>
                        <li><span>Bill Rate:</span> 5000 USD/ Month</li>
                        <li><span>Hiring ID:</span> HID430438044323</li>
                        <li><span>Actual Bill Rate:</span> 5000 USD/ Month</li>
                        <li><span> Contract Type:</span> Contractual</li>
                        <li><span>Talent Pay Rate:</span> 5000 USD/ Month</li>
                        <li><span> Contract Duration:</span> 9 Months</li>
                        <li><span>Actual Talent Pay Rate:</span> 5000 USD/ Month</li>
                        <li><span>Contract Start & End Date:</span> 2/9/2022 to 2/9/2023</li>
                        <li><span>Client’s First Date:</span> 5/12/2023</li>
                        <li><span>AM Name:</span> Anjali Arora</li>
                        <li><span>Net Payment Days:</span> 5</li>
                        <li><span>BD Name:</span> Anjali Arora</li>
                        <li><span>Contact Renewal %:</span> 10%</li>
                    </ul>
                </div>

                <div className={allengagementOnboardStyles.engagementContent}>
                    <h2>Team Members</h2>
                    <ul>
                        <li><span>Name:</span> Rachel Green</li>
                        <li><span>Name:</span> Rachel Green</li>
                        <li><span>Designation:</span> Front End Developer</li>
                        <li><span>Designation:</span> Front End Developer</li>
                        <li><span>Reporting To:</span> Fredrik Champ</li>
                        <li><span>Reporting To:</span> Fredrik Champ</li>
                        <li><span>LinkedIn:</span> Rachel Green <a href="" target="_blank" className={allengagementOnboardStyles.liLink}><LinkedInSVG /></a></li>
                        <li><span>LinkedIn:</span> Rachel Green <a href="" target="_blank" className={allengagementOnboardStyles.liLink}><LinkedInSVG /></a></li>
                        <li><span>Email:</span> rachelgreen455@gmail.com</li>
                        <li><span>Email:</span> rachelgreen455@gmail.com</li>
                        <li><span>Buddy:</span> Monica Geller</li>
                        <li><span>Buddy:</span> Monica Geller</li>
                    </ul>
                </div>


                <div className={allengagementOnboardStyles.engagementContent}>
                    <h2>Device Policies</h2>
                    <p>Client can use remote desktop sercurity option facilitated by Uplers (At additional cost of $100 per month).</p>
                </div>

                <div className={`${allengagementOnboardStyles.engagementContent} ${allengagementOnboardStyles.engagementContentGroup}`}>
                    <h2>Expectation From Talent</h2>
                    <h4>First Week:</h4>
                    <p>RLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                        et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat.</p>

                    <h4>First Month:</h4>
                    <p>RLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                        et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat.</p>

                    <h4>Additional Information:</h4>
                    <p>RLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                        et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat.</p>
                </div>

                <div className={`${allengagementOnboardStyles.engagementContent} ${allengagementOnboardStyles.engagementPolicy}`}>
                    <p><span>Leave Policies:</span> <a href="#" title="Proceed with Uplers Policies">Proceed with Uplers Policies</a></p>
                    <p><span>Exit Policy:</span> <strong>First Month - 7 Days  | . Second Month Onwards - 30 Days</strong></p>
                    <p><span>Feedback Policy:</span> <strong>Weekly during the first 2 weeks  |  Fortnightly for the next 2 months  |  Monthly / Quarterly feedback thereafter</strong></p>
                </div>

            </div>
        </div>
    );
};

export default EngagementOnboard;
