import { InputType } from 'constants/application';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import updateTRStyle from './updateTR.module.css';
// import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
// import { HTTPStatusCode } from 'constants/network';

const UpdateTR = ({ updateTR, setUpdateTR, onCancel }) => {

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm();


    const onSubmit = async (data) => {
        console.log(data, "data")
    }

    return (
        <div className={updateTRStyle.engagementModalContainer}
        >
            <div className={updateTRStyle.updateTRTitle}>
                <h2>Update TR</h2>
                <p>HR150523191530</p>
            </div>

            <div className={updateTRStyle.firstFeebackTableContainer}>
                <div className={updateTRStyle.row}>
                    <div
                        className={updateTRStyle.colMd12}>
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
                </div>

                <div className={updateTRStyle.formPanelAction}>
                    <button
                        type="submit"
                        className={updateTRStyle.btnPrimary}
                        onClick={handleSubmit(onSubmit)}
                    >
                        Save
                    </button>
                    <button
                        onClick={() => onCancel()}
                        className={updateTRStyle.btn}>
                        Cancel
                    </button>
                </div>

            </div>
        </div>
    );
};

export default UpdateTR;
