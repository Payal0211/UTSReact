import React from 'react';
import { All_Hiring_Request_Utils } from 'shared/utils/all_hiring_request_util';
import stylesOBj from './scrumStructure.module.css';

export function HrStatusCell(props) {
    const { data } = props;
    return <div style={{display:'flex',justifyContent:'center'}}>{All_Hiring_Request_Utils.GETHRSTATUS(data?.tA_HR_StatusID, data?.tA_HR_Status)}</div>;
}

export function LatestNotesCell(props) {
    const { value,data } = props;
    const { AddComment, getRowIndex } = props.context;
    const i = getRowIndex(data);

    return (
        <div style={{lineHeight:'20px'}}>{data?.latestNotesTopRow?.length > 50 ? `${data?.latestNotesTopRow?.slice(0,50)}...`: data?.latestNotesTopRow}</div>
        // <button
        //     className={stylesOBj['cell-add-btn']}
        //     onClick={(e) => {
        //         e.stopPropagation();
        //         AddComment(data, i);
        //     }}
        // >
        //     {data?.latestNotes ? 'View / Edit' : 'Add'}
        // </button>
    );
}

export function LatestTouchCell (props){
    const { value,data } = props;
    const { AddComment, getRowIndex } = props.context;
    const i = getRowIndex(data);

    return (
        <div style={{lineHeight:'20px'}}>{value?.length > 50 ? `${value?.slice(0,50)}...`: value}</div>
        // <button
        //     className={stylesOBj['cell-add-btn']}
        //     onClick={(e) => {
        //         e.stopPropagation();
        //         AddComment(data, i);
        //     }}
        // >
        //     {data?.latestNotes ? 'View / Edit' : 'Add'}
        // </button>
    );
}
