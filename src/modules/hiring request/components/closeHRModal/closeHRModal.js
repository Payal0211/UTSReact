import { InputType } from "constants/application";
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import React, { useCallback, useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import closeHRStyle from "./closeHRModal.module.css";
import { useParams } from "react-router-dom";
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
  const [count, setCount] = useState(0);
  const [disable, setDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [validationDetails, setValidationDetails] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  console.log("HR details", closeHRDetail.HR_Id);
  const [valueInfo, setValueInfo] = useState("");
  const [btnText, setBtnText] = useState("");

  const onSubmit = async () => {
    setIsLoading(true);
    // call close HR API
    setIsLoading(false);
  };

  const getHRCloseValidation = useCallback(
    async (hrID) => {
      setIsLoading(true);
      const response = await hiringRequestDAO.getCloseHRValidation(hrID);

      if (response?.statusCode === HTTPStatusCode.OK) {
        let HRResult = response.responseBody.details.close_HR_Result[0];
        console.log("HR close validation", HRResult);
        setValueInfo(HRResult?.message);
        setBtnText(HRResult?.btnmessage);
      }
      setIsLoading(false);
    },
    [closeHRDetail.HR_Id]
  );

  useEffect(() => {
    // call for details with ID
    getHRCloseValidation(closeHRDetail.HR_Id);
    return () => setIsLoading(false);
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
