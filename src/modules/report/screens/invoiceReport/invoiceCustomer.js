import React, { useEffect, useMemo, useState } from "react";
import invoiceStyles from "./invoice.module.css";
import { ReactComponent as SearchSVG } from "assets/svg/search.svg";
import { ReactComponent as CloseSVG } from "assets/svg/close.svg";
import { InputType } from "constants/application";
import { Table } from "antd";
import { ReportDAO } from "core/report/reportDAO";
import { downloadToExcel } from "modules/report/reportUtils";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";

export default function InvoicCustomer() {
  const [searchText, setSearchText] = useState("");
  const [debounceText, setDebounceText] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [100, 200, 300, 500, 1000, 5000];
  const [customerList, setCustomerList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setSearchText(debounceText), 1000);
    return () => clearTimeout(timer);
  }, [debounceText]);

  const fetchCustomerList = async (pageIndex, pageSize) => {
    const payload = {
      pageIndex,
      pageSize,
      searchText,
    };
    setIsLoading(true);
    const response = await ReportDAO.getZohoInvoiceCustomerDAO(payload); 
    setIsLoading(false);
    if (response?.statusCode === 200) {
      setCustomerList(response.responseBody?.rows || []);
      setTotalCount(response.responseBody?.totalrows || 0);
    } else {
      setCustomerList([]);
    }
  };

  useEffect(() => {
    fetchCustomerList(pageIndex, pageSize);
  }, [pageIndex, pageSize, searchText]);

const columns = useMemo(() => [
  {
    title: "Customer ID",
    dataIndex: "customer_id",
    key: "customer_id",
    align: "left",
    width: "200px",
  },
  {
    title: "Email ID",
    dataIndex: "email",
    key: "email",
    align: "left",
    width: "220px",
  },
  {
    title: "Display Name",
    dataIndex: "display_name",
    key: "display_name",
    align: "left",
    width: "200px",
  },
  {
    title: "Company Name",
    dataIndex: "company_name",
    key: "company_name",
    align: "left",
    width: "200px",
  },
  {
    title: "UTS Company Name",
    dataIndex: "uts_company_name",
    key: "uts_company_name",
    align: "left",
    width: "200px",
  },
  {
    title: "Currency Code",
    dataIndex: "currency_code",
    key: "currency_code",
    align: "center",
    width: "120px",
  },
  {
    title: "Payment Terms",
    dataIndex: "payment_terms_label",
    key: "payment_terms_label",
    align: "center",
    width: "130px",
  },
  {
    title: "Total Records",
    dataIndex: "total_records",
    key: "total_records",
    align: "center",
    width: "130px",
  },
], []);


  const handleExport = (data) => {
    const exportData = data.map((item) => {
      let row = {};
      columns.forEach((col) => {
        if (col.key !== "action") {
          row[col.title] = item[col.key];
        }
      });
      return row;
    });
    downloadToExcel(exportData, "Invoice_Customer_Report.xlsx");
  };

  return (
    <div className={invoiceStyles.hiringRequestContainer}>
      <div className={invoiceStyles.addnewHR} style={{ margin: "0" }}>
        <div className={invoiceStyles.hiringRequest}>Invoice Customer</div>
      </div>

      <div className={invoiceStyles.filterContainer}>
        <div className={invoiceStyles.filterSets}>
          <div className={invoiceStyles.searchFilterSet}>
            <SearchSVG style={{ width: "16px", height: "16px" }} />
            <input
              type={InputType.TEXT}
              className={invoiceStyles.searchInput}
              placeholder="Search Customers"
              value={debounceText}
              onChange={(e) => setDebounceText(e.target.value)}
            />
            {debounceText && (
              <CloseSVG
                style={{
                  width: "16px",
                  height: "16px",
                  cursor: "pointer",
                }}
                onClick={() => setDebounceText("")}
              />
            )}
          </div>
          <div className={invoiceStyles.filterRight}>
            <button
              type="submit"
              className={invoiceStyles.btnPrimary}
              onClick={() => handleExport(customerList)}
            >
              Export
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <Table
          scroll={{ y: "480px" }}
          id="CustomerListingTable"
          columns={columns}
          dataSource={customerList}
          pagination={{
            onChange: (pageNum, size) => {
              setPageIndex(pageNum);
              setPageSize(size);
            },
            size: "small",
            pageSize: pageSize,
            pageSizeOptions: pageSizeOptions,
            total: totalCount,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${totalCount} items`,
            defaultCurrent: pageIndex,
          }}
        />
      )}
    </div>
  );
}
