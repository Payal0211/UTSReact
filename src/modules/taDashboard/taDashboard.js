import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  Suspense,
} from "react";
import taStyles from "./tadashboard.module.css";
import {
  Tabs,
  Select,
  Table,
  Modal,
  Tooltip,
  InputNumber,
  AutoComplete,
  message,
  Skeleton,
} from "antd";
import { EmailRegEx, InputType } from "constants/application";
import UTSRoutes from "constants/routes";
import { ReactComponent as SearchSVG } from "assets/svg/search.svg";
import { ReactComponent as CloseSVG } from "assets/svg/close.svg";
import { TaDashboardDAO } from "core/taDashboard/taDashboardDRO";
import { ReactComponent as FunnelSVG } from "assets/svg/funnel.svg";
import { HTTPStatusCode } from "constants/network";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import OnboardFilerList from "modules/onBoardList/OnboardFilterList";
import { allHRConfig } from "modules/hiring request/screens/allHiringRequest/allHR.config";
import { allEngagementConfig } from "modules/engagement/screens/engagementList/allEngagementConfig";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import _, { filter } from "lodash";
import { IoMdAddCircle } from "react-icons/io";
import { IconContext } from "react-icons";
const { Option } = Select;

export default function TADashboard() {
  const navigate = useNavigate();
  const [filteredInfo, setFilteredInfo] = useState({});
  const [selectedHead, setSelectedHead] = useState("");
  const [headList, setHeadList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [debounceSearchText, setDebouncedSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filtersList, setFiltersList] = useState({});
  const [filteredTagLength, setFilteredTagLength] = useState(0);
  const [getHTMLFilter, setHTMLFilter] = useState(false);
  const [isAllowFilters, setIsAllowFilters] = useState(false);
  const [appliedFilter, setAppliedFilters] = useState(new Map());
  const [checkedState, setCheckedState] = useState(new Map());
  const [TaListData, setTaListData] = useState([]);

  const [isAddNewRow, setIsAddNewRow] = useState(false);

  const [tableFilteredState, setTableFilteredState] = useState({
    filterFields_OnBoard: {
      taUserIDs: null,
      roleTypeIDs: null,
      hrStatusIDs: null,
      taskStatusIDs: null,
      modelType: null,
      priority: null,
      searchText: "",
    },
  });

  const [newTAUservalue, setNewTAUserValue] = useState("");
  const [getCompanyNameSuggestion, setCompanyNameSuggestion] = useState([]);
  const [hrListSuggestion, setHRListSuggestion] = useState([]);
  const [companyautoCompleteValue, setCompanyAutoCompleteValue] = useState("");
  const [newTAHRvalue, setNewTAHRValue] = useState("");
  const [newTRAllData, setTRAllData] = useState({});
  const [selectedCompanyID, setselectedCompanyID] = useState("");
  const [newTaskError, setNewTaskError] = useState(false);
  const [isAddingNewTask, setAddingNewTask] = useState(false);

  const [showTalentProfiles, setShowTalentProfiles] = useState(false);
  const [loadingTalentProfile, setLoadingTalentProfile] = useState(false);
  const [hrTalentList, setHRTalentList] = useState([]);

  // const groupedData = groupByRowSpan(rawData, 'ta');

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

  useEffect(() => {
    setTimeout(() => setSearchText(debounceSearchText), 2000);
  }, [debounceSearchText]);

  const updateTARowValue = async (value, key, params, index) => {
    let pl = {
      tA_UserID: params.tA_UserID,
      company_ID: params.company_ID,
      hiringRequest_ID: params.hiringRequest_ID,
      task_Priority: params.task_Priority,
      no_of_InterviewRounds: params.no_of_InterviewRounds,
      role_TypeID: params.role_TypeID,
      task_StatusID: params.task_StatusID,
      activeTR: params.activeTR,
      talent_AnnualCTC_Budget_INRValue: params.talent_AnnualCTC_Budget_INRValue,
      modelType: params.modelType,
      tA_HR_StatusID: params.tA_HR_StatusID,
      tA_Head_UserID: `${selectedHead}`,
    };
    // for new
    // {
    //   "tA_UserID": 0,
    // //   "tA_Head_UserID": 0,
    //   "company_ID": 0,
    //   "hiringRequest_ID": 0,
    //   "activeTR": 0,
    //   "talent_AnnualCTC_Budget_INRValue": 0,
    //   "revenue_On10PerCTC": 0,
    //   "totalRevenue_NoofTalent": 0,
    //   "modelType": "string",
    //   "noOfProfile_TalentsTillDate": 0 ,
    //    "tA_HR_StatusID": 2
    // }

    if (key === "role_TypeID") {
      pl[key] = value?.id;
      setTaListData((prev) => {
        let newDS = [...prev];
        newDS[index] = {
          ...newDS[index],
          [key]: value?.id,
          role_Type: value?.data,
        };
        return newDS;
      });
    } else if (key === "task_StatusID") {
      pl[key] = value?.id;
      setTaListData((prev) => {
        let newDS = [...prev];
        newDS[index] = {
          ...newDS[index],
          [key]: value?.id,
          taskStatus: value?.data,
        };
        return newDS;
      });
    } else if (key === "tA_HR_StatusID") {
      pl[key] = value?.id;
      setTaListData((prev) => {
        let newDS = [...prev];
        newDS[index] = {
          ...newDS[index],
          [key]: value?.id,
          tA_HR_Status: value?.data,
        };
        return newDS;
      });
    } else {
      pl[key] = value;
      setTaListData((prev) => {
        let newDS = [...prev];
        newDS[index] = { ...newDS[index], [key]: value };
        return newDS;
      });
    }
    let updateresult = await TaDashboardDAO.updateTAListRequestDAO(pl);
  };

  const ContractDPComp = ({ text, result, index }) => {
    const [value, setValue] = useState(text ?? "");
    return (
      <div className={taStyles.tableSelectField}>
        <Select
          defaultValue={value}
          onChange={(val) => {
            setValue(val);
            updateTARowValue(val, "modelType", result, index);
          }}
        >
          {filtersList?.ModelType?.map((v) => (
            <Option value={v.text}>{v.text}</Option>
          ))}
        </Select>
      </div>
    );
  };

  const HRStatusComp = ({ text, result, index }) => {
    const [value, setValue] = useState(text ?? "");
    const colorCode =
      filtersList?.HRStatus?.find((v) => v.data === value)?.colorCode ?? "";
    return (
      <div className={taStyles.tableSelectField}>
        {" "}
        <Select
          defaultValue={value}
          style={{ color: colorCode }}
          onChange={(val) => {
            setValue(val);
            let valobj = filtersList?.HRStatus?.find((i) => i.data === val);
            updateTARowValue(valobj, "tA_HR_StatusID", result, index);
          }}
        >
          {filtersList?.HRStatus?.map((v) => (
            <Option style={{ color: v.colorCode }} value={v.data}>
              {v.data}
            </Option>
          ))}
        </Select>
      </div>
    );
  };
  const InboundOutboundComp = ({ text, result, index }) => {
    const [value, setValue] = useState(text ?? "");
    const colorCode =
      filtersList?.RoleTypes?.find((v) => v.data === value)?.colorCode ?? "";
    return (
      <div className={taStyles.tableSelectField}>
        <Select
          defaultValue={value}
          style={{ color: colorCode }}
          onChange={(val) => {
            setValue(val);
            let valobj = filtersList?.RoleTypes?.find((i) => i.data === val);
            updateTARowValue(valobj, "role_TypeID", result, index);
          }}
        >
          {filtersList?.RoleTypes?.map((v) => (
            <Option style={{ color: v.colorCode }} value={v.data}>
              {v.data}
            </Option>
          ))}
        </Select>
      </div>
    );
  };

  const TaskStatusComp = ({ text, result, index }) => {
    const [value, setValue] = useState(text ?? "");
    const colorCode =
      filtersList?.TaskStatus?.find((v) => v.data === value)?.colorCode ?? "";
    return (
      <div className={taStyles.tableSelectField}>
        <Select
          defaultValue={value}
          style={{ color: colorCode }}
          onChange={(val) => {
            setValue(val);
            let valobj = filtersList?.TaskStatus?.find((i) => i.data === val);
            updateTARowValue(valobj, "task_StatusID", result, index);
          }}
        >
          {filtersList?.TaskStatus?.map((v) => (
            <Option style={{ color: v.colorCode }} value={v.data}>
              {v.data}
            </Option>
          ))}
        </Select>
      </div>
    );
  };

  const PriorityComp = ({ text, result, index }) => {
    const [value, setValue] = useState(text ?? "");

    return (
      <div className={taStyles.tableSelectField}>
        <Select
          defaultValue={value}
          onChange={(val) => {
            setValue(val);
            updateTARowValue(val, "task_Priority", result, index);
          }}
        >
          {filtersList?.priority?.map((v) => (
            <Option value={v.text}>{v.text}</Option>
          ))}
        </Select>
      </div>
    );
  };

  const InterviewRoundComp = ({ text, result, index }) => {
    const [value, setValue] = useState(text ?? "");

    return (
      <InputNumber
        value={value}
        onChange={(v) => {
          setValue(v);
        }}
        onBlur={() =>
          updateTARowValue(value, "no_of_InterviewRounds", result, index)
        }
      />
    );
  };

  const handleTableFilterChange = (pagination, filters, sorter) => {
    console.log("Various parameters", pagination, filters, sorter);
    setFilteredInfo(filters);

    // setSortedInfo(sorter );
  };

  const getCompanySuggestionHandler = async (searchtext) => {
    const payload = {
      taUserID: newTAUservalue,
      companySearchText: searchtext,
    };
    let response = await TaDashboardDAO.getTACompanyListDAO(payload);
    if (response?.statusCode === HTTPStatusCode.OK) {
      setCompanyNameSuggestion(
        response?.responseBody?.map((item) => ({
          ...item,
          value: item.company,
          id: item.id,
        }))
      );
    } else if (
      response?.statusCode === HTTPStatusCode.BAD_REQUEST ||
      response?.statusCode === HTTPStatusCode.NOT_FOUND
    ) {
      setCompanyNameSuggestion([]);
    }
  };

  const getHRLISTForComapny = async (id) => {
    const pl = {
      companyID: id,
    };
    let response = await TaDashboardDAO.getHRlistFromCompanyDAO(pl);
    if (response?.statusCode === HTTPStatusCode.OK) {
      setHRListSuggestion(
        response?.responseBody?.map((item) => ({
          ...item,
          value: item.hrNumber,
          id: item.hrid,
        }))
      );
    } else if (
      response?.statusCode === HTTPStatusCode.BAD_REQUEST ||
      response?.statusCode === HTTPStatusCode.NOT_FOUND
    ) {
      setHRListSuggestion([]);
    }
  };

  const getTalentProfilesDetails = async (ID) => {
    setShowTalentProfiles(true);
    setLoadingTalentProfile(true);
    const hrResult = await TaDashboardDAO.getHRTalentDetailsRequestDAO(ID);
    setLoadingTalentProfile(false);
    if (hrResult.statusCode === HTTPStatusCode.OK) {
      setHRTalentList(hrResult.responseBody);
    } else {
      setHRTalentList([]);
    }
  };

  const ProfileColumns = [
    {
      title: "Submission Date",
      dataIndex: "profileSubmittedDate",
      key: "profileSubmittedDate",
    },
    {
      title: "Submission By",
      dataIndex: "profileSubmittedBy",
      key: "profileSubmittedBy",
    },
    {
      title: "Talent Name",
      dataIndex: "talent",
      key: "talent",
    },
    {
      title: "status",
      dataIndex: "talentStatus",
      key: "talentStatus",
    },
    {
      title: "Detail",
      dataIndex: "talentStatusDetail",
      key: "talentStatusDetail",
    },
  ];

  const columns = [
    {
      title: "TA",
      dataIndex: "taName",
      fixed: "left",
      width: "100px",
      render: (value, row, index) => {
        return {
          children: (
            <div style={{ verticalAlign: "top" }}>
              {value}
              <br />{" "}
              <IconContext.Provider
                value={{
                  color: "green",
                  style: {
                    width: "30px",
                    height: "30px",
                    marginTop: "5px",
                    cursor: "pointer",
                  },
                }}
              >
                {" "}
                <Tooltip title={`Add task for ${value}`} placement="top">
                  <span
                    onClick={() => {
                      setIsAddNewRow(true);
                      setNewTAUserValue(row.tA_UserID);
                    }}
                    className={taStyles.feedbackLabel}
                  >
                    {" "}
                    <IoMdAddCircle />
                  </span>{" "}
                </Tooltip>
              </IconContext.Provider>
            </div>
          ),
          props: {
            rowSpan: row.rowSpan,
            style: { verticalAlign: "top" }, // This aligns the merged cell content to the top
          },
        };
      },
    },
    {
      title: "Company",
      dataIndex: "companyName",
      key: "companyName",
      fixed: "left",
      width: "120px",
      render: (text) => <a>{text}</a>,
    },
    // {
    //   title: 'HR ID',
    //   dataIndex: 'hrNumber',
    //   key: 'hrNumber',
    //   width:'120px',
    //   fixed: "left",
    // },
    {
      title: (
        <>
          HR Title <br /> ( HR ID )
        </>
      ),
      dataIndex: "hrTitle",
      key: "hrTitle",
      width: "120px",
      fixed: "left",
      render: (text, result) => {
        return `${text} (${result.hrNumber}) `;
      },
    },
    {
      title: "Priority",
      dataIndex: "task_Priority",
      key: "task_Priority",
      fixed: "left",
      width: "120px",
      // filters:filtersList?.priority?.map(v=>({text: v.text, value: v.text})),
      render: (text, result, index) => {
        return <PriorityComp text={text} result={result} index={index} />;
      },
    },

    {
      title: "Status",
      dataIndex: "taskStatus",
      key: "taskStatus",
      fixed: "left",
      render: (text, result, index) => {
        return <TaskStatusComp text={text} result={result} index={index} />;
      },
    },
    {
      title: "Active TRs",
      dataIndex: "activeTR",
      key: "activeTR",
    },

    {
      title: (
        <>
          Talent Annual <br /> CTC Budget (INR)
        </>
      ),
      dataIndex: "talent_AnnualCTC_Budget_INRValue",
      key: "talent_AnnualCTC_Budget_INRValue",
    },
    {
      title: (
        <>
          Revenue Opportunity <br />
          (10% on annual CTC)
        </>
      ),
      dataIndex: "revenue_On10PerCTC",
      key: "revenue_On10PerCTC",
      // render: (value) => `₹${value.toLocaleString()}`
    },

    {
      title: (
        <>
          Total Revenue Opportunity <br />
          (NO. of TR x Talent <br /> Annual CTC budget)
        </>
      ),
      dataIndex: "totalRevenue_NoofTalent",
      key: "totalRevenue_NoofTalent",
      // render: (value) => `₹${value.toLocaleString()}`
    },
    {
      title: (
        <>
          No. of Active
          <br />
          /Submitted Profiles <br /> till Date
        </>
      ),
      dataIndex: "noOfProfile_TalentsTillDate",
      key: "noOfProfile_TalentsTillDate",
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
              getTalentProfilesDetails(result?.hiringRequest_ID);
            }}
          >
            {text}
          </p>
        ) : (
          text
        );
      },
    },
    {
      title: (
        <>
          Inbound <br />/ Outbound
        </>
      ),
      dataIndex: "role_Type",
      key: "role_Type",
      // fixed: "left",
      render: (text, result, index) => {
        return (
          <InboundOutboundComp text={text} result={result} index={index} />
        );
      },
    },
    {
      title: (
        <>
          #Interview <br />
          Rounds
        </>
      ),
      dataIndex: "no_of_InterviewRounds",
      key: "no_of_InterviewRounds",
      // fixed: "left",
      width: "100px",
      render: (text, result, index) => {
        return <InterviewRoundComp text={text} result={result} index={index} />;
      },
    },

    {
      title: "Contract / DP",
      dataIndex: "modelType",
      key: "modelType",
      // filters:filtersList?.ModelType?.map(v=>({text: v.text, value: v.text})),
      // filteredValue: filteredInfo.modelType || null,
      // onFilter: (value, record) => {
      //   console.log('filter',value,record)
      //    return record.modelType === value
      // },
      render: (text, result, index) => {
        return <ContractDPComp text={text} result={result} index={index} />;
      },
    },
    {
      title: "HR Status",
      dataIndex: "tA_HR_Status",
      key: "tA_HR_Status",
      render: (text, result, index) => {
        return <HRStatusComp text={text} result={result} index={index} />;
      },
    },
    {
      title: "Sales",
      dataIndex: "salesName",
      key: "salesName",
    },
    {
      title: "HR Created Date",
      dataIndex: "hrCreatedDate",
      key: "hrCreatedDate",
      render: (text) => {
        return moment(text).format("DD-MMM-YYYY");
      },
    },
    {
      title: (
        <>
          Open Since <br />
          {">"} 1 Month (Yes/no)
        </>
      ),
      dataIndex: "hrOpenSinceOneMonths",
      key: "hrOpenSinceOneMonths",
    },
    // {
    //   title: <>#Profiles Submitted <br/> Yesterday</>,
    //   dataIndex: '',
    //   key: '',
    // },
    {
      title: (
        <>
          Latest Communication & Updates <br /> (Matcher to be Accountable)
        </>
      ),
      dataIndex: "latestNotes",
      key: "latestNotes",
    },
  ];
  const getFilters = async () => {
    setIsLoading(true);
    let filterResult = await TaDashboardDAO.getAllMasterDAO();
    setIsLoading(false);
    if (filterResult.statusCode === HTTPStatusCode.OK) {
      setFiltersList(filterResult && filterResult?.responseBody);
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

  const getListData = useCallback(async () => {
    let pl = {
      taUserIDs: tableFilteredState?.filterFields_OnBoard?.taUserIDs,
      roleTypeIDs: tableFilteredState?.filterFields_OnBoard?.roleTypeIDs,
      hrStatusIDs: tableFilteredState?.filterFields_OnBoard?.hrStatusIDs,
      taskStatusIDs: tableFilteredState?.filterFields_OnBoard?.taskStatusIDs,
      modelType: tableFilteredState?.filterFields_OnBoard?.modelType,
      priority: tableFilteredState?.filterFields_OnBoard?.priority,
      searchText: searchText,
      taHeadUserIDs: `${selectedHead}`,
    };
    setIsLoading(true);
    const result = await TaDashboardDAO.getAllTAListRequestDAO(pl);
    setIsLoading(false);

    if (result.statusCode === HTTPStatusCode.OK) {
      setTaListData(groupByRowSpan(result.responseBody, "taName"));
    } else if (result.statusCode === HTTPStatusCode.NOT_FOUND) {
      setTaListData([]);
    } else if (result?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
      // setLoading(false);
      return navigate(UTSRoutes.LOGINROUTE);
    } else if (result?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
      // setLoading(false);
      return navigate(UTSRoutes.SOMETHINGWENTWRONG);
    } else {
      return "NO DATA FOUND";
    }
  }, [tableFilteredState, selectedHead, searchText, navigate]);

  useEffect(() => {
    getFilters();
  }, []);

  useEffect(() => {
    if (filtersList?.HeadUsers?.length) {
      setSelectedHead(filtersList?.HeadUsers[0]?.id);
    }
  }, [filtersList?.HeadUsers]);

  useEffect(() => {
    if (selectedHead.length !== 0) {
      getListData();
    }
  }, [searchText, tableFilteredState, selectedHead]);

  const clearFilters = () => {
    setAppliedFilters(new Map());
    setCheckedState(new Map());
    setFilteredTagLength(0);
    setTableFilteredState({
      filterFields_OnBoard: {
        taUserIDs: null,
        roleTypeIDs: null,
        hrStatusIDs: null,
        taskStatusIDs: null,
        modelType: null,
        priority: null,
        searchText: "",
      },
    });
    setDebouncedSearchText("");

    setSearchText("");
  };

  const saveNewTask = async () => {
    if (newTAUservalue === "") {
      setNewTaskError(true);
      return;
    }

    if (selectedCompanyID === "") {
      setNewTaskError(true);
      return;
    }

    if (newTAHRvalue === "") {
      setNewTaskError(true);
      return;
    }

    let pl = {
      tA_UserID: newTAUservalue,
      company_ID: selectedCompanyID,
      hiringRequest_ID: newTAHRvalue,
      task_Priority: null,
      no_of_InterviewRounds: null,
      role_TypeID: null,
      task_StatusID: null,
      activeTR: newTRAllData?.activeHR,
      talent_AnnualCTC_Budget_INRValue: newTRAllData?.totalAnnualBudgetInINR,
      modelType: newTRAllData?.modelType,
      revenue_On10PerCTC: newTRAllData?.revenue10Percent,
      totalRevenue_NoofTalent: 0,
      noOfProfile_TalentsTillDate: newTRAllData?.noOfProfilesSharedTillDate,
      tA_HR_StatusID: 2,
      tA_Head_UserID: `${selectedHead}`,
    };
    setAddingNewTask(true);
    let updateresult = await TaDashboardDAO.updateTAListRequestDAO(pl);
    setAddingNewTask(false);

    if (updateresult.statusCode === HTTPStatusCode.OK) {
      setNewTAUserValue("");
      setCompanyAutoCompleteValue("");
      setselectedCompanyID("");
      setNewTAHRValue("");
      setCompanyNameSuggestion([]);
      setTRAllData({});
      setNewTaskError(false);
      setIsAddNewRow(false);
      getListData();
    } else {
      message.error("Something went wrong");
    }
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
  return (
    <div className={taStyles.hiringRequestContainer}>
      {/* <div className={taStyles.addnewHR} style={{ margin: "0" }}>
        <div className={taStyles.hiringRequest}>TA Dashboard</div>
      </div> */}

      <div className={taStyles.filterContainer}>
        <div className={taStyles.filterSets}>
          <Select
            id="selectedValue"
            placeholder="Select Head"
            style={{ marginLeft: "10px", width: "270px" }}
            // mode="multiple"
            value={selectedHead}
            showSearch={true}
            onChange={(value, option) => {
              setSelectedHead(value);
            }}
            options={filtersList?.HeadUsers?.map((v) => ({
              label: v.data,
              value: v.id,
            }))}
            optionFilterProp="label"
            // getPopupContainer={(trigger) => trigger.parentElement}
          />
        </div>
      </div>

      <div className={taStyles.filterContainer}>
        <div className={taStyles.filterSets}>
          <div className={taStyles.filterSetsInner}>
            <div className={taStyles.addFilter} onClick={toggleHRFilter}>
              <FunnelSVG style={{ width: "16px", height: "16px" }} />

              <div className={taStyles.filterLabel}> Add Filters</div>
              <div className={taStyles.filterCount}>{filteredTagLength}</div>
            </div>

            <div
              className={taStyles.searchFilterSet}
              style={{ marginLeft: "15px" }}
            >
              <SearchSVG style={{ width: "16px", height: "16px" }} />
              <input
                type={InputType.TEXT}
                className={taStyles.searchInput}
                placeholder="Search Table"
                value={debounceSearchText}
                onChange={(e) => {
                  // setSearchText(e.target.value);
                  setDebouncedSearchText(e.target.value);
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
                    // setSearchText("");
                    setDebouncedSearchText("");
                  }}
                />
              )}
            </div>
            {/* <button
              style={{ marginLeft: "15px" }}
              type="submit"
              className={taStyles.btnPrimary}
              onClick={() => {}}
            >
              Search
            </button> */}

            <p
              className={taStyles.resetText}
              style={{ width: "190px" }}
              onClick={() => {
                clearFilters();
              }}
            >
              Reset Filter
            </p>
          </div>

          <div className={taStyles.filterRight}>
            <button
              className={taStyles.btnPrimary}
              onClick={() => {
                setIsAddNewRow(true);
              }}
            >
              Add New Task
            </button>
            {/* <button className={taStyles.btnPrimary} onClick={() => {}}>
              Export
            </button> */}
          </div>
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <Table
          scroll={{ x: "max-content" }}
          dataSource={TaListData}
          columns={columns}
          // bordered
          pagination={false}
          onChange={handleTableFilterChange}
        />
      )}

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
            filtersType={allEngagementConfig.taDashboardFilterTypeConfig(
              filtersList && filtersList
            )}
            clearFilters={clearFilters}
          />
        </Suspense>
      )}

      {showTalentProfiles && (
        <Modal
          transitionName=""
          width="800px"
          centered
          footer={null}
          open={showTalentProfiles}
          // className={allEngagementStyles.engagementModalContainer}
          className="engagementModalStyle"
          // onOk={() => setVersantModal(false)}
          onCancel={() => {
            setShowTalentProfiles(false);
          }}
        >
          <>
            <div style={{ padding: "35px 15px 10px 15px" }}>
              <h3>Profiles</h3>
            </div>

            {loadingTalentProfile ? (
              <div>
                <Skeleton active />
              </div>
            ) : (
              <Table
                dataSource={hrTalentList}
                columns={ProfileColumns}
                // bordered
                pagination={false}
              />
            )}

            <div style={{ padding: "10px 0" }}>
              <button
                className={taStyles.btnCancle}
                disabled={isAddingNewTask}
                onClick={() => {
                  setShowTalentProfiles(false);
                }}
              >
                Cancel
              </button>
            </div>
          </>
        </Modal>
      )}

      {isAddNewRow && (
        <Modal
          transitionName=""
          width="930px"
          centered
          footer={null}
          open={isAddNewRow}
          // className={allEngagementStyles.engagementModalContainer}
          className="engagementModalStyle"
          // onOk={() => setVersantModal(false)}
          onCancel={() => {
            setNewTAUserValue("");
            setCompanyAutoCompleteValue("");
            setselectedCompanyID("");
            setCompanyNameSuggestion([]);
            setNewTAHRValue("");
            setTRAllData({});
            setNewTaskError(false);
            setIsAddNewRow(false);
          }}
        >
          <div style={{ padding: "35px 15px 10px 15px" }}>
            <h3>Add New Task</h3>
          </div>
          <div style={{ padding: "10px 15px" }}>
            {isAddingNewTask ? (
              <Skeleton active />
            ) : (
              <>
                <div className={taStyles.row}>
                  <div className={taStyles.colMd6}>
                    {/* <Select  value={newTAUservalue}  onChange={val=>{
                      setNewTAUserValue(val);
                      }}>
                      {filtersList?.Users?.map(v=> <Option value={v.data}>{v.data}</Option>)}
                      </Select> */}
                    <div className={taStyles.formGroup}>
                      <label>
                        Select TA <span className={taStyles.reqField}>*</span>
                      </label>
                      <Select
                        id="selectedValue"
                        placeholder="Select TA"
                        // style={{marginLeft:'10px',width:'270px'}}
                        // mode="multiple"
                        value={newTAUservalue}
                        showSearch={true}
                        onChange={(value, option) => {
                          setNewTAUserValue(value);
                          setCompanyAutoCompleteValue("");
                          setCompanyNameSuggestion([]);
                          setselectedCompanyID("");
                          setNewTAHRValue("");
                          setTRAllData({});
                        }}
                        options={filtersList?.Users?.map((v) => ({
                          label: v.data,
                          value: v.id,
                        }))}
                        optionFilterProp="label"
                        // getPopupContainer={(trigger) => trigger.parentElement}
                      />

                      {newTaskError && newTAUservalue === "" && (
                        <p className={taStyles.error}>please select TA</p>
                      )}
                    </div>
                  </div>
                  <div className={taStyles.colMd6}>
                    <div className={taStyles.formGroup}>
                      <label>
                        Select company{" "}
                        <span className={taStyles.reqField}>*</span>
                      </label>

                      <AutoComplete
                        disabled={newTAUservalue === ""}
                        dataSource={getCompanyNameSuggestion}
                        onSelect={(companyName, _obj) => {
                          let comObj = getCompanyNameSuggestion.find(
                            (i) => i.value === companyName
                          );

                          setCompanyAutoCompleteValue(companyName);
                          setselectedCompanyID(comObj?.id);
                          getHRLISTForComapny(comObj?.id);
                          setNewTAHRValue("");
                          setTRAllData({});
                        }}
                        // filterOption={true}
                        onSearch={(searchValue) => {
                          getCompanySuggestionHandler(searchValue);
                        }}
                        value={companyautoCompleteValue}
                        onChange={(companyName) => {
                          setCompanyAutoCompleteValue(companyName);
                        }}
                        placeholder="Search Company"
                        // ref={controllerCompanyRef}
                      />
                      {newTaskError && selectedCompanyID === "" && (
                        <p className={taStyles.error}>please select company</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className={taStyles.row}>
                  <div className={taStyles.colMd6}>
                    {/* <Select  value={newTAUservalue}  onChange={val=>{
                      setNewTAUserValue(val);
                      }}>
                      {filtersList?.Users?.map(v=> <Option value={v.data}>{v.data}</Option>)}
                      </Select> */}
                    <div className={taStyles.formGroup}>
                      <label>
                        Select HR <span className={taStyles.reqField}>*</span>
                      </label>
                      <Select
                        disabled={selectedCompanyID === ""}
                        id="selectedValue"
                        placeholder="Select HR"
                        // style={{marginLeft:'10px',width:'270px'}}
                        // mode="multiple"
                        value={newTAHRvalue}
                        showSearch={true}
                        onChange={(value, option) => {
                          setNewTAHRValue(value);
                          setTRAllData(option);
                        }}
                        options={hrListSuggestion.map((v) => ({
                          ...v,
                          label: v.value,
                          value: v.id,
                        }))}
                        optionFilterProp="label"
                        // getPopupContainer={(trigger) => trigger.parentElement}
                      />
                      {newTaskError && newTAHRvalue === "" && (
                        <p className={taStyles.error}>please select HR</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className={taStyles.HRINFOCOntainer}>
                  {Object.keys(newTRAllData).length > 0 && (
                    <>
                      <div>
                        <span>Active HR : </span>
                        {newTRAllData.activeHR}
                      </div>
                      <div>
                        <span>HR Created Date : </span>
                        {moment(newTRAllData.hrCreatedDate).format(
                          "DD-MMM-YYYY"
                        )}
                      </div>
                      <div>
                        <span>Talent Annual CTC Budget (INR) : </span>
                        {newTRAllData.totalAnnualBudgetInINR}
                      </div>
                      <div>
                        <span>DP /Contract : </span>
                        {newTRAllData.modelType}
                      </div>
                      <div>
                        <span>Revenue Opportunity (10% on annual CTC) : </span>
                        {newTRAllData.revenue10Percent}
                      </div>
                      <div>
                        <span>Sales : </span>
                        {newTRAllData.salesUser}
                      </div>
                      <div>
                        <span>
                          Total Revenue Opportunity (NO. of TR x TalentAnnual
                          CTC budget) :{" "}
                        </span>
                        {newTRAllData.totalRevenueOppurtunity}
                      </div>
                      <div>
                        <span>Open Since {">"} 1 Month (Yes/no) : </span>
                        {newTRAllData.hrOpenSinceOneMonths}
                      </div>
                      <div>
                        <span>
                          No. of Active/Submitted Profiles till Date :{" "}
                        </span>
                        {newTRAllData.noOfProfilesSharedTillDate}
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

            <div style={{ margin: "10px 0" }}>
              <button
                className={taStyles.btnPrimary}
                disabled={isAddingNewTask}
                onClick={() => {
                  saveNewTask();
                }}
              >
                Save
              </button>
              <button
                className={taStyles.btnCancle}
                disabled={isAddingNewTask}
                onClick={() => {
                  setNewTAUserValue("");
                  setCompanyAutoCompleteValue("");
                  setselectedCompanyID("");
                  setNewTAHRValue("");
                  setTRAllData({});
                  setCompanyNameSuggestion([]);
                  setNewTaskError(false);
                  setIsAddNewRow(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
