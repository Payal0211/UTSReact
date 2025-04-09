import { EmailRegEx, InputType } from "constants/application";
import onboardList from "./onBoard.module.css";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import { ReactComponent as SearchSVG } from "assets/svg/search.svg";
import { ReactComponent as FunnelSVG } from "assets/svg/funnel.svg";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import WithLoader from "shared/components/loader/loader";
import {
  Table,
  Radio,
  Modal,
  message,
  Tooltip,
  Dropdown,
  Menu,
  Skeleton,
  Select,
} from "antd";
import {
  useEffect,
  useMemo,
  useState,
  useCallback,
  Suspense,
  useRef,
} from "react";
import { MasterDAO } from "core/master/masterDAO";
import { HTTPStatusCode } from "constants/network";
import LogoLoader from "shared/components/loader/logoLoader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link, useNavigate } from "react-router-dom";
import { allEngagementConfig } from "modules/engagement/screens/engagementList/allEngagementConfig";
import { allHRConfig } from "modules/hiring request/screens/allHiringRequest/allHR.config";
import { engagementRequestDAO } from "core/engagement/engagementDAO";
import UTSRoutes from "constants/routes";
import OnboardFilerList from "./OnboardFilterList";
import Handshake from "assets/svg/handshake.svg";
import Rocket from "assets/svg/rocket.svg";
import FeedBack from "assets/svg/feedbackReceived.png";
import RenewEng from "assets/svg/renewEng.png";
import { ReactComponent as CloseSVG } from "assets/svg/close.svg";
import LostEng from "assets/svg/lostEng.png";
import Smile from "assets/svg/smile.svg";
import Sad from "assets/svg/sademo.svg";
import Briefcase from "assets/svg/briefcase.svg";
import { downloadToExcel } from "modules/report/reportUtils";
import { engagementUtils } from "modules/engagement/screens/engagementList/engagementUtils";
import EngagementFeedback from "modules/engagement/screens/engagementFeedback/engagementFeedback";
import EngagementAddFeedback from "modules/engagement/screens/engagementAddFeedback/engagementAddFeedback";
import { useForm } from "react-hook-form";
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import HRSelectField from "modules/hiring request/components/hrSelectField/hrSelectField";
import moment from "moment";
import HROperator from "modules/hiring request/components/hroperator/hroperator";
import { ReactComponent as ArrowDownSVG } from "assets/svg/arrowDown.svg";

import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Scrollbar, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/navigation";
import "swiper/css/pagination";
import EngagementInvoice from "modules/engagement/screens/engagementInvoice/engagementInvoice";
import EngagementEnd from "modules/engagement/screens/endEngagement/endEngagement";
import EngagementCancel from "modules/engagement/screens/cancelEngagement/cancelEngagement";
import EngagementBillRateAndPayRate from "modules/engagement/screens/engagementBillAndPayRate/engagementBillRateAndPayRate";
import EditAllBRPR from "modules/engagement/screens/editAllBRPR/editAllBRPR";
import RenewEngagement from "modules/engagement/screens/renewEngagement/renewEngagement";
import LeaveUppdate from "./leaveUppdate";
import { UserSessionManagementController } from "modules/user/services/user_session_services";

const onBoardListConfig = ({
  getEngagementModal,
  setEngagementModal,
  setFeedBackData,
  setHRAndEngagementId,
  setFilteredData,
  setISEditTSC,
  setTSCONBoardData,
  setEngagementBillAndPayRateTab,
  setActiveTab,
  setAllBRPRdata,
  editAMModalcontroler,
  setLeaveUpdate,
  setTalentDetails,
  navigate,
  getInvoiceInfo,
  ShowInvoiceCreationCTA,
}) => {
  return [
    {
      title: "    ",
      dataIndex: "action",
      key: "action",
      align: "left",
      width: "180px",
      fixed: "left", // Fix this column on the left
      render: (_, param, index) => {
        let listItemData = [
          {
            label: param.engagemenID,
            key: "HRDetails",
            IsEnabled: false,
          },
          {
            label: "Add Invoice Details",
            key: "addInvoiceDetails",
            IsEnabled: true,
          },
          {
            label: "Send Custom Email",
            key: "sendCustomEmail",
            IsEnabled: true,
          },
        ];
        // if(param?.tscName && (param?.currentStatus !== "In Replacement")){
        // 	listItemData.push(
        // 		{
        // 			label: 'Edit TSC Name',
        // 			key: 'editTSCName',
        // 			IsEnabled: true,
        // 		},
        // 	);
        // }
        if (!param?.lastWorkingDate) {
          listItemData.push({
            label: "Update Leaves",
            key: "updateLeaves",
            IsEnabled: true,
          });
          listItemData.push({
            label: "End Engagement",
            key: "endEngagement",
            IsEnabled: true,
          });
          listItemData.push({
            label: "Cancel Engagement",
            key: "cancelEngagement",
            IsEnabled: true,
          });
        }
        if (
          param?.typeOfHR === "Contractual" &&
          param?.payout_BillRate !== ""
        ) {
          listItemData.push(
            {
              label: "Edit Bill Rate",
              key: "editRateBillRate",
              IsEnabled: true,
            },
            {
              label: "Edit Pay Rate",
              key: "editPayRate",
              IsEnabled: true,
            },
            {
              label: "Edit All BR PR",
              key: "editAllBRPR",
              IsEnabled: true,
            }
          );
        }
        if (
          param?.isRenewalAvailable === 1 &&
          param?.isRenewalContract === 0 &&
          param?.isOngoing !== "Ongoing"
        ) {
          listItemData.push({
            label: "Renew Engagement",
            key: "reNewEngagement",
            IsEnabled: true,
          });
        }
        if (
          param?.talentLegal_StatusID === 2 &&
          param?.clientLegal_StatusID === 2 &&
          param?.isContractCompleted !== 1 &&
          param?.isHRManaged === 0 &&
          param?.currentStatus !== "In Replacement" &&
          (param?.replacementID === 0 || param?.replacementID === null)
        ) {
          listItemData.push({
            label: "Replace Engagement",
            key: "replaceEngagement",
            IsEnabled: true,
          });
        }
      
        if (ShowInvoiceCreationCTA && param?.isInvoiceCreated === 0) {
          listItemData.push({
            label: "Create Invoice",
            key: "createInvoice",
            IsEnabled: true,
          });
        }
        return (
          <HROperator
            title="Action"
            icon={<ArrowDownSVG style={{ width: "16px" }} />}
            backgroundColor={`var(--color-sunlight)`}
            iconBorder={`1px solid var(--color-sunlight)`}
            isDropdown={true}
            listItem={listItemData}
            menuAction={(item) => {
              switch (item.key) {
                case "Replace Engagement": {
                  setEngagementModal({
                    ...getEngagementModal,
                    engagementReplaceTalent: true,
                  });
                  setFilteredData({
                    ...param,
                    onboardID: param.id,
                    hrID: param.hiringId,
                  });
                  break;
                }
                case "Update Leaves": {
                  setLeaveUpdate(true);
                  setTalentDetails(param);
                }
                case "Edit TSC Name": {
                  setISEditTSC(true);
                  setTSCONBoardData({
                    onboardID: param.onboardID,
                    engagementID: param.engagementID,
                    talentName: param.talentName,
                    tscName: param.tscName,
                  });
                  break;
                }
                case "Renew Engagement": {
                  setEngagementModal({
                    ...getEngagementModal,
                    engagementRenew: true,
                  });
                  setFilteredData({
                    ...param,
                    onboardID: param.id,
                    hrID: param.hiringId,
                  });
                  break;
                }
                case "End Engagement": {
                  setEngagementModal({
                    ...getEngagementModal,
                    engagementEnd: true,
                  });
                  setFilteredData({
                    ...param,
                    onboardID: param.id,
                    hrID: param.hiringId,
                  });
                  break;
                }
                case "Cancel Engagement": {
                  setEngagementModal({
                    ...getEngagementModal,
                    engagementCancel: true,
                  });
                  setFilteredData({
                    ...param,
                    onboardID: param.id,
                    hrID: param.hiringId,
                  });
                  break;
                }
                case "Edit Bill Rate": {
                  setEngagementModal({
                    ...getEngagementModal,
                    engagementBillRateAndPayRate: true,
                  });
                  setEngagementBillAndPayRateTab("1");
                  setActiveTab("1");
                  setFilteredData({
                    ...param,
                    onboardID: param.id,
                    hrID: param.hiringId,
                  });
                  break;
                }
                case "Edit Pay Rate": {
                  setEngagementModal({
                    ...getEngagementModal,
                    engagementBillRateAndPayRate: true,
                  });
                  setEngagementBillAndPayRateTab("2");
                  setActiveTab("2");
                  setFilteredData({
                    ...param,
                    onboardID: param.id,
                    hrID: param.hiringId,
                  });
                  break;
                }
                case "Edit All BR PR": {
                  setEngagementModal({
                    ...getEngagementModal,
                    engagementEditAllBillRateAndPayRate: true,
                  });
                  setAllBRPRdata({
                    ...param,
                    onboardID: param.id,
                    hrID: param.hiringId,
                  });
                  break;
                }
                case "Add Invoice Details": {
                  setEngagementModal({
                    ...getEngagementModal,
                    engagementInvoice: true,
                  });
                  setFilteredData({
                    ...param,
                    onboardID: param.id,
                    hrID: param.hiringId,
                  });
                  break;
                }
                case "Send Custom Email": {
                  navigate(
                    `/viewOnboardDetails/${param.id}/${
                      param.isOngoing === "Ongoing" ? true : false
                    }`,
                    {
                      state: {
                        tabToActive: "Custom Email",
                      },
                    }
                  );
                  break;
                }
                case "Create Invoice": {
                  setEngagementModal({
                    ...getEngagementModal,
                    showInvoice: true,
                  });
                  getInvoiceInfo(param);
                  break;
                }
                default:
                  break;
              }
            }}
          />
        );
      },
    },
    // {
    //   title: "Created Date",
    //   dataIndex: "createdByDatetime",
    //   key: "createdByDatetime",
    //   align: "left",
    //   width: '150px',
    //   render:(text)=>{
    //       let dateArr = text.split(" ")
    //       return dateArr[0]
    //   }
    // },

    {
      title: "Eng. ID/HR#",
      dataIndex: "engagemenID",
      key: "engagemenID",
      align: "left",
      width: "200px",
      fixed: "left", // Fix this column on the left
      render: (text, result) => {
        return (
          <>
            <Link
              to={`/viewOnboardDetails/${result.id}/${
                result.isOngoing === "Ongoing" ? true : false
              }`}
              target="_blank"
              style={{
                color: `var(--uplers-black)`,
                textDecoration: "underline",
              }}
            >
              {" "}
              {result?.engagemenID.slice(0, result?.engagemenID?.indexOf("/"))}
            </Link>
            <br />

            <Link
              to={`/allhiringrequest/${result?.hiringId}`}
              target="_blank"
              style={{ color: "#006699", textDecoration: "underline" }}
            >
              {result?.engagemenID.slice(result?.engagemenID?.indexOf("/"))}
            </Link>
          </>
        );
      },
    },
    {
      title: "Eng. Count",
      dataIndex: "engagementCount",
      key: "engagementCount",
      align: "left",
      width: "95px",
    },
    {
      title: "Eng. Type",
      dataIndex: "engContractType",
      key: "engContractType",
      align: "left",
      width: "180px",
      render: (text, result) => {
        return (
          <p
            style={{
              color: engagementUtils.getClientFeedbackColor(
                result?.feedbackType
              ),
              // textDecoration: 'underline',
              // display: 'inline-flex',
              // width: 'max-content',
            }}
          >
            {text}
          </p>
        );
      },
    },
    {
      title: "Job Title",
      dataIndex: "position",
      key: "position",
      align: "left",
      width: "180px",
    },
    {
      title: "Talent ID",
      dataIndex: "talent_UplersID",
      key: "talent_UplersID",
      align: "left",
      width: "150px",
    },
    {
      title: "Talent",
      dataIndex: "talent",
      key: "talent",
      align: "left",
      width: "200px",
    },
    {
      title: "Talent Email",
      dataIndex: "talentEmail",
      key: "talentEmail",
      align: "left",
      width: "250px",
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
      align: "left",
      width: "200px",
    },
    {
      title: "Client",
      dataIndex: "client",
      key: "client",
      align: "left",
      width: "200px",
    },
    {
      title: "AM",
      dataIndex: "amAssignmentuser",
      key: "amAssignmentuser",
      align: "left",
      width: "150px",
      render: (text, data) => {
        return (
          <div
            className={onboardList.amName}
            onClick={() => {
              editAMModalcontroler(data.id);
            }}
          >
            {text}
          </div>
        );
      },
    },
    {
      title: "Eng. Status",
      dataIndex: "contractStatus",
      key: "contractStatus",
      align: "left",
      width: "150px",
    },
    {
      title: "Joining Date",
      dataIndex: "joiningdate",
      key: "joiningdate",
      align: "left",
      width: "150px",
    },
    {
      title: "Start Date",
      dataIndex: "contractStartDate",
      key: "contractStartDate",
      align: "left",
      width: "120px",
    },
    {
      title: (
        <>
          LWD - <br />
          End Date
        </>
      ),
      dataIndex: "contractEndDate",
      key: "contractEndDate",
      align: "left",
      width: "150px",
      render: (text, result) => {
        return (
          <>
            {result?.lastWorkingDate ? result?.lastWorkingDate : "NA"}
            <br />- {text}
          </>
        );
      },
    },
    // {
    //   title: "Last Working Date",
    //   dataIndex: "lastWorkingDate",
    //   key: "lastWorkingDate",
    //   align: "left",
    //   width: '150px',
    // },
    {
      title: "BR / DP Amount",
      dataIndex: "payout_BillRate",
      key: "payout_BillRate",
      align: "left",
      width: "150px",
      render: (text, result) => {
        return `${text} `;
      },
    },
    {
      title: "PR",
      dataIndex: "payout_PayRate",
      key: "payout_PayRate",
      align: "left",
      width: "150px",
      render: (text, result) => {
        return `${text} `;
      },
    },
    {
      title: "Uplers / EOR Fees",
      dataIndex: "uplersFees",
      key: "uplersFees",
      align: "left",
      width: "150px",
      // render:(_,result)=>{
      //   return `${result.currencySign} ` + (+result.final_HR_Cost - +result.talent_Cost).toFixed(2)
      // }
    },
    {
      title: (
        <>
          NR / DP <br />
          (%)
        </>
      ),
      dataIndex: "nrPercentage",
      key: "nrPercentage",
      align: "left",
      width: "100px",
      render: (text, result) => {
        return `${result.nrPercentage !== 0 ? result.nrPercentage : ""}  ${
          +result.dP_Percentage !== 0 ? result.dP_Percentage : ""
        }`;
      },
    },
    {
      title: "INR Exch. Rate",
      dataIndex: "payout_Talent_CurrencyExchangeRate",
      key: "payout_Talent_CurrencyExchangeRate",
      align: "left",
      width: "150px",
      // render:(_,result)=>{
      //   return `${result.currencySign} ` + (+result.final_HR_Cost - +result.talent_Cost).toFixed(2)
      // }
    },
    {
      title: (
        <>
          Per Day PR <br /> (INR)
        </>
      ),
      dataIndex: "payout_PerDayTalentCost_INR",
      key: "payout_PerDayTalentCost_INR",
      align: "left",
      width: "120px",
      render: (text, result) => {
        return text ? `₹ ${text}` : "";
      },
    },
    {
      title: (
        <>
          No. of <br /> days
        </>
      ),
      dataIndex: "payout_TotalDaysinMonth",
      key: "payout_TotalDaysinMonth",
      align: "left",
      width: "80px",
    },
    {
      title: (
        <>
          Final PR <br /> (INR)
        </>
      ),
      dataIndex: "payout_Talent_FinalPayOutInINR",
      key: "payout_Talent_FinalPayOutInINR",
      align: "left",
      width: "150px",
      render: (text, result) => {
        return text ? `₹ ${text}` : "";
      },
    },

    {
      title: (
        <>
          Client Feedback <br />
          Last Feedback Date
        </>
      ),
      dataIndex: "clientFeedback",
      key: "clientFeedback",
      align: "left",
      width: "200px",
      render: (text, result) =>
        result?.clientFeedback === 0 && result?.id && result?.hiringId ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <a
              href="javascript:void(0);"
              style={{
                color: engagementUtils.getClientFeedbackColor(
                  result?.feedbackType
                ),
                textDecoration: "underline",
                display: "inline-flex",
                width: "max-content",
              }}
              onClick={() => {
                setHRAndEngagementId({
                  talentName: result?.talent,
                  engagementID: result?.engagemenID,
                  hrNumber: result?.hR_Number,
                  onBoardId: result?.id,
                  hrId: result?.hiringId,
                });
                setEngagementModal({
                  engagementFeedback: false,
                  engagementAddFeedback: true,
                });
              }}
            >
              {"Add"}
            </a>
            {result?.lastFeedbackDate}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <a
              href="javascript:void(0);"
              style={{
                color: engagementUtils.getClientFeedbackColor(
                  result?.feedbackType
                ),
                textDecoration: "underline",
                display: "inline-flex",
                width: "max-content",
              }}
              onClick={() => {
                setFeedBackData((prev) => ({
                  ...prev,
                  onBoardId: result?.id,
                }));
                setHRAndEngagementId({
                  talentName: result?.talent,
                  engagementID: result?.engagemenID,
                  hrNumber: result?.hR_Number,
                  onBoardId: result?.id,
                  hrId: result?.hiringId,
                });
                setEngagementModal({
                  engagementFeedback: true,
                  engagementAddFeedback: false,
                });
              }}
            >
              {"View/Add"}
            </a>
            {result?.lastFeedbackDate}
          </div>
        ),
    },
    {
      title: "Exch. Rate",
      dataIndex: "payout_CurrencyExchangeRate",
      key: "payout_CurrencyExchangeRate",
      align: "left",
      width: "100px",
    },
    {
      title: "Uplers Fees ( USD )",
      dataIndex: "uplersFees_USD",
      key: "uplersFees_USD",
      align: "left",
      width: "150px",
      // render:(_,result)=>{
      //   return `${result.currencySign} ` + (+result.final_HR_Cost - +result.talent_Cost).toFixed(2)
      // }
    },
    {
      title: "Uplers Fees ( INR )",
      dataIndex: "uplersFees_INR",
      key: "uplersFees_INR",
      align: "left",
      width: "150px",
      // render:(_,result)=>{
      //   return `${result.currencySign} ` + (+result.final_HR_Cost - +result.talent_Cost).toFixed(2)
      // }
    },
    {
      title: "Invoice #",
      dataIndex: "payout_ESales_InvoiceNumber",
      key: "payout_ESales_InvoiceNumber",
      align: "left",
      width: "150px",
      // render:(_,result)=>{
      //   return `${result.currencySign} ` + (+result.final_HR_Cost - +result.talent_Cost).toFixed(2)
      // }
    },
  ];
};

function OnBoardList() {
  const navigate = useNavigate();
  const [onBoardListData, setOnBoardListData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5000);
  const pageSizeOptions = [100, 200, 300, 500, 1000, 5000];
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchText, setSearchText] = useState("");

  const [filtersList, setFiltersList] = useState([]);
  const [filteredTagLength, setFilteredTagLength] = useState(0);
  const [getHTMLFilter, setHTMLFilter] = useState(false);
  const [isAllowFilters, setIsAllowFilters] = useState(false);
  const [appliedFilter, setAppliedFilters] = useState(new Map());
  const [checkedState, setCheckedState] = useState(new Map());
  const [tableFilteredState, setTableFilteredState] = useState({
    totalrecord: 100,
    pagenumber: 1,
    filterFields_OnBoard: {
      clientFeedback: "",
      typeOfHiring: "",
      currentStatus: "",
      tscName: "",
      company: "",
      geo: "",
      position: "",
      engagementTenure: 0,
      nbdName: "",
      amName: "",
      pending: "",
      searchMonth: new Date().getMonth() + 1,
      searchYear: new Date().getFullYear(),
      searchType: "",
      islost: "",
      EngType: "A",
      toDate: "",
      fromDate: "",
      SummaryFilterOption: "AT",
      EngagementOption: "All",
      onBoardLostReasons: "",
      engagementStatus: "",
    },
  });
  var date = new Date();
  const [monthDate, setMonthDate] = useState(new Date());
  const [startDate, setStartDate] = useState(
    new Date(date.getFullYear(), date.getMonth() - 1, date.getDate())
  );
  const [endDate, setEndDate] = useState(new Date(date));

  const [filteredData, setFilteredData] = useState(null);
  const [isEditTSC, setISEditTSC] = useState(false);
  const [TSCONBoardData, setTSCONBoardData] = useState({});
  const [engagementBillAndPayRateTab, setEngagementBillAndPayRateTab] =
    useState("1");
  const [activeTab, setActiveTab] = useState("");
  const [allBRPRdata, setAllBRPRdata] = useState(null);
  const [rateReason, setRateReason] = useState(undefined);
  const [getBillRate, setBillRate] = useState(0);
  const [getPayRate, setPayRate] = useState(0);

  const {
    register: AMregister,
    handleSubmit: AMSubmit,
    setValue: AMsetValue,
    resetField: resetAMField,
    formState: { errors: AMErrors },
  } = useForm();

  const {
    register: invoiceRegister,
    handleSubmit: invoiceSubmit,
    setValue: invoiceSetValue,
    watch: watchInvoice,
    resetField: resetInvoiceField,
    clearErrors: clearInvoiceError,
    formState: { errors: invoiceErrors },
  } = useForm();
  const [invoiceDate, setInvoiceDate] = useState(new Date());
  const [lineItems,setLineItems] = useState([])
  const [invData, setInvData] = useState({});
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(false);
  const [controlledPaymentTermValue, setControlledPaymentTermValue] =
    useState("");
  const [isInvoiceAvailable, setIsInvoiceAvailable] = useState(false);

  const [editAMModal, setEditAMModal] = useState(false);
  const [AMLIST, setAMLIST] = useState([]);
  const [AMDetails, setAMDetails] = useState({});
  const [AMLOADING, setAMLOADING] = useState(false);

  const [userData, setUserData] = useState({});
  // const [searchMenu,setSearchMenu] = useState('');

  useEffect(() => {
    const getUserResult = async () => {
      let userData = UserSessionManagementController.getUserSession();
      if (userData) setUserData(userData);
    };
    getUserResult();
  }, []);

  //   var firstDay =
  //   startDate !== null
  //     ? startDate
  //     : new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
  // var lastDay =
  //   endDate !== null
  //     ? endDate
  //     : new Date(date);

  // useEffect(() => {
  //   setStartDate(firstDay)
  //   setEndDate(lastDay)
  // }, []);

  const [getEngagementModal, setEngagementModal] = useState({
    engagementFeedback: false,
    engagementRenew: false,
    engagementBillRate: false,
    engagementPayRate: false,
    engagementOnboard: false,
    engagementAddFeedback: false,
    engagementReplaceTalent: false,
    engagementBillRateAndPayRate: false,
    engagementEnd: false,
    engagementInvoice: false,
    engagementEditAllBillRateAndPayRate: false,
    engagementCancel: false,
    showInvoice: false,
  });
  const [getFeedbackFormContent, setFeedbackFormContent] = useState({});
  const [feedBackData, setFeedBackData] = useState({
    totalRecords: 10,
    pagenumber: 1,
    onBoardId: "",
  });
  const [getHRAndEngagementId, setHRAndEngagementId] = useState({
    hrNumber: "",
    engagementID: "",
    talentName: "",
    onBoardId: "",
    hrId: "",
  });

  const [getClientFeedbackList, setClientFeedbackList] = useState([]);
  const [getFeedbackPagination, setFeedbackPagination] = useState({
    totalRecords: 0,
    pageIndex: 1,
    pageSize: 5000,
  });
  const [feedBackSave, setFeedbackSave] = useState(false);
  const [feedBackTypeEdit, setFeedbackTypeEdit] = useState("Please select");
  const [dateTypeFilter, setDateTypeFilter] = useState(0);

  const [leaveUpdate, setLeaveUpdate] = useState(false);
  const [talentDetails, setTalentDetails] = useState({});

  const editAMModalcontroler = async (id) => {
    setEditAMModal(true);
    let result = await engagementRequestDAO.getAMDetailsDAO(id);

    if (result?.statusCode === HTTPStatusCode.OK) {
      let data = result.responseBody.details;
      setAMLIST(data.AMList.map((am) => ({ id: am.text, value: am.value })));
      setAMDetails(data.PayOut_Basic_Informtion);
      AMsetValue("amName", data.PayOut_Basic_Informtion.aM_UserName);
    }
  };

  const getInvoiceInfo = async (param) => {
    let payload = {
      companyId: param.companyID,
      year: moment(monthDate).format("YYYY"),
      month: moment(monthDate).format("M"),
    };
    setIsLoadingInvoice(true);
    const result = await engagementRequestDAO.GetInvoiceDetails(payload);
    setIsLoadingInvoice(false);

    if (result.statusCode === 200) {
      if (result.responseBody.details.length > 0) {
        setIsInvoiceAvailable(true);
      }
      let data = result.responseBody.details[0];
      // let dateValArr = data.invoiceDate.split(' ')
      // let dateStr = `${dateValArr[0]} ${dateValArr[2]} ${dateValArr[3]}`
      setInvData(data);
      invoiceSetValue("company", data.company);
      invoiceSetValue("client", data.client_EmailID);
      invoiceSetValue("zohoCustomer", data.zoho_Client_EmailID);
      invoiceSetValue("currency", data.invoice_CurrencyCode);
      invoiceSetValue("paymentTerm", data.paymentTermDays);
      setControlledPaymentTermValue(data.paymentTermDays);
      // invoiceSetValue()
      setInvoiceDate(new Date(data.invoiceDate));

      setLineItems(result.responseBody.details.map(item=>({itemName:item.itemName,
         lineItem:item.lineItem,
         rate:item.rate,
         qty:item.qty,
         lineItemTotal:item.lineItemTotal})))
      // console.log('data',data.invoiceDate,moment(data.invoiceDateStr).format('DD-MM-YYYY'), new Date(data.invoiceDateStr), data )
    } else {
      setIsInvoiceAvailable(false);
    }
  };

const calDueDate = (date, term)=>{
  let dueDate = new Date(date);
  dueDate.setDate(dueDate.getDate() + term);
  return  dueDate
}
  const saveInvoice = async (d) => {
    let dueDate = calDueDate(invoiceDate, +d.paymentTerm) ;
    let pl = {
      invoiceDto: {
        id: 0,
        invoiceId: 0,
        customerName: invData?.zoho_Client, // zoho_Client
        customerId: invData?.zoho_CustomerID, // zoho_CustomerID
        status: "draft",
        invoiceDate: moment(invoiceDate).format("yyyy-MM-DD"), //invoiceDate
        currencyCode: invData?.invoice_CurrencyCode, //invoice_CurrencyCode
        exchangeRate: invData?.exchangeRate, //exchangeRate
        paymentTermsId: invData?.paymentTermsID, //paymentTermsID
        invoiceSubtotal: invData?.finalTotal, //finalTotal
        invoiceAmount: invData?.finalTotal, //finalTotal
        createdBy: userData?.UserId, // loggedin userid
        modifiedBy: userData?.UserId, // loggedin userid
        billingAddress: invData?.billing_Address, //billing_Address
        shippingAddress: invData?.billing_Address, //billing_Address
        salespersonId: invData?.salesPersonID, //salesPersonID
        salespersonName: invData?.salesPersonName, //salesPersonName
        companyId: invData?.companyID, //companyID
        contactId: invData?.contactID, //contactID
        companyName: d.company, //company
        organizationId: invData?.organizationID, //organizationID
        customerDefaultBillingAddress: invData?.billing_Address, //billing_Address
        dueDate: moment(dueDate).format("yyyy-MM-DD") , //duedate
        paymentExpectedDate: moment(dueDate).format("yyyy-MM-DD") , //duedate
        lastPaymentDate: null, //duedate
        zohoContactID: invData?.zohoContactID, //zohoContactID
        paymentTermDays: d.paymentTerm, //paymentTermDays
        payment_Terms: `Net ${d.paymentTerm}`, // paymentTerms
        zohoCustomerEmailID: d.zohoCustomer, //zoho_Client_EmailID
        clientEmailID: d.client, //client_EmailID
      },
      invoiceLineItemDto: lineItems.map(i=>(
        {
              itemName: i?.itemName,
              description: i?.lineItem, //lineItem
              rate: i?.rate, //rate
              quantity: i?.qty, //qty
              itemTotal: i?.lineItemTotal, //lineItemTotal
            }
      ))
    };
    setIsLoadingInvoice(true);
    const result = await engagementRequestDAO.UpdateInvoiceDetails(pl);
    setIsLoadingInvoice(false);

    if (result.statusCode === 200) {
      message.success('Invoice Created')
      setEngagementModal({
        ...getEngagementModal,
        showInvoice: false,
      });
      resetInvoiceField();
      clearInvoiceError();
      setControlledPaymentTermValue("");
      setIsInvoiceAvailable(false);
    }else{
      message.error('Something went wrong!')
    }
  };

  const lineItemsColumnsMemo = useMemo(()=>{

    return [
      {
        title: "#",
        dataIndex: '',
        key: "",
        align: "left",
        // width: "95px",
        render:(text, res,ind)=>{
          return ind +1
        }
      },
      {
        title: "Item & Description",
        dataIndex: "lineItem",
        key: "lineItem",
        align: "left",
        // width: "95px",
        render:(text)=>{
          return <div
          dangerouslySetInnerHTML={{ __html: text }}
        ></div>
        }
      },
      {
        title: "Qty",
        dataIndex: "qty",
        key: "qty",
        align: "left",
        // width: "95px",
      },
      {
        title: "Rate",
        dataIndex: "rate",
        key: "rate",
        align: "left",
        // width: "95px",
      },
      {
        title: "Amount",
        dataIndex: "lineItemTotal",
        key: "lineItemTotal",
        align: "left",
        // width: "95px",
      },
    ]
  },[lineItems])

  const tableColumnsMemo = useMemo(
    () =>
      onBoardListConfig({
        getEngagementModal,
        setEngagementModal,
        setFeedBackData,
        setHRAndEngagementId,
        setFilteredData,
        setISEditTSC,
        setTSCONBoardData,
        setEngagementBillAndPayRateTab,
        setActiveTab,
        setAllBRPRdata,
        editAMModalcontroler,
        setLeaveUpdate,
        setTalentDetails,
        navigate,
        getInvoiceInfo,
        ShowInvoiceCreationCTA: userData?.ShowInvoiceCreationCTA,
      }),
    [userData?.ShowInvoiceCreationCTA]
  );

  const feedbackTableColumnsMemo = useMemo(
    () => allEngagementConfig.clientFeedbackTypeConfig(),
    []
  );

  const saveEditAM = async (d) => {
    setAMLOADING(true);
    let payload = {
      payOutID: AMDetails?.payOutID,
      onBoardID: AMDetails?.onBoardID,
      hiringRequestID: AMDetails?.hiringRequestID,
      contactID: AMDetails?.contactID,
      talentID: AMDetails?.talentID,
      month: new Date(startDate).getMonth() + 1,
      year: new Date(startDate).getFullYear(),
      oldAMPersonID: AMDetails?.aM_SalesPersonID,
      newAMPersonID: +d.newAMName,
      comment: d.note,
      engagementId_HRID: AMDetails?.engagementId_HRID,
    };

    const result = await engagementRequestDAO.saveAMNAMEEDITDAO(payload);

    if (result.statusCode === HTTPStatusCode.OK) {
      setEditAMModal(false);
      setAMLIST([]);
      setAMDetails({});
      resetAMField("amName");
      resetAMField("newAMName");
      resetAMField("note");
      callListData();
      setAMLOADING(false);
    }
    setAMLOADING(false);
  };

  const {
    register,
    handleSubmit,
    setValue,
    control,
    setError,
    getValues,
    watch,
    reset,
    resetField,
    formState: { errors },
  } = useForm();

  // useEffect(() => {
  // let payload ={
  // 	"pagenumber": pageIndex,
  // 	"totalrecord": pageSize,
  //         "filterFields_OnBoard":{
  //             "search" :searchText
  //         }
  // }
  //     getOnBoardListData(payload);
  // },[searchText]);

  const getOnBoardListData = async (data) => {
    setLoading(true);
    let result = await MasterDAO.getOnBoardListDAO(data);
    if (result.statusCode === HTTPStatusCode.OK) {
      setTotalRecords(result?.responseBody?.details.totalrows);
      setLoading(false);
      setOnBoardListData(result?.responseBody?.details);
    }
    if (result.statusCode === HTTPStatusCode.NOT_FOUND) {
      setLoading(false);
      setTotalRecords(0);
      setOnBoardListData([]);
    }
    setLoading(false);
  };

  const getFeedbackList = async (feedBackData) => {
    setLoading(true);
    const response = await engagementRequestDAO.getFeedbackListDAO(
      feedBackData
    );
    if (response?.statusCode === HTTPStatusCode.OK) {
      setClientFeedbackList(
        engagementUtils.modifyEngagementFeedbackData(response && response)
      );
      setFeedbackPagination((prev) => ({
        ...prev,
        totalRecords: response.responseBody.details.totalrows,
      }));
      setLoading(false);
    } else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
      setLoading(false);
      return navigate(UTSRoutes.LOGINROUTE);
    } else if (response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
      setLoading(false);
      return navigate(UTSRoutes.SOMETHINGWENTWRONG);
    } else {
      setLoading(false);
      setClientFeedbackList([]);
      return "NO DATA FOUND";
    }
  };

  const getFeedbackFormDetails = async (getHRAndEngagementId) => {
    setFeedbackFormContent({});
    const response = await engagementRequestDAO.getFeedbackFormContentDAO(
      getHRAndEngagementId
    );
    if (response?.statusCode === HTTPStatusCode.OK) {
      setFeedbackFormContent(response?.responseBody?.details);
    } else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
      return navigate(UTSRoutes.LOGINROUTE);
    } else if (response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
      setLoading(false);
      return navigate(UTSRoutes.SOMETHINGWENTWRONG);
    } else {
      return "NO DATA FOUND";
    }
  };

  useEffect(() => {
    getEngagementModal?.engagementFeedback &&
      feedBackData?.onBoardId &&
      getFeedbackList(feedBackData);
  }, [getEngagementModal?.engagementFeedback]);

  useEffect(() => {
    getEngagementModal?.engagementAddFeedback &&
      getFeedbackFormDetails(getHRAndEngagementId);
  }, [getEngagementModal?.engagementAddFeedback]);

  const onCalenderFilter = (dates) => {
    const [start, end] = dates;

    setStartDate(start);
    setEndDate(end);
    // setEndDate(end);
    if (start && end) {
      // console.log( month, year)
      setTableFilteredState({
        ...tableFilteredState,
        searchText: searchText,
        filterFields_OnBoard: {
          ...tableFilteredState.filterFields_OnBoard,
          fromDate: new Date(start).toLocaleDateString("en-US"),
          toDate: new Date(end).toLocaleDateString("en-US"),
        },
      });
    }
  };

  const onMonthCalenderFilter = (date) => {
    setMonthDate(date);
    // setEndDate(end);
    // setEndDate(end);

    if (date) {
      // console.log( month, year)
      setTableFilteredState({
        ...tableFilteredState,
        searchText: searchText,
        filterFields_OnBoard: {
          ...tableFilteredState.filterFields_OnBoard,
          searchMonth: +moment(date).format("M") + 1 ?? 0,
          searchYear: +moment(date).format("YYYY") ?? 0,
        },
      });
    }
  };

  const handleExport = (apiData) => {
    let DataToExport = apiData.map((data) => {
      let obj = {};
      tableColumnsMemo.forEach((val, ind) => {
        if (val.key !== "clientFeedback") {
          if (val.title === "Uplers Fees") {
            obj[`${val.title}`] =
              `${data.currencySign} ` +
              (+data.final_HR_Cost - +data.talent_Cost).toFixed(2);
          } else if (val.key === "action") {
            return;
          } else if (val.key === "nrPercentage") {
            obj["NR / DP (%)"] = `${
              data.nrPercentage !== 0 ? data.nrPercentage : ""
            }  ${+data.dP_Percentage !== 0 ? data.dP_Percentage : ""}`;
          } else if (val.key === "payout_TotalDaysinMonth") {
            obj["No. of days"] = `${
              data.payout_TotalDaysinMonth
                ? `${data.payout_TotalDaysinMonth}`
                : ""
            }`;
          } else if (val.key === "payout_Actual_PRStr") {
            obj["Final PR (INR)"] = `${
              data.payout_Actual_PRStr ? `₹ ${data.payout_Actual_PRStr}` : ""
            }`;
          } else if (val.key === "payout_PerDayTalentCost_INR") {
            obj["Per Day PR (INR)"] = `${
              data.payout_PerDayTalentCost_INR
                ? `₹ ${data.payout_PerDayTalentCost_INR}`
                : ""
            }`;
          } else if (val.key === "contractEndDate") {
            obj["LWD / End Date"] = `${
              data?.lastWorkingDate ? data?.lastWorkingDate : "NA"
            } / ${data.contractEndDate}`;
          } else {
            obj[`${val.title}`] = data[`${val.key}`];
          }
        }
      });

      return obj;
    });
    downloadToExcel(DataToExport, "Engagement Report");
  };

  const getEngagementFilterList = useCallback(async () => {
    // setLoading(true);
    const response = await engagementRequestDAO.getEngagementFilterListDAO();
    if (response?.statusCode === HTTPStatusCode.OK) {
      // setLoading(false);
      setFiltersList(response && response?.responseBody?.details);
    } else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
      // setLoading(false);
      return navigate(UTSRoutes.LOGINROUTE);
    } else if (response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
      // setLoading(false);
      return navigate(UTSRoutes.SOMETHINGWENTWRONG);
    } else {
      return "NO DATA FOUND";
    }
  }, [navigate]);

  useEffect(() => {
    getEngagementFilterList();
  }, [getEngagementFilterList]);

  useEffect(() => {
    let payload = {
      pagenumber: pageIndex,
      totalrecord: pageSize,
      filterFields_OnBoard: {
        ...tableFilteredState.filterFields_OnBoard,
        search: searchText,
        toDate:
          dateTypeFilter === 1
            ? moment(tableFilteredState.filterFields_OnBoard?.toDate).format(
                "MM/DD/YYYY"
              )
            : "",
        fromDate:
          dateTypeFilter === 1
            ? moment(tableFilteredState.filterFields_OnBoard?.fromDate).format(
                "MM/DD/YYYY"
              )
            : "",
        searchMonth: dateTypeFilter === 0 ? +moment(monthDate).format("M") : 0,
        searchYear:
          dateTypeFilter === 0 ? +moment(monthDate).format("YYYY") : 0,
      },
    };
    getOnBoardListData(payload);
  }, [tableFilteredState, searchText, pageIndex, pageSize, dateTypeFilter]);

  const callListData = () => {
    let payload = {
      pagenumber: pageIndex,
      totalrecord: pageSize,
      filterFields_OnBoard: {
        ...tableFilteredState.filterFields_OnBoard,
        search: searchText,
        toDate:
          dateTypeFilter === 1
            ? moment(tableFilteredState.filterFields_OnBoard?.toDate).format(
                "MM/DD/YYYY"
              )
            : "",
        fromDate:
          dateTypeFilter === 1
            ? moment(tableFilteredState.filterFields_OnBoard?.fromDate).format(
                "MM/DD/YYYY"
              )
            : "",
        searchMonth: dateTypeFilter === 0 ? +moment(monthDate).format("M") : 0,
        searchYear:
          dateTypeFilter === 0 ? +moment(monthDate).format("YYYY") : 0,
      },
    };
    getOnBoardListData(payload);
  };

  const toggleHRFilter = useCallback(() => {
    !getHTMLFilter
      ? setIsAllowFilters(!isAllowFilters)
      : setTimeout(() => {
          setIsAllowFilters(!isAllowFilters);
        }, 300);
    setHTMLFilter(!getHTMLFilter);
  }, [getHTMLFilter, isAllowFilters]);

  const onRemoveHRFilters = () => {
    setTimeout(() => {
      setIsAllowFilters(false);
    }, 300);
    setHTMLFilter(false);
  };

  const clearFilters = useCallback(() => {
    setAppliedFilters(new Map());
    setCheckedState(new Map());
    setFilteredTagLength(0);

    const defaultFilters = {
      clientFeedback: "",
      typeOfHiring: "",
      currentStatus: "",
      tscName: "",
      company: "",
      geo: "",
      position: "",
      engagementTenure: 0,
      nbdName: "",
      amName: "",
      pending: "",
      searchMonth: new Date().getMonth() + 1,
      searchYear: new Date().getFullYear(),
      searchType: "",
      islost: "",
      EngType: "A",
      fromDate: new Date(
        date.getFullYear(),
        date.getMonth() - 1,
        date.getDate()
      ),
      toDate: new Date(date),
      SummaryFilterOption: "AT",
      EngagementOption: "All",
      onBoardLostReasons: "",
      engagementStatus: "",
    };
    setDateTypeFilter(0);
    setTableFilteredState({
      ...tableFilteredState,
      filterFields_OnBoard: defaultFilters,
    });

    onRemoveHRFilters();
    setSearchText("");
    setMonthDate(new Date());
    setStartDate(
      new Date(date.getFullYear(), date.getMonth() - 1, date.getDate())
    );
    setEndDate(new Date(date));
  }, [
    setAppliedFilters,
    setCheckedState,
    setFilteredTagLength,
    setTableFilteredState,
    tableFilteredState,
  ]);

  const scrollRef = useRef(null); // Reference for the scrollable container

  // Scroll to the left
  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -300, // Adjust the value based on card width
      behavior: "smooth",
    });
  };

  // Scroll to the right
  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 300, // Adjust the value based on card width
      behavior: "smooth",
    });
  };

  return (
    <div className={onboardList.hiringRequestContainer}>
      {/* <WithLoader className="pageMainLoader" showLoader={searchText?.length?false:isLoading}> */}
      <div className={onboardList.addnewHR}>
        <div className={onboardList.hiringRequest}>Engagement Report</div>
        <LogoLoader visible={isLoading} />
      </div>
      <div className={onboardList.filterContainer}>
        <div className={onboardList.filterSets}>
          <div className={onboardList.filterSetsInner}>
            <div className={onboardList.addFilter} onClick={toggleHRFilter}>
              <FunnelSVG style={{ width: "16px", height: "16px" }} />

              <div className={onboardList.filterLabel}>Add Filters</div>
              <div className={onboardList.filterCount}>{filteredTagLength}</div>
            </div>

            <div
              className={onboardList.searchFilterSet}
              style={{ marginLeft: "15px" }}
            >
              <SearchSVG style={{ width: "16px", height: "16px" }} />
              <input
                type={InputType.TEXT}
                className={onboardList.searchInput}
                placeholder="Search Table"
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
              />
              {searchText && (
                <CloseSVG
                  style={{
                    width: "16px",
                    height: "16px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setSearchText("");
                  }}
                />
              )}
            </div>
            <p onClick={() => clearFilters()}>Reset Filters</p>
          </div>
          <div className={onboardList.filterRight}>
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
              value={tableFilteredState?.filterFields_OnBoard?.EngType}
            >
              <Radio value={"A"}>All</Radio>
              <Radio value={"C"}>Contract</Radio>
              <Radio value={"D"}>DP</Radio>
            </Radio.Group>

            {/* <Radio.Group    
                style={{display: 'flex', flexDirection: 'column', gap:'5px'}}             
                      onChange={(e) => {
                       setDateTypeFilter(e.target.value)
                       setStartDate(new Date(date.getFullYear(), date.getMonth() - 1, date.getDate()));
                       setEndDate(new Date(date));
                   
                        setTableFilteredState({
                          ...tableFilteredState,
                          searchText: searchText,
                          filterFields_OnBoard: {...tableFilteredState.filterFields_OnBoard ,
                            fromDate: new Date(date.getFullYear(), date.getMonth() - 1, date.getDate()),
                          toDate: new Date(date),
                          EngType:'A',EngagementOption:'All'
                          },
                        })
                        setTableFilteredState(prev=> ({...prev,filterFields_OnBoard:{...prev.filterFields_OnBoard,EngType:'A',EngagementOption:'All' } }))
                        
                      }}
                      value={dateTypeFilter}
                    >
                      <Radio value={0}>Current Month</Radio>
                      <Radio value={1}>Search With Date Range</Radio> 
                    </Radio.Group>  	                                 */}

            {dateTypeFilter === 0 && (
              <div className={onboardList.calendarFilterSet}>
                <div className={onboardList.label}>Month-Year</div>
                <div className={onboardList.calendarFilter}>
                  <CalenderSVG
                    style={{ height: "16px", marginRight: "16px" }}
                  />
                  <DatePicker
                    style={{ backgroundColor: "red" }}
                    onKeyDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className={onboardList.dateFilter}
                    placeholderText="Month - Year"
                    selected={monthDate}
                    onChange={onMonthCalenderFilter}
                    // startDate={startDate}
                    // endDate={endDate}
                    dateFormat="MM-yyyy"
                    showMonthYearPicker
                  />
                </div>
              </div>
            )}
            {dateTypeFilter === 1 && (
              <div className={onboardList.calendarFilterSet}>
                <div className={onboardList.label}>Date</div>
                <div className={onboardList.calendarFilter}>
                  <CalenderSVG
                    style={{ height: "16px", marginRight: "16px" }}
                  />
                  <DatePicker
                    style={{ backgroundColor: "red" }}
                    onKeyDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className={onboardList.dateFilter}
                    placeholderText="Start date - End date"
                    selected={startDate}
                    onChange={onCalenderFilter}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                  />
                </div>
              </div>
            )}

            <div className={onboardList.priorityFilterSet}>
              {/* <div className={onboardList.label}>Showing</div>
              <div className={onboardList.paginationFilter}>
                <Dropdown
                  trigger={["click"]}
                  placement="bottom"
                  overlay={
                    <Menu
                      onClick={(e) => {
                        setPageSize(parseInt(e.key));
                        // if (pageSize !== parseInt(e.key)) {
                        //   setTableFilteredState((prevState) => ({
                        //     ...prevState,
                        //     totalrecord: parseInt(e.key),
                        //     pagenumber: pageIndex,
                        //   }));
                        // }
                      }}
                    >
                      {pageSizeOptions.map((item) => {
                        return <Menu.Item key={item}>{item}</Menu.Item>;
                      })}
                    </Menu>
                  }
                >
                  <span>
                    {pageSize}
                    <IoChevronDownOutline
                      style={{ paddingTop: "5px", fontSize: "16px" }}
                    />
                  </span>
                </Dropdown>
              </div> */}
              <div
                className={onboardList.paginationFilter}
                style={{ border: "none", width: "auto" }}
              >
                <button
                  className={onboardList.btnPrimary}
                  onClick={() => handleExport(onBoardListData)}
                >
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={onboardList.filterContainer}>
        {/* <div
                  className={`${onboardList.filterSets} ${onboardList.filterDescription}`}>
                  <p style={{margin:'0', fontWeight:'bold'}}>Add Quick Filters:</p> 

                  <Radio.Group                 
                      onChange={(e) => {
                        if(e.target.value === 'D'){
                          if(!startDate && dateTypeFilter === 1){
                            return message.error('Please select date range' )
                          }
                        }
                        setTableFilteredState(prev=> ({...prev,filterFields_OnBoard:{...prev.filterFields_OnBoard,EngType:e.target.value} }))
                        //  setEngagementType(e.target.value);
                        
                      }}
                      value={tableFilteredState?.filterFields_OnBoard?.EngType}
                    >
                      <Radio value={'A'}>All</Radio>
                      <Radio value={'C'}>Contract</Radio>
                      <Radio value={'D'}>DP</Radio>
                    </Radio.Group>  

                    {dateTypeFilter === 1 &&   <Radio.Group                 
                      onChange={(e) => {
                        setTableFilteredState(prev=> ({...prev,filterFields_OnBoard:{...prev.filterFields_OnBoard,EngagementOption:e.target.value} }))
                        //  setEngagementType(e.target.value);
                        
                      }}
                      value={tableFilteredState?.filterFields_OnBoard?.EngagementOption}
                    >
                      <Radio value={'All'}>All Engagement</Radio>
                      <Radio value={'Active'}>Active Engagement</Radio>
                      <Radio value={'Closed'}>Closed Engagement</Radio>
                    </Radio.Group>}

                </div> */}
      </div>

      <div className={onboardList.filterContainer}>
        <div
          className={`${onboardList.filterSets} ${onboardList.filterDescription}`}
          style={{ padding: "24px 0" }}
        >
          <div style={{ overflow: "hidden", width: "100%" }}>
            {/* Scroll Buttons */}
            {/* <button
                    onClick={scrollLeft}
                    style={{
                      position: "absolute",
                      left: "0",
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 1,
                      backgroundColor: "#fff",
                      border: "none",
                      cursor: "pointer",
                      padding: "10px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }}
                  >
                    {"<"}
                  </button>
                  <button
                    onClick={scrollRight}
                    style={{
                      position: "absolute",
                      right: "0",
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 1,
                      backgroundColor: "#fff",
                      border: "none",
                      cursor: "pointer",
                      padding: "10px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }}
                  >
                    {">"}
                  </button> */}

            {/* Scrollable Container */}
            {/* <div
                    ref={scrollRef}
                    style={{
                      display: "flex",
                      gap: "15px",
                      overflowX: "auto",
                      scrollBehavior: "smooth",
                      padding: "10px 0",
                    }}
                  > */}
            <Swiper
              slidesPerView={4}
              centeredSlides={false}
              slidesPerGroupSkip={1}
              grabCursor={true}
              keyboard={{
                enabled: true,
              }}
              // breakpoints={{
              //   769: {
              //     slidesPerView: 4,
              //     slidesPerGroup: 4,
              //   },
              // }}
              // scrollbar={true}
              navigation={true}
              // pagination={{
              //   clickable: true,
              // }}
              modules={[Keyboard, Scrollbar, Navigation, Pagination]}
              className="mySwiper"
            >
              <SwiperSlide
                onClick={() =>
                  setTableFilteredState((prev) => ({
                    ...prev,
                    filterFields_OnBoard: {
                      ...prev.filterFields_OnBoard,
                      SummaryFilterOption: "AT",
                    },
                  }))
                }
              >
                <Tooltip title={"View Total Talents"}>
                  <div
                    className={onboardList.filterType}
                    key={"Total Talents"}
                    style={{
                      borderBottom:
                        tableFilteredState?.filterFields_OnBoard
                          ?.SummaryFilterOption === "AT"
                          ? "6px solid #FFDA30"
                          : "",
                    }}
                  >
                    <img src={FeedBack} alt="rocket" />
                    <h2>
                      Total Talents :{" "}
                      <span>
                        {onBoardListData[0]?.totalRecords
                          ? onBoardListData[0]?.totalRecords
                          : 0}
                      </span>
                    </h2>
                  </div>
                </Tooltip>
              </SwiperSlide>

              {tableFilteredState?.filterFields_OnBoard?.EngType !== "D" && (
                <SwiperSlide
                  onClick={() =>
                    setTableFilteredState((prev) => ({
                      ...prev,
                      filterFields_OnBoard: {
                        ...prev.filterFields_OnBoard,
                        SummaryFilterOption: "AC",
                      },
                    }))
                  }
                >
                  <Tooltip title={"View Active Contracts"}>
                    <div
                      className={onboardList.filterType}
                      key={"Active Contract Eng"}
                      style={{
                        borderBottom:
                          tableFilteredState?.filterFields_OnBoard
                            ?.SummaryFilterOption === "AC"
                            ? "6px solid #FFDA30"
                            : "",
                      }}
                    >
                      <img src={Handshake} alt="handshaker" />
                      <h2>
                        Active Contracts :{" "}
                        <span>
                          {onBoardListData[0]?.s_TotalActiveEng
                            ? onBoardListData[0]?.s_TotalActiveEng
                            : 0}
                        </span>
                      </h2>
                      <Tooltip
                        placement="bottomLeft"
                        title={
                          <div>
                            Active engagements determined by the following
                            count:
                            <ol>
                              <li>Full time: 1</li>
                              <li>Part time: 0.5</li>
                              <li>Direct Placement: 1/0.5/0</li>
                            </ol>
                          </div>
                        }
                      >
                        <div className={onboardList.summaryTooltip}>!</div>
                      </Tooltip>
                    </div>{" "}
                  </Tooltip>
                </SwiperSlide>
              )}

              {tableFilteredState?.filterFields_OnBoard?.EngType !== "D" && (
                <SwiperSlide
                  onClick={() =>
                    setTableFilteredState((prev) => ({
                      ...prev,
                      filterFields_OnBoard: {
                        ...prev.filterFields_OnBoard,
                        SummaryFilterOption: "ADC",
                      },
                    }))
                  }
                >
                  <Tooltip title={"View Added Contracts"}>
                    <div
                      className={onboardList.filterType}
                      key={"Added Contracts"}
                      style={{
                        borderBottom:
                          tableFilteredState?.filterFields_OnBoard
                            ?.SummaryFilterOption === "ADC"
                            ? "6px solid #FFDA30"
                            : "",
                      }}
                    >
                      <img src={Briefcase} alt="briefcase" />
                      <h2>
                        Added Contracts :{" "}
                        <span>
                          {onBoardListData[0]?.s_TotalAddedContract
                            ? onBoardListData[0]?.s_TotalAddedContract
                            : 0}
                        </span>
                      </h2>
                    </div>
                  </Tooltip>
                </SwiperSlide>
              )}

              {tableFilteredState?.filterFields_OnBoard?.EngType !== "D" && (
                <SwiperSlide
                  onClick={() =>
                    setTableFilteredState((prev) => ({
                      ...prev,
                      filterFields_OnBoard: {
                        ...prev.filterFields_OnBoard,
                        SummaryFilterOption: "RC",
                      },
                    }))
                  }
                >
                  <Tooltip title={"View Recurring Contracts"}>
                    <div
                      className={onboardList.filterType}
                      key={"Recurring Contracts"}
                      style={{
                        borderBottom:
                          tableFilteredState?.filterFields_OnBoard
                            ?.SummaryFilterOption === "RC"
                            ? "6px solid #FFDA30"
                            : "",
                      }}
                    >
                      <img src={RenewEng} alt="Smile" />
                      <h2>
                        Recurring Contracts :{" "}
                        <span>
                          {onBoardListData[0]?.s_TotalRecurringContract
                            ? onBoardListData[0]?.s_TotalRecurringContract
                            : 0}
                        </span>
                      </h2>
                    </div>
                  </Tooltip>
                </SwiperSlide>
              )}

              {tableFilteredState?.filterFields_OnBoard?.EngType !== "D" && (
                <SwiperSlide
                  onClick={() =>
                    setTableFilteredState((prev) => ({
                      ...prev,
                      filterFields_OnBoard: {
                        ...prev.filterFields_OnBoard,
                        SummaryFilterOption: "LC",
                      },
                    }))
                  }
                >
                  <Tooltip title={"View Lost Contracts"}>
                    <div
                      className={onboardList.filterType}
                      key={"Lost Contract Eng."}
                      style={{
                        borderBottom:
                          tableFilteredState?.filterFields_OnBoard
                            ?.SummaryFilterOption === "LC"
                            ? "6px solid #FFDA30"
                            : "",
                      }}
                    >
                      <img src={LostEng} alt="sad" />
                      <h2>
                        Lost Contracts :{" "}
                        <span>
                          {onBoardListData[0]?.s_TotalLostEng
                            ? onBoardListData[0]?.s_TotalLostEng
                            : 0}
                        </span>
                      </h2>
                    </div>
                  </Tooltip>
                </SwiperSlide>
              )}

              {/* {(tableFilteredState?.filterFields_OnBoard?.EngType !== 'C' ) &&
                  <SwiperSlide>
                  <div className={onboardList.filterType} key={'AActive DP Eng.'}>
                    <img
                      src={Briefcase}
                      alt="briefcase"
                    />
                    <h2>
                      Active DP Eng. :{' '}
                      <span>{onBoardListData[0]?.s_TotalDPActiveEng ? onBoardListData[0]?.s_TotalDPActiveEng : 0}</span>
                    </h2>
                  </div></SwiperSlide>} */}

              <SwiperSlide
                onClick={() =>
                  setTableFilteredState((prev) => ({
                    ...prev,
                    filterFields_OnBoard: {
                      ...prev.filterFields_OnBoard,
                      SummaryFilterOption: "EOR",
                    },
                  }))
                }
              >
                <Tooltip title={"View EOR"}>
                  <div
                    className={onboardList.filterType}
                    key={"EOR."}
                    style={{
                      borderBottom:
                        tableFilteredState?.filterFields_OnBoard
                          ?.SummaryFilterOption === "EOR"
                          ? "6px solid #FFDA30"
                          : "",
                    }}
                  >
                    <img src={Handshake} alt="sad" />
                    <h2>
                      EOR :{" "}
                      <span>
                        {onBoardListData[0]?.s_TotalEOR
                          ? onBoardListData[0]?.s_TotalEOR
                          : 0}
                      </span>
                    </h2>
                  </div>
                </Tooltip>
              </SwiperSlide>

              {tableFilteredState?.filterFields_OnBoard?.EngType !== "C" && (
                <SwiperSlide
                  onClick={() =>
                    setTableFilteredState((prev) => ({
                      ...prev,
                      filterFields_OnBoard: {
                        ...prev.filterFields_OnBoard,
                        SummaryFilterOption: "ADD",
                      },
                    }))
                  }
                >
                  <Tooltip title={"View Added DP"}>
                    <div
                      className={onboardList.filterType}
                      key={"Added DP"}
                      style={{
                        borderBottom:
                          tableFilteredState?.filterFields_OnBoard
                            ?.SummaryFilterOption === "ADD"
                            ? "6px solid #FFDA30"
                            : "",
                      }}
                    >
                      <img src={Briefcase} alt="briefcase" />
                      <h2>
                        Added DP :{" "}
                        <span>
                          {onBoardListData[0]?.s_AddedDP
                            ? onBoardListData[0]?.s_AddedDP
                            : 0}
                        </span>
                      </h2>
                    </div>
                  </Tooltip>
                </SwiperSlide>
              )}

              {tableFilteredState?.filterFields_OnBoard?.EngType !== "C" && (
                <SwiperSlide
                  onClick={() =>
                    setTableFilteredState((prev) => ({
                      ...prev,
                      filterFields_OnBoard: {
                        ...prev.filterFields_OnBoard,
                        SummaryFilterOption: "AD",
                      },
                    }))
                  }
                >
                  <Tooltip title={"View Active DP"}>
                    <div
                      className={onboardList.filterType}
                      key={"Active DP."}
                      style={{
                        borderBottom:
                          tableFilteredState?.filterFields_OnBoard
                            ?.SummaryFilterOption === "AD"
                            ? "6px solid #FFDA30"
                            : "",
                      }}
                    >
                      <img src={Handshake} alt="sad" />
                      <h2>
                        Active DP :{" "}
                        <span>
                          {onBoardListData[0]?.s_TotalDPActiveEng
                            ? onBoardListData[0]?.s_TotalDPActiveEng
                            : 0}
                        </span>
                      </h2>
                    </div>
                  </Tooltip>
                </SwiperSlide>
              )}
              {/* {(tableFilteredState?.filterFields_OnBoard?.EngType !== 'C' ) &&
                  <SwiperSlide>
                  <div className={onboardList.filterType} key={'Lost DP Eng.'}>
                    <img
                      src={LostEng}
                      alt="sad"
                    />
                    <h2>
                      Lost DP Eng. :{' '}
                      <span>{onBoardListData[0]?.s_TotalDPLostEng ? onBoardListData[0]?.s_TotalDPLostEng : 0}</span>
                    </h2>
                  </div></SwiperSlide>} */}
              {/* <div className={onboardList.filterType}>
                    <img
                      src={LostEng}
                      alt="sad"
                    />
                  
                    <h2>
                      Lost Engagements  -{' '}
                      <span>
                        {onBoardListData[0]?.s_TotalLostEng ? onBoardListData[0]?.s_TotalLostEng : 0}
                      </span>
                    </h2>
                  </div> */}

              {tableFilteredState?.filterFields_OnBoard?.EngType !== "D" && (
                <SwiperSlide
                  onClick={() =>
                    setTableFilteredState((prev) => ({
                      ...prev,
                      filterFields_OnBoard: {
                        ...prev.filterFields_OnBoard,
                        SummaryFilterOption: "RE",
                      },
                    }))
                  }
                >
                  <Tooltip title={"View Renew Eng"}>
                    <div
                      className={onboardList.filterType}
                      key={"Renew Eng."}
                      style={{
                        borderBottom:
                          tableFilteredState?.filterFields_OnBoard
                            ?.SummaryFilterOption === "RE"
                            ? "6px solid #FFDA30"
                            : "",
                      }}
                    >
                      <img src={RenewEng} alt="Smile" />
                      <h2>
                        Renew Eng :{" "}
                        <span>
                          {onBoardListData[0]?.s_TotalRenewEng
                            ? onBoardListData[0]?.s_TotalRenewEng
                            : 0}
                        </span>
                      </h2>
                    </div>
                  </Tooltip>
                </SwiperSlide>
              )}

              <SwiperSlide
                onClick={() =>
                  setTableFilteredState((prev) => ({
                    ...prev,
                    filterFields_OnBoard: {
                      ...prev.filterFields_OnBoard,
                      SummaryFilterOption: "FR",
                    },
                  }))
                }
              >
                <Tooltip title={"View Feedback Received"}>
                  <div
                    className={onboardList.filterType}
                    key={"Feedback Received"}
                    style={{
                      borderBottom:
                        tableFilteredState?.filterFields_OnBoard
                          ?.SummaryFilterOption === "FR"
                          ? "6px solid #FFDA30"
                          : "",
                    }}
                  >
                    <img src={FeedBack} alt="rocket" />
                    <h2>
                      Feedback Received :{" "}
                      <span>
                        {onBoardListData[0]?.s_TotalFeedbackReceived
                          ? onBoardListData[0]?.s_TotalFeedbackReceived
                          : 0}
                      </span>
                    </h2>
                  </div>
                </Tooltip>
              </SwiperSlide>

              {tableFilteredState?.filterFields_OnBoard?.EngType !== "D" && (
                <SwiperSlide>
                  <div
                    className={onboardList.filterType}
                    key={"Average NR% "}
                    style={{ cursor: "alias" }}
                  >
                    <img src={Rocket} alt="Rocket" />
                    <h2>
                      Average NR% :{" "}
                      <span>
                        {onBoardListData[0]?.s_AvgNR
                          ? onBoardListData[0]?.s_AvgNR
                          : 0}
                      </span>
                    </h2>
                  </div>
                </SwiperSlide>
              )}

              {tableFilteredState?.filterFields_OnBoard?.EngType !== "C" && (
                <SwiperSlide>
                  <div
                    className={onboardList.filterType}
                    key={"Average DP%"}
                    style={{ cursor: "alias" }}
                  >
                    <img src={Briefcase} alt="briefcase" />
                    <h2>
                      Average DP% :{" "}
                      <span>
                        {onBoardListData[0]?.s_AvgDP
                          ? onBoardListData[0]?.s_AvgDP
                          : 0}
                      </span>
                    </h2>
                  </div>
                </SwiperSlide>
              )}
            </Swiper>
            {/* </div> */}
          </div>
        </div>
      </div>

      {userData?.ShowRevenueRelatedData && (
        <div
          className={onboardList.filterContainer}
          style={{ display: "flex", padding: "10px", gap: "10px" }}
        >
          <div
            className={onboardList.filterType}
            key={"summary_Added_Contracts_USD"}
          >
            <h2>
              Added Contracts :{" "}
              <span>
                {onBoardListData[0]?.summary_Added_Contracts_USD
                  ? onBoardListData[0]?.summary_Added_Contracts_USD
                  : 0}
              </span>
            </h2>
          </div>

          <div className={onboardList.filterType} key={"summary_Added_DP_USD"}>
            <h2>
              Added DP :{" "}
              <span>
                {onBoardListData[0]?.summary_Added_DP_USD
                  ? onBoardListData[0]?.summary_Added_DP_USD
                  : 0}
              </span>
            </h2>
          </div>

          <div className={onboardList.filterType} key={"summary_EOR_Fees_USD"}>
            <h2>
              EOR Fees :{" "}
              <span>
                {onBoardListData[0]?.summary_EOR_Fees_USD
                  ? onBoardListData[0]?.summary_EOR_Fees_USD
                  : 0}
              </span>
            </h2>
          </div>

          <div
            className={onboardList.filterType}
            key={"summary_Recurring_Contracts_USD"}
          >
            <h2>
              Recurring Contracts :{" "}
              <span>
                {onBoardListData[0]?.summary_Recurring_Contracts_USD
                  ? onBoardListData[0]?.summary_Recurring_Contracts_USD
                  : 0}
              </span>
            </h2>
          </div>

          <div
            className={onboardList.filterType}
            key={"summary_Total_Fees_USD"}
          >
            <h2>
              Total Fees :{" "}
              <span>
                {onBoardListData[0]?.summary_Total_Fees_USD
                  ? onBoardListData[0]?.summary_Total_Fees_USD
                  : 0}
              </span>
            </h2>
          </div>

          <div
            className={onboardList.filterType}
            key={"summary_Total_Fees_INR"}
          >
            <h2>
              Total Fees :{" "}
              <span>
                {onBoardListData[0]?.summary_Total_Fees_INR
                  ? onBoardListData[0]?.summary_Total_Fees_INR
                  : 0}
              </span>
            </h2>
          </div>
        </div>
      )}

      <div className={onboardList.tableDetails}>
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <WithLoader className="mainLoader">
            <Table
              scroll={{ y: "100vh", x: "max-content" }}
              id="hrListingTable"
              columns={tableColumnsMemo}
              bordered={false}
              dataSource={onBoardListData}
              pagination={false}
              // pagination={
              //   {
              //     onChange: (pageNum, pageSize) => {
              //         setPageIndex(pageNum);
              //         setPageSize(pageSize);
              //     },
              //     size: 'small',
              //     pageSize: pageSize,
              //     pageSizeOptions: pageSizeOptions,
              //     total: totalRecords,
              //     showTotal: (total, range) =>
              //         `${range[0]}-${range[1]} of ${totalRecords} items`,
              //     defaultCurrent: pageIndex,
              //   }
              // }
            />
          </WithLoader>
        )}
      </div>
      {/* </WithLoader> */}

      {isAllowFilters && (
        <Suspense fallback={<div>Loading...</div>}>
          <OnboardFilerList
            setAppliedFilters={setAppliedFilters}
            appliedFilter={appliedFilter}
            setCheckedState={setCheckedState}
            checkedState={checkedState}
            // handleHRRequest={handleHRRequest}
            setTableFilteredState={setTableFilteredState}
            tableFilteredState={tableFilteredState}
            setFilteredTagLength={setFilteredTagLength}
            onRemoveHRFilters={() => onRemoveHRFilters()}
            getHTMLFilter={getHTMLFilter}
            hrFilterList={allHRConfig.hrFilterListConfig()}
            filtersType={allEngagementConfig.onboardListFilterTypeConfig(
              filtersList && filtersList
            )}
            clearFilters={clearFilters}
          />
        </Suspense>
      )}

      {/** ============ MODAL FOR ENGAGEMENT INVOICE ================ */}
      {getEngagementModal.engagementInvoice && (
        <Modal
          transitionName=""
          width="930px"
          centered
          footer={null}
          open={getEngagementModal.engagementInvoice}
          className="engagementReplaceTalentModal"
          onCancel={() =>
            setEngagementModal({
              ...getEngagementModal,
              engagementInvoice: false,
            })
          }
        >
          <EngagementInvoice
            isModalOpen={getEngagementModal.engagementInvoice}
            engagementListHandler={() => callListData()}
            talentInfo={filteredData}
            closeModal={() =>
              setEngagementModal({
                ...getEngagementModal,
                engagementInvoice: false,
              })
            }
          />
        </Modal>
      )}

      {/** ============ MODAL FOR ENGAGEMENT END ================ */}
      {getEngagementModal.engagementEnd && (
        <Modal
          transitionName=""
          width="930px"
          centered
          footer={null}
          open={getEngagementModal.engagementEnd}
          className="engagementReplaceTalentModal"
          onCancel={() =>
            setEngagementModal({
              ...getEngagementModal,
              engagementEnd: false,
            })
          }
        >
          <EngagementEnd
            engagementListHandler={() => callListData()}
            talentInfo={filteredData}
            lostReasons={filtersList?.onBoardingLostReasons}
            closeModal={() =>
              setEngagementModal({
                ...getEngagementModal,
                engagementEnd: false,
              })
            }
          />
        </Modal>
      )}
      {/** ============ MODAL FOR RENEW ENGAGEMENT ================ */}
      {getEngagementModal.engagementRenew && (
        <Modal
          transitionName=""
          width="930px"
          centered
          footer={null}
          open={getEngagementModal.engagementRenew}
          className="engagementReplaceTalentModal"
          onCancel={() =>
            setEngagementModal({
              ...getEngagementModal,
              engagementRenew: false,
            })
          }
        >
          <RenewEngagement
            engagementListHandler={() => callListData()}
            talentInfo={filteredData}
            closeModal={() =>
              setEngagementModal({
                ...getEngagementModal,
                engagementRenew: false,
              })
            }
          />
        </Modal>
      )}
      {/** ============ MODAL FOR CLOSE END ================ */}
      {getEngagementModal.engagementCancel && (
        <Modal
          transitionName=""
          width="930px"
          centered
          footer={null}
          open={getEngagementModal.engagementCancel}
          className="engagementReplaceTalentModal"
          onCancel={() =>
            setEngagementModal({
              ...getEngagementModal,
              engagementCancel: false,
            })
          }
        >
          <EngagementCancel
            engagementListHandler={() => callListData()}
            talentInfo={filteredData}
            lostReasons={filtersList?.onBoardingLostReasons}
            closeModal={() =>
              setEngagementModal({
                ...getEngagementModal,
                engagementCancel: false,
              })
            }
          />
        </Modal>
      )}

      {/** ============ MODAL FOR ENGAGEMENT BILLRATE AND PAYRATE ================ */}
      {getEngagementModal.engagementBillRateAndPayRate && (
        <Modal
          transitionName=""
          width="930px"
          centered
          footer={null}
          open={getEngagementModal.engagementBillRateAndPayRate}
          className="engagementReplaceTalentModal"
          onCancel={() => {
            setEngagementModal({
              ...getEngagementModal,
              engagementBillRateAndPayRate: false,
            });
            setRateReason(undefined);
          }}
        >
          <EngagementBillRateAndPayRate
            engagementListHandler={() => callListData()}
            talentInfo={filteredData}
            closeModal={() => {
              setEngagementModal({
                ...getEngagementModal,
                engagementBillRateAndPayRate: false,
              });
              setRateReason(undefined);
            }}
            month={new Date(startDate).getMonth()}
            year={new Date(startDate).getFullYear()}
            getBillRate={getBillRate}
            setBillRate={setBillRate}
            getPayRate={getPayRate}
            setPayRate={setPayRate}
            setEngagementBillAndPayRateTab={setEngagementBillAndPayRateTab}
            engagementBillAndPayRateTab={engagementBillAndPayRateTab}
            rateReason={rateReason}
            activeTab={activeTab}
            setRateReason={setRateReason}
          />
        </Modal>
      )}

      {/* ================ MODAL FOR EDIT ALL BR PR ================= */}
      {getEngagementModal.engagementEditAllBillRateAndPayRate && (
        <Modal
          transitionName=""
          width="930px"
          centered
          footer={null}
          open={getEngagementModal.engagementEditAllBillRateAndPayRate}
          className="engagementReplaceTalentModal"
          onCancel={() =>
            setEngagementModal({
              ...getEngagementModal,
              engagementEditAllBillRateAndPayRate: false,
            })
          }
        >
          <EditAllBRPR
            closeModal={() =>
              setEngagementModal({
                ...getEngagementModal,
                engagementReplaceTalent: false,
              })
            }
            allBRPRdata={allBRPRdata}
          />
        </Modal>
      )}

      {getEngagementModal.engagementFeedback && (
        <Modal
          transitionName=""
          width="930px"
          centered
          footer={null}
          open={getEngagementModal.engagementFeedback}
          // className={allEngagementStyles.engagementModalContainer}
          className="engagementModalStyle"
          // onOk={() => setVersantModal(false)}
          onCancel={() =>
            setEngagementModal({
              ...getEngagementModal,
              engagementFeedback: false,
            })
          }
        >
          <EngagementFeedback
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
          />
        </Modal>
      )}

      {/** ============ MODAL FOR ENGAGEMENT ADD FEEDBACK ================ */}
      {getEngagementModal.engagementAddFeedback && (
        <Modal
          transitionName=""
          width="930px"
          centered
          footer={null}
          className="engagementAddFeedbackModal"
          open={getEngagementModal.engagementAddFeedback}
          onCancel={() => {
            setEngagementModal({
              ...getEngagementModal,
              engagementAddFeedback: false,
            });
            reset();
          }}
        >
          <EngagementAddFeedback
            getFeedbackFormContent={getFeedbackFormContent}
            getHRAndEngagementId={getHRAndEngagementId}
            onCancel={() => {
              setEngagementModal({
                ...getEngagementModal,
                engagementAddFeedback: false,
              });
              reset();
            }}
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

      {/** ============ MODAL FOR ENGAGEMENT ADD FEEDBACK ================ */}
      {getEngagementModal.showInvoice && (
        <Modal
          transitionName=""
          width="930px"
          centered
          footer={null}
          className="engagementAddFeedbackModal"
          open={getEngagementModal.showInvoice}
          onCancel={() => {
            setEngagementModal({
              ...getEngagementModal,
              showInvoice: false,
            });
            resetInvoiceField();
            clearInvoiceError();
            setControlledPaymentTermValue("");
            setIsInvoiceAvailable(false);
          }}
        >
          <h2 className={onboardList.modalTitle}>Create Invoice</h2>

          {isLoadingInvoice ? (
            <Skeleton active />
          ) : isInvoiceAvailable ? (
            <>
              <HRInputField
                label={"Company"}
                register={invoiceRegister}
                name={"company"}
                type={InputType.TEXT}
                placeholder="Enter Company"
                // isTextArea
                // rows={5}
                required
                validationSchema={{
                  required: "please enter company.",
                }}
                isError={invoiceErrors["company"] && invoiceErrors["company"]}
                errorMsg="please enter client."
              />

              <HRInputField
                label={"Client"}
                register={invoiceRegister}
                name={"client"}
                type={InputType.TEXT}
                placeholder="Enter Note/Comment"
                // isTextArea
                // rows={5}
                required
                validationSchema={{
                  required: "please enter client.",
                  pattern: {
                    value: EmailRegEx.email,
                    message: "Entered value does not match email format",
                  },
                }}
                isError={invoiceErrors["client"] && invoiceErrors["client"]}
                errorMsg={invoiceErrors["client"]?.message}
              />
              <HRInputField
                label={"Zoho Customer Email"}
                register={invoiceRegister}
                name={"zohoCustomer"}
                type={InputType.TEXT}
                placeholder="Zoho Customer Email"
                // isTextArea
                // rows={5}
                required
                validationSchema={{
                  required: "please enter zoho customer email.",
                  pattern: {
                    value: EmailRegEx.email,
                    message: "Entered value does not match email format",
                  },
                }}
                isError={
                  invoiceErrors["zohoCustomer"] && invoiceErrors["zohoCustomer"]
                }
                errorMsg={invoiceErrors["zohoCustomer"]?.message}
              />

              <div className={onboardList.row}>
                <div className={onboardList.colMd6}>
                  <div
                    className={onboardList.calendarFilterSet}
                    style={{ alignItems: "start", flexDirection: "column" }}
                  >
                    <div className={onboardList.label}>Invoice date</div>
                    <div
                      className={onboardList.calendarFilter}
                      style={{ width: "100%", height: "50px" }}
                    >
                      <CalenderSVG
                        style={{ height: "16px", marginRight: "16px" }}
                      />
                      <DatePicker
                        style={{ backgroundColor: "red" }}
                        onKeyDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className={onboardList.dateFilter}
                        placeholderText="Month - Year"
                        selected={invoiceDate}
                        onChange={(date) => {
                          setInvoiceDate(date);
                        }}
                        // startDate={startDate}
                        // endDate={endDate}
                        dateFormat="dd-MM-yyyy"
                        // showMonthYearPicker
                      />
                    </div>
                  </div>
                </div>
              
                <div className={onboardList.colMd6}>
                  <HRInputField
                    label={"Currency"}
                    register={invoiceRegister}
                    name={"currency"}
                    type={InputType.TEXT}
                    placeholder="Currency"
                    disabled={true}
                    // isTextArea
                    // rows={5}
                    required
                    validationSchema={{
                      required: "please enter currency.",
                    }}
                    isError={
                      invoiceErrors["currency"] && invoiceErrors["currency"]
                    }
                    errorMsg="please enter currency."
                  />
                  {/* <HRSelectField
					setValue={(val, _)=>AMsetValue(val,_)}
					register={invoiceRegister}
					searchable={true}
					name="currency"
					label="Currency"
          disabled={true}
					defaultValue={watchInvoice('currency') ? watchInvoice('currency') : "Please Select"} 
					options={AMLIST?.sort((a, b) => a.value.localeCompare(b.value))}
					// required
					// isError={invoiceErrors['currency'] && invoiceErrors['currency']}
					// errorMsg="Please select Currency."
					className="custom-select-class"
				/> */}
                </div>
              </div>

              {/* <HRInputField
              label={'Payment term'}
              register={invoiceRegister}
              name={'paymentTerm'}
              type={InputType.TEXT}
              placeholder="Zoho Customer Email"
              // isTextArea
              // rows={5}
              required
              validationSchema={{
              required: 'please enter paymentTerm.',
              }}
              isError={invoiceErrors['paymentTerm'] && invoiceErrors['paymentTerm']}
              errorMsg="Please Enter Payment Term."
            /> */}

              <HRSelectField
                controlledValue={controlledPaymentTermValue}
                setControlledValue={setControlledPaymentTermValue}
                isControlled={true}
                mode={"value"}
                setValue={invoiceSetValue}
                register={invoiceRegister}
                label={"Payment term"}
                defaultValue="Select"
                options={[
                  { id: 7, value: 7 },
                  { id: 15, value: 15 },
                  { id: 20, value: 20 },
                  { id: 30, value: 30 },
                  { id: 45, value: 45 },
                  { id: 60, value: 60 },
                  { id: 90, value: 90 },
                ]}
                name="paymentTerm"
                required
                validationSchema={{
                  required: "please enter paymentTerm.",
                }}
                isError={
                  invoiceErrors["paymentTerm"] && invoiceErrors["paymentTerm"]
                }
                errorMsg="Please Enter Payment Term."
              />

              {/* <h4>Item & Description : </h4>
              <div
                dangerouslySetInnerHTML={{ __html: invData?.lineItem }}
              ></div> */}

              <Table
                id="hrListingTable"
                columns={lineItemsColumnsMemo}
                bordered={false}
                dataSource={lineItems}
                pagination={false}
              />

              <div style={{display:'flex', justifyContent:'end',padding:'20px 20px 0 0'}}> <h4>Total : {invData?.invoice_CurrencyCode} {invData?.finalTotal}</h4> </div>

              <div
                className={onboardList.formPanelAction}
                style={{ marginTop: "15px" }}
              >
                <button
                  type="submit"
                  onClick={invoiceSubmit(saveInvoice)}
                  className={onboardList.btnPrimary}
                  disabled={isLoading}
                >
                  Create Invoice
                </button>
                <button
                  onClick={() => {
                    setEngagementModal({
                      ...getEngagementModal,
                      showInvoice: false,
                    });
                    resetInvoiceField();
                    clearInvoiceError();
                    setControlledPaymentTermValue("");
                    setIsInvoiceAvailable(false);
                  }}
                  className={onboardList.btnCancle}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <h2>No Invoice Data Available</h2>
          )}
        </Modal>
      )}

      {/* edit AM Name */}
      {editAMModal && (
        <Modal
          transitionName=""
          width="930px"
          centered
          footer={null}
          className={onboardList.engagementaddtscModal}
          open={editAMModal}
          onCancel={() => setEditAMModal(false)}
        >
          <div>
            <h2 className={onboardList.modalTitle}>Edit AM/NBD</h2>
            <p>
              Company Name:{" "}
              <b className={onboardList.hadingTitle}>
                {AMDetails?.companyName ?? "NA"}
              </b>{" "}
              | Client Name:{" "}
              <b className={onboardList.hadingTitle}>
                {AMDetails?.clientName ?? "NA"}
              </b>{" "}
              | Effictive From :{" "}
              <b className={onboardList.hadingTitle}>
                {moment(startDate).format("MM-YYYY")}
              </b>
            </p>
            <p>
              EN/HR :{" "}
              <b className={onboardList.hadingTitle}>
                {AMDetails?.engagementId_HRID}
              </b>{" "}
            </p>
          </div>

          <>
            {AMLOADING ? (
              <Skeleton active />
            ) : (
              <>
                <div className={onboardList.row}>
                  <div className={onboardList.colMd6}>
                    <HRInputField
                      register={AMregister}
                      label={"Current AM/NBD "}
                      name={"amName"}
                      type={InputType.TEXT}
                      // value={AMDetails?.aM_UserName}
                      placeholder="Enter AM "
                      disabled
                    />
                  </div>

                  <div
                    className={`${onboardList.colMd6}  ${onboardList.customSelectAMName}`}
                  >
                    <HRSelectField
                      setValue={(val, _) => AMsetValue(val, _)}
                      register={AMregister}
                      searchable={true}
                      name="newAMName"
                      label="Select New AM/NBD"
                      defaultValue="Please Select"
                      options={AMLIST?.sort((a, b) =>
                        a.value.localeCompare(b.value)
                      )}
                      required
                      isError={AMErrors["newAMName"] && AMErrors["newAMName"]}
                      errorMsg="Please select AM."
                      className="custom-select-class"
                    />
                  </div>
                </div>

                <div className={onboardList.row}>
                  <HRInputField
                    label={"Note/Comments"}
                    register={AMregister}
                    name={"note"}
                    type={InputType.TEXT}
                    placeholder="Enter Note/Comment"
                    isTextArea
                    rows={5}
                    required
                    validationSchema={{
                      required: "please enter Note/Comments.",
                    }}
                    isError={AMErrors["note"] && AMErrors["note"]}
                    errorMsg="Please Enter note / comments."
                  />
                </div>

                <div className={onboardList.formPanelAction}>
                  <button
                    type="submit"
                    onClick={AMSubmit(saveEditAM)}
                    className={onboardList.btnPrimary}
                    disabled={isLoading}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditAMModal(false)}
                    className={onboardList.btnCancle}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </>
        </Modal>
      )}

      {/** ============ MODAL FOR UPDATE LEAVES ================ */}
      {leaveUpdate && (
        <Modal
          transitionName=""
          width="930px"
          centered
          footer={null}
          className="engagementAddFeedbackModal"
          open={leaveUpdate}
          onCancel={() => {
            setLeaveUpdate(false);
          }}
        >
          <LeaveUppdate
            talentDetails={talentDetails}
            callListData={callListData}
            onCancel={() => {
              setLeaveUpdate(false);
            }}
          />
        </Modal>
      )}
    </div>
  );
}
export default OnBoardList;
