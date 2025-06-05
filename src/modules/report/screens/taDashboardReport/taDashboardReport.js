import { Modal, Table, Typography } from "antd";
import styles from "./taDashboardReport.module.css";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import "react-datepicker/dist/react-datepicker.css";
import { UserSessionManagementController } from "modules/user/services/user_session_services";
import { HTTPStatusCode } from "constants/network";
import { TaDashboardDAO } from "core/taDashboard/taDashboardDRO";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import moment from "moment";
import { All_Hiring_Request_Utils } from "shared/utils/all_hiring_request_util";
import LogoLoader from "shared/components/loader/logoLoader";
const { Title, Text } = Typography;

const TADashboardReport = () => {

    const [monthDate, setMonthDate] = useState(new Date());
    const [userData, setUserData] = useState({});
    const [totalRevenueList, setTotalRevenueList] = useState([]);
    const [dailyActivityTargets, setDailyActiveTargets] = useState([]);
    const [summaryData, setSummaryData] = useState({});
    const [pipelineLoading, setpipelineLoading] = useState(false);
    const [modalLoader, setModalLoader] = useState(false);
    const [isShowDetails, setIsShowDetails] = useState({isBoolean:false,title:"",value:"",isTotal:false,TAName:""});
    const [allShowDetails, setAllShowDetails] = useState([]);
    
    const selectedYear = monthDate.getFullYear();
    const totalRevenueColumns = [
        {
          title: "TA",
          dataIndex: "taName",
          key: "taName",
          width: 120,          
          render: (text, result) => {        
            return text ? text : '-';
          },
        },
        {
          title: "Goal (INR)",
          dataIndex: "goalRevenueStr",
          key: "goalRevenueStr",
          width: 120,
          align: 'center',
          render: (text, result) => {              
            return text ? text : '-';
          },
        },
        {
          title: (
            <>
              Assigned <br />
              Pipeline (INR)
            </>
          ),
          dataIndex: "totalRevenuePerUserStr",
          key: "totalRevenuePerUserStr",
          align: 'center',
          width: 150,
           render: (text, result) => {                
            return text ? <div style={{cursor:"pointer"}} onClick={() => showDetails(0,result,"Assigned Pipeline (INR)",text)}>{text}</div> : '-';
          },
        },
        {
          title: (
            <>
              Carry Fwd <br />
              Pipeline (INR)
            </>
          ),
          dataIndex: "carryFwdPipelineStr",
          key: "carryFwdPipelineStr",
          width: 150,
          align: 'center',
          render: (text, result) => {        
            return <div className={styles.todayText} style={{ background: "#babaf5",cursor:"pointer"}} onClick={() => showDetails(7,result,"Carry Fwd Pipeline (INR)",text)}>{text}</div>;
          },
        },
        {
          title: (
            <>
              Current Month<br />
              Active 
              <br />Pipeline (INR)
            </>
          ),
          dataIndex: "currentMonthActualPipelineStr",
          key: "currentMonthActualPipelineStr",
          width: 150,
          align: 'center',
          render: (text, result) => {        
            return <div style={{cursor:"pointer"}} onClick={() => showDetails(1,result,"Current Month Active Pipeline (INR)",text)}>{text}</div>;
          },
        },
        {
          title: (
            <>
              Total Active<br />
              Pipeline (INR)
            </>
          ),
          dataIndex: "actualPipelineStr",
          key: "actualPipelineStr",
          width: 150,      
          align: 'center',
          render: (text, result) => {       
            return <div className={styles.today1Text} style={{cursor:"pointer"}}  
            onClick={() => showDetails(8,result,"Total Active Pipeline (INR)",text)}
            >{text}</div>;
          },
        },
        {
          title: "Multiplier",
          dataIndex: "bandwidthper",
          key: "bandwidthper",
          width: 80,
          align: 'center',
          render: (text, result) => {
            return text ? text : '-'
          },
        },
        {
          title: (
            <>
              Achieve <br />
              Pipeline (INR)
            </>
          ),
          dataIndex: "achievedPipelineStr",
          key: "achievedPipelineStr",
          width: 180,
          align: 'center',
          render: (text, result) => {        
            return <div className={styles.todayText} style={{cursor:"pointer"}} onClick={() => showDetails(3,result,"Achieve Pipeline (INR)",text)}>{text}</div>;
          },
        },
        {
          title: "Lost Pipeline (INR)",
          dataIndex: "lostPipelineStr",
          key: "lostPipelineStr",
          width: 160,
          align: 'center',
          render: (text, result) => {       
            return (
              <div
                className={styles.todayText}
                style={{ background: "lightsalmon" ,cursor:"pointer"}}
                onClick={() => showDetails(4,result,"Lost Pipeline (INR)",text)}
              >
                {text}
              </div>
            );
          },
        },
        {
          title: "Hold Pipeline (INR)",
          dataIndex: "holdPipelineStr",
          key: "holdPipelineStr",
          width: 150,
          align: 'center',
          render: (text, result) => {      
            return <div className={styles.todayText} style={{ background: "lightyellow",cursor:"pointer"}} onClick={() => showDetails(5,result,"Hold Pipeline (INR)",text)}>{text}</div>;
          },      
        },
        {
          title: (
            <>
              PreOnboarding <br />
              Pipeline (INR)
            </>
          ),
          dataIndex: "preOnboardingPipelineStr",
          key: "preOnboardingPipelineStr",
          width: 150,
          align: 'center',
          render: (text, result) => {      
            return <div className={styles.todayText} style={{ background: "lightpink",cursor:"pointer"}} onClick={() => showDetails(6,result,"PreOnboarding Pipeline (INR)",text)}>{text}</div>;
          },      
        }
    ]; 
    const daiyTargetColumns = [
        {
        title: (
            <>
            Carry Fwd <br />
            Pipeline (INR)
            </>
        ),
        dataIndex: "carryFwdPipeLineStr",
        key: "carryFwdPipeLineStr",
        align: 'center',
        render: (text) => {
            return <div style={{display:"flex",justifyContent:"center"}}><div className={styles.today1Text} style={{background:"#babaf5"}}>{text}</div></div>;
        },
        },
        {
              title: (
                <>
                  Carry Fwd Not <br />
                  Included Pipeline (INR)
                </>
              ),
              dataIndex: "carryFwdHoldPipelineStr",
              key: "carryFwdHoldPipelineStr",
              align: 'center',
              render: (text) => {
                return <div style={{display:"flex",justifyContent:"center"}}><div className={styles.today1Text} style={{background:"lightyellow"}}>{text}</div></div>;
              },
            },
        {
        title: (
            <>
            Added HR (New)
            </>
        ),
        dataIndex: "activeHRPipeLineStr",
        key: "activeHRPipeLineStr",
        align: 'center',
        render: (text) => {
                return <div style={{display:"flex",justifyContent:"center"}}><div className={styles.today1Text} style={{background:"#f0f0f0"}}>{text}</div></div>;
              },
        },  
        {
        title: (
            <>
            Achieve <br />
            Pipeline (INR)
            </>
        ),
        dataIndex: "achievedHRPipeLineStr",
        key: "achievedHRPipeLineStr",
        align: 'center',
        render: (text) => {
            return <div style={{display:"flex",justifyContent:"center"}}><div className={styles.todayText}>{text ? text : '-'}</div></div>;
        },
        },      
        {
        title: (
            <>
            Lost Pipeline (INR)
            </>
        ),
        dataIndex: "lostHRPipeLineStr",
        align: 'center',
        key: "lostHRPipeLineStr",
        render: (text) => {
            return <div style={{display:"flex",justifyContent:"center"}}><div className={styles.today2Text} style={{background:'lightsalmon'}}>{text}</div></div>;
        },
        },
        {
        title: (
            <>
            Total Active<br />
            Pipeline (INR)
            </>
        ),
        dataIndex: "totalActivePipeLineStr",
        key: "totalActivePipeLineStr",
        align: 'center',
        render: (text) => {
            return <div style={{display:"flex",justifyContent:"center"}}><div className={styles.today1Text}>{text}</div></div>;
        },
        }    
    ];

    useEffect(() => {  
        getUserResult();
        getTotalRevenue();
    }, [monthDate]);

    const getTotalRevenue = async () => {
    setpipelineLoading(true);
    const payload = {
          month: moment(monthDate).month() + 1,
          year: moment(monthDate).year(),
        };
    let result = await TaDashboardDAO.getTotalRevenueRequestDAO(payload);
    let dailyResult = await TaDashboardDAO.getDailyActiveTargetsDAO(payload);
    setpipelineLoading(false);
    if (result?.statusCode === HTTPStatusCode.OK) {
        if (result.responseBody.length) {
        const lastRow = {
          ...result.responseBody[result.responseBody.length - 1],
          bandwidthper: "",
          goalRevenueStr: "",
          taName: "",
          sumOfTotalRevenue: result.responseBody[0].sumOfTotalRevenue,
          sumOfTotalRevenueStr: result.responseBody[0].sumOfTotalRevenueStr,
          taUserID: result.responseBody[0].taUserID,
          totalRevenuePerUser: result.responseBody[0].totalRevenuePerUser,
          totalRevenuePerUserStr: result.responseBody[0].totalRevenuePerUserStr,
          TOTALROW: true,
        };       
        setSummaryData(lastRow);               
        setTotalRevenueList(result.responseBody);
        } else {
        setTotalRevenueList([]);
        }
    } else {
        setTotalRevenueList([]);
    }
    if (dailyResult?.statusCode === HTTPStatusCode.OK) {
        setDailyActiveTargets(dailyResult.responseBody);
    }
    };
    const getUserResult = async () => {
        let userData = UserSessionManagementController.getUserSession();
        if (userData) setUserData(userData);
    };
    const onMonthCalenderFilter = (date) => {
        setMonthDate(date);
    };
      const showDetails = async (pipeLineTypeId,data,title,value,isTotal) => {   
        setModalLoader(true);
        const month = moment(new Date()).format("MM");
        const year = moment(new Date()).format("YYYY");
        let pl = {
          pipelineTypeID:pipeLineTypeId,
          taUserID:data?.taUserID,
          month:Number(month),
          year:Number(year)
        }
        let result = await TaDashboardDAO.getTAWiseHRPipelineDetailsDAO(pl);
        setModalLoader(false);
        if(result?.statusCode === HTTPStatusCode.OK){         
          setIsShowDetails({
            isBoolean:true,
            title:title,
            value:value,
            isTotal:isTotal,
            TAName:data?.taName
          });
          setAllShowDetails(result?.responseBody);
        }
      }
    return (
        <div className={styles.snapshotContainer}>
            <div className={styles.filterContainer}>
                <div className={styles.filterSets}>
                <div className={styles.filterSetsInner}>
                    <Title level={3} style={{ margin: 0 }}>
                    {`${monthDate?.toLocaleString("default", { month: "long" })} ${selectedYear} - TA Dashboard`}
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
            <LogoLoader visible={modalLoader} />
            {pipelineLoading ? (
                    <TableSkeleton />
                ) : (
                    <>
                    <div>
                        {userData?.showTADashboardDropdowns && (
                            <div style={{ padding: "0 20px" }}>
                                <Table
                                    dataSource={dailyActivityTargets}
                                    columns={daiyTargetColumns}
                                    pagination={false}
                                />
                            </div>
                        )}
                    </div>

                    <div style={{ padding: "20px  20px" }}>          
                                    <Table
                                    dataSource={totalRevenueList}
                                    columns={totalRevenueColumns}
                                    pagination={false}
                                    scroll={{ x: "max-content", y: "1vh" }}
                                    summary={() => {
                                        return (
                                        <Table.Summary fixed>
                                            <Table.Summary.Row>
                                            <Table.Summary.Cell index={0}>
                                                <div>
                                                <strong>Total :</strong>
                                                </div>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={1}>
                                                <div style={{ textAlign: 'center' }}>
                                                <strong>{summaryData.total_GoalStr || '-'}</strong>
                                                </div>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={2}>
                                                <div style={{ textAlign: 'center', fontWeight: 'bold', cursor: 'pointer' }}
                                                onClick={() => showDetails(0, { taUserID: 2 }, "Assigned Pipeline (INR)", summaryData.sumOfTotalRevenueStr,true)}>
                                                {summaryData.sumOfTotalRevenueStr || '-'}
                                                </div>
                                            </Table.Summary.Cell>
                                           <Table.Summary.Cell index={3}>
                                                <div style={{ textAlign: 'center' , cursor: 'pointer'}}
                                                onClick={() => showDetails(7, { taUserID: 2 }, "Carry Fwd Pipeline (INR)", summaryData.total_CarryFwdPipelineStr,true)}>
                                                  <strong>{summaryData.total_CarryFwdPipelineStr || '-'}</strong>
                                                </div>
                                              </Table.Summary.Cell>
                                            <Table.Summary.Cell index={4}>
                                                <div style={{ textAlign: 'center', fontWeight: 'bold', cursor: 'pointer' }}
                                                onClick={() => showDetails(1, { taUserID: 2 }, "Current Month Actual Pipeline (INR)", summaryData.total_CurrentMonthActualPipelineStr,true)}>
                                                {summaryData.total_CurrentMonthActualPipelineStr || '-'}
                                                </div>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={5}>
                                              <div style={{ textAlign: 'center' , cursor: 'pointer' }}
                                                onClick={() => showDetails(8, { taUserID: 2 }, "Total Active Pipeline (INR)", summaryData.total_ActualPipelineStr,true)}> 
                                                <strong>{summaryData.total_ActualPipelineStr || '-'}</strong>
                                              </div>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={6}>
                                                <div style={{ textAlign: 'center' }}></div>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={7}>
                                                <div style={{ textAlign: 'center', fontWeight: 'bold', cursor: 'pointer' }}
                                                onClick={() => showDetails(3, { taUserID: 2 }, "Achieved Pipeline (INR)", summaryData.total_AchievedPipelineStr,true)}>
                                                {summaryData.total_AchievedPipelineStr || '-'}
                                                </div>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={8}>
                                                <div style={{ textAlign: 'center', fontWeight: 'bold', cursor: 'pointer' }}
                                                onClick={() => showDetails(4, { taUserID: 2 }, "Lost Pipeline (INR)",summaryData.total_LostPipelineStr,true)}>
                                                {summaryData.total_LostPipelineStr || '-'}
                                                </div>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={9}>
                                                <div style={{ textAlign: 'center', fontWeight: 'bold', cursor: 'pointer' }}
                                                onClick={() => showDetails(5, { taUserID: 2 }, "Hold Pipeline (INR)", summaryData.total_HoldPipelineStr,true)}>
                                                {summaryData.total_HoldPipelineStr || '-'}
                                                </div>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={10}>
                                                <div style={{ textAlign: 'center', fontWeight: 'bold', cursor: 'pointer' }}
                                                onClick={() => showDetails(6, { taUserID: 2 }, "Pre-Onboarding Pipeline (INR)", summaryData.total_PreOnboardingPipelineStr,true)}>
                                                {summaryData.total_PreOnboardingPipelineStr || '-'}
                                                </div>
                                            </Table.Summary.Cell>
                                            </Table.Summary.Row>
                                        </Table.Summary>
                                        );
                                    }}
                                    rowClassName={(record) => {                  
                                        if (record.orderSequence === 1) return styles.one;                  
                                        return '';
                                    }}
                                    />
                    </div>
                    </>
                )
                }

             {isShowDetails?.isBoolean && (
                    <Modal
                      width="1000px"
                      centered
                      footer={null}
                      open={isShowDetails?.isBoolean}
                      className="engagementModalStyle"
                      onCancel={() => {
                        setIsShowDetails({isBoolean:false,title:"",value:"",isTotal:false,TAName:""});
                        setAllShowDetails([]);
                      }}
                    >               
                    <div style={{ padding: "20px 15px" }}>
                      <h3><b>{(isShowDetails?.TAName && !isShowDetails?.isTotal) ? isShowDetails?.TAName + ' - ' : ''}{isShowDetails?.title} {isShowDetails?.value ? " - " + isShowDetails?.value : ''}</b></h3>
                    </div>
            
                    {allShowDetails.length > 0 ? (
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
            
                            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Action Date</th>
                              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Company Name</th>
                              <th style={{ padding: "10px", border: "1px solid #ddd" }}>HR Number</th>
                              <th style={{ padding: "10px", border: "1px solid #ddd" }}>HR Title</th>
                              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Pipeline</th>
                              <th style={{ padding: "10px", border: "1px solid #ddd" }}>HR Status</th>
                              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Sales Person</th>                  
                            </tr>
                          </thead>
            
                          <tbody>
                            {allShowDetails.map((detail, index) => (
                              <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{detail.actionDateStr}</td>
                                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{detail.companyName}</td>
                                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{detail.hrNumber}</td>
                                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{detail.hrTitle}</td>
                                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{detail.pipelineStr}</td>
                                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{All_Hiring_Request_Utils.GETHRSTATUS(Number(detail.hrStatusCode), detail.hrStatus)}</td>
                                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{detail.salesPerson}</td>                      
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div style={{ padding: "20px" }}>
                        <p>No details available.</p>
                      </div>
                    )}
            
                    <div style={{ padding: "10px", textAlign: "right" }}>
                      <button
                        className={styles.btnCancle}
                        onClick={() => {
                          setIsShowDetails({isBoolean:false,title:"",value:"",isTotal:false,TAName:""});
                          setAllShowDetails([]);
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

export default TADashboardReport;