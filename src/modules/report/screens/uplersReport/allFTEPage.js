import React, { useState, useEffect, Suspense } from "react";
import uplersStyle from "./uplersReport.module.css";
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
import FeedBack from "assets/svg/feedbackReceived.png";
import Handshake from "assets/svg/handshake.svg";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import Diamond from "assets/svg/diamond.svg";
import { ReportDAO } from "core/report/reportDAO";
import { HTTPStatusCode } from "constants/network";
import { useNavigate } from "react-router-dom";
import UTSRoutes from "constants/routes";
import DatePicker from "react-datepicker";
import moment from "moment";
import { All_Hiring_Request_Utils } from "shared/utils/all_hiring_request_util";
import { size } from "lodash";
import { IoMdAddCircle } from "react-icons/io";
import { IoChatboxEllipses } from "react-icons/io5";
import { IconContext } from "react-icons";
import { TaDashboardDAO } from "core/taDashboard/taDashboardDRO";
import spinGif from "assets/gif/RefreshLoader.gif";
import Editor from "modules/hiring request/components/textEditor/editor";
import { UserSessionManagementController } from "modules/user/services/user_session_services";
import PodReports from "./podReports";
import NegotiontoJoinee from "./negotiontoJoinee";
import FTENegotiationSummary from "./fteNegotionSummary";
import QASummary from "./qaSummary";

const { Title, Text } = Typography;

export default function AllFTEPage() {
      const navigate = useNavigate();
      const [isLoading, setIsLoading] = useState(false);
      const [isTableLoading,setIsTableLoading] = useState(false)
      const [dashboardTabTitle,setDashboardTabTitle] = useState('Dashboard')
    const [monthDate, setMonthDate] = useState(new Date());
    const today = new Date()
    const selectedYear = monthDate.getFullYear();
     const [pODList, setPODList] = useState([]);
      const [pODUsersList, setPODUsersList] = useState([]);
     const [selectedHead, setSelectedHead] = useState('');
    const [selectedMonths, setSelectedMonths] = useState([])
    const [hrModal, setHRModal] = useState('DP');
    const [dashboardData, setDashboardData] = useState([])

    const [monthList, setMonthList] = useState("");
    const [monthNamesStr,setMonthsNameStr] = useState([])
     const [showAchievedReport, setShowAchievedReport] = useState(false);
     const [listAchievedData, setListAchievedData] = useState([]);
     const [achievedLoading, setAchievedLoading] = useState(false);

    const [showTalentCol, setShowTalentCol] = useState({});
    const [achievedTotal, setAchievedTotal] = useState("");

   const monthOrder = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

    useEffect(() => {
        let month = monthDate.getMonth()

        // let mObject = monthsArray.find(i => i.value === month)
        setSelectedMonths([month])
        // console.log(month, mObject)
    }, [])

     const getHeads = async () => {
        setIsLoading(true);
    
        let filterResult = await ReportDAO.getAllPODGroupDAO();
        setIsLoading(false);
        if (filterResult.statusCode === HTTPStatusCode.OK) {
          setPODList(filterResult && filterResult?.responseBody);
         
          setSelectedHead(prev =>{
            if(prev ===''){
              return filterResult?.responseBody[0]?.dd_value
            }else{
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

       const getDBpopupReport = async (row, v, month) => {
          try {
            setShowAchievedReport(true);
      
            const pl = {
              hrmodel: hrModal,
              pod_id: dashboardTabTitle === 'All FTE Dashboard' ? 0 :  selectedHead, 
              monthstr: selectedMonths.map(i=> i+1).join(','),
              yearstr: moment(monthDate).format("YYYY"),
              stageID: row.stage_ID,
              category: row.category,
              monthno: month ? monthOrder.findIndex(m => m === month) + 1 : '',
              multiplePODIds: dashboardTabTitle === 'All FTE Dashboard' ? '1,2,3' : ''
            };
            setShowTalentCol(row);
            setAchievedTotal(v);
            setAchievedLoading(true);
            const result = await ReportDAO.getPOCPopupMultiMonthReportDAO(pl);
            setAchievedLoading(false);
            if (result.statusCode === 200) {
              setListAchievedData(result.responseBody);
            } else {
              setListAchievedData([]);
            }
          } catch (err) {
            console.log(err);
            setListAchievedData([]);
          }
        };

      const mapMonthStageWise = (data) =>{
            let stages = []
            let months = []
            let newD = []

            data.forEach(itm=> {
                if(!stages.includes(itm.stage)){
                    stages.push(itm.stage)
                }
                 if(!months.includes(itm.month_Name)){
                    months.push(itm.month_Name)
                }
            })

            stages.forEach(itm=> {
                let allStageData = data.filter(i=> i.stage=== itm)
                let obj = {...allStageData[0]}
                
                months.forEach(mont=>{                
                    let monthD = allStageData.find(si=> si.month_Name === mont)
                    obj[mont] = monthD?.monthAmountSTR ?? ''
                })
                newD.push(obj)
            })
            // console.log('newD',months,stages, newD,data)
            setMonthsNameStr(months)
            return newD
      }

        const getColumns = () => [
          {
            title: "Stages",
            dataIndex: "stage",
            key: "stage",
            width: 200,
            className: `${uplersStyle.stagesHeaderCell} ${uplersStyle.headerCommonConfig} `,
          },
                {
            title: <div style={{ textAlign: "center" }}>Goal</div>,
            dataIndex: "goalStr",
            key: "goalStr",
            width: 120,
            align: "right",
            onHeaderCell: () => ({
              className: uplersStyle.headerCommonGoalHeaderConfig,
            }),
            className: `${uplersStyle.headerCommonConfig}`,
 
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
              render: (v, rec) => {
        return v ? (
          rec.stage === "Goal" || rec.stage.includes("%") ? (
            v
          ) : (
            <span
              onClick={() => {
                  getDBpopupReport(rec, v);
              }}
              style={{ cursor: "pointer", color: "#1890ff" }}
            >
              {v}
            </span>
          )
        ) : (
          ""
        );
      }
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
         
          ...monthNamesStr?.sort(
  (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)
)?.map(mon=>({
            title: <div style={{ textAlign: "center" }}>{mon}</div>,
            dataIndex: mon,
            key: mon,
            width: 120,
            align: "right",
            onHeaderCell: () => ({
              className: uplersStyle.headerCommonGoalHeaderConfig,
            }),
            className: `${uplersStyle.headerCommonConfig}`,
             render: (v, rec) => {
        return v ? (
          rec.stage === "Goal" || rec.stage.includes("%") ? (
            v
          ) : (
            <span
              onClick={() => {
                  getDBpopupReport(rec, v, mon);
              }}
              style={{ cursor: "pointer", color: "#1890ff" }}
            >
              {v}
            </span>
          )
        ) : (
          ""
        );
      },
          }
          ))
      

        ];

    const  getDashboardList = async () =>{

          let pl = {
             hrmodel: hrModal,
             pod_id: selectedHead,
             month: selectedMonths.map(i=> i+1).join(','),
             year: `${selectedYear}`,
             multiplePODIds: ''
           };

         setIsTableLoading(true);
    
        let Result = await ReportDAO.getAllPODDashboardMonthsDAO(pl);
        setIsTableLoading(false);
        if (Result.statusCode === HTTPStatusCode.OK) {
            console.log('res',Result)
            let data = Result.responseBody
            setDashboardData(mapMonthStageWise(data))
        } else if (Result?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
          // setLoading(false);
          return navigate(UTSRoutes.LOGINROUTE);
        } else if (
          Result?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
        ) {
          // setLoading(false);
          return navigate(UTSRoutes.SOMETHINGWENTWRONG);
        } else {
            setDashboardData(mapMonthStageWise([]))
          return "NO DATA FOUND";
        }
    }

    useEffect(() => {
      if(selectedHead){
        getDashboardList()
      }


    }, [selectedMonths, hrModal, monthDate,selectedHead])


    const MONTHS = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];



    const toggleMonth = (index) => {
        let updated;
        if (selectedMonths.includes(index)) {
            updated = selectedMonths.filter(m => m !== index);
        } else {
            updated = [...selectedMonths, index].sort((a, b) => a - b);
        }
       updated.length > 0 && setSelectedMonths(updated);
        // onChange(updated.map(m => m + 1).join(",")); // SQL ready
    };





    return (
        <div className={uplersStyle.hiringRequestContainer}>
            <div className={uplersStyle.filterContainer}>
                <div className={uplersStyle.filterSets}>
                    <div className={uplersStyle.filterSetsInner}>
                    <Title level={3} style={{ margin: 0 }}>
                      {`${today?.toLocaleString("default", {
                        month: "long",
                      })} ${selectedYear}`}
                    </Title>
                  </div>
                    <div className={uplersStyle.filterRight} style={{ flexWrap: 'nowrap', gap: '5px' }}>
                        <Radio.Group
                            onChange={(e) => {
                                setHRModal(e.target.value);
                                if (e.target.value === "Contract") {
                                  let val = pODList.find(
                                    (i) => i.dd_text === "Orion"
                                  )?.dd_value;
                                  setSelectedHead(val);
                                //   getGroupUsers(val);
                                } else {
                                  let val = pODList[0]?.dd_value;
                                  setSelectedHead(val);
                                //   getGroupUsers(val);
                                }

                                //  setEngagementType(e.target.value);
                            }}
                            value={hrModal}
                        >
                            <Radio value={"DP"}>FTE</Radio>
                            <Radio value={"Contract"}>Contract</Radio>
                        </Radio.Group>
                        <Select
                      id="selectedValue"
                      placeholder="Select Head"
                      style={{ width: "250px" }}
                      // mode="multiple"
                      value={selectedHead}
                      showSearch={true}
                      onChange={(value, option) => {
                        setSelectedHead(value);
                        // getGroupUsers(value);
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
                        <div className={uplersStyle.monthPicker}>
                            <div className={uplersStyle.monthGrid}>
                                {MONTHS.map((m, i) => (
                                    <div
                                        key={m}
                                        className={`${uplersStyle.monthBox} ${selectedMonths.includes(i) ? uplersStyle.selected : ""}`}
                                        onClick={() => toggleMonth(i)}
                                    >
                                        {m}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={uplersStyle.calendarFilterSet}>
                            <div className={uplersStyle.label}>Year</div>
                            <div className={`${uplersStyle.calendarFilter} ${uplersStyle.calendarFilterYear}`}>
                                <CalenderSVG style={{ height: "16px", marginRight: "8px" }} />
                                <DatePicker
                                    onKeyDown={(e) => e.preventDefault()}
                                    className={uplersStyle.dateFilter}
                                    placeholderText="Year"
                                    selected={monthDate}
                                    onChange={(date) => setMonthDate(date)}
                                    dateFormat="yyyy"
                                    showYearPicker
                                    yearItemNumber={9}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

                  <Tabs 
                    onChange={(e) => setDashboardTabTitle(e)}
                    defaultActiveKey="1"
                    activeKey={dashboardTabTitle}
                    animated={true}
                    tabBarGutter={50}
                    tabBarStyle={{ borderBottom: `1px solid var(--uplers-border-color)` }} 
                     items={[
                      {
                        label: "Dashboard",
                        key: "Dashboard",
                        children:         <>
      <div className={uplersStyle.filterContainer} style={{ padding: "12px" }}>
        <div className={uplersStyle.customTableContainer}>
          {isTableLoading ? (
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
                All
              </p>
              <Table
                columns={getColumns()}
                dataSource={dashboardData.filter(
                  (item) => item.category === "All"
                )}
                bordered
                pagination={false}
                size="middle"
                scroll={{ x: "max-content", y: "1vh" }}
                rowClassName={(record) => {
                  if (record.stage === "Goal") {
                    return uplersStyle.heighliteRow;
                  }
                  if (record.stage === "Joining") {
                    return uplersStyle.heighliteGreen;
                  }
                  if (record.stage === "Selections/Closures") {
                    return uplersStyle.heighliteOrange;
                  }
                  if (record.stage === "Lost (Pipeline)") {
                    return uplersStyle.heighliteRed;
                  }
                  if (record.stage === "Total Active Pipeline") {
                    return uplersStyle.heighlitePurple;
                  }
                  //   if (record.stage === "Not Accepted HRs") {
                  //   return uplersStyle.heighliteDarkRed;
                  // }
                }}
              />
            </>
          )}
        </div>
      </div>

      <div className={uplersStyle.filterContainer} style={{ padding: "12px" }}>
        <div className={uplersStyle.customTableContainer}>
          {isTableLoading ? (
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
                New Business
              </p>
              <Table
                columns={getColumns()}
                dataSource={dashboardData.filter(
                  (item) => item.category === "New"
                )}
                bordered
                pagination={false}
                size="middle"
                scroll={{ x: "max-content", y: "1vh" }}
                rowClassName={(record) => {
                  if (record.stage === "Goal") {
                    return uplersStyle.heighliteRow;
                  }
                  if (record.stage === "Joining") {
                    return uplersStyle.heighliteGreen;
                  }
                  if (record.stage === "Selections/Closures") {
                    return uplersStyle.heighliteOrange;
                  }
                  if (record.stage === "Lost (Pipeline)") {
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

      <div className={uplersStyle.filterContainer} style={{ padding: "12px" }}>
        <div className={uplersStyle.customTableContainer}>
          {isTableLoading ? (
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
                Existing Business
              </p>
              <Table
                columns={getColumns()}
                dataSource={dashboardData.filter(
                  (item) => item.category === "Existing"
                )}
                bordered
                pagination={false}
                size="middle"
                scroll={{ x: "max-content", y: "1vh" }}
                rowClassName={(record) => {
                  if (record.stage === "Goal") {
                    return uplersStyle.heighliteRow;
                  }
                  if (record.stage === "Joining") {
                    return uplersStyle.heighliteGreen;
                  }
                  if (record.stage === "Selections/Closures") {
                    return uplersStyle.heighliteOrange;
                  }
                  if (record.stage === "Lost (Pipeline)") {
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

      <div className={uplersStyle.filterContainer} style={{ padding: "12px" }}>
        <div className={uplersStyle.customTableContainer}>
          {isTableLoading ? (
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
                Customer Growth
              </p>
              <Table
                columns={getColumns()}
                dataSource={dashboardData.filter(
                  (item) => item.category === "CF"
                )}
                bordered
                pagination={false}
                size="middle"
                scroll={{ x: "max-content", y: "1vh" }}
                rowClassName={(record) => {
                  if (record.stage === "Goal") {
                    return uplersStyle.heighliteRow;
                  }
                  if (record.stage === "Joining") {
                    return uplersStyle.heighliteGreen;
                  }
                  if (record.stage === "Selections/Closures") {
                    return uplersStyle.heighliteOrange;
                  }
                  if (record.stage === "Lost (Pipeline)") {
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

      <div className={uplersStyle.filterContainer} style={{ padding: "12px" }}>
        <div className={uplersStyle.customTableContainer}>
          {isTableLoading ? (
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
                Customer Health
              </p>
              <Table
                columns={getColumns()}
                dataSource={dashboardData.filter(
                  (item) => item.category === "CH"
                )}
                bordered
                pagination={false}
                size="middle"
                scroll={{ x: "max-content", y: "1vh" }}
                rowClassName={(record) => {
                  if (record.stage === "Goal") {
                    return uplersStyle.heighliteRow;
                  }
                  if (record.stage === "Joining") {
                    return uplersStyle.heighliteGreen;
                  }
                  if (record.stage === "Selections/Closures") {
                    return uplersStyle.heighliteOrange;
                  }
                  if (record.stage === "Lost (Pipeline)") {
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

      <div className={uplersStyle.filterContainer} style={{ padding: "12px" }}>
        <div className={uplersStyle.customTableContainer}>
          {isTableLoading ? (
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
                Delivery Funnel
              </p>
              <Table
                columns={getColumns()}
                dataSource={dashboardData.filter(
                  (item) => item.category === "DF"
                )}
                bordered
                pagination={false}
                size="middle"
                scroll={{ x: "max-content", y: "1vh" }}
                rowClassName={(record) => {
                  if (record.stage === "Goal") {
                    return uplersStyle.heighliteRow;
                  }
                  if (record.stage === "Joining") {
                    return uplersStyle.heighliteGreen;
                  }
                  if (record.stage === "Selections/Closures") {
                    return uplersStyle.heighliteOrange;
                  }
                  if (record.stage === "Lost (Pipeline)") {
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

  

 
    
    </>},
                ]}
                />


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
              <b>{showTalentCol?.stage}</b> <b> : {achievedTotal}</b>
            </h3>
          </div>

          {achievedLoading ? (
            <TableSkeleton />
          ) : listAchievedData.length > 0 ? (
            <>
              <div
                style={{
                  padding: "0 20px 20px 20px",
                  overflowX: "auto",
                  maxHeight: "500px",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 14,
                    textAlign: "left",
                  }}
                >
                  <thead
                    className={uplersStyle.overwriteTableColor}
                    style={{ position: "sticky", top: "0" }}
                  >
                    <tr style={{ backgroundColor: "#f0f0f0" }}>
                      <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          background: "rgb(233, 233, 233) !important",
                        }}
                      >
                        {showTalentCol?.stage === "New Clients"
                          ? "Created Date"
                          : "Company Created Date"}
                      </th>

                      {showTalentCol?.category !== "CF" &&
                        showTalentCol?.category !== "CH" && (
                          <th
                            style={{
                              padding: "10px",
                              border: "1px solid #ddd",
                              background: "rgb(233, 233, 233) !important",
                            }}
                          >
                            {showTalentCol?.stage === "Joining" ||
                            showTalentCol?.stage === "Selections/Closures"
                              ? showTalentCol?.stage
                              : "Action"}{" "}
                            Date
                          </th>
                        )}

                      <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          backgroundColor: "rgb(233, 233, 233) !important",
                        }}
                      >
                        Company
                      </th>
                      {showTalentCol?.category !== "CF" &&
                        (showTalentCol?.category === "CH" &&
                        showTalentCol?.stage !== "Customers with Active HRs"
                          ? false
                          : true) && (
                          <>
                            <th
                              style={{
                                padding: "10px",
                                border: "1px solid #ddd",
                                backgroundColor:
                                  "rgb(233, 233, 233) !important",
                              }}
                            >
                              HR Number
                            </th>
                            <th
                              style={{
                                padding: "10px",
                                border: "1px solid #ddd",
                                backgroundColor:
                                  "rgb(233, 233, 233) !important",
                              }}
                            >
                              HR Title
                            </th>
                             {showTalentCol?.stage === "Not Accepted HRs" &&   <th
                              style={{ 
                                padding: "10px",
                                border: "1px solid #ddd",
                                backgroundColor:
                                  "rgb(233, 233, 233) !important",
                              }}
                            >
                              Reason
                            </th>}
                            <th
                              style={{
                                padding: "10px",
                                border: "1px solid #ddd",
                                backgroundColor:
                                  "rgb(233, 233, 233) !important",
                              }}
                            >
                              TR
                            </th>
                            <th
                              style={{
                                padding: "10px",
                                border: "1px solid #ddd",
                                backgroundColor:
                                  "rgb(233, 233, 233) !important",
                              }}
                            >
                              {showTalentCol?.stage === "Joining" ||
                              showTalentCol?.stage === "Selections/Closures"
                                ? "Revenue"
                                : " 1TR Pipeline"}
                            </th>
                            {showTalentCol?.stage !== "Joining" &&
                              showTalentCol?.stage !==
                                "Selections/Closures" && (
                                <th
                                  style={{
                                    padding: "10px",
                                    border: "1px solid #ddd",
                                    backgroundColor:
                                      "rgb(233, 233, 233) !important",
                                  }}
                                >
                                  Total Pipeline
                                </th>
                              )}

                            <th
                              style={{
                                padding: "10px",
                                border: "1px solid #ddd",
                                backgroundColor:
                                  "rgb(233, 233, 233) !important",
                              }}
                            >
                              Uplers Fees %
                            </th>
                            <th
                              style={{
                                padding: "10px",
                                border: "1px solid #ddd",
                                backgroundColor:
                                  "rgb(233, 233, 233) !important",
                              }}
                            >
                              Talent Pay
                            </th>
                          </>
                        )}

                      <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          backgroundColor: "rgb(233, 233, 233) !important",
                        }}
                      >
                        Sales Person
                      </th>
                      {showTalentCol?.stage === "HRs (Carry Fwd)" && (
                        <th
                          style={{
                            padding: "10px",
                            border: "1px solid #ddd",
                            backgroundColor: "rgb(233, 233, 233) !important",
                          }}
                        >
                          Carry Fwd Status
                        </th>
                      )}

                      <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          backgroundColor: "rgb(233, 233, 233) !important",
                        }}
                      >
                        Client Business Type
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          backgroundColor: "rgb(233, 233, 233) !important",
                        }}
                      >
                        Lead Type
                      </th>

                      {showTalentCol?.category !== "CF" &&
                        (showTalentCol?.category === "CH" &&
                        showTalentCol?.stage !== "Customers with Active HRs"
                          ? false
                          : true) && (
                          <>
                          {showTalentCol?.stage !== "Not Accepted HRs" &&   <th
                              style={{
                                padding: "10px",
                                border: "1px solid #ddd",
                                backgroundColor:
                                  "rgb(233, 233, 233) !important",
                              }}
                            >
                             {showTalentCol?.stage === "Lost (Pipeline)" ? 'Reason': 'Talent'}
                            </th>}
                          
                            <th
                              style={{
                                padding: "10px",
                                border: "1px solid #ddd",
                                backgroundColor:
                                  "rgb(233, 233, 233) !important",
                              }}
                            >
                              HR Status
                            </th>
                          </>
                        )}
                    </tr>
                  </thead>

                  <tbody style={{ maxHeight: "500px" }}>
                    {listAchievedData.map((detail, index) => (
                      <tr
                        key={index}
                        style={{ borderBottom: "1px solid #ddd" }}
                      >
                        <td
                          style={{ padding: "8px", border: "1px solid #ddd" }}
                        >
                          {detail.hrCreatedDateStr}
                        </td>
                        {showTalentCol?.category !== "CF" &&
                          showTalentCol?.category !== "CH" && (
                            <td
                              style={{
                                padding: "8px",
                                border: "1px solid #ddd",
                              }}
                            >
                              {detail.actionDateStr}
                            </td>
                          )}

                        <td
                          style={{ padding: "8px", border: "1px solid #ddd" }}
                        >
                          <a
                            href={`/viewCompanyDetails/${detail.company_ID}`}
                            style={{ textDecoration: "underline" }}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {detail.company}{" "}
                          </a>
                          {detail.company_Category === "Diamond" && (
                            <img
                              src={Diamond}
                              alt="info"
                              style={{ width: "16px", height: "16px" }}
                            />
                          )}
                        </td>
                        {showTalentCol?.category !== "CF" &&
                          (showTalentCol?.category === "CH" &&
                          showTalentCol?.stage !== "Customers with Active HRs"
                            ? false
                            : true) && (
                            <>
                              <td
                                style={{
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                }}
                              >
                                {detail.hiringRequestID > 0 ? (
                                  <a
                                    href={`/allhiringrequest/${detail.hiringRequestID}`}
                                    style={{ textDecoration: "underline" }}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {detail.hR_Number}
                                  </a>
                                ) : (
                                  detail.hR_Number
                                )}
                              </td>
                              <td
                                style={{
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                }}
                              >
                                {detail.hrTitle}
                              </td>
                                 {showTalentCol?.stage === "Not Accepted HRs" &&    <td
                                style={{
                                   minWidth:'300px',
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                }}
                              >
                                {detail.talent}
                              </td>}
                              <td
                                style={{
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                }}
                              >
                                {detail.tr}
                              </td>
                              <td
                                style={{
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                }}
                              >
                                {detail.hrPipelineStr}
                              </td>
                              {showTalentCol?.stage !== "Joining" &&
                                showTalentCol?.stage !==
                                  "Selections/Closures" && (
                                  <td
                                    style={{
                                      padding: "8px",
                                      border: "1px solid #ddd",
                                    }}
                                  >
                                    {detail.total_HRPipelineStr}
                                  </td>
                                )}
                              <td
                                style={{
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                }}
                              >
                                {detail.uplersFeesPer}
                              </td>
                              <td
                                style={{
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                }}
                              >
                                {detail.talentPayStr}
                              </td>
                            </>
                          )}

                        <td
                          style={{ padding: "8px", border: "1px solid #ddd" }}
                        >
                          {detail.salesPerson}
                        </td>
                        {showTalentCol?.stage === "HRs (Carry Fwd)" && (
                          <td
                            style={{ padding: "8px", border: "1px solid #ddd" }}
                          >
                            {All_Hiring_Request_Utils.GETHRSTATUS(
                              Number(detail.carryFwd_HRStatusCode),
                              detail.carryFwd_HRStatus
                            )}
                          </td>
                        )}

                        <td
                          style={{ padding: "8px", border: "1px solid #ddd" }}
                        >
                          {detail.clientBusinessType}
                        </td>
                        <td
                          style={{ padding: "8px", border: "1px solid #ddd" }}
                        >
                          {detail.lead_Type}
                        </td>

                        {showTalentCol?.category !== "CF" &&
                          (showTalentCol?.category === "CH" &&
                          showTalentCol?.stage !== "Customers with Active HRs"
                            ? false
                            : true) && (
                            <>
                             {showTalentCol?.stage !== "Not Accepted HRs" &&      <td
                                style={{
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                  minWidth: showTalentCol?.stage === "Lost (Pipeline)" ? '250px': '',
                                  // whiteSpace: "normal",    // ✅ allow wrapping
                                  // wordBreak: "break-word",
                                }}
                              >
                                {detail.talent}
                              </td>}
                           
                              <td
                                style={{
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                }}
                              >
                                {All_Hiring_Request_Utils.GETHRSTATUS(
                                  Number(detail.hrStatusCode),
                                  detail.hrStatus
                                )}
                              </td>
                            </>
                          )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div
              style={{
                padding: "10px",
                display: "flex",
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: 500,
              }}
            >
              <p>No details available.</p>
            </div>
          )}

          <div style={{ padding: "10px", textAlign: "right" }}>
            <button
              className={uplersStyle.btnCancle}
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
    )
}
