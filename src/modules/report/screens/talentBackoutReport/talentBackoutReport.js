import React , { useEffect, useState, useCallback, Suspense } from 'react'
import TalentBackoutStyle from "./talentBackoutReport.module.css";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { InputType } from 'constants/application';
import { ReactComponent as SearchSVG } from 'assets/svg/search.svg';
import { ReportDAO } from 'core/report/reportDAO';
import { HTTPStatusCode, NetworkInfo } from 'constants/network';
import WithLoader from 'shared/components/loader/loader';
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton';
import { Table,Dropdown,Menu, Select, Tooltip, Modal } from 'antd';
import { downloadToExcel } from 'modules/report/reportUtils';
import LogoLoader from 'shared/components/loader/logoLoader';
import { IoChevronDownOutline } from "react-icons/io5";
import { ReactComponent as FunnelSVG } from "assets/svg/funnel.svg";
import { ReactComponent as CloseSVG } from "assets/svg/close.svg";
import { Link } from "react-router-dom";
import moment from 'moment';
import OnboardFilerList from 'modules/onBoardList/OnboardFilterList';
import { amDashboardDAO } from 'core/amdashboard/amDashboardDAO';
import { allEngagementConfig } from 'modules/engagement/screens/engagementList/allEngagementConfig';
import { All_Hiring_Request_Utils } from 'shared/utils/all_hiring_request_util';
import { FaDownload } from "react-icons/fa";
import { IconContext } from "react-icons";

function TalentBackoutReport() {
  const [getBackoutDetails,setTalentBackoutDetails] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const [ searchText , setSearchText] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSize, setPageSize] = useState(10);    
	const [pageIndex, setPageIndex] = useState(1);
  const pageSizeOptions = [100, 200, 300, 500, 1000,5000];
  const [getHTMLFilter, setHTMLFilter] = useState(false);
  const [isAllowFilters, setIsAllowFilters] = useState(false);

  var date = new Date();
  const [startDate, setStartDate] = useState(new Date(date.getFullYear(), date.getMonth() - 1, date.getDate()));
  const [endDate, setEndDate] = useState(new Date(date));
  const [dateError, setDateError] = useState(false);
  const [filteredTagLength, setFilteredTagLength] = useState(0);
  const [dateTypeFilter, setDateTypeFilter] = useState(2);
  const [monthDate, setMonthDate] = useState(new Date());
   const [filtersList, setFiltersList] = useState({});
   const [showReason, setShowReason] = useState(false)
   const [reasonToShow, setReasonToShow] = useState('')

    const [appliedFilter, setAppliedFilters] = useState(new Map());
    const [checkedState, setCheckedState] = useState(new Map());
    const [tableFilteredState, setTableFilteredState] = useState({
      filterFields_OnBoard: {
        amName: "",
        statusIds: "",
      },
    });

  const dateTypeList = [{
    value: 2,
    label: 'No Dates',
  },
  {
    value: 0,
    label: 'By Month',
  },
  {
    value: 1,
    label: 'With Date Range',
  }]

  const getBackoutData = useCallback(async (psize,pInd)=>{
    setIsLoading(true)
    let payload = {
        "totalrecord": psize ? psize : pageSize,
        "pagenumber": pInd ? pInd : pageIndex,
        "FilterFields": {
            "fromDate": dateTypeFilter === 2 ? null : dateTypeFilter === 1 ? startDate?.toLocaleDateString("en-US") : null,
            "toDate": dateTypeFilter === 2 ? null : dateTypeFilter === 1 ? endDate?.toLocaleDateString("en-US") : null,
            "searchText":searchText,
            "amIds": tableFilteredState?.filterFields_OnBoard?.amName,
            "statusIds": tableFilteredState?.filterFields_OnBoard?.statusIds,   
            "month": dateTypeFilter === 2 ? 0 :
                      dateTypeFilter === 0
                        ? +moment(monthDate).format("M")
                        : 0,
            "year": dateTypeFilter === 2 ? 0 :
                      dateTypeFilter === 0
                        ? +moment(monthDate).format("YYYY")
                        : 0,
        }
      
    }

    const talentBackoutResult = await ReportDAO.getTalentBackoutReportDRO(payload)

    // console.log(replacementResult)

    if(talentBackoutResult?.statusCode === HTTPStatusCode.OK){
        setTalentBackoutDetails(talentBackoutResult?.responseBody?.rows)
        setTotalRecords(talentBackoutResult?.responseBody?.totalrows)
        setIsLoading(false)    
    }else{
        setTalentBackoutDetails([])
        setIsLoading(false)
    }
    setIsLoading(false)
  } ,[endDate, pageIndex, pageSize, searchText,startDate,tableFilteredState,monthDate]) 

  useEffect(()=>{
    if(endDate && startDate){
         getBackoutData()
    }
   
  },[endDate,startDate,debouncedSearch,tableFilteredState,pageSize,monthDate])

  
  const getFilterList = async () => {
    let result = await amDashboardDAO.getDeployedFiltersDAO();

    if (result.statusCode === HTTPStatusCode.OK) {
      setFiltersList(result.responseBody.Data);
    }
  }

  useEffect(() => {
    getFilterList();
  }, []);

  const onCalenderFilter = (dates) => {
    const [start, end] = dates;
    // console.log(start, end)
    setStartDate(start);
    setEndDate(end);

    if (start?.toLocaleDateString() === end?.toLocaleDateString()) {
      let params = {
        fromDate: new Date(date.getFullYear(), date.getMonth() - 1, date.getDate()),
        toDate: new Date(date),
      }
      setStartDate(params.fromDate);
      setEndDate(params.toDate);
      setDateError(true)
      setTimeout(()=>setDateError(false) , 5000)
      return;
    }
    
  };

  useEffect(() => {
    const timer = setTimeout(() => getBackoutData() , 1000);
    return () => clearTimeout(timer);
}, [debouncedSearch]);

const onRemoveFilters = () => {
  setTimeout(() => {
    setIsAllowFilters(false);
  }, 300);
  setHTMLFilter(false);
};

  const toggleHRFilter = useCallback(() => {
    !getHTMLFilter
      ? setIsAllowFilters(!isAllowFilters)
      : setTimeout(() => {
          setIsAllowFilters(!isAllowFilters);
        }, 300);
    setHTMLFilter(!getHTMLFilter);
  }, [getHTMLFilter, isAllowFilters]);

const clearFilters = ()=>{
  setTableFilteredState({
    filterFields_OnBoard: {
      amName: "",
      statusIds: "",
    },
  })

  setSearchText('')
  setDebouncedSearch('')
  setAppliedFilters(new Map());
  setCheckedState(new Map());
  setFilteredTagLength(0);
  setDateTypeFilter(2);
  setPageSize(10)
  setMonthDate(new Date());
  setStartDate(
    new Date(date.getFullYear(), date.getMonth() - 1, date.getDate())
  );
  setEndDate(new Date(date));
}
const handleExport = (apiData) => {
    let DataToExport =  apiData.map(data => {
        let obj = {}
        tableColumnsMemo.forEach(val => {if(val.key !== "action"){
            if(val.key === 'engagementType'){
                obj[`${val.title}`] = `${data.typeOfHR} ${data.h_Availability && `- ${data.h_Availability}`}`
            }if(val.title === "Engagement / HR #"){
              obj[`${val.title}`] = `${data.engagementID}/ ${data.hR_Number} `
            }else{
                obj[`${val.title}`] = data[`${val.key}`]
            } }
        } )
    return obj;
        }
     )
     downloadToExcel(DataToExport,'Talent_Backout_Report.xlsx')

}

  const tableColumnsMemo = [
//     {
//     title: 'Created Date',				
//     dataIndex: 'createdDateTime',
//     key: 'createdDateTime',
//     align: 'left',
//     width:'150px'
// },
{
  title: 'LWD',				
  dataIndex: 'lastWorkingDate',
  key: 'lastWorkingDate',
  align: 'left',
  width: '150px',
},
{
  title: "Month Year",
  dataIndex: "monthYearString",
  key: "monthYearString",
  align: "left",
  width: "150px",
},
{
    title: "Engagement / HR #",		
    dataIndex: 'hR_Number',
    key: 'hR_Number',
    align: 'left',  
    width: '200px',
    render: (text, item) => {
      return (
        <>
          <Link
            to={`/viewOnboardDetails/${item.onBoardID}/${
              item.isOngoing === "Ongoing" ? true : false
            }`}
            target="_blank"
            style={{
              color: `var(--uplers-black)`,
              textDecoration: "underline",
            }}
          >
            {item.engagementID}
          </Link>{" "}
          <br />/{" "}
          <Link
            to={`/allhiringrequest/${item.hrid}`}
            target="_blank"
            style={{ color: "#006699", textDecoration: "underline" }}
          >
            {item.hR_Number}
          </Link>
        </>
      );
    },
},
{
  title: "AM",
  dataIndex: "salesUser",
  key: "salesUser",
  align: "left",
  width: "200px",
},
{
  title: 'Talent',				
  dataIndex: 'talent',
  key: 'talent',
  align: 'left',
  width: '200px',
},
{
  title: "Talent Email",
  dataIndex: "talentEmail",
  key: "talentEmail",
  align: "left",
  width: "250px",
},
{
  title: 'Company',				
  dataIndex: 'company',
  key: 'company',
  align: 'left',
  width: '200px',
},
{
    title: 'Client',				
    dataIndex: 'client',
    key: 'client',
    align: 'left',
    width: '250px',
},
{
  title: "Engagement Type",
  dataIndex: "engagementType",
  key: "engagementType",
  align: "left",
  width: "200px",
},
{
  title: 'Reason',				
  dataIndex: 'rejectedReason',
  key: 'rejectedReason',
  align: 'left',
  width: '250px',
  render:(text, result)=>{
    return <div className={TalentBackoutStyle.ReasonContainer}>{text.length > 100 ? <>{text.substr(0, 99) + '...'} <h4 onClick={()=>{setShowReason(true);setReasonToShow(text)}}>View More</h4></>  : text}   </div>
  }
},
{
  title: "",
  dataIndex: "endEngagementFileName",
  key: "endEngagementFileName",
  align: "left",
  width: "30px",
  render:(text)=>{

    return text ? <Tooltip title={text}><a href={NetworkInfo.NETWORK + `Media/ContractEndDate/${text}`} target="_blank" rel="noreferrer">     <IconContext.Provider
    value={{
      color: "green",
      style: { width: "15px", height: "15px", cursor:'pointer' },
    }}
  > <FaDownload /></IconContext.Provider></a></Tooltip> : ''
  }
},
{
  title: 'Talent Status',				
  dataIndex: 'talentStatus',
  key: 'talentStatus',
  align: 'left',
  width: '200px',
  render: (text, result) => {
    return (
      <div
        className={`${TalentBackoutStyle.ticketStatusChip} ${
          text.includes("Rejected")
            ? TalentBackoutStyle.expireDate
            : text.includes("Hired")
            ? TalentBackoutStyle.Hired
            : ""
        }`}
      >
        <span style={{ cursor: "pointer" }}> {text} </span>
      </div>
    );
  },
},


{
  title: 'HR Status',				
  dataIndex: 'hrStatus',
  key: 'hrStatus',
  align: 'left',
  width: '150px',
  render: (_, param) => {
    return All_Hiring_Request_Utils.GETHRSTATUS(
      param?.hrStatusCode ?? 101,
      param?.hrStatus
    );
  },
},
// {
//   title: 'Download',				
//   dataIndex: 'endEngagementFileName',
//   key: 'endEngagementFileName',
//   align: 'left',
//   width: '200px',
//   render:(text)=>{
//     return <a href={NetworkInfo.NETWORK + `Media/ContractEndDate/${text}`} target="_blank" rel="noreferrer">{text}</a>
//   }
// },
]

  return (
    <div className={TalentBackoutStyle.dealContainer}>
    <div className={TalentBackoutStyle.header}>
      <div className={TalentBackoutStyle.dealLable}>Backout Report</div>
      <LogoLoader visible={isLoading} />
    </div>

    <div className={TalentBackoutStyle.filterContainer}>
        <div className={TalentBackoutStyle.filterSets}>
<div className={TalentBackoutStyle.filterSetsInner}>
                      <div
                        className={TalentBackoutStyle.addFilter}
                        onClick={toggleHRFilter}
                      >
                        <FunnelSVG style={{ width: "16px", height: "16px" }} />

                        <div className={TalentBackoutStyle.filterLabel}>
                          Add Filters
                        </div>
                        <div className={TalentBackoutStyle.filterCount}>
                          {filteredTagLength}
                        </div>
                      </div>

                      <div
                        className={TalentBackoutStyle.searchFilterSet}
                        style={{ marginLeft: "15px" }}
                      >
                        <SearchSVG style={{ width: "16px", height: "16px" }} />
                        <input
                          type={InputType.TEXT}
                          className={TalentBackoutStyle.searchInput}
                          placeholder="Search Table"
                          value={searchText}
                          onChange={(e) => {
                            setSearchText(e.target.value)
                            return setDebouncedSearch(e.target.value.toLowerCase())
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
                              setSearchText('')
                               setDebouncedSearch('')
                            }}
                          />
                        )}
                      </div>
                      <p onClick={() => clearFilters()}>Reset Filters</p>
                    </div>


  <div className={`${TalentBackoutStyle.filterRight}`}>
                      {/* <Radio.Group
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "5px",
                        }}
                        onChange={(e) => {
                          setDateTypeFilter(e.target.value);
                          setStartDate(
                            new Date(
                              date.getFullYear(),
                              date.getMonth() - 1,
                              date.getDate()
                            )
                          );
                          setEndDate(new Date(date));
                        }}
                        value={dateTypeFilter}
                      >
                        <Radio value={0}>Current Month</Radio>
                        <Radio value={1}>Search With Date Range</Radio>
                      </Radio.Group> */}
                      <div className={`${TalentBackoutStyle.modifySelect}`}>
                        <Select
                                              id="selectedValue"
                                              placeholder="Select"
                                              value={dateTypeFilter}
                                              // showSearch={true}
                                              style={{width:'170px'}}
                                              onChange={(value, option) => {
                                                console.log({ value, option });
                                                setDateTypeFilter(value);
                                                        setStartDate(
                                                          new Date(
                                                            date.getFullYear(),
                                                            date.getMonth() - 1,
                                                            date.getDate()
                                                          )
                                                        );
                                                        setEndDate(new Date(date));
                                              }}
                                              options={dateTypeList}
                                              optionFilterProp="value"
                                              // getPopupContainer={(trigger) => trigger.parentElement}
                                            />

                      </div>
                    

                      {dateTypeFilter === 0 && (
                        <div className={TalentBackoutStyle.calendarFilterSet}>
                          <div className={TalentBackoutStyle.label}>
                            Month-Year
                          </div>
                          <div className={TalentBackoutStyle.calendarFilter}>
                            <CalenderSVG
                              style={{ height: "16px", marginRight: "16px" }}
                            />
                            <DatePicker
                              style={{ backgroundColor: "red" }}
                              onKeyDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              className={TalentBackoutStyle.dateFilter}
                              placeholderText="Month - Year"
                              selected={monthDate}
                              onChange={date=>setMonthDate(date)}
                              // startDate={startDate}
                              // endDate={endDate}
                              dateFormat="MM-yyyy"
                              showMonthYearPicker
                            />
                          </div>
                        </div>
                      )}
                      {dateTypeFilter === 1 && (
                        <div className={TalentBackoutStyle.calendarFilterSet}>
                          <div className={TalentBackoutStyle.label}>Date</div>
                          <div className={TalentBackoutStyle.calendarFilter}>
                            <CalenderSVG
                              style={{ height: "16px", marginRight: "16px" }}
                            />
                            <DatePicker
                              style={{ backgroundColor: "red" }}
                              onKeyDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              className={TalentBackoutStyle.dateFilter}
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

                      <div className={TalentBackoutStyle.priorityFilterSet}>
                        <div className={TalentBackoutStyle.priorityFilterSet}>
                          <div className={TalentBackoutStyle.label}>
                            Showing
                          </div>
                          <div className={TalentBackoutStyle.paginationFilter}>
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
                        </div>
                        <div
                          className={TalentBackoutStyle.paginationFilter}
                          style={{ border: "none", width: "auto" }}
                        >
                          <button
                            className={TalentBackoutStyle.btnPrimary}
                            onClick={() =>handleExport(getBackoutDetails)}
                          >
                            Export
                          </button>
                        </div>
                      </div>
                    </div>

          {/* <div className={TalentBackoutStyle.filterRight}>
          <div className={TalentBackoutStyle.searchFilterSet}>
							<SearchSVG style={{ width: '16px', height: '16px' }} />
							<input
								type={InputType.TEXT}
								className={TalentBackoutStyle.searchInput}
								placeholder="Search Table"
								value={searchText}
								onChange={(e) => {
									 setSearchText(e.target.value)
									return setDebouncedSearch(e.target.value.toLowerCase()
										// engagementUtils.engagementListSearch(e, apiData),
									);
								}}
							/>
						</div>
      
            <div className={TalentBackoutStyle.calendarFilterSet}>
              {dateError &&  <p className={TalentBackoutStyle.error}>* Start and End dates can't be same </p>}
              <div className={TalentBackoutStyle.label}>Date</div>
              <div className={TalentBackoutStyle.calendarFilter}>
                <CalenderSVG style={{ height: "16px", marginRight: "16px" }} />
                <DatePicker
                  style={{ backgroundColor: "red" }}
                  onKeyDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className={TalentBackoutStyle.dateFilter}
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
            <button
              type="submit"
              className={TalentBackoutStyle.btnPrimary}
              onClick={() => handleExport(getBackoutDetails)}
            >
              Export
            </button>
          </div> */}
        </div>
      </div>

      <div className={TalentBackoutStyle.tableDetails}>
					{isLoading ? (
						<TableSkeleton />
					) : (
						<WithLoader className="mainLoader">
							<Table
								scroll={{ x:'100vh', y: '100vh' }}
								id="hrListingTable"
								columns={tableColumnsMemo}
								bordered={false}
								dataSource={getBackoutDetails}
								//pagination={false} 
								pagination={{
									onChange: (pageNum, pageSize) => {                    
										setPageIndex(pageNum);
										setPageSize(pageSize);
                    getBackoutData(pageSize , pageNum);
									},
									size: 'small',
									pageSize: pageSize,
									pageSizeOptions: pageSizeOptions,
									total: totalRecords,
									showTotal: (total, range) =>
										`${range[0]}-${range[1]} of ${totalRecords} items`,
									defaultCurrent: pageIndex,
								}}
							/>
						</WithLoader>
					)}
				</div>

        <Modal  width="600px"
        centered
        footer={null}
        className="engagementAddFeedbackModal"
        open={showReason}
        onCancel={() => {setShowReason(false); setReasonToShow('')}} >
          <p>{reasonToShow}</p>
        </Modal>
        
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
                  onRemoveHRFilters={() => onRemoveFilters()}
                  getHTMLFilter={getHTMLFilter}
                  // hrFilterList={allHRConfig.hrFilterListConfig()}
        
                  filtersType={allEngagementConfig.talentBackoutFilterTypeConfig(
                    filtersList && filtersList
                  )}
                  clearFilters={clearFilters}
                />
              </Suspense>
    </div>
  )
}

export default TalentBackoutReport