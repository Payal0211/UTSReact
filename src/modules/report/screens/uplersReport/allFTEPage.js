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
    console.log(selectedMonths, monthList)
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

        </div>
    )
}
