import { InputType } from 'constants/application';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { ReactComponent as UploadSVG } from 'assets/svg/upload.svg';
import allengagementEnd from '../engagementBillAndPayRate/engagementBillRate.module.css';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import 'react-datepicker/dist/react-datepicker.css';

const EngagementEnd = ({
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
        <div className={allengagementEnd.engagementModalWrap}
        >
            <div className={`${allengagementEnd.headingContainer} ${allengagementEnd.addFeebackContainer}`}>
                <h1>End Engagement</h1>
                <ul>
                    <li><span>HR ID:</span>HR151122121801</li>
                    <li className={allengagementEnd.divider}>|</li>
                    <li><span>Engagement ID:</span>EN151122121801</li>
                    <li className={allengagementEnd.divider}>|</li>
                    <li><span>Talent Name:</span>Kirtikumar Avaiya</li>
                </ul>
            </div>

            <div className={allengagementEnd.row}>
                <div
                    className={`${allengagementEnd.colMd6}`}>
                    <label className={allengagementEnd.timeLabel}>Contract End Date <span>*</span></label>
                    <div className={allengagementEnd.timeSlotItem}>
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
                <div className={allengagementEnd.colMd6}>
                    <HRInputField
                        value={'Upload Communication Records'}
                        register={register}
                        leadingIcon={<UploadSVG />}
                        label="Contract Supporting Documents(PDF)"
                        name="contractSupporting"
                        type={InputType.BUTTON}
                    />
                </div>
            </div>
            <div className={allengagementEnd.row}>
                <div
                    className={allengagementEnd.colMd12}>
                    <HRInputField
                        required
                        isTextArea={true}
                        rows={4}
                        errors={errors}
                        validationSchema={{
                            required: 'Please enter the reason for Ending Engagement.',
                        }}
                        label={'Reason for Ending Engagement'}
                        register={register}
                        name="endEngagement"
                        type={InputType.TEXT}
                        placeholder="Enter Reason"
                    />
                </div>
            </div>



            <div className={allengagementEnd.formPanelAction}>
                <button
                    // disabled={isLoading}
                    type="submit"
                    // onClick={handleSubmit(clientSubmitHandler)}
                    className={allengagementEnd.btnPrimary}>
                    Save
                </button>
                <button
                    className={allengagementEnd.btn}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default EngagementEnd;
