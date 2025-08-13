import React, { Suspense, useCallback, useEffect, useState } from "react";
import amReportStyles from "./amReport.module.css";
import { Table, Radio, message, Select, Tooltip, Modal, Skeleton } from "antd";
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
  const [openTicketDebounceText, setopenTicketDebounceText] = useState("");
  const [getHTMLFilter, setHTMLFilter] = useState(false);
  const [isAllowFilters, setIsAllowFilters] = useState(false);
  const [filteredTagLength, setFilteredTagLength] = useState(0);
  const [appliedFilter, setAppliedFilters] = useState(new Map());
  const [checkedState, setCheckedState] = useState(new Map());
  const [tableFilteredState, setTableFilteredState] = useState({
    filterFields_OnBoard: {
      text: null,
      EngType: "",
    },
  });
  var date = new Date();
  const [startDate, setStartDate] = useState(
    new Date(date.getFullYear(), date.getMonth() - 1, date.getDate())
  );
  const [dateTypeFilter, setDateTypeFilter] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtersList, setFiltersList] = useState([]);
  const [showTalentProfiles, setShowTalentProfiles] = useState(false);
  const [profileInfo, setInfoforProfile] = useState({});
  const [loadingTalentProfile, setLoadingTalentProfile] = useState(false);
  const [hrTalentList, setHRTalentList] = useState([]);
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
  }, [openTicketDebounceText, monthDate, tableFilteredState]);

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
      month: monthDate ? +moment(monthDate).format("M") : 0,
      year: monthDate ? +moment(monthDate).format("YYYY") : 0,
      // "amUserIDs": tableFilteredState?.filterFields_OnBoard?.text,
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
      month: monthDate ? +moment(monthDate).format("M") : 0,
      year: monthDate ? +moment(monthDate).format("YYYY") : 0,
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
  }, [monthDate]);

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
        text: null,
      },
    });
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

  const AddComment = (data, modal, index) => {
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
      title: <div style={{ textAlign: "center" }}>Team</div>,
      dataIndex: "hR_Team",
      key: "hR_Team",
      fixed: "left",
      width: 100,
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
      fixed: "left",
      width: 120,
      className: amReportStyles.headerCell,
      render: (text) => (text ? moment(text).format("DD/MM/YYYY") : "-"),
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
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
      title: <div style={{ textAlign: "center" }}>HR Status</div>,
      dataIndex: "hrStatus",
      key: "hrStatus",
      fixed: "left",
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
      fixed: "left",
      className: amReportStyles.headerCell,
    },
    {
      title: <div style={{ textAlign: "center" }}>Sales Rep</div>,
      dataIndex: "salesPerson",
      key: "salesPerson",
      width: 150,
      fixed: "left",
      className: amReportStyles.headerCell,
    },
    {
      title: <div style={{ textAlign: "center" }}>Company</div>,
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
    {
      title: <div style={{ textAlign: "center" }}>Position</div>,
      dataIndex: "position",
      key: "position",
      width: 180,
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
          Revenue
          <br />
          Opportunity
        </div>
      ),
      dataIndex: "hrRevenueAnnualCTC_INR_Str",
      key: "hrRevenueAnnualCTC_INR_Str",
      width: 120,
      align: "right",
      className: amReportStyles.headerCell,
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          Average Value
          <br />
          (USD)
        </div>
      ),
      dataIndex: "averageValue",
      key: "averageValue",
      width: 120,
      align: "right",
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
    {
      title: <div style={{ textAlign: "center" }}>Uplers Fees</div>,
      dataIndex: "uplersFeeStr",
      key: "uplersFeeStr",
      width: 150,
      align: "left",
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
          Next Action <br /> Point
        </div>
      ),
      dataIndex: "nextAction",
      key: "nextAction",
      width: 100,
      align: "center",
      className: amReportStyles.headerCell,
      render: (text, record) => {
        return (
          <IconContext.Provider
            value={{
              color: "green",
              style: {
                width: "20px",
                height: "20px",
                marginRight: "5px",
                cursor: "pointer",
              },
            }}
          >
            {" "}
            <Tooltip title={`Add/View comment`} placement="top">
              <span
                onClick={() => {
                  AddComment(record);
                }}
                // className={taStyles.feedbackLabel}
              >
                {" "}
                <IoMdAddCircle />
              </span>{" "}
            </Tooltip>
          </IconContext.Provider>
        );
      },
    },
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
      title: "Business Type",
      dataIndex: "businessType",
      key: "businessType",
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
      title: "Sales Person",
      dataIndex: "salesPerson",
      key: "salesPerson",
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
              <div
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
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={amReportStyles.summeryContainer}>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
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
          </>
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
            ></div>

            {loadingTalentProfile ? (
              <div>
                <Skeleton active />
              </div>
            ) : (
              <div style={{ margin: "5px 10px" }}>
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
      
    </div>
  );
};

export default AMReport;
