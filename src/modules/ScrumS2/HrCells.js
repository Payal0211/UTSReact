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
        DragButtonComp
    } = props.context;

       const i = getRowIndex(data);

console.log(value,i ,taListData.findIndex((r) => r.id === data.id), )
  console.log(
    data.companyName,
    "index:", i,
    "actual:",
    taListData.findIndex(x => x.id === data.id)
);
    return (<>
     <div style={{ display: 'flex',  }}>
              {/* <DragButtonComp data={data} /> */}
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
