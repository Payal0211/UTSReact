import React, { useEffect, useState, useRef, useMemo } from 'react'
import stylesOBj from './companyReport.module.css'
import { useNavigate } from 'react-router-dom';
import { HTTPStatusCode } from "constants/network";
import gridStyles from './scrumGrid.module.css'
import { Tabs, Select, Table, Modal, Tooltip, Skeleton, message, Dropdown, Menu, Spin, Radio } from "antd";
import { scrumGridTheme } from 'modules/ScrumS2/gridTheme'
import MultiConditionTextFilter from 'modules/ScrumS2/MultiConditionTextFilter';
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton'
import { TaDashboardDAO } from "core/taDashboard/taDashboardDRO";
import { ReportDAO } from "core/report/reportDAO";
import UTSRoutes from 'constants/routes';
import { All_Hiring_Request_Utils } from 'shared/utils/all_hiring_request_util';
import { AgGridReact } from 'ag-grid-react'
import { downloadToExcel } from "modules/report/reportUtils";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import DatePicker from "react-datepicker";
import moment from 'moment'

function CompanyReport() {
    const navigate = useNavigate()
    const [isLoading, setLoading] = useState(false)
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState('');

    let presistHeaddata = localStorage.getItem('companyReportSelectedHead')
    let presisTabdata = localStorage.getItem('companyReportSelectedTab')
    const [hrModal, setHRModal] = useState(presisTabdata ? presisTabdata : "Contract");
    const [selectedHead, setSelectedHead] = useState(presistHeaddata ? +presistHeaddata : '');
    const [pODList, setPODList] = useState([]);
    const today = new Date();


    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);

    const [monthDate, setMonthDate] = useState(today);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();

    const [companyList, setCompanyList] = useState([])
    const gridWrapperRef = useRef(null);
    const [availableHeight, setAvailableHeight] = useState(600);
    const GRID_MIN_HEIGHT = 320;
    const GRID_BOTTOM_PADDING = 24;

    const getHeads = async () => {
        let filterResult = await ReportDAO.getAllPODGroupDAO();

        if (filterResult.statusCode === HTTPStatusCode.OK) {
            setPODList(filterResult && filterResult?.responseBody);
            setSelectedHead(prev => {
                if (prev === '') {
                    let val = filterResult?.responseBody.find(
                        (i) => i.dd_text === "Orion"
                    )?.dd_value;

                    return val
                } else {

                    return prev
                }

            });

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

    useEffect(() => {
        getHeads();
    }, []);

const handleFilterChanged = (params) => {
    const api = params.api;

    // Which companies still have visible (non-total) rows?
    const next = new Set();
    api.forEachNodeAfterFilter((node) => {
        if (node.data && !node.data.isTotalRow) next.add(node.data.groupKey);
    });

    const prev = visibleGroupsRef.current;
    const changed = next.size !== prev.size || [...next].some((k) => !prev.has(k));

    if (changed) {
        visibleGroupsRef.current = next;
        api.onFilterChanged();   // re-run so the total rows are re-evaluated (runs once, then stabilises)
        return;
    }

   api.refreshCells({
    columns: [
        'companyName',
        'joinedRevenueStr',
        'profilesShared',
        'r1InterviewCompleted',
        'r2InterviewCompleted',
    ],
    force: true,
});
};
   const getListData = async () => {
    setLoading(true)

    let query = `?pod_id=${selectedHead}&monthstr=${(endDate && startDate) ? "" : +moment(monthDate).format("M")}&yearstr=${(endDate && startDate) ? "" : +moment(monthDate).format("YYYY")}&search=${search}&fromDate=${startDate ? startDate.toLocaleDateString("en-US") : ''}&toDate=${endDate ? endDate.toLocaleDateString("en-US") : ''}`

    let req = await TaDashboardDAO.getCompanyReportRequestDAO(query);
    setLoading(false)

    if (req.statusCode === HTTPStatusCode.OK) {
        const rows = groupByRowSpan(req.responseBody, 'companyName');

        // 👇 new: remember which companies have rows, so total/gap rows show on first render
        visibleGroupsRef.current = new Set(
            rows.filter(r => !r.isTotalRow).map(r => r.groupKey)
        );

        setCompanyList(rows);

    } else if (req.statusCode === HTTPStatusCode.NOT_FOUND) {
        visibleGroupsRef.current = new Set();   // 👈 reset
        setCompanyList([]);

    } else if (req?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
        return navigate(UTSRoutes.LOGINROUTE);

    } else if (req?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
        return navigate(UTSRoutes.SOMETHINGWENTWRONG);

    } else {
        visibleGroupsRef.current = new Set();   // 👈 reset
        setCompanyList([]);
        return "NO DATA FOUND";
    }
}


    useEffect(() => {
        if (selectedHead) {
            getListData()
        }
    }, [search, selectedHead, , monthDate, startDate, endDate])

    const scrumDefaultColDef = {
        resizable: true,
        sortable: false,
        filter: false,
        suppressMovable: false, // lets users drag-reorder columns, like Excel column drag
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'ag-cell-excel-border',
        headerClass: `${gridStyles["ag-header-center"]}`,
    };

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
                     groupKey: key,  
                    rowSpan: index === 0 ? rows.length : 0,
                    isTotalRow: false,
                });
            });

            // Calculate TA wise totals


            const totalJoinedRevenue = rows.reduce(
                (sum, row) => sum + (parseFloat(row.joinedRevenue) || 0),
                0
            );

            const getformatedTotal = (totalJoinedRevenue) => {
                if (hrModal === 'DP') {
                    return totalJoinedRevenue?.toLocaleString('en-IN', {
                        style: 'currency', currency: 'INR', minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })
                } else {

                } return totalJoinedRevenue?.toLocaleString('en-US', {
                    style: 'currency', currency: 'USD', minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })
            }

            // Add TA Total Row
            finalData.push({
                [groupField]: ``,
                id: `total-${key}`,
                 groupKey: key,
                // talent_AnnualCTC_Budget_INRValueStr: totalTalentPayRate,
                joinedRevenueStr: +totalJoinedRevenue ? getformatedTotal(totalJoinedRevenue) : '',
                isTotalRow: true,
                rowSpan: 1,
            });
        });

        return finalData;
    }

    const autoGroupColumnDef = {
        headerName: "companyName",
        minWidth: 140,
        cellRendererParams: {
            suppressCount: false,
        },
    };

    const [gridApi, setGridApi] = useState(null);

    const statusFilterInitialized = useRef(false);

    const availableStatuses = useMemo(() => {
        return [
            ...new Set(
                companyList
                    ?.filter(item => !item.isTotalRow)
                    ?.map(item => item.hrStatus)
                    ?.filter(Boolean)
            )
        ];
    }, [companyList]);
    // { companyName: [status, status, ...] }
const groupStatuses = useMemo(() => {
    const map = {};
    companyList.forEach((item) => {
        if (item.isTotalRow || !item.hrStatus) return;
        if (!map[item.groupKey]) map[item.groupKey] = new Set();
        map[item.groupKey].add(item.hrStatus);
    });
    return map;
}, [companyList]);

const gridApiRef = useRef(null);
const visibleGroupsRef = useRef(new Set());  

const doesExternalFilterPassold = (node) => {
    const d = node.data;
    if (!d?.isTotalRow) return true;                     // normal rows: column filter decides

    const selected = gridApiRef.current?.getFilterModel()?.hrStatus?.values;
    if (!selected || selected.length === 0) return true; // no status filter: show all gaps/totals

    const statuses = groupStatuses[d.groupKey];
    return !!statuses && selected.some((s) => statuses.has(s));
};

const doesExternalFilterPass = (node) => {
    const d = node.data;
    if (!d?.isTotalRow) return true;
    return visibleGroupsRef.current.has(d.groupKey);
};

    const defaultSelectedStatuses = useMemo(() => {
        return availableStatuses.filter(
            status => !['Closed - Lost', 'Closed - Cancelled'].includes(status)
        );
    }, [availableStatuses]);

    useEffect(() => {

        if (
            !gridApi ||
            !companyList?.length ||
            !availableStatuses.length ||
            statusFilterInitialized.current
        ) {
            return;
        }

        const existingModel = gridApi.getFilterModel() || {};

        // Don't override an existing filter model
        if (existingModel.hrStatus) {
            statusFilterInitialized.current = true;
            return;
        }

        if (defaultSelectedStatuses.length > 0) {

            gridApi.setFilterModel({
                ...existingModel,

                hrStatus: {
                    values: defaultSelectedStatuses
                }
            });
        }

        statusFilterInitialized.current = true;

    }, [
        gridApi,
        companyList,
        availableStatuses,
        defaultSelectedStatuses
    ]);

    const handleFirstDataRendered = (params) => {
        const api = params.api;

        const existingFilterModel = api.getFilterModel() || {};

        // Don't override an existing Status filter
        if (existingFilterModel.hrStatus) {
            return;
        }

        // Apply default selection, excluding the two statuses
        if (defaultSelectedStatuses.length > 0) {
            api.setFilterModel({
                ...existingFilterModel,
                hrStatus: {
                    values: defaultSelectedStatuses
                }
            });
        }
    };


    const gridColumns = () => {
        return [
      {
    headerName: 'Company',
    field: 'companyName',
    width: 140,
    pinned: 'left',
    sortable: false,
    suppressMovable: true,
  cellRenderer: (props) => {
    const { data, api, node } = props;

    if (!data || data.isTotalRow || node.rowPinned === 'bottom') return <div />;

    let i = node.rowIndex - 1;
    while (i >= 0) {
        const prev = api.getDisplayedRowAtIndex(i);
        if (prev?.data && !prev.data.isTotalRow) {
            if (prev.data.companyName === data.companyName) {
                return <div />;
            }
            break;
        }
        i--;
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', height: '100%' }}>
            <Tooltip title={data.companyName}>
                <span
                    className={stylesOBj["company-name"]}
                    style={{
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontWeight: 500,
                        fontSize: '10px',
                        lineHeight: '10px',
                        width: '70%',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                    }}
                    onClick={() => window.open(`/viewCompanyDetails/${data.companyID}`, "_blank")}
                >
                    {data.companyName}
                </span>
            </Tooltip>
        </div>
    );
},
},
            {
                headerName: 'HR ID',
                field: 'hR_Number',
                width: 150,
                suppressMovable: true,
                pinned: 'left',
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
                                fontSize: '10px'
                            }}
                            onClick={() => {
                                window.open(UTSRoutes.ALLHIRINGREQUESTROUTE + `/${data.hR_ID}`, "_blank");
                            }}
                        >
                            {data.hR_Number}
                        </span>


                    );
                },
            },
            {
                headerName: 'Role',
                field: 'hR_Title',
                width: 220,
                suppressMovable: true,
                pinned: 'left',
                autoHeight: true,
                cellRenderer: (props) => {
                    const { data } = props;
                    return (
                        <div
                            // className={taStylesNew["hr-title-cell"]}
                            style={{
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            {/* <Tooltip title={data.tA_HR_Status}>
                         <span className={taStylesNew["hr-status-box"]}  style={{ background: data?.hrColorCode, marginRight:'5px' }}> */}

                            {/* <span className={taStylesNew["hr-status-tooltip"]}>{data.tA_HR_Status}</span> */}
                            {/* </span>
                       </Tooltip> */}

                            <Tooltip title={data.hR_Title}><span style={{
                                display: 'block',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                fontSize: '10px',
                                fontWeight: 400,
                                // lineHeight: "10px"
                            }}>{data.hR_Title}</span></Tooltip>


                        </div>
                    );
                },
            },

            {
                headerName: 'POC',
                field: 'pocName',
                width: 140,
                sortable: false,
                suppressMovable: true,
            },
            {
                headerName: 'TA',
                field: 'taName',
                width: 140,
                sortable: false,
                suppressMovable: true,
            },
            // {
            //     headerName: 'Status',
            //     field: 'hrStatus',
            //     width: 140,
            //     sortable: false,
            //     suppressMovable: true,
            //     filter: MultiConditionTextFilter,
            //     filterParams: { type: 'status', list: Array.from(new Set(companyList.filter(i => !i.isTotalRow)?.map(i => i.hrStatus)))?.map(v => ({ data: v }))},
            //     cellRenderer: (props) => {
            //         const { data } = props;
            //         return <div style={{ display: 'flex', justifyContent: 'center', alignItems: "center", height: '100%' }}>{All_Hiring_Request_Utils.GETHRSTATUS(data?.hrStatusCode, data?.hrStatus)}</div>;

            //     }
            // },
            {
                headerName: 'Status',
                field: 'hrStatus',
                width: 140,
                sortable: false,
                suppressMovable: true,
                filter: MultiConditionTextFilter,
                filterParams: {
                    type: 'status',
                    list: availableStatuses.map(status => ({
                        data: status
                    }))
                },
                cellRenderer: (props) => {
                    const { data } = props;
                    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: "center", height: '100%' }}>{All_Hiring_Request_Utils.GETHRSTATUS(data?.hrStatusCode, data?.hrStatus)}</div>;

                }
            },
            {
                headerName: 'TRs',
                field: 'totalTR',
                width: 80,
                sortable: false,
                suppressMovable: true,
                cellRenderer: (props) => {
                    const { data, ind, value } = props;

                    return (
                        <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                            {value ? value : ""}
                        </div>
                    );
                },
            },
            {
                headerName: 'HR Created Date',
                field: 'hrCreatedDate',
                width: 100,
                sortable: false,
                suppressMovable: true,
                cellRenderer: (props) => {
                    const { data, ind, value } = props;

                    return (
                        <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                            {value ? value : ""}
                        </div>
                    );
                },
            },
            {
                headerName: 'Open Since',
                field: 'openSince',
                width: 100,
                sortable: false,
                suppressMovable: true,
                cellRenderer: (props) => {
                    const { data, ind, value } = props;

                    return (
                        <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                            {value ? value : ""}
                        </div>
                    );
                },
            },
         sumCol('# profile Shared', 'profilesShared', 80), 
            {
                headerName: 'Assessment Reject',
                field: 'assessmentReject',
                width: 100,
                sortable: false,
                suppressMovable: true,
                cellRenderer: (props) => {
                    const { data, ind, value } = props;

                    return (
                        <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                            {value ? value : ""}
                        </div>
                    );
                },
            },
           sumCol('R1 Interview Completed', 'r1InterviewCompleted'),
            {
                headerName: 'Profile to R1 Ratio',
                field: 'profileToR1Ratio',
                width: 100,
                sortable: false,
                suppressMovable: true,
                cellRenderer: (props) => {
                    const { data, ind, value } = props;

                    return (
                        <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                            {value ? `${value} %` : ""}
                        </div>
                    );
                },
            },
            {
                headerName: 'R1 Interview Rejected',
                field: 'r1InterviewRejected',
                width: 100,
                sortable: false,
                suppressMovable: true,
                cellRenderer: (props) => {
                    const { data, ind, value } = props;

                    return (
                        <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                            {value ? value : ""}
                        </div>
                    );
                },
            },
         sumCol('R2 Interview Completed', 'r2InterviewCompleted'),
            {
                headerName: 'R2 Interview Rejected',
                field: 'r2InterviewRejected',
                width: 100,
                sortable: false,
                suppressMovable: true,
                cellRenderer: (props) => {
                    const { data, ind, value } = props;

                    return (
                        <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                            {value ? value : ""}
                        </div>
                    );
                },
            },
            {
                headerName: 'R3 Interview Completed',
                field: 'r3InterviewCompleted',
                width: 100,
                sortable: false,
                suppressMovable: true,
                cellRenderer: (props) => {
                    const { data, ind, value } = props;

                    return (
                        <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                            {value ? value : ""}
                        </div>
                    );
                },
            },
            {
                headerName: 'R3 Interview Rejected',
                field: 'r3InterviewRejected',
                width: 100,
                sortable: false,
                suppressMovable: true,
                cellRenderer: (props) => {
                    const { data, ind, value } = props;

                    return (
                        <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                            {value ? value : ""}
                        </div>
                    );
                },
            },
            {
                headerName: 'No. of Talents rejected in interview',
                field: 'noOfTalentRejectInterview',
                width: 100,
                sortable: false,
                suppressMovable: true,
                cellRenderer: (props) => {
                    const { data, ind, value } = props;

                    return (
                        <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                            {value ? value : ""}
                        </div>
                    );
                },
            },
            {
                headerName: 'Negotiation Start Count',
                field: 'negotiationStartCount',
                width: 100,
                sortable: false,
                suppressMovable: true,
                cellRenderer: (props) => {
                    const { data, ind, value } = props;

                    return (
                        <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                            {value ? value : ""}
                        </div>
                    );
                },
            },
            {
                headerName: 'Negotiation Start Revenue',
                field: 'negotiationStartRevenueStr',
                width: 100,
                sortable: false,
                suppressMovable: true,
                cellRenderer: (props) => {
                    const { data, ind, value } = props;

                    return (
                        <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                            {value ? value : ""}
                        </div>
                    );
                },
            },
            {
                headerName: 'R1 to R2 Ratio',
                field: 'r1ToR2Ratio',
                width: 100,
                sortable: false,
                suppressMovable: true,
                cellRenderer: (props) => {
                    const { data, ind, value } = props;

                    return (
                        <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                            {value ? `${value} %` : ""}
                        </div>
                    );
                },
            },
            {
                headerName: 'Dropout',
                field: 'offerDropout',
                width: 100,
                sortable: false,
                suppressMovable: true,
                cellRenderer: (props) => {
                    const { data, ind, value } = props;

                    return (
                        <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                            {data.offerDropou ? `${data.offerDropout}` : ''}
                        </div>
                    );
                },


            },
            {
                headerName: 'Backout',
                field: 'offerBackout',
                width: 100,
                sortable: false,
                suppressMovable: true,
                cellRenderer: (props) => {
                    const { data, ind, value } = props;

                    return (
                        <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                            {data.offerBackout ? `${data.offerBackout}` : ''}
                        </div>
                    );
                },


            },
            {
                headerName: 'Offer Signed Talent',
                field: 'offerSignedCount',
                width: 100,
                sortable: false,
                suppressMovable: true,
                cellRenderer: (props) => {
                    const { data, ind, value } = props;

                    return (
                        <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                            {value ? value : ""}
                        </div>
                    );
                },
            },
            {
                headerName: 'R1 to Selected (I2S %)',
                field: 'r1ToSelected',
                width: 100,
                sortable: false,
                suppressMovable: true,
                cellRenderer: (props) => {
                    const { data, ind, value } = props;

                    return (
                        <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                            {value ? `${value} %` : ""}
                        </div>
                    );
                },
            },
            {
                headerName: 'Offer Signed Revenue',
                field: 'offerSignedRevenueValueStr',
                width: 100,
                sortable: false,
                suppressMovable: true,
                cellRenderer: (props) => {
                    const { data, ind, value } = props;

                    return (
                        <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                            {value ? value : ""}
                        </div>
                    );
                },
            },
            {
                headerName: 'Joined Talents',
                field: 'joinedTalent',
                width: 100,
                sortable: false,
                suppressMovable: true,
                cellRenderer: (props) => {
                    const { data, ind, value } = props;

                    return (
                        <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                            {value ? value : ""}
                        </div>
                    );
                },
            },
            {
                headerName: 'Joined Revenue',
                field: 'joinedRevenueStr',
                width: 100,
                cellStyle: (params) => ({
                    textAlign: 'center',
                    ...(params.data?.isTotalRow ? { backgroundColor: '#D6CDEC' } : {}),   // 👈 merged with existing textAlign
                }),
                sortable: false,
                suppressMovable: true,
                cellRenderer: (props) => {
                    const { data, ind, value } = props;



                    return (
                        <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                            {value ? value : ""}
                        </div>
                    );
                },
            },
            {
                headerName: 'Current Active profiles',
                field: 'currentActiveProfile',
                width: 100,
                sortable: false,
                suppressMovable: true,
                cellRenderer: (props) => {
                    const { data, ind, value } = props;

                    return (
                        <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                            {value ? value : ""}
                        </div>
                    );
                },
            },
        ]
    }

    const debouncedSearchHandler = (e) => {
        if (e.target.value.length > 1 || e.target.value === "") {
            setTimeout(() => {
                setSearch(e.target.value)

            }, 2000);
        }

        setDebouncedSearch(e.target.value);

        //debounceFun(e.target.value);
    };

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
    }, [companyList.length]);

    const gridHeightPx = availableHeight


    const onCalenderFilter = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);


    };

    const clearFilters = () => {
        setDebouncedSearch("");
        setSearch('')
        setStartDate();
        setMonthDate(today)
        setEndDate();

    }

    const handleExport = (apiData) => {


        const formattedData = apiData.map((row) => {
            const obj = {};

            gridColumns().forEach((col) => {
                const header = col.headerName
                obj[header] = row[col.field] ?? "";
            });

            return obj;
        });

        downloadToExcel(formattedData, 'company Report')
    }
// Sums `field` over the visible rows of this company, directly above the total row
const sumVisibleAbove = (props, field) => {
    const { data, api, node } = props;
    let sum = 0;
    let i = node.rowIndex - 1;
    while (i >= 0) {
        const prev = api.getDisplayedRowAtIndex(i);
        if (!prev?.data || prev.data.isTotalRow || prev.data.groupKey !== data.groupKey) break;
        sum += parseFloat(prev.data[field]) || 0;
        i--;
    }
    return sum;
};
<<<<<<< HEAD
=======

// Column that shows the normal value on data rows and the company total on the total row
const sumCol = (headerName, field, width = 100) => ({
    headerName,
    field,
    width,
    sortable: false,
    suppressMovable: true,
    cellStyle: (params) => ({
        textAlign: 'center',
        ...(params.data?.isTotalRow ? { backgroundColor: '#D6CDEC', fontWeight: 600 } : {}),
    }),
    cellRenderer: (props) => {
        const { data, value } = props;
        const display = data?.isTotalRow
            ? (sumVisibleAbove(props, field) || '')
            : (value ? value : '');
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {display}
            </div>
        );
    },
});
>>>>>>> new-html-design-imp

// Column that shows the normal value on data rows and the company total on the total row
const sumCol = (headerName, field, width = 100) => ({
    headerName,
    field,
    width,
    sortable: false,
    suppressMovable: true,
    cellStyle: (params) => ({
        textAlign: 'center',
        ...(params.data?.isTotalRow ? { backgroundColor: '#D6CDEC', fontWeight: 600 } : {}),
    }),
    cellRenderer: (props) => {
        const { data, value } = props;
        const display = data?.isTotalRow
            ? (sumVisibleAbove(props, field) || '')
            : (value ? value : '');
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {display}
            </div>
        );
    },
});
    return (
        <div className={`${stylesOBj["dashboard-container"]}`}>
            <main className={`${stylesOBj["main-content"]}`}>

                <div className={stylesOBj.filterContainer}>
                    <div className={stylesOBj.filterSets}>
                        <div className={stylesOBj.filterSetsInner}>
                            <div className={stylesOBj.filterSetsInner2}>
                                <Radio.Group
                                    onChange={(e) => {
                                        setHRModal(e.target.value);
                                        localStorage.setItem('companyReportSelectedTab', e.target.value)
                                        if (e.target.value === "Contract") {
                                            let val = pODList.find(
                                                (i) => i.dd_text === "Orion"
                                            )?.dd_value;
                                            setSelectedHead(val);
                                            localStorage.setItem('companyReportSelectedHead', val)
                                        } else {
                                            let val = pODList[0]?.dd_value;
                                            setSelectedHead(val);
                                            localStorage.setItem('companyReportSelectedHead', val)
                                        }

                                        //  setEngagementType(e.target.value);
                                    }}
                                    value={hrModal}
                                >

                                    <Radio value={"Contract"}>Contract</Radio>
                                    <Radio value={"DP"}>FTE</Radio>
                                </Radio.Group>
                                <Select
                                    id="selectedValue"
                                    placeholder="Select Head"
                                    style={{ width: "200px" }}
                                    // mode="multiple"
                                    value={selectedHead}
                                    showSearch={true}
                                    onChange={(value, option) => {
                                        setSelectedHead(value);
                                        localStorage.setItem('companyReportSelectedHead', value)
                                    }}
                                    options={pODList?.map((v) => ({
                                        label: v.dd_text,
                                        value: v.dd_value,
                                    })).filter(item => {
                                        if (hrModal === "DP") {
                                            return item.value !== 5
                                        } else {
                                            return item.value === 5
                                        }
                                    })}
                                    optionFilterProp="label"
                                />
                            </div>


                            <p
                                className={stylesOBj.resetText}
                                // style={{ width: "190px" }}
                                onClick={() => {
                                    clearFilters();
                                }}
                            >
                                Reset Filter
                            </p>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: "center" }}>
                            <div className={`${stylesOBj["filter-group"]} ${stylesOBj['search-group']}`} style={{ marginRight: '10px', minWidth: '200px', width: '200px' }}>
                                <input type="text" className={`${stylesOBj["filter-input"]} ${stylesOBj['search-input']}`} placeholder="Search"
                                    onChange={debouncedSearchHandler}
                                    value={debouncedSearch}
                                />
                                {debouncedSearch.length > 0 && <Tooltip title="Reset search">
                                    <span style={{ color: 'red', fontWeight: 'bold', fontSize: 'Large', position: 'absolute', right: '40px', cursor: 'pointer' }} onClick={e => {
                                        e.stopPropagation();
                                        setDebouncedSearch("");
                                        setSearch('')
                                    }}>X</span>
                                </Tooltip>}
                                <img src="images/search-ic.svg" alt="Search Icon" className={`${stylesOBj["input-icon"]}`} />
                            </div>
                            {/* {dateTypeFilter === 0 && ( */}
                            <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', gap: '8px' }}>
                                <div>
                                    Month-Year
                                </div>
                                <div className={stylesOBj.calendarFilter} style={{ width: '200px' }}>
                                    <CalenderSVG style={{ height: "16px", marginRight: "16px" }} />
                                    <DatePicker
                                        style={{ backgroundColor: "red", width: '200px' }}
                                        onKeyDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        className={stylesOBj.dateFilter}
                                        placeholderText="Month - Year"
                                        selected={monthDate}
                                        onChange={date => setMonthDate(date)}
                                        dateFormat="MM-yyyy"
                                        showMonthYearPicker
                                    />
                                </div>
                            </div>
                            {/* )} */}
                            {/* {dateTypeFilter === 1 && ( */}
                            <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', gap: '8px', marginLeft: '10px' }}>
                                <div>Date</div>
                                <div className={stylesOBj.calendarFilter} style={{ width: '200px' }}>
                                    <CalenderSVG style={{ height: "16px", marginRight: "16px" }} />
                                    <DatePicker
                                        style={{ backgroundColor: "red" }}
                                        onKeyDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        className={stylesOBj.dateFilter}
                                        placeholderText="Start date - End date"
                                        selected={startDate}
                                        onChange={onCalenderFilter}
                                        startDate={startDate}
                                        endDate={endDate}
                                        maxDate={new Date()}
                                        selectsRange
                                    />
                                </div>
                            </div>
                            {/* )}                 */}


                            <div
                                // className={stylesOBj.paginationFilter}
                                style={{ border: "none", width: "auto", marginLeft: '10px' }}
                            >
                                <button
                                    className={stylesOBj.btnPrimary}
                                    onClick={() => handleExport(companyList)}
                                >
                                    Export
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    ref={gridWrapperRef}
                    className={`${stylesOBj["table-container"]} ${gridStyles["grid-wrapper"]}`}
                    style={{ height: gridHeightPx }}
                >

                    {isLoading ? <TableSkeleton /> :
                        <AgGridReact
                            onGridReady={(params) => {
                                setGridApi(params.api);
                            }}
                            rowData={companyList}
                            theme={scrumGridTheme}
                            columnDefs={gridColumns()}
                            // animateRows={false}
                            headerHeight={38}
                            rowHeight={25}
                            defaultColDef={scrumDefaultColDef}
                            //   getRowId={(params) => String(params.data.id)}
                            autoGroupColumnDef={autoGroupColumnDef}
                            suppressScrollOnNewData={true}
                            suppressRowTransform={true}
                            // onFilterChanged={(params) => {
                            //     const isAnyFilterApplied = params.api.isAnyFilterPresent();
                            //     params.api.refreshCells({ force: true });
                            //     params.api.redrawRows();
                            // }}
                             isExternalFilterPresent={() => true}
<<<<<<< HEAD
    doesExternalFilterPass={doesExternalFilterPass}
=======
                                doesExternalFilterPass={doesExternalFilterPass}
>>>>>>> new-html-design-imp
                             onFilterChanged={handleFilterChanged} 
                            onFirstDataRendered={handleFirstDataRendered}
                        />}


                </div>


            </main>
        </div>
    )
}

export default CompanyReport
