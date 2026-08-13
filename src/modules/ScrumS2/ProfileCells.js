import React from 'react';

export function ProfileSharedTargetCell(props) {
    const {value, data ,objKey } = props;
    const { setShowProfileTarget, setStartTargetDate, setProfileTargetDetails, startDate, getRowIndex, setTargetValue , isHistory} =
        props.context;

          if (props.node.rowPinned) {
        return value;
            }
    const i = getRowIndex(data);

      if(isHistory){
                    return value ?? ""
                }

    return (
        <div style={{ display: 'flex', justifyContent:'center' }}>
            {data.task_StatusID === 1 ? (
                <p
                    style={{ color: 'blue', fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer', margin: 0 }}
                    onClick={() => {
                         setTargetValue(value)
                        setShowProfileTarget(true);
                        setStartTargetDate(startDate);
                        setProfileTargetDetails({ ...data, index: i });
                    }}
                >
                    {value ?? ""}
                </p>
            ) : (
                value ?? ""
            )}{' '}
            {/* / {data.profile_Shared_Achieved ?? 'NA'} / {data.interview_Scheduled_Target ?? 'NA'} */}
        </div>
    );
}

export function ActiveProfileCountCell(props) {
    const {value , data } = props;

      if (props.node.rowPinned) {
        return value;
            }
    const {
        getRowIndex,
        getTalentProfilesDetailsfromTable,
        setTalentToMove,
        setProfileStatusID,
        setHRTalentListFourCount,
        isHistory
    } = props.context;

      if(isHistory){
                    return  value
                }

    return (
        <p
            style={{ color: 'blue', fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer', margin: 0 , textAlign:"center"}}
            onClick={() => {
                getTalentProfilesDetailsfromTable(data, 0);
                setTalentToMove(data);
                setProfileStatusID(0);
                setHRTalentListFourCount([]);
            }}
        >
            {value?? 0}
        </p> 
    );
}
