import React from 'react'
import stylesOBj from './n_tadashboard.module.css'
import taStylesNew from "./n_tadashboardNew.module.css";
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton'

function FTECountTable({ isLoading, countData }) {
  return (
       <div className={`${taStylesNew["table-container"]}`}>

                        {isLoading ? <TableSkeleton /> :
                            <table className={`${taStylesNew["data-table"]}`}>
                                <thead>
                                    <tr>
                                        <th >CARRY FWD <br/> PIPELINE (INR)</th>
                                        <th>CARRY FWD NOT <br/> INCLUDED PIPELINE (INR)</th>
                                        <th>ADDED HR (NEW)</th>
                                        <th>ACHIEVED PIPELINE (INR)</th>
                                        <th>LOST PIPELINE (INR)</th>
                                        <th>TOTAL ACTIVE PIPELINE (INR)</th>
                                           <th>TODAY TOTAL PROFILE <br/> SHEARED TARGET</th>
                                        <th>TODAY TOTAL PROFILE <br/> SHEARED ACHIEVED</th>
                                        <th>TODAY TOTAL L1 <br/> ROUND SCHEDULED</th>
                                        <th>YESTERDAY TOTAL PROFILE <br/> SHEARED TARGET</th>
                                         <th>YESTERDAY TOTAL PROFILE <br/> SHEARED ACHIEVED</th>
                                          <th>YESTERDAY TOTAL L1 <br/> ROUND SCHEDULED</th>
                                       
                                    </tr>
                                </thead>
                                {/* <TABLEBODYComponent apiData={apiData} /> */}

                                <tbody>
                                    {countData.length === 0 ? <tr>
                                        <td colSpan={12} style={{ textAlign: "center", padding: "20px" }}>
                                            No data available
                                        </td>
                                    </tr> : countData.map((data, index)=>{
                                        return <tr>
                                          {/* CARRY FWD PIPELINE (INR) */}
                                          <td>{data.carryFwdPipeLineStr}</td>
                                          
                                          {/* CARRY FWD NOT INCLUDED PIPELINE (INR) */}
                                          <td>{data.carryFwdHoldPipelineStr}</td>
                                          
                                          {/* ADDED HR (NEW) */}
                                          <td>{data.activeHRPipeLine}</td>
                                          
                                          {/* ACHIEVED PIPELINE (INR) */}
                                          <td>{data.achievedHRPipeLineStr}</td>
                                          
                                          {/* LOST PIPELINE (INR) */}
                                          <td>{data.lostHRPipeLineStr}</td>
                                          
                                          {/* TOTAL ACTIVE PIPELINE (INR) */}
                                          <td>{data.totalActivePipeLineStr}</td>
                                          
                                          {/* TODAY TOTAL PROFILE SHEARED TARGET */}
                                          <td>{data.today_ProfilesharedTarget}</td>
                                          
                                          {/* TODAY TOTAL PROFILE SHEARED ACHIEVED */}
                                          <td>{data.today_ProfilesharedAchieved}</td>
                                          
                                          {/* TODAY TOTAL L1 ROUND SCHEDULED */}
                                          <td>{data.today_L1Round}</td>
                                          
                                          {/* YESTERDAY TOTAL PROFILE SHEARED TARGET */}
                                          <td>{data.yesterday_ProfilesharedTarget}</td>
                                          
                                          {/* YESTERDAY TOTAL PROFILE SHEARED ACHIEVED */}
                                          <td>{data.yesterday_ProfilesharedAchieved}</td>
                                          
                                          {/* YESTERDAY TOTAL L1 ROUND SCHEDULED */}
                                          <td>{data.yesterday_L1Round}</td>

                                        </tr>
                                    })}

                                   
                                   
                                     </tbody> </table>}
                    </div>
  )
}

export default FTECountTable