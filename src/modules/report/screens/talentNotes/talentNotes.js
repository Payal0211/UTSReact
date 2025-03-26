import React, { useEffect, useState, useCallback, useMemo } from "react";
import TalentNotesStyle from "./talentNotes.module.css";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { InputType } from "constants/application";
import { ReactComponent as SearchSVG } from "assets/svg/search.svg";
import { ReactComponent as CloseSVG } from "assets/svg/close.svg";
import { ReportDAO } from "core/report/reportDAO";
import { HTTPStatusCode } from "constants/network";
import WithLoader from "shared/components/loader/loader";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import { Modal, Skeleton, Table, Tabs, Tooltip, Dropdown , Menu } from "antd";
import { downloadToExcel } from "modules/report/reportUtils";
import LogoLoader from "shared/components/loader/logoLoader";
import { Link } from "react-router-dom";
import moment from "moment";
import { IoChevronDownOutline } from "react-icons/io5";
import { amDashboardDAO } from "core/amdashboard/amDashboardDAO";

export default function AllNOTES() {
  const [isLoading, setIsLoading] = useState(false);
  const [onboardList, setonboardList] = useState([]);
  const [onboardPageSize, setonboardPageSize] = useState(10);
  const [onboardPageIndex, setonboardPageIndex] = useState(1);
  const [onboardListDataCount, setonboardListDataCount] = useState(0);
  const pageSizeOptions = [100, 200, 300, 500, 1000, 5000];
  const [onboardSearchText, setonboardSearchText] = useState("");
  const [onboardDebounceText, setonboardDebounceText] = useState("");


  const getOnboardData = useCallback(
    async (psize, pInd) => {
      setIsLoading(true);
      let payload = {
        pageIndex: onboardPageIndex,
        pageSize: onboardPageSize,
        searchText: onboardSearchText,
      };

      const talentOnboardResult = await ReportDAO.getAllNotesReportDRO(
        payload
      );
      setIsLoading(false);
      

      if (talentOnboardResult?.statusCode === HTTPStatusCode.OK) {
        setonboardList(talentOnboardResult?.responseBody?.rows);
        setonboardListDataCount(talentOnboardResult?.responseBody?.totalrows);
      } else {
        setonboardList([]);
        setonboardListDataCount(0);
      }
    },
    [onboardPageIndex, onboardPageSize, onboardSearchText]
  );

 

  useEffect(() => {
    getOnboardData();
  }, [onboardPageIndex, onboardSearchText, onboardPageSize]);

 

  const tableColumnsMemo = useMemo(() => {
    return [
        {
            title: "Engagement / HR #",
            dataIndex: "engagementID",
            key: "engagementID",
            align: "left",
            width: "100px",
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
                    to={`/allhiringrequest/${item.hiringRequestID}`}
                    target="_blank"
                    style={{ color: "#006699", textDecoration: "underline" }}
                  >
                    {item.hrNumber}
                  </Link>
                </>
              );
            },
          },
      {
        title: "Created On",
        dataIndex: "createdByDateTime",
        key: "createdByDateTime",
        align: "left",
        width: "60px",
         render: (text) => {
                  return (
                    <>
                      {moment(text).format("DD/MM/YYYY")}
                      <br />
                      {moment(text).format("hh:mm A")}
                    </>
                  );
                },
      },
      {
        title: 'Talent',
        dataIndex: "talentName",
        key: "talentName",
        align: "left",
        width: "120px",
        render:(text, result)=>{
            return <>{text} <br/> ( {result.talentEmail} )</>
        }
      },
      {
        title: "Notes",
        dataIndex: "notes",
        key: "notes",
        align: "left",
        width: "250px",
        render: (text) => {
            return <div dangerouslySetInnerHTML={{ __html: text }}></div>;
          },
      },
      {
        title: "Note Added By",
        dataIndex: "noteAddedBy",
        key: "noteAddedBy",
        align: "left",
        width: "100px",
      },
      {
        title: "Tagged Users",
        dataIndex: "taggedUsers",
        key: "taggedUsers",
        align: "left",
        width: "90px",
      },
     
    
    ];
  }, [onboardList]);



 

  useEffect(() => {
    const timer = setTimeout(() => getOnboardData(), 1000);
    return () => clearTimeout(timer);
  }, [onboardDebounceText]);


  const handleOnboardExport = (apiData) => {
    let DataToExport = apiData.map((data) => {
      let obj = {};
      tableColumnsMemo.forEach((val) => {
        if (val.key !== "action") {
          if (val.title === "Talent") {
            obj[`${val.title}`] = `${data.talentName} ( ${data.talentEmail} )`;
          } 
          else if (val.key === "engagementID") {
            obj[`${val.title}`] = `${
              data.engagementID ? data.engagementID : "NA"
            } / ${data.hrNumber ? data.hrNumber : "NA"}`;
          } else if (val.key === "createdByDateTime") {
            obj[`${val.title}`] = `${ moment(data[`${val.key}`]).format("DD/MM/YYYY hh:mm A")}`;
          } else {
            obj[`${val.title}`] = data[`${val.key}`];
          }
        }
      });
      return obj;
    });
    downloadToExcel(DataToExport, "Notes_Report.xlsx");
  };



  return (
    <div className={TalentNotesStyle.dealContainer}>
      <div className={TalentNotesStyle.header}>
        <div className={TalentNotesStyle.dealLable}>Eng. Notes</div>
        {/* <LogoLoader visible={isLoading} /> */}
      </div>
      
      
      <>
                <div className={TalentNotesStyle.filterContainer}>
                  <div className={TalentNotesStyle.filterSets}>
                    <div className={TalentNotesStyle.filterRight}>
                      <div className={TalentNotesStyle.searchFilterSet}>
                        <SearchSVG style={{ width: "16px", height: "16px" }} />
                        <input
                          type={InputType.TEXT}
                          className={TalentNotesStyle.searchInput}
                          placeholder="Search Table"
                          value={onboardSearchText}
                          onChange={(e) => {
                            setonboardSearchText(e.target.value);
                            setonboardDebounceText(e.target.value);
                          }}
                        />
                        {onboardSearchText && (
                          <CloseSVG
                            style={{
                              width: "16px",
                              height: "16px",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              setonboardSearchText("");
                              setonboardDebounceText("");
                            }}
                          />
                        )}
                      </div>

                      <div className={TalentNotesStyle.priorityFilterSet}>
              <div className={TalentNotesStyle.label}>Showing</div>
              <div className={TalentNotesStyle.paginationFilter}>
                <Dropdown
                  trigger={["click"]}
                  placement="bottom"
                  overlay={
                    <Menu
                      onClick={(e) => {
                        setonboardPageSize(parseInt(e.key));
                        // if (pageSize !== parseInt(e.key)) {
                        //   setTableFilteredState((prevState) => ({
                        //     ...prevState,
                        //     totalrecord: parseInt(e.key),
                        //     pagenumber: pageIndex,
                        //   }));
                        // }
                      }}
                    >
                      {pageSizeOptions.map((item) => {
                        return <Menu.Item key={item}>{item}</Menu.Item>;
                      })}
                    </Menu>
                  }
                >
                  <span>
                    {onboardPageSize}
                    <IoChevronDownOutline
                      style={{ paddingTop: "5px", fontSize: "16px" }}
                    />
                  </span>
                </Dropdown>
              </div>
            </div>
                      <button
                        type="submit"
                        className={TalentNotesStyle.btnPrimary}
                        onClick={() => handleOnboardExport(onboardList)}
                      >
                        Export
                      </button>
                    </div>
                  </div>
                </div>
                {isLoading ? <TableSkeleton active /> :  <Table
                  scroll={{ y: "480px", }}
                  id="OnboardedListingTable"
                  columns={tableColumnsMemo}
                  bordered={false}
                  dataSource={onboardList}
                  pagination={{
                    onChange: (pageNum, onboardPageSize) => {
                      setonboardPageIndex(pageNum);
                      setonboardPageSize(onboardPageSize);
                    },
                    size: "small",
                    pageSize: onboardPageSize,
                    pageSizeOptions: pageSizeOptions,
                    total: onboardListDataCount,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} of ${onboardListDataCount} items`,
                    defaultCurrent: onboardPageIndex,
                  }}
                />}
               
                
              </>

      {/* <Modal
        width="930px"
        centered
        footer={null}
        className="engagementAddFeedbackModal"
        open={showLeaves}
        onCancel={() => setshowLeaves(false)}
      >
        <>
          {leaveLoading ? (
            <Skeleton active />
          ) : (
            <Table
              scroll={{ y: "100vh" }}
              dataSource={leaveList ? leaveList : []}
              columns={leaveColumns}
              pagination={false}
            />
          )}
        </>
      </Modal> */}
    </div>
  );
}
