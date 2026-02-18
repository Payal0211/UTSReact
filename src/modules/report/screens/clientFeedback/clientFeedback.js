import React, { useState, useEffect, Suspense } from "react";
import uplersStyle from "../uplersReport/uplersReport.module.css";
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
import FeedBack from "assets/svg/feedbackReceived.png";
import Handshake from "assets/svg/handshake.svg";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import Diamond from "assets/svg/diamond.svg";
import { ReportDAO } from "core/report/reportDAO";
import { HTTPStatusCode } from "constants/network";
import { useNavigate } from "react-router-dom";
import UTSRoutes from "constants/routes";
import DatePicker from "react-datepicker";
import moment from "moment";
import { All_Hiring_Request_Utils } from "shared/utils/all_hiring_request_util";
import { size } from "lodash";
import { IoMdAddCircle } from "react-icons/io";
import { IoChatboxEllipses } from "react-icons/io5";
import { IconContext } from "react-icons";
import { ReactComponent as SearchSVG } from 'assets/svg/search.svg';
import { TaDashboardDAO } from "core/taDashboard/taDashboardDRO";
import spinGif from "assets/gif/RefreshLoader.gif";
import Editor from "modules/hiring request/components/textEditor/editor";
import { UserSessionManagementController } from "modules/user/services/user_session_services";


const { Title, Text } = Typography;


function ClientFeedback() {
    const [debouncedSearchSourceCategory, setDebouncedSearchSourceCategory] = useState('');
        const [startDate, setStartDate] = useState(null);
        const [endDate, setEndDate] = useState(null);
     const [monthDate, setMonthDate] = useState(new Date());
        const today = new Date()
        const selectedYear = monthDate.getFullYear();
            const [selectedMonths, setSelectedMonths] = useState([])
const [dateModal,setDateModal] = useState("Months")
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

            const debouncedSearchSourceCategoryHandler = (e) => {
        if(e.target.value.length > 3 || e.target.value === ''){
            setTimeout(()=>{
                // setTableFilteredState(prevState => ({
                // ...prevState,
                // pagenumber:1,
                // filterFields_Client: {
                // ...prevState.filterFields_Client,
                // SearchSourceCategory:e.target.value,
                // }
                // }));  
            },2000)         
        }           
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
       
  return (
       <div className={uplersStyle.hiringRequestContainer}>
            <div className={uplersStyle.filterContainer}>
                <div className={uplersStyle.filterSets} style={{flexDirection:'column', gap:'5px', alignItems:'start'}}>
                    <div className={uplersStyle.filterSetsInner}>
                    <Title level={3} style={{ margin: 0 }}>
                      {/* {`${today?.toLocaleString("default", {
                        month: "long",
                      })} ${selectedYear}`} */}
                      Client Feedback
                    </Title>
                  </div>
                    <div className={uplersStyle.filterRight} style={{ flexWrap: 'nowrap', gap: '5px' }}>
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
                       <Radio.Group
                                                  onChange={(e) => {
                                                      setDateModal(e.target.value);
                                                      
                      
                                                      //  setEngagementType(e.target.value);
                                                  }}
                                                  value={dateModal}
                                              >
                                                  <Radio value={"Months"}>Months</Radio>
                                                  <Radio value={"Date Range"}>Date Range</Radio>
                                              </Radio.Group>

                        {dateModal === 'Months' && <>
                           <div className={uplersStyle.monthPicker} style={{padding:'0'}}>
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
                     
                    </div>
                </div>
            </div>
        </div>
  )
}

export default ClientFeedback