import { InputType } from 'constants/application';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import engagementInvoice from '../engagementBillAndPayRate/engagementBillRate.module.css';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import 'react-datepicker/dist/react-datepicker.css';
import { engagementRequestDAO } from 'core/engagement/engagementDAO';
import { HTTPStatusCode } from 'constants/network';
import { _isNull } from 'shared/utils/basic_utils';
import { Skeleton } from 'antd';

const EngagementInvoice = ({
	engagementListHandler,
	isModalOpen,
	talentInfo,
	closeModal,
}) => {
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
		unregister,
		formState: { errors },
	} = useForm();
	const [getInvoiceDetails, setInvoiceDetails] = useState(null);
	const watchInvoiceStatus = watch('invoiceStatus');
	const [isLoading , setIsLoading] = useState(false);
	const submitEndEngagementHandler = useCallback(
		async (d) => {
			// let formattedData = {
			// 	onBoardID: talentInfo?.onboardID,
			// 	invoiceNumber: d.invoiceNumber,
			// 	invoiceSentdate: new Date(d.invoiceDate)
			// 		.toLocaleDateString('en-UK')
			// 		.split('/')
			// 		.reverse()
			// 		.join('-'),
			// 	invoiceStatusId: d.invoiceStatus?.id,
			// 	invoiceStatus: null,
			// 	paymentDate: _isNull(watchInvoiceStatus?.id)
			// 		? null
			// 		: new Date(d?.paymentDate)
			// 				.toLocaleDateString('en-UK')
			// 				.split('/')
			// 				.reverse()
			// 				.join('-'),
			// 	hrNumber: '',
			// 	talentName: '',
			// 	currencyDrp: [
			// 		{
			// 			disabled: true,
			// 			group: {
			// 				disabled: true,
			// 				name: 'string',
			// 			},
			// 			selected: true,
			// 			text: 'string',
			// 			value: 'string',
			// 		},
			// 	],
			// 	leaveType: {
			// 		additionalProp1: 'string',
			// 		additionalProp2: 'string',
			// 		additionalProp3: 'string',
			// 	},
			// 	leaveDrp: [
			// 		{
			// 			disabled: true,
			// 			group: {
			// 				disabled: true,
			// 				name: 'string',
			// 			},
			// 			selected: true,
			// 			text: 'string',
			// 			value: 'string',
			// 		},
			// 	],
			// 	billRate: 0,
			// 	payRate: 0,
			// 	payRate_NR: 0,
			// 	billRate_NR: 0,
			// 	billRate_Comment: '',
			// 	payRate_Comment: '',
			// 	currency: '',
			// 	currencyId: 0,
			// 	payRateCurrencyId: 0,
			// 	finalPayRate: 0,
			// 	finalBillRate: 0,
			// };
			setIsLoading(true)
			let formattedData = {
				"onBoardID":talentInfo?.onboardID ,
				"invoiceSentdate": new Date(d.invoiceDate)
				.toLocaleDateString('en-UK')
				.split('/')
				.reverse()
				.join('-'),
				"invoiceNumber": d.invoiceNumber ,
				'invoiceStatusId': d.invoiceStatus?.id,
				"paymentDate": _isNull(watchInvoiceStatus?.id)
				? null
				: d?.paymentDate
			} 

			const response = await engagementRequestDAO.saveInvoiceDetailsRequestDAO(
				formattedData,
			);
			if (response.statusCode === HTTPStatusCode.OK) {
				closeModal();
				engagementListHandler();
				setIsLoading(false)
			}
			setIsLoading(false)
		},
		[
			closeModal,
			engagementListHandler,
			talentInfo?.onboardID,
			watchInvoiceStatus?.id,
		],
	);
	const getContentForAddInvoiceHandler = useCallback(async () => {
		const response =
			await engagementRequestDAO.getContentForAddInvoiceRequestDAO({
				onboardID: talentInfo?.onboardID,
			});

		// console.log(response, '-response');

		if (response?.statusCode === HTTPStatusCode.OK) {
			setInvoiceDetails(response && response?.responseBody?.details);
			// setValue('invoiceNumber', response?.responseBody?.details?.invoiceNumber);
			setValue('invoiceDate', new Date());
		}
	}, [setValue, talentInfo?.onboardID]);

	useEffect(() => {
		getContentForAddInvoiceHandler();
	}, [getContentForAddInvoiceHandler]);

	useEffect(() => {
		if (watchInvoiceStatus?.id !== 3) unregister('paymentDate');
	}, [unregister, watchInvoiceStatus?.id]);

	return (
		<div className={engagementInvoice.engagementModalWrap}>
			<div
				className={`${engagementInvoice.headingContainer} ${engagementInvoice.addFeebackContainer}`}>
				<h1>Add Invoice Details</h1>
				<ul className={engagementInvoice.engModalHeadList}>
					<li>
						<span>HR ID:</span>
						{talentInfo?.hrNumber}
					</li>
					<li className={engagementInvoice.divider}>|</li>
					<li>
						<span>Engagement ID:</span>
						{talentInfo?.engagementID}
					</li>
					<li className={engagementInvoice.divider}>|</li>
					<li>
						<span>Talent Name:</span>
						{talentInfo?.talentName}
					</li>
				</ul>
			</div>

			{isLoading ? <Skeleton /> : <>
			<div className={engagementInvoice.row}>
				<div className={engagementInvoice.colMd6}>
					<HRInputField
						required
						errors={errors}
						validationSchema={{
							required: 'Please enter the invoice number.',
						}}
						label={'Invoice Number'}
						register={register}
						name="invoiceNumber"
						type={InputType.TEXT}
						placeholder="Enter Invoice Number"
					/>
				</div>
				<div className={engagementInvoice.colMd6}>
					<div className={engagementInvoice.timeSlotItemField}>
						<div className={engagementInvoice.timeLabel}>
							Invoice Sent Date
							<span>
								<b style={{ color: 'black' }}>*</b>
							</span>
						</div>
						<div className={engagementInvoice.timeSlotItem}>
							<CalenderSVG />
							<Controller
								render={({ ...props }) => (
									<DatePicker
										selected={watch('invoiceDate')}
										onChange={(date) => {
											setValue('invoiceDate', date);
										}}
										placeholderText="Invoice sent date"
										dateFormat="dd/MM/yyyy"
									/>
								)}
								name="invoiceDate"
								rules={{ required: true }}
								control={control}
							/>
							{errors.invoiceDate && (
								<div className={engagementInvoice.error}>
									* Please select invoice sent date.
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			<div className={engagementInvoice.row}>
				<div className={engagementInvoice.colMd12}>
					<HRSelectField
						mode={'id/value'}
						setValue={setValue}
						register={register}
						unregister={unregister}
						name="invoiceStatus"
						label="Invoice Status"
						defaultValue="Select Invoice Status"
						options={getInvoiceDetails?._InvoiceStatus}
						required
						isError={errors['invoiceStatus'] && errors['invoiceStatus']}
						errorMsg="Please select a invoice status."
					/>
				</div>
			</div>
			{watch('invoiceStatus')?.id === 3 && (
				<>
					<div className={engagementInvoice.row}>
						<div className={engagementInvoice.colMd6}>
							<div className={engagementInvoice.timeSlotItemField}>
								<div className={engagementInvoice.timeLabel}>
									Payment Date
									<span>
										<b style={{ color: 'black' }}>*</b>
									</span>
								</div>
								<div className={engagementInvoice.timeSlotItem}>
									<CalenderSVG />
									<Controller
										render={({ ...props }) => (
											<DatePicker
												selected={watch('paymentDate')}
												onChange={(date) => {
													setValue('paymentDate', date);
												}}
												placeholderText="Invoice sent date"
											/>
										)}
										name="paymentDate"
										rules={{ required: true }}
										control={control}
									/>
									{errors.paymentDate && (
										<div className={engagementInvoice.error}>
											* Please select payment date.
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
					<br />
				</>
			)}
			</>}

			

			<div className={engagementInvoice.formPanelAction}>
				<button
					type="submit"
					onClick={handleSubmit(submitEndEngagementHandler)}
					className={engagementInvoice.btnPrimary}
					disabled={isLoading}>
					Save
				</button>
				<button
					className={engagementInvoice.btn}
					onClick={closeModal}>
					Cancel
				</button>
			</div>
		</div>
	);
};

export default EngagementInvoice;
