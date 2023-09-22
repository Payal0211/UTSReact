import { InputType } from "constants/application";
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import React, { useCallback, useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import closeHRStyle from "./closeHRModal.module.css";
import { HTTPStatusCode } from "constants/network";
import SpinLoader from "shared/components/spinLoader/spinLoader";
import { hiringRequestDAO } from "core/hiringRequest/hiringRequestDAO";

const CloseHRModal = ({
  closeHR,
  setUpdateTR,
  onCancel,
  closeHRDetail,
  apiData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // console.log("HR details", closeHRDetail.HR_Id);
  const [valueInfo, setValueInfo] = useState("");
  const [btnText, setBtnText] = useState("");

  const onSubmit = async (data) => {
    setIsLoading(true);
    // call close HR API
    let request ={
      "id": closeHRDetail.HR_Id,
      "remark": data.reasonForClose,
    }
    const response = await hiringRequestDAO.CloseHRDAO(request);
    if (response?.statusCode === HTTPStatusCode.OK) {
      onCancel()
      window.location.reload()
    }
    setIsLoading(false);
  };

  const getHRCloseValidation = useCallback(
    async (hrID) => {
      setIsLoading(true);
      const response = await hiringRequestDAO.getCloseHRValidation(hrID);

      if (response?.statusCode === HTTPStatusCode.OK) {
        let HRResult = response.responseBody.details.close_HR_Result[0];
        setValueInfo(HRResult?.message);
        setBtnText(HRResult?.btnmessage);
      }
      setIsLoading(false);
    },
    [closeHRDetail.HR_Id]
  );

  useEffect(() => {
    getHRCloseValidation(closeHRDetail.HR_Id);
  }, [closeHRDetail.HR_Id]);
  return (
    <div className={closeHRStyle.engagementModalContainer}>
      <div className={closeHRStyle.updateTRTitle}>
        <h2>Close HR</h2>
        <p>{closeHRDetail?.ClientDetail?.HR_Number}</p>
      </div>

      <h4 className={closeHRStyle.infoMsg}>{valueInfo}</h4>

      {isLoading ? (
        <SpinLoader />
      ) : (
        <>
          <div className={closeHRStyle.row}>
            <div className={closeHRStyle.colMd12}>
              <HRInputField
                isTextArea={true}
                label={"Reason for Close HR"}
                register={register}
                name="reasonForClose"
                type={InputType.TEXT}
                placeholder="Enter Reason for Close HR"
                errors={errors}
                validationSchema={{
                  validate: (value) => {
                    if (!value) {
                      return "Please enter the reason for Close HR.";
                    }
                  },
                }}
                rows={"4"}
                required
              />
            </div>
          </div>
          <div className={closeHRStyle.formPanelAction}>
            <button
              onClick={() => {
                onCancel();
              }}
              className={closeHRStyle.btn}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={closeHRStyle.btnPrimary}
              onClick={handleSubmit(onSubmit)}
            >
              {btnText}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CloseHRModal;
