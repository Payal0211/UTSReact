import React from 'react';
import stylesOBj from '../scrumStructure//scrumStructure.module.css';
import { Tooltip } from 'antd';

function CompanyCell(props) {
    const {value, data } = props;
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

    return (
        <div className={stylesOBj['company-cell']} style={{ display: 'flex' }} onClick={(e) => e.stopPropagation()}>
            {/* <div style={{ display: 'flex', flexDirection: 'column' }}>
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

          

            <div style={{ display: 'flex' }}>
                <Tooltip title={ isAllowedToToggleDiamond
                            ? isDiamond
                                ? 'Remove Diamond'
                                : 'Add Diamond'
                            : 'Not allowed'}>
                    <button
                    className={stylesOBj['diamond-toggle']}
                    // data-tooltip={
                    //     isAllowedToToggleDiamond
                    //         ? isDiamond
                    //             ? 'Remove Diamond'
                    //             : 'Add Diamond'
                    //         : 'Not allowed'
                    // }
                    onClick={() => {
                        if (!isAllowedToToggleDiamond) return;
                        if (isDiamond) {
                            setShowDiamondRemark(true);
                            setCompanyIdForRemark({ ...data, index: i });
                        } else {
                            setDiamondCompany(data, i);
                        }
                    }}
                >
                    {isDiamond ? (
                        <img
                            src="images/diamond-active-ic.svg"
                            alt="Diamond Active"
                            className={`${stylesOBj['diamond-icon']} ${stylesOBj['diamond-active']}`}
                        />
                    ) : (
                        <img
                            src="images/diamond-ic.svg"
                            alt="Diamond"
                            className={`${stylesOBj['diamond-icon']} ${stylesOBj['diamond-inactive']}`}
                        />
                    )}
                </button>
                </Tooltip>
                

                {userData?.showTADashboardDropdowns && (
                    <Tooltip title={`Add task for TA ${data.taName} in ${data.companyName}`}>
                           <button
                        className={stylesOBj['plus-task-btn']}
                        // data-tooltip={`Add task for TA ${data.taName} in ${data.companyName}`}
                        onClick={() => {
                            setIsAddNewRow(true);
                            setNewTAUserValue(data.tA_UserID);
                            setNewTAHeadUserValue(selectedHead);
                            getCompanySuggestionHandler(data.tA_UserID);
                            setselectedCompanyID(data?.company_ID);
                            getHRLISTForComapny(data?.company_ID);
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M13 0C10.4288 0 7.91543 0.762437 5.77759 2.1909C3.63975 3.61935 1.97351 5.64968 0.989572 8.02512C0.0056327 10.4006 -0.251811 13.0144 0.249797 15.5362C0.751405 18.0579 1.98953 20.3743 3.80762 22.1924C5.6257 24.0105 7.94208 25.2486 10.4638 25.7502C12.9856 26.2518 15.5995 25.9944 17.9749 25.0104C20.3503 24.0265 22.3807 22.3603 23.8091 20.2224C25.2376 18.0846 26 15.5712 26 13C25.9957 9.55351 24.6247 6.2494 22.1876 3.81236C19.7506 1.37532 16.4465 0.00430006 13 0ZM18 14H14V18C14 18.2652 13.8946 18.5196 13.7071 18.7071C13.5196 18.8946 13.2652 19 13 19C12.7348 19 12.4804 18.8946 12.2929 18.7071C12.1054 18.5196 12 18.2652 12 18V14H8.00001C7.73479 14 7.48044 13.8946 7.2929 13.7071C7.10536 13.5196 7.00001 13.2652 7.00001 13C7.00001 12.7348 7.10536 12.4804 7.2929 12.2929C7.48044 12.1054 7.73479 12 8.00001 12H12V8C12 7.73478 12.1054 7.48043 12.2929 7.29289C12.4804 7.10536 12.7348 7 13 7C13.2652 7 13.5196 7.10536 13.7071 7.29289C13.8946 7.48043 14 7.73478 14 8V12H18C18.2652 12 18.5196 12.1054 18.7071 12.2929C18.8946 12.4804 19 12.7348 19 13C19 13.2652 18.8946 13.5196 18.7071 13.7071C18.5196 13.8946 18.2652 14 18 14Z"
                                fill="#8A8A8A"
                            />
                        </svg>
                    </button>
                    </Tooltip>
                 
                )}
            </div> 

                    {value.length <= 15 ? <span className={stylesOBj['company-name']}>{data.companyName}</span> :  <Tooltip title={value}>
                            <span className={stylesOBj['company-name']}>{`${value.slice(0, 15)}...`}</span>
                        </Tooltip>}
             
        </div>
    );
}

export default CompanyCell;
