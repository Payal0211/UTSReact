import React, {useEffect,useState, useMemo, useCallback, Suspense} from "react";
import ClientReportStyle from "./clientReport.module.css";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import DatePicker from "react-datepicker";
import { ReactComponent as FunnelSVG } from "assets/svg/funnel.svg";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { clientReport } from "core/clientReport/clientReportDAO";
import { reportConfig } from "modules/report/report.config";
import { HTTPStatusCode } from "constants/network";
import UTSRoutes from "constants/routes";
import { Table, Checkbox } from "antd";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import moment from "moment";
import LogoLoader from "shared/components/loader/logoLoader";

const DealListLazyComponents = React.lazy(() =>
  import("modules/deal/components/dealFilters/dealFilters")
);

export default function ClientReport() {
  const navigate = useNavigate();
  const [dateError, setDateError] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [isLoading, setLoading] = useState(false);
  const [reportList, setReportList] = useState([]);
  const [clientStage, setClientStage] = useState("");
  const [reportPopupList, setReportPopupList] = useState([]);

  const [getHTMLFilter, setHTMLFilter] = useState(false);
  const [filtersList, setFiltersList] = useState([]);
  const [isAllowFilters, setIsAllowFilters] = useState(false);
  const [filteredTagLength, setFilteredTagLength] = useState(0);
  const [appliedFilter, setAppliedFilters] = useState(new Map());
  const [checkedState, setCheckedState] = useState(new Map());
  const [isFocusedRole, setIsFocusedRole] = useState(false);

  const [tableFilteredState, setTableFilteredState] = useState({
    totalrecord: 100,
    pagenumber: 1,
  });

  var date = new Date();

  var firstDay =
    startDate !== null
      ? startDate
      : new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
  var lastDay = endDate !== null ? endDate : new Date(date);

  const getClientReportList = async (params) => {
    setLoading(true);
    const response = await clientReport.getClientRequestList({
      ...params,
      isHrfocused: isFocusedRole,
    });
    if (response?.statusCode === HTTPStatusCode.OK) {
      let details = response.responseBody.details;
      setReportList(details);
      setReportPopupList([]);
      setLoading(false);
    } else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
      setLoading(false);
      return navigate(UTSRoutes.LOGINROUTE);
    } else if (response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
      setLoading(false);
      return navigate(UTSRoutes.SOMETHINGWENTWRONG);
    } else {
      setLoading(false);
      return "NO DATA FOUND";
    }
  };

  const getClientPopUpReportList = useCallback(async (params) => {
    setLoading(true);
     const response = await clientReport.getClienPopUpRequestList(params);
    if (response?.statusCode === HTTPStatusCode.OK) {
      let details = response.responseBody.details;
      setReportPopupList(details);
      setLoading(false);
    } else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
      setLoading(false);
      return navigate(UTSRoutes.LOGINROUTE);
    } else if (response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
      setLoading(false);
      return navigate(UTSRoutes.SOMETHINGWENTWRONG);
    } else {
      setLoading(false);
      return "NO DATA FOUND";
    }
  },[isFocusedRole,navigate]) 

  const getClientReportFilterList = async (params) => {
    setLoading(true);
    const response = await clientReport.getClientReportFilters();
    if (response?.statusCode === HTTPStatusCode.OK) {
      let details = response.responseBody.details.Data;
      setFiltersList(details);
      setLoading(false);
    } else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
      setLoading(false);
      return navigate(UTSRoutes.LOGINROUTE);
    } else if (response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
      setLoading(false);
      return navigate(UTSRoutes.SOMETHINGWENTWRONG);
    } else {
      setLoading(false);
      return "NO DATA FOUND";
    }
  };

  useEffect(() => {
    let fd = {};
    appliedFilter.forEach((item) => {
      fd = {
        ...fd,
        [item.filterType]:
          item.filterType === "CompanyCategory" ? item.value : item.id,
      };
    });

    let companyCategory = fd["CompanyCategory"] ? fd["CompanyCategory"] : "";
    let SalesManager = fd["SalesManager"] ? fd["SalesManager"] : "";
    let leadUserID = fd["LeadType"] ? parseInt(fd["LeadType"]) : 0;

    let payload = {
      fromDate: firstDay.toLocaleDateString("en-US"),
      toDate: lastDay.toLocaleDateString("en-US"),
      geoId: 0,
      companyCategory: companyCategory,
      salesMangerId: 0,
      salesManagerIds: SalesManager,
      leadUserId: leadUserID,
    };
    getClientReportList(payload);

    let params = {
      fromDate: firstDay.toLocaleDateString("en-US"),
      toDate: lastDay.toLocaleDateString("en-US"),
      stageName: clientStage,
      fullName: "",
      company: "",
      geo: "",
      salesUser: "",
      hr_Number: "",
      name: "",
      companyCategory: companyCategory,
      salesManagerID: 0,
      status: "",
      salesManagerIDs: SalesManager,
      leadUserID: leadUserID,
      isHrfocused: isFocusedRole,
    };

    if (clientStage) {
      getClientPopUpReportList(params);
    }
  }, [isFocusedRole]);

  const handleFiltersRequest = useCallback(
    (reqFilter) => {
      let fd = reqFilter.filterFields_DealList;
      let companyCategory = fd["CompanyCategory"] ? fd["CompanyCategory"] : "";
      let SalesManager = fd["SalesManager"] ? fd["SalesManager"] : "";
      let leadUserID = fd["LeadType"] ? parseInt(fd["LeadType"]) : 0;      
      let payload = {
        fromDate: firstDay.toLocaleDateString("en-US"),
        toDate: lastDay.toLocaleDateString("en-US"),
        geoId: 0,
        companyCategory: companyCategory,
        salesMangerId: 0,
        salesManagerIds: SalesManager,
        leadUserId: leadUserID,
      };
      getClientReportList(payload);

      let params = {
        fromDate: firstDay.toLocaleDateString("en-US"),
        toDate: lastDay.toLocaleDateString("en-US"),
        stageName: clientStage,
        fullName: "",
        company: "",
        geo: "",
        salesUser: "",
        hr_Number: "",
        name: "",
        companyCategory: companyCategory,
        salesManagerID: 0,
        status: "",
        salesManagerIDs: SalesManager,
        leadUserID: leadUserID,
        isHrfocused: isFocusedRole,
      };

      if (clientStage) {
        getClientPopUpReportList(params);
      }
    },
    [clientStage, firstDay, lastDay, appliedFilter, isFocusedRole]
  );

  useEffect(() => {
    let payload = {
      fromDate: firstDay.toLocaleDateString("en-US"),
      toDate: lastDay.toLocaleDateString("en-US"),
      geoId: 0,
      companyCategory: "",
      salesMangerId: 0,
      salesManagerIds: "",
      leadUserId: 0,
    };
    getClientReportList(payload);
    getClientReportFilterList();
    setStartDate(firstDay);
    setEndDate(lastDay);
  }, []);

  const onCalenderFilter = useCallback(
    (dates) => {
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
          let filters = {};
          appliedFilter.forEach((item) => {
            filters = {
              ...filters,
              [item.filterType]:
                item.filterType === "CompanyCategory" ? item.value : item.id,
            };
          });

          let companyCategory = filters["CompanyCategory"]
            ? filters["CompanyCategory"]
            : "";
          let SalesManager = filters["SalesManager"]
            ? filters["SalesManager"]
            : "";
          let leadUserID = filters["LeadType"]
            ? parseInt(filters["LeadType"])
            : 0;          
          let payload = {
            fromDate: start.toLocaleDateString("en-US"),
            toDate: end.toLocaleDateString("en-US"),
            geoId: 0,
            companyCategory: companyCategory,
            salesMangerId: 0,
            salesManagerIds: SalesManager,
            leadUserId: leadUserID,
          };
          getClientReportList(payload);
        }
      }
    },
    [clientStage, appliedFilter]
  );
  const resetFilter = () => {
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
    setIsFocusedRole(false)
    setAppliedFilters(new Map());
    setCheckedState(new Map());
    setFilteredTagLength(0);    
    let payload = {
      fromDate: params.fromDate,
      toDate: params.toDate,
      geoId: 0,
      companyCategory: "",
      salesMangerId: 0,
      salesManagerIds: "",
      leadUserId: 0,
    };
    getClientReportList(payload);
    onRemoveDealFilters();
  };

  const setTableData = useCallback(
    (reportData) => {
      let filters = {};
      appliedFilter.forEach((item) => {
        filters = {
          ...filters,
          [item.filterType]:
            item.filterType === "CompanyCategory" ? item.value : item.id,
        };
      });

      let companyCategory = filters["CompanyCategory"]
        ? filters["CompanyCategory"]
        : "";
      let SalesManager = filters["SalesManager"] ? filters["SalesManager"] : "";
      let leadUserID = filters["LeadType"] ? parseInt(filters["LeadType"]) : 0;
      setClientStage(reportData.stageName);
     
      let params = {
        fromDate: moment(firstDay).format("yyyy-MM-DD"),
        toDate: moment(lastDay).format("yyyy-MM-DD"),
        stageName: reportData.stageName,
        fullName: "",
        company: "",
        geo: "",
        salesUser: "",
        hr_Number: "",
        name: "",
        companyCategory: companyCategory,
        salesManagerID: 0,
        status: "",
        salesManagerIDs: SalesManager,
        leadUserID: leadUserID,
        isHrfocused: isFocusedRole,
      };

      getClientPopUpReportList(params);
    },
    [clientStage, firstDay, lastDay, appliedFilter,isFocusedRole,]
  );

  const tableColumnsMemo = useMemo(
    () => reportConfig.clientPopupReportConfig(),
    []
  );

  const onRemoveDealFilters = () => {
    setTimeout(() => {
      setIsAllowFilters(false);
    }, 300);
    setHTMLFilter(false);
  };

  const toggleClientFilter = useCallback(() => {
    !getHTMLFilter
      ? setIsAllowFilters(!isAllowFilters)
      : setTimeout(() => {
          setIsAllowFilters(!isAllowFilters);
        }, 300);
    setHTMLFilter(!getHTMLFilter);
  }, [getHTMLFilter, isAllowFilters]);

  return (
    <div className={ClientReportStyle.dealContainer}>
      <div className={ClientReportStyle.header}>
        <div className={ClientReportStyle.dealLable}>Client Report</div>
        <LogoLoader visible={isLoading} />
      </div>

      <div className={ClientReportStyle.filterContainer}>
        <div className={ClientReportStyle.filterSets}>
          <div className={ClientReportStyle.filterSetsInner}>
            <div
              className={ClientReportStyle.addFilter}
              onClick={toggleClientFilter}
            >
              <FunnelSVG style={{ width: "16px", height: "16px" }} />

              <div className={ClientReportStyle.filterLabel}>Add Filters</div>
              <div className={ClientReportStyle.filterCount}>
                {filteredTagLength}
              </div>
            </div>
            <p onClick={() => resetFilter()}>Reset Filters</p>
          </div>

          <div className={ClientReportStyle.filterRight}>
            <Checkbox
              checked={isFocusedRole}
              onClick={() => setIsFocusedRole((prev) => !prev)}
            >
              Show only Focused Role
            </Checkbox>
            <div className={ClientReportStyle.calendarFilterSet}>
              {dateError && (
                <p className={ClientReportStyle.error}>
                  * Start and End dates can't be same{" "}
                </p>
              )}
              <div className={ClientReportStyle.label}>Date</div>
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
            </div>
           
          </div>
        </div>
      </div>

      <div className={ClientReportStyle.i2sContainer} style={{ width: "50%" }}>
        <div className={ClientReportStyle.cardWrapper}>
          <div className={ClientReportStyle.cardTitle}>
            <div>Client Stage</div>
            <div>NBD Pipeline</div>
          </div>
          <ul className={ClientReportStyle.cardInner}>
            {reportList.map((report) => (
              <li className={ClientReportStyle.row} key={report.stageName}>
                <div className={ClientReportStyle.rowLabel}>
                  {report.stageName}
                </div>
                <div className={ClientReportStyle.rowValue}>
                  {report.stageValue > 0 ? (
                    <p
                      className={ClientReportStyle.textLink}
                      onClick={() => {
                        setTableData(report);                       
                      }}
                    >
                      {report.stageValue}
                    </p>
                  ) : (
                    <p>{report.stageValue}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {reportPopupList.length > 0 && (
        <div className={ClientReportStyle.i2sContainer}>
          {isLoading ? (
            <div style={{ height: "200px", overflow: "hidden" }}>
              <TableSkeleton />
            </div>
          ) : (
            <>
              <h3 className={ClientReportStyle.cardTitle}>
                Client Report : {clientStage}
              </h3>
              <Table
                id="clientReportTable"
                columns={tableColumnsMemo}
                bordered={false}
                dataSource={reportPopupList}
                scroll={{
                  y: 400,
                }}
                pagination={false}
              />
            </>
          )}
        </div>
      )}

      {isAllowFilters && (
        <Suspense>
          <DealListLazyComponents
            setAppliedFilters={setAppliedFilters}
            appliedFilter={appliedFilter}
            setCheckedState={setCheckedState}
            checkedState={checkedState}
            handleDealRequest={handleFiltersRequest}
            setTableFilteredState={setTableFilteredState}
            tableFilteredState={tableFilteredState}
            setFilteredTagLength={setFilteredTagLength}
            onRemoveDealFilters={onRemoveDealFilters}
            getHTMLFilter={getHTMLFilter}
            filtersType={reportConfig.clientReportFilterTypeConfig(
              filtersList && filtersList
            )}
            clearFilters={resetFilter}
          />
        </Suspense>
      )}
    </div>
  );
}
