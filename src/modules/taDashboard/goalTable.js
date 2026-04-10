import React, { useState, useEffect, useRef } from 'react'
import stylesOBj from './n_tadashboard.module.css'
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton'
import moment from 'moment'
import { TaDashboardDAO } from "core/taDashboard/taDashboardDRO";
import { HTTPStatusCode } from "constants/network";
function GoalTableComp({selectedHead,startDate,tableFilteredState}) {
    const [goalLoading,setgoalLoading] = useState(false)
     const [goalList, setGoalList] = useState([]);

       const getGoalsDetails = async (date, head, tA_UserID) => {
         let pl = {
           taUserIDs: tA_UserID,
           taHeadID: head,
           targetDate: moment(date).format("YYYY-MM-DD"),
         };
         setgoalLoading(true);
         const goalResult = await TaDashboardDAO.GetTATargetsDetails_ContractRequestDAO(pl);
         setgoalLoading(false);
     
         if (goalResult.statusCode === HTTPStatusCode.OK) {
           setGoalList(goalResult.responseBody);
         } else {
           setGoalList([]);
         }
       };
     
       useEffect(() => {
         if (selectedHead) {
           getGoalsDetails(
             startDate,
             selectedHead,
             tableFilteredState.filterFields_OnBoard.taUserIDs
           );
         }
       }, [selectedHead, startDate, tableFilteredState]);
  return (
      <div className={`${stylesOBj["table-container"]}`} style={{marginTop:'20px'}}>

                        {goalLoading ? <TableSkeleton /> :
                            <table className={`${stylesOBj["data-table"]}`}>
                                <thead>
                                    <tr>
                                        <th >TA</th>
                                        <th>COMPANY</th>
                                        <th>HR TITLE</th>
                                        <th>PROFILER SHARED TARGET</th>
                                        <th>PROFILE SHARED ACHIEVE</th>
                                        <th>L1 INTERVIEWS SCHEDULED</th>
                                       
                                    </tr>
                                </thead>
                                {/* <TABLEBODYComponent apiData={apiData} /> */}

                                <tbody>
                                  {goalList.length === 0 ? <tr>
                                    <td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
                                      No data available
                                    </td>
                                  </tr> : goalList.map((data , ind)=>{

                                    return <tr>
                                        <td>{data.ta}</td>
                                        <td>{data.company}</td>
                                        <td>{data.hrTitle}</td>
                                        <td>{data.profiles_Shared_Target}</td>
                                        <td>{data.profiles_Shared_Achieved}</td>
                                        <td>{data.interviews_Done_Target}</td>
                                    </tr>
                                  })}  
                                     </tbody> </table>}
                    </div>
  )
}

export default GoalTableComp