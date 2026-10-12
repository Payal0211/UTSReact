import TalentStatusStyle from './talentStatus.module.css';
import { useCallback, useEffect, useState } from 'react';
import { message, Radio } from 'antd';

import { useForm } from 'react-hook-form';

import HRSelectField from '../hrSelectField/hrSelectField';
import { TalentStatusDAO } from 'core/talent/talentDAO';
import HRInputField from '../hrInputFields/hrInputFields';
import { InputType } from 'constants/application';
import { _isNull } from 'shared/utils/basic_utils';
import { HTTPStatusCode } from 'constants/network';
import SpinLoader from 'shared/components/spinLoader/spinLoader';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { InterviewDAO } from 'core/interview/interviewDAO';
import LockIcon from 'assets/svg/smallLockIcon.svg'


const UpdateRejectReason = ({ talentInfo, hrId, callAPI, getHrUserData,closeModal,apiData,ActionKey,updatingNORejection}) => {
	const {
		register,
		handleSubmit,
		setValue,
		control,
		setError,
		getValues,
		unregister,
		clearErrors,
		resetField,
		watch,
		formState: { errors },
	} = useForm({});
	const [isLoading, setIsLoading] = useState(false);
	const watchTalentStatus = watch('talentStatus');
	const watchCancelReason = watch('cancelReason');
	const watchRejectReason = watch('rejectReason');
	const watchOnHoldReason = watch('onHoldReason');
	const [talentStatus, setTalentStatus] = useState([]);
	
	const [radioValue, setRadioValue] = useState('Before Interview');
	const [isRejectReason, setIsRejectReason] = useState(1);
	const [controllCreditBaseTalentStatus, setControllCreditBaseTalentStatus] =
    useState("Select Talent Status");
	const [controllCreditBaseRejectReason, setControllCreditBaseRejectReason] =
    useState("Select Reject Reason");
	const [controllCreditBaseRejectParentReason, setControllCreditBaseRejectParentReason] =
    useState("Select Reject Reason");
	const getTalentStatusHandler = useCallback(async () => {
        setIsLoading(true);
		const response = await TalentStatusDAO.getStatusDetailRequestDAO({
			talentID: talentInfo?.TalentID,
			hrID: hrId,
			talentStatusID: 2,
			talentStatus:'Profile Shared',
		});
setIsLoading(false);
		setTalentStatus(response && response?.responseBody?.details);
	}, [
		hrId,
		talentInfo?.Status,
		talentInfo?.TalentID,
		talentInfo?.TalentStatusID_BasedOnHR,
	]);



	useEffect(() => {
		if(talentStatus?.Data?.TalentStatusAfterClientSelections){
			const creditStatus =talentStatus?.Data?.TalentStatusAfterClientSelections?.filter(
				(item) => item?.id === 7
			)
			setValue("talentStatus",creditStatus[0])
			setControllCreditBaseTalentStatus(creditStatus[0]?.value)
		}
	}, [talentStatus?.Data?.TalentStatusAfterClientSelections])




	const talentStatusSubmitHanlder = useCallback(
		async (d) => {			
			
				setIsLoading(true);
				let talentStatusObject = {
					hrid: hrId,
					hrDetailID: talentInfo?.HiringDetailID,
					talentID: talentInfo?.TalentID,
					talentStatusID: d.talentStatus?.id,
					talentStatus: d.talentStatus?.value,
					rejectReasonID: _isNull(d.rejectReason?.id) ? 0 : d.rejectReason?.id,
					onHoldReasonID: _isNull(d.onHoldReason?.id) ? 0 : d.onHoldReason?.id,
					cancelReasonID: _isNull(d.cancelReason?.id) ? 0 : d.cancelReason?.id,
					otherReason: d?.OtherRejectReason ? d?.OtherRejectReason : null,
					remark: null,
					ContactTalentPriorityID: talentStatus?.Data?.ContactTalentPriorityID,
					IsRejectReason:isRejectReason === 1 ? true : false
				};

		
				let response= await TalentStatusDAO.updateTalentStatusRequestDAO(
						talentStatusObject,
					);

				setIsLoading(false);
				/* if (response?.statusCode === HTTPStatusCode.OK) {
					callAPI(hrId);
				} */
				if (response.statusCode === 200) {
					
					callAPI(hrId);
					getHrUserData(hrId)
				}else{
                    message.error('Something Went Wrong!')
                }
			

			// Call the code of notes for reject talent
			if(d?.talentStatus?.id === 7 || d?.statusId?.id === 8){				
				
				let note = d?.rejectReasonParentID?.value + " - " + `${d?.rejectReasonID ? d?.rejectReasonID?.value : d.rejectReason?.value}` + ` - ${d.onHoldRemark || d.lossRemark}`;
				await saveTalentNotesWhenRejected(note);
			}
		},
		[callAPI, getHrUserData,hrId, talentInfo?.HiringDetailID, talentInfo?.TalentID,talentStatus,apiData?.IsPayPerCredit,apiData?.IsPayPerHire,isRejectReason],
	);

	const saveTalentNotesWhenRejected = async(notes) => {
		let payload = {
            "CompanyId":apiData?.ClientDetail?.CompanyId,
            "ContactId":apiData?.ClientDetail?.ContactId,
            "ContactName" : apiData?.ClientDetail?.ClientName,
            "ContactEmail" : apiData?.ClientDetail?.ClientEmail,
            "HiringRequest_ID": apiData?.HR_Id,
            "ATS_TalentID": talentInfo?.ATSTalentID,
            "Notes": notes,           
            "EmployeeID": localStorage.getItem('EmployeeID'),
            "EmployeeName": localStorage.getItem('FullName')
    	}

		let result = await hiringRequestDAO.saveTalentNotesDAO(payload);
	}

	useEffect(() => {	
			getTalentStatusHandler();
	}, [getTalentStatusHandler]);

	useEffect(() => {
		if (watchTalentStatus?.id !== 5) unregister('cancelReason');
		if (watchTalentStatus?.id !== 7) unregister('rejectReason');
		if (watchTalentStatus?.id !== 6) unregister('onHoldReason');
		if (watchTalentStatus?.id !== 5 && watchCancelReason?.id !== -1) {
			unregister(['otherReason']);
		}
		if (watchTalentStatus?.id !== 7 && watchRejectReason?.id !== -1) {
			unregister(['otherReason']);
		}
		if (watchTalentStatus?.id !== 6 && watchOnHoldReason?.id !== -1) {
			unregister(['otherReason']);
		}
	}, [
		unregister,
		watchCancelReason,
		watchOnHoldReason?.id,
		watchRejectReason?.id,
		watchTalentStatus?.id,
	]);

	const getParentRejectedReasons = (reasons)=> {
		let reasonList = []
		let reasonListArray = []

		reasons?.forEach(reason=> {
			if(!reasonList.includes(reason.parentName)){
				reasonList.push(reason.parentName);
				reasonListArray.push({ id:reason.parentId , value:reason.parentName })
			}
		})

		return reasonListArray
	}

	const getRejectedReasons = (reasons)=> {
		let reasonsList = reasons?.filter(reason=> reason.parentId === watch('rejectReasonParentID')?.id)?.map(item=> ({id:item.id,value:item.reason}))
		return reasonsList
	}

	return (
		<div className={TalentStatusStyle.container}>
			<div className={TalentStatusStyle.modalTitle}>
				<h2>Update Rejection Reason</h2>
			</div>

			{isLoading ? (
				<SpinLoader />
			) : (
				<div className={TalentStatusStyle.transparent}>

				
				
						<div className={TalentStatusStyle.colMd12}>
							<HRSelectField
								controlledValue={controllCreditBaseTalentStatus}
								setControlledValue={val=>{setControllCreditBaseTalentStatus(val)}}
							 	isControlled={true}
								mode={'id/value'}
								setValue={setValue}
								register={register}
								name="talentStatus"
								label="Select Talent Status"
								defaultValue="Please Select"
								options={talentStatus?.Data?.TalentStatusAfterClientSelections}
								disabled={true}
								required
								isError={errors['statusId'] && errors['statusId']}
								errorMsg="Please select talent Status."
							/>
						</div>

                        	{watch('talentStatus')?.id === 7 && (
						<>
						{/* <div className={TalentStatusStyle.colMd12} style={{display:'flex',flexDirection:'column', marginBottom:'15px'}}>
						<p className={TalentStatusStyle.formLabel} >Rejection Reason</p>

						<Radio.Group
										className={TalentStatusStyle.radioGroup}
										onChange={e=> {
											resetField('rejectReasonParentID')
											resetField('rejectReason')
											resetField('OtherRejectReason')
											clearErrors(['OtherRejectReason','rejectReason','rejectReasonParentID'])
											unregister(['OtherRejectReason','rejectReason','rejectReasonParentID'])
											setIsRejectReason(e.target.value)}}
										value={isRejectReason}>
										<Radio value={1}>
										Yes
										</Radio>
										<Radio value={0}>
										No
										</Radio>
									</Radio.Group>
					</div> */}

					{ 	<div className={TalentStatusStyle.colMd12}>
							<HRSelectField
								// controlledValue={controllCreditBaseRejectReason}
								// setControlledValue={setControllCreditBaseRejectReason}
							 	// isControlled={true}
								mode={'id/value'}
								setValue={setValue}
								register={register}
								name="rejectReasonParentID"
								label="Reason"
								defaultValue="Please Select"
								options={getParentRejectedReasons(talentStatus?.Data?.TalentRejectReason?.filter(i=> (i.talentStatusId === 5 || i.talentStatusId === null)))}
								required={isRejectReason === 1}
								isError={(errors['rejectReasonParentID'] && isRejectReason === 1) && errors['rejectReasonParentID']}
								errorMsg="Please select Reject Reason."
								onValueChange={()=>{
									resetField("rejectReason")
									setControllCreditBaseRejectReason("Select Reject Reason")
									clearErrors('rejectReasonParentID')
								}}
							/>
							<div className={TalentStatusStyle.rejectCandNote}>
									<img 
									src={LockIcon} 
									alt="lock-icon" />
									This rejection reason wont be shared with the candidate.
								</div>
							</div>}
					
							{watch('rejectReasonParentID')?.id && <div className={TalentStatusStyle.colMd12}>
								<HRSelectField
									controlledValue={controllCreditBaseRejectReason}
									setControlledValue={setControllCreditBaseRejectReason}
									isControlled={true}
									mode={'id/value'}
									setValue={setValue}
									register={register}
									name="rejectReason"
									label="Detailed Rejection Sub Category"
									defaultValue="Please Select"
									options={getRejectedReasons(talentStatus?.Data?.TalentRejectReason)}
									required={isRejectReason === 1}
									isError={(errors['rejectReason'] && isRejectReason === 1) && errors['rejectReason']}
									errorMsg="Please select Category."
									onValueChange={async (e,val)=>{
										// setIsLoading(true);         
										let res = await hiringRequestDAO.getRejectionReasonForTalentDAO({
											hrId:hrId,
											rejectionId:val?.id,
											atsTalentId:talentInfo?.ATSTalentID
										});
										const tempDiv = document.createElement('div');
										tempDiv.innerHTML = res?.responseBody?.details?.rejectionMessageForTalent;
										const textContent = tempDiv.textContent || tempDiv.innerText || ''; 
										setValue("OtherRejectReason",textContent)
										// setIsLoading(false); 
										clearErrors('rejectReason')
									}}
								/>
								<div className={TalentStatusStyle.rejectCandNote}>
									<img 
									src={LockIcon} 
									alt="lock-icon" />
									This rejection reason wont be shared with the candidate.
								</div>
							</div>}

							{watch('rejectReason')?.id && <div className={TalentStatusStyle.colMd12}>
								<HRInputField
									isTextArea={true}
									register={register}
									errors={errors}
									label={'Rejection message for the candidate'}
									required={isRejectReason === 1}
									name="OtherRejectReason"
									type={InputType.TEXT}
									placeholder="please enter rejection message"	
									validationSchema={{
										required: isRejectReason === 1 ? 'please enter rejection message.' : false,
									}}								
								/>
								<div style={{marginTop: '10px'}} className={TalentStatusStyle.rejectCandNote}>
									<img 
									src={LockIcon} 
									alt="lock-icon" />
									This message is derived from the above input and will be shared with the candidate
								</div>
							</div>}
							
					
						</>
						)}
					
					
					

					
					<div className={TalentStatusStyle.formPanelAction}>
						<button
							type="submit"
							onClick={handleSubmit(talentStatusSubmitHanlder)}
							className={TalentStatusStyle.btnPrimary}>
							Save
						</button>
						<button
							onClick={closeModal}
							className={TalentStatusStyle.btn}>
							Cancel
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default UpdateRejectReason;