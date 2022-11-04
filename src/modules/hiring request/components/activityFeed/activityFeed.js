import { InputType } from 'constants/application';
import ActivityFeedStyle from './activityFeed.module.css';
import { AiOutlineSearch } from 'react-icons/ai';
const ActivityFeed = ({ activityFeed }) => {
	console.log(activityFeed);
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
					{/* {activityFeed?.map((item) => {
						return <h1>{item?.ActionName}</h1>;
					})} */}
					{/* {activityFeed[0]?.ActionName} */}
				</div>
			</div>
			<div className={ActivityFeedStyle.activityFeedPost}></div>
		</div>
	);
};

export default ActivityFeed;
