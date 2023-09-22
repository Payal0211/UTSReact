import React, { useCallback, useEffect, useState } from 'react';
import profileRejected from './profileRejected.module.css';
import {
	_isNull,
  } from "shared/utils/basic_utils";

const ProfileRejectedModal = ({
	talentIndex,
	onCancel,
	details
}) => {
	
const {
	talentDetail,
	clientDetail,
	hiringRequestNumber,
} = details

	const currentTalent = talentDetail.filter(talent => talent.TalentID === talentIndex)[0]
	// console.log({currentTalent , talentIndex})
	return (
		<div className={currentTalent?.Status === "On Hold"
		? profileRejected.rejectionModalContainerOnHold  :profileRejected.rejectionModalContainerCancelled
		
		  } >
			<div
				className={profileRejected.headingContainer}>
				<h2>{clientDetail.CompanyName}</h2>
				<div>Client Name : <span>{clientDetail.ClientName}</span></div>
				<div>HR ID : <span className={profileRejected.ModalLink}>{hiringRequestNumber}</span></div>
				<div>Status : <span>Profile {currentTalent?.Status}</span></div>
			</div>
			<div className={profileRejected.rejectMessageContainer}>
				<div className={profileRejected.row}>
					<div className={profileRejected.colMd12}>
						<label>Profile {currentTalent?.Status} Reason</label>
						<p>{currentTalent?.Status === "Cancelled"
                  ? currentTalent?.CancelledReason
                  : currentTalent?.Status === "On Hold"
                  ? currentTalent?.OnHoldReason
                  : currentTalent?.RejectedReason}</p>

				  { !_isNull(currentTalent?.TalentRemarks)  &&  <><label>Loss Remarks</label>
						<p>{currentTalent?.TalentRemarks}</p></>}

					{!_isNull(currentTalent?.TalentOtherReason) && <><label>Other Reason</label>
						<p>{currentTalent?.TalentOtherReason}</p></>}	
						
					</div>
					
				</div>
			</div>
			<div>
				<div className={profileRejected.formPanelAction}>
					<button
						type="submit"						
						className={profileRejected.btnPrimary}
						onClick={() => onCancel()}>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default ProfileRejectedModal;
