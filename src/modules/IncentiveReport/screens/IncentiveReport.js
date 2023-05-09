import IncentiveReportStyle from "./IncentiveReport.module.css";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import { ReactComponent as ArrowDownSVG } from "assets/svg/arrowDown.svg";
import { ReactComponent as FunnelSVG } from "assets/svg/funnel.svg";
import { ReactComponent as SearchSVG } from "assets/svg/search.svg";
import { ReactComponent as LockSVG } from "assets/svg/lock.svg";
import { ReactComponent as UnlockSVG } from "assets/svg/unlock.svg";
import {
  Dropdown,
  Menu,
  message,
  Modal,
  Table,
  Tooltip,
  Select,
  Switch,
  Tree,
} from "antd";
import {
  CarryOutOutlined,
  CheckOutlined,
  FormOutlined,
} from "@ant-design/icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ReportDAO } from "core/report/reportDAO";
import { HTTPStatusCode } from "constants/network";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import { reportConfig } from "modules/report/report.config";
import DemandFunnelModal from "modules/report/components/demandFunnelModal/demandFunnelModal";
import HRSelectField from "modules/hiring request/components/hrSelectField/hrSelectField";
import { IncentiveReportDAO } from "core/IncentiveReport/IncentiveReportDAO";

const DemandFunnelFilterLazyComponent = React.lazy(() =>
  import("modules/report/components/demandFunnelFilter/demandFunnelFilter")
);

const IncentiveReportScreen = () => {
  const [tableFilteredState, setTableFilteredState] = useState({
    startDate: "",
    endDate: "",
    isHiringNeedTemp: "",
    modeOfWork: "",
    typeOfHR: "",
    companyCategory: "",
    replacement: "",
    head: "",
    isActionWise: true,
  });
  const [demandFunnelHRDetailsState, setDemandFunnelHRDetailsState] = useState({
    adhocType: "",
    TeamManagerName: "",
    currentStage: "TR Accepted",
    IsExport: false,
    hrFilter: {
      hR_No: "",
      salesPerson: "",
      compnayName: "",
      role: "",
      managed_Self: "",
      talentName: "",
      availability: "",
    },
    funnelFilter: tableFilteredState,
  });

  const [apiData, setApiData] = useState([]);
  const [viewSummaryData, setSummaryData] = useState([]);
  const [isSummary, setIsSummary] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isSummaryLoading, setSummaryLoading] = useState(false);
  const [filteredTagLength, setFilteredTagLength] = useState(0);
  const [getHTMLFilter, setHTMLFilter] = useState(false);
  const [isAllowFilters, setIsAllowFilters] = useState(false);
  const [filtersList, setFiltersList] = useState([]);
  const [appliedFilter, setAppliedFilters] = useState(new Map());
  const [checkedState, setCheckedState] = useState(new Map());
  const [demandFunnelModal, setDemandFunnelModal] = useState(false);
  const [getUserRole, setUserRole] = useState([]);
  const [getManagerList, setManagerList] = useState([]);
  const [getMonthYearFilter, setMonthYearFilter] = useState([]);
  const [getUserRoleEdit, setUserRoleEdit] = useState([
    { id: 0, value: "Select" },
  ]);
  const [getManagerEdit, setManagerEdit] = useState([
    { id: 0, value: "Select" },
  ]);
  const [getMonthYearEdit, setMonthYearEdit] = useState([
    { id: 0, value: "Select" },
  ]);
  const [getUserRoleValue, setUserRoleValue] = useState("Select");
  const [getManagerValue, setManagerValue] = useState("Select");
  const [getMonthYearValue, setMonthYearValue] = useState("Select");
  const [managerDataInfo, setManagerDataInfo] = useState([]);
  const [incentiveReportInfo, setIncentiveReportInfo] = useState([]);
  const [incentiveBoosterList, setIncentiveBoosterList] = useState([]);

  const [showLine, setShowLine] = useState(true);
  const [showIcon, setShowIcon] = useState(false);
  const [showLeafIcon, setShowLeafIcon] = useState(true);
  const [tableData, setShowTableData] = useState([]);
  const [valueOfSelected, setValueOfSelected] = useState("");
  const [valueOfSelectedUserName, setValueOfSelectedUserName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { TreeNode } = Tree;
  const [gethierarachy, sethierarchy] = useState([]);

  const searchTableData = [
    {
      title: "User(Role)",
      dataIndex: "UserRole",
    },
    {
      title: "Self%",
      dataIndex: "Self",
    },
    {
      title: "Team Target",
      dataIndex: "TeamTarget",
    },
    {
      title: "Self Target",
      dataIndex: "SelfTarget",
    },
    {
      title: "Self Achived Target",
      dataIndex: "SelfAchivedTarget",
    },
  ];

  const incentiveReportBoosterColumn = [
    {
      title: "User",
      dataIndex: "User",
    },
    {
      title: "Company",
      dataIndex: "Company",
    },
    {
      title: "Client",
      dataIndex: "Client",
    },
    {
      title: "Category",
      dataIndex: "Category",
    },
    {
      title: "HR Number",
      dataIndex: "HRNumber",
    },
    {
      title: "Engagement ID",
      dataIndex: "EngagementID",
    },
    {
      title: "Talent Name",
      dataIndex: "TalentName",
    },
    {
      title: "Client Closure Date",
      dataIndex: "ClientClosureDate",
    },
    {
      title: "Contract Duration",
      dataIndex: "ContractDuration",
    },
    {
      title: "BR ($)",
      dataIndex: "BR",
    },
    {
      title: "PR ($)",
      dataIndex: "PR",
    },
    {
      title: "NR Value ($)",
      dataIndex: "NR",
    },
    {
      title: "CB Slab",
      dataIndex: "CBSlab",
    },
    {
      title: "Slab Amt",
      dataIndex: "SlabAmt",
    },
    {
      title: "CB Amt ($)",
      dataIndex: "CBAmt",
    },
    {
      title: "NBD",
      dataIndex: "NBD",
    },
    {
      title: "Lead Type",
      dataIndex: "LeadType",
    },
  ];
  const Condition1 = [
    {
      title: "User",
      dataIndex: "User",
    },
    {
      title: "Company",
      dataIndex: "Company",
    },
    {
      title: "Client",
      dataIndex: "Client",
    },
    {
      title: "Category",
      dataIndex: "Category",
    },
    {
      title: "HR Number",
      dataIndex: "HRNumber",
    },
    {
      title: "Engagement ID",
      dataIndex: "EngagementID",
    },
    {
      title: "Talent Name",
      dataIndex: "TalentName",
    },
    {
      title: "Client Closure Date",
      dataIndex: "ClientClosureDate",
    },
    {
      title: "BR ($)",
      dataIndex: "BR",
    },
    {
      title: "PR ($)",
      dataIndex: "PR",
    },
    {
      title: "NR Value ($)",
      dataIndex: "NR",
    },
    {
      title: "Calc Amt ($)",
      dataIndex: "CalcAmt",
    },
    {
      title: "DP Slab ($)",
      dataIndex: "DPSlab",
    },
    {
      title: "DP Slab Amt ($)",
      dataIndex: "DPSlabAmt",
    },
    {
      title: "NBD",
      dataIndex: "NBD",
    },
    {
      title: "AM",
      dataIndex: "AM",
    },
    {
      title: "DP CalculatedAmt",
      dataIndex: "DPCalculatedAmt",
    },
    {
      title: "Lead Type",
      dataIndex: "LeadType",
    },
    {
      title: "AM NR Slab",
      dataIndex: "AMNRSlab",
    },
    {
      title: "AM NR %",
      dataIndex: "AMNRPercentage",
    },
  ];
  const Condition2 = [
    {
      title: "User",
      dataIndex: "User",
    },
    {
      title: "Company",
      dataIndex: "Company",
    },
    {
      title: "Client",
      dataIndex: "Client",
    },
    {
      title: "Category",
      dataIndex: "Category",
    },
    {
      title: "HR Number",
      dataIndex: "HRNumber",
    },
    {
      title: "Engagement ID",
      dataIndex: "EngagementID",
    },
    {
      title: "Talent Name",
      dataIndex: "TalentName",
    },
    {
      title: "Client Closure Date",
      dataIndex: "ClientClosureDate",
    },
    {
      title: "BR ($)",
      dataIndex: "BR",
    },
    {
      title: "PR ($)",
      dataIndex: "PR",
    },
    {
      title: "NR Value ($)",
      dataIndex: "NR",
    },
    {
      title: "Calc Amt ($)",
      dataIndex: "CalcAmt",
    },
    {
      title: "DP Slab ($)",
      dataIndex: "DPSlab",
    },
    {
      title: "DP Slab Amt ($)",
      dataIndex: "DPSlabAmt",
    },
    {
      title: "NBD",
      dataIndex: "NBD",
    },
    {
      title: "AM",
      dataIndex: "AM",
    },
    {
      title: "DP CalculatedAmt",
      dataIndex: "DPCalculatedAmt",
    },
    {
      title: "Lead Type",
      dataIndex: "LeadType",
    },
    {
      title: "Slab",
      dataIndex: "Slab",
    },
    {
      title: "Slab Amt ($)",
      dataIndex: "SlabAmt",
    },
  ];
  const Condition3 = [
    {
      title: "User",
      dataIndex: "User",
    },
    {
      title: "Company",
      dataIndex: "Company",
    },
    {
      title: "Client",
      dataIndex: "Client",
    },
    {
      title: "Category",
      dataIndex: "Category",
    },
    {
      title: "HR Number",
      dataIndex: "HRNumber",
    },
    {
      title: "Engagement ID",
      dataIndex: "EngagementID",
    },
    {
      title: "Talent Name",
      dataIndex: "TalentName",
    },
    {
      title: "Client Closure Date",
      dataIndex: "ClientClosureDate",
    },
    {
      title: "BR ($)",
      dataIndex: "BR",
    },
    {
      title: "PR ($)",
      dataIndex: "PR",
    },
    {
      title: "NR Value ($)",
      dataIndex: "NR",
    },
    {
      title: "Calc Amt ($)",
      dataIndex: "CalcAmt",
    },
    {
      title: "DP Slab ($)",
      dataIndex: "DPSlab",
    },
    {
      title: "DP Slab Amt ($)",
      dataIndex: "DPSlabAmt",
    },
    {
      title: "NBD",
      dataIndex: "NBD",
    },
    {
      title: "AM",
      dataIndex: "AM",
    },
    {
      title: "DP CalculatedAmt",
      dataIndex: "DPCalculatedAmt",
    },
    {
      title: "Lead Type",
      dataIndex: "LeadType",
    },
  ];
  const Condition4 = [
    {
      title: "User",
      dataIndex: "User",
    },
    {
      title: "Company",
      dataIndex: "Company",
    },
    {
      title: "Client",
      dataIndex: "Client",
    },
    {
      title: "Category",
      dataIndex: "Category",
    },
    {
      title: "HR Number",
      dataIndex: "HRNumber",
    },
    {
      title: "Engagement ID",
      dataIndex: "EngagementID",
    },
    {
      title: "Talent Name",
      dataIndex: "TalentName",
    },
    {
      title: "Client Closure Date",
      dataIndex: "ClientClosureDate",
    },
    {
      title: "BR ($)",
      dataIndex: "BR",
    },
    {
      title: "PR ($)",
      dataIndex: "PR",
    },
    {
      title: "NR Value ($)",
      dataIndex: "NR",
    },
    {
      title: "Calc Amt ($)",
      dataIndex: "CalcAmt",
    },
    {
      title: "DP Slab ($)",
      dataIndex: "DPSlab",
    },
    {
      title: "NBD",
      dataIndex: "NBD",
    },
    {
      title: "AM",
      dataIndex: "AM",
    },
    {
      title: "DP Slab Amt ($)",
      dataIndex: "DPSlabAmt",
    },
    {
      title: "DP CalculatedAmt",
      dataIndex: "DPCalculatedAmt",
    },
    {
      title: "Lead Type",
      dataIndex: "LeadType",
    },
  ];

  const Condition5 = [
    {
      title: "User",
      dataIndex: "User",
    },
    {
      title: "Company",
      dataIndex: "Company",
    },
    {
      title: "Client",
      dataIndex: "Client",
    },
    {
      title: "Category",
      dataIndex: "Category",
    },
    {
      title: "HR Number",
      dataIndex: "HRNumber",
    },
    {
      title: "Engagement ID",
      dataIndex: "EngagementID",
    },
    {
      title: "Talent Name",
      dataIndex: "TalentName",
    },
    {
      title: "Client Closure Date",
      dataIndex: "ClientClosureDate",
    },
    {
      title: "BR ($)",
      dataIndex: "BR",
    },
    {
      title: "PR ($)",
      dataIndex: "PR",
    },
    {
      title: "NR Value ($)",
      dataIndex: "NR",
    },
    {
      title: "Calc Amt ($)",
      dataIndex: "CalcAmt",
    },
    {
      title: "DP Slab ($)",
      dataIndex: "DPSlab",
    },
    {
      title: "DP Slab Amt ($)",
      dataIndex: "DPSlabAmt",
    },
    {
      title: "NBD",
      dataIndex: "NBD",
    },
    {
      title: "AM",
      dataIndex: "AM",
    },
    {
      title: "DP CalculatedAmt",
      dataIndex: "DPCalculatedAmt",
    },
    {
      title: "Lead Type",
      dataIndex: "LeadType",
    },
    {
      title: "IT_Slab",
      dataIndex: "ItSlab",
    },
    {
      title: "IT_SlabAmount",
      dataIndex: "ItSlabAmount",
    },
    {
      title: "IT_CalculatedAmount",
      dataIndex: "ItCalAmount",
    },
  ];

  const Condition6 = [{}];

  const onRowClick = async (record) => {
    setValueOfSelected("");
    let response = await IncentiveReportDAO.getUserListInIncentiveDetailsDAO(
      splitvalue[0],
      record?.id,
      false,
      splitvalue[1]
    );
    let responseBooster =
      await IncentiveReportDAO.getIncentiveReportDetailsContractBoosterDAO(
        splitvalue[0],
        record?.id,
        false,
        splitvalue[1]
      );
    if (response.statusCode === HTTPStatusCode.OK) {
      setIncentiveReportInfo(response.responseBody);
    }
    if (responseBooster.statusCode === HTTPStatusCode.OK) {
      setIncentiveBoosterList(responseBooster.responseBody);
    }
    if (
      response.responseBody[0]?.userRole === "AM" ||
      response.responseBody[0]?.userRole === "AM Head"
    ) {
      setValueOfSelected(response.responseBody[0]?.userRole);
    } else if (
      response.responseBody[0]?.userRole === "POD Manager" ||
      response.responseBody[0]?.userRole === "Sales Consultant" ||
      response.responseBody[0]?.userRole === "BDR Executive" ||
      response.responseBody[0]?.userRole === "BDR Lead" ||
      response.responseBody[0]?.userRole === "BDR Head" ||
      response.responseBody[0]?.userRole === "Marketing Team" ||
      response.responseBody[0]?.userRole === "Marketing Lead" ||
      response.responseBody[0]?.userRole === "Marketing Head"
    ) {
      setValueOfSelected(response.responseBody[0]?.userRole);
    }
    if (response.responseBody[0]?.userName.split("\n")?.[1] === "(AM)") {
      setValueOfSelectedUserName(
        response.responseBody[0]?.userName?.split("\n")?.[1]
      );
    } else if (
      response.responseBody[0]?.userName.split("\n")?.[1] === "(NBD)"
    ) {
      setValueOfSelectedUserName(
        response.responseBody[0]?.userName?.split("\n")?.[1]
      );
    }
    if (
      response.responseBody[0]?.userRole === "POD Manager" ||
      response.responseBody[0]?.userRole === "Sales Consultant"
    ) {
      setValueOfSelected(response.responseBody[0]?.userRole);
    }
  };

  const data = tableData?.map((data) => ({
    id: data?.userId,
    UserRole: data?.userName,
    Self: data?.selfPercentage,
    TeamTarget: data?.teamtarget,
    SelfTarget: data?.selftarget,
    SelfAchivedTarget: data?.selfAchivedTarget,
  }));

  const incentiveInfoList = incentiveReportInfo?.map((data) => ({
    User: data?.userName,
    Company: data?.company,
    Client: data?.clientName,
    Category: data?.companyCategory,
    HRNumber: data?.hR_Number,
    EngagementID: data?.engagemenID,
    TalentName: data?.talentName,
    ClientClosureDate: data?.clientClosureDate,
    BR: data?.br,
    PR: data?.pr,
    NR: data?.nrValue,
    AMNRSlab: data?.aM_NR_Slab,
    AMNRPercentage: data?.aM_NR_Percentage,
    CalcAmt: data?.amount,
    NBD: data?.nbdSalesPerson,
    DPSlab: data?.dP_Slab,
    DPSlabAmt: data?.dP_SlabAmount,
    DPCalculatedAmt: data?.dP_CalculatedAmount,
    LeadType: data?.leadType,
    Slab: data?.aM_NR_Slab,
    SlabAmt: data?.aM_NR_Percentage,
    AM: data?.amSalesPerson,
    ItSlab: data?.IT_Slab,
    ItSlabAmount: data?.IT_SlabAmount,
    ItCalAmount: data?.IT_CalculatedAmount,
  }));
  const incentiveBooster = incentiveBoosterList?.map((data) => ({
    User: data?.userName,
    Company: data?.company,
    Client: data?.clientName,
    Category: data?.companyCategory,
    HRNumber: data?.hR_Number,
    EngagementID: data?.engagemenID,
    TalentName: data?.talentName,
    ClientClosureDate: data?.clientClosureDate,
    BR: data?.br,
    PR: data?.pr,
    NR: data?.nrValue,
    CBSlab: data?.cB_Slab,
    SlabAmt: data?.cB_SlabAmount,
    CBAmt: data?.cB_CalculatedAmount,
    NBD: data?.nbdSalesPerson,
    LeadType: data?.leadType,
  }));
  const treeData = [
    {
      title: "parent 1",
      key: "0-0",
      icon: <CarryOutOutlined />,
      children: [
        {
          title: "parent 1-0",
          key: "0-0-0",
          icon: <CarryOutOutlined />,
          children: [
            {
              title: "leaf",
              key: "0-0-0-0",
              icon: <CarryOutOutlined />,
            },
            {
              title: (
                <>
                  <div>multiple line title</div>
                  <div>multiple line title</div>
                </>
              ),
              key: "0-0-0-1",
              icon: <CarryOutOutlined />,
            },
            {
              title: "leaf",
              key: "0-0-0-2",
              icon: <CarryOutOutlined />,
            },
          ],
        },
        {
          title: "parent 1-1",
          key: "0-0-1",
          icon: <CarryOutOutlined />,
          children: [
            {
              title: "leaf",
              key: "0-0-1-0",
              icon: <CarryOutOutlined />,
            },
          ],
        },
        {
          title: "parent 1-2",
          key: "0-0-2",
          icon: <CarryOutOutlined />,
          children: [
            {
              title: "leaf",
              key: "0-0-2-0",
              icon: <CarryOutOutlined />,
            },
            {
              title: "leaf",
              key: "0-0-2-1",
              icon: <CarryOutOutlined />,
              switcherIcon: <FormOutlined />,
            },
          ],
        },
      ],
    },
  ];

  const {
    register,
    handleSubmit,
    setValue,
    control,
    setError,
    unregister,
    getValues,
    watch,
    resetField,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  const watchValueUserRoles = watch("userRoleValue");
  const watchManagerId = watch("manager");
  const watchDate = watch("MonthYearFilter");
  let splitvalue = watchDate?.id?.split("#");

  const onRemoveFilters = () => {
    setTimeout(() => {
      setIsAllowFilters(false);
    }, 300);
    setHTMLFilter(false);
  };
  const getDemandFunnelListingHandler = useCallback(async () => {
    setLoading(true);
    let response = await ReportDAO.demandFunnelListingRequestDAO(
      tableFilteredState
    );
    if (response?.statusCode === HTTPStatusCode.OK) {
      setLoading(false);
      setApiData(response?.responseBody);
    } else {
      setLoading(false);
      setApiData([]);
    }
  }, [tableFilteredState]);

  const viewDemandFunnelSummaryHandler = useCallback(async () => {
    setIsSummary(true);
    setSummaryLoading(true);
    let response = await ReportDAO.demandFunnelSummaryRequestDAO(
      tableFilteredState
    );
    if (response?.statusCode === HTTPStatusCode.OK) {
      setSummaryData(response?.responseBody);
      setSummaryLoading(false);
    } else {
      setSummaryData([]);
      setSummaryLoading(false);
    }
  }, [tableFilteredState]);

  const tablesearchTableDataMemo = useMemo(
    () =>
      reportConfig.demandFunnelTable(
        apiData && apiData,
        demandFunnelModal,
        setDemandFunnelModal,
        setDemandFunnelHRDetailsState,
        demandFunnelHRDetailsState
      ),
    [apiData, demandFunnelHRDetailsState, demandFunnelModal]
  );

  const viewSummaryMemo = useMemo(
    () =>
      reportConfig.viewSummaryDemandFunnel(viewSummaryData && viewSummaryData),
    [viewSummaryData]
  );
  const getReportFilterHandler = useCallback(async () => {
    const response = await ReportDAO.demandFunnelFiltersRequestDAO();
    if (response?.statusCode === HTTPStatusCode.OK) {
      setFiltersList(response && response?.responseBody?.Data);
    } else {
      setFiltersList([]);
    }
  }, []);

  const toggleDemandReportFilter = useCallback(() => {
    getReportFilterHandler();
    !getHTMLFilter
      ? setIsAllowFilters(!isAllowFilters)
      : setTimeout(() => {
          setIsAllowFilters(!isAllowFilters);
        }, 300);
    setHTMLFilter(!getHTMLFilter);
  }, [getHTMLFilter, getReportFilterHandler, isAllowFilters]);
  useEffect(() => {
    getDemandFunnelListingHandler();
  }, [getDemandFunnelListingHandler]);

  // Incentive Report API
  const getIncentiveUserRole = async () => {
    const response = await IncentiveReportDAO.getUserRoleDAO();
    if (response.statusCode === HTTPStatusCode.OK) {
      setUserRole(response?.responseBody?.salesUserRoleDDL);
      setManagerList(response?.responseBody?.salesUserDDL);
    }
  };

  const getMonthYearFilters = async () => {
    const response = await IncentiveReportDAO.getMonthYearFilterDAO();
    if (response.statusCode === HTTPStatusCode.OK) {
      setMonthYearFilter(response?.responseBody?.MonthYear);
    }
  };

  const getSalesUserBasedOnUserRole = async () => {
    const response = await IncentiveReportDAO.getSalesUsersBasedOnUserRoleDAO(
      watchValueUserRoles?.id
    );
    const managerData = response?.responseBody?.map((item) => ({
      id: item?.value,
      value: item?.text,
    }));
    setManagerDataInfo(managerData);
  };

  const getUserHierarchy = async () => {
    const response = await IncentiveReportDAO.getUserHierarchyDAO(
      watchManagerId?.id
    );
    if (response.statusCode === HTTPStatusCode.OK) {
      sethierarchy(response?.responseBody);
    } else {
      sethierarchy([]);
    }
  };

  const getList = async () => {
    if (splitvalue || splitvalue === undefined) {
      const response = await IncentiveReportDAO?.getUserListInIncentiveDAO(
        splitvalue[0],
        splitvalue[1],
        watchManagerId?.id
      );

      if (response.statusCode === HTTPStatusCode.OK) {
        setShowTableData(response?.responseBody);
      }
      if (response.statusCode === HTTPStatusCode.NOT_FOUND) {
        setErrorMessage("No Data Found");
        setShowTableData([]);
        setIncentiveBoosterList([]);
        setIncentiveReportInfo([]);
      }
    }
  };

  useEffect(() => {
    const updatedUserRole = getUserRole.map((item) => ({
      id: item?.value,
      value: item?.text,
    }));
    setUserRoleEdit([...getUserRoleEdit, ...updatedUserRole]);
  }, [getUserRole]);

  useEffect(() => {
    const updatedManagerList = getManagerList.map((item) => ({
      id: item?.value,
      value: item?.text,
    }));
    setManagerEdit(updatedManagerList);
  }, [getManagerList]);

  useEffect(() => {
    const updatedMonthYear = getMonthYearFilter.map((item) => ({
      id: item?.value,
      value: item?.text,
    }));
    setMonthYearEdit([...getMonthYearEdit, ...updatedMonthYear]);
  }, [getMonthYearFilter]);

  useEffect(() => {
    getIncentiveUserRole();
    getMonthYearFilters();
  }, []);

  useEffect(() => {
    getSalesUserBasedOnUserRole();
    if (watchManagerId) {
      getUserHierarchy();
    }
  }, [watchValueUserRoles, watchManagerId]);

  const resetButton = useCallback(() => {
    resetField("userRoleValue");
    setUserRoleValue("Select");
    resetField("manager");
    setManagerValue("Select");
    resetField("MonthYearFilter");
    setMonthYearValue("Select");
    setShowTableData([]);
    setIncentiveBoosterList([]);
    setIncentiveReportInfo([]);
    sethierarchy([]);
  }, [resetField]);

  const [childHirerarchy, setChildHirerarchy] = useState([]);
  const onSelect = async (selectedKeys, info) => {
    const response = await IncentiveReportDAO.getUserHierarchyDAO(
      selectedKeys?.[0]
    );
    setChildHirerarchy(response.responseBody);
    const data = gethierarachy;
    response.responseBody?.forEach((detail) => {
      insertUser(detail.undeR_PARENT, { ...detail }, data);
    });
    sethierarchy(data);
    function insertUser(userID, userData, data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].userID === userID) {
          if (data[i]?.children) {
            data[i].children.push(userData);
          } else {
            data[i].children = [userData];
          }
          return;
        } else if (data[i].children?.length > 0) {
          insertUser(userID, userData, data[i]?.children);
        }
      }
    }
  };

  function generateTreeData(gethierarachy) {
    return gethierarachy.map(item => {
      if (item.children && item.children.length > 0) {
        return {
          title: item.child,
          key: item.userID,
          children: generateTreeData(item.children),
        };
      } else {
        return {
          title: item.child,
          key: item.userID,
        };
      }
    });
  }

  const treedata = generateTreeData(gethierarachy)

  return (
    <div className={IncentiveReportStyle.hiringRequestContainer}>
      <div className={IncentiveReportStyle.addnewHR}>
        <div className={IncentiveReportStyle.hiringRequest}>
          Incentive Reports
        </div>
      </div>
      {/*
       * --------- Filter Component Starts ---------
       * @Filter Part
       */}
      <div className={IncentiveReportStyle.filterContainer}>
      </div>

      <div className={IncentiveReportStyle.row}>
        <div className={IncentiveReportStyle.colMd4}>
          <HRSelectField
            setControlledValue={setUserRoleValue}
            controlledValue={getUserRoleValue}
            isControlled={true}
            setValue={setValue}
            register={register}
            name="userRoleValue"
            mode={"id/value"}
            options={getUserRoleEdit}
            label="User Role"
            required
            isError={errors["userRoleValue"] && errors["userRoleValue"]}
            errorMsg="Please select a User Role."
          />
        </div>
        <div className={IncentiveReportStyle.colMd4}>
          <HRSelectField
            controlledValue={getManagerValue}
            setControlledValue={setManagerValue}
            isControlled={true}
            setValue={setValue}
            register={register}
            name="manager"
            mode={"id/value"}
            options={
              watchValueUserRoles === undefined
                ? getManagerEdit
                : managerDataInfo
            }
            label="Manager"
            required
            isError={errors["manager"] && errors["manager"]}
            errorMsg="Please select a Manager."
            // onClick={getUserHierarchy}
          />
        </div>
        <div className={IncentiveReportStyle.colMd4}>
          <HRSelectField
            setControlledValue={setMonthYearValue}
            controlledValue={getMonthYearValue}
            isControlled={true}
            setValue={setValue}
            register={register}
            name="MonthYearFilter"
            mode={"id/value"}
            options={getMonthYearEdit}
            required
            label="Month Year"
            isError={errors["MonthYearFilter"] && errors["MonthYearFilter"]}
            errorMsg="Please select a month."
          />
        </div>
      </div>

      <button onClick={getList}>Search</button>
      <button onClick={resetButton}>Reset</button>
      {/*
       * ------------ Table Starts-----------
       * @Table Part
       */}
      {gethierarachy?.length === 0 && <h1>No data found</h1>}
      {gethierarachy?.length !== 0 && (
        <div className={IncentiveReportStyle.tree_custom}>
          <div>
            <Tree
              showLine={showLine ? { showLeafIcon } : false}
              showIcon={showIcon}
              defaultExpandedKeys={['0-0-0']}
              onSelect={onSelect}
              treeData={treedata}
            >
             </Tree>
          </div>
        </div>
      )}
      {tableData?.length !== 0 ? (
        <Table
          columns={searchTableData}
          dataSource={data}
          size="small"
          onRow={(record, rowIndex) => {
            return {
              onClick: () => {
                onRowClick(record, rowIndex);
              },
            };
          }}
        />
      ) : (
        <h1>{errorMessage}</h1>
      )}

      {incentiveReportInfo.length !== 0 &&
        (incentiveReportInfo[0]?.userRole === "AM" ||
        incentiveReportInfo[0]?.userRole === "AM Head" ? (
          <>
            <div className={IncentiveReportStyle.hiringRequest}>AM Target</div>
            <Table
              columns={
                valueOfSelected === "AM Head" || valueOfSelected === "AM"
                  ? Condition1
                  : valueOfSelected === "POD Manager" ||
                    valueOfSelected === "Sales Consultant" ||
                    valueOfSelected === "BDR Executive" ||
                    valueOfSelected === "BDR Lead" ||
                    valueOfSelected === "BDR Head" ||
                    valueOfSelected === "Marketing Team" ||
                    valueOfSelected === "Marketing Lead" ||
                    valueOfSelected === "Marketing Head"
                  ? Condition2
                  : valueOfSelected === "BDR Executive" ||
                    valueOfSelected === "BDR Lead"
                  ? Condition2
                  : valueOfSelectedUserName === "(AM)"
                  ? Condition3
                  : valueOfSelectedUserName === "(NBD)"
                  ? Condition4
                  : valueOfSelected === "POD Manager" ||
                    valueOfSelected === "Sales Consultant"
                  ? Condition5
                  : Condition6
              }
              dataSource={incentiveInfoList}
              size="
            small"
            />
          </>
        ) : (
          <>
            <div className={IncentiveReportStyle.hiringRequest}>
              Based Fixed
            </div>
            <Table
              columns={
                valueOfSelected === "AM Head" || valueOfSelected === "AM"
                  ? Condition1
                  : valueOfSelected === "POD Manager" ||
                    valueOfSelected === "Sales Consultant" ||
                    valueOfSelected === "BDR Executive" ||
                    valueOfSelected === "BDR Lead" ||
                    valueOfSelected === "BDR Head" ||
                    valueOfSelected === "Marketing Team" ||
                    valueOfSelected === "Marketing Lead" ||
                    valueOfSelected === "Marketing Head"
                  ? Condition2
                  : valueOfSelected === "BDR Executive" ||
                    valueOfSelected === "BDR Lead"
                  ? Condition2
                  : valueOfSelectedUserName === "(AM)"
                  ? Condition3
                  : valueOfSelectedUserName === "(NBD)"
                  ? Condition4
                  : valueOfSelected === "POD Manager" ||
                    valueOfSelected === "Sales Consultant"
                  ? Condition5
                  : Condition6
              }
              dataSource={incentiveInfoList}
              size="
    small"
            />
          </>
        ))}
      {incentiveBoosterList.length !== 0 && (
        <>
          <div className={IncentiveReportStyle.hiringRequest}>
            Contract Booster
          </div>
          <Table
            columns={incentiveReportBoosterColumn}
            dataSource={incentiveBooster}
            size="small"
          />
        </>
      )}

      {isAllowFilters && (
        <Suspense fallback={<div>Loading...</div>}>
          <DemandFunnelFilterLazyComponent
            setAppliedFilters={setAppliedFilters}
            appliedFilter={appliedFilter}
            setCheckedState={setCheckedState}
            checkedState={checkedState}
            handleHRRequest={getDemandFunnelListingHandler}
            setTableFilteredState={setTableFilteredState}
            tableFilteredState={tableFilteredState}
            setFilteredTagLength={setFilteredTagLength}
            onRemoveHRFilters={onRemoveFilters}
            getHTMLFilter={getHTMLFilter}
            hrFilterList={reportConfig.demandReportFilterListConfig()}
            filtersType={reportConfig.demandReportFilterTypeConfig(
              filtersList && filtersList
            )}
          />
        </Suspense>
      )}
      {demandFunnelModal && (
        <DemandFunnelModal
          demandFunnelModal={demandFunnelModal}
          setDemandFunnelModal={setDemandFunnelModal}
          demandFunnelHRDetailsState={demandFunnelHRDetailsState}
          setDemandFunnelHRDetailsState={setDemandFunnelHRDetailsState}
        />
      )}
    </div>
  );
};

export default IncentiveReportScreen;
