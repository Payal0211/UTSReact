import {  Radio, Select, Skeleton, message } from 'antd';
import { InputType,	GoogleDriveCredentials } from 'constants/application';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import React, { useCallback, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import allengagementAddFeedbackStyles from '../engagementBillAndPayRate/engagementBillRate.module.css';
import { ReactComponent as CloseSVG } from 'assets/svg/close.svg';
import { ReactComponent as UploadSVG } from 'assets/svg/upload.svg';
import 'react-datepicker/dist/react-datepicker.css';
import UploadModal from 'shared/components/uploadModal/uploadModal';
import moment from 'moment';
import { amDashboardDAO } from 'core/amdashboard/amDashboardDAO';
import { UserSessionManagementController } from 'modules/user/services/user_session_services';



const RejectLeaveModal = ({rejectLeaveData,talentID,getcalendarLeaveDetails, getFeedbackFormContent, onCancel,  register, setValue, watch, reset, errors}) => {
    const [isLoading, setIsLoading] = useState(false);

    const [formError,SetFormError] = useState(false)
    const [fileData,setFileData]= useState('')
    const [showUploadModal,setShowUploadModal] = useState(false)
    const [getValidation, setValidation] = useState({
        systemFileUpload: '',
        googleDriveFileUpload: '',
        linkValidation: '',
    })

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

              let fileDatatoUpload = new FormData()

              Object.keys(payload).forEach(key=>{
                fileDatatoUpload.append(key,payload[key])
              })

              if(fileData !== ''){
                fileDatatoUpload.append('files',fileData)
              }

           setIsLoading(true)
            const  result = await amDashboardDAO.approveRejectLeaveDAO(fileDatatoUpload)
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

const uploadFileHandler = (e,ind) => {
    // setIsLoading(true);
    let fileData = e.target.files[0];

    if (
        fileData?.type !== 'image/png' &&
        fileData?.type !== 'image/jpg' &&
        fileData?.type !== 'image/jpeg'
    ) {
        setValidation({
            ...getValidation,
            systemFileUpload:
                'Uploaded file is not a valid, Only jpg, jpeg, png files are allowed',
        });
        // setIsLoading(false);
    } else if (fileData?.size >= 500000) {
        setValidation({
            ...getValidation,
            systemFileUpload:
                'Upload file size more than 500kb, Please Upload file upto 500kb',
        });
        // setIsLoading(false);
    } else {
        
        setFileData(e.target.files[0]);
        setShowUploadModal(false);
    }
}


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

                     <div
                    className={allengagementAddFeedbackStyles.colMd12}>
                        {                        fileData === '' ? (
                            <HRInputField
                                register={register}
                                leadingIcon={<UploadSVG />}
                                label={`Upload File`}
                                name="jdExport"
                                type={InputType.BUTTON}
                                buttonLabel="Upload File"
                                // value="Upload JD File"
                                onClickHandler={() => setShowUploadModal(true)}
                                // required={!jdURLLink && getUploadFileData}
                                // validationSchema={{
                                // 	required: 'please select a file.',
                                // }}
                                // errors={errors}
                            />
                        ) : (
                            <div className={allengagementAddFeedbackStyles.uploadedJDWrap}>
                                <label>Upload File </label>
                                <div className={allengagementAddFeedbackStyles.uploadedJDName}>
                                    {fileData?.name}{' '}
                                    <CloseSVG
                                        className={allengagementAddFeedbackStyles.uploadedJDClose}
                                        onClick={() => {
                                            setFileData('')
                                        }}
                                    />
                                </div>
                            </div>
                        )
                        }
                    {showUploadModal && (
								<UploadModal
									isGoogleDriveUpload={false}
									isLoading={isLoading}
									uploadFileHandler={e=>uploadFileHandler(e)}
									// googleDriveFileUploader={() => googleDriveFileUploader()}
									// uploadFileFromGoogleDriveLink={uploadFileFromGoogleDriveLink}
									modalTitle={'Upload File'}
									modalSubtitle={'File should be (JPG, PNG)'}
									isFooter={false}
									openModal={showUploadModal}
									setUploadModal={()=>setShowUploadModal(false)}
									cancelModal={() =>setShowUploadModal(false)}
									setValidation={setValidation}
									getValidation={getValidation}
									// getGoogleDriveLink={getGoogleDriveLink}
									// setGoogleDriveLink={setGoogleDriveLink}
								/>
							)}
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
