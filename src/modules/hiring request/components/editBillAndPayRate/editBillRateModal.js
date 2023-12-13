import { InputType } from 'constants/application';
import { Skeleton } from 'antd';
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
	hrNO,
	filterTalentID,
}) => {
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm();
	const [isCalculating,setIsCalculating] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const updateHRcostHandler = useCallback(	
		async (data) => {
			if(data > 0){
				setIsCalculating(true)
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
				setIsCalculating(false)
			}
			setIsCalculating(false)
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
		setIsLoading(true)
		const saveBillRatePayload = {
			ContactPriorityID: talentInfo?.ContactPriorityID,
			Hr_Cost: data?.hrCost,
			HR_Percentage: typeof data?.nrMarginPercentage === "number" ? data?.nrMarginPercentage : Number(data?.nrMarginPercentage?.split(" ")?.[0]),
		};

		const response = await hiringRequestDAO.updateHRCostRequestDAO(
			saveBillRatePayload,
		);

		if (response.responseBody.statusCode === HTTPStatusCode.OK) {
			onCancel();
			setHRapiCall(!callHRapi);
			setIsLoading(false)
		}
		setIsLoading(false)
	};

	function extractNumberFromString(inputString) {
		const regex = /\d+/;
		const match = inputString.match(regex);
		if (match && match.length > 0) {
		  const number = parseFloat(match[0], 10);
		  return number;
		}
		return null;
	  }
	  
	useEffect(() => {
		// setValue('hrCost', extractNumberFromString(talentInfo?.BillRate));
		// setValue('nrMarginPercentage', extractNumberFromString(talentInfo?.NR));
		setValue('hrCost', getBillRateInfo?.finalHRCost ? getBillRateInfo?.finalHRCost : '') ;
		setValue('nrMarginPercentage', getBillRateInfo.hR_Percentage)
	}, [setValue, talentInfo, talentInfo?.BillRate, getBillRateInfo]);

	return (
		<div className={editBillAndPayRate.engagementModalContainer}>
			<div
				className={` ${editBillAndPayRate.headingContainer} ${editBillAndPayRate.billRateContainer}`}>
				<h1>Edit Uplers Fees ({hrNO})</h1>
			</div>

			{isLoading ? <Skeleton /> : <div className={editBillAndPayRate.firstFeebackTableContainer}>
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
								`${getBillRateInfo?.talent_Fees} `}
						</p>
					</div>
					<div className={editBillAndPayRate.colMd12} style={{display:'flex', alignItems:'center'}}>
					<div style={{width:'50%', margin:'0 14px'}}>
							<HRInputField
							register={register}
							errors={errors}
							validationSchema={{
								required: 'please enter NR margin percentage.',
								min: {
									value: 1,
									message: `please don't enter 0 & negative value`,
								},
								max:{
									value: 99.99,
									message: `please don't enter 100 & grater value`,
								}
							}}
							label="Uplers Fees %"
							name="nrMarginPercentage"
							type={InputType.NUMBER}
							placeholder="Enter"
							onChangeHandler={(e) => updateHRcostHandler(e.target.value)}
							required
						/>
						</div>
						%
						
						
					</div>
					<div className={editBillAndPayRate.colMd12} style={{display:'flex', alignItems:'center'}}>
					{talentInfo?.CurrencySign}
                            <div style={{width:'50%', margin:'0 5px'}}>
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
						{talentInfo?.TalentCurrenyCode} / Month
					</div>
				</div>
				<div className={editBillAndPayRate.formPanelAction}>
					<button
						type="submit"
						onClick={handleSubmit(saveBillRatehandler)}
						className={editBillAndPayRate.btnPrimary}
						disabled={isCalculating}
						>
						Save
					</button>
					<button
						className={editBillAndPayRate.btn}
						onClick={() => onCancel()}>
						Cancel
					</button>
				</div>
			</div>}
			
		</div>
	);
};

export default EditBillRate;
