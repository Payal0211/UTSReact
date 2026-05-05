import React from 'react'
import taStylesNew from "./n_tadashboardNew.module.css";
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton'
function TalentdetailsTable({isLoading,talentWiseReport}) {
  return (
      
                    <div className={`${taStylesNew["table-container"]}`}>

                        {isLoading ? <TableSkeleton /> :
                            <table className={`${taStylesNew["data-table"]}`}>
                                <thead>
                                    <tr>
                                        
                                        <th>RECRUITER</th>
                                        <th>TALENT</th>
                                        <th>COMPANY</th>
                                        <th>HR ID</th>
                                        <th>POSITION</th>
                                        <th>NBD/EXISTING</th>
                                        <th>SOW SIGNED DATE</th>
                                        <th>JOINING DATE</th>
                                        <th>STATUS</th>
                                        <th>DP / CONTRACT</th>
                                        <th>TALENT PAYrATE</th>
                                        <th>NR% / DP%</th>
                                        <th>DP (INR)</th>
                                        <th>NR(USD)</th>
                                        <th>BILL RATE</th>
                                        {/* <th>DP / MONTH (USD)</th> */}
                                        <th>TOTAL ACHIEVEMENT VALUE</th>
                                        <th>MONTH WISE</th>
                                        {/* <th>BACKOUT</th> */}
                                        <th>CLOSURE MONTH</th>
                                    </tr>
                                </thead>
                                {/* <TABLEBODYComponent apiData={apiData} /> */}

                                <tbody>
                                    {talentWiseReport.length === 0 ? <tr>
                                        <td colSpan={19} style={{ textAlign: "center", padding: "20px" }}>
                                            No data available
                                        </td>
                                    </tr> : talentWiseReport.map((data, index)=>{
                                        return <tr>
                                           
                                            {/* RECRUITER */}
                                            <td>{data.taUser}</td>
                                            {/* TALENT NAME */}
                                            <td>{data.talentName}</td>
                                            {/* COMPANY NAME */}
                                            <td>{data.companyName}</td>
                                            {/* HR ID */}
                                            <td>{data.hrid}</td>
                                            {/* POSITION NAME */}
                                            <td>{data.positionName}</td>
                                            {/* NBD/EXISTING */}
                                            <td>{data.businessType}</td>
                                            {/* SOW SIGNED DATE */}
                                            <td>{data.sowSignedDate}</td>
                                            {/* JOINING DATE */}
                                            <td>{data.joiningDate}</td>
                                            {/* STATUS */}
                                            <td>{data.status}</td>
                                            {/* DP / CONTRACT */}
                                            <td>{data.typeOfHR}</td>
                                            {/* TALENT PAYrATE */}
                                            <td>{data.talentPayRate}</td>
                                            {/* NR% / DP% */}
                                            <td>{data.dP_NR_Per}</td>
                                            {/* DP (INR) */}
                                            <td>{data.dP_INR}</td>
                                            {/* NR(USD) */}
                                            <td>{data.nR_USD}</td>
                                            {/* BILL RATE */}
                                            <td>{data.billRate}</td>
                                            {/* DP / MONTH (USD) */}
                                            {/* <td>{'na'}</td> */}
                                            {/* TOTAL ACHIEVEMENT VALUE */}
                                            <td>{data.totalAchievementValue}</td>
                                            {/* MONTH WISE */}
                                            <td>{data.joinMonthWise}</td>
                                            {/* BACKOUT */}
                                            {/* <td>{'na'}</td> */}
                                            {/* CLOSURE MONTH */}
                                            <td>{data.closureMonthWise}</td>
                                            

                                        </tr>
                                    })}
                                     </tbody> </table>}
                    </div>
  )
}

export default TalentdetailsTable