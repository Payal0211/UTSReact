import React, { useCallback, useEffect, useState } from "react";
import changeDateStyle from "./changeDate.module.css";
import moment from "moment";

const SLAHistory = ({ history, onCancel, hrSLADetails }) => {
  return (
    <div className={changeDateStyle.engagementModalContainer}>
      <div className={changeDateStyle.updateTRTitle}>
        <h2>Edit History </h2>
        <div
          className={changeDateStyle.StepscreeningBox}
          style={{ width: "250px" }}
        >
          Profile Review ETA:
          <b>{hrSLADetails.length && hrSLADetails[6].slaDate}</b> |{" "}
          <span
            className={
              hrSLADetails.length && hrSLADetails[6].slaStatus === "ON Time"
                ? changeDateStyle.screeningColorGreen
                : changeDateStyle.screeningColorOrange
            }
          >
            {hrSLADetails.length && hrSLADetails[6].slaStatus}
          </span>
        </div>
      </div>

      <>
        <div>
          {history.length ? (
            history.map((data) => (
              <div className={changeDateStyle.historyContainer}>
                <p>{moment(data.createdByDateTime).format("Do MMM")}</p>
                <div className={changeDateStyle.historyInnerContainer}>
                  <p>
                    SLA ETA Changed from "
                    {moment(data.prevSLADate).format("Do MMM")}" to "
                    {moment(data.slaDate).format("Do MMM")}"
                  </p>
                  <p>Reason : {data.reason}</p>
                  {data.reason === "Other" && <p>{data.otherReason}</p>}
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center" }}>
              {" "}
              <p>
                <b>No History Found</b>
              </p>{" "}
            </div>
          )}
        </div>

        <div className={changeDateStyle.formPanelAction}>
          <button
            onClick={() => {
              onCancel();
            }}
            className={changeDateStyle.btnPrimary}
          >
            Cancel
          </button>
        </div>
      </>
    </div>
  );
};

export default SLAHistory;
