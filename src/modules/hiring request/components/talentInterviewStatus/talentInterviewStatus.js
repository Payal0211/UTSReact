import React from "react";
import TalentListStyle from "../talentList/talentList.module.css";
import {
  _isNull,
  addHours,
  defaultEndTime,
  defaultStartTime,
  getInterviewSlotInfo,
  getSlots,
} from "shared/utils/basic_utils";
import {
  InterviewFeedbackStatus,
  TalentOnboardStatus,
} from "constants/application";

export default function TalentInterviewStatus({
  item,
  setProfileRejectedModal,
  setShowFeedback,
  setTalentIndex,
}) {
  return (
    <>
      { !_isNull(item.ClientFeedback) ? (
        <div
          className={TalentListStyle.statusPending}
          style={{ backgroundColor: "#D8F3F2" }}
        >
          <div className={TalentListStyle.statusPendingInner}>
            <div>
              Interview Status: <span>{item?.InterviewStatus}</span>
            </div>
            {(
            //   item?.ClientFeedback === InterviewFeedbackStatus.HIRED ||
            (item?.ClientFeedback === InterviewFeedbackStatus.REJECTED || 
            item?.ClientFeedback === InterviewFeedbackStatus.NOHIRE) && item?.TalentStatusID_BasedOnHR === 7 ) && (
            <span
              onClick={() => {
                setTalentIndex(item?.TalentID);
                setShowFeedback(true);
              }}
              style={{
                textDecoration: "underline",
                color: `var(--background-color-ebony)`,
                cursor: "pointer",
              }}
            >
              {" "}
              View
            </span>
            )}
          </div>
        </div>
      ) : item?.Status === "Rejected" || item?.Status === "NoHire"  ? (
        <div
          className={TalentListStyle.statusReject}
          style={{ backgroundColor: item?.InterviewStatusCode }}
        >
          <div className={TalentListStyle.statusRejectInner}>
            <div>
             Profile {item?.Status} Reason:{" "}
              <span>
                {item?.RejectedReason}
              </span>
            </div>
            <span
              onClick={() => {
                setTalentIndex(item?.TalentID)
                setProfileRejectedModal(true);
              }}
              style={{
                textDecoration: "underline",
                color: `var(--background-color-ebony)`,
                cursor: "pointer",
              }}
            >
              View
            </span>
          </div>
        </div>
      ) : (
        <div
        className={TalentListStyle.statusPending}
        style={{ backgroundColor: "#D8F3F2" }}
      >
        <div className={TalentListStyle.statusPendingInner}>
          <div>
            Interview Status: <span>{item?.InterviewStatus === "" ? "NA" : item?.InterviewStatus}</span>
          </div>
          {(
            // item?.ClientFeedback === InterviewFeedbackStatus.HIRED ||
            (item?.ClientFeedback === InterviewFeedbackStatus.REJECTED || item?.ClientFeedback === InterviewFeedbackStatus.NOHIRE) && item?.TalentStatusID_BasedOnHR === 7  ) && (
            <span
              onClick={() => {
                setTalentIndex(item?.TalentID);
                setShowFeedback(true);
              }}
              style={{
                textDecoration: "underline",
                color: `var(--background-color-ebony)`,
                cursor: "pointer",
              }}
            >
              {" "}
              View
            </span>
            )}
        </div>
      </div>
        // <div className={TalentListStyle.payRate}  style={{ backgroundColor: item?.InterviewStatusCode }}>
        //   <div>
        //     <span>Interview Status:</span>&nbsp;&nbsp;
        //     <span style={{ fontWeight: "500", cursor: "pointer" }}>
        //       {item?.InterviewStatus === "" ? "NA" : item?.InterviewStatus}
        //     </span>
        //   </div>

        //   {(item?.ClientFeedback === InterviewFeedbackStatus.HIRED ||
        //     item?.ClientFeedback === InterviewFeedbackStatus.REJECTED) && (
        //     <span
        //       onClick={() => {
        //         setTalentIndex(item?.TalentID);
        //         setShowFeedback(true);
        //       }}
        //       style={{
        //         textDecoration: "underline",
        //         color: `var(--background-color-ebony)`,
        //         cursor: "pointer",
        //       }}
        //     >
        //       {" "}
        //       View
        //     </span>
        //   )}
        // </div>
            ) }
    </>
  );
}
