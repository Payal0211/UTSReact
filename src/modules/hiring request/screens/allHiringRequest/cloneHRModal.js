import React, { useCallback, useEffect, useState } from 'react';
import CloneHRModal from "../allHiringRequest/cloneHRModal.module.css"

const CloneHR = ({ cloneHRhandler, onCancel, getHRnumber }) => {
    return (
        <div className={CloneHRModal.cloneHRConfContent}>
            <h2>Are you sure want to clone HR {getHRnumber}</h2>
            <button onClick={() => cloneHRhandler()}>Ok</button>
            <button onClick={() => onCancel()} className={CloneHRModal.btnPrimary}>Cancel</button>
        </div>
    );
};

export default CloneHR;
