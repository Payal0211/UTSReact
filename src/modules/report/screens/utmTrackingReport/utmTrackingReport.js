import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  Suspense,
} from "react";
import utmTrackingReportStyle from "./utmTrackingReport.module.css";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import DatePicker from "react-datepicker";
import { ReactComponent as FunnelSVG } from "assets/svg/funnel.svg";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

import { clientReport } from "core/clientReport/clientReportDAO";
import { reportConfig } from "modules/report/report.config";
import { HTTPStatusCode } from "constants/network";
import UTSRoutes from "constants/routes";
import { Table, Checkbox, Select } from "antd";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import moment from "moment";
import { downloadToExcel } from "modules/report/reportUtils";
import LogoLoader from "shared/components/loader/logoLoader";
import { utmTrackingReportDAO } from "core/utmTrackingReport/utmTrackingReportDAO";
import { utmTrackingReportAPI } from "apis/utmTrackingReportAPI";

const DealListLazyComponents = React.lazy(() =>
  import("modules/deal/components/dealFilters/dealFilters")
);

export default function UTMTrackingReport() {
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
  const [pageSize, setPageSize] = useState(100);
  const [isAllowFilters, setIsAllowFilters] = useState(false);
  const [filteredTagLength, setFilteredTagLength] = useState(0);
  const [appliedFilter, setAppliedFilters] = useState(new Map());
  const [checkedState, setCheckedState] = useState(new Map());
  const [isFocusedRole, setIsFocusedRole] = useState(false);

  const [numOfJobs,setNumOfJobs] = useState([]);
  const [refURL,setRefURL] = useState([]);
  const [campaign,setCampaign] = useState([]);
  const [content,setContent] = useState([]);
  const [medium,setMedium] = useState([]);
  const [placement,sePlacement] = useState([]);
  const [source,setSource] = useState([]);
  const [term,setTerm] = useState([]);

  // const [utmTrackingListList, setutmTrackingListList] = useState([]); 


  const [tableFilteredState, setTableFilteredState] = useState({
    totalrecord: 100,
    pagenumber: 1,
  });

  const data = {
    // NoOfJobs : null,
    Fromdate:"",
    ToDate:"",
    UTM_Source:"",
    UTM_Medium:"",
    UTM_Campaign:"",
    UTM_Content:"",
    UTM_Term:"",
    UTM_Placement:"",
    ref_url:""
  }

  // const getUTMTrackingList = async()  =>{
  //   const res = await utmTrackingReportDAO.getutmTrackingReportDAO(data);
  //   setutmTrackingListList(res?.responseBody?.details);
  // }

  var date = new Date();

  var firstDay =
    startDate !== null
      ? startDate
      : new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
  var lastDay = endDate !== null ? endDate : new Date(date);

  const getUTMReportList = async (params) => {
    setLoading(true);
    const response = await utmTrackingReportDAO.getutmTrackingReportDAO(params);
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
    const response = await utmTrackingReportDAO.getutmTrackingLeadDetailDAO(params);
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

  const getUTMReportFilterList = async () => {
    setLoading(true);
    const response = await utmTrackingReportAPI.utmTrackingReportFilters();
    if (response.statusCode === HTTPStatusCode.OK) {
      let details = response.responseBody.details?.Data;
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


  const allDropdownsList = () =>{
    setNumOfJobs(filtersList && filtersList?.get_JobPostCount_For_UTM_Tracking_Lead?.map(item=>({id:item?.value,value:item?.value})));
    setRefURL(filtersList && filtersList?.ref_Url?.map((item)=>({id:item?.text,value:item?.value})));
    setCampaign(filtersList && filtersList?.utM_Campaign?.map((item)=>({id:item?.text,value:item?.value})));
    setContent(filtersList && filtersList?.utM_Content?.map((item)=>({id:item?.text,value:item?.value})));
    setMedium(filtersList && filtersList?.utM_Medium?.map((item)=>({id:item?.text,value:item?.value})));
    sePlacement(filtersList && filtersList?.utM_Placement?.map((item)=>({id:item?.text,value:item?.value})));
    setSource(filtersList && filtersList?.utM_Source?.map((item)=>({id:item?.text,value:item?.value})));
    setTerm(filtersList && filtersList?.utM_Term?.map((item)=>({id:item?.text,value:item?.value})));
  }

  const handleFiltersRequest = useCallback(
    (reqFilter) => {
      let fd = reqFilter.filterFields_DealList;
      let get_JobPostCount_For_UTM_Tracking_Lead = fd["get_JobPostCount_For_UTM_Tracking_Lead"] ? fd["get_JobPostCount_For_UTM_Tracking_Lead"] : null;
      let ref_Url = fd["ref_Url"] ? fd["ref_Url"] : "";
      let utM_Campaign= fd["utM_Campaign"] ? fd["utM_Campaign"] : "";
      let utM_Content = fd["utM_Content"] ? fd["utM_Content"] : "";
      let utM_Medium = fd["utM_Medium"] ? fd["utM_Medium"] : "";
      let utM_Placement = fd["utM_Placement"] ? fd["utM_Placement"] : "";
      let utM_Source = fd["utM_Source"] ? fd["utM_Source"] : ""
      let utM_Term = fd["utM_Term"] ? fd["utM_Term"] : ""

      let payload = {
          Fromdate: moment(firstDay).format("YYYY-MM-DD"),
          ToDate: moment(lastDay).format("YYYY-MM-DD"),
          // NoOfJobs: get_JobPostCount_For_UTM_Tracking_Lead,
          UTM_Source: utM_Source,
          UTM_Medium: utM_Medium,
          UTM_Campaign: utM_Campaign,
          UTM_Content: utM_Content,
          UTM_Term: utM_Term,
          UTM_Placement:utM_Placement,
          ref_url:ref_Url
      };
      getUTMReportList(payload);

      let params = {
          Fromdate: moment(firstDay).format("YYYY-MM-DD"),
          ToDate: moment(lastDay).format("YYYY-MM-DD"),
          // NoOfJobs: get_JobPostCount_For_UTM_Tracking_Lead,
          UTM_Source: utM_Source,
          UTM_Medium: utM_Medium,
          UTM_Campaign: utM_Campaign,
          UTM_Content: utM_Content,
          UTM_Term: utM_Term,
          UTM_Placement:utM_Placement,
          ref_url:ref_Url
      };

      if (hrStage) {
        getHRPopUpReportList(params);
      }
    },
    [hrStage, firstDay, lastDay, appliedFilter, isFocusedRole]
  );

  useEffect(() => {
    let payload = {
        Fromdate: firstDay.toLocaleDateString("en-US"),
        ToDate: lastDay.toLocaleDateString("en-US"),
        // NoOfJobs: null,
        UTM_Source: "",
        UTM_Medium: "",
        UTM_Campaign: "",
        UTM_Content: "",
        UTM_Term: "",
        UTM_Placement:"",
        ref_url:""
    };
    getUTMReportList(payload);
    getUTMReportFilterList();
    // getUTMTrackingList(data);
    setStartDate(firstDay);
    setEndDate(lastDay);
  }, []);

  useEffect(() => {
    allDropdownsList();
  }, [filtersList])
  

  useEffect(() => {
    let filters = {};
    appliedFilter.forEach((item) => {
      filters = {
        ...filters,
        [item.filterType]:
          item.filterType === "CompanyCategory" ? item.value : item.id,
      };
    });

    let get_JobPostCount_For_UTM_Tracking_Lead = filters["get_JobPostCount_For_UTM_Tracking_Lead"] ? filters["get_JobPostCount_For_UTM_Tracking_Lead"] : null;
    let ref_Url = filters["ref_Url"] ? filters["ref_Url"] : "";
    let utM_Campaign = filters["utM_Campaign"]
      ? filters["utM_Campaign"]
      : "";
    let utM_Content = filters["utM_Content"] ? filters["utM_Content"] : "";
    let utM_Medium = filters["utM_Medium"] ? filters["utM_Medium"] : ""
    let utM_Placement = filters["utM_Placement"] ? filters["utM_Placement"] : ""
    let utM_Source = filters["utM_Source"] ? filters["utM_Source"] : ""
    let utM_Term = filters["utM_Term"] ? filters["utM_Term"] : ""


    let payload = {
        Fromdate: firstDay.toLocaleDateString("en-US"),
        ToDate: lastDay.toLocaleDateString("en-US"),
        // NoOfJobs: get_JobPostCount_For_UTM_Tracking_Lead,
        UTM_Source: utM_Source,
        UTM_Medium: utM_Medium,
        UTM_Campaign: utM_Campaign,
        UTM_Content: utM_Content,
        UTM_Term: utM_Term,
        UTM_Placement:utM_Placement,
        ref_url:ref_Url
    };
    getUTMReportList(payload);
  }, [isFocusedRole]);

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
          // appliedFilter.forEach((item) => {
          //   filters = {
          //     ...filters,
          //     [item.filterType]:
          //       item.filterType === "CompanyCategory" ? item.value : item.id,
          //   };
          // });

          let get_JobPostCount_For_UTM_Tracking_Lead = filters["get_JobPostCount_For_UTM_Tracking_Lead"] ? filters["get_JobPostCount_For_UTM_Tracking_Lead"] : null;
          let ref_Url = filters["ref_Url"]
            ? filters["ref_Url"]
            : "";
          let utM_Campaign = filters["utM_Campaign"]
            ? filters["utM_Campaign"]
            : "";
          let utM_Content = filters["utM_Content"]
            ? filters["utM_Content"]
            : "";
          let utM_Medium = filters["utM_Medium"] ? filters["utM_Medium"] : "";
          let utM_Placement = filters["utM_Placement"] ? filters["utM_Placement"] : ""
          let utM_Source = filters["utM_Source"] ? filters["utM_Source"] : ""
          let utM_Term = filters["utM_Term"] ? filters["utM_Term"] : ""


          let payload = {
              Fromdate: moment(start).format("YYYY-MM-DD"),
              ToDate: moment(end).format("YYYY-MM-DD"),
              // NoOfJobs: get_JobPostCount_For_UTM_Tracking_Lead,
              UTM_Source: utM_Source,
              UTM_Medium: utM_Medium,
              UTM_Campaign: utM_Campaign,
              UTM_Content: utM_Content,
              UTM_Term: utM_Term,
              UTM_Placement:utM_Placement,
              ref_url:ref_Url

          };
          getUTMReportList(payload);
        }
      }
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
      // pageIndex: 1,
      // pageSize: 0,
  
        Fromdate: moment(params.fromDate).format("YYYY-MM-DD"),
        ToDate: moment(params.toDate).format("YYYY-MM-DD"),
        // NoOfJobs: null,
        UTM_Source: "",
        UTM_Medium: "",
        UTM_Campaign: "",
        UTM_Content: "",
        UTM_Term: "",
        UTM_Placement:"",
        ref_url:""

    };
    getUTMReportList(payload);
    onRemoveDealFilters();
    // getI2SReport(params);
  };

  const setTableData = useCallback(
    (reportData) => {   
      let filters = {};
      appliedFilter.forEach((item) => {
        filters = {
          ...filters,
          [item.filterType]:item.id,
        };
      });
      // let get_JobPostCount_For_UTM_Tracking_Lead = filters["get_JobPostCount_For_UTM_Tracking_Lead"] ? filters["get_JobPostCount_For_UTM_Tracking_Lead"] : null;
      let ref_Url = filters["ref_Url"] ? filters["ref_Url"] : "";
      let utM_Campaign = filters["utM_Campaign"]
        ? filters["utM_Campaign"]
        : "";
      let utM_Content = filters["utM_Content"] ? filters["utM_Content"] : "";
      let utM_Medium = filters["utM_Medium"] ? filters["utM_Medium"] : ""
      let utM_Placement = filters["utM_Placement"] ? filters["utM_Placement"] : ""
      let utM_Source = filters["utM_Source"] ? filters["utM_Source"] : ""
      let utM_Term = filters["utM_Term"] ? filters["utM_Term"] : ""

      setHRStage(reportData.actions);
      let params = {     
          fromDate: moment(firstDay).format("YYYY-MM-DD"),
          toDate: moment(lastDay).format("YYYY-MM-DD"),
          // noOfJobs: get_JobPostCount_For_UTM_Tracking_Lead,   
          utM_Source: utM_Source,
          utM_Medium: utM_Medium,
          utM_Campaign: utM_Campaign,
          utM_Content: utM_Content,
          utM_Term: utM_Term,
          utM_Placement: utM_Placement,
          ref_url:ref_Url,
          stage: reportData.actions,       
      };
      getHRPopUpReportList(params);
    },
    [hrStage, firstDay, lastDay, appliedFilter, isFocusedRole]
  );

  const tableColumnsMemo = useMemo(
    () => reportConfig.UTMPopupReportConfig(),
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
        (val) =>
          val.key !== "action" && (obj[`${val.title}`] = data[`${val.key}`])
      );
      return obj;
    });
    downloadToExcel(DataToExport, `UTMTrackingReport: ${hrStage} => ${moment(startDate).format("YYYY-MM-DD")}/${ moment(endDate).format("YYYY-MM-DD")}`);
  };

  return (
    <div className={utmTrackingReportStyle.dealContainer}>
      <div className={utmTrackingReportStyle.header}>
        <div className={utmTrackingReportStyle.dealLable}>UTM Tracking Report</div>
        <LogoLoader visible={isLoading} />
      </div>

      <div className={utmTrackingReportStyle.filterContainer}>
        <div className={utmTrackingReportStyle.filterSets}>
          <div className={utmTrackingReportStyle.filterSetsInner}>
            <div
              className={utmTrackingReportStyle.addFilter}
              onClick={toggleClientFilter}
            >
              <FunnelSVG style={{ width: "16px", height: "16px" }} />

              <div className={utmTrackingReportStyle.filterLabel}>Add Filters</div>
              <div className={utmTrackingReportStyle.filterCount}>
                {filteredTagLength}
              </div>
            </div>
            <p 
            onClick={() => resetFilter()}
            >Reset Filters</p>
          </div>

          <div className={utmTrackingReportStyle.filterRight}>
            {/* <Checkbox
              checked={isFocusedRole}
              onClick={() => setIsFocusedRole((prev) => !prev)}
            >
              Show only Focused Role
            </Checkbox> */}
            <div className={utmTrackingReportStyle.calendarFilterSet}>
              {dateError && (
                <p className={utmTrackingReportStyle.error}>
                  * Start and End dates can't be same{" "}
                </p>
              )}
              <div className={utmTrackingReportStyle.label}>Date</div>
              <div className={utmTrackingReportStyle.calendarFilter}>
                <CalenderSVG style={{ height: "16px", marginRight: "16px" }} />
                <DatePicker
                  style={{ backgroundColor: "red" }}
                  onKeyDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className={utmTrackingReportStyle.dateFilter}
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
              className={utmTrackingReportStyle.btnPrimary}
              onClick={() => resetFilter()}
            >
              Reset
            </button> */}
          </div>
        </div>
      </div>
      <div className={utmTrackingReportStyle.i2sContainer} style={{ width: "50%" }}>
        <div className={utmTrackingReportStyle.cardWrapper}>
          <div className={utmTrackingReportStyle.cardTitle}>
            <div>Actions</div>
            {/* <div>Value</div> */}
            <div>Value</div>
          </div>
          <ul className={utmTrackingReportStyle.cardInner}>
            {reportList?.map((report) => (
              <li className={utmTrackingReportStyle.row}>
                 <div className={utmTrackingReportStyle.rowLabel}>{report.actions}</div>
                {/* <div className={utmTrackingReportStyle.rowLabel}>{report.value}</div> */}
                <div className={utmTrackingReportStyle.rowValue}>                
                {report.value > 0 ? (
                    <p
                      className={utmTrackingReportStyle.textLink}
                      onClick={() => {
                        setTableData(report);                        
                      }}
                    >
                      {report.value}
                    </p>
                  ) : (
                    <p>{report.value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {reportPopupList.length > 0 && (
        <div className={utmTrackingReportStyle.i2sContainer}>
          {isLoading ? (
            <div style={{ height: "200px", overflow: "hidden" }}>
              <TableSkeleton />
            </div>
          ) : (
            <>
              <div className={utmTrackingReportStyle.exportAction}>
                <h3 className={utmTrackingReportStyle.cardTitle}>
                UTM Tracking Report : {hrStage}
                </h3>

                <button
                  className={utmTrackingReportStyle.btnPrimary}
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
            filtersType={reportConfig.UTMReportFilterTypeConfig(
              filtersList && filtersList
            )}
            clearFilters={resetFilter}
          />
        </Suspense>
      )}
    </div>
  );
}
