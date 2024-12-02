import { InputType } from 'constants/application';
import onboardList from './onBoard.module.css'
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import { ReactComponent as SearchSVG } from 'assets/svg/search.svg';
import { ReactComponent as FunnelSVG } from 'assets/svg/funnel.svg';
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton';
import WithLoader from 'shared/components/loader/loader';
import { Table, Radio, Modal, message } from 'antd';
import { useEffect, useMemo, useState, useCallback, Suspense } from 'react';
import { MasterDAO } from 'core/master/masterDAO';
import { HTTPStatusCode } from 'constants/network';
import LogoLoader from 'shared/components/loader/logoLoader';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link, useNavigate } from 'react-router-dom';
import { allEngagementConfig } from 'modules/engagement/screens/engagementList/allEngagementConfig';
import { allHRConfig } from 'modules/hiring request/screens/allHiringRequest/allHR.config';
import { engagementRequestDAO } from 'core/engagement/engagementDAO';
import UTSRoutes from 'constants/routes';
import OnboardFilerList from './OnboardFilterList';
import Handshake from 'assets/svg/handshake.svg';
import Rocket from 'assets/svg/rocket.svg';
import FeedBack from 'assets/svg/feedbackReceived.png';
import RenewEng from 'assets/svg/renewEng.png'
import LostEng from 'assets/svg/lostEng.png'
import Smile from 'assets/svg/smile.svg';
import Sad from 'assets/svg/sademo.svg';
import Briefcase from 'assets/svg/briefcase.svg';
import { downloadToExcel } from 'modules/report/reportUtils';
import { engagementUtils } from 'modules/engagement/screens/engagementList/engagementUtils';
import EngagementFeedback from 'modules/engagement/screens/engagementFeedback/engagementFeedback';
import EngagementAddFeedback from 'modules/engagement/screens/engagementAddFeedback/engagementAddFeedback';
import { useForm } from 'react-hook-form';

const onBoardListConfig = (getEngagementModal, setEngagementModal,setFeedBackData,setHRAndEngagementId) => {
    return [     
      {
        title: "Created Date",
        dataIndex: "createdByDatetime",
        key: "createdByDatetime",
        align: "left",  
        width: '150px',          
        render:(text)=>{
            let dateArr = text.split(" ")
            return dateArr[0]
        }
      },
      {
        title: "Eng. Count",
        dataIndex: "engagementCount",
        key: "engagementCount",
        align: "left",
        width: '95px',
        },
      {
        title: "Eng. ID/HR#",
        dataIndex: "engagemenID",
        key: "engagemenID",
        align: "left",
        width: '200px',
        render:(text,result)=>{
          return <>
          <Link to={`/viewOnboardDetails/${result.id}/${result.isOngoing === "Ongoing" ? true : false }`} target='_blank'  style={{
            color: `var(--uplers-black)`,
            textDecoration: 'underline',
        }}> {result?.engagemenID.slice(
          0,
          result?.engagemenID?.indexOf('/'),
        )}</Link><br/>
         
						<Link
							to={`/allhiringrequest/${result?.hiringId}`}
							target='_blank'
							style={{ color: '#006699', textDecoration: 'underline' }}>
							{result?.engagemenID.slice(
								result?.engagemenID?.indexOf('/'),
							)}
						</Link>
          
          </> 
      }
      },
      {
        title: "Eng. Type",
        dataIndex: "typeOfHR",
        key: "typeOfHR",
        align: "left",
        width: '180px',
      },
      {
        title: "Job Title",
        dataIndex: "position",
        key: "position",
        align: "left",
        width: '180px',
      },
      {
        title: "Talent",
        dataIndex: "talent",
        key: "talent",
        align: "left",
        width: '200px',
      },
      {
        title: "Company",
        dataIndex: "company",
        key: "company",
        align: "left",
        width: '200px', 
      },
      {
        title: "Client",
        dataIndex: "client",
        key: "client",
        align: "left",
        width: '200px',
      },
      {
        title: "AM",
        dataIndex: "amAssignmentuser",
        key: "amAssignmentuser",
        align: "left",
        width: '150px', 
      },
      {
        title: "Eng. Status",
        dataIndex: "contractStatus",
        key: "contractStatus",
        align: "left",
        width: '150px',
      },
      {
        title: "Joining Date",
        dataIndex: "joiningdate",
        key: "joiningdate",
        align: "left",
        width: '200px', 
      },
      {
        title: "Start Date",
        dataIndex: "contractStartDate",
        key: "contractStartDate",
        align: "left",
        width: '150px', 
      },
      {
        title: "End Date",
        dataIndex: "contractEndDate",
        key: "contractEndDate",
        align: "left",
        width: '150px', 
      },
      {
        title: "Last Working Date",
        dataIndex: "lastWorkingDate",
        key: "lastWorkingDate",
        align: "left",
        width: '200px',
      },
      {
        title: "Actual BR",
        dataIndex: "final_HR_Cost",
        key: "final_HR_Cost",
        align: "left",
        width: '150px', 
        render:(text,result)=>{
          return   `${text} ${result.currencySign}`
        }
      },
      {
        title: "Actual PR",
        dataIndex: "talent_Cost",
        key: "talent_Cost",
        align: "left",
        width: '150px', 
        render:(text,result)=>{
          return   `${text} ${result.currencySign}`
        }
      },
      {
        title: "Uplers Fees",
        dataIndex: "",
        key: "",
        align: "left",
        width: '150px', 
        render:(_,result)=>{
          return (+result.final_HR_Cost - +result.talent_Cost).toFixed(2) + ` ${result.currencySign}`
        }
      },
      {
        title: "NR / DP (%)",
        dataIndex: "nrPercentage",
        key: "nrPercentage",
        align: "left",
        width: '150px', 
        render:(text,result)=>{
          return `${result.nrPercentage !== 0 ? result.nrPercentage : ''}  ${+result.dP_Percentage !== 0 ? result.dP_Percentage : ''}`
        }
      },
      // {
      //   title: "HR #",
      //   dataIndex: "hR_Number",
      //   key: "hR_Number",
      //   align: "left",
      // },
      // {
      //   title: "NBD",
      //   dataIndex: "salesPerson",
      //   key: "salesPerson",
      //   align: "left",
      // },      
     
      // {
      //   title:"TSC Name",
      //   dataIndex:"tscName",
      //   key:'tscName',
      //   align:"left",
      // },
      // {
      //   title: "Onboarding Client",
      //   dataIndex: "onboardingClient",
      //   key: "onboardingClient",
      //   align: "left",
      //   width: '200px',
      // },
      // {
      //   title: "Onboarding Talent",
      //   dataIndex: "onboardingTalent",
      //   key: "onboardingTalent",
      //   align: "left",
      //   width: '200px',
      // },
      // {
      //   title: "Legal Client",
      //   dataIndex: "legalClient",
      //   key: "legalClient",
      //   align: "left",
      // },
      // {
      //   title: "Legal Talent",
      //   dataIndex: "legalTalent",
      //   key: "legalTalent",
      //   align: "left",
      // },
      // {
      //   title: "Kick Off",
      //   dataIndex: "kickOff",
      //   key: "kickOff",
      //   align: "left",
      // },
      // {
      //   title: "Type Of HR",
      //   dataIndex: "typeOfHR",
      //   key: "typeOfHR",
      //   align: "left",
      // },
      // {
      //   title: "Final HR Cost",
      //   dataIndex: "final_HR_Cost",
      //   key: "final_HR_Cost",
      //   align: "left",
      // },
      // {
      //   title: "Talent Cost",
      //   dataIndex: "talent_Cost",
      //   key: "talent_Cost",
      //   align: "left",
      // },
      // {
      //   title: "NR (%)",
      //   dataIndex: "nrPercentage",
      //   key: "nrPercentage",
      //   align: "left",
      // },
      // {
      //   title: "DP Amount",
      //   dataIndex: "dpAmount",
      //   key: "dpAmount",
      //   align: "left",
      // },
      // {
      //   title: "DP (%)",
      //   dataIndex: "dP_Percentage",
      //   key: "dP_Percentage",
      //   align: "left",
      // },
      // {
      //   title: "Old Talent",
      //   dataIndex: "oldTalent",
      //   key: "oldTalent",
      //   align: "left",
      // },
      // {
      //   title: "Replacement Eng",
      //   dataIndex: "replacementEng",
      //   key: "replacementEng",
      //   align: "left",
      // },
      // {
      //   title: "Replacement Date",
      //   dataIndex: "replacementDate",
      //   key: "replacementDate",
      //   align: "left",
      // },
      // {
      //   title: "Notice Period",
      //   dataIndex: "noticePeriod",
      //   key: "noticePeriod",
      //   align: "left",
      // },
      // {
      //   title: "LastWorking Date",
      //   dataIndex: "lastWorkingDate",
      //   key: "lastWorkingDate",
      //   align: "left",
      // },
      // {
      //   title: "Is Lost",
      //   dataIndex: "isLost",
      //   key: "isLost",
      //   align: "left",
      // },
      // {
      //   title: "Contract Duration",
      //   dataIndex: "contractDuration",
      //   key: "contractDuration",
      //   align: "left",
      //   width: '150px',
      // },
      // {
      //   title: "Last Feedback Date",
      //   dataIndex: "lastFeedbackDate",
      //   key: "lastFeedbackDate",
      //   align: "left",
      //   width: '200px',
      // },
      // {
      //   title: "Feedback Type",
      //   dataIndex: "feedbackType",
      //   key: "feedbackType",
      //   align: "left",
      //   width: '150px',
      // },

      {
				title: (<>Client Feedback <br />Last Feedback Date</>),
				dataIndex: 'clientFeedback',
				key: 'clientFeedback',
				align: 'left',
				width: '200px',
				render: (text, result) =>
					result?.clientFeedback === 0 && result?.id && result?.hiringId ? (
						<div style={{display:"flex",flexDirection:"column"}}>
						<a href="javascript:void(0);"
							style={{
								color: engagementUtils.getClientFeedbackColor(
									result?.feedbackType,
								),
								textDecoration: 'underline',
								display: 'inline-flex',
								width: 'max-content',
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
							}}>
							{'Add'} 
						</a>
						 {result?.lastFeedbackDate}
						 </div>
					) : (
						<div style={{display:"flex",flexDirection:"column"}}>
							<a href="javascript:void(0);"
								style={{
									color: engagementUtils.getClientFeedbackColor(
										result?.feedbackType,
									),
									textDecoration: 'underline',
									display: 'inline-flex',
									width: 'max-content',
								}}
								onClick={() => {
									setFeedBackData((prev) => ({
										...prev,
										onBoardId: result?.id
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
								}}>
								{'View/Add'}  
							</a>
							{result?.lastFeedbackDate}
						</div>
					),
			},	
    ];
}

function OnBoardList() { 
    const navigate = useNavigate();
    const [onBoardListData,setOnBoardListData] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);
	  const [pageSize, setPageSize] = useState(100);
    const pageSizeOptions = [100, 200, 300, 500, 1000,5000];
    const [totalRecords, setTotalRecords] = useState(0);
    const [searchText,setSearchText] = useState('');

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
        clientFeedback: '',
        typeOfHiring: '',
        currentStatus: '',
        tscName: '',
        company: '',
        geo: '',
        position: '',
        engagementTenure: 0,
        nbdName: '',
        amName: '',
        pending: '',
        searchMonth: new Date().getMonth() + 1,
        searchYear: new Date().getFullYear(),
        searchType: '',
        islost: '',
        EngType:'A',
        toDate:'',
        fromDate:'',
        EngagementOption:'All'
      },
    });
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState(null);

    const [getEngagementModal, setEngagementModal] = useState({
      engagementFeedback: false,
      engagementAddFeedback: false,
    });
    const [getFeedbackFormContent, setFeedbackFormContent] = useState({});
    const [feedBackData, setFeedBackData] = useState({
      totalRecords: 10,
      pagenumber: 1,
      onBoardId: '',
    });
    const [getHRAndEngagementId, setHRAndEngagementId] = useState({
      hrNumber: '',
      engagementID: '',
      talentName: '',
      onBoardId: '',
      hrId: '',
    });

    const [getClientFeedbackList, setClientFeedbackList] = useState([]);
    const [getFeedbackPagination, setFeedbackPagination] = useState({
      totalRecords: 0,
      pageIndex: 1,
      pageSize: 10,
    });
    const [feedBackSave, setFeedbackSave] = useState(false);
    const [feedBackTypeEdit, setFeedbackTypeEdit] = useState('Please select');
    const [dateTypeFilter , setDateTypeFilter] = useState(0)

    const tableColumnsMemo = useMemo(
		() =>
        onBoardListConfig(getEngagementModal, setEngagementModal,setFeedBackData,setHRAndEngagementId),
		[],
	  );

    const feedbackTableColumnsMemo = useMemo(
      () => allEngagementConfig.clientFeedbackTypeConfig(),
      [],
    );

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
        let result= await MasterDAO.getOnBoardListDAO(data)
        if(result.statusCode === HTTPStatusCode.OK){
            setTotalRecords(result?.responseBody?.details.totalrows);
            setLoading(false);
            setOnBoardListData(result?.responseBody?.details);
        }
        if(result.statusCode === HTTPStatusCode.NOT_FOUND){
            setLoading(false);
            setTotalRecords(0);
            setOnBoardListData([]);
        }
        setLoading(false)
    }   


    const getFeedbackList = async (feedBackData) => {
      setLoading(true);
      const response = await engagementRequestDAO.getFeedbackListDAO(
        feedBackData,
      );
      if (response?.statusCode === HTTPStatusCode.OK) {
        setClientFeedbackList(
          engagementUtils.modifyEngagementFeedbackData(response && response),
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
        return 'NO DATA FOUND';
      }
    };

    const getFeedbackFormDetails = async (getHRAndEngagementId) => {
      setFeedbackFormContent({});
      const response = await engagementRequestDAO.getFeedbackFormContentDAO(
        getHRAndEngagementId,
      );
      if (response?.statusCode === HTTPStatusCode.OK) {
        setFeedbackFormContent(response?.responseBody?.details);
      } else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
        return navigate(UTSRoutes.LOGINROUTE);
      } else if (response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
        setLoading(false);
        return navigate(UTSRoutes.SOMETHINGWENTWRONG);
      } else {
        return 'NO DATA FOUND';
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
          filterFields_OnBoard: {...tableFilteredState.filterFields_OnBoard ,
            fromDate: new Date(start).toLocaleDateString("en-US"),
          toDate: new Date(end).toLocaleDateString("en-US"),
          },
        });

    };
  }

  const handleExport = (apiData) => {
		let DataToExport =  apiData.map(data => {
			let obj = {}
			tableColumnsMemo.forEach((val,ind) => {if(val.key !== "action"){
        if(ind +1 !== tableColumnsMemo.length){
          	if(val.key === 'engagementType'){
					obj[`${val.title}`] = `${data.typeOfHR} ${data.h_Availability && `- ${data.h_Availability}`}`
				}else if(val.title === 'Uplers Fees'){
          obj[`${val.title}`] = (+data.final_HR_Cost - +data.talent_Cost).toFixed(2) + ` ${data.currencySign}`
        }else if(val.title === 'Actual PR' || val.title === 'Actual BR'){
          obj[`${val.title}`] = `${data[`${val.key}`]} ${data.currencySign}`
        }
        else{
					obj[`${val.title}`] = data[`${val.key}`]
				}
        }
			 }
			} )
		return obj;
			}
		 )
		 downloadToExcel(DataToExport,'Engagement Report')

	}

    const getEngagementFilterList = useCallback(async () => {
      setLoading(true); 
      const response = await engagementRequestDAO.getEngagementFilterListDAO();
      if (response?.statusCode === HTTPStatusCode.OK) {
        setLoading(false);
        setFiltersList(response && response?.responseBody?.details);
      } else if (response?.statusCode === HTTPStatusCode.UNAUTHORIZED) {
        setLoading(false);
        return navigate(UTSRoutes.LOGINROUTE);
      } else if (response?.statusCode === HTTPStatusCode.INTERNAL_SERVER_ERROR) {
        setLoading(false);
        return navigate(UTSRoutes.SOMETHINGWENTWRONG);
      } else {
        return 'NO DATA FOUND';
      }
    }, [navigate]);
  
    useEffect(()=>{
      getEngagementFilterList();
    },[getEngagementFilterList])

    useEffect(() => {
      let payload ={
        "pagenumber": pageIndex,
        "totalrecord": pageSize,
        "filterFields_OnBoard":{
          ...tableFilteredState.filterFields_OnBoard,
            "search" :searchText,
            toDate: dateTypeFilter === 1 ? tableFilteredState.filterFields_OnBoard?.toDate :'',
            fromDate:dateTypeFilter === 1 ? tableFilteredState.filterFields_OnBoard?.fromDate :'',
            searchMonth: dateTypeFilter === 0 ? new Date().getMonth() + 1 : 0,
            searchYear: dateTypeFilter === 0 ? new Date().getFullYear() : 0,
        }
      }    
          getOnBoardListData(payload);
    }, [ tableFilteredState,searchText,pageIndex,pageSize,dateTypeFilter]);

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
  
      const defaultFilters ={		
        clientFeedback: '',
        typeOfHiring: '',
        currentStatus: '',
        tscName: '',
        company: '',
        geo: '',
        position: '',
        engagementTenure: 0,
        nbdName: '',
        amName: '',
        pending: '',
        searchMonth: new Date().getMonth() +1,
        searchYear: new Date().getFullYear(),
        searchType: '',
        islost: '',
        EngType:'A',
        toDate:'',
        fromDate:'',
        EngagementOption:'All'
      }
      setDateTypeFilter(0)
      setTableFilteredState({
        ...tableFilteredState,
        filterFields_OnBoard: defaultFilters,
      });

      onRemoveHRFilters();
      setSearchText('')
      setStartDate();
      setEndDate();
    }, [
      setAppliedFilters,
      setCheckedState,
      setFilteredTagLength,
      setTableFilteredState,
      tableFilteredState,
    ]);

    return(
      <div className={onboardList.hiringRequestContainer}>
          {/* <WithLoader className="pageMainLoader" showLoader={searchText?.length?false:isLoading}> */}
            <div className={onboardList.addnewHR}>
				      <div className={onboardList.hiringRequest}>Engagement Report</div>    
              <LogoLoader visible={isLoading} />           
            </div>
            <div className={onboardList.filterContainer}>
              <div className={onboardList.filterSets}>
              <div className={onboardList.filterSetsInner} >
                  <div
                    className={onboardList.addFilter}
                    onClick={toggleHRFilter}>
                    <FunnelSVG style={{ width: '16px', height: '16px' }} />

                    <div className={onboardList.filterLabel}>Add Filters</div>
                    <div className={onboardList.filterCount}>
                      {filteredTagLength}
                    </div>
                  </div>
                  <p onClick={()=> clearFilters() }>Reset Filters</p>
                </div>
                <div className={onboardList.filterRight}>		
      <div className={onboardList.dateTypeFilters}>
                    <Radio.Group                 
                      onChange={(e) => {
                       setDateTypeFilter(e.target.value)
                       setStartDate();
                       setEndDate();
                        setTableFilteredState({
                          ...tableFilteredState,
                          searchText: searchText,
                          filterFields_OnBoard: {...tableFilteredState.filterFields_OnBoard ,
                            fromDate: '',
                          toDate: '',
                          },
                        })
                 
                        
                      }}
                      value={dateTypeFilter}
                    >
                      <Radio value={0}>Current Month</Radio>
                      <Radio value={1}>Search With Date Range</Radio>
                    </Radio.Group>  




                    <Radio.Group                 
                      onChange={(e) => {
                        if(e.target.value === 'D'){
                          if(!startDate){
                            return message.error('Please select Month-Year' )
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
      </div>
                     
                    
                    <div className={onboardList.searchFilterSet}>
                    <SearchSVG style={{ width: '16px', height: '16px' }} />
                    <input
                      type={InputType.TEXT}
                      className={onboardList.searchInput}
                      placeholder="Search Table"
                      value={searchText}
                      onChange={(e) => {
                        setSearchText(e.target.value);									
                      }}
                    />
                  </div>

                    {dateTypeFilter === 1 && 
                    
                    <div className={onboardList.calendarFilterSet}>
							<div className={onboardList.label}>Date</div>
              <div className={onboardList.dateTypeFilters}>
							<div className={onboardList.calendarFilter}>
								<CalenderSVG style={{ height: '16px', marginRight: '16px' }} />
								<DatePicker
									style={{ backgroundColor: 'red' }}
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
                  <Radio.Group                 
                      onChange={(e) => {
                        if(e.target.value === 'D'){
                          if(!startDate){
                            return message.error('Please select Month-Year' )
                          }
                        }
                        setTableFilteredState(prev=> ({...prev,filterFields_OnBoard:{...prev.filterFields_OnBoard,EngagementOption:e.target.value} }))
                        //  setEngagementType(e.target.value);
                        
                      }}
                      value={tableFilteredState?.filterFields_OnBoard?.EngagementOption}
                    >
                      <Radio value={'All'}>All</Radio>
                      <Radio value={'Active'}>Active</Radio>
                      <Radio value={'Closed'}>Closed</Radio>
                    </Radio.Group>
              </div>
						</div>
          }
                 

						<div className={onboardList.priorityFilterSet}>
							{/* <div className={onboardList.label}>Showing</div> */}
							<div className={onboardList.paginationFilter} style={{border: 'none', width: 'auto'}}>
							<button
								className={onboardList.btnPrimary}
								
								onClick={() => handleExport(onBoardListData)}>
								Export
							</button>
				
							</div>
						</div>
                </div>
              </div>
            </div>
                     
            <div className={onboardList.filterContainer}>
                <div
                  className={`${onboardList.filterSets} ${onboardList.filterDescription}`}>
                     {(tableFilteredState?.filterFields_OnBoard?.EngType !== 'D' ) && <>
                        <div className={onboardList.filterType}>
                          <img
                            src={Handshake}
                            alt="handshaker"
                          />
                          <h2>
                            Active Contract Eng. :{' '}
                            <span>
                              {onBoardListData[0]?.s_TotalActiveEng
                                ? onBoardListData[0]?.s_TotalActiveEng
                                : 0}
                            </span>
                          </h2>
                        </div>
                        <div className={onboardList.filterType}>
                          <img
                            src={LostEng}
                            alt="sad"
                          />
                          <h2>
                            Lost Contract Eng. :{' '}
                            <span>
                              {onBoardListData[0]?.s_TotalLostEng
                                ? onBoardListData[0]?.s_TotalLostEng
                                : 0}
                            </span>
                          </h2>
                        </div>
                     </>}

                     {(tableFilteredState?.filterFields_OnBoard?.EngType !== 'D' ) &&
                  <div className={onboardList.filterType}>
                    <img
                      src={Briefcase}
                      alt="briefcase"
                    />
                    <h2>
                      Average NR% :{' '}
                      <span>{onBoardListData[0]?.s_AvgNR? onBoardListData[0]?.s_AvgNR: 0}</span>
                    </h2>
                  </div>}

                  {(tableFilteredState?.filterFields_OnBoard?.EngType !== 'D' ) && <div className={onboardList.filterType}>
                    <img
                      src={RenewEng}
                      alt="Smile"
                    />
                    <h2>
                      Renew Eng. :{' '}
                      <span>{onBoardListData[0]?.s_TotalRenewEng ? onBoardListData[0]?.s_TotalRenewEng : 0}</span>
                    </h2>
                  </div>} 
               
                  {(tableFilteredState?.filterFields_OnBoard?.EngType !== 'C' ) &&
                  <div className={onboardList.filterType}>
                    <img
                      src={Briefcase}
                      alt="briefcase"
                    />
                    <h2>
                      Active DP Eng. :{' '}
                      <span>{onBoardListData[0]?.s_TotalDPActiveEng ? onBoardListData[0]?.s_TotalDPActiveEng : 0}</span>
                    </h2>
                  </div>}
                  {(tableFilteredState?.filterFields_OnBoard?.EngType !== 'C' ) &&
                  <div className={onboardList.filterType}>
                    <img
                      src={LostEng}
                      alt="sad"
                    />
                    <h2>
                      Lost DP Eng. :{' '}
                      <span>{onBoardListData[0]?.s_TotalDPLostEng ? onBoardListData[0]?.s_TotalDPLostEng : 0}</span>
                    </h2>
                  </div>}
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
                
                  {(tableFilteredState?.filterFields_OnBoard?.EngType !== 'C' ) &&
                  <div className={onboardList.filterType}>
                    <img
                      src={Briefcase}
                      alt="briefcase"
                    />
                    <h2>
                      Average DP% :{' '}
                      <span>{onBoardListData[0]?.s_AvgDP ? onBoardListData[0]?.s_AvgDP : 0}</span>
                    </h2>
                  </div>}

                  <div className={onboardList.filterType}>
                    <img
                      src={FeedBack}
                      alt="rocket"
                    />
                    <h2>
                      Feedback Received  :{' '}
                      <span>{onBoardListData[0]?.s_TotalFeedbackReceived ? onBoardListData[0]?.s_TotalFeedbackReceived : 0}</span>
                    </h2>
                  </div>
                </div>
            </div>
            
            <div className={onboardList.tableDetails}>
              {isLoading ? (
                <TableSkeleton />
              ) : (
                <WithLoader className="mainLoader">
                  <Table
                    scroll={{  y: '100vh' }}
                    id="hrListingTable"
                    columns={tableColumnsMemo}
                    bordered={false}
                    dataSource={onBoardListData}
                    // pagination={false}
                    pagination={
                      {
                        // onChange: (pageNum, pageSize) => {
                        //     setPageIndex(pageNum);
                        //     setPageSize(pageSize);
                        // },
                        size: 'small',
                        // pageSize: pageSize,
                        // pageSizeOptions: pageSizeOptions,
                        total: totalRecords,
                        // showTotal: (total, range) =>
                        //     `${range[0]}-${range[1]} of ${totalRecords} items`,
                        // defaultCurrent: pageIndex,
                      }
                    }
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
							onRemoveHRFilters={()=>onRemoveHRFilters()}
							getHTMLFilter={getHTMLFilter}
							hrFilterList={allHRConfig.hrFilterListConfig()}
							filtersType={allEngagementConfig.onboardListFilterTypeConfig(
								filtersList && filtersList,
							)}
							clearFilters={clearFilters}
						/>
					</Suspense>
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
						}>
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
						onCancel={() =>{
              setEngagementModal({
                ...getEngagementModal,
                engagementAddFeedback: false,
              })
              reset()
            }
						}>
						<EngagementAddFeedback
							getFeedbackFormContent={getFeedbackFormContent}
							getHRAndEngagementId={getHRAndEngagementId}
							onCancel={() =>{
								setEngagementModal({
									...getEngagementModal,
									engagementAddFeedback: false,
								})
                reset()
              }
							}
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
        </div>
    )
}
export default OnBoardList;