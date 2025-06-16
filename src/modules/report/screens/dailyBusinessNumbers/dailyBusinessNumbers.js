import React, { useEffect, useState } from "react";
import { Table, Card, Typography, Modal, Row, Col } from "antd";
import DatePicker from "react-datepicker";
import styles from "./dailyBusinessNumbers.module.css";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import { ReportDAO } from "core/report/reportDAO";
import moment from "moment";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";

const { Title, Text } = Typography;

export default function DailyBusinessNumbersPage() {
  const [monthDate, setMonthDate] = useState(new Date());
  const [listData, setListData] = useState([]);
  const selectedYear = monthDate.getFullYear();
  const [isLoading, setIsLoading] = useState(false);

  const [showAchievedReport, setShowAchievedReport] = useState(false);
  const [listAchievedData, setListAchievedData] = useState([]);
  const [achievedLoading, setAchievedLoading] = useState(false);

  const getColumns = () => [
    {
      title: "Stages",
      dataIndex: "stage",
      key: "stage",
      fixed: "left",
      width: 200,
      className: `${styles.stagesHeaderCell} ${styles.headerCommonConfig} `,
      render: (text, record) => {
        if (record.isCategory) {
          return {
            children: <strong style={{ paddingLeft: "5px" }}>{text}</strong>,
            props: {
              colSpan: 13,
              style: {
                backgroundColor: "#FFC000",
                fontWeight: "500",
                borderRight: "1px solid #d9d9d9",
                padding: "8px",
              },
            },
          };
        }
        if (record.isSpacer) {
          return {
            children: <div style={{ height: "10px" }}> </div>,
            props: {
              colSpan: 13,
              style: {
                padding: "0px",
                backgroundColor: "#ffffff",
                border: "none",
              },
            },
          };
        }

        let cellStyle = {
          padding: "8px",
          margin: "-8px -8px",
          display: "flex",
          alignItems: "center",
          height: "calc(100% + 16px)",
          width: "calc(100% + 16px)",
        };
        let content = text || "\u00A0";

        if (record.stage === "Closures")
          cellStyle = {
            ...cellStyle,
            backgroundColor: "#70AD47",
            color: "white",
            fontWeight: "bold",
          };
        else if (record.stage === "Churn")
          cellStyle = {
            ...cellStyle,
            backgroundColor: "#ED7D31",
            color: "white",
            fontWeight: "bold",
          };
        else if (record.stage === "C2H")
          cellStyle = {
            ...cellStyle,
            backgroundColor: "#595959",
            color: "white",
            fontWeight: "bold",
          };
        else if (record.isPipelineRow)
          cellStyle = {
            ...cellStyle,
            backgroundColor: "#FFFF00",
            fontWeight: "bold",
            color: "black",
          };

        if (record.key === "inbound_desc" && text === "") {
          return <div style={cellStyle}> </div>;
        }
        return (
          <div style={cellStyle}>
            <span style={{ paddingLeft: "5px" }}>{content}</span>
          </div>
        );
      },
    },
    {
      title: "Recurring",
      className: `${styles.recurringGroupHeader} ${styles.headerCommonConfig} ${styles.recunningHeadConfig}`,
      children: [
        {
          title: "Goal",
          dataIndex: ["recurring", "goal"],
          key: "recurring_goal",
          width: 100,
          onHeaderCell: () => ({
            className: styles.headerCommonGoalHeaderConfig,
          }),
          className: `${styles.headerCommonConfig} `,
          render: (v, rec) =>
            renderCell(v, rec, {
              align: "right",
              isCurrency: true,
              isC2S: rec.stage === "C2S%",
            }),
        },
        {
          title: "Goal till date",
          dataIndex: ["recurring", "goalTillDate"],
          key: "recurring_goalTillDate",
          width: 110,
          onHeaderCell: () => ({
            className: styles.headerCommonGoalHeaderConfig,
          }),
          className: `${styles.headerCommonConfig}`,
          render: (v, rec) =>
            renderCell(v, rec, { align: "right", isCurrency: true }),
        },
        // {
        //     title: 'Potential',
        //     dataIndex: ['recurring', 'potential'],
        //     key: 'recurring_potential',
        //     width: 100,
        //     className: styles.headerCommonConfig,
        //     render: (v, rec) => renderCell(v, rec, { align: rec.key === 'inbound_desc' ? 'left' : 'center', isPotential: true, isItalic: rec.key === 'inbound_desc' })
        // },
        {
          title: "Achieved",
          dataIndex: ["recurring", "achieved"],
          key: "recurring_achieved",
          width: 100,
          onHeaderCell: () => ({
            className: styles.headerCommonAchievedHeaderConfig,
          }),
          className: `${styles.headerCommonConfig}`,
          render: (v, rec) => {
            // renderCell(v, rec, { align: 'right', isCurrency: true, isC2S: rec.stage === 'C2S%' })
            if (rec.isCategory || rec.isSpacer) {
              return { props: { colSpan: 0 } };
            }
            return (
              <span
                onClick={() => getHRTalentWiseReport(rec, "C")}
                style={{ cursor: "pointer", color: "#1890ff" }}
              >
                {v}
              </span>
            );
          },
        },
        {
          title: "Achieved%",
          dataIndex: ["recurring", "achievedPercent"],
          key: "recurring_achievedPercent",
          width: 100,
          onHeaderCell: () => ({
            className: styles.headerCommonAchievedHeaderConfig,
          }),
          className: `${styles.headerCommonConfig} `,
          render: (v, rec) =>
            renderCell(v, rec, {
              align: "center",
              isPercent: true,
              isYellow: rec.isPipelineRow,
            }),
        },
      ],
    },
    {
      title: "One-Off (DP)",
      className: `${styles.oneOffGroupHeader} ${styles.headerCommonConfig} ${styles.onOffDPHeadConfig}`,
      children: [
        {
          title: "Goal",
          dataIndex: ["oneOff", "goal"],
          key: "oneOff_goal",
          width: 100,
          onHeaderCell: () => ({
            className: styles.headerCommonGoalHeaderConfig,
          }),
          className: `${styles.headerCommonConfig}`,
          render: (v, rec) =>
            renderCell(v, rec, { align: "right", isCurrency: true }),
        },
        {
          title: "Goal till date",
          dataIndex: ["oneOff", "goalTillDate"],
          key: "oneOff_goalTillDate",
          width: 110,
          onHeaderCell: () => ({
            className: styles.headerCommonGoalHeaderConfig,
          }),
          className: `${styles.headerCommonConfig} `,
          render: (v, rec) =>
            renderCell(v, rec, { align: "right", isCurrency: true }),
        },
        // { title: 'Potential', dataIndex: ['oneOff', 'potential'], key: 'oneOff_potential', width: 100, className: styles.headerCommonConfig, render: (v, rec) => renderCell(v, rec, { align: 'center', isPotential: true }) },
        {
          title: "Achieved",
          dataIndex: ["oneOff", "achieved"],
          key: "oneOff_achieved",
          width: 110,
          onHeaderCell: () => ({
            className: styles.headerCommonAchievedHeaderConfig,
          }),
          className: `${styles.headerCommonConfig} `,
          render: (v, rec) => {
            if (rec.isCategory || rec.isSpacer) {
              return { props: { colSpan: 0 } };
            }
            return (
              <span
                onClick={() => getHRTalentWiseReport(rec, "D")}
                style={{ cursor: "pointer", color: "#1890ff" }}
              >
                {v}
              </span>
            );
          },
        },
        {
          title: "Achieved%",
          dataIndex: ["oneOff", "achievedPercent"],
          key: "oneOff_achievedPercent",
          width: 100,
          onHeaderCell: () => ({
            className: styles.headerCommonAchievedHeaderConfig,
          }),
          className: `${styles.headerCommonConfig} `,
          render: (v, rec) =>
            renderCell(v, rec, {
              align: "center",
              isPercent: true,
              isYellow: rec.isPipelineRow,
            }),
        },
      ],
    },
    {
      title: "Numbers",
      className: `${styles.numbersGroupHeader} ${styles.headerCommonConfig} ${styles.NumberHeadConfig}`,
      children: [
        {
          title: "Goal",
          dataIndex: ["numbers", "goal"],
          key: "numbers_goal",
          width: 80,
          className: `${styles.headerCommonConfig} `,
          onHeaderCell: () => ({
            className: styles.headerCommonGoalHeaderConfig,
          }),
          render: (v, rec) => renderCell(v, rec, { align: "center" }),
        },
        {
          title: "Goal till date",
          dataIndex: ["numbers", "goalTillDate"],
          key: "numbers_goalTillDate",
          width: 100,
          className: `${styles.headerCommonConfig} `,
          onHeaderCell: () => ({
            className: styles.headerCommonGoalHeaderConfig,
          }),
          render: (v, rec) => renderCell(v, rec, { align: "center" }),
        },
        {
          title: "Achieved",
          dataIndex: ["numbers", "achieved"],
          key: "numbers_achieved",
          width: 80,
          className: `${styles.headerCommonConfig} `,
          onHeaderCell: () => ({
            className: styles.headerCommonAchievedHeaderConfig,
          }),
          render: (v, rec) => {
            if (rec.isCategory || rec.isSpacer) {
              return { props: { colSpan: 0 } };
            }
            return (
              <span
                onClick={() => getHRTalentWiseReport(rec, "N")}
                style={{ cursor: "pointer", color: "#1890ff" }}
              >
                {v}
              </span>
            );
          },
        },
        {
          title: "Achieved%",
          dataIndex: ["numbers", "achievedPercent"],
          key: "numbers_achievedPercent",
          width: 100,
          className: `${styles.headerCommonConfig} `,
          onHeaderCell: () => ({
            className: styles.headerCommonAchievedHeaderConfig,
          }),
          render: (v, rec) =>
            renderCell(v, rec, { align: "center", isPercent: true }),
        },
      ],
    },
  ];

  const renderCell = (
    value,
    record,
    {
      align = "left",
      isCurrency = false,
      isPercent = false,
      isPotential = false,
      isYellow = false,
      isItalic = false,
      isC2S = false,
    } = {}
  ) => {
    if (record.isCategory || record.isSpacer) {
      return { props: { colSpan: 0 } };
    }

    let cellStyle = {
      padding: "8px",
      margin: "-8px",
      display: "flex",
      alignItems: "center",
      justifyContent: align,
      height: "calc(100% + 16px)",
      width: "calc(100% + 16px)", // Fill cell
    };
    let content = value;

    if (isPotential && value === "-") {
      cellStyle.backgroundColor = "#BFBFBF"; // Gray background
    } else if (value === null || value === undefined || value === "") {
      content = isPotential || record.stage === "Churn" ? "-" : "\u00A0";
    }

    if (isYellow)
      cellStyle = {
        ...cellStyle,
        backgroundColor: "#FFFF00",
        fontWeight: "bold",
        color: "black",
      };
    if (isItalic) cellStyle.fontStyle = "italic";

    if (isC2S && (align === "right" || align === "center")) {
      // no specific style needed unless different from regular numbers/percentages
    }

    if (typeof content === "object" && content !== null) content = "-";

    return (
      <div style={cellStyle}>
        {align === "left" || align === "center" ? (
          <span style={{ paddingLeft: align === "left" ? "5px" : "0px" }}>
            {content}
          </span>
        ) : (
          content
        )}
      </div>
    );
  };

  const convertDataSource = (data) => {
    const list = [];

    data.forEach((item, index) => {
      switch (item.stage_ID) {
        case 0: {
          list.push({
            key: `cat${index}`,
            stage: item.stage,
            isCategory: true,
            ...item,
          });
          break;
        }
        case 10: {
          list.push({
            ...item,
            key: `row${index}`,
            stage: item.stage,
            isPipelineRow: true,
            recurring: {
              goal: item.recurring_GoalStr,
              goalTillDate: item.recurring_TillDateStr,
              achieved: item.recurring_AchievedStr,
              achievedPercent: item.recurring_AchievedPer,
            },
            oneOff: {
              goal: item.dP_GoalStr,
              goalTillDate: item.dP_TillDateStr,
              achieved: item.dP_AchievedStr,
              achievedPercent: item.dP_AchievedPer,
            },
            numbers: {
              goal: item.trOrHR_Goal,
              goalTillDate: item.trOrHR_TillDate,
              achieved: item.trOrHR_Achieved,
              achievedPercent: item.trOrHR_AchievedPer,
            },
          });

          list.push({ key: `spacer1${index}`, stage: "", isSpacer: true });
          break;
        }
        default: {
          list.push({
            ...item,
            key: `row${index}`,
            stage: item.stage,
            recurring: {
              goal: item.recurring_GoalStr,
              goalTillDate: item.recurring_TillDateStr,
              achieved: item.recurring_AchievedStr,
              achievedPercent: item.recurring_AchievedPer,
            },
            oneOff: {
              goal: item.dP_GoalStr,
              goalTillDate: item.dP_TillDateStr,
              achieved: item.dP_AchievedStr,
              achievedPercent: item.dP_AchievedPer,
            },
            numbers: {
              goal: item.trOrHR_Goal,
              goalTillDate: item.trOrHR_TillDate,
              achieved: item.trOrHR_Achieved,
              achievedPercent: item.trOrHR_AchievedPer,
            },
          });
        }
      }
    });

    return list;
  };

  const revenueDataSource = [
    { key: "cat1", stage: "Uplers Business (Total)", isCategory: true },
    {
      key: "row1",
      stage: "TRs",
      recurring: {
        goal: "$29,715",
        goalTillDate: "$24,312",
        potential: null,
        achieved: "$19,516.90",
        achievedPercent: "65.68%",
      },
      oneOff: {
        goal: "$130,550.00",
        goalTillDate: "$106,813.64",
        potential: null,
        achieved: "$158,291.50",
        achievedPercent: "121.25%",
      },
      numbers: {
        goal: "91",
        goalTillDate: "74.45",
        achieved: "72",
        achievedPercent: "79.12%",
      },
    },
    {
      key: "row2",
      stage: "HRs (New)",
      recurring: { achieved: "$24,874.90" },
      oneOff: { achieved: "$130,878.60" },
    },
    {
      key: "row3",
      stage: "HRs (Carry Fwd)",
      recurring: {
        goal: "$17,926.00",
        goalTillDate: "$14,666.73",
        potential: "-",
        achieved: "$4,899.55",
        achievedPercent: "27.33%",
      },
      oneOff: {
        goal: "$75,600.00",
        goalTillDate: "$61,854.55",
        potential: "-",
        achieved: "$54,682.43",
        achievedPercent: "72.33%",
      },
      numbers: {
        goal: "46",
        goalTillDate: "37.64",
        achieved: "20.5",
        achievedPercent: "44.57%",
      },
    },
    {
      key: "row4",
      stage: "Closures",
      recurring: { achieved: "$8,816.75" },
      numbers: { achieved: "11" },
    },
    { key: "row5", stage: "Churn" },
    { key: "row6", stage: "C2H", recurring: { achieved: "$17,771.00" } },
    {
      key: "row7",
      stage: "Pipeline to Closure %",
      isPipelineRow: true,
      recurring: { achievedPercent: "12.73%" },
      oneOff: { achievedPercent: "20.95%" },
    },
    { key: "spacer1", stage: "", isSpacer: true },

    { key: "cat2", stage: "Inbound", isCategory: true },
    { key: "inbound_desc", stage: "", recurring: { potential: "Avg value" } },
    {
      key: "row9",
      stage: "HRs (New)",
      recurring: {
        goal: "$11,250",
        goalTillDate: "$9,205",
        achieved: "$8,982.10",
        achievedPercent: "79.84%",
      },
      oneOff: {
        goal: "$15,000.00",
        goalTillDate: "$12,272.73",
        achieved: "$8,598.00",
        achievedPercent: "57.32%",
      },
      numbers: {
        goal: "20",
        goalTillDate: "16.36",
        achieved: "8",
        achievedPercent: "40.00%",
      },
    },
    {
      key: "row10",
      stage: "HRs (Carry Fwd)",
      recurring: { achieved: "$1,503.30" },
      oneOff: { achieved: "$0.00" },
    },
    {
      key: "row11",
      stage: "Closures",
      recurring: {
        goal: "$5,625.00",
        goalTillDate: "$4,602.27",
        potential: "-",
        achieved: "$700.00",
        achievedPercent: "12.44%",
      },
      oneOff: {
        goal: "$7,500.00",
        goalTillDate: "$6,136.36",
        potential: "-",
        achieved: "$3,280.22",
        achievedPercent: "43.74%",
      },
      numbers: {
        goal: "10",
        goalTillDate: "8.18",
        achieved: "2",
        achievedPercent: "20.00%",
      },
    },
    {
      key: "row12",
      stage: "C2S%",
      recurring: { goal: "50%", achieved: "6.68%" },
      numbers: { achieved: "25.00%" },
    },
    {
      key: "row13",
      stage: "Pipeline to Closure %",
      isPipelineRow: true,
      recurring: { achievedPercent: "19.28%" },
      oneOff: { achievedPercent: "23.84%" },
    },
    { key: "spacer2", stage: "", isSpacer: true },

    { key: "cat3", stage: "Outbound", isCategory: true },
    {
      key: "row14",
      stage: "HRs (New)",
      recurring: {
        goal: "$3,714",
        goalTillDate: "$3,039",
        achieved: "$3,437.00",
        achievedPercent: "92.54%",
      },
      oneOff: {
        goal: "$44,550.00",
        goalTillDate: "$36,450.00",
        achieved: "$119,600.10",
        achievedPercent: "268.46%",
      },
      numbers: {
        goal: "20",
        goalTillDate: "16.36",
        achieved: "27",
        achievedPercent: "135.00%",
      },
    },
    {
      key: "row15",
      stage: "HRs (Carry Fwd)",
      recurring: { achieved: "$1,044.00" },
      oneOff: { achieved: "$54,579.30" },
    },
    {
      key: "row16",
      stage: "Closures",
      recurring: {
        goal: "$1,238.00",
        goalTillDate: "$1,012.91",
        potential: "-",
        achieved: "$0.00",
        achievedPercent: "0.00%",
      },
      oneOff: {
        goal: "$14,850.00",
        goalTillDate: "$12,150.00",
        potential: "-",
        achieved: "$8,799.09",
        achievedPercent: "59.25%",
      },
      numbers: {
        goal: "7",
        goalTillDate: "5.73",
        achieved: "3",
        achievedPercent: "42.86%",
      },
    },
    {
      key: "row17",
      stage: "C2S%",
      recurring: { goal: "33%", achieved: "0.00%" },
      numbers: { achieved: "11.11%" },
    },
    {
      key: "row18",
      stage: "Pipeline to Closure %",
      isPipelineRow: true,
      recurring: { achievedPercent: "0.00%" },
      oneOff: { achievedPercent: "6.16%" },
    },
  ];

  const onMonthCalenderFilter = (date) => {
    setMonthDate(date);
  };

  const getReport = async () => {
    const pl = {
      hrBusinessType: "Global",
      month: moment(monthDate).format("M"),
      year: moment(monthDate).format("YYYY"),
    };
    setIsLoading(true);
    const result = await ReportDAO.revenueBusinessReportDAO(pl);
    setIsLoading(false);

    if (result.statusCode === 200) {
      setListData(convertDataSource(result.responseBody));
    } else {
      setListData([]);
    }
  };

  const getHRTalentWiseReport = async (row, BT) => {
    try{
    setShowAchievedReport(true);

    const pl = {
      hrBusinessType: "Global",
      month: moment(monthDate).format("M"),
      year: moment(monthDate).format("YYYY"),
      userCategory: row.userCategory,
      businessType: BT,
      stageID: row.stage_ID,
      amID: null,
    };
    setAchievedLoading(true);
    const result = await ReportDAO.getHrTAWiseReportDAO(pl);
    setAchievedLoading(false);
    if (result.statusCode === 200) {
      setListAchievedData(result.responseBody);
    } else {
      setListAchievedData([]);
    }
    }catch(err){
      console.log(err)
      setListAchievedData([]);
    }
    
  };

  useEffect(() => {
    getReport();
  }, [monthDate]);
  return (
    <div className={styles.snapshotContainer}>
      <div className={styles.filterContainer}>
        <div className={styles.filterSets}>
          <div className={styles.filterSetsInner}>
            <Title level={3} style={{ margin: 0 }}>
              {`${monthDate?.toLocaleString("default", {
                month: "long",
              })} ${selectedYear} - Revenue Report`}
            </Title>
          </div>
          <div className={styles.filterRight}>
            <div className={styles.calendarFilterSet}>
              <div className={styles.label}>Month-Year</div>
              <div className={styles.calendarFilter}>
                <CalenderSVG style={{ height: "16px", marginRight: "8px" }} />
                <DatePicker
                  onKeyDown={(e) => e.preventDefault()}
                  className={styles.dateFilter}
                  placeholderText="Month - Year"
                  selected={monthDate}
                  onChange={onMonthCalenderFilter}
                  dateFormat="MM-yyyy"
                  showMonthYearPicker
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Card bordered={false}>
        <div className={styles.customTableContainer}>
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <Table
              columns={getColumns()}
              dataSource={listData}
              bordered
              pagination={false}
              size="middle"
              scroll={{ x: "max-content" }}
              rowClassName={(record) =>
                record.isSpacer ? styles.spacerRow : ""
              }
            />
          )}
          <Col
            xs={24}
            sm={12}
            md={8}
            lg={6}
            xl={4}
            style={{ margin: "10px 0" }}
          >
            <Card size="small" style={{ height: "100%", width: "100%" }}>
              <Text>
                No. of working days:{" "}
                <strong>{listData[0]?.workingDaysTillNow}</strong>
              </Text>
            </Card>
          </Col>
        </div>
      </Card>

      {showAchievedReport && (
        <Modal
          width="1200px"
          centered
          footer={null}
          open={showAchievedReport}
          className="engagementModalStyle"
          onCancel={() => {
            setShowAchievedReport(false);
          }}
        >
          <div style={{ padding: "20px 15px" }}>
            <h3>
              <b></b>
            </h3>
          </div>

          {achievedLoading ? (
            <TableSkeleton />
          ) : listAchievedData.length > 0 ? (
            <div style={{ padding: "0 20px 20px 20px", overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 14,
                  textAlign: "left",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f0f0f0" }}>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                      HR Created Date
                    </th>
                      <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                      Closure Date
                    </th>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                      Company Name
                    </th>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                      HR Number
                    </th>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                      HR Title
                    </th>
                     <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                      Talent
                    </th>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                      Uplers Fees
                    </th>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                      Sales Person
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {listAchievedData.map((detail, index) => (
                    <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        {detail.hrCreatedDateStr}
                      </td>
                       <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        {detail.closureDateStr}
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        {detail.company}
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        {detail.hR_Number}
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        {detail.hrTitle}
                      </td>
                       <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        {detail.talent}
                      </td>
                       <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        {detail.uplersFeesStr}
                      </td>
                      <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                        {detail.salesPerson}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: "10px", display:'flex',justifyContent:'center',fontSize:'20px',fontWeight:500 }}>
              <p>No details available.</p>
            </div>
          )}

          <div style={{ padding: "10px", textAlign: "right" }}>
            <button
              className={styles.btnCancle}
              onClick={() => {
                setShowAchievedReport(false);
              }}
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
