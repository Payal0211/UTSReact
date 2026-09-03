import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import stylesOBj from './n_tadashboard.module.css'
import taStyles from "./tadashboard.module.css";
import taStylesNew from "./n_tadashboardNew.module.css";
import { scrumGridTheme } from '../ScrumS2/gridTheme'
import moment from 'moment'
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
import { LatestNotesCell } from '../ScrumS2/MiscCells';
import gridStyles from '../ScrumS2/scrumGrid.module.css'

ModuleRegistry.registerModules([AllCommunityModule]);
const { Option } = Select;

function DashboardTableComp({ searchText, tableFilteredState, selectedHead, filtersList, AddComment, hooks, userData, startDate }) {
  const navigate = useNavigate()
  const { setIsAddNewRow, setNewTAUserValue, setNewTAHeadUserValue, getCompanySuggestionHandler, setselectedCompanyID, getHRLISTForComapny, setProfileTargetDetails,startTargetDate, setStartTargetDate, setShowProfileTarget, 
    editTAforTask, handleRemoveTask, getTalentProfilesDetailsfromTable, setTalentToMove, setProfileStatusID, setHRTalentListFourCount,setGoalList,setLoadingTalentProfile,getTalentProfilesDetailsfromGoalsTable
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
  const [TabTitle, setTabTitle] = useState('A')
  const [targetValue, setTargetValue] = useState(5);

  const [showAlertDetailModal, setShowAlertDetailModal] = useState(false);
  const [alertDetailData, setAlertDetailData] = useState({});

  // function groupByRowSpan(data, groupField) {
  //   const grouped = {};

  //   // Step 1: Group by the field (e.g., 'ta')
  //   data.forEach((item) => {
  //     const key = item[groupField];
  //     if (!grouped[key]) grouped[key] = [];
  //     grouped[key].push(item);
  //   });

  //   // Step 2: Add rowSpan metadata
  //   const finalData = [];
  //   Object.entries(grouped).forEach(([key, rows]) => {
  //     rows.forEach((row, index) => {
  //       finalData.push({
  //         ...row,
  //         rowSpan: index === 0 ? rows.length : 0,
  //       });
  //     });
  //   });

  //   return finalData;
  // }


  const DUPLICATE_COLOR_PALETTE = [
    'rgb(230, 249, 229)', // green
    'rgb(255, 236, 210)', // orange
    'rgb(214, 231, 255)', // blue
    'rgb(255, 214, 224)', // pink
    'rgb(230, 220, 255)', // purple
    'rgb(255, 250, 205)', // yellow
    'rgb(210, 250, 245)', // teal
    'rgb(255, 224, 178)', // amber
];

const duplicateColorMap = useMemo(() => {
    // Group rows by hrNumber
    const counts = {};
    TaListData.forEach((row) => {
        if (!row?.hrNumber) return;
        counts[row.hrNumber] = (counts[row.hrNumber] || 0) + 1;
    });

    // Only hrNumbers that appear more than once get a color
    const duplicateKeys = Object.keys(counts).filter((key) => counts[key] > 1);

    // Assign each duplicate hrNumber a color, cycling through the palette
    const map = {};
    duplicateKeys.forEach((key, index) => {
        map[key] = DUPLICATE_COLOR_PALETTE[index % DUPLICATE_COLOR_PALETTE.length];
    });

    return map;
}, [TaListData]);

  function groupByRowSpan(data, groupField) {
  const grouped = {};

  // Group data by TA
  data.forEach((item) => {
    const key = item[groupField];

    if (!grouped[key]) {
      grouped[key] = [];
    }

    grouped[key].push(item);
  });

  const finalData = [];

  Object.entries(grouped).forEach(([key, rows]) => {

    // Add actual rows
    rows.forEach((row, index) => {
      finalData.push({
        ...row,
        rowSpan: index === 0 ? rows.length : 0,
        isTotalRow: false,
      });
    });

    // Calculate TA wise totals
    const totalTalentPayRate = rows.reduce(
      (sum, row) => sum + parseFloat(
        String(row.talent_AnnualCTC_Budget_INRValueStr ?? "")
          .replace(/[^0-9.-]/g, "")
      ) || 0,
      0
    );

    // const totalNR = rows.reduce(
    //   (sum, row) => sum + parseFloat(row.uplersFeesPer) || 0,
    //   0
    // );

    const totalNR = 6000;
    // NR(USD) total = sum of (Bill Rate - Talent Pay Rate) per row —
    // the SAME formula used to render each row's NR(USD) cell, so the total
    // always matches what's actually displayed on screen, not a stale backend field.
    const totalNRUSD = rows.reduce((sum, row) => {
      const rowBillRate = parseFloat(
        String(row.totalRevenue_NoofTalentStr ?? "").replace(/[^0-9.-]/g, "")
      ) || 0;
      const rowTalentPayRate = parseFloat(
        String(row.talent_AnnualCTC_Budget_INRValueStr ?? "").replace(/[^0-9.-]/g, "")
      ) || 0;
      return sum + (rowBillRate - rowTalentPayRate);
    }, 0);

    const totalActiveTR = rows.reduce(
      (sum, row) => sum + (parseFloat(row.activeTR) || 0),
      0
    );

    // Bill Rate total = NR(USD) total / NR(%) total, expressed as a percentage
    const totalBillRate = totalNR ? (totalNRUSD / totalNR)  : 0;

    // Add TA Total Row
    finalData.push({
      [groupField]: `${key} Total`,
      id: `total-${key}`,
      // talent_AnnualCTC_Budget_INRValueStr: totalTalentPayRate,
      uplersFeesPer: totalNR,
      revenue_On10PerCTCStr: totalNRUSD,
      totalRevenue_NoofTalentStr: totalBillRate,
      activeTR: totalActiveTR,
      isTotalRow: true,
      rowSpan: 1,
    });
  });

  return finalData;
}

function ProfileSharedTargetCell(props) {
    const {value, data ,objKey } = props;
    // const { setShowProfileTarget, setStartTargetDate, setProfileTargetDetails, startDate, getRowIndex, setTargetValue , isHistory} =
    //     props.context;

          if (props.node.rowPinned) {
        return value;
            }
    const i = getRowIndex(data);


    return (
        <div style={{ display: 'flex', justifyContent:'center' }}>
            {data.task_StatusID === 1 ? (
                <p
                    style={{ color: 'blue', fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer', margin: 0 }}
                    onClick={() => {
                         setTargetValue(value)
                        setShowProfileTarget(true);
                        setStartTargetDate(startDate);
                        setProfileTargetDetails({ ...data, index: i });
                    }}
                >
                    {value ?? ""}
                </p>
            ) : (
                value ?? ""
            )}{' '}
            {/* / {data.profile_Shared_Achieved ?? 'NA'} / {data.interview_Scheduled_Target ?? 'NA'} */}
        </div>
    );
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
      tabName: TabTitle
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
  }, [tableFilteredState, selectedHead, searchText, navigate,TabTitle]);

  useEffect(() => {
    if (selectedHead.length !== 0 && filtersList?.HeadUsers.map(it => it.id).includes(selectedHead)) {
      getListData();
      getCOLUMNOrder()
    }
  }, [searchText, tableFilteredState, selectedHead, filtersList,TabTitle]);


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
      // setTaListData((prev) => {
      //   let newDS = [...prev];
      //   newDS[index] = {
      //     ...newDS[index],
      //     [key]: value?.id,
      //     role_Type: value?.data,
      //   };
      //   return newDS;
      // });
    } else if (key === "task_StatusID") {
      pl[key] = value?.id;
      // setTaListData((prev) => {
      //   let newDS = [...prev];
      //   let nob = {
      //     ...newDS[index],
      //     [key]: value?.id,
      //     taskStatus: value?.data,
      //   };
      //   newDS[index] = nob;
      //   return newDS;
      // });
    } else if (key === "tA_HR_StatusID") {
      pl[key] = value?.id;
      // setTaListData((prev) => {
      //   let newDS = [...prev];
      //   newDS[index] = {
      //     ...newDS[index],
      //     [key]: value?.id,
      //     tA_HR_Status: value?.data,
      //   };
      //   return newDS;
      // });
    } else if (key === "companyCategory") {
      pl[key] = value?.id;
      setTaListData((prev) => {
        let newDS = [...prev];
        newDS[index] = { ...newDS[index], [key]: value };
        return newDS;
      });
    } else {
      pl[key] = value;
      // setTaListData((prev) => {
      //   let newDS = [...prev];
      //   newDS[index] = { ...newDS[index], [key]: value };
      //   return newDS;
      // });
    }
    let updateresult = await TaDashboardDAO.updateTAListRequestDAO(pl);
  };

    // Recalculate NR(%) and NR(USD) whenever Bill Rate or Talent Pay Rate is edited,
  // persist the recalculated values, then update local state (which regroups TA-wise totals).
const recalcAndSave = async (row, { billRate, talentPayRate } = {}) => {
    // Extract the currency symbol from whichever field is being edited,
    // so it survives the round-trip back into state.
    const getCurrencySymbol = (value) => {
        const match = String(value ?? "").match(/^[^\d-]+/);
        return match ? match[0] : "$";   // fallback to $ if nothing found
    };

    const billSymbol = getCurrencySymbol(row.totalRevenue_NoofTalentStr);
    const talentSymbol = getCurrencySymbol(row.talent_AnnualCTC_Budget_INRValueStr);
    const nrUsdSymbol = getCurrencySymbol(row.revenue_On10PerCTCStr);

    const bill = billRate !== undefined
        ? billRate
        : (parseFloat(String(row.totalRevenue_NoofTalentStr ?? "").replace(/[^0-9.-]/g, "")) || 0);
    const talent = talentPayRate !== undefined
        ? talentPayRate
        : (parseFloat(String(row.talent_AnnualCTC_Budget_INRValueStr ?? "").replace(/[^0-9.-]/g, "")) || 0);

    const newNRUSD = bill - talent;
    const existingNRPercent = parseFloat(row.uplersFeesPer) || 0;

    let pl = {
        TaskID: row.id,
        TAHeadUserID: `${selectedHead}`,
        UplersFeesPer: existingNRPercent,
        TotalRevenue_NoofTalent: bill,
        Revenue_On10PerCTC: newNRUSD,
        Talent_AnnualCTC_Budget_INRValue: talent,
    };

    const result = await TaDashboardDAO.updateContractDetailsRequestDAO(pl);
    if (result?.statusCode !== HTTPStatusCode.OK) {
        message.error(result.responseBody);
        return;
    }

    setTaListData((prev) => {
        const flat = prev
            .filter((r) => !r.isTotalRow)
            .map((r) =>
                r.id === row.id
                    ? {
                        ...r,
                        // 👇 re-attach the symbol so it survives into the next render
                        // totalRevenue_NoofTalentStr: `${billSymbol}${bill}`,
                        // talent_AnnualCTC_Budget_INRValueStr: `${talentSymbol}${talent}`,
                        // revenue_On10PerCTCStr: `${nrUsdSymbol}${newNRUSD}`,
                         totalRevenue_NoofTalentStr: `${bill}`,
                        talent_AnnualCTC_Budget_INRValueStr: `${talent}`,
                        revenue_On10PerCTCStr: `${newNRUSD}`,
                    }
                    : r
            );
        return groupByRowSpan(flat, "taName");
    });
};


  const PriorityComp = ({ text, result, index }) => {
    const [value, setValue] = useState(text ?? "");

    return (
      <div className={taStylesNew.tableSelectField}>
        <Select
          defaultValue={value}
          size="small"
          style={{ fontSize: '10px' }}
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

   const TaskStatusComp = ({ text, result, index ,style}) => {
          const [value, setValue] = useState(text ?? "");
          const colorCode =
              filtersList?.TaskStatus?.find((v) => v.data === value)?.colorCode ?? "";
          return (
              <div className={taStylesNew.tableSelectField}>
                  <Select
                      defaultValue={value}
                      style={{ color: colorCode , ...style }}
                      size="small"
                      onChange={async (val) => {
                          if (value === "Fasttrack" && val !== "Fasttrack") {
                              let pl = {
                                  task_ID: result?.id,
                                  tA_Head_UserID: selectedHead,
                                  tA_UserID: result?.tA_UserID,
                                  target_StageID: 1,
                                  target_Number: targetValue,
                                  target_Date: moment(startTargetDate).format("YYYY-MM-DD"),
                                  IsStatusChangedToSlow: true,
                                  task_StatusID: val?.id 
                              };
                              setLoadingTalentProfile(true);
                              let response = await TaDashboardDAO.insertProfileShearedTargetDAO(
                                  pl
                              );
                              setLoadingTalentProfile(false);
                              if (response.statusCode === HTTPStatusCode.OK) {
                                  setGoalList(response.responseBody);
                                  setTargetValue(5);
                                  setStartTargetDate(new Date());
                              }
                          }
                          setValue(val);
                          let valobj = filtersList?.TaskStatus?.find((i) => i.data === val);
                          if (val === "Fasttrack") {
                              setShowProfileTarget(true);
                              setStartTargetDate(startDate);
                              setProfileTargetDetails({ ...result, index: index });
                              return;
                          }
                           updateTARowValue(valobj, "task_StatusID", result, index);
                           setTimeout(()=>{
                             if (val === "Covered") {
                          return  setTabTitle('C')
                        } 
                        if (val === "Pause") {
                          return  setTabTitle('P')
                        }
                        return setTabTitle('A')
                           },2000)
                                               
                      }}
                  >
                      {filtersList?.TaskStatus?.map((v) => (
                          <Option style={{ color: v.colorCode }} value={v.data}>
                              {v.data}
                          </Option>
                      ))}
                  </Select>
              </div>
          );
      };

         function computePoPUPAlerts(data) {
        const alerts = [];

   
          const batch = data?.hrAlerts
        if (batch?.length) {
            batch.forEach(i => {
                alerts.push({
                    key: 'screenBatch',
                    text: i.alert,
                    dot: i.color === "Red" ? 'critical' : 'warning',
                    // isNew: (i?.alertTrigger === "newInterviewRejectYesterday" || i?.alertTrigger === "newScreenRejectYesterday")
                    isNew: i?.alertTrigger !== "$" ? true : false,
                    ...i
                });
            })

        }

        const severityOrder = { critical: 0, warning: 1, info: 2, success: 3 };
        // return alerts.sort((a, b) => severityOrder[a.dot] - severityOrder[b.dot]);
        return alerts
    }

    function parseHrAlertDetailText(text) {
    if (!text) return [];

    return text
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean)
        .map((entry) => {
            const match = entry.match(/^(.+?)\s*\((.+?)\)\s*$/);
            if (!match) return { name: entry, status: '' };
            return { name: match[1].trim(), status: match[2].trim() };
        });
}

const getStatusStyle = (statusRaw) => {
    const key = (statusRaw ?? '').trim().toLowerCase();
    return STATUS_CHIP_STYLES[key] ?? { label: statusRaw, icon: '•', bg: '#F0F0F0', text: '#666' };
};

function BatchEntry({ entry, isLast }) {
    const style = getStatusStyle(entry.status);

    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: '#333' }}>
                    {entry.name}
                </span>
                {entry.status && (
                    <span
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: 8,
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: 999,
                            backgroundColor: style.bg,
                            color: style.text,
                            whiteSpace: 'nowrap',
                        }}
                    >
                        <span style={{ fontSize: 10 }}>{style.icon}</span>
                        {style.label}
                    </span>
                )}
            </div>
            {!isLast && <span style={{ color: '#D0D5DB', fontSize: 12 }}>|</span>}
        </>
    );
}

      function SummaryCard({ label, value, color }) {
        return (
            <div
                style={{
                    flex: 1,
                    backgroundColor: '#F4F6F8',
                    borderRadius: 10,
                    padding: '10px 4px',
                    textAlign: 'center',
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center',
                    gap:'5px'
                }}
            >
                <div style={{ fontSize: 12, fontWeight: 700, color }}>{value}</div>
                <div style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>{label}</div>
            </div>
        );
    }

     function HrAlertBatchChips({ title, text, entries: entriesProp }) {
      const entries = entriesProp ?? parseHrAlertDetailText(text);

    if (!entries || entries.length === 0) return null;

    return (
        <div
            style={{
                border: '1px solid #E3E7EB',
                borderRadius: 999,
                padding: '10px 16px',
                background: '#fff',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 5,
                width:'fit-content'
            }}
        >
            {entries.map((entry, i) => (
                <BatchEntry key={i} entry={entry} isLast={i === entries.length - 1} />
            ))}
        </div>
    );
}


      function AlertRowBig({ alert }) {
            return (
                <Tooltip title={alert.label ?? alert.text}>
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 2,
                            padding: '10px',
                            borderRadius: 999,
                            backgroundColor: alert.color ? alert.color : CHIP_BG[alert.dot],
                            fontSize: 10,
                            fontWeight: 500,
                            color: '#3a3a3a',
                            lineHeight: '14px',   // was 16px
                            height: 16,           // was 22px — this is the main change
                            boxSizing: 'border-box',
                            whiteSpace: 'nowrap',
                            maxWidth: 'fit-content',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {alert.prefixIcon ? (
                            <span style={{ fontWeight: 700, color: DOT_COLORS[alert.dot], fontSize: 10, flexShrink: 0 }}>
                                {alert.prefixIcon}
                            </span>
                        ) : (
                            <span
                                style={{
                                    width: 5,
                                    height: 5,
                                    borderRadius: '50%',
                                    backgroundColor: DOT_COLORS[alert.dot],
                                    flexShrink: 0,
                                }}
                            />
                        )}
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{alert.text}</span>
                        {alert?.isNew && <NewBlinkBadge />}
                    </div>
                </Tooltip>
            );
        }



          function AlertDetailModal({ open, data, onClose }) {
              if (!data) return null;
      
              const alerts = computePoPUPAlerts(data);
              const daysOpen = data?.days ?? 0;
              const totalInterviewRejects = data?.totalNoOfInterviewReject ?? 0;
              const activeProfiles = data?.noOfProfile_TalentsTillDate ?? 0;
      
              return (
                  <Modal
                      transitionName=""
                      width="fit-content"
                      style={{minWidth:'450px'}}
                      centered
                      footer={null}
                      open={open}
                      className="engagementModalStyle"
                      onCancel={onClose}
                  >
                      <div style={{ padding: '20px 24px 24px' }}>
      
      
                          {/* Title + subtitle */}
                          <h2 style={{ fontSize: 10, fontWeight: 700, margin: '0 0 6px' }}>
                              {data.hrTitle}
                          </h2>
                          <p style={{ color: '#6b7280', fontSize: 8, margin: '0 0 20px' }}>
                            <span>{data.taName} · {data.companyName} ·</span>  {data.hrNumber}
                          </p>
      
                          {/* Summary cards */}
                          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                              <SummaryCard label="Days Open" value={daysOpen} color="#D93025" />
                              <SummaryCard label="Int. Rejects" value={totalInterviewRejects} color="#D93025" />
                              <SummaryCard label="Active" value={activeProfiles} color="#1E8E3E" />
                          </div>
      
                          {/* Funnel */}
                          <div style={{ fontSize: 8, fontWeight: 700, color: '#6b7280', letterSpacing: 0.5, marginBottom: 10 }}>
                              FUNNEL
                          </div>
                          {/* Alert chips row */}
                          {alerts.length > 0 && (
                              <div style={{ display: 'flex', flexDirection:'column', gap: 6, marginBottom: 20 }}>
                                  {alerts.map((a) =>{
                                   return   <>
                                      
                                      <AlertRowBig key={a.key} alert={a} />
                                  {(a.alertDetailText && a.alertDetailText !=="$" ) && <HrAlertBatchChips
                              title="First Batch"
                              text={a.alertDetailText}
                          />}
                                      </>
                                  } )}
                              </div>
      
      
      
                          )}
      
                           {/* {data?.hrAlertDetailText && (
                          <HrAlertBatchChips
                              title="First Batch"
                              text={data.hrAlertDetailText}
                          />
                      )} */}
                          {/*  <div style={{ backgroundColor: '#F4F6F8', borderRadius: 10, overflow: 'hidden' }}>
                              <FunnelRow label="Total Submissions" value={data?.totalNoOfSubmission ?? '—'} />
                              <FunnelRow label="Screen Reject" value={data?.screenReject ?? '—'} />
                              <FunnelRow
                                  label="R1 / R2 / R3"
                                  value={`${data?.r1 ?? 0} / ${data?.r2 ?? 0} / ${data?.r3 ?? 0}`}
                                  valueColor="#7C3AED"
                              />
                              <FunnelRow
                                  label="Interview Rejects"
                                  value={totalInterviewRejects}
                                  valueColor="#D93025"
                              />
                              <FunnelRow
                                  label="Today Target → Achieved"
                                  value={`${data?.todayProfile_Shared_Target ?? 0} → ${data?.profile_Shared_Achieved ?? 0}`}
                              />
                              <FunnelRow
                                  label="Calls / Notes"
                                  value={`${data?.noOfCallsGivenDay ?? '—'} / ${data?.latestNotes ? '✓' : '—'}`}
                              />
                              <FunnelRow
                                  label="Status / Category"
                                  value={`${data?.taskStatus ?? '—'} · ${data?.companyCategory ?? '—'}`}
                              />
                              <FunnelRow label="Joining Date" value={data?.joiningDate ?? '—'} />
                              <FunnelRow label="Touch Base" value={data?.touchBasedNotes ? '✓' : 'N/A'} isLast /> 
                          </div>*/}
                      </div>
                  </Modal>
              );
          }

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

      function NewBlinkBadge({ text }) {
          return (
              <>
                  <style>
                      {`
                      @keyframes blink-new {
                          0%, 100% { opacity: 1; }
                          50% { opacity: 0.2; }
                      }
                  `}
                  </style>
                  <span
                      style={{
                          fontStyle: 'italic',
                          fontWeight: 600,
                          color: 'purple',
                          marginLeft: 6,
                          fontSize:'12px',
                          animation: 'blink-new 1.2s ease-in-out infinite',
                          display: 'flex',
                          alignItems: 'center',
                          height: '16px'
                      }}
                  >
                      new!
                  </span>
              </>
          );
      }

        const DOT_COLORS = {
        critical: '#E64545',
        warning: '#F2A93B',
        info: '#4A8FE7',
        success: '#2FAE60',
    };

    const CHIP_BG = {
        critical: '#FDECEC',
        warning: '#FFF3E0',
        info: '#EAF2FE',
        success: '#E8F7EE',
    };


    // ---------- Status → chip style mapping ----------
const STATUS_CHIP_STYLES = {
    'screening reject': { label: 'screen reject', icon: '⊗', bg: '#FDECEC', text: '#D93025' },
    'screen reject': { label: 'screen reject', icon: '⊗', bg: '#FDECEC', text: '#D93025' },
    'profile shared': { label: 'profile shared', icon: '➤', bg: '#EAF2FE', text: '#1A56C4' },
    'in interview': { label: 'in interview', icon: '📋', bg: '#FFF6E0', text: '#B7791F' },
    'submitted': { label: 'submitted', icon: '📋', bg: '#FDECEC', text: '#D93025' },
    'interview reject': { label: 'interview reject', icon: '⊗', bg: '#FDECEC', text: '#D93025' },
    'duplicate': { label: 'duplicate', icon: '⊘', bg: '#F0F0F0', text: '#666' },
    'hold': { label: 'hold', icon: '⏸', bg: '#FFF6E0', text: '#B7791F' },
};

  

          function computeAlerts(data) {
        const alerts = [];

        // ---------- HR open 30+ days ----------
        const days = data?.days ?? 0;
        if (days > 30) {
            alerts.push({
                key: 'stale',
                text: `${days} days open`,
                dot: 'critical',
                // isNew: data?.newTriggerAlert === 'days'
            });
        }


      

        // // ---------- Interview-reject batch pattern ----------
        const interviewRejects = data?.totalNoOfInterviewReject ?? 0;


        // ---------- Hard ceiling: total interview rejections > 10 ----------
        if (interviewRejects > 10) {
            alerts.push({
                key: 'interviewCeiling',
                text: `${interviewRejects} total int. rejects`,
                dot: 'critical',
            });
        }

        // ---------- Yesterday: new screen rejection ----------
        const newScreenRejectYesterday = data?.yesterdayNewScreenReject ?? 0;
        if (newScreenRejectYesterday > 0) {
            alerts.push({
                key: 'newScreenRejectYesterday',
                text: `${newScreenRejectYesterday} new screen reject`,
                dot: 'info',
                isNew: data?.newTriggerAlert === 'newScreenRejectYesterday'
            });
        }

        // ---------- Yesterday: new interview rejection ----------
        const newInterviewRejectYesterday = data?.yesterdayNewInterviewReject ?? 0;
        if (newInterviewRejectYesterday > 0) {
            alerts.push({
                key: 'newInterviewRejectYesterday',
                text: `${newInterviewRejectYesterday} new interview reject`,
                dot: 'info',
                isNew: data?.newTriggerAlert === 'newInterviewRejectYesterday'
            });
        }

        // ---------- Submission target achieved (yes/no + calls/day) ----------
        const target = data?.profile_Shared_Target ?? 0;
        const achieved = data?.profile_Shared_Achieved ?? 0;
        const callsPerDay = data?.callsPerDay ?? 0;

        if (target > 0) {
            const isAchieved = achieved >= target;
            alerts.push({
                key: 'targetStatus',
                text: isAchieved
                    ? `${achieved}/${target} met`
                    : `${achieved}/${target} · ${callsPerDay} profile submit : ${callsPerDay} calls`,
                dot: isAchieved ? 'success' : 'critical',
                prefixIcon: isAchieved ? '✓' : '✗',
                // isNew: data?.newTriggerAlert === 'achieved'
            });
        }

          const batch = data?.hrAlerts
        if (batch?.length) {
            batch.forEach(i => {
                alerts.push({
                    key: 'screenBatch',
                    text: i.alert,
                    dot: i.color === "Red" ? 'critical' : 'warning',
                    // isNew: (i?.alertTrigger === "newInterviewRejectYesterday" || i?.alertTrigger === "newScreenRejectYesterday")
                    isNew: i?.alertTrigger !== "$" ? true : false,
                    ...i
                });
            })

        }

        const severityOrder = { critical: 0, warning: 1, info: 2, success: 3 };
        // return alerts.sort((a, b) => severityOrder[a.dot] - severityOrder[b.dot]);
        return alerts
    }
     
   
  
      const openAlertDetail = useCallback((data) => {
          setAlertDetailData(data);
          setShowAlertDetailModal(true);
      }, []);

         function AlertRow({ alert }) {
              return (
                  <Tooltip title={alert.label ?? alert.text}>
                      <div
                          style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 10,
                              padding: '0 8px',
                              borderRadius: 999,
                              backgroundColor: alert.color ? alert.color : CHIP_BG[alert.dot],
                              fontSize: 10.5,
                              fontWeight: 500,
                              color: '#3a3a3a',
                              lineHeight: '14px',   // was 16px
                              height: 16,           // was 22px — this is the main change
                              boxSizing: 'border-box',
                              whiteSpace: 'nowrap',
                              // maxWidth: 'fit-content',
                              // overflow: 'hidden',
                              // textOverflow: 'ellipsis',
                          }}
                      >
                          {alert.prefixIcon ? (
                              <span style={{ fontWeight: 700, color: DOT_COLORS[alert.dot], fontSize: 10, flexShrink: 0 }}>
                                  {alert.prefixIcon}
                              </span>
                          ) : (
                              <span
                                  style={{
                                      width: 5,
                                      height: 5,
                                      borderRadius: '50%',
                                      backgroundColor: DOT_COLORS[alert.dot],
                                      flexShrink: 0,
                                  }}
                              />
                          )}
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{alert.text}</span>
                      </div>
                  </Tooltip>
              );
          }


     function AlertsCell({ data }) {
        const alerts = computeAlerts(data);
        if (alerts.length === 0) return null;

        return (
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignContent: 'flex-start',
                    // gridTemplateColumns: "auto auto",
                    gap: 2,   // was 3
                    padding: '6px 0',
                    width: '100%',
                    height: '100%',
                    boxSizing: 'border-box',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                }}
            >
                {data.newTriggerAlert && <NewBlinkBadge text={data.newTriggerAlert} />}

                {alerts.map((a) => (
                    <AlertRow key={a.key} alert={a} />
                ))}
            </div>
        );
    }

     const sumFields = [
        // "totalRevenue_NoofTalentStr",
        "revenue_On10PerCTCStr",
        "todayProfile_Shared_Target",
        "profile_Shared_Target",
        "profile_Shared_Achieved",
        "interview_Scheduled_Target",
        "noOfCallsGivenDay"
    ];

    // Fields that are formatted currency strings (₹ symbol + Indian-style commas)
    // and need parsing before summing, then reformatting after.
    const currencyFields = ["totalRevenue_NoofTalentStr"];

    const parseCurrencyString = (value) => {
        if (value == null || value === "") return null;
        // Strip everything except digits, decimal point, and minus sign
        const cleaned = String(value).replace(/[^0-9.-]/g, "");
        if (cleaned === "" || isNaN(cleaned)) return null;
        return Number(cleaned);
    };

    const formatAsINRCurrency = (value) => {
        return "₹" + Number(value).toLocaleString("en-IN", {
            maximumFractionDigits: 0,
        });
    };

     const getTotalRow = (rows, columnDefs) => {
        const total = {
            taName: "Total",
        };

          const uniqueRows = Array.from(
        new Map(
            rows.map(row => [
                row.hrNumber, // HR ID field
                row
            ])
        ).values()
    );

        columnDefs.forEach((col) => {
            const field = col.field;

            if (!field || field === "taName") return;
            if (!sumFields.includes(field)) return;

            let sum = 0;
            let hasNumericValue = false;
            const isCurrencyField = currencyFields.includes(field);

            uniqueRows.filter(i=> !i.isTotalRow).forEach((row) => {
                const rawValue = row[field];

                if (isCurrencyField) {
                    const parsed = parseCurrencyString(rawValue);
                    if (parsed !== null) {
                        sum += parsed;
                        hasNumericValue = true;
                    }
                }else if (field === "revenue_On10PerCTCStr"){
                    const billRate = parseFloat(
                      String(row.totalRevenue_NoofTalentStr ?? "").replace(/[^0-9.-]/g, "")
                    ) || 0;
                    const talentPayRate = parseFloat(
                      String(row.talent_AnnualCTC_Budget_INRValueStr ?? "").replace(/[^0-9.-]/g, "")
                    ) || 0;
                    const computedNRUSD = billRate - talentPayRate;
                    sum += computedNRUSD  ;
                  
                    hasNumericValue = true;

                } else if (typeof rawValue === "number") {
                    sum += rawValue;
                    hasNumericValue = true;
                } else if (
                    typeof rawValue === "string" &&
                    rawValue.trim() !== "" &&
                    !isNaN(rawValue)
                ) {
                    sum += Number(rawValue);
                    hasNumericValue = true;
                }
            });

            if (hasNumericValue) {
        
                total[field] = sum;
            }
        });

        return total;
    };

   
  
    function HrAlertCell(props) {
        const { data, context } = props
        if (props.node.rowPinned) {
            return "";
        }

        return <div
            onClick={() => openAlertDetail(data)}
            style={{ cursor: 'pointer', height: '100%', width: '100%' }}
        >
            <AlertsCell data={data} />
        </div>


    }

     const ControlledAmountCell = ({ text, values, field, editable = true, onSaved }) => {
  const [isEdit, setIsEdit] = useState(false);

  const getCurrencySymbol = (value) => {
    const match = String(value ?? "").match(/^[^\d-]+/);
    return match ? match[0] : "";
  };

  const removeFormatting = (value) => {
    return String(value ?? "").replace(/[^0-9.-]/g, "");
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
      message.success("value updated");
      onSaved && onSaved(Number(role));
    } else {
      message.error(result.responseBody);
    }
    setIsEdit(false);
  };

  const handleChange = (e) => {
    let value = e.target.value;
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
      style={{
        display: "flex",
        alignItems: "center",
        textAlign:'center',
        justifyContent:'center',
        cursor: editable ? "pointer" : "default",   // ← visual cue it's locked
      }}
      onDoubleClick={() => {
        if (!editable) return;                       // ← block edit entry
        setRole(removeFormatting(role));
        setIsEdit(true);
      }}
    >
      {role ? formatAmount(role, currencySymbol) : ""}
    </div>
  );
};

  // const ControlledAmountCell = ({ text, values, field }) => {
  //   const [isEdit, setIsEdit] = useState(false);

  //   const getCurrencySymbol = (value) => {
  //     const match = String(value ?? "").match(/^[^\d-]+/);
  //     return match ? match[0] : "";
  //   };

  //   const removeFormatting = (value) => {
  //     return String(value ?? "").replace(/[^0-9.]/g, "");
  //   };

  //   const formatAmount = (value, symbol) => {
  //     if (value === "" || value == null) return "";

  //     return (
  //       symbol +
  //       Number(value).toLocaleString("en-US", {
  //         minimumFractionDigits: 0,
  //         maximumFractionDigits: 2,
  //       })
  //     );
  //   };

  //   const currencySymbol = useMemo(() => getCurrencySymbol(text), [text]);

  //   const [role, setRole] = useState(removeFormatting(text));

  //   useEffect(() => {
  //     setRole(removeFormatting(text));
  //   }, [text]);

  //   const saveEditRole = async () => {
  //     if (role === "") {
  //       setIsEdit(false);
  //       return;
  //     }

  //     let pl = {
  //       TaskID: values.id,
  //       TAHeadUserID: `${selectedHead}`,
  //       UplersFeesPer: null,
  //       TotalRevenue_NoofTalent: null,
  //       Revenue_On10PerCTC: null,
  //       Talent_AnnualCTC_Budget_INRValue: null,
  //     };

  //     pl[field] = Number(role);

  //     const result = await TaDashboardDAO.updateContractDetailsRequestDAO(pl);
  //     if (result?.statusCode === HTTPStatusCode.OK) {
  //       message.success(result.responseBody.message);
  //     } else {
  //       message.error(result.responseBody);
  //     }

  //     setIsEdit(false);
  //   };

  //   const handleChange = (e) => {
  //     let value = e.target.value;

  //     // Allow only numbers and one decimal point
  //     value = value.replace(/[^0-9.]/g, "");

  //     const parts = value.split(".");
  //     if (parts.length > 2) {
  //       value = parts[0] + "." + parts.slice(1).join("");
  //     }

  //     setRole(value);
  //   };

  //   if (isEdit) {
  //     return (
  //       <div style={{ display: "flex", alignItems: "center" }}>
  //         <input
  //           className={taStyles.editRoalField}
  //           style={{
  //             border: role ? "1px solid #CECCCC" : "1px solid red",
  //             width: "100%",
  //             textAlign: "center",
  //             borderRadius: "6px",
  //             padding: "2px",
  //           }}
  //           type="text"
  //           value={role}
  //           onChange={handleChange}
  //           autoFocus
  //           onBlur={() => {
  //             if (+role === +removeFormatting(text)) {
  //               setIsEdit(false);
  //             } else {
  //               saveEditRole();
  //             }
  //           }}
  //         />
  //       </div>
  //     );
  //   }

  //   return (
  //     <div
  //       style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
  //       onDoubleClick={() => {
  //         setRole(removeFormatting(role));
  //         setIsEdit(true);
  //       }}
  //     >
  //       {role ? formatAmount(role, currencySymbol) : "N/A"}
  //     </div>
  //   );
  // };

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
          message.success("value updated")
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
      return <div style={{ display: 'flex', alignItems: 'center', justifyContent:'center' }} onDoubleClick={() => setIsEdit(true)}>

        {role}
      </div>
    }
  }

  const updateNotes = async (pl, index) => {
    // setTaListData(prev => {
    //   let tempD = [...prev]
    //   tempD[index] = { ...tempD[index], latestNotesTopRow: pl.Comments, latestNotes: pl.Comments }
    //   return tempD
    // })
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
      filterParams: { type: 'status', list: Array.from(new Set(TaListData?.map(i => i.taName)))?.map(v => ({ data: v })) },
      filter: MultiConditionTextFilter,
      rowSpan: (params) => params.data?.rowSpan || 1,
      // valueFormatter: (params) => params.data?.rowSpan > 0 ? params.value : '',
      cellStyle: (params) => ({
        borderBottom: params.data?.rowSpan === 0 ? 'none' : '',
        borderTop: params.data?.rowSpan > 0 ? '1px solid #4C4E641F' : '',
      }),
      cellRenderer:(props)=>{
        const {data, value} = props
           if (props.node.rowPinned === "bottom") {
        return <strong>Total</strong>;
    }
        if (data?.isTotalRow){
    return null;
  }
  return value
      }
    },
    {
      headerName: 'Company',
      field: 'companyName',
      width: 220,
      pinned: 'left',
     
      suppressMovable: true,
      filter: MultiConditionTextFilter,
      cellRenderer: (props) => {
        const { data, api } = props;
        const ind = getRowIndex(data);

         if (props.node.rowPinned === "bottom") {
        return "";
    }

            if (data?.isTotalRow) {
    return null;
  }
        return (
          <div
          //  className={taStylesNew["company-cell"]}
            style={{ display: 'flex' ,alignItems: 'center',
    gap: '5px',
    height: '100%'}}>


            <div style={{ display: 'flex', justifyContent:'start',width:'30px' }}>
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
                      getHRLISTForComapny(data?.company_ID, data?.tA_Head_UserID);
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 0C10.4288 0 7.91543 0.762437 5.77759 2.1909C3.63975 3.61935 1.97351 5.64968 0.989572 8.02512C0.0056327 10.4006 -0.251811 13.0144 0.249797 15.5362C0.751405 18.0579 1.98953 20.3743 3.80762 22.1924C5.6257 24.0105 7.94208 25.2486 10.4638 25.7502C12.9856 26.2518 15.5995 25.9944 17.9749 25.0104C20.3503 24.0265 22.3807 22.3603 23.8091 20.2224C25.2376 18.0846 26 15.5712 26 13C25.9957 9.55351 24.6247 6.2494 22.1876 3.81236C19.7506 1.37532 16.4465 0.00430006 13 0ZM18 14H14V18C14 18.2652 13.8946 18.5196 13.7071 18.7071C13.5196 18.8946 13.2652 19 13 19C12.7348 19 12.4804 18.8946 12.2929 18.7071C12.1054 18.5196 12 18.2652 12 18V14H8.00001C7.73479 14 7.48044 13.8946 7.2929 13.7071C7.10536 13.5196 7.00001 13.2652 7.00001 13C7.00001 12.7348 7.10536 12.4804 7.2929 12.2929C7.48044 12.1054 7.73479 12 8.00001 12H12V8C12 7.73478 12.1054 7.48043 12.2929 7.29289C12.4804 7.10536 12.7348 7 13 7C13.2652 7 13.5196 7.10536 13.7071 7.29289C13.8946 7.48043 14 7.73478 14 8V12H18C18.2652 12 18.5196 12.1054 18.7071 12.2929C18.8946 12.4804 19 12.7348 19 13C19 13.2652 18.8946 13.5196 18.7071 13.7071C18.5196 13.8946 18.2652 14 18 14Z" fill="#8A8A8A" />
                    </svg>
                  </button>
                </Tooltip>

              )}
            </div>
            <Tooltip title={data.companyName}>
              <span className={taStylesNew["company-name"]} style={{
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontWeight: 500,
                fontSize: '10px',
                lineHeight: "10px",
                width:'70%'
              }}>
                {data?.companyName?.length > 20 ? `${data.companyName.slice(0, 18)}...` : data.companyName}
              </span>
            </Tooltip>
          </div>
        );
      },
    },
      {
      headerName: 'HR ID',
      field: 'hrNumber',
      width: 150,
      suppressMovable: true,
      pinned: 'left',
      filter: MultiConditionTextFilter,
        cellStyle: (params) => ({
        textAlign: 'center',
       ...(duplicateColorMap[params.data?.hrNumber]
        ? { backgroundColor: duplicateColorMap[params.data?.hrNumber] }
        : {}),
    }),
      autoHeight: true,
      cellRenderer: (props) => {
        const { data } = props;
        return (
         
           
          
              <span
                // className={taStylesNew["hr-id-chip"]}
                style={{
                  cursor: "pointer", color: "blue",
                  /* font-weight: bold; */
                  textDecoration: " underline",
                  margin: '0px',
                  fontSize:'10px'
                }}
                onClick={() => {
                  window.open(UTSRoutes.ALLHIRINGREQUESTROUTE + `/${data.hiringRequest_ID}`, "_blank");
                }}
              >
                {data.hrNumber}
              </span>
          
        
        );
      },
    },
    {
      headerName: 'HR Title',
      field: 'hrTitle',
      width: 220,
      suppressMovable: true,
      pinned: 'left',
      filter: MultiConditionTextFilter,
      autoHeight: true,
      cellRenderer: (props) => {
        const { data } = props;
        return (
          <div 
          // className={taStylesNew["hr-title-cell"]}
          style={{
            display:'flex',
            alignItems:'center'
          }}
          >
            {/* <Tooltip title={data.tA_HR_Status}>
              <span className={taStylesNew["hr-status-box"]}  style={{ background: data?.hrColorCode, marginRight:'5px' }}> */}

                {/* <span className={taStylesNew["hr-status-tooltip"]}>{data.tA_HR_Status}</span> */}
              {/* </span>
            </Tooltip> */}
           
              <Tooltip title={data.hrTitle}><span style={{
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize:'10px',
                fontWeight: 400,
                // lineHeight: "10px"
              }}>{data.hrTitle}</span></Tooltip>

              {/* <span 
                // className={taStylesNew["hr-id-chip"]}*/}
                {/* style={{
                  cursor: "pointer", color: "blue",
                  /* font-weight: bold; */}
                  {/* textDecoration: " underline",
                  margin: '0px'
                }} */}
                {/* onClick={() => {
                  window.open(UTSRoutes.ALLHIRINGREQUESTROUTE + `/${data.hiringRequest_ID}`, "_blank");
                }}
              >
                {data.hrNumber}
              </span> */}
         
          </div>
        );
      },
    },
    
       {
            headerName: 'Alerts',
            field: 'hrAlert',
            width: 200,
            pinned: 'left',
            suppressMovable: true,
            cellRenderer: HrAlertCell,
            filter: false,
            // tooltipField: 'hrTitle',

        },
    
    {
      headerName: 'Status',
      field: 'taskStatus',
      pinned: 'left',
      suppressMovable: true,
      filterParams: { type: 'status', list: filtersList?.TaskStatus },
      filter: MultiConditionTextFilter,
      width: 120,
      cellRenderer: (props) => {
        const { value, data } = props;
        const ind = getRowIndex(data);

         if (props.node.rowPinned === "bottom") {
        return "";
    }
         if (data?.isTotalRow) {
    return null;
  }
        return <TaskStatusComp text={value} result={data} index={ind} style={{ fontSize: '10px' }} />;
      },
    },
    {
      headerName: 'Priority',
      field: 'task_Priority',

      suppressMovable: true,
      filterParams: { type: 'status', list: filtersList?.priority?.map(i => ({ ...i, data: i.text })) },
      filter: MultiConditionTextFilter,
      width: 100,
      cellRenderer: (props) => {
        const { value, data } = props;
        const ind = getRowIndex(data);
         if (props.node.rowPinned === "bottom") {
        return "";
    }
         if (data?.isTotalRow) {
    return null;
  }
        return <PriorityComp text={value} result={data} index={ind} />;
      },
    },
    {
      headerName: "Yesterday's Submission Target",
      field: 'profile_Shared_Target',
      width: 100,
       cellStyle: { textAlign: 'center' },
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
      // cellRenderer: (props) => {
      //   const { data, ind } = props;
      //   const rowIndex = getRowIndex(data);
      //   return (
      //     <div style={{ display: "flex", justifyContent:'center', alignItems:'center' }}>
      //       {data.task_StatusID === 1 ? (
      //         <p
      //           style={{ color: "blue", fontWeight: "bold", textDecoration: "underline", cursor: "pointer", margin: 0 }}
      //           onClick={() => {
      //             setShowProfileTarget(true);
      //             setStartTargetDate(startDate);
      //             setProfileTargetDetails({ ...data, index: rowIndex });
      //           }}
      //         >
      //           {data?.profile_Shared_Target ?? 0}
      //         </p>
      //       ) :""}
      //     </div>
      //   );
      // },
    },
   
     {
      headerName: "Today's Interview Schedule",
      field: 'interview_Scheduled_Target',
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
         if (data?.isTotalRow) {
    return null;
  }
        return (
          <div style={{ display: "flex", justifyContent:'center', alignItems:'center' }}>
           {data.interview_Scheduled_Target ?? "NA"}
          </div>
        );
      },
    },
    {
      headerName: '# Rounds',
      field: 'no_of_InterviewRounds',
      width: 130,
      filterParams: { type: 'number' },
      filter: MultiConditionTextFilter,
      cellRenderer: (props) => {
        const { data, value, ind } = props;
        if (data?.isTotalRow) return null;
       return value
       },
      cellStyle: { textAlign: 'center' },
    },
    {
      headerName: 'AM',
      field: 'am',
      width: 100,
      filter: MultiConditionTextFilter,
    },
    {
      headerName: 'NBD / Existing',
      field: 'businessType',
      width: 130,
      filterParams: { type: 'status', list: [{ data: "Existing" }, { data: "NBD" }] },
      cellStyle: { textAlign: 'center' },
      filter: MultiConditionTextFilter,
    },
    {
      headerName: 'Pricing Model',
      field: 'pricingModel',
      width: 140,
      filterParams: { type: 'status', list: [{ data: "Transparent" }, { data: "Non Transparent" }] },
      filter: MultiConditionTextFilter,
    },
    {
      headerName: 'Talent Pay Rate (USD)',
      field: 'talent_AnnualCTC_Budget_INRValueStr',
      width: 160,
      filterParams: { type: 'number' },
      filter: MultiConditionTextFilter,
      cellRenderer: (props) => (
        <ControlledAmountCell
          text={props.data.talent_AnnualCTC_Budget_INRValueStr}
          values={props.data}
          field={"Talent_AnnualCTC_Budget_INRValue"}
           onSaved={(newTalentPayRate) => recalcAndSave(props.data, { talentPayRate: newTalentPayRate })}
        />
      ),
    },
    {
      headerName: 'NR %',
      field: 'uplersFeesPer',
      filterParams: { type: 'number' },
      width: 100,
        cellStyle: (params) => ({
        textAlign: 'center',
        ...(params.data?.isTotalRow ? { backgroundColor: '#D6CDEC' } : {}),   // 👈 merged with existing textAlign
    }),
      filter: MultiConditionTextFilter,
      cellRenderer: (props) => {
         const { data } = props;
  if (data?.isTotalRow) {
    return <strong>{data.uplersFeesPer}</strong>;
  }
      return  <ControlledCellComp text={props.data.uplersFeesPer} values={props.data} />
      },
    },
    {
      headerName: 'NR (USD)',
      field: 'revenue_On10PerCTCStr',
      filterParams: { type: 'number' },
      width: 140,
          cellStyle: (params) => ({
        textAlign: 'center',
        ...(params.data?.isTotalRow ? { backgroundColor: '#D6CDEC' } : {}),   // 👈 merged with existing textAlign
    }),
      filter: MultiConditionTextFilter,
       cellRenderer: (props) => {
        const { data } = props;

          if (props.node.rowPinned === "bottom") {
        return data.revenue_On10PerCTCStr;
    }

        if (data?.isTotalRow) {
          return (
            <strong>
              {data.revenue_On10PerCTCStr?.toLocaleString("en-US")}
            </strong>
          );
        }

        // NR (USD) = Bill Rate - Talent Pay Rate, per row
        const billRate = parseFloat(
          String(data.totalRevenue_NoofTalentStr ?? "").replace(/[^0-9.-]/g, "")
        ) || 0;
        const talentPayRate = parseFloat(
          String(data.talent_AnnualCTC_Budget_INRValueStr ?? "").replace(/[^0-9.-]/g, "")
        ) || 0;
        const computedNRUSD = billRate - talentPayRate;

        return (
          <ControlledAmountCell
            text={computedNRUSD}
            values={data}
            field={"Revenue_On10PerCTC"}
            editable={false}
          />
        );
      },
    },
    {
      headerName: 'Bill Rate',
      field: 'totalRevenue_NoofTalentStr',
      width: 140,
      filter: MultiConditionTextFilter,
      cellStyle: (params) => ({
        textAlign: 'center',
        ...(params.data?.isTotalRow ? { backgroundColor: '#D6CDEC' } : {}),  
    }),
      filterParams: { type: 'number' },
      cellRenderer: (props) => {
        const { data } = props;

        if (data?.isTotalRow) {
          return (
            <strong>
              {((Number(data.totalRevenue_NoofTalentStr || 0).toFixed(2)) *100).toFixed(2)}%
            </strong>
          );
        }

        return (
          <ControlledAmountCell
            text={data.totalRevenue_NoofTalentStr}
            values={data}
            field={"TotalRevenue_NoofTalent"}
            onSaved={(newBillRate) => recalcAndSave(data, { billRate: newBillRate })}
          />
        );
      }
    },
    {
      headerName: 'Active TRs',
      field: 'activeTR',
      width: 110,
      filter: MultiConditionTextFilter,
      filterParams: { type: 'number' },
      cellStyle: (params) => ({
        textAlign: 'center',
        ...(params.data?.isTotalRow ? { backgroundColor: '#D6CDEC' } : {}),  
    }),
       cellRenderer: (props) => {
    const { data } = props;
    if (data?.isTotalRow) {
      return <strong>{data.activeTR}</strong>;
    }
    return data.activeTR;
  },
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
      filterParams: { type: 'number' },
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
      suppressKeyboardEvent: (params) => {
        const isEnterKey = params.event.key === 'Enter';
        const isEditing = params.editing;
        //   console.log("is edit",params)
        if (isEditing && isEnterKey) {
          // Return true to tell AG Grid: "Ignore this Enter key, let the textarea handle it"
          return true;
        }
        return false;
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
      cellRender: LatestNotesCell
      // cellRenderer: (props) => {
      //   const { data } = props;
      //   const ind = getRowIndex(data);
      //   return data?.latestNotes ? (
      //     <>
      //       <div className={taStylesNew["latest-update"]} dangerouslySetInnerHTML={{ __html: data.latestNotes }}></div>
      //       {/* <div className={taStylesNew["view-edit"]}>
      //                   <button onClick={() => AddComment(data, ind)}>Edit</button>
      //               </div> */}
      //     </>
      //   ) : "";
      // },
    },
          
            {
                headerName: "Yesterday's Target Achieved",
                field: 'profile_Shared_Achieved',
                cellStyle: { textAlign: 'center' },
                width: 150,
                filterParams: { type: 'number'},
                filter: MultiConditionTextFilter,
                // cellRenderer: ProfileSharedTargetCell,
                cellRenderer: (props) => {
                    const { value, data } = props
                    if (props.node.rowPinned) {
                        return value;
                    }
                      if (data?.isTotalRow) {
    return null;
  }
                    return <p
                        style={{ color: 'blue', fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer', margin: 0, textAlign: "center" }}
                        onClick={() => {
                            getTalentProfilesDetailsfromGoalsTable({
                                result: data,
                                statusID: 2,
                                stageID: '',
                                isToday: false
                            })
                        }}
                    >
                        {value}
                    </p>
                }
            },
             {
      headerName: "Today's Submission Target",
      field: 'todayProfile_Shared_Target',
      width: 160,
      filterParams: { type: 'number'},
      cellStyle: { textAlign: 'center' },
      filter: MultiConditionTextFilter,
      cellRenderer: ProfileSharedTargetCell,
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
          if (props.node.rowPinned === "bottom") {
        return "";
    }
        return (
          <div>
            <IconContext.Provider
              value={{ color: "#FFDA30", style: { width: "14px", height: "14px", cursor: "pointer" } }}
            >
              <Tooltip title="Edit" placement="top">
                <span onClick={() => editTAforTask(data)} style={{ padding: "0" }}>
                  <GrEdit />
                </span>
              </Tooltip>
            </IconContext.Provider>

            {/* {[2, 56, 96, 65, 49, 176, 443, 436, 302].includes(userData.UserId) &&  ( )} */}
            <IconContext.Provider
              value={{ color: "red", style: { width: "14px", height: "14px", marginLeft: "10px", cursor: "pointer" } }}
            >
              <Tooltip title="Remove" placement="top">
                <span onClick={() => handleRemoveTask(data)} style={{ padding: "0" }}>
                  <IoIosRemoveCircle />
                </span>
              </Tooltip>
            </IconContext.Provider>

          </div>
        );
      },
    },
  ];

  const columnDefs = useMemo(() => gridColumns(), [TaListData]);

  const pinnedBottomRowData = useMemo((par) => {
            return [getTotalRow(TaListData, gridColumns())];
        }, [TaListData]);


  const scrumDefaultColDef = {
    resizable: true,
    sortable:false,
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
      let originalObj = gridColumns()
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

      // console.log(columnOrder,shortorder,newOrderObj ,originalObj )

      return newOrderObj
    } else {
      return gridColumns()
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
    if (params.toIndex + 1 < 6) return


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
    <>
     <div
                    style={{
                        display: 'flex',
                        gap: 32,
                        margin: '0 20px',
                        borderBottom: '1px solid var(--uplers-border-color)',
                    }}
                >
                    <button
                        onClick={() => setTabTitle('A')}
                        style={{
                            background: 'none',
                            border: 'none',
                            padding: '8px 0 12px',
                            fontSize: 15,
                            fontWeight: TabTitle === 'A' ? 600 : 400,
                            color: TabTitle === 'A' ? '#000' : '#8c8c8c',
                            borderBottom: TabTitle === 'A' ? '2px solid #FFDA30' : '2px solid transparent',
                            cursor: 'pointer',
                        }}
                    >
                        Active
                    </button>

                    <button
                        onClick={() => setTabTitle('C')}
                        style={{
                            background: 'none',
                            border: 'none',
                            padding: '8px 0 12px',
                            fontSize: 15,
                            fontWeight: TabTitle === 'C' ? 600 : 400,
                            color: TabTitle === 'C' ? '#000' : '#8c8c8c',
                            borderBottom: TabTitle === 'C' ? '2px solid #FFDA30' : '2px solid transparent',
                            cursor: 'pointer',
                        }}
                    >
                        Covered
                    </button>
                    <button
                        onClick={() => setTabTitle('P')}
                        style={{
                            background: 'none',
                            border: 'none',
                            padding: '8px 0 12px',
                            fontSize: 15,
                            fontWeight: TabTitle === 'P' ? 600 : 400,
                            color: TabTitle === 'P' ? '#000' : '#8c8c8c',
                            borderBottom: TabTitle === 'P' ? '2px solid #FFDA30' : '2px solid transparent',
                            cursor: 'pointer',
                        }}
                    >
                        Pause
                    </button>
                </div>
                 <div className={`${taStylesNew["table-container"]} ${gridStyles["grid-wrapper"]}`} style={{ marginTop: '20px' }}>
      {isLoading ? <TableSkeleton /> : <div style={{ height: 500 }} ><AgGridReact
        //  onGridReady={onGridReady}
        // onFirstDataRendered={params => updatePinnedTotalRow(params.api)}
        //  theme={scrumGridTheme}
        rowData={TaListData}
        // columnDefs={columnDefs}
       
        columnDefs={gridOrderedColumns}
        // animateRows={false}
         headerHeight={38}
                            rowHeight={25}
        defaultColDef={scrumDefaultColDef}
        //   getRowId={(params) => String(params.data.id)}
        suppressScrollOnNewData={true}
        suppressRowTransform={true}
        //               headerHeight={38}
        // rowHeight={"auto"}
        onColumnMoved={onColumnMoved}
        onColumnResized={onColumnResized}
         pinnedBottomRowData={pinnedBottomRowData}
          getRowStyle={(params) => {
                                if (params.node.rowPinned) {
                                    return {
                                        backgroundColor: '#F4F6F8',
                                        fontWeight: '700',
                                        borderTop: '2px solid #D9DEE3',
                                        color: '#1F2937'
                                    };
                                }

                                return null;
                            }}
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

      <AlertDetailModal
                    open={showAlertDetailModal}
                    data={alertDetailData}
                    onClose={() => {
                        setShowAlertDetailModal(false);
                        setAlertDetailData({});
                    }}
                />
    </>
   
  )
}

export default DashboardTableComp