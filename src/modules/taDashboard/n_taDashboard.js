import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import stylesOBj from './n_tadashboard.module.css'
import taStyles from "./tadashboard.module.css";
import taStylesNew from "./n_tadashboardNew.module.css";
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton'
import { UserSessionManagementController } from "modules/user/services/user_session_services";
import {
    Select, InputNumber,
    Tooltip, Table, Checkbox, message,  Skeleton, Modal
} from "antd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TaDashboardDAO } from "core/taDashboard/taDashboardDRO";
import { InterviewDAO } from "core/interview/interviewDAO";
import { HTTPStatusCode } from "constants/network";
import DashboardTableComp from './dashboardTable';
import GoalTableComp from './goalTable';
import { useNavigate } from 'react-router-dom';
import UTSRoutes from 'constants/routes';
import { allCompanyRequestDAO } from "core/company/companyDAO";
import OnboardFilerList from "modules/onBoardList/OnboardFilterList";
import { All_Hiring_Request_Utils } from "shared/utils/all_hiring_request_util";
import { allEngagementConfig } from "modules/engagement/screens/engagementList/allEngagementConfig";
import moment from 'moment';
import TalentdetailsTable from './talentdetailsTable';
import TotalAchievementTable from './totalAchievementTable';
import TalentdetailsFTETable from './talentdetailsFTETable';
import { BsClipboard2CheckFill } from "react-icons/bs";
import { InputType } from "constants/application";
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import FTECountTable from './fteCountTable';
import Diamond from "assets/svg/diamond.svg";
import PowerIcon from "assets/svg/powerRed.svg";
import { IconContext } from "react-icons";
import { useForm } from "react-hook-form";
import { IoMdAddCircle } from "react-icons/io";
import { IoIosRemoveCircle } from "react-icons/io";
import { GrEdit } from "react-icons/gr";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import MoveToAssessment from "modules/hiring request/components/talentList/moveToAssessment"
import Editor from 'modules/hiring request/components/textEditor/editor';
import { ReactComponent as EditSVG } from "assets/svg/editnewIcon.svg";
import spinGif from "assets/gif/RefreshLoader.gif";

const { Option } = Select;
function NewTADashboard() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [fteDataLoading, setFteDataLoading] = useState(false)
    const [selectedHead, setSelectedHead] = useState('');
    const [userData, setUserData] = useState({});
    const [activeTable, setActiveTable] = useState('Dashboard')
    const [activeFTETable, setActiveFTETable] = useState('Dashboard')
    const [activeTab, setActiveTab] = useState('Full-Time')
    const [filtersList, setFiltersList] = useState({});
    const [fteFiltersList, setFTEFiltersList] = useState({});
    const [filteredTagLength, setFilteredTagLength] = useState(0);
    const [getHTMLFilter, setHTMLFilter] = useState(false);
    const [isAllowFilters, setIsAllowFilters] = useState(false);
    const [appliedFilter, setAppliedFilters] = useState(new Map());
    const [checkedState, setCheckedState] = useState(new Map());
    const [talentWiseReport, setTalentWiseReport] = useState([])
    const [fteCountsData, setFteCountsData] = useState([])
    const [quarterlySummeryReport, setQuarterlySummeryReport] = useState([])
    const date = new Date();
    const [startDate, setStartDate] = useState(date);
    const [startTargetDate, setStartTargetDate] = useState(date);
    const [endDate, setEndDate] = useState(null);
    const [searchText, setSearchText] = useState('');
    const searchInputRef = useRef(null);
    const [debounceSearch, setDebounceSearch] = useState('')
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
    const [dailyActivityTargets, setDailyActiveTargets] = useState([]);
    const [isCarryFwdStatus, setIsCarryFwdStatus] = useState(false);
    const [PipelineTupeId, setPipelineTupeId] = useState(0);
    const [isShowDetails, setIsShowDetails] = useState({
        isBoolean: false,
        title: "",
        value: "",
        isTotal: false,
        TAName: "",
    });
    const [goalLoading, setgoalLoading] = useState(false);
    const [modalLoader, setModalLoader] = useState(false);
    const [allShowDetails, setAllShowDetails] = useState([]);

    const [TaListData, setTaListData] = useState([]);
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
    const [isAddNewRow, setIsAddNewRow] = useState(false);
    const [newTAUservalue, setNewTAUserValue] = useState("");
    const [newTAHeadUservalue, setNewTAHeadUserValue] = useState("");
    const [getCompanyNameSuggestion, setCompanyNameSuggestion] = useState([]);
    const [selectedCompanyID, setselectedCompanyID] = useState("");
    const [hrListSuggestion, setHRListSuggestion] = useState([]);

    const [showProfileTarget, setShowProfileTarget] = useState(false);
    const [profileTargetDetails, setProfileTargetDetails] = useState({});
    const [targetValue, setTargetValue] = useState(5);
    const [loadingTalentProfile, setLoadingTalentProfile] = useState(false);
    const [profileStatusID, setProfileStatusID] = useState(0);
    const [goalList, setGoalList] = useState([]);
    const [hrTalentListFourCount, setHRTalentListFourCount] = useState([]);
    const [talentToMove, setTalentToMove] = useState({});
    const [showTalentProfiles, setShowTalentProfiles] = useState(false);

    const [profileInfo, setInfoforProfile] = useState({});
    const [hrTalentList, setHRTalentList] = useState([]);
    const [filteredTalentList, setFilteredTalentList] = useState(hrTalentList);

    const [showComment, setShowComment] = useState(false);
    const [commentData, setCommentData] = useState({});
    const [allCommentList, setALLCommentsList] = useState([]);
    const [isCommentLoading, setIsCommentLoading] = useState(false);

    const [showEditTATask, setShowEditTATask] = useState(false);
    const [editTATaskData, setEditTATaskData] = useState();
    const [showConfirmRemove, setShowConfirmRemove] = useState(false);
    const [editedCommentData, setEditedCommentData] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
const [moveToAssessment, setMoveToAssessment] = useState(false);
 const {
    register: remarkregiter,
    handleSubmit: remarkSubmit,
    resetField: resetRemarkField,
    clearErrors: clearRemarkError,
    formState: { errors: remarkError },
  } = useForm();
  const [saveRemarkLoading, setSaveRemarkLoading] = useState(false);
    const [newTaskError, setNewTaskError] = useState(false);
    const [isAddingNewTask, setAddingNewTask] = useState(false);

     const [newTAHRvalue, setNewTAHRValue] = useState("");
      const [newTRAllData, setTRAllData] = useState({});
 const [allTAUsersList, setAllTAUsersList] = useState([]);
   const [isEditNewTask, setEditNewTask] = useState(false);

    useEffect(() => {
        const getUserResult = async () => {
            let userData = UserSessionManagementController.getUserSession();
            if (userData) setUserData(userData);
        };
        getUserResult();
    }, []);

     const getAllTAUsersList = async () => {
        let req = await TaDashboardDAO.geAllTAUSERSRequestDAO();
        if (req.statusCode === HTTPStatusCode.OK) {
          setAllTAUsersList(req.responseBody);
        }
      };
    
      useEffect(() => {
        getAllTAUsersList();
      }, []);

    const getFilters = async () => {
        setIsLoading(true);
        let filterResult = await TaDashboardDAO.getAllMasterContractDAO();
        let filterFTEresult = await TaDashboardDAO.getAllMasterFTEDAO()

        setIsLoading(false);
        if (filterResult.statusCode === HTTPStatusCode.OK) {
            setFiltersList(filterResult && filterResult?.responseBody);

        }

        if (filterFTEresult.statusCode === HTTPStatusCode.OK) {

            setFTEFiltersList(filterFTEresult && filterFTEresult?.responseBody);
        }
    };

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
        if (selectedHead.length !== 0 && activeTab === 'Full-Time') {
            getListData();
            getGoalsDetails(
                startDate,
                selectedHead,
                tableFilteredState.filterFields_OnBoard.taUserIDs
            );
        }
    }, [searchText, tableFilteredState, selectedHead, activeTab,startDate]);

    const getTalentWiseReport = async () => {
        let date = new Date()
        let query = `?month=${moment(date).month() + 1}&year=${moment(date).year()}`

        const result = await TaDashboardDAO.getTalentWiseReportContractDAO(query);
        setIsLoading(false);
        if (result.statusCode === HTTPStatusCode.OK) {
            setTalentWiseReport(result && result?.responseBody);
        } else if (result?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
            // setLoading(false); 
            return navigate(UTSRoutes.LOGINROUTE);
        } else if (
            result?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
        ) {
            // setLoading(false);
            return navigate(UTSRoutes.SOMETHINGWENTWRONG);
        } else {
            return "NO DATA FOUND";
        }
    }

    const getQuarterlySummeryReport = async () => {
        let date = new Date()
        let query = `?poduserid=${selectedHead}&month=${moment(date).month() + 1}&year=${moment(date).year()}`
        const result = await TaDashboardDAO.getQuarterlySummeryReportContractDAO(query);
        console.log('result', result)
        if (result.statusCode === HTTPStatusCode.OK) {
            setQuarterlySummeryReport(result && result?.responseBody);
        } else if (result?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
            // setLoading(false); 
            return navigate(UTSRoutes.LOGINROUTE);
        } else if (
            result?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
        ) {
            // setLoading(false);
            return navigate(UTSRoutes.SOMETHINGWENTWRONG);
        } else {
            return "NO DATA FOUND";
        }
    }

    const getFTEReports = async () => {
        let date = new Date()
        let query = `?Month=${moment(date).month() + 1}&Year=${moment(date).year()}&PODUserID=${selectedHead}`

        setFteDataLoading(true)
        const result = await TaDashboardDAO.getFTECountReportContractDAO(query);
        const totalRevenueResult = await TaDashboardDAO.getTotalRevenuePerTAUserDAO(query);
        setFteDataLoading(false)


        if (result.statusCode === HTTPStatusCode.OK) {
            setFteCountsData(result && result?.responseBody);
        } else {
            setFteCountsData([])
        }

        if (totalRevenueResult.statusCode === HTTPStatusCode.OK) {
            setTalentWiseReport(totalRevenueResult?.responseBody)
        } else {
            setTalentWiseReport([])
        }


    }

    const getDailyReports = async () => {

        setFteDataLoading(true)

        let dailyResult = await TaDashboardDAO.getDailyActiveTargetsDAO();
        setFteDataLoading(false)

        if (dailyResult?.statusCode === HTTPStatusCode.OK) {
            setDailyActiveTargets(dailyResult.responseBody);
        }

    }

    useEffect(() => { getDailyReports() }, [])

    useEffect(() => {
        if (activeTab === 'Full-Time') {
            selectedHead && getFTEReports()
        }
    }, [selectedHead, activeTab]);

    useEffect(() => {
        if (activeTab === 'Contract') {
            selectedHead && getQuarterlySummeryReport()
            getTalentWiseReport()
        }

    }, [selectedHead, activeTab]);



    useEffect(() => {
        getFilters();
    }, []);

    useEffect(() => {
        if (activeTab === 'Contract') {
            if (filtersList?.HeadUsers?.length) {
                setSelectedHead(filtersList?.HeadUsers[0]?.id);
            }
        }

        if (activeTab === 'Full-Time') {
            if (fteFiltersList?.HeadUsers?.length) {
                setSelectedHead(fteFiltersList?.HeadUsers[0]?.id);
            }
        }

    }, [filtersList?.HeadUsers, fteFiltersList?.HeadUsers, userData, activeTab]);

    const onCalenderFilter = (dates) => {
        const [start, end] = dates;

        setStartDate(start);
        // setEndDate(end);

        if (start && end) {
            // setTableFilteredState({
            //     ...tableFilteredState,
            //     filterFields_ViewAllHRs: {
            //         ...tableFilteredState.filterFields_ViewAllHRs,
            //         fromDate: new Date(start).toLocaleDateString("en-US"),
            //         toDate: new Date(end).toLocaleDateString("en-US"),
            //     },
            // });
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
            tAHeadID: newTAHeadUservalue
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

    const PSComp =  ({text, result}) => {
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
              </Tooltip>)
    }

    const PSAchieveComp = ({text, result}) => {
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
    }

    const IDTComp = ({ text, result }) => {
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
    }

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
    
        if (newTRAllData.activeHR <= 0 || newTRAllData.activeHR > 20 || isNaN(newTRAllData.activeHR)) {
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
        // console.log("pl", pl,newTRAllData);
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

    const AddComment = (data, index) => {
        getAllComments(data.id);
        setShowComment(true);
        setCommentData({ ...data, index });
    };

    const editTAforTask = (task) => {
        setShowEditTATask(true);
        getCompanySuggestionHandler(task.tA_UserID);
        getHRLISTForComapny(task.company_ID);
        setNewTAHeadUserValue(selectedHead);
        setEditTATaskData(task);
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

        const HRTextCol = ({ hrText, title, row }) => {
    let formatted = hrText?.replace(/\(([^)]+)\)/g, (_, name) => `( <div style="color:rgb(179, 76, 1);font-weight: 600" >${name.trim()}</div> )`)

    if (title === 'Achieve Pipeline (INR)' || title === 'PreOnboarding Pipeline (INR)') {
      return <div dangerouslySetInnerHTML={{ __html: formatted }} style={{ textDecoration: "underline", cursor: 'pointer' }} onClick={() => window.open(`/allhiringrequest/${row.hiringRequest_ID}`, '_blank', 'noopener,noreferrer')} ></div>
    }

    return <a
      href={`/allhiringrequest/${row.hiringRequest_ID}`}
      style={{ textDecoration: "underline" }}
      target="_blank"
      rel="noreferrer"
    >
      {hrText}
    </a>
  }
    
      const saveComment = async (note) => {
        let pl = {
          task_ID: commentData?.id,
          comments: note,
          CommentID: editedCommentData?.id ?? 0
        };
        setIsCommentLoading(true);
        const res = await TaDashboardDAO.insertTaskCommentRequestDAO(pl);
        setIsCommentLoading(false);
        if (res.statusCode === HTTPStatusCode.OK) {
           setEditedCommentData({})
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


    return (
        <div className={`${stylesOBj["dashboard-container"]}`}>


            {/* <!-- Main Content Area --> */}
            <main className={`${stylesOBj["main-content"]}`}>

                <div className={stylesOBj.filterContainer} style={{ margin: '10px' }}>
                    {fteDataLoading ? <TableSkeleton /> : (
                        <Table
                            dataSource={dailyActivityTargets}
                            columns={daiyTargetColumns}
                            pagination={false}
                        />
                    )}
                </div>



                <div className={stylesOBj.filterContainer}>

                    <div className={stylesOBj["toggle-group"]} style={{ width: '210px', margin: '10px' }}>
                        <button
                            className={`${stylesOBj["toggle-btn"]}  ${activeTab === 'Full-Time' ? stylesOBj["toggle-btn-active"] : ''}`}
                            onClick={() => {
                                setActiveTab('Full-Time')
                            }}
                        >Full-Time</button>
                        <button
                            className={`${stylesOBj["toggle-btn"]} ${activeTab === 'Contract' ? stylesOBj["toggle-btn-active"] : ''}`}
                            onClick={() => {
                                setActiveTab('Contract')
                            }}
                        >Contract</button>

                    </div>

                    <Select
                        id="selectedValue"
                        placeholder="Select TA"
                        style={{ marginLeft: "10px", width: "270px", marginBottom: '10px' }}
                        // mode="multiple"
                        value={selectedHead}
                        showSearch={true}
                        onChange={(value, option) => {
                            setSelectedHead(value);
                        }}
                        options={activeTab === 'Contract' ? filtersList?.HeadUsers?.map((v) => ({
                            label: v.data,
                            value: v.id,
                        })) : fteFiltersList?.HeadUsers?.map((v) => ({
                            label: v.data,
                            value: v.id,
                        }))}
                        optionFilterProp="label"
                    />
                    {activeTab === 'Contract' && <>
                        <TalentdetailsTable isLoading={isLoading} talentWiseReport={talentWiseReport} />

                        <h2 style={{ fontWeight: 'bold', marginTop: '20px' }}>Total Achievement (Closure Month)</h2>
                        <TotalAchievementTable quarterlySummeryReport={quarterlySummeryReport} />
                        <div className={stylesOBj.addtaskcontainer}>  <div className={stylesOBj["toggle-group"]} style={{ width: '335px' }}>
                            <button
                                className={`${stylesOBj["toggle-btn"]}  ${activeTable === 'Dashboard' ? stylesOBj["toggle-btn-active"] : ''}`}
                                onClick={() => {
                                    setActiveTable('Dashboard')
                                }}
                            >Fastrack</button>
                            <button
                                className={`${stylesOBj["toggle-btn"]} ${activeTable === 'Goal' ? stylesOBj["toggle-btn-active"] : ''}`}
                                onClick={() => {
                                    setActiveTable('Goal')
                                }}
                            >Goal vs Achieved Targets</button>

                        </div>

                            {userData?.showTADashboardDropdowns && activeTable === 'Dashboard' && (
                                <button
                                    className={stylesOBj.btnPrimary}
                                    onClick={() => {
                                          setIsAddNewRow(true);
                                          setNewTAHeadUserValue(selectedHead);
                                    }}
                                >
                                    Add New Task
                                </button>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>


                            {activeTable === 'Goal' && <div className={`${stylesOBj.calendarFilter}`} >
                                <DatePicker
                                    style={{ backgroundColor: "red" }}
                                    onKeyDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    className={stylesOBj.dateFilter}
                                    placeholderText="Select Date"
                                    selected={startDate}
                                    onChange={date => setStartDate(date)}
                                    // startDate={startDate}
                                // endDate={endDate}
                                // selectsRange
                                />

                                {(startDate && endDate) && <Tooltip title="Reset date range">
                                    <span style={{ color: 'red', fontWeight: 'bold', fontSize: 'Large', position: 'absolute', right: '40px', cursor: 'pointer' }} onClick={e => {
                                        e.stopPropagation();
                                        // setDebouncedSear
                                        // setTableFilteredState({
                                        //     ...tableFilteredState,
                                        //     filterFields_ViewAllHRs: {
                                        //         ...tableFilteredState.filterFields_ViewAllHRs,
                                        //         fromDate: null,
                                        //         toDate: null,
                                        //     },
                                        // });
                                        setEndDate(null);
                                        setStartDate(null);
                                    }}>X</span>
                                </Tooltip>}
                                <img src="images/calendar-ic.svg" alt="Calendar Icon" className={`${stylesOBj["input-icon"]}`} />

                            </div>}

                            {activeTable === 'Dashboard' && <>
                                <button className={stylesOBj["filter-btn"]} onClick={() => { }}>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <img src="images/filter-ic.svg" alt="Filter" />
                                        <span>Add Filters</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <div className={stylesOBj["filterCount"]}>{filteredTagLength}</div>
                                        {filteredTagLength > 0 && (
                                            <Tooltip title="Reset Filters">
                                                <span style={{ color: 'red', fontWeight: 'bold', cursor: 'pointer' }}
                                                    onClick={(e) => { e.stopPropagation(); }}>
                                                    X
                                                </span>
                                            </Tooltip>
                                        )}
                                    </div>
                                </button>

                                <div className={`${stylesOBj["filter-group"]} ${stylesOBj["search-group"]}`} style={{ marginLeft: 'auto', marginRight: '10px' }}>
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        className={stylesOBj["filter-input"]}
                                        placeholder="Search"
                                        value={debounceSearch}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                setSearchText(debounceSearch);
                                            }
                                        }}
                                        onChange={e => setDebounceSearch(e.target.value)}
                                    />
                                    {searchText.length > 0 && (
                                        <Tooltip title="Clear search">
                                            <span style={{ position: 'absolute', right: '36px', color: 'red', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
                                                onClick={() => { setSearchText(''); setDebounceSearch(''); }}>
                                                X
                                            </span>
                                        </Tooltip>
                                    )}
                                    <Tooltip title="search">
                                        <img
                                            src="images/search-ic.svg"
                                            onClick={() => {
                                                if (searchInputRef?.current) searchInputRef.current.focus();
                                                setSearchText(debounceSearch);
                                            }}
                                            alt="Search"
                                            className={stylesOBj["input-icon"]}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </Tooltip>
                                </div>
                            </>}

                        </div>

                        {activeTable === 'Dashboard' && <DashboardTableComp selectedHead={selectedHead} searchText={searchText} tableFilteredState={tableFilteredState} filtersList={filtersList}/>}
                        {activeTable === 'Goal' && <GoalTableComp selectedHead={selectedHead} startDate={startDate} tableFilteredState={tableFilteredState} />}
                    </>}

                    {activeTab === 'Full-Time' && <>

                        <FTECountTable isLoading={fteDataLoading} countData={fteCountsData} />


                        <TalentdetailsFTETable isLoading={fteDataLoading} talentWiseReport={talentWiseReport}  showDetails={showDetails}  />


                        <div className={stylesOBj.addtaskcontainer}>  <div className={stylesOBj["toggle-group"]} style={{ width: '335px' }}>
                            <button
                                className={`${stylesOBj["toggle-btn"]}  ${activeFTETable === 'Dashboard' ? stylesOBj["toggle-btn-active"] : ''}`}
                                onClick={() => {
                                    setActiveFTETable('Dashboard')
                                }}
                            >Fastrack</button>
                            <button
                                className={`${stylesOBj["toggle-btn"]} ${activeFTETable === 'Goal' ? stylesOBj["toggle-btn-active"] : ''}`}
                                onClick={() => {
                                    setActiveFTETable('Goal')
                                }}
                            >Goal vs Achieved Targets</button>

                        </div>

                            { activeFTETable === 'Dashboard' && (
                                <button
                                    className={stylesOBj.btnPrimary}
                                    onClick={() => {
                                        setIsAddNewRow(true);
                                        setNewTAHeadUserValue(selectedHead);
                                    }}
                                >
                                    Add New Task
                                </button>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>


                            {activeFTETable === 'Goal' && <div className={`${stylesOBj.calendarFilter}`} >
                                <DatePicker
                                    style={{ backgroundColor: "red" }}
                                    onKeyDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    className={stylesOBj.dateFilter}
                                    placeholderText="Select Date"
                                    selected={startDate}
                                     onChange={date => setStartDate(date)}
                                    // startDate={startDate}
                                // endDate={endDate}
                                // selectsRange
                                />

                                {(startDate && endDate) && <Tooltip title="Reset date range">
                                    <span style={{ color: 'red', fontWeight: 'bold', fontSize: 'Large', position: 'absolute', right: '40px', cursor: 'pointer' }} onClick={e => {
                                        e.stopPropagation();
                                        // setDebouncedSear
                                        // setTableFilteredState({
                                        //     ...tableFilteredState,
                                        //     filterFields_ViewAllHRs: {
                                        //         ...tableFilteredState.filterFields_ViewAllHRs,
                                        //         fromDate: null,
                                        //         toDate: null,
                                        //     },
                                        // });
                                        setEndDate(null);
                                        setStartDate(null);
                                    }}>X</span>
                                </Tooltip>}
                                <img src="images/calendar-ic.svg" alt="Calendar Icon" className={`${stylesOBj["input-icon"]}`} />

                            </div>}

                            {activeFTETable === 'Dashboard' && <>
                                <button className={stylesOBj["filter-btn"]} onClick={toggleHRFilter}>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <img src="images/filter-ic.svg" alt="Filter" />
                                        <span>Add Filters</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <div className={stylesOBj["filterCount"]}>{filteredTagLength}</div>
                                        {filteredTagLength > 0 && (
                                            <Tooltip title="Reset Filters">
                                                <span style={{ color: 'red', fontWeight: 'bold', cursor: 'pointer' }}
                                                    onClick={(e) => { e.stopPropagation(); clearFilters() }}>
                                                    X
                                                </span>
                                            </Tooltip>
                                        )}
                                    </div>
                                </button>

                                <div className={`${stylesOBj["filter-group"]} ${stylesOBj["search-group"]}`} style={{ marginLeft: 'auto', marginRight: '10px' }}>
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        className={stylesOBj["filter-input"]}
                                        placeholder="Search"
                                        value={debounceSearch}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                setSearchText(debounceSearch);
                                            }
                                        }}
                                        onChange={e => setDebounceSearch(e.target.value)}
                                    />
                                    {searchText.length > 0 && (
                                        <Tooltip title="Clear search">
                                            <span style={{ position: 'absolute', right: '36px', color: 'red', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
                                                onClick={() => { setSearchText(''); setDebounceSearch(''); }}>
                                                X
                                            </span>
                                        </Tooltip>
                                    )}
                                    <Tooltip title="search">
                                        <img
                                            src="images/search-ic.svg"
                                            onClick={() => {
                                                if (searchInputRef?.current) searchInputRef.current.focus();
                                                setSearchText(debounceSearch);
                                            }}
                                            alt="Search"
                                            className={stylesOBj["input-icon"]}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </Tooltip>
                                </div>
                            </>}

                        </div>

                        {activeFTETable === 'Dashboard' && <>


                            <div className={taStylesNew["table-container"]} style={{ marginTop: '10px' }}>
                                <table className={taStylesNew["data-table"]}>
                                    <thead>
                                        <tr>
                                            <th>TA NAME</th>
                                            <th>COMPANY NAME</th>
                                            <th>HR TITLE / ID</th>
                                            <th>PRIORITY</th>
                                            <th>STATUS</th>
                                            <th>PROFILES SHARED TARGET<br />/ ACHIEVED / L1 ROUND</th>
                                            <th>CONTRACT / FT</th>
                                            <th>TALENT BUDGET</th>
                                            <th>UPLERS<br />FEES %</th>
                                            <th>UPLOADS FEES</th>
                                            <th>ACTIVE TR'S</th>
                                            <th>TOTAL REVENUE<br />OPPORTUNITY</th>
                                            <th>ACTIVE PROFILES<br />TILL DATE</th>
                                            <th>LATEST UPDATES</th>
                                            <th>INBOUND /<br />OUTBOUND</th>
                                            <th># INTERVIEW<br />ROUNDS</th>
                                            <th>HR STATUS</th>
                                            <th>SALES</th>
                                            <th>HR<br />CREATED DATE</th>
                                            <th>OPEN SINCE &gt;<br />ONE MONTH (YES/NO)</th>
                                            <th>ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {TaListData?.length === 0 ? <tr>
                                        <td colSpan={21} style={{ textAlign: "center", padding: "20px" }}>
                                            No data available
                                        </td>
                                    </tr> : TaListData.map((row, i) => (
                                            <tr key={i}>
                                                <td>{row.taName}</td>
                                                <td>
                                                    <div className={taStylesNew["company-cell"]}>
                                                        <span className={taStylesNew["company-name"]}>{row.companyName}</span>

                                                        <button
                                                            className={taStylesNew["diamond-toggle"]}
                                                            data-tooltip={userData?.UserId === 2 ||
                                                                    userData?.UserId === 333 ||
                                                                    userData?.UserId === 190 || userData?.UserId === 96  ? (row?.companyCategory === "Diamond" ? "Remove Diamond" : "Add Diamond") : "Not allowed"}
                                                            onClick={() => {
                                                                if (userData?.UserId === 2 ||
                                                                    userData?.UserId === 333 ||
                                                                    userData?.UserId === 190 || userData?.UserId === 96 ) {
                                                                    if (row?.companyCategory === "Diamond") {
                                                                        setShowDiamondRemark(true);
                                                                        setCompanyIdForRemark({ ...row, index: i });
                                                                    } else {
                                                                        setDiamondCompany(row, i)
                                                                    }
                                                                }

                                                            }}
                                                        >
                                                            {row?.companyCategory === "Diamond"
                                                                ? <img src="images/diamond-active-ic.svg" alt="Diamond Active" className={`${taStylesNew["diamond-icon"]} ${taStylesNew["diamond-active"]}`} />
                                                                : <img src="images/diamond-ic.svg" alt="Diamond" className={`${taStylesNew["diamond-icon"]} ${taStylesNew["diamond-inactive"]}`} />}
                                                        </button>
                                                        {userData?.showTADashboardDropdowns && <button className={taStylesNew["plus-task-btn"]} data-tooltip={`Add task for TA ${row.taName} in ${row.companyName}`}
                                                            onClick={() => {
                                                                setIsAddNewRow(true);
                                                                setNewTAUserValue(row.tA_UserID);
                                                                setNewTAHeadUserValue(selectedHead);
                                                                getCompanySuggestionHandler(row.tA_UserID);
                                                                setselectedCompanyID(row?.company_ID);
                                                                getHRLISTForComapny(row?.company_ID);
                                                            }}
                                                        >
                                                            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M13 0C10.4288 0 7.91543 0.762437 5.77759 2.1909C3.63975 3.61935 1.97351 5.64968 0.989572 8.02512C0.0056327 10.4006 -0.251811 13.0144 0.249797 15.5362C0.751405 18.0579 1.98953 20.3743 3.80762 22.1924C5.6257 24.0105 7.94208 25.2486 10.4638 25.7502C12.9856 26.2518 15.5995 25.9944 17.9749 25.0104C20.3503 24.0265 22.3807 22.3603 23.8091 20.2224C25.2376 18.0846 26 15.5712 26 13C25.9957 9.55351 24.6247 6.2494 22.1876 3.81236C19.7506 1.37532 16.4465 0.00430006 13 0ZM18 14H14V18C14 18.2652 13.8946 18.5196 13.7071 18.7071C13.5196 18.8946 13.2652 19 13 19C12.7348 19 12.4804 18.8946 12.2929 18.7071C12.1054 18.5196 12 18.2652 12 18V14H8.00001C7.73479 14 7.48044 13.8946 7.2929 13.7071C7.10536 13.5196 7.00001 13.2652 7.00001 13C7.00001 12.7348 7.10536 12.4804 7.2929 12.2929C7.48044 12.1054 7.73479 12 8.00001 12H12V8C12 7.73478 12.1054 7.48043 12.2929 7.29289C12.4804 7.10536 12.7348 7 13 7C13.2652 7 13.5196 7.10536 13.7071 7.29289C13.8946 7.48043 14 7.73478 14 8V12H18C18.2652 12 18.5196 12.1054 18.7071 12.2929C18.8946 12.4804 19 12.7348 19 13C19 13.2652 18.8946 13.5196 18.7071 13.7071C18.5196 13.8946 18.2652 14 18 14Z" fill="#8A8A8A" />
                                                            </svg>
                                                        </button>}

                                                    </div>
                                                </td>
                                                <td>
                                                    <div className={taStylesNew["hr-title-text"]}>
                                                        <span>{row.hrTitle}</span>
                                                        <span className={taStylesNew["hr-id-chip"]} style={{

                                                            cursor: "pointer",
                                                        }} onClick={() => {
                                                            window.open(
                                                                UTSRoutes.ALLHIRINGREQUESTROUTE +
                                                                `/${row.hiringRequest_ID}`,
                                                                "_blank"
                                                            );
                                                        }}>{row.hrNumber}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <PriorityComp text={row.task_Priority} result={row} index={i} />
                                                    {/* <div className={taStylesNew["inline-select-wrap"]}>
                                                            <select className={taStylesNew["inline-select"]} defaultValue={row.priority}>
                                                                <option>P1</option>
                                                                <option>P2</option>
                                                                <option>P3</option>
                                                            </select>
                                                        </div> */}
                                                </td>
                                                <td>
                                                    <TaskStatusComp text={row.taskStatus} result={row} index={i} />
                                                    {/* <div className={taStylesNew["inline-select-wrap"]}>
                                                        
                                                            <select className={taStylesNew["inline-select"]} defaultValue={row.status}>
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
                                                        {row.task_StatusID === 1 ? (
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
                                                                    setProfileTargetDetails({ ...row, index: i });
                                                                }}
                                                            >
                                                                {row?.profile_Shared_Target ?? 0}
                                                            </p>
                                                        ) : (
                                                            row?.profile_Shared_Target ?? 0
                                                        )}{" "}
                                                        / {row.profile_Shared_Achieved ?? "NA"} /{" "}
                                                        {row.interview_Scheduled_Target ?? "NA"}
                                                    </div>
                                                    {/* <div className={taStylesNew["cell-input-wrap"]}>
                                                            <input type="text" className={taStylesNew["cell-input"]} defaultValue={row.profilesShared} readOnly />
                                                        </div> */}
                                                </td>
                                                <td>
                                                    <ContractDPComp text={row?.modelType} result={row} index={i} />
                                                    {/* <div className={taStylesNew["inline-select-wrap"]}>
                                                            <select className={taStylesNew["inline-select"]} defaultValue={row.contractFt}>
                                                                <option>DP</option>
                                                                <option>Contract</option>
                                                            </select>
                                                        </div> */}
                                                </td>
                                                <td><Tooltip title={row.actualCostWithCurrency}>{row?.talent_AnnualCTC_Budget_INRValueStr}</Tooltip></td>
                                                <td>{row.uplersFeesPer}</td>
                                                <td>{row.revenue_On10PerCTCStr}</td>
                                                <td>{row.activeTR}</td>
                                                <td>{row.totalRevenue_NoofTalentStr}</td>
                                                <td>
                                                    {+row?.noOfProfile_TalentsTillDate > 0 ? (
                                                        <p
                                                            style={{
                                                                color: "blue",
                                                                fontWeight: "bold",
                                                                textDecoration: "underline",
                                                                cursor: "pointer",
                                                            }}
                                                            onClick={() => {
                                                                getTalentProfilesDetailsfromTable(row, 0);
                                                                setTalentToMove(row);
                                                                setProfileStatusID(0);
                                                                setHRTalentListFourCount([]);
                                                            }}
                                                        >
                                                            {row?.noOfProfile_TalentsTillDate}
                                                        </p>
                                                    ) : (
                                                        row?.noOfProfile_TalentsTillDate
                                                    )}
                                                    {/* <div className={taStylesNew["cell-input-wrap"]}>
                                                            <input type="text" className={taStylesNew["cell-input"]} defaultValue={row.activeProfiles} />
                                                        </div> */}
                                                </td>
                                                <td>
                                                    {row?.latestNotes ? <>
                                                        <div dangerouslySetInnerHTML={{ __html: row.latestNotes }}></div>
                                                        <div className={taStylesNew["view-edit"]}>

                                                            <button onClick={() => {
                                                                AddComment(row, i);
                                                            }}>Edit</button>
                                                        </div>
                                                    </> : <button className={taStylesNew["cell-add-btn"]} onClick={() => {
                                                        AddComment(row, i);
                                                    }} >Add</button>}

                                                    {/* {row.latestUpdate === 'Add' ? (
                                                            <button className={taStylesNew["cell-add-btn"]} >Add</button>
                                                        ) : (
                                                            <div className={taStylesNew["view-edit"]}>
                                                                <button>View</button>
                                                                <button>Edit</button>
                                                            </div>
                                                        )} */}
                                                </td>
                                                <td>
                                                    <InboundOutboundComp text={row?.role_Type} result={row} index={i} />
                                                    {/* <div className={taStylesNew["inline-select-wrap"]}>
                                                            <select className={taStylesNew["inline-select"]} defaultValue={row.inboundOutbound}>
                                                                <option>DP</option>
                                                                <option>Inbound</option>
                                                                <option>Outbound</option>
                                                            </select>
                                                        </div> */}
                                                </td>
                                                <td>
                                                    <InterviewRoundComp text={row?.no_of_InterviewRounds} result={row} index={i} />
                                                    {/* <div className={taStylesNew["cell-input-wrap"]}>
                                                            <input type="text" className={taStylesNew["cell-input"]} defaultValue={row.interviewRounds} />
                                                        </div> */}
                                                </td>
                                                <td>
                                                    <HRStatusComp text={row?.tA_HR_Status} result={row} index={i} />
                                                    {/* <div className={taStylesNew["inline-select-wrap"]}>
                                                            <select className={taStylesNew["inline-select"]} defaultValue={row.hrStatus}>
                                                                <option>Info pending</option>
                                                                <option>In process</option>
                                                                <option>Completed</option>
                                                                <option>Lost</option>
                                                                <option>Canceled</option>
                                                                <option>Covered</option>
                                                                <option>HR accepted</option>
                                                            </select>
                                                        </div> */}
                                                </td>
                                                <td>{row.salesName}</td>
                                                <td>{row.hrCreatedDate}</td>
                                                <td>{row.hrOpenSinceOneMonths}</td>
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
                                                                        editTAforTask(row);
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
                                                    {/* <button className={taStylesNew["action-edit-btn"]} title="Edit">
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="#4C4E64DE"/>
                                                            </svg>
                                                        </button> */}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                        }

                        {activeFTETable === 'Goal' && <>{
                            goalLoading ? (<TableSkeleton />
                            ) : (

                                <div className={taStylesNew["table-container"]}>
                                    <table className={taStylesNew["data-table"]}>
                                        <thead>
                                            <tr>
                                                <th>TA</th>
                                                <th>COMPANY</th>
                                                <th>HR TITLE</th>
                                                <th>PROFILES SHARED<br />TARGET</th>
                                                <th>PROFILES SHARED<br />ACHIEVE</th>
                                                <th>L1 INTERVIEWS<br />SCHEDULED</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {goalList.map((row, i) => (
                                                <tr key={i} className={`${row.hrTitle === 'TOTAL' ? taStylesNew["row-total"] : ''}`}>
                                                    <td>{row.ta}</td>
                                                    <td>{row.company}</td>
                                                    <td>
                                                        <div className={taStylesNew["hr-title-text"]}>
                                                            <span>{row.hrTitle}</span>
                                                            <span className={taStylesNew["hr-id-chip"]}>{row.hrId}</span>
                                                        </div>
                                                    </td>
                                                    <td><PSComp text={row.profiles_Shared_Target} result={row} /></td>
                                                    <td><PSAchieveComp text={row.profiles_Shared_Achieved} result={row} /></td>
                                                    <td><IDTComp text={row.interviews_Done_Target} result={row} /></td>
                                                </tr>
                                            ))}

                                        </tbody>
                                    </table>
                                </div>
                            )
                        }

                        </>}

                    </>}
                </div>


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
                            filtersType={allEngagementConfig.taDashboardFilterTypeConfig(
                                filtersList && filtersList
                            )}
                            clearFilters={clearFilters}
                        />
                    </Suspense>
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
                              Select Company{" "}
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
      
                      {Object.keys(newTRAllData).length > 0 && <div className={taStyles.row}>
                        <div className={taStyles.colMd6}>
                          <div className={taStyles.formGroup} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <label>
                              Active TR {" "}
                              <span className={taStyles.reqField}>*</span>
                            </label>
      
                            <InputNumber size="large" value={newTRAllData.activeHR} min={1} max={20} onChange={(value) => { setTRAllData(prev => ({ ...prev, activeHR: parseInt(value) })) }} />
      
      
                          </div>
                          {newTaskError && (newTRAllData.activeHR <= 0 || newTRAllData.activeHR > 20 || isNaN(newTRAllData.activeHR)) && (
                            <p className={taStyles.error} style={{ marginTop: '5px' }}>Please enter a value from 1 to 20 </p>
                          )}
                        </div>
                      </div>}
      
      
                      <div className={taStyles.HRINFOCOntainer}>
                        {Object.keys(newTRAllData).length > 0 && (
                          <>
                            {/* <div>
                              <span>Active TR : </span>
                              {newTRAllData.activeHR}
                            </div> */}
                            <div>
                              <span>HR Created Date : </span>
                              {moment(newTRAllData.hrCreatedDate).format(
                                "DD-MMM-YYYY"
                              )}
                            </div>
                            <div>
                              <span>Talent Budget : </span>
                              {newTRAllData.totalAnnualBudgetInINR}
                            </div>
                            <div>
                              <span>DP /Contract : </span>
                              {newTRAllData.modelType}
                            </div>
                            <div>
                              <span>Revenue Opportunity : </span>
                              {newTRAllData.revenue10Percent}
                            </div>
                            <div>
                              <span>Sales : </span>
                              {newTRAllData.salesUser}
                            </div>
                            <div>
                              <span>
                                Total Revenue Opportunity (NO. of TR x Talent budget) :{" "}
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
                              onChange={(value, option) => { }}
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
                              <span>Talent Budget  : </span>
                              {editTATaskData.talent_AnnualCTC_Budget_INRValue}
                            </div>
                            <div>
                              <span>DP /Contract : </span>
                              {editTATaskData.modelType}
                            </div>
                            <div>
                              <span>Revenue Opportunity : </span>
                              {editTATaskData.revenue_On10PerCTC}
                            </div>
                            <div>
                              <span>Sales : </span>
                              {editTATaskData.salesName}
                            </div>
                            <div>
                              <span>
                                Total Revenue Opportunity (NO. of TR x Talent budget) :{" "}
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
                  setEditedCommentData({})
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
                      //  saveNote={(note) => console.log(note)}
                      isUsedForComment={true}
                      editedText={editedCommentData?.comments}
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
                    <ul style={{marginLeft:'10px', listStyleType:'none'}}>
                      {allCommentList.map((item) => (
                        <> <li
                          key={item.comments} 
                         style={{ marginBottom: "10px" }}
                        > <div style={{display:'flex'}}>
                           <EditSVG
                    width={22}
                    height={22}
                    style={{marginRight:'10px',cursor:'pointer'}}
                    onClick={() => setEditedCommentData(item)}
                  />  
                          <div dangerouslySetInnerHTML={{ __html: item.comments }}></div>  
                          </div></li>
                       
                        </>
                       
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
                      setEditedCommentData({})
                      setALLCommentsList([]);
                      setCommentData({});
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


            </main>
        </div>
    )
}

export default NewTADashboard