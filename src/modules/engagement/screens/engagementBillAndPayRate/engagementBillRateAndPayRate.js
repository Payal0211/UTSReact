import { InputType } from 'constants/application';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import allengagementBillAndPayRateStyles from './engagementBillRate.module.css';
import { Tabs } from 'antd';
import { ReactComponent as MinusSVG } from 'assets/svg/minus.svg';
import { ReactComponent as PlusSVG } from 'assets/svg/plus.svg';

const EngagementBillRateAndPayRate = ({ getBillRate, getPayRate, setPayRate, setBillRate, engagementBillAndPayRateTab, setEngagementBillAndPayRateTab }) => {
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

    function callback(key) {
        setEngagementBillAndPayRateTab(key)
    }

    return (
        <div className={allengagementBillAndPayRateStyles.engagementModalContainer}
        >
            <div className={` ${allengagementBillAndPayRateStyles.headingContainer} ${allengagementBillAndPayRateStyles.payRateAndBillrateWrapper} `}>
                <h1>Edit Bill Rate/Pay Rate</h1>
            </div>

            <Tabs defaultActiveKey={engagementBillAndPayRateTab} activeKey={engagementBillAndPayRateTab} onChange={callback}>
                <TabPane tab="Edit Bill Rate" key="1">
                    <div className={allengagementBillAndPayRateStyles.firstFeebackTableContainer}>
                        <div className={`${allengagementBillAndPayRateStyles.row} ${allengagementBillAndPayRateStyles.billRateWrapper}`}>
                            <div
                                className={allengagementBillAndPayRateStyles.colMd6}>
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
                            <div className={`${allengagementBillAndPayRateStyles.colMd6} ${allengagementBillAndPayRateStyles.rateCounterField}`}>
                                <button className={allengagementBillAndPayRateStyles.minusButton} onClick={(e) => getBillRate > 0 ? setBillRate(getBillRate - 1) : e.preventDefault()} disabled={getBillRate === 0 ? true : false}><MinusSVG /></button>
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
                                    value={getBillRate}
                                    placeholder="Enter Amount"

                                    required
                                />
                                <button className={allengagementBillAndPayRateStyles.plusButton} onClick={() => setBillRate(getBillRate + 1)}><PlusSVG /></button>
                            </div>
                        </div>
                        <div className={allengagementBillAndPayRateStyles.row}>
                            <div
                                className={allengagementBillAndPayRateStyles.colMd6}>
                                <HRInputField
                                    register={register}
                                    errors={errors}
                                    validationSchema={{
                                        required: 'please enter bill rate manually.',
                                    }}
                                    label="Final Actual Bill Rate"
                                    name="billRateManually"
                                    type={InputType.TEXT}
                                    placeholder="Enter Amount"
                                    required
                                />
                            </div>
                            <div
                                className={allengagementBillAndPayRateStyles.colMd6}>
                                <HRSelectField
                                    setValue={setValue}
                                    register={register}
                                    name="reason"
                                    label="Reason"
                                    defaultValue="Please Select"
                                    options={[]}
                                    required
                                    isError={
                                        errors['reason'] && errors['reason']
                                    }
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
                                    name="nrRate"
                                    type={InputType.TEXT}
                                    value="10%"
                                    disabled
                                />
                            </div>
                            <div
                                className={allengagementBillAndPayRateStyles.colMd6}>
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

                        <div className={allengagementBillAndPayRateStyles.formPanelAction}>
                            <button
                                // disabled={isLoading}
                                type="submit"
                                // onClick={handleSubmit(clientSubmitHandler)}
                                className={allengagementBillAndPayRateStyles.btnPrimary}>
                                Save
                            </button>
                            <button
                                className={allengagementBillAndPayRateStyles.btn}>
                                Cancel
                            </button>
                        </div>

                    </div>
                </TabPane>
                <TabPane tab="Edit Pay Rate" key="2">
                    <div className={allengagementBillAndPayRateStyles.firstFeebackTableContainer}>
                        <div className={`${allengagementBillAndPayRateStyles.row} ${allengagementBillAndPayRateStyles.billRateWrapper}`}>
                            <div
                                className={allengagementBillAndPayRateStyles.colMd6}>
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

                            <div className={`${allengagementBillAndPayRateStyles.colMd6} ${allengagementBillAndPayRateStyles.rateCounterField}`}>
                                <button className={allengagementBillAndPayRateStyles.minusButton} disabled={getPayRate === 0 ? true : false}
                                    onClick={(e) => getPayRate > 0 ? setPayRate(getPayRate - 1) : e.preventDefault()
                                    }
                                ><MinusSVG /></button>
                                <HRInputField
                                    register={register}
                                    errors={errors}
                                    validationSchema={{
                                        required: 'Please enter pay rate.',
                                    }}
                                    label="Pay Rate(USD)"
                                    name="payRate"
                                    value={getPayRate}
                                    type={InputType.TEXT}
                                    placeholder="Enter Amount"
                                    required
                                />
                                <button className={allengagementBillAndPayRateStyles.plusButton}
                                    onClick={(e) => getPayRate >= 0 ? setPayRate(getPayRate + 1) : e.preventDefault()
                                    }
                                ><PlusSVG /></button>
                            </div>
                        </div>
                        <div className={allengagementBillAndPayRateStyles.row}>
                            <div
                                className={allengagementBillAndPayRateStyles.colMd6}>
                                <HRInputField
                                    register={register}
                                    errors={errors}
                                    validationSchema={{
                                        required: 'please enter bill rate manually.',
                                    }}
                                    label="Final Actual Bill Rate"
                                    name="billRateManually"
                                    type={InputType.TEXT}
                                    placeholder="Enter Amount"
                                    required
                                />
                            </div>
                            <div
                                className={allengagementBillAndPayRateStyles.colMd6}>
                                <HRSelectField
                                    setValue={setValue}
                                    register={register}
                                    name="reason"
                                    label="Reason"
                                    defaultValue="Please Select"
                                    options={[]}
                                    required
                                    isError={
                                        errors['reason'] && errors['reason']
                                    }
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
                                    name="nrRate"
                                    type={InputType.TEXT}
                                    value="10%"
                                    disabled
                                />
                            </div>
                            <div
                                className={allengagementBillAndPayRateStyles.colMd6}>
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

                        <div className={allengagementBillAndPayRateStyles.formPanelAction}>
                            <button
                                // disabled={isLoading}
                                type="submit"
                                // onClick={handleSubmit(clientSubmitHandler)}
                                className={allengagementBillAndPayRateStyles.btnPrimary}>
                                Save
                            </button>
                            <button
                                className={allengagementBillAndPayRateStyles.btn}>
                                Cancel
                            </button>
                        </div>

                    </div>
                </TabPane>

            </Tabs>
        </div >
    );
};

export default EngagementBillRateAndPayRate;
