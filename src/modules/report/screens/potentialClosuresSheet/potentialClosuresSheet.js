import React, { useEffect, useState, useCallback, Suspense } from "react";
import { Table, Card, Select, Input, Tabs, Dropdown, Menu } from "antd";
import pcsStyles from "./potentialClosuresSheet.module.css";
import { ReportDAO } from "core/report/reportDAO";
import moment from "moment";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import { All_Hiring_Request_Utils } from "shared/utils/all_hiring_request_util";
import Diamond from "assets/svg/diamond.svg";
import TabPane from "antd/lib/tabs/TabPane";
import { downloadToExcel } from "modules/report/reportUtils";
import { ReactComponent as SearchSVG } from "assets/svg/search.svg";
import { ReactComponent as CloseSVG } from "assets/svg/close.svg";
import { InputType } from "constants/application";
import { IoChevronDownOutline } from "react-icons/io5";
import { ReactComponent as FunnelSVG } from "assets/svg/funnel.svg";
import { allHRConfig } from "modules/hiring request/screens/allHiringRequest/allHR.config";
import { HTTPStatusCode } from "constants/network";
import { hiringRequestDAO } from "core/hiringRequest/hiringRequestDAO";

const AllClientFiltersLazy = React.lazy(() =>
  import("modules/allClients/components/allClients/allClientsFilter")
);

const { Option } = Select;
let defaaultFilterState = {
  filterFields_Client: {
    hrStatus: null,
    leadUserId: null,
    salesRep: null,
    HRType: null,
    team: null,
    searchText: "",
  },
};

export default function PotentialClosuresSheet() {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("G");
  const [openTicketDebounceText, setopenTicketDebounceText] = useState("");
  const [openTicketSearchText, setopenTicketSearchText] = useState("");
  const [pageSize, setPageSize] = useState(100);
  const pageSizeOptions = [100, 200, 300, 500, 1000, 5000];
  const [isAllowFilters, setIsAllowFilters] = useState(false);
  const [getHTMLFilter, setHTMLFilter] = useState(false);
  const [filteredTagLength, setFilteredTagLength] = useState(0);
  const [appliedFilter, setAppliedFilters] = useState(new Map());
  const [checkedState, setCheckedState] = useState(new Map());
  const [filtersList, setFiltersList] = useState([]);
  const [tableFilteredState, setTableFilteredState] =
    useState(defaaultFilterState);
  const columns = [
    {
      title: <div style={{ textAlign: "center" }}>Team</div>,
      dataIndex: "hR_Team",
      key: "hR_Team",
      fixed: "left",
      width: 100,
      className: pcsStyles.headerCell,
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          Date <br /> Created
        </div>
      ),
      dataIndex: "createdByDatetime",
      key: "createdByDatetime",
      fixed: "left",
      width: 110,
      className: pcsStyles.headerCell,
      render: (text) => (text ? moment(text).format("DD/MM/YYYY") : "-"),
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          Open
          <br />
          since how <br /> many
          <br /> days
        </div>
      ),
      dataIndex: "hrOpenSinceDays",
      key: "hrOpenSinceDays",
      fixed: "left",
      width: 90,
      align: "center",
      className: pcsStyles.headerCell,
    },
    {
      title: <div style={{ textAlign: "center" }}>HR ID</div>,
      dataIndex: "hR_Number",
      key: "hR_Number",
      width: 150,
      fixed: "left",
      className: pcsStyles.headerCell,
      render: (text, result) =>
        text ? (
          <a
            href={`/allhiringrequest/${result.hiringRequest_ID}`}
            style={{ textDecoration: "underline" }}
            target="_blank"
            rel="noreferrer"
          >
            {text}
          </a>
        ) : (
          text
        ),
    },
    {
      title: <div style={{ textAlign: "center" }}>HR Status</div>,
      dataIndex: "hrStatus",
      key: "hrStatus",
      fixed: "left",
      className: pcsStyles.headerCell,
      width: "180px",
      render: (_, param) =>
        All_Hiring_Request_Utils.GETHRSTATUS(
          param?.hrStatusCode,
          param?.hrStatus
        ),
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          Engagement <br /> Model
        </div>
      ),
      dataIndex: "hrModel",
      key: "hrModel",
      width: 120,
      fixed: "left",
      className: pcsStyles.headerCell,
    },
    {
      title: <div style={{ textAlign: "center" }}>Sales Rep</div>,
      dataIndex: "salesPerson",
      key: "salesPerson",
      width: 150,
      fixed: "left",
      className: pcsStyles.headerCell,
    },
    {
      title: <div style={{ textAlign: "center" }}>Company</div>,
      dataIndex: "company",
      key: "company",
      width: 150,
      fixed: "left",
      className: pcsStyles.headerCell,
      render: (text, record) =>
        record?.companyCategory === "Diamond" ? (
          <>
            <span>{text}</span>
            &nbsp;
            <img
              src={Diamond}
              alt="info"
              style={{ width: "16px", height: "16px" }}
            />
          </>
        ) : (
          text
        ),
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          Company
          <br />
          Size
        </div>
      ),
      dataIndex: "companySize",
      key: "companySize",
      width: 90,
      className: pcsStyles.headerCell,
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          Product /<br />
          Non Product
        </div>
      ),
      dataIndex: "productType",
      key: "productType",
      width: 120,
      align: "center",
      render: (value, record, index) =>
        renderYesNoSelect(
          value,
          record,
          index,
          "productType",
          handleFieldChange
        ),
    },
    {
      title: <div style={{ textAlign: "center" }}>Position</div>,
      dataIndex: "position",
      key: "position",
      width: 180,
    },
    {
      title: <div style={{ textAlign: "center" }}>Potential</div>,
      dataIndex: "potentialType",
      key: "potentialType",
      width: 100,
      align: "center",
      render: (value, record, index) =>
        renderYesNoSelect(
          value,
          record,
          index,
          "potentialType",
          handleFieldChange
        ),
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          Closure by
          <br />
          Weekend
        </div>
      ),
      dataIndex: "closurebyWeekend",
      key: "closurebyWeekend",
      width: 100,
      align: "center",
      render: (value, record, index) =>
        renderInputField(
          value,
          record,
          index,
          "closurebyWeekend",
          handleFieldChange
        ),
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          Closure by
          <br />
          EOM
        </div>
      ),
      dataIndex: "closurebyMonth",
      key: "closurebyMonth",
      width: 100,
      align: "center",
      render: (value, record, index) =>
        renderInputField(
          value,
          record,
          index,
          "closurebyMonth",
          handleFieldChange
        ),
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          Number of
          <br />
          TRs
        </div>
      ),
      dataIndex: "noofTR",
      key: "noofTR",
      width: 100,
      align: "center",
      className: pcsStyles.headerCell,
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          Average Value
          <br />
          (USD)
        </div>
      ),
      dataIndex: "averageValue",
      key: "averageValue",
      width: 120,
      align: "right",
      className: pcsStyles.headerCell,
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          Talent Pay Rate/ <br />
          Client Budget
        </div>
      ),
      dataIndex: "talentPayStr",
      key: "talentPayStr",
      width: 280,
      className: pcsStyles.headerCell,
    },
    {
      title: <div style={{ textAlign: "center" }}>Uplers Fees %</div>,
      dataIndex: "uplersFeesPer",
      key: "uplersFeesPer",
      width: 120,
      align: "center",
      className: pcsStyles.headerCell,
    },
    {
      title: <div style={{ textAlign: "center" }}>Uplers Fees</div>,
      dataIndex: "uplersFeeStr",
      key: "uplersFeeStr",
      width: 150,
      align: "left",
      className: pcsStyles.headerCell,
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          Above 35
          <br /> LPA
        </div>
      ),
      dataIndex: "above35LPA",
      key: "above35LPA",
      width: 100,
      align: "center",
      className: pcsStyles.headerCell,
    },
    {
      title: <div style={{ textAlign: "center" }}>Lead</div>,
      dataIndex: "leadType",
      key: "leadType",
      width: 100,
      align: "center",
      className: pcsStyles.headerCell,
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setopenTicketSearchText(openTicketDebounceText);
    }, 1000);
    return () => clearTimeout(timer);
  }, [openTicketDebounceText]);

  useEffect(() => {
    fetchPotentialClosuresListData(activeTab);
  }, [activeTab, openTicketSearchText, tableFilteredState]);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const fetchPotentialClosuresListData = async (businessType) => {
    let payload = {
      hR_BusinessType: businessType,
      searchText: openTicketSearchText,
      // "hrStatusIDs": "",
      modelType: "",
      hrStatus: tableFilteredState?.filterFields_Client?.hrStatus,
      leadUserId: tableFilteredState?.filterFields_Client?.leadUserId,
      salesRep: tableFilteredState?.filterFields_Client?.salesRep,
      HRType: tableFilteredState?.filterFields_Client?.HRType,
      team: tableFilteredState?.filterFields_Client?.team,
    };

    setLoading(true);
    const apiResult = await ReportDAO.PotentialClosuresListDAO(payload);
    setLoading(false);
    if (apiResult?.statusCode === 200) {
      setData(apiResult.responseBody);
    } else if (apiResult?.statusCode === 404) {
      setData([]);
    }
  };

  const renderYesNoSelect = (value, record, index, dataIndex, handleChange) => {
    return (
      <Select
        value={value}
        onChange={(newValue) =>
          handleChange(newValue, record, index, dataIndex)
        }
        style={{ width: "100%" }}
        size="small"
      >
        <Option value="Yes">Yes</Option>
        <Option value="No">No</Option>
      </Select>
    );
  };

  const renderInputField = (value, record, index, dataIndex, handleChange) => {
    return (
      <Input
        value={value}
        onChange={(e) => handleChange(e.target.value, record, index, dataIndex)}
        onBlur={() => {
          if (
            dataIndex === "closurebyWeekend" ||
            dataIndex === "closurebyMonth"
          ) {
            updatePotentialClosuresRowValue(data[index]);
          }
        }}
        style={{ width: "100%" }}
        size="small"
      />
    );
  };

  const handleFieldChange = (newValue, record, index, field) => {
    const updatedData = [...data];
    updatedData[index] = { ...record, [field]: newValue };
    setData(updatedData);

    if (field === "productType" || field === "potentialType") {
      updatePotentialClosuresRowValue(updatedData[index]);
    }
  };

  const updatePotentialClosuresRowValue = async (updatedData) => {
    const pl = {
      HRID: updatedData?.hiringRequest_ID,
      ProductType: updatedData?.productType,
      PotentialType: updatedData?.potentialType,
      ClosurebyWeekend: updatedData?.closurebyWeekend,
      ClosurebyMonth: updatedData?.closurebyMonth,
    };

    await ReportDAO.PotentialClosuresUpdateDAO(pl);
  };

  const handleExport = (apiData) => {
    let DataToExport = apiData.map((data) => {
      let obj = {};
      columns.forEach((val) => {
        obj[`${val.title}`] = data[`${val.key}`];
      });
      return obj;
    });
    downloadToExcel(DataToExport, "Potential_Closures_Report");
  };

  const toggleHRFilter = useCallback(() => {
    !getHTMLFilter
      ? setIsAllowFilters(true)
      : setTimeout(() => {
          setIsAllowFilters(true);
        }, 300);
    setHTMLFilter(!getHTMLFilter);
  }, [getHTMLFilter]);

  const clearFilters = useCallback(() => {
    setAppliedFilters(new Map());
    setCheckedState(new Map());
    setFilteredTagLength(0);
    setTableFilteredState(defaaultFilterState);
    setIsAllowFilters(false);
    setPageSize(100);
  }, [
    // handleHRRequest,
    setAppliedFilters,
    setCheckedState,
    setFilteredTagLength,
    setIsAllowFilters,
    setTableFilteredState,
    // tableFilteredState,
  ]);

  const onRemoveHRFilters = () => {
    setTimeout(() => {
      setIsAllowFilters(false);
    }, 300);
    setHTMLFilter(false);
  };

  const getHRFilterRequest = useCallback(async () => {
    const response = await hiringRequestDAO.getAllFilterDataForHRRequestDAO();
    if (response?.statusCode === HTTPStatusCode.OK) {
      setFiltersList(response && response?.responseBody?.details?.Data);
      // setHRTypesList(response && response?.responseBody?.details?.Data.hrTypes.map(i => ({id:i.text, value:i.value})))
    } else {
      return "NO DATA FOUND";
    }
  }, []);

  useEffect(() => {
    getHRFilterRequest();
  }, [getHRFilterRequest]);

  return (
    <div className={pcsStyles.snapshotContainer}>
      <div className={pcsStyles.addnewHR} style={{ margin: "0" }}>
        <div className={pcsStyles.hiringRequest}>Potential Closures List</div>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        style={{ marginBottom: 16, marginTop: 16 }}
        destroyInactiveTabPane={false}
        animated={true}
        tabBarGutter={50}
        tabBarStyle={{ borderBottom: `1px solid var(--uplers-border-color)` }}
      >
        <TabPane tab="Global" key="G" />
        <TabPane tab="India" key="I" />
      </Tabs>

      <div className={pcsStyles.filterContainer}>
        <div className={pcsStyles.filterSets}>
          <div className={pcsStyles.filterSetsInner}>
            <div className={pcsStyles.addFilter} onClick={toggleHRFilter}>
              <FunnelSVG style={{ width: "16px", height: "16px" }} />

              <div className={pcsStyles.filterLabel}>Add Filters</div>
              <div className={pcsStyles.filterCount}>{filteredTagLength}</div>
            </div>
            <p onClick={() => clearFilters()}>Reset Filters</p>
            <div
              className={pcsStyles.searchFilterSet}
              style={{ marginLeft: "10px" }}
            >
              <SearchSVG style={{ width: "16px", height: "16px" }} />
              <input
                type={InputType.TEXT}
                className={pcsStyles.searchInput}
                placeholder="Search here!"
                value={openTicketDebounceText}
                onChange={(e) => {
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
                    setopenTicketDebounceText("");
                  }}
                />
              )}
            </div>
          </div>

          <div className={pcsStyles.priorityFilterSet}>
            <div className={pcsStyles.label}>Showing</div>
            <div className={pcsStyles.paginationFilter}>
              <Dropdown
                trigger={["click"]}
                placement="bottom"
                overlay={
                  <Menu
                    onClick={(e) => {
                      setPageSize(parseInt(e.key));
                    }}
                  >
                    {pageSizeOptions.map((item) => {
                      return <Menu.Item key={item}>{item}</Menu.Item>;
                    })}
                  </Menu>
                }
              >
                <span>
                  {pageSize}
                  <IoChevronDownOutline
                    style={{
                      paddingTop: "5px",
                      fontSize: "16px",
                    }}
                  />
                </span>
              </Dropdown>
            </div>

            <div
              className={pcsStyles.paginationFilter}
              style={{ border: "none", width: "auto" }}
            >
              <button
                className={pcsStyles.btnPrimary}
                onClick={() => handleExport(data)}
              >
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <Card bordered={false}>
        <div>
          {isLoading ? (
            <TableSkeleton />
          ) : data?.length > 0 ? (
            <Table
              columns={columns}
              dataSource={data}
              bordered
              pagination={{
                pageSize: pageSize,
                pageSizeOptions: pageSizeOptions,
              }}
              size="middle"
              scroll={{ x: "max-content", y: 1000 }}
              rowClassName={(record, index) =>
                index % 2 === 0 ? pcsStyles.evenRow : pcsStyles.oddRow
              }
            />
          ) : (
            <Table columns={columns} dataSource={[]} bordered size="middle" />
          )}
        </div>
      </Card>

      {isAllowFilters && (
        <Suspense fallback={<div>Loading...</div>}>
          <AllClientFiltersLazy
            setIsAllowFilters={() => {}}
            setAppliedFilters={setAppliedFilters}
            appliedFilter={appliedFilter}
            setCheckedState={setCheckedState}
            checkedState={checkedState}
            // handleHRRequest={handleHRRequest}
            setPageIndex={() => {}}
            setTableFilteredState={setTableFilteredState}
            tableFilteredState={tableFilteredState}
            setFilteredTagLength={setFilteredTagLength}
            onRemoveSurveyFilters={() => onRemoveHRFilters()}
            getHTMLFilter={getHTMLFilter}
            hrFilterList={allHRConfig.hrFilterListConfig()}
            filtersType={allHRConfig.potentialFilterTypeConfig(
              filtersList && filtersList
            )}
            clearFilters={clearFilters}
          />
        </Suspense>
      )}
    </div>
  );
}
