import { InputType } from 'constants/application';
import ActivityFeedStyle from './activityFeed.module.css';
import { AiOutlineSearch } from 'react-icons/ai';
import { SlGraph } from 'react-icons/sl';
import React, { Fragment, useState, useMemo, Suspense } from 'react';
import { DateTimeUtils } from 'shared/utils/basic_utils';
import { Divider } from 'antd';
import { BsTag } from 'react-icons/bs';
import DOMPurify from 'dompurify';
import moment from 'moment';

const Editor = React.lazy(() => import('../textEditor/editor'));
const ActivityFeed = ({
	hrID,
	activityFeed,
	tagUsers,
	callActivityFeedAPI,
}) => {
	const [search, setSearch] = useState('');

	const sanitizer = DOMPurify.sanitize;
	const searchMemo = useMemo(() => {
		if (search) return search;
		else return activityFeed;
	}, [search, activityFeed]);

	const displayNotes = (notes) => {
		const notesTemplate = new DOMParser().parseFromString(notes, 'text/html');
		return notesTemplate.body;
	};

	return (
		<div className={ActivityFeedStyle.activityContainer}>
			<div className={ActivityFeedStyle.activityFeedHeading}>
				<div className={ActivityFeedStyle.activityLabel}>Activity Feed</div>
				<div className={ActivityFeedStyle.searchFilterSet}>
					<AiOutlineSearch style={{ fontSize: '20px', fontWeight: '800' }} />
					<input
						onChange={(e) => {
							let activityFilter = activityFeed.filter((item) => {
								return (
									item.ActionPerformedBy.toLowerCase().includes(
										e.target.value.toLowerCase(),
									) ||
									item.Remark.toLowerCase().includes(
										e.target.value.toLowerCase(),
									) ||
									item.ActionPerformedBy.toLowerCase().includes(
										e.target.value.toLowerCase(),
									) ||
									item.ActionName.toLowerCase().includes(
										e.target.value.toLowerCase(),
									)
								);
							});

							setSearch(activityFilter);
						}}
						type={InputType.TEXT}
						className={ActivityFeedStyle.searchInput}
						placeholder="Search Activity Feed"
					/>
				</div>
			</div>
			<div className={ActivityFeedStyle.activityFeedList}>
				<div className={ActivityFeedStyle.activityFeedListBody}>
					{searchMemo?.map((item, index) => {
						return (
							<Fragment key={index}>
								<div className={ActivityFeedStyle.activityFeedListItem}>
									<div className={ActivityFeedStyle.activityFeedTimeDetails}>
										<div>
											{moment(item?.ActionDate).format('DD/MM/YYYY')}
										</div>
										<div>
											{DateTimeUtils.getTimeFromString(item?.ActionDate)}
										</div>
									</div>
									<div className={ActivityFeedStyle.activityFeedActivities}>
										{item?.IsNotes === 0 ? (
											<div className={ActivityFeedStyle.profileStatus}>
												<span>
													{item?.DisplayName
														? item?.DisplayName
														: item?.ActionName}{' '}
												</span>
												<span>{item?.TalentName && ' for '}</span>
												<span
													style={{
														textDecoration: 'underline',
														fontWeight: '500',
													}}>
													{item?.TalentName}
												</span>
											</div>
										) : (
											<div className={ActivityFeedStyle.profileStatus}>
												<span style={{ fontWeight: '500' }}>Note from </span>
												<span
													style={{
														textDecoration: 'underline',
														fontWeight: '500',
													}}>
													{item?.ActionPerformedBy}
												</span>
											</div>
										)}
										<br />
										<div className={ActivityFeedStyle.activityAction} style={{display:'flex', justifyContent:'space-between', width:'100%' }}>
											<div>
												{item?.IsNotes ? <BsTag /> : <SlGraph />}
											&nbsp;&nbsp;
											<span style={{ fontWeight: '500' }}>
												{item?.IsNotes === 1
													? 'Assigned to : '
													: 'Action by : '}
											</span>
											<span>
												{item?.IsNotes === 1
													? item?.AssignedUsers
													: item?.ActionPerformedBy}
											</span>
											</div>
											
											<div>
											{item?.SLA_DueDate && <>
												<span style={{marginRight: '14px'}}></span>
											&nbsp;&nbsp;
											<span style={{ fontWeight: '500' }}>
											{'SLA Date : '}
											</span>
											<span>
												{moment(item?.SLA_DueDate).format('DD/MM/YYYY')}
											</span>
											</>
										
										}
											</div>
										</div>

										{item?.ActionName === "Interview Scheduled" && <div className={ActivityFeedStyle.activityAction}>
											<span style={{marginRight: '14px'}}></span>
										    &nbsp;&nbsp;
											<span style={{ fontWeight: '500' }}>
											{'Interview Scheduled : '}
											</span>
											<span>
												{item?.InterviewDateTime?.split('-').join('/')}
											</span>
										</div>}
										

										<br />
										{item?.Comments?<div className={ActivityFeedStyle.activityAction}>
											{item?.IsNotes ? <BsTag /> : <span style={{marginRight: '14px'}}></span>}
											&nbsp;&nbsp;
											<span style={{ fontWeight: '500' }}>
												{ item?.ActionName === "Talent Status Cancelled" ? "Cancel Reason : "  : item?.ActionName === "Talent Status On Hold" ? "Talent On Hold Reason : " :'Comments : '} 
											</span>
											&nbsp;
											<span>
											{item?.Comments}	
											</span>
										</div>:""}
										
										<br />
										<div className={ActivityFeedStyle.activityAction}>
										{item?.IsNotes === 0 && item?.ActionName === "Talent Status On Hold" && (<>
												<span style={{marginRight: '14px'}}></span>
												<span style={{ fontWeight: '500' }}>{'On Hold Remark : '}</span>
												<span >
													{item?.Remark &&   item?.Remark }
												</span></>
											)}
											{item?.IsNotes === 0 && item?.ActionName === "Talent Status Rejected" && (<>
												<span style={{marginRight: '14px'}}></span>
												<span style={{ fontWeight: '500' }}>{'Reject Remark : '}</span>
												<span >
													{item?.Remark &&   item?.Remark }
												</span></>
											)}
											{item?.Remark && (<>
												<span style={{marginRight: '14px'}}></span>
												<span style={{ fontWeight: '500' }}>{'Remark : '}</span>
												<span >
													{item?.Remark &&   item?.Remark }
												</span></>
											)}
											{item?.IsNotes === 1 && (
												<span
													dangerouslySetInnerHTML={{
														__html: sanitizer(
															displayNotes(item?.ActionName).innerHTML,
														),
													}}></span>
											)}
										</div>
									</div>
								</div>
								{index < activityFeed.length - 1 && <Divider />}
							</Fragment>
						);
					})}
				</div>
			</div>
			<Suspense>
				<div style={{ position: 'relative' }}>
					<Editor
						tagUsers={tagUsers && tagUsers}
						hrID={hrID}
						callActivityFeedAPI={callActivityFeedAPI}
					/>
				</div>
			</Suspense>
			<br />
		</div>
	);
};

export default ActivityFeed;
