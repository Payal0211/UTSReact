import React, { useCallback, useEffect, useState } from 'react';

const CloneHR = ({ cloneHRhandler, onCancel, getHRnumber }) => {
    return (
        <div>
            <h1>Are you sure want to clone HR {getHRnumber}</h1>
            <button onClick={() => cloneHRhandler()}>Ok</button>
            <button onClick={() => onCancel()}>Cancel</button>
        </div>
    );
};

export default CloneHR;
