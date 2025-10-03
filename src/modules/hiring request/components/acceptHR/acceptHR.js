import { Divider, Radio, Select, Input } from "antd";
import Modal from "antd/lib/modal/Modal";
import AcceptHRStyle from "./acceptHR.module.css";
import { useCallback, useState } from "react";
import HRInputField from "../hrInputFields/hrInputFields";
import { InputType } from "constants/application";
import { hiringRequestDAO } from "core/hiringRequest/hiringRequestDAO";
import { HTTPStatusCode } from "constants/network";
import { useLocation } from "react-router-dom";
import SpinLoader from "shared/components/spinLoader/spinLoader";
const { TextArea } = Input;

const AcceptHR = ({ apiData, hrID, openModal, cancelModal }) => {
  const [showMoreInfo, setMoreInfo] = useState(false);
  const [rejectionValue, setRejectionValue] = useState({});
  const [otherReason, setOtherReason] = useState("");
  const [isValid, setIsValid] = useState(true);
 
  const switchLocation = useLocation();
  const [actionType, setActionType] = useState("Accept");
  const [isLoading, setIsLoading] = useState(false);
  let urlSplitter = `${switchLocation.pathname.split("/")[2]}`;
  const acceptHRHandler = async (d) => {
    let isFormValid = true;

    if (actionType === "Reject") {
      if (Object.keys(rejectionValue).length === 0) {
        isFormValid = false;
      }

      if (
        (rejectionValue?.id === 7 || rejectionValue?.id === 0) &&
        otherReason.trim() === ""
      ) {
        isFormValid = false;
      }
    }
    setIsValid(isFormValid);
    if (!isFormValid) return;

    setIsLoading(true);
    let acceptHRObject = {
      HRID: urlSplitter,
      AcceptValue: actionType === "Accept" ? "1" : null,
      Reason:
        actionType === "Reject"
          ? rejectionValue?.id === 0 || rejectionValue?.id === 7
            ? otherReason
            : rejectionValue?.value
          : "",
      Reason_ID: actionType === "Reject" ? rejectionValue?.id : "",
      isInternal: false,
    };
  
    setIsLoading(false);
    const response = await hiringRequestDAO.acceptHRRequestDAO(
    	acceptHRObject,
    );
    if (response?.statusCode === HTTPStatusCode.OK) {
    	setIsLoading(false);
    	cancelModal();
    	window.location.reload(false);
    }
  };

  const waitForMoreInfoHandler = useCallback(
    async (d) => {
      setIsLoading(true);
      let acceptHRObject = {
        HRID: urlSplitter,
        AcceptValue: "2",
        Reason: d.acceptHRDetails,
        isInternal: false,
      };

      const response = await hiringRequestDAO.acceptHRRequestDAO(
        acceptHRObject
      );
      if (response?.statusCode === HTTPStatusCode.OK) {
        setIsLoading(false);
        cancelModal();
        window.location.reload(false);
      }
    },
    [cancelModal, urlSplitter]
  );

  return (
    <Modal
      width="864px"
      centered
      footer={false}
      open={openModal}
      onCancel={cancelModal}
    >
      <div className={AcceptHRStyle.container}>
        <div className={AcceptHRStyle.modalTitle}>
          <h2>Accept HR</h2>
          <span className={AcceptHRStyle.paragraph}>{hrID}</span>
        </div>
        <Divider style={{ borderTop: "1px solid #E8E8E8" }} />
        {isLoading ? (
          <SpinLoader />
        ) : (
          <div className={AcceptHRStyle.transparent}>
            {/* <p className={AcceptHRStyle.paragraph}>
							If you have complete clarity for this HR, then kindly accept the
							HR”. */}
            {/* If you have complete clarity for this HR, then kindly accept the
							HR. If you need more clarity on this HR, then change the Status to
							“Waiting for more information”. */}
            {/* </p> */}
            {/* {showMoreInfo && ( */}

            <div className={AcceptHRStyle.colMd12}>
              <Radio.Group
                onChange={(e) => {
                  setActionType(e.target.value);
                  setIsValid(true);
                  setRejectionValue({});
                  setOtherReason("");
                }}
                value={actionType}
              >
                <Radio value={"Accept"}>Accept HR</Radio>
                <Radio value={"Reject"}>Reject</Radio>
              </Radio.Group>
            </div>

            {actionType === "Reject" && (
              <>
                <div className={AcceptHRStyle.colMd12}>
                  <Select
                    required
                    getPopupContainer={(trigger) => trigger.parentElement}
                    name="roleIDOther"
                    label="Access Type"
                    defaultValue="Choose Rejection Reason"
                    //   value={rejectionValue}
                    onChange={(selectedValue, val) => {
                      setRejectionValue(val);
                    }}
                    options={apiData?.HRNotAcceptedReasons?.map((item) => ({
                      id: item.ID,
                      value: item.Reason,
                    }))}
                  />
                  {!isValid && Object.keys(rejectionValue).length === 0 && (
                    <span style={{ color: "red" }}>
                      Please select rejection reason
                    </span>
                  )}
                </div>
                {(rejectionValue?.id === 7 || rejectionValue?.id === 0) && (
                  <div className={AcceptHRStyle.colMd12}>
                    <TextArea
                      rows={4}
                      placeholder="Other Reason"
                      className={AcceptHRStyle.TextArea}
                      value={otherReason}
                      onChange={(e) => {
                        setOtherReason(e.target.value);
                      }}
                    />

                    {!isValid && otherReason.trim() === "" && (
                      <span style={{ color: "red" }}>
                        Please provide reason
                      </span>
                    )}
                  </div>
                )}
              </>
            )}

            {/* )} */}

            <div className={AcceptHRStyle.formPanelAction}>
              <button
                onClick={() => acceptHRHandler()}
                className={AcceptHRStyle.btnPrimary}
              >
                {actionType} HR
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AcceptHR;
