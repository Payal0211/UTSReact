import { InputType } from 'constants/application';
import HRInputField from 'modules/hiring request/components/hrInputFields/hrInputFields';
import HRSelectField from 'modules/hiring request/components/hrSelectField/hrSelectField';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import profileRejected from './profileRejected.module.css';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { HTTPStatusCode } from 'constants/network';

const ProfileRejectedModal = ({
	getBillRateInfo,
	// register,
	// errors,
	// handleSubmit,
	setHRapiCall,
	callHRapi,
	onCancel,
	talentInfo,
	callAPI,
	hrId,
	filterTalentID,
}) => {
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm();

	
	return (
		<div className={profileRejected.rejectionModalContainer}>
			<div
				className={profileRejected.headingContainer}>
				<h2>Suninda Solutions Pvt. Ltd.</h2>
				<div>Client Name : <span>Ankur Bhambri</span></div>
				<div>HD ID : <span className={profileRejected.ModalLink}>HR5489563986</span></div>
				<div>Status : <span>Profile Rejected</span></div>
			</div>
			<div className={profileRejected.rejectMessageContainer}>
				<div className={profileRejected.row}>
					<div className={profileRejected.colMd12}>
						<label>Rejection Reason</label>
						<p>Other</p>
						<label>Loss Remarks</label>
						<p>We have found that the specific skills, knowledge, and expertise required for the Front End position are not adequately represented in their application.</p>
						<label>Other Reason</label>
						<p>We have found that the specific skills, knowledge, and expertise required for the Front End position are not adequately represented in their application.</p>
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
