import React, { useEffect, useState, useCallback, useMemo } from "react";
import TalentBackoutStyle from "./talentReport.module.css";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { InputType } from "constants/application";
import { ReactComponent as SearchSVG } from "assets/svg/search.svg";
import { ReportDAO } from "core/report/reportDAO";
import { HTTPStatusCode } from "constants/network";
import WithLoader from "shared/components/loader/loader";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import { Table, Tabs } from "antd";
import { downloadToExcel } from "modules/report/reportUtils";
import LogoLoader from "shared/components/loader/logoLoader";
import _ from "lodash";

export default function TalentReport() {
  const [talentReportTabTitle, setTalentReportTabTitle] = useState("Onboarded");
  const [isLoading, setIsLoading] = useState(false);
  const [onboardList, setonboardList] = useState([]);
  const [onboardPageSize, setonboardPageSize] = useState(10);
  const [onboardPageIndex, setonboardPageIndex] = useState(1);
  const [onboardListDataCount, setonboardListDataCount] = useState(0);
  const pageSizeOptions = [100, 200, 300, 500, 1000, 5000];
  const [onboardSearchText, setonboardSearchText] = useState("");
  const [onboardDebounceText, setonboardDebounceText] = useState("");
  const [rejectedDebounceText, setRejectedDebounceText] = useState("");
  const [rejectedSearchText, setrejectedSearchText] = useState("");
  const [rejectedList, setrejectedList] = useState([]);
  const [rejectedPageSize, setrejectedPageSize] = useState(10);
  const [rejectedPageIndex, setrejectedPageIndex] = useState(1);
  const [rejectedListDataCount, setrejectedListDataCount] = useState(0);

  const getOnboardData = useCallback(
    async (psize, pInd) => {
      setIsLoading(true);
      let payload = {
        pageIndex: onboardPageIndex,
        pageSize: onboardPageSize,
        searchText: onboardSearchText,
      };

      const talentOnboardResult = await ReportDAO.getTalentOnboardReportDRO(
        payload
      );
      setIsLoading(false);
      // console.log(replacementResult)

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

  const getRejectedData = useCallback(
    async (psize, pInd) => {
      setIsLoading(true);
      let payload = {
        pageIndex: rejectedPageIndex,
        pageSize: rejectedPageSize,
        searchText: rejectedSearchText,
      };

      const talentrejectedResult = await ReportDAO.getTalentRejectReportDRO(
        payload
      );
      setIsLoading(false);
      // console.log(replacementResult)

      if (talentrejectedResult?.statusCode === HTTPStatusCode.OK) {
        setrejectedList(talentrejectedResult?.responseBody?.rows);
        setrejectedListDataCount(talentrejectedResult?.responseBody?.totalrows);
      } else {
        setrejectedList([]);
        setrejectedListDataCount(0);
      }
    },
    [rejectedPageIndex, rejectedPageSize, rejectedSearchText]
  );

  useEffect(() => {
    getOnboardData();
  }, [onboardPageIndex, onboardSearchText, onboardPageSize]);

  useEffect(() => {
    getRejectedData();
  }, [rejectedPageIndex, rejectedSearchText, rejectedPageSize]);

  const tableColumnsMemo = useMemo(() => {
    return [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        align: "left",
      },

      {
        title: "Email",
        dataIndex: "emailID",
        key: "emailID",
        align: "left",

        render: (text, result) => {
          return `${text ? text : ""} ${
            result.email ? `- ${result.email}` : ""
          }`;
        },
      },
      {
        title: "Engagement / HR #",
        dataIndex: "engagemenID",
        key: "engagemenID",
        align: "left",
        width: "200px",
        render: (text, result) => {
          return `${text ? text : ""} ${
            result.hR_Number ? `/ ${result.hR_Number}` : ""
          }`;
        },
      },
      {
        title: "HR Engagement Type",
        dataIndex: "hrEngagementType",
        key: "hrEngagementType",
        align: "left",
        width: "200px",
      },
      {
        title: "Created On",
        dataIndex: "createdOn",
        key: "createdOn",
        align: "left",
      },
      {
        title: "Status",
        dataIndex: "talentStatus",
        key: "talentStatus",
        align: "left",
      },
      {
        title: "Client",
        dataIndex: "client",
        key: "client",
        align: "left",
      },
      {
        title: "Contract Start Date",
        dataIndex: "contractStartDate",
        key: "contractStartDate",
        align: "left",
      },
      {
        title: "Contract End Date",
        dataIndex: "contractEndDate",
        key: "contractEndDate",
        align: "left",
      },
    ];
  }, [onboardList]);

  const tableRejectedColumnsMemo = useMemo(() => {
    return [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        align: "left",
      },

      {
        title: "Email",
        dataIndex: "emailID",
        key: "emailID",
        align: "left",

        render: (text, result) => {
          return `${text ? text : ""} ${
            result.email ? `- ${result.email}` : ""
          }`;
        },
      },
      {
        title: "HR #",
        dataIndex: "hR_Number",
        key: "hR_Number",
        align: "left",
      },
      {
        title: "Created On",
        dataIndex: "createdOn",
        key: "createdOn",
        align: "left",
      },
      {
        title: "Status",
        dataIndex: "talentStatus",
        key: "talentStatus",
        align: "left",
        width: "150px",
      },
      {
        title: "Client",
        dataIndex: "client",
        key: "client",
        align: "left",
      },
    ];
  }, [rejectedList]);

  useEffect(() => {
    const timer = setTimeout(() => getOnboardData(), 1000);
    return () => clearTimeout(timer);
  }, [onboardDebounceText]);

  useEffect(() => {
    const timer = setTimeout(() => getRejectedData(), 1000);
    return () => clearTimeout(timer);
  }, [rejectedDebounceText]);

  return (
    <div className={TalentBackoutStyle.dealContainer}>
      <div className={TalentBackoutStyle.header}>
        <div className={TalentBackoutStyle.dealLable}>Talent Report</div>
        <LogoLoader visible={isLoading} />
      </div>
      <Tabs
        onChange={(e) => setTalentReportTabTitle(e)}
        defaultActiveKey="1"
        activeKey={talentReportTabTitle}
        animated={true}
        tabBarGutter={50}
        tabBarStyle={{ borderBottom: `1px solid var(--uplers-border-color)` }}
        items={[
          {
            label: "Onboarded",
            key: "Onboarded",
            children: (
              <>
                <div className={TalentBackoutStyle.filterContainer}>
                  <div className={TalentBackoutStyle.filterSets}>
                    <div className={TalentBackoutStyle.filterRight}>
                      <div className={TalentBackoutStyle.searchFilterSet}>
                        <SearchSVG style={{ width: "16px", height: "16px" }} />
                        <input
                          type={InputType.TEXT}
                          className={TalentBackoutStyle.searchInput}
                          placeholder="Search Table"
                          value={onboardDebounceText}
                          onChange={(e) => {
                            setonboardSearchText(e.target.value);
                            setonboardDebounceText(e.target.value);
                          }}
                        />
                      </div>
                      {/* <button
                                  type="submit"
                                  className={TalentBackoutStyle.btnPrimary}
                                  onClick={() => setonboardSearchText(onboardDebounceText)}
                                >
                                  GO
                                </button> */}
                    </div>
                  </div>
                </div>
                <Table
                  scroll={{ y: "480px" }}
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
                />
                ,
              </>
            ),
          },
          {
            label: "Rejected",
            key: "Rejected",
            children: (
              <>
                <div className={TalentBackoutStyle.filterContainer}>
                  <div className={TalentBackoutStyle.filterSets}>
                    <div className={TalentBackoutStyle.filterRight}>
                      <div className={TalentBackoutStyle.searchFilterSet}>
                        <SearchSVG style={{ width: "16px", height: "16px" }} />
                        <input
                          type={InputType.TEXT}
                          className={TalentBackoutStyle.searchInput}
                          placeholder="Search Table"
                          value={rejectedDebounceText}
                          onChange={(e) => {
                            setrejectedSearchText(e.target.value);
                            setRejectedDebounceText(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <Table
                  scroll={{ y: "480px" }}
                  id="rejectededListingTable"
                  columns={tableRejectedColumnsMemo}
                  bordered={false}
                  dataSource={rejectedList}
                  pagination={{
                    onChange: (pageNum, rejectedPageSize) => {
                      setrejectedPageIndex(pageNum);
                      setrejectedPageSize(rejectedPageSize);
                    },
                    size: "small",
                    pageSize: rejectedPageSize,
                    pageSizeOptions: pageSizeOptions,
                    total: rejectedListDataCount,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} of ${rejectedListDataCount} items`,
                    defaultCurrent: rejectedPageIndex,
                  }}
                />
                ,
              </>
            ),
          },
        ]}
      />
    </div>
  );
}
