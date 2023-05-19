import { InputType } from 'constants/application';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import editBillAndPayRate from './editBillAndPayRate.module.css';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { HTTPStatusCode } from 'constants/network';

const EditBillRate = ({
	getBillRateInfo,
	// register,
	// errors,
	// handleSubmit,
	setHRapiCall,
	callHRapi,
	onCancel,
	talentInfo,
	callAPI,
	hrId,
	filterTalentID,
}) => {
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm();

	const updateHRcostHandler = useCallback(
		async (data) => {
			const calculateHRData = {
				ContactPriorityID: filterTalentID?.ContactPriorityID,
				Hr_Cost: getBillRateInfo?.hrCost,
				HR_Percentage: Number(data?.split(" ")?.[0]),
				hrID: hrId,
			};
			const response = await hiringRequestDAO.calculateHRCostRequestDAO(
				calculateHRData,
			);

			if (response.responseBody.statusCode === HTTPStatusCode.OK) {
				setValue('hrCost', response?.responseBody?.details);
			}
		},
		[
			filterTalentID?.ContactPriorityID,
			getBillRateInfo?.hrCost,
			hrId,
			setValue,
		],
	);
	const saveBillRatehandler = async (data) => {
		const saveBillRatePayload = {
			ContactPriorityID: talentInfo?.ContactPriorityID,
			Hr_Cost: data?.hrCost,
			HR_Percentage: data?.nrMarginPercentage?.split(" ")?.[0],
		};
		const response = await hiringRequestDAO.updateHRCostRequestDAO(
			saveBillRatePayload,
		);

		if (response.responseBody.statusCode === HTTPStatusCode.OK) {
			onCancel();
			setHRapiCall(!callHRapi);
		}
	};
	useEffect(() => {
		setValue('hrCost', talentInfo?.BillRate);
		setValue('nrMarginPercentage', talentInfo?.NR);
	}, [setValue, talentInfo, talentInfo?.BillRate]);

	return (
		<div className={editBillAndPayRate.engagementModalContainer}>
			<div
				className={` ${editBillAndPayRate.headingContainer} ${editBillAndPayRate.billRateContainer}`}>
				<h1>Edit Bill Rate</h1>
			</div>
			<div className={editBillAndPayRate.firstFeebackTableContainer}>
				<div
					className={`${editBillAndPayRate.row} ${editBillAndPayRate.billRateWrapper}`}>
					<div className={editBillAndPayRate.colMd12}>
						<p>
							Currency<span>*</span> :{' '}
							{Object.keys(getBillRateInfo).length > 0 &&
								getBillRateInfo?.currency_Sign}
						</p>
						<p>
							Talent Fees<span>*</span> :{' '}
							{Object.keys(getBillRateInfo).length > 0 &&
								`${getBillRateInfo?.talent_Fees} ${getBillRateInfo?.currency_Sign} / Month `}
						</p>
					</div>
					<div className={editBillAndPayRate.colMd12}>
						<HRInputField
							register={register}
							errors={errors}
							validationSchema={{
								required: 'please enter NR margin percentage.',
							}}
							label="NR margin percentage"
							name="nrMarginPercentage"
							type={InputType.TEXT}
							placeholder="Enter"
							onChangeHandler={(e) => updateHRcostHandler(e.target.value)}
							required
						/>
					</div>
					<div className={editBillAndPayRate.colMd12}>
						<HRInputField
							register={register}
							errors={errors}
							validationSchema={{
								required: 'please enter hr cost',
							}}
							label="HR Cost"
							name="hrCost"
							type={InputType.TEXT}
							placeholder="Enter"
							disabled={true}
							required
						/>
					</div>
				</div>
				<div className={editBillAndPayRate.formPanelAction}>
					<button
						type="submit"
						onClick={handleSubmit(saveBillRatehandler)}
						className={editBillAndPayRate.btnPrimary}>
						Save
					</button>
					<button
						className={editBillAndPayRate.btn}
						onClick={() => onCancel()}>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default EditBillRate;
