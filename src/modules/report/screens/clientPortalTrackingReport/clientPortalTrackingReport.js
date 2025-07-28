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
import { reportConfig } from "modules/report/report.config";
import { HTTPStatusCode } from "constants/network";
import UTSRoutes from "constants/routes";
import { Table, Select, Tooltip } from "antd";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import moment from "moment";
import { downloadToExcel } from "modules/report/reportUtils";
import LogoLoader from "shared/components/loader/logoLoader";
import { clientPortalTrackingReportDAO } from "core/clientPortalTrackingReport/clientPoralTrackingReportDAO";
import infoIcon from "../../../../assets/svg/info.svg"
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
  const [isAllowFilters, setIsAllowFilters] = useState(false);
  const [filteredTagLength, setFilteredTagLength] = useState(0);
  const [appliedFilter, setAppliedFilters] = useState(new Map());
  const [checkedState, setCheckedState] = useState(new Map());
  const [isFocusedRole, setIsFocusedRole] = useState(false);
  const [selectedClientName, setSelectClientName] = useState()
  const [ClientNameList,setClientNameList] = useState([])
  const [filtersHRType, setFiltersHRType] = useState([]);
  const [clientid,setClientid] = useState();
  const clientID = Number(0);

  const location = useLocation();
  const data = location.state; 


  const [tableFilteredState, setTableFilteredState] = useState({
    totalrecord: 100,
    pagenumber: 1,
  });

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

  const [typeofHR,setTypeofHR] = useState();

  const handleFiltersRequest = useCallback(
    (reqFilter) => {
      let fd = reqFilter.filterFields_DealList;
      let TypeOfHR = fd["TypeOfHR"] ? fd["TypeOfHR"] : "";
      setTypeofHR(TypeOfHR);

      let params = {};
      if(clientID === 0){
          params.fromDate= moment(firstDay).format("YYYY-MM-DD");
          params.toDate= moment(lastDay).format("YYYY-MM-DD");
          params.typeOfHR= TypeOfHR;
          params.clientID=clientid ?Number(clientid):0
      }else {
          params.fromDate= moment(firstDay).format("YYYY-MM-DD");
          params.toDate= moment(lastDay).format("YYYY-MM-DD");
          params.typeOfHR= TypeOfHR;
          params.clientID=clientID ?Number(clientID):0
      };
      if(selectedClientName){
        params.fromDate= moment(firstDay).format("YYYY-MM-DD");
          params.toDate= moment(lastDay).format("YYYY-MM-DD");
          params.typeOfHR= TypeOfHR;
          params.clientID=selectedClientName ?Number(selectedClientName):0
      }
      getClientPortalReportList(params);
    },
    
    [clientid,clientID,appliedFilter, isFocusedRole,selectedClientName]
  );

  useEffect(() => { 
   
    if(clientID !== 0){
      setSelectClientName(Number(clientID));
    }else{
      setSelectClientName();
    }
    setStartDate(firstDay);
    setEndDate(lastDay);
  }, [clientID]);

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
  }, [clientID,data]);

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
      fromDate: moment(params.fromDate).format("YYYY-MM-DD"),
      toDate: moment(params.toDate).format("YYYY-MM-DD"),
      clientID:0,
      typeOfHR:"",
    };
    getClientPortalReportList(payload);
    onRemoveDealFilters();
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
    downloadToExcel(DataToExport, `ClientPortalTrackingReport: ${hrStage}_${moment(startDate).format("YYYY-MM-DD")}/${ moment(endDate).format("YYYY-MM-DD")}`);
  };

  const getClientNameFilter = useCallback(async () => {
    setLoading(true);
    const response = await clientPortalTrackingReportDAO.clientPortalTrackingReportFilterDAO();
    if (response?.statusCode === HTTPStatusCode.OK) {   
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
    setClientid(value);
    let payload = {
      fromDate: moment(firstDay).format("YYYY-MM-DD"),
      toDate: moment(lastDay).format("YYYY-MM-DD"),
      clientID:value?value:0,
      typeOfHR:typeofHR,
    };
    setSelectClientName(value)
    getClientPortalReportList(payload);
  }
 
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
              style={{ width: 400 }}
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
          </div>
        </div>
      </div>
      <div className={clientPortalTrackingReportStyle.i2sContainer} style={{ width: "50%" }}>
        <div className={clientPortalTrackingReportStyle.cardWrapper}>
          <div className={clientPortalTrackingReportStyle.cardTitle}>
            <div>Actions</div>
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
            filtersType={reportConfig.ClientTrackingReportFilterTypeConfig( filtersHRType && filtersHRType)}
            clearFilters={resetFilter}
          />
        </Suspense>
      )}
    </div>
  );
}
