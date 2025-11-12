import React, { useState, useEffect, Suspense } from "react";
import uplersStyle from "./uplersReport.module.css";
import { Table, Modal, Tooltip, Skeleton, Spin, Select, message } from "antd";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import Diamond from "assets/svg/diamond.svg";
import { ReportDAO } from "core/report/reportDAO";
import moment from "moment";
import { All_Hiring_Request_Utils } from "shared/utils/all_hiring_request_util";
import { HTTPStatusCode } from "constants/network";

export default function QASummary({impHooks}) {
     const { monthNames,reportData} = impHooks;
     const [isLoading, setIsLoading] = useState(false);
    //    const [reportData, setReportData] = useState([]);
    //    const [monthNames,setMonthNames] = useState({m1Name:'',m2Name:'',m3Name:''})
    // const [QtabName,setQTabName] = useState('')

  

       
  const reportColumns = [
    {
      title: "Stages",
      dataIndex: "stage",
      key: "stage",
      //   fixed: "left",
      width: 150,
      className: `${uplersStyle.stagesHeaderCell} ${uplersStyle.headerCommonConfig} `,
    },
     {
      title: <div style={{ textAlign: "center" }}>Goal</div>,
      dataIndex: "goalStr",
      key: "goalStr",
      align: "right",
      width: 120,
      onHeaderCell: () => ({
        className: uplersStyle.headerCommonGoalHeaderConfig,
      }),
      className: `${uplersStyle.headerCommonConfig} `,
      render: (v, rec) => {
        return v ? (
          rec.stage === "Goal" ? (
            v
          ) : (
            <span
            // onClick={() => getHRTalentWiseReport(rec, v)}
            // style={{ cursor: "pointer", color: "#1890ff" }}
            >
              {v}
            </span>
          )
        ) : (
          ""
        );
      },
    },
    {
      title: <div style={{ textAlign: "center" }}>Achieved</div>,
      dataIndex: "achievedStr",
      key: "achievedStr",
      width: 120,
      align: "right",
      onHeaderCell: () => ({
        className: uplersStyle.headerCommonGoalHeaderConfig,
      }),
      className: `${uplersStyle.headerCommonConfig}`,
    
    },
    {
      title: <div style={{ textAlign: "center" }}>Achieved %</div>,
      dataIndex: "achievedPerStr",
      key: "achievedPerStr",
      width: 120,
      align: "right",
      onHeaderCell: () => ({
        className: uplersStyle.headerCommonGoalHeaderConfig,
      }),
      className: `${uplersStyle.headerCommonConfig}`,
    
    },
     {
      title: <div style={{ textAlign: "center" }}>{monthNames.m1Name ?? 'NA'}</div> ,
      dataIndex: "m1Str",
      key: "m1Str",
      width: 120,
      align: "right",
      onHeaderCell: () => ({
        className: uplersStyle.headerCommonGoalHeaderConfig,
      }),
      className: `${uplersStyle.headerCommonConfig}`,
     
    },
    {
      title: <div style={{ textAlign: "center" }}>{monthNames.m2Name ?? 'NA'}</div> ,
      dataIndex: "m2Str",
      key: "m2Str",
      width: 120,
      align: "right",
      onHeaderCell: () => ({
        className: uplersStyle.headerCommonGoalHeaderConfig,
      }),
      className: `${uplersStyle.headerCommonConfig}`,
     
    },
    {
      title: <div style={{ textAlign: "center" }}>{monthNames.m3Name ?? 'NA'}</div> ,
      dataIndex: "m3Str",
      key: "m3Str",
      width: 120,
      align: "right",
      onHeaderCell: () => ({
        className: uplersStyle.headerCommonGoalHeaderConfig,
      }),
      className: `${uplersStyle.headerCommonConfig}`,
     
    },
  
    {
      title: <div style={{ textAlign: "center" }}>Projection</div>,
      dataIndex: "projectionStr",
      key: "projectionStr",
      width: 120,
      align: "right",
      onHeaderCell: () => ({
        className: uplersStyle.headerCommonGoalHeaderConfig,
      }),
      className: `${uplersStyle.headerCommonConfig}`,
    
    },
    {
      title: <div style={{ textAlign: "center" }}>Upcoming Quarter</div>,
      dataIndex: "nextMonthStr",
      key: "nextMonthStr",
      width: 120,
      align: "right",
      onHeaderCell: () => ({
        className: uplersStyle.headerCommonGoalHeaderConfig,
      }),
      className: `${uplersStyle.headerCommonConfig}`,
     
    },
]
  return (
     <div className={uplersStyle.filterContainer} style={{ padding: "12px" }}>
      <div className={uplersStyle.customTableContainer}>
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <>
            <p
              style={{
                fontWeight: "bold",
                fontSize: "20px",
                padding: "20px 20px 0",
              }}
            >
              Summary
            </p>
            <Table
              scroll={{ x: "1600px", y: "100vh" }}
              id="amReportList"
              columns={reportColumns}
              bordered={false}
              dataSource={reportData}
              rowKey={(record, index) => index}
              pagination={false}
              rowClassName={(record) => {
                if (record.stage === "PROJECTION") {
                  return `${uplersStyle.heighliteRow} ${uplersStyle.boldText}`;
                }
                if (
                  record.stage === "Target Pending" ||
                  record.stage === "Negotiation Gap"
                ) {
                  return uplersStyle.boldText;
                }
                if (
                  record.stage === "Joined" ||
                  record.stage === "Offer Signed"
                ) {
                  return uplersStyle.heighliteGreen;
                }
                if (record.stage === "Selections/Closures") {
                  return uplersStyle.heighliteOrange;
                }
                if (
                  record.stage === "Dropouts" ||
                  record.stage === "Dropouts"
                ) {
                  return uplersStyle.heighliteRed;
                }
                if (record.stage === "Total Active Pipeline") {
                  return uplersStyle.heighlitePurple;
                }
              }}
            />
          </>
        )}
        </div>
        </div>
  )
}
