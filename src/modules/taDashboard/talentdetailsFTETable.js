import React from 'react'
import taStylesNew from "./n_tadashboardNew.module.css";
import taStyles from "./tadashboard.module.css";
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton'

function TalentdetailsFTETable({ isLoading, talentWiseReport, showDetails }) {
    // console.log("talentWiseReport", talentWiseReport)
    return (
        <div className={`${taStylesNew["table-container"]}`} style={{ marginTop: '10px' }}>

            {isLoading ? <TableSkeleton /> :
                <table className={`${taStylesNew["data-table"]}`}>
                    <thead>
                        <tr>
                            <th>TA</th>
                            <th>GOAL (INR)</th>
                            <th>CARRY <br /> FORWARD PIPELINE (INR) <br />Hold Pipeline </th>
                            <th>CARRY <br /> FORWARD PIPELINE (INR) <br />Pre-Onboarding </th>
                            <th>CARRY <br /> FORWARD PIPELINE (INR) <br />Active </th>
                            <th>Total Carry Fwd <br />Pipeline (INR) </th>
                            <th>Assigned Pipeline (INR)</th>
                            <th>Total Pipeline ( INR )</th>
                            <th>Multiplier of Goal</th>
                            <th>Achieve Pipeline (INR)</th>
                            <th>Lost Pipeline (INR)</th>
                            <th>Hold Pipeline (INR)</th>
                            <th>PreOnboarding Pipeline (INR)</th>

                        </tr>
                    </thead>
                    {/* <TABLEBODYComponent apiData={apiData} /> */}

                    <tbody>
                        {talentWiseReport?.length === 0 ? <tr>
                            <td colSpan={13} style={{ textAlign: "center", padding: "20px" }}>
                                No data available
                            </td>
                        </tr> : talentWiseReport?.map((data, index) => {
                            return <tr key={index}>
                                {/* TA */}
                                <td>{data.taName}</td>
                                {/* GOAL (INR) */}
                                <td>{data.goalRevenueStr}</td>
                                {/* CARRY FORWARD PIPELINE (INR) Hold Pipeline */}
                                <td>
                                    <div
                                        
                                        style={{ cursor: "pointer" , textDecoration: "underline" }}
                                        onClick={() =>
                                            showDetails(
                                                8,
                                                data,
                                                "CARRY FORWARD PIPELINE (INR) Hold Pipeline",
                                                data.carryFwdHoldPipelineStr
                                            )
                                        }
                                    >
                                        {data.carryFwdHoldPipelineStr}
                                    </div>

                                    {/* {data.carryFwdHoldPipelineStr} */}
                                </td>
                                {/* CARRY FORWARD PIPELINE (INR) Pre-Onboarding */}
                                <td>
                                    <div
                                        // className={taStyles.todayText}
                                        style={{  cursor: "pointer" , textDecoration: "underline" }}
                                        onClick={() =>
                                            showDetails(7, data, "CARRY FORWARD PIPELINE (INR) Pre-Onboarding", data.carryFwdPreOnboardPipelineStr)
                                        }
                                    >
                                        {data.carryFwdPreOnboardPipelineStr}
                                    </div>
                                    {/* {data.carryFwdPreOnboardPipelineStr} */}
                                </td>
                                {/* CARRY FORWARD PIPELINE (INR) Active */}
                                <td>
                                    <div
                                        
                                        style={{ textDecoration: "underline", cursor: "pointer" }}
                                        onClick={() =>
                                            showDetails(7, data, "CARRY FORWARD PIPELINE (INR) Active", data.carryFwdActivePipelineStr)
                                        }
                                    >
                                        {data.carryFwdActivePipelineStr}
                                    </div>
                                    {/* {data.carryFwdActivePipelineStr} */}
                                </td>
                                {/* Total Carry Fwd Pipeline (INR) */}
                                <td>
                                    <div
                                        // className={taStyles.todayText}
                                        style={{ textDecoration: "underline", cursor: "pointer" }}
                                        onClick={() =>
                                            showDetails(7, data, " Total Carry Fwd Pipeline (INR)", data.totalCarryFwdStr)
                                        }
                                    >
                                        {data.totalCarryFwdStr}
                                    </div>
                                    {/* {data.totalCarryFwdStr} */}
                                </td>
                                {/* Assigned Pipeline (INR) */}
                                <td>
                                    <div
                                        style={{ cursor: "pointer", textDecoration: "underline" }}
                                        onClick={() =>
                                            showDetails(0, data, "Assigned Pipeline (INR)", data?.actualPipelineStr)
                                        }
                                    >
                                        {data?.actualPipelineStr}
                                    </div>
                                    {/* {data?.actualPipelineStr} */}
                                </td>
                                {/* Total Pipeline (INR) */}
                                <td>
                                    <div
                                       
                                        style={{ cursor: "pointer", textDecoration: "underline" }}
                                        onClick={() =>
                                            showDetails(10, data, "Total Pipeline (INR)", data.totalPipelineStr)
                                        }
                                    >
                                        {data.totalPipelineStr}
                                    </div>
                                     {/* {data.totalPipelineStr} */}
                                </td>
                                {/* Multiplier of Goal */}
                                <td>{data.multiplierOfGoal}</td>
                                {/* Achieve Pipeline (INR) */}
                                <td>
                                    <div
                                        // className={taStyles.todayText}
                                        style={{ cursor: "pointer" , textDecoration: "underline" }}
                                        onClick={() =>
                                            showDetails(3, data, "Achieve Pipeline (INR)", data.achievedPipelineStr)
                                        }
                                    >
                                        {data.achievedPipelineStr}
                                    </div>
                                     {/* {data.achievedPipelineStr} */}
                                </td>
                                {/* Lost Pipeline (INR) */}
                                <td>
                                    <div
                                        // className={taStyles.todayText}
                                        style={{ textDecoration: "underline", cursor: "pointer" }}
                                        onClick={() => showDetails(4, data, "Lost Pipeline (INR)", data.lostPipelineStr)}
                                    >
                                        {data.lostPipelineStr}
                                    </div>
                                     {/* {data.lostPipelineStr} */}
                                </td>
                                {/* Hold Pipeline (INR) */}
                                <td>
                                    <div
                                        // className={taStyles.todayText}
                                        style={{ textDecoration: "underline", cursor: "pointer" }}
                                        onClick={() => showDetails(5, data, "Hold Pipeline (INR)", data.holdPipelineStr)}
                                    >
                                        {data.holdPipelineStr}
                                    </div>
                                    {/* {data.holdPipelineStr} */}
                                </td>
                                {/* PreOnboarding Pipeline (INR) */}
                                <td>
                                     <div
                                    // className={taStyles.todayText}
                                    style={{ textDecoration: "underline", cursor: "pointer" }}
                                    onClick={() =>
                                        showDetails(6, data, "PreOnboarding Pipeline (INR)", data.preOnboardingPipelineStr)
                                    }
                                >
                                    {data.preOnboardingPipelineStr}
                                </div>
                                  {/* {data.preOnboardingPipelineStr} */}
                                </td>
                            </tr>
                        })}


                        {talentWiseReport?.length > 0 && <tr key={'total'} className={taStylesNew["row-total"]}>
                            {/* TA */}
                            <td>Total</td>
                            {/* GOAL (INR) */}
                            <td>{talentWiseReport[0]?.total_GoalStr}</td>
                            {/* CARRY FORWARD PIPELINE (INR) Hold Pipeline */}
                            <td>{talentWiseReport[0]?.total_CarryFwdHoldPipelineStr}</td>
                            {/* CARRY FORWARD PIPELINE (INR) Pre-Onboarding */}
                            <td>{talentWiseReport[0]?.total_CarryFwdPreOnboardPipelineStr}</td>
                            {/* CARRY FORWARD PIPELINE (INR) Active */}
                            <td>{talentWiseReport[0]?.total_CarryFwdActivePipelineStr}</td>
                            {/* Total Carry Fwd Pipeline (INR) */}
                            <td>{talentWiseReport[0]?.total_TotalCarryFwdStr}</td>
                            {/* Assigned Pipeline (INR) */}
                            <td>{talentWiseReport[0]?.total_ActualPipelineStr}</td>
                            {/* Total Pipeline (INR) */}
                            <td>{talentWiseReport[0]?.total_TotalPipelineStr}</td>
                            {/* Multiplier of Goal */}
                            <td>{''}</td>
                            {/* Achieve Pipeline (INR) */}
                            <td>{talentWiseReport[0]?.total_AchievedPipelineStr}</td>
                            {/* Lost Pipeline (INR) */}
                            <td>{talentWiseReport[0]?.total_LostPipelineStr}</td>
                            {/* Hold Pipeline (INR) */}
                            <td>{talentWiseReport[0]?.total_HoldPipelineStr}</td>
                            {/* PreOnboardingPipeline (INR) */}
                            <td>{talentWiseReport[0]?.total_PreOnboardingPipelineStr}</td>
                        </tr>}


                    </tbody> </table>}
        </div>
    )
}

export default TalentdetailsFTETable