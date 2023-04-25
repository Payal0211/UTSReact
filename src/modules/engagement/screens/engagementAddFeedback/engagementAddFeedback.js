import { InputType } from 'constants/application';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import allengagementAddFeedbackStyles from '../engagementBillAndPayRate/engagementBillRate.module.css';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import 'react-datepicker/dist/react-datepicker.css';
import { engagementRequestDAO } from 'core/engagement/engagementDAO';
import { HTTPStatusCode } from 'constants/network';



const EngagementAddFeedback = ({ getFeedbackFormContent, onCancel, feedBackSave, setFeedbackSave, register, handleSubmit, setValue, control, setError, getValues, watch, reset, resetField, errors, setFeedbackTypeEdit, feedBackTypeEdit
}) => {
    const watchFeedbackDate = watch('feedBackDate')
    const submitFeedbacHandler = async (data) => {

        const feedBackdata = {
            hiringRequest_ID: getFeedbackFormContent?.hiringRequest_ID,
            contactID: getFeedbackFormContent?.contactID,
            onBoardID: getFeedbackFormContent?.onBoardID,
            feedbackType: data?.feedbackType.value,
            feedbackComment: data?.feedbackComments,
            feedbackActionToTake: data?.actionToTake,
            feedbackCreatedDateTime: data?.feedBackDate,
            hrNumber: getFeedbackFormContent?.hrNumber,
            talentName: getFeedbackFormContent?.talentName,
            talentID: getFeedbackFormContent?.talentID,
            engagemenID: getFeedbackFormContent?.engagementID
        }
        const response = await engagementRequestDAO.saveFeedbackFormDAO(feedBackdata);
        if (response.statusCode === HTTPStatusCode.OK) {
            onCancel()
            setFeedbackSave(!feedBackSave)
        }
    }

    return (
        <div className={allengagementAddFeedbackStyles.engagementModalWrap}
        >
            <div className={`${allengagementAddFeedbackStyles.headingContainer} ${allengagementAddFeedbackStyles.addFeebackContainer}`}>
                <h1>Add Feedback</h1>
                <ul>
                    <li><span>HR ID:</span> {getFeedbackFormContent?.hrNumber}</li>
                    <li className={allengagementAddFeedbackStyles.divider}>|</li>
                    <li><span>Engagement ID:</span>{getFeedbackFormContent?.engagemenID}</li>
                    <li className={allengagementAddFeedbackStyles.divider}>|</li>
                    <li><span>Talent Name:</span> {getFeedbackFormContent?.talentName}</li>
                </ul>
            </div>

            <div className={allengagementAddFeedbackStyles.row}>
                <div
                    className={allengagementAddFeedbackStyles.colMd6}>
                    <HRSelectField
                        mode='id/value'
                        controlledValue={feedBackTypeEdit}
                        setControlledValue={setFeedbackTypeEdit}
                        isControlled={true}
                        setValue={setValue}
                        register={register}
                        name="feedbackType"
                        label="Feedback Type"
                        defaultValue="Please Select"
                        options={getFeedbackFormContent.drpFeedbackType?.filter((item) => item?.value !== "0")}
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
                        <Controller
                            render={({ ...props }) => (
                                <DatePicker
                                    selected={watchFeedbackDate ? watchFeedbackDate : null}
                                    placeholderText="Please Select Date"
                                    onChange={(date) => {
                                        setValue('feedBackDate', date);
                                    }}
                                />
                            )}
                            name="feedBackDate"
                            rules={{ required: true }}
                            control={control}
                        />
                        {errors.feedBackDate && (
                            <div className={allengagementAddFeedbackStyles.error}>
                                * Please select feedback date
                            </div>
                        )}
                        <CalenderSVG />
                    </div>
                </div>
            </div>
            <div className={allengagementAddFeedbackStyles.row}>
                <div
                    className={allengagementAddFeedbackStyles.colMd12}>
                    <HRInputField
                        register={register}
                        required
                        isTextArea={true}
                        rows={4}
                        errors={errors}
                        validationSchema={{
                            required: 'Please enter the feedback comment.',
                        }}
                        label={'Feedback Comments'}
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
                        register={register}
                        isTextArea={true}
                        rows={4}
                        errors={errors}
                        validationSchema={{
                            required: 'Please enter the action to take.',
                        }}
                        label={'Action to Take'}
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
                    onClick={handleSubmit(submitFeedbacHandler)}
                    className={allengagementAddFeedbackStyles.btnPrimary}>
                    Save
                </button>
                <button
                    onClick={() => {

                        onCancel()
                    }}
                    className={allengagementAddFeedbackStyles.btn}>
                    Cancel
                </button>
            </div>
        </div >
    );
};

export default EngagementAddFeedback;
