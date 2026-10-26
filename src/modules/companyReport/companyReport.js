import React, { useEffect, useState, useRef } from 'react'
import stylesOBj from './companyReport.module.css'
import { useNavigate } from 'react-router-dom';
import { HTTPStatusCode } from "constants/network";
import gridStyles from './scrumGrid.module.css'
import { Modal, message, Radio, Skeleton, Spin, Tooltip, Tag } from "antd";
import { scrumGridTheme } from 'modules/ScrumS2/gridTheme'
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton'
import { TaDashboardDAO } from "core/taDashboard/taDashboardDRO";
import UTSRoutes from 'constants/routes';
import { AgGridReact } from 'ag-grid-react'

function CompanyReport() {
    const navigate = useNavigate()
    const [isLoading, setLoading] = useState(false)
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [companyList, setCompanyList] = useState([])
    const gridWrapperRef = useRef(null);
    const [availableHeight, setAvailableHeight] = useState(600);
    const GRID_MIN_HEIGHT = 320;
    const GRID_BOTTOM_PADDING = 24;
    const getListData = async () => {
        setLoading(true)
        let req = await TaDashboardDAO.getCompanyReportRequestDAO(search);
        setLoading(false)
        if (req.statusCode === HTTPStatusCode.OK) {
            setCompanyList(req.responseBody);
        } else if (req.statusCode === HTTPStatusCode.NOT_FOUND) {
            setCompanyList([]);
        } else if (req?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
            // setLoading(false);
            return navigate(UTSRoutes.LOGINROUTE);
        } else if (req?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
            // setLoading(false);
            return navigate(UTSRoutes.SOMETHINGWENTWRONG);
        } else {
            setCompanyList([]);
            return "NO DATA FOUND";

        }
    }


    useEffect(() => {
        getListData()
    }, [search])

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

    const gridColumns = () => {
        return [
            {
                headerName: 'Company',
                field: 'companyName',
                width: 140,
                pinned: 'left',
                sortable: false,
                suppressMovable: true,
                //           cellRenderer: (props) => {
                //     const { data, ind ,value} = props;

                //     return (
                //       <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                //         {value ? value: ""}
                //       </div>
                //     );
                //   },
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
            {
                headerName: 'TRs',
                field: 'noOfTalentRejectInterview',
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
            {
                headerName: '# profile Shared',
                field: 'profilesShared',
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
            {
                headerName: 'R1 Interview Completed',
                field: 'r1InterviewCompleted',
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
            {
                headerName: 'R2 Interview Completed',
                field: 'r2InterviewCompleted',
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
                field: 'negotiationStartRevenueValue',
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
                headerName: 'Offer Dropout/Backout',
                field: 'offerDropout',
                width: 100,
                sortable: false,
                suppressMovable: true,
                cellRenderer: (props) => {
                    const { data, ind, value } = props;

                    return (
                        <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                            {`${data.offerDropout} / ${data.offerBackout}`}
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
                field: 'offerSignedRevenueValue',
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
                field: 'joinedRevenue',
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
    return (
        <div className={`${stylesOBj["dashboard-container"]}`}>
            <main className={`${stylesOBj["main-content"]}`}>

                <div style={{ display: 'flex', paddingRight: '15px', margin: '5px 10px' }}>
                    <div className={`${stylesOBj["filter-group"]} ${stylesOBj['search-group']}`} style={{ marginLeft: '5px' }}>
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
                </div>


                <div
                    ref={gridWrapperRef}
                    className={`${stylesOBj["table-container"]} ${gridStyles["grid-wrapper"]}`}
                    style={{ height: gridHeightPx }}
                >

                    {isLoading ? <TableSkeleton /> :
                        <AgGridReact

                            rowData={companyList}
                            theme={scrumGridTheme}
                            columnDefs={gridColumns()}
                            // animateRows={false}
                            headerHeight={38}
                            rowHeight={25}
                            defaultColDef={scrumDefaultColDef}
                            //   getRowId={(params) => String(params.data.id)}
                            suppressScrollOnNewData={true}
                            suppressRowTransform={true}

                        />}


                </div>


            </main>
        </div>
    )
}

export default CompanyReport