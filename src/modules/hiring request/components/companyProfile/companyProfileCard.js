import CompanyProfileCardStyle from "./companyProfile.module.css";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { BsThreeDots } from "react-icons/bs";
import { AiFillLinkedin } from "react-icons/ai";
import { Divider, Dropdown, Menu, Modal, Tabs, Tooltip } from "antd";
import { Link,useNavigate,  useParams } from "react-router-dom";
import UpdateTRModal from "../../components/updateTRModal/updateTRModal";
import ChangeDate from "../changeDate/changeDateModal";
import { hiringRequestDAO } from "core/hiringRequest/hiringRequestDAO";
import { UserSessionManagementController } from "modules/user/services/user_session_services";
import { UserAccountRole } from "constants/application";
import { NetworkInfo } from "constants/network";
import JOBPostSLA from "./jobPostSLA";
import infoIcon from 'assets/svg/info.svg'
import { MasterDAO } from "core/master/masterDAO";

const CompanyProfileCard = ({
  clientDetail,
  talentLength,
  apiData,
  allApiData,
}) => {
  const navigate = useNavigate();
  const [updateTR, setUpdateTR] = useState(false);
  const [updateTRDetail, setUpdateTRDetails] = useState([]); 

  const [title, setTitle] = useState("Company Details");
  const [updateDate, setUpdateDate] = useState(false);
  const[isLoading,setIsLoading] = useState(false);
  const id = useParams();
  const getHRDetails = async () => {
    setIsLoading(true);
    let response = await hiringRequestDAO.getViewHiringRequestDAO(id?.hrid);
    setIsLoading(false);
    setUpdateTRDetails(response?.responseBody);
  };
  const userSessionMemo = useMemo(
    () => UserSessionManagementController.getUserMiscellaneousData(),
    []
  );


  const [avalableTabs, setAvalableTabs] = useState([]);

  const DownloadJDFile = async (URL) => {
    try { 
       let payload = {
      jdFile: URL
    }

			//   payload.filename = data?.Talent_Resume;
			//   payload.talentId = data?.ATS_TalentID;
			//   payload.hiringRequestId = data?.HiringRequest_ID;
			//   payload.isATSTalentId = true;

			let res = await MasterDAO.downloadJDDAO(payload)

			const blob = new Blob([res?.responseBody], {
				type: "application/octet-stream",
			});
			const link = document.createElement("a");
			const fileUrl = window.URL.createObjectURL(blob);
			link.href = fileUrl;
			let arr = URL?.split("/");
			let fileName = arr[arr.length - 1];
			link.download = fileName;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (error) {
			console.error("Error downloading file:", error);
		}
  }


  useEffect(() => {
    if (allApiData.IsPayPerCredit || allApiData.Guid) {
      setAvalableTabs([
        {
          label: "Company Details",
          key: "Company Details",
          children: <CompanyProfileCardComp />,
        },
        {
          label: "Job Post SLA",
          key: "Job Post SLA",
          children: <JOBPostSLA allApiData={allApiData} />,
        },
      ]);
    } else {
      setAvalableTabs([
        {
          label: "Company Details",
          key: "Company Details",
          children: <CompanyProfileCardComp />,
        },
      ]);
    }
  }, [allApiData.IsPayPerCredit, allApiData.HR_Id]);

  const CompanyProfileCardComp = () => {
    return (
      
      <div
        className={CompanyProfileCardStyle.companyCard}
        style={{ marginTop: "10px" }}
      >        
        <div className={CompanyProfileCardStyle.companyCardBody}>
          <div className={CompanyProfileCardStyle.partWise}>
            <div style={{ marginBottom: "10px" }}>
              <div className={CompanyProfileCardStyle.clientName}>
                <span>Client:</span>&nbsp;&nbsp;
                <span style={{ fontWeight: "500" }}>
                  {clientDetail?.ClientName ? clientDetail?.ClientName : "NA"}
                </span>
              </div>
              <div className={CompanyProfileCardStyle.clientEmail}>
                <span>Client Email:</span>&nbsp;&nbsp;
                <span style={{ fontWeight: "500" }}>
                  {clientDetail?.ClientEmail ? clientDetail?.ClientEmail : "NA"}
                </span>
              </div>
              <div className={CompanyProfileCardStyle.companyName}>
                <span>Company:</span>&nbsp;&nbsp;
                <span style={{ fontWeight: "500" }}>
                  {clientDetail?.CompanyName ? <Link to={`/viewCompanyDetails/${clientDetail?.CompanyId}`}  style={{ textDecoration: "underline" }} target="_blank">{clientDetail?.CompanyName}</Link>  : "NA"}
                </span>
              </div>
              <div className={CompanyProfileCardStyle.companyURL}>
                <span>Company URL:</span>&nbsp;&nbsp;
                <span style={{ fontWeight: "500" }}>
                  {clientDetail?.CompanyURL ? (
                    <a
                      target="_blank"
                      href={clientDetail?.CompanyURL}
                      style={{ textDecoration: "underline" }}
                      rel="noreferrer"
                    >
                      Click Here
                    </a>
                  ) : (
                    "NA"
                  )}
                </span>
                &nbsp;&nbsp;
                {/* {clientDetail?.LinkedInProfile && (
                  <a
                    href={clientDetail?.LinkedInProfile}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <AiFillLinkedin style={{ color: "#006699" }} />
                  </a>
                )} */}
              </div>
            </div>
            <div style={{ cursor: "pointer" }}>
              {
                <Dropdown
                  trigger={["click"]}
                  placement="bottom"
                  overlay={
                    <Menu>
                      <Menu.Item key={0}  onClick={() => navigate(`/viewClient/${clientDetail?.CompanyId}/${clientDetail?.ContactId}`)}>View Company </Menu.Item>
                    </Menu>
                  }
                >
                  <BsThreeDots style={{ fontSize: "1.5rem" }} />
                </Dropdown>
              }
            </div>
          </div>
          <Divider
            style={{
              margin: "10px 0",
            }}
          />
          <div className={CompanyProfileCardStyle.partWise}>
            <div style={{ marginBottom: "10px" }}>
              {/* <div className={CompanyProfileCardStyle.EngagementType}>
				<span>Engagement Type:</span>&nbsp;&nbsp;
				<span style={{ fontWeight: '500' }}>
					{clientDetail?.Managed ? clientDetail?.Managed : 'NA'}
				</span>
			</div> */}
              <div className={CompanyProfileCardStyle.EngagementType}>
                <span>Lead Type:</span>&nbsp;&nbsp;
                <span style={{ fontWeight: "500" }}>
                  {allApiData?.ClientDetail?.LeadType
                    ? allApiData?.ClientDetail?.LeadType
                    : "NA"}
                </span>
              </div>
              <div className={CompanyProfileCardStyle.category}>
                <span>Lead User:</span>&nbsp;&nbsp;
                <span style={{ fontWeight: "500" }}>
                  {allApiData?.ClientDetail?.LeadUser
                    ? allApiData?.ClientDetail?.LeadUser
                    : "NA"}
                </span>
              </div>
            </div>
          </div>

          <Divider
            style={{
              margin: "10px 0",
            }}
          />
          <div className={CompanyProfileCardStyle.partWise}>
            <div style={{ marginBottom: "10px" }}>
              {/* <div className={CompanyProfileCardStyle.EngagementType}>
				<span>Engagement Type:</span>&nbsp;&nbsp;
				<span style={{ fontWeight: '500' }}>
					{clientDetail?.Managed ? clientDetail?.Managed : 'NA'}
				</span>
			</div> */}
              {/* <div className={CompanyProfileCardStyle.EngagementType}>
                <span>Engagement Type :</span>&nbsp;&nbsp;
                <span style={{ fontWeight: "500" }}>
                  {!allApiData?.Is_HRTypeDP
                    ? `Contract - ${
                        clientDetail?.SpecificMonth
                          ? clientDetail?.SpecificMonth === -1 ? 'Indefinite': `${clientDetail?.SpecificMonth} Months`
                          : 0
                      }
					 ${allApiData?.transparentModel?.IsTransparentPricing ? "( Transparent )" : "( Non Transparent )"}`
                    : `Direct Placement ${allApiData?.transparentModel?.IsTransparentPricing ? "( Transparent )" : "( Non Transparent )"}` }
                </span>
              </div> */}
               <div className={CompanyProfileCardStyle.EngagementType}>
                <span>Engagement Type :</span>&nbsp;&nbsp;
                <span style={{ fontWeight: "500" }}>
                  {allApiData?.IsPayPerHire && (allApiData?.transparentModel?.EngagementType ? allApiData?.transparentModel?.EngagementType : allApiData?.EngagementType)}
                  {allApiData?.IsPayPerCredit && allApiData?.PayPerCreditModel?.EngagementType }
                  {/* { 
					`${allApiData?.transparentModel?.HrTypePricingId > 0 ? allApiData?.transparentModel?.HrTypePricing : `Contract - ${
            clientDetail?.SpecificMonth
              ? clientDetail?.SpecificMonth === -1 ? 'Indefinite': `${clientDetail?.SpecificMonth} Months`
              : 0
          }`}  
          ${(allApiData?.transparentModel?.IsTransparentPricing !==null) ? (allApiData?.transparentModel?.IsTransparentPricing  ? "( Transparent )" : "( Non Transparent )") : ''}`
                   } */}
                </span>
              </div>
              {allApiData?.transparentModel?.EngagementText &&  <div className={CompanyProfileCardStyle.EngagementType}>
                <span style={{ fontWeight: "500" }}>
                  {allApiData?.transparentModel?.EngagementText}
                     
                </span>
              </div>}
             
              <div className={CompanyProfileCardStyle.category}>
                <span>Company Category:</span>&nbsp;&nbsp;
                <span style={{ fontWeight: "500" }}>
                  {allApiData?.companyCategory
                    ? allApiData?.companyCategory
                    : "NA"}
                </span>
              </div>           
            </div>
          </div>
          {/* Job type pay pre hire */}
          {allApiData?.IsPayPerHire && allApiData?.transparentModel?.JobType?.length > 0 &&  <>
                <Divider
            style={{
              margin: "10px 0",
            }}
          />
          <div className={CompanyProfileCardStyle.EngagementType}>
                <span>Job Type:</span>&nbsp;&nbsp;
               <div>  {allApiData?.transparentModel?.JobType.map(jobtype=>
               <>
               <span style={{ fontWeight: "500" }}>{jobtype}</span>&nbsp;&nbsp;<br/>
               </>   
                )}</div>
              </div>
             
              </>}

          {/* Job type pay pre credit */}
          {allApiData?.IsPayPerCredit && allApiData?.PayPerCreditModel?.JobType?.length > 0 &&  <>
                <Divider
            style={{
              margin: "10px 0",
            }}
          />
          <div className={CompanyProfileCardStyle.EngagementType}>
                <span>Job Type:</span>&nbsp;&nbsp;
               <div>  {allApiData?.PayPerCreditModel?.JobType.map(jobtype=>
               <>
               <span style={{ fontWeight: "500" }}>{jobtype}</span>&nbsp;&nbsp;<br/>
               </>   
                )}</div>
              </div>
             
              </> }
          <Divider
            style={{
              margin: "10px 0",
            }}
          />

          <div
            className={`${CompanyProfileCardStyle.partWise} ${CompanyProfileCardStyle.partWiseList}`}
          >
            <div style={{ marginBottom: "10px" }}>
              <div className={CompanyProfileCardStyle.TR}>
                <span>Total TR:</span>&nbsp;&nbsp;
                <span style={{ fontWeight: "500" }}>
                  {clientDetail?.NoOfTalents ? clientDetail?.NoOfTalents : "NA"}
                </span>
              </div>

              <div className={CompanyProfileCardStyle.TR}>
                <span>Active TR:</span>&nbsp;&nbsp;
                <span style={{ fontWeight: "500" }}>
                  {clientDetail?.ActiveTR}
                </span>
                {
                // apiData !== "Cancelled" &&
                //   apiData !== "Completed" &&
                //   apiData !== "Lost" &&
                //   (userSessionMemo?.loggedInUserTypeID ===
                //     UserAccountRole.DEVELOPER ||
                //     userSessionMemo?.loggedInUserTypeID ===
                //       UserAccountRole.ADMINISTRATOR ||
                //     userSessionMemo?.loggedInUserTypeID ===
                //       UserAccountRole.SALES ||
                //     userSessionMemo?.loggedInUserTypeID ===
                //       UserAccountRole.SALES_MANAGER) && (allApiData?.ReplaceOnBoardID === null || allApiData?.ReplaceOnBoardID === 0 ) && clientDetail?.CompanyTypeID === 1 
                allApiData?.dynamicCTA?.UpdateTR?.IsEnabled  &&  (
                    <button
                      onClick={() => {
                        setUpdateTR(true);
                        getHRDetails();
                      }}
                    >
                      Update TR
                    </button>
                  )}
              </div>
              {/* <div className={CompanyProfileCardStyle.TRParked}>
				<span>TR Parked:</span>&nbsp;&nbsp;
				<span style={{ fontWeight: '500' }}>
					{clientDetail?.TR_Accepted ? clientDetail?.TR_Accepted : 'NA'}
				</span>
			</div> */} 
              {/* <div className={CompanyProfileCardStyle.roleName}>
                <span>Role Name:</span>&nbsp;&nbsp;
                <span style={{ fontWeight: "500" }}>
                  {clientDetail?.Role ? clientDetail?.Role : "NA"}
                </span>
              </div> */}
               <div className={CompanyProfileCardStyle.roleName}>
                <span>Position:</span>&nbsp;&nbsp;
                <span style={{ fontWeight: "500" }}>
                  {clientDetail?.HRTitle ? userSessionMemo?.loggedInUserTypeID ===
                    UserAccountRole.DEVELOPER ||
                    userSessionMemo?.loggedInUserTypeID ===
                      UserAccountRole.ADMINISTRATOR ? `${clientDetail?.HRTitle} ${clientDetail?.Role && `(${clientDetail?.Role})`}` : clientDetail?.HRTitle : "NA"}
                </span>
              </div>
              {/* {!allApiData?.Is_HRTypeDP ? <div className={CompanyProfileCardStyle.contactDuration}>
				<span>Contact Duration:</span>&nbsp;&nbsp;
				<span style={{ fontWeight: '500' }}>
					{clientDetail?.SpecificMonth
						? clientDetail?.SpecificMonth
						: 0}{' '}
					Months
				</span>
			</div> : <div className={CompanyProfileCardStyle.contactDuration}>
				<span>Contract Type:</span>&nbsp;&nbsp;
				<span style={{ fontWeight: '500' }}>
				Direct Placement
				</span>
			</div> } */}

             {clientDetail?.MinYearOfExp !== 0 && <div className={CompanyProfileCardStyle.minExp}>
                <span>Minimum Exp Required:</span>&nbsp;&nbsp;
                <span style={{ fontWeight: "500" }}>
                  {clientDetail?.MinYearOfExp ? clientDetail?.MinYearOfExp : 0}{" "}
                  Years
                </span>
              </div>} 
              <div className={CompanyProfileCardStyle.minExp}>
                <span>Fresher Allowed:</span>&nbsp;&nbsp;
                <span style={{ fontWeight: "500" }}>
                  {allApiData?.HRDetails?.IsFresherAllowed ? "YES" : "NO"}
                </span>
              </div>
              <div className={CompanyProfileCardStyle.minExp}>
                <span>Currency:</span>&nbsp;&nbsp;
                <span style={{ fontWeight: "500" }}>
                 {allApiData?.HRDetails?.Currency ?? "NA"}
                </span>
              </div>
              {/* budget for pay per Hire */}
              {allApiData?.IsPayPerHire && <div className={CompanyProfileCardStyle.budget}>
                {/* <span>{`${allApiData?.transparentModel?.IsTransparentPricing ? 'Salary' : ''} Budget` } :</span>&nbsp;&nbsp;            
                <span style={{ fontWeight: "500" }}>
                  {clientDetail?.Cost ? clientDetail?.Cost : "NA"}
                </span> */}

                <span>{allApiData?.transparentModel?.BudgetTitle ? allApiData?.transparentModel?.BudgetTitle : allApiData?.BudgetTitle} :</span>&nbsp;&nbsp;
                <span style={{ fontWeight: "500" }}>{allApiData?.transparentModel?.BudgetText ? allApiData?.transparentModel?.BudgetText : allApiData?.BudgetText}</span>
                {allApiData?.transparentModel?.PayPerHire_I_Info?.length > 0 && <Tooltip
							placement="bottomLeft"
							title={<div>
                {allApiData?.transparentModel?.PayPerHire_I_Info?.map(item=> <p>{item}</p>)}
  
              </div>}>
								<img src={infoIcon} alt='info' style={{marginLeft:'auto'}} />							
						</Tooltip>}
                
              </div>}
              {/* budget for pay per credit */}  
              {allApiData?.IsPayPerCredit &&  <div className={CompanyProfileCardStyle.budget}>
                <span>{allApiData?.PayPerCreditModel?.BudgetTitle ? allApiData?.PayPerCreditModel?.BudgetTitle : allApiData?.BudgetTitle} :</span>&nbsp;&nbsp;
                <span style={{ fontWeight: "500" }}>{allApiData?.PayPerCreditModel?.BudgetText ? allApiData?.PayPerCreditModel?.BudgetText : allApiData?.BudgetText}</span>              
              </div>}

              
              {/* <div className={CompanyProfileCardStyle.budget}>
                <span>Estimated Uplers Fees:</span>&nbsp;&nbsp;
                <span style={{ fontWeight: "500" }}>
                  {allApiData?.transparentModel?.CalculatedUplersfees ? allApiData?.transparentModel?.CalculatedUplersfees : "NA"}
                </span>
              </div> */}
               <div className={CompanyProfileCardStyle.engagement}>
                <span>Is budget confidential:</span>&nbsp;&nbsp;
                <span style={{ fontWeight: "500" }}>
                  {allApiData?.HRDetails?.IsConfidentialBudget ? "YES" : "NO" }
                </span>
              </div>
              <div className={CompanyProfileCardStyle.engagement}>
                <span>Engagement:</span>&nbsp;&nbsp;
                <span style={{ fontWeight: "500" }}>
                  {clientDetail?.Availability
                    ? clientDetail?.Availability
                    : "NA"}
                </span>
              </div>
              {/* <div className={CompanyProfileCardStyle.geo}>
                <span>Geo:</span>&nbsp;&nbsp;
                <span style={{ fontWeight: "500" }}>
                  {clientDetail?.GEO ? clientDetail?.GEO : "NA"}
                </span>
              </div> */}
              <div className={CompanyProfileCardStyle.preferredShift}>
                <span>Preferred Time Zone:</span>&nbsp;&nbsp;
                <span style={{ fontWeight: "500" }}>
                  {clientDetail?.TimeZone ? clientDetail?.TimeZone : "NA"}
                </span>
              </div>
              <div className={CompanyProfileCardStyle.preferredTime}>
                <span>Preferred Time:</span>&nbsp;&nbsp;
                <span style={{ fontWeight: "500" }}>
                  {clientDetail?.FromTimeAndToTime
                    ? clientDetail?.FromTimeAndToTime
                    : "NA"}
                </span>
              </div>
              <div className={CompanyProfileCardStyle.preferredTime}>
                <span>Mode of Work:</span>&nbsp;&nbsp;
                <span style={{ fontWeight: "500" }}>
                  {clientDetail?.ModeOfWork || "NA"}
                </span>
              </div>
              {clientDetail?.ModeOfWork !== 'Remote' && <div className={CompanyProfileCardStyle.preferredTime}>
                <span>City:</span>&nbsp;&nbsp;
                <span style={{ fontWeight: "500" }}>
                  {clientDetail?.City || "NA"}
                </span>
              </div>}
              <div className={CompanyProfileCardStyle.jdLink}>
                {clientDetail?.NeedToCallAWSBucket ? <>
                  <span>Download JD:</span>&nbsp;&nbsp;
                  <span style={{ fontWeight: "500" }} onClick={()=>{ 
                    DownloadJDFile(clientDetail.jd_file_aws_url)
                  }}>
                    click Here
                  </span>
                </> :
                <>
                  <span>JD Link:</span>&nbsp;&nbsp;
                <span style={{ fontWeight: "500" }}>
                  {clientDetail?.JDFileOrURL === "JDFILE" ? (
                    clientDetail?.JobDetail?.split(":")[0] === "http" ||
                    clientDetail?.JobDetail?.split(":")[0] === "https" ? (
                      <a
                        rel="noreferrer"
                        href={clientDetail?.JobDetail}
                        style={{ textDecoration: "underline" }}
                        target="_blank"
                      >
                        Click Here
                      </a>
                    ) : clientDetail?.JobDetail ? (
                      <a
                        rel="noreferrer"
                        href={
                          NetworkInfo.PROTOCOL +
                          NetworkInfo.DOMAIN +
                          "Media/JDParsing/JDfiles/" +
                          clientDetail?.JobDetail
                        }
                        style={{ textDecoration: "underline" }}
                        target="_blank"
                      >
                        Click Here
                      </a>
                    ) : 'NA'
                  ): clientDetail?.JDFileOrURL === "JDURL" ? (
                    <a
                      rel="noreferrer"
                      href={clientDetail?.JobDetail}
                      style={{ textDecoration: "underline" }}
                      target="_blank"
                    >
                      Click Here
                    </a>
                  )   : (
                    "NA"
                  )}
                </span>
                </>
                }
              
              </div>
              <div className={CompanyProfileCardStyle.TRParked}>
                <span>Behavioral Questions:</span>&nbsp;&nbsp;
                <span style={{ fontWeight: "500" }}>
                  {clientDetail?.BQLink ? (
                    <a
                      target="_blank"
                      href={clientDetail?.BQLink}
                      style={{ textDecoration: "underline" }}
                      rel="noreferrer"
                    >
                      Click Here
                    </a>
                  ) : (
                    "NA"
                  )}
                </span>
              </div>
              <div className={CompanyProfileCardStyle.TRParked}>
                <span>Discovery Call:</span>&nbsp;&nbsp;
                <span style={{ fontWeight: "500" }}>
                  {clientDetail?.Discovery_Call ? (
                    <a
                      target="_blank"
                      href={clientDetail?.Discovery_Call}
                      style={{ textDecoration: "underline" }}
                      rel="noreferrer"
                    >
                      Click Here
                    </a>
                  ) : (
                    "NA"
                  )}
                </span>
              </div>
              <div className={CompanyProfileCardStyle.TRParked}>
                <span>Additional Information:</span>&nbsp;&nbsp;
                <span style={{ fontWeight: "500" }}>
                  <Link
                    to={`/viewHrDetails/${id?.hrid}`}
                    // to={"/viewHrDetails"}
                    // rel="noreferrer"
                    // target="_blank"
                    // href="#"
                    style={{ textDecoration: "underline" }}
                  >
                    View Complete HR
                  </Link>
                </span>
              </div>
            </div>
          </div>
          <Divider
            style={{
              margin: "10px 0",
            }}
          />
          <div className={CompanyProfileCardStyle.partWise}>
            <div>
              {/* <div className={CompanyProfileCardStyle.pocName}>
                <span>POC Name:</span>&nbsp;&nbsp;
                <span style={{ fontWeight: "500" }}>
                  {clientDetail?.POCFullName ? clientDetail?.POCFullName : "NA"}
                </span>
                &nbsp;&nbsp; */}
                {/*  TODO:- 
				<AiFillLinkedin style={{ color: '#006699' }} /> */}
              {/* </div>
              <div className={CompanyProfileCardStyle.pocEmail}>
                <span>POC Email:</span>&nbsp;&nbsp;
                <span style={{ fontWeight: "500" }}>
                  {clientDetail?.POCEmailID ? clientDetail?.POCEmailID : "NA"}
                </span>
              </div> */}
              <div className={CompanyProfileCardStyle.salesPerson}>
                <span>Sales Person:</span>&nbsp;&nbsp;
                <span style={{ fontWeight: "500" }}>
                  {clientDetail?.SalesPerson ? clientDetail?.SalesPerson : "NA"}
                </span>
              </div>
              <div className={CompanyProfileCardStyle.manager}>
                <span>Manager:</span>&nbsp;&nbsp;
                <span style={{ fontWeight: "500" }}>
                  {clientDetail?.SalesManagerName
                    ? clientDetail?.SalesManagerName
                    : "NA"}
                </span>
              </div>
              <div className={CompanyProfileCardStyle.manager}>
                <span>AM Name:</span>&nbsp;&nbsp;
                <span style={{ fontWeight: "500" }}>
                  {clientDetail?.AM_UserName
                    ? clientDetail?.AM_UserName
                    : "NA"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };


  return (
    <div className={CompanyProfileCardStyle.companyProfileContainer}>
      <Tabs
        onChange={(e) => setTitle(e)}
        defaultActiveKey="1"
        activeKey={title}
        animated={true}
        tabBarGutter={50}
        tabBarStyle={{ borderBottom: `1px solid var(--uplers-border-color)` }}
        items={avalableTabs}
      />
      {/* <label>
				<h1>Company Details</h1>
			</label> */}

      {updateTR && (
        <Modal
          width={"864px"}
          centered
          footer={false}
          open={updateTR}
          className="updateTRModal"
          onCancel={() => setUpdateTR(false)}
        >
          <UpdateTRModal
            updateTR={updateTR}
            setUpdateTR={() => setUpdateTR(true)}
            onCancel={() => setUpdateTR(false)}
            updateTRDetail={updateTRDetail}
            loader={isLoading}
          />
        </Modal>
      )}

      {updateDate && (
        <Modal
          width={"864px"}
          centered
          footer={false}
          open={updateDate}
          className="changeDateModal"
          onCancel={() => setUpdateDate(false)}
        >
          <ChangeDate allApiData={allApiData}  onCancel={()=>setUpdateDate(false)}/>
        </Modal>
      )}
    </div>
  );
};

export default CompanyProfileCard;
