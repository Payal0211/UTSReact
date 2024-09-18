import React, { useEffect, useState } from "react";
import reopenHRStyle from "../reopenHRModal/reopenHRModal.module.css";
import { hiringRequestDAO } from "core/hiringRequest/hiringRequestDAO";
import { HTTPStatusCode } from "constants/network";
import { Skeleton } from "antd";

function RePostHRModal({ onCancel, apiData, handleReopen }) {
  const [details, setDetails] = useState({});
  const [isLoading , setisLoading] = useState(false)

  const fetchHRDetails = async (hrId) => {
    setisLoading(true)
    let response = await hiringRequestDAO.fetchrepostDetails(hrId);
    if (response?.statusCode === HTTPStatusCode.OK) {
      setDetails(response.responseBody[0]);
    }
    setisLoading(false)
  };

  useEffect(() => {
    if (apiData?.HR_Id) {
      fetchHRDetails(apiData?.HR_Id);
    }
  }, [apiData?.HR_Id]);

  return (
    <div className={reopenHRStyle.engagementModalContainer}>
        { isLoading ? <Skeleton active /> :

        <>
          <div className={reopenHRStyle.updateTRTitle}>
        <h2>Repost HR</h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            {/* <p>{apiData?.ClientDetail?.HR_Number}</p> */}
            <p>
              Reopening this job post will make it active again, allowing
              candidates to apply.
            </p>
          </div>

          <div className={reopenHRStyle.creditTab}>
            <p>Available Credit:</p>
            <b> {details?.availableCredits}</b>
          </div>
        </div>
      </div>

      <div className={reopenHRStyle.colMd12} style={{ marginBottom: "10px" }}>
        {details?.jobPostingCredits} Credits Deducted
      </div>
      <div className={reopenHRStyle.colMd12} style={{ marginBottom: "10px" }}>
        {details?.repostingMessage}{" "}
        <strong> {details?.newExpirationDate} </strong>
      </div>

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
          onClick={handleReopen}
        >
          Repost
        </button>
      </div></>
        }
    
    </div>
  );
}

export default RePostHRModal;
