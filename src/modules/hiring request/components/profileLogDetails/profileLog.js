// import React from 'react'
// import ProfileLogStyle from "./profileLog.module.css"
// import DatePicker from 'react-datepicker';
// import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
// import { Modal } from 'antd';
// import { ReactComponent as LeftArrowSVG } from 'assets/svg/arrowLeft.svg';
// import { ReactComponent as RightArrowSVG } from 'assets/svg/arrowRight.svg';
// import { useState } from 'react';


// const ProfileLog = () => {
//     // const [selectForDetails, setSelectForDetails] = useState([])
//     // const [profileShared, setProfileShared] = useState([])
//     // const [showProfileShared, setShowProfileShared] = useState(false)
//     const [profileRejected, setProfileRejected] = useState([])
//     const [showProfileRejectClass, setShowProfileRejectClass] = useState(false)
//     const [feedbackReceivedDetails, setFeedbackReceivedDetails] = useState([])
//     const [feedbackReceivedClass, setFeedBackReceivedClass] = useState(false)
//     const [selectForClass, setSelectForClass] = useState(false)

//     const profileLogBox = async () => {
//         setShowProfileShared(true)
//         setShowProfileRejectClass(false)
//         setFeedBackReceivedClass(false)
//         setSelectForClass(false)
//         setProfileRejected([])
//         setFeedbackReceivedDetails([])
//         let profileObj = {
//             talentID: getHRDetailsItem?.TalentID,
//             typeID: ProfileLog.PROFILE_SHARED,
//             // fromDate: !!start && new Date(start).toLocaleDateString('en-US'),
//             // toDate: !!end && new Date(end).toLocaleDateString('en-US'),
//         };

//         const response = await hiringRequestDAO.getTalentProfileSharedDetailDAO(
//             profileObj,
//         );
//         setProfileShared(response)
//     }


//     //  Profile Rejected
//     const profileRejectedDetails = async () => {

//         setShowProfileRejectClass(true)
//         setShowProfileShared(false)
//         setFeedBackReceivedClass(false)
//         setSelectForClass(false)
//         let profileReject = {
//             talentID: getHRDetailsItem?.TalentID,
//             typeID: ProfileLog.REJECTED,
//             // fromDate: !!start && new Date(start).toLocaleDateString('en-US'),
//             // toDate: !!end && new Date(end).toLocaleDateString('en-US'),
//         };

//         const response = await hiringRequestDAO.getTalentProfileSharedDetailDAO(
//             profileReject,
//         );
//         setProfileRejected(response?.responseBody?.details)
//     }

//     // Feedback Received

//     const feedbackReceived = async () => {
//         setFeedBackReceivedClass(true)
//         setShowProfileRejectClass(false)
//         setShowProfileShared(false)
//         setSelectForClass(false)
//         setProfileRejected([])
//         setProfileShared([])
//         let feedbackReceivedObj = {
//             talentID: getHRDetailsItem?.TalentID,
//             typeID: ProfileLog.FEEDBACK,
//             // fromDate: !!start && new Date(start).toLocaleDateString('en-US'),
//             // toDate: !!end && new Date(end).toLocaleDateString('en-US'),
//         }
//         const response = await hiringRequestDAO.getTalentProfileSharedDetailDAO(feedbackReceivedObj)
//         setFeedbackReceivedDetails(response?.responseBody?.details)
//     }


//     const selectFor = async () => {
//         setSelectForClass(true)
//         setShowProfileRejectClass(false)
//         setShowProfileShared(false)
//         let selectForObj = {
//             talentID: getHRDetailsItem?.TalentID,
//             typeID: ProfileLog.SELECTED,
//             // fromDate: !!start && new Date(start).toLocaleDateString('en-US'),
//             // toDate: !!end && new Date(end).toLocaleDateString('en-US'),
//         }
//         const response = await hiringRequestDAO.getTalentProfileSharedDetailDAO(selectForObj)
//         setSelectForDetails(response?.responseBody?.details)
//     }




//     return (
//         <>
//             <Modal
//                 width="992px"
//                 centered
//                 footer={null}
//                 open={showProfileLogModal}
//                 className="commonModalWrap"
//                 // onOk={() => setVersantModal(false)}
//                 onCancel={() => { setProfileLogModal(false); setProfileShared([]); setFeedbackReceivedDetails([]); setProfileRejected([]); setShowProfileShared(false); setShowProfileRejectClass(false); setFeedBackReceivedClass(false) }}>

//                 <div className={ProfileLogStyle.modalTitle}>
//                     <h2>Profile Log</h2>
//                 </div>

//                 <div className={ProfileLogStyle.profileNameRoleDate}>
//                     <div className={ProfileLogStyle.profileNameRole}>
//                         <ul>
//                             <li>
//                                 <span>Name:</span> <u>{profileLog?.talentName}</u>
//                             </li>
//                             <li>
//                                 <span>Role:</span> {profileLog?.talentRole}
//                             </li>
//                         </ul>
//                     </div>

//                     <div className={ProfileLogStyle.profileNameDate}>
//                         <div className={ProfileLogStyle.label}>Date</div>
//                         <div className={ProfileLogStyle.calendarFilter}>
//                             <CalenderSVG style={{ height: '16px', marginRight: '16px' }} />
//                             <DatePicker
//                                 style={{ backgroundColor: 'red' }}
//                                 onKeyDown={(e) => {
//                                     e.preventDefault();
//                                     e.stopPropagation();
//                                 }}
//                                 className={ProfileLogStyle.dateFilter}
//                                 placeholderText="Start date - End date"
//                                 selected={startDate}
//                                 onChange={onCalenderFilter}
//                                 startDate={startDate}
//                                 endDate={endDate}
//                                 selectsRange
//                             />
//                         </div>
//                     </div>
//                 </div>

//                 <div className={ProfileLogStyle.profileLogBox}>
//                     <div className={`${ProfileLogStyle.profileLogBoxItem} ${ProfileLogStyle.profileShared} ${showProfileShared ? ProfileLogStyle.select : ""}`} onClick={profileLogBox}>
//                         <h3>{profileLog?.profileSharedCount}</h3>
//                         <p>Profile Shared</p>
//                     </div>
//                     <div className={`${ProfileLogStyle.profileLogBoxItem} ${ProfileLogStyle.profileReceived} ${feedbackReceivedClass ? ProfileLogStyle.select : ""}`} onClick={feedbackReceived}>
//                         <h3>{profileLog?.feedbackCount}</h3>
//                         <p>Feedback Received</p>
//                     </div>
//                     <div className={`${ProfileLogStyle.profileLogBoxItem} ${ProfileLogStyle.profileRejected} ${showProfileRejectClass ? ProfileLogStyle.select : ""}`} onClick={profileRejectedDetails}>
//                         <h3>{profileLog?.rejectedCount}</h3>
//                         <p>Rejected</p>
//                     </div>
//                     <div className={`${ProfileLogStyle.profileLogBoxItem} ${ProfileLogStyle.profileSelFor} ${selectForClass ? ProfileLogStyle.select : ""}`} onClick={selectFor}>
//                         <h3>{profileLog?.selectedForCount}</h3>
//                         <p>Selected For</p>
//                     </div>
//                 </div>
//                 {!(showProfileShared || feedbackReceivedClass || showProfileRejectClass || selectForClass) && (

//                     <p>Select the stages to view thier HRs</p>
//                 )}
//                 {showProfileShared === true && (
//                     <>
//                         {profileShared?.length !== 0 && (

//                             <div className={`${ProfileLogStyle.profileLogListWrap} ${ProfileLogStyle.profileShared}`}>
//                                 <div className={ProfileLogStyle.profileLogListHead}>
//                                     <h4>Profile Shared: 04 HRs</h4>
//                                     <div className={ProfileLogStyle.profileLogListAction}>
//                                         <button><LeftArrowSVG /></button>
//                                         <button><RightArrowSVG /></button>
//                                     </div>
//                                 </div>

//                                 <div className={ProfileLogStyle.profileLogList}>
//                                     <table>
//                                         <thead>
//                                             <tr>
//                                                 <th>No.</th>
//                                                 <th>HR ID</th>
//                                                 <th>Position</th>
//                                                 <th>Company</th>
//                                                 <th>Feedback</th>
//                                                 <th>Date</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {profileShared?.responseBody?.details?.map((item, index) => {
//                                                 return (
//                                                     <tr>
//                                                         <td>HR {index + 1}</td>
//                                                         <td><u>{item?.hrid}</u></td>
//                                                         <td>{item?.position}</td>
//                                                         <td><u>{item?.company}</u></td>
//                                                         <td><a href="#">Profile Shared</a></td>
//                                                         <td>{item?.sDate}</td>
//                                                     </tr>
//                                                 )
//                                             })}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             </div>
//                         )}
//                     </>
//                 )}
//                 {feedbackReceivedClass === true && (
//                     <>
//                         {feedbackReceivedDetails?.length !== 0 && (
//                             <div className={`${ProfileLogStyle.profileLogListWrap} ${ProfileLogStyle.profileReceived}`}>
//                                 <div className={ProfileLogStyle.profileLogListHead}>
//                                     <h4>Feedback Received: 04 HRs</h4>
//                                     <div className={ProfileLogStyle.profileLogListAction}>
//                                         <button><LeftArrowSVG /></button>
//                                         <button><RightArrowSVG /></button>
//                                     </div>
//                                 </div>

//                                 <div className={ProfileLogStyle.profileLogList}>
//                                     <table>
//                                         <thead>
//                                             <tr>
//                                                 <th>No.</th>
//                                                 <th>HR ID</th>
//                                                 <th>Position</th>
//                                                 <th>Company</th>
//                                                 <th>Feedback</th>
//                                                 <th>Date</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {feedbackReceivedDetails?.map((item, index) => {
//                                                 return (
//                                                     <tr>
//                                                         <td>HR {index + 1}</td>
//                                                         <td><u>{item?.hrid}</u></td>
//                                                         <td>{item?.position}</td>
//                                                         <td><u>{item?.company}</u></td>
//                                                         <td><a href="#">Profile Shared</a></td>
//                                                         <td>{item?.sDate}</td>
//                                                     </tr>
//                                                 )
//                                             })}

//                                         </tbody>
//                                     </table>
//                                 </div>
//                             </div>
//                         )}
//                     </>
//                 )}
//                 {showProfileRejectClass === true && (
//                     <>
//                         {profileRejected?.length !== 0 || profileRejected === undefined && (
//                             <div className={`${ProfileLogStyle.profileLogListWrap} ${ProfileLogStyle.profileRejected}`}>
//                                 <div className={ProfileLogStyle.profileLogListHead}>
//                                     <h4>Profile Rejected : 05 HRs</h4>
//                                     <div className={ProfileLogStyle.profileLogListAction}>
//                                         <button><LeftArrowSVG /></button>
//                                         <button><RightArrowSVG /></button>
//                                     </div>
//                                 </div>

//                                 <div className={ProfileLogStyle.profileLogList}>
//                                     <table>
//                                         <thead>
//                                             <tr>
//                                                 <th>No.</th>
//                                                 <th>HR ID</th>
//                                                 <th>Position</th>
//                                                 <th>Company</th>
//                                                 <th>Feedback</th>
//                                                 <th>Date</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {profileRejected?.map((item, index) => {
//                                                 return (
//                                                     <tr>
//                                                         <td>HR {index + 1}</td>
//                                                         <td><u>{item?.hrid}</u></td>
//                                                         <td>{item?.position}</td>
//                                                         <td><u>{item?.company}</u></td>
//                                                         <td><a href="#">Profile Shared</a></td>
//                                                         <td>{item?.sDate}</td>
//                                                     </tr>
//                                                 )
//                                             })}

//                                         </tbody>
//                                     </table>
//                                 </div>
//                             </div>
//                         )}
//                     </>
//                 )}
//                 {selectForClass === true && (
//                     <>
//                         {selectForDetails?.length !== 0 && (
//                             <div className={`${ProfileLogStyle.profileLogListWrap} ${ProfileLogStyle.profileSelFor}`}>
//                                 <div className={ProfileLogStyle.profileLogListHead}>
//                                     <h4>Select For : 04 HRs</h4>
//                                     <div className={ProfileLogStyle.profileLogListAction}>
//                                         <button><LeftArrowSVG /></button>
//                                         <button><RightArrowSVG /></button>
//                                     </div>
//                                 </div>

//                                 <div className={ProfileLogStyle.profileLogList}>
//                                     <table>
//                                         <thead>
//                                             <tr>
//                                                 <th>No.</th>
//                                                 <th>HR ID</th>
//                                                 <th>Position</th>
//                                                 <th>Company</th>
//                                                 <th>Feedback</th>
//                                                 <th>Date</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {selectForDetails?.map((item, index) => {
//                                                 return (
//                                                     <tr>
//                                                         <td>HR {index + 1}</td>
//                                                         <td><u>{item?.hrid}</u></td>
//                                                         <td>{item?.position}</td>
//                                                         <td><u>{item?.company}</u></td>
//                                                         <td><a href={item?.feedbackurl}>Profile Shared</a></td>
//                                                         <td>{item?.sDate}</td>
//                                                     </tr>
//                                                 )
//                                             })}

//                                         </tbody>
//                                     </table>
//                                 </div>
//                             </div>
//                         )}
//                     </>
//                 )}
//             </Modal>


//         </>
//     )
// }

// export default ProfileLog