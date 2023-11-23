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
import UploadModal from 'shared/components/uploadModal/uploadModal';
import { ReactComponent as CloseSVG } from 'assets/svg/close.svg';
import { Divider } from 'antd';
import { ReactComponent as MinusSVG } from 'assets/svg/minus.svg';
import { ReactComponent as PlusSVG } from 'assets/svg/plus.svg';
import moment from 'moment';
const RenewEngagement = ({ engagementListHandler, talentInfo, closeModal }) => {
	const {
		register,
		handleSubmit,
		setValue,
		control,
		watch,
		resetField,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm();
	const watchBillRate = watch('billRate');
	const watchPayRate = watch('payRate');
	const [billRateValue, setBillRateValue] = useState(watchBillRate);
	const [payRateValue, setPayRateValue] = useState(watchPayRate);
	const [getRenewEngagement, setRenewEngagement] = useState(null);
	const [currencyValue,setCurrencyValue] = useState("")
	const [startDate,setStartDate] = useState();
	const [endDate,setEndDate] = useState();

	const getRenewEngagementHandler = useCallback(async () => {
		const response = await engagementRequestDAO.getRenewEngagementRequestDAO({
			onBoardId: talentInfo?.onboardID,
		});

		if (response?.statusCode === HTTPStatusCode.OK) {
			setRenewEngagement(response?.responseBody?.details);
			// console.log(response, '-response--');
			// response?.responseBody?.details?.contarctDuration > 0 &&
			// 	setValue(
			// 		'contractDuration',
			// 		response?.responseBody?.details?.contarctDuration,
			// 	);
			setValue(
				'renewedStartDate',
				new Date(response?.responseBody?.details?.contractEndDate),
			);
			// console.log(response?.responseBody?.details?.contractStartDate);
			setStartDate(new Date(response?.responseBody?.details?.contractEndDate).getMonth())
			setValue('billRate', response?.responseBody?.details?.billRate);
			setValue('payRate', response?.responseBody?.details?.payRate);
			setValue("nrMargin",response?.responseBody?.details?.nrPercentage)
			setBillRateValue(response?.responseBody?.details?.billRate);
			setPayRateValue(response?.responseBody?.details?.payRate);
			setCurrencyValue(response?.responseBody?.details?.currency)
			setValue(
				'addReason',
				response?.responseBody?.details?.reasonForBRPRChange,
			);
		}
	}, [setValue, talentInfo?.onboardID]);
	const submitContractRenewalHandler = useCallback(
		async (d) => {
			let contractRenewalDataFormatter = {
				onBoardId: talentInfo?.onboardID,
				contractStartDate: d.renewedStartDate,
				contractEndDate: d.renewedEndDate,
				billRate: billRateValue,
				payRate: payRateValue,
				engagementId: getRenewEngagement?.engagementId,
				contactName: getRenewEngagement?.contactName,
				company: getRenewEngagement?.company,
				talentName: getRenewEngagement?.talentName,
				nrPercentage: d.nrMargin,
				contarctDuration: d.contractDuration,
				reasonForBRPRChange: d.addReason,
			};
			let response = await engagementRequestDAO.saveRenewEngagementRequestDAO(
				contractRenewalDataFormatter,
			);
			if (response.statusCode === HTTPStatusCode.OK) {
				closeModal();
				engagementListHandler();
			}
		},
		[
			closeModal,
			engagementListHandler,
			getRenewEngagement?.company,
			getRenewEngagement?.contactName,
			getRenewEngagement?.engagementId,
			getRenewEngagement?.talentName,
			talentInfo?.onboardID,
			billRateValue,
			payRateValue
		],
	);
	useEffect(() => {
		getRenewEngagementHandler();
	}, [getRenewEngagementHandler]);

	useEffect(() => {
		if (closeModal) {
			resetField('lastWorkingDate');
			resetField('jdExport');

			resetField('endEngagementReason');
		}
	}, [closeModal, resetField]);

	let totalDuration = 0;
	useEffect(() => {
		const date1 = new Date(watch('renewedStartDate'));
		const date2 = new Date(watch('renewedEndDate'));
		const monthDiff = (date2.getFullYear() - date1.getFullYear()) * 12 + (date2.getMonth() - date1.getMonth());
		// totalDuration = endDate-startDate;
		// if(totalDuration>=0){
		// 	setValue("contractDuration",totalDuration);
		// }
		if(monthDiff>=0){
			setValue("contractDuration",monthDiff);
		}
	}, [watch('renewedStartDate'),watch('renewedEndDate')])


const calulateNR =async() =>{
	
	const calresponse = await engagementRequestDAO.calculateActualNRBRPRDAO(billRateValue,payRateValue,currencyValue)
	if(calresponse.statusCode === HTTPStatusCode.OK){
		setValue('nrMargin', calresponse?.responseBody?.details);
		clearErrors('billRate')
	}
	if(calresponse.statusCode === HTTPStatusCode.BAD_REQUEST){
		setError('billRate',{message:calresponse?.responseBody})
		resetField('nrMargin')
	}
	
}


useEffect(()=>{
	if(billRateValue && payRateValue && currencyValue  ){
		// if(billRateValue < payRateValue){
		// 	calulateNR()
		// 		setTimeout(()=>{
		// 		clearErrors('billRate')
		// 	},3000)
		// 	setError('billRate',{message:'bill rate must be greater then pay rate'})
		// 	return
		// }

		// if(payRateValue > billRateValue){
		// 	setTimeout(()=>{
		// 		clearErrors('payRate')
		// 	},3000)
		// 	setError('payRate',{message:'pay rate must be less then bill rate'})
		// 	return
		// }
		calulateNR()
		// else{
		// 	setTimeout(()=>{
		// 		clearErrors('billRate')
		// 	},3000)
		// 	setError('billRate',{message:'bill rate must be greater then pay rate'})
		// }
		
	}	
},[billRateValue,payRateValue,currencyValue])

	return (
		<div className={allengagementEnd.engagementModalWrap}>
			<div
				className={`${allengagementEnd.headingContainer} ${allengagementEnd.addFeebackContainer}`}>
				<h1>Contract Renewal</h1>
				<ul>
					<li>
						<span>{getRenewEngagement?.talentName}</span>
						{/* {talentInfo?.hrNumber} */}
					</li>
					<li className={allengagementEnd.divider}>|</li>
					<li>
						<span>{getRenewEngagement?.engagementId}</span>
						{/* {talentInfo?.engagementID} */}
					</li>
				</ul>
			</div>

			<h2 className={allengagementEnd.contractTitle}>Contract Details</h2>
			<div className={allengagementEnd.row}>
				<div className={allengagementEnd.colMd6}>
					<div
						className={`${allengagementEnd.timeSlotItemField} ${allengagementEnd.mb32}`}>
						<div className={allengagementEnd.timeLabel}>
							Renewed Start Date
							<span>
								<b style={{ color: 'black' }}>*</b>
							</span>
						</div>
						<div className={allengagementEnd.timeSlotItem}>
							<CalenderSVG />
							<Controller
								render={({ ...props }) => (
									<DatePicker
										selected={watch('renewedStartDate')}
										onChange={(date) => {
											setValue('renewedStartDate', date);
											setStartDate(date.getMonth())
										}}
										placeholderText="Renewed Start Date"
										dateFormat="dd/MM/yyyy"
										minDate={new Date(getRenewEngagement?.contractEndDate)}
									/>
								)}
								name="renewedStartDate"
								rules={{ required: true }}
								control={control}
							/>
							{errors.renewedStartDate && (
								<div className={allengagementEnd.error}>
									* Please select renewed start date.
								</div>
							)}
						</div>
					</div>
				</div>
				<div className={allengagementEnd.colMd6}>
					<div
						className={`${allengagementEnd.timeSlotItemField} ${allengagementEnd.mb32}`}>
						<div className={allengagementEnd.timeLabel}>
							Renewed End Date
							<span>
								<b style={{ color: 'black' }}>*</b>
							</span>
						</div>
						<div className={allengagementEnd.timeSlotItem}>
							<CalenderSVG />
							<Controller
								render={({ ...props }) => (
									<DatePicker
										selected={watch('renewedEndDate')}
										onChange={(date) => {
											setValue('renewedEndDate', date);
											setEndDate(date.getMonth())
										}}
										placeholderText="Renewed End Date"
										dateFormat="dd/MM/yyyy"
										minDate={watch('renewedStartDate')}
									/>
								)}
								name="renewedEndDate"
								rules={{ required: true }}
								control={control}
							/>
							{errors.renewedEndDate && (
								<div className={allengagementEnd.error}>
									* Please select renewed end date.
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			<div className={allengagementEnd.row}>
				<div className={allengagementEnd.colMd6}>
					<HRInputField
						register={register}
						label="Contract Duration (Months)"
						name="contractDuration"
						type={InputType.NUMBER}
						placeholder="Enter contract duration"
						errors={errors}
						disabled={true}
						validationSchema={{
							required: 'please enter the contract duration.',
							min: {
								value: 1,
								message: `please don't enter the value less than 1`,
							},
						}}
						required
					/>
				</div>
			</div>

			<h2 className={allengagementEnd.contractBorderTitle}>Amount Details</h2>
			<div className={allengagementEnd.row}>
				<div
					className={`${allengagementEnd.colMd6} ${allengagementEnd.rateCounterField}`}>
					<button
						className={allengagementEnd.minusButton}
						onClick={(e) =>
							{ if(billRateValue - 1 > payRateValue){
								billRateValue - 1 > 1 
								? setBillRateValue(parseFloat((billRateValue - 1).toFixed(2)))
								: e.preventDefault()
							}else{
								setTimeout(()=>{
									clearErrors('billRate')
								},3000)
								setError('billRate',{message:'bill rate must be greater then pay rate'})
							}
							}
						}
						disabled={billRateValue === 1 ? true : false}>
						<MinusSVG />
					</button>
					<HRInputField
						register={register}
						errors={errors}
						validationSchema={{
							required: 'Please enter bill rate.',
							valueAsNumber: true,
						}}
						label={`Bill Rate(${currencyValue})`}
						onChangeHandler={e=> {
							setBillRateValue(parseFloat(e.target.value))
							// let value = e.target.value
							// if(value > 0 && value < payRateValue){
							// setBillRateValue(parseFloat(e.target.value))
							// }else{
							// 	setTimeout(()=>{
							// 		clearErrors('billRate')
							// 	},3000)
							// 	setError('billRate',{message:'bill rate can not less then 0 and pay rate'})
							// }
						}
						}
						name="billRate"
						disabled={false}
						type={InputType.NUMBER}
						value={billRateValue}
						placeholder="Enter Amount"
						required
					/>
					<button
						className={allengagementEnd.plusButton}
						onClick={()=>{
							let newVal = billRateValue + 1
							setBillRateValue(parseFloat(newVal.toFixed(2)))}}>
						<PlusSVG />
					</button>
				</div>
				<div
					className={`${allengagementEnd.colMd6} ${allengagementEnd.rateCounterField}`}>
					<button
						className={allengagementEnd.minusButton}
						onClick={(e) =>{
							payRateValue - 1 > 0
								? setPayRateValue(parseFloat((payRateValue - 1).toFixed(2)))
								: e.preventDefault()}
						}
						disabled={payRateValue - 1 < 0 ? true : false}>
						<MinusSVG />
					</button>
					<HRInputField
						register={register}
						errors={errors}
						// isError={errors['payRate']}
						// errorMsg={errors['payRate']?.message ? errors['payRate'].message : 'Please enter pay rate.'}
						validationSchema={{
							required: 'Please enter pay rate.',
							valueAsNumber: true,
						}}
						onChangeHandler={e=> { 
							setPayRateValue(parseFloat(e.target.value))
							// let value = e.target.value
							// if(value > 0 && payRateValue < billRateValue ){
							// 	setPayRateValue(parseFloat(e.target.value))
							// }else{
							// 	setTimeout(()=>{
							// 		clearErrors('payRate')
							// 	},3000)
							// 	setError('payRate',{message:'pay rate can not less then 0 and grater then bill rate'})
							// 	}
							}
							}
						label={`Pay Rate(${currencyValue})`}
						name="payRate"
						type={InputType.NUMBER}
						value={payRateValue}
						placeholder="Enter Amount"
						required
					/>
					<button
						className={allengagementEnd.plusButton}
						onClick={(e) => {
							let newVal = payRateValue + 1
							if(newVal < billRateValue){
								setPayRateValue(parseFloat(newVal.toFixed(2)))
							}else{
								setTimeout(()=>{
									clearErrors('payRate')
								},3000)
								setError('payRate',{message:'pay rate can not grater then bill rate'})
								
							}
							// newVal < billRateValue ? setPayRateValue(parseFloat(newVal.toFixed(2))) : e.preventDefault()
							}}>
						<PlusSVG />
					</button>
				</div>
			</div>
			<div className={allengagementEnd.row}>
				<div className={allengagementEnd.colMd6}>
					<HRInputField
						register={register}
						label="NR%"
						name="nrMargin"
						type={InputType.NUMBER}
						placeholder="Enter NR%"
						errors={errors}
						validationSchema={{
							required: 'please enter the NR%.',
						}}
						required
						disabled={true}
					/>
				</div>
				<div className={allengagementEnd.colMd6}>
					<HRInputField
						register={register}
						label="Reason For BR/PR Change"
						name="addReason"
						type={InputType.TEXT}
						placeholder="Add Reason"
						errors={errors}
						validationSchema={{
							required: 'please enter the reason for change.',
						}}
						required
					/>
				</div>
			</div>

			<div className={allengagementEnd.formPanelAction}>
				<button
					type="submit"
					onClick={handleSubmit(submitContractRenewalHandler)}
					className={allengagementEnd.btnPrimary}>
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

export default RenewEngagement;
