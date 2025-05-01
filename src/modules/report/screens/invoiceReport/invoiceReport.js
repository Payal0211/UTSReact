import React, { useEffect, useMemo, useState } from "react";
import invoiceStyles from "./invoice.module.css";
import { ReactComponent as SearchSVG } from "assets/svg/search.svg";
import { ReactComponent as CloseSVG } from "assets/svg/close.svg";
import { InputType } from "constants/application";
import { Tabs, Select, Table, Modal, Tooltip } from "antd";
import { ReportDAO } from "core/report/reportDAO";
import { downloadToExcel } from "modules/report/reportUtils";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import { Link } from "react-router-dom";

export default function InvoiceReport() {
  const [openTicketSearchText, setopenTicketSearchText] = useState("");
  const [openTicketDebounceText, setopenTicketDebounceText] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [100, 200, 300, 500, 1000, 5000];
  const [invoicetList, setinvoicetList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [invoicetListDataCount, setinvoicetListDataCount] = useState(0);
  const tableColumnsMemo = useMemo(() => {
    return [
      {
        title: "Invoice #",
        dataIndex: "invoice_number",
        key: "invoice_number",
        align: "left",
        width: "100px",
        render: (text, result) => ( 
           <a
           rel="noreferrer"
           href={
             result?.invoiceURL
           }
           style={{ textDecoration: "underline" }}
           target="_blank"
         >
          {text}
         </a>
        ),
      },
      {
        title: "Date",
        dataIndex: "invoice_date",
        key: "invoice_date",
        align: "left",
        width: "80px",
      },
      {
        title: "Due Date",
        dataIndex: "due_date",
        key: "due_date",
        align: "left",
        width: "80px",
      },
      {
        title: "Company ",
        dataIndex: "company_name",
        key: "company_name",
        align: "left",
        width: "120px",
      },

      {
        title: "Customer ",
        dataIndex: "customer_name",
        key: "customer_name",
        align: "left",
        width: "100px",
      },

      {
        title: "Status",
        dataIndex: "invoiceStatus",
        key: "invoiceStatus",
        align: "left",
        width: "60px",
      },
      {
        title: "Amount",
        dataIndex: "invoice_amount",
        key: "invoice_amount",
        align: "left",
        width: "100px",
        render: (text, result) => {
          return `${result.currency_code}  ${text}`;
        },
      },

      {
        title: "Payment Term",
        dataIndex: "payment_Term",
        key: "payment_Term",
        align: "left",
        width: "80px",
      },
      {
        title: "Sales Person",
        dataIndex: "salesperson_name",
        key: "salesperson_name",
        align: "left",
        width: "160px",
      },
    ];
  }, [invoicetList]);

  useEffect(() => {
    const timer = setTimeout(
      () => setopenTicketSearchText(openTicketDebounceText),
      1000
    );
    return () => clearTimeout(timer);
  }, [openTicketDebounceText]);

  const getInvoiceTicketsFromPagination = async (pageIndex, pageSize) => {
    let Payload = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      searchText: openTicketSearchText,
    };
setLoading(true)
    const zohoResult = await ReportDAO.getZohoInvoiceDAO(Payload);
    setLoading(false)
    console.log("result ", zohoResult);
    if (zohoResult?.statusCode === 200) {
      setinvoicetList(zohoResult.responseBody?.rows);
      setinvoicetListDataCount(zohoResult.responseBody?.totalrows);
    } else if (zohoResult?.statusCode === 404) {
      setinvoicetList([]);
    }
  };

  useEffect(() => {
    getInvoiceTicketsFromPagination(pageIndex, pageSize);
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
        <div className={invoiceStyles.hiringRequest}>Invoice Report</div>
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
              onClick={() => handleExport(invoicetList)}
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
        dataSource={invoicetList}
        pagination={{
          onChange: (pageNum, pageSize) => {
            setPageIndex(pageNum);
            setPageSize(pageSize);
            // getInvoiceTicketsFromPagination(pageNum, pageSize);
          },
          size: "small",
          pageSize: pageSize,
          pageSizeOptions: pageSizeOptions,
          total: invoicetListDataCount,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${invoicetListDataCount} items`,
          defaultCurrent: pageIndex,
        }}
      />
      }

    
    </div>
  );
}
