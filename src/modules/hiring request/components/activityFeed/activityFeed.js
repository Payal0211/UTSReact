import { InputType } from 'constants/application';
import ActivityFeedStyle from './activityFeed.module.css';
import { AiOutlineSearch } from 'react-icons/ai';
import { SlGraph } from 'react-icons/sl';
import React, { Fragment, useState, useMemo, Suspense } from 'react';
import { DateTimeUtils } from 'shared/utils/basic_utils';
import { Divider } from 'antd';
import { BsTag } from 'react-icons/bs';

const Editor = React.lazy(() => import('../textEditor/editor'));
const ActivityFeed = ({
	hrID,
	activityFeed,
	tagUsers,
	callActivityFeedAPI,
}) => {
	const [search, setSearch] = useState('');
	console.log(activityFeed, '--activityFeed--');
	const searchMemo = useMemo(() => {
		if (search) return search;
		else return activityFeed;
	}, [search, activityFeed]);

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
											{DateTimeUtils.getDateFromString(item?.ActionDate)}
										</div>
										<div>
											{DateTimeUtils.getTimeFromString(item?.ActionDate)}
										</div>
									</div>
									<div className={ActivityFeedStyle.activityFeedActivities}>
										<div className={ActivityFeedStyle.profileStatus}>
											<span>{item?.ActionName} for </span>
											<span
												style={{
													textDecoration: 'underline',
													fontWeight: '500',
												}}>
												{item?.TalentName}
											</span>
										</div>
										<br />
										<div className={ActivityFeedStyle.activityAction}>
											{item?.IsNotes ? <BsTag /> : <SlGraph />}
											&nbsp;&nbsp;
											<span>
												{item?.IsNotes ? 'Assigned to' : 'Action by:'}{' '}
											</span>
											<span>{item?.ActionPerformedBy}</span>
										</div>

										{item?.Remark && (
											<>
												<br />
												<div className={ActivityFeedStyle.activityAction}>
													<span style={{ fontWeight: '500' }}>
														“ {item?.Remark} ”
													</span>
												</div>
											</>
										)}
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
