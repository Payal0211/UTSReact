import { InputType } from 'constants/application';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import editBillAndPayRate from './editBillAndPayRate.module.css';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { HTTPStatusCode } from 'constants/network';

const EditPayRate = ({ talentInfo, onCancel
    , register, errors, handleSubmit, setHRapiCall, callHRapi,hrNO

}) => {

    const savePayRatehandler = async (data) => {
        const savePayRatePayload = {
            ContactPriorityID: talentInfo?.ContactPriorityID,
            talentFees: data?.talentFees
        }
        const response = await hiringRequestDAO.updateTalentFeesRequestDAO(savePayRatePayload)
        if (response.responseBody.statusCode === HTTPStatusCode.OK) {
            onCancel()
            setHRapiCall(!callHRapi)
        }
    }

    return (
        <div className={editBillAndPayRate.engagementModalContainer}
        >
            <div className={`${editBillAndPayRate.headingContainer} ${editBillAndPayRate.payRateContainer}`}>
                <h1>Edit Pay Rate ({hrNO})</h1>
            </div>
            <div className={editBillAndPayRate.firstFeebackTableContainer}>
                <div className={editBillAndPayRate.row}>
                    <div
                        className={editBillAndPayRate.colMd12} style={{display:'flex', alignItems:'center'}}>
                            <>
                            {talentInfo?.CurrencySign}
                            <div style={{width:'50%', margin:'0 5px'}}>
                                <HRInputField
                                    register={register}
                                    errors={errors}
                                    validationSchema={{
                                        required: 'please enter Talent Fees.',
                                    }}
                                    label="Talent Fees"
                                    name="talentFees"
                                    type={InputType.NUMBER}
                                    placeholder="Enter Amount"
                                    required
                                />
                            </div>                         
                        {talentInfo?.TalentCurrenyCode} /Month
                            </>                       
                    </div>
                </div>

                <div className={editBillAndPayRate.formPanelAction}>
                    <button
                        type="submit"
                        className={editBillAndPayRate.btnPrimary}
                        onClick={handleSubmit(savePayRatehandler)}
                    >
                        Save
                    </button>
                    <button
                        onClick={() => onCancel()}
                        className={editBillAndPayRate.btn}>
                        Cancel
                    </button>
                </div>

            </div>
        </div>
    );
};

export default EditPayRate;
