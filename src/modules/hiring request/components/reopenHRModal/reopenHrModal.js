import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Radio, message } from "antd";

import reopenHRStyle from "./reopenHRModal.module.css";
import { HRDeleteType, HiringRequestHRStatus } from "constants/application";
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import { InputType } from "constants/application";
import { hiringRequestDAO } from "core/hiringRequest/hiringRequestDAO";
import { HTTPStatusCode } from "constants/network";
import SpinLoader from "shared/components/spinLoader/spinLoader";

export default function ReopenHrModal({ setUpdateTR, onCancel, apiData }) {
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    setError,
    remove,
    reset,
    formState: { errors },
  } = useForm();
  const [radioValue, setRadioValue] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleReopen = async (d) => {
    let data = { hrID: apiData.HR_Id, updatedTR: apiData?.HRStatusCode === HiringRequestHRStatus.COMPLETED ? d.talent : radioValue ? d.talent : apiData.ClientDetail.NoOfTalents };
    setIsLoading(true);
    const response = await hiringRequestDAO.ReopenHRDAO(data);
    if (response?.statusCode === HTTPStatusCode.OK) {
      onCancel();
      window.location.reload();
    }
    if(response?.statusCode === HTTPStatusCode.BAD_REQUEST){
      setError('talent',{message: response?.responseBody } )
    }
    setIsLoading(false);
  };

  const onChangeRadioBtn = useCallback(
    (e) => {
      setRadioValue(e.target.value);
      remove();
      clearErrors();
      reset();
    },
    [clearErrors, remove, reset]
  );

  return (
    <div className={reopenHRStyle.engagementModalContainer}>
      <div className={reopenHRStyle.updateTRTitle}>
        <h2>Reopen HR</h2>
        <p>{apiData?.ClientDetail?.HR_Number}</p>
      </div>

      {/* <h4 className={reopenHRStyle.infoMsg}>{valueInfo}</h4> */}

      {isLoading ? (
        <SpinLoader />
      ) : apiData?.HRStatusCode === HiringRequestHRStatus.COMPLETED ? (
        <div className={reopenHRStyle.row}>
          <div className={reopenHRStyle.colMd12}>
            <HRInputField
              label={"New TR"}
              register={register}
              name="talent"
              type={InputType.NUMBER}
              placeholder="Enter New TR"
              errors={errors}
              validationSchema={{
                validate: (value) => {
                  if (`${value}` <= apiData.ClientDetail.NoOfTalents) {
                    return "TR cannot be reduced";
                  }
                },
              }}
              required={
                apiData?.HRStatusCode === HiringRequestHRStatus.COMPLETED
              }
            />
          </div>
        </div>
      ) : (
        <>
          <div className={reopenHRStyle.row}>
            Do you want to reopen this HR with ?
          </div>
          <div className={reopenHRStyle.row}>
            <Radio.Group
              className={reopenHRStyle.radioGroup}
              onChange={onChangeRadioBtn}
              value={radioValue}
            >
              <Radio value={false}>Same TR</Radio>
              <Radio value={true}>Updated TR</Radio>
            </Radio.Group>
          </div>
          {radioValue && (
            <div className={reopenHRStyle.row}>
              <div className={reopenHRStyle.colMd12}>
                <HRInputField
                  label={"New TR"}
                  register={register}
                  name="talent"
                  type={InputType.NUMBER}
                  placeholder="Enter New TR"
                  errors={errors}
                  validationSchema={{
                    validate: (value) => {
                      if (`${value}` <= apiData.ClientDetail.NoOfTalents) {
                        return value
                          ? "TR cannot be reduced"
                          : "TR cannot be blank";
                      }
                    },
                  }}
                  required={
                    apiData?.HRStatusCode !== HiringRequestHRStatus.COMPLETED &&
                    radioValue
                  }
                />
              </div>
            </div>
          )}
        </>
      )}

      <div className={reopenHRStyle.formPanelAction}>
        <button
          onClick={() => {
            onCancel();
          }}
          className={reopenHRStyle.btn}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={reopenHRStyle.btnPrimary}
          onClick={handleSubmit(handleReopen)}
        >
          Reopen
        </button>
      </div>
    </div>
  );
}
