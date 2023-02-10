import { Dropdown, Menu, Divider, List, Modal, message } from 'antd';
import { BsThreeDots } from 'react-icons/bs';
import { All_Hiring_Request_Utils } from 'shared/utils/all_hiring_request_util';
import { RiArrowDropDownLine } from 'react-icons/ri';
import TalentListStyle from './talentList.module.css';
import HROperator from '../hroperator/hroperator';
import { AiOutlineDown } from 'react-icons/ai';
import { Fragment, useState } from 'react';
import { ReactComponent as ExportSVG } from 'assets/svg/export.svg';
import { AddNewType, TalentOnboardStatus } from 'constants/application';

import InterviewReschedule from 'modules/interview/screens/interviewReschedule/interviewReschedule';
import InterviewSchedule from 'modules/interview/screens/interviewSchedule/interviewSchedule';
import InterviewFeedback from 'modules/interview/screens/interviewFeedback/interviewFeedback';
import { hrUtils } from 'modules/hiring request/hrUtils';
import { _isNull } from 'shared/utils/basic_utils';
import { allHRConfig } from 'modules/hiring request/screens/allHiringRequest/allHR.config';

const TalentList = ({ talentDetail, miscData, HRStatusCode }) => {
	const [activeIndex, setActiveIndex] = useState(-1);
	const [activeType, setActiveType] = useState(null);
	const [logExpanded, setLogExpanded] = useState(null);
	const [showVersantModal, setVersantModal] = useState(false);
	const [interviewStatus, setInterviewStatus] = useState(false);
	const profileData = allHRConfig.profileLogConfig();
	const [showReScheduleInterviewModal, setReScheduleInterviewModal] =
		useState(false);
	const [showScheduleInterviewModal, setScheduleInterviewModal] =
		useState(false);
	const [showProfileLogModal, setProfileLogModal] = useState(false);
	const [messageAPI, contextHolder] = message.useMessage();
	const [talentIndex, setTalentIndex] = useState(0);
	const onProfileLogClickHandler = async (typeID, index, type) => {
		setLogExpanded([]);
		setActiveIndex(index);
		setActiveType(type);
		const profileObj = {
			// talentID: talentID,
			typeID: typeID,
		};
		// const response = await hiringRequestDAO.getTalentProfileSharedDetailDAO(
		// 	profileObj,
		// );
		// setLogExpanded(response && response?.responseBody?.details);
	};
	return (
		<div>
			{contextHolder}
			<List
				grid={{ gutter: 16, column: 2 }}
				size="large"
				dataSource={talentDetail && talentDetail}
				pagination={{
					className: TalentListStyle.paginate,
					size: 'small',
					pageSize: 2,
					position: 'top',
				}}
				renderItem={(item, listIndex) => (
					<div
						key={item?.Name}
						id={listIndex}>
						<div className={TalentListStyle.talentCard}>
							<div className={TalentListStyle.talentCardBody}>
								<div className={TalentListStyle.partWise}>
									<div
										style={{
											marginBottom: '10px',
											display: 'flex',
										}}>
										<div
											style={{
												display: 'flex',
												justifyContent: 'space-between',
												alignItems: 'center',
											}}>
											<img
												src={
													!item?.ProfileURL
														? item?.ProfileURL
														: 'https://www.w3schools.com/howto/img_avatar.png'
												}
												className={TalentListStyle.avatar}
												alt="avatar"
											/>
											<div
												style={{
													position: 'absolute',
													marginLeft: '50px',
													top: '-30px',
												}}>
												{All_Hiring_Request_Utils.GETTALENTSTATUS(
													item?.ProfileStatusCode,
													item?.Status,
												)}
											</div>
											<div
												style={{
													marginLeft: '50px',
													marginTop: '20px',
													fontSize: '.7vw',
												}}>
												<div
													style={{
														textDecoration: 'underline',
														fontWeight: '600',
													}}>
													{item?.Name}
												</div>
												<div>{item?.TalentRole}</div>
											</div>
										</div>
									</div>
									<div style={{ cursor: 'pointer' }}>
										<Dropdown
											trigger={['click']}
											placement="bottom"
											overlay={
												<Menu>
													<Menu.Item
														key={0}
														onClick={() => {
															setProfileLogModal(true);
															setTalentIndex(listIndex);
														}}>
														View Profile Log
													</Menu.Item>
													<Divider
														style={{
															margin: '3px 0',
														}}
													/>
													<Menu.Item key={1}>Remove Profile</Menu.Item>
												</Menu>
											}>
											<BsThreeDots style={{ fontSize: '1.5rem' }} />
										</Dropdown>
									</div>
								</div>
								<div className={TalentListStyle.profileURL}>
									<span>profile URL:</span>&nbsp;&nbsp;
									<span style={{ fontWeight: '500' }}>
										<a
											style={{ textDecoration: 'underline' }}
											href={item?.ProfileURL}
											target="_blank"
											rel="noreferrer">
											Click here
										</a>
									</span>
								</div>
								<div className={TalentListStyle.experience}>
									<span>Experience:</span>&nbsp;&nbsp;
									<span style={{ fontWeight: '500' }}>
										{_isNull(item?.TotalExpYears)
											? 'NA'
											: item?.TotalExpYears + ' years'}
									</span>
								</div>
								<div className={TalentListStyle.noticePeriod}>
									<span>Notice Period:</span>&nbsp;&nbsp;
									<span style={{ fontWeight: '500' }}>
										{_isNull(item?.NoticePeriod) ? 'NA' : item?.NoticePeriod}
									</span>
								</div>
								<div className={TalentListStyle.agreedShift}>
									<span>Agreed Shift:</span>&nbsp;&nbsp;
									<span style={{ fontWeight: '500' }}>
										{_isNull(item?.TalentTimeZone)
											? 'NA'
											: item?.TalentTimeZone}
									</span>
								</div>
								<div className={TalentListStyle.availability}>
									<span>Preferred Availability:</span>&nbsp;&nbsp;
									<span style={{ fontWeight: '500' }}>
										{_isNull(item?.PreferredAvailability)
											? 'NA'
											: item?.PreferredAvailability}
									</span>
								</div>
								<div className={TalentListStyle.profileSource}>
									<span>Profile Source:</span>&nbsp;&nbsp;
									<span style={{ fontWeight: '500' }}>
										{_isNull(item?.TalentSource) ? 'NA' : item?.TalentSource}
									</span>
								</div>
								<Divider
									style={{
										margin: '10px 0',
										// border: `1px solid var(--uplers-border-color)`,
									}}
								/>
								<div className={TalentListStyle.interviewStatus}>
									<span>Interview Status:</span>&nbsp;&nbsp;
									<span
										style={{ fontWeight: '500', cursor: 'pointer' }}
										onClick={() => {
											setInterviewStatus(true);
											setTalentIndex(listIndex);
										}}>
										{item?.InterviewStatus === ''
											? 'NA'
											: item?.InterviewStatus}
									</span>
								</div>
								<Divider
									style={{
										margin: '10px 0',
										// border: `1px solid var(--uplers-border-color)`,
									}}
								/>
								<div className={TalentListStyle.billRate}>
									<span>Bill Rate:</span>&nbsp;&nbsp;
									<span style={{ fontWeight: '500' }}>
										{_isNull(item?.BillRate) ? 'NA' : item?.BillRate}
									</span>
								</div>
								<div className={TalentListStyle.payRate}>
									<div>
										<span>Pay Rate:</span>&nbsp;&nbsp;
										<span style={{ fontWeight: '500' }}>
											{_isNull(item?.PayRate) ? 'NA' : item?.PayRate}
										</span>
									</div>
									<span
										style={{
											textDecoration: 'underline',
											color: `var(--background-color-ebony)`,
											cursor: 'pointer',
										}}>
										edit
									</span>
								</div>
								<div className={TalentListStyle.nr}>
									<div>
										<span>NR:</span>&nbsp;&nbsp;
										<span style={{ fontWeight: '500' }}>
											{_isNull(item?.NR) ? 'NA' : item?.NR}
										</span>
									</div>
									<span
										style={{
											textDecoration: 'underline',
											color: `var(--background-color-ebony)`,
											cursor: 'pointer',
										}}>
										edit
									</span>
								</div>
								<Divider
									style={{
										margin: '10px 0',
										// border: `1px solid var(--uplers-border-color)`,
									}}
								/>
								<div className={TalentListStyle.interviewSlots}>
									<span>Available Interview Slots:</span>&nbsp;&nbsp;
									<span style={{ fontWeight: '500' }}>
										{item?.Slotconfirmed ? (
											<>
												{item?.Slotconfirmed.split(' ')[0]}
												<RiArrowDropDownLine />
											</>
										) : (
											'NA'
										)}
									</span>
								</div>
								<div className={TalentListStyle.time}>
									<span>Time:</span>&nbsp;&nbsp;
									<span style={{ fontWeight: '500' }}>
										{item?.Slotconfirmed
											? item?.Slotconfirmed.split(' ')[1] +
											  ' - ' +
											  item?.Slotconfirmed.split(' ')[3]
											: 'NA'}
									</span>
								</div>
								<Divider
									style={{
										margin: '10px 0',
										// border: `1px solid var(--uplers-border-color)`,
									}}
								/>
								<div
									style={{
										padding: '2px 0',
										textDecoration: 'underline',
										cursor: 'pointer',
									}}
									onClick={() => {
										setVersantModal(true);
										setTalentIndex(listIndex);
									}}>
									Versant Test Results
								</div>

								<div style={{ padding: '2px 0', textDecoration: 'underline' }}>
									Skill Test Results
								</div>
								<Divider
									style={{
										margin: '10px 0',
									}}
								/>
								<div
									style={{
										position: 'absolute',
										marginTop: '10px',
										textAlign: 'start !important',
									}}>
									<HROperator
										title="Update kickoff & Onboard Status"
										icon={<AiOutlineDown />}
										backgroundColor={`var(--color-sunlight)`}
										iconBorder={`1px solid var(--color-sunlight)`}
										isDropdown={true}
										listItem={[
											{
												label: 'Schedule Interview',
												key: TalentOnboardStatus.SCHEDULE_INTERVIEW,
											},
											{
												label: 'Reschedule Interview',
												key: TalentOnboardStatus.RESCHEDULE_INTERVIEW,
											},
											{
												label: 'Talent Status',
												key: TalentOnboardStatus.TALENT_STATUS,
											},
											{
												label: 'Update kickoff & Onboard Status',
												key: TalentOnboardStatus.UPDATE_KICKOFF,
											},
										]}
										menuAction={(menuItem) => {
											switch (menuItem.key) {
												case TalentOnboardStatus.SCHEDULE_INTERVIEW: {
													/* if (
														hrUtils.handleScheduleInterview(
															item,
															miscData,
															HRStatusCode,
														)
													) {
														setScheduleInterviewModal(true);
														setTalentIndex(listIndex);
													} else {
														messageAPI.open({
															type: 'info',
															content:
																"Cann't schedule interview for this talent.",
														});
													}
													break; */
													setScheduleInterviewModal(true);
													setTalentIndex(listIndex);
													break;
												}
												case TalentOnboardStatus.RESCHEDULE_INTERVIEW: {
													/* if (
														hrUtils.handleScheduleInterview(item, HRStatusCode)
													) {
														setReScheduleInterviewModal(true);
														setTalentIndex(listIndex);
													} else {
														messageAPI.open({
															type: 'info',
															content:
																"Cann't Reschedule interview for this talent.",
														});
													} */
													setReScheduleInterviewModal(true);
													setTalentIndex(listIndex);
													break;
												}
												case TalentOnboardStatus.TALENT_STATUS: {
													if (hrUtils.handleTalentStatus(item, HRStatusCode)) {
														setTalentIndex(listIndex);
													} else {
														messageAPI.open({
															type: 'info',
															content: "Cann't see the talent status.",
														});
													}
													break;
												}
												case TalentOnboardStatus.UPDATE_KICKOFF: {
													if (
														hrUtils.handlerUpdateKickOff(item, HRStatusCode)
													) {
														setTalentIndex(listIndex);
													} else {
														messageAPI.open({
															type: 'info',
															content: "Cann't update the talent.",
														});
													}
													break;
												}
												default:
													break;
											}
										}}
									/>
								</div>
							</div>
						</div>
					</div>
				)}
			/>
			{/** ============ MODAL FOR PROFILE LOG ================ */}
			<Modal
				width="864px"
				centered
				footer={null}
				open={showProfileLogModal}
				// onOk={() => setVersantModal(false)}
				onCancel={() => setProfileLogModal(false)}>
				<h1>Profile Log</h1>
				{console.log(talentDetail[talentIndex])}
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						marginTop: '50px',
					}}>
					<div
						style={{
							display: 'flex',
							justifyContent: 'start',
							alignItems: 'center',
							gap: '16px',
							flexWrap: 'wrap',
						}}>
						<div
							style={{
								borderRadius: '8px',
								border: `1px solid var(--uplers-border-color)`,
								padding: '10px 30px',
							}}>
							<span>Name: </span>
							<span
								style={{
									fontWeight: 500,
									textDecoration: 'underline',
								}}>
								{talentDetail[talentIndex]?.Name}
							</span>
						</div>
						<div
							style={{
								borderRadius: '8px',
								border: `1px solid var(--uplers-border-color)`,
								padding: '10px 30px',
							}}>
							<span>Role:</span>
							<span
								style={{
									fontWeight: 500,
								}}>
								{talentDetail[talentIndex]?.TalentRole}
							</span>
						</div>
					</div>
					<div
						style={{
							padding: '1px 10px',
							borderRadius: '8px',
							backgroundColor: `var(--uplers-grey)`,
						}}>
						<ExportSVG />
					</div>
				</div>
				<Divider />
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}>
					<div className={TalentListStyle.profileDataContainer}>
						{profileData?.map((item, index) => {
							return (
								<div
									style={{
										backgroundColor: index === activeIndex && '#F5F5F5',
										border:
											index === activeIndex &&
											`1px solid ${profileData[activeIndex]?.activeColor}`,
									}}
									onClick={() =>
										onProfileLogClickHandler(item?.typeID, index, item?.typeID)
									}
									key={item.id}
									className={TalentListStyle.profileSets}>
									<span className={TalentListStyle.scoreValue}>
										{item?.score}
									</span>
									&nbsp;
									{item?.label}
								</div>
							);
						})}
					</div>
				</div>
			</Modal>
			{/** ============ MODAL FOR VERSANT SCORE ================ */}
			<Modal
				width="864px"
				centered
				footer={null}
				open={showVersantModal}
				// onOk={() => setVersantModal(false)}
				onCancel={() => setVersantModal(false)}>
				<h1>Versant Test Results</h1>
				<div
					style={{
						// border: '1px solid red',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						marginTop: '50px',
					}}>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							width: '60%',
							flexWrap: 'wrap',
						}}>
						<div
							style={{
								borderRadius: '8px',
								border: `1px solid var(--uplers-border-color)`,
								padding: '10px 30px',
							}}>
							<span>Name: </span>
							<span
								style={{
									fontWeight: 500,
									textDecoration: 'underline',
								}}>
								{talentDetail[talentIndex]?.Name}
							</span>
						</div>
						<div
							style={{
								borderRadius: '8px',
								border: `1px solid var(--uplers-border-color)`,
								padding: '10px 30px',
							}}>
							<span>Date of Test:</span>
							<span
								style={{
									fontWeight: 500,
								}}>
								10/09/2022
							</span>
						</div>
					</div>
					<div
						style={{
							padding: '1px 10px',
							borderRadius: '8px',
							backgroundColor: `var(--uplers-grey)`,
						}}>
						<ExportSVG />
					</div>
				</div>
				<Divider />
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}>
					<div style={{ width: '50%' }}>
						<div
							style={{
								fontWeight: '500',
								fontSize: '18px',
								textAlign: 'center',
							}}>
							Overall GSE Score
						</div>
					</div>
					<div></div>
				</div>
			</Modal>
			{/** ============ MODAL FOR RESCHEDULING INTERVIEW ================ */}
			<Modal
				transitionName=""
				width="930px"
				centered
				footer={null}
				open={showReScheduleInterviewModal}
				// onOk={() => setVersantModal(false)}
				onCancel={() => setReScheduleInterviewModal(false)}>
				<InterviewReschedule
					closeModal={() => setReScheduleInterviewModal(false)}
					talentName={talentDetail[talentIndex]?.Name}
				/>
			</Modal>
			{/** ============ MODAL FOR SCHEDULING INTERVIEW ================ */}
			<Modal
				transitionName=""
				width="930px"
				centered
				footer={null}
				open={showScheduleInterviewModal}
				// onOk={() => setVersantModal(false)}
				onCancel={() => setScheduleInterviewModal(false)}>
				<InterviewSchedule
					talentName={talentDetail[talentIndex]?.Name}
					closeModal={() => setScheduleInterviewModal(false)}
				/>
			</Modal>
			{/** ============ MODAL FOR INTERVIEW FEEDBACK STATUS ================ */}
			<Modal
				transitionName=""
				width="930px"
				centered
				footer={null}
				open={interviewStatus}
				// onOk={() => setVersantModal(false)}
				onCancel={() => setInterviewStatus(false)}>
				<InterviewFeedback />
			</Modal>
		</div>
	);
};

export default TalentList;
