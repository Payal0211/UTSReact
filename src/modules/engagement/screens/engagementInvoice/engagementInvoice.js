import { InputType } from 'constants/application';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import engagementInvoice from '../engagementBillAndPayRate/engagementBillRate.module.css';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import 'react-datepicker/dist/react-datepicker.css';


const EngagementInvoice = ({
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

    /*--------- React DatePicker ---------------- */
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const onCalenderFilter = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };


    return (
        <div className={engagementInvoice.engagementModalWrap}
        >
            <div className={`${engagementInvoice.headingContainer} ${engagementInvoice.addFeebackContainer}`}>
                <h1>Add Invoice Details</h1>
                <ul>
                    <li><span>HR ID:</span>HR151122121801</li>
                    <li className={engagementInvoice.divider}>|</li>
                    <li><span>Engagement ID:</span>EN151122121801</li>
                    <li className={engagementInvoice.divider}>|</li>
                    <li><span>Talent Name:</span>Kirtikumar Avaiya</li>
                </ul>
            </div>

            <div className={engagementInvoice.row}>
                <div
                    className={engagementInvoice.colMd6}>
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
                <div
                    className={`${engagementInvoice.colMd6}`}>
                    <label className={engagementInvoice.timeLabel}>Invoice Sent Date</label>
                    <div className={engagementInvoice.timeSlotItem}>
                        <DatePicker
                            onKeyDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            placeholderText="Please Select Date"
                            selected={startDate}
                            onChange={onCalenderFilter}
                            startDate={startDate}
                            endDate={endDate}
                        />
                        <CalenderSVG />
                    </div>
                </div>
            </div>
            <div className={engagementInvoice.row}>
                <div
                    className={engagementInvoice.colMd12}>
                    <HRSelectField
                        setValue={setValue}
                        register={register}
                        name="invoiceStatus"
                        label="Invoice Status"
                        defaultValue="Select Invoice Status"
                        options={[]}
                        required
                        isError={
                            errors['invoiceStatus'] && errors['invoiceStatus']
                        }
                        errorMsg="Please select a invoice status."
                    />
                </div>
            </div>

            <div className={engagementInvoice.formPanelAction}>
                <button
                    // disabled={isLoading}
                    type="submit"
                    // onClick={handleSubmit(clientSubmitHandler)}
                    className={engagementInvoice.btnPrimary}>
                    Save
                </button>
                <button
                    className={engagementInvoice.btn}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default EngagementInvoice;
