import { InputType } from 'constants/application';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import allengagementBillAndPayRateStyles from './engagementBillRate.module.css';
import { Skeleton, Tabs } from 'antd';
import { ReactComponent as MinusSVG } from 'assets/svg/minus.svg';
import { ReactComponent as PlusSVG } from 'assets/svg/plus.svg';
import { engagementRequestDAO } from 'core/engagement/engagementDAO';
import { MasterDAO } from 'core/master/masterDAO';
import { HTTPStatusCode } from 'constants/network';
import { _isNull } from 'shared/utils/basic_utils';

const EngagementBillRateAndPayRate = ({
	month,
	year,
	getBillRate,
	getPayRate,
	setPayRate,
	setBillRate,
	engagementBillAndPayRateTab,
	setEngagementBillAndPayRateTab,
	engagementListHandler,
	talentInfo,
	closeModal,
	rateReason,
	setRateReason,
	activeTab
}) => {
	const { TabPane } = Tabs;

	const {
		register,
		handleSubmit,
		setValue,
		control,
		setError,
		getValues,
		watch,
		reset,
		resetField,
		formState: { errors },
	} = useForm();

	const watchBillRate = watch('billRate');
	const watchPayRate = watch('payRate');
	const watchFinalBillRate = watch('finalBillRate');
	const watchFinalPayRate = watch('finalPayRate');
	const watchNRRate = watch('billNRRate');

	const [billRateValue, setBillRateValue] = useState(watchBillRate);
	const [payRateValue, setPayRateValue] = useState(watchPayRate);
	const [reasons, setReasons] = useState([])
	const [controlledBillRateReason,setControlledBillRateReason] = useState('');
	const [controlledPayRateReason, setControlledPayRateReason] = useState('');
	

	//  const ManageRateReason = (value) => {
	// 	setRateReason(value);
	// 	setValue('billRateReason', value)
	// 	setValue('payRateReason', value)
	//  }

	 
	 useEffect(()=>{
		if(rateReason){
			setValue('payRateReason', rateReason)
			setValue('billRateReason', rateReason)
		}
	 },[rateReason, setValue])

	function callback(key) {
		setEngagementBillAndPayRateTab(key);
	}

	const [currency, setCurrency] = useState([]);
	const [currencyValue,setCurrencyValue] = useState("");
	const [levelBillEdit, setBillEdit] = useState('Select');
	const [isLoading, setIsLoading] = useState(false)

	const currencyHandler = useCallback(async () => {
		const response = await MasterDAO.getCurrencyRequestDAO();
		setCurrency(response && response?.responseBody);
	}, []);

	const editBillRatePayRateHandler = useCallback(async () => {
		const editBPRateResponse =
			await engagementRequestDAO.editBillRatePayRateRequestDAO({
				hrID: talentInfo?.hrID,
				onboardID: talentInfo?.onboardID,
				month: month === 0 ? new Date().getMonth() + 1 : month + 1,
				year: year === 1970 ? new Date().getFullYear() : year,
			});

		if (editBPRateResponse?.statusCode === HTTPStatusCode.OK) {
			setValue(
				'finalBillRate',
				editBPRateResponse?.responseBody?.details?.finalBillRate,
			);
			setValue(
				'finalPayRate',
				editBPRateResponse?.responseBody?.details?.finalPayRate,
			);
			setBillRateValue(
				editBPRateResponse?.responseBody?.details?.finalBillRate,
			);
			setPayRateValue(editBPRateResponse?.responseBody?.details?.finalPayRate);
			setValue(
				'billRate',
				editBPRateResponse?.responseBody?.details?.billRate,
			);
			setValue(
				'payRate',
				editBPRateResponse?.responseBody?.details?.payRate,
			);

			setValue(
				'billNRRate',
				editBPRateResponse?.responseBody?.details?.billRate_NR,
			);
			setValue(
				'payNRRate',
				editBPRateResponse?.responseBody?.details?.payRate_NR,
			);
			setCurrencyValue(editBPRateResponse?.responseBody?.details?.currency)

			setReasons(editBPRateResponse?.responseBody?.details?.reasonDrp)

			setValue('billRateReason',editBPRateResponse?.responseBody?.details?.billRateReason)
			setControlledBillRateReason(editBPRateResponse?.responseBody?.details?.billRateReason)
			editBPRateResponse?.responseBody?.details?.billRateReason === "Others" && setValue('otherbillRateReason',editBPRateResponse?.responseBody?.details?.billRateOtherReason)

			setValue('payRateReason',editBPRateResponse?.responseBody?.details.payRateReason)
			setControlledPayRateReason(editBPRateResponse?.responseBody?.details.payRateReason)
			editBPRateResponse?.responseBody?.details.payRateReason === "Others" && setValue('otherpayRateReason',editBPRateResponse?.responseBody?.details?.payRateOtherReason)
			
		}
	}, [month, setValue, talentInfo?.hrID, talentInfo?.onboardID, year]);

	const submitBillRateHandler = useCallback(
		async (d) => {
			setIsLoading(true)
			let billRateDataFormatter = {
				onboardId: talentInfo?.onboardID,
				// billRate: d.billRate,
				billRate: d.finalBillRate,
				payRate: d.finalPayRate,
				nr: d.billNRRate,
				billRateComment: d.billRateAdditionalComment,
				payRateComment: d.payRateAdditionalComment || '',
				billrateCurrency: d.billRateCurrency?.value,
				month: month === 0 ? new Date().getMonth() + 1 : month + 1,
				year: year === 1970 ? new Date().getFullYear() : year,
				// billRateReason: d.billRateReason?.value,
				// payrateReason: d.payRateReason?.value || '',
				billRateReason: d.billRateReason === "Others" ? d.otherbillRateReason : d.billRateReason?? '',
				payrateReason: d.payRateReason === "Others" ? d.otherpayRateReason : d.payRateReason?? '',
				isEditBillRate: true,
			};

			const response = await engagementRequestDAO.saveEditBillPayRateRequestDAO(
				billRateDataFormatter,
			);
			if (response.statusCode === HTTPStatusCode.OK) {
				closeModal();
				resetFormFields();
				engagementListHandler();
				setIsLoading(false)
			}
			setIsLoading(false)
		},
		[closeModal, engagementListHandler, month, talentInfo?.onboardID, year],
	);

	const submitPayRateHandler = useCallback(
		async (d) => {
			setIsLoading(true)
			let billRateDataFormatter = {
				onboardId: talentInfo?.onboardID,
				billRate: d.finalBillRate,
				// payRate: d.payRate,
				payRate: d.finalPayRate,
				nr: d.payNRRate,
				billRateComment: d.billRateAdditionalComment || '',
				payRateComment: d.payRateAdditionalComment || '',
				billrateCurrency: d.payRateCurrency?.value,
				month: month === 0 ? new Date().getMonth() + 1 : month + 1,
				year: year === 1970 ? new Date().getFullYear() : year,
				billRateReason: d.billRateReason === "Others" ? d.otherbillRateReason : d.billRateReason?? '',
				payrateReason: d.payRateReason === "Others" ? d.otherpayRateReason : d.payRateReason?? '',
				isEditBillRate: false,
			};

			const response = await engagementRequestDAO.saveEditBillPayRateRequestDAO(
				billRateDataFormatter,
			);
			if (response.statusCode === HTTPStatusCode.OK) {
				closeModal();
				resetFormFields();
				engagementListHandler();
				setIsLoading(false)
			}
			setIsLoading(false)
			// console.log(response, '-response---');
		},
		[closeModal, engagementListHandler, month, talentInfo?.onboardID, year],
	);
	useEffect(() => {
		editBillRatePayRateHandler();
		currencyHandler();
	}, [currencyHandler, editBillRatePayRateHandler]);

	const onModalClose = () => {
		closeModal();
		resetFormFields();
	}

	const resetFormFields = () => {
		resetField('billRateCurrency');
			// resetField('billRate');
			// resetField('finalBillRate');
			resetField('billRateReason');
			resetField('billNRRate');
			resetField('billRateAdditionalComment');
			resetField('payRateCurrency');
			// resetField('payRate');
			// resetField('finalPayRate');
			resetField('payRateReason');
			resetField('payNRRate');
			resetField('payRateAdditionalComment');
	}

	// useEffect(() => {
	// 	console.log(closeModal, '-close')
	// 	if (closeModal) {
	// 		resetField('billRateCurrency');
	// 		// resetField('billRate');
	// 		// resetField('finalBillRate');
	// 		resetField('billRateReason');
	// 		resetField('billNRRate');
	// 		resetField('billRateAdditionalComment');
	// 		resetField('payRateCurrency');
	// 		// resetField('payRate');
	// 		// resetField('finalPayRate');
	// 		resetField('payRateReason');
	// 		resetField('payNRRate');
	// 		resetField('payRateAdditionalComment');
	// 	}
	// }, [closeModal, resetField, rateReason]);



	useEffect(() => {
		if (currency.length > 1) {
			currency?.map((item) => {
				if (item?.value === currencyValue) {
					setBillEdit(item?.value);
					setValue('billRateCurrency', item);
					setValue("payRateCurrency",item);
				}
			});
		}
	}, [ currency,currencyValue]);

const nrPercentagePR =useCallback( async(e)=>{
let response = await engagementRequestDAO.calculateActualNRBRPRDAO(watchFinalBillRate,e,currencyValue)

if(response?.statusCode===HTTPStatusCode?.OK){
	setValue("payNRRate",response?.responseBody?.details)
	setError("payNRRate",{})
}else if(response.statusCode === HTTPStatusCode?.BAD_REQUEST){
	setError("payNRRate",{
		type:"finalPayRate",
	message:response.statusCode === HTTPStatusCode?.BAD_REQUEST && "Can't Calculate"})
}
},[setValue,setError,watchFinalBillRate,HTTPStatusCode])

const nrPercentageBR = useCallback( async(e)=>{
	let response = await engagementRequestDAO.calculateActualNRBRPRDAO(e.target.value,watchFinalPayRate,currencyValue)
	if(response?.statusCode===HTTPStatusCode?.OK){
		setValue("billNRRate",response?.responseBody?.details)
		setError("billNRRate",{})
	}else if(response.statusCode === HTTPStatusCode?.BAD_REQUEST){
		setError("billNRRate",{
			type:"finalBillRate",
		message:response.statusCode === HTTPStatusCode?.BAD_REQUEST && "Can't Calculate"})
	}
	},[setValue,setError,watchFinalPayRate,HTTPStatusCode])

	return (
		<div className={allengagementBillAndPayRateStyles.engagementModalContainer}>
			<div
				className={` ${allengagementBillAndPayRateStyles.headingContainer} ${allengagementBillAndPayRateStyles.payRateAndBillrateWrapper} `}>
				<h1>Edit Bill Rate/Pay Rate</h1>
			</div>

			<Tabs
				defaultActiveKey={engagementBillAndPayRateTab}
				activeKey={engagementBillAndPayRateTab}
				onChange={callback}>
				<TabPane
					tab="Edit Bill Rate"
					key="1">
					<div
						className={
							allengagementBillAndPayRateStyles.firstFeebackTableContainer
						}>
						{isLoading ? <Skeleton /> : <>
						<div
							className={`${allengagementBillAndPayRateStyles.row} ${allengagementBillAndPayRateStyles.billRateWrapper}`}>
							<div className={allengagementBillAndPayRateStyles.colMd6}>
								<HRSelectField
									controlledValue={levelBillEdit}
									setControlledValue={setBillEdit}
									isControlled={true}
									mode={'id/value'}
									setValue={setValue}
									register={register}
									name="billRateCurrency"
									label="Select Currency"
									options={currency&&currency}
									disabled={true}
									// required
									// isError={
									// 	errors['billRateCurrency'] && errors['billRateCurrency']
									// }
									// errorMsg="Please select a currency."
								/>
							</div>
							<div
								className={`${allengagementBillAndPayRateStyles.colMd6} ${allengagementBillAndPayRateStyles.rateCounterField}`}>
								<button
									className={`${allengagementBillAndPayRateStyles.minusButton}  ${allengagementBillAndPayRateStyles.disabled}`}
									onClick={(e) =>
										billRateValue > 0
											? setBillRateValue(billRateValue - 1)
											: e.preventDefault()
									}
									// disabled={billRateValue === 0 ? true : false}
									disabled={true}
									>
									<MinusSVG />
								</button>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'Please enter bill rate.',
										valueAsNumber: true,
									}}
									label={`Bill Rate (${currencyValue})`}
									name="billRate"
									type={InputType.NUMBER}
									// value={billRateValue}
									placeholder="Enter Amount"
									required
									disabled={true}
								/>
								<button
									className={`${allengagementBillAndPayRateStyles.plusButton}  ${allengagementBillAndPayRateStyles.disabled}`}
									onClick={() => setBillRateValue(billRateValue + 1)}
									disabled={true}>
									<PlusSVG />
								</button>
							</div>
						</div>
						<div className={allengagementBillAndPayRateStyles.row}>
							<div className={allengagementBillAndPayRateStyles.colMd6}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'please enter bill rate manually.',
										min:{
											value: 1,
											message: `please enter the value more than 0`,
											},
									}}
									label="Final Actual Bill Rate"
									name="finalBillRate"
									onChangeHandler={(e)=>nrPercentageBR(e)}
									type={InputType.TEXT}
									placeholder="Enter Amount"
									required={engagementBillAndPayRateTab === '1'}
									disabled={activeTab !== '1'}
								/>
							</div>
							<div className={allengagementBillAndPayRateStyles.colMd6}>
								<HRSelectField
								  	controlledValue={controlledBillRateReason}
									setControlledValue={setControlledBillRateReason}
									isControlled={true}
									mode={'value'}
									setValue={setValue}
									register={register}
									name="billRateReason"
									label="Reason"
									defaultValue="Please Select"
									options={reasons.map(reason=> ({id: reason.value, value: reason.text}))}
									required={engagementBillAndPayRateTab === "1"}
									isError={errors['billRateReason'] && errors['billRateReason']}
									errorMsg="Please select a reason."
									disabled={activeTab !== '1'}
								/>
							</div>
							{watch('billRateReason') === "Others" && 
								<div className={allengagementBillAndPayRateStyles.colMd12}>
									<HRInputField
										register={register}
										errors={errors}
										validationSchema={{
											required: 'please enter other reason.',
										}}
										required={watch('billRateReason') === "Others"}
										label="Other Reason"
										name="otherbillRateReason"
										type={InputType.TEXT}
										placeholder="Enter Other Reason"
									/>
								</div>
							}
						</div>

						<div className={allengagementBillAndPayRateStyles.row}>
							<div
								className={`${allengagementBillAndPayRateStyles.colMd6} ${allengagementBillAndPayRateStyles.nrRateWrapper}`}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'please enter NR rate.',
									}}
									label="NR%"
									name="billNRRate"
									type={InputType.TEXT}
									// value="10%"
									disabled={true}
									required={engagementBillAndPayRateTab === '1'}
								/>
							</div>
							<div className={allengagementBillAndPayRateStyles.colMd6}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'please enter additional comment.',
									}}
									label="Additional Comment"
									name="billRateAdditionalComment"
									type={InputType.TEXT}
									placeholder="Enter"
									disabled={activeTab !== '1'}
								/>
							</div>
						</div>
						</>}	
						

						<div className={allengagementBillAndPayRateStyles.formPanelAction}>
							<button
								// disabled={isLoading}
								type="submit"
								onClick={handleSubmit(submitBillRateHandler)}
								className={allengagementBillAndPayRateStyles.btnPrimary}
								disabled={isLoading ? isLoading : activeTab !== '1'}
								>
								Save
							</button>
							<button
								className={allengagementBillAndPayRateStyles.btn}
								onClick={onModalClose}>
								Cancel
							</button>
						</div>
					</div>
				</TabPane>
				<TabPane
					tab="Edit Pay Rate"
					key="2">
					<div
						className={
							allengagementBillAndPayRateStyles.firstFeebackTableContainer
						}>

							{isLoading ? <Skeleton /> : 							
							<>
								<div
							className={`${allengagementBillAndPayRateStyles.row} ${allengagementBillAndPayRateStyles.billRateWrapper}`}>
							<div className={allengagementBillAndPayRateStyles.colMd6}>
								<HRSelectField
									controlledValue={levelBillEdit}
									setControlledValue={setBillEdit}
									isControlled={true}
									mode={'id/value'}
									setValue={setValue}
									register={register}
									name="payRateCurrency"
									label="Select Currency"
									disabled={true}
									options={currency}
									// required
									// isError={
									// 	errors['payRateCurrency'] && errors['payRateCurrency']
									// }
									// errorMsg="Please select a currency."
								/>
							</div>

							<div
								className={`${allengagementBillAndPayRateStyles.colMd6} ${allengagementBillAndPayRateStyles.rateCounterField}`}>
								<button
									className={`${allengagementBillAndPayRateStyles.minusButton}  ${allengagementBillAndPayRateStyles.disabled}`}
									// disabled={payRateValue === 0 ? true : false}
									disabled={true}
									onClick={(e) =>
										payRateValue > 0
											? setPayRateValue(payRateValue - 1)
											: e.preventDefault()
									}>
									<MinusSVG />
								</button>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'Please enter pay rate.',
										valueAsNumber: true,
									}}
									label={`Pay Rate (${currencyValue})`}
									name="payRate"
									// value={payRateValue}
									type={InputType.TEXT}
									placeholder="Enter Amount"
									required
									disabled={true}
								/>
								<button
									className={`${allengagementBillAndPayRateStyles.plusButton}  ${allengagementBillAndPayRateStyles.disabled}`}
									disabled={true}
									onClick={(e) =>
										payRateValue >= 0
											? setPayRateValue(payRateValue + 1)
											: e.preventDefault()
									}>
									<PlusSVG />
								</button>
							</div>
						</div>
						<div className={allengagementBillAndPayRateStyles.row}>
							<div className={allengagementBillAndPayRateStyles.colMd6}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'please enter pay rate manually.',
										min:{
											value: 0.1,
											message: `please enter the value more than 0`,
											},
									}}
									label="Final Actual Pay Rate"
									name="finalPayRate"
									type={InputType.TEXT}
									onChangeHandler = {(e)=>{nrPercentagePR(e.target.value);}}
									placeholder="Enter Amount"
									required={engagementBillAndPayRateTab === '2'}
									disabled={activeTab !== '2'}
								/>
							</div>
							<div className={allengagementBillAndPayRateStyles.colMd6}>
								<HRSelectField
									controlledValue={controlledPayRateReason}
									setControlledValue={setControlledPayRateReason}
									isControlled={true}
									mode={'value'}
									setValue={setValue}
									register={register}
									name="payRateReason"
									label="Reason"
									defaultValue="Please Select"
									options={reasons.map(reason=> ({id: reason.value, value: reason.text}))}
									required={engagementBillAndPayRateTab === '2'}
									isError={errors['payRateReason'] && errors['payRateReason']}
									errorMsg="Please select a reason."
									disabled={activeTab !== '2'}
								/>

							</div>

							{watch('payRateReason') === "Others" && 
								<div className={allengagementBillAndPayRateStyles.colMd12}>
									<HRInputField
										register={register}
										errors={errors}
										validationSchema={{
											required: 'please enter other reason.',
										}}
										required={watch('payRateReason') === "Others"}
										label="Other Reason"
										name="otherpayRateReason"
										type={InputType.TEXT}
										placeholder="Enter Other Reason"
									/>
								</div>
							}
						</div>

						<div className={allengagementBillAndPayRateStyles.row}>
							<div
								className={`${allengagementBillAndPayRateStyles.colMd6}  ${allengagementBillAndPayRateStyles.nrRateWrapper}`}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'please enter NR rate.',
									}}
									label="NR%"
									name="payNRRate"
									type={InputType.TEXT}
									// value="10%"
									disabled={true}
									required={engagementBillAndPayRateTab === '2'}
								/>
							</div>
							<div className={allengagementBillAndPayRateStyles.colMd6}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'please enter additional comment.',
									}}
									label="Additional Comment"
									name="payRateAdditionalComment"
									type={InputType.TEXT}
									placeholder="Enter"
									disabled={activeTab !== '2'}
								/>
							</div>
						</div>
							</>}
					

						<div className={allengagementBillAndPayRateStyles.formPanelAction}>
							<button
								type="submit"
								onClick={handleSubmit(submitPayRateHandler)}
								className={allengagementBillAndPayRateStyles.btnPrimary}
								disabled={isLoading ? isLoading : activeTab !== '2'}
								>
								Save
							</button>
							<button
								className={allengagementBillAndPayRateStyles.btn}
								onClick={onModalClose}>
								Cancel
							</button>
						</div>
					</div>
				</TabPane>
			</Tabs>
		</div>
	);
};

export default EngagementBillRateAndPayRate;
