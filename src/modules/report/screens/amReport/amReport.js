import React, { Suspense, useCallback, useEffect, useState } from 'react';
import amReportStyles from './amReport.module.css';
import { Table, Radio, message } from 'antd';
import { ReportDAO } from 'core/report/reportDAO';
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import { ReactComponent as SearchSVG } from "assets/svg/search.svg";
import { InputType } from "constants/application";
import { ReactComponent as CloseSVG } from "assets/svg/close.svg";
import DatePicker from "react-datepicker";
import moment from 'moment';
import { ReactComponent as FunnelSVG } from "assets/svg/funnel.svg";
import OnboardFilerList from 'modules/onBoardList/OnboardFilterList';
import { allHRConfig } from 'modules/hiring request/screens/allHiringRequest/allHR.config';
import { allEngagementConfig } from 'modules/engagement/screens/engagementList/allEngagementConfig';
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton';
import Diamond from "assets/svg/diamond.svg";

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
      width: 110,
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
      // render: (_, param) =>
      //   All_Hiring_Request_Utils.GETHRSTATUS(
      //     param?.hrStatusCode,
      //     param?.hrStatus
      //   ),
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
      title: <div style={{ textAlign: "center" }}>CTP Link</div>,
      dataIndex: "ctP_Link",
      key: "ctP_Link",
      width: 120,
      render:(text,result)=>{
        if(text === '' || text ==='NA'){
          return ''
        }
        return <div style={{display:'flex', justifyContent:'center'}}><a href={text} style={{textDecoration:'underline'}} target="_blank"  rel="noreferrer" >Link</a></div> 
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
         Probability Ratio  <br />
          this month
        </div>
      ),
      dataIndex: "probabiltyRatio_thismonth",
      key: "probabiltyRatio_thismonth",
      width: 135,
      align: "center",
      // render: (value, record, index) =>
      //   renderDDSelect(
      //     value,
      //     record,
      //     index,
      //     "probabiltyRatio_thismonth",
      //     handleFieldChange
      //   ),
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
      // render: (value, record, index) =>
      //   renderWeekSelect(
      //     value,
      //     record,
      //     index,
      //     "closurebyWeekend",
      //     handleFieldChange
      //   ),
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
      {
      title: (
        <div style={{ textAlign: "center" }}>
           Pushed 
          <br /> Closure Week
        </div>
      ),
      dataIndex: "pushed_Closure_Week",
      key: "pushed_Closure_Week",
      width: 105,
      align: "center",
      className: amReportStyles.headerCell,
      //  render: (value, record, index) =>
      //   renderWeekSelect(
      //     value,
      //     record,
      //     index,
      //     "pushed_Closure_Week",
      //     handleFieldChange
      //   ),
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
      width: 105,
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
      title: (
        <div style={{ textAlign: "center" }}>
          Back Up
        
        </div>
      ),
      dataIndex: "talent_Backup",
      key: "talent_Backup",
      width: 100,
      align: "center",
      className: amReportStyles.headerCell,
        // render: (value, record, index) =>
        // renderYesNoSelect(
        //   value,
        //   record,
        //   index,
        //   "talent_Backup",
        //   handleFieldChange
        // ),
    },
    // {
    //   title: <div style={{ textAlign: "center" }}>Potential</div>,
    //   dataIndex: "potentialType",
    //   key: "potentialType",
    //   width: 100,
    //   align: "center",
    //   render: (value, record, index) =>
    //     renderDDSelect(
    //       value,
    //       record,
    //       index,
    //       "potentialType",
    //       handleFieldChange
    //     ),
    // },
   
    // {
    //   title: (
    //     <div style={{ textAlign: "center" }}>
    //       Talent Pay Rate/ <br />
    //       Client Budget
    //     </div>
    //   ),
    //   dataIndex: "talentPayStr",
    //   key: "talentPayStr",
    //   width: 280,
    //   className: amReportStyles.headerCell,
    // },
   
    // {
    //   title: (
    //     <div style={{ textAlign: "center" }}>
    //       Above 35
    //       <br /> LPA
    //     </div>
    //   ),
    //   dataIndex: "above35LPA",
    //   key: "above35LPA",
    //   width: 100,
    //   align: "center",
    //   className: amReportStyles.headerCell,
    // },
    {
      title: <div style={{ textAlign: "center" }}>Lead</div>,
      dataIndex: "leadType",
      key: "leadType",
      width: 100,
      align: "center",
      className: amReportStyles.headerCell,
    },
    // {
    //   title: <div style={{ textAlign: "center" }}>Next Action <br/> Point</div>,
    //   dataIndex: "nextAction",
    //   key: "nextAction",
    //   width: 100,
    //   align: "center",
    //   className: amReportStyles.headerCell,
    //   render:(text,record)=>{
    //     return  <IconContext.Provider
    //                 value={{
    //                   color: "green",
    //                   style: {
    //                     width: "20px",
    //                     height: "20px",
    //                     marginRight: "5px",
    //                     cursor: "pointer",
    //                   },
    //                 }}
    //               >
    //                 {" "}
    //                 <Tooltip title={`Add/View comment`} placement="top">
    //                   <span
    //                     onClick={() => {
    //                       AddComment(record);
    //                     }}
    //                     // className={taStyles.feedbackLabel}
    //                   >
    //                     {" "}
    //                     <IoMdAddCircle />
    //                   </span>{" "}
    //                 </Tooltip>
    //               </IconContext.Provider>
    //   }
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


const AMReport = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [reportData,setReportData] = useState([]);
     const [isSummeryLoading, setIsSummeryLoading] = useState(false);
    const [summeryReportData,setSummeryReportData] = useState([]);
    const [summeryGroupsNames,setSummeryGroupsName] = useState([]);
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

    const [filtersList, setFiltersList] = useState([]);

    useEffect(() => {
      getAMReportFilter();
    }, [])
    
      
    useEffect(() => {
        getAMReportData();
    }, [openTicketDebounceText,monthDate,tableFilteredState]);

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
            "searchText": openTicketDebounceText,
            "month":monthDate? +moment(monthDate).format("M") : 0,
            "year":monthDate ? +moment(monthDate).format("YYYY") : 0,            
            // "amUserIDs": tableFilteredState?.filterFields_OnBoard?.text,
            'hrType':tableFilteredState?.filterFields_OnBoard?.EngType,
             'hrStatus':"",
            'salesRep':tableFilteredState?.filterFields_OnBoard?.text ?? '',  
            'leadType':'',
            hr_BusinessType:'G'    
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

    const getAMSummary = async ()=>{
      let pl  = {
        hr_BusinessType:'G',
        "month":monthDate? +moment(monthDate).format("M") : 0,
          "year":monthDate ? +moment(monthDate).format("YYYY") : 0,     
      }

        setIsSummeryLoading(true);
        const apiResult = await ReportDAO.getAMSummeryReportDAO(pl);
        setIsSummeryLoading(false);
        if (apiResult?.statusCode === 200) {
            setSummeryReportData(apiResult.responseBody);
            let groups = [] 
            apiResult.responseBody.forEach(element => {
              if(!groups.includes(element.groupName)){
                 groups.push(element.groupName)
              }
            });
            setSummeryGroupsName(groups)
        } else if (apiResult?.statusCode === 404) {
            setSummeryReportData([]);
        }
    }

    useEffect(()=>{
      getAMSummary()
    },[monthDate])

    const toggleHRFilter = useCallback(() => {
      !getHTMLFilter
        ? setIsAllowFilters(!isAllowFilters)
        : setTimeout(() => {
            setIsAllowFilters(!isAllowFilters);
          }, 300);
      setHTMLFilter(!getHTMLFilter);
    }, [getHTMLFilter, isAllowFilters]);


    const clearFilters = () =>{
      setAppliedFilters(new Map());
      setCheckedState(new Map());
      setFilteredTagLength(0);     
      setopenTicketDebounceText("");
      setMonthDate(new Date())
      setTableFilteredState({
        filterFields_OnBoard: {
          text: null,
        },
      })      
    }

    const onRemoveHRFilters = () => {
      setTimeout(() => {
        setIsAllowFilters(false);
      }, 300);
      setHTMLFilter(false);
    };

    const gN = (name)=>{
      switch(name){
        case '1_AM_Recurring': return 'AM Recurring';
         case '1_NBD_Recurring': return 'NBD Recurring';
          case '2_AM_DP': return 'AM One Time';
           case '2_NBD_DP': return 'NBD One Time';
        default: return ''
      }
    }

  return (
    <div className={amReportStyles.container}>
      {/* <h1 className={amReportStyles.title}>Pipeline to bring closures from</h1> */}
    <h1 className={amReportStyles.title}>AM Potential Closures List </h1>
        <div className={amReportStyles.filterContainer}>
                <div className={amReportStyles.filterSets}>                                                
                        
                 <div style={{display:"flex",justifyContent:'space-between'}}>

                        <div className={amReportStyles.filterSetsInner}>                     
                          <div className={amReportStyles.addFilter} onClick={toggleHRFilter}>
                            <FunnelSVG style={{ width: "16px", height: "16px" }} />
                            <div className={amReportStyles.filterLabel}> Add Filters</div>
                            <div className={amReportStyles.filterCount}>{filteredTagLength}</div>
                          </div>                           

                        

                          <div className={amReportStyles.searchFilterSet} style={{marginLeft:'5px'}}>
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
                            
                          <div className={amReportStyles.filterRight} style={{display:'flex'}} >
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
                                        style={{display:'flex',alignItems:'center'}}
                                        value={tableFilteredState?.filterFields_OnBoard?.EngType}
                                      >
                                        <Radio value={""}>All</Radio>
                                        <Radio value={"Contract"}>Contract</Radio>
                                        <Radio value={"DP"}>DP</Radio>
                                      </Radio.Group>                 
                            <div style={{display:'flex',justifyContent:'space-evenly',alignItems:'center',gap:'8px'}}> 
                                <div>
                                Month-Year
                                </div>
                                <div className={amReportStyles.calendarFilter}> 
                                <CalenderSVG style={{ height: "16px", marginRight: "16px" }} />
                                <DatePicker
                                  style={{ backgroundColor: "red" }}
                                  onKeyDown={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                  }}
                                  className={amReportStyles.dateFilter}
                                  placeholderText="Month - Year"
                                  selected={monthDate}
                                  onChange={date=>setMonthDate(date)}
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
                    {summeryGroupsNames.map(gName=>{
                      let data = summeryReportData.filter(item=> item.groupName === gName)
                      return <div className={amReportStyles.cardcontainer}>
                              <h3 className={amReportStyles.recruitername}>{gN(gName)}</h3>
                         <table className={amReportStyles.stagetable}>
                                            <thead>
                                                <tr>
                                                <th>Stage</th>
                                                 <th>Sappy</th>
                                                  <th>Nikita</th>
                                                   <th>Nandini</th>
                                                    <th>Gayatri</th>
                                                     <th>Deepsikha</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                               {data.map(val=> <tr key={gName}
                                                //  className={getStageClass(stage.profileStatusID)}
                                                 >
                                                    <td>{val.stage}</td>
                                                    <td>{val.sappy_str}</td>
                                                     <td>{val.nikita_str}</td>
                                                      <td>{val.nandni_str}</td>
                                                       <td>{val.gayatri_str}</td>
                                                        <td>{val.deepshikha_str}</td>
                                                </tr>)} 
                                               
                                             
                                            </tbody>
                                            </table>
                      </div>
                    })}
                  </div>

              {isLoading ? <TableSkeleton /> :
                    <Table
                      scroll={{ x: "1600px" , y: "100vh" }}
                      id="amReportList"
                      columns={columns}
                      bordered={false}
                      dataSource={reportData}   
                      rowKey={(record, index) => index}
                      rowClassName={(row, index) => {
                        return row?.clientName === 'TOTAL' ? amReportStyles.highlighttotalrow : '';
                      }}  
                      pagination={false}
                      // pagination={{                       
                      //   size: "small",
                      //   pageSize: 15                       
                      // }}  
                  />
                  }

            


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
    </div>
  );
};

export default AMReport;