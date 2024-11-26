import React, { useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { Tooltip } from "antd";
import { ReactComponent as ArrowLeftSVG } from "assets/svg/arrowLeft.svg";
import ViewHRDetailsStyle from "../screens/viewHRDetails.module.css";
import { hiringRequestDAO } from "core/hiringRequest/hiringRequestDAO";
import { useState } from "react";
import { NetworkInfo } from "constants/network";
import UTSRoutes from "constants/routes";
import { UserSessionManagementController } from "modules/user/services/user_session_services";
import { UserAccountRole } from "constants/application";
import infoIcon from "assets/svg/info.svg";
import LogoLoader from "shared/components/loader/logoLoader";
import DOMPurify from "dompurify";

const ViewHRDetails = () => {
  const [hiringDetails, setHiringDetails] = useState("");
  const id = useParams();
  const miscData = UserSessionManagementController.getUserMiscellaneousData();
  const [isLoading, setIsloading] = useState(false);
  const navigate = useNavigate();
  const getViewHrDetails = useCallback(async () => {
    setIsloading(true);
    const response = await hiringRequestDAO.viewHRDetailsRequestDAO(id.id);
    setHiringDetails(response);
    setIsloading(false);
  }, [id.id]);

  useEffect(() => {
    getViewHrDetails();
  }, [getViewHrDetails]);

  const editHr = () => {
    localStorage.setItem("hrID", id?.id);
    localStorage.removeItem("dealID");
    navigate(UTSRoutes.ADDNEWHR, { state: { isCloned: true } });
  };

  function testJSON(text) {
    if (typeof text !== "string") {
      return false;
    }
    try {
      JSON.parse(text);
      return true;
    } catch (error) {
      return false;
    }
  }

  function removeDuplicates(arr) {
  const mapFromColors = new Map(
    arr?.map(c => [c.text, c])
  );
  
  const uniqueColors = [...mapFromColors.values()];
  return uniqueColors
  }

  const ShowEditCTA = () => {
    if (hiringDetails?.responseBody?.details?.hrStatus === "Open") {
      return <button onClick={editHr}>Edit HR</button>;
      // if(hiringDetails?.responseBody?.details?.isDirectHR === false){
      // 	return <button onClick={editHr}>Edit HR</button>
      // }
      // else{
      // 	if( miscData?.loggedInUserTypeID === UserAccountRole.TALENTOPS ||
      // 			miscData?.loggedInUserTypeID === UserAccountRole.OPS_TEAM_MANAGER || miscData?.loggedInUserTypeID === UserAccountRole.ADMINISTRATOR  ){
      // 				return <button onClick={()=>navigate(`/EditNewHR/${id.id}`)}>Edit Direct HR</button>
      // 			}
      // 			else{
      // 				return <button disabled>Edit Direct HR</button>
      // 			}
      // }
    }
  };

  const sanitizedDescription = (JobDescription) => {
    return DOMPurify.sanitize(JobDescription, {
        // ALLOWED_TAGS: ['h1', 'h2', 'h3', 'p', 'b', 'strong', 'i', 'em', 'ul', 'ol', 'li', 'a'],
        ALLOWED_ATTR: {
            // '*': ['class'], // Allow class attribute for custom styling
            'a': ['href', 'target'] // Allow href and target for links
        }
    })
  };
  return (
    <>
      <div className={ViewHRDetailsStyle.viewHRDetailsWrap}>
        <div className={ViewHRDetailsStyle.goBack}>
          <Link to={`/allhiringrequest/${id.id}`}>
            <ArrowLeftSVG />
            Go Back
          </Link>
        </div>
        <LogoLoader visible={isLoading} />
        <div className={ViewHRDetailsStyle.viewHRDetailsHead}>
          <h1>{hiringDetails?.responseBody?.details?.hrNumber}</h1>
          {ShowEditCTA()}
          {/* {hiringDetails?.responseBody?.details?.hrStatus === 'Open' &&  
					(hiringDetails?.isDirectHR && (miscData?.loggedInUserTypeID === UserAccountRole.TALENTOPS ||
					miscData?.loggedInUserTypeID === UserAccountRole.OPS_TEAM_MANAGER)) ? <button onClick={()=>navigate(`/EditNewHR/${id.id}`)}>Edit Direct HR</button> 
					 : (hiringDetails?.isDirectHR && (miscData?.loggedInUserTypeID !== UserAccountRole.TALENTOPS ||
						miscData?.loggedInUserTypeID !== UserAccountRole.OPS_TEAM_MANAGER) ) ? null : <button onClick={editHr}>Edit HR</button> } */}
        </div>

        <div className={ViewHRDetailsStyle.viewHRDetailsItem}>
          <div className={ViewHRDetailsStyle.viewHRLeftDetails}>
            <h2>Hiring Request Details</h2>
            <p>
              The Talents would be able to see
              <br /> fields highlighted in blue bullets.
            </p>
          </div>
          <div className={ViewHRDetailsStyle.viewHRRightDetails}>
            <div className={ViewHRDetailsStyle.viewHRDetailsBoxWrap}>
              <div className={ViewHRDetailsStyle.row}>
                <div className={ViewHRDetailsStyle.colLg6}>
                  <div className={ViewHRDetailsStyle.viewHRDetailsBox}>
                    <ul>
                      <li>
                        <span>Client Email/Name:</span>{" "}
                        {hiringDetails?.responseBody?.details?.clientName ??
                          "NA"}
                      </li>
                      {/* <li>
												<span>Hiring Request Role:</span>{' '}
												{hiringDetails?.responseBody?.details
													?.hiringRequestRole ?? 'NA'}
											</li> */}
						{/* <li style={{display:'flex'}}>
                        <span>About Company:</span>{" "}
                         {hiringDetails?.responseBody?.details?.aboutCompanyDesc?? "NA"} 
                        {hiringDetails?.responseBody?.details?.aboutCompanyDesc? <div style={{marginLeft:'5px'}} dangerouslySetInnerHTML={{__html:hiringDetails?.responseBody?.details?.aboutCompanyDesc}}></div> : "NA"}
                        <i className={ViewHRDetailsStyle.blueDot} />
                      </li>					 */}
                      <li>
                        <span>Sales Person:</span>{" "}
                        {hiringDetails?.responseBody?.details?.salesPerson ??
                          "NA"}
                      </li>
                      {hiringDetails?.responseBody?.details?.isPayPerHire && <li>
                        <span>Contract Type:</span>{" "}
                        {hiringDetails?.responseBody?.details?.contractType ??
                          "NA"}
                      </li>}
                      
                      <li>
                        <span>Availibilty:</span>{" "}
                        {hiringDetails?.responseBody?.details?.availability ??
                          "NA"}
                      </li>

                      {/*  job type pay per cedit  */}
                      {hiringDetails?.responseBody?.details?.isPayPerHire && hiringDetails?.responseBody?.details?.transparentModel
                        ?.jobType && (
                        <li style={{ display: "flex" }}>
                          <span>Job Type:</span>{" "}
                          <div>
                            {hiringDetails?.responseBody?.details?.transparentModel?.jobType.map(
                              (item) => (
                                <p>{item}</p>
                              )
                            )}
                          </div>
                        </li>
                      )}

                       {/*  job type pay per cedit  */}
                       {hiringDetails?.responseBody?.details?.isPayPerCredit && hiringDetails?.responseBody?.details?.payPerCreditModel
                        ?.jobType && (
                        <li style={{ display: "flex" }}>
                          <span>Job Type:</span>{" "}
                          <div>
                            {hiringDetails?.responseBody?.details?.payPerCreditModel?.jobType.map(
                              (item) => (
                                <p>{item}</p>
                              )
                            )}
                          </div>
                        </li>
                      )}

                      <li>
                        <span>Engagement Type:</span>{" "}

                        { (hiringDetails?.responseBody?.details?.isPayPerHire) && (hiringDetails?.responseBody?.details?.transparentModel
                          ?.hrTypePricing ?? "NA")}{" "}
                          { (hiringDetails?.responseBody?.details?.isPayPerCredit) && (hiringDetails?.responseBody?.details?.payPerCreditModel
                          ?.engagementType ?? "NA")}
                        <i className={ViewHRDetailsStyle.blueDot} />
                      </li>
                      {/* <li>
												{hiringDetails?.responseBody?.details?.transparentModel.isTransparentPricing ?<><span>Estimated Client Need To Pay:</span>{' '}
												{hiringDetails?.responseBody?.details?.transparentModel.clientNeedsToPay
													?? 'NA'}{' '}
												
												<i className={ViewHRDetailsStyle.blueDot} />
												</>
												
											:<>
											<span>Talent Estimated Pay:</span>{' '}
												{hiringDetails?.responseBody?.details?.transparentModel
													?.talentsPay
													?? 'NA'}{' '}
												
												<i className={ViewHRDetailsStyle.blueDot} />
											</>
											
											}
												
											</li> */}
                      <li>
                        <span>Contract Duration:</span>{" "}
                        {hiringDetails?.responseBody?.details?.contractDuration
                          ? hiringDetails?.responseBody?.details
                              ?.contractDuration === -1
                            ? "Indefinite"
                            : `${hiringDetails?.responseBody?.details?.contractDuration} Months`
                          : "NA"}{" "}
                        <i className={ViewHRDetailsStyle.blueDot} />
                      </li>
                      <li>
                        <span>How Many Talent Request:</span>{" "}
                        {hiringDetails?.responseBody?.details?.noOfTalents ??
                          "NA"}
                      </li>
                      {/* <li>
												<span>Region:</span>{' '}
												{hiringDetails?.responseBody?.details?.region ?? 'NA'}
												<i className={ViewHRDetailsStyle.blueDot} />
											</li> */}
                      <li>
                        <span>Time Zone:</span>{" "}
                        {hiringDetails?.responseBody?.details?.timeZone ?? "NA"}
                        <i className={ViewHRDetailsStyle.blueDot} />
                      </li>
                      {hiringDetails?.responseBody?.details?.isPayPerHire === true &&   <li>
                        <span>How Soon:</span>{" "}
                        {hiringDetails?.responseBody?.details?.howSoon ?? "NA"}
                      </li>}
                     

                      <li>
                        <span>HR Form Link:</span>{" "}
                        {hiringDetails?.responseBody?.details?.bqLink ? (
                          <a
                            href={hiringDetails?.responseBody?.details?.bqLink}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Click Here
                          </a>
                        ) : (
                          "NA"
                        )}
                      </li>
                    </ul>
                  </div>
                </div>
                <div className={ViewHRDetailsStyle.colLg6}>
                  <div className={ViewHRDetailsStyle.viewHRDetailsBox}>
                    <ul>
                      <li>
                        <span>Company Name:</span>{" "}
                        {hiringDetails?.responseBody?.details?.company ?? "NA"}
                        <i className={ViewHRDetailsStyle.blueDot} />
                      </li>
                      <li>
                        <span>Role Title:</span>{" "}
                        {hiringDetails?.responseBody?.details
                          ?.hiringRequestTitle
                          ? miscData?.loggedInUserTypeID ===
                              UserAccountRole.DEVELOPER ||
                            miscData?.loggedInUserTypeID ===
                              UserAccountRole.ADMINISTRATOR
                            ? `${
                                hiringDetails?.responseBody?.details
                                  ?.hiringRequestTitle
                              }   ${
                                hiringDetails?.responseBody?.details
                                  ?.hiringRequestRole &&
                                `( ${hiringDetails?.responseBody?.details?.hiringRequestRole} )`
                              } `
                            : hiringDetails?.responseBody?.details
                                ?.hiringRequestTitle
                          : "NA"}
                        <i className={ViewHRDetailsStyle.blueDot} />
                      </li>
                      {!hiringDetails?.responseBody?.details?.isPayPerCredit && <li>
                        <span>Transparent Pricing:</span>{" "}
                        {hiringDetails?.responseBody?.details?.transparentModel
                          ?.isTransparentPricing
                          ? "Yes"
                          : "No"}
                        <i className={ViewHRDetailsStyle.blueDot} />
                      </li>}
                      

                      {(hiringDetails?.responseBody?.details?.transparentModel?.payPerHire_I_Info?.length === 0) ?
                      hiringDetails?.responseBody?.details?.contractType ===
                        "Direct Placement" ? (
                        <li>
                          <span>Uplers Fees:</span>{" "}
                          {hiringDetails?.responseBody?.details?.dpPercentage ??
                            "NA"}{" "}
                          %
                        </li>
                      ) : (
                        <li>
                          <span>Uplers Fees:</span>{" "}
                          {hiringDetails?.responseBody?.details?.nrPercetange ??
                            "NA"}{" "}
                          %
                        </li>
                      ): null }

                      {hiringDetails?.responseBody?.details?.transparentModel
                        ?.payrollType && (
                        <li>
                          <span>Payroll Type:</span>{" "}
                          {hiringDetails?.responseBody?.details
                            ?.transparentModel?.payrollType ?? "NA"}
                          <i className={ViewHRDetailsStyle.blueDot} />
                        </li>
                      )}

                      {hiringDetails?.responseBody?.details?.transparentModel
                        ?.payrollTypeId === 3 && (
                        <li>
                          <span>Payroll Partner Name:</span>{" "}
                          {hiringDetails?.responseBody?.details
                            ?.transparentModel?.payrollPartnerName ?? "NA"}
                          <i className={ViewHRDetailsStyle.blueDot} />
                        </li>
                      )}
                      {/* {hiringDetails?.responseBody?.details?.transparentModel
                        ?.calculatedUplersfees && (
                        <li>
                          <span>Estimated Uplers Fees Amount:</span>{" "}
                          {hiringDetails?.responseBody?.details
                            ?.transparentModel?.calculatedUplersfees ?? "NA"}
                          <i className={ViewHRDetailsStyle.blueDot} />
                        </li>
                      )} */}

                      {/* <li>
                        <span>JD URL:</span>{" "}
                        {hiringDetails?.responseBody?.details?.jdurl ? (
                          <a
                            rel="noreferrer"
                            href={hiringDetails?.responseBody?.details?.jdurl}
                            target="_blank"
                          >
                            Click Here
                          </a>
                        ) : (
                          "NA"
                        )}
                      </li> */}
                      {/* <li>
												<span>Estimated {hiringDetails?.responseBody?.details?.transparentModel?.isTransparentPricing ? "Salary" : null} Budget:</span>{' '}
												{hiringDetails?.responseBody?.details?.hiringCost ??
													'NA'}
												<i className={ViewHRDetailsStyle.blueDot} />
											</li> */}
					{hiringDetails?.responseBody?.details?.hrNumber && <>
          {hiringDetails?.responseBody?.details?.isPayPerHire &&  <li style={{display:'flex'}}>
                        <span>
                          {hiringDetails?.responseBody?.details
                            ?.transparentModel?.budgetTitle
                            ? `${hiringDetails?.responseBody?.details?.transparentModel?.budgetTitle}: `
                            : `${hiringDetails?.responseBody?.details?.budgetTitle}: `}
                        </span>{" "}
                        <div style={{width:'70%',display:'flex', marginLeft:'5px'}}>{hiringDetails?.responseBody?.details?.transparentModel
                          ?.budgetText
                          ? hiringDetails?.responseBody?.details
                              ?.transparentModel?.budgetText
                          : hiringDetails?.responseBody?.details?.budgetText}
                        {hiringDetails?.responseBody?.details?.transparentModel?.payPerHire_I_Info?.length > 0 && (
							
								 <Tooltip
                            placement="bottomLeft"
                            title={
                              <div>
                                {hiringDetails?.responseBody?.details?.transparentModel?.payPerHire_I_Info?.map(
                                  (item) => (
                                    <p>{item}</p>
                                  )
                                )}
                              </div>
                            }
                          >
                            <img
                              src={infoIcon}
                              alt="info"
                              style={{ marginLeft: "auto",width: '24px',
                              height: '24px' }}
                            />
                          </Tooltip>
							
                         
                        )}</div>
                      </li>}

                      {hiringDetails?.responseBody?.details?.isPayPerCredit &&  <li style={{display:'flex'}}>
                        <span>
                          {hiringDetails?.responseBody?.details
                            ?.payPerCreditModel?.budgetTitle
                            ? `${hiringDetails?.responseBody?.details?.payPerCreditModel?.budgetTitle}: `
                            : `${hiringDetails?.responseBody?.details?.budgetTitle}: `}
                        </span>
                        <div style={{width:'70%',display:'flex', marginLeft:'5px'}}>{hiringDetails?.responseBody?.details?.payPerCreditModel
                          ?.budgetText
                          ? hiringDetails?.responseBody?.details
                              ?.payPerCreditModel?.budgetText
                          : hiringDetails?.responseBody?.details?.budgetText}
                        </div>
                      </li>}
          </> }

          <li>
                        <span>Is budget confidential :</span>{" "}
                        {hiringDetails?.responseBody?.details?.isConfidentialBudget ? "YES" : "NO"}
                      </li>
                      <li>
                        <span>Currency :</span>{" "}
                        {hiringDetails?.responseBody?.details?.currency ??
                          "NA"}
                      </li>
                     {(hiringDetails?.responseBody?.details?.isFresherAllowed === false && hiringDetails?.responseBody?.details?.requiredExperienceYear !== null) &&  <li>
                        <span>Required Experience:</span>{" "}
                        {hiringDetails?.responseBody?.details
                          ?.requiredExperienceYear ?? "NA"}{" "}
                        Years
                        <i className={ViewHRDetailsStyle.blueDot} />
                      </li>}
                     
                      <li>
                        <span>Mode of Work:</span>{" "}
                        {/* {hiringDetails?.responseBody?.details?.dealID !== 0  ? hiringDetails?.responseBody?.details?.dealID : 'NA'} */}
                        {hiringDetails?.responseBody?.details
                          ?.directHRModeOfWork ?? "Remote"}
                      </li>
                      {(hiringDetails?.responseBody?.details
                        ?.directHRModeOfWork === "Office" ||
                        hiringDetails?.responseBody?.details
                          ?.directHRModeOfWork === "Hybrid") && (
                        <>
                          <li>
                            <span>Address:</span>{" "}
                            {/* {`${hiringDetails?.responseBody?.details?.address } ${hiringDetails?.responseBody?.details?.city} ${hiringDetails?.responseBody?.details?.state} ${hiringDetails?.responseBody?.details?.country} ${hiringDetails?.responseBody?.details?.postalCode}`} */}
                            {`${hiringDetails?.responseBody?.details?.city} ${hiringDetails?.responseBody?.details?.country}`}
                          </li>
                        </>
                      )}
                      <li>
                        <span>Discovery Call:</span>{" "}
                        {hiringDetails?.responseBody?.details?.discoveryCall ? (
                          <a
                            href={
                              hiringDetails?.responseBody?.details
                                ?.discoveryCall
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            Click Here
                          </a>
                        ) : (
                          "NA"
                        )}
                      </li>
                    
                      <li>
                        <span>Fresher Allowed:</span>{" "}
                        {(hiringDetails?.responseBody?.details?.isFresherAllowed || hiringDetails?.responseBody?.details?.requiredExperienceYear === null) ? "Yes" : "NO"}
                      </li> 
                    </ul>
                  </div>
                </div>
              </div>
           
             
            </div>

            {!hiringDetails?.responseBody?.details?.additionalDetails &&   <div className={ViewHRDetailsStyle.viewHRDetailsBox} style={{marginTop:'10px'}}>
              <h3>
              About Company
                <i className={ViewHRDetailsStyle.blueDot} />
              </h3>
              {hiringDetails?.responseBody?.details?.aboutCompanyDesc? <div className="jobDescrition" dangerouslySetInnerHTML={{__html:hiringDetails?.responseBody?.details?.aboutCompanyDesc}}></div> : "NA"}
               
                 
              </div>}
          
          </div>
        </div>

        <div className={ViewHRDetailsStyle.viewHRDetailsItem}>
          <div className={ViewHRDetailsStyle.viewHRLeftDetails}>
            <h2>Interviewer Details</h2>
          </div>
          <div
            className={`${ViewHRDetailsStyle.viewHRRightDetails} ${ViewHRDetailsStyle.viewHRIntList}`}
          >
            <div className={ViewHRDetailsStyle.row}>
              {hiringDetails?.responseBody?.details?.interviewerlList?.map(
                (item) => {
                  return (
                    <div className={ViewHRDetailsStyle.colLg6}>
                      <div className={ViewHRDetailsStyle.viewHRDetailsBox}>
                        <h3>
                          Interviewer: {item?.interviewerFullName ?? "NA"}
                        </h3>
                        <ul>
                          <>
                            <li>
                              <span>Interviewer Name:</span>{" "}
                              {item?.interviewerFullName ?? "NA"}
                            </li>
                            <li>
                              <span>Interviewer Linkedin:</span>{" "}
                              {item?.interviewerLinkedin === null ||
                              !item?.interviewerLinkedin ||
                              item?.interviewerLinkedin === "NA" ? (
                                "NA"
                              ) : (
                                <a
                                  href={item?.interviewerLinkedin}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  Click Here
                                </a>
                              )}
                            </li>
                            <li>
                              <span>Interviewer Email:</span>{" "}
                              {item?.interviewerEmail ?? "NA"}
                            </li>
                            <li>
                              <span>Interviewer Designation:</span>{" "}
                              {item.interviewerDesignation ?? "NA"}
                            </li>
                          </>
                        </ul>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>

        <div className={ViewHRDetailsStyle.viewHRDetailsItem}>
          <div className={ViewHRDetailsStyle.viewHRLeftDetails}>
            <h3>Job Description</h3>
            <p>
              The Talents would be able to see
              <br /> fields highlighted in blue bullets.
            </p>
          </div>
          <div className={ViewHRDetailsStyle.viewHRRightDetails}>
            {/* <div className={ViewHRDetailsStyle.viewHRDetailsBox}>
              <h3>
                Requirements
                <i className={ViewHRDetailsStyle.blueDot} />
              </h3>
              {hiringDetails?.responseBody?.details?.guid ? (
                testJSON(hiringDetails?.responseBody?.details?.requirments) ? (
                  <div className={ViewHRDetailsStyle.viewHrJDDetailsBox}>
                    <ul>
                      {JSON.parse(
                        hiringDetails?.responseBody?.details?.requirments
                      ).map((text) => (
                        <li dangerouslySetInnerHTML={{ __html: text }} />
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div
                    className={ViewHRDetailsStyle.viewHrJDDetailsBox}
                    dangerouslySetInnerHTML={{
                      __html: hiringDetails?.responseBody?.details?.requirments,
                    }}
                  />
                )
              ) : (
                <div
                  className={ViewHRDetailsStyle.viewHrJDDetailsBox}
                  dangerouslySetInnerHTML={{
                    __html: hiringDetails?.responseBody?.details?.requirments,
                  }}
                />
              )}
            </div>

            <div className={ViewHRDetailsStyle.viewHRDetailsBox}>
              <h3>
                Roles & Responsibilities
                <i className={ViewHRDetailsStyle.blueDot} />
              </h3>
              {hiringDetails?.responseBody?.details?.guid ? (
                testJSON(
                  hiringDetails?.responseBody?.details?.rolesResponsibilites
                ) ? (
                  <div className={ViewHRDetailsStyle.viewHrJDDetailsBox}>
                    <ul>
                      {JSON.parse(
                        hiringDetails?.responseBody?.details
                          ?.rolesResponsibilites
                      ).map((text) => (
                        <li dangerouslySetInnerHTML={{ __html: text }} />
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div
                    className={ViewHRDetailsStyle.viewHrJDDetailsBox}
                    dangerouslySetInnerHTML={{
                      __html:
                        hiringDetails?.responseBody?.details
                          ?.rolesResponsibilites,
                    }}
                  />
                )
              ) : (
                <div
                  className={ViewHRDetailsStyle.viewHrJDDetailsBox}
                  dangerouslySetInnerHTML={{
                    __html:
                      hiringDetails?.responseBody?.details
                        ?.rolesResponsibilites,
                  }}
                />
              )}
            </div> */}

            <div className={ViewHRDetailsStyle.viewHRDetailsBox}>
              <h3>
                Job Description
                <i className={ViewHRDetailsStyle.blueDot} />
              </h3>
              {hiringDetails?.responseBody?.details?.guid ?
               (
                testJSON(
                  hiringDetails?.responseBody?.details?.job_Description
                ) ? (
                  <div 
                  className={ViewHRDetailsStyle.viewHrJDDetailsBox}  
                  >
                    <div className="jobDescrition">
                    <ul>
                      {JSON.parse(
                        hiringDetails?.responseBody?.details
                          ?.job_Description
                      ).map((text) => (
                        <li dangerouslySetInnerHTML={{ __html: sanitizedDescription(text) }} />
                      ))}
                    </ul>
                    </div>
                  </div>
                ) : (
                  <div
                    className={ViewHRDetailsStyle.viewHrJDDetailsBox}
                    dangerouslySetInnerHTML={{
                      __html:sanitizedDescription( hiringDetails?.responseBody?.details?.job_Description)                       
                    }}
                  />
                )
              ) : 
              (
                  <div
                    className={ViewHRDetailsStyle.viewHrJDDetailsBox}
                    dangerouslySetInnerHTML={{
                      __html: sanitizedDescription( hiringDetails?.responseBody?.details?.job_Description)
                    }}
                  />
                )               
              // (
              //   <div
              //     className={ViewHRDetailsStyle.viewHrJDDetailsBox}
              //     dangerouslySetInnerHTML={{
              //       __html:
              //         hiringDetails?.responseBody?.details
              //           ?.job_Description,
              //     }}
              //   />
              // )
              }
            </div>

            <div className={ViewHRDetailsStyle.viewHRDetailsBox}>
              <h3>
                Must have skills
                <i className={ViewHRDetailsStyle.blueDot} />
              </h3>
              <div className={ViewHRDetailsStyle.skillsList}>
                {hiringDetails?.responseBody?.details.requiredSkillList
                  ?.length === 0 ? (
                  <p>NA</p>
                ) : (
                  removeDuplicates(hiringDetails?.responseBody?.details.requiredSkillList)?.map(
                    (item) => {
                      return <span>{item?.text}</span>;
                    }
                  )
                )}
              </div>
            </div>

            <div className={ViewHRDetailsStyle.viewHRDetailsBox}>
              <h3>
                Good To Have Skills
                <i className={ViewHRDetailsStyle.blueDot} />
              </h3>
              <div className={ViewHRDetailsStyle.skillsList}>
                {hiringDetails?.responseBody?.details.goodToHaveSkillList
                  ?.length === 0 ? (
                  <p>NA</p>
                ) : (
                  removeDuplicates(hiringDetails?.responseBody?.details.goodToHaveSkillList)?.map(
                    (item) => {
                      return <span>{item?.text}</span>;
                    }
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {hiringDetails?.responseBody?.details?.additionalDetails && (
          <>
            <div className={ViewHRDetailsStyle.viewHRDetailsItem}>
              <div className={ViewHRDetailsStyle.viewHRLeftDetails}>
                <h3>Additional Questions</h3>
                <p>
                  The Talents would be able to see fields highlighted in blue
                  bullets.
                </p>
              </div>

              <div className={ViewHRDetailsStyle.viewHRRightDetails}>
                <div className={ViewHRDetailsStyle.viewHRDetailsBox}>
                  <ul>
                    <li>
                      <span>
                        Does this role require line management
                        responsibilities?:
                      </span>{" "}
                      {hiringDetails?.responseBody?.details?.additionalDetails
                        ?.isLineManagerReq
                        ? "Yes"
                        : "No"}
                    </li>
                    <li>
                      <span>
                        Is it a replacement for your existing team member or is
                        it a new position?:
                      </span>{" "}
                      {hiringDetails?.responseBody?.details?.additionalDetails
                        ?.isTeamMemberReplacement
                        ? "This is a replacement"
                        : "This is a new position"}
                    </li>
                  </ul>
                </div>
                <div className={ViewHRDetailsStyle.viewHRDetailsBox}>
                  <h3>What is the career progression path of this role?</h3>
                  <div className={ViewHRDetailsStyle.viewHrJDDetailsBox}>
                    {
                      hiringDetails?.responseBody?.details?.additionalDetails
                        ?.careerProgressionPath
                    }
                  </div>
                </div>
                <div className={ViewHRDetailsStyle.viewHRDetailsBox}>
                  <h3>What were the benefits and challenges of it.</h3>
                  <div className={ViewHRDetailsStyle.viewHrJDDetailsBox}>
                    {
                      hiringDetails?.responseBody?.details?.additionalDetails
                        ?.benefitsandChallenges
                    }
                  </div>
                </div>
                <div className={ViewHRDetailsStyle.viewHRDetailsBox}>
                  <h3>
                    What is an Interview process? Will there be any assessments?
                  </h3>
                  <div className={ViewHRDetailsStyle.viewHrJDDetailsBox}>
                    {
                      hiringDetails?.responseBody?.details?.additionalDetails
                        ?.interviewProcess
                    }
                  </div>
                </div>
              </div>
            </div>

            <div className={ViewHRDetailsStyle.viewHRDetailsItem}>
              <div className={ViewHRDetailsStyle.viewHRLeftDetails}>
                <h3>About Company</h3>
                <p>
                  The Talents would be able to see fields highlighted in blue
                  bullets.
                </p>
              </div>

              <div className={ViewHRDetailsStyle.viewHRRightDetails}>
                <div className={ViewHRDetailsStyle.viewHRDetailsBox}>
                  <div className={ViewHRDetailsStyle.row}>
                    <div className={ViewHRDetailsStyle.colLg6}>
                      <ul>
                        <li>
                          <span>Industry:</span>{" "}
                          {/* {
                            hiringDetails?.responseBody?.details
                              ?.additionalDetails?.industry_Type
                          } */}
                          {hiringDetails?.responseBody?.details
                              ?.companyInfo?.industry}
                          <i className={ViewHRDetailsStyle.blueDot} />
                        </li>
                        <li>
                          <span>Company URL:</span>{" "}
                          <a
                            // href={
                            //   hiringDetails?.responseBody?.details
                            //     ?.additionalDetails?.contactsLinkedInProfile
                            // }
                            href={hiringDetails?.responseBody?.details?.companyInfo?.website}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Click Here
                          </a>
                        </li>
                        <li>
                          <span>
                            Does client have experience hiring talent outside of
                            their home country, especially from offshore
                            locations like India?:
                          </span>{" "}
                          {/* {hiringDetails?.responseBody?.details?.additionalDetails?.isOffShoreLocationExp ? "Yes" : "No"} */}
                          NA
                        </li>
                      </ul>
                    </div>

                    <div className={ViewHRDetailsStyle.colLg6}>
                      <ul>
                        <li>
                          <span>Company Size:</span>{" "}
                          {
                            hiringDetails?.responseBody?.details
                              ?.additionalDetails?.companySize
                          }{" "}
                          employees
                          <i className={ViewHRDetailsStyle.blueDot} />
                        </li>

                        <li>
                          <span>Company’s Linkedin:</span>{" "}
                          <a
                            href={
                              hiringDetails?.responseBody?.details
                                ?.additionalDetails?.companysLinkedInProfile
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            Click Here
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className={ViewHRDetailsStyle.viewHRDetailsBox}>
                  <h3>About Company</h3>
                  {hiringDetails?.responseBody?.details?.additionalDetails?.about_Company_desc ?<div className={ViewHRDetailsStyle.viewHrJDDetailsBox} dangerouslySetInnerHTML={{ __html: hiringDetails?.responseBody?.details?.additionalDetails?.about_Company_desc}}></div> : 'NA'}
                  
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ViewHRDetails;
