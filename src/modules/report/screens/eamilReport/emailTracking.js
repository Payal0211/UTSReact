import React, {
    useEffect,
    useState,
    useMemo,
    useCallback,
    Suspense,
  } from "react";
  import emailReportStyle from "./emailReport.module.css";
  import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
  import DatePicker from "react-datepicker";
  import { ReactComponent as FunnelSVG } from "assets/svg/funnel.svg";
  import "react-datepicker/dist/react-datepicker.css";
  import { useNavigate } from "react-router-dom";
  
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
 



export default function EmailTracking() {

    const navigate = useNavigate();
    const [dateError, setDateError] = useState(false);

    var date = new Date();
    const [startDate, setStartDate] = useState(new Date(date.getFullYear(), date.getMonth(), date.getDate()-7));
    const [endDate, setEndDate] = useState(new Date(date));
    var firstDay =
    startDate !== null
      ? startDate
      : new Date(date.getFullYear(), date.getMonth(), date.getDate()-7);
  var lastDay = endDate !== null ? endDate : new Date(date);
  
    const [isLoading, setLoading] = useState(false);
    const [reportList, setReportList] = useState([]);
    const [hrStage, setHRStage] = useState("");
    const [reportPopupList, setReportPopupList] = useState([]);


    const [filteredTagLength, setFilteredTagLength] = useState(0);
    const [appliedFilter, setAppliedFilters] = useState(new Map());
    const [checkedState, setCheckedState] = useState(new Map());
    const [isFocusedRole, setIsFocusedRole] = useState(false);

    const [selectedClientName, setSelectClientName] = useState()
    const [ClientNameList,setClientNameList] = useState([])
    const client = localStorage.getItem("CompanyID");
    const CompanyID = Number(client);

    
    const getClientNameFilter = useCallback(async () => {
        setLoading(true);
        const response = await clientPortalTrackingReportDAO.clientPortalTrackingReportFilterDAO();
        if (response?.statusCode === HTTPStatusCode.OK) {
          // setFiltersList(response && response?.responseBody?.details?.Data);
          // setHRTypesList(response && response?.responseBody?.details?.Data.hrTypes.map(i => ({id:i.text, value:i.value})))
          setClientNameList(response && response?.responseBody?.details?.map(i=>({value:i?.clientID,label:i?.clientName})))
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



  const getEmailReport = async ()=>{
        setLoading(true);
        let payload = {
          fromDate: moment(startDate).format("YYYY-MM-DD"),
          toDate: moment(endDate).format("YYYY-MM-DD"),
          CompanyID:selectedClientName ? Number(selectedClientName) : 0
        };

        let response = await clientReport.getEmailRequestList(payload)

        console.log("email rep list",response)
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
  }

  useEffect(()=>{
    if(startDate && endDate){
        getEmailReport()
    }
    },[startDate, endDate, selectedClientName])


    const onCalenderFilter = useCallback(
        (dates) => {
          const [start, end] = dates;
    
          setStartDate(start);
          setEndDate(end);
    
        //   if (start && end) {
        //     let payload = {
        //       fromDate: moment(start).format("YYYY-MM-DD"),
        //       toDate: moment(end).format("YYYY-MM-DD"),
        //       CompanyID:selectedClientName ? Number(selectedClientName) : 0
        //     };
        //     // getClientPortalReportList(payload);
        //   }
        },
        [hrStage, appliedFilter, isFocusedRole,selectedClientName]
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
    
        let payload = {
          // pageIndex: 1,
          // pageSize: 0,
      
          fromDate: moment(params.fromDate).format("YYYY-MM-DD"),
          toDate: moment(params.toDate).format("YYYY-MM-DD"),
          CompanyID:0
    
        };
        // getClientPortalReportList(payload);
        // onRemoveDealFilters();
        // getI2SReport(params);
    };

    const changeClientName = (value)=>{
        let payload = {
        fromDate: moment(firstDay).format("YYYY-MM-DD"),
        toDate: moment(lastDay).format("YYYY-MM-DD"),
        CompanyID:value?value:0
        };
        setSelectClientName(value)
        // getClientPortalReportList(payload);
    }

    const getEmailPopUpReportList = async (payload)=>{
        setLoading(true);
        const response = await clientReport.emailReportPopupListDAO(payload);
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
    }

    const tableColumnsMemo = useMemo(
        () => reportConfig.EmailPopupReportConfig(),
        []
      );

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

    const setTableData = useCallback(
        (reportData) => {   
          setHRStage(reportData.eventType);
          let params = {     
              fromDate: moment(firstDay).format("YYYY-MM-DD"),
              toDate: moment(lastDay).format("YYYY-MM-DD"),
              eventType:reportData?.eventType,
              CompanyID:selectedClientName?Number(selectedClientName):0
          };
        //   console.log(params,reportData);

          getEmailPopUpReportList(params);
        },
        [hrStage, firstDay, lastDay, appliedFilter, isFocusedRole,selectedClientName]
      );

  return (
    <div className={emailReportStyle.dealContainer}>
    <div className={emailReportStyle.header}>
      <div className={emailReportStyle.dealLable}>Email Tracking Details</div>
      <LogoLoader visible={isLoading} />
    </div>

    <div className={emailReportStyle.filterContainer}>
      <div className={emailReportStyle.filterSets}>
        <div className={emailReportStyle.filterSetsInner}>
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
          {/* <div
            className={emailReportStyle.addFilter}
            onClick={toggleClientFilter}
          >1
            <FunnelSVG style={{ width: "16px", height: "16px" }} />

            <div className={emailReportStyle.filterLabel}>Add Filters</div>
            <div className={emailReportStyle.filterCount}>
              {filteredTagLength}
            </div>
          </div> */}
          <p 
          onClick={() => resetFilter()}
          >Reset Filters</p>
        </div>

        <div className={emailReportStyle.filterRight}>
          {/* <Checkbox
            checked={isFocusedRole}
            onClick={() => setIsFocusedRole((prev) => !prev)}
          >
            Show only Focused Role
          </Checkbox> */}
          <div className={emailReportStyle.calendarFilterSet}>
            {dateError && (
              <p className={emailReportStyle.error}>
                * Start and End dates can't be same{" "}
              </p>
            )}
            <div className={emailReportStyle.label}>Date</div>
            <div className={emailReportStyle.calendarFilter}>
              <CalenderSVG style={{ height: "16px", marginRight: "16px" }} />
              <DatePicker
                style={{ backgroundColor: "red" }}
                onKeyDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className={emailReportStyle.dateFilter}
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
            className={emailReportStyle.btnPrimary}
            onClick={() => resetFilter()}
          >
            Reset
          </button> */}
        </div>
      </div>
    </div>

    <div className={emailReportStyle.i2sContainer} style={{ width: "50%" }}>
        <div className={emailReportStyle.cardWrapper}>
          <div className={emailReportStyle.cardTitle}>
            <div>Actions</div>
            {/* <div>Value</div> */}
            <div>Value</div>
          </div>
          <ul className={emailReportStyle.cardInner}>
            {reportList?.map((report) => (
              <li className={emailReportStyle.row}>
                <div className={emailReportStyle.LeftTextWrap}>
                 <div className={emailReportStyle.rowLabel}>{report.eventType}</div>
                 </div>
                <div className={emailReportStyle.rowValue}>                
                {report.totalRecords > 0 ? (
                    <p
                      className={emailReportStyle.textLink}
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
            {reportList?.length === 0 && <div className={emailReportStyle.noDataFoundText}>No Data Available</div>}
          </ul>
        </div>
      </div>


      {reportPopupList.length > 0 && (
        <div className={emailReportStyle.i2sContainer}>
          {isLoading ? (
            <div style={{ height: "200px", overflow: "hidden" }}>
              <TableSkeleton />
            </div>
          ) : (
            <>
              <div className={emailReportStyle.exportAction}>
                <h3 className={emailReportStyle.cardTitle}>
                Client Tracking Details : {hrStage}
                </h3>

                <button
                  className={emailReportStyle.btnPrimary}
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
   </div> 
  )
}
