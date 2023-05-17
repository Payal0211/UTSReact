import { InputType } from 'constants/application';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import updateTRStyle from './updateTR.module.css';
import { ReactComponent as MinusSVG } from 'assets/svg/minus.svg';
import { ReactComponent as PlusSVG } from 'assets/svg/plus.svg';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { useParams } from 'react-router-dom';
import { HTTPStatusCode } from 'constants/network';

const UpdateTR = ({ updateTR, setUpdateTR, onCancel }) => {
    const [count, setCount] = useState(0)
    console.log(count, "countcountcountcount")
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm();

    const currentTR = watch("currentTR")
    console.log(currentTR, "currentTR")
    const additionalComments = watch("additionalComments")
    const id = useParams()

    const [valueInfo, setValueInfo] = useState("")
    // console.log(response.responseBody?.details.split(" ")?.[0], "dsds")

    const onSubmit = async () => {
        let data = {
            noOfTR: currentTR,
            hiringRequestId: Number(id?.hrid),
            addtionalRemarks: additionalComments,
            reasonForLossCancelled: "",
            isFinalSubmit: true
        }
        const response = await hiringRequestDAO.editTRDAO(data)
        if (response.statusCode === HTTPStatusCode.OK) {
            setValueInfo(response?.responseBody?.details)
            onCancel()
            window.location.reload()
        }
    }
    console.log(watch("additionalComments"), "valueInfo")
    useEffect(() => {
        setValue("currentTR", count)
        // setValue("additionalComments", watch("additionalComments"))
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
                <p>Current TR</p>
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
                            name="additionalComments"
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
                    {count || currentTR || additionalComments ? (

                        <button
                            type="submit"
                            className={updateTRStyle.btnPrimary}
                            onClick={handleSubmit(onSubmit)}
                        >
                            Submit
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className={updateTRStyle.btnPrimary}
                            onClick={handleSubmit(onSubmit)}
                        >
                            Decrease TR
                        </button>
                    )}

                </div>

            </div>
        </div>
    );
};

export default UpdateTR;
