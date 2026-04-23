import React, { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import stylesOBj from './n_tadashboard.module.css'
import taStyles from "./tadashboard.module.css";
import taStylesNew from "./n_tadashboardNew.module.css";
import {
  Select, InputNumber,
  Tooltip, Table, Checkbox, message, Skeleton, Modal
} from "antd";
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton'
import { TaDashboardDAO } from "core/taDashboard/taDashboardDRO";
import { HTTPStatusCode } from "constants/network";
import UTSRoutes from 'constants/routes';

const { Option } = Select;

function DashboardTableComp({ searchText, tableFilteredState, selectedHead, filtersList, AddComment, hooks,userData }) {
  const navigate = useNavigate()
  const { setIsAddNewRow, setNewTAUserValue, setNewTAHeadUserValue, getCompanySuggestionHandler, setselectedCompanyID, getHRLISTForComapny } = hooks;
  const [TaListData, setTaListData] = useState([]);
  const [isLoading, setIsLoading] = useState(false)

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
    if (selectedHead.length !== 0 && filtersList?.HeadUsers.map(it=> it.id).includes(selectedHead)) {
      getListData();
    }
  }, [searchText, tableFilteredState, selectedHead,filtersList]);


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
    <div className={`${taStylesNew["table-container"]}`} style={{ marginTop: '20px' }}>

      {isLoading ? <TableSkeleton /> :
        <table className={`${taStylesNew["data-table"]}`}>
          <thead>
            <tr>
              <th >TA Name</th>
              <th>COMPANY Name</th>
              <th>HR TITLE / ID</th>
              <th>PRIORITY</th>
              <th>INTERVIEW <br /> ROUNDS</th>
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
              <th>ACTIVE <br /> PROFILES</th>
              <th>LATEST COMMUNICATION AND UPDATES</th>

            </tr>
          </thead>
          {/* <TABLEBODYComponent apiData={apiData} /> */}

          <tbody>
            {TaListData.length === 0 ? <tr>
              <td colSpan={19} style={{ textAlign: "center", padding: "20px" }}>
                No data available
              </td>
            </tr> : TaListData.map((data, ind) => {

              return <tr>
                {/* TA Name */}
                <td>{data.taName}</td>
                {/* COMPANY Name */}
                <td>  <div className={taStylesNew["company-cell"]}>
                  {data.companyName}   
                   {userData?.showTADashboardDropdowns && <button className={taStylesNew["plus-task-btn"]} data-tooltip={`Add task for TA ${data.taName} in ${data.companyName}`}
                                                                            onClick={() => {
                                                                                setIsAddNewRow(true);
                                                                                setNewTAUserValue(data.tA_UserID);
                                                                                setNewTAHeadUserValue(selectedHead);
                                                                                getCompanySuggestionHandler(data.tA_UserID);
                                                                                setselectedCompanyID(data?.company_ID);
                                                                                getHRLISTForComapny(data?.company_ID);
                                                                            }}
                                                                        >
                                                                            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M13 0C10.4288 0 7.91543 0.762437 5.77759 2.1909C3.63975 3.61935 1.97351 5.64968 0.989572 8.02512C0.0056327 10.4006 -0.251811 13.0144 0.249797 15.5362C0.751405 18.0579 1.98953 20.3743 3.80762 22.1924C5.6257 24.0105 7.94208 25.2486 10.4638 25.7502C12.9856 26.2518 15.5995 25.9944 17.9749 25.0104C20.3503 24.0265 22.3807 22.3603 23.8091 20.2224C25.2376 18.0846 26 15.5712 26 13C25.9957 9.55351 24.6247 6.2494 22.1876 3.81236C19.7506 1.37532 16.4465 0.00430006 13 0ZM18 14H14V18C14 18.2652 13.8946 18.5196 13.7071 18.7071C13.5196 18.8946 13.2652 19 13 19C12.7348 19 12.4804 18.8946 12.2929 18.7071C12.1054 18.5196 12 18.2652 12 18V14H8.00001C7.73479 14 7.48044 13.8946 7.2929 13.7071C7.10536 13.5196 7.00001 13.2652 7.00001 13C7.00001 12.7348 7.10536 12.4804 7.2929 12.2929C7.48044 12.1054 7.73479 12 8.00001 12H12V8C12 7.73478 12.1054 7.48043 12.2929 7.29289C12.4804 7.10536 12.7348 7 13 7C13.2652 7 13.5196 7.10536 13.7071 7.29289C13.8946 7.48043 14 7.73478 14 8V12H18C18.2652 12 18.5196 12.1054 18.7071 12.2929C18.8946 12.4804 19 12.7348 19 13C19 13.2652 18.8946 13.5196 18.7071 13.7071C18.5196 13.8946 18.2652 14 18 14Z" fill="#8A8A8A" />
                                                                            </svg>
                                                                        </button>}
                </div>
              
                    </td>
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
                      <span className={taStylesNew["hr-id-chip"]} style={{

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
                <td><div dangerouslySetInnerHTML={{ __html: data.latestNotes }}></div>
                  {data?.latestNotes ? <>
                    <div dangerouslySetInnerHTML={{ __html: data.latestNotes }}></div>
                    <div className={taStylesNew["view-edit"]}>

                      <button onClick={() => {
                        AddComment(data, ind);
                      }}>Edit</button>
                    </div>
                  </> : <button className={taStylesNew["cell-add-btn"]} onClick={() => {
                    AddComment(data, ind);
                  }} >Add</button>}</td>
              </tr>
            })}
          </tbody> </table>}
    </div>
  )
}

export default DashboardTableComp