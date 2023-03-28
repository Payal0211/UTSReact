import { InputType } from 'constants/application';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import allengagementReplceTalentStyles from '../engagementBillAndPayRate/engagementBillRate.module.css';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import { Radio } from 'antd';
const EngagementReplaceTalent = ({
}) => {

    /*--------- React DatePicker ---------------- */
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    /*--------- antd Radio ---------------- */
    const [getRadio, setRadio] = useState("client")
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

    const onCalenderFilter = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };
    const onSlotChange = (e) => {
        setRadio(e.target.value)
    };

    return (
        <div className={allengagementReplceTalentStyles.engagementModalContainer}
        >
            <div className={`${allengagementReplceTalentStyles.headingContainer} ${allengagementReplceTalentStyles.replaceTalentWrapper}`}>
                <h1>Replace Talent</h1>
                <p>Before proceeding, Can you help know answers on below aspects of replacement?</p>
            </div>
            <div className={allengagementReplceTalentStyles.firstFeebackTableContainer}>
                <div className={`${allengagementReplceTalentStyles.row} ${allengagementReplceTalentStyles.billRateWrapper}`}>
                    <div
                        className={allengagementReplceTalentStyles.colMd6}>
                        <HRSelectField
                            setValue={setValue}
                            register={register}
                            name="replaceStage"
                            label="At what stage are you requesting this replacement at?"
                            defaultValue="Please Select"
                            options={[]}
                            required
                            isError={
                                errors['replaceStage'] && errors['replaceStage']
                            }
                            errorMsg="Please select a replcement stage."
                        />
                    </div>
                    <div
                        className={allengagementReplceTalentStyles.colMd6}>
                        <div className={allengagementReplceTalentStyles.timeLabel}>Please Enter Date of Last Working Day</div>
                        <div className={allengagementReplceTalentStyles.timeSlotItem}>
                            <DatePicker
                                onKeyDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                className={allengagementReplceTalentStyles.dateFilter}
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
                <div className={`${allengagementReplceTalentStyles.row} ${allengagementReplceTalentStyles.radioWrapper}`}>
                    <div
                        className={`${allengagementReplceTalentStyles.radioFormGroup} ${allengagementReplceTalentStyles.requestByRadio} `}>
                        <label>
                            Replacement Initiated by
                            <span className={allengagementReplceTalentStyles.reqField}>*</span>
                        </label>
                        <Radio.Group
                            defaultValue={"client"}
                            className={allengagementReplceTalentStyles.radioGroup}
                            onChange={onSlotChange}
                            value={getRadio}>
                            <Radio value={'client'}>Client</Radio>
                            <Radio value={'talent'}>Talent</Radio>
                            <Radio value={'internal team'}>Internal Team</Radio>
                        </Radio.Group>
                    </div>
                </div>

                <div className={allengagementReplceTalentStyles.row}>
                    <div
                        className={allengagementReplceTalentStyles.colMd6}>
                        <HRSelectField
                            setValue={setValue}
                            register={register}
                            name="replaceStage"
                            label="At what stage are you requesting this replacement at?"
                            defaultValue="Please Select"
                            options={[]}
                            required
                            isError={
                                errors['replaceStage'] && errors['replaceStage']
                            }
                            errorMsg="Please select a replcement stage."
                        />
                    </div>
                    <div
                        className={allengagementReplceTalentStyles.colMd6}>
                        <HRSelectField
                            setValue={setValue}
                            register={register}
                            name="replaceStage"
                            label="Who will handle the Replacement?"
                            defaultValue="Please Select"
                            options={[]}
                            isError={
                                errors['replaceStage'] && errors['replaceStage']
                            }
                            errorMsg="Please select replacement handler."
                        />
                    </div>
                </div>

                <div className={allengagementReplceTalentStyles.row}>
                    <div
                        className={allengagementReplceTalentStyles.colMd12}>
                        <HRInputField
                            errors={errors}
                            validationSchema={{
                                required: 'Please enter NBD name.',
                            }}
                            label={'Add NBD/AM Person Name'}
                            register={register}
                            name="nbdName"
                            type={InputType.TEXT}
                            placeholder="Enter Names"
                        />
                    </div>
                </div>

                <div className={allengagementReplceTalentStyles.row}>
                    <div
                        className={allengagementReplceTalentStyles.colMd12}>
                        <HRInputField
                            errors={errors}
                            validationSchema={{
                                required: 'Please enter additonal notes.',
                            }}
                            label={'Additional Notes'}
                            register={register}
                            name="additionalNotes"
                            type={InputType.TEXT}
                            placeholder="Add Notes"
                        />
                    </div>
                </div>

                <div className={allengagementReplceTalentStyles.formPanelAction}>
                    <button
                        // disabled={isLoading}
                        type="submit"
                        // onClick={handleSubmit(clientSubmitHandler)}
                        className={allengagementReplceTalentStyles.btnPrimary}>
                        Save
                    </button>
                    <button
                        className={allengagementReplceTalentStyles.btn}>
                        Cancel
                    </button>
                </div>

            </div>
        </div>
    );
};

export default EngagementReplaceTalent;
