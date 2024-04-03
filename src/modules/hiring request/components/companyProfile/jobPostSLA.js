import CompanyProfileCardStyle from "./companyProfile.module.css";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { BsThreeDots } from "react-icons/bs";
import { AiFillLinkedin } from "react-icons/ai";
import { Divider, Dropdown, Menu, Modal, Tabs, message, Tooltip } from "antd";
import { Link, useParams } from "react-router-dom";
import UpdateTRModal from "../../components/updateTRModal/updateTRModal";
import ChangeDate from "../changeDate/changeDateModal";
import { hiringRequestDAO } from "core/hiringRequest/hiringRequestDAO";
import { UserSessionManagementController } from "modules/user/services/user_session_services";
import { UserAccountRole } from "constants/application";
import { NetworkInfo } from "constants/network";

import IconApplicationSVG from "assets/svg/postStepIconApplication.svg";
import IconDebriefingSVG from "assets/svg/postStepIconDebriefing.svg";
import IconHireSVG from "assets/svg/postStepIconHire.svg";
import IconInterviewSVG from "assets/svg/postStepIconInterview.svg";
import IconMatcherSVG from "assets/svg/postStepIconMatcher.svg";
import IconOnbordingSVG from "assets/svg/postStepIconOnbording.svg";
import IconPublishedSVG from "assets/svg/postStepIconPublished.svg";
import IconScreeningSVG from "assets/svg/postStepIconScreening.svg";
import IconShortlistSVG from "assets/svg/postStepIconShortlist.svg";
import IconVettingSVG from "assets/svg/postStepIconVetting.svg";

import jobPostSLATimeSVG from "assets/svg/jobPostSLATime.svg";
import SLAHistory from "../changeDate/slaHistory";

const JOBPostSLA = ({ allApiData }) => {
  const [updateDate, setUpdateDate] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [hrSLADetails, sethrSLADetails] = useState([]);
  const [slaReasons, setSLAReasons] = useState([]);
  const [slaHistory, setSLAHistory] = useState([]);
  // const ws =  new WebSocket(`${NetworkInfo.ENV === "QA" ? 'ws' : 'wss' }://${NetworkInfo.DOMAIN}//`) 

  const getHRSLA = async (id) => {
    const result = await hiringRequestDAO.getHRSLADetailsDAO(id);
    if (result?.statusCode === 200) {
      sethrSLADetails(result?.responseBody?.details.hrSLADetails);
      setSLAReasons(result?.responseBody?.details.slaReasons);
      setSLAHistory(result?.responseBody?.details.slaUpdateHistoryResult);
    }
  };


  const getWSSLA = async (id)=>{  
    const result = await hiringRequestDAO.wsJOBPOSTSLADAO(id);
    if (result?.statusCode === 200) {
      if(result.responseBody?.details !== null){
        sethrSLADetails(result.responseBody?.details)
      }
    }
  }

  useEffect(() => {
    getHRSLA(allApiData.HR_Id);

    const interval = setInterval(() => { 
      getWSSLA(allApiData.HR_Id)
    }, 7000); 

  return () => clearInterval(interval); 
  }, [allApiData.HR_Id]);

//   ws.onopen = () => {
//     console.log('WebSocket connection opened');
//   };

//   ws.onmessage = (event) => {
//     const newMessage = event.data;
//     if(JSON.parse(newMessage)[0].HrID === allApiData.HR_Id){
//       let NewHRList = JSON.parse(newMessage).map(val=> ({hrID: val.HrID,
//         jobTitle: val.JobTitle,
//         noOfTalents: val.NoOfTalents,
//         requiredTalents:val.RequiredTalents,
//         rowNo :  val.RowNo,
//         slaDate: val.SLADate,
//         slaStatus:val.SLAStatus,
//         stageID:val.StageID,
//         stageName:val.StageName
//       }))
//       sethrSLADetails(NewHRList);
//     }

//   };

//  ws.onclose = () => {
//     console.log('WebSocket connection closed');
//   };


  const updateSlaDateHandler = async (paylpoad, setIsLoading) => {
    let result = await hiringRequestDAO.updateSLADateDAO(paylpoad);
    if (result.statusCode === 200) {
      message.success(result.responseBody.message);
      getHRSLA(allApiData.HR_Id);
      setUpdateDate(false);
    }
    setIsLoading(false);
  };

  return (
    <div
      className={CompanyProfileCardStyle.companyCard}
      style={{ marginTop: "10px" }}
    >
      <div className={CompanyProfileCardStyle.companyCardBody}>
        <div
          className={`${CompanyProfileCardStyle.jobStepTextWrap} ${CompanyProfileCardStyle.jobStepTextWrapTop}`}
        >
          <div className={CompanyProfileCardStyle.jobStepTextBtnWrap}>
            <div>
              <div className={CompanyProfileCardStyle.StepscreeningBox}>
                Profile Review ETA:
                <b>{hrSLADetails.length && hrSLADetails[6].slaDate}</b> |{" "}
                <span
                  className={
                    hrSLADetails.length &&
                    hrSLADetails[6].slaStatus === "ON Time"
                      ? CompanyProfileCardStyle.screeningColorGreen
                      : CompanyProfileCardStyle.screeningColorOrange
                  }
                >
                  {hrSLADetails.length && hrSLADetails[6].slaStatus}
                </span>
              </div>
              <span
                onClick={() => setShowHistory(true)}
                className={CompanyProfileCardStyle.spinTimeImg}
              >
                {" "}
                <img src={jobPostSLATimeSVG} alt="time" />
              </span>
            </div>
            <button
              className={CompanyProfileCardStyle.btnPrimary}
              onClick={() => setUpdateDate(true)}
            >
              Change Date
            </button>
          </div>
        </div>

        <Divider
          style={{
            margin: "10px 0",
          }}
        />

        {/* <ul>
            {hrSLADetails.length &&
              hrSLADetails.map((detail) => <li><div>
				{detail.stageName}
				<div style={{display:'flex', justifyContent:'space-between'}}>
					<div><p>SLA- <span>20h</span></p></div>
					<div><p>Date- {detail.slaDate?? 'NA'}</p></div>
				</div>
				</div></li>)}
          </ul> */}

        <div className={CompanyProfileCardStyle.telentJobStep}>
          <ul className={CompanyProfileCardStyle.telentJobStepProgressbar}>
            <li className={hrSLADetails[0]?.completedStageID >= hrSLADetails[0]?.stageID && CompanyProfileCardStyle.check}>
              <div
                className={CompanyProfileCardStyle.telentJobStepIcon}
                data-toggle="tooltip"
                data-placement="top"
                title="Debriefing your job"
              >
                <img src={IconDebriefingSVG} alt="icon" />
              </div>
              <div className={CompanyProfileCardStyle.jobStepTextWrap}>
                <p>{hrSLADetails.length && `${hrSLADetails[0].stageName}`}</p>
                <div className={CompanyProfileCardStyle.jobStepTextBtnWrap}>
                  {/* <div className={CompanyProfileCardStyle.StepscreeningBox}>SLA - <span className={CompanyProfileCardStyle.screeningColorGreen}> 12 Hours</span> </div>
                          <div className={CompanyProfileCardStyle.StepscreeningBox}>Date - 6th Sept, 2023</div> */}
                </div>
              </div>
            </li>
            <li className={hrSLADetails[1]?.completedStageID >= hrSLADetails[1]?.stageID && CompanyProfileCardStyle.check}>
              <div
                className={CompanyProfileCardStyle.telentJobStepIcon}
                data-toggle="tooltip"
                data-placement="top"
                title="Job published to talents"
              >
                <img src={IconPublishedSVG} alt="icon" />
              </div>
              <div className={CompanyProfileCardStyle.jobStepTextWrap}>
                <p>{hrSLADetails.length && `${hrSLADetails[1].stageName}`}</p>
                <div className={CompanyProfileCardStyle.jobStepTextBtnWrap}>
                  {/* <div className={CompanyProfileCardStyle.StepscreeningBox}>SLA - <span className={CompanyProfileCardStyle.screeningColorGreen}> 12 Hours</span> </div>
                          <div className={CompanyProfileCardStyle.StepscreeningBox}>Date - 6th Sept, 2023</div> */}
                </div>
              </div>
            </li>
            <li className={hrSLADetails[2]?.completedStageID >= hrSLADetails[2]?.stageID && CompanyProfileCardStyle.check}>
              <Tooltip
                placement="top"
                title={
                  hrSLADetails.length &&
                  `${hrSLADetails[2].noOfTalents} Applicants`
                }
              >
                <div
                  className={CompanyProfileCardStyle.telentJobStepIcon}
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Applications"
                >
                  <img src={IconApplicationSVG} alt="icon" />
                </div>
              </Tooltip>

              <div className={CompanyProfileCardStyle.jobStepTextWrap}>
                <p>{hrSLADetails.length && `${hrSLADetails[2].stageName}`}</p>
                <div className={CompanyProfileCardStyle.jobStepTextBtnWrap}>
                  <div className={CompanyProfileCardStyle.StepscreeningBox}>
                    <span
                      className={CompanyProfileCardStyle.screeningColorOrange}
                    >
                      {hrSLADetails.length && `${hrSLADetails[2].noOfTalents}`}{" "}
                      Applicants
                    </span>
                  </div>
                </div>
              </div>
            </li>
            {/* <li className={hrSLADetails[3]?.completedStageID >= hrSLADetails[3]?.stageID && CompanyProfileCardStyle.check}>
              <Tooltip
                placement="top"
                title={
                  hrSLADetails.length &&
                  `${hrSLADetails[3].noOfTalents} Talents in Screening`
                }
              >
                <div
                  className={CompanyProfileCardStyle.telentJobStepIcon}
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Screening"
                >
                  <img src={IconScreeningSVG} alt="icon" />
                </div>
              </Tooltip>

              <div className={CompanyProfileCardStyle.jobStepTextWrap}>
                <p>{hrSLADetails.length && `${hrSLADetails[3].stageName}`}</p>
                <div className={CompanyProfileCardStyle.jobStepTextBtnWrap}>
                  <div className={CompanyProfileCardStyle.StepscreeningBox}>
                    <span
                      className={CompanyProfileCardStyle.screeningColorOrange}
                    >
                      {hrSLADetails.length && `${hrSLADetails[3].noOfTalents}`}{" "}
                      Talents in Screening
                    </span>{" "}
                  </div>
                </div>
              </div>
            </li> */}
            <li className={hrSLADetails[4]?.completedStageID >= hrSLADetails[4]?.stageID && CompanyProfileCardStyle.check}>
              <Tooltip
                placement="top"
                title={
                  hrSLADetails.length &&
                  `${hrSLADetails[4].noOfTalents} Talents Vetted`
                }
              >
                <div
                  className={CompanyProfileCardStyle.telentJobStepIcon}
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Vetting"
                >
                  <img src={IconVettingSVG} alt="icon" />
                </div>
              </Tooltip>

              <div className={CompanyProfileCardStyle.jobStepTextWrap}>
                <p>{hrSLADetails.length && `${hrSLADetails[4].stageName}`}</p>
                <div className={CompanyProfileCardStyle.jobStepTextBtnWrap}>
                  <div className={CompanyProfileCardStyle.StepscreeningBox}>
                    <span
                      className={CompanyProfileCardStyle.screeningColorOrange}
                    >
                      {hrSLADetails.length && `${hrSLADetails[4].noOfTalents}`}{" "}
                      Talents Vetted
                    </span>{" "}
                  </div>
                </div>
              </div>
            </li>
            <li className={hrSLADetails[5]?.completedStageID >= hrSLADetails[5]?.stageID && CompanyProfileCardStyle.check}>
              <Tooltip
                placement="top"
                title={
                  hrSLADetails.length &&
                  `${hrSLADetails[5].noOfTalents} Talents in Matching Interview`
                }
              >
                <div
                  className={CompanyProfileCardStyle.telentJobStepIcon}
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Matcher Interviewed"
                >
                  <img src={IconMatcherSVG} alt="icon" />
                </div>
              </Tooltip>

              <div className={CompanyProfileCardStyle.jobStepTextWrap}>
                <p>{hrSLADetails.length && `${hrSLADetails[5].stageName}`}</p>
                <div className={CompanyProfileCardStyle.jobStepTextBtnWrap}>
                  <div className={CompanyProfileCardStyle.StepscreeningBox}>
                    {" "}
                    <span
                      className={CompanyProfileCardStyle.screeningColorOrange}
                    >
                      {hrSLADetails.length &&
                        `${hrSLADetails[5].noOfTalents} Talents in Matching Interview`}
                    </span>{" "}
                  </div>
                </div>
              </div>
            </li>
            <li className={hrSLADetails[6]?.completedStageID >= hrSLADetails[6]?.stageID && CompanyProfileCardStyle.check}>
              <Tooltip
                placement="top"
                title={hrSLADetails.length && `${hrSLADetails[6].noOfTalents} Talents Shortlisted`}
              >
                <div
                  className={CompanyProfileCardStyle.telentJobStepIcon}
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Shortlist"
                >
                  <img src={IconShortlistSVG} alt="icon" />
                </div>
              </Tooltip>

              <div className={CompanyProfileCardStyle.jobStepTextWrap}>
                <p>{hrSLADetails.length && `${hrSLADetails[6].stageName}`}</p>
                <div className={CompanyProfileCardStyle.jobStepTextBtnWrap}>
               
                  <div className={CompanyProfileCardStyle.StepscreeningBox}>
                    {" "}
                    <span
                      className={CompanyProfileCardStyle.screeningColorOrange}
                    >
                      {hrSLADetails.length && `${hrSLADetails[6].noOfTalents} Talents Shortlisted`}
                    </span>{" "}
                  </div>
                
                  {/* <div className={CompanyProfileCardStyle.StepscreeningBox}>SLA - <span className={CompanyProfileCardStyle.screeningColorGreen}> 12 Hours</span> </div>
                          <div className={CompanyProfileCardStyle.StepscreeningBox}>Date - 6th Sept, 2023</div> */}
                </div>
              </div>
            </li>
            <li className={hrSLADetails[7]?.completedStageID >= hrSLADetails[7]?.stageID && CompanyProfileCardStyle.check}>
              <Tooltip
                placement="top"
                title={
                  hrSLADetails.length &&
                  `${hrSLADetails[7].noOfTalents} Talents in Interview`
                }
              >
                <div
                  className={CompanyProfileCardStyle.telentJobStepIcon}
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Interview"
                >
                  <img src={IconInterviewSVG} alt="icon" />
                </div>
              </Tooltip>

              <div className={CompanyProfileCardStyle.jobStepTextWrap}>
                <p>{hrSLADetails.length && `${hrSLADetails[7].stageName}`}</p>
                <div className={CompanyProfileCardStyle.jobStepTextBtnWrap}>
               
                  <div className={CompanyProfileCardStyle.StepscreeningBox}>
                    {" "}
                    <span
                      className={CompanyProfileCardStyle.screeningColorOrange}
                    >
                      {hrSLADetails.length &&
                  `${hrSLADetails[7].noOfTalents} Talents in Interview`}
                    </span>{" "}
                  </div>
                
                  {/* <div className={CompanyProfileCardStyle.StepscreeningBox}>SLA - <span className={CompanyProfileCardStyle.screeningColorGreen}> 12 Hours</span> </div>
                          <div className={CompanyProfileCardStyle.StepscreeningBox}>Date - 6th Sept, 2023</div> */}
                </div>
              </div>
            </li>
            <li className={hrSLADetails[8]?.completedStageID >= hrSLADetails[8]?.stageID && CompanyProfileCardStyle.check}>
              <Tooltip
                placement="top"
                title={
                  hrSLADetails.length &&
                  `${hrSLADetails[8].noOfTalents} Talent Hired`
                }
              >
                <div
                  className={CompanyProfileCardStyle.telentJobStepIcon}
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Hire"
                >
                  {/* <img src="images/svg/postStepIconHire.svg" alt="postStepIconHire">     */}
                  <img src={IconHireSVG} alt="icon" />
                </div>
              </Tooltip>

              <div className={CompanyProfileCardStyle.jobStepTextWrap}>
                <p>{hrSLADetails.length && `${hrSLADetails[8].stageName}`}</p>
                <div className={CompanyProfileCardStyle.jobStepTextBtnWrap}>
                  {/* <div className={CompanyProfileCardStyle.StepscreeningBox}>SLA - <span className={CompanyProfileCardStyle.screeningColorGreen}> 12 Hours</span> </div> */}
                  <div className={CompanyProfileCardStyle.StepscreeningBox}>
                    {hrSLADetails.length &&
                      `${hrSLADetails[8].noOfTalents} Talent Hired`}
                  </div>
                </div>
              </div>
            </li>
            <li className={hrSLADetails[9]?.completedStageID >= hrSLADetails[9]?.stageID && CompanyProfileCardStyle.check}>
              <Tooltip
                placement="top"
                title={
                  hrSLADetails.length &&
                  `${hrSLADetails[9].noOfTalents} Talent Onboarded`
                }
              >
                <div
                  className={CompanyProfileCardStyle.telentJobStepIcon}
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Onboarding"
                >
                  <img src={IconOnbordingSVG} alt="icon" />
                </div>
              </Tooltip>

              <div className={CompanyProfileCardStyle.jobStepTextWrap}>
                <p>{hrSLADetails.length && `${hrSLADetails[9].stageName}`}</p>
                <div className={CompanyProfileCardStyle.jobStepTextBtnWrap}>
                  {/* <div className={CompanyProfileCardStyle.StepscreeningBox}>SLA - <span className={CompanyProfileCardStyle.screeningColorGreen}> 12 Hours</span> </div> */}
                  <div className={CompanyProfileCardStyle.StepscreeningBox}>
                    {hrSLADetails.length &&
                      `${hrSLADetails[9].noOfTalents} Talent Onboarded`}
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>

        {updateDate && (
          <Modal
            width={"864px"}
            centered
            footer={false}
            open={updateDate}
            className="changeDateModal"
            onCancel={() => setUpdateDate(false)}
          >
            <ChangeDate
              allApiData={allApiData}
              onCancel={() => setUpdateDate(false)}
              slaReasons={slaReasons}
              hrSLADetails={hrSLADetails}
              updateSlaDateHandler={updateSlaDateHandler}
            />
          </Modal>
        )}

        {showHistory && (
          <Modal
            width={"864px"}
            centered
            footer={false}
            open={showHistory}
            className="changeDateModal"
            onCancel={() => setShowHistory(false)}
          >
            <SLAHistory
              history={slaHistory}
              onCancel={() => setShowHistory(false)}
              hrSLADetails={hrSLADetails}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default JOBPostSLA;
