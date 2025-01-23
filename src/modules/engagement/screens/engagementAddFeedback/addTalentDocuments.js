import {  Select, Skeleton, message } from 'antd';
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



const AddTalentDocuments = ({docTypeList,getDocumentsDetails, getFeedbackFormContent, onCancel, feedBackSave, setFeedbackSave, register, handleSubmit, setValue, control,  getValues, watch, reset, resetField, errors, setFeedbackTypeEdit, feedBackTypeEdit,setClientFeedbackList
}) => {
    const watchFeedbackDate = watch('feedBackDate')
   
    const [getUploadFileData, setUploadFileData] = useState('');
    const [showUploadModal, setUploadModal] = useState(false);
    const [jdURLLink, setJDURLLink] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [getValidation, setValidation] = useState({
		systemFileUpload: '',
		googleDriveFileUpload: '',
		linkValidation: '',
	})
    const [formError,SetFormError] = useState(false)
    const [DocumentList,setDocumentList] = useState([{id:1,documentType:'',filedata:'',showUploadModal:false,uploadingFile:false}])

    const uploadDocument = async (data,ind)=>{
        setDocumentList(prev=>{
            let oldArr = [...prev]
            oldArr[ind] = {...oldArr[ind],uploadingFile:true}
            return oldArr
        })
        let formData = new FormData()
        formData.append('DocumentTypeID',data.documentType)
        formData.append('TalentID',getFeedbackFormContent.talentID)
        formData.append('DocumentName',data.filedata.name)
        formData.append('Files',data.filedata)
        let result = await engagementRequestDAO.uploadDocumentsDetailsDAO(formData)
 
        if(result.statusCode === 200){
            message.success(`Files ${result.responseBody.details[0].fileName} uploaded successfully.`)
            if(ind === DocumentList.length - 1){
                
                getDocumentsDetails(getFeedbackFormContent.talentID)
                setDocumentList([{id:1,documentType:'',filedata:'',showUploadModal:false,uploadingFile:false}])
                onCancel()
            }else{
                setDocumentList(prev=> prev.filter(i=> i.id === data.id))
            }
        }
    }

    const submitFeedbacHandler = async (data) => {
        setIsLoading(true)
        let isformvalid = true

        DocumentList.forEach(docItem=>{
            Object.keys(docItem).forEach(key=>{
                if(docItem[key] === ''){
                 isformvalid = false   
                } 
            })
        })

        if(isformvalid){
            DocumentList.forEach((docItem,ind)=>{
                uploadDocument(docItem,ind)
            })
        }else{
             SetFormError(true)     
        }
        
           
        setIsLoading(false)
    }
// console.log({getUploadFileData})

const uploadFileHandler = (e,ind) => {
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
    } else if (fileData?.size >= 2048000) {
        setValidation({
            ...getValidation,
            systemFileUpload:
                'Upload file size more than 2MB, please upload file upto 2MB',
        });
        setIsLoading(false);
    } else {
        
     
        setDocumentList(prev=>{
            let oldArr = [...prev]
            oldArr[ind] = {...oldArr[ind],filedata:e.target.files[0],showUploadModal:false}
            return oldArr
        })
        // setUploadModal(false);
        setIsLoading(false);
    }
}
   

    useEffect(() => {
        setValue('feedBackDate',new Date());
    }, [getFeedbackFormContent])

    return (
        <div className={allengagementAddFeedbackStyles.engagementModalWrap}
        >
            <div className={`${allengagementAddFeedbackStyles.headingContainer} ${allengagementAddFeedbackStyles.addFeebackContainer}`}>
                <h1>Add Documents</h1>
                <ul>
                    <li><span>HR ID:</span> {getFeedbackFormContent?.hrNumber}</li>
                    <li className={allengagementAddFeedbackStyles.divider}>|</li>
                    <li><span>Engagement ID:</span>{getFeedbackFormContent?.engagemenID}</li>
                    <li className={allengagementAddFeedbackStyles.divider}>|</li>
                    <li><span>Talent Name:</span> {getFeedbackFormContent?.talentName}</li>
                </ul>
            </div>
            {isLoading ?<Skeleton /> :
            <div>
               {DocumentList.map((doc,ind)=> {

                return <div key={doc.id}>
                    {DocumentList[ind].uploadingFile ? <Skeleton active /> :
                    <>
                      {ind !== 0 && <h4 style={{paddingTop:'10px',borderTop:'2px solid darkgray', marginTop:'10px'}}> Document ( {ind + 1} ) </h4>}
            <div className={allengagementAddFeedbackStyles.row} style={{marginBottom:'10px'}}>
                
                <div
                    className={allengagementAddFeedbackStyles.colMd6}>
                        <div className={`form-group`}>
                                              <h3>Document Type <span>*</span></h3>
                                              
                                              <Select
                                                  placeholder='Select frequency of office visits'
                                                  tokenSeparators={[","]}
                                                  defaultValue="Please Select"
                                                  onSelect={(e) => {
                                                    setDocumentList(prev=>{
                                                        let oldArr = [...prev]
                                                        oldArr[ind] = {...oldArr[ind],documentType:e}
                                                        return oldArr
                                                    })
                                                  }}                                                         
                                                  value={DocumentList[ind].documentType ?? "Please Select"}
                                                  options={docTypeList}
                                              />
                                              {formError && DocumentList[ind].documentType === '' &&  <span className={allengagementAddFeedbackStyles.error}>please select</span>}
                                          </div>
                    {/* <HRSelectField
                        mode='id/value'
                        controlledValue={feedBackTypeEdit}
                        setControlledValue={setFeedbackTypeEdit}
                        isControlled={true}
                        setValue={setValue}
                        register={register}
                        name="documentType"
                        label="Document Type"
                        defaultValue="Please Select"
                        options={docTypeList}
                        required
                        isError={
                            errors['documentType'] && errors['documentType']
                        }
                        errorMsg="Please select a feedbacktype."
                    /> */}
                </div>
                <div
                    className={`${allengagementAddFeedbackStyles.colMd6} ${allengagementAddFeedbackStyles.documentActionButton}`}>
                      {ind === DocumentList.length -1 &&  <button onClick={()=>{setDocumentList(prev=>([...prev,{id:prev[prev.length - 1].id + 1,documentType:'',filedata:'',showUploadModal:false}]))}}>Add More</button>}  
                      {ind !== 0 && <button  className={`${allengagementAddFeedbackStyles.red}`} onClick={()=>{setDocumentList(prev=>prev.filter(i=> i.id !== doc.id))}}>Remove</button>}  
               </div>
            </div>

            <div className={allengagementAddFeedbackStyles.row}>
                <div
                    className={allengagementAddFeedbackStyles.colMd12}>
                    {!DocumentList[ind].filedata ? (
									<HRInputField
										register={register}
										leadingIcon={<UploadSVG />}
										label={`Upload Document`}
										name="jdExport"
										type={InputType.BUTTON}
										buttonLabel="Upload Document"
										// value="Upload JD File"
										onClickHandler={() => setDocumentList(prev=>{
                                            let oldArr = [...prev]
                                            oldArr[ind] = {...oldArr[ind],showUploadModal:true}
                                            return oldArr
                                        })}
										// required={!jdURLLink && getUploadFileData}
										// validationSchema={{
										// 	required: 'please select a file.',
										// }}
										errors={errors}
									/>
								) : (
									<div className={allengagementAddFeedbackStyles.uploadedJDWrap}>
										<label>Upload Document </label>
										<div className={allengagementAddFeedbackStyles.uploadedJDName}>
											{DocumentList[ind].filedata?.name}{' '}
											<CloseSVG
												className={allengagementAddFeedbackStyles.uploadedJDClose}
												onClick={() => {
													setDocumentList(prev=>{
                                                        let oldArr = [...prev]
                                                        oldArr[ind] = {...oldArr[ind],filedata:''}
                                                        return oldArr
                                                    })
												}}
											/>
										</div>
									</div>
								)}
 {formError && DocumentList[ind].filedata === '' &&  <span className={allengagementAddFeedbackStyles.error}>please select document</span>}
                    {DocumentList[ind].showUploadModal && (
								<UploadModal
									isGoogleDriveUpload={false}
									isLoading={isLoading}
									uploadFileHandler={e=>uploadFileHandler(e,ind)}
									// googleDriveFileUploader={() => googleDriveFileUploader()}
									// uploadFileFromGoogleDriveLink={uploadFileFromGoogleDriveLink}
									modalTitle={'Upload Document'}
									modalSubtitle={'File should be (JPG, PNG, PDF)'}
									isFooter={false}
									openModal={DocumentList[ind].showUploadModal}
									setUploadModal={()=>setDocumentList(prev=>{
                                        let oldArr = [...prev]
                                        oldArr[ind] = {...oldArr[ind],showUploadModal:false}
                                        return oldArr
                                    })}
									cancelModal={() => setDocumentList(prev=>{
                                        let oldArr = [...prev]
                                        oldArr[ind] = {...oldArr[ind],showUploadModal:false}
                                        return oldArr
                                    })}
									setValidation={setValidation}
									getValidation={getValidation}
									// getGoogleDriveLink={getGoogleDriveLink}
									// setGoogleDriveLink={setGoogleDriveLink}
								/>
							)}
                </div>
            </div>
                    </>
                    }

              
            
</div>
               })}   
            </div>
          
}
            
           

            

            <div className={allengagementAddFeedbackStyles.formPanelAction} style={{marginTop:'20px'}}>
                <button
                    // disabled={isLoading}
                    type="submit"
                    onClick={submitFeedbacHandler}
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

export default AddTalentDocuments;
