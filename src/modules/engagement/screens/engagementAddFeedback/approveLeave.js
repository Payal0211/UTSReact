import React, { useCallback, useEffect, useState } from 'react';
import allengagementAddFeedbackStyles from '../engagementBillAndPayRate/engagementBillRate.module.css';

const ApproveLeaveModal = ({handleApproveleave,approveLeaveData, onCancel}) => {

    return (
        <div className={allengagementAddFeedbackStyles.engagementModalWrap}
        >
            <div className={`${allengagementAddFeedbackStyles.headingContainer} ${allengagementAddFeedbackStyles.addFeebackContainer}`}>
                <h1>Approve Leave</h1>
                <h4>This action will affect the pay rate of the talent for the respective month.</h4>
            </div>
           
            

            <div className={allengagementAddFeedbackStyles.formPanelAction} style={{marginTop:'20px'}}>
                <button
                    // disabled={isLoading}
                    type="submit"
                    onClick={()=>{handleApproveleave(approveLeaveData)}}
                    className={allengagementAddFeedbackStyles.btnPrimary}
                    >
                    Approve
                </button>
                <button
                    onClick={() => {

                        onCancel()
                    }}
                    className={allengagementAddFeedbackStyles.btn}>
                    Cancel
                </button>
            </div>
        </div >
    );
};

export default ApproveLeaveModal;
