import React, { useState, useEffect, Suspense } from "react";
import uplersStyle from "./uplersReport.module.css";
import {
  Table,
  Modal,
  Tooltip,
  Skeleton,
  Spin,Select,
  message
} from "antd";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import Diamond from "assets/svg/diamond.svg";
import { ReportDAO } from "core/report/reportDAO";
import moment from "moment";
import { All_Hiring_Request_Utils } from "shared/utils/all_hiring_request_util";
import { IoMdAddCircle } from "react-icons/io";
import { IconContext } from "react-icons";
import { HTTPStatusCode } from "constants/network";
import { useNavigate } from "react-router-dom";
import UTSRoutes from "constants/routes";
import { PiArrowsSplitBold } from "react-icons/pi";
import SplitHR from "modules/hiring request/screens/allHiringRequest/splitHR";
import { TaDashboardDAO } from "core/taDashboard/taDashboardDRO";
import DatePicker from "react-datepicker";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import { UserSessionManagementController } from "modules/user/services/user_session_services";
import { FilterFilled } from "@ant-design/icons";
import spinGif from "assets/gif/RefreshLoader.gif";
import Editor from "modules/hiring request/components/textEditor/editor";
import  Tiger from 'assets/tiger-face.png'
import  Panda from 'assets/panda-face.png'
import  Kitten  from 'assets/kitten-face.png'

const { Option } = Select;

export default function NegotiontoJoinee({
  impHooks
}) {
    const navigate = useNavigate()
    const {monthDate,hrModal,selectedHead,podName,isFreezeAllowed,freezeDate} = impHooks
    const [isLoading, setIsLoading] = useState(false);
    const [isTableLoading,setIsTableLoading] = useState(false)
    const [reportData, setReportData] = useState([]);
    const [summaryData,setSummaryData] = useState([])
    const [reportPtoNData, setReportPtoNData] = useState([]);
    const [isPlanningSummeryLoading, setIsPlanningSummeryLoading] = useState(false);
    const [planningSummaryData, setPlanningSummaryData] = useState([]);
    const [openSplitHR, setSplitHR] = useState(false);
    const [getHRnumber, setHRNumber] = useState({hrNumber:'', isHybrid:false});
    const [getHRID, setHRID] = useState("");
    const [isSplitLoading, setIsSplitLoading] = useState(false);
    const [groupList,setGroupList] = useState([{
    pod:'',amLead:'', amLeadAmount:'',am:'',amAmount:'',taLead:'',taLeadAmount:'',ta:'', taAmount:'' ,currency:''
    }])

    const [showResponse, setShowResponse] = useState(false);
    const [responseData, setResponseData] = useState({});
  const [round, setRound] = useState("Selection");
   const [roundDate, setRoundDate] = useState("");
   const [loadingResponse, setLoadingResponse] = useState(false);
   const [responseSubmit, setResponseSubmit] = useState(false);
    const [isModalLoading, setIsModalLoading] = useState(false);

      const [showTalentProfiles, setShowTalentProfiles] = useState(false);
      const [profileInfo, setInfoforProfile] = useState({});
      const [loadingTalentProfile, setLoadingTalentProfile] = useState(false);
const [hrTalentList, setHRTalentList] = useState([]);
const [hrTalentListFourCount, setHRTalentListFourCount] = useState([]);
const [filteredTalentList, setFilteredTalentList] = useState(hrTalentList);
 const [profileStatusID, setProfileStatusID] = useState(0);
 const [searchTerm, setSearchTerm] = useState("");

 const [achievedLoading, setAchievedLoading] = useState(false);
   const [showTalentCol, setShowTalentCol] = useState({});
   const [achievedTotal, setAchievedTotal] = useState("");
   const [DFListData, setDFListData] = useState([]);
   const [DFFilterListData, setDFFilterListData] = useState([]);
   const [showDFReport, setShowDFReport] = useState(false);

  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [showGoalComment, setShowGoalComment] = useState(false);
  const [allGoalCommentList, setALLGoalCommentsList] = useState([]);
  const [commentData, setCommentData] = useState({});

   const [summeryReportData, setSummeryReportData] = useState([]);
    const [summeryGroupsNames, setSummeryGroupsName] = useState([]);
     const [isSummeryLoading, setIsSummeryLoading] = useState(false);

  const [userData, setUserData] = useState({});

  useEffect(() => {
    const getUserResult = async () =>{
      let userData = UserSessionManagementController.getUserSession();
      if (userData) setUserData(userData);
    };
    getUserResult();
  }, []);
 
  const ProbabilityRatioArr = [
  "100%",
  "75%",
  "50%",
  "25%",
  "0%",
  // "Preonboarding",
  // "Lost",
  // "Won",
  // "Pause",
  // "Backed out"
];


       const getReportData = async () => {
 const pl = {
        hrmodel: hrModal,
        pod_id: selectedHead,
        month: moment(monthDate).format("M"),
        year: moment(monthDate).format("YYYY"),
      };
      setIsLoading(true)
        const result = await ReportDAO.getNegotiationReportDAO(pl);

 setIsLoading(false);

    if (result.statusCode === HTTPStatusCode.OK) {
      setReportData(
        result && result?.responseBody
      );
    } else {
      setReportData([]);
      return "NO DATA FOUND";
    }
       }

       const getAMSummary = async () => {
            const pl = {
        // hrmodel: hrModal,
        // pod_id: selectedHead,
        hr_BusinessType:'G',
        month: moment(monthDate).format("M"),
        year: moment(monthDate).format("YYYY"),
      };
       
           setIsSummeryLoading(true);
           const apiResult = await ReportDAO.getNegoPlanningSummeryReportDAO(pl);
           setIsSummeryLoading(false);
           if (apiResult?.statusCode === 200) {
             setSummeryReportData(apiResult.responseBody);
             let groups = [];
             apiResult.responseBody.forEach((element) => {
               if (!groups.includes(element.groupName)) {
                 groups.push(element.groupName);
               }
             });
             setSummeryGroupsName(groups);
           } else if (apiResult?.statusCode === 404) {
             setSummeryReportData([]);
           }
         };

       const getReportPtoNData = async () => {
 const pl = {
        hrmodel: hrModal,
        pod_id: selectedHead,
        month: moment(monthDate).format("M"),
        year: moment(monthDate).format("YYYY"),
      };
      setIsLoading(true)
        const result = await ReportDAO.getPtoNegotiationReportDAO(pl);

 setIsLoading(false);

    if (result.statusCode === HTTPStatusCode.OK) {
      setReportPtoNData(
        result && result?.responseBody
      );
    } else {
      setReportPtoNData([]);
      return "NO DATA FOUND";
    }
       }



  const getPlanningSummeryData = async () => {
 const pl = {
        hrmodel: hrModal,
        pod_id: selectedHead,
        month: moment(monthDate).format("M"),
        year: moment(monthDate).format("YYYY"),
      };
      setIsPlanningSummeryLoading(true)
        const result = await ReportDAO.getPlanningSummeryReportDAO(pl);

 setIsPlanningSummeryLoading(false);

    if (result.statusCode === HTTPStatusCode.OK) {
      setPlanningSummaryData(
        result && result?.responseBody
      );
    } else {
      setPlanningSummaryData([]);
      return "NO DATA FOUND";
    }
       }

    const getReportSummaryData = async () => {
 const pl = {
        hrmodel: hrModal,
        pod_id: selectedHead,
        month: moment(monthDate).format("M"),
        year: moment(monthDate).format("YYYY"),
      };
      setIsTableLoading(true)
        const result = await ReportDAO.getNegotiationReportSummaryDAO(pl);
       
 setIsTableLoading(false);

    if (result.statusCode === HTTPStatusCode.OK) {
      setSummaryData(
        result && result?.responseBody
      );
    } else {
      setSummaryData([]);
      return "NO DATA FOUND";
    }
       }

       useEffect(()=>{
        getReportData()
        getReportPtoNData()
        getReportSummaryData()
        getPlanningSummeryData()
     
        if(hrModal === 'Contract' && selectedHead === 5){
          getAMSummary()
        }
       },[monthDate,hrModal,selectedHead])

           const getPODList = async (getHRID) => {
                 setIsSplitLoading(true);
         let pl = {hrNo:getHRID,podid :0} 
                 let filterResult = await ReportDAO.getAllPODUsersGroupDAO(pl);
                 setIsSplitLoading(false); 
                 if (filterResult.statusCode === HTTPStatusCode.OK) {
                 //   console.log('filterResult',filterResult?.responseBody)
                   let modData = await modifyResponseforPOD(filterResult?.responseBody)
                   
                 //   let datawithList = await adduserListToEachPOD(modData)
                 //   console.log('set g list',modData,datawithList)
                  setGroupList(modData) 
                 } else if (filterResult?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
                   // setLoading(false); 
                   return navigate(UTSRoutes.LOGINROUTE);
                 } else if (
                   filterResult?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR
                 ) {
                   // setLoading(false);
                   return navigate(UTSRoutes.SOMETHINGWENTWRONG);
                 } else {
                     setGroupList([{
             pod:'',amLead:'', amLeadAmount:'',am:'',amAmount:'',taLead:'',taLeadAmount:'',ta:'', taAmount:'' ,currency:''
           }])
                   return "NO DATA FOUND";
                 }
               };
       
                const modifyResponseforPOD =async (data)=>{
                   let categories = []
                   let modData = []
               
                   data.forEach(item=>{
                       if(!categories.includes(item.category)){
                           categories.push(item.category)
                       }
                   })
               
                   categories.forEach( async cat=>{
                      let cats = data.filter(item=> item.category === cat)
                       let podObj = {
                           pod:'',amLead:'', amLeadAmount:'',am:'',amAmount:'',taLead:'',taLeadAmount:'',ta:'', taAmount:'' ,currency:''
                       }
           
                 podObj.pod = cats[0]?.poD_ID
                   podObj.currency = cats[0]?.currencyCode
                       cats.forEach(itm=>{
                           switch(itm.roW_Value){
                               case 'AM Lead':{
                                   podObj.amLead = (itm.userID !== 0) ? itm.userID : ''
                                   podObj.amLeadAmount = itm.revenue
                                   break
                               }
                               case 'AM':{
                                   podObj.am = (itm.userID !== 0 )? itm.userID : ''
                                   podObj.amAmount = itm.revenue
                                   break
                               }
                               case 'TA Lead':{
                                   podObj.taLead = (itm.userID !== 0 )? itm.userID : ''
                                   podObj.taLeadAmount = itm.revenue
                                   break
                               }
                               case 'TA':{
                                   podObj.ta = (itm.userID !== 0 )? itm.userID : ''
                                   podObj.taAmount = itm.revenue
                                   break
                               }
                               default : break
                           }
                       })
                       modData.push(podObj)
                      
                   })
               
                
                   return modData
                }

   const getDFDetails = async (row, v, week) => {
      try {
        setShowDFReport(true);
  
        const pl = {
          hrmodel: hrModal,
          pod_id: selectedHead,
          month: moment(monthDate).format("M"),
          year: moment(monthDate).format("YYYY"),
          stage_ID: row.stage_ID,
          weekno: week ? week : "",
          hr_businesstype:row.hR_Type,
          isNextMonth:row?.isNM === 'Yes'? row?.isNM : ''
        };
        setShowTalentCol(row);
        setAchievedTotal(v);
        setAchievedLoading(true);
        const result = await ReportDAO.getNegotiationPopupReportDAO(pl);
        setAchievedLoading(false);
        if (result.statusCode === 200) {
          setDFListData(result.responseBody);
          setDFFilterListData(result.responseBody);
        } else {
          setDFListData([]);
          setDFFilterListData([]);
        }
      } catch (err) {
        console.log(err);
        setDFListData([]);
        setDFFilterListData([]);
      }
    }

     const DFColumns = [
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
      width: "150px",
       render: (text, record) =>
        record?.companyCategory === "Diamond" ? (
          <>
            <span>{text}</span>
            &nbsp;
            <img
              src={Diamond}
              alt="info"
              style={{ width: "16px", height: "16px" }}
            />
          </>
        ) : (
          text
        ),
    },
    {
      title: "HR #",
      dataIndex: "hR_Number",
      key: "hR_Number",
      width: "170px",
      render: (text, value) => {
        return (
          <a
            href={`/allhiringrequest/${value.hiringRequestID}`}
            style={{ textDecoration: "underline" }}
            target="_blank"
            rel="noreferrer"
          >
            {text}
          </a>
        ); // Replace `/client/${text}` with the appropriate link you need
      },
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
      width: '200px',
    },
     {
      title: "Joining Date",
      dataIndex: "joiningdateStr",
      key: "joiningdateStr",
    },
    {
      title: "Talent",
      dataIndex: "talent",
      key: "talent",
    },
    {
      title: "Talent Status",
      dataIndex: "talentStatus",
      key: "talentStatus",
        width: '150px',
      render: (_, param) =>
        All_Hiring_Request_Utils.GETHRSTATUS(
          param?.hrStatusCode,
          param?.talentStatus
        ),
    },
 {
      title: <div style={{ textAlign: "center" }}> Billing %</div>,
      dataIndex: "uplersFeesPer",
      key: "uplersFeesPer",
       width: '100px',
      align: "center",
      className: uplersStyle.headerCell,
    },
        {
      title: (
        <div style={{ textAlign: "center" }}>
         Billing Value
        </div>
      ),
      dataIndex: hrModal === 'DP' ? 'uplersFees_INRStr' : "uplersFees_USDStr",
      key: hrModal === 'DP' ? 'uplersFees_INRStr' : "uplersFees_USDStr",
        width: '150px',
      align: "right",
      className: uplersStyle.headerCell,
    },
        {
      title: (
        <div style={{ textAlign: "center" }}>
         {podName} Revenue
        </div>
      ),
      dataIndex: "podValueStr",
      key: "podValueStr",
        width: '150px',
      align: "right",
      className: uplersStyle.headerCell,
      render:(v,row)=>{
        return <div style={{display:'flex',alignContent:'center',justifyContent:'space-between'}}>
           <Tooltip placement="bottom" title={"Split HR"}>
                <a href="javascript:void(0);" style={{display: 'inline-flex'}}>
                  <PiArrowsSplitBold
                    style={{ width: "17px", height: "17px", fill: '#232323' }}
                    onClick={() => {
                      setSplitHR(true);
                      setHRID(row?.hiringRequestID);
                      setHRNumber({hrNumber:row?.hR_Number});
                      getPODList(row?.hiringRequestID)
                    }}
                  />
                </a>
              </Tooltip>
    {  v ? v  : ''} </div>
      }
    },

     {
      title: <div style={{ textAlign: "center" }}>HR Modal</div>,
      dataIndex: "hR_Model",
      key: "hR_Model",

      className: uplersStyle.headerCell,
      width: "180px",
      align: "center",
    },

    // {
    //   title: "Status",
    //   dataIndex: "talentStatus",
    //   key: "talentStatus",
    //   render: (_, item) => (
    //     <div
    //       style={{
    //         display: "flex",
    //         alignItems: "center",
    //         justifyContent: "space-between",
    //       }}
    //     >
    //       {All_Hiring_Request_Utils.GETTALENTSTATUS(
    //         parseInt(item?.talentStatusColor),
    //         item?.talentStatus
    //       )}

    //       {(item?.statusID === 2 || item?.statusID === 3) && (
    //         <IconContext.Provider
    //           value={{
    //             color: "#FFDA30",
    //             style: { width: "16px", height: "16px", cursor: "pointer" },
    //           }}
    //         >
    //           <Tooltip title="Move to Assessment" placement="top">
    //             <span
    //               onClick={() => {
    //                 setMoveToAssessment(true);
    //                 setTalentToMove((prev) => ({ ...prev, ctpID: item.ctpid }));
    //               }}
    //               style={{ padding: "0" }}
    //             >
    //               {" "}
    //               <BsClipboard2CheckFill />
    //             </span>{" "}
    //           </Tooltip>
    //         </IconContext.Provider>
    //       )}

    //     </div>
    //   ),
    // },
  ];

 const reportColumns = [
    {
      title: <div>Company</div>,
      dataIndex: "company",
      key: "company",
      width: 150,
      fixed: "left",
      className: uplersStyle.headerCell,
      // render: (text, record) =>
      //   record?.companyCategory === "Diamond" ? (
      //     <>
      //       <span>{text}</span>
      //       &nbsp;
      //       <img
      //         src={Diamond}
      //         alt="info"
      //         style={{ width: "16px", height: "16px" }}
      //       />
      //     </>
      //   ) : (
      //     text
      //   ),
    },
    {
      title: <div style={{ textAlign: "center" }}>HR #</div>,
      dataIndex: "hR_Number",
      key: "hR_Number",
      width: 180,
      fixed: "left",
      className: uplersStyle.headerCell,
      render: (text, result) =>
        text ? (
          <a
            href={`/allhiringrequest/${result.hiringRequestID}`}
            style={{ textDecoration: "underline" }}
            target="_blank"
            rel="noreferrer"
          >
            {text}
          </a>
        ) : (
          text
        ),
    },
      {
      title: <div>Category</div>,
      dataIndex: "hR_Category",
      key: "hR_Category",
      width: 100,
      fixed: "left",
      className: uplersStyle.headerCell,
      render: (text, record) =><div style={{display:'flex', gap:'10px'}}>
        { record?.companyCategory === "Diamond" && (
          <>        
            &nbsp;
            <img
              src={Diamond}
              alt="info"
              style={{ width: "24px", height: "24px" }}
            />
          </>
        ) }

         {text === 'Cheetah' &&  <img src={Tiger} alt='tiger'  style={{width:'24px', height:'24px', marginRight:'10px'}} />} 
       {text === 'Panda' && <img src={Panda} alt='panda'  style={{width:'24px', height:'24px', marginRight:'10px'}} />}  
       {text === 'Kitten' && <img src={Kitten} alt='kitten' style={{width:'24px', height:'24px', marginRight:'10px'}} />}  
      
      </div>,
      filters:['Diamond + Cheetah','Diamond + Kitten','Diamond + Panda','Non Diamond + Cheetah','Non Diamond + Kitten','Non Diamond + Panda'].map(v=> ({ text: v, value: v,})),
            // onFilter: (value, record) => record.hR_Category.indexOf(value) === 0,
        onFilter:(value, record) =>  {
          const [diamondPart, categoryPart] = value.split(" + ");

          const isDiamond = record.companyCategory === "Diamond";
          const matchesDiamond =
            (diamondPart === "Diamond" && isDiamond) ||
            (diamondPart === "Non Diamond" && !isDiamond);

          const matchesCategory = record.hR_Category === categoryPart;

          return matchesDiamond && matchesCategory;
        },
             filterMultiple: true,
              filterIcon: (filtered) => (
      <FilterFilled
        style={{ color: filtered ? "#1890ff" : "black" }} 
      />)
       
    },
  
    {
      title: <div style={{ textAlign: "center" }}>Position</div>,
      dataIndex: "position",
      key: "position",
      fixed: "left",
      width: 180,
    },
        {
      title: (
        <div style={{ textAlign: "center" }}>
          Active
          <br />
          TRs
        </div>
      ),
      dataIndex: "noofTR",
      key: "noofTR",
      width: 100,
      align: "center",
      className: uplersStyle.headerCell,
    },
        {
      title: (
        <div style={{ textAlign: "center" }}>
          Open
          <br />
          TRs
        </div>
      ),
      dataIndex: "openTR",
      key: "openTR",
      width: 100,
      align: "center",
      className: uplersStyle.headerCell,
    },
        {
      title: (
        <div style={{ textAlign: "center" }}>
         HR Date
        </div>
      ),
      dataIndex: "hrCreatedDateStr",
      key: "hrCreatedDateStr",
      width: 150,
      align: "center",
      className: uplersStyle.headerCell,
    },
        {
      title: (
        <div style={{ textAlign: "center" }}>
          Negotiation
          <br />
          Start Date
        </div>
      ),
      dataIndex: "negotiationDateStr",
      key: "negotiationDateStr",
      width: 150,
      align: "center",
      className: uplersStyle.headerCell,
    },
        {
      title: (
        <div style={{ textAlign: "center" }}>
          Offer Signed
          <br />
          Date
        </div>
      ),
      dataIndex: "offerSignDateStr",
      key: "offerSignDateStr",
      width: 150,
      align: "center",
      className: uplersStyle.headerCell,
      render: (text) => {
        return text === '01/01/1900' ? "" : text;
      },
    },
        {
      title: (
        <div style={{ textAlign: "center" }}>
          No. of Days -
          <br />
          HR to Offer<br/>Signed
        </div>
      ),
      dataIndex: "negotiationSinceDays",
      key: "negotiationSinceDays",
      width: 100,
      align: "center",
      className: uplersStyle.headerCell,
    },
        {
      title: (
        <div style={{ textAlign: "center" }}>
         Joining Date
        </div>
      ),
      dataIndex: "joiningdateStr",
      key: "joiningdateStr",
      width: 150,
      align: "center",
      className: uplersStyle.headerCell,
        render: (text) => {
        return text === '01/01/1900' ? "" : text;
      },
    },
        {
      title: (
        <div style={{ textAlign: "center" }}>
         Notice period
        </div>
      ),
      dataIndex: "talentNoticePeriod",
      key: "talentNoticePeriod",
      width: 120,
      align: "center",
      className: uplersStyle.headerCell,
    },
           {
      title: <div style={{ textAlign: "center" }}> Talent Status</div>,
      dataIndex: "talentStatus",
      key: "talentStatus",

      className: uplersStyle.headerCell,
      width: "180px",
      align: "center",
      render: (_, param) =>
        All_Hiring_Request_Utils.GETHRSTATUS(
          param?.hrStatusCode,
          param?.talentStatus
        ),
    },
      {
      title: (
        <div style={{ textAlign: "center" }}>
         Talent
        </div>
      ),
      dataIndex: "talent",
      key: "talent",
      width: 120,
      align: "left",
      className: uplersStyle.headerCell,
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
         Salary of talent
        </div>
      ),
      dataIndex: "talentPayStr",
      key: "talentPayStr",
      width: 150,
      align: "right",
      className: uplersStyle.headerCell,
    },

   
    {
      title: <div style={{ textAlign: "center" }}> Billing %</div>,
      dataIndex: "uplersFeesPer",
      key: "uplersFeesPer",
      width: 120,
      align: "center",
      className: uplersStyle.headerCell,
    },
        {
      title: (
        <div style={{ textAlign: "center" }}>
         Billing Value
        </div>
      ),
      dataIndex: hrModal === 'DP' ? 'uplersFees_INRStr' : "uplersFees_USDStr",
      key: hrModal === 'DP' ? 'uplersFees_INRStr' : "uplersFees_USDStr",
      width: 120,
      align: "right",
      className: uplersStyle.headerCell,
    },

    {
      title: (
        <div style={{ textAlign: "center" }}>
         {podName} Revenue
        </div>
      ),
      dataIndex: "podValueStr",
      key: "podValueStr",
      width: 150,
      align: "right",
      className: uplersStyle.headerCell,
      render:(v,row)=>{
        return <div style={{display:'flex',alignContent:'center',justifyContent:'space-between'}}>
           <Tooltip placement="bottom" title={"Split HR"}>
                <a href="javascript:void(0);" style={{display: 'inline-flex'}}>
                  <PiArrowsSplitBold
                    style={{ width: "17px", height: "17px", fill: '#232323' }}
                    onClick={() => {
                      setSplitHR(true);
                      setHRID(row?.hiringRequestID);
                      setHRNumber({hrNumber:row?.hR_Number});
                      getPODList(row?.hiringRequestID)
                    }}
                  />
                </a>
              </Tooltip>
    {  v ? v  : ''} </div>
      }
    },
      {
      title: <div style={{ textAlign: "center" }}>Recruiter</div>,
      dataIndex: "recruiter",
      key: "recruiter",
      width: 150,
      // fixed: "left",
      className: uplersStyle.headerCell,
    },
      {
      title: <div style={{ textAlign: "center" }}>Sales Person</div>,
      dataIndex: "salesPerson",
      key: "salesPerson",
      width: 150,
      // fixed: "left",
      className: uplersStyle.headerCell,
    },
   
    {
      title: <div style={{ textAlign: "center" }}>HR Status</div>,
      dataIndex: "hrStatus",
      key: "hrStatus",

      className: uplersStyle.headerCell,
      width: "180px",
      align: "center",
      render: (_, param) =>
        All_Hiring_Request_Utils.GETHRSTATUS(
          param?.hrStatusCode,
          param?.hrStatus
        ),
    },
     {
      title: <div style={{ textAlign: "center" }}>HR Modal</div>,
      dataIndex: "hR_Model",
      key: "hR_Model",

      className: uplersStyle.headerCell,
      width: "180px",
      align: "center",
    },
  ];

   const getColumns = () => [
      {
        title: "Stages",
        dataIndex: "stage",
        key: "stage",
        //   fixed: "left",
        width: 200,
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
        title: <div style={{ textAlign: "center" }}>Goal till date</div>,
        dataIndex: "goalTillDateStr",
        key: "goalTillDateStr",
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
              // onClick={() => getHRTalentWiseReport(rec,  v)}
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
        render: (v, rec) => {
          return (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "end",
                  // flexDirection:'end'
                }}
              >
                {(rec.stage === "Joining" ||
                  rec.stage === "Companies CF" ||
                  rec.stage === "Total Customers assigned") && (
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
                    <Tooltip title={`Add/View comment`} placement="top">
                      <span
                        onClick={() => {
                          AddGoalComment(rec, "N");
                        }}
                        // className={taStyles.feedbackLabel}
                      >
                        {" "}
                        <IoMdAddCircle />
                      </span>{" "}
                    </Tooltip>
                  </IconContext.Provider>
                )}
  
                <div style={{ marginLeft: "auto" }}>
                  {v ? (
                    rec.stage === "Goal" || rec.stage.includes("%") ? (
                      v
                    ) : (
                      <span
                        onClick={() => {
                        getDFDetails(rec, v);
                        }}
                        style={{ cursor: "pointer", color: "#1890ff" }}
                      >
                        {v}
                      </span>
                    )
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </>
          );
        },
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
        render: (v, rec) => {
          return v ? (
            rec.stage === "Goal" || rec.stage.includes("%") ? (
              v
            ) : (
              <span
              // onClick={() => getHRTalentWiseReport(rec,  v)}
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
        title: <div style={{ textAlign: "center" }}>W1</div>,
        dataIndex: "w1Str",
        key: "w1Str",
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
                   getDFDetails(rec, v, "W1");
                 
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
      },
      {
        title: <div style={{ textAlign: "center" }}>W2</div>,
        dataIndex: "w2Str",
        key: "w2Str",
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
                 getDFDetails(rec, v, "W2");
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
      },
      {
        title: <div style={{ textAlign: "center" }}>W3</div>,
        dataIndex: "w3Str",
        key: "w3Str",
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
                 getDFDetails(rec, v, "W3");
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
      },
      {
        title: <div style={{ textAlign: "center" }}>W4</div>,
        dataIndex: "w4Str",
        key: "w4Str",
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
                getDFDetails(rec, v, "W4");
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
      },
      {
        title: <div style={{ textAlign: "center" }}>W5</div>,
        dataIndex: "w5Str",
        key: "w5Str",
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
                  getDFDetails(rec, v, "W5");
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
        render: (v, rec) => {
          return v ? (
            rec.stage === "Goal" || rec.stage.includes("%") ? (
              v
            ) : v
              // <span
              //   onClick={() => {
              //     if (rec.category === "DF") {
              //       // getDFDetails(rec, v, "W5");
              //     } else {
              //       // getHRTalentWiseReport(rec, v, "W5");
              //     }
              //   }}
              //   style={{ cursor: "pointer", color: "#1890ff" }}
              // >
                // {v}
              // </span> 
            
          ): (
            ""
          );
        },
      },
        {
        title: <div style={{ textAlign: "center" }}>Upcoming months</div>,
        dataIndex: "nextMonthStr",
        key: "nextMonthStr",
        width: 155,
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
                  getDFDetails({...rec,isNM:'Yes' }, v);
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
      },
  

    ];

      const renderDDSelect = (value, record, index, dataIndex, handleChange) => {
        return (
          <Select
            value={value}
            onChange={(newValue) =>
              handleChange(newValue, record, index, dataIndex)
            }
            style={{ width: "100%" }}
            size="small"
          >{ProbabilityRatioArr.map(
            val => <Option key={val} value={val}>{val}</Option>
          )}
            {/* <Option value="100%">100%</Option>
            <Option value="75%">75%</Option>
            <Option value="50%">50%</Option>
            <Option value="25%">25%</Option>
            <Option value="0%">0%</Option>
            <Option value="Preonboarding">Preonboarding</Option>
            <Option value="Lost">Lost</Option>
            <Option value="Won">Won</Option>
            <Option value="Pause">Pause</Option>
            <Option value="Backed out">Backed out</Option> */}
          </Select>
        );
      };
    
      const renderWeekSelect = (value, record, index, dataIndex, handleChange) => {
        return (
          <Select
            value={value}
            onChange={(newValue) =>
              handleChange(newValue, record, index, dataIndex)
            }
            style={{ width: "100%" }}
            size="small"
          >
            <Option value="W1">W1</Option>
            <Option value="W2">W2</Option>
            <Option value="W3">W3</Option>
            <Option value="W4">W4</Option>
            <Option value="W5">W5</Option>
          </Select>
        );
      };
    
      const renderYesNoSelect = (value, record, index, dataIndex, handleChange) => {
        return (
          <Select
            value={value}
            onChange={(newValue) =>
              handleChange(newValue, record, index, dataIndex)
            }
            style={{ width: "100%" }}
            size="small"
          >
            <Option value="Yes">Yes</Option>
            <Option value="No">No</Option>
          </Select>
        );
      };
    
      const handleFieldChange = (newValue, record, index, field) => {
        const updatedData = [...reportPtoNData];
        let indVal = updatedData.findIndex(item => (item.company === record.company && item.hiringRequestID === record.hiringRequestID))
        updatedData[indVal] = { ...record, [field]: newValue };
        setReportPtoNData(updatedData);
        // if (field === "productType" || field === "potentialType") {
        updatePotentialClosuresRowValue(updatedData[indVal]);
        // }
      };
    
      const updatePotentialClosuresRowValue = async (updatedData) => {
        const pl = {
          PotentialCloserList_ID: updatedData.potentialCloserList_ID ?? '',
          HRID: updatedData?.hiringRequest_ID,
          ProbabiltyRatio_thismonth: updatedData?.probabiltyRatio_thismonth ?? '',
          Expected_Closure_Week: updatedData?.expected_Closure_Week ?? '',
          Actual_Closure_Week: updatedData?.actual_Closure_Week ?? '',
          // Pushed_Closure_Week:updatedData?.pushed_Closure_Week,
          Talent_NoticePeriod: updatedData?.talent_NoticePeriod ?? '',
          Talent_Backup: updatedData?.talent_Backup ?? '',
          // OwnerID:updatedData?.owner_UserID
        };
        await ReportDAO.PotentialClosuresUpdateDAO(pl);
      };

      
  const AddResponse = (data) => {
    setShowResponse(true);
    setResponseData(data);
  };

   const getTalentProfilesDetailsfromTable = async (
      result,
      statusID,
      stageID
    ) => {
      setShowTalentProfiles(true);
      setInfoforProfile(result);
      let pl = {
        hrID: result?.hiringRequest_ID,
        statusID: statusID,
        stageID: statusID === 0 ? null : stageID ? stageID : 0,
      };
      setLoadingTalentProfile(true);
      const hrResult = await TaDashboardDAO.getHRTalentDetailsRequestDAO(pl);
      setLoadingTalentProfile(false);
  
      if (hrResult.statusCode === HTTPStatusCode.OK) {
        setHRTalentList(hrResult.responseBody);
        setFilteredTalentList(hrResult.responseBody);
        setHRTalentListFourCount(hrResult.responseBody);
      } else {
        setHRTalentList([]);
        setFilteredTalentList([]);
      }
    };

     const reportPtoNColumns = [
        {
          title: <div>Company</div>,
          dataIndex: "company",
          key: "company",
          width: 150,
          fixed: "left",
          className: uplersStyle.headerCell,
          // render: (text, record) =>
          //   record?.companyCategory === "Diamond" ? (
          //     <>
          //       <span>{text}</span>
          //       &nbsp;
          //       <img
          //         src={Diamond}
          //         alt="info"
          //         style={{ width: "16px", height: "16px" }}
          //       />
          //     </>
          //   ) : (
          //     text
          //   ),
        },
        {
          title: <div style={{ textAlign: "center" }}>HR #</div>,
          dataIndex: "hR_Number",
          key: "hR_Number",
          width: 180,
          fixed: "left",
          className: uplersStyle.headerCell,
          render: (text, result) =>
            text ? (
              <a
                href={`/allhiringrequest/${result.hiringRequest_ID}`}
                style={{ textDecoration: "underline" }}
                target="_blank"
                rel="noreferrer"
              >
                {text}
              </a>
            ) : (
              text
            ),
        },
              {
      title: <div>Category</div>,
      dataIndex: "hR_Category",
      key: "hR_Category",
      width: 100,
      fixed: "left",
      className: uplersStyle.headerCell,
      render: (text, record) =><div style={{display:'flex', gap:'10px'}}>
        { record?.companyCategory === "Diamond" && (
          <>        
            &nbsp;
            <img
              src={Diamond}
              alt="info"
              style={{ width: "24px", height: "24px" }}
            />
          </>
        ) }

         {text === 'Cheetah' &&  <img src={Tiger} alt='tiger'  style={{width:'24px', height:'24px', marginRight:'10px'}} />} 
       {text === 'Panda' && <img src={Panda} alt='panda'  style={{width:'24px', height:'24px', marginRight:'10px'}} />}  
       {text === 'Kitten' && <img src={Kitten} alt='kitten' style={{width:'24px', height:'24px', marginRight:'10px'}} />}  
    
      </div>,
        filters:['Diamond + Cheetah','Diamond + Kitten','Diamond + Panda','Non Diamond + Cheetah','Non Diamond + Kitten','Non Diamond + Panda'].map(v=> ({ text: v, value: v,})),
            // onFilter: (value, record) => record.hR_Category.indexOf(value) === 0,
        onFilter:(value, record) =>  {
          const [diamondPart, categoryPart] = value.split(" + ");

          const isDiamond = record.companyCategory === "Diamond";
          const matchesDiamond =
            (diamondPart === "Diamond" && isDiamond) ||
            (diamondPart === "Non Diamond" && !isDiamond);

          const matchesCategory = record.hR_Category === categoryPart;

          return matchesDiamond && matchesCategory;
        },
             filterMultiple: true,
              filterIcon: (filtered) => (
      <FilterFilled
        style={{ color: filtered ? "#1890ff" : "black" }} 
      />)
    },
        {
          title: <div style={{ textAlign: "center" }}>Position</div>,
          dataIndex: "position",
          key: "position",
          fixed: "left",
          width: 180,
        },
          {
          title: <div style={{ textAlign: "center" }}>Uplers Fees %</div>,
          dataIndex: "uplersFeesPer",
          key: "uplersFeesPer",
          width: 120,
          align: "center",
          className: uplersStyle.headerCell,
        },
        {
          title: (
            <div style={{ textAlign: "center" }}>
             1 TR Pipeline
            </div>
          ),
          dataIndex: "hrPipelineStr",
          key: "hrPipelineStr",
          width: 150,
          align: "right",
         
          className: uplersStyle.headerCell,
        },
              {
          title: (
            <div style={{ textAlign: "center" }}>
              Active
              <br />
              TRs
            </div>
          ),
          dataIndex: "noofTR",
          key: "noofTR",
          width: 100,
          align: "center",
          className: uplersStyle.headerCell,
        },
              {
          title: (
            <div style={{ textAlign: "center" }}>
          Total Pipeline
            </div>
          ),
          dataIndex: "total_HRPipelineStr",
          key: "total_HRPipelineStr",
          width: 150,
          align: "center",
          className: uplersStyle.headerCell,
        },
     {
          title: (
            <div style={{ textAlign: "center" }}>
              {podName}  Revenue           
            </div>
          ),
          dataIndex: "podValueStr",
          key: "podValueStr",
          width: 150,
          align: "right",
         
          className: uplersStyle.headerCell,
           render:(v,row)=>{
        return <div style={{display:'flex',alignContent:'center',justifyContent:'space-between'}}>
           <Tooltip placement="bottom" title={"Split HR"}>
                <a href="javascript:void(0);" style={{display: 'inline-flex'}}>
                  <PiArrowsSplitBold
                    style={{ width: "17px", height: "17px", fill: '#232323' }}
                    onClick={() => {
                      setSplitHR(true);
                      setHRID(row?.hiringRequestID);
                      setHRNumber({hrNumber:row?.hR_Number});
                      getPODList(row?.hiringRequestID)
                    }}
                  />
                </a>
              </Tooltip>
    {  v ? v  : ''} </div>
      }
        },

        {
          title: (
            <div style={{ textAlign: "center" }}>
              {/* Probability Ratio  */}
              Probability Ratio <br/> to move to <br/>Negotiation stage
            </div>
          ),
          dataIndex: "probabiltyRatio_thismonth",
          key: "probabiltyRatio_thismonth",
          width: 200,
          align: "center",
          render: (value, record, index) =>
            renderDDSelect(
              value,
              record,
              index,
              "probabiltyRatio_thismonth",
              handleFieldChange
            ),

            filters:ProbabilityRatioArr.map(v=> ({ text: v, value: v,})),
            onFilter: (value, record) => record.probabiltyRatio_thismonth.indexOf(value) === 0,
             filterMultiple: true,
              filterIcon: (filtered) => (
      <FilterFilled
        style={{ color: filtered ? "#1890ff" : "black" }} 
      />)
            // sorter: (a, b) => a.name.length - b.name.length,
        },
    
        {
          title: (
            <div style={{ textAlign: "center" }}>
              No Of <br />
              Interview <br/>Rounds
            </div>
          ),
          dataIndex: "noofInterviewRounds",
          key: "noofInterviewRounds",
          align: "center",
          width: 100,
          render: (text, result) => {
            return +text > 0 ? text : "";
          },
        },
          {
          title: (
            <div style={{ textAlign: "center" }}>
              No Of Active <br /> Profiles Till Date
            </div>
          ),
          dataIndex: "noOfProfile_TalentsTillDate",
          key: "noOfProfile_TalentsTillDate",
          width: 180,
          align: "center",
          render: (text, result) => {
            return +text > 0 ? (
              <p
                style={{
                  color: "blue",
                  fontWeight: "bold",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={() => {
                  getTalentProfilesDetailsfromTable(result, 0);
                //   setTalentToMove(result);
                  setProfileStatusID(0);
                  setHRTalentListFourCount([]);
                }}
              >
                {text}
              </p>
            ) : (
              ""
            );
          },
        },
        {
          title: (
            <div style={{ textAlign: "center" }}>
              Client Response <br />
              needed By
            </div>
          ),
          dataIndex: "clientResponseneededBy",
          key: "clientResponseneededBy",
          width: 180,
          render: (text, record, index) => {
            const commentsArr = text.length > 0 ? text.split("~") : [];
            return (
              <div>
                {commentsArr.length > 0 && (
                  <>
                    {" "}
                    <ul style={{ paddingLeft: "5px", marginBottom: 0 }}>
                      {commentsArr.map((comment) => (
                        <li dangerouslySetInnerHTML={{ __html: comment }}></li>
                      ))}
                    </ul>{" "}
                    <br />{" "}
                  </>
                )}
    {record?.isHRFreeze === 0 && 
    <IconContext.Provider
                  value={{
                    color: "green",
                    style: {
                      width: "20px",
                      height: "20px",
                      marginLeft: "5px",
                      cursor: "pointer",
                    },
                  }}
                >
                  {" "}
                  <Tooltip title={`Add Response`} placement="top">
                    <span
                      onClick={() => {
                        AddResponse({ ...record, index });
                      }}
                      // className={taStyles.feedbackLabel}
                    >
                      {" "}
                      <IoMdAddCircle />
                    </span>{" "}
                  </Tooltip>
                </IconContext.Provider>
               }
                
              </div>
            );
          },
        },
        {
          title: "W1",
          dataIndex: "w1",
          key: "w1",
          width: 120,
          align: "center",
          className: uplersStyle.headerCell,
           render: (value, record, index) =>{
            return (record?.w1_color === 'red' && value) ? <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center', gap:'5px'}}>
             <div style={{color:record?.w1_color}}>{value? value: '-'}</div> 
             <div >{record?.w1_Actual ? record?.w1_Actual :'-'}</div> 
            </div> : <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center', gap:'5px'}}>
             {value? value: '-'}
             <div style={{color:record?.w1_color}}>{record?.w1_Actual ? record?.w1_Actual: '-'}</div> 
            </div>
          }
        },
        {
          title: "W2",
          dataIndex: "w2",
          key: "w3",
          width: 120,
          align: "center",
          className: uplersStyle.headerCell,
          render: (value, record, index) =>{
            return (record?.w2_color === 'red' && value) ? <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center', gap:'5px'}}>
             <div style={{color:record?.w2_color}}>{value? value: '-'}</div> 
             <div >{record?.w2_Actual ? record?.w2_Actual :'-'}</div> 
            </div> : <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center', gap:'5px'}}>
             {value? value: '-'}
             <div style={{color:record?.w2_color}}>{record?.w2_Actual ? record?.w2_Actual :'-'}</div> 
            </div>
          }
        },
        {
          title: "W3",
          dataIndex: "w3",
          key: "w3",
          width: 120,
          align: "center",
          className: uplersStyle.headerCell,
           render: (value, record, index) =>{
            return (record?.w3_color === 'red' && value) ? <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center', gap:'5px'}}>
             <div style={{color:record?.w3_color}}>{value? value: '-'}</div> 
             <div >{record?.w3_Actual ? record?.w3_Actual :'-'}</div> 
            </div> : <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center', gap:'5px'}}>
              {value? value: '-'}
             <div style={{color:record?.w3_color}}>{record?.w3_Actual ? record?.w3_Actual :'-'}</div> 
            </div>
          }
        },
        {
          title: "W4",
          dataIndex: "w4",
          key: "w4",
          width: 120,
          align: "center",
          className: uplersStyle.headerCell,
           render: (value, record, index) =>{
            return (record?.w4_color === 'red' && value) ? <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center', gap:'5px'}}>
             <div style={{color:record?.w4_color}}>{value? value: '-'}</div> 
             <div >{record?.w4_Actual ? record?.w4_Actual :'-'}</div> 
            </div> : <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center', gap:'5px'}}>
              {value?? '-'}
             <div style={{color:record?.w4_color}}>{record?.w4_Actual ? record?.w4_Actual :'-'}</div> 
            </div>
          }
        },
        {
          title: "W5",
          dataIndex: "w5",
          key: "w5",
          width: 120,
          align: "center",
          className: uplersStyle.headerCell,
           render: (value, record, index) =>{
            return (record?.w5_color === 'red' && value) ? <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center', gap:'5px'}}>
             <div style={{color:record?.w5_color}}>{value? value: '-'}</div> 
             <div >{record?.w5_Actual ? record?.w5_Actual :'-'}</div> 
            </div> : <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center', gap:'5px'}}>
              {value?? '-'}
             <div style={{color:record?.w5_color}}>{record?.w5_Actual ? record?.w5_Actual :'-'}</div> 
            </div>
          }
        },
          {
          title: "Next Month",
          dataIndex: "nextMonthStr",
          key: "nextMonthStr",
          width: 120,
          align: "center",
          className: uplersStyle.headerCell,
        },
             {
          title: (
            <div style={{ textAlign: "center" }}>
              Possibility of <br/>
              joining <br/> this
              month             
            </div>
          ),
          dataIndex: "talent_Backup",
          key: "talent_Backup",
          width: 150,
          align: "center",       
          className: uplersStyle.headerCell,
           render: (value, record, index) =>
            renderYesNoSelect(
              value,
              record,
              index,
              "talent_Backup",
              handleFieldChange
            ),
              filters:[{ text: 'Yes', value: 'Yes'},{text:'No',value:'No'}],
            onFilter: (value, record) => record.talent_Backup.indexOf(value) === 0,
             filterMultiple: false,
              filterIcon: (filtered) => (
      <FilterFilled
        style={{ color: filtered ? "#1890ff" : "black" }} 
      />)
        },
        {
          title: <div>Comments</div>,
          dataIndex: "potentialList_Comments",
          key: "potentialList_Comments",
          width: 400,
          // align: "center",
          className: uplersStyle.headerCell,
          render: (text, record, index) => {
            const commentsArr = text.length > 0 ? text.split("~") : [];
            return (
              <div>
                {commentsArr.length > 0 && (
                  <>
                    {" "}
                    <ul style={{ paddingLeft: "5px", marginBottom: 0 }}>
                      {commentsArr.map((comment) => (
                        <li dangerouslySetInnerHTML={{ __html: comment }}></li>
                      ))}
                    </ul>{" "}
                    <br />{" "}
                  </>
                )}
    
                <IconContext.Provider
                  value={{
                    color: "green",
                    style: {
                      width: "20px",
                      height: "20px",
                      marginLeft: "5px",
                      cursor: "pointer",
                    },
                  }}
                >
                  {" "}
                  <Tooltip title={`Add/View comment`} placement="top">
                    <span
                      onClick={() => {
                        AddGoalComment({ ...record, index });
                      }}
                      // className={taStyles.feedbackLabel}
                    >
                      {" "}
                      <IoMdAddCircle />
                    </span>{" "}
                  </Tooltip>
                </IconContext.Provider>
              </div>
            );
          },
        },
  
      
        {
          title: <div style={{ textAlign: "center" }}>Sales Person</div>,
          dataIndex: "salesPerson",
          key: "salesPerson",
          width: 150,
          // fixed: "left",
          className: uplersStyle.headerCell,
        },
        {
          title: <div style={{ textAlign: "center" }}>CTP Link</div>,
          dataIndex: "ctP_Link",
          key: "ctP_Link",
          width: 120,
          render: (text, result) => {
            if (text === "" || text === "NA") {
              return "";
            }
            return (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <a
                  href={text}
                  style={{ textDecoration: "underline" }}
                  target="_blank"
                  rel="noreferrer"
                >
                  Link
                </a>
              </div>
            );
          },
        },
       
    
        {
          title: (
            <div style={{ textAlign: "center" }}>
              HR Modal
             
            </div>
          ),
          dataIndex:  'hR_Model',
          key:  'hR_Model',
          width: 150,
          align: "center",
          className: uplersStyle.headerCell,
          //  render: (value, record, index) =>
          //   renderInputField(
          //     value,
          //     record,
          //     index,
          //     "talent_NoticePeriod",
          //     handleFieldChange
          //   ),
        },
      
        {
          title: <div style={{ textAlign: "center" }}>HR Status</div>,
          dataIndex: "hrStatus",
          key: "hrStatus",
    
          className: uplersStyle.headerCell,
          width: "180px",
          align: "center",
          render: (_, param) =>
            All_Hiring_Request_Utils.GETHRSTATUS(
              param?.hrStatusCode,
              param?.hrStatus
            ),
        },
        {
          title: (
            <div>
              Open
              <br />
              since how <br /> many
              <br /> days
            </div>
          ),
          dataIndex: "hrOpenSinceDays",
          key: "hrOpenSinceDays",
    
          width: 90,
          align: "center",
          className: uplersStyle.headerCell,
        },
        {
          title: <div style={{ textAlign: "center" }}>Lead</div>,
          dataIndex: "leadType",
          key: "leadType",
          width: 100,
          align: "center",
          className: uplersStyle.headerCell,
        },
      ];

     const reportPlanningSummaryColumns = [
        {
          title: "",
          dataIndex: "stage",
          key: "stage",
          width: 150,
           align: "left",
          className: uplersStyle.headerCell,
          render:(val,row)=>{
            if(val === 'Total Planning'){
              return <div style={{display:'flex', flexDirection:'column',gap:'4px'}}>{val} {row?.total_AllweeksPlanning}</div>
            }
             if(val === 'Total Achieved'){
              return <div style={{display:'flex', flexDirection:'column',gap:'4px'}}>{val} {row?.total_AllweeksAchieved}</div>
            }
            return val
          }
        },
      
        {
          title: <div style={{textAlign:'center'}}>W1</div> ,
          dataIndex: "w1",
          key: "w1",
          // width: 120,
          align: "left",
          className: uplersStyle.headerCell,
           render: (value, record, index) =>{
            return <div dangerouslySetInnerHTML={{__html: value? value.replace(/\r\n/g,'<br/><br/>') : ''}}>
              {/* {value? value.replace(/\r\n/g,'<br/><br/>') : ''} */}
            </div>
          }
        },
        {
          title:  <div style={{textAlign:'center'}}>W2</div>,
          dataIndex: "w2",
          key: "w3",
          // width: 120,
          align: "left",
          className: uplersStyle.headerCell,
          render: (value, record, index) =>{
            return <div dangerouslySetInnerHTML={{__html: value? value.replace(/\r\n/g,'<br/><br/>') : ''}}>
              {/* {value? value.replace(/\r\n/g,'<br/><br/>') : ''} */}
            </div>
          }
        },
        {
          title: <div style={{textAlign:'center'}}>W3</div>,
          dataIndex: "w3",
          key: "w3",
          // width: 120,
         align: "left",
          className: uplersStyle.headerCell,
           render: (value, record, index) =>{
            return <div dangerouslySetInnerHTML={{__html: value? value.replace(/\r\n/g,'<br/><br/>') : ''}}>
              {/* {value? value.replace(/\r\n/g,'<br/><br/>') : ''} */}
            </div>
          }
        },
        {
          title: <div style={{textAlign:'center'}}>W4</div>,
          dataIndex: "w4",
          key: "w4",
          // width: 120,
           align: "left",
          className: uplersStyle.headerCell,
           render: (value, record, index) =>{
            return <div dangerouslySetInnerHTML={{__html: value? value.replace(/\r\n/g,'<br/><br/>') : ''}}>
              {/* {value? value.replace(/\r\n/g,'<br/><br/>') : ''} */}
            </div>
          }
        },
        {
          title: <div style={{textAlign:'center'}}>W5</div>,
          dataIndex: "w5",
          key: "w5",
          // width: 120,
          align: "left",
          className: uplersStyle.headerCell,
          render: (value, record, index) =>{
            return <div dangerouslySetInnerHTML={{__html: value? value.replace(/\r\n/g,'<br/><br/>') : ''}}>
              {/* {value? value.replace(/\r\n/g,'<br/><br/>') : ''} */}
            </div>
          }
        },
         
      ];

   

       const ProfileColumns = [
          {
            title: "Submission Date",
            dataIndex: "profileSubmittedDate",
            key: "profileSubmittedDate",
          },
          {
            title: "Talent",
            dataIndex: "talent",
            key: "talent",
          },
           {
            title: "Notice Period",
            dataIndex: "talentNoticePeriod",
            key: "talentNoticePeriod",
          },
          {
            title: "Status",
            dataIndex: "talentStatus",
            key: "talentStatus",
            render: (_, item) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {All_Hiring_Request_Utils.GETTALENTSTATUS(
                  parseInt(item?.talentStatusColor),
                  item?.talentStatus
                )}
      
                {(item?.statusID === 2 || item?.statusID === 3) && (
                  <IconContext.Provider
                    value={{
                      color: "#FFDA30",
                      style: { width: "16px", height: "16px", cursor: "pointer" },
                    }}
                  >
                    <Tooltip title="Move to Assessment" placement="top">
                      <span
                        // style={{
                        //   background: 'red'
                        // }}
                        onClick={() => {
                          // setMoveToAssessment(true);
                          // setTalentToMove((prev) => ({ ...prev, ctpID: item.ctpid }));
                        }}
                        style={{ padding: "0" }}
                      >
                        {" "}
                        {/* <BsClipboard2CheckFill /> */}
                      </span>{" "}
                    </Tooltip>
                  </IconContext.Provider>
                )}
              </div>
            ),
          },
          {
            title: "Interview Detail",
            dataIndex: "talentStatusDetail",
            key: "talentStatusDetail",
          },
          {
            title: "Submitted By",
            dataIndex: "profileSubmittedBy",
            key: "profileSubmittedBy",
          },
        ];
  

       const saveResponse = async () => {
          setResponseSubmit(true);
      
          if (round === "" || roundDate === "") {
            message.error(
              `Please Select ${round === "" ? "Round" : ""} ${
                round === "" && roundDate === "" ? "And" : ""
              } ${roundDate === "" ? "Date" : ""}`
            );
            return;
          }
          let PL = {
            HR_ID: responseData?.hiringRequest_ID,
            Interview_Round: round,
            Round_Date: moment(roundDate).format("YYYY-MM-DD"),
            Comments: "",
            LoggedInUserID: userData?.UserId,
          };
          setLoadingResponse(true);
          const result = await ReportDAO.insertPotentialClosureResponseRequestDAO(PL);
          setLoadingResponse(false);
      
          if (result.statusCode === 200) {
            let responces = result.responseBody.map((re) => re.round_Detail);
            setReportData((prev) => {
              let nArr = [...prev];
              nArr[responseData?.index] = {
                ...nArr[responseData?.index],
                clientResponseneededBy: responces.join("~"),
              };
              return nArr;
            });
            setShowResponse(false);
            setResponseData({});
            setRoundDate("");
            setRound("Selection");
            setResponseSubmit(false);
            getReportPtoNData()
          } else {
            message.error("something went wrong");
          }
        };

     const handleSearchInput = (value) => {
    setSearchTerm(value);
    const filteredData = hrTalentList.filter(
      (talent) =>
        talent.talent.toLowerCase().includes(value.toLowerCase()) ||
        (talent.email &&
          talent.email.toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredTalentList(filteredData);
  };

  const handleSummerySearchInput =(value) => {
    setSearchTerm(value);
    const filteredData = DFListData.filter(
      (talent) =>
        talent.talent.toLowerCase().includes(value.toLowerCase()) ||
        (talent.email &&
          talent.email.toLowerCase().includes(value.toLowerCase()))
    );
    setDFFilterListData(filteredData);
  };


    const getTalentProfilesDetails = async (result, statusID, stageID) => {
      setShowTalentProfiles(true);
      setInfoforProfile(result);
      let pl = {
        hrID: result?.hiringRequest_ID,
        statusID: statusID,
        stageID: statusID === 0 ? null : stageID ? stageID : 0,
      };
      setIsModalLoading(true);
      setLoadingTalentProfile(true);
      const hrResult = await TaDashboardDAO.getHRTalentDetailsRequestDAO(pl);
      setIsModalLoading(false);
      setLoadingTalentProfile(false);
      if (hrResult.statusCode === HTTPStatusCode.OK) {
        setHRTalentList(hrResult.responseBody);
        setFilteredTalentList(hrResult.responseBody);
      } else {
        setHRTalentList([]);
        setFilteredTalentList([]);
      }
    };
    
      const saveGoalComment = async (note) => {
        let pl = {       
          stage_ID: selectedHead,
          loggedInUserID: userData?.UserId,
          comments: note,
          PotentialCloserList_ID:commentData.potentialCloserList_ID,
          HR_ID:commentData.hiringRequestID 
        };
        setIsCommentLoading(true);
        const res = await TaDashboardDAO.insertGoalCommentsDAO(pl);
        setIsCommentLoading(false);
        if (res.statusCode === HTTPStatusCode.OK) {
          setALLGoalCommentsList(res.responseBody);
          let comments = res.responseBody.map((re) => re.comments);
          let indToUpdate = reportPtoNData.findIndex(item=> (item.potentialCloserList_ID == commentData.potentialCloserList_ID && item.hiringRequestID == commentData.hiringRequestID))
          setReportPtoNData((prev) => {
        let nArr = [...prev];
        nArr[indToUpdate] = {
          ...nArr[indToUpdate],
          potentialList_Comments: comments.slice(0, 5).join("~"),
        };
        return nArr;
      })
        }
      };

      const getAllGoalComments = async (d, modal) => {
    setIsCommentLoading(true);
    const pl = {
    potentialCloserListID:d.potentialCloserList_ID,
    hrID:d.hiringRequestID    };
    const result = await TaDashboardDAO.getALLGoalCommentsDAO(pl);
    setIsCommentLoading(false);
    if (result.statusCode === HTTPStatusCode.OK) {
      setALLGoalCommentsList(result.responseBody);
    } else {
      setALLGoalCommentsList([]);
    }
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



      const AddGoalComment = (data,modal) =>{
    getAllGoalComments(data, modal);
    setShowGoalComment(true);
    setCommentData({ ...data, hR_Model: modal });
  }

  const calculateTotal = (data,key)=>{
      if(data.length === 0){
        return ''
      }

      let currencySymbol = ''
          function detectCurrency(str) {
            // console.log('disC',key,str)
        const match = str.match(/[^\d,.\s]/); // find first non-numeric character
        return match ? match[0] : ""; 
      }

      // let d = data[0]
      // const currencySymbol = detectCurrency(d[key]) 
      const total = data.reduce((sum, item) => {
        if(item[key]){
          currencySymbol = detectCurrency(item[key])
        }
        
        const num = Number(item[key]?.replace(/[^0-9.-]+/g, "")); 
        return sum + num;
      }, 0);


      const formattedTotal = `${currencySymbol}${total.toLocaleString("en-IN")}`
      // console.log('total',key, currencySymbol , total , total.toLocaleString("en-IN"),formattedTotal )
      return total > 0 ? formattedTotal : '-'
  }

  function getMaxDate(currentDate = new Date()) {

    if(freezeDate !== null){
      return new Date(freezeDate);
    }
    const dayOfWeek = currentDate.getDay(); // 0 = Sunday, ..., 6 = Saturday


  if(dayOfWeek === 1){
      return currentDate;
  }
  // Calculate how many days until next week's Saturday
  const daysUntilNextSaturday = ((15 - dayOfWeek) % 7) ;

  const startDate = new Date(currentDate);
  startDate.setDate(currentDate.getDate() + daysUntilNextSaturday);

  return startDate;
}

  const gN = (name) => {
    switch (name) {
      case "1_AM_Recurring":
        return "Existing";
      case "1_NBD_Recurring":
        return "New";
      case "2_AM_DP":
        return "AM One Time";
      case "2_NBD_DP":
        return "NBD One Time";
      default:
        return "";
    }
  };

    const getSummeryDetails = async (val, col) => {
      let pl = {
        hr_BusinessType: "G",
        month: monthDate ? +moment(monthDate).format("M") : 0,
        year: monthDate ? +moment(monthDate).format("YYYY") : 0,
        groupName: val.groupName,
        am_ColumnName: col,
        stage_ID: val.stage_ID,
      };
      // setShowSummeryDetails(true);
      // setLoadingTalentProfile(true);
      // setSummertTitles({ ...val, col, amount: val[col] });
      // const res = await ReportDAO.getTAReportSummeryDetailsDAO(pl);
      // setLoadingTalentProfile(false);
      // if (res.statusCode === HTTPStatusCode.OK) {
      //   setSummeryDetails(res.responseBody);
      // } else {
      //   setSummeryDetails([]);
      // }
    };


  return (<>

     {hrModal !== 'DP' ? <>
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
               New - Negotiation to Joinee Summary
              </p>
              <Table
                columns={getColumns()}
                dataSource={summaryData.filter(item => item.hR_Type === 'New')}
                bordered
                pagination={false}
                size="middle"
                scroll={{ x: "max-content", y: "1vh" }}
                rowClassName={(record) => {
                  if (record.stage === "PROJECTION") {
                    return `${uplersStyle.heighliteRow} ${uplersStyle.boldText}`;
                  }
                   if (record.stage === "Target Pending" || record.stage === 'Negotiation Gap') {
                    return uplersStyle.boldText;
                  }
                  if (record.stage === "Joined" || record.stage === "Offer Signed" ) {
                    return uplersStyle.heighliteGreen;
                  }
                  if (record.stage === "Selections/Closures") {
                    return uplersStyle.heighliteOrange;
                  }
                  if (record.stage === "Dropouts" || record.stage === "Dropouts") {
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
                Existing- Negotiation to Joinee Summary
              </p>
              <Table
                columns={getColumns()}
                dataSource={summaryData.filter(item => item.hR_Type === 'Existing')}
                bordered
                pagination={false}
                size="middle"
                scroll={{ x: "max-content", y: "1vh" }}
                rowClassName={(record) => {
                  if (record.stage === "PROJECTION") {
                    return `${uplersStyle.heighliteRow} ${uplersStyle.boldText}`;
                  }
                   if (record.stage === "Target Pending" || record.stage === 'Negotiation Gap') {
                    return uplersStyle.boldText;
                  }
                  if (record.stage === "Joined" || record.stage === "Offer Signed" ) {
                    return uplersStyle.heighliteGreen;
                  }
                  if (record.stage === "Selections/Closures") {
                    return uplersStyle.heighliteOrange;
                  }
                  if (record.stage === "Dropouts" || record.stage === "Dropouts") {
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
     </> :  <div className={uplersStyle.filterContainer} style={{ padding: "12px" }}>
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
                Summary
              </p>
              <Table
                columns={getColumns()}
                dataSource={summaryData}
                bordered
                pagination={false}
                size="middle"
                scroll={{ x: "max-content", y: "1vh" }}
                rowClassName={(record) => {
                  if (record.stage === "PROJECTION") {
                    return `${uplersStyle.heighliteRow} ${uplersStyle.boldText}`;
                  }
                   if (record.stage === "Target Pending" || record.stage === 'Negotiation Gap') {
                    return uplersStyle.boldText;
                  }
                  if (record.stage === "Joined" || record.stage === "Offer Signed" ) {
                    return uplersStyle.heighliteGreen;
                  }
                  if (record.stage === "Selections/Closures") {
                    return uplersStyle.heighliteOrange;
                  }
                  if (record.stage === "Dropouts" || record.stage === "Dropouts") {
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
      </div>}

   


       {showResponse && (
              <Modal
                transitionName=""
                width="400px"
                centered
                footer={null}
                open={showResponse}
                className="engagementModalStyle"
                onCancel={() => {
                  setShowResponse(false);
                  setResponseData({});
                  setRoundDate("");
                  setRound("Selection");
                  setResponseSubmit(false);
                }}
              >
                <div style={{ padding: "35px 15px 10px 15px" }}>
                  <h3>Add Response</h3>
                </div>
                <h3 style={{ marginLeft: "10px" }}>{responseData?.position} </h3>
                <p style={{ marginLeft: "10px" }}>({responseData?.hR_Number})</p>
      
                {loadingResponse ? (
                  <Skeleton active />
                ) : (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "8px",
                        marginLeft: "10px",
                        marginRight: "10px",
                        marginBottom: "10px",
                      }}
                    >
                      <label>Select Round</label>
                      <Select
                        value={round}
                        onChange={
                          (newValue) => {
                            setRound(newValue);
                          }
                          // handleChange(newValue, record, index, dataIndex)
                        }
                        defaultValue="Selection"
                        style={{ width: "250px" }}
                        size="middle"
                        placeholder="Select Rounds"
                      >
                        <Option value="R1">R1</Option>
                        <Option value="R2">R2</Option>
                        <Option value="R3">R3</Option>
                        <Option value="R4">R4</Option>
                        <Option value="Selection">Selection</Option>
                      </Select>
                    </div>
      
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "8px",
                        marginLeft: "10px",
                        marginRight: "10px",
                      }}
                    >
                      <div>Date</div>
                      <div className={uplersStyle.calendarFilter}>
                        <CalenderSVG
                          style={{ height: "16px", marginRight: "16px" }}
                        />
                        <DatePicker
                          style={{ backgroundColor: "red" }}
                          onKeyDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          className={uplersStyle.dateFilter}
                          placeholderText="Select Date"
                          selected={roundDate}
                          onChange={(date) => setRoundDate(date)}
                          dateFormat="dd-MM-yyyy"
                          minDate={getMaxDate()}
                          // minDate={new Date()}
                          // showMonthYearPicker
                        />
                      </div>
                    </div>
                  </>
                )}
      
                <div style={{ padding: "10px" }}>
                  <button
                    className={uplersStyle.btn}
                    // disabled={isEditNewTask}
                    onClick={() => {
                      saveResponse();
                    }}
                    disabled={loadingResponse}
                  >
                    Save
                  </button>
                  <button
                    className={uplersStyle.btnCancle}
                    // disabled={isEditNewTask}
                    onClick={() => {
                      setShowResponse(false);
                      setResponseData({});
                      setRoundDate("");
                      setRound("Selection");
                      setResponseSubmit(false);
                    }}
                    disabled={loadingResponse}
                  >
                    Close
                  </button>
                </div>
              </Modal>
            )}

              {showTalentProfiles && (
                    <Modal
                      transitionName=""
                      width="1000px"
                      centered
                      footer={null}
                      open={showTalentProfiles}
                      // className={allEngagementStyles.engagementModalContainer}
                      className="engagementModalStyle"
                      // onOk={() => setVersantModal(false)}
                      onCancel={() => {
                        setSearchTerm("");
                        setShowTalentProfiles(false);
                        setHRTalentListFourCount([]);
                      }}
                    >
                      {isModalLoading ? (
                        <div
                          style={{
                            display: "flex",
                            height: "350px",
                            justifyContent: "center",
                          }}
                        >
                          <Spin size="large" />
                        </div>
                      ) : (
                        <>
                          <div
                            style={{
                              padding: "45px 15px 10px 15px",
                              display: "flex",
                              gap: "10px",
                              alignItems: "center",
                              flexWrap: "wrap",
                            }}
                          >
                            <h3>
                              Profiles for <strong>{profileInfo?.hR_Number}</strong>
                            </h3>
            
                            <p style={{ marginBottom: "0.5em" }}>
                              Company : <strong>{profileInfo?.company}</strong>{" "}
                              {profileInfo?.companyCategory === "Diamond" && (
                                <img
                                  src={Diamond}
                                  alt="info"
                                  style={{ width: "16px", height: "16px" }}
                                />
                              )}
                            </p>
            
                            <input
                              type="text"
                              placeholder="Search talent..."
                              value={searchTerm}
                              onChange={(e) => handleSearchInput(e.target.value)} // Create this function
                              style={{
                                padding: "6px 10px",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                marginLeft: "auto",
                                marginRight: "20px",
                                minWidth: "260px",
                              }}
                            />
                          </div>
            
                          <div
                            style={{
                              padding: "10px 15px",
                              display: "flex",
                              gap: "10px",
                              alignItems: "center",
                            }}
                          >
                            <div
                              className={uplersStyle.filterType}
                              key={"Total Talents"}
                              onClick={() => {
                                getTalentProfilesDetails(profileInfo, 0);
                                setProfileStatusID(0);
                              }}
                              style={{
                                borderBottom:
                                  profileStatusID === 0 ? "6px solid #FFDA30" : "",
                              }}
                            >
                              <h2>
                                Total Talents :{" "}
                                <span>
                                  {hrTalentListFourCount[0]?.totalTalents
                                    ? hrTalentListFourCount[0]?.totalTalents
                                    : 0}
                                </span>
                              </h2>
                            </div>
                            <div
                              className={uplersStyle.filterType}
                              key={"Profile shared"}
                              onClick={() => {
                                // console.log(profileInfo, "profileInfo");
                                getTalentProfilesDetails(profileInfo, 2);
                                setProfileStatusID(2);
                              }}
                              style={{
                                borderBottom:
                                  profileStatusID === 2 ? "6px solid #FFDA30" : "",
                              }}
                            >
                              <h2>
                                Profile shared :{" "}
                                <span>
                                  {hrTalentListFourCount[0]?.profileSharedCount
                                    ? hrTalentListFourCount[0]?.profileSharedCount
                                    : 0}
                                </span>
                              </h2>
                            </div>
                            <div
                              className={uplersStyle.filterType}
                              key={"In Assessment"}
                              onClick={() => {
                                getTalentProfilesDetails(profileInfo, 11);
                                setProfileStatusID(11);
                              }}
                              style={{
                                borderBottom:
                                  profileStatusID === 11 ? "6px solid #FFDA30" : "",
                              }}
                            >
                              <h2>
                                In Assessment :{" "}
                                <span>
                                  {hrTalentListFourCount[0]?.assessmentCount
                                    ? hrTalentListFourCount[0]?.assessmentCount
                                    : 0}
                                </span>
                              </h2>
                            </div>
                            <div
                              className={uplersStyle.filterType}
                              key={"In Interview"}
                              onClick={() => {
                                getTalentProfilesDetails(profileInfo, 3);
                                setProfileStatusID(3);
                              }}
                              style={{
                                borderBottom:
                                  profileStatusID === 3 ? "6px solid #FFDA30" : "",
                              }}
                            >
                              <h2>
                                In Interview :{" "}
                                <span>
                                  {hrTalentListFourCount[0]?.inInterviewCount
                                    ? hrTalentListFourCount[0]?.inInterviewCount
                                    : 0}
                                </span>
                              </h2>
                            </div>
                            <div
                              className={uplersStyle.filterType}
                              key={"Offered"}
                              onClick={() => {
                                getTalentProfilesDetails(profileInfo, 4);
                                setProfileStatusID(4);
                              }}
                              style={{
                                borderBottom:
                                  profileStatusID === 4 ? "6px solid #FFDA30" : "",
                              }}
                            >
                              <h2>
                                Offered :{" "}
                                <span>
                                  {hrTalentListFourCount[0]?.offeredCount
                                    ? hrTalentListFourCount[0]?.offeredCount
                                    : 0}
                                </span>
                              </h2>
                            </div>
                            <div
                              className={uplersStyle.filterType}
                              key={"Hired"}
                              onClick={() => {
                                getTalentProfilesDetails(profileInfo, 10);
                                setProfileStatusID(10);
                              }}
                              style={{
                                borderBottom:
                                  profileStatusID === 10 ? "6px solid #FFDA30" : "",
                              }}
                            >
                              <h2>
                                Hired :{" "}
                                <span>
                                  {hrTalentListFourCount[0]?.hiredCount
                                    ? hrTalentListFourCount[0]?.hiredCount
                                    : 0}
                                </span>
                              </h2>
                            </div>
                            <div
                              className={uplersStyle.filterType}
                              key={"Rejected, screening"}
                              onClick={() => {
                                getTalentProfilesDetails(profileInfo, 7, 1);
                                setProfileStatusID(71);
                              }}
                              style={{
                                borderBottom:
                                  profileStatusID === 71 ? "6px solid #FFDA30" : "",
                              }}
                            >
                              <h2>
                                Screen Reject :{" "}
                                <span>
                                  {hrTalentListFourCount[0]?.screeningRejectCount
                                    ? hrTalentListFourCount[0]?.screeningRejectCount
                                    : 0}
                                </span>
                              </h2>
                            </div>
                            <div
                              className={uplersStyle.filterType}
                              key={"Rejected, Interview"}
                              onClick={() => {
                                getTalentProfilesDetails(profileInfo, 7, 2);
                                setProfileStatusID(72);
                              }}
                              style={{
                                borderBottom:
                                  profileStatusID === 72 ? "6px solid #FFDA30" : "",
                              }}
                            >
                              <h2>
                                Interview Reject :{" "}
                                <span>
                                  {hrTalentListFourCount[0]?.interviewRejectCount
                                    ? hrTalentListFourCount[0]?.interviewRejectCount
                                    : 0}
                                </span>
                              </h2>
                            </div>
                          </div>
            
                          {loadingTalentProfile ? (
                            <div>
                              <Skeleton active />
                            </div>
                          ) : (
                            <div style={{ margin: "5px 10px" }}>
                              <Table
                                dataSource={filteredTalentList}
                                columns={ProfileColumns}
                                // bordered
                                pagination={false}
                              />
                            </div>
                          )}
            
                          {/* {moveToAssessment && (
                                          <Modal
                                            width="992px"
                                            centered
                                            footer={null}
                                            open={moveToAssessment}
                                            className="commonModalWrap"
                                            // onOk={() => setVersantModal(false)}
                                            onCancel={() => {
                                              setMoveToAssessment(false);
                                              resetRemarkField("remark");
                                              clearRemarkError("remark");
                                            }}
                                          >
                                            <MoveToAssessment
                                              onCancel={() => {
                                                setMoveToAssessment(false);
                                                resetRemarkField("remark");
                                                clearRemarkError("remark");
                                              }}
                                              register={remarkregiter}
                                              handleSubmit={remarkSubmit}
                                              resetField={resetRemarkField}
                                              errors={remarkError}
                                              saveRemark={saveRemark}
                                              saveRemarkLoading={saveRemarkLoading}
                                            />
                                          </Modal>
                                        )} */}
            
                          <div style={{ padding: "10px 0" }}>
                            <button
                              className={uplersStyle.btnCancle}
                              // disabled={isAddingNewTask}
                              onClick={() => {
                                setSearchTerm("");
                                setShowTalentProfiles(false);
                                setHRTalentListFourCount([]);
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      )}
                    </Modal>
                  )}


    {hrModal !== 'DP' ? <>
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
              New - Negotiation to Joinee Funnel
              </p>
               <Table
          scroll={{ x: "1600px", y: "100vh" }}
          id="amReportList"
          columns={reportColumns}
          bordered={false}
          dataSource={reportData.filter(item => item.businessType === 'New')}
          rowKey={(record, index) => index}
       
          pagination={false}
        />
        </>
       
      )}

     
        </div>
      </div>
       
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
              Existing - Negotiation to Joinee Funnel
              </p>
               <Table
          scroll={{ x: "1600px", y: "100vh" }}
          id="amReportList"
          columns={reportColumns}
          bordered={false}
          dataSource={reportData.filter(item => item.businessType === 'Existing')}
          rowKey={(record, index) => index}
       
          pagination={false}
        />
        </>
       
      )}


        </div>
      </div>
    </> :<div className={uplersStyle.filterContainer} style={{ padding: "12px" }}>
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
               Negotiation to Joinee Funnel
              </p>
               <Table
          scroll={{ x: "1600px", y: "100vh" }}
          id="amReportList"
          columns={reportColumns}
          bordered={false}
          dataSource={reportData}
          rowKey={(record, index) => index}
       
          pagination={false}
        />
        </>
       
      )}

      
        </div>
      </div>}
 <Modal
        width={"700px"}
        centered
        footer={false}
        open={openSplitHR}
        className="cloneHRConfWrap"
        onCancel={() => setSplitHR(false)}
        // zIndex={99999999}
      >
        <SplitHR
          onCancel={() => {setSplitHR(false);setHRID('')}}
          getHRID={getHRID}
          getHRnumber={getHRnumber.hrNumber}
          isHRHybrid={getHRnumber.isHybrid}
          companyID={getHRnumber.companyID}
          impHooks={{groupList,setGroupList,isSplitLoading, setIsSplitLoading}}
        />
      </Modal>


      
       <div className={uplersStyle.filterContainer} style={{ padding: "12px" }}>
        <div className={uplersStyle.customTableContainer}>
          {isPlanningSummeryLoading ? (
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
                Weekly Plan vs Progress
              </p>
              <Table
          scroll={{x:"1600px", y: "100vh" }}
          id="List"
          columns={reportPlanningSummaryColumns}
          bordered={false}
          dataSource={planningSummaryData}
          rowKey={(record, index) => index}
       
          pagination={false}
          rowClassName={(record) => {
            if (record.stage === "Total Planning") {
              return `${uplersStyle.heighliteRow} ${uplersStyle.boldText}`;
            }
        
            if (record.stage === "Total Achieved" ) {
              return `${uplersStyle.heighliteGreen} ${uplersStyle.boldText}`; 
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
               New - Goal Planning upto negotiation
              </p>
              <Table
          scroll={{ x: "1600px", y: "100vh" }}
          id="List"
          columns={reportPtoNColumns}
          bordered={false}
          dataSource={reportPtoNData?.filter(item=> item.businessType === 'New')}
          rowKey={(record, index) => index}
       
          pagination={false}
           summary={(values) => {     
            return (
               <Table.Summary fixed>
                 <Table.Summary.Row>
                  {reportPtoNColumns.map((item, index)=> {
                    if(item.dataIndex === "position"){
                      return  <Table.Summary.Cell index={index}>
                                              <div style={{textAlign:'end'}}>
                                                <strong>Total :</strong>
                                              </div>
                                            </Table.Summary.Cell>
                    }
                     else if(item.dataIndex === 'hrPipelineStr'){
                       return  <Table.Summary.Cell index={index}>
                                              <div style={{textAlign:'end'}}>
                                                <strong style={{fontSize:'12px'}}>{calculateTotal(values,'hrPipelineStr')}</strong>
                                              </div>
                                            </Table.Summary.Cell>
                    }
                     else if(item.dataIndex === 'total_HRPipelineStr'){
                       return  <Table.Summary.Cell index={index}>
                                              <div style={{textAlign:'end'}}>
                                                <strong style={{fontSize:'12px'}}>{calculateTotal(values,'total_HRPipelineStr')}</strong>
                                              </div>
                                            </Table.Summary.Cell>
                    }
                     else if(item.dataIndex === 'podValueStr'){
                       return  <Table.Summary.Cell index={index}>
                                              <div style={{textAlign:'end'}}>
                                                <strong style={{fontSize:'12px'}}>{calculateTotal(values,'podValueStr')}</strong>
                                              </div>
                                            </Table.Summary.Cell>
                    }
                    else if(item.dataIndex === 'w1'){
                       return  <Table.Summary.Cell index={index}>
                                              <div style={{textAlign:'end', display:'flex',flexDirection:'column'}}>
                                                <strong style={{fontSize:'12px'}}>{calculateTotal(values,'w1')}</strong>
                                                  <strong style={{fontSize:'12px', color:'#1890ff', marginTop:'5px'}}>{calculateTotal(values,'w1_Actual')}</strong>
                                              </div>
                                            </Table.Summary.Cell>
                    }
                    else if(item.dataIndex === 'w2'){
                       return  <Table.Summary.Cell index={index}>
                                              <div style={{textAlign:'end', display:'flex',flexDirection:'column'}}>
                                                <strong style={{fontSize:'12px'}}>{calculateTotal(values,'w2')}</strong>
                                                  <strong style={{fontSize:'12px', color:'#1890ff', marginTop:'5px'}}>{calculateTotal(values,'w2_Actual')}</strong>
                                              </div>
                                            </Table.Summary.Cell>
                    }
                    else if(item.dataIndex === 'w3'){
                       return  <Table.Summary.Cell index={index}>
                                              <div style={{textAlign:'end', display:'flex',flexDirection:'column'}}>
                                                <strong style={{fontSize:'12px'}}>{calculateTotal(values,'w3')}</strong>
                                                  <strong style={{fontSize:'12px', color:'#1890ff', marginTop:'5px'}}>{calculateTotal(values,'w3_Actual')}</strong>
                                              </div>
                                            </Table.Summary.Cell>
                    }
                    else if(item.dataIndex === 'w4'){
                       return  <Table.Summary.Cell index={index}>
                                              <div style={{textAlign:'end', display:'flex',flexDirection:'column'}}>
                                                <strong style={{fontSize:'12px'}}>{calculateTotal(values,'w4')}</strong>
                                                  <strong style={{fontSize:'12px', color:'#1890ff', marginTop:'5px'}}>{calculateTotal(values,'w4_Actual')}</strong>
                                              </div>
                                            </Table.Summary.Cell>
                    }
                    else if(item.dataIndex === 'w5'){
                       return  <Table.Summary.Cell index={index}>
                                              <div style={{textAlign:'end', display:'flex',flexDirection:'column'}}>
                                                <strong style={{fontSize:'12px'}}>{calculateTotal(values,'w5')}</strong>
                                                  <strong style={{fontSize:'12px', color:'#1890ff', marginTop:'5px'}}>{calculateTotal(values,'w5_Actual')}</strong>
                                              </div>
                                            </Table.Summary.Cell>
                    }
                    else if(item.dataIndex === 'nextMonthStr'){
                       return  <Table.Summary.Cell index={index}>
                                              <div style={{textAlign:'end'}}>
                                                <strong style={{fontSize:'12px'}}>{calculateTotal(values,'nextMonthStr')}</strong>
                                              </div>
                                            </Table.Summary.Cell>
                    }
                    else {
                         return  <Table.Summary.Cell index={index}>
                                              <div>
                                               
                                              </div>
                                            </Table.Summary.Cell>
                    }
                  })}
                 </Table.Summary.Row>
               </Table.Summary>
            )
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
                Existing - Goal Planning upto negotiation
              </p>
              <Table
          scroll={{ x: "1600px", y: "100vh" }}
          id="List"
          columns={reportPtoNColumns}
          bordered={false}
          dataSource={reportPtoNData?.filter(item=> item.businessType === "Existing")}
          rowKey={(record, index) => index}
       
          pagination={false}
             summary={(values) => {     
            return (
               <Table.Summary fixed>
                 <Table.Summary.Row>
                  {reportPtoNColumns.map((item, index)=> {
                    if(item.dataIndex === "position"){
                      return  <Table.Summary.Cell index={index}>
                                              <div style={{textAlign:'end'}}>
                                                <strong>Total :</strong>
                                              </div>
                                            </Table.Summary.Cell>
                    }
                     else if(item.dataIndex === 'hrPipelineStr'){
                       return  <Table.Summary.Cell index={index}>
                                              <div style={{textAlign:'end'}}>
                                                <strong style={{fontSize:'12px'}}>{calculateTotal(values,'hrPipelineStr')}</strong>
                                              </div>
                                            </Table.Summary.Cell>
                    }
                     else if(item.dataIndex === 'total_HRPipelineStr'){
                       return  <Table.Summary.Cell index={index}>
                                              <div style={{textAlign:'end'}}>
                                                <strong style={{fontSize:'12px'}}>{calculateTotal(values,'total_HRPipelineStr')}</strong>
                                              </div>
                                            </Table.Summary.Cell>
                    }
                     else if(item.dataIndex === 'podValueStr'){
                       return  <Table.Summary.Cell index={index}>
                                              <div style={{textAlign:'end'}}>
                                                <strong style={{fontSize:'12px'}}>{calculateTotal(values,'podValueStr')}</strong>
                                              </div>
                                            </Table.Summary.Cell>
                    }
                        else if(item.dataIndex === 'w1'){
                       return  <Table.Summary.Cell index={index}>
                                              <div style={{textAlign:'end', display:'flex',flexDirection:'column'}}>
                                                <strong style={{fontSize:'12px'}}>{calculateTotal(values,'w1')}</strong>
                                                  <strong style={{fontSize:'12px', color:'#1890ff', marginTop:'5px'}}>{calculateTotal(values,'w1_Actual')}</strong>
                                              </div>
                                            </Table.Summary.Cell>
                    }
                    else if(item.dataIndex === 'w2'){
                       return  <Table.Summary.Cell index={index}>
                                              <div style={{textAlign:'end', display:'flex',flexDirection:'column'}}>
                                                <strong style={{fontSize:'12px'}}>{calculateTotal(values,'w2')}</strong>
                                                  <strong style={{fontSize:'12px', color:'#1890ff', marginTop:'5px'}}>{calculateTotal(values,'w2_Actual')}</strong>
                                              </div>
                                            </Table.Summary.Cell>
                    }
                    else if(item.dataIndex === 'w3'){
                       return  <Table.Summary.Cell index={index}>
                                              <div style={{textAlign:'end', display:'flex',flexDirection:'column'}}>
                                                <strong style={{fontSize:'12px'}}>{calculateTotal(values,'w3')}</strong>
                                                  <strong style={{fontSize:'12px', color:'#1890ff', marginTop:'5px'}}>{calculateTotal(values,'w3_Actual')}</strong>
                                              </div>
                                            </Table.Summary.Cell>
                    }
                    else if(item.dataIndex === 'w4'){
                       return  <Table.Summary.Cell index={index}>
                                              <div style={{textAlign:'end', display:'flex',flexDirection:'column'}}>
                                                <strong style={{fontSize:'12px'}}>{calculateTotal(values,'w4')}</strong>
                                                  <strong style={{fontSize:'12px', color:'#1890ff', marginTop:'5px'}}>{calculateTotal(values,'w4_Actual')}</strong>
                                              </div>
                                            </Table.Summary.Cell>
                    }
                    else if(item.dataIndex === 'w5'){
                       return  <Table.Summary.Cell index={index}>
                                              <div style={{textAlign:'end', display:'flex',flexDirection:'column'}}>
                                                <strong style={{fontSize:'12px'}}>{calculateTotal(values,'w5')}</strong>
                                                  <strong style={{fontSize:'12px', color:'#1890ff', marginTop:'5px'}}>{calculateTotal(values,'w5_Actual')}</strong>
                                              </div>
                                            </Table.Summary.Cell>
                    }
                    else {
                         return  <Table.Summary.Cell index={index}>
                                              <div>
                                               
                                              </div>
                                            </Table.Summary.Cell>
                    }
                  })}
                 </Table.Summary.Row>
               </Table.Summary>
            )
           }}
        />
            </>
          )}
        </div>

         {showDFReport && (
                <Modal
                  transitionName=""
                  width="1050px"
                  centered
                  footer={null}
                  open={showDFReport}
                  className="engagementModalStyle"
                  onCancel={() => {
                    setSearchTerm("");
                    setShowDFReport(false);
                    setDFFilterListData([]);
                    setDFListData([]);
                  }}
                >
                  {false ? (
                    <div
                      style={{
                        display: "flex",
                        height: "350px",
                        justifyContent: "center",
                      }}
                    >
                      <Spin size="large" />
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          padding: "45px 15px 10px 15px",
                          display: "flex",
                          gap: "10px",
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <h3>
                          <b>{showTalentCol?.stage}</b> <b> : {achievedTotal}</b>
                        </h3>
                        {/* <p style={{ marginBottom: "0.5em" , marginLeft:'5px'}}>
                                          TA : <strong>add</strong>
                                        </p> */}
        
                        <input
                          type="text"
                          placeholder="Search talent..."
                          value={searchTerm}
                          onChange={(e) => handleSummerySearchInput(e.target.value)}
                          style={{
                            padding: "6px 10px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            marginLeft: "auto",
                            marginRight: "20px",
                            minWidth: "260px",
                          }}
                        />
                      </div>
        
                      {achievedLoading ? (
                        <div>
                          <Skeleton active />
                        </div>
                      ) : (
                        <div style={{ margin: "5px 10px" }}>
                          <Table
                            dataSource={DFFilterListData}
                            columns={DFColumns}
                            pagination={false}
                            scroll={{x: "1600px", y: "480px"}}
                          />
                        </div>
                      )}
        
                      {/* {moveToAssessment && (
                                        <Modal
                                          width="992px"
                                          centered
                                          footer={null}
                                          open={moveToAssessment}
                                          className="commonModalWrap"
                                          // onOk={() => setVersantModal(false)}
                                          onCancel={() => {
                                            setMoveToAssessment(false);
                                            resetRemarkField("remark");
                                            clearRemarkError("remark");
                                          }}
                                        >
                                          <MoveToAssessment
                                            onCancel={() => {
                                              setMoveToAssessment(false);
                                              resetRemarkField("remark");
                                              clearRemarkError("remark");
                                            }}
                                            register={remarkregiter}
                                            handleSubmit={remarkSubmit}
                                            resetField={resetRemarkField}
                                            errors={remarkError}
                                            saveRemark={saveRemark}
                                            saveRemarkLoading={saveRemarkLoading}
                                          />
                                        </Modal>
                                      )} */}
        
                      <div style={{ padding: "10px 0" }}>
                        <button
                          className={uplersStyle.btnCancle}
                          // disabled={isAddingNewTask}
                          onClick={() => {
                            setSearchTerm("");
                            setShowDFReport(false);
                            setDFFilterListData([]);
                            setDFListData([]);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  )}
                </Modal>
              )}

                       {showGoalComment && (
        <Modal
          transitionName=""
          width="1000px"
          centered
          footer={null}
          open={showGoalComment}
          className="engagementModalStyle"
          onCancel={() => {
            setShowGoalComment(false);
            setALLGoalCommentsList([]);
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
                saveNote={(note) => saveGoalComment(note)}
                isUsedForComment={true}
              />
            </div>
          </Suspense>

          {allGoalCommentList.length > 0 ? (
            <div style={{ padding: "12px 20px" }}>
              {isCommentLoading && (
                <div>
                  Adding Comment ...{" "}
                  <img src={spinGif} alt="loadgif" width={16} />{" "}
                </div>
              )}
              {!isCommentLoading && (
                <Table
                  dataSource={allGoalCommentList}
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
                setShowGoalComment(false);
                setALLGoalCommentsList([]);
                setCommentData({});
              }}
            >
              Close
            </button>
          </div>
        </Modal>
      )}
      </div>
        {(hrModal === 'Contract' && selectedHead === 5) &&  <div className={`${uplersStyle.filterContainer} ${uplersStyle.summeryContainer} `} style={{ padding: "12px" }}>
        <div className={uplersStyle.customTableContainer} style={{width:'100%'}}>
          <div style={{ display: "flex", gap: "10px" }}>
             {isSummeryLoading ? (
                <div
                  style={{
                    display: "flex",
                    height: "350px",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <Spin size="large" />
                </div>
              ) : (
                <>
                  {summeryGroupsNames.slice(0,2).reverse().map((gName) => {
                    let data = summeryReportData.filter(
                      (item) => item.groupName === gName
                    );
                    return (
                      <div className={uplersStyle.cardcontainer} style={{flexDirection:'column'}}>
                        <h3 className={uplersStyle.recruitername}>
                          {gN(gName)}
                        </h3>
                        <table
                          className={uplersStyle.stagetable}
                          style={{ width: "650px" }}
                        >
                          <thead>
                            <tr>
                              <th style={{ textAlign: "center" }}>Stage</th>
                              {/* <th style={{ textAlign: "center" }}>Sappy</th>
                              <th style={{ textAlign: "center" }}>Nikita</th> */}
                              <th style={{ textAlign: "center" }}>
                                Deepshikha
                              </th>
                              <th style={{ textAlign: "center" }}>Nandini</th>
                              <th style={{ textAlign: "center" }}>Gayatri</th>
                              <th style={{ textAlign: "center" }}>
                                Total (D+N+G)
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.map((val) => (
                              <tr
                                key={gName + val.stage}
                                //  className={getStageClass(stage.profileStatusID)}
                              >
                                <td>{val.stage}</td>
                                {/* <td style={{ textAlign: "end" }}>
                                  {val.stage_ID === 1 || val.stage_ID === 8 ? (
                                    val.sappy_str
                                  ) : (
                                    <p
                                      // style={{
                                      //   margin: 0,
                                      //   textDecoration: "underline",
                                      //   color: "blue",
                                      //   cursor: "pointer",
                                      // }}
                                      // onClick={() => {
                                      //   getSummeryDetails(val, "sappy_str");
                                      // }}
                                    >
                                      {val.sappy_str}
                                    </p>
                                  )}
                                </td>
                                <td style={{ textAlign: "end" }}>
                                  {val.stage_ID === 1 || val.stage_ID === 8 ? (
                                    val.nikita_str
                                  ) : (
                                    <p
                                      // style={{
                                      //   margin: 0,
                                      //   textDecoration: "underline",
                                      //   color: "blue",
                                      //   cursor: "pointer",
                                      // }}
                                      // onClick={() => {
                                      //   getSummeryDetails(val, "nikita_str");
                                      // }}
                                    >
                                      {val.nikita_str}
                                    </p>
                                  )}
                                </td> */}
                                <td style={{ textAlign: "end" }}>
                                 
                                      {val.deepshikha_str}
                                    
                                </td>
                                <td style={{ textAlign: "end" }}>
                                  
                                      {val.nandni_str}
                                  
                                </td>
                                <td style={{ textAlign: "end" }}>
                                      {val.gayatri_str}
                                   
                                </td>
                                <td style={{ textAlign: "end" }}>
                                  {val.total_str}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </>
              )}
          </div>
          </div>
          
          </div>}
  </>
     
  )
}
