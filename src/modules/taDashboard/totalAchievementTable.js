import React from 'react'
import stylesOBj from './n_tadashboard.module.css'
import taStylesNew from "./n_tadashboardNew.module.css";
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton'
function TotalAchievementTable({isLoading,quarterlySummeryReport}) {
  return (
   <div className={`${taStylesNew["table-container"]}`}>

                        {isLoading ? <TableSkeleton /> :
                            <table className={`${taStylesNew["data-table"]}`}>
                                <thead>
                                    <tr>
                                        <th style={{ minWidth: '160px' }}>RECRUITER NAME</th>
                                        <th>{quarterlySummeryReport.length > 0 ? quarterlySummeryReport[0].month3Name : ''}</th>
                                        <th>{quarterlySummeryReport.length > 0 ? `${quarterlySummeryReport[0].month3Name.split("'")[0]} %` : ''}</th>
                                        <th>{quarterlySummeryReport.length > 0 ? quarterlySummeryReport[0].month2Name : ''}</th>
                                        <th>{quarterlySummeryReport.length > 0 ? `${quarterlySummeryReport[0].month2Name.split("'")[0]} %` : ''}</th>
                                        <th>{quarterlySummeryReport.length > 0 ? quarterlySummeryReport[0].month1Name : ''}</th>
                                        <th>{quarterlySummeryReport.length > 0 ? `${quarterlySummeryReport[0].month1Name.split("'")[0]} %` : ''}</th>
                                        <th>Grand Total</th>
                                        <th>Grand Total %</th>
                                        <th>Average</th>
                                       
                                    </tr>
                                </thead>
                                {/* <TABLEBODYComponent apiData={apiData} /> */}

                                <tbody>
                                    {quarterlySummeryReport.length === 0 ? <tr>
                                        <td colSpan={10} style={{ textAlign: "center", padding: "20px" }}>
                                            No data available
                                        </td>
                                    </tr> : quarterlySummeryReport.map((data, index)=>{
                                        return <tr>
                                            {/* RECRUITER NAME */}
                                            <td>{data.recruiterName}</td>
                                            {/* m3 */}
                                            <td>{data.month3RevenueStr}</td>
                                            {/* m3 % */}
                                            <td>{data.month3Per}</td>
                                            {/* m2 */}
                                            <td>{data.month2RevenueStr}</td>
                                            {/* m2 % */}
                                            <td>{data.month2Per}</td>
                                            {/* m1 */}
                                            <td>{data.month1RevenueStr}</td>
                                            {/* m1 % */}
                                            <td>{data.month1Per}</td>
                                            {/* grand total */}
                                            <td>{data.recruiterWiseGrandTotalStr}</td>
                                            {/* grand total % */}
                                            <td style={{backgroundColor:data.color}}>{data.recruiterWiseGrandTotalPercent}</td>
                                            {/* average */}
                                            <td>{data.averageRevenueStr}</td>
                                          
                                           
                                            

                                        </tr>
                                    })}

                                    {quarterlySummeryReport.length > 0 &&  <tr className={taStylesNew["row-total"]}>
                                            {/* RECRUITER NAME */}
                                            <td>{'Grand Total'}</td>
                                            {/* m3 */}
                                            <td>{quarterlySummeryReport[0]?.month3WiseGrandTotalStr}</td>
                                            {/* m3 % */}
                                            <td>{quarterlySummeryReport[0]?.month3WiseGrandTotalPercent}</td>
                                            {/* m2 */}
                                            <td>{quarterlySummeryReport[0]?.month2WiseGrandTotalStr}</td>
                                            {/* m2 % */}
                                            <td>{quarterlySummeryReport[0]?.month2WiseGrandTotalPercent}</td>
                                            {/* m1 */}
                                            <td>{quarterlySummeryReport[0]?.month1WiseGrandTotalStr}</td>
                                            {/* m1 % */}
                                            <td>{quarterlySummeryReport[0]?.month1WiseGrandTotalPercent}</td>
                                            {/* grand total */}
                                            <td>{quarterlySummeryReport[0]?.totalRecruiterWiseGrandTotalStr}</td>
                                            {/* grand total % */}
                                            <td>{quarterlySummeryReport[0]?.totalRecruiterWiseGrandTotalPercent}</td>
                                            {/* average */}
                                            <td>{quarterlySummeryReport[0]?.recruiterGrandTotalAverageStr}</td>
                                          
                                           
                                            

                                        </tr>}
                                   
                                     </tbody> </table>}
                    </div>
  )
}

export default TotalAchievementTable