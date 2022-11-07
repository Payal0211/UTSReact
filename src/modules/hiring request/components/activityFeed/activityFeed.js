import { InputType } from 'constants/application';
import ActivityFeedStyle from './activityFeed.module.css';
import { AiOutlineSearch } from 'react-icons/ai';
import { SlGraph } from 'react-icons/sl';
import { IoMdSend } from 'react-icons/io';
import { Fragment } from 'react';
const ActivityFeed = ({ activityFeed }) => {
	console.log('-activityFeed----', activityFeed);
	return (
		<div className={ActivityFeedStyle.activityContainer}>
			<div className={ActivityFeedStyle.activityFeedHeading}>
				<div className={ActivityFeedStyle.activityLabel}>Activity Feed</div>
				<div className={ActivityFeedStyle.searchFilterSet}>
					<AiOutlineSearch style={{ fontSize: '20px', fontWeight: '800' }} />
					<input
						type={InputType.TEXT}
						className={ActivityFeedStyle.searchInput}
						placeholder="Search Activity Feed"
					/>
				</div>
			</div>
			<div className={ActivityFeedStyle.activityFeedList}>
				<div className={ActivityFeedStyle.activityFeedListBody}>
					{activityFeed &&
						activityFeed?.map((item, index) => {
							return (
								<Fragment key={index}>
									<div className={ActivityFeedStyle.activityFeedListItem}>
										<div className={ActivityFeedStyle.activityFeedTimeDetails}>
											<div>1</div>
											<div>2</div>
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
												<SlGraph />
												&nbsp;&nbsp;
												<span>Action by: </span>
												<span>{item?.ActionPerformedBy}</span>
											</div>
										</div>
									</div>
									{index < activityFeed.length - 1 && (
										<hr
											style={{
												borderTop: `1px solid var(--uplers-border-color)`,
											}}
										/>
									)}
								</Fragment>
							);
						})}
				</div>
			</div>
			<div className={ActivityFeedStyle.activityFeedPost}>
				<div className={ActivityFeedStyle.activityFeedPostBody}>
					<img
						src="https://www.w3schools.com/howto/img_avatar.png"
						className={ActivityFeedStyle.avatar}
						alt="avatar"
					/>
					<input
						className={ActivityFeedStyle.commentBox}
						type={InputType.TEXT}
						placeholder="Comment on this thread by typing here or mention someone with @..."
					/>
					<IoMdSend
						style={{
							fontSize: '30px',
							color: `var(--background-color-ebony)`,
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default ActivityFeed;
