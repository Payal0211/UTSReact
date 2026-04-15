import React from 'react'
import stylesOBj from './n_tadashboard.module.css'
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton'

function TalentdetailsFTETable({ isLoading, talentWiseReport }) {
  return (
      <div className={`${stylesOBj["table-container"]}`}>

                        {isLoading ? <TableSkeleton /> :
                            <table className={`${stylesOBj["data-table"]}`}>
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
                                          <td>{data.ta}</td>
                                          <td>{data.revenueGoal}</td>
                                          <td>{data.totalCarryForwardPipeline}</td>
                                          <td>{data.currentMonthPipeline}</td>
                                          <td>{data.totalPipelineInAMonthToPlay}</td>
                                          <td>{data.multiplierOfGoal}</td>
                                          <td>{data.numberProfilesShared}</td>
                                          <td>{data.noOfR1InterviewCompletedCurrentMonth}</td>
                                          <td>{data.noOfR2InterviewCompletedCurrentMonth}</td>
                                          <td>{data.noOfR3InterviewCompletedCurrentMonth}</td>
                                          <td>{data.profileToR1Ratio}</td>
                                          <td>{data.noOfTalentsRejectedInInterview}</td>
                                          <td>{data.noOfOffers}</td>
                                          <td>{data.offerDropoutBackout}</td>
                                          <td>{data.interviewDoneToSelectedI2S}</td>
                                          <td>{data.numberOfOfferSignedDirectPlacement}</td>
                                          <td>{data.offerSignedRevenue}</td>
                                          <td>{data.numberOfJoinedTalentsInTheMonth}</td>
                                          <td>{data.joiningRevenue}</td>
                                          <td>{data.goalVsAchived}</td>
                                          <td>{data.totalPipelineToJoiningPercentage}</td>
                                        </tr>
                                    })}

                                   
                                   
                                     </tbody> </table>}
                    </div>
  )
}

export default TalentdetailsFTETable