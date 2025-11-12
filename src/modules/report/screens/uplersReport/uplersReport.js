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

export default function UplersReport() {
  const navigate = useNavigate();
  let data = localStorage.getItem('uplersReportValues')
    let parsedData = JSON.parse(data)
  const [selectedHead, setSelectedHead] = useState(parsedData?.selectedHead ?? '');
  const [pODList, setPODList] = useState([]);
  const [pODUsersList, setPODUsersList] = useState([]);
  const [podDashboardList, setPODDashboardList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);

  const [monthDate, setMonthDate] = useState(parsedData?.monthDate ? new Date(parsedData?.monthDate) : new Date());
  const selectedYear = monthDate.getFullYear();
  const [showComment, setShowComment] = useState(false);
  const [commentData, setCommentData] = useState({});
  const [allCommentList, setALLCommentsList] = useState([]);
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [dashboardTabTitle, setDashboardTabTitle] = useState(parsedData?.dashboardTabTitle ?? 'pod');
  const [isFreezeAllowed,setIsFreezeAllowed] = useState(true);
  const [freezeDate,setFreezeDate] = useState(null);
  const [showFreeze,setShowFreeze] = useState(false);

  const [reportData, setReportData] = useState([]);
  const [monthNames,setMonthNames] = useState({m1Name:'',m2Name:'',m3Name:''})
  const [QtabName,setQTabName] = useState('')

  const [userData, setUserData] = useState({});
  const [hrModal, setHRModal] = useState(parsedData?.hrModal ?? 'DP');
  const [summeryRevenueData,setSummeryRevenueData] = useState([])
  useEffect(() => {
    const getUserResult = async () => {
      let userData = UserSessionManagementController.getUserSession();
      if (userData) setUserData(userData);
    };
    getUserResult();
  }, []);


  useEffect(()=>{
    let presistValue = {
      hrModal, monthDate,selectedHead,dashboardTabTitle
    }
    localStorage.setItem('uplersReportValues',JSON.stringify(presistValue))
  },[hrModal,selectedHead,dashboardTabTitle,monthDate])

  // useEffect(()=>{
  //   let data = localStorage.getItem('uplersReportValues')
  //   if(data){
    
  //     console.log('pds',parsedData)
  //     setHRModal(parsedData?.hrModal ?? 'DP')
  //     setMonthDate(parsedData?.monthDate ? new Date(parsedData?.monthDate) : new Date())
  //     setSelectedHead(parsedData?.selectedHead ?? '')
  //     setDashboardTabTitle(parsedData?.dashboardTabTitle ?? 'pod')
  //   }
  
  // },[])


  useEffect(() => {
    // set modal to contract for stanley 
    if(userData?.EmployeeID ==="UP1831"){
      if(!parsedData?.selectedHead){
        setHRModal('Contract');
        let val = pODList.find(
                    (i) => i.dd_text === "Orion"
                  )?.dd_value;
                  setSelectedHead(val);
                  getGroupUsers(val);
      }    
    }
  
  }, [userData,pODList]);

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

         const getFreezeInfo = async()=>{
        let pl = {
           hrmodel: hrModal,
        pod_id: selectedHead,
        month: moment(monthDate).format("M"),
        year: moment(monthDate).format("YYYY"),
        isFreeze:null,
        currentDate:moment(monthDate).format("YYYY-MM-DD"),
        }
        const result = await ReportDAO.getFreezeSummeryReportDAO(pl);


        if(result.statusCode === HTTPStatusCode.OK){
          setIsFreezeAllowed(result?.responseBody[0]?.isFreeze )
         if(result?.responseBody[0]?.freezDate){
          setFreezeDate(result?.responseBody[0]?.freezDate)
         }else{
          setFreezeDate(null)
         } 
        }else{
          setIsFreezeAllowed(true)
          setFreezeDate(null)
        }

       }

          const saveFreezeInfo = async()=>{
        let pl = {
           hrmodel: hrModal,
        pod_id: selectedHead,
        month: moment(monthDate).format("M"),
        year: moment(monthDate).format("YYYY"),
        isFreeze:true,
        currentDate:moment(monthDate).format("YYYY-MM-DD"),
        }
        const result = await ReportDAO.getFreezeSummeryReportDAO(pl);

        setShowFreeze(false);
        if(result.statusCode === HTTPStatusCode.OK){
          setIsFreezeAllowed(result?.responseBody[0]?.isFreeze )
        }else{
          setIsFreezeAllowed(true)
        }

       }

         useEffect(()=>{
                 getFreezeInfo()
              },[monthDate,hrModal,selectedHead])

  const getPODRevenue  = async () => {
    setIsLoading(true);
 let pl = {
      month: moment(monthDate).format("MM"),
      year: selectedYear,
    };
    let filterResult = await ReportDAO.getAllPODRevenueDAO(pl);
    setIsLoading(false);
    if (filterResult.statusCode === HTTPStatusCode.OK) {
     setSummeryRevenueData(filterResult && filterResult?.responseBody);
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

  const getGroupUsers = async (ID) => {
    setIsLoading(true);

    let filterResult = await ReportDAO.getAllPODGroupUsersDAO(ID);
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

      const getQASummarytData = async () => {
         const pl = {
           pod_id: selectedHead,
           hrmodel: hrModal,
           month: moment(monthDate).format("M"),
           year: moment(monthDate).format("YYYY"),
         };
         setIsLoading(true);
         const result = await ReportDAO.getPODWiseQuarterlySummaryDAO(pl);
     
         setIsLoading(false);
     
         if (result.statusCode === HTTPStatusCode.OK) {
           setReportData(result && result?.responseBody);
           let mn = result?.responseBody[0]
           setMonthNames({m1Name:mn.m1Name,m2Name:mn.m2Name,m3Name:mn.m3Name})
           setQTabName(mn.qaurterName)
         } else {
           setReportData([]);
           return "NO DATA FOUND";
         }
       };
     
       useEffect(() => {
         getQASummarytData();
       }, [monthDate, hrModal]);

  const convertDataSource = (data) => {
    const list = [];

    data.forEach((item, index) => {
      switch (item.poD_ID) {
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
          });

          list.push({ key: `spacer1${index}`, stage: "", isSpacer: true });
          break;
        }
        default: {
          list.push({
            ...item,
            key: `row${index}`,
            stage: item.stage,
          });
        }
      }
    });

    return list;
  };

  const getDashboardList = async () => {
    let pl = {
      hrmodel: hrModal,
      pod_id: selectedHead,
      month: moment(monthDate).format("MM"),
      year: selectedYear,
    };
    setIsTableLoading(true);

    let filterResult = await ReportDAO.getAllPOCDashboardDAO(pl);
    setIsTableLoading(false);
    if (filterResult.statusCode === HTTPStatusCode.OK) {
      setPODDashboardList(
        filterResult && convertDataSource(filterResult?.responseBody)
      );
    } else {
      setPODDashboardList([]);
      return "NO DATA FOUND";
    }
  };

  useEffect(() => {
    if (selectedHead) {
      getDashboardList();
    }
  }, [selectedHead, monthDate, hrModal]);

  useEffect(() => {
    getHeads();

  }, []);
    useEffect(() => {

    getPODRevenue()
  }, [monthDate,selectedYear]);

  const saveComment = async (note) => {
    let pl = {
      hR_BusinessType: "Global",
      month: moment(monthDate).format("M"),
      year: moment(monthDate).format("YYYY"),
      userCategory: "POD",
      hR_Model: hrModal === "DP" ? "D" : "C",
      stage_ID: selectedHead,
      loggedInUserID: userData?.UserId,
      comments: note,
    };
    setIsCommentLoading(true);
    const res = await TaDashboardDAO.insertRecruiterCommentRequestDAO(pl);
    setIsCommentLoading(false);
    if (res.statusCode === HTTPStatusCode.OK) {
      setALLCommentsList(res.responseBody);
    }
  };

  const getAllComments = async (d, modal) => {
    setIsCommentLoading(true);
    const pl = {
      month: moment(monthDate).format("M"),
      year: moment(monthDate).format("YYYY"),
      userCategory: "POD",
      hR_Model: hrModal === "DP" ? "D" : "C",
      stage_ID: selectedHead,
      hR_BusinessType: "Global",
    };
    const result = await TaDashboardDAO.getALLRevenueCommentsDAO(pl);
    setIsCommentLoading(false);
    if (result.statusCode === HTTPStatusCode.OK) {
      setALLCommentsList(result.responseBody);
    } else {
      setALLCommentsList([]);
    }
  };

  const AddComment = (data, modal, index) => {
    getAllComments(data, modal);
    setShowComment(true);
    setCommentData({ ...data, hR_Model: modal });
  };

  const renderCell = (
    value,
    record,
    {
      align = "right",
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
    } else if (
      value === null ||
      value === undefined ||
      value === "" ||
      value === 0
    ) {
      content = isPotential || record.stage === "Churn" ? "" : "\u00A0";
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

    if (typeof content === "object" && content !== null) content = "";

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

  const commentColumn = [
    {
      title: "Created By",
      dataIndex: "createdByDatetime",
      key: "createdByDatetime",
      width: "200px",
    },
    {
      title: "Comment",
      dataIndex: "comments",
      key: "comments",
      render: (text) => {
        return <div dangerouslySetInnerHTML={{ __html: text }}></div>;
      },
    },
    { title: "Added By", dataIndex: "addedBy", key: "addedBy", width: "200px" },
  ];

  return (
    <div className={uplersStyle.hiringRequestContainer}>
      <div className={uplersStyle.filterContainer}>
        <div className={uplersStyle.filterSets}>
          <div className={uplersStyle.filterSetsInner}>
            <Title level={3} style={{ margin: 0 }}>
              {`${monthDate?.toLocaleString("default", {
                month: "long",
              })} ${selectedYear}`}
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
              <Radio value={"Contract"}>Contract</Radio>
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
        <div style={{ display: "flex" , margin:'10px 24px', gap:'10px'}}>
           <div
                    className={uplersStyle.filterType}
                    key={"Total FTE"}
                     style={{
                      borderBottom:"6px solid #FFDA30"
                          
                    }}
                  >
                    <img src={FeedBack} alt="rocket" />
                    <h2>
                      FTE Total :{" "}
                      <span>
                        {summeryRevenueData[0]?.ftE_Total_Str
                          ? summeryRevenueData[0]?.ftE_Total_Str
                          : 0}
                      </span>
                    </h2>
                     <Tooltip
                                            placement="bottomLeft"
                                            title={                                            
                                                <ul style={{margin:'10px 10px 10px 0', width:'300px', padding:'0'}}>
                                                  <li>NASA Total:  <strong style={{marginLeft:'10px'}}>{summeryRevenueData[0]?.nasa_Total_Str
                          ? summeryRevenueData[0]?.nasa_Total_Str
                          : 0}</strong> </li>
                                                  <li>Shunya Total: <strong style={{marginLeft:'10px'}}> {summeryRevenueData[0]?.shunya_Total_Str
                          ? summeryRevenueData[0]?.shunya_Total_Str
                          : 0}</strong>  </li>
                                                  <li>Meteoroid Total:  <strong style={{marginLeft:'10px'}}>{summeryRevenueData[0]?.meteoroiD_Total_Str
                          ? summeryRevenueData[0]?.meteoroiD_Total_Str
                          : 0} </strong> </li>
                                                </ul>
                                             
                                            }
                                          >
                                            <div className={uplersStyle.summaryTooltip}>!</div>
                                          </Tooltip>
                  </div>

                   <div
                    className={uplersStyle.filterType}
                    key={"Contract total"}
                    style={{
                      borderBottom:"6px solid #FFDA30"
                          
                    }}
                  >
                  <img src={Handshake} alt="handshaker" />
                    <h2>
                     Contract Total :{" "}
                      <span>
                        {summeryRevenueData[0]?.contract_Total_Str
                          ? summeryRevenueData[0]?.contract_Total_Str
                          : 0}
                      </span>
                    </h2>
                  </div>

                  <button className={uplersStyle.FreezeButton} disabled={isFreezeAllowed} onClick={()=>setShowFreeze(true)}> Freeze</button>
        </div>
        <div style={{ display: "flex" }}>
          <div className={uplersStyle.chipCardContainer}>
            {isLoading ? (
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <Spin />
              </div>
            ) : (
              pODUsersList?.map((item, index) => {
                if (item.leadtype === "leaduser") {
                  return (
                    <div className={uplersStyle.chipCard}>
                      <Avatar size={"small"}>
                        {item.dd_text[0].toUpperCase()}
                      </Avatar>{" "}
                      <strong>{item.dd_text}</strong>{" "}
                    </div>
                  );
                } else {
                  return (
                    <div className={uplersStyle.chipCard}>
                      <Avatar size={"small"}>
                        {item.dd_text[0].toUpperCase()}
                      </Avatar>{" "}
                      {item.dd_text}
                    </div>
                  );
                }
              })
            )}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              height: "60px",
            }}
          >
            <IconContext.Provider
              value={{
                color: "green",
                style: {
                  width: "20px",
                  height: "20px",
                  marginRight: "auto",
                  cursor: "pointer",
                },
              }}
            >
              {" "}
              <Tooltip title={`All Comments`} placement="top">
                <span
                  onClick={() => {
                    AddComment();
                  }}
                  // className={taStyles.feedbackLabel}
                >
                  {" "}
                  <IoChatboxEllipses />
                </span>{" "}
              </Tooltip>
            </IconContext.Provider>

            <Card
              size="small"
              style={{
                width: "240px",
                height: "50px",
                marginRight: "10px",
                marginBottom: "10px",
              }}
            >
              <Text>
                No. of working days:{" "}
                <strong>{podDashboardList[0]?.workingDaysTillNow}</strong>
              </Text>
            </Card>
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
            key: "pod",
            children:  <PodReports
        impHooks={{
          isTableLoading,
          podDashboardList,
          AddComment,
          monthDate,
          hrModal,
          selectedHead,
        }}
      />},
                {
            label: "Goal to Negotiation Funnel",
            key: "Goal to Negotiation Funnel",
            children:  <NegotiontoJoinee
             impHooks={{
          isTableLoading,
          podDashboardList,
          monthDate,
          hrModal,
          selectedHead,
          isFreezeAllowed,
          freezeDate,
          podName:pODList?.find(item=> item.dd_value === selectedHead)?.dd_text
          }} 
        />},
        hrModal === "DP" && {
            label: "All FTE Negotiation Summary",
            key: "All FTE Negotiation Summary",
            children:  <FTENegotiationSummary
             impHooks={{
          isTableLoading,
          podDashboardList,
          monthDate,
          hrModal,
          selectedHead,
          podName:pODList?.find(item=> item.dd_value === selectedHead)?.dd_text
          }} 
        />},
        {
            label: QtabName,
            key: QtabName,
            children:  <QASummary
             impHooks={{
          isTableLoading,
          podDashboardList,
          monthDate,
          hrModal,
          selectedHead,monthNames,setMonthNames ,QtabName,setQTabName,reportData,
          podName:pODList?.find(item=> item.dd_value === selectedHead)?.dd_text
          }} 
        />}
         ]}
        />

     

      {showComment && (
        <Modal
          transitionName=""
          width="1000px"
          centered
          footer={null}
          open={showComment}
          className="engagementModalStyle"
          onCancel={() => {
            setShowComment(false);
            setALLCommentsList([]);
            setCommentData({});
          }}
        >
          <div style={{ padding: "35px 15px 10px 15px" }}>
            <h3>Add Comment</h3>
          </div>
          <Suspense>
            <div
              style={{
                position: "relative",
                marginBottom: "10px",
                padding: "0 20px",
                paddingRight: "30px",
              }}
            >
              <Editor
                hrID={""}
                saveNote={(note) => saveComment(note)}
                isUsedForComment={true}
              />
            </div>
          </Suspense>

          {allCommentList.length > 0 ? (
            <div style={{ padding: "12px 20px" }}>
              {isCommentLoading && (
                <div>
                  Adding Comment ...{" "}
                  <img src={spinGif} alt="loadgif" width={16} />{" "}
                </div>
              )}
              {!isCommentLoading && (
                <Table
                  dataSource={allCommentList}
                  columns={commentColumn}
                  pagination={false}
                />
              )}
              {/* <ul>
                                        {allCommentList.map((item) => (
                                          <li
                                            key={item.comments}
                                           
                                          >
                                            <div style={{display:'flex',justifyContent:'space-between'}}>
                                              <strong>{item.addedBy}</strong><p>{item.createdByDatetime}</p>
                                            </div>
                                            <div  dangerouslySetInnerHTML={{ __html: item.comments }}></div>
                                          </li>
                                        ))}
                                      </ul> */}
            </div>
          ) : (
            <h3 style={{ marginBottom: "10px", padding: "0 20px" }}>
              {isCommentLoading ? (
                <div>
                  Loading Comments...{" "}
                  <img src={spinGif} alt="loadgif" width={16} />{" "}
                </div>
              ) : (
                "No Comments yet"
              )}
            </h3>
          )}
          <div style={{ padding: "10px" }}>
            <button
              className={uplersStyle.btnCancle}
              // disabled={isEditNewTask}
              onClick={() => {
                setShowComment(false);
                setALLCommentsList([]);
                setCommentData({});
              }}
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {showFreeze && (
        <Modal
          transitionName=""
          width="500px"
          centered
          footer={null}
          open={showFreeze}
          className="engagementModalStyle"
          onCancel={() => {
           
            setShowFreeze(false);
          }}
        >
          <div style={{ padding: "35px 15px 10px 15px" }}>
            <h3>Are you sure you what to freeze the data ?</h3>
          </div>
         

        
          <div style={{ padding: "10px" }}>
             <button
              className={uplersStyle.btn}
              // disabled={isEditNewTask}
              onClick={() => {
               saveFreezeInfo()
              }}
            >
              Yes
            </button>
            <button
              className={uplersStyle.btnCancle}
              // disabled={isEditNewTask}
              onClick={() => {
                setShowFreeze(false);
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
