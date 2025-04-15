import React, { useEffect, useMemo, useState } from "react";
import invoiceStyles from "./invoice.module.css";
import { ReactComponent as SearchSVG } from "assets/svg/search.svg";
import { ReactComponent as CloseSVG } from "assets/svg/close.svg";
import { InputType } from "constants/application";
import { Tabs, Select, Table, Modal, Tooltip } from "antd";
import { ReportDAO } from "core/report/reportDAO";
import{Link} from 'react-router-dom'
import { downloadToExcel } from "modules/report/reportUtils";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";

export default function LeaveReport() {
  const [openTicketSearchText, setopenTicketSearchText] = useState("");
  const [openTicketDebounceText, setopenTicketDebounceText] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [100, 200, 300, 500, 1000, 5000];
  const [leaveList, setleaveList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [leaveListDataCount, setleaveListDataCount] = useState(0);
  const tableColumnsMemo = useMemo(() => {
    return [
      {
             title: "Engagement ID / HR #",
             dataIndex: "engagemenID",
             key: "engagemenID",
             align: "left",
             width: "200px",
             render: (text, item) => {
               return (
                 <>
                  <Link
                   to={`/viewOnboardDetails/${item.onBoardID}/${
                     item.isOngoing === "Ongoing" ? true : false
                   }`}
                   target="_blank"
                   style={{
                     color: `var(--uplers-black)`,
                     textDecoration: "underline",
                   }}
                 >
                   {item.engagemenID}
                 </Link> <br/>
                 /<Link
                   to={`/allhiringrequest/${item.hrid}`}
                   target="_blank"
                   style={{ color: "#006699", textDecoration: "underline" }}
                 >
                   {item.hR_Number}
                 </Link>
                 </>
                
               );
             },
           },
           {
            title: "Client",
            dataIndex: "client",
            key: "client",
            align: "left",
            width: "150px",
          },
          {
            title: "Talent",
            dataIndex: "talentName",
            key: "talentName",
            align: "left",
            width: "150px"            
          },
          {
            title: "Talent Email",
            dataIndex: "talentEmailID",
            key: "talentEmailID",
            align: "left",
            width: "180px"            
          },
      {
        title: "Apply Date",
        dataIndex: "leaveApplyDate",
        key: "leaveApplyDate",
        align: "left",
        width: "120px",
      },
      {
        title: "Leave Date",
        dataIndex: "leaveDate",
        key: "leaveDate",
        align: "left",
        width: "200px",
      },
      {
        title: "Leave Duration ",
        dataIndex: "leaveDuration",
        key: "leaveDuration",
        align: "left",
        width: "120px",
      },

      {
        title: "Reason",
        dataIndex: "leaveReason",
        key: "leaveReason",
        align: "left",
        width: "150px",
      },

      {
        title: "Status",
        dataIndex: "leaveStatus",
        key: "leaveStatus",
        align: "left",
        width: "120px",
      },
      {
        title: "Approved/Rejected Date",
        dataIndex: "rejectedDate",
        key: "rejectedDate",
        align: "left",
        width: "200px",
        render: (text, item) => {
          const dateToShow = item.rejectedDate ?? item.approvedDate;
          return `${dateToShow ? dateToShow : ""}`;
        },
      },
    ];
  }, [leaveList]);

  useEffect(() => {
    const timer = setTimeout(
      () => setopenTicketSearchText(openTicketDebounceText),
      1000
    );
    return () => clearTimeout(timer);
  }, [openTicketDebounceText]);

  const getLeaveFromPagination = async (pageIndex, pageSize) => {
    let Payload = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      searchText: openTicketSearchText,
    };
setLoading(true)
    const zohoResult = await ReportDAO.getLeaveTakenDAO(Payload);
    setLoading(false)
    console.log("result ", zohoResult);
    if (zohoResult?.statusCode === 200) {
      setleaveList(zohoResult.responseBody?.rows);
      setleaveListDataCount(zohoResult.responseBody?.totalrows);
    } else if (zohoResult?.statusCode === 404) {
      setleaveList([]);
    }
  };

  useEffect(() => {
    getLeaveFromPagination(pageIndex, pageSize);
  }, [pageIndex, pageSize, openTicketSearchText]);

  const handleExport = (data) => {
    let DataToExport = data.map((data) => {
      let obj = {};
      tableColumnsMemo.forEach((val) => {
        if (val.key !== "action") {
          if (val.key === "invoice_amount") {
            obj[
              `${val.title}`
            ] = `${data.currency_code} ${data.invoice_amount}`;
          } else {
            obj[`${val.title}`] = data[`${val.key}`];
          }
        }
      });
      return obj;
    });
    downloadToExcel(DataToExport, "Invoice_Report.xlsx");
  };

  return (
    <div className={invoiceStyles.hiringRequestContainer}>
      <div className={invoiceStyles.addnewHR} style={{ margin: "0" }}>
        <div className={invoiceStyles.hiringRequest}>Leave Report</div>
      </div>

      <div className={invoiceStyles.filterContainer}>
        <div className={invoiceStyles.filterSets}>
          <div className={invoiceStyles.searchFilterSet}>
            <SearchSVG style={{ width: "16px", height: "16px" }} />
            <input
              type={InputType.TEXT}
              className={invoiceStyles.searchInput}
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
          <div className={invoiceStyles.filterRight}>
            <button
              type="submit"
              className={invoiceStyles.btnPrimary}
              onClick={() => handleExport(leaveList)}
            >
              Export
            </button>
          </div>
        </div>
      </div>

      {isLoading ? <TableSkeleton /> :
        <Table
        scroll={{ y: "480px" }}
        id="TicketsOpenListingTable"
        columns={tableColumnsMemo}
        bordered={false}
        dataSource={leaveList}
        pagination={{
          onChange: (pageNum, pageSize) => {
            setPageIndex(pageNum);
            setPageSize(pageSize);
            // getInvoiceTicketsFromPagination(pageNum, pageSize);
          },
          size: "small",
          pageSize: pageSize,
          pageSizeOptions: pageSizeOptions,
          total: leaveListDataCount,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${leaveListDataCount} items`,
          defaultCurrent: pageIndex,
        }}
      />
      }

    
    </div>
  );
}
