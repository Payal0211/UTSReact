import React, { useState, useEffect, Suspense } from 'react'
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
import { ReportDAO } from "core/report/reportDAO";
import { HTTPStatusCode } from "constants/network";
import { TaDashboardDAO } from "core/taDashboard/taDashboardDRO";
import { useNavigate } from "react-router-dom";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import UTSRoutes from "constants/routes";
import { IoMdAddCircle } from "react-icons/io";
import Diamond from "assets/svg/diamond.svg";
import { ImPushpin } from "react-icons/im";
import { PiArrowsSplitBold } from "react-icons/pi";
import { CiCircleInfo } from "react-icons/ci";
import { MdModeEditOutline } from "react-icons/md";
import { GrNotes } from "react-icons/gr";
import { IconContext } from "react-icons";
import { All_Hiring_Request_Utils } from "shared/utils/all_hiring_request_util";
import Editor from "modules/hiring request/components/textEditor/editor";
import { UserSessionManagementController } from "modules/user/services/user_session_services";
import spinGif from "assets/gif/RefreshLoader.gif";
import SplitHR from "modules/hiring request/screens/allHiringRequest/splitHR";
import { downloadToExcel } from "modules/report/reportUtils";

const { Title, Text } = Typography;

function WeeklyWCGR() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [monthDate, setMonthDate] = useState(new Date());
  const selectedYear = monthDate.getFullYear();
  const [hrModal, setHRModal] = useState('DP');
  const [pODList, setPODList] = useState([]);
  const [pODUsersList, setPODUsersList] = useState([]);
  const [selectedHead, setSelectedHead] = useState('');
  const [tableData, setTableData] = useState([]);
  const [headerDataCol, setHeaderDataCol] = useState({});
  const [showComment, setShowComment] = useState(false);
  const [commentData, setCommentData] = useState({});
  const [allCommentList, setALLCommentsList] = useState([]);
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [editTalentOfferedCTCModal, setEditTalentOfferedCTCModal] = useState(false)
  const [offeredCTCDeails, setofferedCTCDetails] = useState({})
  const [ctcPerUpdating, setCTCPERUPDATING] = useState(false)
  const [showChReport, setShowCHReport] = useState(false)
  const [listAchievedData, setListAchievedData] = useState([]);
  const [achievedLoading, setAchievedLoading] = useState(false);
  const [showTalentCol, setShowTalentCol] = useState({});
  const [achievedTotal, setAchievedTotal] = useState("");

  const [DFListData, setDFListData] = useState([]);
  const [DFFilterListData, setDFFilterListData] = useState([]);
  const [showDFReport, setShowDFReport] = useState(false);
  const [showReferenceReport, setShowReferenceReport] = useState(false);
  const [showAnticipatedReport, setShowAnticipatedReport] = useState(false);
  const [openSplitHR, setSplitHR] = useState(false);
  const [getHRnumber, setHRNumber] = useState({ hrNumber: '', isHybrid: false });
  const [getHRID, setHRID] = useState("");
  const [isSplitLoading, setIsSplitLoading] = useState(false);
  const [groupList, setGroupList] = useState([{
    pod: '', amLead: '', amLeadAmount: '', am: '', amAmount: '', taLead: '', taLeadAmount: '', ta: '', taAmount: '', currency: ''
  }])
  const [searchTerm, setSearchTerm] = useState("");
  const [showAchievedReport, setShowAchievedReport] = useState(false);

  const [userData, setUserData] = useState({});
  useEffect(() => {
    const getUserResult = async () => {
      let userData = UserSessionManagementController.getUserSession();
      if (userData) setUserData(userData);
    };
    getUserResult();
  }, []);

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

      setSelectedHead(prev => {
        if (prev === '') {
          getGroupUsers(filterResult?.responseBody[0]?.dd_value);
          return filterResult?.responseBody[0]?.dd_value
        } else {
          getGroupUsers(prev);
          return prev
        }

      });
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
              : item.stage_Title.includes("SELECTION") ? "#2952d1"
                : item.stage_Title.includes("CUSTOMER EXPERIENCE") ? "#15803D"
                  : item.stage_Title.includes("PIPELINE REVIEW") ? "#BE123C"
                    : item.stage_Title.includes("CUSTOMER OVERVIEW") ? "#6D28D9"
                      : item.stage_Title.includes("TOP CLIENTS") ? "#0F766E"
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

  const getExportData = () => {
    return listAchievedData.map((detail) => {
      let row = {};

      // Created Date
      row["Created Date"] = detail.hrCreatedDateStr;

      // Action / Joining / Offer Date
      if (
        showTalentCol?.category !== "CF" &&
        showTalentCol?.category !== "CH" &&
        showTalentCol?.stage !== "Opening Balance" &&
        showTalentCol?.stage !== "Added HR (New)"
      ) {
        let label =
          showTalentCol?.stage === "Joining" ||
            showTalentCol?.stage === "Selections/Closures" ||
            showTalentCol?.stage === "Joined"
            ? `${showTalentCol?.stage} Date`
            : showTalentCol?.stage === "Preonboarding"
              ? "Offer Date"
              : "Action Date";

        row[label] = detail.actionDateStr;
      }

      // Company
      row["Company"] = detail.company;

      // HR Section
      const showHRSection =
        showTalentCol?.category !== "CF" &&
        !(
          showTalentCol?.category === "CH" &&
          showTalentCol?.stage !== "Customers with Active HRs"
        );

      if (showHRSection) {
        row["HR Number"] = detail.hR_Number;
        row["HR Title"] = detail.hrTitle;

        // Not Accepted → Reason
        if (showTalentCol?.stage === "Not Accepted HRs") {
          row["Reason"] = detail.talent;
        }

        // TR (hidden for some stages)
        if (
          !["Selections/Closures", "Joined", "Preonboarding"].includes(
            showTalentCol?.stage
          )
        ) {
          row["TR"] = detail.tr;
        }

        // Revenue / Pipeline
        row[
          ["Joining", "Joined", "Selections/Closures"].includes(
            showTalentCol?.stage
          )
            ? "Revenue"
            : "1TR Pipeline"
        ] = detail.hrPipelineStr;

        // Total Pipeline
        if (
          !["Joining", "Joined", "Selections/Closures"].includes(
            showTalentCol?.stage
          )
        ) {
          row["Total Pipeline"] = detail.total_HRPipelineStr;
        }

        row["Uplers Fees %"] = detail.uplersFeesPer;
        row["Talent Pay"] = detail.talentPayStr;
      }

      // Sales Person
      row["Sales Person"] = detail.salesPerson;

      // Carry Fwd Status (top section)
      if (showTalentCol?.stage === "HRs (Carry Fwd)") {
        row["Carry Fwd Status"] = detail.carryFwd_HRStatus
      }

      // Lead Type
      row["Lead Type"] = detail.lead_Type;

      // Bottom Section (Talent / Carry Forward / HR Status)
      if (showHRSection) {
        // Talent column (only for Joined / Closures)
        if (
          showTalentCol?.stage !== "Not Accepted HRs" &&
          ["Joined", "Selections/Closures"].includes(showTalentCol?.stage)
        ) {
          row[
            showTalentCol?.stage === "Lost (Pipeline)"
              ? "Reason"
              : "Talent"
          ] = detail.talent;
        }

        // Carry Forward Status (bottom)
        if (
          !["Joined", "Selections/Closures", "Added HR (New)", "Preonboarding"].includes(
            showTalentCol?.stage
          )
        ) {
          row["Carry Forward Status"] = detail.carryFwd_HRStatus

        }

        // HR Status
        row["HR Status"] = detail.hrStatus

      }

      return row;
    });
  };


  const handleExport = (apiData) => {
    let DataToExport = getExportData()
    downloadToExcel(DataToExport, `POD ${showTalentCol?.stage} Report`);
  };

  const getJoiningRevenueData = async () => {
    setIsLoadingTable(true);
    let query = `?podId=${selectedHead}&Month=${moment(monthDate).format("M")}&Year=${selectedYear}`;

    const result = await ReportDAO.getJoiningRevenueDataDAO(query);
    setIsLoadingTable(false);
    console.log("Joining Revenue Data: ", result);
    if (result.statusCode === HTTPStatusCode.OK) {
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
    if (selectedHead) {
      getJoiningRevenueData();
    }
  }, [selectedHead, monthDate]);

  const getAllComments = async (d, key, month) => {
    setIsCommentLoading(true);
    const pl = {
      month: month,
      year: d.wcgrYear,
      userCategory: key,
      hR_Model: d.stage_ID,
      stage_ID: d.poD_ID,
      hR_BusinessType: "POD",
    };
    const result = await TaDashboardDAO.getALLRevenueCommentsDAO(pl);
    setIsCommentLoading(false);
    if (result.statusCode === HTTPStatusCode.OK) {
      setALLCommentsList(result.responseBody);
    } else {
      setALLCommentsList([]);
    }
  };

  const AddComment = (data, key, month, index) => {
    getAllComments(data, key, month);
    setShowComment(true);
    setCommentData({ ...data, hR_Model: "", key: key, month: month });
  };

  const saveComment = async (note) => {
    let pl = {
      hR_BusinessType: "POD",
      month: commentData?.month,
      year: commentData?.wcgrYear,
      userCategory: commentData.key,
      hR_Model: commentData.stage_ID,
      stage_ID: commentData.poD_ID,
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

  const saveNeededPipeline = async () => {

    if (+offeredCTCDeails.CTC <= 0 || isNaN(+offeredCTCDeails.CTC)) {
      message.error("Please enter a valid amount");
      return
    }

    const isExisting = commentData.stage_ID.includes("Existing") ? true : false;
    const isNew = commentData.stage_ID.includes("New") ? true : false;
    const isTotal = commentData.key.includes("MonthlyTotal") ? true : false;
    const weekNO = commentData.key.split("_")[1].slice(0, 2);

    let pl = {
      POD_ID: commentData.poD_ID,
      New_Quarter: 0,
      New_Month: 0,
      New_Month_W1: 0,
      New_Month_W2: 0,
      New_Month_W3: 0,
      New_Month_W4: 0,
      New_Month_W5: 0,
      Existing_Quarter: 0,
      Existing_Month: 0,
      Existing_Month_W1: 0,
      Existing_Month_W2: 0,
      Existing_Month_W3: 0,
      Existing_Month_W4: 0,
      Existing_Month_W5: 0,
      Month: commentData.month,
      Year: commentData.wcgrYear,
      LoggedInUserID: userData?.UserId
    };

    if (isNew) {
      if (isTotal) {
        pl[`New_Month`] = +offeredCTCDeails.CTC;
      } else {
        pl[`New_Month_${weekNO}`] = +offeredCTCDeails.CTC;
      }

    }
    if (isExisting) {
      if (isTotal) {
        pl[`Existing_Month`] = +offeredCTCDeails.CTC;
      } else {
        pl[`Existing_Month_${weekNO}`] = +offeredCTCDeails.CTC;
      }

    }

    console.log("Payload to save needed pipeline: ", pl, commentData);
    setCTCPERUPDATING(true)
    const result = await TaDashboardDAO.saveNeededPipelineDAO(pl);
    setCTCPERUPDATING(false)

    console.log("Result of saving needed pipeline: ", result);
    if (result.statusCode === HTTPStatusCode.OK) {
      setEditTalentOfferedCTCModal(false)
      setofferedCTCDetails({})
      setTableData(prev => {
        let temp = [...prev];
        temp[commentData.index] = { ...temp[commentData.index], [commentData.key]: offeredCTCDeails.symbol ? `${offeredCTCDeails.symbol}${offeredCTCDeails.CTC.toLocaleString()}` : offeredCTCDeails.CTC.toLocaleString() };
        return temp;

      })

    } else {
      message.error("Failed to save needed pipeline data");
    }
  }

  function parsePrice(text) {
    const regex =
      /(?<symbol>[\p{Sc}])?\s*(?<amount>\d{1,3}(?:,\d{2,3})*(?:\.\d+)?)\s*(?<code>[A-Z]{3})?/u;

    const match = text.match(regex);

    if (!match || !match.groups) return null;

    return {
      symbol: match.groups.symbol || null,
      amount: parseFloat(
        match.groups.amount.replace(/,/g, "")
      ),
      code: match.groups.code || null,
    };

  }

  const getHRChealthWiseReport = async (row, v, week, month) => {
    try {
      setShowCHReport(true);

      const pl = {
        hrmodel: hrModal,
        pod_id: selectedHead,
        month: month,
        year: row.wcgrYear,
        stageID: row.stage_ID,
        cat: "CH",
        week: week ? week : "",
        multiplePODIds: ''
      };
      setShowTalentCol(row);
      setAchievedTotal(v);
      setAchievedLoading(true);
      const result = await ReportDAO.getPOCPopupReportDAO(pl);
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

  const modifyResponseforPOD = async (data) => {
    let categories = []
    let modData = []

    data.forEach(item => {
      if (!categories.includes(item.category)) {
        categories.push(item.category)
      }
    })
    categories.forEach(async cat => {
      let cats = data.filter(item => item.category === cat)
      let podObj = {
        pod: '', amLead: '', amLeadAmount: '', am: '', amAmount: '', taLead: '', taLeadAmount: '', ta: '', taAmount: '', currency: ''
      }

      podObj.pod = cats[0]?.poD_ID
      podObj.currency = cats[0]?.currencyCode
      cats.forEach(itm => {
        switch (itm.roW_Value) {
          case 'AM Lead': {
            podObj.amLead = (itm.userID !== 0) ? itm.userID : ''
            podObj.amLeadAmount = itm.revenue
            break
          }
          case 'AM': {
            podObj.am = (itm.userID !== 0) ? itm.userID : ''
            podObj.amAmount = itm.revenue
            break
          }
          case 'TA Lead': {
            podObj.taLead = (itm.userID !== 0) ? itm.userID : ''
            podObj.taLeadAmount = itm.revenue
            break
          }
          case 'TA': {
            podObj.ta = (itm.userID !== 0) ? itm.userID : ''
            podObj.taAmount = itm.revenue
            break
          }
          default: break
        }
      })
      modData.push(podObj)

    })


    return modData
  }

  const getPODList = async (getHRID) => {
    setIsSplitLoading(true);
    let pl = { hrNo: getHRID, podid: 0 }
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
        pod: '', amLead: '', amLeadAmount: '', am: '', amAmount: '', taLead: '', taLeadAmount: '', ta: '', taAmount: '', currency: ''
      }])
      return "NO DATA FOUND";
    }
  };

  const AnticipatedColumns = [
    {
      title: "Anticipated Date",
      dataIndex: "anticipatedDateStr",
      key: "anticipatedDateStr",
      // width: "150px",

    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
      // width: "150px",
      render: (text, record) => {
        return <>
          <a
            href={`/viewCompanyDetails/${record.company_ID}`}
            style={{ textDecoration: "underline" }}
            target="_blank"
            rel="noreferrer"
          >
            {text}{" "}
          </a>
          {record?.company_Category === "Diamond" && (
            <>

              &nbsp;
              <img
                src={Diamond}
                alt="info"
                style={{ width: "16px", height: "16px" }}
              />
            </>
          )}
        </>

      }

    },
    {
      title: "HR Title",
      dataIndex: "hrTitle",
      key: "hrTitle",
      // width: "150px",

    },
    {
      title: "HR #",
      dataIndex: "hR_Number",
      key: "hR_Number",
      // width: "150px",
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
        );
      }
    },
    {
      title: "Lead Type",
      dataIndex: "lead_Type",
      key: "lead_Type",
      // width: "150px",

    },
    {
      title: "HR Status",
      dataIndex: "hrStatus",
      key: "hrStatus",
      // width: "150px",
      render: (text, param) =>
        All_Hiring_Request_Utils.GETHRSTATUS(
          param?.hrStatusCode,
          text
        ),
    },
    {
      title: "Uplers Fees",
      dataIndex: "uplersFeesStr",
      key: "uplersFeesStr",
      // width: "150px",

    },

  ]

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
      title: (showTalentCol?.stage_ID === "D_Lost" || showTalentCol?.stage_ID === "CN_Lost") ? "Lost Date" : (showTalentCol?.stage_ID === "D_Drop" || showTalentCol?.stage_ID === "CN_Drop") ? "Dropout Date" : (showTalentCol?.stage_ID === "D_Backout" || showTalentCol?.stage_ID === "CN_Backout") ? "Backout Date" : "Joining Date",
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
          {pODList?.find(item => item.dd_value === selectedHead)?.dd_text} Revenue
        </div>
      ),
      dataIndex: "podValueStr",
      key: "podValueStr",
      width: '150px',
      align: "right",
      className: uplersStyle.headerCell,
      render: (v, row) => {
        return <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'space-between' }}>
          <Tooltip placement="bottom" title={"Split HR"}>
            <a href="javascript:void(0);" style={{ display: 'inline-flex' }}>
              <PiArrowsSplitBold
                style={{ width: "17px", height: "17px", fill: '#232323' }}
                onClick={() => {
                  setSplitHR(true);
                  setHRID(row?.hiringRequestID);
                  setHRNumber({ hrNumber: row?.hR_Number });
                  getPODList(row?.hiringRequestID)
                }}
              />
            </a>
          </Tooltip>
          {v ? v : ''} </div>
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


  const getHRTalentWiseReport = async (row, v, week, month) => {
    try {
      setShowAchievedReport(true);

      const pl = {
        hrmodel: hrModal,
        pod_id: selectedHead,
        month: month,
        year: row.wcgrYear,
        stageID: row.stage_ID,
        cat: "ALL",
        week: week ? week : "",
        multiplePODIds: ''
      };
      setShowTalentCol(row);
      setAchievedTotal(v);
      setAchievedLoading(true);
      const result = await ReportDAO.getPOCPopupReportDAO(pl);
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

  const handleSummerySearchInput = (value) => {
    setSearchTerm(value);
    const filteredData = DFListData.filter(
      (talent) =>
        talent.talent.toLowerCase().includes(value.toLowerCase()) ||
        (talent.email &&
          talent.email.toLowerCase().includes(value.toLowerCase()))
    );
    setDFFilterListData(filteredData);
  };

  const getDFDetails = async (row, v, week, month) => {
    try {
      setShowDFReport(true);

      const pl = {
        hrmodel: hrModal,
        pod_id: selectedHead,
        month: month,
        year: row.wcgrYear,
        stage_ID: row.stage_ID,
        weekno: week ? week : "",
        hr_businesstype: row.hR_Type,
        isNextMonth: row?.isNM === 'Yes' ? row?.isNM : ''
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

  const getHRReferenceCount = async (row, v, week, month) => {
    try {
      setShowReferenceReport(true);

      const pl = {
        pod_id: selectedHead,
        month: month,
        year: row.wcgrYear,
        stageID: row.stage_ID,
        week: week ? week : "",
      };
      setShowTalentCol(row);
      setAchievedTotal(v);
      setAchievedLoading(true);
      const result = await ReportDAO.getReferencePopupReportDAO(pl);
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

  const getAnticipatedDetails = async (row, v, week, month) => {
    try {
      setShowAnticipatedReport(true);

      const pl = {
        pod_id: selectedHead,
        month: month,
        year: row.wcgrYear,
        stageID: row.stage_ID,
        week: week ? week : "",
      };
      setShowTalentCol(row);
      setAchievedTotal(v);
      setAchievedLoading(true);
      const result = await ReportDAO.getAnticipatedPopupReportDAO(pl);
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


  const AddNoteComp = ({ text, record, keyPar, month, index, week }) => {
    const isPastMonth = month < moment().format("M");
    const currentMonth = parseInt(moment().format("M"), 10);
    const selectedMonth = parseInt(month, 10);

    const weekMatch = keyPar.match(/W(\d+)/);
    const selectedWeek = weekMatch ? parseInt(weekMatch[1], 10) : null;
    const currentWeekOfMonth = moment().diff(moment().startOf("month"), "weeks") + 1;
    const isPastOrCurrentWeek = selectedMonth === currentMonth && selectedWeek !== null && selectedWeek <= currentWeekOfMonth;

    if (record?.stage_Title === "JOINING  ·  Revenue" || record?.stage_Title === "SELECTION - PreOnboarding  ·  Leads to Revenue") {
      if (record.stage_ID === "D_Joined" || record.stage_ID === "D_Lost" || record.stage_ID === "D_Drop") {
        return <div >
          {text ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                onClick={() => {
                  getDFDetails(record, text, week, month);
                }}
                style={{ cursor: "pointer", color: "#1890ff" }}
              >
                {text}
              </span>
              <IconContext.Provider
                value={{
                  // color: "green",
                  style: {
                    width: "10px",
                    height: "10px",
                    marginLeft: "5px",
                    cursor: "pointer",
                  },
                }}
              >
                {" "}
                <Tooltip title={`Add/View Comment`} placement="top">
                  <span
                    onClick={() => {
                      AddComment(record, keyPar, month);
                    }}
                    // className={taStyles.feedbackLabel}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {" "}
                    <CiCircleInfo />
                  </span>{" "}
                </Tooltip>
              </IconContext.Provider>
            </div>
          )
            : (
              ""
            )}
        </div>
      }

      if (record.stage_ID === "JAllAnticipated") {
        return <div >
          {text ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                onClick={() => {
                  getAnticipatedDetails(record, text, week, month);
                }}
                style={{ cursor: "pointer", color: "#1890ff" }}
              >
                {text}
              </span>
              <IconContext.Provider
                value={{
                  // color: "green",
                  style: {
                    width: "10px",
                    height: "10px",
                    marginLeft: "5px",
                    cursor: "pointer",
                  },
                }}
              >
                {" "}
                <Tooltip title={`Add/View Comment`} placement="top">
                  <span
                    onClick={() => {
                      AddComment(record, keyPar, month);
                    }}
                    // className={taStyles.feedbackLabel}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {" "}
                    <CiCircleInfo />
                  </span>{" "}
                </Tooltip>
              </IconContext.Provider>
            </div>
          )
            : (
              ""
            )}
        </div>
      }
    }

    if (record?.stage_Title === "SELECTION - PreOnboarding  ·  Leads to Revenue" && record.stage_ID === "J4") {

      return <div >
        {text ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              onClick={() => {
                getHRTalentWiseReport(record, text, week, month);
              }}
              style={{ cursor: "pointer", color: "#1890ff" }}
            >
              {text}
            </span>
            <IconContext.Provider
              value={{
                // color: "green",
                style: {
                  width: "10px",
                  height: "10px",
                  marginLeft: "5px",
                  cursor: "pointer",
                },
              }}
            >
              {" "}
              <Tooltip title={`Add/View Comment`} placement="top">
                <span
                  onClick={() => {
                    AddComment(record, keyPar, month);
                  }}
                  // className={taStyles.feedbackLabel}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {" "}
                  <CiCircleInfo />
                </span>{" "}
              </Tooltip>
            </IconContext.Provider>
          </div>
        )
          : (
            ""
          )}
      </div>

    }

    if (record?.stage_Title === "CUSTOMER EXPERIENCE" && (record.stage_ID === "refclientortalent")) {
      return <div >
        {text ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              onClick={() => {
                getHRReferenceCount(record, text, week, month);
              }}
              style={{ cursor: "pointer", color: "#1890ff" }}
            >
              {text}
            </span>
            <IconContext.Provider
              value={{
                // color: "green",
                style: {
                  width: "10px",
                  height: "10px",
                  marginLeft: "5px",
                  cursor: "pointer",
                },
              }}
            >
              {" "}
              <Tooltip title={`Add/View Comment`} placement="top">
                <span
                  onClick={() => {
                    AddComment(record, keyPar, month);
                  }}
                  // className={taStyles.feedbackLabel}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {" "}
                  <CiCircleInfo />
                </span>{" "}
              </Tooltip>
            </IconContext.Provider>
          </div>
        )
          : (
            ""
          )}
      </div>
    }

    if (record?.stage_Title === "CUSTOMER OVERVIEW") {

      return <div >
        {text ?
          <span
            onClick={() => {
              getHRChealthWiseReport(record, text, week, month)

            }}
            style={{ cursor: "pointer", color: "#1890ff" }}
          >
            {text}
          </span>

          : (
            ""
          )}
      </div>
    }

    return (record?.stage_ID === "JAllG" || record?.stage_ID === "JAllGA" || record?.stage_ID === "JAllAA" ||
      record?.stage_Title === "CUSTOMER OVERVIEW" || record?.stage_Title?.includes("TOP CLIENTS")
    ) ? text : <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >


      {text}

      {record.stage_Title.includes("PIPELINE REVIEW") ? (record.stage_ID === "NewNeededPipeleine" || record.stage_ID === "ExistingNeededPipeleine") && !isPastMonth && !isPastOrCurrentWeek ?
        <div style={{ marginLeft: "auto", }}>  <IconContext.Provider
          value={{
            // color: "green",
            style: {
              width: "10px",
              height: "10px",

              cursor: "pointer",
            },
          }}
        >
          {" "}
          <Tooltip title={`Edit`} placement="top">
            <span
              onClick={() => {
                setEditTalentOfferedCTCModal(true)
                let ctc = parsePrice(text)
                setCommentData({ ...record, hR_Model: "", key: keyPar, month: month, index: index });
                setofferedCTCDetails({ CTC: ctc.amount, ...ctc })
              }}
              // className={taStyles.feedbackLabel}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: "auto",
              }}
            >
              {" "}
              <MdModeEditOutline />
            </span>{" "}
          </Tooltip>
        </IconContext.Provider> </div> : "" : text ?
        <IconContext.Provider
          value={{
            // color: "green",
            style: {
              width: "10px",
              height: "10px",
              marginLeft: "5px",
              cursor: "pointer",
            },
          }}
        >
          {" "}
          <Tooltip title={`Add/View Comment`} placement="top">
            <span
              onClick={() => {
                AddComment(record, keyPar, month);
              }}
              // className={taStyles.feedbackLabel}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {" "}
              <CiCircleInfo />
            </span>{" "}
          </Tooltip>
        </IconContext.Provider> : ''
      }

    </div>
  }


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
                    background: record.color,
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
            render: (text, record, index) => {
              if (record.isSection) {
                return {
                  props: {
                    colSpan: 0,
                  },
                };
              }

              return <AddNoteComp text={text} record={record} keyPar={"startMonth_MonthlyTotalStr"} month={record?.startMonth} index={index} />;
            },
          },
          {
            title: "W1",
            dataIndex: 'startMonth_W1Str',
            key: "m1_w1",
            width: 100,
            align: "center",
            render: (text, record, index) => {
              if (record.isSection) {
                return {
                  props: {
                    colSpan: 0,
                  },
                };
              }

              return <AddNoteComp text={text} record={record} keyPar={"startMonth_W1Str"} month={record?.startMonth} index={index} week={"W1"} />;
            },
          },
          {
            title: "W2",
            dataIndex: 'startMonth_W2Str',
            key: "m1_w2",
            width: 100,
            align: "center",
            render: (text, record, index) => {
              if (record.isSection) {
                return {
                  props: {
                    colSpan: 0,
                  },
                };
              }

              return <AddNoteComp text={text} record={record} keyPar={"startMonth_W2Str"} month={record?.startMonth} index={index} week={"W2"} />;
            },
          },
          {
            title: "W3",
            dataIndex: 'startMonth_W3Str',
            key: "m1_w3",
            width: 100,
            align: "center",
            render: (text, record, index) => {
              if (record.isSection) {
                return {
                  props: {
                    colSpan: 0,
                  },
                };
              }

              return <AddNoteComp text={text} record={record} keyPar={"startMonth_W3Str"} month={record?.startMonth} index={index} week={"W3"} />;
            },
          },
          {
            title: "W4",
            dataIndex: 'startMonth_W4Str',
            key: "m1_w4",
            width: 100,
            align: "center",
            render: (text, record, index) => {
              if (record.isSection) {
                return {
                  props: {
                    colSpan: 0,
                  },
                };
              }

              return <AddNoteComp text={text} record={record} keyPar={"startMonth_W4Str"} month={record?.startMonth} index={index} week={"W4"} />;
            },
          },
          {
            title: "W5",
            dataIndex: 'startMonth_W5Str',
            key: "m1_w5",
            width: 100,
            align: "center",
            render: (text, record, index) => {
              if (record.isSection) {
                return {
                  props: {
                    colSpan: 0,
                  },
                };
              }

              return <AddNoteComp text={text} record={record} keyPar={"startMonth_W5Str"} month={record?.startMonth} index={index} week={"W5"} />;
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
            render: (text, record, index) => {
              if (record.isSection) {
                return {
                  props: {
                    colSpan: 0,
                  },
                };
              }

              return <AddNoteComp text={text} record={record} keyPar={"midMonth_MonthlyTotalStr"} month={record?.midMonth} index={index} />;
            },
          },
          {
            title: "W1",
            dataIndex: 'midMonth_W1Str',
            key: "m2_w1",
            width: 100,
            align: "center",
            render: (text, record, index) => {
              if (record.isSection) {
                return {
                  props: {
                    colSpan: 0,
                  },
                };
              }

              return <AddNoteComp text={text} record={record} keyPar={"midMonth_W1Str"} month={record?.midMonth} index={index} week={"W1"} />;
            },
          },
          {
            title: "W2",
            dataIndex: 'midMonth_W2Str',
            key: "m2_w2",
            width: 100,
            align: "center",
            render: (text, record, index) => {
              if (record.isSection) {
                return {
                  props: {
                    colSpan: 0,
                  },
                };
              }

              return <AddNoteComp text={text} record={record} keyPar={"midMonth_W2Str"} month={record?.midMonth} index={index} week={"W2"} />;
            },
          },
          {
            title: "W3",
            dataIndex: 'midMonth_W3Str',
            key: "m2_w3",
            width: 100,
            align: "center",
            render: (text, record, index) => {
              if (record.isSection) {
                return {
                  props: {
                    colSpan: 0,
                  },
                };
              }

              return <AddNoteComp text={text} record={record} keyPar={"midMonth_W3Str"} month={record?.midMonth} index={index} week={"W3"} />;
            },
          },
          {
            title: "W4",
            dataIndex: 'midMonth_W4Str',
            key: "m2_w4",
            width: 100,
            align: "center",
            render: (text, record, index) => {
              if (record.isSection) {
                return {
                  props: {
                    colSpan: 0,
                  },
                };
              }

              return <AddNoteComp text={text} record={record} keyPar={"midMonth_W4Str"} month={record?.midMonth} index={index} week={"W4"} />;
            },

          },
          {
            title: "W5",
            dataIndex: 'midMonth_W5Str',
            key: "m2_w5",
            width: 100,
            align: "center",
            render: (text, record, index) => {
              if (record.isSection) {
                return {
                  props: {
                    colSpan: 0,
                  },
                };
              }

              return <AddNoteComp text={text} record={record} keyPar={"midMonth_W5Str"} month={record?.midMonth} index={index} week={"W5"} />;
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
            render: (text, record, index) => {
              if (record.isSection) {
                return {
                  props: {
                    colSpan: 0,
                  },
                };
              }

              return <AddNoteComp text={text} record={record} keyPar={"endMonth_MonthlyTotalStr"} month={record?.endMonth} index={index} />;
            },

          },
          {
            title: "W1",
            dataIndex: 'endMonth_W1Str',
            key: "m3_w1",
            width: 100,
            align: "center",
            render: (text, record, index) => {
              if (record.isSection) {
                return {
                  props: {
                    colSpan: 0,
                  },
                };
              }

              return <AddNoteComp text={text} record={record} keyPar={"endMonth_W1Str"} month={record?.endMonth} index={index} week={"W1"} />;
            },
          },
          {
            title: "W2",
            dataIndex: 'endMonth_W2Str',
            key: "m3_w2",
            width: 100,
            align: "center",
            render: (text, record, index) => {
              if (record.isSection) {
                return {
                  props: {
                    colSpan: 0,
                  },
                };
              }

              return <AddNoteComp text={text} record={record} keyPar={"endMonth_W2Str"} month={record?.endMonth} index={index} week={"W2"} />;
            },
          },
          {
            title: "W3",
            dataIndex: 'endMonth_W3Str',
            key: "m3_w3",
            width: 100,
            align: "center",
            render: (text, record, index) => {
              if (record.isSection) {
                return {
                  props: {
                    colSpan: 0,
                  },
                };
              }

              return <AddNoteComp text={text} record={record} keyPar={"endMonth_W3Str"} month={record?.endMonth} index={index} week={"W3"} />;
            },
          },
          {
            title: "W4",
            dataIndex: 'endMonth_W4Str',
            key: "m3_w4",
            width: 100,
            align: "center",
            render: (text, record, index) => {
              if (record.isSection) {
                return {
                  props: {
                    colSpan: 0,
                  },
                };
              }

              return <AddNoteComp text={text} record={record} keyPar={"endMonth_W4Str"} month={record?.endMonth} index={index} week={"W4"} />;
            },
          },
          {
            title: "W5",
            dataIndex: 'endMonth_W5Str',
            key: "m3_w5",
            width: 100,
            align: "center",
            render: (text, record, index) => {
              if (record.isSection) {
                return {
                  props: {
                    colSpan: 0,
                  },
                };
              }

              return <AddNoteComp text={text} record={record} keyPar={"endMonth_W5Str"} month={record?.endMonth} index={index} week={"W5"} />;
            },
          },
        ],
      },
    ];

    columnCount = countLeafColumns(columns);
    return columns;
  };

  const commentColumn = [
    {
      title: "Created By",
      dataIndex: "createdByDatetime",
      key: "createdByDatetime",
      width: '200px'
    },
    {
      title: "Comment",
      dataIndex: "comments",
      key: "comments",
      render: (text) => {
        return <div dangerouslySetInnerHTML={{ __html: text }}></div>
      }
    },
    {
      title: "Added By",
      dataIndex: "addedBy",
      key: "addedBy",
      width: '200px'
    },
  ]




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
              })).filter(item => {
                if (hrModal === "DP") {
                  return item.value !== 5
                } else {
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
        {isLoading || isLoadingTable ? (
          <Skeleton active />
        ) : (
          <Table
            columns={getTableColumns()}
            dataSource={tableData}
            loading={isLoadingTable}
            pagination={false}
            scroll={{
              x: "max-content",
              y: "calc(100vh - 280px) !important",
            }}
            size="small"
            bordered
            rowClassName={(record) => {
              if (record.stage_ID === "JAllG" || record.stage_ID === "JAllNetAchieved" || record.stage_ID === "SG" ||
                record.stage_ID === "SNetAchieved" || record.stage_ID === "SJRatio" || record.stage_ID === "O2S"
              ) {
                return uplersStyle.boldRow;
              }
            }}
          />
        )}
      </div>

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

      {editTalentOfferedCTCModal && (
        <Modal
          width={300}
          centered
          footer={false}
          open={editTalentOfferedCTCModal}
          className="editStartDateModal"

          onCancel={() => { setEditTalentOfferedCTCModal(false); setofferedCTCDetails({}); }}
        >
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexDirection: 'column' }}>
            <label className={uplersStyle.formLabel}>Pipeline Needed</label>
            <div >
              {ctcPerUpdating ? <Skeleton active /> : <>{offeredCTCDeails?.symbol} <InputNumber style={{ width: '80%' }} value={offeredCTCDeails.CTC} onChange={val => setofferedCTCDetails(prev => ({ ...prev, CTC: val }))} /> {offeredCTCDeails?.code}</>}

            </div>


            {(!offeredCTCDeails?.CTC || offeredCTCDeails?.CTC <= 0) && <span style={{ color: 'red' }}>Please enter valid amount</span>}
            <button
              type="button"
              className={uplersStyle.btnPrimary}
              onClick={() => { saveNeededPipeline() }}
              disabled={ctcPerUpdating}
            >
              SAVE
            </button>
          </div>

        </Modal>
      )}

      {/* Customer overview */}
      {showChReport && (
        <Modal
          width="1200px"
          centered
          footer={null}
          open={showChReport}
          className="engagementModalStyle"
          onCancel={() => {
            setShowCHReport(false);
          }}
        >
          <div style={{ padding: "20px 15px", display: 'flex', justifyContent: 'space-between' }}>
            <h3>
              <b>{showTalentCol?.stage}</b> <b> : {achievedTotal}</b>
            </h3>

            {/* 
                    <button
                        className={uplersStyle.btnPrimary}
                        onClick={() => handleExport(listAchievedData)}
                      >
                        Export
                      </button> */}
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
                        {showTalentCol?.stage_ID === 'CompanyJobCount'
                          ? "Added Date" : "Created Date"
                        }

                      </th>



                      <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          backgroundColor: "rgb(233, 233, 233) !important",
                        }}
                      >
                        Company
                      </th>




                      {showTalentCol?.stage_ID === 'CompanyJobCount'
                        && <>
                          <th
                            style={{
                              padding: "10px",
                              border: "1px solid #ddd",
                              backgroundColor: "rgb(233, 233, 233) !important",
                            }}
                          >
                            URL
                          </th>
                          <th
                            style={{
                              padding: "10px",
                              border: "1px solid #ddd",
                              backgroundColor: "rgb(233, 233, 233) !important",
                            }}
                          >
                            Jobs Count
                          </th>
                          <th
                            style={{
                              padding: "10px",
                              border: "1px solid #ddd",
                              backgroundColor: "rgb(233, 233, 233) !important",
                            }}
                          >
                            Is Reachout
                          </th>
                        </>

                      }
                      <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          backgroundColor: "rgb(233, 233, 233) !important",
                        }}
                      >
                        Sales Person
                      </th>

                      {/*  */}
                      <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          backgroundColor: "rgb(233, 233, 233) !important",
                        }}
                      >
                        Lead Type
                      </th>


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




                        {showTalentCol?.stage_ID === 'CompanyJobCount'
                          && <>
                            <td
                              style={{ padding: "8px", border: "1px solid #ddd" }}
                            >
                              <a
                                href={`${detail.hrTitle}`}
                                style={{ textDecoration: "underline" }}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {detail.hrTitle}{" "}
                              </a>
                            </td>
                            <td
                              style={{ padding: "8px", border: "1px solid #ddd" }}
                            >
                              {detail.clientBusinessType}

                            </td>
                            <td
                              style={{ padding: "8px", border: "1px solid #ddd" }}
                            >
                              {/* <RenderReachoutDD value={detail.talentPayStr} record={detail} index={index} dataIndex={'talentPayStr'} /> */}

                            </td>
                          </>
                        }
                        <td
                          style={{ padding: "8px", border: "1px solid #ddd" }}
                        >
                          {detail.salesPerson}
                        </td>

                        <td
                          style={{ padding: "8px", border: "1px solid #ddd" }}
                        >
                          {detail.lead_Type}
                        </td>


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
                setShowCHReport(false);
              }}
            >
              Close
            </button>
          </div>
        </Modal>
      )}

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
                    scroll={{ x: "1600px", y: "480px" }}
                  />
                </div>
              )}

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
                  onCancel={() => { setSplitHR(false); setHRID('') }}
                  getHRID={getHRID}
                  getHRnumber={getHRnumber.hrNumber}
                  isHRHybrid={getHRnumber.isHybrid}
                  companyID={getHRnumber.companyID}
                  impHooks={{ groupList, setGroupList, isSplitLoading, setIsSplitLoading }}
                />
              </Modal>

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

      {showAnticipatedReport && (
        <Modal
          transitionName=""
          width="1050px"
          centered
          footer={null}
          open={showAnticipatedReport}
          className="engagementModalStyle"
          onCancel={() => {
            setSearchTerm("");
            setShowAnticipatedReport(false);
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



              </div>

              {achievedLoading ? (
                <div>
                  <Skeleton active />
                </div>
              ) : (
                <div style={{ margin: "5px 10px" }}>
                  <Table
                    dataSource={listAchievedData}
                    columns={AnticipatedColumns}
                    pagination={false}
                    scroll={{ x: "1600px", y: "480px" }}
                  />
                </div>
              )}


              <div style={{ padding: "10px 0" }}>
                <button
                  className={uplersStyle.btnCancle}
                  // disabled={isAddingNewTask}
                  onClick={() => {
                    setSearchTerm("");
                    setShowAnticipatedReport(false);
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
          <div style={{ padding: "20px 15px", display: 'flex', justifyContent: 'space-between' }}>
            <h3>
              <b>{showTalentCol?.stage}</b> <b> : {achievedTotal}</b>
            </h3>


            <button
              className={uplersStyle.btnPrimary}
              onClick={() => handleExport(listAchievedData)}
            >
              Export
            </button>
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
                        {/* {showTalentCol?.stage === "New Clients"
                                ? "Created Date"
                                : "Company Created Date"} */}
                        Created Date
                      </th>

                      {showTalentCol?.stage === 'Added HR (New)' && <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          background: "rgb(233, 233, 233) !important",
                        }}
                      >
                        TR Updated Date
                      </th>}

                      {showTalentCol?.category !== "CF" &&
                        showTalentCol?.category !== "CH" && showTalentCol?.stage !== "Opening Balance" && showTalentCol?.stage !== 'Added HR (New)' && (
                          <th
                            style={{
                              padding: "10px",
                              border: "1px solid #ddd",
                              background: "rgb(233, 233, 233) !important",
                            }}
                          >
                            {showTalentCol?.stage === "Joining" ||
                              showTalentCol?.stage === "Selections/Closures" || showTalentCol?.stage === 'Joined'
                              ? showTalentCol?.stage
                              : showTalentCol?.stage === "Preonboarding" ? "Offer" : "Action"}{" "}
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
                            {showTalentCol?.stage === "Not Accepted HRs" && <th
                              style={{
                                padding: "10px",
                                border: "1px solid #ddd",
                                backgroundColor:
                                  "rgb(233, 233, 233) !important",
                              }}
                            >
                              Reason
                            </th>}
                            {(showTalentCol?.stage !== 'Selections/Closures' && showTalentCol?.stage !== 'Joined' && showTalentCol?.stage !== 'Preonboarding') && <th
                              style={{
                                padding: "10px",
                                border: "1px solid #ddd",
                                backgroundColor:
                                  "rgb(233, 233, 233) !important",
                              }}
                            >
                              TR
                            </th>}
                            <th
                              style={{
                                padding: "10px",
                                border: "1px solid #ddd",
                                backgroundColor:
                                  "rgb(233, 233, 233) !important",
                              }}
                            >
                              {showTalentCol?.stage === "Joining" || showTalentCol?.stage === "Joined" ||
                                showTalentCol?.stage === "Selections/Closures"
                                ? "Revenue"
                                : " 1TR Pipeline"}
                            </th>
                            {showTalentCol?.stage !== "Joining" && showTalentCol?.stage !== "Joined" &&
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

                      {/* <th
                              style={{
                                padding: "10px",
                                border: "1px solid #ddd",
                                backgroundColor: "rgb(233, 233, 233) !important",
                              }}
                            >
                              Client Business Type
                            </th> */}
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
                            {(showTalentCol?.stage !== "Not Accepted HRs" && (showTalentCol?.stage === "Joined" || showTalentCol?.stage === 'Selections/Closures')) && <th
                              style={{
                                padding: "10px",
                                border: "1px solid #ddd",
                                backgroundColor:
                                  "rgb(233, 233, 233) !important",
                              }}
                            >
                              {showTalentCol?.stage === "Lost (Pipeline)" ? 'Reason' : 'Talent'}
                            </th>}

                            {!(showTalentCol?.stage === "Joined" || showTalentCol?.stage === 'Selections/Closures' || showTalentCol?.stage === 'Preonboarding' || showTalentCol?.stage === 'Added HR (New)') && <th
                              style={{
                                padding: "10px",
                                border: "1px solid #ddd",
                                backgroundColor:
                                  "rgb(233, 233, 233) !important",
                              }}
                            >
                              Carry Forward Status
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

                        {showTalentCol?.stage === 'Added HR (New)' && <td
                          style={{
                            padding: "8px",
                            border: "1px solid #ddd",
                          }}
                        >
                          {detail.actionDateStr}
                        </td>}

                        {showTalentCol?.category !== "CF" &&
                          showTalentCol?.category !== "CH" && showTalentCol?.stage !== "Opening Balance" && showTalentCol?.stage !== 'Added HR (New)' && (
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
                              {showTalentCol?.stage === "Not Accepted HRs" && <td
                                style={{
                                  minWidth: '300px',
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                }}
                              >
                                {detail.talent}
                              </td>}
                              {(showTalentCol?.stage !== 'Selections/Closures' && showTalentCol?.stage !== 'Joined' && showTalentCol?.stage !== 'Preonboarding') && <td
                                style={{
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                }}
                              >
                                {detail.tr}
                              </td>}
                              <td
                                style={{
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                }}
                              >
                                {detail.hrPipelineStr}
                              </td>
                              {showTalentCol?.stage !== "Joining" && showTalentCol?.stage !== "Joined" &&
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

                        {/* <td
                                style={{ padding: "8px", border: "1px solid #ddd" }}
                              >
                                {detail.clientBusinessType}
                              </td> */}
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
                              {(showTalentCol?.stage !== "Not Accepted HRs" && (showTalentCol?.stage === "Joined" || showTalentCol?.stage === 'Selections/Closures')) && <td
                                style={{
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                  minWidth: showTalentCol?.stage === "Lost (Pipeline)" ? '250px' : '',
                                  // whiteSpace: "normal",    // ✅ allow wrapping
                                  // wordBreak: "break-word",
                                }}
                              >
                                {detail.talent}
                              </td>}

                              {!(showTalentCol?.stage === "Joined" || showTalentCol?.stage === 'Selections/Closures' || showTalentCol?.stage === 'Preonboarding' || showTalentCol?.stage === 'Added HR (New)') && <td
                                style={{
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                }}
                              >
                                {All_Hiring_Request_Utils.GETHRSTATUS(
                                  Number(detail.carryFwd_HRStatusCode),
                                  detail.carryFwd_HRStatus
                                )}
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

      {showReferenceReport && (
        <Modal
          width="1200px"
          centered
          footer={null}
          open={showReferenceReport}
          className="engagementModalStyle"
          onCancel={() => {
            setShowReferenceReport(false);
          }}
        >
          <div style={{ padding: "20px 15px", display: 'flex', justifyContent: 'space-between' }}>
            <h3>
              {/* <b>{showTalentCol?.stage}</b> <b> : {achievedTotal}</b> */}
              <b>Delight Reference</b> <b> : ({achievedTotal})</b>
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

                        Reference Date
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          background: "rgb(233, 233, 233) !important",
                        }}
                      >

                        Company
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          background: "rgb(233, 233, 233) !important",
                        }}
                      >

                        HR Number
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          background: "rgb(233, 233, 233) !important",
                        }}
                      >

                        HR Title
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          background: "rgb(233, 233, 233) !important",
                        }}
                      >

                        Ref. By
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          background: "rgb(233, 233, 233) !important",
                        }}
                      >

                        Name
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          background: "rgb(233, 233, 233) !important",
                        }}
                      >

                        Email ID
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          background: "rgb(233, 233, 233) !important",
                        }}
                      >

                        Remarks
                      </th>

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
                          {detail.refCreatedDate}
                        </td>


                        <td
                          style={{ padding: "8px", border: "1px solid #ddd" }}
                        >
                          <a
                            href={`/viewCompanyDetails/${detail.company_ID}`}
                            style={{ textDecoration: "underline" }}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {detail.companyName}{" "}
                          </a>
                          {detail.companyCategory === "Diamond" && (
                            <img
                              src={Diamond}
                              alt="info"
                              style={{ width: "16px", height: "16px" }}
                            />
                          )}
                        </td>
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
                              {detail.hrNumber}
                            </a>
                          ) : (
                            detail.hrNumber
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

                        <td
                          style={{ padding: "8px", border: "1px solid #ddd" }}
                        >
                          {detail.referenceBy}
                        </td>
                        <td
                          style={{ padding: "8px", border: "1px solid #ddd" }}
                        >
                          {detail.referenceGivenName}
                        </td>
                        <td
                          style={{ padding: "8px", border: "1px solid #ddd" }}
                        >
                          {detail.referenceGivenEmailID}
                        </td>
                        <td
                          style={{ minWidth: "350px", padding: "8px", border: "1px solid #ddd" }}
                        >
                          {detail.referenceRemarks}
                        </td>


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
                setShowReferenceReport(false);
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

export default WeeklyWCGR