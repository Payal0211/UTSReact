import React, { useState, useMemo, useCallback, useEffect } from "react";
import TalentDocStyle from "./talentDocument.module.css";
import { ReactComponent as SearchSVG } from "assets/svg/search.svg";
import {
  Dropdown,
  Menu,
  Table,
  Modal,
  Select,
  AutoComplete,
  message,
  Tooltip,
} from "antd";
import { InputType } from "constants/application";
import { useNavigate } from "react-router-dom";
import { FaDownload } from "react-icons/fa";
import { IconContext } from "react-icons";
import { HTTPStatusCode, NetworkInfo } from "constants/network";
import { IoChevronDownOutline } from "react-icons/io5";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import WithLoader from "shared/components/loader/loader";
import UTSRoutes from "constants/routes";
import { ReactComponent as CloseSVG } from "assets/svg/close.svg";
import { ReportDAO } from "core/report/reportDAO";
import { downloadToExcel } from "modules/report/reportUtils";
import { Link } from "react-router-dom";

export default function TalentDocument() {
  const navigate = useNavigate();
  const [allDocumentList, setAllDocumentList] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [pageIndex, setPageIndex] = useState(1);
  const [tableFilteredState, setTableFilteredState] = useState({
    pagenumber: 1,
    pagesize: 20,
    searchText: "",
  });
  const pageSizeOptions = [20, 100, 200, 300, 500, 1000, 5000];
  const [isLoading, setLoading] = useState(false);

  const debouncedSearchHandler = (e) => {
    if (e.target.value.length >= 2 || e.target.value === "") {
      setTimeout(() => {
        setTableFilteredState((prevState) => ({
          ...prevState,
          pagenumber: 1,
          searchText: e.target.value,
        }));
      }, 2000);
    }
    setDebouncedSearch(e.target.value);
    setPageIndex(1);
  };

  const getAllDocumentList = useCallback(
    async (requestData) => {
      setLoading(true);
      let response = await ReportDAO.getTalentDocumentDAO(requestData);
      if (response?.statusCode === HTTPStatusCode.OK) {

        setAllDocumentList(response?.responseBody?.rows);
        setTotalRecords(response?.responseBody?.totalrows);
        setLoading(false);
      } else if (response?.statusCode === HTTPStatusCode.NOT_FOUND) {
        setLoading(false);
        setTotalRecords(0);
        setAllDocumentList([]);
      } else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
        setLoading(false);
        return navigate(UTSRoutes.LOGINROUTE);
      } else if (
        response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
      ) {
        setLoading(false);
        return navigate(UTSRoutes.SOMETHINGWENTWRONG);
      } else {
        setLoading(false);
        setAllDocumentList([]);
        return "NO DATA FOUND";
      }
    },
    [navigate]
  );

  useEffect(() => {
    getAllDocumentList(tableFilteredState);
  }, [tableFilteredState]);

  const allDocumentColumnsMemo = useMemo(() => {
    return [
      {
        title: "Uploaded On",
        dataIndex: "uploadDate",
        key: "uploadDate",
        width: "90px",
      },
      {
        title: "Engagement / HR #",
        dataIndex: "engagemenID",
        key: "engagemenID",
        align: "left",
        width: "120px",
        render: (text, item) => {
          return (
            <>
              <Link
                to={`/viewOnboardDetails/${item.onBoardID}/${
                  item.isOngoing === "Ongoing" ? true : false
                }`}
                target="_blank"
                style={{
                  color: `var(--uplers-black)`,
                  textDecoration: "underline",
                }}
              >
                {text}
              </Link>{" "}
              <br />/{" "}
              <Link
                to={`/allhiringrequest/${item.hrid}`}
                target="_blank"
                style={{ color: "#006699", textDecoration: "underline" }}
              >
                {item.hR_Number}
              </Link>
            </>
          );
        },
      },
      {
        title: "Client",
        dataIndex: "client",
        key: "client",
        width: "150px"
      },
      {
        title: "Talent",
        dataIndex: "talentName",
        key: "talentName",
        width: "150px",
        render:(text,value)=>{
          return `${text} ( ${value.talentEmailID} )`
        }
      },
      {
        title: "Doc Type",
        dataIndex: "documentType",
        key: "documentType",
        width: "80px",
      },
     
      {
        title: "Document",
        dataIndex: "documentName",
        key: "documentName",
        width: "100px",
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: "50px",
        render: (value, data) => {
          return (
            <div
              className={`${TalentDocStyle.documentStatus} ${
                value === "Not Verified"
                  ? TalentDocStyle.red
                  : value === "Verified"
                  ? TalentDocStyle.green
                  : TalentDocStyle.darkred
              }`}
            >
              <div
                className={`${TalentDocStyle.documentStatusText} ${
                  value === "Not Verified"
                    ? TalentDocStyle.red
                    : value === "Verified"
                    ? TalentDocStyle.green
                    : TalentDocStyle.darkred
                }`}
              >
                {" "}
                <span> {value}</span>
              </div>
            </div>
          );
        },
      },
      {
        title: "Download",
        dataIndex: "unique_FileName",
        key: "unique_FileName",
        width: "50px",
        align: "center",
        render: (value, data) => {
          return (
            <IconContext.Provider
              value={{
                color: "green",
                style: { width: "15px", height: "15px", cursor:'pointer' },
              }}
            >
              {" "}
              <Tooltip title="Download" placement="top">
                <span
                  // style={{
                  //   background: 'green'
                  // }}

                  onClick={() =>
                    window.open(
                      `${NetworkInfo.NETWORK}Media/TalentDocuments/${data.unique_FileName}`,
                      "_blank"
                    )
                  }
                  className={TalentDocStyle.feedbackLabel}
                >
                  {" "}
                  <FaDownload />
                </span>{" "}
              </Tooltip>
            </IconContext.Provider>
          );
        },
      },
      // {
      //     title: 'Verified By',
      //     dataIndex: 'approvedBy',
      //     key: 'approvedBy',
      //     width: '120px',
      // },
      // {
      //     title: 'Verified On',
      //     dataIndex: 'approvedDateTime',
      //     key: 'approvedDateTime',
      //     width: '120px',
      // },
    ];
  }, []);

  const handleExport = async () => {
    if(allDocumentList.length === 0){
      return message.warn('NO data to download')
    }
    let DataToExport = allDocumentList.map((data) => {
      let obj = {};
      allDocumentColumnsMemo.map((val) => {
        if (val.title !== "Action") {
          obj[`${val.title}`] = data[`${val.key}`];
        }
        if (val.title === "Status") {
          obj[`${val.title}`] = data[`${val.key}`];
        }
      });
      return obj;
    });

    downloadToExcel(DataToExport, "TalentDocumentReport");
  };
  return (
    <div className={TalentDocStyle.hiringRequestContainer}>
      <div className={TalentDocStyle.addnewHR}>
        <div className={TalentDocStyle.hiringRequest}>Talent Documents</div>
        {/* <LogoLoader visible={isLoading} /> */}
      </div>

      <div className={TalentDocStyle.filterContainer}>
        <div className={TalentDocStyle.filterSets} style={{justifyContent:'flex-end'}}>
          {/* <div className={TalentDocStyle.filterSetsInner} >
                                <div className={TalentDocStyle.addFilter} onClick={toggleSurveyFilter}>
                                    <FunnelSVG style={{ width: '16px', height: '16px' }} />

                                    <div className={TalentDocStyle.filterLabel}>Add Filters</div>
                                    <div className={TalentDocStyle.filterCount}>{filteredTagLength}</div>                            
                                </div>
                                <p onClick={()=> clearFilters() }>Reset Filters</p>                        
                            </div>  
                                                   */}

          <div className={TalentDocStyle.filterRight}>
            {/* <div className={TalentDocStyle.calendarFilterSet}>
                                    <div className={TalentDocStyle.label}>Date</div>
                                    <div className={TalentDocStyle.calendarFilter}>
                                        <CalenderSVG style={{ height: '16px', marginRight: '16px' }} />
                                        <DatePicker
                                            style={{ backgroundColor: 'red' }}
                                            onKeyDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                            className={TalentDocStyle.dateFilter}
                                            placeholderText="Start date - End date"
                                            selected={startDate}
                                            onChange={onCalenderFilter}
                                            dateFormat='dd/MM/yyyy'
                                            startDate={startDate}
                                            endDate={endDate}
                                            selectsRange
                                        />
                                    </div>
                                </div> */}

<div className={TalentDocStyle.searchFilterSet}>
            <SearchSVG style={{ width: "16px", height: "16px" }} />
            <input
              type={InputType.TEXT}
              className={TalentDocStyle.searchInput}
              placeholder="Search Table"
              onChange={debouncedSearchHandler}
              value={debouncedSearch}
            />
            {debouncedSearch && (
              <CloseSVG
                style={{
                  width: "16px",
                  height: "16px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setTableFilteredState((prevState) => ({
                    ...prevState,
                    pagenumber: 1,
                    searchText: "",
                  }));
                  setDebouncedSearch("");
                  setPageIndex(1);
                }}
              />
            )}
          </div>

            <div className={TalentDocStyle.priorityFilterSet}>
              <div className={TalentDocStyle.label}>Showing</div>
              <div className={TalentDocStyle.paginationFilter}>
                <Dropdown
                  trigger={["click"]}
                  placement="bottom"
                  overlay={
                    <Menu
                      onClick={(e) => {
                        setPageSize(parseInt(e.key));
                        if (pageSize !== parseInt(e.key)) {
                          setTableFilteredState((prevState) => ({
                            ...prevState,
                            pagesize: parseInt(e.key),
                            pagenumber: pageIndex,
                          }));
                        }
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
                      style={{ paddingTop: "5px", fontSize: "16px" }}
                    />
                  </span>
                </Dropdown>
              </div>
            </div>
            <button
              className={TalentDocStyle.btnPrimary}
              onClick={() => handleExport()}
            >
              Export
            </button>
          </div>
        </div>
      </div>

      <div className={TalentDocStyle.tableDetails}>
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <WithLoader className="mainLoader">
            <Table
              scroll={{ y: "100vh" }}
              dataSource={allDocumentList}
              columns={allDocumentColumnsMemo}
              pagination={
                search && search?.length === 0
                  ? null
                  : {
                      onChange: (pageNum, pageSize) => {
                        setPageIndex(pageNum);
                        setPageSize(pageSize);
                        setTableFilteredState((prevState) => ({
                          ...prevState,
                          pagenumber: pageNum,
                        }));
                      },
                      size: "small",
                      pageSize: pageSize,
                      pageSizeOptions: pageSizeOptions,
                      total: totalRecords,
                      showTotal: (total, range) =>
                        `${range[0]}-${range[1]} of ${totalRecords} items`,
                      defaultCurrent: pageIndex,
                    }
              }
            />
          </WithLoader>
        )}
      </div>
    </div>
  );
}
