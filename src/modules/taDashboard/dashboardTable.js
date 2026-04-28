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
import { IconContext } from "react-icons";
import { IoIosRemoveCircle } from "react-icons/io";
import { GrEdit } from "react-icons/gr";
import { InputType } from "constants/application";
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import { allCompanyRequestDAO } from "core/company/companyDAO";
import { useForm } from "react-hook-form";

const { Option } = Select;

function DashboardTableComp({ searchText, tableFilteredState, selectedHead, filtersList, AddComment, hooks,userData ,startDate}) {
  const navigate = useNavigate()
  const { setIsAddNewRow, setNewTAUserValue, setNewTAHeadUserValue, getCompanySuggestionHandler, setselectedCompanyID, getHRLISTForComapny,setProfileTargetDetails,setStartTargetDate,setShowProfileTarget ,TaskStatusComp,
    editTAforTask,handleRemoveTask, getTalentProfilesDetailsfromTable,setTalentToMove,setProfileStatusID,setHRTalentListFourCount
  } = hooks;
  const [TaListData, setTaListData] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
   const [showDiamondRemark, setShowDiamondRemark] = useState(false);
      const [companyIdForRemark, setCompanyIdForRemark] = useState(0);
    const [remDiamondLoading, setRemDiamondLoading] = useState(false);
     const {
            watch,
            register,
            setError,
            handleSubmit,
            resetField,
            clearErrors,
            formState: { errors },
        } = useForm();
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

      const setDiamondCompany = async (row, index) => {
          let payload = {
              basicDetails: {
                  companyID: row.company_ID,
                  companyCategory: "Diamond",
              },
              // IsUpdateFromPreviewPage: true,
          };
          updateTARowValue("Diamond", "companyCategory", row, index);
          let res = await allCompanyRequestDAO.updateCompanyCategoryDAO(payload);
      };

         const handleRemoveDiamond = async (d) => {
              let payload = {
                  CompanyID: companyIdForRemark.company_ID,
                  DiamondCategoryRemoveRemark: d.diamondCategoryRemoveRemark,
              };
              setRemDiamondLoading(true);
              let res = await allCompanyRequestDAO.removeCompanyCategoryDAO(payload);
              setRemDiamondLoading(false);
              console.log("response", res);
              if (res.statusCode === 200) {
                  updateTARowValue(
                      "None",
                      "companyCategory",
                      companyIdForRemark,
                      companyIdForRemark.index
                  );
                  setShowDiamondRemark(false);
                  resetField("diamondCategoryRemoveRemark");
                  clearErrors("diamondCategoryRemoveRemark");
              } else {
                  message.error("Something Went Wrong!");
              }
          };

  return (
    <div className={`${taStylesNew["table-container"]}`} style={{ marginTop: '20px' }}>

      {isLoading ? <TableSkeleton /> :
        <table className={`${taStylesNew["data-table"]}`}>
          <thead>
            <tr>
              <th >TA</th>
              <th>COMPANY</th>
              <th>HR TITLE / ID</th>
              <th>PRIORITY</th>
              <th>STATUS</th>
              <th>PROFILES SHARED TARGET<br />/ ACHIEVED / L1 ROUND</th>
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
              <th>ACTIVE <br /> PROFILES</th>
              <th>LATEST COMMUNICATION AND UPDATES</th>
  <th>TASK FOR AM'S</th>
              <th>TASK FOR TR'S</th>
               <th>ACTION</th>
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
          <td>
                                                    <div className={taStylesNew["company-cell"]} style={{ display: 'contents' }}>
                                                        <span className={taStylesNew["company-name"]}>{data.companyName}</span>
                                                        <div style={{ display: 'flex' }}>
                                                            <button
                                                                className={taStylesNew["diamond-toggle"]}
                                                                data-tooltip={userData?.UserId === 2 ||
                                                                    userData?.UserId === 333 ||
                                                                    userData?.UserId === 190 || userData?.UserId === 96 ? (data?.companyCategory === "Diamond" ? "Remove Diamond" : "Add Diamond") : "Not allowed"}
                                                                onClick={() => {
                                                                    if (userData?.UserId === 2 ||
                                                                        userData?.UserId === 333 ||
                                                                        userData?.UserId === 190 || userData?.UserId === 96) {
                                                                        if (data?.companyCategory === "Diamond") {
                                                                            setShowDiamondRemark(true);
                                                                            setCompanyIdForRemark({ ...data, index: ind });
                                                                        } else {
                                                                            setDiamondCompany(data, ind)
                                                                        }
                                                                    }

                                                                }}
                                                            >
                                                                {data?.companyCategory === "Diamond"
                                                                    ? <img src="images/diamond-active-ic.svg" alt="Diamond Active" className={`${taStylesNew["diamond-icon"]} ${taStylesNew["diamond-active"]}`} />
                                                                    : <img src="images/diamond-ic.svg" alt="Diamond" className={`${taStylesNew["diamond-icon"]} ${taStylesNew["diamond-inactive"]}`} />}
                                                            </button>
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
                    <td>
                                                    <TaskStatusComp text={data.taskStatus} result={data} index={ind} />
                                                    {/* <div className={taStylesNew["inline-select-wrap"]}>
                                                        
                                                            <select className={taStylesNew["inline-select"]} defaultValue={data.status}>
                                                                <option>Fasttrack</option>
                                                                <option>Slow</option>
                                                                <option>Medium</option>
                                                                <option>Pause</option>
                                                                <option>Covered</option>
                                                            </select>
                                                        </div> */}
                                                </td>
                                                <td>
                                                    <div style={{ display: "flex" }}>
                                                        {data.task_StatusID === 1 ? (
                                                            <p
                                                                style={{
                                                                    color: "blue",
                                                                    fontWeight: "bold",
                                                                    textDecoration: "underline",
                                                                    cursor: "pointer",
                                                                }}
                                                                onClick={() => {
                                                                    setShowProfileTarget(true);
                                                                    setStartTargetDate(startDate);
                                                                    setProfileTargetDetails({ ...data, index: ind });
                                                                }}
                                                            >
                                                                {data?.profile_Shared_Target ?? 0}
                                                            </p>
                                                        ) : (
                                                            data?.profile_Shared_Target ?? 0
                                                        )}{" "}
                                                        / {data.profile_Shared_Achieved ?? "NA"} /{" "}
                                                        {data.interview_Scheduled_Target ?? "NA"}
                                                    </div>
                                                    {/* <div className={taStylesNew["cell-input-wrap"]}>
                                                            <input type="text" className={taStylesNew["cell-input"]} defaultValue={row.profilesShared} readOnly />
                                                        </div> */}
                                                </td>
                {/* INTERVIEW ROUNDS */}
                <td>{data.no_of_InterviewRounds}</td>
                {/* AM */}
                <td>{data.am}</td>
                {/* NBD/EXISTING */}
                <td> {data.businessType}
                  {/* <NDBExistingComp text={data.businessType} result={data} index={ind} /> */}
                  </td>
                {/* PRICING MODEL */}
                <td>{data.pricingModel}</td>
                {/* TALENT PAY RATE */}
                <td>{data.talent_AnnualCTC_Budget_INRValueStr}</td>
                {/* NR % */}
                <td>{data.uplersFeesPer}
                  {/* <FeesPreComp text={data.uplersFeesPer} result={data} index={ind} /> */}
                </td>
                {/* NR (USD) */}
                <td>{data.revenue_On10PerCTCStr}</td>
                {/* BILL RATE */}
                <td>{data.totalRevenue_NoofTalentStr}</td>
                {/* ACTIVE TRS */}
                <td>{data.activeTR}</td>
                {/* CONTRACTOR/EOR */}
                <td>{data.modelType}
                  {/* <ContractDPComp text={data.modelType} result={data} index={ind} /> */}
                  </td>
               
                {/* ACTIVE PROFILES */}
                <td>
                   {+data?.noOfProfile_TalentsTillDate > 0 ? (
                                                        <p
                                                            style={{
                                                                color: "blue",
                                                                fontWeight: "bold",
                                                                textDecoration: "underline",
                                                                cursor: "pointer",
                                                            }}
                                                            onClick={() => {
                                                                getTalentProfilesDetailsfromTable(data, 0);
                                                                setTalentToMove(data);
                                                                setProfileStatusID(0);
                                                                setHRTalentListFourCount([]);
                                                            }}
                                                        >
                                                            {data?.noOfProfile_TalentsTillDate}
                                                        </p>
                                                    ) : (
                                                        data?.noOfProfile_TalentsTillDate
                                                    )}
                </td>
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

                   {/* TASK FOR AM'S */}
                <td>{data.amTask}</td>
                {/* TASK FOR TR'S */}
                <td>{data.taTask}</td>
                  <td>
                                                    <div>
                                                        <IconContext.Provider
                                                            value={{
                                                                color: "#FFDA30",
                                                                style: { width: "19px", height: "19px", cursor: "pointer" },
                                                            }}
                                                        >
                                                            {" "}
                                                            <Tooltip title="Edit" placement="top">
                                                                <span
                                                                    onClick={() => {
                                                                        editTAforTask(data);
                                                                    }}
                                                                    style={{ padding: "0" }}
                                                                >
                                                                    {" "}
                                                                    <GrEdit />
                                                                </span>{" "}
                                                            </Tooltip>
                                                        </IconContext.Provider>

                                                        {(userData.UserId === 2 || userData.UserId === 56 || userData.UserId === 96 || userData.UserId === 65 || userData.UserId === 49 || userData.UserId === 176 || userData.UserId === 443 || userData.UserId === 436 || userData.UserId === 302) && <IconContext.Provider
                                                            value={{
                                                                color: "red",
                                                                style: {
                                                                    width: "19px",
                                                                    height: "19px",
                                                                    marginLeft: "10px",
                                                                    cursor: "pointer",
                                                                },
                                                            }}
                                                        >
                                                            <Tooltip title="Remove" placement="top">
                                                                <span
                                                                    // style={{
                                                                    //   background: 'red'
                                                                    // }}
                                                                    onClick={() => {
                                                                        handleRemoveTask(data);
                                                                    }}
                                                                    style={{ padding: "0" }}
                                                                >
                                                                    {" "}
                                                                    <IoIosRemoveCircle />
                                                                </span>{" "}
                                                            </Tooltip>
                                                        </IconContext.Provider>}


                                                    </div>
                                                    {/* <button className={taStylesNew["action-edit-btn"]} title="Edit">
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="#4C4E64DE"/>
                                                            </svg>
                                                        </button> */}
                                                </td>
              </tr>
            })}
          </tbody> </table>}

       {showDiamondRemark && (
                              <Modal
                                  transitionName=""
                                  width="1000px"
                                  centered
                                  footer={null}
                                  open={showDiamondRemark}
                                  className="engagementModalStyle"
                                  onCancel={() => {
                                      setShowDiamondRemark(false);
                                      resetField("diamondCategoryRemoveRemark");
                                      clearErrors("diamondCategoryRemoveRemark");
                                  }}
                              >
                                  <div style={{ padding: "35px 15px 10px 15px" }}>
                                      <h3>Add Remark</h3>
                                  </div>
          
                                  <div style={{ padding: "10px 20px" }}>
                                      {remDiamondLoading ? (
                                          <Skeleton active />
                                      ) : (
                                          <HRInputField
                                              isTextArea={true}
                                              register={register}
                                              errors={errors}
                                              label="Remark"
                                              name="diamondCategoryRemoveRemark"
                                              type={InputType.TEXT}
                                              placeholder="Enter Remark"
                                              validationSchema={{
                                                  required: "please enter remark",
                                              }}
                                              required
                                          />
                                      )}
                                  </div>
          
                                  <div style={{ padding: "10px 20px" }}>
                                      <button
                                          className={taStyles.btnPrimary}
                                          onClick={handleSubmit(handleRemoveDiamond)}
                                          disabled={remDiamondLoading}
                                      >
                                          Save
                                      </button>
                                      <button
                                          className={taStyles.btnCancle}
                                          disabled={remDiamondLoading}
                                          onClick={() => {
                                              setShowDiamondRemark(false);
                                              resetField("diamondCategoryRemoveRemark");
                                              clearErrors("diamondCategoryRemoveRemark");
                                          }}
                                      >
                                          Close
                                      </button>
                                  </div>
                              </Modal>
                          )}    
    </div>
  )
}

export default DashboardTableComp