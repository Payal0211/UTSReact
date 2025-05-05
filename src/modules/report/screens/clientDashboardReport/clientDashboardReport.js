import React, { useEffect, useMemo, useState, useCallback } from "react";
import clientDashboardStyles from "./clientDashboard.module.css";
import { ReactComponent as SearchSVG } from "assets/svg/search.svg";
import { ReactComponent as CloseSVG } from "assets/svg/close.svg";
import { InputType } from "constants/application";
import { Tabs, Select, Table, Modal, Tooltip } from "antd";
import { ReportDAO } from "core/report/reportDAO";
import { downloadToExcel } from "modules/report/reportUtils";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import ClientReportStyle from "../clientReport/clientReport.module.css";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import DatePicker from "react-datepicker";

export default function ClientDashboardReport() {  
  const [clientData, setClientData] = useState([]);
  const [isLoading, setLoading] = useState(false); 
  const [openTicketDebounceText, setopenTicketDebounceText] = useState("");
  const [openTicketSearchText, setopenTicketSearchText] = useState("");
  const today = new Date();
  const aWeekAgo = new Date();
  aWeekAgo.setDate(today.getDate() - 7);
  
  const [startDate, setStartDate] = useState(aWeekAgo);
  const [endDate, setEndDate] = useState(today);
  
  const [dateError, setDateError] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [100, 200, 300, 500, 1000, 5000];
  const [listDataCount, setListDataCount] = useState(0);

  var date = new Date();

  const tableColumnsMemo = useMemo(() => {
    return [
        {
            title: "Client",
            dataIndex: "client",
            key: "client",
            align: "left",
            width: "200px",
            fixed: "left",
            render: (text, row) => {
              return text === "Total" ? "" : text;
            },
          },
          
      {
        title: "HR ID",
        dataIndex: "hrNumber",
        key: "hrNumber",
        align: "left",
        width: "180px",
        fixed: "left",
      },
      {
        title: "Recruiter",
        dataIndex: "recruiter",
        key: "recruiter",
        align: "left",
        width: "150px",
         fixed: "left",
      },
      {
        title: "AI Interview",
        dataIndex: "aiInterview",
        key: "aiInterview",
        align: "center",
        width: "120px",
      },
      {
        title: "Total Profiles",
        dataIndex: "totalProfiles",
        key: "totalProfiles",
        align: "center",
        width: "130px",
      },
      {
        title: "Profiles",
        dataIndex: "profiles",
        key: "profiles",
        align: "center",
        width: "100px",
      },
      {
        title: "Duplicate",
        dataIndex: "duplicate",
        key: "duplicate",
        align: "center",
        width: "100px",
      },
      {
        title: "Screen Reject",
        dataIndex: "screenReject",
        key: "screenReject",
        align: "center",
        width: "130px",
      },
      {
        title: "Assessment",
        dataIndex: "assessment",
        key: "assessment",
        align: "center",
        width: "120px",
      },
      {
        title: "Interviews Done",
        dataIndex: "interviewsDone",
        key: "interviewsDone",
        align: "center",
        width: "140px",
      },
      {
        title: "R1 Interview",
        dataIndex: "r1Interview",
        key: "r1Interview",
        align: "center",
        width: "120px",
      },
      {
        title: "R1 Reject",
        dataIndex: "r1InterviewReject",
        key: "r1InterviewReject",
        align: "center",
        width: "100px",
      },
      {
        title: "R2 Interview",
        dataIndex: "r2Interview",
        key: "r2Interview",
        align: "center",
        width: "120px",
      },
      {
        title: "R2 Reject",
        dataIndex: "r2InterviewReject",
        key: "r2InterviewReject",
        align: "center",
        width: "100px",
      },
      {
        title: "R3 Interview",
        dataIndex: "r3Interview",
        key: "r3Interview",
        align: "center",
        width: "120px",
      },
      {
        title: "R3 Reject",
        dataIndex: "r3InterviewReject",
        key: "r3InterviewReject",
        align: "center",
        width: "100px",
      },
      {
        title: "Offer",
        dataIndex: "offer",
        key: "offer",
        align: "center",
        width: "100px",
      },
      {
        title: "Offer Declined",
        dataIndex: "offerDeclined",
        key: "offerDeclined",
        align: "center",
        width: "140px",
      },
      {
        title: "Pre-Onboarding",
        dataIndex: "preOnboarding",
        key: "preOnboarding",
        align: "center",
        width: "140px",
      },
      {
        title: "Joined",
        dataIndex: "joined",
        key: "joined",
        align: "center",
        width: "100px",
      },
      {
        title: "Joined & Left",
        dataIndex: "joinedandLeft",
        key: "joinedandLeft",
        align: "center",
        width: "140px",
      },
      {
        title: "Position Lost",
        dataIndex: "positionLost",
        key: "positionLost",
        align: "center",
        width: "130px",
      },
      {
        title: "On Hold",
        dataIndex: "onHold",
        key: "onHold",
        align: "center",
        width: "100px",
      },
    ];
  }, [clientData]);
  

  const getClientDashboardReport = async () => {
    let payload = {
        "searchText": openTicketSearchText,
        "fromDate": startDate.toLocaleDateString("en-US"),
        "toDate": endDate.toLocaleDateString("en-US"),
        "pageIndex": pageIndex,
        "pageSize": pageSize,
      };
    setLoading(true)
    const apiResult = await ReportDAO.getClientDashboardReportDAO(payload);
    setLoading(false)
    console.log("result ", apiResult);
    if (apiResult?.statusCode === 200) {        
        setClientData(apiResult.responseBody?.rows);        
        setListDataCount(apiResult.responseBody?.totalrows);      
    } else if (apiResult?.statusCode === 404) {
        setClientData([]);
    }
  }; 


  const onCalenderFilter = useCallback(
    async (dates) => {
      const [start, end] = dates;

      setStartDate(start);
      setEndDate(end);

      if (start.toLocaleDateString() === end.toLocaleDateString()) {
        let params = {
          fromDate: new Date(
            date.getFullYear(),
            date.getMonth() - 1,
            date.getDate()
          ),
          toDate: new Date(date),
        };
        setStartDate(params.fromDate);
        setEndDate(params.toDate);
        setDateError(true);
        setTimeout(() => setDateError(false), 5000);
        return;
      } else {
        if (start && end) {  
            let payload = {
                "searchText": openTicketSearchText,
                "fromDate": start.toLocaleDateString("en-US"),
                "toDate": start.toLocaleDateString("en-US"),
                "pageIndex": pageIndex,
                "pageSize": pageSize,
              };
            setLoading(true)
            const apiResult = await ReportDAO.getClientDashboardReportDAO(payload);
            setLoading(false)
            console.log("result ", apiResult);
            if (apiResult?.statusCode === 200) {        
                setClientData(apiResult.responseBody?.rows);        
                setListDataCount(apiResult.responseBody?.totalrows);      
            } else if (apiResult?.statusCode === 404) {
                setClientData([]);
            }
        }
      }
    },
    []
  );


  useEffect(() => {
    getClientDashboardReport();
  }, [pageIndex, pageSize, openTicketSearchText]);

  useEffect(() => {
    const timer = setTimeout(
      () => setopenTicketSearchText(openTicketDebounceText),
      1000
    );
    return () => clearTimeout(timer);
  }, [openTicketDebounceText]);

  return (
    <div className={clientDashboardStyles.hiringRequestContainer}>
      <div className={clientDashboardStyles.addnewHR} style={{ margin: "0" }}>
        <div className={clientDashboardStyles.hiringRequest}>Client Dashboard</div>
      </div>

      <div className={clientDashboardStyles.filterContainer}>
        <div className={clientDashboardStyles.filterSets}>
          <div className={clientDashboardStyles.searchFilterSet}>
            <SearchSVG style={{ width: "16px", height: "16px" }} />
            <input
              type={InputType.TEXT}
              className={clientDashboardStyles.searchInput}
              placeholder="Search Table"
              value={openTicketDebounceText}
              onChange={(e) => {
                // setopenTicketSearchText(e.target.value);
                setopenTicketDebounceText(e.target.value);
              }}
            />
            {openTicketDebounceText && (
              <CloseSVG
                style={{
                  width: "16px",
                  height: "16px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  //   setopenTicketSearchText("");
                  setopenTicketDebounceText("");
                }}
              />
            )}
          </div>

         
              <div className={ClientReportStyle.calendarFilter}>
                <CalenderSVG style={{ height: "16px", marginRight: "16px" }} />
                <DatePicker
                  style={{ backgroundColor: "red" }}
                  onKeyDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className={ClientReportStyle.dateFilter}
                  placeholderText="Start date - End date"
                  selected={startDate}
                  onChange={onCalenderFilter}
                  startDate={startDate}
                  endDate={endDate}
                  maxDate={new Date()}
                  selectsRange
                />
              </div>

          {/* <div className={clientDashboardStyles.filterRight}>
            <button
              type="submit"
              className={clientDashboardStyles.btnPrimary}
              onClick={() => handleExport(clientData)}
            >
              Export
            </button>
          </div> */}
        </div>
      </div>

      {isLoading ? <TableSkeleton /> :
        <Table
        scroll={{ y: "480px" }}
        id="TicketsOpenListingTable"
        columns={tableColumnsMemo}
        bordered={false}
        dataSource={clientData}   
        rowClassName={(row, index) => {
            return row.client === 'Total' ? clientDashboardStyles["highlight-total-row"] : '';
          }}   
          pagination={{
            onChange: (pageNum, pageSize) => {
              setPageIndex(pageNum);
              setPageSize(pageSize);
              // getInvoiceTicketsFromPagination(pageNum, pageSize);
            },
            size: "small",
            pageSize: pageSize,
            pageSizeOptions: pageSizeOptions,
            total: listDataCount,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${listDataCount} items`,
            defaultCurrent: pageIndex,
          }}  
      />
      }

    
    </div>
  );
}
