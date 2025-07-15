import React, { Suspense, useCallback, useEffect, useState } from "react";
import amReportStyles from "./amReport.module.css";
import { Table, Tooltip, Checkbox, Skeleton, Modal, Spin, message } from "antd";
import { ReportDAO } from "core/report/reportDAO";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import { ReactComponent as SearchSVG } from "assets/svg/search.svg";
import { InputType } from "constants/application";
import { ReactComponent as CloseSVG } from "assets/svg/close.svg";
import DatePicker from "react-datepicker";
import moment from "moment";
import Diamond from "assets/svg/diamond.svg";
import PowerIcon from "assets/svg/powerRed.svg";
import TableSkeleton from "shared/components/tableSkeleton/tableSkeleton";
import { UserSessionManagementController } from "modules/user/services/user_session_services";
import { useForm } from "react-hook-form";
import HRInputField from "modules/hiring request/components/hrInputFields/hrInputFields";
import { All_Hiring_Request_Utils } from "shared/utils/all_hiring_request_util";
import { allCompanyRequestDAO } from "core/company/companyDAO";
import { downloadToExcel } from "modules/report/reportUtils";

const AMReport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
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
    },
  });
  const [filtersList, setFiltersList] = useState([]);
  const [userData, setUserData] = useState({});
  const [showDiamondRemark, setShowDiamondRemark] = useState(false);
  const [companyIdForRemark, setCompanyIdForRemark] = useState(0);
  const [remDiamondLoading, setRemDiamondLoading] = useState(false);
  const [isCompanyyDetailsLoading, setCompanyDetailsLoading] = useState(false);
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);
  const [companyDetails, setCompanyDetails] = useState({});
  const [companyDetailsList, setCompanyDetailList] = useState([]);
  const {
    watch,
    register,
    setError,
    handleSubmit,
    resetField,
    clearErrors,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    const getUserResult = async () => {
      let userData = UserSessionManagementController.getUserSession();
      if (userData) setUserData(userData);
    };
    getUserResult();
  }, []);

  useEffect(() => {
    getAMReportData();
  }, []);

  const getAMReportData = async (isReset) => {
    setIsLoading(true);
    const apiResult = await ReportDAO.getCompanyCategoryListDAO(
      isReset ? "" : openTicketDebounceText
    );
    setIsLoading(false);
    console.log("res", apiResult);
    if (apiResult?.statusCode === 200) {
      setReportData(apiResult.responseBody);
    } else if (apiResult?.statusCode === 404) {
      setReportData([]);
    }
  };

  const toggleHRFilter = useCallback(() => {
    !getHTMLFilter
      ? setIsAllowFilters(!isAllowFilters)
      : setTimeout(() => {
          setIsAllowFilters(!isAllowFilters);
        }, 300);
    setHTMLFilter(!getHTMLFilter);
  }, [getHTMLFilter, isAllowFilters]);

  const clearFilters = () => {
    setAppliedFilters(new Map());
    setCheckedState(new Map());
    setFilteredTagLength(0);
    setopenTicketDebounceText("");
    setMonthDate(new Date());
    setTableFilteredState({
      filterFields_OnBoard: {
        text: null,
      },
    });
  };

  const updateTARowValue = async (value, key, params, index, targetValue) => {
    setReportData((prev) => {
      let newDS = [...prev];
      newDS[index] = { ...newDS[index], [key]: value };
      return newDS;
    });
  };

  const setDiamondCompany = async (row, index) => {
    let payload = {
      basicDetails: {
        companyID: row.companyID,
        companyCategory: "Diamond",
      },
      // IsUpdateFromPreviewPage: true,
    };
    updateTARowValue("Diamond", "company_Category", row, index);
    let res = await allCompanyRequestDAO.updateCompanyCategoryDAO(payload);
  };

  const handleRemoveDiamond = async (d) => {
    let payload = {
      CompanyID: companyIdForRemark.companyID,
      DiamondCategoryRemoveRemark: d.diamondCategoryRemoveRemark,
    };
    setRemDiamondLoading(true);
    let res = await allCompanyRequestDAO.removeCompanyCategoryDAO(payload);
    setRemDiamondLoading(false);
    //   console.log("response", res);
    if (res.statusCode === 200) {
      updateTARowValue(
        "None",
        "company_Category",
        companyIdForRemark,
        companyIdForRemark.index
      );
      setShowDiamondRemark(false);
      resetField("diamondCategoryRemoveRemark");
      clearErrors("diamondCategoryRemoveRemark");
    } else {
      message.error("Something Went Wrong!");
    }
  };

  const getCompanyDetails = async (row) => {
    setCompanyDetails(row);
    setShowCompanyDetails(true);
    setCompanyDetailsLoading(true);
    const result = await ReportDAO.GetCompanywiseActiveHRListDAO(row.companyID);
    setCompanyDetailsLoading(false);

    // console.log(result)
    if (result.statusCode === 200) {
      setCompanyDetailList(result.responseBody);
    } else {
      setCompanyDetailList([]);
      message.error(`No Active HRs for ${row.company}`);
      setShowCompanyDetails(false);
    }
  };

  const columns = [
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
      width: 160,
      render: (text, row, index) => (
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
              width: "100%",
            }}
          >
            <p
              onClick={() => {
                getCompanyDetails(row);
              }}
              style={{ color: "#1890ff", fontWeight: 500, cursor: "pointer" }}
            >
              {text}
            </p>

            <div
              style={{
                display: "flex",
                marginLeft: "auto",
                gap: "10px",
                marginRight: "10px",
              }}
            >
              {row?.company_Category === "Diamond" && (
                <>
                  <img
                    src={Diamond}
                    alt="info"
                    style={{ width: "16px", height: "16px" }}
                  />
                  {(userData?.UserId === 2 ||
                  userData?.UserId === 333 ||
                  userData?.UserId === 190 ||
                  userData?.UserId === 96) &&    <div
                    onClick={() => {
                      setShowDiamondRemark(true);
                      setCompanyIdForRemark({ ...row, index: index });
                    }}
                  >
                    <Tooltip title="Remove Diamond">
                      <img
                        src={PowerIcon}
                        alt="info"
                        style={{
                          width: "16px",
                          height: "16px",
                          cursor: "pointer",
                        }}
                      />
                    </Tooltip>
                  </div>}
               
                </>
              )}
              {row?.company_Category !== "Diamond" &&
                (userData?.UserId === 2 ||
                  userData?.UserId === 333 ||
                  userData?.UserId === 190 ||
                  userData?.UserId === 96) && (
                  <Checkbox onChange={() => setDiamondCompany(row, index)}>
                    Make Diamond
                  </Checkbox>
                )}
            </div>
          </div>
        </div>
      ),
    },
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
    {
      title: "Size",
      dataIndex: "companySize_RangeorAdhoc",
      key: "companySize_RangeorAdhoc",
      width: 50,
      render: (value) => (value ? value : "-"),
    },
    {
      title: "Linkedin",
      dataIndex: "linkedInProfile",
      key: "linkedInProfile",
      width: 120,
      render: (value) =>
        value ? (
          <a
            href={value}
            style={{ textDecoration: "underline" }}
            target="_blank"
            rel="noreferrer"
          >
            {value}
          </a>
        ) : (
          ""
        ),
    },
    {
      title: "Website",
      dataIndex: "website",
      key: "website",
      width: 100,
      render: (value) =>
        value ? (
          <a
            href={value}
            style={{ textDecoration: "underline" }}
            target="_blank"
            rel="noreferrer"
          >
            {value}
          </a>
        ) : (
          ""
        ),
    },
  ];

  const ProfileColumns = [
    {
      title: "Created Date",
      dataIndex: "createdByDatetime",
      key: "createdByDatetime",
      width: "150px",
      render: (text) => {
        return moment(text).format("DD-MM-YYYY");
      },
    },
    {
      title: "HR #",
      dataIndex: "hR_Number",
      key: "hR_Number",
      width: "170px",
      render: (text, value) => {
        return (
          <a
            href={`/allhiringrequest/${value.hirignRequestID}`}
            style={{ textDecoration: "underline" }}
            target="_blank"
            rel="noreferrer"
          >
            {text}
          </a>
        ); // Replace `/client/${text}` with the appropriate link you need
      },
    },
    {
      title: "HR Title",
      dataIndex: "hRtitle",
      key: "hRtitle",
    },
    {
      title: "Eng. Type",
      dataIndex: "hrEngagementType",
      key: "hrEngagementType",
    },
    {
      title: "Status",
      dataIndex: "hrStatus",
      key: "hrStatus",
      render: (_, item) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {All_Hiring_Request_Utils.GETHRSTATUS(
            parseInt(item?.hrStatusCode),
            item?.hrStatus
          )}
        </div>
      ),
    },
  ];

  const hendleExport = (apiData) => {
    let DataToExport = apiData.map((data) => {
      let obj = {};
      columns.forEach((val) => {
        obj[`${val.title}`] = data[`${val.key}`];
      });
      return obj;
    });
    downloadToExcel(DataToExport, "Companylist");
  };

  return (
    <div className={amReportStyles.container}>
      <h1 className={amReportStyles.title}>Company</h1>

      <div className={amReportStyles.filterContainer}>
        <div className={amReportStyles.filterSets}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className={amReportStyles.filterSetsInner}>
              <div className={amReportStyles.searchFilterSet}>
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
                      getAMReportData(true);
                    }}
                  />
                )}
              </div>
              <button
                className={amReportStyles.btnPrimary}
                style={{ marginLeft: "5px" }}
                onClick={() => getAMReportData()}
              >
                Search
              </button>
            </div>
            <div></div>
            <div className={amReportStyles.filterRight}>
              <button
                className={amReportStyles.btnPrimary}
                onClick={() => hendleExport(reportData)}
              >
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <Table
          scroll={{ y: "480px" }}
          id="amReportList"
          columns={columns}
          bordered={false}
          dataSource={reportData}
          rowKey={(record, index) => index}
          rowClassName={(row, index) => {
            return row?.clientName === "TOTAL"
              ? amReportStyles.highlighttotalrow
              : "";
          }}
          pagination={false}
          //   pagination={{
          //     size: "small",
          //     pageSize: 15
          //   }}
        />
      )}

      {showDiamondRemark && (
        <Modal
          transitionName=""
          width="1000px"
          centered
          footer={null}
          open={showDiamondRemark}
          className="engagementModalStyle"
          onCancel={() => {
            setShowDiamondRemark(false);
            resetField("diamondCategoryRemoveRemark");
            clearErrors("diamondCategoryRemoveRemark");
          }}
        >
          <div style={{ padding: "35px 15px 10px 15px" }}>
            <h3>Add Remark</h3>
          </div>

          <div style={{ padding: "10px 20px" }}>
            {remDiamondLoading ? (
              <Skeleton active />
            ) : (
              <HRInputField
                isTextArea={true}
                register={register}
                errors={errors}
                label="Remark"
                name="diamondCategoryRemoveRemark"
                type={InputType.TEXT}
                placeholder="Enter Remark"
                validationSchema={{
                  required: "please enter remark",
                }}
                required
              />
            )}
          </div>

          <div style={{ padding: "10px 20px" }}>
            <button
              className={amReportStyles.btnPrimary}
              onClick={handleSubmit(handleRemoveDiamond)}
              disabled={remDiamondLoading}
            >
              Save
            </button>
            <button
              className={amReportStyles.btnCancle}
              disabled={remDiamondLoading}
              onClick={() => {
                setShowDiamondRemark(false);
                resetField("diamondCategoryRemoveRemark");
                clearErrors("diamondCategoryRemoveRemark");
              }}
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {showCompanyDetails && (
        <Modal
          transitionName=""
          width="1000px"
          centered
          footer={null}
          open={showCompanyDetails}
          className="engagementModalStyle"
          onCancel={() => {
            setShowCompanyDetails(false);
          }}
        >
          {isCompanyyDetailsLoading ? (
            <div
              style={{
                display: "flex",
                height: "350px",
                justifyContent: "center",
              }}
            >
              <Spin size="large" />
            </div>
          ) : (
            <>
              <div
                style={{
                  padding: "45px 15px 10px 15px",
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <p style={{ marginBottom: "0.5em", marginLeft: "5px" }}>
                  Company : <strong>{companyDetails?.company}</strong>
                </p>

                {/* <input
                                                    type="text"
                                                    placeholder="Search talent..."
                                                    value={searchTerm}
                                                    onChange={(e) => handleSearchInput(e.target.value)}
                                                    style={{
                                                        padding: "6px 10px",
                                                        border: "1px solid #ccc",
                                                        borderRadius: "4px",
                                                        marginLeft: "auto", 
                                                        marginRight:"20px",
                                                        minWidth: "260px",
                                                    }}
                                                  /> */}
              </div>

              {isCompanyyDetailsLoading ? (
                <div>
                  <Skeleton active />
                </div>
              ) : (
                <div style={{ margin: "5px 10px" }}>
                  <Table
                    dataSource={companyDetailsList}
                    columns={ProfileColumns}
                    pagination={false}
                    scroll={{ y: "480px" }}
                  />
                </div>
              )}

              <div style={{ padding: "10px 0" }}>
                <button
                  className={amReportStyles.btnCancle}
                  onClick={() => {
                    setShowCompanyDetails(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </Modal>
      )}
    </div>
  );
};

export default AMReport;
