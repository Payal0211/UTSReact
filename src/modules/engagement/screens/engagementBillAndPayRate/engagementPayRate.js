import { InputType } from 'constants/application';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import allengagementBillRateStyles from './engagementBillRate.module.css';
import { ReactComponent as MinusSVG } from 'assets/svg/minus.svg';
import { ReactComponent as PlusSVG } from 'assets/svg/plus.svg';



const EngagementPayRate = ({
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
        formState: { errors },
    } = useForm();

    return (
        <div className={allengagementBillRateStyles.engagementModalContainer}
        >
            <div className={`${allengagementBillRateStyles.headingContainer} ${allengagementBillRateStyles.payRateContainer}`}>
                <h1>Edit Pay Rate</h1>
            </div>
            <div className={allengagementBillRateStyles.firstFeebackTableContainer}>
                <div className={`${allengagementBillRateStyles.row} ${allengagementBillRateStyles.billRateWrapper}`}>
                    <div
                        className={allengagementBillRateStyles.colMd6}>
                        <HRSelectField
                            setValue={setValue}
                            register={register}
                            name="selectCurrency"
                            label="Select Currency"
                            defaultValue="Please Select"
                            options={[]}
                            required
                            isError={
                                errors['selectCurrency'] && errors['selectCurrency']
                            }
                            errorMsg="Please select a currency."
                        />
                    </div>
                    <div
                        className={allengagementBillRateStyles.colMd6}>
                        <button><MinusSVG /></button>
                        <HRInputField
                            register={register}
                            errors={errors}
                            validationSchema={{
                                required: 'Please enter pay rate.',
                            }}
                            label="Pay Rate(INR)"
                            name="payRate"
                            type={InputType.TEXT}
                            placeholder="Enter Pay Rate"
                            required
                        />
                        <button><PlusSVG /></button>
                    </div>
                </div>
                <div className={allengagementBillRateStyles.row}>
                    <div
                        className={allengagementBillRateStyles.colMd6}>
                        <HRInputField
                            register={register}
                            errors={errors}
                            validationSchema={{
                                required: 'please enter Pay rate manually.',
                            }}
                            label="Add Pay Rate Manually"
                            name="payRateManually"
                            type={InputType.TEXT}
                            placeholder="Enter Amount"
                            required
                        />
                    </div>
                    <div
                        className={allengagementBillRateStyles.colMd6}>
                        <HRInputField
                            register={register}
                            errors={errors}
                            validationSchema={{
                                required: 'please enter additional comment.',
                            }}
                            label="Additioanl Comment"
                            name="additionalComment"
                            type={InputType.TEXT}
                            placeholder="Enter"
                        />
                    </div>
                </div>

                <div className={allengagementBillRateStyles.formPanelAction}>
                    <button
                        type="submit"
                        className={allengagementBillRateStyles.btnPrimary}>
                        Save
                    </button>
                    <button
                        className={allengagementBillRateStyles.btn}>
                        Cancel
                    </button>
                </div>

            </div>
        </div>
    );
};

export default EngagementPayRate;
