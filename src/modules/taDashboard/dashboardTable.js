import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import stylesOBj from './n_tadashboard.module.css'
import taStyles from "./tadashboard.module.css";
import taStylesNew from "./n_tadashboardNew.module.css";
import { scrumGridTheme } from '../ScrumS2/gridTheme'
import {
  Select, InputNumber,
  Tooltip, Table, Checkbox, message, Skeleton, Modal
} from "antd";
import { AgGridReact } from 'ag-grid-react'
import { ModuleRegistry, AllCommunityModule, DataTypeService } from 'ag-grid-community'
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
import MultiConditionTextFilter from '../ScrumS2/MultiConditionTextFilter';


ModuleRegistry.registerModules([AllCommunityModule]);
const { Option } = Select;

function DashboardTableComp({ searchText, tableFilteredState, selectedHead, filtersList, AddComment, hooks, userData, startDate }) {
  const navigate = useNavigate()
  const { setIsAddNewRow, setNewTAUserValue, setNewTAHeadUserValue, getCompanySuggestionHandler, setselectedCompanyID, getHRLISTForComapny, setProfileTargetDetails, setStartTargetDate, setShowProfileTarget, TaskStatusComp,
    editTAforTask, handleRemoveTask, getTalentProfilesDetailsfromTable, setTalentToMove, setProfileStatusID, setHRTalentListFourCount
  } = hooks;
  const [TaListData, setTaListData] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [showDiamondRemark, setShowDiamondRemark] = useState(false);
  const [companyIdForRemark, setCompanyIdForRemark] = useState(0);
  const [remDiamondLoading, setRemDiamondLoading] = useState(false);
   const [columnOrder, setColumnOrder] = useState([])
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


  
  const getCOLUMNOrder = async (id) => {
      const colOrderResult = await TaDashboardDAO.getScrumColumOrderDAO(selectedHead)
      if (colOrderResult?.statusCode === HTTPStatusCode.OK) {
          setColumnOrder(colOrderResult?.responseBody)
      } else {
          setColumnOrder([])
      }
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
        const normalized = (result.responseBody || []).map((row) => ({
      ...row,
      profile_Shared_Target: row.profile_Shared_Target ?? 0,
      profile_Shared_Achieved: row.profile_Shared_Achieved ?? 0,
      interview_Scheduled_Target: row.interview_Scheduled_Target ?? 0,
    }));
      setTaListData(groupByRowSpan(normalized, "taName"));
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
    if (selectedHead.length !== 0 && filtersList?.HeadUsers.map(it => it.id).includes(selectedHead)) {
      getListData();
      getCOLUMNOrder()
    }
  }, [searchText, tableFilteredState, selectedHead, filtersList]);


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

  const ControlledAmountCell = ({ text, values, field }) => {
    const [isEdit, setIsEdit] = useState(false);

    const getCurrencySymbol = (value) => {
      const match = String(value ?? "").match(/^[^\d-]+/);
      return match ? match[0] : "";
    };

    const removeFormatting = (value) => {
      return String(value ?? "").replace(/[^0-9.]/g, "");
    };

    const formatAmount = (value, symbol) => {
      if (value === "" || value == null) return "";

      return (
        symbol +
        Number(value).toLocaleString("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })
      );
    };

    const currencySymbol = useMemo(() => getCurrencySymbol(text), [text]);

    const [role, setRole] = useState(removeFormatting(text));

    useEffect(() => {
      setRole(removeFormatting(text));
    }, [text]);

    const saveEditRole = async () => {
      if (role === "") {
        setIsEdit(false);
        return;
      }

      let pl = {
        TaskID: values.id,
        TAHeadUserID: `${selectedHead}`,
        UplersFeesPer: null,
        TotalRevenue_NoofTalent: null,
        Revenue_On10PerCTC: null,
        Talent_AnnualCTC_Budget_INRValue: null,
      };

      pl[field] = Number(role);

      const result = await TaDashboardDAO.updateContractDetailsRequestDAO(pl);
      if (result?.statusCode === HTTPStatusCode.OK) {
        message.success(result.responseBody.message);
      } else {
        message.error(result.responseBody);
      }

      setIsEdit(false);
    };

    const handleChange = (e) => {
      let value = e.target.value;

      // Allow only numbers and one decimal point
      value = value.replace(/[^0-9.]/g, "");

      const parts = value.split(".");
      if (parts.length > 2) {
        value = parts[0] + "." + parts.slice(1).join("");
      }

      setRole(value);
    };

    if (isEdit) {
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            className={taStyles.editRoalField}
            style={{
              border: role ? "1px solid #CECCCC" : "1px solid red",
              width: "100%",
              textAlign: "center",
              borderRadius: "6px",
              padding: "2px",
            }}
            type="text"
            value={role}
            onChange={handleChange}
            autoFocus
            onBlur={() => {
              if (+role === +removeFormatting(text)) {
                setIsEdit(false);
              } else {
                saveEditRole();
              }
            }}
          />
        </div>
      );
    }

    return (
      <div
        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        onDoubleClick={() => {
          setRole(removeFormatting(role));
          setIsEdit(true);
        }}
      >
        {role ? formatAmount(role, currencySymbol) : "N/A"}
      </div>
    );
  };

  const ControlledCellComp = ({ text, values }) => {
    const [isEdit, setIsEdit] = useState(false)
    const [role, setRole] = useState(text)

    const saveEditRole = async () => {
      if (role) {
        if (+role < 0 || +role > 100) {
          return
        }
        let pl = {
          TaskID: values.id,
          TAHeadUserID: `${selectedHead}`,
          UplersFeesPer: +role,
          TotalRevenue_NoofTalent: null,
          Revenue_On10PerCTC: null,
          Talent_AnnualCTC_Budget_INRValue: null,
        }
        const result = await TaDashboardDAO.updateContractDetailsRequestDAO(pl);
        if (result?.statusCode === HTTPStatusCode.OK) {
          message.success(result.responseBody.message)
          setIsEdit(false);
        } else {
          message.error(result.responseBody)
          setRole(text);
          setIsEdit(false)
        }
      }
    }

    const handleChange = (e) => {
      let value = e.target.value;

      // Keep only digits and decimal point
      value = value.replace(/[^0-9.]/g, "");

      // Allow only one decimal point
      const parts = value.split(".");
      if (parts.length > 2) {
        value = parts[0] + "." + parts.slice(1).join("");
      }

      setRole(value);
    };

    if (isEdit) {
      return <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* <TickMark
        width={24}
        height={24}
        style={{marginRight:'10px',cursor:'pointer'}}
        onClick={() => saveEditRole()}
      /> */}
        <input
          className={taStyles.editRoalField}
          style={{
            border: role ? (+role < 0 || +role > 100) ? '1px solid red' : '1px solid #CECCCC' : '1px solid red',
            width: '50px',
            textAlign: 'center',
            borderRadius: '6px',
            padding: "2px"
          }}
          autoFocus
          type='number' min={0} max={100} value={role}
          onChange={handleChange}
          onBlur={() => {
            if (+role === +text) {
              setIsEdit(false)
            } else {
              saveEditRole()
            }
          }}
        />
        {/* <Close 
      width={24}
      height={24}
      style={{marginLeft:'10px',cursor:'pointer'}}
      onClick={() => {setIsEdit(false);setRole(text)}} /> */}
      </div>
    } else {
      return <div style={{ display: 'flex', alignItems: 'center' }} onDoubleClick={() => setIsEdit(true)}>

        {role}
      </div>
    }
  }

  const updateNotes = async (pl, index) => {
    setTaListData(prev => {
      let tempD = [...prev]
      tempD[index] = { ...tempD[index], latestNotesTopRow: pl.Comments, latestNotes: pl.Comments }
      return tempD
    })
    let updateresult = await TaDashboardDAO.updateCommentRequestDAO(pl);
  }

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

  const getRowIndex = useCallback(
    (row) => TaListData.findIndex((r) => r.id === row.id),
    [TaListData]
  );

  const gridColumns = () => [
    {
      headerName: 'TA',
      field: 'taName',
      width: 140,
      pinned: 'left',
      sortable: false,
      suppressMovable: true,
      filter: MultiConditionTextFilter,
      rowSpan: (params) => params.data?.rowSpan || 1,
      valueFormatter: (params) => params.data?.rowSpan > 0 ? params.value : '',
      cellStyle: (params) => ({
        borderBottom: params.data?.rowSpan === 0 ? 'none' : '',
        borderTop: params.data?.rowSpan > 0 ? '1px solid #4C4E641F' : '',
      }),
    },
    {
      headerName: 'Company',
      field: 'companyName',
      width: 220,
      pinned: 'left',
      autoHeight: true,
      suppressMovable: true,
      filter: MultiConditionTextFilter,
      cellRenderer: (props) => {
        const { data, api } = props;
        const ind = getRowIndex(data);
        return (
          <div className={taStylesNew["company-cell"]} style={{ display: 'contents' }}>
            <Tooltip title={data.companyName}>
              <span className={taStylesNew["company-name"]}>
                {data.companyName.length > 20 ? `${data.companyName.slice(0, 18)}...` : data.companyName}
              </span>
            </Tooltip>

            <div style={{ display: 'flex' }}>
              <Tooltip title={
                userData?.UserId === 2 || userData?.UserId === 333 || userData?.UserId === 190 || userData?.UserId === 96
                  ? (data?.companyCategory === "Diamond" ? "Remove Diamond" : "Add Diamond")
                  : "Not allowed"
              } >
                <button
                  className={taStylesNew["diamond-toggle"]}

                  onClick={() => {
                    if (userData?.UserId === 2 || userData?.UserId === 333 || userData?.UserId === 190 || userData?.UserId === 96) {
                      if (data?.companyCategory === "Diamond") {
                        setShowDiamondRemark(true);
                        setCompanyIdForRemark({ ...data, index: ind });
                      } else {
                        setDiamondCompany(data, ind);
                      }
                    }
                  }}
                >
                  {data?.companyCategory === "Diamond"
                    ? <img src="images/diamond-active-ic.svg" alt="Diamond Active" className={`${taStylesNew["diamond-icon"]} ${taStylesNew["diamond-active"]}`} />
                    : <img src="images/diamond-ic.svg" alt="Diamond" className={`${taStylesNew["diamond-icon"]} ${taStylesNew["diamond-inactive"]}`} />}
                </button>
              </Tooltip>


              {userData?.showTADashboardDropdowns && (
                <Tooltip title={`Add task for TA ${data.taName} in ${data.companyName}`}>
                  <button
                    className={taStylesNew["plus-task-btn"]}

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
                  </button>
                </Tooltip>

              )}
            </div>
          </div>
        );
      },
    },
    {
      headerName: 'HR Title / ID',
      field: 'hrTitle',
      width: 220,
      suppressMovable: true,
      pinned: 'left',
      filter: MultiConditionTextFilter,
      autoHeight: true,
      cellRenderer: (props) => {
        const { data } = props;
        return (
          <div className={taStylesNew["hr-title-cell"]}>
              <Tooltip title={data.tA_HR_Status}>
<span className={taStylesNew["hr-status-box"]} style={{ background: data?.hrColorCode }}>
            
              {/* <span className={taStylesNew["hr-status-tooltip"]}>{data.tA_HR_Status}</span> */}
            </span>
              </Tooltip>
            <div className={taStylesNew["hr-title-text"]}>
              <span>{data.hrTitle}</span>
              <span
                className={taStylesNew["hr-id-chip"]}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  window.open(UTSRoutes.ALLHIRINGREQUESTROUTE + `/${data.hiringRequest_ID}`, "_blank");
                }}
              >
                {data.hrNumber}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      headerName: 'Priority',
      field: 'task_Priority',
        pinned: 'left',
         suppressMovable: TextTrackCueList,
      filter: MultiConditionTextFilter,
      width: 130,
      cellRenderer: (props) => {
        const { value, data } = props;
        const ind = getRowIndex(data);
        return <PriorityComp text={value} result={data} index={ind} />;
      },
    },
    {
      headerName: 'Status',
      field: 'taskStatus',
        pinned: 'left',
         suppressMovable: true,
      filter: MultiConditionTextFilter,
      width: 140,
      cellRenderer: (props) => {
        const { value, data } = props;
        const ind = getRowIndex(data);
        return <TaskStatusComp text={value} result={data} index={ind} />;
      },
    },
    {
      headerName: 'Profiles Shared Target / Achieved / L1 Round',
      field: 'profile_Shared_Target',
      width: 220,
      filter: MultiConditionTextFilter,
         filterParams: {
    type: 'number',

    // Filter will check all these fields
    fields: [
      'profile_Shared_Target',
      'profile_Shared_Achieved',
      'interview_Scheduled_Target',
    ],
  },
      cellRenderer: (props) => {
        const { data, ind } = props;
        const rowIndex = getRowIndex(data);
        return (
          <div style={{ display: "flex" }}>
            {data.task_StatusID === 1 ? (
              <p
                style={{ color: "blue", fontWeight: "bold", textDecoration: "underline", cursor: "pointer", margin: 0 }}
                onClick={() => {
                  setShowProfileTarget(true);
                  setStartTargetDate(startDate);
                  setProfileTargetDetails({ ...data, index: rowIndex });
                }}
              >
                {data?.profile_Shared_Target ?? 0}
              </p>
            ) : (
              data?.profile_Shared_Target ?? 0
            )}{" "}
            / {data.profile_Shared_Achieved ?? "NA"} / {data.interview_Scheduled_Target ?? "NA"}
          </div>
        );
      },
    },
    {
      headerName: 'Interview Rounds',
      field: 'no_of_InterviewRounds',
      width: 130,
         filterParams: { type: 'number'},
      filter: MultiConditionTextFilter,
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: 'AM',
      field: 'am',
      width: 100,
      filter: MultiConditionTextFilter,
    },
    {
      headerName: 'NBD/Existing',
      field: 'businessType',
      width: 130,
      cellStyle: { textAlign: 'center' },
      filter: MultiConditionTextFilter,
    },
    {
      headerName: 'Pricing Model',
      field: 'pricingModel',
      width: 140,
      filter: MultiConditionTextFilter,
    },
    {
      headerName: 'Talent Pay Rate',
      field: 'talent_AnnualCTC_Budget_INRValueStr',
      width: 160,
         filterParams: { type: 'number'},
      filter: MultiConditionTextFilter,
      cellRenderer: (props) => (
        <ControlledAmountCell
          text={props.data.talent_AnnualCTC_Budget_INRValueStr}
          values={props.data}
          field={"Talent_AnnualCTC_Budget_INRValue"}
        />
      ),
    },
    {
      headerName: 'NR %',
      field: 'uplersFeesPer',
         filterParams: { type: 'number'},
      width: 100,
      filter: MultiConditionTextFilter,
      cellRenderer: (props) => (
        <ControlledCellComp text={props.data.uplersFeesPer} values={props.data} />
      ),
    },
    {
      headerName: 'NR (USD)',
      field: 'revenue_On10PerCTCStr',
         filterParams: { type: 'number'},
      width: 140,
      filter: MultiConditionTextFilter,
      cellRenderer: (props) => (
        <ControlledAmountCell
          text={props.data.revenue_On10PerCTCStr}
          values={props.data}
          field={"Revenue_On10PerCTC"}
        />
      ),
    },
    {
      headerName: 'Bill Rate',
      field: 'totalRevenue_NoofTalentStr',
      width: 140,
      filter: MultiConditionTextFilter,
         filterParams: { type: 'number'},
      cellRenderer: (props) => (
        <ControlledAmountCell
          text={props.data.totalRevenue_NoofTalentStr}
          values={props.data}
          field={"TotalRevenue_NoofTalent"}
        />
      ),
    },
    {
      headerName: 'Active TRs',
      field: 'activeTR',
      width: 110,
      filter: MultiConditionTextFilter,
      filterParams: { type: 'number'},
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: 'Contractor/EOR',
      field: 'modelType',
      width: 140,
      filter: MultiConditionTextFilter,
    },
    {
      headerName: 'Active Profiles',
      field: 'noOfProfile_TalentsTillDate',
      width: 130,
         filterParams: { type: 'number'},
      filter: MultiConditionTextFilter,
      cellStyle: { textAlign: 'center' },
      cellRenderer: (props) => {
        const { data } = props;
        return +data?.noOfProfile_TalentsTillDate > 0 ? (
          <p
            style={{ color: "blue", fontWeight: "bold", textDecoration: "underline", cursor: "pointer", margin: 0 }}
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
        );
      },
    },
    {
      headerName: 'Latest Communication and Updates',
      field: 'latestNotes',
      width: 280,
      filter: false,
      autoHeight: true,
      editable: true,
      cellEditorPopup: true,

      cellEditor: 'agLargeTextCellEditor',
      cellEditorParams: {
        maxLength: 50000, // Optional: restricts max length
        // cols: 30,       // Optional: width of the dropdown box
        // rows: 3,        // Optional: height of the dropdown box
      },
      onCellValueChanged: (params) => {
        // console.log("Updated:", params.newValue);
        // console.log("Row:", params.data);
        const index = getRowIndex(params.data);
        let pl = {
          TA_Head_UserID: selectedHead,
          TaskID: params.data.id,
          Comments: params.newValue
        }

        updateNotes(pl, index)
      },

      cellRenderer: (props) => {
        const { data } = props;
        const ind = getRowIndex(data);
        return data?.latestNotes ? (
          <>
            <div className={taStylesNew["latest-update"]} dangerouslySetInnerHTML={{ __html: data.latestNotes }}></div>
            {/* <div className={taStylesNew["view-edit"]}>
                        <button onClick={() => AddComment(data, ind)}>Edit</button>
                    </div> */}
          </>
        ) : "";
      },
    },
    {
      headerName: "Task for AM's",
      field: 'amTask',
      width: 160,
      filter: MultiConditionTextFilter,
    },
    {
      headerName: 'Action',
      field: 'Action',
      width: 100,
      sortable: false,
      suppressMovable: true,
      filter: false,
      cellRenderer: (props) => {
        const { data } = props;
        return (
          <div>
            <IconContext.Provider
              value={{ color: "#FFDA30", style: { width: "19px", height: "19px", cursor: "pointer" } }}
            >
              <Tooltip title="Edit" placement="top">
                <span onClick={() => editTAforTask(data)} style={{ padding: "0" }}>
                  <GrEdit />
                </span>
              </Tooltip>
            </IconContext.Provider>

            {[2, 56, 96, 65, 49, 176, 443, 436, 302].includes(userData.UserId) && (
              <IconContext.Provider
                value={{ color: "red", style: { width: "19px", height: "19px", marginLeft: "10px", cursor: "pointer" } }}
              >
                <Tooltip title="Remove" placement="top">
                  <span onClick={() => handleRemoveTask(data)} style={{ padding: "0" }}>
                    <IoIosRemoveCircle />
                  </span>
                </Tooltip>
              </IconContext.Provider>
            )}
          </div>
        );
      },
    },
  ];

  const columnDefs = useMemo(() => gridColumns(), [TaListData]);

  const scrumDefaultColDef = {
    resizable: true,
    sortable: true,
    filter: true,
    suppressMovable: false, // lets users drag-reorder columns, like Excel column drag
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'ag-cell-excel-border',
    headerClass: `${taStylesNew["ag-header-center"]}`,
  };
  const gridApiRef = useRef(null);


  const onGridReady = (params) => {
    gridApiRef.current = params.api;
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

    const gridOrderedColumns = useMemo(() => {
          if (columnOrder.length) {
              let newOrderObj = []
              let originalObj =  gridColumns()
              let shortorder = columnOrder.sort(
                  (a, b) => a.columnOrder - b.columnOrder
              );
  
              shortorder.forEach(i => {
  
                  let obj = originalObj.find(val => val.field.trim() === i.columnName.trim())
              
                  if (obj?.headerName) {
                      obj = { ...obj, width: i.columnWidth ? i.columnWidth : obj.width }
                      newOrderObj.push(obj)
                  }
  
              })
  
              return newOrderObj
          } else {
              return  gridColumns()
          }
  
  
      }, [TaListData, columnOrder]);

     const updateColumnOrder = async (pl) => {
          const result = await TaDashboardDAO.updateScrumTaskColumnOrderRequestDAO(pl);
          if (result.statusCode === HTTPStatusCode.OK) {
            setColumnOrder(result.responseBody)
              message.success("Column order updated")
          } else if (result.statusCode === HTTPStatusCode.NOT_FOUND) {
              message.error("Something went wrong!")
          }
      }
  
      const updateColumnWidth = async (pl) => {
          const result = await TaDashboardDAO.updateScrumTaskColumnWidthRequestDAO(pl);
          if (result.statusCode === HTTPStatusCode.OK) {
              // message.success(" updated")
              setColumnOrder(result.responseBody)
          } else if (result.statusCode === HTTPStatusCode.NOT_FOUND) {
              message.error("Something went wrong!")
          }
      }

     const onColumnMoved = (params) => {
        if (!params.finished) return; // Ignore intermediate drag events
        if(params.toIndex + 1 < 6) return


        let pl = {
            POD_Id: selectedHead,
            ColumnName: params.column.getColId(),
            ColumnOrder: params.toIndex + 1
        }

        updateColumnOrder(pl)
    };


    const onColumnResized = (params) => {
        // console.log('res',params)
        if (!params.finished) return;

        let pl = {
            POD_Id: selectedHead,
            ColumnName: params.column.getColId(),
            ColumnWidth: parseInt(params.column.getActualWidth()),
        };

        // console.log(pl);
        updateColumnWidth(pl)
    };



  return (
    <div className={`${taStylesNew["table-container"]} ${taStylesNew["grid-wrapper"]}`} style={{ marginTop: '20px' }}>
      {isLoading ? <TableSkeleton /> : <div style={{ height: 500 }} ><AgGridReact
        //  onGridReady={onGridReady}
        // onFirstDataRendered={params => updatePinnedTotalRow(params.api)}
        //  theme={scrumGridTheme}
        rowData={TaListData}
        // columnDefs={columnDefs}
        columnDefs={gridOrderedColumns}
        // animateRows={false}
        defaultColDef={scrumDefaultColDef}
      //   getRowId={(params) => String(params.data.id)}
        suppressScrollOnNewData={true}
        suppressRowTransform={true}
      //               headerHeight={38}
      // rowHeight={"auto"}
       onColumnMoved={onColumnMoved}
      onColumnResized={onColumnResized}
      /> </div>}

     


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