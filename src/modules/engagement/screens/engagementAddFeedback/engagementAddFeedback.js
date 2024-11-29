import {  Skeleton, message } from 'antd';
import { InputType,	GoogleDriveCredentials } from 'constants/application';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import allengagementAddFeedbackStyles from '../engagementBillAndPayRate/engagementBillRate.module.css';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import 'react-datepicker/dist/react-datepicker.css';
import { engagementRequestDAO } from 'core/engagement/engagementDAO';
import { HTTPStatusCode } from 'constants/network';
import moment from 'moment';
import useDrivePicker from 'react-google-drive-picker/dist';
import { ReactComponent as CloseSVG } from 'assets/svg/close.svg';
import { ReactComponent as UploadSVG } from 'assets/svg/upload.svg';
import UploadModal from 'shared/components/uploadModal/uploadModal';



const EngagementAddFeedback = ({ getFeedbackFormContent, onCancel, feedBackSave, setFeedbackSave, register, handleSubmit, setValue, control, setError, getValues, watch, reset, resetField, errors, setFeedbackTypeEdit, feedBackTypeEdit,setClientFeedbackList
}) => {
    const watchFeedbackDate = watch('feedBackDate')
    const submitFeedbacHandler = async (data) => {
        setIsLoading(true)
        const feedBackdata = {
            hiringRequest_ID: getFeedbackFormContent?.hiringRequest_ID,
            contactID: getFeedbackFormContent?.contactID,
            onBoardID: getFeedbackFormContent?.onBoardID,
            feedbackType: data?.feedbackType.value,
            feedbackComment: data?.feedbackComments,
            feedbackActionToTake: data?.actionToTake,
            feedbackCreatedDateTime: data?.feedBackDate,
            hrNumber: getFeedbackFormContent?.hrNumber,
            talentName: getFeedbackFormContent?.talentName,
            talentID: getFeedbackFormContent?.talentID,
            engagemenID: getFeedbackFormContent?.engagementID,
            supportingFilename : getUploadFileData
        }
        const response = await engagementRequestDAO.saveFeedbackFormDAO(feedBackdata);
        if (response.statusCode === HTTPStatusCode.OK) {
            onCancel()
            setFeedbackSave(!feedBackSave)
            setClientFeedbackList && setClientFeedbackList(prev=> [{...response.responseBody?.details,engagemenID:getFeedbackFormContent?.engagemenID},...prev])
            isLoading(false)
        }
        setIsLoading(false)
    }
    const [getUploadFileData, setUploadFileData] = useState('');
    const [showUploadModal, setUploadModal] = useState(false);
    const [jdURLLink, setJDURLLink] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [getValidation, setValidation] = useState({
		systemFileUpload: '',
		googleDriveFileUpload: '',
		linkValidation: '',
	})
// console.log({getUploadFileData})
    const uploadFileHandler = useCallback(
		async (e) => {
			setIsLoading(true);
			let fileData = e.target.files[0];

			if (
				fileData?.type !== 'application/pdf' &&
				fileData?.type !== 'application/docs' &&
				fileData?.type !== 'application/msword' &&
				fileData?.type !== 'text/plain' &&
				fileData?.type !==
					'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
				fileData?.type !== 'image/png' &&
				fileData?.type !== 'image/jpeg'
			) {
				setValidation({
					...getValidation,
					systemFileUpload:
						'Uploaded file is not a valid, Only pdf, docs, jpg, jpeg, png, text and rtf files are allowed',
				});
				setIsLoading(false);
			} else if (fileData?.size >= 500000) {
				setValidation({
					...getValidation,
					systemFileUpload:
						'Upload file size more than 500kb, Please Upload file upto 500kb',
				});
				setIsLoading(false);
			} else {
				let formData = new FormData();
				formData.append('File', e.target.files[0]);
                formData.append('File2', "fileData");
                // console.log({FD:formData.get('File')
                //     , fileData});
				let uploadFileResponse = await engagementRequestDAO.uploadFeedbackSupportingFileDAO(formData);
				if (uploadFileResponse.statusCode === HTTPStatusCode.OK) {
					if (
						fileData?.type === 'image/png' ||
						fileData?.type === 'image/jpeg'
					) {
						setUploadFileData(fileData?.name);
						setUploadModal(false);
						setValidation({
							...getValidation,
							systemFileUpload: '',
						});
						// setJDParsedSkills(
						// 	uploadFileResponse && uploadFileResponse?.responseBody?.details,
						// );
						message.success('File uploaded successfully');
					} else if (
						fileData?.type === 'application/pdf' ||
						fileData?.type === 'application/docs' ||
						fileData?.type === 'application/msword' ||
						fileData?.type === 'text/plain' ||
						fileData?.type ===
							'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
					) {
						setUploadFileData(fileData?.name);
						// setJDParsedSkills(
						// 	uploadFileResponse && uploadFileResponse?.responseBody?.details,
						// );
						// setJDDumpID(
						// 	uploadFileResponse &&
						// 		uploadFileResponse?.responseBody?.details?.JDDumpID,
						// );
						setUploadModal(false);
						setValidation({
							...getValidation,
							systemFileUpload: '',
						});
						message.success('File uploaded successfully');
					}
				}
				setIsLoading(false);
			}
		},
		[getValidation,],
	);

   

    useEffect(() => {
        setValue('feedBackDate',new Date());
    }, [getFeedbackFormContent])

    return (
        <div className={allengagementAddFeedbackStyles.engagementModalWrap}
        >
            <div className={`${allengagementAddFeedbackStyles.headingContainer} ${allengagementAddFeedbackStyles.addFeebackContainer}`}>
                <h1>Add Feedback</h1>
                <ul>
                    <li><span>HR ID:</span> {getFeedbackFormContent?.hrNumber}</li>
                    <li className={allengagementAddFeedbackStyles.divider}>|</li>
                    <li><span>Engagement ID:</span>{getFeedbackFormContent?.engagemenID}</li>
                    <li className={allengagementAddFeedbackStyles.divider}>|</li>
                    <li><span>Talent Name:</span> {getFeedbackFormContent?.talentName}</li>
                </ul>
            </div>
            {isLoading ?<Skeleton /> :
            <>
            <div className={allengagementAddFeedbackStyles.row}>
                <div
                    className={allengagementAddFeedbackStyles.colMd6}>
                    <HRSelectField
                        mode='id/value'
                        controlledValue={feedBackTypeEdit}
                        setControlledValue={setFeedbackTypeEdit}
                        isControlled={true}
                        setValue={setValue}
                        register={register}
                        name="feedbackType"
                        label="Feedback Type"
                        defaultValue="Please Select"
                        options={getFeedbackFormContent.drpFeedbackType?.filter((item) => item?.value !== "0")}
                        required
                        isError={
                            errors['feedbackType'] && errors['feedbackType']
                        }
                        errorMsg="Please select a feedbacktype."
                    />
                </div>
                <div
                    className={`${allengagementAddFeedbackStyles.colMd6}`}>
                    <label className={allengagementAddFeedbackStyles.timeLabel}>Feedback Date</label>
                    <div className={allengagementAddFeedbackStyles.timeSlotItem}>
                        <Controller
                            render={({ ...props }) => (
                                <DatePicker
                                    selected={watchFeedbackDate ? watchFeedbackDate : null}
                                    placeholderText="Please Select Date"
                                    onChange={(date) => {
                                        setValue('feedBackDate', date);
                                    }}
                                    dateFormat="dd/MM/yyyy H:mm:ss"
                                />
                            )}
                            name="feedBackDate"
                            rules={{ required: true }}
                            control={control}
                        />
                        {errors.feedBackDate && (
                            <div className={allengagementAddFeedbackStyles.error}>
                                * Please select feedback date
                            </div>
                        )}
                        <CalenderSVG />
                    </div>
                </div>
            </div>
            <div className={allengagementAddFeedbackStyles.row}>
                <div
                    className={allengagementAddFeedbackStyles.colMd12}>
                    <HRInputField
                        register={register}
                        required
                        isTextArea={true}
                        rows={4}
                        errors={errors}
                        validationSchema={{
                            required: 'Please enter the feedback comment.',
                        }}
                        label={'Feedback Comments'}
                        name="feedbackComments"
                        type={InputType.TEXT}
                        placeholder="Enter Client's Feedback Comments"
                    />
                </div>
            </div>

            <div className={allengagementAddFeedbackStyles.row}>
                <div
                    className={allengagementAddFeedbackStyles.colMd12}>
                    <HRInputField
                        register={register}
                        isTextArea={true}
                        rows={4}
                        errors={errors}
                        validationSchema={{
                            required: 'Please enter the action to take.',
                        }}
                        label={'Action to Take'}
                        name="actionToTake"
                        type={InputType.TEXT}
                        placeholder="Add the Next Action to Take"
                    />
                </div>
            </div>
</>
}
            
           

            <div className={allengagementAddFeedbackStyles.row}>
                <div
                    className={allengagementAddFeedbackStyles.colMd12}>
                    {!getUploadFileData ? (
									<HRInputField
										disabled={jdURLLink}
										register={register}
										leadingIcon={<UploadSVG />}
										label={`Supporting File`}
										name="jdExport"
										type={InputType.BUTTON}
										buttonLabel="Supporting File"
										// value="Upload JD File"
										onClickHandler={() => setUploadModal(true)}
										// required={!jdURLLink && getUploadFileData}
										// validationSchema={{
										// 	required: 'please select a file.',
										// }}
										errors={errors}
									/>
								) : (
									<div className={allengagementAddFeedbackStyles.uploadedJDWrap}>
										<label>Supporting File (PDF) </label>
										<div className={allengagementAddFeedbackStyles.uploadedJDName}>
											{getUploadFileData}{' '}
											<CloseSVG
												className={allengagementAddFeedbackStyles.uploadedJDClose}
												onClick={() => {
													setUploadFileData('');
												}}
											/>
										</div>
									</div>
								)}

                    {showUploadModal && (
								<UploadModal
									isGoogleDriveUpload={false}
									isLoading={isLoading}
									uploadFileHandler={uploadFileHandler}
									// googleDriveFileUploader={() => googleDriveFileUploader()}
									// uploadFileFromGoogleDriveLink={uploadFileFromGoogleDriveLink}
									modalTitle={'Supporting File'}
									modalSubtitle={'File should be (JPG, PNG, PDF)'}
									isFooter={false}
									openModal={showUploadModal}
									setUploadModal={setUploadModal}
									cancelModal={() => setUploadModal(false)}
									setValidation={setValidation}
									getValidation={getValidation}
									// getGoogleDriveLink={getGoogleDriveLink}
									// setGoogleDriveLink={setGoogleDriveLink}
								/>
							)}
                </div>
            </div>

            <div className={allengagementAddFeedbackStyles.formPanelAction}>
                <button
                    // disabled={isLoading}
                    type="submit"
                    onClick={handleSubmit(submitFeedbacHandler)}
                    className={allengagementAddFeedbackStyles.btnPrimary}
                    disabled={isLoading}>
                    Save
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

export default EngagementAddFeedback;
