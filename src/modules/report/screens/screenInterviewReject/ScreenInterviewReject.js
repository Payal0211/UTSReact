import React, { useEffect, useState } from "react";
import SIStyles from "./screeningInterviewReject.module.css";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import { Dropdown, Menu, Table, Modal } from "antd";
import { ReportDAO } from "core/report/reportDAO";
import { ReactComponent as SearchSVG } from "assets/svg/search.svg";
import { InputType } from "constants/application";
import { ReactComponent as CloseSVG } from "assets/svg/close.svg";
import Diamond from "assets/svg/diamond.svg";
import { downloadToExcel } from "modules/report/reportUtils";

export default function ScreenInterviewReject() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [talentData, setTalentData] = useState([]);
  const [showRejectedTlents, setShowRejectedTalents] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [rejectionType, setRejectionType] = useState("");
  const [companyDetails, setCompanyDetails] = useState({});
  const [openTicketDebounceText, setopenTicketDebounceText] = useState("");
  const [searchText,setSearchText] = useState('')

  useEffect(() => {
    fetchInterviews();
  }, [searchText]);

  useEffect(()=>{
   setTimeout(()=> setSearchText(openTicketDebounceText),2000)
  },[openTicketDebounceText])

  const fetchInterviews = async () => {
    let payload = {
      searchText: searchText,
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

  const getRejectedTalents = async (record, type) => {
    setRejectionType(type);
    setCompanyDetails(record);
    let payload = {
      companyID: record.companyID,
      hrID:record.hiringRequest_ID,
      rejectType: type,
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
      width: "400px",
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
      title: "Created",
      dataIndex: "createdByDatetime",
      key: "createdByDatetime",
      align: "center",
    },
      {
      title: "HR #",
      dataIndex: "hR_Number",
      key: "hR_Number",
      align: "center",
    },
        {
      title: "Screen Reject",
      dataIndex: "screenRejects",
      key: "screenRejects",
      align: "center",
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
      title: "R1 Reject",
      dataIndex: "r1_InterviewRejects",
      key: "r1_InterviewRejects",
      align: "center",
      render: (value, record) => {
        const isClickable = record?.am !== "TOTAL" && value;
        return (
          <span
            style={{
              color: isClickable ? "#1890ff" : "inherit",
              cursor: isClickable ? "pointer" : "default",
            }}
            onClick={() => {
              getRejectedTalents(record, "I");
            }}
          >
            {value ? value : "-"}
          </span>
        );
      },
    },
    {
      title: "R2 Reject",
      dataIndex: "r2_InterviewRejects",
      key: "r2_InterviewRejects",
      align: "center",
      render: (value, record) => {
        const isClickable = record?.am !== "TOTAL" && value;
        return (
          <span
            style={{
              color: isClickable ? "#1890ff" : "inherit",
              cursor: isClickable ? "pointer" : "default",
            }}
            onClick={() => {
              getRejectedTalents(record, "I");
            }}
          >
            {value ? value : "-"}
          </span>
        );
      },
    },
    {
      title: "R3 Reject",
      dataIndex: "r3_InterviewRejects",
      key: "r3_InterviewRejects",
      align: "center",
      render: (value, record) => {
        const isClickable = record?.am !== "TOTAL" && value;
        return (
          <span
            style={{
              color: isClickable ? "#1890ff" : "inherit",
              cursor: isClickable ? "pointer" : "default",
            }}
            onClick={() => {
              getRejectedTalents(record, "I");
            }}
          >
            {value ? value : "-"}
          </span>
        );
      },
    },
    {
      title: "R4 Reject",
      dataIndex: "r4_InterviewRejects",
      key: "r4_InterviewRejects",
      align: "center",
      render: (value, record) => {
        const isClickable = record?.am !== "TOTAL" && value;
        return (
          <span
            style={{
              color: isClickable ? "#1890ff" : "inherit",
              cursor: isClickable ? "pointer" : "default",
            }}
            onClick={() => {
              getRejectedTalents(record, "I");
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
    },
    {
      title: "Lead Type",
      dataIndex: "leadType",
      key: "leadType",
      align: "left",
    },
    {
      title: "AM",
      dataIndex: "am",
      key: "am",
      align: "left",
    },

  ];

  const handleExport = (data)=>{
        let dataToExport = data.map(record=>{
            let obj = {}
            columns.forEach((val)=>{
                obj[val.title] = record[val.key]
            })
            return obj
        })

        downloadToExcel(dataToExport, "Screen Interview Reject Counts");
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
