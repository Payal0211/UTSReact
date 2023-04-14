import { InputType } from 'constants/application';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import allengagementBillAndPayRateStyles from './engagementBillRate.module.css';
import { Tabs } from 'antd';
import { ReactComponent as MinusSVG } from 'assets/svg/minus.svg';
import { ReactComponent as PlusSVG } from 'assets/svg/plus.svg';
import { engagementRequestDAO } from 'core/engagement/engagementDAO';
import { MasterDAO } from 'core/master/masterDAO';
import { HTTPStatusCode } from 'constants/network';

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
	const watchNRRate = watch('billNRRate');

	const [billRateValue, setBillRateValue] = useState(watchBillRate);
	const [payRateValue, setPayRateValue] = useState(watchPayRate);
	function callback(key) {
		setEngagementBillAndPayRateTab(key);
	}

	const [currency, setCurrency] = useState([]);

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
				editBPRateResponse?.responseBody?.details?.finalBillRate,
			);
			setValue(
				'payRate',
				editBPRateResponse?.responseBody?.details?.finalPayRate,
			);

			setValue(
				'billNRRate',
				editBPRateResponse?.responseBody?.details?.billRate_NR,
			);
			setValue(
				'payNRRate',
				editBPRateResponse?.responseBody?.details?.payRate_NR,
			);
		}
	}, [month, setValue, talentInfo?.hrID, talentInfo?.onboardID, year]);

	const submitBillRateHandler = useCallback(
		async (d) => {
			let billRateDataFormatter = {
				onboardId: talentInfo?.onboardID,
				billRate: d.billRate,
				payRate: 0,
				nr: d.billNRRate,
				billRateComment: d.billRateAdditionalComment,
				payRateComment: d.payRateAdditionalComment || '',
				billrateCurrency: d.billRateCurrency?.value,
				month: month === 0 ? new Date().getMonth() + 1 : month + 1,
				year: year === 1970 ? new Date().getFullYear() : year,
				billRateReason: d.billRateReason?.value,
				payrateReason: d.payRateReason?.value || '',
				isEditBillRate: true,
			};

			console.log(billRateDataFormatter, '-billRateFormatter');
			const response = await engagementRequestDAO.saveEditBillPayRateRequestDAO(
				billRateDataFormatter,
			);
			if (response.statusCode === HTTPStatusCode.OK) {
				closeModal();
				engagementListHandler();
			}
		},
		[closeModal, engagementListHandler, month, talentInfo?.onboardID, year],
	);

	const submitPayRateHandler = useCallback(
		async (d) => {
			let billRateDataFormatter = {
				onboardId: talentInfo?.onboardID,
				billRate: d.billRate,
				payRate: d.payRate,
				nr: d.payNRRate,
				billRateComment: d.billRateAdditionalComment || '',
				payRateComment: d.payRateAdditionalComment || '',
				billrateCurrency: d.payRateCurrency?.value,
				month: month === 0 ? new Date().getMonth() + 1 : month + 1,
				year: year === 1970 ? new Date().getFullYear() : year,
				billRateReason: d.payRateReason?.value || '',
				payrateReason: d.payRateReason?.value || '',
				isEditBillRate: true,
			};

			console.log(billRateDataFormatter, '-billRateFormatter');
			const response = await engagementRequestDAO.saveEditBillPayRateRequestDAO(
				billRateDataFormatter,
			);
			if (response.statusCode === HTTPStatusCode.OK) {
				closeModal();
				engagementListHandler();
			}
			// console.log(response, '-response---');
		},
		[closeModal, engagementListHandler, month, talentInfo?.onboardID, year],
	);
	useEffect(() => {
		editBillRatePayRateHandler();
		currencyHandler();
	}, [currencyHandler, editBillRatePayRateHandler]);

	useEffect(() => {
		if (closeModal) {
			resetField('billRateCurrency');
			resetField('billRate');
			// resetField('finalBillRate');
			resetField('billRateReason');
			resetField('billNRRate');
			resetField('billRateAdditionalComment');
			resetField('payRateCurrency');
			resetField('payRate');
			resetField('finalPayRate');
			resetField('payRateReason');
			resetField('payNRRate');
			resetField('payRateAdditionalComment');
		}
	}, [closeModal, resetField]);
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
						<div
							className={`${allengagementBillAndPayRateStyles.row} ${allengagementBillAndPayRateStyles.billRateWrapper}`}>
							<div className={allengagementBillAndPayRateStyles.colMd6}>
								<HRSelectField
									mode={'id/value'}
									setValue={setValue}
									register={register}
									name="billRateCurrency"
									label="Select Currency"
									defaultValue="Please Select"
									options={currency}
									required
									isError={
										errors['billRateCurrency'] && errors['billRateCurrency']
									}
									errorMsg="Please select a currency."
								/>
							</div>
							<div
								className={`${allengagementBillAndPayRateStyles.colMd6} ${allengagementBillAndPayRateStyles.rateCounterField}`}>
								<button
									className={allengagementBillAndPayRateStyles.minusButton}
									onClick={(e) =>
										billRateValue > 0
											? setBillRateValue(billRateValue - 1)
											: e.preventDefault()
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
									className={allengagementBillAndPayRateStyles.plusButton}
									onClick={() => setBillRateValue(billRateValue + 1)}>
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
									}}
									label="Final Actual Bill Rate"
									name="finalBillRate"
									type={InputType.TEXT}
									placeholder="Enter Amount"
									required
								/>
							</div>
							<div className={allengagementBillAndPayRateStyles.colMd6}>
								<HRSelectField
									mode={'id/value'}
									setValue={setValue}
									register={register}
									name="billRateReason"
									label="Reason"
									defaultValue="Please Select"
									options={[
										{
											id: 1,
											value: 'Leave Deduction',
										},
										{
											id: 2,
											value: 'Add Bonus',
										},
									]}
									required
									isError={errors['billRateReason'] && errors['billRateReason']}
									errorMsg="Please select a reason."
								/>
							</div>
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
									disabled
								/>
							</div>
							<div className={allengagementBillAndPayRateStyles.colMd6}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'please enter additional comment.',
									}}
									label="Additioanl Comment"
									name="billRateAdditionalComment"
									type={InputType.TEXT}
									placeholder="Enter"
								/>
							</div>
						</div>

						<div className={allengagementBillAndPayRateStyles.formPanelAction}>
							<button
								// disabled={isLoading}
								type="submit"
								onClick={handleSubmit(submitBillRateHandler)}
								className={allengagementBillAndPayRateStyles.btnPrimary}>
								Save
							</button>
							<button
								className={allengagementBillAndPayRateStyles.btn}
								onClick={closeModal}>
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
						<div
							className={`${allengagementBillAndPayRateStyles.row} ${allengagementBillAndPayRateStyles.billRateWrapper}`}>
							<div className={allengagementBillAndPayRateStyles.colMd6}>
								<HRSelectField
									mode={'id/value'}
									setValue={setValue}
									register={register}
									name="payRateCurrency"
									label="Select Currency"
									defaultValue="Please Select"
									options={currency}
									required
									isError={
										errors['payRateCurrency'] && errors['payRateCurrency']
									}
									errorMsg="Please select a currency."
								/>
							</div>

							<div
								className={`${allengagementBillAndPayRateStyles.colMd6} ${allengagementBillAndPayRateStyles.rateCounterField}`}>
								<button
									className={allengagementBillAndPayRateStyles.minusButton}
									disabled={payRateValue === 0 ? true : false}
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
									label="Pay Rate(USD)"
									name="payRate"
									value={payRateValue}
									type={InputType.TEXT}
									placeholder="Enter Amount"
									required
								/>
								<button
									className={allengagementBillAndPayRateStyles.plusButton}
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
									}}
									label="Final Actual Pay Rate"
									name="finalPayRate"
									type={InputType.TEXT}
									placeholder="Enter Amount"
									required
								/>
							</div>
							<div className={allengagementBillAndPayRateStyles.colMd6}>
								<HRSelectField
									mode={'id/value'}
									setValue={setValue}
									register={register}
									name="payRateReason"
									label="Reason"
									defaultValue="Please Select"
									options={[
										{
											id: 1,
											value: 'Leave Deduction',
										},
										{
											id: 2,
											value: 'Add Bonus',
										},
									]}
									required
									isError={errors['payRateReason'] && errors['payRateReason']}
									errorMsg="Please select a reason."
								/>
							</div>
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
									disabled
								/>
							</div>
							<div className={allengagementBillAndPayRateStyles.colMd6}>
								<HRInputField
									register={register}
									errors={errors}
									validationSchema={{
										required: 'please enter additional comment.',
									}}
									label="Additioanl Comment"
									name="payRateAdditionalComment"
									type={InputType.TEXT}
									placeholder="Enter"
								/>
							</div>
						</div>

						<div className={allengagementBillAndPayRateStyles.formPanelAction}>
							<button
								type="submit"
								onClick={handleSubmit(submitPayRateHandler)}
								className={allengagementBillAndPayRateStyles.btnPrimary}>
								Save
							</button>
							<button
								className={allengagementBillAndPayRateStyles.btn}
								onClick={closeModal}>
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
