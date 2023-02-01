import { Dropdown, Menu, Divider, List, Modal } from 'antd';
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

const TalentList = ({ talentDetail }) => {
	const [showVersantModal, setVersantModal] = useState(false);
	const [interviewStatus, setInterviewStatus] = useState(false);
	const [showReScheduleInterviewModal, setReScheduleInterviewModal] =
		useState(false);
	const [showScheduleInterviewModal, setScheduleInterviewModal] =
		useState(false);

	const [talentIndex, setTalentIndex] = useState(0);
	return (
		<div>
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
						{/* {console.log('item.name', item?.Name, '--And--', listIndex)} */}
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
													top: '-10px',
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
													<Menu.Item key={0}>View Profile Log</Menu.Item>
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
											target="_blank">
											Click here
										</a>
									</span>
								</div>
								<div className={TalentListStyle.experience}>
									<span>Experience:</span>&nbsp;&nbsp;
									<span style={{ fontWeight: '500' }}>
										{item?.TotalExpYears} years
									</span>
								</div>
								<div className={TalentListStyle.noticePeriod}>
									<span>Notice Period:</span>&nbsp;&nbsp;
									<span style={{ fontWeight: '500' }}>
										{item?.NoticePeriod}
									</span>
								</div>
								<div className={TalentListStyle.agreedShift}>
									<span>Agreed Shift:</span>&nbsp;&nbsp;
									<span style={{ fontWeight: '500' }}>
										{item?.TalentTimeZone}
									</span>
								</div>
								<div className={TalentListStyle.availability}>
									<span>Preferred Availability:</span>&nbsp;&nbsp;
									<span style={{ fontWeight: '500' }}>
										{item?.PreferredAvailability}
									</span>
								</div>
								<div className={TalentListStyle.profileSource}>
									<span>Profile Source:</span>&nbsp;&nbsp;
									<span style={{ fontWeight: '500' }}>
										{item?.TalentSource}
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
									<span style={{ fontWeight: '500' }}>{item?.BillRate}</span>
								</div>
								<div className={TalentListStyle.payRate}>
									<div>
										<span>Pay Rate:</span>&nbsp;&nbsp;
										<span style={{ fontWeight: '500' }}>{item?.PayRate}</span>
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
										<span style={{ fontWeight: '500' }}>{item?.NR}</span>
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
										{item?.Slotconfirmed
											? item?.Slotconfirmed.split(' ')[0]
											: 'not scheduled'}
									</span>
									<RiArrowDropDownLine />
								</div>
								<div className={TalentListStyle.time}>
									<span>Time:</span>&nbsp;&nbsp;
									<span style={{ fontWeight: '500' }}>
										{item?.Slotconfirmed
											? item?.Slotconfirmed.split(' ')[1] +
											  ' - ' +
											  item?.Slotconfirmed.split(' ')[3]
											: 'not scheduled'}
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
										]}
										menuAction={(item) => {
											switch (item.key) {
												case TalentOnboardStatus.SCHEDULE_INTERVIEW: {
													setScheduleInterviewModal(true);
													setTalentIndex(listIndex);
													break;
												}
												case TalentOnboardStatus.RESCHEDULE_INTERVIEW: {
													setReScheduleInterviewModal(true);
													setTalentIndex(listIndex);
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
