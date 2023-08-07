import React, { useCallback, useEffect, useState } from "react";
import dayjs from 'dayjs';
import { Skeleton, Tooltip, Modal, DatePicker,TimePicker, Tabs, Dropdown, Menu, message } from 'antd';
import HRDetailStyle from '../../screens/hrdetail/hrdetail.module.css';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import { Controller, useForm } from 'react-hook-form';
import { HRDeleteType, HiringRequestHRStatus, InputType } from 'constants/application';
import { OnboardDAO } from 'core/onboard/onboardDAO';
import { HTTPStatusCode } from 'constants/network';
import UploadModal from 'shared/components/uploadModal/uploadModal';

import { ReactComponent as DuringLegalSVG } from 'assets/svg/duringLegal.svg';
import { ReactComponent as UploadSVG } from 'assets/svg/upload.svg';
import { ReactComponent as CloseSVG } from 'assets/svg/close.svg';

import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import moment from "moment";

export default function CompleteLegal({talentDeteils,HRID, setShowAMModal,callAPI,EnableNextTab}) {

    const {
		watch,
		register,
		setValue,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({});

    // console.log(`Complete Legal t data`,talentDeteils)
    const [isTabDisabled, setTabDisabled] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [boardData, setBoardData] = useState({})
    const [showUploadModal, setUploadModal] = useState(false);
    const [getUploadFileData, setUploadFileData] = useState('');
    const [getValidation, setValidation] = useState({
		systemFileUpload: '',
		googleDriveFileUpload: '',
		linkValidation: '',
	})

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
                formData.append('onboardID',talentDeteils?.OnBoardId)
                // formData.append('File2', "fileData");
                // console.log({FD:formData.get('File')
                //     , fileData});
				let uploadFileResponse = await OnboardDAO.uploadSOWFileDAO(formData);
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
                        setValue('sowDocumentLink',fileData?.name)
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
		[getValidation,talentDeteils?.OnBoardId],
	);

    const fatchOnBoardInfo = useCallback(async (ONBID) =>{
        let result = await OnboardDAO.getTalentOnBoardInfoDAO(ONBID)
            // console.log("fatchOnBoardInfo",result.responseBody.details)

            if (result?.statusCode === HTTPStatusCode.OK){
                setBoardData(result.responseBody.details)
                setTabDisabled(result.responseBody.details.isThirdTabReadOnly)
            //    if(result.responseBody.details.kickoffStatusId === 4
            //     ){
            //         EnableNextTab(talentDeteils,HRID,'After Kick-off')
            //     }  
            }
           
            // result.responseBody.details && setValue('msaDate', result.responseBody.details)
            // setIsLoading(false)
    },[])

    useEffect(()=>{
if(boardData){
    // console.log({clientLegalDate:boardData.clientLegalDate    })

    boardData?.genOnBoardTalent?.talentLegalDate
    && setValue('sowDate', boardData?.genOnBoardTalent?.talentLegalDate)

    if( boardData?.genOnBoardTalent?.sowdocument){
        setUploadFileData(boardData?.genOnBoardTalent?.sowdocument)
    }
}
    },[boardData])

    useEffect(()=>{
        if(talentDeteils?.OnBoardId){
            fatchOnBoardInfo(talentDeteils?.OnBoardId)
        }
    },[fatchOnBoardInfo])

    useEffect(()=>{

        async function fetchData() {
            setIsLoading(true)
            let result = await OnboardDAO.getClientLegelInfoDAO(HRID)
             console.log("Fetching client msaDate",result,result.responseBody.details)
            result.responseBody.details && setValue('msaDate', dayjs(result.responseBody.details).toDate())
            setIsLoading(false)
          }
         
        if(HRID){
 fetchData();
        }
    },[HRID,setValue])
     console.log("MSA", watch('msaDate'), "sow",dayjs(watch('msaDate')).toDate())

    const submitClientLegal = useCallback(async (d)=>{
        setIsLoading(true)
        let req = {
            onboardID: talentDeteils?.OnBoardId,
            talentID: talentDeteils?.TalentID,
            hiringRequestID: HRID,
            contactID: talentDeteils?.ContactId,
            action: 'LegalClient',
            onboardingClient: {},
            legalTalent: null,
            legalClient: {
                clientLegalStatusID: 2, // dropdown selected id
                clientLegalDate: moment(d.sowDate).format('yyyy-MM-DD') ,
                totalDuration: null,
                contractStartDate: null,
                contractEndDate: null,
                lastworkingdate: null,
                companyLegalDocID: null,
                msaSignDate: moment(d.msaDate).format('yyyy-MM-DD'),
                sowDocumentLink:d.sowDocumentLink,
            },
            kickOff: null,
        };
//  console.log("complete Legal req",req)
        let response = await OnboardDAO.onboardStatusUpdatesRequestDAO(
            req,
        );
        // console.log("complete Legal response",response)
        if (response?.statusCode === HTTPStatusCode.OK) {
        setIsLoading(false)
        setShowAMModal(false)
        callAPI(HRID)
        }
        setIsLoading(false)
    },[talentDeteils, HRID,callAPI,setShowAMModal])

  return (
    <div className={HRDetailStyle.onboardingProcesswrap}>
    <div className={HRDetailStyle.onboardingProcesspart}>
        <div className={HRDetailStyle.onboardingProcesBox}>
            {isLoading ? <Skeleton /> : <>
             <div className={HRDetailStyle.onboardingProcessLeft}>
                <div><DuringLegalSVG width="32" height="32" /></div>
                <h3 className={HRDetailStyle.titleLeft}>During Legal</h3>
            </div>

            <div className={HRDetailStyle.onboardingProcessMid}>
                <div className={HRDetailStyle.modalFormWrapper}>
                    <div className={HRDetailStyle.modalFormCol}>                
                        <label className={HRDetailStyle.timeLabel}>MSA Sign Date <span className={HRDetailStyle.reqFieldRed}>*</span></label>
                        <div className={`${HRDetailStyle.timeSlotItem} ${HRDetailStyle.marginBottom0}`}>
                            <Controller
                                render={({ ...props }) => (
                                    <DatePicker
                                    { ...props }
                                        // value={props.value ? moment(props.value): null}
                                        selected={watch('msaDate')}
                                        // placeholderText={props.value ? props.value :"Select Date 34"}
                                        onChange={(date) => {
                                            setValue('msaDate', date);
                                        }}
                                        // defaultPickerValue={props.value ? moment(props.value): null}
                                        // defaultValue={dayjs(watch('msaDate'), 'YYYY-MM-DD')}
                                        // dateFormat="yyyy/MM/dd"
                                        disabled={isTabDisabled}
                                    />
                                )}
                                name="msaDate"
                                rules={{ required: true }}
                                control={control}
                            />
                            <CalenderSVG />
                        </div>
                        {errors.msaDate && (
								<div className={HRDetailStyle.error}>
									* Please select Date.
								</div>
							)}
                    </div>

                 {!talentDeteils?.IsHRTypeDP && <div className={HRDetailStyle.modalFormCol}>
                        <label className={HRDetailStyle.timeLabel}>SOW Sign Date <span className={HRDetailStyle.reqFieldRed}>*</span></label>
                        <div className={`${HRDetailStyle.timeSlotItem} ${errors.sowDate && HRDetailStyle.marginBottom0}`}>
                            <Controller
                                render={({ ...props }) => (
                                    <DatePicker
                                        selected={watch('sowDate')}
                                        placeholderText="Select Date"
                                        // defaultValue={dayjs(watch('sowDate'), 'YYYY-MM-DD')}
                                        onChange={(date) => {
                                            setValue('sowDate', date);
                                        }}
                                        // dateFormat="yyyy/MM/dd"
                                        disabled={isTabDisabled}
                                    />
                                )}
                                name="sowDate"
                                rules={{ required: !talentDeteils?.IsHRTypeDP }}
                                control={control}
                            />
                            <CalenderSVG />
                        </div>
                        {errors.sowDate && (
								<div className={HRDetailStyle.error}>
									* Please select Date.
								</div>
							)}
                    </div>}   

                    <div className={HRDetailStyle.modalFormCol}>
                        {!getUploadFileData ?<HRInputField
                            // disabled={jdURLLink}
                            register={register}
                            leadingIcon={<UploadSVG onClick={()=>setUploadModal(true)} />}
                            label="SOW Document/Link"
                            name="sowDocumentLink"
                            type={InputType.TEXT}
                            // buttonLabel="Upload Document or Add Link"
                             placeholder="Upload Document or Add Link"
                            setValue={setValue}
                            // required={!jdURLLink && !getUploadFileData}
                            // onClickHandler={() => setUploadModal(true)}
                            validationSchema={{
                                required: 'please select a file.',
                            }}
                            errors={errors}
                        /> : (
                            <div className={HRDetailStyle.uploadedJDWrap}>
                                <label>SOW Document</label>
                                <div className={HRDetailStyle.uploadedJDName}>
                                    {getUploadFileData}{' '}
                                   { !isTabDisabled && <CloseSVG
                                        className={HRDetailStyle.uploadedJDClose}
                                        onClick={() => {
                                            setUploadFileData('');
                                        }}
                                    />}
                                </div>
                            </div>
                        )}
                        
                    </div>

                    {showUploadModal && (
								<UploadModal
									isGoogleDriveUpload={false}
									isLoading={isLoading}
									uploadFileHandler={uploadFileHandler}
									// googleDriveFileUploader={() => googleDriveFileUploader()}
									// uploadFileFromGoogleDriveLink={uploadFileFromGoogleDriveLink}
									modalTitle={'SOW Document'}
									modalSubtitle={' '}
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
            </>}
           

        </div>
    </div>

    <div className={HRDetailStyle.formPanelAction}>
        <button type="submit" className={HRDetailStyle.btnPrimary} 
        onClick={handleSubmit(submitClientLegal)}
        disabled={isTabDisabled ? isTabDisabled:isLoading}
        >Complete Client Legal</button>

<button type="submit" className={HRDetailStyle.btnPrimaryOutline} onClick={()=>setShowAMModal(false)} >Cancel</button>
    </div>
</div>
  )
}
