import React , { useEffect, useState } from 'react'
import TalentBackoutStyle from "./talentBackoutReport.module.css";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { InputType } from 'constants/application';
import { ReactComponent as SearchSVG } from 'assets/svg/search.svg';
import { ReportDAO } from 'core/report/reportDAO';
import { HTTPStatusCode } from 'constants/network';
import WithLoader from 'shared/components/loader/loader';
import TableSkeleton from 'shared/components/tableSkeleton/tableSkeleton';
import { Table } from 'antd';
import { downloadToExcel } from 'modules/report/reportUtils';
import LogoLoader from 'shared/components/loader/logoLoader';

function TalentBackoutReport() {
    const [getBackoutDetails,setTalentBackoutDetails] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const [ searchText , setSearchText] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageSize, setPageSize] = useState(10);    
	const [pageIndex, setPageIndex] = useState(1);
    const pageSizeOptions = [100, 200, 300, 500, 1000,5000];

    var date = new Date();
    const [startDate, setStartDate] = useState(new Date(date.getFullYear(), date.getMonth() - 1, date.getDate()));
    const [endDate, setEndDate] = useState(new Date(date));
  const [dateError, setDateError] = useState(false);

  const getBackoutData = async ()=>{
    setIsLoading(true)
    let payload = {
        "totalrecord": pageSize,
        "pagenumber": pageIndex,
        "FilterFields": {
            "fromDate": startDate?.toLocaleDateString("en-US"),
            "toDate": endDate?.toLocaleDateString("en-US"),
            "searchText":searchText 
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
  }

  useEffect(()=>{
    if(endDate && startDate){
         getBackoutData()
    }
   
  },[endDate,startDate,debouncedSearch])

  const onCalenderFilter = (dates) => {
    const [start, end] = dates;
    // console.log(start, end)
    setStartDate(start);
    setEndDate(end);

    if (start.toLocaleDateString() === end.toLocaleDateString()) {
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


const handleExport = (apiData) => {
    let DataToExport =  apiData.map(data => {
        let obj = {}
        tableColumnsMemo.forEach(val => {if(val.key !== "action"){
            if(val.key === 'engagementType'){
                obj[`${val.title}`] = `${data.typeOfHR} ${data.h_Availability && `- ${data.h_Availability}`}`
            }else{
                obj[`${val.title}`] = data[`${val.key}`]
            } }
        } )
    return obj;
        }
     )
     downloadToExcel(DataToExport,'Talent_Backout_Report.xlsx')

}

  const tableColumnsMemo = [{
    title: 'Created Date',				
    dataIndex: 'createdDateTime',
    key: 'createdDateTime',
    align: 'left',
    width:'150px'
},{
    title: 'HR #',				
    dataIndex: 'hR_Number',
    key: 'hR_Number',
    align: 'left',  
    width: '200px',
},
{
    title: 'Sales Person',				
    dataIndex: 'salesUser',
    key: 'salesUser',
    align: 'left',
    width: '150px',
},
{
    title: 'Client',				
    dataIndex: 'client',
    key: 'client',
    align: 'left',
    width: '250px',
},
{
  title: 'Company',				
  dataIndex: 'company',
  key: 'company',
  align: 'left',
  width: '200px',
},
{
    title: 'Job Title',				
    dataIndex: 'jobTitle',
    key: 'jobTitle',
    align: 'left',
    width: '150px',
},
{
    title: 'Talent',				
    dataIndex: 'talent',
    key: 'talent',
    align: 'left',
    width: '150px',
},
{
  title: 'Backout Reason',				
  dataIndex: 'rejectedReason',
  key: 'rejectedReason',
  align: 'left',
  width: '150px',
},
{
    title: 'PR',				
    dataIndex: 'pr',
    key: 'pr',
    align: 'left',
    width: '100px',
},
{
    title: 'BR/DP Amount',				
    dataIndex: 'br',
    key: 'br',
    align: 'left',
    width: '125px',
},
{
  title: 'NR/DP',				
  dataIndex: 'uplersNRDP',
  key: 'uplersNRDP',
  align: 'left',
  width: '100px',
},
{
  title: 'HR Status',				
  dataIndex: 'hrStatus',
  key: 'hrStatus',
  align: 'left',
  width: '150px',
}
]

  return (
    <div className={TalentBackoutStyle.dealContainer}>
    <div className={TalentBackoutStyle.header}>
      <div className={TalentBackoutStyle.dealLable}>Talent Backout Report</div>
      <LogoLoader visible={isLoading} />
    </div>

    <div className={TalentBackoutStyle.filterContainer}>
        <div className={TalentBackoutStyle.filterSets}>
          <div className={TalentBackoutStyle.filterRight}>
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
          </div>
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
                    getBackoutData();
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

    </div>
  )
}

export default TalentBackoutReport