import React, { useEffect, useMemo, useState, useCallback, Suspense } from "react";
import clientDashboardStyles from "./clientDashboard.module.css";
import { ReactComponent as SearchSVG } from "assets/svg/search.svg";
import { ReactComponent as CloseSVG } from "assets/svg/close.svg";
import { InputType } from "constants/application";
import { Tabs, Select, Table, Modal, Tooltip, Skeleton, message, Dropdown, Menu, Spin, Radio } from "antd";
import { ReportDAO } from "core/report/reportDAO";
import { downloadToExcel } from "modules/report/reportUtils";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import ClientReportStyle from "../clientReport/clientReport.module.css";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import DatePicker from "react-datepicker";
import { TaDashboardDAO } from "core/taDashboard/taDashboardDRO";
import { HTTPStatusCode } from "constants/network";
import UTSRoutes from "constants/routes";
import { useNavigate } from "react-router-dom";
import OnboardFilerList from "modules/onBoardList/OnboardFilterList";
import { ReactComponent as FunnelSVG } from "assets/svg/funnel.svg";
import { allHRConfig } from "modules/hiring request/screens/allHiringRequest/allHR.config";
import { allEngagementConfig } from "modules/engagement/screens/engagementList/allEngagementConfig";
import taStyles from "../../../../modules/taDashboard/tadashboard.module.css";
import { InterviewDAO } from "core/interview/interviewDAO";
import { useForm } from "react-hook-form";
import { All_Hiring_Request_Utils } from "shared/utils/all_hiring_request_util";
import { IconContext } from "react-icons";
import { BsClipboard2CheckFill } from "react-icons/bs";
import MoveToAssessment from "modules/hiring request/components/talentList/moveToAssessment";
import moment from "moment";
import { IoChevronDownOutline } from "react-icons/io5";

export default function RecruiterDashboardMultiMonthsReport() {  

  const navigate = useNavigate();  
  const [clientData, setClientData] = useState([]);
  const [isLoading, setLoading] = useState(false); 
  const [isModalLoading, setIsModalLoading] = useState(false); 
  const [openTicketDebounceText, setopenTicketDebounceText] = useState("");
  const [openTicketSearchText, setopenTicketSearchText] = useState("");
  const today = new Date();
  const [dateTypeFilter, setDateTypeFilter] = useState(0);

  const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(1);
  
  const [monthDate, setMonthDate] = useState(today);  
  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(today);
  const [colTextVal,setColTextVal] = useState('')
  const [isCarryForwardPipelineClicked, setIsCarryForwardPipelineClicked] = useState(false);
  const [revenueColumn, setRevenueColumn] = useState(false);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const pageSizeOptions = [100, 200, 300, 500, 1000, 5000];
  const [listDataCount, setListDataCount] = useState(0);
 
  const [isAllowFilters, setIsAllowFilters] = useState(false);
  const [appliedFilter, setAppliedFilters] = useState(new Map());
  const [checkedState, setCheckedState] = useState(new Map());
  const [filteredTagLength, setFilteredTagLength] = useState(0);
  const [getHTMLFilter, setHTMLFilter] = useState(false);
    const [hrModal, setHRModal] = useState('DP');
   const [selectedHead, setSelectedHead] = useState("");
     const [pODList, setPODList] = useState([]);
  const [tableFilteredState, setTableFilteredState] = useState({
      filterFields_OnBoard: {
        taUserIDs: null,
    },
  });

  // New added state 

  const [showTalentProfiles, setShowTalentProfiles] = useState(false);
  const [profileInfo, setInfoforProfile] = useState({});
  const [hrTalentList, setHRTalentList] = useState([]);
  const [filteredTalentList, setFilteredTalentList] = useState(hrTalentList);
  const [hrTalentListFourCount, setHRTalentListFourCount] = useState([]);
  const [talentToMove, setTalentToMove] = useState({});
  const [profileStatusID, setProfileStatusID] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [loadingTalentProfile, setLoadingTalentProfile] = useState(false);
  const [isAddingNewTask, setAddingNewTask] = useState(false);
  const [saveRemarkLoading, setSaveRemarkLoading] = useState(false);
  const [moveToAssessment, setMoveToAssessment] = useState(false);
  
  const {
    register: remarkregiter,
    handleSubmit: remarkSubmit,
    resetField: resetRemarkField,
    clearErrors: clearRemarkError,
    formState: { errors: remarkError },
  } = useForm();

  const onRemoveHRFilters = () => {
    setTimeout(() => {
      setIsAllowFilters(false);
    }, 300);
    setHTMLFilter(false);
  };
    const ProfileColumns = () => {

      if(revenueColumn){
         return [
      {
        title: "Created Date" ,
        dataIndex: "actionDate",
        key: "actionDate",
         width: "150px",
        render:(text)=>{
          return text
        }
      },  {
        title: "Company",
        dataIndex: "company",
        key: "company",
         width: "150px",
      },
      {
        title: "HR #",
        dataIndex: "hR_Number",
        key: "hR_Number",
         width: "170px",
        render:(text,value)=>{
           return <a href={`/allhiringrequest/${value.hiringRequestID}`} style={{textDecoration:'underline'}} target="_blank" rel="noreferrer">{text}</a>;  // Replace `/client/${text}` with the appropriate link you need
           
        }
      },
       {
        title: "HR Title",
        dataIndex: "hrTitle",
        key: "hrTitle",
        width: "200px",
      },  
         {
        title: "Talent",
        dataIndex: "talent",
        key: "talent",
          width: "100px",
      },
   
    {
        title: "Revenue",
        dataIndex: "hrPipeline",
        key: "hrPipeline",
          width: "100px",
      } ,
    {
        title: "HR Status",
        dataIndex: "hrStatus",
        key: "hrStatus",
          width: "200px",
         render: (_, param) => {
            return All_Hiring_Request_Utils.GETHRSTATUS(
              param?.hrStatusCode ,
              param?.hrStatus
            );}
      } 
     
    ];
      }

      if(isCarryForwardPipelineClicked){

    return [
      {
        title: "Created Date" ,
        dataIndex: "actionDate",
        key: "actionDate",
         width: "150px",
        render:(text)=>{
          return text
        }
      },  {
        title: "Company",
        dataIndex: "company",
        key: "company",
         width: "150px",
      },
      {
        title: "HR #",
        dataIndex: "hR_Number",
        key: "hR_Number",
         width: "170px",
        render:(text,value)=>{
           return <a href={`/allhiringrequest/${value.hiringRequestID}`} style={{textDecoration:'underline'}} target="_blank" rel="noreferrer">{text}</a>;  // Replace `/client/${text}` with the appropriate link you need
           
        }
      },
       {
        title: "HR Title",
        dataIndex: "hrTitle",
        key: "hrTitle",
        width: "200px",
      },  
    {
        title: "CarryFwd Pipeline",
        dataIndex: "hrPipeline",
        key: "hrPipeline",
             width: "170px",
      },{
        title: "CarryFwd Status",
        dataIndex: "carryFwd_HRStatus",
        key: "carryFwd_HRStatus",
             width: "170px",
         render: (_, param) => {
            return All_Hiring_Request_Utils.GETHRSTATUS(
              param?.carryFwd_HRStatusCode,
              param?.carryFwd_HRStatus
            );}
      },
    {
        title: "HR Status",
        dataIndex: "hrStatus",
        key: "hrStatus",
        width: "200px",
         render: (_, param) => {
            return All_Hiring_Request_Utils.GETHRSTATUS(
              param?.hrStatusCode ,
              param?.hrStatus
            );}
      } 
    
     
    ];
      }
      return  [
      {
        title: "Action Date",
        dataIndex: "actionDate",
        key: "actionDate",
         width: "150px",
        render:(text)=>{
          return text
        }
      },  {
        title: "Company",
        dataIndex: "company",
        key: "company",
         width: "150px",
      },
      {
        title: "HR #",
        dataIndex: "hR_Number",
        key: "hR_Number",
         width: "170px",
        render:(text,value)=>{
           return <a href={`/allhiringrequest/${value.hiringRequestID}`} style={{textDecoration:'underline'}} target="_blank" rel="noreferrer">{text}</a>;  // Replace `/client/${text}` with the appropriate link you need
           
        }
      },
       {
        title: "HR Title",
        dataIndex: "hrTitle",
        key: "hrTitle",
        width: "200px",
      },  
      {
        title: "Talent",
        dataIndex: "talent",
        key: "talent",
         width: "100px",
      },
      {
        title: "Slot/Remark",
        dataIndex: "slotOrRemarkDetails",
        key: "slotOrRemarkDetails",
         width: "250px",
      }

    
     
    ];

    } 
   
  var date = new Date();

  const getTalentProfilesDetailsfromTable = async (
    result,
    optiontype
  ) => {
    setShowTalentProfiles(true);
    setInfoforProfile(result);
    let pl = {
      tAUserID:result.taUserID,
      optiontype:optiontype,
      podID: selectedHead,
       "month":dateTypeFilter === 2 ? 0 : dateTypeFilter === 0 ? +moment(monthDate).format("M") : 0,
        "year": dateTypeFilter === 2 ? 0 : dateTypeFilter === 0 ? +moment(monthDate).format("YYYY") : 0,
        "fromDate": dateTypeFilter === 2 ? '' : dateTypeFilter === 1 ? startDate.toLocaleDateString("en-US"): '',
        "toDate": dateTypeFilter === 2 ? '' : dateTypeFilter === 1 ? endDate.toLocaleDateString("en-US"): '' ,
    };
    setLoadingTalentProfile(true);
    const hrResult = await TaDashboardDAO.getHRTalentsWiseRecruiterMultimonthDashboardDAO(pl);
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

   const getHeads = async () => {
    
  
      let filterResult = await ReportDAO.getAllPODGroupDAO();
    
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

  const handleSearchInput = (value) => {
    setSearchTerm(value); 
    const filteredData = hrTalentList.filter((talent) =>
      talent.talent.toLowerCase().includes(value.toLowerCase()) || 
      (talent.email && talent.email.toLowerCase().includes(value.toLowerCase())) 
    );
    setFilteredTalentList(filteredData); 
  };

  const saveRemark = async (d) => {
      let pl = {
        HiringRequestId: talentToMove?.hiringRequest_ID,
        CtpId: talentToMove?.ctpID,
        TalentId: talentToMove?.tA_UserID,
        Remark: d.remark,
      };
  
      setSaveRemarkLoading(true);
      const result = await InterviewDAO.updateTalentAssessmentDAO(pl);
      setSaveRemarkLoading(false);
      if (result.statusCode === HTTPStatusCode.OK) {
        setMoveToAssessment(false);
        resetRemarkField("remark");
        clearRemarkError("remark");
        getTalentProfilesDetailsfromTable(talentToMove, profileStatusID);
      } else {
        message.error("Something went wrong");
      }
    };

  function groupByRowSpan(data, groupField) {
    const grouped = {};

    // Step 1: Group by the field (e.g., 'ta')
    data.forEach((item) => {
      const key = item[groupField];
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });

    // Step 2: Add rowSpan metadata
    const finalData = [];
    Object.entries(grouped).forEach(([key, rows]) => {
      rows.forEach((row, index) => {
        finalData.push({
          ...row,
          rowSpan: index === 0 ? rows.length : 0,
        });
      });
    });

    return finalData;
  }

  const handleTalentExport = (data) => {

      let DataToExport = data.map((data) => {
          let obj = {};

//           if(isCarryForwardPipelineClicked){
// ProfileColumnsCarryForward.map(
//             (val) =>
//               val.title !== " " && (obj[`${val.title}`] = data[`${val.dataIndex}`])
//           );
//           }else{
//               ProfileColumns().map(
//             (val) =>
//               val.title !== " " && (obj[`${val.title}`] = data[`${val.dataIndex}`])
//           );
//           }
        ProfileColumns().map(
            (val) =>
              val.title !== " " && (obj[`${val.title}`] = data[`${val.dataIndex}`])
          );
          return obj;
        });
        downloadToExcel(DataToExport,`Recruiter-${profileInfo?.recruiter}`);
  }

  const tableColumnsMemo = useMemo(() => {
    return [
        // {
        //     title: "TA Head",
        //     dataIndex: "recruiterHead",
        //     key: "recruiterHead",
        //     align: "left",
        //     width: "160px",
        //     fixed: "left",
        //     render: (text,row, index) => {
        //      if( row.recruiter === 'Total'){return ''} 
        //        return { props: {
        //       rowSpan: row.rowSpan,
        //       style: { verticalAlign: "top" }, // This aligns the merged cell content to the top
        //     },
        //   children: text}
        //       },
        //   },
        {
            title: "TA",
            dataIndex: "recruiter",
            key: "recruiter",
            align: "left",
            width: "150px",
            fixed: "left",
            onCell: () => ({
              style: {
                backgroundColor: "#FAFAFA"
              }
            }),
            render: (text, result) => {
                return text === "Total" 
                  ? "" 
                  : text
              },
          },
      {
        title: "Revenue Goal",
        dataIndex: "revenueGoal",
        key: "revenueGoal",
        align: "center",
        width: "120px",
        render: (text, result) => {
          if (result.recruiter === 'Total') {
            return    <p
            //   style={{
            //     fontWeight: "bold",
            //     textDecoration: "underline",
            //     cursor: "pointer",
            //   }}
            //   onClick={() => {
            //     getTalentProfilesDetailsfromTable(result, 'T_RG');
            //   }}
            >
              {result.total_RevenueGoal ? result.total_RevenueGoal : ''}
            </p>
         
          }
          return +text > 0 ? (
            <p
            //   style={{
            //     color: "blue",
            //     fontWeight: "bold",
            //     textDecoration: "underline",
            //     cursor: "pointer",
            //   }}
            //   onClick={() => {
            //     getTalentProfilesDetailsfromTable(result, 'RG');
            //     // setTalentToMove(result);
            //     // setProfileStatusID(2);
            //     // setHRTalentListFourCount([]);
            //   }}
            >
              {text ? text : '-'}
            </p>
          ) : (
            text ? text : '-'
          );
        },
      },
      
  {
        title: <>Carry Forward <br/> Pipeline</>,
        dataIndex: "totalCarryForwardPipeline",
        key: "totalCarryForwardPipeline",
        align: "center",
        width: "150px",
        render: (text, result) => {
          if (result.recruiter === 'Total') {
            return    <p
              style={{
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result, 'T_TCF');
                setColTextVal(result.total_TotalCarryForwardPipeline)
                setIsCarryForwardPipelineClicked(true);
              }}
            >
              {result.total_TotalCarryForwardPipeline ? result.total_TotalCarryForwardPipeline : ''}
            </p>
         
          }
          return +text !== 0 ? (
            <p
              style={{
                color: "blue",
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result, 'TCF');
                setColTextVal(text)
                setIsCarryForwardPipelineClicked(true);
                // setTalentToMove(result);
                // setProfileStatusID(2);
                // setHRTalentListFourCount([]);
              }}
            >
              {text ? text : '-'}
            </p>
          ) : (
            text ? text : '-'
          );
        },
      },
    
         {
        title: <>Cur. Month <br/> Pipeline  </>,
        dataIndex: "currentMonthPipeline",
        key: "currentMonthPipeline",
        align: "center",
        width: "120px",
        render: (text, result) => {
          if (result.recruiter === 'Total') {
            return    <p
              style={{
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result, 'T_CMP');
                setColTextVal(result.total_CurrentMonthPipeline)
                 setIsCarryForwardPipelineClicked(true);
              }}
            >
              {result.total_CurrentMonthPipeline ? result.total_CurrentMonthPipeline : ''}
            </p>
         
          }
          return +text !== 0 ? (
            <p
              style={{
                color: "blue",
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result, 'CMP');
                setColTextVal(text)
                setIsCarryForwardPipelineClicked(true);
                // setTalentToMove(result);
                // setProfileStatusID(2);
                // setHRTalentListFourCount([]);
              }}
            >
              {text ? text : '-'}
            </p>
          ) : (
            text ? text : '-'
          );
        },
      }, 
     
      {
        title: <>Total Pipeline<br/> in a month </>,
        dataIndex: "totalPipelineInMonth",
        key: "totalPipelineInMonth",
        align: "center",
        width: "150px",
        render: (text, result) => {
          if (result.recruiter === 'Total') {
            return <p
              style={{
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result, 'T_TP');
                setColTextVal(result.total_TotalPipelineInMonth)
                 setIsCarryForwardPipelineClicked(true);
              }}
            >
              {result.total_TotalPipelineInMonth ? result.total_TotalPipelineInMonth : ''}
            </p>
          }
          return +text !== 0 ? (
            <p
              style={{
                color: "blue",
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result,'TP');
             setColTextVal(text)
              setIsCarryForwardPipelineClicked(true);
              }}
            >
              {text ? text : ''}
            </p>
          ) : (
            text ? text : ''
          );
        },
      },

      {
        title: <>Multiplier of <br/>Goal</>,
        dataIndex: "multiplierOfGoal",
        key: "multiplierOfGoal",
        align: "center",
        width: "100px",
        render: (text, result) => {
          if (result.recruiter === 'Total') {
            return <p
              style={{
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result, 'T_MG');
                setColTextVal(result.total_multiplierOfGoal)
                 setIsCarryForwardPipelineClicked(false);
              }}
            >
              {result.total_multiplierOfGoal ? result.total_multiplierOfGoal : ''}
            </p>
          }
          return +text > 0 ? (
            <p
            //   style={{
            //     color: "blue",
            //     fontWeight: "bold",
            //     textDecoration: "underline",
            //     cursor: "pointer",
            //   }}
            //   onClick={() => {
            //     getTalentProfilesDetailsfromTable(result,'MG');
              
            //   }}
            >
              {text ? text : ''}
            </p>
          ) : (
            text ? text : ''
          );
        },
      },
       {
        title: <># Profiles <br/> Shared</>,
        dataIndex: "numberProfilesShared",
        key: "numberProfilesShared",
        align: "center",
        width: "100px",
        render: (text, result) => {
          if (result.recruiter === 'Total') {
            return <p
              style={{
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result, 'T_P');
                setColTextVal(result.total_NumberProfilesShared)
                 setIsCarryForwardPipelineClicked(false);
              }}
            >
              {result.total_NumberProfilesShared ? result.total_NumberProfilesShared : ''}
            </p>
          }
          return +text > 0 ? (
            <p
              style={{
                color: "blue",
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result,'P');
              setColTextVal(text)
               setIsCarryForwardPipelineClicked(false);
              }}
            >
              {text ? text : ''}
            </p>
          ) : (
            text ? text : ''
          );
        },
      },
      {
        title: <>R1 Interview <br/> Completed</>,
        dataIndex: "r1InterviewCompleted",
        key: "r1InterviewCompleted",
        align: "center",
        width: "120px",
        render: (text, result) => {
         if (result.recruiter === 'Total') {
            return <p
              style={{
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result, 'T_R1');
                setColTextVal(result.total_R1InterviewCompleted)
                 setIsCarryForwardPipelineClicked(false);
              }}
            >
              {result.total_R1InterviewCompleted ? result.total_R1InterviewCompleted : ''}
            </p>
          }
          return +text > 0 ? (
            <p
              style={{
                color: "blue",
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result,'R1');
             setColTextVal(text)
              setIsCarryForwardPipelineClicked(false);
              }}
            >
              {text ? text : ''}
            </p>
          ) : (
            text ? text : ''
          );
        },
      },
      {
        title: <>R2 Interview <br/> Completed</>,
        dataIndex: "r2InterviewCompleted",
        key: "r2InterviewCompleted",
        align: "center",
       width: "120px",
        render: (text, result) => {
           if (result.recruiter === 'Total') {
            return <p
              style={{
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result, 'T_R2');
                setColTextVal(result.total_R2InterviewCompleted)
                 setIsCarryForwardPipelineClicked(false);
              }}
            >
              {result.total_R2InterviewCompleted ? result.total_R2InterviewCompleted : ''}
            </p>
          }
          return +text > 0 ? (
            <p
              style={{
                color: "blue",
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result,'R2');
             setColTextVal(text)
              setIsCarryForwardPipelineClicked(false);
              }}
            >
              {text ? text : ''}
            </p>
          ) : (
            text ? text : ''
          );
        } 
      },
     
      {
        title: <>R3 Interview <br/> Completed</>,
        dataIndex: "r3InterviewCompleted",
        key: "r3InterviewCompleted",
        align: "center",
        width: "120px",
        render: (text, result) => {
           if (result.recruiter === 'Total') {
            return <p
              style={{
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result, 'T_R3');
                setColTextVal(result.total_R3InterviewCompleted)
                 setIsCarryForwardPipelineClicked(false);
              }}
            >
              {result.total_R3InterviewCompleted ? result.total_R3InterviewCompleted : ''}
            </p>
          }
          return +text > 0 ? (
            <p
              style={{
                color: "blue",
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result,'R3');
             setColTextVal(text)
              setIsCarryForwardPipelineClicked(false);
              }}
            >
              {text ? text : ''}
            </p>
          ) : (
            text ? text : ''
          );
        } 
      },
      {
        title: <>Profile to <br/> R1 Ratio</>,
        dataIndex: "profileToR1Ratio",
        key: "profileToR1Ratio",
        align: "center",
        width: "100px",
       render: (text, result) => {
           if (result.recruiter === 'Total') {
            return <p
            //   style={{
            //     fontWeight: "bold",
            //     textDecoration: "underline",
            //     cursor: "pointer",
            //   }}
            //   onClick={() => {
            //     getTalentProfilesDetailsfromTable(result, 'T_PR1');
            //   }}
            >
              {result.total_profileToR1Ratio ? result.total_profileToR1Ratio : ''}
            </p>
          }
          return +text > 0 ? (
            <p
            //   style={{
            //     color: "blue",
            //     fontWeight: "bold",
            //     textDecoration: "underline",
            //     cursor: "pointer",
            //   }}
            //   onClick={() => {
            //     getTalentProfilesDetailsfromTable(result,'PR1');
             
            //   }}
            >
              {text ? text : ''}
            </p>
          ) : (
            text ? text : ''
          );
        } 
      },
      {
        title: <>No. of Talents <br/> rejected in <br/> interview</>,
        dataIndex: "talentsRejectedInInterview",
        key: "talentsRejectedInInterview",
        align: "center",
        width: "110px",
        render: (text, result) => {
           if (result.recruiter === 'Total') {
            return <p
              style={{
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result, 'T_TR');
                setColTextVal(result.total_TalentsRejectedInInterview)
                 setIsCarryForwardPipelineClicked(false);
              }}
            >
              {result.total_TalentsRejectedInInterview ? result.total_TalentsRejectedInInterview : ''}
            </p>
          }
          return +text > 0 ? (
            <p
              style={{
                color: "blue",
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result,'TR');
            setColTextVal(text)
             setIsCarryForwardPipelineClicked(false);
              }}
            >
              {text ? text : ''}
            </p>
          ) : (
            text ? text : ''
          );
        },
      },
    
      {
        title: <>Offer  Dropout/ <br/> Backout</>,
        dataIndex: "offerDropoutBackout",
        key: "offerDropoutBackout",
        align: "center",
        width: "120px",
       render: (text, result) => {
           if (result.recruiter === 'Total') {
            return <p
              style={{
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result, 'T_OD');
                setColTextVal(result.total_OfferDropoutBackout)
                 setIsCarryForwardPipelineClicked(false);
              }}
            >
              {result.total_OfferDropoutBackout ? result.total_OfferDropoutBackout : ''}
            </p>
          }
          return +text > 0 ? (
            <p
              style={{
                color: "blue",
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result,'OD');
            setColTextVal(text)
             setIsCarryForwardPipelineClicked(false);
              }}
            >
              {text ? text : ''}
            </p>
          ) : (
            text ? text : ''
          );
        },
      },
      {
        title: <>R1 to  Selected <br/> (I2S %)</>,
        dataIndex: "interviewToSelectedPercent",
        key: "interviewToSelectedPercent",
        align: "center",
        width: "150px",
       render: (text, result) => {
           if (result.recruiter === 'Total') {
            return <p
            //   style={{
            //     fontWeight: "bold",
            //     textDecoration: "underline",
            //     cursor: "pointer",
            //   }}
            //   onClick={() => {
            //     getTalentProfilesDetailsfromTable(result, 'T_I2S');
            //   }}
            >
              {result.total_interviewToSelectedPercent ? result.total_interviewToSelectedPercent : ''}
            </p>
          }
          return +text > 0 ? (
            <p
            //   style={{
            //     color: "blue",
            //     fontWeight: "bold",
            //     textDecoration: "underline",
            //     cursor: "pointer",
            //   }}
            //   onClick={() => {
            //     getTalentProfilesDetailsfromTable(result,'I2S');
            
            //   }}
            >
              {text ? text : ''}
            </p>
          ) : (
            text ? text : ''
          );
        },
      },
      {
        title: <>Offer Signed <br/> Revenue</>,
        dataIndex: "offerSignedRevenue",
        key: "offerSignedRevenue",
        align: "center",
       width: "120px",
       render: (text, result) => {
           if (result.recruiter === 'Total') {
            return <p
              style={{
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result, 'T_OSR');
                setColTextVal(result.total_OfferSignedRevenue)
                 setIsCarryForwardPipelineClicked(false);
                 setRevenueColumn(true)
              }}
            >
              {result.total_OfferSignedRevenue ? result.total_OfferSignedRevenue : ''}
            </p>
          }
          return +text !== 0 ? (
            <p
              style={{
                color: "blue",
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result,'OSR');
            setColTextVal(text)
             setIsCarryForwardPipelineClicked(false);
              setRevenueColumn(true)
              }}
            >
              {text ? text : ''}
            </p>
          ) : (
            text ? text : ''
          );
        },
      },
         {
        title: <>Joined Talents</>,
        dataIndex: "joinedTalentsInMonth",
        key: "joinedTalentsInMonth",
        align: "center",
        width: "130px",
       render: (text, result) => {
           if (result.recruiter === 'Total') {
            return <p
              style={{
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result, 'T_J');
                setColTextVal(result.total_JoinedTalentsInMonth)
                 setIsCarryForwardPipelineClicked(false);
                  setRevenueColumn(true)
              }}
            >
              {result.total_JoinedTalentsInMonth ? result.total_JoinedTalentsInMonth : ''}
            </p>
          }
          return +text !== 0 ? (
            <p
              style={{
                color: "blue",
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result,'J');
            setColTextVal(text)
             setIsCarryForwardPipelineClicked(false);
              setRevenueColumn(true)
              }}
            >
              {text ? text : ''}
            </p>
          ) : (
            text ? text : ''
          );
        },
      },
         {
        title: <>Joining <br/> Revenue</>,
        dataIndex: "joiningRevenue",
        key: "joiningRevenue",
        align: "center",
       width: "120px",
       render: (text, result) => {
           if (result.recruiter === 'Total') {
            return <p
              style={{
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result, 'T_JR');
                setColTextVal(result.total_JoiningRevenue)
                 setIsCarryForwardPipelineClicked(false);
                  setRevenueColumn(true)
              }}
            >
              {result.total_JoiningRevenue ? result.total_JoiningRevenue : ''}
            </p>
          }
          return +text !== 0 ? (
            <p
              style={{
                color: "blue",
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                getTalentProfilesDetailsfromTable(result,'JR');
            setColTextVal(text)
             setIsCarryForwardPipelineClicked(false);
              setRevenueColumn(true)
              }}
            >
              {text ? text : ''}
            </p>
          ) : (
            text ? text : ''
          );
        },
      },
         {
        title: <>Goal Vs <br/> Achieved</>,
        dataIndex: "goalVsAchievedPercent",
        key: "goalVsAchievedPercent",
        align: "center",
       width: "120px",
       render: (text, result) => {
           if (result.recruiter === 'Total') {
            return <p
            //   style={{
            //     fontWeight: "bold",
            //     textDecoration: "underline",
            //     cursor: "pointer",
            //   }}
            //   onClick={() => {
            //     getTalentProfilesDetailsfromTable(result, 'T_GVA');
            //   }}
            >
              {result.total_goalVsAchievedPercent ? result.total_goalVsAchievedPercent : ''}
            </p>
          }
          return +text > 0 ? (
            <p
            //   style={{
            //     color: "blue",
            //     fontWeight: "bold",
            //     textDecoration: "underline",
            //     cursor: "pointer",
            //   }}
            //   onClick={() => {
            //     getTalentProfilesDetailsfromTable(result,'GVA');
            
            //   }}
            >
              {text ? text : ''}
            </p>
          ) : (
            text ? text : ''
          );
        },
      },
         {
        title: <>Total Pipeline <br/> to Joining % </>,
        dataIndex: "totalPipelineToJoiningPercent",
        key: "totalPipelineToJoiningPercent",
        align: "center",
        width: "120px",
       render: (text, result) => {
           if (result.recruiter === 'Total') {
            return <p
            //   style={{
            //     fontWeight: "bold",
            //     textDecoration: "underline",
            //     cursor: "pointer",
            //   }}
            //   onClick={() => {
            //     getTalentProfilesDetailsfromTable(result, 'T_TPJ');
            //   }}
            >
              {result.total_totalPipelineToJoiningPercent ? result.total_totalPipelineToJoiningPercent : ''}
            </p>
          }
          return +text > 0 ? (
            <p
            //   style={{
            //     color: "blue",
            //     fontWeight: "bold",
            //     textDecoration: "underline",
            //     cursor: "pointer",
            //   }}
            //   onClick={() => {
            //     getTalentProfilesDetailsfromTable(result,'TPJ');
            
            //   }}
            >
              {text ? text : ''}
            </p>
          ) : (
            text ? text : ''
          );
        },
      },
    ];
  }, [clientData]);
  

  const getClientDashboardReport = async () => {
    let payload = {
        "searchText": openTicketSearchText,
        "month":dateTypeFilter === 2 ? 0 : dateTypeFilter === 0 ? +moment(monthDate).format("M") : 0,
        "year": dateTypeFilter === 2 ? 0 : dateTypeFilter === 0 ? +moment(monthDate).format("YYYY") : 0,
        "fromDate": dateTypeFilter === 2 ? '' : dateTypeFilter === 1 ? startDate.toLocaleDateString("en-US"): '',
        "toDate": dateTypeFilter === 2 ? '' : dateTypeFilter === 1 ? endDate.toLocaleDateString("en-US"): '' ,
        // "pageIndex": pageIndex,
        // "pageSize": pageSize,
        "taUserIDs":tableFilteredState?.filterFields_OnBoard?.taUserIDs   ??'',
             "pod_id": selectedHead ?? null
      };
    setLoading(true)
    let query=`?monthStr=${payload.month}&yearStr=${payload.year}&search=${payload.searchText}&pod_id=${payload.pod_id}`
    const apiResult = await ReportDAO.getRecruiterDashboardMonthlyReportDAO(query);
    setLoading(false)
    if (apiResult?.statusCode === 200) {        
      setClientData(groupByRowSpan(apiResult.responseBody, "recruiterHead") );      
      setListDataCount(apiResult.responseBody?.length);      
    } else if (apiResult?.statusCode === 404) {
        setClientData([]);
        setListDataCount(0);     
    }
  }; 

  const getTalentProfilesDetails = async (result, statusID, stageID) => {
      setShowTalentProfiles(true);
      setInfoforProfile(result);
      let pl = {
        hrID: result?.hrid,
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

  const onCalenderFilter = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    // if (start?.toLocaleDateString() === end?.toLocaleDateString()) {
    //   let params = {
    //     fromDate: firstDayOfMonth,
    //     toDate: today,
    //   }
    //   setStartDate(params.fromDate);
    //   setEndDate(params.toDate);
    //   return;
    // }    
  };

  useEffect(() => {
    if(selectedHead){
      getClientDashboardReport();
    }
    
  }, [pageIndex, pageSize, openTicketSearchText,tableFilteredState,monthDate,startDate,endDate,selectedHead]);


  useEffect(() => {
    const timer = setTimeout(
      () => {
        setPageIndex(1)
        setopenTicketSearchText(openTicketDebounceText)},
      1000
    );
    return () => clearTimeout(timer);
  }, [openTicketDebounceText]);




 const toggleHRFilter = useCallback(() => {
      !getHTMLFilter
        ? setIsAllowFilters(!isAllowFilters)
        : setTimeout(() => {
            setIsAllowFilters(!isAllowFilters);
          }, 300);
      setHTMLFilter(!getHTMLFilter);
    }, [getHTMLFilter, isAllowFilters]);

  const clearFilters = () =>{
    setAppliedFilters(new Map());
      setCheckedState(new Map());
      setFilteredTagLength(0);
      setTableFilteredState({
        filterFields_OnBoard: {
          taUserIDs: null,
        },
      }); 
      //  setSelectedHead("");
      setopenTicketSearchText("");
      setopenTicketDebounceText("");  
      setStartDate(firstDayOfMonth);
      setMonthDate(today)
      setEndDate(today);  
      setDateTypeFilter(0);
  }
const exportColumns = [
  { header: "TA", key: "recruiter" },
  { header: "Revenue Goal", key: "revenueGoal" },
  { header: "Current Month Pipeline", key: "currentMonthPipeline" },
  { header: "Total Carry Forward Pipeline", key: "totalCarryForwardPipeline" },
  { header: "Total Pipeline in Month", key: "totalPipelineInMonth" },
  { header: "Multiplier of Goal", key: "multiplierOfGoal" },
  { header: "Profiles Shared", key: "numberProfilesShared" },
  { header: "R1 Interview Completed", key: "r1InterviewCompleted" },
  { header: "R2 Interview Completed", key: "r2InterviewCompleted" },
  { header: "R3 Interview Completed", key: "r3InterviewCompleted" },
  { header: "Profile to R1 Ratio", key: "profileToR1Ratio" },
  { header: "Talents Rejected in Interview", key: "talentsRejectedInInterview" },
  { header: "Offer Dropout / Backout", key: "offerDropoutBackout" },
  { header: "R1 to Selected (I2S %)", key: "interviewToSelectedPercent" },
  { header: "Offer Signed Revenue", key: "offerSignedRevenue" },
  { header: "Joined Talents", key: "joinedTalentsInMonth" },
  { header: "Joining Revenue", key: "joiningRevenue" },
  { header: "Goal vs Achieved %", key: "goalVsAchievedPercent" },
  { header: "Pipeline to Joining %", key: "totalPipelineToJoiningPercent" }
];
const getExportData = (data) => {
  return data.map((row) => {
    const isTotal = row.recruiter === "Total";

    return {
      recruiter: isTotal ? "" : row.recruiter,

      revenueGoal: isTotal ? row.total_RevenueGoal : row.revenueGoal,
      currentMonthPipeline: isTotal ? row.total_CurrentMonthPipeline : row.currentMonthPipeline,
      totalCarryForwardPipeline: isTotal ? row.total_TotalCarryForwardPipeline : row.totalCarryForwardPipeline,
      totalPipelineInMonth: isTotal ? row.total_TotalPipelineInMonth : row.totalPipelineInMonth,
      multiplierOfGoal: isTotal ? row.total_multiplierOfGoal : row.multiplierOfGoal,
      numberProfilesShared: isTotal ? row.total_NumberProfilesShared : row.numberProfilesShared,
      r1InterviewCompleted: isTotal ? row.total_R1InterviewCompleted : row.r1InterviewCompleted,
      r2InterviewCompleted: isTotal ? row.total_R2InterviewCompleted : row.r2InterviewCompleted,
      r3InterviewCompleted: isTotal ? row.total_R3InterviewCompleted : row.r3InterviewCompleted,
      profileToR1Ratio: isTotal ? row.total_profileToR1Ratio : row.profileToR1Ratio,
      talentsRejectedInInterview: isTotal ? row.total_TalentsRejectedInInterview : row.talentsRejectedInInterview,
      offerDropoutBackout: isTotal ? row.total_OfferDropoutBackout : row.offerDropoutBackout,
      interviewToSelectedPercent: isTotal ? row.total_interviewToSelectedPercent : row.interviewToSelectedPercent,
      offerSignedRevenue: isTotal ? row.total_OfferSignedRevenue : row.offerSignedRevenue,
      joinedTalentsInMonth: isTotal ? row.total_JoinedTalentsInMonth : row.joinedTalentsInMonth,
      joiningRevenue: isTotal ? row.total_JoiningRevenue : row.joiningRevenue,
      goalVsAchievedPercent: isTotal ? row.total_goalVsAchievedPercent : row.goalVsAchievedPercent,
      totalPipelineToJoiningPercent: isTotal ? row.total_totalPipelineToJoiningPercent : row.totalPipelineToJoiningPercent,
    };
  });
};

  const handleExport = (apiData) => {
 const exportData = getExportData(clientData);

  const headers = exportColumns.map(col => col.header);

  const rows = exportData.map(row =>
    exportColumns.map(col => row[col.key] ?? "")
  );

  const finalData = [headers, ...rows]; // ✅ add headers row

      downloadToExcel(finalData,'Recruiter_Dashboard_Monthly_Report')  
  }

  return (
    <div className={clientDashboardStyles.hiringRequestContainer}>
      
      <div className={clientDashboardStyles.addnewHR} style={{ margin: "0" }}>
        <div className={clientDashboardStyles.hiringRequest}>Recruiter Dashboard</div>
      </div>

      <div className={clientDashboardStyles.filterContainer}>
        <div className={clientDashboardStyles.filterSets}>
        <div className={clientDashboardStyles.filterSetsInner}>
            <div className={clientDashboardStyles.filterSetsInner2}>
   <Radio.Group
              onChange={(e) => {
                setHRModal(e.target.value);
                if (e.target.value === "Contract") {
                  let val = pODList.find(
                    (i) => i.dd_text === "Orion"
                  )?.dd_value;
                  setSelectedHead(val);
               
                } else {
                  let val = pODList[0]?.dd_value;
                  setSelectedHead(val);
              
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
            </div>
                                  

                    {/* <div className={clientDashboardStyles.searchFilterSet} style={{marginLeft:'10px',width:'225px'}}>
                      <SearchSVG style={{ width: "16px", height: "16px" }} />
                      <input
                        type={InputType.TEXT}
                        className={clientDashboardStyles.searchInput}
                        placeholder="Search, Recruiter"
                        value={openTicketDebounceText}
                        onChange={(e) => {
                          setopenTicketDebounceText(e.target.value);
                        }}
                      />
                      {openTicketDebounceText && (
                        <CloseSVG
                          style={{
                            width: "16px",
                            height: "16px",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setopenTicketDebounceText("");
                          }}
                        />
                      )}
                    </div> */}

                    <p
                      className={clientDashboardStyles.resetText}
                      // style={{ width: "190px" }}
                      onClick={() => {
                        clearFilters();
                      }}
                    >
                      Reset Filter
                    </p>             
                </div>

              <div style={{display:'flex',justifyContent:'center',alignItems:"center"}}>
                {/* <div style={{display:"flex",justifyContent:'center',marginRight:"10px"}}>
                  <Select
                    id="selectedValue"
                    placeholder="Select"
                    value={dateTypeFilter}                    
                    style={{width:"180px",height:"48px"}}
                    onChange={(value, option) => {
                      setDateTypeFilter(value);
                      setStartDate(firstDayOfMonth);
                      setEndDate(new Date(date));
                    }}
                    options={[
                      // {value: 2,label: 'No Dates'},
                      {value: 0,label: 'By Month'},{value: 1,label: 'With Date Range'}]}
                    optionFilterProp="value"
                  />
                </div> */}
                {dateTypeFilter === 0 && (
                  <div style={{display:'flex',justifyContent:'space-evenly',alignItems:'center',gap:'8px'}}> 
                    <div>
                      Month-Year
                    </div>
                    <div className={ClientReportStyle.calendarFilter}> 
                      <CalenderSVG style={{ height: "16px", marginRight: "16px" }} />
                      <DatePicker
                              style={{ backgroundColor: "red" }}
                              onKeyDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              className={ClientReportStyle.dateFilter}
                              placeholderText="Month - Year"
                              selected={monthDate}
                              onChange={date=>setMonthDate(date)}
                              dateFormat="MM-yyyy"
                              showMonthYearPicker
                            />
                    </div>
                  </div>
                )}
                {dateTypeFilter === 1 && (
                  <div style={{display:'flex',justifyContent:'space-evenly',alignItems:'center',gap:'8px'}}>
                    <div>Date</div>
                    <div className={ClientReportStyle.calendarFilter}>                       
                    <CalenderSVG style={{ height: "16px", marginRight: "16px" }} />
                    <DatePicker
                      style={{ backgroundColor: "red" }}
                      onKeyDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className={ClientReportStyle.dateFilter}
                      placeholderText="Start date - End date"
                      selected={startDate}
                      onChange={onCalenderFilter}
                      startDate={startDate}
                      endDate={endDate}
                      maxDate={new Date()}
                      selectsRange
                    />
                  </div>
                  </div>
                )}                
              
                {/* <div className={clientDashboardStyles.priorityFilterSet}>                
                  <div className={clientDashboardStyles.label}>
                    Showing
                  </div>                
                  <div className={clientDashboardStyles.paginationFilter}>
                    <Dropdown
                      trigger={["click"]}
                      placement="bottom"
                      overlay={
                        <Menu
                          onClick={(e) => {
                            setPageSize(parseInt(e.key));                                   
                          }}
                        >
                          {pageSizeOptions.map((item) => {
                            return (
                              <Menu.Item key={item}>{item}</Menu.Item>
                            );
                          })}
                        </Menu>
                      }
                    >
                      <span>
                        {pageSize}
                        <IoChevronDownOutline
                          style={{
                            paddingTop: "5px",
                            fontSize: "16px",
                          }}
                        />
                      </span>
                    </Dropdown>
                  </div>                  
                </div> */}

                <div
                  className={clientDashboardStyles.paginationFilter}
                  style={{ border: "none", width: "auto" }}
                >
                  <button
                    className={clientDashboardStyles.btnPrimary}
                    onClick={() =>handleExport(clientData)}
                  >
                    Export
                  </button>
                </div>              
              </div>              
        </div>
      </div>

      {isLoading ? <TableSkeleton /> :
       <div className={clientDashboardStyles.tableWrapperCustom}>
        <Table
        scroll={{ y: "480px" }}
        id="TicketsOpenListingTable"
        columns={tableColumnsMemo}
        bordered={false}
        dataSource={clientData.length > 0 ? [{...clientData[0],recruiter:'Total'},...clientData] : clientData}   
        rowKey={(record, index) => index}
        rowClassName={(row, index) => {
            return row.recruiter === 'Total' ? clientDashboardStyles["highlight-total-row"] : '';
        }}   
 pagination={false}
          // pagination={{
          //   onChange: (pageNum, pageSize) => {
          //     setPageIndex(pageNum);
          //     setPageSize(pageSize - 1);
          //   },
          //   size: "small",
          //   pageSize: pageSize + 1,
          //   pageSizeOptions: pageSizeOptions,
          //   total: listDataCount,
          //   showTotal: (total, range) =>
          //     `${range[0]}-${range[1]} of ${listDataCount} items`,
          //   current: pageIndex,
          // }}  
      />
      </div>
      }




              {showTalentProfiles && (
                    <Modal
                      transitionName=""
                      width="1020px"
                      centered
                      footer={null}
                      open={showTalentProfiles}
                      className="engagementModalStyle"
                      onCancel={() => {
                        setSearchTerm('')
                        setShowTalentProfiles(false);
                         setIsCarryForwardPipelineClicked(false);
                          setRevenueColumn(false)
                        setHRTalentListFourCount([]);
                        setFilteredTalentList([]);
                      }}
                    >
                      {isModalLoading ?  
                        <div style={{display:"flex",height:"350px",justifyContent:'center'}}>
                          <Spin size="large"/>
                        </div>:
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
                          {console.log('profileInfo',profileInfo)}
                         
            
                          <p style={{ marginBottom: "0.5em" , marginLeft:'5px'}}>
                            TA : <strong>{profileInfo?.recruiter}</strong> ({colTextVal})
                          </p>
             
                          <input
                            type="text"
                            placeholder="Search talent..."
                            value={searchTerm}
                            onChange={(e) => handleSearchInput(e.target.value)}
                            style={{
                                padding: "6px 10px",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                marginLeft: "auto", 
                                marginRight:"20px",
                                minWidth: "260px",
                            }}
                          />

                          <button
                    className={clientDashboardStyles.btnPrimary}
                    style={{height:'35px',padding:'5px 10px'}}
                    onClick={() =>handleTalentExport(filteredTalentList)}
                  >
                    Export
                  </button>
                      </div>           
            
            
                        {loadingTalentProfile ? (
                          <div>
                            <Skeleton active />
                          </div>
                        ) : (
                          <div style={{ margin: "5px 10px" }}>
                            <Table
                              dataSource={filteredTalentList}
                              columns={ProfileColumns()}
                              pagination={false}
                              scroll={{ y: "480px" }}
                            />
                          </div>
                        )}
            
                        {moveToAssessment && (
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
                        )}
            
                        <div style={{ padding: "10px 0" }}>
                          <button
                            className={taStyles.btnCancle}
                            disabled={isAddingNewTask}
                            onClick={() => {
                              setSearchTerm('')
                              setShowTalentProfiles(false);
                              setIsCarryForwardPipelineClicked(false);
                              setRevenueColumn(false)
                              setHRTalentListFourCount([]);
                              setFilteredTalentList([]);
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </>}
                    </Modal>
                  )}
    </div>
  );
}
