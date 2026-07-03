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
    const isDiamond = data?.companyCategory === 'Diamond';
    const isAllowedToToggleDiamond =
        userData?.UserId === 2 ||
        userData?.UserId === 333 ||
        userData?.UserId === 190 ||
        userData?.UserId === 96;
    return (<>
     {/* <div style={{ display: 'flex',  }}>
                <button
                    onClick={() => moveRowUp(i, data)}
                    disabled={i === 0}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: i === 0 ? 'not-allowed' : 'pointer',
                        color: i === 0 ? '#ccc' : '#666',
                    }}
                >
                    ▲
                </button>
                <button
                    onClick={() => moveRowDown(i, data)}
                    disabled={i === taListData.length - 1}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: i === taListData.length - 1 ? 'not-allowed' : 'pointer',
                        color: i === taListData.length - 1 ? '#ccc' : '#666',
                    }}
                >
                    ▼
                </button>
            
            </div> */}
     <a
            href={`/allhiringrequest/${data?.hiringRequest_ID}`}
            target="_blank"
            rel="noreferrer"
            className={stylesOBj['hr-id']}
            onClick={(e) => e.stopPropagation()}
        >
            {value}
        </a>
     
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
