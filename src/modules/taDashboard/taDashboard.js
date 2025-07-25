import React, { useEffect, useState, useCallback, Suspense } from "react";
import taStyles from "./tadashboard.module.css";
import {
  Select,
  Table,
  Modal,
  Tooltip,
  InputNumber,
  message,
  Skeleton,
  Checkbox,
} from "antd";
import { IoIosRemoveCircle } from "react-icons/io";
import { GrEdit } from "react-icons/gr";
import spinGif from "assets/gif/RefreshLoader.gif";
import { InputType } from "constants/application";
import UTSRoutes from "constants/routes";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import { ReactComponent as ArrowDownSVG } from "assets/svg/arrowDownLight.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ReactComponent as SearchSVG } from "assets/svg/search.svg";
import { ReactComponent as CloseSVG } from "assets/svg/close.svg";
import { TaDashboardDAO } from "core/taDashboard/taDashboardDRO";
import { ReactComponent as FunnelSVG } from "assets/svg/funnel.svg";
import { HTTPStatusCode } from "constants/network";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import OnboardFilerList from "modules/onBoardList/OnboardFilterList";
import { allHRConfig } from "modules/hiring request/screens/allHiringRequest/allHR.config";
import { allEngagementConfig } from "modules/engagement/screens/engagementList/allEngagementConfig";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import _, { isBoolean } from "lodash";
import { IoMdAddCircle } from "react-icons/io";
import { IconContext } from "react-icons";
import { downloadToExcel } from "modules/report/reportUtils";
import { UserSessionManagementController } from "modules/user/services/user_session_services";
import Editor from "modules/hiring request/components/textEditor/editor";
import { All_Hiring_Request_Utils } from "shared/utils/all_hiring_request_util";
import { useForm } from "react-hook-form";
import { BsClipboard2CheckFill } from "react-icons/bs";
import MoveToAssessment from "modules/hiring request/components/talentList/moveToAssessment";
import { InterviewDAO } from "core/interview/interviewDAO";
import LogoLoader from "shared/components/loader/logoLoader";
import Diamond from "assets/svg/diamond.svg";
import PowerIcon from "assets/svg/powerRed.svg";
import { allCompanyRequestDAO } from "core/company/companyDAO";
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";

const { Option } = Select;

export default function TADashboard() {
  const navigate = useNavigate();
  const [selectedHead, setSelectedHead] = useState("");
  const [searchText, setSearchText] = useState("");
  const [debounceSearchText, setDebouncedSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modalLoader, setModalLoader] = useState(false);
  const [filtersList, setFiltersList] = useState({});
  const [filteredTagLength, setFilteredTagLength] = useState(0);
  const [getHTMLFilter, setHTMLFilter] = useState(false);
  const [isAllowFilters, setIsAllowFilters] = useState(false);
  const [appliedFilter, setAppliedFilters] = useState(new Map());
  const [checkedState, setCheckedState] = useState(new Map());
  const [TaListData, setTaListData] = useState([]);
  const [allTAUsersList, setAllTAUsersList] = useState([]);
  const [isAddNewRow, setIsAddNewRow] = useState(false);
  const [tableFilteredState, setTableFilteredState] = useState({
    filterFields_OnBoard: {
      taUserIDs: null,
      roleTypeIDs: null,
      hrStatusIDs: null,
      taskStatusIDs: null,
      modelType: null,
      priority: null,
      searchText: "",
    },
  });
  const [newTAUservalue, setNewTAUserValue] = useState("");
  const [newTAHeadUservalue, setNewTAHeadUserValue] = useState("");
  const [getCompanyNameSuggestion, setCompanyNameSuggestion] = useState([]);
  const [hrListSuggestion, setHRListSuggestion] = useState([]);
  const [newTAHRvalue, setNewTAHRValue] = useState("");
  const [newTRAllData, setTRAllData] = useState({});
  const [selectedCompanyID, setselectedCompanyID] = useState("");
  const [newTaskError, setNewTaskError] = useState(false);
  const [isAddingNewTask, setAddingNewTask] = useState(false);

  const [showTalentProfiles, setShowTalentProfiles] = useState(false);
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);
  const [profileStatusID, setProfileStatusID] = useState(0);
  const [loadingTalentProfile, setLoadingTalentProfile] = useState(false);
  const [profileInfo, setInfoforProfile] = useState({});
  const [hrTalentList, setHRTalentList] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [filteredTalentList, setFilteredTalentList] = useState(hrTalentList);
  const [dailyActivityTargets, setDailyActiveTargets] = useState([]);
  const [totalRevenueList, setTotalRevenueList] = useState([]);
  const [hrTalentListFourCount, setHRTalentListFourCount] = useState([]);
  const date = new Date();
  const [startTargetDate, setStartTargetDate] = useState(date);
  const [startDate, setStartDate] = useState(date);
  const [showGoal, setShowGoal] = useState(false);
  const [showActivePipeline, setShowActivePipeline] = useState(true);
  const [goalLoading, setgoalLoading] = useState(false);
  const [pipelineLoading, setpipelineLoading] = useState(false);
  const [goalList, setGoalList] = useState([]);

  const [showEditTATask, setShowEditTATask] = useState(false);
  const [editTATaskData, setEditTATaskData] = useState();
  const [isEditNewTask, setEditNewTask] = useState(false);

  const [showComment, setShowComment] = useState(false);
  const [showDiamondRemark, setShowDiamondRemark] = useState(false);
  const [companyIdForRemark, setCompanyIdForRemark] = useState(0);

  const {
    watch,
    register,
    setError,
    handleSubmit,
    resetField,
    clearErrors,
    formState: { errors },
  } = useForm();
  const [remDiamondLoading, setRemDiamondLoading] = useState(false);

  const [commentData, setCommentData] = useState({});
  const [allCommentList, setALLCommentsList] = useState([]);
  const [isCommentLoading, setIsCommentLoading] = useState(false);

  const [showProfileTarget, setShowProfileTarget] = useState(false);
  const [profileTargetDetails, setProfileTargetDetails] = useState({});
  const [targetValue, setTargetValue] = useState(5);

  const [moveToAssessment, setMoveToAssessment] = useState(false);
  const [talentToMove, setTalentToMove] = useState({});
  const [summaryData, setSummaryData] = useState({});
  const {
    register: remarkregiter,
    handleSubmit: remarkSubmit,
    resetField: resetRemarkField,
    clearErrors: clearRemarkError,
    formState: { errors: remarkError },
  } = useForm();
  const [saveRemarkLoading, setSaveRemarkLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const [isShowDetails, setIsShowDetails] = useState({
    isBoolean: false,
    title: "",
    value: "",
    isTotal: false,
    TAName: "",
  });
  const [allShowDetails, setAllShowDetails] = useState([]);
  const [isCarryFwdStatus, setIsCarryFwdStatus] = useState(false);
  const [PipelineTupeId, setPipelineTupeId] = useState(0);
  useEffect(() => {
    const getUserResult = async () => {
      let userData = UserSessionManagementController.getUserSession();
      if (userData) setUserData(userData);
    };
    getUserResult();
  }, []);

  // const groupedData = groupByRowSpan(rawData, 'ta');

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

  useEffect(() => {
    setTimeout(() => setSearchText(debounceSearchText), 2000);
  }, [debounceSearchText]);

  const getAllTAUsersList = async () => {
    let req = await TaDashboardDAO.geAllTAUSERSRequestDAO();
    if (req.statusCode === HTTPStatusCode.OK) {
      setAllTAUsersList(req.responseBody);
    }
  };

  useEffect(() => {
    getAllTAUsersList();
  }, []);

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

  const HRStatusComp = ({ text, result, index }) => {
    const [value, setValue] = useState(text ?? "");
    const colorCode =
      filtersList?.HRStatus?.find((v) => v.data === value)?.colorCode ?? "";
    return (
      <div className={taStyles.tableSelectField}>
        {" "}
        <Select
          defaultValue={value}
          style={{ color: colorCode }}
          onChange={(val) => {
            setValue(val);
            let valobj = filtersList?.HRStatus?.find((i) => i.data === val);
            updateTARowValue(valobj, "tA_HR_StatusID", result, index);
          }}
        >
          {filtersList?.HRStatus?.map((v) => (
            <Option style={{ color: v.colorCode }} value={v.data}>
              {v.data}
            </Option>
          ))}
        </Select>
      </div>
    );
  };
  const InboundOutboundComp = ({ text, result, index }) => {
    const [value, setValue] = useState(text ?? "");
    const colorCode =
      filtersList?.RoleTypes?.find((v) => v.data === value)?.colorCode ?? "";
    return (
      <div className={taStyles.tableSelectField}>
        <Select
          defaultValue={value}
          style={{ color: colorCode }}
          onChange={(val) => {
            setValue(val);
            let valobj = filtersList?.RoleTypes?.find((i) => i.data === val);
            updateTARowValue(valobj, "role_TypeID", result, index);
          }}
        >
          {filtersList?.RoleTypes?.map((v) => (
            <Option style={{ color: v.colorCode }} value={v.data}>
              {v.data}
            </Option>
          ))}
        </Select>
      </div>
    );
  };

  const TaskStatusComp = ({ text, result, index }) => {
    const [value, setValue] = useState(text ?? "");
    const colorCode =
      filtersList?.TaskStatus?.find((v) => v.data === value)?.colorCode ?? "";
    return (
      <div className={taStyles.tableSelectField}>
        <Select
          defaultValue={value}
          style={{ color: colorCode }}
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

  const InterviewRoundComp = ({ text, result, index }) => {
    const [value, setValue] = useState(text ?? "");

    return (
      <InputNumber
        value={value}
        onChange={(v) => {
          setValue(v);
        }}
        onBlur={() =>
          updateTARowValue(value, "no_of_InterviewRounds", result, index)
        }
      />
    );
  };

  const handleTableFilterChange = (pagination, filters, sorter) => {
    // setFilteredInfo(filters);
    //  setTableFilteredState(prev=>({
    //   filterFields_OnBoard: {
    //     ...prev.filterFields_OnBoard,
    //     modelType: filters.modelType !== null ? filters.modelType.toString() : null ,
    //     priority: filters.task_Priority !== null ? filters.task_Priority.toString() : null,
    //   },
    // }))
    // setSortedInfo(sorter );
  };

  const getCompanySuggestionHandler = async (userValue, searchtext) => {
    const payload = {
      taUserID: userValue,
      companySearchText: "",
    };
    let response = await TaDashboardDAO.getTACompanyListDAO(payload);
    if (response?.statusCode === HTTPStatusCode.OK) {
      setCompanyNameSuggestion(
        response?.responseBody?.map((item) => ({
          ...item,
          label: item.company,
          value: item.id,
        }))
      );
    } else if (
      response?.statusCode === HTTPStatusCode.BAD_REQUEST ||
      response?.statusCode === HTTPStatusCode.NOT_FOUND
    ) {
      setCompanyNameSuggestion([]);
    }
  };

  const getHRLISTForComapny = async (id) => {
    const pl = {
      companyID: id,
    };
    let response = await TaDashboardDAO.getHRlistFromCompanyDAO(pl);
    if (response?.statusCode === HTTPStatusCode.OK) {
      setHRListSuggestion(
        response?.responseBody?.map((item) => ({
          ...item,
          value: item.hrNumber,
          id: item.hrid,
        }))
      );
    } else if (
      response?.statusCode === HTTPStatusCode.BAD_REQUEST ||
      response?.statusCode === HTTPStatusCode.NOT_FOUND
    ) {
      setHRListSuggestion([]);
    }
  };

  const handleRemoveTask = (result) => {
    setShowConfirmRemove(true);
    setInfoforProfile(result);
  };

  const getTalentProfilesDetailsfromGoalsTable = async (
    result,
    statusID,
    stageID
  ) => {
    setShowTalentProfiles(true);
    setInfoforProfile(result);
    let pl = {
      hrID: result?.hiringRequest_ID,
      statusID: statusID,
      stageID: statusID === 0 ? null : stageID ? stageID : 0,
      targetDate: moment(startDate).format("YYYY-MM-DD"),
    };
    setLoadingTalentProfile(true);
    const hrResult = await TaDashboardDAO.getHRTalentDetailsRequestDAO(pl);
    setLoadingTalentProfile(false);
    if (hrResult.statusCode === HTTPStatusCode.OK) {
      setHRTalentList(hrResult.responseBody);
      setFilteredTalentList(hrResult.responseBody);
      setHRTalentListFourCount(hrResult.responseBody);
    } else {
      setHRTalentList([]);
      setFilteredTalentList([]);
    }
  };

  const getTalentProfilesDetailsfromTable = async (
    result,
    statusID,
    stageID
  ) => {
    setShowTalentProfiles(true);
    setInfoforProfile(result);
    let pl = {
      hrID: result?.hiringRequest_ID,
      statusID: statusID,
      stageID: statusID === 0 ? null : stageID ? stageID : 0,
    };
    setLoadingTalentProfile(true);
    const hrResult = await TaDashboardDAO.getHRTalentDetailsRequestDAO(pl);
    setLoadingTalentProfile(false);
    if (hrResult.statusCode === HTTPStatusCode.OK) {
      setHRTalentList(hrResult.responseBody);
      setFilteredTalentList(hrResult.responseBody);
      setHRTalentListFourCount(hrResult.responseBody);
    } else {
      setHRTalentList([]);
      setFilteredTalentList([]);
    }
  };

  const handleSearchInput = (value) => {
    setSearchTerm(value);
    const filteredData = hrTalentList.filter(
      (talent) =>
        talent.talent.toLowerCase().includes(value.toLowerCase()) ||
        (talent.email &&
          talent.email.toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredTalentList(filteredData);
  };

  const getTalentProfilesDetails = async (result, statusID, stageID) => {
    setShowTalentProfiles(true);
    setInfoforProfile(result);
    let pl = {
      hrID: result?.hiringRequest_ID,
      statusID: statusID,
      stageID: statusID === 0 ? null : stageID ? stageID : 0,
    };
    setLoadingTalentProfile(true);
    const hrResult = await TaDashboardDAO.getHRTalentDetailsRequestDAO(pl);
    setLoadingTalentProfile(false);
    if (hrResult.statusCode === HTTPStatusCode.OK) {
      setHRTalentList(hrResult.responseBody);
      setFilteredTalentList(hrResult.responseBody);
    } else {
      setHRTalentList([]);
      setFilteredTalentList([]);
    }
  };

  const getTotalRevenue = async () => {
    setpipelineLoading(true);
    let result = await TaDashboardDAO.getTotalRevenueRequestDAO();
    let dailyResult = await TaDashboardDAO.getDailyActiveTargetsDAO();
    setpipelineLoading(false);
    if (result?.statusCode === HTTPStatusCode.OK) {
      if (result.responseBody.length) {
        const lastRow = {
          ...result.responseBody[result.responseBody.length - 1],
          bandwidthper: "",
          goalRevenueStr: "",
          taName: "",
          sumOfTotalRevenue: result.responseBody[0].sumOfTotalRevenue,
          sumOfTotalRevenueStr: result.responseBody[0].sumOfTotalRevenueStr,
          taUserID: result.responseBody[0].taUserID,
          totalRevenuePerUser: result.responseBody[0].totalRevenuePerUser,
          totalRevenuePerUserStr: result.responseBody[0].totalRevenuePerUserStr,
          TOTALROW: true,
        };

        setSummaryData(lastRow);
        setTotalRevenueList(result.responseBody);
      } else {
        setTotalRevenueList([]);
      }
    } else {
      setTotalRevenueList([]);
    }
    if (dailyResult?.statusCode === HTTPStatusCode.OK) {
      setDailyActiveTargets(dailyResult.responseBody);
    }
  };

  const HRTextCol = ({hrText, title,row}) =>{
    let formatted = hrText?.replace(/\(([^)]+)\)/g, (_, name) => `( <div style="color:rgb(179, 76, 1);font-weight: 600" >${name.trim()}</div> )`)

    if(title === 'Achieve Pipeline (INR)' || title === 'PreOnboarding Pipeline (INR)'){
      return <div dangerouslySetInnerHTML={{__html:formatted}}  style={{ textDecoration: "underline", cursor:'pointer' }} onClick={()=> window.open(`/allhiringrequest/${row.hiringRequest_ID}`, '_blank', 'noopener,noreferrer')} ></div>
    }
    
    return   <a
            href={`/allhiringrequest/${row.hiringRequest_ID}`}
            style={{ textDecoration: "underline" }}
            target="_blank"
            rel="noreferrer"
          >
            {hrText}
          </a>
  }

  const getGoalsDetails = async (date, head, tA_UserID) => {
    let pl = {
      taUserIDs: tA_UserID,
      taHeadID: head,
      targetDate: moment(date).format("YYYY-MM-DD"),
    };
    setgoalLoading(true);
    const goalResult = await TaDashboardDAO.getGoalsDetailsRequestDAO(pl);
    setgoalLoading(false);

    if (goalResult.statusCode === HTTPStatusCode.OK) {
      setGoalList(goalResult.responseBody);
    } else {
      setGoalList([]);
    }
  };

  useEffect(() => {
    if (selectedHead) {
      getGoalsDetails(
        startDate,
        selectedHead,
        tableFilteredState.filterFields_OnBoard.taUserIDs
      );
    }
  }, [selectedHead, startDate, tableFilteredState]);

  useEffect(() => {
    getTotalRevenue();
  }, []);

  const editTAforTask = (task) => {
    setShowEditTATask(true);
    getCompanySuggestionHandler(task.tA_UserID);
    getHRLISTForComapny(task.company_ID);
    setNewTAHeadUserValue(selectedHead);
    setEditTATaskData(task);
  };

  const getAllComments = async (id) => {
    setIsCommentLoading(true);
    const result = await TaDashboardDAO.getALLCommentsDAO(id);
    setIsCommentLoading(false);
    if (result.statusCode === HTTPStatusCode.OK) {
      setALLCommentsList(result.responseBody);
    } else {
      setALLCommentsList([]);
    }
  };

  const handleProfileShearedTarget = async () => {
    let pl = {
      task_ID: profileTargetDetails?.id,
      tA_Head_UserID: selectedHead,
      tA_UserID: profileTargetDetails?.tA_UserID,
      target_StageID: 1,
      target_Number: targetValue,
      target_Date: moment(startTargetDate).format("YYYY-MM-DD"), // today's date
    };
    setLoadingTalentProfile(true);
    let result = await TaDashboardDAO.insertProfileShearedTargetDAO(pl);
    setLoadingTalentProfile(false);
    if (result.statusCode === HTTPStatusCode.OK) {
      setShowProfileTarget(false);
      setGoalList(result.responseBody);
      let valobj = filtersList?.TaskStatus?.find((i) => i.data === "Fasttrack");
      updateTARowValue(
        valobj,
        "task_StatusID",
        profileTargetDetails,
        profileTargetDetails?.index,
        targetValue
      );
      setTargetValue(5);
      setStartTargetDate(new Date());
      setProfileTargetDetails({});
    } else {
      message.error("Something went wrong!");
    }
  };

  const showDetails = async (pipeLineTypeId, data, title, value, isTotal) => {
    if (pipeLineTypeId == 7 || pipeLineTypeId == 8) setIsCarryFwdStatus(true);
    else setIsCarryFwdStatus(false);
    setPipelineTupeId(pipeLineTypeId);
    setModalLoader(true);
    const month = moment(new Date()).format("MM");
    const year = moment(new Date()).format("YYYY");
    let pl = {
      pipelineTypeID: pipeLineTypeId,
      taUserID: data?.taUserID,
      month: Number(month),
      year: Number(year),
    };
    let result = await TaDashboardDAO.getTAWiseHRPipelineDetailsDAO(pl);
    setModalLoader(false);
    if (result?.statusCode === HTTPStatusCode.OK) {
      setIsShowDetails({
        isBoolean: true,
        title: title,
        value: value,
        isTotal: isTotal,
        TAName: data?.taName,
      });
      setAllShowDetails(result?.responseBody);
    }
  };

  const AddComment = (data, index) => {
    getAllComments(data.id);
    setShowComment(true);
    setCommentData({ ...data, index });
  };

  const totalRevenueColumns = [
    {
      title: "TA",
      dataIndex: "taName",
      key: "taName",
      width: 120,
      render: (text, result) => {
        return text ? text : "-";
      },
    },
    {
      title: "Goal (INR)",
      dataIndex: "goalRevenueStr",
      key: "goalRevenueStr",
      width: 130,
      align: "center",
      render: (text, result) => {
        return text ? text : "-";
      },
    },
    {
      title: (
        <>
          Assigned <br />
          Pipeline (INR)
        </>
      ),
      dataIndex: "totalRevenuePerUserStr",
      key: "totalRevenuePerUserStr",
      align: "center",
      width: 150,
      render: (text, result) => {
        return text ? (
          <div
            style={{ cursor: "pointer" }}
            onClick={() =>
              showDetails(0, result, "Assigned Pipeline (INR)", text)
            }
          >
            {text}
          </div>
        ) : (
          "-"
        );
      },
    },
    {
      title: (
        <>
          Carry Fwd <br />
          Pipeline (INR)
        </>
      ),
      dataIndex: "carryFwdPipelineStr",
      key: "carryFwdPipelineStr",
      width: 150,
      align: "center",
      render: (text, result) => {
        return (
          <div
            className={taStyles.todayText}
            style={{ background: "#babaf5", cursor: "pointer" }}
            onClick={() =>
              showDetails(7, result, "Carry Fwd Pipeline (INR)", text)
            }
          >
            {text}
          </div>
        );
      },
    },
    {
      title: (
        <>
          Carry Fwd <br />
          Not Included <br />
          Pipeline (INR)
        </>
      ),
      dataIndex: "carryFwdHoldPipelineStr",
      key: "carryFwdHoldPipelineStr",
      width: 170,
      align: "center",
      render: (text, result) => {
        return (
          <div
            className={taStyles.todayText}
            style={{ background: "lightyellow", cursor: "pointer" }}
            onClick={() =>
              showDetails(
                8,
                result,
                "Carry Fwd Not Included Pipeline (INR)",
                text
              )
            }
          >
            {text}
          </div>
        );
      },
    },
    {
      title: (
        <>
          Current Month
          <br />
          Active
          <br />
          Pipeline (INR)
        </>
      ),
      dataIndex: "currentMonthActualPipelineStr",
      key: "currentMonthActualPipelineStr",
      width: 150,
      align: "center",
      render: (text, result) => {
        return (
          <div
            style={{ cursor: "pointer" }}
            onClick={() =>
              showDetails(
                1,
                result,
                "Current Month Active Pipeline (INR)",
                text
              )
            }
          >
            {text}
          </div>
        );
      },
    },
    {
      title: (
        <>
          Total Active
          <br />
          Pipeline (INR)
        </>
      ),
      dataIndex: "actualPipelineStr",
      key: "actualPipelineStr",
      width: 150,
      align: "center",
      render: (text, result) => {
        return (
          <div
            className={taStyles.today1Text}
            style={{ cursor: "pointer" }}
            onClick={() =>
              showDetails(10, result, "Total Active Pipeline (INR)", text)
            }
          >
            {text}
          </div>
        );
      },
    },
    {
      title: "Multiplier",
      dataIndex: "bandwidthper",
      key: "bandwidthper",
      width: 80,
      align: "center",
      render: (text, result) => {
        return text ? text : "-";
      },
    },
    {
      title: (
        <>
          Achieve <br />
          Pipeline (INR)
        </>
      ),
      dataIndex: "achievedPipelineStr",
      key: "achievedPipelineStr",
      width: 180,
      align: "center",
      render: (text, result) => {
        return (
          <div
            className={taStyles.todayText}
            style={{ cursor: "pointer" }}
            onClick={() =>
              showDetails(3, result, "Achieve Pipeline (INR)", text)
            }
          >
            {text}
          </div>
        );
      },
    },
    {
      title: "Lost Pipeline (INR)",
      dataIndex: "lostPipelineStr",
      key: "lostPipelineStr",
      width: 160,
      align: "center",
      render: (text, result) => {
        return (
          <div
            className={taStyles.todayText}
            style={{ background: "lightsalmon", cursor: "pointer" }}
            onClick={() => showDetails(4, result, "Lost Pipeline (INR)", text)}
          >
            {text}
          </div>
        );
      },
    },
    {
      title: "Hold Pipeline (INR)",
      dataIndex: "holdPipelineStr",
      key: "holdPipelineStr",
      width: 150,
      align: "center",
      render: (text, result) => {
        return (
          <div
            className={taStyles.todayText}
            style={{ background: "lightyellow", cursor: "pointer" }}
            onClick={() => showDetails(5, result, "Hold Pipeline (INR)", text)}
          >
            {text}
          </div>
        );
      },
    },
    {
      title: (
        <>
          PreOnboarding <br />
          Pipeline (INR)
        </>
      ),
      dataIndex: "preOnboardingPipelineStr",
      key: "preOnboardingPipelineStr",
      width: 150,
      align: "center",
      render: (text, result) => {
        return (
          <div
            className={taStyles.todayText}
            style={{ background: "lightpink", cursor: "pointer" }}
            onClick={() =>
              showDetails(6, result, "PreOnboarding Pipeline (INR)", text)
            }
          >
            {text}
          </div>
        );
      },
    },
  ];

  const daiyTargetColumns = [
    {
      title: (
        <>
          Carry Fwd <br />
          Pipeline (INR)
        </>
      ),
      dataIndex: "carryFwdPipeLineStr",
      key: "carryFwdPipeLineStr",
      align: "center",
      render: (text, result) => {
        return (
          <div
            className={taStyles.today1Text}
            style={{ background: "#babaf5", cursor: "pointer" }}
            onClick={() =>
              showDetails(7, { taUserID: 2 }, "Carry Fwd Pipeline (INR)", text)
            }
          >
            {text}
          </div>
        );
      },
    },
    {
      title: (
        <>
          Carry Fwd Not <br />
          Included Pipeline (INR)
        </>
      ),
      dataIndex: "carryFwdHoldPipelineStr",
      key: "carryFwdHoldPipelineStr",
      align: "center",
      render: (text, result) => {
        return (
          <div
            className={taStyles.today1Text}
            style={{ background: "lightyellow", cursor: "pointer" }}
            onClick={() =>
              showDetails(
                8,
                { taUserID: 2 },
                "Carry Fwd Not Included Pipeline (INR)",
                text
              )
            }
          >
            {text}
          </div>
        );
      },
    },
    {
      title: <>Added HR (New)</>,
      dataIndex: "activeHRPipeLineStr",
      key: "activeHRPipeLineStr",
      align: "center",
      render: (text, result) => {
        return (
          <div
            className={taStyles.today1Text}
            style={{ background: "#f0f0f0", cursor: "pointer" }}
            onClick={() =>
              showDetails(9, { taUserID: 2 }, "Added HR (New)", text)
            }
          >
            {text}
          </div>
        );
      },
    },
    {
      title: (
        <>
          Achieve <br />
          Pipeline (INR)
        </>
      ),
      dataIndex: "achievedHRPipeLineStr",
      key: "achievedHRPipeLineStr",
      align: "center",
      render: (text, result) => {
        return (
          <div
            className={taStyles.todayText}
            style={{ cursor: "pointer" }}
            onClick={() =>
              showDetails(3, { taUserID: 2 }, "Achieve Pipeline (INR)", text)
            }
          >
            {text ? text : "-"}
          </div>
        );
      },
    },
    {
      title: <>Lost Pipeline (INR)</>,
      dataIndex: "lostHRPipeLineStr",
      align: "center",
      key: "lostHRPipeLineStr",
      render: (text, result) => {
        return (
          <div
            className={taStyles.today2Text}
            style={{ background: "lightsalmon", cursor: "pointer" }}
            onClick={() =>
              showDetails(4, { taUserID: 2 }, "Lost Pipeline (INR)", text)
            }
          >
            {text}
          </div>
        );
      },
    },
    {
      title: (
        <>
          Total Active
          <br />
          Pipeline (INR)
        </>
      ),
      dataIndex: "totalActivePipeLineStr",
      key: "totalActivePipeLineStr",
      align: "center",
      render: (text, result) => {
        return (
          <div
            className={taStyles.today1Text}
            style={{ cursor: "pointer" }}
            onClick={() =>
              showDetails(
                10,
                { taUserID: 2 },
                "Total Active Pipeline (INR)",
                text
              )
            }
          >
            {text}
          </div>
        );
      },
    },
    {
      title: (
        <>
          Today Total Profile <br /> Shared Target
        </>
      ),
      dataIndex: "today_ProfilesharedTarget",
      key: "today_ProfilesharedTarget",
      align: "center",
      render: (text) => {
        return <div className={taStyles.today2Text}>{text}</div>;
      },
    },
    {
      title: (
        <>
          Today Total Profile <br />
          Shared Achieved
        </>
      ),
      dataIndex: "today_ProfilesharedAchieved",
      key: "today_ProfilesharedAchieved",
      render: (text) => {
        return <div className={taStyles.today2Text}>{text}</div>;
      },
    },
    {
      title: (
        <>
          Today Total L1 <br />
          Round Scheduled
        </>
      ),
      dataIndex: "today_L1Round",
      key: "today_L1Round",
      align: "center",
      render: (text) => {
        return <div className={taStyles.today2Text}>{text}</div>;
      },
    },
    {
      title: (
        <>
          Yesterday Total Profile <br />
          Shared Target
        </>
      ),
      dataIndex: "yesterday_ProfilesharedTarget",
      key: "yesterday_ProfilesharedTarget",
      align: "center",
      render: (text) => {
        return <div className={taStyles.yesterdayText}>{text}</div>;
      },
    },
    {
      title: (
        <>
          Yesterday Total Profile <br /> Shared Achieved
        </>
      ),
      dataIndex: "yesterday_ProfilesharedAchieved",
      key: "yesterday_ProfilesharedAchieved",
      align: "center",
      render: (text) => {
        return <div className={taStyles.yesterdayText}>{text}</div>;
      },
    },
    {
      title: (
        <>
          Yesterday Total L1 <br /> Round Scheduled
        </>
      ),
      dataIndex: "yesterday_L1Round",
      key: "yesterday_L1Round",
      align: "center",
      render: (text) => {
        return <div className={taStyles.yesterdayText}>{text}</div>;
      },
    },
  ];

  const goalColumns = [
    {
      title: "TA",
      dataIndex: "ta",
      key: "ta",
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
    },
    {
      title: "HR Title",
      dataIndex: "hrTitle",
      key: "hrTitle",
    },

    {
      title: "Profiles Shared Target",
      dataIndex: "profiles_Shared_Target",
      key: "profiles_Shared_Target",
      align: "center",
      render: (text, result) => {
        if (result?.hrTitle === "TOTAL") return text;
        const today = new Date();
        const selected = new Date(startDate);

        // Clear time for comparison
        today.setHours(0, 0, 0, 0);
        selected.setHours(0, 0, 0, 0);

        const isPastDate = selected < today;
        if (isPastDate) return text;
        return (
          <Tooltip title={"Edit Target"}>
            <p
              style={{
                color: "green",
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                setShowProfileTarget(true);
                setStartTargetDate(startDate);
                setProfileTargetDetails({
                  ...result,
                  id: result?.taskID,
                  tA_UserID: result?.taUserID,
                  fromGoalsTable: true,
                });
              }}
            >
              {text}
            </p>
          </Tooltip>
        );
      },
    },
    {
      title: "Profiles Shared Achieved",
      dataIndex: "profiles_Shared_Achieved",
      key: "profiles_Shared_Achieved",
      align: "center",
      render: (text, result) => {
        if (result?.hrTitle === "TOTAL") return text;
        return +text > 0 ? (
          <p
            style={{
              color: "blue",
              fontWeight: "bold",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() => {
              getTalentProfilesDetailsfromGoalsTable(
                {
                  ...result,
                  hiringRequest_ID: result.hiringRequestID,
                  companyName: result.company,
                  taName: result.ta,
                  hrNumber: result.hrTitle,
                  isFromGoal: true,
                },
                2
              );
              setProfileStatusID(2);
              setHRTalentListFourCount([]);
            }}
          >
            {text}
          </p>
        ) : (
          ""
        );
      },
    },
    {
      title: "L1 Interviews Scheduled",
      dataIndex: "interviews_Done_Target",
      key: "interviews_Done_Target",
      align: "center",
      render: (text, result) => {
        if (result?.hrTitle === "TOTAL") return text;
        return +text > 0 ? (
          <p
            style={{
              color: "blue",
              fontWeight: "bold",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() => {
              getTalentProfilesDetailsfromGoalsTable(
                {
                  ...result,
                  hiringRequest_ID: result.hiringRequestID,
                  companyName: result.company,
                  taName: result.ta,
                  hrNumber: result.hrTitle,
                  isFromGoal: true,
                },
                3
              );
              setProfileStatusID(3);
              setHRTalentListFourCount([]);
            }}
          >
            {text}
          </p>
        ) : (
          ""
        );
      },
    },
    // {
    //   title: "Interviews Done Achieved",
    //   dataIndex: "interviews_Done_Achieved",
    //   key: "interviews_Done_Achieved",
    // },
  ];

  const ProfileColumns = [
    {
      title: "Submission Date",
      dataIndex: "profileSubmittedDate",
      key: "profileSubmittedDate",
    },
    {
      title: "Talent",
      dataIndex: "talent",
      key: "talent",
    },
    {
      title: "Status",
      dataIndex: "talentStatus",
      key: "talentStatus",
      render: (_, item) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {All_Hiring_Request_Utils.GETTALENTSTATUS(
            parseInt(item?.talentStatusColor),
            item?.talentStatus
          )}

          {(item?.statusID === 2 || item?.statusID === 3) && (
            <IconContext.Provider
              value={{
                color: "#FFDA30",
                style: { width: "16px", height: "16px", cursor: "pointer" },
              }}
            >
              <Tooltip title="Move to Assessment" placement="top">
                <span
                  // style={{
                  //   background: 'red'
                  // }}
                  onClick={() => {
                    setMoveToAssessment(true);
                    setTalentToMove((prev) => ({ ...prev, ctpID: item.ctpid }));
                  }}
                  style={{ padding: "0" }}
                >
                  {" "}
                  <BsClipboard2CheckFill />
                </span>{" "}
              </Tooltip>
            </IconContext.Provider>
          )}
        </div>
      ),
    },
    {
      title: "Interview Detail",
      dataIndex: "talentStatusDetail",
      key: "talentStatusDetail",
    },
    {
      title: "Submitted By",
      dataIndex: "profileSubmittedBy",
      key: "profileSubmittedBy",
    },
  ];

  //  const handleSubmitCompanyType = async () => {
  //     setIsLoading(true);
  //     let payload = {
  //       basicDetails: {
  //         companyID: getcompanyID,
  //         companyType: watch("companyType"),
  //       },
  //       IsUpdateFromPreviewPage: true,
  //     };
  //     let res = await allCompanyRequestDAO.updateCompanyDetailsDAO(payload);
  //     if (res?.statusCode === HTTPStatusCode.OK) {
  //       getDetails();
  //       setIsEditCompanyType(false);
  //     }
  //     setIsLoading(false);
  //   };

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

  const columns = [
    {
      title: "TA",
      dataIndex: "taName",
      fixed: "left",
      width: "100px",
      render: (value, row, index) => {
        return {
          children: (
            <div style={{ verticalAlign: "top" }}>
              {value}
              <br />{" "}
              {/* <IconContext.Provider
                value={{
                  color: "green",
                  style: {
                    width: "30px",
                    height: "30px",
                    marginTop: "5px",
                    cursor: "pointer",
                  },
                }}
              >
                {" "}
                <Tooltip title={`Add task for ${value}`} placement="top">
                  <span
                    onClick={() => {
                      setIsAddNewRow(true);
                      setNewTAUserValue(row.tA_UserID);
                      setNewTAHeadUserValue(selectedHead);
                      getCompanySuggestionHandler(row.tA_UserID);
                    }}
                    className={taStyles.feedbackLabel}
                    style={{ padding: "10px" }}
                  >
                    {" "}
                    <IoMdAddCircle
                      onClick={() => {
                        setIsAddNewRow(true);
                        setNewTAUserValue(row.tA_UserID);
                        setNewTAHeadUserValue(selectedHead);
                      }}
                    />
                  </span>{" "}
                </Tooltip>
              </IconContext.Provider> */}
            </div>
          ),
          props: {
            rowSpan: row.rowSpan,
            style: { verticalAlign: "top" }, // This aligns the merged cell content to the top
          },
        };
      },
    },
    // {
    //   title: "Company",
    //   dataIndex: "companyName",
    //   key: "companyName",
    //   fixed: "left",
    //   width: "120px",
    //   render: (text, row) => (
    //     <>
    //       {" "}
    //       <a
    //         href={"/viewCompanyDetails/" + `${row.company_ID}`}
    //         target="_blank"
    //         rel="noreferrer"
    //       >
    //         {text}
    //       </a>{" "}
    //       {
    //         <>
    //           <img src={Diamond} alt="info" style={{ width: '20px', height: '20px' }} />
    //         </>
    //       }
    //       {userData?.showTADashboardDropdowns && (
    //         <>
    //           <br />
    //           <IconContext.Provider
    //             value={{
    //               color: "green",
    //               style: {
    //                 width: "30px",
    //                 height: "30px",
    //                 marginTop: "5px",
    //                 cursor: "pointer",
    //               },
    //             }}
    //           >
    //             {" "}
    //             <Tooltip
    //               title={`Add task for TA ${row.taName} in ${text}`}
    //               placement="top"
    //             >
    //               <span
    //                 onClick={() => {
    //                   setIsAddNewRow(true);
    //                   setNewTAUserValue(row.tA_UserID);
    //                   setNewTAHeadUserValue(selectedHead);
    //                   getCompanySuggestionHandler(row.tA_UserID);
    //                   setselectedCompanyID(row?.company_ID);
    //                   getHRLISTForComapny(row?.company_ID);
    //                 }}
    //                 className={taStyles.feedbackLabel}
    //                 style={{ padding: "10px" }}
    //               >
    //                 {" "}
    //                 <IoMdAddCircle />
    //               </span>{" "}
    //             </Tooltip>
    //           </IconContext.Provider>
    //         </>
    //       )}

    //     </>
    //   ),
    // },
    {
      title: "Company",
      dataIndex: "companyName",
      key: "companyName",
      fixed: "left",
      width: "180px",
      render: (text, row, index) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          {/* Company Name + Diamond Icon */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              flexWrap: "wrap",
            }}
          >
            <a
              href={`/viewCompanyDetails/${row.company_ID}`}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#1890ff", fontWeight: 500 }}
            >
              {text}
            </a>

            {row?.companyCategory === "Diamond" && (
              <>
                <img
                  src={Diamond}
                  alt="info"
                  style={{ width: "16px", height: "16px" }}
                />
                {(userData?.UserId === 2 ||
                userData?.UserId === 333 ||
                userData?.UserId === 190 || userData?.UserId === 96 ) &&    <div
                  onClick={() => {
                    setShowDiamondRemark(true);
                    setCompanyIdForRemark({ ...row, index: index });
                  }}
                >
                  <Tooltip title="Remove Diamond">
                    <img
                      src={PowerIcon}
                      alt="info"
                      style={{
                        width: "16px",
                        height: "16px",
                        cursor: "pointer",
                      }}
                    />
                  </Tooltip>
                </div>}
             
              </>
            )}
            {row?.companyCategory !== "Diamond" &&
              (userData?.UserId === 2 ||
                userData?.UserId === 333 ||
                userData?.UserId === 190 || userData?.UserId === 96 ) && (
                <Checkbox onChange={() => setDiamondCompany(row, index)}>
                  Make Diamond
                </Checkbox>
              )}
          </div>

          {userData?.showTADashboardDropdowns && (
            <>
              {/* <br /> */}
              <IconContext.Provider
                value={{
                  color: "green",
                  style: {
                    width: "30px",
                    height: "30px",
                    marginTop: "5px",
                    cursor: "pointer",
                  },
                }}
              >
                {" "}
                <Tooltip
                  title={`Add task for TA ${row.taName} in ${text}`}
                  placement="top"
                >
                  <span
                    onClick={() => {
                      setIsAddNewRow(true);
                      setNewTAUserValue(row.tA_UserID);
                      setNewTAHeadUserValue(selectedHead);
                      getCompanySuggestionHandler(row.tA_UserID);
                      setselectedCompanyID(row?.company_ID);
                      getHRLISTForComapny(row?.company_ID);
                    }}
                    className={taStyles.feedbackLabel}
                    style={{ padding: "10px" }}
                  >
                    {" "}
                    <IoMdAddCircle />
                  </span>{" "}
                </Tooltip>
              </IconContext.Provider>
            </>
          )}
        </div>
      ),
    },

    // {
    //   title: 'HR ID',
    //   dataIndex: 'hrNumber',
    //   key: 'hrNumber',
    //   width:'120px',
    //   fixed: "left",
    // },
    {
      title: (
        <>
          HR Title /<br /> HR ID
        </>
      ),
      dataIndex: "hrTitle",
      key: "hrTitle",
      width: "120px",
      fixed: "left",
      render: (text, result) => {
        return (
          <>
            {text} /{" "}
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
                    `/${result.hiringRequest_ID}`,
                  "_blank"
                );
              }}
            >
              {result.hrNumber}
            </p>
          </>
        );
      },
    },
    {
      title: "Priority",
      dataIndex: "task_Priority",
      key: "task_Priority",
      fixed: "left",
      width: "120px",
      render: (text, result, index) => {
        return <PriorityComp text={text} result={result} index={index} />;
      },
    },

    {
      title: "Status",
      dataIndex: "taskStatus",
      key: "taskStatus",
      fixed: "left",
      render: (text, result, index) => {
        return <TaskStatusComp text={text} result={result} index={index} />;
      },
    },
    {
      title: (
        <>
          Profiles Shared <br />
          Target / Achieved /<br /> L1 Round
        </>
      ),
      dataIndex: "profile_Shared_Target",
      key: "profile_Shared_Target",
      fixed: "left",
      width: "150px",
      render: (text, result, index) => {
        return (
          <div style={{ display: "flex" }}>
            {result.task_StatusID === 1 ? (
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
                  setProfileTargetDetails({ ...result, index: index });
                }}
              >
                {text ?? 0}
              </p>
            ) : (
              text ?? 0
            )}{" "}
            / {result.profile_Shared_Achieved ?? "NA"} /{" "}
            {result.interview_Scheduled_Target ?? "NA"}
          </div>
        );
      },
    },
    {
      title: (
        <>
          Total Revenue <br />
          Opportunity <br />
          (INR)
        </>
      ),
      dataIndex: "totalRevenue_NoofTalentStr",
      key: "totalRevenue_NoofTalentStr",
      width: "115px",
      fixed: "left",
    },
    {
      title: "Contract / DP",
      dataIndex: "modelType",
      key: "modelType",
      render: (text, result, index) => {
        return <ContractDPComp text={text} result={result} index={index} />;
      },
    },

    {
      title: (
        <>
          Talent Annual <br /> Budget (INR)
        </>
      ),
      dataIndex: "talent_AnnualCTC_Budget_INRValueStr",
      key: "talent_AnnualCTC_Budget_INRValueStr",
      width: "120px",
      render: (text, result) => {
        return <Tooltip title={result.actualCostWithCurrency}>{text}</Tooltip>;
      },
    },
    {
      title: (
        <>
          Revenue <br />
          Opportunity <br />
          (10%)
        </>
      ),
      dataIndex: "revenue_On10PerCTCStr",
      key: "revenue_On10PerCTCStr",
      width: "105px",
    },
    {
      title: (
        <>
          Active
          <br />
          TRs
        </>
      ),
      dataIndex: "activeTR",
      key: "activeTR",
      width: "80px",
      // fixed: "left",
    },

    {
      title: (
        <>
          Active Profiles
          <br />
          till Date
        </>
      ),
      dataIndex: "noOfProfile_TalentsTillDate",
      key: "noOfProfile_TalentsTillDate",
      width: "115px",
      render: (text, result) => {
        return +text > 0 ? (
          <p
            style={{
              color: "blue",
              fontWeight: "bold",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() => {
              getTalentProfilesDetailsfromTable(result, 0);
              setTalentToMove(result);
              setProfileStatusID(0);
              setHRTalentListFourCount([]);
            }}
          >
            {text}
          </p>
        ) : (
          text
        );
      },
    },
    {
      title: <>Latest Updates</>,
      dataIndex: "latestNotes",
      width: "250px",
      key: "latestNotes",
      render: (text, result, index) => {
        if (text) {
          return (
            <>
              <div dangerouslySetInnerHTML={{ __html: text }}></div>
              <p
                style={{
                  color: "blue",
                  fontWeight: "bold",
                  textDecoration: "underline",
                  cursor: "pointer",
                  marginTop: "5px",
                }}
                onClick={() => {
                  AddComment(result, index);
                }}
              >
                View All
              </p>
            </>
          );
        } else {
          return (
            <p
              style={{
                color: "blue",
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                AddComment(result, index);
              }}
            >
              Add
            </p>
          );
        }
      },
    },
    {
      title: (
        <>
          Inbound <br />/ Outbound
        </>
      ),
      dataIndex: "role_Type",
      key: "role_Type",
      width: "100px",
      // fixed: "left",
      render: (text, result, index) => {
        return (
          <InboundOutboundComp text={text} result={result} index={index} />
        );
      },
    },
    {
      title: (
        <>
          #Interview <br />
          Rounds
        </>
      ),
      dataIndex: "no_of_InterviewRounds",
      key: "no_of_InterviewRounds",
      // fixed: "left",
      width: "100px",
      render: (text, result, index) => {
        return <InterviewRoundComp text={text} result={result} index={index} />;
      },
    },

    {
      title: "HR Status",
      dataIndex: "tA_HR_Status",
      key: "tA_HR_Status",
      render: (text, result, index) => {
        return <HRStatusComp text={text} result={result} index={index} />;
      },
    },
    {
      title: "Sales",
      dataIndex: "salesName",
      key: "salesName",
    },
    {
      title: "HR Created Date",
      dataIndex: "hrCreatedDate",
      key: "hrCreatedDate",
      width: "150px",
      render: (text) => {
        return moment(text).format("DD-MMM-YYYY");
      },
    },
    {
      title: (
        <>
          Open Since <br />
          {">"} 1 Month
          <br /> (Yes/no)
        </>
      ),
      dataIndex: "hrOpenSinceOneMonths",
      key: "hrOpenSinceOneMonths",
      width: "100px",
    },
    userData?.showTADashboardDropdowns
      ? {
          title: "Action",
          dataIndex: "",
          key: "",
          render: (_, row) => {
            return (
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
                        editTAforTask(row);
                      }}
                      style={{ padding: "0" }}
                    >
                      {" "}
                      <GrEdit />
                    </span>{" "}
                  </Tooltip>
                </IconContext.Provider>

                {(userData.UserId === 2 || userData.UserId === 56 || userData.UserId === 96 ) && <IconContext.Provider
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
                        handleRemoveTask(row);
                      }}
                      style={{ padding: "0" }}
                    >
                      {" "}
                      <IoIosRemoveCircle />
                    </span>{" "}
                  </Tooltip>
                </IconContext.Provider>}

                
              </div>
            );
          },
        }
      : {},
    // {
    //   title: <>#Profiles Submitted <br/> Yesterday</>,
    //   dataIndex: '',
    //   key: '',
    // },
  ];
  const getFilters = async () => {
    setIsLoading(true);
    let filterResult = await TaDashboardDAO.getAllMasterDAO();
    setIsLoading(false);
    if (filterResult.statusCode === HTTPStatusCode.OK) {
      setFiltersList(filterResult && filterResult?.responseBody);
    } else if (filterResult?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
      // setLoading(false);
      return navigate(UTSRoutes.LOGINROUTE);
    } else if (
      filterResult?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
    ) {
      // setLoading(false);
      return navigate(UTSRoutes.SOMETHINGWENTWRONG);
    } else {
      return "NO DATA FOUND";
    }
  };

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
    const result = await TaDashboardDAO.getAllTAListRequestDAO(pl);
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
    getFilters();
  }, []);

  useEffect(() => {
    if (filtersList?.HeadUsers?.length) {
      setSelectedHead(filtersList?.HeadUsers[0]?.id);
    }
  }, [filtersList?.HeadUsers]);

  useEffect(() => {
    if (selectedHead.length !== 0) {
      getListData();
    }
  }, [searchText, tableFilteredState, selectedHead]);

  const clearFilters = () => {
    setAppliedFilters(new Map());
    setCheckedState(new Map());
    setFilteredTagLength(0);
    setTableFilteredState({
      filterFields_OnBoard: {
        taUserIDs: null,
        roleTypeIDs: null,
        hrStatusIDs: null,
        taskStatusIDs: null,
        modelType: null,
        priority: null,
        searchText: "",
      },
    });
    setDebouncedSearchText("");

    setSearchText("");
  };

  const saveNewTask = async () => {
    if (newTAUservalue === "") {
      setNewTaskError(true);
      return;
    }

    if (selectedCompanyID === "") {
      setNewTaskError(true);
      return;
    }

    if (newTAHRvalue === "") {
      setNewTaskError(true);
      return;
    }

    let pl = {
      tA_UserID: newTAUservalue,
      company_ID: selectedCompanyID,
      hiringRequest_ID: newTAHRvalue,
      task_Priority: null,
      no_of_InterviewRounds: null,
      role_TypeID: null,
      task_StatusID: null,
      activeTR: newTRAllData?.activeHR,
      talent_AnnualCTC_Budget_INRValue: newTRAllData?.totalAnnualBudgetInINR,
      modelType: newTRAllData?.modelType,
      revenue_On10PerCTC: newTRAllData?.revenue10Percent,
      totalRevenue_NoofTalent: newTRAllData?.totalRevenueOppurtunity,
      noOfProfile_TalentsTillDate: newTRAllData?.noOfProfilesSharedTillDate,
      tA_HR_StatusID: 2,
      tA_Head_UserID: `${newTAHeadUservalue}`,
    };
    setAddingNewTask(true);
    let updateresult = await TaDashboardDAO.updateTAListRequestDAO(pl);
    setAddingNewTask(false);

    if (updateresult.statusCode === HTTPStatusCode.OK) {
      setNewTAUserValue("");
      setselectedCompanyID("");
      setNewTAHRValue("");
      setCompanyNameSuggestion([]);
      setTRAllData({});
      setNewTaskError(false);
      setIsAddNewRow(false);
      getListData();
    } else {
      message.error("Something went wrong");
    }
  };

  const saveRemark = async (d) => {
    let pl = {
      HiringRequestId: talentToMove?.hiringRequest_ID,
      CtpId: talentToMove?.ctpID,
      TalentId: talentToMove?.tA_UserID,
      Remark: d.remark,
    };

    setSaveRemarkLoading(true);
    const result = await InterviewDAO.updateTalentAssessmentDAO(pl);
    setSaveRemarkLoading(false);
    if (result.statusCode === HTTPStatusCode.OK) {
      setMoveToAssessment(false);
      resetRemarkField("remark");
      clearRemarkError("remark");
      getTalentProfilesDetailsfromTable(talentToMove, profileStatusID);
      // callAPI(hrId)
      // getHrUserData(hrId)
    } else {
      message.error("Something went wrong");
    }
  };

  const saveEditTask = async () => {
    let pl = {
      id: editTATaskData?.id,
      tA_UserID: editTATaskData?.tA_UserID,
      company_ID: editTATaskData?.company_ID,
      hiringRequest_ID: editTATaskData?.hiringRequest_ID,
      task_Priority: editTATaskData?.task_Priority,
      no_of_InterviewRounds: editTATaskData?.no_of_InterviewRounds,
      role_TypeID: editTATaskData?.role_TypeID,
      task_StatusID: editTATaskData?.task_StatusID,
      activeTR: editTATaskData?.activeTR,
      talent_AnnualCTC_Budget_INRValue:
        editTATaskData?.talent_AnnualCTC_Budget_INRValue,
      modelType: editTATaskData?.modelType,
      revenue_On10PerCTC: editTATaskData?.revenue_On10PerCTC,
      totalRevenue_NoofTalent: editTATaskData?.totalRevenue_NoofTalent,
      noOfProfile_TalentsTillDate: editTATaskData?.noOfProfile_TalentsTillDate,
      tA_HR_StatusID: editTATaskData?.tA_HR_StatusID,
      tA_Head_UserID: `${newTAHeadUservalue}`,
    };
    setEditNewTask(true);
    let updateresult = await TaDashboardDAO.updateTAListRequestDAO(pl);
    setEditNewTask(false);

    if (updateresult.statusCode === HTTPStatusCode.OK) {
      setShowEditTATask(false);
      getListData();
    } else {
      message.error("Something went wrong");
    }
  };

  const toggleHRFilter = useCallback(() => {
    !getHTMLFilter
      ? setIsAllowFilters(!isAllowFilters)
      : setTimeout(() => {
          setIsAllowFilters(!isAllowFilters);
        }, 300);
    setHTMLFilter(!getHTMLFilter);
  }, [getHTMLFilter, isAllowFilters]);

  const onRemoveHRFilters = () => {
    setTimeout(() => {
      setIsAllowFilters(false);
    }, 300);
    setHTMLFilter(false);
  };

  const removeTask = async (id) => {
    setLoadingTalentProfile(true);
    const result = await TaDashboardDAO.removeTaskDAO(id);
    setLoadingTalentProfile(false);
    if (result.statusCode === HTTPStatusCode.OK) {
      setShowConfirmRemove(false);
      getListData();
    } else {
      message.error("Something went wrong!");
    }
  };

  const saveComment = async (note) => {
    let pl = {
      task_ID: commentData?.id,
      comments: note,
    };
    setIsCommentLoading(true);
    const res = await TaDashboardDAO.insertTaskCommentRequestDAO(pl);
    setIsCommentLoading(false);
    if (res.statusCode === HTTPStatusCode.OK) {
      setALLCommentsList(res.responseBody);
      setTaListData((prev) => {
        let oldComments = prev[commentData?.index]?.latestNotes;
        if (oldComments !== null) {
          let newItem = `<li>${note}</li>`;
          let newDS = [...prev];
          newDS[commentData?.index] = {
            ...newDS[commentData?.index],
            latestNotes: oldComments.replace("<ul>", `<ul>${newItem}`),
          };
          return newDS;
        } else {
          let newDS = [...prev];
          let newItem = `<ul><li>${note}</li></ul>`;
          newDS[commentData?.index] = {
            ...newDS[commentData?.index],
            latestNotes: newItem,
          };
          return newDS;
        }
      });
    }
  };

  const hendleExport = (apiData) => {
    let DataToExport = apiData.map((data) => {
      let obj = {};
      columns.forEach((val, ind) => {
        if (val.title !== "Action") {
          if (val.title === "TA") {
            obj[`${val.title}`] = `${data.taName} `;
          } else if (val.key === "hrTitle") {
            obj["HR Title / HR ID "] = `${data.hrTitle} / ${data.hrNumber}`;
          } else if (val.key === "talent_AnnualCTC_Budget_INRValueStr") {
            obj["Talent Annual CTC Budget (INR)"] = `${
              data.talent_AnnualCTC_Budget_INRValueStr ?? ""
            }`;
          } else if (val.key === "revenue_On10PerCTCStr") {
            obj["Revenue Opportunity (10% on annual CTC)"] = `${
              data.revenue_On10PerCTCStr ?? ""
            }`;
          } else if (val.key === "totalRevenue_NoofTalentStr") {
            obj["Total Revenue Opportunity (INR)"] = `${
              data.totalRevenue_NoofTalentStr ?? ""
            }`;
          } else if (val.key === "noOfProfile_TalentsTillDate") {
            obj["No. of Active/Submitted Profiles till Date"] = `${
              data.noOfProfile_TalentsTillDate ?? ""
            }`;
          } else if (val.key === "role_Type") {
            obj["Inbound / Outbound"] = `${data?.role_Type ?? ""}`;
          } else if (val.key === "no_of_InterviewRounds") {
            obj["#Interview Rounds"] = `${data?.no_of_InterviewRounds ?? ""}`;
          } else if (val.key === "hrOpenSinceOneMonths") {
            obj["Open Since > 1 Month (Yes/no)"] = `${
              data?.hrOpenSinceOneMonths ?? ""
            }`;
          } else if (val.key === "latestNotes") {
            obj[
              "Latest Communication & Updates (Matcher to be Accountable)"
            ] = `${data?.latestNotes ?? ""}`;
          } else if (val.key === "profile_Shared_Target") {
            obj["Profiles Shared  Target"] = `${
              data?.profile_Shared_Target ?? ""
            }`;
          } else if (val.key === "profile_Shared_Achieved") {
            obj["Profiles  Shared  Achieved"] = `${
              data?.profile_Shared_Achieved ?? ""
            }`;
          } else if (val.key === "interview_Scheduled_Target") {
            obj["L1 Interviews Scheduled"] = `${
              data?.interview_Scheduled_Target ?? ""
            }`;
          } else if (val.key === "activeTR") {
            obj["Active TRs"] = `${data?.activeTR ?? ""}`;
          } else {
            obj[`${val.title}`] = data[`${val.key}`] ?? "";
          }
        }
      });

      return obj;
    });

    downloadToExcel(DataToExport, "TAReport");
  };

  const isSelectableDateModal = (date) => {
    const today = new Date();
    const targetDateStr = date.toDateString();
    const dayOfWeek = today.getDay();

    if (dayOfWeek === 5) {
      const validDates = [0, 1, 2, 3].map((offset) => {
        const d = new Date(today);
        d.setDate(today.getDate() + offset);
        return d.toDateString();
      });
      return validDates.includes(targetDateStr);
    } else {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      return [today.toDateString(), tomorrow.toDateString()].includes(
        targetDateStr
      );
    }
  };

  const isSelectableDate = (date) => {
    const today = new Date();
    const targetDateStr = date.toDateString();
    const dayOfWeek = today.getDay();

    // Allow selection of 5 previous days
    const pastValidDates = [-5, -4, -3, -2, -1].map((offset) => {
      const d = new Date(today);
      d.setDate(today.getDate() + offset);
      return d.toDateString();
    });

    // Add today and tomorrow logic
    const futureValidDates = (() => {
      if (dayOfWeek === 5) {
        // If today is Friday
        return [0, 1, 2, 3].map((offset) => {
          const d = new Date(today);
          d.setDate(today.getDate() + offset);
          return d.toDateString();
        });
      } else {
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        return [today.toDateString(), tomorrow.toDateString()];
      }
    })();

    const allValidDates = [...pastValidDates, ...futureValidDates];

    return allValidDates.includes(targetDateStr);
  };

  return (
    <div className={taStyles.hiringRequestContainer}>
      <div className={taStyles.filterContainer}>
        <div className={taStyles.filterSets}>
          <LogoLoader visible={modalLoader} />
          <div
            className={taStyles.filterSetsInner}
            onClick={() => setShowActivePipeline((prev) => !prev)}
          >
            <p
              className={taStyles.resetText}
              style={{ textDecoration: "none" }}
            >
              Active Pipeline Total Targets{" "}
              <ArrowDownSVG
                style={{
                  rotate: showActivePipeline ? "180deg" : "",
                  marginLeft: "10px",
                }}
              />
            </p>
          </div>
        </div>
        {showActivePipeline === true ? (
          pipelineLoading ? (
            <TableSkeleton />
          ) : (
            <>
              {userData?.showTADashboardDropdowns && (
                <div style={{ padding: "0 20px" }}>
                  <Table
                    dataSource={dailyActivityTargets}
                    columns={daiyTargetColumns}
                    pagination={false}
                  />
                </div>
              )}

              <div style={{ padding: "20px  20px" }}>
                <Table
                  dataSource={totalRevenueList}
                  columns={totalRevenueColumns}
                  pagination={false}
                  scroll={{ x: "max-content", y: "1vh" }}
                  summary={() => {
                    return (
                      <Table.Summary fixed>
                        <Table.Summary.Row>
                          <Table.Summary.Cell index={0}>
                            <div>
                              <strong>Total :</strong>
                            </div>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={1}>
                            <div style={{ textAlign: "center" }}>
                              <strong>
                                {summaryData.total_GoalStr || "-"}
                              </strong>
                            </div>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={2}>
                            <div
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                showDetails(
                                  0,
                                  { taUserID: 2 },
                                  "Assigned Pipeline (INR)",
                                  summaryData.sumOfTotalRevenueStr,
                                  true
                                )
                              }
                            >
                              {summaryData.sumOfTotalRevenueStr || "-"}
                            </div>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={3}>
                            <div
                              style={{ textAlign: "center", cursor: "pointer" }}
                              onClick={() =>
                                showDetails(
                                  7,
                                  { taUserID: 2 },
                                  "Carry Fwd Pipeline (INR)",
                                  summaryData.total_CarryFwdPipelineStr,
                                  true
                                )
                              }
                            >
                              <strong>
                                {summaryData.total_CarryFwdPipelineStr || "-"}
                              </strong>
                            </div>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={4}>
                            <div
                              style={{ textAlign: "center", cursor: "pointer" }}
                              onClick={() =>
                                showDetails(
                                  8,
                                  { taUserID: 2 },
                                  "Carry Fwd Not Included Pipeline (INR)",
                                  summaryData.total_CarryFwdHoldPipelineStr,
                                  true
                                )
                              }
                            >
                              <strong>
                                {summaryData.total_CarryFwdHoldPipelineStr ||
                                  "-"}
                              </strong>
                            </div>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={5}>
                            <div
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                showDetails(
                                  1,
                                  { taUserID: 2 },
                                  "Current Month Actual Pipeline (INR)",
                                  summaryData.total_CurrentMonthActualPipelineStr,
                                  true
                                )
                              }
                            >
                              {summaryData.total_CurrentMonthActualPipelineStr ||
                                "-"}
                            </div>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={6}>
                            <div
                              style={{ textAlign: "center", cursor: "pointer" }}
                              onClick={() =>
                                showDetails(
                                  10,
                                  { taUserID: 2 },
                                  "Total Active Pipeline (INR)",
                                  summaryData.total_ActualPipelineStr,
                                  true
                                )
                              }
                            >
                              <strong>
                                {summaryData.total_ActualPipelineStr || "-"}
                              </strong>
                            </div>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={6}>
                            <div style={{ textAlign: "center" }}></div>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={7}>
                            <div
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                showDetails(
                                  3,
                                  { taUserID: 2 },
                                  "Achieved Pipeline (INR)",
                                  summaryData.total_AchievedPipelineStr,
                                  true
                                )
                              }
                            >
                              {summaryData.total_AchievedPipelineStr || "-"}
                            </div>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={8}>
                            <div
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                showDetails(
                                  4,
                                  { taUserID: 2 },
                                  "Lost Pipeline (INR)",
                                  summaryData.total_LostPipelineStr,
                                  true
                                )
                              }
                            >
                              {summaryData.total_LostPipelineStr || "-"}
                            </div>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={9}>
                            <div
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                showDetails(
                                  5,
                                  { taUserID: 2 },
                                  "Hold Pipeline (INR)",
                                  summaryData.total_HoldPipelineStr,
                                  true
                                )
                              }
                            >
                              {summaryData.total_HoldPipelineStr || "-"}
                            </div>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={10}>
                            <div
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                showDetails(
                                  6,
                                  { taUserID: 2 },
                                  "Pre-Onboarding Pipeline (INR)",
                                  summaryData.total_PreOnboardingPipelineStr,
                                  true
                                )
                              }
                            >
                              {summaryData.total_PreOnboardingPipelineStr ||
                                "-"}
                            </div>
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      </Table.Summary>
                    );
                  }}
                  rowClassName={(record) => {
                    if (record.orderSequence === 1) return taStyles.one;
                    return "";
                  }}
                />
              </div>
            </>
          )
        ) : null}
      </div>

      <div className={taStyles.filterContainer}>
        <div className={taStyles.filterSets}>
          <Select
            id="selectedValue"
            placeholder="Select Head"
            style={{ marginLeft: "10px", width: "270px" }}
            // mode="multiple"
            value={selectedHead}
            showSearch={true}
            onChange={(value, option) => {
              setSelectedHead(value);
            }}
            options={filtersList?.HeadUsers?.map((v) => ({
              label: v.data,
              value: v.id,
            }))}
            optionFilterProp="label"
          />
        </div>
      </div>

      <div className={taStyles.filterContainer}>
        <div className={taStyles.filterSets}>
          <div
            className={taStyles.filterSetsInner}
            onClick={() => setShowGoal((prev) => !prev)}
          >
            <p
              className={taStyles.resetText}
              style={{ textDecoration: "none" }}
            >
              Goal vs Achieved Targets{" "}
              <ArrowDownSVG
                style={{ rotate: showGoal ? "180deg" : "", marginLeft: "10px" }}
              />
            </p>
          </div>

          <div className={taStyles.filterRight}>
            <div className={taStyles.calendarFilterSet}>
              <div className={taStyles.label}>Date</div>
              <div className={taStyles.calendarFilter}>
                <CalenderSVG style={{ height: "16px", marginRight: "16px" }} />
                <DatePicker
                  style={{ backgroundColor: "red" }}
                  onKeyDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className={taStyles.dateFilter}
                  placeholderText="Start date"
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="dd-MM-yyyy"
                  filterDate={isSelectableDate}
                />
              </div>
            </div>
          </div>
        </div>
        {showGoal === true ? (
          goalLoading ? (
            <TableSkeleton />
          ) : (
            <div style={{ padding: "0 50px 50px 50px" }}>
              <Table
                dataSource={goalList}
                columns={goalColumns}
                // bordered
                pagination={false}
                rowClassName={(record) =>
                  record?.hrTitle === "TOTAL" ? taStyles.totalrow : ""
                }
              />
            </div>
          )
        ) : null}
      </div>

      <div className={taStyles.filterContainer}>
        <div className={taStyles.filterSets}>
          <div className={taStyles.filterSetsInner}>
            <div className={taStyles.addFilter} onClick={toggleHRFilter}>
              <FunnelSVG style={{ width: "16px", height: "16px" }} />

              <div className={taStyles.filterLabel}> Add Filters</div>
              <div className={taStyles.filterCount}>{filteredTagLength}</div>
            </div>

            <div
              className={taStyles.searchFilterSet}
              style={{ marginLeft: "15px" }}
            >
              <SearchSVG style={{ width: "16px", height: "16px" }} />
              <input
                type={InputType.TEXT}
                className={taStyles.searchInput}
                placeholder="Search Table"
                value={debounceSearchText}
                onChange={(e) => {
                  // setSearchText(e.target.value);
                  setDebouncedSearchText(e.target.value);
                }}
              />
              {searchText && (
                <CloseSVG
                  style={{
                    width: "16px",
                    height: "16px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    // setSearchText("");
                    setDebouncedSearchText("");
                  }}
                />
              )}
            </div>
            <p
              className={taStyles.resetText}
              style={{ width: "190px" }}
              onClick={() => {
                clearFilters();
              }}
            >
              Reset Filter
            </p>
          </div>

          <div className={taStyles.filterRight}>
            {userData?.showTADashboardDropdowns && (
              <button
                className={taStyles.btnPrimary}
                onClick={() => {
                  setIsAddNewRow(true);
                  setNewTAHeadUserValue(selectedHead);
                }}
              >
                Add New Task
              </button>
            )}
            {/* <button
              className={taStyles.btnPrimary}
              onClick={() => hendleExport(TaListData)}
            >
              Export
            </button> */}
          </div>
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : TaListData?.length ? (
        <Table
          scroll={{ x: "max-content", y: "1vh" }}
          dataSource={TaListData}
          columns={columns}
          pagination={false}
          onChange={handleTableFilterChange}
        />
      ) : (
        <Table
          dataSource={[]}
          columns={columns}
          pagination={false}
          onChange={handleTableFilterChange}
        />
      )}

      {isAllowFilters && (
        <Suspense fallback={<div>Loading...</div>}>
          <OnboardFilerList
            setAppliedFilters={setAppliedFilters}
            appliedFilter={appliedFilter}
            setCheckedState={setCheckedState}
            checkedState={checkedState}
            // handleHRRequest={handleHRRequest}
            setTableFilteredState={setTableFilteredState}
            tableFilteredState={tableFilteredState}
            setFilteredTagLength={setFilteredTagLength}
            onRemoveHRFilters={() => onRemoveHRFilters()}
            getHTMLFilter={getHTMLFilter}
            hrFilterList={allHRConfig.hrFilterListConfig()}
            filtersType={allEngagementConfig.taDashboardFilterTypeConfig(
              filtersList && filtersList
            )}
            clearFilters={clearFilters}
          />
        </Suspense>
      )}

      {showConfirmRemove && (
        <Modal
          transitionName=""
          width="650px"
          centered
          footer={null}
          open={showConfirmRemove}
          // className={allEngagementStyles.engagementModalContainer}
          className="engagementModalStyle"
          // onOk={() => setVersantModal(false)}
          onCancel={() => {
            setShowConfirmRemove(false);
          }}
        >
          <>
            <div style={{ padding: "35px 15px 10px 15px" }}>
              {loadingTalentProfile ? (
                <div>
                  <Skeleton active />
                </div>
              ) : (
                <h3>
                  Are you sure you want to Remove{" "}
                  <strong>{profileInfo?.taName}</strong> for{" "}
                  {profileInfo?.hrNumber} in {profileInfo?.companyName}
                </h3>
              )}
            </div>

            <div
              style={{
                padding: "10px",
                display: "flex",
                justifyContent: "end",
              }}
            >
              <button
                className={taStyles.btnPrimary}
                disabled={loadingTalentProfile}
                onClick={() => {
                  removeTask(profileInfo?.id);
                }}
              >
                Yes Remove
              </button>
              <button
                className={taStyles.btnCancle}
                disabled={loadingTalentProfile}
                onClick={() => {
                  setShowConfirmRemove(false);
                }}
              >
                Cancel
              </button>
            </div>
          </>
        </Modal>
      )}

      {showProfileTarget && (
        <Modal
          transitionName=""
          width="400px"
          centered
          footer={null}
          open={showProfileTarget}
          // className={allEngagementStyles.engagementModalContainer}
          className="engagementModalStyle"
          // onOk={() => setVersantModal(false)}
          onCancel={() => {
            setShowProfileTarget(false);
            setTargetValue(5);
            setStartTargetDate(new Date());
          }}
        >
          <>
            <div style={{ padding: "35px 15px 10px 15px" }}>
              <h3>Profiles Shared Target</h3>
            </div>

            <div
              // className={taStyles.row}
              style={{
                // display: "flex",
                // alignItems: "center",
                padding: "0 10px 15px",
              }}
            >
              {loadingTalentProfile ? (
                <Skeleton active />
              ) : (
                <>
                  <div className={taStyles.row}>
                    <div className={taStyles.colMd6}>
                      <div
                        className={taStyles.calendarFilterSet}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "self-start",
                        }}
                      >
                        <div className={taStyles.label}>Date</div>
                        <div className={taStyles.calendarFilter}>
                          <CalenderSVG
                            style={{ height: "16px", marginRight: "16px" }}
                          />
                          <DatePicker
                            style={{ backgroundColor: "red" }}
                            onKeyDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            className={taStyles.dateFilter}
                            placeholderText="Start date"
                            selected={startTargetDate}
                            onChange={(date) => setStartTargetDate(date)}
                            dateFormat="dd-MM-yyyy"
                            filterDate={isSelectableDateModal}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={taStyles.row} style={{ marginTop: "10px" }}>
                    <div className={taStyles.colMd6}>
                      <div
                        className={taStyles.calendarFilterSet}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "self-start",
                        }}
                      >
                        <div className={taStyles.label}>Target</div>
                        <InputNumber
                          value={targetValue}
                          onChange={(v) => {
                            setTargetValue(v);
                          }}
                          min={0}
                          max={9}
                          maxLength={1}
                          placeholder="Enter target"
                          style={{
                            height: "44px",
                            padding: "8px",
                            borderRadius: "8px",
                            width: "115px",
                          }}
                        />
                      </div>
                    </div>
                    <div className={taStyles.colMd6}>
                      <div
                        style={{
                          padding: "10px",
                          display: "flex",
                          justifyContent: "end",
                          marginTop: "18px",
                        }}
                      >
                        <button
                          className={taStyles.btnPrimary}
                          // disabled={ }
                          onClick={() => {
                            handleProfileShearedTarget();
                          }}
                        >
                          Proceed
                        </button>
                        <button
                          className={taStyles.btnCancle}
                          onClick={() => {
                            setShowProfileTarget(false);
                            setTargetValue(5);
                            setStartTargetDate(new Date());
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        </Modal>
      )}

      {showTalentProfiles && (
        <Modal
          transitionName=""
          width="1000px"
          centered
          footer={null}
          open={showTalentProfiles}
          // className={allEngagementStyles.engagementModalContainer}
          className="engagementModalStyle"
          // onOk={() => setVersantModal(false)}
          onCancel={() => {
            setSearchTerm("");
            setShowTalentProfiles(false);
            setHRTalentListFourCount([]);
          }}
        >
          <>
            <div
              style={{
                padding: "45px 15px 10px 15px",
                display: "flex",
                gap: "10px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <h3>
                Profiles for <strong>{profileInfo?.hrNumber}</strong>
              </h3>

              <p style={{ marginBottom: "0.5em" }}>
                Company : <strong>{profileInfo?.companyName}</strong>
              </p>

              <p style={{ marginBottom: "0.5em" }}>
                TA : <strong>{profileInfo?.taName}</strong>
              </p>

              <input
                type="text"
                placeholder="Search talent..."
                value={searchTerm}
                onChange={(e) => handleSearchInput(e.target.value)} // Create this function
                style={{
                  padding: "6px 10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  marginLeft: "auto",
                  marginRight: "20px",
                  minWidth: "260px",
                }}
              />
            </div>

            <div
              style={{
                padding: "10px 15px",
                display: "flex",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <div
                className={taStyles.filterType}
                key={"Total Talents"}
                onClick={() => {
                  getTalentProfilesDetails(profileInfo, 0);
                  setProfileStatusID(0);
                }}
                style={{
                  borderBottom:
                    profileStatusID === 0 ? "6px solid #FFDA30" : "",
                }}
              >
                {/* <img src={FeedBack} alt="rocket" /> */}
                <h2>
                  Total Talents :{" "}
                  <span>
                    {hrTalentListFourCount[0]?.totalTalents
                      ? hrTalentListFourCount[0]?.totalTalents
                      : 0}
                  </span>
                </h2>
              </div>
              <div
                className={taStyles.filterType}
                key={"Profile shared"}
                onClick={() => {
                  getTalentProfilesDetails(profileInfo, 2);
                  setProfileStatusID(2);
                }}
                style={{
                  borderBottom:
                    profileStatusID === 2 ? "6px solid #FFDA30" : "",
                }}
              >
                {/* <img src={FeedBack} alt="rocket" /> */}
                <h2>
                  Profile shared :{" "}
                  <span>
                    {hrTalentListFourCount[0]?.profileSharedCount
                      ? hrTalentListFourCount[0]?.profileSharedCount
                      : 0}
                  </span>
                </h2>
              </div>
              <div
                className={taStyles.filterType}
                key={"In Assessment"}
                onClick={() => {
                  getTalentProfilesDetails(profileInfo, 11);
                  setProfileStatusID(11);
                }}
                style={{
                  borderBottom:
                    profileStatusID === 11 ? "6px solid #FFDA30" : "",
                }}
              >
                <h2>
                  In Assessment :{" "}
                  <span>
                    {hrTalentListFourCount[0]?.assessmentCount
                      ? hrTalentListFourCount[0]?.assessmentCount
                      : 0}
                  </span>
                </h2>
              </div>
              <div
                className={taStyles.filterType}
                key={"In Interview"}
                onClick={() => {
                  getTalentProfilesDetails(profileInfo, 3);
                  setProfileStatusID(3);
                }}
                style={{
                  borderBottom:
                    profileStatusID === 3 ? "6px solid #FFDA30" : "",
                }}
              >
                <h2>
                  In Interview :{" "}
                  <span>
                    {hrTalentListFourCount[0]?.inInterviewCount
                      ? hrTalentListFourCount[0]?.inInterviewCount
                      : 0}
                  </span>
                </h2>
              </div>
              <div
                className={taStyles.filterType}
                key={"Offered"}
                onClick={() => {
                  getTalentProfilesDetails(profileInfo, 4);
                  setProfileStatusID(4);
                }}
                style={{
                  borderBottom:
                    profileStatusID === 4 ? "6px solid #FFDA30" : "",
                }}
              >
                <h2>
                  Offered :{" "}
                  <span>
                    {hrTalentListFourCount[0]?.offeredCount
                      ? hrTalentListFourCount[0]?.offeredCount
                      : 0}
                  </span>
                </h2>
              </div>
              <div
                className={taStyles.filterType}
                key={"Hired"}
                onClick={() => {
                  getTalentProfilesDetails(profileInfo, 10);
                  setProfileStatusID(10);
                }}
                style={{
                  borderBottom:
                    profileStatusID === 10 ? "6px solid #FFDA30" : "",
                }}
              >
                <h2>
                  Hired :{" "}
                  <span>
                    {hrTalentListFourCount[0]?.hiredCount
                      ? hrTalentListFourCount[0]?.hiredCount
                      : 0}
                  </span>
                </h2>
              </div>
              <div
                className={taStyles.filterType}
                key={"Rejected, screening"}
                onClick={() => {
                  getTalentProfilesDetails(profileInfo, 7, 1);
                  setProfileStatusID(71);
                }}
                style={{
                  borderBottom:
                    profileStatusID === 71 ? "6px solid #FFDA30" : "",
                }}
              >
                <h2>
                  Screen Reject :{" "}
                  <span>
                    {hrTalentListFourCount[0]?.screeningRejectCount
                      ? hrTalentListFourCount[0]?.screeningRejectCount
                      : 0}
                  </span>
                </h2>
              </div>
              <div
                className={taStyles.filterType}
                key={"Rejected, Interview"}
                onClick={() => {
                  getTalentProfilesDetails(profileInfo, 7, 2);
                  setProfileStatusID(72);
                }}
                style={{
                  borderBottom:
                    profileStatusID === 72 ? "6px solid #FFDA30" : "",
                }}
              >
                {/* <img src={FeedBack} alt="rocket" /> */}
                <h2>
                  Interview Reject :{" "}
                  <span>
                    {hrTalentListFourCount[0]?.interviewRejectCount
                      ? hrTalentListFourCount[0]?.interviewRejectCount
                      : 0}
                  </span>
                </h2>
              </div>
            </div>

            {loadingTalentProfile ? (
              <div>
                <Skeleton active />
              </div>
            ) : (
              <div style={{ margin: "5px 10px" }}>
                <Table
                  dataSource={filteredTalentList}
                  columns={ProfileColumns}
                  // bordered
                  pagination={false}
                />
              </div>
            )}

            {moveToAssessment && (
              <Modal
                width="992px"
                centered
                footer={null}
                open={moveToAssessment}
                className="commonModalWrap"
                // onOk={() => setVersantModal(false)}
                onCancel={() => {
                  setMoveToAssessment(false);
                  resetRemarkField("remark");
                  clearRemarkError("remark");
                }}
              >
                <MoveToAssessment
                  onCancel={() => {
                    setMoveToAssessment(false);
                    resetRemarkField("remark");
                    clearRemarkError("remark");
                  }}
                  register={remarkregiter}
                  handleSubmit={remarkSubmit}
                  resetField={resetRemarkField}
                  errors={remarkError}
                  saveRemark={saveRemark}
                  saveRemarkLoading={saveRemarkLoading}
                />
              </Modal>
            )}

            <div style={{ padding: "10px 0" }}>
              <button
                className={taStyles.btnCancle}
                disabled={isAddingNewTask}
                onClick={() => {
                  setSearchTerm("");
                  setShowTalentProfiles(false);
                  setHRTalentListFourCount([]);
                }}
              >
                Cancel
              </button>
            </div>
          </>
        </Modal>
      )}

      {isAddNewRow && (
        <Modal
          transitionName=""
          width="930px"
          centered
          footer={null}
          open={isAddNewRow}
          className="engagementModalStyle"
          onCancel={() => {
            setNewTAUserValue("");
            setselectedCompanyID("");
            setCompanyNameSuggestion([]);
            setNewTAHRValue("");
            setTRAllData({});
            setNewTaskError(false);
            setIsAddNewRow(false);
          }}
        >
          <div style={{ padding: "35px 15px 10px 15px" }}>
            <h3>Add New Task</h3>
          </div>
          <div style={{ padding: "10px 15px" }}>
            {isAddingNewTask ? (
              <Skeleton active />
            ) : (
              <>
                <div className={taStyles.row}>
                  <div className={taStyles.colMd6}>
                    <div className={taStyles.formGroup}>
                      <label>
                        Select Head <span className={taStyles.reqField}>*</span>
                      </label>
                      <Select
                        id="selectedValue"
                        placeholder="Select TA"
                        value={newTAHeadUservalue}
                        showSearch={true}
                        onChange={(value, option) => {
                          setNewTAHeadUserValue(value);
                        }}
                        options={filtersList?.HeadUsers?.map((v) => ({
                          label: v.data,
                          value: v.id,
                        }))}
                        optionFilterProp="label"
                      />
                    </div>
                  </div>
                  <div className={taStyles.colMd6}>
                    <div className={taStyles.formGroup}>
                      <label>
                        Select TA <span className={taStyles.reqField}>*</span>
                      </label>
                      <Select
                        id="selectedValue"
                        placeholder="Select TA"
                        value={newTAUservalue}
                        showSearch={true}
                        onChange={(value, option) => {
                          setNewTAUserValue(value);
                          getCompanySuggestionHandler(value);
                          setCompanyNameSuggestion([]);
                          setselectedCompanyID("");
                          setNewTAHRValue("");
                          setTRAllData({});
                        }}
                        options={allTAUsersList?.map((v) => ({
                          label: v.data,
                          value: v.id,
                        }))}
                        optionFilterProp="label"
                      />

                      {newTaskError && newTAUservalue === "" && (
                        <p className={taStyles.error}>please select TA</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className={taStyles.row}>
                  <div className={taStyles.colMd6}>
                    <div className={taStyles.formGroup}>
                      <label>
                        Select company{" "}
                        <span className={taStyles.reqField}>*</span>
                      </label>

                      <Select
                        id="selectedValue"
                        placeholder="Select Company"
                        disabled={newTAUservalue === ""}
                        value={selectedCompanyID}
                        showSearch={true}
                        onChange={(value, option) => {
                          let comObj = getCompanyNameSuggestion.find(
                            (i) => i.value === value
                          );
                          setselectedCompanyID(comObj?.id);
                          getHRLISTForComapny(comObj?.id);
                          setNewTAHRValue("");
                          setTRAllData({});
                        }}
                        options={getCompanyNameSuggestion}
                        optionFilterProp="label"
                      />

                      {newTaskError && selectedCompanyID === "" && (
                        <p className={taStyles.error}>please select company</p>
                      )}
                    </div>
                  </div>
                  <div className={taStyles.colMd6}>
                    <div className={taStyles.formGroup}>
                      <label>
                        Select HR <span className={taStyles.reqField}>*</span>
                      </label>
                      <Select
                        disabled={selectedCompanyID === ""}
                        id="selectedValue"
                        placeholder="Select HR"
                        value={newTAHRvalue}
                        showSearch={true}
                        onChange={(value, option) => {
                          setNewTAHRValue(value);
                          setTRAllData(option);
                        }}
                        options={hrListSuggestion.map((v) => ({
                          ...v,
                          label: v.value,
                          value: v.id,
                        }))}
                        optionFilterProp="label"
                      />
                      {newTaskError && newTAHRvalue === "" && (
                        <p className={taStyles.error}>please select HR</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className={taStyles.HRINFOCOntainer}>
                  {Object.keys(newTRAllData).length > 0 && (
                    <>
                      <div>
                        <span>Active TR : </span>
                        {newTRAllData.activeHR}
                      </div>
                      <div>
                        <span>HR Created Date : </span>
                        {moment(newTRAllData.hrCreatedDate).format(
                          "DD-MMM-YYYY"
                        )}
                      </div>
                      <div>
                        <span>Talent Annual CTC Budget (INR) : </span>
                        {newTRAllData.totalAnnualBudgetInINR}
                      </div>
                      <div>
                        <span>DP /Contract : </span>
                        {newTRAllData.modelType}
                      </div>
                      <div>
                        <span>Revenue Opportunity (10% on annual CTC) : </span>
                        {newTRAllData.revenue10Percent}
                      </div>
                      <div>
                        <span>Sales : </span>
                        {newTRAllData.salesUser}
                      </div>
                      <div>
                        <span>
                          Total Revenue Opportunity (NO. of TR x TalentAnnual
                          CTC budget) :{" "}
                        </span>
                        {newTRAllData.totalRevenueOppurtunity}
                      </div>
                      <div>
                        <span>Open Since {">"} 1 Month (Yes/no) : </span>
                        {newTRAllData.hrOpenSinceOneMonths}
                      </div>
                      <div>
                        <span>
                          No. of Active/Submitted Profiles till Date :{" "}
                        </span>
                        {newTRAllData.noOfProfilesSharedTillDate}
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

            <div style={{ margin: "10px 0" }}>
              <button
                className={taStyles.btnPrimary}
                disabled={isAddingNewTask}
                onClick={() => {
                  saveNewTask();
                }}
              >
                Save
              </button>
              <button
                className={taStyles.btnCancle}
                disabled={isAddingNewTask}
                onClick={() => {
                  setNewTAUserValue("");
                  setselectedCompanyID("");
                  setNewTAHRValue("");
                  setTRAllData({});
                  setCompanyNameSuggestion([]);
                  setNewTaskError(false);
                  setIsAddNewRow(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showEditTATask && (
        <Modal
          transitionName=""
          width="930px"
          centered
          footer={null}
          open={showEditTATask}
          className="engagementModalStyle"
          onCancel={() => {
            setShowEditTATask(false);
          }}
        >
          <div style={{ padding: "35px 15px 10px 15px" }}>
            <h3>Edit TA</h3>
          </div>
          <div style={{ padding: "10px 15px" }}>
            {isEditNewTask ? (
              <Skeleton active />
            ) : (
              <>
                <div className={taStyles.row}>
                  <div className={taStyles.colMd6}>
                    <div className={taStyles.formGroup}>
                      <label>
                        Select Head <span className={taStyles.reqField}>*</span>
                      </label>
                      <Select
                        id="selectedValue"
                        placeholder="Select TA"
                        value={newTAHeadUservalue}
                        showSearch={true}
                        onChange={(value, option) => {
                          setNewTAHeadUserValue(value);
                        }}
                        options={filtersList?.HeadUsers?.map((v) => ({
                          label: v.data,
                          value: v.id,
                        }))}
                        optionFilterProp="label"
                      />
                    </div>
                  </div>
                  <div className={taStyles.colMd6}>
                    <div className={taStyles.formGroup}>
                      <label>
                        Select TA <span className={taStyles.reqField}>*</span>
                      </label>
                      <Select
                        id="selectedValue"
                        placeholder="Select TA"
                        value={editTATaskData?.tA_UserID}
                        showSearch={true}
                        onChange={(value, option) => {
                          setEditTATaskData((prev) => ({
                            ...prev,
                            tA_UserID: value,
                          }));
                        }}
                        options={filtersList?.Users?.map((v) => ({
                          label: v.data,
                          value: v.id,
                        }))}
                        optionFilterProp="label"
                      />

                      {newTaskError && newTAUservalue === "" && (
                        <p className={taStyles.error}>please select TA</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className={taStyles.row}>
                  <div className={taStyles.colMd6}>
                    <div className={taStyles.formGroup}>
                      <label>
                        Select company{" "}
                        <span className={taStyles.reqField}>*</span>
                      </label>

                      <Select
                        id="selectedValue"
                        placeholder="Select Company"
                        disabled={true}
                        value={editTATaskData?.company_ID}
                        showSearch={true}
                        onChange={(value, option) => {}}
                        options={getCompanyNameSuggestion}
                        optionFilterProp="label"
                      />
                    </div>
                  </div>
                  <div className={taStyles.colMd6}>
                    <div className={taStyles.formGroup}>
                      <label>
                        Select HR <span className={taStyles.reqField}>*</span>
                      </label>
                      <Select
                        disabled={true}
                        id="selectedValue"
                        placeholder="Select HR"
                        // style={{marginLeft:'10px',width:'270px'}}
                        // mode="multiple"
                        value={editTATaskData?.hiringRequest_ID}
                        showSearch={true}
                        onChange={(value, option) => {
                          // setNewTAHRValue(value);
                          // setTRAllData(option);
                        }}
                        options={hrListSuggestion.map((v) => ({
                          ...v,
                          label: v.value,
                          value: v.id,
                        }))}
                        optionFilterProp="label"
                      />
                    </div>
                  </div>
                </div>

                <div className={taStyles.HRINFOCOntainer}>
                  {Object.keys(editTATaskData).length > 0 && (
                    <>
                      <div>
                        <span>Active TR : </span>
                        {editTATaskData.activeTR}
                      </div>
                      <div>
                        <span>HR Created Date : </span>
                        {moment(editTATaskData.hrCreatedDate).format(
                          "DD-MMM-YYYY"
                        )}
                      </div>
                      <div>
                        <span>Talent Annual CTC Budget (INR) : </span>
                        {editTATaskData.talent_AnnualCTC_Budget_INRValue}
                      </div>
                      <div>
                        <span>DP /Contract : </span>
                        {editTATaskData.modelType}
                      </div>
                      <div>
                        <span>Revenue Opportunity (10% on annual CTC) : </span>
                        {editTATaskData.revenue_On10PerCTC}
                      </div>
                      <div>
                        <span>Sales : </span>
                        {editTATaskData.salesName}
                      </div>
                      <div>
                        <span>
                          Total Revenue Opportunity (NO. of TR x TalentAnnual
                          CTC budget) :{" "}
                        </span>
                        {editTATaskData.totalRevenue_NoofTalent}
                      </div>
                      <div>
                        <span>Open Since {">"} 1 Month (Yes/no) : </span>
                        {editTATaskData.hrOpenSinceOneMonths}
                      </div>
                      <div>
                        <span>
                          No. of Active/Submitted Profiles till Date :{" "}
                        </span>
                        {editTATaskData.noOfProfile_TalentsTillDate}
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

            <div style={{ margin: "10px 0" }}>
              <button
                className={taStyles.btnPrimary}
                disabled={isEditNewTask}
                onClick={() => {
                  saveEditTask();
                }}
              >
                Save
              </button>
              <button
                className={taStyles.btnCancle}
                disabled={isEditNewTask}
                onClick={() => {
                  setShowEditTATask(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showComment && (
        <Modal
          transitionName=""
          width="1000px"
          centered
          footer={null}
          open={showComment}
          className="engagementModalStyle"
          onCancel={() => {
            setShowComment(false);
            setALLCommentsList([]);
            setCommentData({});
          }}
        >
          <div style={{ padding: "35px 15px 10px 15px" }}>
            <h3>Add Comment</h3>
          </div>
          <Suspense>
            <div
              style={{
                position: "relative",
                marginBottom: "10px",
                padding: "0 20px",
                paddingRight: "30px",
              }}
            >
              <Editor
                hrID={""}
                saveNote={(note) => saveComment(note)}
                isUsedForComment={true}
              />
            </div>
          </Suspense>

          {allCommentList.length > 0 ? (
            <div style={{ padding: "12px 20px" }}>
              {isCommentLoading && (
                <div>
                  Adding Comment ...{" "}
                  <img src={spinGif} alt="loadgif" width={16} />{" "}
                </div>
              )}
              <ul>
                {allCommentList.map((item) => (
                  <li
                    key={item.comments}
                    dangerouslySetInnerHTML={{ __html: item.comments }}
                  ></li>
                ))}
              </ul>
            </div>
          ) : (
            <h3 style={{ marginBottom: "10px", padding: "0 20px" }}>
              {isCommentLoading ? (
                <div>
                  Loading Comments...{" "}
                  <img src={spinGif} alt="loadgif" width={16} />{" "}
                </div>
              ) : (
                "No Comments yet"
              )}
            </h3>
          )}
          <div style={{ padding: "10px" }}>
            <button
              className={taStyles.btnCancle}
              disabled={isEditNewTask}
              onClick={() => {
                setShowComment(false);
                setALLCommentsList([]);
                setCommentData({});
              }}
            >
              Close
            </button>
          </div>
        </Modal>
      )}

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

      {isShowDetails?.isBoolean && (
        <Modal
          width="1000px"
          centered
          footer={null}
          open={isShowDetails?.isBoolean}
          className="engagementModalStyle"
          onCancel={() => {
            setIsShowDetails({
              isBoolean: false,
              title: "",
              value: "",
              isTotal: false,
              TAName: "",
            });
            setAllShowDetails([]);
          }}
        >
          <div style={{ padding: "20px 15px" }}>
            <h3>
              <b>
                {isShowDetails?.TAName && !isShowDetails?.isTotal
                  ? isShowDetails?.TAName + " - "
                  : ""}
                {isShowDetails?.title}{" "}
                {isShowDetails?.value ? " - " + isShowDetails?.value : ""}
              </b>
            </h3>
          </div>

          {allShowDetails.length > 0 ? (
            <div style={{ padding: "0 20px 20px 20px", overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 14,
                  textAlign: "left",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f0f0f0" }}>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                      Action Date
                    </th>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                      Company Name
                    </th>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                      HR Number
                    </th>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                      HR Title
                    </th>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                      Pipeline
                    </th>
                    {isCarryFwdStatus && PipelineTupeId === 8 && (
                      <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                        Pre Onboarding Pipeline (INR)
                      </th>
                    )}
                    {isCarryFwdStatus && (
                      <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                        Carry Forward Status
                      </th>
                    )}
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                      HR Status
                    </th>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                      Sales Person
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {allShowDetails.map((detail, index) => (
                    <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        {detail.actionDateStr}
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        {detail.companyName}
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        {/* {detail.hrNumber} */}
                        <HRTextCol hrText={detail.hrNumber} title={isShowDetails?.title} row={detail} />
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        {detail.hrTitle}
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        {detail.pipelineStr}
                      </td>
                      {isCarryFwdStatus && PipelineTupeId === 8 && (
                        <td
                          style={{ padding: "8px", border: "1px solid #ddd" }}
                        >
                          {detail.preOnboardingPipelineStr}
                        </td>
                      )}
                      {isCarryFwdStatus && (
                        <th
                          style={{ padding: "10px", border: "1px solid #ddd" }}
                        >
                          {All_Hiring_Request_Utils.GETHRSTATUS(
                            Number(detail.carryFwd_HRStatusCode),
                            detail.carryFwd_HRStatus
                          )}
                        </th>
                      )}
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        {All_Hiring_Request_Utils.GETHRSTATUS(
                          Number(detail.hrStatusCode),
                          detail.hrStatus
                        )}
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        {detail.salesPerson}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: "20px" }}>
              <p>No details available.</p>
            </div>
          )}

          <div style={{ padding: "10px", textAlign: "right" }}>
            <button
              className={taStyles.btnCancle}
              onClick={() => {
                setIsShowDetails({
                  isBoolean: false,
                  title: "",
                  value: "",
                  isTotal: false,
                  TAName: "",
                });
                setAllShowDetails([]);
              }}
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
