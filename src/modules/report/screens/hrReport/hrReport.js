import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  Suspense,
} from "react";
import hrReportStyle from "./hrReport.module.css";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import DatePicker from "react-datepicker";
import { ReactComponent as FunnelSVG } from "assets/svg/funnel.svg";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';

import { clientReport } from "core/clientReport/clientReportDAO";
import { reportConfig } from "modules/report/report.config";
import { HTTPStatusCode } from "constants/network";
import UTSRoutes from "constants/routes";
import { Table, Checkbox } from "antd";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import moment from "moment";
import { downloadToExcel } from "modules/report/reportUtils";
import LogoLoader from "shared/components/loader/logoLoader";
import WithLoader from "shared/components/loader/loader";
const DealListLazyComponents = React.lazy(() =>
  import("modules/deal/components/dealFilters/dealFilters")
);

export default function HRReport() {
  const navigate = useNavigate();
  const [dateError, setDateError] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [isLoading, setLoading] = useState(false);
  const [reportList, setReportList] = useState([]);
  const [hrStage, setHRStage] = useState("");
  const [reportPopupList, setReportPopupList] = useState([]);

  const [getHTMLFilter, setHTMLFilter] = useState(false);
  const [filtersList, setFiltersList] = useState([]);
  const [filtersSalesRepo, setFiltersSalesRepo] = useState([]);
  const [filtersHRType, setFiltersHRType] = useState([]);
  const [pageSize, setPageSize] = useState(100);
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

  const getHRReportList = async (params) => {
    setLoading(true);
    const response = await clientReport.getHRReportList(params);
    if (response.statusCode === HTTPStatusCode.OK) {
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

  const getHRPopUpReportList = async (params) => {
    setLoading(true);
    const response = await clientReport.getHRPopUpRequestList(params);
    if (response.statusCode === HTTPStatusCode.OK) {
      let details = response.responseBody.details;
      // console.log("popup data", details)
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
  };

  const getHRReportFilterList = async () => {
    setLoading(true);
    const response = await clientReport.getHRReportFilters();
    if (response.statusCode === HTTPStatusCode.OK) {
      let details = response.responseBody.details;
      // console.log("filter data", details)
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

  const getEngagementFilterList = useCallback(async () => {
		const res = await hiringRequestDAO.getAllFilterDataForHRRequestDAO();
		if (res?.statusCode === HTTPStatusCode.OK) {
			setFiltersSalesRepo(res?.responseBody?.details?.Data?.salesReps?.map(item =>({
				text : item?.text,
				value : item?.value
			})))

      setFiltersHRType(res?.responseBody?.details?.Data?.hrTypes?.map(item =>{
        return ({
				text : item?.text,
				value : item?.value
			})}))
		}
	}, []);

  useEffect(()=>{
		getEngagementFilterList();
	},[getEngagementFilterList])

  const handleFiltersRequest = useCallback(
    (reqFilter) => {
      let fd = reqFilter.filterFields_DealList;

      let TypeOfHR = fd["TypeOfHR"] ? fd["TypeOfHR"] : "";
      let SalesManager = fd["SalesManager"] ? fd["SalesManager"] : "";
      let sales_ManagerIDs = fd["sales_ManagerIDs"] ? fd["sales_ManagerIDs"] : "";
      let ModeOfWorking = fd["ModeOfWorking"] ? fd["ModeOfWorking"] : "";
      let HiringStatus = fd["HiringStatus"] ? fd["HiringStatus"] : "";
      let ClientType = fd["ClientType"] ? fd["ClientType"] : "0"
      let geos = fd["geos"] ? fd["geos"] : ""

      let payload = {
        pageIndex: 1,
        pageSize: 0,
        hiringRequestReportFilter: {
          fromDate: moment(firstDay).format("YYYY-MM-DD"),
          toDate: moment(lastDay).format("YYYY-MM-DD"),
          typeOfHR: TypeOfHR,
          modeOfWorkId: ModeOfWorking,
          heads: SalesManager,
          sales_ManagerIDs:sales_ManagerIDs,
          hrStatusID: HiringStatus,
          isHrfocused: isFocusedRole,
          clientType: ClientType,
          geos:geos
        },
      };
      getHRReportList(payload);

      let params = {
        pageIndex: 1,
        pageSize: 0,
        hiringRequestReportPopupFilter: {
          fromDate: moment(firstDay).format("YYYY-MM-DD"),
          toDate: moment(lastDay).format("YYYY-MM-DD"),
          typeOfHR: TypeOfHR,
          modeOfWorkId: ModeOfWorking,
          heads: SalesManager,
          sales_ManagerIDs:sales_ManagerIDs,
          hrStatusID: HiringStatus,
          isHrfocused: isFocusedRole,
          stages: hrStage,
          clientType: ClientType,
          geos:geos
        },
      };

      if (hrStage) {
        getHRPopUpReportList(params);
      }
    },
    [hrStage, firstDay, lastDay, appliedFilter, isFocusedRole]
  );

  useEffect(() => {
    let payload = {
      pageIndex: 1,
      pageSize: 0,
      hiringRequestReportFilter: {
        fromDate: firstDay.toLocaleDateString("en-US"),
        toDate: lastDay.toLocaleDateString("en-US"),
        typeOfHR: "",
        modeOfWorkId: "",
        heads: "",
        hrStatusID: "",
        isHrfocused: isFocusedRole,
        clientType: '0',
        geos:"",
      },
    };
    getHRReportList(payload);
    getHRReportFilterList();
    setStartDate(firstDay);
    setEndDate(lastDay);
  }, []);

  useEffect(() => {
    let filters = {};
    appliedFilter.forEach((item) => {
      filters = {
        ...filters,
        [item.filterType]:
          item.filterType === "CompanyCategory" ? item.value : item.id,
      };
    });

    let TypeOfHR = filters["TypeOfHR"] ? filters["TypeOfHR"] : "";
    let SalesManager = filters["SalesManager"] ? filters["SalesManager"] : "";
    let sales_ManagerIDs = filters["sales_ManagerIDs"] ? filters["sales_ManagerIDs"] : "";
    let ModeOfWorking = filters["ModeOfWorking"]
      ? filters["ModeOfWorking"]
      : "";
    let HiringStatus = filters["HiringStatus"] ? filters["HiringStatus"] : "";
    let ClientType = filters["ClientType"] ? filters["ClientType"] : "0"
    let geos = filters["geos"] ? filters["geos"] : "";

    let payload = {
      pageIndex: 1,
      pageSize: 0,
      hiringRequestReportFilter: {
        fromDate: firstDay.toLocaleDateString("en-US"),
        toDate: lastDay.toLocaleDateString("en-US"),
        typeOfHR: TypeOfHR,
        modeOfWorkId: ModeOfWorking,
        heads: SalesManager,
        sales_ManagerIDs:sales_ManagerIDs,
        hrStatusID: HiringStatus,
        isHrfocused: isFocusedRole,
        clientType: ClientType,
        geos:geos
      },
    };
    getHRReportList(payload);
  }, [isFocusedRole]);

  const onCalenderFilter = useCallback(
    (dates) => {
      const [start, end] = dates;

      setStartDate(start);
      setEndDate(end);

      // if (start.toLocaleDateString() === end.toLocaleDateString()) {
      //   let params = {
      //     fromDate: new Date(
      //       date.getFullYear(),
      //       date.getMonth() - 1,
      //       date.getDate()
      //     ),
      //     toDate: new Date(date),
      //   };
      //   setStartDate(params.fromDate);
      //   setEndDate(params.toDate);
      //   setDateError(true);
      //   setTimeout(() => setDateError(false), 5000);
      //   return;
      // } else {
        if (start && end) {
          let filters = {};
          appliedFilter.forEach((item) => {
            filters = {
              ...filters,
              [item.filterType]:
                item.filterType === "CompanyCategory" ? item.value : item.id,
            };
          });

          let TypeOfHR = filters["TypeOfHR"] ? filters["TypeOfHR"] : "";
          let SalesManager = filters["SalesManager"]
            ? filters["SalesManager"]
            : "";
            let sales_ManagerIDs = filters["sales_ManagerIDs"] ? filters["sales_ManagerIDs"] : "";
          let ModeOfWorking = filters["ModeOfWorking"]
            ? filters["ModeOfWorking"]
            : "";
          let HiringStatus = filters["HiringStatus"]
            ? filters["HiringStatus"]
            : "";
          let ClientType = filters["ClientType"] ? filters["ClientType"] : "0"
          let geos = filters["geos"]
          ? filters["geos"]
          : "";

          let payload = {
            pageIndex: 1,
            pageSize: 0,
            hiringRequestReportFilter: {
              fromDate: moment(start).format("YYYY-MM-DD"),
              toDate: moment(end).format("YYYY-MM-DD"),
              typeOfHR: TypeOfHR,
              modeOfWorkId: ModeOfWorking,
              heads: SalesManager,
              sales_ManagerIDs:sales_ManagerIDs,
              hrStatusID: HiringStatus,
              isHrfocused: isFocusedRole,
              clientType: ClientType,
              geos:geos
            },
          };
          getHRReportList(payload);
        }
      // }
    },
    [hrStage, appliedFilter, isFocusedRole]
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

    setAppliedFilters(new Map());
    setCheckedState(new Map());
    setFilteredTagLength(0);
    setIsFocusedRole(false);

    let payload = {
      pageIndex: 1,
      pageSize: 0,
      hiringRequestReportFilter: {
        fromDate: moment(params.fromDate).format("YYYY-MM-DD"),
        toDate: moment(params.toDate).format("YYYY-MM-DD"),
        typeOfHR: "",
        modeOfWorkId: "",
        heads: "",
        hrStatusID: "",
        isHrfocused: isFocusedRole,
        clientType: '0',
        geos:""
      },
    };
    getHRReportList(payload);
    onRemoveDealFilters();
    // getI2SReport(params);
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

      let TypeOfHR = filters["TypeOfHR"] ? filters["TypeOfHR"] : "";
      let SalesManager = filters["SalesManager"] ? filters["SalesManager"] : "";
      let sales_ManagerIDs = filters["sales_ManagerIDs"] ? filters["sales_ManagerIDs"] : "";
      let ModeOfWorking = filters["ModeOfWorking"]
        ? filters["ModeOfWorking"]
        : "";
      let HiringStatus = filters["HiringStatus"] ? filters["HiringStatus"] : "";
      let ClientType = filters["ClientType"] ? filters["ClientType"] : "0";
      let geos = filters["geos"]
          ? filters["geos"]
          : "";
      // console.log(reportData);
      setHRStage(reportData.stageName);
      let params = {
        pageIndex: 1,
        pageSize: 0,
        hiringRequestReportPopupFilter: {
          fromDate: moment(firstDay).format("YYYY-MM-DD"),
          toDate: moment(lastDay).format("YYYY-MM-DD"),
          typeOfHR: TypeOfHR,
          modeOfWorkId: ModeOfWorking,
          heads: SalesManager,
          sales_ManagerIDs:sales_ManagerIDs,
          hrStatusID: HiringStatus,
          stages: reportData.stageName,
          isHrfocused: isFocusedRole,
          clientType: ClientType,
          geos:geos
        },
      };
      getHRPopUpReportList(params);
    },
    [hrStage, firstDay, lastDay, appliedFilter, isFocusedRole]
  );

  const tableColumnsMemo = useMemo(
    () => reportConfig.hrPopupReportConfig(hrStage),
    [hrStage]
  );

  const onRemoveDealFilters = () => {
    setTimeout(() => {
      setIsAllowFilters(false);
    }, 300);
    setHTMLFilter(false);
  };

  const toggleClientFilter = useCallback(() => {
    // getDealFilterRequest();
    !getHTMLFilter
      ? setIsAllowFilters(!isAllowFilters)
      : setTimeout(() => {
          setIsAllowFilters(!isAllowFilters);
        }, 300);
    setHTMLFilter(!getHTMLFilter);
  }, [getHTMLFilter, isAllowFilters]);

  const handleExport = (apiData) => {
    let DataToExport = apiData.map((data) => {
      let obj = {};
      tableColumnsMemo.map(
        (val) => {
          if(val.key === 'hrAcceptedDateTime'){
            obj[`HR Accepted Date`] = data[`${val.key}`]
          }
          else if(val.key === 'firstProfileSharedDate'){
            obj[`1st Profile Share Date`] = data[`${val.key}`]
          }
          else if(val.key === 'noOfProfileShared'){
            obj[`Total Profile Shared`] = data[`${val.key}`]
          }
          else{
            obj[`${val.title}`] = data[`${val.key}`]
          }
         
        }
          // val.key !== "action" && (obj[`${val.title}`] = data[`${val.key}`])
      );
      return obj;
    });
    downloadToExcel(DataToExport, `HRReport: ${hrStage}.xlsx`);
  };

  // console.log('client', reportList, appliedFilter)
  return (
    <div className={hrReportStyle.dealContainer}>
      {/* <WithLoader className="pageMainLoader" showLoader={isLoading}> */}
      <div className={hrReportStyle.header}>
        <div className={hrReportStyle.dealLable}>HR Report</div>
        <LogoLoader visible={isLoading} />
      </div>

      <div className={hrReportStyle.filterContainer}>
        <div className={hrReportStyle.filterSets}>
          <div className={hrReportStyle.filterSetsInner}>
            <div
              className={hrReportStyle.addFilter}
              onClick={toggleClientFilter}
            >
              <FunnelSVG style={{ width: "16px", height: "16px" }} />

              <div className={hrReportStyle.filterLabel}>Add Filters</div>
              <div className={hrReportStyle.filterCount}>
                {filteredTagLength}
              </div>
            </div>
            <p onClick={() => resetFilter()}>Reset Filters</p>
          </div>

          <div className={hrReportStyle.filterRight}>
            <Checkbox
              checked={isFocusedRole}
              onClick={() => setIsFocusedRole((prev) => !prev)}
            >
              Show only Focused Role
            </Checkbox>
            <div className={hrReportStyle.calendarFilterSet}>
              {dateError && (
                <p className={hrReportStyle.error}>
                  * Start and End dates can't be same{" "}
                </p>
              )}
              <div className={hrReportStyle.label}>Date</div>
              <div className={hrReportStyle.calendarFilter}>
                <CalenderSVG style={{ height: "16px", marginRight: "16px" }} />
                <DatePicker
                  style={{ backgroundColor: "red" }}
                  onKeyDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className={hrReportStyle.dateFilter}
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
            {/* <button
              type="submit"
              className={hrReportStyle.btnPrimary}
              onClick={() => resetFilter()}
            >
              Reset
            </button> */}
          </div>
        </div>
      </div>

      <div
        className={`${hrReportStyle.filterSets} ${hrReportStyle.filterDescription}`}
        style={{ marginBottom: "5px" }}
      >
        <div className={hrReportStyle.filterType}>
          {/* <img
							src={Rocket}
							alt="rocket"
						/> */}
          <h2>
            No profiles shared % -{" "}
            <span>
              {reportList.length > 0 && reportList[0].stageValue > 0 ? 
                (
                  (reportList[4].stageValue / reportList[0].stageValue) *
                  100
                ).toFixed(2) : "NA"}
            </span>
          </h2>
        </div>

        <div className={hrReportStyle.filterType}>
          {/* <img
							src={Rocket}
							alt="rocket"
						/> */}
          <h2>
          At least 3 profiles shared in 3 days % -{" "}
            <span>
              {reportList.length > 0 && reportList[0].stageValue > 0 ?
                (
                  (reportList[11].stageValue / reportList[0].stageValue) *
                  100
                ).toFixed(2) : "NA"}
            </span>
          </h2>
        </div>

        <div className={hrReportStyle.filterType}>
          {/* <img
							src={Rocket}
							alt="rocket"
						/> */}
          <h2>
          At least 3 profile shared % -{" "}
            <span>
              {reportList.length > 0 && reportList[0].stageValue > 0 ?
                (
                  (reportList[5].stageValue / reportList[0].stageValue) *
                  100
                ).toFixed(2) : "NA"}
            </span>
          </h2>
        </div>

        <div className={hrReportStyle.filterType}>
          {/* <img
							src={Rocket}
							alt="rocket"
						/> */}
          <h2>
            At least 1 profiles shared in 2 days % -{" "}
            <span>
              {reportList.length > 0 && reportList[0].stageValue > 0 ?
                (
                  (reportList[9].stageValue / reportList[0].stageValue) *
                  100
                ).toFixed(2) : "NA"}
            </span>
          </h2>
        </div>

      
      </div>

      <div
        className={`${hrReportStyle.filterSets} ${hrReportStyle.filterDescription}`}
        style={{ marginTop: "0" }}
      >
          <div className={hrReportStyle.filterType}>
          <h2>
          At least 6 profiles shared in 10 days % -{" "}
            <span>
              {reportList.length > 0 && reportList[0].stageValue > 0 ?
                (
                  (reportList[6].stageValue / reportList[0].stageValue) *
                  100
                ).toFixed(2) : "NA"}
            </span>
          </h2>
        </div>

        <div className={hrReportStyle.filterType}>
          <h2>
          At least 5 profiles are shared in 5 days % -{" "}
            <span>
              {reportList.length > 0 && reportList[0].stageValue > 0 ?
                (
                  (reportList[7].stageValue / reportList[0].stageValue) *
                  100
                ).toFixed(2) : "NA"}
            </span>
          </h2>
        </div>

        <div className={hrReportStyle.filterType}>
          <h2>
          At least 10 profiles are shared in 10 days % -{" "}
            <span>
              {reportList.length > 0 && reportList[0].stageValue > 0 ?
                (
                  (reportList[8].stageValue / reportList[0].stageValue) *
                  100
                ).toFixed(2) : 'NA'}
            </span>
          </h2>
        </div>
        <div className={hrReportStyle.filterType}>
          <h2>
            At least 1 profiles shared in 5 days % -{" "}
            <span>
              {reportList.length > 0 && reportList[0].stageValue > 0 ?
                (
                  (reportList[10].stageValue / reportList[0].stageValue) *
                  100
                ).toFixed(2): 'NA'}
            </span>
          </h2>
        </div>
      </div>

      <div className={hrReportStyle.i2sContainer} style={{ width: "50%" }}>
        <div className={hrReportStyle.cardWrapper}>
          <div className={hrReportStyle.cardTitle}>
            <div>HR Stage</div>
            <div>Values</div>
          </div>
          <ul className={hrReportStyle.cardInner}>
            {reportList.map((report) => (
              <li className={hrReportStyle.row} key={report.stageName}>
                <div className={hrReportStyle.rowLabel}>{report.stageName}</div>
                <div className={hrReportStyle.rowValue}>
                  {report.stageValue > 0 ? (
                    <p
                      className={hrReportStyle.textLink}
                      onClick={() => {
                        setTableData(report);
                        // seti2sPopupModal(true);
                        // setPopupData({
                        //   ...value,
                        //   fromDate: new Date(
                        //     firstDay
                        //   ).toLocaleDateString("en-US"),
                        //   toDate: new Date(lastDay).toLocaleDateString(
                        //     "en-US"
                        //   ),
                        // });
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
        <div className={hrReportStyle.i2sContainer}>
          {isLoading ? (
            <div style={{ height: "200px", overflow: "hidden" }}>
              <TableSkeleton />
            </div>
          ) : (
            <>
              <div className={hrReportStyle.exportAction}>
                <h3 className={hrReportStyle.cardTitle}>
                  HR Report : {hrStage}
                </h3>

                <button
                  className={hrReportStyle.btnPrimary}
                  onClick={() => handleExport(reportPopupList)}
                >
                  Export
                </button>
              </div>

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
            // hrFilterList={DealConfig.dealFiltersListConfig()}
            filtersType={reportConfig.HRReportFilterTypeConfig(
              filtersList && filtersList,filtersSalesRepo && filtersSalesRepo, filtersHRType && filtersHRType
            )}
            clearFilters={resetFilter}
          />
        </Suspense>
      )}
    {/* </WithLoader> */}
    </div>
  );
}
