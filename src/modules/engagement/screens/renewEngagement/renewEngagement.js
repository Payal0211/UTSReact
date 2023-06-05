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
const RenewEngagement = ({ engagementListHandler, talentInfo, closeModal }) => {
	const {
		register,
		handleSubmit,
		setValue,
		control,
		watch,
		resetField,
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
			console.log(response, '-response--');
			// response?.responseBody?.details?.contarctDuration > 0 &&
			// 	setValue(
			// 		'contractDuration',
			// 		response?.responseBody?.details?.contarctDuration,
			// 	);
			setValue(
				'renewedStartDate',
				new Date(response?.responseBody?.details?.contractStartDate),
			);
			console.log(response?.responseBody?.details?.contractStartDate);
			setStartDate(new Date(response?.responseBody?.details?.contractStartDate).getMonth())
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
				billRate: d.billRate,
				payRate: d.payRate,
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
		totalDuration = endDate-startDate;
		if(totalDuration>=0){
			setValue("contractDuration",totalDuration);
		}
	}, [endDate,startDate])


const calulateNR =async() =>{
	
	const calresponse = await engagementRequestDAO.calculateActualNRBRPRDAO(billRateValue,payRateValue,currencyValue)
	setValue('nrMargin', calresponse?.responseBody?.details);
}


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
						placeholder="Enter contract duration                                                                                   "
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
							{billRateValue > 0
								? setBillRateValue(billRateValue - 1)
								: e.preventDefault();calulateNR()}
						}
						disabled={billRateValue === 0 ? true : false}>
						<MinusSVG />
					</button>
					<HRInputField
						register={register}
						errors={errors}
						validationSchema={{
							required: 'Please enter bill rate.',
							valueAsNumber: true,
						}}
						label="Bill Rate(USD)"
						name="billRate"
						type={InputType.NUMBER}
						value={billRateValue}
						placeholder="Enter Amount"
						required
					/>
					<button
						className={allengagementEnd.plusButton}
						onClick={()=>{setBillRateValue(billRateValue + 1); calulateNR();}}>
						<PlusSVG />
					</button>
				</div>
				<div
					className={`${allengagementEnd.colMd6} ${allengagementEnd.rateCounterField}`}>
					<button
						className={allengagementEnd.minusButton}
						onClick={(e) =>{
							payRateValue > 0
								? setPayRateValue(payRateValue - 1)
								: e.preventDefault(); calulateNR();}
						}
						disabled={payRateValue === 0 ? true : false}>
						<MinusSVG />
					</button>
					<HRInputField
						register={register}
						errors={errors}
						validationSchema={{
							required: 'Please enter pay rate.',
							valueAsNumber: true,
						}}
						label="Pay Rate(USD)"
						name="payRate"
						type={InputType.NUMBER}
						value={payRateValue}
						placeholder="Enter Amount"
						required
					/>
					<button
						className={allengagementEnd.plusButton}
						onClick={() => {setPayRateValue(payRateValue + 1);calulateNR();}}>
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
						placeholder="Enter NR%                                                                                                "
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
