import React , { useState,useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import stylesOBj from './n_tadashboard.module.css'
import taStylesNew from "./n_tadashboardNew.module.css";
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton'
import { TaDashboardDAO } from "core/taDashboard/taDashboardDRO";
import { HTTPStatusCode } from "constants/network";
import UTSRoutes from 'constants/routes';

function DashboardTableComp({searchText, tableFilteredState , selectedHead}) {
    const navigate = useNavigate()
    const [TaListData, setTaListData] = useState([]);
    const [isLoading,setIsLoading] = useState(false)

  function groupByRowSpan(data, groupField) {
    const grouped = {};

    // Step 1: Group by the field (e.g., 'ta')
    data.forEach((item) => {
      const key = item[groupField];
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });

    // Step 2: Add rowSpan metadata
    const finalData = [];
    Object.entries(grouped).forEach(([key, rows]) => {
      rows.forEach((row, index) => {
        finalData.push({
          ...row,
          rowSpan: index === 0 ? rows.length : 0,
        });
      });
    });

    return finalData;
  }

     const getListData = useCallback(async () => {
        let pl = {
          taUserIDs: tableFilteredState?.filterFields_OnBoard?.taUserIDs,
          roleTypeIDs: tableFilteredState?.filterFields_OnBoard?.roleTypeIDs,
          hrStatusIDs: tableFilteredState?.filterFields_OnBoard?.hrStatusIDs,
          taskStatusIDs: tableFilteredState?.filterFields_OnBoard?.taskStatusIDs,
          modelType: tableFilteredState?.filterFields_OnBoard?.modelType,
          priority: tableFilteredState?.filterFields_OnBoard?.priority,
          searchText: searchText,
          taHeadUserIDs: `${selectedHead}`,
        };
        setIsLoading(true);
        const result = await TaDashboardDAO.getAllTATaskListRequestDAO(pl);
        setIsLoading(false);

        if (result.statusCode === HTTPStatusCode.OK) {
          setTaListData(groupByRowSpan(result.responseBody, "taName"));
        } else if (result.statusCode === HTTPStatusCode.NOT_FOUND) {
          setTaListData([]);
        } else if (result?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
          // setLoading(false);
          return navigate(UTSRoutes.LOGINROUTE);
        } else if (result?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
          // setLoading(false);
          return navigate(UTSRoutes.SOMETHINGWENTWRONG);
        } else {
          return "NO DATA FOUND";
        }
      }, [tableFilteredState, selectedHead, searchText, navigate]);

        useEffect(() => {
          if (selectedHead.length !== 0) {
            getListData();
          }
        }, [searchText, tableFilteredState, selectedHead]);

  return (
    <div className={`${taStylesNew["table-container"]}`} style={{marginTop:'20px'}}>

                        {isLoading ? <TableSkeleton /> :
                            <table className={`${taStylesNew["data-table"]}`}>
                                <thead>
                                    <tr>
                                        <th >TA Name</th>
                                        <th>COMPANY Name</th>
                                        <th>HR TITLE / ID</th>
                                        <th>PRIORITY</th>
                                        <th>INTERVIEW <br/> ROUNDS</th>
                                        <th>AM</th>
                                       <th>NBD/EXISTING</th>
                                       <th>PRICING MODEL</th>
                                       <th>TALENT PAY RATE</th>
                                       <th>NR %</th>
                                       <th>NR (USD)</th>
                                       <th>BILL RATE</th>
                                       <th>ACTIVE TRS</th>
                                       <th>CONTRACTOR/EOR</th>
                                       <th>TASK FOR AM'S</th>
                                       <th>TASK FOR TR'S</th>
                                       <th>ACTIVE <br/> PROFILES</th>
                                       <th>LATEST COMMUNICATION AND UPDATES</th>
                                       
                                    </tr>
                                </thead>
                                {/* <TABLEBODYComponent apiData={apiData} /> */}

                                <tbody>
                                  { TaListData.length === 0 ? <tr>
                                    <td colSpan={19} style={{ textAlign: "center", padding: "20px" }}>
                                      No data available
                                    </td>
                                  </tr> : TaListData.map((data , ind)=>{

                                    return <tr>
                                        {/* TA Name */}
                                        <td>{data.taName}</td>
                                        {/* COMPANY Name */}
                                        <td>{data.companyName}</td>
                                        {/* HR TITLE / ID */}
                                        <td>  <>
                                                    {data.hrTitle} /{" "}
                                                    <p
                                                      style={{
                                                        color: "blue",
                                                        fontWeight: "bold",
                                                        textDecoration: "underline",
                                                        cursor: "pointer",
                                                      }}
                                                      onClick={() => {
                                                        window.open(
                                                          UTSRoutes.ALLHIRINGREQUESTROUTE +
                                                          `/${data.hiringRequest_ID}`,
                                                          "_blank"
                                                        );
                                                      }}
                                                    >
                                                      {data.hrNumber}
                                                    </p>
                                                  </></td>
                                        {/* PRIORITY */}
                                        <td>{data.task_Priority}</td>
                                        {/* INTERVIEW ROUNDS */}
                                        <td>{data.no_of_InterviewRounds}</td>
                                        {/* AM */}
                                        <td>{data.am}</td>
                                        {/* NBD/EXISTING */}
                                        <td>{data.businessType}</td>
                                         {/* PRICING MODEL */}
                                         <td>{data.pricingModel}</td>
                                        {/* TALENT PAY RATE */}
                                        <td>{data.talent_AnnualCTC_Budget_INRValueStr}</td>
                                          {/* NR % */}
                                          <td>{data.uplersFeesPer}</td>
                                        {/* NR (USD) */}
                                        <td>{data.revenue_On10PerCTCStr}</td>
                                        {/* BILL RATE */}
                                        <td>{data.totalRevenue_NoofTalentStr}</td>
                                         {/* ACTIVE TRS */}
                                         <td>{data.activeTR}</td>
                                        {/* CONTRACTOR/EOR */}
                                        <td>{data.modelType}</td>
                                        {/* TASK FOR AM'S */}
                                        <td>{data.amTask}</td>
                                         {/* TASK FOR TR'S */}
                                         <td>{data.taTask}</td>
                                        {/* ACTIVE PROFILES */}
                                        <td>{data.noOfProfile_TalentsTillDate}</td>
                                        {/* LATEST COMMUNICATION AND UPDATES */}
                                        <td><div dangerouslySetInnerHTML={{__html:data.latestNotes}}></div></td>
                                    </tr>
                                  })}  
                                     </tbody> </table>}
                    </div>
  )
}

export default DashboardTableComp