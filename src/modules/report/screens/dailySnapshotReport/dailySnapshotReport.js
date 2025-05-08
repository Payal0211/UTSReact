import React, { useState, useMemo, useEffect } from "react";
import { Table, Card, Typography, Row, Col, Divider } from "antd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./dailySnapshot.module.css";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import moment from "moment";
import { ReportDAO } from "core/report/reportDAO";
import { HTTPStatusCode } from "constants/network";
import UTSRoutes from "constants/routes";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

// Generate columns for the weeks of the selected month
const generateWeekColumns = (year, monthIndex, daysInMonth) => {
  const weeks = [];
  let currentDate = 1;

  while (currentDate <= daysInMonth) {
    const week = new Array(7).fill(null);
    for (let i = 0; i < 7 && currentDate <= daysInMonth; i++) {
      const date = new Date(year, monthIndex, currentDate);
      week[i] = {
        day: date.toLocaleString("en-us", { weekday: "short" }),
        date: currentDate,
      };
      currentDate++;
    }
    weeks.push(week);
  }

  return weeks.map((week, weekIdx) => ({
    title: `Week ${weekIdx + 1}`,
    children: week.filter((d) => d !== null).map((d) => ({
      key: `day_${d.date}`,
      title: d.day,
      dataIndex: `day_${d.date}`,
      width: 80,
      align: "center",
      render: (value) => (value === 0 || value == null ? "-" : value),
      className: d.day === "Sat" || d.day === "Sun" ? styles.weekendColumn : "",
    })),
  }));
};

const columns = (weeks) => [
  { title: "Stage", dataIndex: "stage", fixed: "left", width: 180 ,},
  {
    title: "Goal for Month",
    dataIndex: "goalForMonth",
    width: 120,
    fixed: "left",
    align: "center",
    render: (value) => value || "-",
    className: styles.goalForMonthColumn,
  },
  {
    title: "Goal till Date",
    dataIndex: "goalTillDate",
    fixed: "left",
    width: 120,
    align: "center",
    render: (value) => value || "-",
    className: styles.goalTillDateColumn,
  },
  {
    title: "Reached",
    dataIndex: "reachedStr",
    fixed: "left",
    width: 100,
    align: "center",
    render: (value) => {
      const numericValue = Number(value);    
      if (value == null || numericValue === 0) {
        return "-";
      }    
      return value;
    },
    className: styles.reachedColumn,
  },
  {
    title: "Daily Goal",
    dataIndex: "dailyGoal",
    fixed: "left",
    width: 100,
    align: "center",
    render: (value) => value || "-",
    className: styles.dailyGoalColumn,
  },
  ...weeks,
];

const DailySnapshot = () => {
  const navigate = useNavigate();
  const [recruiterListData, setRecruiterListData] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [monthDate, setMonthDate] = useState(new Date());

  const selectedYear = monthDate.getFullYear();
  const monthIndex = monthDate.getMonth();
  const daysInMonth = new Date(selectedYear, monthIndex + 1, 0).getDate();

  // Memoized week columns for better performance
  const weeks = useMemo(() => generateWeekColumns(selectedYear, monthIndex, daysInMonth), [selectedYear, monthIndex, daysInMonth]);

  const onMonthCalenderFilter = (date) => {
    setMonthDate(date);
  };

  useEffect(() => {
    getDailySnapshotData();
  }, [monthDate]);

  // Fetch daily snapshot data and handle API responses
  const getDailySnapshotData = async () => {
    const payload = {
      month: moment(monthDate).month() + 1, // Months are 0-indexed in JS
      year: moment(monthDate).year(),
    };

    setIsLoading(true);
    try {
      const result = await ReportDAO.getDailySnapshotDAO(payload);
      if (result.statusCode === HTTPStatusCode.OK) {
        const rawData = result?.responseBody?.SnapShotInfo || [];
        const metricsData = result?.responseBody?.MetricsInfo || [];
        
        setMetrics(metricsData);

        const formattedData = rawData.map((item) => {
          const { stage, stage_ID, goalForMonth, goalTillDate, reachedStr, dailyGoal, dailyCounts = {} } = item;
          const dailyMapped = {};
          for (let i = 1; i <= daysInMonth; i++) {
            dailyMapped[`day_${i}`] = dailyCounts[`day_${i}`] ?? null;
          }
          return {
            key: stage_ID || stage,
            stage,
            goalForMonth,
            goalTillDate,
            reachedStr,
            dailyGoal,
            ...dailyMapped,
          };
        });

        setRecruiterListData(formattedData);
      } else if (result.statusCode === HTTPStatusCode.NOT_FOUND) {
        setRecruiterListData([]);
      } else if (result?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
        navigate(UTSRoutes.LOGINROUTE);
      } else if (result?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
        navigate(UTSRoutes.SOMETHINGWENTWRONG);
      }
    } catch (error) {
      console.error("Error fetching daily snapshot data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMetricCol = (metric) => (
    <Col
      key={metric.stage_ID}
      xs={24} sm={12} md={6} lg={4} xl={3}
      style={{ minWidth: 250,margin:"10px",padding:"10px" }}
    >
      <Card size="small" style={{ height: '100%' }}>
        <Text strong>{metric.stage}</Text>
        <Divider style={{ margin: "8px 0" }} />
        <Text>Goal: <strong>{metric.goalForMonth}%</strong></Text><br />
        <Text>Achieved: <strong>{metric.reachedStr ? `${metric.reachedStr}%` : "0%"}</strong></Text>
      </Card>
    </Col>
  );
  

  return (
    <div className={styles.snapshotContainer}>
      <div className={styles.filterContainer}>
        <div className={styles.filterSets}>
          <div className={styles.filterSetsInner}>
            <Title level={3} style={{ margin: 0 }}>
              {`${monthDate?.toLocaleString("default", { month: "long" })} ${selectedYear} - Daily Snapshot`}
            </Title>
          </div>
          <div className={styles.filterRight}>
            <div className={styles.calendarFilterSet}>
              <div className={styles.label}>Month-Year</div>
              <div className={styles.calendarFilter}>
                <CalenderSVG style={{ height: "16px", marginRight: "8px" }} />
                <DatePicker
                  onKeyDown={(e) => e.preventDefault()} // Prevent key events
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

      <Card bordered={false} style={{ marginBottom: 24 }}>
      <Table
        columns={columns(weeks)}
        dataSource={recruiterListData}
        bordered
        loading={isLoading}
        pagination={false}       
        scroll={{ x: "max-content", y: 0 }}
      />
      </Card>

      <Card bordered={false} title="Key Metrics" style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column', 
        }}> 
        <div style={{display:'flex',flexWrap:"wrap"}}>
          {metrics.map(renderMetricCol)}            
        </div>        
      </Card>
    </div>
  );
};

export default DailySnapshot;
