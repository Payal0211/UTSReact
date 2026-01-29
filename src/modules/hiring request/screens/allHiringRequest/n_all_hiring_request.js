import React, {
    useState,
    useEffect,
    Suspense,
    useMemo,
    useCallback,
} from "react";
import stylesOBj from './n_all_hiring_request.module.css';
import { UserSessionManagementController } from "modules/user/services/user_session_services";
import { hiringRequestDAO } from "core/hiringRequest/hiringRequestDAO";
import { hrUtils } from "modules/hiring request/hrUtils";
import { HTTPStatusCode } from "constants/network";
import UTSRoutes from "constants/routes";
import { allHRConfig } from "./allHR.config";
import { All_Hiring_Request_Utils } from "shared/utils/all_hiring_request_util";
import { useNavigate } from "react-router-dom";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import { downloadToExcel } from "modules/report/reportUtils";
import {
    InputType,
    UserAccountRole,
} from "constants/application";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PreviewHRModal from "./previewHR/previewHRModal";
import { allCompanyRequestDAO } from "core/company/companyDAO";
import { Modal, message, Radio, Skeleton, Spin, Tooltip } from "antd";
import ReopenHRModal from "../../components/reopenHRModal/reopenHrModal";
import CloseHRModal from "../../components/closeHRModal/closeHRModal";
import { ReactComponent as ReopenHR } from "assets/svg/reopen.svg";
import RePostHRModal from "modules/hiring request/components/repostHRModal/repostHRModal";
import CloneHR from 'modules/hiring request/screens/allHiringRequest/cloneHRModal';
import { MasterDAO } from "core/master/masterDAO";
import SplitHR from "./splitHR";
import { ReportDAO } from "core/report/reportDAO";
import { useForm } from "react-hook-form";
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";


/** Importing Lazy components using Suspense */
const HiringFiltersLazyComponent = React.lazy(() =>
    import("modules/hiring request/components/hiringFilter/hiringFilters")
);

let defaaultFilterState = {
    pagesize: 20,
    pagenum: 1,
    sortdatafield: "CreatedDateTime",
    sortorder: "desc",
    searchText: "",
    IsDirectHR: false,
    hrTypeIds: ''
}


const MamoedCategoryRightComponent = ({ data, index ,handleHRRequest , tableFilteredState}) => {
        const [archetype, setArchetype] = useState(data?.hR_Category);
        const [showArchetypeDropdown, setShowArchetypeDropdown] = useState(false);

        const [loadingCat, setLoadingCat] = useState(false);

        const updateHRCategory = async (cat, hrID) => {
            let pl = { hrID: hrID, category: cat === 'None' ? '' : cat }
            setLoadingCat(true);
            let Result = await hiringRequestDAO.updateHRCategoryDAO(pl);
            setLoadingCat(false);
            if (Result.statusCode === HTTPStatusCode.OK) {
                setShowArchetypeDropdown(false)
                setArchetype(cat);
                handleHRRequest(cat,index);
            } else {
                message.error("Something went wrong, please try again later.");
            }
        }

        return <div className={`${stylesOBj["category-right"]}`}>
            {loadingCat ? <Spin /> : <>
                {archetype === '' ? <div className={`${stylesOBj["archetype-select-wrapper"]}`} >
                    <button type="button" className={`${stylesOBj["archetype-btn"]}`} onClick={() => setShowArchetypeDropdown(prev => !prev)}>Archetype</button>
                    {data?.hR_Category !== '' && <button type="button" className={`${stylesOBj["archetype-close"]}`} onClick={() => setArchetype(data?.hR_Category)}>×</button>}
                    <div className={`${stylesOBj["archetype-dropdown"]} ${showArchetypeDropdown ? stylesOBj["show"] : ""}`}>
                        <button type="button" className={`${stylesOBj["archetype-option"]}`} data-value="kitten" onClick={() => updateHRCategory("Kitten", data?.HRID)}>
                            <img src="images/kitten-ic.svg" alt="Kitten" /> Kitten
                        </button>
                        <button type="button" className={`${stylesOBj["archetype-option"]}`} data-value="cheetah" onClick={() => updateHRCategory("Cheetah", data?.HRID)}>
                            <img src="images/cheetah-ic.svg" alt="Cheetah" /> Cheetah
                        </button>
                        <button type="button" className={`${stylesOBj["archetype-option"]}`} data-value="panda" onClick={() => updateHRCategory("Panda", data?.HRID)}>
                            <img src="images/panda-ic.svg" alt="Panda" /> Panda
                        </button>
                    </div>
                </div> : <div className={`${stylesOBj["archetype-image-wrapper"]}`}>
                    <div className={`${stylesOBj["archetype-image-container"]}`}>
                        {archetype === 'Cheetah' && <img src="images/cheetah-ic.svg" alt="Cheetah" className={`${stylesOBj["archetype-image"]}`} />}
                        {archetype === 'Panda' && <img src="images/panda-ic.svg" alt="Panda" className={`${stylesOBj["archetype-image"]}`} />}
                        {archetype === 'Kitten' && <img src="images/kitten-ic.svg" alt="Kitten" className={`${stylesOBj["archetype-image"]}`} />}
                    </div>
                    <button type="button" className={`${stylesOBj["archetype-close"]}`} onClick={() => setArchetype('')}>×</button>
                </div>}
            </>}


        </div>
    }
export default function New_all_hiring_request() {
    const navigate = useNavigate();
    const [tableFilteredState, setTableFilteredState] = useState(defaaultFilterState);
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const pageSizeOptions = [20, 100, 200, 300, 500, 1000, 5000];
    const [isLoading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [apiData, setAPIdata] = useState([]);
    const [isAllowFilters, setIsAllowFilters] = useState(false);
    const [getHTMLFilter, setHTMLFilter] = useState(false);
    const [filtersList, setFiltersList] = useState([]);
    const [appliedFilter, setAppliedFilters] = useState(new Map());
    const [checkedState, setCheckedState] = useState(new Map());
    const [rejectionReasons, setRejectionReasons] = useState([]);
    const [isShowDirectHRChecked, setIsShowDirectHRChecked] = useState(false);
    const [filteredTagLength, setFilteredTagLength] = useState(0);
    const [userData, setUserData] = useState({});
    const [isFrontEndHR, setIsFrontEndHR] = useState(false);
    const [isOnlyPriority, setIsOnlyPriority] = useState(false);
    const [isOnlyDiamond, setIsOnlyDiamond] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [openCloneHR, setCloneHR] = useState(false);
    const [openSplitHR, setSplitHR] = useState(false);

    const [getHRnumber, setHRNumber] = useState({ hrNumber: '', isHybrid: false });

    const miscData = UserSessionManagementController.getUserMiscellaneousData();



    const [isPreviewModal, setIsPreviewModal] = useState(false);
    const [previewIDs, setpreviewIDs] = useState();
    const [jobPreview, setJobPreview] = useState();
    const [allData, setAllData] = useState(null);
    const [hrIdforPreview, setHrIdforPreview] = useState("");
    const [hrNumber, sethrNumber] = useState("");
    const [ispreviewLoading, setIspreviewLoading] = useState(false)

    const [closeHRDetail, setCloseHRDetail] = useState({});
    const [closeHrModal, setCloseHrModal] = useState(false);
    const [reopenHrData, setReopenHRData] = useState({});
    const [reopenHrModal, setReopenHrModal] = useState(false);
    const [repostHrModal, setRepostHrModal] = useState(false)

    const [getHRID, setHRID] = useState("");
    const [isSplitLoading, setIsSplitLoading] = useState(false);
    const [groupList, setGroupList] = useState([{
        pod: '', amLead: '', amLeadAmount: '', am: '', amAmount: '', taLead: '', taLeadAmount: '', ta: '', taAmount: '', currency: ''
    }])

    const [showCloneHRToDemoAccount, setShowCloneHRToDemoAccount] = useState(false);

    const [showDiamondRemark, setShowDiamondRemark] = useState(false);
    const [showAddDiamondRemark, setShowAddDiamondRemark] = useState(false);
    const [companyIdForRemark, setCompanyIdForRemark] = useState(0);
    const [remDiamondLoading, setRemDiamondLoading] = useState(false);
    const [addDiamondReason, setAddDiamondReason] = useState("As Per Formula");


    const {
        watch,
        register,
        setError,
        handleSubmit,
        resetField,
        clearErrors,
        formState: { errors },
    } = useForm();



    useEffect(() => {
        const getUserResult = async () => {
            let userData = UserSessionManagementController.getUserSession();
            if (userData) setUserData(userData);
        };
        getUserResult();
    }, []);

    // check applied filteres on load
    useEffect(() => {
        localStorage.removeItem("hrID");
        localStorage.removeItem("fromEditDeBriefing");

        // console.log("filter list",response?.responseBody?.details?.Data)
        let appliedFilter = localStorage.getItem("filterFields_ViewAllHRs");
        let filterList = localStorage.getItem("appliedHRfilters");
        let checkedState = localStorage.getItem("HRFilterCheckedState");

        if (appliedFilter?.length > 0 || filterList?.length > 0) {
            setTableFilteredState((prev) => ({
                ...prev,
                filterFields_ViewAllHRs: JSON.parse(appliedFilter),
            }));

            let parsedVal = JSON.parse(appliedFilter);

            if (parsedVal?.fromDate && parsedVal?.toDate) {
                const [month, day, year] = parsedVal?.fromDate.split("/");
                const fromDate = new Date(`${year}-${month}-${day}`);

                const [endmonth, endday, endyear] = parsedVal?.toDate.split("/");
                const todate = new Date(`${endyear}-${endmonth}-${endday}`);

                setStartDate(fromDate);
                setEndDate(todate);
            }

            if (filterList?.length) {
                let mapData = JSON.parse(filterList);
                let checkedData = JSON.parse(checkedState);

                let newMap = new Map();
                let newCheckedmap = new Map();
                let filterCount = mapData.reduce((total, item) => {
                    return total + item.value.split(",").length;
                }, 0);
                mapData.forEach((item) => {
                    newMap.set(item.filterType, item);
                });
                if (checkedData?.length > 0) {
                    checkedData.forEach((item) => {
                        newCheckedmap.set(item.key, item.value);
                    });
                }
                setFilteredTagLength(filterCount);
                setAppliedFilters(newMap);
                setCheckedState(newCheckedmap);
            }

            setTimeout(() => { }, 5000);
        }
    }, []);

    const modifyResponseforPOD = async (data) => {
        let categories = []
        let modData = []

        data.forEach(item => {
            if (!categories.includes(item.category)) {
                categories.push(item.category)
            }
        })

        categories.forEach(async cat => {
            let cats = data.filter(item => item.category === cat)
            let podObj = {
                pod: '', amLead: '', amLeadAmount: '', am: '', amAmount: '', taLead: '', taLeadAmount: '', ta: '', taAmount: '', currency: ''
            }

            podObj.pod = cats[0]?.poD_ID
            podObj.currency = cats[0]?.currencyCode
            cats.forEach(itm => {
                switch (itm.roW_Value) {
                    case 'AM Lead': {
                        podObj.amLead = (itm.userID !== 0) ? itm.userID : ''
                        podObj.amLeadAmount = itm.revenue
                        break
                    }
                    case 'AM': {
                        podObj.am = (itm.userID !== 0) ? itm.userID : ''
                        podObj.amAmount = itm.revenue
                        break
                    }
                    case 'TA Lead': {
                        podObj.taLead = (itm.userID !== 0) ? itm.userID : ''
                        podObj.taLeadAmount = itm.revenue
                        break
                    }
                    case 'TA': {
                        podObj.ta = (itm.userID !== 0) ? itm.userID : ''
                        podObj.taAmount = itm.revenue
                        break
                    }
                    default: break
                }
            })
            modData.push(podObj)

        })


        return modData
    }

    const getPODList = async (getHRID) => {
        setIsSplitLoading(true);
        let pl = { hrNo: getHRID, podid: 0 }

        let filterResult = await ReportDAO.getAllPODUsersGroupDAO(pl);
        setIsSplitLoading(false);
        if (filterResult.statusCode === HTTPStatusCode.OK) {
            //   console.log('filterResult',filterResult?.responseBody)
            let modData = await modifyResponseforPOD(filterResult?.responseBody)

            //   let datawithList = await adduserListToEachPOD(modData)
            //   console.log('set g list',modData,datawithList)
            setGroupList(modData)
        } else if (filterResult?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
            // setLoading(false); 
            return navigate(UTSRoutes.LOGINROUTE);
        } else if (
            filterResult?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
        ) {
            // setLoading(false);
            return navigate(UTSRoutes.SOMETHINGWENTWRONG);
        } else {
            setGroupList([{
                pod: '', amLead: '', amLeadAmount: '', am: '', amAmount: '', taLead: '', taLeadAmount: '', ta: '', taAmount: '', currency: ''
            }])
            return "NO DATA FOUND";
        }
    };

    const handleHRRequest = useCallback(
        async (pageData) => {
            setLoading(true);
            // save filter value in localstorage
            if (pageData.filterFields_ViewAllHRs) {
                localStorage.setItem(
                    "filterFields_ViewAllHRs",
                    JSON.stringify(pageData.filterFields_ViewAllHRs)
                );
            } else {
                localStorage.removeItem('filterFields_ViewAllHRs');
            }

            let response = await hiringRequestDAO.getPaginatedHiringRequestDAO({
                ...pageData,
                isFrontEndHR: isFrontEndHR,
                StarNextWeek: isOnlyPriority,
                OnlyDiamond: isOnlyDiamond ? 'diamond' : ''
            });

            if (response?.statusCode === HTTPStatusCode.OK) {
                setTotalRecords(response?.responseBody?.totalrows);
                setLoading(false);
                setAPIdata(hrUtils.modifyHRRequestData(response && response));
                setShowCloneHRToDemoAccount(response?.responseBody?.ShowCloneToDemoAccount);
            } else if (response?.statusCode === HTTPStatusCode.NOT_FOUND) {
                setLoading(false);
                setTotalRecords(0);
                setAPIdata([]);
            } else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
                setLoading(false);
                return navigate(UTSRoutes.LOGINROUTE);
            } else if (
                response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
            ) {
                setLoading(false);
                return navigate(UTSRoutes.SOMETHINGWENTWRONG);
            } else {
                setLoading(false);
                return "NO DATA FOUND";
            }
        },
        [navigate, isFrontEndHR, isOnlyPriority, isOnlyDiamond]
    );

    const handleHRRequestWithoutAPI = (cat,index) =>{
        setAPIdata(prev=> {
            let newData = [...prev];
            newData[index].hR_Category = cat;
console.log(newData,'--newData',index,cat);
            return newData;
        });
    }

    const handleRequetWithDates = useCallback(() => {
        if (tableFilteredState?.filterFields_ViewAllHRs?.fromDate && tableFilteredState?.filterFields_ViewAllHRs?.toDate) {
            handleHRRequest({
                ...tableFilteredState,
                filterFields_ViewAllHRs: {
                    ...tableFilteredState.filterFields_ViewAllHRs,
                    // fromDate: new Date(startDate).toLocaleDateString("en-US"),
                    // toDate: new Date(endDate).toLocaleDateString("en-US"),
                    fromDate: tableFilteredState?.filterFields_ViewAllHRs?.fromDate,
                    toDate: tableFilteredState?.filterFields_ViewAllHRs?.toDate,
                },
            });
        } else {
            let appliedFilter = localStorage.getItem("filterFields_ViewAllHRs");

            if (
                appliedFilter?.length > 0 &&
                tableFilteredState.filterFields_ViewAllHRs === undefined
            ) {
                return;
            } else {
                handleHRRequest(tableFilteredState);
            }
        }
    }, [tableFilteredState, isFrontEndHR, isOnlyPriority, isOnlyDiamond]);

    useEffect(() => {
        // handleHRRequest(tableFilteredState);
        handleRequetWithDates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableFilteredState, isFrontEndHR, isOnlyPriority, isOnlyDiamond]);

    const getHRFilterRequest = useCallback(async () => {
        const response = await hiringRequestDAO.getAllFilterDataForHRRequestDAO();
        const rejectionResponse = await hiringRequestDAO.getAllFilterDataForHRRejectedReasonRequestDAO();
        if (response?.statusCode === HTTPStatusCode.OK) {
            setFiltersList(response && response?.responseBody?.details?.Data);
            //   setHRTypesList(response && response?.responseBody?.details?.Data.hrTypes.map(i => ({id:i.text, value:i.value})))
        } else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
            return navigate(UTSRoutes.LOGINROUTE);
        } else if (response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
            return navigate(UTSRoutes.SOMETHINGWENTWRONG);
        } else {
            return "NO DATA FOUND";
        }

        if (rejectionResponse?.statusCode === HTTPStatusCode.OK) {
            setRejectionReasons(rejectionResponse.responseBody.details.Data)
        }
    }, [navigate]);

    useEffect(() => {
        getHRFilterRequest();
    }, [getHRFilterRequest]);


    const getColorCode = (doneBy) => {
        if (doneBy === 2) {
            // ATS
            return { color: 'rgb(179, 76, 1)', background: 'rgb(249, 231, 218)' }
        }
        if (doneBy === 3) {
            // Sales portal
            return { color: 'rgb(23, 98, 10)', background: 'rgb(230, 247, 219)' }
        }
        if (doneBy === 4) {
            // client portal
            return { color: 'rgb(0, 112, 224)', background: 'rgb(232, 242, 253)' }
        }
    }

    function getPageNumbers(currentPage, totalPages) {
        const pages = [];

        if (totalPages <= 6) {
            // show all pages
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            // Always show first and last
            const left = Math.max(2, currentPage - 1);
            const right = Math.min(totalPages - 1, currentPage + 1);

            pages.push(1);
            if (left > 2) pages.push("...");

            for (let i = left; i <= right; i++) pages.push(i);

            if (right < totalPages - 1) pages.push("...");
            pages.push(totalPages);
        }

        return pages;
    }

    function Pagination({
        currentPage,
        totalRecords,
        pageSize,
        onPageChange,
    }) {
        const totalPages = Math.ceil(totalRecords / pageSize);

        const pages = getPageNumbers(currentPage, totalPages);

        return (
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                {/* Prev */}

                <button className={`${stylesOBj["pagination-btn"]}`} disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
                    <img src="images/arrow-left-ic.svg" alt="Previous" title="Previous Page" />
                </button>

                {/* Page Buttons */}
                {pages.map((p, i) =>
                    p === "..." ? (
                        <span key={i}>...</span>
                    ) : (
                        <button
                            key={i}
                            onClick={() => onPageChange(p)}
                            style={{
                                background: p === currentPage ? "gold" : "white",
                                border: "1px solid #ccc",
                                padding: "4px 8px",
                                cursor: "pointer",
                            }}
                        >
                            {p}
                        </button>
                    )
                )}

                {/* Next */}
                <button className={`${stylesOBj["pagination-btn"]}`} disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}>
                    <img src="images/arrow-right-ic.svg" alt="Next" title="Next Page" />
                </button>
            </div>
        );
    }

    const toggleHRFilter = useCallback(() => {
        !getHTMLFilter
            ? setIsAllowFilters(true)
            : setTimeout(() => {
                setIsAllowFilters(true);
            }, 300);
        setHTMLFilter(!getHTMLFilter);
    }, [getHTMLFilter]);

    const onRemoveHRFilters = () => {
        setTimeout(() => {
            setIsAllowFilters(false);
        }, 300);
        setHTMLFilter(false);
    };

    const clearFilters = useCallback(() => {
        setAppliedFilters(new Map());
        setCheckedState(new Map());
        setFilteredTagLength(0);
        setTableFilteredState(defaaultFilterState);
        // const reqFilter = {
        //   ...tableFilteredState,
        //   ...{
        //     pagesize: 100,
        //     pagenum: 1,
        //     sortdatafield: "CreatedDateTime",
        //     sortorder: "desc",
        //     searchText: "",
        //     // filterFields_ViewAllHRs: {},
        //     IsDirectHR: false,
        //   },
        // };

        localStorage.removeItem("filterFields_ViewAllHRs");
        localStorage.removeItem("appliedHRfilters");
        localStorage.removeItem("HRFilterCheckedState");
        // handleHRRequest(defaaultFilterState);
        setIsAllowFilters(false);
        setEndDate(null);
        setStartDate(null);
        setDebouncedSearch("");
        setIsFrontEndHR(false);
        setIsOnlyPriority(false);
        setIsOnlyDiamond(false);
        setIsShowDirectHRChecked(false);
        //   setSelectedHRTypes([])
        setPageIndex(1);
        setPageSize(20);
    }, [
        // handleHRRequest,
        setAppliedFilters,
        setCheckedState,
        setFilteredTagLength,
        setIsAllowFilters,
        setTableFilteredState,
        // tableFilteredState,
    ]);

    const cloneHRhandler = async (isHybrid, payload, resetFields) => {
        let data = {
            hrid: getHRID,
        };
        if (isHybrid) {
            data = { ...data, ...payload }
        }
        const response = data?.hrid && (await MasterDAO.getCloneHRDAO(data));
        // console.log(response, '--response');
        if (response.statusCode === HTTPStatusCode.OK) {
            setCloneHR(false);
            resetFields && resetFields()
            // localStorage.setItem("hrID", response?.responseBody?.details);
            localStorage.removeItem("dealID");
            navigate(`${UTSRoutes.ADDNEWHR}/${response?.responseBody?.details}`, { state: { isCloned: true } });
        }
    };

    const handleExport = (apiData) => {
        // let DataToExport = apiData.map((data) => {
        //   let obj = {};
        //   tableColumnsMemo.map(
        //     (val) =>
        //       val.title !== " " && (obj[`${val.title}`] = data[`${val.dataIndex}`])
        //   );
        //   return obj;
        // });
        // downloadToExcel(DataToExport,'HR');

        const tableColumns = [
            //   { title: "SHORTCUTS", key: "shortcuts" },
            { title: "CREATED DATE", key: "Date" },
            { title: "HR ID", key: "HR_ID" },
            { title: "COMPANY", key: "Company" },
            { title: "POSITION", key: "Position" },
            { title: "CATEGORY", key: "companyCategory" },
            { title: "TR", key: "TR" },
            { title: "HR TYPE", key: "hrTypeName" },
            { title: "ENGAGEMENT TYPE", key: "hrEngagementType" },
            { title: "MARGIN %", key: "timeZone" },
            { title: "SALARY/CLIENT BUDGET", key: "salaryBudget" },
            { title: "HR STATUS", key: "hrStatus" },
            { title: "FTE/PTE", key: "typeOfEmployee" },
            { title: "SALES REP", key: "salesRep" },
            { title: "POD", key: "poDs" },
            { title: "OPEN SINCE", key: "hrAcceptedSince" },
            { title: "REJECT REASON", key: "pauseHRReason" }
        ];

        let DataToExport = apiData.map((data) => {
            let obj = {};
            tableColumns.map(
                (val) =>
                    val.title !== " " && (obj[`${val.title}`] = data[`${val.key}`])
            );
            return obj;
        });
        downloadToExcel(DataToExport, 'HR');
    };

    const handleAddDiamond = async (d) => {
        let payload = {
            CompanyID: companyIdForRemark.companyID,
            DiamondCategoryRemoveRemark: addDiamondReason === 'Other' ? d.diamondCategoryAddRemark : addDiamondReason,
        };
        setRemDiamondLoading(true);
        // console.log("payload", payload);
        let res = await allCompanyRequestDAO.addCompanyDiamondCategoryDAO(payload);
        setRemDiamondLoading(false);
        //   console.log("response", res);
        if (res.statusCode === 200) {

            setShowAddDiamondRemark(false);
            resetField("diamondCategoryAddRemark");
            clearErrors("diamondCategoryAddRemark");
            handleHRRequest(tableFilteredState);
        } else {
            message.error("Something Went Wrong!");
        }
    };

    const handleRemoveDiamond = async (d) => {
        let payload = {
            CompanyID: companyIdForRemark.companyID,
            DiamondCategoryRemoveRemark: d.diamondCategoryRemoveRemark,
        };
        setRemDiamondLoading(true);
        let res = await allCompanyRequestDAO.removeCompanyCategoryDAO(payload);
        setRemDiamondLoading(false);
        //   console.log("response", res);
        if (res.statusCode === 200) {

            setShowDiamondRemark(false);
            resetField("diamondCategoryRemoveRemark");
            clearErrors("diamondCategoryRemoveRemark");
            handleHRRequest(tableFilteredState);
        } else {
            message.error("Something Went Wrong!");
        }
    };

    const onCalenderFilter = (dates) => {
        const [start, end] = dates;

        setStartDate(start);
        setEndDate(end);

        if (start && end) {
            setTableFilteredState({
                ...tableFilteredState,
                filterFields_ViewAllHRs: {
                    ...tableFilteredState.filterFields_ViewAllHRs,
                    fromDate: new Date(start).toLocaleDateString("en-US"),
                    toDate: new Date(end).toLocaleDateString("en-US"),
                },
            });
        }
    };



    useEffect(() => {
        if (search.trim() === "") return
        setTableFilteredState(prev => ({
            ...prev,
            pagenum: 1,
            searchText: search,
        }));
    }, [search])

    useEffect(() => {
        if (debouncedSearch.length > 1 || debouncedSearch === "") {
            const handler = setTimeout(() => {
                setSearch(debouncedSearch); // Fire search only here
            }, 1000);

            return () => clearTimeout(handler);

        }
    }, [debouncedSearch])

    const debouncedSearchHandler = (e) => {
        if (e.target.value.length > 1 || e.target.value === "") {
            setTimeout(() => {
                setTableFilteredState({
                    ...tableFilteredState,
                    pagenum: 1,
                    searchText: e.target.value,
                });
            }, 2000);
        }

        setDebouncedSearch(e.target.value);
        setPageIndex(1);
        //debounceFun(e.target.value);
    };

    const getPreviewPostData = async (hrId, hrNumber, companyId) => {
        setHrIdforPreview(hrId);
        setIspreviewLoading(true);
        let data = {};

        // data.contactId = 810;
        data.companyId = companyId;
        data.hrId = hrId;

        let res = await allCompanyRequestDAO.getHrPreviewDetailsDAO(data);


        if (res.statusCode === 200) {
            let details = res?.responseBody;
            const previewData = { ...details.JobPreview, hrNumber: hrNumber, HRID: hrId, atSJoblocation: details.atSJoblocation };
            sethrNumber(hrNumber);
            setJobPreview(previewData);
            setAllData(details);
        }
        setIspreviewLoading(false);
    };

    const handleReopen = async (d) => {
        setLoading && setLoading(true)
        let data = { hrID: reopenHrData?.HR_Id, updatedTR: reopenHrData?.ClientDetail?.NoOfTalents };
        const response = await hiringRequestDAO.ReopenHRDAO(data);
        setLoading && setLoading(false)
        // console.log("reoprn ",response)
        if (response?.statusCode === HTTPStatusCode.OK) {

            setLoading && setLoading(false)
            if (response?.responseBody?.details?.isReopen) {
                // window.location.reload();
                handleHRRequest(tableFilteredState);
            } else {
                message.error(response?.responseBody?.details?.message, 10)
            }
        }
        if (response?.statusCode === HTTPStatusCode.BAD_REQUEST) {
            message.error(response?.responseBody, 10)
            setLoading && setLoading(false)
        }

    };


    

    // const CategoryRightComponent = useMemo(({data,index})=> <MamoedCategoryRightComponent data={data} index={index} /> ,[allData]) 

    return (
        <div className={`${stylesOBj["dashboard-container"]}`}>


            {/* <!-- Main Content Area --> */}
            <main className={`${stylesOBj["main-content"]}`}>


                {/* <!-- Content Section --> */}
                <div className={`${stylesOBj["content-wrapper"]}`}>
                    {/* <!-- Filter Controls --> */}
                    <div className={`${stylesOBj["filter-controls"]}`}>
                        {/* <div className={`${stylesOBj["filter-group"]}`}>
                            <input type="text" className={`${stylesOBj["filter-input"]} ${stylesOBj['date-input']}`} placeholder="Select Date Range" />
                            <img src="images/calendar-ic.svg" alt="Calendar Icon" className={`${stylesOBj["input-icon"]}`} />
                        </div> */}

                        <div className={`${stylesOBj.calendarFilter}`} >
                            <DatePicker
                                style={{ backgroundColor: "red" }}
                                onKeyDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                className={stylesOBj.dateFilter}
                                placeholderText="Select Date Range"
                                selected={startDate}
                                onChange={onCalenderFilter}
                                startDate={startDate}
                                endDate={endDate}
                                selectsRange
                            />
                            <img src="images/calendar-ic.svg" alt="Calendar Icon" className={`${stylesOBj["input-icon"]}`} />

                        </div>

                        {/* {(startDate && endDate) &&  <img src="images/close-hr-ic.svg" alt="Close Icon" onClick={()=>{setStartDate(null);setEndDate(null)}} className={`${stylesOBj["input-icon"]}`} />} */}

                        <div className={`${stylesOBj["filter-group"]} ${stylesOBj['search-group']}`}>
                            <input type="text" className={`${stylesOBj["filter-input"]} ${stylesOBj['search-input']}`} placeholder="Search"
                                onChange={debouncedSearchHandler}
                                value={debouncedSearch}
                            />
                            <img src="images/search-ic.svg" alt="Search Icon" className={`${stylesOBj["input-icon"]}`} />
                        </div>

                        {/* <div style={{ display: 'flex', gap: '10px', width: 'max-content' }}> */}
                            <button className={`${stylesOBj["filter-btn"]}`} onClick={toggleHRFilter} >

                                <div style={{ display: 'flex', gap: '10px' }}>
                                    
                                     <img src="images/filter-ic.svg" alt="Filter Icon" />
                                    <span>Add Filters</span>

                                </div>
                                <div style={{ display: 'flex', gap: '10px' }} >
                                     <div className={stylesOBj.filterCount}>{filteredTagLength}</div>
                                     {(filteredTagLength > 0 || startDate || debouncedSearch) &&<Tooltip title="Reser Filters">
                                        <span style={{ color: 'red', fontWeight: 'bold', fontSize: 'Large' }} onClick={e=> {
                                    e.stopPropagation();
                                    clearFilters()
                                }}>X</span>
                                     </Tooltip> }

                                </div>
                              
                            </button>

                            {/* <button className={`${stylesOBj["filter-btn"]}`} style={{ width: '140px', text: 'center', fontWeight: '500' }} onClick={clearFilters}>
                                <span>Reset Filters <span style={{ color: 'red', fontWeight: 'bold', fontSize: 'small' }}>X</span></span>
                            </button>*/} 
                        {/* </div>  */}

 {/* <button  className={`${stylesOBj["filter-btn"]}`} onClick={toggleHRFilter}>
                        <img src="images/filter-ic.svg" alt="Filter Icon" class="filter-icon"/>
                        <span  className={`${stylesOBj["filter-text"]}`}> Add Filters</span>
                        <span class="filter-counter-wrapper">
                            <span class="filter-counter">0</span>
                            <svg class="filter-close-icon" title="Clear Filters" data-tooltip="Clear Filters" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 3L3 9M3 3L9 9" stroke="#FF0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </span>
                    </button> */}

                        <div className={`${stylesOBj["filter-group"]} ${stylesOBj['control-btns-group']}`}>
                            {(miscData?.loggedInUserTypeID === UserAccountRole.ADMINISTRATOR ||
                                miscData?.loggedInUserTypeID === UserAccountRole.SALES ||
                                miscData?.loggedInUserTypeID === UserAccountRole.SALES_MANAGER ||
                                miscData?.loggedInUserTypeID === UserAccountRole.BDR ||
                                miscData?.loggedInUserTypeID === UserAccountRole.MARKETING ||
                                miscData?.loggedInUserTypeID === UserAccountRole.OPS_TEAM_MANAGER ||
                                miscData?.loggedInUserTypeID === UserAccountRole.TALENTOPS
                            )} <button className={`${stylesOBj["btn-add-hr"]} ${stylesOBj["control-btns"]}`} onClick={() => {
                                localStorage.removeItem('hrID')
                                navigate(UTSRoutes.ADDNEWHR);
                            }}>ADD NEW HR</button>
                            <button className={`${stylesOBj["btn-export"]} ${stylesOBj['control-btns']}`} onClick={() => handleExport(apiData)}>Export</button>
                        </div>
                    </div>

                    {/* <!-- Data Table --> */}
                    <div className={`${stylesOBj["table-container"]}`}>

                        {isLoading ? <TableSkeleton /> :
                            <table className={`${stylesOBj["data-table"]}`}>
                                <thead>
                                    <tr>
                                        <th style={{ minWidth: '160px' }}>SHORTCUTS</th>
                                        <th>CREATED DATE</th>
                                        <th>HR ID</th>
                                        <th>COMPANY</th>
                                        <th>POSITION</th>
                                        <th>CATEGORY</th>
                                        <th>TR</th>
                                        {/* <th>HR TYPE</th> */}
                                        <th>ENGAGEMENT TYPE</th>
                                        <th>MARGIN %</th>
                                        <th>SALARY/CLIENT BUDGET</th>
                                        <th>HR STATUS</th>
                                        <th>FTE/PTE</th>
                                        <th>SALES REP</th>
                                        <th>POD</th>
                                        <th>OPEN SINCE</th>
                                        <th>REJECT REASON</th>
                                    </tr>
                                </thead>
                                {/* <TABLEBODYComponent apiData={apiData} /> */}

                                <tbody>
                                    {apiData?.length === 0 ? <tr>
                                        <td colSpan={12} style={{ textAlign: "center", padding: "20px" }}>
                                            No data available
                                        </td>
                                    </tr> :
                                        <>
                                            {apiData.map((data, index) => {
                                                return <tr key={data.key}>
                                                    {/* SHORTCUTS */}
                                                    <td style={{padding:'15px'}} >
                                                        <div className={`${stylesOBj["shortcuts-cell"]}`}>
                                                            <a href="javascript:void(0)" onClick={() => { setIsPreviewModal(true); setpreviewIDs({ hrID: data?.HRID, companyID: data?.companyID }); getPreviewPostData(data?.HRID, data.HR_ID, data?.companyID) }} className={`${stylesOBj["shortcut-icon-wrapper"]}`} data-tooltip="Preview HR">
                                                                <img src="images/preview-hr-ic.svg" alt="Preview HR" className={`${stylesOBj["shortcut-icon"]}`} />
                                                            </a>

                                                            {(data?.reopenHR === 0 && data?.isDisplayReopenOrCloseIcon === true) ?

                                                                <a href="javascript:void(0)" onClick={() => {
                                                                    setCloseHRDetail({ ...data, HR_Id: data?.HRID });
                                                                    setCloseHrModal(true);
                                                                }} className={`${stylesOBj["shortcut-icon-wrapper"]}`} data-tooltip="Close HR">
                                                                    <img src="images/close-hr-ic.svg" alt="Close HR" className={`${stylesOBj["shortcut-icon"]}`} />
                                                                </a> : data?.isDisplayReopenOrCloseIcon === true ? <a href="javascript:void(0)" onClick={() => {

                                                                    if (data?.companyModel === 'Pay Per Credit') {
                                                                        setReopenHRData({
                                                                            ...data,
                                                                            HR_Id: data?.HRID,
                                                                            ClientDetail: { NoOfTalents: data?.TR },
                                                                        });
                                                                        setRepostHrModal(true)
                                                                    } else {
                                                                        setReopenHRData({
                                                                            ...data,
                                                                            HR_Id: data?.HRID,
                                                                            ClientDetail: { NoOfTalents: data?.TR },
                                                                        });
                                                                        setReopenHrModal(true);
                                                                    }


                                                                }} className={`${stylesOBj["shortcut-icon-wrapper"]}`} data-tooltip={data?.companyModel === 'Pay Per Credit' ? "Re-post HR" : "Reopen HR"}>
                                                                    {/* <img src="images/close-hr-ic.svg" alt="open HR" className={`${stylesOBj["shortcut-icon"]}`} /> */}
                                                                    <ReopenHR
                                                                        style={{ fontSize: "16px", width: "20px" }}

                                                                    />
                                                                </a> : ''
                                                            }

                                                            <a href="javascript:void(0)" onClick={() => {
                                                                setCloneHR(true);
                                                                setHRID(data?.key);///////////
                                                                setHRNumber({ hrNumber: data?.HR_ID, isHybrid: data?.isHybrid, companyID: data?.companyID });

                                                            }} className={`${stylesOBj["shortcut-icon-wrapper"]}`} data-tooltip="Clone HR">
                                                                <img src="images/clone-hr-ic.svg" alt="Clone HR" className={`${stylesOBj["shortcut-icon"]}`} />
                                                            </a>
                                                            <a href="javascript:void(0)" onClick={() => {
                                                                setSplitHR(true);
                                                                setHRID(data?.key);
                                                                setHRNumber({ hrNumber: data?.HR_ID, isHybrid: data?.isHybrid, companyID: data?.companyID });
                                                                getPODList(data?.key)
                                                            }} className={`${stylesOBj["shortcut-icon-wrapper"]}`} data-tooltip="Split HR">
                                                                <img src="images/split-hr-ic.svg" alt="Split HR" className={`${stylesOBj["shortcut-icon"]}`} />
                                                            </a>
                                                        </div>

                                                    </td>
                                                    {/* CREATED DATE */}
                                                    <td>{data?.Date}</td>
                                                    {/* HR ID */}
                                                    <td>
                                                        <a href={`/allhiringrequest/${data?.key}`} target="_blank" className={`${stylesOBj["hr-id"]}`}>{data?.HR_ID}</a>
                                                        {data?.hrPostedFromPlatform && <p style={{
                                                            color: getColorCode(data?.appActionDoneBy)?.color,
                                                            background: getColorCode(data?.appActionDoneBy)?.background,
                                                            padding: '5px',
                                                            width: 'fit-content',
                                                            borderRadius: '6px',
                                                            marginTop: '2px'
                                                        }} >({data?.hrPostedFromPlatform})</p>}
                                                        {/* <span className={`${stylesOBj[]}`}"hr-id-status hr-status-open">via Workspace</span> */}
                                                    </td>
                                                    {/* COMPANY */}
                                                    <td style={{ width: '500px', whiteSpace: 'normal' }}>{data?.Company}</td>
                                                    {/* POSITION */}
                                                    <td style={{ width: '700px', whiteSpace: 'normal' }}>{data?.Position}</td>
                                                    {/* CATEGORY */}
                                                    <td>
                                                        <div className={`${stylesOBj["category-cell-wrapper"]}`} style={{ width: '100px' }}>
                                                            <div className={`${stylesOBj["category-left"]}`}>
                                                                <button className={`${stylesOBj["diamond-toggle"]}`} data-tooltip={data?.companyCategory === "Diamond" ? "Remove Diamond" : "Add Diamond"} onClick={() => {
                                                                    if (data?.companyCategory === "Diamond") {
                                                                        setShowDiamondRemark(true);
                                                                        setCompanyIdForRemark({ ...data, index: index });
                                                                    } else {
                                                                        setShowAddDiamondRemark(true);
                                                                        setCompanyIdForRemark({ ...data, index: index });

                                                                    }
                                                                }}>
                                                                    {data?.companyCategory === "Diamond" ? <img src="images/diamond-active-ic.svg" alt="Diamond Active" className={`${stylesOBj["diamond-icon"]} ${stylesOBj["diamond-active"]}`} /> : <img src="images/diamond-ic.svg" alt="Diamond" className={`${stylesOBj["diamond-icon"]} ${stylesOBj["diamond-inactive"]}`} />}
                                                                </button>
                                                            </div>
                                                            <div className={`${stylesOBj["category-divider"]}`}></div>
                                                            <MamoedCategoryRightComponent data={data} index={index} handleHRRequest={handleHRRequestWithoutAPI} tableFilteredState={tableFilteredState} />
                                                            {/* {CategoryRightComponent({data,index})} */}
                                                        </div>

                                                    </td>
                                                    {/* TR */}
                                                    <td>{data?.TR}</td>
                                                    {/* HR TYPE */}
                                                    {/* <td>{data?.hrTypeName}</td> */}
                                                    {/* ENGAGEMENT TYPE */}
                                                    <td>{data?.hrEngagementType}
                                                        {/* <span className={`${stylesOBj[]}`}"transparent-text">(Transparent)</span> */}</td>
                                                    {/* MARGIN % */}
                                                    <td>{data?.timeZone}</td>
                                                    {/* SALARY/CLIENT BUDGET */}
                                                    <td>{data?.salaryBudget}</td>
                                                    {/* HR STATUS */}
                                                    <td>
                                                        {All_Hiring_Request_Utils.GETHRSTATUS(
                                                            data?.hrStatusCode,
                                                            data?.hrStatus
                                                        )}
                                                        {/* <span className={`${stylesOBj[]}`}"hr-status-badge hr-status-open">Open</span> */}
                                                    </td>
                                                    {/* FTE/PTE */}
                                                    <td>{data?.typeOfEmployee}</td>
                                                    {/* SALES REP */}
                                                    <td>{data?.salesRep}</td>
                                                    {/* POD */}
                                                    <td>{data?.poDs}</td>
                                                    {/* OPEN SINCE */}
                                                    <td>{data?.hrAcceptedSince}</td>
                                                    {/* REJECT REASON */}
                                                    <td>{data?.pauseHRReason}</td>
                                                </tr>
                                            })}
                                        </>

                                    }



                                </tbody>
                            </table>}

                    </div>
                    {/* <!-- Pagination Footer - Outside table container --> */}
                    <div className={`${stylesOBj["table-pagination-footer"]}`}>
                        <div className={`${stylesOBj["pagination"]}`}>
                            <div className={`${stylesOBj["pagination-right"]}`}>
                                <div className={`${stylesOBj["per-page-container"]}`}>
                                    <span>Rows per page:</span>
                                    <div className={`${stylesOBj["select-wrapper"]}`}>
                                        <select className={`${stylesOBj["rows-select"]}`} value={pageSize} onChange={(e) => {

                                            setPageSize(Number(e.target.value));
                                            setPageIndex(1)
                                            if (pageSize !== parseInt(e.target.value)) {
                                                handleHRRequest({
                                                    ...tableFilteredState,
                                                    pagesize: parseInt(e.target.value),
                                                    pagenum: 1,
                                                });
                                            }
                                        }}>
                                            {pageSizeOptions.map((size) => (
                                                <option key={size} value={size}>{size}</option>
                                            ))}

                                        </select>
                                    </div>
                                </div>
                                <span className={`${stylesOBj["pagination-info"]}`}>{`${(pageIndex - 1) * pageSize + 1}-${Math.min(pageIndex * pageSize, totalRecords)}`}  of {totalRecords}</span>
                                <div className={`${stylesOBj["pagination-buttons"]}`}>

                                    <Pagination
                                        currentPage={pageIndex}
                                        totalRecords={totalRecords}
                                        pageSize={pageSize}
                                        onPageChange={(p) => {
                                            setPageIndex(p)
                                            handleHRRequest({
                                                ...tableFilteredState,
                                                pagesize: pageSize,
                                                pagenum: parseInt(p),
                                            });
                                        }}
                                    />

                                </div>
                            </div>
                        </div>
                    </div>
                </div>



            </main>
            {isAllowFilters && (
                <Suspense fallback={<div>Loading...</div>}>

                    <HiringFiltersLazyComponent
                        setAppliedFilters={setAppliedFilters}
                        appliedFilter={appliedFilter}
                        setCheckedState={setCheckedState}
                        setIsAllowFilters={setIsAllowFilters}
                        checkedState={checkedState}
                        handleHRRequest={handleHRRequest}
                        setPageIndex={setPageIndex}
                        setTableFilteredState={setTableFilteredState}
                        tableFilteredState={tableFilteredState}
                        setFilteredTagLength={setFilteredTagLength}
                        onRemoveHRFilters={onRemoveHRFilters}
                        getHTMLFilter={getHTMLFilter}
                        isShowDirectHRChecked={isShowDirectHRChecked}
                        setIsShowDirectHRChecked={setIsShowDirectHRChecked}
                        hrFilterList={allHRConfig.hrFilterListConfig()}
                        filtersType={allHRConfig.hrFilterTypeConfig(
                            filtersList && filtersList, rejectionReasons
                        )}
                        clearFilters={clearFilters}
                    />
                </Suspense>
            )}

            <PreviewHRModal
                setChangeStatus={() => { }}
                setViewPosition={setIsPreviewModal}
                ViewPosition={isPreviewModal}
                setJobPreview={setJobPreview}
                allData={allData}
                jobPreview={jobPreview}
                hrIdforPreview={hrIdforPreview}
                hrNumber={hrNumber}
                ispreviewLoading={ispreviewLoading}
                previewIDs={previewIDs}
            />

            {closeHrModal && (
                <Modal
                    width={"864px"}
                    centered
                    footer={false}
                    open={closeHrModal}
                    className="updateTRModal"
                    onCancel={() => setCloseHrModal(false)}
                >
                    <CloseHRModal
                        closeHR={() => { }}
                        setUpdateTR={() => setCloseHrModal(true)}
                        onCancel={() => setCloseHrModal(false)}
                        closeHRDetail={closeHRDetail}
                    />
                </Modal>
            )}

            {reopenHrModal && (
                <Modal
                    width={"864px"}
                    centered
                    footer={false}
                    open={reopenHrModal}
                    className="updateTRModal"
                    onCancel={() => setReopenHrModal(false)}
                >
                    <ReopenHRModal
                        onCancel={() => setReopenHrModal(false)}
                        apiData={reopenHrData}
                    />
                </Modal>
            )}

            {repostHrModal && (
                <Modal
                    width={"864px"}
                    centered
                    footer={false}
                    open={repostHrModal}
                    className="updateTRModal"
                    onCancel={() => setRepostHrModal(false)}
                >
                    <RePostHRModal
                        onCancel={() => setRepostHrModal(false)}
                        apiData={reopenHrData}
                        handleReopen={() => handleReopen()}
                    />
                </Modal>
            )}

            <Modal
                width={"700px"}
                centered
                footer={false}
                open={openCloneHR}
                className="cloneHRConfWrap"
                onCancel={() => setCloneHR(false)}
            >

                <CloneHR
                    cloneHRhandler={cloneHRhandler}
                    onCancel={() => setCloneHR(false)}
                    getHRnumber={getHRnumber.hrNumber}
                    isHRHybrid={getHRnumber.isHybrid}
                    companyID={getHRnumber.companyID}
                />
            </Modal>

            <Modal
                width={"700px"}
                centered
                footer={false}
                open={openSplitHR}
                className="cloneHRConfWrap"
                onCancel={() => setSplitHR(false)}
            >
                <SplitHR
                    onCancel={() => { setSplitHR(false); setHRID('') }}
                    getHRID={getHRID}
                    getHRnumber={getHRnumber.hrNumber}
                    isHRHybrid={getHRnumber.isHybrid}
                    companyID={getHRnumber.companyID}
                    impHooks={{ groupList, setGroupList, isSplitLoading, setIsSplitLoading }}
                />
            </Modal>

            {showAddDiamondRemark && (
                <Modal
                    transitionName=""
                    width="800px"
                    centered
                    footer={null}
                    open={showAddDiamondRemark}
                    className="engagementModalStyle"
                    onCancel={() => {
                        setShowAddDiamondRemark(false);
                        resetField("diamondCategoryAddRemark");
                        clearErrors("diamondCategoryAddRemark");

                    }}
                >
                    <div style={{ padding: "35px 15px 10px 15px" }}>
                        <h3>Mark Diamond</h3>
                    </div>

                    <div style={{ padding: "10px 20px" }}>
                        {remDiamondLoading ? (
                            <Skeleton active />
                        ) : (
                            <Radio.Group
                                onChange={(e) => {
                                    setAddDiamondReason(e.target.value);
                                }}
                                value={addDiamondReason}
                                style={{ flexDirection: 'column' }}
                            >
                                <Radio value={"As Per Formula"}>As Per Formula</Radio>
                                <Radio value={"Other"}>Other</Radio>
                            </Radio.Group>
                        )}
                    </div>

                    {
                        addDiamondReason === 'Other' && <div style={{ padding: "10px 20px" }}>
                            {remDiamondLoading ? (
                                <Skeleton active />
                            ) : (
                                <HRInputField
                                    isTextArea={true}
                                    register={register}
                                    errors={errors}
                                    label="Other Remark"
                                    name="diamondCategoryAddRemark"
                                    type={InputType.TEXT}
                                    placeholder="Enter Remark"
                                    validationSchema={{
                                        required: addDiamondReason === 'Other' ? "please enter remark" : false,
                                    }}
                                    required={addDiamondReason === 'Other' ? true : false}
                                />
                            )}
                        </div>
                    }


                    <div style={{ padding: "10px 20px" }}>
                        <button
                            className={stylesOBj.btnPrimary}
                            onClick={handleSubmit(handleAddDiamond)}
                            disabled={remDiamondLoading}
                        >
                            Save
                        </button>
                        <button
                            className={stylesOBj.btnCancle}
                            disabled={remDiamondLoading}
                            onClick={() => {
                                setShowAddDiamondRemark(false);
                                resetField("diamondCategoryAddRemark");
                                clearErrors("diamondCategoryAddRemark");
                            }}
                        >
                            Close
                        </button>
                    </div>
                </Modal>)}

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

        </div>
    )
}
