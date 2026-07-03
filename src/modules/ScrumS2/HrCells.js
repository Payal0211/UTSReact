import React from 'react';
import { Tooltip } from 'antd';
import stylesOBj from '../scrumStructure/scrumStructure.module.css';

export function HrIdCell(props) {
    const { value, data } = props;
       const {
        taListData,
        selectedHead,
        userData,
        moveRowUp,
        moveRowDown,
        canMoveDown,
        canMoveUp,
        getRowIndex,
        setDiamondCompany,
        setShowDiamondRemark,
        setCompanyIdForRemark,
        setIsAddNewRow,
        setNewTAUserValue,
        setNewTAHeadUserValue,
        getCompanySuggestionHandler,
        setselectedCompanyID,
        getHRLISTForComapny,
    } = props.context;

       const i = getRowIndex(data);


  
    return (<>
     <div style={{ display: 'flex',  }}>
                <button
                    onClick={() => moveRowUp(i, data)}
                    disabled={!canMoveUp(i,taListData)}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: canMoveUp(i,taListData) ? "pointer" : "not-allowed",
                                color: canMoveUp(i,taListData) ? "#666" : "#ccc",
                            }}
                >
                    ▲
                </button>
                <button
                    onClick={() => moveRowDown(i, data)}
                   disabled={!canMoveDown(i,taListData)}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: canMoveDown(i,taListData) ? "pointer" : "not-allowed",

                                color: canMoveDown(i,taListData) ? "#666" : "#ccc",
                            }}
                >
                    ▼
                </button>
               <a
            href={`/allhiringrequest/${data?.hiringRequest_ID}`}
            style={{marginLeft:'5px'}}
            target="_blank"
            rel="noreferrer"
            className={stylesOBj['hr-id']}
            onClick={(e) => e.stopPropagation()}
        >
            {value}
        </a>
     
            </div>
  
    </>
      
    );
}

export function HrTitleCell(props) {
    const { value } = props;
    if (!value) return null;
    if (value.length <= 20) return <span>{value}</span>;
    return (
        <Tooltip title={value}>
            <span>{`${value.slice(0, 20)}...`}</span>
        </Tooltip>
    );
}
