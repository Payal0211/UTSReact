import React, { useEffect, useState } from "react";
import SIStyles from "./screeningInterviewReject.module.css";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import { Dropdown, Menu, Table, Modal,Select, InputNumber } from "antd";
import { ReportDAO } from "core/report/reportDAO";
import { ReactComponent as SearchSVG } from "assets/svg/search.svg";
import { InputType } from "constants/application";
import { ReactComponent as CloseSVG } from "assets/svg/close.svg";
import Diamond from "assets/svg/diamond.svg";
import { downloadToExcel } from "modules/report/reportUtils";

const { Option } = Select;

export default function ScreenInterviewReject() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [talentData, setTalentData] = useState([]);
  const [showRejectedTlents, setShowRejectedTalents] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [rejectionType, setRejectionType] = useState("");
  const [companyDetails, setCompanyDetails] = useState({});
  const [openTicketDebounceText, setopenTicketDebounceText] = useState("");
  const [reportListType,setReportListType] = useState('All')
  const [countValue,setCountNo] = useState(1)

  useEffect(() => {
    fetchInterviews();
  }, []);

//   useEffect(()=>{
//    setTimeout(()=> setSearchText(openTicketDebounceText),2000)
//   },[openTicketDebounceText])

  const fetchInterviews = async (reset) => {
    let payload = {
      searchText: reset? '': openTicketDebounceText,
      rejectionCountOption: reset? 'All': reportListType,
      rejectionCount: reset? 1:countValue
    };
    setIsLoading(true);
    const apiResult = await ReportDAO.ScreenInterviewRejectCountsDAO(payload);
    setIsLoading(false);

    if (apiResult?.statusCode === 200) {
      setData(groupByRowSpan(apiResult.responseBody, "company"));
    } else {
      setData([]);
    }
  };

  const getRejectedTalents = async (record, type,count) => {
    setRejectionType(type);
    setCompanyDetails(record);
    let payload = {
    //   companyID: record.companyID,
     companyID: 0,
      hrID:record.hiringRequest_ID,
      rejectType: type,
      roundCount: type === 'I' ? count : ''
    };
    setShowRejectedTalents(true);
    setRejectLoading(true);
    const apiResult = await ReportDAO.rejectedTalentsDetailsDAO(payload);
    setRejectLoading(false);

    if (apiResult?.statusCode === 200) {
      setTalentData(apiResult.responseBody);
    } else {
      setTalentData([]);
    }
  };
    function groupByRowSpan(data, groupField) {
    const grouped = {};

    // Step 1: Group by the field (e.g., 'ta')
    data.forEach((item) => {
      const key = item[groupField];
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });

    // Step 2: Add rowSpan metadata
    const finalData = [];
    Object.entries(grouped).forEach(([key, rows]) => {
      rows.forEach((row, index) => {
        finalData.push({
          ...row,
          rowSpan: index === 0 ? rows.length : 0,
        });
      });
    });

    return finalData;
  }

  const columns = [
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
      align: "left",
      width: "230px",
       render: (value, row, index) => {
        return {
          children: (
            <div style={{ verticalAlign: "top" }}>
              <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          {/* Company Name + Diamond Icon */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              flexWrap: "wrap",
            }}
          >
            <a
              href={`/viewCompanyDetails/${row.companyID}`}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#1890ff", fontWeight: 500 }}
            >
              {value}
            </a>

            {row?.companyCategory === "Diamond" && (
              <>
                <img
                  src={Diamond}
                  alt="info"
                  style={{ width: "16px", height: "16px" }}
                />
              </>
            )}
          </div>
        </div>
              <br />{" "}
            </div>
          ),
          props: {
            rowSpan: row.rowSpan,
            style: { verticalAlign: "top" }, // This aligns the merged cell content to the top
          },
        };
      },
    //   render: (text, row, index) => (
    //     <div
    //       style={{
    //         display: "flex",
    //         flexDirection: "column",
    //         alignItems: "flex-start",
    //       }}
    //     >
    //       {/* Company Name + Diamond Icon */}
    //       <div
    //         style={{
    //           display: "flex",
    //           alignItems: "center",
    //           gap: "4px",
    //           flexWrap: "wrap",
    //         }}
    //       >
    //         <a
    //           href={`/viewCompanyDetails/${row.companyID}`}
    //           target="_blank"
    //           rel="noreferrer"
    //           style={{ color: "#1890ff", fontWeight: 500 }}
    //         >
    //           {text}
    //         </a>

    //         {row?.companyCategory === "Diamond" && (
    //           <>
    //             <img
    //               src={Diamond}
    //               alt="info"
    //               style={{ width: "16px", height: "16px" }}
    //             />
    //           </>
    //         )}
    //       </div>
    //     </div>
    //   ),
    },
      {
      title: "Action date",
      dataIndex: "createdByDatetime",
      key: "createdByDatetime",
      align: "left",
       width: "150px",
    },
      {
      title: "HR #",
      dataIndex: "hR_Number",
      key: "hR_Number",
      align: "center",
       width: "180px",
    },
        {
      title: <>Screen<br/>  Reject </>,
      dataIndex: "screenRejects",
      key: "screenRejects",
      align: "center",
       width: "120px",
      render: (value, record) => {
        const isClickable = record?.am !== "TOTAL" && value;
        return (
          <span
            style={{
              color: isClickable ? "#1890ff" : "inherit",
              cursor: isClickable ? "pointer" : "default",
            }}
            onClick={() => {
              getRejectedTalents(record, "S");
              
            }}
          >
            {value ? value : "-"}
          </span>
        );
      },
    },
    {
      title:  <>Interview <br/> Reject</>,
      dataIndex: "interviewRejects",
      key: "interviewRejects",
      align: "center",
      width: "80px",
      render: (value, record) => {
        return (
          <span
          >
            {value ? value : "-"}
          </span>
        );
      },
    },
    {
      title: <>R1 <br/>  Reject</> ,
      dataIndex: "r1_InterviewRejects",
      key: "r1_InterviewRejects",
      align: "center",
      width: "60px",
      render: (value, record) => {
        const isClickable = record?.am !== "TOTAL" && value;
        return (
          <span
            style={{
              color: isClickable ? "#1890ff" : "inherit",
              cursor: isClickable ? "pointer" : "default",
            }}
            onClick={() => {
              getRejectedTalents(record, "I",'R1');
            }}
          >
            {value ? value : "-"}
          </span>
        );
      },
    },
    {
      title: <>R2  <br/>Reject</>,
      dataIndex: "r2_InterviewRejects",
      key: "r2_InterviewRejects",
      align: "center",
      width: "60px",
      render: (value, record) => {
        const isClickable = record?.am !== "TOTAL" && value;
        return (
          <span
            style={{
              color: isClickable ? "#1890ff" : "inherit",
              cursor: isClickable ? "pointer" : "default",
            }}
            onClick={() => {
              getRejectedTalents(record, "I",'R2');
            }}
          >
            {value ? value : "-"}
          </span>
        );
      },
    },
    {
      title: <>R3  <br/>Reject </>,
      dataIndex: "r3_InterviewRejects",
      key: "r3_InterviewRejects",
      align: "center",
      width: "60px",
      render: (value, record) => {
        const isClickable = record?.am !== "TOTAL" && value;
        return (
          <span
            style={{
              color: isClickable ? "#1890ff" : "inherit",
              cursor: isClickable ? "pointer" : "default",
            }}
            onClick={() => {
              getRejectedTalents(record, "I",'R3');
            }}
          >
            {value ? value : "-"}
          </span>
        );
      },
    },
    {
      title: <>R4 <br/>Reject</>,
      dataIndex: "r4_InterviewRejects",
      key: "r4_InterviewRejects",
      align: "center",
       width: "60px",
      render: (value, record) => {
        const isClickable = record?.am !== "TOTAL" && value;
        return (
          <span
            style={{
              color: isClickable ? "#1890ff" : "inherit",
              cursor: isClickable ? "pointer" : "default",
            }}
            onClick={() => {
              getRejectedTalents(record, "I",'R4');
            }}
          >
            {value ? value : "-"}
          </span>
        );
      },
    },
    {
      title: "Company Size",
      dataIndex: "companySize",
      key: "companySize",
      align: "center",
       width: "150px",
    },
    {
      title: "Lead Type",
      dataIndex: "leadType",
      key: "leadType",
      align: "left",
       width: "120px",
    },
    {
      title: "Sales Person",
      dataIndex: "am",
      key: "am",
      align: "left",
       width: "120px",
    },

  ];

  const handleExport = (data)=>{
        let dataToExport = data.map(record=>{
            let obj = {}
            columns.forEach((val)=>{
                if(val.key === 'screenRejects'){
                    obj['Screen Reject'] = record[val.key]
                }else  if(val.key === 'interviewRejects'){
                    obj['Interview Reject'] = record[val.key]
                }else  if(val.key === 'r1_InterviewRejects'){
                    obj['R1 Reject'] = record[val.key]
                }else  if(val.key === 'r2_InterviewRejects'){
                    obj['R2 Reject'] = record[val.key]
                }else  if(val.key === 'r3_InterviewRejects'){
                    obj['R3 Reject'] = record[val.key]
                }else  if(val.key === 'r4_InterviewRejects'){
                    obj['R4 Reject'] = record[val.key]
                }
                else{
                     obj[val.title] = record[val.key]
                }
               
            })
            return obj
        })

        downloadToExcel(dataToExport, "Screen Interview Reject Counts");
  }

  const clearFilters = () =>{
    setopenTicketDebounceText('')
    setReportListType('All')
    setCountNo(1)


    fetchInterviews(true)

  }

  return (
    <div className={SIStyles.snapshotContainer}>
      <div className={SIStyles.addnewHR} style={{ margin: "0" }}>
        <div className={SIStyles.hiringRequest}>
          Screen & Interview Reject Count
        </div>
      </div>

      <div className={SIStyles.filterContainer}>
        <div className={SIStyles.filterRow}>
              <div className={SIStyles.searchFilterSet}>
              <SearchSVG style={{ width: "16px", height: "16px" }} />
              <input
                type={InputType.TEXT}
                className={SIStyles.searchInput}
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

            <Select defaultValue="All" value={reportListType} style={{ width: 120 }} onChange={value => {console.log(value);setReportListType(value)}}>
                <Option value="All">All</Option>
                <Option value="RS">Screen Reject (more than)</Option>

                <Option value="RI">Interview Reject (more than)</Option>
            </Select>

          {reportListType !== 'All' && <InputNumber value={countValue} min={1} max={999} defaultValue={3} onChange={val=>setCountNo(val)} style={{height:'44px',borderRadius:'8px'}} />}  
<button className={SIStyles.btnPrimary} onClick={() => fetchInterviews()}>
                           search
                        </button>

                        <p className={SIStyles.resetText} onClick={()=>clearFilters()}>Reset Filters</p>
            
   
          <div className={SIStyles.filterRightRow}>
          
            {/*  <div className={SIStyles.filterItem}>
                            <span className={SIStyles.label}>Date</span>
                            <div className={SIStyles.calendarFilter}>
                                <CalenderSVG style={{ height: "16px", marginRight: "16px" }} />
                                <DatePicker
                                    onKeyDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    className={SIStyles.dateFilter}
                                    placeholderText="Start date"
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    dateFormat="dd-MM-yyyy"
                                />
                            </div>
                        </div> */}
            <button className={SIStyles.btnPrimary} onClick={() => handleExport(data)}>
                            Export
                        </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <Table
        scroll={{y:'100vh'}}
          dataSource={data}
          columns={columns}
          pagination={false}
          rowClassName={(record) =>
            record?.am === "TOTAL" ? SIStyles.totalrow : ""
          }
        />
      )}
      {showRejectedTlents && (
        <Modal
          width="1200px"
          centered
          footer={null}
          open={showRejectedTlents}
          className="engagementModalStyle"
          onCancel={() => {
            setShowRejectedTalents(false);
          }}
        >
          <div style={{ padding: "20px 15px" }}>
            <h3>
              <b>
                {companyDetails?.company} -{" "}{`${companyDetails?.hR_Number} ( ${companyDetails?.hrTitle} )`} -{" "}
                {rejectionType === "I" ? "Interview" : "Screen"}
              </b>
            </h3>
          </div>

          {rejectLoading ? (
            <TableSkeleton />
          ) : talentData.length > 0 ? (
            <>
              <div
                style={{
                  padding: "0 20px 20px 20px",
                  overflowX: "auto",
                  maxHeight: "500px",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 14,
                    textAlign: "left",
                  }}
                >
                  <thead
                    className={SIStyles.overwriteTableColor}
                    style={{ position: "sticky", top: "0" }}
                  >
                    <tr style={{ backgroundColor: "#f0f0f0" }}>
                         <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          backgroundColor: "rgb(233, 233, 233) !important",
                        }}
                      >
                        Action Date
                      </th>
                      {/* <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          backgroundColor: "rgb(233, 233, 233) !important",
                        }}
                      >
                        HR Number
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          backgroundColor: "rgb(233, 233, 233) !important",
                        }}
                      >
                        HR Title
                      </th> */}
                      <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          background: "rgb(233, 233, 233) !important",
                        }}
                      >
                        Talent
                      </th>
                      {rejectionType === "I" && (
                        <th
                          style={{
                            padding: "10px",
                            border: "1px solid #ddd",
                            backgroundColor: "rgb(233, 233, 233) !important",
                          }}
                        >
                          Slot Detail
                        </th>
                      )}
                      <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          backgroundColor: "rgb(233, 233, 233) !important",
                        }}
                      >
                        Rejection Reason
                      </th>

                      <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          backgroundColor: "rgb(233, 233, 233) !important",
                        }}
                      >
                        Other Reason
                      </th>
                      
                    </tr>
                  </thead>

                  <tbody style={{ maxHeight: "500px" }}>
                    {talentData.map((detail, index) => (
                      <tr
                        key={index}
                        style={{ borderBottom: "1px solid #ddd" }}
                      >
                         <td
                          style={{ padding: "8px", border: "1px solid #ddd" }}
                        >
                          {detail.actionDate}
                        </td>
                        {/* <td
                          style={{ padding: "8px", border: "1px solid #ddd" }}
                        >
                          {detail.hR_Number}
                        </td>
                        <td
                          style={{ padding: "8px", border: "1px solid #ddd" }}
                        >
                          {detail.hrTitle}
                        </td> */}
                        <td
                          style={{ padding: "8px", border: "1px solid #ddd" }}
                        >
                          {detail.talent}
                        </td>
                         {rejectionType === "I" && (
                          <td
                            style={{ padding: "8px", border: "1px solid #ddd" }}
                          >
                            {detail.slotDetail}
                          </td>
                        )}

                        <td
                          style={{ padding: "8px", border: "1px solid #ddd" }}
                        >
                          {detail.rejectionReason}
                        </td>
                        <td
                          style={{ padding: "8px", border: "1px solid #ddd" }}
                        >
                          {detail.otherRejectReason}
                        </td>
                       
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div
              style={{
                padding: "10px",
                display: "flex",
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: 500,
              }}
            >
              <p>No details available.</p>
            </div>
          )}

          <div style={{ padding: "10px", textAlign: "right" }}>
            <button
              className={SIStyles.btnCancle}
              onClick={() => {
                setShowRejectedTalents(false);
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
