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
import { Modal, message, Radio, Skeleton, Spin, Select } from "antd";
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
import { ReactComponent as EditSVG } from "assets/svg/EditField.svg";
import { ReactComponent as TickMark } from "assets/svg/assignCurrect.svg";
import { ReactComponent as Close } from "assets/svg/close.svg";

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

export default function Unassigned_hiring_request() {
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

    const miscData = UserSessionManagementController.getUserMiscellaneousData();

    const [getHRID, setHRID] = useState("");

    const [showCloneHRToDemoAccount, setShowCloneHRToDemoAccount] = useState(false);


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



    const handleHRRequest = useCallback(
        async (pageData) => {
            setLoading(true);
            // save filter value in localstorage
            if (pageData.filterFields_ViewAllUnAssignedHRs) {
                localStorage.setItem(
                    "filterFields_ViewAllUnAssignedHRs",
                    JSON.stringify(pageData.filterFields_ViewAllUnAssignedHRs)
                );
            } else {
                localStorage.removeItem('filterFields_ViewAllUnAssignedHRs');
            }

            let response = await hiringRequestDAO.getAllUnassignedHiringRequestDAO({
                ...pageData,
                // isFrontEndHR: isFrontEndHR,
                // StarNextWeek: isOnlyPriority,
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
        [navigate, isFrontEndHR, isOnlyPriority]
    );



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




    const ControlledTitleComp = ({ text, values, handleHRRequest }) => {
        const [isEdit, setIsEdit] = useState(false)
        const [role, setRole] = useState(text)
        const [allPocs, setAllPocs] = useState([]);
        const [assignedPOCID, setAssignedPOCID] = useState([])

        const getAllSalesPerson = async () => {
            const allSalesResponse = await MasterDAO.getSalesManRequestDAO();
            const data = allSalesResponse?.responseBody?.details?.map((item) => ({
                id: item?.id,
                value: item?.value
            }))
            // _getPOCdata.push(data)
            setAllPocs(data);
        }

        const saveEditRole = useCallback(async () => {
            // if(role){
            // let e = encodeURIComponent(role)
            setLoading(true);
            const data = {
                POCID: assignedPOCID, HRID: values?.HRID
            }

            const result = await hiringRequestDAO.assignedPOCForUnassignHRSDAO(data);
            if (result?.statusCode === HTTPStatusCode.OK) {
                message.success(`AM ( ${allPocs.find(item => item.id === assignedPOCID).value} ) is assigned to ${values?.HR_ID} successfully.`)
                setIsEdit(false);
                setLoading(false);
                handleHRRequest(tableFilteredState);
            }
            else {
                message.error("POC not Assigned Successfully.")
                setLoading(false);
                setIsEdit(false)
            }
            // }	
        }, [assignedPOCID, getHRID, allPocs])

        if (isEdit) {
            return <div className="tblEditBox" style={{ display: 'flex', alignItems: 'center' }}>
                <TickMark
                    width={'16px'}
                    height={'20px'}
                    style={{ marginRight: '10px', cursor: 'pointer' }}
                    onClick={() => { saveEditRole(); }}
                />

                <Select size="small" mode="id" style={{ width: '150px' }} onChange={(e, _) => setAssignedPOCID(_.id)} showSearch options={allPocs} />
                {/* {allPocs?.map((item)=>(
            <Select.Option value={item?.id}>{item?.value}</Select.Option>
          ))} */}
                {/* </Select> */}

                <Close
                    width={'20px'}
                    height={'20px'}
                    style={{ marginLeft: '10px', cursor: 'pointer' }}
                    onClick={() => { setIsEdit(false); setRole(text) }} />
            </div>
        } else {
            return <div className="tblEditBox">
                <EditSVG
                    width={'20px'}
                    height={'20px'}
                    style={{ marginRight: '10px', cursor: 'pointer' }}
                    onClick={() => { setIsEdit(true); getAllSalesPerson() }}
                />
                {role}
            </div>
        }
    }


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



                        {(filteredTagLength > 0 || startDate || debouncedSearch) && <div className={`${stylesOBj["filter-group"]} ${stylesOBj['control-btns-group']}`}>
                            {(miscData?.loggedInUserTypeID === UserAccountRole.ADMINISTRATOR ||
                                miscData?.loggedInUserTypeID === UserAccountRole.SALES ||
                                miscData?.loggedInUserTypeID === UserAccountRole.SALES_MANAGER ||
                                miscData?.loggedInUserTypeID === UserAccountRole.BDR ||
                                miscData?.loggedInUserTypeID === UserAccountRole.MARKETING ||
                                miscData?.loggedInUserTypeID === UserAccountRole.OPS_TEAM_MANAGER ||
                                miscData?.loggedInUserTypeID === UserAccountRole.TALENTOPS
                            )} <button className={`${stylesOBj["btn-add-hr"]} ${stylesOBj["control-btns"]}`} onClick={() => {
                                clearFilters()
                            }}>Reset Filters</button>

                        </div>}
                    </div>

                    {/* <!-- Data Table --> */}
                    <div className={`${stylesOBj["table-container"]}`}>

                        {isLoading ? <TableSkeleton /> :
                            <table className={`${stylesOBj["data-table"]}`}>
                                <thead>
                                    <tr>
                                        <th style={{ minWidth: '200px' }}>Assigned POC</th>
                                        <th>CREATED DATE</th>
                                        <th>HR ID</th>
                                        <th>HR Published Since</th>
                                        <th style={{ maxWidth: '100px' }}>TR</th>
                                        <th>POSITION</th>
                                        <th>Company</th>
                                        <th>HR Type</th>
                                        <th>Engagement Type</th>
                                        <th>SALARY/CLIENT BUDGET</th>

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
                                                    {/* Assigned POC */}
                                                    <td style={{ padding: '15px' }} >
                                                        <div className={`${stylesOBj["shortcuts-cell"]}`}>
                                                            <ControlledTitleComp text={data.assignedPOC} values={data} handleHRRequest={handleHRRequest} />
                                                        </div>

                                                    </td>
                                                    {/* CREATED DATE */}
                                                    <td>{data?.Date}</td>
                                                    {/* HR ID */}
                                                    <td>
                                                      {data?.HR_ID}


                                                    </td>
                                                    {/* HR Published Since */}
                                                    <td >{data?.hrAcceptedSince}</td>
                                                    {/* TR */}
                                                    <td style={{ width: '100px', maxWidth: '100px' }}>{data?.TR}</td>
                                                    {/* Position */}
                                                    <td>
                                                        {data?.Position}

                                                    </td>
                                                    {/* Company */}
                                                    <td>{data?.Company}</td>
                                                    {/* HR TYPE */}
                                                    <td>{data?.hrTypeName}</td>
                                                    {/* ENGAGEMENT TYPE */}
                                                    <td>{data?.hrEngagementType}
                                                        {/* <span className={`${stylesOBj[]}`}"transparent-text">(Transparent)</span> */}</td>

                                                    {/* SALARY/CLIENT BUDGET */}
                                                    <td>{data?.salaryBudget}</td>

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
        </div>
    )
}
