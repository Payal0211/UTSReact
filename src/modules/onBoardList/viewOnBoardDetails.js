import React, { useEffect, useState, useMemo, useCallback,useRef } from "react";
import AddNewClientStyle from "../../modules/client/screens/addnewClient/add_new_client.module.css";
import { useParams, useNavigate, Link ,useLocation} from "react-router-dom";
import { HTTPStatusCode, NetworkInfo } from "constants/network";
import {
  Avatar,
  Tabs,
  Table,
  Skeleton,
  Checkbox,
  message,
  Modal,
  Select,
  Tooltip,
} from "antd";

import { engagementRequestDAO } from "core/engagement/engagementDAO";
import EngagementOnboard from "modules/engagement/screens/engagementOnboard/engagementOnboard";
import EngagementFeedback from "modules/engagement/screens/engagementFeedback/engagementFeedback";
import { allEngagementConfig } from "modules/engagement/screens/engagementList/allEngagementConfig";
import { engagementUtils } from "modules/engagement/screens/engagementList/engagementUtils";
import { useForm } from "react-hook-form";
import EngagementAddFeedback from "modules/engagement/screens/engagementAddFeedback/engagementAddFeedback";
import UTSRoutes from "constants/routes";
import { FaDownload } from "react-icons/fa";
import { MdOutlineVerified } from "react-icons/md";
import { IoIosRemoveCircle } from "react-icons/io";
import { IconContext } from "react-icons";
import { RiFolderReceivedFill } from "react-icons/ri";
import { GrEdit } from "react-icons/gr";
import AddTalentDocuments from "modules/engagement/screens/engagementAddFeedback/addTalentDocuments";
import { amDashboardDAO } from "core/amdashboard/amDashboardDAO";
import AddLeaveModal from "modules/engagement/screens/engagementAddFeedback/addLeave";
import moment from "moment";
import infoSmallIcon from "assets/svg/infoSmallIcon.svg";
import MyCalendar from "modules/engagement/screens/engagementAddFeedback/calendarComp";
import { UserSessionManagementController } from "modules/user/services/user_session_services";
import RejectLeaveModal from "modules/engagement/screens/engagementAddFeedback/rejectLeave";
import ApproveLeaveModal from "modules/engagement/screens/engagementAddFeedback/approveLeave";
import { ReactComponent as TickMark } from "assets/svg/assignCurrect.svg";
import OnboardNotes from "./onboardNotes";
import EmailComponent from "./emailComponent";

export default function ViewOnBoardDetails() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("OnBoard Details");
  const { state } = useLocation()
  const { onboardID , isOngoing} = useParams();
  const [isLoading, setLoading] = useState(false);
  const [isLeaveLoading,setLeaveLoading] = useState(false);
  const [getOnboardFormDetails, setOnboardFormDetails] = useState({});
  const [allBRPRlist, setAllBRPRList] = useState([]);
  const [otherDetailsList,setOtherDetailsList] = useState([]);
  const [getFeedbackFormContent, setFeedbackFormContent] = useState({});
    const [feedbackCategory,setFeedbackCategory] = useState([])
  const [feedBackSave, setFeedbackSave] = useState(false);
  const [feedBackTypeEdit, setFeedbackTypeEdit] = useState('Please select');
  const [documentsList,setDocumentsList] = useState([]);
  const [leaveList,setLeaveList] = useState([]);
  const [docTypeList,setDocTypeList] = useState([]);
  const [editLeaveData, setEditLeaveData] = useState({})
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [calenderCurrentYear, setcalenderCurrentYear] = useState(new Date().getFullYear());
  const [calenderCurrentMonth, setcalenderCurrentMonth] = useState(new Date().getMonth());
  const [totalLeaveBalance, setTotalLeaveBalance] = useState(0)
  const [totalLeave, setTotalLeave] = useState(0)
  const [holidayLeave, setHolidayLeave] = useState(0)
  const calendarRef = useRef(null);
  const [leaveTypes,setLeaveTypes] = useState([]);
  const {register,handleSubmit,setValue,control,setError,getValues,watch,reset,resetField,formState: { errors }} = useForm();
  const [userData, setUserData] = useState({});
  const [getHRAndEngagementId, setHRAndEngagementId] = useState({
    hrNumber: '',
    engagementID: '',
    talentName: '',
    onBoardId: '',
    hrId: '',
  });
  const [getFeedbackPagination, setFeedbackPagination] = useState({
    totalRecords: 0,
    pageIndex: 1,
    pageSize: 10,
  });
  const [feedBackData, setFeedBackData] = useState({
    totalRecords: 10,
    pagenumber: 1,
    onBoardId: '',
  });
  const [rejectLeaveData,setRejectLeaveData] = useState({})
  const [approveLeaveData,setApproveLeaveData] = useState({})
  const [calEvents,setCalEvents] = useState([])
  const [getEngagementModal, setEngagementModal] = useState({
    engagementFeedback: false,
    engagementAddFeedback: false,
    addDocumentModal:false,
    addLeaveModal:false,
    rejectLeaveModal:false,
    approveLeaveModal:false,
  });
  const [getClientFeedbackList, setClientFeedbackList] = useState([]);

  useEffect(() => {    
    getUserResult();    
  }, []); 

  useState(()=>{
    if(state?.tabToActive){
      setTitle(state?.tabToActive)
    }    
  },[state])

  useEffect(() => {
    if(title === 'Leaves') fatchLeaveTypes();
    if (title === 'Documents') getDocumentsDetails(getOnboardFormDetails.onboardContractDetails.talentID, getOnboardFormDetails.onboardContractDetails.companyID)
    if (title === 'BR PR Details') getAllBRPRTableData(onboardID !== undefined && onboardID );
  }, [title])
  

  useEffect(() => {
    if(getEngagementModal?.engagementAddFeedback || getEngagementModal?.addDocumentModal ){
       getFeedbackFormDetails(getHRAndEngagementId);
    }     
  }, [getEngagementModal?.engagementAddFeedback, getEngagementModal?.addDocumentModal]);

  useEffect(() => {
    if (onboardID !== undefined) {
      getOnboardingForm(onboardID);
      // getAllBRPRTableData(onboardID);
    }
  }, [onboardID]);

  const getUserResult = async () => {
    let userData = UserSessionManagementController.getUserSession();
    if (userData) setUserData(userData);
  };

  const feedbackTableColumnsMemo = useMemo(
    () => allEngagementConfig.clientFeedbackTypeConfig(),
    [],
  );

 const otherDetailsColumns = useMemo(() => {
      return [
        {
          title: "HR #",
          dataIndex: "hR_Number",
          key: "hR_Number",
          align: "left",
          render:(text,result)=> {
            return    <Link
                        target="_blank"
                        to={`/allhiringrequest/${result?.hiringRequestID}`}
                        style={{ color: "rgb(0, 102, 153)", textDecoration: "underline" }}
                        onClick={() => localStorage.removeItem("dealID")}
                      >
                        {text}
                      </Link>
          }
        },
        {
          title: "Client Name",
          dataIndex: "clientName",
          key: "clientName",
          align: "left",
        },
        {
          title: "Client Email",
          dataIndex: "clientEmail",
          key: "clientEmail",
          align: "left",
        },
        {
          title: "Company",
          dataIndex: "company",
          key: "company",
          align: "left",
        },
        {
          title: "Talent Status",
          dataIndex: "talent",
          key: "talent",
          align: "left",
        },
        {
          title: "Actual BR",
          dataIndex: "final_HR_CostStr",
          key: "final_HR_CostStr",
          align: "left",
        //   width: '150px', 
          render:(text,result)=>{
            return   `${text}`
          }
        },
        {
          title: "Actual PR",
          dataIndex: "talent_CostStr",
          key: "talent_CostStr",
          align: "left",
        //   width: '150px', 
          render:(text,result)=>{
            return   `${text} `
          }
        },
        {
          title: "Uplers Fees",
          dataIndex: "uplersFees",
          key: "uplersFees",
          align: "left",
        //   width: '150px', 
         
        },
        {
          title: "NR / DP (%)",
          dataIndex: "nrPercentage",
          key: "nrPercentage",
          align: "left",
        //   width: '150px', 
          render:(text,result)=>{
            return `${result.nrPercentage !== 0 ? result.nrPercentage : ''}  ${+result.dP_Percentage !== 0 ? result.dP_Percentage : ''}`
          }
        },
      ]
    },[otherDetailsList])

  const documentsColumns = useMemo(() => {
    return [
      {
        title: "Document Name",
        dataIndex: "documentName",
        key: "documentName",
        align: "left",
        // render: (value, data) => {
        //   return `${data.monthNames} ( ${data.years} )`;
        // },
      },
      {
        title: "Document Type",
        dataIndex: "documentType",
        key: "documentType",
        align: "left",
        render: (value, data) => {
          return value;
        },
      },
      {
        title: "Uploaded Date",
        dataIndex: "uploadDate",
        key: "uploadDate",
        align: "left",
        width:'150px',
        render: (value, data) => {
          return  value ;
        },
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        align: "left",
        width:'150px',
        render: (value, data) => {
          return   <div className={`${AddNewClientStyle.documentStatus} ${value === 'Not Verified' ? AddNewClientStyle.red : value === 'Verified'?  AddNewClientStyle.green :  AddNewClientStyle.darkred }`}>
          <div className={`${AddNewClientStyle.documentStatusText} ${value === 'Not Verified' ? AddNewClientStyle.red : value === 'Verified'?  AddNewClientStyle.green :  AddNewClientStyle.darkred }`}> <span> {value}</span></div>
        </div>
        },
      },
      {
        title: "Action",
        dataIndex: "talentDocumentID",
        key: "talentDocumentID",
        align: "left",
        width:'250px',
        render: (value, data) => {
          return data.status === 'Inactive'? null : <div>
           
              <IconContext.Provider value={{ color: '#FFDA30', style: { width:'15px',height:'15px' } }}> <Tooltip title="Download" placement="top" >
              <span
              // style={{
              //   background: 'green'
              // }}
              onClick={()=> window.open(`${NetworkInfo.NETWORK}Media/TalentDocuments/${data.unique_FileName}`, '_blank')}
              className={AddNewClientStyle.feedbackLabel}>
              {' '}
              <FaDownload />
            </span>   </Tooltip>
            </IconContext.Provider>
           
            
            {data.status !== 'Verified' &&  <IconContext.Provider value={{ color: 'green', style: { width:'15px',height:'15px' } }}><Tooltip title="Verify"  placement="top">
              <span
						// style={{
						// 	background: '#FFDA30'
						// }}
            onClick={()=>handleVerifyDocument(data.talentDocumentID)}
						className={AddNewClientStyle.feedbackLabel}>
						{' '}
						<MdOutlineVerified />
					</span> </Tooltip>
            </IconContext.Provider>}           
    
            <IconContext.Provider value={{ color: 'red', style: { width:'15px',height:'15px' } }}><Tooltip title="Remove" placement="top" >
              <span
              // style={{
              //   background: 'red'
              // }}
              onClick={()=>handleRemoveDocument(data.talentDocumentID)}
              className={AddNewClientStyle.feedbackLabel}>
              {' '}
              <IoIosRemoveCircle />
            </span>        </Tooltip>
            </IconContext.Provider>
    
          </div>
        },
      },
    ];
  }, [documentsList]);

  const leaveColumns = useMemo(() => {
    return [

      {
        title: "Leave Date",
        dataIndex: "leaveDate",
        key: "leaveDate",
        align: "left",
        width:'250px',
        render: (value, data) => {
          return value.split('/').map(val=>  moment(val).format(' MMM DD, YYYY')).join(' To ');
        },
      },
      {
        title: "Summary",
        dataIndex: "leaveReason",
        key: "leaveReason",
        align: "left",
        width:'250px',
        render: (value, data) => {
          return  value ;
        },
      },
      {
        title: "Leave Type",
        dataIndex: "leaveType",
        key: "leaveType",
        align: "left",
        width:'150px',
        render: (value, data) => {
          return  value ;
        },
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        align: "left",
        width:'100px',
        render: (value, data) => {
          return   <div className={`${AddNewClientStyle.documentStatus} ${value === 'Approved' ? AddNewClientStyle.green: value === 'Rejected'?  AddNewClientStyle.red:  AddNewClientStyle.blue }`}>
          <div className={`${AddNewClientStyle.documentStatusText} ${value === 'Approved' ? AddNewClientStyle.green : value === 'Rejected'?  AddNewClientStyle.red :  AddNewClientStyle.blue }`}> 
            {value === 'Rejected' ? <Tooltip title={data.leaveRejectionRemark} ><span style={{cursor:'pointer'}}> {value}</span></Tooltip> : <span> {value}</span>}
            
            </div>
        </div>
        },
      },
      {
        title: "Action",
        dataIndex: "talentDocumentID",
        key: "talentDocumentID",
        align: "center",
        width:'200px',
        render: (value, data) => {
          return data.status !== 'Pending'? <div>
            {data.actionFileName ? <IconContext.Provider value={{ color: 'green', style: { width:'15px',height:'15px' } }}> <Tooltip title="Download File" placement="top" >
              <span
              onClick={()=> { window.open(`${NetworkInfo.NETWORK}media/TalentLeaveDocuments/${data.actionFileName}`,'_blank')} }
              className={AddNewClientStyle.feedbackLabel} style={{padding:'0'}}>
              {' '}
              <FaDownload />
            </span>   </Tooltip>
            </IconContext.Provider> : null}
          </div> : <div>

            <IconContext.Provider value={{ color: '#FFDA30', style: { width:'15px',height:'15px' } }}> <Tooltip title="Edit" placement="top" >
              <span
              onClick={()=> { setEngagementModal(pre => ({...pre,addLeaveModal:true})); setEditLeaveData(data)} }
              className={AddNewClientStyle.feedbackLabel} style={{padding:'0'}}>
              {' '}
              <GrEdit /> 
            </span>   </Tooltip>
            </IconContext.Provider>
           
              <IconContext.Provider value={{ color: 'blue', style: { width:'15px',height:'15px' } }}> <Tooltip title="Revoke" placement="top" >
              <span
              onClick={()=> handleRevokeleave(data)}
              className={AddNewClientStyle.feedbackLabel} style={{padding:'0'}}>
              {' '}
              <RiFolderReceivedFill />
            </span>   </Tooltip>
            </IconContext.Provider>
           
            
             <IconContext.Provider value={{ color: 'green', style: { width:'15px',height:'15px' } }}><Tooltip title="Approve"  placement="top">
              <span
            onClick={()=>{setApproveLeaveData(data);setEngagementModal(pre => ({...pre,approveLeaveModal:true}))}}
						className={AddNewClientStyle.feedbackLabel} style={{padding:'0'}}>
						{' '}
						<MdOutlineVerified />
					</span> </Tooltip>
            </IconContext.Provider>
                      
            <IconContext.Provider value={{ color: 'red', style: { width:'15px',height:'15px' } }}><Tooltip title="Reject" placement="top" >
              <span
              // style={{
              //   background: 'red'
              // }}
              onClick={()=> {setEngagementModal(pre => ({...pre,rejectLeaveModal:true}));setRejectLeaveData(data)}}
              className={AddNewClientStyle.feedbackLabel} style={{padding:'0'}}>
              {' '}
              <IoIosRemoveCircle />
            </span>        </Tooltip>
            </IconContext.Provider>
    
          </div>
        },
      },
    ];
  }, [documentsList]);

  const saveHandler = 
    async (d) => {   
      setLoading(true);
      const response = await engagementRequestDAO.saveDaysandPRDetailsRequestDAO(d);
      setLoading(false);
      if (response.statusCode === HTTPStatusCode.OK) {
        getAllBRPRTableData(onboardID)
      }

  }

  const CompMonthlyPRColField = ({val,data}) => {
    const [isEdit,setIsEdit] = useState(false)
    const [colval,setcolVal]= useState(val)

    const updateValue= () =>{
      if(colval < data.br){    
      let payload = {
        "billRate": data.br,
        "payRate": colval,
        "days": 0,
        "payoutID": data.id,
        "currency": data.currency,
        "isPayRateUpdate": true
      }    
      saveHandler(payload)
      }          
    }


    if(isEdit){
      return <div style={{display:'flex', alignItems:'center' }}><div style={{display:'flex' ,flexDirection:'column', width:'50px'}}><input type='number' onDoubleClick={()=>{setIsEdit(false);setcolVal(val)}} value={colval} onChange={e=> setcolVal(+e.target.value)} />
      {colval > data.br && <p style={{ margin:'0', color:'red'}}>PR can not be greater then  BR</p>}
      </div> <TickMark
      width={24}
      height={24}
      style={{marginLeft:'10px',cursor:'pointer'}}
      onClick={() => updateValue()}
    /></div>
    }else{
      return <p style={{cursor:'pointer', margin:'0'}} onDoubleClick={()=>setIsEdit(true)}>{`${data.currency} ` + `${data.prStr}`}</p>
    }
  }    

  const CompNoOfDaysColField = ({val,data}) => {
    const [isEdit,setIsEdit] = useState(false)
    const [colval,setcolVal]= useState(val)

    const updateValue= () =>{
      if(colval > 0){    
      let payload = { 
        "days":colval,
        "payoutID": data.id,  
        "isPayRateUpdate": false
      }

      saveHandler(payload)
      }
      
    }


    if(isEdit){
      return <div style={{display:'flex',alignItems:'center'  }}><div style={{display:'flex' ,flexDirection:'column', width:'50px'}}><input type='number' onDoubleClick={()=>{setIsEdit(false);setcolVal(val)}} value={colval} onChange={e=> setcolVal(+e.target.value)} />
      {colval <= 0 && <p style={{ margin:'0', color:'red'}}>Days can not be 0</p>}
      </div> <TickMark
      width={24}
      height={24}
      style={{marginLeft:'10px',cursor:'pointer'}}
      onClick={() => updateValue()}
    /></div>
    }else{
      return <p style={{cursor:'pointer', margin:'0'}} onDoubleClick={()=>setIsEdit(true)}>{val}</p>
    }
  }

  const columns = useMemo(() => {
    return [
      {
        title: "Months",
        dataIndex: "monthNames",
        key: "monthNames",
        align: "left",
        render: (value, data) => {
          //return `${data.monthNames} ( ${data.years} ) <br /> / ${data.contractType}`;
          return (
            <>
              {`${data.monthNames} ( ${data.years} )`} <br />{" "}
              {data.contractType}
            </>
          );
        },
      },      
      {
        title: "Monthly BR",
        dataIndex: "brStr",
        key: "brStr",
        align: "left",
        render: (value, data) => {
          return `${data.currency} ` + value ;
        },
      },
      {
        title: "Monthly PR",
        dataIndex: "prStr",
        key: "prStr",
        align: "left",
        render: (value, data) => {
          return <CompMonthlyPRColField val={data.pr} data={data} />
        },
      },
      {
        title: "No. of days",
        dataIndex: "totalDaysinMonth",
        key: "totalDaysinMonth",
        align: "left",       
        render: (value, data) => {
          return <CompNoOfDaysColField  val={value} data={data} />
        },
      },
      {
        title: "Per Day PR",
        dataIndex: "pR_Per_DayWithExchangeRate",
        key: "pR_Per_DayWithExchangeRate",
        align: "left",
        render: (value, data) => {
          return `${data.currency} ` + value;
        },
      },
      {
        title: (
          <>
            Ex. Rate
          </>
        ),
        dataIndex: "exchangeRate",
        key: "exchangeRate",
        align: "left",       
        render: (value, data) => {
          return value;
        },
      },
      {
        title: (
          <>
            Per Day PR <br /> (INR)
          </>
        ),
        dataIndex: "pR_Per_DayStr",
        key: "pR_Per_DayStr",
        align: "left",
        render: (value, data) => {
          return `₹ ` + value;
        },
      },     
      {
        title: (
          <>
            Final PR <br /> (INR)
          </>
        ),
        dataIndex: "final_PRStr",
        key: "final_PRStr",
        align: "left",
        render: (value, data) => {
          const tooltipContent = (
            <div>
              <p><strong>Single Day PR:</strong> {`₹ ${data.pR_Per_DayStr}`}</p>
              <p><strong>Leaves Taken:</strong> {data.leavesTaken}</p>
              <p><strong>Total Amount to be Deducted:</strong> {`₹ ${data.amount_To_Be_DeductedStr}`}</p>
            </div>
          );
  
          return value ? (
            <> <span>{`₹  ${value}`}</span>
            <Tooltip title={tooltipContent} placement="right">
            <img src={infoSmallIcon} alt="info" style={{marginLeft:'5px',cursor:'pointer'}} />
            </Tooltip>
            </>
           
          ) : ''
        },
      },
      {
        title: "NR",
        dataIndex: "nR_DP_ValueStr",
        key: "nR_DP_ValueStr",
        align: "left",
        render: (value, data) => {
          return `${data.currency} ` + value;
        },
      },
      {
        title: "NR%",
        dataIndex: "actual_NR_Percentage",
        key: "actual_NR_Percentage",
        align: "left",
      },
    ];
  }, [allBRPRlist]);

  const getAllBRPRTableData = async (onboardID) => {
    setLoading(true);
    let result = await engagementRequestDAO.getAllBRPRListWithLeaveDAO(onboardID);
    setLoading(false);
    // console.log("getAllBRPRTableData",result)
    if (result.statusCode === HTTPStatusCode.OK) {
      setAllBRPRList(result.responseBody);
    }
  };

  const getOtherDetailsTableData = async (payload) => {
    let result = await engagementRequestDAO.getTalentOtherDetailsOtherListDAO(payload);

    if (result.statusCode === HTTPStatusCode.OK) {
      setOtherDetailsList(result.responseBody?.Data?.getTalentInfo);
    }
  };

  const getFeedbackFormDetails = async (getHRAndEngagementId) => {
    setFeedbackFormContent({});
    const response = await engagementRequestDAO.getFeedbackFormContentDAO(
      getHRAndEngagementId,
    );
       const categorylistResult = await engagementRequestDAO.getFeedbackFormCategoryDAO()

    if (categorylistResult?.statusCode === HTTPStatusCode.OK) {
      setFeedbackCategory(categorylistResult?.responseBody?.details.map(v=> ({id: v.id, value: v.lostCategory})));
    }

    if (response?.statusCode === HTTPStatusCode.OK) {
      setFeedbackFormContent(response?.responseBody?.details);
    } else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
      return navigate(UTSRoutes.LOGINROUTE);
    } else if (response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
      setLoading(false);
      return navigate(UTSRoutes.SOMETHINGWENTWRONG);
    } else {
      return 'NO DATA FOUND';
    }
  };

  const getFeedbackList = async (feedBackData) => {
    setLoading(true);
    const response = await engagementRequestDAO.getFeedbackListDAO(
      feedBackData,
    );
    if (response?.statusCode === HTTPStatusCode.OK) {
      setClientFeedbackList(
        engagementUtils.modifyEngagementFeedbackData(response && response),
      );
      setFeedbackPagination((prev) => ({
        ...prev,
        totalRecords: response.responseBody.details.totalrows,
      }));
      setLoading(false);
    }
     else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
      setLoading(false);
      return navigate(UTSRoutes.LOGINROUTE);
    } else if (response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
      setLoading(false);
      return navigate(UTSRoutes.SOMETHINGWENTWRONG);
    } 
    else {
      setLoading(false);
      setClientFeedbackList([]);
      return 'NO DATA FOUND';
    }
  };

  const getDocumentsDetails = async (talentID,companyID) =>{
    setLoading(true);
   const  result = await engagementRequestDAO.viewDocumentsDetailsDAO(talentID,companyID)
   setLoading(false);
  
   const docTypeRes = await engagementRequestDAO.getDocumentTypeDAO()

   if(docTypeRes.statusCode === HTTPStatusCode.OK){
      setDocTypeList(docTypeRes.responseBody.details.documentType)
   }

   if(result.statusCode === HTTPStatusCode.OK){
    setDocumentsList(result.responseBody.details)
   }
   if(result.statusCode === HTTPStatusCode.NOT_FOUND){
    setDocumentsList([])
   }
  }

  const getLeaveDetails = async (talentID,companyID,m,y) =>{
    setLeaveLoading(true); 
    let payload = {
      month: m !== undefined ? m +1 : currentMonth + 1,
      year: y !== undefined ? y : currentYear,
      talentID:talentID,
      companyId:companyID,
      onboardID: onboardID
    }
   const  result = await amDashboardDAO.getTalentLeaveRequestDAO(payload)
   setLeaveLoading(false);
  

   if(result.statusCode === HTTPStatusCode.OK){
    setLeaveList(result.responseBody)
    if(result.responseBody.length > 0){
      setTotalLeave(result.responseBody[0].totalLeavesGiven)
      setTotalLeaveBalance(result.responseBody[0].totalLeaveBalance)
      setHolidayLeave(result.responseBody[0].holidayLeaves)
    }
   }
   if(result.statusCode === HTTPStatusCode.NOT_FOUND){
    setLeaveList([])
    setTotalLeave(0)
    setTotalLeaveBalance(0)
    setHolidayLeave(0)
   }
  }

  const fatchLeaveTypes = async () => {
    let result = await amDashboardDAO.getLeaveTypesRequestDAO()
    if(result.statusCode === HTTPStatusCode.OK){
      setLeaveTypes(result.responseBody)
    }
  }

  const handleApproveleave = async (data,file)=>{
    setLeaveLoading(true)
    let payload = {
      "leaveID": data.leaveID,
      "actionDoneBy":userData.UserId,
      "isActionDoneByAM": true,  
      "flag": "Approve"
    }
    let fileDatatoUpload = new FormData()

    Object.keys(payload).forEach(key=>{
      fileDatatoUpload.append(key,payload[key])
    })

    if(file !== ''){
      fileDatatoUpload.append('files',file)
    }
    const  result = await amDashboardDAO.approveRejectLeaveDAO(fileDatatoUpload)
    setLeaveLoading(false)
    if(result?.statusCode === HTTPStatusCode.OK){     
      setEngagementModal({
        ...getEngagementModal,
        approveLeaveModal: false,
      })
      setApproveLeaveData({})
      getCalenderLeaveDetails(getOnboardFormDetails.onboardContractDetails.talentID,getOnboardFormDetails.onboardContractDetails.companyID)
      getLeaveDetails(getOnboardFormDetails.onboardContractDetails.talentID,getOnboardFormDetails.onboardContractDetails.companyID)
    }
  }

  const handleRevokeleave =async (data)=>{
    setLeaveLoading(true)
    let payload = {
      "leaveID": data.leaveID,
      "actionDoneBy":userData.UserId,
      "isActionDoneByAM": true,  
       "flag": "Revoke"
    }

    const  result = await amDashboardDAO.approveRejectLeaveDAO(payload)
    setLeaveLoading(false)
    if(result?.statusCode === HTTPStatusCode.OK){
      getCalenderLeaveDetails(getOnboardFormDetails.onboardContractDetails.talentID,getOnboardFormDetails.onboardContractDetails.companyID,currentMonth,currentYear)
      getLeaveDetails(getOnboardFormDetails.onboardContractDetails.talentID,getOnboardFormDetails.onboardContractDetails.companyID,currentMonth,currentYear)
    }
  }

  const getCalenderLeaveDetails = async (talentID,companyID,m,y) =>{
    setLeaveLoading(true); 
    let payload = {
      month: m !== undefined ? m +1 : currentMonth + 1,
      year: y !== undefined ? y : currentYear,
      companyId: companyID,
      talentId:talentID
    }
   const  result = await amDashboardDAO.getCalenderLeaveRequestDAO(payload)
   setLeaveLoading(false);
  
   if(result.statusCode === HTTPStatusCode.OK){
    setCalEvents(result.responseBody.map((leave) => ({         
      start: leave.actualDate,           
      title: leave.leaveReason ? leave.leaveReason : leave.leaveType,
      color : leave.colorCode,
      leaveReason: leave.leaveReason
    })))
    setcalenderCurrentMonth(payload.month -1)
    setcalenderCurrentYear(payload.year)
    // setLeaveList(result.responseBody)
   }
   if(result.statusCode === HTTPStatusCode.NOT_FOUND){
    // setLeaveList([])
   }
  }

  const handleVerifyDocument = async (docId)=>{
    setLoading(true);
    let result = await engagementRequestDAO.verifyDocumentRequestDAO(docId)
    setLoading(false);
    if(result.statusCode === 200){
      message.success('Document Verify')
      getDocumentsDetails(getOnboardFormDetails.onboardContractDetails.talentID,getOnboardFormDetails.onboardContractDetails.companyID)
    }
  }

  const handleRemoveDocument = async (docId)=>{
    setLoading(true);
    let result = await engagementRequestDAO.removeDocumentRequestDAO(docId)
    setLoading(false);
    if(result.statusCode === 200){
      message.success('Document Removed')
      getDocumentsDetails(getOnboardFormDetails.onboardContractDetails.talentID, getOnboardFormDetails.onboardContractDetails.companyID)
    }
  }

  const getOnboardingForm = async (getOnboardID) => {
    setOnboardFormDetails({});
    setLoading(true);
    const response = await engagementRequestDAO.viewOnboardDetailsDAO(
      getOnboardID
    );
    if (response?.statusCode === HTTPStatusCode.OK) {
      setOnboardFormDetails(response?.responseBody?.details);
      let feedbackPayload = {
        hrNumber: response?.responseBody?.details?.onboardContractDetails?.hrNumber,
        engagementID: response?.responseBody?.details?.onboardContractDetails?.engagemenID,
        talentName: response?.responseBody?.details?.onboardContractDetails?.talentName,
        onBoardId: getOnboardID,
        hrId: response?.responseBody?.details?.onboardContractDetails?.hR_ID,
      }
      setHRAndEngagementId(feedbackPayload)
      setFeedBackData(prev => ({...prev,onBoardId: getOnboardID}))
      getFeedbackList({...feedBackData,onBoardId: getOnboardID})
      getOtherDetailsTableData({onboardID: getOnboardID,talentID: response?.responseBody?.details?.onboardContractDetails?.talentID})
      // getDocumentsDetails(response?.responseBody?.details?.onboardContractDetails?.talentID,response?.responseBody?.details?.onboardContractDetails?.companyID)
      getLeaveDetails(response?.responseBody?.details?.onboardContractDetails?.talentID,response?.responseBody?.details?.onboardContractDetails?.companyID)
      getCalenderLeaveDetails(response?.responseBody?.details?.onboardContractDetails?.talentID,response?.responseBody?.details?.onboardContractDetails?.companyID)
      setLoading(false);
    } else {
      setOnboardFormDetails({});
      setLoading(false);
    }
  };

  const DetailComp = () => {
    return (
      <div className={AddNewClientStyle.onboardDetailsContainer}>
        {isLoading ? (
          <Skeleton active />
        ) : (
          <EngagementOnboard
            getOnboardFormDetails={getOnboardFormDetails}
            getHRAndEngagementId={{
              onBoardId: onboardID,
              talentName: `${getOnboardFormDetails?.onboardContractDetails?.talentName} (${getOnboardFormDetails?.onboardContractDetails?.talentEmail})`,
            }}
            getOnboardingForm={getOnboardingForm}
            hideHeader={true}
          />
        )}
      </div>
    );
  };

  const HrsDetails = () => {
    return (
      <div className={AddNewClientStyle.onboardDetailsContainer}>
        {isLoading ? (
          <Skeleton active />
        ) : (
          <>
          <div className={AddNewClientStyle.onboardBRPRTableTEXT} >*Double Click on Monthly PR, No. of days to enable edit.</div>
           <Table
            scroll={{ y: "100vh" }}
            dataSource={allBRPRlist ? allBRPRlist : []}
            columns={columns}
            pagination={false}
          />
          </>
         
        )}
      </div>
    );
  };

  const DocumentsDetails = () => {
    const [docTitle,setDocTitle] = useState('official')
    return (<>
    <div className={AddNewClientStyle.engagementModalHeaderButtonContainer} style={{justifyContent:'end'}}>
      <button className={AddNewClientStyle.engagementModalHeaderAddBtn} 
				  onClick={()=> {
					// setHRAndEngagementId({
					// 	talentName: getHRAndEngagementId?.talentName,
					// 	engagementID: getHRAndEngagementId?.engagementID,
					// 	hrNumber: getHRAndEngagementId?.hrNumber,
					// 	onBoardId: getHRAndEngagementId?.onBoardId,
					// 	hrId: getHRAndEngagementId?.hrId,
					// });
					setEngagementModal(pre => ({...pre,addDocumentModal:true}));
				  }}
				  >Upload Document</button>
    </div>           
        
        {isLoading ? (
          <Skeleton active />
        ) : (
          <Tabs
          onChange={(e) => setDocTitle(e)}
          defaultActiveKey="1"
          activeKey={docTitle}
          animated={true}
          tabBarGutter={50}
          className="tabbingBottomClsAdding"
          tabBarStyle={{ borderBottom: `1px solid var(--uplers-border-color)` }}
          items={[
            {
              label: 'Official',
              key: 'official',
              children:
              <div className={AddNewClientStyle.onboardDetailsContainer}> <Table
              scroll={{ y: "100vh" }}
              dataSource={documentsList ? documentsList.filter(item=> item.isOfficial) : []}
              columns={documentsColumns}
              pagination={false}
            /> </div> ,
            },
            {
              label: 'Personal',
              key: 'personal',
              children:<div className={AddNewClientStyle.onboardDetailsContainer}> <Table
              scroll={{ y: "100vh" }}
              dataSource={documentsList ? documentsList.filter(item=> !item.isOfficial) : []}
              columns={documentsColumns}
              pagination={false}
            /></div>  ,
            }]} />
                 
        )}
      
    </>
     
    );
  };

  const NotesComp = () =>{
    return <OnboardNotes onboardID={onboardID} getOnboardFormDetails={getOnboardFormDetails?.onboardContractDetails}/>
  }
  
  const OtherDetails = () => {
    return (
      <div className={AddNewClientStyle.onboardDetailsContainer}>
        {isLoading ? (
          <Skeleton active />
        ) : (
          <Table
            scroll={{ y: "100vh" }}
            dataSource={otherDetailsList ? otherDetailsList : []}
            columns={otherDetailsColumns}
            pagination={false}
          />
        )}
      </div>
    );
  };

  const LeaveComponent = () =>{
    return (<>
      <div className={AddNewClientStyle.engagementModalHeaderButtonContainer}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <Select
          options={[...Array(10)].map((_, index) => {
            const year = new Date().getFullYear() - 5 + index;
            return { value: year, label: year }
          })}
          value={currentYear}
          onChange={e=>{setCurrentYear(Number(e))}}
          />
        {/* <select value={currentYear} onChange={e=>{setCurrentYear(Number(e.target.value))}}>
          {[...Array(10)].map((_, index) => {
            const year = new Date().getFullYear() - 5 + index;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select> */}

        <Select
          options={Array.from({ length: 12 }, (_, index) => (
            { value: index , label: new Date(0, index).toLocaleString('default', { month: 'long' }) }
          ))}
          value={currentMonth}
          onChange={e=>{setCurrentMonth(Number(e))}}
          />

        {/* <select value={currentMonth} onChange={e=> setCurrentMonth(Number(e.target.value))}>
          {Array.from({ length: 12 }, (_, index) => (
            <option key={index} value={index}>
              {new Date(0, index).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select> */}

        <button className={AddNewClientStyle.engagementModalHeaderAddBtn}  style={{background:'var(--color-sunlight)',color:'#000'}} onClick={()=>{
          getLeaveDetails(getOnboardFormDetails.onboardContractDetails.talentID,getOnboardFormDetails.onboardContractDetails.companyID);
          getCalenderLeaveDetails(getOnboardFormDetails.onboardContractDetails.talentID,getOnboardFormDetails.onboardContractDetails.companyID)

          }}>Go</button>

        <p style={{
          textDecoration: 'underline',
          fontWeight: 'bold',
          cursor: 'pointer',
          margin:'0',
          alignSelf:'center',
        }} onClick={()=> {
          setCurrentMonth(new Date().getMonth())
          setCurrentYear(new Date().getFullYear())
          setcalenderCurrentMonth(new Date().getMonth())
          setcalenderCurrentYear(new Date().getFullYear())
          getLeaveDetails(getOnboardFormDetails.onboardContractDetails.talentID,getOnboardFormDetails.onboardContractDetails.companyID ,new Date().getMonth(),new Date().getFullYear());
          getCalenderLeaveDetails(getOnboardFormDetails.onboardContractDetails.talentID,getOnboardFormDetails.onboardContractDetails.companyID,new Date().getMonth(),new Date().getFullYear())
        }}>Reset</p>
      </div>
      

       <div  style={{  marginLeft: "30%",display:'flex', alignItems:'center',gap:'15px' }}>
        <h4>Total Leaves Given: {totalLeave > 0 ? totalLeave : getOnboardFormDetails?.onboardContractDetails?.totalLeavesGiven}</h4>
        <h4>Holiday Leaves: {holidayLeave > 0 ? holidayLeave : getOnboardFormDetails?.onboardContractDetails?.holidayLeaves}</h4>
        <h4>Total Leave Balance: {totalLeaveBalance > 0 ? totalLeaveBalance : getOnboardFormDetails?.onboardContractDetails?.totalLeaveBalance}</h4>
      </div>



        <button className={AddNewClientStyle.engagementModalHeaderAddBtn} 
            onClick={()=> {
            // setHRAndEngagementId({
            // 	talentName: getHRAndEngagementId?.talentName,
            // 	engagementID: getHRAndEngagementId?.engagementID,
            // 	hrNumber: getHRAndEngagementId?.hrNumber,
            // 	onBoardId: getHRAndEngagementId?.onBoardId,
            // 	hrId: getHRAndEngagementId?.hrId,
            // });
            setEngagementModal(pre => ({...pre,addLeaveModal:true}));
            }}
            >Apply Leave</button>
      </div>
  
  
             {isLeaveLoading && <div className={AddNewClientStyle.onboardDetailsContainer}>
             <Skeleton active />
             </div>}

          {!isLeaveLoading && 
            <div className={AddNewClientStyle.LeaveContainer}>
              <div className={AddNewClientStyle.onboardDetailsContainer} style={{width:'39%'}}><div>
                <MyCalendar calendarRef={calendarRef} calEvents={calEvents} currentYear={calenderCurrentYear} setCurrentYear={setcalenderCurrentYear} currentMonth={calenderCurrentMonth} setCurrentMonth={setcalenderCurrentMonth} />
                </div></div>
              <div className={AddNewClientStyle.onboardDetailsContainer} style={{width:'60%',height: 'fit-content'}}>
            <Table
              scroll={{y: "100vh" }}
              dataSource={leaveList ? leaveList : []}
              columns={leaveColumns}
              pagination={false}
            />
              </div>
               
            </div>
                 
          }
     
      </>
       
      );
  }

  return (
    <>
      <div className={AddNewClientStyle.addNewContainer}>
        <div className={AddNewClientStyle.addHRTitle} style={{paddingBottom:'25px'}}>{getOnboardFormDetails?.onboardContractDetails?.talentName ? `${getOnboardFormDetails?.onboardContractDetails?.talentName} Engagement Details` : ''} </div>

        <Tabs
          onChange={(e) => setTitle(e)}
          defaultActiveKey="1"
          activeKey={title}
          animated={true}
          tabBarGutter={50}
          className="tabbingBottomClsAdding"
          tabBarStyle={{ borderBottom: `1px solid var(--uplers-border-color)` }}
          items={[
            {
              label: "OnBoard Details",
              key: "OnBoard Details",
              children: <DetailComp />,
            },
            isOngoing === 'false' && {
              label: "BR PR Details",
              key: "BR PR Details",
              children: <HrsDetails />,
            },
            {
              label: "Leaves",
              key: "Leaves",
              children: <LeaveComponent />,
            },
            {
              label: "Documents",
              key: "Documents",
              children: <DocumentsDetails />,
            },
          
            {
              label: "Client Feedback",
              key: "Client Feedback",
              children: <EngagementFeedback 
                  hideTitle={true}
                  getHRAndEngagementId={getHRAndEngagementId}
                  feedbackTableColumnsMemo={feedbackTableColumnsMemo}
                  getClientFeedbackList={getClientFeedbackList}
                  isLoading={isLoading}
                  pageFeedbackSizeOptions={[10, 20, 30, 50, 100]}
                  getFeedbackPagination={getFeedbackPagination}
                  setFeedbackPagination={setFeedbackPagination}
                  setFeedBackData={setFeedBackData}
                  feedBackData={feedBackData}
                  setEngagementModal={setEngagementModal}
                  setHRAndEngagementId={setHRAndEngagementId}
              />,
            },
            {
              label: "Notes",
              key: "Notes",
              children: <NotesComp    />,
            },
            {
              label: "Custom Email",
              key: "Custom Email",
              children: <EmailComponent onboardID={onboardID} getOnboardFormDetails={getOnboardFormDetails} />,
            },
            {
              label: "Talent's Other Eng. Details",
              key: "Talent's Other Eng. Details",
              children: <OtherDetails />,
            },
           
            // companyPreviewData?.engagementDetails?.companyTypeID && {
            //   label: "Credit Utilize",
            //   key: "Credit Utilize",
            //   children: <CredUtilize />,
            // },
          ]}
        />

        {/** Approve Leave **/}
        {getEngagementModal.approveLeaveModal && <Modal
						transitionName=""
						width="630px"
						centered
						footer={null}
						className="engagementAddFeedbackModal"
						open={getEngagementModal.approveLeaveModal}
						onCancel={() =>{
              setEngagementModal({
                ...getEngagementModal,
                approveLeaveModal: false,
              })
              setApproveLeaveData({})
            }
						}>
              <ApproveLeaveModal 
                  handleApproveleave={handleApproveleave}
                  approveLeaveData={approveLeaveData}
                  isLeaveLoading={isLeaveLoading}
                  onCancel={() =>{
                    setEngagementModal({
                      ...getEngagementModal,
                      approveLeaveModal: false,
                    })
                    setApproveLeaveData({})
                  }
                  }
              />
         </Modal>}

        {/** reject Leave Modal **/}
        {getEngagementModal.rejectLeaveModal && 	<Modal
						transitionName=""
						width="630px"
						centered
						footer={null}
						className="engagementAddFeedbackModal"
						open={getEngagementModal.rejectLeaveModal}
						onCancel={() =>{
              setEngagementModal({
                ...getEngagementModal,
                rejectLeaveModal: false,
              })
              setRejectLeaveData({})
              reset()
            }
						}>
            <RejectLeaveModal
            rejectLeaveData={rejectLeaveData}
            docTypeList={docTypeList.length ? docTypeList.map(item=>({label:item.text,value:item.value})) : []}
            getcalendarLeaveDetails={(talentID)=>{getCalenderLeaveDetails(talentID,getOnboardFormDetails.onboardContractDetails.companyID);getLeaveDetails(talentID,getOnboardFormDetails.onboardContractDetails.companyID)}}
            getFeedbackFormContent={getFeedbackFormContent}
            getHRAndEngagementId={getHRAndEngagementId}
            talentID={getOnboardFormDetails.onboardContractDetails.talentID}
            onCancel={() =>{
              setEngagementModal({
                ...getEngagementModal,
                rejectLeaveModal: false,
              })
              setRejectLeaveData({})
              reset()
            }
            }
            setFeedbackSave={setFeedbackSave}
            feedBackSave={feedBackSave}
            register={register}
            handleSubmit={handleSubmit}
            setValue={setValue}
            control={control}
            setError={setError}
            getValues={getValues}
            watch={watch}
            reset={reset}
            resetField={resetField}
            errors={errors}
            />

        </Modal>          
        }

        {/** add/edit Leave Modal **/}
        {getEngagementModal.addLeaveModal && 	<Modal
						transitionName=""
						width="630px"
						centered
						footer={null}
						className="engagementAddFeedbackModal"
						open={getEngagementModal.addLeaveModal}
						onCancel={() =>{
              setEngagementModal({
                ...getEngagementModal,
                addLeaveModal: false,
              })
              setEditLeaveData({})
              reset()
            }
						}>
              <AddLeaveModal
                editLeaveData={editLeaveData}
                docTypeList={docTypeList.length ? docTypeList.map(item=>({label:item.text,value:item.value})) : []}
                getcalendarLeaveDetails={(talentID)=>{getCalenderLeaveDetails(talentID,getOnboardFormDetails.onboardContractDetails.companyID);getLeaveDetails(talentID,getOnboardFormDetails.onboardContractDetails.companyID)}}
                getOnboardFormDetails={getOnboardFormDetails}
                getFeedbackFormContent={getFeedbackFormContent}
                getHRAndEngagementId={getHRAndEngagementId}
                talentID={getOnboardFormDetails?.onboardContractDetails?.talentID}
                onCancel={() =>{
                  setEngagementModal({
                    ...getEngagementModal,
                    addLeaveModal: false,
                  })
                  reset();
                  setEditLeaveData({})
                }
                }
                setFeedbackSave={setFeedbackSave}
                feedBackSave={feedBackSave}
                register={register}
                handleSubmit={handleSubmit}
                setValue={setValue}
                control={control}
                setError={setError}
                getValues={getValues}
                watch={watch}
                reset={reset}
                resetField={resetField}
                errors={errors}
                feedBackTypeEdit={feedBackTypeEdit}
                setFeedbackTypeEdit={setFeedbackTypeEdit}
                setClientFeedbackList={setClientFeedbackList}
                leaveTypes={leaveTypes} />

        </Modal>}

        {/** Add Document Modal **/}
          {getEngagementModal.addDocumentModal && 	<Modal
						transitionName=""
						width="930px"
						centered
						footer={null}
						className="engagementAddFeedbackModal"
						open={getEngagementModal.addDocumentModal}
						onCancel={() =>{
              setEngagementModal({
                ...getEngagementModal,
                addDocumentModal: false,
              })
              reset()
            }
						}>
              <AddTalentDocuments
                docTypeList={docTypeList.length ? docTypeList.map(item=>({label:item.text,value:item.value})) : []}
                getDocumentsDetails={getDocumentsDetails}
                getFeedbackFormContent={getFeedbackFormContent}
                getOnboardFormDetails={getOnboardFormDetails}
                getHRAndEngagementId={getHRAndEngagementId}
                onCancel={() =>{
                  setEngagementModal({
                    ...getEngagementModal,
                    addDocumentModal: false,
                  })
                  reset()
                }
                }
                setFeedbackSave={setFeedbackSave}
                feedBackSave={feedBackSave}
                register={register}
                handleSubmit={handleSubmit}
                setValue={setValue}
                control={control}
                setError={setError}
                getValues={getValues}
                watch={watch}
                reset={reset}
                resetField={resetField}
                errors={errors}
                feedBackTypeEdit={feedBackTypeEdit}
                setFeedbackTypeEdit={setFeedbackTypeEdit}
                setClientFeedbackList={setClientFeedbackList}
              />

          </Modal> }

        {/** ============ MODAL FOR ENGAGEMENT ADD FEEDBACK ================ */}
				{getEngagementModal.engagementAddFeedback && (
					<Modal
						transitionName=""
						width="930px"
						centered
						footer={null}
						className="engagementAddFeedbackModal"
						open={getEngagementModal.engagementAddFeedback}
						onCancel={() =>{
              setEngagementModal({
                ...getEngagementModal,
                engagementAddFeedback: false,
              })
              reset()
            }
						}>

						<EngagementAddFeedback
							getFeedbackFormContent={getFeedbackFormContent}
							getHRAndEngagementId={getHRAndEngagementId}
							onCancel={() =>{
								setEngagementModal({
									...getEngagementModal,
									engagementAddFeedback: false,
								})
                reset()
              }
							}
               feedbackCategory={feedbackCategory}
							setFeedbackSave={setFeedbackSave}
							feedBackSave={feedBackSave}
							register={register}
							handleSubmit={handleSubmit}
							setValue={setValue}
							control={control}
							setError={setError}
							getValues={getValues}
							watch={watch}
							reset={reset}
							resetField={resetField}
							errors={errors}
							feedBackTypeEdit={feedBackTypeEdit}
							setFeedbackTypeEdit={setFeedbackTypeEdit}
              setClientFeedbackList={setClientFeedbackList}
						/>
					</Modal>
				)}
      </div>
    </>
  );
}
