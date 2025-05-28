import React, { useEffect, useMemo, useState } from "react";
import invoiceStyles from "./invoice.module.css";
import { ReactComponent as SearchSVG } from "assets/svg/search.svg";
import { ReactComponent as CloseSVG } from "assets/svg/close.svg";
import { InputType } from "constants/application";
import { Table, Modal, AutoComplete, Spin } from "antd";
import { ReportDAO } from "core/report/reportDAO";
import { downloadToExcel } from "modules/report/reportUtils";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import { MasterDAO } from "core/master/masterDAO";

export default function InvoicCustomer() {
  const [searchText, setSearchText] = useState("");
  const [debounceText, setDebounceText] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [100, 200, 300, 500, 1000, 5000];
  const [customerList, setCustomerList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const [companyAutoCompleteValue, setCompanyAutoCompleteValue] = useState("");
  const [companyNameSuggestion, setCompanyNameSuggestion] = useState([]);
  const [companyID, setCompanyID] = useState(null);

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

  const columns = useMemo(
    () => [
      {
        title: "Customer ID",
        dataIndex: "customer_ID",
        key: "customer_ID",
        align: "left",
        width: "200px",
      },
      {
        title: "Zoho Email ID",
        dataIndex: "emailID",
        key: "emailID",
        align: "left",
        width: "220px",
        render: (text) => (text ? text : "-"),
      },
      {
        title: "Zoho Customer",
        dataIndex: "display_Name",
        key: "display_Name",
        align: "left",
        width: "200px",
        render: (text) => (text ? text : "-"),
      },
      {
        title: "Zoho Company Name",
        dataIndex: "company_Name",
        key: "company_Name",
        align: "left",
        width: "200px",
        render: (text) => (text ? text : "-"),
      },
      {
        title: "UTS Company Name",
        dataIndex: "utS_CompanyName",
        key: "utS_CompanyName",
        align: "left",
        width: "200px",
        render: (text) => (text ? text : "-"),
        // render: (text, record) => {
        //   return (
        //     <span
        //       style={{ color: "#1890ff", cursor: "pointer" }}
        //       onClick={() => handleOpenModal(record)}
        //     >
        //       {text ? text : "Map UTS Company"}
        //     </span>
        //   );
        // },
      },
      {
        title: "Currency Code",
        dataIndex: "currency_Code",
        key: "currency_Code",
        align: "center",
        width: "120px",
        render: (text) => (text ? text : "-"),
      },
      {
        title: "Payment Terms",
        dataIndex: "payment_Terms_Label",
        key: "payment_Terms_Label",
        align: "center",
        width: "130px",
        render: (text) => (text ? text : "-"),
      },
    ],
    []
  );

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

  const getCompanyNameSuggestionHandler = async (companyName) => {
    setCompanyNameSuggestion([]);
    try {
      const response = await MasterDAO.getCompanySuggestionDAO(companyName);
      if (response?.statusCode === 200) {
        const suggestions = response.responseBody.map((item) => ({
          value: item.companyName,
          label: item.companyName,
          companyID: item.companyID,
        }));
        setCompanyNameSuggestion(suggestions);
      } else {
        setCompanyNameSuggestion([]);
      }
    } catch (error) {
      console.error("Company search failed", error);
      setCompanyNameSuggestion([]);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (companyAutoCompleteValue) {
        getCompanyNameSuggestionHandler(companyAutoCompleteValue);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [companyAutoCompleteValue]);

  const handleOpenModal = (record) => {
    setSelectedRecord(record);
    setSelectedCompany(null);
    setCompanyAutoCompleteValue("");
    setCompanyNameSuggestion([]);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
    setSelectedCompany(null);
    setCompanyAutoCompleteValue("");
    setCompanyNameSuggestion([]);
  };

  const handleSaveCompany = () => {
    if (selectedRecord && selectedCompany) {
      console.log("Saving company:", selectedCompany, "for:", selectedRecord);
      const updatedList = customerList.map((item) =>
        item.customer_ID === selectedRecord.customer_ID
          ? { ...item, utS_CompanyName: selectedCompany }
          : item
      );
      setCustomerList(updatedList);
    }
    handleCloseModal();
  };

  return (
    <div className={invoiceStyles.hiringRequestContainer}>
      <div className={invoiceStyles.addnewHR} style={{ margin: "0" }}>
        <div className={invoiceStyles.hiringRequest}> Zoho Customers</div>
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

      <Modal
        title={`Map UTS Company - ${selectedRecord?.customer_ID}`}
        open={isModalOpen}
        footer={null}
        onCancel={handleCloseModal}
        centered
      >
        <AutoComplete
          style={{ width: "100%" }}
          placeholder="Search and select a company"
          value={companyAutoCompleteValue}
          options={companyNameSuggestion}
          onSearch={setCompanyAutoCompleteValue}
          onSelect={(value, option) => {
            setCompanyAutoCompleteValue(value);
            setSelectedCompany(option.label);
            setCompanyID(option.companyID);
          }}
          filterOption={false}
        />

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button className={invoiceStyles.btnPrimary} onClick={handleSaveCompany}>
            {isLoading ? <Spin size="small" /> : "Save"}
          </button>
          <button
            className={invoiceStyles.btnCancle}
            onClick={handleCloseModal}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}
