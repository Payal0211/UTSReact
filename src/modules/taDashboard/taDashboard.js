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
  const [selectedHead, setSelectedHead] = useState([]);
  const [headList, setHeadList] = useState([]);
  const [searchText, setSearchText] = useState("");
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
  const [companyautoCompleteValue, setCompanyAutoCompleteValue] = useState("");
  const [newTAHRvalue, setNewTAHRValue] = useState("");
  const [selectedCompanyID, setselectedCompanyID] = useState("");

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
      tA_Head_UserID: `${selectedHead[0]}`,
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

    console.log(value, key, params, index, pl);

    let updateresult = await TaDashboardDAO.updateTAListRequestDAO(pl);

    console.log("update res", updateresult);
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
            console.log("on c", valobj, "task_StatusID", result, index);
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
      companyID: 38846,
    };
    let response = await TaDashboardDAO.getHRlistFromCompanyDAO(pl);
    console.log("hr data", response);
  };

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
              {/* <br/>   <IconContext.Provider value={{ color: 'green', style: { width:'35px',height:'35px',marginTop:'5px',cursor:'pointer' } }}> <Tooltip title={`Add task for ${value}`} placement="top" >
                        <span
                        // style={{
                        //   background: 'green'
                        // }}
                        onClick={()=> {}}
                        className={taStyles.feedbackLabel}>
                        {' '}
                        <IoMdAddCircle />
                      </span>   </Tooltip>
                      </IconContext.Provider> */}
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
      render: (text, result, index) => {
        return <PriorityComp text={text} result={result} index={index} />;
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
      fixed: "left",
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
      fixed: "left",
      width: "100px",
      render: (text, result, index) => {
        return <InterviewRoundComp text={text} result={result} index={index} />;
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
      title: "Sales",
      dataIndex: "salesName",
      key: "salesName",
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
    let filterResult = await TaDashboardDAO.getAllMasterDAO();
    console.log("filter result", filterResult);
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
    console.log("list", result);

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
      setSelectedHead([filtersList?.HeadUsers[0]?.id]);
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
    setSearchText("");
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
          <div className={taStyles.filterSetsInner}>
            <div className={taStyles.addFilter} onClick={toggleHRFilter}>
              <FunnelSVG style={{ width: "16px", height: "16px" }} />

              <div className={taStyles.filterLabel}> Add Filters</div>
              <div className={taStyles.filterCount}>{filteredTagLength}</div>
            </div>

            {console.log(
              "fd",
              filtersList?.HeadUsers?.map((v) => ({
                label: v.data,
                value: v.id,
              })),
              filtersList?.HeadUsers
            )}
            <div
              className={taStyles.searchFilterSet}
              style={{ marginLeft: "15px" }}
            >
              <SearchSVG style={{ width: "16px", height: "16px" }} />
              <input
                type={InputType.TEXT}
                className={taStyles.searchInput}
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
            {/* <button
              style={{ marginLeft: "15px" }}
              type="submit"
              className={taStyles.btnPrimary}
              onClick={() => {}}
            >
              Search
            </button> */}

            <Select
              id="selectedValue"
              placeholder="Select Head"
              style={{ marginLeft: "10px", width: "270px" }}
              mode="multiple"
              value={selectedHead}
              showSearch={true}
              onChange={(value, option) => {
                console.log({ value, option });
                setSelectedHead(value);
              }}
              options={filtersList?.HeadUsers?.map((v) => ({
                label: v.data,
                value: v.id,
              }))}
              optionFilterProp="label"
              // getPopupContainer={(trigger) => trigger.parentElement}
            />
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
            {/* <button className={taStyles.btnPrimary} onClick={() => {setIsAddNewRow(true)}}>
             Add New Task
            </button>
            <button className={taStyles.btnPrimary} onClick={() => {}}>
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

      {console.log("tableFilteredState", tableFilteredState)}
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
          onCancel={() => setIsAddNewRow(false)}
        >
          <div style={{ padding: "35px 10px 10px 10px" }}>
            <div className={taStyles.row}>
              <div className={taStyles.colMd6}>
                {/* <Select  value={newTAUservalue}  onChange={val=>{
                      setNewTAUserValue(val);
                      }}>
                      {filtersList?.Users?.map(v=> <Option value={v.data}>{v.data}</Option>)}
                      </Select> */}
                <div className={taStyles.formGroup}>
                  <label>Select TA</label>
                  <Select
                    id="selectedValue"
                    placeholder="Select TA"
                    // style={{marginLeft:'10px',width:'270px'}}
                    // mode="multiple"
                    value={newTAUservalue}
                    showSearch={true}
                    onChange={(value, option) => {
                      console.log({ value, option });
                      setNewTAUserValue(value);
                    }}
                    options={filtersList?.Users?.map((v) => ({
                      label: v.data,
                      value: v.id,
                    }))}
                    optionFilterProp="label"
                    // getPopupContainer={(trigger) => trigger.parentElement}
                  />
                </div>
              </div>
              <div className={taStyles.colMd6}>
                <div className={taStyles.formGroup}>
                  <label>Select company</label>

                  <AutoComplete
                    disabled={newTAUservalue === ""}
                    dataSource={getCompanyNameSuggestion}
                    onSelect={(companyName, _obj) => {
                      console.log("selected com", companyName, _obj);
                      let comObj = getCompanyNameSuggestion.find(
                        (i) => i.value === companyName
                      );
                      console.log(comObj);
                      setCompanyAutoCompleteValue(companyName);
                      setselectedCompanyID(comObj?.id);
                      getHRLISTForComapny(comObj?.id);
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
                  <label>Select HR</label>
                  <Select
                    disabled={selectedCompanyID === ""}
                    id="selectedValue"
                    placeholder="Select HR"
                    // style={{marginLeft:'10px',width:'270px'}}
                    // mode="multiple"
                    value={newTAHRvalue}
                    showSearch={true}
                    onChange={(value, option) => {
                      console.log({ value, option });
                      setNewTAHRValue(value);
                    }}
                    options={filtersList?.Users?.map((v) => ({
                      label: v.data,
                      value: v.id,
                    }))}
                    optionFilterProp="label"
                    // getPopupContainer={(trigger) => trigger.parentElement}
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
