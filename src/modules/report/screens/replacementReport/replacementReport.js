import React , { useEffect, useState } from 'react'
import ReplacementStyle from "./replacementReport.module.css";
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

function ReplacementReport() {
    const [getReplaceMentDetails,setReplacementDetails] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const [ searchText , setSearchText] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
    const [totalRecords, setTotalRecords] = useState(0);
    const [pageSize, setPageSize] = useState(100);    
	const [pageIndex, setPageIndex] = useState(1);
    const pageSizeOptions = [100, 200, 300, 500, 1000,5000];

    var date = new Date();
    const [startDate, setStartDate] = useState(new Date(date.getFullYear(), date.getMonth() - 1, date.getDate()));
    const [endDate, setEndDate] = useState(new Date(date));
  const [dateError, setDateError] = useState(false);

  const getReplacements = async ()=>{
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

    const replacementResult = await ReportDAO.getReplacementReportDRO(payload)

    // console.log(replacementResult)

    if(replacementResult?.statusCode === HTTPStatusCode.OK){
        setReplacementDetails(replacementResult?.responseBody?.rows)
        setTotalRecords(replacementResult?.responseBody?.totalrows)
        setIsLoading(false)
    }else{
        setReplacementDetails([])
        setIsLoading(false)
    }
    setIsLoading(false)
  }

  useEffect(()=>{
    if(endDate && startDate){
         getReplacements()
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
    const timer = setTimeout(() => getReplaceMentDetails() , 1000);
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
     downloadToExcel(DataToExport,'replacement report.xlsx')

}

  const tableColumnsMemo = [{
    title: 'Engagement ID',				
    dataIndex: 'engagementID',
    key: 'engagementID',
    align: 'left',
    width:'200px'
},{
    title: 'Company/Client',				
    dataIndex: 'company',
    key: 'company',
    align: 'left',  
    width: '150px',
},
{
    title: 'Job Title',				
    dataIndex: 'role',
    key: 'role',
    align: 'left',
    width: '150px',
},
{
    title: 'Original HR',				
    dataIndex: 'oldHRID',
    key: 'oldHRID',
    align: 'left',
    width: '200px',
},
{
    title: 'HR Status',				
    dataIndex: 'oldHRStatus',
    key: 'oldHRStatus',
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
    title: 'PR',				
    dataIndex: 'talentBRPR',
    key: 'talentBRPR',
    align: 'left',
    width: '100px',
},
{
    title: 'NR/DP',				
    dataIndex: 'uplersNR',
    key: 'uplersNR',
    align: 'left',
    width: '100px',
},
{
    title: 'DP/BR',				
    dataIndex: 'dpbr',
    key: 'dpbr',
    align: 'left',
    width: '100px',
},
{
    title: 'Start Date',				
    dataIndex: 'startDate',
    key: 'startDate',
    align: 'left',
    width: '150px',
},
{
    title: 'End Date',				
    dataIndex: 'endDate',
    key: 'endDate',
    align: 'left',
    width: '150px',
},
{
    title: 'Replacement Date',				
    dataIndex: 'replacementDate',
    key: 'replacementDate',
    align: 'left',
    width: '150px',
},
{
    title: 'New HR',				
    dataIndex: 'newHRID',
    key: 'newHRID',
    align: 'left',
    width: '200px',
},
{
    title: 'New Talent',				
    dataIndex: 'newTalent',
    key: 'newTalent',
    align: 'left',
    width: '150px',
},
{
    title: 'New PR',				
    dataIndex: 'newTalentBRPR',
    key: 'newTalentBRPR',
    align: 'left',
    width: '100px',
},
{
    title: 'New NR/DP',				
    dataIndex: 'newUplersNR',
    key: 'newUplersNR',
    align: 'left',
    width: '100px',
},
{
    title: 'New DP/BR',				
    dataIndex: 'newDPBR',
    key: 'newDPBR',
    align: 'left',
    width: '100px',
},
{
    title: 'New Start Date',				
    dataIndex: 'newStartDate',
    key: 'newStartDate',
    align: 'left',
    width: '150px',
},
{
    title: 'New End Date',				
    dataIndex: 'newEndDate',
    key: 'newEndDate',
    align: 'left',
    width: '150px',
},

]

  return (
    <div className={ReplacementStyle.dealContainer}>
    <div className={ReplacementStyle.header}>
      <div className={ReplacementStyle.dealLable}>Replacement Report</div>
      <LogoLoader visible={isLoading} />
    </div>

    <div className={ReplacementStyle.filterContainer}>
        <div className={ReplacementStyle.filterSets}>
          <div className={ReplacementStyle.filterRight}>
          <div className={ReplacementStyle.searchFilterSet}>
							<SearchSVG style={{ width: '16px', height: '16px' }} />
							<input
								type={InputType.TEXT}
								className={ReplacementStyle.searchInput}
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
      
            <div className={ReplacementStyle.calendarFilterSet}>
              {dateError &&  <p className={ReplacementStyle.error}>* Start and End dates can't be same </p>}
              <div className={ReplacementStyle.label}>Date</div>
              <div className={ReplacementStyle.calendarFilter}>
                <CalenderSVG style={{ height: "16px", marginRight: "16px" }} />
                <DatePicker
                  style={{ backgroundColor: "red" }}
                  onKeyDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className={ReplacementStyle.dateFilter}
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
              className={ReplacementStyle.btnPrimary}
              onClick={() => handleExport(getReplaceMentDetails)}
            >
              Export
            </button>
          </div>
        </div>
      </div>

      <div className={ReplacementStyle.tableDetails}>
					{isLoading ? (
						<TableSkeleton />
					) : (
						<WithLoader className="mainLoader">
							<Table
								scroll={{ x:'100vh', y: '100vh' }}
								id="hrListingTable"
								columns={tableColumnsMemo}
								bordered={false}
								dataSource={getReplaceMentDetails}
								// pagination={false} 
								pagination={{
									onChange: (pageNum, pageSize) => {
										setPageIndex(pageNum);
										setPageSize(pageSize);
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

export default ReplacementReport