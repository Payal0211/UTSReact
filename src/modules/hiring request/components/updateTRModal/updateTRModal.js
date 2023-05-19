import { InputType } from 'constants/application';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import React, { useCallback, useEffect, useState } from 'react';
import { set, useForm } from 'react-hook-form';
import updateTRStyle from './updateTR.module.css';
import { ReactComponent as MinusSVG } from 'assets/svg/minus.svg';
import { ReactComponent as PlusSVG } from 'assets/svg/plus.svg';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { useParams } from 'react-router-dom';
import { HTTPStatusCode } from 'constants/network';
import { Modal } from 'antd';

const UpdateTR = ({ updateTR, setUpdateTR, onCancel, updateTRDetail, apiData }) => {
    const [count, setCount] = useState(0)
    const [disable, setDisable] = useState(true)
    console.log(disable, "disable")
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm();

    const currentTR = watch("currentTR")

    const additionalComments = watch("additionalComments")

    const reasonForLoss = watch("reasonForLoss")

    const id = useParams()

    const [valueInfo, setValueInfo] = useState("")
    const tempData = localStorage.setItem("isSubmitted", true)
    const isGetSubmitted = localStorage.getItem("isSubmitted")
    const onSubmit = async () => {
        if (updateTRDetail?.ClientDetail?.NoOfTalents <= count) {
            let data = {
                noOfTR: count,
                hiringRequestId: Number(id?.hrid),
                addtionalRemarks: additionalComments,
                reasonForLossCancelled: "",
                isFinalSubmit: true
            }
            const response = await hiringRequestDAO.editTRDAO(data)

            if (response.responseBody.statusCode === HTTPStatusCode.OK) {
                setValueInfo(response?.responseBody?.details)
                onCancel()
                window.location.reload()
            }
        } else if (updateTRDetail?.ClientDetail?.NoOfTalents > count) {
            let data = {
                noOfTR: count,
                hiringRequestId: Number(id?.hrid),
                addtionalRemarks: additionalComments,
                reasonForLossCancelled: reasonForLoss,
                isFinalSubmit: valueInfo ? Boolean(isGetSubmitted) : false
            }
            const response = await hiringRequestDAO.editTRDAO(data)
            if (response.responseBody.statusCode === HTTPStatusCode.OK) {
                setValueInfo(response?.responseBody?.details)
                if (valueInfo && Boolean(isGetSubmitted)) {
                    onCancel()
                    window.location.reload()
                }
            }
        }

    }
    useEffect(() => {
        if (updateTRDetail?.ClientDetail?.NoOfTalents > count || valueInfo) {
            setValue("currentTR", updateTRDetail?.ClientDetail?.NoOfTalents)
            setCount(updateTRDetail?.ClientDetail?.NoOfTalents)
        } else if (updateTRDetail?.ClientDetail?.NoOfTalents <= count) {
            setValue("currentTR", updateTRDetail?.ClientDetail?.NoOfTalents)
            setCount(updateTRDetail?.ClientDetail?.NoOfTalents)
        }
    }, [updateTRDetail?.ClientDetail?.NoOfTalents])


    const increment = () => {
        setCount(count + 1)
        setDisable(false)
    }
    const decrement = () => {
        if (count > 0) {
            setCount(count - 1)
            setDisable(false)
        }
    }
    return (
        <div className={updateTRStyle.engagementModalContainer}
        >
            <div className={updateTRStyle.updateTRTitle}>
                <h2>Update TR</h2>
                <p>HR ID - {updateTRDetail?.ClientDetail?.HR_Number} | Current TR: <span>{updateTRDetail?.ClientDetail?.NoOfTalents}</span></p>
            </div>

            <h4 className={updateTRStyle.infoMsg}>{valueInfo}</h4>

            {!valueInfo && (

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
                                value={count}
                                onChangeHandler={(e) => { setCount(parseInt(e.target.value)); setDisable(false); }}
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
            )}

            {(updateTRDetail?.ClientDetail?.NoOfTalents <= count || isNaN(count) || valueInfo) && (
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
            )}

            {(updateTRDetail?.ClientDetail?.NoOfTalents > count && !valueInfo) && (
                <div className={updateTRStyle.row}>
                    <div
                        className={updateTRStyle.colMd12}>
                        <HRInputField
                            isTextArea={true}
                            label={'Reason for Loss/Cancelled'}
                            register={register}
                            name="reasonForLoss"
                            type={InputType.TEXT}
                            placeholder="Enter Reason for Loss/Cancelled"
                            rows={'4'}
                            required
                        />
                    </div>
                </div>
            )}

            <div className={updateTRStyle.formPanelAction}>
                <button
                    onClick={() => { onCancel(); window.location.reload() }}
                    className={updateTRStyle.btn}>
                    Cancel
                </button>
                {updateTRDetail?.ClientDetail?.NoOfTalents <= count ? (

                    <button
                        type="submit"
                        className={updateTRStyle.btnPrimary}
                        onClick={handleSubmit(onSubmit)}
                        disabled={disable === true ? true : false}
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

    );
};

export default UpdateTR;
