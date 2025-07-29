import React, { useEffect, useState, useCallback, Suspense } from "react";
import { Table, Card, Select, Input, Tabs, Dropdown, Menu, Tooltip, Modal } from "antd";
import pcsStyles from "./potentialClosuresSheet.module.css";
import { ReportDAO } from "core/report/reportDAO";
import moment from "moment";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import { All_Hiring_Request_Utils } from "shared/utils/all_hiring_request_util";
import Diamond from "assets/svg/diamond.svg";
import TabPane from "antd/lib/tabs/TabPane";
import { downloadToExcel } from "modules/report/reportUtils";
import { ReactComponent as SearchSVG } from "assets/svg/search.svg";
import { ReactComponent as CloseSVG } from "assets/svg/close.svg";
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import { InputType } from "constants/application";
import { IoChevronDownOutline } from "react-icons/io5";
import { ReactComponent as FunnelSVG } from "assets/svg/funnel.svg";
import { allHRConfig } from "modules/hiring request/screens/allHiringRequest/allHR.config";
import { HTTPStatusCode } from "constants/network";
import { hiringRequestDAO } from "core/hiringRequest/hiringRequestDAO";
import { IoMdAddCircle } from "react-icons/io";
import { IconContext } from "react-icons";
import spinGif from "assets/gif/RefreshLoader.gif";
import Editor from "modules/hiring request/components/textEditor/editor";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { UserSessionManagementController } from "modules/user/services/user_session_services";

const AllClientFiltersLazy = React.lazy(() =>
  import("modules/allClients/components/allClients/allClientsFilter")
);

const { Option } = Select;
let defaaultFilterState = {
  filterFields_Client: {
    hrStatus: null,
    leadUserId: null,
    salesRep: null,
    HRType: null,
    team: null,
    searchText: "",
  },
};

export default function PotentialClosuresSheet() {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("G");
  const [openTicketDebounceText, setopenTicketDebounceText] = useState("");
  const [openTicketSearchText, setopenTicketSearchText] = useState("");
  const [pageSize, setPageSize] = useState(100);
  const pageSizeOptions = [100, 200, 300, 500, 1000, 5000];
  const [isAllowFilters, setIsAllowFilters] = useState(false);
  const [getHTMLFilter, setHTMLFilter] = useState(false);
  const [filteredTagLength, setFilteredTagLength] = useState(0);
  const [appliedFilter, setAppliedFilters] = useState(new Map());
  const [checkedState, setCheckedState] = useState(new Map());
  const [filtersList, setFiltersList] = useState([]);
  const [tableFilteredState, setTableFilteredState] =
    useState(defaaultFilterState);
  const [startDate, setStartDate] = useState(new Date());
  const [ownersList,setOwnersList]=useState([])

   const [showComment, setShowComment] = useState(false);
    const [commentData, setCommentData] = useState({});
 const [allCommentList, setALLCommentsList] = useState([]);
  const [isCommentLoading, setIsCommentLoading] = useState(false);

  const [userData, setUserData] = useState({});
    
    useEffect(() => {
      const getUserResult = async () => {
        let userData = UserSessionManagementController.getUserSession();
        if (userData) setUserData(userData);
      };
      getUserResult();
    }, []);

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

  const columnsReport =[
    {
      title: <div style={{ textAlign: "center" }}>Team</div>,
      dataIndex: "hR_Team",
      key: "hR_Team",
      fixed: "left",
      width: 100,
      className: pcsStyles.headerCell,
    },
  ]


  const columns = [
    {
      title: <div style={{ textAlign: "center" }}>Team</div>,
      dataIndex: "hR_Team",
      key: "hR_Team",
      fixed: "left",
      width: 100,
      className: pcsStyles.headerCell,
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
      width: 110,
      className: pcsStyles.headerCell,
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
      className: pcsStyles.headerCell,
    },
    {
      title: <div style={{ textAlign: "center" }}>HR ID</div>,
      dataIndex: "hR_Number",
      key: "hR_Number",
      width: 150,
      fixed: "left",
      className: pcsStyles.headerCell,
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
      className: pcsStyles.headerCell,
      width: "180px",
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
      className: pcsStyles.headerCell,
    },
    {
      title: <div style={{ textAlign: "center" }}>Sales Rep</div>,
      dataIndex: "salesPerson",
      key: "salesPerson",
      width: 150,
      fixed: "left",
      className: pcsStyles.headerCell,
    },
    {
      title: <div style={{ textAlign: "center" }}>Company</div>,
      dataIndex: "company",
      key: "company",
      width: 150,
      fixed: "left",
      className: pcsStyles.headerCell,
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
    //   className: pcsStyles.headerCell,
    // },
      {
      title: <div style={{ textAlign: "center" }}>Position</div>,
      dataIndex: "position",
      key: "position",
      width: 180,
    },
      {
      title: <div style={{ textAlign: "center" }}>CTP Link</div>,
      dataIndex: "ctP_Link",
      key: "ctP_Link",
      width: 120,
      render:(text,result)=>{
        if(text === '' || text ==='NA'){
          return ''
        }
        return <div style={{display:'flex', justifyContent:'center'}}><a href={text} style={{textDecoration:'underline'}} target="_blank"  rel="noreferrer" >Click</a></div> 
      }
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
      className: pcsStyles.headerCell,
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
      className: pcsStyles.headerCell,
    },
     {
      title: <div style={{ textAlign: "center" }}>Uplers Fees %</div>,
      dataIndex: "uplersFeesPer",
      key: "uplersFeesPer",
      width: 120,
      align: "center",
      className: pcsStyles.headerCell,
    },
    {
      title: <div style={{ textAlign: "center" }}>Uplers Fees</div>,
      dataIndex: "uplersFeeStr",
      key: "uplersFeeStr",
      width: 150,
      align: "left",
      className: pcsStyles.headerCell,
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          Product /<br />
          Non Product
        </div>
      ),
      dataIndex: "productType",
      key: "productType",
      width: 120,
      align: "center",
      render: (value, record, index) =>
        renderYesNoSelect(
          value,
          record,
          index,
          "productType",
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
      width: 110,
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
      title: (
        <div style={{ textAlign: "center" }}>
          Actual
          <br />
          Closure Week
        </div>
      ),
      dataIndex: "closurebyMonth",
      key: "closurebyMonth",
      width: 110,
      align: "center",
      render: (value, record, index) =>
        renderWeekSelect(
          value,
          record,
          index,
          "closurebyMonth",
          handleFieldChange
        ),
    },
    //,   Next Action Point (Add / View), Owner1
      {
      title: (
        <div style={{ textAlign: "center" }}>
           Pushed 
          <br /> Closure Week
        </div>
      ),
      dataIndex: "pushed_Closure_Week",
      key: "pushed_Closure_Week",
      width: 100,
      align: "center",
      className: pcsStyles.headerCell,
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
      width: 100,
      align: "center",
      className: pcsStyles.headerCell,
    },
       {
      title: (
        <div style={{ textAlign: "center" }}>
          Back Up
        
        </div>
      ),
      dataIndex: "talent_Backup",
      key: "talent_Backup",
      width: 100,
      align: "center",
      className: pcsStyles.headerCell,
    },
    // {
    //   title: <div style={{ textAlign: "center" }}>Potential</div>,
    //   dataIndex: "potentialType",
    //   key: "potentialType",
    //   width: 100,
    //   align: "center",
    //   render: (value, record, index) =>
    //     renderYesNoSelect(
    //       value,
    //       record,
    //       index,
    //       "potentialType",
    //       handleFieldChange
    //     ),
    // },
   
    {
      title: (
        <div style={{ textAlign: "center" }}>
          Talent Pay Rate/ <br />
          Client Budget
        </div>
      ),
      dataIndex: "talentPayStr",
      key: "talentPayStr",
      width: 280,
      className: pcsStyles.headerCell,
    },
   
    {
      title: (
        <div style={{ textAlign: "center" }}>
          Above 35
          <br /> LPA
        </div>
      ),
      dataIndex: "above35LPA",
      key: "above35LPA",
      width: 100,
      align: "center",
      className: pcsStyles.headerCell,
    },
    {
      title: <div style={{ textAlign: "center" }}>Lead</div>,
      dataIndex: "leadType",
      key: "leadType",
      width: 100,
      align: "center",
      className: pcsStyles.headerCell,
    },
    {
      title: <div style={{ textAlign: "center" }}>Next Action <br/> Point</div>,
      dataIndex: "leadType",
      key: "leadType",
      width: 100,
      align: "center",
      className: pcsStyles.headerCell,
      render:(text,record)=>{
        return  <IconContext.Provider
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
      }
    },
       {
      title: <div style={{ textAlign: "center" }}>Owner</div>,
      dataIndex: "owner_UserID",
      key: "owner_UserID",
      width: 100,
      align: "center",
      className: pcsStyles.headerCell,
      render:(value, record,index)=>{
        return  renderOwnerSelect(
          value,
          record,
          index,
          "owner_UserID",
          handleFieldChange
        )
      }
    },
  ];

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setopenTicketSearchText(openTicketDebounceText);
    }, 1000);
    return () => clearTimeout(timer);
  }, [openTicketDebounceText]);

  useEffect(() => {
    fetchPotentialClosuresListData(activeTab);
  }, [activeTab, openTicketSearchText, tableFilteredState,startDate]);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const fetchPotentialClosuresListData = async (businessType) => {
    let payload = {
      hR_BusinessType: businessType,
      searchText: openTicketSearchText,
      // "hrStatusIDs": "",
      modelType: "",
      hrStatus: tableFilteredState?.filterFields_Client?.hrStatus,
      leadUserId: tableFilteredState?.filterFields_Client?.leadUserId,
      salesRep: tableFilteredState?.filterFields_Client?.salesRep,
      HRType: tableFilteredState?.filterFields_Client?.HRType,
      team: tableFilteredState?.filterFields_Client?.team,
      month: moment(startDate).format('MM'),
      year:moment(startDate).format('YYYY')
    };

    setLoading(true);
    const apiResult = await ReportDAO.PotentialClosuresListDAO(payload);
    setLoading(false);
    if (apiResult?.statusCode === 200) {
      setData(apiResult.responseBody);
    } else if (apiResult?.statusCode === 404) {
      setData([]);
    }
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
        <Option value="100%">100%</Option>
         <Option value="75%">75%</Option>
        <Option value="50%">50%</Option>
         <Option value="25%">25%</Option>
        <Option value="0%">0%</Option>
        <Option value="Preonboarding">Preonboarding</Option>
         <Option value="Lost">Lost</Option>
        <Option value="Won">Won</Option>

      
      </Select>
    );
    // return (
    //   <Select
    //     value={value}
    //     onChange={(newValue) =>
    //       handleChange(newValue, record, index, dataIndex)
    //     }
    //     style={{ width: "100%" }}
    //     size="small"
    //   >
    //     <Option value="Yes">Yes</Option>
    //     <Option value="No">No</Option>
    //   </Select>
    // );
  };

    const renderOwnerSelect = (value, record, index, dataIndex, handleChange) => {
     return (
      <Select
        value={value}
        onChange={(newValue) =>
          handleChange(newValue, record, index, dataIndex)
        }
        style={{ width: "100%" }}
        size="small"
        showSearch={true}
        filterOption={(input, option) =>
        option?.children?.toLowerCase().includes(input.toLowerCase())
      }
      >      
      {ownersList.map(owner=> <Option value={owner.id}>{owner.fullName}</Option>)}      
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

  const renderInputField = (value, record, index, dataIndex, handleChange) => {
    return (
      <Input
        value={value}
        onChange={(e) => handleChange(e.target.value, record, index, dataIndex)}
        onBlur={() => {
          if (
            dataIndex === "closurebyWeekend" ||
            dataIndex === "closurebyMonth"
          ) {
            updatePotentialClosuresRowValue(data[index]);
          }
        }}
        style={{ width: "100%" }}
        size="small"
      />
    );
  };

  const handleFieldChange = (newValue, record, index, field) => {
    const updatedData = [...data];
    updatedData[index] = { ...record, [field]: newValue };
    setData(updatedData);

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
      Pushed_Closure_Week:updatedData?.pushed_Closure_Week,
      Talent_NoticePeriod:updatedData?.talent_NoticePeriod,
      Talent_Backup:updatedData?.talent_Backup,
      OwnerID:updatedData?.owner_UserID
    };

    await ReportDAO.PotentialClosuresUpdateDAO(pl);
  };

   const getOwnerUserList = async () => {
  
   const response = await ReportDAO.PotentialOwnerUserDAO();

   if(response.statusCode === 200){
    setOwnersList(response.responseBody)
   }
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


  useEffect(()=>{
    getOwnerUserList()
  },[])

  const handleExport = (apiData) => {
    let DataToExport = apiData.map((data) => {
      let obj = {};
      columns.forEach((val) => {
        obj[`${val.title}`] = data[`${val.key}`];
      });
      return obj;
    });
    downloadToExcel(DataToExport, "Potential_Closures_Report");
  };

  const toggleHRFilter = useCallback(() => {
    !getHTMLFilter
      ? setIsAllowFilters(true)
      : setTimeout(() => {
          setIsAllowFilters(true);
        }, 300);
    setHTMLFilter(!getHTMLFilter);
  }, [getHTMLFilter]);

  	const onCalenderFilter = (dates) => {
		// const [start, end] = dates;
	// const month = dates.getMonth() + 1
	// const year = dates.getFullYear()
	 setStartDate(dates);			
		}


  const clearFilters = useCallback(() => {
    setAppliedFilters(new Map());
    setCheckedState(new Map());
    setFilteredTagLength(0);
    setTableFilteredState(defaaultFilterState);
    setIsAllowFilters(false);
    setPageSize(100);
  }, [
    // handleHRRequest,
    setAppliedFilters,
    setCheckedState,
    setFilteredTagLength,
    setIsAllowFilters,
    setTableFilteredState,
    // tableFilteredState,
  ]);

  const onRemoveHRFilters = () => {
    setTimeout(() => {
      setIsAllowFilters(false);
    }, 300);
    setHTMLFilter(false);
  };

  const getHRFilterRequest = useCallback(async () => {
    const response = await hiringRequestDAO.getAllFilterDataForHRRequestDAO();
    if (response?.statusCode === HTTPStatusCode.OK) {
      setFiltersList(response && response?.responseBody?.details?.Data);
      // setHRTypesList(response && response?.responseBody?.details?.Data.hrTypes.map(i => ({id:i.text, value:i.value})))
    } else {
      return "NO DATA FOUND";
    }
  }, []);

  useEffect(() => {
    getHRFilterRequest();
  }, [getHRFilterRequest]);

  return (
    <div className={pcsStyles.snapshotContainer}>
      <div className={pcsStyles.addnewHR} style={{ margin: "0" }}>
        <div className={pcsStyles.hiringRequest}>Potential Closures List</div>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        style={{ marginBottom: 16, marginTop: 16 }}
        destroyInactiveTabPane={false}
        animated={true}
        tabBarGutter={50}
        tabBarStyle={{ borderBottom: `1px solid var(--uplers-border-color)` }}
      >
        <TabPane tab="Global" key="G" />
         {/* <TabPane tab="Global Report" key="GR" /> */}
        <TabPane tab="India" key="I" />
      </Tabs>

      <div className={pcsStyles.filterContainer}>
        <div className={pcsStyles.filterSets}>
          <div className={pcsStyles.filterSetsInner}>
            <div className={pcsStyles.addFilter} onClick={toggleHRFilter}>
              <FunnelSVG style={{ width: "16px", height: "16px" }} />

              <div className={pcsStyles.filterLabel}>Add Filters</div>
              <div className={pcsStyles.filterCount}>{filteredTagLength}</div>
            </div>
            <p onClick={() => clearFilters()}>Reset Filters</p>
            <div
              className={pcsStyles.searchFilterSet}
              style={{ marginLeft: "10px" }}
            >
              <SearchSVG style={{ width: "16px", height: "16px" }} />
              <input
                type={InputType.TEXT}
                className={pcsStyles.searchInput}
                placeholder="Search here!"
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
          </div>



          <div className={pcsStyles.priorityFilterSet}>
            {/* <div className={pcsStyles.calendarFilterSet}>
							<div className={pcsStyles.label}>Month-Year</div>
							<div className={pcsStyles.calendarFilter}>
								<CalenderSVG style={{ height: '16px', marginRight: '16px' }} />
								<DatePicker
									style={{ backgroundColor: 'red' }}
									onKeyDown={(e) => {
										e.preventDefault();
										e.stopPropagation();
									}}
									className={pcsStyles.dateFilter}
									placeholderText="Month - Year"
									selected={startDate}
									onChange={onCalenderFilter}
									// startDate={startDate}
									// endDate={endDate}
									dateFormat="MM-yyyy"
									showMonthYearPicker
								/>
							</div>
						</div> */}
            <div className={pcsStyles.label}>Showing</div>
            <div className={pcsStyles.paginationFilter}>
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
                      return <Menu.Item key={item}>{item}</Menu.Item>;
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

            <div
              className={pcsStyles.paginationFilter}
              style={{ border: "none", width: "auto" }}
            >
              <button
                className={pcsStyles.btnPrimary}
                onClick={() => handleExport(data)}
              >
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <Card bordered={false}>
        <div>
          {isLoading ? (
            <TableSkeleton />
          ) : data?.length > 0 ? (
            <Table
              columns={activeTab !== 'GR' ? columns : columnsReport}
              dataSource={data}
              bordered
              pagination={{
                pageSize: pageSize,
                pageSizeOptions: pageSizeOptions,
              }}
              size="middle"
              scroll={{ x: "max-content", y: 1000 }}
              rowClassName={(record, index) =>
                index % 2 === 0 ? pcsStyles.evenRow : pcsStyles.oddRow
              }
            />
          ) : (
            <Table columns={columns} dataSource={[]} bordered size="middle" />
          )}
        </div>
      </Card>

      {isAllowFilters && (
        <Suspense fallback={<div>Loading...</div>}>
          <AllClientFiltersLazy
            setIsAllowFilters={() => {}}
            setAppliedFilters={setAppliedFilters}
            appliedFilter={appliedFilter}
            setCheckedState={setCheckedState}
            checkedState={checkedState}
            // handleHRRequest={handleHRRequest}
            setPageIndex={() => {}}
            setTableFilteredState={setTableFilteredState}
            tableFilteredState={tableFilteredState}
            setFilteredTagLength={setFilteredTagLength}
            onRemoveSurveyFilters={() => onRemoveHRFilters()}
            getHTMLFilter={getHTMLFilter}
            hrFilterList={allHRConfig.hrFilterListConfig()}
            filtersType={allHRConfig.potentialFilterTypeConfig(
              filtersList && filtersList
            )}
            clearFilters={clearFilters}
          />
        </Suspense>
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
                    className={pcsStyles.btnCancle}
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
}
