import {  Radio, Select, Skeleton, message } from 'antd';
import { InputType,	GoogleDriveCredentials } from 'constants/application';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import React, { useCallback, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import allengagementAddFeedbackStyles from '../engagementBillAndPayRate/engagementBillRate.module.css';

import 'react-datepicker/dist/react-datepicker.css';

import moment from 'moment';
import { amDashboardDAO } from 'core/amdashboard/amDashboardDAO';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';



const RejectLeaveModal = ({rejectLeaveData,talentID,getcalendarLeaveDetails, getFeedbackFormContent, onCancel,  register, setValue, watch, reset, errors}) => {
    const [isLoading, setIsLoading] = useState(false);

    const [formError,SetFormError] = useState(false)

  const [userData, setUserData] = useState({});
  
    useEffect(() => {
      const getUserResult = async () => {
        let userData = UserSessionManagementController.getUserSession();
        if (userData) setUserData(userData);
      };
      getUserResult();
    }, []);


    const submitRejectReqHandler = async () => {
        let isformvalid = true
        if(watch('comment')  === '' ||  watch('comment')  === undefined ){
            isformvalid = false 
        }

        if(isformvalid){
            let payload = {
                "leaveID": rejectLeaveData.leaveID,
                "actionDoneBy":userData.UserId,
                "isActionDoneByAM": userData.LoggedInUserTypeID === 6 ? true : false,  
                "leaveRejectionRemark": watch('comment'),
                "flag": "Reject"
              }

           setIsLoading(true)
        const  result = await amDashboardDAO.approveRejectLeaveDAO(payload)
            setIsLoading(false)
           getcalendarLeaveDetails(talentID)         
           reset()
           onCancel()          
        }else{ 
             SetFormError(true)     
        }
        
           
        setIsLoading(false)
    }
// console.log({getUploadFileData})


    useEffect(() => {
        setValue('feedBackDate',new Date());
    }, [getFeedbackFormContent])

    return (
        <div className={allengagementAddFeedbackStyles.engagementModalWrap}
        >
            <div className={`${allengagementAddFeedbackStyles.headingContainer} ${allengagementAddFeedbackStyles.addFeebackContainer}`}>
                <h1>Reject Leave</h1>
                {rejectLeaveData.leaveDate && <h4>Date : {rejectLeaveData.leaveDate.replace('/','To')}</h4>}
                {rejectLeaveData.leaveReason && <h4>Leave Reason : {rejectLeaveData.leaveReason}</h4>}
            </div>
            {isLoading ?<Skeleton /> :
            <div>
    

            <div className={allengagementAddFeedbackStyles.row} style={{marginBottom:'10px'}}>
            <div  className={allengagementAddFeedbackStyles.colMd12}>
            <HRInputField

label={'Comments'}
register={register}
name={'comment'}
type={InputType.TEXT}
placeholder="Enter Rejection Reason"
isTextArea
rows={5}
required
validationSchema={{
    required: 'please enter Comments.',
}}
isError={errors['comment'] && errors['comment']}
errorMsg="Please Enter comments."
/>
{formError && !watch('comment') &&  <span className={allengagementAddFeedbackStyles.error}>please enter reason</span>}
                    </div>
            </div>

            </div>
          
}
            
           

            

            <div className={allengagementAddFeedbackStyles.formPanelAction} style={{marginTop:'20px'}}>
                <button
                    // disabled={isLoading}
                    type="submit"
                    onClick={submitRejectReqHandler}
                    className={allengagementAddFeedbackStyles.btnPrimary}
                    disabled={isLoading}>
                    Reject
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

export default RejectLeaveModal;
