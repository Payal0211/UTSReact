import React, { useState, useCallback } from "react";
import ProfileLogStyle from "./profileLog.module.css";
import { ReactComponent as CalenderSVG } from "assets/svg/calender.svg";
import DatePicker from "react-datepicker";
import { ReactComponent as LeftArrowSVG } from "assets/svg/arrowLeft.svg";
import { ReactComponent as RightArrowSVG } from "assets/svg/arrowRight.svg";
import { ProfileLog, TalentOnboardStatus } from "constants/application";
import { hiringRequestDAO } from "core/hiringRequest/hiringRequestDAO";
import { HTTPStatusCode } from 'constants/network';


const ProfileLogDetails = ({
  profileLog,
  activeIndex,
  //   startDate,
  filterTalentID,
  activeType,
  //   onCalenderFilter,
  endDate,
  setEndDate,
  getHRDetailsItem,
  setProfileLog,
  setActiveIndex,
  setActiveType,
  talentID,
  showProfileLogModal,
  talentId
}) => {
  const [profileShared, setProfileShared] = useState([]);
  const [showProfileShared, setShowProfileShared] = useState(false);
  const [profileRejected, setProfileRejected] = useState([]);
  const [showProfileRejectClass, setShowProfileRejectClass] = useState(false);
  const [feedbackReceivedDetails, setFeedbackReceivedDetails] = useState([]);
  const [feedbackReceivedClass, setFeedBackReceivedClass] = useState(false);
  const [selectForClass, setSelectForClass] = useState(false);
  const [selectForDetails, setSelectForDetails] = useState([]);
  const [startDateDetails, setStartDateDetails] = useState();
  const [endDateDetails, setEndDateDetails] = useState();
  const [typeIdPayload, setTypeIdPayload] = useState();
  const [logExpanded, setLogExpanded] = useState(null);
  const [typeId, setTypeId] = useState(0);
  const [startDate, setStartDate] = useState(null);


  const profileLogBox = async () => {
    setShowProfileShared(true);
    setShowProfileRejectClass(false);
    setFeedBackReceivedClass(false);
    setSelectForClass(false);
    setProfileRejected([]);
    setFeedbackReceivedDetails([]);
    let profileObj = {
      talentID: talentId,
      typeID: ProfileLog.PROFILE_SHARED,
      //   fromDate: startDateDetails,
      //   toDate: endDateDetails,
    };

    const response = await hiringRequestDAO.getTalentProfileSharedDetailDAO(
      profileObj
    );
    setTypeIdPayload(ProfileLog.PROFILE_SHARED);
    setProfileShared(response);
  };

  //  Profile Rejected
  const profileRejectedDetails = async () => {
    setShowProfileRejectClass(true);
    setShowProfileShared(false);
    setFeedBackReceivedClass(false);
    setSelectForClass(false);
    let profileReject = {
      talentID: talentId,
      typeID: ProfileLog.REJECTED,
      // fromDate: !!start && new Date(start).toLocaleDateString('en-US'),
      // toDate: !!end && new Date(end).toLocaleDateString('en-US'),
    };

    const response = await hiringRequestDAO.getTalentProfileSharedDetailDAO(
      profileReject
    );
    setTypeIdPayload(ProfileLog.REJECTED);
    setProfileRejected(response?.responseBody?.details);
  };

  // Feedback Received

  const feedbackReceived = async () => {
    setFeedBackReceivedClass(true);
    setShowProfileRejectClass(false);
    setShowProfileShared(false);
    setSelectForClass(false);
    setProfileRejected([]);
    setProfileShared([]);
    let feedbackReceivedObj = {
      talentID: talentId,
      typeID: ProfileLog.FEEDBACK,
      // fromDate: !!start && new Date(start).toLocaleDateString('en-US'),
      // toDate: !!end && new Date(end).toLocaleDateString('en-US'),
    };
    const response = await hiringRequestDAO.getTalentProfileSharedDetailDAO(
      feedbackReceivedObj
    );
    setFeedbackReceivedDetails(response?.responseBody?.details);
    setTypeIdPayload(ProfileLog.FEEDBACK);
  };

  const selectFor = async () => {
    setSelectForClass(true);
    setShowProfileRejectClass(false);
    setShowProfileShared(false);
    let selectForObj = {
      talentID: talentId,
      typeID: ProfileLog.SELECTED,
      // fromDate: !!start && new Date(start).toLocaleDateString('en-US'),
      // toDate: !!end && new Date(end).toLocaleDateString('en-US'),
    };
    const response = await hiringRequestDAO.getTalentProfileSharedDetailDAO(
      selectForObj
    );
    setSelectForDetails(response?.responseBody?.details);
    setTypeIdPayload(ProfileLog.SELECTED);
  };

  const onProfileLogClickHandler = useCallback(
    async (typeID, index, type, start = null, end = null) => {
      setStartDateDetails(
        !!start && new Date(start).toLocaleDateString("en-US")
      );
      setEndDateDetails(!!end && new Date(end).toLocaleDateString("en-US"));
      setLogExpanded([]);
      setTypeId(typeID);
      setActiveIndex(index);
      setActiveType(type);

      let profileObj = {
        talentID: talentId,
        typeID: typeIdPayload,
        fromDate: !!start && new Date(start).toLocaleDateString("en-US"),
        toDate: !!end && new Date(end).toLocaleDateString("en-US"),
      };

      const response = await hiringRequestDAO.getTalentProfileSharedDetailDAO(
        profileObj
      );
      if (response?.statusCode === HTTPStatusCode.OK) {
        setLogExpanded(response && response?.responseBody?.details);
        setProfileShared(response);
        setProfileRejected(response?.responseBody?.details);
        setFeedbackReceivedDetails(response?.responseBody?.details);
        setSelectForDetails(response?.responseBody?.details);

      }
      if (response?.statusCode === HTTPStatusCode.NOT_FOUND) {
        setLogExpanded([]);
        // setProfileLog([]);
      }
    },
    [talentID, filterTalentID?.TalentID, typeIdPayload]
  );

  const onCalenderFilter = useCallback(
    (dates) => {
      const [start, end] = dates;
      setStartDate(start);
      setEndDate(end);
      // if (start && end) {
      // viewProfileInfo(start, end);
      onProfileLogClickHandler(typeId, activeIndex, activeType, start, end);
      // }
    },
    [activeIndex, activeType, onProfileLogClickHandler, typeId]
  );

  const [feedback,setFeedback]=useState(true);
  const [profileReject,setProfileReject]=useState(false);
  const [selected,setSelected]=useState(false);
  const [profileSharedd,setprofileShared] = useState(false);
 
  const rightArrowClick = () => {
    if(profileSharedd === true){
      profileLogBox();
      setprofileShared(false);
      setFeedback(true)
    }
    else if (feedback === true) {
      feedbackReceived();
      setFeedback(false);
      setProfileReject(true);
    }
   else if (profileReject === true) {
      profileRejectedDetails()
      setSelected(true);
      setProfileReject(false);
    }
    else if(selected){
      selectFor();
    }
  };
  const leftArrowClick = () => {
if(profileSharedd){
  profileLogBox();
  setFeedback(false);
  setProfileReject(false);
  setSelected(false);
}
    else if (feedback === true) {
      feedbackReceived();
      setFeedback(true);
      setProfileReject(false);
      setprofileShared(true);
    }
   else if (profileReject === true) {
      profileRejectedDetails()
      setSelected(false);
      setProfileReject(true);
      setFeedback(true);
    }
    else if(selected){
      selectFor();
      setSelected(false);
      setProfileReject(true);
    }
  };

  return (
    <>
      <div className={ProfileLogStyle.modalTitle}>
        <h2>Profile Log</h2>
      </div>

      <div className={ProfileLogStyle.profileNameRoleDate}>
        <div className={ProfileLogStyle.profileNameRole}>
          <ul>
            <li>
              <span>Name:</span> <u>{profileLog?.talentName}</u>
            </li>
            <li>
              <span>Role:</span> {profileLog?.talentRole}
            </li>
          </ul>
        </div>

        <div className={ProfileLogStyle.profileNameDate}>
          <label>Date</label>
          <div className={ProfileLogStyle.profileCalendarFilter}>
            <CalenderSVG />
            <DatePicker
              style={{ backgroundColor: "red" }}
              onKeyDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className={ProfileLogStyle.dateFilter}
              placeholderText="Start date - End date"
              selected={startDate}
              onChange={onCalenderFilter}
              startDate={startDate}
              endDate={endDate}
              selectsRange
            />
          </div>
        </div>
      </div>

      <div className={ProfileLogStyle.profileLogBox}>
        <div
          className={`${ProfileLogStyle.profileLogBoxItem} ${ProfileLogStyle.profileShared
            } ${showProfileShared ? ProfileLogStyle.select : ""}`}
          onClick={profileLogBox}
        >
          <h3>{profileLog?.profileSharedCount}</h3>
          <p>Profile Shared</p>
        </div>
        <div
          className={`${ProfileLogStyle.profileLogBoxItem} ${ProfileLogStyle.profileReceived
            } ${feedbackReceivedClass ? ProfileLogStyle.select : ""}`}
          onClick={feedbackReceived}
        >
          <h3>{profileLog?.feedbackCount}</h3>
          <p>Feedback Received</p>
        </div>
        <div
          className={`${ProfileLogStyle.profileLogBoxItem} ${ProfileLogStyle.profileRejected
            } ${showProfileRejectClass ? ProfileLogStyle.select : ""}`}
          onClick={profileRejectedDetails}
        >
          <h3>{profileLog?.rejectedCount}</h3>
          <p>Rejected</p>
        </div>
        <div
          className={`${ProfileLogStyle.profileLogBoxItem} ${ProfileLogStyle.profileSelFor
            } ${selectForClass ? ProfileLogStyle.select : ""}`}
          onClick={selectFor}
        >
          <h3>{profileLog?.selectedForCount}</h3>
          <p>Selected For</p>
        </div>
      </div>
      {!(
        showProfileShared ||
        feedbackReceivedClass ||
        showProfileRejectClass ||
        selectForClass
      ) && (
          <div className={ProfileLogStyle.selectBoxNote}>
            Select the stages to view their HRs
          </div>
        )}
      {showProfileShared === true && (
        <>
          {profileShared?.length !== 0 && (
            <div
              className={`${ProfileLogStyle.profileLogListWrap} ${ProfileLogStyle.profileShared}`}
            >
              <div className={ProfileLogStyle.profileLogListHead}>
                <h4>Profile Shared: 04 HRs</h4>
                <div className={ProfileLogStyle.profileLogListAction}>
                  <button onClick={leftArrowClick}>
                    <LeftArrowSVG />
                  </button>
                  <button onClick={rightArrowClick}>
                    <RightArrowSVG />
                  </button>
                </div>
              </div>

              <div className={ProfileLogStyle.profileLogList}>
                <table>
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>HR ID</th>
                      <th>Position</th>
                      <th>Company</th>
                      <th>Feedback</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profileShared?.length === undefined ||
                      (profileShared?.length === 0 && (
                        <tr>
                          <td colSpan={6} align="center">
                            No data Found
                          </td>
                        </tr>
                      ))}
                    {profileShared?.responseBody?.details?.map(
                      (item, index) => {
                        return (
                          <tr>
                            <td>HR {index + 1}</td>
                            <td>
                              <u>{item?.hrid}</u>
                            </td>
                            <td>{item?.position}</td>
                            <td>
                              <u>{item?.company}</u>
                            </td>
                            <td>
                              <a href="#">Profile Shared</a>
                            </td>
                            <td>{item?.sDate}</td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
      {feedbackReceivedClass === true && (
        <>
          {feedbackReceivedDetails?.length !== 0 && (
            <div
              className={`${ProfileLogStyle.profileLogListWrap} ${ProfileLogStyle.profileReceived}`}
            >
              <div className={ProfileLogStyle.profileLogListHead}>
                <h4>Feedback Received: 04 HRs</h4>
                <div className={ProfileLogStyle.profileLogListAction}>
                  <button onClick={leftArrowClick}>
                    <LeftArrowSVG />
                  </button>
                  <button onClick={rightArrowClick}>
                    <RightArrowSVG />
                  </button>
                </div>
              </div>

              <div className={ProfileLogStyle.profileLogList}>
                <table>
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>HR ID</th>
                      <th>Position</th>
                      <th>Company</th>
                      <th>Feedback</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedbackReceivedDetails?.length === undefined && (
                      <tr>
                        <td colSpan={6} align="center">
                          No data Found
                        </td>
                      </tr>
                    )}
                    {feedbackReceivedDetails?.map((item, index) => {
                      return (
                        <tr>
                          <td>HR {index + 1}</td>
                          <td>
                            <u>{item?.hrid}</u>
                          </td>
                          <td>{item?.position}</td>
                          <td>
                            <u>{item?.company}</u>
                          </td>
                          <td>
                            <a href="#">Profile Shared</a>
                          </td>
                          <td>{item?.sDate}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
      {showProfileRejectClass === true && (
        <>
          {profileRejected?.length !== 0 && (
            <div
              className={`${ProfileLogStyle.profileLogListWrap} ${ProfileLogStyle.profileRejected}`}
            >
              <div className={ProfileLogStyle.profileLogListHead}>
                <h4>Profile Rejected : 05 HRs</h4>
                <div className={ProfileLogStyle.profileLogListAction}>
                  <button onClick={leftArrowClick}>
                    <LeftArrowSVG />
                  </button>
                  <button onClick={rightArrowClick}>
                    <RightArrowSVG />
                  </button>
                </div>
              </div>

              <div className={ProfileLogStyle.profileLogList}>
                <table>
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>HR ID</th>
                      <th>Position</th>
                      <th>Company</th>
                      <th>Feedback</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profileRejected?.length === undefined && (
                      <tr>
                        <td colSpan={6} align="center">
                          No data Found
                        </td>
                      </tr>
                    )}
                    {profileRejected?.map((item, index) => {
                      return (
                        <tr>
                          <td>HR {index + 1}</td>
                          <td>
                            <u>{item?.hrid}</u>
                          </td>
                          <td>{item?.position}</td>
                          <td>
                            <u>{item?.company}</u>
                          </td>
                          <td>
                            <a href="#">Profile Shared</a>
                          </td>
                          <td>{item?.sDate}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
      {selectForClass === true && (
        <>
          {selectForDetails?.length !== 0 && (
            <div
              className={`${ProfileLogStyle.profileLogListWrap} ${ProfileLogStyle.profileSelFor}`}
            >
              <div className={ProfileLogStyle.profileLogListHead}>
                <h4>Selected For : 04 HRs</h4>
                <div className={ProfileLogStyle.profileLogListAction}>
                  <button onClick={leftArrowClick}>
                    <LeftArrowSVG />
                  </button>
                  <button onClick={rightArrowClick}>
                    <RightArrowSVG />
                  </button>
                </div>
              </div>

              <div className={ProfileLogStyle.profileLogList}>
                <table>
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>HR ID</th>
                      <th>Position</th>
                      <th>Company</th>
                      <th>Feedback</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectForDetails?.length === undefined && (
                      <tr>
                        <td colSpan={6} align="center">
                          No data Found
                        </td>
                      </tr>
                    )}
                    {selectForDetails?.map((item, index) => {
                      return (
                        <tr>
                          <td>HR {index + 1}</td>
                          <td>
                            <u>{item?.hrid}</u>
                          </td>
                          <td>{item?.position}</td>
                          <td>
                            <u>{item?.company}</u>
                          </td>
                          <td>
                            <a href={item?.feedbackurl}>Profile Shared</a>
                          </td>
                          <td>{item?.sDate}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ProfileLogDetails;
