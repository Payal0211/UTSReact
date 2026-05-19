import React, {useState, useEffect} from 'react'
import uplersStyle from "./weeklyWCGR.module.css"
import {
  Select,
  Table,
  Typography,
  Modal,
  Tooltip,
  InputNumber,
  message,
  Skeleton,
  Checkbox,
  Col,
  Radio,
  Card,
  Spin,
  Avatar,
  Tabs,
} from "antd";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import DatePicker from "react-datepicker";
import moment from "moment";
import { ReportDAO } from  "core/report/reportDAO";
import { HTTPStatusCode } from "constants/network";
import { useNavigate } from "react-router-dom";
import UTSRoutes from "constants/routes";

const { Title, Text } = Typography;

function WeeklyWCGR() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingTable, setIsLoadingTable] = useState(false);
     const [monthDate, setMonthDate] = useState( new Date());
       const selectedYear = monthDate.getFullYear();
         const [hrModal, setHRModal] = useState('DP');
          const [pODList, setPODList] = useState([]);
            const [pODUsersList, setPODUsersList] = useState([]);
            const [selectedHead, setSelectedHead] = useState('');
            const [tableData, setTableData] = useState([]);
            const [headerDataCol, setHeaderDataCol] = useState({});

 const getGroupUsers = async (ID) => {
    setIsLoading(true);
    
    let pl = {
      id: ID,
      month: moment(monthDate).format("MM"),
      year: selectedYear,
    }

    let filterResult = await ReportDAO.getAllPODGroupUsersDAO(pl);
    setIsLoading(false);
    if (filterResult.statusCode === HTTPStatusCode.OK) {
      setPODUsersList(filterResult && filterResult?.responseBody);
    } else if (filterResult?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
      // setLoading(false);
      return navigate(UTSRoutes.LOGINROUTE);
    } else if (
      filterResult?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
    ) {
      // setLoading(false);
      return navigate(UTSRoutes.SOMETHINGWENTWRONG);
    } else {
      return "NO DATA FOUND";
    }
  };

    // useEffect(() => {
    //   // set modal to contract for stanley 
    //   if(userData?.EmployeeID ==="UP1831"){
       
    //       setHRModal('Contract');
    //       let val = pODList.find(
    //                   (i) => i.dd_text === "Orion"
    //                 )?.dd_value;
    //                 setSelectedHead(val);
    //                 getGroupUsers(val);
           
    //   }
    
    // }, [userData,pODList]);

     const getHeads = async () => {
        setIsLoading(true);
    
        let filterResult = await ReportDAO.getAllPODGroupDAO();
        setIsLoading(false);
        if (filterResult.statusCode === HTTPStatusCode.OK) {
          setPODList(filterResult && filterResult?.responseBody);
         
          setSelectedHead(prev =>{
            if(prev ===''){
               getGroupUsers(filterResult?.responseBody[0]?.dd_value);
              return filterResult?.responseBody[0]?.dd_value
            }else{
               getGroupUsers(prev);
              return prev
            }
            
          }  );
        } else if (filterResult?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
          // setLoading(false);
          return navigate(UTSRoutes.LOGINROUTE);
        } else if (
          filterResult?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
        ) {
          // setLoading(false);
          return navigate(UTSRoutes.SOMETHINGWENTWRONG);
        } else {
          return "NO DATA FOUND";
        }
      };
    
        useEffect(() => {
          getHeads();
      
        }, []);

      const addSectionHeaders = (data) => {
  let previousSection = "";

  return data.flatMap((item, index) => {
    const rows = [];

    // skip first metric row if needed
    if (
      item.stage_Title &&
      item.stage_Title !== previousSection
    ) {
      rows.push({
        key: `section_${index}`,
        isSection: true,
        sectionTitle: item.stage_Title,
        color:
          item.stage_Title.includes("JOINING") || item.stage_Title.includes("NEW CUSTOMER FUNNEL") ? "#c05a00"
            : item.stage_Title.includes("SELECTION")  ? "#2952d1"
             : item.stage_Title.includes("CUSTOMER EXPERIENCE")  ? "#15803D"
             : item.stage_Title.includes("PIPELINE REVIEW")  ? "#BE123C"
              : item.stage_Title.includes("CUSTOMER OVERVIEW")  ? "#6D28D9"
               : item.stage_Title.includes("TOP CLIENTS")  ? "#0F766E"
            : "#666666",
      });

      previousSection = item.stage_Title;
    }

    rows.push({
      ...item,
      key: item.stage_ID,
    });

    return rows;
  });
};

    const getJoiningRevenueData = async () => {
      setIsLoadingTable(true);
       let query = `?podId=${selectedHead}&Month=${moment(monthDate).format("M")}&Year=${selectedYear}`;

       const result = await ReportDAO.getJoiningRevenueDataDAO(query);
        setIsLoadingTable(false);
console.log("Joining Revenue Data: ", result);
        if(result.statusCode === HTTPStatusCode.OK){
          setHeaderDataCol(result?.responseBody[0]);
        let tempData = addSectionHeaders(result?.responseBody);
         tempData.shift();
        setTableData(tempData);
        // tempData.shift();
        //   setTableData([
        //     {
        //       key: "joining_header",
        //       isSection: true,
        //       sectionTitle: "JOINING · Revenue",
        //       color: "#c05a00",
        //     },
        //     ...tempData,
        //   ]);
        } else if (result?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
          // setLoading(false);
          return navigate(UTSRoutes.LOGINROUTE);
        } else if (
          result?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
        ) { 
          return navigate(UTSRoutes.SOMETHINGWENTWRONG);
        } else {
          message.error("Failed to fetch data");
        }


    }

    useEffect(() => {
      if(selectedHead){
         getJoiningRevenueData();
      }
    }, [selectedHead,monthDate]);


const getTableColumns = () => {
  const countLeafColumns = (columns) =>
    columns.reduce((count, column) => {
      if (column.children && column.children.length) {
        return count + countLeafColumns(column.children);
      }
      return count + 1;
    }, 0);

  let columnCount = 0;

  // const currentMonth = moment(monthDate).format("MMMM").toUpperCase();
  // const nextMonth = moment(monthDate).add(1, "month").format("MMMM").toUpperCase();
  // const thirdMonth = moment(monthDate).add(2, "month").format("MMMM").toUpperCase();
  const currentMonth = headerDataCol?.startMonth_Name;
  const nextMonth = headerDataCol?.midMonth_Name;
  const thirdMonth = headerDataCol?.endMonth_Name;

  const columns = [
    {
      title: "METRIC",
      dataIndex: "stage",
      key: "stage",
      width: 200,
      fixed: "left",
      className: "black-header",
       onHeaderCell: () => ({
    className: "black-header",
  }),
   render: (text, record) => {
    if (record.isSection) {
      return {
        children: (
          <div
            style={{
              background:record.color,
              color: "#fff",
              fontWeight: 700,
              padding: "10px 16px",
              fontSize: "18px",
            }}
          >
            ▌ {record.sectionTitle}
          </div>
        ),

        props: {
          colSpan: columnCount,
        },
      };
    }

    return text;
  },
    },

    // {
    //   title: "CADENCE",
    //   dataIndex: "cadence",
    //   key: "cadence",
    //   width: 100,
    //   align: "center",
    //   fixed: "left",
    //   className: "black-header",
    // },
    {
      // title: "QUARTERLY",
       title: headerDataCol?.stage_ID,
      dataIndex: "quarterlyTotalStr",
      key: "quarterlyTotalStr",
      width: 120,
       fixed: "left",
      align: "center",
      className: `black-header ${uplersStyle.QuarterlyCol}`,
       onHeaderCell: () => ({
    className: "black-header",
  }),
   render: (text, record) => {
    if (record.isSection) {
      return {
        props: {
          colSpan: 0,
        },
      };
    }

    return text;
  },
    },

    // MONTH 1
    {
      title: currentMonth,
            className: "blue-total-header",
        onHeaderCell: () => ({
        className: "blue-total-header",
      }),
      children: [
        {
          title: "Total",
          dataIndex: 'startMonth_MonthlyTotalStr',
          key: "m1_total",
          width: 100,
          align: "center",
            className: `black-header ${uplersStyle.totalCol}`,
              render: (text, record) => {
    if (record.isSection) {
      return {
        props: {
          colSpan: 0,
        },
      };
    }

    return text;
  },
        },
        {
          title: "W1",
          dataIndex: 'startMonth_W1Str',
          key: "m1_w1",
          width: 100,
          align: "center",
           render: (text, record) => {
    if (record.isSection) {
      return {
        props: {
          colSpan: 0,
        },
      };
    }

    return text;
  },
        },
        {
          title: "W2",
          dataIndex: 'startMonth_W2Str',
          key: "m1_w2",
          width: 100,
          align: "center",
           render: (text, record) => {
    if (record.isSection) {
      return {
        props: {
          colSpan: 0,
        },
      };
    }

    return text;
  },  
        },
        {
          title: "W3",
          dataIndex: 'startMonth_W3Str',
          key: "m1_w3",
          width: 100,
          align: "center",
           render: (text, record) => {
    if (record.isSection) {
      return {
        props: {
          colSpan: 0,
        },
      };
    }

    return text;
  },
        },
        {
          title: "W4",
          dataIndex: 'startMonth_W4Str',
          key: "m1_w4",
          width: 100,
          align: "center",
           render: (text, record) => {
    if (record.isSection) {
      return {
        props: {
          colSpan: 0,
        },
      };
    }

    return text;
  },
        },
            {
          title: "W5",
          dataIndex: 'startMonth_W5Str',
          key: "m1_w5",
          width: 100,
          align: "center",
           render: (text, record) => {
    if (record.isSection) {
      return {
        props: {
          colSpan: 0,
        },
      };
    }

    return text;
  },
        },
      ],
    },

    // MONTH 2
    {
      title: nextMonth,
       className: "green-total-header",
       onHeaderCell: () => ({
        className: "blue-total-header",
      }),
      children: [
        {
          title: "Total",
          dataIndex: 'midMonth_MonthlyTotalStr',
          key: "m2_total",
          width: 100,
          align: "center",
         className: `black-header ${uplersStyle.totalCol}`,
               render: (text, record) => {
    if (record.isSection) {
      return {
        props: {
          colSpan: 0,
        },
      };
    }

    return text;
  },
        },
        {
          title: "W1",
          dataIndex: 'midMonth_W1Str',
          key: "m2_w1",
          width: 100,
          align: "center",
           render: (text, record) => {
    if (record.isSection) {
      return {
        props: {
          colSpan: 0,
        },
      };
    }

    return text;
  },
        },
        {
          title: "W2",
          dataIndex: 'midMonth_W2Str',
          key: "m2_w2",
          width: 100,
          align: "center",
           render: (text, record) => {
    if (record.isSection) {
      return {
        props: {
          colSpan: 0,
        },
      };
    }

    return text;
  },
        },
        {
          title: "W3",
          dataIndex: 'midMonth_W3Str',
          key: "m2_w3",
          width: 100,
          align: "center",
           render: (text, record) => {
    if (record.isSection) {
      return {
        props: {
          colSpan: 0,
        },
      };
    }

    return text;
  },
        },
        {
          title: "W4",
          dataIndex: 'midMonth_W4Str',
          key: "m2_w4",
          width: 100,
          align: "center",
           render: (text, record) => {
    if (record.isSection) {
      return {
        props: {
          colSpan: 0,
        },
      };
    }

    return text;
  },

        },
          {
          title: "W5",
          dataIndex: 'midMonth_W5Str',
          key: "m2_w5",
          width: 100,
          align: "center",
           render: (text, record) => {
    if (record.isSection) {
      return {
        props: {
          colSpan: 0,
        },
      };
    }

    return text;
  },
        },
      ],
    },

    // MONTH 3
    {
      title: thirdMonth,
     className: "purple-total-header",
        onHeaderCell: () => ({
        className: "blue-total-header",
      }),
      children: [
        {
          title: "Total",
          dataIndex: 'endMonth_MonthlyTotalStr',
          key: "m3_total",
          width: 100,
          align: "center",
            className: `black-header ${uplersStyle.totalCol}`,
             render: (text, record) => {
    if (record.isSection) {
      return {
        props: {
          colSpan: 0,
        },
      };
    }

    return text;
  },
             
        },
        {
          title: "W1",
          dataIndex: 'endMonth_W1Str',
          key: "m3_w1",
          width: 100,
          align: "center",
           render: (text, record) => {
    if (record.isSection) {
      return {
        props: {
          colSpan: 0,
        },
      };
    }

    return text;
  },
        },
        {
          title: "W2",
          dataIndex: 'endMonth_W2Str',
          key: "m3_w2",
          width: 100,
          align: "center",
           render: (text, record) => {
    if (record.isSection) {
      return {
        props: {
          colSpan: 0,
        },
      };
    }

    return text;
  },
        },
        {
          title: "W3",
          dataIndex: 'endMonth_W3Str',
          key: "m3_w3",
          width: 100,
          align: "center",
           render: (text, record) => {
    if (record.isSection) {
      return {
        props: {
          colSpan: 0,
        },
      };
    }

    return text;
  },
        },
        {
          title: "W4",
          dataIndex: 'endMonth_W4Str',
          key: "m3_w4",
          width: 100,
          align: "center",
           render: (text, record) => {
    if (record.isSection) {
      return {
        props: {
          colSpan: 0,
        },
      };
    }

    return text;
  },
        },
          {
          title: "W5",
          dataIndex: 'endMonth_W5Str',
          key: "m3_w5",
          width: 100,
          align: "center",
           render: (text, record) => {
    if (record.isSection) {
      return {
        props: {
          colSpan: 0,
        },
      };
    }

    return text;
  },
        },
      ],
    },
  ];

  columnCount = countLeafColumns(columns);
  return columns;
};

  return (
     <div className={uplersStyle.hiringRequestContainer}>
        <div className={uplersStyle.filterContainer}>
          <div className={uplersStyle.filterSets}>
            <div className={uplersStyle.filterSetsInner}>
              <Title level={4} style={{ margin: 0 }}>
              Weekly Consulting Growth Review 
              {/* {`${monthDate?.toLocaleString("default", {
                  month: "long",
                })} ${selectedYear}`} */}
              </Title>
            </div>
            <div className={uplersStyle.filterRight}>
              <Radio.Group
                onChange={(e) => {
                  setHRModal(e.target.value);
                  if (e.target.value === "Contract") {
                    let val = pODList.find(
                      (i) => i.dd_text === "Orion"
                    )?.dd_value;
                    setSelectedHead(val);
                    getGroupUsers(val);
                  } else {
                    let val = pODList[0]?.dd_value;
                    setSelectedHead(val);
                    getGroupUsers(val);
                  }

                  //  setEngagementType(e.target.value);
                }}
                value={hrModal}
              >
                <Radio value={"DP"}>FTE</Radio>
                {/* <Radio value={"Contract"}>Contract</Radio> */}
              </Radio.Group>
              <Select
                id="selectedValue"
                placeholder="Select Head"
                style={{ width: "270px" }}
                // mode="multiple"
                value={selectedHead}
                showSearch={true}
                onChange={(value, option) => {
                  setSelectedHead(value);
                  getGroupUsers(value);
                }}
                options={pODList?.map((v) => ({
                  label: v.dd_text,
                  value: v.dd_value,
                })).filter(item=>{
                  if(hrModal === "DP"){
                    return item.value !== 5
                  }else{
                    return item.value === 5
                  }
                })}
                optionFilterProp="label"
              />
              <div className={uplersStyle.calendarFilterSet}>
                <div className={uplersStyle.label}>Month-Year</div>
                <div className={uplersStyle.calendarFilter}>
                  <CalenderSVG style={{ height: "16px", marginRight: "8px" }} />
                  <DatePicker
                    onKeyDown={(e) => e.preventDefault()}
                    className={uplersStyle.dateFilter}
                    placeholderText="Month - Year"
                    selected={monthDate}
                    onChange={(date) => setMonthDate(date)}
                    dateFormat="MM-yyyy"
                    showMonthYearPicker
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={uplersStyle.tableWrapper}>
          {isLoading ? (
            <Skeleton active />
          ) : (
            <Table
              columns={getTableColumns()}
              dataSource={tableData}
              loading={isLoading}
              pagination={false}
              scroll={{
                x: "max-content",
                y: "calc(100vh - 280px) !important",
              }}
              size="small"
              bordered
              rowClassName={(record) => {
                if (record.stage === "Joining Goal" || record.stage === "Net Joining Achieved") {
                  return uplersStyle.boldRow;
                }
              }}
            />
          )}
        </div>
     </div>
  )
}

export default WeeklyWCGR