import { InputType } from 'constants/application';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import editBillAndPayRate from '../editBillAndPayRate/editBillAndPayRate.module.css';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { HTTPStatusCode } from 'constants/network';
import SpinLoader from "shared/components/spinLoader/spinLoader";

const EditDPRate = ({ onCancel
 , DPData, hrId,hrNO,

}) => {
    const [isLoading, setIsLoading] = useState(false)
    const {
		register,
		handleSubmit,
		setValue,
        watch,
		resetField,
		formState: { errors },
	} = useForm();
    const { talentId , contactPriorityID} = DPData

    const getDpAmounts =  useCallback(async() => {
        let data = { hrID: hrId, talentId  , contactPriorityID  };
        setIsLoading(true);
        const response = await hiringRequestDAO.GetHRDPAmountsDAO(data);
        if (response?.statusCode === HTTPStatusCode.OK) {
            const dpData = response.responseBody.details
            setValue('dpAmount', dpData.DPAmount)
            setValue('dpPercentage', dpData.DP_Percentage)
            setValue('expectedCTC', dpData.TalentExpectedCTC)
            setValue('currentCTC', dpData.TalentCurrentCTC)    
        }
        setIsLoading(false);
      },[hrId,talentId,contactPriorityID,setValue])


    useEffect(() => {
        getDpAmounts()
    },[hrId,talentId,contactPriorityID])

    let watchExpectedCTC  = watch('expectedCTC')
    let watchDPpercentage = watch('dpPercentage')

    // watch values and change DP amount
    useEffect(() => { 
        let DPAMOUNT =  ((watchExpectedCTC *  12) * watchDPpercentage) / 100 
        setValue('dpAmount', DPAMOUNT.toFixed(2))
    },[watchExpectedCTC,watchDPpercentage, setValue])

    const saveDPRatehandler = async (data) => {
        setIsLoading(true);
        let DPPayload = {
            "hrid": hrId,
            "contactTalentID": contactPriorityID,
            "talentID": talentId,
            "dpAmount":  +data.dpAmount ,
            "dpPercentage": +data.dpPercentage,
            "currentCTC": +data.currentCTC,
            "expectedCTC": +data.expectedCTC
          }

        const response = await hiringRequestDAO.UpdateHRDPAmountsDAO(DPPayload)
        if (response.responseBody.statusCode === HTTPStatusCode.OK) {
            setIsLoading(false);
            onCancel();
            window.location.reload();
        }
        setIsLoading(false);
    }

    return (
        <div className={editBillAndPayRate.engagementModalContainer}
        >
            <div className={`${editBillAndPayRate.headingContainer} ${editBillAndPayRate.payRateContainer}`}>
                <h1>Edit DP Rate ({hrNO})</h1>
            </div>

            {isLoading ? <SpinLoader /> : 
            <>
             <div className={editBillAndPayRate.firstFeebackTableContainer}>
             <div className={editBillAndPayRate.colMd12}>
						<p>
							Currency<span>*</span> :{' '}
							{Object.keys(DPData?.allValues).length > 0 &&
								DPData?.allValues?.TalentCurrenyCode}
						</p>
					</div>
                <div className={editBillAndPayRate.row}>
                    <div
                        className={editBillAndPayRate.colMd12}>
                        <HRInputField
                            register={register}
                            errors={errors}
                            validationSchema={{
                                required: 'please enter Talent Current CTC.',
                            }}
                            label="Talent Current CTC"
                            name="currentCTC"
                            type={InputType.NUMBER}
                            placeholder="Enter Amount"
                            required
                        />
                    </div>
                </div>

                <div className={editBillAndPayRate.row}>
                    <div
                        className={editBillAndPayRate.colMd12}>
                        <HRInputField
                            register={register}
                            errors={errors}
                            validationSchema={{
                                required: 'please enter Talent Expected CTC.',
                            }}
                            label="Talent Expected CTC Monthly"
                            name="expectedCTC"
                            type={InputType.NUMBER}
                            placeholder="Enter Amount"
                            required
                        />
                    </div>
                </div>

                <div className={editBillAndPayRate.row}>
                    <div
                        className={editBillAndPayRate.colMd12}>
                        <HRInputField
                            register={register}
                            errors={errors}
                            validationSchema={{
                                required: 'please enter DP Percentage.',
                            }}
                            label="DP Percentage"
                            name="dpPercentage"
                            type={InputType.NUMBER}
                            placeholder="Enter Amount"
                            required
                        />
                    </div>
                </div>

                <div className={editBillAndPayRate.row}>
                    <div
                        className={editBillAndPayRate.colMd12}>
                        <HRInputField
                            register={register}
                            errors={errors}
                            validationSchema={{
                                required: 'Invalid DP Amount.',
                                validate: (value) => {
                                    if (value <= 0) {
                                      return "Invalid DP Amount.";
                                    }
                                  },
                            }}
                            label="DP One time Amount"
                            name="dpAmount"
                            type={InputType.NUMBER}
                            placeholder="Enter Amount"
                            required
                            disabled={true}
                        />
                    </div>
                </div>

                <div className={editBillAndPayRate.formPanelAction}>
                    <button
                        type="submit"
                        className={editBillAndPayRate.btnPrimary}
                        onClick={handleSubmit(saveDPRatehandler)}
                    >
                        Submit
                    </button>
                    <button
                        onClick={() => onCancel()}
                        className={editBillAndPayRate.btn}>
                        Cancel
                    </button>
                </div>

            </div>
            </>
            }
                   </div>
    );
};

export default EditDPRate;
