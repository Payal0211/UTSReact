import React, {
    useState,
    useEffect,
    Suspense,
    useMemo,
    useCallback,
} from 'react';
import { Dropdown, Menu, message, Table, Tooltip, Modal } from 'antd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import allEngagementStyles from './engagement.module.css';
import { InputType } from 'constants/application';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import { ReactComponent as FunnelSVG } from 'assets/svg/funnel.svg';
import { ReactComponent as SearchSVG } from 'assets/svg/search.svg';
import { IoChevronDownOutline } from 'react-icons/io5';
import UTSRoutes from 'constants/routes';
import Handshake from 'assets/svg/handshake.svg';
import Rocket from 'assets/svg/rocket.svg';
import Smile from 'assets/svg/smile.svg';
import Briefcase from 'assets/svg/briefcase.svg';
import { allEngagementConfig } from './allEngagementConfig';
import WithLoader from 'shared/components/loader/loader';
import { HTTPStatusCode } from 'constants/network';
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton';
import EngagementFeedback from '../engagementFeedback/engagementFeedback';
import EngagementBillRate from '../engagementBillAndPayRate/engagementBillRate';
import EngagementPayRate from '../engagementBillAndPayRate/engagementPayRate';
import EngagementOnboard from '../engagementOnboard/engagementOnboard';
import EngagementAddFeedback from '../engagementAddFeedback/engagementAddFeedback';
import EngagementReplaceTalent from '../engagementReplaceTalent/engagementReplaceTalent';
import EngagementBillRateAndPayRate from '../engagementBillAndPayRate/engagementBillRateAndPayRate';
import { engagementRequestDAO } from 'core/engagement/engagementDAO';
import { allHRConfig } from 'modules/hiring request/screens/allHiringRequest/allHR.config';
import { engagementUtils } from './engagementUtils';
import EngagementEnd from '../endEngagement/endEngagement';
import EngagementInvoice from '../engagementInvoice/engagementInvoice';

/** Importing Lazy components using Suspense */
const EngagementFilerList = React.lazy(() =>
    import('./engagementFilter'),
);

const EngagementList = () => {
    const [tableFilteredState, setTableFilteredState] = useState({
        totalrecord: 10,
        pagenumber: 1,
        filterFieldsEngagement: {
            clientFeedback: "",
            typeOfHiring: "",
            currentStatus: "",
            tscName: "",
            company: "",
            geo: "",
            position: "",
            engagementTenure: 0,
            nbdName: "",
            amName: "",
            pending: "",
            searchMonth: 0,
            searchYear: 0,
            searchType: "",
            islost: ""
        }
    });
    const [isLoading, setLoading] = useState(false);
    const pageSizeOptions = [100, 200, 300, 500, 1000];
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(100);
    const [isAllowFilters, setIsAllowFilters] = useState(false);
    const [getHTMLFilter, setHTMLFilter] = useState(false)
    const [filtersList, setFiltersList] = useState([]);
    const [apiData, setAPIdata] = useState([]);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const navigate = useNavigate();
    const [filteredTagLength, setFilteredTagLength] = useState(0);
    const [appliedFilter, setAppliedFilters] = useState(new Map());
    const [checkedState, setCheckedState] = useState(new Map());
    const [getBillRate, setBillRate] = useState(0);
    const [getPayRate, setPayRate] = useState(0);
    const [engagementBillAndPayRateTab, setEngagementBillAndPayRateTab] = useState("1")
    const [getEngagementModal, setEngagementModal
    ] = useState({ engagementFeedback: false, engagementBillRate: false, engagementPayRate: false, engagementOnboard: false, engagementAddFeedback: false, engagementReplaceTalent: false, engagementBillRateAndPayRate: false, engagementEnd: false, engagementInvoice: false });

    const onRemoveHRFilters = () => {
        setTimeout(() => {
            setIsAllowFilters(false);
        }, 300)
        setHTMLFilter(false)
    };

    const tableColumnsMemo = useMemo(
        () => allEngagementConfig.tableConfig(getEngagementModal, setEngagementModal),
        [],
    );

    const handleHRRequest = useCallback(
        async (pageData) => {
            setLoading(true);
            let response = await engagementRequestDAO.getEngagementListDAO(
                pageData,
            );
            if (response?.statusCode === HTTPStatusCode.OK) {
                setTotalRecords(response?.responseBody?.totalrows);
                setLoading(false);
                setAPIdata(engagementUtils.modifyEngagementListData(response && response));
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
                return 'NO DATA FOUND';
            }
        },
        [navigate],
    );

    useEffect(() => {
        const timer = setTimeout(() => setSearch(debouncedSearch), 1000);
        return () => clearTimeout(timer);
    }, [debouncedSearch]);

    useEffect(() => {
        handleHRRequest(tableFilteredState);
    }, [tableFilteredState]);

    useEffect(() => {
        setBillRate(0);
        setPayRate(0);
        setEngagementBillAndPayRateTab("1")
    }, [getEngagementModal.engagementBillRateAndPayRate])

    const getEngagementFilterList = useCallback(async () => {
        const response = await engagementRequestDAO.getEngagementFilterListDAO();
        if (response?.statusCode === HTTPStatusCode.OK) {
            console.log(response && response?.responseBody?.details, "data")
            setFiltersList(response && response?.responseBody?.details);
        } else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
            return navigate(UTSRoutes.LOGINROUTE);
        } else if (response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
            return navigate(UTSRoutes.SOMETHINGWENTWRONG);
        } else {
            return 'NO DATA FOUND';
        }
    }, [navigate]);

    const toggleHRFilter = useCallback(() => {
        getEngagementFilterList();
        !getHTMLFilter ? setIsAllowFilters(!isAllowFilters) : setTimeout(() => {
            setIsAllowFilters(!isAllowFilters);
        }, 300)
        setHTMLFilter(!getHTMLFilter)
    }, [getEngagementFilterList, isAllowFilters]);

    /*--------- React DatePicker ---------------- */
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const onCalenderFilter = (dates) => {
        const [start, end] = dates;

        setStartDate(start);
        setEndDate(end);

        if (start && end) {
            setTableFilteredState({
                ...tableFilteredState,
                filterFields_ViewAllHRs: {
                    fromDate: new Date(start).toLocaleDateString('en-US'),
                    toDate: new Date(end).toLocaleDateString('en-US'),
                },
            });
            handleHRRequest({
                ...tableFilteredState,
                filterFields_ViewAllHRs: {
                    fromDate: new Date(start).toLocaleDateString('en-US'),
                    toDate: new Date(end).toLocaleDateString('en-US'),
                },
            });
        }
    };

    return (
        <div className={allEngagementStyles.hiringRequestContainer}>

            <div className={allEngagementStyles.userListTitle}>
                <div className={allEngagementStyles.hiringRequest}>Engagement Dashboard - January</div>
            </div>

            <div className={allEngagementStyles.filterContainer}>
                <div className={allEngagementStyles.filterSets}>
                    <div
                        className={allEngagementStyles.addFilter}
                        onClick={toggleHRFilter}>
                        <FunnelSVG style={{ width: '16px', height: '16px' }} />

                        <div className={allEngagementStyles.filterLabel}>Add Filters</div>
                        <div className={allEngagementStyles.filterCount}>7</div>
                    </div>


                    <div className={allEngagementStyles.filterRight}>
                        <div className={allEngagementStyles.searchFilterSet}>
                            <SearchSVG style={{ width: '16px', height: '16px' }} />
                            <input
                                type={InputType.TEXT}
                                className={allEngagementStyles.searchInput}
                                placeholder="Search Table"
                                onChange={(e) => {
                                    return setDebouncedSearch(
                                        userUtils.userListSearch(e, userList),
                                    );
                                }}
                            />
                        </div>
                        <div className={allEngagementStyles.calendarFilterSet}>
                            <div className={allEngagementStyles.label}>Date</div>
                            <div className={allEngagementStyles.calendarFilter}>
                                <CalenderSVG style={{ height: '16px', marginRight: '16px' }} />
                                <DatePicker
                                    style={{ backgroundColor: 'red' }}
                                    onKeyDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    className={allEngagementStyles.dateFilter}
                                    placeholderText="Start date - End date"
                                    selected={startDate}
                                    onChange={onCalenderFilter}
                                    startDate={startDate}
                                    endDate={endDate}
                                    selectsRange
                                />
                            </div>
                        </div>


                        <div className={allEngagementStyles.priorityFilterSet}>
                            <div className={allEngagementStyles.label}>Showing</div>
                            <div className={allEngagementStyles.paginationFilter}>
                                <Dropdown
                                    trigger={['click']}
                                    placement="bottom"
                                    overlay={
                                        <Menu
                                            onClick={(e) => {
                                                setPageSize(parseInt(e.key));
                                                if (pageSize !== parseInt(e.key)) {
                                                    fetchUserList({
                                                        pageNumber: pageIndex,
                                                        totalRecord: parseInt(e.key),
                                                    });
                                                }
                                            }}>
                                            {pageSizeOptions.map((item) => {
                                                return <Menu.Item key={item}>{item}</Menu.Item>;
                                            })}
                                        </Menu>
                                    }>
                                    <span>
                                        {pageSize}
                                        <IoChevronDownOutline
                                            style={{ paddingTop: '5px', fontSize: '16px' }}
                                        />
                                    </span>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${allEngagementStyles.filterSets} ${allEngagementStyles.filterDescription}`}>
                    <div className={allEngagementStyles.filterType}>
                        <img src={Handshake} alt="handshaker" />
                        <h2>Active Engagements - <span>{apiData[0]?.activeEngagement ? apiData[0]?.activeEngagement : 0}</span></h2>
                    </div>
                    <div className={allEngagementStyles.filterType}>
                        <img src={Smile} alt="smile" />
                        <h2>Feedback Received - <span>{apiData[0]?.feedbcakReceive ? apiData[0]?.feedbcakReceive : 0}</span></h2>
                    </div>
                    <div className={allEngagementStyles.filterType}>
                        <img src={Rocket} alt="rocket" />
                        <h2>Average NR% - <span>{apiData[0]?.avgNR ? apiData[0]?.avgNR : 0}</span></h2>
                    </div>
                    <div className={allEngagementStyles.filterType}>
                        <img src={Briefcase} alt="briefcase" />
                        <h2>Average DP%  - <span>{apiData[0]?.avgDP ? apiData[0]?.avgDP : 0}</span></h2>
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <a className='mr-2' onClick={() => setEngagementModal({ ...getEngagementModal, engagementFeedback: true })}>EngagementFeeback</a>
                {/* <a className='mr-2' onClick={() => setEngagementModal({ ...getEngagementModal, engagementBillRate: true })}  >EngagementBillRate</a> */}
                {/* <a className='mr-2' onClick={() => setEngagementModal({ ...getEngagementModal, engagementPayRate: true })} >EngagementPayRate</a> */}
                <a className='mr-2' onClick={() => setEngagementModal({ ...getEngagementModal, engagementOnboard: true })} >EngagementOnboard</a>
                <a className='mr-2' onClick={() => setEngagementModal({ ...getEngagementModal, engagementAddFeedback: true })} >EngagementAddFeedback</a>
                <a className='mr-2' onClick={() => setEngagementModal({ ...getEngagementModal, engagementReplaceTalent: true })} >EngagementReplaceTalent</a>
                <a className='mr-2' onClick={() => setEngagementModal({ ...getEngagementModal, engagementBillRateAndPayRate: true })} >EngagementBillRateAndPayRate</a>
            </div>

            {/*
			 * ------------ Table Starts-----------
			 * @Table Part
			 */}
            <div className={allEngagementStyles.tableDetails}>
                {isLoading ? (
                    <TableSkeleton />
                ) : (
                    <WithLoader>
                        <Table
                            id="hrListingTable"
                            columns={tableColumnsMemo}
                            bordered={false}
                            dataSource={
                                search && search.length > 0 ? [...search] : [...apiData]
                            }
                            pagination={{
                                onChange: (pageNum, pageSize) => {
                                    setPageIndex(pageNum);
                                    setPageSize(pageSize);
                                    setTableFilteredState({
                                        ...tableFilteredState,
                                        pagesize: pageSize,
                                        pagenum: pageNum,
                                    });
                                    handleHRRequest({ pagesize: pageSize, pagenum: pageNum });
                                },
                                size: 'small',
                                pageSize: pageSize,
                                pageSizeOptions: pageSizeOptions,
                                total: totalRecords,
                                showTotal: (total, range) =>
                                    `${range[0]}-${range[1]} of ${totalRecords} items`,
                                defaultCurrent: pageIndex,
                            }}
                        />
                    </WithLoader>
                )}
            </div>

            {
                isAllowFilters && (
                    <Suspense fallback={<div>Loading...</div>}>
                        <EngagementFilerList
                            setAppliedFilters={setAppliedFilters}
                            appliedFilter={appliedFilter}
                            setCheckedState={setCheckedState}
                            checkedState={checkedState}
                            handleHRRequest={handleHRRequest}
                            setTableFilteredState={setTableFilteredState}
                            tableFilteredState={tableFilteredState}
                            setFilteredTagLength={setFilteredTagLength}
                            onRemoveHRFilters={onRemoveHRFilters}
                            getHTMLFilter={getHTMLFilter}
                            hrFilterList={allHRConfig.hrFilterListConfig()}
                            filtersType={allEngagementConfig.engagementFilterTypeConfig(
                                filtersList && filtersList,
                            )}

                        />
                    </Suspense>
                )
            }

            {/** ============ MODAL FOR ENGAGEMENTFEEDBACK ================ */}
            <Modal
                transitionName=""
                width="930px"
                centered
                footer={null}
                open={getEngagementModal.engagementFeedback}
                // className={allEngagementStyles.engagementModalContainer}
                className="engagementModalStyle"
                // onOk={() => setVersantModal(false)}
                onCancel={() => setEngagementModal({ ...getEngagementModal, engagementFeedback: false })}
            >
                <EngagementFeedback />
            </Modal>


            {/** ============ MODAL FOR ENGAGEMENTBILLRATE ================ */}
            <Modal
                transitionName=""
                width="930px"
                centered
                footer={null}
                className="engagementBillRateModal"
                open={getEngagementModal.engagementBillRate}
                // onOk={() => setVersantModal(false)}
                onCancel={() => setEngagementModal({ ...getEngagementModal, engagementBillRate: false })}
            >
                <EngagementBillRate />
            </Modal>

            {/** ============ MODAL FOR ENGAGEMENTPAYRATE ================ */}

            <Modal
                transitionName=""
                width="930px"
                centered
                footer={null}
                open={getEngagementModal.engagementPayRate}
                className="engagementPayRateModal"
                // onOk={() => setVersantModal(false)}
                onCancel={() => setEngagementModal({ ...getEngagementModal, engagementPayRate: false })}
            >
                <EngagementPayRate />
            </Modal>


            {/** ============ MODAL FOR ENGAGEMENTONBOARD ================ */}

            <Modal
                transitionName=""
                width="930px"
                centered
                footer={null}
                className="engagementPayRateModal"
                open={getEngagementModal.engagementOnboard}
                onCancel={() => setEngagementModal({ ...getEngagementModal, engagementOnboard: false })}

            >
                <EngagementOnboard />
            </Modal>


            {/** ============ MODAL FOR ENGAGEMENT ADD FEEDBACK ================ */}

            <Modal
                transitionName=""
                width="930px"
                centered
                footer={null}
                className="engagementAddFeedbackModal"
                open={getEngagementModal.engagementAddFeedback}
                onCancel={() => setEngagementModal({ ...getEngagementModal, engagementAddFeedback: false })}

            >
                <EngagementAddFeedback />
            </Modal>


            {/** ============ MODAL FOR ENGAGEMENT REPLACE TALENT ================ */}

            <Modal
                transitionName=""
                width="930px"
                centered
                footer={null}
                open={getEngagementModal.engagementReplaceTalent}
                className="engagementReplaceTalentModal"
                // onOk={() => setVersantModal(false)}
                onCancel={() => setEngagementModal({ ...getEngagementModal, engagementReplaceTalent: false })}
            >
                <EngagementReplaceTalent />
            </Modal>

            {/** ============ MODAL FOR ENGAGEMENT BILLRATE AND PAYRATE ================ */}

            <Modal
                transitionName=""
                width="930px"
                centered
                footer={null}
                open={getEngagementModal.engagementBillRateAndPayRate}
                className="engagementReplaceTalentModal"
                onCancel={() => setEngagementModal({ ...getEngagementModal, engagementBillRateAndPayRate: false })}
            >
                <EngagementBillRateAndPayRate
                    getBillRate={getBillRate}
                    setBillRate={setBillRate}
                    getPayRate={getPayRate}
                    setPayRate={setPayRate}
                    setEngagementBillAndPayRateTab={setEngagementBillAndPayRateTab}
                    engagementBillAndPayRateTab={engagementBillAndPayRateTab}

                />
            </Modal>

            {/** ============ MODAL FOR ENGAGEMENT END ================ */}
            <Modal
                transitionName=""
                width="930px"
                centered
                footer={null}
                open={getEngagementModal.engagementEnd}
                className="engagementReplaceTalentModal"
                onCancel={() => setEngagementModal({ ...getEngagementModal, engagementEnd: false })}
            >
                <EngagementEnd />
            </Modal>


            {/** ============ MODAL FOR ENGAGEMENT INVOICE ================ */}
            <Modal
                transitionName=""
                width="930px"
                centered
                footer={null}
                open={getEngagementModal.engagementInvoice}
                className="engagementReplaceTalentModal"
                onCancel={() => setEngagementModal({ ...getEngagementModal, engagementInvoice: false })}
            >
                <EngagementInvoice />
            </Modal>

        </div >
    );
};

export default EngagementList;
