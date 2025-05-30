import { InputType } from 'constants/application';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { ReactComponent as UploadSVG } from 'assets/svg/upload.svg';
import allengagementEnd from '../engagementBillAndPayRate/engagementBillRate.module.css';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import 'react-datepicker/dist/react-datepicker.css';
import { engagementRequestDAO } from 'core/engagement/engagementDAO';
import { HTTPStatusCode } from 'constants/network';
import HRSelectField from "modules/hiring request/components/hrSelectField/hrSelectField";
import UploadModal from 'shared/components/uploadModal/uploadModal';
import { ReactComponent as CloseSVG } from 'assets/svg/close.svg';
import moment from 'moment/moment';
import { Checkbox, Skeleton, Radio } from 'antd';

const EngagementCancel = ({ engagementListHandler, talentInfo, closeModal }) => {
	const {
		register,
		handleSubmit,
		setValue,
		control,
		watch,
		resetField,
		clearErrors,
		unregister,
		formState: { errors },
	} = useForm();
	const [getEndEngagementDetails, setEndEngagementDetails] = useState(null);
	const [getUploadFileData, setUploadFileData] = useState('');
	const [showUploadModal, setUploadModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmit,setIsSubmit] = useState(false)
	const [getValidation, setValidation] = useState({
		systemFileUpload: '',
		googleDriveFileUpload: '',
		linkValidation: '',
	});
	const [base64File, setBase64File] = useState('');
	const [addLatter,setAddLetter] = useState(false)
	const [engagementReplacement,setEngagementReplacement] = useState({
		replacementData : false
	})
	const [closureDate,setClosureDate] = useState('')
	const [engType,setEngType] = useState('Backout')
	const [reasonList,setReasonList] = useState([])


	const getEndEngagementHandler = useCallback(async () => {
		setIsSubmit(true)
		const response = await engagementRequestDAO.getContentEndEngagementRequestDAO({
				onboardID: talentInfo?.onboardID ?  talentInfo?.onboardID : talentInfo?.OnBoardId ,
			});
		const res =	await engagementRequestDAO.getContentCancelEngagementRequestDAO({
				onboardID: talentInfo?.onboardID ?  talentInfo?.onboardID : talentInfo?.OnBoardId ,
			});
		setIsSubmit(false)
		if (response?.statusCode === HTTPStatusCode.OK) {
			setEndEngagementDetails(response?.responseBody?.details)
			if(response?.responseBody?.details?.contractEndDate){
				let dateString = response?.responseBody?.details?.contractEndDate
			let convertedDate = moment(dateString, 'DD/MM/YYYY')

			const formattedDate = convertedDate?.format('YYYY-MM-DDTHH:mm:ss');
			setValue("lastWorkingDate", new Date(formattedDate));
			setValue("newContractStartDate", new Date(formattedDate));
			}	
			/* let updatedDate = new Date(
				new Date(
					response?.responseBody?.details?.contractEndDate,
				).toLocaleDateString('en-US'),
			);

			console.log(updatedDate, '-updatedDate');
			setValue('lastWorkingDate', updatedDate); */
		}
		
		if(res.statusCode === HTTPStatusCode.OK){
			setClosureDate(res?.responseBody?.details?.closureDate)
			setReasonList([...res?.responseBody?.details?.onBoardingLostReasons,{	
				disabled: false,
				group: null,
				selected: false,
				text: "Other",
				value: '0'
			}])
		}	
	}, [talentInfo?.onboardID]);

	const submitEndEngagementHandler = useCallback(
		async (d) => {
			setIsSubmit(true)
			let formattedData =
			{
				"contractDetailID": getEndEngagementDetails?.contractDetailID,
				"LastWorkingDate": d.lastWorkingDate ? moment(d.lastWorkingDate).format("yyyy-MM-DD") : null,
				"reason": d.endEngagementReason ?? "",
				"EngcancelType": engType,
				"LostReasonID": d.lostReason?.id ? d.lostReason?.id === '0' ? null : +d.lostReason.id : null
			}
	

			const response =
				await engagementRequestDAO.cancelEngagementRequestDAO(
					formattedData,
				);
			if (response?.statusCode === HTTPStatusCode.OK) {
				closeModal();
				engagementListHandler();
				setIsSubmit(false)
			}
			setIsSubmit(false)
		},
		[
			base64File,
			closeModal,
			engagementListHandler,
			getEndEngagementDetails?.contractDetailID,
			getUploadFileData,
			talentInfo,
			engagementReplacement?.replacementData,
			addLatter,
			engType
		],
	);

	useEffect(() => {
		getEndEngagementHandler();
	}, [getEndEngagementHandler]);

	useEffect(() => {
		if (closeModal) {
			resetField('lastWorkingDate');
			resetField('jdExport');
			setUploadFileData(null);
			resetField('endEngagementReason');
		}
	}, [closeModal, resetField]);

	let watchExpectedCTC  = watch('expectedCTC')
    let watchDPpercentage = watch('dpPercentage')

    // watch values and change DP amount
    useEffect(() => { 
        let DPAMOUNT =  ((watchExpectedCTC *  12) * watchDPpercentage) / 100 
        setValue('dpAmount', DPAMOUNT.toFixed(2))
    },[watchExpectedCTC,watchDPpercentage, setValue])


	return (
		<div className={allengagementEnd.engagementModalWrap}>
			<div
				className={`${allengagementEnd.headingContainer} ${allengagementEnd.addFeebackContainer}`}>
				<h1>Cancel Engagement</h1>
				<ul className={allengagementEnd.engModalHeadList}>
					<li>
						<span>HR ID:</span>
						{talentInfo?.hrNumber ? talentInfo?.HR_Number : talentInfo?.hR_Number}
					</li>
					<li className={allengagementEnd.divider}>|</li>
					<li>
						<span>Engagement ID:</span>
						{talentInfo?.engagementID || talentInfo?.EngagemenID || talentInfo?.engagemenID.split('/')[0]}
					</li>
					{closureDate && <>
						<li className={allengagementEnd.divider}>|</li>
						<li>
						<span>Closure Date:</span>
						{closureDate}
					</li>
					</>}
					<li className={allengagementEnd.divider}>|</li>
					<li>
						<span>Talent Name:</span>
						{talentInfo?.talentName || talentInfo?.Name || talentInfo?.talent}
					</li>
					<li className={allengagementEnd.divider}>|</li>
					<li>
						<span>Uplers Fees :</span>
						{getEndEngagementDetails?.dpnrPercentage} %
					</li>
				</ul>
			</div>

			{isSubmit ? <Skeleton /> : <>
				<div className={`${allengagementEnd.row} ${allengagementEnd.mb16}`}>
					<div className={allengagementEnd.colMd12} style={{marginBottom:'10px'}}>
					<Radio.Group
                  onChange={e=> {setEngType(e.target.value);
					resetField('endEngagementReason')
					clearErrors('endEngagementReason')
					resetField('lostReason')
					clearErrors('lostReason')
					unregister('lostReason')
				  }}
                  value={engType}
                  >
                  <Radio value={'Backout'}>Backout</Radio>
                  <Radio value={'Other'}>Other</Radio>
                </Radio.Group>
				</div>

				{engType === 'Backout' && <>
				

				<div className={allengagementEnd.row} style={{width:'100%'}}>
					<div className={allengagementEnd.colMd6} style={{marginBottom:'10px'}} >
					<div className={allengagementEnd.timeSlotItemField}>
						<div className={allengagementEnd.timeLabel}>
							Last Working Day
							<span>
								<b style={{ color: 'red' }}> *</b>
							</span>
						</div>
						<div className={allengagementEnd.timeSlotItem}>
							<CalenderSVG />
							<Controller
								render={({ ...props }) => (
									<DatePicker
										selected={watch('lastWorkingDate')}
										onChange={(date) => {
											setValue('lastWorkingDate', date);
											setValue("lwd",date)
										}}
										placeholderText="Last working Date"
										dateFormat="dd/MM/yyyy"
									/>
								)}
								name="lastWorkingDate"
								rules={{ required: true }}
								control={control}
							/>
							{errors.lastWorkingDate && (
								<div className={allengagementEnd.error}>
									* Please select last working date.
								</div>
							)}
						</div>
					</div>
				
				</div>
				<div className={allengagementEnd.colMd12} >
				<HRSelectField
				  compStyles={{marginBottom:'10px'}}
                  setValue={setValue}
                  mode={"id/value"}
				  onValueChange={()=>{
					resetField('endEngagementReason')
					clearErrors('endEngagementReason')
				  }}
                  register={register}
                  name="lostReason"
                  label="Backout Reason"
                  defaultValue="Select Reason"
                  options={reasonList ? reasonList.map(item=> ({id: item.value, value:item.text})) : []}
                  required={engType === 'Backout'}
                  isError={
                    errors["lostReason"] && errors["lostReason"]
                  }
                  errorMsg="Please select reason."
                />
				</div>
				
				{watch('lostReason')?.id === '0' && <div className={allengagementEnd.colMd12} style={{marginBottom:'10px'}}>
					<HRInputField
						required
						isTextArea={true}
						rows={4}
						errors={errors}
						validationSchema={{
							required: 'Please enter the reason for Closing Engagement.',
						}}
						label={'Other Reason'}
						register={register}
						name="endEngagementReason"
						type={InputType.TEXT}
						placeholder="Enter Reason"
					/>
				</div>}
				
				</div>
				</> }

				{engType === 'Other' &&  <>
				{!closureDate && <div className={allengagementEnd.colMd6} style={{marginBottom:'10px'}}>
					<div className={allengagementEnd.timeSlotItemField}>
						<div className={allengagementEnd.timeLabel}>
							Last Working Day
							<span>
								<b style={{ color: 'red' }}> *</b>
							</span>
						</div>
						<div className={allengagementEnd.timeSlotItem}>
							<CalenderSVG />
							<Controller
								render={({ ...props }) => (
									<DatePicker
										selected={watch('lastWorkingDate')}
										onChange={(date) => {
											setValue('lastWorkingDate', date);
											setValue("lwd",date)
										}}
										placeholderText="Last working Date"
										dateFormat="dd/MM/yyyy"
									/>
								)}
								name="lastWorkingDate"
								rules={{ required: true }}
								control={control}
							/>
							{errors.lastWorkingDate && (
								<div className={allengagementEnd.error}>
									* Please select last working date.
								</div>
							)}
						</div>
					</div>
				</div>	}
				
				
					<div className={allengagementEnd.colMd12} style={{marginBottom:'10px'}}>
					<HRInputField
						required
						isTextArea={true}
						rows={4}
						errors={errors}
						validationSchema={{
							required: 'Please enter the reason for Closing Engagement.',
						}}
						label={'Reason for Closing Engagement'}
						register={register}
						name="endEngagementReason"
						type={InputType.TEXT}
						placeholder="Enter Reason"
					/>
				</div>
				</>}
					
							
			</div>


		
		
			</>}
			<div className={allengagementEnd.formPanelAction}>
				<button
					type="submit"
					onClick={handleSubmit(submitEndEngagementHandler)}
					className={allengagementEnd.btnPrimary}
					disabled={isSubmit}
					>
					Save
				</button>
				<button
					className={allengagementEnd.btn}
					onClick={closeModal}>
					Cancel
				</button>
			</div>
		</div>
	);
};

export default EngagementCancel;
