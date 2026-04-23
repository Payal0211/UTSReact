import React , { useState,useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import stylesOBj from './n_tadashboard.module.css'
import taStyles from "./tadashboard.module.css";
import taStylesNew from "./n_tadashboardNew.module.css";
import {
    Select, InputNumber,
    Tooltip, Table, Checkbox, message,  Skeleton, Modal
} from "antd";
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton'
import { TaDashboardDAO } from "core/taDashboard/taDashboardDRO";
import { HTTPStatusCode } from "constants/network";
import UTSRoutes from 'constants/routes';

const { Option } = Select;

function DashboardTableComp({searchText, tableFilteredState , selectedHead,filtersList}) {
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


         const updateTARowValue = async (value, key, params, index, targetValue) => {
                let pl = {
                    tA_UserID: params.tA_UserID,
                    company_ID: params.company_ID,
                    hiringRequest_ID: params.hiringRequest_ID,
                    task_Priority: params.task_Priority,
                    no_of_InterviewRounds: params.no_of_InterviewRounds,
                    role_TypeID: params.role_TypeID,
                    task_StatusID: params.task_StatusID,
                    activeTR: params.activeTR,
                    talent_AnnualCTC_Budget_INRValue: params.talent_AnnualCTC_Budget_INRValue,
                    modelType: params.modelType,
                    tA_HR_StatusID: params.tA_HR_StatusID,
                    tA_Head_UserID: `${selectedHead}`,
                };

                let npl = {

                }
        
                if (key === "role_TypeID") {
                    pl[key] = value?.id;
                    setTaListData((prev) => {
                        let newDS = [...prev];
                        newDS[index] = {
                            ...newDS[index],
                            [key]: value?.id,
                            role_Type: value?.data,
                        };
                        return newDS;
                    });
                } else if (key === "task_StatusID") {
                    pl[key] = value?.id;
                    setTaListData((prev) => {
                        let newDS = [...prev];
                        let nob = {
                            ...newDS[index],
                            [key]: value?.id,
                            taskStatus: value?.data,
                        };
                        newDS[index] = nob;
                        return newDS;
                    });
                } else if (key === "tA_HR_StatusID") {
                    pl[key] = value?.id;
                    setTaListData((prev) => {
                        let newDS = [...prev];
                        newDS[index] = {
                            ...newDS[index],
                            [key]: value?.id,
                            tA_HR_Status: value?.data,
                        };
                        return newDS;
                    });
                } else {
                    pl[key] = value;
                    setTaListData((prev) => {
                        let newDS = [...prev];
                        newDS[index] = { ...newDS[index], [key]: value };
                        return newDS;
                    });
                }
                let updateresult = await TaDashboardDAO.updateTAListRequestDAO(pl);
            };

          const PriorityComp = ({ text, result, index }) => {
        const [value, setValue] = useState(text ?? "");

        return (
            <div className={taStyles.tableSelectField}>
                <Select
                    defaultValue={value}
                    onChange={(val) => {
                        setValue(val);
                        updateTARowValue(val, "task_Priority", result, index);
                    }}
                >
                    {filtersList?.priority?.map((v) => (
                        <Option value={v.text}>{v.text}</Option>
                    ))}
                </Select>
            </div>
        );
    };

    const NDBExistingComp = ({ text, result, index }) => {
        const [value, setValue] = useState(text ?? "");   
      
        return (
            <div className={taStyles.tableSelectField}>
                <Select
                    defaultValue={value}
                    onChange={(val) => {
                        setValue(val);
                        updateTARowValue(val, "businessType", result, index);
                    }}
                >
                    {/* {filtersList?.priority?.map((v) => (
                        <Option value={v.text}>{v.text}</Option>
                    ))} */}
                     <Option value={'NBD'}>{'NBD'}</Option>
                      <Option value={"Existing"}>{"Existing"}</Option>
                </Select>
            </div>
        );
      }

          const ContractDPComp = ({ text, result, index }) => {
              const [value, setValue] = useState(text ?? "");
              return (
                  <div className={taStyles.tableSelectField}>
                      <Select
                          defaultValue={value}
                          onChange={(val) => {
                              setValue(val);
                              updateTARowValue(val, "modelType", result, index);
                          }}
                      >
                          {filtersList?.ModelType?.map((v) => (
                              <Option value={v.text}>{v.text}</Option>
                          ))}
                      </Select>
                  </div>
              );
          };

              const FeesPreComp = ({ text, result, index }) => {
                  const [value, setValue] = useState(text ?? "");
          
                  return (
                      <InputNumber
                          value={value}
                          onChange={(v) => {
                              setValue(v);
                          }}
                          onBlur={() =>
                              updateTARowValue(value, "uplersFeesPer", result, index)
                          }
                      />
                  );
              };


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
                                        <td>  
                                          {/* <>
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
                                                  </> */}
                                                    <div className={taStylesNew["hr-title-cell"]}>
                                                                <span
                                                                    className={taStylesNew["hr-status-box"]}
                                                                    style={{ background: data?.hrColorCode }}
                                                                >
                                                                    <span className={taStylesNew["hr-status-tooltip"]}>{data.tA_HR_Status}</span>
                                                                </span>
                                                                <div className={taStylesNew["hr-title-text"]}>
                                                                    <span>{data.hrTitle}</span>
                                                                    <span className={taStylesNew["hr-id-chip"]}    style={{
                                                     
                                                        cursor: "pointer",
                                                      }} onClick={() => {
                                                        window.open(
                                                          UTSRoutes.ALLHIRINGREQUESTROUTE +
                                                          `/${data.hiringRequest_ID}`,
                                                          "_blank"
                                                        );
                                                      }}>{data.hrNumber}</span>
                                                                </div>
                                                            </div>
                                                  </td>
                                        {/* PRIORITY */}
                                        <td><PriorityComp text={data.task_Priority} result={data} index={ind} /></td>
                                        {/* INTERVIEW ROUNDS */}
                                        <td>{data.no_of_InterviewRounds}</td>
                                        {/* AM */}
                                        <td>{data.am}</td>
                                        {/* NBD/EXISTING */}
                                        <td> <NDBExistingComp text={data.businessType} result={data} index={ind} /></td>
                                         {/* PRICING MODEL */}
                                         <td>{data.pricingModel}</td>
                                        {/* TALENT PAY RATE */}
                                        <td>{data.talent_AnnualCTC_Budget_INRValueStr}</td>
                                          {/* NR % */}
                                          <td><FeesPreComp text={data.uplersFeesPer} result={data} index={ind} /></td>
                                        {/* NR (USD) */}
                                        <td>{data.revenue_On10PerCTCStr}</td>
                                        {/* BILL RATE */}
                                        <td>{data.totalRevenue_NoofTalentStr}</td>
                                         {/* ACTIVE TRS */}
                                         <td>{data.activeTR}</td>
                                        {/* CONTRACTOR/EOR */}
                                        <td><ContractDPComp text={data.modelType} result={data} index={ind} /></td>
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