import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ReactComponent as CloseSVG } from 'assets/svg/close.svg';
import { ReactComponent as CalenderSVG } from 'assets/svg/calender.svg';
import ProfileStyle from './profile.module.css';
import { useCallback, useState, useEffect } from 'react';
import { hiringRequestDAO } from 'core/hiringRequest/hiringRequestDAO';
import { ProfileLog } from 'constants/application';
import { Skeleton } from 'antd';
import { _isNull } from 'shared/utils/basic_utils';
import { All_Hiring_Request_Utils } from 'shared/utils/all_hiring_request_util';
import { HTTPStatusCode } from 'constants/network';

export const ShowProfileLog = ({ talentID, handleClose }) => {
	const [profileLog, setProfileLog] = useState(null);
	const [activeIndex, setActiveIndex] = useState(-1);
	const [typeId, setTypeId] = useState(0);
	const [activeType, setActiveType] = useState(null);
	const [logExpanded, setLogExpanded] = useState(null);
	// const [calenderFilter, setCalenderFilter] = useState({});
	/* const getTechScore = useCallback(async () => {
		const response = await hiringRequestDAO.getTalentTechScoreDAO(talentID);
		setProfileLog(response && response?.responseBody?.details);
	}, [talentID]); */

	const getTalentProfileLogHandler = useCallback(async () => {
		let response = await hiringRequestDAO.getTalentProfileLogDAO({
			talentid: talentID,
			fromDate: null,
			toDate: null,
		});
		setProfileLog(response && response?.responseBody?.details);
	}, [talentID]);
	useEffect(() => {
		// getTechScore();
		getTalentProfileLogHandler();
	}, [getTalentProfileLogHandler]);

	const profileData = [
		{
			id: 'profileShared',
			score: profileLog?.length === 0 ? 0 : profileLog?.profileSharedCount,
			label: 'Profile Shared',
			activeColor: `var(--color-purple)`,
			typeID: ProfileLog.PROFILE_SHARED,
		},
		{
			id: 'feedback',
			score: profileLog?.length === 0 ? 0 : profileLog?.feedbackCount,
			label: 'Feedback Received',
			activeColor: `var(--color-cyan)`,
			typeID: ProfileLog.FEEDBACK,
		},
		{
			id: 'rejected',
			score: profileLog?.length === 0 ? 0 : profileLog?.rejectedCount,
			label: 'Rejected',
			activeColor: `var(--color-danger)`,
			typeID: ProfileLog.REJECTED,
		},
		{
			id: 'selected',
			score: profileLog?.length === 0 ? 0 : profileLog?.selectedForCount,
			label: 'Selected For',
			activeColor: `var(--color-success)`,
			typeID: ProfileLog.SELECTED,
		},
	];

	/*--------- React DatePicker ---------------- */
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);

	const onProfileLogClickHandler = useCallback(
		async (typeID, index, type, start = null, end = null) => {
			setLogExpanded([]);
			setTypeId(typeID);
			setActiveIndex(index);
			setActiveType(type);

			let profileObj = {
				talentID: talentID,
				typeID: typeID,
				fromDate: !!start && new Date(start).toLocaleDateString('en-US'),
				toDate: !!end && new Date(end).toLocaleDateString('en-US'),
			};

			const response = await hiringRequestDAO.getTalentProfileSharedDetailDAO(
				profileObj,
			);
			if (response?.statusCode === HTTPStatusCode.OK) {
				setLogExpanded(response && response?.responseBody?.details);
				// setProfileLog()
			}
			if (response?.statusCode === HTTPStatusCode.NOT_FOUND) {
				setLogExpanded([]);
				setProfileLog([]);
			}
		},
		[talentID],
	);

	const onCalenderFilter = useCallback(
		(dates) => {
			const [start, end] = dates;
			setStartDate(start);
			setEndDate(end);
			if (start && end) {
				onProfileLogClickHandler(typeId, activeIndex, activeType, start, end);
			}
		},
		[activeIndex, activeType, onProfileLogClickHandler, typeId],
	);

	return (
		<div className={ProfileStyle.profileContainer}>
			<div className={ProfileStyle.flexStart}>
				<div className={ProfileStyle.profileBody}>
					<>
						<div className={ProfileStyle.profileNameContainer}>
							<span className={ProfileStyle.label}>Name:</span>
							&nbsp;&nbsp;
							<span className={ProfileStyle.value}>
								{profileLog?.talentName}
							</span>
						</div>
						<div className={ProfileStyle.attemptsContainer}>
							<span className={ProfileStyle.label}>Role:</span>
							&nbsp;&nbsp;
							<span className={ProfileStyle.value}>
								{profileLog?.talentRole}
							</span>
						</div>
					</>
					<div className={ProfileStyle.calendarFilterSet}>
						<div className={ProfileStyle.label}>Date</div>
						<div className={ProfileStyle.calendarFilter}>
							<CalenderSVG style={{ height: '16px', marginRight: '16px' }} />
							<DatePicker
								style={{ backgroundColor: 'red' }}
								onKeyDown={(e) => {
									e.preventDefault();
									e.stopPropagation();
								}}
								className={ProfileStyle.dateFilter}
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

				<CloseSVG
					onClick={handleClose}
					style={{ marginTop: '16px', marginRight: '16px' }}
				/>
			</div>
			<hr style={{ border: `1px solid var(--uplers-grey)`, margin: 0 }} />
			<div className={ProfileStyle.profileDataContainer}>
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
								item?.score > 0 &&
								onProfileLogClickHandler(item?.typeID, index, item?.typeID)
							}
							key={item.id}
							className={ProfileStyle.profileSets}>
							<span className={ProfileStyle.scoreValue}>{item?.score}</span>
							&nbsp;
							{item?.label}
						</div>
					);
				})}
			</div>
			{activeIndex < 0 ? (
				<div className={ProfileStyle.stages}>
					Select the stages to view their HRs
				</div>
			) : (
				<>
					<ProfileLogTable
						activeType={activeType}
						logExpanded={logExpanded}
						borderColor={profileData[activeIndex]?.activeColor}
					/>
					<br />
				</>
			)}
		</div>
	);
};

const ProfileLogTable = ({ borderColor, logExpanded, activeType }) => {
	return (
		<div
			className={ProfileStyle.matchmakingTable}
			style={{ border: `1px solid ${borderColor}`, borderRadius: '8px' }}>
			<table className={ProfileStyle.table}>
				<thead>
					<tr>
						<th className={ProfileStyle.th}>No.</th>
						<th className={ProfileStyle.th}>HR ID</th>
						<th className={ProfileStyle.th}>Position</th>
						<th className={ProfileStyle.th}>Company</th>
						{activeType === ProfileLog.FEEDBACK && (
							<th className={ProfileStyle.th}>Status</th>
						)}
						{activeType === ProfileLog.REJECTED && (
							<th className={ProfileStyle.th}>Status</th>
						)}
						{activeType === ProfileLog.SELECTED ? (
							<th className={ProfileStyle.th}>Status</th>
						) : (
							<th className={ProfileStyle.th}>Date</th>
						)}
					</tr>
				</thead>
				<tbody>
					{logExpanded === null ? (
						<Skeleton style={{ width: '100%' }} />
					) : _isNull(logExpanded) ? (
						<tr>
							<td colSpan={5}>No data found.</td>
						</tr>
					) : (
						logExpanded?.map((item, index) => {
							// console.log(item, '--item');
							return (
								<tr>
									<td className={ProfileStyle.td}>HR {index + 1}</td>
									<td className={ProfileStyle.td}>{item?.hrid}</td>
									<td className={ProfileStyle.td}>{item?.position}</td>
									<td className={ProfileStyle.td}>{item?.company}</td>
									{activeType === ProfileLog.FEEDBACK && (
										<td className={ProfileStyle.td}>{item?.talentStatus}</td>
									)}
									{activeType === ProfileLog.REJECTED && (
										<td className={ProfileStyle.td}>{item?.talentStatus}</td>
									)}
									{activeType === ProfileLog.SELECTED ? (
										<td className={ProfileStyle.td}>
											{/* {All_Hiring_Request_Utils.GETTALENTSTATUS(
												item?.frontStatusID,
												item?.talentStatus,
											)} */}
											{item?.talentStatus}
										</td>
									) : (
										<td className={ProfileStyle.td}>{item?.sDate}</td>
									)}
								</tr>
							);
						})
					)}
				</tbody>
			</table>
		</div>
	);
};
