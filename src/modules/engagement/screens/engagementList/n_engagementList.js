import React, {
    useState,
    useEffect,
    useCallback,
    Suspense,
    useMemo
} from "react";
import engagementStyles from './n_engagementList.module.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Tooltip, Modal, Skeleton, Checkbox, Table, message } from 'antd';
import { MasterDAO } from "core/master/masterDAO";
import { HTTPStatusCode } from 'constants/network';
import { EmailRegEx, InputType } from "constants/application";
import { downloadToExcel } from "modules/report/reportUtils";

import { engagementUtils } from "modules/engagement/screens/engagementList/engagementUtils";
import { useNavigate } from 'react-router-dom';
import UTSRoutes from 'constants/routes';
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import { engagementRequestDAO } from "core/engagement/engagementDAO";
import moment from "moment";
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import HRSelectField from "modules/hiring request/components/hrSelectField/hrSelectField";

import LogoLoader from "shared/components/loader/logoLoader";
import { allEngagementConfig } from "modules/engagement/screens/engagementList/allEngagementConfig";
import OnboardFilerList from "modules/onBoardList/OnboardFilterList";
import { UserSessionManagementController } from "modules/user/services/user_session_services";
import { useForm } from "react-hook-form";

import EngagementInvoice from "modules/engagement/screens/engagementInvoice/engagementInvoice";
import EngagementEnd from "modules/engagement/screens/endEngagement/endEngagement";
import EngagementCancel from "modules/engagement/screens/cancelEngagement/cancelEngagement";
import EngagementBillRateAndPayRate from "modules/engagement/screens/engagementBillAndPayRate/engagementBillRateAndPayRate";
import EditAllBRPR from "modules/engagement/screens/editAllBRPR/editAllBRPR";
import RenewEngagement from "modules/engagement/screens/renewEngagement/renewEngagement";
import EngagementFeedback from "modules/engagement/screens/engagementFeedback/engagementFeedback";
import EngagementAddFeedback from "modules/engagement/screens/engagementAddFeedback/engagementAddFeedback";
import LeaveUppdate from "modules/onBoardList/leaveUppdate";


const dummyData = [
    { engagementID: 'EN081225133754_1', engagementId_HRID: 'EN081225133754_1 / HR081225133754', hrID: 1, typeOfHR: 'Full-Time', company: 'Delightree', clientName: 'Arjun Patel', talentName: 'Vikram Joshi', amName: 'Saptarshi Banerjee', currentStatus: 'Ongoing', contractStartDate: '08-08-2026', joiningDate: '08-08-2026', jobTitle: 'Support ReactJS Developer', lwd: '15-03-2023', feedbackStatus: ['Green', 'Green', 'Red'], clientFeedbackAction: 'View/Add', lastFeedbackDate: '12-07-2023', brft: 'AUD 4,450.00', pr: 'AUD 3,560.00', feePercent: '37.14', fee: 'AUD 890.00', usd: '$ 570.00', inr: '₹ 49,000.00', invoiceNo: 'UP-567890', clientEmail: 'arjun.patel@example.com', talentEmail: 'vikram.joshi@example.com', exchRateFee: '89.9', exchRateUsd: '1', exchRateInr: '1' },
    { engagementID: 'EN081225133754_2', engagementId_HRID: 'EN081225133754_1 / HR081225133754', hrID: 2, typeOfHR: 'Full-Time', company: 'Riskspan', clientName: 'Harpreet Singh', talentName: 'Sneha Verma', amName: 'Sushmita Gurjar', currentStatus: 'Lost - Backout', contractStartDate: '29-09-2026', joiningDate: '29-09-2026', jobTitle: 'General Engineering Manager - Onsite Mumbai', lwd: '', feedbackStatus: [], clientFeedbackAction: 'Add', lastFeedbackDate: '', brft: 'INR 1,350,000.00', pr: 'INR 1,08,000.00', feePercent: '38.02', fee: 'INR 27,000.00', usd: '$ 570.00', inr: '₹ 49,000.00', invoiceNo: 'UP-456789', clientEmail: 'harpreet.singh@example.com', talentEmail: 'sneha.verma@example.com', exchRateFee: '89.9', exchRateUsd: '1', exchRateInr: '1' },
    { engagementID: 'EN081225133754_3', engagementId_HRID: 'EN081225133754_1 / HR081225133754', hrID: 3, typeOfHR: 'Full-Time', company: 'RemoFirst', clientName: 'Chloe Adams', talentName: 'Karan Gupta', amName: 'Sushmita Gurjar', currentStatus: 'Awaiting Joining', contractStartDate: '02-04-2026', joiningDate: '02-04-2026', jobTitle: 'Full Stack Developer', lwd: '', feedbackStatus: [], clientFeedbackAction: 'Add', lastFeedbackDate: '', brft: 'USD 3,375.00', pr: 'USD 2,700.00', feePercent: '53.85', fee: 'USD 675.00', usd: '$ 570.00', inr: '₹ 49,000.00', invoiceNo: 'UP-345678', clientEmail: 'chloe.adams@example.com', talentEmail: 'karan.gupta@example.com', exchRateFee: '89.9', exchRateUsd: '1', exchRateInr: '1' },
    { engagementID: 'EN081225133754_4', engagementId_HRID: 'EN081225133754_1 / HR081225133754', hrID: 4, typeOfHR: 'Full-Time', company: 'Calyx Global', clientName: 'Sophie Leclerc', talentName: 'Ananya Singh', amName: 'Nikita Sharma', currentStatus: 'Ongoing', contractStartDate: '18-05-2026', joiningDate: '18-05-2026', jobTitle: 'AWS Devops Engineer', lwd: '22-07-2023', feedbackStatus: ['Green', 'Red', 'Red'], clientFeedbackAction: 'View/Add', lastFeedbackDate: '09-11-2023', brft: 'USD 4,185.00', pr: 'USD 3,348.00', feePercent: '41.84', fee: 'USD 837.00', usd: '$ 570.00', inr: '₹ 49,000.00', invoiceNo: 'UP-123456', clientEmail: 'sophie.leclerc@example.com', talentEmail: 'ananya.singh@example.com', exchRateFee: '89.9', exchRateUsd: '1', exchRateInr: '1' },
    { engagementID: 'EN081225133754_5', engagementId_HRID: 'EN081225133754_1 / HR081225133754', hrID: 5, typeOfHR: 'Full-Time', company: 'DeepMatrix', clientName: 'Ravi Sharma', talentName: 'Neha Bhatia', amName: 'Nikita Sharma', currentStatus: 'Ongoing', contractStartDate: '14-02-2026', joiningDate: '14-02-2026', jobTitle: 'Support Desk Coordinator', lwd: '', feedbackStatus: [], clientFeedbackAction: 'View/Add', lastFeedbackDate: '05-05-2023', brft: 'USD 4,000.00', pr: 'USD 3,200.00', feePercent: '34.96', fee: 'USD 800.00', usd: '$ 570.00', inr: '₹ 49,000.00', invoiceNo: 'UP-099765', clientEmail: 'ravi.sharma@example.com', talentEmail: 'neha.bhatia@example.com', exchRateFee: '89.9', exchRateUsd: '1', exchRateInr: '1' },
    { engagementID: 'EN081225133754_6', engagementId_HRID: 'EN081225133754_1 / HR081225133754', hrID: 6, typeOfHR: 'Full-Time', company: 'Delightree', clientName: 'Emily Johnson', talentName: 'Rahul Desai', amName: 'Nikita Sharma', currentStatus: 'Awaiting Joining', contractStartDate: '23-03-2026', joiningDate: '23-03-2026', jobTitle: 'AWS Devops Engineer', lwd: '30-01-2024', feedbackStatus: [], clientFeedbackAction: 'View/Add', lastFeedbackDate: '30-08-2023', brft: 'USD 3,835.00', pr: 'USD 3,068.00', feePercent: '35.01', fee: 'USD 767.00', usd: '$ 570.00', inr: '₹ 49,000.00', invoiceNo: 'UP-012345', clientEmail: 'emily.johnson@example.com', talentEmail: 'rahul.desai@example.com', exchRateFee: '89.9', exchRateUsd: '1', exchRateInr: '1' },
    { engagementID: 'EN081225133754_7', engagementId_HRID: 'EN081225133754_1 / HR081225133754', hrID: 7, typeOfHR: 'Full-Time', company: 'Threat Modeler Software Inc', clientName: 'Aisha Khan', talentName: 'Aarav Sharma', amName: 'Sushmita Gurjar', currentStatus: 'Cancelled - Backout', contractStartDate: '23-07-2026', joiningDate: '23-07-2026', jobTitle: 'Backend Engineer', lwd: '', feedbackStatus: [], clientFeedbackAction: 'Add', lastFeedbackDate: '', brft: 'EUR 1,866.00', pr: 'EUR 1,493.00', feePercent: '26.89', fee: 'EUR 373.20', usd: '$ 570.00', inr: '₹ 49,000.00', invoiceNo: 'UP-234567', clientEmail: 'aisha.khan@example.com', talentEmail: 'aarav.sharma@example.com', exchRateFee: '89.9', exchRateUsd: '1', exchRateInr: '1' },
    { engagementID: 'EN081225133754_8', engagementId_HRID: 'EN081225133754_1 / HR081225133754', hrID: 8, typeOfHR: 'Full-Time', company: 'Arkatecture', clientName: 'John Smith', talentName: 'Priya Kapoor', amName: 'Saptarshi Banerjee', currentStatus: 'Lost - Backout', contractStartDate: '15-01-2026', joiningDate: '15-01-2026', jobTitle: 'Technical Data Analyst Developer', lwd: '', feedbackStatus: ['Green', 'Green'], clientFeedbackAction: 'View/Add', lastFeedbackDate: '17-04-2023', brft: 'ZAR 52,500.00', pr: 'ZAR 42,000.00', feePercent: '40.03', fee: 'ZAR 10,500.00', usd: '$ 570.00', inr: '₹ 49,000.00', invoiceNo: 'UP-045678', clientEmail: 'john.smith@example.com', talentEmail: 'priya.kapoor@example.com', exchRateFee: '89.9', exchRateUsd: '1', exchRateInr: '1' },
];

function NewEngagementList() {
    const navigate = useNavigate();
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(5000);
    const pageSizeOptions = [10, 20, 50, 100, 200];
    const [searchText, setSearchText] = useState('');

    const [filtersList, setFiltersList] = useState([]);
    const [appliedFilter, setAppliedFilters] = useState(new Map());
    const [checkedState, setCheckedState] = useState(new Map());
    const [filteredTagLength, setFilteredTagLength] = useState(0);

    const [isAllowFilters, setIsAllowFilters] = useState(false);
    const [getHTMLFilter, setHTMLFilter] = useState(false);
    var date = new Date();
    const [startDate, setStartDate] = useState(new Date());

    const [selectedCell, setSelectedCell] = useState('c-total');

    const [onBoardListData, setOnBoardListData] = useState([]);
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
    const [isLoading, setLoading] = useState(false);
    const [gst, setGst] = useState({
        IGST: false,
        CGST: false,
    })
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
        trigger,
        unregister
    } = useForm();

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

    const [userData, setUserData] = useState({});
    // const [searchMenu,setSearchMenu] = useState('');

    const [filteredData, setFilteredData] = useState(null);
    const [isEditTSC, setISEditTSC] = useState(false);
    const [TSCONBoardData, setTSCONBoardData] = useState({});

    const [leaveUpdate, setLeaveUpdate] = useState(false);
    const [talentDetails, setTalentDetails] = useState({});

    const [engagementBillAndPayRateTab, setEngagementBillAndPayRateTab] =
        useState("1");
    const [activeTab, setActiveTab] = useState("");
    const [allBRPRdata, setAllBRPRdata] = useState(null);
    const [rateReason, setRateReason] = useState(undefined);
    const [getBillRate, setBillRate] = useState(0);
    const [getPayRate, setPayRate] = useState(0);

    const [invData, setInvData] = useState({});
    const [isLoadingInvoice, setIsLoadingInvoice] = useState(false);
    const [isInvoiceAvailable, setIsInvoiceAvailable] = useState(false);
    const [invoiceDate, setInvoiceDate] = useState(new Date());
    const [lineItems, setLineItems] = useState([])
    const [controlledPaymentTermValue, setControlledPaymentTermValue] = useState("");


    const [getFeedbackFormContent, setFeedbackFormContent] = useState({});
    const [feedbackCategory, setFeedbackCategory] = useState([])
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

    const [editAMModal, setEditAMModal] = useState(false);
    const [AMLIST, setAMLIST] = useState([]);
    const [AMDetails, setAMDetails] = useState({});
    const [AMLOADING, setAMLOADING] = useState(false);


    useEffect(() => {
        const getUserResult = async () => {
            let userData = UserSessionManagementController.getUserSession();
            if (userData) setUserData(userData);
        };
        getUserResult();
    }, []);

    const getOnBoardListData = async (data) => {
        setLoading(true);
        let result = await MasterDAO.getOnBoardListDAO(data);
        if (result.statusCode === HTTPStatusCode.OK) {
            //    setTotalRecords(result?.responseBody?.details.totalrows);
            setLoading(false);
            setOnBoardListData(result?.responseBody?.details);
        }
        if (result.statusCode === HTTPStatusCode.NOT_FOUND) {
            setLoading(false);
            //    setTotalRecords(0);
            setOnBoardListData([]);
        }
        setLoading(false);
    };

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

    const invoicePaymentTermMaster = [
        { id: 1, value: 'Due on Receipt' },
        { id: 7, value: 'Net 7' },
        { id: 15, value: 'Net 15' },
        { id: 20, value: 'Net 20' },
        { id: 30, value: 'Net 30' },
        { id: 45, value: 'Net 45' },
        { id: 60, value: 'Net 60' },
        { id: 90, value: 'Net 90' },
    ]

    useEffect(() => {
        let payload = {
            pagenumber: pageIndex,
            totalrecord: pageSize,
            filterFields_OnBoard: {
                ...tableFilteredState.filterFields_OnBoard,
                search: searchText,
                toDate: "",
                fromDate: "",
                searchMonth: +moment(startDate).format("M"),
                searchYear: +moment(startDate).format("YYYY"),
                AmberFeedback: tableFilteredState.filterFields_OnBoard?.SummaryFilterOption === "AF" ? 1 : 0,
                RedFeedback: tableFilteredState.filterFields_OnBoard?.SummaryFilterOption === "RF" ? 1 : 0,
            },
        };
        getOnBoardListData(payload);
    }, [tableFilteredState, searchText, pageIndex, pageSize, startDate]);

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

    // Calendar filter (month-year)
    const onCalenderFilter = (dates) => {
        setStartDate(dates);
    };

    // Toggle filter sidebar
    const toggleHRFilter = useCallback(() => {
        !getHTMLFilter
            ? setIsAllowFilters(true)
            : setTimeout(() => { setIsAllowFilters(true); }, 300);
        setHTMLFilter(!getHTMLFilter);
    }, [getHTMLFilter]);

    const onRemoveHRFilters = () => {
        setTimeout(() => { setIsAllowFilters(false); }, 300);
        setHTMLFilter(false);
    };

    const callListData = () => {
        let payload = {
            pagenumber: pageIndex,
            totalrecord: pageSize,
            filterFields_OnBoard: {
                ...tableFilteredState.filterFields_OnBoard,
                search: searchText,
                toDate: "",
                fromDate: "",
                searchMonth: +moment(startDate).format("M"),
                searchYear: +moment(startDate).format("YYYY"),
                AmberFeedback: tableFilteredState.filterFields_OnBoard?.SummaryFilterOption === "AF" ? 1 : 0,
            },
        };
        getOnBoardListData(payload);
    };


    const feedbackTableColumnsMemo = useMemo(
        () => allEngagementConfig.clientFeedbackTypeConfig(),
        []
    );


    // Clear all filters
    const clearFilters = useCallback(() => {
        setAppliedFilters(new Map());
        setCheckedState(new Map());
        setFilteredTagLength(0);
        onRemoveHRFilters();


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

        setTableFilteredState({
            ...tableFilteredState,
            filterFields_OnBoard: defaultFilters,
        });

        onRemoveHRFilters();

        setSearchText('');
        setStartDate(new Date());

    }, []);

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
        const categorylistResult = await engagementRequestDAO.getFeedbackFormCategoryDAO()

        if (categorylistResult?.statusCode === HTTPStatusCode.OK) {
            setFeedbackCategory(categorylistResult?.responseBody?.details.map(v => ({ id: v.id, value: v.lostCategory })));
        }

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

    const handleExport = () => {
const columns = [
  { key: "engagementId", label: "ENG. ID" },
  { key: "hrId", label: "HR#" },
  {key:"engagementCount" , label: 'ENG. COUNT'},
  { key: "type", label: "TYPE" },
  { key: "company", label: "COMPANY NAME" },
  { key: "clientName", label: "CLIENT NAME" },
  { key: "clientEmail", label: "CLIENT EMAIL" },
  { key: "talent", label: "TALENT" },
  { key: "talentEmail", label: "TALENT EMAIL" },
  { key: "am", label: "AM" },
  { key: "status", label: "STATUS" },
  { key: "joiningDate", label: "JOINING DATE" },
  { key: "jobTitle", label: "JOB TITLE" },
  { key: "lwd", label: "LWD" },
  { key: "feedbackStatus", label: "FEEDBACK STATUS" },
  { key: "lastFeedbackDate", label: "LAST FEEDBACK DATE" },
  { key: "brFt", label: "BR/FT" },
  { key: "pr", label: "PR" },
  { key: "feePercent", label: "FEE %" },
  { key: "uplersFee", label: "UPLERS FEE" },
  { key: "uplersFeeUSD", label: "UPLERS FEE (USD)" },
  { key: "uplersFeeINR", label: "UPLERS FEE (INR)" },
  { key: "invoiceNo", label: "INVOICE NO." }
];

const dataToExport =  onBoardListData.map((data) => {
    const clientParts = data?.client?.split("\n") || [];
    const engParts = data?.engagemenID?.split("/") || [];

    return {
      engagementId: engParts[0] || "",
      hrId: engParts[1] || "",
engagementCount: data?.engagementCount || "",
      type: data?.typeOfHR || "",
      company: data?.company || "",

      clientName: clientParts[0] || "",
      clientEmail: (clientParts[1] || "").replace(/[()]/g, ""),

      talent: data?.talent || "",
      talentEmail: data?.talentEmail || "",

      am: data?.amAssignmentuser || "",
      status: data?.contractStatus || "",

      joiningDate: data?.joiningdate || "",
      jobTitle: data?.position || "",

      lwd: `${data?.lastWorkingDate || "NA"} - ${data?.contractEndDate || ""}`,

      feedbackStatus: data?.clientFeedbackstr || "",
      lastFeedbackDate: data?.lastFeedbackDate || "",

      brFt: data?.payout_BillRate || "",
      pr: data?.payout_PayRate || "",

      feePercent: data?.nrPercentage || "",

      uplersFee: data?.uplersFees || "",
      uplersFeeUSD: data?.uplersFees_USD || "",
      uplersFeeINR: data?.uplersFees_INR || "",

      invoiceNo: data?.payout_ESales_InvoiceNumber || "NA",
    };
  });

    let data = dataToExport.map((row) => {
    let formattedRow = {};
    columns.forEach((col) => {
      formattedRow[col.label] = row[col.key];
    });
    return formattedRow;
     })
downloadToExcel(data, "Engagement Report");
    };

    // Client-side search on dummy data
    const handleSearchInput = (e) => {
        setSearchText(e.target.value);
    };


    // Pagination helpers
    function getPageNumbers(currentPage, totalPages) {
        const pages = [];
        if (totalPages <= 6) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            const left = Math.max(2, currentPage - 1);
            const right = Math.min(totalPages - 1, currentPage + 1);
            pages.push(1);
            if (left > 2) pages.push("...");
            for (let i = left; i <= right; i++) pages.push(i);
            if (right < totalPages - 1) pages.push("...");
            pages.push(totalPages);
        }
        return pages;
    }

    function PaginationComponent({ currentPage, totalRecords, pageSize, onPageChange }) {
        const totalPages = Math.ceil(totalRecords / pageSize);
        const pages = getPageNumbers(currentPage, totalPages);
        return (
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <button className={engagementStyles["pagination-btn"]} disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
                    <img src="images/arrow-left-ic.svg" alt="Previous" title="Previous Page" />
                </button>
                {pages.map((p, i) =>
                    p === "..." ? (
                        <span key={i}>...</span>
                    ) : (
                        <button
                            key={i}
                            onClick={() => onPageChange(p)}
                            style={{
                                background: p === currentPage ? "#FFDA30" : "white",
                                border: "1px solid #ccc",
                                padding: "4px 8px",
                                cursor: "pointer",
                                borderRadius: "4px",
                                fontWeight: p === currentPage ? "600" : "400",
                            }}
                        >
                            {p}
                        </button>
                    )
                )}
                <button className={engagementStyles["pagination-btn"]} disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => onPageChange(currentPage + 1)}>
                    <img src="images/arrow-right-ic.svg" alt="Next" title="Next Page" />
                </button>
            </div>
        );
    }

    // Action dropdown state
    const [openActionIndex, setOpenActionIndex] = useState(null);
    const [copiedEmail, setCopiedEmail] = useState(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = () => setOpenActionIndex(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Cell selection handler
    const handleCellClick = (cellKey) => {
        setSelectedCell(prev => prev === cellKey ? null : cellKey);
    };

    // Get cell class for grid cells
    const getCellClass = (cellKey, isTotal = false) => {
        let cls = engagementStyles["stats-cell"];
        if (isTotal) cls += ` ${engagementStyles["stats-cell-total"]}`;
        if (selectedCell === cellKey) cls += ` ${engagementStyles["stats-cell-selected"]}`;
        return cls;
    };

    // Copy to clipboard helper
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopiedEmail(text);
        setTimeout(() => setCopiedEmail(null), 1500);
    };

    // Feedback color mapping
    const getFeedbackDotClass = (color) => {
        switch (color) {
            case 'Green': return engagementStyles["feedback-dot-green"];
            case 'Red': return engagementStyles["feedback-dot-red"];
            case 'Orange': return engagementStyles["feedback-dot-orange"];
            default: return '';
        }
    };

    const getInvoiceInfo = async (param, monthDate) => {
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
            data.typeOfHR = param.typeOfHR;
            setInvData(data);
            invoiceSetValue("company", data.company);
            invoiceSetValue("client", data.client_EmailID);
            invoiceSetValue("zohoCustomer", data.zoho_Client_EmailID);
            invoiceSetValue("currency", data.invoice_CurrencyCode);
            invoiceSetValue("paymentTerm", data.paymentTermDays);
            setControlledPaymentTermValue(data.paymentTerms);
            // invoiceSetValue()
            setInvoiceDate(new Date(data.invoiceDate));

            setLineItems(result.responseBody.details.map(item => ({
                itemName: item.itemName,
                lineItem: item.lineItem,
                rate: item.rate,
                qty: item.qty,
                lineItemTotal: item.lineItemTotal,
                itemDescription: item.itemDescription,
                isIGST: item.isIGST,
                payoutId: item.id
            })))
            // console.log('data',data.invoiceDate,moment(data.invoiceDateStr).format('DD-MM-YYYY'), new Date(data.invoiceDateStr), data )
        } else {
            setIsInvoiceAvailable(false);
        }
    }

    const ActionOptions = ({ data, onClose }) => {

        let listItemData = [
            //   {
            //     label: data.engagemenID,
            //     key: "HRDetails",
            //     IsEnabled: false,
            //   },
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

        if (!data?.lastWorkingDate) {
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
            data?.typeOfHR === "Contractual" &&
            data?.payout_BillRate !== ""
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
            data?.isRenewalAvailable === 1 &&
            data?.isRenewalContract === 0 &&
            data?.isOngoing !== "Ongoing"
        ) {
            listItemData.push({
                label: "Renew Engagement",
                key: "reNewEngagement",
                IsEnabled: true,
            });
        }
        if (
            data?.talentLegal_StatusID === 2 &&
            data?.clientLegal_StatusID === 2 &&
            data?.isContractCompleted !== 1 &&
            data?.isHRManaged === 0 &&
            data?.currentStatus !== "In Replacement" &&
            (data?.replacementID === 0 || data?.replacementID === null)
        ) {
            listItemData.push({
                label: "Replace Engagement",
                key: "replaceEngagement",
                IsEnabled: true,
            });
        }

        if (userData?.ShowInvoiceCreationCTA && data?.isInvoiceCreated === 0) {
            listItemData.push({
                label: "Create Invoice",
                key: "createInvoice",
                IsEnabled: true,
            });
        }

        const caseHandler = (label) => {
            switch (label) {
                case "Replace Engagement": {
                    setEngagementModal({
                        ...getEngagementModal,
                        engagementReplaceTalent: true,
                    });
                    setFilteredData({
                        ...data,
                        onboardID: data.id,
                        hrID: data.hiringId,
                    });
                    break;
                }
                case "Update Leaves": {
                    setLeaveUpdate(true);
                    setTalentDetails(data);
                }
                case "Edit TSC Name": {
                    setISEditTSC(true);
                    setTSCONBoardData({
                        onboardID: data.onboardID,
                        engagementID: data.engagementID,
                        talentName: data.talentName,
                        tscName: data.tscName,
                    });
                    break;
                }
                case "Renew Engagement": {
                    setEngagementModal({
                        ...getEngagementModal,
                        engagementRenew: true,
                    });
                    setFilteredData({
                        ...data,
                        onboardID: data.id,
                        hrID: data.hiringId,
                    });
                    break;
                }
                case "End Engagement": {
                    setEngagementModal({
                        ...getEngagementModal,
                        engagementEnd: true,
                    });
                    setFilteredData({
                        ...data,
                        onboardID: data.id,
                        hrID: data.hiringId,
                    });
                    break;
                }
                case "Cancel Engagement": {
                    setEngagementModal({
                        ...getEngagementModal,
                        engagementCancel: true,
                    });
                    setFilteredData({
                        ...data,
                        onboardID: data.id,
                        hrID: data.hiringId,
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
                        ...data,
                        onboardID: data.id,
                        hrID: data.hiringId,
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
                        ...data,
                        onboardID: data.id,
                        hrID: data.hiringId,
                    });
                    break;
                }
                case "Edit All BR PR": {
                    setEngagementModal({
                        ...getEngagementModal,
                        engagementEditAllBillRateAndPayRate: true,
                    });
                    setAllBRPRdata({
                        ...data,
                        onboardID: data.id,
                        hrID: data.hiringId,
                    });
                    break;
                }
                case "Add Invoice Details": {
                    setEngagementModal({
                        ...getEngagementModal,
                        engagementInvoice: true,
                    });
                    setFilteredData({
                        ...data,
                        onboardID: data.id,
                        hrID: data.hiringId,
                    });
                    break;
                }
                case "Send Custom Email": {
                    navigate(
                        `/viewOnboardDetails/${data.id}/${data.isOngoing === "Ongoing" ? true : false
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
                    getInvoiceInfo(data, startDate);
                    break;
                }
                default:
                    break;
            }
        }

        return <>
            {listItemData.map((item) => (
                <button
                    key={item.key}
                    className={engagementStyles["action-item"]}
                    onClick={() => {
                        caseHandler(item.label);
                        onClose();

                    }}
                >
                    {item.label}
                </button>
            ))}
            {/* <button className={engagementStyles["action-item"]}
                                                            onClick={() => {
                                                                onClose()
                                                                if (data?.hrID) {
                                                                    window.open(`/allhiringrequest/${data.hrID}`, '_blank');
                                                                }
                                                            }}>
                                                            HR Details
                                                        </button> */}
        </>
    }

    const lineItemsColumnsMemo = useMemo(() => {

        return [
            {
                title: "#",
                dataIndex: '',
                key: "",
                align: "left",
                // width: "95px",
                render: (text, res, ind) => {
                    return ind + 1
                }
            },
            {
                title: "Item & Description",
                dataIndex: "lineItem",
                key: "lineItem",
                align: "left",
                // width: "95px",
                render: (text) => {
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
    }, [lineItems])

    const getLineItemsBasedOnGST = (lineItems, gst) => {
        if (gst.IGST === false && gst.CGST === false) {
            return lineItems.filter(item => item.isIGST === null)
        }

        if (gst.IGST === true && gst.CGST === false) {
            return lineItems.filter(item => item.isIGST === null || item.isIGST === true)
        }

        if (gst.IGST === false && gst.CGST === true) {
            return lineItems.filter(item => item.isIGST === null || item.isIGST === false)
        }
    }


    const calDueDate = (date, term) => {
        let dueDate = new Date(date);
        dueDate.setDate(dueDate.getDate() + term);
        return dueDate
    }

    const saveInvoice = async (d) => {
        let dueDate = calDueDate(invoiceDate, +d.paymentTerm);
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
                dueDate: moment(dueDate).format("yyyy-MM-DD"), //duedate
                paymentExpectedDate: moment(dueDate).format("yyyy-MM-DD"), //duedate
                lastPaymentDate: null, //duedate
                zohoContactID: invData?.zohoContactID, //zohoContactID
                paymentTermDays: d.paymentTerm, //paymentTermDays
                payment_Terms: invoicePaymentTermMaster.find(item => item.id === d.paymentTerm).value, // paymentTerms
                zohoCustomerEmailID: d.zohoCustomer, //zoho_Client_EmailID
                clientEmailID: d.client, //client_EmailID
                typeOfHR: invData?.typeOfHR,
            },
            invoiceLineItemDto: getLineItemsBasedOnGST(lineItems, gst).map(i => (
                {
                    itemName: i?.itemName,
                    description: i?.itemDescription, //lineItem
                    rate: i?.rate, //rate
                    quantity: i?.qty, //qty
                    itemTotal: i?.lineItemTotal, //lineItemTotal
                    payoutId: i?.payoutId
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
            setGst((prev) => ({
                IGST: false,
                CGST: false,
            }));
        } else {
            message.error('Something went wrong!')
        }
    };

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


    return (
        <main className={engagementStyles["main-content"]}>
            <div className={engagementStyles["content-wrapper"]}>
                <LogoLoader visible={isLoading} />
                {/* ===== Filter Controls Row ===== */}
                <div className={engagementStyles["filter-controls"]}>
                    {/* 1. Search */}
                    <div className={`${engagementStyles["filter-group"]} ${engagementStyles["search-group"]}`}>
                        <input
                            type="text"
                            className={engagementStyles["filter-input"]}
                            placeholder="Search"
                            value={searchText}
                            onChange={handleSearchInput}
                        />
                        {searchText.length > 0 && (
                            <Tooltip title="Clear search">
                                <span style={{ position: 'absolute', right: '36px', color: 'red', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
                                    onClick={() => { setSearchText(''); }}>
                                    X
                                </span>
                            </Tooltip>
                        )}
                        <img src="images/search-ic.svg" alt="Search" className={engagementStyles["input-icon"]} />
                    </div>

                    {/* 2. Type Toggle */}
                    <div className={engagementStyles["toggle-group"]}>
                        <button
                            className={`${engagementStyles["toggle-btn"]} ${tableFilteredState?.filterFields_OnBoard?.EngType === 'A' ? engagementStyles["toggle-btn-active"] : ''}`}
                            onClick={() => {
                                setTableFilteredState((prev) => ({
                                    ...prev,
                                    filterFields_OnBoard: {
                                        ...prev.filterFields_OnBoard,
                                        EngType: 'A',
                                    },
                                }))
                            }}
                        >All</button>
                        <button
                            className={`${engagementStyles["toggle-btn"]} ${tableFilteredState?.filterFields_OnBoard?.EngType === 'D' ? engagementStyles["toggle-btn-active"] : ''}`}
                            onClick={() => {
                                setTableFilteredState((prev) => ({
                                    ...prev,
                                    filterFields_OnBoard: {
                                        ...prev.filterFields_OnBoard,
                                        EngType: 'D',
                                    },
                                }))
                            }}
                        >FT</button>
                        <button
                            className={`${engagementStyles["toggle-btn"]} ${tableFilteredState?.filterFields_OnBoard?.EngType === 'C' ? engagementStyles["toggle-btn-active"] : ''}`}
                            onClick={() => {
                                setTableFilteredState((prev) => ({
                                    ...prev,
                                    filterFields_OnBoard: {
                                        ...prev.filterFields_OnBoard,
                                        EngType: 'C',
                                    },
                                }))
                            }}
                        >Contract</button>
                    </div>

                    {/* 3. Month-Year Picker */}
                    <div className={engagementStyles["calendarFilter"]}>
                        <img src="images/calendar-ic.svg" alt="Calendar" className={engagementStyles["calendar-icon-left"]} />
                        <DatePicker
                            onKeyDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
                            className={engagementStyles["dateFilter"]}
                            placeholderText="Month - Year"
                            selected={startDate}
                            onChange={onCalenderFilter}
                            dateFormat="MMM yyyy"
                            showMonthYearPicker
                        />
                        <img src="images/select-dropdown-ic.svg" alt="Dropdown" className={engagementStyles["calendar-dropdown-icon"]} />
                    </div>

                    {/* 4. Add Filters */}
                    <button className={engagementStyles["filter-btn"]} onClick={toggleHRFilter}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <img src="images/filter-ic.svg" alt="Filter" />
                            <span>Add Filters</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <div className={engagementStyles["filterCount"]}>{filteredTagLength}</div>
                            {filteredTagLength > 0 && (
                                <Tooltip title="Reset Filters">
                                    <span style={{ color: 'red', fontWeight: 'bold', cursor: 'pointer' }}
                                        onClick={(e) => { e.stopPropagation(); clearFilters(); }}>
                                        X
                                    </span>
                                </Tooltip>
                            )}
                        </div>
                    </button>

                    {/* 5. Export */}
                    <button className={engagementStyles["btn-export"]} onClick={() => handleExport(dummyData)}>
                        EXPORT
                    </button>
                </div>

                {/* ===== Stats Section ===== */}
                <div className={engagementStyles["stats-row"]}>
                    {/* FULL-TIME: 2x2 grid */}
                 {tableFilteredState?.filterFields_OnBoard?.EngType !== 'C' &&  <div className={engagementStyles["stats-section"]}>
                        <div className={engagementStyles["stats-section-header"]}>FULL-TIME</div>
                        <div className={engagementStyles["stats-table-ft"]}>
                            <div className={getCellClass('ft-added')} onClick={() => {
                                handleCellClick('ft-added')
                                setTableFilteredState((prev) => ({
                                    ...prev,
                                    filterFields_OnBoard: {
                                        ...prev.filterFields_OnBoard,
                                        SummaryFilterOption: "ADD",
                                    },
                                }))
                            }}>
                                <span className={engagementStyles["stats-number"]}>{onBoardListData[0]?.s_AddedDP
                                    ? onBoardListData[0]?.s_AddedDP
                                    : 0}</span>
                                <span className={engagementStyles["stats-label"]}>ADDED</span>
                            </div>
                            <div className={getCellClass('ft-active')} onClick={() => {
                                handleCellClick('ft-active')
                                setTableFilteredState((prev) => ({
                                    ...prev,
                                    filterFields_OnBoard: {
                                        ...prev.filterFields_OnBoard,
                                        SummaryFilterOption: "AD",
                                    },
                                }))
                            }}>
                                <span className={engagementStyles["stats-number"]}>{onBoardListData[0]?.s_TotalDPActiveEng
                                    ? onBoardListData[0]?.s_TotalDPActiveEng
                                    : 0}</span>
                                <span className={engagementStyles["stats-label"]}>ACTIVE</span>
                            </div>
                            {/* <div className={getCellClass('ft-eor')} onClick={() => handleCellClick('ft-eor')}>
                                <span className={engagementStyles["stats-number"]}>12</span>
                                <span className={engagementStyles["stats-label"]}>EOR</span>
                            </div> */}
                            <div className={getCellClass('ft-total')} onClick={() => {}}>
                                <span className={engagementStyles["stats-number"]}>{ onBoardListData?.filter(i=> i.typeOfHR === 'DP')?.length }</span>
                                <span className={engagementStyles["stats-label"]}>TOTAL</span>
                            </div>
                        </div>
                    </div>}   

                    {/* CONTRACTS: row1=4cols, row2=3cols */}

                    {tableFilteredState?.filterFields_OnBoard?.EngType !== 'D' && <div className={engagementStyles["stats-section"]}>
                        <div className={engagementStyles["stats-section-header"]}>CONTRACTS</div>
                        <div className={engagementStyles["stats-grid-contracts"]}>
                            <div className={getCellClass('c-active')} onClick={() => {
                                handleCellClick('c-active')
                                setTableFilteredState((prev) => ({
                                    ...prev,
                                    filterFields_OnBoard: {
                                        ...prev.filterFields_OnBoard,
                                        SummaryFilterOption: "AC",
                                    },
                                }))
                            }}>
                                <span className={engagementStyles["stats-number"]}>  {onBoardListData[0]?.s_TotalActiveEng
                                    ? onBoardListData[0]?.s_TotalActiveEng
                                    : 0}</span>
                                <span className={engagementStyles["stats-label"]}>ACTIVE</span>
                            </div>
                            <div className={getCellClass('c-added')} onClick={() => {
                                handleCellClick('c-added')
                                setTableFilteredState((prev) => ({
                                    ...prev,
                                    filterFields_OnBoard: {
                                        ...prev.filterFields_OnBoard,
                                        SummaryFilterOption: "ADC",
                                    },
                                }))
                            }}>
                                <span className={engagementStyles["stats-number"]}> {onBoardListData[0]?.s_TotalAddedContract
                                    ? onBoardListData[0]?.s_TotalAddedContract
                                    : 0}</span>
                                <span className={engagementStyles["stats-label"]}>ADDED</span>
                            </div>
                            <div className={getCellClass('c-recurring')} onClick={() => {
                                handleCellClick('c-recurring')
                                setTableFilteredState((prev) => ({
                                    ...prev,
                                    filterFields_OnBoard: {
                                        ...prev.filterFields_OnBoard,
                                        SummaryFilterOption: "RC",
                                    },
                                }))
                            }}>
                                <span className={engagementStyles["stats-number"]}> {onBoardListData[0]?.s_TotalRecurringContract
                                    ? onBoardListData[0]?.s_TotalRecurringContract
                                    : 0}</span>
                                <span className={engagementStyles["stats-label"]}>RECURRING</span>
                            </div>
                            <div className={getCellClass('c-renew')} onClick={() => {
                                handleCellClick('c-renew')
                                setTableFilteredState((prev) => ({
                                    ...prev,
                                    filterFields_OnBoard: {
                                        ...prev.filterFields_OnBoard,
                                        SummaryFilterOption: "RE",
                                    },
                                }))
                            }}>
                                <span className={engagementStyles["stats-number"]}>{onBoardListData[0]?.s_TotalRenewEng
                                    ? onBoardListData[0]?.s_TotalRenewEng
                                    : 0}</span>
                                <span className={engagementStyles["stats-label"]}>RENEW ENGAGEMENT</span>
                            </div>
                            <div className={getCellClass('c-eor')} onClick={() => {
                                handleCellClick('c-eor')
                                setTableFilteredState((prev) => ({
                                    ...prev,
                                    filterFields_OnBoard: {
                                        ...prev.filterFields_OnBoard,
                                        SummaryFilterOption: "EOR",
                                    },
                                }))
                            }}>
                                <span className={engagementStyles["stats-number"]}>  {onBoardListData[0]?.s_TotalEOR
                                    ? onBoardListData[0]?.s_TotalEOR
                                    : 0}</span>
                                <span className={engagementStyles["stats-label"]}>EOR</span>
                            </div>
                            <div className={getCellClass('c-lost')} onClick={() => {
                                handleCellClick('c-lost')
                                setTableFilteredState((prev) => ({
                                    ...prev,
                                    filterFields_OnBoard: {
                                        ...prev.filterFields_OnBoard,
                                        SummaryFilterOption: "LC",
                                    },
                                }))
                            }}>
                                <span className={engagementStyles["stats-number"]}>{onBoardListData[0]?.s_TotalLostEng
                                    ? onBoardListData[0]?.s_TotalLostEng
                                    : 0}</span>
                                <span className={engagementStyles["stats-label"]}>LOST</span>
                            </div>
                            <div className={getCellClass('c-total')} onClick={() => {
                                handleCellClick('c-total')
                                setTableFilteredState((prev) => ({
                                                    ...prev,
                                                    filterFields_OnBoard: {
                                                    ...prev.filterFields_OnBoard,
                                                    SummaryFilterOption: "AT",
                                                    },
                                                }))
                            }}>
                                <span className={engagementStyles["stats-number"]}> {onBoardListData[0]?.totalRecords
                          ? onBoardListData[0]?.totalRecords
                          : 0}</span>
                                <span className={engagementStyles["stats-label"]}>TOTAL</span>
                            </div>
                        </div>
                    </div> }
                    

                    {/* FEEDBACK: row1=2cols, row2=1col */}
                    <div className={engagementStyles["stats-section"]}>
                        <div className={engagementStyles["stats-section-header"]}>FEEDBACK</div>
                        <div className={engagementStyles["stats-grid-feedback"]}>
                            <div className={getCellClass('fb-amber')} onClick={() => {
                                handleCellClick('fb-amber')
                                setTableFilteredState((prev) => ({
                                    ...prev,
                                    filterFields_OnBoard: {
                                        ...prev.filterFields_OnBoard,
                                        SummaryFilterOption: "AF",
                                    },
                                }))
                            }}>
                                <span className={`${engagementStyles["stats-number"]} ${engagementStyles["stats-number-amber"]}`}>  {onBoardListData[0]?.totalAmberFeedbackCount
                                    ? onBoardListData[0]?.totalAmberFeedbackCount
                                    : 0}</span>
                                <span className={engagementStyles["stats-label"]}>AMBER</span>
                            </div>
                            <div className={getCellClass('fb-red')} onClick={() => {
                                handleCellClick('fb-red')
                                setTableFilteredState((prev) => ({
                                    ...prev,
                                    filterFields_OnBoard: {
                                        ...prev.filterFields_OnBoard,
                                        SummaryFilterOption: "RF",
                                    },
                                }))
                            }}>
                                <span className={`${engagementStyles["stats-number"]} ${engagementStyles["stats-number-red"]}`}>  {onBoardListData[0]?.totalRedFeedbackCount
                                    ? onBoardListData[0]?.totalRedFeedbackCount
                                    : 0}</span>
                                <span className={engagementStyles["stats-label"]}>RED</span>
                            </div>
                            <div className={getCellClass('fb-received')} onClick={() => {
                                handleCellClick('fb-received')
                                setTableFilteredState((prev) => ({
                                    ...prev,
                                    filterFields_OnBoard: {
                                        ...prev.filterFields_OnBoard,
                                        SummaryFilterOption: "FR",
                                    },
                                }))
                            }}>
                                <span className={engagementStyles["stats-number"]}>    {onBoardListData[0]?.s_TotalFeedbackReceived
                                    ? onBoardListData[0]?.s_TotalFeedbackReceived
                                    : 0}</span>
                                <span className={engagementStyles["stats-label"]}>FEEDBACK RECEIVED</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== Data Table ===== */}
                <div className={engagementStyles["table-container"]} style={{ marginBottom: '80px' }}>
                    <table className={engagementStyles["data-table"]}>
                        <thead>
                            <tr>
                                <th rowSpan={2} style={{ minWidth: '80px' }}>SHORTCUTS</th>
                                <th rowSpan={2} style={{ minWidth: '160px' }}>ENG. ID / HR#</th>
                                 <th rowSpan={2} style={{ minWidth: '80px' }}>ENG. COUNT</th>
                                <th rowSpan={2}>TYPE</th>
                                <th rowSpan={2} style={{ minWidth: '160px' }}>COMPANY NAME</th>
                                <th rowSpan={2} style={{ minWidth: '130px' }}>CLIENT</th>
                                <th rowSpan={2} style={{ minWidth: '130px' }}>TALENT</th>
                                <th rowSpan={2} style={{ minWidth: '140px' }}>AM</th>
                                <th rowSpan={2} style={{ minWidth: '130px' }}>STATUS</th>
                                <th rowSpan={2} style={{ minWidth: '100px' }}>JOINING DATE</th>
                                <th rowSpan={2} style={{ minWidth: '160px' }}>JOB TITLE</th>
                                <th rowSpan={2} style={{ minWidth: '90px' }}>LWD</th>
                                <th rowSpan={2} style={{ minWidth: '100px' }}>FEEDBACK STATUS</th>
                                <th rowSpan={2} style={{ minWidth: '130px' }}>CLIENT FEEDBACK<br />LAST FEEDBACK DATE</th>
                                <th rowSpan={2} style={{ minWidth: '110px' }}>BR/FT</th>
                                <th rowSpan={2} style={{ minWidth: '110px' }}>PR</th>
                                <th rowSpan={2} style={{ minWidth: '60px' }}>FEE %</th>
                                <th colSpan={3} className={engagementStyles["th-grouped"]}>UPLERS FEE</th>
                                <th rowSpan={2} style={{ minWidth: '100px' }}>INVOICE NO.</th>
                            </tr>
                            <tr>
                                <th className={engagementStyles["th-sub"]}><span className={engagementStyles["th-sub-label"]}>FEE</span></th>
                                <th className={engagementStyles["th-sub"]}><span className={engagementStyles["th-sub-label"]}>USD</span></th>
                                <th className={engagementStyles["th-sub"]}><span className={engagementStyles["th-sub-label"]}>INR</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {onBoardListData?.length === 0 ? (
                                <tr>
                                    <td colSpan={20} style={{ textAlign: "center", padding: "20px" }}>
                                        No data available
                                    </td>
                                </tr>
                            ) : (
                                onBoardListData.map((data, index) => {
                                    const engIds = data?.engagementId_HRID?.split(' / ') || [];
                                    return (
                                        <tr key={data?.engagementID || index}>
                                            {/* SHORTCUTS */}
                                            <td>
                                                <div className={engagementStyles["action-btn-wrapper"]}>
                                                    <button
                                                        className={engagementStyles["action-btn"]}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenActionIndex(openActionIndex === index ? null : index);
                                                        }}
                                                    >
                                                        Action
                                                        <span className={engagementStyles["action-btn-arrow"]}><img src="images/select-dropdown-ic.svg" alt="Dropdown" className={engagementStyles["action-dropdown-icon"]} /></span>
                                                    </button>
                                                    <div className={`${engagementStyles["action-dropdown"]} ${openActionIndex === index ? engagementStyles["show"] : ''}`}>
                                                        <ActionOptions data={data} onClose={() => setOpenActionIndex(null)} />
                                                        {/* <button className={engagementStyles["action-item"]}
                                                            onClick={() => {
                                                                setOpenActionIndex(null);
                                                                if (data?.hrID) {
                                                                    window.open(`/allhiringrequest/${data.hrID}`, '_blank');
                                                                }
                                                            }}>
                                                            HR Details
                                                        </button>
                                                        <button className={engagementStyles["action-item"]}
                                                            onClick={() => setOpenActionIndex(null)}>
                                                            Add Invoice Details
                                                        </button>
                                                        <button className={engagementStyles["action-item"]}
                                                            onClick={() => setOpenActionIndex(null)}>
                                                            End Engagement
                                                        </button>
                                                        <button className={engagementStyles["action-item"]}
                                                            onClick={() => setOpenActionIndex(null)}>
                                                            Cancel Engagement
                                                        </button> */}
                                                    </div>
                                                </div>
                                            </td>
                                            {/* ENG. ID / HR# */}
                                            <td>
                                                <a href={`/viewOnboardDetails/${data.id}/${data.isOngoing === "Ongoing" ? true : false
                                                    }`} target="_blank" rel="noreferrer" className={engagementStyles["eng-id"]}>
                                                    {data?.engagemenID.slice(0, data?.engagemenID?.indexOf("/"))}
                                                </a>
                                                <a href={`/allhiringrequest/${data?.hiringId}`} target="_blank" rel="noreferrer" className={engagementStyles["eng-id-sub"]}> {data?.engagemenID.slice(data?.engagemenID?.indexOf("/"))}</a>
                                            </td>
                                              {/* ENG. COUNT */}
                                            <td>{data?.engagementCount}</td>
                                            {/* TYPE */}
                                            <td>{data?.typeOfHR}</td>
                                            {/* COMPANY NAME */}
                                            <td style={{ whiteSpace: 'normal', maxWidth: '220px' }}>{data?.company}</td>
                                            {/* CLIENT - with tooltip */}
                                            <td>
                                                <div className={engagementStyles["tooltip-wrapper"]}>
                                                    {data?.client?.split('\n')[0]}
                                                    <div className={engagementStyles["tooltip-content"]}>
                                                        <span>{data?.client?.split('\n')[1].replace(/[()]/g, "")}</span>
                                                        <button className={engagementStyles["tooltip-copy-btn"]} onClick={() => copyToClipboard(data?.client?.split('\n')[1].replace(/[()]/g, ""))} title="Copy email">
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.25 6H3.75C3.55109 6 3.36032 6.07902 3.21967 6.21967C3.07902 6.36032 3 6.55109 3 6.75V20.25C3 20.4489 3.07902 20.6397 3.21967 20.7803C3.36032 20.921 3.55109 21 3.75 21H17.25C17.4489 21 17.6397 20.921 17.7803 20.7803C17.921 20.6397 18 20.4489 18 20.25V6.75C18 6.55109 17.921 6.36032 17.7803 6.21967C17.6397 6.07902 17.4489 6 17.25 6ZM16.5 19.5H4.5V7.5H16.5V19.5ZM21 3.75V17.25C21 17.4489 20.921 17.6397 20.7803 17.7803C20.6397 17.921 20.4489 18 20.25 18C20.0511 18 19.8603 17.921 19.7197 17.7803C19.579 17.6397 19.5 17.4489 19.5 17.25V4.5H6.75C6.55109 4.5 6.36032 4.42098 6.21967 4.28033C6.07902 4.13968 6 3.94891 6 3.75C6 3.55109 6.07902 3.36032 6.21967 3.21967C6.36032 3.07902 6.55109 3 6.75 3H20.25C20.4489 3 20.6397 3.07902 20.7803 3.21967C20.921 3.36032 21 3.55109 21 3.75Z" fill="black" /></svg>
                                                        </button>
                                                        {copiedEmail === data?.clientEmail && <span className={engagementStyles["copied-text"]}>Copied!</span>}
                                                    </div>
                                                </div>
                                            </td>
                                            {/* TALENT - with tooltip */}
                                            <td>
                                                <div className={engagementStyles["tooltip-wrapper"]}>
                                                    {data?.talent}
                                                    <div className={engagementStyles["tooltip-content"]}>
                                                        <span>{data?.talentEmail}</span>
                                                        <button className={engagementStyles["tooltip-copy-btn"]} onClick={() => copyToClipboard(data?.talentEmail)} title="Copy email">
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.25 6H3.75C3.55109 6 3.36032 6.07902 3.21967 6.21967C3.07902 6.36032 3 6.55109 3 6.75V20.25C3 20.4489 3.07902 20.6397 3.21967 20.7803C3.36032 20.921 3.55109 21 3.75 21H17.25C17.4489 21 17.6397 20.921 17.7803 20.7803C17.921 20.6397 18 20.4489 18 20.25V6.75C18 6.55109 17.921 6.36032 17.7803 6.21967C17.6397 6.07902 17.4489 6 17.25 6ZM16.5 19.5H4.5V7.5H16.5V19.5ZM21 3.75V17.25C21 17.4489 20.921 17.6397 20.7803 17.7803C20.6397 17.921 20.4489 18 20.25 18C20.0511 18 19.8603 17.921 19.7197 17.7803C19.579 17.6397 19.5 17.4489 19.5 17.25V4.5H6.75C6.55109 4.5 6.36032 4.42098 6.21967 4.28033C6.07902 4.13968 6 3.94891 6 3.75C6 3.55109 6.07902 3.36032 6.21967 3.21967C6.36032 3.07902 6.55109 3 6.75 3H20.25C20.4489 3 20.6397 3.07902 20.7803 3.21967C20.921 3.36032 21 3.55109 21 3.75Z" fill="black" /></svg>
                                                        </button>
                                                        {copiedEmail === data?.talentEmail && <span className={engagementStyles["copied-text"]}>Copied!</span>}
                                                    </div>
                                                </div>
                                            </td>
                                            {/* AM */}
                                            <td><div
                                                className={engagementStyles.amName}
                                                onClick={() => {
                                                    editAMModalcontroler(data.id);
                                                }}
                                            >
                                                {data?.amAssignmentuser}
                                            </div></td>
                                            {/* STATUS */}
                                            <td>{data?.contractStatus}</td>
                                            {/* JOINING DATE */}
                                            <td>{data?.joiningdate}</td>
                                            {/* JOB TITLE */}
                                            <td style={{ whiteSpace: 'normal', maxWidth: '200px' }}>{data?.position}</td>
                                            {/* LWD */}
                                            <td> {data?.lastWorkingDate ? data?.lastWorkingDate : "NA"}
                                                <br />- {data?.contractEndDate}</td>
                                            {/* FEEDBACK STATUS */}
                                            <td>

                                                <div className={engagementStyles["feedback-status-wrapper"]}>
                                                    {data.clientFeedbackstr?.split('->').map((color, i) => (
                                                        <span key={i} className={`${engagementStyles["feedback-dot"]} ${getFeedbackDotClass(color.trim())}`} />
                                                    ))}
                                                </div>

                                            </td>
                                            {/* CLIENT FEEDBACK / LAST FEEDBACK DATE */}
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                                                    <span className={engagementStyles["feedback-action-btn"]}
                                                        style={{
                                                            color: engagementUtils.getClientFeedbackColor(
                                                                data?.feedbackType
                                                            ),

                                                        }}

                                                        onClick={() => {
                                                            if (data?.clientFeedback === 0 && data?.id && data?.hiringId) {
                                                                setHRAndEngagementId({
                                                                    talentName: data?.talent,
                                                                    engagementID: data?.engagemenID,
                                                                    hrNumber: data?.hR_Number,
                                                                    onBoardId: data?.id,
                                                                    hrId: data?.hiringId,
                                                                });
                                                                setEngagementModal({
                                                                    engagementFeedback: false,
                                                                    engagementAddFeedback: true,
                                                                });
                                                            } else {
                                                                setFeedBackData((prev) => ({
                                                                    ...prev,
                                                                    onBoardId: data?.id,
                                                                }));
                                                                setHRAndEngagementId({
                                                                    talentName: data?.talent,
                                                                    engagementID: data?.engagemenID,
                                                                    hrNumber: data?.hR_Number,
                                                                    onBoardId: data?.id,
                                                                    hrId: data?.hiringId,
                                                                });
                                                                setEngagementModal({
                                                                    engagementFeedback: true,
                                                                    engagementAddFeedback: false,
                                                                });
                                                            }
                                                        }}
                                                    >{data?.lastFeedbackDate ? "View/Add" : 'Add'}</span>
                                                    {data?.lastFeedbackDate && <span className={engagementStyles["feedback-date"]}>{data.lastFeedbackDate}</span>}
                                                </div>
                                            </td>
                                            {/* BR/FT */}
                                            <td>{data?.payout_BillRate}</td>
                                            {/* PR */}
                                            <td>{data?.payout_PayRate}</td>
                                            {/* FEE % */}
                                            <td>{data?.nrPercentage}</td>
                                            {/* FEE - with tooltip */}
                                            <td className={engagementStyles["td-fee-sub"]}>
                                                <div className={engagementStyles["tooltip-wrapper"]}>
                                                    {data?.uplersFees}
                                                    {/* <div className={engagementStyles["tooltip-content"]}>
                                                        Exch. Rate - {data?.exchRateFee}
                                                    </div> */}
                                                </div>
                                            </td>
                                            {/* USD */}
                                            <td className={engagementStyles["td-fee-sub"]}>
                                                <div className={engagementStyles["tooltip-wrapper"]}>
                                                    {data?.uplersFees_USD}
                                                    <div className={engagementStyles["tooltip-content"]}>
                                                        Exch. Rate - {data?.payout_CurrencyExchangeRate ?? 'NA'}
                                                    </div>
                                                </div>
                                            </td>
                                            {/* INR - with tooltip */}
                                            <td className={engagementStyles["td-fee-sub"]}>
                                                <div className={engagementStyles["tooltip-wrapper"]}>
                                                    {data?.uplersFees_INR}
                                                    <div className={engagementStyles["tooltip-content"]}>
                                                        Exch. Rate - {data?.payout_Talent_CurrencyExchangeRate ?? 'NA'}
                                                    </div>
                                                </div>
                                            </td>
                                            {/* INVOICE NO. */}
                                            <td>{data?.payout_ESales_InvoiceNumber ?? 'NA'}</td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ===== Pagination Footer ===== */}
                {/* <div className={engagementStyles["table-pagination-footer"]}>
                    <div className={engagementStyles["pagination"]}>
                        <div className={engagementStyles["pagination-right"]}>
                            <div className={engagementStyles["per-page-container"]}>
                                <span>Rows per page:</span>
                                <div className={engagementStyles["select-wrapper"]}>
                                    <select
                                        className={engagementStyles["rows-select"]}
                                        value={pageSize}
                                        onChange={(e) => {
                                            setPageSize(Number(e.target.value));
                                            setPageIndex(1);
                                        }}
                                    >
                                        {pageSizeOptions.map((size) => (
                                            <option key={size} value={size}>{size}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <span className={engagementStyles["pagination-info"]}>
                                {`1-${apiData.length} of ${apiData.length}`}
                            </span>
                            <div className={engagementStyles["pagination-buttons"]}>
                                <PaginationComponent
                                    currentPage={pageIndex}
                                    totalRecords={apiData.length}
                                    pageSize={pageSize}
                                    onPageChange={(p) => setPageIndex(p)}
                                />
                            </div>
                        </div>
                    </div>
                </div> */}

            </div>
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
                        // hrFilterList={allHRConfig.hrFilterListConfig()}
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
                        resetField('feedbackType')
                        setFeedbackTypeEdit('Please Select');
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
                            resetField('feedbackType')
                            setFeedbackTypeEdit('Please Select');
                            reset();
                        }}
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
                        trigger={trigger}
                        unregister={unregister}
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
                        setGst((prev) => ({
                            IGST: false,
                            CGST: false,
                        }));
                    }}
                >
                    <h2 className={engagementStyles.modalTitle}>Create Invoice</h2>

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

                            <div className={engagementStyles.row}>
                                <div className={engagementStyles.colMd6}>
                                    <div
                                        className={engagementStyles.calendarFilterSet}
                                        style={{ alignItems: "start", flexDirection: "column" }}
                                    >
                                        <div className={engagementStyles.label}>Invoice date</div>
                                        <div
                                            className={engagementStyles.calendarFilter}
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
                                                className={engagementStyles.dateFilter}
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

                                <div className={engagementStyles.colMd6}>
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


                            <div className={engagementStyles.row}>
                                <div className={engagementStyles.colMd6}>
                                    <HRSelectField
                                        controlledValue={controlledPaymentTermValue}
                                        setControlledValue={setControlledPaymentTermValue}
                                        isControlled={true}
                                        mode={"id"}
                                        setValue={invoiceSetValue}
                                        register={invoiceRegister}
                                        label={"Payment term"}
                                        defaultValue="Select"
                                        options={invoicePaymentTermMaster}
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
                                </div>
                                {watchInvoice('currency') === "INR" && <div className={engagementStyles.colMd6} style={{ display: 'flex', alignItems: 'center' }}>
                                    <div className={engagementStyles.checkbox}>
                                        <Checkbox
                                            name="IGST"
                                            checked={gst?.IGST}
                                            onChange={(e) => {
                                                setGst((prev) => ({
                                                    IGST: !prev.IGST,
                                                    CGST: false,
                                                }));

                                            }}
                                        >
                                            IGST
                                        </Checkbox>
                                        <Checkbox
                                            name="CGST"
                                            checked={gst?.CGST}
                                            onChange={(e) => {
                                                setGst((prev) => ({
                                                    IGST: false,
                                                    CGST: !prev.CGST,
                                                }));

                                            }}
                                        >
                                            CGST / SGST
                                        </Checkbox>

                                    </div>
                                </div>}
                            </div>


                            {/* <h4>Item & Description : </h4>
                    <div
                      dangerouslySetInnerHTML={{ __html: invData?.lineItem }}
                    ></div> */}

                            <Table
                                id="hrListingTable"
                                columns={lineItemsColumnsMemo}
                                bordered={false}
                                dataSource={lineItems.length ? getLineItemsBasedOnGST(lineItems, gst) : []}
                                pagination={false}
                            />

                            <div style={{ display: 'flex', justifyContent: 'end', padding: '20px 20px 0 0' }}> <h4>Total : {invData?.invoice_CurrencyCode} {(gst.IGST === true || gst.CGST === true) ? invData?.finalTotalWithTax : invData?.finalTotal}</h4> </div>

                            <div
                                className={engagementStyles.formPanelAction}
                                style={{ marginTop: "15px" }}
                            >
                                <button
                                    type="submit"
                                    onClick={invoiceSubmit(saveInvoice)}
                                    className={engagementStyles.btnPrimary}
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
                                        setGst((prev) => ({
                                            IGST: false,
                                            CGST: false,
                                        }));
                                    }}
                                    className={engagementStyles.btnCancle}
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
                    className={engagementStyles.engagementaddtscModal}
                    open={editAMModal}
                    onCancel={() => setEditAMModal(false)}
                >
                    <div>
                        <h2 className={engagementStyles.modalTitle}>Edit AM/NBD</h2>
                        <p>
                            Company Name:{" "}
                            <b className={engagementStyles.hadingTitle}>
                                {AMDetails?.companyName ?? "NA"}
                            </b>{" "}
                            | Client Name:{" "}
                            <b className={engagementStyles.hadingTitle}>
                                {AMDetails?.clientName ?? "NA"}
                            </b>{" "}
                            | Effictive From :{" "}
                            <b className={engagementStyles.hadingTitle}>
                                {moment(startDate).format("MM-YYYY")}
                            </b>
                        </p>
                        <p>
                            EN/HR :{" "}
                            <b className={engagementStyles.hadingTitle}>
                                {AMDetails?.engagementId_HRID}
                            </b>{" "}
                        </p>
                    </div>

                    <>
                        {AMLOADING ? (
                            <Skeleton active />
                        ) : (
                            <>
                                <div className={engagementStyles.row}>
                                    <div className={engagementStyles.colMd6}>
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
                                        className={`${engagementStyles.colMd6}  ${engagementStyles.customSelectAMName}`}
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

                                <div className={engagementStyles.row}>
                                    <div className={engagementStyles.colMd12}>
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

                                </div>

                                <div className={engagementStyles.formPanelAction}>
                                    <button
                                        type="submit"
                                        onClick={AMSubmit(saveEditAM)}
                                        className={engagementStyles.btnPrimary}
                                        disabled={isLoading}
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setEditAMModal(false)}
                                        className={engagementStyles.btnCancle}
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
        </main>
    );
}

export default NewEngagementList;
