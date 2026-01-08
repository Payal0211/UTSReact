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
import { All_Hiring_Request_Utils } from "shared/utils/all_hiring_request_util";
import { useNavigate } from "react-router-dom";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import { downloadToExcel } from "modules/report/reportUtils";

let defaaultFilterState = {
    pagesize: 20,
    pagenum: 1,
    sortdatafield: "CreatedDateTime",
    sortorder: "desc",
    searchText: "",
    IsDirectHR: false,
    hrTypeIds: ''
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
    const [userData, setUserData] = useState({});
    const [isFrontEndHR, setIsFrontEndHR] = useState(false);
    const [isOnlyPriority, setIsOnlyPriority] = useState(false);
    const [isOnlyDiamond, setIsOnlyDiamond] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [showCloneHRToDemoAccount, setShowCloneHRToDemoAccount] = useState(false);
    console.log('n_all_hiring_request loaded');

    useEffect(() => {
        const getUserResult = async () => {
            let userData = UserSessionManagementController.getUserSession();
            if (userData) setUserData(userData);
        };
        getUserResult();
    }, []);

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

    const handleRequetWithDates = useCallback(() => {
        if (startDate && endDate) {
            handleHRRequest({
                ...tableFilteredState,
                filterFields_ViewAllHRs: {
                    ...tableFilteredState.filterFields_ViewAllHRs,
                    fromDate: new Date(startDate).toLocaleDateString("en-US"),
                    toDate: new Date(endDate).toLocaleDateString("en-US"),
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
    }, [tableFilteredState, endDate, startDate, isFrontEndHR, isOnlyPriority, isOnlyDiamond]);

    useEffect(() => {
        // handleHRRequest(tableFilteredState);
        handleRequetWithDates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableFilteredState, isFrontEndHR, isOnlyPriority, isOnlyDiamond]);


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
    };

    const TABLEBODYComponent = () => {
        return <tbody>
            {apiData.map((data, index) => {
                return <tr key={index + data?.HR_ID}>
                    {/* SHORTCUTS */}
                    <td  >
                        <div className={`${stylesOBj["shortcuts-cell"]}`}>
 <a href="#" className={`${stylesOBj["shortcut-icon-wrapper"]}`} data-tooltip="Preview HR">
                            <img src="images/preview-hr-ic.svg" alt="Preview HR" className={`${stylesOBj["shortcut-icon"]}`} />
                        </a>
                        <a href="#" className={`${stylesOBj["shortcut-icon-wrapper"]}`} data-tooltip="Close HR">
                            <img src="images/close-hr-ic.svg" alt="Close HR" className={`${stylesOBj["shortcut-icon"]}`} />
                        </a>
                        <a href="#" className={`${stylesOBj["shortcut-icon-wrapper"]}`} data-tooltip="Clone HR">
                            <img src="images/clone-hr-ic.svg" alt="Clone HR" className={`${stylesOBj["shortcut-icon"]}`} />
                        </a>
                        <a href="#" className={`${stylesOBj["shortcut-icon-wrapper"]}`} data-tooltip="Split HR">
                            <img src="images/split-hr-ic.svg" alt="Split HR" className={`${stylesOBj["shortcut-icon"]}`} />
                        </a>
                        </div>
                       
                    </td>
                    {/* CREATED DATE */}
                    <td>{data?.Date}</td>
                    {/* HR ID */}
                    <td>
                        <a href={`/allhiringrequest/${data?.key}`} className={`${stylesOBj["hr-id"]}`}>{data?.HR_ID}</a>
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
                                <button className={`${stylesOBj["diamond-toggle"]}`} data-tooltip={data?.companyCategory === "Diamond" ? "Remove Diamond" : "Add Diamond"}>
                                    {data?.companyCategory === "Diamond" ? <img src="images/diamond-active-ic.svg" alt="Diamond Active" className={`${stylesOBj["diamond-icon"]} ${stylesOBj["diamond-active"]}`} /> : <img src="images/diamond-ic.svg" alt="Diamond" className={`${stylesOBj["diamond-icon"]} ${stylesOBj["diamond-inactive"]}`} />}

                                </button>
                            </div>
                            <div className={`${stylesOBj["category-divider"]}`}></div>
                            <div className={`${stylesOBj["category-right"]}`}>
                                {data?.hR_Category === '' ? <div className={`${stylesOBj["archetype-select-wrapper"]}`} >
                                    <button type="button" className={`${stylesOBj["archetype-btn"]}`}>Archetype</button>
                                    <div className={`${stylesOBj["archetype-dropdown"]}`}>
                                        <button type="button" className={`${stylesOBj["archetype-option"]}`} data-value="kitten">
                                            <img src="images/kitten-ic.svg" alt="Kitten" /> Kitten
                                        </button>
                                        <button type="button" className={`${stylesOBj["archetype-option"]}`} data-value="cheetah">
                                            <img src="images/cheetah-ic.svg" alt="Cheetah" /> Cheetah
                                        </button>
                                        <button type="button" className={`${stylesOBj["archetype-option"]}`} data-value="panda">
                                            <img src="images/panda-ic.svg" alt="Panda" /> Panda
                                        </button>
                                    </div>
                                </div> : <div className={`${stylesOBj["archetype-image-wrapper"]}`}>
                                    <div className={`${stylesOBj["archetype-image-container"]}`}>
                                        {data?.hR_Category === 'Cheetah' && <img src="images/cheetah-ic.svg" alt="Cheetah" className={`${stylesOBj["archetype-image"]}`} />}
                                        {data?.hR_Category === 'Panda' && <img src="images/panda-ic.svg" alt="Panda" className={`${stylesOBj["archetype-image"]}`} />}
                                        {data?.hR_Category === 'Kitten' && <img src="images/kitten-ic.svg" alt="Kitten" className={`${stylesOBj["archetype-image"]}`} />}
                                    </div>
                                    <button type="button" className={`${stylesOBj["archetype-close"]}`}>×</button>
                                </div>}

                            </div>
                        </div>

                    </td>
                    {/* TR */}
                    <td>{data?.TR}</td>
                    {/* HR TYPE */}
                    <td>{data?.hrTypeName}</td>
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


        </tbody>
    }

    useEffect(()=> {
  setTableFilteredState(prev =>({
          ...prev,
          pagenum: 1,
          searchText: search,
        }));
    }, [search])

    useEffect(()=> {
         if (debouncedSearch.length > 1 || debouncedSearch === "") {
      setTimeout(() => {
      

        setSearch(debouncedSearch);
      }, 2000);
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
    return (
        <div className={`${stylesOBj["dashboard-container"]}`}>


            {/* <!-- Main Content Area --> */}
            <main className={`${stylesOBj["main-content"]}`}>


                {/* <!-- Content Section --> */}
                <div className={`${stylesOBj["content-wrapper"]}`}>
                    {/* <!-- Filter Controls --> */}
                    <div className={`${stylesOBj["filter-controls"]}`}>
                        <div className={`${stylesOBj["filter-group"]}`}>
                            <input type="text" className={`${stylesOBj["filter-input"]} ${stylesOBj['date-input']}`} placeholder="Select Date Range" />
                            <img src="images/calendar-ic.svg" alt="Calendar Icon" className={`${stylesOBj["input-icon"]}`} />
                        </div>
                        <div className={`${stylesOBj["filter-group"]} ${stylesOBj['search-group']}`}>
                            <input type="text" className={`${stylesOBj["filter-input"]} ${stylesOBj['search-input']}`} placeholder="Search via HR#, role, company" 
                             onChange={debouncedSearchHandler}
                            value={debouncedSearch}
                            />
                            <img src="images/search-ic.svg" alt="Search Icon" className={`${stylesOBj["input-icon"]}`} />
                        </div>
                        <button className={`${stylesOBj["filter-btn"]}`}>
                            <span>Add Filters</span>
                            <img src="images/filter-ic.svg" alt="Filter Icon" />
                        </button>
                        <div className={`${stylesOBj["filter-group"]} ${stylesOBj['control-btns-group']}`}>
                            <button className={`${stylesOBj["btn-add-hr"]} ${stylesOBj["control-btns"]}`}>ADD NEW HR</button>
                            <button className={`${stylesOBj["btn-export"]} ${stylesOBj['control-btns']}`} onClick={() => handleExport(apiData)}>Export</button>
                        </div>
                    </div>

                    {/* <!-- Data Table --> */}
                    <div className={`${stylesOBj["table-container"]}`}>

                        {isLoading ? <TableSkeleton /> :
                            <table className={`${stylesOBj["data-table"]}`}>
                                <thead>
                                    <tr>
                                        <th>SHORTCUTS</th>
                                        <th>CREATED DATE</th>
                                        <th>HR ID</th>
                                        <th>COMPANY</th>
                                        <th>POSITION</th>
                                        <th>CATEGORY</th>
                                        <th>TR</th>
                                        <th>HR TYPE</th>
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
                                <TABLEBODYComponent />
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
                                            console.log('e.target.value', e.target.value);
                                            setPageSize(Number(e.target.value));
                                        }}>
                                            {pageSizeOptions.map((size) => (
                                                <option key={size} value={size}>{size}</option>
                                            ))}

                                        </select>
                                    </div>
                                </div>
                                <span className={`${stylesOBj["pagination-info"]}`}>1-10 of {totalRecords}</span>
                                <div className={`${stylesOBj["pagination-buttons"]}`}>
                                    <button className={`${stylesOBj["pagination-btn"]}`} disabled>
                                        <img src="images/arrow-left-ic.svg" alt="Previous" title="Previous Page" />
                                    </button>
                                    <button className={`${stylesOBj["pagination-btn"]}`}>
                                        <img src="images/arrow-right-ic.svg" alt="Next" title="Next Page" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    )
}
