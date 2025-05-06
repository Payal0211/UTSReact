import React, { useState, useMemo } from "react";
import { Table, Card, Typography, Row, Col, Divider, Select } from "antd";
import styles from "./dailySnapshot.module.css"; // Keep your styling here

const { Title, Text } = Typography;
const { Option } = Select;

const generateWeekColumns = (year, monthIndex, daysInMonth, firstDayOfMonth) => {
  const weeks = [];
  let currentDate = 1;
  let currentWeek = new Array(7).fill(null);

  for (let i = firstDayOfMonth; i < 7 && currentDate <= daysInMonth; i++) {
    currentWeek[i] = {
      day: new Date(year, monthIndex, currentDate).toLocaleString('en-us', { weekday: 'short' }),
      date: currentDate
    };
    currentDate++;
  }
  weeks.push(currentWeek);

  while (currentDate <= daysInMonth) {
    currentWeek = new Array(7).fill(null);
    for (let i = 0; i < 7 && currentDate <= daysInMonth; i++) {
      currentWeek[i] = {
        day: new Date(year, monthIndex, currentDate).toLocaleString('en-us', { weekday: 'short' }),
        date: currentDate
      };
      currentDate++;
    }
    weeks.push(currentWeek);
  }

  return weeks.map((week, weekIdx) => ({
    title: `Week ${weekIdx + 1}`,
    children: week.map((d, dayIdxInWeek) => ({
      title: d ? `${d.day} ${d.date}` : "-",
      dataIndex: d ? `day_${d.date}` : `placeholder_${dayIdxInWeek}_week_${weekIdx}`,
      width: 80,
      align: "center",
      render: (value) => (value === 0 || value == null ? "-" : value),
    })),
  }));
};

const columns = (weeks) => [
  {
    title: "Stage",
    dataIndex: "stage",
    fixed: "left",
    width: 180,
  },
  {
    title: "Goal for Month",
    dataIndex: "goalForMonth",
    width: 120,
    align: "center",
  },
  {
    title: "Goal till Date",
    dataIndex: "goalTillDate",
    width: 120,
    align: "center",
  },
  {
    title: "Reached",
    dataIndex: "reached",
    width: 100,
    align: "center",
  },
  {
    title: "Daily Goal",
    dataIndex: "dailyGoal",
    width: 100,
    align: "center",
  },
  ...weeks,
];

const data = [
  {
    key: 1,
    stage: "Profiles Shared",
    goalForMonth: 1360,
    goalTillDate: 62,
    reached: 32,
    dailyGoal: 62,
    day_1: 13,
    day_2: 19,
    day_3: 0,
    day_4: 0,
    day_5: 0,
    day_6: 0,
    day_7: 0,
    day_8: 0,
    day_9: 0,
    day_10: 0,
  },
  {
    key: 2,
    stage: "Interviews Done",
    goalForMonth: 680,
    goalTillDate: 31,
    reached: 5,
    dailyGoal: 31,
    day_1: 2,
    day_2: 3,
    day_3: 0,
    day_4: 0,
    day_5: 0,
    day_6: 0,
    day_7: 0,
    day_8: 0,
    day_9: 0,
    day_10: 0,
  },
  {
    key: 3,
    stage: "Offers",
    goalForMonth: 272,
    goalTillDate: 12,
    reached: 0,
    dailyGoal: 12,
    day_1: 0,
    day_2: 0,
    day_3: 0,
    day_4: 0,
    day_5: 0,
    day_6: 0,
    day_7: 0,
    day_8: 0,
    day_9: 0,
    day_10: 0,
  },
  {
    key: 4,
    stage: "Closures",
    goalForMonth: 136,
    goalTillDate: 6,
    reached: 0,
    dailyGoal: 6,
    day_1: 0,
    day_2: 0,
    day_3: 0,
    day_4: 0,
    day_5: 0,
    day_6: 0,
    day_7: 0,
    day_8: 0,
    day_9: 0,
    day_10: 0,
  },
];

const availableYears = [2023, 2024, 2025, 2026, 2027];

const DailySnapshot = () => {
  const [selectedMonth, setSelectedMonth] = useState(4);
  const [selectedYear, setSelectedYear] = useState(2025);

  const monthIndex = selectedMonth - 1;

  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

  const firstDayOfMonth = new Date(selectedYear, monthIndex, 1).getDay();

  const weeks = useMemo(
    () => generateWeekColumns(selectedYear, monthIndex, daysInMonth, firstDayOfMonth),
    [selectedYear, monthIndex, daysInMonth, firstDayOfMonth] 
  );

  return (
    <div className={styles.snapshotContainer}>
      <Title level={3} style={{ marginBottom: 24 }}>
        {`${new Date(selectedYear, monthIndex).toLocaleString('default', { month: 'long' })} ${selectedYear} - Daily Snapshot`}
      </Title>

      <div style={{ marginBottom: 24 }}>
        <Select
          value={selectedMonth}
          style={{ width: 150, marginRight: 8 }}
          onChange={(value) => setSelectedMonth(value)}
        >
          {[...Array(12).keys()].map((monthKey) => ( 
            <Option key={monthKey} value={monthKey + 1}> 
              {new Date(selectedYear, monthKey).toLocaleString('default', { month: 'long' })}
            </Option>
          ))}
        </Select>
        <Select
          value={selectedYear}
          style={{ width: 100 }}
          onChange={(value) => setSelectedYear(value)}
        >
          {availableYears.map(yearOpt => (
            <Option key={yearOpt} value={yearOpt}>{yearOpt}</Option>
          ))}
        </Select>
      </div>

      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Table
          columns={columns(weeks)}
          dataSource={data}
          bordered
          pagination={false}
          scroll={{ x: "max-content" }}
        />
      </Card>

      <Card bordered={false} title="Key Metrics">
        <Row gutter={16}>
          <Col span={8}>
            <Text strong>Profile to Interview %</Text>
            <Divider style={{ margin: '8px 0' }} />
            <Text>Goal: <strong>50%</strong></Text>
            <br />
            <Text>Achieved: <strong>0.00%</strong></Text>
          </Col>
          <Col span={8}>
            <Text strong>Interview to Offer %</Text>
            <Divider style={{ margin: '8px 0' }} />
            <Text>Goal: <strong>20%</strong></Text>
            <br />
            <Text>Achieved: <strong>#DIV/0!</strong></Text>
          </Col>
          <Col span={8}>
            <Text strong>Avg profiles shared per rec.</Text>
            <Divider style={{ margin: '8px 0' }} />
            <Text>Goal: <strong>3.64</strong></Text>
            <br />
            <Text>Achieved: <strong>1.88</strong></Text>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default DailySnapshot;