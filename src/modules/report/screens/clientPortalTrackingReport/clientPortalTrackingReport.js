import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  Suspense,
} from "react";
import clientPortalTrackingReportStyle from "./clientPortalTrackingReport.module.css";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import DatePicker from "react-datepicker";
import { ReactComponent as FunnelSVG } from "assets/svg/funnel.svg";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation, useNavigate } from "react-router-dom";

import { clientReport } from "core/clientReport/clientReportDAO";
import { reportConfig } from "modules/report/report.config";
import { HTTPStatusCode } from "constants/network";
import UTSRoutes from "constants/routes";
import { Table, Checkbox, Select, Tooltip } from "antd";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import moment from "moment";
import { downloadToExcel } from "modules/report/reportUtils";
import LogoLoader from "shared/components/loader/logoLoader";
import { clientPortalTrackingReportDAO } from "core/clientPortalTrackingReport/clientPoralTrackingReportDAO";
import { clientPortalTrackingReportAPI } from "apis/clientPortalTrackingReportAPI";
import { utmTrackingReportAPI } from "apis/utmTrackingReportAPI";
import { utmTrackingReportDAO } from "core/utmTrackingReport/utmTrackingReportDAO";
import infoIcon from "../../../../assets/svg/info.svg"
import { DealConfig } from "modules/deal/deal.config";
import { hiringRequestDAO } from "core/hiringRequest/hiringRequestDAO";
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
  const [hrStageId, setHRStageId] = useState("");
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
  const [selectedClientName, setSelectClientName] = useState()
  const [ClientNameList,setClientNameList] = useState([])
  const [filtersSalesRepo, setFiltersSalesRepo] = useState([]);
  const [filtersHRType, setFiltersHRType] = useState([]);
  // const client = localStorage.getItem("clientID");
  const clientID = Number(0);

  const location = useLocation();
  const data = location.state; 

  // const [utmTrackingListList, setutmTrackingListList] = useState([]); 

  const [tableFilteredState, setTableFilteredState] = useState({
    totalrecord: 100,
    pagenumber: 1,
  });

  // const getUTMTrackingList = async()  =>{
  //   const res = await utmTrackingReportDAO.getutmTrackingReportDAO(data);
  //   setutmTrackingListList(res?.responseBody?.details);
  // }

  var date = new Date();

  var firstDay =
    startDate !== null
      ? startDate
      : new Date(date.getFullYear(), date.getMonth(), date.getDate()-7);
  var lastDay = endDate !== null ? endDate : new Date(date);

  const getClientPortalReportList = async (params) => {
    setLoading(true);
    const response = await clientPortalTrackingReportDAO.clientPortalTrackingReportListDAO(params);
    if (response.statusCode === HTTPStatusCode.OK) {
      let details = response.responseBody.details;
      setReportList(details);
      setReportPopupList([]);
      setLoading(false);
    }else if (response?.statusCode === HTTPStatusCode.NOT_FOUND){
      setReportList([]);
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

  const getClientPortalPopUpReportList = async (params) => {
    setLoading(true);
    const response = await clientPortalTrackingReportDAO.clientPortalTrackingReportPopupListDAO(params);
    if (response.statusCode === HTTPStatusCode.OK) {
      let details = response.responseBody.details;
      setReportPopupList(details);
      setLoading(false);
    } else if (response?.statusCode === HTTPStatusCode.NOT_FOUND){
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

  // const getUTMReportFilterList = async () => {
  //   setLoading(true);
  //   const response = await utmTrackingReportAPI.utmTrackingReportFilters();
  //   if (response.statusCode === HTTPStatusCode.OK) {
  //     let details = response.responseBody.details?.Data;
  //     setFiltersList(details);
  //     setLoading(false);
  //   } else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
  //     setLoading(false);
  //     return navigate(UTSRoutes.LOGINROUTE);
  //   } else if (response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
  //     setLoading(false);
  //     return navigate(UTSRoutes.SOMETHINGWENTWRONG);
  //   } else {
  //     setLoading(false);
  //     return "NO DATA FOUND";
  //   }
  // };


  // const allDropdownsList = () =>{
  //   setNumOfJobs(filtersList && filtersList?.get_JobPostCount_For_UTM_Tracking_Lead?.map(item=>({id:item?.value,value:item?.value})));
  //   setRefURL(filtersList && filtersList?.ref_Url?.map((item)=>({id:item?.text,value:item?.value})));
  //   setCampaign(filtersList && filtersList?.utM_Campaign?.map((item)=>({id:item?.text,value:item?.value})));
  //   setContent(filtersList && filtersList?.utM_Content?.map((item)=>({id:item?.text,value:item?.value})));
  //   setMedium(filtersList && filtersList?.utM_Medium?.map((item)=>({id:item?.text,value:item?.value})));
  //   sePlacement(filtersList && filtersList?.utM_Placement?.map((item)=>({id:item?.text,value:item?.value})));
  //   setSource(filtersList && filtersList?.utM_Source?.map((item)=>({id:item?.text,value:item?.value})));
  //   setTerm(filtersList && filtersList?.utM_Term?.map((item)=>({id:item?.text,value:item?.value})));
  // }

  const [typeofHR,setTypeofHR] = useState();

  const handleFiltersRequest = useCallback(
    (reqFilter) => {
      let fd = reqFilter.filterFields_DealList;
      let TypeOfHR = fd["TypeOfHR"] ? fd["TypeOfHR"] : "";
      setTypeofHR(TypeOfHR);

      let params = {
        fromDate: moment(firstDay).format("YYYY-MM-DD"),
        toDate: moment(lastDay).format("YYYY-MM-DD"),
        typeOfHR: TypeOfHR,
        clientID:clientID ?Number(clientID):0
      };

      // if (hrStage) {
        getClientPortalReportList(params);
      // }
    },
    [clientID, firstDay, lastDay, appliedFilter, isFocusedRole,selectedClientName]
  );

  useEffect(() => {
    let payload = {
      fromDate: moment(firstDay).format("YYYY-MM-DD"),
      toDate: moment(lastDay).format("YYYY-MM-DD"),
        // NoOfJobs: null,
        clientID:0
    };
    // getClientPortalReportList(payload);
    // getClientNameFilter();
    // getUTMTrackingList(data);
    if(clientID !== 0){
      setSelectClientName(Number(clientID));
    }else{
      setSelectClientName();
    }
    setStartDate(firstDay);
    setEndDate(lastDay);
  }, [clientID]);

  // useEffect(() => {
  //   allDropdownsList();
  // }, [filtersList])

  useEffect(() => {
      let payload = {
         fromDate: moment(firstDay).format("YYYY-MM-DD"),
         toDate: moment(lastDay).format("YYYY-MM-DD"),
         clientID:clientID ?Number(clientID):0,
         typeOfHR:typeofHR,
       };
       if(data){
        setStartDate(data?.fromDate ? moment(data.fromDate).toDate() : null);
        setEndDate(data?.toDate ? moment(data.toDate).toDate() : null);
        setSelectClientName(data?.clientID === 0 ? null : data?.clientID)
        getClientPortalReportList(data);
       }else{
          getClientPortalReportList(payload);
       }
  }, [clientID,data,typeofHR]);

  const onCalenderFilter = useCallback(
    (dates) => {
      const [start, end] = dates;

      setStartDate(start);
      setEndDate(end);

      if (start && end) {
        let payload = {
          fromDate: moment(start).format("YYYY-MM-DD"),
          toDate: moment(end).format("YYYY-MM-DD"),
          clientID:selectedClientName ? Number(selectedClientName) : 0,
          typeOfHR:typeofHR,
        };
        getClientPortalReportList(payload);
      }

      // if (start.toLocaleDateString() === end.toLocaleDateString()) {
      //   let params = {
      //     fromDate: new Date(
      //       date.getFullYear(),
      //       date.getMonth(),
      //       date.getDate()-7
      //     ),
      //     toDate: new Date(date),
      //   };
      //   setStartDate(params.fromDate);
      //   setEndDate(params.toDate);
      //   setDateError(true);
      //   setTimeout(() => setDateError(false), 5000);
      //   return;
      // } else {
      //   if (start && end) {
      //     let payload = {
      //       fromDate: moment(start).format("YYYY-MM-DD"),
      //       toDate: moment(end).format("YYYY-MM-DD"),
      //       clientID:selectedClientName ? Number(selectedClientName) : 0
      //     };
      //     getClientPortalReportList(payload);
      //   }
      // }
    },
    [hrStage, appliedFilter, isFocusedRole,selectedClientName,typeofHR]
  );
  const resetFilter = () => {
    setSelectClientName();
    let params = {
      fromDate: new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()-7
      ),
      toDate: new Date(date),
    };
    setStartDate(params.fromDate);
    setEndDate(params.toDate);

    setAppliedFilters(new Map());
    setCheckedState(new Map());
    setFilteredTagLength(0);
    setIsFocusedRole(false);
    setTypeofHR("");

    let payload = {
      // pageIndex: 1,
      // pageSize: 0,
  
      fromDate: moment(params.fromDate).format("YYYY-MM-DD"),
      toDate: moment(params.toDate).format("YYYY-MM-DD"),
      clientID:0,
      typeOfHR:"",
    };
    getClientPortalReportList(payload);
    onRemoveDealFilters();
    // getI2SReport(params);
  };

  const setTableData = useCallback(
    (reportData) => {   
      setHRStage(reportData.actions);
      setHRStageId(reportData?.actionID)
      let params = {     
          fromDate: moment(firstDay).format("YYYY-MM-DD"),
          toDate: moment(lastDay).format("YYYY-MM-DD"),
          actionID:reportData?.actionID,
          clientID:selectedClientName?Number(selectedClientName):0,
          typeOfHR:typeofHR,
      };
      getClientPortalPopUpReportList(params);
    },
    [hrStage, firstDay, lastDay, appliedFilter, isFocusedRole,selectedClientName,typeofHR]
  );

  const tableColumnsMemo = useMemo(
    () => reportConfig.ClientPortalPopupReportConfig(hrStageId),
    [hrStage,hrStageId]
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
    downloadToExcel(DataToExport, `ClientPortalTrackingReport: ${hrStage}_${moment(startDate).format("YYYY-MM-DD")}/${ moment(endDate).format("YYYY-MM-DD")}.xlsx`);
  };

  const getClientNameFilter = useCallback(async () => {
    setLoading(true);
    const response = await clientPortalTrackingReportDAO.clientPortalTrackingReportFilterDAO();
    if (response?.statusCode === HTTPStatusCode.OK) {   
      // setFiltersList(response && response?.responseBody?.details?.Data);
      // setHRTypesList(response && response?.responseBody?.details?.Data.hrTypes.map(i => ({id:i.text, value:i.value})))
      setClientNameList(response && response?.responseBody?.details?.ClientList?.map(i=>({value:i?.clientID,label:i?.clientName})))
      setFiltersHRType(response?.responseBody?.details?.model?.hrTypes?.map(item =>{
        return ({
				text : item?.text,
				value : item?.value
			})}))
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
  }, [navigate]);
  
  useEffect(() => {
    getClientNameFilter();
  }, [getClientNameFilter]);

  const changeClientName = (value)=>{
    let payload = {
      fromDate: moment(firstDay).format("YYYY-MM-DD"),
      toDate: moment(lastDay).format("YYYY-MM-DD"),
      clientID:value?value:0,
      typeOfHR:typeofHR,
    };
    setSelectClientName(value)
    getClientPortalReportList(payload);
  }

  // const getHRReportFilterList = async () => {
  //   setLoading(true);
  //   const response = await clientReport.getHRReportFilters();
  //   if (response.statusCode === HTTPStatusCode.OK) {
  //     let details = response.responseBody.details;
  //     // console.log("filter data", details)
  //     setFiltersList(details);
  //     setLoading(false);
  //   } else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
  //     setLoading(false);
  //     return navigate(UTSRoutes.LOGINROUTE);
  //   } else if (response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
  //     setLoading(false);
  //     return navigate(UTSRoutes.SOMETHINGWENTWRONG);
  //   } else {
  //     setLoading(false);
  //     return "NO DATA FOUND";
  //   }
  // };

  // useEffect(() => {
  //   getHRReportFilterList();
  // }, [])

  // const getEngagementFilterList = useCallback(async () => {
	// 	const res = await hiringRequestDAO.getAllFilterDataForHRRequestDAO();
	// 	if (res?.statusCode === HTTPStatusCode.OK) {
	// 		setFiltersSalesRepo(res?.responseBody?.details?.Data?.salesReps?.map(item =>({
	// 			text : item?.text,
	// 			value : item?.value
	// 		})))

  //     setFiltersHRType(res?.responseBody?.details?.Data?.hrTypes?.map(item =>{
  //       return ({
	// 			text : item?.text,
	// 			value : item?.value
	// 		})}))
	// 	}
	// }, []);

  // useEffect(()=>{
	// 	getEngagementFilterList();
	// },[getEngagementFilterList])
  
  return (
    <div className={clientPortalTrackingReportStyle.dealContainer}>
      <div className={clientPortalTrackingReportStyle.header}>
        <div className={clientPortalTrackingReportStyle.dealLable}>Client Tracking Details</div>
        <LogoLoader visible={isLoading} />
      </div>

      <div className={clientPortalTrackingReportStyle.filterContainer}>
        <div className={clientPortalTrackingReportStyle.filterSets}>
          <div className={clientPortalTrackingReportStyle.filterLeft}>
            <div className={clientPortalTrackingReportStyle.filterSetsInner}>
                <div
                  className={clientPortalTrackingReportStyle.addFilter}
                  onClick={toggleClientFilter}
                >
                  <FunnelSVG style={{ width: "16px", height: "16px" }} />

                  <div className={clientPortalTrackingReportStyle.filterLabel}>Add Filters</div>
                  <div className={clientPortalTrackingReportStyle.filterCount}>
                    {filteredTagLength}
                  </div>
                </div>
            </div>
            <div className={clientPortalTrackingReportStyle.filterSetsInner}>
            <Select
              // defaultValue="lucy"
              style={{ width: 400 }}
              // onSelect={(value)=>{
              //   setSelectClientName(value);   
              // }}
              onChange={(value)=>{
                changeClientName(value);   
              }}
              filterOption={(inputValue, option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1}
              placeholder="Select client name"
              options={ClientNameList}
              showSearch
              value={selectedClientName}
            />
              <p 
              onClick={() => resetFilter()}
              >Reset Filters</p>
            </div>
          </div>

          <div className={clientPortalTrackingReportStyle.filterRight}>
            {/* <Checkbox
              checked={isFocusedRole}
              onClick={() => setIsFocusedRole((prev) => !prev)}
            >
              Show only Focused Role
            </Checkbox> */}
            <div className={clientPortalTrackingReportStyle.calendarFilterSet}>
              {dateError && (
                <p className={clientPortalTrackingReportStyle.error}>
                  * Start and End dates can't be same{" "}
                </p>
              )}
              <div className={clientPortalTrackingReportStyle.label}>Date</div>
              <div className={clientPortalTrackingReportStyle.calendarFilter}>
                <CalenderSVG style={{ height: "16px", marginRight: "16px" }} />
                <DatePicker
                  style={{ backgroundColor: "red" }}
                  onKeyDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className={clientPortalTrackingReportStyle.dateFilter}
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
              className={clientPortalTrackingReportStyle.btnPrimary}
              onClick={() => resetFilter()}
            >
              Reset
            </button> */}
          </div>
        </div>
      </div>
      <div className={clientPortalTrackingReportStyle.i2sContainer} style={{ width: "50%" }}>
        <div className={clientPortalTrackingReportStyle.cardWrapper}>
          <div className={clientPortalTrackingReportStyle.cardTitle}>
            <div>Actions</div>
            {/* <div>Value</div> */}
            <div>Value</div>
          </div>
          <ul className={clientPortalTrackingReportStyle.cardInner}>
            {reportList?.map((report) => (
              <li className={clientPortalTrackingReportStyle.row}>
                <div className={clientPortalTrackingReportStyle.LeftTextWrap}>
                 <div className={clientPortalTrackingReportStyle.rowLabel}>{report.actions}</div>
                 {report.actionID===3 && 
                  <Tooltip 	placement="bottomLeft"
                 title= "These are profiles that have been rejected, accompanied by appropriate reasons for rejection, excluding cases where the talent status change to rejection involves Pay per credit/pay per view talent.">
                   <img src={infoIcon} alt='info'/> 
                 </Tooltip>
                 }
                 </div>
                <div className={clientPortalTrackingReportStyle.rowValue}>                
                {report.totalRecords > 0 ? (
                    <p
                      className={clientPortalTrackingReportStyle.textLink}
                      onClick={() => {
                        setTableData(report);                        
                      }}
                    >
                      {report.totalRecords}
                    </p>
                  ) : (
                    <p>{report.totalRecords}</p>
                  )}
                </div>
              </li>
            ))}
            {reportList?.length === 0 && <div className={clientPortalTrackingReportStyle.noDataFoundText}>No Data Available</div>}
          </ul>
        </div>
      </div>

      {reportPopupList.length > 0 && (
        <div className={clientPortalTrackingReportStyle.i2sContainer}>
          {isLoading ? (
            <div style={{ height: "200px", overflow: "hidden" }}>
              <TableSkeleton />
            </div>
          ) : (
            <>
              <div className={clientPortalTrackingReportStyle.exportAction}>
                <h3 className={clientPortalTrackingReportStyle.cardTitle}>
                Client Tracking Details : {hrStage}
                </h3>

                <button
                  className={clientPortalTrackingReportStyle.btnPrimary}
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
            filtersType={reportConfig.ClientTrackingReportFilterTypeConfig(
              filtersList && filtersList, filtersHRType && filtersHRType
            )}
            clearFilters={resetFilter}
          />
        </Suspense>
      )}
    </div>
  );
}
