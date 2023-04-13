import React, { useCallback, useEffect, useState } from 'react';
import allengagementStyles from '../engagementFeedback/engagementFeedback.module.css';
import { Table } from 'antd';
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton';
import WithLoader from 'shared/components/loader/loader';

const EngagementFeedback = ({ getHRAndEngagementId, feedbackTableColumnsMemo, getClientFeedbackList, isLoading, pageFeedbackSizeOptions, getFeedbackPagination, setFeedbackPagination
}) => {

    return (
        <div className={allengagementStyles.tableDetails}>
            <div className={allengagementStyles.engagementModalTitle}>
                <h1>Feedback for {getHRAndEngagementId?.talentName}</h1>
                <p><span>HR ID:</span> {getHRAndEngagementId?.hrNumber ? getHRAndEngagementId?.hrNumber : ""} | <span>Engagement ID:</span> {getClientFeedbackList[0]?.engagemenID ? getClientFeedbackList[0]?.engagemenID : ""}</p>
            </div>



            {isLoading ? (
                <TableSkeleton />
            ) : (
                <WithLoader>
                    <Table
                        id="hrListingTable"
                        columns={feedbackTableColumnsMemo}
                        bordered={false}
                        dataSource={
                            [...getClientFeedbackList]
                        }
                        pagination={{
                            onChange: (pageNum, pageSize) => {
                                setFeedbackPagination((prev) => ({ ...prev, pageIndex: pageNum }))
                                setFeedbackPagination((prev) => ({ ...prev, pageSize: pageSize }))
                                setFeedBackData({
                                    ...feedBackData,
                                    totalRecords: pageSize,
                                    pagenumber: pageNum,
                                });
                            },
                            size: 'small',
                            pageSize: getFeedbackPagination?.pageSize,
                            pageSizeOptions: pageFeedbackSizeOptions,
                            total: getFeedbackPagination?.totalRecords,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${getFeedbackPagination?.totalRecords} items`,
                            defaultCurrent: getFeedbackPagination?.pageIndex,
                        }}
                    />
                </WithLoader>
            )}
        </div>



        // <div className={allengagementStyles.engagementModalWrap}>
        //     <div className={allengagementStyles.engagementModalTitle}>
        //         <h1>Feedback for Kiritkumar Avaiya</h1>
        //         <p><span>HR ID:</span> {getHRAndEngagementId?.hrNumber ? getHRAndEngagementId?.hrNumber : ""} | <span>Engagement ID:</span> {getHRAndEngagementId?.engagementID ? getHRAndEngagementId?.engagementID : ""}</p>
        //     </div>

        //     <div className={allengagementStyles.feebackTableWrap}>
        //         <table>
        //             <thead>
        //                 <tr>
        //                     <th>Last Feedback<br /> Date</th>
        //                     <th>Feedback<br /> Type</th>
        //                     <th width="40%">Feedback Comments</th>
        //                     <th>Action To Take</th>
        //                 </tr>
        //             </thead>

        //             <tr>
        //                 <td>01-03-2023</td>
        //                 <td><label className={`${allengagementStyles.greenLabel} ${allengagementStyles.feedbackLabel}`}>Green</label></td>
        //                 <td>Very Good Communication, Excellent Work, Knows his stuff. I recommend it to everyone. Rapide and Professional.</td>
        //                 <td>Client Does not need any replacement as of now.</td>
        //             </tr>
        //             <tr>
        //                 <td>21-02-2023</td>
        //                 <td><label className={`${allengagementStyles.readLabel} ${allengagementStyles.feedbackLabel}`}>Red</label></td>
        //                 <td>To be clear I expect there to be two parts of the credit: A credit of $534.10 for the five days which Gaurav did not work over the period for which he was contracted to us (3 Oct to 11 Nov). A further $1389 for the 13 work days in November for which he was not contracted to us but for which we have already paid. There has been noticeable improvement over the past three days, so things are looking promising at this stage. Talent is performing good, contract got renewed Talent is missing Analytical Though process as he is not able to deliver on accounts which needs to be managed from Scratch.!06 jan-Udayan confirmed that bRian is really happy with his performance now !13 jan-He is still lacking in thinking logically He needs to see the data with 3-4 different viewpoints I requested a client to work with him closely to see if he can imitate client thought process or the way you see the data - Client does not have an issue Client does not want his replacement, Because he is happy with Udayan on other aspects of business. As per client -The pointer/ plan of action prepared by Udayan is helpful to an extent on how to do things systematically, but can't be much helpful in observing the dataset.</td>
        //                 <td>So Jan-enrolled in online courses on GTM analytics. Aiming to complete the course in 45 days informed this to Brian as well.</td>
        //             </tr>

        //             <tr>
        //                 <td colSpan={4} className={allengagementStyles.pastFeedbackTitle}>
        //                     <h2>Past Feedbacks</h2>
        //                 </td>
        //             </tr>

        //             <tr>
        //                 <td colSpan={4} className={allengagementStyles.pastFeedbackID}>
        //                     HR ID: HR151122121801 | Engagement ID: EN151122121801
        //                 </td>
        //             </tr>

        //             <tr>
        //                 <td>01-03-2023</td>
        //                 <td><label className={`${allengagementStyles.greenLabel} ${allengagementStyles.feedbackLabel}`}>Green</label></td>
        //                 <td>Very Good Communication, Excellent Work, Knows his stuff. I recommend it to everyone. Rapide and Professional.</td>
        //                 <td>Client Does not need any replacement as of now.</td>
        //             </tr>

        //             <tr>
        //                 <td colSpan={4} className={allengagementStyles.pastFeedbackID}>
        //                     HR ID: HR151122121801 | Engagement ID: EN151122121801
        //                 </td>
        //             </tr>

        //             <tr>
        //                 <td>01-03-2023</td>
        //                 <td><label className={`${allengagementStyles.orangeLabel} ${allengagementStyles.feedbackLabel}`}>Orange</label></td>
        //                 <td>Very Good Communication, Excellent Work, Knows his stuff. I recommend it to everyone. Rapide and Professional.</td>
        //                 <td>Client Does not need any replacement as of now.</td>
        //             </tr>

        //             <tr>
        //                 <td>01-03-2023</td>
        //                 <td><label className={`${allengagementStyles.greenLabel} ${allengagementStyles.feedbackLabel}`}>Green</label></td>
        //                 <td>Very Good Communication, Excellent Work, Knows his stuff. I recommend it to everyone. Rapide and Professional.</td>
        //                 <td>Client Does not need any replacement as of now.</td>
        //             </tr>
        //         </table>
        //     </div>
        // </div>
    );
};

export default EngagementFeedback;
