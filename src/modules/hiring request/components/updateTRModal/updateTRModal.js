import { InputType } from 'constants/application';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import updateTRStyle from './updateTR.module.css';
// import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
// import { HTTPStatusCode } from 'constants/network';
import { ReactComponent as MinusSVG } from 'assets/svg/minus.svg';
import { ReactComponent as PlusSVG } from 'assets/svg/plus.svg';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';

const UpdateTR = ({ updateTR, setUpdateTR, onCancel }) => {
    const [count, setCount] = useState(0)

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm();


    const onSubmit = async () => {
        console.log(data, "data")

        let data = {
            noOfTR: 0,
            hiringRequestId: 0,
            addtionalRemarks: "",
            reasonForLossCancelled: "",
            isFinalSubmit: false
        }
        const response = await hiringRequestDAO.editTRDAO(data)
    }

    useEffect(() => {
        setValue("currentTR", count)
    }, [count])


    const increment = () => {
        setCount(count + 1)
    }
    const decrement = () => {
        if (count > 0) {
            setCount(count - 1)
        }
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
                        <div className={updateTRStyle.counterFieldGroup}>
                            <button
                                className={updateTRStyle.minusButton} onClick={decrement}>
                                <MinusSVG />
                            </button>
                            <HRInputField
                                register={register}
                                errors={errors}
                                validationSchema={{
                                    required: 'Please enter current TR',
                                }}
                                label="Update Current TR"
                                name="currentTR"
                                setValue={setValue}
                                type={InputType.NUMBER}
                                placeholder="Enter Current TR"
                                required
                            />
                            <button
                                className={updateTRStyle.plusButton} onClick={increment}>
                                <PlusSVG />
                            </button>
                        </div>
                    </div>
                </div>
                <div className={updateTRStyle.row}>
                    <div
                        className={updateTRStyle.colMd12}>
                        <HRInputField
                            isTextArea={true}
                            label={'Additional Comments'}
                            register={register}
                            name="description"
                            type={InputType.TEXT}
                            placeholder="Enter Additional Comments"
                            rows={'4'}
                            required
                        />
                    </div>
                </div>

                <div className={updateTRStyle.formPanelAction}>
                    <button
                        onClick={() => onCancel()}
                        className={updateTRStyle.btn}>
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={updateTRStyle.btnPrimary}
                        onClick={handleSubmit(onSubmit)}
                    >
                        Increase TR
                    </button>

                </div>

            </div>
        </div>
    );
};

export default UpdateTR;
