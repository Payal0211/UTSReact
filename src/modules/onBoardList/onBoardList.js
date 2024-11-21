import { InputType } from 'constants/application';
import onboardList from './onBoard.module.css'
import { ReactComponent as SearchSVG } from 'assets/svg/search.svg';
import { ReactComponent as FunnelSVG } from 'assets/svg/funnel.svg';
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton';
import WithLoader from 'shared/components/loader/loader';
import { Table } from 'antd';
import { useEffect, useMemo, useState, useCallback, Suspense } from 'react';
import { MasterDAO } from 'core/master/masterDAO';
import { HTTPStatusCode } from 'constants/network';
import LogoLoader from 'shared/components/loader/logoLoader';
import { Link, useNavigate } from 'react-router-dom';
import { allEngagementConfig } from 'modules/engagement/screens/engagementList/allEngagementConfig';
import { allHRConfig } from 'modules/hiring request/screens/allHiringRequest/allHR.config';
import { engagementRequestDAO } from 'core/engagement/engagementDAO';
import UTSRoutes from 'constants/routes';
import OnboardFilerList from './OnboardFilterList';

const onBoardListConfig = () => {
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
        title: "Engagement ID",
        dataIndex: "engagemenID",
        key: "engagemenID",
        align: "left",
        width: '180px',
        render:(text,result)=>{
          return  <Link to={`/viewOnboardDetails/${result.id}`} target='_blank'  style={{
            color: `var(--uplers-black)`,
            textDecoration: 'underline',
        }}>{text}</Link>
      }
      },
      // {
      //   title: "HR #",
      //   dataIndex: "hR_Number",
      //   key: "hR_Number",
      //   align: "left",
      // },
      {
        title: "Position",
        dataIndex: "position",
        key: "position",
        align: "left",
        width: '180px',
      },
      {
        title: "Client",
        dataIndex: "client",
        key: "client",
        align: "left",
      },
      {
        title: "Company",
        dataIndex: "company",
        key: "company",
        align: "left",
      },
      {
        title: "Talent",
        dataIndex: "talent",
        key: "talent",
        align: "left",
      },
      {
        title: "NBD",
        dataIndex: "salesPerson",
        key: "salesPerson",
        align: "left",
      },      
      {
        title: "AM",
        dataIndex: "amAssignmentuser",
        key: "amAssignmentuser",
        align: "left",
      },
      {
        title:"TSC Name",
        dataIndex:"tscName",
        key:'tscName',
        align:"left",
      },
      {
        title: "Onboarding Client",
        dataIndex: "onboardingClient",
        key: "onboardingClient",
        align: "left",
      },
      {
        title: "Onboarding Talent",
        dataIndex: "onboardingTalent",
        key: "onboardingTalent",
        align: "left",
      },
      {
        title: "Legal Client",
        dataIndex: "legalClient",
        key: "legalClient",
        align: "left",
      },
      {
        title: "Legal Talent",
        dataIndex: "legalTalent",
        key: "legalTalent",
        align: "left",
      },
      {
        title: "Kick Off",
        dataIndex: "kickOff",
        key: "kickOff",
        align: "left",
      },
      {
        title: "Type Of HR",
        dataIndex: "typeOfHR",
        key: "typeOfHR",
        align: "left",
      },
      {
        title: "Final HR Cost",
        dataIndex: "final_HR_Cost",
        key: "final_HR_Cost",
        align: "left",
      },
      {
        title: "Talent Cost",
        dataIndex: "talent_Cost",
        key: "talent_Cost",
        align: "left",
      },
      {
        title: "NR (%)",
        dataIndex: "nrPercentage",
        key: "nrPercentage",
        align: "left",
      },
      {
        title: "DP Amount",
        dataIndex: "dpAmount",
        key: "dpAmount",
        align: "left",
      },
      {
        title: "DP (%)",
        dataIndex: "dP_Percentage",
        key: "dP_Percentage",
        align: "left",
      },
      {
        title: "Old Talent",
        dataIndex: "oldTalent",
        key: "oldTalent",
        align: "left",
      },
      {
        title: "Replacement Eng",
        dataIndex: "replacementEng",
        key: "replacementEng",
        align: "left",
      },
      {
        title: "Replacement Date",
        dataIndex: "replacementDate",
        key: "replacementDate",
        align: "left",
      },
      // {
      //   title: "Notice Period",
      //   dataIndex: "noticePeriod",
      //   key: "noticePeriod",
      //   align: "left",
      // },
      {
        title: "LastWorking Date",
        dataIndex: "lastWorkingDate",
        key: "lastWorkingDate",
        align: "left",
      },
      {
        title: "Is Lost",
        dataIndex: "isLost",
        key: "isLost",
        align: "left",
      },
      {
        title: "Contract Status",
        dataIndex: "contractStatus",
        key: "contractStatus",
        align: "left",
      },
      {
        title: "Contract Duration",
        dataIndex: "contractDuration",
        key: "contractDuration",
        align: "left",
      },
      {
        title: "Contract StartDate",
        dataIndex: "contractStartDate",
        key: "contractStartDate",
        align: "left",
      },
      {
        title: "Contract EndDate",
        dataIndex: "contractEndDate",
        key: "contractEndDate",
        align: "left",
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
      },
    });

    const tableColumnsMemo = useMemo(
		() =>
        onBoardListConfig(),
		[],
	);

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
            "search" :searchText
        }
      }    
      console.log('payrole',payload)
          getOnBoardListData(payload);
    }, [ tableFilteredState,searchText,pageIndex,pageSize]);

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
      }
      
      setTableFilteredState({
        ...tableFilteredState,
        filterFields_OnBoard: defaultFilters,
      });

      onRemoveHRFilters();
      setSearchText('')
      // setStartDate(new Date());
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
				      <div className={onboardList.hiringRequest}>OnBoard List</div>    
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
                    <div className={onboardList.searchFilterSet}>
                    <SearchSVG style={{ width: '16px', height: '16px' }} />
                    <input
                      type={InputType.TEXT}
                      className={onboardList.searchInput}
                      placeholder="Search Table"
                      onChange={(e) => {
                        setSearchText(e.target.value);									
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={onboardList.tableDetails}>
              {isLoading ? (
                <TableSkeleton />
              ) : (
                <WithLoader className="mainLoader">
                  <Table
                    scroll={{ x: '300vw', y: '100vh' }}
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
							onRemoveHRFilters={()=>{}}
							getHTMLFilter={getHTMLFilter}
							hrFilterList={allHRConfig.hrFilterListConfig()}
							filtersType={allEngagementConfig.engagementFilterTypeConfig(
								filtersList && filtersList,
							)}
							clearFilters={clearFilters}
						/>
					</Suspense>
				)}
        </div>
    )
}
export default OnBoardList;