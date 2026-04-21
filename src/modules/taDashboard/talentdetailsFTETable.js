import React from 'react'
import taStylesNew from "./n_tadashboardNew.module.css";
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton'

function TalentdetailsFTETable({ isLoading, talentWiseReport }) {
    console.log("talentWiseReport", talentWiseReport)
  return (
      <div className={`${taStylesNew["table-container"]}`} style={{ marginTop: '10px' }}>

                        {isLoading ? <TableSkeleton /> :
                            <table className={`${taStylesNew["data-table"]}`}>
                                <thead>
                                    <tr>
                                        <th>TA</th>
                                        <th>REVENUE GOAL</th>
                                        <th>TOTAL CARRY <br/> FORWARD PIPELINE</th>
                                        <th>CUR. MONTH  <br/>PIPELINE (INR)</th>
                                        <th>TOTAL PIPELINE <br/> IN A MONTH TO PLAY</th>
                                        <th>MULTIPLIER OF GOAL</th>
                                        <th>NUMBER PROFILES <br/> SHARED</th>
                                        <th>NO. OF R1 INTERVIEW <br/> COMPLETED (CURRENT MONTH)</th>
                                        <th>NO. OF R2 INTERVIEW <br/> COMPLETED (CURRENT MONTH)</th>
                                        <th>NO. OF R3 INTERVIEW <br/> COMPLETED (CURRENT MONTH)</th>
                                        <th>PROFILE TO <br/> R1 RATIO</th>
                                        <th>NO. OF TALENTS <br/> REJECTED IN INTERVIEW</th>
                                        <th>NO. OF OFFERS</th>
                                        <th>OFFER DROPOUT / <br/>BACKOUT</th>
                                        <th>INTERVIEW DONE TO<br/> SELECTED (I2S %)</th>
                                        <th>NUMBER OF OFFER <br/> SIGNED (DIRECT PLACEMENT)</th>
                                        <th>OFFER SIGNED <br/> REVENUE</th>
                                        <th># OF JOINED TALENTS <br/> IN THE MONTH</th>
                                        <th>JOINING <br/> REVENUE</th>
                                        <th>GOAL VS  <br/>ACHIVED</th>
                                        <th>TOTAL PIPELINE <br/> TO JOINING %</th>
                                    </tr>
                                </thead>
                                {/* <TABLEBODYComponent apiData={apiData} /> */}

                                <tbody>
                                    {talentWiseReport?.length === 0 ? <tr>
                                        <td colSpan={21} style={{ textAlign: "center", padding: "20px" }}>
                                            No data available
                                        </td>
                                    </tr> : talentWiseReport?.map((data, index)=>{
                                        return <tr key={index}>
                                          {/* TA */}
                                          <td>{data.taName}</td>
                                          {/* REVENUE GOAL */}
                                          <td>{data.revenueGoal}</td>
                                          {/* TOTAL CARRY FORWARD PIPELINE */}
                                          <td>{data.total_CarryFwdPreOnboardPipelineStr}</td>
                                          {/* CUR. MONTH PIPELINE (INR) */}
                                          <td>{data.total_CurrentMonthActualPipelineStr}</td>
                                          {/* TOTAL PIPELINE IN A MONTH TO PLAY */}
                                          <td>{data.totalPipelineInAMonthToPlay}</td>
                                          {/* MULTIPLIER OF GOAL */}
                                          <td>{data.multiplierOfGoal}</td>
                                          {/* NUMBER PROFILES SHARED */}
                                          <td>{data.numberProfilesShared}</td>
                                          {/* NO. OF R1 INTERVIEW COMPLETED (CURRENT MONTH) */}
                                          <td>{data.noOfR1InterviewCompletedCurrentMonth}</td>
                                          {/* NO. OF R2 INTERVIEW COMPLETED (CURRENT MONTH) */}
                                          <td>{data.noOfR2InterviewCompletedCurrentMonth}</td>
                                          {/* NO. OF R3 INTERVIEW COMPLETED (CURRENT MONTH) */}
                                          <td>{data.noOfR3InterviewCompletedCurrentMonth}</td>
                                          {/* PROFILE TO R1 RATIO */}
                                          <td>{data.profileToR1Ratio}</td>
                                          {/* NO. OF TALENTS REJECTED IN INTERVIEW */}
                                          <td>{data.noOfTalentsRejectedInInterview}</td>
                                          {/* NO. OF OFFERS */}
                                          <td>{data.noOfOffers}</td>
                                          {/* OFFER DROPOUT / BACKOUT */}
                                          <td>{data.offerDropoutBackout}</td>
                                          {/* INTERVIEW DONE TO SELECTED (I2S %) */}
                                          <td>{data.interviewDoneToSelectedI2S}</td>
                                          {/* NUMBER OF OFFER SIGNED (DIRECT PLACEMENT) */}
                                          <td>{data.numberOfOfferSignedDirectPlacement}</td>
                                          {/* OFFER SIGNED REVENUE */}
                                          <td>{data.offerSignedRevenue}</td>
                                          {/* # OF JOINED TALENTS IN THE MONTH */}
                                          <td>{data.numberOfJoinedTalentsInTheMonth}</td>
                                          {/* JOINING REVENUE */}
                                          <td>{data.joiningRevenue}</td>
                                          {/* GOAL VS ACHIVED */}
                                          <td>{data.goalVsAchived}</td>
                                          {/* TOTAL PIPELINE TO JOINING % */}
                                          <td>{data.totalPipelineToJoiningPercentage}</td>
                                        </tr>
                                    })}

                                   
                                   
                                     </tbody> </table>}
                    </div>
  )
}

export default TalentdetailsFTETable