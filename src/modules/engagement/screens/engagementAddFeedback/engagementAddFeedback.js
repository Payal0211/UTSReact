import { InputType } from 'constants/application';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import allengagementAddFeedbackStyles from '../engagementBillAndPayRate/engagementBillRate.module.css';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import 'react-datepicker/dist/react-datepicker.css';


const EngagementAddFeedback = ({
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
        <div className={allengagementAddFeedbackStyles.engagementModalWrap}
        >
            <div className={`${allengagementAddFeedbackStyles.headingContainer} ${allengagementAddFeedbackStyles.addFeebackContainer}`}>
                <h1>Add Feedback</h1>
                <ul>
                    <li><span>HR ID:</span>HR151122121801</li>
                    <li className={allengagementAddFeedbackStyles.divider}>|</li>
                    <li><span>Engagement ID:</span>EN151122121801</li>
                    <li className={allengagementAddFeedbackStyles.divider}>|</li>
                    <li><span>Talent Name:</span>Kirtikumar Avaiya</li>
                </ul>
            </div>

            <div className={allengagementAddFeedbackStyles.row}>
                <div
                    className={allengagementAddFeedbackStyles.colMd6}>
                    <HRSelectField
                        setValue={setValue}
                        register={register}
                        name="feedbackType"
                        label="Feedback Type"
                        defaultValue="Please Select"
                        options={[]}
                        required
                        isError={
                            errors['feedbackType'] && errors['feedbackType']
                        }
                        errorMsg="Please select a feedbacktype."
                    />
                </div>
                <div
                    className={`${allengagementAddFeedbackStyles.colMd6}`}>
                    <label className={allengagementAddFeedbackStyles.timeLabel}>Feedback Date</label>
                    <div className={allengagementAddFeedbackStyles.timeSlotItem}>
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
            <div className={allengagementAddFeedbackStyles.row}>
                <div
                    className={allengagementAddFeedbackStyles.colMd12}>
                    <HRInputField
                        required
                        isTextArea={true}
                        rows={4}
                        errors={errors}
                        validationSchema={{
                            required: 'Please enter the feedback comment.',
                        }}
                        label={'Feedback Comments'}
                        register={register}
                        name="feedbackComments"
                        type={InputType.TEXT}
                        placeholder="Enter Client's Feedback Comments"
                    />
                </div>
            </div>

            <div className={allengagementAddFeedbackStyles.row}>
                <div
                    className={allengagementAddFeedbackStyles.colMd12}>
                    <HRInputField
                        isTextArea={true}
                        rows={4}
                        errors={errors}
                        validationSchema={{
                            required: 'Please enter the action to take.',
                        }}
                        label={'Action to Take'}
                        register={register}
                        name="actionToTake"
                        type={InputType.TEXT}
                        placeholder="Add the Next Action to Take"
                    />
                </div>
            </div>

            <div className={allengagementAddFeedbackStyles.formPanelAction}>
                <button
                    // disabled={isLoading}
                    type="submit"
                    // onClick={handleSubmit(clientSubmitHandler)}
                    className={allengagementAddFeedbackStyles.btnPrimary}>
                    Save
                </button>
                <button
                    className={allengagementAddFeedbackStyles.btn}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default EngagementAddFeedback;
