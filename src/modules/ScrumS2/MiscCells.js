import React from 'react';
import { All_Hiring_Request_Utils } from 'shared/utils/all_hiring_request_util';
import stylesOBj from '../scrumStructure/scrumStructure.module.css';

export function HrStatusCell(props) {
    const { data } = props;
    return <>{All_Hiring_Request_Utils.GETHRSTATUS(data?.tA_HR_StatusID, data?.tA_HR_Status)}</>;
}

export function LatestNotesCell(props) {
    const { data } = props;
    const { AddComment, getRowIndex } = props.context;
    const i = getRowIndex(data);

    return (
        <button
            className={stylesOBj['cell-add-btn']}
            onClick={(e) => {
                e.stopPropagation();
                AddComment(data, i);
            }}
        >
            {data?.latestNotes ? 'View / Edit' : 'Add'}
        </button>
    );
}
