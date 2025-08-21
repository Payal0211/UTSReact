import React, { Suspense, useCallback, useEffect, useState } from "react";
import amReportStyles from "./amReport.module.css";
import { Table, Radio, message, Select, Tooltip, Modal, Skeleton, Spin } from "antd";
import { ReportDAO } from "core/report/reportDAO";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import { ReactComponent as SearchSVG } from "assets/svg/search.svg";
import { InputType } from "constants/application";
import { ReactComponent as CloseSVG } from "assets/svg/close.svg";
import DatePicker from "react-datepicker";
import moment from "moment";
import { ReactComponent as FunnelSVG } from "assets/svg/funnel.svg";
import OnboardFilerList from "modules/onBoardList/OnboardFilterList";
import { allHRConfig } from "modules/hiring request/screens/allHiringRequest/allHR.config";
import { allEngagementConfig } from "modules/engagement/screens/engagementList/allEngagementConfig";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import Diamond from "assets/svg/diamond.svg";
import { All_Hiring_Request_Utils } from "shared/utils/all_hiring_request_util";
import { IoMdAddCircle } from "react-icons/io";
import { IconContext } from "react-icons";
import { HTTPStatusCode } from "constants/network";
import { TaDashboardDAO } from "core/taDashboard/taDashboardDRO";
import spinGif from "assets/gif/RefreshLoader.gif";
import Editor from "modules/hiring request/components/textEditor/editor";
import { UserSessionManagementController } from "modules/user/services/user_session_services";
 
// const columns = [
//   {
//     title: 'Client Name',
//     dataIndex: 'clientName',
//     key: 'clientName',
//     width: 160,
//     render: (text, result) => {
//       return text === "TOTAL"
//         ? ""
//         : <a href={`/viewCompanyDetails/${result.clientID}`} style={{ textDecoration: 'underline' }} target="_blank" rel="noreferrer">{text}</a>;
//     },
//   },
//   {
//     title: 'Position Name',
//     dataIndex: 'positionName',
//     key: 'positionName',
//     width: 160,
//     render: (text, result) => {
//       return text
//         ? <a href={`/allhiringrequest/${result.hrid}`} style={{ textDecoration: 'underline' }} target="_blank" rel="noreferrer">{text}</a>
//         : text;
//     },
//   },
//   {
//     title: 'AM Name',
//     dataIndex: 'amName',
//     key: 'amName',
//     width: 120,
//     render: (value) => value ? value : '-',
//   },
//   {
//     title: <>Revenue<br/>(Margin)</>,
//     dataIndex: 'revenueMargin',
//     key: 'revenueMargin',
//     width: 120,
//     render: (value) => value ? value : '-',
//   },
//   {
//     title: <>Probability <br/> Ratio</>,
//     dataIndex: 'probability',
//     key: 'probability',
//     width: 100,
//   },
//   {
//     title: 'Average',
//     dataIndex: 'average',
//     key: 'average',
//     width: 80,
//     render: (value) => value ? value : '-',
//   },
//   {
//     title:<>No. of<br/>Interviews</>,
//     dataIndex: 'interviews',
//     key: 'interviews',
//     width: 80,
//     render: (value) => Number(value) ? value : '-',
//   },
//   {
//     title:<>Profiles<br/> Needed By</>,
//     dataIndex: 'profilesNeededBy',
//     key: 'profilesNeededBy',
//     width: 120,
//     render: (value) => value ? value : '-',
//   },
//   {
//     title: <>Client <br/>Response By</>,
//     dataIndex: 'clientResponseBy',
//     key: 'clientResponseBy',
//     width: 120,
//     render: (value) => value ? value : '-',
//   },
//   ...[1, 2, 3, 4, 5].map((week, i) => ({
//     title: `W${week}`,
//     dataIndex: ['weekData', i],
//     key: `week${week}`,
//     width: 100,
//     render: (value) => value ? value : '-',
//   })),
// ];

const { Option } = Select;

const AMReport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [isSummeryLoading, setIsSummeryLoading] = useState(false);
  const [summeryReportData, setSummeryReportData] = useState([]);
  const [summeryGroupsNames, setSummeryGroupsName] = useState([]);
  const today = new Date();
  const [monthDate, setMonthDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [openTicketDebounceText, setopenTicketDebounceText] = useState("");
  const [getHTMLFilter, setHTMLFilter] = useState(false);
  const [isAllowFilters, setIsAllowFilters] = useState(false);
  const [filteredTagLength, setFilteredTagLength] = useState(0);
  const [appliedFilter, setAppliedFilters] = useState(new Map());
  const [checkedState, setCheckedState] = useState(new Map());
  const [tableFilteredState, setTableFilteredState] = useState({
    filterFields_OnBoard: {
      text: '',
      EngType: "",
    },
  });
  var date = new Date();
    const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(1);
  const [startDate, setStartDate] = useState(
   firstDayOfMonth
  );
  const [dateTypeFilter, setDateTypeFilter] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtersList, setFiltersList] = useState([]);
  const [showTalentProfiles, setShowTalentProfiles] = useState(false);
  const [profileInfo, setInfoforProfile] = useState({});
  const [loadingTalentProfile, setLoadingTalentProfile] = useState(false);
  const [hrTalentList, setHRTalentList] = useState([]);
  const [summeryTitles,setSummertTitles] = useState({})
  const [hrTalentListFourCount, setHRTalentListFourCount] = useState([]);
  const [filteredTalentList, setFilteredTalentList] = useState(hrTalentList);
  const [profileStatusID, setProfileStatusID] = useState(0);
  const [talentToMove, setTalentToMove] = useState({});

  const [showComment, setShowComment] = useState(false);
  const [commentData, setCommentData] = useState({});
  const [allCommentList, setALLCommentsList] = useState([]);
  const [isCommentLoading, setIsCommentLoading] = useState(false);

  const [summeryDetails, setSummeryDetails] = useState([]);
  const [showSummeryDetails, setShowSummeryDetails] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false); 
  const [showResponse,setShowResponse] = useState(false)
  const [responseData,setResponseData] = useState({})
  const [round,setRound] = useState('')
  const [roundDate,setRoundDate] = useState('')
  const [loadingResponse,setLoadingResponse] = useState(false)
  const [responseSubmit,setResponseSubmit] = useState(false)

    const [userData, setUserData] = useState({});
      
    useEffect(() => {
      const getUserResult = async () => {
        let userData = UserSessionManagementController.getUserSession();
        if (userData) setUserData(userData);
      };
      getUserResult();
    }, []);


  useEffect(() => {
    getAMReportFilter();
  }, []);

  useEffect(() => {
    getAMReportData();
  }, [openTicketDebounceText, monthDate, tableFilteredState,endDate,startDate]);

  const getAMReportFilter = async () => {
    setIsLoading(true);
    const filterResult = await ReportDAO.getAMReportFilterDAO();
    setIsLoading(false);
    if (filterResult.statusCode === 200) {
      setFiltersList(filterResult?.responseBody || []);
    } else if (filterResult?.statusCode === 404) {
      setFiltersList({});
    }
  };

  const getAMReportData = async () => {
    let payload = {
      searchText: openTicketDebounceText,
      "month":dateTypeFilter === 2 ? 0 : dateTypeFilter === 0 ? +moment(monthDate).format("M") : 0,
      "year": dateTypeFilter === 2 ? 0 : dateTypeFilter === 0 ? +moment(monthDate).format("YYYY") : 0,
      "fromDate": dateTypeFilter === 2 ? '' : dateTypeFilter === 1 ?  moment(startDate).format('YYYY-MM-DD') : '',
      "toDate": dateTypeFilter === 2 ? '' : dateTypeFilter === 1 ?  moment(endDate).format('YYYY-MM-DD'): '' ,
      "amUserIDs": tableFilteredState?.filterFields_OnBoard?.text,
      hrType: tableFilteredState?.filterFields_OnBoard?.EngType,
      hrStatus: "",
      salesRep: tableFilteredState?.filterFields_OnBoard?.text ?? "",
      leadType: "",
      hr_BusinessType: "G",
    };
    setIsLoading(true);
    const apiResult = await ReportDAO.getAMReportDAO(payload);
    setIsLoading(false);
    if (apiResult?.statusCode === 200) {
      setReportData(apiResult.responseBody);
    } else if (apiResult?.statusCode === 404) {
      setReportData([]);
    }
  };

  const getAMSummary = async () => {
    let pl = {
      hr_BusinessType: "G",
      //   "month": +moment(monthDate).format("M") ,
      // "year":  +moment(monthDate).format("YYYY"),
      "month":dateTypeFilter === 2 ? 0 : dateTypeFilter === 0 ? +moment(monthDate).format("M") : 0,
      "year": dateTypeFilter === 2 ? 0 : dateTypeFilter === 0 ? +moment(monthDate).format("YYYY") : 0,
      "fromDate": dateTypeFilter === 2 ? '' : dateTypeFilter === 1 ?  moment(startDate).format('YYYY-MM-DD') : '',
      "toDate": dateTypeFilter === 2 ? '' : dateTypeFilter === 1 ?  moment(endDate).format('YYYY-MM-DD'): '' ,
    };

    setIsSummeryLoading(true);
    const apiResult = await ReportDAO.getAMSummeryReportDAO(pl);
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

  useEffect(() => {
    getAMSummary();
  }, [monthDate, startDate,endDate]);

  const toggleHRFilter = useCallback(() => {
    !getHTMLFilter
      ? setIsAllowFilters(!isAllowFilters)
      : setTimeout(() => {
          setIsAllowFilters(!isAllowFilters);
        }, 300);
    setHTMLFilter(!getHTMLFilter);
  }, [getHTMLFilter, isAllowFilters]);

  const clearFilters = () => {
    setAppliedFilters(new Map());
    setCheckedState(new Map());
    setFilteredTagLength(0);
    setopenTicketDebounceText("");
    setMonthDate(new Date());
    setTableFilteredState({
      filterFields_OnBoard: {
        text: '',
      EngType: "",
      },
    });
      setStartDate(firstDayOfMonth);
      setEndDate(today);  
      setDateTypeFilter(0);
  };

  const renderDDSelect = (value, record, index, dataIndex, handleChange) => {
    return (
      <Select
        value={value}
        onChange={(newValue) =>
          handleChange(newValue, record, index, dataIndex)
        }
        style={{ width: "100%" }}
        size="small"
      >
        <Option value="100%">100%</Option>
        <Option value="75%">75%</Option>
        <Option value="50%">50%</Option>
        <Option value="25%">25%</Option>
        <Option value="0%">0%</Option>
        <Option value="Preonboarding">Preonboarding</Option>
        <Option value="Lost">Lost</Option>
        <Option value="Won">Won</Option>
        <Option value="Pause">Pause</Option>
        <Option value="Backed out">Backed out</Option>
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
    const updatedData = [...reportData];
    updatedData[index] = { ...record, [field]: newValue };
    setReportData(updatedData);
    // if (field === "productType" || field === "potentialType") {
      updatePotentialClosuresRowValue(updatedData[index]);
    // }
  };

    const updatePotentialClosuresRowValue = async (updatedData) => {
      const pl = {
        PotentialCloserList_ID: updatedData.potentialCloserList_ID,
        HRID: updatedData?.hiringRequest_ID,
        ProbabiltyRatio_thismonth:updatedData?.probabiltyRatio_thismonth,
        Expected_Closure_Week:updatedData?.expected_Closure_Week,
        Actual_Closure_Week:updatedData?.actual_Closure_Week,
        // Pushed_Closure_Week:updatedData?.pushed_Closure_Week,
        Talent_NoticePeriod:updatedData?.talent_NoticePeriod,
        Talent_Backup:updatedData?.talent_Backup,
        // OwnerID:updatedData?.owner_UserID
      };
  
      await ReportDAO.PotentialClosuresUpdateDAO(pl);
    };

    const getAllComments = async (d, modal) => {
      setIsCommentLoading(true);
      const pl = {  
        potentialCloserListID: d.potentialCloserList_ID,
        hrID  :d.hiringRequest_ID,
      };
      const result = await ReportDAO.getALLPotentialClosuresCommentsDAO(pl);
      setIsCommentLoading(false);
      if (result.statusCode === HTTPStatusCode.OK) {
        setALLCommentsList(result.responseBody);
      } else {
        setALLCommentsList([]);
      }
    };

  const AddComment = (data, modal) => {
    getAllComments(data, modal);
    setShowComment(true);
    setCommentData(data);
  };

     const saveComment = async (note) => {
        let pl = {
        PotentialCloserList_ID: commentData.potentialCloserList_ID,
        HR_ID   :commentData.hiringRequest_ID,
  
          loggedInUserID: userData?.UserId,
          comments: note,
        };
        setIsCommentLoading(true);
        const res = await ReportDAO.insertPotentialClosureCommentRequestDAO(pl);
        setIsCommentLoading(false);
        if (res.statusCode === HTTPStatusCode.OK) {
          setALLCommentsList(res.responseBody);
          let comments = res.responseBody.map(re=> re.comments)
          setReportData(prev=>{
            let nArr = [...prev]
            nArr[commentData.index] = {...nArr[commentData.index], potentialList_Comments: comments.slice(0,5).join("~")}
            return nArr
          })
        }
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

  const AddResponse = (data)=>{
    setShowResponse(true)
    setResponseData(data)
  }

  const commentColumn = [
    {title:"Created By",
      dataIndex: "createdByDatetime",
      key: "createdByDatetime",
       width:'200px'
    },
    {title:"Comment",
      dataIndex: "comments",
      key: "comments",
      render:(text)=>{
        return <div  dangerouslySetInnerHTML={{ __html: text }}></div>
      }
    },
     {title:"Added By",
      dataIndex: "addedBy",
      key: "addedBy",
      width:'200px'
    },
  ]

  const getSummeryDetails = async (val, col) => {
    let pl = {
      hr_BusinessType: "G",
      month: monthDate ? +moment(monthDate).format("M") : 0,
      year: monthDate ? +moment(monthDate).format("YYYY") : 0,
      groupName: val.groupName,
      am_ColumnName: col,
      stage_ID: val.stage_ID,
    };
    setShowSummeryDetails(true);
    setLoadingTalentProfile(true);
    setSummertTitles({...val,col})
    const res = await ReportDAO.getTAReportSummeryDetailsDAO(pl);
    setLoadingTalentProfile(false);
    if (res.statusCode === HTTPStatusCode.OK) {
      setSummeryDetails(res.responseBody);
    } else {
      setSummeryDetails([]);
    }
  };

  const columns = [
     {
      title: <div >Company</div>,
      dataIndex: "company",
      key: "company",
      width: 150,
      fixed: "left",
      className: amReportStyles.headerCell,
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
      title: (
        <div >
          Open
          <br />
          since how <br /> many
          <br /> days
        </div>
      ),
      dataIndex: "hrOpenSinceDays",
      key: "hrOpenSinceDays",
      fixed: "left",
      width: 90,
      align: "center",
      className: amReportStyles.headerCell,
    },
     {
      title: <div style={{ textAlign: "center" }}>HR #</div>,
      dataIndex: "hR_Number",
      key: "hR_Number",
      width: 180,
      fixed: "left",
      className: amReportStyles.headerCell,
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
      title: <div style={{ textAlign: "center" }}>Position</div>,
      dataIndex: "position",
      key: "position",
      fixed: "left",
      width: 180,
    },
     {
      title: (
        <div style={{ textAlign: "center" }}>
          Uplers Fees
          <br />
          (USD)
        </div>
      ),
      dataIndex: "averageValue",
      key: "averageValue",
      width: 120,
      align: "right",
       fixed: "left",
      className: amReportStyles.headerCell,
    },
       {
      title: <div style={{ textAlign: "center" }}>HR Status</div>,
      dataIndex: "hrStatus",
      key: "hrStatus",
  
      className: amReportStyles.headerCell,
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
        <div style={{ textAlign: "center" }}>
          Engagement <br /> Model
        </div>
      ),
      dataIndex: "hrModel",
      key: "hrModel",
      width: 120,
      // fixed: "left",
      className: amReportStyles.headerCell,
    },
       {
      title: (
        <div style={{ textAlign: "center" }}>
          No Of <br />
          Interview Rounds
        </div>
      ),
      dataIndex: "noifInterviewRounds",
      key: "noifInterviewRounds",
      align: "center",
      width: 180,
      render:(text, result)=>{
        return  +text > 0 ? text : ''
      }
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
        const commentsArr = text.length > 0 ? text.split('~') : []
        return (<div>
        
          {commentsArr.length > 0 &&  <> <ul style={{paddingLeft:'5px',marginBottom:0}}>
            {commentsArr.map(comment=> <li dangerouslySetInnerHTML={{__html:comment}}></li>)}
          </ul> <br/> </>}
       
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
                  AddResponse({...record,index});
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
      title:'W1',
      dataIndex: "w1",
      key: "w1",
      width: 100,
      align: "center",
      className: amReportStyles.headerCell,
    },
      {
      title:'W2',
      dataIndex: "w2",
      key: "w3",
      width: 100,
      align: "center",
      className: amReportStyles.headerCell,
    },
      {
      title:'W3',
      dataIndex: "w3",
      key: "w3",
      width: 100,
      align: "center",
      className: amReportStyles.headerCell,
    },
      {
      title:'W4',
      dataIndex: "w4",
      key: "w4",
      width: 100,
      align: "center",
      className: amReportStyles.headerCell,
    },
      {
      title:'W5',
      dataIndex: "w5",
      key: "w5",
      width: 100,
      align: "center",
      className: amReportStyles.headerCell,
    },
      {
      title: (
        <div style={{ textAlign: "center" }}>
          No Of Profile <br />
          Talents Till Date
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
              setTalentToMove(result);
              setProfileStatusID(0);
              setHRTalentListFourCount([]);
            }}
          >
            {text}
          </p>
        ) : (
          ''
        );
      },
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
          Number of
          <br />
          TRs
        </div>
      ),
      dataIndex: "noofTR",
      key: "noofTR",
      width: 100,
      align: "center",
      className: amReportStyles.headerCell,
    },
     {
      title: (
        <div style={{ textAlign: "center" }}>
          Probability Ratio <br />
          this month
        </div>
      ),
      dataIndex: "probabiltyRatio_thismonth",
      key: "probabiltyRatio_thismonth",
      width: 135,
      align: "center",
      render: (value, record, index) =>
        renderDDSelect(
          value,
          record,
          index,
          "probabiltyRatio_thismonth",
          handleFieldChange
        ),
    },
     {
      title: (
        <div style={{ textAlign: "center" }}>
          Expected
          <br />
          Closure Week
        </div>
      ),
      dataIndex: "closurebyWeekend",
      key: "closurebyWeekend",
      width: 115,
      align: "center",
      render: (value, record, index) =>
        renderWeekSelect(
          value,
          record,
          index,
          "closurebyWeekend",
          handleFieldChange
        ),
    },
        {
      title: <div style={{ textAlign: "center" }}>Back Up</div>,
      dataIndex: "talent_Backup",
      key: "talent_Backup",
      width: 100,
      align: "center",
      className: amReportStyles.headerCell,
      render: (value, record, index) =>
        renderYesNoSelect(
          value,
          record,
          index,
          "talent_Backup",
          handleFieldChange
        ),
    },
     {
      title: (
        <div >
          Comments 
        </div>
      ),
      dataIndex: "potentialList_Comments",
      key: "potentialList_Comments",
      width: 400,
      // align: "center",
      className: amReportStyles.headerCell,
      render: (text, record, index) => {
        const commentsArr = text.length > 0 ? text.split('~') : []
        return (<div>
        
          {commentsArr.length > 0 &&  <> <ul style={{paddingLeft:'5px',marginBottom:0}}>
            {commentsArr.map(comment=> <li dangerouslySetInnerHTML={{__html:comment}}></li>)}
          </ul> <br/> </>}
       
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
                  AddComment({...record,index});
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
      title: (
        <div style={{ textAlign: "center" }}>
          Talent's
          <br /> Notice Period
        </div>
      ),
      dataIndex: "talent_NoticePeriod",
      key: "talent_NoticePeriod",
      width: 150,
      align: "center",
      className: amReportStyles.headerCell,
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
      title: <div style={{ textAlign: "center" }}>Sales Person</div>,
      dataIndex: "salesPerson",
      key: "salesPerson",
      width: 150,
      // fixed: "left",
      className: amReportStyles.headerCell,
    },
       {
      title: <div style={{ textAlign: "center" }}>Lead</div>,
      dataIndex: "leadType",
      key: "leadType",
      width: 100,
      align: "center",
      className: amReportStyles.headerCell,
    },
        {
      title: (
        <div style={{ textAlign: "center" }}>
          Date <br /> Created
        </div>
      ),
      dataIndex: "createdByDatetime",
      key: "createdByDatetime",
     
      width: 120,
      className: amReportStyles.headerCell,
      render: (text) => (text ? moment(text).format("DD/MM/YYYY") : "-"),
    },
    {
      title: <div style={{ textAlign: "center" }}>Team</div>,
      dataIndex: "hR_Team",
      key: "hR_Team",
     align: "center",
      width: 100,
      className: amReportStyles.headerCell,
    },

        {
      title: <div style={{ textAlign: "center" }}>Uplers Fees %</div>,
      dataIndex: "uplersFeesPer",
      key: "uplersFeesPer",
      width: 120,
      align: "center",
      className: amReportStyles.headerCell,
    },
   
 
 
  
   
    // {
    //   title: (
    //     <div style={{ textAlign: "center" }}>
    //       Company
    //       <br />
    //       Size
    //     </div>
    //   ),
    //   dataIndex: "companySize",
    //   key: "companySize",
    //   width: 90,
    //   className: amReportStyles.headerCell,
    // },
    // {
    //   title: (
    //     <div style={{ textAlign: "center" }}>
    //       Revenue
    //       <br />
    //       Opportunity
    //     </div>
    //   ),
    //   dataIndex: "hrRevenueAnnualCTC_INR_Str",
    //   key: "hrRevenueAnnualCTC_INR_Str",
    //   width: 120,
    //   align: "right",
    //   className: amReportStyles.headerCell,
    // },
    // {
    //   title: <div style={{ textAlign: "center" }}>Uplers Fees</div>,
    //   dataIndex: "uplersFeeStr",
    //   key: "uplersFeeStr",
    //   width: 150,
    //   align: "left",
    //   className: amReportStyles.headerCell,
    // }, 
    // {
    //   title: (
    //     <div style={{ textAlign: "center" }}>
    //       Actual
    //       <br />
    //       Closure Week
    //     </div>
    //   ),
    //   dataIndex: "closurebyMonth",
    //   key: "closurebyMonth",
    //   width: 110,
    //   align: "center",
    //   render: (value, record, index) =>
    //     renderWeekSelect(
    //       value,
    //       record,
    //       index,
    //       "closurebyMonth",
    //       handleFieldChange
    //     ),
    // },
    //,   Next Action Point (Add / View), Owner1
    //   {
    //   title: (
    //     <div style={{ textAlign: "center" }}>
    //        Pushed
    //       <br /> Closure Week
    //     </div>
    //   ),
    //   dataIndex: "pushed_Closure_Week",
    //   key: "pushed_Closure_Week",
    //   width: 105,
    //   align: "center",
    //   className: amReportStyles.headerCell,
    //   //  render: (value, record, index) =>
    //   //   renderWeekSelect(
    //   //     value,
    //   //     record,
    //   //     index,
    //   //     "pushed_Closure_Week",
    //   //     handleFieldChange
    //   //   ),
    // },
    //    {
    //   title: <div style={{ textAlign: "center" }}>Owner</div>,
    //   dataIndex: "owner_UserID",
    //   key: "owner_UserID",
    //   width: 100,
    //   align: "center",
    //   className: amReportStyles.headerCell,
    //   // render:(value, record,index)=>{
    //   //   return  renderOwnerSelect(
    //   //     value,
    //   //     record,
    //   //     index,
    //   //     "owner_UserID",
    //   //     handleFieldChange
    //   //   )
    //   // }
    // },
  ];

    const onCalenderFilter = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
   
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

  const SummeryColumns = [
    {
      title: "Created Date",
      dataIndex: "hrCreatedDateStr",
      key: "hrCreatedDateStr",
    },
    {
      title: "HR #",
      dataIndex: "hR_Number",
      key: "hR_Number",
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
      title: "HR Title",
      dataIndex: "hrTitle",
      key: "hrTitle",
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
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
      title: "Uplers Fees",
      dataIndex: "uplersFees_Str",
      key: "uplersFees_Str",
    },
     {
      title: "Talent",
      dataIndex: "talent",
      key: "talent",
    },
        {
      title: "Sales Person",
      dataIndex: "salesPerson",
      key: "salesPerson",
    }, 
    {
      title: "Status",
      dataIndex: "hrStatus",
      key: "hrStatus",
      width: "200px",
      render: (_, item) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            maxWidth: "150px",
          }}
        >
          {All_Hiring_Request_Utils.GETHRSTATUS(
            parseInt(item?.hrStatusCode),
            item?.hrStatus
          )}
        </div>
      ),
    },
    {
      title: "Lead Type",
      dataIndex: "leadType",
      key: "leadType",
    },
  {
      title: "Business Type",
      dataIndex: "businessType",
      key: "businessType",
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

  const onRemoveHRFilters = () => {
    setTimeout(() => {
      setIsAllowFilters(false);
    }, 300);
    setHTMLFilter(false);
  };

  const saveResponse = async()=>{
    setResponseSubmit(true)

    if(round === '' || roundDate === ''){
      message.error(`Please Select ${round === '' ?  "Round":''} ${round === '' && roundDate === '' ? 'And' :''} ${roundDate === '' ? "Date" : ''}`)
      return
    }
    let PL = {
      HR_ID: responseData?.hiringRequest_ID,
      Interview_Round:round,
      Round_Date:moment(roundDate).format('YYYY-MM-DD'),
      Comments:'',
      LoggedInUserID:userData?.UserId
    }
    setLoadingResponse(true)
    const result = await  ReportDAO.insertPotentialClosureResponseRequestDAO(PL);
    setLoadingResponse(false)

    if(result.statusCode === 200){
       let responces = result.responseBody.map(re=> re.round_Detail)
          setReportData(prev=>{
            let nArr = [...prev]
            nArr[responseData?.index] = {...nArr[responseData?.index], clientResponseneededBy: responces.join("~")}
            return nArr
          })
        setShowResponse(false);
        setResponseData({});
        setRoundDate('')
        setRound('')
        setResponseSubmit(false)
    }else{
      message.error('something went wrong')
    }

  }

  const gN = (name) => {
    switch (name) {
      case "1_AM_Recurring":
        return "AM Recurring";
      case "1_NBD_Recurring":
        return "NBD Recurring";
      case "2_AM_DP":
        return "AM One Time";
      case "2_NBD_DP":
        return "NBD One Time";
      default:
        return "";
    }
  };

  return (
    <div className={amReportStyles.container}>
      {/* <h1 className={amReportStyles.title}>Pipeline to bring closures from</h1> */}
      <h1 className={amReportStyles.title}>AM Potential Closures List </h1>
      <div className={amReportStyles.filterContainer}>
        <div className={amReportStyles.filterSets}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className={amReportStyles.filterSetsInner}>
              <div
                className={amReportStyles.addFilter}
                onClick={toggleHRFilter}
              >
                <FunnelSVG style={{ width: "16px", height: "16px" }} />
                <div className={amReportStyles.filterLabel}> Add Filters</div>
                <div className={amReportStyles.filterCount}>
                  {filteredTagLength}
                </div>
              </div>

              <div
                className={amReportStyles.searchFilterSet}
                style={{ marginLeft: "5px" }}
              >
                <SearchSVG style={{ width: "16px", height: "16px" }} />
                <input
                  type={InputType.TEXT}
                  className={amReportStyles.searchInput}
                  placeholder="Search Here...!"
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
              </div>
              <p
                className={amReportStyles.resetText}
                style={{ width: "120px" }}
                onClick={clearFilters}
              >
                Reset Filter
              </p>
            </div>

            <div
              className={amReportStyles.filterRight}
              style={{ display: "flex" }}
            >
              <Radio.Group
                onChange={(e) => {
                  if (e.target.value === "D") {
                    if (!startDate && dateTypeFilter === 1) {
                      return message.error("Please select date range");
                    }
                  }
                  setTableFilteredState((prev) => ({
                    ...prev,
                    filterFields_OnBoard: {
                      ...prev.filterFields_OnBoard,
                      EngType: e.target.value,
                    },
                  }));
                  //  setEngagementType(e.target.value);
                }}
                style={{ display: "flex", alignItems: "center" }}
                value={tableFilteredState?.filterFields_OnBoard?.EngType}
              >
                <Radio value={""}>All</Radio>
                <Radio value={"Contract"}>Contract</Radio>
                <Radio value={"DP"}>DP</Radio>
              </Radio.Group>

              <div style={{display:'flex',justifyContent:'center',alignItems:"center"}}>
                  <div style={{display:"flex",justifyContent:'center',marginRight:"10px"}}>
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
                                </div>

                {dateTypeFilter === 0 &&   <div
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div>Month-Year</div>
                <div className={amReportStyles.calendarFilter}>
                  <CalenderSVG
                    style={{ height: "16px", marginRight: "16px" }}
                  />
                  <DatePicker
                    style={{ backgroundColor: "red" }}
                    onKeyDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className={amReportStyles.dateFilter}
                    placeholderText="Month - Year"
                    selected={monthDate}
                    onChange={(date) => setMonthDate(date)}
                    dateFormat="MM-yyyy"
                    showMonthYearPicker
                  />
                </div>
              </div>}

               {dateTypeFilter === 1 && (
                                <div style={{display:'flex',justifyContent:'space-evenly',alignItems:'center',gap:'8px'}}>
                                  <div>Date</div>
                                  <div className={amReportStyles.calendarFilter}>                       
                                  <CalenderSVG style={{ height: "16px", marginRight: "16px" }} />
                                  <DatePicker
                                    style={{ backgroundColor: "red" }}
                                    onKeyDown={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                    }}
                                    className={amReportStyles.dateFilter}
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
              </div>
            
            </div>
          </div>
        </div>
      </div>

      <div className={amReportStyles.summeryContainer}>
        {isLoading  ? <div style={{display:"flex",height:"350px",justifyContent:'center',width:'100%'}}>
                          <Spin size="large"/>
                        </div> : <>
                           {summeryGroupsNames.map((gName) => {
          let data = summeryReportData.filter(
            (item) => item.groupName === gName
          );
          return (
            <div className={amReportStyles.cardcontainer}>
              <h3 className={amReportStyles.recruitername}>{gN(gName)}</h3>
              <table className={amReportStyles.stagetable} style={{width:'650px'}}>
                <thead>
                  <tr>
                    <th style={{textAlign:'center'}}>Stage</th>
                    <th style={{textAlign:'center'}}>Sappy</th>
                    <th style={{textAlign:'center'}}>Nikita</th>
                    <th style={{textAlign:'center'}}>Deepsikha</th>
                    <th style={{textAlign:'center'}}>Nandini</th>
                    <th style={{textAlign:'center'}}>Gayatri</th>
                    <th style={{textAlign:'center'}}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((val) => (
                    <tr
                      key={gName + val.stage}
                      //  className={getStageClass(stage.profileStatusID)}
                    >
                      <td>{val.stage}</td>
                      <td style={{textAlign:'end'}}>
                        {val.stage === "Recurring Goal" ? (
                          val.sappy_str
                        ) : (
                          <p
                            style={{
                              margin: 0,
                              textDecoration: "underline",
                              color: "blue",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              getSummeryDetails(val, "sappy_str");
                            }}
                          >
                            {val.sappy_str}
                          </p>
                        )}
                      </td>
                      <td style={{textAlign:'end'}}>
                        {val.stage === "Recurring Goal" ? (
                          val.nikita_str
                        ) : (
                          <p
                            style={{
                              margin: 0,
                              textDecoration: "underline",
                              color: "blue",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              getSummeryDetails(val, "nikita_str");
                            }}
                          >
                            {val.nikita_str}
                          </p>
                        )}
                      </td>
                      <td style={{textAlign:'end'}}>
                        {val.stage === "Recurring Goal" ? (
                          val.deepshikha_str
                        ) : (
                          <p
                            style={{
                              margin: 0,
                              textDecoration: "underline",
                              color: "blue",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              getSummeryDetails(val, "deepshikha_str");
                            }}
                          >
                            {val.deepshikha_str}
                          </p>
                        )}
                      </td>
                      <td style={{textAlign:'end'}}>
                        {val.stage === "Recurring Goal" ? (
                          val.nandni_str
                        ) : (
                          <p
                            style={{
                              margin: 0,
                              textDecoration: "underline",
                              color: "blue",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              getSummeryDetails(val, "nandni_str");
                            }}
                          >
                            {val.nandni_str}
                          </p>
                        )}
                      </td>
                      <td style={{textAlign:'end'}}>
                        {val.stage === "Recurring Goal" ? (
                          val.gayatri_str
                        ) : (
                          <p
                            style={{
                              margin: 0,
                              textDecoration: "underline",
                              color: "blue",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              getSummeryDetails(val, "gayatri_str");
                            }}
                          >
                            {val.gayatri_str}
                          </p>
                        )}
                      </td>
                       <td style={{textAlign:'end'}}>
                        {
                          val.total_str
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
                        </>}
     
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <Table
          scroll={{ x: "1600px", y: "100vh" }}
          id="amReportList"
          columns={columns}
          bordered={false}
          dataSource={reportData}
          rowKey={(record, index) => index}
          rowClassName={(row, index) => {
            return row?.clientName === "TOTAL"
              ? amReportStyles.highlighttotalrow
              : "";
          }}
          pagination={false}
          // pagination={{
          //   size: "small",
          //   pageSize: 15
          // }}
        />
      )}

      {isAllowFilters && (
        <Suspense fallback={<div>Loading...</div>}>
          <OnboardFilerList
            setAppliedFilters={setAppliedFilters}
            appliedFilter={appliedFilter}
            setCheckedState={setCheckedState}
            checkedState={checkedState}
            setTableFilteredState={setTableFilteredState}
            tableFilteredState={tableFilteredState}
            setFilteredTagLength={setFilteredTagLength}
            onRemoveHRFilters={onRemoveHRFilters}
            getHTMLFilter={getHTMLFilter}
            hrFilterList={allHRConfig.hrFilterListConfig()}
            filtersType={allEngagementConfig.amReportFilterTypeConfig(
              filtersList
            )}
            clearFilters={clearFilters}
          />
        </Suspense>
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
                                      className={amReportStyles.filterType}
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
                                      className={amReportStyles.filterType}
                                      key={"Profile shared"}
                                      onClick={() => {
                                        console.log(profileInfo,"profileInfo");                              
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
                                      className={amReportStyles.filterType}
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
                                      className={amReportStyles.filterType}
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
                                      className={amReportStyles.filterType}
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
                                      className={amReportStyles.filterType}
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
                                      className={amReportStyles.filterType}
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
                                      className={amReportStyles.filterType}
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
                className={amReportStyles.btnCancle}
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
          </>}
        </Modal>
      )}

      {showSummeryDetails && (
        <Modal
          transitionName=""
          width="1200px"
          centered
          footer={null}
          open={showSummeryDetails}
          // className={allEngagementStyles.engagementModalContainer}
          className="engagementModalStyle"
          // onOk={() => setVersantModal(false)}
          onCancel={() => {
            setSearchTerm("");
            setShowSummeryDetails(false);
            setSummeryDetails([]);
          }}
        >
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
               <strong>{gN(summeryTitles?.groupName)}</strong>
              </h3>

              <p style={{ marginBottom: "0.5em" }}>
                Stage: <strong>{summeryTitles?.stage}</strong>{" , "}<strong>{summeryTitles?.col?.replace("_str", "i")?.replace(/^./, c => c.toUpperCase())}</strong>{" "}
              </p>

            </div>

            {loadingTalentProfile ? (
              <div>
                <Skeleton active />
              </div>
            ) : (
              <div className={amReportStyles.summeryTableWrapper} style={{ margin: "5px 10px" }}>
                <Table
                  dataSource={summeryDetails}
                  columns={SummeryColumns}
                  // bordered
                  pagination={false}
                />
              </div>
            )}

            <div style={{ padding: "10px 0" }}>
              <button
                className={amReportStyles.btnCancle}
                // disabled={isAddingNewTask}
                onClick={() => {
                  setSearchTerm("");
                  setShowSummeryDetails(false);
                  setSummeryDetails([]);
                }}
              >
                Cancel
              </button>
            </div>
          </>
        </Modal>
      )}

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
                          {!isCommentLoading && <Table 
                           dataSource={allCommentList}
                                columns={commentColumn}
                                pagination={false}
                          />}
                        
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
                          className={amReportStyles.btnCancle}
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
                            setRoundDate('')
                            setRound('')
                            setResponseSubmit(false)
                      }}
                    >
                      <div style={{ padding: "35px 15px 10px 15px" }}>
                        <h3>Add Response</h3>
                      </div>
                      <h3 style={{marginLeft:'10px'}}>{responseData?.position} </h3>
                    <p style={{marginLeft:'10px'}}>({responseData?.hR_Number})</p>

                    {loadingResponse ? <Skeleton active /> : 
                    
                    <>
                     <div 
                         style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "8px",
                  marginLeft:'10px',
                  marginRight:'10px',
                  marginBottom:'10px'
                }} >
                          <label>Select Round</label>
                          <Select
                                  value={round}
                                  onChange={(newValue) =>
                                  { setRound(newValue)}
                                    // handleChange(newValue, record, index, dataIndex)
                                  }
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
                  marginLeft:'10px',
                  marginRight:'10px',
                 
                }}
              >
                <div>Date</div>
                <div className={amReportStyles.calendarFilter}>
                  <CalenderSVG
                    style={{ height: "16px", marginRight: "16px" }}
                  />
                  <DatePicker
                    style={{ backgroundColor: "red" }}
                    onKeyDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className={amReportStyles.dateFilter}
                    placeholderText="Select Date"
                    selected={roundDate}
                    onChange={(date) => setRoundDate(date)}
                    dateFormat="dd-MM-yyyy"
                    // showMonthYearPicker
                  />
                </div>
              </div>
                    </>}
                       
                    
            
                     
                      <div style={{ padding: "10px" }}>
                         <button
                          className={amReportStyles.btn}
                          // disabled={isEditNewTask}
                          onClick={() => {
                            saveResponse()
                          }}
                          disabled={loadingResponse}
                        >
                          Save
                        </button>
                        <button
                          className={amReportStyles.btnCancle}
                          // disabled={isEditNewTask}
                          onClick={() => {
                            setShowResponse(false);
                            setResponseData({});
                            setRoundDate('')
                            setRound('')
                            setResponseSubmit(false)
                          }}
                          disabled={loadingResponse}
                        >
                          Close
                        </button>
                      </div>
                    </Modal>
                  )}
      
    </div>
  );
};

export default AMReport;
