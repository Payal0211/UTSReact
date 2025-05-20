import React, { useEffect, useState } from 'react';
import amReportStyles from './amReport.module.css';
import {  Select, Spin, Table } from 'antd';
import { ReportDAO } from 'core/report/reportDAO';
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import { ReactComponent as SearchSVG } from "assets/svg/search.svg";
import { InputType } from "constants/application";
import { ReactComponent as CloseSVG } from "assets/svg/close.svg";
import DatePicker from "react-datepicker";
import moment from 'moment';

const columns = [
  {
    title: 'Client Name',
    dataIndex: 'clientName',
    key: 'clientName',
  },
  {
    title: 'Position Name',
    dataIndex: 'positionName',
    key: 'positionName',
  },
  {
    title: 'Revenue (Margin)',
    dataIndex: 'revenueMargin',
    key: 'revenueMargin',
    render: (value) => `${value}`,
  },
  {
    title: 'Probability Ratio',
    dataIndex: 'probability',
    key: 'probability',
  },
  {
    title: 'Average',
    dataIndex: 'average',
    key: 'average',
  },
  {
    title: 'No. of Interviews',
    dataIndex: 'interviews',
    key: 'interviews',
  },
  {
    title: 'Profiles Needed By',
    dataIndex: 'profilesNeededBy',
    key: 'profilesNeededBy',
  },
  {
    title: 'Client Response By',
    dataIndex: 'clientResponseBy',
    key: 'clientResponseBy',
  },
  ...[1, 2, 3, 4, 5].map((week, i) => ({
    title: `W${week}`,
    dataIndex: ['weekData', i],
    key: `week${week}`,
    render: (val) => `${val}`,
  })),
];

const AMReport = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [reportData,setReportData] = useState([]);
    const today = new Date();
    const [dateTypeFilter, setDateTypeFilter] = useState(2);
    const [monthDate, setMonthDate] = useState(today);  
    const [openTicketDebounceText, setopenTicketDebounceText] = useState("");

    useEffect(() => {
        getAMReportData();
    }, [openTicketDebounceText,monthDate,dateTypeFilter]);

    const getAMReportData = async () => {
        let payload = {
            "searchText": openTicketDebounceText,
            "month":dateTypeFilter === 2 ? 0 : dateTypeFilter === 0 ? +moment(monthDate).format("M") : 0,
            "year": dateTypeFilter === 2 ? 0 : dateTypeFilter === 0 ? +moment(monthDate).format("YYYY") : 0,            
            "amUserIDs": null           
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


  return (
    <div className={amReportStyles.container}>
      <h1 className={amReportStyles.title}>Pipeline to bring closures from</h1>
    
        <div className={amReportStyles.filterContainer}>
                <div className={amReportStyles.filterSets}>                                                
                        
                        <div className={amReportStyles.searchFilterSet} style={{marginLeft:'10px'}}>
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
                              
                        <div style={{display:'flex',justifyContent:'flex-end'}}>
                            <div style={{display:"flex",justifyContent:'center',marginRight:"10px"}}>
                                <Select
                                    id="selectedValue"
                                    placeholder="Select"
                                    value={dateTypeFilter}                    
                                    style={{width:"180px",height:"48px"}}
                                    onChange={(value, option) => {
                                    setDateTypeFilter(value);
                                    }}
                                    options={[{value: 2,label: 'No Dates'},{value: 0,label: 'By Month'}]}
                                    optionFilterProp="value"
                                />
                            </div>
                            {dateTypeFilter === 0 && (
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
                            )}                                                                                            
                        </div>                        
                </div>
              </div>


      {isLoading ? <Spin />  : 
        <Table
          // scroll={{ y: "480px" }}
          columns={columns}
          dataSource={reportData}
          pagination={{ pageSize: 15 }}
          className={amReportStyles.amtable}        
          bordered        
          rowClassName={(row, index) => {
            return row?.clientName === 'TOTAL' ? amReportStyles.highlighttotalrow : '';
          }} 
        />
      }
    </div>
  );
};

export default AMReport;