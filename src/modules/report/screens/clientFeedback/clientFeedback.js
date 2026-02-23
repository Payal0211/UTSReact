import React, { useState, useEffect, Suspense, useCallback } from "react";
import uplersStyle from "./clientFeedback.module.css";
import {
    Select,
    Table,
    Typography,
    Modal,
    Tooltip,
    InputNumber,
    message,
    Skeleton,
    Checkbox,
    Col,
    Radio,
    Card,
    Spin,
    Avatar,
    Tabs,
} from "antd";
import { MasterDAO } from "core/master/masterDAO";
import OnboardFilerList from "../../../onBoardList/OnboardFilterList";
import FeedBack from "assets/svg/feedbackReceived.png";
import Handshake from "assets/svg/handshake.svg";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import Diamond from "assets/svg/diamond.svg";
import { ReportDAO } from "core/report/reportDAO";
import { HTTPStatusCode } from "constants/network";
import { useNavigate, Link } from "react-router-dom";
import { downloadToExcel } from "modules/report/reportUtils";
import UTSRoutes from "constants/routes";
import DatePicker from "react-datepicker";
import LostEng from "assets/svg/lostEng.png";
import moment from "moment";
import { All_Hiring_Request_Utils } from "shared/utils/all_hiring_request_util";
import { size } from "lodash";
import { IoMdAddCircle } from "react-icons/io";
import { IoChatboxEllipses } from "react-icons/io5";
import { IconContext } from "react-icons";
import SparkIcon from "assets/svg/sparkIcon.png";
import TicketImg from "assets/tickiteheader.png";
import { ReactComponent as SearchSVG } from 'assets/svg/search.svg';
import { TaDashboardDAO } from "core/taDashboard/taDashboardDRO";
import spinGif from "assets/gif/RefreshLoader.gif";
import Editor from "modules/hiring request/components/textEditor/editor";
import { UserSessionManagementController } from "modules/user/services/user_session_services";
import { ReactComponent as FunnelSVG } from "assets/svg/funnel.svg";
import { allEngagementConfig } from "modules/engagement/screens/engagementList/allEngagementConfig";
import { allHRConfig } from "modules/hiring request/screens/allHiringRequest/allHR.config";
import { engagementRequestDAO } from "core/engagement/engagementDAO";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Scrollbar, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/navigation";
import "swiper/css/pagination";


const { Title, Text } = Typography;


function ClientFeedback() {
    const [searchText, setSearchedText] = useState('')
    const [debouncedSearchSourceCategory, setDebouncedSearchSourceCategory] = useState('');

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [monthDate, setMonthDate] = useState(new Date());

    const selectedYear = monthDate.getFullYear();
    const [selectedMonths, setSelectedMonths] = useState([])
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(false)
    const [feedbackListData, setFeedbackListData] = useState([])


    const [filtersList, setFiltersList] = useState([]);
    const [filteredTagLength, setFilteredTagLength] = useState(0);
    const [getHTMLFilter, setHTMLFilter] = useState(false);
    const [isAllowFilters, setIsAllowFilters] = useState(false);
    const [appliedFilter, setAppliedFilters] = useState(new Map());
    const [checkedState, setCheckedState] = useState(new Map());
    const [tableFilteredState, setTableFilteredState] = useState({
        totalrecord: 100,
        pagenumber: 1,
        filterFields_OnBoard: {
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
            searchMonth: new Date().getMonth() + 1,
            searchYear: new Date().getFullYear(),
            searchType: "",
            islost: "",
            EngType: "A",
            toDate: "",
            fromDate: "",
            SummaryFilterOption: "",
            EngagementOption: "All",
            onBoardLostReasons: "",
            engagementStatus: "",
        },
    });

    const [dateModal, setDateModal] = useState("Months")
    const MONTHS = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    useEffect(() => {
        let month = monthDate.getMonth()

        // let mObject = monthsArray.find(i => i.value === month)
        setSelectedMonths([month])
        // console.log(month, mObject)
    }, [])



    const getFeedbackData = async () => {
        let payload = {
            StartDate: dateModal === 'Date Range' ? moment(startDate).format('YYYY-MM-DD')  ?? '' : '',
            EndDate: dateModal === 'Date Range' ? moment(endDate).format('YYYY-MM-DD')  ?? '' : '',
            MonthStr: dateModal === 'Months' ? selectedMonths.map(i => i + 1).join(',') : '',
            YearStr: dateModal === 'Months' ? `${selectedYear}` : '',
            AMAssignment: tableFilteredState.filterFields_OnBoard.amName,
            ClientFeedback: tableFilteredState.filterFields_OnBoard.clientFeedback,
            AmberFeedback: tableFilteredState?.filterFields_OnBoard.SummaryFilterOption === "AF" ? 1 : 0,
            RedFeedback: tableFilteredState?.filterFields_OnBoard.SummaryFilterOption === "RF" ? 1 : 0,
            GreenFeedback: tableFilteredState?.filterFields_OnBoard.SummaryFilterOption === "GF" ? 1 : 0,
            SearchText: searchText
        }

        if(dateModal === 'Date Range'  && !endDate){
            return
        }

        if(dateModal === 'Months' && selectedMonths.length === 0){
            return
        }

        console.log(payload)
        setLoading(true);
        let result = await MasterDAO.getClientFeedbackListDAO(payload);
        setLoading(false);
        if (result.statusCode === HTTPStatusCode.OK) {


            setFeedbackListData(result?.responseBody?.details);
        }
        if (result.statusCode === HTTPStatusCode.NOT_FOUND) {


            setFeedbackListData([]);
        }

    }

    useEffect(() => {
        getFeedbackData()
    }, [startDate, endDate, selectedMonths, selectedYear, tableFilteredState, searchText])

    const debouncedSearchSourceCategoryHandler = (e) => {

        setTimeout(() => {
            setSearchedText(e.target.value)
        }, 2000)

        setDebouncedSearchSourceCategory(e.target.value)
        // setPageIndex(1); 
    };

    const toggleMonth = (index) => {
        let updated;
        if (selectedMonths.includes(index)) {
            updated = selectedMonths.filter(m => m !== index);
        } else {
            updated = [...selectedMonths, index].sort((a, b) => a - b);
        }
        updated.length > 0 && setSelectedMonths(updated);
        // onChange(updated.map(m => m + 1).join(",")); // SQL ready
    };

    const onCalenderFilter = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        if (start && end) {
            const startDate_parts = new Date(start).toLocaleDateString('en-US').split('/');
            const sDate = `${startDate_parts[2]}-${startDate_parts[0].padStart(2, '0')}-${startDate_parts[1].padStart(2, '0')}`;
            const endDate_parts = new Date(end).toLocaleDateString('en-US').split('/');
            const eDate = `${endDate_parts[2]}-${endDate_parts[0].padStart(2, '0')}-${endDate_parts[1].padStart(2, '0')}`;
            // setTableFilteredState(prevState => ({
            //     ...prevState,
            //     filterFields_Client: {
            //       ...prevState.filterFields_Client,
            //       fromDate: sDate,
            //       toDate: eDate,
            //     }
            //   }));			
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

    const clearFilters = useCallback(() => {
        setAppliedFilters(new Map());
        setCheckedState(new Map());
        setFilteredTagLength(0);

        const defaultFilters = {
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
            searchMonth: new Date().getMonth() + 1,
            searchYear: new Date().getFullYear(),
            searchType: "",
            islost: "",
            EngType: "A",

            SummaryFilterOption: "",
            EngagementOption: "All",
            onBoardLostReasons: "",
            engagementStatus: "",
        };

        setTableFilteredState({
            ...tableFilteredState,
            filterFields_OnBoard: defaultFilters,
        });

        onRemoveHRFilters();
        setDebouncedSearchSourceCategory("");
        setSearchedText('')
        setMonthDate(new Date());
        let month = new Date().getMonth()
        setSelectedMonths([month])
        setDateModal('Months')
        //   setStartDate(
        //     new Date(date.getFullYear(), date.getMonth() - 1, date.getDate())
        //   );
        //   setEndDate(new Date(date));
        setStartDate(null)
        setEndDate(null)
    }, [
        setAppliedFilters,
        setCheckedState,
        setFilteredTagLength,
        setTableFilteredState,
        tableFilteredState,
    ]);



    const getEngagementFilterList = useCallback(async () => {
        // setLoading(true);
        const response = await engagementRequestDAO.getEngagementFilterListDAO();
        if (response?.statusCode === HTTPStatusCode.OK) {
            // setLoading(false);
            setFiltersList(response && response?.responseBody?.details);
        } else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
            // setLoading(false);
            return navigate(UTSRoutes.LOGINROUTE);
        } else if (response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
            // setLoading(false);
            return navigate(UTSRoutes.SOMETHINGWENTWRONG);
        } else {
            return "NO DATA FOUND";
        }
    }, [navigate]);

    useEffect(() => {
        getEngagementFilterList();
    }, [getEngagementFilterList]);


    const tableColumns = [
        {
            title: <>Feedback<br/> Date</>,
            dataIndex: "feedbackCreatedDateTime",
            key: "feedbackCreatedDateTime",
            align: "left",
            width: "120px",
            fixed: "left",
        },
        {
            title: "Eng. ID/HR#",
            dataIndex: "engagemenID",
            key: "engagemenID",
            align: "left",
            width: "200px",
            fixed: "left", // Fix this column on the left
            render: (text, result) => {
                return (
                    <>
                        <Link
                            to={`/viewOnboardDetails/${result.onBoardID}/${result.isOngoing === "Ongoing" ? true : false
                                }`}
                            target="_blank"
                            style={{
                                color: `var(--uplers-black)`,
                                textDecoration: "underline",
                            }}
                        >
                            {" "}
                            {result?.engagemenID}
                        </Link>
                        <br />

                        <Link
                            to={`/allhiringrequest/${result?.hrid}`}
                            target="_blank"
                            style={{ color: "#006699", textDecoration: "underline" }}
                        >
                            {result?.hR_Number}
                        </Link>
                    </>
                );
            },
        },
        {
            title: "Company",
            dataIndex: "companyName",
            key: "companyName",
            align: "left",

        },
        {
            title: "Talent (Email)",
            dataIndex: "talentName",
            key: "talentName",
            align: "left",
            render: (val, result) => {
                return <>{val} <br /> ( {result.talentEmail} ) </>
            }
        },
        {
            title: <>Feedback <br />Type</>,
            dataIndex: "feedbackType",
            key: "feedbackType",
            align: "left",
            width: '95px'
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            align: "left",

        },
        {
            title: "Sub Category",
            dataIndex: "subCategory",
            key: "subCategory",
            align: "left",
width: "300px",
        },
        {
            title: "Feedback Comments",
            dataIndex: "feedbackComment",
            key: "feedbackComment",
            align: "left",
width: "300px",
        },
        {
            title: "Action To Take",
            dataIndex: "feedbackActionToTake",
            key: "feedbackActionToTake",
            align: "left",
width: "300px",
        },
    ]

    const handleExport = (data) => {
  let DataToExport = data.map((data) => {
      let obj = {};
      tableColumns.forEach((val, ind) => {
        if (val.key !== "clientFeedback") {
          if (val.title === "Eng. ID/HR#") {
            obj[`${val.title}`] =
              `${data.engagemenID} /  ${data?.hR_Number} ` 
              
          }else if (val.key === "feedbackCreatedDateTime") {
            obj["Feedback Data"] =`${data.feedbackCreatedDateTime}` 
              
          } else if (val.key === "feedbackType") {
            obj["Feedback Type"] =`${data.feedbackType}` 
              
          } else if (val.title === "Talent (Email)") {
            obj[`${val.title}`] =
              `${data.talentName} (${data?.talentEmail}) ` 
              
          } else {
            obj[`${val.title}`] = data[`${val.key}`];
          }
        }
      });

      return obj;
    });
    downloadToExcel(DataToExport, "Client Feedback");
    }


    return (
        <div className={uplersStyle.hiringRequestContainer}>
            <div className={uplersStyle.filterContainer}>
                <div className={uplersStyle.filterSets} style={{ flexDirection: 'column', gap: '5px', alignItems: 'start' }}>
                    <div className={uplersStyle.filterSetsInner}>
                        <Title level={3} style={{ margin: 0 }}>
                            {/* {`${today?.toLocaleString("default", {
                        month: "long",
                      })} ${selectedYear}`} */}
                            Client Feedback
                        </Title>


                    </div>
                    <div className={uplersStyle.filterRight} style={{ flexWrap: 'nowrap', gap: '5px', width: '100%', }}>

                        <div className={uplersStyle.addFilter} onClick={toggleHRFilter}>
                            <FunnelSVG style={{ width: "16px", height: "16px" }} />

                            <div className={uplersStyle.filterLabel}>Add Filters</div>
                            <div className={uplersStyle.filterCount}>{filteredTagLength}</div>
                        </div>

                        <div className={uplersStyle.searchFilterSet}>
                            <SearchSVG style={{ width: '16px', height: '16px' }} />
                            <input
                                type={'text'}
                                className={uplersStyle.searchInput}
                                placeholder="Search ..."
                                onChange={debouncedSearchSourceCategoryHandler}
                                value={debouncedSearchSourceCategory}
                            />
                        </div>

                        <p className={uplersStyle.resetText} onClick={() => clearFilters()}>Reset Filters</p>
                        <Radio.Group
                            onChange={(e) => {
                                setDateModal(e.target.value);


                                //  setEngagementType(e.target.value);
                            }}
                            style={{ marginLeft: 'auto' }}
                            value={dateModal}
                        >
                            <Radio value={"Months"}>Months</Radio>
                            <Radio value={"Date Range"}>Date Range</Radio>
                        </Radio.Group>

                        <button
                            className={uplersStyle.btnPrimary}
                            onClick={() => handleExport(feedbackListData)}
                        >
                            Export
                        </button>

                    </div>

                    <div className={uplersStyle.filterRight} style={{ flexWrap: 'nowrap', gap: '5px', justifyContent: 'flex-end', width: '100%' }}>


                        {dateModal === 'Date Range' && <>
                            <div className={uplersStyle.calendarFilterSet}>
                                <div className={uplersStyle.label}>Date</div>
                                <div className={uplersStyle.calendarFilter}>
                                    <CalenderSVG style={{ height: '16px', marginRight: '16px' }} />
                                    <DatePicker
                                        style={{ backgroundColor: 'red' }}
                                        onKeyDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        className={uplersStyle.dateFilter}
                                        placeholderText="Start date - End date"
                                        selected={startDate}
                                        onChange={onCalenderFilter}
                                        dateFormat='dd/MM/yyyy'
                                        startDate={startDate}
                                        endDate={endDate}
                                        selectsRange
                                    />
                                </div>
                            </div>
                        </>}

                        {dateModal === 'Months' && <>
                            <div className={uplersStyle.monthPicker} style={{ padding: '0' }}>
                                <div className={uplersStyle.monthGrid}>
                                    {MONTHS.map((m, i) => (
                                        <div
                                            key={m}
                                            className={`${uplersStyle.monthBox} ${selectedMonths.includes(i) ? uplersStyle.selected : ""}`}
                                            onClick={() => toggleMonth(i)}
                                        >
                                            {m}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={uplersStyle.calendarFilterSet}>
                                <div className={uplersStyle.label}>Year</div>
                                <div className={`${uplersStyle.calendarFilter} ${uplersStyle.calendarFilterYear}`}>
                                    <CalenderSVG style={{ height: "16px", marginRight: "8px" }} />
                                    <DatePicker
                                        onKeyDown={(e) => e.preventDefault()}
                                        className={uplersStyle.dateFilter}
                                        placeholderText="Year"
                                        selected={monthDate}
                                        onChange={(date) => setMonthDate(date)}
                                        dateFormat="yyyy"
                                        showYearPicker
                                        yearItemNumber={9}
                                    />
                                </div>
                            </div>
                        </>}



                    </div>
                </div>
            </div>

            <div className={uplersStyle.filterContainer}>
                <div className={uplersStyle.filterSets} style={{ justifyContent: 'flex-start', gap: '10px' }}>
                    <Tooltip title={"View Green Feedback"}>
                        <div
                            className={uplersStyle.filterType}
                            key={"View Green Feedback"}
                            style={{
                                borderBottom:
                                    tableFilteredState?.filterFields_OnBoard
                                        ?.SummaryFilterOption === "GF"
                                        ? "6px solid #FFDA30"
                                        : "",
                            }}
                            onClick={() =>
                                setTableFilteredState((prev) => ({
                                    ...prev,
                                    filterFields_OnBoard: {
                                        ...prev.filterFields_OnBoard,
                                        SummaryFilterOption: "GF",
                                    },
                                }))
                            }
                        >
                            <img src={FeedBack} alt="rocket" />
                            <h2>
                                Green Feedback :{" "}
                                <span>
                                    {feedbackListData[0]?.totalGreenFeedback
                                        ? feedbackListData[0]?.totalGreenFeedback
                                        : 0}
                                </span>
                            </h2>
                        </div>
                    </Tooltip>

                    <Tooltip title={"View Amber Feedback"}>
                        <div
                            className={uplersStyle.filterType}
                            key={"Amber Feedback"}
                            style={{
                                borderBottom:
                                    tableFilteredState?.filterFields_OnBoard
                                        ?.SummaryFilterOption === "AF"
                                        ? "6px solid #FFDA30"
                                        : "",
                            }}
                            onClick={() =>
                                setTableFilteredState((prev) => ({
                                    ...prev,
                                    filterFields_OnBoard: {
                                        ...prev.filterFields_OnBoard,
                                        SummaryFilterOption: "AF",
                                    },
                                }))
                            }
                        >
                            <img src={LostEng} alt="rocket" />
                            <h2>
                                Amber Feedback :{" "}
                                <span>
                                    {feedbackListData[0]?.totalAmberFeedback
                                        ? feedbackListData[0]?.totalAmberFeedback
                                        : 0}
                                </span>
                            </h2>
                        </div>
                    </Tooltip>



                    <Tooltip title={"View Red Feedback"}>
                        <div
                            className={uplersStyle.filterType}
                            key={"View Red Feedback"}
                            style={{
                                borderBottom:
                                    tableFilteredState?.filterFields_OnBoard
                                        ?.SummaryFilterOption === "RF"
                                        ? "6px solid #FFDA30"
                                        : "",
                            }}

                            onClick={() =>
                                setTableFilteredState((prev) => ({
                                    ...prev,
                                    filterFields_OnBoard: {
                                        ...prev.filterFields_OnBoard,
                                        SummaryFilterOption: "RF",
                                    },
                                }))
                            }
                        >
                            <img src={TicketImg} alt="rocket" />
                            <h2>
                                Red Feedback :{" "}
                                <span>
                                    {feedbackListData[0]?.totalRedFeedback
                                        ? feedbackListData[0]?.totalRedFeedback
                                        : 0}
                                </span>
                            </h2>
                        </div>
                    </Tooltip>


                </div>

                {isLoading ? (
                    <TableSkeleton />
                ) : (

                    <Table
                        scroll={{ y: "100vh", x: "max-content" }}
                        id="hrListingTable"
                        columns={tableColumns}
                        bordered={false}
                        dataSource={feedbackListData}
                        pagination={false}
                    // pagination={
                    //   {
                    //     onChange: (pageNum, pageSize) => {
                    //         setPageIndex(pageNum);
                    //         setPageSize(pageSize);
                    //     },
                    //     size: 'small',
                    //     pageSize: pageSize,
                    //     pageSizeOptions: pageSizeOptions,
                    //     total: totalRecords,
                    //     showTotal: (total, range) =>
                    //         `${range[0]}-${range[1]} of ${totalRecords} items`,
                    //     defaultCurrent: pageIndex,
                    //   }
                    // }
                    />

                )}

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
                        hrFilterList={allHRConfig.hrFilterListConfig()}
                        filtersType={allEngagementConfig.clientFeedbackListFilterTypeConfig(
                            filtersList && filtersList
                        )}
                        clearFilters={clearFilters}
                    />
                </Suspense>
            )}

        </div>
    )
}

export default ClientFeedback