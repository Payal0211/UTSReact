import React, { useState, useCallback, useEffect, useRef, useMemo, Suspense } from 'react'
import stylesOBj from './scrumStructure.module.css'
import gridStyles from './scrumGrid.module.css'
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton'
import { AgGridReact } from 'ag-grid-react'
import { ModuleRegistry, AllCommunityModule, DataTypeService } from 'ag-grid-community'
import { scrumGridTheme } from './gridTheme'
import {
    Select, InputNumber,
    Tooltip, Table, Checkbox, message, Skeleton, Modal
} from "antd";
import { TaDashboardDAO } from "core/taDashboard/taDashboardDRO";
import { useNavigate } from 'react-router-dom';
import { HTTPStatusCode } from "constants/network";
import UTSRoutes from 'constants/routes';
import moment from 'moment';
import { All_Hiring_Request_Utils } from "shared/utils/all_hiring_request_util";
import { UserSessionManagementController } from "modules/user/services/user_session_services";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MoveToAssessment from "modules/hiring request/components/talentList/moveToAssessment"
import { IconContext } from "react-icons";
import { InterviewDAO } from "core/interview/interviewDAO";
import { BsClipboard2CheckFill } from "react-icons/bs";
import { allCompanyRequestDAO } from "core/company/companyDAO";
import { useForm } from "react-hook-form";
import { InputType } from "constants/application";
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import Editor from 'modules/hiring request/components/textEditor/editor';
import { ReactComponent as EditSVG } from "assets/svg/editnewIcon.svg";
import spinGif from "assets/gif/RefreshLoader.gif";
import CompanyCell from './CompanyCell';
import { ProfileSharedTargetCell, ActiveProfileCountCell } from './ProfileCells';
import { HrStatusCell, LatestNotesCell, LatestTouchCell, SubmissionSheetCell } from './MiscCells';
import { IoIosRemoveCircle } from "react-icons/io";
import { GrEdit } from "react-icons/gr";
import YesNoCell from './YesNoCell';
const { Option } = Select;



ModuleRegistry.registerModules([AllCommunityModule]);





function ScrumStructure2() {
    const navigate = useNavigate()
    const [filtersList, setFiltersList] = useState({});
    const [TaListData, setTaListData] = useState([]);
    const [selectedHead, setSelectedHead] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [columnOrder, setColumnOrder] = useState([])
    const [draggedRow, setDraggedRow] = useState(null);
    const [draggedRowData, setDraggedRowData] = useState({})
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
    const [showProfileTarget, setShowProfileTarget] = useState(false);
    const [profileTargetDetails, setProfileTargetDetails] = useState({});
    const [targetValue, setTargetValue] = useState(5);
    const [loadingTalentProfile, setLoadingTalentProfile] = useState(false);
    const [profileStatusID, setProfileStatusID] = useState(0);
    const [goalList, setGoalList] = useState([]);
    const [hrTalentListFourCount, setHRTalentListFourCount] = useState([]);
    const [talentToMove, setTalentToMove] = useState({});
    const [showTalentProfiles, setShowTalentProfiles] = useState(false);
    const date = new Date();
    const [startDate, setStartDate] = useState(date);
    const [startTargetDate, setStartTargetDate] = useState(date);
    const [isAddingNewTask, setAddingNewTask] = useState(false);

    const [profileInfo, setInfoforProfile] = useState({});
    const [hrTalentList, setHRTalentList] = useState([]);
    const [filteredTalentList, setFilteredTalentList] = useState(hrTalentList);
    const [searchTerm, setSearchTerm] = useState("");
    const [moveToAssessment, setMoveToAssessment] = useState(false);

    const [newTAHRvalue, setNewTAHRValue] = useState("");
    const [newTRAllData, setTRAllData] = useState({});
    const [allTAUsersList, setAllTAUsersList] = useState([]);
    const [isEditNewTask, setEditNewTask] = useState(false);
    const [editedCommentData, setEditedCommentData] = useState({});
    const [hasFilter, setHasFilter] = useState(false);
    const {
        register: remarkregiter,
        handleSubmit: remarkSubmit,
        resetField: resetRemarkField,
        clearErrors: clearRemarkError,
        formState: { errors: remarkError },
    } = useForm();
    const [saveRemarkLoading, setSaveRemarkLoading] = useState(false);
    const [showDiamondRemark, setShowDiamondRemark] = useState(false);
    const [companyIdForRemark, setCompanyIdForRemark] = useState(0);
    const [remDiamondLoading, setRemDiamondLoading] = useState(false);

    const [showComment, setShowComment] = useState(false);
    const [commentData, setCommentData] = useState({});
    const [allCommentList, setALLCommentsList] = useState([]);
    const [isCommentLoading, setIsCommentLoading] = useState(false);

    const [searchText, setSearchText] = useState('');
    const searchInputRef = useRef(null);
    const [debounceSearch, setDebounceSearch] = useState('')
    const [isAddNewRow, setIsAddNewRow] = useState(false);
    const [newTAUservalue, setNewTAUserValue] = useState("");
    const [newTAHeadUservalue, setNewTAHeadUserValue] = useState("");
    const [getCompanyNameSuggestion, setCompanyNameSuggestion] = useState([]);
    const [selectedCompanyID, setselectedCompanyID] = useState("");
    const [hrListSuggestion, setHRListSuggestion] = useState([]);

    const [scrumPopupData, setScrumPopupData] = useState([])
    const [scrumPopupLoading, setScrumPopupLoading] = useState(false)
    const [showScrumPopup, setShowScrumPopup] = useState(false)
    const [scrumPopupType, setScrumPopupType] = useState('')
    const [userData, setUserData] = useState({});
    const {
        watch,
        register,
        setError,
        handleSubmit,
        resetField,
        clearErrors,
        formState: { errors },
    } = useForm();
    const [newTaskError, setNewTaskError] = useState(false);

    const [showEditTATask, setShowEditTATask] = useState(false);
    const [editTATaskData, setEditTATaskData] = useState();
    const [showConfirmRemove, setShowConfirmRemove] = useState(false);

    useEffect(() => {
        const getUserResult = async () => {
            let userData = UserSessionManagementController.getUserSession();
            if (userData) setUserData(userData);
        };
        getUserResult();
    }, []);

    const gridApiRef = useRef(null);

    const onGridReady = (params) => {
        gridApiRef.current = params.api;
    };

    const GRID_ROW_HEIGHT = 46;
    const GRID_HEADER_HEIGHT = 44;
    const GRID_MIN_HEIGHT = 320;
    const GRID_BOTTOM_PADDING = 24;

    const gridWrapperRef = useRef(null);
    const [availableHeight, setAvailableHeight] = useState(600);

    const popupParent = useMemo(() => document.body, []);

    useEffect(() => {
        const recomputeAvailableHeight = () => {
            if (!gridWrapperRef.current) return;
            const top = gridWrapperRef.current.getBoundingClientRect().top;
            const available = window.innerHeight - top - GRID_BOTTOM_PADDING;
            setAvailableHeight(Math.max(available, GRID_MIN_HEIGHT));
        };

        recomputeAvailableHeight();
        window.addEventListener('resize', recomputeAvailableHeight);
        return () => window.removeEventListener('resize', recomputeAvailableHeight);
    }, [TaListData.length]);

    const gridHeightPx = availableHeight


    const getAllTAUsersList = async () => {
        let req = await TaDashboardDAO.geAllTAUSERSRequestDAO();
        if (req.statusCode === HTTPStatusCode.OK) {
            setAllTAUsersList(req.responseBody);
        }
    };

    useEffect(() => {
        getAllTAUsersList();
    }, []);

    function groupByRowSpan(data, groupField) {
        const grouped = {};
        data.forEach((item) => {
            const key = item[groupField];
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(item);
        });

        const finalData = [];
        Object.entries(grouped).forEach(([, rows]) => {
            rows.forEach((row, index) => {
                finalData.push({ ...row, rowSpan: index === 0 ? rows.length : 0 });
            });
        });
        return finalData;
    }

    const getCOLUMNOrder = async (id) => {
        setIsLoading(true);
        const colOrderResult = await TaDashboardDAO.getScrumColumOrderDAO(selectedHead)
        setIsLoading(true);


        if (colOrderResult?.statusCode === HTTPStatusCode.OK) {
            setColumnOrder(colOrderResult?.responseBody)
        } else {
            setColumnOrder([])
        }

    }

    const getListData = useCallback(async () => {
        let pl = {
            // taUserIDs: tableFilteredState?.filterFields_OnBoard?.taUserIDs,
            // roleTypeIDs: tableFilteredState?.filterFields_OnBoard?.roleTypeIDs,
            // hrStatusIDs: tableFilteredState?.filterFields_OnBoard?.hrStatusIDs,
            // taskStatusIDs: tableFilteredState?.filterFields_OnBoard?.taskStatusIDs,
            // modelType: tableFilteredState?.filterFields_OnBoard?.modelType,
            // priority: tableFilteredState?.filterFields_OnBoard?.priority,
            searchText: searchText,
            taHeadUserID: +selectedHead,
        };
        setIsLoading(true);
        const result = await TaDashboardDAO.getAllScrumTaskListRequestDAO(pl);

        setIsLoading(false);

        if (result.statusCode === HTTPStatusCode.OK) {
            // setTaListData(result.responseBody);
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
        if (selectedHead) {
            getListData();
            getCOLUMNOrder(selectedHead)
        }

    }, [searchText, tableFilteredState, selectedHead,]);





    const handleDragStart = (e, index, record) => {
        setDraggedRow(index);
        setDraggedRowData(record)
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e, index, record) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const updateORER = async (dropIndex, record) => {
        let pl = {
            ID: draggedRowData?.id,
            TAHeadUserIDs: selectedHead,
            DisplayOrder: record?.displayOrder
        }


        const result = await TaDashboardDAO.updateScrumTaskListRequestDAO(pl);

        if (result.statusCode === HTTPStatusCode.OK) {
            message.success("Row order updated")
            setTaListData(groupByRowSpan(result.responseBody, "taName"));
        } else if (result.statusCode === HTTPStatusCode.NOT_FOUND) {
            message.error("Something went wrong!")
        }

    }

    const handleDrop = (e, dropIndex, record) => {
        e.preventDefault();
        if (draggedRow === null || draggedRow === dropIndex) return;

        const newData = [...TaListData];
        const draggedItem = newData[draggedRow];
        newData.splice(draggedRow, 1);
        newData.splice(dropIndex, 0, draggedItem);
        setTaListData(newData);
        updateORER(dropIndex, record)
        setDraggedRow(null);
    };

    const handleDragEnd = () => {
        setDraggedRow(null);
    };

    const updateORERUPDOWN = async (pl) => {

        const result = await TaDashboardDAO.updateScrumTaskListRequestDAO(pl);

        if (result.statusCode === HTTPStatusCode.OK) {
            message.success("Row order updated")
            setTaListData(groupByRowSpan(result.responseBody, "taName"));
        } else if (result.statusCode === HTTPStatusCode.NOT_FOUND) {
            message.error("Something went wrong!")
        }

    }

    const updateGroupORERUPDOWN = async (pl) => {

        const result = await TaDashboardDAO.updateScrumTaskListGroupOrderRequestDAO(pl);
        if (result.statusCode === HTTPStatusCode.OK) {
            message.success("Group order updated")
            setTaListData(groupByRowSpan(result.responseBody, "taName"));
        } else if (result.statusCode === HTTPStatusCode.NOT_FOUND) {
            message.error("Something went wrong!")
        }

    }

    const canMoveUp = (record) => {
        let index = getRowIndex(record);
        if (index === 0) return false;

        return (
            TaListData[index].tA_UserID ===
            TaListData[index - 1].tA_UserID
        );
    };

    const canMoveDown = (record) => {
        let index = getRowIndex(record);
        if (index === TaListData.length - 1) return false;

        return (
            TaListData[index].tA_UserID ===
            TaListData[index + 1].tA_UserID
        );
    };

    const moveRowUp = (index, record) => {
        const i = getRowIndex(record);

        if (!canMoveUp(record)) return;
        if (i === 0) return;
        const newData = [...TaListData];
        [newData[i - 1], newData[i]] = [newData[i], newData[i - 1]];
        let pl = {
            ID: record?.id,
            TAHeadUserIDs: selectedHead,
            DisplayOrder: TaListData[i - 1]?.displayOrder
        }
        updateORERUPDOWN(pl)

        setTaListData(groupByRowSpan(newData, "taName"));
    };



    const moveRowDown = (index, record) => {
        const i = getRowIndex(record);

        if (!canMoveDown(record)) return;
        if (i === TaListData.length - 1) return;
        const newData = [...TaListData];
        [newData[i], newData[i + 1]] = [newData[i + 1], newData[i]];
        let pl = {
            ID: record?.id,
            TAHeadUserIDs: selectedHead,
            DisplayOrder: TaListData[i + 1]?.displayOrder
        }
        updateORERUPDOWN(pl)

        setTaListData(groupByRowSpan(newData, "taName"));
    };

    const getFilters = async () => {
        setIsLoading(true);
        let filterResult = await TaDashboardDAO.getAllMasterDAO();

        setIsLoading(false);
        if (filterResult.statusCode === HTTPStatusCode.OK) {
            setFiltersList(filterResult && filterResult?.responseBody);

        }
    };

    useEffect(() => {
        getFilters();
    }, []);

    useEffect(() => {

        if (filtersList?.HeadUsers?.length) {
            setSelectedHead(filtersList?.HeadUsers[0]?.id);
        }




    }, [filtersList?.HeadUsers, , userData]);

    const autoGroupColumnDef = {
        headerName: "TA",
        minWidth: 220,
        cellRendererParams: {
            suppressCount: false,
        },
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

    const updateHMPOC = async (params, val) => {
        let pl = {
            TA_Head_UserID: selectedHead,
            TaskID: params.id,
            HMAsPOC: val === 'Y' ? true : false
        }

        let updateresult = await TaDashboardDAO.updateHMPOCRequestDAO(pl);



    }

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

        if (key === "hmAsPOC") {
            updateHMPOC(params, value);
        } else {
            let updateresult = await TaDashboardDAO.updateTAListRequestDAO(pl);
        }

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
            tAHeadID: newTAHeadUservalue ? newTAHeadUservalue : selectedHead
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

    const TaskStatusComp = ({ text, result }) => {
        const index = getRowIndex(result);
        const [value, setValue] = useState(text ?? "");
        const colorCode = filtersList?.TaskStatus?.find((v) => v.data === value)?.colorCode ?? "";
        return (
            <div className={stylesOBj.tableSelectField}>
                <Select
                    value={value}
                    size="small"
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

                        if (val === "Fasttrack") {
                            setShowProfileTarget(true);
                            setStartTargetDate(startDate);
                            setProfileTargetDetails({ ...result, index: index });
                            return;
                        }
                        setValue(val);
                        let valobj = filtersList?.TaskStatus?.find((i) => i.data === val);
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

    const ScPopoupComp = ({ value, data, type }) => {
        return <p
            style={{ color: 'blue', fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer', margin: 0, textAlign: "center" }}
            onClick={() => {
                getScrumPOPUPInfo(data, type)
            }}
        >
            {value}
        </p>
    }

    const ScrumPopupColumns = () => {

        if (scrumPopupType === "TotalSubmission") {
            return [
                {
                    title: "Date",
                    dataIndex: "actionDate",
                    key: "actionDate",
                },
                {
                    title: "Talent",
                    dataIndex: "talent",
                    key: "talent",
                },
                {
                    title: "Submited By",
                    dataIndex: "profileSubmittedBy",
                    key: "profileSubmittedBy",
                },
                {
                    title: "Status",
                    dataIndex: "talentStatus",
                    key: "talentStatus",
                    render: (text, row) => {
                        console.log(row)
                        return All_Hiring_Request_Utils.GETTALENTSTATUS(+row?.talentStatusColor, row?.talentStatus)
                    }
                },
            ]
        }

        return [
            {
                title: "Date",
                dataIndex: "actionDate",
                key: "actionDate",
            },
            {
                title: "Talent",
                dataIndex: "talent",
                key: "talent",
            },
            //    {
            //         title: "Submited By",
            //         dataIndex: "profileSubmittedBy",
            //         key: "profileSubmittedBy",
            //     },
            {
                title: "Status",
                dataIndex: "talentStatus",
                key: "talentStatus",
                render: (text, row) => {
                    console.log(row)
                    return All_Hiring_Request_Utils.GETTALENTSTATUS(+row?.talentStatusColor, row?.talentStatus)
                }
            },
            {
                title: scrumPopupType === "ScreenReject" || scrumPopupType === "TotalReject" ? " Rejected Reason" : "Slot Details",
                dataIndex: "slotDetail",
                key: "slotDetail",
            },
        ]
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

    const getScrumPOPUPInfo = async (data, type) => {
        let Query = `?TaskID=${data.id}&OptionType=${type}`
        setShowScrumPopup(true)
        setScrumPopupType(type)
        setInfoforProfile(data);
        setScrumPopupLoading(true)
        let result = await TaDashboardDAO.getScrumPOPUPInfoDAO(Query)
        setScrumPopupLoading(false)

        if (result.statusCode === HTTPStatusCode.OK) {
            setScrumPopupData(result.responseBody)
        } else {
            setScrumPopupData([])
        }
    }

    const getTalentProfilesDetailsfromGoalsTable = async (
        { result,
            statusID,
            stageID, isToday }
    ) => {
        setShowTalentProfiles(true);
        setInfoforProfile(result);
        let targetDate

        if (isToday) {
            targetDate = moment().format("YYYY-MM-DD")
        } else {
            targetDate = moment().day() === 1
                ? moment().subtract(3, "days").format("YYYY-MM-DD")
                : moment().subtract(1, "day").format("YYYY-MM-DD");
        }

        let pl = {
            hrID: result?.hiringRequest_ID,
            statusID: statusID,
            stageID: statusID === 0 ? null : stageID ? stageID : 0,
            targetDate: targetDate,
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

    const handleSCRUMSearchInput = (value) => {

    }

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

    const updateNotes = async (pl, index) => {
        setTaListData(prev => {
            let tempD = [...prev]
            tempD[index] = { ...tempD[index], latestNotesTopRow: pl.Comments, latestNotes: pl.Comments }
            return tempD
        })
        let updateresult = await TaDashboardDAO.updateCommentRequestDAO(pl);
    }


    const updateTouchNotes = async (pl, index) => {
        setTaListData(prev => {
            let tempD = [...prev]
            tempD[index] = { ...tempD[index], touchBasedNotesTopRow: pl.Comments, touchBasedNotes: pl.Comments }
            return tempD
        })
        let updateresult = await TaDashboardDAO.updateTouchCommentRequestDAO(pl);
    }

    const updateSubmissionSheetNotes = async (pl, index) => {

        let updateresult = await TaDashboardDAO.updateSubmissionSheetDAO(pl);
    }

    const AddComment = (data, index) => {
        getAllComments(data.id);
        setShowComment(true);
        setCommentData({ ...data, index });
    };

    // ---- ag-Grid column model & shared context ----------------------------------

    function HrTitleCell(props) {
        const { value } = props;
        if (!value) return null;
        if (value.length <= 20) return <span>{value}</span>;
        return (
            <Tooltip title={value}>
                <span>{`${value.slice(0, 20)}...`}</span>
            </Tooltip>
        );
    }

    const sumFields = [
        "todayProfile_Shared_Target",
        "profile_Shared_Target",
        "profile_Shared_Achieved",
        "interview_Scheduled_Target"
    ];

    const getTotalRow = (rows, columnDefs) => {
        const total = {
            taName: "Total",
        };

        columnDefs.forEach((col) => {
            const field = col.field;

            if (!field || field === "taName") return;
            if (!sumFields.includes(field)) return
            let sum = 0;
            let hasNumericValue = false;

            rows.forEach((row) => {
                const value = row[field];

                if (typeof value === "number") {
                    sum += value;
                    hasNumericValue = true;
                } else if (
                    typeof value === "string" &&
                    value.trim() !== "" &&
                    !isNaN(value)
                ) {
                    sum += Number(value);
                    hasNumericValue = true;
                }
            });

            if (hasNumericValue) {
                total[field] = sum;
            }
        });

        return total;
    };


    // const getTAGroups = () => {
    //     const groups = [];

    //     let start = 0;

    //     while (start < TaListData.length) {

    //         const taId = TaListData[start].tA_UserID;

    //         let end = start;

    //         while (
    //             end + 1 < TaListData.length &&
    //             TaListData[end + 1].tA_UserID === taId
    //         ) {
    //             end++;
    //         }

    //         groups.push({
    //             taId,
    //             start,
    //             end
    //         });

    //         start = end + 1;
    //     }

    //     return groups;
    // };

    const getTAGroups = (rows) => {
        const groups = [];
        let start = 0;

        while (start < rows.length) {
            const taId = rows[start].tA_UserID;
            let end = start;

            while (
                end + 1 < rows.length &&
                rows[end + 1].tA_UserID === taId
            ) {
                end++;
            }

            groups.push({
                taId,
                start,
                end
            });

            start = end + 1;
        }

        return groups;
    };

    const moveTAGroupUp = (row) => {

        const groups = getTAGroups(TaListData);

        const index = groups.findIndex(g => g.taId === row.tA_UserID);

        if (index <= 0) return;

        const prev = groups[index - 1];
        const current = groups[index];

        const copy = [...TaListData];

        const prevRows = copy.slice(prev.start, prev.end + 1);
        const currentRows = copy.slice(current.start, current.end + 1);

        copy.splice(
            prev.start,
            prevRows.length + currentRows.length,
            ...currentRows,
            ...prevRows
        );

        let pl = {
            // ID: row?.id,
            TAUserID: row.tA_UserID,
            TAHeadUserIDs: selectedHead,
            TA_ScrumOrder: TaListData.find(i => i.tA_UserID === prev.taId)?.tA_ScrumOrder
            // DisplayOrder: TaListData[i + 1]?.displayOrder
        }

        updateGroupORERUPDOWN(pl)

        setTaListData(copy);

    };

    const moveTAGroupDown = (row) => {

        const groups = getTAGroups(TaListData);

        const index = groups.findIndex(g => g.taId === row.tA_UserID);

        if (index === groups.length - 1) return;

        const current = groups[index];
        const next = groups[index + 1];

        const copy = [...TaListData];

        const currentRows = copy.slice(current.start, current.end + 1);
        const nextRows = copy.slice(next.start, next.end + 1);

        copy.splice(
            current.start,
            currentRows.length + nextRows.length,
            ...nextRows,
            ...currentRows
        );

        let pl = {
            // ID: row?.id,
            TAUserID: row.tA_UserID,
            TAHeadUserIDs: selectedHead,
            TA_ScrumOrder: TaListData.find(i => i.tA_UserID === next.taId)?.tA_ScrumOrder
            // DisplayOrder: TaListData[i + 1]?.displayOrder
        }

        updateGroupORERUPDOWN(pl)

        setTaListData(copy);
    };

    const canMoveTAGroupUp = (row) => {
        const groups = getTAGroups(TaListData);

        const groupIndex = groups.findIndex(
            g => g.taId === row.tA_UserID
        );

        return groupIndex > 0;
    };

    const canMoveTAGroupDown = (row) => {
        const groups = getTAGroups(TaListData);

        const groupIndex = groups.findIndex(
            g => g.taId === row.tA_UserID
        );

        return groupIndex < groups.length - 1;
    };


    const getScrumGridColumns = () => [
        {
            headerName: 'TA',
            field: 'taName',
            width: 180,
            pinned: 'left',
            sortable: false,
            // rowSpan: (params) => params.data?.rowSpan || 1, 
            rowSpan: (params) => {

                if (params.api.isAnyFilterPresent()) {
                    return 1;
                }

                const api = params.api;
                const rowIndex = params.node.rowIndex;

                const current = params.data.tA_UserID;

                const prev = api.getDisplayedRowAtIndex(rowIndex - 1)?.data?.tA_UserID;

                if (prev === current) {
                    return 1;
                }

                let span = 1;

                for (let i = rowIndex + 1; i < api.getDisplayedRowCount(); i++) {
                    const next = api.getDisplayedRowAtIndex(i)?.data;

                    if (next?.tA_UserID === current) {
                        span++;
                    } else {
                        break;
                    }
                }

                return span;
            },
            // valueFormatter: (params) => params.data?.rowSpan > 0 ? params.value : '',
            // cellStyle: {
            //     alignItems: 'flex-start',
            //     paddingTop: 10,
            //     background: 'var(--ag-background-color, #fff)',

            //     // Adds a thick, clean border at the bottom of each TA group block
            //     borderBottom: '2px solid #e2e8f0',
            //     // Ensures the vertical line on the right remains clear
            //     borderRight: '1px solid #e2e8f0'
            // },
            cellRenderer: (params) => {
                if (params.node.rowPinned) {
                    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><strong>Total</strong></div>;
                }

                if (params.api.isAnyFilterPresent()) {
                    const rowIndex = params.node.rowIndex;

                    const prev = params.api
                        .getDisplayedRowAtIndex(rowIndex - 1)
                        ?.data?.tA_UserID;

                    if (prev === params.data.tA_UserID) {
                        return "";
                    }
                }

                if (params.data.rowSpan <= 0 && !params.api.isAnyFilterPresent()) return "";

                return (
                    <div style={{ display: "flex", alignItems: "flex-start" }}>
                        {params.api.isAnyFilterPresent() ? "" : <div style={{ display: "flex" }}>
                            <button
                                onClick={() => moveTAGroupUp(params.data)}
                                disabled={!canMoveTAGroupUp(params.data)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: canMoveTAGroupUp(params.data) ? "pointer" : "not-allowed",
                                    color: canMoveTAGroupUp(params.data) ? "#666" : "#ccc",
                                }}
                            >
                                ▲
                            </button>

                            <button
                                onClick={() => moveTAGroupDown(params.data)}
                                disabled={!canMoveTAGroupDown(params.data)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    marginLeft: '5px',
                                    cursor: canMoveTAGroupDown(params.data) ? "pointer" : "not-allowed",
                                    color: canMoveTAGroupDown(params.data) ? "#666" : "#ccc",
                                }}
                            >
                                ▼
                            </button>
                        </div>}

                        <span style={{ marginLeft: '5px', }}>{params.value}</span>
                    </div>
                );
            }
        },
        {
            headerName: 'Company',
            field: 'companyName',
            width: 200,
            pinned: 'left',
            cellRenderer: CompanyCell,
            sortable: false,
        },
        {
            headerName: 'HR ID',
            field: 'hrNumber',
            width: 180,
            pinned: 'left',
            cellRenderer: (props) => {
                const { value, data } = props;

                if (props.node.rowPinned) {
                    return "";
                }
                const i = getRowIndex(data);


                return (<>
                    <div style={{ display: 'flex', }}>
                        {props.api.isAnyFilterPresent() ? "" : <>
                            <button
                                onClick={() => moveRowUp(i, data)}
                                disabled={!canMoveUp(data)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: canMoveUp(data) ? "pointer" : "not-allowed",
                                    color: canMoveUp(data) ? "#666" : "#ccc",
                                }}
                            >
                                ▲
                            </button>
                            <button
                                onClick={() => moveRowDown(i, data)}
                                disabled={!canMoveDown(data)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    marginLeft: '5px',
                                    cursor: canMoveDown(data) ? "pointer" : "not-allowed",

                                    color: canMoveDown(data) ? "#666" : "#ccc",
                                }}
                            >
                                ▼
                            </button>
                        </>}
                        <a
                            href={`/allhiringrequest/${data?.hiringRequest_ID}`}
                            style={{ marginLeft: '5px' }}
                            target="_blank"
                            rel="noreferrer"
                            className={stylesOBj['hr-id']}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {value}
                        </a>

                    </div>

                </>

                );
            },
        },
        {
            headerName: 'HR Title',
            field: 'hrTitle',
            width: 200,
            pinned: 'left',
            cellRenderer: HrTitleCell,
            tooltipField: 'hrTitle',
        },

        {
            headerName: 'Status',
            field: 'taskStatus',
            width: 150,
            pinned: 'left',
            cellRenderer: (props) => {
                const { value, data } = props
                if (props.node.rowPinned) {
                    return "";
                }
                return <TaskStatusComp text={value} result={data} />
            },
        },
        {
            headerName: '# Interview Rounds',
            field: 'no_of_InterviewRounds',
            cellStyle: { textAlign: 'center' },
            width: 120,
            cellRenderer: ({ value, data }) => {
                return value ? value : ''
            }
        },

        {
            headerName: 'Inbound / Outbound',
            field: 'role_Type',
            width: 140,
            cellStyle: { textAlign: 'center' },
        },

        {
            headerName: 'HR Created Date',
            field: 'hrCreatedDate',
            cellStyle: { textAlign: 'center' },
            width: 150,
            valueFormatter: (params) => (params.value ? moment(params.value).format('DD/MM/YYYY') : ''),
        },
        {
            headerName: 'HR Status',
            field: 'tA_HR_Status',
            width: 130,
            cellRenderer: HrStatusCell,
        },
        {
            headerName: 'Active TRs',
            field: 'activeTR',
            cellStyle: { textAlign: 'center' },
            width: 100,
        },





        {
            headerName: 'Talent Annual CTC Budget (INR)',
            field: 'talent_AnnualCTC_Budget_INRValueStr',
            cellStyle: { textAlign: 'center' },
            width: 170,
            cellRenderer: ({ value, data }) => {
                return value ? value : ''
            }
        },
        {
            headerName: 'Revenue %',
            field: 'uplersFeesPer',
            cellStyle: { textAlign: 'center' },
            width: 100,
            cellRenderer: ({ value, data }) => {
                return value ? value : ''
            }
        },
        {
            headerName: 'Total Revenue Opportunity',
            field: 'totalRevenue_NoofTalentStr',
            cellStyle: { textAlign: 'center' },
            width: 170,
            cellRenderer: ({ value, data }) => {
                return value ? value : ''
            }
        },
        {
            headerName: 'No Of Days HR Is Open',
            field: 'days',
            cellStyle: { textAlign: 'center' },
            width: 170,
            cellRenderer: ({ value, data }) => {
                return value ? value : ''
            }
        },
        {
            headerName: 'No of Active Profile Till Date',
            field: 'noOfProfile_TalentsTillDate',
            width: 150,
            cellStyle: { textAlign: 'center' },
            cellRenderer: ActiveProfileCountCell,
        },
        {
            headerName: 'Latest Updates',
            field: 'latestNotes',
            width: 250,
            sortable: false,
            editable: true,
            wrapText: true,    // Allows text to break to next line visually
            autoHeight: true,  // Automatically grows the row height[cite: 1]
            cellEditorPopup: true,
            cellEditorPopupPosition: 'under', // opens below the cell instead of overlapping upward into the header
            // 👇 ADD THESE TWO CONFIGURATIONS
            // cellEditor: 'agTextCellEditor', 
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

            cellRenderer: LatestNotesCell,
        },

        {
            headerName: 'Total No Of Submissions',
            field: 'totalNoOfSubmission',
            cellStyle: { textAlign: 'center' },
            width: 170,
            cellRenderer: (props) => {
                const { value, data } = props
                if (props.node.rowPinned) {
                    return value;
                }
                return value ? <ScPopoupComp value={value} data={data} type={"TotalSubmission"} /> : ''
            }
        },

        {
            headerName: 'Screen Reject',
            field: 'screenReject',
            cellStyle: { textAlign: 'center' },
            width: 90,
            cellRenderer: (props) => {
                const { value, data } = props
                if (props.node.rowPinned) {
                    return value;
                }
                return value ? <ScPopoupComp value={value} data={data} type={"ScreenReject"} /> : ''
            }
        },
        {
            headerName: 'Total No Of Interview Rejects',
            field: 'totalNoOfInterviewReject',
            width: 170,
            cellStyle: { textAlign: 'center' },
            cellRenderer: (props) => {
                const { value, data } = props
                if (props.node.rowPinned) {
                    return value;
                }
                return value ? <ScPopoupComp value={value} data={data} type={"TotalReject"} /> : ''
            }
        },
        {
            headerName: 'R1', field: 'r1', width: 80, cellStyle: { textAlign: 'center' },
            cellRenderer: (props) => {
                const { value, data } = props
                if (props.node.rowPinned) {
                    return value;
                }
                return value ? <ScPopoupComp value={value} data={data} type={"R1"} /> : ''
            }
        },
        {
            headerName: 'R2', field: 'r2', width: 80, cellStyle: { textAlign: 'center' },
            cellRenderer: (props) => {
                const { value, data } = props
                if (props.node.rowPinned) {
                    return value;
                }
                return value ? <ScPopoupComp value={value} data={data} type={"R2"} /> : ''
            }
        },
        {
            headerName: 'R3', field: 'r3', width: 80, cellStyle: { textAlign: 'center' },
            cellRenderer: (props) => {
                const { value, data } = props
                if (props.node.rowPinned) {
                    return value;
                }
                return value ? <ScPopoupComp value={value} data={data} type={"R3"} /> : ''
            }
        },

        {
            headerName: "Today's Submission Target",
            field: 'todayProfile_Shared_Target',
            cellStyle: { textAlign: 'center' },
            width: 150,
            cellRenderer: ProfileSharedTargetCell,
            cellRendererParams: { objKey: 'todayProfile_Shared_Target' },
        },
        {
            headerName: "Yesterday's Submission Target",
            field: 'profile_Shared_Target',
            width: 150,
            cellStyle: { textAlign: 'center' },

        },
        {
            headerName: "Yesterday's Target Achieved",
            field: 'profile_Shared_Achieved',
            cellStyle: { textAlign: 'center' },
            width: 150,
            // cellRenderer: ProfileSharedTargetCell,
            cellRenderer: (props) => {
                const { value, data } = props
                if (props.node.rowPinned) {
                    return value;
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
            headerName: "Today's Interview Schedule",
            field: 'interview_Scheduled_Target',
            cellStyle: { textAlign: 'center' },
            width: 150,
            // cellRenderer: ProfileSharedTargetCell,
            cellRenderer: (props) => {
                const { value, data } = props
                if (props.node.rowPinned) {
                    return value;
                }
                return value ? <ScPopoupComp value={value} data={data} type={'InterviewScheduledTarget'} /> : ''
            }
        },
        {
            headerName: 'Weekly Selection Planned',
            field: 'weeklySelectionPlanStr',
            width: 170,
            cellStyle: { textAlign: 'left' },
            cellRenderer: ({ value, data }) => {
                return value ? value : ''
            }
        },
        {
            headerName: 'Joining Date',
            field: 'joiningDate',
            cellStyle: { textAlign: 'center' },
            width: 150,
        },
        {
            headerName: 'Touch Based Notes',
            field: 'touchBasedNotes',
            width: 250,
            sortable: false,
            editable: true,
            wrapText: true,    // Allows text to break to next line visually
            autoHeight: true,  // Automatically grows the row height[cite: 1]
            cellEditorPopup: true,
            cellEditorPopupPosition: 'under', // opens below the cell instead of overlapping upward into the header

            cellEditor: 'agLargeTextCellEditor',
            cellEditorParams: {
                maxLength: 1000, // Optional: restricts max length
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
                let index = getRowIndex(params.data)
                let pl = {
                    TA_Head_UserID: selectedHead,
                    TaskID: params.data.id,
                    Comments: params.newValue
                }

                updateTouchNotes(pl, index)
            },

            cellRenderer: LatestTouchCell,
        },
        {
            headerName: 'Submission Sheet',
            field: 'submissionSheet',
            width: 250,
            sortable: false,
            editable: true,
            wrapText: true,    // Allows text to break to next line visually
            autoHeight: true,  // Automatically grows the row height[cite: 1]
            cellEditorPopup: true,
            cellEditorPopupPosition: 'under', // opens below the cell instead of overlapping upward into the header

            cellEditor: 'agTextCellEditor',
            cellEditorParams: {
                maxLength: 500, // Optional: restricts max length
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
                let index = getRowIndex(params.data)
                let pl = {
                    tA_Head_UserID: selectedHead,
                    taskID: params.data.id,
                    comments: params.newValue
                }

                updateSubmissionSheetNotes(pl, index)
            },

            cellRenderer: SubmissionSheetCell,
        },
        {
            headerName: 'Hiring Manager AS POC (Y/N)',
            field: 'hmAsPOC',
            width: 100,
            sortable: false,
            cellRenderer: YesNoCell,
            cellRendererParams: { objKey: 'hmAsPOC' },
        },
        {
            headerName: "Yesterday's No of Calls",
            field: 'noOfCallsGivenDay',
            cellStyle: { textAlign: 'center' },
            width: 150,
            // cellRenderer: ProfileSharedTargetCell,
            cellRendererParams: { objKey: 'noOfCallsGivenDay' },
        },
        {
            headerName: 'Action',
            field: 'Action',
            width: 100,
            sortable: false,
            cellRenderer: (props) => {
                const { value, data } = props
                if (props.node.rowPinned) {
                    return "";
                }
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
                );
            },

        },
    ];


    const pinnedBottomRowData = useMemo((par) => {
        return [getTotalRow(TaListData, getScrumGridColumns())];
    }, [TaListData]);

    /**
     * Sensible Excel-like defaults applied to every column unless overridden above.
     */
    const scrumDefaultColDef = {
        resizable: true,
        sortable: true,
        filter: true,
        suppressMovable: false, // lets users drag-reorder columns, like Excel column drag
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'ag-cell-excel-border',
        headerClass: `${gridStyles["ag-header-center"]}`,
    };

    // Static column config (renderers live in ./scrumGridColumns + ./cellRenderers/*)
    const gridColumns = useMemo(() => {
        if (columnOrder.length) {
            let newOrderObj = []
            let originalObj = getScrumGridColumns()
            let shortorder = columnOrder.sort(
                (a, b) => a.columnOrder - b.columnOrder
            );

            shortorder.forEach(i => {
                
                let obj = originalObj.find(val => val.field.trim() === i.columnName.trim())
                newOrderObj.push(obj)
            })

            return newOrderObj
        } else {
            return getScrumGridColumns()
        }


    }, [TaListData, columnOrder]);

    // Rows keep their original array index available to renderers via id lookup,
    // since ag-Grid's own row index can change once sorting/filtering is used.
    const getRowIndex = useCallback(
        (row) => TaListData.findIndex((r) => r.id === row.id),
        [TaListData]
    );

    // Everything the cell renderers used to reach via closure now travels through
    // ag-Grid's `context` prop, rebuilt on every render so it always has fresh state.
    const gridContext = {
        taListData: TaListData,
        filtersList,
        selectedHead,
        userData,
        targetValue,
        startDate,
        getRowIndex,
        updateTARowValue,
        moveRowUp,
        moveRowDown,
        canMoveDown,
        canMoveUp,
        setDiamondCompany,
        setShowDiamondRemark,
        setCompanyIdForRemark,
        setIsAddNewRow,
        setNewTAUserValue,
        setNewTAHeadUserValue,
        getCompanySuggestionHandler,
        setselectedCompanyID,
        getHRLISTForComapny,
        setShowProfileTarget,
        setStartTargetDate,
        setProfileTargetDetails,
        setGoalList,
        setTargetValue,
        setLoadingTalentProfile,
        getTalentProfilesDetailsfromTable,
        setTalentToMove,
        setProfileStatusID,
        setHRTalentListFourCount,
        AddComment,
    };

    // Excel-style single-cell copy (Ctrl+C / Cmd+C). True multi-cell range copy needs
    // ag-Grid Enterprise's Clipboard module; this covers the common single-cell case
    // without pulling in a paid dependency.
    const handleGridKeyDown = useCallback((params) => {
        const isCopy = (params.event.ctrlKey || params.event.metaKey) && params.event.key === 'c';
        if (!isCopy) return;
        const cellValue = params.api.getCellValue({ rowNode: params.node, colKey: params.column });
        if (cellValue !== undefined && cellValue !== null && navigator.clipboard) {
            navigator.clipboard.writeText(String(cellValue)).catch(() => { });
        }
    }, []);

    const handleCellEditingStarted = useCallback((params) => {
        // Only applies to the large-text popup editors
        if (params.column.getColId() === 'latestNotes' || params.column.getColId() === 'touchBasedNotes') {
            // Wait a tick for AG Grid to actually mount the popup + textarea
            setTimeout(() => {
                const textarea = document.querySelector(
                    '.ag-popup-editor textarea, .ag-large-textarea-input, .ag-large-textarea textarea'
                );
                if (textarea) {
                    // Reset cursor to the start so it doesn't auto-scroll to bottom
                    textarea.setSelectionRange(0, 0);
                    textarea.scrollTop = 0;
                    textarea.focus();
                }
            }, 0);
        }
    }, []);

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

    const updatePinnedTotalRow = (api) => {
        const filteredRows = [];

        api.forEachNodeAfterFilterAndSort((node) => {
            if (!node.rowPinned) {
                filteredRows.push(node.data);
            }
        });

        api.setGridOption("pinnedBottomRowData", [
            getTotalRow(filteredRows, getScrumGridColumns())
        ]);
    };

    const updateColumnOrder = async (pl) => {
        const result = await TaDashboardDAO.updateScrumTaskColumnOrderRequestDAO(pl);
        if (result.statusCode === HTTPStatusCode.OK) {
            message.success("Column order updated")
        } else if (result.statusCode === HTTPStatusCode.NOT_FOUND) {
            message.error("Something went wrong!")
        }
    }

    const onColumnMoved = (params) => {
        if (!params.finished) return; // Ignore intermediate drag events

        // console.log("Moved Column:", params.column.getColId());
        // console.log("New Position:", params.toIndex);
        // console.log("Source:", params.source);
        // console.log(params.api.getColumnState());

        let pl = {
            POD_Id: selectedHead,
            ColumnName: params.column.getColId(),
            ColumnOrder: params.toIndex + 1
        }

        updateColumnOrder(pl)
    };

    return (
        <div className={`${stylesOBj["dashboard-container"]}`}>
            <main className={`${stylesOBj["main-content"]}`}>
                {/* <h1 style={{ marginBottom: '0', marginLeft: '16px', paddingLeft: '8px', fontSize: '24px' }}>TA Scrum Structure</h1> */}
                <div
                    //  className={`${stylesOBj["filterContainer"]}`}
                    style={{ display: 'flex', paddingRight: '15px', margin: '15px 10px' }}>


                    <Select
                        id="selectedValue"
                        placeholder="Select TA"
                        size="middle"
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

                    <div className={`${stylesOBj["filter-group"]} ${stylesOBj["search-group"]}`} style={{ marginLeft: '10px', marginRight: '10px' }}>
                        <input
                            ref={searchInputRef}
                            type="text"
                            className={stylesOBj["filter-input"]}
                            placeholder="Search"
                            style={{ height: "54px" }}
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

                    <button
                        className={stylesOBj.btnPrimary}
                        style={{ height: '54px', marginLeft: 'auto', }}
                        onClick={() => {
                            setIsAddNewRow(true);
                            setNewTAHeadUserValue(selectedHead);
                        }}
                    >
                        Add New Task
                    </button>

                </div>

                <div
                    ref={gridWrapperRef}
                    className={`${stylesOBj["table-container"]} ${gridStyles["grid-wrapper"]}`}
                    style={{ height: gridHeightPx }}
                >

                    {isLoading ? <TableSkeleton /> :

                        <AgGridReact
                            onGridReady={onGridReady}
                            onFirstDataRendered={params => updatePinnedTotalRow(params.api)}
                            theme={scrumGridTheme}
                            rowData={TaListData}
                            columnDefs={gridColumns}
                            defaultColDef={scrumDefaultColDef}
                            context={gridContext}
                            getRowId={(params) => String(params.data.id)}
                            suppressRowTransform={true}
                            animateRows={false}
                            headerHeight={44}
                            rowHeight={46}
                            onCellKeyDown={handleGridKeyDown}
                            onCellEditingStarted={handleCellEditingStarted}
                            groupDisplayType="singleColumn"
                            getRowStyle={(params) => {
                                if (params.node.rowPinned) {
                                    return {
                                        backgroundColor: '#F4F6F8', // Same as your header
                                        fontWeight: '700',
                                        borderTop: '2px solid #D9DEE3',
                                        color: '#1F2937'
                                    };
                                }

                                return null;
                            }}
                            groupDefaultExpanded={-1}
                            autoGroupColumnDef={autoGroupColumnDef}
                            popupParent={popupParent}
                            pinnedBottomRowData={pinnedBottomRowData}
                            onSortChanged={(params) => updatePinnedTotalRow(params.api)}
                            onFilterChanged={(params) => {
                                const filtered = params.api.isAnyFilterPresent();

                                setHasFilter(filtered);
                                updatePinnedTotalRow(params.api);
                                params.api.refreshCells({ force: true });
                                params.api.redrawRows();
                            }}
                            onColumnMoved={onColumnMoved}
                        />
                    }

                </div>



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
                                // className={stylesOBj.row}
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
                                        <div className={stylesOBj.row}>
                                            <div className={stylesOBj.colMd6}>
                                                <div
                                                    className={stylesOBj.calendarFilterSet}
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "self-start",
                                                    }}
                                                >
                                                    <div className={stylesOBj.label}>Date</div>
                                                    <div className={stylesOBj.calendarFilter}>
                                                        <CalenderSVG
                                                            style={{ height: "16px", marginRight: "16px" }}
                                                        />
                                                        <DatePicker
                                                            style={{ backgroundColor: "red" }}
                                                            onKeyDown={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                            }}
                                                            className={stylesOBj.dateFilter}
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
                                        <div className={stylesOBj.row} style={{ marginTop: "10px" }}>
                                            <div className={stylesOBj.colMd6}>
                                                <div
                                                    className={stylesOBj.calendarFilterSet}
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "self-start",
                                                    }}
                                                >
                                                    <div className={stylesOBj.label}>Target</div>
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
                                            <div className={stylesOBj.colMd6}>
                                                <div
                                                    style={{
                                                        padding: "10px",
                                                        display: "flex",
                                                        justifyContent: "end",
                                                        marginTop: "18px",
                                                    }}
                                                >
                                                    <button
                                                        className={stylesOBj.btnPrimary}
                                                        // disabled={ }
                                                        onClick={() => {
                                                            handleProfileShearedTarget();
                                                        }}
                                                    >
                                                        Proceed
                                                    </button>
                                                    <button
                                                        className={stylesOBj.btnCancle}
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
                                    className={stylesOBj.filterType}
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
                                    className={stylesOBj.filterType}
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
                                    className={stylesOBj.filterType}
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
                                    className={stylesOBj.filterType}
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
                                    className={stylesOBj.filterType}
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
                                    className={stylesOBj.filterType}
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
                                    className={stylesOBj.filterType}
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
                                    className={stylesOBj.filterType}
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
                                        scroll={{
                                            y: 600,

                                        }}
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
                                    className={stylesOBj.btnCancle}
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
                                className={stylesOBj.btnPrimary}
                                onClick={handleSubmit(handleRemoveDiamond)}
                                disabled={remDiamondLoading}
                            >
                                Save
                            </button>
                            <button
                                className={stylesOBj.btnCancle}
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
                                    <div className={stylesOBj.row}>
                                        <div className={stylesOBj.colMd6}>
                                            <div className={stylesOBj.formGroup}>
                                                <label>
                                                    Select Head <span className={stylesOBj.reqField}>*</span>
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
                                        <div className={stylesOBj.colMd6}>
                                            <div className={stylesOBj.formGroup}>
                                                <label>
                                                    Select TA <span className={stylesOBj.reqField}>*</span>
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
                                                    <p className={stylesOBj.error}>please select TA</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={stylesOBj.row}>
                                        <div className={stylesOBj.colMd6}>
                                            <div className={stylesOBj.formGroup}>
                                                <label>
                                                    Select Company{" "}
                                                    <span className={stylesOBj.reqField}>*</span>
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
                                                    <p className={stylesOBj.error}>please select company</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className={stylesOBj.colMd6}>
                                            <div className={stylesOBj.formGroup}>
                                                <label>
                                                    Select HR <span className={stylesOBj.reqField}>*</span>
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
                                                    <p className={stylesOBj.error}>please select HR</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {Object.keys(newTRAllData).length > 0 && <div className={stylesOBj.row}>
                                        <div className={stylesOBj.colMd6}>
                                            <div className={stylesOBj.formGroup} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <label>
                                                    Active TR {" "}
                                                    <span className={stylesOBj.reqField}>*</span>
                                                </label>

                                                <InputNumber size="large" value={newTRAllData.activeHR} min={1} max={20} onChange={(value) => { setTRAllData(prev => ({ ...prev, activeHR: parseInt(value) })) }} />


                                            </div>
                                            {newTaskError && (newTRAllData.activeHR <= 0 || newTRAllData.activeHR > 20 || isNaN(newTRAllData.activeHR)) && (
                                                <p className={stylesOBj.error} style={{ marginTop: '5px' }}>Please enter a value from 1 to 20 </p>
                                            )}
                                        </div>
                                    </div>}


                                    <div className={stylesOBj.HRINFOCOntainer}>
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
                                    className={stylesOBj.btnPrimary}
                                    disabled={isAddingNewTask}
                                    onClick={() => {
                                        saveNewTask();
                                    }}
                                >
                                    Save
                                </button>
                                <button
                                    className={stylesOBj.btnCancle}
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
                                <ul style={{ marginLeft: '10px', listStyleType: 'none' }}>
                                    {allCommentList.map((item) => (
                                        <> <li
                                            key={item.comments}
                                            style={{ marginBottom: "10px" }}
                                        > <div style={{ display: 'flex' }}>
                                                <EditSVG
                                                    width={22}
                                                    height={22}
                                                    style={{ marginRight: '10px', cursor: 'pointer' }}
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
                                className={stylesOBj.btnCancle}
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
                                    <div className={stylesOBj.row}>
                                        <div className={stylesOBj.colMd6}>
                                            <div className={stylesOBj.formGroup}>
                                                <label>
                                                    Select Head <span className={stylesOBj.reqField}>*</span>
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
                                        <div className={stylesOBj.colMd6}>
                                            <div className={stylesOBj.formGroup}>
                                                <label>
                                                    Select TA <span className={stylesOBj.reqField}>*</span>
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
                                                    <p className={stylesOBj.error}>please select TA</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={stylesOBj.row}>
                                        <div className={stylesOBj.colMd6}>
                                            <div className={stylesOBj.formGroup}>
                                                <label>
                                                    Select company{" "}
                                                    <span className={stylesOBj.reqField}>*</span>
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
                                        <div className={stylesOBj.colMd6}>
                                            <div className={stylesOBj.formGroup}>
                                                <label>
                                                    Select HR <span className={stylesOBj.reqField}>*</span>
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

                                    <div className={stylesOBj.HRINFOCOntainer}>
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
                                    className={stylesOBj.btnPrimary}
                                    disabled={isEditNewTask}
                                    onClick={() => {
                                        saveEditTask();
                                    }}
                                >
                                    Save
                                </button>
                                <button
                                    className={stylesOBj.btnCancle}
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
                                    className={stylesOBj.btnPrimary}
                                    disabled={loadingTalentProfile}
                                    onClick={() => {
                                        removeTask(profileInfo?.id);
                                    }}
                                >
                                    Yes Remove
                                </button>
                                <button
                                    className={stylesOBj.btnCancle}
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

                {showScrumPopup && (
                    <Modal
                        transitionName=""
                        width="1000px"
                        centered
                        footer={null}
                        open={showScrumPopup}
                        // className={allEngagementStyles.engagementModalContainer}
                        className="engagementModalStyle"
                        // onOk={() => setVersantModal(false)}
                        onCancel={() => {
                            setShowScrumPopup(false);
                            setSearchTerm("");
                            setScrumPopupData([]);
                        }}
                    >
                        <>
                            <div
                                style={{
                                    padding: "15px 15px 10px 15px",
                                    display: "flex",
                                    gap: "10px",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                }}
                            >
                                <h3>
                                    <strong>{profileInfo?.hrNumber}</strong>
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
                                    onChange={(e) => setSearchTerm(e.target.value)} // Create this function
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
                            {scrumPopupLoading ? (
                                <div>
                                    <Skeleton active />
                                </div>
                            ) : (
                                <div style={{ margin: "5px 10px", paddingBottom: '10px' }}>
                                    <Table
                                        dataSource={searchTerm ? scrumPopupData.filter(
                                            (talent) =>
                                                talent.talent.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                (talent.email &&
                                                    talent.email.toLowerCase().includes(searchTerm.toLowerCase()))
                                        ) : scrumPopupData}
                                        columns={ScrumPopupColumns()}
                                        // bordered
                                        pagination={false}
                                        scroll={{
                                            y: 500,

                                        }}
                                    />
                                </div>
                            )}



                            {/* <div style={{ padding: "10px 0" }}>
                                <button
                                    className={stylesOBj.btnCancle}                           
                                    onClick={() => {
                                        setSearchTerm("");
                                          setSearchTerm("");
                                         setShowScrumPopup(false);
                            setScrumPopupData([]);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div> */}
                        </>
                    </Modal>
                )}

            </main>
        </div>
    )
}

export default ScrumStructure2