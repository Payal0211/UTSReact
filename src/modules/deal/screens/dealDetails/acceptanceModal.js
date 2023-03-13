import React, { useCallback, useEffect, useState } from 'react';
import AcceptanceStyle from './acceptanceStyle.module.css';
import { InputType } from 'constants/application';
import { ReactComponent as NextWeekPriorityStar } from 'assets/svg/nextWeekPriorityStar.svg';
import { ReactComponent as ListIcon } from 'assets/svg/listArrowIcon.svg';
import { Radio } from 'antd';

const AcceptanceModal = ({ setAcceptanceModal, workShift, setWorkShift, acceptOffer, setAcceptOffer, preference, setPreference }) => {

    const workShiftChange = (e) => {
        setWorkShift(e.target.value);
    }

    const acceptOfferChange = (e) => {
        setAcceptOffer(e.target.value);
    }

    const preferenceChange = (e) => {
        setPreference(e.target.value);
    }

    const closeAcceptanceModal = () => {
        setAcceptanceModal(false);
    }
    return (
        <div className={AcceptanceStyle.acceptanceModal}>
            <div className={AcceptanceStyle.acceptanceModalTitle}>
                <h2>
                    Talent Acceptance
                </h2>
            </div>

            <div className={AcceptanceStyle.acceptanceHeadInfo}>
                <ul>
                    <li>HR ID - HR081222024440</li>
                    <li>Talent - Velma Balaji Reddy</li>
                    <li>Company - Microsoft Corp Pvt. Ltd.</li>
                    <li>Role - UX/UI Designer</li>
                </ul>
                <div className={AcceptanceStyle.acceptanceHeadInfoAction}>
                    <button className={AcceptanceStyle.acceptanceHeadActionBtn}>
                        <NextWeekPriorityStar />
                    </button>
                    <div className={AcceptanceStyle.acceptanceHeadActionLabel}>
                        Profile Shared
                    </div>
                </div>
            </div>

            <div className={AcceptanceStyle.accptConfirmProceed}>
                <p>
                    The following are your preferences, if you confirm them we will proceed with an interview.
                </p>
                <div className={AcceptanceStyle.accptConfirmProceedList}>
                    <ul>
                        <li>
                            <ListIcon className={AcceptanceStyle.listIcon} />
                            <h3>You will be required to work full shifts - 9:00 AM to 5:00 PM EST. Will you agree to this schedule?</h3>
                            <Radio.Group
                                defaultValue={0}
                                onChange={workShiftChange}
                                value={workShift}
                                className={AcceptanceStyle.listRadioGroup}>
                                <Radio value={1}>Yes, I agree.</Radio>
                            </Radio.Group>
                        </li>
                        <li>
                            <ListIcon className={AcceptanceStyle.listIcon} />
                            <h3>Your joining date must be within 15 days to accept this offer. Please update or accept a join date of more than 60 days in order to maintain your preferences on the system.</h3>
                            <Radio.Group
                                defaultValue={0}
                                onChange={acceptOfferChange}
                                value={acceptOffer}
                                className={AcceptanceStyle.listRadioGroup}>
                                <Radio value={1}>Yes, please update it to 15 Days from existing only for this position.</Radio>
                                <Radio value={2}>Yes, please update it to 15 Days from my current preference for this position and for future as well.</Radio>
                                <Radio value={3}>No, I want to keep it more than 60 days</Radio>
                            </Radio.Group>
                        </li>
                        <li>
                            <ListIcon className={AcceptanceStyle.listIcon} />
                            <h3>
                                Does this full-time position suit your stated preferences?
                            </h3>
                            <Radio.Group
                                defaultValue={0}
                                onChange={preferenceChange}
                                value={preference}
                                className={AcceptanceStyle.listRadioGroup}>
                                <Radio value={1}>Yes, I am interested in this position and would like to move forward with the application</Radio>
                                <Radio value={2}>No, I am not interested in this position as it doesn’t match with my preferences.</Radio>
                            </Radio.Group>
                        </li>
                    </ul>
                </div>
            </div>

            <div className={AcceptanceStyle.acceptanceNotes}>
                <ul>
                    <li>Once you accept an offer, there are no further chances to back out.</li>
                    <li>After accepting this job, you may not work with or approach the client for six months</li>
                </ul>
            </div>
            <div className={AcceptanceStyle.acceptanceAction}>
                <button type="submit" className={AcceptanceStyle.btnPrimary}>
                    Save Preference and Apply
                </button>
                <button type="submit" className={AcceptanceStyle.btn} onClick={closeAcceptanceModal}>Cancel</button>
            </div>
        </div >
    );
};

export default AcceptanceModal;