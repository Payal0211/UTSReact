import { Dropdown, Menu, Table } from "antd";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import taStyles from "./amInterviews.module.css";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import { IoChevronDownOutline } from "react-icons/io5";
import { downloadToExcel } from "modules/report/reportUtils";
import { ReportDAO } from "core/report/reportDAO";
import moment from "moment";

const AmInterviews = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [openTicketDebounceText, setopenTicketDebounceText] = useState("");
    const [openTicketSearchText, setopenTicketSearchText] = useState("");
    const [pageSize, setPageSize] = useState(100);
    const pageSizeOptions = [100, 200, 300, 500, 1000, 5000];
    const columns = [
        {
            title: "AM",
            dataIndex: "am",
            key: "am",
            align:"center"
        },
        {
            title: "All Round",
            dataIndex: "allRound",
            key: "allRound",
            align:"center",
            render: (value) => (value ? value : '-'),
            // onCell: (record) => {
            // return {
            //     className: taStyles.allRoundCell
            // };
            // }
        },                 
        {
            title: "L1 Round",
            dataIndex: "round1",
            key: "round1",
            align:"center",
            render: (value) => (value ? value : '-'),
        },
        {
            title: "L2 Round",
            dataIndex: "round2",
            key: "round2",
            align:"center",
            render: (value) => (value ? value : '-'),
        },
        {
            title: "L3 Round",
            dataIndex: "round3",
            key: "round3",
            align:"center",
            align:"center",
            render: (value) => (value ? value : '-'),
        },
        {
            title: "L4 Round",
            dataIndex: "round4",
            key: "round4",
            align:"center",
            render: (value) => (value ? value : '-'),
        },
        {
            title: "L5 Round",
            dataIndex: "round5",
            key: "round5",
            align:"center",
            render: (value) => (value ? value : '-'),
        },
        {
            title: "L6 Round",
            dataIndex: "round6",
            key: "round6",
            align:"center",
            render: (value) => (value ? value : '-'),
        },
        
    ];


    useEffect(() => {
        fetchInterviews();        
    }, [openTicketSearchText,startDate]);

    useEffect(() => {
    const timer = setTimeout(
        () => {
        setopenTicketSearchText(openTicketDebounceText)},
        1000
    );
    return () => clearTimeout(timer);
    }, [openTicketDebounceText]);

    const fetchInterviews = async () => {
            let payload = {
                "targetDate": moment(startDate).format('YYYY-MM-DD')
            }
            setIsLoading(true)
            const apiResult = await ReportDAO.AMWiseInterviewCountsDAO(payload);
            setIsLoading(false)
            if (apiResult?.statusCode === 200) {            
                setData(apiResult.responseBody);
            } else if (apiResult?.statusCode === 404) {
                setData([]);
            }
    }

    const handleExport = (apiData) => {
        let DataToExport =  apiData.map(data => {
            let obj = {}
            columns.forEach(val => {     
            obj[`${val.title}`] = data[`${val.key}`]     
            })
            return obj;
        }
        )
        downloadToExcel(DataToExport,'AM_Interviews.xlsx')  
    }
    return(
        <div className={taStyles.snapshotContainer}> 
        <div className={taStyles.addnewHR} style={{ margin: "0" }}>
            <div className={taStyles.hiringRequest}>AM Wise Interview Count</div>
            </div>

           <div className={taStyles.filterContainer}>
            <div className={taStyles.filterRow}>
                {/* <div className={taStyles.searchBox}>
                <SearchSVG style={{ width: "16px", height: "16px" }} />
                <input
                    type={InputType.TEXT}
                    className={taStyles.searchInput}
                    placeholder="Search here!"
                    value={openTicketDebounceText}
                    onChange={(e) => setopenTicketDebounceText(e.target.value)}
                />
                {openTicketDebounceText && (
                    <CloseSVG
                    style={{
                        width: "16px",
                        height: "16px",
                        cursor: "pointer",
                    }}
                    onClick={() => setopenTicketDebounceText("")}
                    />
                )}
                </div> */}

                <div className={taStyles.filterRightRow}>
                {/* <div className={taStyles.filterItem}>
                    <span className={taStyles.label}>Showing</span>
                    <Dropdown
                    trigger={["click"]}
                    placement="bottom"
                    overlay={
                        <Menu onClick={(e) => setPageSize(parseInt(e.key))}>
                        {pageSizeOptions.map((item) => (
                            <Menu.Item key={item}>{item}</Menu.Item>
                        ))}
                        </Menu>
                    }
                    >
                    <div className={taStyles.paginationFilter}>
                        {pageSize}
                        <IoChevronDownOutline style={{ paddingTop: "5px", fontSize: "16px" }} />
                    </div>
                    </Dropdown>
                </div> */}

                <div className={taStyles.filterItem}>
                    <span className={taStyles.label}>Date</span>
                    <div className={taStyles.calendarFilter}>
                    <CalenderSVG style={{ height: "16px", marginRight: "16px" }} />
                    <DatePicker
                        onKeyDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        }}
                        className={taStyles.dateFilter}
                        placeholderText="Start date"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="dd-MM-yyyy"
                    />
                    </div>
                </div>

                <button className={taStyles.btnPrimary} onClick={() => handleExport(data)}>Export</button>
                </div>
            </div>
            </div>
                    
            {isLoading ? (
                <TableSkeleton />
            ) : (
                 <div>
                <Table
                    dataSource={data}
                    columns={columns}
                    // bordered
                    size="middle"
                    // pagination={{ pageSize: pageSize,pageSizeOptions: pageSizeOptions, }}
                    pagination={false}
                    rowClassName={(record) => (record?.am === 'TOTAL' ? taStyles.totalrow : '')}
                />
                </div>
            )}
            </div>
       
    )
}

export default AmInterviews;