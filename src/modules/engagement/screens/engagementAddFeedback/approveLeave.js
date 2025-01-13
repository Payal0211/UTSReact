import React, { useCallback, useEffect, useState } from 'react';
import allengagementAddFeedbackStyles from '../engagementBillAndPayRate/engagementBillRate.module.css';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import UploadModal from 'shared/components/uploadModal/uploadModal';
import { ReactComponent as CloseSVG } from 'assets/svg/close.svg';
import { ReactComponent as UploadSVG } from 'assets/svg/upload.svg';
import { InputType,	GoogleDriveCredentials } from 'constants/application';
import { useForm } from "react-hook-form";
import { Skeleton } from 'antd';

const ApproveLeaveModal = ({handleApproveleave,approveLeaveData, onCancel,isLeaveLoading}) => {
    const [fileData,setFileData]= useState('')
    const [showUploadModal,setShowUploadModal] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
      const [getValidation, setValidation] = useState({
            systemFileUpload: '',
            googleDriveFileUpload: '',
            linkValidation: '',
        })

        const {
            register,
            formState: { errors },
          } = useForm();

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

    return (
        <div className={allengagementAddFeedbackStyles.engagementModalWrap}
        >
            <div className={`${allengagementAddFeedbackStyles.headingContainer} ${allengagementAddFeedbackStyles.addFeebackContainer}`}>
                <h1>Approve Leave</h1>
                <h4>This action will affect the pay rate of the talent for the respective month.</h4>
                {approveLeaveData.leaveDate && <h4>Date : {approveLeaveData.leaveDate.replace('/','To')}</h4>}
                {approveLeaveData.leaveReason && <h4>Leave Reason : {approveLeaveData.leaveReason}</h4>}
            </div>
           
            <div className={allengagementAddFeedbackStyles.row} style={{marginBottom:'10px'}}>
              <div
                    className={allengagementAddFeedbackStyles.colMd12}>
                        {isLeaveLoading ? <Skeleton active /> : 
                        fileData === '' ? (
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

            <div className={allengagementAddFeedbackStyles.formPanelAction} style={{marginTop:'20px'}}>
                <button
                    // disabled={isLoading}
                    type="submit"
                    onClick={()=>{handleApproveleave(approveLeaveData,fileData)}}
                    className={allengagementAddFeedbackStyles.btnPrimary}
                    disabled={isLeaveLoading}
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
