import React, { useState, useCallback, useEffect, useRef } from 'react'
import stylesOBj from './scrumStructure.module.css'
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton'
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
const { Option } = Select;



function ScrumStructure() {
    const navigate = useNavigate()
    const [filtersList, setFiltersList] = useState({});
    const [TaListData, setTaListData] = useState([]);
    const [selectedHead, setSelectedHead] = useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [draggedRow, setDraggedRow] = React.useState(null);
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


    const [searchText, setSearchText] = useState('');
    const searchInputRef = useRef(null);
    const [debounceSearch, setDebounceSearch] = useState('')
    const [isAddNewRow, setIsAddNewRow] = useState(false);
    const [newTAUservalue, setNewTAUserValue] = useState("");
    const [newTAHeadUservalue, setNewTAHeadUserValue] = useState("");
    const [getCompanyNameSuggestion, setCompanyNameSuggestion] = useState([]);
    const [selectedCompanyID, setselectedCompanyID] = useState("");
    const [hrListSuggestion, setHRListSuggestion] = useState([]);
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

    useEffect(() => {
        const getUserResult = async () => {
            let userData = UserSessionManagementController.getUserSession();
            if (userData) setUserData(userData);
        };
        getUserResult();
    }, []);

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
        const result = await TaDashboardDAO.getAllScrumTaskListRequestDAO(pl);
        setIsLoading(false);

        if (result.statusCode === HTTPStatusCode.OK) {
            setTaListData(result.responseBody);
            //  setTaListData(groupByRowSpan(result.responseBody, "taName"));
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
        }

    }, [searchText, tableFilteredState, selectedHead,]);





    const handleDragStart = (e, index) => {
        setDraggedRow(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        if (draggedRow === null || draggedRow === dropIndex) return;

        const newData = [...TaListData];
        const draggedItem = newData[draggedRow];
        newData.splice(draggedRow, 1);
        newData.splice(dropIndex, 0, draggedItem);
        setTaListData(newData);
        setDraggedRow(null);
    };

    const handleDragEnd = () => {
        setDraggedRow(null);
    };

    const moveRowUp = (index) => {
        if (index === 0) return;
        const newData = [...TaListData];
        [newData[index - 1], newData[index]] = [newData[index], newData[index - 1]];
        setTaListData(newData);
    };

    const moveRowDown = (index) => {
        if (index === TaListData.length - 1) return;
        const newData = [...TaListData];
        [newData[index], newData[index + 1]] = [newData[index + 1], newData[index]];
        setTaListData(newData);
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

    const TaskStatusComp = ({ text, result, index }) => {
        const [value, setValue] = useState(text ?? "");
        const colorCode =
            filtersList?.TaskStatus?.find((v) => v.data === value)?.colorCode ?? "";
        return (
            <div className={stylesOBj.tableSelectField}>
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

    const getTableColumns = () => [
        {
            title: "Action",
            key: "action",
            dataIndex: "action",
            width: 100,
            fixed: "left",
            render: (_, record, index) => (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        //   justifyContent: "center",
                        gap: 8,
                    }}
                >
                    {/* Drag Handle */}
                    <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragEnd={handleDragEnd}
                        style={{
                            cursor: "grab",
                            fontSize: 18,
                            color: "#999",
                            userSelect: "none",
                        }}
                        title="Drag to move"
                    >
                        ⋮⋮
                    </div>

                    <button
                        onClick={() => moveRowUp(index)}
                        disabled={index === 0}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: index === 0 ? "not-allowed" : "pointer",
                            color: index === 0 ? "#ccc" : "#666",
                        }}
                    >
                        ▲
                    </button>

                    <button
                        onClick={() => moveRowDown(index)}
                        disabled={index === TaListData.length - 1}
                        style={{
                            background: "none",
                            border: "none",
                            cursor:
                                index === TaListData.length - 1
                                    ? "not-allowed"
                                    : "pointer",
                            color:
                                index === TaListData.length - 1
                                    ? "#ccc"
                                    : "#666",
                        }}
                    >
                        ▼
                    </button>
                </div>
            ),
        },

        {
            title: "Company Name",
            dataIndex: "companyName",
            key: "companyName",
            width: 220,
            fixed: "left",
            render: (text, row, i) => {
                return <div className={stylesOBj["company-cell"]}  style={{justifyContent: 'space-between'}}>
                    <span className={stylesOBj["company-name"]}>{row.companyName}</span>
                    <div style={{ display: 'flex' }}>
                        <button
                            className={stylesOBj["diamond-toggle"]}
                            data-tooltip={userData?.UserId === 2 ||
                                userData?.UserId === 333 ||
                                userData?.UserId === 190 || userData?.UserId === 96 ? (row?.companyCategory === "Diamond" ? "Remove Diamond" : "Add Diamond") : "Not allowed"}
                            onClick={() => {
                                if (userData?.UserId === 2 ||
                                    userData?.UserId === 333 ||
                                    userData?.UserId === 190 || userData?.UserId === 96) {
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
                                ? <img src="images/diamond-active-ic.svg" alt="Diamond Active" className={`${stylesOBj["diamond-icon"]} ${stylesOBj["diamond-active"]}`} />
                                : <img src="images/diamond-ic.svg" alt="Diamond" className={`${stylesOBj["diamond-icon"]} ${stylesOBj["diamond-inactive"]}`} />}
                        </button>
                        {userData?.showTADashboardDropdowns && <button className={stylesOBj["plus-task-btn"]} data-tooltip={`Add task for TA ${row.taName} in ${row.companyName}`}
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


                </div>
            }
        },

        {
            title: "HR ID",
            dataIndex: "hrNumber",
            key: "hrNumber",
            width: 120,
            fixed: "left",
            render: (text, row, i) => {
                return <a href={`/allhiringrequest/${row?.hiringRequest_ID}`} target="_blank" className={`${stylesOBj["hr-id"]}`}>{text}</a>
            }
        },

        {
            title: "HR Title",
            dataIndex: "hrTitle",
            key: "hrTitle",
            width: 220,
        },

        {
            title: <>Hiring Manager<br /> AS POC (Y/N)</>,
            dataIndex: "hiringManagerPOC",
            key: "hiringManagerPOC",
            width: 180,
        },

        //   {
        //     title: "Category",
        //     dataIndex: "category",
        //     key: "category",
        //     width: 120,
        //   },

        {
            title: <># Interview <br />Rounds</>,
            dataIndex: "no_of_InterviewRounds",
            key: "no_of_InterviewRounds",
            width: 150,
        },

        {
            title: <>Inbound <br />/ Outbound</>,
            dataIndex: "role_Type",
            key: "role_Type",
            width: 160,
        },

        {
            title: "Status",
            dataIndex: "taskStatus",
            key: "taskStatus",
            width: 180,
            render: (text, record, index) => (
                <TaskStatusComp
                    text={text}
                    result={record}
                    index={index}
                />
            ),
        },

        {
            title: "Active TRs",
            dataIndex: "activeTR",
            key: "activeTR",
            width: 100,
        },

        {
            title: "TA",
            dataIndex: "salesName",
            key: "salesName",
            width: 150,
        },

        {
            title: <>Talent Annual <br /> CTC Budget (INR)</>,
            dataIndex: "talent_AnnualCTC_Budget_INRstring",
            key: "talent_AnnualCTC_Budget_INRstring",
            width: 150,
        },

        {
            title: <>Revenue <br/> Opportunity (%)</>,
            dataIndex: "revenue_On10PerCTC",
            key: "revenue_On10PerCTC",
            width: 150,
        },

        {
            title: <>Total Revenue <br /> Opportunity</>,
            dataIndex: "totalRevenue_NoofTalent",
            key: "totalRevenue_NoofTalent",
            width: 150,
        },

        {
            title: "HR Status",
            dataIndex: "tA_HR_Status",
            key: "tA_HR_Status",
            width: 120,
        },

        {
            title: "HR Created Date",
            dataIndex: "hrCreatedDate",
            key: "hrCreatedDate",
            width: 150,
        },

        {
            title: <>No Of Days <br /> HR Is Open</>,
            dataIndex: "noDaysHROpen",
            key: "noDaysHROpen",
            width: 170,
        },

        {
            title: <>No Of Active <br />/ Submitted Profiles </>,
            dataIndex: "noOfProfile_TalentsTillDate",
            key: "noOfProfile_TalentsTillDate",
            width: 220,
            render: (text, row, i) => {
                return +row?.noOfProfile_TalentsTillDate > 0 ? (
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
                )
            }
        },

        {
            title: <>Latest Communication <br /> & Updates</>,
            dataIndex: "latestCommunicationUpdates",
            key: "latestCommunicationUpdates",
            width: 250,
        },

        {
            title: <>No Of Calls <br />On Given Day</>,
            dataIndex: "noOfCallsGivenDay",
            key: "noOfCallsGivenDay",
            width: 170,
        },

        {
            title: "No Of Notes",
            dataIndex: "noOfNotes",
            key: "noOfNotes",
            width: 120,
        },

        {
            title: <>Submission Target <br />On Given Date</>,
            dataIndex: "submissionTargetOnGivenDate",
            key: "submissionTargetOnGivenDate",
            width: 220,
        },

        {
            title: <>Submission Target <br />Achieved</>,
            dataIndex: "interview_Scheduled_Target",
            key: "interview_Scheduled_Target",
            width: 200,
        },

        {
            title: <>Total No Of <br /> Submissions</>,
            dataIndex: "totalNoOfSubmission",
            key: "totalNoOfSubmission",
            width: 180,
        },

        {
            title: "Screen Reject",
            dataIndex: "screenReject",
            key: "screenReject",
            width: 120,
        },

        {
            title: "R1",
            dataIndex: "r1",
            key: "r1",
            width: 80,
        },

        {
            title: "R2",
            dataIndex: "r2",
            key: "r2",
            width: 80,
        },

        {
            title: "R3",
            dataIndex: "r3",
            key: "r3",
            width: 80,
        },

        {
            title: <>Total No Of<br /> Interview Rejects</>,
            dataIndex: "totalNoOfInterviewReject",
            key: "totalNoOfInterviewReject",
            width: 220,
        },

        {
            title: "Weekly Selection Planned",
            dataIndex: "weeklySelectionPlan",
            key: "weeklySelectionPlan",
            width: 180,
        },

        {
            title: "Joining Date",
            dataIndex: "joiningDate",
            key: "joiningDate",
            width: 150,
        },

        {
            title: "Touch Base Notes",
            dataIndex: "touchBaseNotes",
            key: "touchBaseNotes",
            width: 250,
        },
    ];

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

    return (
        <div className={`${stylesOBj["dashboard-container"]}`}>
            <main className={`${stylesOBj["main-content"]}`}>
                <div style={{ display: 'flex', marginTop: '10px', paddingRight: '15px', justifyContent: 'center' }}>
                    <h1 style={{ marginBottom: '0', marginLeft: '16px', paddingLeft: '8px', fontSize: '24px' }}>TA Scrum Structure</h1>



                    <div className={`${stylesOBj["filter-group"]} ${stylesOBj["search-group"]}`} style={{ marginLeft: 'auto', marginRight: '10px' }}>
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
                    <Select
                        id="selectedValue"
                        placeholder="Select TA"
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

                <div className={`${stylesOBj["table-container"]}`} style={{ margin: '16px' }}>

                    {isLoading ? <TableSkeleton /> :

                        <Table
                            rowKey="hrid"
                            columns={getTableColumns()}
                            dataSource={TaListData}
                            pagination={false}
                            scroll={{ x: "max-content", y: 600 }}
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


            </main>
        </div>
    )
}

export default ScrumStructure