import React, { useCallback, useEffect, useState } from 'react';
import allengagementStyles from '../engagementFeedback/engagementFeedback.module.css';



const EngagementFeedback = ({
}) => {

    return (
        <div className={allengagementStyles.engagementModalWrap}>
            <div className={allengagementStyles.engagementModalTitle}>
                <h1>Feedback for Kiritkumar Avaiya</h1>
                <p><span>HR ID:</span> HR151122121801 | <span>Engagement ID:</span> EN151122121801</p>
            </div>

            <div className={allengagementStyles.feebackTableWrap}>
                <table>
                    <thead>
                        <tr>
                            <th>Last Feedback<br /> Date</th>
                            <th>Feedback<br /> Type</th>
                            <th width="40%">Feedback Comments</th>
                            <th>Action To Take</th>
                        </tr>
                    </thead>

                    <tr>
                        <td>01-03-2023</td>
                        <td><label className={`${allengagementStyles.greenLabel} ${allengagementStyles.feedbackLabel}`}>Green</label></td>
                        <td>Very Good Communication, Excellent Work, Knows his stuff. I recommend it to everyone. Rapide and Professional.</td>
                        <td>Client Does not need any replacement as of now.</td>
                    </tr>
                    <tr>
                        <td>21-02-2023</td>
                        <td><label className={`${allengagementStyles.readLabel} ${allengagementStyles.feedbackLabel}`}>Red</label></td>
                        <td>To be clear I expect there to be two parts of the credit: A credit of $534.10 for the five days which Gaurav did not work over the period for which he was contracted to us (3 Oct to 11 Nov). A further $1389 for the 13 work days in November for which he was not contracted to us but for which we have already paid. There has been noticeable improvement over the past three days, so things are looking promising at this stage. Talent is performing good, contract got renewed Talent is missing Analytical Though process as he is not able to deliver on accounts which needs to be managed from Scratch.!06 jan-Udayan confirmed that bRian is really happy with his performance now !13 jan-He is still lacking in thinking logically He needs to see the data with 3-4 different viewpoints I requested a client to work with him closely to see if he can imitate client thought process or the way you see the data - Client does not have an issue Client does not want his replacement, Because he is happy with Udayan on other aspects of business. As per client -The pointer/ plan of action prepared by Udayan is helpful to an extent on how to do things systematically, but can't be much helpful in observing the dataset.</td>
                        <td>So Jan-enrolled in online courses on GTM analytics. Aiming to complete the course in 45 days informed this to Brian as well.</td>
                    </tr>

                    <tr>
                        <td colSpan={4} className={allengagementStyles.pastFeedbackTitle}>
                            <h2>Past Feedbacks</h2>
                        </td>
                    </tr>

                    <tr>
                        <td colSpan={4} className={allengagementStyles.pastFeedbackID}>
                            HR ID: HR151122121801 | Engagement ID: EN151122121801
                        </td>
                    </tr>

                    <tr>
                        <td>01-03-2023</td>
                        <td><label className={`${allengagementStyles.greenLabel} ${allengagementStyles.feedbackLabel}`}>Green</label></td>
                        <td>Very Good Communication, Excellent Work, Knows his stuff. I recommend it to everyone. Rapide and Professional.</td>
                        <td>Client Does not need any replacement as of now.</td>
                    </tr>

                    <tr>
                        <td colSpan={4} className={allengagementStyles.pastFeedbackID}>
                            HR ID: HR151122121801 | Engagement ID: EN151122121801
                        </td>
                    </tr>

                    <tr>
                        <td>01-03-2023</td>
                        <td><label className={`${allengagementStyles.orangeLabel} ${allengagementStyles.feedbackLabel}`}>Orange</label></td>
                        <td>Very Good Communication, Excellent Work, Knows his stuff. I recommend it to everyone. Rapide and Professional.</td>
                        <td>Client Does not need any replacement as of now.</td>
                    </tr>

                    <tr>
                        <td>01-03-2023</td>
                        <td><label className={`${allengagementStyles.greenLabel} ${allengagementStyles.feedbackLabel}`}>Green</label></td>
                        <td>Very Good Communication, Excellent Work, Knows his stuff. I recommend it to everyone. Rapide and Professional.</td>
                        <td>Client Does not need any replacement as of now.</td>
                    </tr>
                </table>
            </div>
        </div>
    );
};

export default EngagementFeedback;
