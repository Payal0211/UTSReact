import { InputType } from 'constants/application';
import onboardList from './onBoard.module.css'
import { ReactComponent as SearchSVG } from 'assets/svg/search.svg';
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton';
import WithLoader from 'shared/components/loader/loader';
import { Table } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { MasterDAO } from 'core/master/masterDAO';
import { HTTPStatusCode } from 'constants/network';

const onBoardListConfig = () => {
    return [     
      {
        title: "Created Date",
        dataIndex: "createdByDatetime",
        key: "createdByDatetime",
        align: "left",  
        width: '120px',          
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
      {
        title: "Notice Period",
        dataIndex: "noticePeriod",
        key: "noticePeriod",
        align: "left",
      },
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

    const [onBoardListData,setOnBoardListData] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);
	  const [pageSize, setPageSize] = useState(100);
    const pageSizeOptions = [100, 200, 300, 500, 1000,5000];
    const [totalRecords, setTotalRecords] = useState(0);
    const [searchText,setSearchText] = useState('');

    const tableColumnsMemo = useMemo(
		() =>
        onBoardListConfig(),
		[],
	);

    useEffect(() => {
    let payload ={
			"pagenumber": pageIndex,
			"totalrecord": pageSize,
            "filterFields_OnBoard":{
                "search" :searchText
            }
		}    
        getOnBoardListData(payload);
    },[searchText]);

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

    return(
        <div className={onboardList.hiringRequestContainer}>
            <div className={onboardList.addnewHR}>
				<div className={onboardList.hiringRequest}>OnBoard List</div>               
            </div>

            <div className={onboardList.filterContainer}>
				<div className={onboardList.filterSets}>
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

        </div>
    )
}
export default OnBoardList;