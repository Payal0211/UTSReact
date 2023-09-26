import { Link } from "react-router-dom";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import { ReactComponent as FunnelSVG } from "assets/svg/funnel.svg";
import { ReactComponent as SearchSVG } from "assets/svg/search.svg";
import { IoChevronDownOutline } from "react-icons/io5";
import I2SReport from "./I2SReportStyle.module.css";
import { Modal, Checkbox } from "antd";
import I2SPopupModal from "modules/report/components/i2sPopupModal/i2sPopupModal";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { DealDAO } from "core/deal/dealDAO";
import { I2SReports } from "core/i2s/i2sDAO";
import UTSRoutes from "constants/routes";

import { InputType } from "constants/application";

import { DealConfig } from "modules/deal/deal.config";
import { dealUtils } from "modules/deal/dealUtils";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import WithLoader from "shared/components/loader/loader";
import { HTTPStatusCode } from "constants/network";

const I2sReport = () => {
  const [tableFilteredState, setTableFilteredState] = useState({
    totalrecord: 100,
    pagenumber: 1,
  });
  const pageSizeOptions = [100, 200, 300, 500];
  const [dealList, setDealList] = useState([]);
  const [I2SList, setI2SList] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [getHTMLFilter, setHTMLFilter] = useState(false);
  const [filtersList, setFiltersList] = useState([]);
  const [pageSize, setPageSize] = useState(100);
  const [isAllowFilters, setIsAllowFilters] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [filteredTagLength, setFilteredTagLength] = useState(0);
  const [appliedFilter, setAppliedFilters] = useState(new Map());
  const [checkedState, setCheckedState] = useState(new Map());
  const [i2sPopupModal, seti2sPopupModal] = useState(false);
  const [popupData, setPopupData] = useState({});
  const [isFocusedRole, setIsFocusedRole] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setSearch(debouncedSearch), 1000);
    return () => clearTimeout(timer);
  }, [debouncedSearch]);

  /*--------- React DatePicker ---------------- */
  var date = new Date();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
const [dateError, setDateError] = useState(false);
 

   var firstDay =
    startDate !== null
      ? startDate
      : new Date(date.getFullYear(), date.getMonth() - 1, date.getDate()); 
  var lastDay =
    endDate !== null
      ? endDate
      : new Date(date);

      useEffect(() => {
        getI2SReport();
        setStartDate(firstDay)
        setEndDate(lastDay)
      }, []);

  const resetFilter = () => {
    let params = {
      fromDate: new Date(date.getFullYear(), date.getMonth() - 1, date.getDate()),
      toDate: new Date(date),
      isHrfocused: false,
    }
    setIsFocusedRole(false)
    setStartDate(params.fromDate);
    setEndDate(params.toDate);
    getI2SReport(params);
  };

  const getI2SReport = useCallback(async (params) => {
    setLoading(true);
    let data = {
      startDate: params?.fromDate
        ? params?.fromDate.toLocaleDateString("en-US")
        : new Date(firstDay).toLocaleDateString("en-US"),
      endDate: params?.toDate
        ? params?.toDate.toLocaleDateString("en-US")
        : new Date(lastDay).toLocaleDateString("en-US"),
      isHrfocused: isFocusedRole,
    };
    const response = await I2SReports.getI2SRepoetList(data);
    if (response.statusCode === HTTPStatusCode.OK) {
      let details = response.responseBody.details;
      let teamNames = [];
      details.forEach((team) => {
        if (!teamNames.includes(team.teamName)) {
          teamNames.push(team.teamName);
        }
      });

      let teamArray = teamNames.map((teamName) => ({
        [teamName]: details.filter((team) => team.teamName === teamName),
      }));
      setI2SList(teamArray);
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
  },[isFocusedRole])

  useEffect(()=>{
    getI2SReport()
  },[isFocusedRole,getI2SReport])

  const onCalenderFilter = (dates) => {
    const [start, end] = dates;

    setStartDate(start);
    setEndDate(end);

    if (start.toLocaleDateString() === end.toLocaleDateString()) {
      let params = {
        fromDate: new Date(date.getFullYear(), date.getMonth() - 1, date.getDate()),
        toDate: new Date(date),
      }
      setStartDate(params.fromDate);
      setEndDate(params.toDate);
      setDateError(true)
      setTimeout(()=>setDateError(false) , 5000)
      return;
    }else{
      if (start && end) {
      // setTableFilteredState({
      //   ...tableFilteredState,
      //   filterFields_ViewAllHRs: {
      //     fromDate: new Date(start).toLocaleDateString("en-US"),
      //     toDate: new Date(end).toLocaleDateString("en-US"),
      //   },
      // });
      // handleDealRequest({
      //   ...tableFilteredState,
      //   filterFields_ViewAllHRs: {
      //     fromDate: new Date(start).toLocaleDateString("en-US"),
      //     toDate: new Date(end).toLocaleDateString("en-US"),
      //   },
      // });
      getI2SReport({
        fromDate: new Date(start),
        toDate: new Date(end),
      });
    }
    }
    
  };
  return (
    <div className={I2SReport.dealContainer}>
      <div className={I2SReport.header}>
        <div className={I2SReport.dealLable}>Interview To Success</div>
      </div>
      {/*
       * --------- Filter Component Starts ---------
       * @Filter Part
       */}
      <div className={I2SReport.filterContainer}>
        <div className={I2SReport.filterSets}>
          <div className={I2SReport.filterRight}>
          <Checkbox
              checked={isFocusedRole}
              onClick={() => setIsFocusedRole((prev) => !prev)}
            >
              Show only Focused Role
            </Checkbox>
            <div className={I2SReport.calendarFilterSet}>
              {dateError &&  <p className={I2SReport.error}>* Start and End dates can't be same </p>}
              <div className={I2SReport.label}>Date</div>
              <div className={I2SReport.calendarFilter}>
                <CalenderSVG style={{ height: "16px", marginRight: "16px" }} />
                <DatePicker
                  style={{ backgroundColor: "red" }}
                  onKeyDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className={I2SReport.dateFilter}
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
            <button
              type="submit"
              className={I2SReport.btnPrimary}
              onClick={() => resetFilter()}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className={I2SReport.i2sContainer}>
        <ul className={I2SReport.i2sListing}>
          {I2SList.map((team) => {
            return Object.keys(team).map((key) => (
              <li key={key}>
                <div className={I2SReport.cardWrapper}>
                  <div className={I2SReport.cardTitle}>{key}</div>
                  <ul className={I2SReport.cardInner}>
                    {team[key].map((value) => (
                      <li
                        className={I2SReport.row}
                        key={key + "-" + value.i2SLabel}
                      >
                        <div className={I2SReport.rowLabel}>
                          {value.i2SLabel}
                        </div>
                        <div className={I2SReport.rowValue}>
                          {value.i2SCount > 0 && value.i2SLabel !== "I2S %" ? (
                            <p
                              className={I2SReport.textLink}
                              onClick={() => {
                                seti2sPopupModal(true);
                                setPopupData({
                                  ...value,
                                  fromDate: new Date(
                                    firstDay
                                  ).toLocaleDateString("en-US"),
                                  toDate: new Date(lastDay).toLocaleDateString(
                                    "en-US"
                                  ),
                                  isHrfocused: isFocusedRole,
                                });
                              }}
                            >
                              {value.i2SCount}
                            </p>
                          ) :  value.i2SLabel === "I2S %" ? `${value.i2SPercent} %` :
                            value.i2SCount
                          }
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ));
          })}
        </ul>
        <Modal
          width={"90%"}
          centered
          footer={false}
          open={i2sPopupModal}
          className="updateTRModal"
          onCancel={() => seti2sPopupModal(false)}
        >
          <I2SPopupModal
            closeHR={() => {}}
            setUpdateTR={() => seti2sPopupModal(true)}
            onCancel={() => seti2sPopupModal(false)}
            popupData={popupData}
          />
        </Modal>
      </div>
    </div>
  );
};

export default I2sReport;
